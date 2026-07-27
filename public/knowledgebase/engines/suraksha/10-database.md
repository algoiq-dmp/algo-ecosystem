# 10 â€” Database Schema & Storage

**Version:** 2.0.0 | **Owner:** Security | **Last Updated:** 2026-07-24

---

## Storage Architecture

Suraksha uses PostgreSQL for durable RBAC and audit storage, Redis for performance-cache and token blacklisting, and HashiCorp Vault for secrets.

---

## PostgreSQL Schema

### roles

```sql
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(64) UNIQUE NOT NULL,
    description TEXT,
    parent_role_id UUID REFERENCES roles(id),
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### permissions

```sql
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource VARCHAR(128) NOT NULL,
    action VARCHAR(32) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (resource, action)
);
```

### role_permissions

```sql
CREATE TABLE role_permissions (
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (role_id, permission_id)
);
```

### user_roles

```sql
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(128) NOT NULL,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    granted_by VARCHAR(64),
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    UNIQUE (user_id, role_id)
);
```

### audit_log

```sql
CREATE TABLE audit_log (
    id BIGSERIAL PRIMARY KEY,
    event_type VARCHAR(32) NOT NULL,
    actor VARCHAR(128) NOT NULL,
    resource_type VARCHAR(32),
    resource_id VARCHAR(128),
    action VARCHAR(32),
    decision VARCHAR(8),
    ip_address INET,
    user_agent VARCHAR(256),
    details JSONB,
    prev_hash VARCHAR(64),
    hash VARCHAR(64),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_actor ON audit_log (actor, created_at DESC);
CREATE INDEX idx_audit_event_type ON audit_log (event_type, created_at DESC);
CREATE INDEX idx_audit_created ON audit_log (created_at DESC);
```

### certificates

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
```

### compliance_reports

```sql
CREATE TABLE compliance_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    framework VARCHAR(32) NOT NULL,
    report_type VARCHAR(32),
    generated_by VARCHAR(64),
    report_data JSONB,
    generated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Redis Schema

| Key Pattern | Type | TTL | Purpose |
|---|---|---|---|
| `suraksha:jti:{jti}` | String | Token expiry | Replay detection blacklist |
| `suraksha:authz:{user}:{res}:{act}` | String | 60s | Authorization decision cache |
| `suraksha:user_roles:{user}` | Set | 300s | Cached user role list |
| `suraksha:rate:{ip}:{endpoint}` | Counter | 60s | Rate limiter window |
| `suraksha:threat:{ip}:failed_auth` | Counter | 60s | Brute force detection |
| `suraksha:secret_cache:{service}` | Hash | 300s | Cached secrets (encrypted) |

## Vault Structure

```
secret/
  suraksha/
    jwt-signing-key          # Current JWT RS256 private key
    jwt-signing-key-prev     # Previous key (during rotation)
    master-encryption-key    # AES-256 root encryption key

  services/
    ganesh/
      redis-password
      pg-password
      mq-password
      tls-key
      tls-cert
    lakshmi/
      ...
    narad/
      ...

  certs/
    ganesh.algoiq.io/
      cert.pem
      key.pem
      chain.pem
    narad.algoiq.io/
      ...
```

## Data Retention

| Data | Retention |
|---|---|
| Audit logs | 7 years (immutable) |
| RBAC data | Indefinite |
| Certificate records | 7 years |
| Token blacklist | Token TTL duration |
| Rate limit counters | 60 seconds |
| Compliance reports | 7 years |
