---
version: 5.0.0
owner: Margin Intelligence
last_updated: 2026-07-25
---

# 20 — Testing

## Testing Strategy

Garuda employs a **shift-left** testing approach with comprehensive automated validation at every layer. Financial-grade accuracy demands rigorous margin calculation validation against exchange-published reference values.

| Layer | Focus | Tool | Coverage Target |
|---|---|---|---|
| Unit Testing | Business logic, algorithms | xUnit + NSubstitute + FluentAssertions | >85% line |
| Integration Testing | Database, Redis, Kafka | xUnit + TestContainers | Key flows |
| Contract Testing | API contracts, Kafka schemas | Pact / Custom contract tests | All public APIs |
| E2E Testing | User workflows | Playwright | Critical paths |
| Performance Testing | Throughput, latency | k6 / BenchmarkDotNet | 15K req/sec |
| Security Testing | SAST, DAST, dependency, container | SonarQube, ZAP, Snyk, Trivy | 0 Critical |
| Exchange Validation | Margin accuracy vs exchange | Custom Parikshak harness | 100% reconciliation |

## Unit Testing

### Test Structure
```
tests/
├── Garuda.MarginEngine.Tests/
│   ├── Calculators/
│   │   ├── SpanCalculatorTests.cs
│   │   ├── ExposureCalculatorTests.cs
│   │   ├── PortfolioAggregatorTests.cs
│   │   └── HedgeOptimizerTests.cs
│   ├── Validators/
│   └── TestData/
│       ├── span_scenarios.json
│       └── portfolio_fixtures.json
```

### Key Test Cases
- `Calculate_WithSingleLongFuture_ReturnsPositiveScanningRisk`
- `Calculate_BullCallSpread_RecognizesSpreadBenefit` — Combined margin < sum of standalone
- `Calculate_WithZeroQuantity_ReturnsZeroMargin`
- `Calculate_WithExpiredContract_ThrowsValidationException`
- `Calculate_CalendarSpread_ComputesCorrectBenefit`
- `Aggregate_WithCrossCommodity_CapsPortfolioBenefitAt50Percent`

## Integration Testing

### TestContainers Approach
Spins up real PostgreSQL, Redis, and Kafka instances in Docker for each test run.

```csharp
public class IntegrationTestFixture : IAsyncLifetime
{
    private PostgreSqlContainer _postgres;
    private RedisContainer _redis;
    private KafkaContainer _kafka;

    public async Task InitializeAsync()
    {
        _postgres = new PostgreSqlBuilder()
            .WithDatabase("garuda_test").Build();
        await _postgres.StartAsync();

        _redis = new RedisBuilder().Build();
        await _redis.StartAsync();

        _kafka = new KafkaBuilder().Build();
        await _kafka.StartAsync();

        await RunDatabaseMigrationsAsync();
    }
}
```

### Integration Test Coverage
- Full margin calculation pipeline with real database
- Position CRUD → margin calculation → result verification
- Kafka message production and consumption end-to-end
- Redis cache read-through and invalidation
- Authentication → API call → audit log verification

## Load Testing

### k6 Script Structure
```
tests/load/
├── k6-margin-calculation.js    (ramp 100 → 10,000 req/sec)
├── k6-portfolio-calculation.js  (large position sets)
├── k6-websocket-realtime.js     (50K concurrent connections)
└── k6-eod-batch.js              (benchmark batch processing)
```

### Load Test Scenarios

| Scenario | Duration | Target | Success Criteria |
|---|---|---|---|
| Ramp up to 10K req/sec | 15 min | 10,000 req/sec sustained | P95 <200ms, error <0.01% |
| Steady state 10K req/sec | 10 min | Sustained throughput | P99 <500ms |
| Burst to 20K req/sec | 2 min | Spike handling | No errors, P99 <1s |
| 50K WebSocket connections | 10 min | Concurrent connections | <5% dropped, <50ms delivery |

## Stress Testing

