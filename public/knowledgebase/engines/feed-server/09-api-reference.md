# 09 — API Reference

> **Version:** v2.8.0 | **Owner:** Market Data | **Last Updated:** 2026-07-25

## gRPC Management API

The Feed Server exposes a gRPC management API on port 50051.

### Service: FeedManagement

#### GetFeedStatus

```
rpc GetFeedStatus(FeedStatusRequest) returns (FeedStatusResponse);
```

Returns current status of all configured feeds.

**Request:**
```protobuf
message FeedStatusRequest {
  repeated string exchange_codes = 1; // empty = all
}
```

**Response:**
```protobuf
message FeedStatusResponse {
  repeated FeedInfo feeds = 1;
}
message FeedInfo {
  string exchange = 1;
  string segment = 2;
  FeedState state = 3;
  uint64 last_seq = 4;
  uint64 msgs_processed = 5;
  uint64 gaps_detected = 6;
  double latency_p99_us = 7;
  Timestamp last_msg_time = 8;
}
```

#### PauseFeed / ResumeFeed

```
rpc PauseFeed(PauseRequest) returns (PauseResponse);
rpc ResumeFeed(ResumeRequest) returns (ResumeResponse);
```

Admin commands to pause or resume a specific feed without restarting the process. Used during exchange maintenance windows.

#### ReplayRequest

```
rpc ReplayRequest(ReplayReq) returns (ReplayAck);
```

Request historical tick replay for backtesting.

**Request:**
```protobuf
message ReplayReq {
  string exchange = 1;
  string segment = 2;
  google.protobuf.Timestamp start_time = 3;
  google.protobuf.Timestamp end_time = 4;
  float speed_multiplier = 5; // 1.0 = real-time, 100.0 = 100x
}
```

## MQ Publish Topics

| Topic Pattern | Content | Partition Key |
|---------------|---------|---------------|
| `feed.{exchange}.{segment}.tick` | Canonical tick/trade messages | symbol_id |
| `feed.{exchange}.{segment}.quote` | Best bid/ask quotes | symbol_id |
| `feed.{exchange}.{segment}.ob` | Order book snapshots | symbol_id |
| `feed.{exchange}.{segment}.index` | Index values | index_code |
| `feed.market.status` | Market status changes | exchange |
| `feed.reference.instruments` | Instrument master updates | exchange |

## Prometheus Metrics Endpoint

Available at `http://<host>:9090/metrics`.

### Key Metrics

| Metric | Type | Description |
|--------|------|-------------|
| `feedd_msgs_ingested_total{exchange,segment}` | Counter | Total messages ingested since start |
| `feedd_msgs_published_total{exchange,segment}` | Counter | Total messages published to MQ |
| `feedd_latency_p99_us{exchange,segment}` | Gauge | p99 ingest-to-publish latency |
| `feedd_gaps_detected_total{exchange,segment}` | Counter | Total sequence gaps detected |
| `feedd_gap_recovery_duration_sec` | Histogram | Gap recovery duration distribution |
| `feedd_ringbuf_utilization_pct` | Gauge | Ring buffer fill percentage |
| `feedd_mq_publish_queue_depth` | Gauge | Pending messages in MQ publish queue |
| `feedd_nic_rx_drops{port}` | Counter | NIC RX packet drops |

## CLI Tools

```
# View feed status
feeddctl status --exchange NSE --segment CM

# Pause a feed
feeddctl pause --exchange BSE --segment FO

# Request replay
feeddctl replay --exchange NSE --segment CM \
    --start "2026-07-24T09:15:00+05:30" \
    --end "2026-07-24T15:30:00+05:30" \
    --speed 50
```
