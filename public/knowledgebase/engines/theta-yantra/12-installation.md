# Theta Yantra - Installation

**Version:** 3.1.0 | **Owner:** Analytics | **Last Updated:** 2026-07-25


## Prerequisites

| Software | Minimum Version | Purpose |
|----------|----------------|---------|
| Node.js | 20.x LTS | Runtime environment |
| PostgreSQL | 15.x | Relational database |
| TimescaleDB | 2.12.x | Time-series extension |
| RabbitMQ | 3.12.x | Message queue broker |
| PM2 | 5.x | Process manager |
| Redis | 7.x | Optional cache layer |

## Installation Steps

### 1. Clone Repository

`ash
git clone <repository-url>
cd algo-iq-engines
```

### 2. Install Dependencies

`ash
npm install --production
```

### 3. Prepare Database

`ash
npm run db:create
npm run db:migrate
npm run db:seed
```

### 4. Configure Environment

Copy and modify the environment template:

`ash
cp config/env.template.toml config/env.config.toml
```
Edit to match your environment settings.

### 5. Configure Suraksha

Register the engine with Suraksha IAM to obtain service credentials. Store encrypted credentials in Suraksha Vault.

### 6. Start the Engine

`ash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Verification

Test the installation with:

`ash
curl -k https://localhost:3000/api/v1/health
```
Expected response: HTTP 200 with status JSON.

## Uninstallation

`ash
pm2 delete algo-engine
npm run db:drop  # Destroys all data — use with caution
rm -rf <install-directory>
```

## Platform-Specific Notes

- **Linux (Production):** Use systemd unit in addition to PM2 for startup ordering.
- **macOS (Development):** Install PostgreSQL/TimescaleDB via Homebrew.
- **Windows (Testing):** Use WSL2 for database and MQ dependencies; Node.js runs natively.

