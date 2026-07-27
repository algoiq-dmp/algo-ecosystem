# DXCC — Performance Engineering

> **Version:** 2.0.0 | **Status:** Draft | **Owner:** DXCC Team | **Last Updated:** 2026-07-24

---

## Performance Targets

### UI Latency

| Metric | Target | Measurement |
|--------|--------|-------------|
| Widget DOM update (from Narad event) | <100ms | `performance.now()` delta |
| Initial page load (Executive Dashboard) | <2 seconds | Lighthouse / Web Vitals |
| Subsequent navigation (client-side) | <300ms | Route change to render complete |
| Largest Contentful Paint (LCP) | <2.5 seconds | Web Vitals |
| First Input Delay (FID) | <100ms | Web Vitals |
| Cumulative Layout Shift (CLS) | <0.1 | Web Vitals |
| Time to Interactive (TTI) | <3 seconds | Lighthouse |

### WebSocket Throughput

| Metric | Target | Description |
|--------|--------|-------------|
| Max messages/sec (single connection) | 50,000 | Narad -> DXCC WS |
| Message parsing latency | <1ms | JSON parse + validation |
| State update batching | 16ms intervals | Aligned with requestAnimationFrame |
| Heartbeat round-trip | <20ms | Ping -> Pong latency |

### Table Rendering (AG Grid)

| Metric | Target | Description |
|--------|--------|-------------|
| Row rendering (10K rows) | <200ms | Initial render |
| Row rendering (100K rows) | <500ms | With virtual scrolling |
| Scroll performance | 60 FPS | Smooth scrolling at any row count |
| Sort (100K rows) | <1 second | Client-side sort |
| Filter (100K rows) | <500ms | Client-side filter |

### Memory

| Metric | Target | Description |
|--------|--------|-------------|
| Browser tab memory | <500MB | Steady state with all modules loaded |
| JavaScript heap | <200MB | After garbage collection |
| DOM nodes | <30,000 | Total DOM nodes in page |
| WebSocket buffer | <50MB | Message buffer in memory |

### API Performance

| Metric | Target | Description |
|--------|--------|-------------|
| REST API P50 latency | <50ms | Simple read endpoints |
| REST API P95 latency | <200ms | All endpoints |
| REST API P99 latency | <500ms | Complex queries (audit search) |
| Request timeout | 30 seconds | Maximum before client aborts |

---

## Optimization Strategies

### React Rendering Optimization

```typescript
// Use React.memo for pure components
const MetricCard = React.memo(function MetricCard({ value, label }: Props) {
  return (
    <div className="metric-card">
      <span className="value">{value}</span>
      <span className="label">{label}</span>
    </div>
  );
});

// Use useMemo for expensive computations
function StrategyPerformanceChart({ trades }: Props) {
  const chartData = useMemo(() => {
    return aggregateTradesByHour(trades);
  }, [trades]);

  return <LineChart data={chartData} />;
}

// Use useCallback for stable function references
function OrderBlotter({ onOrderClick }: Props) {
  const handleClick = useCallback((orderId: string) => {
    onOrderClick(orderId);
  }, [onOrderClick]);

  return <AgGrid onRowClick={handleClick} />;
}
```

### AG Grid Virtual Scrolling

```typescript
const gridOptions = {
  rowModelType: 'infinite',
  cacheBlockSize: 100,
  maxBlocksInCache: 10,
  infiniteInitialRowCount: 1,
  datasource: {
    getRows: (params: IGetRowsParams) => {
      // Server-side fetching for large datasets
      fetchOrderRows(params.startRow, params.endRow)
        .then(data => params.successCallback(data.rows, data.totalCount));
    }
  }
};
```

### Zustand Store Optimization

