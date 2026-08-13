# Ganesh Broadcast API — Documentation

> **Version:** 1.0  
> **Base URL:** `http://192.168.190.120:9081`  
> **Format:** JSON  
> **Authentication:** Bearer Token (JWT)

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
   - [POST /api/Auth/Login](#post-apiauthlogin)
3. [Common Parameters](#common-parameters)
4. [Endpoints — NSE Broadcast](#endpoints--nse-broadcast)
   - [POST /api/Broadcast/GetOHLC](#post-apibroadcastgetohlc)
   - [POST /api/Broadcast/GetRequiredTokenOHLC](#post-apibroadcastgetrequiredtokenohlc)
   - [POST /api/Broadcast/combined-ohlc](#post-apibroadcastcombined-ohlc)
   - [POST /api/Broadcast/Expression-ohlc](#post-apibroadcastexpression-ohlc)
   - [POST /api/Broadcast/ByContract-ohlc](#post-apibroadcastbycontract-ohlc)
   - [GET  /api/Broadcast/test-auth](#get-apibroadcasttest-auth)
5. [Endpoints — BSE Broadcast](#endpoints--bse-broadcast)
   - [POST /api/BroadcastBse/GetOHLC](#post-apibroadcastbsegetohlc)
   - [POST /api/BroadcastBse/ByContract-ohlc](#post-apibroadcastbsebycontract-ohlc)
6. [Response Schema](#response-schema)
7. [Instrument Rules](#instrument-rules)
8. [Pagination & Cursor Guide](#pagination--cursor-guide)
9. [Epoch Time Reference](#epoch-time-reference)

---

## Overview

The Ganesh Broadcast API provides historical OHLC (Open, High, Low, Close) candlestick data for NSE and BSE instruments. All endpoints require a Bearer Token obtained from the Authentication endpoint.

---

## Authentication

All protected endpoints require an **Authorization** header:

```
Authorization: Bearer <token>
```

Additionally, an **x-bypass** header must be included in every request:

```
x-bypass: 34f38c9f-a786-4fc4-81e1-b1f1c378d512
```

---

### POST /api/Auth/Login

Authenticates a user and returns a Bearer token for use in subsequent API calls.

**Method:** `POST`  
**URL:** `http://192.168.190.120:9081/api/Auth/Login`

#### Request Headers

| Header       | Value                                    | Required |
|--------------|------------------------------------------|----------|
| x-bypass     | `34f38c9f-a786-4fc4-81e1-b1f1c378d512`  | Yes      |
| Content-Type | `application/json`                       | Yes      |

#### Request Body

```json
{
  "UserName": "ABW43066",
  "Password": "algo@123"
}
```

| Field      | Type   | Description                       |
|------------|--------|-----------------------------------|
| `UserName` | string | Your registered username/user ID  |
| `Password` | string | Your account password             |

#### Next Steps After Login

1. Open the **Authorization** tab in your API client (e.g., Postman).
2. Select **Auth Type → Bearer Token**.
3. Paste the token received in the login response.

---

## Common Parameters

These parameters appear across multiple endpoints and share consistent semantics:

| Parameter    | Type               | Description |
|--------------|--------------------|-------------|
| `from`       | integer (epoch ms) | Start timestamp — epoch time in milliseconds from when you want data. |
| `to`         | integer (epoch ms) | End timestamp — epoch time in milliseconds till when you want data. |
| `cursor`     | integer / null     | Pagination cursor. Pass `null` to fetch data from the beginning. Pass the `NextCursor` value from a previous response to retrieve the next page. |
| `pageSize`   | integer            | Maximum number of rows to return. Default is set in server settings; maximum is **2000**. |
| `bucketSize` | string             | Candle interval, provided as an integer followed by a space and the unit. Example: `"1 min"`, `"2 Min"`, `"1 hour"`, `"30 sec"`. |
| `AlgoIQToken`| integer            | AlgoIQ token identifier. Pass `0` if not applicable. |
| `Strategy`   | string             | Strategy name. Pass `""` if no specific strategy is selected. |

> **Epoch Time Reference:** Use [https://www.epochconverter.com/](https://www.epochconverter.com/) to convert human-readable dates to epoch milliseconds.

---

## Endpoints — NSE Broadcast

---

### POST /api/Broadcast/GetOHLC

Retrieves OHLC candlestick data for a given NSE instrument token.

**Method:** `POST`  
**URL:** `http://192.168.190.120:9081/api/Broadcast/GetOHLC`

#### Request Headers

| Header        | Value              | Required |
|---------------|--------------------|----------|
| Authorization | `Bearer <token>`   | Yes      |
| Content-Type  | `application/json` | Yes      |

#### Request Body

```json
{
  "token": 39990,
  "from": 1767851460000,
  "to": 1767948645000,
  "cursor": 1767851580000,
  "pageSize": 3,
  "bucketSize": "1 min",
  "instrument": "/FUTSTK/CM/IXCM",
  "AlgoIQToken": 0,
  "Strategy": ""
}
```

#### Body Parameters

| Field        | Type               | Required | Description |
|--------------|--------------------|----------|-------------|
| `token`      | integer            | Yes      | Instrument token number. |
| `from`       | integer (epoch ms) | Yes      | Start of the data range. |
| `to`         | integer (epoch ms) | Yes      | End of the data range. |
| `cursor`     | integer / null     | Yes      | Pagination cursor. See [Common Parameters](#common-parameters). |
| `pageSize`   | integer            | Yes      | Number of rows per page (max 2000). |
| `bucketSize` | string             | Yes      | Candle duration, e.g., `"1 min"`. |
| `instrument` | string             | Yes      | Instrument segment path. See [Instrument Rules](#instrument-rules). |
| `AlgoIQToken`| integer            | Yes      | AlgoIQ reference token. |
| `Strategy`   | string             | Yes      | Strategy name (or `""` for none). |

---

### POST /api/Broadcast/GetRequiredTokenOHLC

Retrieves OHLC data for FO segment tokens that are near the ATM (at-the-money) strike at the time of data saving.

> **Note:** For FO segment only. Tokens to pass are those near ATM strike at time of saving. These tokens are retrieved daily from the UAT API.

**Method:** `POST`  
**URL:** `http://192.168.190.120:9081/api/Broadcast/GetRequiredTokenOHLC`

#### Request Body

```json
{
  "token": 39990,
  "from": 1767851460000,
  "to": 1767948645000,
  "cursor": 1767851580000,
  "pageSize": 3,
  "bucketSize": "1 min",
  "AlgoIQToken": 0,
  "Strategy": ""
}
```

#### Body Parameters

| Field        | Type               | Required | Description |
|--------------|--------------------|----------|-------------|
| `token`      | integer            | Yes      | Instrument token (near ATM at save time). |
| `from`       | integer (epoch ms) | Yes      | Data start time. |
| `to`         | integer (epoch ms) | Yes      | Data end time. |
| `cursor`     | integer / null     | Yes      | Pagination cursor. |
| `pageSize`   | integer            | Yes      | Max rows per page. |
| `bucketSize` | string             | Yes      | Candle interval. |
| `AlgoIQToken`| integer            | Yes      | AlgoIQ token. |
| `Strategy`   | string             | Yes      | Strategy name. |

---

### POST /api/Broadcast/combined-ohlc

Returns OHLC data for a mathematical combination of two instrument tokens (addition or subtraction).

> **Note:** For FO segment only. Uses ATM-near tokens retrieved from the UAT API daily.

**Method:** `POST`  
**URL:** `http://192.168.190.120:9081/api/Broadcast/combined-ohlc`

#### Request Body

```json
{
  "token1": 39990,
  "token2": 39991,
  "from": 1767851460000,
  "to": 1767948645000,
  "pageSize": 3,
  "operation": 1,
  "cursor": 1767851580000,
  "bucketSize": "1 min",
  "AlgoIQToken1": 0,
  "AlgoIQToken2": 0,
  "Strategy": "",
  "instrument": ""
}
```

#### Body Parameters

| Field          | Type               | Required | Description |
|----------------|--------------------|----------|-------------|
| `token1`       | integer            | Yes      | First instrument token. |
| `token2`       | integer            | Yes      | Second instrument token. |
| `from`         | integer (epoch ms) | Yes      | Data start time. |
| `to`           | integer (epoch ms) | Yes      | Data end time. |
| `pageSize`     | integer            | Yes      | Max rows per page. |
| `operation`    | integer            | Yes      | `1` = Add (`token1 + token2`), `2` = Subtract (`token1 - token2`). |
| `cursor`       | integer / null     | Yes      | Pagination cursor. |
| `bucketSize`   | string             | Yes      | Candle interval. |
| `AlgoIQToken1` | integer            | Yes      | AlgoIQ reference for token1. |
| `AlgoIQToken2` | integer            | Yes      | AlgoIQ reference for token2. |
| `Strategy`     | string             | Yes      | Strategy name. |
| `instrument`   | string             | Yes      | Instrument segment path. |

---

### POST /api/Broadcast/Expression-ohlc

Evaluates a custom mathematical expression across multiple instrument tokens and returns the resulting OHLC candles.

> **Performance Tip:** For best performance, use a maximum of 3–4 tokens in the expression.

**Method:** `POST`  
**URL:** `http://192.168.190.120:9081/api/Broadcast/Expression-ohlc`

#### Request Body

```json
{
  "tokens": [71300, 71301, 71302],
  "Expression": "(t1+t2)-t3",
  "from": 1775626200000,
  "to": 1775629800000,
  "cursor": null,
  "pageSize": 5,
  "bucketSize": "2 Min"
}
```

#### Body Parameters

| Field        | Type                | Required | Description |
|--------------|---------------------|----------|-------------|
| `tokens`     | array of integers   | Yes      | List of instrument tokens. Referenced as `t1`, `t2`, `t3` … in the expression. |
| `Expression` | string              | Yes      | Mathematical formula using token placeholders, e.g., `"(t1+t2)-t3"`. |
| `from`       | integer (epoch ms)  | Yes      | Data start time. |
| `to`         | integer (epoch ms)  | Yes      | Data end time. |
| `cursor`     | integer / null      | Yes      | Pagination cursor. Pass `null` for the first request. |
| `pageSize`   | integer             | Yes      | Max rows per page. |
| `bucketSize` | string              | Yes      | Candle interval. |

---

### POST /api/Broadcast/ByContract-ohlc

Retrieves OHLC data for NSE options by specifying contract details (symbol, expiry, strike, option type) instead of a raw token.

> **Note:** For FO segment with Nifty / BankNifty only.

**Method:** `POST`  
**URL:** `http://192.168.190.120:9081/api/Broadcast/ByContract-ohlc`

#### Request Body

```json
{
  "Symbol": "NIFTY",
  "OptionType": "CE",
  "from": 1776419100000,
  "to": 1776420000000,
  "cursor": 1776419340000,
  "pageSize": 5,
  "ExpiryDate": "2026-04-28",
  "Strike": 23800,
  "AlgoIQToken": 0
}
```

#### Body Parameters

| Field        | Type               | Required | Description |
|--------------|--------------------|----------|-------------|
| `Symbol`     | string             | Yes      | Underlying symbol, e.g., `"NIFTY"`. |
| `OptionType` | string             | Yes      | `"CE"` (Call) or `"PE"` (Put). |
| `from`       | integer (epoch ms) | Yes      | Data start time. |
| `to`         | integer (epoch ms) | Yes      | Data end time. |
| `cursor`     | integer / null     | Yes      | Pagination cursor. |
| `pageSize`   | integer            | Yes      | Max rows per page. |
| `ExpiryDate` | string (date)      | Yes      | Contract expiry in `YYYY-MM-DD` format. |
| `Strike`     | integer            | Yes      | Strike price. |
| `AlgoIQToken`| integer            | Yes      | AlgoIQ token reference. |

---

### GET /api/Broadcast/test-auth

Health-check endpoint to verify that the API is reachable and the Bearer token is valid.

> **Note:** A valid Bearer token is required to use this endpoint.

**Method:** `GET`  
**URL:** `http://192.168.190.120:9081/api/Broadcast/test-auth`

#### Request Headers

| Header        | Value            | Required |
|---------------|------------------|----------|
| Authorization | `Bearer <token>` | Yes      |

---

## Endpoints — BSE Broadcast

---

### POST /api/BroadcastBse/GetOHLC

Retrieves OHLC candlestick data for a given BSE instrument token.

**Method:** `POST`  
**URL:** `http://192.168.190.120:9081/api/BroadcastBse/GetOHLC`

#### Request Body

```json
{
  "token": 1141440,
  "from": 1779097500000,
  "to": 1779098400000,
  "cursor": null,
  "pageSize": 20,
  "bucketSize": "1 Min",
  "Instrument": "",
  "AlgoIQToken": 0,
  "Strategy": ""
}
```

#### Body Parameters

| Field        | Type               | Required | Description |
|--------------|--------------------|----------|-------------|
| `token`      | integer            | Yes      | BSE instrument token number. |
| `from`       | integer (epoch ms) | Yes      | Data start time. |
| `to`         | integer (epoch ms) | Yes      | Data end time. |
| `cursor`     | integer / null     | Yes      | Pagination cursor. |
| `pageSize`   | integer            | Yes      | Max rows per page. |
| `bucketSize` | string             | Yes      | Candle interval. |
| `Instrument` | string             | Yes      | Instrument segment path. See [Instrument Rules (BSE)](#instrument-rules). |
| `AlgoIQToken`| integer            | Yes      | AlgoIQ token reference. |
| `Strategy`   | string             | Yes      | Strategy name (or `""` for none). |

---

### POST /api/BroadcastBse/ByContract-ohlc

Retrieves BSE options OHLC data by contract specification.

**Method:** `POST`  
**URL:** `http://192.168.190.120:9081/api/BroadcastBse/ByContract-ohlc`

#### Request Body

```json
{
  "Symbol": "NIFTY",
  "OptionType": "CE",
  "from": 1776419100000,
  "to": 1776420000000,
  "cursor": 1776419340000,
  "pageSize": 5,
  "ExpiryDate": "2026-04-28",
  "Strike": 23800,
  "AlgoIQToken": 0,
  "Exchange": "",
  "Segment": "",
  "Instrument": ""
}
```

#### Body Parameters

| Field        | Type               | Required | Description |
|--------------|--------------------|----------|-------------|
| `Symbol`     | string             | Yes      | Underlying symbol, e.g., `"NIFTY"`. |
| `OptionType` | string             | Yes      | `"CE"` (Call) or `"PE"` (Put). |
| `from`       | integer (epoch ms) | Yes      | Data start time. |
| `to`         | integer (epoch ms) | Yes      | Data end time. |
| `cursor`     | integer / null     | Yes      | Pagination cursor. |
| `pageSize`   | integer            | Yes      | Max rows per page. |
| `ExpiryDate` | string (date)      | Yes      | Contract expiry in `YYYY-MM-DD` format. |
| `Strike`     | integer            | Yes      | Strike price. |
| `AlgoIQToken`| integer            | Yes      | AlgoIQ token. |
| `Exchange`   | string             | No       | Exchange identifier. |
| `Segment`    | string             | No       | Market segment identifier. |
| `Instrument` | string             | No       | Instrument category. |

---

## Response Schema

All endpoints return a unified JSON envelope:

```json
{
  "Status": true,
  "StatusCode": 200,
  "Message": "Api Executed Successfully",
  "Result": {
    "Data": [
      {
        "Timestamp": 1775535480000,
        "Token": 4,
        "Open": 22819.10,
        "High": 22819.10,
        "Low": 22819.10,
        "Close": 22819.10
      }
    ],
    "NextCursor": 1775535480000,
    "HasMore": true
  }
}
```

### Response Fields

| Field                     | Type               | Description |
|---------------------------|--------------------|-------------|
| `Status`                  | boolean            | `true` if the request succeeded, `false` otherwise. |
| `StatusCode`              | integer            | HTTP-style status code (e.g., `200`). |
| `Message`                 | string             | Human-readable status message. |
| `Result.Data`             | array of objects   | Array of OHLC candle records. |
| `Result.Data[].Timestamp` | integer (epoch ms) | Candle open time. |
| `Result.Data[].Token`     | integer            | Instrument token. |
| `Result.Data[].Open`      | number             | Opening price. |
| `Result.Data[].High`      | number             | Highest price in the candle. |
| `Result.Data[].Low`       | number             | Lowest price in the candle. |
| `Result.Data[].Close`     | number             | Closing price. |
| `Result.NextCursor`       | integer            | Timestamp to pass as `cursor` for the next page. |
| `Result.HasMore`          | boolean            | `true` if more pages of data are available. |

---

## Instrument Rules

The `instrument` field controls which market segment data is fetched from.

### NSE Instrument Values

| Value      | Segment |
|------------|---------|
| `""`       | FO segment — Nifty and BankNifty only |
| `"FUTSTK"` | Near-month expiry futures on individual stocks (near = date stored in system) |
| `"CM"`     | Equity (Cash Market) |
| `"IXCM"`   | Spot index (e.g., Nifty 50 spot price) |

### BSE Instrument Values

| Value    | Segment |
|----------|---------|
| `""`     | FO segment — SENSEX contracts |
| `"IXCM"` | Spot index — SENSEX spot price |

---

## Pagination & Cursor Guide

The API uses **cursor-based pagination** to handle large datasets efficiently.

| Step | Action |
|------|--------|
| **1. First request** | Set `cursor` to `null`. |
| **2. Check response** | If `Result.HasMore` is `true`, more data is available. |
| **3. Next request**  | Set `cursor` to the value of `Result.NextCursor`. |
| **4. Repeat**        | Continue until `HasMore` is `false`. |

> **pageSize** limits how many records are returned per request. The server-configured maximum is **2000** rows.

---

## Epoch Time Reference

All timestamps (`from`, `to`, `cursor`, `Timestamp` in responses) are expressed as **Unix epoch time in milliseconds**.

- Convert dates online: [https://www.epochconverter.com/](https://www.epochconverter.com/)

**JavaScript Example:**

```javascript
// Current time in epoch milliseconds
const nowMs = Date.now();

// Specific date to epoch ms
const epoch = new Date("2026-04-28T09:15:00+05:30").getTime();
console.log(epoch); // e.g., 1776419100000
```

---

*Documentation generated from internal reference. For support, contact the API team.*
