'use client';

import { useRouter, usePathname } from 'next/navigation';
import {
  FiGrid, FiCpu, FiLayers, FiTarget, FiServer, FiActivity,
  FiGitBranch, FiBox, FiFileText, FiMonitor, FiShield,
  FiShare2, FiBookOpen, FiCheckCircle, FiBarChart2,
  FiPackage, FiTrendingUp, FiClock, FiMap, FiColumns,
  FiCalendar, FiMenu, FiChevronLeft
} from 'react-icons/fi';
import type { ElementType } from 'react';

interface NavItem {
  icon: ElementType;
  label: string;
  href: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: 'ECOSYSTEM EXPLORER',
    items: [
      { icon: FiGrid, label: 'Topology', href: '/' },
      { icon: FiCpu, label: 'Knowledge Explorer', href: '/engines' },
      { icon: FiLayers, label: 'APIs', href: '/apis' },
      { icon: FiActivity, label: 'API Registry', href: '/api-registry' },
      { icon: FiTarget, label: 'Strategies', href: '/strategies' },
      { icon: FiServer, label: 'Servers', href: '/servers' },
      { icon: FiActivity, label: 'Data Flow', href: '/data-flow' },
      { icon: FiGitBranch, label: 'Dependencies', href: '/dependencies' },
      { icon: FiBox, label: 'Architecture', href: '/architecture' },
      { icon: FiFileText, label: 'Documentation', href: '/docs' },
    ],
  },
  {
    title: 'OPERATIONS',
    items: [
      { icon: FiMonitor, label: 'DXCC Dashboard', href: '/dxcc' },
      { icon: FiShield, label: 'Audit Trail', href: '/audit' },
      { icon: FiShare2, label: 'Knowledge Graph', href: '/knowledge' },
      { icon: FiBookOpen, label: 'ADR Records', href: '/adr' },
      { icon: FiCheckCircle, label: 'Readiness', href: '/readiness' },
    ],
  },
  {
    title: 'PMO PORTAL',
    items: [
      { icon: FiBarChart2, label: 'Dashboard', href: '/pmo' },
      { icon: FiPackage, label: 'Product Master', href: '/pmo/products' },
      { icon: FiLayers, label: 'Version Management', href: '/pmo/versions' },
      { icon: FiTrendingUp, label: 'Release Mgmt', href: '/pmo/releases' },
      { icon: FiClock, label: 'Sprint Board', href: '/pmo/sprints' },
      { icon: FiFileText, label: 'Docs Tracker', href: '/pmo/docs' },
      { icon: FiMap, label: 'Topo Versions', href: '/pmo/topology' },
      { icon: FiColumns, label: 'Compare', href: '/pmo/versions/compare' },
      { icon: FiCalendar, label: 'Timeline', href: '/pmo/versions/timeline' },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col transition-all duration-300 z-30 ${
        collapsed ? 'w-16' : 'w-[260px]'
      }`}
    >
      <div className="h-14 flex items-center px-3 border-b border-slate-200 dark:border-slate-700 shrink-0">
        {!collapsed ? (
          <>
            <button
              onClick={onToggle}
              className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors shrink-0"
            >
              <FiChevronLeft size={18} />
            </button>
            <div className="ml-2.5 w-7 h-7 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              AI
            </div>
            <div className="ml-2.5 leading-tight min-w-0">
              <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">Algo IQ</div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500">Ecosystem</div>
            </div>
          </>
        ) : (
          <button
            onClick={onToggle}
            className="w-full flex justify-center p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
          >
            <FiMenu size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-6">
        {navGroups.map((group) => (
          <div key={group.title}>
            {!collapsed && (
              <div className="px-3 mb-1 text-[10px] font-semibold text-slate-400 dark:text-slate-500 tracking-wider">
                {group.title}
              </div>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <button
                      onClick={() => router.push(item.href)}
                      title={collapsed ? item.label : undefined}
                      className={`group/item relative w-full flex items-center h-9 pl-2 pr-3 rounded-[10px] text-[13px] font-medium transition-all duration-150 ${
                        active
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-l-[3px] border-blue-500'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white border-l-[3px] border-transparent'
                      } ${collapsed ? 'justify-center pl-0' : ''}`}
                    >
                      <Icon size={16} className="shrink-0" />
                      {!collapsed && <span className="ml-3 truncate">{item.label}</span>}
                      {collapsed && (
                        <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 dark:bg-slate-700 text-white text-xs rounded-md shadow-lg opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible pointer-events-none transition-all whitespace-nowrap z-50">
                          {item.label}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className={`border-t border-slate-200 dark:border-slate-700 p-3 ${collapsed ? 'flex justify-center' : ''}`}>
        <div className={`flex items-center ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
            AD
          </div>
          {!collapsed && (
            <div className="ml-2.5 leading-tight min-w-0">
              <div className="text-sm font-medium text-slate-900 dark:text-white truncate">Admin</div>
              <div className="text-[11px] text-slate-400 dark:text-slate-500">Architect</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
