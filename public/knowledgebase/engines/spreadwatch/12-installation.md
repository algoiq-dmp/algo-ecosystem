# SpreadWatch — Installation Guide

**Version:** 2.8.0 | **Owner:** Analytics | **Last Updated:** 2026-07-25

## Installation Steps

This guide covers installing SpreadWatch v2.8.0 on **ALGO IQ 4** (192.168.190.104).

## Prerequisites

- Docker 24.0+ with Docker Compose v2
- Access to ALGO IQ 4 (192.168.190.104)
- Narad service running on port 3100
- Suraksha authentication token (obtain from Infra team)
- Database instances: TimescaleDB provisioned and accessible
- Minimum 8 GB RAM, 4 CPU cores, 50 GB disk

## Step 1: Clone Repository

```bash
git clone git@gitlab.internal:algo-iq/spreadwatch.git
cd spreadwatch
git checkout v2.8.0
```

## Step 2: Configure Environment

```bash
cp .env.example .env
# Edit .env with actual credentials
vim .env
```

Set required variables:
- `DB_URL` — Database connection string
- `MQ_URL` — RabbitMQ connection
- `NARAD_TOKEN` — Narad service token
- `SURAKSHA_SECRET` — Suraksha client secret

## Step 3: Build Docker Images

```bash
docker compose build --no-cache
```

## Step 4: Run Database Migrations

```bash
docker compose run --rm spreadwatch-core ./migrate.sh up
```

## Step 5: Start Services

```bash
docker compose up -d
```

## Step 6: Verify Installation

```bash
# Check health endpoint
curl http://192.168.190.104:3022/api/v1/health

# Expected response:
# {"status":"healthy","version":"2.8.0","uptime_seconds":15}
```

## Step 7: Register with Narad

```bash
# Automatic if ENABLE_NARAD_REGISTER=true (default)
# Verify registration:
curl http://192.168.190.104:3100/api/v1/registry/spreadwatch
```

## Post-Installation Checklist

- [ ] Health endpoint returns 200
- [ ] Service visible in Narad registry
- [ ] MQ consumer connected to exchange
- [ ] Database connections established (check logs)
- [ ] Suraksha token validation working
- [ ] Metrics endpoint accessible to Prometheus

## Uninstall

```bash
docker compose down -v
rm -rf /opt/spreadwatch/
```
