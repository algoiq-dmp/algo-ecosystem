# 17 — Suraksha Integration

> **Version:** v2.5.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## Overview

The WebSocket server integrates with **Suraksha** for JWT authentication, authorization policy enforcement, and TLS certificate management. The server does NOT handle any encryption keys or store credentials — all security operations are delegated to Suraksha.

## Integration Points

### 1. JWT Verification

```
Client JWT → WS Server → Suraksha JWKS endpoint
                              │
                              │ Fetch public keys (JWKS)
                              │ Verify signature (RS256/ES256)
                              │ Validate claims (iss, aud, exp)
                              │
                              ▼
                         Authenticated principal
```

JWKS is cached in memory and refreshed every 60 minutes. The server uses the `jose` library for JWT operations.

### 2. Authorization Policy Check

```
Subscribe Request → WS Server → Suraksha IAM (gRPC)
                                    │
                                    │ CheckPermission(client_id, topic)
                                    │ Response: ALLOWED / DENIED
                                    │
                                    ▼
                              Cached for 5 minutes
```

Authorization is checked on every subscribe request with a local LRU cache to minimize IAM calls.

### 3. TLS Certificate Management

Server TLS certificates are provisioned by Suraksha Vault:
- Certificate and key files at `/etc/lakshmi/certs/ws-server.{crt,key}`
- Auto-renewed by Vault agent 24 hours before expiry
- Server gracefully reloads certificates without dropping connections

### 4. Permission Change Events

Suraksha IAM can push permission revocation events. The WS server subscribes to these:
- On receiving a revocation for a client, all subscriptions for that client are terminated
- Connection is closed with close code 4003 (Forbidden)

```yaml
suraksha:
  jwks_uri: "https://suraksha-iam.internal/.well-known/jwks.json"
  jwks_refresh_interval_sec: 3600
  iam_endpoint: "suraksha-iam.internal:50071"
  permission_cache_ttl_sec: 300
  permission_revocation_topic: "suraksha.iam.revocations"
  tls:
    cert_file: "/etc/lakshmi/certs/ws-server.crt"
    key_file: "/etc/lakshmi/certs/ws-server.key"
    ca_file: "/etc/lakshmi/certs/ca.crt"
```

## Failure Handling

| Scenario | Behavior |
|----------|----------|
| JWKS endpoint unreachable during startup | Server fails to start |
| JWKS refresh fails | Continue with cached keys; alert via Narad |
| IAM unreachable during authorization | Use cached permissions; alert if > 5 minutes |
| TLS certificate expired | Server fails `SIGUSR2` reload; continues serving with old cert |

## Audit Events Sent to Suraksha

| Event | Content |
|-------|---------|
| Connection Authenticated | client_id, source_ip, timestamp |
| Connection Auth Failed | client_id (if known), reason, source_ip |
| Subscription Requested | client_id, topics |
| Permission Denied | client_id, topic, reason |
