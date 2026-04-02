# SaaS Fundraising Calculator
**Path:** /fundraising-calculator/index.php

---

## Purpose

A client-side fundraising calculator for SaaS founders preparing for or actively
running a fundraise. Calculates implied valuation, dilution, post-money ownership,
ARR multiples, and whether the deal terms are within market range. Helps founders
walk into investor conversations knowing exactly what the numbers mean and whether
the terms they are being offered are fair.

---

## Modes

### Simple Mode (default)
Target raise, pre-money valuation, ARR. Outputs dilution, post-money valuation,
ARR multiple.

### Advanced Mode
Adds SAFE/convertible note modeling, option pool expansion, multiple investors,
pro-rata rights, and secondary sale component.

---

## Inputs

### Simple Mode

| Field | Default | Min | Max | Step | Label |
|---|---|---|---|---|---|
| Current ARR ($) | 500000 | 0 | 999999999 | 1 | Current ARR ($) |
| Target raise amount ($) | 2000000 | 0 | 999999999 | 1 | Target Raise ($) |
| Pre-money valuation ($) | 8000000 | 0 | 999999999 | 1 | Pre-Money Valuation ($) |
| Founder ownership before raise (%) | 80 | 0 | 100 | 0.1 | Your Current Ownership (%) |

### Advanced Mode (adds the following)

**Cap Table Context**

| Field | Default | Min | Max | Step | Label |
|---|---|---|---|---|---|
| Existing investor ownership (%) | 15 | 0 | 100 | 0.1 | Existing Investor Ownership (%) |
| Employee option pool — current (%) | 5 | 0 | 50 | 0.1 | Current Option Pool (%) |
| New option pool to create (%) | 0 | 0 | 30 | 0.1 | New Option Pool (pre-money, %) |

**Revenue Metrics**

| Field | Default | Min | Max | Step | Label |
|---|---|---|---|---|---|
| MRR ($) | 41667 | 0 | 9999999 | 1 | Current MRR ($) |
| ARR growth rate YoY (%) | 100 | 0 | 1000 | 1 | ARR Growth Rate YoY (%) |
| Gross margin (%) | 75 | 0 | 100 | 0.1 | Gross Margin (%) |
| Net Revenue Retention (%) | 110 | 0 | 200 | 0.1 | Net Revenue Retention (%) |

**SAFE / Convertible Note (optional)**

| Field | Default | Min | Max | Step | Label |
|---|---|---|---|---|---|
| Outstanding SAFE / note amount ($) | 0 | 0 | 999999999 | 1 | Outstanding SAFE / Note ($) |
| SAFE cap ($) | 0 | 0 | 999999999 | 1 | Valuation Cap ($) |
| SAFE discount rate (%) | 20 | 0 | 50 | 0.1 | Discount Rate (%) |

**Secondary Sale**

| Field | Default | Min | Max | Step | Label |
|---|---|---|---|---|---|
| Secondary sale amount ($) | 0 | 0 | 999999999 | 1 | Secondary / Liquidity Amount ($) |

Secondary reduces founder's cash need without changing primary dilution.

**Multiple Investors (up to 4)**

Each investor row:

| Field | Default | Label |
|---|---|---|
| Investor name | "Lead VC" | Investor |
| Commitment ($) | 0 | Commitment ($) |
| Pro-rata rights | No (toggle) | Pro-Rata Rights |

Total of investor commitments must equal target raise — show delta if not.

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
| Post-Money Valuation | pre_money + raise_amount | currency |
| New Investor Ownership | raise_amount ÷ post_money × 100 | X.X% |
| Founder Ownership (post-raise) | current_ownership × (1 − dilution) | X.X% |
| ARR Multiple (pre-money) | pre_money ÷ current_arr | X.Xx |
| ARR Multiple (post-money) | post_money ÷ current_arr | X.Xx |
| Dilution | raise_amount ÷ post_money × 100 | X.X% |

### Advanced-Only Metrics

