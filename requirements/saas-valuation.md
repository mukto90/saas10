# SaaS Valuation Calculator
**Path:** /saas-valuation/index.php

---

## Purpose

A client-side SaaS valuation calculator for founders to estimate what their company
is worth today using multiple valuation methods — ARR multiple, DCF, comparable
transactions, and Rule of 40 adjusted multiples. Founders use this before fundraising,
acqui-hires, secondary sales, and strategic planning. Surfaces a valuation range,
not a single number, because no honest tool gives you just one figure.

---

## Modes

### Simple Mode (default)
ARR and growth rate. Outputs ARR multiple-based valuation range.

### Advanced Mode
Full metrics input. Calculates valuation via 3 methods and blends into a range
with weighting controls.

---

## Inputs

### Simple Mode

| Field | Default | Min | Max | Step | Label |
|---|---|---|---|---|---|
| Current ARR ($) | 1000000 | 0 | 999999999 | 1 | Current ARR ($) |
| ARR growth rate YoY (%) | 80 | 0 | 1000 | 0.1 | ARR Growth Rate YoY (%) |
| Stage | select | Series A | Pre-seed, Seed, Series A, Series B, Series C+, Bootstrapped / Profitable | Stage |

### Advanced Mode (adds the following)

**Revenue Quality**

| Field | Default | Min | Max | Step | Label |
|---|---|---|---|---|---|
| MRR ($) | 83333 | 0 | 9999999 | 1 | Current MRR ($) |
| Net Revenue Retention (%) | 110 | 0 | 200 | 0.1 | Net Revenue Retention (%) |
| Gross margin (%) | 75 | 0 | 100 | 0.1 | Gross Margin (%) |
| % revenue from contracts > 12mo | 40 | 0 | 100 | 1 | % Multi-Year Contracts |
| Customer concentration — top customer % of ARR | 10 | 0 | 100 | 0.1 | Top Customer % of ARR |

**Profitability**

| Field | Default | Min | Max | Step | Label |
|---|---|---|---|---|---|
| EBITDA margin (%) | -20 | -200 | 100 | 0.1 | EBITDA Margin (%) |
| Free cash flow margin (%) | -15 | -200 | 100 | 0.1 | FCF Margin (%) |
| Monthly net burn ($) | 80000 | 0 | 9999999 | 1 | Monthly Net Burn ($) |

**DCF Inputs**

| Field | Default | Min | Max | Step | Label |
|---|---|---|---|---|---|
| Projected revenue growth yr 1 (%) | 80 | 0 | 500 | 0.1 | Revenue Growth — Year 1 (%) |
| Projected revenue growth yr 2 (%) | 60 | 0 | 500 | 0.1 | Revenue Growth — Year 2 (%) |
| Projected revenue growth yr 3 (%) | 40 | 0 | 500 | 0.1 | Revenue Growth — Year 3 (%) |
| Terminal growth rate (%) | 3 | 0 | 10 | 0.1 | Terminal Growth Rate (%) |
| Discount rate (%) | 25 | 5 | 60 | 0.1 | Discount Rate (%) |
| Target EBITDA margin at maturity (%) | 20 | 0 | 60 | 0.1 | Target EBITDA Margin at Maturity (%) |

**Method Weighting (sliders, must sum to 100%)**

| Method | Default Weight |
|---|---|
| ARR Multiple | 60% |
| DCF | 20% |
| Comparable Transactions | 20% |

Show live sum — warn if not 100%.

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
| ARR Multiple (low) | ARR × low_multiple | currency |
| ARR Multiple (mid) | ARR × mid_multiple | currency |
| ARR Multiple (high) | ARR × high_multiple | currency |
| Valuation Range | low to high | "currency — currency" |
| Implied ARR Multiple | mid_valuation ÷ ARR | X.Xx |

### Advanced-Only Metrics

| Metric | Formula | Format |
|---|---|---|
| DCF Valuation | sum of discounted cash flows + terminal value | currency |
| Comparable Transaction Value | ARR × comp_multiple | currency |
| Blended Valuation | weighted avg of all 3 methods | currency |
| Blended Valuation Range | ±20% around blended | currency — currency |
| Rule of 40 Score | growth + ebitda_margin | integer |
| Multiple adjustment from NRR | +/− applied to base multiple | X.Xx modifier |
| Multiple adjustment from gross margin | +/− applied to base multiple | X.Xx modifier |

---

## Formulas

**Base ARR Multiple by Stage and Growth:**

