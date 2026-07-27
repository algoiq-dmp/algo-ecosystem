# 09 â€” API Reference

**Version:** 2.0.0 | **Owner:** Security | **Last Updated:** 2026-07-24

---

## Base URL

```
Production:  https://suraksha.algoiq.io/api/v1
Staging:     https://suraksha-staging.algoiq.io/api/v1
Local:       http://localhost:3004/api/v1
```

## Authentication

### Issue Token

```
POST /auth/token
```

```json
{
  "grant_type": "client_credentials",
  "client_id": "ganesh",
  "client_secret": "<client-secret-from-vault>",
  "audience": "ganesh"
}
```

Response:

```json
{
  "access_token": "eyJhbGciOi...",
  "refresh_token": "eyJhbGciOi...",
  "token_type": "Bearer",
  "expires_in": 900
}
```

### Refresh Token

```
POST /auth/token/refresh
```

### Validate Token

```
POST /auth/validate
```

```json
{
  "token": "eyJhbGciOi..."
}
```

Response: `{ "valid": true, "sub": "service:ganesh", "exp": 1721809800 }`

### Revoke Token

```
POST /auth/token/revoke
```

Adds token's `jti` to Redis blacklist.

## Authorization

### Check Permission

```
GET /authz/check?user_id=service:ganesh&resource=ohlc&action=read
```

Response: `{ "allowed": true, "matched_role": "ganesh.consumer.read", "cached": false }`

## Role Management

### Create Role

```
POST /roles
```

```json
{
  "name": "ganesh.consumer.read",
  "description": "Read OHLC bars from Ganesh API",
  "parent_role": "ecosystem.consumer"
}
```

### Assign Permission to Role

```
POST /roles/{roleId}/permissions
```

```json
{
  "resource": "ohlc",
  "action": "read"
}
```

### Assign Role to User

```
POST /users/{userId}/roles
```

```json
{
  "role_name": "ganesh.consumer.read",
  "expires_at": "2026-12-31T23:59:59Z"
}
```

## Secrets

### Get Service Secrets

```
GET /secrets/ganesh
```

Response: `{ "redis_password": "***", "pg_password": "***", ... }`

## Certificates

### List All Certificates

```
GET /certs
```

### Issue New Certificate

```
POST /certs/issue
```

```json
{
  "domain": "ganesh.algoiq.io",
  "provider": "letsencrypt",
  "challenge_type": "dns-01"
}
```

## Health

### Health Check

```
GET /health
```

```json
{
  "status": "healthy",
  "version": "2.0.0",
  "uptime": 6543210,
  "components": {
    "vault": "connected",
    "postgresql": "connected",
    "redis": "connected"
  }
}
```

## Error Responses

| HTTP Status | Code | Description |
|---|---|---|
| 400 | `INVALID_GRANT` | Bad authentication request |
| 401 | `UNAUTHORIZED` | Invalid or expired credentials |
| 403 | `FORBIDDEN` | Insufficient permissions |
| 404 | `ROLE_NOT_FOUND` | Role does not exist |
| 409 | `ROLE_EXISTS` | Role name already taken |
| 429 | `RATE_LIMITED` | Too many auth attempts |
| 500 | `VAULT_ERROR` | Vault communication failure |
