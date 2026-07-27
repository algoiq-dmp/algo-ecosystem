# 21. Troubleshooting Guide

**Version:** 2.1.0
**Owner:** SRE / Data Engineering
**Last Updated:** 2026-07-24

---

## Overview

This guide documents the 10 most common issues encountered in Lakshmi production deployments. Each entry includes symptoms, diagnosis steps, root cause analysis, resolution procedure, verification checklist, and prevention measures.

---

## Problem 1: RabbitMQ Connection Refused

### Symptoms
- `lakshmi_mq_connections` drops to 0
- Messages queued locally but not published
- `/api/v1/health/ready` returns `mq: false`
- Error log: `ECONNREFUSED` or `AMQP connection error`

### Diagnosis
```bash
# 1. Check if RabbitMQ is running
curl -s http://mq-host:15672/api/health/checks/alarms -u admin:password

# 2. Check Lakshmi MQ connection config
grep -A 5 '"rabbitmq"' /etc/lakshmi/config.json

# 3. Verify network connectivity
nc -zv mq-host 5672

# 4. Check MQ listener
rabbitmqctl list_connections | grep lakshmi
```

### Root Cause
- RabbitMQ process crashed or was restarted
- Network partition between Lakshmi and RabbitMQ
- MQ connection limit reached
- TLS certificate expired on either side
- Firewall rule change blocking port 5671/5672

### Resolution
```bash
# 1. Verify RabbitMQ is running; restart if necessary
systemctl restart rabbitmq-server

# 2. Flush iptables/nftables rules if firewall change detected
# 3. Verify TLS certificates:
openssl s_client -connect mq-host:5671 -cert /etc/lakshmi/certs/lakshmi-mq.pem -key /etc/lakshmi/certs/lakshmi-mq-key.pem

# 4. Increase max connections in rabbitmq.conf:
#    channel_max = 5000

# 5. Restart Lakshmi after fixing root cause
curl -X POST http://lakshmi:3001/api/v1/admin/restart
```

### Verification
- [ ] `lakshmi_mq_connections` returns to >0
- [ ] `/api/v1/health/ready` shows `mq: true`
- [ ] Pending messages published to MQ
- [ ] No `ECONNREFUSED` errors in logs for 5 minutes

### Prevention
- Health check alerting on `lakshmi_mq_connections < 1` (P1 alert)
- RabbitMQ cluster mode (at least 3 nodes)
- TLS certificate expiry monitoring (alert at 30 days)
- Connection limit monitoring in Grafana

---

## Problem 2: High Message Latency (>10ms p99)

### Symptoms
- `lakshmi_message_latency_ms` p99 exceeds threshold
- Subscribers report stale/delayed data
- Trading terminal shows lagging price updates
- `lakshmi_queue_depth` elevated

### Diagnosis
```bash
# 1. Identify bottleneck component
curl http://lakshmi:3001/api/v1/stats/latency-breakdown

# 2. Check queue depth
rabbitmqctl list_queues name messages | grep lakshmi

# 3. Check consumer count
rabbitmqctl list_queues name consumers | grep lakshmi

# 4. Check CPU profile (if profiling enabled)
curl -X POST http://lakshmi:3001/api/v1/admin/profile/start
# Wait 60 seconds
curl http://lakshmi:3001/api/v1/admin/profile/stop > profile.cpuprofile

# 5. Check network latency between nodes
ping -c 100 mq-host | tail -1
```

### Root Cause
- Subscriber processing too slow (consumer lag)
- RabbitMQ broker overloaded (high CPU on MQ node)
- Network congestion / packet loss
- GC pause spike in Node.js
- Large message payloads causing serialisation overhead

### Resolution
```bash
# 1. Scale up subscribers (increase consumer count):
rabbitmqctl set_parameter shovel my-shovel '{"src-queue":"feed.nfo","dest-uri":"amqp://new-consumer"}'

# 2. Reduce message size (if >4 KB):
#    - Send ticks without depth data; subscribers request depth on demand

# 3. Move topics to dedicated Lakshmi node:
#    - Split NFO and BFO topics across two nodes

# 4. Increase subscriber prefetch:
#    channel.prefetch(50)  # was 10

# 5. Enable message batching on the publisher side (batch_size: 50)
```

