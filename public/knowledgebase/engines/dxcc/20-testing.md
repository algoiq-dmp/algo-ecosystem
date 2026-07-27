# DXCC — Testing Strategy

> **Version:** 2.0.0 | **Status:** Draft | **Owner:** DXCC Team | **Last Updated:** 2026-07-24

---

## Testing Pyramid

```
           /\
          /  \
         / E2E\          Playwright — Critical user journeys
        /------\
       /  Int.  \        Vitest + MSW — Component integration
      /----------\
     /   Unit     \      Vitest — Functions, hooks, stores
    /--------------\
```

---

## Unit Testing (Vitest)

### Test Coverage Targets

| Category | Target | Current |
|----------|--------|---------|
| Utility functions | 95% | 97% |
| Zustand stores | 90% | 92% |
| React hooks | 85% | 88% |
| API client functions | 90% | 91% |
| Narad message parser | 95% | 96% |
| Overall line coverage | 80% | 84% |

### Example: Store Unit Test

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { useEngineStore } from './engineStore';

describe('EngineStore', () => {
  beforeEach(() => {
    useEngineStore.setState({ engines: new Map() });
  });

  it('should update engine health on Narad event', () => {
    const event = {
      topic: 'engine.health.suchak',
      payload: {
        engine_id: 'suchak',
        cpu_percent: 45.2,
        memory_mb: 1024,
        status: 'healthy'
      }
    };

    useEngineStore.getState().updateEngineHealth(event);

    const engine = useEngineStore.getState().engines.get('suchak');
    expect(engine?.health.cpu_percent).toBe(45.2);
    expect(engine?.health.status).toBe('healthy');
  });

  it('should mark engine as unresponsive after 30s no heartbeat', async () => {
    vi.useFakeTimers();

    useEngineStore.getState().updateEngineHealth({
      topic: 'engine.health.suchak',
      payload: { engine_id: 'suchak', status: 'healthy' }
    });

    vi.advanceTimersByTime(31000);

    const engine = useEngineStore.getState().engines.get('suchak');
    expect(engine?.health.status).toBe('unresponsive');

    vi.useRealTimers();
  });
});
```

### Example: Hook Unit Test

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useNaradSubscription } from './useNaradSubscription';
import { NaradProvider } from './NaradProvider';

describe('useNaradSubscription', () => {
  it('should subscribe to topic on mount and unsubscribe on unmount', () => {
    const mockWs = { send: vi.fn() };
    const wrapper = ({ children }) => (
      <NaradProvider ws={mockWs}>{children}</NaradProvider>
    );

    const { unmount } = renderHook(
      () => useNaradSubscription('market.ticks'),
      { wrapper }
    );

    expect(mockWs.send).toHaveBeenCalledWith(
      expect.stringContaining('market.ticks')
    );

    unmount();

    expect(mockWs.send).toHaveBeenCalledWith(
      expect.stringContaining('unsubscribe')
    );
  });
});
```

---

## Integration Testing (Vitest + MSW)

Mock Service Worker (MSW) intercepts REST API calls for integration tests:

```typescript
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const server = setupServer(
  http.get('https://kraken-api-gateway.internal/api/v2/engines', () => {
    return HttpResponse.json({
      engines: [
        { id: 'suchak', name: 'Suchak', status: 'healthy' },
        { id: 'ganesh', name: 'Ganesh', status: 'healthy' }
      ]
    });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it('should render engine list from API', async () => {
  render(<EngineRegistry />);

  await waitFor(() => {
    expect(screen.getByText('Suchak')).toBeInTheDocument();
    expect(screen.getByText('Ganesh')).toBeInTheDocument();
  });
});
```

---

## End-to-End Testing (Playwright)

```typescript
import { test, expect } from '@playwright/test';

test.describe('Executive Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://dxcc-staging.internal');
    await page.fill('[name="username"]', 'trader1');
    await page.fill('[name="password"]', 'test-password');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
  });

  test('should display system health summary', async ({ page }) => {
    await expect(page.locator('.system-health-grid')).toBeVisible();
    await expect(page.locator('.engine-status.suchak')).toHaveClass(/healthy/);
  });

  test('should navigate to engine detail on click', async ({ page }) => {
    await page.click('.engine-card[data-engine="suchak"]');
    await expect(page).toHaveURL('**/engines/suchak');
    await expect(page.locator('.engine-health-tab')).toBeVisible();
  });

  test('should drill down from P&L widget to portfolio', async ({ page }) => {
    await page.click('.pnl-widget');
    await expect(page).toHaveURL('**/portfolio');
    await expect(page.locator('.pnl-breakdown')).toBeVisible();
  });
});
```

