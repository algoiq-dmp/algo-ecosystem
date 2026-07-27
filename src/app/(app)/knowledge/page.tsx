'use client';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { nodes } from '@/data/ecosystem';
import { FiSearch } from 'react-icons/fi';

const typeColors: Record<string, string> = {
  product: '#10B981',
  engine: '#F59E0B',
  api: '#8B5CF6',
  infrastructure: '#6366F1',
  strategy: '#3B82F6',
  broker: '#6B7280',
  exchange: '#6B7280',
  database: '#14B8A6',
};

const typeShapes: Record<string, 'circle' | 'rect' | 'rounded' | 'diamond'> = {
  product: 'rounded',
  engine: 'circle',
  api: 'diamond',
  infrastructure: 'rect',
  strategy: 'rounded',
  broker: 'circle',
  exchange: 'circle',
  database: 'rect',
};

const typeOrder = ['product', 'engine', 'api', 'infrastructure', 'strategy', 'broker', 'exchange'];

interface GraphNode {
  id: string;
  name: string;
  type: string;
  color: string;
  x: number;
  y: number;
}

export default function KnowledgeGraphPage() {
  const [search, setSearch] = useState('');
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; node: GraphNode } | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const graphNodes = useMemo(() => {
    const typeGroups = new Map<string, string[]>();
    nodes.forEach(n => {
      const arr = typeGroups.get(n.type) || [];
      arr.push(n.id);
      typeGroups.set(n.type, arr);
    });

    const result: GraphNode[] = [];
    const centerX = 500;
    const centerY = 300;
    const radii = [60, 130, 200, 270, 340, 400, 460];

    let ringIdx = 0;
    for (const type of typeOrder) {
      const ids = typeGroups.get(type);
      if (!ids || ids.length === 0) continue;
      const r = radii[ringIdx] || radii[radii.length - 1];
      const count = ids.length;
      ids.forEach((id, i) => {
        const angle = (2 * Math.PI * i) / count - Math.PI / 2;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);
        const node = nodes.find(n => n.id === id);
        if (node) {
          result.push({ id: node.id, name: node.name, type: node.type, color: node.color, x, y });
        }
      });
      ringIdx++;
    }
    return result;
  }, []);

  useEffect(() => {
    setPositions(prev => {
      if (Object.keys(prev).length > 0) return prev;
      const initial: Record<string, { x: number; y: number }> = {};
      graphNodes.forEach(n => { initial[n.id] = { x: n.x, y: n.y }; });
      return initial;
    });
  }, [graphNodes]);

  const currentPositions = useMemo(() => {
    const result: GraphNode[] = [];
    graphNodes.forEach(n => {
      const pos = positions[n.id] || { x: n.x, y: n.y };
      result.push({ ...n, x: pos.x, y: pos.y });
    });
    return result;
  }, [graphNodes, positions]);

  const connections = useMemo(() => {
    const conns: { source: string; target: string }[] = [];
    nodes.forEach(n => {
      n.dependencies.forEach(dep => {
        conns.push({ source: dep, target: n.id });
      });
    });
    return conns;
  }, []);

  const filteredIds = useMemo(() => {
    if (!search.trim()) return new Set<string>();
    const q = search.toLowerCase();
    return new Set(nodes.filter(n => n.name.toLowerCase().includes(q)).map(n => n.id));
  }, [search]);

  const isDimmed = useCallback((id: string) => {
    if (!highlightedId && filteredIds.size === 0) return false;
    if (highlightedId) {
      if (id === highlightedId) return false;
      const n = nodes.find(nd => nd.id === highlightedId);
      if (!n) return true;
      return !n.dependencies.includes(id) && !n.consumers.includes(id);
    }
    if (filteredIds.size > 0) return !filteredIds.has(id);
    return false;
  }, [highlightedId, filteredIds]);

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDragging(id);
  };

  useEffect(() => {
    if (!dragging) return;
    const handleMove = (e: MouseEvent) => {
      setPositions(prev => ({
        ...prev,
        [dragging]: { x: e.clientX - 280, y: e.clientY - 150 }
      }));
    };
    const handleUp = () => setDragging(null);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [dragging]);

  const handleNodeClick = (id: string) => {
    setHighlightedId(prev => prev === id ? null : id);
  };

  function renderNodeShape(n: GraphNode, isDim: boolean) {
    const opacity = isDim ? 0.15 : 1;
    const c = n.color;
    const w = 80;
    const h = 34;

    switch (typeShapes[n.type]) {
      case 'circle':
        return <circle cx={n.x} cy={n.y} r={16} fill={c} fillOpacity={opacity * 0.2} stroke={c} strokeWidth="1.5" />;
      case 'diamond':
        return <polygon points={`${n.x},${n.y - 16} ${n.x + 18},${n.y} ${n.x},${n.y + 16} ${n.x - 18},${n.y}`} fill={c} fillOpacity={opacity * 0.15} stroke={c} strokeWidth="1.5" />;
      case 'rect':
        return <rect x={n.x - w / 2} y={n.y - h / 2} width={w} height={h} rx="2" fill={c} fillOpacity={opacity * 0.15} stroke={c} strokeWidth="1.5" />;
      case 'rounded':
      default:
        return <rect x={n.x - w / 2} y={n.y - h / 2} width={w} height={h} rx="8" fill={c} fillOpacity={opacity * 0.15} stroke={c} strokeWidth="1.5" />;
    }
  }

  return (
    <div className="h-full overflow-y-auto p-6 font-sans relative select-none">
      <h1 className="text-2xl font-bold mb-2">Knowledge Graph</h1>
      <p className="text-slate-400 mb-6 text-sm">Interactive visualization of the ALGO IQ ecosystem</p>

      <div className="relative mb-4 max-w-md">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); if (e.target.value) setHighlightedId(null); }}
          placeholder="Search nodes..."
          className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 overflow-auto">
        <svg width="1000" height="620" viewBox="0 0 1000 620" style={{ minWidth: '600px' }}>
          <defs>
            <marker id="kgArrow" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
              <polygon points="0 0, 6 2, 0 4" fill="#475569" />
            </marker>
          </defs>

          {connections.map((conn, i) => {
            const source = currentPositions.find(p => p.id === conn.source);
            const target = currentPositions.find(p => p.id === conn.target);
            if (!source || !target) return null;
            const dim = isDimmed(conn.source) || isDimmed(conn.target);
            if (dim) return null;
            return (
              <line
                key={i}
                x1={source.x} y1={source.y} x2={target.x} y2={target.y}
                stroke="#475569" strokeWidth="0.5" opacity="0.4"
              />
            );
          })}

          {currentPositions.map(n => {
            const dim = isDimmed(n.id);
            return (
              <g
                key={n.id}
                onMouseDown={(e) => handleMouseDown(e, n.id)}
                onClick={() => handleNodeClick(n.id)}
                onMouseEnter={(e) => !dragging && setTooltip({ x: n.x, y: n.y, node: n })}
                onMouseMove={(e) => !dragging && setTooltip({ x: n.x, y: n.y, node: n })}
                onMouseLeave={() => !dragging && setTooltip(null)}
                style={{ cursor: dragging === n.id ? 'grabbing' : 'pointer' }}
              >
                {renderNodeShape(n, dim)}
                <text
                  x={n.x}
                  y={n.y + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={n.color}
                  fontSize="9"
                  fontWeight={n.id === highlightedId ? 'bold' : 'normal'}
                  opacity={dim ? 0.2 : 0.9}
                  pointerEvents="none"
                >
                  {n.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {tooltip && (
        <div
          className="fixed z-50 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 shadow-xl pointer-events-none"
          style={{ left: tooltip.x + 280, top: tooltip.y + 100 }}
        >
          <div className="text-sm font-medium text-slate-100">{tooltip.node.name}</div>
          <div className="text-xs text-slate-400 capitalize">{tooltip.node.type}</div>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-4">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 w-full">Legend</div>
        {Object.entries(typeColors).filter(([t]) => typeOrder.includes(t)).map(([type, color]) => (
          <div key={type} className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-1.5">
            <svg width="16" height="16" viewBox="0 0 16 16">
              {typeShapes[type] === 'circle' && <circle cx={8} cy={8} r={6} fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1" />}
              {typeShapes[type] === 'diamond' && <polygon points="8,2 14,8 8,14 2,8" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1" />}
              {typeShapes[type] === 'rect' && <rect x={2} y={3} width={12} height={10} rx="1" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1" />}
              {typeShapes[type] === 'rounded' && <rect x={2} y={3} width={12} height={10} rx="3" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1" />}
            </svg>
            <span className="text-xs text-slate-300 capitalize">{type.replace('-', ' ')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
