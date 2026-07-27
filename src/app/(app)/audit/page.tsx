'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { auditLogs, AuditLogEntry } from '@/data/audit';
import { nodes } from '@/data/ecosystem';
import {
  FiAlertTriangle, FiCheck, FiX, FiClock, FiFilter, FiDownload,
  FiChevronDown, FiChevronRight, FiSearch, FiCalendar, FiActivity,
  FiShield, FiServer, FiUsers, FiTrendingUp,
} from 'react-icons/fi';

type AuditType = AuditLogEntry['type'];
type Severity = AuditLogEntry['severity'];
type Outcome = AuditLogEntry['outcome'];

const SEVERITY_COLORS: Record<Severity, string> = {
  critical: 'bg-red-600 text-white',
  high: 'bg-orange-500 text-white',
  medium: 'bg-yellow-500 text-black',
  low: 'bg-blue-400 text-white',
  info: 'bg-gray-400 text-white',
};

const TYPE_COLORS: Record<AuditType, string> = {
  trade: 'bg-emerald-500 text-white',
  system: 'bg-violet-500 text-white',
  compliance: 'bg-cyan-500 text-white',
  security: 'bg-red-500 text-white',
  configuration: 'bg-amber-500 text-black',
  'data-access': 'bg-blue-500 text-white',
  'api-call': 'bg-pink-500 text-white',
  'user-action': 'bg-teal-500 text-white',
};

const OUTCOME_ICONS: Record<Outcome, React.ReactNode> = {
  success: <FiCheck className="text-green-500" />,
  failure: <FiX className="text-red-500" />,
  warning: <FiAlertTriangle className="text-yellow-500" />,
  blocked: <FiX className="text-red-600" />,
};

const SEVERITY_ICONS: Record<Severity, React.ReactNode> = {
  critical: <FiAlertTriangle className="text-red-500" />,
  high: <FiAlertTriangle className="text-orange-500" />,
  medium: <FiAlertTriangle className="text-yellow-500" />,
  low: <FiActivity className="text-blue-400" />,
  info: <FiActivity className="text-gray-400" />,
};

const PAGE_SIZE = 25;

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}