| Stage | Growth < 50% | Growth 50–100% | Growth 100–200% | Growth > 200% |
|---|---|---|---|---|
| Pre-seed | 3–6x | 5–10x | 8–15x | 10–20x |
| Seed | 5–8x | 8–15x | 12–20x | 15–30x |
| Series A | 6–10x | 10–18x | 15–25x | 20–40x |
| Series B | 5–8x | 8–15x | 12–20x | 15–30x |
| Series C+ | 4–7x | 6–12x | 10–18x | 12–25x |
| Bootstrapped | 3–5x | 5–8x | 7–12x | 10–18x |

**NRR Multiple Adjustment (Advanced):**
```
NRR > 130%:  +2x to base multiple
NRR 110–130%: +1x
NRR 90–110%:  no adjustment
NRR < 90%:   −1x to −2x
```

**Gross Margin Adjustment (Advanced):**
```
GM > 80%:    +1x
GM 60–80%:   no adjustment
GM < 60%:    −1x to −2x
```

**Adjusted ARR Multiple:**
```
Adjusted Multiple = base_multiple + nrr_adjustment + gm_adjustment
Valuation = ARR × adjusted_multiple
```

**DCF:**
```
Revenue(yr n) = current_arr × (1 + growth_yr_n/100)
EBITDA(yr n)  = Revenue(yr n) × target_ebitda_margin/100
                (linearly scaled from current margin to target over 3 years)
PV(yr n)      = EBITDA(yr n) ÷ (1 + discount_rate/100)^n
Terminal Value = EBITDA(yr 3) × (1 + terminal_growth/100)
                 ÷ (discount_rate/100 − terminal_growth/100)
PV(terminal)  = Terminal Value ÷ (1 + discount_rate/100)^3
DCF Value     = Σ PV(yr 1..3) + PV(terminal)
```

**Comparable Transaction Multiple:**
```
Comp multiple = average of stage + growth bucket from static comp table (below)
Comp Valuation = ARR × comp_multiple
```

**Blended Valuation:**
```
Blended = (ARR_mid × arr_weight/100)
        + (DCF × dcf_weight/100)
        + (Comp × comp_weight/100)
```

---

## Comparable Transaction Reference (static, Advanced Mode)

| Stage | Metric | Multiple Range | Recent Examples |
|---|---|---|---|
| Seed | ARR | 8–20x | — |
| Series A | ARR | 10–25x | — |
| Series B | ARR | 8–18x | — |
| Profitable / bootstrapped | ARR | 3–6x | — |
| Strategic acquisition | ARR | 4–8x | — |

Note shown: "Based on 2023–2025 private SaaS transaction data. Multiples fluctuate with market conditions."

---

## Edge Cases

| Condition | Behavior |
|---|---|
| ARR = 0 | Valuation = "Cannot calculate — no revenue yet." |
| Growth = 0, not profitable | Use low end of multiple range |
| DCF results in negative value | Show $0 with note: "DCF is negative — business not yet profitable enough for DCF method." |
| Discount rate < terminal growth | Show error: "Discount rate must exceed terminal growth rate." |
| Method weights ≠ 100% | Show warning, disable blended calculation until corrected |
| NRR > 150% | Cap adjustment at +3x with note |
| Customer concentration > 30% | Show warning: "High customer concentration reduces valuation. Investors will apply a discount." |
| Any field empty | Treat as 0 or use default |

---

## Valuation Range Visual

A horizontal range bar showing:
```
|--[low]--------[mid]--------[high]--|
$Xm                                  $Ym
```
- Low end: red-tinted
- Mid point: accent green dot
- High end: green-tinted
- Labels below: method names at their contribution points (Advanced)

---

## Valuation Health Badge

Based on ARR multiple implied by mid valuation.

| ARR Multiple | Label | Color |
|---|---|---|
| > 20x | Premium | #c8f060 |
| 10–20x | Strong | #a0d060 |
| 5–10x | Market rate | #f0c060 |
| 2–5x | Conservative | #f0a040 |
| < 2x | Distressed | #f05050 |

---

## Sensitivity Table (Advanced Mode)

A 5×5 grid showing valuation at different combinations of growth rate and margin:

| | Margin −20% | Margin −10% | Margin 0% | Margin +10% | Margin +20% |
|---|---|---|---|---|---|
| Growth 40% | $X | $X | $X | $X | $X |
| Growth 60% | $X | $X | $X | $X | $X |
| Growth 80% | $X | $X | $X | $X | $X |
| Growth 100% | $X | $X | $X | $X | $X |
| Growth 120% | $X | $X | $X | $X | $X |

Current inputs highlighted in the grid. Color-coded by valuation range.

---

## Shareable Results

- "Copy results as text" button — copies plain-text summary to clipboard
- "Share link" button — encodes all inputs into URL query params
- On page load: read query params and pre-fill all inputs if present