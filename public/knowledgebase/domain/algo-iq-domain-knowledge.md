# Algo IQ Domain Knowledge Base

## Indian Stock Market Basics

- NSE is the largest stock exchange in India by derivatives turnover.
- BSE is the oldest stock exchange in Asia.
- Equity shares represent ownership in a company.
- The NIFTY 50 is NSE's benchmark index.
- The SENSEX is BSE's benchmark index.
- Market capitalization is price multiplied by shares outstanding.
- Large-cap stocks usually have higher liquidity.
- Mid-cap stocks carry moderate risk and growth potential.
- Small-cap stocks are more volatile.
- Free-float market capitalization excludes promoter holdings.
- Trading in India follows T+1 settlement for most equity trades.
- SEBI is the regulator of Indian securities markets.
- Clearing corporations guarantee settlement of trades.
- Demat accounts hold securities electronically.
- Trading accounts are required to place buy and sell orders.
- Pre-open session occurs before normal market trading.
- Normal market hours are 9:15 AM to 3:30 PM IST.
- Closing price is determined through the closing auction process.
- Circuit filters restrict extreme price movements.
- Upper circuit limits maximum intraday price rise.
- Lower circuit limits maximum intraday price fall.
- Volume indicates the number of shares traded.
- Turnover is traded quantity multiplied by traded price.
- Bid price is the highest buy price.
- Ask price is the lowest sell price.
- Bid-ask spread reflects market liquidity.
- Tick size is the minimum price movement.
- Delivery trades result in ownership transfer.
- Intraday trades are squared off on the same day.
- Corporate actions include dividends, bonuses, and splits.
- Stock splits reduce face value and increase share count.
- Bonus shares are issued free to shareholders.
- Dividends are cash distributions from company profits.
- Rights issues allow existing shareholders to buy additional shares.
- Buybacks reduce outstanding share capital.
- IPOs are initial public offerings of companies.
- FPOs are follow-on public offerings.
- OFS is offer for sale by existing shareholders.
- SME exchanges list smaller companies.
- Market holidays are announced by exchanges annually.

## Futures and Options Basics

- Futures are standardized derivative contracts.
- Options provide the right but not obligation to trade.
- Call options benefit from price rise.
- Put options benefit from price fall.
- Strike price is the agreed contract price.
- Expiry date is the contract settlement date.
- Weekly expiries are available for benchmark indices.
- Monthly expiries exist for index and stock derivatives.
- Futures require margin instead of full contract value.
- Options buyers pay premium upfront.
- Option sellers receive premium but carry higher risk.
- Open interest measures outstanding derivative contracts.
- Increase in open interest indicates fresh position creation.
- Long buildup occurs when price and open interest rise.
- Short buildup occurs when price falls and open interest rises.
- Long unwinding occurs when price and open interest fall.
- Short covering occurs when price rises and open interest falls.
- ATM means at-the-money option.
- ITM means in-the-money option.
- OTM means out-of-the-money option.
- Intrinsic value is immediate exercise value.
- Time value reflects remaining life of an option.
- Theta measures time decay.
- Delta measures option price sensitivity to underlying movement.
- Gamma measures change in delta.
- Vega measures sensitivity to implied volatility.
- Rho measures sensitivity to interest rates.
- Implied volatility is market-expected future volatility.
- IV Rank compares current IV with historical range.
- IV Percentile measures percentage of time IV stayed below current IV.
- Put-call ratio is put open interest divided by call open interest.
- Max pain estimates strike with minimum option holder payout.
- Calendar spreads use different expiries.
- Vertical spreads use different strikes.
- Iron condor combines two credit spreads.
- Straddle buys call and put at same strike.
- Strangle buys call and put at different strikes.
- Covered call involves holding stock and selling call.
- Protective put hedges a stock position.
- Futures settlement can be cash or physical.

## Market Data and Feed Knowledge

- Tick data contains every market update.
- OHLC represents open, high, low, and close prices.
- One-second candles aggregate tick data.
- Five-minute candles reduce market noise.
- Daily candles are used for positional analysis.
- WebSocket feeds provide real-time streaming data.
- REST APIs are used for snapshots and historical data.
- Feed latency affects trading execution quality.
- Exchange timestamps are more reliable than local system time.
- Sequence numbers help detect missing ticks.
- Heartbeat messages confirm feed connectivity.
- Stale ticks should be rejected by trading systems.
- Market depth shows bid and ask quantities.
- Top-of-book contains best bid and ask.
- Full market depth contains multiple price levels.
- Data normalization creates a uniform format across brokers.
- Historical data must be adjusted for splits and bonuses.
- Corporate action adjustments preserve price continuity.
- Time synchronization should use NTP servers.
- Feed handlers should reconnect automatically on disconnection.

## Algo Trading Fundamentals

