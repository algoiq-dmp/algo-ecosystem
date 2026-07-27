# 15 — Security

> **Version:** v2.8.0 | **Owner:** Market Data | **Last Updated:** 2026-07-25

## Security Model

The Feed Server operates within a defense-in-depth security architecture. All access is authenticated, authorized, and audited. The data path itself is isolated from the management plane.

## Network Security

### Network Segmentation

- Feed interfaces are on isolated VLANs with no default gateway — no route to corporate network or internet
- Management interface is on a separate physical NIC on the OAM (Operations, Administration, Management) network
- Exchange VLANs use private IP space (10.240.0.0/16) with no NAT
- Firewall rules (iptables/nftables) on the management interface:
  - Allow: SSH (22) from jump hosts only
  - Allow: gRPC (50051) from Narad monitoring hosts
  - Allow: Prometheus (9090) from monitoring VLAN
  - Deny: All other inbound
  - Deny: All outbound except to internal services (MQ, Suraksha, PostgreSQL)

### TLS Configuration

All management-plane communication uses mutual TLS (mTLS):
- gRPC API: TLS 1.3, ECDHE-RSA-AES256-GCM-SHA384
- Client certificates issued by internal CA (Vault PKI)
- Certificate rotation: every 90 days, automated via Vault agent

## Authentication and Authorization

### Service-to-Service Auth

- mTLS with SPIFFE identities
- Each Lakshmi component has a unique SPIFFE ID: `spiffe://lakshmi.internal/component/feedd/instance/feedd-nse-cm-01`
- Authorization policies defined in Suraksha policy engine

### CLI Access

- `feeddctl` requires a valid operator certificate in `~/.lakshmi/certs/`
- All CLI commands are logged to the audit trail
- Role-based access: `admin` (full control), `operator` (status, pause/resume), `viewer` (read-only)

## Data Protection

### Data at Rest

- Audit logs encrypted at rest via Suraksha (AES-256-GCM)
- Configuration database connections use TLS 1.3
- Ring buffer in shared memory: accessible only to processes in `lakshmi` group (not world-readable)

### Data in Transit

- Exchange feeds: raw TCP/UDP — no encryption (exchange circuits are physically secured cross-connects)
- MQ publish: Unix domain sockets (local) or mTLS over TCP (remote)
- gRPC management: mTLS

### Data Handling

- No raw exchange messages are logged (only normalized LCFM messages in audit trail)
- Symbol mapping data is not sensitive
- Instrument master files are validated via exchange-provided signatures before loading

## Vulnerability Management

| Practice | Cadence |
|----------|---------|
| OS package updates (dnf) | Monthly (Saturday window) |
| Dependency scanning (Snyk) | Per-build (CI pipeline) |
| Static analysis (Coverity) | Per-build (CI pipeline) |
| Penetration testing | Quarterly (external firm) |
| CIS benchmark compliance | Monthly automated scan |
| Secret scanning (TruffleHog) | Pre-commit hook + CI |

## Incident Response

In case of suspected compromise:
1. Isolate the feed server from all networks (physical disconnect — use IPMI/KVM)
2. Preserve memory dump, disk images, and audit logs
3. Notify Security Officer and Market Data lead via PagerDuty
4. Fail over to DR site if impact is production-trading critical
5. Initiate forensic investigation following the Lakshmi Incident Response Playbook
