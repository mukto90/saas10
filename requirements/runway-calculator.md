# SaaS Runway Calculator
**Path:** /runway-calculator/index.php

---

## Purpose

A client-side runway calculator for SaaS founders and operators to determine how many
months of cash they have left given current burn, and model how decisions — new hires,
cuts, revenue growth — extend or shrink that runway. Built for founders in survival
mode and those preparing for a fundraise.

---

## Modes

### Simple Mode (default)
Cash in bank, monthly burn, monthly revenue. Outputs runway in months.

### Advanced Mode
Full cost breakdown by category, headcount planner, revenue growth rate, and
scenario comparison (default vs optimistic vs pessimistic).

---

## Inputs

### Simple Mode

| Field | Default | Min | Max | Step | Label |
|---|---|---|---|---|---|
| Cash in bank ($) | 500000 | 0 | 999999999 | 1 | Cash in Bank ($) |
| Monthly gross burn ($) | 40000 | 0 | 9999999 | 1 | Monthly Gross Burn ($) |
| Monthly revenue ($) | 10000 | 0 | 9999999 | 1 | Monthly Revenue ($) |

### Advanced Mode (adds the following)

**Cost Breakdown**

| Field | Default | Min | Max | Step | Label |
|---|---|---|---|---|---|
| Salaries & contractors ($) | 25000 | 0 | 9999999 | 1 | Salaries & Contractors ($/mo) |
| Infrastructure & hosting ($) | 3000 | 0 | 9999999 | 1 | Infrastructure & Hosting ($/mo) |
| Marketing & ads ($) | 5000 | 0 | 9999999 | 1 | Marketing & Ads ($/mo) |
| Tools & subscriptions ($) | 2000 | 0 | 9999999 | 1 | Tools & Subscriptions ($/mo) |
| Office & operations ($) | 2000 | 0 | 9999999 | 1 | Office & Operations ($/mo) |
| Other expenses ($) | 3000 | 0 | 9999999 | 1 | Other Expenses ($/mo) |

If cost breakdown fields are filled, sum them to override the gross burn field.
Show reconciliation note if manual burn differs from sum: "Your itemized costs total
$X, but you entered $Y as gross burn. Using itemized total."

**Headcount Planner**

Up to 5 planned hires. Each row:

| Field | Default | Label |
|---|---|---|
| Role | "Engineer" | Role |
| Monthly fully-loaded cost ($) | 8000 | Monthly Cost ($) |
| Start month | 1 | Hire in Month # |

Each hire added increases monthly burn from its start month forward, affecting
runway dynamically.

**Revenue Growth**

| Field | Default | Min | Max | Step | Label |
|---|---|---|---|---|---|
| Monthly revenue growth rate (%) | 0 | -50 | 200 | 0.1 | Monthly Revenue Growth (%) |
| One-time incoming cash ($) | 0 | 0 | 999999999 | 1 | Expected Cash Injection ($) |
| Cash injection arriving in month | 1 | 1 | 36 | 1 | Injection Arrives in Month # |

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
| Monthly Net Burn | gross_burn − monthly_revenue | currency |
| Runway | cash ÷ net_burn | "X.X months" |
| Runway End Date | today + runway months | "MMM YYYY" |
| Cash at 6 months | cash − (net_burn × 6) | currency |
| Cash at 12 months | cash − (net_burn × 12) | currency |

### Advanced-Only Metrics

| Metric | Formula | Format |
|---|---|---|
| Runway with hires | recalculated with increasing burn per hire schedule | "X.X months" |
| Runway with revenue growth | recalculated with compounding revenue | "X.X months" |
| Break-even month | first month where revenue >= gross_burn | "Month X" or "Not reached" |
| Total cash burned at break-even | Σ net_burn from month 1 to break-even month | currency |
| Headcount cost % of burn | salaries ÷ gross_burn × 100 | X.X% |
| months to fundraise trigger | months until cash drops below 3-month reserve | "Month X" |

---

## Formulas

