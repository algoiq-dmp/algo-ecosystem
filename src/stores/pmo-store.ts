import { create } from 'zustand';
import type { ProductEntry, DocumentationItem, ReleaseEntry, SprintEntry, SprintTask, ProductVersion, VersionDefinition, ProductVersionAssignment, ConnectionVersion, ServerVersion, VersionChange } from '../data/pmo-types';
import { seedProducts, seedDocs, seedReleases, seedSprints, seedVersions } from '../data/pmo-seed';
import { connections, serverGroups } from '../data/ecosystem';
import * as XLSX from 'xlsx';

const seedProductIds = new Set(seedProducts.map((p) => p.id));

const v1ActiveProducts = new Set(['ganesh', 'feed-server', 'mq', 'vega', 'talkoptions', 'talkdelta', 'suchak', 'kavach', 'talkoffice', 'dxcc', 'surya', 'local-websocket']);
const v2ActiveProducts = new Set([...v1ActiveProducts, 'talkdelta-ai', 'delta-xi', 'vyuh', 'spreadwatch', 'strategy-factory', 'kuber-alpha', 'narad', 'suraksha', 'chitragupta', 'parikshak', 'simulator']);
const v3ActiveProducts = new Set([...v2ActiveProducts, 'hanuman', 'talkstrategy-api', 'talkstrategy-app', 'aalap-calls', 'rakshak', 'manthan', 'theta-yantra', 'tradepilot', 'odin', 'lakshmi', 'garuda']);

const versionActiveMap: Record<string, Set<string>> = {
  'week-1': v1ActiveProducts,
  'week-2': v2ActiveProducts,
  'week-3': v3ActiveProducts,
  'week-4': v3ActiveProducts,
  production: v3ActiveProducts,
};

const allVersionIds = ['week-1', 'week-2', 'week-3', 'week-4', 'production'];

const today = new Date();
const week1 = new Date(today);
const week2 = new Date(today); week2.setDate(today.getDate() + 7);
const week3 = new Date(today); week3.setDate(today.getDate() + 14);
const week4 = new Date(today); week4.setDate(today.getDate() + 21);
const fmt = (d: Date) => d.toISOString().split('T')[0];

const seedVersionDefinitions: VersionDefinition[] = [
  { id: 'week-1', name: 'Week 1', label: 'Week 1', status: 'active', releaseDate: fmt(week1), description: 'Week 1 — Core infrastructure: Ganesh, Feed Server, MQ, Vega, TalkOptions, TalkDelta, Suchak, Kavach, TalkOffice, DXCC, Surya, Local WebSocket', order: 1 },
  { id: 'week-2', name: 'Week 2', label: 'Week 2', status: 'active', releaseDate: fmt(week2), description: 'Week 2 — Analytics & AI expansion: TalkDelta AI, Delta XI, VYUH, SpreadWatch, Strategy Factory, Kuber Alpha, Narad, Suraksha, Chitragupta, Parikshak, Simulator', order: 2 },
  { id: 'week-3', name: 'Week 3', label: 'Week 3', status: 'active', releaseDate: fmt(week3), description: 'Week 3 — Execution & strategies: Hanuman, TalkStrategy API/App, AALAP Calls, Rakshak, Manthan, Theta Yantra, TradePilot, ODIN, Lakshmi, Garuda', order: 3 },
  { id: 'week-4', name: 'Week 4', label: 'Week 4', status: 'draft', releaseDate: fmt(week4), description: 'Week 4 — Testing, hardening, documentation, security audit, production readiness', order: 4 },
  { id: 'production', name: 'Production', label: 'Production', status: 'draft', releaseDate: fmt(week4), description: 'Production deployment after Week 4 sign-off', order: 5 },
];

const seedProductVersionAssignments: ProductVersionAssignment[] = (() => {
  const assignments: ProductVersionAssignment[] = [];
  for (const product of seedProducts) {
    for (const versionId of allVersionIds) {
      const active = versionActiveMap[versionId]?.has(product.id) ?? false;
      assignments.push({ productId: product.id, versionId, active });
    }
  }
  return assignments;
})();

