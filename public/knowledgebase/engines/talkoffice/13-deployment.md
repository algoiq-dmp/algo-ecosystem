# TalkOffice — Deployment Guide

**Version:** 4.0.0 | **Owner:** Operations | **Last Updated:** 2026-07-25

## Deployment Strategy

TalkOffice v4.0.0 deploys on **ALGO IQ 19** (`192.168.190.119`) as containerized services managed by Narad deployment orchestrator.

## Deployment Architecture

```
┌────────────────────────────────────────┐
│         ALGO IQ 19 (192.168.190.119)         │
│  ┌──────────┐ ┌──────────┐ ┌────────┐ │
│  │  Core    │ │   API    │ │Worker  │ │
│  │ Container│ │Container │ │Container│ │
│  └──────────┘ └──────────┘ └────────┘ │
│       ↑             ↑            ↑     │
│  ┌──────────────────────────────────┐ │
│  │     Narad Deployment Manager     │ │
│  └──────────────────────────────────┘ │
└────────────────────────────────────────┘
```

## Deployment Environments

| Environment | Server | Purpose | Approval |
|-------------|--------|---------|----------|
| Development | dev-cluster | Active development | Self-serve |
| Staging | stage-cluster | Pre-release validation | QA lead |
| Production | ALGO IQ 19 | Live trading operations | Senior Engineer + DXCC |

## Deployment Process

### 1. Pre-Deployment Checklist
- All tests passing in CI (Parikshak green)
- Database migrations reviewed and backward-compatible
- Release notes published in Narad
- Rollback plan documented and approved
- Change window scheduled (preferred: market closed hours)

### 2. Staging Deployment
```bash
narad deploy talkoffice --env staging --version 4.0.0 --strategy rolling
```

### 3. Smoke Tests
```bash
parikshak smoke-test --target talkoffice --env staging
```

### 4. Production Deployment
```bash
narad deploy talkoffice --env production --version 4.0.0 \
  --strategy blue-green \
  --health-check-path /api/v1/health \
  --health-check-retries 10 \
  --rollback-on-failure true
```

## Rollback Procedure

```bash
narad rollback talkoffice --env production --version 4.0.0
```

### Rollback Triggers (Automatic)
- Health check fails 3 consecutive times
- Error rate exceeds 5% within 5 minutes of deployment
- P99 latency exceeds 500ms threshold
- MQ consumer disconnection detected

## Deployment Strategies

| Strategy | Downtime | Risk | Use Case |
|----------|----------|------|----------|
| Rolling update | Zero | Medium | Standard releases |
| Blue-green | Zero | Low | Major version bumps |
| Canary | Zero | Lowest | High-risk changes |
| Recreate | 30-60s | High | Database schema changes |

## Post-Deployment Verification
1. Monitor Grafana dashboard for 15 minutes
2. Verify consumer health in DXCC
3. Check error rates and latency in Narad telemetry
4. Confirm downstream consumers receiving data normally
5. Update deployment status in Narad registry
