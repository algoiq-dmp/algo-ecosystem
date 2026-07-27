# 19 â€” Integration Guide

**Version:** 3.2.1 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24

---

## Overview

This guide explains how to integrate with Ganesh as a consumer. Ganesh exposes a REST API for querying OHLC bars across five timeframes. All integrations require Suraksha authentication.

## Prerequisites

1. **Suraksha API credentials** â€” request via the Suraksha developer portal.
2. **Consumer registration** â€” register your consumer with Narad to obtain a consumer ID.
3. **Network access** â€” ensure your service can reach `ganesh.algoiq.io:443`.

## Step 1: Obtain Suraksha JWT Token

```javascript
const response = await fetch('https://suraksha.algoiq.io/api/v1/auth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret',
    audience: 'ganesh'
  })
});
const { accessToken } = await response.json();
```

Tokens are valid for 15 minutes. Implement automatic refresh.

## Step 2: Query OHLC Data

### Node.js Example

```javascript
const GANESH_BASE = 'https://ganesh.algoiq.io/api/v1';

async function getLatestBar(symbol, timeframe, token) {
  const res = await fetch(`${GANESH_BASE}/bar/${symbol}/${timeframe}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

async function getBarRange(symbol, timeframe, from, to, token) {
  const params = new URLSearchParams({ from: from.toISOString(), to: to.toISOString() });
  const res = await fetch(`${GANESH_BASE}/bars/${symbol}/${timeframe}?${params}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}
```

### Python Example

```python
import requests

GANESH_BASE = "https://ganesh.algoiq.io/api/v1"

def get_latest_bar(symbol, timeframe, token):
    headers = {"Authorization": f"Bearer {token}"}
    resp = requests.get(f"{GANESH_BASE}/bar/{symbol}/{timeframe}", headers=headers)
    resp.raise_for_status()
    return resp.json()

def get_bar_range(symbol, timeframe, from_dt, to_dt, token):
    headers = {"Authorization": f"Bearer {token}"}
    params = {"from": from_dt.isoformat(), "to": to_dt.isoformat()}
    resp = requests.get(f"{GANESH_BASE}/bars/{symbol}/{timeframe}", headers=headers, params=params)
    resp.raise_for_status()
    return resp.json()
```

## Step 3: Handle Rate Limits

Ganesh returns `429 Too Many Requests` with a `Retry-After` header:

```javascript
if (res.status === 429) {
  const retryAfter = parseInt(res.headers.get('Retry-After') || '1');
  await sleep(retryAfter * 1000);
  return retry();
}
```

## Integration Patterns

| Consumer | Pattern | Endpoint |
|---|---|---|
| Real-Time Engine (Vega) | Poll every 1s | `GET /bar/:symbol/1m` |
| Backtesting Simulator | Bulk batch | `GET /bars/:symbol/1m?from=&to=` |
| Alert Engine (Suchak) | On-demand | `GET /bar/:symbol/1m` |
| Web Dashboard | Multi-TF every 5s | `GET /bars/multi/:symbol?tfs=1m,5m,...` |

## Consumer Registration (Narad)

```bash
narad-cli register-consumer \
  --name "My Strategy Engine" \
  --type "strategy-engine" \
  --contact "team@example.com" \
  --rate-limit-tier "realtime"
```

## Testing

| Environment | URL |
|---|---|
| Staging | `https://ganesh-staging.algoiq.io/api/v1` |
| Sandbox | `https://ganesh-sandbox.algoiq.io/api/v1` (no auth, synthetic data) |

## Common Integration Issues

| Issue | Solution |
|---|---|
| 401 Unauthorized | Refresh JWT; verify audience = `ganesh` |
| 404 Not Found | Verify symbol is actively traded |
| 429 Rate Limited | Implement exponential backoff |
| Timeout on range | Reduce range; use `limit` parameter |
