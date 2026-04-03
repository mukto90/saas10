# Net Revenue Retention (NRR) Calculator
**Path:** /nrr-calculator/index.php

---

## Purpose

Calculate Net Revenue Retention (NRR) — the SaaS metric that matters most for valuation. NRR shows how much recurring revenue you retain from existing customers, including expansion, contraction, and churn. Investors obsess over this metric.

---

## How It Works

1. User enters cohort data for a time period (month/quarter)
2. Calculator computes NRR, GRR, and supporting metrics
3. Advanced mode allows multi-period analysis with growth modeling

---

## Inputs

### Simple Mode

| Field | Type | Label | Placeholder | Required |
|---|---|---|---|---|
| Starting MRR ($) | number | Starting MRR | "100000" | Yes |
| Expansion MRR ($) | number | Expansion Revenue | "15000" | Yes |
| Contraction MRR ($) | number | Contraction/Churn | "5000" | Yes |
| Churned MRR ($) | number | Churned Revenue | "8000" | Yes |

### Advanced Inputs

| Field | Type | Label | Options | Required |
|---|---|---|---|---|
| Time Period | select | Period | Monthly, Quarterly | No |
| Currency | select | Currency | $, €, £, etc. | No |
| Multiple Cohorts | toggle | Analyze multiple periods | On/Off | No |
| Cohort Data | table | Past 12 periods | — | No |

---

## Outputs

### Primary Metrics

| Metric | Definition | Health Badge |
|---|---|---|
| **NRR** | (Starting + Expansion − Contraction − Churn) ÷ Starting × 100 | > 120% Excellent, 100-120% Good, < 100% Poor |
| **GRR** | (Starting + Expansion − Contraction) ÷ Starting × 100 | > 110% Excellent, 95-110% Good, < 95% Poor |
| **Dollar Retention** | Net dollar change in MRR | +$ = Growing, −$ = Shrinking |

### Secondary Metrics
- Net New MRR — dollar change
- Expansion Rate — expansion ÷ starting
- Contraction Rate — contraction ÷ starting  
- Churn Rate — churn ÷ starting
- Net Retention Rate by cohort (advanced)

### Advanced Outputs
- 12-month NRR trend line chart
- Cohort comparison table
- Forward-looking NRR projection (with growth assumptions)
- Impact of 5% more expansion on NRR
- Impact of 5% less churn on NRR

---

## Calculations

```
NRR = ((Starting MRR + Expansion MRR − Contraction MRR − Churned MRR) ÷ Starting MRR) × 100
GRR = ((Starting MRR + Expansion MRR − Contraction MRR) ÷ Starting MRR) × 100
Expansion Rate = Expansion MRR ÷ Starting MRR × 100
Contraction Rate = Contraction MRR ÷ Starting MRR × 100
Churn Rate = Churned MRR ÷ Starting MRR × 100
```

---

## UI Behavior

- Real-time calculation on input change
- Mode toggle between Simple/Advanced
- Cohort period selector (monthly/quarterly)
- Share link with URL params
- Copy results

---

## Edge Cases

| Condition | Behavior |
|---|---|
| Starting MRR = 0 | Show "Enter starting MRR" |
| All expansions/contractions = 0 | NRR = 100% |
| Contraction + Churn > Starting | Show negative NRR with warning |

---

## Health Badge Colors

| NRR Range | Label | Color |
|---|---|---|
| > 120% | Excellent | #c8f060 |
| 110-120% | Healthy | #a0d060 |
| 100-110% | Fair | #f0c060 |
| < 100% | Poor | #f05050 |

---

## Share Link Params

```
?start=100000&expansion=15000&contraction=5000&churn=8000&period=monthly&curr=USD&mode=simple
```
