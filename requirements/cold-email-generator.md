# Cold Email Generator
**Path:** /cold-email-generator/index.php

---

## Purpose

An AI-powered cold email generator for SaaS founders, sales teams, and marketers
to produce personalized, high-converting outreach emails. Not a template filler —
uses Claude AI to write contextually aware emails based on the prospect, the sender's
product, and the campaign goal. Output is ready to send or easy to tweak.

---

## How It Works

1. User fills in campaign context (product, audience, goal)
2. User fills in prospect details (company, role, pain point)
3. Clicks "Generate"
4. Calls Claude API (claude-sonnet-4-6) with a strict system prompt
5. Returns a structured JSON object with subject line, email body, and follow-up
6. User can regenerate, copy, or tweak inline

---

## Inputs

### Sender Context (filled once, persists across generations)

| Field | Type | Label | Placeholder |
|---|---|---|---|
| Product / company name | text | Your Product Name | "Acme SaaS" |
| What your product does | textarea (2 rows) | One-line product description | "We help SaaS companies reduce churn with automated health scoring." |
| Target audience | text | Target Audience | "SaaS founders with 50–500 customers" |
| Unique value proposition | textarea (2 rows) | Why you're different | "We integrate in 10 minutes and require no data team." |
| Sender name | text | Your Name | "Alex" |
| Sender role | text | Your Role | "Founder" |

### Prospect Details (filled per email)

| Field | Type | Label | Placeholder |
|---|---|---|---|
| Prospect first name | text | Prospect First Name | "Sarah" |
| Prospect company | text | Prospect Company | "Notion" |
| Prospect role | text | Prospect Role / Title | "Head of Growth" |
| Industry | text | Industry | "Productivity SaaS" |
| Personalization hook | textarea (2 rows) | Personalization Hook (optional) | "I saw your talk at SaaStr about retention struggles. / You recently raised a Series A. / Your LinkedIn post about churn." |
| Suspected pain point | text | Their Likely Pain Point | "High churn rate among free trial users" |

### Email Settings

| Field | Type | Default | Options | Label |
|---|---|---|---|---|
| Email tone | select | Professional | Professional, Conversational, Direct, Friendly, Bold | Tone |
| Email goal | select | Book a call | Book a call, Get a reply, Demo request, Trial signup, Content share, Partnership | Goal |
| Email length | select | Short | Short (50–80 words), Medium (80–120 words), Long (120–180 words) | Length |
| Include PS line | toggle | On | On / Off | Include P.S. line |
| Include follow-up email | toggle | On | On / Off | Generate follow-up email |

---

## AI System Prompt (sent to Claude API)

```
You are an expert B2B cold email copywriter. You write emails that get replies —
not emails that get deleted.

Rules:
- Never use generic openers like "I hope this finds you well" or "My name is X and I work at Y"
- Lead with value or a specific observation, not with the sender
- Be direct. Respect the reader's time.
- Never use more words than necessary
- The CTA must be one specific, low-friction ask — never multiple asks
- Do not sound like a robot or a template
- Personalization must feel researched, not forced
- The P.S. line (if requested) should add social proof or urgency — not repeat the CTA
- Match the requested tone exactly

Return ONLY a valid JSON object with this exact structure, no preamble, no markdown:
{
  "subject_line": "string",
  "subject_line_alt": "string (a second option)",
  "email_body": "string (plain text, newlines with \n)",
  "follow_up_subject": "string or null",
  "follow_up_body": "string or null",
  "ps_line": "string or null",
  "word_count": integer,
  "tone_used": "string",
  "personalization_score": integer (1-10, how personalized this email is),
  "tips": ["string", "string"] (2 specific improvement tips for this email)
}
```

---

## Outputs

### Primary Email Card

Displays:
- Subject line (with alt subject shown as secondary option)
- Email body rendered with line breaks preserved
- P.S. line (if enabled) rendered below body
- Word count badge
- Personalization score badge (1–10)
- Tone badge

### Follow-Up Email Card (if enabled)

Displayed below primary email card:
- Follow-up subject line
- Follow-up body
- Word count badge
- Note: "Send 3–5 days after initial email if no reply."

### Tips Block

Two actionable improvement tips returned by the AI, shown in a muted card below
the emails.

---

## Personalization Score Badge

| Score | Label | Color |
|---|---|---|
| 9–10 | Highly personalized | #c8f060 |
| 7–8 | Well personalized | #a0d060 |
| 5–6 | Moderately personalized | #f0c060 |
| 3–4 | Generic | #f0a040 |
| 1–2 | Templated | #f05050 |

---

## UI Behavior

- "Generate" button triggers API call
- During generation: button shows "Writing..." and is disabled
- On success: email cards animate in
- On error: show error message in red below button
- "Regenerate" button reruns the same inputs for a fresh variation
- "Copy email" button on each card copies subject + body + PS to clipboard
- "Copy subject only" button copies just the subject line
- Inline editing: email body and subject are contenteditable so user can tweak
  directly without leaving the page
- Character counter shown on contenteditable body field

---

## Edge Cases

| Condition | Behavior |
|---|---|
| Product name empty | Disable generate button — show inline validation |
| Product description empty | Disable generate button |
| Prospect name empty | Default to "there" in email — do not block generation |
| API returns malformed JSON | Show error: "Generation failed. Please try again." |
| API timeout (> 15s) | Show timeout message with retry button |
| Personalization hook empty | AI generates without hook — score will be lower |
| Follow-up toggle off | follow_up fields = null — do not render follow-up card |
| PS toggle off | ps_line = null — do not render PS |

---

## Generation History

- Last 5 generated emails stored in sessionStorage (not localStorage)
- "History" panel accessible via a toggle button
- Each history item shows: prospect name, company, timestamp, subject line
- Clicking a history item restores that email to the output cards
- History clears on page close/refresh

---

## No Shareable Link

This tool does not support shareable URLs — prospect data should not be encoded
in public URLs. Copy buttons are the only export mechanism.