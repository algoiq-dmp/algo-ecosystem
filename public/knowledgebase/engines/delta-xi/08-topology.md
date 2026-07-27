# Delta XI — Ecosystem Topology

**Version:** 3.2.0 | **Owner:** Analytics | **Last Updated:** 2026-07-25

## Ecosystem Position

Delta XI operates within **Layer 2 - Opportunity Generation** on server **ALGO IQ 4** (`192.168.190.104`).

```
┌─────────────────────────────────────────────────────┐
│                   Layer 2 - Opportunity Generation                      │
│  ┌──────────┐    ┌──────────────┐    ┌───────────┐ │
│  │  Ganesh  │───→│              │───→│ Consumers │ │
│  │   MQ     │───→│   Delta XI   │───→│  Kuber Alpha, DXCC... │ │
│  │  Surya   │───→│              │    └───────────┘ │
│  │ Lakshmi  │───→│  v3.2.0    │                   │
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
| Kuber Alpha | REST/MQ | Analytics output | Primary consumer |
| DXCC | REST/MQ | Analytics feed | Secondary consumer |
| Kuber Alpha | REST/MQ | Computed data | Tertiary consumer |

## Communication Matrix

| Protocol | Port | Direction | Purpose |
|----------|------|-----------|---------|
| REST | 3020 | Bidirectional | API serving and data ingestion |
| AMQP (MQ) | 5672 | Bidirectional | Pub/sub messaging |
| gRPC | 50051 | Internal | Inter-module communication |
| Narad TCP | 3100 | Bidirectional | Service registry and health |

## Health Status
- **Current:** 99.7% uptime
- **Monitoring:** Real-time via Narad heartbeat (every 5s)
- **Alert Threshold:** < 99.0% triggers P1 alert
