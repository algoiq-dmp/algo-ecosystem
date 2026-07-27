'use client';

import { useState, useMemo } from 'react';
import {
  FiSearch,
  FiFileText,
  FiDownload,
  FiChevronDown,
  FiChevronUp,
  FiEdit3,
  FiCheck,
  FiX,
  FiGrid,
  FiList,
} from 'react-icons/fi';
import * as XLSX from 'xlsx';

/* ---------- types ---------- */
type DocType =
  | 'architecture'
  | 'brs'
  | 'srs'
  | 'hld'
  | 'lld'
  | 'api-docs'
  | 'db-docs'
  | 'deploy'
  | 'devops'
  | 'user-guide'
  | 'admin'
  | 'troubleshoot'
  | 'faq'
  | 'release-notes'
  | 'test-plan'
  | 'audit'
  | 'install'
  | 'kb';

type DocStatus = 'completed' | 'in-progress' | 'not-started';

interface DocItem {
  id: number;
  productId: string;
  type: DocType;
  title: string;
  status: DocStatus;
  owner: string;
  completion: number;
  lastUpdated: string;
  reviewer: string;
  comments: string;
}

const PRODUCTS = [
  'ENT-GANESH',
  'ENT-SURYA',
  'ENT-VEGA',
  'ENT-NARAD',
  'ENT-DELTA',
  'ENT-CHITRAGUPTA',
  'ENT-KAVACH',
  'ENT-TALKOFFICE',
] as const;

const DOC_TYPES: DocType[] = [
  'architecture',
  'brs',
  'srs',
  'hld',
  'lld',
  'api-docs',
  'db-docs',
  'deploy',
  'devops',
  'user-guide',
  'admin',
  'troubleshoot',
  'faq',
  'release-notes',
  'test-plan',
  'audit',
  'install',
  'kb',
];

const DOC_TYPE_LABELS: Record<DocType, string> = {
  architecture: 'Architecture',
  brs: 'BRS',
  srs: 'SRS',
  hld: 'HLD',
  lld: 'LLD',
  'api-docs': 'API Docs',
  'db-docs': 'DB Docs',
  deploy: 'Deploy',
  devops: 'DevOps',
  'user-guide': 'User Guide',
  admin: 'Admin',
  troubleshoot: 'Troubleshoot',
  faq: 'FAQ',
  'release-notes': 'Release Notes',
  'test-plan': 'Test Plan',
  audit: 'Audit',
  install: 'Install',
  kb: 'Knowledge Base',
};

const DOC_TYPE_COLORS: Record<DocType, string> = {
  architecture: '#7C3AED',
  brs: '#2563EB',
  srs: '#0891B2',
  hld: '#0D9488',
  lld: '#059669',
  'api-docs': '#D97706',
  'db-docs': '#DC2626',
  deploy: '#4F46E5',
  devops: '#9333EA',
  'user-guide': '#2563EB',
  admin: '#C026D3',
  troubleshoot: '#EA580C',
  faq: '#16A34A',
  'release-notes': '#0284C7',
  'test-plan': '#CA8A04',
  audit: '#B91C1C',
  install: '#1D4ED8',
  kb: '#4B5563',
};

const STATUS_COLORS: Record<DocStatus, string> = {
  completed: '#10B981',
  'in-progress': '#F59E0B',
  'not-started': '#6B7280',
};

const STATUS_LABELS: Record<DocStatus, string> = {
  completed: 'Completed',
  'in-progress': 'In Progress',
  'not-started': 'Not Started',
};

/* ---------- 100+ doc data ---------- */
const OWNERS = [
  'Arjun Mehta',
  'Priya Sharma',
  'Vikram Rao',
  'Sneha Patel',
  'Rohan Gupta',
  'Ananya Iyer',
  'Karan Joshi',
  'Meera Nair',
];
const REVIEWERS = [
  'Rajesh Kumar',
  'Neha Singh',
  'Amit Verma',
  'Divya Kapoor',
  'Sanjay Das',
];

