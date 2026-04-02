<footer>
  <div class="footer-cta">
    <div class="wrap">
      <div class="footer-cta-inner">
        <div class="footer-cta-text">
          <div class="section-tag">// stay updated</div>
          <h2>New tool every week.</h2>
          <p>Get notified when we drop a new tool. No spam — just the link.</p>
        </div>
        <form class="newsletter-form" id="newsletterForm" onsubmit="submitNewsletter(event)">
          <div class="nl-row">
            <input type="text" id="nl_name" placeholder="Your name" required autocomplete="name">
            <input type="email" id="nl_email" placeholder="you@company.com" required autocomplete="email">
            <button type="submit" class="btn-primary" id="nlBtn">Notify me</button>
          </div>
          <div class="form-msg" id="nlMsg"></div>
        </form>
      </div>
    </div>
  </div>

  <div class="footer-bottom">
    <div class="wrap">
      <div class="footer-bottom-inner">
        <a href="/" class="footer-logo">saas<em>10</em>.xyz</a>
        <ul class="footer-links">
          <li><a href="/#tools">Tools</a></li>
          <li><a href="/about.php">About</a></li>
          <li><a href="#" onclick="openIdeaPopup(); return false;">Submit an idea</a></li>
        </ul>
        <div class="footer-right">Sustain your SaaS growth</div>
      </div>
    </div>
  </div>
</footer>

<!-- SUBMIT IDEA POPUP -->
<div class="popup-overlay" id="ideaPopup">
  <div class="popup-box">
    <button class="popup-close" onclick="closeIdeaPopup()">&#x2715;</button>
    <h3>Got a tool idea?</h3>
    <p class="popup-sub">Tell us what you need. We'll build it if it makes sense for SaaS folks.</p>
    <form id="ideaForm" onsubmit="submitIdea(event)">
      <div class="form-group">
        <label>Tool title</label>
        <input type="text" id="idea_title" placeholder="e.g. Pricing Page Analyzer" required>
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea id="idea_desc" rows="3" placeholder="What should it do? Who is it for?" required></textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Your name</label>
          <input type="text" id="idea_name" placeholder="John Doe" required>
        </div>
        <div class="form-group">
          <label>Your email</label>
          <input type="email" id="idea_email" placeholder="you@company.com" required>
        </div>
      </div>
      <button type="submit" class="btn-primary" style="width:100%; margin-top:0.5rem;" id="ideaBtn">Submit idea</button>
      <div class="form-msg" id="ideaMsg"></div>
    </form>
  </div>
</div>

<!-- EXIT INTENT POPUP -->
<div class="popup-overlay" id="exitPopup">
  <div class="popup-box" style="max-width:440px; text-align:center;">
    <button class="popup-close" onclick="closeExitPopup()">&#x2715;</button>
    <div style="font-size:2rem; margin-bottom:1rem;">⚡</div>
    <h3>Wait — don't leave empty-handed.</h3>
    <p class="popup-sub">Get a free weekly SaaS tool drop in your inbox. 200+ founders already subscribed.</p>
    <form id="exitForm" onsubmit="submitExitNewsletter(event)">
      <div class="form-group">
        <input type="text" id="exit_name" placeholder="Your name" required>
      </div>
      <div class="form-group">
        <input type="email" id="exit_email" placeholder="you@company.com" required>
      </div>
      <button type="submit" class="btn-primary" style="width:100%;" id="exitBtn">Yes, send me the tools</button>
      <div class="form-msg" id="exitMsg"></div>
      <p style="font-size:0.78rem; color:var(--muted); margin-top:0.75rem; font-family:var(--mono);">No spam. Unsubscribe anytime.</p>
    </form>
  </div>
</div>

<style>
  /* FOOTER */
  .footer-cta {
    border-top: 1px solid var(--border);
    padding: 4rem 0;
    background: var(--surface);
  }
  .footer-cta-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 3rem;
    flex-wrap: wrap;
  }
  .footer-cta-text { flex: 1; min-width: 260px; }
  .footer-cta-text h2 {
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    margin-bottom: 0.5rem;
  }
  .footer-cta-text p { color: var(--muted); font-size: 0.95rem; line-height: 1.6; }
  .section-tag {
    font-family: var(--mono);
    font-size: 0.75rem;
    color: var(--accent2);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 0.6rem;
  }
  .newsletter-form { flex: 1; min-width: 300px; max-width: 480px; }
  .nl-row {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  .nl-row input {
    flex: 1;
    min-width: 130px;
    background: var(--bg);
    border: 1px solid var(--border);
    color: var(--text);
    padding: 12px 14px;
    border-radius: 8px;
    font-family: var(--font);
    font-size: 0.9rem;
    outline: none;
    transition: border-color 0.2s;
  }
  .nl-row input:focus { border-color: rgba(200,240,96,0.4); }
  .nl-row input::placeholder { color: var(--muted); }

  .footer-bottom {
    border-top: 1px solid var(--border);
    padding: 1.75rem 0;
  }
  .footer-bottom-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
  }
  .footer-logo {
    font-weight: 800;
    font-size: 1rem;
    text-decoration: none;
    color: var(--text);
  }
  .footer-logo em { font-style: normal; color: var(--accent); }
  .footer-links {
    list-style: none;
    display: flex;
    gap: 1.5rem;
  }
  .footer-links a {
    color: var(--muted);
    text-decoration: none;
    font-size: 0.85rem;
    transition: color 0.2s;
  }
  .footer-links a:hover { color: var(--text); }
  .footer-right {
    font-family: var(--mono);
    font-size: 0.75rem;
    color: var(--muted);
  }
