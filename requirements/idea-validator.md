# SaaS Idea Validator
**Path:** /idea-validator/index.php

---

## Purpose

An AI-powered SaaS idea scoring tool for founders and makers to pressure-test a
business idea before investing time and money. Not a cheerleader — gives honest,
structured feedback across the dimensions that actually determine whether a SaaS
idea can become a viable business. Uses Claude AI to analyze the idea and score it
across market, product, competition, monetization, and founder-fit dimensions.

---

## How It Works

1. User describes their SaaS idea and fills in key context fields
2. Clicks "Validate Idea"
3. Calls Claude API (claude-sonnet-4-6) with a structured scoring system prompt
4. Returns a JSON score across 8 dimensions with explanations and an overall verdict
5. User sees scored report with actionable next steps

---

## Inputs

### Idea Description

| Field | Type | Label | Placeholder | Required |
|---|---|---|---|---|
| Idea name | text | Idea Name | "CustomerPulse" | Yes |
| One-line description | text (max 140 chars) | Describe your idea in one sentence | "A tool that automatically detects at-risk customers using product usage data." | Yes |
| Problem being solved | textarea (3 rows) | What problem does it solve? | "SaaS teams don't know a customer is about to churn until it's too late." | Yes |
| Target customer | text | Who is the target customer? | "SaaS companies with 100–1000 customers" | Yes |
| How it works | textarea (3 rows) | How does it work? (solution) | "Integrates with your product analytics, scores customers daily, and alerts the CS team." | No |

### Market Context

| Field | Type | Label | Options | Required |
|---|---|---|---|---|
| Target industry | text | Target Industry | — | No |
| Estimated market size | select | Estimated Market Size | Niche (< $100M), Small ($100M–$1B), Mid ($1B–$10B), Large (> $10B), I don't know | No |
| Direct competitors | text | Known Competitors (comma separated) | "Gainsight, ChurnZero, Totango" | No |
| Price point in mind | select | Expected Pricing | Free, Freemium, < $50/mo, $50–$200/mo, $200–$500/mo, $500+/mo, Usage-based | No |
| Stage | select | Your Stage | Just an idea, Validated with interviews, Have waitlist, Prototype built, Paying customers | No |

### Founder Context (optional but improves scoring)

| Field | Type | Label | Placeholder |
|---|---|---|---|
| Your relevant experience | textarea (2 rows) | Your relevant background | "5 years in customer success at B2B SaaS companies." |
| Do you have domain expertise? | toggle | Domain Expert | Yes / No |
| Do you have access to target customers? | toggle | Customer Access | Yes / No |

---

## AI System Prompt (sent to Claude API)

```
You are a brutally honest SaaS business analyst and investor. Your job is to evaluate
SaaS ideas with the same rigor a top-tier VC would — but also with the practicality
of a founder who has built multiple businesses.

You are not here to encourage. You are here to be accurate.

Score the idea across these 8 dimensions, each on a scale of 1–10:

1. Problem Clarity — Is the problem real, specific, and painful?
2. Market Size — Is the addressable market large enough to build a venture on?
3. Solution Differentiation — Is the solution meaningfully different from existing options?
4. Competitive Landscape — How crowded is the space? Is there room to win?
5. Monetization Potential — Can this generate significant, recurring revenue?
6. Technical Feasibility — How hard is this to build? Is complexity justified?
7. Go-To-Market Clarity — Is there an obvious, realistic path to first customers?
8. Founder-Market Fit — Based on the context provided, does this founder have an edge?

For each dimension:
- Give a score 1–10
- Write 2–3 sentences of honest analysis
- Give one specific, actionable recommendation

Then provide:
- Overall score: weighted average (Problem and Market weighted 1.5x, others 1x)
- Verdict: one of: "Strong Idea", "Promising but needs work", "Risky — validate first", "Pivot recommended"
- Biggest risk: one paragraph on the single biggest threat to this idea
- Best next step: one specific, concrete action the founder should take in the next 7 days
- Comparable companies: 2–3 real companies that have succeeded (or failed) in adjacent spaces

Return ONLY a valid JSON object with this exact structure, no preamble, no markdown:
{
  "scores": {
    "problem_clarity": { "score": int, "analysis": "string", "recommendation": "string" },
    "market_size": { "score": int, "analysis": "string", "recommendation": "string" },
    "differentiation": { "score": int, "analysis": "string", "recommendation": "string" },
    "competition": { "score": int, "analysis": "string", "recommendation": "string" },
    "monetization": { "score": int, "analysis": "string", "recommendation": "string" },
    "feasibility": { "score": int, "analysis": "string", "recommendation": "string" },
    "go_to_market": { "score": int, "analysis": "string", "recommendation": "string" },
    "founder_fit": { "score": int, "analysis": "string", "recommendation": "string" }
  },
  "overall_score": float,
  "verdict": "string",
  "biggest_risk": "string",
  "best_next_step": "string",
  "comparable_companies": [
    { "name": "string", "outcome": "string", "relevance": "string" }
  ]
}
```

---

## Outputs

### Overall Score Card (top of results)

- Large overall score displayed prominently (e.g. "7.2 / 10")
- Verdict badge with color
- Biggest risk in a highlighted warning card
- Best next step in an accent card

### Score Grid

8 dimension cards in a 2×4 or 4×2 grid. Each card:
- Dimension name
- Score with color-coded bar (1–10)
- Analysis text (2–3 sentences)
- Recommendation (collapsed by default, expand on click)

### Comparable Companies Block

3 company cards showing name, outcome (succeeded/failed/pivoted), and relevance
to the idea.

---

## Verdict Badge Colors

| Verdict | Color |
|---|---|
| Strong Idea | #c8f060 |
| Promising but needs work | #a0d060 |
| Risky — validate first | #f0a040 |
| Pivot recommended | #f05050 |

---

## Score Bar Colors (per dimension)

| Score | Color |
|---|---|
| 8–10 | #c8f060 |
| 6–7 | #a0d060 |
| 4–5 | #f0c060 |
| 2–3 | #f0a040 |
| 1 | #f05050 |

---

## UI Behavior

- "Validate Idea" button triggers API call
- During generation: button shows "Analyzing..." with a subtle animation, disabled
- Estimated wait time shown: "This takes about 10–15 seconds."
- On success: results animate in section by section (overall score first, then grid)
- On error: show error message with retry button
- "Re-validate" button reruns with same inputs for a second opinion
- Results are read-only — no inline editing (unlike cold email generator)

---

## Edge Cases

| Condition | Behavior |
|---|---|
| Idea name or description empty | Disable button, show inline validation |
| Problem field empty | Disable button |
| API returns malformed JSON | "Analysis failed. Please try again." |
| API timeout > 20s | Show timeout message with retry |
| Founder context fields empty | AI uses "unknown" for founder-fit — score will be middle range with note |
| Competitor field empty | AI infers competition from idea description |

---

## Validation Report Export

- "Copy report as text" button — copies full scoring report as plain text
- "Share link" — encodes idea fields (not AI output) into URL query params so the
  same idea can be re-run or shared
- On page load: read query params and pre-fill input fields if present
- AI output is never encoded in the URL — always re-run on load