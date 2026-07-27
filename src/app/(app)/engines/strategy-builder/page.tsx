'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowRight, FiClock, FiRefreshCw, FiZap, FiInfo,
  FiCheck, FiAlertCircle, FiBarChart2, FiTrendingUp, FiTarget,
  FiPackage, FiFile, FiFileText, FiCpu, FiHardDrive,
  FiLayers, FiGrid, FiGitBranch, FiBox, FiCodesandbox,
  FiToggleRight, FiShuffle, FiActivity, FiTool, FiSettings,
  FiLayout, FiPlay, FiSend, FiShield, FiChevronDown, FiChevronUp,
} from 'react-icons/fi';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const creationSteps = [
  { icon: FiBarChart2, label: 'Market Data', desc: 'Real-time & historical OHLC feeds from Ganesh and MQ.', color: '#EFF6FF', accent: '#2563EB' },
  { icon: FiActivity, label: 'Indicators', desc: 'RSI, MACD, Bollinger, SMA, EMA, custom indicators.', color: '#F0FDF4', accent: '#16A34A' },
  { icon: FiToggleRight, label: 'Conditions', desc: 'Entry/exit logic with AND/OR/NOT boolean operators.', color: '#FEF3C7', accent: '#D97706' },
  { icon: FiShuffle, label: 'Decision Logic', desc: 'Multi-condition evaluation with priority and precedence.', color: '#FCE7F3', accent: '#DB2777' },
  { icon: FiShield, label: 'Risk Rules', desc: 'Stop-loss, trailing stop, max drawdown, position limits.', color: '#FEF2F2', accent: '#DC2626' },
  { icon: FiSettings, label: 'Position Sizing', desc: 'Kelly, fixed fractional, volatility-based, custom sizing.', color: '#F3E8FF', accent: '#7C3AED' },
  { icon: FiZap, label: 'Signal Generation', desc: 'Final BUY/SELL signal with confidence score & metadata.', color: '#FFF7ED', accent: '#EA580C' },
  { icon: FiSend, label: 'Vega Engine', desc: 'Signal emitted to Vega order execution engine.', color: '#EFF6FF', accent: '#2563EB' },
  { icon: FiPlay, label: 'Broker API', desc: 'Order placed on exchange via broker gateway.', color: '#F0FDF4', accent: '#16A34A' },
];

