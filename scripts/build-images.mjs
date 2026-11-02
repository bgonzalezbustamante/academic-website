import { createHash } from 'node:crypto'
import { mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
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
  figures: { widths: [640, 960, 1440, 1800], quality: 95 },
  logos: { width: 400, quality: 95 },
}

// Project and publication-highlight figures, keyed by the Dashboard's
// <family>/<slug>/<filename> convention; logos serve funders and teaching.
const figureFamilies = ['projects', 'publication-highlights']
const imageExtensions = new Set(['.png', '.jpg', '.jpeg'])
// Keep lossless WebP unless it is this much larger than the quality-95 encoding.
const losslessTolerance = 1.25
// Widest unresized source a figure may serve as its largest variant.
const nativeWidthLimit = 2400
// Bump to invalidate cached figure and logo outputs after an encoding change.
const encoderVersion = 3
const figureSettings = JSON.parse(
  await readFile(path.join(sourcesRoot, 'figures.json'), 'utf8')
)

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

async function listSourceImages(folder) {
  const directory = path.join(sourcesRoot, folder)
  const entries = await readdir(directory, { recursive: true, withFileTypes: true })
  return entries
    .filter((entry) => entry.isFile() && imageExtensions.has(path.extname(entry.name).toLowerCase()))
    .map((entry) =>
      path.relative(sourcesRoot, path.join(entry.parentPath, entry.name)).split(path.sep).join('/')
    )
    .sort()
}

function renderLocalImage(buffer, resize, sharpen) {
  const pipeline = sharp(buffer).rotate().resize(resize)
  return sharpen ? pipeline.sharpen({ sigma: sharpen }) : pipeline
}

function encodeWebp(buffer, resize, sharpen, quality, lossless) {
  return renderLocalImage(buffer, resize, sharpen)
    .webp(lossless ? { lossless: true, effort: 6 } : { quality, effort: 6 })
    .toBuffer({ resolveWithObject: true })
}

// PNG figures and logos stay lossless unless that is much heavier than quality 95.
async function encodeLocalImage(buffer, format, resize, sharpen, quality) {
  const lossy = await encodeWebp(buffer, resize, sharpen, quality, false)
  if (format !== 'png') return { ...lossy, lossless: false }

  const lossless = await encodeWebp(buffer, resize, sharpen, quality, true)
  return lossless.data.length <= lossy.data.length * losslessTolerance
    ? { ...lossless, lossless: true }
    : { ...lossy, lossless: false }
}

// Flat-colour and palette PNGs often compress far better unresized, so the largest
// figure keeps the source's own pixels (up to nativeWidthLimit) when that exact
// lossless copy is no heavier than the 1800px encoding.
async function encodeLargestFigure(buffer, metadata, sharpen) {
  const quality = profiles.figures.quality
  const capped = Math.min(profiles.figures.widths.at(-1), metadata.width)
  const best = await encodeLocalImage(
    buffer,
    metadata.format,
    { width: capped, withoutEnlargement: true },
    sharpen,
    quality
  )
  if (metadata.format !== 'png' || metadata.width <= capped || metadata.width > nativeWidthLimit) {
    return best
  }

  const exact = await encodeWebp(buffer, { width: metadata.width }, sharpen, quality, true)
  return exact.data.length <= best.data.length ? { ...exact, lossless: true } : best
}

async function hasTransparency(buffer) {
  const metadata = await sharp(buffer).metadata()
  if (!metadata.hasAlpha) return false
  const stats = await sharp(buffer).stats()
  return stats.channels[3].min < 255
}

// Unlike the fixed portrait/painting sets, these outputs are cached by content and
// settings so the scan before every dev, check and build stays fast.
async function cachedOutput(directory, used, filename, encode) {
  const location = path.join(directory, filename)
  used.add(filename)
  try {
    const metadata = await sharp(location).metadata()
    return { width: metadata.width, height: metadata.height }
  } catch {
    const { data, info } = await encode()
    await writeFile(location, data)
    return { width: info.width, height: info.height }
  }
}

