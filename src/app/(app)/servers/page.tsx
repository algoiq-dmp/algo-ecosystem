'use client';

import { useState, useMemo } from 'react';
import { serverGroups, nodes } from '@/data/ecosystem';
import {
  FiServer, FiCpu, FiDatabase, FiActivity, FiShield,
  FiCheck, FiAlertCircle, FiClock, FiRefreshCw, FiBarChart2,
  FiTrendingUp, FiZap, FiInfo, FiChevronRight, FiChevronDown,
  FiLayers, FiWifi, FiTarget,
} from 'react-icons/fi';

const colorClassMap: Record<string, string> = {
  '#10B981': 'border-l-emerald-500',
  '#8B5CF6': 'border-l-violet-500',
  '#F59E0B': 'border-l-amber-500',
  '#3B82F6': 'border-l-blue-500',
  '#EF4444': 'border-l-red-500',
};

const bgColorMap: Record<string, string> = {
  '#10B981': 'bg-emerald-500',
  '#8B5CF6': 'bg-violet-500',
  '#F59E0B': 'bg-amber-500',
  '#3B82F6': 'bg-blue-500',
  '#EF4444': 'bg-red-500',
};

function healthAggregate(nodeIds: string[]): {
  status: string;
  percent: number;
  color: string;
} {
  const serverNodes = nodes.filter((n) => nodeIds.includes(n.id));
  if (serverNodes.length === 0) return { status: 'Unknown', percent: 0, color: 'bg-gray-500' };
  const avg = serverNodes.reduce((s, n) => s + n.health, 0) / serverNodes.length;
  const hasOffline = serverNodes.some((n) => n.status === 'offline');
  const hasDegraded = serverNodes.some((n) => n.status === 'degraded');
  if (hasOffline) return { status: 'Degraded', percent: avg, color: 'bg-red-500' };
  if (hasDegraded) return { status: 'Degraded', percent: avg, color: 'bg-yellow-500' };
  if (avg >= 99.9) return { status: 'Healthy', percent: avg, color: 'bg-green-500' };
  return { status: 'Healthy', percent: avg, color: 'bg-green-500' };
}

