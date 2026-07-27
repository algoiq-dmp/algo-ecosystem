# 24 â€” Contributing Guidelines

**Version:** 3.0.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-24

---

## Welcome

Narad is the backbone of the ecosystem. Contributions are welcome from the Infrastructure team, ecosystem engineers, and security reviewers.

## Who Can Contribute

| Role | Scope |
|---|---|
| **Infrastructure Team** | Full codebase, architecture |
| **Security Team (Suraksha)** | Auth integration, security review |
| **Ecosystem Engineers** | Agent improvements, SDKs, docs |
| **External Contributors** | Bug fixes, docs, tests |

## Development Setup

```bash
git clone https://github.com/algo-iq/narad.git
cd narad
npm install
npm run proto:compile  # Compile gRPC protobufs
npm run dev
```

### Running Tests

```bash
npm test
npm run test:integration  # Requires Docker
npm run test:e2e
```

## Branching Strategy

```
main -> develop -> feature/* | fix/* | docs/*
```

## Pull Request Process

1. Branch from `develop`.
2. Follow ESLint rules.
3. Write tests for new code.
4. Update gRPC proto files if changing agent protocol.
5. Ensure backward compatibility with existing agents.
6. Create PR against `develop`.

## Commit Convention

```
<type>(<scope>): <description>
```

**Examples**:
```
feat(registry): add product registry CRUD endpoints
fix(agent): handle gRPC stream reconnection gracefully
perf(health): reduce aggregation interval from 30s to 10s
```

## CI Checks

- [ ] ESLint (zero errors)
- [ ] Unit tests (coverage >= 80%)
- [ ] Integration tests
- [ ] gRPC proto compatibility check
- [ ] Agent backward compatibility test

## Security Considerations

- NEVER commit credentials, certificates, or API keys.
- NEVER bypass approval workflow for production commands.
- All gRPC endpoints must enforce mTLS.
- Audit log entries must be immutable.

## Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Files | kebab-case | `service-registry.js` |
| Classes | PascalCase | `ServiceRegistry` |
| Functions | camelCase | `registerService()` |
| gRPC methods | PascalCase | `ExecuteCommand` |
| Proto files | snake_case | `agent_service.proto` |
