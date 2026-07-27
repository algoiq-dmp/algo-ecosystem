'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  FiCheck, FiX, FiEdit, FiArchive, FiCopy, FiPlus,
  FiSearch, FiBox, FiTrash2,
} from 'react-icons/fi';
import { usePMOStore } from '@/stores';
interface VersionDef {
  id: string;
  name: string;
  label: string;
  status: 'active' | 'draft' | 'archived';
  releaseDate: string;
  description: string;
  order: number;
}

const statusBadge: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  draft: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  archived: 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
};

const categoryColors: Record<string, string> = {
  Core: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Analytics: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  AI: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  Integration: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
  Security: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  Infrastructure: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  Strategy: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  Communication: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  Data: 'bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-300',
  Trading: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
};

function categoryBadgeClass(cat: string) {
  return categoryColors[cat] ?? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
}

export default function VersionsPage() {
  const products = usePMOStore((s) => s.products);
  const versionDefinitions = usePMOStore((s) => s.versionDefinitions);
  const productVersionAssignments = usePMOStore((s) => s.productVersionAssignments);
  const setProductVersion = usePMOStore((s) => s.setProductVersion);
  const bulkAssignVersion = usePMOStore((s) => s.bulkAssignVersion);
  const setSelectedVersion = usePMOStore((s) => s.setSelectedVersion);
  const addVersion = usePMOStore((s) => s.addVersion);
  const renameVersion = usePMOStore((s) => s.renameVersion);
  const archiveVersion = usePMOStore((s) => s.archiveVersion);
  const cloneVersion = usePMOStore((s) => s.cloneVersion);
  const deleteVersion = usePMOStore((s) => s.deleteVersion);

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterVersion, setFilterVersion] = useState('All');
  const [rowSelected, setRowSelected] = useState<Set<string>>(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingVersionId, setEditingVersionId] = useState<string | null>(null);

  const [newVersion, setNewVersion] = useState({
    name: '',
    status: 'draft' as VersionDef['status'],
    releaseDate: '',
    description: '',
  });

  const categories: string[] = useMemo(() => {
    const cats = new Set<string>(products.map((p) => p.category));
    return ['All', ...Array.from(cats).sort()];
  }, [products]);

  // productVersionAssignments uses versionId, not versionLabel
  const versionProductCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const a of productVersionAssignments) {
      if (a.active) {
        map[a.versionId] = (map[a.versionId] || 0) + 1;
      }
    }
    return map;
  }, [productVersionAssignments]);

  const productVersionLookup = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    for (const a of productVersionAssignments) {
      if (!map[a.productId]) map[a.productId] = new Set();
      if (a.active) map[a.productId].add(a.versionId);
    }
    return map;
  }, [productVersionAssignments]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterCategory !== 'All' && p.category !== filterCategory) return false;
      if (filterVersion !== 'All') {
        const activeVersions = productVersionLookup[p.id];
        if (!activeVersions || !activeVersions.has(filterVersion)) return false;
      }
      return true;
    });
  }, [products, search, filterCategory, filterVersion, productVersionLookup]);

  const toggleRow = useCallback((id: string) => {
    setRowSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    if (rowSelected.size === filtered.length && filtered.length > 0) {
      setRowSelected(new Set());
    } else {
      setRowSelected(new Set(filtered.map((p) => p.id)));
    }
  }, [rowSelected.size, filtered]);

  const handleToggleVersion = useCallback(
    (productId: string, versionId: string) => {
      const currentlyActive =
        productVersionAssignments.find(
          (a) => a.productId === productId && a.versionId === versionId
        )?.active ?? false;
      setProductVersion(productId, versionId, !currentlyActive);
    },
    [productVersionAssignments, setProductVersion],
  );

  const handleBulkAssign = useCallback(
    (versionId: string) => {
      if (rowSelected.size === 0) return;
      bulkAssignVersion(Array.from(rowSelected), versionId, true);
      setRowSelected(new Set());
    },
    [rowSelected, bulkAssignVersion],
  );

  const handleBulkRemove = useCallback(
    (versionId: string) => {
      if (rowSelected.size === 0) return;
      bulkAssignVersion(Array.from(rowSelected), versionId, false);
      setRowSelected(new Set());
    },
    [rowSelected, bulkAssignVersion],
  );

  const handleSaveVersion = useCallback(() => {
    if (!newVersion.name.trim()) return;
    if (editingVersionId) {
      renameVersion(editingVersionId, newVersion.name.trim());
    } else {
      addVersion({
        id: newVersion.name.toLowerCase().replace(/\s+/g, '-'),
        name: newVersion.name.trim(),
        label: newVersion.name.trim(),
        status: newVersion.status,
        releaseDate: newVersion.releaseDate,
        description: newVersion.description,
        order: versionDefinitions.length + 1,
      });
    }
    setShowCreateModal(false);
    setEditingVersionId(null);
    setNewVersion({ name: '', status: 'draft', releaseDate: '', description: '' });
  }, [newVersion, editingVersionId, renameVersion, addVersion, versionDefinitions.length]);

  const openCreateModal = useCallback(() => {
    setEditingVersionId(null);
    setNewVersion({ name: '', status: 'draft', releaseDate: '', description: '' });
    setShowCreateModal(true);
  }, []);

  const openEditModal = useCallback((vd: VersionDef) => {
    setEditingVersionId(vd.id);
    setNewVersion({
      name: vd.name,
      status: vd.status,
      releaseDate: vd.releaseDate,
      description: vd.description,
    });
    setShowCreateModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowCreateModal(false);
    setEditingVersionId(null);
  }, []);

  const handleClone = useCallback(
    (vd: VersionDef) => {
      const newName = window.prompt('Enter name for cloned version:', `${vd.name} (copy)`);
      if (newName?.trim()) cloneVersion(vd.id, newName.trim());
    },
    [cloneVersion],
  );

  const handleDelete = useCallback(
    (vd: VersionDef) => {
      if (window.confirm(`Permanently delete "${vd.name}"? This will remove all assignments for this version.`)) {
        deleteVersion(vd.id);
      }
    },
    [deleteVersion],
  );

  const isChecked = useCallback(
    (productId: string, versionId: string) =>
      productVersionAssignments.find(
        (a) => a.productId === productId && a.versionId === versionId,
      )?.active ?? false,
    [productVersionAssignments],
  );

  return (
    <div className="h-full overflow-y-auto font-sans">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-5">
        <div className="flex flex-wrap items-center justify-between gap-4 max-w-[1800px] mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Version Management</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {versionDefinitions.length} weekly versions &middot; {products.length} products
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
            >
              <FiPlus className="w-4 h-4" /> Create Version
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-6 py-6 space-y-6">
        {/* Version Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {versionDefinitions.map((vd) => (
            <div
              key={vd.id}
              onClick={() => setSelectedVersion(vd.id)}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all cursor-pointer relative group"
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg truncate">{vd.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${statusBadge[vd.status]}`}
                    >
                      {vd.status}
                    </span>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-3xl font-bold text-blue-600">{versionProductCounts[vd.id] || 0}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">products assigned</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{vd.releaseDate}</p>
              <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); openEditModal(vd); }}
                  className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  title="Edit"
                >
                  <FiEdit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); archiveVersion(vd.id); }}
                  className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  title="Archive"
                >
                  <FiArchive className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleClone(vd); }}
                  className="p-1.5 text-slate-400 hover:text-purple-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  title="Clone"
                >
                  <FiCopy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(vd); }}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors ml-auto"
                  title="Delete"
                >
                  <FiTrash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
              ))}
            </select>
            <select
              value={filterVersion}
              onChange={(e) => setFilterVersion(e.target.value)}
              className="px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="All">All Versions</option>
              {versionDefinitions.map((vd) => (
                <option key={vd.id} value={vd.id}>{vd.name}</option>
              ))}
            </select>
          </div>

          {/* Inline Bulk Actions */}
          {rowSelected.size > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center gap-3 flex-wrap">
              <span className="text-sm text-slate-500 dark:text-slate-400">{rowSelected.size} selected</span>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <select
                onChange={(e) => {
                  if (e.target.value) { handleBulkAssign(e.target.value); e.target.value = ''; }
                }}
                className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none"
                defaultValue=""
              >
                <option value="" disabled>Assign to version...</option>
                {versionDefinitions.map((vd) => (
                  <option key={vd.id} value={vd.id}>{vd.name}</option>
                ))}
              </select>
              <select
                onChange={(e) => {
                  if (e.target.value) { handleBulkRemove(e.target.value); e.target.value = ''; }
                }}
                className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none"
                defaultValue=""
              >
                <option value="" disabled>Remove from version...</option>
                {versionDefinitions.map((vd) => (
                  <option key={vd.id} value={vd.id}>{vd.name}</option>
                ))}
              </select>
              <button
                onClick={() => setRowSelected(new Set())}
                className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Main Grid */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <th className="px-4 py-3 text-left w-10">
                    <button onClick={toggleAll} className="text-slate-400 hover:text-blue-500 transition-colors">
                      {rowSelected.size === filtered.length && filtered.length > 0 ? (
                        <FiCheck className="w-4 h-4 text-blue-500" />
                      ) : (
                        <FiX className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Product Name
                  </th>
                  {versionDefinitions.map((vd) => (
                    <th
                      key={vd.id}
                      className="px-3 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap"
                    >
                      {vd.name}
                    </th>
                  ))}
                  <th className="px-3 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3 + versionDefinitions.length}
                      className="px-4 py-16 text-center text-slate-400 dark:text-slate-500"
                    >
                      <FiBox className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No products match your filters.</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleRow(p.id)}
                          className="text-slate-400 hover:text-blue-500 transition-colors"
                        >
                          {rowSelected.has(p.id) ? (
                            <FiCheck className="w-4 h-4 text-blue-500" />
                          ) : (
                            <FiX className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      <td className="px-3 py-3">
                        <div className="font-medium text-slate-800 dark:text-white">{p.name}</div>
                        <span
                          className={`inline-block mt-0.5 px-1.5 py-0.5 text-[10px] font-medium rounded-md ${categoryBadgeClass(p.category)}`}
                        >
                          {p.category}
                        </span>
                      </td>
                      {versionDefinitions.map((vd) => {
                        const checked = isChecked(p.id, vd.id);
                        return (
                          <td key={vd.id} className="px-3 py-3 text-center">
                            <button
                              onClick={() => handleToggleVersion(p.id, vd.id)}
                              className="transition-colors p-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                              {checked ? (
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-blue-600 text-white">
                                  <FiCheck className="w-3.5 h-3.5" />
                                </span>
                              ) : (
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600">
                                  <FiX className="w-3 h-3 text-transparent" />
                                </span>
                              )}
                            </button>
                          </td>
                        );
                      })}
                      <td className="px-3 py-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                            p.status === 'production'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                              : p.status === 'testing' || p.status === 'uat' || p.status === 'security-review'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 text-xs text-slate-500 dark:text-slate-400">
            Showing {filtered.length} of {products.length} products
          </div>
        </div>
      </div>

      {/* Create / Edit Version Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 dark:bg-black/60" onClick={closeModal} />
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg">
            <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingVersionId ? 'Edit Version' : 'Create Version'}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={newVersion.name}
                    onChange={(e) => setNewVersion((v) => ({ ...v, name: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30"
                    placeholder="e.g. Week 5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Release Date
                  </label>
                  <input
                    type="date"
                    value={newVersion.releaseDate}
                    onChange={(e) => setNewVersion((v) => ({ ...v, releaseDate: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Status
                  </label>
                  <select
                    value={newVersion.status}
                    onChange={(e) =>
                      setNewVersion((v) => ({ ...v, status: e.target.value as VersionDef['status'] }))
                    }
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Description
                </label>
                <textarea
                  value={newVersion.description}
                  onChange={(e) => setNewVersion((v) => ({ ...v, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={closeModal}
                  className="flex-1 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveVersion}
                  className="flex-1 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm"
                >
                  {editingVersionId ? 'Save Changes' : 'Create Version'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
