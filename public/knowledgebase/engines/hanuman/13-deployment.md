# 13 — Deployment

> **Version:** v2.1.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## Deployment Environments

| Environment | Servers | Purpose |
|-------------|---------|---------|
| Production | hanuman01-mum, hanuman02-mum | Live strategy execution |
| Production DR | hanuman01-nm | DR standby |
| UAT | hanuman-uat-01 | Strategy testing with UAT ODIN |
| Staging | hanuman-stg-01 | Pre-prod validation |
| Dev | hanuman-dev-01 | Strategy development |

## Deployment Strategy

### Rolling Deployment

1. Deploy to UAT first; run test strategies for 24 hours
2. Deploy to staging; validate against production-like market data replay
3. Deploy to DR standby (hanuman01-nm)
4. Promote DR standby to active temporarily
5. Deploy to production servers while DR handles execution
6. Promote production back to active; demote DR to standby

**Deployment window:** Saturday 10:00-14:00 IST

### Emergency Rollback

```bash
# 1. Stop all strategies on affected server
hanumanctl emergency-stop --all

# 2. Downgrade package
dnf downgrade lakshmi-hanuman-2.0.3

# 3. Restore checkpoint from pre-deployment backup
hanumanctl checkpoint restore --file /backup/hanuman/pre-deploy-20260725.chk

# 4. Re-start strategies
hanumanctl start --all
```

## Production Deployment Checklist

### Pre-Deployment
- [ ] All strategies validated against new version in UAT for 24 hours
- [ ] No P&L discrepancies between old and new version in staging
- [ ] Risk checks verified (margin, position limits, circuit breakers)
- [ ] Change request approved by Execution desk lead
- [ ] Strategy developers notified 48 hours in advance
- [ ] All Vega strategy definitions compatible with new parser version

### During Deployment
- [ ] Stop all strategies on target server before deployment
- [ ] Verify zero pending orders via ODIN
- [ ] Deploy and start server
- [ ] Load and start strategies one at a time
- [ ] Verify P&L continuity after restart
- [ ] Monitor for 30 minutes before declaring success

### Post-Deployment
- [ ] Monitor all strategies for one full trading day
- [ ] Verify P&L matches pre-deployment baseline (within tolerance)
- [ ] No strategy errors or risk veto spikes in Narad
- [ ] Close change request

## Strategy Rollout Process

New strategies follow a separate deployment process:
1. Developer writes Vega DSL file and validates locally
2. Code review by Execution desk lead
3. Deploy to UAT; run against market replay for 5 trading days
4. Performance review: P&L, sharpe, drawdown, fill ratio
5. If approved, deploy to production as INACTIVE
6. Activate during low-volatility window (11:00-12:00 IST)
7. Monitor with small position size (1-2 lots) for 3 days
8. Scale up to full position size after successful trial
