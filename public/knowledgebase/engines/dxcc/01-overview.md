# DXCC — Overview

> **Version:** 2.0.0 | **Status:** Draft | **Owner:** DXCC Team | **Last Updated:** 2026-07-24

---

## What is DXCC?

DXCC (Delta XI Command Center) is the OS-level control plane for the Delta XI algorithmic trading ecosystem. It functions as the "operating system" of the platform: a unified interface that provides visibility, control, intelligence, governance, and operational management across all 18 engines, 20+ modules, and 6 AI coaches.

---

## Why DXCC Was Built

Prior to DXCC, operators had to access multiple disparate tools to monitor engines, manage strategies, review risk, and audit operations. DXCC consolidates everything into a single, role-aware, real-time interface with the following design principles:

1. **Single Pane of Glass:** All operational visibility in one place.
2. **Dynamic Plugin Architecture:** Engines auto-register via manifest YAML.
3. **Real-Time First:** No polling; all data streamed via WebSocket from Narad.
4. **Role-Based Views:** UI adapts to Admin, Trader, Quant, Auditor, or Viewer roles.
5. **Drill-Down Everywhere:** Every metric, widget, and alert is clickable for deeper investigation.
6. **Auto-Documentation:** Engine docs generated from manifests and code, not written manually.

---

## Business Objective

Provide a unified operational control plane that:

- Enables real-time visibility into all 18 engines and their health
- Provides a single interface for strategy lifecycle management
- Ensures governance through comprehensive audit trails
- Reduces operator cognitive load by surfacing only role-relevant information
- Accelerates incident response through integrated alerting and runbook access
- Eliminates documentation drift through auto-generated engine documentation

---

## Technical Objective

- Build a plugin framework where engines auto-register and expose their capabilities
- Stream real-time data via WebSocket from the Narad Event Bus
- Deliver sub-100ms UI latency for all real-time widgets
- Achieve 99.9% dashboard availability
- Support 5 RBAC roles with conditional UI rendering
- Enable horizontal scaling through Redis-backed session state

---

## Scope

DXCC covers:

- **In Scope:** Engine health monitoring, strategy lifecycle management, risk monitoring, order execution tracking, audit trail viewing, infrastructure monitoring, AI operations, incident management, knowledge management, administration, analytics, DevOps pipeline monitoring, notification management
- **Out of Scope:** Direct engine-to-engine communication, trade execution logic, market data generation, AI model training, broker connectivity

---

## Target Users

| Role | Capabilities |
|------|-------------|
| **Admin** | Full access: user management, engine config, system settings, all modules |
| **Trader** | Strategy deployment, order monitoring, P&L view, market operations |
| **Quant** | Strategy backtesting, analytics, AI coach interaction, model insights |
| **Auditor** | Audit center, user activity logs, configuration change history, exports |
| **Viewer** | Read-only access to dashboards, health monitors, market data |

---

## Key Benefits

- **Visibility:** See everything happening across the ecosystem in real-time
- **Control:** Manage strategies, risk rules, users, and configurations from one interface
- **Intelligence:** Access AI Coach insights, anomaly detection, and RAG-powered knowledge queries
- **Governance:** Full audit trail with Merkle tree integrity verification and 10-year retention
- **Operations:** Integrated incident management with SOP runbooks and post-mortem tracking
- **Extensibility:** Plugin SDK for custom modules and third-party integrations

---

## Inputs

| Source | Data Type | Protocol |
|--------|-----------|----------|
| Narad Event Bus | Real-time engine events, metrics, heartbeats | WebSocket |
| Engine Manifests | Engine metadata, UI configuration, health checks | File (YAML) |
| REST APIs | Historical data, configuration CRUD, audit queries | HTTP/REST |
| Prometheus | Infrastructure metrics, K8s health | HTTP scrape |
| AlertManager | Alert rules, alert states, silences | HTTP API |

---

## Outputs

| Output | Description | Consumer |
|--------|-------------|----------|
| Dashboard Widgets | Real-time metric displays, charts, statuses | Operators, Traders |
| Alert Notifications | Slack, PagerDuty, email alerts | On-call engineers |
| Audit Reports | Signed PDFs, CSV/JSON exports | Compliance, Auditors |
| Health Dashboards | Grafana-compatible metrics | DevOps, Infrastructure |
| Documentation | Auto-generated engine docs, KB articles | All users |

---

> **Next:** See [02-business-requirements.md](02-business-requirements.md) for detailed business and functional requirements.
