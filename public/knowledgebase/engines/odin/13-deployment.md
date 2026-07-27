# 13 — Deployment

> **Version:** v3.0.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## Deployment Environments

| Environment | Servers | Purpose |
|-------------|---------|---------|
| Production | odin01-mum, odin02-mum, odin03-mum | Live order routing |
| Production DR | odin01-nm | DR standby |
| UAT | odin-uat-01 | Testing with UAT exchange simulators |
| Staging | odin-stg-01 | Pre-production validation |
| Dev | odin-dev-01 | Development and integration |

## Deployment Strategy

### Rolling Deployment with Path Redundancy

ODIN leverages multi-path routing for zero-downtime deployments:

1. Deploy to odin02-mum (secondary paths: Diet adapters)
2. Primary path (odin01-mum direct APIs) continues serving orders
3. Test secondary path with a subset of orders
4. If odin02-mum stable, deploy to odin01-mum
5. During odin01-mum restart, orders route through odin02-mum (secondary path)
6. After odin01-mum recovery, routing returns to primary path

**Total deployment time:** approximately 45 minutes for 3 servers.

### Pre-Market Deployment (Preferred)

For major version changes:
1. Deploy Saturday 10:00-14:00 IST
2. Verify adapter connectivity and test orders (mock exchange or test symbol)
3. Run EOD reconciliation simulation
4. Ready for Monday trading

### Rollback

```bash
# 1. Stop ODIN on target server
systemctl stop odind

# 2. Downgrade package
dnf downgrade lakshmi-odin-2.9.5

# 3. Restore database snapshot (if schema migration was applied)
odinctl db rollback --to-version 2.9.5

# 4. Start ODIN
systemctl start odind

# 5. Verify adapter connectivity
odinctl adapter status
```

## Production Changes

### Adding a New Exchange Segment

1. Configure new adapter in `config.yaml`
2. Update exchange connectivity (firewall rules, VLAN)
3. Test with `odinctl adapter test`
4. Update strategy engines to publish orders to new topic
5. Monitor for one full trading day

### Adding a New Adapter

1. Install adapter library: `libodin_new_adapter.so`
2. Add adapter config to `config.yaml`
3. Reload configuration: `odinctl reload adapters`
4. Verify: `odinctl adapter status`
5. Set priority to 2 initially (secondary path), then promote to 1 after validation
