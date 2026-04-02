# Cohort Retention Table
**Path:** /cohort-retention/index.php

---

## Purpose

A client-side cohort retention calculator and visualizer for SaaS founders and
operators to understand how well different customer cohorts are retained over time.
Produces the standard cohort retention grid used in investor decks, board reports,
and product reviews. Reveals whether retention is improving, declining, or flat
across cohorts — which a single churn rate number cannot show.

---

## Modes

### Simple Mode (default)
Enter retention percentages manually for up to 6 cohorts across up to 12 months.
Outputs color-coded retention grid and average retention curve.

### Advanced Mode
Enter cohort size and absolute customer counts per month instead of percentages.
Adds revenue retention layer (if MRR per cohort is provided), and benchmark
comparison against SaaS industry averages.

---

## Inputs

### Simple Mode

**Grid Input — up to 6 cohorts × 12 months**

Each row = one cohort (e.g. "Jan 2024").
Each column = month since acquisition (Month 0 to Month 11).
Month 0 is always 100% (acquisition month).

| Field | Label |
|---|---|
| Cohort name | e.g. "Jan 2024", "Q1 2024" — text input, max 12 chars |
| Month 1 retention (%) | % of original cohort still active in month 1 |
| Month 2 retention (%) | % of original cohort still active in month 2 |
| ... | ... up to Month 11 |

- User starts with 3 cohorts pre-filled with sample data
- "Add Cohort" button adds a new row (max 6)
- "Remove" control on each row (min 1 cohort)
- All cells accept 0–100, step 0.1
- Cells can be left empty if data is not yet available — render as blank/gray in grid

**Sample pre-filled data (3 cohorts):**

| Cohort | M0 | M1 | M2 | M3 | M4 | M5 | M6 |
|---|---|---|---|---|---|---|---|
| Jan 2024 | 100 | 78 | 65 | 58 | 53 | 50 | 48 |
| Feb 2024 | 100 | 80 | 68 | 61 | 55 | 52 | — |
| Mar 2024 | 100 | 82 | 71 | 63 | — | — | — |

### Advanced Mode (adds the following per cohort)

| Field | Default | Label |
|---|---|---|
| Cohort starting size (customers) | 100 | Starting Customers |
| MRR at cohort start ($) | 0 | Starting MRR ($) |

Per cell: instead of percentage, enter absolute customer count. Calculator derives
retention % automatically: cell_count ÷ starting_size × 100.

If MRR is provided per cohort, add a second grid layer showing revenue retention
per cohort per month.

**Benchmark toggle (Advanced)**

Toggle to overlay industry average retention benchmarks on the curve chart:

| Benchmark | M1 | M3 | M6 | M12 |
|---|---|---|---|---|
| Top quartile SaaS | 85% | 75% | 68% | 60% |
| Median SaaS | 70% | 58% | 50% | 42% |
| Bottom quartile | 55% | 40% | 32% | 25% |

Source shown below chart: "Benchmarks based on OpenView SaaS benchmarks 2024."

---

## Outputs

### Retention Grid (primary visual)

A color-coded table where:
- Rows = cohorts
- Columns = Month 0 through Month N
- Cell value = retention percentage
- Cell background = heatmap color based on retention value

**Heatmap color scale:**

| Retention % | Background | Text |
|---|---|---|
| 90–100% | #1a3a1a | #c8f060 |
| 75–89% | #1a2e1a | #a0d060 |
| 60–74% | #2e2a0a | #f0c060 |
| 40–59% | #2e1a0a | #f0a040 |
| < 40% | #2e0a0a | #f05050 |
| Empty | #161616 | — |

Month 0 column is always #1a3a1a / 100% — not editable.

### Summary Metrics (below grid)

| Metric | Formula | Format |
|---|---|---|
| Average M1 retention | avg of all cohort M1 values | X.X% |
| Average M3 retention | avg of all cohort M3 values | X.X% |
| Average M6 retention | avg of all cohort M6 values | X.X% |
| Average M12 retention | avg of all cohort M12 values (if available) | X.X% |
| Best performing cohort | cohort with highest avg retention across all months | label |
| Worst performing cohort | cohort with lowest avg retention across all months | label |
| Retention trend | comparing newest cohort M1 vs oldest cohort M1 | "Improving +X%" / "Declining −X%" / "Flat" |

