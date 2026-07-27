# Suraksha Engine — Glossary

**Version:** 3.1.0 | **Owner:** Risk & Security | **Last Updated:** 2026-07-24

---

## A

| Term | Definition |
|---|---|
| **Access Control List (ACL)** | Set of rules defining which users/roles can perform which operations on which resources |
| **Audit Log** | Immutable record of all security-relevant events — logins, permission changes, access attempts — for compliance review |
| **Authentication** | Process of verifying user identity through credentials (password, token, certificate) |

## B

| Term | Definition |
|---|---|
| **Bearer Token** | Short-lived JWT used for API authentication; included in Authorization header |
| **Blacklist** | List of revoked tokens, banned IPs, or blocked user accounts enforced at the auth gateway |

## C

| Term | Definition |
|---|---|
| **Certificate Authority (CA)** | Internal service issuing and managing X.509 certificates for mTLS between ecosystem components |
| **Certificate Revocation List (CRL)** | List of certificates revoked before their expiration date; checked during mTLS handshake |
| **Compliance Framework** | Set of regulatory rules (SEBI, GDPR, ISO 27001) encoded as automated policy checks |

## E

| Term | Definition |
|---|---|
| **Encryption at Rest** | Data stored on disk encrypted with AES-256-GCM; applied to databases, logs, and backups |
| **Encryption in Transit** | All network communication encrypted via TLS 1.3; enforced by Suraksha across all endpoints |
| **Enterprise Security** | Holistic security model spanning identity, access, secrets, certificates, and threat detection |

## H

| Term | Definition |
|---|---|
| **HMAC** | Hash-based Message Authentication Code (SHA-256) used for signing API requests |
| **HSM** | Hardware Security Module — dedicated hardware for cryptographic key generation and storage |

## I

| Term | Definition |
|---|---|
| **Identity Provider (IdP)** | External system (LDAP, OAuth, SAML) that authenticates users and provides identity assertions |
| **IP Whitelist** | Network-level access control allowing connections only from approved IP ranges |

## J

| Term | Definition |
|---|---|
| **JWT** | JSON Web Token — compact, URL-safe token carrying claims about user identity and permissions |
| **JWT Claims** | Key-value pairs in a JWT payload: sub (subject), exp (expiry), iat (issued-at), roles, permissions |

## M

| Term | Definition |
|---|---|
| **MFA** | Multi-Factor Authentication — requiring two or more verification factors (password + TOTP/hardware key) |
| **mTLS** | Mutual TLS — both client and server present certificates; mandatory for inter-component communication |

## O

| Term | Definition |
|---|---|
| **OAuth 2.0** | Authorization framework used by Suraksha for delegated API access and third-party integration |

## P

| Term | Definition |
|---|---|
| **Permission** | Granular action allowed on a resource (e.g., `order:create`, `portfolio:read`, `admin:configure`) |
| **Policy Engine** | Rule evaluation service that determines whether a request is authorized based on RBAC policies |

## R

| Term | Definition |
|---|---|
| **RBAC** | Role-Based Access Control — permissions grouped into roles; users assigned to roles |
| **Refresh Token** | Long-lived token used to obtain new bearer tokens without re-authentication |
| **Role** | Named collection of permissions (e.g., `trader`, `risk-manager`, `admin`, `auditor`) |

## S

| Term | Definition |
|---|---|
| **Secret** | Sensitive value — API key, password, certificate key — stored in Vault, never in code or config |
| **Secrets Manager** | HashiCorp Vault integration for secure storage, rotation, and access auditing of secrets |
| **SEBI Compliance** | Adherence to Securities and Exchange Board of India regulations for algorithmic trading systems |
| **Session Token** | Temporary credential issued after authentication; valid for a configurable TTL (default: 1 hour) |

## T

| Term | Definition |
|---|---|
| **Threat Detection** | Real-time monitoring system analyzing logs and metrics for security anomalies and intrusion patterns |
| **TOTP** | Time-based One-Time Password — 6-digit code generated every 30 seconds for MFA |
| **TLS 1.3** | Latest Transport Layer Security protocol version; enforced for all Suraksha-managed connections |

## V

| Term | Definition |
|---|---|
| **Vault** | HashiCorp Vault — secure storage for secrets, certificates, and encryption keys with audit logging |
