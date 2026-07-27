# 15 — Security

> **Version:** v3.0.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## Security Model

ODIN handles the most security-sensitive operation in the Lakshmi ecosystem: placing real orders on exchanges. Security is paramount. Multiple layers of defense prevent unauthorized, erroneous, or malicious orders from reaching exchanges.

## Authentication and Authorization

### API Access
- All MQ-based order requests authenticated via MQ mTLS (SPIFFE identity)
- Only authorized strategy engines can publish to `orders.*` topics
- gRPC management API requires operator certificates

### Exchange Credential Management
- Exchange API credentials stored in Suraksha Vault (never in plaintext)
- Credentials injected at adapter startup via Vault agent
- Credential rotation: every 30 days (automated where exchange APIs support it)

## Order Validation (Security Layer)

Every order passes through mandatory validation gates:

1. **Source Validation:** Order must come from an authorized client (strategy engine)
2. **Symbol Validation:** Symbol must exist and be tradable (from symbol master)
3. **Price Band:** Order price within exchange-defined circuit filter bands
4. **Quantity Limits:** Within lot size constraints and freeze limits
5. **Value Limits:** Order value (price × quantity) within configured maximum
6. **RMS Check:** Order passes Risk Management System checks
7. **Rate Limiter:** Client not exceeding order rate limits
8. **Algo ID Validation:** SEBI algo registration ID must be valid
9. **Duplicate Detection:** Same client_order_id within 60 seconds → rejected

## Kill Switch

Emergency stop mechanisms (in order of escalation):

1. **Strategy-level:** `odinctl block-client --client-id hanuman01`
2. **Exchange-level:** `odinctl block-exchange --exchange NSE`
3. **ODIN-level:** `odinctl emergency-stop --all`
4. **Network-level:** Automated iptables rule to block all traffic from ODIN to exchange VLANs (triggered by Narad if abnormal order rate detected)

## Audit Trail

Every order event is audited:
- Order receipt, validation result, routing decision
- Adapter communication (request/response, truncated for market data)
- Execution reports
- State transitions
- User/admin actions
- Failover events

Audit trail is encrypted, signed, and anchored daily via Suraksha Merkle tree.

## Dealer Terminal Security

Dealer terminals (ODIN Diet, Omnesys Nest) are third-party Windows applications. Security considerations:
- Dealer terminal servers on isolated VLAN
- No direct internet access from dealer terminal servers
- ODIN → dealer terminal communication over dedicated NIC (not shared with management)
- Dealer terminal access logged and monitored
- Vendor patches applied within SLA (7 days for critical)

## Compliance

- SEBI algo trading guidelines: unique algo IDs, order-to-trade ratio monitoring, audit trail
- Exchange-specific security requirements
- Annual security audit by CERT-IN empaneled auditor
- ISO 27001:2022 compliance for information security management
