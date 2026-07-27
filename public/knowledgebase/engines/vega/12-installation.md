# 12 — Installation Guide

**Version:** 6.3.0 | **Owner:** Execution | **Last Updated:** 2026-07-24

---

## Prerequisites

### System Requirements

| Requirement | Minimum | Recommended |
|---|---|---|
| OS | Windows Server 2019 / Ubuntu 22.04 LTS | Ubuntu 22.04 LTS |
| Node.js | 18.x LTS | 20.x LTS |
| RAM | 8 GB | 16 GB |
| Disk | 20 GB free | 50 GB free |
| Network | 100 Mbps | 1 Gbps |

### External Services

| Service | Version | Purpose |
|---|---|---|
| PostgreSQL | 15.x | Order data, broker configs |
| TimescaleDB | 2.10+ | Audit event storage |
| Redis | 7.x | Caching, state, pub/sub |
| RabbitMQ | 3.12.x | Message queuing |

---

## Windows Installation

```powershell
# 1. Install prerequisites
choco install nodejs-lts --version=20.11.0 -y
choco install rabbitmq -y
choco install redis-64 -y

# 2. Clone repository
git clone https://github.com/algo-iq/vega.git
Set-Location -LiteralPath "vega"

# 3. Install dependencies
npm install --production

# 4. Initialize configuration
Copy-Item config.example.json config.json
# Edit config.json with your environment values

# 5. Set up environment variables
[System.Environment]::SetEnvironmentVariable('NODE_ENV', 'production', 'Machine')
[System.Environment]::SetEnvironmentVariable('PG_PASSWORD', 'your_password', 'Machine')
[System.Environment]::SetEnvironmentVariable('REDIS_PASSWORD', 'your_password', 'Machine')
[System.Environment]::SetEnvironmentVariable('MQ_PASSWORD', 'your_password', 'Machine')
[System.Environment]::SetEnvironmentVariable('API_SECRET_KEY', 'your_secret', 'Machine')

# 6. Initialize database
node scripts/init-db.js

# 7. Run database migrations
node scripts/migrate.js up

# 8. Create required directories
New-Item -ItemType Directory -Force -Path "logs", "data\fix-logs"

# 9. Start the application
npm start
```

---

## Linux Installation (Ubuntu 22.04)

```bash
# 1. Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Install system dependencies
sudo apt-get update
sudo apt-get install -y build-essential python3 redis-server

# 3. Install PostgreSQL 15 + TimescaleDB
sudo sh -c 'echo "deb https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt-get update
sudo apt-get install -y postgresql-15 timescaledb-2-postgresql-15

# 4. Install RabbitMQ
sudo apt-get install -y rabbitmq-server
sudo rabbitmq-plugins enable rabbitmq_management
sudo systemctl enable rabbitmq-server
sudo systemctl start rabbitmq-server

# 5. Clone and install
git clone https://github.com/algo-iq/vega.git /opt/vega
cd /opt/vega
npm install --production

# 6. Configure
cp config.example.json config.json
vim config.json

# 7. Create system user
sudo useradd -r -s /bin/false vega
sudo chown -R vega:vega /opt/vega

# 8. Initialize database
sudo -u postgres psql -c "CREATE USER vega_app WITH PASSWORD 'secure_password';"
sudo -u postgres psql -c "CREATE DATABASE vega OWNER vega_app;"
sudo -u postgres psql -d vega -c "CREATE EXTENSION IF NOT EXISTS timescaledb;"
node scripts/init-db.js
node scripts/migrate.js up

# 9. Install systemd service
sudo cp scripts/vega.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable vega
sudo systemctl start vega

# 10. Verify
curl http://localhost:3003/api/v1/health
```

---

## Systemd Service File (`vega.service`)

```ini
[Unit]
Description=Vega Order Execution Engine
After=network.target postgresql.service redis.service rabbitmq-server.service
Requires=postgresql.service redis.service rabbitmq-server.service

[Service]
Type=simple
User=vega
Group=vega
WorkingDirectory=/opt/vega
ExecStart=/usr/bin/node /opt/vega/src/index.js
Restart=on-failure
RestartSec=5
StandardOutput=journal
StandardError=journal
Environment=NODE_ENV=production
EnvironmentFile=/opt/vega/.env
LimitNOFILE=65536
LimitNPROC=4096

[Install]
WantedBy=multi-user.target
```

---

## Docker Installation

```bash
# Build image
docker build -t algo-iq/vega:6.3.0 .

# Run with docker-compose
docker-compose up -d
```

### `docker-compose.yml`

```yaml
version: '3.8'
services:
  vega-api:
    image: algo-iq/vega:6.3.0
    command: node src/api/index.js
    ports:
      - "3003:3003"
      - "3004:3004"
    environment:
      - NODE_ENV=production
      - PG_HOST=postgres
      - REDIS_HOST=redis
      - MQ_HOST=rabbitmq
    depends_on:
      - postgres
      - redis
      - rabbitmq

  vega-app:
    image: algo-iq/vega:6.3.0
    command: node src/app/index.js
    environment:
      - NODE_ENV=production
    depends_on:
      - rabbitmq
      - redis
    deploy:
      replicas: 4

  vega-processor:
    image: algo-iq/vega:6.3.0
    command: node src/processor/index.js
    environment:
      - NODE_ENV=production
    depends_on:
      - rabbitmq
      - redis
      - postgres
    deploy:
      replicas: 2

  postgres:
    image: timescale/timescaledb:2.10-pg15
    environment:
      POSTGRES_DB: vega
      POSTGRES_USER: vega_app
      POSTGRES_PASSWORD: secure_password
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes

  rabbitmq:
    image: rabbitmq:3.12-management-alpine
    environment:
      RABBITMQ_DEFAULT_VHOST: vega
      RABBITMQ_DEFAULT_USER: vega_svc
      RABBITMQ_DEFAULT_PASS: secure_password

volumes:
  pgdata:
```

---

## Post-Installation Verification

```bash
# 1. Health check
curl -s http://localhost:3003/api/v1/health | python -m json.tool

# 2. Check broker connectivity
curl -s http://localhost:3003/api/v1/health | grep -E "xts_fix|greeksoft_fix"

# 3. Verify database tables
sudo -u postgres psql -d vega -c "\dt"

# 4. Check RabbitMQ queues
rabbitmqctl list_queues -p vega name messages

# 5. Run smoke test
node scripts/smoke-test.js

# Expected output:
# ✓ Health check passed
# ✓ Database connected
# ✓ Redis connected
# ✓ RabbitMQ connected
# ✓ All migrations up-to-date
```

---

## Troubleshooting Installation

| Symptom | Likely Cause | Resolution |
|---|---|---|
| `ECONNREFUSED localhost:5432` | PostgreSQL not running | `sudo systemctl start postgresql` |
| `ECONNREFUSED localhost:6379` | Redis not running | `sudo systemctl start redis` |
| `ECONNREFUSED localhost:5672` | RabbitMQ not running | `sudo systemctl start rabbitmq-server` |
| `ERROR: database "vega" does not exist` | DB not created | Run `node scripts/init-db.js` |
| `Permission denied` errors | File ownership | `sudo chown -R vega:vega /opt/vega` |
| `module not found` | Incomplete install | `npm install --production` |
