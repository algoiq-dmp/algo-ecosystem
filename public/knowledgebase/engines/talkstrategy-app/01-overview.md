# TalkStrategy App — Overview

**Version:** 2.5.0 | **Owner:** Frontend | **Last Updated:** 2026-07-24

## What Is TalkStrategy App?

TalkStrategy App is the middleware and management UI layer for trade execution in the Algo IQ ecosystem. It serves two primary functions: (1) as middleware, it routes validated trade requests from TalkStrategy API to the Vega Order Processor and propagates trade confirmations back; (2) as a UI, it provides strategy management dashboards for monitoring execution, managing configurations, and tracking order status.

## Why Was It Built?

The execution pipeline needed a dedicated middleware layer to handle request routing, delivery guarantees, and response propagation between the API layer and the order processor. Additionally, traders needed a visual interface to monitor execution flow and manage strategy configurations.

## Business Objective

Ensure reliable, guaranteed-delivery communication between TalkStrategy API and the Vega Order Processor. Provide a strategy management UI for execution monitoring and configuration management.

## Scope

- Middleware routing of execution requests to Vega
- Guaranteed delivery with acknowledgment tracking
- Trade confirmation propagation back to API
- Strategy management dashboard UI
- Execution monitoring and order status tracking
