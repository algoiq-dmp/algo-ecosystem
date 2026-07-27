'use client';
import { useState } from 'react';
import { adrs } from '@/data/adrs';
import { FiChevronDown, FiChevronRight, FiCheck, FiAlertTriangle, FiTarget, FiBookOpen } from 'react-icons/fi';

export default function AdrPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="h-full overflow-y-auto p-6 font-sans">
      <div className="flex items-center gap-3 mb-2">
        <FiBookOpen size={22} className="text-blue-400" />
        <h1 className="text-2xl font-bold">Architecture Decision Records</h1>
      </div>
      <p className="text-slate-400 mb-6 text-sm">Key architectural decisions made for the ALGO IQ ecosystem</p>

      <div className="space-y-4 max-w-4xl">
        {adrs.map((adr, index) => {
          const isExpanded = expandedId === adr.id;
          return (
            <div
              key={adr.id}
              className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden transition-all print:border print:border-gray-300 print:bg-white print:text-black"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : adr.id)}
                className="w-full text-left p-5 flex items-start gap-4 hover:bg-slate-800/30 transition-colors"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-sm">
                  {(index + 1).toString().padStart(2, '0')}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-slate-100">{adr.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{adr.problemStatement}</p>
                </div>
                <div className="flex-shrink-0 text-slate-400 mt-1">
                  {isExpanded ? <FiChevronDown size={18} /> : <FiChevronRight size={18} />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 border-t border-slate-800 space-y-4 print:text-black print:border-gray-200">
                  <div className="pt-4">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Problem Statement</h4>
                    <p className="text-sm text-slate-300">{adr.problemStatement}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Context</h4>
                    <p className="text-sm text-slate-300">{adr.context}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Alternatives Considered</h4>
                    <ul className="space-y-1.5">
                      {adr.alternatives.map((alt, i) => (
                        <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                          <span className="text-blue-400 font-medium mt-0.5">{i + 1}.</span>
                          {alt}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <FiTarget size={14} className="text-blue-400" />
                      <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Final Decision</h4>
                    </div>
                    <p className="text-sm text-slate-200 font-medium">{adr.decision}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Rationale</h4>
                    <p className="text-sm text-slate-300">{adr.rationale}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1.5">Benefits</h4>
                      <ul className="space-y-1">
                        {adr.benefits.map((b, i) => (
                          <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                            <FiCheck size={10} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1.5">Risks</h4>
                      <ul className="space-y-1">
                        {adr.risks.map((r, i) => (
                          <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                            <FiAlertTriangle size={10} className="text-amber-400 mt-0.5 flex-shrink-0" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-1.5">Dependencies</h4>
                      <ul className="space-y-1">
                        {adr.dependencies.map((d, i) => (
                          <li key={i} className="text-xs text-slate-300">{d}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Future Considerations</h4>
                    <p className="text-xs text-slate-400">{adr.futureConsiderations}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
