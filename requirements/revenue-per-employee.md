# Revenue Per Employee Calculator
**Path:** /revenue-per-employee/index.php

---

## Purpose

A client-side Revenue Per Employee (RPE) calculator for SaaS founders and operators
to measure team efficiency — one of the most telling signals of how well a company
converts headcount into output. Benchmarks against public SaaS companies and
industry standards. Helps founders make decisions about hiring, restructuring,
and when growth is outpacing the team or the team is outpacing growth.

---

## Modes

### Simple Mode (default)
ARR and headcount. Single RPE output with benchmark comparison.

### Advanced Mode
Department-level breakdown, RPE by function, cost per employee, revenue per
dollar of payroll, and trend tracking across quarters.

---

## Inputs

### Simple Mode

| Field | Default | Min | Max | Step | Label |
|---|---|---|---|---|---|
| Annual Recurring Revenue ($) | 2000000 | 0 | 999999999 | 1 | Current ARR ($) |
| Total full-time employees | 15 | 1 | 9999 | 1 | Total Employees (FTEs) |
| Include contractors? | No (toggle) | — | — | — | Include Contractors |
| Contractors (FTE equivalent) | 0 | 0 | 9999 | 0.1 | Contractors (FTE Equivalent) |

### Advanced Mode (adds the following)

**Department Breakdown (up to 6 departments)**

Start with 4 pre-filled. User can add up to 2 more or remove down to 1.

Each department row:

| Field | Default | Label |
|---|---|---|
| Department name | "Engineering" | Department |
| Headcount | 5 | Headcount |
| Annual fully-loaded cost ($) | 600000 | Annual Cost ($) |

Pre-filled departments: Engineering, Sales, Marketing, Operations.

**Revenue Detail**

| Field | Default | Min | Max | Step | Label |
|---|---|---|---|---|---|
| MRR ($) | 166667 | 0 | 9999999 | 1 | Current MRR ($) |
| ARR growth rate YoY (%) | 60 | -100 | 1000 | 0.1 | ARR Growth Rate YoY (%) |
| New ARR added this year ($) | 800000 | 0 | 999999999 | 1 | New ARR Added This Year ($) |

**Payroll**

| Field | Default | Min | Max | Step | Label |
|---|---|---|---|---|---|
| Total annual payroll ($) | 1800000 | 0 | 999999999 | 1 | Total Annual Payroll ($) |
| Payroll as % of ARR (auto-calculated) | — | — | — | — | Payroll / ARR Ratio |

**Historical Trend (up to 4 quarters)**

| Field | Label |
|---|---|
| Q1 ARR ($) | Q1 ARR |
| Q1 headcount | Q1 Headcount |
| Q2 ARR ($) | Q2 ARR |
| Q2 headcount | Q2 Headcount |
| Q3 ARR ($) | Q3 ARR |
| Q3 headcount | Q3 Headcount |
| Q4 ARR ($) | Q4 ARR |
| Q4 headcount | Q4 Headcount |

RPE calculated per quarter for trend chart.

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
| Revenue Per Employee | ARR ÷ total_headcount | currency |
| Total headcount | employees + (contractors if included) | integer |
| ARR per dollar of headcount | ARR ÷ total_headcount | same as RPE |
| Headcount needed to maintain RPE at target ARR | target_arr ÷ current_rpe | integer |

### Advanced-Only Metrics

| Metric | Formula | Format |
|---|---|---|
| Revenue per payroll dollar | ARR ÷ total_payroll | X.Xx |
| Payroll efficiency ratio | total_payroll ÷ ARR × 100 | X.X% |
| RPE per department | ARR ÷ dept_headcount | currency per dept |
| New ARR per sales & marketing employee | new_arr ÷ (sales_hc + marketing_hc) | currency |
| Cost per employee (avg) | total_payroll ÷ total_headcount | currency |
| Gross margin RPE | (ARR × gm%) ÷ headcount | currency |
| RPE growth trend | Q4 RPE vs Q1 RPE | "Improving +X%" / "Declining −X%" |
| Headcount growth vs ARR growth | compare YoY rates | ratio |

---

## Formulas

