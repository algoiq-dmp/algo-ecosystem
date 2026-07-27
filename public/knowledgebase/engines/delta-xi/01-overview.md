# Delta XI — Overview

**Version:** 3.2.0 | **Owner:** Analytics | **Last Updated:** 2026-07-24

## What Is Delta XI?

Delta XI is a market screening engine that continuously scans live market data to identify trading opportunities. It consumes data from Surya (exchange reference files), Lakshmi (real-time prices), and TalkOptions (options analytics including Greeks, IV, OI) and applies configurable multi-condition filters to generate ranked opportunity signals.

## Why Was It Built?

Manual market scanning is time-consuming and error-prone. Delta XI automates opportunity discovery by applying predefined screening logic across thousands of instruments simultaneously, ensuring no actionable setup is missed.

## Business Objective

Automate market screening to generate high-quality trading signals for Kuber Alpha. Reduce the cognitive load on traders by surfacing only the highest-ranked opportunities based on configurable criteria.

## Scope

- Multi-condition market screening across equities, indices, and options
- Real-time signal generation with opportunity ranking
- Integration with Kuber Alpha for strategy activation
- Market alerts and notification delivery to DXCC
