# 12 — Installation

## Prerequisites

Verify that your server meets the [System Requirements](03-system-requirements.md) before proceeding.

---

## Step 1: Server Preparation

### Install Node.js 20 LTS

```powershell
# Using Chocolatey (recommended)
choco install nodejs-lts -y

# Verify
node --version   # Should output v20.x.x
npm --version    # Should output 10.x.x
```

### Install RabbitMQ

```powershell
# Install Erlang first (RabbitMQ dependency)
choco install erlang -y

# Install RabbitMQ
choco install rabbitmq -y

# Enable management plugin
rabbitmq-plugins enable rabbitmq_management

# Start service
Restart-Service RabbitMQ

# Verify management UI is accessible
Start-Process "http://localhost:15672"
# Default credentials: guest / guest
```

### Install Redis

```powershell
choco install redis-64 -y
Restart-Service Redis

# Verify connection
redis-cli ping   # Should return PONG
```

### Install PostgreSQL 16

```powershell
choco install postgresql16 -y

# Start service
Restart-Service postgresql-x64-16
```

### Install InfluxDB 2.7

```powershell
choco install influxdb2 -y

# Verify
influx version
```

---

## Step 2: Clone Repository

```powershell
mkdir C:\lakshmi -ErrorAction SilentlyContinue
Set-Location C:\lakshmi
git clone https://github.com/algo-iq/lakshmi.git .
git checkout v2.1.0
```

---

## Step 3: Install Dependencies

```powershell
Set-Location C:\lakshmi
npm install --production

# Install PM2 globally for process management
npm install -g pm2
```

---

## Step 4: Configure

```powershell
Copy-Item config.example.json config.json

# Edit config.json with your environment settings
notepad config.json
```

**Minimum required edits:**

| Setting | Description |
|---|---|
| `mq.host` | RabbitMQ server hostname |
| `mq.password` | RabbitMQ user password |
| `redis.host` | Redis server hostname |
| `redis.password` | Redis password (if set) |
| `database.host` | PostgreSQL server hostname |
| `database.password` | PostgreSQL user password |
| `security.tls.certPath` | Path to TLS certificate |

**Using environment variables for secrets (recommended):**

```powershell
$env:LAKSHMI_MQ__PASSWORD = "your-rabbitmq-password"
$env:LAKSHMI_REDIS__PASSWORD = "your-redis-password"
$env:LAKSHMI_DB__PASSWORD = "your-db-password"
$env:LAKSHMI_INFLUX__TOKEN = "your-influx-token"
```

---

## Step 5: Initialize Database

```powershell
# Create PostgreSQL database and user
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "CREATE DATABASE lakshmi;"
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "CREATE USER lakshmi_app WITH PASSWORD 'your-password';"
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE lakshmi TO lakshmi_app;"

# Run schema initialization
node scripts/init-db.js
```

Expected output:
```
[Lakshmi] Connecting to PostgreSQL... OK
[Lakshmi] Creating schema... OK
[Lakshmi] Creating tables: topics, subscribers, subscriber_topics, messages, metrics, audit_log... OK
[Lakshmi] Creating indexes... OK
[Lakshmi] Database initialization complete.
```

---

## Step 6: Create RabbitMQ Resources

```powershell
# Create vhost and user
rabbitmqctl add_vhost lakshmi
rabbitmqctl add_user lakshmi your-password
rabbitmqctl set_permissions -p lakshmi lakshmi ".*" ".*" ".*"

# Verify
rabbitmqctl list_vhosts
```

---

## Step 7: Start Services

```powershell
# Start with PM2
pm2 start ecosystem.config.js --env production

# Save PM2 configuration for auto-start
pm2 save

# Install PM2 as Windows Service (auto-start on boot)
npm install -g pm2-windows-service
pm2-service-install -n "LakshmiEngine"
```

**ecosystem.config.js:**

```javascript
module.exports = {
  apps: [{
    name: 'lakshmi',
    script: './src/index.js',
    instances: 4,
    exec_mode: 'cluster',
    env: { NODE_ENV: 'production' },
    max_memory_restart: '2G',
    error_file: '/logs/lakshmi-error.log',
    out_file: '/logs/lakshmi-out.log',
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
```

---

## Step 8: Verify Installation

```powershell
# Check health endpoint
Invoke-RestMethod -Uri http://localhost:3001/api/v1/health | ConvertTo-Json

# Expected response:
# {
#   "status": "healthy",
#   "version": "2.1.0",
#   ...
# }

# Check PM2 status
pm2 status

# Check logs for errors
pm2 logs lakshmi --lines 50
```

---

## Upgrade Procedure

```powershell
# 1. Stop the service
pm2 stop lakshmi

# 2. Backup configuration and database
Copy-Item config.json config.json.backup
& "C:\Program Files\PostgreSQL\16\bin\pg_dump.exe" -U lakshmi_app lakshmi > lakshmi_backup.sql

# 3. Pull latest code
git fetch --tags
git checkout v2.2.0

# 4. Install updated dependencies
npm install --production

# 5. Run migration scripts (if any)
node scripts/migrate.js

# 6. Restart
pm2 start lakshmi
pm2 save
```

---

## Rollback Steps

```powershell
pm2 stop lakshmi
git checkout v2.1.0
npm install --production
Copy-Item config.json.backup config.json -Force
pm2 start lakshmi
pm2 save
```

---

## Uninstall

```powershell
pm2 delete lakshmi
pm2-service-uninstall
Remove-Item -Recurse C:\lakshmi
```

---

## Troubleshooting

| Symptom | Check | Command |
|---|---|---|
| Health endpoint unreachable | Is PM2 running? | `pm2 status` |
| RabbitMQ connection refused | Is RabbitMQ running? | `Get-Service RabbitMQ` |
| Redis connection refused | Is Redis running? | `Get-Service Redis` |
| DB connection refused | Is PostgreSQL running? | `Get-Service postgresql-x64-16` |
| TLS errors | Certificate paths correct? | `Test-Path <certPath>` |
| Port conflicts | Port already in use? | `netstat -ano | findstr :3001` |
