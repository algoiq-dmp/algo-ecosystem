# 12 — JSON Generation

> **Version:** 3.0.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## Overview

The JSON Generation module is the final stage of the Strategy Compiler. It transforms the visual strategy graph into a structured, machine-readable JSON payload consumed by all downstream engines: Parikshak, Simulator, DXCC, and Kuber Alpha.

## Compilation Pipeline

```
Visual Graph → Parser → AST → Validator → Normalized IR → Code Generator → JSON
```

### Stage 1: Parser
Traverses the react-flow node graph, extracts block types, parameters, and connection topology.

### Stage 2: AST Builder
Constructs an Abstract Syntax Tree representing the logical flow of the strategy.

### Stage 3: Validator
Checks the AST for errors, missing fields, type mismatches, and rule violations.

### Stage 4: Normalized IR
Converts the AST into an Intermediate Representation with canonical field names and resolved references.

### Stage 5: Code Generator
Emits the final JSON document.

## JSON Schema (Excerpt)

```json
{
  "$schema": "https://schema.algo-iq.com/strategy/v3",
  "strategy": {
    "id": "sf-abc123",
    "name": "Trend Master",
    "version": "1.2.0",
    "created": "2026-07-24T10:30:00Z",
    "updated": "2026-07-24T14:00:00Z",
    "author": "user@algo-iq.com",
    "metadata": {
      "description": "NIFTY 50 trend-following strategy",
      "market": "EQUITY",
      "timeframe": "1d",
      "exchange": "NSE"
    }
  },
  "entry": { },
  "exits": [],
  "risk": {},
  "positionSizing": {},
  "portfolio": {},
  "mq": {
    "routingKey": "strategy.factory.exported",
    "payloadVersion": "3.0"
  }
}
```

## Export Destinations

| Destination | MQ Routing Key | Description |
|---|---|---|
| Parikshak | `parikshak.incoming.strategy` | Testing and certification |
| Simulator | `simulator.incoming.strategy` | Historical backtesting |
| DXCC | `dxcc.review.strategy` | Compliance review |
| Kuber Alpha | `kuber.incoming.strategy` | Production deployment |

## Export Options

| Option | Description |
|---|---|
| `includeMetadata` | Embed author, timestamps, description |
| `includeComments` | Preserve block-level comments in JSON |
| `prettyPrint` | Human-readable formatted JSON |
| `compress` | Minified JSON for machine consumption |
| `partialExport` | Export only modified blocks since last version |

## Versioning

Each export increments the strategy's version number:
- **Patch** (1.2.0 → 1.2.1): Minor parameter tweaks
- **Minor** (1.2.0 → 1.3.0): New block added or reconfigured
- **Major** (1.2.0 → 2.0.0): Structural change (new logic, new flow)

## Error Handling

| Error Code | Message |
|---|---|
| `E101` | Compilation failed — missing entry signal |
| `E102` | Compilation failed — circular dependency |
| `E103` | Compilation failed — risk rules violated |
| `E104` | Validation timeout — graph too complex (>200 nodes) |
| `E105` | Block parameter out of allowed range |
