'use client';

import { useState, useMemo } from 'react';
import { nodes, connections, connectionTypeColors } from '@/data/ecosystem';
import {
  FiServer, FiCpu, FiActivity, FiShield, FiDatabase,
  FiArrowRight, FiClock, FiRefreshCw, FiZap, FiInfo,
  FiExternalLink, FiChevronRight, FiChevronDown, FiSearch, FiSliders,
  FiCheck, FiAlertCircle, FiBarChart2, FiTrendingUp, FiTarget,
  FiDownload,
} from 'react-icons/fi';
import { useBetaModeStore } from '@/stores/beta-mode-store';
import { BETA_HIDDEN_NODES } from '@/config/feature-flags';

export default function EnginesPage() {
  const [search, setSearch] = useState('');
  const [serverFilter, setServerFilter] = useState('');
  const [selectedEngine, setSelectedEngine] = useState<string | null>(null);
  const { isBeta } = useBetaModeStore();

  const engineNodes = useMemo(() => {
    let result = nodes.filter((n) => n.type === 'engine');
    if (isBeta) {
      result = result.filter(n => !(BETA_HIDDEN_NODES as readonly string[]).includes(n.id));
    }
    return result;
  }, [isBeta]);

const statusColors: Record<string, string> = {
  online: 'bg-green-500',
  degraded: 'bg-yellow-500',
  offline: 'bg-red-500',
};

const categoryColors: Record<string, string> = {
  engine: 'bg-amber-100 text-amber-800',
  risk: 'bg-red-100 text-red-800',
  execution: 'bg-indigo-100 text-indigo-800',
  ai: 'bg-purple-100 text-purple-800',
  audit: 'bg-gray-100 text-gray-800',
};

const healthBarColor = (v: number) =>
  v >= 99.9 ? 'bg-green-500' : v >= 99.5 ? 'bg-yellow-500' : 'bg-red-500';

  const servers = useMemo(
    () => [...new Set(engineNodes.map((n) => n.server))],
    []
  );

  const filtered = useMemo(() => {
    return engineNodes.filter((n) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        n.name.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q) ||
        n.id.toLowerCase().includes(q);
      const matchServer = !serverFilter || n.server === serverFilter;
      return matchSearch && matchServer;
    });
  }, [search, serverFilter]);

  const engine = selectedEngine
    ? engineNodes.find((n) => n.id === selectedEngine)
    : null;

  const engConns = useMemo(() => {
    if (!engine) return [];
    return connections.filter(
      (c) => c.source === engine.id || c.target === engine.id
    );
  }, [engine]);

  const downloadPDF = async () => {
    if (!engine) return;
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    let y = 15;
    const leftMargin = 15;
    const pageWidth = 190;

    const checkPageBreak = (needed: number) => {
      if (y + needed > 280) {
        doc.addPage();
        y = 15;
      }
    };

    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text(engine.name, leftMargin, y); y += 8;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`${engine.server}  |  v${engine.version}  |  ${engine.status.toUpperCase()}  |  Health: ${engine.health}%`, leftMargin, y); y += 5;
    doc.setTextColor(120, 120, 120);
    doc.setFontSize(8);
    doc.text(`Category: ${engine.category || 'engine'}`, leftMargin, y); y += 10;

    const addSection = (title: string, items: string[]) => {
      checkPageBreak(14 + items.length * 6);
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(title, leftMargin, y); y += 6;
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      for (const item of items) {
        if (y > 280) { doc.addPage(); y = 15; }
        doc.text(`  \u2022 ${item}`, leftMargin + 3, y, { maxWidth: pageWidth - 6 });
        const lines = doc.splitTextToSize(`  \u2022 ${item}`, pageWidth - 6);
        y += Math.max(lines.length * 4.5, 5);
      }
      y += 3;
    };

    const addGridSection = (title: string, items: string[]) => {
      checkPageBreak(14 + items.length * 5);
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(title, leftMargin, y); y += 6;
      const colW = pageWidth / 3;
      doc.setFontSize(8);
      doc.setTextColor(60, 60, 60);
      for (let i = 0; i < items.length; i++) {
        if (y > 280) { doc.addPage(); y = 15; }
        const col = i % 3;
        const rowY = y + Math.floor(i / 3) * 5;
        doc.text(`\u2022 ${items[i]}`, leftMargin + col * colW, rowY, { maxWidth: colW - 3 });
      }
      y += Math.ceil(items.length / 3) * 5 + 5;
    };

    checkPageBreak(10);
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('Description', leftMargin, y); y += 6;
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    const descLines = doc.splitTextToSize(engine.description || '', pageWidth);
    for (const line of descLines) {
      if (y > 280) { doc.addPage(); y = 15; }
      doc.text(line, leftMargin, y);
      y += 5;
    }
    y += 4;

    addSection('Purpose', [engine.purpose]);
    addSection('Business Value', [engine.businessValue]);
    addSection('Responsibilities', engine.responsibilities || []);
    addSection('Inputs', engine.inputs || []);
    addSection('Outputs', engine.outputs || []);
    addSection('Data Consumed', engine.dataConsumed || []);
    addSection('Data Produced', engine.dataProduced || []);
    addSection('Sends To (Upstream)', engine.sendsTo || []);
    addSection('Receives From (Downstream)', engine.receivesFrom || []);

    checkPageBreak(10);
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('Connected Entities', leftMargin, y); y += 6;
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.text(`Applications: ${(engine.connectedApplications || []).join(', ')}`, leftMargin + 3, y, { maxWidth: pageWidth - 6 });
    y += 5;
    doc.text(`Engines: ${(engine.connectedEngines || []).join(', ')}`, leftMargin + 3, y, { maxWidth: pageWidth - 6 });
    y += 5;
    doc.text(`APIs: ${(engine.connectedApis || []).join(', ')}`, leftMargin + 3, y, { maxWidth: pageWidth - 6 });
    y += 5;

    const protocols = Object.entries(engine.communication || {}).filter(([,v]) => v).map(([k]) => k.toUpperCase());
    doc.text(`Communication: ${protocols.length > 0 ? protocols.join(', ') : 'None'}`, leftMargin + 3, y, { maxWidth: pageWidth - 6 });
    y += 5;

    checkPageBreak(10);
    doc.text(`Databases: ${(engine.databases || []).join(', ') || 'None'}`, leftMargin, y);
    y += 5;
    doc.text(`Ports: ${engine.ports || 'N/A'}`, leftMargin, y);
    y += 6;

    checkPageBreak(14);
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('Failure Impact', leftMargin, y); y += 6;
    doc.setFontSize(9);
    doc.setTextColor(200, 30, 30);
    const failLines = doc.splitTextToSize(engine.failureImpact || '', pageWidth);
    for (const line of failLines) {
      if (y > 280) { doc.addPage(); y = 15; }
      doc.text(line, leftMargin, y);
      y += 5;
    }
    y += 4;

    doc.setTextColor(120, 120, 120);
    doc.setFontSize(8);
    checkPageBreak(5);
    doc.text(`Generated by Algo IQ Ecosystem  |  ${engine.name} v${engine.version}`, leftMargin, y);

    doc.save(`${engine.name.replace(/\s+/g, '_')}_DataSheet.pdf`);
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <FiCpu className="text-2xl text-amber-400" />
          <h1 className="text-3xl font-bold">Engine Knowledge Explorer</h1>
        </div>
        <p className="text-gray-400 mb-6">
          Explore all processing and execution engines powering the Algo IQ ecosystem
        </p>

        {/* Search & Filter Bar */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="relative flex-1 min-w-[280px]">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search engines by name, description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
          <div className="relative min-w-[200px]">
            <FiSliders className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={serverFilter}
              onChange={(e) => setServerFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 appearance-none focus:outline-none focus:border-amber-500 transition-colors"
            >
              <option value="">All Servers</option>
              {servers.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((eng) => (
            <div
              key={eng.id}
              onClick={() => setSelectedEngine(eng.id)}
              className="bg-gray-800/60 border border-gray-700 rounded-xl p-5 cursor-pointer hover:border-amber-500/50 hover:bg-gray-800 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-100 group-hover:text-amber-400 transition-colors">
                    {eng.name}
                  </h3>
                  <p className="text-sm text-gray-400">{eng.server}</p>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[eng.category || 'engine'] || categoryColors.engine}`}
                >
                  {eng.category || 'engine'}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${statusColors[eng.status]}`}
                />
                <span className="text-xs text-gray-300 capitalize">{eng.status}</span>
                <span className="text-xs text-gray-500">v{eng.version}</span>
              </div>

              <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                {eng.description}
              </p>

              <div className="mb-3">
                <p className="text-xs font-medium text-gray-500 mb-1">Responsibilities</p>
                <div className="flex flex-wrap gap-1">
                  {eng.responsibilities.slice(0, 4).map((r, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-gray-700/50 rounded text-xs text-gray-300"
                    >
                      {r}
                    </span>
                  ))}
                  {eng.responsibilities.length > 4 && (
                    <span className="text-xs text-gray-500">
                      +{eng.responsibilities.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">
                  Key Connections
                </p>
                <div className="flex flex-wrap gap-1">
                  {eng.connectedEngines.concat(eng.connectedApis).slice(0, 5).map((c, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-amber-900/30 text-amber-300 rounded text-xs"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-1 text-amber-400 text-sm group-hover:gap-2 transition-all">
                View Details <FiChevronRight />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {engine && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-6 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedEngine(null);
          }}
        >
          <div className="relative w-full max-w-4xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl my-8">
            {/* Close button */}
            <button
              onClick={() => setSelectedEngine(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl z-10"
            >
              &times;
            </button>

            <button
              onClick={downloadPDF}
              className="absolute top-4 right-12 flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-sm font-medium transition-colors z-10"
            >
              <FiDownload size={14} />
              PDF
            </button>

            <div className="p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-100">
                    {engine.name}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    {engine.server} &middot; v{engine.version} &middot;{' '}
                    <span className="capitalize">{engine.status}</span>
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[engine.category || 'engine'] || categoryColors.engine}`}
                >
                  {engine.category || 'engine'}
                </span>
              </div>

              {/* Health Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Health Score</span>
                  <span>{engine.health}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${healthBarColor(engine.health)}`}
                    style={{ width: `${engine.health}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Purpose */}
                <Section title="Purpose" icon={<FiTarget />}>
                  <p className="text-gray-300">{engine.purpose}</p>
                </Section>

                {/* Business Value */}
                <Section title="Business Value" icon={<FiTrendingUp />}>
                  <p className="text-gray-300">{engine.businessValue}</p>
                </Section>
              </div>

              {/* Responsibilities */}
              <Section title="Responsibilities" icon={<FiActivity />} className="mt-6">
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  {engine.responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </Section>

              {/* Internal Workflow */}
              <Section title="Internal Workflow" icon={<FiRefreshCw />} className="mt-6">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="px-3 py-1 bg-gray-700 rounded-lg text-gray-200">Input</span>
                  <FiArrowRight className="text-gray-500" />
                  <span className="px-3 py-1 bg-gray-700 rounded-lg text-gray-200">Process</span>
                  <FiArrowRight className="text-gray-500" />
                  <span className="px-3 py-1 bg-gray-700 rounded-lg text-gray-200">Validate</span>
                  <FiArrowRight className="text-gray-500" />
                  <span className="px-3 py-1 bg-gray-700 rounded-lg text-gray-200">Output</span>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Receives data from upstream systems, processes through internal logic, validates results, and publishes outputs to downstream consumers.
                </p>
              </Section>

              {/* I/O Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Section title="Inputs">
                  <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
                    {engine.inputs.map((i, idx) => (
                      <li key={idx}>{i}</li>
                    ))}
                  </ul>
                </Section>
                <Section title="Outputs">
                  <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
                    {engine.outputs.map((o, idx) => (
                      <li key={idx}>{o}</li>
                    ))}
                  </ul>
                </Section>
                <Section title="Data Consumed">
                  <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
                    {engine.dataConsumed.map((d, idx) => (
                      <li key={idx}>{d}</li>
                    ))}
                  </ul>
                </Section>
                <Section title="Data Produced">
                  <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
                    {engine.dataProduced.map((d, idx) => (
                      <li key={idx}>{d}</li>
                    ))}
                  </ul>
                </Section>
              </div>

              {/* Upstream / Downstream */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Section title="Upstream (Sends To)" icon={<FiArrowRight />}>
                  <div className="flex flex-wrap gap-1">
                    {engine.sendsTo.map((s, i) => (
                      <span key={i} className="px-2 py-1 bg-blue-900/30 text-blue-300 rounded text-xs">
                        {s}
                      </span>
                    ))}
                  </div>
                </Section>
                <Section title="Downstream (Receives From)">
                  <div className="flex flex-wrap gap-1">
                    {engine.receivesFrom.map((s, i) => (
                      <span key={i} className="px-2 py-1 bg-green-900/30 text-green-300 rounded text-xs">
                        {s}
                      </span>
                    ))}
                  </div>
                </Section>
              </div>

              {/* Connected Entities */}
              <Section title="Connected Entities" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <TagGroup label="Applications" tags={engine.connectedApplications} color="bg-gray-700 text-gray-200" />
                  <TagGroup label="Engines" tags={engine.connectedEngines} color="bg-amber-900/30 text-amber-300" />
                  <TagGroup label="APIs" tags={engine.connectedApis} color="bg-purple-900/30 text-purple-300" />
                </div>
              </Section>

              {/* Communication Protocols */}
              <Section title="Communication Protocols" className="mt-6">
                <div className="flex flex-wrap gap-2">
                  {Object.entries(engine.communication)
                    .filter(([, v]) => v)
                    .map(([k]) => (
                      <span key={k} className="px-3 py-1 bg-cyan-900/30 text-cyan-300 rounded text-sm uppercase">
                        {k}
                      </span>
                    ))}
                  {!Object.values(engine.communication).some(Boolean) && (
                    <span className="text-gray-500 text-sm">None specified</span>
                  )}
                </div>
              </Section>

              {/* Databases */}
              <Section title="Databases" icon={<FiDatabase />} className="mt-6">
                <div className="flex flex-wrap gap-2">
                  {engine.databases.length > 0 ? (
                    engine.databases.map((db, i) => (
                      <span key={i} className="px-3 py-1 bg-indigo-900/30 text-indigo-300 rounded text-sm">
                        {db}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">None</span>
                  )}
                </div>
              </Section>

              {/* Source Modules */}
              <Section title="Source Modules" className="mt-6">
                <div className="flex flex-wrap gap-2">
                  {engine.sourceModules.map((sm, i) => (
                    <code key={i} className="px-3 py-1 bg-gray-800 rounded text-green-400 text-sm font-mono">
                      {sm}
                    </code>
                  ))}
                </div>
              </Section>

              {/* Failure Impact */}
              <Section title="Failure Impact" icon={<FiAlertCircle />} className="mt-6">
                <p className="text-red-300 bg-red-900/20 border border-red-900/40 rounded-lg p-4 text-sm">
                  {engine.failureImpact}
                </p>
              </Section>

              {/* Documentation */}
              <div className="mt-8 pt-4 border-t border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <FiClock />
                  <span>Deployment Status: {engine.deploymentStatus}</span>
                  <span>&middot;</span>
                  <span>Readiness: {engine.readiness}</span>
                </div>
                <a
                  href={engine.documentationUrl}
                  className="inline-flex items-center gap-1 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-gray-900 font-medium rounded-lg text-sm transition-colors"
                >
                  <FiExternalLink /> Documentation
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  icon,
  children,
  className = '',
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className={className}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full text-left mb-3 group"
      >
        <span className="text-gray-400 group-hover:text-gray-200 transition-colors">
          {open ? <FiChevronDown /> : <FiChevronRight />}
        </span>
        {icon && <span className="text-gray-400">{icon}</span>}
        <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
          {title}
        </h4>
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

function TagGroup({
  label,
  tags,
  color,
}: {
  label: string;
  tags: string[];
  color: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 mb-2">{label}</p>
      <div className="flex flex-wrap gap-1">
        {tags.map((t, i) => (
          <span key={i} className={`px-2 py-1 rounded text-xs ${color}`}>
            {t}
          </span>
        ))}
        {tags.length === 0 && (
          <span className="text-xs text-gray-600">None</span>
        )}
      </div>
    </div>
  );
}
