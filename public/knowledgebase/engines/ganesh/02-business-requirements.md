# 02 â€” Business Requirements

**Version:** 3.2.1 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24

---

## BR-01: Multi-Timeframe OHLC Storage

The system MUST generate and store OHLC bars at five timeframes: **1 minute, 5 minute, 15 minute, 1 hour, and 1 day**. Each bar MUST include open, high, low, close, volume, and open interest (where applicable). Bars MUST be aligned to standard market timestamps.

## BR-02: Historical Data Retention

The system MUST retain at least **10 years of historical OHLC data**. Data older than 90 days MAY reside in cold storage with acceptable retrieval latency up to 500ms. Data within the most recent 90 days MUST be served from hot cache with sub-5ms latency.

## BR-03: Corporate Action Adjustments

The system MUST adjust all historical OHLC bars when notified of corporate actions (stock splits, bonus issues, dividends, rights issues) within **30 seconds** of receiving a Surya notification. All bars prior to the ex-date MUST be adjusted proportionally.

## BR-04: Consumer API Availability

The system MUST expose a REST API with 99.9% uptime (less than 8.76 hours of downtime per year). The API MUST support:
- Single-bar queries by symbol and timestamp
- Range queries (date range, symbol)
- Multi-timeframe batch queries
- Latest-bar snapshots for all active symbols

## BR-05: Data Integrity

The system MUST validate every OHLC bar for logical consistency (High >= Low, High >= Open, High >= Close, Low <= Open, Low <= Close). Invalid bars MUST be flagged and excluded from the API response until corrected.

## BR-06: Gap Detection

The system MUST detect gaps in OHLC data (missing bars for a trading period) and alert the operations team within 60 seconds. Gap reports MUST include symbol, missing timeframe, and expected timestamp range.

## BR-07: Performance at Scale

The system MUST support at least **5,000 active symbols** with OHLC bars computed simultaneously across all timeframes. Aggregation latency from tick receipt to bar finalization MUST not exceed **100ms** for the 1-minute timeframe.

## BR-08: Consumer Metadata

The system MUST track which consumers queried which symbols and timeframes, providing usage analytics to the Data Engineering team. This data SHALL be exported to Narad's monitoring dashboard.

## BR-09: Disaster Recovery

The system MUST support hot-standby failover with a Recovery Time Objective (RTO) of **5 minutes** and a Recovery Point Objective (RPO) of **zero data loss** for all persisted bars.

## BR-10: Audit Trail

All corporate action adjustments MUST be logged with before/after values, timestamps, and the triggering Surya event ID. This audit trail MUST be retained for 7 years for compliance purposes.
