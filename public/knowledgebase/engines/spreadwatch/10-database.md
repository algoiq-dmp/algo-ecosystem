# SpreadWatch — Database Schema

**Version:** 2.8.0 | **Owner:** Analytics | **Last Updated:** 2026-07-25

## Database Architecture

SpreadWatch uses the following database systems: **TimescaleDB**.

## Storage Strategy

- **Primary store:** Transactional data with ACID compliance
- **Cache layer:** Redis for hot data with configurable TTL (default 300s)
- **Time-series:** Specialized TSDB for high-frequency metric ingestion

## TimescaleDB Schema

| Table | Description | Primary Key / Index |
|-------|-------------|---------------------|
| `time_series_data` | Time-series analytics with hypertable partitioning | `symbol, time` |
| `market_events` | Market event history with 7-day retention | `event_time, event_type` |
| `performance_metrics` | System performance time-series data | `metric_name, time` |



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
