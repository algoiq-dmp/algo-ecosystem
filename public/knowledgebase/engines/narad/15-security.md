# 15 â€” Security Design

**Version:** 3.0.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-24

---

## Security Model

Narad is the infrastructure nerve center â€” its security is paramount. All security is delegated to **Suraksha**.

## Authentication

- REST API: Suraksha JWT tokens.
- gRPC Agent communication: mTLS with Suraksha-issued certificates.
- CLI: Suraksha API keys or JWT.

## Authorization (RBAC)

| Role | Permissions |
|---|---|
| `narad.admin` | Full access to all APIs, all servers, all commands |
| `narad.operator` | View registry, trigger deployments, execute approved commands |
| `narad.readonly` | View registry, health, configs; no write access |
| `narad.agent` | Agent registration, heartbeat, telemetry; minimal permissions |

## Remote Command Security

- Production servers require **approval workflow**: command submitted -> pending -> approved -> executed.
- Commands are executed in a **sandboxed shell** (no interactive mode).
- Maximum command timeout: 5 minutes.
- Output length capped at 10MB.
- Blocked commands list: `rm -rf /`, `dd`, `mkfs`, `shutdown -h now`, etc.

## Encryption

| Channel | Protocol |
|---|---|
| REST API | TLS 1.3 |
| gRPC Agent | mTLS 1.3 |
| WebSocket | WSS (TLS 1.3) |
| PostgreSQL | TLS 1.3 |
| Redis | TLS 1.3 |

## Secrets Management

All secrets from Suraksha Vault. Never in config files or environment variables.

## Audit Trail

Every administrative action is logged:
- Who performed the action
- What action was taken
- Which resource was affected
- When it happened
- Source IP address
- Result (success/failure)

## Threat Mitigations

| Threat | Mitigation |
|---|---|
| Unauthorized command execution | Multi-factor approval for production |
| Agent impersonation | mTLS with Suraksha certificates |
| Configuration tampering | Versioned configs with audit trail |
| Service registry poisoning | Suraksha auth on registration endpoints |
| Credential theft | All secrets in Vault, short-lived tokens |
| Log injection | Structured JSON logging prevents injection |
