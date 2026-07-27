# TalkOptions Platform — Ecosystem Topology

**Version:** 4.7.2 | **Owner:** Analytics | **Last Updated:** 2026-07-25

## Ecosystem Position

TalkOptions Platform operates within **Layer 1 - Core Data** on server **ALGO IQ 18** (`192.168.190.118`).

```
┌─────────────────────────────────────────────────────┐
│                   Layer 1 - Core Data                      │
│  ┌──────────┐    ┌──────────────┐    ┌───────────┐ │
│  │  Ganesh  │───→│              │───→│ Consumers │ │
│  │   MQ     │───→│ TalkOptions Platform │───→│  Delta XI, VYUH, SpreadWatch, T... │ │
│  │  Surya   │───→│              │    └───────────┘ │
│  │ Lakshmi  │───→│  v4.7.2    │                   │
│  └──────────┘    └──────────────┘                   │
└─────────────────────────────────────────────────────┘
```

## Upstream Dependencies

| Dependency | Protocol | Data Received | Criticality |
|-----------|----------|---------------|-------------|
| Ganesh | REST | OHLC historical data | High |
| MQ | AMQP | Real-time market data | Critical |
| Surya | REST | BOD/EOD reference files | Medium |
| Lakshmi | WebSocket | Live price stream | High |

## Downstream Consumers

| Consumer | Protocol | Data Delivered | Use Case |
|----------|----------|----------------|----------|
| Delta XI | REST/MQ | Analytics output | Primary consumer |
| VYUH | REST/MQ | Analytics feed | Secondary consumer |
| SpreadWatch | REST/MQ | Computed data | Tertiary consumer |

## Communication Matrix

| Protocol | Port | Direction | Purpose |
|----------|------|-----------|---------|
| REST | 8081, 8444 | Bidirectional | API serving and data ingestion |
| AMQP (MQ) | 5672 | Bidirectional | Pub/sub messaging |
| gRPC | 50051 | Internal | Inter-module communication |
| Narad TCP | 3100 | Bidirectional | Service registry and health |

## Health Status
- **Current:** 99.8% uptime
- **Monitoring:** Real-time via Narad heartbeat (every 5s)
- **Alert Threshold:** < 99.0% triggers P1 alert