```typescript
// Use selectors to prevent unnecessary re-renders
const engineHealth = useEngineStore(state => state.engines.get('suchak')?.health);

// Instead of:
// const engines = useEngineStore(state => state.engines); // Re-renders on any engine change

// Batch updates within animation frame
function updateEngineHealth(event: NaradEvent) {
  requestAnimationFrame(() => {
    useEngineStore.setState(state => ({
      engines: new Map(state.engines).set(event.engineId, {
        ...state.engines.get(event.engineId),
        health: event.payload
      })
    }));
  });
}
```

### Lazy Loading Modules

```typescript
// Route-based code splitting
const StrategyCommand = lazy(() => import('./modules/StrategyCommand'));
const AuditCenter = lazy(() => import('./modules/AuditCenter'));
const AnalyticsCenter = lazy(() => import('./modules/AnalyticsCenter'));

// Suspense boundary with loading skeleton
function App() {
  return (
    <Suspense fallback={<ModuleSkeleton />}>
      <Routes>
        <Route path="/strategy" element={<StrategyCommand />} />
        <Route path="/audit" element={<AuditCenter />} />
        <Route path="/analytics" element={<AnalyticsCenter />} />
      </Routes>
    </Suspense>
  );
}
```

---

## Chart Optimization (Lightweight Charts)

```typescript
// Limit data points for performance
function OHLCChart({ data }: Props) {
  const visibleData = useMemo(() => {
    // Only pass data within visible time range
    const range = getVisibleTimeRange();
    return data.filter(d => d.time >= range.start && d.time <= range.end);
  }, [data, timeRange]);

  // Use canvas rendering; disable animations for real-time updates
  const chartOptions = {
    crosshair: { mode: 0 }, // Disable crosshair during high-frequency updates
    grid: { vertLines: { visible: false } }, // Reduce draw calls
    timeScale: { visible: true, timeVisible: true },
    handleScroll: { vertTouchDrag: false } // Prevent accidental zoom
  };

  return <LightweightCharts options={chartOptions} data={visibleData} />;
}
```

---

## WebSocket Throttling

```typescript
class MessageThrottler {
  private queues = new Map<string, any[]>();
  private timer: number | null = null;

  enqueue(topic: string, message: any) {
    if (!this.queues.has(topic)) {
      this.queues.set(topic, []);
    }
    const queue = this.queues.get(topic)!;

    // For high-frequency topics, keep only the latest value
    if (isHighFrequency(topic)) {
      queue[0] = message; // Replace
    } else {
      queue.push(message);
    }

    this.scheduleFlush();
  }

  private scheduleFlush() {
    if (this.timer) return;
    this.timer = requestAnimationFrame(() => {
      this.flush();
      this.timer = null;
    });
  }

  private flush() {
    for (const [topic, messages] of this.queues) {
      updateStore(topic, messages);
    }
    this.queues.clear();
  }
}
```

---

## Bundle Size Optimization

| Technique | Savings |
|-----------|---------|
| Tree shaking (ESM imports) | ~30% reduction |
| Code splitting (lazy routes) | ~50% smaller initial bundle |
| AG Grid Enterprise (modular) | ~200KB vs full import |
| Lightweight Charts (vs D3) | ~150KB saved |
| Image optimization (WebP, lazy) | ~80% smaller image payload |
| Gzip/Brotli compression | ~70% transfer size reduction |

### Target Bundle Sizes

| Bundle | Size (gzipped) |
|--------|---------------|
| Initial (login + dashboard) | <200 KB |
| Vendor chunk | <300 KB |
| Per-module chunks | <50 KB each |
| CSS total | <30 KB |

---

## Backend Optimization

```go
// Connection pooling
db.SetMaxOpenConns(25)
db.SetMaxIdleConns(10)
db.SetConnMaxLifetime(5 * time.Minute)

// Prepared statement cache
stmt, _ := db.Prepare("SELECT * FROM users WHERE id = $1")
defer stmt.Close()

// Redis pipelining for batch operations
pipe := redisClient.Pipeline()
for _, key := range keys {
    pipe.Get(ctx, key)
}
results, _ := pipe.Exec(ctx)
```

---

> **Next:** See [20-testing.md](20-testing.md) for testing strategy and certification requirements.
