# 13 â€” Deployment Guide

**Version:** 3.0.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-24

---

## Deployment Environments

| Environment | URL |
|---|---|
| Development | `http://localhost:3003` |
| Staging | `https://narad-staging.algoiq.io` |
| Production | `https://narad.algoiq.io` |

## Control Plane Deployment (Kubernetes)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: narad-control-plane
spec:
  replicas: 3
  selector:
    matchLabels:
      app: narad-cp
  template:
    spec:
      containers:
      - name: narad-cp
        image: algoiq/narad-control-plane:3.0.0
        ports:
        - containerPort: 3003
        - containerPort: 50051
        - containerPort: 3004
        - containerPort: 9091
        env:
        - name: NODE_ENV
          value: "production"
        livenessProbe:
          httpGet:
            path: /api/v1/health
            port: 3003
        readinessProbe:
          httpGet:
            path: /api/v1/health
            port: 3003
---
apiVersion: v1
kind: Service
metadata:
  name: narad-grpc
spec:
  type: ClusterIP
  ports:
  - port: 50051
    targetPort: 50051
```

## Agent Deployment

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: narad-agent
spec:
  selector:
    matchLabels:
      app: narad-agent
  template:
    spec:
      hostNetwork: true
      hostPID: true
      containers:
      - name: narad-agent
        image: algoiq/narad-agent:3.0.0
        env:
        - name: NARAD_CP_HOSTS
          value: "narad-grpc:50051"
        volumeMounts:
        - name: host
          mountPath: /host
          readOnly: true
      volumes:
      - name: host
        hostPath:
          path: /
```

## Deployment Checklist

- [ ] All tests passing on CI
- [ ] gRPC protobuf definitions match between CP and Agent versions
- [ ] Database migrations tested on staging
- [ ] Agent backward compatibility verified
- [ ] All managed servers have Agent installed and connected
- [ ] Dashboard accessible and showing all services
- [ ] PagerDuty integration tested

## Rollback

```bash
kubectl rollout undo deployment/narad-control-plane
```

Agent rollback is handled automatically â€” Agents always connect to whichever CP version is active and are backward-compatible with one major version behind.
