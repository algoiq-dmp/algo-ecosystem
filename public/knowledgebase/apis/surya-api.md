# SURYA ENGINE — EXTERNAL ENGINE DATA FETCHING & ONE-TIME AUTHORIZED APPROVAL SPECIFICATION

> **Document Version:** 1.2.0 (Production Release) | **Last Updated:** 2026-08-11
> **Target:** Downstream Engines (Ganesh, Lakshmi, Vega, Kavach, Suchak, Garuda, Manthan, TalkDelta, DXCC, TalkOffice)
> **Source Engine:** Surya Engine (Central Operations & Reference Data Hub)
> **Base URL:** `http://192.168.190.120:9191` (Network) | `http://localhost:9191` (Local)

---

## EXECUTIVE OVERVIEW

Surya Engine acts as the **Single Source of Truth (SSOT)** for all exchange reference data, contracts, instrument masters, bhavcopies, SPAN margins, option chains, and market holiday calendars across the Algo IQ Ecosystem.

No external engine directly connects to stock exchange servers (NSE, BSE, MCX). All downstream products query Surya Engine using standardized REST APIs protected by **One-Time Authorized Approval** with dual authentication.

---

## 1. ONE-TIME AUTHORIZED APPROVAL WORKFLOW

To fetch data from Surya Engine, every external engine must undergo a **One-Time Authorized Approval** to receive a cryptographically signed API Key.

```
┌──────────────────────────┐             ┌──────────────────────────┐
│ External Engine Developer│             │   Surya Engine Admin     │
│ (Ganesh, Lakshmi, etc.)  │             │   (Surya Engine Portal)  │
└────────────┬─────────────┘             └────────────┬─────────────┘
             │                                        │
             │ 1. Request One-Time Approval           │
             ├───────────────────────────────────────>│
             │    Provide: ClientCode & ClientName    │
             │                                        │
             │                                        │ 2. Admin Executes Approval
             │                                        │    POST /api/v1/auth/clients/approve
             │                                        │
             │ 3. Receive One-Time API Key            │
             │<───────────────────────────────────────┤
             │    X-API-KEY: Surya_Key_...            │
             │    X-CLIENT-CODE: YOUR_ENGINE_CODE     │
             │                                        │
             │ 4. Configure Key in External Engine    │
             │    and Fetch Market Data               │
             ▼                                        ▼
```

### 1.1 How to Execute One-Time Approval in Surya Engine

An Administrator executes the One-Time Approval API endpoint:

```http
POST /api/v1/auth/clients/approve
Host: 192.168.190.120:9191
Authorization: Bearer {ADMIN_JWT_TOKEN}
Content-Type: application/json

{
  "clientCode": "GANESH_ENGINE",
  "clientName": "Ganesh OHLC & Instrument Identification Engine"
}
```

### 1.2 One-Time Approval Response Payload

```json
{
  "success": true,
  "data": {
    "clientId": 2,
    "clientCode": "GANESH_ENGINE",
    "clientName": "Ganesh OHLC & Instrument Identification Engine",
    "rawApiKey": "Surya_Key_GANESH_ENGINE_DojXNnWM8aMGhU5hfeC5DefVuhH4647S",
    "apiKeyHeaderName": "X-API-KEY",
    "approvalStatus": "AUTHORIZED_APPROVED",
    "note": "CRITICAL: Store this API key securely in your engine configuration. It is displayed ONCE during approval and cannot be retrieved again.",
    "approvedUtc": "2026-07-29T19:05:00.000Z"
  },
  "error": null,
  "message": "Client 'GANESH_ENGINE' authorized and approved successfully. API Key generated."
}
```

---

## 2. AUTHENTICATION & REQUEST HEADERS (DUAL AUTH)

**ALL API endpoints require authentication.** Every request is logged to the `ApiAccessLog` and `AuditLog` tables for full compliance and traceability.

### Required Headers

