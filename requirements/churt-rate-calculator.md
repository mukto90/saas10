# Churn Rate Calculator
**Path:** /churn-rate-calculator/index.php

---

## Purpose

A client-side churn rate calculator for SaaS founders and operators to measure
customer and revenue loss, understand the compounding impact of churn over time,
and project where the business will be in 12 months if nothing changes. Makes
churn feel tangible — not just a percentage but real customers and real dollars
lost. Helps founders prioritize retention before it becomes a crisis.

---

## Modes

### Simple Mode (default)
Four inputs covering customer and revenue churn for the current month.

### Advanced Mode
Adds cohort-based churn, segmented churn by plan, voluntary vs involuntary churn
split, and net revenue retention calculation.

---

## Inputs

### Simple Mode

| Field | Default | Min | Max | Step | Label |
|---|---|---|---|---|---|
| Customers at start of month | 500 | 0 | 9999999 | 1 | Customers (Start of Month) |
| Customers lost this month | 25 | 0 | 9999999 | 1 | Customers Lost This Month |
| MRR at start of month ($) | 25000 | 0 | 9999999 | 1 | MRR (Start of Month) |
| MRR lost this month ($) | 1000 | 0 | 9999999 | 1 | MRR Lost This Month |

### Advanced Mode (adds the following)

**Churn Breakdown**

| Field | Default | Min | Max | Step | Label |
|---|---|---|---|---|---|
| Voluntary churn (customers) | 0 | 0 | 9999999 | 1 | Voluntary Churn (Customers) |
| Involuntary churn / failed payments (customers) | 0 | 0 | 9999999 | 1 | Involuntary Churn (Customers) |
| Expansion MRR this month ($) | 0 | 0 | 9999999 | 1 | Expansion MRR ($) |
| Contraction MRR this month ($) | 0 | 0 | 9999999 | 1 | Contraction MRR ($) |
| New MRR this month ($) | 0 | 0 | 9999999 | 1 | New MRR ($) |

**Segmented Churn (up to 3 plans)**

Up to 3 plan segments. Start with 1 pre-filled. User can add up to 2 more.

Each segment row:

| Field | Default | Label |
|---|---|---|
| Plan name | "Starter" | Plan Name |
| Customers at start | 0 | Starting Customers |
| Customers churned | 0 | Churned Customers |
| MRR lost ($) | 0 | MRR Lost ($) |

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
| Customer Churn Rate | (customers_lost ÷ starting_customers) × 100 | X.XX% |
| Revenue Churn Rate | (mrr_lost ÷ starting_mrr) × 100 | X.XX% |
| Customers Remaining | starting_customers − customers_lost | integer |
| MRR Remaining | starting_mrr − mrr_lost | currency |
| Avg Revenue per Churned Customer | mrr_lost ÷ customers_lost | currency |

### Projection Metrics (both modes)

Uses compound churn — each month's starting value is the previous month's result.

| Metric | Formula | Format |
|---|---|---|
| Projected Customers (12mo) | starting × (1 − customer_churn_rate/100)^12 | integer |
| Customers Lost in 12mo | starting − projected_customers_12mo | integer |
| Projected MRR (12mo) | starting_mrr × (1 − revenue_churn_rate/100)^12 | currency |
| MRR Lost in 12mo | starting_mrr − projected_mrr_12mo | currency |
| Projected ARR (12mo) | projected_mrr_12mo × 12 | currency |

### Advanced-Only Metrics

| Metric | Formula | Format |
|---|---|---|
| Voluntary Churn Rate | (voluntary_churned ÷ starting_customers) × 100 | X.XX% |
| Involuntary Churn Rate | (involuntary_churned ÷ starting_customers) × 100 | X.XX% |
| Gross Revenue Retention | ((starting_mrr − mrr_lost) ÷ starting_mrr) × 100 | X.XX% |
| Net Revenue Retention | ((starting_mrr − mrr_lost + expansion_mrr − contraction_mrr) ÷ starting_mrr) × 100 | X.XX% |
| MRR Movements Net | new_mrr + expansion_mrr − mrr_lost − contraction_mrr | currency |
| Churn Rate per Segment | (segment_churned ÷ segment_starting) × 100 per row | X.XX% |
| Highest Churn Segment | segment with highest churn rate | label |

---

## Formulas

**Customer Churn Rate:**
```
Customer Churn Rate = (customers_lost ÷ starting_customers) × 100
```

**Revenue Churn Rate:**
```
Revenue Churn Rate = (mrr_lost ÷ starting_mrr) × 100
```

**12-Month Compound Projection:**
```
Projected Customers (month n) = starting_customers × (1 − customer_churn_rate/100)^n
Projected MRR (month n)       = starting_mrr × (1 − revenue_churn_rate/100)^n
```

**Gross Revenue Retention:**
```
GRR = ((starting_mrr − mrr_lost) ÷ starting_mrr) × 100
GRR is capped at 100% — expansion is excluded
```

**Net Revenue Retention:**
```
NRR = ((starting_mrr − mrr_lost + expansion_mrr − contraction_mrr) ÷ starting_mrr) × 100
NRR can exceed 100% if expansion > churn
```

