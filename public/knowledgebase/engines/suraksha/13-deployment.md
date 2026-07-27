# 13 â€” Deployment Guide

**Version:** 2.0.0 | **Owner:** Security | **Last Updated:** 2026-07-24

---

## Deployment Environments

| Environment | URL |
|---|---|
| Development | `http://localhost:3004` |
| Staging | `https://suraksha-staging.algoiq.io` |
| Production | `https://suraksha.algoiq.io` |

## Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: suraksha
spec:
  replicas: 3
  selector:
    matchLabels:
      app: suraksha
  template:
    spec:
      containers:
      - name: suraksha
        image: algoiq/suraksha:2.0.0
        ports:
        - containerPort: 3004
        - containerPort: 9092
        env:
        - name: NODE_ENV
          value: "production"
        - name: SURAKSHA_VAULT_TOKEN
          valueFrom:
            secretKeyRef:
              name: suraksha-secrets
              key: vault-token
        livenessProbe:
          httpGet:
            path: /api/v1/health
            port: 3004
          initialDelaySeconds: 15
          periodSeconds: 15
        readinessProbe:
          httpGet:
            path: /api/v1/health
            port: 3004
          initialDelaySeconds: 10
          periodSeconds: 10
```

## Pre-Deployment Checklist

- [ ] Vault unsealed and healthy
- [ ] JWT signing keys generated and stored in Vault
- [ ] Database migrations tested on staging
- [ ] All secrets seeded in Vault
- [ ] Certificate manager configured with ACME credentials
- [ ] PagerDuty integration tested
- [ ] Rollback plan documented

## JWT Key Rotation During Deployment

```bash
# Add new key
node scripts/rotate-jwt-key.js --add-key suraksha-key-2026-08

# Wait for all old tokens to expire (15 min max)
sleep 900

# Remove old key
node scripts/rotate-jwt-key.js --remove-key suraksha-key-2026-07
```

## Rollback

```bash
kubectl rollout undo deployment/suraksha
```

JWT key rollback: Keep old key active until all tokens from the new key expire, then remove.

## Post-Deployment Verification

- [ ] Health check on all instances
- [ ] JWT token issuance and validation working
- [ ] Authorization checks returning correct decisions
- [ ] Vault accessible and secrets retrievable
- [ ] Certificate inventory shows all certs valid
- [ ] Threat detection engine processing events