| Header Name | Required | Example Value | Description |
|-------------|----------|---------------|-------------|
| `X-API-KEY` | **YES** | `Surya_Key_GANESH_ENGINE_DojXNn...` | Secret API Key (SHA-256 validated against `ApiClientMaster`) |
| `X-CLIENT-CODE` | **Recommended** | `GANESH_ENGINE` | Your engine identifier (validated against API key owner) |
| `Content-Type` | YES (for POST/PUT) | `application/json` | Request payload format |
| `Accept` | YES | `application/json` | Expected response format |

### Authentication Flow
1. External engine sends `X-API-KEY` header with every request
2. (Optional) `X-CLIENT-CODE` header identifies which engine is connecting
3. If `X-CLIENT-CODE` is provided, the middleware verifies it matches the API key's registered owner
4. Surya Engine middleware computes SHA-256 hash of the API key
5. Hash is looked up in `ApiClientMaster` table
6. If valid: request proceeds, logged to `ApiAccessLog` with client identification
7. If invalid or client code mismatch: 401 Unauthorized returned

### Audit Trail
- **Every API call** is logged to `ApiAccessLog` (timestamp, endpoint, method, status, duration, IP, client ID, client code)
- **First connection of each day** per client is recorded in `AuditLog` for compliance
- **Data modification operations** (approve, revoke, create, update, delete) are fully audited with old/new values
- Errors and exceptions are captured in `ErrorLog` with full stack traces

### Bypassed Paths (No API Key Required)
- `/swagger` — OpenAPI documentation
- `/health` — Health check
- `/api/v1/auth/login` — User login endpoint
- `/hangfire` — Job scheduler dashboard

---

## 3. EXTERNAL DATA FETCHING API ENDPOINT CATALOG

### 3.1 Instrument & Contract Search API
Fetch tradable instrument contracts, symbol details, strike prices, and option types.

* **Endpoint:** `GET /api/v1/instruments/search`
* **Headers:** `X-API-KEY: {APPROVED_API_KEY}`, `X-CLIENT-CODE: {YOUR_CODE}`
* **Query Parameters:**
  * `query` (string): Symbol or scrip code (e.g. `NIFTY`, `BANKNIFTY`, `RELIANCE`)
  * `exchange` (string, optional): `NSE`, `BSE`, `MCX`
  * `segment` (string, optional): `CM`, `FO`
* **Sample Request:**
  ```http
  GET /api/v1/instruments/search?query=NIFTY&exchange=NSE HTTP/1.1
  Host: 192.168.190.120:9191
  X-API-KEY: Surya_Key_GANESH_ENGINE_DojXNnWM8aMGhU5hfeC5DefVuhH4647S
  X-CLIENT-CODE: GANESH_ENGINE
  ```
