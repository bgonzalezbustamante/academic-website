'use client'

import { useMemo, useState } from 'react'

import type {
  CoauthorshipEdge,
  CoauthorshipGraph,
  CoauthorshipNode,
} from '@/lib/coauthorship'

type Props = {
  graph: CoauthorshipGraph
}

type Point = {
  x: number
  y: number
  vx: number
  vy: number
}

const WIDTH = 960
const HEIGHT = 620
const CENTRE_X = WIDTH / 2
const CENTRE_Y = HEIGHT / 2

function nodeRadius(node: CoauthorshipNode) {
  if (node.isProfile) return 17

  return 8 + Math.min(8, node.publicationCount * 1.25)
}

function edgeKey(edge: CoauthorshipEdge) {
  return [edge.source, edge.target].sort().join('::')
}

function layoutGraph(graph: CoauthorshipGraph) {
  const positions = new Map<string, Point>()
  const collaborators = graph.nodes.filter((node) => !node.isProfile)

  positions.set(
    graph.nodes.find((node) => node.isProfile)?.id ?? '',
    {
      x: CENTRE_X,
      y: CENTRE_Y,
      vx: 0,
      vy: 0,
    }
  )

  collaborators.forEach((node, index) => {
    const angle =
      (index / Math.max(collaborators.length, 1)) *
        Math.PI *
        2 -
      Math.PI / 2
    const ring = 205 + (index % 3) * 28

    positions.set(node.id, {
      x: CENTRE_X + Math.cos(angle) * ring,
      y: CENTRE_Y + Math.sin(angle) * ring,
      vx: 0,
      vy: 0,
    })
  })

  const profileId = graph.nodes.find((node) => node.isProfile)?.id

  for (let iteration = 0; iteration < 260; iteration += 1) {
    const cooling = 1 - iteration / 300

    for (let i = 0; i < graph.nodes.length; i += 1) {
      const a = graph.nodes[i]
      const pa = positions.get(a.id)
      if (!pa) continue

      for (let j = i + 1; j < graph.nodes.length; j += 1) {
        const b = graph.nodes[j]
        const pb = positions.get(b.id)
        if (!pb) continue

        const dx = pb.x - pa.x || 0.01
        const dy = pb.y - pa.y || 0.01
        const distanceSquared = Math.max(dx * dx + dy * dy, 900)
        const distance = Math.sqrt(distanceSquared)
        const force = (3600 / distanceSquared) * cooling
        const fx = (dx / distance) * force
        const fy = (dy / distance) * force

        if (a.id !== profileId) {
          pa.vx -= fx
          pa.vy -= fy
        }

        if (b.id !== profileId) {
          pb.vx += fx
          pb.vy += fy
        }
      }
    }

    for (const edge of graph.edges) {
      const source = positions.get(edge.source)
      const target = positions.get(edge.target)
      if (!source || !target) continue

      const dx = target.x - source.x
      const dy = target.y - source.y
      const distance = Math.max(Math.hypot(dx, dy), 1)
      const targetLength =
        edge.source === profileId || edge.target === profileId
          ? 190
          : 135
      const spring =
        (distance - targetLength) *
        (0.0028 + Math.min(edge.weight, 5) * 0.0005) *
        cooling
      const fx = (dx / distance) * spring
      const fy = (dy / distance) * spring

      if (edge.source !== profileId) {
        source.vx += fx
        source.vy += fy
      }

      if (edge.target !== profileId) {
        target.vx -= fx
        target.vy -= fy
      }
    }

    for (const node of graph.nodes) {
      if (node.id === profileId) continue

      const point = positions.get(node.id)
      if (!point) continue

      point.vx += (CENTRE_X - point.x) * 0.0008
      point.vy += (CENTRE_Y - point.y) * 0.0008
      point.vx *= 0.84
      point.vy *= 0.84
      point.x = Math.min(
        WIDTH - 115,
        Math.max(115, point.x + point.vx)
      )
      point.y = Math.min(
        HEIGHT - 55,
        Math.max(55, point.y + point.vy)
      )
    }
  }

  return positions
}

function connectedNodes(
  graph: CoauthorshipGraph,
  nodeId: string | null
) {
  if (!nodeId) return new Set<string>()

  const connected = new Set<string>([nodeId])

  for (const edge of graph.edges) {
    if (edge.source === nodeId) connected.add(edge.target)
    if (edge.target === nodeId) connected.add(edge.source)
  }

  return connected
}

export default function CoauthorshipNetwork({ graph }: Props) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(
    null
  )
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(
    null
  )

  const positions = useMemo(() => layoutGraph(graph), [graph])
  const connected = useMemo(
    () => connectedNodes(graph, hoveredNode),
    [graph, hoveredNode]
  )

  if (graph.nodes.length <= 1) {
    return (
      <div className="empty-state">
        <p>
          No co-authorship relationships are available after excluding
          publications with more than five authors.
        </p>
      </div>
    )
  }

  return (
    <div className="coauthorship-network-frame">
      <svg
        className="coauthorship-network"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label="Co-authorship network"
      >
        <g className="coauthorship-edges">
          {graph.edges.map((edge) => {
            const source = positions.get(edge.source)
            const target = positions.get(edge.target)
            if (!source || !target) return null

            const key = edgeKey(edge)
            const incident =
              !hoveredNode ||
              edge.source === hoveredNode ||
              edge.target === hoveredNode
            const active =
              hoveredEdge === key ||
              (hoveredNode !== null && incident)

            return (
              <line
                key={key}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                className={[
                  'coauthorship-edge',
                  !incident ? 'coauthorship-edge-dimmed' : '',
                  active ? 'coauthorship-edge-active' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                strokeWidth={1 + Math.min(edge.weight, 7) * 0.75}
                onMouseEnter={() => setHoveredEdge(key)}
                onMouseLeave={() => setHoveredEdge(null)}
              >
                <title>
                  {edge.source} + {edge.target}: {edge.weight}{' '}
                  {edge.weight === 1
                    ? 'joint publication'
                    : 'joint publications'}
                </title>
              </line>
            )
          })}
        </g>

        <g className="coauthorship-nodes">
          {graph.nodes.map((node) => {
            const point = positions.get(node.id)
            if (!point) return null

            const dimmed =
              hoveredNode !== null && !connected.has(node.id)
            const anchor = point.x >= CENTRE_X ? 'start' : 'end'
            const labelX =
              point.x +
              (anchor === 'start'
                ? nodeRadius(node) + 7
                : -(nodeRadius(node) + 7))

            return (
              <g
                key={node.id}
                className={[
                  'coauthorship-node',
                  node.isProfile
                    ? 'coauthorship-node-profile'
                    : '',
                  dimmed ? 'coauthorship-node-dimmed' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={nodeRadius(node)}
                >
                  <title>
                    {node.name}: {node.publicationCount}{' '}
                    {node.publicationCount === 1
                      ? 'publication in the displayed network'
                      : 'publications in the displayed network'}
                  </title>
                </circle>
                <text
                  x={labelX}
                  y={point.y + 4}
                  textAnchor={anchor}
                >
                  {node.name}
                </text>
              </g>
            )
          })}
        </g>
      </svg>

      <div className="coauthorship-network-legend">
        <span>
          <i className="coauthorship-legend-node coauthorship-legend-profile" />
          Bastián González-Bustamante
        </span>
        <span>
          <i className="coauthorship-legend-node" />
          Co-author
        </span>
        <span>Node size = publications in network</span>
        <span>Edge width = joint publications</span>
      </div>
    </div>
  )
}
