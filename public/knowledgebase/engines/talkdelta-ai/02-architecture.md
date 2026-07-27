# TalkDelta AI — Architecture

**Version:** 1.4.0 | **Owner:** AI/ML | **Last Updated:** 2026-07-24

## Architecture Overview

TalkDelta AI follows a three-layer ML pipeline architecture:

- **talkdelta-ai-engine:** Core inference engine that runs trained ML models against live data streams. Generates signals, confidence scores, and recommendations.
- **talkdelta-ai-ml:** Model training, versioning, and evaluation module. Uses MongoDB for feature store and model registry. Supports periodic retraining on fresh data.
- **talkdelta-ai-api:** REST API exposing AI-generated signals, risk insights, and portfolio recommendations to Kuber Alpha and DXCC.

## Data Flow

```
TalkDelta (Trade Data) ──┐
MQ (Market Data) ────────┤
Lakshmi (Live Prices) ───┤
Surya (Ref Files) ───────┤
TalkOptions (Analytics) ─┴──> talkdelta-ai-engine ──> Redis (Feature Cache)
                                    │                        │
                                    ├──> talkdelta-ai-api ──> Kuber Alpha, DXCC
                                    └──> talkdelta-ai-ml ──> MongoDB (Models/Features)
```

1. Multi-source data ingested and normalized into feature vectors
2. ML inference engine scores opportunities in real time
3. API serves signals to Kuber Alpha; ML module handles offline model training
