# CAC Payback Calculator
**Path:** /cac-payback-calculator/index.php

---

## Purpose

A focused calculator for SaaS founders to determine how long it takes to recover the cost of acquiring a customer. While the LTV:CAC Ratio tool includes payback, this standalone tool gives deeper analysis — calculating payback by pricing tier, modeling scenarios, and showing the impact of pricing changes.

---

## How It Works

1. User enters core acquisition and revenue metrics
2. Calculator computes payback period using gross margin
3. Advanced mode allows tier-by-tier analysis and scenario modeling

---

## Inputs

### Core Metrics (Simple Mode)

| Field | Type | Label | Placeholder | Required |
|---|---|---|---|---|
| CAC ($) | number | Customer Acquisition Cost | "500" | Yes |
| Monthly ARPU ($) | number | Average Revenue Per User | "99" | Yes |
| Gross Margin (%) | number | Gross Margin | "80" | Yes |

### Advanced Inputs

| Field | Type | Label | Placeholder | Required |
|---|---|---|---|---|
| CAC by Tier | table | Pricing Tiers | — | No |
| Expansion Revenue ($/mo) | number | Expansion MRR | "10" | No |
| Support Cost per Customer ($) | number | Monthly Support Cost | "5" | No |
| Monthly Churn (%) | number | Churn Rate | "2" | No |
| Revenue Growth (%) | number | Expected Growth | "5" | No |
| Currency | select | Currency | "$" | No |

---

## Outputs

### Primary Result
- **CAC Payback Period** — months to recover CAC
- Health badge: Excellent (< 9mo), Good (9-12mo), Fair (12-18mo), Poor (> 18mo)

### Secondary Metrics
- Payback Revenue — total revenue needed to recover CAC
- Monthly Gross Profit per Customer
- Months to Break-even (considering CAC as upfront investment)

### Advanced Outputs
- Payback by pricing tier table
- Scenario comparison (pessimistic/default/optimistic)
- Impact of 10% price increase on payback
- Impact of 10% churn increase on payback

---

## Calculations

```
Monthly Gross Profit = ARPU × (Gross Margin / 100)
CAC Payback Period = CAC ÷ Monthly Gross Profit
```

---

## UI Behavior

- Real-time calculation on input change
- Mode toggle between Simple/Advanced
- Share link support with URL params
- Copy results button

---

## Edge Cases

| Condition | Behavior |
|---|---|
| ARPU = 0 | Show "Infinite" payback, disable |
| Gross Margin = 0 | Show "Cannot calculate" |
| CAC = 0 | Show "No acquisition cost" |

---

## Share Link Params

```
?cac=500&arpu=99&margin=80&expansion=10&support=5&churn=2&growth=5&curr=USD&mode=simple
```
