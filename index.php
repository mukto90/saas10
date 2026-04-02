<?php
$page_title = 'Sustain Your SaaS Growth';
$page_desc = 'Free micro-tools for SaaS founders, marketers, and operators. No login. No fluff. Just tools that work.';
include 'header.php';
?>

<style>
  /* HERO */
  .hero {
    padding: 6rem 0 5rem;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .hero::before {
    content: '';
    position: absolute;
    top: 0; left: 50%;
    transform: translateX(-50%);
    width: 700px; height: 450px;
    background: radial-gradient(ellipse, rgba(200,240,96,0.07) 0%, transparent 70%);
    pointer-events: none;
  }
  .hero-eyebrow {
    font-family: var(--mono);
    font-size: 0.78rem;
    color: var(--accent);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 1.5rem;
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }
  .hero-eyebrow::before, .hero-eyebrow::after {
    content: '';
    display: block;
    width: 28px;
    height: 1px;
    background: var(--accent);
    opacity: 0.45;
  }
  h1 {
    font-size: clamp(2.8rem, 7vw, 5.2rem);
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 1.04;
    margin-bottom: 1.5rem;
  }
  h1 em { font-style: normal; color: var(--accent); }
  .hero-sub {
    font-size: 1.15rem;
    color: var(--muted);
    max-width: 540px;
    margin: 0 auto 2.5rem;
    line-height: 1.75;
    font-weight: 400;
  }
  .hero-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  .hero > * { animation: fadeUp 0.5s ease both; }
  .hero-eyebrow { animation-delay: 0.05s; }
  h1 { animation-delay: 0.12s; }
  .hero-sub { animation-delay: 0.2s; }
  .hero-actions { animation-delay: 0.28s; }

  /* STATS */
  .stats-bar {
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    background: var(--surface);
  }
  .stats-inner {
    max-width: var(--container);
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: center;
  }
  .stat {
    padding: 1.75rem 3.5rem;
    text-align: center;
    border-right: 1px solid var(--border);
    flex: 1;
    max-width: 220px;
  }
  .stat:last-child { border-right: none; }
  .stat-num {
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: -0.03em;
  }
  .stat-num span { color: var(--accent); }
  .stat-label {
    font-size: 0.75rem;
    color: var(--muted);
    font-family: var(--mono);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-top: 5px;
  }

  /* TOOLS SECTION */
  .tools-section {
    padding: 5rem 0;
  }
  .section-header {
    margin-bottom: 2.5rem;
  }
  .section-title {
    font-size: 2.2rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    margin-top: 0.4rem;
  }
  .tools-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1px;
    background: var(--border);
    border: 1px solid var(--border);
    border-radius: 14px;
    overflow: hidden;
  }
  .tool-card {
    background: var(--bg);
    padding: 2rem;
    transition: background 0.2s;
    cursor: pointer;
    position: relative;
    text-decoration: none;
    color: inherit;
    display: block;
  }
  .tool-card:hover { background: var(--surface2); }
  .tool-card:hover .tool-arrow { opacity: 1; transform: translate(2px, -2px); }
  .tool-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    margin-bottom: 1.1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .tool-icon.green { background: rgba(200,240,96,0.12); }
  .tool-icon.blue  { background: rgba(96,212,240,0.12); }
  .tool-icon.purple{ background: rgba(160,130,240,0.12); }
  .tool-icon.orange{ background: rgba(240,160,80,0.12); }
  .tool-badge {
    display: inline-block;
    font-family: var(--mono);
    font-size: 10px;
    padding: 2px 9px;
    border-radius: 20px;
    letter-spacing: 0.06em;
    margin-bottom: 0.8rem;
    font-weight: 500;
  }
  .badge-new  { background: rgba(200,240,96,0.12); color: var(--accent); border: 1px solid rgba(200,240,96,0.2); }
  .badge-soon { background: rgba(136,133,128,0.1); color: var(--muted); border: 1px solid rgba(136,133,128,0.2); }
  .tool-name {
    font-size: 1.1rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    margin-bottom: 0.5rem;
  }
  .tool-desc {
    font-size: 0.95rem;
    color: var(--muted);
    line-height: 1.65;
    font-weight: 400;
  }
  .tool-url {
    font-family: var(--mono);
    font-size: 0.74rem;
    color: rgba(200,240,96,0.35);
    margin-top: 1.1rem;
    letter-spacing: 0.02em;
  }
  .tool-arrow {
    position: absolute;
    top: 2rem; right: 2rem;
    opacity: 0;
    transition: opacity 0.2s, transform 0.2s;
    color: var(--muted);
    font-size: 1rem;
  }
</style>

<div class="wrap">
  <section class="hero">
    <div class="hero-eyebrow">Free SaaS tools</div>
    <h1>Sustain your<br><em>SaaS growth</em></h1>
    <p class="hero-sub">A growing suite of free micro-tools for SaaS founders, marketers, and operators. No login. No fluff. Just tools that work.</p>
    <div class="hero-actions">
      <a href="#tools" class="btn-primary">Browse All Tools</a>
      <a href="#" onclick="openIdeaPopup(); return false;" class="btn-ghost">Submit a tool idea</a>
    </div>
  </section>
