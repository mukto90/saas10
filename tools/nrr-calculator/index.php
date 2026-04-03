<?php
$page_title = 'NRR Calculator';
$page_desc  = 'Calculate Net Revenue Retention (NRR) — the SaaS metric that matters most for valuation.';
include '../../header.php';
?>
<link rel="stylesheet" href="../../assets/css/tools.css">
<link rel="stylesheet" href="style.css">

<div class="tool-page">
  <div class="wrap">
    <a href="/" class="back-link">← All tools</a>
    
    <div class="page-header">
      <h1>Net Revenue Retention Calculator</h1>
      <p>Calculate NRR — the SaaS metric that matters most for valuation.</p>
    </div>

    <div class="mode-toggle">
      <button class="mode-btn active" data-mode="simple">Simple</button>
      <button class="mode-btn" data-mode="advanced">Advanced</button>
    </div>

    <div class="tool-grid">
      <div class="card">
        <div class="card-label">Your Inputs</div>
        
        <div class="input-section">
          <div class="section-title">Cohort Data</div>
          <div class="input-group">
            <label>Starting MRR ($) <span class="term-tooltip">?<span class="tooltip-text">Starting MRR: The MRR at the beginning of the measurement period</span></span></label>
            <input type="number" id="startingMrr" value="100000" min="0" max="999999999" step="1">
          </div>
          <div class="input-group">
            <label>Expansion MRR ($) <span class="term-tooltip">?<span class="tooltip-text">Expansion MRR: Additional revenue from existing customers (upgrades, add-ons)</span></span></label>
            <input type="number" id="expansionMrr" value="15000" min="0" max="99999999" step="1">
          </div>
          <div class="input-group">
            <label>Contraction MRR ($) <span class="term-tooltip">?<span class="tooltip-text">Contraction MRR: Revenue lost from downgrades or reduced usage</span></span></label>
            <input type="number" id="contractionMrr" value="5000" min="0" max="99999999" step="1">
          </div>
          <div class="input-group">
            <label>Churned MRR ($) <span class="term-tooltip">?<span class="tooltip-text">Churned MRR: Revenue lost from customers who cancelled entirely</span></span></label>
            <input type="number" id="churnedMrr" value="8000" min="0" max="99999999" step="1">
          </div>
        </div>

        <div class="advanced-inputs" style="display: none;">
          <div class="input-section">
            <div class="section-title">Settings</div>
            <div class="input-group">
              <label>Time Period</label>
              <select id="period">
                <option value="monthly" selected>Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>
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

          <div class="input-section">
            <div class="section-title">Growth Assumptions</div>
            <div class="input-group">
              <label>Expected Growth (%) <span class="term-tooltip">?<span class="tooltip-text">Expected month-over-month MRR growth</span></span></label>
              <input type="number" id="growth" value="5" min="-20" max="50" step="0.1">
            </div>
          </div>
        </div>
      </div>

      <div class="results-card">
        <div class="card-label">Results</div>
        
        <div class="results-grid">
          <div class="result-metric" id="nrrContainer">
            <div class="label">NRR <span class="health-badge" id="nrrBadge">Excellent</span> <span class="term-tooltip">?<span class="tooltip-text">Net Revenue Retention: Revenue retained from existing customers after expansions, contractions, and churn</span></span></div>
            <div class="value" id="nrr">112%</div>
            <div class="sub" id="nrrNote">Great retention — customers are growing</div>
          </div>
          <div class="result-metric" id="grrContainer">
            <div class="label">GRR <span class="health-badge" id="grrBadge">Healthy</span> <span class="term-tooltip">?<span class="tooltip-text">Gross Revenue Retention: Revenue retained excluding expansion</span></span></div>
            <div class="value" id="grr">95%</div>
          </div>
        </div>

        <div class="results-row">
          <div class="result-metric">
            <div class="label">Net New MRR</div>
            <div class="value" id="netNewMrr">+$2,000</div>
          </div>
          <div class="result-metric">
            <div class="label">Dollar Retention</div>
            <div class="value" id="dollarRetention">+$2,000</div>
          </div>
        </div>

        <div class="results-row">
          <div class="result-metric">
            <div class="label">Expansion Rate</div>
            <div class="value" id="expansionRate">15%</div>
          </div>
          <div class="result-metric">
            <div class="label">Contraction Rate</div>
            <div class="value" id="contractionRate">5%</div>
          </div>
          <div class="result-metric">
            <div class="label">Churn Rate</div>
            <div class="value" id="churnRate">8%</div>
          </div>
        </div>

        <div class="advanced-results" style="display: none;">
          <div class="results-row">
            <div class="result-metric">
              <div class="label">Ending MRR</div>
              <div class="value" id="endingMrr">$102,000</div>
            </div>
            <div class="result-metric">
              <div class="label">NRR (12-mo projection)</div>
              <div class="value" id="nrrProjection">118%</div>
            </div>
          </div>

          <div class="scenario-comparison">
            <div class="section-tag">// impact analysis</div>
            <div class="scenario-grid">
              <div class="scenario-card">
                <div class="scenario-title">+5% Expansion</div>
                <div class="scenario-value" id="scenarioExpansionNrr">117%</div>
              </div>
              <div class="scenario-card">
                <div class="scenario-title">-5% Churn</div>
                <div class="scenario-value" id="scenarioChurnNrr">117%</div>
              </div>
              <div class="scenario-card">
                <div class="scenario-title">No Contraction</div>
                <div class="scenario-value" id="scenarioContractionNrr">117%</div>
              </div>
            </div>
          </div>
        </div>

        <div class="feedback-line" id="feedback">Your NRR is excellent. At 112%, you have strong expansion and are retaining revenue well.</div>
      </div>
    </div>

    <div class="chart-section">
      <div class="card-label">MRR Breakdown</div>
      <div class="chart-container">
        <canvas id="nrrChart"></canvas>
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
        <p><strong>NRR</strong> = ((Starting MRR + Expansion − Contraction − Churn) ÷ Starting MRR) × 100</p>
        <p><strong>GRR</strong> = ((Starting MRR + Expansion − Contraction) ÷ Starting MRR) × 100</p>
        <p><strong>Expansion Rate</strong> = Expansion MRR ÷ Starting MRR × 100</p>
        <p><strong>Contraction Rate</strong> = Contraction MRR ÷ Starting MRR × 100</p>
        <p><strong>Churn Rate</strong> = Churned MRR ÷ Starting MRR × 100</p>
      </div>
    </div>
  </div>
</div>

<script src="../../assets/js/jquery.min.js"></script>
<script src="../../assets/js/tools.js"></script>
<script src="script.js"></script>

<?php include '../../footer.php'; ?>
