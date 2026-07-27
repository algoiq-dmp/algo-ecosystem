# DXCC — API Reference

> **Version:** 2.0.0 | **Status:** Draft | **Owner:** DXCC Team | **Last Updated:** 2026-07-24

---

## Plugin SDK

DXCC exposes a Plugin SDK for third-party and custom module development. All hooks are available via the `@dxcc/sdk` package.

### useNaradSubscription

```typescript
function useNaradSubscription<T = unknown>(
  topic: string,
  options?: {
    filter?: (message: T) => boolean;
    initialData?: T | null;
    bufferSize?: number;
  }
): {
  data: T | null;
  buffer: T[];
  isLive: boolean;
  lastUpdated: Date | null;
  error: string | null;
}
```

**Parameters:**
- `topic` — Narad topic to subscribe to (e.g., `"engine.health.suchak"`)
- `options.filter` — Optional predicate to filter messages
- `options.initialData` — Seed value before first message arrives
- `options.bufferSize` — Number of recent messages to retain (default: 100)

**Returns:**
- `data` — Latest message matching the filter
- `buffer` — Recent message history
- `isLive` — `true` if data is from WebSocket; `false` if from REST fallback
- `lastUpdated` — Timestamp of last message receipt
- `error` — Error string if subscription failed

**Lifecycle:** Subscribes on component mount; unsubscribes on unmount.

---

### useApiQuery

```typescript
function useApiQuery<T = unknown>(
  endpoint: string,
  options?: {
    params?: Record<string, string>;
    enabled?: boolean;
    refetchInterval?: number;
    staleTime?: number;
    cacheTime?: number;
    retry?: number | boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: ApiError) => void;
  }
): {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
  refetch: () => void;
}
```

**Parameters:**
- `endpoint` — REST API path relative to Kraken API Gateway base URL
- `options.params` — Query parameters appended to URL
- `options.enabled` — If `false`, query does not auto-fetch
- `options.refetchInterval` — Auto-refetch interval in milliseconds
- `options.staleTime` — Time before data is considered stale
- `options.cacheTime` — Time before unused cache data is garbage collected
- `options.retry` — Number of retry attempts on failure; `false` to disable

**Headers automatically injected:**
- `Authorization: Bearer <JWT>`
- `X-Request-ID: <uuid>`
- `X-DXCC-Version: 2.0.0`

---

### useEngineHealth

```typescript
function useEngineHealth(engineId: string): {
  status: 'healthy' | 'degraded' | 'unresponsive' | 'unknown';
  metrics: {
    cpu_percent: number;
    memory_mb: number;
    latency_p50_ms: number;
    latency_p95_ms: number;
    latency_p99_ms: number;
    error_rate: number;
    uptime_seconds: number;
    replicas_current: number;
    replicas_desired: number;
  };
  lastHeartbeat: Date | null;
  isLive: boolean;
}
```

Combines WebSocket subscription to `engine.health.<engineId>` with REST fallback to `GET /api/engines/<engineId>/health`.

---

### useUserPermissions

```typescript
function useUserPermissions(): {
  user: {
    id: string;
    username: string;
    email: string;
    displayName: string;
  };
  role: 'admin' | 'trader' | 'quant' | 'auditor' | 'viewer';
  permissions: Array<{
    action: string;
    resource: string;
  }>;
  can: (action: string, resource: string) => boolean;
  isAdmin: boolean;
  isTrader: boolean;
  isQuant: boolean;
  isAuditor: boolean;
  isViewer: boolean;
}
```

---

## REST API Endpoints

All REST endpoints are accessed through the Kraken API Gateway at `https://kraken-api-gateway/api/v2/`.