- Algorithmic trading automates order execution.
- Rule-based systems reduce emotional trading.
- Backtesting evaluates strategy performance on historical data.
- Walk-forward testing checks out-of-sample robustness.
- Paper trading tests strategies without financial risk.
- Live trading requires broker API connectivity.
- Slippage is execution price difference from expected price.
- Brokerage and taxes must be included in backtests.
- Strategy drawdown measures peak-to-trough decline.
- Sharpe ratio measures risk-adjusted return.
- Profit factor is gross profit divided by gross loss.
- Win rate alone does not ensure profitability.
- Position sizing controls trade exposure.
- Fixed fractional sizing uses percentage of capital.
- Maximum daily loss protects trading capital.
- Maximum position limit reduces concentration risk.
- Correlated positions increase portfolio risk.
- Diversification across symbols reduces risk concentration.
- Strategy logs are essential for audit and debugging.
- Parameter optimization can lead to overfitting.
- Robust strategies perform across multiple market regimes.
- Trend-following works best in directional markets.
- Mean reversion works best in range-bound markets.
- Volatility strategies depend heavily on IV behavior.
- Event-driven strategies react to news and announcements.
- Latency-sensitive strategies need optimized infrastructure.
- Risk management is more important than signal accuracy.
- Capital preservation is the first objective of professional trading.
- Strategy deployment should use version control.
- Production and research environments should remain separate.

## OMS and RMS Knowledge

- OMS stands for Order Management System.
- RMS stands for Risk Management System.
- OMS routes orders to the exchange through broker gateways.
- RMS validates margin before order placement.
- Market orders execute at best available price.
- Limit orders execute at specified price or better.
- Stop-loss orders activate after trigger price is hit.
- IOC orders execute immediately or cancel remaining quantity.
- DAY orders remain active until market close.
- Order states include new, open, traded, cancelled, and rejected.
- Partial fills are common in less liquid instruments.
- Freeze quantity limits maximum order size.
- Large orders should be auto-sliced.
- Net position is buy quantity minus sell quantity.
- MTM is mark-to-market profit or loss.
- Span margin is risk-based initial margin.
- Exposure margin is additional exchange margin.
- Peak margin is collected through intraday snapshots.
- Margin utilization should be monitored continuously.
- RMS should block orders when limits are breached.

## Algo IQ Engine Ecosystem

- Ganesh Engine is the primary OHLC provider and market data source of truth.
- Suchak Engine performs analytical calculations on OHLC data and generates technical indicators (SIC-001).
- Lakshmi Engine distributes data to downstream consumers with pub-sub architecture.
- Surya Engine manages BOD and EOD processes and monitors exchange file availability.
- Garuda Engine performs options analytics, Greeks calculations (IV, delta, gamma, theta, vega), and margin intelligence.
- Vega Engine acts as the order execution processor communicating with broker APIs.
- Kavach Engine provides Delta Risk Protection for Kuber Alpha strategies, consuming analytics from TalkDelta.
- Manthan Engine performs portfolio churning analysis and market intelligence.
- Chitragupta Engine maintains audit trails and immutable logs.
- Rakshak Engine manages hedging adjustments and position protection.
- Narad Engine connects distributed services through APIs and monitors connectivity.
- Suraksha Layer secures inter-engine communication with auth, RBAC, and audit.

## Strategy and Analytics Knowledge

- ATR measures average true range volatility.
- VWAP represents volume weighted average price.
- SMA is simple moving average.
- EMA gives higher weight to recent prices.
- SuperTrend combines ATR with trend direction.
- RSI measures momentum strength.
- MACD compares fast and slow moving averages.
- Bollinger Bands expand and contract with volatility.
- Support is a demand zone below price.
- Resistance is a supply zone above price.
- Breakouts often require volume confirmation.
- False breakouts are common near major levels.
- Gap openings can create momentum opportunities.
- Trend strength improves when multiple timeframes align.
- Expiry-day behavior differs from normal trading days.
- Theta decay accelerates near option expiry.
- IV crush often occurs after major events.
- Delta hedging reduces directional exposure.
- Portfolio Greeks should be monitored continuously.
- Risk-reward ratio should be favorable before trade entry.

## Infrastructure and Operational Knowledge

- Production servers should have redundant power and network.
- SSD storage reduces data access latency.
- Dedicated lease lines improve connectivity stability.
- Firewall rules should allow only required ports.
- API keys must be encrypted at rest.
- Secrets should never be stored in source code.
- Daily backups are mandatory for trade databases.
- Disaster recovery procedures should be documented.
- Monitoring dashboards should track CPU, memory, and latency.
- Alerting should trigger before resource exhaustion.
- Log rotation prevents disk space issues.
- Health checks should run continuously on critical services.
- Graceful shutdown prevents data corruption.
- Blue-green deployment reduces production downtime.
- Change management should be documented for every release.
- Exchange circulars should be reviewed daily after market hours.
- Contract master files should be refreshed every morning.
- Token mapping should be versioned historically.
- Audit logs should be immutable for compliance purposes.
- Knowledge bases should be updated after every major release.
