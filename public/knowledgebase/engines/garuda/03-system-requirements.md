---
version: 5.0.0
owner: Margin Intelligence
last_updated: 2026-07-25
---

# 03 — System Requirements

## Hardware Requirements

| Environment | CPU | RAM | Storage | Network |
|---|---|---|---|---|
| Development | 8 vCPU | 16 GB | 100 GB SSD | 100 Mbps |
| UAT / Staging | 16 vCPU | 32 GB | 500 GB SSD | 1 Gbps |
| Production (Minimum) | 32 vCPU (4 nodes x 8) | 64 GB (4 nodes x 16) | 1 TB NVMe SSD | 10 Gbps |
| Production (Recommended) | 64 vCPU (8 nodes x 8) | 128 GB (8 nodes x 16) | 2 TB NVMe SSD RAID-10 | 10 Gbps |
| GPU Node (ML Inference) | 4 vCPU + GPU T4 | 28 GB | 256 GB SSD | 1 Gbps |

## Software Prerequisites

| Software | Minimum Version | Purpose |
|---|---|---|
| .NET SDK / Runtime | 8.0+ | Backend microservices (C#) |
| Node.js | 20 LTS+ | Frontend build tooling |
| Docker | 24.0+ | Containerization |
| Docker Compose | 2.20+ | Local orchestration |
| Kubernetes | 1.28+ | Production orchestration |
| Helm | 3.13+ | Package management |
| PostgreSQL | 15+ (16+ recommended) | Primary database |
| Redis | 7.2+ (Enterprise/Cluster for production) | Distributed cache |
| Apache Kafka | 3.6+ | Message broker |
| Git | 2.40+ | Version control |

## Operating Systems

| Type | Supported Versions |
|---|---|
| Linux (Recommended) | Ubuntu 22.04 LTS, Ubuntu 24.04 LTS, RHEL 9+, Rocky Linux 9+ |
| Windows Server | 2019, 2022 |
| Development | Windows 10/11, macOS 13+, Ubuntu 22.04+ |

## Network & Port Configuration

| Service | Port | Protocol | External? |
|---|---|---|---|
| API Gateway | 443 | HTTPS | Yes |
| WebSocket Hub | 443 | WSS | Yes |
| Prometheus Metrics | 9090 | HTTP | Internal only |
| Grafana Dashboard | 3000 | HTTPS | Yes (admin) |
| PostgreSQL | 5432 | TCP | Internal only |
| Redis | 6379 | TCP | Internal only |
| Redis Sentinel | 26379 | TCP | Internal only |
| Kafka Broker | 9092 | TCP | Internal only |
| Kafka (External) | 9094 | SASL_SSL | External (optional) |
| Schema Registry | 8081 | HTTP | Internal only |
| Elasticsearch | 9200 | HTTPS | Internal only |
| Jaeger UI | 16686 | HTTPS | Internal only |

### Firewall Requirements

```
Priority | Source                   | Destination              | Port | Action
1000     | Azure Front Door / CDN   | API Gateway              | 443  | Allow
1010     | Monitoring Namespace     | All Services             | 8081 | Allow
1020     | API Gateway              | Internal Services        | 5000-5100 | Allow
1030     | Internal Services        | PostgreSQL               | 5432 | Allow
1040     | Internal Services        | Redis                    | 6379 | Allow
1050     | Internal Services        | Kafka                    | 9092 | Allow
1060     | Kubernetes Nodes         | Container Registry       | 443  | Allow
1070     | VNet (internal)          | Key Vault (Private Link) | 443  | Allow
9999     | Any                      | Any                      | *    | Deny (default)
```

## Dependencies

### Core Infrastructure

| Dependency | Type | Purpose |
|---|---|---|
| **PostgreSQL 15+** | Database | Primary data store, TimescaleDB extension for time-series |
| **Redis 7.2+** | Cache | Three-tier caching (L1 memory, L2 Redis, L3 DB) |
| **Apache Kafka 3.6+** | Message Broker | Inter-service async communication, event sourcing |
| **Azure Key Vault / HashiCorp Vault** | Secrets | All passwords, keys, certificates stored externally |

### Ecosystem Dependencies

| Dependency | Purpose |
|---|---|
| **Surya** | Market data WebSocket relay for real-time price feeds |
| **Lakshmi** | Client accounting and fund management integration |
| **Narad** | Platform-wide event bus for margin change notifications |
| **Suraksha** | Centralized authentication and RBAC service |
| **Parikshak** | Exchange validation and certification harness |

### Cloud Service Dependencies (Optional)

| Service | Azure | AWS | GCP |
|---|---|---|---|
| Kubernetes | AKS | EKS | GKE |
| Database | PostgreSQL Flexible Server | RDS PostgreSQL | Cloud SQL |
| Cache | Azure Cache for Redis | ElastiCache | Memorystore |
| Kafka | HDInsight / Confluent Cloud | MSK | Confluent Cloud |
| Storage | Blob Storage | S3 | Cloud Storage |
| CDN/WAF | Front Door + WAF | CloudFront + WAF | Cloud CDN + Armor |
| DNS | Azure DNS | Route 53 | Cloud DNS |
| Key Vault | Azure Key Vault | AWS KMS / Secrets Manager | Secret Manager |

### Runtime Dependencies (.NET)

| NuGet Package | Version | Purpose |
|---|---|---|
| Npgsql | 8.0+ | PostgreSQL ADO.NET driver |
| StackExchange.Redis | 2.7+ | Redis .NET client |
| Confluent.Kafka | 2.3+ | Kafka .NET client |
| Entity Framework Core | 8.0+ | ORM with migrations |
| Dapper | 2.1+ | High-performance SQL execution |
| Serilog | 4.0+ | Structured logging |
| FluentValidation | 11+ | Input validation |
| Polly | 8.0+ | Resilience and circuit breakers |
| SignalR | 8.0+ | WebSocket real-time communication |
| Swashbuckle | 6.5+ | OpenAPI / Swagger documentation |
