# 19 — MQ Integration

> **Version:** 3.0.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## Overview

The Message Queue (MQ) is the backbone of inter-engine communication in the Algo-IQ ecosystem. Strategy Factory publishes and subscribes to MQ topics to coordinate with Parikshak, Simulator, DXCC, Kuber Alpha, and other engines.

## MQ Technology

| Property | Value |
|---|---|
| Broker | RabbitMQ 3.12 |
| Protocol | AMQP 0-9-1 |
| Exchange Type | Topic |
| Serialization | JSON |
| Compression | gzip (payloads > 10KB) |
| Connection Pool | 10 channels |

## Published Events

| Routing Key | Payload | Description |
|---|---|---|
| `strategy.factory.created` | Strategy metadata | New strategy created |
| `strategy.factory.updated` | Strategy metadata + diff | Strategy modified |
| `strategy.factory.exported` | Full strategy JSON | Strategy exported for downstream |
| `strategy.factory.deleted` | `{ strategyId }` | Strategy removed |
| `strategy.factory.submitted.parikshak` | `{ strategyId, json }` | Sent to Parikshak |
| `strategy.factory.submitted.simulator` | `{ strategyId, json }` | Sent to Simulator |
| `strategy.factory.submitted.dxcc` | `{ strategyId, package }` | Sent to DXCC |
| `strategy.factory.deployed` | `{ strategyId, deployment }` | Deployed to Kuber Alpha |

## Subscribed Events

| Routing Key | Source | Action |
|---|---|---|
| `parikshak.test.completed` | Parikshak | Update strategy status with results |
| `parikshak.test.failed` | Parikshak | Notify user; enable resubmit |
| `simulator.backtest.completed` | Simulator | Store results; advance to DXCC |
| `simulator.backtest.failed` | Simulator | Notify user with gap report |
| `dxcc.review.approved` | DXCC | Trigger deployment to Kuber Alpha |
| `dxcc.review.rejected` | DXCC | Notify user with rejection reason |
| `kuber.strategy.activated` | Kuber Alpha | Update deployment status to LIVE |
| `kuber.strategy.paused` | Kuber Alpha | Alert user of pause |
| `kuber.strategy.killswitch` | Kuber Alpha | Critical alert |
| `ganesh.quality.drop` | Ganesh | Warn about data quality |

## Message Format

```json
{
  "header": {
    "messageId": "msg-uuid-123",
    "timestamp": "2026-07-24T15:30:00Z",
    "source": "strategy-factory",
    "version": "3.0.0",
    "correlationId": "corr-uuid-456"
  },
  "payload": { },
  "metadata": {
    "strategyId": "sf-abc123",
    "userId": "user@algo-iq.com",
    "environment": "production"
  }
}
```

## Reliability

| Feature | Configuration |
|---|---|
| Persistent Messages | Enabled (delivery_mode: 2) |
| Publisher Confirms | Enabled |
| Consumer Acknowledgments | Manual (ack after processing) |
| Dead Letter Queue | `strategy.factory.dlq` |
| Retry Policy | 3 retries, exponential backoff |
| TTL | 24 hours |

## Monitoring

| Metric | Description |
|---|---|
| `mq.published.count` | Total messages published |
| `mq.consumed.count` | Total messages consumed |
| `mq.dlq.size` | Messages in dead letter queue |
| `mq.latency.p99` | 99th percentile end-to-end latency |
| `mq.connection.status` | 1 = connected, 0 = disconnected |

## Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| Messages not consumed | Consumer down | Check consumer health; restart if needed |
| High DLQ count | Processing errors | Inspect DLQ messages; fix root cause |
| Connection drops | Network issues | Check network; auto-reconnect is enabled |
| High latency | Broker overload | Scale RabbitMQ nodes; check queue depth |
