# 23 â€” Changelog & Release Notes

**Version:** 3.0.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-24

---

## Version 3.0.0 (2026-07-24)

### Added
- Complete gRPC-based agent communication framework.
- Real-time infrastructure dashboard with WebSocket streaming.
- Multi-factor approval workflow for production remote commands.
- Version manager with drift detection and compliance reporting.
- Port registry with conflict detection.
- Product registry for ecosystem catalog.
- Server registry with automated discovery.
- Redis Pub/Sub for real-time config change notification.
- Kubernetes Helm charts for CP and Agent (DaemonSet).

### Changed
- Agent communication protocol: REST polling -> gRPC bidirectional streaming.
- Health aggregation: 30s polling -> 10s streaming.
- Config delivery: pull-only -> push via Redis Pub/Sub.
- Log collection: file-tail -> gRPC stream.
- RBAC model aligned with Suraksha roles.

### Fixed
- Heartbeat race condition during network partitions.
- Config version collision on concurrent updates.
- Memory leak in long-running gRPC streams.
- Agent reconnection storm when CP cluster restarts.

---

## Version 2.5.0 (2026-04-15)

### Added
- Deployment manager with rolling, blue-green, canary strategies.
- Restart manager with health-gate verification.
- Configuration versioning with diff view.

### Changed
- PostgreSQL migration from v14 to v15.
- Service registry TTL increased from 20s to 30s.

### Fixed
- Concurrent deployment corruption.
- Config cache invalidation timing issue.

---

## Version 2.0.0 (2025-11-01)

### Added
- Service registry with self-registration and heartbeats.
- Configuration manager with central store.
- Health monitor with ecosystem-wide aggregation.
- Remote command executor with audit trail.
- Tunnel manager for SSH connections.
- REST API and CLI.

---

## Version 1.0.0 (2025-06-01)

### Added
- Initial release: service registry and health monitoring.
- Basic REST API.
- Simple agent for telemetry collection.
