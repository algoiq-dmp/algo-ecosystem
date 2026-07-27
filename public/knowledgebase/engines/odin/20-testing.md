# 20 — Testing

> **Version:** v3.0.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## Testing Strategy

ODIN testing is critical because bugs can result in real financial loss. Testing covers unit tests, integration tests with exchange simulators, adapter certification tests, and reconciliation tests.

## Unit Tests

**Framework:** GoogleTest + gMock

| Suite | Location | Tests |
|-------|----------|-------|
| Order Validator | `tests/unit/validator/` | 48 |
| Order Router | `tests/unit/router/` | 36 |
| Protocol Adapters | `tests/unit/adapters/` | 95 |
| Execution Processor | `tests/unit/execution/` | 42 |
| Reconciler | `tests/unit/reconciler/` | 31 |

### Example: Order Validator Test

```cpp
TEST(OrderValidator, RejectPriceOutsideBand) {
    OrderValidator validator;
    validator.loadPriceBand("RELIANCE", {low: 2400.0, high: 2600.0});

    CanonicalOrder order;
    order.symbol = "RELIANCE";
    order.price = 3000.0;  // Outside band

    auto result = validator.validate(order);
    EXPECT_EQ(result.status, ValidationStatus::REJECTED);
    EXPECT_EQ(result.reason, "PRICE_OUTSIDE_BAND");
}
```

## Integration Tests

### Exchange Simulator

ODIN has a built-in exchange simulator that mimics NSE, BSE, MCX behavior:

```bash
odind --simulator --exchange NSE --segment CM
```

Simulator capabilities:
- Accepts orders, returns realistic execution reports
- Handles order modifications and cancellations
- Injects errors (rejections, timeouts) for testing
- Generates EOD trade files

### Test Scenarios

| Scenario | Description |
|----------|-------------|
| Order submit + fill | Place order → receive NEW → receive TRADE → COMPLETE |
| Order reject (price band) | Submit with out-of-band price → REJECTED |
| Order reject (RMS) | Submit with insufficient margin → REJECTED |
| Modify order | Modify price → receive REPLACED |
| Cancel order | Cancel open order → CANCELLED |
| Partial fill | Submit 100 → fill 60 → PARTIAL → cancel remaining 40 → CANCELLED |
| Adapter failover | Kill primary adapter → verify secondary picks up |
| Rate limiter | Exceed rate limit → verify throttling |
| Reconciliation | Run EOD reconcile with simulated trade files → 100% match |

## Exchange Certification Tests

Before production deployment, adapters must pass exchange certification:
- **NSE NEAT:** Vendor certification suite (NSE-provided FIX conformance tests)
- **BSE BOLT:** API conformance test suite
- **ODIN Diet:** Financial Technologies vendor qualification

## Running Tests

```bash
# Unit tests
cd build && ctest -R odin_ -j$(nproc)

# Integration tests with simulator
./tests/integration/odin/run.sh --simulator

# Full CI suite
./ci/run_pipeline.sh --component odin
```
