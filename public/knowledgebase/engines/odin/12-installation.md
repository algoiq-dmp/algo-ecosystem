# 12 — Installation

> **Version:** v3.0.0 | **Owner:** Execution | **Last Updated:** 2026-07-25

## Prerequisites

1. Hardware meets [System Requirements](03-system-requirements.md)
2. RHEL 9.x / Rocky Linux 9.x installed
3. Dealer terminal servers provisioned and accessible (ODIN Diet, Omnesys Nest)
4. Exchange API credentials provisioned (NSE NEAT, BSE BOLT)
5. PostgreSQL instance for order storage
6. SFTP access to exchange trade file servers

## Package Installation

```bash
# Install ODIN
dnf install -y lakshmi-odin-3.0.0

# Install CLI tools
dnf install -y lakshmi-odinctl-3.0.0

# Verify
odind --version
odinctl version
```

## Post-Installation

```bash
# Create directories
mkdir -p /opt/lakshmi/odin/{logs,reports}
mkdir -p /var/log/lakshmi/odin

# Configure
vim /etc/lakshmi/odin/config.yaml

# Configure database
odinctl db migrate  # Creates tables

# Set permissions
chown -R lakshmi:lakshmi /opt/lakshmi/odin
chown -R lakshmi:lakshmi /var/log/lakshmi/odin

# Enable and start service
systemctl enable odind
systemctl start odind
```

## Adapter Configuration

### NSE NEAT (FIX) Setup

```bash
# Generate FIX session credentials
odinctl adapter setup --type nse_neat

# Test connectivity
odinctl adapter test --adapter nse_neat_primary

# Verify logon
grep "FIX.*Logon" /var/log/lakshmi/odin/odin.log
```

### ODIN Diet Setup

```bash
# Verify connectivity to ODIN Diet server
telnet 192.168.10.200 9001

# Test order (outside market hours)
odinctl adapter test-order --adapter nse_diet_backup --symbol RELIANCE
```

## Verification Checklist

- [ ] `odind --version` returns v3.0.0
- [ ] Service started: `systemctl status odind`
- [ ] All adapters show CONNECTED: `odinctl adapter status`
- [ ] Database tables created: `odinctl db status`
- [ ] MQ subscriptions active: `odinctl mq status`
- [ ] Test order placed (outside market hours): `odinctl adapter test-order`
- [ ] Execution reports being published to MQ
- [ ] Prometheus metrics at `:9195/metrics`
- [ ] EOD reconciliation runs successfully