const seedConnectionVersions: ConnectionVersion[] = (() => {
  const entries: ConnectionVersion[] = [];
  const isV1Product = (nodeId: string) => {
    if (!seedProductIds.has(nodeId)) return true;
    return v1ActiveProducts.has(nodeId);
  };
  for (const conn of connections) {
    for (const versionId of allVersionIds) {
      const active = versionId === 'week-1' ? (isV1Product(conn.source) && isV1Product(conn.target)) : true;
      entries.push({ connectionId: conn.id, versionId, active });
    }
  }
  return entries;
})();

const seedServerVersions: ServerVersion[] = (() => {
  const entries: ServerVersion[] = [];
  for (const sg of serverGroups) {
    for (const versionId of allVersionIds) {
      const active = versionId === 'week-1' ? sg.nodes.some((n) => v1ActiveProducts.has(n)) : true;
      entries.push({ serverId: sg.id, versionId, active });
    }
  }
  return entries;
})();

interface PMOStore {
  products: ProductEntry[];
  docs: DocumentationItem[];
  releases: ReleaseEntry[];
  sprints: SprintEntry[];
  versions: ProductVersion[];
  selectedVersion: string;

  versionDefinitions: VersionDefinition[];
  productVersionAssignments: ProductVersionAssignment[];
  connectionVersions: ConnectionVersion[];
  serverVersions: ServerVersion[];

  addVersion: (version: VersionDefinition) => void;
  renameVersion: (id: string, name: string) => void;
  archiveVersion: (id: string) => void;
  cloneVersion: (id: string, newName: string) => void;
  deleteVersion: (id: string) => void;

  setProductVersion: (productId: string, versionId: string, active: boolean) => void;
  bulkAssignVersion: (productIds: string[], versionId: string, active: boolean) => void;
  setConnectionVersion: (connectionId: string, versionId: string, active: boolean) => void;
  setServerVersion: (serverId: string, versionId: string, active: boolean) => void;

  getProductsForVersionId: (versionId: string) => string[];
  getConnectionsForVersionId: (versionId: string) => string[];
  getServersForVersionId: (versionId: string) => string[];
  compareVersions: (v1: string, v2: string) => VersionChange[];
  getImpactAnalysis: (versionId: string) => { affectedProducts: string[]; affectedConnections: string[]; affectedServers: string[] };

  updateProduct: (id: string, updates: Partial<ProductEntry>) => void;
  addProduct: (product: ProductEntry) => void;

  updateDoc: (id: string, updates: Partial<DocumentationItem>) => void;

  updateRelease: (id: string, updates: Partial<ReleaseEntry>) => void;

  updateSprint: (id: string, updates: Partial<SprintEntry>) => void;
  updateTask: (sprintId: string, taskId: string, updates: Partial<SprintTask>) => void;

  setSelectedVersion: (version: string) => void;
  getProductsForVersion: () => string[];

  exportToExcel: () => void;
  exportToCSV: () => void;
}

const versionToLabel: Record<string, string> = {
  latest: 'Week 3',
  'week-1': 'Week 1',
  'week-2': 'Week 2',
  'week-3': 'Week 3',
  'week-4': 'Week 4',
  production: 'Week 4',
};

