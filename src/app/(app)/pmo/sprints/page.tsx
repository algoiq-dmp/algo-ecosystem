'use client';

import { useState, useMemo } from 'react';
import {
  FiPlus,
  FiX,
  FiCalendar,
  FiTarget,
  FiFlag,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

/* ---------- types ---------- */
type TaskType = 'feature' | 'bug' | 'tech-debt' | 'docs' | 'qa';
type TaskPriority = 'critical' | 'high' | 'medium' | 'low';
type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';

interface Task {
  id: number;
  title: string;
  type: TaskType;
  priority: TaskPriority;
  assignee: string;
  storyPoints: number;
  productId: string;
  status: TaskStatus;
}

interface Sprint {
  id: number;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  totalStoryPoints: number;
  completedStoryPoints: number;
  tasks: Task[];
}

const PRODUCTS = [
  'ENT-GANESH',
  'ENT-SURYA',
  'ENT-VEGA',
  'ENT-NARAD',
  'ENT-DELTA',
  'ENT-CHITRAGUPTA',
  'ENT-KAVACH',
  'ENT-TALKOFFICE',
];

const TASK_TYPE_LABELS: Record<TaskType, string> = {
  feature: 'Feature',
  bug: 'Bug',
  'tech-debt': 'Tech Debt',
  docs: 'Docs',
  qa: 'QA',
};

const TASK_TYPE_COLORS: Record<TaskType, string> = {
  feature: '#2563EB',
  bug: '#DC2626',
  'tech-debt': '#9333EA',
  docs: '#16A34A',
  qa: '#D97706',
};

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  critical: '#DC2626',
  high: '#EA580C',
  medium: '#F59E0B',
  low: '#6B7280',
};

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

const ASSIGNEES = [
  'Arjun Mehta',
  'Priya Sharma',
  'Vikram Rao',
  'Sneha Patel',
  'Rohan Gupta',
  'Ananya Iyer',
  'Karan Joshi',
  'Meera Nair',
];

