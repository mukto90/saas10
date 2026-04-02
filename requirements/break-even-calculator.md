# Break-Even Calculator
**Path:** /break-even-calculator/index.php

---

## Purpose

A client-side break-even calculator for SaaS founders, product managers, and operators
to find exactly how many customers or units they need to cover all costs. Covers both
unit economics break-even (how many customers to cover fixed costs) and cash break-even
(when total revenue exceeds total spend). Useful for new product launches, pricing
decisions, and investor conversations.

---

## Modes

### Simple Mode (default)
Fixed costs, variable cost per unit, price per unit. Outputs break-even units and revenue.

### Advanced Mode
Adds multiple revenue streams, tiered pricing, contribution margin analysis,
and target profit goal.

---

## Inputs

### Simple Mode

| Field | Default | Min | Max | Step | Label |
|---|---|---|---|---|---|
| Monthly fixed costs ($) | 10000 | 0 | 9999999 | 1 | Monthly Fixed Costs ($) |
| Variable cost per customer ($) | 5 | 0 | 9999999 | 0.01 | Variable Cost per Customer ($) |
| Price per customer per month ($) | 49 | 0 | 9999999 | 0.01 | Price per Customer / Month ($) |

### Advanced Mode (adds the following)

**Fixed Cost Breakdown**

| Field | Default | Min | Max | Step | Label |
|---|---|---|---|---|---|
| Salaries ($) | 7000 | 0 | 9999999 | 1 | Salaries ($/mo) |
| Infrastructure ($) | 1000 | 0 | 9999999 | 1 | Infrastructure ($/mo) |
| Marketing ($) | 1000 | 0 | 9999999 | 1 | Marketing ($/mo) |
| Other fixed ($) | 1000 | 0 | 9999999 | 1 | Other Fixed Costs ($/mo) |

Sum of breakdown overrides manual fixed cost input with reconciliation note.

**Variable Cost Breakdown**

| Field | Default | Min | Max | Step | Label |
|---|---|---|---|---|---|
| Payment processing (%) | 2.9 | 0 | 100 | 0.01 | Payment Processing (% of revenue) |
| Support cost per customer ($) | 2 | 0 | 9999999 | 0.01 | Support Cost per Customer ($/mo) |
| Infrastructure per customer ($) | 1 | 0 | 9999999 | 0.01 | Infra Cost per Customer ($/mo) |
| Other variable per customer ($) | 0 | 0 | 9999999 | 0.01 | Other Variable Cost ($/mo) |

Total variable cost per customer = support + infra + other + (price × payment_processing/100)

**Target Profit**

| Field | Default | Min | Max | Step | Label |
|---|---|---|---|---|---|
| Target monthly profit ($) | 0 | 0 | 9999999 | 1 | Target Monthly Profit ($) |

When set > 0, adds a "Customers needed for target profit" output.

**Multiple Pricing Tiers (up to 3)**

Same structure as MRR calculator tier rows. Each tier contributes a blended
contribution margin to the break-even calculation.

| Field | Default | Label |
|---|---|---|
| Tier name | "Starter" | Tier Name |
| Price per month ($) | 29 | Price / Month ($) |
| Variable cost per customer ($) | 3 | Variable Cost ($) |
| Expected customer mix (%) | 60 | Customer Mix (%) |

Customer mix must sum to 100% across tiers — show warning if not.

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
| Contribution Margin per Customer | price − variable_cost | currency |
| Contribution Margin Ratio | (contribution_margin ÷ price) × 100 | X.X% |
| Break-Even Customers | fixed_costs ÷ contribution_margin | integer (round up) |
| Break-Even Revenue | break_even_customers × price | currency |
| Current Profit / Loss | (current_customers × contribution_margin) − fixed_costs | currency |

### Advanced-Only Metrics

| Metric | Formula | Format |
|---|---|---|
| Customers for Target Profit | (fixed_costs + target_profit) ÷ contribution_margin | integer (round up) |
| Revenue for Target Profit | customers_for_target × blended_price | currency |
| Blended Contribution Margin | Σ (tier_cm × tier_mix/100) across tiers | currency |
| Blended Price | Σ (tier_price × tier_mix/100) | currency |
| Safety Margin | (current_customers − break_even_customers) ÷ current_customers × 100 | X.X% |
| Operating Leverage | fixed_costs ÷ (fixed_costs + total_variable_costs) | X.X |
| Gross Margin % | (price − variable_cost) ÷ price × 100 | X.X% |

