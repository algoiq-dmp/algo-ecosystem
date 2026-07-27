# 01 — Overview

> **Version:** v5.1.3 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## What is MQ?

MQ is the Lakshmi ecosystem's primary publish/subscribe messaging infrastructure. It is a clustered, log-based message broker that provides ordered, durable, and replicated message delivery between all Lakshmi components. MQ is the nervous system of the platform — every market tick, order event, risk check, and monitoring alert flows through it.

## Position in Lakshmi

MQ sits at the center of all inter-component communication. Feed Servers publish market data; Strategy Engines consume ticks and publish order requests; ODIN consumes order requests and publishes execution reports; Narad consumes events for monitoring; Local WebSocket consumes normalized data for streaming to user interfaces.

## Design Philosophy

MQ was designed to meet the specific needs of algorithmic trading infrastructure: deterministic latency, strict ordering guarantees within partitions, zero data loss on broker failure, and the ability to sustain peak loads during market events like union budget announcements or expiry days.

## Core Concepts

### Topics and Partitions

A **topic** is a named category of messages (e.g., `feed.NSE.CM.tick`). Each topic is divided into one or more **partitions**, each of which is an ordered, immutable sequence of messages. Partitions enable horizontal scaling and parallel consumption.

### Producers and Consumers

**Producers** publish messages to topics, optionally specifying a partition key for routing. **Consumers** subscribe to topics and belong to **consumer groups** for load-balanced consumption. Each partition is consumed by exactly one consumer within a group.

### Brokers

A **broker** is a single MQ server process. Brokers form a **cluster**, with each broker managing a subset of partitions and serving as leader or follower for those partitions.

### Offsets

Each message in a partition has a unique, monotonically increasing **offset**. Consumers track their position via offsets, enabling them to resume from where they left off after a restart.

### Replication

Each partition has one **leader** and N **followers** (configurable, default 2). All produces and consumes go through the leader. Followers replicate the leader's log and can take over if the leader fails.

## Throughput at Scale

During peak trading (09:15-09:30 IST), MQ handles approximately 8 million messages per second across 200+ topics and 2,000+ partitions, with p99 end-to-end latency under 5 milliseconds.