</style>

<script>
  // --- POPUP HELPERS ---
  function openIdeaPopup() {
    document.getElementById('ideaPopup').classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeIdeaPopup() {
    document.getElementById('ideaPopup').classList.remove('active');
    document.body.style.overflow = '';
  }
  function closeExitPopup() {
    document.getElementById('exitPopup').classList.remove('active');
    document.body.style.overflow = '';
    setCookie('exit_dismissed', '1', 7);
  }
  document.getElementById('exitPopup').addEventListener('click', function(e) {
    if (e.target === this) closeExitPopup();
  });
  document.getElementById('ideaPopup').addEventListener('click', function(e) {
    if (e.target === this) closeIdeaPopup();
  });

  // --- EXIT INTENT ---
  function getCookie(name) {
    return document.cookie.split(';').some(c => c.trim().startsWith(name + '='));
  }
  function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + '=' + value + ';expires=' + d.toUTCString() + ';path=/';
  }
  let exitFired = false;
  document.addEventListener('mouseleave', function(e) {
    if (e.clientY <= 10 && !exitFired && !getCookie('exit_dismissed')) {
      exitFired = true;
      document.getElementById('exitPopup').classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });

  // --- NEWSLETTER SUBMIT (footer) ---
  async function submitNewsletter(e) {
    e.preventDefault();
    const btn = document.getElementById('nlBtn');
    const msg = document.getElementById('nlMsg');
    const name = document.getElementById('nl_name').value.trim();
    const email = document.getElementById('nl_email').value.trim();
    btn.disabled = true;
    btn.textContent = 'Subscribing...';
    msg.className = 'form-msg';
    try {
      const res = await fetch('/signup.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'name=' + encodeURIComponent(name) + '&email=' + encodeURIComponent(email)
      });
      const data = await res.json();
      if (data.success) {
        msg.textContent = 'You\'re in! We\'ll notify you on the next tool drop.';
        msg.className = 'form-msg success';
        document.getElementById('newsletterForm').reset();
        setCookie('nl_subscribed', '1', 365);
      } else {
        msg.textContent = data.message || 'Something went wrong. Please try again.';
        msg.className = 'form-msg error';
      }
    } catch (err) {
      msg.textContent = 'Network error. Please try again.';
      msg.className = 'form-msg error';
    }
    btn.disabled = false;
    btn.textContent = 'Notify me';
  }

  // --- EXIT POPUP NEWSLETTER SUBMIT ---
  async function submitExitNewsletter(e) {
    e.preventDefault();
    const btn = document.getElementById('exitBtn');
    const msg = document.getElementById('exitMsg');
    const name = document.getElementById('exit_name').value.trim();
    const email = document.getElementById('exit_email').value.trim();
    btn.disabled = true;
    btn.textContent = 'Subscribing...';
    msg.className = 'form-msg';
    try {
      const res = await fetch('/signup.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'name=' + encodeURIComponent(name) + '&email=' + encodeURIComponent(email)
      });
      const data = await res.json();
      if (data.success) {
        msg.textContent = 'Awesome! Check your inbox soon.';
        msg.className = 'form-msg success';
        document.getElementById('exitForm').reset();
        setCookie('exit_dismissed', '1', 7);
        setCookie('nl_subscribed', '1', 365);
        setTimeout(closeExitPopup, 2500);
      } else {
        msg.textContent = data.message || 'Something went wrong.';
        msg.className = 'form-msg error';
      }
    } catch (err) {
      msg.textContent = 'Network error. Please try again.';
      msg.className = 'form-msg error';
    }
    btn.disabled = false;
    btn.textContent = 'Yes, send me the tools';
  }

  // --- SUBMIT IDEA ---
  async function submitIdea(e) {
    e.preventDefault();
    const btn = document.getElementById('ideaBtn');
    const msg = document.getElementById('ideaMsg');
    const payload = {
      title: document.getElementById('idea_title').value.trim(),
      description: document.getElementById('idea_desc').value.trim(),
      name: document.getElementById('idea_name').value.trim(),
      email: document.getElementById('idea_email').value.trim()
    };
    btn.disabled = true;
    btn.textContent = 'Sending...';
    msg.className = 'form-msg';
    try {
      const res = await fetch('/submit-idea.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        msg.textContent = 'Idea submitted! We\'ll review and get back to you.';
        msg.className = 'form-msg success';
        document.getElementById('ideaForm').reset();
        setTimeout(closeIdeaPopup, 2500);
      } else {
        msg.textContent = data.message || 'Something went wrong.';
        msg.className = 'form-msg error';
      }
    } catch (err) {
      msg.textContent = 'Network error. Please try again.';
      msg.className = 'form-msg error';
    }
    btn.disabled = false;
    btn.textContent = 'Submit idea';
  }
</script>
</body>
</html>
