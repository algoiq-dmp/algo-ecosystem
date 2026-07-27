'use client';

import { useState, useMemo } from 'react';
import { nodes } from '@/data/ecosystem';
import {
  FiArrowRight, FiChevronRight, FiActivity, FiZap,
  FiRadio, FiWifi, FiTarget, FiInfo, FiShield,
  FiServer, FiCpu, FiDatabase, FiCheck,
} from 'react-icons/fi';

interface FlowNode {
  id: string;
  label: string;
  description: string;
}

interface DataFlow {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  nodes: FlowNode[];
}

function lookupDesc(id: string): string {
  const n = nodes.find((n) => n.id === id);
  return n?.description || id;
}

const flows: DataFlow[] = [
  {
    id: 'market-data',
    name: 'Market Data Flow',
    description: 'Raw market data ingestion and distribution path',
    icon: <FiRadio />,
    nodes: [
      { id: 'exchange', label: 'Exchange', description: 'External stock exchange providing raw market feed (NSE, BSE, MCX).' },
      { id: 'feed-server', label: 'Feed Server', description: lookupDesc('feed-server') },
      { id: 'mq', label: 'MQ', description: lookupDesc('mq') },
      { id: 'ganesh', label: 'Ganesh', description: lookupDesc('ganesh') },
    ],
  },
  {
    id: 'ohlc-generation',
    name: 'OHLC Generation Flow',
    description: 'OHLC data computation and distribution across the ecosystem',
    icon: <FiActivity />,
    nodes: [
      { id: 'feed-server', label: 'Feed Server', description: lookupDesc('feed-server') },
      { id: 'mq', label: 'MQ', description: lookupDesc('mq') },
      { id: 'ganesh', label: 'Ganesh', description: lookupDesc('ganesh') },
      { id: 'manthan', label: 'Manthan', description: lookupDesc('manthan') },
      { id: 'suchak', label: 'Suchak', description: lookupDesc('suchak') },
    ],
  },
  {
    id: 'technical-calculation',
    name: 'Technical Calculation Flow',
    description: 'Technical indicator computation pipeline',
    icon: <FiZap />,
    nodes: [
      { id: 'ganesh', label: 'Ganesh', description: lookupDesc('ganesh') },
      { id: 'manthan', label: 'Manthan', description: lookupDesc('manthan') },
      { id: 'suchak', label: 'Suchak', description: lookupDesc('suchak') },
      { id: 'kavach', label: 'Kavach', description: lookupDesc('kavach') },
      { id: 'dxcc', label: 'DXCC', description: lookupDesc('dxcc') },
    ],
  },
  {
    id: 'signal-generation',
    name: 'Signal Generation Flow',
    description: 'Strategy signal generation from market analytics',
    icon: <FiTarget />,
    nodes: [
      { id: 'ganesh', label: 'Ganesh', description: lookupDesc('ganesh') },
      { id: 'talkoptions', label: 'TalkOptions', description: lookupDesc('talkoptions') },
      { id: 'delta-xi', label: 'Delta XI', description: lookupDesc('delta-xi') },
      { id: 'vyuh', label: 'VYUH', description: lookupDesc('vyuh') },
      { id: 'kuber-alpha', label: 'Kuber Alpha', description: lookupDesc('kuber-alpha') },
    ],
  },
  {
    id: 'strategy-execution',
    name: 'Strategy Execution Flow',
    description: 'End-to-end strategy execution pipeline',
    icon: <FiShield />,
    nodes: [
      { id: 'kuber-alpha', label: 'Kuber Alpha', description: lookupDesc('kuber-alpha') },
      { id: 'talkstrategy-api', label: 'TalkStrategy API', description: lookupDesc('talkstrategy-api') },
      { id: 'vega', label: 'Vega', description: lookupDesc('vega') },
      { id: 'broker', label: 'Broker APIs', description: lookupDesc('broker') },
    ],
  },
  {
    id: 'order-flow',
    name: 'Order Flow',
    description: 'Order placement and routing from strategy to exchange',
    icon: <FiArrowRight />,
    nodes: [
      { id: 'strategy-factory', label: 'Strategy Factory', description: lookupDesc('strategy-factory') },
      { id: 'kuber-alpha', label: 'Kuber Alpha', description: lookupDesc('kuber-alpha') },
      { id: 'talkstrategy-api', label: 'TalkStrategy API', description: lookupDesc('talkstrategy-api') },
      { id: 'vega', label: 'Vega', description: lookupDesc('vega') },
      { id: 'odin', label: 'ODIN', description: lookupDesc('odin') },
      { id: 'exchange', label: 'Exchange', description: lookupDesc('exchange') },
    ],
  },
  {
    id: 'trade-confirmation',
    name: 'Trade Confirmation Flow',
    description: 'Trade confirmation dispatch and recording',
    icon: <FiCheck />,
    nodes: [
      { id: 'vega', label: 'Vega', description: lookupDesc('vega') },
      { id: 'talkdelta', label: 'TalkDelta', description: lookupDesc('talkdelta') },
      { id: 'talkoffice', label: 'TalkOffice', description: lookupDesc('talkoffice') },
      { id: 'chitragupta', label: 'Chitragupta', description: lookupDesc('chitragupta') },
    ],
  },
  {
    id: 'rms-update',
    name: 'RMS Update Flow',
    description: 'Risk management system real-time position updates',
    icon: <FiServer />,
    nodes: [
      { id: 'vega', label: 'Vega', description: lookupDesc('vega') },
      { id: 'talkdelta', label: 'TalkDelta', description: lookupDesc('talkdelta') },
      { id: 'kavach', label: 'Kavach', description: lookupDesc('kavach') },
      { id: 'rakshak', label: 'Rakshak', description: lookupDesc('rakshak') },
      { id: 'vega', label: 'Vega (response)', description: 'Vega receives protective actions from Rakshak for execution.' },
    ],
  },
  {
    id: 'ai-analysis',
    name: 'AI Analysis Flow',
    description: 'AI-driven analysis and decision pipeline',
    icon: <FiCpu />,
    nodes: [
      { id: 'talkdelta', label: 'TalkDelta', description: lookupDesc('talkdelta') },
      { id: 'talkdelta-ai', label: 'TalkDelta AI', description: lookupDesc('talkdelta-ai') },
      { id: 'kuber-alpha', label: 'Kuber Alpha', description: lookupDesc('kuber-alpha') },
      { id: 'talkstrategy-api', label: 'TalkStrategy API', description: lookupDesc('talkstrategy-api') },
      { id: 'vega', label: 'Vega', description: lookupDesc('vega') },
    ],
  },
  {
    id: 'audit-flow',
    name: 'Audit Flow',
    description: 'Compliance audit trail and regulatory recording',
    icon: <FiDatabase />,
    nodes: [
      { id: 'vega', label: 'Vega', description: lookupDesc('vega') },
      { id: 'talkdelta', label: 'TalkDelta', description: lookupDesc('talkdelta') },
      { id: 'chitragupta', label: 'Chitragupta', description: lookupDesc('chitragupta') },
      { id: 'dxcc', label: 'DXCC', description: lookupDesc('dxcc') },
      { id: 'suraksha', label: 'Suraksha', description: lookupDesc('suraksha') },
    ],
  },
];

