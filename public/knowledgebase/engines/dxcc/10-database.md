# DXCC — Database Schema

> **Version:** 2.0.0 | **Status:** Draft | **Owner:** DXCC Team | **Last Updated:** 2026-07-24

---

## PostgreSQL Tables

### users

Stores all DXCC user accounts.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | Unique user identifier |
| username | VARCHAR(64) | UNIQUE, NOT NULL | Login username |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email address for notifications |
| display_name | VARCHAR(128) | NOT NULL | Full name for display |
| password_hash | VARCHAR(256) | NOT NULL | bcrypt-hashed password |
| role_id | UUID | FK -> roles.id | Assigned RBAC role |
| mfa_enabled | BOOLEAN | DEFAULT false | Whether MFA is enforced |
| mfa_secret | VARCHAR(64) | NULLABLE | TOTP secret key |
| sso_provider | VARCHAR(32) | NULLABLE | External SSO provider ID |
| is_active | BOOLEAN | DEFAULT true | Account enabled/disabled |
| last_login_at | TIMESTAMPTZ | NULLABLE | Last successful login |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Account creation |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Last update |

---

### roles

Defines RBAC roles with granular permissions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Role identifier |
| name | VARCHAR(32) | UNIQUE, NOT NULL | Role name (admin, trader, quant, auditor, viewer) |
| description | VARCHAR(256) | | Human-readable description |
| permissions | JSONB | NOT NULL | Permission array: `[{"action":"*","resource":"*"}]` |
| is_system | BOOLEAN | DEFAULT false | Whether this is a built-in role |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

**Built-in Roles:**

| Role | Key Permissions |
|------|----------------|
| Admin | `*.*` — Full platform access |
| Trader | `strategy.*`, `order.*`, `market.*`, `portfolio.*`, `risk.read` |
| Quant | `strategy.read`, `analytics.*`, `ai-ops.*`, `intelligence.*`, `tools.*` |
| Auditor | `audit.*`, `user.read`, `config.read`, `export.*` |
| Viewer | `*.read` — Read-only access to all non-sensitive modules |

---

### permissions

Granular permission definitions (used by OPA policy engine).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| action | VARCHAR(64) | NOT NULL | Action (create, read, update, delete, deploy, etc.) |
| resource | VARCHAR(128) | NOT NULL | Resource path (strategies, orders, risk.rules, etc.) |
| description | VARCHAR(256) | | |
| UNIQUE(action, resource) | | | |

---

### dashboards

Stores per-user dashboard layout configurations.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| user_id | UUID | FK -> users.id, NOT NULL | Owner |
| name | VARCHAR(64) | DEFAULT 'Default' | Dashboard name |
| layout | JSONB | NOT NULL | Widget positions and configurations |
| is_default | BOOLEAN | DEFAULT true | Load this dashboard on login |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

**Layout JSONB Structure:**

```json
{
  "version": 2,
  "widgets": [
    {
      "id": "widget-001",
      "type": "system-health",
      "position": { "x": 0, "y": 0, "w": 6, "h": 4 },
      "config": { "showEngines": ["ganesh", "suchak", "vega"] }
    }
  ]
}
```

---

### user_preferences

Per-user customization settings.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| user_id | UUID | PK, FK -> users.id | |
| theme | VARCHAR(16) | DEFAULT 'dark' | dark, light, high-contrast |
| font_size | VARCHAR(8) | DEFAULT 'medium' | small, medium, large |
| default_view | VARCHAR(64) | DEFAULT 'executive-dashboard' | Module loaded on login |
| notification_channels | JSONB | DEFAULT '{}' | Per-severity channel preferences |
| quiet_hours | JSONB | NULLABLE | Suppress notifications during window |
| timezone | VARCHAR(64) | DEFAULT 'Asia/Kolkata' | IANA timezone |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

---

### audit_log (metadata reference)

Audit records are primarily stored in Elasticsearch via Chitragupta, but metadata and integrity hashes are mirrored in PostgreSQL.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | |
| event_time | TIMESTAMPTZ | NOT NULL | When event occurred |
| actor | VARCHAR(128) | NOT NULL | Username or engine name |
| action | VARCHAR(128) | NOT NULL | Action performed |
| resource_type | VARCHAR(64) | NOT NULL | Type of resource |
| resource_id | VARCHAR(128) | NOT NULL | Resource identifier |
| status | VARCHAR(16) | NOT NULL | success, failure, denied |
| merkle_hash | VARCHAR(256) | NOT NULL | Merkle tree node hash |
| prev_hash | VARCHAR(256) | NOT NULL | Previous node hash (chain) |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |

**Indexes:**
- `idx_audit_event_time` on `event_time DESC`
- `idx_audit_actor` on `actor`
- `idx_audit_action` on `action`

---

## Redis Data Structures

| Key Pattern | Type | TTL | Purpose |
|-------------|------|-----|---------|
| `session:{sessionId}` | Hash | 30 min idle | User session data (JWT, role, permissions) |
| `ws:connection:{userId}` | String (sessionId) | Session TTL | Active WebSocket connection mapping |
| `widget:cache:{widgetType}:{params}` | String (JSON) | 10s - 60s | Widget data cache for REST fallback |
| `rate:{userId}:{endpoint}` | Sorted Set | 1 min window | Rate limiting counters |
| `narad:buffer:{topic}` | List | 5 min | Recent Narad message buffer for late subscribers |
| `health:heartbeat:{engineId}` | String (timestamp) | 30s | Last engine heartbeat timestamp |
| `lock:{resource}:{id}` | String | 10s | Distributed lock for critical operations |

---

## Data Retention Policy

| Storage | Hot (Active) | Warm (Searchable) | Cold (Archive) |
|---------|-------------|-------------------|----------------|
| PostgreSQL | 30 days | 90 days | 1 year (compressed dump) |
| Redis | In-memory + AOF | N/A | N/A (volatile) |
| Elasticsearch (Audit) | 90 days | 3 years | 10 years (frozen tier) |

---

## Backup Strategy

| Database | Frequency | Type | Retention |
|----------|-----------|------|-----------|
| PostgreSQL | Daily 02:00 IST | Full pg_dump | 30 days |
| PostgreSQL | Hourly | WAL archiving | 7 days |
| Redis | Daily 02:30 IST | RDB snapshot | 7 days |
| Elasticsearch | Daily 03:00 IST | Snapshot repository | 30 days |

---

## Migrations

Database schema changes are managed through Go migrations using the `golang-migrate` library:

```
dxcc/migrations/
  001_create_users.up.sql
  001_create_users.down.sql
  002_create_roles.up.sql
  002_create_roles.down.sql
  003_create_dashboards.up.sql
  003_create_dashboards.down.sql
  ...
```

Migrations run automatically on server startup in development; in production they require explicit execution via CLI or CI/CD pipeline.

---

> **Next:** See [11-configuration.md](11-configuration.md) for configuration and customization options.
