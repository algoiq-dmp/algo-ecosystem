# SUCHAK ENGINE — REST API Reference v2.0

**Technical Indicator Computation Engine | Algo IQ Ecosystem**

---

## Base URL

```
http://localhost:8060
```

All requests use JSON. All responses are JSON.

---

## Authentication

### POST /auth/login

Authenticate and receive a JWT bearer token.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `username` | string | Yes | Admin username |
| `password` | string | Yes | Admin password |

**Example:**
```json
{
  "username": "ALGOIQ",
  "password": "Suchak@2026#Secure"
}
```

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "admin",
    "username": "ALGOIQ",
    "role": "admin"
  }
}
```

**Error Response (401):**
```json
{
  "error": "Invalid credentials"
}
```

### Using the Token

All authenticated endpoints require the token in the `Authorization` header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

Public endpoints (marked below) do not require authentication.

---

## 1. Indicator API

> Public endpoint — No authentication required.

### POST /api/v1/indicator/value

Compute a technical indicator value for a symbol or token.

**Request Body:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `token` | integer | Conditional | — | Exchange token number. Required if `symbol` is not provided. |
| `instrument` | string | Conditional | — | Instrument code. Required if `token` is provided. See instrument codes below. |
| `symbol` | string | Conditional | — | Symbol name (e.g. `NIFTY`, `BANKNIFTY`, `TCS`). Required if `token` is not provided. |
| `indicator` | string | **Yes** | — | Indicator name. See supported indicators section. |
| `timeframe` | string | **Yes** | — | Candle timeframe. Format: `{N}{unit}`. Example: `1m`, `5m`, `1h`, `D`, `W`, `M` |
| `parameters` | object | No | `{}` | Indicator-specific parameters. See per-indicator parameters section. |
| `candleState` | string | No | `live` | Candle state: `live` (includes current unclosed candle) or `closed` (completed candles only) |
| `strategyName` | string | No | — | Arbitrary name for tracking/display purposes |
| `exchange` | string | No | `NSE` | Exchange code |

**Instrument Codes:**

| Code | Description | Database Table | Ganesh Equivalent |
|------|-------------|---------------|-------------------|
| `IXCM` | Index | `instruments` / `indiceshistoricaldata` | `IXCM` |
| `IX_CM` | Index (database format) | `instruments` | `IXCM` |
| `CM` | Cash/Equity Market | `mstsecurity` | `CM` |
| `EQ` | Equity (database format) | `mstsecurity` WHERE stype='EQ' | `CM` |
| `FUTIDX` | Index Futures | `mstcontract` | `FUTIDX` |
| `OPTIDX` | Index Options | `mstcontract` | `OPTIDX` |
| `FUTSTK` | Stock Futures | `mstcontract` | `FUTSTK` |
| `OPTSTK` | Stock Options | `mstcontract` | `OPTSTK` |

**Request Examples:**

Using token (recommended for automated strategies):
```json
{
  "token": 4,
  "instrument": "IXCM",
  "strategyName": "BollingerBands",
  "timeframe": "1m",
  "indicator": "BollingerBands",
  "parameters": { "period": 20, "multiplier": 2 },
  "candleState": "closed"
}
```

Using symbol:
```json
{
  "symbol": "NIFTY 50",
  "timeframe": "1m",
  "indicator": "SMA",
  "parameters": { "period": 6 },
  "candleState": "live"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "symbol": "NIFTY 50",
  "exchange": "NSE",
  "timeframe": "1m",
  "indicator": "BollingerBands",
  "strategyName": "BollingerBands",
  "token": 4,
  "instrument": "IXCM",
  "candleState": "closed",
  "parameters": {
    "period": 20,
    "multiplier": 2
  },
  "value": {
    "middle": 893.55,
    "upper": 894.38,
    "lower": 892.71,
    "width": 1.66
  },
  "timestamp": "2026-08-11T10:31:43"
}
```

**Error Response (400/404):**
```json
{
  "success": false,
  "message": "Indicator 'XYZ' is not supported."
}
```

---

## 2. Supported Indicators & Parameters

### Trend Indicators

| Indicator | Required Parameters | Optional | Return Value |
|-----------|-------------------|----------|--------------|
| `SMA` | `period` (default: 6) | — | `number` — Simple Moving Average |
| `EMA` | `period` (default: 9) | — | `number` — Exponential Moving Average |
| `WMA` | `period` (default: 14) | — | `number` — Weighted Moving Average |
| `HMA` | `period` (default: 16) | — | `number` — Hull Moving Average |
| `DEMA` | `period` (default: 20) | — | `number` — Double EMA |
| `TEMA` | `period` (default: 20) | — | `number` — Triple EMA |
| `KAMA` | `period` (default: 10) | — | `number` — Kaufman Adaptive MA |
| `VWAP` | — | — | `{ vwap, cumVolume }` |

### Momentum Indicators

| Indicator | Required Parameters | Optional | Return Value |
|-----------|-------------------|----------|--------------|
| `RSI` | `period` (default: 14) | — | `number` (0-100) |
| `MACD` | — | — | `{ macd, signal, histogram }` |
| `Stochastic` | `kPeriod` (default: 14), `dPeriod` (default: 3) | — | `{ k, d }` |
| `StochRSI` | `rsiPeriod` (default: 14), `stochPeriod` (default: 14), `smoothK` (default: 3), `smoothD` (default: 3) | — | `{ k, d }` |
| `CCI` | `period` (default: 20) | — | `number` |
| `WilliamsR` | `period` (default: 14) | — | `number` (-100 to 0) |
| `ROC` | `period` (default: 12) | — | `number` % |
| `CMO` | `period` (default: 14) | — | `number` (-100 to 100) |
| `TSI` | — | — | `number` (-100 to 100) |
| `AO` | — | — | `number` — Awesome Oscillator |
| `PPO` | — | — | `{ ppo, signal, histogram }` |
| `TRIX` | `period` (default: 15) | — | `number` |
| `DPO` | `period` (default: 20) | — | `number` |
| `Fisher` | `period` (default: 10) | — | `{ fish, trigger }` |
| `ElderRay` | `period` (default: 13) | — | `{ bullPower, bearPower }` |
| `SchaffTC` | — | — | `number` (0-100) |

### Volatility Indicators

| Indicator | Required Parameters | Optional | Return Value |
|-----------|-------------------|----------|--------------|
| `ATR` | `period` (default: 14) | — | `number` |
| `NATR` | `period` (default: 14) | — | `number` % |
| `BollingerBands` | `period` (default: 20) | `multiplier` (default: 2) | `{ middle, upper, lower, width }` |
| `BBW` | `period` (default: 20) | `multiplier` (default: 2) | `number` % |
| `Keltner` | `period` (default: 20) | `multiplier` (default: 2) | `{ middle, upper, lower }` |
| `Donchian` | `period` (default: 20) | — | `{ upper, lower, middle }` |
| `Choppiness` | `period` (default: 14) | — | `number` (0-100, >61.8 = ranging) |
| `StdDev` | `period` (default: 20) | — | `number` |
| `HV` | `period` (default: 20) | — | `number` % |

### Trend Direction Indicators

| Indicator | Required Parameters | Optional | Return Value |
|-----------|-------------------|----------|--------------|
| `SuperTrend` | `period` (default: 10) | `factor` (default: 3) | `{ value, state, atr, upperBand, lowerBand }` |
| `ADX` | `period` (default: 14) | — | `{ adx, plusDI, minusDI }` |
| `ADXR` | `period` (default: 14) | — | `number` |
| `Aroon` | `period` (default: 25) | — | `{ up, down }` |
| `ParabolicSAR` | — | — | `{ sar, trend }` |
| `Vortex` | `period` (default: 14) | — | `{ plus, minus, signal }` |
| `Ichimoku` | — | — | `{ tenkan, kijun, senkouA, senkouB, chikou }` |

### Volume Indicators

| Indicator | Required Parameters | Optional | Return Value |
|-----------|-------------------|----------|--------------|
| `MFI` | `period` (default: 14) | — | `number` (0-100) |
| `CMF` | `period` (default: 20) | — | `number` |
| `OBV` | — | — | `number` — cumulative |
| `ForceIndex` | `period` (default: 13) | — | `number` |
| `VPT` | — | — | `number` — cumulative |
| `ChaikinOsc` | — | — | `number` |
| `Klinger` | — | — | `{ kvo, signal }` |
| `VolOsc` | `fastPeriod` (default: 5), `slowPeriod` (default: 10) | — | `number` % |

### Structure Indicators

| Indicator | Required Parameters | Optional | Return Value |
|-----------|-------------------|----------|--------------|
| `MarketStructure` | — | — | `string` — HH/HL/LH/LL |
| `HLRange` | `period` (default: 20) | — | `{ high, low }` |
| `SwingHL` | `strength` (default: 5) | — | `{ swingHigh, swingLow }` |
| `PriceVsSMA` | `period` (default: 20) | — | `{ position }` — Above/Below |
| `PriceVsST` | `factor` (default: 3), `atrPeriod` (default: 10) | — | `{ position }` — Above/Below |
| `TriggerLine` | — | — | `{ value, ltp }` |
| `ZigZag` | `pct` (default: 5) | — | `{ type, price }` — top/bottom |

---

## 3. Dashboard API

> Public endpoint — No authentication required.

### GET /dashboard/fast

Returns all runtime data in a single call — symbols, screeners, market cards, feed status, widgets.

**Query Parameters:** None

**Response:**
| Field | Type | Description |
|-------|------|-------------|
| `runtime` | object | Per-symbol runtime data with all indicator values |
| `symbols` | array | List of all computed symbols |
| `screeners` | array | All screeners with their symbol lists |
| `marketCards` | array | Index cards: NIFTY, BANKNIFTY, FINNIFTY, MIDCPNIFTY |
| `feed` | object | `{ source, websocket, ganesh }` — feed status |
| `updates` | object | `{ total, sent, pending, failed }` — data dispatch stats |
| `recentData` | array | Recently added instruments |
| `configs` | array | Active indicator configurations |
| `alerts` | array | System alerts |
| `accuracy` | array | Indicator accuracy percentages |
| `ticksProcessed` | number | Total ticks fed to engine |
| `uptime` | number | Server uptime in seconds |
| `process` | object | CPU + memory metrics |
| `timestamp` | number | Epoch timestamp |

### GET /status

Engine health status.

```json
{
  "engine": "Suchak",
  "version": "2.0.0-compute",
  "mode": "LIVE",
  "status": "ACTIVE",
  "feed": { "source": "websocket", "surya": null, "ganesh": true, "websocket": true, "wsSymbols": 5 },
  "database": { "connected": true, "status": "healthy" },
  "compute": { "symbols": 7, "screeners": 4, "ticksProcessed": 50000, "timeframes": ["10s","1m",...] },
  "uptime": 3600
}
```

---

## 4. Real-Time Stream

> Public endpoint — No authentication required.

### GET /api/ltp-stream

Server-Sent Events (SSE) endpoint streaming live LTP ticks for all tracked symbols.

**Headers Set:**
```
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
```

**Event Format:**
```
data: {"type":"tick","symbol":"NIFTY","ltp":24600.50,"time":"2026-08-11T09:12:23.000Z","source":"websocket"}
```

**JavaScript (Browser):**
```javascript
const es = new EventSource('http://localhost:8060/api/ltp-stream');

