# Burn Rate Calculator
**Path:** /burn-rate-calculator/index.php

---

## Purpose

A focused calculator for tracking and analyzing your monthly burn rate — the core metric that determines how long your startup survives. Simple version gives quick burn calculation; advanced version breaks down costs by category and models different scenarios.

---

## How It Works

1. User enters expenses and revenue
2. Calculator computes gross and net burn
3. Advanced mode shows detailed cost breakdown with hiring scenarios

---

## Inputs

### Simple Mode

| Field | Type | Label | Placeholder | Required |
|---|---|---|---|---|
| Monthly Expenses ($) | number | Total Monthly Expenses | "50000" | Yes |
| Monthly Revenue ($) | number | Monthly Revenue | "15000" | Yes |
| Cash in Bank ($) | number | Cash Reserves | "300000" | Yes |

### Advanced Inputs

| Field | Type | Label | Required |
|---|---|---|---|
| Cost Breakdown | table | Salaries, Infrastructure, Marketing, Tools, Office, Other | No |
| Planned Hires | table | Role, Monthly Cost, Start Month | No |
| Revenue Projection | number | Expected Monthly Growth % | No |
| One-time Costs | table | Equipment, Legal, Marketing Campaign | No |
| Currency | select | Currency Symbol | No |

---

## Outputs

### Primary Metrics

| Metric | Definition | Health Badge |
|---|---|---|
| **Gross Burn** | Total monthly expenses | — |
| **Net Burn** | Expenses − Revenue | Positive = burning, Negative = profitable |
| **Runway** | Cash ÷ Net Burn (months) | > 18mo Safe, 12-18mo Caution, < 12mo Urgent |

### Secondary Metrics
- Cash at Break-even — months until profitable
- Monthly Burn per Employee
- Burn Multiple — how many months of current burn you have in cash

### Advanced Outputs
- Cost breakdown pie/bar chart
- Cost per category as % of total
- Scenario: pessimistic (higher burn), default, optimistic (lower burn)
- Headcount cost as % of burn
- Fundraising recommendation based on runway

---

## Calculations

```
Gross Burn = Total Monthly Expenses
Net Burn = Gross Burn − Monthly Revenue
Runway = Cash in Bank ÷ Net Burn
Burn Multiple = Cash in Bank ÷ Annual Burn
```

---

## UI Behavior

- Real-time calculation on input change
- Mode toggle between Simple/Advanced
- Add/remove cost categories in advanced mode
- Add/remove planned hires
- Share link with URL params
- Copy results

---

## Health Badge Colors

| Runway | Label | Color |
|---|---|---|
| > 24 months | Profitable | #c8f060 |
| 18-24 months | Safe | #a0d060 |
| 12-18 months | Plan ahead | #f0c060 |
| 6-12 months | Urgent | #f0a040 |
| < 6 months | Critical | #f05050 |

---

## Edge Cases

| Condition | Behavior |
|---|---|
| Revenue > Expenses | Show "Cash flow positive" with negative burn |
| Net Burn = 0 | Show "Break-even" runway |
| Cash = 0 | Show "0 months runway" |

---

## Share Link Params

```
?expenses=50000&revenue=15000&cash=300000&salaries=30000&infra=3000&marketing=5000&tools=2000&office=2000&other=3000&growth=5&curr=USD&mode=simple
```
