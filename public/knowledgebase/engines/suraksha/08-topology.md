# 08 â€” Ecosystem Topology

**Version:** 2.0.0 | **Owner:** Security | **Last Updated:** 2026-07-24

---

## Suraksha in the Ecosystem

Suraksha is the security foundation of the entire Algo-IQ ecosystem. Every service, every API call, every inter-component connection passes through Suraksha's security controls.

```
                              +---------------------------+
                              |        SURAKSHA           |
                              |    (Security Layer)       |
                              +--+----+----+----+----+---+
                                 |    |    |    |    |
        +------------------------+    |    |    |    +------------------------+
        |                        +----+    |    +----+                        |
        |                        |         |         |                        |
+-------v-------+ +------v------+ +------v------+ +------v------+ +------v-------+
|   Lakshmi     | |   Ganesh    | |    Narad    | |    Vega     | |    Brahma    |
|  (Auth via    | |  (Auth via  | |  (Auth via  | |  (Auth via  | |  (Auth via   |
|   Suraksha)   | |  Suraksha)  | |  Suraksha)  | |  Suraksha)  | |  Suraksha)   |
+---------------+ +-------------+ +-------------+ +-------------+ +--------------+
```

## Security Coverage

| Protected Resource | Suraksha Control |
|---|---|
| All REST APIs | JWT authentication + RBAC authorization |
| All gRPC endpoints | mTLS + JWT |
| All databases | Connection credentials from Vault |
| All message queues | Connection credentials from Vault |
| All SSH tunnels | mTLS certificates |
| All deployments | Authorization before deploy trigger |
| All config changes | Authorization + audit |
| All secrets | Vault encryption + access control + audit |

## Deployment Topology

```
                    [Load Balancer (WAF)]
                           |
          +----------------+----------------+
          |                |                |
   [Suraksha-1]     [Suraksha-2]     [Suraksha-3]
   (us-east-1a)     (us-east-1b)     (us-east-1c)
          |                |                |
          +---------+------+------+---------+
                    |             |
          +---------v-+    +-----v-------+
          |  Vault    |    | PostgreSQL  |
          |  Cluster  |    | Primary     |
          +-----------+    +-------------+
                    |
          +---------v-+
          |   Redis   |
          |  Cluster  |
          +-----------+
```

## Network Segmentation

| Zone | Services | Access |
|---|---|---|
| **Public** | REST API (3004) | Suraksha JWT required |
| **Internal** | Vault (8200), gRPC (50052) | mTLS |
| **Database** | PostgreSQL, Redis | Internal only, TLS |
| **Management** | Prometheus (9092), SSH | VPN only |

## Security Boundaries

Suraksha defines three security boundaries:

1. **External Boundary**: Between the internet and the Algo-IQ ecosystem. Suraksha is the gatekeeper â€” no request enters without authentication.
2. **Inter-Service Boundary**: Between ecosystem services. Suraksha issues credentials and certs; services authenticate each other via mTLS.
3. **Data Boundary**: Between services and their data stores. Suraksha Vault holds all database credentials; no service stores plaintext passwords.

## Failover Strategy

- **Auth servers**: Active-active behind LB. Stateless; any instance can handle any request.
- **Vault**: Active-standby with automatic failover.
- **PostgreSQL**: Streaming replication with automated promotion.
- **Redis**: Cluster mode with automatic failover.
- **JWT validation**: Services validate tokens locally using public JWKS (no Suraksha dependency for validation).
