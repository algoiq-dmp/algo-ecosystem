# 13 — Deployment

## Deployment Environments

| Environment | Purpose | Configuration | Access |
|---|---|---|---|
| **Development** | Local development and unit testing | Local services, TLS disabled | Developer workstation |
| **Testing/QA** | Integration and regression testing | Mirrors production at reduced scale | CI/CD pipeline, QA team |
| **Staging** | Pre-production validation | Production-identical hardware and config | SRE, QA, Product |
| **Production** | Live trading environment | Full high-availability setup | SRE only |

---

## Development Environment Setup

```powershell
# Clone and install
git clone https://github.com/algo-iq/lakshmi.git
cd lakshmi
npm install

# Start local dependencies via Docker
docker-compose -f docker-compose.dev.yml up -d

# Run in development mode (hot reload, debug logging)
npm run dev
```

**docker-compose.dev.yml:**

```yaml
services:
  rabbitmq:
    image: rabbitmq:3.12-management
    ports: ["5672:5672", "15672:15672"]
  redis:
    image: redis:7.2-alpine
    ports: ["6379:6379"]
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: lakshmi
      POSTGRES_USER: lakshmi_app
      POSTGRES_PASSWORD: devpass
    ports: ["5432:5432"]
```

---

## Testing Environment Deployment

### Prerequisites
- Dedicated Windows Server VM (16 GB RAM, 8 cores, 200 GB SSD)
- Network access to test RabbitMQ, Redis, PostgreSQL clusters
- CI/CD pipeline (Jenkins/GitHub Actions) with deployment permissions

### Deployment Steps

```powershell
# Run from CI/CD pipeline
$ErrorActionPreference = "Stop"

# Stop existing instance
pm2 stop lakshmi-test -ErrorAction SilentlyContinue
pm2 delete lakshmi-test -ErrorAction SilentlyContinue

# Deploy
Set-Location C:\lakshmi-test
git checkout testing
git pull origin testing

npm ci --production

# Apply config
Copy-Item "\\config-server\lakshmi\testing\config.json" .\config.json -Force

# Run migrations
node scripts/migrate.js --env testing

# Start
pm2 start ecosystem.config.js --env testing
pm2 save
```

### Verification

```powershell
# Health check
$health = Invoke-RestMethod http://localhost:3001/api/v1/health
if ($health.status -ne "healthy") { throw "Health check failed" }

# Run smoke tests
npm run test:smoke

# Verify metrics endpoint
$metrics = Invoke-RestMethod http://localhost:9090/metrics
if (-not ($metrics -match "lakshmi_uptime")) { throw "Metrics unavailable" }
```

---

## Staging Environment Deployment

Staging mirrors production configuration. Follow the full [Installation Guide](12-installation.md) with these adjustments:

- Use staging hostnames (`mq-staging.internal`, `pg-staging.internal`, etc.).
- Enable TLS with staging certificates.
- Run the full integration test suite before marking the deployment as successful.

```powershell
npm run test:integration

# Performance validation
node scripts/load-test.js --rate 50000 --duration 60s

# Expected: 0 errors, p99 latency < 5ms
```

---

## Production Deployment

### Pre-Deployment Checklist

- [ ] All staging tests passed
- [ ] Change advisory approved by SRE lead
- [ ] Maintenance window communicated to stakeholders
- [ ] Database backup completed
- [ ] Rollback plan documented
- [ ] Monitoring dashboards verified operational
- [ ] On-call engineer notified

### Docker Deployment (Recommended)

```dockerfile
# Dockerfile
FROM node:20-alpine

RUN apk add --no-cache curl

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY . .

EXPOSE 3001 9090

HEALTHCHECK --interval=15s --timeout=5s --retries=3 \
  CMD curl -f http://localhost:3001/api/v1/health || exit 1

CMD ["node", "src/index.js"]
```

