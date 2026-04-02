# SaaS Pricing Calculator
**Path:** /saas-pricing-calculator/index.php

---

## Purpose

A client-side SaaS pricing calculator for founders to find the optimal price point
for their product based on costs, target margins, competitive positioning, and
willingness-to-pay signals. Covers cost-plus pricing, value-based pricing, and
competitive pricing methods — then recommends a range. Most founders either
undercharge out of fear or overprice without basis. This tool grounds the decision
in math.

---

## Modes

### Simple Mode (default)
Monthly cost per customer and target margin. Outputs minimum viable price and
recommended price range.

### Advanced Mode
Full cost structure, value metric selection, competitive benchmarking, and
pricing model comparison (flat, per-seat, usage-based, tiered).

---

## Inputs

### Simple Mode

| Field | Default | Min | Max | Step | Label |
|---|---|---|---|---|---|
| Monthly cost to serve one customer ($) | 8 | 0 | 9999999 | 0.01 | Cost to Serve per Customer / Month ($) |
| Target gross margin (%) | 75 | 0 | 100 | 0.1 | Target Gross Margin (%) |
| Monthly CAC ($) | 200 | 0 | 9999999 | 1 | Customer Acquisition Cost ($) |
| Target CAC payback (months) | 12 | 1 | 60 | 1 | Target CAC Payback (months) |

### Advanced Mode (adds the following)

**Full Cost Structure**

| Field | Default | Min | Max | Step | Label |
|---|---|---|---|---|---|
| Infrastructure per customer ($/mo) | 3 | 0 | 9999999 | 0.01 | Infrastructure ($/mo/customer) |
| Support cost per customer ($/mo) | 2 | 0 | 9999999 | 0.01 | Support Cost ($/mo/customer) |
| Payment processing (% of revenue) | 2.9 | 0 | 10 | 0.01 | Payment Processing (%) |
| Other variable cost per customer ($/mo) | 1 | 0 | 9999999 | 0.01 | Other Variable Cost ($/mo) |
| Monthly fixed costs ($) | 15000 | 0 | 9999999 | 1 | Total Monthly Fixed Costs ($) |
| Expected customers at this price | 100 | 1 | 9999999 | 1 | Expected Customer Count |

Fixed cost per customer = fixed_costs ÷ expected_customers.
Total cost per customer = variable + fixed_per_customer.

**Value-Based Pricing Inputs**

| Field | Default | Min | Max | Step | Label |
|---|---|---|---|---|---|
| Value delivered to customer per month ($) | 5000 | 0 | 9999999 | 1 | Monthly Value Delivered to Customer ($) |
| Typical value-based pricing capture (%) | 10 | 1 | 50 | 0.1 | Value Capture Rate (%) |

Value-based price = value_delivered × capture_rate/100.
Note shown: "SaaS products typically capture 5–20% of the value they deliver."

**Competitive Benchmarking**

Up to 4 competitors:

| Field | Default | Label |
|---|---|---|
| Competitor name | "Competitor A" | Name |
| Their monthly price ($) | 49 | Monthly Price ($) |
| Relative feature score vs you (%) | 80 | Their Feature Score (% of yours) |

Implied fair price vs each competitor = their_price ÷ their_feature_score × 100.

**Pricing Model Comparison**

Toggle to model the same revenue under different structures:

| Model | Fields |
|---|---|
| Flat monthly | Price per month |
| Per seat | Price per seat, expected seats per customer |
| Usage-based | Price per unit, expected units per customer per month |
| Tiered (3 tiers) | Starter / Growth / Enterprise price + expected customer mix % |

For each model: calculate effective ARPU, MRR at expected customers, and gross margin.

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
| Minimum viable price | cost_to_serve ÷ (1 − target_margin/100) | currency |
| CAC recovery price | cac ÷ payback_months | currency/month |
| Recommended price floor | max(minimum_viable_price, cac_recovery_price) | currency |
| Recommended price range | floor × 1.2 to floor × 2.0 | currency — currency |
| Gross margin at recommended price | (price − cost) ÷ price × 100 | X.X% |
| CAC payback at recommended price | cac ÷ (recommended_price − cost) | "X.X months" |

### Advanced-Only Metrics

