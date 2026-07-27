# 20 â€” Testing Strategy

**Version:** 2.0.0 | **Owner:** Security | **Last Updated:** 2026-07-24

---

## Test Layers

| Layer | Coverage | Tools |
|---|---|---|
| Unit Tests | 85% | Jest |
| Integration Tests | Service-level | Docker Compose |
| E2E Tests | Full auth flow | Custom harness |
| Security Tests | Penetration, fuzzing | OWASP ZAP, custom scripts |
| Load Tests | Scale limits | k6 |

## Unit Tests

```bash
npm test
```

Key areas:
- JWT token generation and validation
- RBAC permission resolution (with hierarchy)
- Audit log cryptographic chaining
- Certificate expiry calculation
- Brute force detection algorithm
- Token replay detection logic

## Integration Tests

```bash
docker-compose -f docker-compose.test.yml up -d  # Vault, PG, Redis
npm run test:integration
```

Scenarios:
- Full auth flow: client credentials -> token issue -> token validation -> token refresh -> token revoke
- RBAC: create role -> assign permission -> assign role to user -> check permission -> grant -> deny
- Secret lifecycle: create secret -> rotate -> read -> verify rotation
- Certificate lifecycle: issue -> renew -> revoke

## Security Tests

```bash
npm run test:security
```

Tests:
- SQL injection on all input fields
- JWT signature tampering detection
- Token replay prevention
- Rate limiting effectiveness
- RBAC privilege escalation attempts
- Vault token exposure check
- Audit log tampering detection

## Penetration Testing (Quarterly)

External security firm performs:
- API penetration testing
- JWT attack vectors (alg=none, key confusion)
- RBAC bypass attempts
- Timing attacks on auth endpoints
- Vault API security assessment

## CI/CD Pipeline

```
PR -> Lint -> Unit Tests -> Integration Tests -> Security Scan -> Build -> E2E -> Deploy
```
