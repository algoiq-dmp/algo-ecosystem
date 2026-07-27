# 12 — Installation Guide

**Version:** 2.4.1 | **Owner:** Operations | **Last Updated:** 2026-07-24

---

## Prerequisites

### System Requirements

| Requirement | Minimum | Recommended |
|---|---|---|
| OS | Windows Server 2019 / Ubuntu 22.04 LTS | Ubuntu 22.04 LTS |
| Node.js | 18.x LTS | 20.x LTS |
| RAM | 4 GB | 8 GB |
| Disk | 50 GB free | 200 GB free |
| Network | 100 Mbps | 1 Gbps |

### External Services

| Service | Version | Purpose |
|---|---|---|
| PostgreSQL | 15.x | File metadata, registry, audit |
| TimescaleDB | 2.10+ | Audit event time-series |
| MinIO | RELEASE.2024-01+ | Object storage for files |
| Redis | 7.x | Caching, distributed locks |
| RabbitMQ | 3.12.x | Inter-component messaging |

---

## Linux Installation (Ubuntu 22.04)

```bash
# 1. Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Install system dependencies
sudo apt-get update
sudo apt-get install -y build-essential unzip

# 3. Install PostgreSQL 15 + TimescaleDB
sudo sh -c 'echo "deb https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt-get update
sudo apt-get install -y postgresql-15 timescaledb-2-postgresql-15

# 4. Install MinIO
wget https://dl.min.io/server/minio/release/linux-amd64/minio
sudo chmod +x minio
sudo mv minio /usr/local/bin/

# 5. Install Redis and RabbitMQ
sudo apt-get install -y redis-server rabbitmq-server
sudo rabbitmq-plugins enable rabbitmq_management

# 6. Clone and install Surya
git clone https://github.com/algo-iq/surya.git /opt/surya
cd /opt/surya
npm install --production

# 7. Configure
cp config.example.json config.json
vim config.json

# 8. Create required directories
sudo mkdir -p /data/surya/{staging,normalized,emergency}
sudo chown -R surya:surya /data/surya
sudo mkdir -p /var/log/surya

# 9. Initialize database
sudo -u postgres psql -c "CREATE USER surya_app WITH PASSWORD 'secure_password';"
sudo -u postgres psql -c "CREATE DATABASE surya OWNER surya_app;"
sudo -u postgres psql -d surya -c "CREATE EXTENSION IF NOT EXISTS timescaledb;"
node scripts/init-db.js
node scripts/migrate.js up

# 10. Initialize MinIO bucket
mc alias set surya-minio http://localhost:9000 minioadmin minioadmin
mc mb surya-minio/surya-files
mc mb surya-minio/surya-staging
mc version enable surya-minio/surya-files

# 11. Seed file type registry
node scripts/seed-file-types.js

# 12. Create system user and service
sudo useradd -r -s /bin/false surya
sudo chown -R surya:surya /opt/surya
sudo cp scripts/surya.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable surya
sudo systemctl start surya

# 13. Verify
curl http://localhost:3005/api/v1/health
```

---

## Systemd Service File (`surya.service`)

```ini
[Unit]
Description=Surya Exchange File Management Engine
After=network.target postgresql.service redis.service minio.service rabbitmq-server.service
Requires=postgresql.service redis.service minio.service

[Service]
Type=simple
User=surya
Group=surya
WorkingDirectory=/opt/surya
ExecStart=/usr/bin/node /opt/surya/src/index.js
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal
Environment=NODE_ENV=production
EnvironmentFile=/opt/surya/.env
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
```

---

## MinIO Setup

```bash
# Start MinIO server (systemd service)
sudo cp scripts/minio.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable minio
sudo systemctl start minio

# MinIO service file
cat > /etc/systemd/system/minio.service << 'EOF'
[Unit]
Description=MinIO Object Storage
After=network.target

[Service]
Type=simple
User=surya
Group=surya
Environment="MINIO_ROOT_USER=minioadmin"
Environment="MINIO_ROOT_PASSWORD=secure_password"
ExecStart=/usr/local/bin/minio server /data/minio --console-address ":9001"
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF
```

---

## Docker Installation

```bash
# Build
docker build -t algo-iq/surya:2.4.1 .

# Run with docker-compose
docker-compose up -d
```

### `docker-compose.yml`

```yaml
version: '3.8'
services:
  surya-api:
    image: algo-iq/surya:2.4.1
    command: node src/api/index.js
    ports:
      - "3005:3005"
      - "9090:9090"
    environment:
      - NODE_ENV=production
      - PG_HOST=postgres
      - REDIS_HOST=redis
      - MINIO_ENDPOINT=minio
    depends_on:
      - postgres
      - redis
      - minio
    volumes:
      - surya-data:/data/surya

  surya-worker:
    image: algo-iq/surya:2.4.1
    command: node src/worker/index.js
    environment:
      - NODE_ENV=production
    depends_on:
      - postgres
      - redis
      - minio
      - rabbitmq
    volumes:
      - surya-data:/data/surya
    deploy:
      replicas: 2

  postgres:
    image: timescale/timescaledb:2.10-pg15
    environment:
      POSTGRES_DB: surya
      POSTGRES_USER: surya_app
      POSTGRES_PASSWORD: secure_password
    volumes:
      - pgdata:/var/lib/postgresql/data

  minio:
    image: minio/minio:RELEASE.2024-01
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: secure_password
    volumes:
      - miniodata:/data
    ports:
      - "9000:9000"
      - "9001:9001"

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes

  rabbitmq:
    image: rabbitmq:3.12-management-alpine
    environment:
      RABBITMQ_DEFAULT_VHOST: surya
      RABBITMQ_DEFAULT_USER: surya_svc
      RABBITMQ_DEFAULT_PASS: secure_password

volumes:
  pgdata:
  miniodata:
  surya-data:
```

---

## Post-Installation Verification

```bash
# 1. Health check
curl -s http://localhost:3005/api/v1/health | python -m json.tool

# 2. Check file types registered
curl -s -H "X-API-Key: admin-key" \
  http://localhost:3005/api/v1/files/types | python -m json.tool

# 3. Check extranet connectivity
curl -s http://localhost:3005/api/v1/health | grep -E "nse_extranet|bse_mftp"

# 4. Test manual file fetch
curl -X POST -H "X-API-Key: admin-key" \
  -H "Content-Type: application/json" \
  -d '{"fileTypeCode":"SEC_TOK","fileDate":"2026-07-24"}' \
  http://localhost:3005/api/v1/admin/files/trigger

# 5. Verify MinIO bucket
mc ls surya-minio/surya-files/
```

---

## Troubleshooting Installation

| Symptom | Likely Cause | Resolution |
|---|---|---|
| `ECONNREFUSED localhost:5432` | PostgreSQL not running | `sudo systemctl start postgresql` |
| `ECONNREFUSED localhost:9000` | MinIO not running | `sudo systemctl start minio` |
| `ERROR: database "surya" does not exist` | DB not created | Run `node scripts/init-db.js` |
| `No file types registered` | Seed not run | Run `node scripts/seed-file-types.js` |
| `Extranet connection failed` | Invalid certs/keys | Verify NSE cert path and validity |
| `MinIO access denied` | Wrong credentials | Check `MINIO_ACCESS_KEY` / `MINIO_SECRET_KEY` |
