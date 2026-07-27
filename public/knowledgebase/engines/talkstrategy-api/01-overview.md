# TalkStrategy API — Overview

**Version:** 2.8.0 | **Owner:** Execution | **Last Updated:** 2026-07-24

## What Is TalkStrategy API?

TalkStrategy API is the centralized trade execution interface that receives order requests from all strategy and screening engines in the ecosystem. It acts as the single entry point for all automated trade execution, accepting requests from Kuber Alpha, Strategy Factory, AALAP Calls, Delta XI, VYUH, SpreadWatch, and Suchak, validating each request, and forwarding it to the TalkStrategy App middleware.

## Why Was It Built?

Before TalkStrategy API, each engine had its own ad-hoc interface to the execution layer, leading to inconsistent validation, difficult debugging, and no standardized request tracking. This API was built to provide a single, validated gateway for all trade execution requests.

## Business Objective

Provide a standardized, validated trade-firing interface that all strategy and screening engines use. Ensure only valid, properly formatted execution requests reach the Vega order processor. Track execution status and provide callbacks.

## Scope

- Accept trade execution requests from all engines
- Validate request parameters, symbols, quantities, and limits
- Forward validated requests to TalkStrategy App middleware
- Track execution status with Redis-backed persistence
- Provide execution status querying for upstream engines
