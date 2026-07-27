# TalkDelta — Database Schema

**Version:** 5.1.0 | **Owner:** Analytics | **Last Updated:** 2026-07-25

## Database Architecture

TalkDelta uses the following database systems: **PostgreSQL, TimescaleDB, Redis**.

## Storage Strategy

- **Primary store:** Transactional data with ACID compliance
- **Cache layer:** Redis for hot data with configurable TTL (default 300s)
- **Time-series:** Specialized TSDB for high-frequency metric ingestion

## PostgreSQL Schema

| Table | Description | Primary Key / Index |
|-------|-------------|---------------------|
| `analytics_results` | Computed analytics output data | `symbol, timestamp, computation_type` |
| `configuration` | Runtime configuration parameters | `config_key` |
| `audit_log` | API access and computation audit trail | `timestamp, user_id, action` |
| `symbol_master` | Symbol reference data from Surya | `symbol, exchange, segment` |
| `cache_metadata` | Cache invalidation and TTL tracking | `cache_key` |



## Connection Configuration

| Parameter | Value |
|-----------|-------|
| Connection pool size | 50 (min), 200 (max) |
| Connection timeout | 30 seconds |
| Idle timeout | 600 seconds |
| SSL mode | Required (verify-full) |
| Max retries | 3 with exponential backoff |

## Migration Strategy

- Schema migrations use Flyway with versioned SQL scripts
- All migrations are backward-compatible (no breaking changes)
- Rollback tested in staging before production deployment
- Migration lock timeout: 60 seconds

## Backup Policy

- Full backup: Daily at 02:00 IST, retained for 30 days
- WAL archiving: Continuous, retained for 7 days
- Point-in-time recovery window: 7 days
- Backup verification: Weekly automated restore test
