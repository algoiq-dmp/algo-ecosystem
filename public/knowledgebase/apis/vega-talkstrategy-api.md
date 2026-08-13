# TalkStrategy API Reference

## Table of Contents

1. [Overview](#1-overview)
2. [Authentication](#2-authentication)
3. [Architecture](#3-architecture)
4. [Response Formats](#4-response-formats)
5. [Endpoint Reference](#5-endpoint-reference)
   - [Auth](#51-auth)
   - [Admin - Users](#52-admin---users)
   - [Admin - Accounts](#53-admin---accounts)
   - [Admin - MQ Configs](#54-admin---mq-configs)
   - [Admin - Strategy Configs](#55-admin---strategy-configs)
   - [Admin - Translation Configs](#56-admin---translation-configs)
   - [Book & Positions](#57-book--positions)
   - [Orders](#58-orders)
   - [Strategy Actions](#59-strategy-actions)
   - [Subscriptions](#510-subscriptions)
   - [XTS Orders](#511-xts-orders)
   - [Contracts](#512-contracts)
   - [Messaging](#513-messaging)
   - [Enums](#514-enums)
   - [Docs & Swagger](#515-docs--swagger)
6. [Data Models](#6-data-models)
7. [Error Codes](#7-error-codes)
8. [Configuration Reference](#8-configuration-reference)
9. [AI Agent Integration Guide](#9-ai-agent-integration-guide)
   - [General Integration Patterns](#91-general-integration-patterns)
   - [Using With vs Without Postman Collection](#92-using-with-vs-without-postman-collection)
   - [Target-Specific Guidance](#93-target-specific-guidance)

---

## 1. Overview

**Base URL:** `http://localhost:50000` (configurable via `Web.config`)

**Framework:** ASP.NET Web API 5.2.9 on .NET Framework 4.7.2

**Authentication:** JWT Bearer tokens (HS256, 12-hour expiry)

**Messaging Backend:** ZeroMQ (NetMQ) -- pub/sub + req/rep patterns to a TradeEngine

**Database:** LiteDB (embedded file-based NoSQL at `App_Data/talkstrategy.db`)

**Content Type:** All request/response bodies are `application/json`

**API Version:** No versioning prefix (all routes under `/api/`)

---

## 2. Authentication

### 2.1 JWT Token Structure

| Claim Type | Claim Key | Description |
|---|---|---|
| Subject | `sub` / `nameidentifier` | User ID (int) |
| Username | `unique_name` | Login username |
| Role | `role` | `"admin"`, `"user"`, or `"dev"` |
| Account ID | `accountId` | Linked trading account ID (int) |
| Token ID | `jti` | Unique token identifier (GUID) |
| Issued At | `iat` | Unix timestamp |

**Token Parameters:**
- Algorithm: HS256
- Issuer: `TalkStrategyAPI`
- Audience: `TalkStrategyClients`
- Expiry: 720 minutes (12 hours) from issuance

### 2.2 Auth Flow

```
┌─────────────┐     POST /api/auth/login      ┌───────────────┐
│   Client     │ ───────────────────────────────> │  AuthController │
│              │ <─────────────────────────────── │                 │
│              │     { token, role, accountId }  └───────────────┘
│              │
│              │     All subsequent requests
│              │     Authorization: Bearer <token>
│              │ ───────────────────────────────> Any Controller
│              │
│              │     POST /api/auth/refresh       (extends session)
│              │     POST /api/auth/logout         (blacklists token)
└─────────────┘
```

### 2.3 Authentication Levels

| Level | How Applied | Who |
|---|---|---|
| **None** | `[AllowAnonymous]` on class/method | Login, Register, Health, Enums, Docs, Swagger |
| **Bearer** | Global `JwtAuthorizeAttribute` filter (applied to all routes by default) | All trading, book, position, subscription, contract endpoints |
| **Admin** | In-code `IsAdmin()` check (returns 403) | All `/api/admin/*` endpoints |
| **Dev/Admin** | In-code role check | `POST /api/messaging/raw` |

**Important:** The global JWT filter applies to ALL routes automatically unless explicitly decorated with `[AllowAnonymous]`. Include `Authorization: Bearer <token>` on every request except auth, health, enums, and docs.

### 2.4 Token Lifecycle

- **Create:** `POST /api/auth/login` or `POST /api/auth/register` (pending approval)
- **Validate:** Every request via `JwtAuthorizeAttribute` filter
- **Refresh:** `POST /api/auth/refresh` -- blacklists old token, issues new one (12-hour expiry reset)
- **Blacklist:** `POST /api/auth/logout` -- immediate revocation; token stored in LiteDB `token_blacklist` collection with SHA-256 hash

---

## 3. Architecture

### 3.1 Service Layer

```
Controllers
  ├── IMultiMqService (order/routing operations)
  │     ├── IMqConnectionManager ── per-account NetMqService pool
  │     ├── IRatioOrderProcessor ── lot multiplier, split, price rounding
  │     └── IResponseCache ── 100ms dedup cache
  ├── IContractCache (contract metadata)
  │     └── MessagingClientWrapper ── direct ZeroMQ REQ socket (port 5586)
  ├── ITranslationPipeline (vendor order translation)
  │     └── XtsOrderTranslator
  └── Repositories (LiteDB)
        ├── IUserRepository
        ├── IAccountRepository
        ├── IMqConfigRepository
        ├── IStrategyConfigRepository
        ├── ITranslationConfigRepository
        └── ITokenBlacklistRepository
```

### 3.2 ZeroMQ Messaging Topology

| Component | Pattern | Default Port | Purpose |
|---|---|---|---|
| Order Request | REQ/REP | 5580 | Place/cancel/modify orders, query books/positions |
| Market Feed | PUB/SUB | 5570 | Real-time order status, price updates |
| Contract Info | REQ/REP | 5586 | Instrument metadata (lot size, tick price, etc.) |

**Account routing:** Each `AccountDocument` has an `MqConfigId` referencing an `MqServerConfigDocument` (IP + ports). The `IMqConnectionManager` maintains a per-config `NetMqService` pool, routing requests by `accountId`.

**Contract cache:** Fetched via dedicated ZeroMQ REQ socket. Cached in `MemoryCache` with midnight expiration. Configurable stub mode for development (`ContractCache:UseStub = true`).

### 3.3 Request/Response Flow (Typical Order)

```
Client POST /api/orders/place
  └── OrderController
        └── IMultiMqService.ProcessRatio(accountId, token, segment, exchange, qty, price)
              ├── IContractCache.Get(token, segment, exchange)  ── get lot size
              ├── IRatioOrderProcessor.Process(...)              ── apply ratio, split
              └── For each split:
                    └── IMultiMqService.SendRequest(accountId, endpoint, message)
                          └── IMqConnectionManager.GetService(accountId)
                                └── NetMqService.SendRequest()
                                      └── MessagingClientWrapper (ZeroMQ REQ socket)
                                            └── TradeEngine (port 5580)
```

### 3.4 Database

**Engine:** LiteDB (embedded, file-based, no external server)

**File:** `App_Data/talkstrategy.db` (auto-created on first startup)

**Collections:**
| Collection | Document Type | Indexes |
|---|---|---|
| `users` | `UserDocument` | Username (unique) |
| `accounts` | `AccountDocument` | UserId |
| `mq_configs` | `MqServerConfigDocument` | -- |
| `strategy_configs` | `StrategyConfigDocument` | -- |
| `translation_configs` | `TranslationConfigDocument` | -- |
| `token_blacklist` | `BlacklistedTokenDocument` | TokenHash |

**Startup seeding:** On first run (empty `users` collection), an `admin` user is auto-created with a random 16-character password written to `App_Data/admin_password.txt`. Default configs (MQ, strategy, translation) with `Id=1` are also seeded.

---

## 4. Response Formats

### 4.1 Standard Success Response (`ResponseDto`)

Sent by most trading/book/position/strategy endpoints:

```json
{
  "success": true,
  "data": "<JSON string from MQ/TradeEngine>",
  "type": 100,
  "error": null,
  "timestamp": 1723456789000
}
```

### 4.2 Standard Error Response (`ResponseDto`)

```json
{
  "success": false,
  "data": null,
  "type": 0,
  "error": "Description of what went wrong",
  "timestamp": 1723456789000
}
```

### 4.3 Admin/Contract/Enums Response Format

These controllers return anonymous objects directly (not wrapped in `ResponseDto`):

**Success:**
```json
{ "success": true, "data": { ... }, "users": [ ... ] }
```

**Error:**
```json
{ "success": false, "error": "Description of what went wrong" }
```

### 4.4 HTTP Status Codes Used

| Code | Meaning |
|---|---|
| 200 | Success |
| 400 | Bad request (missing/invalid parameters) |
| 401 | Unauthorized (missing/invalid/expired/blacklisted token) |
| 403 | Forbidden (insufficient role -- e.g. non-admin accessing admin routes) |
| 404 | Resource not found |
| 409 | Conflict (e.g. duplicate username) |
| 500 | Internal server error |
| 504 | Gateway timeout (MQ request timed out) |

### 4.5 Client-Side Parsing

When receiving responses, check both:
1. HTTP status code (`r.ok` / `r.status`)
2. `response.success` field (a 200 with `success: false` is an error)

```
if (httpStatus !== 200 || response.success === false) {
    // handle error: response.error || response.Error || response.message
}
```

The `error` property may be PascalCase (`Error`) or camelCase (`error`) depending on the endpoint. The admin dashboard extracts both variants (see `extractErrorMessage` in dashboard `app.js`).

---

## 5. Endpoint Reference

### 5.1 Auth

#### POST `/api/auth/login`

**Auth:** None

Authenticates a user and returns a JWT token.

**Request:**
```json
{
  "username": "admin",
  "password": "your_password"
}
```

**Success (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresAt": "2024-01-01T12:00:00Z",
  "role": "admin",
  "accountId": 1,
  "username": "admin"
}
```

**Errors:**
- `400` -- `{ "success": false, "error": "Username and password are required" }`
- `401` -- `{ "success": false, "error": "Invalid username or password" }`
- `403` -- `{ "success": false, "error": "Account not yet approved. Please contact administrator." }`
- `500` -- `{ "success": false, "error": "Internal server error" }` or `"...No account configured. Please contact administrator."`

**Curl:**
```bash
curl -X POST http://localhost:50000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your_password"}'
```

---

#### POST `/api/auth/register`

**Auth:** None

Registers a new user (pending admin approval).

**Request:**
```json
{
  "username": "newuser",
  "password": "password123",
  "email": "user@example.com"
}
```

*Password must be 6+ characters.*

**Success (200):**
```json
{
  "success": true,
  "message": "Registration submitted. Awaiting admin approval."
}
```

**Errors:**
- `400` -- Missing fields or password < 6 chars
- `409` -- `{ "success": false, "error": "Username already exists" }`

**Curl:**
```bash
curl -X POST http://localhost:50000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"newuser","password":"password123","email":"user@example.com"}'
```

---

#### POST `/api/auth/refresh`

**Auth:** Bearer (token in header)

Refreshes a JWT token. The old token is immediately blacklisted. The old token can be expired or still valid; lifetime validation is relaxed for this endpoint.

**Headers:**
```
Authorization: Bearer <current_token>
```

**Request body:** None

**Success (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresAt": "2024-01-01T12:00:00Z",
  "role": "admin",
  "accountId": 1,
  "username": "admin"
}
```

**Errors:**
- `400` -- Missing/empty token
- `401` -- Token blacklisted or invalid

**Curl:**
```bash
curl -X POST http://localhost:50000/api/auth/refresh \
  -H "Authorization: Bearer <your_token>"
```

---

#### POST `/api/auth/logout`

**Auth:** Bearer (token in header)

Blacklists the current token. All subsequent uses of this token will be rejected.

**Headers:**
```
Authorization: Bearer <current_token>
```

**Request body:** None

**Success (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Errors:**
- `400` -- Missing/empty token
- `500` -- Logout processing failure

**Curl:**
```bash
curl -X POST http://localhost:50000/api/auth/logout \
  -H "Authorization: Bearer <your_token>"
```

---

### 5.2 Admin - Users

**All endpoints in this section require admin role** (JWT `role` claim = `"admin"`). Non-admin requests receive `403`.

#### GET `/api/admin/users`

Returns all registered users.

**Headers:** `Authorization: Bearer <admin_token>`

**Response (200):**
```json
{
  "success": true,
  "users": [
    {
      "id": 1,
      "username": "admin",
      "role": "admin",
      "isApproved": true,
      "email": "admin@local",
      "accountId": 1,
      "createdAt": "2024-01-01T00:00:00Z",
      "approvedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Curl:**
```bash
curl http://localhost:50000/api/admin/users \
  -H "Authorization: Bearer <admin_token>"
```

---

#### POST `/api/admin/users/create-with-account`

Creates a user + account in one call. User is auto-approved. The plaintext password is returned in the response (store/capture it).

**Headers:** `Authorization: Bearer <admin_token>`

**Request:**
```json
{
  "username": "trader1",
  "password": "securepass123",
  "email": "trader@example.com",
  "accountName": "Trader One Account",
  "mqConfigId": 1,
  "strategyConfigId": 1,
  "translationConfigId": 1
}
```

*Password must be 6+ chars. `mqConfigId` and `strategyConfigId` default to 1 if <= 0. `accountName` defaults to `{username}_account` if empty.*

**Success (200):**
```json
{
  "success": true,
  "userId": 2,
  "accountId": 2,
  "username": "trader1",
  "password": "securepass123"
}
```

**Errors:**
- `400` -- Missing fields, short password, or nonexistent MQ config
- `409` -- Duplicate username

**Curl:**
```bash
curl -X POST http://localhost:50000/api/admin/users/create-with-account \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{"username":"trader1","password":"securepass123","email":"trader@example.com","mqConfigId":1,"strategyConfigId":1}'
```

---

#### POST `/api/admin/users/{id}/approve`

Approves a pending user and auto-creates a default account (MqConfigId=1, StrategyConfigId=1, TranslationConfigId=1).

**Headers:** `Authorization: Bearer <admin_token>`

**Route param:** `id` (int) -- user ID

**Request body:** None

**Success (200):**
```json
{
  "success": true,
  "message": "User approved and account created",
  "accountId": 2
}
```

If already approved: `{ "success": true, "message": "User already approved" }`

**Errors:**
- `403` -- Not admin
- `404` -- User not found

**Curl:**
```bash
curl -X POST http://localhost:50000/api/admin/users/2/approve \
  -H "Authorization: Bearer <admin_token>"
```

---

#### POST `/api/admin/users/{id}/reject`

Rejects (deletes) a pending user. Cannot reject an already-approved user.

**Headers:** `Authorization: Bearer <admin_token>`

**Route param:** `id` (int)

**Request body:** None

**Success (200):**
```json
{
  "success": true,
  "message": "User rejected"
}
```

**Errors:**
- `400` -- User already approved (cannot reject)
- `403` -- Not admin
- `404` -- User not found

**Curl:**
```bash
curl -X POST http://localhost:50000/api/admin/users/2/reject \
  -H "Authorization: Bearer <admin_token>"
```

---

#### DELETE `/api/admin/users/{id}`

Deletes a user and their associated account. Cannot delete admin users.

**Headers:** `Authorization: Bearer <admin_token>`

**Route param:** `id` (int)

**Success (200):**
```json
{
  "success": true,
  "message": "User deleted"
}
```

**Errors:**
- `400` -- Cannot delete admin user
- `403` -- Not admin
- `404` -- User not found

**Curl:**
```bash
curl -X DELETE http://localhost:50000/api/admin/users/2 \
  -H "Authorization: Bearer <admin_token>"
```

---

### 5.3 Admin - Accounts

**All require admin role.**

#### GET `/api/admin/accounts`

Lists all trading accounts.

**Headers:** `Authorization: Bearer <admin_token>`

**Response (200):**
```json
{
  "success": true,
  "accounts": [
    {
      "id": 1,
      "name": "Default Account",
      "userId": 1,
      "mqConfigId": 1,
      "strategyConfigId": 1,
      "translationConfigId": 1,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Curl:**
```bash
curl http://localhost:50000/api/admin/accounts \
  -H "Authorization: Bearer <admin_token>"
```

---

#### POST `/api/admin/accounts`

Creates a new trading account.

**Headers:** `Authorization: Bearer <admin_token>`

**Request:**
```json
{
  "name": "New Account",
  "userId": 2,
  "mqConfigId": 1,
  "strategyConfigId": 1,
  "translationConfigId": 1,
  "isActive": true
}
```

*`mqConfigId` defaults to 1 if <= 0. `isActive` defaults to true.*

**Success (200):**
```json
{ "success": true, "id": 2 }
```

**Errors:**
- `400` -- Missing name or nonexistent MQ config

**Curl:**
```bash
curl -X POST http://localhost:50000/api/admin/accounts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{"name":"New Account","userId":2,"mqConfigId":1,"strategyConfigId":1}'
```

---

#### PUT `/api/admin/accounts/{id}`

Partially updates an account. Only provided fields are changed; null/zero/negative values are ignored.

**Headers:** `Authorization: Bearer <admin_token>`

**Route param:** `id` (int)

**Request (partial update):**
```json
{
  "name": "Updated Account Name",
  "isActive": false
}
```

**Success (200):**
```json
{ "success": true, "message": "Account updated" }
```

**Errors:**
- `403` -- Not admin
- `404` -- Account not found

**Curl:**
```bash
curl -X PUT http://localhost:50000/api/admin/accounts/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{"name":"Updated Account Name","isActive":false}'
```

---

#### DELETE `/api/admin/accounts/{id}`

Deletes an account.

**Headers:** `Authorization: Bearer <admin_token>`

**Route param:** `id` (int)

**Success (200):**
```json
{ "success": true, "message": "Account deleted" }
```

**Curl:**
```bash
curl -X DELETE http://localhost:50000/api/admin/accounts/2 \
  -H "Authorization: Bearer <admin_token>"
```

---

### 5.4 Admin - MQ Configs

**All require admin role.** MQ (Message Queue) configs define ZeroMQ server connection parameters.

#### GET `/api/admin/mq-configs`

**Headers:** `Authorization: Bearer <admin_token>`

**Response (200):**
```json
{
  "success": true,
  "configs": [
    {
      "Id": 1,
      "Name": "Default MQ",
      "Ip": "localhost",
      "SubPort": 5570,
      "ReqPort": 5580,
      "QueueSize": 1000
    }
  ]
}
```

**Curl:**
```bash
curl http://localhost:50000/api/admin/mq-configs \
  -H "Authorization: Bearer <admin_token>"
```

---

#### POST `/api/admin/mq-configs`

**Request:**
```json
{
  "Name": "New MQ",
  "Ip": "192.168.1.100",
  "SubPort": 5570,
  "ReqPort": 5580,
  "QueueSize": 1000
}
```

*`SubPort` defaults to 5570, `ReqPort` to 5580, `QueueSize` to 1000.*

**Success (200):**
```json
{ "success": true, "id": 2 }
```

**Errors:**
- `400` -- Name required

**Curl:**
```bash
curl -X POST http://localhost:50000/api/admin/mq-configs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{"Name":"New MQ","Ip":"192.168.1.100","ReqPort":5580,"SubPort":5570,"QueueSize":1000}'
```

---

#### PUT `/api/admin/mq-configs/{id}`

Partial update of an MQ config.

**Headers:** `Authorization: Bearer <admin_token>`

**Route param:** `id` (int)

**Request:**
```json
{
  "Name": "Updated MQ",
  "Ip": "10.0.0.1"
}
```

**Success (200):**
```json
{ "success": true, "message": "Updated" }
```

**Errors:**
- `404` -- Not found

**Curl:**
```bash
curl -X PUT http://localhost:50000/api/admin/mq-configs/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{"Name":"Updated MQ","Ip":"10.0.0.1"}'
```

---

#### DELETE `/api/admin/mq-configs/{id}`

**Headers:** `Authorization: Bearer <admin_token>`

**Route param:** `id` (int)

**Success (200):**
```json
{ "success": true, "message": "Deleted" }
```

**Curl:**
```bash
curl -X DELETE http://localhost:50000/api/admin/mq-configs/2 \
  -H "Authorization: Bearer <admin_token>"
```

---

### 5.5 Admin - Strategy Configs

**All require admin role.** Strategy configs control ratio/lot processing per account.

#### GET `/api/admin/strategy-configs`

**Headers:** `Authorization: Bearer <admin_token>`

**Response (200):**
```json
{
  "success": true,
  "configs": [
    {
      "Id": 1,
      "Name": "Default Strategy",
      "IsRatioEnabled": false,
      "LotMultiplier": 1.0,
      "MaxOrderQty": 5000,
      "SplitOrdersEnabled": false,
      "RejectIfExceedsCap": false,
      "LotRoundingMode": "RoundUp",
      "PriceMultiplier": null,
      "PriceOffset": null
    }
  ]
}
```

**Curl:**
```bash
curl http://localhost:50000/api/admin/strategy-configs \
  -H "Authorization: Bearer <admin_token>"
```

---

#### POST `/api/admin/strategy-configs`

**Request:**
```json
{
  "Name": "Ratio Strategy",
  "IsRatioEnabled": true,
  "LotMultiplier": 2.0,
  "MaxOrderQty": 5000,
  "SplitOrdersEnabled": false,
  "RejectIfExceedsCap": true,
  "LotRoundingMode": "RoundUp",
  "PriceMultiplier": 1.0,
  "PriceOffset": 0.0
}
```

*`LotMultiplier` defaults to 1.0, `LotRoundingMode` defaults to "RoundUp".*

**Success (200):**
```json
{ "success": true, "id": 2 }
```

**Curl:**
```bash
curl -X POST http://localhost:50000/api/admin/strategy-configs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{"Name":"Ratio Strategy","IsRatioEnabled":true,"LotMultiplier":2.0,"MaxOrderQty":5000}'
```

---

#### PUT `/api/admin/strategy-configs/{id}`

Partial update.

**Headers:** `Authorization: Bearer <admin_token>`

**Route param:** `id` (int)

**Request:**
```json
{
  "Name": "Updated Strategy",
  "LotMultiplier": 3.0
}
```

**Success (200):**
```json
{ "success": true, "message": "Updated" }
```

**Curl:**
```bash
curl -X PUT http://localhost:50000/api/admin/strategy-configs/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{"LotMultiplier":3.0}'
```

---

#### DELETE `/api/admin/strategy-configs/{id}`

**Headers:** `Authorization: Bearer <admin_token>`

**Route param:** `id` (int)

**Success (200):**
```json
{ "success": true, "message": "Deleted" }
```

**Curl:**
```bash
curl -X DELETE http://localhost:50000/api/admin/strategy-configs/2 \
  -H "Authorization: Bearer <admin_token>"
```

---

### 5.6 Admin - Translation Configs

**All require admin role.** Translation configs map vendor-specific order formats to the internal message format.

#### GET `/api/admin/translation-configs`

**Headers:** `Authorization: Bearer <admin_token>`

**Response (200):**
```json
{
  "success": true,
  "configs": [
    {
      "Id": 1,
      "Name": "XTS Translation",
      "VendorType": "XTS",
      "DefaultExchange": "NSE",
      "DefaultProductType": "NRML",
      "DefaultOrderType": "Limit",
      "DefaultValidity": "DAY",
      "FieldMappings": { "symbol": "Scrip", "quantity": "OrderQty" },
      "StaticDefaults": { "OrderValidity": 0 }
    }
  ]
}
```

**Curl:**
```bash
curl http://localhost:50000/api/admin/translation-configs \
  -H "Authorization: Bearer <admin_token>"
```

---

#### POST `/api/admin/translation-configs`

**Request:**
```json
{
  "Name": "Custom Translation",
  "VendorType": "XTS",
  "DefaultExchange": "NSE",
  "DefaultProductType": "NRML",
  "DefaultOrderType": "Limit",
  "DefaultValidity": "DAY",
  "FieldMappings": { "symbol": "Scrip", "quantity": "OrderQty" },
  "StaticDefaults": { "OrderValidity": 0 }
}
```

*`VendorType` defaults to "XTS". `FieldMappings` and `StaticDefaults` are optional dictionaries.*

**Success (200):**
```json
{ "success": true, "id": 2 }
```

**Curl:**
```bash
curl -X POST http://localhost:50000/api/admin/translation-configs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{"Name":"Custom Translation","VendorType":"XTS","DefaultExchange":"NSE"}'
```

---

#### PUT `/api/admin/translation-configs/{id}`

Partial update.

**Headers:** `Authorization: Bearer <admin_token>`

**Route param:** `id` (int)

**Request:**
```json
{
  "Name": "Updated Translation",
  "DefaultExchange": "BSE"
}
```

**Success (200):**
```json
{ "success": true, "message": "Updated" }
```

**Curl:**
```bash
curl -X PUT http://localhost:50000/api/admin/translation-configs/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{"DefaultExchange":"BSE"}'
```

---

#### DELETE `/api/admin/translation-configs/{id}`

**Headers:** `Authorization: Bearer <admin_token>`

**Route param:** `id` (int)

**Success (200):**
```json
{ "success": true, "message": "Deleted" }
```

**Curl:**
```bash
curl -X DELETE http://localhost:50000/api/admin/translation-configs/2 \
  -H "Authorization: Bearer <admin_token>"
```

---

### 5.7 Book & Positions

**All require Bearer token.** These endpoints query the trade engine via MQ for order/trade books and net positions.

#### GET `/api/book/orders`

Returns the order book for the authenticated user's account.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": "<JSON order book from TradeEngine>",
  "type": 100,
  "error": null,
  "timestamp": 1723456789000
}
```

*The `data` field contains a serialized JSON string of the order book. Parse it as JSON to access individual orders.*

**Curl:**
```bash
curl http://localhost:50000/api/book/orders \
  -H "Authorization: Bearer <token>"
```

---

#### GET `/api/book/trades`

Returns the trade book for the authenticated user's account.

**Headers:** `Authorization: Bearer <token>`

**Response (200):** Same `ResponseDto` structure as order book.

**Curl:**
```bash
curl http://localhost:50000/api/book/trades \
  -H "Authorization: Bearer <token>"
```

---

#### POST `/api/positions/strategy`

Returns net position for a specific strategy set.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "StrategySetId": -1,
  "LegId": 0,
  "ClientOrderId": 0,
  "StrategyName": ""
}
```

*Use `StrategySetId: -1` to query all strategies.*

**Response (200):** Standard `ResponseDto` with position data.

**Curl:**
```bash
curl -X POST http://localhost:50000/api/positions/strategy \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"StrategySetId":100}'
```

---

#### GET `/api/positions/vendor`

Returns the vendor net position for the authenticated user's account.

**Headers:** `Authorization: Bearer <token>`

**Response (200):** Standard `ResponseDto`.

**Curl:**
```bash
curl http://localhost:50000/api/positions/vendor \
  -H "Authorization: Bearer <token>"
```

---

### 5.8 Orders

**All require Bearer token.** Orders are sent to the TradeEngine via ZeroMQ with ratio processing.

#### POST `/api/orders/place`

Places a new order. Supports ratio processing (lot multiplier, order splitting) based on the account's strategy config.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "StrategySetName": "MyStrategy",
  "LegId": 1,
  "StrategySetId": 100,
  "ClientOrderId": 5001,
  "Exchange": "NSE",
  "Instrument": "EQ",
  "Scrip": "RELIANCE",
  "Expiry": "",
  "Strike": "",
  "Cp": "",
  "Token": 12345,
  "OrderPricePlan": 0,
  "OrderQty": 100,
  "BuySell": 1,
  "OrderValidity": 0,
  "DqQty": 0,
  "TriggerPrice": 0.0,
  "OrderType": 0,
  "OrderPrice": 2500.00,
  "ContractTickPrice": 0.05,
  "NotifyAllStatusUpdates": false,
  "IsSquareOffOrder": false,
  "CanModify": true,
  "NumberOfModificationsAllowed": 3,
  "UsePercentageForIncrement": false,
  "IncrementTickPrice": 0.0,
  "IncrementTickPercent": 0.0,
  "IntervalForIncrement": 0,
  "CancelOrderIfNotProcessed": false,
  "SqOffOrderIfNotProcessedAtMkt": false,
  "FinalIncrementPercentage": 0.0
}
```

**Key fields:**
- `Exchange`: `"NSE"` or `"BSE"` (determines MQ endpoint)
- `Instrument`: `"EQ"`, `"FUT"`, `"OPT"`, `"CUR"`, etc. (determines segment: CM/FO/CD)
- `Token`: Instrument token ID from contract data
- `BuySell`: `1` = Buy, `-1` = Sell
- `OrderType`: `0` = Limit, `1` = Market
- `OrderValidity`: `0` = DAY

**Segment derivation (automatic):**
| Instrument Length | Segment |
|---|---|
| <= 2 chars | CM |
| Position 3-5 = "cur" (case-insensitive) | CD |
| Otherwise | FO |
| With BSE exchange | CM_BSE / FO_BSE |

**Response (200):** Single `ResponseDto` (if not split) or array of `ResponseDto` (if split into multiple orders).

**If ratio causes order splitting**, each split produces a separate MQ request. The response is an array of results. If any split fails mid-way, remaining splits are cancelled.

**Curl:**
```bash
curl -X POST http://localhost:50000/api/orders/place \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"Exchange":"NSE","Instrument":"EQ","Token":12345,"OrderQty":100,"BuySell":1,"OrderType":0,"OrderPrice":2500.00,"StrategySetId":100,"LegId":1,"ClientOrderId":5001}'
```

---

#### POST `/api/orders/cancel`

Cancels a specific order.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "StrategySetId": 100,
  "LegId": 1,
  "ClientOrderId": 5001,
  "StrategyName": "MyStrategy"
}
```

**Response (200):** Standard `ResponseDto`.

**Curl:**
```bash
curl -X POST http://localhost:50000/api/orders/cancel \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"StrategySetId":100,"LegId":1,"ClientOrderId":5001,"StrategyName":"MyStrategy"}'
```

---

#### POST `/api/orders/modify`

**Currently stubbed -- returns hardcoded "not_implemented" response.** No MQ interaction occurs.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "InternalOrderId": 123456789,
  "Token": 12345,
  "OrdQty": 50,
  "LtPrice": 2510.00,
  "TriggerPrice": 0.0
}
```

**Response (200):**
```json
{
  "status": "not_implemented",
  "message": "ModifyOrder MessageType pending — revisit required."
}
```

---

#### POST `/api/orders/cancel-all`

Cancels all open orders (panic cancel).

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "Token": 0,
  "Segment": "CM",
  "Exchange": "NSE"
}
```

*Set `Token: 0` to cancel across all tokens.*

**Response (200):** Standard `ResponseDto`.

**Curl:**
```bash
curl -X POST http://localhost:50000/api/orders/cancel-all \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"Token":0,"Segment":"CM","Exchange":"NSE"}'
```

---

#### POST `/api/orders/squareoff-all`

Squares off all positions.

**Headers:** `Authorization: Bearer <token>`

**Query param:** `isDay` (bool, default `true`) -- day vs. IOC square off

**Request body:** None

**Response (200):** Standard `ResponseDto`.

**Curl:**
```bash
curl -X POST "http://localhost:50000/api/orders/squareoff-all?isDay=true" \
  -H "Authorization: Bearer <token>"
```

---

### 5.9 Strategy Actions

**All require Bearer token.**

#### POST `/api/strategy/{id}/exit`

Exits a strategy by StrategySetId.

**Headers:** `Authorization: Bearer <token>`

**Route param:** `id` (int) -- StrategySetId

**Request body:** None

**Response (200):** Standard `ResponseDto`.

**Curl:**
```bash
curl -X POST http://localhost:50000/api/strategy/100/exit \
  -H "Authorization: Bearer <token>"
```

---

#### POST `/api/strategy/{id}/cancel`

Cancels a strategy by StrategySetId.

**Headers:** `Authorization: Bearer <token>`

**Route param:** `id` (int) -- StrategySetId

**Response (200):** Standard `ResponseDto`.

**Curl:**
```bash
curl -X POST http://localhost:50000/api/strategy/100/cancel \
  -H "Authorization: Bearer <token>"
```

---

#### POST `/api/strategy/exit-multi`

Exits multiple strategies in a single call.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
[
  { "StrategySetId": 100, "LegId": 1, "ClientOrderId": 0, "StrategyName": "" },
  { "StrategySetId": 200, "LegId": 1, "ClientOrderId": 0, "StrategyName": "" }
]
```

**Response (200):**
```json
[
  { "strategySetId": 100, "response": { ... ResponseDto ... } },
  { "strategySetId": 200, "response": { ... ResponseDto ... } }
]
```

**Curl:**
```bash
curl -X POST http://localhost:50000/api/strategy/exit-multi \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '[{"StrategySetId":100},{"StrategySetId":200}]'
```

---

#### GET `/api/strategy/net-position`

Returns net positions for all strategies.

**Headers:** `Authorization: Bearer <token>`

**Response (200):** Standard `ResponseDto`.

**Curl:**
```bash
curl http://localhost:50000/api/strategy/net-position \
  -H "Authorization: Bearer <token>"
```

---

### 5.10 Subscriptions

**All require Bearer token.** Subscriptions manage real-time MQ feed topics for WebSocket/SSE streaming.

#### POST `/api/subscribe`

Subscribes to a market data feed topic.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "Topic": "NSE_EQ",
  "FeedType": "CM"
}
```

*`FeedType` defaults to "CM" if not provided. `Topic` is required.*

**Response (200):**
```json
{
  "success": true,
  "data": "Subscribed to NSE_EQ",
  "type": 50,
  "error": null,
  "timestamp": 1723456789000
}
```

*`type: 50` = `SubscriptionSuccess`.*

**Errors:**
- `400` -- Topic is required
- `500` -- Subscription failed

**Curl:**
```bash
curl -X POST http://localhost:50000/api/subscribe \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"Topic":"NSE_EQ","FeedType":"CM"}'
```

---

#### DELETE `/api/subscribe`

Unsubscribes from a feed topic.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "Topic": "NSE_EQ"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": "Unsubscribed from NSE_EQ",
  "type": 51,
  "error": null,
  "timestamp": 1723456789000
}
```

*`type: 51` = `UnSubscriptionSuccess`.*

**Curl:**
```bash
curl -X DELETE http://localhost:50000/api/subscribe \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"Topic":"NSE_EQ"}'
```

---

#### GET `/api/subscribe`

Gets the current subscription for the authenticated client.

**Headers:** `Authorization: Bearer <token>`

**Response (200, has subscription):**
```json
{
  "Topic": "NSE_EQ",
  "FeedType": "CM",
  "CreatedAt": "2024-01-01T00:00:00Z"
}
```

**Response (200, no subscription):**
```json
{}
```

**Curl:**
```bash
curl http://localhost:50000/api/subscribe \
  -H "Authorization: Bearer <token>"
```

---

### 5.11 XTS Orders

**All require Bearer token.** XTS endpoints translate vendor-specific order JSON to internal format via `XtsOrderTranslator`, then forward to MQ with ratio processing.

#### POST `/api/xts/orders`

Places an order using XTS vendor format. The body is translated to the internal format via the account's translation config, then sent to MQ with ratio processing.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "symbol": "RELIANCE",
  "quantity": 100,
  "price": 2500.00,
  "buySell": "Buy",
  "orderType": "Limit",
  "exchange": "NSE",
  "productType": "NRML"
}
```

**Success (200):**
```json
{
  "success": true,
  "message": "Order placed",
  "mqResponse": "<response data>",
  "ordersSent": 1,
  "debug": { ... }
}
```

*If ratio splits the order, `ordersSent` reflects the number of split orders sent to MQ.*

**Errors:**
- `400` -- Translation error (invalid fields)
- `503` -- XTS translator not available
- `500` -- MQ errors (collected from all splits)

**Curl:**
```bash
curl -X POST http://localhost:50000/api/xts/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"symbol":"RELIANCE","quantity":100,"price":2500.00,"buySell":"Buy","orderType":"Limit","exchange":"NSE","productType":"NRML"}'
```

---

#### POST `/api/xts/orders/modify`

Modifies an existing order using XTS format.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "orderId": "12345",
  "quantity": 50,
  "price": 2510.00
}
```

**Success (200):**
```json
{
  "success": true,
  "message": "Order modified",
  "mqResponse": "<response data>"
}
```

**Curl:**
```bash
curl -X POST http://localhost:50000/api/xts/orders/modify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"orderId":"12345","quantity":50,"price":2510.00}'
```

---

#### POST `/api/xts/orders/cancel`

Cancels an order. The body must contain one of `orderId`, `InternalOrderId`, or `internalOrderId`.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "orderId": "12345",
  "token": 12345,
  "segment": "CM"
}
```

*`token` and `segment` are optional (default segment: "CM"). `orderId` is required.*

**Success (200):**
```json
{
  "success": true,
  "message": "Cancel request sent",
  "mqResponse": "<response data>"
}
```

**Errors:**
- `400` -- OrderId is required

**Curl:**
```bash
curl -X POST http://localhost:50000/api/xts/orders/cancel \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"orderId":"12345","token":12345}'
```

---

#### GET `/api/xts/vendors`

Returns the list of registered vendor translators.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "vendors": ["XTS"]
}
```

**Curl:**
```bash
curl http://localhost:50000/api/xts/vendors \
  -H "Authorization: Bearer <token>"
```

---

### 5.12 Contracts

**All require Bearer token.** Contract endpoints provide instrument metadata (lot size, tick price, symbol, etc.).

#### GET `/api/contract`

Returns contract information for a given token/segment/exchange. Uses the in-memory contract cache (fetches from MQ on cache miss, cached until midnight).

**Headers:** `Authorization: Bearer <token>`

**Query params:**
| Param | Type | Required | Description |
|---|---|---|---|
| `token` | int | Yes (> 0) | Instrument token ID |
| `segment` | string | No | Market segment (CM, FO, CD, etc.) |
| `exchange` | string | No | Exchange code (NSE, BSE) |

**Example:** `GET /api/contract?token=12345&segment=CM&exchange=NSE`

**Success (200):**
```json
{
  "success": true,
  "data": {
    "token": 12345,
    "segment": "CM",
    "exchange": "NSE",
    "symbol": "RELIANCE",
    "lotSize": 250,
    "tickPrice": 0.05,
    "expiry": "",
    "strikePrice": 0.0,
    "instrumentType": "EQ",
    "error": null
  }
}
```

*`isValid` is true when `error` is null/empty and `token > 0`.*

**Errors:**
- `400` -- Token <= 0 or missing
- `404` -- Contract not found or has error

**Curl:**
```bash
curl "http://localhost:50000/api/contract?token=12345&segment=CM&exchange=NSE" \
  -H "Authorization: Bearer <token>"
```

---

#### POST `/api/contract/fetch`

Pushes a contract request directly to the MQ server (bypasses the cache). Useful for forcing a fresh fetch mid-day or querying before cache population.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "token": 12345,
  "segment": "CM",
  "exchange": "NSE"
}
```

**Success (200):** Same `ContractInfo` shape as GET endpoint.

**Errors:**
- `400` -- Token <= 0
- `404` -- Contract not found or MQ returned error
- `504` -- MQ request timed out (5 second timeout)
- `500` -- Unexpected error

**Internal details:**
- Connects to MQ on configured contract port (default 5586)
- Sends pipe-separated request: `"10|<token>|<segment>|<exchange>"`
- Deserializes ZeroMQ REQ/REP response to `ContractInfo`

**Curl:**
```bash
curl -X POST http://localhost:50000/api/contract/fetch \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"token":12345,"segment":"CM","exchange":"NSE"}'
```

---

#### GET `/api/contract/cache/count`

Returns the number of contracts currently cached in memory.

**Headers:** `Authorization: Bearer <token>`

**Success (200):**
```json
{
  "success": true,
  "data": { "count": 42 }
}
```

**Curl:**
```bash
curl http://localhost:50000/api/contract/cache/count \
  -H "Authorization: Bearer <token>"
```

---

### 5.13 Messaging

#### GET `/api/messaging/health`

**Auth:** None

Simple health check endpoint. No MQ or database dependency.

**Response (200):**
```json
{
  "success": true,
  "data": "Service is running",
  "type": 0,
  "error": null,
  "timestamp": 1723456789000
}
```

**Curl:**
```bash
curl http://localhost:50000/api/messaging/health
```

---

#### POST `/api/messaging/raw`

**Auth:** Bearer (dev or admin role required -- `role` claim must be `"dev"` or `"admin"`)

Sends a raw payload directly to the MQ server. Useful for debugging and direct TradeEngine interaction.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "endpoint": "CM",
  "rawPayload": "10|12345|CM|NSE"
}
```

*`endpoint` defaults to "CM" if not provided. `rawPayload` is required.*

**Response (200):** Standard `ResponseDto` with MQ response in `Data` field.

**Errors:**
- `400` -- RawPayload is required
- `403` -- Not dev or admin role

**Curl:**
```bash
curl -X POST http://localhost:50000/api/messaging/raw \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{"endpoint":"CM","rawPayload":"10|12345|CM|NSE"}'
```

---

### 5.14 Enums

**All have no auth requirement** (`[AllowAnonymous]`). Provides introspection of the TradeEngine enum types.

#### GET `/api/enums`

Returns all enum types from the loaded assemblies, with member names and values.

**Auth:** None

**Response (200):**
```json
{
  "success": true,
  "count": 15,
  "enums": [
    {
      "name": "BuySell",
      "fullName": "TradeEngine.OrderProcessor.Parameters.BuySell",
      "assembly": "TradeEngine.OrderProcessor.Parameters",
      "underlyingType": "Int32",
      "members": [
        { "name": "Buy", "value": 1 },
        { "name": "Sell", "value": -1 }
      ]
    }
  ]
}
```

**Curl:**
```bash
curl http://localhost:50000/api/enums
```

---

#### GET `/api/enums/{name}`

Returns a specific enum by name (case-insensitive).

**Auth:** None

**Route param:** `name` (string) -- enum simple name

**Example:** `GET /api/enums/BuySell`

**Success (200):**
```json
{
  "success": true,
  "enum": { "name": "BuySell", "members": [...] }
}
```

**Errors:**
- `400` -- Name is empty
- `404` -- Enum not found (response includes `available` array of valid names)

**Curl:**
```bash
curl http://localhost:50000/api/enums/BuySell
```

---

### 5.15 Docs & Swagger

#### GET `/` (root)

**Auth:** None

302 Redirect to `/swagger` (Swagger UI).

---

#### GET `/api/docs/postman`

**Auth:** None

Returns the Postman collection JSON file.

**Response (200):** Raw JSON of the Postman collection v2.1.0 file from `App_Data/TalkStrategyAPI.postman_collection.json`.

**Curl:**
```bash
curl http://localhost:50000/api/docs/postman
```

---

## 6. Data Models

### 6.1 UserDocument

| Field | Type | Description |
|---|---|---|
| `Id` | int | Auto-increment primary key |
| `Username` | string | Login username (unique) |
| `PasswordHash` | string | SHA-256 hex hash of password |
| `Role` | string | `"admin"`, `"user"`, or `"dev"` |
| `IsApproved` | bool | Admin approval status |
| `Email` | string | Optional email address |
| `AccountId` | int? | FK to linked Account (nullable) |
| `CreatedAt` | DateTime | Registration timestamp |
| `ApprovedAt` | DateTime? | Approval timestamp |

### 6.2 AccountDocument

| Field | Type | Default | Description |
|---|---|---|---|
| `Id` | int | auto | PK |
| `Name` | string | -- | Display name |
| `UserId` | int | -- | FK to User |
| `MqConfigId` | int | 1 | FK to MqServerConfig |
| `StrategyConfigId` | int | 1 | FK to StrategyConfig |
| `TranslationConfigId` | int | -- | FK to TranslationConfig |
| `IsActive` | bool | true | Whether account can trade |
| `CreatedAt` | DateTime | now | |

### 6.3 MqServerConfigDocument

| Field | Type | Default | Description |
|---|---|---|---|
| `Id` | int | auto | PK |
| `Name` | string | -- | Display name |
| `Ip` | string | -- | ZeroMQ server IP |
| `SubPort` | int | 5570 | PUB/SUB port for market feeds |
| `ReqPort` | int | 5580 | REQ/REP port for order requests |
| `QueueSize` | int | 1000 | Receive high watermark |

### 6.4 StrategyConfigDocument

| Field | Type | Default | Description |
|---|---|---|---|
| `Id` | int | auto | PK |
| `Name` | string | -- | Display name |
| `IsRatioEnabled` | bool | false | Enable lot ratio processing |
| `LotMultiplier` | double | 1.0 | Quantity multiplier |
| `MaxOrderQty` | int | 0 | Maximum order quantity (0 = no cap) |
| `SplitOrdersEnabled` | bool | false | Split orders exceeding MaxOrderQty |
| `RejectIfExceedsCap` | bool | false | Reject if exceeds cap (vs. split) |
| `LotRoundingMode` | string | "RoundUp" | "RoundUp" or "RoundNearest" |
| `PriceMultiplier` | double? | null | Price adjustment multiplier |
| `PriceOffset` | double? | null | Price adjustment offset |

### 6.5 TranslationConfigDocument

| Field | Type | Default | Description |
|---|---|---|---|
| `Id` | int | auto | PK |
| `Name` | string | -- | Display name |
| `VendorType` | string | "XTS" | Vendor identifier |
| `DefaultExchange` | string | -- | Default exchange if not in request |
| `DefaultProductType` | string | -- | Default product type |
| `DefaultOrderType` | string | -- | Default order type |
| `DefaultValidity` | string | -- | Default order validity |
| `FieldMappings` | Dictionary | {} | Vendor field -> internal field mapping |
| `StaticDefaults` | Dictionary | {} | Static values injected into every order |

### 6.6 ContractInfo

| Field | Type | Description |
|---|---|---|
| `Token` | int | Instrument token |
| `Segment` | string | Market segment |
| `Exchange` | string | Exchange code |
| `Symbol` | string | Trading symbol |
| `LotSize` | int | Contract lot size |
| `TickPrice` | double | Minimum price increment |
| `Expiry` | string | Expiry date |
| `StrikePrice` | double | Strike price (options) |
| `InstrumentType` | string | Instrument type |
| `Error` | string | Error message (null = valid) |
| `IsValid` | bool (computed) | `Error == null && Token > 0` |

### 6.7 BlacklistedTokenDocument

| Field | Type | Description |
|---|---|---|
| `Id` | int | PK |
| `TokenHash` | string | SHA-256 hash of JWT |
| `ExpiryTime` | DateTime | When the original token expires |
| `BlacklistedAt` | DateTime | When the token was blacklisted |

---

## 7. Error Codes

### Standard HTTP Status Codes

| Code | When Returned |
|---|---|
| **200** | Success |
| **400** | Missing required field, invalid parameter value, password too short |
| **401** | Missing `Authorization` header, expired token, blacklisted token, invalid token signature |
| **403** | Valid token but insufficient role (non-admin accessing admin routes, non-dev accessing raw messaging) |
| **404** | Resource not found (user, account, config, contract) |
| **409** | Conflict (duplicate username) |
| **500** | Internal server error (unexpected exception, LiteDB error, missing account config) |
| **504** | MQ gateway timeout (contract fetch via ZeroMQ exceeded 5 seconds) |

### Response Envelope Patterns

**Trading/book/position/strategy/subscription endpoints:**
```json
{
  "success": false,
  "data": null,
  "type": 0,
  "error": "Description of error",
  "timestamp": 1723456789000
}
```

**Admin/contract/enums endpoints:**
```json
{ "success": false, "error": "Description of error" }
```

**Auth endpoints:**
```json
{ "success": false, "error": "Description of error" }
```

### Common Error Messages

| Message | Context |
|---|---|
| `"Username and password are required"` | Login with empty fields |
| `"Invalid username or password"` | Wrong credentials |
| `"Account not yet approved..."` | User registered but not approved by admin |
| `"No account configured..."` | User has no linked account |
| `"Token has been revoked"` | Token was blacklisted (logout/refresh) |
| `"Admin access required"` | Non-admin accessing admin endpoints |
| `"Access restricted to dev/admin role"` | Insufficient role for raw messaging |
| `"Token is required"` | Missing Bearer token |
| `"Topic is required"` | Subscribe without topic |
| `"Contract MQ request timed out."` | ZeroMQ req/rep timeout (5s) |
| `"Unable to connect to API"` | Network error on client side |

---

## 8. Configuration Reference

All settings are in `Web.config` under `<appSettings>`:

| Key | Default | Description |
|---|---|---|
| `MQIp` | `localhost` | ZeroMQ server IP address |
| `QPortReqResContractInfo` | `5586` | ZeroMQ REQ port for contract info |
| `Jwt:Secret` | *(auto-generated)* | HS256 signing key (auto-gen if empty) |
| `Jwt:Issuer` | `TalkStrategyAPI` | JWT issuer claim |
| `Jwt:Audience` | `TalkStrategyClients` | JWT audience claim |
| `Jwt:ExpiryMinutes` | `720` | Token lifetime in minutes |
| `ContractCache:UseStub` | `true` | Use stub (mock) contract data instead of real MQ |

---

## 9. AI Agent Integration Guide

### 9.1 General Integration Patterns

#### Pattern 1: Authentication & Session Management

```
1. POST /api/auth/login → get token
2. Store token, role, accountId
3. Include "Authorization: Bearer <token>" on all subsequent requests
4. On 401: POST /api/auth/refresh → get new token (old one is blacklisted)
5. On logout: POST /api/auth/logout → blacklist current token
```

**Token storage:** Persist in memory or secure storage. Include `expiresAt` from login response to proactively refresh before expiry.

#### Pattern 2: Placing a Trade

```
1. GET /api/contract?token=12345&segment=CM&exchange=NSE  → get lot size, tick price
2. GET /api/enums/BuySell  → confirm Buy=1, Sell=-1
3. GET /api/enums/OrderType  → confirm Limit=0, Market=1
4. POST /api/orders/place  → send order with Token, OrderQty, OrderPrice, BuySell, OrderType
5. Check response.success; if ratio splits, response may be an array
```

#### Pattern 3: Monitoring Positions

```
1. GET /api/book/orders  → open orders
2. GET /api/book/trades  → executed trades
3. GET /api/positions/vendor  → vendor net position
4. POST /api/positions/strategy  → per-strategy position (body: { StrategySetId: -1 })
5. GET /api/strategy/net-position  → all strategy net positions
```

#### Pattern 4: Fetching Contract Data

```
1. GET /api/contract?token=12345&segment=CM&exchange=NSE  → cached (fast, daily expiry)
2. POST /api/contract/fetch  → force fresh from MQ (body: { token, segment, exchange })
3. GET /api/contract/cache/count  → diagnostic
```

#### Pattern 5: Subscribing to Real-Time Feeds

```
1. POST /api/subscribe  → { "Topic": "NSE_EQ", "FeedType": "CM" }
2. Connect WebSocket or SSE endpoint for streaming data
3. GET /api/subscribe  → check current subscription
4. DELETE /api/subscribe  → { "Topic": "NSE_EQ" }
```

### 9.2 Using With vs Without Postman Collection

#### When only the `.md` file is present

This document is fully self-sufficient. Every endpoint includes:
- Complete URL with route/query params
- Authentication requirements
- Full request body schemas with field descriptions
- Success and error response examples
- `curl` commands you can execute directly

**Workflow for AI agents without Postman:**
1. Read the [Authentication](#2-authentication) section to understand JWT flow
2. Use the [Endpoint Reference](#5-endpoint-reference) to find the right endpoint
3. Copy the `curl` example, substitute real values
4. Parse responses according to [Response Formats](#4-response-formats)

#### When the Postman collection is ALSO present (`TalkStrategyAPI.postman_collection.json`)

The Postman collection provides additional value:

| `.md` provides | Postman collection adds |
|---|---|
| Curl examples | One-click runnable requests in Postman GUI |
| Auth header description | Auto-extracted `{{token}}` via Login test scripts (no manual copy-paste) |
| Parameter descriptions | Pre-populated raw body templates with all fields (e.g., 30-field order placement JSON) |
| Controller grouping | Folder structure mirrors endpoint sections for easy navigation |
| Response schemas | Login test scripts auto-set collection variables (`token`, `admin_token`) |
| Manual testing guidelines | Run with Newman CLI for automated integration tests: `newman run TalkStrategyAPI.postman_collection.json --env-var base_url=http://localhost:50000` |

**Enhanced workflow for AI agents WITH Postman:**
1. Load the collection in Postman or parse its JSON to map folders → controllers
2. Run the Login request first -- the test script automatically sets `{{token}}` for all subsequent calls
3. Run Login as User (if you need a non-admin token) -- sets `{{token}}` separately
4. For the Admin folder, use `{{admin_token}}` (set manually or via a separate Admin Login)
5. For complex payloads (order placement with 30+ fields), reference the pre-built body in the collection's "Place Order" request instead of constructing from scratch
6. Use the collection variables: `{{base_url}}`, `{{token}}`, `{{admin_token}}`, `{{admin_password}}`, `{{user_name}}`, `{{user_password}}`

**Collection structure (14 folders):**
```
Auth (5) → Messaging (2) → Orders (5) → Subscriptions (3) → 
Book & Positions (4) → Strategy Actions (4) → XTS Orders (4) → 
Enums (2) → Admin - Users (4) → Admin - Accounts (4) → 
Admin - MQ Configs (4) → Admin - Strategy Configs (4) → 
Admin - Translation Configs (4) → Contracts (3) → Docs (1)
```

**Collection variables:**
| Variable | Default | Set By |
|---|---|---|
| `base_url` | `http://localhost:50000` | Manual |
| `token` | *(empty)* | Login test script |
| `admin_token` | *(empty)* | Manual (or copy from token) |
| `admin_password` | *(empty)* | Manual |
| `user_name` | *(empty)* | Manual |
| `user_password` | *(empty)* | Manual |

### 9.3 Target-Specific Guidance

#### DeepSeek v4 Pro / DeepSeek V4 Flash

**Strengths for this API:**
- Excellent at following structured API docs with curl examples
- Strong JSON generation -- can construct complex order payloads from data model descriptions
- Good at multi-step workflows (login → trade → monitor)

**Recommended approach:**
1. Point to this `.md` file as primary reference
2. If Postman collection is present, mention both files -- DeepSeek can cross-reference
3. For order placement, first call `/api/enums` to get valid enum values, then construct the order payload
4. DeepSeek can handle the complex 30-field order payload from the schema description alone

**Prompt template:**
```
Using the TalkStrategy API reference at [path/to/this/file.md], 
write a script that:
1. Logs in with username X and password Y
2. Places a BUY order for RELIANCE (token 12345) at price 2500, qty 100
3. Polls the order book every 2 seconds until the order status changes
```

---

#### Claude

**Strengths for this API:**
- Strong at reading and synthesizing long documents
- Good at generating step-by-step workflows
- Excellent at explaining concepts

**Recommended approach:**
1. Provide this `.md` file in full
2. Claude reads endpoint reference tables well -- the structured format maps to its comprehension style
3. For curl examples, Claude will faithfully reproduce them with your real values substituted
4. When Postman collection is also present, tell Claude explicitly: "The Postman collection at [path] mirrors the folders in the endpoint reference. You can use its pre-built request bodies as templates."

**Prompt template:**
```
I need to integrate with the TalkStrategy API. The documentation is at [path].
Please generate a Python integration module that:
- Uses requests library
- Handles JWT auth (login, refresh, logout)
- Wraps order placement with proper error handling
- Includes retry logic for 401 (refresh token and retry)
Reference the endpoint docs for exact request/response formats.
```

---

#### Gemini

**Strengths for this API:**
- Strong multi-modal understanding of structured data
- Good at generating code from API specifications
- Handles large context windows well

**Recommended approach:**
1. Provide the full `.md` file -- Gemini handles large documents
2. For code generation, reference specific endpoint sections
3. When Postman is present, Gemini can parse the JSON collection format to auto-generate request code
4. Use the "Pattern" sections (9.1) as templates for Gemini to follow

**Prompt template:**
```
You are integrating with the TalkStrategy trading API (docs attached).
Generate a TypeScript client library that covers:
- Auth (login, refresh, logout) with automatic token management
- Order placement with all required fields
- Contract lookup with caching
- Type definitions for all data models in section 6
```

---

#### General Multi-Agent Best Practices

1. **Always start with login** -- no endpoint except auth/health/enums works without a Bearer token
2. **Handle 401 gracefully** -- on any 401, attempt `/api/auth/refresh`. If refresh also fails, redirect to login
3. **Check both HTTP status AND `success` field** -- a 200 response with `success: false` is an error
4. **Rate limiting** -- no explicit rate limiting is configured, but MQ responses may timeout (5s for contracts, 10s for orders). Don't fire and forget
5. **Token lifecycle** -- tokens are invalidated on logout AND on refresh. The old token becomes immediately unusable. Store only the newest token
6. **Order splitting** -- if the account has `IsRatioEnabled` and `SplitOrdersEnabled`, a single `POST /api/orders/place` may produce multiple MQ messages. The response will be an array rather than a single object
7. **Segment derivation** -- when placing orders via `/api/orders/place`, you don't specify the segment. The system derives it from the `Instrument` field (see section 5.8)
8. **Admin operations are idempotent** -- approving an already-approved user returns success; deleting a non-existent resource returns 404
9. **Contract cache** -- by default uses stub data (`ContractCache:UseStub = true` in Web.config). For production, set to `false` and ensure the contract MQ server is running on the configured port (default 5586)
10. **Error field casing** -- `error` property may be `"error"` or `"Error"` depending on the endpoint. Parse both variants
