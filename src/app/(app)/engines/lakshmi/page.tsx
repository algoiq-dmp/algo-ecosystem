'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  FiServer, FiCpu, FiActivity, FiShield, FiDatabase,
  FiArrowRight, FiClock, FiRefreshCw, FiZap, FiInfo,
  FiExternalLink, FiChevronRight, FiChevronDown, FiSearch,
  FiCheck, FiAlertCircle, FiBarChart2, FiTrendingUp, FiTarget,
  FiRadio, FiWifi, FiUsers, FiLayers, FiBox, FiCpu as FiProcessor,
  FiPieChart, FiGitBranch, FiGrid, FiMessageCircle, FiSend,
  FiPlay, FiPause, FiCode, FiTool, FiSettings, FiHash,
  FiHardDrive, FiMonitor,
} from 'react-icons/fi';

function AnimatedCounter({ value, suffix = '', duration = 2 }: { value: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const increment = value / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardHover = {
  rest: { scale: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  hover: { scale: 1.02, boxShadow: '0 10px 40px rgba(37,99,235,0.15)' },
};

export default function LakshmiPage() {
  const [expandedComponent, setExpandedComponent] = useState<string | null>(null);
  const [aiView, setAiView] = useState<string | null>(null);

  const scrollRef = useRef(null);

  const responsibilities = [
    'Exchange Broadcast Ingestion',
    'Tick Decoding',
    'Price Normalization',
    'Topic Management',
    'Message Routing',
    'Real-Time Streaming',
    'WebSocket Broadcasting',
    'Queue Management',
    'Subscriber Tracking',
    'Monitoring',
    'Analytics',
    'Retry Engine',
  ];

  const components = [
    { name: 'Publisher', desc: 'Receives raw market data from upstream sources and pushes to internal message queues.' },
    { name: 'Consumer', desc: 'Subscribes to topics and streams data to downstream engines and applications.' },
    { name: 'Topic Manager', desc: 'Manages dynamic topic creation, partitioning, and lifecycle across the streaming layer.' },
    { name: 'Queue Manager', desc: 'Handles message buffering, backpressure, and guaranteed delivery across distributed queues.' },
    { name: 'Message Router', desc: 'Routes messages to appropriate subscribers based on topic subscriptions and routing rules.' },
    { name: 'Cache', desc: 'In-memory caching layer using Redis for high-speed data access and state management.' },
    { name: 'Monitoring', desc: 'Real-time monitoring of throughput, latency, and system health across all components.' },
    { name: 'Analytics', desc: 'Aggregates streaming metrics for dashboards, alerts, and operational intelligence.' },
    { name: 'Retry Engine', desc: 'Automatic retry with exponential backoff for failed message deliveries.' },
    { name: 'Security', desc: 'Authentication, authorization, and encryption for all data-in-transit within the platform.' },
  ];

  const dependencies = [
    { name: 'Ganesh', status: 'Connected', icon: FiRadio },
    { name: 'Narad', status: 'Connected', icon: FiMessageCircle },
    { name: 'Redis', status: 'Connected', icon: FiDatabase },
    { name: 'PostgreSQL', status: 'Connected', icon: FiHardDrive },
    { name: 'Config Service', status: 'Connected', icon: FiSettings },
    { name: 'Authentication', status: 'Connected', icon: FiShield },
  ];

  const healthItems = [
    { label: 'Engine', status: 'Healthy', color: 'bg-green-500' },
    { label: 'CPU', status: 'Normal', color: 'bg-green-500' },
    { label: 'RAM', status: 'Normal', color: 'bg-green-500' },
    { label: 'Queue', status: 'Normal', color: 'bg-green-500' },
    { label: 'API', status: 'Operational', color: 'bg-green-500' },
    { label: 'Database', status: 'Connected', color: 'bg-green-500' },
    { label: 'WebSocket', status: 'Active', color: 'bg-green-500' },
  ];

  const overviewCards = [
    { title: 'Purpose', icon: FiTarget, content: 'Lakshmi serves as the central data distribution hub, ingesting raw market ticks from exchanges via Ganesh and broadcasting them in real-time to every engine, product, and web application in the ecosystem.' },
    { title: 'Business Importance', icon: FiTrendingUp, content: 'Without Lakshmi, real-time market data would not reach strategy engines, risk systems, or trading dashboards — making it the single most critical infrastructure component for live trading operations.' },
    { title: 'Technical Role', icon: FiCpu, content: 'Acts as a high-throughput message broker and real-time streaming engine, handling 350,000+ messages per second with sub-2ms average latency over persistent WebSocket and MQ connections.' },
    { title: 'Connected Engines', icon: FiGrid, content: 'Ganesh, All Signal Generators (TalkOptions, Delta XI, VYUH), Kuber Alpha, Kavach, Rakshak, Chitragupta, TalkDelta, Suchak, Manthan' },
    { title: 'Input Sources', icon: FiArrowRight, content: 'Exchange (via Feed Server), Ganesh (OHLC + Technical Data), Surya (Configuration), Market Data Feeds' },
    { title: 'Output Destinations', icon: FiSend, content: 'All Engines, All Products (TalkOptions, DXCC, etc.), All Web Projects (Dashboards, Admin Panels), External Subscribers' },
    { title: 'APIs Used', icon: FiCode, content: 'MQ (Message Queue), WebSocket (Real-Time), REST (Configuration & Management), gRPC (Internal Services)' },
    { title: 'Throughput', icon: FiZap, content: '350,000 messages per second sustained. Supports burst capacity up to 500,000 msg/sec with automatic backpressure handling.' },
    { title: 'Latency', icon: FiClock, content: '2ms average end-to-end latency from ingestion to subscriber delivery. P99 latency under 5ms during peak load.' },
    { title: 'Version', icon: FiHash, content: 'v2.1.0 — Production stable. Deployed across all environments with automated CI/CD pipeline.' },
  ];

  const journeySteps = [
    { label: 'Market Tick', desc: 'Raw tick data arrives from exchange feed servers' },
    { label: 'Receive', desc: 'Lakshmi Publisher ingests data via MQ' },
    { label: 'Validate', desc: 'Tick decoding and price normalization' },
    { label: 'Publish', desc: 'Message published to internal topic queue' },
    { label: 'Topic Routing', desc: 'Topic Manager routes to appropriate channels' },
    { label: 'Subscribers', desc: 'Streaming Engine pushes to all subscribers' },
    { label: 'AI Engines', desc: 'Signal generators consume real-time data' },
    { label: 'Execution', desc: 'Vega receives signals for order execution' },
  ];

  const aiExplanations: Record<string, string> = {
    simple: 'Lakshmi is like the central nervous system of the trading platform. Think of it as a super-fast postal service that receives stock market prices from the exchange and instantly delivers them to every engine and application that needs them — all within 2 milliseconds. Without Lakshmi, none of the trading strategies would know what the market is doing right now.',
    technical: 'Lakshmi implements a publisher-subscriber pattern over MQ and WebSocket protocols with a throughput of 350,000 messages per second at 2ms average latency. It handles tick decoding, price normalization, topic-based routing, queue management with backpressure, and guaranteed delivery. Built on a distributed architecture with Redis caching and PostgreSQL persistence, it supports dynamic topic creation and automatic subscriber tracking with retry logic for failed deliveries.',
    architecture: 'Lakshmi sits at Layer 2 of the ecosystem: Exchange → Feed Server → Ganesh → Lakshmi (Data Distribution) → Surya → Strategy Builder → Vega. It uses a multi-layered internal architecture: Publisher → Topic Manager → Queue Manager → Streaming Engine → Subscriber Manager → Monitoring → Analytics. Communication uses MQ for internal messaging, WebSocket for real-time client streaming, and REST for configuration.',
  };

  return (
    <div className="min-h-screen bg-white" ref={scrollRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">

        {/* SECTION 1: Hero Header */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="pt-8 pb-4"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
              <FiRadio className="text-2xl text-[#2563EB]" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Lakshmi Engine</h1>
              <p className="text-lg text-gray-500 mt-1">Enterprise Real-Time Data Distribution Platform</p>
            </div>
          </div>
          <p className="text-xl text-gray-600 font-medium mb-2">Live Market Data. Real-Time Distribution. Enterprise Scale.</p>
          <p className="text-gray-500 max-w-3xl mb-6 leading-relaxed">
            Lakshmi is the high-throughput backbone of the Algo IQ ecosystem, ingesting millions of market ticks per second
            and distributing them with sub-millisecond precision to every connected engine, strategy, and dashboard.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#2563EB] rounded-full text-sm font-semibold">
              <FiHash /> v2.1.0
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Production
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-semibold">
              <FiZap /> 350K msg/sec
            </span>
          </div>
        </motion.section>

        {/* SECTION 2: Ecosystem Position Diagram */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeUp}
          className="bg-[#F8FAFC] rounded-2xl p-6 md:p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <FiGitBranch className="text-[#2563EB]" /> Ecosystem Position
          </h2>
          <div className="overflow-x-auto">
            <svg viewBox="0 0 900 160" className="w-full max-w-4xl mx-auto" style={{ minWidth: '700px' }}>
              <defs>
                <filter id="glow-lakshmi">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              {/* Exchange */}
              <rect x="20" y="55" width="110" height="50" rx="12" fill="#EFF6FF" stroke="#2563EB" strokeWidth="1.5" />
              <text x="75" y="85" textAnchor="middle" fill="#1E3A5F" fontSize="14" fontWeight="600" fontFamily="system-ui">Exchange</text>
              {/* Arrow */}
              <line x1="130" y1="80" x2="180" y2="80" stroke="#94A3B8" strokeWidth="2" markerEnd="url(#arrowGray)" />
              {/* Ganesh */}
              <rect x="185" y="55" width="110" height="50" rx="12" fill="#F0FDF4" stroke="#16A34A" strokeWidth="1.5" />
              <text x="240" y="85" textAnchor="middle" fill="#166534" fontSize="14" fontWeight="600" fontFamily="system-ui">Ganesh</text>
              {/* Arrow */}
              <line x1="295" y1="80" x2="345" y2="80" stroke="#94A3B8" strokeWidth="2" markerEnd="url(#arrowGray)" />
              {/* Lakshmi - Glowing */}
              <motion.rect
                x="350" y="50" width="130" height="60" rx="14"
                fill="#2563EB" filter="url(#glow-lakshmi)"
                animate={{ opacity: [1, 0.85, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <text x="415" y="85" textAnchor="middle" fill="#FFFFFF" fontSize="15" fontWeight="700" fontFamily="system-ui">Lakshmi</text>
              {/* Arrow */}
              <line x1="480" y1="80" x2="530" y2="80" stroke="#94A3B8" strokeWidth="2" markerEnd="url(#arrowGray)" />
              {/* Surya */}
              <rect x="535" y="55" width="100" height="50" rx="12" fill="#FFF7ED" stroke="#EA580C" strokeWidth="1.5" />
              <text x="585" y="85" textAnchor="middle" fill="#9A3412" fontSize="14" fontWeight="600" fontFamily="system-ui">Surya</text>
              {/* Arrow */}
              <line x1="635" y1="80" x2="685" y2="80" stroke="#94A3B8" strokeWidth="2" markerEnd="url(#arrowGray)" />
              {/* Strategy Builder */}
              <rect x="690" y="55" width="130" height="50" rx="12" fill="#F5F3FF" stroke="#7C3AED" strokeWidth="1.5" />
              <text x="755" y="85" textAnchor="middle" fill="#5B21B6" fontSize="13" fontWeight="600" fontFamily="system-ui">Strategy Builder</text>
              {/* Arrow */}
              <line x1="820" y1="80" x2="860" y2="80" stroke="#94A3B8" strokeWidth="2" markerEnd="url(#arrowGray)" />
              {/* Vega */}
              <rect x="800" y="55" width="80" height="50" rx="12" fill="#FEF2F2" stroke="#DC2626" strokeWidth="1.5" />
              <text x="840" y="85" textAnchor="middle" fill="#991B1B" fontSize="14" fontWeight="600" fontFamily="system-ui">Vega</text>

              {/* Pulse on Lakshmi */}
              <motion.circle
                cx="415" cy="75" r="10" fill="none" stroke="#F59E0B" strokeWidth="3"
                initial={{ r: 5, opacity: 1 }}
                animate={{ r: 40, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, ease: [0.25, 0.1, 0.25, 1] }}
              />

              <defs>
                <marker id="arrowGray" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#94A3B8" />
                </marker>
              </defs>
            </svg>
          </div>
        </motion.section>

        {/* SECTION 3: Interactive Overview Cards */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <FiLayers className="text-[#2563EB]" /> Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {overviewCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial="rest"
                whileHover="hover"
                variants={cardHover}
                className="bg-[#F8FAFC] border border-gray-200 rounded-2xl p-5 cursor-default transition-colors hover:border-[#2563EB]/30"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <card.icon className="text-[#2563EB]" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{card.title}</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{card.content}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* SECTION 4: Engine Journey Animation */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeUp}
          className="bg-[#F8FAFC] rounded-2xl p-6 md:p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <FiRefreshCw className="text-[#2563EB]" /> Engine Journey
          </h2>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#2563EB]/20 hidden md:block" />
            <div className="space-y-6">
              {journeySteps.map((step, i) => {
                const StepIcon = i === 0 ? FiRadio : i === 1 ? FiArrowRight : i === 2 ? FiCheck : i === 3 ? FiSend : i === 4 ? FiGitBranch : i === 5 ? FiUsers : i === 6 ? FiCpu : FiTarget;
                return (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="flex items-start gap-4 md:gap-6 relative"
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2 ${i === 0 ? 'bg-[#2563EB] border-[#2563EB] text-white' : i === journeySteps.length - 1 ? 'bg-red-50 border-red-400 text-red-600' : 'bg-white border-[#2563EB]/40 text-[#2563EB]'}`}>
                      <StepIcon />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl p-4 flex-1 shadow-sm">
                      <h4 className="font-semibold text-gray-900">{step.label}</h4>
                      <p className="text-sm text-gray-500 mt-1">{step.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* SECTION 5: Internal Architecture */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeUp}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <FiBox className="text-[#2563EB]" /> Internal Architecture
          </h2>
          <div className="bg-[#F8FAFC] rounded-2xl p-6 md:p-8 overflow-x-auto">
            <svg viewBox="0 0 1000 320" className="w-full max-w-5xl mx-auto" style={{ minWidth: '800px' }}>
              {[
                { x: 20, y: 40, w: 130, h: 50, label: 'Publisher', color: '#2563EB' },
                { x: 180, y: 40, w: 140, h: 50, label: 'Topic Manager', color: '#7C3AED' },
                { x: 350, y: 40, w: 140, h: 50, label: 'Queue Manager', color: '#EA580C' },
                { x: 520, y: 40, w: 140, h: 50, label: 'Streaming Engine', color: '#16A34A' },
                { x: 690, y: 40, w: 150, h: 50, label: 'Subscriber Manager', color: '#DC2626' },
                { x: 350, y: 130, w: 140, h: 50, label: 'Monitoring', color: '#0891B2' },
                { x: 520, y: 130, w: 140, h: 50, label: 'Analytics', color: '#D97706' },
              ].map((block, i) => (
                <g key={block.label} className="cursor-pointer" onClick={() => alert(`${block.label}: Manages data flow and operational tasks within the Lakshmi engine.`)}>
                  <rect x={block.x} y={block.y} width={block.w} height={block.h} rx="12" fill={block.color + '10'} stroke={block.color} strokeWidth="1.5" />
                  <text x={block.x + block.w / 2} y={block.y + block.h / 2 + 1} textAnchor="middle" fill={block.color} fontSize="13" fontWeight="600" fontFamily="system-ui" dominantBaseline="middle">{block.label}</text>
                </g>
              ))}
              {/* Arrows */}
              <line x1="150" y1="65" x2="180" y2="65" stroke="#CBD5E1" strokeWidth="2" markerEnd="url(#arrowSlate)" />
              <line x1="320" y1="65" x2="350" y2="65" stroke="#CBD5E1" strokeWidth="2" markerEnd="url(#arrowSlate)" />
              <line x1="490" y1="65" x2="520" y2="65" stroke="#CBD5E1" strokeWidth="2" markerEnd="url(#arrowSlate)" />
              <line x1="660" y1="65" x2="690" y2="65" stroke="#CBD5E1" strokeWidth="2" markerEnd="url(#arrowSlate)" />
              {/* Down arrows */}
              <line x1="420" y1="90" x2="420" y2="130" stroke="#CBD5E1" strokeWidth="2" markerEnd="url(#arrowSlate)" />
              <line x1="590" y1="90" x2="590" y2="130" stroke="#CBD5E1" strokeWidth="2" markerEnd="url(#arrowSlate)" />
              <defs>
                <marker id="arrowSlate" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#CBD5E1" />
                </marker>
              </defs>
            </svg>
            <p className="text-center text-sm text-gray-400 mt-4">Click any component to view details</p>
          </div>
        </motion.section>

        {/* SECTION 6: Responsibilities Dashboard */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <FiCheck className="text-[#2563EB]" /> Responsibilities Dashboard
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {responsibilities.map((resp, i) => (
              <motion.div
                key={resp}
                variants={fadeUp}
                className="flex items-center gap-3 bg-[#F8FAFC] border border-gray-200 rounded-2xl p-4 hover:border-[#2563EB]/30 transition-colors cursor-default"
              >
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <FiCheck className="text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">{resp}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* SECTION 7: Inputs & Outputs */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeUp}
          className="bg-[#F8FAFC] rounded-2xl p-6 md:p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <FiArrowRight className="text-[#2563EB]" /> Inputs & Outputs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-blue-50 border border-blue-200 rounded-2xl p-5"
            >
              <h3 className="font-semibold text-[#2563EB] mb-3 flex items-center gap-2"><FiArrowRight className="rotate-180" /> INPUTS</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#2563EB]" /> Market Data</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#2563EB]" /> Strategy Signals</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#2563EB]" /> Configurations</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#2563EB]" /> API Requests</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center py-6"
            >
              <div className="w-16 h-16 rounded-full bg-[#2563EB]/10 flex items-center justify-center mb-2">
                <FiSettings className="text-2xl text-[#2563EB] animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <span className="text-sm font-semibold text-[#2563EB]">PROCESS</span>
              <span className="text-xs text-gray-400 mt-1">2ms Latency</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-green-50 border border-green-200 rounded-2xl p-5"
            >
              <h3 className="font-semibold text-green-700 mb-3 flex items-center gap-2"><FiArrowRight /> OUTPUTS</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-600" /> Orders</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-600" /> Messages</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-600" /> Topics</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-600" /> Reports</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-600" /> Notifications</li>
              </ul>
            </motion.div>
          </div>
        </motion.section>

        {/* SECTION 8: Performance Dashboard */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <FiBarChart2 className="text-[#2563EB]" /> Performance Dashboard
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { label: 'Latency', value: 2, suffix: 'ms', icon: FiClock, color: 'bg-green-50 text-green-700 border-green-200' },
              { label: 'Topics', value: 245, suffix: '', icon: FiHash, color: 'bg-blue-50 text-blue-700 border-blue-200' },
              { label: 'Subscribers', value: 34, suffix: '', icon: FiUsers, color: 'bg-purple-50 text-purple-700 border-purple-200' },
              { label: 'Messages/sec', value: 350000, suffix: '', icon: FiZap, color: 'bg-amber-50 text-amber-700 border-amber-200' },
              { label: 'Queue Length', value: 12, suffix: '', icon: FiLayers, color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
              { label: 'Memory', value: 42, suffix: '%', icon: FiHardDrive, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
              { label: 'CPU', value: 28, suffix: '%', icon: FiCpu, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
              { label: 'Connections', value: 120, suffix: '', icon: FiWifi, color: 'bg-rose-50 text-rose-700 border-rose-200' },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial="rest"
                whileHover="hover"
                variants={cardHover}
                className={`${stat.color} border rounded-2xl p-5`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className="opacity-70" />
                  <span className="text-xs font-medium uppercase tracking-wider opacity-70">{stat.label}</span>
                </div>
                <span className="text-2xl font-bold">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* SECTION 9: Health Dashboard */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeUp}
          className="bg-[#F8FAFC] rounded-2xl p-6 md:p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <FiActivity className="text-[#2563EB]" /> Health Dashboard
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {healthItems.map((item) => (
              <motion.div
                key={item.label}
                whileHover={{ scale: 1.03 }}
                className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3"
              >
                <span className={`w-3 h-3 rounded-full ${item.color} flex-shrink-0`} />
                <div>
                  <p className="text-xs text-gray-400 font-medium">{item.label}</p>
                  <p className="text-sm font-semibold text-gray-800">{item.status}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* SECTION 10: Component Explorer */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeUp}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <FiBox className="text-[#2563EB]" /> Component Explorer
          </h2>
          <div className="space-y-2">
            {components.map((comp) => (
              <motion.div
                key={comp.name}
                whileHover={{ scale: 1.005 }}
                className={`bg-white border rounded-2xl overflow-hidden transition-colors ${expandedComponent === comp.name ? 'border-[#2563EB] shadow-lg shadow-blue-100' : 'border-gray-200'}`}
              >
                <button
                  onClick={() => setExpandedComponent(expandedComponent === comp.name ? null : comp.name)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="font-semibold text-gray-800">{comp.name}</span>
                  <motion.span
                    animate={{ rotate: expandedComponent === comp.name ? 180 : 0 }}
                    className="text-gray-400"
                  >
                    <FiChevronDown />
                  </motion.span>
                </button>
                <AnimatePresence>
                  {expandedComponent === comp.name && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 text-sm text-gray-600 border-t border-gray-100 pt-3">
                        {comp.desc}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* SECTION 11: Dependency Explorer */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeUp}
          className="bg-[#F8FAFC] rounded-2xl p-6 md:p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <FiGitBranch className="text-[#2563EB]" /> Dependency Explorer
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {dependencies.map((dep) => (
              <motion.div
                key={dep.name}
                whileHover={{ scale: 1.02 }}
                className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <dep.icon className="text-[#2563EB]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{dep.name}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <FiCheck className="text-green-500 text-xs" />
                    <span className="text-xs text-green-600 font-medium">{dep.status}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* SECTION 12: AI Explanation */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeUp}
          className="bg-[#F8FAFC] rounded-2xl p-6 md:p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <FiCpu className="text-[#2563EB]" /> AI Explanation
          </h2>
          <div className="flex flex-wrap gap-3 mb-6">
            {[
              { key: 'simple', label: 'Explain Simply', icon: FiInfo },
              { key: 'technical', label: 'Technical Deep Dive', icon: FiCode },
              { key: 'architecture', label: 'Architecture View', icon: FiLayers },
            ].map((btn) => (
              <motion.button
                key={btn.key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAiView(aiView === btn.key ? null : btn.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${aiView === btn.key ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-200' : 'bg-white border border-gray-200 text-gray-700 hover:border-[#2563EB]/40'}`}
              >
                <btn.icon /> {btn.label}
              </motion.button>
            ))}
          </div>
          <AnimatePresence>
            {aiView && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="overflow-hidden"
              >
                <div className="bg-white border border-[#2563EB]/20 rounded-2xl p-6 text-gray-700 leading-relaxed">
                  {aiExplanations[aiView]}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Bottom spacer */}
        <div className="h-8" />
      </div>
    </div>
  );
}
