'use client';

import { useState, useMemo } from 'react';
import {
  FiDownload, FiBox, FiServer, FiGitBranch, FiActivity,
} from 'react-icons/fi';
import { usePMOStore } from '@/stores';

type ChangeEntry = {
  productId: string;
  name: string;
  status: 'added' | 'removed' | 'modified';
  category: string;
  currentVersion: string;
};

type ConnectionChange = {
  source: string;
  target: string;
  protocol: string;
  status: 'added' | 'removed' | 'modified';
};

type ServerChange = {
  server: string;
  status: 'added' | 'removed' | 'modified';
};

type ComparisonData = {
  products: ChangeEntry[];
  connections: ConnectionChange[];
  servers: ServerChange[];
  counts: { added: number; removed: number; modified: number; changedConnections: number };
  versionACount: number;
  versionBCount: number;
};

function buildVersionDefs(versions: { label: string; releaseDate: string }[]): { id: string; name: string; label: string }[] {
  const seen = new Map<string, { id: string; name: string; label: string }>();
  for (const v of versions) {
    if (!seen.has(v.label)) {
      seen.set(v.label, { id: v.label.toLowerCase().replace(/\s+/g, '-'), name: v.label, label: v.label });
    }
  }
  return Array.from(seen.values());
}

const statusBadgeColors: Record<string, string> = {
  added: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  removed: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  modified: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
};

const statusEmoji: Record<string, string> = {
  added: '\u{1F7E2}',
  removed: '\u{1F534}',
  modified: '\u{1F7E1}',
};

const rowBg: Record<string, string> = {
  added: 'bg-emerald-50/50 dark:bg-emerald-950/20',
  removed: 'bg-red-50/50 dark:bg-red-950/20',
  modified: 'bg-amber-50/50 dark:bg-amber-950/20',
};

