---
version: 5.0.0
owner: Margin Intelligence
last_updated: 2026-07-25
---

# 16 — Narad Integration

## Overview

Narad is the Algo-IQ ecosystem's centralized event bus and service registry. Garuda Margin Engine integrates with Narad for service registration, margin change event publishing, health heartbeat monitoring, and cross-service communication.

## Integration Architecture

```
┌──────────────────────────┐
│        NARAD HUB          │
│  ┌────────────────────┐  │
│  │  Service Registry   │  │  ← Garuda registers on startup
│  │  Health Monitor     │  │  ← Garuda sends heartbeat every 30s
│  │  Event Dispatcher   │  │  ← Garuda publishes margin events
│  │  Subscription Mgr   │  │  ← Consumers subscribe to events
│  └────────────────────┘  │
└──────────┬───────────────┘
           │
    ┌──────┼──────┐
    ▼      ▼      ▼
┌───────┐ ┌───────┐ ┌───────┐
│Garuda │ │ RMS   │ │ Algo  │  ← All margin consumers subscribe
│Margin │ │ System│ │ Engine│
│Engine │ │       │ │       │
└───────┘ └───────┘ └───────┘
```

## Service Registration

Garuda registers with Narad on startup, providing its capabilities and endpoints.

### Registration Payload
```json
{
  "service_id": "garuda-margin-engine",
  "service_type": "margin_calculation",
  "version": "5.0.0",
  "host": "garuda-api.garuda-production.svc",
  "port": 443,
  "health_endpoint": "/health",
  "capabilities": [
    "span_calculation",
    "exposure_calculation",
    "portfolio_margin",
    "strategy_margin",
    "hedge_intelligence",
    "margin_forecasting"
  ],
  "metadata": {
    "broker_ids": ["BRK001", "BRK002"],
    "exchanges": ["NSE", "BSE", "MCX", "NCDEX"],
    "environment": "production"
  }
}
```

### Registration Lifecycle
1. **Startup**: Garuda calls `POST /narad/register` with service metadata
2. **Active**: Narad acknowledges registration with a `service_token` valid for 24h
3. **Heartbeat**: Garuda sends `POST /narad/heartbeat` every 30 seconds
4. **Deregistration**: On graceful shutdown, Garuda calls `POST /narad/deregister`
5. **Expiry**: If no heartbeat for 90 seconds, Narad marks service as DEGRADED and alerts

## Margin Change Events

Garuda publishes margin-related events to Narad for consumption by all registered subscribers (RMS systems, algo platforms, dashboards).

### Event Types Published

| Event Type | Trigger | Payload |
|---|---|---|
| `margin.calculated` | Every margin computation | Full margin result with breakdown |
| `margin.shortfall` | Margin utilization exceeds threshold | Client code, shortfall amount, utilization % |
| `margin.peak_updated` | New peak margin recorded | Client code, previous peak, new peak |
| `margin.threshold_breached` | Utilization crosses warning/critical | Client code, threshold type, utilization |
| `margin.eod_completed` | EOD batch finishes for a broker | Broker ID, date, status, client count |
| `margin.reconciliation_result` | Exchange reconciliation completes | Match rate, discrepancy count, details |
| `span.file_updated` | New SPAN file ingested | Exchange, underlying, file date, parameter summary |
| `alert.generated` | Any system alert fires | Alert type, severity, message, timestamp |

### Event Format
```json
{
  "event_id": "evt_01ARZ3PXXQ",
  "event_type": "margin.calculated",
  "timestamp": "2026-07-25T10:30:45.123Z",
  "source": {
    "service_id": "garuda-margin-engine",
    "version": "5.0.0"
  },
  "correlation_id": "req_a1b2c3d4",
  "payload": {
    "broker_id": "BRK001",
    "client_code": "CL001",
    "total_margin": 245000.75,
    "margin_breakdown": {
      "span_margin": 142500.50,
      "exposure_margin": 87500.00,
      "net_option_value": -28000.00
    },
    "utilization_percent": 91.4
  }
}
```

## Health Heartbeat

Garuda sends periodic heartbeats to Narad to maintain its HEALTHY status.

### Heartbeat Payload
```json
{
  "service_id": "garuda-margin-engine",
  "service_token": "st_xxx",
  "timestamp": "2026-07-25T10:30:45Z",
  "status": "HEALTHY",
  "metrics": {
    "active_connections": 1247,
    "calculations_per_second": 8500,
    "p95_latency_ms": 45,
    "error_rate_percent": 0.02,
    "memory_usage_mb": 2048,
    "cpu_usage_percent": 42
  },
  "dependency_status": {
    "database": "HEALTHY",
    "redis": "HEALTHY",
    "kafka": "HEALTHY"
  }
}
```

### Status States
| Status | Meaning | Action |
|---|---|---|
| **HEALTHY** | All systems normal | No action |
| **DEGRADED** | Performance or dependency warning | Operations team notified |
| **UNHEALTHY** | Service not functioning correctly | Auto-failover triggered |
| **MAINTENANCE** | Planned maintenance window | Consumers notified to use fallback |

## Subscription Configuration

### Garuda Subscribes To (from Narad)
| Event | Purpose |
|---|---|
| `system.config_changed` | Dynamic configuration update |
| `broker.onboarded` | New broker activation |
| `broker.deactivated` | Broker suspension/termination |
| `exchange.file_available` | Trigger file download |
| `suraksha.certificate_rotated` | Update TLS certificates |

### Configuration
```json
{
  "narad": {
    "hub_url": "https://narad-hub.algo-iq.svc",
    "register_on_startup": true,
    "heartbeat_interval_seconds": 30,
    "heartbeat_timeout_seconds": 90,
    "publish_events": [
      "margin.calculated",
      "margin.shortfall",
      "margin.peak_updated",
      "margin.eod_completed",
      "span.file_updated"
    ],
    "subscribe_events": [
      "system.config_changed",
      "broker.onboarded",
      "broker.deactivated",
      "exchange.file_available"
    ],
    "retry": {
      "max_attempts": 3,
      "backoff_ms": 1000,
      "max_backoff_ms": 30000
    }
  }
}
```

## Failure Handling

### Registration Failure
- Retry registration 3 times with exponential backoff (1s, 5s, 25s)
- If all retries fail, enter DEGRADED mode — continue serving but without Narad
- Log critical alert to monitoring

### Heartbeat Failure
- If 3 consecutive heartbeats fail, attempt re-registration
- If re-registration also fails, trigger self-health check
- Alert SRE team via PagerDuty

### Event Publishing Failure
- Buffer events in local queue (max 10,000 events / 500 MB)
- Retry with exponential backoff
- If buffer exceeds threshold, drop oldest events (FIFO) and alert

## Testing Narad Integration

```bash
# Verify registration
curl https://narad-hub.algo-iq.svc/services/garuda-margin-engine

# Check heartbeat status
curl https://narad-hub.algo-iq.svc/services/garuda-margin-engine/health

# Subscribe to margin events (test consumer)
curl -X POST https://narad-hub.algo-iq.svc/subscribe \
    -d '{"service_id": "test-consumer", "events": ["margin.calculated"]}'
```
