'use client';

import { motion, AnimatePresence, easeOut, easeInOut } from 'framer-motion';
import {
  Bot, Zap, Server, Shield, BookOpen, Cpu, Network,
  Globe, Code, Rocket, ChevronDown, ChevronRight, Star,
  TrendingUp, Activity, Layers, Database, Terminal,
  Cloud, Lock, MessageSquare, ArrowRight, ExternalLink,
  Search, Menu, X, Check
} from 'lucide-react';
import { useState } from 'react';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: easeOut }
  })
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } }
};

// -- Data --

const LAYERS = [
  {
    layer: 1, name: 'Core Data',
    components: 'Lakshmi, Surya, Ganesh, TalkOptions',
    desc: 'Foundation tier ingesting real-time market prices, exchange files, OHLC aggregations, and options analytics — all normalised and streamed via Narad.',
    icon: Database, color: '#2563EB'
  },
  {
    layer: 2, name: 'Opportunity Generation',
    components: 'Aalap Calls, Delta XI, VYUH, TalkDelta AI',
    desc: 'AI-driven opportunity scanners and multi-leg strategy builders that consume normalised data and emit actionable trade signals.',
    icon: TrendingUp, color: '#7C3AED'
  },
  {
    layer: 3, name: 'Strategy Hub',
    components: 'Kuber Alpha',
    desc: 'Centralised strategy orchestration layer — aggregates signals, applies position-sizing, performs risk checks, and creates structured orders.',
    icon: Layers, color: '#0891B2'
  },
  {
    layer: 4, name: 'Order Execution',
    components: 'Vega Engine',
    desc: 'Ultra-low-latency execution engine with smart order routing, sliced parent orders, and exchange-native FIX protocol connectivity.',
    icon: Zap, color: '#EA580C'
  },
  {
    layer: 5, name: 'Trade Governance',
    components: 'DXCC',
    desc: 'Post-trade surveillance, compliance rule engine, regulatory reporting, and audit trail — ensuring every trade meets enterprise governance.',
    icon: Shield, color: '#16A34A'
  }
];

const ENGINES = [
  { name: 'Lakshmi', icon: Activity, oneLiner: 'Live price feed engine', roles: ['Real-time tick ingestion', 'Multi-exchange normalisation', 'Sub-ms latency distribution'], color: '#2563EB' },
  { name: 'Vega', icon: Zap, oneLiner: 'Order execution engine', roles: ['Smart order routing', 'FIX protocol gateway', 'Latency-optimised execution'], color: '#EA580C' },
  { name: 'Surya', icon: Cloud, oneLiner: 'Exchange file processor', roles: ['Bhavcopy & greeks ingestion', 'End-of-day reconciliation', 'Historical archive builder'], color: '#7C3AED' },
  { name: 'Ganesh', icon: TrendingUp, oneLiner: 'OHLC aggregation engine', roles: ['Multi-timeframe OHLC bars', 'Volume profile generation', 'Indicators pre-computation'], color: '#0891B2' },
  { name: 'Kuber Alpha', icon: Layers, oneLiner: 'Strategy hub', roles: ['Signal aggregation engine', 'Position-sizing calculator', 'Risk-first order generation'], color: '#16A34A' },
  { name: 'DXCC', icon: Shield, oneLiner: 'Trade governance & compliance', roles: ['Post-trade surveillance', 'Rule-based compliance checks', 'Regulatory report generation'], color: '#DC2626' },
  { name: 'Narad', icon: Network, oneLiner: 'Universal connectivity bus', roles: ['Pub-sub message backbone', 'Inter-engine routing', 'Zero-copy streaming'], color: '#9333EA' },
  { name: 'Suraksha', icon: Lock, oneLiner: 'Security & auth gateway', roles: ['OAuth2 / JWT provider', 'RBAC enforcement', 'Audit logging'], color: '#0D9488' },
  { name: 'Parikshak', icon: Check, oneLiner: 'Testing & QA engine', roles: ['Automated regression suites', 'Engine health monitoring', 'Latency benchmarking'], color: '#B45309' },
  { name: 'TalkOptions', icon: MessageSquare, oneLiner: 'Options analytics engine', roles: ['Greeks computation', 'IV surface analysis', 'Strategy payoff visualisation'], color: '#4F46E5' }
];

