# SpreadWatch — Frequently Asked Questions

**Version:** 2.8.0 | **Owner:** Analytics | **Last Updated:** 2026-07-25

## FAQ

### General

**Q1: What is SpreadWatch?**
Spread analytics engine — arbitrage detection, pair trading, calendar spread analysis, and spread opportunity discovery.

**Q2: Which server does it run on?**
ALGO IQ 4 at IP address `192.168.190.104`, serving on ports `3022`.

**Q3: Who owns this service?**
The **Analytics** team. Contact via Slack `#spreadwatch-support` or email `analytics@algoiq.com`.

### Technical

**Q4: How do I access the API?**
Base URL: `http://192.168.190.104:3022/api/v1/`. Authentication requires a Suraksha-issued JWT token in the `Authorization: Bearer` header.

**Q5: What databases does it use?**
TimescaleDB. The primary database handles transactional data, with Redis for caching and optional TimescaleDB/InfluxDB for time-series data.

**Q6: How do I check if SpreadWatch is healthy?**
```bash
curl http://192.168.190.104:3022/api/v1/health
```
Returns JSON status with version, uptime, and dependency health.

**Q7: What's the current version?**
v2.8.0. Check `/api/v1/status` for detailed version information including source module versions.

**Q8: How does it communicate with other services?**
Via REST (HTTP/TLS), AMQP (RabbitMQ pub/sub), and Narad TCP connector (service registry). It consumes from Ganesh, MQ, Surya, Lakshmi and publishes to Kuber Alpha, DXCC.

### Operations

**Q9: How do I deploy a new version?**
```bash
narad deploy spreadwatch --version <new-version> --env production
```
Use blue-green strategy for zero-downtime deployments. See [Deployment Guide](./13-deployment.md).

**Q10: How do I rollback a bad deployment?**
```bash
narad rollback spreadwatch --version 2.8.0
```
Automatic rollback triggers if health checks fail 3 times consecutively.

**Q11: How do I scale the service?**
```bash
narad scale spreadwatch --replicas <count>
```
Maximum recommended: 8 replicas per instance. API layer scales horizontally; core engine runs single instance with hot standby.

**Q12: What's the data retention policy?**
- Hot data (24h): In-memory + Redis
- Warm data (7 days): Primary database
- Cold data (>7 days): Compressed archive
- Maximum retention: 90 days for audit data

### Troubleshooting

**Q13: Service returns 503 errors. What should I do?**
Check if upstream dependencies (Ganesh, MQ) are healthy. The service degrades gracefully when dependencies are down — it serves from cache with a `stale: true` flag.

**Q14: How do I view service logs?**
```bash
narad logs spreadwatch --tail 100 --follow
```
Or directly via container:
```bash
docker logs -f spreadwatch-core
```

**Q15: My API token stopped working. How do I refresh?**
Tokens expire after 60 minutes. Obtain a new token from Suraksha:
```bash
curl -X POST http://192.168.190.106:3110/auth/token \
  -d '{"client_id":"spreadwatch","client_secret":"<secret>"}'
```

**Q16: What's the disaster recovery plan?**
Warm standby in Mumbai DC2. RTO < 15 minutes, RPO < 1 minute. Monthly DR drills verify readiness. Activate via `narad dr-activate spreadwatch`.

**Q17: How do I get API documentation?**
Swagger UI is available at `http://192.168.190.104:3022/docs` when the service is running.

**Q18: Is there a rate limit?**
Yes. Default: 1,000 requests/minute per client. Internal services get higher limits (10,000/min). Adjust via `SPREADWATCH_RATE_LIMIT` config.

**Q19: How does SpreadWatch handle market holidays?**
It ingests holiday calendar from Surya and automatically skips processing for non-trading days. The status endpoint reports `market_status: "closed"` on holidays.

**Q20: Can I contribute to SpreadWatch development?**
Contact the Analytics team. All contributions go through the standard workflow: branch → PR → Parikshak certification → code review → merge to main.
