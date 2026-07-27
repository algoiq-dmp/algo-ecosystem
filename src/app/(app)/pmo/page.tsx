'use client';

import { useState, useMemo } from 'react';
import {
  Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import {
  FiTrendingUp, FiFileText, FiZap, FiAlertTriangle,
  FiClock, FiCheckCircle, FiCalendar, FiActivity,
} from 'react-icons/fi';

/* ------------------------------------------------------------------ */
/*  Data types                                                        */
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

interface Release {
  id: string;
  productName: string;
  version: string;
  date: string;
  status: 'Deployed' | 'In Progress' | 'Planned';
  risk: 'Low' | 'Medium' | 'High';
}

interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  totalPoints: number;
  completedPoints: number;
}

interface Task {
  id: string;
  title: string;
  product: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  overdue: boolean;
}

/* ------------------------------------------------------------------ */
/*  Seed data                                                         */
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

const defaultReleases: Release[] = [
  { id: 'r1', productName: 'Vega', version: '6.4.0', date: '2026-07-28', status: 'In Progress', risk: 'Medium' },
  { id: 'r2', productName: 'TalkDelta', version: '5.2.0', date: '2026-08-05', status: 'Planned', risk: 'Low' },
  { id: 'r3', productName: 'SpreadWatch', version: '3.0.0', date: '2026-08-12', status: 'Planned', risk: 'High' },
  { id: 'r4', productName: 'Ganesh', version: '3.3.0', date: '2026-07-25', status: 'In Progress', risk: 'Low' },
  { id: 'r5', productName: 'Kavach', version: '4.0.0', date: '2026-07-22', status: 'Deployed', risk: 'Low' },
  { id: 'r6', productName: 'TalkOffice', version: '4.1.0', date: '2026-08-01', status: 'Planned', risk: 'Medium' },
  { id: 'r7', productName: 'Suraksha', version: '2.1.0', date: '2026-07-20', status: 'Deployed', risk: 'Low' },
  { id: 'r8', productName: 'TalkDelta AI', version: '2.0.0', date: '2026-09-01', status: 'Planned', risk: 'High' },
];

const defaultSprints: Sprint[] = [
  { id: 's1', name: 'Sprint 24 — Q3 Execution Pipeline', startDate: '2026-07-14', endDate: '2026-07-28', totalPoints: 120, completedPoints: 82 },
  { id: 's2', name: 'Sprint 25 — Risk & Compliance', startDate: '2026-07-28', endDate: '2026-08-11', totalPoints: 95, completedPoints: 0 },
];

const defaultTasks: Task[] = [
  { id: 't1', title: 'Fix SpreadWatch data pipeline failure', product: 'SpreadWatch', priority: 'High', dueDate: '2026-07-25', overdue: false },
  { id: 't2', title: 'Complete TalkDelta AI model retraining', product: 'TalkDelta AI', priority: 'High', dueDate: '2026-07-22', overdue: true },
  { id: 't3', title: 'Update Vega FIX protocol to 5.0 SP2', product: 'Vega', priority: 'Medium', dueDate: '2026-07-28', overdue: false },
  { id: 't4', title: 'Parikshak regression suite certification', product: 'Parikshak', priority: 'High', dueDate: '2026-07-21', overdue: true },
  { id: 't5', title: 'DXCC alerting configuration review', product: 'DXCC', priority: 'Medium', dueDate: '2026-07-26', overdue: false },
  { id: 't6', title: 'Documentation update for Rakshak v2.3', product: 'Rakshak', priority: 'Low', dueDate: '2026-08-01', overdue: false },
  { id: 't7', title: 'Kuber Alpha strategy allocation testing', product: 'Kuber Alpha', priority: 'High', dueDate: '2026-07-23', overdue: true },
];

