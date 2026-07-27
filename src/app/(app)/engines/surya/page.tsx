'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiServer, FiActivity, FiShield, FiDatabase, FiDownload,
  FiArrowRight, FiClock, FiRefreshCw, FiZap, FiInfo,
  FiCheck, FiAlertCircle, FiBarChart2, FiTrendingUp, FiTarget,
  FiPackage, FiFile, FiFileText, FiCpu, FiHardDrive,
  FiCloud, FiGitBranch, FiLayers, FiShare2, FiGrid,
  FiRadio, FiSun, FiUpload,
} from 'react-icons/fi';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fileTypes = [
  { name: 'Security Token', purpose: 'Exchange security master tokens', consumers: ['Vega', 'Order Manager', 'Risk Engine'] },
  { name: 'Contract Master', purpose: 'Instrument contract specifications', consumers: ['All Engines', 'Simulator'] },
  { name: 'SPAN Margin', purpose: 'Standard Portfolio Analysis of Risk', consumers: ['Risk Engine', 'Vega'] },
  { name: 'Exposure Margin', purpose: 'Additional exposure-based margins', consumers: ['Risk Engine', 'Vega'] },
  { name: 'Bhavcopy', purpose: 'End-of-day price/volume report', consumers: ['Analytics', 'Simulator', 'OMS'] },
  { name: 'Settlement', purpose: 'Daily settlement prices & schedules', consumers: ['Risk Engine', 'Finance'] },
  { name: 'Corporate Actions', purpose: 'Dividends, splits, bonus, mergers', consumers: ['OMS', 'Portfolio', 'Strategy Builder'] },
  { name: 'Holiday Calendar', purpose: 'Exchange trading/non-trading days', consumers: ['Scheduler', 'All Engines'] },
  { name: 'Lot Size', purpose: 'Contract lot size definitions', consumers: ['Order Manager', 'Vega'] },
  { name: 'Tick Size', purpose: 'Minimum price increments', consumers: ['Order Manager', 'Vega'] },
  { name: 'Circuit Limits', purpose: 'Upper/lower price bands', consumers: ['Risk Engine', 'Vega', 'Order Manager'] },
  { name: 'Broker Files', purpose: 'Broker-specific reference files', consumers: ['Order Manager', 'Vega'] },
  { name: 'RMS Files', purpose: 'Risk Management System files', consumers: ['Risk Engine'] },
  { name: 'Risk Files', purpose: 'Risk exposure & limit files', consumers: ['Risk Engine'] },
  { name: 'Metadata', purpose: 'Exchange metadata & configuration', consumers: ['All Engines'] },
  { name: 'Index Composition', purpose: 'Index constituent weights', consumers: ['Analytics', 'Portfolio'] },
  { name: 'Market Status', purpose: 'Live market status snapshots', consumers: ['Scheduler', 'Dashboard'] },
  { name: 'Delivery Report', purpose: 'Physical delivery positions', consumers: ['Risk Engine', 'OMS'] },
  { name: 'Participant Files', purpose: 'Clearing member files', consumers: ['Risk Engine', 'Analytics'] },
];

const connectedConsumers = [
  'Vega Engine', 'Order Manager', 'Risk Engine', 'Simulator',
  'Parikshak', 'Strategy Builder', 'Portfolio Manager', 'DXCC',
  'Kuber Alpha', 'Ganesh', 'Analytics Engine', 'Audit Engine',
  'MQ Stream', 'Scheduler', 'Dashboard', 'OMS',
];

const timelineSteps = [
  { time: '08:30', label: 'BOD Start', desc: 'Begin-of-day trigger fires; file download pipeline initiates.' },
  { time: '08:35', label: 'File Download', desc: 'Fetch all 18+ exchange files from BSE/NSE extranet concurrently.' },
  { time: '08:40', label: 'Validation', desc: 'Checksum verification, schema validation, mandatory field checking.' },
  { time: '08:45', label: 'Normalization', desc: 'Unify formats across exchanges; convert to internal canonical schema.' },
  { time: '08:48', label: 'Versioning', desc: 'Timestamp and version each file; store historical snapshot.' },
  { time: '08:50', label: 'Distribution', desc: 'Push files to consumer engines based on subscription matrix.' },
  { time: '15:30', label: 'EOD Processing', desc: 'End-of-day files: bhavcopy, settlement, reports downloaded.' },
  { time: '15:35', label: 'Archive', desc: 'Compress and archive all daily files. Update audit trail.' },
];

