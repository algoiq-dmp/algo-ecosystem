# 23 — FAQ
> **Version:** 2.3.0 | **Owner:** Risk | **Last Updated:** 2026-07-24
## General
**Q: How is Rakshak different from Kavach?**
A: Kavach monitors and maintains delta/gamma/theta/vega neutrality. Rakshak handles risks that Greek hedging cannot address — tail events, gaps, overnight exposure, black swans.
**Q: Does Rakshak auto-execute trades?**
A: Emergency exits are auto-executed via KuberAlpha. Hedge recommendations are advisory unless configured for auto-execution.
**Q: What is the cost of Rakshak's protection?**
A: Typical hedge cost is 2-5% of strategy returns. The goal is to reduce max drawdown by 30-50% for that cost.
## Hedge Requirements
**Q: Can I override hedge requirements?**
A: Yes, but it's logged and audited. Repeated overrides trigger Risk team review.
**Q: What happens if hedge costs exceed strategy returns?**
A: Rakshak will recommend closing the strategy rather than over-hedging.
## Emergency Exit
**Q: How fast is an emergency exit?**
A: From trigger to complete exit: 5-15 seconds for futures, 15-30 seconds for options, 30-60 seconds for equity.
**Q: What if the emergency exit itself fails?**
A: Secondary exit path: direct broker API with pre-approved market orders. Tertiary: phone call to broker desk.
## Event Risk
**Q: How far in advance does Rakshak alert for events?**
A: High-impact events: 3 days. Medium: 1 day. Low: same day. Calendar is updated daily.
