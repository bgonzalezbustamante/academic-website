'use client'

import {
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react'

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

type ClusterLayout = {
  nodeIds: string[]
  x: number
  y: number
}

type LayoutResult = {
  positions: Map<string, Point>
  clusterByNode: Map<string, ClusterLayout>
}

const WIDTH = 1080
const HEIGHT = 740
const CENTRE_X = WIDTH / 2
const CENTRE_Y = HEIGHT / 2

const subscribeToHydration = () => () => {}

function useHydrated() {
  return useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false
  )
}

function nodeRadius(node: CoauthorshipNode) {
  if (node.isProfile) return 20

  return 10 + Math.min(10, node.publicationCount * 1.4)
}

function edgeKey(edge: CoauthorshipEdge) {
  return [edge.source, edge.target].sort().join('::')
}

function collaboratorClusters(
  graph: CoauthorshipGraph,
  profileId: string | undefined
) {
  const collaborators = graph.nodes
    .filter((node) => node.id !== profileId)
    .map((node) => node.id)
    .sort((a, b) => a.localeCompare(b))
  const adjacency = new Map<string, Map<string, number>>(
    collaborators.map((id) => [id, new Map<string, number>()])
  )

  for (const edge of graph.edges) {
    if (
      edge.source === profileId ||
      edge.target === profileId
    ) {
      continue
    }

    adjacency.get(edge.source)?.set(edge.target, edge.weight)
    adjacency.get(edge.target)?.set(edge.source, edge.weight)
  }

  const labels = new Map(
    collaborators.map((id) => [id, id])
  )

  for (let iteration = 0; iteration < 40; iteration += 1) {
    let changed = false

    for (const id of collaborators) {
      const neighbours = adjacency.get(id)
      if (!neighbours || neighbours.size === 0) continue

      const scores = new Map<string, number>()

      for (const [neighbour, weight] of neighbours) {
        const label = labels.get(neighbour) ?? neighbour
        scores.set(label, (scores.get(label) ?? 0) + weight)
      }

      const currentLabel = labels.get(id) ?? id
      let bestLabel = currentLabel
      let bestScore = scores.get(currentLabel) ?? -1

      for (const [label, score] of scores) {
        if (
          score > bestScore ||
          (score === bestScore &&
            label.localeCompare(bestLabel) < 0)
        ) {
          bestLabel = label
          bestScore = score
        }
      }

      if (bestLabel !== currentLabel) {
        labels.set(id, bestLabel)
        changed = true
      }
    }

    if (!changed) break
  }

  const communities = new Map<string, string[]>()

  for (const id of collaborators) {
    const label = labels.get(id) ?? id
    const community = communities.get(label) ?? []
    community.push(id)
    communities.set(label, community)
  }

  return Array.from(communities.values())
    .map((community) =>
      community.sort((a, b) => a.localeCompare(b))
    )
    .sort(
      (a, b) =>
        b.length - a.length ||
        (a[0] ?? '').localeCompare(b[0] ?? '')
    )
}

function clusterLayouts(
  graph: CoauthorshipGraph,
  profileId: string | undefined
) {
  const clusters = collaboratorClusters(graph, profileId)

  return clusters.map((nodeIds, index): ClusterLayout => {
    const ring = Math.floor(index / 8)
    const ringStart = ring * 8
    const ringCount = Math.min(
      8,
      clusters.length - ringStart
    )
    const localIndex = index - ringStart
    const radius = Math.min(300, 215 + ring * 72)
    const angle =
      (localIndex / Math.max(ringCount, 1)) * Math.PI * 2 -
      Math.PI / 2 +
      (ring % 2) * (Math.PI / 8)

    return {
      nodeIds,
      x: CENTRE_X + Math.cos(angle) * radius,
      y: CENTRE_Y + Math.sin(angle) * radius,
    }
  })
}

function resolveNodeOverlaps(
  graph: CoauthorshipGraph,
  positions: Map<string, Point>,
  profileId: string | undefined
) {
  const gap = 20

  for (let pass = 0; pass < 220; pass += 1) {
    let moved = false

    for (let i = 0; i < graph.nodes.length; i += 1) {
      const a = graph.nodes[i]
      const pa = positions.get(a.id)
      if (!pa) continue

      for (let j = i + 1; j < graph.nodes.length; j += 1) {
        const b = graph.nodes[j]
        const pb = positions.get(b.id)
        if (!pb) continue

        let dx = pb.x - pa.x
        let dy = pb.y - pa.y
        let distance = Math.hypot(dx, dy)

        if (distance === 0) {
          const angle =
            ((i + 1) * 37 + (j + 1) * 53) * (Math.PI / 180)
          dx = Math.cos(angle)
          dy = Math.sin(angle)
          distance = 1
        }

        const labelAllowance = Math.min(
          24,
          Math.max(a.name.length, b.name.length) * 0.32
        )
        const minimumDistance =
          nodeRadius(a) +
          nodeRadius(b) +
          gap +
          labelAllowance

        if (distance >= minimumDistance) continue

        const overlap = minimumDistance - distance
        const ux = dx / distance
        const uy = dy / distance

        if (a.id === profileId) {
          pb.x += ux * overlap
          pb.y += uy * overlap
        } else if (b.id === profileId) {
          pa.x -= ux * overlap
          pa.y -= uy * overlap
        } else {
          const shift = overlap / 2
          pa.x -= ux * shift
          pa.y -= uy * shift
          pb.x += ux * shift
          pb.y += uy * shift
        }

        moved = true
      }
    }

    for (const node of graph.nodes) {
      if (node.id === profileId) continue

      const point = positions.get(node.id)
      if (!point) continue

      const margin = nodeRadius(node) + 18
      point.x = Math.min(
        WIDTH - margin,
        Math.max(margin, point.x)
      )
      point.y = Math.min(
        HEIGHT - margin,
        Math.max(margin, point.y)
      )
    }

    if (!moved) break
  }
}

