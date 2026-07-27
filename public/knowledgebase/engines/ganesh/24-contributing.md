# 24 â€” Contributing Guidelines

**Version:** 3.2.1 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24

---

## Welcome

Thank you for your interest in contributing to Ganesh. This document outlines the contribution workflow, coding standards, and review process.

## Who Can Contribute

| Role | Contribution Scope |
|---|---|
| **Data Engineering Team** | Full codebase, architecture decisions |
| **Infrastructure Team (Narad)** | Health probes, monitoring integration |
| **Security Team (Suraksha)** | Auth integration, security review |
| **Ecosystem Engineers** | API client improvements, documentation |
| **External Contributors** | Bug fixes, documentation, tests |

## Development Setup

### Prerequisites

- Node.js 20.x LTS
- Redis 7.x
- PostgreSQL 15.x with TimescaleDB
- RabbitMQ 3.12.x
- Docker (for integration tests)

### Local Development

```bash
git clone https://github.com/algo-iq/ganesh.git
cd ganesh
npm install
npm run dev
```

### Running Tests

```bash
npm test                 # Unit tests
npm run test:integration # Requires Docker
npm run test:e2e         # Requires full test stack
npm run test:perf        # Requires k6
```

## Branching Strategy

```
main          â€” Production code (protected)
  +- develop  â€” Integration branch
       +- feature/*   â€” New features
       +- fix/*       â€” Bug fixes
       +- perf/*      â€” Performance improvements
       +- docs/*      â€” Documentation changes
```

## Pull Request Process

### 1. Before You Start

- Check existing issues and PRs to avoid duplication.
- For significant changes, open a design discussion issue first.
- Ensure your branch is up to date with `develop`.

### 2. Development

- Follow the existing code style (enforced by ESLint).
- Write tests for new functionality.
- Update documentation for API changes.
- Ensure all existing tests pass.

### 3. Commit Messages

```
<type>(<scope>): <description>
```

**Types**: `feat`, `fix`, `perf`, `refactor`, `test`, `docs`, `chore`

**Examples**:
```
feat(aggregator): add 15-minute bar alignment support
fix(api): handle null close price in range queries
perf(redis): pipeline bar writes for 3x throughput improvement
docs(readme): update installation guide for Ubuntu 22.04
```

### 4. Code Review

All PRs require at least one approval from a Data Engineering team member. Reviewers check:

| Aspect | Criteria |
|---|---|
| Correctness | Logic is sound, edge cases handled |
| Performance | No regression, efficient algorithms |
| Tests | Adequate coverage for new/changed code |
| Style | Follows ESLint rules and conventions |
| Security | No credential leaks, Suraksha-compliant |
| Documentation | API changes documented, README updated |

### 5. CI Checks

Your PR must pass:
- [ ] ESLint (zero errors)
- [ ] Unit tests (coverage >= 80%)
- [ ] Integration tests
- [ ] E2E tests
- [ ] Performance smoke test (no >5% regression)

### 6. Merge

Once approved and CI passes, the PR is squash-merged to keep a clean history.

## Coding Standards

### Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Files | kebab-case | `bar-aggregator.js` |
| Classes | PascalCase | `BarAggregator` |
| Functions | camelCase | `getLatestBar()` |
| Constants | UPPER_SNAKE | `MAX_RING_BUFFER_SIZE` |
| Variables | camelCase | `barBuffer` |

### Prohibited Practices

- **Never** commit credentials, API keys, or secrets.
- **Never** use `eval()` or `new Function()`.
- **Never** use string concatenation for SQL queries (use parameterized queries).
- **Never** block the event loop (use async I/O).
- **Never** push directly to `main` or `develop`.

## Getting Help

- **Questions**: Slack #ganesh-dev
- **Design discussions**: Jira project GANESH, type "RFC"
- **Pair programming**: Schedule via Data Engineering calendar
- **Onboarding**: See `docs/onboarding.md` for new contributor guide
