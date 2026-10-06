import { createHash } from 'node:crypto'
import { mkdir, readdir, rm, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = process.cwd()
const sourcesRoot = path.join(root, 'assets', 'sources')
const publicRoot = path.join(root, 'public')
const manifestPath = path.join(root, 'content', 'image-assets.generated.ts')

const paintings = [
  'garden-of-earthly-delights',
  'the-dog',
  'self-portrait-straw-hat',
  'penitent-magdalene',
  'las-meninas',
  'night-watch',
  'saturn',
  'the-colossus',
  'tower-of-babel',
]
const branding = ['leiden', 'udp', 'ocpsg']
const profiles = {
  profile: { width: 660, quality: 95 },
  paintings: { widths: [640, 960, 1440, 1800], quality: 95 },
  branding: { width: 168, lossless: true },
}

function fingerprint(buffer) {
  return createHash('sha256').update(buffer).digest('hex').slice(0, 12)
}

async function validateSourceDirectory(folder, expected) {
  const directory = path.join(sourcesRoot, folder)
  const entries = await readdir(directory, { withFileTypes: true })
  const actual = entries.filter((entry) => entry.isFile()).map((entry) => entry.name).sort()
  const want = [...expected].sort()
  if (actual.join('\n') !== want.join('\n')) {
    throw new Error(
      `Unexpected sources in assets/sources/${folder}. Expected: ${want.join(', ')}. Found: ${actual.join(', ')}.`
    )
  }
}

async function generatedFolder(folder) {
  const location = path.join(publicRoot, folder, 'generated')
  await rm(location, { recursive: true, force: true })
  await mkdir(location, { recursive: true })
  return location
}

async function saveWebp(directory, slug, buffer) {
  const filename = `${slug}-${fingerprint(buffer)}.webp`
  await writeFile(path.join(directory, filename), buffer)
  return filename
}

async function makeProfile() {
  await validateSourceDirectory('profile', ['avatar.png'])
  const source = path.join(sourcesRoot, 'profile', 'avatar.png')
  const directory = await generatedFolder('profile')
  const { data, info } = await sharp(source)
    .rotate()
    .resize({
      width: profiles.profile.width,
      height: profiles.profile.width,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: profiles.profile.quality, effort: 6 })
    .toBuffer({ resolveWithObject: true })
  const filename = await saveWebp(directory, 'portrait', data)
  return { src: `/profile/generated/${filename}`, width: info.width, height: info.height }
}

async function makePaintings() {
  await validateSourceDirectory('paintings', paintings.map((slug) => `${slug}.jpg`))
  const directory = await generatedFolder('paintings')
  const images = {}
  for (const slug of paintings) {
    const source = path.join(sourcesRoot, 'paintings', `${slug}.jpg`)
    const sourceInfo = await sharp(source).metadata()
    if (!sourceInfo.width || !sourceInfo.height) throw new Error(`No image dimensions for ${slug}`)
    const widths = [...new Set([
      ...profiles.paintings.widths.filter((width) => width < sourceInfo.width),
      Math.min(profiles.paintings.widths.at(-1), sourceInfo.width),
    ])].sort((a, b) => a - b)
    const variants = []
    for (const width of widths) {
      const { data, info } = await sharp(source)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: profiles.paintings.quality, effort: 6 })
        .toBuffer({ resolveWithObject: true })
      const filename = await saveWebp(directory, `${slug}-${info.width}w`, data)
      variants.push({ src: `/paintings/generated/${filename}`, width: info.width })
    }
    const largest = variants.at(-1)
    images[slug] = {
      src: largest.src,
      srcSet: variants.map(({ src, width }) => `${src} ${width}w`).join(', '),
    }
  }
  return images
}

async function makeBranding() {
  await validateSourceDirectory('branding', branding.map((slug) => `${slug}.png`))
  const directory = await generatedFolder('branding')
  const images = {}
  for (const slug of branding) {
    const source = path.join(sourcesRoot, 'branding', `${slug}.png`)
    const buffer = await sharp(source)
      .rotate()
      .resize({
        width: profiles.branding.width,
        height: profiles.branding.width,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ lossless: true, effort: 6 })
      .toBuffer()
    const filename = await saveWebp(directory, slug, buffer)
    images[slug] = `/branding/generated/${filename}`
  }
  return images
}