### Verification
- [ ] Latency p99 returns to ≤5ms within 5 minutes
- [ ] Queue depth decreasing
- [ ] Subscribers confirm real-time data
- [ ] CPU on Lakshmi and MQ nodes below 60%

### Prevention
- Latency alert at p99 > 10ms (P1)
- Queue depth alert at >1000 (P1)
- Auto-scale consumers based on queue depth
- Weekly latency trend review in Grafana

---

## Problem 3: WebSocket Subscriber Disconnects Repeatedly

### Symptoms
- `lakshmi_websocket_connections` oscillates (connect → disconnect → reconnect cycle)
- Client logs show `WebSocket closed` with code 1006 (abnormal)
- Subscribers miss ticks for 1-5 seconds per disconnect
- Spike in auth events (token re-issued on reconnect)

### Diagnosis
```bash
# 1. Check WebSocket server error rate
curl http://lakshmi:3001/api/v1/stats/ws-errors

# 2. Check JWT token expiry on client side
# Client log: "JWT expiring in X seconds"

# 3. Verify client ping/pong handling
# Lakshmi sends ping every 30s; client must pong within 10s

# 4. Check max connections
grep max_connections /etc/lakshmi/config.json

# 5. Inspect a failing connection:
# netstat -an | grep :3001 | wc -l
```

### Root Cause
- Client not sending pong frames (connection timed out by server)
- JWT token expired without refresh
- Network instability between client and server
- Server hitting max connection limit
- Client-side reconnect logic too aggressive (no jitter)
- TLS handshake failure on reconnect

### Resolution
```bash
# 1. Ensure client implements ping/pong:
ws.on('ping', () => ws.pong());

# 2. Implement JWT refresh on client:
if (Date.now() > tokenExpiresAt - 15 * 60 * 1000) {
  token = await refreshToken();
}

# 3. Add reconnect jitter client-side:
const delay = Math.min(baseDelay * 2 ** attempt, 30000) * (0.75 + Math.random() * 0.5);

# 4. Increase max WebSocket connections if needed:
# "max_connections": 10000
```

### Verification
- [ ] WebSocket connection count stable for >10 minutes
- [ ] Client logs: no abnormal closures in 5 minutes
- [ ] No missed ticks reported by subscriber
- [ ] Pong responses logged every 30 seconds

### Prevention
- WebSocket connection monitoring in Grafana
- Alert on 30% connection drop in 10 minutes
- Client SDK includes built-in ping/pong and JWT refresh
- Load-test WebSocket connections before release
- Per-client queue to buffer missed messages during reconnect

---

## Problem 4: Topic Not Receiving Messages

### Symptoms
- Subscriber connected to topic but receiving no ticks
- `lakshmi_topic_message_rate{NFO_EQ}` drops to 0
- Queue depth for topic is 0 or decreasing
- Upstream publisher claims messages are being sent

### Diagnosis
```bash
# 1. Verify topic exists and is active
curl http://lakshmi:3001/api/v1/topics/NFO_EQ

# 2. Check publisher binding
rabbitmqctl list_bindings | grep NFO_EQ

# 3. Verify upstream publisher health
curl http://ganesh:4000/api/v1/health

# 4. Check topic ACLs
grep -A 10 '"NFO_EQ"' /etc/lakshmi/policy.json

# 5. Inspect MQ exchange
rabbitmqctl list_exchanges name type | grep lakshmi
```

### Root Cause
- Upstream publisher (Ganesh/Surya) stopped sending data
- Topic ACL changed, blocking publisher or subscriber
- MQ exchange binding removed
- Topic routing key mismatch between publisher and Lakshmi
- Exchange type changed (e.g., fanout → direct)
- Topic rate limit triggered and throttling all traffic

