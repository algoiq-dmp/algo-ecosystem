'use client';
import { nodes, serverGroups } from '@/data/ecosystem';
import { EcosystemNode } from '@/types';
import { FiServer, FiCpu, FiDatabase, FiShield, FiActivity, FiLayers, FiBox } from 'react-icons/fi';
import { useState } from 'react';

interface LeftSidebarProps {
  onSelectNode: (id: string) => void;
  selectedNode: string | null;
  isOpen: boolean;
  hiddenNodeIds?: Set<string>;
}

type TreeView = 'server' | 'type' | 'category';

const typeIcons: Record<string, React.ReactNode> = {
  product: <FiBox size={14} />,
  server: <FiServer size={14} />,
  engine: <FiCpu size={14} />,
  api: <FiLayers size={14} />,
  database: <FiDatabase size={14} />,
  broker: <FiActivity size={14} />,
  exchange: <FiShield size={14} />,
  infrastructure: <FiServer size={14} />,
  strategy: <FiActivity size={14} />,
};

const typeColors: Record<string, string> = {
  product: '#3B82F6',
  server: '#10B981',
  engine: '#F59E0B',
  api: '#8B5CF6',
  database: '#EF4444',
  broker: '#EC4899',
  exchange: '#6B7280',
  infrastructure: '#14B8A6',
  strategy: '#6366F1',
};

export default function LeftSidebar({ onSelectNode, selectedNode, isOpen, hiddenNodeIds }: LeftSidebarProps) {
  const [view, setView] = useState<TreeView>('server');

  if (!isOpen) return null;

  const visibleNodes = nodes.filter(n => !hiddenNodeIds?.has(n.id));

  const groupedByServer = serverGroups.map(group => ({
    label: group.name,
    ip: group.ip,
    color: group.color,
    nodes: visibleNodes.filter(n => group.nodes.includes(n.id)),
  }));

  const groupedByType = ['product', 'engine', 'api', 'strategy', 'infrastructure', 'exchange', 'broker'].map(type => ({
    label: type.charAt(0).toUpperCase() + type.slice(1),
    type,
    nodes: visibleNodes.filter(n => n.type === type),
  }));

  const groupedByCategory = (() => {
    const cats = new Map<string, EcosystemNode[]>();
    visibleNodes.forEach(n => {
      const cat = n.category || 'other';
      if (!cats.has(cat)) cats.set(cat, []);
      cats.get(cat)!.push(n);
    });
    return Array.from(cats.entries()).map(([label, nods]) => ({ label: label.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), nodes: nods }));
  })();

  const currentGroup = view === 'server' ? groupedByServer :
    view === 'type' ? groupedByType : groupedByCategory;

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 overflow-hidden">
      <div className="p-3 border-b border-slate-200 dark:border-slate-800">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Navigation</p>
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          {(['server', 'type', 'category'] as TreeView[]).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`flex-1 text-[10px] font-medium py-1.5 rounded-md transition-colors ${view === v ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              {v === 'server' ? 'Server' : v === 'type' ? 'Type' : 'Category'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {currentGroup.map((group: any, i: number) => (
          <div key={i} className="border-b border-slate-100 dark:border-slate-800/50 last:border-none">
            <div className="flex items-center gap-2 px-3 py-2">
              {view === 'server' && (
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: group.color }} />
              )}
              {view === 'type' && (
                <span className="text-slate-500">{typeIcons[group.type]}</span>
              )}
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                {group.label}
              </span>
              {view === 'server' && group.ip && (
                <span className="text-[9px] text-slate-400 dark:text-slate-500 ml-auto">{group.ip}</span>
              )}
              <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-auto">{group.nodes.length}</span>
            </div>
            <div className="pb-1">
              {group.nodes.map((node: EcosystemNode) => (
                <button
                  key={node.id}
                  onClick={() => onSelectNode(node.id)}
                  className={`w-full text-left px-5 py-1.5 text-xs flex items-center gap-2 transition-colors
                    ${selectedNode === node.id
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-r-2 border-blue-500'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                >
                  <span className={`w-3 h-3 rounded-full shrink-0 flex items-center justify-center`}
                    style={{ backgroundColor: node.status === 'online' ? '#10B981' : node.status === 'degraded' ? '#F59E0B' : '#EF4444' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </span>
                  <span className="truncate">{node.name}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
