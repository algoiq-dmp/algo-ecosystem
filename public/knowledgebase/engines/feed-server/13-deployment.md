# 13 — Deployment

> **Version:** v2.8.0 | **Owner:** Market Data | **Last Updated:** 2026-07-25

## Deployment Environments

| Environment | Servers | Exchanges | Purpose |
|-------------|---------|-----------|---------|
| Production (Mumbai) | feed01-mum, feed02-mum, feed03-mum | All exchanges | Live trading |
| Production (Navi Mumbai) | feed01-nmum, feed02-nmum | NSE, BSE | Live trading (DR) |
| UAT | feed-uat-01 | NSE-CM | User acceptance testing |
| Staging | feed-stg-01 | All (replay only) | Pre-production validation |
| Dev | feed-dev-01, feed-dev-02 | All (replay/sim) | Development and integration |

## Deployment Strategy

### Blue-Green Deployment

1. Deploy new version to staging environment first.
2. Run 24-hour soak test with production-like feed replay.
3. Deploy to standby instances in production (e.g., feed01-mum standby process).
4. Promote standby to active via `feeddctl promote`.
5. Monitor for 15 minutes; if stable, deploy to remaining instances.
6. If anomalies detected, demote via `feeddctl demote` and rollback.

### Rollback Procedure

```bash
# Stop the active process
systemctl stop feedd@nse-cm-01

# Reinstall previous version
dnf downgrade lakshmi-feedd-2.7.3

# Promote standby as active
feeddctl promote --instance feedd-nse-cm-01-standby

# Start previous version on primary
systemctl start feedd@nse-cm-01
feeddctl demote --instance feedd-nse-cm-01
```

## Production Deployment Checklist

### Pre-Deployment
- [ ] Staging soak test passed (24 hours, zero gaps, latency < 50us p99)
- [ ] All integration tests passed against MQ v5.1.x, Narad v3.x, Suraksha v2.x
- [ ] Rollback plan documented and approved by Market Data lead
- [ ] Change request approved in ServiceNow: CHG-XXXXX
- [ ] Notification sent to trading desk (24h advance for production)

### During Deployment
- [ ] Deployment window: Saturday 10:00–14:00 IST (non-trading)
- [ ] Standby instance deployed first and validated
- [ ] Active/standby swap executed and verified
- [ ] All feeds show CONNECTED with zero gaps for 5 minutes
- [ ] MQ topic stats show expected message rates
- [ ] Prometheus dashboards show no metric degradation

### Post-Deployment
- [ ] Monitor for full trading day Monday before declaring success
- [ ] Update CMDB with new version
- [ ] Close change request
- [ ] Tag release in Git: `git tag -a feedd-v2.8.0-prod`

## Container Deployment (Development Only)

For development and CI/CD, a Docker-based deployment is available (not for production due to DPDK requirements):

```bash
docker run -d \
  --name feedd-dev \
  --cap-add=SYS_PTRACE \
  --ulimit memlock=-1:-1 \
  -v /dev/hugepages:/dev/hugepages \
  -v /etc/lakshmi/feedd:/etc/lakshmi/feedd:ro \
  registry.internal/lakshmi/feedd:2.8.0-dev
```

Production MUST run on bare metal with DPDK kernel bypass. Container-based deployment is insufficient for sub-50us latency targets.
