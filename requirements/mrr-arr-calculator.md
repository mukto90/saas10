# MRR / ARR Calculator
**Path:** /mrr-arr-calculator/index.php

---

## Purpose

A client-side MRR and ARR calculator for SaaS founders and operators to calculate
recurring revenue across multiple pricing tiers, track growth, and project future
revenue. Goes beyond simple MRR summation to surface ARPU, revenue mix, growth rate,
and 12-month projections. Useful for investor updates, board reporting, and internal
planning.

---

## Modes

### Simple Mode (default)
Up to 3 pricing tiers with price and customer count. Instant MRR and ARR output.

### Advanced Mode
Adds churned customers, new customers added, expansion MRR, discounts, and
month-over-month growth rate inputs for full revenue motion visibility.

---

## Inputs

### Simple Mode

Up to 3 pricing tiers. Start with 2 pre-filled. User can add a 3rd or remove down to 1.

**Each tier row:**

| Field | Default (Tier 1) | Default (Tier 2) | Min | Max | Step | Label |
|---|---|---|---|---|---|---|
| Tier name | Starter | Pro | — | — | — | Tier Name |
| Price per month ($) | 29 | 99 | 0 | 9999999 | 0.01 | Price / Month ($) |
| Number of customers | 50 | 20 | 0 | 9999999 | 1 | Customers |

- "Add Tier" button adds Tier 3, then hides itself (max 3 tiers)
- Each tier has a "Remove" control — hidden when only 1 tier remains
- Empty tier name defaults to "Tier X" in output display only — do not modify the input

### Advanced Mode (adds the following per tier)

| Field | Default | Min | Max | Step | Label |
|---|---|---|---|---|---|
| New customers this month | 0 | 0 | 9999999 | 1 | New Customers (This Month) |
| Churned customers this month | 0 | 0 | 9999999 | 1 | Churned Customers (This Month) |
| Expansion MRR from existing customers | 0 | 0 | 9999999 | 0.01 | Expansion MRR ($) |
| Average discount per customer (%) | 0 | 0 | 100 | 0.1 | Avg Discount (%) |

**Global Advanced Inputs:**

| Field | Default | Min | Max | Step | Label |
|---|---|---|---|---|---|
| MRR last month | 0 | 0 | 9999999 | 1 | MRR Last Month ($) — for growth rate calc |
| Annual plan discount (%) | 0 | 0 | 100 | 0.1 | Annual Plan Discount (%) |
| Customers on annual plans (%) | 0 | 0 | 100 | 0.1 | % Customers on Annual Plans |

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
| MRR per tier | price × customers × (1 − discount/100) | currency |
| Total MRR | Σ all tier MRRs + Σ expansion MRR | currency |
| Total ARR | Total MRR × 12 | currency |
| Total Customers | Σ all tier customers | integer |
| ARPU | Total MRR ÷ Total Customers | currency |

### Advanced-Only Metrics

| Metric | Formula | Format |
|---|---|---|
| New MRR | Σ (new_customers × tier_price) per tier | currency |
| Churned MRR | Σ (churned_customers × tier_price) per tier | currency |
| Expansion MRR | Σ expansion_mrr across all tiers | currency |
| Net New MRR | New MRR − Churned MRR + Expansion MRR | currency |
| MRR Growth Rate | (Total MRR − MRR Last Month) ÷ MRR Last Month × 100 | X.X% |
| Projected ARR | Total MRR × 12 | currency |
| Revenue from Annual Plans | Total MRR × (annual_customers/100) × 12 × (1 − annual_discount/100) | currency |
| Implied ARR | (Total MRR × (1 − annual_customers/100) × 12) + Revenue from Annual Plans | currency |
| Customer Churn Rate | Σ churned_customers ÷ Σ starting_customers × 100 | X.X% |
| Revenue Churn Rate | Churned MRR ÷ (Total MRR − Net New MRR) × 100 | X.X% |
| MRR per Tier % share | tier_MRR ÷ Total MRR × 100 | X.X% |

---

## Formulas

**Tier MRR:**
```
Tier MRR = price × customers × (1 − discount / 100)
```

