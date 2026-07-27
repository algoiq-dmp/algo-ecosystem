'use client';

import { useState, useMemo } from 'react';
import { strategies, Strategy } from '@/data/strategies';
import {
  FiSearch, FiChevronRight, FiChevronDown, FiTarget, FiShield,
  FiActivity, FiCheck, FiAlertCircle, FiClock, FiTrendingUp,
  FiBarChart2, FiZap, FiExternalLink, FiInfo,
} from 'react-icons/fi';

const categoryColors: Record<Strategy['category'], string> = {
  Arbitrage: 'bg-cyan-600',
  'Delta Neutral': 'bg-blue-600',
  Directional: 'bg-green-600',
  Theta: 'bg-purple-600',
  Volatility: 'bg-amber-600',
  Opportunity: 'bg-pink-600',
  Intraday: 'bg-orange-600',
  Swing: 'bg-teal-600',
  Positional: 'bg-indigo-600',
  Portfolio: 'bg-emerald-600',
  'AI Strategies': 'bg-violet-600',
  Hedging: 'bg-red-600',
  Quantitative: 'bg-slate-600',
};

const categoryLabels: Record<Strategy['category'], string> = {
  Arbitrage: 'Arbitrage',
  'Delta Neutral': 'Delta Neutral',
  Directional: 'Directional',
  Theta: 'Theta',
  Volatility: 'Volatility',
  Opportunity: 'Opportunity',
  Intraday: 'Intraday',
  Swing: 'Swing',
  Positional: 'Positional',
  Portfolio: 'Portfolio',
  'AI Strategies': 'AI Strategies',
  Hedging: 'Hedging',
  Quantitative: 'Quantitative',
};

const statusColors: Record<string, string> = {
  active: 'bg-green-500',
  inactive: 'bg-gray-500',
  testing: 'bg-yellow-500',
};

const approvalColors: Record<string, string> = {
  approved: 'text-green-400 border-green-800 bg-green-900/20',
  pending: 'text-yellow-400 border-yellow-800 bg-yellow-900/20',
  draft: 'text-gray-400 border-gray-800 bg-gray-900/20',
};

