# TalkDelta Prime - API Documentation

**Base URL:** `http://localhost:5000`

---

## Endpoints Summary

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/portfolio` | All portfolios |
| POST | `/portfolio` | Filtered portfolios |
| POST | `/portfolio/push` | Receive portfolio data |
| GET | `/var` | All VAR analysis |
| GET | `/var?name={name}` | Single VAR by query |
| GET | `/var/{name}` | Single VAR by path |
| POST | `/var` | VAR with custom params |
| POST | `/var/push` | Receive VAR data |
| POST | `/tradetrail` | Trade trail data |

---

## 1. Portfolio API

### GET /portfolio

Returns all portfolio data with greeks, P&L, and positions.

```
GET http://localhost:5000/portfolio
```

**Response:**
```json
{
  "s": "success",
  "src": "ApiPublisher (LIVE)",
  "c": 5,
  "portfolios": []
}
```

### POST /portfolio

Returns filtered or all portfolio data based on request body.

```
POST http://localhost:5000/portfolio
Content-Type: application/json
```

**All portfolios:**
```json
{}
```

**Single portfolio:**
```json
{
  "portfolioName": "NIFTY 25-AUG-26"
}
```

**Response (single):**
```json
{
  "s": "success",
  "src": "ApiPublisher (LIVE)",
  "data": [
    {
      "PortfolioId": 1,
      "PortfolioName": "NIFTY 25-AUG-26",
      "ScripName": "NIFQ2026",
      "DeltaNeutral": 37.22,
      "NetDN": 37.22,
      "TotalMTM": 28488.85,
      "TotalDelta": -37.22,
      "GammaValTotal": 0.03,
      "ThetaValTotal": -722.18,
      "VegaValTotal": 1364.09,
      "MarketRate": 24748.50,
      "Balance": 17590.00,
      "CallDelta": -37.22,
      "PutDelta": 0.00,
      "OptionRealised": 0.00,
      "OptionUnrealised": 28488.85,
      "NetAvg": 136.00,
      "NetQty": 65,
      "TotalPositions": 1,
      "Positions": [
        {
          "Symbol": "NIFH2026",
          "CallPut": "CE",
          "Strike": 24600.00,
          "NetQty": 65,
          "NetAvg": 136.00,
          "Ltp": 24748.50,
          "Delta": 0.57,
          "Gamma": 0.00,
          "Theta": -11.11,
          "Vega": 20.99,
          "M2M": 28488.85
        }
      ]
    }
  ]
}
```

**Fields:**

| Field | Type | Description |
|---|---|---|
| `s` | string | Status: "success" or "error" |
| `src` | string | Source: "ApiPublisher (LIVE)" or "ApiPublisher" |
| `PortfolioId` | int | Portfolio identifier |
| `PortfolioName` | string | Display name |
| `ScripName` | string | Underlying symbol |
| `DeltaNeutral` / `NetDN` | double | Net Delta Neutral |
| `TotalDelta` | double | Portfolio total delta |
| `TotalMTM` | double | Total Mark-to-Market |
| `GammaValTotal` | double | Portfolio total gamma |
| `ThetaValTotal` | double | Portfolio total theta |
| `VegaValTotal` | double | Portfolio total vega |
| `MarketRate` | double | Underlying spot price |
| `Balance` | double | Portfolio balance |
| `CallDelta` | double | Call option delta |
| `PutDelta` | double | Put option delta |
| `OptionRealised` | double | Realised P&L |
| `OptionUnrealised` | double | Unrealised P&L |
| `NetAvg` | double | Net average premium |
| `NetQty` | int | Total position quantity |
| `TotalPositions` | int | Number of positions |

**Position Fields:**

| Field | Type | Description |
|---|---|---|
| `Symbol` | string | Contract symbol |
| `CallPut` | string | "CE" (Call), "PE" (Put), "EQ" (Equity) |
| `Strike` | double | Strike price |
| `NetQty` | int | Position size (+long, -short) |
| `NetAvg` | double | Entry premium |
| `Ltp` | double | Last traded price |
| `Delta` | double | Position delta |
| `Gamma` | double | Position gamma |
| `Theta` | double | Position theta |
| `Vega` | double | Position vega |
| `M2M` | double | Mark-to-Market P&L |

---

## 2. VAR Analysis API

Computes Value-at-Risk scenarios at different spot levels.

### GET /var

Returns VAR for all portfolios.

```
GET http://localhost:5000/var
```

### GET /var?name={name}&steps={n}&inc={pct}

Returns VAR for a specific portfolio with custom parameters.

```
GET http://localhost:5000/var?name=NIFTY%2025-AUG-26&steps=3&inc=1.5
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `name` | string | all | Portfolio name |
| `steps` | int | 5 | Number of up/down steps |
| `inc` | double | 1.0 | Percentage increment per step |

### GET /var/{name}

Returns VAR for a specific portfolio via URL path.

```
GET http://localhost:5000/var/NIFTY%2025-AUG-26?steps=3
```

### POST /var

Returns VAR with parameters in request body.

```
POST http://localhost:5000/var
Content-Type: application/json

{
  "portfolioName": "NIFTY 25-AUG-26",
  "steps": 3,
  "inc": 2.0
}
```

**Response:**
```json
{
  "s": "success",
  "src": "ApiPublisher (LIVE)",
  "data": [
    {
      "portfolioName": "NIFTY 25-AUG-26",
      "spot": 24748.50,
      "steps": 3,
      "increment": "2%",
      "scenarios": [
        {
          "step": 1,
          "direction": "UP",
          "spot": 25243.47,
          "m2m": 44774.45
        },
        {
          "step": 1,
          "direction": "DOWN",
          "spot": 24253.53,
          "m2m": 8500.00
        }
      ]
    }
  ]
}
```

