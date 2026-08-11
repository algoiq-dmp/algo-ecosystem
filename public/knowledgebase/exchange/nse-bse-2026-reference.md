# India NSE–BSE Stock Exchange 2026 – Trader & API Developer Reference

## Quick Memory Card

| Rule | Value |
|---|---|
| NSE Weekly Expiry | **Tuesday** |
| BSE Weekly Expiry | **Thursday** |
| NSE Stock F&O Monthly | **Last Tuesday** |
| BSE Stock F&O Monthly | **Last Thursday** |
| Primary Key | **Token** (not symbol) |
| Contract Refresh | **Daily before 08:45 AM IST** |
| Lot Size Source | **Contract file (never hardcode)** |
| Closing Auction | **3:15–3:30 PM (CAS)** |

---

## 1. 2026 Expiry Changes

- NSE weekly expiry moved to **Tuesday** (from 1 Sep 2025)
- BSE weekly expiry set to **Thursday** (from 1 Sep 2025)
- SEBI permits only **one benchmark index per exchange** for weekly expiries
- NSE: NIFTY 50 weekly | BSE: SENSEX weekly
- All NSE stock derivatives monthly expiry: last Tuesday
- All BSE stock derivatives monthly expiry: last Thursday

## 2. Trading Sessions

| Session | Time |
|---|---|
| Pre-open | 09:00–09:08 |
| Buffer | 09:08–09:15 |
| Normal market | 09:15–15:30 |
| Closing auction (CAS) | 15:15–15:30 |
| Post close | 15:30 onwards |

## 3. Closing Auction Session (CAS) – 2026

- Official close determined through auction near 3:28–3:30 PM
- Can create sharp end-of-day index moves on expiry days
- Monitor indicative close separately from LTP

## 4. NSE FO Contract File Fields

| Field | Description |
|---|---|
| `TOKEN` | Exchange instrument token (**primary key**) |
| `SYMBOL` | Trading symbol |
| `INSTRUMENT` | OPTIDX / OPTSTK / FUTIDX / FUTSTK |
| `EXPIRY_DT` | Expiry date |
| `STRIKE_PR` | Strike price |
| `OPTION_TYP` | CE / PE |
| `LOT_SIZE` | Market lot |
| `TICK_SIZE` | Minimum price increment |
| `UNDERLYING` | Underlying symbol |
| `SERIES` | EQ / XX |

**Never use symbol as unique key. Always use TOKEN.**

## 5. NSE Instrument Codes

| Code | Meaning |
|---|---|
| EQ | Equity cash |
| FUTIDX | Index future |
| FUTSTK | Stock future |
| OPTIDX | Index option |
| OPTSTK | Stock option |

## 6. Token Rules

- Token changes every new contract
- Expired tokens become invalid
- Reload contract master daily before market open
- Keep token-history table for backtesting and audit
- Recommended DB key: `exchange + token`

## 7. Daily BOD Health Checklist

1. Contract file loaded
2. Token count validated
3. Feed connected
4. Time synchronized (NTP)
5. Expiry list generated
6. Margin files loaded
7. Strategy universe refreshed
8. Alert if any step fails

**Run before 08:45 AM IST**

## 8. Lot Size & Quantity Freeze

- Lot sizes are periodically revised; read from contract file daily
- Never store fixed lot size in strategy code
- Exchanges define freeze quantity limits; OMS should auto-slice large orders

## 9. Standard NSE Option Symbol Format

```
NIFTY26AUG24500CE
```

Pattern: `UNDERLYING + DDMMM + STRIKE + CE/PE`

Use exchange-provided symbol; avoid generating manually.

## 10. Recommended Internal Instrument Schema

```json
{
  "exchange": "NSE",
  "token": 26000,
  "symbol": "NIFTY26AUG24500CE",
  "instrument": "OPTIDX",
  "expiry": "2026-08-25",
  "strike": 24500,
  "optionType": "CE",
  "lotSize": 75,
  "tickSize": 0.05,
  "underlying": "NIFTY"
}
```

## 11. Tick Validation Rules

Reject ticks when:
- Token unknown
- Price ≤ 0
- Timestamp stale
- Sequence duplicated
- Exchange status halted

## 12. Expiry-Day Detection

```python
is_expiry = today == contract.expiry_date
```

Exchange-aware: NSE expiry → Tuesday | BSE expiry → Thursday

## 13. Daily Operational Alerts

- Expiry day (Tue NSE / Thu BSE)
- RBI policy day
- US CPI / Fed day
- Crude oil above \$85
- India VIX spike
- Exchange circular after 6 PM
- Lot-size revision notices
- Symbol addition/deletion notices

## 14. Top 10 Developer Mistakes

1. Hardcoding Thursday expiry
2. Using symbol instead of token
3. Not refreshing contract master daily
4. Ignoring lot-size changes
5. Ignoring freeze quantity
6. Assuming token permanence
7. Using local PC time instead of exchange time
8. Not handling holiday-shifted expiry
9. Not validating stale ticks
10. Not separating NSE and BSE expiry calendars

## 15. Margin Rules

- Calendar spread benefits reduce sharply on expiry day
- Intraday margin can increase suddenly near expiry
- Peak margin collected in multiple snapshots during the day
- RMS must monitor utilization continuously
