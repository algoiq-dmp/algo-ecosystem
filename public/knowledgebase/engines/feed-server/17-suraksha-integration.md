# 17 — Suraksha Integration

> **Version:** v2.8.0 | **Owner:** Market Data | **Last Updated:** 2026-07-25

## Overview

**Suraksha** is the Lakshmi security and audit platform providing encryption, key management, identity management, and audit trail services. The Feed Server integrates with Suraksha for audit log encryption, certificate management, and compliance verification.

## Integration Points

### 1. Audit Log Encryption

Every audit batch (10,000 messages) is encrypted before storage:

```
Feed Server → Suraksha Encryption Service (gRPC)
     │
     │ Request: { batch_id, plaintext, compression_algo }
     │ Response: { batch_id, ciphertext, key_id, encrypted_data_key, iv, tag }
     │
     ▼
Encrypted blob stored in PostgreSQL `feedd_config.feed_audit_log`
```

**Encryption details:**
- Algorithm: AES-256-GCM
- Key rotation: every 24 hours (automated via Suraksha KMS)
- Data encryption key (DEK) is unique per batch
- DEK is wrapped with the Suraksha Key Encryption Key (KEK) stored in HSM

### 2. Certificate Management

mTLS certificates for gRPC and inter-service communication are provisioned by Suraksha Vault PKI:

```bash
# Certificate issuance flow
feedd → Vault Agent (sidecar) → Vault PKI → Issue Certificate
                                                    │
                                          SPIFFE ID, TTL=72h
```

- Certificate renewal: automatic, 24 hours before expiry
- Revocation check: OCSP stapling on all TLS connections
- Root CA stored in hardware security module (HSM)

### 3. Identity and Access Management

CLI commands (`feeddctl`) require authentication via Suraksha IAM:

```yaml
# Suraksha Policy Example: feed-server-admin
path "lakshmi/feedd/*" {
  capabilities = ["pause", "resume", "reload", "status"]
}
path "lakshmi/feedd/replay" {
  capabilities = ["request"]
}
```

### 4. Merkle Tree Anchoring

At end-of-day (EOD), a Merkle tree is constructed over all audit batch hashes:

```
Batch 0 ──► Hash(B0)
Batch 1 ──► Hash(B1)  ──► Hash(H0+H1) ──┐
Batch 2 ──► Hash(B2)                     ├──► Merkle Root
Batch 3 ──► Hash(B3)  ──► Hash(H2+H3) ──┘
...
```

The Merkle root is published to Suraksha's blockchain anchoring service for tamper-evident timestamps.

### 5. Instrument Master Validation

Exchange-provided instrument master files are validated via Suraksha:

```
Feed Server → Suraksha Signature Verification
     │
     │ Verify: SHA-256 hash matches exchange-published signature
     │ Verify: File signed by known exchange public key
     │
     └──► Load symbol master if verification passes
```

### Integration Configuration

```yaml
suraksha:
  encryption_endpoint: "localhost:50070"
  vault_agent_socket: "/var/run/vault/agent.sock"
  iam_endpoint: "suraksha-iam.internal:50071"
  anchoring_endpoint: "suraksha-anchor.internal:50072"
  signature_verification: true
  encryption:
    algorithm: "AES-256-GCM"
    key_rotation_interval_hours: 24
    compression: "zstd"
```

### Failure Handling

If Suraksha is unreachable:
1. Audit batches are queued in a local spill file (`/var/spool/lakshmi/feedd/audit_spill/`)
2. Encryption and storage are retried with exponential backoff (1s, 2s, 4s, ..., max 60s)
3. After 300s of continuous failure, a P1 alert is raised via Narad
4. Feed ingestion continues uninterrupted — the data path is not dependent on Suraksha