const PRODUCTS = [
  { name: 'TalkDelta', type: 'Platform', oneLiner: 'Real-time delta-one trader terminal' },
  { name: 'TalkOffice', type: 'Platform', oneLiner: 'Centralised risk & admin console' },
  { name: 'TalkDelta AI', type: 'AI', oneLiner: 'LLM-powered trade reasoning agent' },
  { name: 'Strategy Factory', type: 'Tool', oneLiner: 'Visual strategy builder & backtester' },
  { name: 'TradePilot', type: 'Tool', oneLiner: 'Paper-trading & simulation cockpit' },
  { name: 'Simulator', type: 'Tool', oneLiner: 'Market replay & stress-test engine' },
  { name: 'TalkStrategy API', type: 'API', oneLiner: 'RESTful strategy execution APIs' },
  { name: 'TalkStrategy App', type: 'App', oneLiner: 'Mobile-first trading companion' },
  { name: 'Aalap Calls', type: 'Signal', oneLiner: 'AI-curated intraday call flow' },
  { name: 'Delta XI', type: 'Signal', oneLiner: 'Multi-leg options opportunity scanner' },
  { name: 'VYUH', type: 'Signal', oneLiner: 'Market-structure-based strategy generator' },
  { name: 'SpreadWatch', type: 'Tool', oneLiner: 'Calendar & vertical spread monitor' },
  { name: 'Chitragupta', type: 'Tool', oneLiner: 'P&L ledger & tax reporting' },
  { name: 'Feed Server', type: 'Infra', oneLiner: 'Centralised market-data distribution' },
  { name: 'MQ', type: 'Infra', oneLiner: 'Message queue backbone for inter-service comms' },
  { name: 'Local WebSocket', type: 'Infra', oneLiner: 'Low-latency desktop data streaming' }
];

const FAQS = [
  { q: 'What is the Algo IQ Ecosystem?', a: 'A unified, AI-first algorithmic trading platform that spans live data ingestion, opportunity scanning, strategy orchestration, execution, and post-trade governance — all connected through the Narad messaging backbone.', cat: 'General' },
  { q: 'How does the 5-layer architecture benefit my trading desk?', a: 'Each layer encapsulates a single responsibility, enabling independent scaling, technology choices per layer, and clean data contracts. This means faster iteration, easier compliance, and zero cross-layer coupling.', cat: 'Architecture' },
  { q: 'Which exchanges and instruments are supported?', a: 'NSE, BSE, MCX, NCDEX for equities, derivatives, commodities, and currencies. New exchange adapters can be onboarded through the Surya framework in under two weeks.', cat: 'Products' },
  { q: 'What makes Vega Engine different from other OMS?', a: 'Vega is purpose-built for algorithmic flows with sub-200-microsecond internal latency, native FIX 4.4 support, smart-order slicing, and tight integration with DXCC for pre-trade compliance checks.', cat: 'Engines' },
  { q: 'Is the entire ecosystem on-premise or cloud-hosted?', a: 'It supports both. Core engines run on-premise for minimum latency, while analytics and AI layers can operate in cloud or hybrid mode through the Narad bridge.', cat: 'Deployment' },
  { q: 'How does TalkDelta AI generate trade ideas?', a: 'TalkDelta AI consumes normalised market data, applies transformer-based models for pattern recognition, cross-references with Aalap Calls signal history, and surfaces opportunities with confidence scores and risk metrics.', cat: 'Products' },
  { q: 'What security certifications does the platform hold?', a: 'Suraksha enforces OAuth 2.0, JWT-based service auth, AES-256 encryption at rest, TLS 1.3 in transit, and full RBAC with audit trails. The platform is SOC 2 Type II audited.', cat: 'Security' },
  { q: 'Can I integrate my own strategies into Kuber Alpha?', a: 'Yes. The Strategy Factory provides a visual DSL and Python SDK. Strategies are containerised and deployed as Kuber Alpha plugins with isolated resource allocation.', cat: 'Engines' },
  { q: 'What kind of latency can I expect on order execution?', a: 'Vega Engine delivers sub-200-microsecond internal routing latency. End-to-end from signal to exchange averages under 2 milliseconds on co-located infrastructure.', cat: 'Engines' },
  { q: 'How do I get started with the ecosystem?', a: 'Contact the enterprise sales team for a technical deep-dive and sandbox provisioning. Existing clients can login via the universal SSO portal to access all subscribed products.', cat: 'General' }
];

const SUGGESTED_QUESTIONS = [
  'How does Vega execute orders?',
  'Explain the 5-layer architecture',
  'What is Narad connectivity?',
  'Compare Lakshmi and TalkOptions',
  'How does DXCC ensure compliance?',
  'What products does Kuber Alpha use?'
];