**MRR Movements Net:**
```
Net MRR Change = new_mrr + expansion_mrr − mrr_lost − contraction_mrr
```

**Segment Churn Rate:**
```
Segment Churn Rate = (segment_churned ÷ segment_starting) × 100
```

---

## Edge Cases

| Condition | Behavior |
|---|---|
| customers_lost > starting_customers | Cap at 100% churn — show warning: "Churned customers cannot exceed starting customers." |
| mrr_lost > starting_mrr | Cap at 100% revenue churn — show warning: "MRR lost cannot exceed starting MRR." |
| starting_customers = 0 | All customer metrics = 0 or N/A — no division errors |
| starting_mrr = 0 | All revenue metrics = 0 or N/A — no division errors |
| customers_lost = 0 | Churn Rate = 0%, Payback = "No churn this month." |
| mrr_lost = 0 | Revenue Churn = 0% |
| NRR > 100% | Display in accent green — highlight as a positive signal |
| NRR = 100% | Display neutral — "Expansion exactly offsets churn." |
| Voluntary + involuntary > total churned | Show warning: "Voluntary + involuntary churn exceeds total churned customers." |
| Segment churned > segment starting | Show per-row warning: "Churned exceeds starting count for this plan." |
| Any field empty | Treat as 0 — never show NaN or Infinity |

---

## Churn Health Badge

Shown next to Customer Churn Rate and Revenue Churn Rate values.

| Monthly Churn Rate | Label | Color |
|---|---|---|
| < 0.5% | Exceptional | #c8f060 |
| 0.5–1% | Healthy | #c8f060 |
| 1–2% | Acceptable | #a0d060 |
| 2–5% | Moderate | #f0c060 |
| 5–10% | Critical | #f0a040 |
| > 10% | Emergency | #f05050 |

---

## NRR Health Badge (Advanced Mode)

Shown next to Net Revenue Retention value.

| NRR | Label | Color |
|---|---|---|
| > 120% | World-Class | #c8f060 |
| 110–120% | Excellent | #c8f060 |
| 100–110% | Healthy | #a0d060 |
| 90–100% | Concerning | #f0c060 |
| < 90% | Dangerous | #f05050 |

---

## Churn Rate Interpretation

Shown below the customer churn rate value.

| Range | Text |
|---|---|
| < 0.5% | "Exceptional retention. Focus on growth." |
| 0.5–1% | "Healthy churn for a mature SaaS product." |
| 1–2% | "Acceptable — monitor and aim to improve." |
| 2–5% | "Moderate churn — investigate top cancellation reasons immediately." |
| 5–10% | "Critical — retention must become your top priority." |
| > 10% | "Emergency level. Product-market fit or onboarding needs urgent review." |
| 0% | "No churn this month — excellent." |

---

## Projection Chart

- X axis: Month 0 to Month 12
- Y axis: Values in customers (left axis) and currency (right axis)
- Line 1: Projected customer count month by month — #c8f060
- Line 2: Projected MRR month by month — #60d4f0
- Both lines start at Month 0 = current values and decay by compound churn
- Horizontal reference lines: starting customer count and starting MRR — #888580 (muted)
- Shaded area below each line to x-axis to visualize loss
- Hover tooltip: Month X | Customers: Y | MRR: $Z | Customers Lost: A | MRR Lost: $B

---

## Revenue Motion Waterfall (Advanced Mode)

A visual waterfall display showing this month's MRR movements:

```
Starting MRR:      $25,000
+ New MRR:         +$2,000
+ Expansion MRR:   +$500
− Churned MRR:     −$1,000
− Contraction MRR: −$200
= Ending MRR:      $26,300
```

Each line color-coded: neutral for base, green for additions, red for subtractions.
Final line shows net change vs starting MRR as a percentage.

---

## Voluntary vs Involuntary Churn Breakdown (Advanced Mode)

A simple donut or horizontal split bar showing:
- Voluntary churn % of total churned — #f0a040
- Involuntary churn % of total churned — #f05050
- Unattributed (total − voluntary − involuntary) — #888580

Below the chart:
> "X% of your churn is involuntary (failed payments). This is recoverable with a
> dunning flow. Y% is voluntary — requires product or pricing improvements."

---

## Contextual Insight Block

A dynamic paragraph below the results panel. Updates live.

Template:
> "At your current customer churn rate of **[X%]** and revenue churn rate of **[Y%]**,
> you will lose approximately **[N customers]** and **[$Z in MRR]** over the next
> 12 months. [Health sentence based on churn badge.] [If NRR > 100%: 'Your expansion
> revenue more than offsets churn — you have negative churn, which is exceptional.']
> [If NRR < 90%: 'Your net revenue retention is below 90%, which means existing
> customers are shrinking your revenue even before new sales.']"

---

## Shareable Results

- "Copy results as text" button — copies a plain-text summary to clipboard
- "Share link" button — encodes all input values into URL query params so the
  exact calculation can be shared and restored on load
- On page load: read query params and pre-fill all inputs if present