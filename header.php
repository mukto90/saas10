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
      <li class="nav-has-mega">
        <a href="/#tools" <?php echo $current_page === 'index' ? 'class="active"' : ''; ?>>Tools</a>
        <div class="mega-menu">
          <div class="mega-inner">
            <div class="mega-col">
              <h4>Pricing</h4>
              <ul>
                <li><a href="/tools/saas-pricing-calculator/">SaaS Pricing Calculator</a><span>Set optimal prices with value-based tiers</span></li>
              </ul>
            </div>
            <div class="mega-col">
              <h4>Valuation</h4>
              <ul>
                <li><a href="/tools/saas-valuation/">SaaS Valuation</a><span>Estimate your company's worth</span></li>
              </ul>
            </div>
            <div class="mega-col">
              <h4>Sales</h4>
              <ul>
                <li><a href="/tools/sales-capacity-planner/">Sales Capacity Planner</a><span>Plan rep capacity and coverage</span></li>
                <li><a href="/tools/revenue-per-employee/">Revenue per Employee</a><span>Measure sales team efficiency</span></li>
                <li><a href="/tools/sales-pipeline-calculator/">Sales Pipeline Calculator</a><span>Calculate pipeline needed to hit targets</span></li>
                <li><a href="/tools/sales-compensation-calculator/">Sales Compensation</a><span>Design comp plans for your team</span></li>
              </ul>
            </div>
            <div class="mega-col">
              <h4>Growth</h4>
              <ul>
                <li><a href="/tools/roi-calculator/">ROI Calculator</a><span>Measure return on investment</span></li>
                <li><a href="/tools/rule-of-40/">Rule of 40</a><span>Balance growth and profitability</span></li>
              </ul>
            </div>
            <div class="mega-col">
              <h4>Finance</h4>
              <ul>
                <li><a href="/tools/runway-calculator/">Runway Calculator</a><span>Track cash runway</span></li>
                <li><a href="/tools/burn-rate-calculator/">Burn Rate Calculator</a><span>Track monthly burn</span></li>
                <li><a href="/tools/mrr-arr-calculator/">MRR/ARR Calculator</a><span>Project recurring revenue</span></li>
                <li><a href="/tools/break-even-calculator/">Break-even Calculator</a><span>Find profitability point</span></li>
              </ul>
            </div>
            <div class="mega-col">
              <h4>Pricing Strategy</h4>
              <ul>
                <li><a href="/tools/price-increase-simulator/">Price Increase Simulator</a><span>Model price change impact</span></li>
              </ul>
            </div>
            <div class="mega-col">
              <h4>Metrics</h4>
              <ul>
                <li><a href="/tools/ltv-cac-ratio-calculator/">LTV:CAC Ratio</a><span>Customer lifetime value ratio</span></li>
                <li><a href="/tools/cac-payback-calculator/">CAC Payback</a><span>Months to recover CAC</span></li>
                <li><a href="/tools/nrr-calculator/">NRR</a><span>Net Revenue Retention</span></li>
                <li><a href="/tools/churn-rate-calculator/">Churn Rate Calculator</a><span>Track customer loss</span></li>
                <li><a href="/tools/cohort-retention/">Cohort Retention</a><span>Analyze retention by cohort</span></li>
              </ul>
            </div>
            <div class="mega-col">
              <h4>Fundraising</h4>
              <ul>
                <li><a href="/tools/fundraising-calculator/">Fundraising Calculator</a><span>Plan funding rounds</span></li>
              </ul>
            </div>
          </div>
        </div>
      </li>
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