| Metric | Formula | Format |
|---|---|---|
| Post-money with option pool | pre_money + raise + new_pool_value | currency |
| Founder dilution from option pool | new_pool_pct impact on founder share | X.X% |
| Total dilution (raise + pool) | combined dilution | X.X% |
| Founder ownership (fully diluted) | after raise + option pool expansion | X.X% |
| SAFE conversion shares | safe_amount ÷ min(cap, pre_money × (1 − discount)) | X.X% of company |
| Effective pre-money (post-SAFE) | pre_money − safe_conversion_value | currency |
| Revenue multiple benchmark | pre_money ÷ arr vs market range | label |
| Implied ARR at exit (10x fund) | post_money × 10 ÷ assumed_exit_multiple | currency |
| Capital efficiency | arr ÷ total_raised_including_this_round | X.Xx |
| Months of runway from raise | raise_amount ÷ monthly_net_burn | "X months" |

---

## Formulas

**Basic dilution:**
```
Post-Money       = pre_money + raise_amount
New Investor %   = raise_amount ÷ post_money × 100
Founder Post %   = founder_pre_pct × (1 − new_investor_pct/100)
```

**With option pool expansion (pre-money pool):**
```
New option pool is created pre-money, diluting founders before the raise.
Effective pre-money for founder = pre_money after carving out new_pool_pct
Founder dilution from pool = founder_pre_pct × new_pool_pct / 100
```

**SAFE conversion (cap method):**
```
SAFE converts at lower of:
  Cap price     = safe_cap ÷ pre_raise_shares
  Discount price = round_price × (1 − safe_discount/100)
SAFE ownership % = safe_amount ÷ min(safe_cap, pre_money × (1 − discount/100)) × 100
```

**ARR Multiple:**
```
ARR Multiple = valuation ÷ current_arr
```

**Capital Efficiency:**
```
Capital Efficiency = current_arr ÷ total_capital_raised_to_date
> 1 means ARR exceeds total capital raised — highly efficient
```

---

## Edge Cases

| Condition | Behavior |
|---|---|
| ARR = 0 | ARR multiple = "N/A — no revenue yet" |
| Pre-money = 0 | Show error: "Pre-money valuation cannot be zero." |
| Raise > post-money | Impossible — show error |
| Founder % + existing investors % > 100 | Show warning: "Cap table exceeds 100%." |
| SAFE cap = 0 with SAFE amount > 0 | Show warning: "Enter a valuation cap for SAFE conversion." |
| Investor commitments ≠ target raise | Show: "Investor commitments total $X. Gap of $Y remaining." |
| Option pool + all ownership > 100% | Show error: "Total ownership exceeds 100%." |
| Any field empty | Treat as 0 |

---

## ARR Multiple Benchmark

Shown next to ARR multiple output. Based on 2024–2025 SaaS market ranges.

| ARR Multiple (pre-money) | Label | Color |
|---|---|---|
| > 30x | Top decile | #c8f060 |
| 15–30x | Strong | #c8f060 |
| 8–15x | Market rate | #a0d060 |
| 4–8x | Below market | #f0c060 |
| < 4x | Distressed / early | #f0a040 |

Show benchmark context line:
> "Seed: 10–25x ARR. Series A: 8–15x ARR. Series B+: 5–10x ARR. Market conditions vary."

---

## Dilution Interpretation

Shown below founder post-raise ownership.

| Founder Ownership Post-Raise | Text |
|---|---|
| > 70% | "Strong founder control retained." |
| 50–70% | "Healthy ownership. You retain clear majority." |
| 40–50% | "Watch cumulative dilution in future rounds." |
| 25–40% | "Moderate dilution. Plan for future rounds carefully." |
| < 25% | "Significant dilution. Future rounds may reduce motivation alignment." |

---

## Cap Table Visualization

A stacked horizontal bar showing ownership breakdown post-raise:

| Segment | Color |
|---|---|
| Founder(s) | #c8f060 |
| New investors | #60d4f0 |
| Existing investors | #a082f0 |
| Option pool | #f0a040 |
| SAFE holders (if any) | #f05050 |

Each segment labeled with name and percentage if segment > 8% wide.
Updates live on every input event.

---

## Round Modeling Table (Advanced Mode)

Project dilution across 3 hypothetical future rounds to show founder ownership trajectory.

| Round | Raise | Pre-Money | Dilution | Founder % |
|---|---|---|---|---|
| Current (this round) | inputs | inputs | calculated | calculated |
| Series A (projected) | user input | user input | calculated | calculated |
| Series B (projected) | user input | user input | calculated | calculated |

User can edit projected round amounts and valuations. Table updates live.

---

## Shareable Results

- "Copy results as text" button — copies plain-text summary to clipboard
- "Share link" button — encodes all inputs into URL query params
- On page load: read query params and pre-fill all inputs if present