### Resolution
```bash
# 1. Restart upstream feed if stopped:
# systemctl restart ganesh-feed

# 2. Restore topic ACL if changed:
curl -X PUT http://lakshmi:3001/api/v1/admin/topics/NFO_EQ/acl \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"publishers":["svc-ganesh"],"subscribers":["svc-strategy-factory"]}'

# 3. Re-bind MQ exchange:
rabbitmqctl set_topic_permissions -p / lakshmi "lakshmi\..*" "lakshmi\..*" "lakshmi\..*"

# 4. Verify routing key matches between publisher and Lakshmi:
# Publisher: routingKey = "lakshmi.NFO_EQ.tick"
# Lakshmi binding: "lakshmi.#" → exchange "lakshmi_feed"
```

### Verification
- [ ] `lakshmi_topic_message_rate{NFO_EQ}` > 0
- [ ] Subscriber receives test message published manually:
```bash
rabbitmqadmin publish exchange=lakshmi_feed routing_key=lakshmi.NFO_EQ.tick \
  payload='{"t":"test","price":100}' properties='{"content_type":"application/json"}'
```
- [ ] Queue depth increasing normally
- [ ] Upstream publisher reports success

### Prevention
- Topic message rate alerts (0 for >30 seconds)
- ACL changes require approval and audit log
- Upstream publisher health monitoring cross-checked with topic rates
- Daily topic health report automated via cron

---

## Problem 5: Memory Leak / RSS Growth

### Symptoms
- `lakshmi_memory_usage_bytes` steadily grows over hours/days
- Node.js heap usage approaches `max-old-space-size`
- GC pause duration increasing
- Eventually OOM or crash after days of uptime
- Throughput gradually declining

### Diagnosis
```bash
# 1. Capture heap snapshot
curl -X POST http://lakshmi:3001/api/v1/admin/heap-snapshot > heap-$(date +%s).heapsnapshot

# 2. Compare snapshots taken 6 hours apart:
node --inspect compare-snapshots.js heap-1.heapsnapshot heap-2.heapsnapshot

# 3. Check for common leak sources:
# - Unbounded topic message arrays
# - Unclosed WebSocket connections (event listeners)
# - Growing JWT cache without eviction
# - Redis connection pool not releasing

# 4. Monitor GC metrics:
curl http://lakshmi:9090/metrics | grep gc_pause
```

### Root Cause
- Event listeners not removed on WebSocket disconnect (accumulated references)
- In-memory message buffer growing without bound (no max size configured)
- JWT token cache growing without LRU eviction
- Redis pipeline results accumulating without callback
- `setInterval` / `setTimeout` not cleared on component shutdown
- Large object retained in closure scope

### Resolution
```bash
# 1. Restart Lakshmi as immediate mitigation:
systemctl restart lakshmi

# 2. Apply fixes in code:
# - Add max size to message buffer: buffer = new RingBuffer(10000)
# - Remove listeners on disconnect: ws.removeAllListeners()
# - Use LRU cache: cache = new LRU({ max: 5000, ttl: 300000 })
# - Clear intervals in destroy(): clearInterval(this.heartbeatTimer)

# 3. Reduce max-old-space-size to trigger GC before OOM:
node --max-old-space-size=1536 server.js

# 4. Enable heap dump on OOM for post-mortem:
node --heapsnapshot-on-signal=SIGUSR2 server.js
```

### Verification
- [ ] RSS stable over 24-hour period (within ±10%)
- [ ] No OOM crashes for 7 days
- [ ] Heap snapshots show no retained object growth
- [ ] GC pause p99 below 50ms

### Prevention
- Memory alert at 6 GB RSS (P2)
- RSS growth rate alert (>100 MB/hour)
- Weekly automated memory profiling in staging
- Max buffer sizes configured for all in-memory structures
- Static analysis rule: all event listeners must have corresponding `removeListener`

---

## Problem 6: Redis Connection Failure

### Symptoms
- `lakshmi_redis_connections` drops to 0
- Cache misses spike (hit rate drops from ~95% to <5%)
- Latency increases (cache bypass means MQ round-trip per message)
- `/api/v1/health/ready` returns `redis: false`
- Logs: `ECONNREFUSED` or `READONLY` error

