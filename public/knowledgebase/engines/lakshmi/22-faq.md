# 22. Frequently Asked Questions

**Version:** 2.1.0
**Owner:** Documentation Team
**Last Updated:** 2026-07-24

---

## General

### 1. What is Lakshmi?
Lakshmi is the central real-time market data distribution engine in the Algo-IQ ecosystem. It ingests high-frequency exchange data from upstream feeds and routes it to downstream consumers—strategy engines, trading terminals, analytics platforms—using a high-performance publish/subscribe architecture built on RabbitMQ and WebSockets.

### 2. Why is it called Lakshmi?
The name Lakshmi is inspired by the Hindu goddess of wealth and prosperity, reflecting the engine's role as the "central distributor of value"—market data—to all participants in the Algo-IQ ecosystem. Each engine in the ecosystem is named after a Hindu deity representing its primary function.

### 3. What makes Lakshmi different from generic message brokers?
Lakshmi is purpose-built for financial market data. It understands domain concepts like ticks, OHLC bars, snapshots, and depth data, providing topic-based routing, built-in rate limiting, deduplication, and guaranteed delivery semantics that generic brokers (Kafka, NATS) require significant custom development to achieve.

### 4. What exchanges and data formats does Lakshmi support?
Lakshmi supports NSE (NFO segment: equity derivatives, futures, options; BFO segment: equity, futures) and BSE derivatives. Data formats include raw ticks, OHLC bars (1s, 5s, 15s, 1min, 5min), order-book snapshots, and market depth (5-level). Support for MCX commodities is on the roadmap (v3.0).

### 5. Is Lakshmi open source?
No. Lakshmi is proprietary software owned by Algo-IQ. However, the client SDKs (JavaScript WebSocket client, Python subscriber, REST API wrapper) are available as open-source libraries on GitHub under the MIT license.

---

## Setup

### 6. What are the prerequisites for installing Lakshmi?
You need Node.js 20 LTS, RabbitMQ 3.12+, Redis 7.2+, and a Linux server (Ubuntu 22.04 recommended). For development, Docker Compose can provide all dependencies. Minimum hardware for production: 8 CPU cores, 16 GB RAM, SSD storage, 10 Gbps network.

### 7. How long does installation take?
A fresh installation takes approximately 15 minutes: 5 minutes for dependency setup (Node.js, RabbitMQ, Redis), 5 minutes for Lakshmi installation and configuration, and 5 minutes for database initialisation and health verification. See [12. Installation Guide](12-installation.md) for step-by-step instructions.

### 8. Can I run Lakshmi in Docker?
Yes. An official Docker image is available at `ghcr.io/algo-iq/lakshmi:2.1.0`. The image bundles the Lakshmi server. RabbitMQ, Redis, and other dependencies must be provided via separate containers or external services. A reference `docker-compose.yml` that spins up the full stack is included in the repository.

### 9. Do I need Suraksha and Narad to run Lakshmi?
No. Suraksha (security) and Narad (service discovery) are optional integrations. Lakshmi can run in standalone mode with local JWT secrets, a static policy file, and hard-coded host endpoints for MQ and Redis. However, multi-node deployments with failover strongly benefit from Suraksha and Narad.

### 10. How do I verify my installation is working?
Run `curl http://localhost:3001/api/v1/health`. A successful installation returns `{"status":"ok","version":"2.1.0","uptime_seconds":...}`. For a functional test, publish a test message to a topic and verify it is received by a subscriber—see the Quick Start in [12. Installation Guide](12-installation.md).

---

## Configuration

### 11. Where is the Lakshmi configuration file?
The primary configuration file is `/etc/lakshmi/config.json` (Linux) or `config.json` in the installation directory. A documented example with all options and their defaults is provided at `config.example.json` in the repository root. The file is hot-reloaded on SIGHUP or via the Narad config sync mechanism.