function useCountUp(target: number, duration = 800) {
  const [val, setVal] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setVal(Math.floor(progress * target));
      if (progress < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return val;
}

export default function AuditPage() {
  const [filters, setFilters] = useState({
    search: '',
    entity: '',
    user: '',
    dateFrom: '',
    dateTo: '',
    types: [] as AuditType[],
    severities: [] as Severity[],
    outcomes: [] as Outcome[],
  });
  const [page, setPage] = useState(0);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [selectedEntry, setSelectedEntry] = useState<AuditLogEntry | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const allTypes: AuditType[] = ['trade', 'system', 'compliance', 'security', 'configuration', 'data-access', 'api-call', 'user-action'];
  const allSeverities: Severity[] = ['critical', 'high', 'medium', 'low', 'info'];
  const allOutcomes: Outcome[] = ['success', 'failure', 'warning', 'blocked'];
  const entityNames = useMemo(() => [...new Set(nodes.map(n => n.name))].sort(), []);

  const filtered = useMemo(() => {
    return auditLogs.filter(log => {
      if (filters.types.length > 0 && !filters.types.includes(log.type)) return false;
      if (filters.severities.length > 0 && !filters.severities.includes(log.severity)) return false;
      if (filters.outcomes.length > 0 && !filters.outcomes.includes(log.outcome)) return false;
      if (filters.search && !log.action.toLowerCase().includes(filters.search.toLowerCase()) && !log.details.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.entity && !log.entity.toLowerCase().includes(filters.entity.toLowerCase())) return false;
      if (filters.user && !log.user.toLowerCase().includes(filters.user.toLowerCase())) return false;
      if (filters.dateFrom && new Date(log.timestamp) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(log.timestamp) > new Date(filters.dateTo + 'T23:59:59')) return false;
      return true;
    });
  }, [filters]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = useMemo(() => filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE), [filtered, page]);

  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
  const criticalToday = auditLogs.filter(l => l.severity === 'critical' && new Date(l.timestamp) >= todayStart).length;
  const tradeLogsCount = auditLogs.filter(l => l.type === 'trade').length;
  const securityLogsCount = auditLogs.filter(l => l.type === 'security').length;

  const toggleExpanded = useCallback((id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const exportCSV = useCallback(() => {
    const visible = pageData;
    const header = 'ID,Timestamp,Type,Severity,Entity,Action,User,Outcome,Details\n';
    const rows = visible.map(l =>
      `"${l.id}","${formatDate(l.timestamp)}","${l.type}","${l.severity}","${l.entity}","${l.action}","${l.user}","${l.outcome}","${l.details.replace(/"/g, '""')}"`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `audit-export-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  }, [pageData]);

  const relatedEntries = useMemo(() => {
    if (!selectedEntry) return [];
    return auditLogs
      .filter(l => l.entity === selectedEntry.entity && l.id !== selectedEntry.id)
      .slice(-5)
      .reverse();
  }, [selectedEntry]);

  const toggleFilter = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];

  const todayStr = new Date().toISOString().slice(0, 10);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);

  const animTotal = useCountUp(auditLogs.length, 1000);
  const animCritical = useCountUp(criticalToday, 800);
  const animTrade = useCountUp(tradeLogsCount, 800);
  const animSecurity = useCountUp(securityLogsCount, 800);

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[1600px] mx-auto p-4 md:p-6">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-3">
              <FiShield className="text-2xl text-blue-500" />
              <h1 className="text-2xl md:text-3xl font-bold">Audit Trail</h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Comprehensive audit logging across the Algo IQ ecosystem
            </p>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Total Audit Events', value: animTotal, icon: <FiActivity className="text-blue-500" />, color: 'border-blue-500' },
            { label: 'Critical Events (Today)', value: animCritical, icon: <FiAlertTriangle className="text-red-500" />, color: 'border-red-500' },
            { label: 'Trade Events', value: animTrade, icon: <FiTrendingUp className="text-emerald-500" />, color: 'border-emerald-500' },
            { label: 'Security Events', value: animSecurity, icon: <FiShield className="text-violet-500" />, color: 'border-violet-500' },
          ].map((stat, i) => (
            <div key={i} className={`bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 border-l-4 ${stat.color}`}>
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-1">
                {stat.icon}
                <span>{stat.label}</span>
              </div>
              <p className="text-2xl md:text-3xl font-bold tabular-nums">{stat.value.toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* Filter bar */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 mb-3"
          >
            <FiFilter /> Filters {showFilters ? <FiChevronDown /> : <FiChevronRight />}
          </button>

          {showFilters && (
            <div className="space-y-3">
              {/* Search row */}
              <div className="flex flex-wrap gap-3">
                <div className="flex-1 min-w-[200px]">
                  <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Search</label>
                  <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 gap-2">
                    <FiSearch size={14} className="text-slate-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search actions or details..."
                      value={filters.search}
                      onChange={e => { setFilters(f => ({ ...f, search: e.target.value })); setPage(0); }}
                      className="bg-transparent border-none outline-none py-2 text-sm w-full text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Entity</label>
                  <select
                    value={filters.entity}
                    onChange={e => { setFilters(f => ({ ...f, entity: e.target.value })); setPage(0); }}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200"
                  >
                    <option value="">All Entities</option>
                    {entityNames.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1">User</label>
                  <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3">
                    <FiUsers size={14} className="text-slate-400 shrink-0 mr-2" />
                    <input
                      type="text"
                      placeholder="trader:v.kumar..."
                      value={filters.user}
                      onChange={e => { setFilters(f => ({ ...f, user: e.target.value })); setPage(0); }}
                      className="bg-transparent border-none outline-none py-2 text-sm w-full text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* Date range */}
              <div className="flex flex-wrap gap-3">
                <div className="flex-1 min-w-[180px]">
                  <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1">From Date</label>
                  <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 gap-2">
                    <FiCalendar size={14} className="text-slate-400 shrink-0" />
                    <input
                      type="date"
                      value={filters.dateFrom}
                      min={thirtyDaysAgo}
                      max={todayStr}
                      onChange={e => { setFilters(f => ({ ...f, dateFrom: e.target.value })); setPage(0); }}
                      className="bg-transparent border-none outline-none py-2 text-sm w-full text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-[180px]">
                  <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1">To Date</label>
                  <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 gap-2">
                    <FiCalendar size={14} className="text-slate-400 shrink-0" />
                    <input
                      type="date"
                      value={filters.dateTo}
                      min={thirtyDaysAgo}
                      max={todayStr}
                      onChange={e => { setFilters(f => ({ ...f, dateTo: e.target.value })); setPage(0); }}
                      className="bg-transparent border-none outline-none py-2 text-sm w-full text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>
              </div>

              {/* Type & Severity filters */}
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Type</label>
                <div className="flex flex-wrap gap-1.5">
                  {allTypes.map(t => (
                    <button
                      key={t}
                      onClick={() => { setFilters(f => ({ ...f, types: toggleFilter(f.types, t) as AuditType[] })); setPage(0); }}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${filters.types.includes(t) ? TYPE_COLORS[t] : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Severity</label>
                <div className="flex flex-wrap gap-1.5">
                  {allSeverities.map(s => (
                    <button
                      key={s}
                      onClick={() => { setFilters(f => ({ ...f, severities: toggleFilter(f.severities, s) as Severity[] })); setPage(0); }}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${filters.severities.includes(s) ? SEVERITY_COLORS[s] : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Outcome</label>
                <div className="flex flex-wrap gap-1.5">
                  {allOutcomes.map(o => (
                    <button
                      key={o}
                      onClick={() => { setFilters(f => ({ ...f, outcomes: toggleFilter(f.outcomes, o) as Outcome[] })); setPage(0); }}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors inline-flex items-center gap-1 ${filters.outcomes.includes(o) ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-black' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
                    >
                      {OUTCOME_ICONS[o]} {o}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Table header with count + export */}
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing {pageData.length > 0 ? page * PAGE_SIZE + 1 : 0}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length} events
          </p>
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <FiDownload size={14} /> Export CSV
          </button>
        </div>

        {/* Mobile: card layout, Desktop: table layout */}
        <div className="block md:hidden space-y-3">
          {pageData.map(log => (
            <div
              key={log.id}
              onClick={() => setSelectedEntry(log)}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${TYPE_COLORS[log.type]}`}>{log.type}</span>
                <span className="text-xs text-slate-400"><FiClock className="inline mr-1" size={12} />{formatDate(log.timestamp)}</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                {SEVERITY_ICONS[log.severity]}
                <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${SEVERITY_COLORS[log.severity]}`}>{log.severity}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{log.entity}</span>
              </div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{log.action}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{log.user}</p>
              <div className="flex items-center justify-between mt-2">
                <span>{OUTCOME_ICONS[log.outcome]}</span>
                <span className="text-xs text-slate-400">{log.id}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider whitespace-nowrap">
                  <span className="inline-flex items-center gap-1"><FiClock size={12} /> Timestamp</span>
                </th>
                <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider">Severity</th>
                <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider">
                  <span className="inline-flex items-center gap-1"><FiServer size={12} /> Entity</span>
                </th>
                <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider">Action</th>
                <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider">
                  <span className="inline-flex items-center gap-1"><FiUsers size={12} /> User</span>
                </th>
                <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider">Outcome</th>
                <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {pageData.map(log => {
                const isExpanded = expandedIds.has(log.id);
                return (
                  <>
                    <tr
                      key={log.id}
                      onClick={() => setSelectedEntry(log)}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${log.severity === 'critical' ? 'bg-red-50 dark:bg-red-950/20' : ''}`}
                    >
                      <td className="px-4 py-2.5 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap font-mono">
                        {formatDate(log.timestamp)}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[log.type]}`}>{log.type}</span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${SEVERITY_COLORS[log.severity]}`}>
                          {SEVERITY_ICONS[log.severity]}
                          {log.severity}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-200">{log.entity}</td>
                      <td className="px-4 py-2.5 text-xs text-slate-700 dark:text-slate-300 max-w-[250px] truncate">{log.action}</td>
                      <td className="px-4 py-2.5 text-xs text-slate-500 dark:text-slate-400 font-mono">{log.user}</td>
                      <td className="px-4 py-2.5">{OUTCOME_ICONS[log.outcome]}</td>
                      <td className="px-4 py-2.5">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleExpanded(log.id); }}
                          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400"
                        >
                          {isExpanded ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${log.id}-expand`} className="bg-slate-50 dark:bg-slate-900">
                        <td colSpan={8} className="px-6 py-3">
                          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            <p><strong className="text-slate-800 dark:text-slate-200">ID:</strong> {log.id}</p>
                            <p><strong className="text-slate-800 dark:text-slate-200">Full Timestamp:</strong> {log.timestamp}</p>
                            <p><strong className="text-slate-800 dark:text-slate-200">Details:</strong> {log.details}</p>
                            <p><strong className="text-slate-800 dark:text-slate-200">IP:</strong> {log.ipAddress}</p>
                            {log.affectedSystems.length > 0 && (
                              <p>
                                <strong className="text-slate-800 dark:text-slate-200">Affected Systems:</strong>{' '}
                                {log.affectedSystems.map((s, i) => (
                                  <span key={i} className="inline-block px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs mr-1 mb-1">{s}</span>
                                ))}
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
              {pageData.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                    No audit events match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-700 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
            >
              Previous
            </button>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-700 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Right sidebar detail panel */}
      {selectedEntry && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setSelectedEntry(null)} />
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 z-50 overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Event Details</h2>
                <button onClick={() => setSelectedEntry(null)} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                  <FiX size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Event ID</p>
                  <p className="text-sm font-mono font-bold text-slate-800 dark:text-slate-200">{selectedEntry.id}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Timestamp</p>
                  <p className="text-sm font-mono text-slate-700 dark:text-slate-300">{selectedEntry.timestamp}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{formatDate(selectedEntry.timestamp)}</p>
                </div>

                <div className="flex gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[selectedEntry.type]}`}>{selectedEntry.type}</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${SEVERITY_COLORS[selectedEntry.severity]}`}>
                    {SEVERITY_ICONS[selectedEntry.severity]} {selectedEntry.severity}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {OUTCOME_ICONS[selectedEntry.outcome]} {selectedEntry.outcome}
                  </span>
                </div>

                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Entity</p>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{selectedEntry.entity}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Action</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{selectedEntry.action}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">User</p>
                  <p className="text-sm font-mono text-slate-700 dark:text-slate-300">{selectedEntry.user}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">IP Address</p>
                  <p className="text-sm font-mono text-slate-700 dark:text-slate-300">{selectedEntry.ipAddress}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Details</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800 rounded-lg p-3">{selectedEntry.details}</p>
                </div>

                {selectedEntry.affectedSystems.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Affected Systems</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedEntry.affectedSystems.map((s, i) => (
                        <span key={i} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-700 dark:text-slate-300">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {relatedEntries.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Recent Related ({selectedEntry.entity})</p>
                    <div className="space-y-2">
                      {relatedEntries.map(r => (
                        <button
                          key={r.id}
                          onClick={() => setSelectedEntry(r)}
                          className="w-full text-left p-2 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${TYPE_COLORS[r.type]}`}>{r.type}</span>
                            <span className="text-xs text-slate-400">{formatDate(r.timestamp)}</span>
                          </div>
                          <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 truncate">{r.action}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