function rPick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function rDate(): string {
  const y = 2024 + Math.floor(Math.random() * 2);
  const m = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const d = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function rComments(): string {
  const c = [
    '',
    'Needs minor revisions in section 3',
    'Approved — awaiting final sign-off',
    'Pending SME review',
    'Formatting updates required',
    'Ready for publishing',
    'Version aligned with latest release',
    'Awaiting stakeholder feedback',
  ];
  return c[Math.floor(Math.random() * c.length)];
}

const genDocs = (): DocItem[] => {
  const docs: DocItem[] = [];
  const titles: Record<DocType, string[]> = {
    architecture: [
      'System Architecture Overview',
      'High-Level Architecture Diagram',
      'Component Interaction Model',
      'Data Flow Architecture',
      'Security Architecture',
      'Infrastructure Architecture',
    ],
    brs: [
      'Business Requirements Document',
      'Functional Specification',
      'Stakeholder Requirements',
      'Business Case Document',
      'Market Requirements Document',
    ],
    srs: [
      'Software Requirements Specification',
      'Feature Requirements Spec',
      'System Requirements Document',
      'Interface Requirements Spec',
      'Performance Requirements',
    ],
    hld: [
      'High-Level Design Document',
      'Module Design Specification',
      'System Design Document',
      'Integration Design Spec',
      'Network Design HLD',
    ],
    lld: [
      'Low-Level Design Document',
      'Component Detailed Design',
      'Database Schema LLD',
      'API Contract LLD',
      'Error Handling Design',
    ],
    'api-docs': [
      'REST API Documentation',
      'WebSocket API Spec',
      'GraphQL API Reference',
      'gRPC Service Definition',
      'SDK API Reference',
    ],
    'db-docs': [
      'Database Schema Document',
      'Data Dictionary',
      'Migration Guide',
      'Backup & Recovery Guide',
      'Data Retention Policy',
    ],
    deploy: [
      'Deployment Guide',
      'CI/CD Pipeline Document',
      'Container Orchestration Guide',
      'Infrastructure as Code Doc',
      'Blue-Green Deployment Plan',
    ],
    devops: [
      'Monitoring Setup Guide',
      'Alerting Configuration',
      'Log Aggregation Guide',
      'Incident Response Runbook',
      'Capacity Planning Doc',
    ],
    'user-guide': [
      'End User Manual',
      'Quick Start Guide',
      'Feature Walkthrough',
      'Configuration Guide',
      'Best Practices Guide',
    ],
    admin: [
      'Admin Console Guide',
      'User Management Guide',
      'Role & Permission Guide',
      'System Administration Manual',
      'Audit Log Guide',
    ],
    troubleshoot: [
      'Troubleshooting Guide',
      'Common Issues & Fixes',
      'Diagnostic Procedures',
      'Error Code Reference',
      'Debug Tool Guide',
    ],
    faq: [
      'Frequently Asked Questions',
      'Onboarding FAQ',
      'Integration FAQ',
      'Compliance FAQ',
      'Technical FAQ',
    ],
    'release-notes': [
      'Release Notes v2.1',
      'Release Notes v3.0',
      'Patch Notes v1.5',
      'Hotfix Notes',
      'Release Summary Report',
    ],
    'test-plan': [
      'Unit Test Plan',
      'Integration Test Plan',
      'UAT Plan',
      'Performance Test Plan',
      'Regression Test Suite Doc',
    ],
    audit: [
      'Audit Log Specification',
      'Compliance Audit Report',
      'Security Audit Document',
      'Code Review Audit Trail',
      'System Access Audit',
    ],
    install: [
      'Installation Guide',
      'Pre-requisites Document',
      'Environment Setup Guide',
      'Upgrade Guide',
      'Uninstall & Cleanup Guide',
    ],
    kb: [
      'Knowledge Base Article #101',
      'KB: Common Patterns',
      'KB: Performance Tuning',
      'KB: Security Best Practices',
      'KB: Migration Tips',
    ],
  };

  let id = 1;
  for (const product of PRODUCTS) {
    for (const dtype of DOC_TYPES) {
      const typeTitles = titles[dtype];
      const count = rInt(1, Math.min(2, typeTitles.length));
      for (let i = 0; i < count; i++) {
        const status: DocStatus = rPick(['completed', 'completed', 'in-progress', 'not-started', 'in-progress']);
        const comp =
          status === 'completed'
            ? rInt(95, 100)
            : status === 'in-progress'
              ? rInt(20, 80)
              : rInt(0, 10);
        docs.push({
          id,
          productId: product,
          type: dtype,
          title: typeTitles[i % typeTitles.length],
          status,
          owner: rPick(OWNERS),
          completion: comp,
          lastUpdated: rDate(),
          reviewer: rPick(REVIEWERS),
          comments: rComments(),
        });
        id++;
      }
    }
  }
  return docs;
};

const ALL_DOCS: DocItem[] = genDocs();

/* ---------- components ---------- */

function SummaryCard({
  label,
  count,
  bgClass,
}: {
  label: string;
  count: number;
  bgClass: string;
}) {
  return (
    <div
      className={`rounded-xl p-5 flex flex-col gap-1 shadow-sm border border-transparent ${bgClass} text-white`}
    >
      <span className="text-sm opacity-80 font-medium">{label}</span>
      <span className="text-3xl font-bold">{count}</span>
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  const color =
    value >= 90
      ? 'bg-emerald-500'
      : value >= 50
        ? 'bg-amber-500'
        : 'bg-slate-400';
  return (
    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function StatusBadge({ status }: { status: DocStatus }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{
        backgroundColor: STATUS_COLORS[status] + '20',
        color: STATUS_COLORS[status],
      }}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: STATUS_COLORS[status] }}
      />
      {STATUS_LABELS[status]}
    </span>
  );
}

