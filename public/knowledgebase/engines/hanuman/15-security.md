# 15 — Security

> **Version:** v2.1.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## Security Model

Hanuman operates within the Lakshmi security perimeter with defense-in-depth for strategy execution. Since Hanuman dispatches real orders to exchanges, security is critical to prevent unauthorized trading.

## Authentication and Authorization

### gRPC API Access
- All management API calls require mTLS with SPIFFE identity
- Role-based access:
  - `execution-admin`: Full control (load, unload, start, stop, update params)
  - `execution-operator`: Start, stop, pause, resume strategies
  - `execution-viewer`: Read-only status and P&L

### CLI Access
- `hanumanctl` requires a valid operator certificate
- All admin commands are audit-logged to Suraksha
- Sensitive operations (emergency stop, param update) require confirmation

### Vega Strategy Signing
- Production strategy files must be signed by an authorized developer
- Signature verified at load time via Suraksha
- Unsigned strategies can only run in UAT/Dev environments

## Risk Controls (Security Perspective)

### Pre-Trade Gates
Every order must pass these security checks:
1. **Position limit:** Cannot exceed configured max position
2. **Order value limit:** Single order cannot exceed max value
3. **Daily loss limit:** Auto-pause strategy if daily loss exceeds threshold
4. **Circuit breaker:** Auto-stop after N consecutive losses
5. **Rate limiter:** Max orders per second per strategy prevents runaway algos

### Kill Switch

Emergency stop mechanisms:
1. **Strategy-level:** `hanumanctl stop --id strat-001`
2. **Server-level:** `hanumanctl emergency-stop --all`
3. **Physical kill switch:** Network-isolate the Hanuman server via automated firewall rule
4. **ODIN-side:** ODIN can reject orders from Hanuman client ID

## Audit Trail

Every trading decision is audited:
- Strategy load/start/stop events
- Signal generation (entry/exit with conditions)
- Order dispatch (symbol, side, quantity, price)
- Fill events (matched against orders)
- Risk vetoes (reason, values that triggered veto)
- Parameter changes (old value → new value, who changed)

Audit trail is encrypted, signed, and anchored via Suraksha.

## Data Protection

- Strategy source code (Vega DSL files) stored in version-controlled repository with access controls
- Strategy parameters stored in encrypted configuration
- P&L data access restricted to authorized personnel
- No market data or order data stored locally beyond operational caches

## Vulnerability Management

| Practice | Cadence |
|----------|---------|
| Code review (all changes) | Per PR |
| Static analysis (Coverity) | Per CI build |
| Dependency scanning | Per CI build |
| Penetration testing | Quarterly |
| Strategy review (P&L + risk) | Weekly by Execution desk |