### Engines

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/engines` | List all registered engines | Viewer+ |
| GET | `/engines/{id}` | Get engine details | Viewer+ |
| GET | `/engines/{id}/health` | Get engine health metrics | Viewer+ |
| GET | `/engines/{id}/config` | Get engine configuration | Viewer+ |
| PUT | `/engines/{id}/config` | Update engine configuration | Admin |
| GET | `/engines/{id}/logs` | Tail engine logs (last 1000 lines) | Admin |
| POST | `/engines/{id}/restart` | Restart engine | Admin |
| POST | `/engines/{id}/scale` | Scale engine replicas | Admin |

### Strategies

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/strategies` | List all strategies | Trader+ |
| GET | `/strategies/{id}` | Get strategy detail | Trader+ |
| POST | `/strategies` | Deploy new strategy | Trader+ |
| PUT | `/strategies/{id}` | Update strategy config | Trader+ |
| POST | `/strategies/{id}/pause` | Pause strategy | Trader+ |
| POST | `/strategies/{id}/resume` | Resume strategy | Trader+ |
| POST | `/strategies/{id}/stop` | Stop strategy | Trader+ |
| GET | `/strategies/{id}/performance` | Get performance metrics | Trader+ |
| GET | `/strategies/{id}/signals` | Get signal history | Trader+ |

### Risk

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/risk/violations` | Get risk violations | Admin, Trader |
| GET | `/risk/suraksha-scores` | Get Suraksha scores | Admin, Trader, Quant |
| GET | `/risk/rules` | List Kavach risk rules | Admin |
| POST | `/risk/rules` | Create risk rule | Admin |
| PUT | `/risk/rules/{id}` | Update risk rule | Admin |
| DELETE | `/risk/rules/{id}` | Delete risk rule | Admin |
| POST | `/risk/overrides` | Request risk override | Trader |
| PUT | `/risk/overrides/{id}/approve` | Approve override | Admin |

### Audit

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/audit/search` | Full-text search audit events | Auditor, Admin |
| GET | `/audit/timeline` | Get correlated audit timeline | Auditor, Admin |
| GET | `/audit/export` | Export audit data (CSV/JSON/PDF) | Auditor, Admin |
| GET | `/audit/verify` | Verify Merkle tree integrity | Auditor, Admin |

### Incidents

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/incidents` | List all incidents | Admin, Trader |
| GET | `/incidents/{id}` | Get incident detail | Admin, Trader |
| POST | `/incidents` | Create incident | Admin, Trader |
| PUT | `/incidents/{id}` | Update incident | Admin |
| POST | `/incidents/{id}/resolve` | Resolve incident | Admin |

### Users & Admin

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/users` | List all users | Admin |
| POST | `/users` | Create user | Admin |
| PUT | `/users/{id}` | Update user | Admin |
| DELETE | `/users/{id}` | Delete user | Admin |
| GET | `/users/me/preferences` | Get current user preferences | All |
| PUT | `/users/me/preferences` | Update preferences | All |
| GET | `/roles` | List RBAC roles | Admin |
| POST | `/roles` | Create role | Admin |

---

## WebSocket Endpoint

```
wss://narad-gateway/ws?token=<JWT>
```

### Connection Lifecycle

1. **Connect:** Client opens WSS connection with JWT as query parameter
2. **Auth Frame:** Client sends: `{"type": "auth", "token": "<JWT>"}`
3. **Auth ACK:** Server responds: `{"type": "auth_ack", "status": "ok", "session_id": "<uuid>"}`
4. **Subscribe:** Client sends: `{"type": "subscribe", "topics": ["engine.health.*", "market.ticks"]}`
5. **Data Flow:** Server pushes: `{"topic": "...", "timestamp": "...", "payload": {...}}`
6. **Heartbeat:** Client sends `{"type": "ping"}` every 10s; server responds `{"type": "pong"}`
7. **Disconnect:** Server or client closes; client attempts reconnect with exponential backoff

---

## Authentication

All API requests and WebSocket connections use JWT Bearer tokens:

```
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Claims

```json
{
  "sub": "user-123",
  "username": "trader1",
  "role": "trader",
  "permissions": ["strategy.*", "order.read", "market.*"],
  "iat": 1690000000,
  "exp": 1690003600,
  "iss": "dxcc-auth-service"
}
```

### Token Refresh

Tokens expire after 60 minutes. The client automatically refreshes 5 minutes before expiry via `POST /auth/refresh`. If the refresh fails, the user is redirected to the login page.

---

> **Next:** See [10-database.md](10-database.md) for database schema documentation.
