'use client';

import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import { nodes, connections, connectionTypeColors, serverGroups } from '@/data/ecosystem';
import type { EcosystemNode, Connection } from '@/types';
import { usePMOStore } from '@/stores';
import { useBetaModeStore } from '@/stores/beta-mode-store';
import { BETA_HIDDEN_NODES } from '@/config/feature-flags';

interface VersionDefinition {
  id: string;
  name: string;
  order: number;
}

interface VersionChange {
  productId: string;
  change: 'added' | 'removed' | 'unchanged';
}

function toProductVersionMap(versions: { productId: string; label: string }[]) {
  const map = new Map<string, Set<string>>();
  for (const v of versions) {
    if (!map.has(v.productId)) map.set(v.productId, new Set());
    map.get(v.productId)!.add(v.label);
  }
  return map;
}

export default function PmoTopologyPage() {
  const svgRef1 = useRef<SVGSVGElement>(null);
  const zoomGroupRef1 = useRef<SVGGElement>(null);
  const svgRef2 = useRef<SVGSVGElement>(null);
  const zoomGroupRef2 = useRef<SVGGElement>(null);

  const store = usePMOStore();
  const { isBeta } = useBetaModeStore();
  const allVersions = store.versions;
  const storeSetVersion = store.setSelectedVersion;

  const versionDefinitions = useMemo<VersionDefinition[]>(() => {
    const labelSet = new Set<string>();
    for (const v of allVersions) {
      if (v.label) labelSet.add(v.label);
    }
    const sorted = Array.from(labelSet).sort();
    return sorted.map((label, i) => ({
      id: label,
      name: label,
      order: i + 1,
    }));
  }, [allVersions]);

  const [selectedVersionId, setSelectedVersionId] = useState<string>('all');
  const [compareMode, setCompareMode] = useState(false);
  const [compareA, setCompareA] = useState<string>(versionDefinitions[0]?.id || '');
  const [compareB, setCompareB] = useState<string>(versionDefinitions[versionDefinitions.length - 1]?.id || '');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  useEffect(() => {
    if (versionDefinitions.length > 0 && !compareA) {
      setCompareA(versionDefinitions[0].id);
      setCompareB(versionDefinitions[versionDefinitions.length - 1].id);
    }
  }, [versionDefinitions, compareA, compareB]);

  const getProductsForVersionId = useCallback((versionId: string): string[] => {
    if (!versionId || versionId === 'all') return [];
    const ids = new Set<string>();
    for (const v of allVersions) {
      if (v.label === versionId) ids.add(v.productId);
    }
    return Array.from(ids);
  }, [allVersions]);

  const getConnectionsForVersionId = useCallback((versionId: string): Connection[] => {
    const productSet = new Set(getProductsForVersionId(versionId));
    if (productSet.size === 0) return [];
    return connections.filter(c => productSet.has(c.source) && productSet.has(c.target));
  }, [getProductsForVersionId]);

  const productVersionAssignments = useMemo(() => {
    return toProductVersionMap(allVersions);
  }, [allVersions]);

  const compareVersions = useCallback((v1: string, v2: string): VersionChange[] => {
    const prods1 = new Set(getProductsForVersionId(v1));
    const prods2 = new Set(getProductsForVersionId(v2));
    const allProds = new Set([...prods1, ...prods2]);
    const changes: VersionChange[] = [];
    for (const pid of allProds) {
      const in1 = prods1.has(pid);
      const in2 = prods2.has(pid);
      if (in1 && !in2) changes.push({ productId: pid, change: 'removed' });
      else if (!in1 && in2) changes.push({ productId: pid, change: 'added' });
      else changes.push({ productId: pid, change: 'unchanged' });
    }
    return changes;
  }, [getProductsForVersionId]);

  const activeProductIds = useMemo(() => {
    if (selectedVersionId === 'all') return new Set<string>();
    return new Set(getProductsForVersionId(selectedVersionId));
  }, [selectedVersionId, getProductsForVersionId]);

  const activeConnectionIds = useMemo(() => {
    if (selectedVersionId === 'all') return new Set<string>();
    return new Set(getConnectionsForVersionId(selectedVersionId).map(c => c.id));
  }, [selectedVersionId, getConnectionsForVersionId]);

  const filteredNodeIds = useMemo(() => {
    let result: Set<string>;
    if (selectedVersionId === 'all') {
      result = new Set(nodes.map(n => n.id));
    } else {
      const active = activeProductIds;
      result = new Set(nodes.map(n => n.id));
      for (const id of result) {
        if (!active.has(id)) result.delete(id);
      }
    }
    if (isBeta) {
      for (const id of result) {
        if ((BETA_HIDDEN_NODES as readonly string[]).includes(id)) result.delete(id);
      }
    }
    return result;
  }, [selectedVersionId, activeProductIds, isBeta]);

  const filteredConnections = useMemo(() => {
    if (selectedVersionId === 'all') return connections;
    return getConnectionsForVersionId(selectedVersionId);
  }, [selectedVersionId, getConnectionsForVersionId]);

  const nodePositionsMap = useMemo(() => {
    const m = new Map<string, { x: number; y: number }>();
    nodes.forEach(n => m.set(n.id, { x: n.x, y: n.y }));
    return m;
  }, []);

  const nodeMap = useMemo(() => {
    const m = new Map<string, EcosystemNode>();
    nodes.forEach(n => m.set(n.id, n));
    return m;
  }, []);

  const isStoreLoaded = allVersions.length > 0;

  useEffect(() => {
    if (!svgRef1.current || !zoomGroupRef1.current) return;
    const svg = d3.select(svgRef1.current);
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.15, 4])
      .on('zoom', (event) => {
        d3.select(zoomGroupRef1.current).attr('transform', event.transform.toString());
      });
    svg.call(zoomBehavior);
    return () => { svg.on('.zoom', null); };
  }, []);

  useEffect(() => {
    if (!compareMode || !svgRef2.current || !zoomGroupRef2.current) return;
    const svg = d3.select(svgRef2.current);
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.15, 4])
      .on('zoom', (event) => {
        d3.select(zoomGroupRef2.current).attr('transform', event.transform.toString());
      });
    svg.call(zoomBehavior);
    return () => { svg.on('.zoom', null); };
  }, [compareMode]);

  const getNodeStatusForVersion = useCallback((nodeId: string, versionId: string): 'new' | 'removed' | 'unchanged' => {
    if (versionId === 'all') return 'unchanged';
    const assignments = productVersionAssignments.get(nodeId);
    if (!assignments) return 'unchanged';
    const isInCurrent = assignments.has(versionId);
    if (!isInCurrent) return 'removed';
    const currentDef = versionDefinitions.find(v => v.id === versionId);
    if (!currentDef) return 'unchanged';
    if (currentDef.order <= 1) return 'unchanged';
    const prevDefs = versionDefinitions.filter(v => v.order < currentDef.order);
    const wasInPrev = prevDefs.some(pv => assignments.has(pv.id));
    if (!wasInPrev) return 'new';
    return 'unchanged';
  }, [productVersionAssignments, versionDefinitions]);

  const renderTopology = useCallback((
    displayNodeIds: Set<string>,
    displayConnections: Connection[],
    zoomGroupRef: React.RefObject<SVGGElement | null>,
    versionContext: string,
    _comparisonVersion?: string
  ) => {
    const visibleConnections = displayConnections.filter(c =>
      displayNodeIds.has(c.source) && displayNodeIds.has(c.target)
    );

    const isAll = versionContext === 'all';

    return (
      <g ref={zoomGroupRef}>
        {serverGroups.map(group => {
          const groupPositions = group.nodes
            .filter(id => displayNodeIds.has(id))
            .map(id => nodePositionsMap.get(id))
            .filter(Boolean) as { x: number; y: number }[];
          if (groupPositions.length < 1) return null;
          const xs = groupPositions.map(p => p.x);
          const ys = groupPositions.map(p => p.y);
          const minX = Math.min(...xs) - 90;
          const minY = Math.min(...ys) - 70;
          const maxX = Math.max(...xs) + 90;
          const maxY = Math.max(...ys) + 70;
          const w = maxX - minX;
          const h = maxY - minY;
          return (
            <g key={`zone-${group.id}`}>
              <rect x={minX} y={minY} width={w} height={h} rx={20} ry={20}
                fill={group.color} opacity={0.06} stroke={group.color}
                strokeWidth={1} strokeOpacity={0.3} strokeDasharray="8,4" />
              <text x={minX + 14} y={minY + 22} fontSize={11} fontWeight={700}
                fill={group.color} fontFamily="system-ui" opacity={0.8}>
                {group.name} ({group.ip})
              </text>
            </g>
          );
        })}

        {connections.map(conn => {
          const sourcePos = nodePositionsMap.get(conn.source);
          const targetPos = nodePositionsMap.get(conn.target);
          if (!sourcePos || !targetPos) return null;
          const isVisible = visibleConnections.some(vc => vc.id === conn.id);
          const color = connectionTypeColors[conn.type];
          const midX = (sourcePos.x + targetPos.x) / 2;
          const midY = (sourcePos.y + targetPos.y) / 2;
          const dx = targetPos.x - sourcePos.x;
          const dy = targetPos.y - sourcePos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const bend = Math.min(dist * 0.2, 60);
          const perpX = -(dy / dist) * bend;
          const perpY = (dx / dist) * bend;
          const pathD = `M ${sourcePos.x} ${sourcePos.y} Q ${midX + perpX} ${midY + perpY} ${targetPos.x} ${targetPos.y}`;
          return (
            <g key={conn.id}>
              <path d={pathD} fill="none" stroke={color}
                strokeWidth={1.5} opacity={isAll ? 0.6 : (isVisible ? 0.6 : 0.08)}
                strokeDasharray={conn.protocol === 'WebSocket' ? '6,3' : 'none'}
                style={{ transition: 'opacity 0.3s' }} />
            </g>
          );
        })}

        {nodes.filter(n => filteredNodeIds.has(n.id)).map(node => {
          const pos = nodePositionsMap.get(node.id);
          if (!pos) return null;
          const status = getNodeStatusForVersion(node.id, versionContext);
          const isActive = displayNodeIds.has(node.id);
          const isSelected = selectedNode === node.id;
          const color = serverGroups.find(s => s.nodes.includes(node.id))?.color || node.color;
          const nodeWidth = Math.max(node.name.length * 8 + 24, 100);
          const nodeHeight = 56;

          let glowColor: string | null = null;
          if (status === 'new') glowColor = '#10B981';
          else if (status === 'removed') glowColor = '#EF4444';

          return (
            <g key={node.id}
              transform={`translate(${pos.x - nodeWidth / 2}, ${pos.y - nodeHeight / 2})`}
              opacity={isAll ? 1 : (isActive ? 1 : 0.15)}
              style={{ cursor: 'pointer', transition: 'opacity 0.3s' }}
              onClick={(e) => { e.stopPropagation(); setSelectedNode(isSelected ? null : node.id); }}>
              {isActive && glowColor && (
                <rect x={-4} y={-4} width={nodeWidth + 8} height={nodeHeight + 8} rx={14} ry={14}
                  fill="none" stroke={glowColor} strokeWidth={2.5} opacity={0.7}
                  filter={`drop-shadow(0 0 6px ${glowColor})`} />
              )}
              <rect x={0} y={0} width={nodeWidth} height={nodeHeight} rx={10} ry={10}
                fill="#f8fafc" stroke={color}
                strokeWidth={isSelected ? 3 : 1.5}
                filter={isSelected ? `drop-shadow(0 0 8px ${color}80)` : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'} />
              <path d={`M 0 10 Q 0 0 10 0 L ${nodeWidth - 10} 0 Q ${nodeWidth} 0 ${nodeWidth} 10 L ${nodeWidth} 6 L 0 6 Z`} fill={color} />
              <circle cx={nodeWidth - 8} cy={8} r={4}
                fill={node.status === 'online' ? '#10B981' : node.status === 'degraded' ? '#F59E0B' : '#EF4444'}
                stroke="#fff" strokeWidth={1} />
              <text x={nodeWidth / 2} y={26} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="#1e293b" fontFamily="system-ui">
                {node.name}
              </text>
              <text x={nodeWidth / 2} y={42} textAnchor="middle" fontSize={9}
                fill="#64748b" fontFamily="system-ui">
                {node.alias || node.type.toUpperCase()}
              </text>
              {!isAll && !isActive && (
                <line x1={4} y1={nodeHeight - 4} x2={nodeWidth - 4} y2={4} stroke="#EF4444" strokeWidth={2} opacity={0.5} />
              )}
            </g>
          );
        })}
      </g>
    );
  }, [nodePositionsMap, selectedNode, getNodeStatusForVersion]);

  const versionStats = useMemo(() => {
    const allIds = nodes.map(n => n.id);
    if (selectedVersionId === 'all') {
      return { active: allIds.length, total: allIds.length, newNodes: 0, removed: 0 };
    }
    const active = allIds.filter(id => filteredNodeIds.has(id)).length;
    const newNodes = allIds.filter(id => getNodeStatusForVersion(id, selectedVersionId) === 'new').length;
    const removed = allIds.filter(id => getNodeStatusForVersion(id, selectedVersionId) === 'removed').length;
    return { active, total: allIds.length, newNodes, removed };
  }, [selectedVersionId, filteredNodeIds, getNodeStatusForVersion]);

  const diffResult = useMemo(() => {
    if (!compareA || !compareB || compareA === compareB) return null;
    const changes = compareVersions(compareA, compareB);
    const added = changes.filter(c => c.change === 'added').length;
    const removed = changes.filter(c => c.change === 'removed').length;
    const changed = changes.filter(c => c.change === 'unchanged').length;
    return { added, removed, changed, changes };
  }, [compareA, compareB, compareVersions]);

  const selectedNodeVersions = useMemo(() => {
    if (!selectedNode) return [];
    const assignments = productVersionAssignments.get(selectedNode);
    if (!assignments) return [];
    return versionDefinitions.filter(v => assignments.has(v.id));
  }, [selectedNode, productVersionAssignments, versionDefinitions]);

  if (!isStoreLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-slate-500">Loading version data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between px-6 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">Version-Aware Topology</h1>
          <select
            value={selectedVersionId}
            onChange={e => {
              const v = e.target.value;
              setSelectedVersionId(v);
              if (v !== 'all') {
                const def = versionDefinitions.find(d => d.id === v);
                if (def) storeSetVersion(def.id.toLowerCase().replace(/\s+/g, '-'));
              }
            }}
            className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Versions</option>
            {versionDefinitions.map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              compareMode
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {compareMode ? 'Side-by-Side: ON' : 'Compare Mode'}
          </button>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span>{versionStats.active}/{versionStats.total} nodes active</span>
          {versionStats.newNodes > 0 && (
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">+{versionStats.newNodes} new</span>
          )}
          {versionStats.removed > 0 && (
            <span className="text-red-500 dark:text-red-400 font-medium">-{versionStats.removed} removed</span>
          )}
        </div>
      </header>

      {compareMode && diffResult && (
        <div className="flex items-center gap-4 px-6 py-2 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800 shrink-0 text-xs">
          <span className="font-semibold text-amber-800 dark:text-amber-200">Diff: {compareA} vs {compareB}</span>
          <span className="text-emerald-700 dark:text-emerald-300">Added: {diffResult.added} products</span>
          <span className="text-red-600 dark:text-red-400">Removed: {diffResult.removed} products</span>
          <span className="text-slate-600 dark:text-slate-400">Changed: {diffResult.changed} connections</span>
        </div>
      )}

      <div className={`flex-1 flex ${compareMode ? 'flex-row' : 'flex-row'} overflow-hidden relative`}>
        <div className={`${compareMode ? 'w-1/2' : 'w-full'} relative border-r border-slate-200 dark:border-slate-800`}>
          {compareMode ? (
            <>
              <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                <span className="px-2 py-0.5 bg-white/80 dark:bg-slate-900/80 rounded text-xs text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-medium">Version A</span>
                <select
                  value={compareA}
                  onChange={e => setCompareA(e.target.value)}
                  className="px-2 py-0.5 border border-slate-300 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {versionDefinitions.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>
              <svg ref={svgRef1} className="absolute inset-0 w-full h-full" style={{ cursor: 'grab' }}
                onClick={() => setSelectedNode(null)}>
                <rect width="100%" height="100%" fill="#f8fafc" />
                {renderTopology(new Set(getProductsForVersionId(compareA).filter(id => nodeMap.has(id))), getConnectionsForVersionId(compareA), zoomGroupRef1, compareA)}
              </svg>
            </>
          ) : (
            <>
              <svg ref={svgRef1} className="absolute inset-0 w-full h-full" style={{ cursor: 'grab' }}
                onClick={() => setSelectedNode(null)}>
                <rect width="100%" height="100%" fill="#f8fafc" />
                {renderTopology(filteredNodeIds, filteredConnections, zoomGroupRef1, selectedVersionId)}
              </svg>
              <div className="absolute top-3 left-3 px-2 py-1 bg-white/80 dark:bg-slate-900/80 rounded text-xs text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                {selectedVersionId === 'all' ? 'All Versions' : selectedVersionId}
              </div>
            </>
          )}
        </div>

        {compareMode && (
          <div className="w-1/2 relative">
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
              <span className="px-2 py-0.5 bg-white/80 dark:bg-slate-900/80 rounded text-xs text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-medium">Version B</span>
              <select
                value={compareB}
                onChange={e => setCompareB(e.target.value)}
                className="px-2 py-0.5 border border-slate-300 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {versionDefinitions.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
            <svg ref={svgRef2} className="absolute inset-0 w-full h-full" style={{ cursor: 'grab' }}>
              <rect width="100%" height="100%" fill="oklch(0.985 0 0)" className="dark:fill-slate-950" />
              {renderTopology(new Set(getProductsForVersionId(compareB).filter(id => nodeMap.has(id))), getConnectionsForVersionId(compareB), zoomGroupRef2, compareB)}
            </svg>
          </div>
        )}
      </div>

      {selectedNode && (
        <div className="absolute bottom-4 left-4 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-4 z-10">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
              {nodeMap.get(selectedNode)?.name || selectedNode}
            </h3>
            <button onClick={() => setSelectedNode(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-lg leading-none">&times;</button>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            Type: {nodeMap.get(selectedNode)?.type?.toUpperCase() || 'Unknown'}
          </div>
          {selectedNodeVersions.length > 0 && (
            <div className="mb-3">
              <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">Active in Versions</div>
              <div className="flex flex-wrap gap-1">
                {selectedNodeVersions.map(v => (
                  <span key={v.id} className="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded text-xs font-medium">
                    {v.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          {selectedNodeVersions.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-red-500 dark:text-red-400 mb-1">Impact Summary</div>
              {selectedNodeVersions.map(v => {
                const allProds = getProductsForVersionId(v.id);
                const isCritical = nodeMap.get(selectedNode)?.category === 'core';
                const consumers = nodeMap.get(selectedNode)?.consumers || [];
                const affectedConsumers = consumers.filter(c => allProds.includes(c));
                return (
                  <div key={v.id} className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                    <span className="font-medium">If removed from {v.name}:</span>{' '}
                    {isCritical
                      ? 'Critical impact — core service. Cascading failures likely.'
                      : affectedConsumers.length > 0
                        ? `${affectedConsumers.length} downstream consumers affected.`
                        : 'No direct downstream impact detected.'}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <footer className="flex items-center gap-6 px-6 py-2 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.6)]"></span>
          <span className="text-slate-600 dark:text-slate-400">Green: Added in this version</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_4px_rgba(245,158,11,0.6)]"></span>
          <span className="text-slate-600 dark:text-slate-400">Amber: Modified</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.6)]"></span>
          <span className="text-slate-600 dark:text-slate-400">Red: Removed from previous</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600"></span>
          <span className="text-slate-600 dark:text-slate-400">Grey: Unchanged</span>
        </div>
      </footer>

      <div className="absolute bottom-12 right-4 flex gap-1 bg-white/90 dark:bg-slate-900/90 rounded-lg px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 shadow-sm border border-slate-200 dark:border-slate-700">
        <span>Scroll to zoom</span>
        <span className="text-slate-300 dark:text-slate-600">|</span>
        <span>Drag to pan</span>
      </div>
    </div>
  );
}
