# Chitragupta — API Reference

**Version:** 3.0.0 | **Owner:** Compliance | **Last Updated:** 2026-07-24

## Base URL

```
http://192.168.190.106:3120/api/v3
```

## Authentication

Bearer token via Suraksha. Include `Authorization: Bearer <token>` header. Compliance endpoints require elevated RBAC `compliance_read` or `compliance_admin` roles.

## Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/audit/trades` | Trade audit log with filters |
| GET | `/audit/trades/:id` | Single trade audit detail |
| GET | `/audit/orders` | Order audit trail |
| GET | `/compliance/reports` | Generated compliance reports |
| POST | `/compliance/reports/generate` | Trigger report generation |
| GET | `/compliance/regulatory` | Regulatory filing data (SEBI format) |
| GET | `/search` | Full-text forensic search across audit logs |
| GET | `/integrity/verify` | Verify audit chain integrity |

## Example Request

```
GET /api/v3/audit/trades?date=2026-07-24&broker=XTS
Authorization: Bearer eyJhbG...
```
