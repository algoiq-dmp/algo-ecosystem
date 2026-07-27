# 17. Suraksha Integration

**Version:** 2.1.0
**Owner:** Security Engineering
**Last Updated:** 2026-07-24

---

## Overview

Suraksha is the centralised security and identity platform for the Algo-IQ ecosystem. Lakshmi integrates with Suraksha for authentication, authorization, certificate lifecycle management, encryption key orchestration, security auditing, and threat detection. This document details each integration point and its configuration.

---

## Integration Architecture

```
+-------------------+       +---------------------------+
|     Lakshmi       |       |         Suraksha          |
+-------------------+       +---------------------------+
        |                            |
        |--- JWT Validation -------->|  Auth Service (:8443)
        |--- RBAC Policy Fetch ----->|  Policy Engine (:8444)
        |--- Certificate Issue ----->|  PKI Service (:8445)
        |--- Key Management -------->|  Key Vault (:8446)
        |--- Audit Events ---------->|  Audit Pipeline (:5044)
        |--- Threat Intel <--------->|  Sentinel (:8447)
        |                            |
```

---

## Authentication Integration

### JWT Validation

Lakshmi validates every incoming JWT against Suraksha's JWKS (JSON Web Key Set) endpoint:

```
GET https://suraksha.algo-iq.local:8443/.well-known/jwks.json
```

**Validation Steps:**
1. Decode JWT header; extract `kid` (Key ID)
2. Fetch JWKS from Suraksha; locate key matching `kid`
3. Verify signature using RSA public key
4. Validate `iss`, `aud`, `exp`, `nbf`, `iat` claims
5. Optionally validate `tenant_id` claim for multi-tenancy

**Caching:**
- JWKS cached for 5 minutes (TTL configurable)
- Successful token validations cached for 1 minute
- Failed validations NOT cached (to allow immediate retry)

### Token Refresh

Lakshmi supports transparent token refresh for WebSocket connections with long-lived sessions:

```
POST https://suraksha.algo-iq.local:8443/api/v1/token/refresh
Authorization: Bearer <refresh_token>
```

WebSocket sessions approaching JWT expiry (within 15 minutes) trigger automatic refresh without disconnecting the client.

### Service Account Mapping

| Service | Suraksha Service Account | JWT `sub` |
|---|---|---|
| Lakshmi Engine | `svc-lakshmi` | `svc-lakshmi@algo-iq.local` |
| Ganesh Feed | `svc-ganesh` | `svc-ganesh@algo-iq.local` |
| Surya Feed | `svc-surya` | `svc-surya@algo-iq.local` |
| Strategy Factory | `svc-strategy-factory` | `svc-strategy-factory@algo-iq.local` |
| Analytics | `svc-analytics` | `svc-analytics@algo-iq.local` |

---

## Authorization Integration

### Policy Fetch

Lakshmi fetches RBAC policies from Suraksha's Policy Engine on startup and every 5 minutes:

```
GET https://suraksha.algo-iq.local:8444/api/v1/policy/lakshmi
Authorization: Bearer <lakshmi_service_token>
```

**Response:**
```json
{
  "roles": [
    {
      "name": "publisher",
      "permissions": ["topic:publish:*"],
      "rate_limit": 10000
    },
    {
      "name": "subscriber",
      "permissions": ["topic:subscribe:*", "topic:list"],
      "rate_limit": 5000
    }
  ],
  "topic_acls": {
    "NFO_EQ": {
      "publishers": ["svc-ganesh", "svc-surya"],
      "subscribers": ["svc-strategy-factory", "svc-trading-terminal"],
      "rate_limit_publish": 50000,
      "rate_limit_subscribe": 10000
    }
  }
}
```

### Policy Enforcement Points (PEP)

| Enforcement Point | Location | Checks |
|---|---|---|
| HTTP middleware | Every API request | JWT valid, role authorised, scope sufficient |
| WebSocket handshake | Connection upgrade | JWT valid, topic subscription authorised |
| Message publish | Publisher before MQ routing | ACL: publisher in topic allowlist |
| Message subscribe | Consumer queue binding | ACL: subscriber in topic allowlist |
| Admin operations | Admin API endpoints | Role: Admin required |

### Policy Updates

