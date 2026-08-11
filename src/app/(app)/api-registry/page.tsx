'use client';

import { useState, useMemo } from 'react';
import { apiMatrix, apiFlows, apiPriorities, apiStatuses, apiGovernanceFields } from '@/data/api-matrix';
import type { ApiMatrixEntry } from '@/data/api-matrix';
import {
  FiSearch, FiFilter, FiExternalLink, FiChevronDown, FiChevronRight,
  FiCheckCircle, FiClock, FiAlertCircle, FiArrowRight, FiArrowDown,
  FiActivity, FiShield, FiRadio, FiWifi, FiDatabase, FiLayers,
} from 'react-icons/fi';

const priorityColors: Record<string, string> = {
  'Go-Live Critical': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
  'High Priority': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  'Pending / Next Release': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
};

const statusColors: Record<string, string> = {
  'Required': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  'In Progress': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'Pending': 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
};

const statusIcons: Record<string, React.ElementType> = {
  'Required': FiCheckCircle,
  'In Progress': FiClock,
  'Pending': FiAlertCircle,
};

const flowColors: Record<string, string> = {
  'push': '#10B981',
  'pull': '#3B82F6',
  'two-way': '#8B5CF6',
  'pub-sub': '#F59E0B',
};

export default function ApiRegistryPage() {
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedApi, setExpandedApi] = useState<string | null>(null);
  const [showFlow, setShowFlow] = useState(true);

  const filtered = useMemo(() => {
    return apiMatrix.filter(api => {
      const matchesSearch = search.trim() === '' ||
        api.name.toLowerCase().includes(search.toLowerCase()) ||
        api.primaryPurpose.toLowerCase().includes(search.toLowerCase()) ||
        api.businessUse.toLowerCase().includes(search.toLowerCase());
      const matchesPriority = priorityFilter === 'all' || api.priority === priorityFilter;
      const matchesStatus = statusFilter === 'all' || api.status === statusFilter;
      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [search, priorityFilter, statusFilter]);

  const goLiveCount = apiMatrix.filter(a => a.priority === 'Go-Live Critical').length;
  const highPriorityCount = apiMatrix.filter(a => a.priority === 'High Priority').length;
  const pendingCount = apiMatrix.filter(a => a.priority === 'Pending / Next Release').length;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950">
      <header className="flex items-center justify-between px-6 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">API Registry</h1>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200">{goLiveCount} Critical</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">{highPriorityCount} High</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">{pendingCount} Pending</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFlow(!showFlow)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${showFlow ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
          >
            {showFlow ? 'Flow: ON' : 'Flow: OFF'}
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="flex items-center gap-3 px-6 py-2.5 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg px-3 py-1.5 gap-2 border border-slate-200 dark:border-slate-700 min-w-[240px]">
          <FiSearch size={14} className="text-slate-400 shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search APIs, purpose, consumers..."
            className="bg-transparent border-none outline-none text-xs w-full text-slate-700 dark:text-slate-300"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <FiFilter size={12} className="text-slate-400" />
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          >
            <option value="all">All Priorities</option>
            {apiPriorities.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          >
            <option value="all">All Statuses</option>
            {apiStatuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <span className="text-[10px] text-slate-400 ml-auto">{filtered.length} of {apiMatrix.length} APIs</span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* API Flow Diagram */}
        {showFlow && (
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
            <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-3">API Dependency Flow</h2>
            <div className="flex flex-wrap gap-1.5 items-center text-[10px] font-mono overflow-x-auto pb-2">
              {apiFlows.map((edge, i) => (
                <span key={i} className="flex items-center gap-1 shrink-0">
                  {i > 0 && apiFlows[i - 1].target !== edge.source && <span className="mx-1 text-slate-300">|</span>}
                  <span className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold">{edge.source}</span>
                  <span className="flex items-center gap-0.5" style={{ color: flowColors[edge.type] }}>
                    <FiArrowRight size={10} />
                    <span className="text-[8px] text-slate-400">{edge.type}</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold">{edge.target}</span>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400">
              {Object.entries(flowColors).map(([type, color]) => (
                <span key={type} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                  {type}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* API Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-slate-50 dark:bg-slate-900 z-10">
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="text-left px-4 py-2.5 font-semibold text-slate-500 dark:text-slate-400 w-8">#</th>
                <th className="text-left px-4 py-2.5 font-semibold text-slate-500 dark:text-slate-400">API / Engine</th>
                <th className="text-left px-4 py-2.5 font-semibold text-slate-500 dark:text-slate-400">Status</th>
                <th className="text-left px-4 py-2.5 font-semibold text-slate-500 dark:text-slate-400">Priority</th>
                <th className="text-left px-4 py-2.5 font-semibold text-slate-500 dark:text-slate-400">Primary Purpose</th>
                <th className="text-left px-4 py-2.5 font-semibold text-slate-500 dark:text-slate-400">Consumed By</th>
                <th className="text-left px-4 py-2.5 font-semibold text-slate-500 dark:text-slate-400">Comm Type</th>
                <th className="text-left px-4 py-2.5 font-semibold text-slate-500 dark:text-slate-400 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((api) => {
                const StatusIcon = statusIcons[api.status];
                const isExpanded = expandedApi === api.name;
                return (
                  <>
                    <tr
                      key={api.sr}
                      onClick={() => setExpandedApi(isExpanded ? null : api.name)}
                      className={`border-b border-slate-100 dark:border-slate-800/50 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 cursor-pointer transition-colors ${isExpanded ? 'bg-indigo-50/50 dark:bg-indigo-900/20' : ''}`}
                    >
                      <td className="px-4 py-2.5 text-slate-400 font-mono">{api.sr}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{api.name}</span>
                          <span className="text-[9px] text-slate-400 font-mono">{api.version}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[api.status]}`}>
                          <StatusIcon size={10} />
                          {api.status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${priorityColors[api.priority]}`}>
                          {api.priority}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400 max-w-[280px] truncate">{api.primaryPurpose}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {api.consumedBy.slice(0, 3).map(c => (
                            <span key={c} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[9px]">{c}</span>
                          ))}
                          {api.consumedBy.length > 3 && (
                            <span className="text-[9px] text-slate-400">+{api.consumedBy.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{api.communicationType}</span>
                      </td>
                      <td className="px-4 py-2.5 text-slate-400">
                        {isExpanded ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${api.sr}-expanded`}>
                        <td colSpan={8} className="px-6 py-4 bg-indigo-50/30 dark:bg-indigo-900/10">
                          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                            <div>
                              <span className="text-[10px] font-semibold text-slate-400 uppercase">Business Use</span>
                              <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">{api.businessUse}</p>
                            </div>
                            <div>
                              <span className="text-[10px] font-semibold text-slate-400 uppercase">Key Data Exchanged</span>
                              <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">{api.keyDataExchanged}</p>
                            </div>
                            <div>
                              <span className="text-[10px] font-semibold text-slate-400 uppercase">Auth Method</span>
                              <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">{api.authMethod}</p>
                            </div>
                            <div>
                              <span className="text-[10px] font-semibold text-slate-400 uppercase">Base URL</span>
                              <code className="text-[11px] text-slate-700 dark:text-slate-300 mt-0.5 block font-mono">{api.baseUrl}</code>
                            </div>
                            <div className="col-span-2">
                              <span className="text-[10px] font-semibold text-slate-400 uppercase">All Consumers</span>
                              <div className="flex flex-wrap gap-1 mt-0.5">
                                {api.consumedBy.map(c => (
                                  <span key={c} className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] text-slate-600 dark:text-slate-400">{c}</span>
                                ))}
                              </div>
                            </div>
                            <div className="col-span-2">
                              <span className="text-[10px] font-semibold text-slate-400 uppercase">Sends Data To</span>
                              <div className="flex flex-wrap gap-1 mt-0.5">
                                {api.sendsDataTo.map(s => (
                                  <span key={s} className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] text-emerald-700 dark:text-emerald-400">{s}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Governance Template */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-3">Standard API Document Structure</h2>
          <div className="grid grid-cols-4 gap-2">
            {apiGovernanceFields.map((field, i) => (
              <div key={i} className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <FiCheckCircle size={10} className="text-emerald-500 shrink-0" />
                {field}
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 mt-3">Every API document must contain all 21 sections above for governance compliance.</p>
        </div>
      </div>
    </div>
  );
}
