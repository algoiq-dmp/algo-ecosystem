# TalkOffice — Installation Guide

**Version:** 4.0.0 | **Owner:** Operations | **Last Updated:** 2026-07-25

## Installation Steps

This guide covers installing TalkOffice v4.0.0 on **ALGO IQ 19** (192.168.190.119).

## Prerequisites

- Docker 24.0+ with Docker Compose v2
- Access to ALGO IQ 19 (192.168.190.119)
- Narad service running on port 3100
- Suraksha authentication token (obtain from Infra team)
- Database instances: PostgreSQL provisioned and accessible
- Minimum 8 GB RAM, 4 CPU cores, 50 GB disk

## Step 1: Clone Repository

```bash
git clone git@gitlab.internal:algo-iq/talkoffice.git
cd talkoffice
git checkout v4.0.0
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
docker compose run --rm talkoffice-core ./migrate.sh up
```

## Step 5: Start Services

```bash
docker compose up -d
```

## Step 6: Verify Installation

```bash
# Check health endpoint
curl http://192.168.190.119:3080/api/v1/health

# Expected response:
# {"status":"healthy","version":"4.0.0","uptime_seconds":15}
```

## Step 7: Register with Narad

```bash
# Automatic if ENABLE_NARAD_REGISTER=true (default)
# Verify registration:
curl http://192.168.190.119:3100/api/v1/registry/talkoffice
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
rm -rf /opt/talkoffice/
```
