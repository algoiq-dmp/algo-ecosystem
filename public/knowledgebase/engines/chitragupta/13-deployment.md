# Chitragupta - Deployment

**Version:** 3.0.0 | **Owner:** Compliance | **Last Updated:** 2026-07-25


## Deployment Environments

| Environment | Server | Purpose | Auto-Deploy |
|-------------|--------|---------|-------------|
| Development | ALGO IQ DEV | Local testing and iteration | Manual |
| Staging | ALGO IQ STAGE | Pre-production validation | On PR merge |
| Production | ALGO IQ 4 (192.168.190.104) | Live trading | Manual approval |

## Deployment Process

### 1. Build Artifact

`ash
npm run build
tar -czf algo-engine-build.tar.gz dist/ config/ migrations/
```

### 2. Transfer to Target Server

`ash
scp algo-engine-build.tar.gz user@192.168.190.104:/opt/algo/releases/
```

### 3. Extract and Link

`ash
cd /opt/algo/releases
tar -xzf algo-engine-build.tar.gz -C v2.5.0
ln -sfn v2.5.0 /opt/algo/current
```

### 4. Database Migration

`ash
cd /opt/algo/current
npm run db:migrate
```

### 5. Restart Service

`ash
pm2 reload ecosystem.config.js --update-env
```

## Rollback Procedure

`ash
ln -sfn /opt/algo/releases/v2.4.0 /opt/algo/current
pm2 reload ecosystem.config.js
```
For database rollback:

`ash
npm run db:rollback
```

## Health Check Post-Deployment

1. Verify PM2 process status: pm2 status
2. Hit health endpoint: curl https://localhost:3000/api/v1/health
3. Check logs for errors: 	ail -f /var/log/algo/engine.log
4. Verify MQ connectivity: Check RabbitMQ management console
5. Validate signal generation: Monitor Narad dashboard

## CI/CD Integration

The deployment pipeline is defined in GitHub Actions with the following stages:
1. Lint & Type Check
2. Unit & Integration Tests
3. Build Artifact
4. Deploy to Staging
5. Smoke Tests
6. Manual Approval Gate
7. Deploy to Production

