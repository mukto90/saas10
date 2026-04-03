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
<title><?php echo isset($page_title) ? $page_title . ' — SaaS10' : 'SaaS10 — Sustain Your SaaS Growth'; ?></title>
<meta name="description" content="<?php echo isset($page_desc) ? $page_desc : 'Free micro-tools for SaaS founders, marketers, and operators. No login. No fluff.'; ?>">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%230a0a0a'/%3E%3Ctext x='16' y='22' font-family='sans-serif' font-size='18' font-weight='800' fill='%23c8f060' text-anchor='middle'%3E10%3C/text%3E%3C/svg%3E">
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/main.css">
</head>
<body>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WZ3BJPFB"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
<nav>
  <div class="nav-inner">
    <a href="/" class="logo">SaaS<em>10</em> <span class="logo-badge">BETA</span></a>
    <button class="menu-toggle" onclick="toggleMenu()" aria-label="Toggle menu">
      <span></span><span></span><span></span>
    </button>
    <ul class="nav-links">
      <li><a href="/#tools" <?php echo $current_page === 'index' ? 'class="active"' : ''; ?>>Tools</a></li>
      <li><a href="/about.php">About</a></li>
      <li><a href="#" onclick="openIdeaPopup(); return false;" class="btn-nav">Submit an Idea</a></li>
    </ul>
  </div>
</nav>
<script>
function toggleMenu() {
  document.querySelector('.nav-links').classList.toggle('active');
  document.querySelector('.menu-toggle').classList.toggle('active');
}
</script>
