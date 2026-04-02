# Sales Capacity Planner
**Path:** /sales-capacity-planner/index.php

---

## Purpose

A client-side sales capacity planner for SaaS founders, revenue leaders, and
operators to determine exactly how many salespeople they need to hit a revenue
target — and model the cost and timeline of building that team. Accounts for
ramp time, quota attainment rates, churn, and hiring lag. Answers the question
every SaaS founder asks before a fundraise: "How do we get from $X to $Y ARR?"

---

## Modes

### Simple Mode (default)
ARR target, quota per rep, and ramp time. Outputs reps needed and cost.

### Advanced Mode
Full team modeling with ramp curves, attrition, hiring lag, SDR/AE split,
and month-by-month capacity build.

---

## Inputs

### Simple Mode

| Field | Default | Min | Max | Step | Label |
|---|---|---|---|---|---|
| Current ARR ($) | 500000 | 0 | 999999999 | 1 | Current ARR ($) |
| ARR target ($) | 2000000 | 0 | 999999999 | 1 | ARR Target ($) |
| Annual quota per rep ($) | 400000 | 0 | 9999999 | 1 | Annual Quota per Rep ($) |
| Quota attainment rate (%) | 70 | 0 | 200 | 1 | Average Quota Attainment (%) |
| Ramp time (months) | 3 | 0 | 18 | 1 | Ramp Time (months) |
| Current number of reps | 2 | 0 | 9999 | 1 | Current Sales Reps |

### Advanced Mode (adds the following)

**Ramp Curve**

Instead of a single ramp time, define productivity % per month during ramp:

| Month | Default Productivity |
|---|---|
| Month 1 | 0% |
| Month 2 | 25% |
| Month 3 | 50% |
| Month 4 | 75% |
| Month 5+ | 100% |

User can edit each month's productivity %. Maximum ramp period: 12 months.

**Rep Economics**

| Field | Default | Min | Max | Step | Label |
|---|---|---|---|---|---|
| Annual OTE per rep ($) | 120000 | 0 | 9999999 | 1 | Annual OTE per Rep ($) |
| Fully-loaded cost multiplier | 1.3 | 1 | 2 | 0.01 | Fully-Loaded Cost Multiplier |
| Average deal size ($) | 10000 | 0 | 9999999 | 1 | Average Deal Size (ACV, $) |
| Average sales cycle (months) | 2 | 0 | 24 | 0.1 | Avg Sales Cycle (months) |
| Win rate (%) | 25 | 0 | 100 | 0.1 | Win Rate (%) |

Fully-loaded cost = OTE × multiplier (accounts for benefits, tools, management overhead).

**Team Attrition**

| Field | Default | Min | Max | Step | Label |
|---|---|---|---|---|---|
| Annual rep attrition rate (%) | 20 | 0 | 100 | 0.1 | Annual Rep Attrition (%) |
| Months to backfill a lost rep | 2 | 0 | 12 | 1 | Backfill Time (months) |

**Hiring Plan**

| Field | Default | Min | Max | Step | Label |
|---|---|---|---|---|---|
| Hiring start month | 1 | 1 | 24 | 1 | Start Hiring in Month # |
| Reps hired per month | 1 | 0 | 20 | 1 | Reps to Hire per Month |
| Total months of hiring | 12 | 1 | 36 | 1 | Hiring Period (months) |

**SDR Layer (optional toggle)**

| Field | Default | Min | Max | Step | Label |
|---|---|---|---|---|---|
| SDR:AE ratio | 1:2 | — | — | — | SDRs per AE |
| SDR OTE ($) | 70000 | 0 | 9999999 | 1 | SDR Annual OTE ($) |
| SDR pipeline contribution (%) | 40 | 0 | 100 | 1 | % Pipeline from SDRs |

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
| ARR gap | target_arr − current_arr | currency |
| Effective quota per rep | annual_quota × attainment/100 | currency |
| Fully ramped reps needed | ARR gap ÷ effective_quota | integer (round up) |
| Additional reps to hire | reps_needed − current_reps | integer |
| Time to hit target (months) | based on ramp curve and hiring pace | "X months" |
| Total sales payroll cost | total_reps × fully_loaded_ote | currency/year |

### Advanced-Only Metrics

