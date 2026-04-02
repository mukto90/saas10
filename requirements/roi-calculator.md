# ROI Calculator
**Path:** /roi-calculator/index.php

---

## Purpose

A client-side ROI calculator for SaaS founders, marketers, and operators to evaluate
whether any business spend — tool subscription, ad campaign, hire, or initiative — is
financially justified. Goes beyond basic ROI percentage to surface payback period,
break-even point, monthly profit curve, NPV, and a 12-month projection.

---

## Modes

### Simple Mode (default)
Three inputs. Best for quick calculations.

### Advanced Mode
All inputs exposed. Adds growth rates, one-time costs, tax rate, discount rate,
and comparison against an alternative investment.

---

## Inputs

### Simple Mode

| Field | Default | Min | Max | Step | Label |
|---|---|---|---|---|---|
| Monthly cost | 500 | 0 | 9999999 | 1 | Monthly Cost ($) |
| Monthly return | 2000 | 0 | 9999999 | 1 | Monthly Revenue / Savings ($) |
| Time period | 12 | 1 | 36 | 1 | Time Period (months) |

### Advanced Mode (adds the following)

**One-Time Costs**

| Field | Default | Min | Max | Step | Label |
|---|---|---|---|---|---|
| Setup / onboarding cost | 0 | 0 | 9999999 | 1 | One-Time Setup Cost ($) |
| Training cost | 0 | 0 | 9999999 | 1 | Training Cost ($) |

**Growth Assumptions**

| Field | Default | Min | Max | Step | Label |
|---|---|---|---|---|---|
| Monthly cost growth rate | 0 | -50 | 200 | 0.1 | Monthly Cost Growth (%) |
| Monthly return growth rate | 0 | -50 | 200 | 0.1 | Monthly Return Growth (%) |

**Financial Adjustments**

| Field | Default | Min | Max | Step | Label |
|---|---|---|---|---|---|
| Tax rate | 0 | 0 | 60 | 0.1 | Tax Rate (%) |
| Discount rate | 0 | 0 | 30 | 0.1 | Discount Rate (%) — use your cost of capital |

**Opportunity Cost**

| Field | Default | Min | Max | Step | Label |
|---|---|---|---|---|---|
| Alternative monthly return | 0 | 0 | 9999999 | 1 | Alternative Investment Return ($/mo) |

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
| Total Investment | (cost × months with growth) + one-time costs | currency |
| Total Return | return × months with growth | currency |
| Net Profit | Total Return − Total Investment | currency |
| ROI % | (Net Profit ÷ Total Investment) × 100 | X.X% |
| Payback Period | Total Investment ÷ avg monthly return | "X.X months" |

### Advanced-Only Metrics

| Metric | Formula | Format |
|---|---|---|
| After-Tax Net Profit | Net Profit × (1 − tax_rate / 100) | currency |
| NPV | Σ (monthly_net ÷ (1 + discount_rate/100)^month) over time period | currency |
| Opportunity Cost | alternative_return × months | currency |
| Net ROI vs Alternative | ((Net Profit − Opportunity Cost) ÷ Total Investment) × 100 | X.X% |
| Monthly Avg Return | Total Return ÷ months | currency |
| Monthly Avg Profit | Net Profit ÷ months | currency |
| Cost Growth Impact | compounded total cost − flat total cost | currency |
| Return Growth Impact | compounded total return − flat total return | currency |

---

## Formulas

**Simple ROI (no growth rates):**

Total Investment = (monthly_cost × months) + one_time_costs
Total Return     = monthly_return × months
Net Profit       = Total Return − Total Investment
ROI %            = (Net Profit ÷ Total Investment) × 100
Payback Period   = Total Investment ÷ monthly_return

**With growth rates (Advanced Mode):**

Monthly Cost (month n)   = monthly_cost × (1 + cost_growth/100)^(n-1)
Monthly Return (month n) = monthly_return × (1 + return_growth/100)^(n-1)
Total Investment         = Σ monthly_cost(n) for n=1 to months + one_time_costs
Total Return             = Σ monthly_return(n) for n=1 to months

**NPV:**
```
NPV = Σ [ (monthly_return(n) − monthly_cost(n)) ÷ (1 + discount_rate/100)^n ]
      for n = 1 to months
      minus one_time_costs
```

**After-Tax Net Profit:**

After-Tax Net Profit = Net Profit × (1 − tax_rate / 100)

**Break-Even Month:**

Find the first month n where:
Σ monthly_return(1..n) >= Σ monthly_cost(1..n) + one_time_costs

---

## Edge Cases

| Condition | Behavior |
|---|---|
| cost = 0, return > 0 | ROI = "∞", Payback = "Instant" |
| return = 0, cost > 0 | ROI = "−100%", Payback = "Never" |
| return = 0, cost = 0 | ROI = "0%", Payback = "N/A" |
| return < cost | ROI is negative — display in red |
| Break-even not reached | Note below chart: "Break-even not reached within X months." |
| NPV < 0 | Display in red |
| Net ROI vs Alternative < 0 | Note: "The alternative investment outperforms this spend." |
| Any field empty | Treat as 0 — never show NaN or Infinity |
| Discount rate = 0 | NPV = Net Profit (no discounting) |
| Tax rate = 0 | After-Tax = Net Profit (skip displaying the field) |

---

## ROI Health Badge

Shown next to ROI % value.

| ROI % | Label | Color |
|---|---|---|
| > 300% | Outstanding | #c8f060 |
| 200–300% | Excellent | #c8f060 |
| 100–200% | Good | #a0d060 |
| 50–100% | Moderate | #f0c060 |
| 0–50% | Marginal | #f0a040 |
| < 0% | Losing Money | #f05050 |

---

## Payback Period Interpretation

Shown below the payback period value.

| Range | Text |
|---|---|
| < 1 month | "Pays for itself almost immediately." |
| 1–3 months | "Very fast payback — low risk." |
| 3–6 months | "Reasonable payback window." |
| 6–12 months | "Acceptable — monitor performance closely." |
| > 12 months | "Long payback — validate assumptions carefully." |
| Never | "This spend never pays back at current return." |
| Instant | "No cost — immediate positive return." |

---

## Projection Chart

- X axis: Month 1 to Month N
- Y axis: Cumulative currency values
- Line 1: Cumulative Investment — #f05050
- Line 2: Cumulative Return — #c8f060
- Line 3 (Advanced only): Cumulative NPV — #60d4f0
- Shaded area between lines: green if Return > Investment, red otherwise
- Vertical dashed line at break-even month, labeled "Break-even: Month X"
- Hover tooltip: Month X | Investment: $Y | Return: $Z | Net: $A

---

## Shareable Results

- "Copy results as text" button — copies a plain-text summary to clipboard
- "Share link" button — encodes all input values into URL query params so the exact calculation can be shared and restored on load
- On page load: read query params and pre-fill all inputs if present