async function removeUnused(directory, used) {
  for (const filename of await readdir(directory)) {
    if (!used.has(filename)) await rm(path.join(directory, filename))
  }
}

async function makeFigures() {
  const figures = {}
  let bytes = 0
  let variantCount = 0

  for (const family of figureFamilies) {
    const directory = path.join(publicRoot, family, 'generated')
    await mkdir(directory, { recursive: true })
    const used = new Set()

    for (const key of await listSourceImages(family)) {
      const buffer = await readFile(path.join(sourcesRoot, key))
      const metadata = await sharp(buffer).metadata()
      if (!metadata.width || !metadata.height) throw new Error(`No image dimensions for ${key}`)
      const sharpen = figureSettings.sharpen?.[key] ?? null
      const hash = fingerprint(Buffer.concat([
        buffer,
        Buffer.from(JSON.stringify({ encoderVersion, sharpen, ...profiles.figures, nativeWidthLimit })),
      ]))
      const name = path.basename(key, path.extname(key)).replace(/[^A-Za-z0-9_-]/g, '-')
      const prefix = `${name}-${hash}-`

      // Variant widths depend on the encoding chosen, so the cache is keyed by prefix.
      let outputs = (await readdir(directory)).filter(
        (filename) => filename.startsWith(prefix) && filename.endsWith('w.webp')
      )
      if (outputs.length === 0) {
        const transparent = await hasTransparency(buffer)
        const largest = await encodeLargestFigure(buffer, metadata, sharpen)
        const encodings = [largest]
        for (const width of profiles.figures.widths.filter((width) => width < largest.info.width)) {
          encodings.push(await encodeLocalImage(
            buffer,
            metadata.format,
            { width, withoutEnlargement: true },
            sharpen,
            profiles.figures.quality
          ))
        }
        // A smaller variant is only worth offering when it is also lighter.
        const lighter = []
        for (const encoding of encodings.sort((a, b) => b.info.width - a.info.width)) {
          if (lighter.every(({ data }) => encoding.data.length < data.length)) {
            lighter.push(encoding)
          }
        }
        outputs = []
        for (const { data, info } of lighter) {
          if (transparent && !(await hasTransparency(data))) {
            throw new Error(`Generated figure lost its transparency: ${key}`)
          }
          const filename = `${prefix}${info.width}w.webp`
          await writeFile(path.join(directory, filename), data)
          outputs.push(filename)
        }
      }

      const variants = []
      for (const filename of outputs) {
        used.add(filename)
        const location = path.join(directory, filename)
        const output = await sharp(location).metadata()
        bytes += (await stat(location)).size
        variantCount++
        variants.push({
          src: `/${family}/generated/${filename}`,
          width: output.width,
          height: output.height,
        })
      }
      variants.sort((a, b) => a.width - b.width)

      const largest = variants.at(-1)
      figures[key] = {
        src: largest.src,
        srcSet: variants.map(({ src, width }) => `${src} ${width}w`).join(', '),
        width: largest.width,
        height: largest.height,
      }
    }

    await removeUnused(directory, used)
  }

  for (const [alias, target] of Object.entries(figureSettings.aliases ?? {})) {
    if (!figures[target]) throw new Error(`Figure alias ${alias} points to a missing source: ${target}`)
    if (figures[alias]) throw new Error(`Figure alias ${alias} duplicates an existing source.`)
    figures[alias] = figures[target]
  }

  return { figures, bytes, variantCount }
}