function initials(name: string): string {
  return name
    .split(' ')
    .map((w) => w.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function avatarColor(name: string): string {
  const colors = [
    '#2563EB', '#7C3AED', '#DC2626', '#EA580C', '#059669',
    '#0891B2', '#D97706', '#4F46E5', '#C026D3', '#0D9488',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

/* ---------- 5 sprints with 8-12 tasks each ---------- */
const genTasks = (sprintId: number): Task[] => {
  const templates: { title: string; type: TaskType }[] = [
    { title: 'Implement order matching engine optimization', type: 'feature' },
    { title: 'Fix memory leak in tick processor', type: 'bug' },
    { title: 'Refactor authentication middleware', type: 'tech-debt' },
    { title: 'Write API documentation for v3 endpoints', type: 'docs' },
    { title: 'Integration tests for portfolio service', type: 'qa' },
    { title: 'Add circuit breaker to market data feed', type: 'feature' },
    { title: 'Fix race condition in order book', type: 'bug' },
    { title: 'Update dependency tree to latest versions', type: 'tech-debt' },
    { title: 'Create onboarding guide for new services', type: 'docs' },
    { title: 'Load testing for tick ingestion pipeline', type: 'qa' },
    { title: 'Implement smart order routing v2', type: 'feature' },
    { title: 'Fix incorrect P&L calculation', type: 'bug' },
    { title: 'Migrate legacy DB queries to ORM', type: 'tech-debt' },
    { title: 'Document deployment runbook', type: 'docs' },
    { title: 'End-to-end test for trade lifecycle', type: 'qa' },
    { title: 'Add real-time dashboard widgets', type: 'feature' },
    { title: 'Fix WebSocket reconnection logic', type: 'bug' },
    { title: 'Extract common utilities to shared lib', type: 'tech-debt' },
    { title: 'Update system architecture diagrams', type: 'docs' },
    { title: 'Regression test for release v3.2', type: 'qa' },
  ];

  const shuffled = [...templates].sort(() => Math.random() - 0.5);
  const count = 8 + Math.floor(Math.random() * 5);
  const selected = shuffled.slice(0, count);

  return selected.map((t, i) => ({
    id: sprintId * 100 + i,
    title: t.title,
    type: t.type,
    priority: (['critical', 'high', 'medium', 'low'] as TaskPriority[])[Math.floor(Math.random() * 4)],
    assignee: ASSIGNEES[Math.floor(Math.random() * ASSIGNEES.length)],
    storyPoints: [1, 2, 3, 5, 8, 13][Math.floor(Math.random() * 6)],
    productId: PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)],
    status: (['todo', 'in-progress', 'review', 'done'] as TaskStatus[])[Math.floor(Math.random() * 4)],
  }));
};

const SPRINTS: Sprint[] = [
  {
    id: 1,
    name: 'Sprint 12 — Market Stability',
    goal: 'Stabilize core market data pipeline and eliminate production incidents',
    startDate: '2026-06-01',
    endDate: '2026-06-14',
    totalStoryPoints: 96,
    completedStoryPoints: 96,
    tasks: genTasks(1),
  },
  {
    id: 2,
    name: 'Sprint 13 — Velocity Boost',
    goal: 'Improve order execution speed and reduce tick-to-trade latency by 30%',
    startDate: '2026-06-15',
    endDate: '2026-06-28',
    totalStoryPoints: 88,
    completedStoryPoints: 88,
    tasks: genTasks(2),
  },
  {
    id: 3,
    name: 'Sprint 14 — Security Hardening',
    goal: 'Implement SOC 2 controls, encryption upgrades, and audit logging',
    startDate: '2026-06-29',
    endDate: '2026-07-12',
    totalStoryPoints: 104,
    completedStoryPoints: 72,
    tasks: genTasks(3),
  },
  {
    id: 4,
    name: 'Sprint 15 — Analytics Hub',
    goal: 'Build unified analytics dashboard connecting portfolio, risk, and compliance',
    startDate: '2026-07-13',
    endDate: '2026-07-26',
    totalStoryPoints: 92,
    completedStoryPoints: 38,
    tasks: genTasks(4),
  },
  {
    id: 5,
    name: 'Sprint 16 — Future Stack',
    goal: 'Prototype next-gen architecture with event sourcing and streaming SQL',
    startDate: '2026-07-27',
    endDate: '2026-08-09',
    totalStoryPoints: 80,
    completedStoryPoints: 0,
    tasks: genTasks(5),
  },
];

const COLUMNS: { key: TaskStatus; label: string; color: string }[] = [
  { key: 'todo', label: 'To Do', color: '#6B7280' },
  { key: 'in-progress', label: 'In Progress', color: '#F59E0B' },
  { key: 'review', label: 'Review', color: '#8B5CF6' },
  { key: 'done', label: 'Done', color: '#10B981' },
];

/* ---------- burn-down data helpers ---------- */
const generateBurnDown = (sprint: Sprint) => {
  const start = new Date(sprint.startDate);
  const end = new Date(sprint.endDate);
  const days = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const total = sprint.totalStoryPoints;
  const completed = sprint.completedStoryPoints;

  const planned: { day: string; planned: number; actual: number }[] = [];
  for (let i = 0; i <= days && i <= 14; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const plannedIdeal = Math.round(total - (total * i) / Math.min(days, 14));
    const actualVal =
      i === 0
        ? total
        : Math.round(total - (completed * i) / Math.min(days, 14)) + (Math.random() > 0.5 ? 2 : -2);
    planned.push({
      day: d.toISOString().slice(5, 10),
      planned: plannedIdeal,
      actual: Math.max(0, Math.min(total, actualVal)),
    });
  }
  return planned;
};

/* ---------- main component ---------- */
export default function PmoSprintsPage() {
  const [sprints, setSprints] = useState<Sprint[]>(SPRINTS);
  const [activeSprintId, setActiveSprintId] = useState(4);
  const [showCreate, setShowCreate] = useState(false);

  /* create task form */
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState<TaskType>('feature');
  const [formPriority, setFormPriority] = useState<TaskPriority>('medium');
  const [formAssignee, setFormAssignee] = useState(ASSIGNEES[0]);
  const [formStoryPoints, setFormStoryPoints] = useState(3);
  const [formProduct, setFormProduct] = useState(PRODUCTS[0]);

  const activeSprint = sprints.find((s) => s.id === activeSprintId) || sprints[0];

  const tasksByColumn = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = { todo: [], 'in-progress': [], review: [], done: [] };
    activeSprint.tasks.forEach((t) => map[t.status].push(t));
    return map;
  }, [activeSprint]);

  const burnDownData = useMemo(() => generateBurnDown(activeSprint), [activeSprint]);

  /* move task between columns */
  const moveTask = (taskId: number, toStatus: TaskStatus) => {
    setSprints((prev) =>
      prev.map((s) =>
        s.id === activeSprintId
          ? {
              ...s,
              tasks: s.tasks.map((t) => (t.id === taskId ? { ...t, status: toStatus } : t)),
            }
          : s,
      ),
    );
  };

  /* handle create task */
  const handleCreate = () => {
    if (!formTitle.trim()) return;
    const newTask: Task = {
      id: Math.max(...activeSprint.tasks.map((t) => t.id), activeSprintId * 100) + 1,
      title: formTitle,
      type: formType,
      priority: formPriority,
      assignee: formAssignee,
      storyPoints: formStoryPoints,
      productId: formProduct,
      status: 'todo',
    };
    setSprints((prev) =>
      prev.map((s) =>
        s.id === activeSprintId
          ? {
              ...s,
              tasks: [...s.tasks, newTask],
              totalStoryPoints: s.totalStoryPoints + formStoryPoints,
            }
          : s,
      ),
    );
    setShowCreate(false);
    setFormTitle('');
    setFormType('feature');
    setFormPriority('medium');
    setFormAssignee(ASSIGNEES[0]);
    setFormStoryPoints(3);
    setFormProduct(PRODUCTS[0]);
  };

  const completionPct =
    activeSprint.totalStoryPoints > 0
      ? Math.round((activeSprint.completedStoryPoints / activeSprint.totalStoryPoints) * 100)
      : 0;

  return (
    <div className="h-full overflow-y-auto p-6 max-w-[1400px] mx-auto font-sans">
      {/* ---- header ---- */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sprint Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Plan, track, and deliver sprint goals
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* sprint selector */}
          <select
            value={activeSprintId}
            onChange={(e) => setActiveSprintId(Number(e.target.value))}
            className="px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          >
            {sprints.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.startDate} → {s.endDate})
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-[#2563EB] hover:bg-blue-700 text-white transition-colors"
          >
            <FiPlus size={14} /> Create Task
          </button>
        </div>
      </div>

      {/* ---- active sprint highlight ---- */}
      <div className="mb-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-[#2563EB]/5 to-transparent p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FiTarget className="text-[#2563EB]" size={18} />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {activeSprint.name}
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                {activeSprint.startDate === SPRINTS[SPRINTS.length - 1].startDate
                  ? 'Future'
                  : activeSprint.completedStoryPoints >= activeSprint.totalStoryPoints
                    ? 'Completed'
                    : 'Active'}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg">{activeSprint.goal}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <FiCalendar size={12} />
                {activeSprint.startDate} &rarr; {activeSprint.endDate}
              </span>
              <span className="flex items-center gap-1">
                <FiFlag size={12} />
                {activeSprint.completedStoryPoints} / {activeSprint.totalStoryPoints} SP
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#2563EB]">{completionPct}%</div>
              <div className="text-xs text-slate-400">Complete</div>
            </div>
            <div className="w-32">
              <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#2563EB] to-emerald-500 rounded-full transition-all duration-700"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
              <div className="flex justify-between mt-1 text-[10px] text-slate-400">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---- task board ---- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {COLUMNS.map((col) => {
          const tasks = tasksByColumn[col.key];
          return (
            <div
              key={col.key}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 min-h-[200px]"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {col.label}
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  {tasks.length}
                </span>
              </div>

              <div className="p-3 space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="rounded-xl border bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all"
                    style={{ borderLeftWidth: 3, borderLeftColor: PRIORITY_COLORS[task.priority] }}
                  >
                    <div className="p-3">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span
                          className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold text-white"
                          style={{ backgroundColor: TASK_TYPE_COLORS[task.type] }}
                        >
                          {TASK_TYPE_LABELS[task.type]}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ color: PRIORITY_COLORS[task.priority], backgroundColor: PRIORITY_COLORS[task.priority] + '15' }}>
                          {PRIORITY_LABELS[task.priority]}
                        </span>
                      </div>

                      <p className="text-sm font-medium text-slate-800 dark:text-white mb-3 leading-snug">
                        {task.title}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                            style={{ backgroundColor: avatarColor(task.assignee) }}
                            title={task.assignee}
                          >
                            {initials(task.assignee)}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono">
                            {task.storyPoints} SP
                          </span>
                          <span className="text-[10px] text-slate-400">{task.productId}</span>
                        </div>
                      </div>

                      {/* column action buttons */}
                      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-1">
                        {COLUMNS.filter((c) => c.key !== col.key).map((c) => (
                          <button
                            key={c.key}
                            onClick={() => moveTask(task.id, c.key)}
                            className="text-[10px] px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors flex items-center gap-1"
                            title={`Move to ${c.label}`}
                          >
                            {col.key === 'todo' || col.key === 'in-progress' ? (
                              <FiChevronRight size={10} />
                            ) : (
                              <FiChevronLeft size={10} />
                            )}
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                {tasks.length === 0 && (
                  <div className="text-center py-10 text-xs text-slate-400">No tasks</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ---- burn-down chart ---- */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6 bg-white dark:bg-slate-900">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
          Burndown Chart — {activeSprint.name}
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={burnDownData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="planned"
                stroke="#94a3b8"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Planned"
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#2563EB"
                strokeWidth={2}
                dot={{ r: 3, fill: '#2563EB' }}
                name="Actual"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-6 mt-3 justify-end">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <div className="w-4 h-0.5 bg-slate-400" style={{ borderTop: '2px dashed #94a3b8' }} />
            Planned
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <div className="w-4 h-0.5 bg-[#2563EB]" />
            Actual
          </div>
        </div>
      </div>

      {/* ---- create task modal ---- */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Create Task</h2>
              <button
                onClick={() => setShowCreate(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Title</label>
                <input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Enter task title..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as TaskType)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  >
                    {Object.entries(TASK_TYPE_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Priority</label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  >
                    {Object.entries(PRIORITY_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Assignee</label>
                  <select
                    value={formAssignee}
                    onChange={(e) => setFormAssignee(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  >
                    {ASSIGNEES.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Story Points</label>
                  <select
                    value={formStoryPoints}
                    onChange={(e) => setFormStoryPoints(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  >
                    {[1, 2, 3, 5, 8, 13, 21].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Product</label>
                <select
                  value={formProduct}
                  onChange={(e) => setFormProduct(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                >
                  {PRODUCTS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 text-sm rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white font-medium"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
