# 17 — Suraksha Integration

> **Version:** v2.1.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## Overview

Hanuman integrates with **Suraksha** for strategy signature verification, audit trail encryption, certificate management, and compliance anchoring. All regulatory-critical operations flow through Suraksha.

## Integration Points

### 1. Strategy Signature Verification

```
Strategy Vega File → hanumanctl load → Suraksha Signature Service
                                           │
                                           │ Verify: file hash matches signature
                                           │ Verify: signing key belongs to authorized developer
                                           │
                                           ▼
                                      Load APPROVED / REJECTED
```

Production strategies MUST be signed. Unsigned strategies are rejected with code `STRATEGY_NOT_SIGNED`.

### 2. Audit Trail Encryption

```
TradeEvent → AuditLogger → Suraksha Encryption Service
                                │
                                │ AES-256-GCM encryption
                                │ DEK rotation every 24 hours
                                │
                                ▼
                           Encrypted Audit Store
                                │
                                ▼
                           Daily Merkle Root → Blockchain Anchor
```

### 3. Certificate Management

- gRPC API mTLS certificates from Suraksha Vault PKI
- Operator certificates for `hanumanctl` access
- Automatic renewal 24 hours before expiry

### 4. Risk Engine Authorization

Pre-trade risk check calls to Risk Engine are authenticated via Suraksha-issued SPIFFE identity:
- Hanuman's SPIFFE ID: `spiffe://lakshmi.internal/component/hanuman/instance/{id}`
- Risk Engine validates this identity and checks authorization policy

### 5. Compliance Reporting

Daily compliance reports are generated and anchored via Suraksha:
- All trades executed with timestamps
- All strategy decisions with rationale
- All risk vetoes with threshold values
- All parameter changes with before/after values
- End-of-day P&L with calculation methodology

## Failure Handling

| Scenario | Behavior |
|----------|----------|
| Signature verification unavailable | Production strategies cannot be loaded; existing strategies continue running |
| Audit encryption unavailable | Audit events queued to local spill file; retried with exponential backoff |
| Certificate expired | gRPC API unavailable; strategy execution continues uninterrupted |
