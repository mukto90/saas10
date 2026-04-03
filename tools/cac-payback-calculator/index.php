<?php
$page_title = 'CAC Payback Calculator';
$page_desc  = 'Calculate how long it takes to recover the cost of acquiring a customer.';
include '../../header.php';
?>
<link rel="stylesheet" href="../../assets/css/tools.css">
<link rel="stylesheet" href="style.css">

<div class="tool-page">
  <div class="wrap">
    <a href="/" class="back-link">← All tools</a>
    
    <div class="page-header">
      <h1>CAC Payback Calculator</h1>
      <p>Calculate how long it takes to recover the cost of acquiring a customer.</p>
    </div>

    <div class="mode-toggle">
      <button class="mode-btn active" data-mode="simple">Simple</button>
      <button class="mode-btn" data-mode="advanced">Advanced</button>
    </div>

    <div class="tool-grid">
      <div class="card">
        <div class="card-label">Your Inputs</div>
        
        <div class="input-group">
          <label>CAC ($) <span class="term-tooltip">?<span class="tooltip-text">CAC: Customer Acquisition Cost - total cost to acquire a new customer</span></span></label>
          <input type="number" id="cac" value="500" min="0" max="9999999" step="1">
        </div>
        
        <div class="input-group">
          <label>Monthly ARPU ($) <span class="term-tooltip">?<span class="tooltip-text">ARPU: Average Revenue Per User - the average monthly revenue generated from each customer</span></span></label>
          <input type="number" id="arpu" value="99" min="0" max="9999999" step="0.01">
        </div>
        
        <div class="input-group">
          <label>Gross Margin (%) <span class="term-tooltip">?<span class="tooltip-text">Gross Margin: Percentage of revenue remaining after deducting direct costs</span></span></label>
          <input type="number" id="grossMargin" value="80" min="0" max="100" step="0.1">
        </div>

        <div class="advanced-inputs" style="display: none;">
          <div class="input-section">
            <div class="section-title">Revenue Adjustments</div>
            <div class="input-group">
              <label>Expansion MRR ($) <span class="term-tooltip">?<span class="tooltip-text">Expansion MRR: Additional revenue from existing customers through upgrades</span></span></label>
              <input type="number" id="expansionMrr" value="10" min="0" max="9999999" step="0.01">
            </div>
            <div class="input-group">
              <label>Support Cost per Customer ($) <span class="term-tooltip">?<span class="tooltip-text">Monthly support cost per customer</span></span></label>
              <input type="number" id="supportCost" value="5" min="0" max="9999999" step="0.01">
            </div>
            <div class="input-group">
              <label>Monthly Churn (%) <span class="term-tooltip">?<span class="tooltip-text">Monthly churn rate</span></span></label>
              <input type="number" id="churnRate" value="2" min="0" max="100" step="0.01">
            </div>
          </div>

          <div class="input-section">
            <div class="section-title">Growth & Scenarios</div>
            <div class="input-group">
              <label>Revenue Growth (%) <span class="term-tooltip">?<span class="tooltip-text">Expected monthly revenue growth rate</span></span></label>
              <input type="number" id="growth" value="5" min="-20" max="50" step="0.1">
            </div>
          </div>

          <div class="input-section">
            <div class="section-title">Currency</div>
            <div class="input-group">
              <label>Currency Symbol</label>
              <select id="currency">
                <option value="USD" selected>$</option>
                <option value="EUR">€</option>
                <option value="GBP">£</option>
                <option value="BDT">৳</option>
                <option value="INR">₹</option>
                <option value="CAD">C$</option>
                <option value="AUD">A$</option>
                <option value="SGD">S$</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="results-card">
        <div class="card-label">Results</div>
        
        <div class="results-grid">
          <div class="result-metric">
            <div class="label">Monthly Gross Profit <span class="term-tooltip">?<span class="tooltip-text">Monthly Gross Profit: Revenue minus direct costs per customer</span></span></div>
            <div class="value" id="grossProfit">$79.20</div>
          </div>
          <div class="result-metric" id="paybackContainer">
            <div class="label">CAC Payback <span class="health-badge" id="paybackBadge">Excellent</span> <span class="term-tooltip">?<span class="tooltip-text">CAC Payback: Number of months to recover the cost of acquiring a customer</span></span></div>
            <div class="value" id="payback">6.3 months</div>
            <div class="sub" id="paybackNote">Excellent payback period. Target is under 9 months.</div>
          </div>
        </div>

        <div class="results-row">
          <div class="result-metric">
            <div class="label">Payback Revenue</div>
            <div class="value" id="paybackRevenue">$500</div>
          </div>
          <div class="result-metric">
            <div class="label">Annual Gross Profit</div>
            <div class="value" id="annualProfit">$950.40</div>
          </div>
        </div>

        <div class="advanced-results" style="display: none;">
          <div class="results-row">
            <div class="result-metric">
              <div class="label">Adjusted ARPU</div>
              <div class="value" id="adjustedArpu">$104</div>
            </div>
            <div class="result-metric">
              <div class="label">Adjusted Payback</div>
              <div class="value" id="adjustedPayback">6.1 months</div>
            </div>
          </div>

          <div class="scenario-comparison">
            <div class="section-tag">// scenario impact</div>
            <div class="scenario-grid">
              <div class="scenario-card">
                <div class="scenario-title">+10% Price</div>
                <div class="scenario-value" id="scenarioPricePayback">5.7 months</div>
              </div>
              <div class="scenario-card">
                <div class="scenario-title">+10% Churn</div>
                <div class="scenario-value" id="scenarioChurnPayback">6.9 months</div>
              </div>
              <div class="scenario-card">
                <div class="scenario-title">+10% Expansion</div>
                <div class="scenario-value" id="scenarioExpansionPayback">5.9 months</div>
              </div>
            </div>
          </div>
        </div>

        <div class="feedback-line" id="feedback">Your payback is excellent. Investors typically want to see under 12 months.</div>
      </div>
    </div>

    <div class="chart-section">
      <div class="card-label">Cumulative Revenue vs CAC</div>
      <div class="chart-container">
        <canvas id="paybackChart"></canvas>
      </div>
    </div>

    <div class="share-section">
      <button class="btn-ghost" id="copyResults">Copy Results</button>
      <button class="btn-ghost" id="shareLink">Share Link</button>
    </div>

    <div class="explanation">
      <button class="explanation-toggle" onclick="toggleExplanation()">
        <span class="arrow">▶</span> How is this calculated?
      </button>
      <div class="explanation-content" id="explanationContent">
        <p><strong>Monthly Gross Profit</strong> = ARPU × (Gross Margin / 100)</p>
        <p><strong>CAC Payback Period</strong> = CAC ÷ Monthly Gross Profit</p>
        <p><strong>Adjusted ARPU</strong> = ARPU + Expansion MRR − Support Cost</p>
        <p><strong>Payback Revenue</strong> = CAC (the total revenue needed to break even on acquisition)</p>
      </div>
    </div>
  </div>
</div>

<script src="../../assets/js/jquery.min.js"></script>
<script src="../../assets/js/tools.js"></script>
<script src="script.js"></script>

<?php include '../../footer.php'; ?>
