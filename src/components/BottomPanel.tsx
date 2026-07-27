'use client';
import { connectionTypeColors } from '@/data/ecosystem';
import { FiAlertCircle, FiInfo, FiZap } from 'react-icons/fi';

export default function BottomPanel() {
  const legendItems = [
    { color: connectionTypeColors['market-data'], label: 'Market Data' },
    { color: connectionTypeColors['order'], label: 'Orders' },
    { color: connectionTypeColors['trade-confirmation'], label: 'Trade Confirmation' },
    { color: connectionTypeColors['ohlc'], label: 'OHLC' },
    { color: connectionTypeColors['signal'], label: 'Signals' },
    { color: connectionTypeColors['risk'], label: 'Risk' },
    { color: connectionTypeColors['ai'], label: 'AI' },
    { color: connectionTypeColors['audit'], label: 'Audit' },
    { color: connectionTypeColors['monitoring'], label: 'Monitoring' },
    { color: connectionTypeColors['api-call'], label: 'API Calls' },
    { color: connectionTypeColors['mq-broadcast'], label: 'MQ Broadcast' },
  ];

  return (
    <div className="h-10 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center px-4 gap-4 shrink-0 overflow-x-auto">
      <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500 dark:text-slate-400 shrink-0">
        <FiInfo size={12} />
        Click nodes to explore
      </div>

      <div className="w-px h-4 bg-slate-200 dark:bg-slate-700" />

      <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500 dark:text-slate-400 shrink-0">
        <FiZap size={12} className="text-amber-500" />
        Animated packets show data flow
      </div>

      <div className="w-px h-4 bg-slate-200 dark:bg-slate-700" />

      <div className="flex items-center gap-3 shrink-0">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Legend:</span>
        {legendItems.map(item => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-[10px] text-slate-600 dark:text-slate-400 whitespace-nowrap">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2 shrink-0">
        <FiAlertCircle size={12} className="text-amber-500" />
        <span className="text-[10px] text-slate-500 dark:text-slate-400">All systems operational</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      </div>
    </div>
  );
}
