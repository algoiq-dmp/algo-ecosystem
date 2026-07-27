'use client';
import { FiAlertTriangle, FiZap, FiServer } from 'react-icons/fi';

const criticalEngines = [
  { name: 'Lakshmi', role: 'Live Price', desc: 'Exchange lease line → MQ → WebSocket → all engines' },
  { name: 'Vega', role: 'Execution', desc: 'API → Middleware → Order Processor → Broker → Exchange' },
  { name: 'Surya', role: 'Exchange Files', desc: 'Daily BOD/EOD auto-update via extranet API' },
  { name: 'Ganesh', role: 'OHLC Data', desc: 'Multi-timeframe OHLC for all consumers' },
];

export default function CriticalEnginesBadge() {
  return (
    <div className="absolute top-3 left-3 z-20 flex items-start gap-1.5">
      {criticalEngines.map((eng) => (
        <div
          key={eng.name}
          className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-amber-300 dark:border-amber-700 rounded-lg px-2.5 py-1.5 shadow-md hover:shadow-lg transition-shadow cursor-default group"
          title={eng.desc}
        >
          <div className="flex items-center gap-1.5">
            <FiZap size={10} className="text-amber-500" />
            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">{eng.name}</span>
          </div>
          <div className="text-[8px] text-slate-400 dark:text-slate-500 group-hover:text-slate-500 transition-colors">
            {eng.role}
          </div>
        </div>
      ))}
    </div>
  );
}