**Scenario Fields:**

| Field | Type | Description |
|---|---|---|
| `step` | int | Step number (1 to steps) |
| `direction` | string | "UP" or "DOWN" |
| `spot` | double | Projected spot at this step |
| `m2m` | double | Projected M2M at this step |

**Spot Formula:**
```
UP:   spot × (1 + inc/100)^step
DOWN: spot × (1 - inc/100)^step
```

---

## 3. Trade Trail API

Retrieves trade history for a portfolio with optional filters. Uses the existing `stp_GetTradeTrail2` stored procedure — same logic as the **Alt+T** Trade Trail form in the desktop application.

### POST /tradetrail

```
POST http://localhost:5000/tradetrail
Content-Type: application/json
```

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `portfolio` | string | Yes | Portfolio name (e.g., "NIFTY 25-AUG-26") |
| `cashType` | string | No | "O"/"OPTIDX"/"OPTSTK" (Options), "F"/"FUTIDX"/"FUTSTK" (Futures), "C"/"EQ" (Cash/Equity), "SLB" |
| `strike` | string | No | Strike price (e.g., "24600") |
| `userCode` | string | No | User code (e.g., "Minal") |
| `buySell` | string | No | "Buy" or "Sell" |
| `callPut` | string | No | "C" (Call) or "P" (Put) |
| `tradeDate` | string | No | Date in dd/MM/yyyy format |

**All filters (except portfolio) are optional.** Empty values return unfiltered results. Multiple filters can be combined.

**Sample Request:**
```json
{
  "portfolio": "NIFTY 25-AUG-26",
  "cashType": "O",
  "strike": "24600",
  "userCode": "",
  "buySell": "Buy",
  "callPut": "C",
  "tradeDate": ""
}
```

**Sample Response:**
```json
{
  "s": "success",
  "src": "ApiPublisher",
  "portfolio": "NIFTY 25-AUG-26",
  "scrip": "NIFTY",
  "count": 1,
  "trades": [
    {
      "Units": "65",
      "Traded": 136.0,
      "Strike": 24600.0,
      "CP": "C",
      "TradeDtDisp": "07/08/2026 12:37:09",
      "TradeiD": "0",
      "usercd": "Minal",
      "TradeDt": "2026-08-07T00:00:00",
      "BsType": "Buy",
      "CashType": "OPTIDX"
    }
  ]
}
```

**Trade Fields:**

| Field | Type | Description |
|---|---|---|
| `Units` | string | Quantity |
| `Traded` | double | Trade value/price |
| `Strike` | double | Strike price (0 for equity) |
| `CP` | string | "C" (Call), "P" (Put), "EQ" (Equity) |
| `TradeDtDisp` | string | Formatted trade timestamp |
| `TradeiD` | string | Trade ID |
| `usercd` | string | User code |
| `TradeDt` | string | Trade date (ISO format) |
| `BsType` | string | "Buy" or "Sell" |
| `CashType` | string | "OPTIDX", "OPTSTK", "FUTIDX", "FUTSTK", "EQ" |

**cashType Broad Categories:**

| Value | Matches | Description |
|---|---|---|
| `O` | OPTIDX, OPTSTK | All Options |
| `F` | FUTIDX, FUTSTK | All Futures |
| `C` | EQ, CASH | Cash / Equity |
| `SLB` | SLB | Stock Lending & Borrowing |
| `OPTIDX` | OPTIDX only | Index Options (exact) |
| `EQ` | EQ only | Equity (exact) |

**Portfolio Matching:** Supports both exact name ("NIFTY 25-AUG-26") and partial match ("NIFTY" → finds "NIFTY 25-AUG-26").

---

## 4. Postman Collection

```
# All portfolios
GET  http://localhost:5000/portfolio
POST http://localhost:5000/portfolio
Body: {}

# Single portfolio
POST http://localhost:5000/portfolio
Body: {"portfolioName":"NIFTY 25-AUG-26"}

# VAR - all
GET  http://localhost:5000/var

# VAR - single by query
GET  http://localhost:5000/var?name=NIFTY%2025-AUG-26&steps=3

# VAR - single by path
GET  http://localhost:5000/var/NIFTY%2025-AUG-26

# VAR - single by body
POST http://localhost:5000/var
Body: {"portfolioName":"NIFTY 25-AUG-26","steps":3,"inc":2}
# Trade Trail
POST http://localhost:5000/tradetrail
Body: {"portfolio":"NIFTY 25-AUG-26"}

# Trade Trail with filters
POST http://localhost:5000/tradetrail
Body: {"portfolio":"NIFTY 25-AUG-26","cashType":"O","buySell":"Buy","callPut":"C"}
```

---

## 5. Integration Notes

- **No authentication** required. Server runs on localhost:5000.
- **Source field** indicates data origin:
  - `ApiPublisher (LIVE)` = Real-time from TD.Prime calculator
  - `ApiPublisher` = Black-Scholes computed fallback
- **Portfolio data** auto-refreshes every 1 second when TD.Prime is running with Screen 3 open.
- **VAR data** auto-switches between live push and BS-computed fallback.
- **All monetary values** in Indian Rupees (INR).
- **Content-Type** for all POST requests: `application/json`.
- **Response format** for all endpoints: JSON object with `s` (status) and `src` (source) fields.
