# 03 — System Requirements

## Hardware Requirements

### Production Server

| Component | Minimum | Recommended |
|---|---|---|
| **CPU** | 16 cores (Intel Xeon / AMD EPYC) | 32 cores |
| **RAM** | 32 GB DDR4 ECC | 64 GB DDR4 ECC |
| **Storage** | 500 GB NVMe SSD | 1 TB NVMe SSD (RAID 1) |
| **Network** | 10 Gbps Ethernet | 25 Gbps Ethernet (bonded) |
| **Redundancy** | Single server + cold standby | 3-node cluster (active-active-passive) |

### Development Machine

| Component | Specification |
|---|---|
| **CPU** | 8 cores |
| **RAM** | 16 GB |
| **Storage** | 50 GB free SSD |
| **Network** | 1 Gbps |

## Software Requirements

| Software | Version | Purpose |
|---|---|---|
| **Operating System** | Windows Server 2022 (Build 20348+) | Host OS |
| **Node.js** | 20.x LTS (20.11.0+) | Runtime environment |
| **RabbitMQ** | 3.12.x | Message broker (pub/sub core) |
| **Erlang/OTP** | 26.x | RabbitMQ dependency |
| **Redis** | 7.2.x | In-memory cache and pub/sub |
| **PostgreSQL** | 16.x | Persistent metadata and audit logs |
| **InfluxDB** | 2.7.x | Time-series metrics storage |
| **PM2** | 5.3.x | Process management (Windows Service) |

## Network Requirements

| Port | Protocol | Service | Direction |
|---|---|---|---|
| **5672** | AMQP | RabbitMQ message broker | Inbound / Outbound |
| **15672** | HTTP | RabbitMQ Management UI | Inbound (admin only) |
| **3001** | HTTP / WS | Lakshmi WebSocket Server | Inbound |
| **3001** | HTTP | Lakshmi REST API | Inbound |
| **8083** | TCP | InfluxDB HTTP API | Outbound (write metrics) |
| **6379** | TCP | Redis | Outbound |
| **5432** | TCP | PostgreSQL | Outbound |
| **9090** | HTTP | Prometheus metrics endpoint | Inbound (scrape) |

### Firewall Rules

```powershell
New-NetFirewallRule -DisplayName "Lakshmi-AMQP"   -Direction Inbound -LocalPort 5672  -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "Lakshmi-WS"     -Direction Inbound -LocalPort 3001  -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "Lakshmi-Metrics" -Direction Inbound -LocalPort 9090 -Protocol TCP -Action Allow
```

## External Dependencies

| Service | Dependency Type | Criticality | Notes |
|---|---|---|---|
| **Ganesh** | Upstream data source | High | Primary tick feed |
| **Surya** | Upstream data source | High | Market depth and snapshots |
| **PostgreSQL** | Persistent storage | High | Topics, subscribers, audit |
| **Redis** | Cache layer | Medium | Hot data, deduplication |
| **Narad** | Downstream consumer | Medium | Order confirmation routing |
| **Suraksha** | Security | Medium | API key validation |

## Disk Layout

| Path | Size | Purpose |
|---|---|---|
| `C:\lakshmi\` | 10 GB | Application binaries and config |
| `C:\lakshmi\logs\` | 50 GB | Application and audit logs |
| `D:\rabbitmq\` | 200 GB | RabbitMQ message store (mnesia) |
| `D:\redis\` | 50 GB | Redis RDB/AOF persistence |
| `D:\postgresql\` | 150 GB | PostgreSQL data directory |

## Supported Browsers (WebSocket Clients)

| Browser | Minimum Version |
|---|---|
| Chrome | 90+ |
| Firefox | 88+ |
| Edge | 90+ |
| Safari | 14+ |