// -- Sub-components --

function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = ['Home', 'About', 'Products', 'Engines', 'Architecture', 'Documentation', 'Knowledge Base', 'Topology Explorer'];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-gray-900">Algo IQ</span>
          </div>
          <div className="hidden lg:flex items-center gap-6">
            {links.map(l => (
              <a key={l} href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">{l}</a>
            ))}
            <a href="/login" className="ml-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">Login</a>
          </div>
          <button className="lg:hidden p-2 text-gray-600" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="lg:hidden border-t border-gray-100 bg-white overflow-hidden">
            <div className="px-4 py-3 space-y-1">
              {links.map(l => (
                <a key={l} href="#" className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">{l}</a>
              ))}
              <a href="/login" className="block px-3 py-2 mt-2 text-center bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">Login</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function Hero() {
  const floatingCards = ['Lakshmi', 'Vega', 'Surya', 'Ganesh', 'Kuber Alpha', 'DXCC'];
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-white">
      {/* Floating engine cards */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingCards.map((name, i) => (
          <motion.div
            key={name}
            className="absolute px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-xl shadow-sm text-xs font-semibold text-gray-700"
            style={{
              left: `${15 + ((i * 13) % 70)}%`,
              top: `${10 + ((i * 17) % 70)}%`
            }}
            animate={{ y: [-8, 8, -8] }}
            transition={{ duration: 3 + i * 0.6, repeat: Infinity, ease: easeInOut, delay: i * 0.3 }}
          >
            {name}
          </motion.div>
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium mb-6">
            <Activity className="w-3.5 h-3.5" />
            Enterprise Algorithmic Trading Ecosystem
          </motion.div>
          <motion.h1 variants={fadeInUp} custom={1} className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-tight">
            The Unified <span className="text-blue-600">AI-Powered</span><br />Algorithmic Trading Ecosystem
          </motion.h1>
          <motion.p variants={fadeInUp} custom={2} className="mt-4 text-xl text-blue-600 font-semibold tracking-tight">
            Modular.{' '}Enterprise.{' '}AI-First.{' '}Documentation-Driven.
          </motion.p>
          <motion.p variants={fadeInUp} custom={3} className="mt-6 max-w-3xl mx-auto text-lg text-gray-500 leading-relaxed">
            From live market-data ingestion to AI-powered opportunity generation, institutional-grade execution,
            and comprehensive trade governance — the Algo IQ Ecosystem provides a complete, modular stack
            for modern algorithmic trading desks.
          </motion.p>
          <motion.div variants={fadeInUp} custom={4} className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
              Explore Topology <ChevronRight className="w-4 h-4" />
            </a>
            <a href="/docs" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:border-blue-200 hover:text-blue-600 transition-colors shadow-sm">
              Documentation <BookOpen className="w-4 h-4" />
            </a>
            <a href="/architecture" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:border-blue-200 hover:text-blue-600 transition-colors shadow-sm">
              Architecture <Server className="w-4 h-4" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function ArchitectureSection() {
  return (
    <section className="py-24 bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger} className="text-center mb-16">
          <motion.span variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium mb-4">
            <Layers className="w-3.5 h-3.5" />
            System Architecture
          </motion.span>
          <motion.h2 variants={fadeInUp} className="text-4xl font-bold tracking-tight text-gray-900">5-Layer Architecture</motion.h2>
          <motion.p variants={fadeInUp} className="mt-3 text-gray-500 max-w-2xl mx-auto">
            Each layer is independently scalable with strict data contracts between them, ensuring clean separation of concerns and enterprise-grade reliability.
          </motion.p>
        </motion.div>

        <div className="space-y-8">
          {LAYERS.map((layer, i) => {
            const Icon = layer.icon;
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={layer.layer}
                initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`flex flex-col ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} gap-6 items-center`}
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg" style={{ backgroundColor: layer.color }}>
                  {layer.layer}
                </div>
                <div className="flex-1 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="w-5 h-5" style={{ color: layer.color }} />
                    <h3 className="text-lg font-semibold text-gray-900">{layer.name}</h3>
                  </div>
                  <p className="text-sm font-mono text-gray-400 mb-2">{layer.components}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{layer.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function EngineShowcase() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger} className="text-center mb-16">
          <motion.span variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium mb-4">
            <Cpu className="w-3.5 h-3.5" />
            Core Engines
          </motion.span>
          <motion.h2 variants={fadeInUp} className="text-4xl font-bold tracking-tight text-gray-900">Engine Showcase</motion.h2>
          <motion.p variants={fadeInUp} className="mt-3 text-gray-500 max-w-2xl mx-auto">
            10 purpose-built engines powering every stage of the algorithmic trading lifecycle.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ENGINES.map((eng, i) => {
            const Icon = eng.icon;
            return (
              <motion.div
                key={eng.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group bg-white rounded-2xl border border-gray-100 p-6 hover:border-gray-200 hover:shadow-lg transition-all"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: eng.color + '15' }}>
                  <Icon className="w-5 h-5" style={{ color: eng.color }} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{eng.name}</h3>
                <p className="text-sm text-gray-400 mb-4">{eng.oneLiner}</p>
                <ul className="space-y-2 mb-5">
                  {eng.roles.map((r, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-500" />
                      {r}
                    </li>
                  ))}
                </ul>
                <a href="#" className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  Learn more <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProductDirectory() {
  const typeColors: Record<string, string> = {
    Platform: 'bg-blue-50 text-blue-700',
    AI: 'bg-purple-50 text-purple-700',
    Tool: 'bg-amber-50 text-amber-700',
    API: 'bg-green-50 text-green-700',
    App: 'bg-teal-50 text-teal-700',
    Signal: 'bg-rose-50 text-rose-700',
    Infra: 'bg-slate-100 text-slate-700'
  };

  return (
    <section className="py-24 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger} className="text-center mb-16">
          <motion.span variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium mb-4">
            <Globe className="w-3.5 h-3.5" />
            Product Suite
          </motion.span>
          <motion.h2 variants={fadeInUp} className="text-4xl font-bold tracking-tight text-gray-900">Product Directory</motion.h2>
          <motion.p variants={fadeInUp} className="mt-3 text-gray-500 max-w-2xl mx-auto">
            The complete catalogue of platforms, tools, APIs, signals, and infrastructure products.
          </motion.p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {PRODUCTS.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900 text-sm">{p.name}</h4>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${typeColors[p.type] || 'bg-gray-50 text-gray-600'}`}>
                  {p.type}
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{p.oneLiner}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AIAssistant() {
  const [responseVisible, setResponseVisible] = useState(false);
  const [query, setQuery] = useState('');

  const handleAsk = (q: string) => {
    setQuery(q);
    setResponseVisible(true);
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger} className="text-center mb-12">
          <motion.span variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium mb-4">
            <Bot className="w-3.5 h-3.5" />
            AI Powered
          </motion.span>
          <motion.h2 variants={fadeInUp} className="text-4xl font-bold tracking-tight text-gray-900">Ask Algo IQ AI</motion.h2>
          <motion.p variants={fadeInUp} className="mt-3 text-gray-500">
            Get instant, AI-powered answers about any component of the ecosystem.
          </motion.p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative">
          <div className="flex items-center gap-3 px-5 py-4 bg-white rounded-2xl border border-gray-200 shadow-sm hover:border-blue-200 hover:shadow-md transition-all">
            <Bot className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); if (!responseVisible) setResponseVisible(true); }}
              placeholder="Ask anything about the Algo IQ Ecosystem..."
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
            />
            <button onClick={() => setResponseVisible(true)} className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mt-8 flex flex-wrap justify-center gap-2">
          {SUGGESTED_QUESTIONS.map((q, i) => (
            <motion.button
              key={i}
              variants={fadeInUp}
              custom={i}
              onClick={() => handleAsk(q)}
              className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-xs font-medium text-gray-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all"
            >
              {q}
            </motion.button>
          ))}
        </motion.div>

        <AnimatePresence>
          {responseVisible && (
            <motion.div
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-8 overflow-hidden"
            >
              <div className="bg-[#F8FAFC] rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">Algo IQ AI</span>
                  <span className="text-[10px] text-gray-400 ml-auto">Executive Summary</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  The Algo IQ Ecosystem&apos;s 5-layer architecture ensures clean separation between data ingestion,
                  opportunity generation, strategy orchestration, execution, and governance. Each layer operates
                  independently with well-defined contracts, enabling enterprise teams to scale, monitor, and
                  upgrade individual components without affecting the rest of the system.
                </p>
                <div className="space-y-2 mb-4">
                  {[
                    'Layer 1 (Core Data): Lakshmi streams live prices while Surya processes exchange files — all normalised via Narad.',
                    'Layer 2 (Opportunity): AI-powered scanners like Aalap Calls and Delta XI identify high-probability setups.',
                    'Layer 3 (Strategy Hub): Kuber Alpha aggregates multi-source signals and applies position-sizing.',
                    'Layer 4 (Execution): Vega Engine offers sub-200μs routing with FIX 4.4 native support.',
                    'Layer 5 (Governance): DXCC provides real-time compliance checks and full audit trails.'
                  ].map((point, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                      {point}
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-xs font-semibold text-gray-500 mb-2">Related Products</p>
                  <div className="flex flex-wrap gap-2">
                    {['Lakshmi', 'Surya', 'Kuber Alpha', 'Vega', 'DXCC', 'Narad'].map(p => (
                      <span key={p} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-600">{p}</span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <p className="text-xs font-semibold text-gray-500 mb-2">Suggested Follow-ups</p>
                  <div className="flex flex-wrap gap-2">
                    {['How fast is Vega Engine?', 'What is Narad protocol?', 'Compare Kuber vs traditional OMS'].map((f, i) => (
                      <button key={i} onClick={() => handleAsk(f)} className="text-xs text-blue-600 hover:text-blue-700 transition-colors">{f}</button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const categoryColors: Record<string, string> = {
    General: 'bg-blue-50 text-blue-700',
    Architecture: 'bg-purple-50 text-purple-700',
    Products: 'bg-green-50 text-green-700',
    Engines: 'bg-amber-50 text-amber-700',
    Security: 'bg-rose-50 text-rose-700',
    Deployment: 'bg-teal-50 text-teal-700'
  };

  return (
    <section className="py-24 bg-[#F8FAFC]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger} className="text-center mb-16">
          <motion.span variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium mb-4">
            <MessageSquare className="w-3.5 h-3.5" />
            Frequently Asked
          </motion.span>
          <motion.h2 variants={fadeInUp} className="text-4xl font-bold tracking-tight text-gray-900">FAQ</motion.h2>
          <motion.p variants={fadeInUp} className="mt-3 text-gray-500">
            Everything you need to know about the Algo IQ Ecosystem.
          </motion.p>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${categoryColors[faq.cat] || 'bg-gray-50 text-gray-600'}`}>
                    {faq.cat}
                  </span>
                  <span className="text-sm font-medium text-gray-900">{faq.q}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${openIndex === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-4 text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ConnectivitySection() {
  const nodes = [
    { label: 'Lakshmi', x: 150, y: 80 },
    { label: 'Surya', x: 350, y: 50 },
    { label: 'Ganesh', x: 550, y: 80 },
    { label: 'Kuber', x: 250, y: 180 },
    { label: 'Vega', x: 450, y: 180 },
    { label: 'DXCC', x: 350, y: 280 }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger} className="text-center mb-16">
          <motion.span variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-medium mb-4">
            <Network className="w-3.5 h-3.5" />
            Connectivity Backbone
          </motion.span>
          <motion.h2 variants={fadeInUp} className="text-4xl font-bold tracking-tight text-gray-900">Powered by Narad</motion.h2>
          <motion.p variants={fadeInUp} className="mt-3 text-gray-500 max-w-2xl mx-auto">
            Every engine, product, and service communicates through Narad — the universal, low-latency message backbone.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative mx-auto rounded-2xl border border-gray-100 bg-[#F8FAFC] p-8 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-purple-50/50 to-blue-50/50" />
          <svg viewBox="0 0 700 360" className="relative w-full max-w-lg mx-auto" style={{ maxHeight: 360 }}>
            {/* Central Narad hub */}
            <circle cx="350" cy="180" r="45" fill="#9333EA" fillOpacity="0.15" stroke="#9333EA" strokeWidth="2" />
            <circle cx="350" cy="180" r="20" fill="#9333EA" />
            <text x="350" y="186" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="600" fontFamily="system-ui">Narad</text>

            {/* Lines from Narad to nodes */}
            <g stroke="#9333EA" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="6,3">
              {nodes.map((n, i) => (
                <line key={i} x1="350" y1="180" x2={n.x} y2={n.y} />
              ))}
            </g>

            {/* Nodes */}
            {nodes.map((n, i) => (
              <g key={i}>
                <motion.circle
                  cx={n.x} cy={n.y} r="28"
                  fill="white"
                  stroke="#E2E8F0"
                  strokeWidth="1.5"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, type: 'spring' }}
                />
                <text x={n.x} y={n.y + 4} textAnchor="middle" fill="#374151" fontSize="9" fontWeight="600" fontFamily="system-ui">
                  {n.label}
                </text>
              </g>
            ))}

            {/* Motion dots on lines */}
            {nodes.map((n, i) => (
              <motion.circle
                key={`dot-${i}`}
                r="3" fill="#9333EA"
                initial={{ cx: 350, cy: 180 }}
                animate={{ cx: [350, n.x, 350], cy: [180, n.y, 180] }}
                transition={{ duration: 2 + i, repeat: Infinity, ease: easeInOut, delay: i * 0.4 }}
              />
            ))}
          </svg>

          <div className="relative mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
            {['Pub-Sub Messaging', 'Zero-Copy Streaming', 'Service Discovery', 'Message Persistence', 'Auto-Reconnect', 'Encrypted Transport'].map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="px-3 py-2 bg-white rounded-xl border border-gray-100 text-xs font-medium text-gray-600"
              >
                {feat}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function LoginCTA() {
  const products = ['TalkDelta', 'TalkOffice', 'TalkStrategy API', 'Simulator', 'Strategy Factory', 'TradePilot'];
  return (
    <section className="py-24 bg-gradient-to-b from-white to-[#F8FAFC]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium mb-6">
            <Lock className="w-3.5 h-3.5" />
            Secure Access
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">Login to Algo IQ Ecosystem</h2>
          <p className="text-gray-500 mb-8">
            Universal SSO across all products. One identity, complete access.
          </p>
          <a href="/login" className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 text-lg">
            <Lock className="w-5 h-5" />
            Login to Ecosystem
          </a>
          <p className="mt-6 text-xs text-gray-400">Single Sign-On · SAML 2.0 · OAuth 2.0 · MFA Support</p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {products.map((p, i) => (
              <motion.span
                key={p}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-600 shadow-sm"
              >
                {p}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  const productCols = [['TalkDelta', 'TalkOffice', 'TalkDelta AI', 'Strategy Factory'], ['TradePilot', 'Simulator', 'TalkStrategy API', 'TalkStrategy App'], ['Aalap Calls', 'Delta XI', 'VYUH', 'SpreadWatch'], ['Chitragupta', 'Feed Server', 'MQ', 'Local WebSocket']];
  const engineCols = [['Lakshmi', 'Vega', 'Surya', 'Ganesh'], ['Kuber Alpha', 'DXCC', 'Narad'], ['Suraksha', 'Parikshak', 'TalkOptions']];
  const docsCols = [['Getting Started', 'Architecture Overview', 'API Reference', 'Engine Guides'], ['Deployment Guide', 'Security Policy', 'Changelog', 'FAQ']];
  const companyCols = [['About Us', 'Careers', 'Contact', 'Blog'], ['Press Kit', 'Partners', 'Privacy Policy', 'Terms of Service']];

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Products</h4>
            <div className="space-y-2">
              {productCols.flat().map(p => (
                <a key={p} href="#" className="block text-sm text-gray-500 hover:text-blue-600 transition-colors">{p}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Engines</h4>
            <div className="space-y-2">
              {engineCols.flat().map(e => (
                <a key={e} href="#" className="block text-sm text-gray-500 hover:text-blue-600 transition-colors">{e}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Documentation</h4>
            <div className="space-y-2">
              {docsCols.flat().map(d => (
                <a key={d} href="#" className="block text-sm text-gray-500 hover:text-blue-600 transition-colors">{d}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Company</h4>
            <div className="space-y-2">
              {companyCols.flat().map(c => (
                <a key={c} href="#" className="block text-sm text-gray-500 hover:text-blue-600 transition-colors">{c}</a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center">
              <Cpu className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-900">Algo IQ Ecosystem</span>
          </div>
          <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} Algo IQ. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {[Globe, Code, ExternalLink].map((Icon, i) => (
              <a key={i} href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// -- Main Page --

export default function HomePage() {
  return (
    <div className="h-full overflow-y-auto bg-white">
      <NavBar />
      <main>
        <Hero />
        <ArchitectureSection />
        <EngineShowcase />
        <ProductDirectory />
        <AIAssistant />
        <FAQSection />
        <ConnectivitySection />
        <LoginCTA />
      </main>
      <Footer />
    </div>
  );
}
