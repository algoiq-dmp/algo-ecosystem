# Theta Yantra - Narad Integration

**Version:** 3.1.0 | **Owner:** Analytics | **Last Updated:** 2026-07-25


## Overview

Narad is the centralized notification and monitoring dashboard platform for the Algo IQ ecosystem. The engine integrates with Narad to provide real-time operational visibility.

## Integration Points

### Event Streaming
The engine publishes operational events to Narad via WebSocket. Events include:
- Signal generation notifications
- Health status changes
- Error alerts and warnings
- Performance metric snapshots
- Configuration change notifications

### Dashboard Components
Pre-built Narad dashboard widgets display:
- Live signal feed with strategy attribution
- Real-time PnL ticker
- Health status heatmap
- Alert indicator panel
- Resource utilization gauges

## Integration Architecture

```
Engine Process ----WebSocket----> Narad Hub ----Dashboard----> Browser
     |                                |
     +----HTTP (Metrics)----> Narad Collector ----Prometheus----> Grafana
```

## Configuration

Narad integration is configured in the engine config:

```toml
[narad]
enabled = true
ws_url = "wss://narad.internal/ws/engine"
auth_token = ""
reconnect_interval_ms = 5000
event_buffer_size = 1000
```

## Event Payload Format

```json
{
  "event_id": "evt-abc123",
  "engine": "aalap-calls",
  "event_type": "signal.generated",
  "severity": "info",
  "timestamp": "2026-07-25T10:30:00Z",
  "payload": {
    "strategy_id": "aalap-01",
    "symbol": "NIFTY",
    "signal_type": "BUY",
    "confidence": 0.87
  }
}
```

## Alert Routing

Critical alerts are routed through Narad to:
- **Dashboard:** Visual alert badge and sound notification
- **Email:** Daily digest and instant critical alerts
- **SMS:** Urgent alerts for system-down events
- **Slack/Teams:** Team notification channel integration

## Narad Health Check

The engine periodically verifies Narad connectivity. If disconnected, events are buffered locally and replayed upon reconnection. Buffer overflow triggers a disk-based spillover mechanism.

