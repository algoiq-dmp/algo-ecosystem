'use client';

import { useState, useMemo } from 'react';
import {
  FiClock, FiCalendar, FiBox, FiServer, FiGitBranch, FiActivity,
} from 'react-icons/fi';
import { usePMOStore } from '@/stores';

type VersionDef = {
  id: string;
  name: string;
  label: string;
  status: 'active' | 'draft' | 'archived';
  releaseDate: string;
  description: string;
};

const statusDot: Record<string, string> = {
  active: 'bg-blue-500',
  draft: 'border-2 border-dashed border-amber-400 bg-transparent',
  archived: 'bg-slate-400',
};

const statusBadge: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  draft: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  archived: 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
};

function buildVersionDefs(defs: { id: string; name: string; label: string; status: string; releaseDate: string; description: string }[]): VersionDef[] {
  return defs.sort((a, b) => a.releaseDate.localeCompare(b.releaseDate)).map(v => ({
    ...v,
    status: v.status as VersionDef['status'],
  }));
}

export default function VersionTimelinePage() {
  const products = usePMOStore((s) => s.products);
  const selectedVersion = usePMOStore((s) => s.selectedVersion);
  const setSelectedVersion = usePMOStore((s) => s.setSelectedVersion);
  const productVersionAssignments = usePMOStore((s) => s.productVersionAssignments);

  const versionDefs = useMemo(
    () => buildVersionDefs(usePMOStore.getState().versionDefinitions || []),
    [],
  );

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const productCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const a of productVersionAssignments) {
      if (a.active) map[a.versionId] = (map[a.versionId] || 0) + 1;
    }
    return map;
  }, [productVersionAssignments]);

  const productsForVersion = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const a of productVersionAssignments) {
      if (!a.active) continue;
      if (!map[a.versionId]) map[a.versionId] = [];
      const product = products.find((p) => p.id === a.productId);
      if (product && !map[a.versionId].includes(product.name)) {
        map[a.versionId].push(product.name);
      }
    }
    return map;
  }, [productVersionAssignments, products]);

  const connectionCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const a of productVersionAssignments) {
      if (!a.active) continue;
      if (!map[a.versionId]) map[a.versionId] = 0;
      const product = products.find((p) => p.id === a.productId);
      if (product) {
        map[a.versionId] += product.dependencies.length;
      }
    }
    return map;
  }, [productVersionAssignments, products]);

  const serverCounts = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    for (const a of productVersionAssignments) {
      if (!a.active) continue;
      if (!map[a.versionId]) map[a.versionId] = new Set();
      const product = products.find((p) => p.id === a.productId);
      if (product && product.server) {
        map[a.versionId].add(product.server);
      }
    }
    const counts: Record<string, number> = {};
    for (const [k, v] of Object.entries(map)) {
      counts[k] = v.size;
    }
    return counts;
  }, [productVersionAssignments, products]);

  if (versionDefs.length === 0) {
    return (
      <div className="h-full overflow-y-auto font-sans flex items-center justify-center">
        <div className="text-center">
          <FiClock className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <p className="text-slate-500 dark:text-slate-400 text-sm">No version data available.</p>
        </div>
      </div>
    );
  }

  const firstDate = versionDefs[0].releaseDate;
  const lastDate = versionDefs[versionDefs.length - 1].releaseDate;

  const expanded = versionDefs.find((v) => v.id === expandedId);

  return (
    <div className="h-full overflow-y-auto font-sans">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-5">
        <div className="flex flex-wrap items-center justify-between gap-4 max-w-[1800px] mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Version Timeline</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {versionDefs.length} versions &middot; {firstDate} to {lastDate}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> Active</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-slate-400 inline-block" /> Archived</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full border-2 border-dashed border-amber-400 inline-block" /> Draft</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-6 py-6 space-y-8">
        {/* Timeline */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm overflow-x-auto">
          <div className="relative min-w-[600px]">
            {/* Date range bar */}
            <div className="flex items-center justify-between mb-6 text-xs text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1"><FiCalendar className="w-3 h-3" /> {firstDate}</span>
              <span className="flex items-center gap-1"><FiCalendar className="w-3 h-3" /> {lastDate}</span>
            </div>

            {/* Connecting line background */}
            <div className="relative">
              <svg className="absolute top-5 left-0 w-full h-1" preserveAspectRatio="none">
                <line x1="0" y1="0" x2="100%" y2="0" stroke="currentColor" strokeWidth="2" className="text-slate-200 dark:text-slate-700" />
              </svg>

              {/* Nodes */}
              <div className="flex items-start justify-between relative">
                {versionDefs.map((vd, idx) => {
                  const isExpanded = expandedId === vd.id;
                  const isSelected = (selectedVersion === vd.label) ||
                    (selectedVersion === vd.id) ||
                    (selectedVersion === vd.name);
                  const pCount = productCounts[vd.label] || 0;

                  return (
                    <div
                      key={vd.id}
                      className="flex flex-col items-center relative"
                      style={{ flex: 1 }}
                    >
                      {/* Dot */}
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : vd.id)}
                        className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 ${
                          statusDot[vd.status]
                        } ${isSelected ? 'ring-4 ring-blue-500/30' : ''} ${isExpanded ? 'ring-4 ring-blue-400/50' : ''}`}
                        title={`${vd.name} - ${vd.status}`}
                      >
                        {vd.status === 'draft' ? (
                          <span className="w-4 h-4 rounded-full bg-amber-400" />
                        ) : (
                          <span className="w-3 h-3 rounded-full bg-white" />
                        )}
                      </button>

                      {/* Info */}
                      <div className="mt-3 text-center">
                        <p className="text-sm font-bold text-slate-800 dark:text-white">{vd.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{vd.releaseDate}</p>
                        <span className={`inline-block mt-1.5 px-2 py-0.5 text-[10px] font-medium rounded-full ${statusBadge[vd.status]}`}>
                          {vd.status}
                        </span>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{pCount} products</p>
                      </div>

                      {/* Connector line to next */}
                      {idx < versionDefs.length - 1 && (
                        <div className="absolute top-5 left-1/2 w-full h-0.5 bg-slate-300 dark:bg-slate-600" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Current version indicator */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
          <div className="flex items-center gap-3 text-sm">
            <FiActivity className="w-4 h-4 text-blue-500" />
            <span className="text-slate-500 dark:text-slate-400">Current selected version in topology:</span>
            <span className="font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/30 px-3 py-1 rounded-lg text-sm">
              {selectedVersion}
            </span>
          </div>
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{expanded.name}</h2>
                <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${statusBadge[expanded.status]}`}>
                  {expanded.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedVersion(expanded.label)}
                className="px-4 py-2 text-sm font-medium rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
              >
                Set as Active
              </button>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300">{expanded.description}</p>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: <FiBox className="w-4 h-4" />, label: 'Products', value: productCounts[expanded.label] || 0, color: 'text-blue-600' },
                { icon: <FiGitBranch className="w-4 h-4" />, label: 'Connections', value: connectionCounts[expanded.label] || 0, color: 'text-purple-600' },
                { icon: <FiServer className="w-4 h-4" />, label: 'Servers', value: serverCounts[expanded.label] || 0, color: 'text-emerald-600' },
                { icon: <FiCalendar className="w-4 h-4" />, label: 'Release Date', value: expanded.releaseDate, color: 'text-amber-600', isDate: true },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 flex items-center gap-3"
                >
                  <div className={`w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className={`text-lg font-bold ${stat.isDate ? 'text-sm' : ''} ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Product list */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
                Products ({productCounts[expanded.label] || 0})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {(productsForVersion[expanded.label] || []).map((name) => (
                  <span
                    key={name}
                    className="px-3 py-1.5 text-xs rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-medium text-center truncate"
                    title={name}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
