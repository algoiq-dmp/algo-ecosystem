# 21 — Troubleshooting

> **Version:** v2.5.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## Diagnostic Commands

```bash
# Server status
systemctl status lakshmi-ws-server

# View recent logs
journalctl -u lakshmi-ws-server -f

# Health check
curl http://localhost:8080/health

# Active connections
curl -s http://localhost:9193/metrics | grep ws_connections_active

# Check Node.js process
ps aux | grep "node.*server.js"
```

## Common Issues

### Issue 1: Clients Cannot Connect (TLS Error)

**Symptoms:** Browser console: "WebSocket connection failed", `ERR_CERT_AUTHORITY_INVALID`.

**Resolution:**
```bash
# Check certificate validity
openssl s_client -connect localhost:8443 </dev/null 2>/dev/null | \
    openssl x509 -text -noout | grep -A2 Validity

# Check Vault agent status
systemctl status vault-agent

# Manually renew certificates
vault-agent-trigger renew
```

### Issue 2: Clients Connect but Immediately Disconnect

**Symptoms:** Client connects, receives 4001 close code.

**Causes:**
- JWT token expired or invalid
- JWKS cache stale (Suraksha keys rotated)
- Clock skew between WS server and Suraksha IAM > 30 seconds

**Resolution:**
```bash
# Check system time
timedatectl status

# Check JWKS cache age
grep "jwks" /var/log/lakshmi/ws-server/server.log

# Manually clear JWKS cache
kill -SIGUSR1 $(pidof node)
```

### Issue 3: High Message Drop Rate

**Symptoms:** `ws_messages_dropped_total` counter increasing.

**Causes:**
- Client can't consume fast enough (slow browser/network)
- Too many subscriptions per connection
- Burst of market data (e.g., market open)

**Resolution:**
```bash
# Identify affected clients
grep "message_dropped" /var/log/lakshmi/ws-server/server.log

# Increase backpressure buffer size
# In config.yaml: backpressure.max_buffer_size: 65536

# Reduce subscription count per client
# Or switch to MessagePack for higher throughput
```

### Issue 4: Event Loop Lag

**Symptoms:** `ws_event_loop_lag_sec > 0.1`.

**Causes:**
- Too many connections for available CPU
- JSON serialization overhead on high-throughput topics
- GC pauses from memory pressure

**Resolution:**
```bash
# Check GC behavior
node --trace-gc server.js  # (restart with this flag temporarily)

# Check connection count vs. capacity
curl -s http://localhost:9193/metrics | grep ws_connections_active

# Scale horizontally (add another instance)
# Or reduce max connections per instance
```

### Issue 5: MQ Consumer Lag

**Symptoms:** `ws_mq_consumer_lag` growing.

**Causes:**
- MQ broker overloaded
- Network congestion between WS server and MQ
- Consumer session timeout from missed heartbeats

**Resolution:**
```bash
# Check MQ broker health
mqctl cluster health

# Check network latency
ping mq01-mum

# Restart WS server to force MQ consumer reconnect
systemctl restart lakshmi-ws-server
```

### Issue 6: Memory Leak

**Symptoms:** `ws_heap_used_bytes` growing monotonically over hours/days.

**Resolution:**
```bash
# Generate heap snapshot
kill -SIGUSR2 $(pidof node)  # Writes heap snapshot to /tmp/

# Analyze with Chrome DevTools
# Look for retained objects: MQ consumers not cleaned up, connection state leaks

# Temporary mitigation: schedule daily rolling restart
```
