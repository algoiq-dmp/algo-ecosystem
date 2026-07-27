# 12 â€” Installation Guide

**Version:** 3.0.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-24

---

## Prerequisites

| Software | Minimum Version | Required For |
|---|---|---|
| Node.js | 20.x LTS | Runtime |
| PostgreSQL | 15.x | Persistent storage |
| Redis | 7.x | Cache + pub/sub |
| gRPC tools | protoc 25.x | Protocol compilation |
| npm | 10.x | Package management |

## Step 1: Install Dependencies (Ubuntu)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs postgresql-15 redis-server
sudo systemctl enable postgresql redis-server
```

## Step 2: Clone and Install

```bash
git clone https://github.com/algo-iq/narad.git
cd narad
npm install --production

# Compile gRPC protobuf definitions
npm run proto:compile
```

## Step 3: Database Setup

```sql
CREATE USER narad_app WITH PASSWORD 'secure_password_here';
CREATE DATABASE narad OWNER narad_app;
GRANT ALL PRIVILEGES ON DATABASE narad TO narad_app;
```

```bash
node scripts/init-db.js
```

## Step 4: Configure Narad

```bash
cp config.example.json config.json
# Edit with your environment settings
```

## Step 5: Verify

```bash
node scripts/validate-config.js
node scripts/smoke-test.js
```

## Step 6: Start

```bash
npm run dev       # Development
npm start         # Production
pm2 start ecosystem.config.js --only narad
```

Verify: `curl http://localhost:3003/api/v1/health`

## Agent Installation (on each managed server)

```bash
# Install agent package
npm install -g @algoiq/narad-agent

# Configure
narad-agent init --control-plane narad-cp1.algoiq.io:50051 --hostname ganesh-prod-1

# Register with Narad
narad-agent register --roles engine,database-client

# Start agent
sudo systemctl enable narad-agent
sudo systemctl start narad-agent
```

## Docker Installation

```bash
docker pull algoiq/narad-control-plane:3.0.0
docker pull algoiq/narad-agent:3.0.0

# Control Plane
docker run -d --name narad-cp -p 3003:3003 -p 50051:50051 algoiq/narad-control-plane:3.0.0

# Agent (on each server)
docker run -d --name narad-agent --network host -v /:/host:ro algoiq/narad-agent:3.0.0
```
