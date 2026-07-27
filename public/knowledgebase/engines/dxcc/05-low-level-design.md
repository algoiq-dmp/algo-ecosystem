# DXCC — Low-Level Design

> **Version:** 2.0.0 | **Status:** Draft | **Owner:** DXCC Team | **Last Updated:** 2026-07-24

---

## React Component Architecture

```
<App>
  <AuthProvider>
    <NaradProvider>
      <Layout>
        <Sidebar />
        <Header>
          <UserMenu />
          <NotificationBadge />
          <GlobalSearch />
        </Header>
        <MainContent>
          <Routes>
            <Route path="/" element={<ExecutiveDashboard />} />
            <Route path="/engines" element={<EngineRegistry />} />
            <Route path="/engines/:id" element={<EngineDetail />} />
            <Route path="/market" element={<MarketOperations />} />
            <Route path="/intelligence" element={<IntelligenceCenter />} />
            <Route path="/strategy" element={<StrategyCommand />} />
            <Route path="/portfolio" element={<PortfolioCommand />} />
            <Route path="/risk" element={<RiskCenter />} />
            <Route path="/execution" element={<ExecutionMonitor />} />
            <Route path="/audit" element={<AuditCenter />} />
            <Route path="/infrastructure" element={<InfrastructureMonitor />} />
            <Route path="/api-gateway" element={<ApiGatewayMonitor />} />
            <Route path="/notifications" element={<NotificationCenter />} />
            <Route path="/incidents" element={<IncidentManagement />} />
            <Route path="/knowledge" element={<KnowledgeCenter />} />
            <Route path="/admin" element={<Administration />} />
            <Route path="/ai-ops" element={<AIOperations />} />
            <Route path="/devops" element={<DevOps />} />
            <Route path="/analytics" element={<AnalyticsCenter />} />
            <Route path="/timeline" element={<EcosystemTimeline />} />
          </Routes>
        </MainContent>
      </Layout>
    </NaradProvider>
  </AuthProvider>
</App>
```

---

## Zustand Stores

### Engine Store

```typescript
interface EngineStore {
  engines: Map<string, Engine>;
  selectedEngineId: string | null;
  fetchEngines: () => Promise<void>;
  selectEngine: (id: string) => void;
  updateEngineHealth: (event: NaradHealthEvent) => void;
}
```

### Narad Store

```typescript
interface NaradStore {
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
  subscribedTopics: Set<string>;
  subscribe: (topic: string) => void;
  unsubscribe: (topic: string) => void;
  messageBuffer: Map<string, NaradMessage[]>;
}
```

### User Store

```typescript
interface UserStore {
  user: User | null;
  role: 'admin' | 'trader' | 'quant' | 'auditor' | 'viewer';
  permissions: Permission[];
  preferences: UserPreferences;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
}
```

### Dashboard Store

```typescript
interface DashboardStore {
  layout: WidgetLayout[];
  addWidget: (widget: WidgetConfig) => void;
  removeWidget: (id: string) => void;
  moveWidget: (id: string, position: Position) => void;
  persistLayout: () => Promise<void>;
}
```

---

## WebSocket Data Flow

```
[Narad Message] --> [NaradProvider WebSocket]
                        |
                        v
              [Message Router]
              /       |       \
             v        v        v
      [Narad Store] [Buffer] [Heartbeat]
             |          |
             v          v
    [Topic Subscribers] [Deduplication]
             |
             v
    [Zustand Store Update]
             |
             v
    [React Re-render] --> [UI Widget Update]
```

### NaradProvider Implementation

The `NaradProvider` is the root-level context that manages the WebSocket lifecycle:

1. **Connect:** On mount, establish WSS connection to Narad WS Gateway with JWT token
2. **Authenticate:** Send auth frame; wait for ACK before subscribing
3. **Subscribe:** Register topic interests based on current route and user role
4. **Receive:** Route incoming messages to appropriate stores via topic mapping
5. **Heartbeat:** Send ping every 10s; if no pong in 5s, mark connection degraded
6. **Reconnect:** On disconnect, exponential backoff (1s -> 2s -> 3s -> 3s...); max reconnect window 30s
7. **Fallback:** If no reconnection in 5s, switch to REST polling mode
8. **Teardown:** On unmount, close WebSocket cleanly

### Message Format

```json
{
  "topic": "engine.health.suchak",
  "timestamp": "2026-07-24T09:30:01.123Z",
  "payload": {
    "engine_id": "suchak",
    "cpu_percent": 45.2,
    "memory_mb": 1024,
    "latency_p95_ms": 12.3,
    "status": "healthy",
    "uptime_seconds": 86400
  },
  "schema_version": "1.0.0",
  "message_id": "uuid-v4"
}
```

---

## REST API Fallback Pattern

```typescript
function useDxccData<T>(
  endpoint: string,
  options?: { enabled?: boolean; refetchInterval?: number }
) {
  // Primary: useApiQuery from React Query for REST endpoint
  const query = useApiQuery(endpoint, options);

  // Secondary: Fallback to polling mode if WS disconnected
  useEffect(() => {
    if (connectionStatus === 'disconnected') {
      query.refetch();
    }
  }, [connectionStatus]);

  return query;
}
```

When the WebSocket connection is down:
1. Widget displays a "Reconnecting..." banner
2. Data refreshes via REST polling every 5 seconds
3. Stale data indicator appears on widgets older than 10 seconds
4. On WebSocket reconnect, polling stops and real-time flow resumes

---

## Plugin SDK Hooks

### `useNaradSubscription`

```typescript
function useNaradSubscription<T>(
  topic: string,
  filter?: (msg: T) => boolean
): { data: T | null; isLive: boolean }
```

Subscribes to a Narad topic when the component mounts. Automatically unsubscribes on unmount. Returns the latest message matching the optional filter, plus a boolean indicating whether the data is live (WebSocket) or stale (REST).

### `useApiQuery`

```typescript
function useApiQuery<T>(
  endpoint: string,
  params?: Record<string, string>
): UseQueryResult<T>
```

Wraps React Query's `useQuery` with automatic Kraken API Gateway routing, JWT header injection, and error normalization. Supports caching, background refetch, and optimistic updates.

### `useEngineHealth`

```typescript
function useEngineHealth(engineId: string): {
  status: 'healthy' | 'degraded' | 'unresponsive' | 'unknown';
  metrics: EngineMetrics;
  lastHeartbeat: Date;
}
```

Combines Narad subscription to `engine.health.<engineId>` with REST fallback to `/api/engines/<id>/health`. Provides a unified health view regardless of data source.

### `useUserPermissions`

```typescript
function useUserPermissions(): {
  role: UserRole;
  permissions: Permission[];
  can: (action: string, resource: string) => boolean;
  isAdmin: boolean;
  isTrader: boolean;
  isQuant: boolean;
  isAuditor: boolean;
}
```

Provides the current user's role and permissions with a utility function `can()` for declarative permission checks in UI rendering.

---

## UI Conditional Rendering Pattern

```tsx
function StrategyDeployButton() {
  const { can } = useUserPermissions();

  if (!can('strategy.deploy', 'strategies')) {
    return null;
  }

  return <Button onClick={handleDeploy}>Deploy Strategy</Button>;
}
```

Server-side validation is always performed on the API. Client-side checks are for UX only.

---

> **Next:** See [06-components.md](06-components.md) for detailed documentation of all 20 DXCC modules.
