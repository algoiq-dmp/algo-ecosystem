---
version: 5.0.0
owner: Margin Intelligence
last_updated: 2026-07-25
---

# 10 — Database

## PostgreSQL Schema Design

The Garuda database follows a multi-tenant architecture with broker-level data isolation. All tables are partitioned by `broker_id` (hash) or `calculation_date` (range) for performance and manageability.

## Core Tables

### positions

Stores all trading positions. Partitioned by HASH(broker_id) with 16 partitions.

| Column | Type | Description |
|---|---|---|
| position_id | UUID | Primary key |
| broker_id | VARCHAR(20) | Multi-tenant partition key |
| client_code | VARCHAR(20) | Client identifier |
| exchange | VARCHAR(10) | NSE, BSE, MCX, NCDEX |
| segment | VARCHAR(10) | EQ, FUT, OPT, FUTIDX, OPTIDX |
| symbol | VARCHAR(20) | Trading symbol |
| underlying | VARCHAR(20) | Underlying asset |
| expiry_date | DATE | Expiry date |
| strike_price | DECIMAL(18,4) | Strike for options |
| option_type | CHAR(2) | CE, PE |
| quantity | INTEGER | +ve Long, -ve Short |
| average_price | DECIMAL(18,4) | Average trade price |
| lot_size | INTEGER | Contract lot size |
| product_type | VARCHAR(10) | CNC, MIS, NRML |
| position_type | VARCHAR(10) | Intraday, Delivery |
| status | VARCHAR(20) | OPEN, CLOSED, EXPIRED |

**Indexes:**
- `idx_positions_client` on `(broker_id, client_code, status)` — Fast client position lookup
- `idx_positions_symbol` on `(broker_id, exchange, symbol, status)` — Price-change impact lookup
- `idx_positions_underlying` on `(broker_id, underlying, expiry_date)` — SPAN commodity grouping

### margin_results

Stores every margin calculation result. Partitioned by RANGE(calculation_date) monthly.

| Column | Type | Description |
|---|---|---|
| calc_id | UUID | Primary key |
| broker_id | VARCHAR(20) | Multi-tenant key |
| client_code | VARCHAR(20) | Client identifier |
| calculation_type | VARCHAR(20) | INTRADAY, EOD, MANUAL, WHATIF |
| calculation_date | DATE | Partition key |
| total_margin | DECIMAL(18,4) | Final margin amount |
| total_span_margin | DECIMAL(18,4) | SPAN component |
| total_exposure_margin | DECIMAL(18,4) | Exposure component |
| net_option_value | DECIMAL(18,4) | NOV component |
| calendar_spread_benefit | DECIMAL(18,4) | Calendar spread reduction |
| portfolio_benefit | DECIMAL(18,4) | Portfolio-level reduction |
| peak_margin_flag | BOOLEAN | Whether this is the peak snapshot |
| utilization_pct | DECIMAL(8,4) | Margin utilization ratio |
| shortfall_amount | DECIMAL(18,4) | Generated column: MAX(0, margin - available) |
| position_snapshot | JSONB | Positions at calculation time |
| reconciliation_status | VARCHAR(20) | PENDING, MATCHED, DISCREPANCY |

**Indexes:**
- `idx_margin_client_date` on `(broker_id, client_code, calculation_date)` — Client history
- `idx_margin_date` on `(calculation_date)` — EOD batch reconciliation

### hedge_recommendations

Stores hedge optimization output for audit and backtesting.

| Column | Type | Description |
|---|---|---|
| recommendation_id | UUID | Primary key |
| broker_id | VARCHAR(20) | Multi-tenant key |
| client_code | VARCHAR(20) | Client identifier |
| calc_id | UUID | Reference to margin calculation |
| hedge_rank | INTEGER | Rank (1-5) |
| action | VARCHAR(10) | BUY, SELL |
| instrument | VARCHAR(100) | Hedge instrument |
| quantity | INTEGER | Hedge quantity |
| hedge_cost | DECIMAL(18,4) | Cost of hedge |
| margin_before | DECIMAL(18,4) | Margin before hedge |
| margin_after | DECIMAL(18,4) | Margin after hedge |
| margin_saved | DECIMAL(18,4) | Reduction achieved |
| confidence_score | DECIMAL(5,2) | ML model confidence |
| optimization_goal | VARCHAR(30) | MINIMIZE_MARGIN, DELTA_NEUTRAL, COST_EFFICIENT |
| applied | BOOLEAN | Whether hedge was executed |
| created_at | TIMESTAMPTZ | Recommendation timestamp |

### portfolios

Portfolio configuration and metadata.

