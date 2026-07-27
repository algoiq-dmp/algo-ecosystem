# Rakshak Engine — Glossary

**Version:** 2.0.0 | **Owner:** Security | **Last Updated:** 2026-07-24

---

## A

| Term | Definition |
|---|---|
| **Access Token** | Short-lived JWT (default: 60 min) issued after successful authentication; used for API authorization |
| **Audit Event** | Immutable log entry recording a security-relevant action — who did what, when, from where, and the result |
| **Authentication Service** | Core Rakshak component validating user credentials and issuing JWTs |

## B

| Term | Definition |
|---|---|
| **Bearer Token** | Access token included in HTTP `Authorization: Bearer <token>` header |
| **Brute Force Protection** | Rate limiting and account lockout after N consecutive failed login attempts (default: 5) |

## C

| Term | Definition |
|---|---|
| **Certificate Signing Request (CSR)** | Request sent to the Rakshak CA to generate a signed X.509 certificate for a component |
| **Claim** | Key-value pair in a JWT payload — `sub` (user id), `exp` (expiry), `roles`, `permissions` |
| **Credential Rotation** | Periodic replacement of passwords, API keys, and certificates; automated via Vault integration |

## E

| Term | Definition |
|---|---|
| **Encryption Key** | AES-256 symmetric key used for encrypting secrets at rest in the Vault backend |

## I

| Term | Definition |
|---|---|
| **IAM** | Identity and Access Management — overarching framework for authentication, authorization, and auditing |
| **Identity Provider (IdP)** | External system (LDAP, Active Directory, OAuth provider) trusted by Rakshak for user authentication |
| **Impersonation** | Privileged feature allowing an admin to act on behalf of another user; fully audit-logged |

## J

| Term | Definition |
|---|---|
| **JWT** | JSON Web Token — RFC 7519 standard for securely transmitting claims between parties |

## M

| Term | Definition |
|---|---|
| **MFA** | Multi-Factor Authentication — requires password + TOTP or hardware token for login |
| **mTLS** | Mutual TLS — both parties present certificates; Rakshak CA issues all internal certificates |
| **Middleware** | Interceptor in the API gateway that validates JWTs, enforces RBAC, and logs audit events |

## P

| Term | Definition |
|---|---|
| **Password Policy** | Rules enforced: minimum 12 characters, mixed case + digits + symbols, 90-day expiry, no reuse of last 5 |
| **Penetration Test** | Authorized simulated attack to identify security vulnerabilities; conducted quarterly |
| **Permission** | Granular action allowed on a specific resource (e.g., `read:portfolio`, `create:order`, `delete:strategy`) |
| **Policy** | RBAC rule binding a role to a set of permissions; evaluated at authorization time |

## R

| Term | Definition |
|---|---|
| **Rakshak** | Identity and Access Management engine — single source of truth for authentication and authorization |
| **RBAC** | Role-Based Access Control — users assigned roles, roles assigned permissions |
| **Refresh Token** | Long-lived token (default: 7 days) used to obtain new access tokens without re-login |
| **Revocation** | Immediate invalidation of a token, certificate, or credential; blacklisted and audit-logged |
| **Role** | Named set of permissions mapped to a job function: `trader`, `risk-manager`, `admin`, `auditor`, `developer` |

## S

| Term | Definition |
|---|---|
| **Session** | Stateful or stateless representation of an authenticated user; tracked via JWT claims |
| **Single Sign-On (SSO)** | Authentication scheme allowing users to log in once and access multiple ecosystem components |
| **Service Account** | Non-human identity used by automated processes and services; authenticated via API key or certificate |

## T

| Term | Definition |
|---|---|
| **Token Expiry** | Time after which a JWT is no longer valid; enforced by middleware on every request |
| **TOTP** | Time-based One-Time Password — 6-digit code generated every 30 seconds for MFA |
| **Two-Factor Authentication** | Login requiring two independent factors: something you know (password) + something you have (TOTP) |

## V

| Term | Definition |
|---|---|
| **Vault** | HashiCorp Vault — secure backend for storing secrets, encryption keys, and certificates with audit logging |
