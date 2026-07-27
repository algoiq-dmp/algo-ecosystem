# 22 â€” Frequently Asked Questions

**Version:** 3.2.1 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24

---

## General

**Q: What is Ganesh?**
A: Ganesh is the central OHLC data provider for the Algo-IQ ecosystem. It aggregates real-time market ticks into Open-High-Low-Close bars across five timeframes (1m, 5m, 15m, 1H, 1D) and serves as the single source of truth for all historical price data.

**Q: How does Ganesh differ from Lakshmi?**
A: Lakshmi distributes raw real-time ticks, while Ganesh aggregates those ticks into structured OHLC bars and stores them historically. Lakshmi is the data highway; Ganesh is the data warehouse.

**Q: What timeframes does Ganesh support?**
A: 1 minute, 5 minute, 15 minute, 1 hour, and 1 day. All bars are aligned to standard market timestamps.

**Q: Who owns Ganesh?**
A: The Data Engineering team. Contact via Slack #ganesh-support or Jira project GANESH.

---

## Data

**Q: How far back does historical data go?**
A: Ganesh stores at least 10 years of OHLC data. Data within the last 90 days is served from Redis cache (sub-5ms). Older data is served from PostgreSQL (sub-50ms).

**Q: Are OHLC bars adjusted for corporate actions?**
A: Yes. Ganesh receives corporate action notifications from Surya and adjusts all historical bars within 30 seconds. Adjusted bars are flagged with `adjusted: true`.

**Q: How are missing bars (gaps) handled?**
A: Ganesh automatically detects gaps and alerts the Data Engineering team. Gaps are filled via manual backfill or exchange data replay.

**Q: What happens during a market holiday?**
A: No bars are generated for market holidays. The daily bar for the last trading day remains as the latest until the next trading session.

**Q: Can I get partial (in-progress) bars?**
A: Yes. The latest bar endpoint returns the current partial bar if the timeframe window is still open.

---

## API

**Q: How do I authenticate with the Ganesh API?**
A: All requests require a Suraksha-issued JWT token in the `Authorization: Bearer <token>` header. Tokens are valid for 15 minutes.

**Q: What is the rate limit?**
A: Real-time engines (100 req/s), simulators (50 req/s), dashboards (20 req/s), internal services (500 req/s).

**Q: How do I get a large historical range?**
A: Use the range query endpoint with `from` and `to` parameters. Maximum 10,000 bars per request. Split larger ranges into multiple requests.

**Q: Why am I getting 404 for a valid symbol?**
A: The symbol may not have bars for the requested timestamp range. Check if the symbol was listed after your query range.

**Q: Do you support WebSocket streaming?**
A: No. Ganesh is REST API only. For real-time streaming, subscribe to Lakshmi's WebSocket feed which includes Ganesh-derived bars.

---

## Performance

**Q: What is the typical API latency?**
A: 2â€“5ms for cached data (within 90 days), 20â€“50ms for cold data (older than 90 days).

**Q: How many symbols does Ganesh support?**
A: 5,000 active symbols concurrently, scalable to 20,000.

**Q: What happens during market open spikes?**
A: Ganesh handles the 9:15 AM spike where all 1-minute bars finalize simultaneously via ring buffers.

**Q: Can Ganesh handle all NSE/BSE symbols?**
A: Yes, all listed symbols across NSE, BSE, and MCX.

---

## Operations

**Q: How do I check Ganesh's health?**
A: `GET /api/v1/health` for liveness, `GET /api/v1/health/deep` for full dependency checks.

**Q: How do I report a data quality issue?**
A: Jira ticket in project GANESH, component "data-quality". Include symbol, timeframe, timestamp, and expected vs actual values.

**Q: What is the deployment frequency?**
A: Weekly releases. Critical hotfixes can be deployed same-day.

**Q: Is there a sandbox environment?**
A: Yes. `https://ganesh-sandbox.algoiq.io` provides synthetic OHLC data for development without authentication.

---

## Integration

**Q: How do I register as a new consumer?**
A: Use Narad CLI: `narad-cli register-consumer --name "Your Service" --type "your-type"`.

**Q: Can I query multiple symbols at once?**
A: Not in a single API call. Use the multi-timeframe endpoint for one symbol across timeframes. For multiple symbols, parallelize requests.

**Q: What's the recommended polling interval?**
A: For real-time engines, poll every 1 second. Use the `If-Modified-Since` header for efficiency.