### 12. How do I add a new topic?
Set topic via the Admin API: `curl -X POST http://lakshmi:3001/api/v1/admin/topics -d '{"name":"MCX_CRUDE","publishers":["svc-feed"],"subscribers":["svc-analytics"]}' -H "Authorization: Bearer <token>"`. Alternatively, add the topic definition to `config.json` under `topics` and reload. New topics take effect within 5 seconds without restart.

### 13. How do I configure rate limits for a topic?
Rate limits are configured per topic in `config.json`: `"topics": {"NFO_EQ": {"rate_limit_publish": 50000, "rate_limit_subscribe": 10000}}`. Limits can be changed dynamically via the Admin API or Narad config sync. When a publisher exceeds the limit, Lakshmi returns HTTP 429 (Too Many Requests) and queues messages with backpressure.

### 14. How does Lakshmi handle multiple subscribers for the same topic?
Lakshmi uses RabbitMQ fanout exchanges: each subscriber gets a dedicated queue bound to the topic exchange. This ensures every subscriber receives every message independently. Subscribers can consume at their own pace; prefetch count and consumer count are configurable per subscriber.

### 15. Can I change the log level without restarting?
Yes. Use the Narad remote command: `narad command lakshmi-node-3 set_log_level --level debug`. Or use the Admin API directly: `curl -X PUT http://lakshmi:3001/api/v1/admin/log-level -d '{"level":"debug"}'`. Supported levels: `error`, `warn`, `info`, `debug`, `trace`. Log level reverts to config default on restart unless persisted.

---

## Performance

### 16. What is the maximum throughput Lakshmi can handle?
Lakshmi is rated for 350,000 messages per second sustained throughput on recommended hardware (8-core Xeon, 64 GB RAM, 10 Gbps). In burst scenarios, it can handle up to 500,000 messages per second for short durations (<30s). Throughput scales linearly with additional nodes when topics are partitioned.

### 17. Why am I seeing latency spikes?
Common causes: (a) RabbitMQ queue depth building up due to slow consumers, (b) Node.js GC pause (check `lakshmi_gc_pause_ms` metric), (c) network congestion between Lakshmi and MQ/Redis, (d) large message payloads (>4 KB) causing serialisation overhead, (e) subscriber processing logic blocking the event loop. See [21. Troubleshooting Guide](21-troubleshooting.md), Problem 2 for detailed diagnosis.

### 18. How do I scale Lakshmi horizontally?
Horizontal scaling is achieved by partitioning topics across multiple Lakshmi nodes (Node-1 handles NFO, Node-2 handles BFO), or by deploying dedicated WebSocket-only nodes for subscriber offloading. Narad handles service discovery so clients always connect to the correct node for their subscribed topics. Kafka migration (v2.2) will further improve horizontal scaling.

### 19. What message size should I use for best performance?
Optimal message size is 128-512 bytes (raw tick data). Messages over 4 KB (depth data, full snapshots) should be sent at reduced frequency (throttled to 1/sec per instrument). Consider sending compact ticks and letting subscribers request depth data on demand via the REST API, rather than publishing full data to every subscriber.

