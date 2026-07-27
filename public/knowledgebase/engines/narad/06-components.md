# 06 â€” Component Descriptions

**Version:** 3.0.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-24

---

## Component Inventory

| Component | Type | Criticality |
|---|---|---|
| Service Registry | Service | Critical |
| Product Registry | Service | High |
| Server Registry | Service | High |
| Tunnel Manager | Service | Medium |
| Port Registry | Service | Medium |
| Deployment Manager | Service | High |
| Restart Manager | Service | High |
| Configuration Manager | Service | Critical |
| Remote Command Executor | Service | High |
| Health Monitor | Service | Critical |
| Log Collector | Service | High |
| Version Manager | Service | Medium |
| Narad Agent | Agent (per server) | Critical |
| REST API Server | Service | Critical |
| Dashboard | Web UI | High |
| CLI | Tool | Medium |

---

## Service Registry

The central source of truth for all running services in the ecosystem. Services self-register on startup, send periodic heartbeats, and deregister on shutdown. Supports query by name, type, status, or host. Powers service discovery for all inter-service communication.

## Product Registry

A catalog of all Algo-IQ products and their metadata: name, description, version history, owner team, repository URL, dependencies, deployment environments. Used for compliance reporting and onboarding.

## Server Registry

Inventory of every physical and virtual server in the infrastructure: hostname, IP, OS, CPU, RAM, disk, assigned roles, datacenter location, rack position. Powers the Narad Agent's auto-discovery of server capabilities.

## Tunnel Manager

Creates and manages SSH tunnels between distributed ecosystem components. Monitors tunnel health and auto-reconnects on failure. Integrates with Suraksha for certificate-based authentication.

## Port Registry

Centralized port allocation registry to prevent conflicts. Services request port assignments during registration. Narad validates availability and records the allocation permanently.

## Deployment Manager

Orchestrates service deployments with support for rolling, blue-green, and canary strategies. Each deployment creates an audit record with actor, version, strategy, and result. Failed deployments trigger automatic rollback if enabled.

## Restart Manager

Provides controlled service restart with health-gate verification. A restart only completes after the service passes its health check. Supports restart dependencies (e.g., restart Lakshmi before Ganesh).

## Configuration Manager

Centralized configuration store for all services. Every configuration change creates a new version with full audit trail (who changed what and why). Services fetch their config at startup and subscribe to real-time changes via Redis Pub/Sub.

## Remote Command Executor

Executes audited shell commands on any managed server. Production commands require approval workflow. All commands are logged with executor, command, target, output, and exit code. Output streams in real-time via gRPC.

## Health Monitor

Aggregates health probes and telemetry from all Narad Agents. Exposes a unified health API with per-service, per-server, and ecosystem-wide status. Drives the real-time infrastructure dashboard via WebSocket.

## Log Collector

Receives structured log streams from all Narad Agents via gRPC. Buffers, normalizes, and ships logs to the ELK stack. Handles backpressure gracefully with disk-based buffering.

## Version Manager

Tracks the deployed version of every service across all environments. Detects version drift and generates compliance reports. Integrates with Deployment Manager to auto-update version records.

## Narad Agent

Lightweight daemon (Node.js, ~256MB RAM) installed on every managed server. Communicates with the Control Plane via gRPC bidirectional stream. Responsibilities: health telemetry, log forwarding, command execution, tunnel management, local service management.

## REST API Server

Express.js-based HTTP server exposing all Narad functionalities via REST. Authenticated via Suraksha JWT. Rate-limited per consumer. Serves both the Dashboard and external clients.

## Dashboard

React-based web UI providing real-time visibility into the entire infrastructure: service health map, server inventory, deployment status, configuration history, command audit log. Connects via WebSocket for live updates.

## CLI

Command-line interface for Narad operations: `narad-cli`. Supports service registration, configuration management, remote commands, deployment triggers, and health queries. Used by DevOps engineers for day-to-day operations.
