'use client';
import { useState, useMemo, useRef, useEffect } from 'react';
import { nodes, connections, connectionTypeColors } from '@/data/ecosystem';
import type { EcosystemNode, Connection } from '@/types';
import { FiSearch, FiAlertTriangle, FiAlertCircle, FiCheck, FiClock, FiZap } from 'react-icons/fi';

type CriticalityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

function getCriticality(node: EcosystemNode): CriticalityLevel {
  const total = node.dependencies.length + node.consumers.length;
  if (total >= 15) return 'Critical';
  if (total >= 8) return 'High';
  if (total >= 4) return 'Medium';
  return 'Low';
}

const criticalityColors: Record<CriticalityLevel, string> = {
  Critical: 'bg-red-600',
  High: 'bg-amber-500',
  Medium: 'bg-blue-500',
  Low: 'bg-gray-400',
};

const criticalityBg: Record<CriticalityLevel, string> = {
  Critical: 'bg-red-900/20 border-red-500/50',
  High: 'bg-amber-900/20 border-amber-500/50',
  Medium: 'bg-blue-900/20 border-blue-500/50',
  Low: 'bg-gray-800/20 border-gray-500/50',
};

function buildRestartOrder(selectedId: string): string[] {
  const ordered: string[] = [];
  const visited = new Set<string>();
  function visit(id: string) {
    if (visited.has(id) || id === selectedId) return;
    visited.add(id);
    const connToSelected = connections.filter(c => c.target === selectedId && c.source === id);
    connToSelected.forEach(c => visit(c.source));
    if (id !== selectedId) ordered.push(id);
  }
  const node = nodes.find(n => n.id === selectedId);
  if (!node) return [];
  node.dependencies.forEach(depId => visit(depId));
  ordered.push(selectedId);
  return ordered;
}

function buildRecoveryOrder(selectedId: string): string[] {
  const ordered: string[] = [];
  const visited = new Set<string>();
  function visit(id: string) {
    if (visited.has(id)) return;
    visited.add(id);
    const connFromSelected = connections.filter(c => c.source === id);
    connFromSelected.forEach(c => visit(c.target));
    if (id !== selectedId) ordered.push(id);
  }
  ordered.push(selectedId);
  const node = nodes.find(n => n.id === selectedId);
  if (!node) return [];
  node.consumers.forEach(consId => visit(consId));
  return ordered;
}

