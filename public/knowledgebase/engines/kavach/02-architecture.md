# 02 — Architecture
> **Version:** 3.5.0 | **Owner:** Risk | **Last Updated:** 2026-07-24
## System Architecture
Kavach follows an **event-driven reactive architecture** where Greek computations are triggered by every price tick, and adjustment signals are generated when neutrality thresholds drift.
## Architecture Diagram
~~~
Lakshmi Ticks -> Greek Calculator -> Strategy Monitors -> Adjustment Engine -> Signal Dispatcher -> Consumers
Suchak/Manthan --> Threshold Calibrator --^
~~~
## Core Components
### 1. Greek Calculator
Computes Black-Scholes Greeks for every option in every active strategy on each tick:
- **Delta (?):** Rate of change in option price per unit change in underlying
- **Gamma (G):** Rate of change in Delta per unit change in underlying
- **Theta (T):** Time decay of option value per day
- **Vega (?):** Sensitivity to 1% change in implied volatility
### 2. Strategy Monitor
Each strategy has its own Greek budget and drift tolerance:
- **Delta Budget:** Max allowed net delta (±X%)
- **Gamma Limit:** Max gamma exposure
- **Theta Target:** Desired daily theta (positive for sellers)
- **Vega Cap:** Max vega exposure to avoid IV crush
### 3. Threshold Calibrator
Adjusts Greek thresholds based on Manthan's regime intelligence. Tighter thresholds in volatile/uncertain regimes.
### 4. Adjustment Engine
When a strategy drifts beyond threshold, computes the optimal hedge:
- Which instrument (futures, options, underlying)
- What quantity
- What strike (for options)
- Estimated cost of adjustment
### 5. Signal Dispatcher
Routes adjustment signals to appropriate consumers with priority and urgency flags.
## Technology Stack
| Layer | Technology |
|-------|------------|
| Runtime | C++ (low-latency) |
| Greek Calc | Custom Black-Scholes with dividends |
| IPC | ZeroMQ + Cap'n Proto |
| State Store | Redis |
| Monitoring | Prometheus + Grafana |
| Deployment | Kubernetes (3-replica) |
