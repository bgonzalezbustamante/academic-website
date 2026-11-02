import { readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'

const require = createRequire(import.meta.url)
const sourcePath = require.resolve('world-atlas/countries-50m.json')
const outputPath = path.join(process.cwd(), 'public', 'data', 'europe-map-50m.json')

// Must match the Europe view in components/academic-world-map.tsx and
// components/conference-region-map.tsx.
const VIEW = { center: [10, 51], scale: 700, width: 800, height: 510 }
// Keep countries with any vertex within this many pixels of the viewBox.
const MARGIN = 20

// Equal Earth raw projection, as implemented by d3-geo's geoEqualEarth.
const A1 = 1.340264
const A2 = -0.081106
const A3 = 0.000893
const A4 = 0.003796
const M = Math.sqrt(3) / 2
const RADIANS = Math.PI / 180

function equalEarth(longitude, latitude) {
  const l = Math.asin(M * Math.sin(latitude * RADIANS))
  const l2 = l * l
  const l6 = l2 * l2 * l2

  return [
    (longitude * RADIANS * Math.cos(l)) /
      (M * (A1 + 3 * A2 * l2 + l6 * (7 * A3 + 9 * A4 * l2))),
    l * (A1 + A2 * l2 + l6 * (A3 + A4 * l2)),
  ]
}

const [centerX, centerY] = equalEarth(...VIEW.center)

function isInView(longitude, latitude) {
  const [rawX, rawY] = equalEarth(longitude, latitude)
  const x = VIEW.width / 2 + VIEW.scale * (rawX - centerX)
  const y = VIEW.height / 2 - VIEW.scale * (rawY - centerY)

  return (
    x >= -MARGIN &&
    x <= VIEW.width + MARGIN &&
    y >= -MARGIN &&
    y <= VIEW.height + MARGIN
  )
}

const topology = JSON.parse(await readFile(sourcePath, 'utf8'))
const [scaleX, scaleY] = topology.transform.scale
const [translateX, translateY] = topology.transform.translate

function arcIsInView(arc) {
  let x = 0
  let y = 0

  for (const [dx, dy] of arc) {
    x += dx
    y += dy
    if (isInView(x * scaleX + translateX, y * scaleY + translateY)) {
      return true
    }
  }

  return false
}

function arcIndexes(arcs) {
  return arcs.flat(Infinity).map((index) => (index < 0 ? ~index : index))
}

function reindexArcs(arcs, mapping) {
  return Array.isArray(arcs)
    ? arcs.map((value) => reindexArcs(value, mapping))
    : arcs < 0
      ? ~mapping.get(~arcs)
      : mapping.get(arcs)
}

const visibleArcs = topology.arcs.map(arcIsInView)
const countries = topology.objects.countries.geometries.filter(
  (geometry) =>
    geometry.arcs &&
    arcIndexes(geometry.arcs).some((index) => visibleArcs[index])
)

const usedArcs = [...new Set(countries.flatMap((geometry) => arcIndexes(geometry.arcs)))].sort(
  (a, b) => a - b
)
const mapping = new Map(usedArcs.map((index, position) => [index, position]))

const subset = {
  type: 'Topology',
  bbox: topology.bbox,
  transform: topology.transform,
  objects: {
    countries: {
      type: 'GeometryCollection',
      geometries: countries.map((geometry) => ({
        ...geometry,
        arcs: reindexArcs(geometry.arcs, mapping),
      })),
    },
  },
  arcs: usedArcs.map((index) => topology.arcs[index]),
}

const output = `${JSON.stringify(subset)}\n`
await writeFile(outputPath, output, 'utf8')

console.log(
  `Generated public/data/europe-map-50m.json: ${countries.length} of ${topology.objects.countries.geometries.length} countries, ${usedArcs.length} of ${topology.arcs.length} arcs, ${(output.length / 1024).toFixed(1)} KiB.`
)
