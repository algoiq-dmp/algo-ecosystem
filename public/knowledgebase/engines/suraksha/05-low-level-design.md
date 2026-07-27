# 05 â€” Low-Level Design

**Version:** 2.0.0 | **Owner:** Security | **Last Updated:** 2026-07-24

---

## JWT Token Structure

```json
{
  "header": {
    "alg": "RS256",
    "typ": "JWT",
    "kid": "suraksha-key-2026-07"
  },
  "payload": {
    "iss": "suraksha.algoiq.io",
    "sub": "service:ganesh",
    "aud": ["ganesh", "lakshmi"],
    "exp": 1721809800,
    "iat": 1721808900,
    "jti": "unique-token-id-abc123",
    "roles": ["ganesh.consumer.read", "ganesh.monitor"],
    "permissions": ["ohlc:read", "health:read"]
  }
}
```

## RBAC Model

### Database Schema

```sql
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(64) UNIQUE NOT NULL,
    description TEXT,
    parent_role_id UUID REFERENCES roles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource VARCHAR(128) NOT NULL,
    action VARCHAR(32) NOT NULL,
    description TEXT,
    UNIQUE (resource, action)
);

CREATE TABLE role_permissions (
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE user_roles (
    user_id VARCHAR(128) NOT NULL,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    granted_by VARCHAR(64),
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    PRIMARY KEY (user_id, role_id)
);
```

### Authorization Check Flow

```
1. Extract JWT from request.
2. Validate JWT signature and expiry.
3. Extract user/service identity from `sub` claim.
4. Extract requested resource and action from request context.
5. Resolve required permission: "{resource}:{action}" (e.g., "ohlc:read").
6. Check Redis cache for authorization result:
   Key: "authz:{user_id}:{permission}"
   HIT: Return cached decision.
   MISS: Query PostgreSQL for user's roles and role permissions.
        - Walk role hierarchy (parent roles inherit child permissions).
        - If any role grants the required permission, ALLOW.
        - Otherwise, DENY.
7. Cache result in Redis (TTL: 60 seconds).
8. Log audit: { user, resource, action, decision, timestamp }.
```

## Vault Integration

```json
{
  "vault": {
    "address": "https://vault.algoiq.io:8200",
    "engine": "kv-v2",
    "secrets": {
      "ganesh": {
        "path": "secret/ganesh",
        "keys": ["jwt-public-key", "redis-password", "pg-password", "mq-password", "tls-key", "tls-cert"],
        "rotation_schedule": {
          "redis-password": "30d",
          "pg-password": "30d",
          "mq-password": "30d",
          "jwt-public-key": "90d",
          "tls-key": "365d",
          "tls-cert": "90d"
        }
      }
    }
  }
}
```

## Certificate Manager

```sql
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain VARCHAR(256) NOT NULL,
    issuer VARCHAR(64) DEFAULT 'LetsEncrypt',
    serial_number VARCHAR(128),
    valid_from TIMESTAMPTZ,
    valid_until TIMESTAMPTZ,
    status VARCHAR(16) DEFAULT 'ACTIVE',
    auto_renew BOOLEAN DEFAULT TRUE,
    service_name VARCHAR(64),
    last_renewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_certs_expiry ON certificates (valid_until) WHERE status = 'ACTIVE';
```

### ACME Renewal Flow

1. Daily cron: `SELECT * FROM certificates WHERE valid_until < NOW() + INTERVAL '30 days' AND auto_renew = TRUE`.
2. For each expiring cert, initiate ACME challenge with CA.
3. Complete DNS-01 or HTTP-01 challenge.
4. Download new certificate, store in Vault.
5. Update certificate record with new validity dates.
6. Notify affected service via Narad to reload certificate.
7. If renewal fails, alert Security Team via PagerDuty.

## Threat Detection Rules

| Rule ID | Description | Threshold |
|---|---|---|
| `BRUTE_FORCE_AUTH` | > 10 failed auth attempts from same IP in 1 min | 10/min |
| `TOKEN_REPLAY` | Same `jti` claim used more than once | Any |
| `PRIVILEGE_ESCALATION` | User attempts action outside their role permissions | 3 in 5 min |
| `UNUSUAL_ACCESS_TIME` | Access outside normal hours for the user | Any (configurable) |
| `API_ABUSE` | > 1000 requests from single token in 1 min | 1000/min |
| `SECRET_ACCESS_SPIKE` | > 50 Vault reads in 1 min by single service | 50/min |

## API Routes

| Method | Path | Description |
|---|---|---|
| POST | `/api/v1/auth/token` | Issue JWT token |
| POST | `/api/v1/auth/token/refresh` | Refresh JWT token |
| POST | `/api/v1/auth/token/revoke` | Revoke JWT token |
| POST | `/api/v1/auth/validate` | Validate JWT token |
| GET | `/api/v1/authz/check` | Check permission |
| POST | `/api/v1/roles` | Create role |
| GET | `/api/v1/roles` | List roles |
| POST | `/api/v1/roles/:id/permissions` | Assign permissions to role |
| POST | `/api/v1/users/:id/roles` | Assign roles to user |
| GET | `/api/v1/secrets/:service` | Get service secrets |
| GET | `/api/v1/certs` | List certificates |
| POST | `/api/v1/certs/issue` | Issue new certificate |
| GET | `/api/v1/audit` | Query audit log |
| GET | `/api/v1/health` | Health check |
