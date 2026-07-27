# TradePilot — Configuration

**Version:** 2.2.0 | **Owner:** Operations | **Last Updated:** 2026-07-24

## Configuration File

`/etc/tradepilot/config.yaml` or environment variables with `TP_` prefix.

## Key Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `TP_PORT` | `3160` | API port |
| `TP_DB_HOST` | `localhost` | PostgreSQL host |
| `TP_DB_NAME` | `tradepilot` | Database name |
| `TP_KYC_PROVIDER` | `internal` | KYC verification provider (internal/external) |
| `TP_APPROVAL_STAGES` | `submission,compliance,risk,final` | Approval workflow stages |
| `TP_AUTO_APPROVE_LOW_RISK` | `false` | Auto-approve low-risk strategies |
| `TP_DOC_RETENTION_DAYS` | `2555` | Document retention period (7 years) |
| `TP_SEBI_RULES_VERSION` | `2024.1` | SEBI regulatory rule set version |
| `TP_EXCHANGE_RULES_VERSION` | `2026-Q2` | Exchange rule set version |

## Environment-Specific

Production enforces all approval stages with mandatory human review for medium/high risk. Staging allows auto-approval for testing workflows.
