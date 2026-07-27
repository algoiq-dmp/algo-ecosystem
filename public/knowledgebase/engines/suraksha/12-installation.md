# 12 â€” Installation Guide

**Version:** 2.0.0 | **Owner:** Security | **Last Updated:** 2026-07-24

---

## Prerequisites

| Software | Minimum Version | Required For |
|---|---|---|
| Node.js | 20.x LTS | Runtime |
| PostgreSQL | 15.x | RBAC + audit storage |
| Redis | 7.x | Cache + blacklist |
| HashiCorp Vault | 1.15.x | Secrets storage |
| OpenSSL | 3.x | Certificate operations |
| npm | 10.x | Package management |

## Step 1: Install Dependencies (Ubuntu)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs postgresql-15 redis-server

# Install Vault
wget https://releases.hashicorp.com/vault/1.15.0/vault_1.15.0_linux_amd64.zip
unzip vault_1.15.0_linux_amd64.zip
sudo mv vault /usr/local/bin/
```

## Step 2: Clone and Install

```bash
git clone https://github.com/algo-iq/suraksha.git
cd suraksha
npm install --production
```

## Step 3: Initialize Vault

```bash
vault server -dev &
export VAULT_ADDR='http://127.0.0.1:8200'
vault operator init -key-shares=5 -key-threshold=3
vault operator unseal
```

## Step 4: Database Setup

```sql
CREATE USER suraksha_app WITH PASSWORD 'secure_password_here';
CREATE DATABASE suraksha OWNER suraksha_app;
GRANT ALL PRIVILEGES ON DATABASE suraksha TO suraksha_app;
```

```bash
node scripts/init-db.js
node scripts/init-vault.js  # Seed Vault with initial secrets and keys
```

## Step 5: Configure

```bash
cp config.example.json config.json
```

## Step 6: Generate Initial JWT Key

```bash
node scripts/rotate-jwt-key.js --init
```

## Step 7: Verify

```bash
node scripts/validate-config.js
node scripts/smoke-test.js
```

## Step 8: Start

```bash
npm run dev       # Development
npm start         # Production
pm2 start ecosystem.config.js --only suraksha
```

Verify: `curl https://localhost:3004/api/v1/health`

## Docker Installation

```bash
docker pull algoiq/suraksha:2.0.0
docker run -d \
  --name suraksha \
  -p 3004:3004 \
  -e SURAKSHA_VAULT_TOKEN=<token> \
  --network algoiq-net \
  algoiq/suraksha:2.0.0
```
