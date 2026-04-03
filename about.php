<?php
$page_title = 'About';
$page_desc = 'Learn about SaaS10 — free micro-tools for SaaS founders, marketers, and operators.';
include 'header.php';
?>

<style>
  .about-hero {
    padding: 6rem 0 5rem;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .about-hero::before {
    content: '';
    position: absolute;
    top: 0; left: 50%;
    transform: translateX(-50%);
    width: 700px; height: 450px;
    background: radial-gradient(ellipse, rgba(200,240,96,0.07) 0%, transparent 70%);
    pointer-events: none;
  }
  .about-hero > * { animation: fadeUp 0.5s ease both; }
  h1 {
    font-size: clamp(2.5rem, 6vw, 4rem);
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 1.1;
    margin-bottom: 1.5rem;
  }
  h1 em { font-style: normal; color: var(--accent); }
  .about-sub {
    font-size: 1.15rem;
    color: var(--muted);
    max-width: 600px;
    margin: 0 auto 2.5rem;
    line-height: 1.75;
  }
  .about-hero { animation-delay: 0.05s; }

  .about-section {
    padding: 4rem 0;
    border-top: 1px solid var(--border);
  }
  .about-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }
  .about-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 2rem;
  }
  .about-card h3 {
    font-size: 1.1rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    margin-bottom: 0.75rem;
  }
  .about-card p {
    color: var(--muted);
    font-size: 0.95rem;
    line-height: 1.7;
  }

  .values-section {
    padding: 4rem 0;
    border-top: 1px solid var(--border);
  }
  .values-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
  }
  .value-item {
    padding: 1.5rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
  }
  .value-icon {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  .value-item h4 {
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  .value-item p {
    color: var(--muted);
    font-size: 0.9rem;
    line-height: 1.6;
  }

  .cta-section {
    padding: 5rem 0;
    text-align: center;
    border-top: 1px solid var(--border);
  }
  .cta-section h2 {
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    margin-bottom: 1rem;
  }
  .cta-section p {
    color: var(--muted);
    font-size: 1.05rem;
    margin-bottom: 2rem;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }
</style>

<div class="wrap">
  <section class="about-hero">
    <h1>About <em>SaaS10</em></h1>
    <p class="about-sub">We're building free micro-tools for SaaS founders, marketers, and operators. No login. No fluff. Just tools that work.</p>
  </section>
</div>

<section class="about-section">
  <div class="wrap">
    <div class="about-grid">
      <div class="about-card">
        <h3>🎯 Our Mission</h3>
        <p>We believe great tools shouldn't require a credit card or an account. Every tool on SaaS10 is free, instant, and works right in your browser.</p>
      </div>
      <div class="about-card">
        <h3>🚀 Built for Speed</h3>
        <p>No sign-ups, no onboarding, no fluff. Open a tool, use it, done. We optimize for speed and simplicity so you can focus on growing your SaaS.</p>
      </div>
      <div class="about-card">
        <h3>💡 Community-Driven</h3>
        <p>Every tool we build comes from real requests. Got an idea? Submit it. If it helps other SaaS folks, we'll build it.</p>
      </div>
    </div>
  </div>
</section>

<section class="values-section">
  <div class="wrap">
    <div class="section-tag">// what we believe</div>
    <h2 class="section-title">Built on these principles</h2>
    <div class="values-grid">
      <div class="value-item">
        <div class="value-icon">⚡</div>
        <h4>Speed First</h4>
        <p>Tools should be instant. No loading screens, no waiting.</p>
      </div>
      <div class="value-item">
        <div class="value-icon">🔓</div>
        <h4>No Lock-in</h4>
        <p>No accounts. No data capture. Your data stays yours.</p>
      </div>
      <div class="value-item">
        <div class="value-icon">🎯</div>
        <h4>Real Utility</h4>
        <p>We build tools you'd actually use daily, not gimmicks.</p>
      </div>
      <div class="value-item">
        <div class="value-icon">🤝</div>
        <h4>Open Feedback</h4>
        <p>We listen. Suggest a tool, report a bug, help us improve.</p>
      </div>
    </div>
  </div>
</section>

<section class="cta-section">
  <div class="wrap">
    <h2>Have a tool idea?</h2>
    <p>We're always looking for new tools to build. If you have a suggestion, we'd love to hear it.</p>
    <a href="#" onclick="openIdeaPopup(); return false;" class="btn-primary">Submit an Idea</a>
  </div>
</section>

<?php include 'footer.php'; ?>