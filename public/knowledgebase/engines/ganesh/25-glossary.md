# Ganesh Engine — Glossary

**Version:** 2.1.0 | **Owner:** Data Engineering | **Last Updated:** 2026-07-24

---

## A

| Term | Definition |
|---|---|
| **Aggregation Window** | Configurable time interval (1s, 5s, 15s, 60s) over which ticks are grouped to form OHLC bars |
| **Ask Price** | The lowest price a seller is willing to accept; sourced from Level 1 quote tick |
| **ATR** | Average True Range — volatility indicator calculated from the range of OHLC bars over N periods |

## B

| Term | Definition |
|---|---|
| **Bar** | A consolidated OHLC data point representing a fixed time interval derived from raw tick data |
| **Bid Price** | The highest price a buyer is willing to pay; sourced from Level 1 quote tick |
| **BOD** | Beginning of Day — Ganesh initializes session state and loads symbol master at market open |

## C

| Term | Definition |
|---|---|
| **Candlestick** | Visual representation of OHLC data showing open, high, low, close for a given time interval |
| **Close Price** | The last traded price within a bar's time window; critical for indicator calculations |
| **Contract** | A tradable instrument identified by symbol + expiry + strike + option type |

## E

| Term | Definition |
|---|---|
| **EOD** | End of Day — Ganesh flushes buffers, persists final bars, and publishes close-of-day snapshot |
| **Expiry** | The date on which a derivative contract ceases to exist; sourced from symbol master via Surya |

## F

| Term | Definition |
|---|---|
| **Feed Server** | Upstream component that ingests raw exchange ticks via lease line and delivers to Lakshmi |
| **Full Bar** | An OHLC bar where all four price components (O, H, L, C) are populated from actual trades |

## G

| Term | Definition |
|---|---|
| **Ganesh** | Core OHLC bar aggregation engine — converts real-time tick streams into consolidated OHLC bars |
| **Gap** | Price discontinuity between consecutive bars where the open of bar N+1 differs from close of bar N |

## H

| Term | Definition |
|---|---|
| **Heikin-Ashi** | Modified candlestick calculation that averages price components to smooth trends |
| **High Price** | The maximum traded price observed within a bar's time window |
| **HLD** | High-Level Design document defining architecture, component interactions, and data flow |

## I

| Term | Definition |
|---|---|
| **Instrument Token** | Numeric identifier assigned by the exchange to uniquely reference a trading symbol |
| **Interval** | The bar duration in seconds — common values: 1, 5, 15, 60, 300, 900, 3600 |

## L

| Term | Definition |
|---|---|
| **Lakshmi** | Upstream real-time data distribution engine that feeds Ganesh with normalized tick streams |
| **Low Price** | The minimum traded price observed within a bar's time window |
| **LTP** | Last Traded Price — the most recent trade execution price for a given instrument |

## M

| Term | Definition |
|---|---|
| **Market Depth** | Level 2 data showing the order book beyond the best bid/ask; used for liquidity analysis |
| **Moving Average** | Rolling average of closing prices over N bars — SMA (simple), EMA (exponential), WMA (weighted) |

## O

| Term | Definition |
|---|---|
| **OHLC** | Open, High, Low, Close — the four canonical price components of a bar |
| **Open Interest** | Total number of outstanding derivative contracts at the end of a bar period |
| **Open Price** | The first traded price within a bar's time window |

## R

| Term | Definition |
|---|---|
| **Resolution** | Synonym for interval; the granularity of OHLC bars (e.g., 1-minute resolution, 5-minute resolution) |
| **Rolling Window** | Sliding time window used for real-time indicator computation over the most recent N bars |

## S

| Term | Definition |
|---|---|
| **SMA** | Simple Moving Average — arithmetic mean of closing prices over N bars |
| **Sparse Bar** | An OHLC bar where some price components are not populated due to no trades in the interval |
| **Symbol Master** | Authoritative reference table containing all tradable instruments, tokens, expiries, tick sizes |

## T

| Term | Definition |
|---|---|
| **Tick** | Atomic unit of market data — a single trade or quote update from the exchange |
| **Tick Stream** | Continuous sequence of raw tick data from the exchange lease line |
| **Timestamp** | Exchange-assigned epoch millisecond time for each tick event |

## V

| Term | Definition |
|---|---|
| **Volume** | Total quantity of shares/contracts traded within a bar's time window |
| **VWAP** | Volume-Weighted Average Price — sum of (price × volume) divided by total volume over the bar interval |