### Advanced-Only Metrics

| Metric | Formula | Format |
|---|---|---|
| Average cohort size | avg starting_size across cohorts | integer |
| Total customers tracked | Σ starting_size | integer |
| Weighted avg M1 retention | Σ (cohort_M1 × cohort_size) ÷ Σ cohort_size | X.X% |
| Revenue retention M1 (avg) | avg of revenue retention M1 across cohorts | X.X% |
| Implied annual churn | 1 − (avg_M12_retention / 100) | X.X% |
| Implied monthly churn | 1 − (avg_M1_retention/100)^(1/12) expressed monthly | X.X% |

---

## Formulas

**Retention % (Advanced mode, from absolute counts):**
```
Retention % (month n) = customers_month_n ÷ starting_customers × 100
```

**Average retention at month N:**
```
Avg Retention(N) = Σ cohort_retention(N) ÷ number_of_cohorts_with_data_at_N
Only average over cohorts that have data for that month — skip empty cells.
```

**Weighted average retention:**
```
Weighted Avg = Σ (cohort_retention_M1 × cohort_starting_size) ÷ Σ cohort_starting_size
```

**Retention trend:**
```
Compare M1 retention of most recent cohort vs oldest cohort.
Trend = newest_M1 − oldest_M1
Positive = improving. Negative = declining.
```

**Implied monthly churn from M12:**
```
Monthly churn = 1 − (M12_retention / 100)^(1/12)
```

---

## Edge Cases

| Condition | Behavior |
|---|---|
| Cell value > 100 | Cap at 100, show warning on that cell |
| Cell value < 0 | Floor at 0 |
| Month N value > Month N-1 value | Allow — net retention can increase with expansion. Show subtle upward indicator. |
| All cells in a month column empty | Skip that month in average calculations |
| Single cohort entered | Show grid and curve — averages = that cohort's values |
| Starting size = 0 (Advanced) | Skip cohort from weighted calculations |
| No M12 data | Implied annual churn = "Insufficient data" |
| Any retention cell empty | Render as blank gray cell — exclude from averages |

---

## Retention Curve Chart

- X axis: Month 0 to Month 11 (or max months with data)
- Y axis: Retention % (0–100%)
- One line per cohort, each a distinct color:
  - Cohort 1: #c8f060
  - Cohort 2: #60d4f0
  - Cohort 3: #a082f0
  - Cohort 4: #f0a040
  - Cohort 5: #f05050
  - Cohort 6: #888580
- Bold average retention line across all cohorts — #ffffff, dashed
- Benchmark lines (Advanced, if toggle on):
  - Top quartile: subtle #c8f060 dotted
  - Median: subtle #888580 dotted
- Hover tooltip: Month X | Cohort Y: Z% | Average: A%
- Legend below chart: cohort names with color indicators

---

## Retention Health Summary

Shown below chart. Based on average M3 retention.

| Avg M3 Retention | Label | Color |
|---|---|---|
| > 75% | Excellent | #c8f060 |
| 60–75% | Good | #a0d060 |
| 45–60% | Moderate | #f0c060 |
| 30–45% | Concerning | #f0a040 |
| < 30% | Critical | #f05050 |

---

## Cohort Trend Insight

A dynamic line below the summary metrics:

> "Your M1 retention has [improved by X% / declined by X% / remained flat] from
> [oldest cohort] to [newest cohort]. [If improving: 'This is a strong signal that
> product improvements are working.'] [If declining: 'Investigate whether recent
> cohorts experienced changes in onboarding, pricing, or customer fit.']"

---

## Export Options

- "Copy as CSV" — exports the full retention grid as comma-separated values for
  paste into Excel or Google Sheets
- "Share link" — encodes all grid values into URL query params
- On page load: read query params and pre-fill all grid cells if present