### E2E Test Scenarios

| Scenario | Module | Criticality |
|----------|--------|------------|
| Login with SSO + MFA | Auth | Critical |
| Dashboard loads with all widgets | Executive Dashboard | Critical |
| Engine health matrix updates in real-time | Engine Registry | Critical |
| Navigate to engine detail and view all tabs | Engine Registry | High |
| Deploy strategy via wizard | Strategy Command | Critical |
| View order lifecycle | Execution Monitor | High |
| Search audit records | Audit Center | High |
| Create incident from alert | Incident Management | High |
| Export audit report as PDF | Audit Center | Medium |
| Customize dashboard layout | Executive Dashboard | Medium |
| Toggle dark/light theme | Settings | Low |

---

## Load Testing

```bash
# Artillery load test for WebSocket connections
artillery run load-tests/websocket.yml

# k6 load test for REST API
k6 run load-tests/api.js
```

### Load Test Scenarios

| Scenario | Target | Duration |
|----------|--------|----------|
| 50 concurrent WS connections | Stable connection, all receiving data | 10 minutes |
| 100 concurrent REST API calls/sec | P95 < 200ms | 5 minutes |
| 100K row AG Grid rendering | <500ms render, smooth scroll | — |
| 50K msg/sec WebSocket throughput | No message loss, <100ms latency | 10 minutes |

---

## Accessibility Testing

```bash
# axe-core automated checks
npx playwright test --config=playwright.a11y.config.ts

# Manual testing checklist
- Keyboard navigation through all modules
- Screen reader compatibility (NVDA / VoiceOver)
- High-contrast mode verification
- Focus indicators visible on all interactive elements
```

### WCAG 2.1 AA Compliance Checklist

- [ ] Color contrast ratio >= 4.5:1 for text
- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] ARIA roles on custom components
- [ ] Skip-to-content link
- [ ] Keyboard-navigable data tables
- [ ] Status messages announced by screen readers
- [ ] Error messages linked to inputs via aria-describedby

---

## Parikshak Certification

Before release, DXCC must pass the Parikshak testing certification:

### Certification Gates

| Gate | Criteria | Blocking |
|------|----------|----------|
| Unit Test Coverage | >= 80% overall | Yes |
| E2E Critical Paths | All passing | Yes |
| Accessibility Score | >= 90 on axe-core | Yes |
| Performance Budget | LCP < 2.5s, FID < 100ms | Yes |
| Security Scan | No HIGH or CRITICAL findings | Yes |
| Load Test | 50 concurrent users stable | No |
| Cross-Browser | Chrome, Firefox, Edge | No |

### UAT Checklist

All 20 modules must be verified by a human tester:

1. Executive Dashboard — All widgets load, drill-down works
2. Engine Registry — Search, filter, detail page, health timeline
3. Market Operations — Watchlist, OHLC charts, depth chart, tick tape
4. Intelligence Center — AI chat, anomaly detection, knowledge Q&A
5. Strategy Command — List, detail, deploy wizard, comparison
6. Portfolio Command — Position matrix, P&L, exposure, margin
7. Risk Center — Heatmap, Suraksha scores, violation feed, circuit breakers
8. Execution Monitor — Order blotter, lifecycle view, latency monitor
9. Audit Center — Search, timeline, export, integrity verification
10. Infrastructure Monitor — K8s, databases, backups, certificates
11. API Gateway Monitor — Traffic, consumers, routes, rate limits
12. Notification Center — Inbox, rules, silences, channels
13. Incident Management — Create, timeline, resolve, post-mortem
14. Knowledge Center — Browse, search, API reference, tutorials
15. Administration — Users, roles, API keys, system settings
16. AI Operations — Coach health, usage, prompts, costs
17. DevOps — Pipelines, DORA metrics, ArgoCD, deployments
18. Analytics Center — Reports, custom queries, scheduled exports
19. Ecosystem Timeline — Event stream, filters, correlation, replay
20. Strategy Builder — IDE, signal preview, version control, simulation

---

> **Next:** See [21-troubleshooting.md](21-troubleshooting.md) for common issues and solutions.
