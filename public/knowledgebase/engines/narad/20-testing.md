# 20 â€” Testing Strategy

**Version:** 3.0.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-24

---

## Test Layers

| Layer | Coverage | Tools |
|---|---|---|
| Unit Tests | 80% | Jest |
| Integration Tests | Service-level | Docker Compose |
| E2E Tests | Full flow | Custom harness |
| Chaos Tests | Failure scenarios | Custom scripts |
| Load Tests | Scale limits | k6 |

## Unit Tests

```bash
npm test
```

Key areas:
- Service registry CRUD operations
- Configuration versioning logic
- Heartbeat TTL expiration
- Deployment state machine transitions
- Port allocation conflict detection

## Integration Tests

```bash
docker-compose -f docker-compose.test.yml up -d  # PostgreSQL + Redis
npm run test:integration
```

Scenarios:
- Agent registers with Control Plane, sends heartbeat, reports telemetry.
- Config creation, versioning, retrieval, change notification.
- Full deployment orchestration with mock instances.
- Remote command execution with approval workflow.
- Health aggregation across multiple mock services.

## E2E Tests

```bash
npm run test:e2e
```

Simulates:
- 3 CP nodes + 20 Agent nodes.
- Agent auto-discovery and registration.
- Health monitoring and alerting for all 20 nodes.
- Config push to all 20 agents.
- Rolling deployment across 5 instances.

## Chaos Tests

```bash
npm run test:chaos
```

Scenarios:
- Kill CP node: Verify agents reconnect to remaining nodes.
- Kill Agent: Verify CP detects and alerts within 30s.
- Network partition between CP and Agents: Verify agents buffer data and replay.
- Kill PostgreSQL: Verify Redis-only mode.
- Kill Redis: Verify PostgreSQL direct fallback.

## Load Tests

```bash
npm run test:load
```

| Test | Target |
|---|---|
| 500 agents streaming telemetry | < 10% CP CPU |
| 10K config fetch/sec | p99 < 5ms |
| 100K log lines/sec shipped | No drops |
| 100 concurrent deployments | All complete within 30 min |
