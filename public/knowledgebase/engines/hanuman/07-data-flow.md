# 07 — Data Flow

> **Version:** v2.1.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## Primary Data Flow: Tick → Order

```
MQ Topic: feed.NSE.FO.tick
    │
    ▼
OrderBook Cache ──► Updates LTP, bid, ask for instrument
    │
    ▼
Spread Engine ──► Computes spread = Leg1.Price - Leg2.Price * Beta
    │
    ▼
Signal Evaluator ──► Checks entry/exit conditions
    │                  Entry: spread in [entry_min, entry_max]
    │                  Exit:  spread <= exit_target OR spread >= stop_loss
    │
    ▼
Risk Validator ──► Calls Risk Engine: checkPositionLimit(), checkMargin()
    │                If REJECTED → log, emit RiskVeto event, STOP
    │
    ▼
Order Dispatcher ──► Generates paired LegOrder structs
    │                 Publishes to MQ topic: orders.NSE.FO
    │
    ▼
ODIN ──► Routes to exchange, receives execution reports
    │
    ▼
MQ Topic: executions.NSE.FO
    │
    ▼
Fill Tracker ──► Updates leg position, checks ratio
    │              If ratio broken → partial fill adjustment
    │
    ▼
P&L Calculator ──► Updates realized + unrealized P&L
    │
    ▼
Audit Logger ──► Writes structured audit event
```

## Entry Signal Flow (Detailed)

```
1. Tick arrives for NIFTY26JUNFUT (Leg 1)
2. OrderBook cache updates: LTP = 23500.00
3. Leg 2 LTP already cached: NIFTY26JULFUT = 23480.00
4. Spread = 23500.00 - 23480.00 * 1.0 = 20.00
5. Strategy parameters: entry_spread_min=15, entry_spread_max=25
6. Signal: ENTRY (20.00 in range [15, 25])
7. Risk check: position=0, margin available → PASS
8. Generate orders:
   - Leg 1: BUY 75 NIFTY26JUNFUT LIMIT 23500.00
   - Leg 2: SELL 75 NIFTY26JULFUT LIMIT 23480.00
9. Publish to MQ: orders.NSE.FO
10. Log event: "strategy=cal_spread_nifty_jun_jul signal=ENTRY spread=20.00"
```

## Exit Signal Flow

```
1. Strategy has open position: +75 JUN, -75 JUL
2. Tick: Leg 1 LTP = 23506.00, Leg 2 LTP = 23501.00
3. Spread = 23506.00 - 23501.00 = 5.00
4. Strategy parameters: exit_spread_target = 5.00
5. Signal: EXIT (spread <= target)
6. Generate closing orders:
   - Leg 1: SELL 75 NIFTY26JUNFUT
   - Leg 2: BUY 75 NIFTY26JULFUT
7. P&L: (23506-23500)*75 + (23480-23501)*75 = 450 - 1575 = -1125 (loss)
```

## Partial Fill Adjustment Flow

```
1. Leg 1 fills: 50 out of 75 (partial)
2. Fill Tracker detects: Leg 1 filled ratio = 50/75 = 66.7%
3. Cancel Leg 2 order (75 pending)
4. Calculate new Leg 2 quantity: 50 / 1.0 = 50
5. Submit new Leg 2 order: SELL 50 NIFTY26JULFUT
6. Remaining Leg 1 quantity (25) remains open for further fills
```
