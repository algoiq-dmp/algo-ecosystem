'use client';
import { useState } from 'react';
import { FiBookOpen, FiX, FiChevronDown, FiChevronRight, FiCheck } from 'react-icons/fi';

const categories = [
  {
    title: '5-Layer Architecture',
    points: [
      'Layer 1 — Core Data: Lakshmi (live price), Surya (exchange files), Ganesh (OHLC), TalkOptions (derivatives).',
      'Layer 2 — Opportunity Generation: Aalap Calls, Delta XI, VYUH, TalkDelta AI scan markets and generate trading signals.',
      'Layer 3 — Strategy Hub: Kuber Alpha reads signals, activates strategies, allocates capital. Does NOT generate signals.',
      'Layer 4 — Order Execution: Vega Engine (4 components) executes orders through broker APIs to exchange.',
      'Layer 5 — Trade Governance: DXCC monitors and manages all trades, strategies, and production operations.',
      'Dev & Testing: Strategy Factory builds strategies. Simulator backtests. Parikshak certifies before production.',
      'Business Layer: TradePilot handles client onboarding, strategy approval, KYC, and SEBI compliance.',
    ],
  },
  {
    title: 'Core Architecture',
    points: [
      'Algo IQ is a modular enterprise trading ecosystem.',
      'Every product has a clearly defined responsibility.',
      'Every engine is independently deployable.',
      'The ecosystem follows a modular architecture.',
      'The ecosystem follows Single Source of Truth principles.',
      'Consistency across products is mandatory.',
      'Every component supports scalability.',
      'Every component supports monitoring.',
      'Every component supports troubleshooting.',
      'Every component supports documentation.',
    ],
  },
  {
    title: 'Connectivity & Security',
    points: [
      'Narad is the connectivity and orchestration layer.',
      'Suraksha is the universal security layer.',
      'Narad maintains the service registry.',
      'Narad manages server connectivity.',
      'Narad manages deployment orchestration.',
      'Narad manages restart operations.',
      'Narad tracks port allocation.',
      'Narad manages secure tunnels.',
      'Suraksha secures all APIs.',
      'Suraksha secures all servers.',
      'Suraksha secures all products.',
      'Suraksha secures all engines.',
      'Security policies are centrally enforced.',
      'Narad should not replace application hosting.',
      'Narad manages applications, not runtime processes.',
    ],
  },
  {
    title: 'Data Flow',
    points: [
      'Surya is the Single Source of Truth for exchange files.',
      'Feed Server is the market data entry point.',
      'MQ is the central messaging backbone.',
      'Local WebSocket distributes internal live data.',
      'Ganesh provides normalized OHLC data.',
      'Lakshmi is the data distribution layer.',
      'All exchange files pass through Surya.',
      'No engine downloads exchange files independently.',
      'File acquisition is centralized.',
      'File validation is centralized.',
      'File versioning is centralized.',
      'File distribution is centralized.',
      'Consumers receive only required files.',
      'Feed Server consumes Surya reference files.',
      'Ganesh consumes Surya reference files.',
      'Suchak consumes Surya reference files.',
    ],
  },
  {
    title: 'Execution',
    points: [
      'Vega is the centralized execution platform.',
      'Vega is composed of four coordinated modules.',
      'TalkStrategy API receives trade requests.',
      'TalkStrategy App is the middleware for execution.',
      'Order Processor controls order lifecycle.',
      'Broker Integration manages broker connectivity.',
      'Broker credentials are centrally managed.',
      'Fund allocation is managed in Broker Integration.',
      'Every order passes through Vega.',
      'Strategy engines never send orders directly to brokers.',
      'Trade confirmations originate from Vega.',
    ],
  },
  {
    title: 'Strategy & Analytics',
    points: [
      'TalkDelta consumes execution updates from Vega.',
      'TalkOffice integrates only with Vega.',
      'TalkDelta publishes analytics APIs.',
      'Kavach consumes execution data.',
      'Rakshak consumes execution data.',
      'Strategy Factory consumes execution data.',
      'Kuber Alpha generates trading decisions.',
      'Delta XI provides advanced analytics.',
      'VYUH focuses on stock intelligence.',
      'SpreadWatch provides spread analytics.',
      'Simulator consumes historical data.',
      'Lakshmi distributes normalized data.',
      'Garuda powers options analytics.',
    ],
  },
  {
    title: 'Operations & Governance',
    points: [
      'Parikshak is the centralized testing platform.',
      'Parikshak validates releases.',
      'Parikshak stores test evidence.',
      'DXCC monitors the ecosystem.',
      'DXCC provides operational monitoring.',
      'Testing is centralized through Parikshak.',
      'Deployment is centrally governed.',
      'Logs are centralized.',
      'Health metrics are centralized.',
      'Every service has health monitoring.',
      'Every application exposes a health endpoint.',
      'Audit trails are preserved.',
    ],
  },
  {
    title: 'Infrastructure',
    points: [
      'PM2 is only for Node.js process management.',
      'Windows Services host native engines.',
      'Caddy can replace IIS for reverse proxy.',
      'Port allocation is fixed and governed.',
      'Reverse proxy exposes only public endpoints.',
      'Internal ports remain private.',
      'Every deployment is version controlled.',
      'Version history is maintained.',
    ],
  },
  {
    title: 'Strategy Lifecycle',
    points: [
      'Every strategy must be created in Strategy Builder.',
      'Every strategy must pass Parikshak validation before simulation.',
      'Every strategy must complete Simulator testing before release.',
      'Only DXCC can approve a strategy for production deployment.',
      'Production strategies execute exclusively within Kuber Alpha environment.',
      'All live orders flow through TalkStrategy API → TalkStrategy App → Vega Engine → Broker → Exchange.',
      'Strategy Builder, Parikshak, Simulator, DXCC, and Kuber Alpha together form the governed strategy delivery pipeline.',
    ],
  },
  {
    title: 'Kill Switch Architecture',
    points: [
      'Kuber Alpha performs earliest automated risk monitoring at 1.01% margin.',
      'DXCC independently supervises production risk at 1.05% margin.',
      'Vega provides final execution safeguard at 1.50% margin.',
      'Each layer operates independently with its own audit trail.',
      'Thresholds are intentionally different so layers do not conflict.',
      'All kill switch actions propagate to TalkDelta, Chitragupta, and monitoring.',
      'The three-layer approach provides multiple independent risk-control layers.',
    ],
  },
  {
    title: 'Documentation & Standards',
    points: [
      'Topology is version-aware.',
      'Every product has complete documentation.',
      'Every API is documented.',
      'Every engine has defined inputs and outputs.',
      'Every dependency is documented.',
      'Product ownership is documented.',
      'Server allocation is documented.',
      'Every release is traceable.',
      'Architecture Explorer reflects live dependencies.',
      'Knowledge Base is the authoritative documentation source.',
      'Documentation is synchronized across products.',
      'BRS, SRS, HLD, and LLD remain aligned.',
      'API documentation is versioned.',
      'Topology updates automatically after architecture changes.',
      'Every future engine or product must integrate with Narad, Suraksha, Parikshak, Surya, and the ecosystem governance standards from day one.',
    ],
  },
];

