# 24 — Contributing Guide

**Version:** 2.4.1 | **Owner:** Operations | **Last Updated:** 2026-07-24

---

## Development Workflow

### Branch Strategy

```
main (production)
  └── develop (integration)
        ├── feature/BRQ-201-mcx-exchange
        ├── feature/BRQ-202-parquet-enhancement
        ├── bugfix/ISSUE-301-validation-timeout
        └── hotfix/EXTRANET-CERT-EXPIRY
```

### Branch Naming

| Type | Pattern | Example |
|---|---|---|
| Feature | `feature/BRQ-{id}-{desc}` | `feature/BRQ-205-intraday-refresh` |
| Bug Fix | `bugfix/ISSUE-{id}-{desc}` | `bugfix/ISSUE-312-encoding-crash` |
| Hotfix | `hotfix/{desc}` | `hotfix/nse-cert-expiry` |
| Chore | `chore/{desc}` | `chore/update-node-20` |

---

## Setting Up Development Environment

```bash
# 1. Clone and install
git clone https://github.com/algo-iq/surya.git
cd surya
npm install

# 2. Start required services
docker-compose -f docker-compose.dev.yml up -d

# 3. Initialize DB and seed file types
npm run db:setup
npm run db:seed

# 4. Start mock extranet
node scripts/mock-extranet.js &

# 5. Run tests
npm test

# 6. Start dev server
npm run dev
```

---

## Code Standards

### Style Guide

- **Linter:** ESLint with `@algo-iq/eslint-config`
- **Formatter:** Prettier
- **Naming:**
  - Files: kebab-case (`file-fetcher.js`)
  - Classes: PascalCase (`ValidationEngine`)
  - Functions: camelCase (`normalizeFile`)
  - Constants: UPPER_SNAKE_CASE (`MAX_RETRY_ATTEMPTS`)

### Project Structure

```
src/
├── api/                   # Distribution API
│   ├── routes/
│   ├── controllers/
│   └── index.js
├── pipeline/              # Pipeline stages
│   ├── extranet/          # Extranet API clients
│   │   ├── nse-client.js
│   │   └── bse-client.js
│   ├── fetcher/           # File download
│   ├── validator/         # Validation engine
│   │   ├── structural.js
│   │   ├── business.js
│   │   └── cross-file.js
│   ├── normalizer/        # Data transformation
│   │   ├── column-renamer.js
│   │   ├── date-normalizer.js
│   │   ├── number-cleaner.js
│   │   └── null-standardizer.js
│   └── store/             # Version store (MinIO)
├── registry/              # File type registry
├── scheduler/             # BOD/EOD scheduler
├── watcher/               # Deadline monitor
├── audit/                 # Audit logger
├── notifications/         # Alert/notification service
├── db/
│   ├── models/
│   ├── migrations/
│   └── pool.js
└── utils/
```

---

## Adding a New File Type

1. **Register in File Type Registry:**

```sql
INSERT INTO file_types (
  file_type_code, file_type_name, exchange, schedule,
  extranet_endpoint, expected_columns, primary_keys,
  validation_rules, deadline, subscribers
) VALUES (
  'NEW_TYPE', 'New File Type', 'NSE', 'BOD',
  '/api/v2/files/new-type',
  '[{"name":"column1","type":"string","required":true}, ...]',
  ARRAY['column1'],
  '{"rowCountMin": 100, "rowCountMaxDeviationPct": 30}',
  '08:00:00',
  ARRAY['Ganesh', 'Lakshmi']
);
```

2. **Add test fixture:** `test/fixtures/nse/NEW_TYPE_valid.csv`
3. **Add unit tests** for validation and normalization
4. **Update API key scopes** for engines that need this file
5. **Test with mock extranet** before deploying to staging

---

## Pull Request Process

### Before Submitting

- [ ] All tests pass: `npm test && npm run test:integration`
- [ ] Lint passes: `npm run lint`
- [ ] New code has tests covering > 85%
- [ ] Database migrations included (if schema changes)
- [ ] File type registry changes documented
- [ ] Tested with mock extranet for realistic data

### PR Template

```markdown
## Description
[Brief description]

## JIRA Ticket
BRQ-XXX

## Type
- [ ] Feature
- [ ] Bug fix
- [ ] Performance improvement
- [ ] Documentation

## Testing
- [ ] Unit tests added
- [ ] Integration tests pass
- [ ] Tested with mock extranet
- [ ] Tested with real file fixtures

## Impact
- [ ] New file type added
- [ ] Validation rules changed
- [ ] DB migration needed
- [ ] API change
```

---

## Review Guidelines

- [ ] File type registry changes are backward-compatible
- [ ] Validation rules are appropriate (not too strict, not too loose)
- [ ] Normalizer handles edge cases (mixed encodings, unusual formats)
- [ ] Error handling covers all pipeline stages
- [ ] Test fixtures cover happy path and error cases
- [ ] No extranet credentials in code or test fixtures

---

## Release Process

```bash
# 1. Create release branch
git checkout develop && git pull
git checkout -b release/2.5.0

# 2. Bump version
npm version 2.5.0 --no-git-tag-version

# 3. Update CHANGELOG.md

# 4. Run full test suite
npm run test:full

# 5. Merge and tag
git checkout main
git merge --no-ff release/2.5.0
git tag -a v2.5.0 -m "Release 2.5.0 — MCX Exchange Support"
git push origin main --tags

# 6. Merge back
git checkout develop
git merge --no-ff release/2.5.0
git push origin develop
```

---

## Code of Conduct

- Exchange files contain market-sensitive data — handle with appropriate care
- Extranet credentials must NEVER be committed to any repository
- Test fixtures must use synthetic data, never real exchange files
- File type registry changes in production require Operations lead approval
- Deployment during BOD/EOD windows requires Operations Lead + CTO approval
- Security vulnerabilities: report to `security@algoiq.com`, not as public issues
