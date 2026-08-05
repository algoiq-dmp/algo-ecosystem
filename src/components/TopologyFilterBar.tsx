'use client';
import { FiBox, FiCpu, FiLayers, FiServer, FiActivity, FiGlobe, FiLink, FiAlertTriangle, FiCheck } from 'react-icons/fi';

const typeConfig: Record<string, { label: string; icon: any; color: string }> = {
  product: { label: 'Products', icon: FiBox, color: '#3B82F6' },
  engine: { label: 'Engines', icon: FiCpu, color: '#F59E0B' },
  api: { label: 'APIs', icon: FiLayers, color: '#8B5CF6' },
  infrastructure: { label: 'Infra', icon: FiServer, color: '#14B8A6' },
  strategy: { label: 'Strategies', icon: FiActivity, color: '#6366F1' },
  exchange: { label: 'Exchange', icon: FiGlobe, color: '#6B7280' },
  broker: { label: 'Broker', icon: FiLink, color: '#EC4899' },
};

export default function TopologyFilterBar({
  activeTypes,
  onToggle,
  isBeta,
  onToggleBeta,
}: {
  activeTypes: Set<string>;
  onToggle: (type: string) => void;
  isBeta: boolean;
  onToggleBeta: () => void;
}) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 shrink-0 z-10 backdrop-blur-sm">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1">Show:</span>
      {Object.entries(typeConfig).map(([type, cfg]) => {
        const active = activeTypes.has(type);
        const Icon = cfg.icon;
        return (
          <button
            key={type}
            onClick={() => onToggle(type)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all duration-200 border ${
              active
                ? 'border-transparent text-white shadow-sm'
                : 'border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
            style={active ? { backgroundColor: cfg.color } : {}}
          >
            <Icon size={12} />
            {cfg.label}
          </button>
        );
      })}

      <div className="ml-auto flex items-center gap-2">
        <span className="text-[10px] text-slate-400 dark:text-slate-500">
          {isBeta ? 'Beta Mode' : 'Production Mode'}
        </span>
        <button
          onClick={onToggleBeta}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all duration-200 border ${
            isBeta
              ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
              : 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
          }`}
        >
          {isBeta ? <FiAlertTriangle size={12} /> : <FiCheck size={12} />}
          {isBeta ? 'Beta Version' : 'Production Version'}
        </button>
      </div>
    </div>
  );
}
