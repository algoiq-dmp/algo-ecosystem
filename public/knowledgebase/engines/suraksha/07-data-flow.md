# 07 â€” Data Flow

**Version:** 2.0.0 | **Owner:** Security | **Last Updated:** 2026-07-24

---

## Authentication Flow

```
[Client/Service] --> POST /api/v1/auth/token { client_id, client_secret, audience }
        |
        v
[Suraksha Auth Service]
        |
        +---> Validate client credentials against Vault
        +---> Resolve client's roles from RBAC engine
        +---> Generate JWT with: sub, aud, exp (15min), roles, permissions, jti
        +---> Store jti in Redis (for replay detection)
        +---> Log audit: token issued
        |
        v
[Client] <-- { access_token, refresh_token, expires_in }
```

## Token Validation Flow

```
[Any Service] ---> Inbound Request with JWT
        |
        +---> Local JWT validation (no Suraksha call needed):
        |     1. Verify RS256 signature using Suraksha's public JWKS.
        |     2. Check exp (not expired).
        |     3. Check iss (suraksha.algoiq.io).
        |     4. Check aud (includes this service).
        |     5. Extract sub, roles, permissions.
        |
        +---> (Optional) Check token not revoked:
        |     POST /api/v1/auth/validate { token }
        |     Suraksha checks jti against Redis blacklist.
        |
        v
[Service proceeds with roles and permissions from JWT]
```

## Authorization Flow

```
[Service] --> GET /api/v1/authz/check { user_id, resource, action, token }
        |
        v
[Suraksha AuthZ Service]
        |
        +---> Validate requester's token
        +---> Check Redis cache: "authz:{user_id}:{resource}:{action}"
        |     HIT: Return cached decision.
        |     MISS:
        |       - Query PostgreSQL for user's roles.
        |       - Walk role hierarchy.
        |       - Check if any role grants the required permission.
        |       - Cache result in Redis (TTL: 60s).
        +---> Log audit: authorization check.
        |
        v
[Service] <-- { allowed: true/false, matched_role: "admin", cached: false }
```

## Secret Access Flow

```
[Ganesh Service] --> GET /api/v1/secrets/ganesh
        |
        v
[Suraksha Vault Integration]
        |
        +---> Validate Ganesh's service token
        +---> Verify Ganesh is authorized to access its own secrets
        +---> Proxy request to Vault: GET secret/ganesh
        +---> Log audit: secret accessed (service, path, timestamp)
        +---> Return secrets (never log secret values)
        |
        v
[Ganesh] <-- { redis_password, pg_password, ... }
```

## Certificate Renewal Flow

```
[Suraksha Cert Manager Cron] (daily)
        |
        v
  SELECT * FROM certificates WHERE valid_until < NOW() + INTERVAL '30 days'
        |
        v
  For each cert:
        |
        +---> Initiate ACME challenge with CA
        +---> Complete challenge (DNS-01 or HTTP-01)
        +---> Receive new certificate
        +---> Store cert + key in Vault: secret/certs/{domain}
        +---> Update certificates table
        +---> Notify service via Narad: "certificate renewed, reload needed"
        +---> Log audit: certificate renewed
```

## Threat Detection Flow

```
[Auth/Z Event Stream] --> [Threat Detection Engine]
        |
        v
  For each event:
        |
        +---> Evaluate against sliding-window rules
        +---> Evaluate against ML anomaly model
        +---> If rule matches:
        |     - Create alert record
        |     - Send to PagerDuty (critical) or Slack (warning)
        |     - Log audit: threat detected
        |
        +---> Aggregate into SIEM dashboard
```

## Audit Log Flow

```
[All Components] --> Audit events
        |
        v
  [Audit Logger]
        |
        +---> Marshal event as JSON
        +---> Hash previous log entry, chain to new entry
        +---> Write to PostgreSQL (immutable table)
        +---> Stream to SIEM
        +---> Every 24h: generate Merkle root, store in Vault
```

## Error Handling

| Failure Point | Handling Strategy |
|---|---|
| Vault unavailable | Suraksha returns cached secrets (TTL: 5 min). Alert PagerDuty. |
| PostgreSQL unavailable | AuthZ falls back to cached decisions. AuthN cache still works. Alert PagerDuty. |
| Redis unavailable | AuthZ cache miss; direct PostgreSQL queries (slower). Token replay detection degraded. |
| JWT key compromise | Emergency key rotation: add new key, revoke compromised key, blacklist all tokens signed by it. |
| Certificate renewal failure | Retry hourly. Alert Security Team after 3 failures. Manual fallback procedure. |