export default function PrinciplesPanel() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const toggleCategory = (i: number) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="absolute top-3 right-3 z-20 flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
        title="Ecosystem Principles"
      >
        <FiBookOpen size={14} />
        100 Principles
      </button>

      {/* Slide-in Panel */}
      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="fixed right-0 top-0 bottom-0 z-50 w-[420px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-50 to-white dark:from-blue-950 dark:to-slate-900">
              <div>
                <div className="text-sm font-bold text-slate-800 dark:text-white">Ecosystem Principles</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">100 most important points</div>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                <FiX size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-1">
              {categories.map((cat, catIdx) => (
                <div key={catIdx} className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleCategory(catIdx)}
                    className="w-full flex items-center justify-between px-3 py-2.5 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {cat.title} ({cat.points.length})
                    </span>
                    {expanded.has(catIdx) ? <FiChevronDown size={14} className="text-slate-400" /> : <FiChevronRight size={14} className="text-slate-400" />}
                  </button>
                  {expanded.has(catIdx) && (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {cat.points.map((point, pi) => (
                        <div key={pi} className="flex items-start gap-2 px-3 py-2 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                          <FiCheck size={12} className="text-emerald-500 mt-0.5 shrink-0" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-500 text-center">
              Every future component must integrate with Narad, Suraksha, Parikshak, Surya, and ecosystem governance from day one.
            </div>
          </div>
        </>
      )}
    </>
  );
}
