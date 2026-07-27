'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiZap, FiCpu } from 'react-icons/fi';
import { nodes, connections, serverGroups, connectionTypeColors } from '@/data/ecosystem';
import type { EcosystemNode } from '@/types';

export default function AskAI({ compact }: { compact?: boolean }) {

interface AIResponse {
  executiveSummary: string;
  bulletPoints: string[];
  relatedProducts: string[];
  relatedEngines: string[];
  followUpQuestions: string[];
}

const SUGGESTED_QUESTIONS = [
  'What is Lakshmi Engine?',
  'How does Vega execute orders?',
  'What is the 5-layer architecture?',
  'How does the kill switch work?',
  "What is Surya's role?",
  'How are strategies deployed?',
];

function generateEngineResponse(node: EcosystemNode): AIResponse {
  const name = node.alias ? `${node.name} (${node.alias})` : node.name;
  const typeLabel = node.type.charAt(0).toUpperCase() + node.type.slice(1);
  const relatedProducts = (node.connectedApplications || [])
    .filter((a) => a !== node.name)
    .slice(0, 6);
  const relatedEngines = (node.connectedEngines || []).slice(0, 5);

  return {
    executiveSummary: `${node.name} is a ${typeLabel} running on ${node.server} (${node.ip}). ${node.purpose}`,
    bulletPoints: [
      `Purpose: ${node.purpose}`,
      `Business Value: ${node.businessValue}`,
      `Inputs: ${(node.inputs || []).join(', ') || 'N/A'}`,
      `Outputs: ${(node.outputs || []).join(', ') || 'N/A'}`,
      `Connected Engines: ${node.connectedEngines.length > 0 ? node.connectedEngines.join(', ') : 'None directly'}`,
      `Failure Impact: ${node.failureImpact}`,
    ],
    relatedProducts,
    relatedEngines,
    followUpQuestions: [
      `What are the key features of ${node.name}?`,
      `What happens if ${node.name} goes down?`,
      `How does ${node.name} communicate with other components?`,
      `Which server hosts ${node.name}?`,
      `What are ${node.name}'s responsibilities?`,
    ],
  };
}

function generateTopologyResponse(_q: string): AIResponse {
  const connectivityNodes = nodes.filter((n) => n.id === 'narad' || n.id === 'suraksha');
  const totalConnections = connections.length;
  const serverNames = serverGroups.map((s) => s.name).join(', ');
  const engineCount = nodes.filter((n) => n.type === 'engine').length;
  const productCount = nodes.filter((n) => n.type === 'product').length;

  return {
    executiveSummary: `The Algo IQ Ecosystem topology connects ${nodes.length} components across ${serverGroups.length} servers (${serverNames}) via ${totalConnections} connections. Narad serves as the connectivity backbone while Suraksha provides the security layer.`,
    bulletPoints: [
      `Connectivity Backbone: Narad (Connector Hub) provides low-latency communication between all components with service registry, tunnel management, port registry, deployment orchestration, and version tracking`,
      `Security Layer: Suraksha provides authentication, authorization, encryption, RBAC, secrets vault, certificate authority, threat detection, and audit logging across all components`,
      `Server Distribution: 5 servers — ALGO IQ 20, ALGO IQ 18, ALGO IQ 6, ALGO IQ 4, and ALGO IQ 19 — each hosting specific components`,
      `Total Components: ${nodes.length} total (${engineCount} engines, ${productCount} products, plus APIs, infrastructure, and strategies)`,
      `Communication Protocols: The ecosystem uses MQ (${connections.filter((c) => c.protocol === 'MQ').length} connections), TCP (${connections.filter((c) => c.protocol === 'TCP').length}), REST (${connections.filter((c) => c.protocol === 'REST').length}), FIX, and WebSocket`,
      `Data Flow: Exchange feeds in through Feed Server → MQ distributes → Ganesh computes OHLC → Engines consume → Vega executes to broker`,
      `Monitoring: Narad and Parikshak connect to every component for health monitoring, testing, and certification`,
      `High Availability: Critical components (Ganesh, Lakshmi, Surya, Vega) have redundancy built in with alternate MQ and multiple connectivity paths`,
    ],
    relatedProducts: ['Narad', 'Suraksha', 'MQ', 'Local WebSocket', 'Feed Server'],
    relatedEngines: ['Lakshmi', 'Vega', 'Kuber Alpha'],
    followUpQuestions: [
      'What is Narad and how does it connect components?',
      'How does Suraksha secure the ecosystem?',
      'What protocols are used for communication?',
      'How does data flow from exchange to execution?',
      'Which are the most connected components?',
    ],
  };
}

function generateServerResponse(_q: string): AIResponse {
  return {
    executiveSummary: `The Algo IQ Ecosystem runs across 5 dedicated servers. Each server hosts specific components designed for their role in the architecture — from core data ingestion on ALGO IQ 18 to execution on ALGO IQ 6 to strategy management on ALGO IQ 4.`,
    bulletPoints: serverGroups.map((sg) => {
      const serverNodes = nodes.filter((n) => n.server === sg.name);
      const criticalNodes = serverNodes.filter((n) => n.criticality === 'critical');
      return `${sg.name} (${sg.ip}): Hosts ${serverNodes.length} components — ${serverNodes.map((n) => n.name).join(', ')}${criticalNodes.length > 0 ? `. Critical: ${criticalNodes.map((c) => c.name).join(', ')}` : ''}`;
    }),
    relatedProducts: serverGroups.flatMap((sg) =>
      nodes.filter((n) => n.server === sg.name && n.type === 'product').map((n) => n.name)
    ).slice(0, 8),
    relatedEngines: serverGroups.flatMap((sg) =>
      nodes.filter((n) => n.server === sg.name && n.type === 'engine').map((n) => n.name)
    ).slice(0, 8),
    followUpQuestions: [
      'What runs on ALGO IQ 18?',
      'What runs on ALGO IQ 6?',
      'What runs on ALGO IQ 4?',
      'Which server hosts the execution engines?',
      'How are servers connected to each other?',
    ],
  };
}

function generateConnectionResponse(_q: string): AIResponse {
  const protocolCounts: Record<string, number> = {};
  const typeCounts: Record<string, number> = {};
  connections.forEach((c) => {
    protocolCounts[c.protocol] = (protocolCounts[c.protocol] || 0) + 1;
    typeCounts[c.type] = (typeCounts[c.type] || 0) + 1;
  });

  const getNodeName = (id: string) => nodes.find((n) => n.id === id)?.name || id;
  const sampleConnections = connections.slice(0, 5).map(
    (c) => `${getNodeName(c.source)} → ${getNodeName(c.target)} (${c.protocol}, ${c.type})`
  );

  return {
    executiveSummary: `The ecosystem has ${connections.length} defined connections using multiple protocols and connection types. Data flows from Exchange ingestion through Lakshmi's real-time pipeline, to analytics and signal generation, and finally to Vega for order execution.`,
    bulletPoints: [
      `Total Connections: ${connections.length} across all components`,
      `Protocol Distribution: ${Object.entries(protocolCounts).map(([k, v]) => `${k}=${v}`).join(', ')}`,
      `Connection Types: ${Object.entries(typeCounts).map(([k, v]) => `${k}=${v}`).join(', ')} — color coded across the topology (market-data=Blue, risk=Red, signal=Yellow, etc.)`,
      `Core Data Flow: Exchange → Feed Server → MQ → Ganesh (OHLC) → Engines (Suchak, Delta XI, VYUH, etc.) → Kuber Alpha → TalkStrategy API → Vega → Broker`,
      `Real-time Pipeline: Lakshmi Engine (MQ + Local WebSocket) distributes live prices to all in-network components via pub/sub`,
      `Security & Connectivity: Narad (TCP monitoring) and Suraksha (TCP security) connect to every component for observability and protection`,
      `Signal Generation Path: Market screeners (Delta XI, VYUH, SpreadWatch) + strategies (AALAP Calls) + AI (TalkDelta AI) → Kuber Alpha → execution`,
      `Risk Flow: Kavach (delta monitoring) → Rakshak (hedge protection) → Vega (protective orders) — continuous risk management loop`,
    ],
    relatedProducts: ['Ganesh', 'TalkDelta', 'TalkOffice', 'DXCC', 'Strategy Factory', 'TalkOptions'],
    relatedEngines: ['Lakshmi', 'Vega', 'Kuber Alpha', 'Kavach', 'Rakshak', 'Suchak'],
    followUpQuestions: [
      'How does MQ distribute real-time data?',
      'What is the execution path from strategy to broker?',
      'How does the kill switch data flow work?',
      'What connection types are used for monitoring?',
      'How does the risk management data flow?',
    ],
  };
}

function generateArchitectureResponse(): AIResponse {
  const layers = [
    {
      layer: 'Layer 1 - Core Data',
      description: 'Exchange ingestion, OHLC, file distribution, options analytics',
      components: ['Ganesh (OHLC)', 'Lakshmi (Live Price)', 'Surya (Exchange Files)', 'Feed Server', 'MQ', 'Local WebSocket', 'TalkOptions', 'Garuda'],
    },
    {
      layer: 'Layer 2 - Opportunity Generation',
      description: 'Market screening, stock analytics, spread detection, AI signals, strategy signals',
      components: ['Delta XI (Screeners)', 'VYUH (Stock Analytics)', 'SpreadWatch', 'TalkDelta AI', 'AALAP Calls (15 strategies)', 'Suchak (Technical Indicators)'],
    },
    {
      layer: 'Layer 3 - Strategy Hub',
      description: 'Strategy orchestration, signal aggregation, capital allocation, Layer 1 Kill Switch',
      components: ['Kuber Alpha (Strategy Hub + 1.01% KS)'],
    },
    {
      layer: 'Layer 4 - Order Execution',
      description: 'Complete order lifecycle, broker integration, Layer 3 Kill Switch',
      components: ['Vega (Execution + 1.50% KS)', 'TalkStrategy API', 'TalkStrategy App', 'Hanuman', 'ODIN', 'Broker APIs'],
    },
    {
      layer: 'Layer 5 - Trade Governance',
      description: 'Operational visibility, Layer 2 Kill Switch, audit, compliance',
      components: ['DXCC (Governance + 1.05% KS)', 'Chitragupta (Audit)', 'TalkOffice (RMS/OMS)', 'Kavach (Risk)', 'Rakshak (Hedge Protection)'],
    },
  ];

  return {
    executiveSummary: `The Algo IQ Ecosystem follows a 5-layer architecture — from Core Data ingestion through Opportunity Generation, Strategy Orchestration, Order Execution, to Trade Governance. Each layer builds on the one below it, with Narad and Suraksha providing cross-cutting connectivity and security.`,
    bulletPoints: layers.map(
      (l) => `${l.layer}: ${l.description}. Key components: ${l.components.join(', ')}`
    ),
    relatedProducts: ['Ganesh', 'TalkOptions', 'TalkDelta', 'DXCC', 'TalkOffice', 'Strategy Factory'],
    relatedEngines: ['Lakshmi', 'Kuber Alpha', 'Vega', 'Kavach', 'Rakshak', 'Suchak'],
    followUpQuestions: [
      'What is Layer 1 - Core Data responsible for?',
      'How does Layer 3 - Strategy Hub work?',
      'What is the role of Layer 5 - Trade Governance?',
      'How do the layers interact with each other?',
      'Which components are cross-cutting across all layers?',
    ],
  };
}

function generateKillSwitchResponse(): AIResponse {
  return {
    executiveSummary: `The Algo IQ Ecosystem implements a 3-layer kill switch architecture for progressive risk protection. Each layer operates independently at different margin thresholds — Layer 1 at 1.01%, Layer 2 at 1.05%, and Layer 3 at 1.50% — ensuring no single point of failure in emergency scenarios.`,
    bulletPoints: [
      `Layer 1 - Kuber Alpha (1.01% margin): Strategy-level protection. Monitors strategy P&L and portfolio risk against allocated margin. Auto square-off upon breach, generates early warning signals, notifies DXCC and Vega. If Kuber Alpha fails, Layer 2 takes over.`,
      `Layer 2 - DXCC (1.05% margin): Independent supervisory governance layer. Operates above strategy execution with full ecosystem visibility. Verifies risk conditions independently, issues production kill commands to Kuber Alpha and Vega, records full audit trail for compliance.`,
      `Layer 3 - Vega (1.50% margin): Final execution safeguard at the broker level. Immediately cancels all pending orders, submits square-off orders for open positions, and continues liquidation loop until all positions are closed. Publishes emergency execution events to TalkDelta and DXCC.`,
      `Progressive Protection: If any layer fails, the next layer provides backup — Layer 1 failure → Layer 2 governs → Layer 3 executes. Triple redundancy ensures no single failure leaves the ecosystem unprotected.`,
      `Audit Trail: Every kill switch activation is logged through Chitragupta (audit engine) with full event recording, compliance reports, and regulatory documentation across all three layers.`,
      `Risk Monitoring Loop: Kavach (delta neutral engine) continuously monitors delta/gamma/theta → Rakshak (hedge protection) provides tail risk and gap risk analysis → All three kill switch layers receive risk broadcast for independent evaluation.`,
      `Emergency Communication: On kill switch activation, all three layers communicate through MQ broadcast to ensure DXCC (operators), TalkDelta (dashboard), and Chitragupta (audit) are immediately notified.`,
      `Independent Operation: Each layer operates on its own infrastructure — Kuber Alpha on ALGO IQ 4, DXCC on ALGO IQ 6, Vega on ALGO IQ 6 — ensuring physical server isolation for kill switch reliability.`,
    ],
    relatedProducts: ['TalkDelta', 'DXCC', 'TalkOffice'],
    relatedEngines: ['Kuber Alpha', 'Vega', 'Kavach', 'Rakshak', 'Chitragupta'],
    followUpQuestions: [
      'What happens when Kuber Alpha kill switch triggers?',
      'How does the Vega Layer 3 kill switch execute?',
      'What is the difference between the three kill switch layers?',
      'How does DXCC governance work?',
      'What audit trail exists for kill switch events?',
    ],
  };
}

function generateStrategyLifecycleResponse(): AIResponse {
  return {
    executiveSummary: `Strategies in the Algo IQ Ecosystem follow a 5-phase lifecycle: Build → Test → Simulate → Deploy → Govern. Strategies are created in Strategy Factory, validated by Parikshak, simulated in Simulator, deployed through Kuber Alpha, and governed by DXCC with TradePilot ensuring SEBI compliance.`,
    bulletPoints: [
      `Phase 1 - Build (Strategy Factory): Create modular strategies using visual builder, define rules, set parameters, and prepare deployment packages. Connected to TradePilot for client approval and SEBI/exchange compliance verification before testing.`,
      `Phase 2 - Test (Parikshak): Universal testing engine certifies every strategy with regression testing, performance testing, security assessment, UAT coordination, and release readiness scoring. Generates automated test reports, checklists, and certification.`,
      `Phase 3 - Simulate (Simulator): Historical backtesting platform that fetches minute-to-minute trades from TalkDelta API, minute OHLC from Ganesh, live market data via MQ, and feed data through Lakshmi. Produces comprehensive simulation and performance reports.`,
      `Phase 4 - Deploy (Kuber Alpha): Central strategy hub receives tested/simulated strategies from Strategy Factory. Activates strategies based on incoming opportunity signals from AALAP Calls, Delta XI, VYUH, SpreadWatch, and TalkDelta AI. Allocates capital and dispatches execution to Vega.`,
      `Phase 5 - Govern (DXCC): Trade governance layer controls strategy go-live approval, manages Kuber Alpha environment, monitors strategy health, and provides Layer 2 Kill Switch at 1.05% margin. Records all governance events for audit compliance.`,
      `Compliance Gate (TradePilot): Before any strategy enters the lifecycle, TradePilot ensures SEBI and exchange regulatory compliance — client onboarding, KYC verification, strategy approval workflow, and governance audit trail. No strategy deploys without TradePilot approval.`,
      `Continuous Monitoring: Once deployed, strategies are continuously monitored by Kavach (delta neutrality), Rakshak (hedge protection), TalkDelta (P&L/MTM tracking), and DXCC (governance oversight) — forming a closed-loop feedback system that can trigger kill switches if needed.`,
      `Signal Pipeline: Live signals from Delta XI (screeners), VYUH (stock analytics), SpreadWatch (arbitrage), AALAP Calls (15 external strategies), and TalkDelta AI (ML predictions) feed into Kuber Alpha for strategy activation decisions in real time.`,
    ],
    relatedProducts: ['Strategy Factory', 'TalkDelta', 'DXCC', 'TradePilot', 'TalkOffice'],
    relatedEngines: ['Kuber Alpha', 'Parikshak', 'Kavach', 'Rakshak', 'Simulator'],
    followUpQuestions: [
      'What is the role of Parikshak in strategy testing?',
      'How does Simulator perform backtesting?',
      'What is the deployment approval process?',
      'How does TradePilot ensure compliance?',
      'What happens after a strategy goes live?',
    ],
  };
}

function generateEcosystemOverview(): AIResponse {
  const engineCount = nodes.filter((n) => n.type === 'engine').length;
  const productCount = nodes.filter((n) => n.type === 'product').length;
  const apiCount = nodes.filter((n) => n.type === 'api').length;
  const criticalCount = nodes.filter((n) => n.criticality === 'critical').length;

  return {
    executiveSummary: `The Algo IQ Ecosystem is an enterprise-grade algorithmic trading platform with ${nodes.length} components (${engineCount} engines, ${productCount} products, ${apiCount} APIs) across 5 servers, managing the complete lifecycle from market data ingestion to order execution with multi-layer risk protection.`,
    bulletPoints: [
      `Core Data Layer: Ganesh (OHLC), Lakshmi (live prices via Feed Server + MQ + WebSocket), and Surya (exchange files) form the foundation — all components depend on them for data`,
      `Analytics & Signals: TalkOptions (150+ options APIs), Suchak (15+ technical indicators), Delta XI/VYUH/SpreadWatch (market screeners), Manthan (market churning), Theta Yantra (options analytics), and TalkDelta AI (ML predictions) generate actionable signals`,
      `Strategy Hub: Kuber Alpha receives signals from all generators, activates strategies, allocates capital, and dispatches execution via TalkStrategy API → TalkStrategy App → Vega`,
      `Execution Engine: Vega handles complete order lifecycle — API reception, middleware routing, broker credential management (XTS/Greeksoft), fund allocation, FIX protocol routing, and trade confirmation`,
      `Risk Protection: 3-layer kill switch (Kuber Alpha 1.01% → DXCC 1.05% → Vega 1.50%) plus Kavach (delta neutrality) and Rakshak (hedge protection) provide comprehensive risk management`,
      `Infrastructure: Narad (connectivity hub with service/port/deployment registry) and Suraksha (security with auth/RBAC/encryption/secrets/threat detection) serve as cross-cutting layers connecting all components`,
      `Governance & Audit: DXCC (operations command center), Chitragupta (audit engine), and TalkOffice (RMS/OMS) provide governance, compliance, and operational visibility`,
      `Testing & Deployment: Strategy Factory → Parikshak (testing) → Simulator (backtesting) → Kuber Alpha (deployment) — with TradePilot ensuring SEBI/exchange compliance and DXCC approving go-live`,
    ],
    relatedProducts: ['Ganesh', 'TalkOptions', 'TalkDelta', 'DXCC', 'TalkOffice', 'Strategy Factory'],
    relatedEngines: ['Lakshmi', 'Vega', 'Kuber Alpha', 'Kavach', 'Rakshak', 'Suchak', 'Chitragupta', 'Parikshak'],
    followUpQuestions: [
      'What is the 5-layer architecture?',
      'How does the kill switch work?',
      'How are strategies deployed?',
      'What is the role of each server?',
      'How do components communicate?',
    ],
  };
}

function answerQuestion(q: string): AIResponse | null {
  const lower = q.toLowerCase();

  for (const node of nodes) {
    if (lower.includes(node.name.toLowerCase())) {
      return generateEngineResponse(node);
    }
  }

  if (lower.includes('topology') || lower.includes('connected') || lower.includes('dependencies')) {
    return generateTopologyResponse(q);
  }

  if (lower.includes('server') || lower.includes('host')) {
    return generateServerResponse(q);
  }

  if (lower.includes('connect') || lower.includes('flow') || lower.includes('data')) {
    return generateConnectionResponse(q);
  }

  if (lower.includes('architecture') || lower.includes('layer') || lower.includes('how')) {
    return generateArchitectureResponse();
  }

  if (lower.includes('kill switch') || lower.includes('risk') || lower.includes('protection')) {
    return generateKillSwitchResponse();
  }

  if (lower.includes('strategy') || lower.includes('build') || lower.includes('test') || lower.includes('deploy')) {
    return generateStrategyLifecycleResponse();
  }

  return generateEcosystemOverview();
}

  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleAsk = (question: string) => {
    setQuery(question);
    setLoading(true);
    setError(false);
    setResponse(null);

    setTimeout(() => {
      const result = answerQuestion(question);
      if (result) {
        setResponse(result);
      } else {
        setError(true);
      }
      setLoading(false);
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    handleAsk(trimmed);
  };

  return (
    <div className={compact ? '' : 'w-full max-w-2xl mx-auto p-4'}>
      <div className={compact ? 'p-4' : 'bg-white rounded-2xl shadow-lg border border-slate-200 p-6'}>
        {!compact && <h2 className="text-xl font-bold text-slate-900 mb-1">Ask Algo IQ AI</h2>}
        {!compact && <p className="text-sm text-slate-500 mb-4">Ask anything about the ecosystem</p>}
        <form onSubmit={handleSubmit} className="relative mb-5">
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/10 transition-all">
            <FiCpu size={20} className="text-[#2563EB] mr-3 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything about the Algo IQ Ecosystem..."
              className="bg-transparent border-none outline-none text-sm w-full text-slate-800 placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!query.trim() || loading}
              className="ml-2 p-2 rounded-lg bg-[#2563EB] text-white hover:bg-[#1D4ED8] disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
            >
              <FiSearch size={16} />
            </button>
          </div>
        </form>

        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => handleAsk(q)}
              disabled={loading}
              className="px-3 py-1.5 rounded-full border border-slate-200 text-xs text-slate-600 bg-white hover:border-[#2563EB] hover:text-[#2563EB] hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mt-4 bg-white rounded-2xl shadow-lg border border-slate-200 p-6"
          >
            <div className="flex items-center gap-3">
              <FiCpu size={18} className="text-[#2563EB]" />
              <span className="text-sm text-slate-500 font-medium">Thinking</span>
              <span className="flex gap-1">
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
                />
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                />
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                />
              </span>
            </div>
          </motion.div>
        )}

        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mt-4 bg-white rounded-2xl shadow-lg border border-red-200 p-6"
          >
            <div className="flex items-center gap-3 text-red-600">
              <FiZap size={18} />
              <span className="text-sm font-medium">Sorry, I could not find information about that. Try asking about engines, architecture, servers, kill switches, or strategy deployment.</span>
            </div>
          </motion.div>
        )}

        {response && !loading && (
          <motion.div
            key={query}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="mt-4 bg-white rounded-2xl shadow-lg border-l-4 border-l-[#2563EB] border border-slate-200 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start gap-3 mb-5">
                <div className="p-2 rounded-lg bg-blue-50 shrink-0">
                  <FiCpu size={18} className="text-[#2563EB]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 leading-relaxed">
                    {response.executiveSummary}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                {response.bulletPoints.map((bp, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.25 }}
                    className="flex items-start gap-2.5"
                  >
                    <span className="text-[#2563EB] font-bold mt-0.5 shrink-0 select-none">&bull;</span>
                    <span className="text-sm text-slate-600 leading-relaxed">{bp}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mb-5">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Related Products / Engines
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {[...response.relatedProducts, ...response.relatedEngines].map((name) => (
                    <span
                      key={name}
                      className="px-2.5 py-1 rounded-md bg-blue-50 text-[#2563EB] text-xs font-medium border border-blue-100"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Follow-up Questions
                </p>
                <div className="flex flex-wrap gap-2">
                  {response.followUpQuestions.map((fq) => (
                    <button
                      key={fq}
                      onClick={() => handleAsk(fq)}
                      disabled={loading}
                      className="px-3 py-1.5 rounded-full border border-slate-200 text-xs text-slate-600 bg-white hover:border-[#2563EB] hover:text-[#2563EB] hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      {fq}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