**Total MRR:**
```
Total MRR = Σ Tier MRR + Σ Expansion MRR
```

**Total ARR:**
```
ARR = Total MRR × 12
```

**ARPU:**
```
ARPU = Total MRR ÷ Total Customers
```

**Net New MRR:**
```
New MRR      = Σ (new_customers × tier_price) per tier
Churned MRR  = Σ (churned_customers × tier_price) per tier
Net New MRR  = New MRR − Churned MRR + Expansion MRR
```

**MRR Growth Rate:**
```
Growth Rate = ((Total MRR − MRR Last Month) ÷ MRR Last Month) × 100
```

**Implied ARR (with annual plans):**
```
Annual Plan Customers     = Total Customers × (annual_customers_pct / 100)
Monthly Plan Customers    = Total Customers − Annual Plan Customers
Annual Plan Revenue       = Annual Plan Customers × ARPU × 12 × (1 − annual_discount/100)
Monthly Plan Revenue      = Monthly Plan Customers × ARPU × 12
Implied ARR               = Annual Plan Revenue + Monthly Plan Revenue
```

**12-Month MRR Projection:**
```
If MRR Growth Rate > 0:
  Projected MRR (month n) = Total MRR × (1 + growth_rate/100)^n
Else:
  Flat projection at Total MRR
```

---

## Edge Cases

| Condition | Behavior |
|---|---|
| All customer counts = 0 | MRR = $0, ARR = $0, ARPU = $0 — no division errors |
| Price = 0, customers > 0 | Tier MRR = $0, customer still counted in total |
| Churned > starting customers | Cap churned at starting count — show warning: "Churned customers cannot exceed starting customers." |
| MRR Last Month = 0 | Growth Rate = "N/A" — cannot calculate without prior period |
| Discount = 100% | Tier MRR = $0 — valid, no error |
| Single tier with 0 customers | Include tier in UI but exclude from ARPU calc |
| Expansion MRR > Total MRR | Allow — expansion can be large, no cap |
| Annual plan % = 0 | Skip Implied ARR calculation, show standard ARR only |
| Any field empty | Treat as 0 — never show NaN or Infinity |

---

## MRR Health Badge

Shown next to MRR Growth Rate (Advanced Mode only).

| Growth Rate | Label | Color |
|---|---|---|
| > 20% | Hypergrowth | #c8f060 |
| 10–20% | Strong | #c8f060 |
| 5–10% | Healthy | #a0d060 |
| 1–5% | Slow | #f0c060 |
| 0% | Flat | #f0a040 |
| < 0% | Declining | #f05050 |

---

## Revenue Mix Bar

A horizontal stacked bar showing each tier's percentage share of Total MRR.

| Tier | Color |
|---|---|
| Tier 1 | #c8f060 |
| Tier 2 | #60d4f0 |
| Tier 3 | #a082f0 |

- Show tier name + percentage inside segment if segment width > 15%
- If Total MRR = 0 show empty gray bar
- Updates live on every input event

---

## Projection Chart

- X axis: Month 1 to Month 12 (fixed)
- Y axis: MRR in currency
- Line 1: Projected MRR month by month — #c8f060
- Line 2 (Advanced only): Projected MRR without expansion — #60d4f0 (dashed)
- Horizontal reference line at current Total MRR — #888580 (muted, labeled "Current MRR")
- Hover tooltip: Month X | Projected MRR: $Y | Growth vs today: +Z%
- If growth rate = 0 or not available: flat line at current MRR with note:
  "Enter MRR Last Month to enable growth projection."

---

## Revenue Motion Breakdown (Advanced Mode)

A visual waterfall or stacked display showing:

```
Last Month MRR:   $X
+ New MRR:        +$Y
− Churned MRR:    −$Z
+ Expansion MRR:  +$A
= This Month MRR: $B
```

Each line color-coded: neutral for base, green for additions, red for subtractions.

---

## Shareable Results

- "Copy results as text" button — copies a plain-text summary to clipboard
- "Share link" button — encodes all input values into URL query params so the
  exact calculation can be shared and restored on load
- On page load: read query params and pre-fill all inputs if present