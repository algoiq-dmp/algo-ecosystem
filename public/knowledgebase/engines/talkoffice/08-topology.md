# TalkOffice — Ecosystem Topology

**Version:** 4.0.0 | **Owner:** Operations | **Last Updated:** 2026-07-25

## Ecosystem Position

TalkOffice operates within **Operations & Business** on server **ALGO IQ 19** (`192.168.190.119`).

```
┌─────────────────────────────────────────────────────┐
│                   Operations & Business                      │
│  ┌──────────┐    ┌──────────────┐    ┌───────────┐ │
│  │  Ganesh  │───→│              │───→│ Consumers │ │
│  │   MQ     │───→│  TalkOffice  │───→│  DXCC, Chitragupta... │ │
│  │  Surya   │───→│              │    └───────────┘ │
│  │ Lakshmi  │───→│  v4.0.0    │                   │
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
| DXCC | REST/MQ | Analytics output | Primary consumer |
| Chitragupta | REST/MQ | Analytics feed | Secondary consumer |
| Kuber Alpha | REST/MQ | Computed data | Tertiary consumer |

## Communication Matrix

| Protocol | Port | Direction | Purpose |
|----------|------|-----------|---------|
| REST | 3080 | Bidirectional | API serving and data ingestion |
| AMQP (MQ) | 5672 | Bidirectional | Pub/sub messaging |
| WebSocket | 3001 | Inbound | Live data streaming |
| Narad TCP | 3100 | Bidirectional | Service registry and health |

## Health Status
- **Current:** 99.9% uptime
- **Monitoring:** Real-time via Narad heartbeat (every 5s)
- **Alert Threshold:** < 99.0% triggers P1 alert
