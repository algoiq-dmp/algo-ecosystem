# 22 — Deployment

> **Version:** 4.1.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## Deployment Architecture

Suchak is deployed as a **Kubernetes Deployment** with 3 replicas for high availability, backed by a Redis StatefulSet for shared indicator cache.

```
┌──────────────────────────────────────────────────┐
│              Kubernetes (algo-iq-prod)            │
│                                                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐│
│  │ Suchak-0    │  │ Suchak-1    │  │ Suchak-2    ││
│  │ (Pod)       │  │ (Pod)       │  │ (Pod)       ││
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘│
│         │                │                │        │
│         └────────────────┼────────────────┘        │
│                          │                         │
│                   ┌──────┴──────┐                  │
│                   │   Redis     │                  │
│                   │ StatefulSet │                  │
│                   └─────────────┘                  │
└──────────────────────────────────────────────────┘
```

## Kubernetes Resources

### Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: suchak
  namespace: algo-iq-prod
spec:
  replicas: 3
  selector:
    matchLabels:
      app: suchak
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: suchak
        version: v4.1.0
    spec:
      containers:
      - name: suchak
        image: algoiq/suchak:4.1.0
        ports:
        - containerPort: 8080
          name: http
        - containerPort: 9090
          name: grpc
        - containerPort: 9091
          name: metrics
        resources:
          requests:
            cpu: "2"
            memory: "4Gi"
          limits:
            cpu: "4"
            memory: "8Gi"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 8080
          initialDelaySeconds: 15
          periodSeconds: 5
        env:
        - name: SUCHAK_ENV
          value: "production"
        - name: SUCHAK_REDIS_URL
          valueFrom:
            secretKeyRef:
              name: suchak-secrets
              key: redis_url
        volumeMounts:
        - name: config
          mountPath: /etc/suchak
          readOnly: true
        - name: certs
          mountPath: /etc/certs
          readOnly: true
      volumes:
      - name: config
        configMap:
          name: suchak-config
      - name: certs
        secret:
          secretName: suchak-certs
```

### ConfigMap

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: suchak-config
  namespace: algo-iq-prod
data:
  suchak.yaml: |
    # Full configuration as defined in 21-configuration.md
```

### Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: suchak
  namespace: algo-iq-prod
spec:
  type: ClusterIP
  selector:
    app: suchak
  ports:
  - name: http
    port: 8080
    targetPort: 8080
  - name: grpc
    port: 9090
    targetPort: 9090
  - name: metrics
    port: 9091
    targetPort: 9091
```

### HorizontalPodAutoscaler

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: suchak-hpa
  namespace: algo-iq-prod
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: suchak
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

## Deployment Process

### Canary Deployment

```
1. Deploy new version to 1 replica (Suchak-canary)
2. Route 10% traffic to canary for 1 hour
3. Monitor: error rate, latency, throughput
4. If healthy → Rolling update to all replicas
5. If unhealthy → Rollback canary immediately
```

### Rollback Procedure

```bash
kubectl rollout undo deployment/suchak -n algo-iq-prod
kubectl rollout status deployment/suchak -n algo-iq-prod
```

## CI/CD Pipeline

```
Git Push → GitHub Actions
  ├── Unit Tests (Rust: cargo test)
  ├── Integration Tests (against staging env)
  ├── Build Docker Image
  ├── Push to Container Registry
  ├── Deploy to Staging
  ├── Smoke Tests
  ├── Approval Gate
  └── Deploy to Production (Canary → Full)
```

## Environment Matrix

| Environment | Replicas | Resource Limits | Purpose |
|-------------|----------|-----------------|---------|
| dev | 1 | 1 CPU / 2Gi | Development |
| staging | 2 | 2 CPU / 4Gi | Pre-production testing |
| production | 3+ | 4 CPU / 8Gi | Live trading |

## Redis Setup

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: suchak-redis
  namespace: algo-iq-prod
spec:
  serviceName: suchak-redis
  replicas: 3
  selector:
    matchLabels:
      app: suchak-redis
  template:
    spec:
      containers:
      - name: redis
        image: redis:7.2-alpine
        ports:
        - containerPort: 6379
        resources:
          requests:
            cpu: "0.5"
            memory: "2Gi"
          limits:
            cpu: "2"
            memory: "4Gi"
        command: ["redis-server"]
        args: ["--maxmemory", "3gb", "--maxmemory-policy", "allkeys-lru"]
```

## Network Policies

Allows ingress only from authorized consumers:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: suchak-ingress
  namespace: algo-iq-prod
spec:
  podSelector:
    matchLabels:
      app: suchak
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: dxcc
    - podSelector:
        matchLabels:
          app: kuberalpha
    - podSelector:
        matchLabels:
          app: delta-xi
    - podSelector:
        matchLabels:
          app: talkdelta
    - podSelector:
        matchLabels:
          app: strategy-builder
    ports:
    - port: 8080
    - port: 9090
```
