# 05 — Builder Interface

> **Version:** 3.0.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## Interface Layout

```
┌─────────────────────────────────────────────────────────────┐
│  TOOLBAR (Undo, Redo, Zoom, Validate, Export, Settings)      │
├──────────┬──────────────────────────────────┬───────────────┤
│ PALETTE  │                                  │  INSPECTOR    │
│          │                                  │               │
│ Signals  │        CANVAS                    │  Block Name   │
│          │                                  │  Parameters   │
│ Filters  │    [Block]──[Block]              │  Inputs       │
│          │       │                          │  Outputs      │
│ Actions  │    [Block]                       │  Validation   │
│          │                                  │               │
│ Risk     │                                  │  Help         │
│          │                                  │               │
│ Flow     │                                  │               │
│          │                                  │               │
├──────────┴──────────────────────────────────┴───────────────┤
│  STATUS BAR (Connected, Auto-saved, Compiler Ready)          │
└─────────────────────────────────────────────────────────────┘
```

## Toolbar

| Button | Function | Shortcut |
|---|---|---|
| Undo | Revert last action | `Ctrl+Z` |
| Redo | Re-apply undone action | `Ctrl+Y` |
| Zoom In | Increase canvas zoom | `Ctrl+Plus` |
| Zoom Out | Decrease canvas zoom | `Ctrl+Minus` |
| Fit View | Auto-fit all blocks | `Ctrl+0` |
| Validate | Run compiler validation | `Ctrl+Shift+V` |
| Export | Generate strategy JSON | `Ctrl+Shift+E` |
| Settings | Open strategy settings | `Ctrl+,` |

## Palette Categories

### Signals (Green)
Entry trigger blocks: Moving Average, RSI, MACD, Bollinger Bands, Volume Spike, Price Action, Custom Indicator, Time-Based, News Sentiment, Composite Signal

### Filters (Blue)
Market condition filters: Trend Filter, Volatility Filter, Volume Filter, Time Filter, Day-of-Week Filter, Correlation Filter

### Actions (Orange)
Order execution blocks: Market Order, Limit Order, Bracket Order, Cover Order, OCO (One-Cancels-Other), Modify Order, Cancel All

### Risk (Red)
Risk control blocks: Stop-Loss (Fixed), Stop-Loss (Trailing), Take-Profit, Position Sizer, Max Exposure, Max Drawdown, Cooldown Timer

### Flow (Gray)
Logic flow blocks: AND Gate, OR Gate, NOT Gate, Switch/Case, Loop (Time), Loop (Condition), Delay, Parallel Split, Merge

## Canvas Operations

| Action | Gesture |
|---|---|
| Add block | Drag from palette to canvas |
| Move block | Click and drag |
| Connect | Drag from output port to input port |
| Delete | Select + `Delete` key |
| Duplicate | `Ctrl+D` on selected block |
| Group select | Shift+click or drag selection box |
| Pan | Right-click + drag or middle mouse button |

## Inspector Panel

The right panel shows properties of the selected block:

1. **Block Name** — Editable display name
2. **Parameters** — Block-specific configuration fields
3. **Input Ports** — Incoming connections and their types
4. **Output Ports** — Outgoing connections
5. **Validation** — Real-time validation messages
6. **Help** — Inline documentation for the block type
