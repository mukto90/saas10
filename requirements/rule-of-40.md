# SaaS Rule of 40 Calculator
**Path:** /rule-of-40/index.php

---

## Purpose

A client-side Rule of 40 calculator for SaaS founders, operators, and investors to
measure the balance between growth and profitability — the single most commonly used
health metric in SaaS. A score above 40 signals a healthy business. Below 40 signals
the company is either growing too slowly or burning too much. Useful for board prep,
investor conversations, and benchmarking against public SaaS companies.

---

## Modes

### Simple Mode (default)
ARR growth rate and profit margin. Single score output.

### Advanced Mode
Full P&L inputs to derive margin accurately, trailing 12-month view, and
benchmark comparison against public SaaS companies by tier.

---

## Inputs

### Simple Mode

| Field | Default | Min | Max | Step | Label |
|---|---|---|---|---|---|
| ARR growth rate YoY (%) | 80 | -100 | 1000 | 0.1 | ARR Growth Rate YoY (%) |
| Profit margin (%) | -20 | -200 | 100 | 0.1 | Profit Margin (%) — use EBITDA, FCF, or net margin |
| Which margin type | select | — | — | — | Margin Type |

Margin Type options: EBITDA Margin, Free Cash Flow Margin, Net Profit Margin, Operating Margin.
Selection changes the label only — does not affect formula.

### Advanced Mode (adds the following)

**Revenue**

| Field | Default | Min | Max | Step | Label |
|---|---|---|---|---|---|
| ARR 12 months ago ($) | 1000000 | 0 | 999999999 | 1 | ARR — 12 Months Ago ($) |
| Current ARR ($) | 1800000 | 0 | 999999999 | 1 | Current ARR ($) |

ARR growth rate auto-calculated: (current − previous) ÷ previous × 100.
Overrides manual growth rate input when both are filled.

**P&L for Margin Calculation**

| Field | Default | Min | Max | Step | Label |
|---|---|---|---|---|---|
| Total revenue (TTM) ($) | 1500000 | 0 | 999999999 | 1 | Total Revenue — TTM ($) |
| Cost of goods sold ($) | 300000 | 0 | 999999999 | 1 | COGS ($) |
| Sales & marketing ($) | 450000 | 0 | 999999999 | 1 | Sales & Marketing ($) |
| R&D / engineering ($) | 400000 | 0 | 999999999 | 1 | R&D / Engineering ($) |
| G&A ($) | 200000 | 0 | 999999999 | 1 | General & Administrative ($) |

Auto-calculates:
- Gross Profit = Revenue − COGS
- Gross Margin % = Gross Profit ÷ Revenue × 100
- Operating Expenses = S&M + R&D + G&A
- EBITDA = Gross Profit − Operating Expenses
- EBITDA Margin % = EBITDA ÷ Revenue × 100

Margin used in Rule of 40 = EBITDA Margin (auto-filled from P&L).

**Trailing Quarters (Advanced)**

4 quarter inputs for trailing Rule of 40 trend:

| Field | Label |
|---|---|
| Q1 growth rate (%) | Q1 Growth Rate (%) |
| Q1 margin (%) | Q1 Margin (%) |
| Q2 growth rate (%) | Q2 Growth Rate (%) |
| Q2 margin (%) | Q2 Margin (%) |
| Q3 growth rate (%) | Q3 Growth Rate (%) |
| Q3 margin (%) | Q3 Margin (%) |
| Q4 growth rate (%) | Q4 Growth Rate (%) |
| Q4 margin (%) | Q4 Margin (%) |

Renders a trend line of Rule of 40 score across 4 quarters.

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
| Rule of 40 Score | growth_rate + profit_margin | integer |
| Growth Rate | input or auto-calculated | X.X% |
| Profit Margin | input or auto-calculated from P&L | X.X% |
| Score vs 40 threshold | score − 40 | "+X above" or "−X below" in color |

### Advanced-Only Metrics

| Metric | Formula | Format |
|---|---|---|
| Gross Margin | gross_profit ÷ revenue × 100 | X.X% |
| EBITDA | gross_profit − opex | currency |
| EBITDA Margin | ebitda ÷ revenue × 100 | X.X% |
| ARR Growth Rate (calculated) | (current_arr − prev_arr) ÷ prev_arr × 100 | X.X% |
| Trailing avg Rule of 40 | avg of 4 quarters | integer |
| Trend direction | Q4 score vs Q1 score | "Improving", "Declining", "Flat" |

---

## Formulas

**Rule of 40:**
```
Rule of 40 Score = ARR Growth Rate (%) + Profit Margin (%)

Example: 80% growth + (−20%) margin = Score of 60 ✓
Example: 20% growth + 15% margin = Score of 35 ✗
```

**ARR Growth Rate (Advanced):**
```
Growth Rate = ((current_arr − arr_12mo_ago) ÷ arr_12mo_ago) × 100
```

**EBITDA Margin (Advanced):**
```
Gross Profit   = revenue − cogs
EBITDA         = gross_profit − (s_and_m + r_and_d + g_and_a)
EBITDA Margin  = (ebitda ÷ revenue) × 100
```

---

## Edge Cases

| Condition | Behavior |
|---|---|
| Growth rate = 0, margin = 0 | Score = 0 — show warning: "No growth and no profitability." |
| Growth rate > 200% | Allow — hypergrowth early-stage companies are valid |
| Margin < −100% | Allow — deeply negative margin is valid input |
| Revenue = 0 (Advanced) | Cannot calculate margin — show: "Enter revenue to calculate margin." |
| ARR 12mo ago = 0 | Cannot calculate growth rate — show: "Enter previous ARR to calculate growth." |
| Any field empty | Treat as 0 |

---

## Rule of 40 Health Badge

| Score | Label | Color |
|---|---|---|
| > 60 | Elite | #c8f060 |
| 40–60 | Healthy | #c8f060 |
| 25–39 | Below target | #f0c060 |
| 10–24 | Underperforming | #f0a040 |
| < 10 | Struggling | #f05050 |

---

## Score Interpretation

| Score | Text |
|---|---|
| > 60 | "Elite performance. Top-tier public SaaS companies like Snowflake and Datadog operate here." |
| 40–60 | "Healthy. You meet or exceed the Rule of 40 benchmark investors expect." |
| 25–39 | "Below target. Either grow faster, reduce burn, or both." |
| 10–24 | "Underperforming. Requires significant improvement in growth or margins." |
| < 10 | "Struggling. Urgent action needed on either side of the equation." |

---

## Public SaaS Benchmark Table (Advanced Mode)

Static reference table shown below results:

| Company | Growth Rate | Margin | Rule of 40 |
|---|---|---|---|
| Snowflake | 36% | 4% | 40 |
| Cloudflare | 28% | 12% | 40 |
| HubSpot | 23% | 18% | 41 |
| Datadog | 27% | 22% | 49 |
| Monday.com | 34% | 6% | 40 |

Note: "Based on publicly reported TTM figures. For reference only."

User's score is highlighted on this table as a row: "Your Company | X% | Y% | Z"

---

## Trend Chart (Advanced Mode)

- X axis: Q1 to Q4
- Y axis: Rule of 40 score
- Line: score per quarter — #c8f060
- Horizontal reference line at 40 — #f0a040, labeled "Rule of 40 threshold"
- Shaded area: green above 40, red below 40
- Hover tooltip: Q[N] | Growth: X% | Margin: Y% | Score: Z

---

## Shareable Results

- "Copy results as text" button — copies plain-text summary to clipboard
- "Share link" button — encodes all inputs into URL query params
- On page load: read query params and pre-fill all inputs if present