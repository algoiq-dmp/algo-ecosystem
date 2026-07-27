# TalkStrategy App - Suraksha Integration

**Version:** 2.5.0 | **Owner:** Frontend | **Last Updated:** 2026-07-25


## Overview

Suraksha is the centralized security platform providing identity management, secrets storage, certificate authority, and audit pipeline for the Algo IQ ecosystem.

## Integration Components

### Identity & Access Management (IAM)
The engine registers as a service principal in Suraksha IAM. All API requests are authenticated via JWT tokens issued by the Suraksha token endpoint. RBAC policies define which roles can access which engine endpoints.

### Secrets Management (Vault)
Sensitive configuration values are stored in Suraksha Vault:
- Database credentials
- API keys for external services
- Encryption keys
- MQ connection credentials

The engine authenticates to Vault using AppRole with periodic token renewal. Secrets are fetched at startup and cached with automatic refresh on expiry.

### Certificate Management (CA)
mTLS certificates for inter-service communication are issued by the Suraksha internal CA. The engine's certificate is automatically provisioned at deployment and renewed 7 days before expiry.

### Audit Pipeline
The engine streams security-relevant events to the Suraksha audit pipeline via gRPC:
- Authentication events
- Authorization decisions
- Configuration changes
- Data access events
- Error events

## Configuration

```toml
[suraksha]
iam_url = "https://suraksha.internal/iam"
vault_url = "https://suraksha.internal/vault"
audit_url = "grpc://suraksha.internal:9090"
service_id = "aalap-calls"
role_id = ""
secret_id = ""
token_refresh_seconds = 3600
```

## Authentication Flow

1. Engine starts and reads Suraksha AppRole credentials from environment.
2. Authenticates to Suraksha IAM and receives a short-lived JWT.
3. JWT is used to authenticate to Suraksha Vault to fetch secrets.
4. JWT is automatically refreshed before expiry.
5. All subsequent API calls are validated against the JWT.

## Failure Modes

| Scenario | Behavior | Recovery |
|----------|----------|----------|
| IAM unreachable at startup | Engine fails to start | Retry with backoff, max 5 min |
| Vault unreachable at startup | Use cached secrets from disk | Alert, retry every 30s |
| Token expiry during operation | Refresh token, retry API call | Automatic |
| CA certificate near expiry | Auto-renew 7 days before | Automatic |
| Audit pipeline disconnected | Buffer events, retry send | Up to 10K events buffered |

