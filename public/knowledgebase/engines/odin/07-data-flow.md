# 07 — Data Flow

> **Version:** v3.0.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## Primary Data Flow: Order → Execution

```
Strategy Engine (Hanuman, etc.)
    │
    │ Publishes CanonicalOrder to MQ
    ▼
MQ Topic: orders.NSE.CM
    │
    ▼
Order Ingestor ──► Deserializes protobuf, assigns internal ID
    │
    ▼
Order Validator ──► Price band check: pass
    │                Quantity check: pass
    │                RMS check (gRPC): pass
    │                Rate limiter: pass
    ▼
Order Router ──► Select Adapter: nse_neat (primary)
    │
    ▼
NSE NEAT Adapter ──► FIX 4.4 NewOrderSingle → NSE
    │
    │ Exchange responds with FIX ExecutionReport (35=8, 150=0 → New)
    ▼
Execution Processor ──► Normalize to CanonicalExecutionReport
    │
    ▼
Order State Store ──► Order status: OPEN
    │
    ▼
MQ Topic: executions.NSE.CM
    │
    ▼
Strategy Engine ──► Receives execution report, updates position
```

## Order Modification Flow

```
1. Strategy publishes ModifyOrder to MQ
2. Order Ingestor receives and validates
3. Order State Store: verify order in OPEN or PARTIALLY_FILLED state
4. Order Router forwards to same adapter that holds the order
5. Adapter sends ModifyRequest to exchange
6. Exchange responds with ExecutionReport (150=5 → Replaced)
7. Execution Processor updates order state (new price, new quantity)
8. Publishes execution report to MQ
```

## Order Cancellation Flow

```
1. Strategy publishes CancelOrder to MQ
2. Order Ingestor receives and validates
3. Order State Store: verify order is cancellable (OPEN, PARTIALLY_FILLED)
4. Order Router forwards to adapter
5. Adapter sends CancelRequest to exchange
6. Exchange responds with:
   - Pending Cancel → ExecutionReport (150=6, 39=6)
   - Cancelled → ExecutionReport (150=4, 39=4)
7. Order State Store updates:
   - PARTIALLY_FILLED → CANCELLED (with filled qty)
   - OPEN → CANCELLED
8. Publishes execution report to MQ
```

## EOD Reconciliation Flow

```
1. 15:45 IST: Reconciler downloads exchange trade file (CSV/TXT) via SFTP
2. Reconciler loads all ODIN trades for the day from order_state_store
3. For each exchange trade:
   a. Match by exchange_order_id + trade_id
   b. Compare: symbol, quantity, price, side, timestamp
   c. If mismatch: log DISCREPANCY event
4. For each ODIN trade (from ODIN's records):
   a. If missing in exchange file: log MISSING_FROM_EXCHANGE
5. For each exchange trade:
   a. If missing in ODIN records: log MISSING_FROM_ODIN (possible manual trade)
6. Generate reconciliation report → PDF + CSV
7. If discrepancies found: P2 alert via Narad
8. All trades matched 100%: reconciliation COMPLETE
```