---

## Formulas

**Contribution Margin:**
```
Contribution Margin = price_per_customer − variable_cost_per_customer
```

**Break-Even Units:**
```
Break-Even Customers = CEIL(fixed_costs ÷ contribution_margin)
```

**Break-Even Revenue:**
```
Break-Even Revenue = Break-Even Customers × price_per_customer
```

**With target profit:**
```
Customers for Target = CEIL((fixed_costs + target_profit) ÷ contribution_margin)
```

**Blended contribution margin (multiple tiers):**
```
Blended CM = Σ [ (tier_price − tier_variable_cost) × (tier_mix / 100) ]
Break-Even  = CEIL(fixed_costs ÷ Blended CM)
```

**Safety Margin:**
```
Safety Margin = ((current_customers − break_even_customers) ÷ current_customers) × 100
Positive = above break-even. Negative = below break-even.
```

**Variable cost with payment processing:**
```
Payment fee = price × (payment_processing_pct / 100)
Total variable = support_cost + infra_cost + other_variable + payment_fee
```

---

## Edge Cases

| Condition | Behavior |
|---|---|
| Contribution margin = 0 | Break-even = "Infinite — you make $0 per customer." Show warning. |
| Contribution margin < 0 | Break-even = "Impossible — you lose money on every customer." Show error in red. |
| Fixed costs = 0 | Break-even = 0 customers — "No fixed costs means any revenue is profit." |
| Variable cost > price | Contribution margin is negative — show error. |
| Tier mix does not sum to 100% | Show warning: "Customer mix must total 100%. Currently at X%." Disable blended calc. |
| Target profit = 0 | Hide "Customers for target profit" metric |
| Current customers = 0 | Safety margin = N/A |
| Any field empty | Treat as 0 |

---

## Break-Even Health Badge

Shown next to break-even customers output.

| Context | Label | Color |
|---|---|---|
| Already past break-even | Profitable | #c8f060 |
| Within 10% of break-even | Almost there | #a0d060 |
| 10–50% below break-even | Growing | #f0c060 |
| > 50% below break-even | Pre-revenue stage | #f0a040 |
| Contribution margin < 0 | Unviable pricing | #f05050 |

---

## Contribution Margin Interpretation

Shown below contribution margin ratio.

| CM Ratio | Text |
|---|---|
| > 80% | "Excellent margins. Typical for pure-software SaaS." |
| 60–80% | "Healthy margins. Good unit economics." |
| 40–60% | "Moderate. Review variable costs for optimization." |
| 20–40% | "Thin margins. High variable cost relative to price." |
| < 20% | "Margins are too thin to scale profitably. Reprice or cut variable costs." |
| < 0% | "Negative margin. You lose money on every customer acquired." |

---

## Break-Even Chart

- X axis: Number of customers (0 to break-even × 2)
- Y axis: Currency
- Line 1: Total Revenue (price × customers) — #c8f060
- Line 2: Total Costs (fixed_costs + variable_cost × customers) — #f05050
- Shaded area: red where costs > revenue, green where revenue > costs
- Vertical dashed line at break-even customer count — labeled "Break-even: X customers"
- Horizontal dashed line at fixed costs level — labeled "Fixed Costs: $X"
- Dot at break-even intersection point
- Hover tooltip: X customers | Revenue: $Y | Costs: $Z | Profit: $A

---

## Scenario Bar (Advanced Mode)

Three side-by-side cards:

| Scenario | Definition |
|---|---|
| Current pricing | Inputs as entered |
| +20% price increase | Price × 1.2, same variable cost and fixed costs |
| −20% variable cost reduction | Variable cost × 0.8, same price and fixed costs |

Each card shows: Break-even customers, Contribution margin %, Profit at current customers.

---

## Shareable Results

- "Copy results as text" button — copies plain-text summary to clipboard
- "Share link" button — encodes all inputs into URL query params
- On page load: read query params and pre-fill all inputs if present