# TalkDelta AI — Configuration

**Version:** 1.4.0 | **Owner:** AI/ML | **Last Updated:** 2026-07-24

## Configuration File

`/etc/talkdelta-ai/config.yaml` or environment variables with `TAI_` prefix.

## Key Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `TAI_PORT` | `3010` | API port |
| `TAI_TALKDELTA_URL` | `http://192.168.190.104:3005` | TalkDelta API base URL |
| `TAI_MQ_HOST` | `192.168.190.118` | MQ broker address |
| `TAI_MONGO_URI` | `mongodb://localhost:27017/talkdelta-ai` | MongoDB connection string |
| `TAI_REDIS_HOST` | `localhost:6379` | Redis cache host |
| `TAI_INFERENCE_INTERVAL` | `10` | ML inference interval in seconds |
| `TAI_CONFIDENCE_THRESHOLD` | `0.65` | Minimum confidence to publish signal |
| `TAI_MODEL_RETRAIN_HOURS` | `24` | Automatic model retraining interval |
| `TAI_FEATURE_WINDOW` | `100` | Number of data points for feature window |

## Environment-Specific

Production uses GPU-accelerated inference on ALGO IQ 4. Staging runs CPU-only mode.
