'use client';
import { useState, useMemo, useRef, useEffect } from 'react';
import { knowledgeBase, type KnowledgeDocument } from '@/data/knowledge';
import { FiSearch, FiFileText, FiBookOpen, FiList, FiChevronRight, FiChevronDown, FiExternalLink, FiCalendar, FiUser, FiClock, FiPrinter, FiServer, FiGrid } from 'react-icons/fi';

// ──────────────────── helpers ────────────────────

const docTypeLabels: Record<string, string> = {
  BRS: 'BRS', SRS: 'SRS', HLD: 'HLD', LLD: 'LLD', API_DOC: 'API Doc',
  DB_DOC: 'DB Doc', DEPLOY: 'Deploy', DEVOPS: 'DevOps', INSTALL: 'Install',
  USER: 'User Guide', ADMIN: 'Admin', TROUBLESHOOT: 'Troubleshoot',
  FAQ: 'FAQ', RELEASE: 'Release', KB: 'Knowledge Base', TEST: 'Test', AUDIT: 'Audit', LICENSE: 'License',
};

const docStatusColors: Record<string, string> = {
  'complete': '#10B981',
  'in-progress': '#F59E0B',
  'draft': '#6B7280',
  'planned': '#3B82F6',
};

interface ContentSection {
  heading: string;
  content: string;
  subSections?: ContentSection[];
}

interface DocContent {
  sections: ContentSection[];
  author: string;
  version: string;
  lastUpdated: string;
}

interface EntityProfile {
  desc: string;
  domain: string;
  tech: string[];
  stakeholders: string[];
  metrics: string[];
  deps: string[];
}

function hashId(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) { h = ((h << 5) - h) + str.charCodeAt(i); h |= 0; }
  return Math.abs(h);
}