export default function CompareVersionsPage() {
  const products = usePMOStore((s) => s.products);
  const versionDefinitions = usePMOStore((s) => s.versionDefinitions);
  const productVersionAssignments = usePMOStore((s) => s.productVersionAssignments);
  const compareVersions = usePMOStore((s) => s.compareVersions);

  const versionDefs = useMemo(() => versionDefinitions || [], [versionDefinitions]);

  const [versionA, setVersionA] = useState(versionDefs[0]?.id ?? '');
  const [versionB, setVersionB] = useState(versionDefs[1]?.id ?? '');
  const [result, setResult] = useState<ComparisonData | null>(null);

  const productVersionMap = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    for (const a of productVersionAssignments) {
      if (!a.active) continue;
      if (!map[a.productId]) map[a.productId] = new Set();
      map[a.productId].add(a.versionId);
    }
    return map;
  }, [productVersionAssignments]);

  const handleCompare = () => {
    if (!versionA || !versionB) return;

    const changes = compareVersions(versionA, versionB);

    const productsA = new Set(productVersionAssignments.filter(a => a.versionId === versionA && a.active).map(a => a.productId));
    const productsB = new Set(productVersionAssignments.filter(a => a.versionId === versionB && a.active).map(a => a.productId));

    const changeEntries: ChangeEntry[] = [];
    const allIds = new Set([...productsA, ...productsB]);

    for (const pid of allIds) {
      const product = products.find((p) => p.id === pid);
      const inA = productsA.has(pid);
      const inB = productsB.has(pid);
      const status = inA && inB ? 'modified' : inA && !inB ? 'removed' : 'added';

      const aEntries = productVersionAssignments.filter(a => a.productId === pid && a.versionId === versionA);
      const bEntries = productVersionAssignments.filter(a => a.productId === pid && a.versionId === versionB);
      const currentVersion = status === 'removed'
        ? aEntries[0]?.versionId ?? ''
        : bEntries[0]?.versionId ?? aEntries[0]?.versionId ?? '';

      changeEntries.push({
        productId: pid,
        name: product?.name ?? pid,
        status,
        category: product?.category ?? '',
        currentVersion,
      });
    }

    const connChanges: ConnectionChange[] = [];
    const productsInA = products.filter((p) => productsA.has(p.id));
    const productsInB = products.filter((p) => productsB.has(p.id));

    for (const p of productsInA) {
      if (!productsB.has(p.id)) {
        connChanges.push({ source: p.name, target: p.dependencies.join(', ') || 'N/A', protocol: 'HTTP', status: 'removed' });
      }
    }
    for (const p of productsInB) {
      if (!productsA.has(p.id)) {
        connChanges.push({ source: p.name, target: p.dependencies.join(', ') || 'N/A', protocol: 'HTTP', status: 'added' });
      }
    }
    for (const p of productsInA) {
      if (productsB.has(p.id)) {
        const b = productsInB.find((x) => x.id === p.id)!;
        if (JSON.stringify(p.dependencies) !== JSON.stringify(b.dependencies)) {
          connChanges.push({ source: p.name, target: b.dependencies.join(', ') || 'N/A', protocol: 'HTTP', status: 'modified' });
        }
      }
    }

    const serversA = new Set(productsInA.map((p) => p.server));
    const serversB = new Set(productsInB.map((p) => p.server));
    const serverChanges: ServerChange[] = [];
    for (const s of new Set([...serversA, ...serversB])) {
      const sA = serversA.has(s);
      const sB = serversB.has(s);
      if (sA && !sB) serverChanges.push({ server: s, status: 'removed' });
      else if (!sA && sB) serverChanges.push({ server: s, status: 'added' });
      else if (sA && sB) serverChanges.push({ server: s, status: 'modified' });
    }

    setResult({
      products: changeEntries.sort((a, b) => {
        const order = { added: 0, modified: 1, removed: 2 };
        return order[a.status] - order[b.status];
      }),
      connections: connChanges,
      servers: serverChanges,
      counts: {
        added: changeEntries.filter((e) => e.status === 'added').length,
        removed: changeEntries.filter((e) => e.status === 'removed').length,
        modified: changeEntries.filter((e) => e.status === 'modified').length,
        changedConnections: connChanges.length,
      },
      versionACount: productsA.size,
      versionBCount: productsB.size,
    });
  };

  const exportCSV = () => {
    if (!result) return;
    const headers = ['ProductID', 'Name', 'Status', 'Category', 'CurrentVersion'];
    const rows = result.products.map((e) => [e.productId, e.name, e.status, e.category, e.currentVersion]);
    const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `version-compare-${versionA}-vs-${versionB}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full overflow-y-auto font-sans">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-5">
        <div className="flex flex-wrap items-center justify-between gap-4 max-w-[1800px] mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Version Comparison</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Compare differences between two versions</p>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-6 py-6 space-y-6">
        {/* Selector */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Version A</label>
              <select
                value={versionA}
                onChange={(e) => setVersionA(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                {versionDefs.map((vd) => (
                  <option key={vd.id} value={vd.label}>{vd.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center pb-2">
              <span className="text-slate-400 font-bold text-lg">vs</span>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Version B</label>
              <select
                value={versionB}
                onChange={(e) => setVersionB(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                {versionDefs.map((vd) => (
                  <option key={vd.id} value={vd.label}>{vd.name}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleCompare}
              disabled={!versionA || !versionB || versionA === versionB}
              className="px-6 py-2.5 text-sm font-medium rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Compare
            </button>
          </div>
        </div>

        {result && (
          <>
            {/* Side-by-side cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Version A &mdash; {versionA}</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{result.versionACount}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">products</p>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Version B &mdash; {versionB}</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{result.versionBCount}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">products</p>
              </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Added Products', value: result.counts.added, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30', icon: '\u{1F7E2}' },
                { label: 'Removed Products', value: result.counts.removed, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/30', icon: '\u{1F534}' },
                { label: 'Modified Products', value: result.counts.modified, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30', icon: '\u{1F7E1}' },
                { label: 'Changed Connections', value: result.counts.changedConnections, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/30', icon: '\u{1F517}' },
              ].map((card) => (
                <div
                  key={card.label}
                  className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center text-lg`}>
                      {card.icon}
                    </div>
                    <div>
                      <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{card.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Products Diff Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FiBox className="w-4 h-4 text-blue-500" /> Products
                </h3>
                <button
                  onClick={exportCSV}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <FiDownload className="w-3.5 h-3.5" /> Export Diff
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Product Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Current Version</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.products.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
                          No product changes between these versions.
                        </td>
                      </tr>
                    ) : (
                      result.products.map((e) => (
                        <tr key={e.productId + e.status} className={`border-b border-slate-100 dark:border-slate-800 last:border-0 ${rowBg[e.status]}`}>
                          <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">{e.name}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusBadgeColors[e.status]}`}>
                              {statusEmoji[e.status]} {e.status.charAt(0).toUpperCase() + e.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{e.category}</td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-mono text-xs">{e.currentVersion}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Connections Diff Table */}
            {result.connections.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700">
                  <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FiGitBranch className="w-4 h-4 text-blue-500" /> Connections
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Source &rarr; Target</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Protocol</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.connections.map((c, i) => (
                        <tr key={i} className={`border-b border-slate-100 dark:border-slate-800 last:border-0 ${rowBg[c.status]}`}>
                          <td className="px-4 py-3 text-slate-800 dark:text-white font-medium">{c.source} &rarr; {c.target}</td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-mono text-xs">{c.protocol}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusBadgeColors[c.status]}`}>
                              {statusEmoji[c.status]} {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Servers Diff Table */}
            {result.servers.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700">
                  <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FiServer className="w-4 h-4 text-blue-500" /> Servers
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Server</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.servers.map((s, i) => (
                        <tr key={i} className={`border-b border-slate-100 dark:border-slate-800 last:border-0 ${rowBg[s.status]}`}>
                          <td className="px-4 py-3 text-slate-800 dark:text-white font-medium font-mono text-xs">{s.server}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusBadgeColors[s.status]}`}>
                              {statusEmoji[s.status]} {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {!result && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-16 text-center shadow-sm">
            <FiActivity className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-slate-500 dark:text-slate-400 text-sm">Select two versions above and click Compare to see the diff.</p>
          </div>
        )}
      </div>
    </div>
  );
}