</div>

<div class="stats-bar">
  <div class="stats-inner">
    <div class="stat">
      <div class="stat-num">6<span>+</span></div>
      <div class="stat-label">Free Tools</div>
    </div>
    <div class="stat">
      <div class="stat-num">100<span>%</span></div>
      <div class="stat-label">No login</div>
    </div>
    <div class="stat">
      <div class="stat-num">0.0<span>$</span></div>
      <div class="stat-label">Forever free</div>
    </div>
    <div class="stat">
      <div class="stat-num">10<span>x</span></div>
      <div class="stat-label">Your output</div>
    </div>
  </div>
</div>

<section class="tools-section" id="tools">
  <div class="wrap">
    <div class="section-header">
      <div class="section-tag">// tools</div>
      <h2 class="section-title">Pick a tool. Get moving.</h2>
    </div>
    <div class="tools-grid">

      <a href="/tools/roi-calculator" class="tool-card">
        <span class="tool-badge badge-new">NEW</span>
        <div class="tool-icon green">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M2 12L6 7L9 10L12 5L14 8" stroke="#c8f060" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <div class="tool-name">ROI Calculator</div>
        <div class="tool-desc">Estimate return on investment for any SaaS tool or campaign spend in seconds.</div>
        <div class="tool-url">/tools/roi-calculator</div>
        <span class="tool-arrow">↗</span>
      </a>

      <a href="/tools/mrr-arr-calculator" class="tool-card">
        <span class="tool-badge badge-new">NEW</span>
        <div class="tool-icon green">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="5" height="5" rx="1" stroke="#c8f060" stroke-width="1.5"/><rect x="9" y="2" width="5" height="5" rx="1" stroke="#c8f060" stroke-width="1.5"/><rect x="2" y="9" width="5" height="5" rx="1" stroke="#c8f060" stroke-width="1.5"/><rect x="9" y="9" width="5" height="5" rx="1" stroke="#c8f060" stroke-width="1.5"/></svg>
        </div>
        <div class="tool-name">MRR / ARR Calculator</div>
        <div class="tool-desc">Calculate monthly and annual recurring revenue across all your pricing tiers.</div>
        <div class="tool-url">/tools/mrr-arr-calculator</div>
        <span class="tool-arrow">↗</span>
      </a>

      <a href="/tools/churn-rate-calculator" class="tool-card">
        <span class="tool-badge badge-new">NEW</span>
        <div class="tool-icon blue">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="5.5" stroke="#60d4f0" stroke-width="1.5"/><path d="M8 5v3l2 2" stroke="#60d4f0" stroke-width="1.5" stroke-linecap="round"/></svg>
        </div>
        <div class="tool-name">Churn Rate Calculator</div>
        <div class="tool-desc">Know exactly how much revenue and how many customers you're losing each month.</div>
        <div class="tool-url">/tools/churn-rate-calculator</div>
        <span class="tool-arrow">↗</span>
      </a>

      <a href="/tools/ltv-cac-ratio-calculator" class="tool-card">
        <span class="tool-badge badge-new">NEW</span>
        <div class="tool-icon blue">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M3 13V6M7 13V3M11 13V8M15 13V11" stroke="#60d4f0" stroke-width="1.5" stroke-linecap="round"/></svg>
        </div>
        <div class="tool-name">LTV:CAC Ratio Calculator</div>
        <div class="tool-desc">Find out if your customer acquisition cost is sustainable enough for the long run.</div>
        <div class="tool-url">/tools/ltv-cac-ratio-calculator</div>
        <span class="tool-arrow">↗</span>
      </a>

      <a href="#" class="tool-card">
        <span class="tool-badge badge-soon">SOON</span>
        <div class="tool-icon purple">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M4 8h8M6 12h4" stroke="#a082f0" stroke-width="1.5" stroke-linecap="round"/></svg>
        </div>
        <div class="tool-name">Cold Email Generator</div>
        <div class="tool-desc">AI-written cold emails for SaaS outreach. Personalized and actually worth reading.</div>
        <div class="tool-url">saas10.xyz</div>
        <span class="tool-arrow">↗</span>
      </a>

      <a href="#" class="tool-card">
        <span class="tool-badge badge-soon">SOON</span>
        <div class="tool-icon orange">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="5.5" stroke="#f0a050" stroke-width="1.5"/><path d="M8 5v3" stroke="#f0a050" stroke-width="1.5" stroke-linecap="round"/><circle cx="8" cy="11" r="0.75" fill="#f0a050"/></svg>
        </div>
        <div class="tool-name">SaaS Idea Validator</div>
        <div class="tool-desc">Score your SaaS idea against market demand, competition, and monetization signals.</div>
        <div class="tool-url">saas10.xyz</div>
        <span class="tool-arrow">↗</span>
      </a>

    </div>
  </div>
</section>

<?php include 'footer.php'; ?>
