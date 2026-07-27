'use client';
import { useState, useMemo } from 'react';
import { nodes } from '@/data/ecosystem';
import type { EcosystemNode } from '@/types';
import { FiSearch, FiCheck, FiClock } from 'react-icons/fi';

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const readinessCategories = [
  { key: 'development', label: 'Development', min: 80, max: 100 },
  { key: 'documentation', label: 'Documentation', min: 60, max: 100 },
  { key: 'testing', label: 'Testing', min: 70, max: 100 },
  { key: 'securityReview', label: 'Security Review', min: 60, max: 90 },
  { key: 'performanceTesting', label: 'Performance Testing', min: 50, max: 100 },
  { key: 'uat', label: 'UAT', min: 40, max: 100 },
  { key: 'productionApproval', label: 'Production Approval', min: 30, max: 100 },
  { key: 'licenseReadiness', label: 'License Readiness', min: 70, max: 100 },
  { key: 'deploymentReadiness', label: 'Deployment Readiness', min: 60, max: 100 },
];

function getBarColor(pct: number): string {
  if (pct >= 100) return 'bg-green-500';
  if (pct >= 80) return 'bg-blue-500';
  if (pct >= 60) return 'bg-amber-500';
  return 'bg-red-500';
}

function getTextColor(pct: number): string {
  if (pct >= 100) return 'text-green-400';
  if (pct >= 80) return 'text-blue-400';
  if (pct >= 60) return 'text-amber-400';
  return 'text-red-400';
}

interface ReadinessData {
  node: EcosystemNode;
  scores: Record<string, number>;
  overall: number;
}

function generateReadiness(ecosystemNodes: EcosystemNode[]): ReadinessData[] {
  return ecosystemNodes.map((n, idx) => {
    const scores: Record<string, number> = {};
    let total = 0;
    readinessCategories.forEach((cat, ci) => {
      const seed = idx * 100 + ci * 7 + n.id.length;
      const pct = Math.round(cat.min + seededRandom(seed) * (cat.max - cat.min));
      scores[cat.key] = pct;
      total += pct;
    });
    return {
      node: n,
      scores,
      overall: Math.round(total / readinessCategories.length),
    };
  });
}

export default function ReadinessPage() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'overall' | 'name'>('overall');

  const allReadiness = useMemo(() => {
    const filteredNodes = nodes.filter(n => n.type === 'product' || n.type === 'engine');
    return generateReadiness(filteredNodes);
  }, []);

  const filtered = useMemo(() => {
    let result = allReadiness;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(r => r.node.name.toLowerCase().includes(q));
    }
    if (sortBy === 'overall') {
      result = [...result].sort((a, b) => b.overall - a.overall);
    } else {
      result = [...result].sort((a, b) => a.node.name.localeCompare(b.node.name));
    }
    return result;
  }, [allReadiness, search, sortBy]);

  return (
    <div className="h-full overflow-y-auto p-6 font-sans">
      <h1 className="text-2xl font-bold mb-2">Production Readiness Dashboard</h1>
      <p className="text-slate-400 mb-6 text-sm">Track readiness across all products and engines</p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products and engines..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => setSortBy('overall')}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              sortBy === 'overall' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Sort by Readiness
          </button>
          <button
            onClick={() => setSortBy('name')}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              sortBy === 'name' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Sort by Name
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(rd => (
          <div
            key={rd.node.id}
            className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden"
            style={{ borderTopColor: rd.node.color, borderTopWidth: '3px' }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: rd.node.color }} />
                  <span className="font-semibold text-sm">{rd.node.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {rd.overall === 100 ? <FiCheck size={14} className="text-green-400" /> :
                   rd.overall >= 80 ? <FiCheck size={14} className="text-blue-400" /> :
                   <FiClock size={14} className="text-amber-400" />}
                  <span className={`font-bold text-lg ${getTextColor(rd.overall)}`}>{rd.overall}%</span>
                </div>
              </div>

              <div className="space-y-3">
                {readinessCategories.map(cat => {
                  const pct = rd.scores[cat.key];
                  return (
                    <div key={cat.key}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">{cat.label}</span>
                        <span className={`${getTextColor(pct)}`}>{pct}%</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${getBarColor(pct)}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-slate-500 text-sm py-12 text-center">No products or engines found matching your search.</p>
      )}
    </div>
  );
}
