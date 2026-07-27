# 19 â€” Integration Guide

**Version:** 2.0.0 | **Owner:** Security | **Last Updated:** 2026-07-24

---

## Overview

Every service in the Algo-IQ ecosystem MUST integrate with Suraksha for authentication, authorization, and secrets management. This guide explains the required integration patterns.

## Service Registration

Before integrating, register your service with Suraksha:

```bash
suraksha-cli register-service \
  --name "my-engine" \
  --type "engine" \
  --owner "ai-team" \
  --default-role "my-engine.consumer.read"
```

This creates:
- A service account in Vault with client credentials
- Default RBAC roles for the service
- A secrets path: `secret/services/my-engine`

## SDK Integration (Node.js)

```bash
npm install @algoiq/suraksha-sdk
```

```javascript
const suraksha = require('@algoiq/suraksha-sdk');

// Initialize (fetches secrets)
await suraksha.init({
  serviceName: 'my-engine',
  clientId: process.env.SURAKSHA_CLIENT_ID,
  clientSecret: process.env.SURAKSHA_CLIENT_SECRET
});

// Get secrets
const { redisPassword, pgPassword } = await suraksha.getSecrets();

// Get JWT for calling other services
const token = await suraksha.getAccessToken({ audience: 'ganesh' });

// Express middleware - authenticate incoming requests
app.use(suraksha.authMiddleware());

// Check permission
app.get('/admin', suraksha.requirePermission('admin:access'), (req, res) => {
  res.json({ message: 'Admin access granted' });
});
```

## Manual JWT Validation

Services that don't use the SDK can validate JWTs locally:

```javascript
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const client = jwksClient({
  jwksUri: 'https://suraksha.algoiq.io/.well-known/jwks.json',
  cache: true,
  cacheMaxAge: 3600000
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

function validateToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, getKey, {
      issuer: 'suraksha.algoiq.io',
      audience: 'my-engine'
    }, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });
}
```

## Secrets Fetch Pattern

```javascript
// On startup
const secrets = await fetch(
  'https://suraksha.algoiq.io/api/v1/secrets/my-engine',
  { headers: { Authorization: `Bearer ${serviceToken}` } }
).then(r => r.json());

// Cache locally and reconnect to DBs
redis.connect({ password: secrets.redis_password });
pg.connect({ password: secrets.pg_password });
```

## Testing

- **Sandbox**: `https://suraksha-sandbox.algoiq.io` â€” no real Vault, test secrets only.
- **Staging**: Full integration with staging Vault and databases.

## Common Integration Issues

| Issue | Solution |
|---|---|
| 401 on service call | Refresh your service token; tokens expire every 15 min |
| Missing permission | Check role assignments in Suraksha dashboard |
| Vault read timeout | Suraksha SDK caches secrets locally; check Vault health |
| JWKS fetch failure | Services cache JWKS for 1 hour; check Suraksha health |
