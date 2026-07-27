'use client';

import { useState, useMemo } from 'react';
import {
  FiPlus,
  FiX,
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiAlertTriangle,
  FiCheckCircle,
  FiPause,
  FiRotateCcw,
  FiGrid,
  FiList,
} from 'react-icons/fi';

/* ---------- types ---------- */
type ReleaseStatus = 'planned' | 'in-progress' | 'rc' | 'deployed' | 'rolled-back';
type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

interface ReleaseProduct {
  productId: string;
  status: ReleaseStatus;
  version: string;
}

interface Release {
  id: number;
  version: string;
  name: string;
  status: ReleaseStatus;
  date: string;
  products: ReleaseProduct[];
  description: string;
  releaseNotes: string;
  rollbackPlan: string;
  risk: RiskLevel;
  approvalChain: string[];
  approved: boolean;
}

const STATUS_LABELS: Record<ReleaseStatus, string> = {
  planned: 'Planned',
  'in-progress': 'In Progress',
  rc: 'Release Candidate',
  deployed: 'Deployed',
  'rolled-back': 'Rolled Back',
};

const STATUS_COLORS: Record<ReleaseStatus, string> = {
  planned: '#3B82F6',
  'in-progress': '#F59E0B',
  rc: '#8B5CF6',
  deployed: '#10B981',
  'rolled-back': '#EF4444',
};

const RISK_COLORS: Record<RiskLevel, string> = {
  low: '#10B981',
  medium: '#F59E0B',
  high: '#EA580C',
  critical: '#DC2626',
};

const RISK_LABELS: Record<RiskLevel, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

const ALL_PRODUCTS = [
  'ENT-GANESH',
  'ENT-SURYA',
  'ENT-VEGA',
  'ENT-NARAD',
  'ENT-DELTA',
  'ENT-CHITRAGUPTA',
  'ENT-KAVACH',
  'ENT-TALKOFFICE',
];

const COLUMNS: ReleaseStatus[] = ['planned', 'in-progress', 'rc', 'deployed', 'rolled-back'];

