'use client';
import { useState } from 'react';
import { architectureDocs } from '@/data/architecture';
import type { ArchitectureDoc } from '@/data/architecture';
import { FiLayers, FiActivity, FiShield, FiServer, FiDatabase, FiTarget, FiZap } from 'react-icons/fi';

const categories = [
  { key: 'all', label: 'All', icon: FiLayers },
  { key: 'infrastructure', label: 'Infrastructure', icon: FiServer },
  { key: 'data-flow', label: 'Data Flow', icon: FiDatabase },
  { key: 'execution', label: 'Execution', icon: FiActivity },
  { key: 'security', label: 'Security', icon: FiShield },
  { key: 'deployment', label: 'Deployment', icon: FiTarget },
  { key: 'integration', label: 'Integration', icon: FiZap },
] as const;

const categoryColors: Record<string, string> = {
  infrastructure: '#3B82F6',
  'data-flow': '#10B981',
  execution: '#F59E0B',
  security: '#EF4444',
  deployment: '#8B5CF6',
  integration: '#6366F1',
};

const categoryBg: Record<string, string> = {
  infrastructure: 'bg-blue-500/10 border-blue-500/40',
  'data-flow': 'bg-emerald-500/10 border-emerald-500/40',
  execution: 'bg-amber-500/10 border-amber-500/40',
  security: 'bg-red-500/10 border-red-500/40',
  deployment: 'bg-violet-500/10 border-violet-500/40',
  integration: 'bg-indigo-500/10 border-indigo-500/40',
};

export default function ArchitecturePage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = activeCategory === 'all'
    ? architectureDocs
    : architectureDocs.filter(d => d.category === activeCategory);

  return (
    <div className="h-full overflow-y-auto p-6 font-sans">
      <h1 className="text-2xl font-bold mb-2">Architecture Explorer</h1>
      <p className="text-slate-400 mb-6 text-sm">Explore the ALGO IQ ecosystem architecture documentation</p>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => { setActiveCategory(cat.key); setExpandedId(null); }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === cat.key
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
            }`}
          >
            <cat.icon size={14} />
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(doc => {
          const isExpanded = expandedId === doc.id;
          const color = categoryColors[doc.category] || '#6B7280';
          return (
            <div
              key={doc.id}
              className={`rounded-xl border transition-all duration-300 cursor-pointer ${
                categoryBg[doc.category] || 'bg-slate-800/50 border-slate-700'
              } ${isExpanded ? 'lg:col-span-3 md:col-span-2 shadow-lg shadow-${color}/10' : ''}`}
              onClick={() => setExpandedId(isExpanded ? null : doc.id)}
              style={{ borderLeftColor: color, borderLeftWidth: '4px' }}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-semibold text-slate-100">{doc.title}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full capitalize flex-shrink-0" style={{ backgroundColor: color + '20', color }}>
                    {doc.category.replace('-', ' ')}
                  </span>
                </div>
                <p className="text-sm text-slate-400 line-clamp-2">{doc.description}</p>
              </div>

              {isExpanded && (
                <div className="px-5 pb-5 border-t border-slate-700/50 pt-4 space-y-5">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Full Description</h4>
                    <p className="text-sm text-slate-300">{doc.details}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Diagram</h4>
                    <div className="bg-slate-900 rounded-lg p-3 border border-slate-700/50">
                      <p className="text-xs text-slate-500 italic leading-relaxed">{doc.diagramDescription}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Key Components</h4>
                    <div className="flex flex-wrap gap-2">
                      {doc.keyComponents.map(kc => (
                        <span key={kc} className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: color + '15', color }}>
                          {kc}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Architecture Principles</h4>
                    <ol className="space-y-1">
                      {doc.principles.map((p, i) => (
                        <li key={i} className="text-sm text-slate-300 flex gap-2">
                          <span className="text-slate-500 flex-shrink-0">{i + 1}.</span>
                          {p}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