export default function ServersPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const serverData = useMemo(() => {
    return serverGroups.map((sg) => {
      const serverNodes = nodes.filter((n) => sg.nodes.includes(n.id));
      const health = healthAggregate(sg.nodes);
      return {
        ...sg,
        nodes: serverNodes,
        health,
        cpuCores: sg.nodes.length > 5 ? 32 : sg.nodes.length > 3 ? 24 : 16,
        ramGB: sg.nodes.length > 5 ? 128 : sg.nodes.length > 3 ? 96 : 64,
        storageGB: sg.nodes.length > 5 ? 2048 : sg.nodes.length > 3 ? 1024 : 512,
        os: 'Windows Server 2022',
        uptime: '99.9%',
        lastDeployed: '2026-07-15',
        backupSchedule: 'Daily at 02:00 AM',
        deploymentHistory: [
          { date: '2026-07-15', version: 'Patch 2026-07', status: 'Success' },
          { date: '2026-06-20', version: 'Patch 2026-06', status: 'Success' },
          { date: '2026-05-10', version: 'Feature Release 3.1', status: 'Success' },
        ],
        monitoringStatus: 'Active (Prometheus + Grafana + DXCC)',
        readinessScore: health.percent,
        capacityUsed: Math.min(55 + serverNodes.length * 5, 95),
      };
    });
  }, []);

  const totalNodes = useMemo(
    () => serverData.reduce((s, d) => s + d.nodes.length, 0),
    [serverData]
  );

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <FiServer className="text-2xl text-blue-400" />
          <h1 className="text-3xl font-bold">Server Explorer</h1>
        </div>
        <p className="text-gray-400 mb-2">
          Physical and virtual server infrastructure powering the Algo IQ ecosystem
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
          <span>{serverGroups.length} Servers</span>
          <span>&middot;</span>
          <span>{totalNodes} Deployed Components</span>
        </div>

        {/* Server Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {serverData.map((server) => {
            const isExpanded = expandedId === server.id;
            return (
              <div
                key={server.id}
                className={`bg-gray-800/60 border border-gray-700 border-l-4 ${colorClassMap[server.color] || 'border-l-blue-500'} rounded-xl overflow-hidden transition-all ${isExpanded ? 'lg:col-span-2' : ''}`}
              >
                {/* Header */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${bgColorMap[server.color] || 'bg-blue-500'}`} />
                        <h3 className="text-xl font-bold text-gray-100">{server.name}</h3>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{server.ip}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                          server.health.status === 'Healthy'
                            ? 'bg-green-900/40 text-green-400'
                            : 'bg-red-900/40 text-red-400'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${server.health.color}`} />
                        {server.health.status}
                      </span>
                    </div>
                  </div>

                  {/* Quick stats row */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-gray-900/50 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-500 mb-1">Nodes</p>
                      <p className="text-lg font-bold text-gray-200">{server.nodes.length}</p>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-500 mb-1">Health</p>
                      <p className="text-lg font-bold text-green-400">
                        {server.health.percent.toFixed(1)}%
                      </p>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-500 mb-1">Uptime</p>
                      <p className="text-lg font-bold text-blue-400">{server.uptime}</p>
                    </div>
                  </div>

                  {/* Hardware */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <FiCpu className="text-gray-500" />
                      <span>{server.cpuCores} Cores</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <FiDatabase className="text-gray-500" />
                      <span>{server.ramGB} GB RAM</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <FiLayers className="text-gray-500" />
                      <span>{server.storageGB} GB SSD</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500">
                    {server.os}
                  </p>

                  {/* Running Applications */}
                  <div className="mt-3">
                    <p className="text-xs font-medium text-gray-500 mb-2">
                      Running Applications & Engines
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {server.nodes.map((n) => (
                        <span
                          key={n.id}
                          className="px-2 py-1 bg-gray-700/60 rounded text-xs text-gray-300"
                        >
                          {n.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Expand button */}
                  <button
                    onClick={() =>
                      setExpandedId(isExpanded ? null : server.id)
                    }
                    className="mt-4 flex items-center gap-1 text-blue-400 text-sm hover:text-blue-300 transition-colors"
                  >
                    {isExpanded ? (
                      <>
                        Collapse Details <FiChevronDown />
                      </>
                    ) : (
                      <>
                        View Full Details <FiChevronRight />
                      </>
                    )}
                  </button>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-6 border-t border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                      {/* Hardware Specs */}
                      <div className="bg-gray-800/50 rounded-xl p-4">
                        <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <FiCpu /> Hardware Specifications
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">CPU Cores</span>
                            <span className="text-gray-200">{server.cpuCores} vCPUs</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">RAM</span>
                            <span className="text-gray-200">{server.ramGB} GB DDR4</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Storage</span>
                            <span className="text-gray-200">{server.storageGB} GB NVMe SSD</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">OS</span>
                            <span className="text-gray-200">{server.os}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Network</span>
                            <span className="text-gray-200">10 Gbps</span>
                          </div>
                        </div>
                      </div>

                      {/* Ports & URLs */}
                      <div className="bg-gray-800/50 rounded-xl p-4">
                        <h4 className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <FiWifi /> Ports & URLs
                        </h4>
                        <div className="space-y-2 text-sm max-h-40 overflow-y-auto">
                          {server.nodes.map((n) => (
                            <div key={n.id} className="flex justify-between">
                              <span className="text-gray-400">{n.name}</span>
                              <span className="text-gray-200 font-mono">:{n.ports}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Databases */}
                      <div className="bg-gray-800/50 rounded-xl p-4">
                        <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <FiDatabase /> Databases
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {(() => {
                            const dbs = new Set<string>();
                            server.nodes.forEach((n) =>
                              n.databases.forEach((d) => dbs.add(d))
                            );
                            const arr = [...dbs];
                            return arr.length > 0 ? (
                              arr.map((db, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-1 bg-amber-900/30 text-amber-300 rounded text-xs"
                                >
                                  {db}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-gray-600">None</span>
                            );
                          })()}
                        </div>
                      </div>

                      {/* Monitoring & Services */}
                      <div className="bg-gray-800/50 rounded-xl p-4">
                        <h4 className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <FiActivity /> Monitoring & Services
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <p className="text-gray-500 text-xs">Monitoring</p>
                            <p className="text-gray-300">{server.monitoringStatus}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Backup Schedule</p>
                            <p className="text-gray-300">{server.backupSchedule}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Uptime SLA</p>
                            <p className="text-gray-300">{server.uptime}</p>
                          </div>
                        </div>
                      </div>

                      {/* Deployment History */}
                      <div className="bg-gray-800/50 rounded-xl p-4">
                        <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <FiRefreshCw /> Deployment History
                        </h4>
                        <div className="space-y-2">
                          {server.deploymentHistory.map((dep, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between text-sm bg-gray-900/50 rounded-lg p-2"
                            >
                              <div>
                                <p className="text-gray-300">{dep.version}</p>
                                <p className="text-xs text-gray-500">{dep.date}</p>
                              </div>
                              <span className="text-xs px-2 py-0.5 bg-green-900/40 text-green-400 rounded">
                                {dep.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Capacity Gauge & Readiness */}
                      <div className="bg-gray-800/50 rounded-xl p-4">
                        <h4 className="text-xs font-semibold text-pink-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <FiBarChart2 /> Capacity & Readiness
                        </h4>

                        {/* Capacity Gauge */}
                        <div className="mb-4">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Capacity Used</span>
                            <span>{server.capacityUsed}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full transition-all ${
                                server.capacityUsed > 85
                                  ? 'bg-red-500'
                                  : server.capacityUsed > 65
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                              }`}
                              style={{ width: `${server.capacityUsed}%` }}
                            />
                          </div>
                        </div>

                        {/* Readiness Score */}
                        <div>
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Readiness Score</span>
                            <span>{server.readinessScore.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full transition-all ${
                                server.readinessScore >= 99.9
                                  ? 'bg-green-500'
                                  : server.readinessScore >= 99
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(server.readinessScore, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
