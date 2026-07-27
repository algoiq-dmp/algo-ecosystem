# 16 — Security Design

**Version:** 6.3.0 | **Owner:** Execution | **Last Updated:** 2026-07-24

---

## Security Architecture

Vega handles highly sensitive financial data — order flow, broker credentials, and user account mappings. The security design follows defense-in-depth principles with multiple independent layers.

---

## Authentication & Authorization

### API Authentication Flow

```
Client                    Vega API
  │                          │
  │  1. Generate signature   │
  │     HMAC-SHA256(         │
  │       body +             │
  │       timestamp +        │
  │       apiKey,            │
  │       secretKey          │
  │     )                    │
  │                          │
  │  2. POST /orders ──────▶ │
  │     X-API-Key            │
  │     X-Timestamp          │
  │     X-Signature          │
  │                          │  3. Validate timestamp drift < 5s
  │                          │  4. Lookup secretKey by apiKey
  │                          │  5. Recompute signature
  │                          │  6. Compare signatures (timing-safe)
  │                          │
  │  7. 202 ACCEPTED ◀────── │
```

### API Key Management

| Aspect | Detail |
|---|---|
| Generation | `crypto.randomBytes(32).toString('hex')` |
| Storage | `api_keys` table: `id, key_hash, secret_hash, user_id, tier, created_at, expires_at, revoked` |
| Hashing | SHA-256 for key, bcrypt (cost=12) for secret |
| Rotation | 90-day maximum lifetime, 30-day rotation reminder |
| Revocation | Instant — sets `revoked = true`; active connections complete |
| Rate Limit Bypass | Not possible via API key alone — rate limit is per userId |

### HMAC Implementation

```javascript
const crypto = require('crypto');

function validateSignature(req, secretKey) {
  const timestamp = req.headers['x-timestamp'];
  const signature = req.headers['x-signature'];
  const body = JSON.stringify(req.body);

  // 1. Timestamp drift check
  const drift = Math.abs(Date.now() - parseInt(timestamp));
  if (drift > 5000) {
    return { valid: false, reason: 'TIMESTAMP_DRIFT' };
  }

  // 2. Replay prevention (optional — Redis SETNX with TTL)
  // redis.setnx(`nonce:${signature}`, '1', 'EX', 300)

  // 3. Signature computation
  const payload = body + timestamp + req.headers['x-api-key'];
  const computed = crypto
    .createHmac('sha256', secretKey)
    .update(payload)
    .digest('hex');

  // 4. Timing-safe comparison
  return {
    valid: crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(computed)
    ),
    reason: null
  };
}
```

---

## Credential Management

### Vault Architecture

```
┌───────────────────────────────────────┐
│         HashiCorp Vault                │
│  ┌─────────────────────────────────┐  │
│  │  Secret Engine: KV v2           │  │
│  │  /secret/vega/                   │  │
│  │    ├── brokers/xts/api-key       │  │
│  │    ├── brokers/xts/session-token │  │
│  │    ├── brokers/greeksoft/cert    │  │
│  │    └── brokers/greeksoft/key     │  │
│  └─────────────────────────────────┘  │
│  Auth: AppRole (per service instance) │
└───────────────────────────────────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────┐
│ Credential Mgr  │────▶│ Audit Logger  │
│ (in-memory      │     │ (every read)  │
│  encrypted      │     └──────────────┘
│  cache, TTL 1h) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Broker Adapters │
│ (inject at      │
│  session init)   │
└─────────────────┘
```

### Credential Rotation

```javascript
async function rotateCredentials(broker) {
  // 1. Generate new credential via broker API
  const newCred = await brokerApi.rotateApiKey();

  // 2. Store new credential in Vault (create new version)
  await vault.write(`secret/vega/brokers/${broker}/api-key`, newCred);

  // 3. Update Credential Manager cache
  credentialCache.set(broker, newCred);

  // 4. Graceful FIX session reconnect with new credential
  await fixSession.logout('Credential rotation');
  await fixSession.connect(newCred);

  // 5. Verify connectivity with new credential
  await fixSession.sendTestRequest();

  // 6. Mark old credential for expiry (24h grace period)
  await vault.markForDeletion(`secret/vega/brokers/${broker}/api-key`, 1);

  // 7. Audit log
  auditLog.record('CREDENTIAL_ROTATED', { broker, timestamp: new Date() });
}
```

