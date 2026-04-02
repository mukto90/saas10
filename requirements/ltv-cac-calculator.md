# LTV:CAC Ratio Calculator
**Path:** /ltv-cac-calculator/index.php

---

## Purpose

A client-side LTV:CAC calculator for SaaS founders and operators to determine whether
their customer acquisition cost is sustainable relative to the lifetime value of a
customer. Surfaces the full picture: LTV, CAC, ratio, payback period, and margin-adjusted
LTV. Helps founders make confident decisions about sales and marketing spend.

---

## Modes

### Simple Mode (default)
Core LTV and CAC inputs only. Best for quick health checks.

### Advanced Mode
Adds expansion revenue, support costs, discount rate for LTV, CAC by channel,
and blended CAC across multiple acquisition channels.

---

## Inputs

### Simple Mode

| Field | Default | Min | Max | Step | Label |
|---|---|---|---|---|---|
| Average Revenue Per User (monthly) | 99 | 0 | 9999999 | 0.01 | Monthly ARPU ($) |
| Gross margin | 80 | 0 | 100 | 0.1 | Gross Margin (%) |
| Monthly churn rate | 2 | 0 | 100 | 0.01 | Monthly Churn Rate (%) |
| Customer Acquisition Cost | 500 | 0 | 9999999 | 1 | CAC ($) |

### Advanced Mode (adds the following)

**Revenue Adjustments**

| Field | Default | Min | Max | Step | Label |
|---|---|---|---|---|---|
| Monthly expansion revenue per customer | 0 | 0 | 9999999 | 0.01 | Expansion MRR per Customer ($) |
| Monthly support / service cost per customer | 0 | 0 | 9999999 | 0.01 | Monthly Support Cost per Customer ($) |

**LTV Discounting**

| Field | Default | Min | Max | Step | Label |
|---|---|---|---|---|---|
| Annual discount rate | 0 | 0 | 30 | 0.1 | Discount Rate (%) — use your cost of capital |

**CAC by Channel**

Up to 4 acquisition channels. Start with 1 pre-filled. User can add up to 3 more.

Each channel row:

| Field | Default | Label |
|---|---|---|
| Channel name | "Paid Search" | Channel Name |
| Spend per month ($) | 1000 | Monthly Spend ($) |
| Customers acquired per month | 2 | Customers Acquired / Month |

Blended CAC = total spend across all channels ÷ total customers acquired across all channels.

**Currency**

| Field | Default | Options |
|---|---|---|
| Currency symbol | USD | USD, EUR, GBP, BDT, INR, CAD, AUD, SGD |

Symbol display only — no conversion.

---

## Outputs

### Primary Metrics (both modes)

| Metric | Formula | Format |
|---|---|---|
| Customer Lifetime | 1 ÷ monthly_churn_rate | "X.X months" |
| LTV | (ARPU × gross_margin/100) ÷ monthly_churn_rate | currency |
| CAC | user input (Simple) or blended CAC (Advanced) | currency |
| LTV:CAC Ratio | LTV ÷ CAC | X.X |
| CAC Payback Period | CAC ÷ (ARPU × gross_margin/100) | "X.X months" |

### Advanced-Only Metrics

| Metric | Formula | Format |
|---|---|---|
| Adjusted LTV | ((ARPU + expansion_mrr − support_cost) × gross_margin/100) ÷ monthly_churn_rate | currency |
| Discounted LTV | Σ [ (monthly_margin ÷ (1 + discount_rate/12/100)^month) ] for months 1 to customer_lifetime | currency |
| LTV:CAC with Discounted LTV | Discounted LTV ÷ CAC | X.X |
| Blended CAC | total_channel_spend ÷ total_channel_customers | currency |
| CAC per Channel | spend ÷ customers for each channel | currency per row |
| Best CAC Channel | channel with lowest CAC | label |
| Monthly Gross Profit per Customer | ARPU × gross_margin/100 | currency |
| Annual LTV | LTV × 12 (capped at customer lifetime) | currency |

---

## Formulas

**Customer Lifetime:**
```
Customer Lifetime (months) = 1 ÷ (monthly_churn_rate / 100)
```

