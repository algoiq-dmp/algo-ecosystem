# Narad Engine — Glossary

**Version:** 2.0.2 | **Owner:** Infrastructure | **Last Updated:** 2026-07-24

---

## A

| Term | Definition |
|---|---|
| **API Gateway** | Edge service that routes external API requests to internal microservices with auth, rate limiting, and logging |
| **Auto-Discovery** | Mechanism by which Narad nodes automatically detect and register peers without manual configuration |

## B

| Term | Definition |
|---|---|
| **Broker Adapter** | Protocol-specific connector that translates internal message formats to broker FIX/REST/WebSocket APIs |
| **Broker Integration** | End-to-end connectivity from Narad Hub to external broker or exchange gateway |

## C

| Term | Definition |
|---|---|
| **Certificate Authority** | Internal CA used by Narad to issue and manage mTLS certificates for inter-node communication |
| **Circuit Breaker** | Pattern that stops traffic to a failing downstream service to prevent cascading failures |
| **Connection Pool** | Pre-established set of persistent connections (FIX/TCP/WebSocket) reused for message delivery |
| **Connectivity Hub** | Core Narad component managing all external connections, routing, and protocol translation |

## F

| Term | Definition |
|---|---|
| **FIX Adapter** | Narad component implementing Financial Information eXchange protocol for broker communication |
| **FIX Engine** | High-performance FIX session manager handling logon, heartbeat, sequence numbers, and resend requests |
| **FIX Session** | Persistent TCP connection identified by SenderCompID + TargetCompID pair |

## H

| Term | Definition |
|---|---|
| **Health Check** | Periodic probe verifying connectivity status and latency of all managed connections |
| **Heartbeat** | Periodic keep-alive message (FIX MsgType=0) exchanged to maintain session liveliness |
| **Hub-and-Spoke** | Narad architectural pattern where the Hub routes messages to spoke adapters for each broker |

## L

| Term | Definition |
|---|---|
| **Latency SLA** | Service Level Agreement committing to maximum message delivery latency (target: <1ms internal, <5ms external) |
| **Load Balancer** | Distributing incoming connection requests across multiple Narad nodes for high availability |
| **Log Aggregation** | Centralized collection and indexing of logs from all Narad nodes for monitoring and debugging |

## M

| Term | Definition |
|---|---|
| **Message Queue** | Asynchronous buffer (via MQ) for messages awaiting delivery when connections are temporarily unavailable |
| **mTLS** | Mutual TLS — both client and server authenticate using certificates for encrypted bi-directional communication |

## N

| Term | Definition |
|---|---|
| **Narad** | Universal connectivity hub providing hub-and-spoke architecture for all external broker/exchange connections |
| **Node** | Single instance of the Narad service running on a server within the cluster |

## O

| Term | Definition |
|---|---|
| **Orchestrator** | Narad component managing deployment, configuration sync, and remote commands across all nodes |

## P

| Term | Definition |
|---|---|
| **Port Forwarding** | Tunnel mechanism for secure access to remote broker servers through Narad relay |
| **Protocol Adapter** | Pluggable module translating internal Narad messages to/from a specific external protocol |

## R

| Term | Definition |
|---|---|
| **Remote Command** | Administrator-invoked operation executed across one or more Narad nodes (restart, config reload, etc.) |
| **Resend Request** | FIX message (MsgType=2) requesting retransmission of missed messages based on sequence gaps |
| **Retry Policy** | Configurable exponential backoff strategy for reconnecting failed connections |

## S

| Term | Definition |
|---|---|
| **Sequence Number** | Monotonically increasing FIX message counter per session (MsgSeqNum, Tag 34) |
| **Service Registry** | In-memory catalog of all active Narad nodes, their health status, and managed connections |
| **SSL Termination** | Narad handling TLS decryption at the edge before forwarding plaintext to internal services |

## T

| Term | Definition |
|---|---|
| **TCP Tunnel** | Encrypted tunnel over TCP established by Narad for secure remote broker connectivity |
| **Throttling** | Rate limiting applied to outgoing messages to prevent overwhelming downstream brokers |

## U

| Term | Definition |
|---|---|
| **Universal Connectivity** | Narad's design principle: a single hub connects to all external endpoints regardless of protocol |

## W

| Term | Definition |
|---|---|
| **WebSocket Adapter** | Narad protocol adapter handling WebSocket connections (RFC 6455) for real-time streaming APIs |