Suraksha pushes policy changes to Lakshmi via Narad events:

```
Event: "suraksha.policy.updated"
Body: { "service": "lakshmi", "revision": 42, "changed_keys": ["topic_acls.NFO_EQ"] }
```

Lakshmi fetches the updated policy within 10 seconds and hot-reloads without restart.

---

## Certificate Validation

### Certificate Issuance

Lakshmi requests server certificates from Suraksha PKI:

```
POST https://suraksha.algo-iq.local:8445/api/v1/certificate/issue
{
  "service": "lakshmi",
  "instance_id": "lakshmi-node-3",
  "common_name": "lakshmi-node-3.algo-iq.local",
  "san": ["lakshmi.algo-iq.local", "lakshmi-node-3", "10.20.30.41"],
  "validity_days": 30
}
```

### Certificate Renewal

Automated renewal workflow:
1. **T-7 days:** Suraksha sends renewal reminder to Lakshmi
2. **T-24 hours:** Suraksha auto-issues new certificate
3. **T-0:** Lakshmi loads new certificate; old certificate remains valid for 24-hour overlap
4. **T+24 hours:** Old certificate expires; removed from trust store

### Client Certificate Validation (mTLS)

For service-to-service communication (RabbitMQ, Redis), Lakshmi enforces mutual TLS:

```
# RabbitMQ mTLS
verify: verify_peer
fail_if_no_peer_cert: true
cacertfile: /etc/lakshmi/certs/suraksha-ca.pem
certfile: /etc/lakshmi/certs/lakshmi-mq.pem
keyfile: /etc/lakshmi/certs/lakshmi-mq-key.pem
```

### OCSP Stapling

Lakshmi staples OCSP responses in TLS handshakes to provide real-time certificate status without clients needing to contact the CA directly.

---

## Encryption Key Management

### Key Hierarchy

```
Suraksha Root Key (HSM-backed)
└── Lakshmi Master Key (AES-256-GCM)
    ├── Message Signing Key (HMAC-SHA256) — rotated daily
    ├── Config Encryption Key (AES-256-GCM) — rotated monthly
    ├── Token Encryption Key (AES-256-GCM) — rotated weekly
    └── Cache Encryption Key (AES-256-GCM) — rotated weekly
```

### Key Fetch

Lakshmi retrieves encryption keys from Suraksha Key Vault on startup:

```
POST https://suraksha.algo-iq.local:8446/api/v1/keys/fetch
{
  "service": "lakshmi",
  "key_names": ["message-signing", "config-encryption", "token-encryption", "cache-encryption"]
}
```

### Key Rotation

| Key | Rotation Frequency | Rotation Method |
|---|---|---|
| Message Signing Key | Daily (00:00 UTC) | New key loaded; old key valid for 1 hour overlap |
| Config Encryption Key | Monthly (1st) | Re-encrypt config with new key; store old key for rollback |
| Token Encryption Key | Weekly (Monday) | New tokens signed with new key; old key valid for 24 hours |
| Cache Encryption Key | Weekly (Monday) | Flush Redis cache; re-encrypt hot data with new key |

### Secure Enclave

If available, Lakshmi uses a TPM or HSM-backed secure enclave for key operations (signing, decryption). Keys never leave the enclave in plaintext.

---

## Security Audit Integration

### Audit Event Forwarding

Lakshmi streams all audit events to Suraksha's Audit Pipeline in real-time:

```
POST https://suraksha.algo-iq.local:5044/api/v1/audit/ingest
Content-Type: application/x-ndjson

{"event":"access.topic_publish","user_id":"svc-ganesh","topic":"NFO_EQ",...}
{"event":"access.topic_subscribe","user_id":"svc-strategy-factory","topic":"NFO_EQ",...}
{"event":"auth.login","user_id":"darshan","success":true,...}
```

### Audit Event Correlation

Suraksha correlates Lakshmi audit events with events from other services (Ganesh, Surya, Strategy Factory) to build a complete request chain:

```
User Login (Suraksha) → Token Issue (Suraksha) → API Call (Lakshmi) → Topic Publish (Lakshmi)
```

### Compliance Reports

Suraksha generates periodic compliance reports from aggregated audit data:
- Daily access summary
- Weekly privilege escalation report
- Monthly certificate inventory
- Quarterly access review for SOC 2 / ISO 27001