| Scenario | Target | Criteria |
|---|---|---|
| Sustained peak load | 15K req/sec for 30 min | No errors, P99 <1.5s |
| Burst load | 25K req/sec for 60 sec | No errors, P99 <3s |
| Spike recovery | 10K → 25K → 10K | Graceful recovery, no cascading failures |
| Memory pressure | 500 large positions/request | Memory <85% of limits |
| Connection exhaustion | 50K concurrent WS | <5% dropped |
| Database failover | Kill primary during load | <30s failover, no data loss |

### Chaos Engineering
- PodChaos: Randomly kill 30% of Margin Engine pods for 120 seconds
- NetworkChaos: Inject 100ms latency between app and database
- StressChaos: CPU stress on database node

## Exchange Validation (Parikshak Certification)

Dedicated validation harness that compares Garuda-computed margins against exchange-published reference values.

### Validation Process
1. Parse exchange-published SPAN file and margin reference file
2. Load all positions for the trading date
3. Run Garuda margin calculation for each client/position group
4. Compare results against exchange reference
5. Flag discrepancies exceeding 0.01% tolerance
6. Generate reconciliation report (PASS/WARNING/FAIL)

### Validation Acceptance Criteria
- 100% of client positions must reconcile within 0.01% tolerance
- 0 FAIL results allowed for NSE and BSE segments
- WARNING results must have documented justification
- Daily automated reconciliation runs after EOD batch

## Regression Testing

```bash
# Full regression suite
dotnet test tests/Garuda.MarginEngine.Tests --configuration Release
dotnet test tests/Garuda.Integration.Tests --configuration Release
dotnet test tests/Garuda.ExchangeValidation.Tests --configuration Release

# E2E tests
npx playwright test --config tests/e2e/playwright.config.ts

# Coverage report
dotnet reportgenerator \
    -reports:**/coverage.cobertura.xml \
    -targetdir:TestResults/CoverageReport
```

## CI/CD Test Matrix

```yaml
strategy:
  matrix:
    dotnet-version: ['8.0.x']
    os: [ubuntu-latest, windows-latest]
    test-type: [unit, integration, validation]
    exclude:
      - os: windows-latest
        test-type: integration  # Linux containers only
```

### Pipeline Quality Gates
- Unit tests: 100% pass, >85% line coverage
- Static analysis (SonarQube): Quality Gate PASS
- SAST (SonarQube + Snyk): 0 High/Critical findings
- Dependency scan (Snyk): 0 Critical CVEs
- Container scan (Trivy): 0 Critical vulnerabilities
- Integration tests: 100% pass
- Smoke tests (staging): 100% pass
- DAST (OWASP ZAP, weekly): 0 High findings

## Test Data Management

### Golden Test Data
Pre-validated test data sets for reproducible testing:
```
tests/TestData/
├── exchange_files/         (NSE/BSE/MCX SPAN files from known dates)
├── golden_results/         (Exchange-verified reference margin values)
├── scenarios/              (bull_market, bear_market, expiry_day, high_volatility)
└── seed_data/              (brokers, users, clients, positions for integration tests)
```

### Test Data Generation
Uses Bogus (Faker) for realistic synthetic data:
- Random positions across NIFTY, BANKNIFTY, RELIANCE, INFY, TCS
- Realistic quantities, average prices, product types
- Controlled scenarios for specific test cases
- Deterministic seeding for reproducible results

## BenchmarkDotNet (Microbenchmarks)

| Operation | P50 Target | P99 Target | Memory Allocation |
|---|---|---|---|
| SPAN calc (1 position) | <0.5ms | <2ms | <10 KB |
| SPAN calc (10 positions) | <2ms | <5ms | <50 KB |
| SPAN calc (100 positions) | <10ms | <25ms | <300 KB |
| Full margin (1 client, 50 positions) | <5ms | <20ms | <100 KB |
| Portfolio aggregation (100 clients) | <50ms | <200ms | <2 MB |
| API endpoint (single request) | <50ms | <200ms | — |
