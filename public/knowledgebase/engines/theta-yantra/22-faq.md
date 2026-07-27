# Theta Yantra - FAQ

**Version:** 3.1.0 | **Owner:** Analytics | **Last Updated:** 2026-07-25


## General Questions

### Q: What is the primary purpose of 
**A:** Advanced options analytics, Greeks, volatility surfaces, pricing

### Q: Which server does this run on?
**A:** The engine runs on the dedicated ALGO IQ server infrastructure (192.168.190.104 for production).

### Q: What are the hardware requirements?
**A:** Minimum 8 CPU cores, 32GB RAM, 100GB SSD. Recommended: 16 cores, 64GB RAM, 500GB NVMe SSD for production workloads.

## Operational Questions

### Q: How do I restart the engine safely?
**A:** Use pm2 reload algo-engine for a zero-downtime restart. For full restart: pm2 restart algo-engine. Always verify health endpoint returns 200 after restart.

### Q: How do I add a new configuration value?
**A:** Add the value to the appropriate section in env.config.toml, then hot-reload via PUT /api/v1/config or restart the engine. Refer to the Configuration documentation for the full schema.

### Q: What happens if the database goes down during market hours?
**A:** Signal generation continues using cached data. Signal logging to TimescaleDB is buffered in memory (up to 10,000 records) and flushed when connectivity is restored. Historical queries will fail until recovery.

### Q: How do I check if signal generation is working?
**A:** Hit GET /api/v1/status to see per-strategy status. Check the Narad dashboard for live signal feed. Query TimescaleDB: SELECT count(*) FROM signals_log WHERE created_at > now() - interval '5 minutes'.

## Troubleshooting Questions

### Q: Why are signals not reaching Kuber Alpha?
**A:** Check MQ connectivity, verify the exchange binding in RabbitMQ management, check Kuber Alpha consumer status. Run POST /api/v1/mq/reconnect to force reconnection.

### Q: Memory usage keeps growing â€” is this a leak?
**A:** Gradual growth is normal due to caching. Sudden spikes or unbounded growth indicate a memory leak. Enable heap dumps: 
ode --heapsnapshot-signal=SIGUSR1. Contact development team for analysis.

### Q: How do I roll back a bad deployment?
**A:** Run ln -sfn /opt/algo/releases/v<previous-version> /opt/algo/current && pm2 reload ecosystem.config.js. If database migrations were applied, also run 
pm run db:rollback.

## Integration Questions

### Q: How does the engine authenticate with other services?
**A:** All inter-service authentication uses Suraksha JWT tokens or mTLS certificates. Service-to-service API calls include the Authorization header. MQ connections use TLS with client certificate verification.

### Q: Can I connect external monitoring tools?
**A:** Yes. The engine exposes a Prometheus-compatible metrics endpoint at /api/v1/metrics. Structured JSON logs can be consumed by any log aggregator. Narad dashboard is the recommended visualization layer.