* **Sample Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "symbol": "NIFTY",
        "exchange": "NSE",
        "segment": "FO",
        "expiryDate": "2026-07-30",
        "strikePrice": 24500.00,
        "optionType": "CE",
        "algoIqToken": "NSE|NIFTY|2026-07-30|24500|CE"
      }
    ],
    "message": "Instruments retrieved successfully."
  }
  ```

---

### 3.2 Universal AlgoIQ Token Lookup API
Fetch contract parameters and system identifiers by universal AlgoIQ Token.

* **Endpoint:** `GET /api/v1/instruments/token/{token}`
* **Headers:** `X-API-KEY: {APPROVED_API_KEY}`, `X-CLIENT-CODE: {YOUR_CODE}`
* **Sample Request:**
  ```http
  GET /api/v1/instruments/token/NSE|BANKNIFTY|2026-07-30|52000|PE HTTP/1.1
  Host: 192.168.190.120:9191
  X-API-KEY: Surya_Key_GANESH_ENGINE_DojXNnWM8aMGhU5hfeC5DefVuhH4647S
  X-CLIENT-CODE: GANESH_ENGINE
  ```

---

### 3.3 Active Contract Master API
Download complete Active Contract Master records for pre-market instrument identification (Ganesh & TalkDelta).

* **Endpoint:** `GET /api/v1/instruments/contracts`
* **Headers:** `X-API-KEY: {APPROVED_API_KEY}`, `X-CLIENT-CODE: {YOUR_CODE}`
* **Query Parameters:**
  * `exchange` (string, optional): `NSE`, `BSE`
* **Sample Request:**
  ```http
  GET /api/v1/instruments/contracts?exchange=NSE HTTP/1.1
  Host: 192.168.190.120:9191
  X-API-KEY: Surya_Key_GANESH_ENGINE_DojXNnWM8aMGhU5hfeC5DefVuhH4647S
  X-CLIENT-CODE: GANESH_ENGINE
  ```

---

### 3.4 Daily Bhavcopy Data API
Fetch daily equity or futures & options Bhavcopy summary records.

* **Endpoint:** `GET /api/v1/instruments/bhavcopy`
* **Headers:** `X-API-KEY: {APPROVED_API_KEY}`, `X-CLIENT-CODE: {YOUR_CODE}`
* **Query Parameters:**
  * `symbol` (string): Scrip symbol (e.g. `SBIN`)
  * `date` (string, YYYY-MM-DD): Target trading date
* **Sample Request:**
  ```http
  GET /api/v1/instruments/bhavcopy?symbol=SBIN&date=2026-07-28 HTTP/1.1
  Host: 192.168.190.120:9191
  X-API-KEY: Surya_Key_GANESH_ENGINE_DojXNnWM8aMGhU5hfeC5DefVuhH4647S
  X-CLIENT-CODE: GANESH_ENGINE
  ```

---

### 3.5 Market Holiday Calendar API
Fetch the trading holiday calendar for business day and settlement calculations.

* **Endpoint:** `GET /api/v1/instruments/holidays`
* **Headers:** `X-API-KEY: {APPROVED_API_KEY}`, `X-CLIENT-CODE: {YOUR_CODE}`
* **Sample Response:**
  ```json
  {
    "success": true,
    "data": [
      { "holidayDate": "2026-08-15", "description": "Independence Day" },
      { "holidayDate": "2026-10-02", "description": "Gandhi Jayanti" },
      { "holidayDate": "2026-12-25", "description": "Christmas" }
    ]
  }
  ```

---

### 3.6 Real-Time Exchange File Monitoring API
Check current download, validation, and version status for all 24+ market data files.

* **Endpoint:** `GET /api/v1/exchangefilemanager/monitoring`
* **Headers:** `X-API-KEY: {APPROVED_API_KEY}`, `X-CLIENT-CODE: {YOUR_CODE}`

---

### 3.7 File Download API
Trigger download of a specific market data file from NSE/BSE.

* **Endpoint:** `GET /api/v1/ingestion/download?definitionId={id}&date={YYYY-MM-DD}`
* **Headers:** `X-API-KEY: {APPROVED_API_KEY}`, `X-CLIENT-CODE: {YOUR_CODE}`
* **Query Parameters:**
  * `definitionId` (int, required): Download definition ID (1-24)
  * `date` (string, YYYY-MM-DD, optional): Target date (defaults to today)
* **Sample Request:**
  ```http
  GET /api/v1/ingestion/download?definitionId=1&date=2026-07-28 HTTP/1.1
  Host: 192.168.190.120:9191
  X-API-KEY: Surya_Key_GANESH_ENGINE_DojXNnWM8aMGhU5hfeC5DefVuhH4647S
  X-CLIENT-CODE: GANESH_ENGINE
  ```

---

### 3.8 System Health & Readiness API
Verify Surya Engine operational readiness before executing morning trading workflows.

* **Endpoint:** `GET /health` or `GET /api/v1/testing/readiness`
* **Headers:** None (Public) or `X-API-KEY: {APPROVED_API_KEY}`, `X-CLIENT-CODE: {YOUR_CODE}`

---

### 3.9 Dashboard Stats API
Get real-time download/processing/error statistics.

* **Endpoint:** `GET /api/v1/dashboard/stats`
* **Headers:** `X-API-KEY: {APPROVED_API_KEY}`, `X-CLIENT-CODE: {YOUR_CODE}`
* **Sample Response:**
  ```json
  {
    "success": true,
    "data": {
      "successDownloads": 56,
      "failedDownloads": 464,
      "totalApiRequests": 1156,
      "activeClients": 8,
      "totalErrors": 0,
      "missingFilesCount": 24
    }
  }
  ```

---

### 3.10 Download Definitions API
Get all active download definitions with their schedules and URLs.

* **Endpoint:** `GET /api/v1/ingestion/definitions`
* **Headers:** `X-API-KEY: {APPROVED_API_KEY}`, `X-CLIENT-CODE: {YOUR_CODE}`

---

## 4. CODE SNIPPETS FOR DOWNSTREAM ENGINES

### 4.1 C# (.NET 8) Integration

```csharp
using System.Net.Http;

