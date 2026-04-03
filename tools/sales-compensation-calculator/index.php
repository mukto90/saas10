<?php
$page_title = 'Sales Compensation Calculator';
$page_desc  = 'Design and model sales compensation plans for your team.';
include '../../header.php';
?>
<link rel="stylesheet" href="../../assets/css/tools.css">
<link rel="stylesheet" href="style.css">

<div class="tool-page">
  <div class="wrap">
    <a href="/" class="back-link">← All tools</a>
    
    <div class="page-header">
      <h1>Sales Compensation Calculator</h1>
      <p>Design and model sales compensation plans for your team.</p>
    </div>

    <div class="mode-toggle">
      <button class="mode-btn active" data-mode="simple">Simple</button>
      <button class="mode-btn" data-mode="advanced">Advanced</button>
    </div>

    <div class="tool-grid">
      <div class="card">
        <div class="card-label">Your Inputs</div>
        
        <div class="input-group">
          <label>Target OTE ($) <span class="term-tooltip">?<span class="tooltip-text">On-Target Earnings - total compensation when quota is hit</span></span></label>
          <input type="number" id="ote" value="120000" min="0" max="9999999" step="1">
        </div>
        
        <div class="input-group">
          <label>Annual Quota ($) <span class="term-tooltip">?<span class="tooltip-text">Annual revenue quota for the rep</span></span></label>
          <input type="number" id="quota" value="600000" min="0" max="999999999" step="1">
        </div>
        
        <div class="input-group">
          <label>Base / OTE Split (%) <span class="term-tooltip">?<span class="tooltip-text">Percentage of OTE that is base salary vs commission</span></span></label>
          <input type="number" id="baseSplit" value="50" min="0" max="100" step="1">
        </div>

        <div class="advanced-inputs" style="display: none;">
          <div class="input-section">
            <div class="section-title">Compensation Model</div>
            <div class="input-group">
              <label>Model Type</label>
              <select id="model">
                <option value="fixed" selected>Fixed</option>
                <option value="tiered">Tiered</option>
                <option value="draw">Draw</option>
              </select>
            </div>
            <div class="input-group">
              <label>Commission Type</label>
              <select id="commType">
                <option value="revenue" selected>Revenue</option>
                <option value="margin">Margin</option>
                <option value="newlogo">New Logo</option>
              </select>
            </div>
          </div>

          <div class="input-section">
            <div class="section-title">Team Settings</div>
            <div class="input-group">
              <label>Number of Reps</label>
              <input type="number" id="reps" value="5" min="1" max="100" step="1">
            </div>
            <div class="input-group">
              <label>Gross Margin (%)</label>
              <input type="number" id="margin" value="80" min="0" max="100" step="0.1">
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
            <div class="label">Base Salary</div>
            <div class="value" id="baseSalary">$60,000</div>
          </div>
          <div class="result-metric">
            <div class="label">Target Commission</div>
            <div class="value" id="targetCommission">$60,000</div>
          </div>
        </div>

        <div class="results-row">
          <div class="result-metric">
            <div class="label">Commission Rate</div>
            <div class="value" id="commissionRate">10%</div>
          </div>
          <div class="result-metric">
            <div class="label">Monthly Quota</div>
            <div class="value" id="monthlyQuota">$50,000</div>
          </div>
        </div>

        <div class="results-row">
          <div class="result-metric">
            <div class="label">Monthly Target Commission</div>
            <div class="value" id="monthlyCommission">$5,000</div>
          </div>
          <div class="result-metric" id="cosContainer">
            <div class="label">Cost of Sales <span class="health-badge" id="cosBadge">Healthy</span> <span class="term-tooltip">?<span class="tooltip-text">Base + Commission as % of revenue</span></span></div>
            <div class="value" id="cos">20%</div>
          </div>
        </div>

        <div class="advanced-results" style="display: none;">
          <div class="results-row">
            <div class="result-metric">
              <div class="label">Total Comp at 120%</div>
              <div class="value" id="comp120">$144,000</div>
            </div>
            <div class="result-metric">
              <div class="label">Total Comp at 150%</div>
              <div class="value" id="comp150">$180,000</div>
            </div>
          </div>

          <div class="scenario-comparison">
            <div class="section-tag">// attainment scenarios</div>
            <div class="scenario-grid">
              <div class="scenario-card">
                <div class="scenario-title">80% Attainment</div>
                <div class="scenario-value" id="scenario80">$108,000</div>
              </div>
              <div class="scenario-card">
                <div class="scenario-title">100% Attainment</div>
                <div class="scenario-value" id="scenario100">$120,000</div>
              </div>
              <div class="scenario-card">
                <div class="scenario-title">120% Attainment</div>
                <div class="scenario-value" id="scenario120">$144,000</div>
              </div>
            </div>
          </div>
        </div>

        <div class="feedback-line" id="feedback">Your compensation structure is healthy. 20% cost of sales is within the standard range.</div>
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
        <p><strong>Base Salary</strong> = OTE × (Base % / 100)</p>
        <p><strong>Target Commission</strong> = OTE − Base Salary</p>
        <p><strong>Commission Rate</strong> = Target Commission ÷ Quota × 100</p>
        <p><strong>Monthly Quota</strong> = Annual Quota ÷ 12</p>
        <p><strong>Cost of Sales</strong> = (Base + Commission) ÷ Quota × 100</p>
      </div>
    </div>
  </div>
</div>

<script src="../../assets/js/jquery.min.js"></script>
<script src="../../assets/js/tools.js"></script>
<script src="script.js"></script>

<?php include '../../footer.php'; ?>