// Inspect the actual generated files, not just their source metadata or filenames.
async function inspectWebp(src, expectedMaxWidth) {
  const filename = path.join(publicRoot, src.replace(/^\\//, ''))
  const metadata = await sharp(filename).metadata()
  if (metadata.format !== 'webp' || !metadata.width || !metadata.height) {
    throw new Error(`Generated image is not a valid WebP: ${src}`)
  }
  if (metadata.width > expectedMaxWidth) {
    throw new Error(`Generated image exceeds ${expectedMaxWidth}px: ${src}`)
  }
  return {
    ...metadata,
    bytes: (await stat(filename)).size,
  }
}

async function auditOutputs({ profile, paintings, branding }) {
  const portrait = await inspectWebp(profile.src, profiles.profile.width)
  if (portrait.width !== profile.width || portrait.height !== profile.height) {
    throw new Error('Generated portrait dimensions disagree with the manifest.')
  }

  let paintingCount = 0
  let paintingBytes = 0
  for (const slug of paintingsSlugs()) {
    const output = paintings[slug]
    if (!output) throw new Error(`Missing painting from generated manifest: ${slug}`)
    const variants = output.srcSet.split(', ')
    let lastWidth = 0
    for (const entry of variants) {
      const match = /^(\\S+) (\\d+)w$/.exec(entry)
      if (!match) throw new Error(`Invalid generated srcSet candidate: ${entry}`)
      const [, src, widthText] = match
      const width = Number(widthText)
      const info = await inspectWebp(src, profiles.paintings.widths.at(-1))
      if (info.width !== width || width <= lastWidth) {
        throw new Error(`Inconsistent responsive painting widths for ${slug}`)
      }
      lastWidth = width
      paintingBytes += info.bytes
      paintingCount++
    }
    if (!output.srcSet.endsWith(`${output.src} ${lastWidth}w`)) {
      throw new Error(`Painting default image is not its largest variant: ${slug}`)
    }
  }

  let brandingBytes = 0
  for (const slug of brandingSlugs()) {
    const src = branding[slug]
    if (!src) throw new Error(`Missing branding from generated manifest: ${slug}`)
    brandingBytes += (await inspectWebp(src, profiles.branding.width)).bytes
  }

  // Source Leiden PNG has transparent corners. Lossless conversion must retain them.
  const leidenOutput = path.join(publicRoot, branding.leiden.replace(/^\\//, ''))
  const leidenMetadata = await sharp(leidenOutput).metadata()
  const leidenStats = await sharp(leidenOutput).stats()
  if (!leidenMetadata.hasAlpha || leidenStats.channels.length < 4 ||
      leidenStats.channels[3].min !== 0) {
    throw new Error('Generated Leiden logo has lost its transparent background.')
  }

  const kib = (size) => (size / 1024).toFixed(1)
  console.log(
    `Verified generated WebP: portrait ${kib(portrait.bytes)} KiB; ` +
    `${paintingCount} painting variants ${kib(paintingBytes)} KiB total; ` +
    `${brandingSlugs().length} lossless logos ${kib(brandingBytes)} KiB total; ` +
    'Leiden transparency preserved.'
  )
}

function paintingsSlugs() { return paintings }
function brandingSlugs() { return branding }

const [profile, paintingImages, brandingImages] = await Promise.all([
  makeProfile(),
  makePaintings(),
  makeBranding(),
])

const assetManifest = {
  profile,
  paintings: paintingImages,
  branding: brandingImages,
}
const manifest = `// Generated by scripts/build-images.mjs. Do not edit.
// Regenerate with npm run assets:build.

export type GeneratedImageAssets = {
  profile: { src: string; width: number; height: number }
  paintings: Record<string, { src: string; srcSet: string }>
  branding: Record<string, string>
}

export const imageAssets: GeneratedImageAssets = ${JSON.stringify(assetManifest, null, 2)}
`
await writeFile(manifestPath, manifest, 'utf8')
await auditOutputs(assetManifest)
console.log(
  `Generated high-quality WebP assets: 1 portrait, ${paintings.length} paintings, and ${branding.length} branding logos.`
)
