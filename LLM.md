# saas10.xyz — Development Prompt

## Project Overview
Build a PHP-based microsaas platform at saas10.xyz. The site hosts a collection of free tools for SaaS founders, marketers, and operators. Each tool lives at its own path: saas10.xyz/roi-calculator, saas10.xyz/mrr-calculator, etc.

---

## Tech Stack
- PHP (no framework)
- Vanilla HTML/CSS/JS
- No database required
- cURL for external API calls
- PHP mail() for email sending

---

## File Structure
/
├── header.php
├── footer.php
├── index.php
├── signup.php
├── submit-idea.php
├── requirements/
│   ├── roi-calculator.md
│   ├── mrr-calculator.md
│   └── churn-calculator.md
└── tools/
    ├── roi-calculator/
    │   ├── index.php
    │   ├── style.css
    │   └── script.js
    ├── mrr-calculator/
    │   └── index.php
    └── churn-calculator/
        └── index.php

---

## Design System
All design decisions are already finalized. Follow them strictly.

**Colors**
- Background: #0a0a0a
- Surface: #111111
- Surface2: #161616
- Border: rgba(255,255,255,0.08)
- Border hover: rgba(255,255,255,0.18)
- Text: #f0ede8
- Muted: #888580
- Accent (green): #c8f060
- Accent2 (blue): #60d4f0

**Typography**
- Headings/UI: Syne (Google Fonts) — weights 400, 700, 800
- Monospace/labels: DM Mono (Google Fonts) — weights 400, 500

**Container**
- Max-width: 1320px, centered, 2rem horizontal padding
- CSS var: --container: 1320px

**CSS variables** defined in header.php and available globally.

---

## header.php (already built — do not recreate)
Contains:
- DOCTYPE, <html>, <head>, all global CSS variables and shared styles
- Sticky nav with logo, nav links, "Submit an Idea" CTA button
- PHP: reads $page_title and $page_desc variables if set before include
- Popup base styles (overlay, box, form-group, form-msg, form-row)
- Opens <body> — does NOT close it

Usage in any page:
```php
<?php
$page_title = 'ROI Calculator';
$page_desc  = 'Estimate ROI for any SaaS tool or spend.';
include '../header.php';
?>
```

---

## footer.php (already built — do not recreate)
Contains:
- Newsletter signup form (name + email, side-by-side layout)
- Submit an Idea popup (title, description, name, email fields)
- Exit intent popup (fires on mouseleave top-of-browser, 7-day cookie on dismiss)
- All JS: submitNewsletter(), submitExitNewsletter(), submitIdea(), openIdeaPopup(), closeIdeaPopup(), cookie helpers
- Closes </body> and </html>

---

## signup.php (already built — do not recreate)
- Accepts POST: name, email
- Validates inputs
- Sends to FluentCRM via cURL:
  - Endpoint: POST https://my.pluggable.io/?fluentcrm=1&route=contact&hash=92e66413-1e6f-433b-9ea0-634a80e6e821
  - Fields: full_name, email
- Returns JSON: { success: true|false, message: string }

---

## submit-idea.php (already built — do not recreate)
- Accepts POST JSON: title, description, name, email
- Sends HTML email to n.mukto@gmail.com
- Reply-To set to submitter's email
- Returns JSON: { success: true|false, message: string }

---

## index.php (already built — do not recreate)
Homepage with:
- Hero section: "Sustain your SaaS growth"
- Stats bar: 12+ tools, 100% no login, $0 forever free, 10x output
- Tools grid (card-based, 3-column auto-fill)
- Each card: badge (NEW/SOON), icon, name, description, URL slug
- Links to tool pages

---

## Your Task: Build the Tool Pages

Build each of the following tool pages by implementing the requirements in their respective files under the `requirements` folder

Each tool page must:
1. Include header.php and footer.php
2. Set $page_title and $page_desc before including header
3. Use the same design system (colors, fonts, spacing)
4. Have a page-specific CSS file in the tool folder (link via `<link rel="stylesheet">`)
5. Have a page-specific JS file in the tool folder (link via `<script src>`)
6. Be fully functional with no placeholders or TODOs
7. All calculations happen client-side in JS — no form submissions
8. Results update in real-time as user changes inputs (use input event, not change)
9. All input fields use range sliders OR number inputs — never plain text for numeric values
10. Show a clear results panel that updates live
11. Include a "Back to all tools" link: <a href="/">← All tools</a>

---

## UI Pattern for Tool Pages

[Back link]

[Page header]
  - section-tag (monospace, accent2 color): // tool name
  - h1: Tool Name
  - subtitle: one-line description

[Two-column layout at 1320px container]
  Left (inputs panel):
    - Surface card (bg: var(--surface), border, border-radius: 14px, padding: 2rem)
    - Section label: "YOUR INPUTS" in monospace
    - Form fields with labels

  Right (results panel):
    - Dark card (bg: var(--bg), border: 1px solid var(--border))
    - Section label: "RESULTS" in monospace
    - Metric cards for each result
    - Each metric: muted label (13px, monospace), large value (2rem, font-weight 800)
    - Accent color on primary result number

[Below: brief explanation of how the formula works]

---

## Coding Rules
- Use jQuery
- No placeholder content — every element must be real and functional
- No console.log left in production code
- Input validation: never show NaN, Infinity, or broken values — default to 0
- Format all currency with toLocaleString('en-US', { style: 'currency', currency: 'USD' })
- Format all percentages with toFixed(1) + '%'
- CSS: use CSS variables everywhere, never hardcode colors
- Each tool page is self-contained — its styles in a separate CSS file in the tool folder
- Dark mode is the only mode — no light mode toggle needed
- Mobile responsive: single column below 768px