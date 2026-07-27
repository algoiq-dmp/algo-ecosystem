# 20 — Testing

> **Version:** v2.1.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## Testing Strategy

Hanuman testing covers unit tests (strategy logic), integration tests (end-to-end with mock ODIN), backtesting (historical replay), and risk testing (boundary conditions).

## Unit Tests

**Framework:** GoogleTest + gMock

| Suite | Location | Tests |
|-------|----------|-------|
| Spread Engine | `tests/unit/spread/` | 45 |
| Signal Evaluator | `tests/unit/signal/` | 38 |
| Fill Tracker | `tests/unit/fill/` | 29 |
| P&L Calculator | `tests/unit/pnl/` | 24 |
| Risk Validator | `tests/unit/risk/` | 52 |
| Vega Loader | `tests/unit/vega/` | 18 |

### Example: Signal Evaluator Test

```cpp
TEST(SignalEvaluator, EntryWhenSpreadInRange) {
    SignalEvaluator eval(StrategyParams{
        .entry_spread_min = 15.0,
        .entry_spread_max = 25.0,
    });
    eval.setPosition(0);  // No open position
    auto signal = eval.evaluate(spread = 20.0, zscore = 0.5);
    EXPECT_EQ(signal.type, SignalType::ENTRY);
}

TEST(SignalEvaluator, NoEntryWhenSpreadOutOfRange) {
    SignalEvaluator eval(StrategyParams{
        .entry_spread_min = 15.0,
        .entry_spread_max = 25.0,
    });
    eval.setPosition(0);
    auto signal = eval.evaluate(spread = 10.0, zscore = 0.5);
    EXPECT_EQ(signal.type, SignalType::NONE);
}
```

## Integration Tests

### End-to-End Scenarios
- Strategy load → start → market data injection → entry signal → order dispatch → fill → P&L → exit signal → position close
- Partial fill on Leg 1: verify Leg 2 quantity adjusted
- Leg 2 rejection: verify auto-hedge on Leg 1
- Risk veto: position limit exceeded → verify order blocked
- Circuit breaker: 5 consecutive losses → verify strategy paused

## Backtesting Framework

```bash
# Run strategy against historical data
hanumanctl backtest \
    --file /opt/lakshmi/strategies/cal_spread.vega \
    --start 2026-06-01 \
    --end 2026-07-25 \
    --initial-capital 1000000 \
    --output /tmp/backtest_results.json
```

Provides: total P&L, Sharpe ratio, max drawdown, win rate, average holding time, trade count.

## Risk Testing

Test cases for risk boundary conditions:
- Position at exactly max limit → next signal should be vetoed
- Daily loss at exactly limit → strategy paused
- Market moved beyond max_slippage_ticks → order vetoed
- Risk Engine returns error → order vetoed (fail-safe)
- Margin check fails → order vetoed

## Running Tests

```bash
# Unit tests
cd build && ctest -R hanuman_ -j$(nproc) --output-on-failure

# Integration tests
./tests/integration/hanuman/run.sh

# Backtest suite
./tests/backtest/hanuman/run_all.sh --strategies all

# Full CI
./ci/run_pipeline.sh --component hanuman
```
