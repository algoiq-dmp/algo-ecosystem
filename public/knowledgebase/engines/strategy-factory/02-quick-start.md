# 02 — Quick Start Guide

> **Version:** 3.0.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## Prerequisites

- Access to the Algo-IQ platform (contact your admin for credentials)
- Modern browser (Chrome 120+, Firefox 121+, Edge 120+)
- Basic understanding of trading concepts

## 5-Minute Quick Start

### Step 1: Access Strategy Factory

Navigate to `https://platform.algo-iq.com/strategy-factory` and log in with your credentials.

### Step 2: Create a New Strategy

1. Click the **+ New Strategy** button in the top-right corner.
2. Enter a **Strategy Name** (e.g., "My First Strategy").
3. Select a **Template** or start from **Blank Canvas**.
4. Click **Create**.

### Step 3: Build Your First Strategy

1. **Add an Entry Block**: From the left palette, drag an **Entry Signal** block onto the canvas.
2. **Configure the Signal**: Click the block to open the Inspector panel. Set:
   - Instrument: `NIFTY 50`
   - Condition: `Moving Average Crossover`
   - Fast MA: `20`
   - Slow MA: `50`
3. **Add an Exit Block**: Drag an **Exit Logic** block next to the Entry block.
4. **Connect Blocks**: Click the output port on Entry and drag a connection line to Exit.
5. **Configure Exit**: Set stop-loss to `2%` and take-profit to `4%`.
6. **Add Risk Rules**: Drag a **Risk Manager** block and connect it. Set max position size to `10%` of portfolio.

### Step 4: Validate

Click **Validate** in the toolbar. The compiler checks for:
- Missing connections
- Conflicting rules
- Unconfigured required fields
- Logical errors (e.g., unreachable paths)

Fix any errors shown in the validation panel.

### Step 5: Export

1. Click **Export** → **Generate JSON**.
2. Review the generated JSON in the preview panel.
3. Click **Send to Parikshak** to begin testing.

## What's Next?

- Read about the [Builder Interface](05-builder-interface.md) in detail
- Learn [Entry Logic](07-entry-logic.md) techniques
- Understand the full [Lifecycle](13-lifecycle.md)
- Configure [Risk Rules](09-risk-rules.md)
