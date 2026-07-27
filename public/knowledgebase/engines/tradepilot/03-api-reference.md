# TradePilot — API Reference

**Version:** 2.2.0 | **Owner:** Operations | **Last Updated:** 2026-07-24

## Base URL

```
http://192.168.190.104:3160/api/v2
```

## Authentication

Bearer token via Suraksha. Include `Authorization: Bearer <token>` header.

## Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/clients/onboard` | Submit new client onboarding request |
| GET | `/clients` | List onboarded clients with status |
| GET | `/clients/:id/kyc` | Client KYC verification status |
| POST | `/strategies/submit` | Submit strategy for approval |
| GET | `/strategies/:id/status` | Strategy approval workflow status |
| PUT | `/strategies/:id/approve` | Approve a strategy (compliance role) |
| GET | `/audit/approvals` | Approval audit trail |
| GET | `/compliance/checks` | Regulatory compliance check definitions |

## Example Request

```
POST /api/v2/strategies/submit
{ "client_id": "CL-123", "strategy_name": "NIFTY Momentum", "strategy_doc": "base64...", "risk_profile": "moderate" }
```
