# Theta Yantra - Database

**Version:** 3.1.0 | **Owner:** Analytics | **Last Updated:** 2026-07-25


## Database Systems

The engine uses two primary database systems:

### PostgreSQL (Relational)
Stores configuration metadata, user/role data, operational logs, and reference data. Provides ACID compliance for critical transactional operations.

### TimescaleDB (Time-Series)
Stores market data, signal history, performance metrics, and audit trails. Optimized for high-write throughput and time-range queries on large datasets.

## Schema Overview

### Core Tables

| Table | Engine | Purpose | Retention |
|-------|--------|---------|-----------|
| signals_log | TimescaleDB | All generated signals | 90 days |
| market_data | TimescaleDB | Tick and OHLC snapshots | 30 days |
| strategy_configs | PostgreSQL | Strategy parameters | Permanent |
| audit_trail | TimescaleDB | Chitragupta compliance log | 7 years |
| performance_metrics | TimescaleDB | PnL, Sharpe, drawdown | 365 days |

### Seed Data

- Strategy baseline parameters loaded from SQL seed files.
- Reference data (symbols, exchanges, holidays) synced daily from Ganesh.
- Suraksha role mappings provisioned during deployment.

## Connection Configuration

Connections are managed via environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| DB_HOST | PostgreSQL host | localhost |
| DB_PORT | PostgreSQL port | 5432 |
| DB_NAME | Database name | algo_iq |
| DB_USER | Database user | algo_app |
| DB_PASSWORD | Encrypted via Suraksha | (required) |
| DB_POOL_MAX | Max connection pool size | 20 |
| DB_IDLE_TIMEOUT | Connection idle timeout (ms) | 30000 |

## Migration Strategy

Database schema migrations are managed with Knex.js. Migration scripts are located in the migrations directory and applied sequentially. Rollback support is available for the most recent migration batch.

## Query Patterns

- **Time-series queries:** Use TimescaleDB hypertable chunks for efficient range scans.
- **Aggregation queries:** Use continuous aggregates for pre-computed hourly/daily summaries.
- **Audit queries:** Partitioned by month with automatic archival after 7 years.
- **Read replicas:** Analytics queries can be routed to standby replicas for load distribution.