### Diagnosis
```bash
# 1. Check Redis process
redis-cli -h redis-host -p 6380 ping

# 2. Check Redis role (primary/replica)
redis-cli -h redis-host -p 6380 info replication | grep role

# 3. Check connectivity
nc -zv redis-host 6380

# 4. Check Lakshmi Redis config
grep -A 5 '"redis"' /etc/lakshmi/config.json

# 5. Verify TLS
openssl s_client -connect redis-host:6380 -cert /etc/lakshmi/certs/lakshmi-redis.pem -key /etc/lakshmi/certs/lakshmi-redis-key.pem
```

### Root Cause
- Redis process crashed or was restarted
- Redis failover occurred (replica became primary; Lakshmi connected to old primary)
- Memory limit reached (`maxmemory` evicting keys)
- Network partition
- Sentinel misconfiguration (Lakshmi not using Sentinel discovery)

### Resolution
```bash
# 1. Restart Redis if crashed:
systemctl restart redis-server

# 2. Reconfigure Lakshmi to use Redis Sentinel for auto-failover:
# "redis": { "sentinels": ["sentinel-1:26379", "sentinel-2:26379"], "master_name": "lakshmi-cache" }

# 3. Increase Redis memory limit:
redis-cli CONFIG SET maxmemory 4gb

# 4. Validate sentinel quorum:
redis-cli -h sentinel-1 -p 26379 SENTINEL MASTER lakshmi-cache
```

### Verification
- [ ] `lakshmi_redis_connections` > 0
- [ ] Cache hit rate returns to >90%
- [ ] Redis ping returns PONG from all sentinel nodes
- [ ] `/api/v1/health/ready` shows `redis: true`

### Prevention
- Redis connection monitoring with P1 alert on disconnect
- Use Redis Sentinel or Cluster for HA
- Redis memory monitoring; alert at 80% maxmemory
- Lakshmi should use Sentinel-aware Redis client (`ioredis`)
- Fallback in-memory cache with 30s TTL (cache degradation, not failure)

---

## Problem 7: RabbitMQ Queue Depth Continuously Growing

### Symptoms
- `lakshmi_queue_depth` graph trending upward with no plateau
- Messages eventually dropped (TTL expiry) or moved to DLQ
- Subscribers receiving data with increasing delay
- MQ disk usage approaching limit

### Diagnosis
```bash
# 1. Find which queue is growing
rabbitmqctl list_queues name messages messages_ready messages_unacknowledged | sort -k2 -n -r | head -10

# 2. Check consumer count
rabbitmqctl list_queues name consumers | grep <queue-name>

# 3. Check consumer processing rate
rabbitmqctl list_queues name message_stats.publish_details.rate message_stats.deliver_get_details.rate

# 4. Check TTL configuration
rabbitmqctl list_queues name arguments | grep <queue-name>

# 5. Check if consumers are connected
netstat -an | grep <consumer-port>
```

### Root Cause
- Consume rate < publish rate (consumer bottleneck)
- Subscriber process crashed and queue has no active consumers
- Consumer prefetch too low, causing round-trip latency
- Consumer acknowledgements delayed (slow downstream processing)
- TTL not configured, so messages accumulate indefinitely

### Resolution
```bash
# 1. Purge queue (drastic, use only if data is stale):
rabbitmqctl purge_queue <queue-name>

# 2. Add more consumers (scale horizontally):
# Start additional Lakshmi consumer instances

# 3. Increase consumer prefetch:
# channel.prefetch(100)  # from 10

# 4. Set TTL on queue:
rabbitmqctl set_policy TTL "lakshmi\..*" '{"message-ttl":60000}' --apply-to queues

# 5. Implement dead-letter exchange for overflow:
rabbitmqctl set_policy DLX "lakshmi\..*" '{"dead-letter-exchange":"lakshmi_dlx"}' --apply-to queues
```

### Verification
- [ ] Queue depth decreasing (consume rate > publish rate)
- [ ] No messages exceeding TTL
- [ ] Consumer count ≥ 1 for all active queues
- [ ] MQ disk usage stabilising

