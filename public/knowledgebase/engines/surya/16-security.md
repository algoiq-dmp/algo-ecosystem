# 16 — Security Design

**Version:** 2.4.1 | **Owner:** Operations | **Last Updated:** 2026-07-24

---

## Security Architecture

Surya handles sensitive exchange credentials and serves as the gateway for all exchange data ingress. Security is designed around the principle that **only Surya has extranet access** — no other engine can bypass this control.

---

## Extranet Credential Management

### NSE Authentication (X.509 Client Certificate)

```
[HashiCorp Vault — PKI Engine]
  └── /pki/nse-extranet/
      ├── Certificate: CN=ALGOIQ-SURYA-PROD
      ├── Private Key: RSA 2048-bit
      ├── CA Chain: NSE Root CA → NSE Intermediate CA
      └── Rotation: Annual (NSE mandated)

[Deployment]
  └── Mounted as Kubernetes Secret → /etc/surya/certs/nse/
      ├── tls.crt  (mode: 0400, owner: surya)
      ├── tls.key  (mode: 0400, owner: surya)
      └── ca.crt   (mode: 0444)
```

### BSE Authentication (API Key)

```
[HashiCorp Vault — KV v2]
  └── /secret/surya/bse/
      ├── api-key: "bsk-xxxx" (rotated every 30 days)
      └── whitelisted-ips: ["10.0.20.10", "10.0.20.11"]

[Deployment]
  └── Injected as environment variable: BSE_API_KEY
      └── Never stored in config files or logs
```

---

## Network Security

### The Core Rule

```
+------------------------------------------------------+
|  ONLY Surya has outbound access to exchange extranet  |
|  Firewall rule (ALGO-IQ CORE → NSE/BSE Extranet):     |
|    ACTION: DENY (default)                              |
|    EXCEPT: Source IP = Surya VLAN (10.0.20.0/24)      |
+------------------------------------------------------+
```

### Firewall Enforcement

| Source | Destination | Port | Action | Audit |
|---|---|---|---|---|
| Surya VLAN | NSE Extranet IPs | 443 | ALLOW | Logged |
| Surya VLAN | BSE MFTP IPs | 443 | ALLOW | Logged |
| ANY (non-Surya) | NSE Extranet | ANY | DENY | Alerted |
| ANY (non-Surya) | BSE MFTP | ANY | DENY | Alerted |

### Violation Detection

Network monitoring alerts if any non-Surya IP attempts connection to exchange extranet:

```
Alert: EXTRANET_ACCESS_VIOLATION
Source: 10.0.1.45 (Ganesh VM)
Destination: extranet.nseindia.com:443
Severity: CRITICAL
Action: Block immediately, investigate
```

---

## API Security

### Distribution API Authentication

```
Engine → Surya API
  │
  │  GET /api/v1/files/SEC_TOK/download
  │  X-API-Key: ganesh-key-hash
  │
  ▼
Surya API:
  1. Hash the API key: SHA-256(key)
  2. Lookup in api_keys table: SELECT * WHERE key_hash = hash
  3. Verify engine is enabled and key not expired
  4. Check file type access: 'SEC_TOK' IN allowed_file_types
  5. If authorized → proceed
  6. If unauthorized → 403 Forbidden
  7. Log access: audit.file_events (event_type: FILE_DISTRIBUTED)
```

### API Key Management

| Aspect | Detail |
|---|---|
| Generation | `crypto.randomBytes(32).toString('base64url')` |
| Storage | SHA-256 hash in `api_keys.key_hash`; plaintext NEVER stored |
| Scoping | Per-engine file type allowlist |
| Rotation | On request; old key invalidated immediately |
| Expiry | Optional; default none (manual rotation preferred) |

---

## File Integrity

### Checksums at Every Stage

```
Download  → SHA-256 computed → compared with exchange-provided checksum
Storage   → SHA-256 of stored object → stored in file_versions.checksum_sha256
Retrieval → SHA-256 verified on read → compared with stored checksum
```

### Tamper Detection

```javascript
async function verifyFileIntegrity(fileId) {
  const metadata = await getFileMetadata(fileId);
  const fileStream = await minio.getObject(metadata.storageBucket, metadata.storageKey);

  const hash = crypto.createHash('sha256');
  fileStream.pipe(hash);

  const computedChecksum = await new Promise((resolve) => {
    fileStream.on('end', () => resolve(hash.digest('hex')));
  });

  if (computedChecksum !== metadata.checksumSHA256) {
    logger.fatal('File integrity check FAILED — possible tampering', {
      fileId,
      storedChecksum: metadata.checksumSHA256,
      computedChecksum
    });
    throw new IntegrityError('File checksum mismatch');
  }
}
```

---

## Encryption

| Data State | Method | Details |
|---|---|---|
| In transit (API) | TLS 1.3 | All API endpoints |
| In transit (Extranet) | TLS 1.2+ | NSE/BSE extranet connections |
| In transit (Internal) | TLS 1.2 | PostgreSQL, Redis, RabbitMQ |
| At rest (Files) | MinIO SSE-S3 (AES-256) | Automatic server-side encryption |
| At rest (DB) | PostgreSQL TDE | Encrypted tablespace |
| At rest (Credentials) | Vault AES-256-GCM | Encrypted at rest in Vault |

---

## Access Control Matrix

| Role | Distribution API | Admin API | Extranet API | MinIO Console |
|---|---|---|---|---|
| **Ganesh** | SEC_TOK, BHAVCOPY, CORP_ACT, MKT_HOL | None | None | None |
| **Lakshmi** | SEC_TOK, BHAVCOPY, CIRC_BRK | None | None | None |
| **Vega** | SEC_TOK, CON_MAST, SPN_MRG, EXP_MRG, CIRC_BRK | None | None | None |
| **Operations** | ALL | ALL | Read-only (monitoring) | Read-only |
| **Admin** | ALL | ALL | Full (credential rotation) | Read-write |

---

## Incident Response

### Credential Compromise

```
1. IMMEDIATE: Rotate compromised credential in Vault
2. Revoke compromised API key(s)
3. Audit all file access from the compromised key time window
4. Verify file integrity (checksums) for all accessed files
5. Notify exchange security team if extranet credential compromised
6. File incident report within 24 hours
7. Post-mortem with corrective actions
```

### Unauthorized Extranet Access Detected

```
1. Firewall alert received: non-Surya IP attempted NSE extranet connection
2. IMMEDIATE: Block source IP at firewall
3. Investigate: Which engine/service? Why? Credentials leaked?
4. If malicious → Full security incident response
5. If accidental → Educate team, verify rule awareness
```