---

## Transport Security

| Path | Protocol | Encryption |
|---|---|---|
| Client → Vega API | HTTPS | TLS 1.3, AES-256-GCM |
| Vega API → MQ | AMQP over TLS | TLS 1.2+ |
| Vega Internal (gRPC) | gRPC over TLS | TLS 1.3 |
| Vega → XTS Broker | FIX over TCP | Dedicated VLAN (physical isolation) |
| Vega → Greeksoft Broker | FIX over TLS | TLS 1.3 |
| Vega → Redis | Redis over TLS | TLS 1.2 |
| Vega → PostgreSQL | TCP over TLS | TLS 1.2 |
| Vega → Vault | HTTPS | TLS 1.3, mTLS |

### TLS Configuration

```json
{
  "tls": {
    "minVersion": "TLSv1.2",
    "ciphers": [
      "TLS_AES_256_GCM_SHA384",
      "TLS_CHACHA20_POLY1305_SHA256",
      "TLS_AES_128_GCM_SHA256"
    ],
    "honorCipherOrder": true,
    "ecdhCurve": "X25519",
    "certificatePath": "/etc/vega/certs/server.crt",
    "privateKeyPath": "/etc/vega/certs/server.key",
    "caPath": "/etc/vega/certs/ca.crt"
  }
}
```

---

## Network Security

### VLAN Segmentation

```
┌───────────────── VLAN: INTERNAL (10.0.1.0/24) ─────────────────┐
│  Vega API, Vega App, Order Processor, Redis, RabbitMQ, PG     │
└────────────────────────────────────────────────────────────────┘
         │
    [Firewall: allow ports 3003, 3004 from ALGO-IQ-CORE]
         │
┌───────────────── VLAN: BROKER (10.0.10.0/24) ──────────────────┐
│  FIX Gateway VMs — dedicated NICs for broker connectivity      │
└────────────────────────────────────────────────────────────────┘
         │
    [Firewall: allow ONLY broker IPs on FIX ports 9200, 9201]
         │
┌────────────┐  ┌────────────┐
│ XTS Leased │  │ Greeksoft  │
│ Line       │  │ VPN Tunnel │
└────────────┘  └────────────┘
```

### Firewall Rules

| Source | Destination | Port | Action |
|---|---|---|---|
| ALGO-IQ-CORE VLAN | VEGA INTERNAL VLAN | 3003, 3004 | ALLOW |
| VEGA INTERNAL VLAN | VEGA BROKER VLAN | 9200, 9201 | ALLOW |
| ANY | VEGA INTERNAL VLAN | 22 | ALLOW (bastion only) |
| XTS Broker IP | VEGA BROKER VLAN | 9200 | ALLOW |
| Greeksoft Broker IP | VEGA BROKER VLAN | 9201 | ALLOW |
| ANY | ANY | * | DENY (default) |

---

## Audit & Compliance

### Access Audit Trail

Every credential access is logged:

```sql
INSERT INTO audit.credential_access
(time, user_id, broker, action, ip_address, user_agent)
VALUES
(NOW(), 'SYSTEM-ROTATION', 'XTS', 'ROTATE', '10.0.1.45', 'Vega/6.3.0');
```

### Compliance Reports

| Report | Frequency | Audience |
|---|---|---|
| All order events | On-demand | SEBI / Exchange |
| Credential access log | Monthly | CISO |
| API key usage summary | Weekly | Engineering Lead |
| Security incident log | Per incident | CISO, CTO |

---

## Incident Response

### Security Incident Classifications

| Severity | Examples | Response Time |
|---|---|---|
| **P1 — Critical** | Credential leak, unauthorized trading, Vault compromise | 15 minutes |
| **P2 — High** | Suspicious API activity, FIX session hijack attempt | 1 hour |
| **P3 — Medium** | Expired certificate, failed credential rotation | 4 hours |
| **P4 — Low** | Non-critical vulnerability scan finding | Next business day |

### Credential Compromise Playbook

```
1. IMMEDIATE: Halt all orders via Kill Switch override
2. Rotate ALL credentials for affected broker
3. Terminate ALL active FIX sessions
4. Audit all orders from compromised credential time window
5. Notify broker's security team
6. Notify Risk & Compliance teams
7. File incident report within 24 hours
8. Post-mortem within 5 business days
```