### Prevention
- Queue depth alert at >1000 (P1)
- Auto-scale consumer count based on queue depth
- All queues must have TTL and DLX configured
- Daily queue depth report
- Consumer heartbeat monitoring

---

## Problem 8: Certificate Expiry / TLS Handshake Failure

### Symptoms
- Connection failures with `UNABLE_TO_VERIFY_LEAF_SIGNATURE` or `CERT_HAS_EXPIRED`
- Inter-service communication broken (MQ, Redis, Narad, Suraksha)
- Health probes failing across dependencies
- Error logs referencing TLS/SSL errors

### Diagnosis
```bash
# 1. Check certificate expiry date
openssl x509 -in /etc/lakshmi/certs/lakshmi-server.pem -noout -enddate

# 2. Verify certificate chain
openssl verify -CAfile /etc/lakshmi/certs/suraksha-ca.pem /etc/lakshmi/certs/lakshmi-server.pem

# 3. Test TLS handshake to dependencies
openssl s_client -connect mq-host:5671 </dev/null 2>&1 | grep "Verify return code"

# 4. Check Suraksha PKI status
curl http://suraksha:8445/api/v1/health
```

### Root Cause
- Server certificate expired (not renewed by Suraksha auto-renewal)
- CA certificate rotated without updating trust store
- Certificate chain incomplete (missing intermediate)
- Hostname mismatch between certificate CN/SAN and actual hostname
- Suraksha PKI service unavailable (auto-renewal failed silently)

### Resolution
```bash
# 1. Manual certificate renewal via Suraksha:
curl -X POST https://suraksha:8445/api/v1/certificate/renew \
  -H "Authorization: Bearer $SERVICE_TOKEN" \
  -d '{"service":"lakshmi","instance_id":"lakshmi-node-3"}'

# 2. Update expired certificate:
cp /path/to/new-cert.pem /etc/lakshmi/certs/lakshmi-server.pem
cp /path/to/new-key.pem /etc/lakshmi/certs/lakshmi-server-key.pem

# 3. Reload certificates without restart:
curl -X POST http://lakshmi:3001/api/v1/admin/certs/reload

# 4. If Suraksha is unavailable, generate emergency self-signed cert:
openssl req -x509 -newkey rsa:4096 -keyout emergency-key.pem -out emergency-cert.pem -days 7 -nodes

# 5. Update CA trust store if CA rotated:
cp /path/to/new-ca.pem /etc/lakshmi/certs/suraksha-ca.pem
```

### Verification
- [ ] `openssl verify` passes for all certificates
- [ ] TLS handshake succeeds to all dependencies
- [ ] Suraksha PKI health returns OK
- [ ] All certs expire in >14 days

### Prevention
- Certificate expiry monitoring via Suraksha and Grafana
- Alert at 30 days, 14 days, 7 days, 1 day before expiry
- Automated renewal via Suraksha cron (runs daily)
- Nagios/Sensu check for certificate expiry on all Lakshmi nodes
- Monthly cert rotation drill in staging

---

## Problem 9: High CPU with Normal Throughput

### Symptoms
- `lakshmi_cpu_usage_percent` >80% sustained
- Throughput unchanged (same messages/sec)
- Latency slightly increased
- Fan noise, thermal throttling on dedicated hardware

### Diagnosis
```bash
# 1. Profile CPU usage
curl -X POST http://lakshmi:3001/api/v1/admin/profile/start
# 30 seconds later:
curl http://lakshmi:3001/api/v1/admin/profile/stop > cpu-profile.cpuprofile

# 2. Analyse hot functions (load in Chrome DevTools or clinic.js)
clinic doctor -- node server.js

# 3. Check for tight loops / busy-wait
# strace -p $(pgrep node) -c  # on Linux; use Process Monitor on Windows

# 4. Check GC frequency
curl http://lakshmi:9090/metrics | grep gc_count
```

