# DXCC — Deployment Guide

> **Version:** 2.0.0 | **Status:** Draft | **Owner:** DXCC Team | **Last Updated:** 2026-07-24

---

## Deployment Environments

| Environment | Purpose | Access | Refresh |
|-------------|---------|--------|---------|
| **Development** | Local developer workstations | `localhost:5173` | Continuous (HMR) |
| **Staging** | Integration testing, UAT | `https://dxcc-staging.internal` | Per-merge to `staging` branch |
| **Production** | Live trading operations | `https://dxcc.internal` | Manual promotion via CI/CD |

---

## Docker Containerization

### Backend Dockerfile

```dockerfile
# Stage 1: Build
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -ldflags="-s -w -X main.version=2.0.0" -o dxcc-server ./cmd/server/

# Stage 2: Runtime
FROM alpine:3.19
RUN apk add --no-cache ca-certificates tzdata
WORKDIR /app
COPY --from=builder /app/dxcc-server .
COPY config.json .
EXPOSE 8080
HEALTHCHECK --interval=15s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:8080/health || exit 1
ENTRYPOINT ["./dxcc-server"]
```

### Frontend Dockerfile

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM nginx:1.25-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=15s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:80/ || exit 1
```

---

## Nginx Reverse Proxy Configuration

```nginx
upstream dxcc_api {
    server dxcc-backend-1:8080 max_fails=3 fail_timeout=30s;
    server dxcc-backend-2:8080 max_fails=3 fail_timeout=30s backup;
}

upstream narad_ws {
    server narad-gateway-1:443;
    server narad-gateway-2:443;
}

server {
    listen 443 ssl http2;
    server_name dxcc.internal;

    ssl_certificate /etc/ssl/dxcc.crt;
    ssl_certificate_key /etc/ssl/dxcc.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    client_max_body_size 50M;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' wss://narad-gateway.internal;" always;

    # Serve frontend static files
    location / {
        root /var/www/dxcc;
        try_files $uri $uri/ /index.html;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API proxy
    location /api/ {
        proxy_pass http://dxcc_api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
    }

    # WebSocket proxy for Narad
    location /ws/ {
        proxy_pass https://narad_ws;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 86400s;
    }
}
```

---

## Health Check Endpoint

```
GET /health
```

**Response (200 OK):**

```json
{
  "status": "ok",
  "version": "2.0.0",
  "uptime_seconds": 86400,
  "narad_connected": true,
  "postgresql_connected": true,
  "redis_connected": true,
  "goroutines": 42,
  "memory_alloc_mb": 64
}
```

**Response (503 Service Unavailable):**

```json
{
  "status": "degraded",
  "version": "2.0.0",
  "uptime_seconds": 86400,
  "narad_connected": false,
  "postgresql_connected": true,
  "redis_connected": true,
  "errors": ["narad_ws_disconnected"]
}
```

Load balancers should use this endpoint for health checks with a 15-second interval.

---

## Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: dxcc-backend
  labels:
    app: dxcc
    component: backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: dxcc
      component: backend
  template:
    metadata:
      labels:
        app: dxcc
        component: backend
    spec:
      containers:
      - name: dxcc-backend
        image: registry.internal/dxcc-backend:2.0.0
        ports:
        - containerPort: 8080
          name: http
        env:
        - name: DXCC_DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: dxcc-secrets
              key: db-password
        - name: DXCC_JWT_PRIVATE_KEY
          valueFrom:
            secretKeyRef:
              name: dxcc-secrets
              key: jwt-private-key
        - name: DXCC_SESSION_SECRET
          valueFrom:
            secretKeyRef:
              name: dxcc-secrets
              key: session-secret
        resources:
          requests:
            cpu: 500m
            memory: 512Mi
          limits:
            cpu: 2000m
            memory: 2Gi
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 15
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 10
```

---

## Blue-Green Deployment Procedure

1. Deploy new version (green) alongside existing version (blue)
2. Run smoke tests against green deployment
3. Switch load balancer to route traffic to green
4. Monitor for 15 minutes; check error rates and latency
5. If stable, decommission blue deployment
6. If issues detected, immediately switch back to blue

---

## Rollback Procedure

### Immediate Rollback (Kubernetes)

```bash
kubectl rollout undo deployment/dxcc-backend -n dxcc
kubectl rollout status deployment/dxcc-backend -n dxcc
```

### Database Rollback

```bash
# List available migrations
./dxcc-server migrate status

# Rollback last migration
./dxcc-server migrate down 1
```

### Frontend Rollback

```bash
# Restore previous static asset version
kubectl rollout undo deployment/dxcc-frontend -n dxcc

# Or restore from S3/backup bucket
aws s3 cp s3://dxcc-assets/v1.9.0/ /var/www/dxcc/ --recursive
```

---

## Release Checklist

- [ ] All tests passing (unit, integration, E2E)
- [ ] Security scan completed (no HIGH/CRITICAL findings)
- [ ] Performance benchmarks within targets (<100ms widget latency)
- [ ] Database migrations tested and reversible
- [ ] Config changes documented in release notes
- [ ] Staging environment validated by QA
- [ ] UAT checklist completed and signed off
- [ ] Rollback plan documented and tested
- [ ] On-call team notified of deployment window
- [ ] Monitoring dashboards updated for new metrics/alert rules

---

> **Next:** See [14-monitoring.md](14-monitoring.md) for health monitoring and metrics documentation.