es.onopen = () => console.log('Connected');
es.onmessage = (event) => {
  const { symbol, ltp } = JSON.parse(event.data);
  // Update your UI
};
es.onerror = () => {
  es.close();
  setTimeout(() => reconnect(), 2000);
};
```

**Heartbeat:** Server sends `: heartbeat\n\n` comment every 15 seconds to keep connection alive.

---

## 5. Screener API

### GET /screeners
> Public endpoint

List all screeners.
```json
{
  "screeners": [
    {
      "id": "suchak_1",
      "name": "Suchak 1 — Scalping",
      "category": "General",
      "symbolCount": 4,
      "isPreset": true
    }
  ]
}
```

### GET /screener/:id
> Public endpoint

Get detailed screener data with all indicator values for each symbol.

### POST /screeners
> Requires Auth

Create a new screener.
```json
{ "name": "My Screener", "category": "General", "symbols": ["NIFTY", "BANKNIFTY"] }
```

### POST /screener/:id/symbols
> Requires Auth

Add symbols to existing screener.
```json
{ "symbols": ["TCS", "RELIANCE"] }
```

### DELETE /screener/:id/symbols
> Requires Auth

Remove symbols.
```json
{ "symbols": ["TCS"] }
```

### DELETE /screener/:id
> Requires Auth

Delete entire screener.

---

## 6. Instrument Registration

### GET /instruments
> Public endpoint

List all registered instruments.

### POST /instruments
> Requires Auth

Register a new instrument for computation.
```json
{
  "symbol": "TCS",
  "token": 11536,
  "instrument_code": "CM",
  "display_name": "Tata Consultancy Services"
}
```

### DELETE /instruments/:id
> Requires Auth

Remove an instrument.

---

## 7. Candle / OHLC Data

### GET /candles/:symbol?tf=1m
> Public endpoint

Get historical OHLC candles for a symbol.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `tf` | string | `1m` | Timeframe: `10s`, `1m`, `5m`, `1h`, `D`, `W`, `M` |

**Response:**
```json
{
  "symbol": "NIFTY",
  "tf": "1m",
  "candles": [
    { "o": 24590.00, "h": 24595.00, "l": 24585.00, "c": 24592.50, "v": 100, "ts": 1786345722000 },
    { "o": 24592.50, "h": 24600.00, "l": 24590.00, "c": 24598.00, "v": 150, "ts": 1786345782000 }
  ]
}
```

---

## 8. Symbol Search

### GET /mst/symbols?q=&type=&limit=
> Public endpoint

Search symbols across master tables.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `q` | string | — | Search text (partial match) |
| `type` | string | — | Filter: `EQ` (equity), `IXCM` (index), `FO` (F&O) |
| `limit` | number | 20 | Max results |

### GET /mst/lookup?symbol=&type=
> Public endpoint

Lookup token number for a given symbol name.

---

## 9. Debug Endpoints

> Public endpoints — No authentication required.

### GET /api/debug/plugins

All registered indicator engines and their data availability.

```json
{
  "total": 105,
  "active": 54,
  "inactive": 51,
  "list": [
    { "name": "rsi", "hasData": true },
    { "name": "mfi", "hasData": false }
  ]
}
```

### GET /api/debug/calculation?indicator=&symbol=&tf=

Live calculation breakdown for debugging.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `indicator` | string | Yes | `sma`, `ema`, `rsi`, `macd`, `st`, `atr`, `bb`, `vwap`, etc. |
| `symbol` | string | Yes | Symbol name |
| `tf` | string | No | Timeframe (default: `10s`) |

---

## 10. Broadcast API

### GET /broadcast/status
> Public endpoint

Broadcast client connection status.

### POST /broadcast/fetch
> Requires Auth

Fetch OHLC data from Ganesh broadcast server.
```json
{
  "token": 4,
  "instrument": "IXCM",
  "from": 1786345722000,
  "to": 1786349322000,
  "symbol": "NIFTY"
}
```

---

## Error Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Invalid parameters |
| 401 | Authentication required |
| 403 | Forbidden (role insufficient) |
| 404 | Not found |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

---

## Rate Limiting

- Indicator API: No rate limit (public)
- Auth endpoints: 5 requests per minute per IP
- Write operations (POST screener, instrument): No rate limit

---

## Data Sources

| Source | Description | Used For |
|--------|-------------|----------|
| **WebSocket (TalkOptions)** | Real-time LTP ticks | Live index prices |
| **Ganesh Broadcast** | Historical OHLC candles | Indicator computation |
| **BOD Bhavcopy** | End-of-day index futures OHLC | Close price reference |
| **mstsecurity** | Equity master data | Symbol ↔ Token mapping |
| **mstcontract** | F&O master data | Symbol ↔ Token mapping |
| **indiceshistoricaldata** | Index master data | Index symbol resolution |
