# Algo IQ API Documentation Index

> Latest API documents — updated 12 Aug 2026

## Document List

| # | API | File | Base URL | Auth |
|---|---|---|---|---|
| 1 | Ganesh Broadcast API | `ganesh-api.md` | `http://192.168.190.120:9081` | Bearer Token (JWT) + x-bypass |
| 2 | Suchak Engine API v2.0 | `suchak-api.md` | `http://localhost:8060` | JWT Bearer (public endpoints exist) |
| 3 | Surya External Engine API | `surya-api.md` | `http://192.168.190.120:9191` | X-API-KEY + X-CLIENT-CODE (dual auth) |
| 4 | TalkDelta Prime API | `talkdelta-api.md` | `http://localhost:5000` | None |
| 5 | TalkOptions API | `talkoptions-api.md` | `https://webapi.talkoptions.in` | x-bypass header |
| 6 | WebSocket Integration Guide | `websocket-api.md` | `wss://wssreact.talkoptions.in` | Query param token |
| 7 | Vega TalkStrategy API Reference | `vega-talkstrategy-api.md` | `http://localhost:50000` | JWT Bearer (HS256) |
| 8 | Vega TalkStrategy Dashboard Guide | `vega-talkstrategy-dashboard.md` | `http://localhost:50000` | JWT Bearer |
| 9 | Vega TalkStrategy Postman Collection | `vega-talkstrategy-postman.json` | — | — |

## Key Endpoints Summary

### Ganesh (OHLC Data)
- `POST /api/Auth/Login`
- `POST /api/Broadcast/GetOHLC`
- `POST /api/Broadcast/GetRequiredTokenOHLC`
- `POST /api/Broadcast/combined-ohlc`
- `POST /api/Broadcast/Expression-ohlc`
- `POST /api/Broadcast/ByContract-ohlc`
- `POST /api/BroadcastBse/GetOHLC`
- `POST /api/BroadcastBse/ByContract-ohlc`

### Suchak (Technical Indicators)
- `POST /auth/login`
- `POST /api/v1/indicator/value` (105 indicators)
- `GET /dashboard/fast`
- `GET /status`
- `GET /api/ltp-stream` (SSE)
- `GET /screeners` + CRUD
- `POST /instruments`
- `GET /candles/:symbol`
- `GET /mst/symbols`, `GET /mst/lookup`
- `GET /api/debug/plugins`, `GET /api/debug/calculation`
- `GET /broadcast/status`, `POST /broadcast/fetch`

### Surya (Exchange Reference Data — SSOT)
- `POST /api/v1/auth/clients/approve` (One-Time Approval)
- `GET /api/v1/instruments/search`
- `GET /api/v1/instruments/token/{token}`
- `GET /api/v1/instruments/contracts`
- `GET /api/v1/instruments/bhavcopy`
- `GET /api/v1/instruments/holidays`
- `GET /api/v1/exchangefilemanager/monitoring`
- `GET /api/v1/ingestion/download`
- `GET /api/v1/dashboard/stats`
- 57 total endpoints

### TalkDelta Prime (Portfolio Analytics)
- `GET /portfolio`, `POST /portfolio`
- `POST /portfolio/push`
- `GET /var`, `GET /var/{name}`, `POST /var`, `POST /var/push`
- `POST /tradetrail`

### TalkOptions (Options Analytics — 279 endpoints)
- `POST /api/Auth/Login`
- Market: Adv/Dec, Sectorial, Heatmap, Contributors
- Analysis: IV Screener, Skew, Greeks, OI, PCR
- Strategies: Straddle, Strangle, Butterfly, Ratio
- NSE Contracts, Portfolio, Watchlist, AI Analysis

### Vega TalkStrategy (Order Execution)
- `POST /api/auth/login`, `register`, `refresh`, `logout`
- Admin: users, accounts, mq-configs, strategy-configs, translation-configs
- `GET /api/book/orders`, `GET /api/book/trades`
- `POST /api/positions/strategy`, `GET /api/positions/vendor`
- `POST /api/orders/place`, `cancel`, `modify`, `cancel-all`, `squareoff-all`
- `POST /api/strategy/{id}/exit`, `cancel`, `exit-multi`, `net-position`
- `POST /api/subscribe`, `DELETE /api/subscribe`
- `POST /api/xts/orders`, `modify`, `cancel`
- `GET /api/contract`, `POST /api/contract/fetch`
- `POST /api/messaging/raw`
- `GET /api/enums`