function kebab(str: string): string { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

const AUTHORS = ['Anand Krishnan', 'Priya Sharma', 'Rajesh Iyer', 'Vikram Patel', 'Ananya Gupta', 'Sandeep Reddy', 'Kavita Deshmukh', 'Mohan Nair', 'Deepika Joshi', 'Arun Karthik'];
const VERSIONS = ['v1.0.0', 'v1.2.1', 'v2.0.0', 'v2.1.3', 'v3.0.0', 'v3.2.0', 'v1.5.0', 'v2.4.1', 'v4.0.0', 'v1.1.0'];
const DATES = ['2025-12-15', '2026-01-20', '2026-03-05', '2026-04-18', '2026-05-22', '2026-06-10', '2025-10-30', '2026-02-14', '2026-07-01', '2025-11-25'];

function pick(arr: string[], seed: number): string { return arr[seed % arr.length]; }

// ──────────────────── ENTITY profiles ────────────────────

const ENTITY: Record<string, EntityProfile> = {
  'ENT-GANESH': {
    desc: 'high-frequency tick processing and OHLC candle generation engine',
    domain: 'Market Data',
    tech: ['Rust', 'Apache Kafka', 'Redis Streams', 'ClickHouse', 'gRPC'],
    stakeholders: ['Quantitative Traders', 'Market Data Analysts', 'Exchange Operations Team', 'Risk Managers'],
    metrics: ['Tick-to-Candle Latency < 5ms', 'Throughput > 1M ticks/sec', 'OHLC Accuracy 99.99%', 'Uptime 99.999%'],
    deps: ['Narad (Market Data Feed)', 'Delta XI (Analytics Pipeline)', 'Chitragupta (Audit Trail)', 'Kavach (Health Monitoring)'],
  },
  'ENT-SURYA': {
    desc: 'comprehensive portfolio analytics and performance attribution platform',
    domain: 'Portfolio Analytics',
    tech: ['Python', 'Apache Spark', 'PostgreSQL', 'Redis', 'FastAPI'],
    stakeholders: ['Portfolio Managers', 'Research Analysts', 'Compliance Officers', 'Client Reporting Team'],
    metrics: ['Attribution Accuracy ±0.01%', 'Daily Report Generation < 2 min', 'Factor Model R² > 0.85'],
    deps: ['Chitragupta (Trade Data)', 'Delta XI (Risk Metrics)', 'TalkOffice (Portfolio Data)'],
  },
  'ENT-VEGA': {
    desc: 'high-performance order processing engine with smart order routing',
    domain: 'Order Management',
    tech: ['Go', 'gRPC', 'PostgreSQL', 'NATS JetStream', 'Prometheus'],
    stakeholders: ['Algo Traders', 'Broker Integration Team', 'Exchange Connectivity Team', 'Operations'],
    metrics: ['Order Latency < 100µs', 'Fill Rate > 99.5%', 'Concurrent Orders > 50K/sec'],
    deps: ['Narad (Broker Connectivity)', 'Suraksha (Pre-Trade Risk)', 'Kavach (Circuit Breaker)', 'Chitragupta (Trade Recording)'],
  },
  'ENT-TALKDELTA': {
    desc: 'AI/ML strategy engine leveraging transformer models for regime detection and signal generation',
    domain: 'AI & Machine Learning',
    tech: ['Python', 'PyTorch', 'ONNX Runtime', 'MLflow', 'Apache Kafka', 'Redis'],
    stakeholders: ['Quant Researchers', 'ML Engineers', 'Data Scientists', 'Strategy Developers'],
    metrics: ['Model Inference < 10ms', 'Regime Detection Accuracy > 92%', 'Feature Freshness < 1s'],
    deps: ['Ganesh (OHLC Data)', 'Delta XI (Derived Features)', 'VYUH (Strategy Orchestration)', 'Parikshak (Model Validation)'],
  },
  'ENT-TALKOPTIONS': {
    desc: 'extensive API platform serving 150+ endpoints for options trading, analytics, and market data',
    domain: 'API Platform',
    tech: ['Node.js', 'TypeScript', 'Nginx', 'Kong Gateway', 'Redis', 'MongoDB'],
    stakeholders: ['API Consumers', 'Third-Party Integrators', 'Developer Community', 'Product Team'],
    metrics: ['API Availability 99.99%', 'P95 Latency < 50ms', 'Rate Limit Compliance 100%'],
    deps: ['Rakshak (Authentication)', 'Delta XI (Options Analytics)', 'Ganesh (Market Data)'],
  },
  'ENT-TALKOFFICE': {
    desc: 'comprehensive risk management system with real-time dashboards for traders and risk managers',
    domain: 'Risk Management',
    tech: ['React', 'Node.js', 'PostgreSQL', 'WebSocket', 'Apache Kafka'],
    stakeholders: ['Traders', 'Risk Managers', 'Compliance Officers', 'Broker Operations'],
    metrics: ['Risk Check Latency < 1ms', 'Dashboard Refresh < 500ms', 'Compliance Accuracy 100%'],
    deps: ['Suraksha (Risk Engine)', 'Chitragupta (PnL Data)', 'Vega (Order Data)', 'Rakshak (RBAC)'],
  },
  'ENT-SUCHAK': {
    desc: 'real-time event detection engine powered by NLP for corporate actions, news sentiment, and market events',
    domain: 'Event Intelligence',
    tech: ['Python', 'spaCy', 'Transformers', 'Elasticsearch', 'Apache Kafka'],
    stakeholders: ['Research Analysts', 'Traders', 'News Curators', 'Strategy Developers'],
    metrics: ['Event Detection Latency < 2s', 'Sentiment Accuracy > 88%', 'News Coverage > 500 sources'],
    deps: ['VYUH (Signal Distribution)', 'Delta XI (Impact Analysis)', 'Chitragupta (Event Logging)'],
  },
  'ENT-KAVACH': {
    desc: 'circuit breaker and kill-switch system ensuring operational safety and system health monitoring',
    domain: 'System Safety',
    tech: ['Go', 'etcd', 'Prometheus', 'Grafana', 'AlertManager'],
    stakeholders: ['Operations Team', 'Risk Managers', 'Compliance Officers', 'System Administrators'],
    metrics: ['Kill Switch Activation < 50ms', 'Health Check Interval 100ms', 'False Positive Rate < 0.001%'],
    deps: ['Vega (Order Flow)', 'Narad (Connectivity Status)', 'Suraksha (Risk Thresholds)'],
  },
  'ENT-RAKSHAK': {
    desc: 'identity and access management platform with mTLS, RBAC, and comprehensive security auditing',
    domain: 'Security & Identity',
    tech: ['Go', 'Vault', 'OpenTelemetry', 'PostgreSQL', 'gRPC'],
    stakeholders: ['Security Team', 'System Administrators', 'Compliance Auditors', 'Developer Team'],
    metrics: ['Auth Latency < 5ms', 'Certificate Rotation 100% automated', 'Audit Log Retention 7 years'],
    deps: ['Kavach (Security Events)', 'Chitragupta (Audit Storage)', 'Narad (Secure Communication)'],
  },
  'ENT-CHITRAGUPTA': {
    desc: 'immutable accounting and audit trail system recording every trade, position change, and P&L event',
    domain: 'Accounting & Audit',
    tech: ['Java', 'Apache Flink', 'PostgreSQL', 'Apache Parquet', 'S3'],
    stakeholders: ['Finance Team', 'Compliance Auditors', 'Regulatory Reporting', 'Risk Managers'],
    metrics: ['Trade Recording Latency < 1ms', 'Audit Trail Completeness 100%', 'PnL Accuracy ±0.001%'],
    deps: ['Vega (Trade Events)', 'Surya (Portfolio Data)', 'Rakshak (Access Logs)'],
  },
  'ENT-NARAD': {
    desc: 'universal connectivity hub supporting FIX, WebSocket, and proprietary protocols for broker and exchange integration',
    domain: 'Connectivity',
    tech: ['Java', 'Netty', 'QuickFIX/J', 'Apache Kafka', 'gRPC'],
    stakeholders: ['Broker Integration Team', 'Exchange Ops', 'Network Engineers', 'Trading Desks'],
    metrics: ['FIX Message Latency < 10µs', 'Reconnection Time < 500ms', 'Message Throughput > 100K/sec'],
    deps: ['Kavach (Circuit Breaker)', 'Rakshak (Authentication)', 'Vega (Order Routing)'],
  },
  'ENT-SURAKSHA': {
    desc: 'multi-layered risk management engine with pre-trade, real-time, and post-trade risk controls',
    domain: 'Risk Management',
    tech: ['C++', 'Redis', 'Apache Kafka', 'PostgreSQL', 'gRPC'],
    stakeholders: ['Risk Managers', 'Compliance Team', 'Trading Desks', 'Exchange Regulators'],
    metrics: ['Pre-Trade Check < 50µs', 'Risk Limit Violation Detection 100%', 'What-If Analysis < 100ms'],
    deps: ['Vega (Order Flow)', 'Chitragupta (Position Data)', 'Kavach (Safety Limits)'],
  },
  'ENT-KUBERALPHA': {
    desc: 'institutional-grade order flow and sentiment analysis engine for alpha generation',
    domain: 'Alpha Research',
    tech: ['Python', 'Apache Flink', 'TimescaleDB', 'Redis', 'FastAPI'],
    stakeholders: ['Institutional Sales', 'Research Desk', 'Quantitative Analysts', 'Portfolio Managers'],
    metrics: ['Order Flow Imbalance Detection < 5ms', 'Institutional Flow Coverage > 85%'],
    deps: ['Ganesh (Market Data)', 'Narad (Order Flow Data)', 'Delta XI (Sentiment Features)'],
  },
  'ENT-STRATEGYFACTORY': {
    desc: 'end-to-end strategy creation platform with visual builder, backtesting engine, and deployment workflow',
    domain: 'Strategy Development',
    tech: ['TypeScript', 'React', 'Node.js', 'Python (Backtest)', 'PostgreSQL'],
    stakeholders: ['Strategy Developers', 'Quant Researchers', 'Risk Team', 'Trading Operations'],
    metrics: ['Backtest Speed > 10M bars/sec', 'Strategy Deployment < 5 min', 'Creator Studio Uptime 99.9%'],
    deps: ['Simulator (Market Replay)', 'Parikshak (Strategy Validation)', 'VYUH (Strategy Deployment)', 'Chitragupta (PnL Tracking)'],
  },
  'ENT-DXCC': {
    desc: 'centralized command center providing unified dashboards, alerts, and incident management for trading operations',
    domain: 'Operations Command',
    tech: ['React', 'TypeScript', 'WebSocket', 'GraphQL', 'Redis'],
    stakeholders: ['Operations Team', 'Incident Managers', 'Trading Desk Heads', 'System Administrators'],
    metrics: ['Dashboard Latency < 1s', 'Alert Delivery < 2s', 'Incident Resolution < 5 min'],
    deps: ['Kavach (System Health)', 'Vega (Order Status)', 'Suraksha (Risk Alerts)', 'Chitragupta (PnL Overview)'],
  },
  'ENT-SIMULATOR': {
    desc: 'high-fidelity market simulation and strategy backtesting environment with tick-level replay',
    domain: 'Simulation & Testing',
    tech: ['Rust', 'Python', 'TimescaleDB', 'Redis', 'Docker'],
    stakeholders: ['Strategy Developers', 'Quant Researchers', 'QA Engineers', 'Risk Analysts'],
    metrics: ['Replay Fidelity 100% tick-accurate', 'Simulation Speed Ratio > 50x', 'Multi-Asset Support 10+ assets'],
    deps: ['Ganesh (Historical Data)', 'Vega (Order Simulation)', 'Strategy Factory (Backtest Config)', 'Chitragupta (PnL Simulation)'],
  },
  'ENT-TRADEPILOT': {
    desc: 'multi-platform trading terminal with desktop and mobile clients for order execution and market monitoring',
    domain: 'Trading Terminal',
    tech: ['Electron', 'React Native', 'TypeScript', 'WebSocket', 'SQLite'],
    stakeholders: ['Traders', 'Broker Partners', 'UX Designers', 'Support Team'],
    metrics: ['App Launch < 2s', 'Order Execution < 100ms', 'Cross-Platform Sync < 500ms'],
    deps: ['Vega (Order Routing)', 'Rakshak (Auth)', 'Narad (Market Data)', 'DXCC (Alerts)'],
  },
  'ENT-PARIKSHAK': {
    desc: 'strategy validation and certification framework ensuring all strategies meet performance and safety standards',
    domain: 'Quality Assurance',
    tech: ['Python', 'pytest', 'Docker', 'PostgreSQL', 'Apache Kafka'],
    stakeholders: ['QA Team', 'Strategy Developers', 'Risk Managers', 'Compliance Officers'],
    metrics: ['Test Coverage > 95%', 'Validation Cycle < 30 min', 'Certification Accuracy 100%'],
    deps: ['Simulator (Test Scenarios)', 'Strategy Factory (Strategy Metadata)', 'Suraksha (Risk Validation)'],
  },
  'ENT-DELTAXI': {
    desc: 'advanced analytics engine computing Greeks, implied volatility surfaces, cointegration, and technical indicators',
    domain: 'Derivatives Analytics',
    tech: ['C++', 'CUDA', 'Python', 'PostgreSQL', 'Redis', 'gRPC'],
    stakeholders: ['Options Traders', 'Quant Researchers', 'Risk Analysts', 'Market Makers'],
    metrics: ['Greek Calculation < 1ms', 'IV Surface Build < 5s', 'Cointegration Test < 100ms'],
    deps: ['Ganesh (Price Data)', 'TalkOptions (API Distribution)', 'Surya (Portfolio Greeks)', 'VYUH (Signal Integration)'],
  },
  'ENT-VYUH': {
    desc: 'strategy orchestration engine managing multi-strategy execution, signal aggregation, and state transitions',
    domain: 'Strategy Orchestration',
    tech: ['Go', 'NATS', 'etcd', 'PostgreSQL', 'Prometheus'],
    stakeholders: ['Strategy Developers', 'Trading Operations', 'Performance Analysts', 'Risk Managers'],
    metrics: ['State Transition < 10ms', 'Signal Aggregation < 5ms', 'Orchestration Throughput > 100K signals/sec'],
    deps: ['Delta XI (Signal Generation)', 'Vega (Order Execution)', 'Suraksha (Risk Checks)', 'Chitragupta (Trade Recording)'],
  },
  'ENT-SPREADWATCH': {
    desc: 'arbitrage detection engine monitoring spread deviations across exchanges and instruments in real time',
    domain: 'Arbitrage Detection',
    tech: ['Rust', 'Apache Kafka', 'Redis Streams', 'PostgreSQL', 'gRPC'],
    stakeholders: ['Arbitrage Traders', 'Market Makers', 'Quantitative Researchers', 'Exchange Operations'],
    metrics: ['Spread Detection Latency < 1ms', 'Arb Opportunity Coverage > 50 pairs', 'Deviation Accuracy ±0.01 tick'],
    deps: ['Ganesh (Tick Data)', 'Narad (Multi-Venue Feeds)', 'Vega (Order Execution)', 'Kavach (Safety Limits)'],
  },
};

// ──────────────────── document content generators ────────────────────

function brsSections(e: EntityProfile): ContentSection[] {
  return [
    {
      heading: '1. Overview',
      content: `This Business Requirements Specification (BRS) defines the business context, objectives, and high-level requirements for the ${e.desc}. This system constitutes the ${e.domain} layer within the ALgo-IQ algorithmic trading ecosystem, enabling stakeholders to achieve quantifiable improvements in trading operations, risk management, and decision-making workflows.\n\nThis BRS was prepared following extensive stakeholder interviews, competitive market analysis of algorithmic trading platforms in the Indian capital markets, and review of SEBI regulatory guidelines for algo trading infrastructure. The requirements herein have been prioritized using the MoSCoW framework, with all sections marked as \u201CMust-Have\u201D representing non-negotiable capabilities for the Minimum Viable Product (MVP).`,
    },
    {
      heading: '2. Business Need',
      content: `Algorithmic trading in Indian markets has grown at a CAGR of 42% over the past five years. Brokers and institutional trading desks face mounting pressure to reduce latency, improve fill rates, and maintain compliance with evolving SEBI regulatory requirements. An in-house ${e.domain.toLowerCase()} capability eliminates dependency on third-party vendors, reduces per-trade costs by an estimated 65%, and provides full control over intellectual property.\n\nThe key business drivers identified are: (1) competitive differentiation through proprietary ${e.domain.toLowerCase()} technology, (2) regulatory compliance with SEBI Algo Trading Framework 2025, (3) operational cost reduction through vendor consolidation, and (4) scalability to handle peak NSE/BSE combined order flow of over 500,000 orders per second during market events.`,
    },
    {
      heading: '3. Functional Requirements',
      content: `The system must deliver the following core functional capabilities, each traceable to one or more business objectives defined in Section 2:\n\n\u2022 FR-001: Real-time data ingestion from upstream market data sources via ${e.deps[0]} with sub-millisecond latency SLA.\n\u2022 FR-002: Core processing pipeline supporting configurable ${e.metrics[0].split(' ').slice(0, 3).join(' ')}.\n\u2022 FR-003: RESTful API and gRPC interfaces for downstream consumers with versioned endpoints and backward compatibility guarantees.\n\u2022 FR-004: Comprehensive logging and audit trail integration with Chitragupta for regulatory compliance.\n\u2022 FR-005: Real-time health monitoring and alert integration with Kavach for operational safety.\n\u2022 FR-006: Configurable business rules engine supporting hot-reload of rule sets without service restart.\n\u2022 FR-007: Multi-tenancy support with tenant-level isolation for data, configuration, and rate limiting.`,
    },
    {
      heading: '4. Non-Functional Requirements',
      content: `Performance: The system must process data with maximum end-to-end latency as defined in the metrics section. All synchronous operations must complete within their SLA boundaries at the P99 percentile under peak load. Horizontal scaling must be linear up to 100 nodes without degradation.\n\nAvailability: Target SLA of ${e.metrics.includes('Uptime 99.999%') ? '99.999% (five-nines) uptime' : '99.99% (four-nines) uptime'} measured on a rolling 30-day window. Scheduled maintenance windows shall not exceed 2 hours per quarter and must be communicated 7 days in advance.\n\nSecurity: All inter-service communication must use mTLS 1.3. Data at rest must be encrypted using AES-256-GCM. All API endpoints must authenticate via JWT tokens issued by Rakshak. Role-Based Access Control (RBAC) must enforce least-privilege principles at the API method level.`,
    },
    {
      heading: '5. Stakeholders',
      content: `Primary Stakeholders:\n${e.stakeholders.map(s => `\u2022 ${s} \u2014 Direct users of the system who derive daily operational value`).join('\n')}\n\nSecondary Stakeholders:\n\u2022 System Administrators \u2014 Responsible for deployment, monitoring, and incident response\n\u2022 Compliance & Legal Team \u2014 Ensure regulatory adherence and data retention policies\n\u2022 Vendor Partners \u2014 Third-party service providers integrated via ${e.deps[0].split('(')[0].trim()}\n\u2022 Executive Sponsors \u2014 Approve budget, timelines, and strategic direction\n\nStakeholder communication cadence: weekly status reports to primary stakeholders, monthly steering committee reviews, and quarterly executive briefings.`,
    },
    {
      heading: '6. Success Criteria',
      content: `The following measurable criteria define successful delivery of this BRS:\n\n\u2022 SC-001: ${e.metrics[0]} in production environment under peak load conditions, validated by independent performance testing.\n\u2022 SC-002: ${e.metrics[1] || 'All core functional requirements'} passing acceptance tests with zero critical defects.\n\u2022 SC-003: ${e.stakeholders[0]} satisfaction score \u2265 4.2/5.0 on post-deployment survey conducted after 90 days of production use.\n\u2022 SC-004: Reduction in ${e.domain.toLowerCase()}-related operational incidents by at least 60% compared to legacy system baseline.\n\u2022 SC-005: Successful completion of SEBI system audit for ${e.domain} module within 60 days of production deployment.\n\u2022 SC-006: All ${e.deps.length} upstream/downstream integrations passing end-to-end integration tests with zero data loss.`,
    },
  ];
}

function srsSections(e: EntityProfile): ContentSection[] {
  return [
    {
      heading: '1. System Architecture',
      content: `The ${e.desc.split(',')[0].split(' - ')[0] || e.desc} follows a microservices architecture pattern with event-driven communication. The system is decomposed into bounded contexts: Ingestion Layer, Processing Engine, Storage Layer, and API Gateway. Each service is independently deployable and scales horizontally.\n\nThe technology stack includes ${e.tech.slice(0, 3).join(', ')} for core services, ${e.tech[3] || 'PostgreSQL'} for persistent storage, and ${e.tech[4] || 'gRPC'} for inter-service communication. The system employs the CQRS (Command Query Responsibility Segregation) pattern, separating read and write paths to optimize for the heavy read-load characteristic of ${e.domain.toLowerCase()} workflows.\n\nAll services register with a service discovery mechanism and are fronted by an API gateway that handles authentication, rate limiting, request routing, and protocol translation. The deployment topology supports both on-premises colocation (for latency-sensitive paths) and cloud bursting (for batch and analytical workloads).`,
    },
    {
      heading: '2. Interface Requirements',
      content: `The system exposes the following external interfaces:\n\nREST API: JSON over HTTPS on port 443. All endpoints follow OpenAPI 3.1 specification with semantic versioning in the URL path (/v1/, /v2/). Responses include HATEOAS links for resource discovery.\n\ngRPC API: Protocol Buffers over HTTP/2 on port 50051. Used for low-latency internal service-to-service communication and for high-throughput external consumers requiring streaming capabilities.\n\nMessage Queue: ${e.tech.includes('Apache Kafka') ? 'Apache Kafka' : e.tech.includes('NATS') ? 'NATS JetStream' : 'Redis Streams'} for asynchronous event publishing. Events follow the CloudEvents 1.0 specification with Avro schema registry for schema evolution.\n\nMonitoring Interface: Prometheus metrics endpoint on port 9090, OpenTelemetry traces exported to Jaeger, and structured JSON logs shipped to Elasticsearch via Filebeat.`,
    },
    {
      heading: '3. Performance Requirements',
      content: `Latency Targets:\n\u2022 Ingress processing: P50 < 500\u00b5s, P99 < 2ms from network ingress to persistence acknowledgment\n\u2022 ${e.domain} query: P50 < 10ms, P99 < 50ms for standard analytical queries\n\u2022 API response: P50 < 20ms, P99 < 100ms for REST endpoints (excluding data transfer)\n\u2022 gRPC streaming: First-byte latency < 5ms for server-side streaming responses\n\nThroughput Requirements:\n\u2022 Sustained ingestion: ${e.metrics[0].includes('>') ? e.metrics[0].split('>')[1].trim() : '50,000'} events per second\n\u2022 Burst capacity: 3x sustained rate for 30-second burst windows\n\u2022 Concurrent API connections: 10,000 simultaneous WebSocket/gRPC connections\n\nResource Constraints:\n\u2022 Maximum heap memory per service instance: 4 GB\n\u2022 CPU utilization target: < 70% at peak load\n\u2022 Network bandwidth allocation: 10 Gbps per node for market data ingestion services`,
    },
    {
      heading: '4. Security Requirements',
      content: `Authentication & Authorization:\n\u2022 All API endpoints must enforce JWT-based authentication with token expiry not exceeding 15 minutes\n\u2022 Service-to-service authentication via mTLS 1.3 with certificate rotation every 24 hours\n\u2022 RBAC with role hierarchy supporting at least Admin, Operator, Viewer, and Auditor roles\n\u2022 API keys for programmatic access with configurable rate limits and IP allowlisting\n\nData Protection:\n\u2022 PII and sensitive financial data must be encrypted at rest using AES-256-GCM\n\u2022 All network traffic must use TLS 1.3 with forward secrecy\n\u2022 Database connection strings and API keys must be stored in HashiCorp Vault, never in configuration files\n\u2022 Audit logs must capture all access attempts (successful and failed), configuration changes, and data modifications\n\nCompliance:\n\u2022 SEBI Cybersecurity and Cyber Resilience Framework for MIIs\n\u2022 ISO 27001:2022 controls for information security management\n\u2022 RBI guidelines on IT governance for financial market infrastructure`,
    },
    {
      heading: '5. Data Requirements',
      content: `Data Models:\n\u2022 Tick/Event Data: Immutable append-only log with nanosecond-precision timestamps, instrument identifier, price, volume, and flags\n\u2022 Configuration Data: Version-controlled JSON documents with audit trail, supporting rollback to any previous version\n\u2022 Derived/Analytical Data: Materialized views refreshed at configurable intervals with staleness SLAs\n\nStorage Strategy:\n\u2022 Hot storage (0-30 days): In-memory cache (${e.tech.includes('Redis') ? 'Redis' : 'In-memory LRU'}) + SSD-backed database for sub-millisecond access\n\u2022 Warm storage (30-365 days): Columnar database (ClickHouse/Parquet on S3) for analytical queries\n\u2022 Cold storage (1-7 years): Compressed Parquet files on object storage for regulatory retention\n\nData Governance:\n\u2022 All data entities must have defined owners, retention policies, and access classifications\n\u2022 Data lineage must be captured from ingestion through all transformations to final output\n\u2022 Personally Identifiable Information (PII) must be tokenized before entering the analytical pipeline`,
    },
  ];
}

function apiDocSections(e: EntityProfile): ContentSection[] {
  const basePath = kebab(e.desc.split(/[,:]/)[0]) || kebab(e.domain);
  return [
    {
      heading: '1. Authentication',
      content: `All API requests require authentication via JWT Bearer tokens issued by Rakshak IAM. To obtain a token, send a POST request to the /auth/token endpoint with your client ID and client secret.\n\n\`\`\`bash\ncurl -X POST https://api.algoiq.internal/auth/token \\\n  -H "Content-Type: application/json" \\\n  -d '{"client_id": "your-client-id", "client_secret": "your-client-secret"}'\n\`\`\`\n\nThe response contains an access_token (valid for 15 minutes) and a refresh_token (valid for 24 hours). Include the access_token in the Authorization header of all subsequent requests:\n\n\`\`\`\nAuthorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...\n\`\`\`\n\nService-to-service communication uses mTLS 1.3 with client certificates, eliminating the need for token-based auth in internal service mesh calls.`,
    },
    {
      heading: '2. Base URL',
      content: `Production environment:\n\`\`\`\nhttps://api.algoiq.internal/v2/${basePath}/\n\`\`\`\n\nSandbox/Staging environment:\n\`\`\`\nhttps://sandbox.algoiq.internal/v2/${basePath}/\n\`\`\`\n\nAll API versions are specified in the URL path. The current stable version is v2. The v1 endpoint will be deprecated on 2026-12-31 and is available at /v1/. A migration guide is available in the release notes for each service.`,
    },
    {
      heading: '3. Endpoints',
      content: 'The following endpoints are available for the ' + e.desc.split(',')[0] + ' API. All endpoints return JSON and accept JSON request bodies unless otherwise noted.',
      subSections: [
        {
          heading: 'GET /health',
          content: `Health check endpoint returning service status and dependency health.\n\nQuery Parameters: None\n\nResponse 200:\n\`\`\`json\n{\n  "status": "healthy",\n  "version": "2.1.0",\n  "uptime_seconds": 1209600,\n  "dependencies": {\n    "database": "healthy",\n    "message_queue": "healthy",\n    "cache": "healthy"\n  },\n  "timestamp": "2026-07-23T10:30:00Z"\n}\n\`\`\``,
        },
        {
          heading: 'POST /query',
          content: `Main query endpoint for retrieving processed ${e.domain.toLowerCase()} data.\n\nHeaders: Authorization: Bearer <token>, Content-Type: application/json\n\nRequest Body:\n\`\`\`json\n{\n  "instrument": "NIFTY-50",\n  "from": "2026-07-22T00:00:00Z",\n  "to": "2026-07-23T00:00:00Z",\n  "resolution": "1m",\n  "fields": ["open", "high", "low", "close", "volume"],\n  "limit": 1000\n}\n\`\`\`\n\nResponse 200:\n\`\`\`json\n{\n  "instrument": "NIFTY-50",\n  "resolution": "1m",\n  "count": 375,\n  "data": [\n    {\n      "timestamp": "2026-07-22T09:15:00Z",\n      "open": 19450.25,\n      "high": 19462.80,\n      "low": 19448.10,\n      "close": 19455.50,\n      "volume": 125000\n    }\n  ],\n  "next_cursor": "eyJ0aW1lc3RhbXAiOiIyMDI2LTA3LTIyVDA5OjIxOjAwWiJ9"\n}\n\`\`\``,
        },
        {
          heading: 'GET /config',
          content: `Retrieve current system configuration and runtime parameters.\n\nHeaders: Authorization: Bearer <token>\n\nResponse 200:\n\`\`\`json\n{\n  "config_version": "v3.2.1",\n  "parameters": {\n    "max_concurrent_requests": 10000,\n    "default_timeout_ms": 5000,\n    "rate_limit_per_second": 500,\n    "feature_flags": {\n      "streaming_enabled": true,\n      "batch_processing_enabled": true\n    }\n  },\n  "last_updated": "2026-07-20T08:00:00Z"\n}\n\`\`\``,
        },
      ],
    },
    {
      heading: '4. Rate Limiting',
      content: `Rate limits are enforced per API key with the following tiers:\n\n\u2022 Standard Tier: 500 requests per second, 50,000 requests per day\n\u2022 Premium Tier: 2,000 requests per second, 500,000 requests per day\n\u2022 Enterprise Tier: 10,000 requests per second, unlimited daily requests\n\nRate limit information is returned in response headers:\n\`\`\`\nX-RateLimit-Limit: 500\nX-RateLimit-Remaining: 487\nX-RateLimit-Reset: 1627045600\n\`\`\`\n\nWhen rate limit is exceeded, the API returns HTTP 429 Too Many Requests with a Retry-After header. Implement exponential backoff with jitter for retry logic.`,
    },
    {
      heading: '5. Error Codes',
      content: `Standard HTTP status codes are used throughout the API:\n\n| Code | Meaning | Description |\n|------|---------|-------------|\n| 200 | OK | Request succeeded |\n| 201 | Created | Resource created successfully |\n| 400 | Bad Request | Invalid request parameters or malformed JSON |\n| 401 | Unauthorized | Missing or invalid authentication token |\n| 403 | Forbidden | Authenticated but insufficient permissions |\n| 404 | Not Found | Requested resource does not exist |\n| 429 | Too Many Requests | Rate limit exceeded |\n| 500 | Internal Server Error | Unexpected server-side error |\n| 503 | Service Unavailable | Service temporarily unavailable (maintenance or overload) |\n\nAll error responses follow a consistent format:\n\`\`\`json\n{\n  "error": {\n    "code": "INVALID_PARAMETER",\n    "message": "Parameter 'resolution' must be one of: 1s, 1m, 5m, 15m, 1h, 1d",\n    "request_id": "req_8f3a2b1c9d4e",\n    "timestamp": "2026-07-23T10:30:00Z"\n  }\n}\n\`\`\``,
    },
    {
      heading: '6. Webhooks',
      content: `The API supports webhook callbacks for asynchronous event notifications. Register a webhook endpoint via the admin console.\n\nSupported Events:\n\u2022 ${e.domain.toLowerCase()}.data.ready \u2014 Fired when a batch of processed data is available\n\u2022 ${e.domain.toLowerCase()}.threshold.breach \u2014 Fired when a configured threshold is breached\n\u2022 system.status.change \u2014 Fired on service health status transitions\n\nWebhook payloads are signed with HMAC-SHA256. Verify the signature using the shared secret before processing:\n\`\`\`\nX-AlgoIQ-Signature: t=1627045600,v1=sha256=abc123...\n\`\`\``,
    },
  ];
}

function hldSections(e: EntityProfile): ContentSection[] {
  return [
    {
      heading: '1. Architecture Overview',
      content: `The ${e.desc.split(',')[0]} follows a layered architecture pattern organized into four tiers: Presentation, Application, Domain, and Infrastructure. Each tier communicates only with adjacent tiers, enforcing separation of concerns and allowing independent evolution of each layer.\n\nThe system is deployed as a cluster of containerized microservices orchestrated by Kubernetes. The architecture embraces the following design principles: (1) Fail-fast with circuit breakers on all external dependencies, (2) Eventual consistency for analytical data paths with strong consistency reserved for transactional operations, (3) Back-pressure propagation through all async pipelines using reactive streams, and (4) Immutable infrastructure with all configuration externalized into ConfigMaps and Secrets.\n\nKey architectural decisions include the choice of ${e.tech[0]} as the primary language for latency-critical paths, ${e.tech[1]} for asynchronous messaging to decouple producers from consumers, and ${e.tech[2]} for persistent storage with read replicas for scaling query throughput.`,
    },
    {
      heading: '2. Component Diagram',
      content: `The logical component architecture comprises the following major subsystems:\n\nAPI Gateway Layer \u2014 Kong API Gateway providing authentication, rate limiting, request transformation, and routing. Configured via declarative configuration with hot-reload capability. TLS termination occurs at this layer with certificate auto-renewal via cert-manager.\n\nService Mesh \u2014 Istio service mesh handling mTLS, traffic splitting for canary deployments, circuit breaking, and distributed tracing. Sidecar injection is enabled by default for all services in the mesh.\n\nCore Processing Cluster \u2014 A cluster of ${e.tech[0]} services implementing the primary business logic. This cluster is stateless and horizontally scalable, with state externalized to ${e.tech[2]} and ${e.tech[1]}.\n\nAnalytics Engine \u2014 ${e.tech.includes('Spark') ? 'Apache Spark' : e.tech.includes('Flink') ? 'Apache Flink' : 'Stream processing framework'} for complex event processing and real-time analytical computations.\n\nStorage Layer \u2014 Polyglot persistence using ${e.tech[2]} for transactional data, ${e.tech[1]} for event sourcing, and S3-compatible object storage for archival data.`,
    },
    {
      heading: '3. Data Flow',
      content: `Data flows through the system in three primary paths:\n\nReal-Time Path (Hot): Market data / events arrive at the Ingestion Gateway \u2192 Validated and normalized \u2192 Published to ${e.tech[1]} topic/stream \u2192 Consumed by Core Processing services \u2192 Results written to Redis cache and published as events \u2192 Downstream consumers notified via streaming gRPC.\n\nBatch Path (Warm): Raw events from ${e.tech[1]} are consumed by the Analytics Engine \u2192 Aggregated, joined, and transformed \u2192 Results materialized to ${e.tech[2]} \u2192 Exposed via Query API with caching at Redis layer.\n\nAudit Path (Cold): All state mutations are captured as events \u2192 Written to immutable append-only log \u2192 Archived to object storage daily \u2192 Indexed for compliance search via Elasticsearch.\n\nBack-pressure is managed end-to-end: if any consumer slows below its watermark, upstream producers throttle via reactive stream signals. This prevents cascading failures and data loss.`,
    },
    {
      heading: '4. Technology Stack',
      content: `Primary Language: ${e.tech[0]} chosen for its combination of performance, memory safety, and strong type system. All latency-critical paths (${
        e.tech[0] === 'Rust' ? 'tick processing, order matching, risk checks' :
        e.tech[0] === 'Go' ? 'order routing, health checks, auth' :
        e.tech[0] === 'C++' ? 'Greeks calculation, IV surface, pricing' :
        e.tech[0] === 'Python' ? 'ML inference, NLP, analytics' :
        e.tech[0] === 'Java' ? 'trade recording, FIX processing, connectivity' :
        e.tech[0] === 'TypeScript' || e.tech[0] === 'React' ? 'UI rendering, WebSocket handling, API gateway' :
        'core processing'
      }) are implemented in ${e.tech[0]}.\n\nMessaging: ${e.tech[1]} for durable, partitioned, ordered event streaming with exactly-once semantics. Topics are partitioned by instrument/trader ID for deterministic ordering. Retention period is 7 days with compaction enabled for state topics.\n\nStorage: ${e.tech[2]} as the primary OLTP database with read replicas for analytical queries. Connection pooling via PgBouncer with prepared statement caching.\n\nCaching: ${e.tech.includes('Redis') ? 'Redis Cluster (6 nodes) for distributed caching with sentinel for high availability. Cache-aside pattern with write-through for critical paths.' : 'In-memory LRU cache with TTL-based invalidation and distributed consensus via etcd for cache coherency.'}\n\nObservability: Prometheus + Grafana for metrics, Jaeger for distributed tracing, ELK stack for centralized logging with structured JSON format.`,
    },
    {
      heading: '5. Deployment View',
      content: `The system is deployed on a Kubernetes cluster spanning ${e.domain === 'Market Data' || e.domain === 'Order Management' ? 'three physical availability zones in a colocation facility' : 'two data centers with active-active configuration'}. Deployment follows a blue-green strategy with canary releases for high-risk changes.\n\nPod topology spread constraints ensure replicas are distributed across nodes and zones. Horizontal Pod Autoscaling (HPA) is configured with CPU and custom metrics (request latency, queue depth) as scaling triggers. Cluster Autoscaler provisions additional nodes when the HPA requests unschedulable pods.\n\nNetwork configuration:\n\u2022 Internal cluster communication over private VPC with 10.x.x.x addressing\n\u2022 External API exposure via LoadBalancer Service with AWS NLB / on-prem HAProxy\n\u2022 ${e.domain === 'Security & Identity' ? 'DMZ for public-facing services with WAF and DDoS protection' : 'Service-to-service communication restricted to mesh-internal traffic only'}\n\nResource allocation per service instance:\n\u2022 CPU: 2-8 vCPUs (request/limit) depending on service profile\n\u2022 Memory: 4-16 GB with GC tuning for managed-runtime services\n\u2022 Ephemeral storage: 20 GB for logs and temporary data`,
    },
  ];
}

function lldSections(e: EntityProfile): ContentSection[] {
  return [
    {
      heading: '1. Component Design',
      content: `This Low-Level Design document details the internal architecture of the core ${e.desc.split(',')[0].split(' - ')[0] || e.desc} component. The module is structured internally using the Hexagonal (Ports & Adapters) pattern, with a pure domain core surrounded by adapter layers for infrastructure concerns.\n\nDomain Core: Contains entities, value objects, domain services, and domain events with no external dependencies. All infrastructure concerns are injected through interfaces (ports) defined at the domain boundary. This enables unit testing of business logic without mocking infrastructure.\n\nPrimary Adapters (Driving Side): REST controllers, gRPC service implementations, message consumers that translate external inputs into domain commands and queries.\n\nSecondary Adapters (Driven Side): Repository implementations for ${e.tech[2]}, message publisher for ${e.tech[1]}, cache client for ${e.tech.includes('Redis') ? 'Redis' : 'in-memory store'}.`,
    },
    {
      heading: '2. Data Structures',
      content: `The following core data structures underpin the component:\n\n\`\`\`${e.tech[0].toLowerCase() === 'rust' ? 'rust' : e.tech[0].toLowerCase() === 'typescript' ? 'typescript' : e.tech[0].toLowerCase() === 'python' ? 'python' : e.tech[0].toLowerCase() === 'go' ? 'go' : e.tech[0].toLowerCase() === 'java' ? 'java' : 'cpp'}\nstruct Event {\n    id: UUID,\n    timestamp: TimestampNanos,\n    instrument_id: String,\n    event_type: EventType,\n    payload: Value,\n    metadata: HashMap<String, String>,\n    checksum: SHA256,\n}\n\nenum EventType {\n    TICK,\n    ORDER,\n    TRADE,\n    SIGNAL,\n    STATUS,\n}\n\`\`\`\n\nState transitions are modeled as a finite state machine with the following valid transitions documented in the state diagram (see attached UML). All invalid transitions result in a InvalidStateTransitionError being raised with both the current state and attempted transition logged for diagnostics.`,
    },
    {
      heading: '3. Algorithm Details',
      content: `The core processing algorithm operates as follows:\n\n1. Receive event from input channel with back-pressure signal\n2. Validate event schema and integrity (checksum verification)\n3. Look up or initialize session state from distributed cache\n4. Apply business rules matching the event type and current state\n5. Compute derived values (if applicable)\n6. Update state in cache with optimistic locking (CAS operation)\n7. Persist event to append-only log for audit trail\n8. Publish output event to downstream channel\n9. Emit metrics for latency and throughput\n\nError handling: Each step has defined error recovery behavior. Transient errors (network, timeout) are retried with exponential backoff (base 100ms, max 5s, 3 attempts). Non-transient errors (validation, business rule violation) are logged, metered, and the event is routed to a dead-letter queue for manual inspection.`,
    },
    {
      heading: '4. State Management',
      content: `State is managed through a combination of in-memory LRU cache (for hot keys) and ${e.tech[2]} (for persistence). The cache operates in write-through mode for critical state changes and write-behind mode (with 50ms flush interval) for analytics state where eventual consistency is acceptable.\n\nSession lifecycle:\n\u2022 Created on first event for an instrument/trader combination\n\u2022 Updated on each subsequent event\n\u2022 Expired after configurable TTL (default: 24 hours of inactivity)\n\u2022 Checkpointed to persistent storage on every Nth update (N=1000) or every 5 seconds, whichever comes first\n\nRecovery: On service startup or failover, the state is rebuilt from the persistent checkpoint and replayed events from ${e.tech[1]} since the last checkpoint. The replay window is bounded by the topic retention period.`,
    },
    {
      heading: '5. Error Handling & Resilience',
      content: `The component implements the following resilience patterns:\n\nCircuit Breaker: Monitors downstream dependency health. After 5 consecutive failures within a 30-second window, the circuit opens for 60 seconds, during which all requests immediately fail-fast. Half-open state allows a single probe request to test recovery.\n\nBulkhead: Thread pools are partitioned by operation type (read pool: 200 threads, write pool: 100 threads, admin pool: 20 threads) to prevent one operation type from starving others.\n\nRetry with Backoff: Network-level retries use truncated exponential backoff (100ms, 200ms, 400ms, 800ms, 1600ms) with jitter. Maximum 3 retries before escalation.\n\nGraceful Degradation: If ${e.deps[0].split('(')[0].trim()} is unavailable, the component continues operating with cached data and queues up events for replay when the dependency recovers. Staleness of cached data is tracked and exposed via metrics.\n\nDead Letter Queue: Events that fail processing after all retries are published to a DLQ topic with original event, error details, and processing attempt history for manual triage.`,
    },
  ];
}

function deploySections(e: EntityProfile): ContentSection[] {
  return [
    {
      heading: '1. Prerequisites',
      content: `Before deploying ${e.desc.split(',')[0]}, ensure the following prerequisites are met:\n\nHardware Requirements:\n\u2022 Minimum ${e.tech[0] === 'Rust' || e.tech[0] === 'C++' ? '4 CPU cores, 16 GB RAM, 100 GB SSD' : '8 CPU cores, 32 GB RAM, 200 GB SSD'} per node\n\u2022 ${e.domain === 'Market Data' || e.domain === 'Order Management' ? 'Network: 10 Gbps low-latency NIC with kernel bypass (DPDK/Solarflare)' : 'Network: 1 Gbps NIC with standard kernel networking'}\n\u2022 Redundant power supplies and network interfaces\n\nSoftware Prerequisites:\n\u2022 Kubernetes 1.29+ with Helm 3.14+\n\u2022 ${e.tech[2]} 15+ with pgvector extension if applicable\n\u2022 ${e.tech[1]} cluster with at least 3 brokers\n\u2022 ${e.tech.includes('Redis') ? 'Redis Cluster 7.2+ with 6 nodes' : 'Distributed cache cluster (memcached or etcd)'}\n\u2022 HashiCorp Vault for secrets management\n\u2022 cert-manager for TLS certificate automation`,
    },
    {
      heading: '2. Installation Steps',
      content: `Step 1 \u2014 Create Namespace:\n\`\`\`bash\nkubectl create namespace algoiq-${kebab(e.domain)}\n\`\`\`\n\nStep 2 \u2014 Create Secrets:\n\`\`\`bash\nkubectl create secret generic db-credentials \\\n  --from-literal=username=algoiq_app \\\n  --from-literal=password=$(vault read -field=password secret/db/algoiq) \\\n  -n algoiq-${kebab(e.domain)}\n\`\`\`\n\nStep 3 \u2014 Deploy with Helm:\n\`\`\`bash\nhelm repo add algoiq https://charts.algoiq.internal\nhelm repo update\nhelm upgrade --install ${kebab(e.domain)}-service algoiq/${kebab(e.domain)} \\\n  --namespace algoiq-${kebab(e.domain)} \\\n  --values values-production.yaml \\\n  --set image.tag=v2.1.3 \\\n  --wait --timeout 10m\n\`\`\`\n\nStep 4 \u2014 Verify Pods:\n\`\`\`bash\nkubectl get pods -n algoiq-${kebab(e.domain)} -w\n\`\`\`\n\nWait until all pods show Running status with ready containers.`,
    },
    {
      heading: '3. Configuration',
      content: `Key configuration parameters in values-production.yaml:\n\n\`\`\`yaml\nreplicaCount: 3\n\nresources:\n  requests:\n    cpu: "2"\n    memory: "4Gi"\n  limits:\n    cpu: "8"\n    memory: "16Gi"\n\nautoscaling:\n  enabled: true\n  minReplicas: 3\n  maxReplicas: 20\n  targetCPUUtilizationPercentage: 70\n  targetMemoryUtilizationPercentage: 80\n\ningress:\n  enabled: true\n  className: nginx\n  annotations:\n    cert-manager.io/cluster-issuer: letsencrypt-prod\n  hosts:\n    - api.algoiq.internal\n  tls:\n    - secretName: api-tls\n      hosts:\n        - api.algoiq.internal\n\nenv:\n  - name: LOG_LEVEL\n    value: "info"\n  - name: DB_MAX_CONNECTIONS\n    value: "100"\n  - name: CACHE_TTL_SECONDS\n    value: "300"\n\`\`\`\n\nAll secrets are injected at runtime via Vault Agent Injector sidecar, never committed to version control.`,
    },
    {
      heading: '4. Verification',
      content: `After deployment, run the following verification checks:\n\nHealth Check:\n\`\`\`bash\ncurl -s https://api.algoiq.internal/v2/${kebab(e.domain)}/health | jq .status\n# Expected: "healthy"\n\`\`\`\n\nSmoke Test:\n\`\`\`bash\ncurl -s -X POST https://api.algoiq.internal/v2/${kebab(e.domain)}/query \\\n  -H "Authorization: Bearer $TOKEN" \\\n  -H "Content-Type: application/json" \\\n  -d '{"instrument": "NIFTY-50", "from": "2026-07-22T00:00:00Z", "to": "2026-07-22T01:00:00Z"}' | jq .count\n# Expected: positive integer\n\`\`\`\n\nMetrics Verification:\n\`\`\`bash\nkubectl port-forward -n algoiq-${kebab(e.domain)} svc/${kebab(e.domain)}-service 9090:9090 &\ncurl -s http://localhost:9090/metrics | grep -E 'requests_total|error_rate|latency_p99'\n\`\`\`\n\nIntegration Test Suite:\n\`\`\`bash\n./scripts/integration-tests.sh --env=production --service=${kebab(e.domain)}\n\`\`\`\n\nAll tests must pass with zero failures before the deployment is considered successful.`,
    },
    {
      heading: '5. Rollback Procedure',
      content: `If the deployment introduces issues, follow this rollback procedure:\n\nImmediate Rollback (last known good revision):\n\`\`\`bash\nhelm rollback ${kebab(e.domain)}-service 0 --namespace algoiq-${kebab(e.domain)} --wait\n\`\`\`\n\nThis reverts all Kubernetes resources to the previous Helm release revision. Verify service health after rollback using the verification steps above.\n\nManual Rollback to Specific Version:\n\`\`\`bash\nhelm upgrade --install ${kebab(e.domain)}-service algoiq/${kebab(e.domain)} \\\n  --namespace algoiq-${kebab(e.domain)} \\\n  --values values-production.yaml \\\n  --set image.tag=v2.1.2 \\\n  --wait\n\`\`\`\n\nDatabase Rollback: If schema migrations were part of the release, apply the down migration:\n\`\`\`bash\n./scripts/db-migrate.sh --env=production --direction=down --version=12\n\`\`\`\n\nPost-Rollback Verification: Run the verification suite, monitor dashboards for 15 minutes, and confirm via the health check endpoint that all services are operational. Notify the incident channel with rollback confirmation.`,
    },
  ];
}

function userSections(e: EntityProfile): ContentSection[] {
  return [
    {
      heading: '1. Getting Started',
      content: `Welcome to the ${e.desc.split(',')[0].split(' - ')[0] || e.desc} User Guide. This document will help you get started with using the ${e.domain} capabilities of the ALgo-IQ platform.\n\nPrerequisites:\n\u2022 Active ALgo-IQ account with ${e.domain} permissions granted by your administrator\n\u2022 API credentials (client ID and secret) from the Rakshak IAM portal\n\u2022 Familiarity with ${e.domain.toLowerCase()} concepts and REST API fundamentals\n\nQuick Start:\n1. Log in to the ALgo-IQ Portal at https://portal.algoiq.internal\n2. Navigate to the ${e.domain} section from the left sidebar\n3. Configure your ${e.domain.toLowerCase()} preferences in Settings > Preferences\n4. Explore the pre-configured dashboards and reports under the Dashboards tab\n5. For API access, follow the API Documentation section to obtain your access token`,
    },
    {
      heading: '2. Core Features',
      content: `Dashboard: The ${e.domain} dashboard provides an at-a-glance view of ${e.metrics.join(', ')}. You can customize the layout, add/remove widgets, and set refresh intervals. Use the filter bar at the top to drill down by instrument, date range, or strategy.\n\nReal-Time ${e.domain} Stream: For latency-sensitive use cases, access the ${e.domain.toLowerCase()} data via WebSocket connection at wss://stream.algoiq.internal/${kebab(e.domain)}. The stream delivers ${e.metrics[0]} data with P95 latency under 50ms.\n\nReports: Generate scheduled or ad-hoc reports in PDF, CSV, or Excel format. Reports can be configured with custom templates, branding, and delivery via email, SFTP, or webhook. Navigate to Reports > Create New to get started.\n\nAlerts: Configure ${e.domain.toLowerCase()} alerts based on ${e.metrics.length > 1 ? `${e.metrics[0].split(' ').slice(0, 2).join(' ')}, ${e.metrics[1].split(' ').slice(0, 2).join(' ')}` : e.metrics[0]} thresholds. Alerts can be delivered via email, SMS, Slack, or PagerDuty with configurable severity levels and escalation policies.`,
    },
    {
      heading: '3. Best Practices',
      content: `API Usage:\n\u2022 Use pagination (cursor-based) for all list endpoints; default page size is 100\n\u2022 Implement exponential backoff with jitter for retry logic (initial delay 1s, max 30s)\n\u2022 Reuse API tokens and refresh proactively 2 minutes before expiry\n\u2022 Batch queries where possible using the POST /batch endpoint (max 50 queries per batch)\n\nData Management:\n\u2022 Archive old ${e.domain.toLowerCase()} data periodically to reduce storage costs\n\u2022 Use data retention policies to automatically purge data beyond regulatory retention period\n\u2022 Export critical data before decommissioning deprecated ${e.domain.toLowerCase()} configurations\n\nSecurity:\n\u2022 Rotate API credentials every 90 days\n\u2022 Use IP allowlisting to restrict access to known office/VPN IPs\n\u2022 Enable audit logging for all ${e.domain.toLowerCase()} operations\n\u2022 Never share API credentials via email, chat, or version control`,
    },
  ];
}

function troubleshootSections(e: EntityProfile): ContentSection[] {
  return [
    {
      heading: '1. Common Issues',
      content: 'The following table lists the most frequently encountered issues with diagnosis steps and recommended solutions.',
    },
    {
      heading: '2. Issue Catalog',
      content: '',
      subSections: [
        {
          heading: `ISSUE-001: ${e.domain} Service Connection Timeout`,
          content: `Symptom: API requests to /v2/${kebab(e.domain)}/ return HTTP 504 Gateway Timeout or connection refused errors.\n\nDiagnosis:\n\`\`\`bash\n# Check if the service pods are running\nkubectl get pods -n algoiq-${kebab(e.domain)} | grep ${kebab(e.domain)}\n# Check service endpoints\nkubectl get endpoints -n algoiq-${kebab(e.domain)} ${kebab(e.domain)}-service\n# Check logs for errors\nkubectl logs -n algoiq-${kebab(e.domain)} -l app=${kebab(e.domain)}-service --tail=100\n\`\`\`\n\nSolution:\n1. If pods are not running: Check pod events with \`kubectl describe pod\` for resource constraints or image pull errors\n2. If pods are running but not ready: Check readiness probe configuration and ${e.tech[2]} connectivity\n3. If ${e.tech[2]} is unreachable: Verify database service, credentials, and network policies\n4. Restart affected pods: \`kubectl rollout restart deployment/${kebab(e.domain)}-service -n algoiq-${kebab(e.domain)}\``,
        },
        {
          heading: `ISSUE-002: High ${e.metrics[0].split('<')[0].trim()}`,
          content: `Symptom: ${e.metrics[0]} exceeding SLA thresholds, visible in Grafana dashboard as sustained elevated P99 latency.\n\nDiagnosis:\n\`\`\`bash\n# Check CPU/memory utilization\nkubectl top pods -n algoiq-${kebab(e.domain)}\n# Check ${e.tech[1]} consumer lag\nkubectl exec -n algoiq-${kebab(e.domain)} deploy/${kebab(e.domain)}-service -- \\\n  kafka-consumer-groups --bootstrap-server kafka:9092 --group ${kebab(e.domain)} --describe\n\`\`\`\n\nSolution:\n1. If CPU > 80%: Scale up replicas via HPA or manually: \`kubectl scale deploy/${kebab(e.domain)}-service --replicas=10 -n algoiq-${kebab(e.domain)}\`\n2. If consumer lag > 1000: Check for slow downstream consumers; consider increasing partition count or consumer parallelism\n3. If memory pressure: Review GC logs for ${e.tech[0] === 'Java' ? 'JVM' : 'runtime'} heap configuration; increase heap size via env vars\n4. If none of the above: Profile the application using the built-in pprof/debug endpoint at /debug/pprof/`,
        },
        {
          heading: `ISSUE-003: ${e.deps[0].split('(')[0].trim()} Integration Failure`,
          content: `Symptom: Events from ${e.deps[0].split('(')[0].trim()} are not being consumed, or responses to ${e.deps[0].split('(')[0].trim()} are returning errors.\n\nDiagnosis:\n\`\`\`bash\n# Check circuit breaker status\ncurl -s https://api.algoiq.internal/v2/${kebab(e.domain)}/health | jq .dependencies\n# Check ${e.deps[0].split('(')[0].trim()} service status\nkubectl get pods -n algoiq-${kebab(e.deps[0].split('(')[0].trim().toLowerCase())}\n# Check network connectivity between services\nkubectl exec -n algoiq-${kebab(e.domain)} deploy/${kebab(e.domain)}-service -- \\\n  curl -s http://${kebab(e.deps[0].split('(')[0].trim())}-service:8080/health\n\`\`\`\n\nSolution:\n1. If ${e.deps[0].split('(')[0].trim()} service is down: Follow its own troubleshooting guide to restore service\n2. If circuit breaker is open: Wait for cooldown period (60s) or manually reset: \`curl -X POST /admin/circuit-breaker/reset\`\n3. If network issue: Verify network policies, service mesh configuration, and DNS resolution\n4. If persistent: Engage the ${e.deps[0].split('(')[0].trim()} and ${e.domain} teams for joint debugging session`,
        },
      ],
    },
  ];
}

function faqSections(e: EntityProfile): ContentSection[] {
  return [
    {
      heading: 'Frequently Asked Questions',
      content: '',
      subSections: [
        {
          heading: `Q: How do I get started with the ${e.domain} API?`,
          content: `A: First, obtain API credentials from the Rakshak IAM portal (https://iam.algoiq.internal). Then, follow the quick start guide in Section 1 of the API Documentation. You will need to create an API key with ${e.domain.toLowerCase()} scope and use it to authenticate requests. The base URL for all API calls is https://api.algoiq.internal/v2/${kebab(e.domain)}/. We recommend starting with the /health endpoint to verify connectivity, then exploring the /query endpoint for data retrieval.`,
        },
        {
          heading: `Q: What is the ${e.metrics[0].split('<')[0].trim() || e.metrics[0]} guarantee?`,
          content: `A: ${e.metrics[0]}. This is measured end-to-end from the ${e.domain === 'Market Data' ? 'exchange tick arrival' : 'event ingestion'} to ${e.domain === 'Market Data' ? 'OHLC candle publication' : 'API response dispatch'}. The measurement includes network latency, processing time, and persistence acknowledgment. We continuously monitor this metric and publish monthly SLA reports. If you experience latency exceeding the SLA, please open a support ticket with the request ID and timestamp of the slow request.`,
        },
        {
          heading: `Q: How does ${e.desc.split(',')[0].split(' - ')[0] || e.desc} handle failover?`,
          content: `A: The system is deployed across multiple availability zones with active-active or active-standby configuration depending on the service. In case of a zone failure, traffic is automatically routed to healthy instances via Kubernetes Service load balancing and Istio circuit breaking. Stateful services use ${e.tech[2]} replication with automatic failover (controlled by Patroni/etcd). The Recovery Time Objective (RTO) is ${e.domain === 'Market Data' || e.domain === 'Order Management' ? '< 30 seconds' : '< 5 minutes'} and Recovery Point Objective (RPO) is ${e.domain === 'Market Data' || e.domain === 'Order Management' ? '< 1 second' : '< 1 minute'}. See the Deployment Guide for detailed failover procedures.`,
        },
        {
          heading: `Q: Can I get ${e.domain.toLowerCase()} data via WebSocket?`,
          content: `A: Yes. Connect to wss://stream.algoiq.internal/${kebab(e.domain)} using a WebSocket client. Authentication is via a query parameter: ?token=<your-jwt>. Once connected, subscribe to channels by sending a JSON message: {"action": "subscribe", "channel": "${kebab(e.domain)}_live", "instruments": ["NIFTY-50", "BANKNIFTY"]}. Data is pushed as JSON frames with nanosecond timestamps. The WebSocket connection supports automatic reconnection and message replay for missed data during disconnection (up to 5 minutes). Max 50 instruments per connection; open multiple connections for more.`,
        },
        {
          heading: `Q: How do I report a bug or request a feature?`,
          content: `A: Bug reports and feature requests are tracked in our internal Jira instance. Navigate to https://jira.algoiq.internal and create a ticket under the "${e.domain}" project. Please include: (1) Environment (production/sandbox), (2) Steps to reproduce with example request/response payloads, (3) Expected vs. actual behavior, (4) Any relevant request IDs or timestamps. Feature requests should include a description of the problem being solved, proposed solution, and estimated business impact. The ${e.domain} team reviews tickets weekly and prioritizes based on severity and business value.`,
        },
        {
          heading: 'Q: What are the data retention policies?',
          content: `A: Data retention varies by data type and regulatory requirements:\n\u2022 Transactional/real-time data: 30 days in hot storage, 1 year in warm storage\n\u2022 ${e.domain} analytical data: 5 years for regulatory compliance\n\u2022 Audit logs: 7 years as per SEBI requirements\n\u2022 System metrics: 90 days in Prometheus, 1 year in long-term storage (Thanos)\n\u2022 Logs: 30 days in Elasticsearch, 1 year archived in S3\n\nData beyond the retention window is automatically purged. To retain data longer, use the Export API to archive data to your own storage. Contact your account manager for custom retention policies.`,
        },
      ],
    },
  ];
}

function GENERATE_DOC_CONTENT(): Record<string, DocContent> {
  const map: Record<string, DocContent> = {};

  for (const entity of knowledgeBase) {
    const info = ENTITY[entity.entityId];
    if (!info) continue;
    const seed = hashId(entity.entityId);

    for (const doc of entity.documents) {
      const shouldGenerate =
        ['BRS', 'SRS', 'API_DOC'].includes(doc.type) ||
        (['HLD', 'LLD', 'DEPLOY', 'USER', 'TROUBLESHOOT', 'FAQ'].includes(doc.type) && doc.status === 'complete');

      if (!shouldGenerate) continue;

      const key = `${entity.entityId}:${doc.type}`;
      let sections: ContentSection[] = [];

      switch (doc.type) {
        case 'BRS': sections = brsSections(info); break;
        case 'SRS': sections = srsSections(info); break;
        case 'API_DOC': sections = apiDocSections(info); break;
        case 'HLD': sections = hldSections(info); break;
        case 'LLD': sections = lldSections(info); break;
        case 'DEPLOY': sections = deploySections(info); break;
        case 'USER': sections = userSections(info); break;
        case 'TROUBLESHOOT': sections = troubleshootSections(info); break;
        case 'FAQ': sections = faqSections(info); break;
      }

      if (sections.length > 0) {
        map[key] = {
          sections,
          author: pick(AUTHORS, seed + hashId(doc.type)),
          version: pick(VERSIONS, seed + hashId(doc.type) * 3),
          lastUpdated: pick(DATES, seed + hashId(doc.type) * 7),
        };
      }
    }
  }

  return map;
}

// ──────────────────── MD FILES manifest ────────────────────

interface MdFileEntry {
  name: string;
  label: string;
  path: string;
}

interface EngineFileGroup {
  name: string;
  files: MdFileEntry[];
}

function mdLabel(filename: string): string {
  const base = filename.replace(/\.md$/, '');
  if (base === 'README') return 'README — Engine Summary';
  const dash = base.indexOf('-');
  if (dash === -1) return base;
  const num = base.slice(0, dash);
  const rest = base.slice(dash + 1).replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return `${num} — ${rest}`;
}

const ENGINE_FILES: Record<string, { name: string; files: string[] }> = {
  lakshmi: {
    name: 'Lakshmi',
    files: ['README.md', '01-overview.md', '02-business-requirements.md', '03-system-requirements.md', '04-high-level-architecture.md', '05-low-level-design.md', '06-components.md', '07-data-flow.md', '08-topology.md', '09-api-reference.md', '10-database.md', '11-configuration.md', '12-installation.md', '13-deployment.md', '14-monitoring.md', '15-security.md', '16-narad-integration.md', '17-suraksha-integration.md', '18-failover.md', '19-performance.md', '20-testing.md', '21-troubleshooting.md', '22-faq.md', '23-roadmap.md', '24-release-notes.md', '25-glossary.md'],
  },
  vega: {
    name: 'Vega',
    files: ['README.md', '01-overview.md', '02-business-requirements.md', '03-system-requirements.md', '04-high-level-architecture.md', '05-low-level-design.md', '06-components.md', '07-data-flow.md', '08-topology.md', '09-api-reference.md', '10-database.md', '11-configuration.md', '12-installation.md', '13-deployment.md', '14-monitoring.md', '15-logging.md', '16-security.md', '17-error-handling.md', '18-testing.md', '19-performance.md', '20-scalability.md', '21-troubleshooting.md', '22-changelog.md', '23-best-practices.md', '24-contributing.md', '25-glossary.md'],
  },
  surya: {
    name: 'Surya',
    files: ['README.md', '01-overview.md', '02-business-requirements.md', '03-system-requirements.md', '04-high-level-architecture.md', '05-low-level-design.md', '06-components.md', '07-data-flow.md', '08-topology.md', '09-api-reference.md', '10-database.md', '11-configuration.md', '12-installation.md', '13-deployment.md', '14-monitoring.md', '15-logging.md', '16-security.md', '17-error-handling.md', '18-testing.md', '19-performance.md', '20-scalability.md', '21-troubleshooting.md', '22-changelog.md', '23-best-practices.md', '24-contributing.md', '25-glossary.md'],
  },
  ganesh: {
    name: 'Ganesh',
    files: ['README.md', '01-overview.md', '02-business-requirements.md', '03-system-requirements.md', '04-high-level-architecture.md', '05-low-level-design.md', '06-components.md', '07-data-flow.md', '08-topology.md', '09-api-reference.md', '10-database.md', '11-configuration.md', '12-installation.md', '13-deployment.md', '14-monitoring.md', '15-security.md', '16-performance.md', '17-troubleshooting.md', '18-operations.md', '19-integration.md', '20-testing.md', '21-maintenance.md', '22-faq.md', '23-changelog.md', '24-contributing.md', '25-glossary.md'],
  },
  narad: {
    name: 'Narad',
    files: ['README.md', '01-overview.md', '02-business-requirements.md', '03-system-requirements.md', '04-high-level-architecture.md', '05-low-level-design.md', '06-components.md', '07-data-flow.md', '08-topology.md', '09-api-reference.md', '10-database.md', '11-configuration.md', '12-installation.md', '13-deployment.md', '14-monitoring.md', '15-security.md', '16-performance.md', '17-troubleshooting.md', '18-operations.md', '19-integration.md', '20-testing.md', '21-maintenance.md', '22-faq.md', '23-changelog.md', '24-contributing.md', '25-glossary.md'],
  },
  suraksha: {
    name: 'Suraksha',
    files: ['README.md', '01-overview.md', '02-business-requirements.md', '03-system-requirements.md', '04-high-level-architecture.md', '05-low-level-design.md', '06-components.md', '07-data-flow.md', '08-topology.md', '09-api-reference.md', '10-database.md', '11-configuration.md', '12-installation.md', '13-deployment.md', '14-monitoring.md', '15-security.md', '16-performance.md', '17-troubleshooting.md', '18-operations.md', '19-integration.md', '20-testing.md', '21-maintenance.md', '22-faq.md', '23-changelog.md', '24-contributing.md', '25-glossary.md'],
  },
  dxcc: {
    name: 'DXCC',
    files: ['README.md', '01-overview.md', '02-business-requirements.md', '03-system-requirements.md', '04-high-level-architecture.md', '05-low-level-design.md', '06-components.md', '07-data-flow.md', '08-topology.md', '09-api-reference.md', '10-database.md', '11-configuration.md', '12-installation.md', '13-deployment.md', '14-monitoring.md', '15-security.md', '16-narad-integration.md', '17-suraksha-integration.md', '18-failover.md', '19-performance.md', '20-testing.md', '21-troubleshooting.md', '22-faq.md', '23-roadmap.md', '24-release-notes.md', '25-glossary.md'],
  },
  suchak: {
    name: 'Suchak',
    files: ['README.md', '01-overview.md', '02-architecture.md', '03-ema-sma-indicator.md', '04-vwap-supertrend.md', '05-rsi-macd-indicator.md', '06-bollinger-atr-indicator.md', '07-adx-stochastic-indicator.md', '08-ichimoku-indicator.md', '09-pivot-cpr-indicator.md', '10-signal-strength.md', '11-support-resistance.md', '12-momentum-analysis.md', '13-input-ganesh-ohlc.md', '14-input-lakshmi-live.md', '15-consumer-dxcc.md', '16-consumer-kuberalpha.md', '17-consumer-strategy-builder.md', '18-consumer-delta-xi.md', '19-consumer-talkdelta.md', '20-api-endpoints.md', '21-configuration.md', '22-deployment.md', '23-monitoring-health.md', '24-glossary.md', '25-glossary.md'],
  },
  manthan: {
    name: 'Manthan',
    files: ['README.md', '01-overview.md', '02-architecture.md', '03-market-regime.md', '04-trend-detection.md', '05-breakout-probability.md', '06-volatility-regime.md', '07-volume-analysis.md', '08-oi-analysis.md', '09-liquidity-scoring.md', '10-confidence-scoring.md', '11-input-ganesh.md', '12-input-suchak.md', '13-input-lakshmi.md', '14-consumer-dxcc.md', '15-consumer-kuberalpha.md', '16-consumer-kavach.md', '17-consumer-delta-xi.md', '18-api-endpoints.md', '19-configuration.md', '20-deployment.md', '21-monitoring.md', '22-troubleshooting.md', '23-faq.md', '24-glossary.md', '25-glossary.md'],
  },
  kavach: {
    name: 'Kavach',
    files: ['README.md', '01-overview.md', '02-architecture.md', '03-delta-monitoring.md', '04-gamma-monitoring.md', '05-theta-monitoring.md', '06-vega-monitoring.md', '07-auto-adjustment.md', '08-rebalancing.md', '09-risk-scoring.md', '10-neutrality-percentage.md', '11-consumer-kuberalpha.md', '12-consumer-vega.md', '13-consumer-dxcc.md', '14-consumer-rakshak.md', '15-input-lakshmi.md', '16-input-suchak.md', '17-input-manthan.md', '18-suggested-hedges.md', '19-api-endpoints.md', '20-configuration.md', '21-deployment.md', '22-monitoring.md', '23-troubleshooting.md', '24-glossary.md', '25-glossary.md'],
  },
  rakshak: {
    name: 'Rakshak',
    files: ['README.md', '01-overview.md', '02-architecture.md', '03-hedge-requirements.md', '04-tail-risk.md', '05-gap-risk.md', '06-overnight-risk.md', '07-event-risk.md', '08-dynamic-hedging.md', '09-portfolio-protection.md', '10-emergency-exit.md', '11-disaster-protection.md', '12-consumer-kuberalpha.md', '13-consumer-vega.md', '14-consumer-dxcc.md', '15-input-kavach.md', '16-input-manthan.md', '17-input-suchak.md', '18-api-endpoints.md', '19-configuration.md', '20-deployment.md', '21-monitoring.md', '22-troubleshooting.md', '23-faq.md', '24-glossary.md', '25-glossary.md'],
  },
  'strategy-factory': {
    name: 'Strategy Factory',
    files: ['README.md', '01-architecture.md', '02-quick-start.md', '03-installation.md', '04-configuration.md', '05-builder-interface.md', '06-drag-and-drop.md', '07-entry-logic.md', '08-exit-logic.md', '09-risk-rules.md', '10-position-sizing.md', '11-portfolio-allocation.md', '12-json-generation.md', '13-lifecycle.md', '14-parikshak-integration.md', '15-simulator-integration.md', '16-dxcc-integration.md', '17-kuber-alpha-deployment.md', '18-ganesh-integration.md', '19-mq-integration.md', '20-api-reference.md', '21-troubleshooting.md', '22-best-practices.md', '23-security.md', '24-changelog.md', '25-glossary.md'],
  },
  parikshak: {
    name: 'Parikshak',
    files: ['README.md', '01-architecture.md', '02-quick-start.md', '03-installation.md', '04-configuration.md', '05-test-framework.md', '06-unit-testing.md', '07-integration-testing.md', '08-api-testing.md', '09-strategy-testing.md', '10-test-reports.md', '11-checklists.md', '12-regression-reports.md', '13-readiness-reports.md', '14-performance-reports.md', '15-security-reports.md', '16-certification.md', '17-ci-cd-integration.md', '18-engine-testing.md', '19-product-testing.md', '20-access-control.md', '21-troubleshooting.md', '22-best-practices.md', '23-changelog.md', '24-api-reference.md', '25-glossary.md'],
  },
  'kuber-alpha': {
    name: 'Kuber Alpha',
    files: ['README.md', '01-architecture.md', '02-quick-start.md', '03-installation.md', '04-configuration.md', '05-signal-reception.md', '06-aalap-calls-integration.md', '07-delta-xi-integration.md', '08-vyuh-integration.md', '09-talkdelta-ai-integration.md', '10-strategy-activation.md', '11-capital-allocation.md', '12-signal-dispatch.md', '13-kill-switch.md', '14-layer-architecture.md', '15-vega-integration.md', '16-opportunity-conversion.md', '17-api-reference.md', '18-monitoring.md', '19-alerts.md', '20-troubleshooting.md', '21-best-practices.md', '22-security.md', '23-changelog.md', '24-faq.md', '25-glossary.md'],
  },
};

function buildEngineFiles(): EngineFileGroup[] {
  return Object.entries(ENGINE_FILES).map(([key, group]) => ({
    name: group.name,
    files: group.files.map(fn => ({
      name: fn,
      label: mdLabel(fn),
      path: `/knowledgebase/engines/${key}/${fn}`,
    })),
  }));
}

// ──────────────────── types / helpers ────────────────────

interface SelectedDoc {
  entityId: string;
  entityName: string;
  doc: KnowledgeDocument;
}

function completionPct(docs: { status: string }[]): number {
  const complete = docs.filter(d => d.status === 'complete').length;
  return Math.round((complete / docs.length) * 100);
}

const ENGINE_ORDER = ['lakshmi', 'vega', 'surya', 'ganesh', 'narad', 'suraksha', 'suchak', 'manthan', 'kavach', 'rakshak', 'strategy-factory', 'parikshak', 'kuber-alpha', 'dxcc'];

// ──────────────────── PAGE ────────────────────

export default function DocsPage() {
  const [search, setSearch] = useState('');
  const [engineSearch, setEngineSearch] = useState('');
  const [expandedEntities, setExpandedEntities] = useState<Set<string>>(new Set());
  const [selectedDoc, setSelectedDoc] = useState<SelectedDoc | null>(null);
  const [collapsedTOC, setCollapsedTOC] = useState(false);
  const [activeTab, setActiveTab] = useState<'kb' | 'engines'>('kb');
  const [selectedEngine, setSelectedEngine] = useState<string>(ENGINE_ORDER[0]);
  const printRef = useRef<HTMLDivElement>(null);

  const DOCUMENT_CONTENT = useMemo(() => GENERATE_DOC_CONTENT(), []);
  const engineGroups = useMemo(() => buildEngineFiles(), []);

  const filtered = useMemo(() => {
    if (!search.trim()) return knowledgeBase;
    const q = search.toLowerCase();
    return knowledgeBase.filter(e =>
      e.entityName.toLowerCase().includes(q) ||
      e.documents.some(d => d.title.toLowerCase().includes(q))
    );
  }, [search]);

  const totalMdFiles = useMemo(() => engineGroups.reduce((sum, g) => sum + g.files.length, 0), [engineGroups]);

  const filteredFiles = useMemo(() => {
    if (!engineSearch.trim()) return null;
    const q = engineSearch.toLowerCase();
    const results: { engineName: string; engineKey: string; file: MdFileEntry }[] = [];
    for (const [key, group] of Object.entries(ENGINE_FILES)) {
      for (const fn of group.files) {
        const label = mdLabel(fn);
        if (label.toLowerCase().includes(q) || fn.toLowerCase().includes(q)) {
          results.push({ engineName: group.name, engineKey: key, file: { name: fn, label, path: `/knowledgebase/engines/${key}/${fn}` } });
        }
      }
    }
    return results;
  }, [engineSearch]);

  const selectedEngineGroup = useMemo(
    () => engineGroups.find(g => g.name.toLowerCase() === selectedEngine.toLowerCase() || ENGINE_ORDER.find(k => ENGINE_FILES[k]?.name.toLowerCase() === selectedEngine.toLowerCase())),
    [selectedEngine, engineGroups]
  );

  function toggleEntity(eId: string) {
    setExpandedEntities(prev => {
      const next = new Set(prev);
      if (next.has(eId)) next.delete(eId); else next.add(eId);
      return next;
    });
  }

  function selectDoc(entityId: string, entityName: string, doc: KnowledgeDocument) {
    setSelectedDoc({ entityId, entityName, doc });
    setCollapsedTOC(false);
  }

  function handlePrint() {
    window.print();
  }

  const selectedContent = selectedDoc
    ? DOCUMENT_CONTENT[`${selectedDoc.entityId}:${selectedDoc.doc.type}`]
    : null;

  const tocSections = selectedContent
    ? selectedContent.sections.filter(s => s.heading && s.content !== undefined)
    : [];

  useEffect(() => {
    if (selectedDoc) {
      const el = document.getElementById('doc-reader-top');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedDoc]);

  return (
    <div className="flex flex-col h-full overflow-hidden font-sans bg-white dark:bg-slate-950">
      {/* ── Header ── */}
      <header className="flex-shrink-0 px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Documentation Explorer</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {knowledgeBase.length} KB entries &middot; {totalMdFiles} MD files across {ENGINE_ORDER.length} engines
            </p>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('kb')}
              className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'kb'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <FiBookOpen size={13} /> Knowledge Base
            </button>
            <button
              onClick={() => setActiveTab('engines')}
              className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'engines'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <FiServer size={13} /> Engine Docs
            </button>
          </div>
        </div>
      </header>

      {/* ── KB Tab ── */}
      {activeTab === 'kb' && (
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel — Entity/Document List */}
          <aside className="w-[290px] min-w-[290px] border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-900/50">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiBookOpen size={14} /> Documentation
              </h2>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search entities..."
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filtered.map((entity) => {
                const isExpanded = expandedEntities.has(entity.entityId);
                const pct = completionPct(entity.documents);
                const isSelected = selectedDoc?.entityId === entity.entityId;
                return (
                  <div key={entity.entityId}>
                    <button
                      onClick={() => toggleEntity(entity.entityId)}
                      className={`w-full flex items-center gap-2 px-4 py-2.5 text-left hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800/30 ${
                        isSelected ? 'bg-blue-50 dark:bg-blue-950/30 border-l-2 border-l-blue-500' : ''
                      }`}
                    >
                      <span className="text-slate-400 flex-shrink-0">
                        {isExpanded ? <FiChevronDown size={12} /> : <FiChevronRight size={12} />}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium truncate">{entity.entityName}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-slate-400">{entity.documents.length} docs</span>
                          <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${pct}%`,
                                backgroundColor: pct >= 80 ? '#10B981' : pct >= 50 ? '#F59E0B' : '#EF4444',
                              }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-400">{pct}%</span>
                        </div>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="bg-slate-50/30 dark:bg-slate-900/30">
                        {entity.documents.map((doc, di) => {
                          const isDocSelected = selectedDoc?.entityId === entity.entityId && selectedDoc?.doc.type === doc.type;
                          const hasContent = !!DOCUMENT_CONTENT[`${entity.entityId}:${doc.type}`];
                          return (
                            <button
                              key={di}
                              onClick={(e) => {
                                e.stopPropagation();
                                selectDoc(entity.entityId, entity.entityName, doc);
                              }}
                              className={`w-full flex items-center gap-3 px-4 py-2 pl-10 text-left text-xs transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/30 ${
                                isDocSelected ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              <FiFileText size={11} className="flex-shrink-0" />
                              <span className="flex-1 truncate">{doc.title}</span>
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                <span
                                  className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                  style={{ backgroundColor: (docStatusColors[doc.status] || '#6B7280') + '18', color: docStatusColors[doc.status] || '#6B7280' }}
                                >
                                  {doc.type === 'API_DOC' ? 'API' : docTypeLabels[doc.type]?.length > 8 ? docTypeLabels[doc.type].slice(0, 8) : docTypeLabels[doc.type] || doc.type}
                                </span>
                                {!hasContent && (
                                  <span className="text-[10px] text-slate-300 dark:text-slate-600" title="Content not available">--</span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div className="p-6 text-center text-xs text-slate-400">No entities found.</div>
              )}
            </div>
          </aside>

          {/* Right Panel — Document Reader */}
          <main className="flex-1 overflow-y-auto" id="doc-reader-top">
            {!selectedDoc ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500 gap-4">
                <FiBookOpen size={48} strokeWidth={1} />
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Select a document from the left to view its content</p>
                  <p className="text-xs mt-1 text-slate-400 dark:text-slate-500">Browse entities and click on any document to read</p>
                </div>
              </div>
            ) : !selectedContent ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500 gap-4">
                <FiFileText size={48} strokeWidth={1} />
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Content not available for this document</p>
                  <p className="text-xs mt-1 text-slate-400 dark:text-slate-500">This document type does not have generated content</p>
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto px-8 py-8" ref={printRef}>
                {/* Document Header */}
                <div className="mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs px-2 py-0.5 rounded font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                          {selectedDoc.entityName}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {docTypeLabels[selectedDoc.doc.type] || selectedDoc.doc.type}
                        </span>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                          style={{ backgroundColor: (docStatusColors[selectedDoc.doc.status] || '#6B7280') + '18', color: docStatusColors[selectedDoc.doc.status] || '#6B7280' }}
                        >
                          {selectedDoc.doc.status}
                        </span>
                      </div>
                      <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
                        {selectedDoc.doc.title}
                      </h1>
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1.5"><FiUser size={12} /> {selectedContent.author}</span>
                        <span className="flex items-center gap-1.5"><FiClock size={12} /> Updated {selectedContent.lastUpdated}</span>
                        <span className="flex items-center gap-1.5"><FiCalendar size={12} /> Version {selectedContent.version}</span>
                        <a
                          href={selectedDoc.doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-blue-500 hover:text-blue-600 dark:text-blue-400"
                        >
                          <FiExternalLink size={12} /> External Source
                        </a>
                      </div>
                    </div>
                    <button
                      onClick={handlePrint}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors print:hidden"
                      title="Print document"
                    >
                      <FiPrinter size={12} /> Print
                    </button>
                  </div>
                </div>

                {/* Table of Contents */}
                {tocSections.length > 0 && (
                  <div className="mb-8 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden print:border-none print:bg-transparent">
                    <button
                      onClick={() => setCollapsedTOC(!collapsedTOC)}
                      className="w-full flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <FiList size={14} /> Table of Contents
                      <span className="ml-auto text-slate-400">
                        {collapsedTOC ? <FiChevronRight size={14} /> : <FiChevronDown size={14} />}
                      </span>
                    </button>
                    {!collapsedTOC && (
                      <div className="px-5 pb-4 border-t border-slate-200 dark:border-slate-700">
                        <ul className="space-y-1 mt-3">
                          {tocSections.map((s, i) => (
                            <li key={i}>
                              <a
                                href={`#section-${kebab(s.heading)}`}
                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                {s.heading}
                              </a>
                              {s.subSections && s.subSections.length > 0 && (
                                <ul className="ml-4 mt-1 space-y-0.5">
                                  {s.subSections.map((sub, j) => (
                                    <li key={j}>
                                      <a
                                        href={`#section-${kebab(sub.heading)}`}
                                        className="text-[11px] text-slate-500 dark:text-slate-400 hover:underline"
                                      >
                                        {sub.heading}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Content Sections */}
                <div className="space-y-8">
                  {selectedContent.sections.map((section, si) => (
                    <section key={si} id={`section-${kebab(section.heading)}`}>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                        {section.heading}
                      </h2>
                      {section.content && (
                        <div className="prose prose-sm max-w-none text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                          {section.content.split('\n').map((line, li) => {
                            const trimmed = line.trim();
                            if (!trimmed && li > 0) return <br key={li} />;
                            if (trimmed.startsWith('`') && (trimmed.includes('\n') || trimmed.endsWith('`'))) {
                              const codeContent = trimmed.replace(/```\w*\n?/g, '').replace(/```/g, '');
                              return (
                                <pre key={li} className="bg-slate-900 dark:bg-slate-950 text-slate-100 dark:text-slate-200 rounded-lg p-4 my-3 overflow-x-auto text-xs leading-relaxed font-mono whitespace-pre-wrap break-all print:bg-slate-100 print:text-slate-900 print:border print:border-slate-300">
                                  <code>{codeContent}</code>
                                </pre>
                              );
                            }
                            if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
                              return <div key={li} className="text-xs font-mono text-slate-600 dark:text-slate-400">{trimmed}</div>;
                            }
                            return <span key={li}>{trimmed || '\u00A0'}<br /></span>;
                          })}
                        </div>
                      )}
                      {section.subSections && section.subSections.map((sub, ssi) => (
                        <div key={ssi} id={`section-${kebab(sub.heading)}`} className="mt-5 ml-4 pl-4 border-l-2 border-slate-200 dark:border-slate-700">
                          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-2">{sub.heading}</h3>
                          {sub.content && (
                            <div className="prose prose-sm max-w-none text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                              {sub.content.split('\n').map((line, li) => {
                                const trimmed = line.trim();
                                if (!trimmed && li > 0) return <br key={li} />;
                                if ((trimmed.startsWith('```') || trimmed.startsWith('`')) && trimmed.includes('\n')) {
                                  const codeContent = trimmed.replace(/```\w*\n?/g, '').replace(/```/g, '').replace(/^`|`$/g, '');
                                  return (
                                    <pre key={li} className="bg-slate-900 dark:bg-slate-950 text-slate-100 dark:text-slate-200 rounded-lg p-4 my-3 overflow-x-auto text-xs leading-relaxed font-mono whitespace-pre-wrap break-all print:bg-slate-100 print:text-slate-900 print:border print:border-slate-300">
                                      <code>{codeContent}</code>
                                    </pre>
                                  );
                                }
                                if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
                                  return <div key={li} className="text-xs font-mono text-slate-500 dark:text-slate-500">{trimmed}</div>;
                                }
                                return <span key={li}>{trimmed || '\u00A0'}<br /></span>;
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </section>
                  ))}
                </div>

                <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500 flex justify-between">
                  <span>ALgo-IQ Ecosystem Documentation</span>
                  <span>Generated: {new Date().toISOString().split('T')[0]}</span>
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {/* ── Engine Docs Tab ── */}
      {activeTab === 'engines' && (
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar — Engine List */}
          <aside className="w-[250px] min-w-[250px] border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-900/50">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiGrid size={14} /> Engines
              </h2>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  value={engineSearch}
                  onChange={(e) => setEngineSearch(e.target.value)}
                  placeholder="Search files..."
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {engineSearch.trim() ? (
              /* Search results */
              <div className="flex-1 overflow-y-auto">
                {filteredFiles && filteredFiles.length > 0 ? (
                  filteredFiles.map((result, i) => (
                    <a
                      key={i}
                      href={result.file.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-2.5 text-xs hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800/30 text-slate-700 dark:text-slate-300 group"
                    >
                      <FiFileText size={13} className="text-blue-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="truncate font-medium">{result.file.label}</div>
                        <div className="text-[10px] text-slate-400 truncate">{result.engineName} / {result.file.name}</div>
                      </div>
                      <FiExternalLink size={11} className="text-slate-300 dark:text-slate-600 group-hover:text-blue-500 flex-shrink-0" />
                    </a>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-slate-400">No files match your search.</div>
                )}
              </div>
            ) : (
              /* Engine list */
              <div className="flex-1 overflow-y-auto">
                {ENGINE_ORDER.map((key) => {
                  const eng = ENGINE_FILES[key];
                  if (!eng) return null;
                  const isSelected = key === selectedEngine || eng.name === selectedEngineGroup?.name;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedEngine(key)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-xs transition-colors border-b border-slate-100 dark:border-slate-800/30 ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-950/30 border-l-2 border-l-blue-500 text-blue-700 dark:text-blue-300'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/30'
                      }`}
                    >
                      <FiServer size={13} className={`flex-shrink-0 ${isSelected ? 'text-blue-500' : 'text-slate-400'}`} />
                      <div className="flex-1 min-w-0 text-left">
                        <div className="font-medium truncate">{eng.name}</div>
                        <div className="text-[10px] text-slate-400">{eng.files.length} files</div>
                      </div>
                      <FiChevronRight size={11} className="text-slate-300 dark:text-slate-600 flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            )}
          </aside>

          {/* Right Side — File list */}
          <main className="flex-1 overflow-y-auto">
            {selectedEngineGroup ? (
              <div className="max-w-4xl mx-auto px-8 py-8">
                <div className="mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-2">
                    <FiServer size={18} className="text-blue-500" />
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{selectedEngineGroup.name}</h2>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                      {selectedEngineGroup.files.length} files
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Static Markdown documentation files &mdash; click any file to open the rendered document in a new tab.
                  </p>
                </div>

                <div className="space-y-1">
                  {selectedEngineGroup.files.map((file, i) => (
                    <a
                      key={i}
                      href={file.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                    >
                      <FiFileText size={14} className={`flex-shrink-0 ${file.name === 'README.md' ? 'text-amber-500' : 'text-blue-400'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="truncate font-medium text-slate-700 dark:text-slate-300">{file.label}</div>
                        <div className="text-[10px] text-slate-400 font-mono truncate">{file.name}</div>
                      </div>
                      <FiExternalLink size={11} className="text-slate-300 dark:text-slate-600 group-hover:text-blue-500 flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500 gap-4">
                <FiServer size={48} strokeWidth={1} />
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Select an engine from the sidebar</p>
                  <p className="text-xs mt-1 text-slate-400 dark:text-slate-500">Browse 14 engines and {totalMdFiles} MD documentation files</p>
                </div>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
