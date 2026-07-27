# 22 â€” Frequently Asked Questions

**Version:** 3.0.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-24

---

## General

**Q: What is Narad?**
A: Narad is the Universal Connectivity & Infrastructure Management Platform â€” the backbone of the entire Algo-IQ ecosystem. It manages service discovery, health monitoring, configurations, deployments, and remote commands across ALL servers and services.

**Q: Why is it called the backbone?**
A: Because every single server, engine, product, and API connects to Narad. If Narad is down, you can't discover services, update configs, deploy code, or monitor health centrally.

**Q: What's Narad's uptime target?**
A: 99.99% (less than 52 minutes of downtime per year).

## Agents

**Q: Do I need to install the Narad Agent?**
A: Yes â€” every managed server must run the Narad Agent. It's lightweight (256MB RAM) and provides automatic telemetry, log shipping, and health monitoring.

**Q: What if the Agent can't reach the Control Plane?**
A: The Agent buffers telemetry and logs locally and replays them on reconnect. Services continue running normally.

**Q: Can I run without the Agent?**
A: You can manually register services via REST API, but you lose automatic telemetry, log shipping, and health monitoring.

## Service Registry

**Q: How do services discover each other?**
A: Query Narad's Service Registry: `GET /api/v1/registry/services/{name}`

**Q: What happens if a service doesn't send heartbeats?**
A: After 30 seconds it's marked UNHEALTHY. After 5 minutes, it's marked OFFLINE.

**Q: Can I register a service manually?**
A: Yes. `POST /api/v1/registry/services`

## Configuration

**Q: How do I update a service's config?**
A: `POST /api/v1/config/{serviceName}` with new config JSON. The service receives the update via Redis Pub/Sub within 100ms.

**Q: Can I rollback a config change?**
A: Yes. Configs are versioned. Re-deploy any previous version by posting it again.

**Q: Are config changes audited?**
A: Yes. Every change records: who, when, what changed, and why.

## Remote Commands

**Q: How do I run a command on a production server?**
A: `narad-cli exec --server ganesh-prod-1 --command "systemctl status ganesh"`. Production commands require approval.

**Q: Are commands logged?**
A: Yes. Every command is recorded with executor, target, command text, output, exit code, and timestamps. Retained for 7 years.

## Emergency

**Q: What if Narad itself goes down?**
A: Services continue running. Agents buffer data. Once Narad recovers, agents reconnect and replay all buffered data.

**Q: How do I restart Narad?**
A: `kubectl rollout restart deployment/narad-control-plane`
