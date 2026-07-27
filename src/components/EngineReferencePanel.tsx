'use client';
import { useState } from 'react';
import { FiBook, FiX, FiSearch, FiChevronRight, FiZap } from 'react-icons/fi';
import { engineReference } from '@/data/engine-reference';

export default function EngineReferencePanel() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = search.trim()
    ? engineReference.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || e.oneLiner.toLowerCase().includes(search.toLowerCase()))
    : engineReference;

  const selected = engineReference.find(e => e.id === selectedId);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="absolute top-3 left-[380px] z-20 flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
        title="Engine Reference"
      >
        <FiBook size={14} />
        Engine Reference
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="fixed left-[316px] top-0 bottom-0 z-50 w-[500px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-indigo-50 to-white dark:from-indigo-950 dark:to-slate-900">
              <div>
                <div className="text-sm font-bold text-slate-800 dark:text-white">Engine Reference</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">{engineReference.length} engines, APIs &amp; products</div>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                <FiX size={16} />
              </button>
            </div>

            <div className="p-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg px-3 gap-2">
                <FiSearch size={14} className="text-slate-400" />
                <input
                  value={search}
                  onChange={e => { setSearch(e.target.value); setSelectedId(null); }}
                  placeholder="Search engines, APIs, products..."
                  className="bg-transparent border-none outline-none text-xs py-2 w-full text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {filtered.map(eng => (
                <button
                  key={eng.id}
                  onClick={() => setSelectedId(selectedId === eng.id ? null : eng.id)}
                  className={`w-full text-left px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                    selectedId === eng.id ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                      eng.type === 'engine' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' :
                      eng.type === 'api' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' :
                      'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                    }`}>{eng.type}</span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-white">{eng.name}</span>
                    <FiChevronRight size={12} className={`ml-auto text-slate-400 transition-transform ${selectedId === eng.id ? 'rotate-90' : ''}`} />
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{eng.oneLiner}</div>

                  {selectedId === eng.id && eng.points && (
                    <div className="mt-2 space-y-1.5 pl-1">
                      {eng.points.map((p, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-[10px]">
                          <FiZap size={10} className="text-amber-500 mt-0.5 shrink-0" />
                          <div>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">{p.title}</span>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{p.explanation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
