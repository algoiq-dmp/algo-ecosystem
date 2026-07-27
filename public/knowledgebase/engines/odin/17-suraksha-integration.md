# 17 — Suraksha Integration

> **Version:** v3.0.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## Overview

ODIN integrates with **Suraksha** for exchange credential management, order audit trail encryption, certificate lifecycle, and compliance anchoring.

## Integration Points

### 1. Exchange Credential Management

```
ODIN Adapter Start → Vault Agent → Suraksha Vault
                                        │
                                        │ Retrieve: exchange API key, secret
                                        │ Retrieve: FIX session credentials
                                        │
                                        ▼
                                   Adapter connects to exchange
```

Credentials are never stored in ODIN config files. They are injected at runtime via Vault agent sidecar.

### 2. Order Audit Trail

```
OrderEvent → AuditLogger → Suraksha Encryption
                                │
                                │ AES-256-GCM
                                │ Batch: 1000 events
                                │
                                ▼
                           Encrypted Audit Store
                                │
                                ▼
                           Daily Merkle Root → Blockchain Anchor
```

### 3. Certificate Management

- gRPC API mTLS certificates from Suraksha Vault PKI
- Exchange FIX session certificates (if applicable)
- SFTP key for exchange trade file download
- Auto-renewal 24 hours before expiry

### 4. Algo ID Validation

SEBI algo registration IDs are managed in Suraksha IAM as attributes of strategy engine identities:

```yaml
# Suraksha IAM: Strategy Engine Identity
spiffe://lakshmi.internal/component/hanuman/instance/hanuman01-mum:
  algo_ids: ["ALGO12345", "ALGO67890"]
  exchange_permissions:
    - exchange: NSE, segments: [CM, FO]
    - exchange: BSE, segments: [CM]
```

ODIN validates algo IDs against these registered values before routing.

### 5. Compliance Reports

Daily compliance reports generated and anchored via Suraksha:
- Order-to-trade ratio per client/algo
- Order modification rate
- Cancel order rate
- All orders with timestamps, prices, quantities
- All rejections with reasons

## Failure Handling

| Scenario | Behavior |
|----------|----------|
| Vault unreachable during adapter start | Adapter fails to start |
| Vault unreachable during credential refresh | Adapter continues with cached credentials; alert if > 1h until expiry |
| Audit encryption unavailable | Events queued to local spill file; retry with backoff |
| Anchoring unavailable | Report generated locally; anchored on Suraksha recovery |
