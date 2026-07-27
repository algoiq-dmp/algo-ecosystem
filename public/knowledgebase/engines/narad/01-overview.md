# 01 â€” Overview

## What is Narad?

Narad is the Universal Connectivity & Infrastructure Management Platform that serves as the **backbone of the entire Algo-IQ ecosystem**. It connects to ALL servers, engines, products, and APIs â€” providing centralized infrastructure services including service discovery, health monitoring, configuration management, deployment orchestration, and remote command execution.

## Why Narad Was Developed

Before Narad, infrastructure operations were siloed and manual:

- **No unified service registry** â€” services hardcoded endpoints, causing cascade failures on address changes.
- **Ad-hoc deployments** â€” each team used custom scripts; no consistent rollout or rollback.
- **Fragmented monitoring** â€” health data scattered across multiple dashboards, no single pane of glass.
- **Manual restarts** â€” no controlled restart mechanism with health-gate verification.
- **Configuration sprawl** â€” configs stored in random git repos, env files, or hardcoded.

Narad solves these by centralizing all infrastructure management into a single, highly-available platform.

## Business Objective

Provide a unified, reliable, and secure infrastructure management layer that enables every team to discover, monitor, configure, deploy, and operate their services without needing direct server access.

## Technical Objective

- Maintain **99.99% uptime** (less than 52 minutes of downtime per year).
- Service registry query latency < 5ms.
- Health data aggregation across 100+ services within 10 seconds.
- Support remote command execution with full audit trail.
- Centralize configuration management with version history.

## Scope

| In Scope | Out of Scope |
|---|---|
| Service/Product/Server registry | Application-level business logic |
| Health monitoring and alerting | Database schema design for other engines |
| Configuration management | Application code deployment (orchestration only) |
| Deployment orchestration | CI/CD pipeline implementation |
| Remote command execution | SSH key generation (delegated to Suraksha) |
| Log collection and aggregation | Log parsing/analysis (handled by ELK) |
| Tunnel and port management | Network hardware configuration |
| Version tracking and compliance | License management |

## Target Users

| User Type | Interaction |
|---|---|
| **DevOps/SRE** | Full platform access; manage deployments, configs, restarts |
| **Engine Owners** | Register services, view health, manage configurations |
| **Security Team** | Audit logs, compliance reports, access reviews |
| **Developers** | Service discovery, read-only health views, config queries |
| **NOC (Network Ops)** | Server inventory, tunnel management, port allocation |

## Benefits

- **Single pane of glass** for all infrastructure operations.
- **99.99% availability** ensures infrastructure management never goes down.
- **Dynamic service discovery** eliminates hardcoded endpoints.
- **Audited remote commands** â€” every action is logged and attributable.
- **Centralized configuration** with version history and diff capability.

## Inputs

| Source | Description | Protocol |
|---|---|---|
| All engines (Lakshmi, Ganesh, etc.) | Health probes, heartbeat, metrics | HTTP/HTTPS |
| All servers | Agent-based telemetry | gRPC |
| Suraksha | Authentication, certificates, secrets | HTTP/HTTPS |
| Operators | CLI, dashboard, API commands | HTTPS / CLI |

## Outputs

| Consumer | Delivery Method | Data |
|---|---|---|
| Operators / SRE | Dashboard, CLI, Alerts | Health status, configs, deployment state |
| All services | Service registry API | Endpoint discovery data |
| ELK Stack | Log pipeline | Aggregated logs |
| Suraksha | Audit feed | Command history, access logs |
| Prometheus / Grafana | Metrics endpoint | Aggregated health metrics |
