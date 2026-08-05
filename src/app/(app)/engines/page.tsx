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
    let result = nodes.filter((n) => n.type === 'engine' || n.type === 'product' || n.type === 'infrastructure');
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
    let y = 12;
    const L = 14;
    const W = 182;

    const pageBreak = () => { doc.addPage(); y = 12; };
    const checkBreak = (n = 0) => { if (y + n > 278) pageBreak(); };

    const h1 = (t: string) => {
      checkBreak(12);
      doc.setFillColor(20, 20, 30);
      doc.setDrawColor(60, 60, 80);
      doc.rect(L, y, W, 8, 'FD');
      doc.setFontSize(10);
      doc.setTextColor(255, 200, 0);
      doc.text(t, L + 3, y + 5.5);
      y += 10;
    };

    const h2 = (t: string) => {
      checkBreak(8);
      doc.setDrawColor(60, 60, 80);
      doc.setLineWidth(0.3);
      doc.line(L, y + 3, L + W, y + 3);
      doc.setFontSize(9);
      doc.setTextColor(200, 160, 30);
      doc.text(t, L, y + 7);
      y += 10;
    };

    const txt = (t: string, indent = 0) => {
      checkBreak(6);
      const lines = doc.splitTextToSize(t, W - indent * 2);
      doc.setFontSize(8);
      doc.setTextColor(180, 180, 180);
      for (const line of lines) {
        if (y > 278) pageBreak();
        doc.text(line, L + indent, y + 3);
        y += 4;
      }
      y += 2;
    };

    const items = (title: string | null, arr: string[]) => {
      if (title) txt(title, 0);
      if (!arr || arr.length === 0) { txt('STATUS: PENDING', 3); return; }
      for (const it of arr) txt(`\u2022 ${it}`, 3);
    };

    const kv = (k: string, v: string) => {
      txt(`${k}: ${v}`, 0);
    };

    const table = (rows: [string, string][]) => {
      const col1 = 50;
      const rx = L + col1 + 5;
      for (const [k, v] of rows) {
        checkBreak(5);
        doc.setFontSize(8);
        doc.setTextColor(140, 140, 140);
        doc.text(k, L, y + 3);
        doc.text(v, rx, y + 3, { maxWidth: W - col1 - 5 });
        y += 5;
      }
      y += 2;
    };

    // ========== COVER PAGE ==========
    doc.setFillColor(20, 20, 30);
    doc.rect(0, 0, 210, 60, 'F');
    doc.setFontSize(26);
    doc.setTextColor(255, 200, 0);
    doc.text(engine.name, L, 25);
    doc.setFontSize(12);
    doc.setTextColor(200, 200, 200);
    doc.text(engine.type === 'product' ? 'PRODUCT FACT SHEET' : engine.type === 'infrastructure' ? 'INFRASTRUCTURE FACT SHEET' : 'ENGINE FACT SHEET', L, 35);
    doc.setFontSize(9);
    doc.setTextColor(140, 140, 140);
    doc.text(`Algo IQ Ecosystem | v1.0 | ${new Date().toISOString().slice(0, 10)}`, L, 42);
    y = 65;

    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text('CONFIDENTIAL', L, 55);
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text('This document contains proprietary information of Algo IQ. Do not distribute without authorization.', L, 60);
    y = 75;

    table([
      ['Engine Name', engine.name],
      ['Version', `v${engine.version}`],
      ['Status', engine.status.toUpperCase()],
      ['Category', engine.category || 'engine'],
      ['Criticality', (engine as any).criticality || 'N/A'],
      ['Owner', engine.owner || 'STATUS: PENDING'],
      ['Server', engine.server],
      ['IP', engine.ip || 'STATUS: PENDING'],
      ['Ports', engine.ports || 'STATUS: PENDING'],
      ['Health Score', `${engine.health}%`],
      ['Layer', (engine as any).layer || 'STATUS: PENDING'],
      ['Environment', (engine as any).environment || 'STATUS: PENDING'],
      ['Readiness', (engine as any).readiness || 'STATUS: PENDING'],
    ]);
    y += 4;

    // ========== 01 OVERVIEW ==========
    h1('01 ENGINE OVERVIEW');
    txt(engine.description || 'STATUS: PENDING');

    // ========== 02 PURPOSE ==========
    h1('02 PURPOSE');
    h2('Why This Engine Exists');
    txt(engine.purpose || 'STATUS: PENDING');
    h2('Problem Solved');
    txt(engine.businessValue || 'STATUS: PENDING');

    // ========== 03 FEATURES ==========
    h1('03 FEATURES');
    const feat = (engine as any).features || [];
    if (feat.length === 0) { txt('STATUS: PENDING'); }
    else { for (const f of feat) txt(`\u2022 ${f}`, 2); }

    // ========== 04 API DOCUMENTATION ==========
    h1('04 API DOCUMENTATION');
    txt('Refer to Algo IQ API Reference for complete API documentation.', 2);
    txt('Endpoint pattern: https://docs.algoiq.internal/kb/' + engine.id + '/api', 2);
    txt('Authentication: Via Suraksha (JWT, API Keys)', 2);
    txt('Rate Limiting: Per API key with burst capacity', 2);
    txt('Error Codes: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 500 Internal Server Error', 2);

    // ========== 05 DEPENDENCY LIST ==========
    h1('05 DEPENDENCY LIST');
    h2('OS / Framework');
    txt('Linux (Ubuntu 22.04 LTS / CentOS 8)', 2);
    txt('NodeJS 20 LTS / Python 3.11 (as applicable)', 2);
    txt('PM2 Process Manager', 2);
    h2('Database');
    items(null, engine.databases || []);
    h2('Message Queue');
    if ((engine as any).communication?.mq) txt('RabbitMQ (via Lakshmi MQ)', 2);
    else txt('STATUS: PENDING', 2);
    h2('Other Engines');
    items(null, [...(engine.connectedEngines || []), ...(engine.connectedApis || [])]);

    // ========== 06 SECURITY ==========
    h1('06 SECURITY');
    txt('Authentication: Suraksha JWT / API Key validation', 2);
    txt('Authorization: RBAC with role-based permission scoping', 2);
    txt('Encryption: TLS 1.3 for all communications', 2);
    txt('Secrets Management: Suraksha Vault', 2);
    txt('Network: Internal-only communication via Narad tunnel', 2);
    txt('Certificate: Managed by Suraksha Certificate Authority', 2);
    txt('STATUS: PENDING - Detailed security requirements and firewall rules need verification from implementation', 2);

    // ========== 07 API KEY ==========
    h1('07 API KEY');
    txt('Generate: Via Suraksha Admin Portal > API Keys', 2);
    txt('Rotate: Monthly rotation recommended; Suraksha supports zero-downtime rotation', 2);
    txt('Permission Levels: Read, Write, Admin (scoped per engine)', 2);
    txt('Expiry: 90 days default, configurable per key', 2);
    txt('STATUS: PENDING - Verify exact key generation workflow from implementation', 2);

    // ========== 08 LIVE URL ==========
    h1('08 LIVE URL');
    txt('Production: https://algoiq.internal/' + engine.id, 2);
    txt('UAT: https://uat.algoiq.internal/' + engine.id, 2);
    txt('Development: https://dev.algoiq.internal/' + engine.id, 2);
    txt('STATUS: PENDING - Confirm actual URLs from deployment configuration', 2);

    // ========== 09 LOCAL NETWORK URL ==========
    h1('09 LOCAL NETWORK URL');
    txt('Internal IP: ' + (engine.ip || 'STATUS: PENDING'), 2);
    txt('Ports: ' + (engine.ports || 'STATUS: PENDING'), 2);
    txt('STATUS: PENDING - Verify exact internal URLs from network configuration', 2);

    // ========== 10 CONNECTION GUIDE ==========
    h1('10 CONNECTION GUIDE');
    txt(`Server: ${engine.server} (${engine.ip || 'N/A'})`, 2);
    txt(`Ports: ${engine.ports || 'N/A'}`, 2);
    const protos = Object.entries((engine as any).communication || {}).filter(([,v]: [string, any]) => v).map(([k]: [string, any]) => k.toUpperCase());
    txt(`Protocols: ${protos.length > 0 ? protos.join(', ') : 'N/A'}`, 2);
    txt('Health Check: /health endpoint (TCP probe via Narad)', 2);
    txt('Environment Variables: Refer to .env.example in repository', 2);
    txt('STATUS: PENDING - Complete connection samples need verification from source code', 2);

    // ========== 11 DATABASE ==========
    h1('11 DATABASE');
    if (engine.databases && engine.databases.length > 0) {
      txt('DATABASE REQUIRED: YES', 2);
      txt('Databases: ' + engine.databases.join(', '), 2);
    } else {
      txt('DATABASE REQUIRED: NO (or STATUS: PENDING)', 2);
    }
    txt('STATUS: PENDING - Table schemas, views, indexes need verification from actual DB schema', 2);

    // ========== 12 DIRECT DATABASE CONNECTION ==========
    h1('12 DIRECT DATABASE CONNECTION');
    txt('Allowed: No (by architecture policy)', 2);
    txt('Reason: All database access must go through the engine API. Direct DB connections bypass security, audit, and versioning controls.', 2);
    txt('STATUS: PENDING - Confirm from security policy documentation', 2);

    // ========== 13 CONFIGURATION ==========
    h1('13 CONFIGURATION');
    txt('Configuration File: .env / config.json (engine standard)', 2);
    txt('Ports: ' + (engine.ports || 'STATUS: PENDING'), 2);
    txt('Memory: Configured per engine instance', 2);
    txt('STATUS: PENDING - Full configuration parameters need verification from source code', 2);

    // ========== 14 INSTALLATION ==========
    h1('14 INSTALLATION');
    txt('OS: Linux Ubuntu 22.04 LTS / CentOS 8', 2);
    txt('NodeJS 20 LTS (or Python 3.11)', 2);
    txt('PM2 Process Manager', 2);
    txt('Docker: Supported via narad orchestration', 2);
    txt('STATUS: PENDING - Full installation guide needs verification', 2);

    // ========== 15 MIGRATION GUIDE ==========
    h1('15 MIGRATION GUIDE');
    txt('Version: v' + engine.version + ' (current)', 2);
    txt('STATUS: PENDING - Migration steps need verification for each version upgrade path', 2);

    // ========== 16 DISASTER RECOVERY ==========
    h1('16 DISASTER RECOVERY');
    txt('Backup: Daily automated via Narad deployment pipeline', 2);
    txt('RTO (Recovery Time Objective): STATUS: PENDING', 2);
    txt('RPO (Recovery Point Objective): STATUS: PENDING', 2);
    txt('Server Failure: Automatic restart via PM2 / Docker', 2);
    txt('Database Failure: Replica failover (if configured)', 2);
    txt('STATUS: PENDING - Complete DR plan needs verification', 2);

    // ========== 17 MONITORING ==========
    h1('17 MONITORING');
    txt('Health: Monitored by Narad (TCP probes) and Kavach (alerting)', 2);
    txt('Metrics: CPU, Memory, Latency, Queue Size via Prometheus + Grafana', 2);
    txt('Health API: /health endpoint responding to Narad probes', 2);
    txt('Alerts: Configured in Kavach with escalation to Suraksha', 2);
    txt('STATUS: PENDING - Specific metrics and thresholds need verification', 2);

    // ========== 18 LOGGING ==========
    h1('18 LOGGING');
    txt('Application Logs: PM2-managed stdout/stderr (std format)', 2);
    txt('API Logs: Request/response logged via middleware', 2);
    txt('Audit Logs: Captured by Chitragupta for all critical operations', 2);
    txt('Security Logs: Managed by Suraksha', 2);
    txt('STATUS: PENDING - Log format and retention policy need verification', 2);

    // ========== 19 TESTING ==========
    h1('19 TESTING');
    txt('Unit Test: STATUS: PENDING', 2);
    txt('Integration Test: STATUS: PENDING', 2);
    txt('Performance Test: STATUS: PENDING', 2);
    txt('UAT: Managed by Parikshak testing engine', 2);
    txt('STATUS: PENDING - Test coverage and results need verification', 2);

    // ========== 20 TROUBLESHOOTING ==========
    h1('20 TROUBLESHOOTING');
    txt('Common Problems: Refer to Knowledge Base at /kb/' + engine.id + '/troubleshoot', 2);
    txt('Known Issues: STATUS: PENDING - Verify from issue tracker', 2);
    txt('Recovery: Automatic restart via PM2; manual intervention via DXCC', 2);

    // ========== 21 AI PROMPT LIBRARY ==========
    h1('21 AI PROMPT LIBRARY');
    txt(`Developer: "Explain the architecture of ${engine.name} in the Algo IQ Ecosystem"`, 2);
    txt(`QA: "List all test cases required for ${engine.name} validation"`, 2);
    txt(`Support: "How to troubleshoot ${engine.name} connectivity issues"`, 2);
    txt(`Operations: "What are the monitoring thresholds for ${engine.name}"`, 2);

    // ========== 22 USE CASES ==========
    h1('22 USE CASES');
    txt(`Business: ${engine.businessValue || 'STATUS: PENDING'}`, 2);
    txt(`Inputs: ${(engine.inputs || []).join(', ') || 'STATUS: PENDING'}`, 2);
    txt(`Outputs: ${(engine.outputs || []).join(', ') || 'STATUS: PENDING'}`, 2);

    // ========== 23 BENEFITS ==========
    h1('23 BENEFITS');
    txt('Business Value: ' + (engine.businessValue || 'STATUS: PENDING'), 2);
    txt('Performance: Tracked via Prometheus/Grafana dashboards', 2);
    txt('Scalability: Horizontal scaling via Narad orchestration', 2);
    txt('Maintainability: Modular architecture with version tracking', 2);

    // ========== 24 WHY THIS ENGINE EXISTS ==========
    h1('24 WHY THIS ENGINE EXISTS');
    txt((engine as any).purpose || engine.purpose || 'STATUS: PENDING', 2);
    txt('Architecture Decision: Designed as part of the ' + ((engine as any).layer || 'Algo IQ Ecosystem') + ' architecture', 2);
    txt('Future Enhancements: ' + ((engine as any).futureEnhancements || 'STATUS: PENDING'), 2);

    // ========== 25 SHOW STOPPERS ==========
    h1('25 SHOW STOPPERS');
    txt('Failure Impact: ' + ((engine as any).failureImpact || 'STATUS: PENDING'), 2);
    txt(`Critical dependencies: ${[...(engine.connectedEngines || []), ...(engine.connectedApis || [])].join(', ')}`, 2);
    txt('Recovery Steps: Narad automatic restart; DXCC manual intervention; PM2 process management', 2);

    // ========== 26 VERSION HISTORY ==========
    h1('26 VERSION HISTORY');
    txt('Current Version: v' + engine.version, 2);
    txt('STATUS: PENDING - Full release history needs verification from PMO version management', 2);

    // ========== 27 CHANGE LOG ==========
    h1('27 CHANGE LOG');
    txt('Current Version: v' + engine.version + ' (status: ' + engine.status + ')', 2);
    txt('STATUS: PENDING - Detailed changelog needs verification from PMO release management', 2);

    // ========== 28 RESPONSIBLE PERSON ==========
    h1('28 RESPONSIBLE PERSON');
    txt('Owner: ' + (engine.owner || 'STATUS: PENDING'), 2);
    txt('Server: ' + engine.server, 2);
    txt('STATUS: PENDING - Product Manager, Tech Lead, Support Team contacts need verification', 2);

    // ========== FINAL ==========
    h1('END OF DOCUMENT');
    txt(`This fact sheet for ${engine.name} v${engine.version} was generated by Algo IQ Ecosystem Knowledge Explorer.`, 2);
    txt('Sections marked STATUS: PENDING require verification from implementation, source code, or knowledge base.', 2);
    txt(`Generated: ${new Date().toISOString().slice(0, 19).replace('T', ' ')}`, 2);

    doc.save(`${engine.name.replace(/\s+/g, '_')}_FactSheet.pdf`);
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <FiCpu className="text-2xl text-amber-400" />
          <h1 className="text-3xl font-bold">Engine & Product Knowledge Explorer</h1>
        </div>
        <p className="text-gray-400 mb-6">
          Explore all engines, products, and infrastructure components powering the Algo IQ ecosystem
        </p>

        {/* Search & Filter Bar */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="relative flex-1 min-w-[280px]">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search engines & products..."
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
                  {eng.type === 'engine' ? 'Engine' : eng.type === 'product' ? 'Product' : eng.type?.toUpperCase()}
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
