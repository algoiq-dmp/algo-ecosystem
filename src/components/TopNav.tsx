'use client';
import { FiSearch } from 'react-icons/fi';

export default function TopNav({ searchQuery, onSearchChange, onToggleLeft, onToggleRight }: {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onToggleLeft: () => void;
  onToggleRight: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg px-3 gap-2 w-64">
        <FiSearch size={14} className="text-slate-400 shrink-0" />
        <input
          type="text" placeholder="Search nodes..."
          value={searchQuery} onChange={(e) => onSearchChange(e.target.value)}
          className="bg-transparent border-none outline-none text-xs py-2 w-full text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
        />
      </div>
    </div>
  );
}