**Revenue Per Employee:**
```
RPE = ARR ÷ total_headcount
total_headcount = employees + (contractors × contractor_fte_weight if included)
```

**Revenue per payroll dollar:**
```
Revenue per $1 payroll = ARR ÷ total_annual_payroll
```

**Payroll efficiency:**
```
Payroll ratio = (total_payroll ÷ ARR) × 100
Benchmark: world-class SaaS = 40–60%. Median = 60–80%. Early stage = 80–120%.
```

**New ARR per sales & marketing FTE:**
```
New ARR per S&M = new_arr_added ÷ (sales_headcount + marketing_headcount)
```

**Headcount to maintain RPE:**
```
Required headcount = target_arr ÷ current_rpe
```

**RPE trend:**
```
RPE(quarter n) = quarterly_arr(n) ÷ headcount(n)
Trend = RPE(Q4) − RPE(Q1) expressed as % change
```

---

## Edge Cases

| Condition | Behavior |
|---|---|
| Headcount = 0 | RPE = "N/A — no employees entered" |
| ARR = 0 | RPE = $0 — show note: "No revenue yet." |
| Payroll > ARR | Payroll ratio > 100% — flag in red with note: "Payroll exceeds ARR. Common early-stage but unsustainable." |
| Department headcount sum ≠ total headcount | Show warning: "Department headcount totals X. Your total is Y. Reconcile for accurate dept RPE." |
| Contractors excluded | Headcount = employees only. Note shown. |
| Historical quarters partially filled | Calculate RPE only for quarters with both ARR and headcount filled |
| Any field empty | Treat as 0 |

---

## RPE Health Badge

| RPE | Label | Color |
|---|---|---|
| > $500K | Elite | #c8f060 |
| $300K–$500K | Strong | #c8f060 |
| $150K–$300K | Healthy | #a0d060 |
| $75K–$150K | Building | #f0c060 |
| < $75K | Early stage | #f0a040 |

---

## RPE Interpretation

Shown below RPE value.

| RPE | Text |
|---|---|
| > $500K | "Elite efficiency. Comparable to Shopify, Atlassian, and other high-leverage SaaS businesses." |
| $300K–$500K | "Strong. You're generating significant revenue per head." |
| $150K–$300K | "Healthy for a growing SaaS. Typical for Series A–B companies." |
| $75K–$150K | "Building stage. Normal for early-growth teams investing ahead of revenue." |
| < $75K | "Early stage or overhired relative to current revenue." |

---

## Public SaaS RPE Benchmark (static reference)

| Company | ARR (approx) | Employees | RPE |
|---|---|---|---|
| Basecamp | ~$100M | ~70 | ~$1.4M |
| Atlassian | ~$3.5B | ~10,000 | ~$350K |
| HubSpot | ~$2.2B | ~7,400 | ~$300K |
| Shopify | ~$7B | ~10,000 | ~$700K |
| Notion | ~$300M | ~500 | ~$600K |

User's RPE highlighted as a row: "Your Company | $X ARR | Y employees | $Z RPE"
Note: "Figures are approximate and for benchmarking reference only."

---

## RPE Trend Chart (Advanced Mode)

- X axis: Q1 to Q4
- Y axis: RPE in currency
- Line: RPE per quarter — #c8f060
- Secondary line: ARR per quarter (right axis) — #60d4f0, dashed
- Horizontal reference lines at benchmark RPE levels ($150K, $300K) — #888580
- Hover tooltip: Q[N] | ARR: $X | Headcount: Y | RPE: $Z

---

## Department RPE Bar Chart (Advanced Mode)

Horizontal bar chart:
- Each bar = one department
- Bar length = ARR attributed per department employee
- Sorted by RPE descending
- Color: accent green for highest RPE dept, red for lowest
- Below chart: "Your most revenue-efficient department is [name]. Your least is [name]."

Note shown: "Department RPE uses total ARR divided by department headcount as a
relative efficiency signal — not a literal attribution."

---

## Shareable Results

- "Copy results as text" button — copies plain-text summary to clipboard
- "Share link" button — encodes all inputs into URL query params
- On page load: read query params and pre-fill all inputs if present