function layoutGraph(graph: CoauthorshipGraph): LayoutResult {
  const positions = new Map<string, Point>()
  const profileId = graph.nodes.find((node) => node.isProfile)?.id
  const clusters = clusterLayouts(graph, profileId)
  const clusterByNode = new Map<string, ClusterLayout>()

  if (profileId) {
    positions.set(profileId, {
      x: CENTRE_X,
      y: CENTRE_Y,
      vx: 0,
      vy: 0,
    })
  }

  for (const cluster of clusters) {
    cluster.nodeIds.forEach((nodeId, index) => {
      clusterByNode.set(nodeId, cluster)

      const angle =
        (index / Math.max(cluster.nodeIds.length, 1)) *
          Math.PI *
          2 -
        Math.PI / 2
      const localRadius =
        cluster.nodeIds.length === 1
          ? 0
          : 34 + Math.min(48, cluster.nodeIds.length * 5)

      positions.set(nodeId, {
        x: cluster.x + Math.cos(angle) * localRadius,
        y: cluster.y + Math.sin(angle) * localRadius,
        vx: 0,
        vy: 0,
      })
    })
  }

  for (let iteration = 0; iteration < 360; iteration += 1) {
    const cooling = Math.max(0.12, 1 - iteration / 390)

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
        const distanceSquared = Math.max(dx * dx + dy * dy, 625)
        const distance = Math.sqrt(distanceSquared)
        const force = (5200 / distanceSquared) * cooling
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

        const minimumDistance =
          nodeRadius(a) + nodeRadius(b) + 10

        if (distance < minimumDistance) {
          const collision =
            (minimumDistance - distance) * 0.045 * cooling
          const cfx = (dx / distance) * collision
          const cfy = (dy / distance) * collision

          if (a.id !== profileId) {
            pa.vx -= cfx
            pa.vy -= cfy
          }

          if (b.id !== profileId) {
            pb.vx += cfx
            pb.vy += cfy
          }
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
      const profileEdge =
        edge.source === profileId || edge.target === profileId
      const targetLength = profileEdge ? 230 : 102
      const strength = profileEdge
        ? 0.0016
        : 0.0048 + Math.min(edge.weight, 5) * 0.0007
      const spring =
        (distance - targetLength) * strength * cooling
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
      const cluster = clusterByNode.get(node.id)
      if (!point || !cluster) continue

      point.vx += (cluster.x - point.x) * 0.007 * cooling
      point.vy += (cluster.y - point.y) * 0.007 * cooling
      point.vx += (CENTRE_X - point.x) * 0.0002
      point.vy += (CENTRE_Y - point.y) * 0.0002
      point.vx *= 0.82
      point.vy *= 0.82
      point.x = Math.min(
        WIDTH - 125,
        Math.max(125, point.x + point.vx)
      )
      point.y = Math.min(
        HEIGHT - 60,
        Math.max(60, point.y + point.vy)
      )
    }
  }

  resolveNodeOverlaps(graph, positions, profileId)

  return {
    positions,
    clusterByNode,
  }
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
  const hydrated = useHydrated()

  const layout = useMemo(
    () =>
      hydrated && graph.nodes.length > 1
        ? layoutGraph(graph)
        : null,
    [graph, hydrated]
  )
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

  if (!layout) {
    return (
      <div className="coauthorship-network-frame">
        <svg
          className="coauthorship-network"
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          aria-hidden="true"
        />
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
            const source = layout.positions.get(edge.source)
            const target = layout.positions.get(edge.target)
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
            const point = layout.positions.get(node.id)
            if (!point) return null

            const dimmed =
              hoveredNode !== null && !connected.has(node.id)
            const cluster = layout.clusterByNode.get(node.id)
            const anchorCentreX = cluster?.x ?? CENTRE_X
            const anchor =
              point.x >= anchorCentreX ? 'start' : 'end'
            const labelX =
              point.x +
              (anchor === 'start'
                ? nodeRadius(node) + 8
                : -(nodeRadius(node) + 8))

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
        <span className="coauthorship-network-count">
          {graph.nodes.filter((node) => !node.isProfile).length}{' '}
          {graph.nodes.filter((node) => !node.isProfile).length === 1
            ? 'co-author'
            : 'co-authors'}{' '}
          · {graph.edges.length}{' '}
          {graph.edges.length === 1 ? 'link' : 'links'}
        </span>
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
        <span>Layout separates weighted collaborator communities</span>
      </div>
    </div>
  )
}