export default function StrategiesPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = useMemo(
    () => [...new Set(strategies.map((s) => s.category))],
    []
  );

  const filtered = useMemo(() => {
    return strategies.filter((s) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.objective.toLowerCase().includes(q);
      const matchCat =
        activeCategory === 'all' || s.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [search, activeCategory]);

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <FiTarget className="text-2xl text-green-400" />
          <h1 className="text-3xl font-bold">Strategy Explorer</h1>
        </div>
        <p className="text-gray-400 mb-6">
          Explore all trading strategies deployed and in testing across the ecosystem
        </p>

        {/* Search */}
        <div className="relative max-w-lg mb-6">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search strategies by name, description, objective..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
          />
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === 'all'
                ? 'bg-green-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-gray-200'
            }`}
          >
            All ({strategies.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? `${categoryColors[cat]} text-white`
                  : 'bg-gray-800 text-gray-400 hover:text-gray-200'
              }`}
            >
              {categoryLabels[cat]} ({strategies.filter((s) => s.category === cat).length})
            </button>
          ))}
        </div>

        {/* Strategy Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((strat) => {
            const isExpanded = expandedId === strat.id;
            return (
              <div
                key={strat.id}
                className={`bg-gray-800/60 border border-gray-700 rounded-xl overflow-hidden transition-all ${
                  isExpanded ? 'lg:col-span-2 xl:col-span-3' : ''
                }`}
              >
                {/* Card Header */}
                <div
                  onClick={() =>
                    setExpandedId(isExpanded ? null : strat.id)
                  }
                  className="p-5 cursor-pointer hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-100">
                        {strat.name}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${categoryColors[strat.category]}`}
                      >
                        {categoryLabels[strat.category]}
                      </span>
                    </div>
                    <span
                      className={`inline-block w-2 h-2 rounded-full mt-1.5 ${statusColors[strat.liveStatus]}`}
                      title={strat.liveStatus}
                    />
                  </div>

                  <div className="flex items-center gap-2 mb-3 text-xs text-gray-400">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${statusColors[strat.liveStatus]}`}
                    />
                    <span>{strat.liveStatus}</span>
                    <span>&middot;</span>
                    <span>v{strat.version}</span>
                    <span>&middot;</span>
                    <span
                      className={`px-2 py-0.5 rounded border text-xs ${approvalColors[strat.approvalStatus]}`}
                    >
                      {strat.approvalStatus}
                    </span>
                  </div>

                  <p className="text-sm text-gray-400 line-clamp-2">
                    {strat.description}
                  </p>

                  <div className="flex items-center gap-1 mt-4 text-green-400 text-sm">
                    {isExpanded ? (
                      <>
                        Collapse <FiChevronDown />
                      </>
                    ) : (
                      <>
                        View Details <FiChevronRight />
                      </>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-6 border-t border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                      {/* Objective */}
                      <div className="bg-gray-800/50 rounded-xl p-4">
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                          <FiTarget /> Objective
                        </h4>
                        <p className="text-sm text-gray-300">{strat.objective}</p>
                      </div>

                      {/* Entry Logic */}
                      <div className="bg-gray-800/50 rounded-xl p-4">
                        <h4 className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                          <FiZap /> Entry Logic
                        </h4>
                        <p className="text-sm text-gray-300">{strat.entryLogic}</p>
                      </div>

                      {/* Exit Logic */}
                      <div className="bg-gray-800/50 rounded-xl p-4">
                        <h4 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                          <FiActivity /> Exit Logic
                        </h4>
                        <p className="text-sm text-gray-300">{strat.exitLogic}</p>
                      </div>

                      {/* Risk Rules */}
                      <div className="bg-gray-800/50 rounded-xl p-4">
                        <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                          <FiShield /> Risk Rules
                        </h4>
                        <p className="text-sm text-gray-300">{strat.riskRules}</p>
                      </div>

                      {/* Capital & Margin */}
                      <div className="bg-gray-800/50 rounded-xl p-4">
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                          <FiBarChart2 /> Capital & Margin
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <p className="text-gray-500 text-xs">Capital Requirement</p>
                            <p className="text-gray-300">{strat.capitalRequirement.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Margin Requirement</p>
                            <p className="text-gray-300">{strat.marginRequirement.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>

                      {/* Performance Stats */}
                      <div className="bg-gray-800/50 rounded-xl p-4">
                        <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                          <FiTrendingUp /> Performance Stats
                        </h4>
                        <p className="text-sm text-gray-300">{strat.performanceStats}</p>
                      </div>

                      {/* Dependencies */}
                      <div className="bg-gray-800/50 rounded-xl p-4">
                        <h4 className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                          <FiInfo /> Dependencies
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {strat.dependencies.map((d, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-purple-900/30 text-purple-300 rounded text-xs cursor-pointer hover:bg-purple-900/50 transition-colors"
                              title={`Click to navigate to ${d}`}
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Required APIs */}
                      <div className="bg-gray-800/50 rounded-xl p-4">
                        <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                          <FiExternalLink /> Required APIs
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {strat.requiredApis.map((a, i) => (
                            <span key={i} className="px-2 py-1 bg-cyan-900/30 text-cyan-300 rounded text-xs">
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Required Engines */}
                      <div className="bg-gray-800/50 rounded-xl p-4">
                        <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
                          Required Engines
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {strat.requiredEngines.map((e, i) => (
                            <span key={i} className="px-2 py-1 bg-amber-900/30 text-amber-300 rounded text-xs">
                              {e}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Required Apps */}
                      <div className="bg-gray-800/50 rounded-xl p-4">
                        <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
                          Required Apps
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {strat.requiredApplications.map((a, i) => (
                            <span key={i} className="px-2 py-1 bg-blue-900/30 text-blue-300 rounded text-xs">
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Compatible Brokers */}
                      <div className="bg-gray-800/50 rounded-xl p-4">
                        <h4 className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-2">
                          Compatible Brokers
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {strat.compatibleBrokers.map((b, i) => (
                            <span key={i} className="px-2 py-1 bg-green-900/30 text-green-300 rounded text-xs">
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Approval & Version */}
                    <div className="mt-6 pt-4 border-t border-gray-700 flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <FiCheck className={strat.approvalStatus === 'approved' ? 'text-green-400' : 'text-yellow-400'} />
                        <span>Approval: {strat.approvalStatus}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiClock />
                        <span>Version: v{strat.version}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <FiAlertCircle className="text-4xl text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">No strategies match your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
