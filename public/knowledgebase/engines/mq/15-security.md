# 15 — Security

> **Version:** v5.1.3 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## Security Architecture

MQ implements defense-in-depth with authentication, authorization, encryption, and audit logging at every layer.

## Authentication

### mTLS (Mutual Transport Layer Security)

All client-broker and inter-broker communication uses mTLS with SPIFFE identities:

- **Client Certificate:** `spiffe://lakshmi.internal/component/{component}/instance/{id}`
- **Broker Certificate:** `spiffe://lakshmi.internal/component/mq/broker/{id}`
- **CA:** Suraksha Vault PKI (internal CA, HSM-backed root)
- **Certificate rotation:** Every 72 hours (automated via Vault agent)
- **Revocation:** OCSP stapling on all TLS connections

### SASL/SCRAM (Alternative)

For non-SPIFFE clients (research tools, external integrations), SASL/SCRAM-SHA-512 is available as a fallback authentication mechanism. Credentials are managed via Suraksha IAM.

## Authorization

### Access Control Lists (ACLs)

ACLs are defined per principal and enforced at the broker level:

```yaml
acls:
  - principal: "spiffe://lakshmi.internal/component/feedd/*"
    permissions:
      - resource: "topic:feed.*"
        operations: ["WRITE", "DESCRIBE"]
      - resource: "topic:feed.market.status"
        operations: ["WRITE"]

  - principal: "spiffe://lakshmi.internal/component/strategy/*"
    permissions:
      - resource: "topic:feed.*"
        operations: ["READ"]
      - resource: "topic:orders.*"
        operations: ["WRITE"]
      - resource: "group:strategy-*"
        operations: ["READ"]

  - principal: "spiffe://lakshmi.internal/component/odin/*"
    permissions:
      - resource: "topic:orders.*"
        operations: ["READ"]
      - resource: "topic:executions.*"
        operations: ["WRITE"]

  - principal: "spiffe://lakshmi.internal/component/narad/*"
    permissions:
      - resource: "topic:*"
        operations: ["READ", "DESCRIBE"]
```

### Admin ACLs

Admin operations (topic creation, partition reassignment) require explicit admin privileges:

```yaml
admin_acls:
  - principal: "spiffe://lakshmi.internal/user/admin-*"
    permissions: ["ALL"]
  - principal: "spiffe://lakshmi.internal/component/mqctl"
    permissions: ["READ", "DESCRIBE", "ALTER"]
```

## Encryption

### Data in Transit

- **Client ↔ Broker:** TLS 1.3, ECDHE-RSA-AES256-GCM-SHA384
- **Broker ↔ Broker:** TLS 1.3 (same cipher suite)
- **Inter-DC mirror:** TLS 1.3 over dedicated dark fiber (encrypted at line rate)

### Data at Rest

- **RocksDB:** Encryption at rest via RocksDB's built-in encryption with Suraksha-managed keys
- **Commit logs:** AES-256-GCM, key rotation every 24 hours
- **Consumer offset storage:** Same encryption as commit logs

## Audit Logging

All admin actions and authentication events are logged:

```json
{
  "timestamp": "2026-07-25T09:15:00.123Z",
  "action": "CREATE_TOPIC",
  "principal": "spiffe://lakshmi.internal/user/admin-darshan",
  "resource": "topic:feed.NSE.CM.tick",
  "details": {
    "partitions": 16,
    "replication_factor": 3,
    "retention_ms": 604800000
  },
  "source_ip": "10.100.50.10",
  "result": "SUCCESS"
}
```

Audit logs are forwarded to Suraksha for encrypted storage and Merkle tree anchoring.

## Network Security

- Broker access restricted to Lakshmi management VLAN
- No public internet access from any broker node
- Firewall rules: allow-list only (specific IPs/ports)
- DDoS protection: connection rate limiting, max message size enforcement
- Inter-broker traffic on dedicated, physically isolated VLAN

## Vulnerability Management

| Practice | Frequency |
|----------|-----------|
| OS patches | Monthly |
| Dependency scanning (Snyk) | Per CI build |
| Static analysis (Coverity) | Per CI build |
| Container image scan (Trivy) | Per CI build |
| Penetration testing | Quarterly |
| Secret scanning | Pre-commit + CI |
| CIS benchmark compliance | Monthly |

## Security Incident Response

1. Isolate affected broker(s) from the cluster
2. Preserve logs, memory dumps, and storage snapshots
3. Fail over affected partitions to other brokers
4. Notify Security Officer via PagerDuty
5. Follow [Lakshmi Incident Response Playbook](https://wiki.internal/lakshmi/security/ir)
