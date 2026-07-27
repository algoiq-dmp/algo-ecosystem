# TalkDelta — Ecosystem Topology

**Version:** 5.1.0 | **Owner:** Analytics | **Last Updated:** 2026-07-25

## Ecosystem Position

TalkDelta operates within **Operations & Business** on server **ALGO IQ 4** (`192.168.190.104`).

```
┌─────────────────────────────────────────────────────┐
│                   Operations & Business                      │
│  ┌──────────┐    ┌──────────────┐    ┌───────────┐ │
│  │  Ganesh  │───→│              │───→│ Consumers │ │
│  │   MQ     │───→│  TalkDelta   │───→│  TalkDelta AI, Kavach, Chitragu... │ │
│  │  Surya   │───→│              │    └───────────┘ │
│  │ Lakshmi  │───→│  v5.1.0    │                   │
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
| TalkDelta AI | REST/MQ | Analytics output | Primary consumer |
| Kavach | REST/MQ | Analytics feed | Secondary consumer |
| Chitragupta | REST/MQ | Computed data | Tertiary consumer |

## Communication Matrix

| Protocol | Port | Direction | Purpose |
|----------|------|-----------|---------|
| REST | 3005, 3006 | Bidirectional | API serving and data ingestion |
| AMQP (MQ) | 5672 | Bidirectional | Pub/sub messaging |
| WebSocket | 3001 | Inbound | Live data streaming |
| Narad TCP | 3100 | Bidirectional | Service registry and health |

## Health Status
- **Current:** 99.8% uptime
- **Monitoring:** Real-time via Narad heartbeat (every 5s)
- **Alert Threshold:** < 99.0% triggers P1 alert
