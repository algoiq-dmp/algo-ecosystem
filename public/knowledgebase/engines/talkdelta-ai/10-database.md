# TalkDelta AI — Database Schema

**Version:** 1.4.0 | **Owner:** AI/ML | **Last Updated:** 2026-07-25

## Database Architecture

TalkDelta AI uses the following database systems: **MongoDB, Redis**.

## Storage Strategy

- **Primary store:** Transactional data with ACID compliance
- **Cache layer:** Redis for hot data with configurable TTL (default 300s)
- **Time-series:** Specialized TSDB for high-frequency metric ingestion

## MongoDB Schema

| Table | Description | Primary Key / Index |
|-------|-------------|---------------------|
| `ml_models` | Serialized ML model artifacts and versions | `model_name, version` |
| `training_data` | Training dataset snapshots for model retraining | `dataset_id, created_at` |
| `inference_log` | Model inference requests and predictions | `request_id, model_name` |



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
