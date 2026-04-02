# Price Increase Simulator
**Path:** /price-increase-simulator/index.php

---

## Purpose

A client-side price increase simulator for SaaS founders and operators to model
the financial impact of raising prices — and determine exactly how much churn they
can absorb before a price increase becomes net negative. Most founders undercharge
and never raise prices out of fear. This tool makes the math transparent: even with
significant churn, a price increase is often the right move.

---

## Modes

### Simple Mode (default)
Current price, new price, customer count, and expected churn from increase.
Outputs net MRR impact.

### Advanced Mode
Segmented by plan, grandfathering logic, phased rollout, and annual vs monthly
mix modeling.

---

## Inputs

### Simple Mode

| Field | Default | Min | Max | Step | Label |
|---|---|---|---|---|---|
| Current price per customer ($/mo) | 49 | 0 | 9999999 | 0.01 | Current Price / Month ($) |
| New price per customer ($/mo) | 69 | 0 | 9999999 | 0.01 | New Price / Month ($) |
| Current number of customers | 200 | 0 | 9999999 | 1 | Current Customers |
| Expected churn from increase (%) | 10 | 0 | 100 | 0.1 | Expected Churn from Price Increase (%) |

### Advanced Mode (adds the following)

**Plan Segmentation (up to 3 plans)**

Each plan row:

| Field | Default | Label |
|---|---|---|
| Plan name | "Pro" | Plan Name |
| Current price ($/mo) | 49 | Current Price ($) |
| New price ($/mo) | 69 | New Price ($) |
| Customers on this plan | 150 | Customers |
| Expected churn from increase (%) | 10 | Expected Churn (%) |
| Grandfather existing customers? | No (toggle) | Grandfather Existing Customers |

If grandfathered: existing customers stay at old price. Only new customers get new price.
Model then requires: new customers per month input to project when grandfathering
becomes negligible.

**Grandfathering (if any plan has it enabled)**

| Field | Default | Min | Max | Step | Label |
|---|---|---|---|---|---|
| New customers per month (post-increase) | 20 | 0 | 9999999 | 1 | New Customers / Month |
| Grandfather sunset month | 0 | 0 | 36 | 1 | Force migration in Month # (0 = never) |

**Billing Mix**

| Field | Default | Min | Max | Step | Label |
|---|---|---|---|---|---|
| % customers on monthly billing | 60 | 0 | 100 | 1 | Monthly Billing (%) |
| % customers on annual billing | 40 | 0 | 100 | 1 | Annual Billing (%) |

Annual customers: price increase only takes effect at renewal.
Average months until annual renewal: 6 (assume uniform distribution).
Model shows blended impact timeline.

**Rollout Phasing**

| Field | Default | Options | Label |
|---|---|---|---|
| Rollout type | All at once | All at once, Phased over 3 months, Phased over 6 months, New customers only | Rollout Strategy |

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
| Current MRR | current_price × customers | currency |
| Customers lost from churn | customers × churn_pct/100 | integer |
| Remaining customers | customers − churned | integer |
| New MRR after increase | remaining_customers × new_price | currency |
| MRR delta | new_mrr − current_mrr | currency (color-coded) |
| MRR delta % | mrr_delta ÷ current_mrr × 100 | X.X% |
| Break-even churn rate | churn at which new MRR = current MRR | X.X% |
| Maximum absorbable churn | churn at which new MRR = $0 | X.X% (informational) |
| ARR impact | mrr_delta × 12 | currency |

### Advanced-Only Metrics

| Metric | Formula | Format |
|---|---|---|
| MRR impact per plan | per plan delta | currency |
| Grandfathered MRR | grandfathered_customers × old_price | currency |
| New price MRR | non_grandfathered × new_price | currency |
| Blended ARPU | total_mrr ÷ total_customers | currency |
| Monthly billing impact | monthly_customers × price_delta × (1 − churn) | currency |
| Annual billing impact | annual_customers × price_delta × (1 − churn) | currency |
| Month when grandfathered < 10% of base | calculated from new customer growth rate | "Month X" |
| 12-month cumulative MRR gain | Σ monthly mrr_delta over 12 months | currency |

---

## Formulas

**Break-Even Churn Rate:**
```
At break-even: remaining_customers × new_price = current_customers × current_price
remaining_customers = current_customers × current_price ÷ new_price
churned_customers   = current_customers − remaining_customers
break_even_churn    = churned_customers ÷ current_customers × 100
```

**MRR Delta:**
```
churned            = customers × (churn_pct / 100)
remaining          = customers − churned
new_mrr            = remaining × new_price
mrr_delta          = new_mrr − (customers × current_price)
```

**With grandfathering:**
```
new_price_customers    = non_grandfathered_existing + new_customers_per_month × months
grandfathered          = original_customers (until sunset or natural churn)
total_mrr(month n)     = (grandfathered(n) × old_price) + (new_price_customers(n) × new_price)
```

**Phased rollout (3 months):**
```
Month 1: 33% of customers migrated
Month 2: 66% of customers migrated
Month 3: 100% of customers migrated
Apply churn proportionally per batch
```

---

## Edge Cases

| Condition | Behavior |
|---|---|
| New price < current price | Price decrease mode — show note: "You are modeling a price decrease." All metrics still work. |
| New price = current price | Delta = $0 — show: "No change in pricing." |
| Churn > 100% | Cap at 100% |
| Break-even churn > 100% | Show: "Any churn level still results in higher MRR — the increase is very safe." |
| All customers grandfathered | New MRR = current MRR + (new_customers × new_price). Show note. |
| Annual + monthly % ≠ 100% | Show warning — normalize proportionally |
| Any field empty | Treat as 0 |

---

## Price Increase Verdict

Shown prominently below primary metrics.

| Condition | Verdict | Color |
|---|---|---|
| Expected churn < break-even churn | "Safe to increase — you can absorb this churn and still come out ahead." | #c8f060 |
| Expected churn = break-even churn (±2%) | "Neutral — revenue stays roughly the same. Increase only if strategic." | #f0c060 |
| Expected churn > break-even churn | "Risky — at this churn rate, the increase reduces MRR. Reconsider timing or magnitude." | #f05050 |

---

## Churn Sensitivity Chart

- X axis: Churn rate 0% to 80%
- Y axis: Resulting MRR
- Line: MRR at each churn rate after price increase — #c8f060
- Horizontal reference line: current MRR — #888580, labeled "Current MRR"
- Vertical dashed line at expected churn — #60d4f0, labeled "Your expected churn"
- Vertical dashed line at break-even churn — #f0a040, labeled "Break-even churn"
- Shaded green area: churn rates where increase is net positive
- Shaded red area: churn rates where increase is net negative
- Hover tooltip: Churn X% | MRR: $Y | Delta: $Z

---

## 12-Month MRR Projection (Advanced Mode)

- X axis: Month 1 to Month 12
- Y axis: MRR in currency
- Line 1: MRR with price increase (accounting for churn) — #c8f060
- Line 2: MRR without price increase (flat) — #888580, dashed
- Line 3 (if grandfathered): MRR with grandfathering phaseout — #60d4f0
- Hover tooltip: Month X | MRR with increase: $Y | MRR without: $Z | Delta: $A

---

## Shareable Results

- "Copy results as text" button — copies plain-text summary to clipboard
- "Share link" button — encodes all inputs into URL query params
- On page load: read query params and pre-fill all inputs if present