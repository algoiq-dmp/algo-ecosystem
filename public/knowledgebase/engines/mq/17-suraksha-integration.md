# 17 — Suraksha Integration

> **Version:** v5.1.3 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## Overview

MQ integrates with **Suraksha** for identity management, certificate lifecycle, encryption key management, and audit trail anchoring. All security-sensitive operations flow through Suraksha.

## Integration Points

### 1. mTLS Certificate Management

Broker and client certificates are issued and rotated via Suraksha Vault PKI:

```
MQ Broker → Vault Agent (sidecar) → Vault PKI
    │
    │ Automatic certificate renewal: 24 hours before expiry
    │ SPIFFE ID embedded in certificate SAN
    │ OCSP stapling for revocation checking
```

### 2. Encryption-at-Rest Key Management

RocksDB encryption uses Suraksha-managed keys:

```
MQ Broker → Suraksha KMS (gRPC)
    │
    │ Request DEK for RocksDB column family
    │ DEK is AES-256; wrapped with KEK from HSM
    │ DEK rotation: every 24 hours
    │ Old DEKs retained for reading historical data
```

### 3. Admin Audit Anchoring

All admin operations are logged and anchored:

```
Admin Action → Audit Log → Suraksha Encryption Service
                                │
                          Suraksha Anchoring
                                │
                          Merkle Root → Blockchain Timestamp
```

### 4. ACL Synchronization

ACL policies are managed in Suraksha IAM and synchronized to MQ brokers:

```
Suraksha IAM → MQ ACL Sync (periodic poll, every 60 seconds)
    │
    │ ACL changes applied incrementally
    │ Brokers cache ACLs in memory for low-latency enforcement
    │ ACL cache invalidated on any policy change
```

### 5. Schema Registry Authentication

Schema registry enforces write access via Suraksha IAM roles:

- `schema-admin`: Register new schemas, change compatibility modes
- `schema-writer`: Register schema versions for existing topics
- `schema-reader`: Read schemas (needed by all producers and consumers)

## Integration Configuration

```yaml
suraksha:
  vault_agent_socket: "/var/run/vault/agent.sock"
  kms_endpoint: "suraksha-kms.internal:50080"
  iam_endpoint: "suraksha-iam.internal:50071"
  anchoring_endpoint: "suraksha-anchor.internal:50072"
  encryption:
    enabled: true
    key_rotation_interval_hours: 24
  audit:
    enabled: true
    batch_size: 1000
    flush_interval_sec: 10
```

## Failure Modes

| Scenario | Behavior |
|----------|----------|
| Suraksha KMS unreachable | Continue with cached DEK; operations not interrupted |
| Vault agent unreachable | Continue with current certificate; alert if > 24h before expiry |
| Suraksha IAM unreachable | Continue with cached ACLs; new ACLs not applied until reconnection |
| Suraksha anchoring unreachable | Audit logs queued locally; anchored on reconnection |

## Security Audit Trail Example

```json
{
  "event": "AUDIT_BATCH_ANCHORED",
  "broker_id": 1,
  "batch_id": "mq01-mum-20260725-001245",
  "batch_start_seq": 1000000,
  "batch_end_seq": 1000999,
  "merkle_leaf": "sha256:a1b2c3d4...",
  "merkle_root": "sha256:f6e5d4c3...",
  "blockchain_tx": "0x9a8b7c6d...",
  "anchored_at": "2026-07-25T09:15:30.000Z"
}
```
