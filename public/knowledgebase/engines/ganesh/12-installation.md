# 12 â€” Installation Guide

**Version:** 3.2.1 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24

---

## Prerequisites

| Software | Minimum Version | Required For |
|---|---|---|
| Node.js | 20.x LTS | Runtime |
| Redis | 7.x | Hot cache |
| PostgreSQL | 15.x | Durable storage |
| TimescaleDB | 2.x | Time-series optimization |
| RabbitMQ | 3.12.x | Message broker |
| npm | 10.x | Package management |

## Step 1: Install Dependencies (Ubuntu)

```bash
# Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Redis
sudo apt-get install -y redis-server
sudo systemctl enable redis-server

# PostgreSQL + TimescaleDB
sudo apt-get install -y postgresql-15
sudo apt-get install -y timescaledb-2-postgresql-15
sudo timescaledb-tune --yes
sudo systemctl restart postgresql

# RabbitMQ
sudo apt-get install -y rabbitmq-server
sudo systemctl enable rabbitmq-server
```

## Step 2: Clone and Install

```bash
git clone https://github.com/algo-iq/ganesh.git
cd ganesh
npm install --production
```

## Step 3: Database Setup

```sql
-- Connect to PostgreSQL
sudo -u postgres psql

-- Create database and user
CREATE USER ganesh_app WITH PASSWORD 'secure_password_here';
CREATE DATABASE ganesh OWNER ganesh_app;
\c ganesh
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE ganesh TO ganesh_app;
```

Then run the schema migration:

```bash
node scripts/init-db.js
```

## Step 4: Redis Setup

```bash
# Edit Redis config for production
sudo nano /etc/redis/redis.conf

# Recommended settings:
# maxmemory 32gb
# maxmemory-policy volatile-lru
# save 900 1
# save 300 10
# save 60 10000

sudo systemctl restart redis-server
```

## Step 5: Configure Ganesh

```bash
cp config.example.json config.json
```

Edit `config.json` with your environment's database credentials, RabbitMQ URLs, and security settings.

## Step 6: Configure RabbitMQ

Create the required exchanges and queues:

```bash
rabbitmqadmin declare exchange name=market.ticks type=topic durable=true
rabbitmqadmin declare exchange name=corp.actions type=topic durable=true
rabbitmqadmin declare queue name=ganesh.tick.consumer durable=true
rabbitmqadmin declare queue name=ganesh.corp.action durable=true
```

## Step 7: Verify Installation

```bash
node scripts/validate-config.js
node scripts/smoke-test.js
```

Expected output:
```
[PASS] Redis connectivity
[PASS] PostgreSQL connectivity
[PASS] RabbitMQ connectivity
[PASS] TimescaleDB extension
[PASS] Required directories writable
```

## Step 8: Start Ganesh

```bash
npm run dev       # Development
npm start         # Production
pm2 start ecosystem.config.js --only ganesh  # PM2
```

## Step 9: Verify Health

```bash
curl http://localhost:3002/api/v1/health
```

Expected: `{"status":"healthy","version":"3.2.1","uptime":5}`

## Docker Installation

```bash
docker pull algoiq/ganesh:3.2.1
docker run -d \
  --name ganesh \
  -p 3002:3002 \
  -v /etc/ganesh/config.json:/app/config.json:ro \
  --network algoiq-net \
  algoiq/ganesh:3.2.1
```