| Metric | Formula | Format |
|---|---|---|
| Pipeline needed | arr_gap ÷ win_rate × 100 | currency |
| Deals needed | pipeline_needed ÷ avg_deal_size | integer |
| Reps needed accounting for attrition | reps_needed × (1 + attrition/100) | integer |
| SDRs needed (if SDR toggle on) | AEs ÷ sdr_ae_ratio | integer |
| Total team cost (AE + SDR) | (aes × ae_ote + sdrs × sdr_ote) × multiplier | currency/year |
| Cost per $1 of new ARR | total_sales_cost ÷ arr_gap | currency |
| Months until first fully ramped hire | hiring_start + ramp_months | "Month X" |
| Productive capacity at month 12 | Σ productivity of all reps at month 12 | X.X FTE equivalent |
| Revenue at risk from attrition | attrition_rate × reps × effective_quota | currency/year |

---

## Formulas

**Effective quota per rep:**
```
Effective Quota = annual_quota × (attainment_rate / 100)
```

**Reps needed (simple):**
```
Reps Needed = CEIL(arr_gap ÷ effective_quota)
Additional Hires = max(0, reps_needed − current_reps)
```

**Time to hit target (simple):**
```
All new reps hired month 1.
Target reached when cumulative ramped capacity covers ARR gap.
Ramped capacity per rep = 0 during ramp, effective_quota/12 per month after.
```

**Ramp curve capacity (Advanced):**
```
For each rep hired in month H:
  Capacity(month M) = (effective_quota/12) × productivity_pct(M − H + 1)
  where productivity_pct comes from ramp curve table

Total capacity(month M) = Σ capacity of all reps active in month M
```

**Attrition replacement:**
```
Reps lost per month = (total_reps × attrition_rate/100) / 12
Each lost rep creates a backfill_months gap before replacement is productive
Additional hires needed = reps_needed × (1 + annual_attrition/100)
```

**Pipeline needed:**
```
Pipeline = arr_gap ÷ (win_rate / 100)
Deals    = CEIL(pipeline ÷ avg_deal_size)
```

**Cost per $1 ARR:**
```
Cost per $1 = total_fully_loaded_sales_cost ÷ arr_gap
Benchmark: < $1 = efficient. $1–$1.5 = acceptable. > $1.5 = expensive.
```

---

## Edge Cases

| Condition | Behavior |
|---|---|
| Target ARR < current ARR | Show note: "Target is below current ARR. Model assumes maintaining current revenue." |
| Current reps >= reps needed | Show: "You already have enough capacity — focus on attainment and ramp." |
| Ramp time = 0 | Reps are immediately productive at month 1 |
| Attainment = 0% | Show error: "0% attainment means no revenue generated." |
| Win rate = 0% | Pipeline needed = infinite — show error |
| ARR gap = 0 | Show: "You've already hit your target." |
| Any field empty | Treat as 0 or use default |

---

## Sales Capacity Health Badge

Based on cost per $1 of new ARR (Advanced Mode).

| Cost per $1 ARR | Label | Color |
|---|---|---|
| < $0.75 | Very efficient | #c8f060 |
| $0.75–$1.00 | Efficient | #a0d060 |
| $1.00–$1.50 | Acceptable | #f0c060 |
| $1.50–$2.00 | Expensive | #f0a040 |
| > $2.00 | Unsustainable | #f05050 |

---

## Capacity Build Chart (Advanced Mode)

- X axis: Month 1 to Month 24
- Y axis: Productive capacity in effective quota units (currency)
- Line 1: Cumulative productive capacity — #c8f060
- Line 2: Cumulative ARR target line — #f05050, dashed
- Shaded area: green when capacity exceeds target
- Vertical dashed line where capacity first meets target — labeled "Target reached: Month X"
- Hover tooltip: Month X | Reps hired: N | Active reps: M | Capacity: $Y | Target: $Z

---

## Hiring Plan Table (Advanced Mode)

A month-by-month table:

| Month | Hires | Attrition | Active Reps | Ramping | Fully Ramped | Capacity ($) |
|---|---|---|---|---|---|---|
| 1 | 2 | 0 | 2 | 2 | 0 | $0 |
| 2 | 1 | 0 | 3 | 3 | 0 | $0 |
| ... | | | | | | |

Updates live. Exportable as CSV via "Copy as CSV" button.

---

## Shareable Results

- "Copy results as text" button — copies plain-text summary to clipboard
- "Copy hiring plan as CSV" button — exports the month-by-month table
- "Share link" button — encodes all inputs into URL query params
- On page load: read query params and pre-fill all inputs if present