# TalkDelta AI — Suraksha Integration

**Version:** 1.4.0 | **Owner:** AI/ML | **Last Updated:** 2026-07-25

## Suraksha Security Integration

TalkDelta AI integrates with **Suraksha** (Security Layer) for all authentication, authorization, and audit capabilities.

## Integration Points

| Feature | Endpoint | Protocol |
|---------|----------|----------|
| Token validation | `POST /auth/verify` | REST |
| Token refresh | `POST /auth/refresh` | REST |
| Permission check | `GET /auth/permissions/{user_id}` | REST |
| Audit logging | `POST /audit/log` | REST (async) |
| Secrets retrieval | `GET /secrets/{key}` | REST (mTLS) |
| Certificate validation | `GET /certs/verify` | REST |

## Authentication Flow

```
Client → TalkDelta AI API → Suraksha /auth/verify → Validate JWT → Grant/Deny
```

1. Client includes `Authorization: Bearer <token>` header
2. TalkDelta AI extracts JWT and calls Suraksha `/auth/verify`
3. Suraksha validates token signature, expiry, and revocation status
4. Response includes user identity and role claims
5. TalkDelta AI enforces RBAC based on role claims

## Token Caching

To reduce Suraksha load:
- Valid tokens cached locally for 60 seconds (configurable)
- Cache key: `token_hash` → `user_claims`
- Cache invalidation on Suraksha revocation events
- Cache hit rate target: > 95%

## Audit Integration

Every significant operation is logged to Suraksha:

```json
{
  "audit_id": "aud-{uuid}",
  "service": "talkdelta-ai",
  "version": "1.4.0",
  "event_type": "data_access",
  "user_id": "user-123",
  "action": "GET /api/v1/analytics/RELIANCE",
  "timestamp": "2026-07-25T10:30:00+05:30",
  "result": "success",
  "metadata": {
    "processing_time_ms": 12,
    "records_returned": 50
  }
}
```

## Secret Retrieval

TalkDelta AI retrieves sensitive configuration from Suraksha Vault at startup:
- `DB_PASSWORD` — Database credentials
- `MQ_PASSWORD` — RabbitMQ credentials  
- `JWT_PUBLIC_KEY` — JWT verification key
- `API_KEYS` — Downstream service API keys

Secrets are never logged, never stored on disk, and held in memory only.

## Security Event Response

| Event | Suraksha Action | TalkDelta AI Response |
|-------|----------------|-------------------|
| Invalid token | Log + alert | 401 response |
| Expired token | Log | 401 with refresh hint |
| Permission denied | Log + alert | 403 response |
| Rate limit hit | Log | 429 with Retry-After |
| Brute force detected | Block source IP | Automatic blacklist |
| Certificate expired | Alert on-call | Graceful degradation |
