# 02 — Business Requirements

**Version:** 6.3.0 | **Owner:** Execution | **Last Updated:** 2026-07-24

---

## BRQ-001: Multi-Broker Order Routing

Vega MUST support concurrent connectivity to multiple brokers and route orders based on user configuration, instrument availability, and broker health status.

### Acceptance Criteria

- User account mapped to one or more brokers via credential manager
- Order routing decision made at TalkStrategy App layer based on user-broker mapping
- Broker failover occurs within 2 seconds if primary broker session disconnects
- Order state preserved across failover; no duplicate orders sent

---

## BRQ-002: Kill Switch Enforcement

Vega MUST implement a hard circuit-breaker (Layer 3 Kill Switch) that halts all order flow when running margin drawdown exceeds 1.50%.

### Acceptance Criteria

- Kill Switch monitors per-user running P&L in real-time via Redis pub/sub
- Activation latency < 100 ms from breach detection to order halt
- ALL open orders cancelled upon kill switch activation
- Manual reset required by Risk team to resume trading
- Kill switch events generate PagerDuty alerts and audit entries

---

## BRQ-003: Complete Order Audit Trail

Vega MUST produce an immutable, timestamped record of every order state transition for regulatory compliance.

### Acceptance Criteria

- 100% of order events written to audit log before acknowledgment returned
- Audit log stored in append-only database (TimescaleDB)
- Each event includes: order ID, timestamp, state, user, broker, FIX messages
- Retention period: 7 years online, indefinite cold storage
- Query API for compliance team with date-range and user filters

---

## BRQ-004: Broker Credential Lifecycle

Vega MUST manage broker credentials centrally with automated rotation and secure storage.

### Acceptance Criteria

- Credentials encrypted at rest using AES-256-GCM
- Session tokens rotated daily pre-market (08:30 IST)
- Expired credentials flagged 24 hours before expiry
- Credential access logged; audit trail for all credential reads
- No plaintext credentials in logs, config files, or environment variables

---

## BRQ-005: FIX Protocol Compliance

Vega MUST communicate with brokers using FIX protocol versions 4.4 and 5.0 SP2 as per broker specifications.

### Acceptance Criteria

- FIX engine supports standard session management (Logon, Heartbeat, Logout, ResendRequest)
- Sequence number synchronization on reconnect
- Support for all FIX message types required by XTS and Greeksoft broker specs
- FIX message validation before transmit (required tags, valid values)
- FIX session state exposed via health API for monitoring

---

## BRQ-006: Order Modification & Cancellation

Vega MUST support mid-flight modification and cancellation of orders before exchange execution.

### Acceptance Criteria

- Order replacement (Cancel/Replace) supported with modify reason code
- Cancellation request propagated to broker within 50 ms
- Cancellation confirmation tracked; re-attempt on timeout
- Modified orders retain original order ID with incrementing version number
- Partially filled orders support remainder cancellation

---

## BRQ-007: Rate Limiting & Fair Usage

Vega MUST enforce rate limits per user to prevent system overload and ensure fair resource allocation.

### Acceptance Criteria

- Configurable rate limit per user (default: 500 orders/sec)
- Rate limit exceeded returns HTTP 429 with Retry-After header
- Rate limit counters reset on 1-second rolling window
- VIP user tiers with elevated limits configurable
- Rate limit metrics exported to monitoring stack

---

## BRQ-008: High Availability Deployment

Vega MUST be deployable in a highly available configuration with no single point of failure.

### Acceptance Criteria

- Active-active deployment across minimum 2 data centers
- Database replication with automatic failover (< 5 seconds)
- Stateless components support horizontal scaling
- Health check endpoints for load balancer integration
- Zero-downtime deployments via blue-green strategy
