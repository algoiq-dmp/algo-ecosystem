'use client';

import { useState, useMemo, useCallback, KeyboardEvent } from 'react';
import {
  FiSearch, FiPlus, FiDownload, FiX, FiTrash2, FiFilter,
  FiTag, FiServer, FiUser, FiCalendar, FiFileText,
  FiBarChart2, FiAlertCircle, FiCheckSquare, FiSquare,
} from 'react-icons/fi';

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */
type ReadinessLevel = 'Green' | 'Amber' | 'Red';

interface Product {
  id: string;
  name: string;
  category: string;
  version: string;
  status: 'online' | 'degraded' | 'offline';
  owner: string;
  server: string;
  progress: number;
  readiness: ReadinessLevel;
  docCompletion: number;
  testingPct: number;
  lastUpdated: string;
  releaseTarget: string;
  features: string[];
  dependencies: string[];
  description: string;
}

/* ------------------------------------------------------------------ */
/*  Seed data (same as dashboard)                                     */
/* ------------------------------------------------------------------ */
const defaultProducts: Product[] = [
  { id: 'ganesh', name: 'Ganesh', category: 'Analytics', version: '3.2.1', status: 'online', owner: 'Data Engineering', server: 'ALGO IQ 20', progress: 98, readiness: 'Green', docCompletion: 95, testingPct: 97, lastUpdated: '2026-07-20', releaseTarget: '2026-08-15', features: ['Real-time OHLC', 'Historical Data', 'Corporate Actions', 'Multi-interval Support'], dependencies: ['feed-server', 'mq'], description: 'Central OHLC Provider — single source of truth for all market data.' },
  { id: 'feed-server', name: 'Feed Server', category: 'Infrastructure', version: '2.8.0', status: 'online', owner: 'Market Data', server: 'ALGO IQ 18', progress: 95, readiness: 'Green', docCompletion: 88, testingPct: 93, lastUpdated: '2026-07-18', releaseTarget: '2026-09-01', features: ['Multi-exchange Feed', 'Feed Normalization', 'Low Latency'], dependencies: ['exchange'], description: 'Primary exchange market feed receiver.' },
  { id: 'vega', name: 'Vega', category: 'Execution', version: '6.3.0', status: 'online', owner: 'Execution', server: 'ALGO IQ 6', progress: 99, readiness: 'Green', docCompletion: 96, testingPct: 99, lastUpdated: '2026-07-22', releaseTarget: '2026-08-30', features: ['Order Routing', 'Broker Integration', 'FIX Protocol', 'Order Validation'], dependencies: ['talkstrategy-api', 'strategy-factory'], description: 'Central Order Processor — every order reaches exchange only through Vega.' },
  { id: 'talkdelta', name: 'TalkDelta', category: 'Analytics', version: '5.1.0', status: 'degraded', owner: 'Analytics', server: 'ALGO IQ 4', progress: 87, readiness: 'Amber', docCompletion: 82, testingPct: 85, lastUpdated: '2026-07-15', releaseTarget: '2026-09-15', features: ['Strategy Dashboard', 'Post-Trade Analytics', 'P&L Tracking'], dependencies: ['vega', 'mq', 'talkoptions'], description: 'Strategy dashboard and post-trade analytics platform.' },
  { id: 'talkoffice', name: 'TalkOffice', category: 'Operations', version: '4.0.0', status: 'online', owner: 'Operations', server: 'ALGO IQ 19', progress: 96, readiness: 'Green', docCompletion: 91, testingPct: 94, lastUpdated: '2026-07-21', releaseTarget: '2026-08-20', features: ['Order Management', 'Risk Management', 'Position Tracking', 'P&L'], dependencies: ['vega', 'talkdelta'], description: 'OMS/RMS — Real-time position, broker-wise, strategy-wise.' },
  { id: 'dxcc', name: 'DXCC', category: 'Operations', version: '5.0.0', status: 'degraded', owner: 'Operations', server: 'ALGO IQ 6', progress: 82, readiness: 'Amber', docCompletion: 78, testingPct: 80, lastUpdated: '2026-07-14', releaseTarget: '2026-09-10', features: ['Unified Monitoring', 'Real-time Alerts', 'Performance Dashboard'], dependencies: ['vega', 'talkdelta', 'suchak'], description: 'Execution Command Center — monitors every product, engine, strategy.' },
  { id: 'suchak', name: 'Suchak', category: 'Engine', version: '4.1.0', status: 'online', owner: 'Analytics', server: 'ALGO IQ 6', progress: 97, readiness: 'Green', docCompletion: 93, testingPct: 96, lastUpdated: '2026-07-19', releaseTarget: '2026-08-25', features: ['Technical Indicators', 'RSI', 'MACD', 'Bollinger Bands'], dependencies: ['mq', 'ganesh'], description: 'Technical engine for computing indicators and technical values.' },
  { id: 'kavach', name: 'Kavach', category: 'Risk', version: '3.5.0', status: 'online', owner: 'Risk', server: 'ALGO IQ 6', progress: 94, readiness: 'Green', docCompletion: 90, testingPct: 92, lastUpdated: '2026-07-17', releaseTarget: '2026-08-28', features: ['Risk Monitoring', 'Exposure Tracking', 'VaR Calculation'], dependencies: ['talkdelta', 'mq'], description: 'Risk engine monitoring and broadcasting risk signals.' },
  { id: 'rakshak', name: 'Rakshak', category: 'Risk', version: '2.3.0', status: 'online', owner: 'Risk', server: 'ALGO IQ 6', progress: 88, readiness: 'Amber', docCompletion: 76, testingPct: 82, lastUpdated: '2026-07-10', releaseTarget: '2026-09-20', features: ['Position Protection', 'Stop Loss', 'Auto Hedge'], dependencies: ['kavach'], description: 'Position protection engine — executes protective actions.' },
  { id: 'talkoptions', name: 'TalkOptions', category: 'Analytics', version: '4.7.2', status: 'online', owner: 'Analytics', server: 'ALGO IQ 18', progress: 96, readiness: 'Green', docCompletion: 94, testingPct: 95, lastUpdated: '2026-07-20', releaseTarget: '2026-08-18', features: ['150+ APIs', 'IV Calculation', 'Greeks', 'Option Chain'], dependencies: ['ganesh', 'mq'], description: 'Enterprise options analytics engine with 150+ REST APIs.' },
  { id: 'delta-xi', name: 'Delta XI', category: 'Strategy', version: '3.2.0', status: 'online', owner: 'Analytics', server: 'ALGO IQ 4', progress: 91, readiness: 'Green', docCompletion: 85, testingPct: 89, lastUpdated: '2026-07-16', releaseTarget: '2026-09-05', features: ['Market Screening', 'Signal Generation', 'Multi-condition Filters'], dependencies: ['mq', 'garuda', 'ganesh'], description: 'Market screeners for identifying trading opportunities.' },
  { id: 'vyuh', name: 'VYUH', category: 'Strategy', version: '3.0.0', status: 'online', owner: 'Analytics', server: 'ALGO IQ 4', progress: 89, readiness: 'Green', docCompletion: 83, testingPct: 87, lastUpdated: '2026-07-15', releaseTarget: '2026-09-08', features: ['Stock Analytics', 'Fundamental Analysis', 'Technical Screening'], dependencies: ['mq', 'garuda', 'ganesh'], description: 'Stock analytics engine.' },
  { id: 'spreadwatch', name: 'SpreadWatch', category: 'Strategy', version: '2.8.0', status: 'offline', owner: 'Analytics', server: 'ALGO IQ 4', progress: 65, readiness: 'Red', docCompletion: 58, testingPct: 60, lastUpdated: '2026-07-01', releaseTarget: '2026-10-01', features: ['Spread Analytics', 'Pairs Trading', 'Calendar Spreads'], dependencies: ['mq', 'garuda', 'ganesh'], description: 'Spread analytics for pairs and multi-leg strategies.' },
  { id: 'surya', name: 'Surya', category: 'Core', version: '2.4.1', status: 'online', owner: 'Operations', server: 'ALGO IQ 20', progress: 95, readiness: 'Green', docCompletion: 92, testingPct: 94, lastUpdated: '2026-07-19', releaseTarget: '2026-08-22', features: ['BOD Processing', 'EOD Processing', 'Margin Files'], dependencies: ['exchange'], description: 'BOD/EOD processor — handles contract files and margin files.' },
  { id: 'simulator', name: 'Simulator', category: 'Testing', version: '3.0.0', status: 'online', owner: 'QA', server: 'ALGO IQ 4', progress: 86, readiness: 'Amber', docCompletion: 79, testingPct: 84, lastUpdated: '2026-07-12', releaseTarget: '2026-09-12', features: ['Historical Simulation', 'Paper Trading', 'Backtesting'], dependencies: ['ganesh', 'talkdelta'], description: 'Historical simulation and paper trading platform.' },
  { id: 'parikshak', name: 'Parikshak', category: 'Testing', version: '2.0.0', status: 'online', owner: 'QA', server: 'ALGO IQ 6', progress: 78, readiness: 'Amber', docCompletion: 70, testingPct: 75, lastUpdated: '2026-07-08', releaseTarget: '2026-09-25', features: ['Regression Testing', 'Performance Testing', 'UAT'], dependencies: ['simulator'], description: 'Testing platform for certification, regression, performance.' },
  { id: 'talkdelta-ai', name: 'TalkDelta AI', category: 'AI', version: '1.4.0', status: 'degraded', owner: 'AI/ML', server: 'ALGO IQ 4', progress: 72, readiness: 'Red', docCompletion: 55, testingPct: 68, lastUpdated: '2026-07-05', releaseTarget: '2026-10-15', features: ['AI Decision Engine', 'Signal Generation', 'ML Models'], dependencies: ['talkdelta', 'mq'], description: 'AI-powered decision engine for strategy optimization.' },
  { id: 'chitragupta', name: 'Chitragupta', category: 'Audit', version: '3.0.0', status: 'online', owner: 'Compliance', server: 'ALGO IQ 6', progress: 90, readiness: 'Green', docCompletion: 87, testingPct: 90, lastUpdated: '2026-07-14', releaseTarget: '2026-08-30', features: ['Trade Audit', 'Compliance Reports', 'Log Management'], dependencies: ['talkdelta', 'vega'], description: 'Audit engine — compliance, reports, and logs.' },
  { id: 'suraksha', name: 'Suraksha', category: 'Security', version: '2.0.0', status: 'online', owner: 'Security', server: 'ALGO IQ 6', progress: 93, readiness: 'Green', docCompletion: 89, testingPct: 92, lastUpdated: '2026-07-18', releaseTarget: '2026-08-25', features: ['Authentication', 'Authorization', 'RBAC', 'Audit Logging'], dependencies: [], description: 'Security layer — authentication, authorization, encryption, RBAC.' },
  { id: 'manthan', name: 'Manthan', category: 'Engine', version: '2.0.0', status: 'online', owner: 'Data Engineering', server: 'ALGO IQ 6', progress: 88, readiness: 'Green', docCompletion: 81, testingPct: 86, lastUpdated: '2026-07-15', releaseTarget: '2026-09-01', features: ['Data Transformation', 'ETL', 'Stream Processing'], dependencies: ['mq', 'ganesh'], description: 'Data processing and transformation engine.' },
  { id: 'theta-yantra', name: 'Theta Yantra', category: 'Engine', version: '3.1.0', status: 'online', owner: 'Analytics', server: 'ALGO IQ 6', progress: 87, readiness: 'Green', docCompletion: 84, testingPct: 88, lastUpdated: '2026-07-16', releaseTarget: '2026-08-28', features: ['Advanced Greeks', 'Theoretical Pricing', 'Volatility Surface'], dependencies: ['ganesh', 'mq'], description: 'Options analytics engine for advanced calculations.' },
  { id: 'kuber-alpha', name: 'Kuber Alpha', category: 'Execution', version: '1.8.0', status: 'online', owner: 'Strategy', server: 'ALGO IQ 4', progress: 84, readiness: 'Amber', docCompletion: 73, testingPct: 80, lastUpdated: '2026-07-13', releaseTarget: '2026-09-18', features: ['Strategy Orchestration', 'Signal Aggregation', 'Execution Dispatch'], dependencies: ['strategy-factory', 'delta-xi', 'vyuh'], description: 'Central strategy orchestration and execution dispatcher.' },
];