**Simple runway:**
```
Net Burn = gross_burn − monthly_revenue
Runway   = cash_in_bank ÷ net_burn
```

**With revenue growth (Advanced):**
```
Revenue (month n)   = monthly_revenue × (1 + growth_rate/100)^(n-1)
Net Burn (month n)  = gross_burn(n) − Revenue(n)
Cash (month n)      = Cash(n-1) − Net Burn(n)
Runway              = first month n where Cash(n) <= 0
```

**With hires (Advanced):**
```
Gross Burn (month n) = base_burn + Σ hire_cost for all hires where start_month <= n
```

**With cash injection (Advanced):**
```
Cash (injection_month) += one_time_cash
```

**Break-even month:**
```
First month n where Revenue(n) >= Gross Burn(n)
```

**Fundraise trigger:**
```
First month n where Cash(n) <= (net_burn × 3)
Signals when founder should start fundraising (3-month buffer before zero)
```

---

## Edge Cases

| Condition | Behavior |
|---|---|
| Net burn = 0 (revenue = burn) | Runway = "Infinite — you are at break-even" |
| Revenue > burn | Net burn is negative (profitable) — show "Cash positive. Growing by $X/mo." |
| Cash = 0 | Runway = "0 months — no cash remaining" |
| Runway > 60 months | Display as "> 60 months — effectively infinite runway" |
| Hire start month > runway | Flag hire: "This hire starts after projected cash-out." |
| Revenue growth makes burn negative before cash runs out | Show break-even month prominently |
| Cash injection month > runway | Flag: "Injection arrives after projected cash-out." |
| Any field empty | Treat as 0 |

---

## Runway Health Badge

Shown next to the Runway value.

| Runway | Label | Color |
|---|---|---|
| > 24 months | Safe | #c8f060 |
| 18–24 months | Comfortable | #a0d060 |
| 12–18 months | Plan ahead | #f0c060 |
| 6–12 months | Start fundraising | #f0a040 |
| < 6 months | Critical | #f05050 |
| Cash positive | Profitable | #c8f060 |

---

## Fundraise Timing Interpretation

Shown below the runway value.

| Runway | Text |
|---|---|
| > 18 months | "You have strong runway. Begin fundraising conversations in Month X to close before Month Y." |
| 12–18 months | "Start fundraising now. Raise typically takes 3–6 months to close." |
| 6–12 months | "Fundraising is urgent. You have limited time to run a proper process." |
| < 6 months | "Emergency mode. Focus on cutting burn or closing a bridge round immediately." |
| Cash positive | "You are cash flow positive. Fundraising is optional — raise from a position of strength." |

Fundraise start recommendation = runway_months − 6 (months from now).

---

## Projection Chart

- X axis: Month 0 to Month N (runway end or 24 months, whichever is less)
- Y axis: Cash remaining in currency
- Line 1: Cash balance month by month — #c8f060
- Line 2 (Advanced): Cash with planned hires — #f05050 (dashed)
- Line 3 (Advanced): Cash with revenue growth — #60d4f0 (dashed)
- Horizontal reference line at 3-month cash reserve — #f0a040, labeled "Fundraise trigger"
- Horizontal reference line at $0 — #f05050, labeled "Cash out"
- Vertical dashed line at runway end — labeled "Month X — Cash out"
- Vertical dashed line at break-even (if reached) — #c8f060, labeled "Break-even"
- Hover tooltip: Month X | Cash: $Y | Burn: $Z | Revenue: $A

---

## Scenario Comparison (Advanced Mode)

Three side-by-side metric cards comparing:

| Scenario | Definition |
|---|---|
| Default | Current inputs as entered |
| Optimistic | Revenue growth +5%/mo, no new hires |
| Pessimistic | Revenue growth −5%/mo, all hires proceed |

Each card shows: Runway, Break-even month, Cash at 12 months.

---

## Shareable Results

- "Copy results as text" button — copies plain-text summary to clipboard
- "Share link" button — encodes all inputs into URL query params
- On page load: read query params and pre-fill all inputs if present