const responsibilities = [
  'Download Exchange Files', 'Validate Files', 'Normalize Formats',
  'Version Control', 'Distribute to All', 'Customize Per Engine',
  'Archive History', 'Retry Failed Downloads', 'Monitor File Status',
];

const performanceMetrics = [
  { label: 'Files Processed/Day', value: '1,200+', icon: FiFile },
  { label: 'Total Consumers', value: '16', icon: FiServer },
  { label: 'File Types', value: '18+', icon: FiLayers },
  { label: 'Success Rate', value: '99.95%', icon: FiCheck },
];

export default function SuryaPage() {
  const [aiTab, setAiTab] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ==================== HERO ==================== */}
      <section className="relative bg-white border-b border-gray-100 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6">
              <FiSun className="text-base" />
              Enterprise File Acquisition Engine
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
              Surya Engine
            </h1>
            <p className="text-xl md:text-2xl text-blue-600 font-medium mb-6">
              Single Source of Truth. Automated BOD/EOD. Every File, Every Engine.
            </p>
            <p className="text-lg text-gray-500 max-w-3xl mx-auto mb-8">
              The central exchange file acquisition and distribution platform that ensures every engine
              and product receives accurate, validated, and timely data from BSE and NSE extranet.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" /> Online</span>
              <span>v3.2.1</span>
              <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs font-medium">Production</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== ECOSYSTEM POSITION ==================== */}
      <section className="py-20 px-6 bg-[#F8FAFC]">
        <motion.div className="max-w-5xl mx-auto" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Ecosystem Position</h2>
          <p className="text-gray-500 text-center mb-12">Surya sits between Exchange Extranet and all downstream engines as the single data gateway.</p>
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm overflow-x-auto">
            <svg viewBox="0 0 800 280" className="w-full min-w-[600px]">
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              {/* Exchange Extranet */}
              <rect x="30" y="90" width="150" height="100" rx="16" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="2" />
              <text x="105" y="130" textAnchor="middle" fill="#1E40AF" fontSize="13" fontWeight="600">Exchange</text>
              <text x="105" y="152" textAnchor="middle" fill="#1E40AF" fontSize="13" fontWeight="600">Extranet</text>
              <text x="105" y="174" textAnchor="middle" fill="#60A5FA" fontSize="11">BSE / NSE</text>
              {/* Arrow 1 */}
              <line x1="180" y1="140" x2="240" y2="140" stroke="#2563EB" strokeWidth="2.5" markerEnd="url(#arrowBlue)" />
              <defs><marker id="arrowBlue" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#2563EB" /></marker></defs>
              {/* Surya Central */}
              <rect x="250" y="75" width="170" height="130" rx="20" fill="#2563EB" stroke="#1D4ED8" strokeWidth="3" filter="url(#glow)" />
              <text x="335" y="120" textAnchor="middle" fill="#FFFFFF" fontSize="20" fontWeight="700">☀ Surya</text>
              <text x="335" y="148" textAnchor="middle" fill="#DBEAFE" fontSize="11">File Acquisition</text>
              <text x="335" y="168" textAnchor="middle" fill="#DBEAFE" fontSize="11">&amp; Distribution</text>
              {/* Arrows out */}
              <line x1="420" y1="95" x2="490" y2="45" stroke="#2563EB" strokeWidth="2" markerEnd="url(#arrowBlue)" />
              <line x1="420" y1="120" x2="490" y2="90" stroke="#2563EB" strokeWidth="2" markerEnd="url(#arrowBlue)" />
              <line x1="420" y1="145" x2="490" y2="140" stroke="#2563EB" strokeWidth="2" markerEnd="url(#arrowBlue)" />
              <line x1="420" y1="170" x2="490" y2="190" stroke="#2563EB" strokeWidth="2" markerEnd="url(#arrowBlue)" />
              <line x1="420" y1="190" x2="490" y2="235" stroke="#2563EB" strokeWidth="2" markerEnd="url(#arrowBlue)" />
              {/* Downstream engines */}
              <g>
                <rect x="500" y="25" width="120" height="40" rx="10" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1.5" />
                <text x="560" y="50" textAnchor="middle" fill="#334155" fontSize="11" fontWeight="600">Vega Engine</text>
              </g>
              <g>
                <rect x="500" y="72" width="120" height="40" rx="10" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1.5" />
                <text x="560" y="97" textAnchor="middle" fill="#334155" fontSize="11" fontWeight="600">Risk Engine</text>
              </g>
              <g>
                <rect x="500" y="120" width="120" height="40" rx="10" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1.5" />
                <text x="560" y="145" textAnchor="middle" fill="#334155" fontSize="11" fontWeight="600">Simulator</text>
              </g>
              <g>
                <rect x="500" y="170" width="120" height="40" rx="10" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1.5" />
                <text x="560" y="195" textAnchor="middle" fill="#334155" fontSize="11" fontWeight="600">Order Manager</text>
              </g>
              <g>
                <rect x="500" y="218" width="120" height="40" rx="10" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1.5" />
                <text x="560" y="243" textAnchor="middle" fill="#334155" fontSize="11" fontWeight="600">Analytics</text>
              </g>
              {/* More engines */}
              <g>
                <rect x="650" y="25" width="120" height="40" rx="10" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 2" />
                <text x="710" y="45" textAnchor="middle" fill="#64748B" fontSize="10">Parikshak</text>
                <text x="710" y="58" textAnchor="middle" fill="#94A3B8" fontSize="10">+ 12 more</text>
              </g>
              <g>
                <rect x="650" y="72" width="120" height="40" rx="10" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 2" />
                <text x="710" y="92" textAnchor="middle" fill="#64748B" fontSize="10">Strategy Builder</text>
                <text x="710" y="105" textAnchor="middle" fill="#94A3B8" fontSize="10">+ 11 more</text>
              </g>
            </svg>
          </div>
        </motion.div>
      </section>

      {/* ==================== OVERVIEW CARDS ==================== */}
      <section className="py-20 px-6 bg-white">
        <motion.div className="max-w-7xl mx-auto" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: FiTarget, title: 'Purpose', text: 'Centralized exchange file acquisition and distribution. Automate BOD/EOD workflows.' },
              { icon: FiTrendingUp, title: 'Business Importance', text: 'Critical path — no downstream engine receives data without Surya. Zero tolerance for delay.' },
              { icon: FiLayers, title: 'File Types', text: '18+ distinct exchange file categories covering all trading, risk, and reference data needs.' },
              { icon: FiShare2, title: 'Connected Consumers', text: 'All 16 engines and products. Surya is the single source of truth for every file.' },
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

      {/* ==================== DAILY OPERATIONS TIMELINE ==================== */}
      <section className="py-20 px-6 bg-[#F8FAFC] overflow-hidden">
        <motion.div className="max-w-7xl mx-auto" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Daily Operations Timeline</h2>
          <p className="text-gray-500 text-center mb-12">BOD to EOD — every step automated, monitored, and validated.</p>
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-0 min-w-[900px] relative">
              {/* Connecting line */}
              <div className="absolute top-10 left-0 right-0 h-0.5 bg-blue-200" style={{ top: '40px' }} />
              {timelineSteps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex-1 relative px-3"
                >
                  <div className={`w-5 h-5 rounded-full border-4 mx-auto mb-4 relative z-10 ${
                    i <= 3 ? 'bg-blue-600 border-blue-200' :
                    i <= 5 ? 'bg-blue-600 border-blue-200' :
                    'bg-orange-500 border-orange-200'
                  }`} />
                  <p className="text-xs font-bold text-blue-600 mb-1 text-center">{step.time}</p>
                  <p className="text-sm font-semibold text-gray-900 mb-2 text-center">{step.label}</p>
                  <p className="text-xs text-gray-500 text-center leading-relaxed">{step.desc}</p>
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
          <p className="text-gray-500 text-center mb-12">Seven-stage pipeline from extranet to consumer APIs.</p>
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm overflow-x-auto">
            <svg viewBox="0 0 800 160" className="w-full min-w-[700px]">
              {/* Flow */}
              {[
                { x: 15, label: 'Extranet\nAPI', color: '#EFF6FF', border: '#BFDBFE' },
                { x: 115, label: 'Download\nManager', color: '#F0FDF4', border: '#86EFAC' },
                { x: 235, label: 'Validator', color: '#FEF3C7', border: '#FCD34D' },
                { x: 345, label: 'Normalizer', color: '#FCE7F3', border: '#F9A8D4' },
                { x: 465, label: 'Version\nStore', color: '#F3E8FF', border: '#C4B5FD' },
                { x: 585, label: 'Distribution\nEngine', color: '#EFF6FF', border: '#93C5FD' },
                { x: 705, label: 'Consumer\nAPIs', color: '#ECFDF5', border: '#6EE7B7' },
              ].map((box, i) => (
                <g key={i}>
                  <rect x={box.x} y="40" width="95" height="80" rx="12" fill={box.color} stroke={box.border} strokeWidth="2" />
                  {box.label.split(/\n/).map((line, li) => (
                    <text key={li} x={box.x + 48} y={li === 0 ? 72 : 90} textAnchor="middle" fill="#1E293B" fontSize="11" fontWeight="600">{line}</text>
                  ))}
                </g>
              ))}
              {/* Arrows */}
              {[110, 230, 340, 460, 580, 700].map((x, i) => (
                <line key={i} x1={x} y1="80" x2={x + 5} y2="80" stroke="#2563EB" strokeWidth="2" markerEnd="url(#arrSmall)" />
              ))}
              <defs><marker id="arrSmall" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#2563EB" /></marker></defs>
              {/* Middle labels */}
              <text x="235" y="145" textAnchor="middle" fill="#64748B" fontSize="9">Checksum &amp;</text>
              <text x="235" y="156" textAnchor="middle" fill="#64748B" fontSize="9">Schema Val</text>
              <text x="350" y="156" textAnchor="middle" fill="#64748B" fontSize="9">Canonical Format</text>
            </svg>
          </div>
        </motion.div>
      </section>

      {/* ==================== FILE CATALOGUE ==================== */}
      <section className="py-20 px-6 bg-[#F8FAFC]">
        <motion.div className="max-w-7xl mx-auto" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">File Catalogue</h2>
          <p className="text-gray-500 text-center mb-12">18+ exchange file types acquired and distributed daily.</p>
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {fileTypes.map((f, i) => (
              <motion.div
                key={i}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:border-blue-200 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiFileText className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{f.name}</h4>
                    <p className="text-xs text-gray-400">Exchange File</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-3">{f.purpose}</p>
                <div className="flex flex-wrap gap-1">
                  {f.consumers.slice(0, 3).map((c, ci) => (
                    <span key={ci} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-xs">{c}</span>
                  ))}
                  {f.consumers.length > 3 && (
                    <span className="px-2 py-0.5 text-gray-400 text-xs">+{f.consumers.length - 3}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ==================== RESPONSIBILITIES DASHBOARD ==================== */}
      <section className="py-20 px-6 bg-white">
        <motion.div className="max-w-5xl mx-auto" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Responsibilities Dashboard</h2>
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {responsibilities.map((r, i) => (
              <motion.div
                key={i}
                variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}
                className="flex items-center gap-3 bg-[#F8FAFC] border border-gray-200 rounded-2xl p-4 hover:border-green-300 transition-colors"
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
      <section className="py-20 px-6 bg-[#F8FAFC]">
        <motion.div className="max-w-6xl mx-auto" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Inputs &amp; Outputs</h2>
          <div className="flex flex-col md:flex-row items-stretch gap-6">
            {/* Inputs */}
            <motion.div className="flex-1 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"><FiDownload className="text-blue-600" /></div>
                <h3 className="font-bold text-gray-900 text-lg">Inputs</h3>
              </div>
              <div className="space-y-2">
                {['BSE Extranet Files', 'NSE Extranet Files', 'BOD/EOD Schedule Config', 'Engine Subscription Matrix', 'Retry Configuration', 'Exchange API Credentials', 'Validation Rules Schema'].map((inp, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{inp}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            {/* Arrow */}
            <div className="flex items-center justify-center text-blue-400 text-3xl">
              <FiArrowRight className="hidden md:block" />
              <FiArrowRight className="block md:hidden rotate-90" />
            </div>
            {/* Outputs */}
            <motion.div className="flex-1 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center"><FiUpload className="text-green-600" /></div>
                <h3 className="font-bold text-gray-900 text-lg">Outputs</h3>
              </div>
              <div className="space-y-2">
                {['Normalized Exchange Files', 'Versioned File Snapshots', 'Distribution Status Events', 'File Processing Logs', 'Validation Reports', 'Consumer Acknowledgement', 'Archive Packages'].map((out, i) => (
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

      {/* ==================== PERFORMANCE DASHBOARD ==================== */}
      <section className="py-20 px-6 bg-white">
        <motion.div className="max-w-7xl mx-auto" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Performance Dashboard</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {performanceMetrics.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-gray-200 rounded-2xl p-6 text-center hover:shadow-md hover:border-blue-200 transition-all"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <m.icon className="text-blue-600 text-xl" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{m.value}</p>
                <p className="text-sm text-gray-500">{m.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ==================== HEALTH DASHBOARD ==================== */}
      <section className="py-20 px-6 bg-[#F8FAFC]">
        <motion.div className="max-w-5xl mx-auto" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Health Dashboard</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: 'Extranet Connection', status: true, icon: FiRadio },
              { label: 'Download Queue', status: true, meta: 'Normal', icon: FiDownload },
              { label: 'Distribution Active', status: true, meta: 'All Consumers', icon: FiShare2 },
              { label: 'Archive Storage', status: true, meta: '65% Used', icon: FiHardDrive },
            ].map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:border-green-300 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
                    <h.icon className="text-green-600" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs font-medium text-green-600">{h.status ? 'Healthy' : 'Degraded'}</span>
                  </div>
                </div>
                <p className="font-semibold text-gray-900 text-sm">{h.label}</p>
                {h.meta && <p className="text-xs text-gray-400 mt-1">{h.meta}</p>}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ==================== RULE SECTION ==================== */}
      <section className="py-20 px-6 bg-white">
        <motion.div className="max-w-4xl mx-auto" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
          <motion.div
            className="bg-blue-50 border-2 border-blue-300 rounded-2xl p-8 text-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <FiShield className="text-blue-600 text-3xl mx-auto mb-4" />
            <p className="text-lg font-bold text-blue-800">
              No engine or product downloads exchange files directly.
              Every BOD file enters through Surya.
            </p>
            <p className="text-sm text-blue-600 mt-2">
              Surya is the mandated single gateway — ensuring data integrity, auditability, and centralized control.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* ==================== AI EXPLANATION ==================== */}
      <section className="py-20 px-6 bg-[#F8FAFC]">
        <motion.div className="max-w-4xl mx-auto text-center" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ask the AI</h2>
          <p className="text-gray-500 mb-8">Get instant answers about Surya Engine.</p>
          <div className="flex flex-wrap justify-center gap-4">
            {['Explain Surya\'s architecture', 'How does file validation work?', 'What happens on BOD failure?'].map((q, i) => (
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
                    {aiTab === 'Explain Surya\'s architecture' && 'Surya follows a seven-stage pipeline: Extranet API fetches raw files from BSE/NSE, the Download Manager handles concurrent fetches with retry logic, the Validator runs checksum and schema checks, the Normalizer converts to canonical format, the Version Store timestamps and snapshots every file, the Distribution Engine pushes files to subscribed consumers via their respective APIs, and the Archiver compresses and stores daily packages for audit.'}
                    {aiTab === 'How does file validation work?' && 'File validation runs in three layers: Transport-level checksum (SHA-256) ensures file integrity, Structural validation verifies the schema matches expected columns and data types, and Business validation checks mandatory fields, price ranges, date consistency, and exchange-specific business rules. Any failure triggers automatic retry with exponential backoff.'}
                    {aiTab === 'What happens on BOD failure?' && 'On BOD failure, Surya\'s retry mechanism activates — up to 5 retries with exponential backoff (30s, 60s, 120s, 240s, 480s). If all retries fail, the health status degrades to Warning/Error, alerts are sent to the ops team, and downstream engines are notified. Files are retried from where they failed (not re-downloaded entirely). Surya maintains partial state to avoid duplicate processing.'}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Footer spacer */}
      <div className="h-16" />
    </div>
  );
}
