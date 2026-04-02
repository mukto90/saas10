<?php
$current_page = basename($_SERVER['PHP_SELF'], '.php');
?>
<!DOCTYPE html>
<html lang="en">
<head>
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WZ3BJPFB');</script>
<!-- End Google Tag Manager -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?php echo isset($page_title) ? $page_title . ' — saas10' : 'saas10 — Sustain Your SaaS Growth'; ?></title>
<meta name="description" content="<?php echo isset($page_desc) ? $page_desc : 'Free micro-tools for SaaS founders, marketers, and operators. No login. No fluff.'; ?>">
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0a0a0a;
    --surface: #111111;
    --surface2: #161616;
    --border: rgba(255,255,255,0.08);
    --border-hover: rgba(255,255,255,0.18);
    --text: #f0ede8;
    --muted: #888580;
    --accent: #c8f060;
    --accent2: #60d4f0;
    --font: 'Syne', sans-serif;
    --mono: 'DM Mono', monospace;
    --container: 1320px;
  }
  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font);
    min-height: 100vh;
    overflow-x: hidden;
  }
  .wrap { max-width: var(--container); margin: 0 auto; padding: 0 2rem; }

  /* NAV */
  nav {
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    background: rgba(10,10,10,0.93);
    backdrop-filter: blur(14px);
    z-index: 200;
  }
  .nav-inner {
    max-width: var(--container);
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
  }
  .logo {
    font-size: 1.3rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    text-decoration: none;
    color: var(--text);
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .logo em { font-style: normal; color: var(--accent); }
  .logo-badge {
    font-family: var(--mono);
    font-size: 10px;
    background: rgba(200,240,96,0.1);
    color: var(--accent);
    border: 1px solid rgba(200,240,96,0.22);
    padding: 2px 7px;
    border-radius: 20px;
    font-weight: 500;
    letter-spacing: 0.06em;
  }
  .nav-links {
    list-style: none;
    display: flex;
    align-items: center;
    gap: 2rem;
  }
  .nav-links a {
    color: var(--muted);
    text-decoration: none;
    font-size: 0.88rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    transition: color 0.2s;
  }
  .nav-links a:hover { color: var(--text); }
  .nav-links a.active { color: var(--text); }
  .btn-nav {
    background: var(--accent);
    color: #0a0a0a !important;
    padding: 8px 20px;
    border-radius: 6px;
    font-weight: 700 !important;
    transition: opacity 0.2s !important;
  }
  .btn-nav:hover { opacity: 0.85; }

  /* BUTTONS */
  .btn-primary {
    background: var(--accent);
    color: #0a0a0a;
    padding: 13px 28px;
    border-radius: 8px;
    font-family: var(--font);
    font-size: 0.95rem;
    font-weight: 700;
    border: none;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s;
    display: inline-block;
    text-decoration: none;
  }
  .btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
  .btn-ghost {
    background: transparent;
    color: var(--muted);
    padding: 13px 28px;
    border-radius: 8px;
    font-family: var(--font);
    font-size: 0.95rem;
    font-weight: 600;
    border: 1px solid var(--border);
    cursor: pointer;
    transition: color 0.2s, border-color 0.2s;
    display: inline-block;
    text-decoration: none;
  }
  .btn-ghost:hover { color: var(--text); border-color: var(--border-hover); }

  /* POPUP BASE */
  .popup-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.75);
    backdrop-filter: blur(4px);
    z-index: 1000;
    align-items: center;
    justify-content: center;
  }
  .popup-overlay.active { display: flex; }
  .popup-box {
    background: var(--surface);
    border: 1px solid var(--border-hover);
    border-radius: 16px;
    padding: 2.5rem;
    width: 100%;
    max-width: 480px;
    margin: 1rem;
    position: relative;
    animation: popIn 0.25s ease;
  }
  @keyframes popIn {
    from { opacity: 0; transform: scale(0.95) translateY(10px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  .popup-close {
    position: absolute;
    top: 1rem; right: 1.25rem;
    background: none;
    border: none;
    color: var(--muted);
    font-size: 1.4rem;
    cursor: pointer;
    line-height: 1;
    transition: color 0.2s;
  }
  .popup-close:hover { color: var(--text); }
  .popup-box h3 {
    font-size: 1.4rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-bottom: 0.5rem;
  }
  .popup-box p.popup-sub {
    font-size: 0.9rem;
    color: var(--muted);
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }
  .form-group { margin-bottom: 1rem; }
  .form-group label {
    display: block;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--muted);
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin-bottom: 6px;
    font-family: var(--mono);
  }
  .form-group input,
  .form-group textarea {
    width: 100%;
    background: var(--bg);
    border: 1px solid var(--border);
    color: var(--text);
    padding: 11px 14px;
    border-radius: 8px;
    font-family: var(--font);
    font-size: 0.92rem;
    outline: none;
    transition: border-color 0.2s;
    resize: vertical;
  }
  .form-group input:focus,
  .form-group textarea:focus { border-color: rgba(200,240,96,0.4); }
  .form-group input::placeholder,
  .form-group textarea::placeholder { color: var(--muted); }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .form-msg {
    font-size: 0.85rem;
    margin-top: 0.75rem;
    padding: 10px 14px;
    border-radius: 8px;
    display: none;
  }
  .form-msg.success { background: rgba(200,240,96,0.1); color: var(--accent); border: 1px solid rgba(200,240,96,0.2); display: block; }
  .form-msg.error { background: rgba(240,80,80,0.1); color: #f05050; border: 1px solid rgba(240,80,80,0.2); display: block; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
</style>
</head>
<body>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WZ3BJPFB"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
<nav>
  <div class="nav-inner">
    <a href="/" class="logo">saas<em>10</em> <span class="logo-badge">BETA</span></a>
    <ul class="nav-links">
      <li><a href="/#tools" <?php echo $current_page === 'index' ? 'class="active"' : ''; ?>>Tools</a></li>
      <li><a href="/about.php">About</a></li>
      <li><a href="#" onclick="openIdeaPopup(); return false;" class="btn-nav">Submit an Idea</a></li>
    </ul>
  </div>
</nav>
