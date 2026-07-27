# 12 — Installation

> **Version:** v2.1.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## Prerequisites

1. Hardware meets [System Requirements](03-system-requirements.md)
2. RHEL 9.x / Rocky Linux 9.x installed
3. MQ cluster operational and accessible
4. ODIN deployed and accessible via MQ
5. Risk Engine deployed and accessible via gRPC
6. Vega Framework v4.2+ installed

## Package Installation

```bash
# Install Hanuman
dnf install -y lakshmi-hanuman-2.1.0

# Install CLI tools
dnf install -y lakshmi-hanumanctl-2.1.0

# Verify
hanumand --version
hanumanctl version
```

## Post-Installation

```bash
# Create directories
mkdir -p /opt/lakshmi/hanuman/{strategies,checkpoints,replay_log}
mkdir -p /var/log/lakshmi/hanuman

# Copy example strategies
cp /opt/lakshmi/hanuman/examples/*.vega /opt/lakshmi/hanuman/strategies/

# Configure
vim /etc/lakshmi/hanuman/config.yaml

# Set permissions
chown -R lakshmi:lakshmi /opt/lakshmi/hanuman
chown -R lakshmi:lakshmi /var/log/lakshmi/hanuman

# Enable and start service
systemctl enable hanumand
systemctl start hanumand

# Verify
hanumanctl list
hanumanctl health
```

## Strategy Deployment

```bash
# Deploy a strategy definition via Vega
# 1. Write strategy file
vim /opt/lakshmi/hanuman/strategies/my_spread.vega

# 2. Validate syntax
hanumanctl validate --file /opt/lakshmi/hanuman/strategies/my_spread.vega

# 3. Load into Hanuman (INIT → READY)
hanumanctl load --file /opt/lakshmi/hanuman/strategies/my_spread.vega

# 4. Start execution (READY → RUNNING)
hanumanctl start --name my_spread

# 5. Verify running
hanumanctl status --name my_spread
```

## Verification Checklist

- [ ] `hanumand --version` returns v2.1.0
- [ ] Service started: `systemctl status hanumand`
- [ ] gRPC API accessible: `grpcurl -plaintext localhost:50052 list`
- [ ] Prometheus metrics at `:9194/metrics`
- [ ] Can load a test strategy: `hanumanctl load --file examples/test_spread.vega`
- [ ] Strategy transitions through states correctly
- [ ] MQ subscriptions active for required market data topics
- [ ] Risk Engine connectivity verified
- [ ] Audit logs being written to Suraksha
