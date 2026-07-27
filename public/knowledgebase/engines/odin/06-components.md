# 06 — Components

> **Version:** v3.0.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## Component Inventory

### Core Components

| Component | Binary | Responsibility |
|-----------|--------|----------------|
| `odind` | `/opt/lakshmi/bin/odind` | Main daemon process |
| `order_ingestor` | `libodin_ingest.so` | MQ order reception and deserialization |
| `order_validator` | `libodin_validate.so` | Price, quantity, RMS validation |
| `order_router` | `libodin_router.so` | Multi-path order routing logic |
| `order_state_store` | `libodin_state.so` | In-memory order state management |
| `execution_processor` | `libodin_exec.so` | Execution report normalization |

### Protocol Adapters

| Component | Binary | Protocol |
|-----------|--------|----------|
| `odin_diet_adapter` | `libodin_diet.so` | ODIN Diet XML API |
| `omnesys_nest_adapter` | `libodin_nest.so` | Omnesys Nest TCP API |
| `nse_neat_adapter` | `libodin_neat.so` | NSE NEAT FIX 4.4 |
| `bse_bolt_adapter` | `libodin_bolt.so` | BSE BOLT API |
| `utrade_adapter` | `libodin_utrade.so` | uTrade REST API |

### Management Components

| Component | Binary | Responsibility |
|-----------|--------|----------------|
| `odinctl` | `/opt/lakshmi/bin/odinctl` | CLI management tool |
| `reconciler` | `libodin_recon.so` | EOD trade reconciliation |
| `odin_metrics` | `libodin_metrics.so` | Prometheus metrics exporter |
| `audit_logger` | `libodin_audit.so` | Order audit trail |

## Component Interaction

```
MQ (orders.{exchange}.{segment})
    │
    ▼
order_ingestor ──► order_validator ──► RMS (gRPC)
                         │
                    order_router
                         │
               ┌─────────┼─────────┐
               ▼         ▼         ▼
          odin_diet  nse_neat  omnesys_nest
               │         │         │
               └─────────┼─────────┘
                         ▼
               execution_processor
                         │
               order_state_store ──► order_log → PostgreSQL
                         │
                    MQ (executions.{exchange}.{segment})
                         │
                    reconciler (EOD)
```

## CLI Tools: odinctl

```bash
# View order status
odinctl order status --order-id "2026072500001234"
odinctl order status --client-order-id "CLORD001" --client "hanuman01"

# Cancel an order
odinctl order cancel --order-id "2026072500001234"

# Modify an order
odinctl order modify --order-id "2026072500001234" --price 2548.00 --quantity 500

# View adapter health
odinctl adapter status
odinctl adapter health --adapter nse_neat

# EOD reconciliation
odinctl reconcile --exchange NSE --date 2026-07-25
odinctl reconcile --all --date 2026-07-25
```
