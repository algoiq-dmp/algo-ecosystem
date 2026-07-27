'use client';
import { useState, useEffect, useMemo } from 'react';
import { serverGroups, nodes } from '@/data/ecosystem';
import { FiServer, FiCpu, FiActivity, FiShield, FiHardDrive, FiWifi, FiCloud, FiLock, FiAlertTriangle } from 'react-icons/fi';

function randomInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const mockAlerts = [
  { timestamp: '2026-07-23 14:32:01', severity: 'critical', source: 'Vega', message: 'Order execution latency exceeded 500ms threshold' },
  { timestamp: '2026-07-23 14:28:45', severity: 'warning', source: 'MQ', message: 'Message queue depth exceeded 10,000 on trade-confirmation queue' },
  { timestamp: '2026-07-23 14:15:22', severity: 'critical', source: 'Feed Server', message: 'Exchange FIX connection dropped, reconnecting' },
  { timestamp: '2026-07-23 13:58:10', severity: 'info', source: 'Ganesh', message: 'OHLC computation completed for 1min interval batch' },
  { timestamp: '2026-07-23 13:45:33', severity: 'warning', source: 'Kavach', message: 'Position exposure exceeded 80% of defined limit for strategy AALAP-7' },
  { timestamp: '2026-07-23 13:30:05', severity: 'critical', source: 'Rakshak', message: 'Emergency square-off triggered for strategy AALAP-3 due to breach' },
  { timestamp: '2026-07-23 13:12:18', severity: 'info', source: 'DXCC', message: 'Daily health check completed: 28/30 components healthy' },
  { timestamp: '2026-07-23 12:55:40', severity: 'warning', source: 'Surya', message: 'BOD file processing delayed by 5 minutes due to exchange API timeout' },
];

const severityColors: Record<string, string> = {
  critical: 'bg-red-500/10 text-red-400 border-red-500/30',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  info: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
};

const severityDots: Record<string, string> = {
  critical: 'bg-red-500',
  warning: 'bg-amber-500',
  info: 'bg-blue-400',
};

function AnimatedCounter({ value, duration = 1500 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start: number;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setDisplay(Math.floor(progress * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value, duration]);

  return <>{display}</>;
}

export default function DxccPage() {
  const [cpuValues] = useState(() => serverGroups.map(() => randomInRange(30, 80)));
  const [memValues] = useState(() => serverGroups.map(() => randomInRange(40, 90)));
  const [diskValues] = useState(() => serverGroups.map(() => randomInRange(20, 70)));
  const [latencyValues] = useState(() => serverGroups.map(() => randomInRange(1, 15)));

  const serverHealth = useMemo(() => {
    const online = nodes.filter(n => n.status === 'online').length;
    return Math.round((online / nodes.length) * 100);
  }, []);

  const enginesOnline = useMemo(() => nodes.filter(n => n.type === 'engine' && n.status === 'online').length, []);
  const activeStrategies = useMemo(() => nodes.filter(n => n.type === 'strategy' && n.status === 'online').length, []);

  return (
    <div className="h-full overflow-y-auto p-6 font-sans">
      <h1 className="text-2xl font-bold mb-1">DXCC Operations Dashboard</h1>
      <p className="text-slate-400 mb-6 text-sm">Execution Command Center - Real-time monitoring</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
            <FiServer size={14} /> Total Servers
          </div>
          <div className="text-2xl font-bold text-blue-400"><AnimatedCounter value={serverGroups.length} /></div>
        </div>
        <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
            <FiCpu size={14} /> Engines Online
          </div>
          <div className="text-2xl font-bold text-emerald-400"><AnimatedCounter value={enginesOnline} /></div>
        </div>
        <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
            <FiActivity size={14} /> Active Strategies
          </div>
          <div className="text-2xl font-bold text-amber-400"><AnimatedCounter value={activeStrategies} /></div>
        </div>
        <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
            <FiShield size={14} /> System Health
          </div>
          <div className="text-2xl font-bold text-green-400"><AnimatedCounter value={serverHealth} />%</div>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-3">Server Health</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 mb-6">
        {serverGroups.map((sg, i) => (
          <div key={sg.id} className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-sm">{sg.name}</span>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-400 relative">
                  <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
                </div>
                <span className="text-xs text-green-400">Online</span>
              </div>
            </div>
            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>CPU</span><span>{cpuValues[i]}%</span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${cpuValues[i] > 70 ? 'bg-red-500' : cpuValues[i] > 50 ? 'bg-amber-500' : 'bg-green-500'}`}
                    style={{ width: `${cpuValues[i]}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Memory</span><span>{memValues[i]}%</span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${memValues[i] > 80 ? 'bg-red-500' : memValues[i] > 60 ? 'bg-amber-500' : 'bg-green-500'}`}
                    style={{ width: `${memValues[i]}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Disk</span><span>{diskValues[i]}%</span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${diskValues[i] > 60 ? 'bg-red-500' : diskValues[i] > 40 ? 'bg-amber-500' : 'bg-green-500'}`}
                    style={{ width: `${diskValues[i]}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Latency</span>
                <span className={`font-mono ${latencyValues[i] > 10 ? 'text-amber-400' : 'text-green-400'}`}>{latencyValues[i]}ms</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <div className="flex items-center gap-2 bg-slate-800/60 px-3 py-1.5 rounded-full border border-slate-700/50">
          <div className="w-2 h-2 rounded-full bg-green-400 relative">
            <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
          </div>
          <span className="text-xs text-slate-300">MQ Status: <span className="text-green-400">Connected</span></span>
        </div>
        <div className="flex items-center gap-2 bg-slate-800/60 px-3 py-1.5 rounded-full border border-slate-700/50">
          <div className="w-2 h-2 rounded-full bg-green-400 relative">
            <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
          </div>
          <span className="text-xs text-slate-300">WebSocket: <span className="text-green-400">Active</span></span>
        </div>
        <div className="flex items-center gap-2 bg-slate-800/60 px-3 py-1.5 rounded-full border border-slate-700/50">
          <div className="w-2 h-2 rounded-full bg-green-400 relative">
            <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
          </div>
          <span className="text-xs text-slate-300">API Status: <span className="text-green-400">Healthy</span></span>
        </div>
        <div className="flex items-center gap-2 bg-slate-800/60 px-3 py-1.5 rounded-full border border-slate-700/50">
          <div className="w-2 h-2 rounded-full bg-amber-400 relative">
            <div className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-75" />
          </div>
          <span className="text-xs text-slate-300">FIX Engine: <span className="text-amber-400">Degraded</span></span>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <FiAlertTriangle size={18} className="text-amber-400" />
        Recent Alerts
      </h2>
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Timestamp</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Severity</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Source</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Message</th>
              </tr>
            </thead>
            <tbody>
              {mockAlerts.map((alert, i) => (
                <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 text-xs text-slate-400 font-mono">{alert.timestamp}</td>
                  <td className="py-2.5 px-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded border ${severityColors[alert.severity]}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${severityDots[alert.severity]}`} />
                      <span className="capitalize">{alert.severity}</span>
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-xs text-slate-300">{alert.source}</td>
                  <td className="py-2.5 px-4 text-xs text-slate-400">{alert.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
