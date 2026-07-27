# 24 — Contributing Guide

**Version:** 6.3.0 | **Owner:** Execution | **Last Updated:** 2026-07-24

---

## Development Workflow

### Branch Strategy

```
main (production)
  └── develop (integration)
        ├── feature/BRQ-123-bracket-order
        ├── feature/BRQ-124-fix-enhance
        ├── bugfix/ISSUE-456-race-condition
        └── hotfix/KILL-SWITCH-THRESHOLD
```

### Branch Naming Convention

| Type | Pattern | Example |
|---|---|---|
| Feature | `feature/BRQ-{id}-{short-desc}` | `feature/BRQ-125-order-slicing` |
| Bug Fix | `bugfix/ISSUE-{id}-{short-desc}` | `bugfix/ISSUE-789-fix-seq-reset` |
| Hotfix | `hotfix/{short-desc}` | `hotfix/ks-threshold-float` |
| Chore | `chore/{short-desc}` | `chore/update-deps-oct2026` |
| Release | `release/{version}` | `release/6.4.0` |

---

## Setting Up Development Environment

```bash
# 1. Clone and install
git clone https://github.com/algo-iq/vega.git
cd vega
npm install

# 2. Start required services via Docker
docker-compose -f docker-compose.dev.yml up -d

# 3. Initialize test database
npm run db:setup

# 4. Run tests to verify setup
npm test

# 5. Start in development mode (hot reload)
npm run dev
```

### Development Docker Compose

```yaml
# docker-compose.dev.yml
version: '3.8'
services:
  postgres:
    image: timescale/timescaledb:2.10-pg15
    ports: ["5432:5432"]
    environment:
      POSTGRES_DB: vega_dev
      POSTGRES_USER: vega_dev
      POSTGRES_PASSWORD: dev_password

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  rabbitmq:
    image: rabbitmq:3.12-management-alpine
    ports: ["5672:5672", "15672:15672"]
    environment:
      RABBITMQ_DEFAULT_VHOST: vega_dev
      RABBITMQ_DEFAULT_USER: vega_dev
      RABBITMQ_DEFAULT_PASS: dev_password

  fix-simulator:
    build: ./scripts/fix-simulator
    ports: ["19200:19200"]
```

---

## Code Standards

### JavaScript Style

- **Linter:** ESLint with `@algo-iq/eslint-config` preset
- **Formatter:** Prettier with `.prettierrc`
- **Naming:**
  - Files: kebab-case (`order-processor.js`)
  - Classes: PascalCase (`OrderProcessor`)
  - Functions/variables: camelCase (`placeOrder`, `orderId`)
  - Constants: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)
  - Private methods: prefix with `_` (`_validatePrice`)

### Project Structure

```
src/
├── api/                  # TalkStrategy API
│   ├── middleware/        # Auth, rate limiter, validation
│   ├── routes/            # Express route definitions
│   ├── controllers/       # Request handlers
│   └── index.js           # API entry point
├── app/                   # TalkStrategy App
│   ├── consumers/         # MQ consumers
│   ├── enrichment/        # Order enrichment logic
│   └── index.js
├── processor/             # Order Processor
│   ├── state-machine/     # FSM definitions
│   ├── validators/        # Pre-trade validation
│   └── index.js
├── broker/                # Broker Integration
│   ├── xts/               # XTS FIX adapter
│   ├── greeksoft/         # Greeksoft adapter
│   └── base-adapter.js    # Abstract broker adapter
├── mq/                    # MQ Bridge
│   ├── publisher.js
│   ├── consumer.js
│   └── exchange.js
├── security/              # Credential Manager
├── risk/                  # Kill Switch
├── audit/                 # Audit Logger
├── db/                    # Database layer
│   ├── models/
│   ├── migrations/
│   └── pool.js
├── config/                # Configuration loader
└── utils/                 # Shared utilities
```

---

## Pull Request Process

### Before Submitting

- [ ] All unit tests pass (`npm test`)
- [ ] Lint passes (`npm run lint`)
- [ ] New code has tests covering > 85% of lines
- [ ] Integration tests pass (if changes affect multiple components)
- [ ] No `console.log` or `debugger` statements
- [ ] API changes documented in OpenAPI spec (`docs/api-spec.yaml`)
- [ ] Database migrations included (if schema changes)
- [ ] Performance impact assessed (for changes to hot paths)

### PR Template

```markdown
## Description
[Brief description of changes]

## JIRA Ticket
BRQ-XXX

## Type
- [ ] Feature
- [ ] Bug fix
- [ ] Performance improvement
- [ ] Refactoring
- [ ] Documentation

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing steps:
  1. ...
  2. ...

## Impact Assessment
- API changes: Yes/No
- DB migrations: Yes/No
- Config changes: Yes/No
- Performance impact: [description]

## Checklist
- [ ] Code follows project style guidelines
- [ ] All tests pass locally
- [ ] No sensitive data in logs or comments
```

---

## Review Guidelines

### Reviewer Checklist

- [ ] Code logic is correct and handles edge cases
- [ ] Error handling is comprehensive (all error paths covered)
- [ ] No security vulnerabilities (injection, credential leaks, etc.)
- [ ] Performance impact acceptable for the code path
- [ ] Tests cover happy path AND error cases
- [ ] Logging is appropriate (right level, includes correlationId)
- [ ] Database queries are optimized (check `EXPLAIN ANALYZE`)
- [ ] Race conditions considered (especially in async MQ flows)
- [ ] Kill switch behavior not compromised

---

## Testing Requirements

| Change Type | Unit Tests | Integration Tests | E2E Tests |
|---|---|---|---|
| New broker adapter | Required | Required | Required |
| Order state machine change | Required | Required | Recommended |
| API endpoint change | Required | Required | Optional |
| Kill switch logic change | Required | Required | Required |
| Configuration change | Optional | Recommended | Optional |
| Documentation only | Not required | Not required | Not required |
| Bug fix | Required (regression) | Recommended | Optional |

---

## Release Process

```bash
# 1. Create release branch
git checkout develop
git pull
git checkout -b release/6.4.0

# 2. Bump version
npm version 6.4.0 --no-git-tag-version

# 3. Update CHANGELOG.md
# (document all changes since last release)

# 4. Final testing
npm run test:full

# 5. Merge to main
git checkout main
git merge --no-ff release/6.4.0
git tag -a v6.4.0 -m "Release 6.4.0"
git push origin main --tags

# 6. Deploy (handled by CI/CD)
# Pipeline triggers on tag push

# 7. Merge back to develop
git checkout develop
git merge --no-ff release/6.4.0
git push origin develop
```

---

## Code of Conduct

- Production data must never leave the production environment
- Broker credentials must never be committed to any repository
- Security vulnerabilities must be reported privately to `security@algoiq.com`, not as public issues
- All contributions are subject to code review by at least one senior engineer
- Market hours deployments require CTO approval
