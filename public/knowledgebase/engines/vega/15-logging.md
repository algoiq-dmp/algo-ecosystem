# 15 — Logging Standards

**Version:** 6.3.0 | **Owner:** Execution | **Last Updated:** 2026-07-24

---

## Logging Philosophy

Vega uses **structured JSON logging** exclusively. No plaintext or printf-style logs. Every log entry is a self-contained JSON object that can be parsed, indexed, and queried by the Elasticsearch/Kibana stack.

---

## Log Levels

| Level | Usage | Example |
|---|---|---|
| `fatal` | Unrecoverable error, process exit imminent | Database connection lost irrecoverably |
| `error` | Operation failed, requires attention | Order validation failed, FIX message rejected |
| `warn` | Potential issue, degraded operation | FIX heartbeat missed (1st), approaching rate limit |
| `info` | Normal operational events | Order state transition, broker connected |
| `debug` | Detailed troubleshooting information | FIX message hex dump, full request payload |
| `trace` | Extremely verbose, step-by-step | Every FIX tag parsed, every Redis GET |

---

## Standard Log Schema

Every log entry MUST contain these required fields:

```json
{
  "timestamp": "ISO 8601 with timezone",
  "level": "fatal|error|warn|info|debug|trace",
  "component": "TalkStrategyAPI|TalkStrategyApp|OrderProcessor|BrokerIntegration|KillSwitch|MQBridge|CredentialManager|AuditLogger",
  "correlationId": "UUID from incoming request (if available)",
  "message": "Human-readable description"
}
```

Optional context fields:

```json
{
  "orderId": "Vega order ID",
  "brokerOrderId": "Broker-assigned order ID",
  "signalId": "Strategy signal ID",
  "userId": "User ID",
  "broker": "XTS|Greeksoft",
  "symbol": "Trading symbol",
  "previousState": "Previous order state",
  "newState": "New order state",
  "durationMs": 1.23,
  "fixMessageType": "D|F|G|8|0|A",
  "fixSeqNum": 12345,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Price outside allowed band",
    "stack": "Error stack trace (debug only)"
  }
}
```

---

## Component-Specific Logging

### TalkStrategy API

```javascript
// Request received
logger.info('API request received', {
  method: 'POST',
  path: '/api/v1/orders',
  userId: 'USR-0042',
  signalId: 'SIG-7f3a2b1c',
  correlationId: req.correlationId
});

// Rate limit hit
logger.warn('Rate limit exceeded', {
  userId: 'USR-0042',
  tier: 'standard',
  currentRate: 501,
  limit: 500,
  correlationId: req.correlationId
});

// Authentication failure
logger.error('Invalid HMAC signature', {
  userId: 'USR-0042',
  ip: req.ip,
  timestampDriftMs: 7000,
  correlationId: req.correlationId
});
```

### Order Processor

```javascript
// State transition
logger.info('Order state transition', {
  orderId: 'VEGA-20260724-000001-AB12',
  previousState: 'VALIDATED',
  newState: 'ROUTED',
  durationMs: 1.2,
  correlationId
});

// Idempotency hit
logger.info('Duplicate order detected', {
  orderId: existingOrderId,
  signalId: 'SIG-7f3a2b1c',
  idempotencyKey: 'IDEM-7f3a2b1c-1765432100',
  correlationId
});
```

### Broker Integration

```javascript
// FIX session event
logger.info('FIX session connected', {
  broker: 'XTS',
  senderCompId: 'VEGA-PROD-01',
  targetCompId: 'XTS-BROKER',
  heartbeatSec: 30
});

// FIX message sent (debug only)
logger.debug('FIX message sent', {
  broker: 'XTS',
  msgType: 'D',
  msgSeqNum: 12345,
  msgHex: '8=FIX.4.4...'
});

// Broker rejection
logger.error('Broker rejected order', {
  orderId: 'VEGA-20260724-000001-AB12',
  broker: 'XTS',
  brokerOrderId: 'XT-20260724-998877',
  rejectionReason: 'RMS:Blocked for nse_fo RELIANCE',
  fixMsgType: '8',
  correlationId
});
```

### Kill Switch

```javascript
// Activation (CRITICAL — triggers PagerDuty)
logger.fatal('KILL SWITCH ACTIVATED', {
  userId: 'USR-0042',
  drawdownPct: 0.0152,
  thresholdPct: 0.015,
  runningPnL: -152000.00,
  totalMargin: 10000000.00,
  ordersCancelled: 12
});
```

---

## PII & Security in Logs

### REDACTED / Never Logged

| Data Type | Policy |
|---|---|
| API secret keys | NEVER logged |
| Passwords | NEVER logged |
| Broker credentials (plaintext) | NEVER logged |
| Full credit/debit card numbers | NEVER logged |
| PAN numbers | NEVER logged |
| Full account numbers | Mask to last 4 digits |

### Allowed with Masking

```javascript
logger.info('Credential rotation completed', {
  broker: 'XTS',
  credentialId: 'cred-1234',   // OK: internal ID
  accountLast4: '8812',         // OK: last 4 only
  // NEVER: accountNumber: 'XT-ACCT-8812-BANK123'
});
```

---

## Log Transport Configuration

### Production (`config.json`)

```json
{
  "logging": {
    "level": "info",
    "format": "json",
    "outputs": ["stdout", "elasticsearch"],
    "elasticsearch": {
      "hosts": ["es1.algoiq.internal:9200", "es2.algoiq.internal:9200"],
      "index": "vega-logs-%{+yyyy.MM.dd}",
      "bufferSize": 100,
      "flushIntervalMs": 5000
    },
    "file": {
      "enabled": false
    }
  }
}
```

### Development (`config.json`)

```json
{
  "logging": {
    "level": "debug",
    "format": "pretty",
    "outputs": ["stdout"],
    "elasticsearch": { "enabled": false }
  }
}
```

---

## Log Rotation (FIX Message Logs)

FIX message logs are stored as flat files for regulatory compliance:

```
/var/log/vega/fix/
├── xts/
│   ├── FIX.4.4-VEGA-PROD-01-XTS-BROKER-20260724.messages.current.log
│   └── FIX.4.4-VEGA-PROD-01-XTS-BROKER-20260723.messages.log.gz
└── greeksoft/
    ├── FIX.5.0SP2-VEGA-PROD-01-GREEKSOFT-20260724.messages.current.log
    └── FIX.5.0SP2-VEGA-PROD-01-GREEKSOFT-20260723.messages.log.gz
```

Rotation policy:
- Rotate daily at midnight IST
- Compress rotated files with gzip
- Retain 30 days online, archive to S3 after
- Never delete — 5-year regulatory retention

---

## Query Examples (Kibana)

```
# Find all events for a specific order
correlationId: "b3f2c1d4-8a6e-4f3b-9c2d-1e5f7a8b3c4d"

# All rejected orders in last hour
component: "OrderProcessor" AND newState: "REJECTED" AND @timestamp > now-1h

# FIX disconnection events
component: "BrokerIntegration" AND message: "FIX session disconnected"

# Slow order processing (>100ms)
component: "OrderProcessor" AND durationMs > 100

# Kill switch events (last 7 days)
component: "KillSwitch" AND level: "fatal" AND @timestamp > now-7d
```
