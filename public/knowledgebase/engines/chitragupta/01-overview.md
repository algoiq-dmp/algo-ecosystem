# Chitragupta — Overview

**Version:** 3.0.0 | **Owner:** Compliance | **Last Updated:** 2026-07-24

## What Is Chitragupta?

Chitragupta is the centralized audit and compliance engine that records every trade, order, and execution event in the Algo IQ ecosystem. It receives trade data from TalkDelta and execution confirmations from Vega, creating an immutable chronological record. The engine serves as the single source of truth for regulatory audits, compliance reporting, and forensic trade analysis.

## Why Was It Built?

SEBI and exchange regulations mandate comprehensive trade audit trails with long-term retention. Chitragupta was built to automate audit logging, compliance reporting, and data archival, eliminating manual audit preparation and reducing regulatory risk.

## Business Objective

Maintain a complete, immutable audit trail of all trading activity. Generate compliance reports for regulatory filings. Provide forensic search capabilities for trade investigations. Ensure data archival meets SEBI-mandated retention periods.

## Scope

- Real-time trade audit event capture from Vega and TalkDelta
- Immutable audit log with cryptographic integrity checks
- Compliance report generation (daily, monthly, quarterly)
- Regulatory filing data preparation
- Elasticsearch-based forensic search and analysis
