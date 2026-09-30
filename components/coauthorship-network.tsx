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

const WIDTH = 1320
const HEIGHT = 920
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

function weightedModularity(
  collaborators: string[],
  adjacency: Map<string, Map<string, number>>,
  labels: Map<string, string>
) {
  const resolution = 1.1
  let totalEdgeWeight = 0
  const degree = new Map<string, number>(
    collaborators.map((id) => [id, 0])
  )

  for (const source of collaborators) {
    for (const [target, weight] of adjacency.get(source) ?? []) {
      degree.set(
        source,
        (degree.get(source) ?? 0) + weight
      )

      if (source.localeCompare(target) < 0) {
        totalEdgeWeight += weight
      }
    }
  }

  if (totalEdgeWeight === 0) return 0

  const stats = new Map<
    string,
    { internalWeight: number; degreeSum: number }
  >()

  for (const id of collaborators) {
    const label = labels.get(id) ?? id
    const current = stats.get(label) ?? {
      internalWeight: 0,
      degreeSum: 0,
    }

    current.degreeSum += degree.get(id) ?? 0
    stats.set(label, current)
  }

  for (const source of collaborators) {
    for (const [target, weight] of adjacency.get(source) ?? []) {
      if (source.localeCompare(target) >= 0) continue

      const sourceLabel = labels.get(source) ?? source
      const targetLabel = labels.get(target) ?? target

      if (sourceLabel !== targetLabel) continue

      const current = stats.get(sourceLabel)
      if (current) {
        current.internalWeight += weight
      }
    }
  }

  let modularity = 0

  for (const { internalWeight, degreeSum } of stats.values()) {
    modularity +=
      internalWeight / totalEdgeWeight -
      resolution *
        Math.pow(degreeSum / (2 * totalEdgeWeight), 2)
  }

  return modularity
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
  let modularity = weightedModularity(
    collaborators,
    adjacency,
    labels
  )

  for (let iteration = 0; iteration < 60; iteration += 1) {
    let changed = false

    for (const id of collaborators) {
      const currentLabel = labels.get(id) ?? id
      const candidateLabels = new Set<string>([
        currentLabel,
        id,
      ])

      for (const neighbour of adjacency.get(id)?.keys() ?? []) {
        candidateLabels.add(
          labels.get(neighbour) ?? neighbour
        )
      }

      let bestLabel = currentLabel
      let bestModularity = modularity

      for (const candidate of Array.from(candidateLabels).sort(
        (a, b) => a.localeCompare(b)
      )) {
        if (candidate === currentLabel) continue

        labels.set(id, candidate)
        const candidateModularity = weightedModularity(
          collaborators,
          adjacency,
          labels
        )

        if (
          candidateModularity > bestModularity + 1e-9 ||
          (Math.abs(candidateModularity - bestModularity) <= 1e-9 &&
            bestLabel !== currentLabel &&
            candidate.localeCompare(bestLabel) < 0)
        ) {
          bestLabel = candidate
          bestModularity = candidateModularity
        }
      }

      labels.set(id, bestLabel)

      if (bestLabel !== currentLabel) {
        modularity = bestModularity
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
    const ring = Math.floor(index / 7)
    const ringStart = ring * 7
    const ringCount = Math.min(
      7,
      clusters.length - ringStart
    )
    const localIndex = index - ringStart
    const radius = Math.min(415, 300 + ring * 105)
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

function shiftCluster(
  cluster: ClusterLayout,
  positions: Map<string, Point>,
  dx: number,
  dy: number
) {
  cluster.x += dx
  cluster.y += dy

  for (const nodeId of cluster.nodeIds) {
    const point = positions.get(nodeId)
    if (!point) continue

    point.x += dx
    point.y += dy
  }
}

function clusterEnvelope(
  graph: CoauthorshipGraph,
  cluster: ClusterLayout,
  positions: Map<string, Point>
) {
  const nodesById = new Map(
    graph.nodes.map((node) => [node.id, node])
  )
  const points = cluster.nodeIds
    .map((nodeId) => ({
      node: nodesById.get(nodeId),
      point: positions.get(nodeId),
    }))
    .filter(
      (
        item
      ): item is {
        node: CoauthorshipNode
        point: Point
      } => Boolean(item.node && item.point)
    )

  if (points.length === 0) {
    return {
      x: cluster.x,
      y: cluster.y,
      radius: 0,
    }
  }

  const x =
    points.reduce((total, item) => total + item.point.x, 0) /
    points.length
  const y =
    points.reduce((total, item) => total + item.point.y, 0) /
    points.length
  const radius = Math.max(
    ...points.map(
      ({ node, point }) =>
        Math.hypot(point.x - x, point.y - y) +
        nodeRadius(node) +
        30
    ),
    42
  )

  return { x, y, radius }
}

function resolveClusterOverlaps(
  graph: CoauthorshipGraph,
  positions: Map<string, Point>,
  clusters: ClusterLayout[]
) {
  const gap = 44

  for (let pass = 0; pass < 90; pass += 1) {
    let moved = false

    for (let i = 0; i < clusters.length; i += 1) {
      for (let j = i + 1; j < clusters.length; j += 1) {
        const a = clusters[i]
        const b = clusters[j]
        const envelopeA = clusterEnvelope(graph, a, positions)
        const envelopeB = clusterEnvelope(graph, b, positions)

        let dx = envelopeB.x - envelopeA.x
        let dy = envelopeB.y - envelopeA.y
        let distance = Math.hypot(dx, dy)

        if (distance === 0) {
          const angle =
            ((i + 1) * 41 + (j + 1) * 59) *
            (Math.PI / 180)
          dx = Math.cos(angle)
          dy = Math.sin(angle)
          distance = 1
        }

        const minimumDistance =
          envelopeA.radius + envelopeB.radius + gap

        if (distance >= minimumDistance) continue

        const overlap = minimumDistance - distance
        const shift = Math.min(26, overlap / 2)
        const ux = dx / distance
        const uy = dy / distance

        shiftCluster(a, positions, -ux * shift, -uy * shift)
        shiftCluster(b, positions, ux * shift, uy * shift)
        moved = true
      }
    }

    for (const cluster of clusters) {
      const envelope = clusterEnvelope(
        graph,
        cluster,
        positions
      )
      const margin = 32
      let dx = 0
      let dy = 0

      if (envelope.x - envelope.radius < margin) {
        dx +=
          margin - (envelope.x - envelope.radius)
      }
      if (envelope.x + envelope.radius > WIDTH - margin) {
        dx -=
          envelope.x + envelope.radius - (WIDTH - margin)
      }
      if (envelope.y - envelope.radius < margin) {
        dy +=
          margin - (envelope.y - envelope.radius)
      }
      if (envelope.y + envelope.radius > HEIGHT - margin) {
        dy -=
          envelope.y + envelope.radius - (HEIGHT - margin)
      }

      if (dx !== 0 || dy !== 0) {
        shiftCluster(cluster, positions, dx, dy)
      }
    }

    if (!moved) break
  }
}

function resolveNodeOverlaps(
  graph: CoauthorshipGraph,
  positions: Map<string, Point>,
  profileId: string | undefined,
  clusterByNode: Map<string, ClusterLayout>
) {
  const edgeWeights = new Map(
    graph.edges.map((edge) => [edgeKey(edge), edge.weight])
  )

  for (let pass = 0; pass < 320; pass += 1) {
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

        const pairWeight =
          edgeWeights.get(
            [a.id, b.id].sort().join('::')
          ) ?? 0
        const connected = pairWeight > 0
        const profileConnected =
          connected &&
          (a.id === profileId || b.id === profileId)
        const clusterA = clusterByNode.get(a.id)
        const clusterB = clusterByNode.get(b.id)
        const differentClusters =
          clusterA &&
          clusterB &&
          clusterA !== clusterB
        const safetyGap = profileConnected
          ? Math.max(
              5,
              14 - Math.min(9, (pairWeight - 1) * 2.5)
            )
          : differentClusters
            ? 48
            : connected
              ? 14
              : 30
        const labelAllowance = profileConnected
          ? Math.min(
              8,
              Math.max(a.name.length, b.name.length) * 0.11
            )
          : differentClusters
            ? Math.min(
                48,
                Math.max(a.name.length, b.name.length) * 0.58
              )
            : connected
              ? Math.min(
                  14,
                  Math.max(a.name.length, b.name.length) * 0.18
                )
              : Math.min(
                  34,
                  Math.max(a.name.length, b.name.length) * 0.44
                )
        const minimumDistance =
          nodeRadius(a) +
          nodeRadius(b) +
          safetyGap +
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
          : 28 + Math.min(40, cluster.nodeIds.length * 4.5)

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
        const clusterA = clusterByNode.get(a.id)
        const clusterB = clusterByNode.get(b.id)
        const differentClusters =
          clusterA &&
          clusterB &&
          clusterA !== clusterB
        const repulsionMultiplier = differentClusters ? 3.8 : 1
        const force =
          (5850 / distanceSquared) *
          cooling *
          repulsionMultiplier
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
      const sourceCluster = clusterByNode.get(edge.source)
      const targetCluster = clusterByNode.get(edge.target)
      const crossCommunityEdge =
        !profileEdge &&
        sourceCluster &&
        targetCluster &&
        sourceCluster !== targetCluster

      const weightFactor = Math.max(1, edge.weight)
      const targetLength = profileEdge
        ? Math.max(
            64,
            225 /
              Math.pow(
                1 + 1.18 * (weightFactor - 1),
                0.98
              )
          )
        : crossCommunityEdge
          ? 175
          : 98
      const strength = profileEdge
        ? 0.0026 + Math.min(edge.weight, 10) * 0.0008
        : crossCommunityEdge
          ? 0.00045 + Math.min(edge.weight, 4) * 0.00008
          : 0.0054 + Math.min(edge.weight, 6) * 0.00035
      const spring = crossCommunityEdge
        ? Math.max(0, distance - targetLength) *
          strength *
          cooling
        : (distance - targetLength) * strength * cooling
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

      point.vx += (cluster.x - point.x) * 0.0145 * cooling
      point.vy += (cluster.y - point.y) * 0.0145 * cooling
      point.vx += (CENTRE_X - point.x) * 0.0001
      point.vy += (CENTRE_Y - point.y) * 0.0001
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

  resolveClusterOverlaps(
    graph,
    positions,
    clusters
  )
  resolveNodeOverlaps(
    graph,
    positions,
    profileId,
    clusterByNode
  )
  resolveClusterOverlaps(
    graph,
    positions,
    clusters
  )
  resolveNodeOverlaps(
    graph,
    positions,
    profileId,
    clusterByNode
  )

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
        <span>Frequent profile collaborators = closer to centre</span>
      </div>
    </div>
  )
}