const lifecyclePhases = [
  { icon: FiLayout, title: 'Strategy Builder', desc: 'Visual design & parameter configuration.', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { icon: FiCheck, title: 'Parikshak', desc: 'Comprehensive strategy testing & validation.', color: 'bg-green-50 border-green-200 text-green-700' },
  { icon: FiPlay, title: 'Simulator', desc: 'Historical backtesting with full analytics.', color: 'bg-amber-50 border-amber-200 text-amber-700' },
  { icon: FiShield, title: 'DXCC', desc: 'Compliance review & strategy approval.', color: 'bg-purple-50 border-purple-200 text-purple-700' },
  { icon: FiSend, title: 'Kuber Alpha', desc: 'Live deployment & production execution.', color: 'bg-red-50 border-red-200 text-red-700' },
];

const modules = [
  { icon: FiLayout, title: 'Rule Builder', desc: 'Drag-and-drop interface for building entry, exit, and risk rules. Supports nested conditions, comparisons, and technical indicator integration.' },
  { icon: FiToggleRight, title: 'Condition Editor', desc: 'Visual boolean editor for multi-condition logic. AND/OR/XOR gates, nested grouping, real-time truth table preview.' },
  { icon: FiShield, title: 'Risk Configurator', desc: 'Configure stop-loss, trailing stop, max drawdown, exposure limits, and circuit breaker thresholds per strategy.' },
  { icon: FiSettings, title: 'Position Sizing', desc: 'Flexible position sizing models: fixed fractional, Kelly criterion, volatility-adjusted, and custom formula-based sizing.' },
  { icon: FiLayers, title: 'Portfolio Allocator', desc: 'Multi-strategy allocation with weight configuration, correlation awareness, and capital distribution rules.' },
  { icon: FiActivity, title: 'Backtest Bridge', desc: 'Seamless connector to Simulator for historical performance evaluation. Package strategy with parameter ranges.' },
  { icon: FiPackage, title: 'Strategy Packager', desc: 'Export strategy as JSON package with metadata, parameter config, and testing instructions for Parikshak.' },
  { icon: FiGitBranch, title: 'Version Manager', desc: 'Full version history with diff comparison, rollback capability, and change annotations.' },
];

const dependencies = [
  { name: 'Parikshak', role: 'Testing & validation', icon: FiCheck, gap: 'No' },
  { name: 'Simulator', role: 'Backtesting engine', icon: FiPlay, gap: 'No' },
  { name: 'DXCC', role: 'Compliance approval', icon: FiShield, gap: 'No' },
  { name: 'Kuber Alpha', role: 'Deployment target', icon: FiSend, gap: 'No' },
  { name: 'Ganesh', role: 'OHLC data provider', icon: FiBarChart2, gap: 'No' },
  { name: 'MQ', role: 'Market data stream', icon: FiActivity, gap: 'No' },
];

const responsibilities = [
  'Modular Strategy Creation', 'Drag-and-Drop Builder', 'Entry Logic',
  'Exit Logic', 'Risk Management', 'Position Sizing',
  'Portfolio Allocation', 'Parameter Configuration', 'Strategy Versioning',
  'JSON Generation', 'Strategy Packaging', 'Parikshak Integration',
];

export default function StrategyBuilderPage() {
  const [aiTab, setAiTab] = useState<string | null>(null);
  const [openModule, setOpenModule] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ==================== HERO ==================== */}
      <section className="relative bg-white border-b border-gray-100 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6">
              <FiCodesandbox className="text-base" />
              Strategy Development Engine
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
              Strategy Builder
            </h1>
            <p className="text-xl md:text-2xl text-blue-600 font-medium mb-6">
              Build. Test. Simulate. Deploy. The complete strategy development lifecycle.
            </p>
            <p className="text-lg text-gray-500 max-w-3xl mx-auto mb-8">
              A visual, modular, drag-and-drop platform for designing algorithmic trading strategies.
              From idea to live deployment — strategy creation, testing, backtesting, and packaging.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" /> Online</span>
              <span>v4.1.0</span>
              <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs font-medium">Production</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== ECOSYSTEM POSITION ==================== */}
      <section className="py-20 px-6 bg-[#F8FAFC]">
        <motion.div className="max-w-5xl mx-auto" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Ecosystem Position</h2>
          <p className="text-gray-500 text-center mb-12">Strategy Builder is the starting point — every strategy flows through this pipeline.</p>
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm overflow-x-auto">
            <svg viewBox="0 0 800 200" className="w-full min-w-[700px]">
              <defs>
                <marker id="arrPipe" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                  <path d="M0,0 L8,4 L0,8 Z" fill="#2563EB" />
                </marker>
              </defs>
              {[
                { x: 30, w: 130, label: 'Strategy\nBuilder', sub: 'Design & Build', fill: '#EFF6FF', stroke: '#2563EB', text: '#1E40AF' },
                { x: 190, w: 130, label: 'Parikshak', sub: 'Test & Validate', fill: '#F0FDF4', stroke: '#16A34A', text: '#166534' },
                { x: 350, w: 130, label: 'Simulator', sub: 'Backtest & Analyze', fill: '#FEF3C7', stroke: '#D97706', text: '#92400E' },
                { x: 510, w: 130, label: 'DXCC', sub: 'Approve & Comply', fill: '#F3E8FF', stroke: '#7C3AED', text: '#5B21B6' },
                { x: 670, w: 110, label: 'Kuber Alpha', sub: 'Deploy & Execute', fill: '#FEF2F2', stroke: '#DC2626', text: '#991B1B' },
              ].map((box, i) => (
                <g key={i}>
                  <rect x={box.x} y="55" width={box.w} height="90" rx="16" fill={box.fill} stroke={box.stroke} strokeWidth="2" />
                  <text x={box.x + box.w / 2} y={90} textAnchor="middle" fill={box.text} fontSize="14" fontWeight="700">{box.label.split(/\n/)[0]}</text>
                  {box.label.split(/\n/)[1] && <text x={box.x + box.w / 2} y={110} textAnchor="middle" fill={box.text} fontSize="14" fontWeight="700">{box.label.split(/\n/)[1]}</text>}
                  <text x={box.x + box.w / 2} y={132} textAnchor="middle" fill={box.text} fontSize="10" opacity="0.7">{box.sub}</text>
                </g>
              ))}
              {[160, 320, 480, 640].map((x, i) => (
                <line key={i} x1={x} y1="100" x2={x + 30} y2="100" stroke="#2563EB" strokeWidth="2.5" markerEnd="url(#arrPipe)" />
              ))}
              {/* Flow labels */}
              <text x="175" y="45" textAnchor="middle" fill="#64748B" fontSize="9">JSON</text>
              <text x="335" y="45" textAnchor="middle" fill="#64748B" fontSize="9">Test Report</text>
              <text x="495" y="45" textAnchor="middle" fill="#64748B" fontSize="9">Backtest</text>
              <text x="660" y="45" textAnchor="middle" fill="#64748B" fontSize="9">Approval</text>
              <text x="175" y="165" textAnchor="middle" fill="#94A3B8" fontSize="9">Export</text>
              <text x="335" y="165" textAnchor="middle" fill="#94A3B8" fontSize="9">Results</text>
              <text x="495" y="165" textAnchor="middle" fill="#94A3B8" fontSize="9">Report</text>
              <text x="660" y="165" textAnchor="middle" fill="#94A3B8" fontSize="9">Token</text>
            </svg>
          </div>
        </motion.div>
      </section>

      {/* ==================== OVERVIEW CARDS ==================== */}
      <section className="py-20 px-6 bg-white">
        <motion.div className="max-w-7xl mx-auto" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { icon: FiTarget, title: 'Purpose', text: 'Visual, modular platform for designing algorithmic trading strategies from idea to deployable package.' },
              { icon: FiTrendingUp, title: 'Business Importance', text: 'Gateway for all strategies. Every algo must originate here. Centralized control over strategy library.' },
              { icon: FiLayers, title: 'Strategy Lifecycle', text: '5 phases: Build → Test → Simulate → Approve → Deploy. End-to-end governance.' },
              { icon: FiGrid, title: 'Connected Systems', text: 'Parikshak, Simulator, DXCC, Kuber Alpha, Ganesh, MQ. Seamless integrations.' },
              { icon: FiFile, title: 'Output', text: 'Strategy Package JSON — metadata, rules, parameters, test config, deployment manifest.' },
            ].map((c, i) => (
              <motion.div key={i} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.1 } } }} className="bg-[#F8FAFC] border border-gray-200 rounded-2xl p-6 hover:shadow-md hover:border-blue-200 transition-all">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-4"><c.icon className="text-blue-600 text-lg" /></div>
                <h3 className="font-semibold text-gray-900 mb-2">{c.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{c.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ==================== STRATEGY CREATION FLOW ==================== */}
      <section className="py-20 px-6 bg-[#F8FAFC] overflow-hidden">
        <motion.div className="max-w-3xl mx-auto" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Strategy Creation Flow</h2>
          <p className="text-gray-500 text-center mb-12">Nine-stage pipeline — from market data to live brokerage order.</p>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-9 top-0 bottom-0 w-0.5 bg-blue-200" style={{ marginTop: '24px', marginBottom: '24px' }} />
            <div className="space-y-0">
              {creationSteps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-5 py-5 relative"
                >
                  <div
                    className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center flex-shrink-0 relative z-10 shadow-sm border-2"
                    style={{ backgroundColor: step.color, borderColor: step.accent }}
                  >
                    <step.icon style={{ color: step.accent, fontSize: '1.5rem' }} />
                  </div>
                  <div className="pt-3 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">Step {i + 1}</span>
                      <h4 className="font-semibold text-gray-900">{step.label}</h4>
                    </div>
                    <p className="text-sm text-gray-500">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ==================== INTERNAL ARCHITECTURE ==================== */}
      <section className="py-20 px-6 bg-white">
        <motion.div className="max-w-5xl mx-auto" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Internal Architecture</h2>
          <p className="text-gray-500 text-center mb-12">Modular components that together form the strategy design and packaging engine.</p>
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm overflow-x-auto">
            <svg viewBox="0 0 800 240" className="w-full min-w-[700px]">
              <defs>
                <marker id="arrArch" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                  <path d="M0,0 L7,3.5 L0,7 Z" fill="#2563EB" />
                </marker>
              </defs>
              {[
                { x: 15, y: 10, label: 'Rule Builder', color: '#EFF6FF', border: '#93C5FD' },
                { x: 130, y: 70, label: 'Condition Editor', color: '#F0FDF4', border: '#86EFAC' },
                { x: 250, y: 130, label: 'Risk Configurator', color: '#FEF3C7', border: '#FCD34D' },
                { x: 380, y: 160, label: 'Position Sizing Module', color: '#FCE7F3', border: '#F9A8D4' },
                { x: 520, y: 130, label: 'Backtest Connector', color: '#F3E8FF', border: '#C4B5FD' },
                { x: 640, y: 70, label: 'Strategy Packager', color: '#EFF6FF', border: '#93C5FD' },
                { x: 750, y: 10, label: 'Parikshak Exporter', color: '#ECFDF5', border: '#6EE7B7' },
              ].map((box, i) => (
                <g key={i}>
                  <rect x={box.x} y={box.y} width="105" height="50" rx="10" fill={box.color} stroke={box.border} strokeWidth="2" />
                  <text x={box.x + 52.5} y={box.y + 30} textAnchor="middle" fill="#1E293B" fontSize="10" fontWeight="600">{box.label}</text>
                </g>
              ))}
              {/* Curved connectors */}
              <path d="M100,35 Q115,35 115,50 Q115,95 130,95" fill="none" stroke="#2563EB" strokeWidth="1.5" markerEnd="url(#arrArch)" />
              <path d="M215,95 Q235,95 235,110 Q235,155 250,155" fill="none" stroke="#2563EB" strokeWidth="1.5" markerEnd="url(#arrArch)" />
              <path d="M335,155 Q365,155 365,170 Q365,185 380,185" fill="none" stroke="#2563EB" strokeWidth="1.5" markerEnd="url(#arrArch)" />
              <path d="M465,185 Q500,185 500,170 Q500,155 520,155" fill="none" stroke="#2563EB" strokeWidth="1.5" markerEnd="url(#arrArch)" />
              <path d="M605,155 Q635,155 635,110 Q635,95 640,95" fill="none" stroke="#2563EB" strokeWidth="1.5" markerEnd="url(#arrArch)" />
              <path d="M725,95 Q740,95 740,50 Q740,35 750,35" fill="none" stroke="#2563EB" strokeWidth="1.5" markerEnd="url(#arrArch)" />
              {/* Input / Output labels */}
              <text x="67" y="210" textAnchor="middle" fill="#64748B" fontSize="9">User Input</text>
              <text x="802" y="210" textAnchor="middle" fill="#64748B" fontSize="9">Export JSON</text>
            </svg>
          </div>
        </motion.div>
      </section>

      {/* ==================== RESPONSIBILITIES DASHBOARD ==================== */}
      <section className="py-20 px-6 bg-[#F8FAFC]">
        <motion.div className="max-w-5xl mx-auto" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Responsibilities Dashboard</h2>
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {responsibilities.map((r, i) => (
              <motion.div
                key={i}
                variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}
                className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl p-4 hover:border-green-300 transition-colors"
              >
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiCheck className="text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-800">{r}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ==================== INPUTS & OUTPUTS ==================== */}
      <section className="py-20 px-6 bg-white">
        <motion.div className="max-w-6xl mx-auto" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Inputs &amp; Outputs</h2>
          <div className="flex flex-col md:flex-row items-stretch gap-6">
            <motion.div className="flex-1 bg-[#F8FAFC] border border-gray-200 rounded-2xl p-6" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"><FiBarChart2 className="text-blue-600" /></div>
                <h3 className="font-bold text-gray-900 text-lg">Inputs</h3>
              </div>
              <div className="space-y-2">
                {['Market Data (OHLC from Ganesh)', 'Indicator Configuration', 'Risk Rules Parameters', 'Position Sizing Preferences', 'Portfolio Allocation Weights', 'Strategy Metadata & Tags'].map((inp, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{inp}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <div className="flex items-center justify-center text-blue-400 text-3xl">
              <FiArrowRight className="hidden md:block" />
              <FiArrowRight className="block md:hidden rotate-90" />
            </div>
            <motion.div className="flex-1 bg-[#F8FAFC] border border-gray-200 rounded-2xl p-6" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center"><FiPackage className="text-green-600" /></div>
                <h3 className="font-bold text-gray-900 text-lg">Outputs</h3>
              </div>
              <div className="space-y-2">
                {['Strategy Package JSON', 'Strategy Metadata', 'Test Package (Parikshak)', 'Backtest Configuration', 'Deployment Config (Kuber)', 'Version Snapshot'].map((out, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{out}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ==================== STRATEGY LIFECYCLE ==================== */}
      <section className="py-20 px-6 bg-[#F8FAFC]">
        <motion.div className="max-w-7xl mx-auto" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Strategy Lifecycle</h2>
          <p className="text-gray-500 text-center mb-12">Every strategy follows a governed 5-phase lifecycle from creation to live deployment.</p>
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-0 min-w-[900px]">
              {lifecyclePhases.map((phase, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex-1 p-5 border rounded-2xl mx-2 ${phase.color} relative`}
                >
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm">
                    <phase.icon className="text-lg" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold opacity-60">Phase {i + 1}</span>
                  </div>
                  <h4 className="font-bold text-sm mb-1">{phase.title}</h4>
                  <p className="text-xs opacity-80 leading-relaxed">{phase.desc}</p>
                  {i < lifecyclePhases.length - 1 && (
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
                      <FiArrowRight className="text-gray-400 text-lg" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ==================== MODULE EXPLORER ==================== */}
      <section className="py-20 px-6 bg-white">
        <motion.div className="max-w-4xl mx-auto" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Module Explorer</h2>
          <div className="space-y-3">
            {modules.map((mod, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="border border-gray-200 rounded-2xl overflow-hidden bg-white hover:border-blue-200 transition-colors"
              >
                <button
                  onClick={() => setOpenModule(openModule === i ? null : i)}
                  className="w-full flex items-center gap-4 p-5 text-left"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <mod.icon className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{mod.title}</h4>
                  </div>
                  {openModule === i ? (
                    <FiChevronUp className="text-gray-400 flex-shrink-0" />
                  ) : (
                    <FiChevronDown className="text-gray-400 flex-shrink-0" />
                  )}
                </button>
                <AnimatePresence>
                  {openModule === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-0 ml-14">
                        <p className="text-sm text-gray-500 leading-relaxed">{mod.desc}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ==================== DEPENDENCY EXPLORER ==================== */}
      <section className="py-20 px-6 bg-[#F8FAFC]">
        <motion.div className="max-w-4xl mx-auto" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Dependency Explorer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dependencies.map((dep, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:border-blue-200 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <dep.icon className="text-blue-600 text-lg" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{dep.name}</h4>
                    <p className="text-xs text-gray-400">{dep.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-100 rounded-full flex items-center justify-center">
                    <FiCheck className="text-green-600 text-[8px]" />
                  </div>
                  <span className="text-xs text-green-600 font-medium">Integrated</span>
                  <span className="text-xs text-gray-400 ml-auto">Gap: {dep.gap}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ==================== ARCHITECTURE RULES ==================== */}
      <section className="py-20 px-6 bg-white">
        <motion.div className="max-w-4xl mx-auto" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
          <motion.div
            className="bg-blue-50 border-2 border-blue-300 rounded-2xl p-8 text-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <FiShield className="text-blue-600 text-3xl mx-auto mb-4" />
            <p className="text-lg font-bold text-blue-800">
              Every strategy must be created in Strategy Builder &rarr; tested by Parikshak &rarr;
              simulated by Simulator &rarr; approved by DXCC &rarr; deployed to Kuber Alpha
            </p>
            <p className="text-sm text-blue-600 mt-2">
              This strictly governed pipeline ensures every live strategy is properly designed, tested, validated, and approved.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* ==================== AI EXPLANATION ==================== */}
      <section className="py-20 px-6 bg-[#F8FAFC]">
        <motion.div className="max-w-4xl mx-auto text-center" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ask the AI</h2>
          <p className="text-gray-500 mb-8">Get instant answers about Strategy Builder.</p>
          <div className="flex flex-wrap justify-center gap-4">
            {['How do I create a strategy?', 'Explain the lifecycle pipeline', 'What is the strategy JSON format?'].map((q, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAiTab(aiTab === q ? null : q)}
                className="px-6 py-3 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 hover:border-blue-400 hover:text-blue-600 hover:shadow-md transition-all shadow-sm"
              >
                {q}
              </motion.button>
            ))}
          </div>
          <AnimatePresence>
            {aiTab && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 overflow-hidden"
              >
                <div className="bg-white border border-gray-200 rounded-2xl p-6 text-left shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center"><FiZap className="text-white text-sm" /></div>
                    <span className="font-semibold text-gray-900">AI Assistant</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {aiTab === 'How do I create a strategy?' && 'Use the drag-and-drop Rule Builder to define entry conditions (e.g., RSI < 30 AND volume > 1M), exit conditions (e.g., profit > 2% OR stop-loss at 1%), risk rules (max drawdown 5%), and position sizing (2% fixed fractional). Configure indicators like SMA crossover, MACD, or Bollinger Bands. Save as a strategy package. Then export to Parikshak for testing.'}
                    {aiTab === 'Explain the lifecycle pipeline' && 'Phase 1 — Strategy Builder: design and configure your strategy. Phase 2 — Parikshak: the strategy undergoes comprehensive validation testing against defined rules. Phase 3 — Simulator: backtesting against historical data with full analytics (Sharpe, drawdown, win rate). Phase 4 — DXCC: compliance review and approval gate. Phase 5 — Kuber Alpha: the approved strategy is deployed to production and begins live execution.'}
                    {aiTab === 'What is the strategy JSON format?' && 'The Strategy Package JSON contains: metadata (name, version, author, tags), indicator configurations, entry/exit condition trees as nested JSON, risk rules (stop-loss, trailing, drawdown), position sizing parameters, portfolio allocation weights, test configuration for Parikshak, backtest parameter ranges for Simulator, and deployment manifest for Kuber Alpha. The format is versioned and backward-compatible across all downstream engines.'}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      <div className="h-16" />
    </div>
  );
}
