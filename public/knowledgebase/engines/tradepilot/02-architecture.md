# TradePilot — Architecture

**Version:** 2.2.0 | **Owner:** Operations | **Last Updated:** 2026-07-24

## Architecture Overview

TradePilot consists of two core modules:

- **tradepilot-onboarding:** Client onboarding module handling KYC document collection, verification, and approval. Manages client profiles, risk assessments, and regulatory documentation. Integrates with external KYC verification services.
- **tradepilot-workflow:** Strategy approval workflow engine. Defines multi-stage approval pipelines (submission, compliance review, risk assessment, final approval). Tracks approval status, generates audit records, and issues deployment clearance to Strategy Factory.

## Data Flow

```
External (Client Data) ──> tradepilot-onboarding ──> PostgreSQL (Client Records)
                                    │
                                    └──> tradepilot-workflow ──> Strategy Factory (Approved Strategies)
                                              │
                                              └──> PostgreSQL (Approval Audit Trail)
```

1. Onboarding module collects and verifies client KYC
2. Approved clients submit strategies for review
3. Workflow engine routes strategies through compliance checks
4. Approved strategies receive clearance and are forwarded to Strategy Factory
