# 24 â€” Contributing Guidelines

**Version:** 2.0.0 | **Owner:** Security | **Last Updated:** 2026-07-24

---

## Welcome

Suraksha is the security foundation of the ecosystem. Contributions are carefully reviewed for security implications.

## Who Can Contribute

| Role | Scope |
|---|---|
| **Security Team** | Full codebase, architecture |
| **Infrastructure Team** | Deployment, monitoring integration |
| **Ecosystem Engineers** | SDKs, integration docs |
| **External Security Researchers** | Vulnerability reports (via responsible disclosure) |

## Development Setup

```bash
git clone https://github.com/algo-iq/suraksha.git
cd suraksha
npm install
npm run dev
```

## Branching Strategy

```
main -> develop -> feature/* | fix/* | security/*
```

## Pull Request Process

1. Branch from `develop`.
2. Follow ESLint rules with security-specific rules enabled.
3. Write tests for new code (85% coverage target).
4. Security review required for any auth/authZ/crypto changes.
5. Include threat model analysis for significant changes.

## Commit Convention

```
<type>(<scope>): <description>
```

**Examples**:
```
feat(rbac): add role hierarchy with inherited permissions
fix(jwt): enforce kid header validation to prevent key confusion
security(audit): implement cryptographic audit chain
```

## Security Review Checklist

All PRs touching authentication, authorization, or encryption MUST pass:

- [ ] No hardcoded secrets or keys.
- [ ] All crypto uses approved algorithms (AES-256-GCM, RSA 2048+, ECDSA P-256).
- [ ] JWT validation checks: signature, exp, iss, aud, alg.
- [ ] RBAC changes do not create privilege escalation paths.
- [ ] All user input is validated and sanitized.
- [ ] Audit log entries are generated for all security events.
- [ ] Error messages do not leak sensitive information.

## Prohibited Practices

- **NEVER** commit credentials, keys, or tokens.
- **NEVER** disable TLS or certificate validation.
- **NEVER** use weak crypto (MD5, SHA-1, DES, RC4).
- **NEVER** log secrets, tokens, or passwords.
- **NEVER** bypass the RBAC engine.
- **NEVER** push directly to `main`.

## Responsible Disclosure

If you discover a security vulnerability, email security@algoiq.io. Do NOT open a public issue. Response within 4 hours for critical issues.

## Getting Help

- **Questions**: Slack #suraksha-dev
- **Security reviews**: Request via Security Team calendar
- **Onboarding**: See `docs/onboarding.md`
