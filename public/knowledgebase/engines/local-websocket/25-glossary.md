# 25 — Glossary

> **Version:** v2.5.0 | **Owner:** Infrastructure | **Last Updated:** 2026-07-25

## B

**Backpressure:** A flow control mechanism where a server slows down or drops messages when a client cannot consume fast enough. The WebSocket server supports configurable backpressure strategies.

**Binary Frame:** A WebSocket frame type that carries arbitrary binary data. Used by MessagePack serialization for compact message delivery.

## C

**CORS (Cross-Origin Resource Sharing):** A browser security mechanism that controls which origins can access a resource. WebSocket upgrade requests are subject to CORS.

**Close Code:** A numeric code sent in the WebSocket close frame indicating the reason for connection termination. Standard codes: 1000 (normal), 1001 (going away), custom codes: 4001 (unauthorized), 4003 (forbidden), 4008 (rate limited).

## D

**Drop Oldest:** A backpressure strategy where the oldest unacknowledged message in the send buffer is dropped to make room for new messages.

## E

**Event Loop Lag:** The delay between when a task is scheduled and when it executes in the Node.js event loop. High lag indicates the server is CPU-bound.

## J

**JWT (JSON Web Token):** A compact, URL-safe token format used for authentication. Contains claims about the client, signed by Suraksha IAM.

**JWKS (JSON Web Key Set):** A set of public keys used to verify JWT signatures, published by Suraksha IAM.

## M

**MessagePack:** A binary serialization format that is more compact than JSON. Used for efficient WebSocket data delivery.

**MQ Consumer Pool:** A set of MQ consumer instances managed by the WebSocket server, one per unique subscribed topic, shared across all WebSocket clients.

## P

**Per-Message Deflate:** A WebSocket extension that compresses message payloads using the deflate algorithm, reducing bandwidth usage at the cost of CPU.

**Ping/Pong:** WebSocket control frames used to keep connections alive. The server sends pings every 30 seconds and expects pongs within 90 seconds.

## S

**Sticky Session:** A load balancing technique where all requests from a client are routed to the same backend server. Important for WebSocket because connections are stateful.

**Subscription Aggregator:** The component that maps MQ topics to sets of WebSocket client connections, enabling efficient fan-out without per-client MQ consumers.

## T

**Text Frame:** A WebSocket frame type that carries UTF-8 text data. Used by JSON serialization for human-readable message delivery.

**Token Bucket:** A rate-limiting algorithm where tokens are added to a bucket at a fixed rate, and each message consumes one token. If the bucket is empty, the message is dropped.

## U

**uWebSockets.js:** A high-performance C++ WebSocket library with Node.js bindings, providing 10x better performance than pure-JS WebSocket implementations. Handles HTTP, HTTPS, WebSocket, and pub/sub.

## W

**WSS (WebSocket Secure):** WebSocket over TLS, the encrypted version of the WebSocket protocol. All production connections use WSS.

**WebSocket Upgrade:** The HTTP request/response exchange that upgrades an HTTP connection to the WebSocket protocol. Initiated by the client with specific headers (Connection: Upgrade, Upgrade: websocket).
