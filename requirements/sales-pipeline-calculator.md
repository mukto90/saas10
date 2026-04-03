# Sales Pipeline Calculator
**Path:** /sales-pipeline-calculator/index.php

---

## Purpose

Calculate the sales pipeline needed to hit your revenue targets. This tool helps sales leaders and founders answer: "How much pipeline do we need to generate to hit our ARR goal?" Uses standard SaaS pipeline stages and conversion rates.

---

## How It Works

1. User enters revenue target and sales metrics
2. Calculator works backward from target to required pipeline
3. Advanced mode allows customization of stages and conversion rates

---

## Inputs

### Simple Mode

| Field | Type | Label | Placeholder | Required |
|---|---|---|---|---|
| Annual Revenue Target ($) | number | ARR Target | "1000000" | Yes |
| Average Deal Size ($) | number | Average Contract Value | "24000" | Yes |
| Win Rate (%) | number | Close Rate | "25" | Yes |
| Sales Cycle (months) | number | Sales Cycle | "3" | Yes |

### Advanced Inputs

| Field | Type | Label | Options | Required |
|---|---|---|---|---|
| Pipeline Stages | table | Lead → MQL → SQL → Oppty → Close | Custom | No |
| Conversion Rates | table | Per-stage conversion | Custom % | No |
| Reps | number | Number of Reps | — | No |
| Quota per Rep ($) | number | Quota per Rep | "200000" | No |
| Lead Source | select | Inbound, Outbound, Partner | — | No |
| Currency | select | Currency Symbol | — | No |
| Time Period | select | Annual, Quarterly, Monthly | — | No |

---

## Outputs

### Primary Metrics

| Metric | Definition |
|---|---|
| **Required Pipeline** | Revenue Target ÷ (Win Rate / 100) |
| **Pipeline Coverage** | Available Pipeline ÷ Required Pipeline (target: 3-4x) |
| **Deals Needed** | Revenue Target ÷ Average Deal Size |

### Secondary Metrics
- Leads Needed — based on lead-to-close conversion
- MQLs Needed — based on MQL-to-close
- SQLs Needed — based on SQL-to-close
- Opportunities Needed — based on opportunity-to-close
- Pipeline per Rep — required pipeline ÷ number of reps

### Advanced Outputs
- Pipeline by stage breakdown table
- Funnel visualization
- Coverage by rep (if multiple reps)
- Time-to-pipeline (how quickly pipeline must be created)
- Bottleneck analysis — which stage is limiting

---

## Calculations

```
Required Pipeline = Revenue Target ÷ (Win Rate / 100)
Leads Needed = Required Pipeline ÷ (Average Deal Size × Lead-to-Close %)
MQLs Needed = Required Pipeline ÷ (Average Deal Size × MQL-to-Close %)
Pipeline Coverage = Available Pipeline ÷ Required Pipeline
```

---

## Default Pipeline Stages & Conversion

| Stage | Conversion to Next |
|---|---|
| Lead → MQL | 20% |
| MQL → SQL | 25% |
| SQL → Opportunity | 40% |
| Opportunity → Close | 25% |

Overall Lead-to-Close: 0.5% (20% × 25% × 40% × 25%)

---

## UI Behavior

- Real-time calculation on input change
- Mode toggle between Simple/Advanced
- Stage customization (add/remove/reorder)
- Share link with URL params
- Copy results

---

## Health Badge Colors

| Coverage | Label | Color |
|---|---|---|
| 4x+ | Strong | #c8f060 |
| 3-4x | Healthy | #a0d060 |
| 2-3x | Undercoverage | #f0c060 |
| < 2x | Critical gap | #f05050 |

---

## Edge Cases

| Condition | Behavior |
|---|---|
| Win Rate = 0 | Show "Enter win rate" |
| Deal Size = 0 | Show "Enter deal size" |
| Revenue Target = 0 | Show "Enter revenue target" |

---

## Share Link Params

```
?target=1000000&dealsize=24000&winrate=25&cycle=3&reps=5&quota=200000&period=annual&curr=USD&mode=simple
```