const riskColors: Record<string, string> = {
  Low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  High: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

const releaseStatusColors: Record<string, string> = {
  Deployed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'In Progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Planned: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
};

const priorityColors: Record<string, string> = {
  High: 'text-red-600 dark:text-red-400',
  Medium: 'text-amber-600 dark:text-amber-400',
  Low: 'text-slate-500 dark:text-slate-400',
};

/* ------------------------------------------------------------------ */
/*  Donut chart – custom SVG (no recharts needed for donut)           */
/* ------------------------------------------------------------------ */
function DonutChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = 80;
  const cx = 100;
  const cy = 100;
  const strokeW = 32;
  const circumference = 2 * Math.PI * r;

  const slices = data.reduce<{ name: string; value: number; color: string; dash: number; dashOffset: number }[]>((acc, d) => {
    const pct = d.value / total;
    const dash = pct * circumference;
    const prevOffset = acc.length > 0 ? acc[acc.length - 1].dashOffset + acc[acc.length - 1].dash : 0;
    acc.push({ ...d, dash, dashOffset: -prevOffset });
    return acc;
  }, []);

  return (
    <svg viewBox="0 0 200 200" className="w-full max-w-[200px] h-auto mx-auto">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={strokeW} className="dark:stroke-slate-700" />
      {slices.map((s) => (
        <circle
          key={s.name}
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={s.color}
          strokeWidth={strokeW}
          strokeDasharray={`${s.dash} ${circumference - s.dash}`}
          strokeDashoffset={s.dashOffset}
          transform={`rotate(-90 ${cx} ${cy})`}
          className="transition-all duration-700"
        />
      ))}
      <text x={cx} y={cy - 8} textAnchor="middle" className="fill-slate-800 dark:fill-slate-100 text-2xl font-bold" fontSize="28">{total}</text>
      <text x={cx} y={cy + 16} textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-xs" fontSize="12">Products</text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Simple progress bar                                               */
/* ------------------------------------------------------------------ */
function ProgressBar({ value, max = 100, color = '#2563EB', height = 8 }: { value: number; max?: number; color?: string; height?: number }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full" style={{ height }}>
      <div className="rounded-full transition-all duration-500" style={{ width: `${pct}%`, height, backgroundColor: color }} />
    </div>
  );
}

/* ================================================================== */
/*  PAGE COMPONENT                                                    */
/* ================================================================== */
export default function PMODashboard() {
  const [products] = useState<Product[]>(defaultProducts);
  const [releases] = useState<Release[]>(defaultReleases);
  const [sprints] = useState<Sprint[]>(defaultSprints);
  const [tasks] = useState<Task[]>(defaultTasks);

  const stats = useMemo(() => {
    const total = products.length;
    const overallReadiness = products.reduce((s, p) => {
      if (p.readiness === 'Green') return s + 100;
      if (p.readiness === 'Amber') return s + 60;
      return s + 20;
    }, 0) / total;
    const avgDoc = products.reduce((s, p) => s + p.docCompletion, 0) / total;
    const activeReleases = releases.filter(r => r.status !== 'Deployed').length;
    return { total, overallReadiness: Math.round(overallReadiness), avgDoc: Math.round(avgDoc), activeReleases };
  }, [products, releases]);

  const readinessChart = useMemo(() => {
    const green = products.filter(p => p.readiness === 'Green').length;
    const amber = products.filter(p => p.readiness === 'Amber').length;
    const red = products.filter(p => p.readiness === 'Red').length;
    return [
      { name: 'Green', value: green, color: '#10B981' },
      { name: 'Amber', value: amber, color: '#F59E0B' },
      { name: 'Red', value: red, color: '#EF4444' },
    ];
  }, [products]);

  const categoryProgress = useMemo(() => {
    const cats = ['Analytics', 'Execution', 'Strategy', 'Infrastructure', 'Operations', 'Security'] as const;
    return cats.map(cat => {
      const items = products.filter(p => p.category === cat || (cat === 'Analytics' && p.category === 'analytics'));
      const all = [
        ...items,
        ...products.filter(p => p.category.toLowerCase() === cat.toLowerCase()
          && !cats.includes(p.category as typeof cats[number])),
      ];
      const unique = Array.from(new Map(all.map(i => [i.id, i])).values());
      const avg = unique.length ? unique.reduce((s, p) => s + p.progress, 0) / unique.length : 0;
      return { name: cat, progress: Math.round(avg), count: unique.length };
    });
  }, [products]);

  const docChartData = useMemo(() => {
    const types = ['API Docs', 'User Guide', 'Architecture', 'Runbook', 'Onboarding', 'Security'];
    const vals = [75, 82, 91, 68, 59, 87];
    return types.map((t, i) => ({ name: t, completion: vals[i] }));
  }, []);

  const criticalRisks = useMemo(() => products.filter(p => p.readiness === 'Red'), [products]);
  const recentReleases = useMemo(() => releases.slice(0, 5), [releases]);
  const currentSprint = sprints[0];
  const overdueTasks = useMemo(() => tasks.filter(t => t.overdue).slice(0, 5), [tasks]);

  return (
    <div className="h-full overflow-y-auto font-sans">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-5">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Executive PMO Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Algo IQ Ecosystem — Program Management Office</p>
      </div>

      <div className="px-6 py-6 space-y-6 max-w-[1600px] mx-auto">

        {/* --- Stat cards --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {([
            { label: 'Total Products', value: stats.total, icon: <FiZap className="w-5 h-5" />, accent: '#2563EB' },
            { label: 'Overall Readiness %', value: `${stats.overallReadiness}%`, icon: <FiTrendingUp className="w-5 h-5" />, accent: '#10B981' },
            { label: 'Documentation Completion', value: `${stats.avgDoc}%`, icon: <FiFileText className="w-5 h-5" />, accent: '#F59E0B' },
            { label: 'Active Releases', value: stats.activeReleases, icon: <FiActivity className="w-5 h-5" />, accent: '#8B5CF6' },
          ] as const).map((card) => (
            <div
              key={card.label}
              className="relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-white/30 dark:border-slate-800/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.label}</span>
                <span className="p-2 rounded-lg" style={{ backgroundColor: `${card.accent}15`, color: card.accent }}>{card.icon}</span>
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mt-3" style={{ fontVariantNumeric: 'tabular-nums' }}>{card.value}</div>
            </div>
          ))}
        </div>

        {/* --- Mid row: Readiness pie + category progress --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Readiness Overview */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Readiness Overview</h2>
            <div className="flex items-center gap-6">
              <div className="w-48 shrink-0">
                <DonutChart data={readinessChart} />
              </div>
              <div className="space-y-3 flex-1">
                {readinessChart.map(d => (
                  <div key={d.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-sm text-slate-600 dark:text-slate-300">{d.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-800 dark:text-white">{d.value} ({Math.round((d.value / readinessChart.reduce((s,x)=>s+x.value,0) || 1) * 100)}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Category Progress Bars */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Category Progress</h2>
            <div className="space-y-4">
              {categoryProgress.map(cat => (
                <div key={cat.name}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-slate-600 dark:text-slate-300">{cat.name}</span>
                    <span className="text-slate-500 dark:text-slate-400">{cat.progress}% <span className="text-xs">({cat.count} products)</span></span>
                  </div>
                  <ProgressBar value={cat.progress} color={cat.progress >= 90 ? '#10B981' : cat.progress >= 70 ? '#F59E0B' : '#EF4444'} height={10} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- Recent Releases table --- */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Recent Releases</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-left">
                  <th className="pb-3 text-slate-500 dark:text-slate-400 font-medium">Product</th>
                  <th className="pb-3 text-slate-500 dark:text-slate-400 font-medium">Version</th>
                  <th className="pb-3 text-slate-500 dark:text-slate-400 font-medium">Date</th>
                  <th className="pb-3 text-slate-500 dark:text-slate-400 font-medium">Status</th>
                  <th className="pb-3 text-slate-500 dark:text-slate-400 font-medium">Risk</th>
                </tr>
              </thead>
              <tbody>
                {recentReleases.map(r => (
                  <tr key={r.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <td className="py-3 font-medium text-slate-800 dark:text-white">{r.productName}</td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">v{r.version}</td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">{new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${releaseStatusColors[r.status]}`}>{r.status}</span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${riskColors[r.risk]}`}>{r.risk}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- Sprint + Doc Completion --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Sprint */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Active Sprint</h2>
            {currentSprint ? (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white">{currentSprint.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {new Date(currentSprint.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} &mdash; {new Date(currentSprint.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{currentSprint.completedPoints} / {currentSprint.totalPoints} SP</span>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <span>{Math.round((currentSprint.completedPoints / currentSprint.totalPoints) * 100)}% complete</span>
                    <span>{currentSprint.totalPoints - currentSprint.completedPoints} SP remaining</span>
                  </div>
                  <ProgressBar value={currentSprint.completedPoints} max={currentSprint.totalPoints} color="#2563EB" height={12} />
                </div>
              </div>
            ) : <p className="text-slate-400 text-sm">No active sprint.</p>}

            {sprints.length > 1 && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Upcoming Sprint</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">{sprints[1].name} &mdash; {sprints[1].totalPoints} SP planned</p>
              </div>
            )}
          </div>

          {/* Documentation Completion Bar Chart */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Documentation Completion</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={docChartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} className="dark:fill-slate-400" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} className="dark:fill-slate-400" />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Bar dataKey="completion" radius={[4, 4, 0, 0]}>
                  {docChartData.map((_, i) => (
                    <Cell key={i} fill={['#2563EB', '#7C3AED', '#10B981', '#F59E0B', '#EF4444', '#EC4899'][i % 6]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- Critical Risks + Pending Tasks + Upcoming Releases --- */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Critical Risks */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-red-200 dark:border-red-900/50 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <FiAlertTriangle className="text-red-500 w-5 h-5" />
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Critical Risks</h2>
              <span className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-xs px-2 py-0.5 rounded-full">{criticalRisks.length}</span>
            </div>
            {criticalRisks.length === 0 ? (
              <p className="text-sm text-slate-400">No critical risks.</p>
            ) : (
              <div className="space-y-3">
                {criticalRisks.map(p => (
                  <div key={p.id} className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-100 dark:border-red-900/30">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">{p.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{p.description}</p>
                      <div className="flex gap-2 mt-1.5">
                        <span className="text-xs text-red-600 dark:text-red-400 font-medium">Progress: {p.progress}%</span>
                        <span className="text-xs text-slate-400">Testing: {p.testingPct}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Tasks */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <FiClock className="text-amber-500 w-5 h-5" />
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Pending Tasks</h2>
              <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs px-2 py-0.5 rounded-full">{overdueTasks.length}</span>
            </div>
            <div className="space-y-2">
              {tasks.map(t => (
                <div key={t.id} className={`flex items-center gap-3 p-3 rounded-xl border ${t.overdue ? 'border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20' : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50'}`}>
                  {t.overdue ? <FiAlertTriangle className="text-red-500 w-4 h-4 shrink-0" /> : <FiCheckCircle className="text-slate-300 w-4 h-4 shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 dark:text-slate-200 truncate">{t.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{t.product} &middot; Due {new Date(t.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  </div>
                  <span className={`text-xs font-semibold ${priorityColors[t.priority]}`}>{t.priority}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Releases Timeline */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <FiCalendar className="text-blue-500 w-5 h-5" />
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Upcoming Releases</h2>
            </div>
            <div className="space-y-0">
              {releases.filter(r => r.status !== 'Deployed').sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((r, i, arr) => (
                <div key={r.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full border-2 ${r.status === 'In Progress' ? 'bg-blue-500 border-blue-500' : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600'}`} />
                    {i < arr.length - 1 && <div className="w-0.5 flex-1 bg-slate-200 dark:bg-slate-700 my-0.5" />}
                  </div>
                  <div className="pb-4 flex-1">
                    <p className="text-sm font-medium text-slate-800 dark:text-white">{r.productName} <span className="text-slate-400 font-normal">v{r.version}</span></p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      <span className={`ml-2 px-1.5 py-0.5 rounded text-xs font-medium ${riskColors[r.risk]}`}>{r.risk} risk</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
