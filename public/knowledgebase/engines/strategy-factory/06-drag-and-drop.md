# 06 — Drag-and-Drop System

> **Version:** 3.0.0 | **Owner:** Strategy | **Last Updated:** 2026-07-24

## Overview

The drag-and-drop system is the core interaction model of Strategy Factory. It is built on **react-flow** with custom extensions for trading-specific block semantics.

## Block Lifecycle

```
┌─────────┐    ┌──────────┐    ┌────────────┐    ┌───────────┐
│ Palette │───▶│  Canvas  │───▶│ Connected  │───▶│  Compiled │
│ (source)│    │ (placed) │    │ (wired)    │    │ (exported)│
└─────────┘    └──────────┘    └────────────┘    └───────────┘
```

## Supported DnD Operations

### Palette to Canvas
- Drag any block type from the palette onto the canvas.
- Block snaps to the nearest grid point (configurable: `canvasGridSize`).
- Default block dimensions: 180×80 px (resizable).
- If dropped near an existing block's output port, auto-connection is attempted.

### Canvas to Canvas
- Click and drag to reposition any block.
- Multi-select (Shift+click) then drag to move multiple blocks.
- Connection lines are preserved during moves and re-rendered.

### Connection DnD
- Hover over an output port (right edge of block) to reveal the drag handle.
- Drag from output port to input port (left edge of target block).
- Valid connection types are enforced: e.g., Signal output → Filter input (OK), Filter output → Signal input (Blocked).
- Invalid connections show a red highlight and rejection animation.

## Block Validation During DnD

| Rule | Error Message |
|---|---|
| Duplicate entry signals | "Only one entry signal block allowed unless merged via OR gate" |
| Circular connection | "Cycle detected — connection blocked" |
| Missing required input | "Block '<name>' requires at least one input connection" |
| Type mismatch | "Incompatible: Signal port cannot connect to Action port" |
| Max blocks exceeded | "Maximum 200 blocks per strategy reached" |

## Keyboard Shortcuts During DnD

| Shortcut | Action |
|---|---|
| `Ctrl+C` | Copy selected blocks |
| `Ctrl+V` | Paste copied blocks (offset +50px) |
| `Ctrl+D` | Duplicate selected (inline) |
| `Delete` | Remove selected blocks and their connections |
| `Escape` | Cancel current drag or deselect all |
| `Ctrl+A` | Select all blocks |
| `Arrow Keys` | Nudge selected blocks by 1 grid unit |

## Undo/Redo Stack

All drag-and-drop operations are recorded in the undo/redo stack:
- Block placement
- Block deletion
- Connection creation/deletion
- Block movement (debounced: records final position only after 300ms of inactivity)

Maximum stack depth: **50 operations**. Exceeding the limit drops the oldest entry.

## Accessibility

- All blocks are keyboard-focusable (Tab navigation).
- Enter/Space toggles block selection.
- Arrow keys + Alt to move selected blocks.
- Screen-reader labels describe block type and connection count.