**LTV (Simple):**
```
LTV = (ARPU × gross_margin / 100) ÷ (monthly_churn_rate / 100)
```

**LTV (Advanced — with expansion and support cost):**
```
Net Monthly Margin = (ARPU + expansion_mrr − support_cost) × (gross_margin / 100)
LTV = Net Monthly Margin ÷ (monthly_churn_rate / 100)
```

**Discounted LTV:**
```
Monthly discount rate = annual_discount_rate / 12 / 100
LTV_discounted = Σ [ Net_Monthly_Margin ÷ (1 + monthly_discount_rate)^n ]
                 for n = 1 to ceil(Customer Lifetime)
```

**CAC Payback Period:**
```
Payback (months) = CAC ÷ (ARPU × gross_margin / 100)
```

**Blended CAC:**
```
Blended CAC = Σ channel_spend ÷ Σ channel_customers_acquired
```

**LTV:CAC Ratio:**
```
Ratio = LTV ÷ CAC
```

---

## Edge Cases

| Condition | Behavior |
|---|---|
| Churn = 0 | Customer Lifetime = "Infinite", LTV = "∞" — show note: "With 0% churn, LTV is theoretically infinite." |
| CAC = 0 | LTV:CAC = "∞", Payback = "Instant" |
| ARPU = 0 | LTV = $0, Ratio = 0, Payback = "Never" |
| Gross margin = 0 | LTV = $0 — show note: "Zero margin means no profit per customer." |
| LTV < CAC | Ratio < 1 — display in red with warning |
| Any channel with 0 customers acquired | Skip that channel from blended CAC — do not divide by zero |
| All channels empty | Fall back to Simple Mode CAC input |
| Discount rate = 0 | Discounted LTV = standard LTV |
| Support cost > ARPU + expansion | Net margin is negative — show warning: "Support costs exceed revenue per customer." |
| Any field empty | Treat as 0 — never show NaN or Infinity |

---

## LTV:CAC Health Badge

Shown next to the LTV:CAC Ratio value.

| Ratio | Label | Color |
|---|---|---|
| > 5 | Exceptional | #c8f060 |
| 3–5 | Healthy | #c8f060 |
| 2–3 | Acceptable | #f0c060 |
| 1–2 | Concerning | #f0a040 |
| < 1 | Unsustainable | #f05050 |

---

## CAC Payback Interpretation

Shown below the payback period value.

| Range | Text |
|---|---|
| < 6 months | "Excellent — you recoup acquisition cost very quickly." |
| 6–12 months | "Healthy payback window for most SaaS businesses." |
| 12–18 months | "Acceptable — typical for enterprise or high-touch SaaS." |
| 18–24 months | "Stretched — requires strong retention to be profitable." |
| > 24 months | "Unsustainable — acquisition cost takes too long to recover." |
| Instant | "No acquisition cost — immediate profitability per customer." |
| Never | "Revenue per customer is zero — cannot recover CAC." |

---

## Projection Chart

- X axis: Month 1 to Month 36 (fixed, not tied to a time period input)
- Y axis: Cumulative currency values per customer
- Line 1: Cumulative CAC (flat horizontal line) — #f05050
- Line 2: Cumulative LTV accrued month by month — #c8f060
- Line 3 (Advanced only): Cumulative Discounted LTV — #60d4f0
- Shaded area: green where LTV line exceeds CAC line, red where it doesn't
- Vertical dashed line at CAC payback month, labeled "Payback: Month X"
- Hover tooltip: Month X | LTV accrued: $Y | CAC: $Z | Net: $A

---

## Channel CAC Breakdown (Advanced Mode)

- Horizontal bar chart showing CAC per channel side by side
- Each bar labeled with channel name and CAC value
- Shortest bar highlighted in accent green — best performing channel
- Longest bar highlighted in red — worst performing channel
- Below chart: "Your best channel is [name] at $X CAC. Your worst is [name] at $Y CAC."

---

## Shareable Results

- "Copy results as text" button — copies a plain-text summary to clipboard
- "Share link" button — encodes all input values into URL query params so the
  exact calculation can be shared and restored on load
- On page load: read query params and pre-fill all inputs if present