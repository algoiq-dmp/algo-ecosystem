# 12 — Installation

> **Version:** v2.5.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## Prerequisites

1. Node.js 22 LTS installed
2. Network access to MQ brokers (port 9092)
3. Network access to Suraksha IAM (port 443)
4. TLS certificates provisioned via Suraksha Vault
5. DNS entries for `ws.lakshmi.internal`

## Node.js Installation

```bash
# Using NodeSource repository
curl -fsSL https://rpm.nodesource.com/setup_22.x | bash -
dnf install -y nodejs

# Verify
node --version  # v22.x
npm --version
```

## Package Installation

```bash
# Install from Lakshmi npm registry
npm install -g @lakshmi/ws-server@2.5.0

# Or install from RPM
dnf install -y lakshmi-ws-server-2.5.0

# Verify
lakshmi-ws-server --version
```

## Post-Installation

```bash
# Create directories
mkdir -p /etc/lakshmi/ws-server
mkdir -p /var/log/lakshmi/ws-server
mkdir -p /opt/lakshmi/ws-server

# Copy default config
cp /opt/lakshmi/ws-server/config.example.yaml /etc/lakshmi/ws-server/config.yaml

# Edit configuration
vim /etc/lakshmi/ws-server/config.yaml

# Set permissions
chown -R lakshmi:lakshmi /var/log/lakshmi/ws-server
chown -R lakshmi:lakshmi /opt/lakshmi/ws-server

# Enable and start
systemctl enable lakshmi-ws-server
systemctl start lakshmi-ws-server

# Verify
curl http://localhost:8080/health
```

## TLS Certificate Setup

```bash
# Certificates are managed by Vault agent (automatic rotation)
# Vault agent template renders to:
#   /etc/lakshmi/certs/ws-server.crt
#   /etc/lakshmi/certs/ws-server.key
#   /etc/lakshmi/certs/ca.crt

# Verify certificate
openssl x509 -in /etc/lakshmi/certs/ws-server.crt -text -noout | grep -A2 "Validity"
```

## Verification Checklist

- [ ] Server starts without errors: `systemctl status lakshmi-ws-server`
- [ ] Health endpoint responds: `curl http://localhost:8080/health`
- [ ] WebSocket upgrade works: use `wscat` or browser console
- [ ] JWT authentication works: connect with valid token
- [ ] Subscribe/unsubscribe works: verify messages flow
- [ ] Prometheus metrics accessible: `curl http://localhost:9193/metrics`
- [ ] TLS handshake works: `openssl s_client -connect localhost:8443`

## Test Connection

```bash
# Install wscat for testing
npm install -g wscat

# Connect
wscat -c "ws://localhost:8080/ws" \
  -H "Authorization: Bearer $(cat /tmp/test-jwt.txt)" \
  -H "X-Format: json"

# In wscat prompt:
> {"type":"subscribe","id":"1","topics":["feed.NSE.CM.tick"]}
< {"type":"subscribed","id":"1","topics":["feed.NSE.CM.tick"]}
```
