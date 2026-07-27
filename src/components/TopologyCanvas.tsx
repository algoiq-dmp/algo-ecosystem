'use client';
import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { nodes, connections, connectionTypeColors, serverGroups } from '@/data/ecosystem';
import { EcosystemNode } from '@/types';

interface TopologyCanvasProps {
  selectedNode: string | null;
  onSelectNode: (id: string | null) => void;
  searchQuery: string;
  theme: 'light' | 'dark';
  activeTypes?: Set<string>;
}

interface Position { x: number; y: number; }

export default function TopologyCanvas({ selectedNode, onSelectNode, searchQuery, theme, activeTypes }: TopologyCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomGroupRef = useRef<SVGGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodePositions, setNodePositions] = useState<Map<string, Position>>(() => {
    const m = new Map<string, Position>();
    nodes.forEach(n => m.set(n.id, { x: n.x, y: n.y }));
    return m;
  });
  const [dragging, setDragging] = useState<string | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const resize = () => {
      if (containerRef.current) {
        containerRef.current.style.width;
      }
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    if (!svgRef.current || !zoomGroupRef.current) return;
    const svg = d3.select(svgRef.current);

    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.15, 4])
      .filter((event) => {
        const target = event.target as HTMLElement;
        if (target.closest('[data-node="true"]')) return false;
        if (event.type === 'dblclick') return true;
        if (event.type === 'wheel') return true;
        return true;
      })
      .on('zoom', (event) => {
        d3.select(zoomGroupRef.current).attr('transform', event.transform.toString());
      });

    svg.call(zoomBehavior);

    return () => {
      svg.on('.zoom', null);
    };
  }, []);

  const getRelatedNodes = useCallback((nodeId: string): Set<string> => {
    const related = new Set<string>([nodeId]);
    connections.forEach(c => {
      if (c.source === nodeId) related.add(c.target);
      if (c.target === nodeId) related.add(c.source);
    });
    return related;
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    const matched = new Set<string>();
    nodes.forEach(n => {
      if (n.name.toLowerCase().includes(q) || n.description.toLowerCase().includes(q) || n.server.toLowerCase().includes(q)) {
        matched.add(n.id);
        const related = getRelatedNodes(n.id);
        related.forEach(r => matched.add(r));
      }
    });
    return matched;
  }, [searchQuery, getRelatedNodes]);

  const highlightedNodes = useMemo(() => {
    if (searchResults) return searchResults;
    if (selectedNode) return getRelatedNodes(selectedNode);
    return new Set<string>(nodes.map(n => n.id));
  }, [selectedNode, searchResults, getRelatedNodes]);

  const highlightedConnections = useMemo(() => {
    if (!selectedNode && !searchResults) return null;
    const highlightNodes = searchResults || (selectedNode ? getRelatedNodes(selectedNode) : new Set<string>());
    const result = new Set<string>();
    connections.forEach(c => {
      if (highlightNodes.has(c.source) && highlightNodes.has(c.target)) {
        result.add(c.id);
      }
    });
    return result;
  }, [selectedNode, searchResults, getRelatedNodes]);

  const handleMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    const svgEl = svgRef.current;
    if (!svgEl) return;
    const ct = svgEl.getScreenCTM();
    if (!ct) return;
    const pos = nodePositions.get(nodeId);
    if (!pos) return;
    dragOffset.current = {
      x: e.clientX - pos.x * ct.a - ct.e,
      y: e.clientY - pos.y * ct.d - ct.f,
    };
    setDragging(nodeId);
    onSelectNode(nodeId);
  }, [nodePositions, onSelectNode]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging || !svgRef.current) return;
    const ct = svgRef.current.getScreenCTM();
    if (!ct) return;
    const newX = (e.clientX - dragOffset.current.x - ct.e) / ct.a;
    const newY = (e.clientY - dragOffset.current.y - ct.f) / ct.d;
    setNodePositions(prev => {
      const next = new Map(prev);
      next.set(dragging, { x: newX, y: newY });
      return next;
    });
  }, [dragging]);

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  const getNodeColor = (node: EcosystemNode) => {
    const server = serverGroups.find(s => s.nodes.includes(node.id));
    return server?.color || node.color;
  };

  const visibleNodes = useMemo(() => {
    if (!activeTypes || activeTypes.size === 0) return new Set(nodes.map(n => n.id));
    return new Set(nodes.filter(n => activeTypes.has(n.type)).map(n => n.id));
  }, [activeTypes]);

  const visibleConnections = useMemo(() => {
    return connections.filter(c => visibleNodes.has(c.source) && visibleNodes.has(c.target));
  }, [visibleNodes]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden bg-white dark:bg-slate-950"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={() => onSelectNode(null)}
    >
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid-light" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
          </pattern>
          <pattern id="grid-dark" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={theme === 'dark' ? 'url(#grid-dark)' : 'url(#grid-light)'} />
      </svg>

      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full"
        style={{ cursor: dragging ? 'grabbing' : 'grab' }}
      >
        <g ref={zoomGroupRef}>
          {serverGroups.map(group => {
            const groupPositions = group.nodes
              .map(id => nodePositions.get(id))
              .filter(Boolean) as Position[];
            if (groupPositions.length < 2) return null;
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

          {visibleConnections.map(conn => {
            const sourcePos = nodePositions.get(conn.source);
            const targetPos = nodePositions.get(conn.target);
            if (!sourcePos || !targetPos) return null;
            const isHighlighted = !highlightedConnections || highlightedConnections.has(conn.id);
            const opacity = isHighlighted ? 0.8 : 0.1;
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
                  strokeWidth={isHighlighted ? 2 : 1} opacity={opacity}
                  strokeDasharray={conn.protocol === 'WebSocket' ? '6,3' : 'none'}
                  style={{ transition: 'opacity 0.3s, stroke-width 0.3s' }} />
                {conn.bidirectional && (
                  <path d={pathD} fill="none" stroke={color}
                    strokeWidth={isHighlighted ? 1 : 0.5} opacity={opacity * 0.5} strokeDasharray="4,6" />
                )}
                {isHighlighted && (
                  <circle r={4} fill={color} opacity={0.9} className="animate-packet">
                    <animateMotion dur={dist < 300 ? '2s' : '3s'} repeatCount="indefinite" path={pathD} />
                  </circle>
                )}
              </g>
            );
          })}

          {nodes.map(node => {
            const pos = nodePositions.get(node.id);
            if (!pos) return null;
            const typeVisible = !activeTypes || activeTypes.size === 0 || activeTypes.has(node.type);
            const color = getNodeColor(node);
            const isHighlighted = highlightedNodes.has(node.id);
            const isSelected = selectedNode === node.id;
            const opacity = isHighlighted ? 1 : 0.2;
            const scale = isSelected ? 1.15 : 1;
            const isDownstream = selectedNode && visibleConnections.some(c => c.source === selectedNode && c.target === node.id);
            const isUpstream = selectedNode && visibleConnections.some(c => c.target === selectedNode && c.source === node.id);
            const isCritical = (node as any).criticality === 'critical';
            const borderColor = isCritical ? '#F59E0B' : color;
            const borderWidth = isCritical ? (isSelected ? 3 : 2.5) : (isSelected ? 3 : 1.5);
            const nodeWidth = Math.max(node.name.length * 8 + 24, 100);
            const nodeHeight = 56;

            if (!typeVisible) {
              return (
                <g key={node.id}
                  transform={`translate(${pos.x - nodeWidth / 2}, ${pos.y - nodeHeight / 2})`}
                  opacity={0}
                  pointerEvents="none">
                </g>
              );
            }

            return (
              <g key={node.id}
                data-node="true"
                transform={`translate(${pos.x - nodeWidth / 2}, ${pos.y - nodeHeight / 2}) scale(${scale})`}
                opacity={opacity}
                style={{ cursor: dragging === node.id ? 'grabbing' : 'pointer', transition: 'opacity 0.3s' }}
                onMouseDown={(e) => handleMouseDown(e, node.id)}
                onClick={(e) => { e.stopPropagation(); onSelectNode(node.id); }}>
                <rect x={0} y={0} width={nodeWidth} height={nodeHeight} rx={10} ry={10}
                  fill={theme === 'dark' ? '#1e293b' : '#ffffff'}
                  stroke={borderColor} strokeWidth={borderWidth}
                  filter={isSelected ? `drop-shadow(0 0 8px ${color}80)` : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'} />
                <path d={`M 0 10 Q 0 0 10 0 L ${nodeWidth - 10} 0 Q ${nodeWidth} 0 ${nodeWidth} 10 L ${nodeWidth} 6 L 0 6 Z`} fill={color} />
                <circle cx={nodeWidth - 8} cy={8} r={4}
                  fill={node.status === 'online' ? '#10B981' : node.status === 'degraded' ? '#F59E0B' : '#EF4444'}
                  stroke="#fff" strokeWidth={1} />
                <text x={nodeWidth / 2} y={26} textAnchor="middle" fontSize={11} fontWeight={700}
                  fill={theme === 'dark' ? '#f1f5f9' : '#1e293b'} fontFamily="system-ui">
                  {node.name}
                </text>
                <text x={nodeWidth / 2} y={42} textAnchor="middle" fontSize={9}
                  fill={theme === 'dark' ? '#94a3b8' : '#64748b'} fontFamily="system-ui">
                  {node.alias || node.type.toUpperCase()}
                </text>
                {isDownstream && (
                  <rect x={0} y={0} width={nodeWidth} height={nodeHeight} rx={10} ry={10}
                    fill="none" stroke="#10B981" strokeWidth={2} strokeDasharray="4,2" opacity={0.5} />
                )}
                {isUpstream && (
                  <rect x={0} y={0} width={nodeWidth} height={nodeHeight} rx={10} ry={10}
                    fill="none" stroke="#3B82F6" strokeWidth={2} strokeDasharray="4,2" opacity={0.5} />
                )}
              </g>
            );
          })}
        </g>
      </svg>

      <div className="absolute bottom-4 right-4 flex gap-1 bg-white/90 dark:bg-slate-900/90 rounded-lg px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 shadow-sm border border-slate-200 dark:border-slate-700">
        <span>Scroll to zoom</span>
        <span className="text-slate-300 dark:text-slate-600">|</span>
        <span>Drag to pan</span>
        <span className="text-slate-300 dark:text-slate-600">|</span>
        <span>Drag nodes to reposition</span>
      </div>
    </div>
  );
}
