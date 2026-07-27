'use client';
import { useState } from 'react';
import { nodes, connections, connectionTypeColors, serverGroups } from '@/data/ecosystem';
import {
  FiX, FiExternalLink, FiArrowUp, FiArrowDown, FiBookOpen,
  FiChevronDown, FiChevronRight, FiServer, FiCpu, FiDatabase,
  FiActivity, FiShield, FiAlertTriangle, FiLayers, FiMessageSquare, FiInfo
} from 'react-icons/fi';
import AskAI from './AskAI';

interface RightPanelProps {
  selectedNode: string | null;
  onClose: () => void;
  isOpen: boolean;
}

function Section({ title, icon, children, defaultOpen = true }: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-100 dark:border-slate-800/50">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
      >
        <span className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
          {icon}
          {title}
        </span>
        {open ? <FiChevronDown size={14} className="text-slate-400" /> : <FiChevronRight size={14} className="text-slate-400" />}
      </button>
      {open && <div className="px-4 pb-3">{children}</div>}
    </div>
  );
}

function ProtocolBadge({ comm }: { comm: Record<string, boolean | undefined> }) {
  const protocols = Object.entries(comm).filter(([, v]) => v).map(([k]) => k.toUpperCase());
  if (protocols.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1 mt-1.5">
      {protocols.map(p => (
        <span key={p} className="px-2 py-0.5 rounded-md bg-slate-800 dark:bg-slate-700 text-white text-[9px] font-mono font-semibold">
          {p}
        </span>
      ))}
    </div>
  );
}

