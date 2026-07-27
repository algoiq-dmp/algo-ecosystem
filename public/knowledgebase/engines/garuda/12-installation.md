---
version: 5.0.0
owner: Margin Intelligence
last_updated: 2026-07-25
---

# 12 — Installation

## Prerequisites

### Hardware (Production Minimum)
- 32 vCPU (4 nodes × 8 vCPU)
- 64 GB RAM (4 nodes × 16 GB)
- 1 TB NVMe SSD
- 10 Gbps network

### Software
- .NET SDK 8.0+
- Node.js 20 LTS+
- Docker 24.0+
- PostgreSQL 15+
- Redis 7.2+
- Apache Kafka 3.6+
- Git 2.40+
- Helm 3.13+ (Kubernetes deployment)

## Quick Start (Docker Compose)

```bash
# 1. Clone repository
git clone https://github.com/garuda/margin-engine.git
cd margin-engine

# 2. Create environment file
cat > .env << EOF
DB_PASSWORD=ChangeMe123!
REDIS_PASSWORD=ChangeMe123!
JWT_SECRET=$(openssl rand -base64 64)
EOF

# 3. Start all services
docker compose up -d

# 4. Wait for services (approx 60 seconds)
docker compose ps

# 5. Verify installation
curl http://localhost:5001/health
# Expected: {"status":"Healthy","components":{"database":"Healthy","redis":"Healthy"}}
```

## Production Installation (Kubernetes)

### Step 1: Create Namespace
```bash
kubectl create namespace garuda-production
```

### Step 2: Create Secrets
```bash
kubectl create secret generic garuda-secrets \
    --namespace garuda-production \
    --from-literal=db-password='ChangeMe123!' \
    --from-literal=redis-password='ChangeMe123!' \
    --from-literal=jwt-secret='your-64-char-jwt-secret' \
    --from-literal=encryption-key='base64-aes256-key'
```

### Step 3: Deploy with Helm
```bash
helm repo add garuda https://charts.garuda.dev
helm repo update

helm install garuda garuda/garuda-margin-engine \
    --namespace garuda-production \
    --values deployment/helm/values-production.yaml \
    --set postgresql.auth.password=ChangeMe123! \
    --set redis.auth.password=ChangeMe123!
```

### Step 4: Verify Deployment
```bash
# Wait for pods
kubectl wait --for=condition=ready pod -l app=garuda-api -n garuda-production --timeout=300s

# Check pods
kubectl get pods -n garuda-production

# Get ingress URL
kubectl get ingress -n garuda-production

# Health check
curl https://api.garuda.dev/health
```

## Database Initialization

### Create Database
```sql
CREATE DATABASE garuda;
CREATE USER garuda WITH PASSWORD 'ChangeMe123!';
GRANT ALL PRIVILEGES ON DATABASE garuda TO garuda;

-- Connect to garuda database
\c garuda

-- Create TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Create pg_partman for automated partition management
CREATE EXTENSION IF NOT EXISTS pg_partman;
```

### Apply Migrations
```bash
dotnet run --project src/Garuda.Migrations -- \
    --connection "Host=localhost;Database=garuda;Username=garuda;Password=ChangeMe123!"
```

## SSL Certificate Setup

### Using cert-manager with Let's Encrypt
```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.14.0/cert-manager.yaml

# Create ClusterIssuer
kubectl apply -f - << EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: ops@garuda.dev
    privateKeySecretRef:
      name: letsencrypt-prod-key
    solvers:
    - http01:
        ingress:
          class: nginx
EOF

# Issue certificate
kubectl apply -f - << EOF
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: garuda-tls
  namespace: garuda-production
spec:
  secretName: garuda-tls-secret
  dnsNames:
  - api.garuda.dev
  issuerRef:
    name: letsencrypt-prod
    kind: ClusterIssuer
EOF
```

## Cloud Installation

### Azure (AKS)
```bash
az group create --name garuda-prod-rg --location centralindia

az aks create \
    --resource-group garuda-prod-rg \
    --name garuda-prod-aks \
    --node-count 4 \
    --node-vm-size Standard_D8s_v5 \
    --enable-cluster-autoscaler \
    --min-count 4 --max-count 12

az aks get-credentials --resource-group garuda-prod-rg --name garuda-prod-aks

# Create managed PostgreSQL
az postgres flexible-server create \
    --resource-group garuda-prod-rg \
    --name garuda-prod-pg \
    --admin-user garudaadmin \
    --sku-name Standard_D4s_v3 \
    --version 15

# Create managed Redis
az redis create \
    --resource-group garuda-prod-rg \
    --name garuda-prod-redis \
    --sku Premium --vm-size P2
```

### AWS (EKS)
```bash
eksctl create cluster \
    --name garuda-prod \
    --region ap-south-1 \
    --nodegroup-name workers \
    --node-type m6i.2xlarge \
    --nodes 4 --nodes-min 4 --nodes-max 12
```

## Post-Installation Verification

```bash
# 1. Health endpoint
curl https://api.garuda.dev/health

# 2. Authentication test
curl -X POST https://api.garuda.dev/v3/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"admin@garuda.dev","password":"Admin@123"}'

# 3. Margin calculation test
TOKEN=$(curl -X POST https://api.garuda.dev/v3/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"admin@garuda.dev","password":"Admin@123"}' | jq -r '.access_token')

curl -X POST https://api.garuda.dev/v3/margin/contract \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "exchange": "NSE",
      "positions": [{
        "symbol": "NIFTY", "instrument_type": "FUTIDX",
        "expiry": "2026-07-30", "quantity": 5,
        "average_price": 22450.00
      }]
    }'

# 4. Metrics endpoint
curl https://api.garuda.dev/metrics | grep garuda_margin
```

## Service URLs After Installation

| Service | URL |
|---|---|
| API | https://api.garuda.dev |
| Dashboard | https://dashboard.garuda.dev |
| Swagger UI | https://api.garuda.dev/swagger |
| Grafana | https://grafana.garuda.dev |
| Health Check | https://api.garuda.dev/health |
| Metrics | https://api.garuda.dev:9090/metrics |