public class SuryaEngineClient
{
    private readonly HttpClient _httpClient;
    private const string SURYA_BASE_URL = "http://192.168.190.120:9191";
    private const string APPROVED_API_KEY = "Surya_Key_GANESH_ENGINE_DojXNnWM8aMGhU5hfeC5DefVuhH4647S";
    private const string CLIENT_CODE = "GANESH_ENGINE";

    public SuryaEngineClient()
    {
        _httpClient = new HttpClient { BaseAddress = new Uri(SURYA_BASE_URL) };
        _httpClient.DefaultRequestHeaders.Add("X-API-KEY", APPROVED_API_KEY);
        _httpClient.DefaultRequestHeaders.Add("X-CLIENT-CODE", CLIENT_CODE);
        _httpClient.DefaultRequestHeaders.Add("Accept", "application/json");
    }

    public async Task<string> FetchContractsAsync(string exchange = "NSE")
    {
        var response = await _httpClient.GetAsync($"/api/v1/instruments/contracts?exchange={exchange}");
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadAsStringAsync();
    }
}
```

### 4.2 Python Integration

```python
import requests

SURYA_BASE_URL = "http://192.168.190.120:9191"
APPROVED_API_KEY = "Surya_Key_GANESH_ENGINE_DojXNnWM8aMGhU5hfeC5DefVuhH4647S"
CLIENT_CODE = "GANESH_ENGINE"

headers = {
    "X-API-KEY": APPROVED_API_KEY,
    "X-CLIENT-CODE": CLIENT_CODE,
    "Accept": "application/json"
}

def fetch_active_contracts(exchange="NSE"):
    url = f"{SURYA_BASE_URL}/api/v1/instruments/contracts?exchange={exchange}"
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json().get("data", [])
    else:
        raise Exception(f"Failed to fetch contracts: {response.text}")

contracts = fetch_active_contracts("NSE")
print(f"Fetched {len(contracts)} contracts from Surya Engine.")
```

### 4.3 Node.js Integration

```javascript
const SURYA_URL = "http://192.168.190.120:9191";
const API_KEY = "Surya_Key_GANESH_ENGINE_DojXNnWM8aMGhU5hfeC5DefVuhH4647S";
const CLIENT_CODE = "GANESH_ENGINE";

const headers = {
  "X-API-KEY": API_KEY,
  "X-CLIENT-CODE": CLIENT_CODE,
  "Accept": "application/json"
};

async function fetchContracts(exchange = "NSE") {
  const res = await fetch(`${SURYA_URL}/api/v1/instruments/contracts?exchange=${exchange}`, { headers });
  const json = await res.json();
  return json.data;
}

fetchContracts("NSE").then(c => console.log(`Fetched ${c.length} contracts`));
```

---

## 5. SUMMARY OF ALL API ENDPOINTS (57 Total)

### Authentication & Approval
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/auth/login` | None | User login → JWT token |
| POST | `/api/v1/auth/clients/approve` | JWT Admin | One-Time Approval for external engine |
| GET | `/api/v1/auth/clients` | JWT Admin/Auditor | List all approved API clients |
| POST | `/api/v1/auth/clients/revoke` | JWT Admin | Revoke API client access |