const colorCycle = [
  'border-cyan-500 bg-cyan-900/20',
  'border-blue-500 bg-blue-900/20',
  'border-purple-500 bg-purple-900/20',
  'border-amber-500 bg-amber-900/20',
  'border-green-500 bg-green-900/20',
  'border-pink-500 bg-pink-900/20',
  'border-red-500 bg-red-900/20',
  'border-indigo-500 bg-indigo-900/20',
  'border-yellow-500 bg-yellow-900/20',
  'border-teal-500 bg-teal-900/20',
];

export default function DataFlowPage() {
  const [activeFlow, setActiveFlow] = useState(flows[0].id);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const currentFlow = useMemo(
    () => flows.find((f) => f.id === activeFlow) || flows[0],
    [activeFlow]
  );

  const nodeDetail = selectedNode
    ? currentFlow.nodes.find((n) => n.id === selectedNode)
    : null;

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <FiActivity className="text-2xl text-purple-400" />
          <h1 className="text-3xl font-bold">Data Flow Explorer</h1>
        </div>
        <p className="text-gray-400 mb-6">
          Interactive sequence diagrams showing how data flows through the ecosystem
        </p>

        {/* Tab Bar - Pill Style */}
        <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2">
          {flows.map((flow) => (
            <button
              key={flow.id}
              onClick={() => {
                setActiveFlow(flow.id);
                setSelectedNode(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeFlow === flow.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-gray-800 text-gray-400 hover:text-gray-200 hover:bg-gray-700'
              }`}
            >
              <span className="text-base">{flow.icon}</span>
              {flow.name}
            </button>
          ))}
        </div>

        {/* Flow Description */}
        <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-4 mb-8">
          <h3 className="text-lg font-semibold text-purple-400">{currentFlow.name}</h3>
          <p className="text-sm text-gray-400 mt-1">{currentFlow.description}</p>
        </div>

        {/* Flow Diagram */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {currentFlow.nodes.map((node, idx) => (
                <div key={`${node.id}-${idx}`} className="flex items-center">
                  <div
                    onClick={() =>
                      setSelectedNode(
                        selectedNode === node.id ? null : node.id
                      )
                    }
                    className={`flex flex-col items-center justify-center w-36 h-28 rounded-xl border-2 cursor-pointer transition-all hover:scale-105 ${
                      colorCycle[idx % colorCycle.length]
                    } ${selectedNode === node.id ? 'ring-2 ring-purple-400 ring-offset-2 ring-offset-gray-950 scale-105' : ''}`}
                  >
                    <span className="text-xs font-semibold text-gray-300 text-center px-1 leading-tight">
                      {node.label}
                    </span>
                    <span className="text-[10px] text-gray-500 mt-1 text-center px-1 leading-tight line-clamp-2">
                      {node.description.slice(0, 60)}
                    </span>
                  </div>
                  {idx < currentFlow.nodes.length - 1 && (
                    <div className="flex items-center mx-1 text-purple-400">
                      <FiChevronRight className="animate-pulse" size={20} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-8 p-4 bg-gray-800/30 border border-gray-700 rounded-xl">
              <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Flow Sequence</p>
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400">
                {currentFlow.nodes.map((n, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <span className={`inline-block w-2 h-2 rounded-full ${colorCycle[i % colorCycle.length].split(' ')[1] || 'bg-gray-500'}`} />
                    {n.label}
                    {i < currentFlow.nodes.length - 1 && (
                      <FiArrowRight className="text-purple-400 mx-1" size={12} />
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Side Panel - Node Details */}
          <div className="lg:w-72 flex-shrink-0">
            {nodeDetail ? (
              <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-5 sticky top-6">
                <div className="flex items-center gap-2 mb-3">
                  <FiInfo className="text-purple-400" />
                  <h4 className="text-lg font-semibold text-gray-200">{nodeDetail.label}</h4>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {nodeDetail.description}
                </p>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="mt-4 text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  Click to dismiss
                </button>
              </div>
            ) : (
              <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-5 sticky top-6">
                <div className="flex items-center gap-2 mb-3">
                  <FiInfo className="text-gray-500" />
                  <h4 className="text-sm font-medium text-gray-500">Node Details</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Click any node in the flow diagram to see its description.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
