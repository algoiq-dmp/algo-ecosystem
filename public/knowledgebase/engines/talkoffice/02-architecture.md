# TalkOffice — Architecture

**Version:** 4.0.0 | **Owner:** Operations | **Last Updated:** 2026-07-24

## Architecture Overview

TalkOffice has three core modules:

- **talkoffice-oms:** Order Management System that tracks all orders from placement through execution via Vega. Maintains order book, trade book, and execution history.
- **talkoffice-rms:** Risk Management System that computes real-time positions, MTM, P&L, margin utilization, and exposure. Monitors risk limits and triggers alerts on breaches.
- **talkoffice-dashboard:** WebSocket-powered operational dashboard for real-time position views, risk monitoring, and reporting.

## Data Flow

```
Vega (Trade Confirmations via MQ) ──> talkoffice-oms ──> PostgreSQL
                                            │
                                            └──> talkoffice-rms ──> DXCC (Alerts/Reports)
                                            └──> talkoffice-dashboard ──> WebSocket ──> Operations UI
```

1. Vega publishes trade confirmations via MQ
2. OMS records all orders/trades and maintains the trade book
3. RMS computes positions, MTM, margins, and exposure
4. Dashboard streams real-time operational views; DXCC receives risk reports