### Root Cause
- Inefficient serialisation loop (e.g., `JSON.stringify` per message instead of pre-serialised)
- Repeated string concatenation in hot path
- Unnecessary deep clone of message objects
- Monitoring/metrics collection too frequent (<1s scrape interval)
- Regex parsing in message routing (precompile regex)
- `setImmediate` or `process.nextTick` recursion causing microtask queue overflow

### Resolution
```bash
# 1. Pre-serialise messages at publisher (parse once, send raw):
# Before: JSON.stringify(message)
# After:  message already serialised by upstream

# 2. Use string interning for topic names:
const TOPICS = Object.freeze({ NFO_EQ: 'NFO_EQ', NFO_FUT: 'NFO_FUT' });

# 3. Pre-compile routing regex:
const ROUTE_RE = /^lakshmi\.(.+)\.(tick|bar|snapshot|depth)$/;

# 4. Increase metrics scrape interval from 1s to 5s:
# Prometheus: scrape_interval: 5s

# 5. Offload serialisation to worker threads:
const { Worker } = require('worker_threads');
```

### Verification
- [ ] CPU stabilises below 60% at target throughput
- [ ] CPU profile confirms hot spots eliminated
- [ ] No tight loops in CPU profile
- [ ] Throughput maintained or improved

### Prevention
- CPU profiling as part of performance regression suite
- Alert at >80% sustained CPU (P2)
- Code review checklist: no synchronous serialisation in hot path
- Weekly performance report tracks CPU/throughput ratio

---

## Problem 10: Monitoring / Grafana Dashboard Shows No Data

### Symptoms
- Grafana panels display "No data points"
- Prometheus target shows Lakshmi as "DOWN"
- `/api/v1/metrics` endpoint returns 404 or connection refused
- Alertmanager firing `PrometheusTargetMissing` alert

### Diagnosis
```bash
# 1. Verify metrics endpoint
curl -v http://lakshmi:3001/api/v1/metrics

# 2. Check Prometheus scrape config
grep -A 10 "lakshmi" /etc/prometheus/prometheus.yml

# 3. Verify Prometheus can reach Lakshmi
curl http://prometheus:9090/api/v1/targets | jq '.data.activeTargets[] | select(.labels.job=="lakshmi")'

# 4. Check if metrics port is listening
netstat -tlnp | grep 9090

# 5. Check InfluxDB write status
curl http://lakshmi:3001/api/v1/health/influxdb
```

### Root Cause
- Prometheus scrape configuration incorrect (wrong port, path, or TLS settings)
- Firewall blocking metrics port (9090) from Prometheus server
- Metrics collection module crashed or not initialised
- InfluxDB connection down (time-series write fails silently)
- Lakshmi configured with `monitoring: false`
- TLS certificate on metrics endpoint expired

### Resolution
```bash
# 1. Verify and fix Prometheus scrape config:
scrape_configs:
  - job_name: 'lakshmi'
    scrape_interval: 5s
    scheme: https
    tls_config:
      ca_file: /etc/prometheus/certs/suraksha-ca.pem
    static_configs:
      - targets: ['lakshmi-host:9090']

# 2. Verify firewall allows Prometheus → Lakshmi:9090:
iptables -L INPUT -n | grep 9090

# 3. Enable monitoring if disabled:
# "monitoring": { "enabled": true, "port": 9090 }

# 4. Restart Lakshmi with monitoring enabled:
systemctl restart lakshmi

# 5. Check InfluxDB and restart if needed:
systemctl restart influxdb
```

### Verification
- [ ] `curl http://lakshmi:3001/api/v1/metrics` returns OpenMetrics data
- [ ] Prometheus targets page shows Lakshmi as "UP" with scrape duration
- [ ] Grafana dashboards show data within 1 minute
- [ ] InfluxDB receiving writes (check `lakshmi_heartbeat` in InfluxDB)

### Prevention
- Prometheus "TargetDown" alert with 1-minute threshold
- Health check endpoint includes monitoring subsystem status
- Infrastructure-as-Code ensures consistent Prometheus scrape config
- Smoke test after every deployment validates metrics are flowing
- Monitoring port firewalling reviewed during change management