export default function RightPanel({ selectedNode, onClose, isOpen }: RightPanelProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'ask'>('details');

  if (!isOpen) return null;

  const node = nodes.find(n => n.id === selectedNode);
  const serverGroup = node ? serverGroups.find(s => s.nodes.includes(node.id)) : undefined;
  const incoming = node ? connections.filter(c => c.target === node.id) : [];
  const outgoing = node ? connections.filter(c => c.source === node.id) : [];
  const getNodeName = (id: string) => nodes.find(n => n.id === id)?.name || id;

  return (
    <aside className="w-[400px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col shrink-0 overflow-hidden shadow-xl z-20">
      {/* Header with Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('details')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-semibold transition-colors ${
                activeTab === 'details' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <FiInfo size={13} />
              Details
            </button>
            <button
              onClick={() => setActiveTab('ask')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-semibold transition-colors ${
                activeTab === 'ask' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <FiMessageSquare size={13} />
              Ask AI
            </button>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 shrink-0">
            <FiX size={16} />
          </button>
        </div>
        {activeTab === 'details' && node && (
          <div className="flex items-center gap-3 px-4 pb-3 min-w-0">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 shadow-sm"
              style={{ backgroundColor: serverGroup?.color || node.color }}>
              <span className="text-white text-xs font-bold">{node.name.charAt(0)}</span>
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white truncate">{node.name}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                {node.alias && <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{node.alias}</span>}
                <span className={`inline-flex items-center gap-1 px-1.5 py-px rounded-full text-[9px] font-medium ${node.status === 'online' ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400' : node.status === 'degraded' ? 'bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400' : 'bg-red-50 dark:bg-red-900/40 text-red-700 dark:text-red-400'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${node.status === 'online' ? 'bg-emerald-500' : node.status === 'degraded' ? 'bg-amber-500' : 'bg-red-500'}`} />
                  {node.status}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === 'ask' ? (
          <AskAI compact />
        ) : node ? (
          <>
        {/* Purpose & Business Value */}
        <Section title="Purpose & Business Value" icon={<FiLayers size={12} />}>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-2">{node.purpose}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 italic leading-relaxed">{node.businessValue}</p>
        </Section>

        {/* Basic Information */}
        <Section title="Basic Information" icon={<FiServer size={12} />}>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2">
            <InfoField label="Server" value={node.server} />
            <InfoField label="IP" value={node.ip} mono />
            <InfoField label="Environment" value={node.environment} />
            <InfoField label="Type" value={node.type.toUpperCase()} />
            <InfoField label="Version" value={`v${node.version}`} />
            <InfoField label="Owner" value={node.owner} />
            <InfoField label="Health" value={`${node.health}%`} highlight />
            <InfoField label="Ports" value={node.ports} mono />
            <InfoField label="Deployment" value={node.deploymentStatus} />
            <InfoField label="Readiness" value={node.readiness} />
          </div>
        </Section>

        {/* Description */}
        <Section title="Description" icon={<FiActivity size={12} />} defaultOpen={false}>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{node.description}</p>
        </Section>

        {/* Responsibilities */}
        <Section title="Responsibilities" icon={<FiCpu size={12} />}>
          <ul className="space-y-1">
            {node.responsibilities.map((r, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                <span className="text-blue-400 dark:text-blue-500 mt-0.5 shrink-0">&#x2022;</span>
                {r}
              </li>
            ))}
          </ul>
        </Section>

        {/* Data Flow */}
        <Section title="Data Flow" icon={<FiArrowDown size={12} />} defaultOpen={false}>
          {node.receivesFrom.length > 0 && (
            <div className="mb-3">
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase mb-1.5">Receives From</p>
              <div className="flex flex-wrap gap-1">
                {node.receivesFrom.map((n, i) => (
                  <span key={i} className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-[10px] font-medium">
                    {n}
                  </span>
                ))}
              </div>
            </div>
          )}
          {node.sendsTo.length > 0 && (
            <div className="mb-3">
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase mb-1.5">Sends To</p>
              <div className="flex flex-wrap gap-1">
                {node.sendsTo.map((n, i) => (
                  <span key={i} className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-full text-[10px] font-medium">
                    {n}
                  </span>
                ))}
              </div>
            </div>
          )}
          {node.dataProduced.length > 0 && (
            <div className="mb-3">
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase mb-1.5">Data Produced</p>
              <ul className="space-y-0.5">
                {node.dataProduced.map((d, i) => (
                  <li key={i} className="text-[10px] text-slate-600 dark:text-slate-400">&#x2022; {d}</li>
                ))}
              </ul>
            </div>
          )}
          {node.dataConsumed.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase mb-1.5">Data Consumed</p>
              <ul className="space-y-0.5">
                {node.dataConsumed.map((d, i) => (
                  <li key={i} className="text-[10px] text-slate-600 dark:text-slate-400">&#x2022; {d}</li>
                ))}
              </ul>
            </div>
          )}
        </Section>

        {/* Connected Applications */}
        <Section title="Connected Applications" icon={<FiServer size={12} />} defaultOpen={false}>
          {node.connectedApplications.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {node.connectedApplications.map((a, i) => (
                <span key={i} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-[10px] text-slate-700 dark:text-slate-300">
                  {a}
                </span>
              ))}
            </div>
          )}
          {node.connectedEngines.length > 0 && (
            <div className="mb-2">
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mb-1">Engines</p>
              <div className="flex flex-wrap gap-1">
                {node.connectedEngines.map((e, i) => (
                  <span key={i} className="px-2 py-0.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-md text-[10px]">
                    {e}
                  </span>
                ))}
              </div>
            </div>
          )}
          {node.connectedApis.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mb-1">APIs</p>
              <div className="flex flex-wrap gap-1">
                {node.connectedApis.map((a, i) => (
                  <span key={i} className="px-2 py-0.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-md text-[10px]">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Section>

        {/* Live Connections */}
        <Section title="Live Connections" icon={<FiActivity size={12} />}>
          <IncomingSection incoming={incoming} getNodeName={getNodeName} count={incoming.length} />
          <OutgoingSection outgoing={outgoing} getNodeName={getNodeName} count={outgoing.length} />
        </Section>

        {/* Communication */}
        <Section title="Communication" icon={<FiShield size={12} />} defaultOpen={false}>
          <ProtocolBadge comm={node.communication} />
          {node.databases.length > 0 && (
            <div className="mt-2">
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mb-1">Databases</p>
              <div className="flex flex-wrap gap-1">
                {node.databases.map((db, i) => (
                  <span key={i} className="px-2 py-0.5 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 rounded-md text-[10px] font-mono">
                    {db}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Section>

        {/* Source Modules */}
        {node.sourceModules.length > 0 && (
          <Section title="Source Modules" icon={<FiDatabase size={12} />} defaultOpen={false}>
            <div className="flex flex-wrap gap-1">
              {node.sourceModules.map((m, i) => (
                <code key={i} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px] text-slate-700 dark:text-slate-300 font-mono">
                  {m}
                </code>
              ))}
            </div>
          </Section>
        )}

        {/* Features */}
        <Section title="Features" icon={<FiLayers size={12} />} defaultOpen={false}>
          <div className="flex flex-wrap gap-1">
            {node.features.map((f, i) => (
              <span key={i} className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 rounded-full text-[10px] font-medium">
                {f}
              </span>
            ))}
          </div>
        </Section>

        {/* Failure Impact */}
        <Section title="Failure Impact" icon={<FiAlertTriangle size={12} />} defaultOpen={false}>
          <p className="text-xs text-red-600 dark:text-red-400 leading-relaxed bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
            {node.failureImpact}
          </p>
        </Section>

        {/* Future Enhancements */}
        {node.futureEnhancements && (
          <Section title="Future Enhancements" icon={<FiActivity size={12} />} defaultOpen={false}>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{node.futureEnhancements}</p>
          </Section>
        )}

        {/* Documentation */}
        <Section title="Documentation" icon={<FiBookOpen size={12} />} defaultOpen={false}>
          <a
            href={node.documentationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
          >
            <FiBookOpen size={14} />
            View Documentation
            <FiExternalLink size={12} className="ml-auto" />
          </a>
        </Section>

        <div className="h-6" />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500 p-6">
            <FiInfo size={40} className="mb-3 opacity-30" />
            <p className="text-sm font-medium">Select a node</p>
            <p className="text-xs mt-1">Click any node on the topology to view details</p>
          </div>
        )}
      </div>
    </aside>
  );
}

function InfoField({ label, value, mono, highlight }: { label: string; value: string; mono?: boolean; highlight?: boolean }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-800/40 rounded-md p-2">
      <p className="text-[9px] text-slate-400 dark:text-slate-500 mb-0.5">{label}</p>
      <p className={`text-[11px] font-semibold truncate ${highlight ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'} ${mono ? 'font-mono' : ''}`}>
        {value}
      </p>
    </div>
  );
}

function IncomingSection({ incoming, getNodeName, count }: { incoming: typeof connections; getNodeName: (id: string) => string; count: number }) {
  if (count === 0) return null;
  return (
    <div className="mb-2">
      <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase mb-1.5">
        <FiArrowUp size={10} className="inline mr-1 text-blue-500" />
        Incoming ({count})
      </p>
      <div className="space-y-0.5 max-h-[160px] overflow-y-auto custom-scrollbar">
        {incoming.map(c => (
          <div key={c.id} className="flex items-center gap-2 px-2 py-1 rounded text-xs hover:bg-slate-50 dark:hover:bg-slate-800/30 text-slate-600 dark:text-slate-400">
            <span className="font-medium truncate flex-1">{getNodeName(c.source)}</span>
            <span className="text-[8px] px-1.5 py-0.5 rounded-full font-mono shrink-0" style={{ backgroundColor: connectionTypeColors[c.type] + '20', color: connectionTypeColors[c.type] }}>{c.protocol}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function OutgoingSection({ outgoing, getNodeName, count }: { outgoing: typeof connections; getNodeName: (id: string) => string; count: number }) {
  if (count === 0) return null;
  return (
    <div>
      <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase mb-1.5">
        <FiArrowDown size={10} className="inline mr-1 text-emerald-500" />
        Outgoing ({count})
      </p>
      <div className="space-y-0.5 max-h-[160px] overflow-y-auto custom-scrollbar">
        {outgoing.map(c => (
          <div key={c.id} className="flex items-center gap-2 px-2 py-1 rounded text-xs hover:bg-slate-50 dark:hover:bg-slate-800/30 text-slate-600 dark:text-slate-400">
            <span className="font-medium truncate flex-1">{getNodeName(c.target)}</span>
            <span className="text-[8px] px-1.5 py-0.5 rounded-full font-mono shrink-0" style={{ backgroundColor: connectionTypeColors[c.type] + '20', color: connectionTypeColors[c.type] }}>{c.protocol}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
