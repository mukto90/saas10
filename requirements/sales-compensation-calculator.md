# Sales Compensation Calculator
**Path:** /sales-compensation-calculator/index.php

---

## Purpose

A calculator for SaaS founders and sales leaders to design and model sales compensation plans. Calculate On-Target Earnings (OTE), base salary, commission structures, and quota targets. Model different compensation philosophies and see the impact on team economics.

---

## How It Works

1. User enters compensation philosophy and targets
2. Calculator computes full compensation structure
3. Advanced mode allows multi-tier plans and scenario modeling

---

## Inputs

### Simple Mode

| Field | Type | Label | Placeholder | Required |
|---|---|---|---|---|
| Target OTE ($) | number | On-Target Earnings | "120000" | Yes |
| Commission Rate (%) | number | Commission Rate | "10" | Yes |
| Annual Quota ($) | number | Annual Quota | "600000" | Yes |
| Base/OTE Split (%) | number | Base Salary % | "50" | Yes |

### Advanced Inputs

| Field | Type | Label | Options | Required |
|---|---|---|---|---|
| Comp Model | select | Fixed, Tiered, Draw | — | No |
| Tiers | table | Tier, Quota Range, Accelerator | — | No |
| Commission Type | select | Revenue, Margin, New Logo | — | No |
| Annual vs Monthly | select | Annual, Quarterly | — | No |
| Currency | select | Currency Symbol | — | No |
| Multiple Reps | number | Number of Reps | — | No |

---

## Outputs

### Primary Metrics

| Metric | Definition |
|---|---|
| **Base Salary** | OTE × (Base % / 100) |
| **Target Commission** | OTE − Base Salary |
| **Quota Attainment Target** | Deal value needed to hit commission |
| **Commission per $ Revenue** | Commission ÷ Quota |

### Secondary Metrics
- Monthly Quota — annual quota ÷ 12
- Monthly Target Commission
- Total Comp at 100%, 120%, 150% attainment
- Cost of Sales — base + commission as % of revenue

### Advanced Outputs
- Tier breakdown table (if tiered comp)
- Accelerator impact — what happens at 100%+, 150%+
- Draw impact (if draw model) — draw vs earned commission
- Total compensation budget for team
- Attainment scenarios — revenue needed for 80%, 100%, 120%, 150%

---

## Calculations

```
Base Salary = OTE × (Base % / 100)
Target Commission = OTE − Base Salary
Annual Quota = Target Revenue
Commission Rate = Target Commission ÷ Quota × 100
Monthly Quota = Annual Quota ÷ 12
```

---

## Compensation Models

### Fixed
- Flat commission rate on all revenue
- Simple, predictable

### Tiered
- accelerators at quota attainment
- Example: 0-100% = 10%, 100-120% = 15%, 120%+ = 20%

### Draw
- Guaranteed draw against future commission
- Recoverable or non-recoverable

---

## UI Behavior

- Real-time calculation on input change
- Mode toggle between Simple/Advanced
- Tier builder (add/remove tiers)
- Share link with URL params
- Copy results

---

## Health Indicators

| Cost of Sales | Label | Color |
|---|---|---|
| < 40% | Efficient | #c8f060 |
| 40-60% | Standard | #a0d060 |
| 60-80% | High | #f0c060 |
| > 80% | Unsustainable | #f05050 |

---

## Edge Cases

| Condition | Behavior |
|---|---|
| Quota = 0 | Show "Enter quota" |
| OTE = 0 | Show "Enter OTE" |
| Commission Rate = 0 | Show "No commission" |

---

## Share Link Params

```
?ote=120000&commission=10&quota=600000&baseSplit=50&model=fixed&type=revenue&period=annual&reps=5&curr=USD&mode=simple
```
