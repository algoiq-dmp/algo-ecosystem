'use client';

import { useState, useRef, useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  FiSearch, FiSun, FiMoon, FiBell, FiMenu, FiChevronDown,
  FiGrid, FiCpu, FiLayers, FiTarget, FiServer, FiActivity,
  FiGitBranch, FiBox, FiFileText, FiMonitor, FiShield,
  FiShare2, FiBookOpen, FiCheckCircle, FiBarChart2,
  FiPackage, FiTrendingUp, FiClock, FiMap, FiColumns,
  FiCalendar, FiChevronLeft, FiX, FiChevronRight
} from 'react-icons/fi';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';

interface NavItem {
  icon: any;
  label: string;
  href: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const groups: NavGroup[] = [
  {
    title: 'ECOSYSTEM EXPLORER',
    items: [
      { icon: FiGrid, label: 'Topology', href: '/' },
      { icon: FiCpu, label: 'Knowledge Explorer', href: '/engines' },
      { icon: FiLayers, label: 'APIs', href: '/apis' },
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

export default function AppShell({
  children,
  onSearch,
  searchValue = '',
  rightOpen = false,
  rightWidth = 400,
  rightContent,
}: {
  children: ReactNode;
  onSearch?: (v: string) => void;
  searchValue?: string;
  rightOpen?: boolean;
  rightWidth?: number;
  rightContent?: ReactNode;
}) {
  const { theme, toggleTheme } = useTheme();
  const { username, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [sidebarLocked, setSidebarLocked] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isCollapsed = !sidebarLocked && !sidebarHovered;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const sidebarWidth = isCollapsed ? 56 : 260;

  return (
    <div className="h-screen flex overflow-hidden bg-white dark:bg-slate-950 font-sans">
      {/* === AUTO-HIDE LEFT SIDEBAR === */}
      <div
        ref={sidebarRef}
        className={`fixed left-0 top-0 h-full z-40 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-200 ease-out ${
          isCollapsed ? 'w-[56px]' : 'w-[260px]'
        }`}
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
      >
        {/* Logo */}
        <div className={`h-14 flex items-center border-b border-slate-200 dark:border-slate-800 px-3 gap-2.5 shrink-0 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">AI</div>
          {!isCollapsed && (
            <div className="min-w-0">
              <div className="text-sm font-bold text-slate-800 dark:text-white leading-tight">Algo IQ</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">Ecosystem</div>
            </div>
          )}
        </div>

        {/* Nav groups */}
        <div className="flex-1 overflow-y-auto custom-scrollbar py-2">
          {groups.map((group, gi) => (
            <div key={gi} className="mb-1">
              {!isCollapsed && (
                <div className="px-4 pt-2 pb-1 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {group.title}
                </div>
              )}
              {group.items.map((item, ii) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <button
                    key={ii}
                    onClick={() => { router.push(item.href); setSidebarLocked(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-all duration-150 group relative ${
                      isActive
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-r-[3px] border-blue-500'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200 border-r-[3px] border-transparent'
                    } ${isCollapsed ? 'justify-center px-0' : ''}`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon size={18} className="shrink-0" />
                    {!isCollapsed && <span className="truncate text-[13px] font-medium">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Lock toggle */}
        <div className={`border-t border-slate-200 dark:border-slate-800 p-2 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <button
            onClick={() => setSidebarLocked(!sidebarLocked)}
            className={`rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 transition-colors ${isCollapsed ? 'p-2' : 'flex items-center gap-2 px-3 py-2 text-xs w-full'}`}
            title={sidebarLocked ? 'Auto-hide sidebar' : 'Pin sidebar'}
          >
            {sidebarLocked ? <FiChevronLeft size={16} /> : <FiChevronRight size={16} />}
            {!isCollapsed && <span>{sidebarLocked ? 'Unpin' : 'Pin sidebar'}</span>}
          </button>
        </div>
      </div>

      {/* === MAIN CONTENT === */}
      <div
        className="flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-200 ease-out"
        style={{ marginLeft: sidebarWidth }}
      >
        {/* === HEADER WITH DROPDOWN MENUS === */}
        <header className="h-14 shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center px-4 gap-2 z-30" ref={dropdownRef}>
          {/* Hamburger / toggle locked */}
          <button
            onClick={() => setSidebarLocked(!sidebarLocked)}
            className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 shrink-0"
          >
            <FiMenu size={18} />
          </button>

          {/* Dropdown menus */}
          <div className="hidden md:flex items-center gap-0.5 text-[13px] font-medium">
            {groups.map((group, gi) => (
              <div key={gi} className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === group.title ? null : group.title)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                    activeDropdown === group.title ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {group.title.replace('ECOSYSTEM ', '').replace(' PORTAL', '')}
                  <FiChevronDown size={12} className={`transition-transform ${activeDropdown === group.title ? 'rotate-180' : ''}`} />
                </button>

                {activeDropdown === group.title && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-150">
                    {group.items.map((item, ii) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                      return (
                        <button
                          key={ii}
                          onClick={() => { router.push(item.href); setActiveDropdown(null); }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-left transition-colors ${
                            isActive
                              ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <Icon size={15} className="shrink-0" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Search */}
          {onSearch && (
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg px-3 gap-2 w-56 shrink-0">
              <FiSearch size={14} className="text-slate-400 shrink-0" />
              <input
                type="text" placeholder="Search..."
                value={searchValue}
                onChange={(e) => onSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-[13px] py-1.5 w-full text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <button onClick={toggleTheme} className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400">
              {theme === 'light' ? <FiMoon size={16} /> : <FiSun size={16} />}
            </button>
            <button className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 relative">
              <FiBell size={16} />
              <span className="absolute top-1 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
            </button>
            <div className="flex items-center gap-2 ml-1">
              <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 hidden sm:block">{username || 'Admin'}</span>
              <button onClick={logout} className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-[10px] font-semibold hover:ring-2 ring-blue-300 transition-all" title="Logout">
                {username ? username.substring(0, 2).toUpperCase() : 'AD'}
              </button>
            </div>
          </div>
        </header>

        {/* === MAIN CONTENT + RIGHT PANEL === */}
        <div className="flex-1 flex min-h-0" style={{ minHeight: 0 }}>
          <div className="flex-1 min-w-0" style={{ display: 'flex', flexDirection: 'column' }}>{children}</div>

          {/* === AUTO-HIDE RIGHT PANEL === */}
          {rightOpen && (
            <div
              className="shrink-0 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-all duration-200"
              style={{ width: rightWidth }}
            >
              {rightContent}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