async function makeLogos() {
  const directory = path.join(publicRoot, 'logos', 'generated')
  await mkdir(directory, { recursive: true })
  const used = new Set()
  const logos = {}
  let bytes = 0

  for (const key of await listSourceImages('logos')) {
    const buffer = await readFile(path.join(sourcesRoot, key))
    const metadata = await sharp(buffer).metadata()
    const resize = {
      width: profiles.logos.width,
      height: profiles.logos.width,
      fit: 'inside',
      withoutEnlargement: true,
    }
    const hash = fingerprint(Buffer.concat([
      buffer,
      Buffer.from(JSON.stringify({ encoderVersion, resize, quality: profiles.logos.quality })),
    ]))
    const filename = path.basename(key)
    const name = path.basename(key, path.extname(key)).replace(/[^A-Za-z0-9_-]/g, '-')
    const output = await cachedOutput(directory, used, `${name}-${hash}.webp`, () =>
      encodeLocalImage(buffer, metadata.format, resize, null, profiles.logos.quality)
    )
    bytes += (await stat(path.join(directory, `${name}-${hash}.webp`))).size
    logos[filename] = { src: `/logos/generated/${name}-${hash}.webp`, ...output }
  }

  await removeUnused(directory, used)
  return { logos, bytes }
}

// Inspect the actual generated files, not just their source metadata or filenames.
async function inspectWebp(src, expectedMaxWidth) {
  const filename = path.join(publicRoot, src.slice(1))
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
      const [src, widthToken] = entry.split(' ')
      const width = Number(widthToken?.slice(0, -1))
      if (!src?.startsWith('/') || !widthToken?.endsWith('w') ||
          !Number.isInteger(width) || width <= 0) {
        throw new Error(`Invalid generated srcSet candidate: ${entry}`)
      }
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
  const leidenOutput = path.join(publicRoot, branding.leiden.slice(1))
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

async function auditLocalImages(figures, logos) {
  for (const [key, figure] of Object.entries(figures)) {
    for (const entry of figure.srcSet.split(', ')) {
      const [src, widthToken] = entry.split(' ')
      const info = await inspectWebp(src, nativeWidthLimit)
      if (`${info.width}w` !== widthToken) {
        throw new Error(`Inconsistent responsive figure widths for ${key}`)
      }
    }
  }
  for (const logo of Object.values(logos)) {
    await inspectWebp(logo.src, profiles.logos.width)
  }
}

const [profile, paintingImages, brandingImages, figureImages, logoImages] = await Promise.all([
  makeProfile(),
  makePaintings(),
  makeBranding(),
  makeFigures(),
  makeLogos(),
])

const assetManifest = {
  profile,
  paintings: paintingImages,
  branding: brandingImages,
  figures: figureImages.figures,
  logos: logoImages.logos,
}
const manifest = `// Generated by scripts/build-images.mjs. Do not edit.
// Regenerate with npm run assets:build.

export type GeneratedImageAssets = {
  profile: { src: string; width: number; height: number }
  paintings: Record<string, { src: string; srcSet: string }>
  branding: Record<string, string>
  figures: Record<string, { src: string; srcSet: string; width: number; height: number }>
  logos: Record<string, { src: string; width: number; height: number }>
}

export const imageAssets: GeneratedImageAssets = ${JSON.stringify(assetManifest, null, 2)}
`
await writeFile(manifestPath, manifest, 'utf8')
await auditOutputs(assetManifest)
await auditLocalImages(assetManifest.figures, assetManifest.logos)
const kib = (size) => (size / 1024).toFixed(1)
console.log(
  `Verified figures and logos: ${Object.keys(assetManifest.figures).length} figures ` +
  `(${figureImages.variantCount} variants, ${kib(figureImages.bytes)} KiB); ` +
  `${Object.keys(assetManifest.logos).length} logos (${kib(logoImages.bytes)} KiB).`
)
console.log(
  `Generated high-quality WebP assets: 1 portrait, ${paintings.length} paintings, ${branding.length} branding logos, ` +
  `${Object.keys(assetManifest.figures).length} figures and ${Object.keys(assetManifest.logos).length} logos.`
)