export const usePMOStore = create<PMOStore>((set, get) => ({
  products: seedProducts,
  docs: seedDocs,
  releases: seedReleases,
  sprints: seedSprints,
  versions: seedVersions,
  selectedVersion: 'latest',

  versionDefinitions: seedVersionDefinitions,
  productVersionAssignments: seedProductVersionAssignments,
  connectionVersions: seedConnectionVersions,
  serverVersions: seedServerVersions,

  addVersion: (version) =>
    set((state) => ({
      versionDefinitions: [...state.versionDefinitions, version],
    })),

  renameVersion: (id, name) =>
    set((state) => ({
      versionDefinitions: state.versionDefinitions.map((v) => (v.id === id ? { ...v, name, label: name } : v)),
    })),

  archiveVersion: (id) =>
    set((state) => ({
      versionDefinitions: state.versionDefinitions.map((v) => (v.id === id ? { ...v, status: 'archived' } : v)),
    })),

  cloneVersion: (id, newName) => {
    const state = get();
    const source = state.versionDefinitions.find((v) => v.id === id);
    if (!source) return;
    const newId = `version-${Date.now()}`;
    const cloned: VersionDefinition = {
      ...source,
      id: newId,
      name: newName,
      label: newName,
      status: 'draft',
      order: state.versionDefinitions.length + 1,
    };
    const newAssignments = state.productVersionAssignments
      .filter((a) => a.versionId === id)
      .map((a) => ({ ...a, versionId: newId }));
    const newConnVersions = state.connectionVersions
      .filter((c) => c.versionId === id)
      .map((c) => ({ ...c, versionId: newId }));
    const newSrvVersions = state.serverVersions
      .filter((s) => s.versionId === id)
      .map((s) => ({ ...s, versionId: newId }));
    set({
      versionDefinitions: [...state.versionDefinitions, cloned],
      productVersionAssignments: [...state.productVersionAssignments, ...newAssignments],
      connectionVersions: [...state.connectionVersions, ...newConnVersions],
      serverVersions: [...state.serverVersions, ...newSrvVersions],
    });
  },

  deleteVersion: (id) =>
    set((state) => ({
      versionDefinitions: state.versionDefinitions.filter((v) => v.id !== id),
      productVersionAssignments: state.productVersionAssignments.filter((a) => a.versionId !== id),
      connectionVersions: state.connectionVersions.filter((c) => c.versionId !== id),
      serverVersions: state.serverVersions.filter((s) => s.versionId !== id),
    })),

  setProductVersion: (productId, versionId, active) =>
    set((state) => {
      const existing = state.productVersionAssignments.find((a) => a.productId === productId && a.versionId === versionId);
      if (existing) {
        return {
          productVersionAssignments: state.productVersionAssignments.map((a) =>
            a.productId === productId && a.versionId === versionId ? { ...a, active } : a
          ),
        };
      }
      return {
        productVersionAssignments: [...state.productVersionAssignments, { productId, versionId, active }],
      };
    }),

  bulkAssignVersion: (productIds, versionId, active) =>
    set((state) => {
      const updated = new Map(state.productVersionAssignments.map((a) => [`${a.productId}::${a.versionId}`, a]));
      for (const pid of productIds) {
        updated.set(`${pid}::${versionId}`, { productId: pid, versionId, active });
      }
      return { productVersionAssignments: Array.from(updated.values()) };
    }),

  setConnectionVersion: (connectionId, versionId, active) =>
    set((state) => {
      const existing = state.connectionVersions.find((c) => c.connectionId === connectionId && c.versionId === versionId);
      if (existing) {
        return {
          connectionVersions: state.connectionVersions.map((c) =>
            c.connectionId === connectionId && c.versionId === versionId ? { ...c, active } : c
          ),
        };
      }
      return {
        connectionVersions: [...state.connectionVersions, { connectionId, versionId, active }],
      };
    }),

  setServerVersion: (serverId, versionId, active) =>
    set((state) => {
      const existing = state.serverVersions.find((s) => s.serverId === serverId && s.versionId === versionId);
      if (existing) {
        return {
          serverVersions: state.serverVersions.map((s) =>
            s.serverId === serverId && s.versionId === versionId ? { ...s, active } : s
          ),
        };
      }
      return {
        serverVersions: [...state.serverVersions, { serverId, versionId, active }],
      };
    }),

  getProductsForVersionId: (versionId) => {
    const { productVersionAssignments } = get();
    return productVersionAssignments.filter((a) => a.versionId === versionId && a.active).map((a) => a.productId);
  },

  getConnectionsForVersionId: (versionId) => {
    const { connectionVersions } = get();
    return connectionVersions.filter((c) => c.versionId === versionId && c.active).map((c) => c.connectionId);
  },

  getServersForVersionId: (versionId) => {
    const { serverVersions } = get();
    return serverVersions.filter((s) => s.versionId === versionId && s.active).map((s) => s.serverId);
  },

  compareVersions: (v1, v2) => {
    const state = get();
    const products1 = new Set(state.productVersionAssignments.filter((a) => a.versionId === v1 && a.active).map((a) => a.productId));
    const products2 = new Set(state.productVersionAssignments.filter((a) => a.versionId === v2 && a.active).map((a) => a.productId));
    const conns1 = new Set(state.connectionVersions.filter((c) => c.versionId === v1 && c.active).map((c) => c.connectionId));
    const conns2 = new Set(state.connectionVersions.filter((c) => c.versionId === v2 && c.active).map((c) => c.connectionId));
    const servers1 = new Set(state.serverVersions.filter((s) => s.versionId === v1 && s.active).map((s) => s.serverId));
    const servers2 = new Set(state.serverVersions.filter((s) => s.versionId === v2 && s.active).map((s) => s.serverId));

    const changes: VersionChange[] = [];

    for (const pid of products2) {
      if (!products1.has(pid)) {
        const product = seedProducts.find((p) => p.id === pid);
        changes.push({ type: 'added', productId: pid, description: `Product "${product?.name ?? pid}" added in ${v2}` });
      }
    }
    for (const pid of products1) {
      if (!products2.has(pid)) {
        const product = seedProducts.find((p) => p.id === pid);
        changes.push({ type: 'removed', productId: pid, description: `Product "${product?.name ?? pid}" removed in ${v2}` });
      }
    }
    for (const cid of conns2) {
      if (!conns1.has(cid)) {
        const conn = connections.find((c) => c.id === cid);
        changes.push({ type: 'added', connectionId: cid, description: `Connection "${conn?.source ?? ''} → ${conn?.target ?? ''}" added in ${v2}` });
      }
    }
    for (const cid of conns1) {
      if (!conns2.has(cid)) {
        const conn = connections.find((c) => c.id === cid);
        changes.push({ type: 'removed', connectionId: cid, description: `Connection "${conn?.source ?? ''} → ${conn?.target ?? ''}" removed in ${v2}` });
      }
    }
    for (const sid of servers2) {
      if (!servers1.has(sid)) {
        const sg = serverGroups.find((s) => s.id === sid);
        changes.push({ type: 'added', serverId: sid, description: `Server "${sg?.name ?? sid}" added in ${v2}` });
      }
    }
    for (const sid of servers1) {
      if (!servers2.has(sid)) {
        const sg = serverGroups.find((s) => s.id === sid);
        changes.push({ type: 'removed', serverId: sid, description: `Server "${sg?.name ?? sid}" removed in ${v2}` });
      }
    }
    return changes;
  },

  getImpactAnalysis: (versionId) => {
    const state = get();
    const affectedProducts = state.productVersionAssignments.filter((a) => a.versionId === versionId && a.active).map((a) => a.productId);
    const affectedConnections = state.connectionVersions.filter((c) => c.versionId === versionId && c.active).map((c) => c.connectionId);
    const affectedServers = state.serverVersions.filter((s) => s.versionId === versionId && s.active).map((s) => s.serverId);
    return { affectedProducts, affectedConnections, affectedServers };
  },

  updateProduct: (id, updates) =>
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...updates, lastUpdated: new Date().toISOString().split('T')[0] } : p)),
    })),

  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, product],
    })),

  updateDoc: (id, updates) =>
    set((state) => ({
      docs: state.docs.map((d) => (d.id === id ? { ...d, ...updates, lastUpdated: new Date().toISOString().split('T')[0] } : d)),
    })),

  updateRelease: (id, updates) =>
    set((state) => ({
      releases: state.releases.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    })),

  updateSprint: (id, updates) =>
    set((state) => ({
      sprints: state.sprints.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    })),

  updateTask: (sprintId, taskId, updates) =>
    set((state) => ({
      sprints: state.sprints.map((s) => {
        if (s.id !== sprintId) return s;
        const updatedTasks = s.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t));
        const completedPoints = updatedTasks.filter((t) => t.status === 'done').reduce((sum, t) => sum + t.storyPoints, 0);
        return { ...s, tasks: updatedTasks, completedPoints };
      }),
    })),

  setSelectedVersion: (version) =>
    set({ selectedVersion: version }),

  getProductsForVersion: () => {
    const { versions, selectedVersion } = get();
    const label = versionToLabel[selectedVersion] || 'Version 3';
    return versions.filter((v) => v.label === label).map((v) => v.productId);
  },

  exportToExcel: () => {
    const { products, docs, releases, sprints, versions } = get();
    const wb = XLSX.utils.book_new();

    const productData = products.map((p) => ({
      ID: p.id,
      Name: p.name,
      Category: p.category,
      Version: p.version,
      Status: p.status,
      Owner: p.owner,
      Server: p.server,
      Progress: p.progress,
      DocProgress: p.documentationProgress,
      TestProgress: p.testingProgress,
      SecurityProgress: p.securityProgress,
      DevOpsProgress: p.devopsProgress,
      Readiness: p.readiness,
      Dependencies: p.dependencies.join(', '),
      Features: p.features.join(', '),
      LastUpdated: p.lastUpdated,
      ReleaseTarget: p.releaseTarget,
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(productData), 'Products');

    const docData = docs.map((d) => ({
      ID: d.id,
      ProductID: d.productId,
      Type: d.type,
      Title: d.title,
      Status: d.status,
      Owner: d.owner,
      Completion: d.completion,
      LastUpdated: d.lastUpdated,
      Reviewer: d.reviewer,
      Comments: d.comments,
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(docData), 'Documentation');

    const releaseData = releases.map((r) => ({
      ID: r.id,
      Name: r.name,
      Version: r.version,
      Status: r.status,
      ReleaseDate: r.releaseDate,
      Products: r.products.join(', '),
      Description: r.description,
      ReleaseNotes: r.releaseNotes,
      ApprovalStatus: r.approvalStatus,
      RiskLevel: r.riskLevel,
      RollbackPlan: r.rollbackPlan,
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(releaseData), 'Releases');

    const sprintData = sprints.map((s) => ({
      ID: s.id,
      Name: s.name,
      Goal: s.goal,
      StartDate: s.startDate,
      EndDate: s.endDate,
      Status: s.status,
      StoryPoints: s.storyPoints,
      CompletedPoints: s.completedPoints,
      TaskCount: s.tasks.length,
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sprintData), 'Sprints');

    const taskData = sprints.flatMap((s) =>
      s.tasks.map((t) => ({
        SprintID: s.id,
        SprintName: s.name,
        TaskID: t.id,
        Title: t.title,
        Type: t.type,
        Priority: t.priority,
        Status: t.status,
        Assignee: t.assignee,
        StoryPoints: t.storyPoints,
        ProductID: t.productId,
      }))
    );
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(taskData), 'Sprint Tasks');

    const versionData = versions.map((v) => ({
      ProductID: v.productId,
      Version: v.version,
      Label: v.label,
      ReleaseDate: v.releaseDate,
      Changes: v.changes.join('; '),
      AddedFeatures: v.addedFeatures.join('; '),
      RemovedFeatures: v.removedFeatures.join('; '),
      ChangedAPIs: v.changedApis.join('; '),
      ChangedDependencies: v.changedDependencies.join('; '),
      ChangedServers: v.changedServers.join('; '),
      TopologySnapshot: v.topologySnapshot.join(', '),
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(versionData), 'Versions');

    XLSX.writeFile(wb, 'AlgoIQ_PMO_Export.xlsx');
  },

  exportToCSV: () => {
    const { products } = get();
    const headers = ['ID', 'Name', 'Category', 'Version', 'Status', 'Owner', 'Server', 'Progress', 'DocProgress', 'TestProgress', 'SecurityProgress', 'DevOpsProgress', 'Readiness', 'Dependencies', 'Features', 'LastUpdated', 'ReleaseTarget'];
    const rows = products.map((p) => [
      p.id, p.name, p.category, p.version, p.status, p.owner, p.server,
      p.progress, p.documentationProgress, p.testingProgress, p.securityProgress,
      p.devopsProgress, p.readiness, p.dependencies.join('|'), p.features.join('|'),
      p.lastUpdated, p.releaseTarget,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'AlgoIQ_PMO_Export.csv';
    link.click();
    URL.revokeObjectURL(url);
  },
}));