export default function DependenciesPage() {
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'depends' | 'usedby' | 'impact'>('depends');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredNodes = useMemo(() => {
    if (!search.trim()) return nodes;
    const q = search.toLowerCase();
    return nodes.filter(n => n.name.toLowerCase().includes(q) || n.id.toLowerCase().includes(q) || n.type.toLowerCase().includes(q));
  }, [search]);

  const selected = useMemo(() => nodes.find(n => n.id === selectedId) || null, [selectedId]);

  const upstreamConns = useMemo(() => {
    if (!selectedId) return [];
    return connections.filter(c => c.target === selectedId);
  }, [selectedId]);

  const downstreamConns = useMemo(() => {
    if (!selectedId) return [];
    return connections.filter(c => c.source === selectedId);
  }, [selectedId]);

  const upstreamNodes = useMemo(() => {
    const ids = new Set(upstreamConns.map(c => c.source));
    return nodes.filter(n => ids.has(n.id));
  }, [upstreamConns]);

  const downstreamNodes = useMemo(() => {
    const ids = new Set(downstreamConns.map(c => c.target));
    return nodes.filter(n => ids.has(n.id));
  }, [downstreamConns]);

  const restartOrder = useMemo(() => (selectedId ? buildRestartOrder(selectedId) : []), [selectedId]);
  const recoveryOrder = useMemo(() => (selectedId ? buildRecoveryOrder(selectedId) : []), [selectedId]);

  const criticality = selected ? getCriticality(selected) : null;

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setShowDropdown(false);
    setSearch('');
  };

  return (
    <div className="h-full overflow-y-auto p-6 font-sans">
      <h1 className="text-2xl font-bold mb-6">Dependency Explorer</h1>

      <div className="relative mb-6" ref={dropdownRef}>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setShowDropdown(true); }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search and select a node..."
            className="w-full max-w-xl bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        {showDropdown && filteredNodes.length > 0 && (
          <div className="absolute z-50 mt-1 w-full max-w-xl bg-slate-800 border border-slate-700 rounded-lg max-h-64 overflow-y-auto shadow-xl">
            {filteredNodes.map(n => (
              <button
                key={n.id}
                onClick={() => handleSelect(n.id)}
                className={`w-full text-left px-4 py-3 hover:bg-slate-700 flex items-center gap-3 border-b border-slate-700/50 last:border-0 ${
                  selectedId === n.id ? 'bg-blue-900/30' : ''
                }`}
              >
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: n.color }} />
                <div>
                  <div className="font-medium text-sm">{n.name}</div>
                  <div className="text-xs text-slate-400 capitalize">{n.type} - {n.server}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selected.color }} />
              <span className="text-xl font-semibold">{selected.name}</span>
              <span className="text-sm text-slate-400 capitalize px-2 py-0.5 bg-slate-800 rounded">{selected.type}</span>
            </div>
            {criticality && (
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${criticalityColors[criticality]}`}>
                {criticality}
              </span>
            )}
            <span className="text-sm text-slate-400">
              {selected.dependencies.length + selected.consumers.length} total connections
            </span>
          </div>

          <div className={`rounded-lg border p-4 mb-6 ${criticality ? criticalityBg[criticality] : 'bg-slate-900 border-slate-700'}`}>
            <div className="flex items-center gap-2 mb-2">
              <FiAlertCircle className="text-amber-400" />
              <span className="font-semibold text-sm">Failure Impact</span>
            </div>
            <p className="text-sm text-slate-300">{selected.failureImpact}</p>
          </div>

          <div className="flex gap-1 mb-6 border-b border-slate-700">
            {(['depends', 'usedby', 'impact'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab === 'depends' ? `Depends On (${upstreamConns.length})` :
                 tab === 'usedby' ? `Used By (${downstreamConns.length})` :
                 'Impact Analysis'}
              </button>
            ))}
          </div>

          {activeTab === 'depends' && (
            <div>
              {upstreamConns.length === 0 ? (
                <p className="text-slate-500 text-sm py-8 text-center">No upstream dependencies found.</p>
              ) : (
                <div className="space-y-2">
                  {upstreamConns.map(conn => {
                    const sourceNode = nodes.find(n => n.id === conn.source);
                    return (
                      <div key={conn.id} className="flex items-center gap-4 bg-slate-800/50 rounded-lg px-4 py-3 border border-slate-700/50">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: sourceNode?.color || '#6B7280' }} />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{sourceNode?.name || conn.source}</div>
                          <div className="text-xs text-slate-500 capitalize">{sourceNode?.type || 'unknown'}</div>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300 capitalize">{conn.type.replace('-', ' ')}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-700/50 text-slate-400 font-mono">{conn.protocol}</span>
                        <div className="flex items-center gap-1 text-xs">
                          <div className={`w-2 h-2 rounded-full ${
                            conn.type === 'risk' || conn.type === 'order' ? 'bg-red-400' :
                            conn.type === 'market-data' || conn.type === 'ohlc' ? 'bg-green-400' :
                            'bg-amber-400'
                          }`} />
                          <span className="text-slate-500">
                            {conn.type === 'risk' || conn.type === 'order' ? 'Critical' :
                             conn.type === 'market-data' || conn.type === 'ohlc' ? 'Essential' : 'Normal'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {restartOrder.length > 0 && (
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-3">
                      <FiZap className="text-amber-400" />
                      <span className="font-semibold text-sm">Restart Order</span>
                    </div>
                    <ol className="space-y-1">
                      {restartOrder.map((id, i) => {
                        const n = nodes.find(nd => nd.id === id);
                        return (
                          <li key={id} className="flex items-center gap-2 text-sm">
                            <span className="text-slate-500 w-5 text-right">{i + 1}.</span>
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: n?.color || '#6B7280' }} />
                            <span className={id === selectedId ? 'font-bold text-blue-400' : 'text-slate-300'}>{n?.name || id}</span>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-3">
                      <FiClock className="text-green-400" />
                      <span className="font-semibold text-sm">Recovery Order</span>
                    </div>
                    <ol className="space-y-1">
                      {recoveryOrder.map((id, i) => {
                        const n = nodes.find(nd => nd.id === id);
                        return (
                          <li key={id} className="flex items-center gap-2 text-sm">
                            <span className="text-slate-500 w-5 text-right">{i + 1}.</span>
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: n?.color || '#6B7280' }} />
                            <span className={id === selectedId ? 'font-bold text-blue-400' : 'text-slate-300'}>{n?.name || id}</span>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'usedby' && (
            <div>
              {downstreamConns.length === 0 ? (
                <p className="text-slate-500 text-sm py-8 text-center">No downstream consumers found.</p>
              ) : (
                <div className="space-y-2">
                  {downstreamConns.map(conn => {
                    const targetNode = nodes.find(n => n.id === conn.target);
                    return (
                      <div key={conn.id} className="flex items-center gap-4 bg-slate-800/50 rounded-lg px-4 py-3 border border-slate-700/50">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: targetNode?.color || '#6B7280' }} />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{targetNode?.name || conn.target}</div>
                          <div className="text-xs text-slate-500 capitalize">{targetNode?.type || 'unknown'}</div>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300 capitalize">{conn.type.replace('-', ' ')}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-700/50 text-slate-400 font-mono">{conn.protocol}</span>
                        <div className="flex items-center gap-1 text-xs">
                          <div className={`w-2 h-2 rounded-full ${
                            conn.type === 'risk' || conn.type === 'order' ? 'bg-red-400' :
                            conn.type === 'market-data' || conn.type === 'ohlc' ? 'bg-green-400' :
                            'bg-amber-400'
                          }`} />
                          <span className="text-slate-500">
                            {conn.type === 'risk' || conn.type === 'order' ? 'Critical' :
                             conn.type === 'market-data' || conn.type === 'ohlc' ? 'Essential' : 'Normal'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'impact' && (
            <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50 overflow-x-auto">
              <svg width="900" height="500" viewBox="0 0 900 500">
                <defs>
                  <filter id="fade">
                    <feGaussianBlur stdDeviation="2" />
                  </filter>
                  <marker id="arrowHead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="#94A3B8" />
                  </marker>
                  <marker id="arrowBlue" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="#3B82F6" />
                  </marker>
                </defs>

                {upstreamNodes.map((n, i) => {
                  const x = 80;
                  const y = 60 + i * 45;
                  return (
                    <g key={n.id} opacity="0.6">
                      <rect x={x} y={y} width={120} height={32} rx={6} fill="none" stroke={n.color} strokeWidth="1" />
                      <text x={x + 60} y={y + 20} textAnchor="middle" fill="#E2E8F0" fontSize="10">{n.name}</text>
                    </g>
                  );
                })}

                <rect x={380} y={210} width={140} height={60} rx={10} fill={selected.color} fillOpacity="0.2" stroke={selected.color} strokeWidth="2" />
                <text x={450} y={236} textAnchor="middle" fill={selected.color} fontSize="13" fontWeight="bold">{selected.name}</text>
                <text x={450} y={254} textAnchor="middle" fill="#94A3B8" fontSize="9">{selected.type} | {criticality}</text>

                {upstreamNodes.map((n, i) => {
                  const y1 = 76 + i * 45;
                  return (
                    <line key={`up-${n.id}`} x1={200} y1={y1} x2={380} y2={240} stroke="#94A3B8" strokeWidth="1" markerEnd="url(#arrowHead)" opacity="0.5" />
                  );
                })}

                {downstreamNodes.map((n, i) => {
                  const x = 680;
                  const y = 60 + i * 45;
                  return (
                    <g key={n.id} opacity="0.6">
                      <rect x={x} y={y} width={120} height={32} rx={6} fill="none" stroke={n.color} strokeWidth="1" />
                      <text x={x + 60} y={y + 20} textAnchor="middle" fill="#E2E8F0" fontSize="10">{n.name}</text>
                    </g>
                  );
                })}

                {downstreamNodes.map((n, i) => {
                  const y1 = 76 + i * 45;
                  return (
                    <line key={`down-${n.id}`} x1={520} y1={240} x2={680} y2={y1} stroke="#3B82F6" strokeWidth="1" markerEnd="url(#arrowBlue)" opacity="0.5" />
                  );
                })}

                <text x={50} y={480} fill="#94A3B8" fontSize="9" textAnchor="middle">Upstream</text>
                <text x={450} y={480} fill="#94A3B8" fontSize="9" textAnchor="middle">Focused Node</text>
                <text x={780} y={480} fill="#94A3B8" fontSize="9" textAnchor="middle">Downstream</text>
              </svg>
            </div>
          )}
        </>
      )}

      {!selected && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <FiSearch size={32} className="mb-3" />
          <p>Search and select a node to explore its dependencies</p>
        </div>
      )}
    </div>
  );
}