| Metric | Formula | Format |
|---|---|---|
| Cost-plus price | total_cost_per_customer ÷ (1 − target_margin/100) | currency |
| Value-based price | value_delivered × capture_rate/100 | currency |
| Competitive fair price (avg) | avg of implied fair prices from competitor inputs | currency |
| Blended recommended price | weighted avg: cost-plus 30%, value-based 40%, competitive 30% | currency |
| MRR at recommended price | recommended_price × expected_customers | currency |
| ARR at recommended price | MRR × 12 | currency |
| Gross margin at recommended price | (price − total_cost) ÷ price × 100 | X.X% |
| LTV at recommended price | (price × gm%) ÷ assumed_monthly_churn | currency |
| LTV:CAC at recommended price | ltv ÷ cac | X.Xx |

---

## Formulas

**Minimum viable price (cost-plus):**
```
MVP = total_cost_per_customer ÷ (1 − target_margin / 100)
```

**CAC recovery floor:**
```
CAC Floor = cac ÷ target_payback_months
```

**Recommended price floor:**
```
Floor = max(MVP, CAC Floor)
Recommended range: Floor × 1.2 to Floor × 2.0
```

**Value-based price:**
```
VBP = value_delivered × (capture_rate / 100)
```

**Competitive implied price:**
```
For each competitor:
  Implied Fair Price = competitor_price ÷ (competitor_feature_score / 100)
Average across all competitors = competitive_fair_price
```

**Blended recommendation:**
```
Blended = (cost_plus × 0.3) + (value_based × 0.4) + (competitive × 0.3)
```

**Per-seat effective ARPU:**
```
Effective ARPU = seat_price × avg_seats_per_customer
```

**Usage-based effective ARPU:**
```
Effective ARPU = unit_price × avg_units_per_customer
```

**Tiered effective ARPU:**
```
Effective ARPU = Σ (tier_price × tier_mix/100) across tiers
```

---

## Edge Cases

| Condition | Behavior |
|---|---|
| Target margin = 100% | Minimum viable price = infinity — show error: "100% margin is not achievable." |
| Cost = 0 | Minimum viable price = $0 — show note: "No variable cost. Price based on CAC recovery and value." |
| Value delivered = 0 | Value-based price = $0 — skip value-based method from blended calculation |
| No competitor data | Skip competitive method from blended — reweight cost-plus 50% / value-based 50% |
| Tier mix ≠ 100% | Show warning — normalize or disable tiered calculation |
| CAC = 0 | CAC payback = "Instant" — no CAC floor applied |
| Expected customers = 0 | Cannot calculate fixed cost per customer — show error |
| Any field empty | Treat as 0 or use default |

---

## Pricing Method Comparison (Advanced Mode)

A side-by-side card for each method:

| Method | Price | Gross Margin | CAC Payback | LTV:CAC |
|---|---|---|---|---|
| Cost-plus | $X | X% | X mo | X.X |
| Value-based | $X | X% | X mo | X.X |
| Competitive | $X | X% | X mo | X.X |
| Blended | $X | X% | X mo | X.X |

Blended card highlighted in accent color.

---

## Pricing Health Badge

Based on gross margin at recommended price.

| Gross Margin | Label | Color |
|---|---|---|
| > 80% | Excellent | #c8f060 |
| 65–80% | Healthy | #a0d060 |
| 50–65% | Acceptable | #f0c060 |
| 30–50% | Thin | #f0a040 |
| < 30% | Unsustainable | #f05050 |

---

## Price Sensitivity Chart

- X axis: Price from $0 to recommended_price × 3
- Y axis: Gross margin %
- Line: gross margin at each price point — #c8f060
- Vertical dashed line at minimum viable price — #f0a040, labeled "Price floor"
- Vertical dashed line at recommended price — #c8f060, labeled "Recommended"
- Vertical dashed lines at competitor prices — #888580, labeled with competitor name
- Horizontal reference line at target margin — #60d4f0, labeled "Target margin"
- Hover tooltip: Price $X | Gross Margin: Y% | MRR at 100 customers: $Z

---

## Pricing Model Comparison Chart (Advanced Mode)

Bar chart showing effective ARPU across pricing models:
- Flat monthly
- Per seat
- Usage-based
- Tiered blended

Each bar labeled with model name and ARPU value.
Highest ARPU bar highlighted in accent green.

---

## Shareable Results

- "Copy results as text" button — copies plain-text summary to clipboard
- "Share link" button — encodes all inputs into URL query params
- On page load: read query params and pre-fill all inputs if present