/* ---------- 8 releases ---------- */
const RELEASES: Release[] = [
  {
    id: 1,
    version: 'v3.2.0',
    name: 'Quantum Stabilizer',
    status: 'deployed',
    date: '2026-06-15',
    products: [
      { productId: 'ENT-GANESH', status: 'deployed', version: 'v3.2.0' },
      { productId: 'ENT-SURYA', status: 'deployed', version: 'v3.2.0' },
      { productId: 'ENT-VEGA', status: 'deployed', version: 'v3.2.0' },
      { productId: 'ENT-NARAD', status: 'deployed', version: 'v3.2.0' },
    ],
    description: 'Major platform stabilization release with enhanced observability and performance improvements across all core engines.',
    releaseNotes: `## Release v3.2.0 — Quantum Stabilizer\n\n### New Features\n- Distributed tracing across all microservices\n- Real-time latency dashboards for critical paths\n- Auto-scaling rules refined for GANESH tick processing\n\n### Bug Fixes\n- Memory leak in NARAD WebSocket pool resolved\n- Race condition in SURYA portfolio calculation fixed\n\n### Performance\n- GANESH: 22% improvement in tick-to-candle latency\n- VEGA: 15% faster order matching`,
    rollbackPlan: 'Deploy previous v3.1.2 images via ArgoCD rollback. Database migrations are backward-compatible. Estimated rollback time: 8 minutes.',
    risk: 'medium',
    approvalChain: ['SRE Lead', 'VP Engineering', 'CISO'],
    approved: true,
  },
  {
    id: 2,
    version: 'v3.3.0',
    name: 'Pulse Engine',
    status: 'rc',
    date: '2026-07-20',
    products: [
      { productId: 'ENT-GANESH', status: 'rc', version: 'v3.3.0' },
      { productId: 'ENT-NARAD', status: 'rc', version: 'v3.3.0' },
      { productId: 'ENT-DELTA', status: 'rc', version: 'v3.3.0' },
      { productId: 'ENT-KAVACH', status: 'rc', version: 'v3.3.0' },
      { productId: 'ENT-CHITRAGUPTA', status: 'in-progress', version: 'v3.3.0' },
    ],
    description: 'Real-time pulse monitoring and predictive alerting system with ML-powered anomaly detection.',
    releaseNotes: `## Release v3.3.0 — Pulse Engine\n\n### New Features\n- ML-based anomaly detection for trade patterns\n- Predictive alerting with 15-minute forecast window\n- Pulse dashboard with live system health scores\n\n### Infrastructure\n- Kafka cluster upgrade to v3.6\n- New Redis cluster for caching layer`,
    rollbackPlan: 'Feature flags can disable ML pipeline instantly. Infrastructure changes require coordinated rollback via Terraform. Estimated time: 12 minutes.',
    risk: 'high',
    approvalChain: ['SRE Lead', 'VP Engineering', 'CISO', 'CTO'],
    approved: true,
  },
  {
    id: 3,
    version: 'v3.4.0',
    name: 'Iron Gate',
    status: 'in-progress',
    date: '2026-08-01',
    products: [
      { productId: 'ENT-VEGA', status: 'in-progress', version: 'v3.4.0' },
      { productId: 'ENT-KAVACH', status: 'in-progress', version: 'v3.4.0' },
      { productId: 'ENT-CHITRAGUPTA', status: 'in-progress', version: 'v3.4.0' },
      { productId: 'ENT-TALKOFFICE', status: 'planned', version: 'v3.4.0' },
    ],
    description: 'Security hardening release with enhanced audit trails, encryption upgrades, and compliance framework integration.',
    releaseNotes: `## Release v3.4.0 — Iron Gate\n\n### Security\n- AES-256-GCM encryption for all data at rest\n- Enhanced audit trail with immutable logs\n- SOC 2 Type II compliance framework\n\n### New Features\n- Role-based access control v2\n- Multi-factor authentication enforcement`,
    rollbackPlan: 'Security changes are additive. Rollback involves reverting to v3.3.0 encryption keys. Immediate revert possible via feature flags. Estimated time: 15 minutes.',
    risk: 'critical',
    approvalChain: ['Security Architect', 'VP Engineering', 'CISO', 'CTO', 'Compliance Officer'],
    approved: true,
  },
  {
    id: 4,
    version: 'v3.5.0',
    name: 'Apex Trader',
    status: 'planned',
    date: '2026-09-10',
    products: [
      { productId: 'ENT-GANESH', status: 'planned', version: 'v3.5.0' },
      { productId: 'ENT-SURYA', status: 'planned', version: 'v3.5.0' },
      { productId: 'ENT-VEGA', status: 'planned', version: 'v3.5.0' },
      { productId: 'ENT-DELTA', status: 'planned', version: 'v3.5.0' },
      { productId: 'ENT-NARAD', status: 'planned', version: 'v3.5.0' },
    ],
    description: 'Advanced order types, smart order routing v2, and algorithmic trading framework for institutional clients.',
    releaseNotes: `## Release v3.5.0 — Apex Trader\n\n### New Features\n- Iceberg, TWAP, VWAP order types\n- Smart order routing v2 with ML optimization\n- Algorithmic trading SDK for institutional clients\n\n### Performance\n- Order throughput target: 500K orders/sec`,
    rollbackPlan: 'New order types are additive. Smart routing v2 can be disabled via config flag. Core order engine unchanged. Estimated time: 5 minutes.',
    risk: 'medium',
    approvalChain: ['Product Manager', 'VP Engineering', 'Head of Trading'],
    approved: false,
  },
  {
    id: 5,
    version: 'v2.9.1',
    name: 'Hotfix — Memory Patch',
    status: 'deployed',
    date: '2026-07-05',
    products: [
      { productId: 'ENT-GANESH', status: 'deployed', version: 'v2.9.1' },
      { productId: 'ENT-NARAD', status: 'deployed', version: 'v2.9.1' },
    ],
    description: 'Critical hotfix to address memory pressure in tick streaming pipeline during peak market hours.',
    releaseNotes: `## Hotfix v2.9.1\n\n### Fixes\n- Patched buffer overflow in GANESH tick ingestion\n- NARAD connection pool leak resolved`,
    rollbackPlan: 'Single-commit revert. Re-deploy v2.9.0 images. No database changes. Estimated time: 3 minutes.',
    risk: 'low',
    approvalChain: ['SRE Lead', 'VP Engineering'],
    approved: true,
  },
  {
    id: 6,
    version: 'v2.9.0',
    name: 'Velocity',
    status: 'rolled-back',
    date: '2026-06-28',
    products: [
      { productId: 'ENT-GANESH', status: 'rolled-back', version: 'v2.8.5' },
      { productId: 'ENT-VEGA', status: 'rolled-back', version: 'v2.8.5' },
      { productId: 'ENT-NARAD', status: 'rolled-back', version: 'v2.8.5' },
    ],
    description: 'Performance optimization release. Rolled back due to unexpected latency spikes in VEGA order matching.',
    releaseNotes: `## Release v2.9.0 — Velocity (ROLLED BACK)\n\n### Reason for Rollback\n- 40% latency increase in VEGA order matching\n- Caused by experimental lock-free queue implementation\n\n### Intended Features\n- Lock-free queues for order matching\n- Optimized tick batching`,
    rollbackPlan: 'Immediate rollback executed on 2026-06-28. Root cause identified: lock-free queue data race. Fix in progress for v3.0.',
    risk: 'high',
    approvalChain: ['VP Engineering', 'CTO'],
    approved: true,
  },
  {
    id: 7,
    version: 'v3.6.0',
    name: 'Nexus Hub',
    status: 'planned',
    date: '2026-10-20',
    products: [
      { productId: 'ENT-SURYA', status: 'planned', version: 'v3.6.0' },
      { productId: 'ENT-DELTA', status: 'planned', version: 'v3.6.0' },
      { productId: 'ENT-TALKOFFICE', status: 'planned', version: 'v3.6.0' },
      { productId: 'ENT-CHITRAGUPTA', status: 'planned', version: 'v3.6.0' },
    ],
    description: 'Unified analytics hub connecting portfolio, risk, and compliance data into a single pane of glass.',
    releaseNotes: `## Release v3.6.0 — Nexus Hub\n\n### New Features\n- Cross-product analytics dashboard\n- Unified data model for portfolio + risk + compliance\n- Real-time data streaming bridge between SURYA and DELTA\n\n### Infrastructure\n- New data lake architecture on cloud storage`,
    rollbackPlan: 'Nexus Hub is a new service; core products unchanged. Rollback means disabling Nexus Hub endpoints. Estimated time: 2 minutes.',
    risk: 'medium',
    approvalChain: ['Product Manager', 'VP Engineering', 'Data Governance Lead'],
    approved: false,
  },
  {
    id: 8,
    version: 'v3.1.0',
    name: 'Circuit Breaker',
    status: 'in-progress',
    date: '2026-08-15',
    products: [
      { productId: 'ENT-KAVACH', status: 'in-progress', version: 'v3.1.0' },
      { productId: 'ENT-VEGA', status: 'in-progress', version: 'v3.1.0' },
      { productId: 'ENT-NARAD', status: 'planned', version: 'v3.1.0' },
    ],
    description: 'Resilience engineering release — circuit breakers, bulkheads, and graceful degradation patterns across all services.',
    releaseNotes: `## Release v3.1.0 — Circuit Breaker\n\n### New Features\n- Service-level circuit breakers with configurable thresholds\n- Bulkhead pattern for resource isolation\n- Graceful degradation for non-critical services\n\n### Observability\n- Circuit breaker state dashboards\n- Degradation event alerting`,
    rollbackPlan: 'Circuit breakers are additive. Can be disabled globally via central config toggle. No data changes. Estimated time: 4 minutes.',
    risk: 'low',
    approvalChain: ['SRE Lead', 'VP Engineering'],
    approved: true,
  },
];