---

## Threat Detection Integration

### Suraksha Sentinel

Lakshmi integrates with Suraksha Sentinel for real-time threat detection:

| Detection Rule | Trigger | Response |
|---|---|---|
| JWT replay attack | Same JWT used from 2+ IPs within 5 min | Revoke token; alert; block IPs |
| Topic access violation | Subscriber attempts unauthorised topic (3x in 60s) | Block subscriber; generate alert |
| Rate limit exceeded | Publisher exceeds rate limit (2x configured) | Throttle; alert if sustained >5 min |
| Certificate compromise | Certificate appears on CRL | Immediate revocation; rotate all keys |
| Abnormal traffic pattern | Message rate deviates >3σ from 7-day baseline | Generate anomaly alert; auto-scale if safe |
| API key brute force | 10+ failed API key auth from same IP | Block IP for 30 min; alert security team |

### Threat Intelligence Feed

Suraksha Sentinel pushes threat intelligence to Lakshmi:

```
Event: "sentinel.threat_update"
{
  "blocked_ips": ["198.51.100.0/24"],
  "revoked_tokens": ["tok-abc123", "tok-def456"],
  "threat_level": "elevated",
  "action": "enforce"
}
```

Lakshmi immediately blocks listed IPs and revokes listed tokens without restart.

---

## Standalone Mode (No Suraksha)

When Suraksha is unavailable, Lakshmi falls back to local security:

| Function | Suraksha Mode | Standalone Mode |
|---|---|---|
| Authentication | Suraksha JWKS | Local JWKS file (`/etc/lakshmi/jwks.json`) |
| Authorization | Suraksha Policy Engine | Local policy file (`/etc/lakshmi/policy.json`) |
| Certificates | Suraksha PKI | Manual cert provisioning |
| Key Management | Suraksha Key Vault | Encrypted keys file |
| Audit Logging | Suraksha Audit Pipeline | Local file + log rotation |
| Threat Detection | Suraksha Sentinel | Basic rate-limiting |

---

## Configuration

```json
{
  "suraksha": {
    "enabled": true,
    "hosts": [
      "suraksha-1.algo-iq.local",
      "suraksha-2.algo-iq.local"
    ],
    "auth": {
      "port": 8443,
      "jwks_path": "/.well-known/jwks.json",
      "jwks_cache_ttl_sec": 300,
      "token_cache_ttl_sec": 60,
      "token_refresh_path": "/api/v1/token/refresh"
    },
    "policy": {
      "port": 8444,
      "fetch_path": "/api/v1/policy/lakshmi",
      "refresh_interval_sec": 300,
      "local_fallback": "/etc/lakshmi/policy.json"
    },
    "pki": {
      "port": 8445,
      "issue_path": "/api/v1/certificate/issue",
      "renewal_days_before": 7,
      "ca_cert": "/etc/lakshmi/certs/suraksha-ca.pem"
    },
    "key_vault": {
      "port": 8446,
      "fetch_path": "/api/v1/keys/fetch",
      "rotation_schedule": "cron:0 0 * * 0"
    },
    "audit": {
      "port": 5044,
      "ingest_path": "/api/v1/audit/ingest",
      "batch_size": 100,
      "flush_interval_sec": 5
    },
    "sentinel": {
      "port": 8447,
      "threat_update_path": "/api/v1/threat/updates",
      "block_duration_sec": 1800
    },
    "tls": {
      "enabled": true,
      "verify_peer": true,
      "ca": "/etc/lakshmi/certs/suraksha-ca.pem"
    }
  }
}
```

---

## Health Check

```
GET http://lakshmi:3001/api/v1/health/suraksha
```

**Response:**
```json
{
  "suraksha_connected": true,
  "auth_service": "healthy",
  "policy_engine": "healthy",
  "pki_service": "healthy",
  "key_vault": "healthy",
  "audit_pipeline": "healthy",
  "sentinel": "healthy",
  "last_policy_sync": "2026-07-24T10:30:00Z",
  "last_key_rotation": "2026-07-24T00:00:00Z",
  "last_cert_renewal": "2026-07-17T00:00:00Z",
  "certs_expiring_in_days": 23
}
```