### 20. Does Lakshmi support message compression?
Message compression (gzip, brotli) is not applied by Lakshmi itself—it adds latency. Instead, RabbitMQ is configured with `nodelay=true` (no Nagle's algorithm) for minimum latency. If bandwidth is a concern between data centres, use WAN-optimised RabbitMQ federation with the `rabbit_federation_management` plugin, which supports compression at the transport level.

---

## Troubleshooting

### 21. Lakshmi won't start. What should I check?
(1) Verify all dependencies are running: `systemctl status rabbitmq-server redis-server`. (2) Check port conflicts: `netstat -tlnp | grep -E "3001|9090"`. (3) Validate config: `node scripts/validate-config.js`. (4) Check logs: `journalctl -u lakshmi -n 50`. (5) Verify TLS certificates haven't expired: `openssl x509 -in /etc/lakshmi/certs/lakshmi-server.pem -noout -enddate`. (6) Ensure database is initialised: `node scripts/init-db.js`.

### 22. How do I check if messages are being dropped?
Check the `lakshmi_topic_dropped_messages` metric in Prometheus. High drop counts indicate TTL expiry or queue overflow. In Grafana, the "Lakshmi Topics" dashboard shows per-topic drop rates. Also check RabbitMQ's dead-letter queues: `rabbitmqctl list_queues | grep dlq`. Dropped messages are logged at WARN level with the topic name and message count.

### 23. What should I do if a subscriber disconnects and misses messages?
Lakshmi does not buffer messages for disconnected subscribers by default. The subscriber should implement its own reconnect logic with sequence number tracking. On reconnect, the subscriber sends its last-processed `msg_id` (via WebSocket handshake query parameter `?resume_from=msg-12345`), and Lakshmi replays messages from the RabbitMQ queue starting from that offset—provided the messages haven't expired (TTL).

### 24. How do I generate a heap dump for memory debugging?
Send `SIGUSR2` to the Lakshmi process: `kill -USR2 $(pgrep -f "node server.js")`. The heap snapshot is written to `/var/log/lakshmi/heap-<timestamp>.heapsnapshot`. Load it in Chrome DevTools (Memory tab → Load) to inspect retained objects. Alternatively, use the Admin API: `curl -X POST http://lakshmi:3001/api/v1/admin/heap-snapshot`.

---

## Integration

### 25. How do I integrate my application with Lakshmi?
Use the official client SDK for your language. JavaScript/TypeScript: `npm install @algo-iq/lakshmi-client`. Connect via WebSocket: `const client = new LakshmiClient('wss://lakshmi:3001/ws', { token: jwt }); await client.subscribe('NFO_EQ', (msg) => console.log(msg));`. Or use the REST API for polling: `GET /api/v1/topics/NFO_EQ/messages?since=<msg_id>`. See [09. API Reference](09-api-reference.md) for all endpoints.

### 26. Can I publish data to Lakshmi from external sources?
Yes. Authorised publishers with valid API keys or JWT tokens can publish via HTTP: `POST /api/v1/topics/NFO_EQ/publish` with a JSON body, or via AMQP directly to the RabbitMQ exchange with the correct routing key pattern (`lakshmi.<topic>.<message_type>`). The publisher must be listed in the topic's ACL allowlist.

### 27. How does Lakshmi handle different time zones?
All timestamps in Lakshmi messages and logs are in UTC (ISO 8601 format). Exchange data from NSE/BSE is ingested in IST and converted to UTC at the feed server before reaching Lakshmi. Downstream consumers should convert UTC timestamps to their local time zone as needed. OHLC bar boundaries are computed in IST (aligned with exchange trading hours: 09:15–15:30 IST).

### 28. Is there a limit on the number of topics I can create?
There is no hard limit, but guidelines apply: up to 1,000 topics per Lakshmi node for optimal performance. Each topic creates RabbitMQ exchange bindings and consumes memory (~50 KB per topic). Beyond 1,000 topics, consider topic partitioning across multiple Lakshmi nodes. Topic count is monitored via `lakshmi_topics_total`.

### 29. Can I bridge Lakshmi to external systems (Kafka, NATS, MQTT)?
Lakshmi supports bridging through configurable "sink connectors." A Kafka sink (v2.2) will support publishing selected Lakshmi topics to Kafka topics. For external systems without native connectors, use the Lakshmi REST API consumer to poll messages and forward them. Contact the platform team for custom bridge development.

### 30. What happens if Suraksha is down—can Lakshmi still authenticate users?
Yes, Lakshmi falls back to local JWT validation when Suraksha is unreachable. It uses a cached copy of the Suraksha JWKS (last fetched <5 min ago) for token signature verification. If the JWKS cache is also stale (>15 min), authentication is denied and services must use API keys or wait for Suraksha recovery. This cache-only window is deliberately short to balance availability with security.
