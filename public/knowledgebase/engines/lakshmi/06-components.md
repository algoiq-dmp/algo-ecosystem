# 06 — Component Descriptions

## Component 1: Publisher

| Attribute | Detail |
|---|---|
| **Purpose** | Accepts incoming market data messages and reliably publishes them to RabbitMQ exchanges |
| **Responsibilities** | Message normalization, AMQP publishing with confirm mode, connection pooling, backpressure handling |
| **Inputs** | JSON market ticks from Feed Server, Ganesh, Surya |
| **Outputs** | AMQP messages to RabbitMQ exchanges with routing keys |
| **Configuration** | `mq.host`, `mq.port`, `mq.confirmTimeout`, `mq.maxChannels` |
| **Dependencies** | `amqplib`, RabbitMQ, Feed Server |

## Component 2: Consumer

| Attribute | Detail |
|---|---|
| **Purpose** | Consumes messages from RabbitMQ queues and delivers to internal or external handlers |
| **Responsibilities** | Queue consumption with QoS, message acknowledgment, error classification, prefetch management |
| **Inputs** | AMQP messages from bound queues |
| **Outputs** | JSON payloads to WebSocket Server, Broadcast Feeder, or internal handlers |
| **Configuration** | `consumer.prefetch`, `consumer.requeueOnError`, `consumer.ackTimeout` |
| **Dependencies** | `amqplib`, RabbitMQ, Message Router |

## Component 3: Topic Manager

| Attribute | Detail |
|---|---|
| **Purpose** | Maintains the registry of all valid topics and manages their lifecycle |
| **Responsibilities** | Topic CRUD, pattern validation, access control list management, topic statistics |
| **Inputs** | REST API calls (create/delete/list), subscriber registrations |
| **Outputs** | Topic metadata JSON, pattern match results |
| **Configuration** | `topics.maxDepth`, `topics.allowWildcard`, `topics.defaultPartitions` |
| **Dependencies** | PostgreSQL, Cache, Security |

## Component 4: Queue Manager

| Attribute | Detail |
|---|---|
| **Purpose** | Declares and manages RabbitMQ topology—exchanges, queues, and bindings |
| **Responsibilities** | Idempotent exchange/queue declaration, dead-letter queue setup, queue purging, partition management |
| **Inputs** | Topic creation events, consumer registration events |
| **Outputs** | RabbitMQ topology (exchanges, queues, bindings) |
| **Configuration** | `queues.durable`, `queues.autoDelete`, `queues.maxLength`, `queues.dlxEnabled` |
| **Dependencies** | RabbitMQ, Topic Manager |

## Component 5: Message Router

| Attribute | Detail |
|---|---|
| **Purpose** | Routes incoming messages to correct outgoing destinations based on topic rules |
| **Responsibilities** | Topic trie maintenance, subscriber rule evaluation, routing table synchronization, load shedding |
| **Inputs** | AMQP messages with routing keys, subscriber rule updates |
| **Outputs** | Routed messages to WebSocket Server, Broadcast Feeder, or external queues |
| **Configuration** | `router.trieCacheSize`, `router.loadShedThreshold`, `router.syncInterval` |
| **Dependencies** | RabbitMQ, PostgreSQL, Cache |

## Component 6: Cache

| Attribute | Detail |
|---|---|
| **Purpose** | Provides low-latency in-memory caching for hot data and operational state |
| **Responsibilities** | Key-value storage with TTL, deduplication windows, subscriber connection state, rate limiter counters |
| **Inputs** | Cache get/set/del operations from all components |
| **Outputs** | Cached values, existence checks, set members |
| **Configuration** | `redis.host`, `redis.port`, `redis.db`, `redis.keyPrefix`, `redis.connectionPool` |
| **Dependencies** | Redis 7.2.x, ioredis |

## Component 7: Monitoring

| Attribute | Detail |
|---|---|
| **Purpose** | Exposes system health, performance metrics, and alerting capabilities |
| **Responsibilities** | Prometheus metrics endpoint, health check endpoint, Grafana dashboard data, alerting webhooks |
| **Inputs** | Metric recording calls from all components |
| **Outputs** | Prometheus scraped gauges/counters/histograms, health JSON, alert notifications |
| **Configuration** | `monitoring.port`, `monitoring.interval`, `monitoring.alertWebhook` |
| **Dependencies** | Prometheus, Grafana, InfluxDB |

## Component 8: Analytics

| Attribute | Detail |
|---|---|
| **Purpose** | Aggregates throughput, latency, and error statistics for operational insight |
| **Responsibilities** | Per-topic message counting, latency histogram bucketing, error classification, time-series export |
| **Inputs** | Throughput counters, latency samples, error events |
| **Outputs** | InfluxDB time-series points, aggregated statistical summaries |
| **Configuration** | `analytics.windowSize`, `analytics.exportInterval`, `analytics.influxdb.bucket` |
| **Dependencies** | InfluxDB 2.7.x, Cache |

## Component 9: Retry Engine

| Attribute | Detail |
|---|---|
| **Purpose** | Handles transient delivery failures with configurable retry policies |
| **Responsibilities** | Failed message queuing, retry scheduling with backoff, dead-letter promotion, queue depth monitoring |
| **Inputs** | Failed delivery events from Consumer |
| **Outputs** | Re-published messages or dead-lettered messages |
| **Configuration** | `retry.strategy`, `retry.maxAttempts`, `retry.baseDelayMs`, `retry.maxDelayMs` |
| **Dependencies** | RabbitMQ, PostgreSQL (audit) |

## Component 10: Security

| Attribute | Detail |
|---|---|
| **Purpose** | Enforces authentication, authorization, and transport security |
| **Responsibilities** | API key validation, scope-based access control, TLS termination, payload encryption, key rotation |
| **Inputs** | API key + scope from request headers, topic access requests |
| **Outputs** | Auth success/failure, encrypted payloads, rotated key sets |
| **Configuration** | `security.tls.enabled`, `security.tls.certPath`, `security.apiKeyHeader`, `security.surakshaUrl` |
| **Dependencies** | Suraksha, Node.js TLS module, Redis (key cache) |

## Inter-Component Dependency Graph

```
Publisher ──────► RabbitMQ
Consumer ───────► RabbitMQ, MessageRouter
TopicManager ───► PostgreSQL, Cache, Security
QueueManager ───► RabbitMQ, TopicManager
MessageRouter ──► RabbitMQ, PostgreSQL, Cache
Cache ──────────► Redis
Monitoring ─────► Prometheus, InfluxDB
Analytics ──────► InfluxDB, Cache
RetryEngine ────► RabbitMQ, PostgreSQL
Security ───────► Suraksha, Redis
```
