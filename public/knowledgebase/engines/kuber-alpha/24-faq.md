# 24 — FAQ

> **Version:** 1.8.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## General

**Q: What is Kuber Alpha?**

Kuber Alpha is the Central Strategy Hub — Layer 3 of the 5-layer Algo-IQ architecture. It receives trading signals from upstream engines, activates managed strategies, allocates capital, and dispatches orders to Vega for execution.

**Q: Does Kuber Alpha generate trading signals?**

No. Kuber Alpha does NOT generate signals. Signals come from Aalap Calls, Delta XI, VYUH, and TalkDelta AI (Layer 4). Kuber Alpha converts these signals into managed, risk-controlled trades.

**Q: Where does Kuber Alpha fit in the lifecycle?**

Kuber Alpha is the final stage (Stage 5) of the strategy lifecycle: Build → Parikshak → Simulator → DXCC → **Kuber Alpha**. Only DXCC-approved strategies are deployed here.

## Deployment

**Q: What deployment modes are available?**

| Mode | Description |
|---|---|
| `PAPER` | Virtual trading; no real capital |
| `SHADOW` | Silent run in production; orders logged but not sent |
| `STAGED` | Gradual capital increase (25% → 50% → 100%) |
| `LIVE` | Full production deployment |

**Q: How long should a strategy run in PAPER mode?**

Minimum 5 trading days. This allows you to validate signal-to-order pipeline, latency, and expected behavior without risking capital.

**Q: Can I deploy a strategy directly to LIVE?**

Technically yes if you have admin permissions, but this is strongly discouraged. Always graduate through PAPER → STAGED → LIVE.

## Capital & Risk

**Q: How does capital allocation work?**

Capital is allocated per the portfolio configuration from Strategy Factory. You can choose fixed allocation, dynamic (performance-based), or risk-parity models. The Capital Allocator ensures no strategy exceeds its budget.

**Q: What happens if a strategy loses money?**

- The strategy continues to trade within its drawdown limit.
- If drawdown exceeds the limit, the strategy is paused.
- If the daily loss limit is breached, the strategy is paused and an alert is sent.
- If margin utilization exceeds the Kill Switch threshold (1.01%), ALL strategies are halted.

**Q: Can I change capital allocation while a strategy is LIVE?**

Yes. Allocation changes take effect at the next rebalance interval (configurable; default: end of day).

## Kill Switch

**Q: What triggers the Kill Switch?**

- Margin utilization > 1.01%
- Daily loss limit exceeded
- Exchange circuit breaker hit
- Manual emergency trigger by admin

**Q: Can the Kill Switch be disabled?**

No. The Kill Switch can be temporarily disarmed after an incident review, but it cannot be permanently disabled. This is a safety requirement enforced by DXCC.

**Q: What happens when the Kill Switch triggers?**

1. All pending orders are cancelled immediately.
2. All active strategies are paused.
3. All open positions are closed at market.
4. Critical alerts are sent to all channels.
5. Manual review is required before disarming.

## Signals

**Q: What signal sources are supported?**

Aalap Calls (voice-based), Delta XI (quantitative), VYUH (portfolio orchestration), and TalkDelta AI (AI-powered). Additional sources can be added via the signal schema.

**Q: How are duplicate signals handled?**

Signals with the same ID received within 5 seconds are deduplicated. Only the first instance is processed.

**Q: What happens to a signal if no strategy matches?**

The signal is dropped and logged. A notification is sent if the drop rate exceeds thresholds.

## Troubleshooting

**Q: My strategy is ACTIVE but not trading — why?**

Check: (1) Is it within trading hours? (2) Are signals being received? (3) Is cooldown active? (4) Are max positions reached? (5) Is Kill Switch ARMED?

**Q: How do I check if Vega is connected?**

`GET /v1/health` — check `vega` under `checks`. Also monitor the Vega dashboard.

**Q: An order is stuck in PENDING — what do I do?**

Wait 60 seconds. If still PENDING, cancel the order (`DELETE /v1/orders/{id}`) and investigate Vega connectivity. If the issue persists, contact the ops team.
