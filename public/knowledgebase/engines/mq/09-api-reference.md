# 09 — API Reference

> **Version:** v5.1.3 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## Client API (C++)

### Producer API

```cpp
class MqProducer {
public:
    struct Config {
        std::string broker_address;        // "mq01-mum:9092"
        std::string client_id;
        int32_t batch_size = 256;
        int32_t linger_ms = 5;
        CompressionType compression = CompressionType::ZSTD;
    };

    explicit MqProducer(const Config& config);
    ~MqProducer();

    // Async produce with callback
    void produce(const std::string& topic,
                 const std::string& key,
                 const std::vector<uint8_t>& payload,
                 std::function<void(const ProduceResult&)> callback);

    // Sync produce (blocks until acknowledged)
    ProduceResult produceSync(const std::string& topic,
                              const std::string& key,
                              const std::vector<uint8_t>& payload,
                              int32_t timeout_ms = 5000);

    // Flush all pending batches
    void flush(int32_t timeout_ms = 30000);

    // Metrics
    ProducerMetrics metrics() const;
};
```

### Consumer API

```cpp
class MqConsumer {
public:
    struct Config {
        std::string broker_address;
        std::string group_id;
        std::string client_id;
        int32_t fetch_min_bytes = 1;
        int32_t fetch_max_bytes = 1048576;  // 1 MB
        int32_t fetch_max_wait_ms = 500;
        AutoOffsetReset auto_offset_reset = AutoOffsetReset::EARLIEST;
    };

    explicit MqConsumer(const Config& config);
    ~MqConsumer();

    void subscribe(const std::vector<std::string>& topics);

    // Poll for messages (non-blocking if timeout_ms = 0)
    std::vector<ConsumerRecord> poll(int32_t timeout_ms = 100);

    // Commit offsets
    void commitSync();
    void commitAsync(std::function<void(const CommitResult&)> callback);

    // Get current assignment
    std::vector<TopicPartition> assignment() const;

    // Close consumer gracefully
    void close();
};
```

## gRPC Admin API

### Service: MqAdmin

```protobuf
service MqAdmin {
    rpc CreateTopic(CreateTopicRequest) returns (CreateTopicResponse);
    rpc DeleteTopic(DeleteTopicRequest) returns (DeleteTopicResponse);
    rpc ListTopics(ListTopicsRequest) returns (ListTopicsResponse);
    rpc DescribeTopic(DescribeTopicRequest) returns (DescribeTopicResponse);
    rpc AlterTopic(AlterTopicRequest) returns (AlterTopicResponse);
    rpc ListConsumerGroups(ListGroupsRequest) returns (ListGroupsResponse);
    rpc DescribeGroup(DescribeGroupRequest) returns (DescribeGroupResponse);
    rpc DeleteGroup(DeleteGroupRequest) returns (DeleteGroupResponse);
    rpc GetClusterHealth(ClusterHealthRequest) returns (ClusterHealthResponse);
    rpc ReassignPartitions(ReassignRequest) returns (ReassignResponse);
    rpc GetBrokerMetrics(BrokerMetricsRequest) returns (BrokerMetricsResponse);
}
```

### CreateTopicRequest

```protobuf
message CreateTopicRequest {
    string name = 1;
    int32 partitions = 2;            // default: 8
    int32 replication_factor = 3;    // default: 3
    int64 retention_ms = 4;          // default: 604800000 (7 days)
    int64 retention_bytes = 5;       // default: -1 (unlimited)
    bool cross_dc_mirror = 6;        // default: false
    CompressionType compression = 7; // default: ZSTD
}
```

## Prometheus Metrics

| Metric | Type | Description |
|--------|------|-------------|
| `mq_messages_in_total{topic}` | Counter | Total messages produced |
| `mq_messages_out_total{topic}` | Counter | Total messages consumed |
| `mq_bytes_in_total{topic}` | Counter | Total bytes produced |
| `mq_bytes_out_total{topic}` | Counter | Total bytes consumed |
| `mq_produce_latency_ms{topic}` | Histogram | Produce request latency |
| `mq_fetch_latency_ms{topic}` | Histogram | Fetch request latency |
| `mq_partition_count{topic}` | Gauge | Number of partitions |
| `mq_under_replicated_partitions` | Gauge | Partitions below min ISR |
| `mq_active_connections` | Gauge | Active client connections |
| `mq_consumer_lag{topic,group}` | Gauge | Messages behind per consumer group |
| `mq_raft_leader_elections_total` | Counter | Total leader elections |

## CLI: mqctl

```bash
# Topic management
mqctl topic create --name "feed.NSE.CM.tick" --partitions 16 --replication 3
mqctl topic list
mqctl topic describe --name "feed.NSE.CM.tick"
mqctl topic delete --name "test.foo"

# Consumer groups
mqctl group list
mqctl group describe --group "strategy-arjun-nifty"
mqctl group reset-offset --group "strategy-arjun-nifty" --topic "feed.NSE.CM.tick" --to earliest

# Cluster health
mqctl cluster health
mqctl broker metrics --broker mq01-mum
```
