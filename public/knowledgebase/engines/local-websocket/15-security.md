# 15 — Security

> **Version:** v2.5.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## Security Architecture

The WebSocket server implements a layered security model with TLS encryption, JWT-based authentication, fine-grained topic authorization, and comprehensive audit logging.

## Network Security

- **TLS 1.3:** All production WebSocket connections use WSS (WebSocket over TLS).
- **CORS enforcement:** Only configured origins may establish WebSocket connections (checked during HTTP upgrade).
- **No public internet:** Production WebSocket servers are on internal VLANs. External access is through VPN only.
- **Rate limiting:** Per-IP connection rate limiting at HAProxy layer (max 50 connections/sec per source IP).

## Authentication

### JWT Validation Flow

```
1. Client obtains JWT from Suraksha IAM (via login or machine identity)
2. Client includes JWT in Authorization header during WebSocket upgrade
3. Server validates JWT:
   a. Signature verification using JWKS from Suraksha
   b. Expiration check (clock tolerance: 30 seconds)
   c. Issuer check (must be suraksha-iam.internal)
   d. Audience check (must include "lakshmi-ws")
4. Server extracts claims: sub, client_id, permissions
5. If invalid → connection closed with 4001 (Unauthorized)
```

### JWT Claims Structure

```json
{
  "sub": "user-darshan",
  "client_id": "dashboard-prod-01",
  "iss": "suraksha-iam.internal",
  "aud": ["lakshmi-ws"],
  "iat": 1721888100,
  "exp": 1721891700,
  "permissions": [
    "read:feed.NSE.CM.*",
    "read:feed.BSE.CM.*",
    "read:orders.*"
  ]
}
```

## Authorization

### Topic-Level Access Control

After authentication, every subscribe request is checked against the client's permissions:
- Permission format: `read:<topic_pattern>`
- Wildcards: `*` matches any single segment, `**` matches recursively
- Example: `read:feed.NSE.*` grants access to `feed.NSE.CM`, `feed.NSE.FO`, etc.
- Authorization cache: LRU cache with 5-minute TTL to avoid IAM calls on every subscribe

### Permission Cache

```javascript
// Cached for 5 minutes, invalidated on permission change events from IAM
const permissionCache = new LRUCache({
  max: 1000,
  ttl: 300000,
});
```

## WebSocket-Specific Security

### Frame Validation
- Max frame size: 1 MB (rejects larger frames with 1009 - Message Too Big)
- Max message size (assembled): 1 MB
- Close codes used:
  - 4001: Unauthorized (JWT invalid/expired)
  - 4003: Forbidden (no permission for topic)
  - 4008: Rate limited
  - 1011: Internal server error

### Connection Security
- Ping/pong: server sends ping every 30 seconds; expects pong within 90 seconds
- Idle timeout: connections with no activity for 5 minutes are closed
- Max connections per IP: 5 (configurable)

## Data Protection

- **No message persistence:** The WebSocket server does not store any market data or order information
- **Logging:** Messages are NOT logged by default. Debug logging can be enabled temporarily for troubleshooting (requires `log_level: debug` and contains redacted payload)
- **Memory:** All in-memory state (subscriptions, connection info) is cleared on graceful shutdown

## Security Headers (HTTP Upgrade)

When clients connect via HTTPS upgrade:
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Content-Security-Policy: default-src 'self'
```

## Vulnerability Management

| Practice | Cadence |
|----------|---------|
| npm audit | Per CI build |
| Snyk dependency scan | Per CI build |
| Node.js security releases | Within 7 days of release |
| JWT library updates | Within 30 days |
| Penetration testing | Quarterly |