/* ---------- components ---------- */

function RiskBadge({ risk }: { risk: RiskLevel }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ backgroundColor: RISK_COLORS[risk] + '20', color: RISK_COLORS[risk] }}
    >
      <FiAlertTriangle size={10} />
      {RISK_LABELS[risk]}
    </span>
  );
}

function ReleaseCard({
  release,
  isExpanded,
  onToggle,
}: {
  release: Release;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all">
      <button onClick={onToggle} className="w-full text-left p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-bold text-slate-800 dark:text-white">{release.version}</span>
              <span
                className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold text-white"
                style={{ backgroundColor: STATUS_COLORS[release.status] }}
              >
                {STATUS_LABELS[release.status]}
              </span>
            </div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-200">{release.name}</h3>
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <FiCalendar size={10} />
              <span>{release.date}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span
              className="inline-flex items-center gap-1 text-xs"
              style={{ color: release.approved ? '#10B981' : '#F59E0B' }}
            >
              {release.approved ? <FiCheckCircle size={12} /> : <FiClock size={12} />}
              {release.approved ? 'Approved' : 'Pending'}
            </span>
            <RiskBadge risk={release.risk} />
            {isExpanded ? <FiChevronUp size={14} className="text-slate-400 mt-1" /> : <FiChevronDown size={14} className="text-slate-400 mt-1" />}
          </div>
        </div>

        <div className="mt-2 flex flex-wrap gap-1">
          {release.products.map((p) => (
            <span
              key={p.productId}
              className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            >
              {p.productId}
            </span>
          ))}
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-slate-100 dark:border-slate-800 pt-3 space-y-4">
          <div>
            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Description</h4>
            <p className="text-sm text-slate-700 dark:text-slate-300">{release.description}</p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Release Notes</h4>
            <pre className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 whitespace-pre-wrap font-mono">
              {release.releaseNotes}
            </pre>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Products</h4>
            <div className="grid grid-cols-2 gap-2">
              {release.products.map((p) => (
                <div
                  key={p.productId}
                  className="flex items-center justify-between px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
                >
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{p.productId}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">{p.version}</span>
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{ backgroundColor: STATUS_COLORS[p.status] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Rollback Plan</h4>
            <p className="text-sm text-slate-700 dark:text-slate-300">{release.rollbackPlan}</p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Approval Chain</h4>
            <div className="flex items-center gap-2 flex-wrap">
              {release.approvalChain.map((a, i) => (
                <span key={a} className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                  <span className="w-6 h-6 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-[10px] font-bold">
                    {a.charAt(0)}
                  </span>
                  {a}
                  {i < release.approvalChain.length - 1 && (
                    <span className="text-slate-300 dark:text-slate-600 mx-1">&rarr;</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PmoReleasesPage() {
  const [releases, setReleases] = useState<Release[]>(RELEASES);
  const [viewMode, setViewMode] = useState<'kanban' | 'timeline'>('kanban');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  /* ---- create form state ---- */
  const [formName, setFormName] = useState('');
  const [formVersion, setFormVersion] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formRisk, setFormRisk] = useState<RiskLevel>('medium');
  const [formProducts, setFormProducts] = useState<string[]>([]);

  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const toggleProduct = (pid: string) => {
    setFormProducts((prev) =>
      prev.includes(pid) ? prev.filter((p) => p !== pid) : [...prev, pid],
    );
  };

  const handleCreate = () => {
    if (!formName || !formVersion || !formDate) return;
    const newRelease: Release = {
      id: Math.max(...releases.map((r) => r.id), 0) + 1,
      version: formVersion,
      name: formName,
      status: 'planned',
      date: formDate,
      products: formProducts.map((pid) => ({
        productId: pid,
        status: 'planned' as ReleaseStatus,
        version: formVersion,
      })),
      description: formDesc,
      releaseNotes: '',
      rollbackPlan: 'TBD',
      risk: formRisk,
      approvalChain: [],
      approved: false,
    };
    setReleases((prev) => [...prev, newRelease]);
    setShowCreate(false);
    setFormName('');
    setFormVersion('');
    setFormDate('');
    setFormDesc('');
    setFormRisk('medium');
    setFormProducts([]);
  };

  const grouped = useMemo(() => {
    const map: Record<ReleaseStatus, Release[]> = {
      planned: [],
      'in-progress': [],
      rc: [],
      deployed: [],
      'rolled-back': [],
    };
    releases.forEach((r) => map[r.status].push(r));
    return map;
  }, [releases]);

  const sortedTimeline = useMemo(() => {
    return [...releases].sort((a, b) => b.date.localeCompare(a.date));
  }, [releases]);

  return (
    <div className="h-full overflow-y-auto p-6 max-w-[1400px] mx-auto font-sans">
      {/* ---- header ---- */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Release Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track releases across the pipeline</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'kanban'
                ? 'bg-[#2563EB] text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <FiGrid size={14} /> Kanban
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'timeline'
                ? 'bg-[#2563EB] text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <FiList size={14} /> Timeline
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-[#2563EB] hover:bg-blue-700 text-white transition-colors ml-2"
          >
            <FiPlus size={14} /> Create Release
          </button>
        </div>
      </div>

      {/* ---- kanban view ---- */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 min-h-[500px]">
          {COLUMNS.map((col) => {
            const items = grouped[col];
            return (
              <div
                key={col}
                className="flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: STATUS_COLORS[col] }}
                    />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {STATUS_LABELS[col]}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    {items.length}
                  </span>
                </div>
                <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[70vh] custom-scrollbar">
                  {items.map((r) => (
                    <ReleaseCard
                      key={r.id}
                      release={r}
                      isExpanded={expandedId === r.id}
                      onToggle={() => toggleExpand(r.id)}
                    />
                  ))}
                  {items.length === 0 && (
                    <div className="text-center py-8 text-xs text-slate-400">No releases</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ---- timeline view ---- */}
      {viewMode === 'timeline' && (
        <div className="space-y-6">
          {(() => {
            const groupedByMonth: Record<string, Release[]> = {};
            sortedTimeline.forEach((r) => {
              const month = r.date.slice(0, 7);
              if (!groupedByMonth[month]) groupedByMonth[month] = [];
              groupedByMonth[month].push(r);
            });

            return Object.entries(groupedByMonth)
              .sort(([a], [b]) => b.localeCompare(a))
              .map(([month, items]) => (
                <div key={month}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-bold text-[#2563EB]">{month}</span>
                    <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                  </div>
                  <div className="space-y-3 pl-6 border-l-2 border-slate-200 dark:border-slate-800">
                    {items.map((r) => (
                      <div key={r.id} className="relative">
                        <div
                          className="absolute -left-[22px] top-4 w-3 h-3 rounded-full border-2 border-white dark:border-slate-950"
                          style={{ backgroundColor: STATUS_COLORS[r.status] }}
                        />
                        <ReleaseCard
                          release={r}
                          isExpanded={expandedId === r.id}
                          onToggle={() => toggleExpand(r.id)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ));
          })()}
        </div>
      )}

      {/* ---- create modal ---- */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Create Release</h2>
              <button
                onClick={() => setShowCreate(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Release Name</label>
                <input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Quantum Stabilizer"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Version</label>
                  <input
                    value={formVersion}
                    onChange={(e) => setFormVersion(e.target.value)}
                    placeholder="v3.0.0"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Date</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Risk Level</label>
                <div className="flex gap-2">
                  {(['low', 'medium', 'high', 'critical'] as RiskLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setFormRisk(lvl)}
                      className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                        formRisk === lvl
                          ? 'border-current text-white'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                      style={
                        formRisk === lvl
                          ? { backgroundColor: RISK_COLORS[lvl], borderColor: RISK_COLORS[lvl] }
                          : {}
                      }
                    >
                      {RISK_LABELS[lvl]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Products</label>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_PRODUCTS.map((pid) => (
                    <button
                      key={pid}
                      onClick={() => toggleProduct(pid)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                        formProducts.includes(pid)
                          ? 'border-[#2563EB] bg-[#2563EB]/10 text-[#2563EB]'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-[#2563EB]/50'
                      }`}
                    >
                      {formProducts.includes(pid) ? `✓ ${pid}` : pid}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Description</label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  rows={3}
                  placeholder="Describe the release..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2563EB] resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 text-sm rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white font-medium"
              >
                Create Release
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
