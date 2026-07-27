# 14 â€” Health & Monitoring

**Version:** 2.0.0 | **Owner:** Security | **Last Updated:** 2026-07-24

---

## Health Endpoint

```
GET /api/v1/health
```

```json
{
  "status": "healthy",
  "version": "2.0.0",
  "uptime": 6543210,
  "components": {
    "vault": "connected",
    "postgresql": "connected",
    "redis": "connected",
    "cert_manager": "ok"
  }
}
```

## Prometheus Metrics

| Metric | Type | Description |
|---|---|---|
| `suraksha_token_issued_total` | Counter | Total JWT tokens issued |
| `suraksha_token_validated_total` | Counter | Total token validations |
| `suraksha_token_revoked_total` | Counter | Total tokens revoked |
| `suraksha_authz_checks_total` | Counter | Total authorization checks |
| `suraksha_authz_denied_total` | Counter | Authorization denials |
| `suraksha_authz_cache_hit_ratio` | Gauge | RBAC cache hit ratio |
| `suraksha_authz_latency_ms` | Histogram | Authorization check latency |
| `suraksha_vault_read_total` | Counter | Vault secret reads |
| `suraksha_vault_read_latency_ms` | Histogram | Vault read latency |
| `suraksha_certs_active` | Gauge | Active certificates count |
| `suraksha_certs_expiring_30d` | Gauge | Certs expiring within 30 days |
| `suraksha_threats_detected_total` | Counter | Threat alerts generated |
| `suraksha_brute_force_blocks` | Counter | Brute force IP blocks |
| `suraksha_api_latency_ms` | Histogram | API request latency |
| `suraksha_api_errors_total` | Counter | API errors by status code |

## Alerting Rules

| Alert | Condition | Severity |
|---|---|---|
| VaultDisconnected | Vault health check fails | Critical |
| JWTKeyExpiring | Key age > 80 days (rotate quarterly) | Warning |
| CertExpiringSoon | Any cert valid_until < 7 days | Critical |
| HighAuthDenialRate | AuthZ denial > 10% for 5 min | Warning |
| BruteForceDetected | `suraksha_brute_force_blocks` > 0 | Critical |
| TokenReplayDetected | Token replay detection triggered | Critical |
| HighAuthZLatency | AuthZ p99 > 5ms for 5 min | Warning |
| AuditLogGapDetected | Missing audit log entries | Critical |

## SIEM Dashboard

The Security Monitoring dashboard provides:
- **Real-time auth event stream**: All logins, token issues, authZ decisions.
- **Threat map**: Geographic and IP-based attack visualization.
- **RBAC overview**: Role assignments, permission changes, access review status.
- **Certificate expiry timeline**: Visual countdown for all certificates.
- **Secret access log**: Who accessed which secrets and when.
- **Brute force tracker**: IPs currently blocked, historical patterns.
