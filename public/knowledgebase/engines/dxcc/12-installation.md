# DXCC — Installation Guide

> **Version:** 2.0.0 | **Status:** Draft | **Owner:** DXCC Team | **Last Updated:** 2026-07-24

---

## Prerequisites

| Component | Minimum Version | Purpose |
|-----------|-----------------|---------|
| Node.js | 20.x LTS | Frontend build and development |
| Go | 1.22+ | Backend compilation |
| pnpm | 8.x (or npm 10.x) | Frontend package management |
| PostgreSQL | 15+ | DXCC data storage |
| Redis | 7+ | Session cache and widget buffer |
| Git | 2.x | Source code management |

---

## Step 1: Clone Repositories

```bash
git clone https://github.com/delta-xi/dxcc-frontend.git
git clone https://github.com/delta-xi/dxcc-backend.git
```

---

## Step 2: Configure Environment

Create the configuration file for the backend:

```bash
cd dxcc-backend
cp config.example.json config.json
```

Edit `config.json` to match your environment:

- Set `database.postgresql.host`, `port`, `database` to your PostgreSQL instance
- Set `database.redis.host`, `port` to your Redis instance
- Set `narad.ws_url` to your Narad WebSocket Gateway address
- Set `api.base_url` to your Kraken API Gateway address
- Update `auth.issuer_url` with your SSO provider

Create a `.env` file for secrets:

```bash
echo "DXCC_DB_PASSWORD=your_db_password" >> .env
echo "DXCC_REDIS_PASSWORD=your_redis_password" >> .env
echo "DXCC_JWT_PRIVATE_KEY=$(cat /path/to/jwt-private.pem)" >> .env
echo "DXCC_SESSION_SECRET=$(openssl rand -hex 32)" >> .env
echo "DXCC_OAUTH2_CLIENT_SECRET=your_oauth2_secret" >> .env
```

---

## Step 3: Initialize Database

```bash
# Create the DXCC database
psql -U postgres -c "CREATE DATABASE dxcc;"
psql -U postgres -c "CREATE USER dxcc_app WITH PASSWORD 'your_db_password';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE dxcc TO dxcc_app;"

# Run migrations
go run cmd/migrate/main.go up
```

Enable required PostgreSQL extensions:

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
```

---

## Step 4: Build Frontend

```bash
cd dxcc-frontend

# Install dependencies
pnpm install

# Create environment file
cp .env.example .env.production
# Edit .env.production:
# VITE_NARAD_WS_URL=wss://narad-gateway.internal/ws
# VITE_API_BASE_URL=https://kraken-api-gateway.internal/api/v2
# VITE_AUTH_ISSUER=https://auth.internal/realms/dxcc

# Build for production
pnpm build

# Output: dxcc-frontend/dist/
```

The production build generates optimized static files in `dist/`:

```
dist/
  index.html
  assets/
    index-abc123.js     (~200 KB gzipped)
    index-abc123.css    (~40 KB gzipped)
    vendor-def456.js    (~150 KB gzipped)
  favicon.ico
  robots.txt
```

---

## Step 5: Build Backend

```bash
cd dxcc-backend

# Download Go dependencies
go mod download

# Build the binary
CGO_ENABLED=0 go build -ldflags="-s -w -X main.version=2.0.0" -o dxcc-server ./cmd/server/

# Verify the binary
./dxcc-server --version
# Output: dxcc-server version 2.0.0 (commit: abc1234, built: 2026-07-24)
```

---

## Step 6: Start Services

### Start Backend

```bash
./dxcc-server --config=config.json
# Output:
# [INFO] DXCC Server v2.0.0 starting...
# [INFO] Connected to PostgreSQL at localhost:5432
# [INFO] Connected to Redis at localhost:6379
# [INFO] Narad WebSocket connected: wss://narad-gateway.internal/ws
# [INFO] HTTP server listening on :8080
```

### Serve Frontend

For development use Vite dev server:

```bash
cd dxcc-frontend
pnpm dev
# Output: VITE v5.x  ready in 450ms
#   -> Local:   http://localhost:5173/
```

For production, serve via Nginx:

```nginx
server {
    listen 443 ssl http2;
    server_name dxcc.internal;

    ssl_certificate /etc/ssl/dxcc.crt;
    ssl_certificate_key /etc/ssl/dxcc.key;

    root /var/www/dxcc;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /ws/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

---

## Step 7: Verify Installation

1. Open `https://dxcc.internal` in a browser
2. You should see the DXCC login page
3. Log in with SSO credentials
4. The Executive Dashboard should load with engine health indicators
5. Check the Narad connection status in the header (should show green "Connected")
6. Navigate to Engine Registry to verify engine auto-discovery is working
7. Check health endpoint: `curl https://dxcc.internal/api/health`

Expected response:

```json
{
  "status": "ok",
  "version": "2.0.0",
  "uptime_seconds": 120,
  "narad_connected": true,
  "postgresql_connected": true,
  "redis_connected": true
}
```

---

## Docker Compose (Alternative)

For quick local development setup:

```yaml
version: '3.8'
services:
  postgresql:
    image: postgres:15
    environment:
      POSTGRES_DB: dxcc
      POSTGRES_USER: dxcc_app
      POSTGRES_PASSWORD: dxcc_local
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  dxcc-backend:
    build: ./dxcc-backend
    ports:
      - "8080:8080"
    environment:
      DXCC_DB_PASSWORD: dxcc_local
      DXCC_ENV: development
    depends_on:
      - postgresql
      - redis

  dxcc-frontend:
    build: ./dxcc-frontend
    ports:
      - "5173:5173"
    depends_on:
      - dxcc-backend

volumes:
  pgdata:
```

```bash
docker compose up -d
docker compose logs -f dxcc-backend
```

---

## Troubleshooting Installation

| Issue | Check |
|-------|-------|
| Blank dashboard | Verify Narad WS URL is correct and reachable; check browser console for WebSocket errors |
| Login failure | Verify SSO/OAuth2 configuration; check `auth.issuer_url` and client secret |
| No engines showing | Verify engine manifest files are present in the registry path; check Narad connection |
| PostgreSQL connection refused | Verify PostgreSQL is running and credentials match |
| Redis connection refused | Verify Redis is running; check password if auth is enabled |
| Build errors (Go) | Run `go mod tidy`; verify Go 1.22+ is installed |
| Build errors (Frontend) | Run `pnpm install --force`; clear Vite cache with `pnpm clean` |

---

> **Next:** See [13-deployment.md](13-deployment.md) for deployment environments and procedures.
