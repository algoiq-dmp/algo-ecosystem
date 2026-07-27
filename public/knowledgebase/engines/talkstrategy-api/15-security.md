# TalkStrategy API - Security

**Version:** 2.8.0 | **Owner:** Execution | **Last Updated:** 2026-07-25


## Security Model

The engine follows a defense-in-depth security approach with multiple layers of protection, from network isolation to application-level encryption.

## Authentication & Authorization

### Suraksha IAM Integration
All API access is gated through Suraksha Identity and Access Management. JWT tokens are validated on every request with role-based access control (RBAC).

### Service-to-Service Auth
Inter-service communication uses mTLS with X.509 certificates issued by the internal Suraksha CA. Certificate rotation occurs automatically every 30 days.

## Network Security

| Control | Implementation | Purpose |
|---------|---------------|---------|
| Firewall | iptables / ufw | Restrict inbound to needed ports only |
| TLS | TLS 1.2+ for all HTTP/MQ | Encrypt data in transit |
| VPN | WireGuard for remote access | Secure administrative access |
| Network Segmentation | VLAN isolation | Separate trading network from corporate |

## Data Protection

### Encryption at Rest

| Data Type | Encryption | Key Management |
|-----------|-----------|---------------|
| Database | PostgreSQL TDE | Suraksha Vault |
| Config files | AES-256-GCM | Suraksha Vault |
| Log files | Application-level encryption | Suraksha Vault |
| Backups | GPG symmetric encryption | Suraksha Vault |

### Secrets Management
All secrets are stored in Suraksha Vault with dynamic secret generation. The engine authenticates to Vault using the AppRole auth method with periodic token renewal.

## Audit Logging

All security-relevant events are logged:
- Authentication attempts (success and failure)
- Configuration changes
- Permission modifications
- Data access records (for sensitive data)
- API key usage

## Vulnerability Management

- Dependencies scanned weekly via npm audit and Snyk
- Container images scanned via Trivy before deployment
- Penetration testing performed quarterly by external security team
- CVE monitoring with automated alerts for critical vulnerabilities

## Compliance

The engine supports compliance with:
- **SEBI:** Trading system audit trail requirements
- **ISO 27001:** Information security management
- **SOC 2:** Security, availability, and confidentiality controls