### Instruments & Contracts
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/instruments/search` | API Key | Search instruments by symbol |
| GET | `/api/v1/instruments/token/{token}` | API Key | AlgoIQ Token lookup |
| GET | `/api/v1/instruments/contracts` | API Key | Active Contract Master |
| GET | `/api/v1/instruments/bhavcopy` | API Key | Daily Bhavcopy data |
| GET | `/api/v1/instruments/holidays` | API Key | Market holiday calendar |
| GET | `/api/v1/instruments/stats/summary` | API Key | Data summary stats |

### Ingestion & Downloads
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/ingestion/exchanges` | API Key | Active exchanges |
| GET | `/api/v1/ingestion/definitions` | API Key | Active download definitions |
| GET | `/api/v1/ingestion/definitions/all` | API Key | All definitions |
| GET | `/api/v1/ingestion/definitions/{id}` | API Key | Single definition |
| PUT | `/api/v1/ingestion/definitions/{id}/schedule` | JWT Admin/Op | Edit schedule cron |
| GET | `/api/v1/ingestion/download` | API Key | Trigger file download |
| POST | `/api/v1/ingestion/parse` | JWT Admin/Op | Parse CSV file |

### Data Source Management
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET/POST/PUT/DELETE | `/api/v1/datasource` | Mixed | CRUD data sources |
| GET/POST/PUT/DELETE | `/api/v1/datasource/priorities` | Mixed | Priority management |
| GET | `/api/v1/datasource/health` | API Key | Source health dashboard |
| GET | `/api/v1/datasource/failovers` | API Key | Failover audit logs |

### Exchange File Manager
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/exchangefilemanager/run-daily` | JWT Admin/Op | Run BOD automation |
| GET | `/api/v1/exchangefilemanager/monitoring` | API Key | File monitor snapshot |
| GET | `/api/v1/exchangefilemanager/versions/{id}` | API Key | Version history |

### Dashboard & AI
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/dashboard/stats` | API Key | Real-time stats |
| GET | `/api/v1/dashboard/history` | API Key | Recent activity |
| GET | `/api/v1/dashboard/logs` | API Key | Error/audit logs |
| POST | `/api/v1/ai/ask` | API Key | DeepSeek AI Q&A |

### Testing & Health
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | None | System health |
| GET | `/api/v1/testing/all` | API Key | Parikshak full test |
| GET | `/api/v1/testing/readiness` | API Key | Readiness report |

---

## 6. APPROVED CLIENT MANAGEMENT ENDPOINTS

For Surya Engine Administrators:

| Method | Endpoint | Authorization | Description |
|--------|----------|---------------|-------------|
| `POST` | `/api/v1/auth/clients/approve` | JWT Admin | One-Time Approval: Creates API Key for Client |
| `GET` | `/api/v1/auth/clients` | JWT Admin/Auditor | List all approved API clients with status |
| `POST` | `/api/v1/auth/clients/revoke` | JWT Admin | Revoke/Deactivate an approved API client |

---

## 7. QUICK START GUIDE

### Step 1: Get API Key
Ask your Surya Engine Administrator to approve your engine and provide:
- `X-API-KEY` (secret key — copy immediately, never shown again)
- `X-CLIENT-CODE` (your engine identifier)

### Step 2: Configure Your Engine
Add these headers to every HTTP request:
```
X-API-KEY: Surya_Key_YOUR_ENGINE_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
X-CLIENT-CODE: YOUR_ENGINE_CODE
```

### Step 3: Verify Connection
```bash
curl "http://192.168.190.120:9191/health"
curl "http://192.168.190.120:9191/api/v1/instruments/contracts?exchange=NSE" \
  -H "X-API-KEY: Surya_Key_YOUR_ENGINE_..." \
  -H "X-CLIENT-CODE: YOUR_ENGINE_CODE"
```

### Port Reference
| Service | Port | URL |
|---------|------|-----|
| **API (IIS)** | `9191` | `http://192.168.190.120:9191` |
| **Website** | `9192` | `http://192.168.190.120:9192` |
| **Local API** | `9191` | `http://localhost:9191` |
| **Local Website** | `9192` | `http://localhost:9192` |

---

**DOCUMENT END**