```powershell
# Build image
docker build -t algoiq/lakshmi:2.1.0 .

# Push to registry
docker push algoiq/lakshmi:2.1.0

# Deploy on production host
docker pull algoiq/lakshmi:2.1.0

docker run -d \
  --name lakshmi-prod \
  --restart unless-stopped \
  --network host \
  -v C:\lakshmi\config.json:/app/config.json:ro \
  -v C:\lakshmi\logs:/logs \
  -v C:\certs\lakshmi.crt:/certs/lakshmi.crt:ro \
  -v C:\certs\lakshmi.key:/certs/lakshmi.key:ro \
  -e LAKSHMI_ENV=production \
  -e LAKSHMI_MQ__PASSWORD=$env:LAKSHMI_MQ__PASSWORD \
  -e LAKSHMI_REDIS__PASSWORD=$env:LAKSHMI_REDIS__PASSWORD \
  -e LAKSHMI_DB__PASSWORD=$env:LAKSHMI_DB__PASSWORD \
  -e LAKSHMI_INFLUX__TOKEN=$env:LAKSHMI_INFLUX__TOKEN \
  algoiq/lakshmi:2.1.0
```

### Windows Service Deployment (via PM2)

```powershell
# Follow full installation from step 7 onwards in the Installation Guide
pm2 start ecosystem.config.js --env production
pm2 save

# Ensure PM2 auto-restart on boot
Get-Service "pm2-LakshmiEngine" | Format-List Name, Status, StartType
```

### Health Check Verification

```powershell
# Automated post-deployment verification
$checks = @(
  @{ Name="HealthEndpoint";   Url="http://localhost:3001/api/v1/health"; Key="status"; Expected="healthy" }
  @{ Name="MetricsEndpoint";  Url="http://localhost:9090/metrics";       Key="lakshmi_uptime"; Match=$true }
  @{ Name="TopicList";        Url="http://localhost:3001/api/v1/topics"; Key="status"; Expected="ok" }
)

foreach ($check in $checks) {
  try {
    $response = Invoke-RestMethod -Uri $check.Url -TimeoutSec 5 -Headers @{"X-API-Key"="lak-admin-key"}
    if ($check.Match) {
      if ($response -match $check.Key) { Write-Host "PASS: $($check.Name)" }
      else { throw "Metric $($check.Key) not found" }
    } else {
      if ($response.$($check.Key) -eq $check.Expected) { Write-Host "PASS: $($check.Name)" }
      else { throw "Expected $($check.Expected), got $($response.$($check.Key))" }
    }
  } catch {
    Write-Host "FAIL: $($check.Name) - $_" -ForegroundColor Red
  }
}
```

---

## Rollback Procedure

```powershell
# 1. Stop current instance
pm2 stop lakshmi

# 2. Revert to previous Docker image or code version
docker stop lakshmi-prod
docker rm lakshmi-prod
docker pull algoiq/lakshmi:2.0.0
# Re-run docker run with 2.0.0 tag

# 3. Rollback database migrations if applicable
node scripts/migrate-rollback.js --target v2.0.0

# 4. Restore config if changed
Copy-Item config.json.v2.0.0.backup config.json -Force

# 5. Start previous version
pm2 start lakshmi

# 6. Verify health
Invoke-RestMethod http://localhost:3001/api/v1/health

# 7. Notify stakeholders of rollback completion
```

---

## Deployment Automation (GitHub Actions)

```yaml
name: Deploy Lakshmi
on:
  push:
    tags: ["v*"]

jobs:
  deploy-staging:
    runs-on: windows-2022
    environment: staging
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run build
      - run: node scripts/deploy.js --env staging --host ${{ secrets.STAGING_HOST }}

  deploy-production:
    needs: deploy-staging
    runs-on: windows-2022
    environment: production
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci --production
      - run: node scripts/deploy.js --env production --host ${{ secrets.PROD_HOST }}
```

---

## Monitoring Post-Deployment

After each deployment, monitor the following for at least 15 minutes:

| Metric | Dashboard | Alert Threshold |
|---|---|---|
| Throughput | Grafana "Lakshmi Overview" | Drop > 10% from pre-deployment baseline |
| Latency P99 | Grafana "Lakshmi Latency" | > 5ms for 60s |
| Error Rate | Grafana "Lakshmi Errors" | > 0.5% for 30s |
| Connection Count | Grafana "Lakshmi Connections" | Drop > 20% |
| Queue Depth | Grafana "RabbitMQ Overview" | > 50,000 for 60s |

If any threshold is breached, initiate rollback immediately.