const categories = [...new Set(defaultProducts.map(p => p.category))].sort();
const allCategories = ['All', ...categories];
const statuses = ['all', 'online', 'degraded', 'offline'] as const;
const readinessLevels = ['All', 'Green', 'Amber', 'Red'] as const;

/* ------------------------------------------------------------------ */
/*  Reusable style helpers                                            */
/* ------------------------------------------------------------------ */
const statusColors: Record<string, string> = {
  online: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  degraded: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  offline: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

const readinessDot = {
  Green: 'bg-emerald-500',
  Amber: 'bg-amber-500',
  Red: 'bg-red-500',
};

const readinessBadge: Record<ReadinessLevel, string> = {
  Green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  Amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  Red: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

/* ------------------------------------------------------------------ */
/*  Inline editable cell component                                    */
/* ------------------------------------------------------------------ */
function EditableCell({
  value, onSave, type = 'text', options,
}: {
  value: string | number;
  onSave: (v: string | number) => void;
  type?: 'text' | 'select' | 'number' | 'date';
  options?: string[];
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));

  const commit = () => {
    setEditing(false);
    const trimmed = draft.trim();
    if (trimmed && trimmed !== String(value)) {
      onSave(type === 'number' ? Number(trimmed) : trimmed);
    }
  };

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter') commit();
    if (e.key === 'Escape') { setEditing(false); setDraft(String(value)); }
  };

  if (!editing) {
    return (
      <span
        className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 px-1.5 py-0.5 rounded transition-colors inline-block max-w-[180px] truncate"
        onClick={() => { setEditing(true); setDraft(String(value)); }}
        title="Click to edit"
      >
        {value}
      </span>
    );
  }

  if (type === 'select' && options) {
    return (
      <select
        autoFocus
        value={draft}
        onChange={e => { setDraft(e.target.value); commit(); }}
        onBlur={commit}
        onKeyDown={handleKey}
        className="bg-white dark:bg-slate-800 border border-blue-400 dark:border-blue-600 rounded px-2 py-0.5 text-sm outline-none w-full"
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  }

  if (type === 'date') {
    return (
      <input
        autoFocus
        type="date"
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKey}
        className="bg-white dark:bg-slate-800 border border-blue-400 dark:border-blue-600 rounded px-2 py-0.5 text-sm outline-none w-full"
      />
    );
  }

  return (
    <input
      autoFocus
      type={type === 'number' ? 'number' : 'text'}
      value={draft}
      onChange={e => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={handleKey}
      className="bg-white dark:bg-slate-800 border border-blue-400 dark:border-blue-600 rounded px-2 py-0.5 text-sm outline-none w-full"
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Progress bar component                                            */
/* ------------------------------------------------------------------ */
function ProgressBar({ value, color = '#2563EB' }: { value: number; color?: string }) {
  return (
    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
      <div className="h-2 rounded-full transition-all duration-300" style={{ width: `${value}%`, backgroundColor: color }} />
    </div>
  );
}

/* ================================================================== */
/*  MAIN PAGE COMPONENT                                               */
/* ================================================================== */
export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterReadiness, setFilterReadiness] = useState<string>('All');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  /* --- Add product form state --- */
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '', category: 'Analytics', version: '1.0.0', status: 'online',
    owner: '', server: '', progress: 50, readiness: 'Green',
    docCompletion: 50, testingPct: 50, lastUpdated: new Date().toISOString().split('T')[0],
    releaseTarget: '', features: [], dependencies: [], description: '',
  });
  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [newDepInput, setNewDepInput] = useState('');

  /* --- Filtering --- */
  const filtered = useMemo(() => {
    return products.filter(p => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.description.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterStatus !== 'all' && p.status !== filterStatus) return false;
      if (filterCategory !== 'All' && p.category !== filterCategory) return false;
      if (filterReadiness !== 'All' && p.readiness !== filterReadiness) return false;
      return true;
    });
  }, [products, search, filterStatus, filterCategory, filterReadiness]);

  /* --- Update product field --- */
  const updateProduct = useCallback((id: string, field: keyof Product, value: string | number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  }, []);

  /* --- Selection --- */
  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map(p => p.id)));
    }
  };

  /* --- Bulk actions --- */
  const bulkUpdate = (field: 'status' | 'readiness', value: string) => {
    setProducts(prev => prev.map(p => selected.has(p.id) ? { ...p, [field]: value } as Product : p));
    setSelected(new Set());
  };

  /* --- Delete --- */
  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    if (detailProduct?.id === id) setDetailProduct(null);
  };

  /* --- Add product --- */
  const addProduct = () => {
    if (!newProduct.name?.trim() || !newProduct.owner?.trim()) return;
    const id = newProduct.name.toLowerCase().replace(/\s+/g, '-');
    const product: Product = {
      id,
      name: newProduct.name,
      category: newProduct.category || 'Analytics',
      version: newProduct.version || '1.0.0',
      status: (newProduct.status as Product['status']) || 'online',
      owner: newProduct.owner || '',
      server: newProduct.server || '',
      progress: newProduct.progress ?? 50,
      readiness: (newProduct.readiness as ReadinessLevel) || 'Green',
      docCompletion: newProduct.docCompletion ?? 50,
      testingPct: newProduct.testingPct ?? 50,
      lastUpdated: newProduct.lastUpdated || new Date().toISOString().split('T')[0],
      releaseTarget: newProduct.releaseTarget || '',
      features: newProduct.features || [],
      dependencies: newProduct.dependencies || [],
      description: newProduct.description || '',
    };
    setProducts(prev => [product, ...prev]);
    setShowAddModal(false);
    setNewProduct({ name: '', category: 'Analytics', version: '1.0.0', status: 'online', owner: '', server: '', progress: 50, readiness: 'Green', docCompletion: 50, testingPct: 50, lastUpdated: new Date().toISOString().split('T')[0], releaseTarget: '', features: [], dependencies: [], description: '' });
  };

  /* --- CSV Export --- */
  const exportCSV = () => {
    const headers = ['Name', 'Category', 'Version', 'Status', 'Owner', 'Server', 'Progress', 'Readiness', 'Doc %', 'Testing %', 'Last Updated', 'Release Target', 'Description'];
    const rows = filtered.map(p => [
      p.name, p.category, p.version, p.status, p.owner, p.server,
      String(p.progress), p.readiness, String(p.docCompletion), String(p.testingPct),
      p.lastUpdated, p.releaseTarget, `"${p.description.replace(/"/g, '""')}"`,
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `products-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setSearch('');
    setFilterStatus('all');
    setFilterCategory('All');
    setFilterReadiness('All');
  };

  return (
    <div className="h-full overflow-y-auto font-sans">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-5">
        <div className="flex flex-wrap items-center justify-between gap-4 max-w-[1800px] mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Product Master</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{products.length} products &middot; {filtered.length} visible</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <FiDownload className="w-4 h-4" /> Export CSV
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
            >
              <FiPlus className="w-4 h-4" /> Add Product
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-6 py-6 space-y-4">

        {/* --- Filter bar --- */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
              />
            </div>

            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              {statuses.map(s => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>

            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
              {readinessLevels.map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setFilterReadiness(lvl)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    filterReadiness === lvl
                      ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  {lvl === 'All' ? 'All RAG' : (
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${lvl === 'Green' ? 'bg-emerald-500' : lvl === 'Amber' ? 'bg-amber-500' : 'bg-red-500'}`} />
                      {lvl}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <button onClick={clearFilters} className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1">
              <FiX className="w-3.5 h-3.5" /> Clear
            </button>
          </div>

          {/* Bulk actions */}
          {selected.size > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center gap-3">
              <span className="text-sm text-slate-500 dark:text-slate-400">{selected.size} selected</span>
              <span className="text-xs text-slate-300 dark:text-slate-600">|</span>
              <select
                onChange={e => { if (e.target.value) { bulkUpdate('status', e.target.value); e.target.value = ''; } }}
                className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none"
                defaultValue=""
              >
                <option value="" disabled>Update Status</option>
                <option value="online">Online</option>
                <option value="degraded">Degraded</option>
                <option value="offline">Offline</option>
              </select>
              <select
                onChange={e => { if (e.target.value) { bulkUpdate('readiness', e.target.value); e.target.value = ''; } }}
                className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none"
                defaultValue=""
              >
                <option value="" disabled>Update Readiness</option>
                <option value="Green">Green</option>
                <option value="Amber">Amber</option>
                <option value="Red">Red</option>
              </select>
            </div>
          )}
        </div>

        {/* --- Table --- */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <th className="px-4 py-3 text-left w-10">
                    <button onClick={toggleAll} className="text-slate-400 hover:text-blue-500 transition-colors">
                      {selected.size === filtered.length && filtered.length > 0 ? <FiCheckSquare className="w-4 h-4 text-blue-500" /> : <FiSquare className="w-4 h-4" />}
                    </button>
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Version</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Owner</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Server</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Progress</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">RAG</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Doc %</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Test %</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Last Updated</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Release Target</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={14} className="px-4 py-16 text-center text-slate-400 dark:text-slate-500">
                      <FiFilter className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No products match your filters.</p>
                      <button onClick={clearFilters} className="text-blue-500 text-sm mt-1 hover:underline">Clear filters</button>
                    </td>
                  </tr>
                ) : (
                  filtered.map(p => (
                    <tr
                      key={p.id}
                      className={`border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${detailProduct?.id === p.id ? 'bg-blue-50/50 dark:bg-blue-950/30' : ''}`}
                      onClick={() => setDetailProduct(p)}
                    >
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <button onClick={() => toggleSelect(p.id)} className="text-slate-400 hover:text-blue-500 transition-colors">
                          {selected.has(p.id) ? <FiCheckSquare className="w-4 h-4 text-blue-500" /> : <FiSquare className="w-4 h-4" />}
                        </button>
                      </td>
                      <td className="px-3 py-3 font-medium text-slate-800 dark:text-white">
                        <EditableCell value={p.name} onSave={v => updateProduct(p.id, 'name', v)} />
                      </td>
                      <td className="px-3 py-3 text-slate-600 dark:text-slate-400">
                        <EditableCell value={p.category} onSave={v => updateProduct(p.id, 'category', v)} type="select" options={categories} />
                      </td>
                      <td className="px-3 py-3 text-slate-600 dark:text-slate-400 font-mono text-xs">
                        <EditableCell value={p.version} onSave={v => updateProduct(p.id, 'version', v)} />
                      </td>
                      <td className="px-3 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[p.status]}`}>
                          <EditableCell value={p.status} onSave={v => updateProduct(p.id, 'status', v)} type="select" options={['online', 'degraded', 'offline']} />
                        </span>
                      </td>
                      <td className="px-3 py-3 text-slate-600 dark:text-slate-400">
                        <EditableCell value={p.owner} onSave={v => updateProduct(p.id, 'owner', v)} />
                      </td>
                      <td className="px-3 py-3 text-slate-600 dark:text-slate-400">
                        <EditableCell value={p.server} onSave={v => updateProduct(p.id, 'server', v)} />
                      </td>
                      <td className="px-3 py-3 min-w-[100px]">
                        <div className="flex items-center gap-2">
                          <div className="flex-1"><ProgressBar value={p.progress} color={p.progress >= 90 ? '#10B981' : p.progress >= 70 ? '#F59E0B' : '#EF4444'} /></div>
                          <span className="text-xs text-slate-500 dark:text-slate-400 w-8 text-right">{p.progress}%</span>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2.5 h-2.5 rounded-full ${readinessDot[p.readiness]}`} />
                          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${readinessBadge[p.readiness]}`}>{p.readiness}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-slate-600 dark:text-slate-400 text-center">{p.docCompletion}%</td>
                      <td className="px-3 py-3 text-slate-600 dark:text-slate-400 text-center">{p.testingPct}%</td>
                      <td className="px-3 py-3 text-slate-500 dark:text-slate-400 text-xs">
                        <EditableCell value={p.lastUpdated} onSave={v => updateProduct(p.id, 'lastUpdated', v)} type="date" />
                      </td>
                      <td className="px-3 py-3 text-slate-500 dark:text-slate-400 text-xs">
                        <EditableCell value={p.releaseTarget} onSave={v => updateProduct(p.id, 'releaseTarget', v)} type="date" />
                      </td>
                      <td className="px-3 py-3 text-right" onClick={e => e.stopPropagation()}>
                        <button onClick={() => { if (window.confirm(`Delete ${p.name}?`)) deleteProduct(p.id); }} className="text-slate-300 dark:text-slate-600 hover:text-red-500 transition-colors p-1">
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 text-xs text-slate-500 dark:text-slate-400">
            Showing {filtered.length} of {products.length} products
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  DETAIL PANEL (slideover)                                    */}
      {/* ============================================================ */}
      {detailProduct && (
        <div className="fixed inset-0 z-40 flex">
          <div className="flex-1 bg-black/20 dark:bg-black/50" onClick={() => setDetailProduct(null)} />
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{detailProduct.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{detailProduct.category} &middot; v{detailProduct.version}</p>
              </div>
              <button onClick={() => setDetailProduct(null)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <p className="text-sm text-slate-600 dark:text-slate-300">{detailProduct.description}</p>

              {/* Key metrics */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Status', value: detailProduct.status, cls: statusColors[detailProduct.status] },
                  { label: 'Readiness', value: detailProduct.readiness, cls: readinessBadge[detailProduct.readiness] },
                  { label: 'Progress', value: `${detailProduct.progress}%`, cls: detailProduct.progress >= 90 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : detailProduct.progress >= 70 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
                  { label: 'Doc', value: `${detailProduct.docCompletion}%`, cls: detailProduct.docCompletion >= 90 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' },
                ].map(m => (
                  <div key={m.label} className="text-center">
                    <div className={`text-xs font-semibold px-2 py-1 rounded-lg ${m.cls}`}>{m.value}</div>
                    <p className="text-[10px] text-slate-400 mt-1">{m.label}</p>
                  </div>
                ))}
              </div>

              {/* Detail fields */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: <FiUser className="w-3.5 h-3.5" />, label: 'Owner', value: detailProduct.owner },
                  { icon: <FiServer className="w-3.5 h-3.5" />, label: 'Server', value: detailProduct.server },
                  { icon: <FiCalendar className="w-3.5 h-3.5" />, label: 'Last Updated', value: detailProduct.lastUpdated },
                  { icon: <FiCalendar className="w-3.5 h-3.5" />, label: 'Release Target', value: detailProduct.releaseTarget },
                  { icon: <FiBarChart2 className="w-3.5 h-3.5" />, label: 'Testing', value: `${detailProduct.testingPct}% complete` },
                  { icon: <FiFileText className="w-3.5 h-3.5" />, label: 'Documentation', value: `${detailProduct.docCompletion}% complete` },
                ].map(f => (
                  <div key={f.label} className="flex items-start gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <span className="text-slate-400 mt-0.5 shrink-0">{f.icon}</span>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase">{f.label}</p>
                      <p className="text-sm text-slate-700 dark:text-slate-200 font-medium">{f.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Features */}
              <div>
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                  <FiTag className="w-4 h-4 text-blue-500" /> Features
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {detailProduct.features.map((f, i) => (
                    <span key={i} className="px-2.5 py-1 text-xs rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-medium">{f}</span>
                  ))}
                </div>
              </div>

              {/* Dependencies */}
              <div>
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                  <FiAlertCircle className="w-4 h-4 text-amber-500" /> Dependencies
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {detailProduct.dependencies.length === 0
                    ? <span className="text-xs text-slate-400">None</span>
                    : detailProduct.dependencies.map((d, i) => (
                      <span key={i} className="px-2.5 py-1 text-xs rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 font-medium">{d}</span>
                    ))}
                </div>
              </div>

              {/* Progress bars */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1"><span className="text-slate-500">Overall Progress</span><span className="text-slate-600 dark:text-slate-400 font-medium">{detailProduct.progress}%</span></div>
                  <ProgressBar value={detailProduct.progress} color={detailProduct.progress >= 90 ? '#10B981' : detailProduct.progress >= 70 ? '#F59E0B' : '#EF4444'} />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1"><span className="text-slate-500">Documentation</span><span className="text-slate-600 dark:text-slate-400 font-medium">{detailProduct.docCompletion}%</span></div>
                  <ProgressBar value={detailProduct.docCompletion} color="#2563EB" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1"><span className="text-slate-500">Testing</span><span className="text-slate-600 dark:text-slate-400 font-medium">{detailProduct.testingPct}%</span></div>
                  <ProgressBar value={detailProduct.testingPct} color="#8B5CF6" />
                </div>
              </div>

              <button
                onClick={() => deleteProduct(detailProduct.id)}
                className="w-full py-2.5 text-sm font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex items-center justify-center gap-2"
              >
                <FiTrash2 className="w-4 h-4" /> Delete Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  ADD PRODUCT MODAL                                           */}
      {/* ============================================================ */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 dark:bg-black/60" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add New Product</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Name *</label>
                  <input type="text" value={newProduct.name} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Category</label>
                  <select value={newProduct.category} onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Version</label>
                  <input type="text" value={newProduct.version} onChange={e => setNewProduct(p => ({ ...p, version: e.target.value }))} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Status</label>
                  <select value={newProduct.status} onChange={e => setNewProduct(p => ({ ...p, status: e.target.value as Product['status'] }))} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30">
                    <option value="online">Online</option>
                    <option value="degraded">Degraded</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Owner *</label>
                  <input type="text" value={newProduct.owner} onChange={e => setNewProduct(p => ({ ...p, owner: e.target.value }))} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Server</label>
                  <input type="text" value={newProduct.server} onChange={e => setNewProduct(p => ({ ...p, server: e.target.value }))} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30" placeholder="e.g. ALGO IQ 6" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Progress (%)</label>
                  <input type="number" min={0} max={100} value={newProduct.progress} onChange={e => setNewProduct(p => ({ ...p, progress: Number(e.target.value) }))} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Readiness</label>
                  <select value={newProduct.readiness} onChange={e => setNewProduct(p => ({ ...p, readiness: e.target.value as ReadinessLevel }))} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30">
                    <option value="Green">Green</option>
                    <option value="Amber">Amber</option>
                    <option value="Red">Red</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Doc Completion (%)</label>
                  <input type="number" min={0} max={100} value={newProduct.docCompletion} onChange={e => setNewProduct(p => ({ ...p, docCompletion: Number(e.target.value) }))} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Testing (%)</label>
                  <input type="number" min={0} max={100} value={newProduct.testingPct} onChange={e => setNewProduct(p => ({ ...p, testingPct: Number(e.target.value) }))} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Last Updated</label>
                  <input type="date" value={newProduct.lastUpdated} onChange={e => setNewProduct(p => ({ ...p, lastUpdated: e.target.value }))} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Release Target</label>
                  <input type="date" value={newProduct.releaseTarget} onChange={e => setNewProduct(p => ({ ...p, releaseTarget: e.target.value }))} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
                />
              </div>

              {/* Features input */}
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Features</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeatureInput}
                    onChange={e => setNewFeatureInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && newFeatureInput.trim()) { setNewProduct(p => ({ ...p, features: [...(p.features || []), newFeatureInput.trim()] })); setNewFeatureInput(''); e.preventDefault(); } }}
                    placeholder="Type feature and press Enter"
                    className="flex-1 px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(newProduct.features || []).map((f, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-medium">
                      {f}
                      <button onClick={() => setNewProduct(p => ({ ...p, features: (p.features || []).filter((_, j) => j !== i) }))} className="hover:text-red-500"><FiX className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Dependencies input */}
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Dependencies</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newDepInput}
                    onChange={e => setNewDepInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && newDepInput.trim()) { setNewProduct(p => ({ ...p, dependencies: [...(p.dependencies || []), newDepInput.trim()] })); setNewDepInput(''); e.preventDefault(); } }}
                    placeholder="Type dependency name and press Enter"
                    className="flex-1 px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(newProduct.dependencies || []).map((d, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 font-medium">
                      {d}
                      <button onClick={() => setNewProduct(p => ({ ...p, dependencies: (p.dependencies || []).filter((_, j) => j !== i) }))} className="hover:text-red-500"><FiX className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  Cancel
                </button>
                <button onClick={addProduct} className="flex-1 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm">
                  Add Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