export default function PmoDocsPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [productFilter, setProductFilter] = useState<string>('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editCompletion, setEditCompletion] = useState(0);
  const [editStatus, setEditStatus] = useState<DocStatus>('not-started');
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [docs, setDocs] = useState(ALL_DOCS);

  /* ---- filters ---- */
  const filtered = useMemo(() => {
    return docs.filter((d) => {
      const q = search.toLowerCase();
      if (
        q &&
        !d.title.toLowerCase().includes(q) &&
        !d.productId.toLowerCase().includes(q) &&
        !d.owner.toLowerCase().includes(q) &&
        !d.reviewer.toLowerCase().includes(q)
      )
        return false;
      if (typeFilter && d.type !== typeFilter) return false;
      if (statusFilter && d.status !== statusFilter) return false;
      if (productFilter && d.productId !== productFilter) return false;
      return true;
    });
  }, [search, typeFilter, statusFilter, productFilter, docs]);

  /* ---- summary stats ---- */
  const total = docs.length;
  const completed = docs.filter((d) => d.status === 'completed').length;
  const inProgress = docs.filter((d) => d.status === 'in-progress').length;
  const notStarted = docs.filter((d) => d.status === 'not-started').length;

  /* ---- per-product progress ---- */
  const productProgress = useMemo(() => {
    const map: Record<string, { total: number; completed: number; inProgress: number }> = {};
    docs.forEach((d) => {
      if (!map[d.productId]) map[d.productId] = { total: 0, completed: 0, inProgress: 0 };
      map[d.productId].total++;
      if (d.status === 'completed') map[d.productId].completed++;
      if (d.status === 'in-progress') map[d.productId].inProgress++;
    });
    return map;
  }, [docs]);

  /* ---- inline edit ---- */
  const startEdit = (doc: DocItem) => {
    setEditingId(doc.id);
    setEditCompletion(doc.completion);
    setEditStatus(doc.status);
  };
  const saveEdit = (id: number) => {
    setDocs((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, status: editStatus, completion: editCompletion }
          : d,
      ),
    );
    setEditingId(null);
  };
  const cancelEdit = () => setEditingId(null);

  /* ---- export ---- */
  const exportExcel = () => {
    const data = filtered.map((d) => ({
      ID: d.id,
      Product: d.productId,
      Type: DOC_TYPE_LABELS[d.type],
      Title: d.title,
      Status: STATUS_LABELS[d.status],
      Owner: d.owner,
      'Completion %': d.completion,
      'Last Updated': d.lastUpdated,
      Reviewer: d.reviewer,
      Comments: d.comments,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Docs');
    XLSX.writeFile(wb, 'pmo-documentation-tracker.xlsx');
  };

  const toggleComments = (id: number) => {
    setExpandedComments((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="h-full overflow-y-auto p-6 max-w-[1400px] mx-auto font-sans">
      {/* ---- header ---- */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Documentation Tracker
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Track documentation status across all products
        </p>
      </div>

      {/* ---- summary cards ---- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard label="Total Docs" count={total} bgClass="bg-[#2563EB]" />
        <SummaryCard label="Completed" count={completed} bgClass="bg-emerald-600" />
        <SummaryCard label="In Progress" count={inProgress} bgClass="bg-amber-500" />
        <SummaryCard label="Not Started" count={notStarted} bgClass="bg-slate-500" />
      </div>

      {/* ---- product progress bars ---- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(productProgress).map(([pid, stat]) => {
          const compPct = stat.total ? Math.round((stat.completed / stat.total) * 100) : 0;
          const ipPct = stat.total ? Math.round((stat.inProgress / stat.total) * 100) : 0;
          return (
            <div
              key={pid}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{pid}</span>
                <span className="text-xs font-bold text-[#2563EB]">{compPct}%</span>
              </div>
              <div className="w-full h-3 flex rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full" style={{ width: `${compPct}%` }} />
                <div className="bg-amber-500 h-full" style={{ width: `${ipPct}%` }} />
                <div className="bg-slate-300 dark:bg-slate-700 flex-1 h-full" />
              </div>
              <div className="flex justify-between mt-1 text-[10px] text-slate-400">
                <span>{stat.total} docs</span>
                <span>{stat.completed} done</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ---- filter bar ---- */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-[360px]">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, product, owner..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
        >
          <option value="">All Doc Types</option>
          {DOC_TYPES.map((t) => (
            <option key={t} value={t}>
              {DOC_TYPE_LABELS[t]}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
        >
          <option value="">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="in-progress">In Progress</option>
          <option value="not-started">Not Started</option>
        </select>

        <select
          value={productFilter}
          onChange={(e) => setProductFilter(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
        >
          <option value="">All Products</option>
          {PRODUCTS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg text-sm ${viewMode === 'table' ? 'bg-[#2563EB] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
            title="Table view"
          >
            <FiList size={16} />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg text-sm ${viewMode === 'grid' ? 'bg-[#2563EB] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
            title="Grid view"
          >
            <FiGrid size={16} />
          </button>
          <button
            onClick={exportExcel}
            className="ml-2 flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
          >
            <FiDownload size={14} />
            Export Excel
          </button>
        </div>
      </div>

      {/* ---- table / grid ---- */}
      {viewMode === 'table' ? (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">Product</th>
                <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">Doc Type</th>
                <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">Title</th>
                <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">Status</th>
                <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">Owner</th>
                <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">Completion</th>
                <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">Last Updated</th>
                <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">Reviewer</th>
                <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">Comments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">{doc.productId}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className="inline-block px-2 py-0.5 rounded text-xs font-semibold text-white"
                      style={{ backgroundColor: DOC_TYPE_COLORS[doc.type] }}
                    >
                      {DOC_TYPE_LABELS[doc.type]}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium max-w-[260px] truncate">{doc.title}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {editingId === doc.id ? (
                      <div className="flex items-center gap-1">
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value as DocStatus)}
                          className="text-xs px-1 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                        >
                          <option value="completed">Completed</option>
                          <option value="in-progress">In Progress</option>
                          <option value="not-started">Not Started</option>
                        </select>
                        <button onClick={() => saveEdit(doc.id)} className="text-emerald-600 hover:text-emerald-700">
                          <FiCheck size={14} />
                        </button>
                        <button onClick={cancelEdit} className="text-red-500 hover:text-red-600">
                          <FiX size={14} />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => startEdit(doc)} className="cursor-pointer" title="Click to edit">
                        <StatusBadge status={doc.status} />
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">{doc.owner}</td>
                  <td className="px-4 py-3 whitespace-nowrap min-w-[120px]">
                    {editingId === doc.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={editCompletion}
                          onChange={(e) => setEditCompletion(Number(e.target.value))}
                          className="w-14 text-xs px-1 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                        />
                        <span className="text-xs">%</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <ProgressBar value={doc.completion} />
                        <span className="text-xs font-mono w-9 text-right">{doc.completion}%</span>
                      </div>
                    )}
                    {editingId !== doc.id && (
                      <button
                        onClick={() => startEdit(doc)}
                        className="mt-0.5 text-[10px] text-slate-400 hover:text-[#2563EB] flex items-center gap-0.5"
                      >
                        <FiEdit3 size={10} /> edit
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap text-xs">{doc.lastUpdated}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">{doc.reviewer}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {doc.comments ? (
                      <button
                        onClick={() => toggleComments(doc.id)}
                        className="flex items-center gap-1 text-xs text-[#2563EB] hover:underline"
                      >
                        <FiFileText size={12} />
                        {expandedComments.has(doc.id) ? 'Hide' : 'View'}
                        {expandedComments.has(doc.id) ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />}
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                    {expandedComments.has(doc.id) && (
                      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-[200px] bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-700">
                        {doc.comments}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400">No documentation items match your filters.</div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doc) => (
            <div
              key={doc.id}
              className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:shadow-md transition-shadow bg-white dark:bg-slate-900"
            >
              <div className="flex items-start justify-between mb-2">
                <span
                  className="inline-block px-2 py-0.5 rounded text-xs font-semibold text-white"
                  style={{ backgroundColor: DOC_TYPE_COLORS[doc.type] }}
                >
                  {DOC_TYPE_LABELS[doc.type]}
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => startEdit(doc)} className="text-slate-400 hover:text-[#2563EB] p-1">
                    <FiEdit3 size={14} />
                  </button>
                  <StatusBadge status={doc.status} />
                </div>
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-white mb-1">{doc.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{doc.productId}</p>
              <div className="mb-2">
                <ProgressBar value={doc.completion} />
                <span className="text-[10px] text-slate-400 mt-0.5 block">{doc.completion}% complete</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{doc.owner}</span>
                <span>{doc.lastUpdated}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                <span>Reviewer: {doc.reviewer}</span>
                {doc.comments && (
                  <button
                    onClick={() => toggleComments(doc.id)}
                    className="text-[#2563EB] hover:underline"
                  >
                    {expandedComments.has(doc.id) ? 'Hide comment' : 'View comment'}
                  </button>
                )}
              </div>
              {expandedComments.has(doc.id) && (
                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-2 rounded">
                  {doc.comments}
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-400">No documentation items match your filters.</div>
          )}
        </div>
      )}

      <div className="mt-4 text-xs text-slate-400 text-right">
        Showing {filtered.length} of {total} documents
      </div>
    </div>
  );
}