| Column | Type | Description |
|---|---|---|
| portfolio_id | UUID | Primary key |
| broker_id | VARCHAR(20) | Multi-tenant key |
| portfolio_name | VARCHAR(255) | Display name |
| portfolio_type | VARCHAR(30) | INDIVIDUAL, GROUP, FAMILY, BROKER |
| parent_portfolio_id | UUID | Hierarchical grouping |
| client_codes | JSONB | Array of client codes in portfolio |
| margin_config | JSONB | Custom margin parameters |
| created_at | TIMESTAMPTZ | Creation timestamp |

### users

User accounts with RBAC integration.

| Column | Type | Description |
|---|---|---|
| user_id | UUID | Primary key |
| broker_id | VARCHAR(20) | Broker scope |
| username | VARCHAR(255) | Email format, unique per broker |
| password_hash | VARCHAR(512) | Argon2id hash |
| role | VARCHAR(50) | SuperAdmin, BrokerAdmin, RiskManager, Dealer, Viewer, APIUser |
| status | VARCHAR(30) | ACTIVE, LOCKED, DISABLED |
| mfa_enabled | BOOLEAN | MFA/TOTP status |
| failed_attempts | INTEGER | Login failure counter |
| permissions | JSONB | Fine-grained permission overrides |

### audit_log

Immutable audit trail. Partitioned by RANGE(created_at) monthly.

| Column | Type | Description |
|---|---|---|
| audit_id | BIGINT | Auto-increment ID |
| broker_id | VARCHAR(20) | Multi-tenant key |
| event_type | VARCHAR(50) | MARGIN_CALCULATED, USER_LOGIN, POSITION_CREATED |
| event_source | VARCHAR(100) | Service name |
| user_id | UUID | Actor |
| client_code | VARCHAR(20) | Affected client |
| correlation_id | VARCHAR(100) | Request tracing ID |
| event_data | JSONB | Full event context |
| severity | VARCHAR(10) | DEBUG, INFO, WARNING, ERROR, CRITICAL |
| created_at | TIMESTAMPTZ | Event timestamp |

## Supporting Tables

| Table | Purpose |
|---|---|
| **contracts** | Exchange securities master (symbol, lot size, tick size, expiry) |
| **trades** | Individual trade records from broker OMS |
| **sessions** | JWT refresh token families, device tracking |
| **token_blacklist** | Revoked JWT tokens (until expiry) |
| **exchange_configs** | Per-broker exchange credentials (TM Code, CP Code, SFTP) |
| **span_parameters** | Exchange-published SPAN parameters (PSR, VSR, SOM, spread rates) |
| **exchange_files** | File metadata for ingested exchange files |
| **api_usage_log** | API call audit (endpoint, status, latency, IP) |
| **file_uploads** | CSV/JSON position upload tracking |

## Materialized Views

### mv_active_span_parameters
Latest effective SPAN parameters per exchange/underlying. Refreshed every 30 minutes during market hours.

### mv_daily_peak_margins
Pre-computed daily peak margins per client. Refreshed after EOD batch completion. Enables fast dashboard rendering and regulatory reporting.

## Stored Procedures

| Procedure | Purpose |
|---|---|
| `sp_rollover_cnc_positions(date)` | Move intraday CNC positions to delivery, auto-square-off MIS |
| `sp_calculate_peak_margin(date, broker_id)` | Compute peak margin from intraday snapshots |
| `sp_purge_expired_sessions()` | Cleanup expired sessions and token blacklist |

## Partitioning Strategy

| Table | Partition Type | Partition Key | Partitions |
|---|---|---|---|
| positions | HASH | broker_id | 16 |
| margin_calculations | RANGE | calculation_date | Monthly |
| trades | RANGE | trade_date | Daily (archived after 90d) |
| audit_log | RANGE | created_at | Monthly |
| api_usage_log | RANGE | created_at | Daily |

## Backup Schedule

| Backup Type | Frequency | Retention | Tool |
|---|---|---|---|
| Full Backup | Daily (1:00 AM IST) | 30 days | WAL-G |
| WAL Archive | Continuous | 30 days | WAL-G |
| Full Backup (Weekly) | Sunday | 90 days | WAL-G (Cool tier) |
| Full Backup (Monthly) | 1st of month | 7 years | WAL-G (Archive tier) |

## Data Retention

| Data | Active Retention | Archive Retention |
|---|---|---|
| Margin Calculations | 2 years | 7 years |
| Audit Log | 1 year | 7 years |
| Position History | 90 days | 7 years |
| API Usage | 90 days | 1 year |
| Session Data | 24 hours | N/A |
