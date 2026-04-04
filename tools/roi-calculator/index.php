<?php
$page_title = 'ROI Calculator';
$page_desc  = 'Calculate return on investment for any SaaS tool or business initiative. See payback period, NPV, and 12-month projections.';
include '../../header.php';
?>
<link rel="stylesheet" href="../../assets/css/tools.css">
<link rel="stylesheet" href="style.css">

<div class="tool-page">
  <div class="wrap">
    <a href="/" class="back-link">← All tools</a>
    
    <div class="page-header">
      <h1>ROI Calculator</h1>
      <p>Calculate ROI for any SaaS tool or business spend with projections.</p>
    </div>

    <div class="mode-toggle">
      <button class="mode-btn active" data-mode="simple">Simple</button>
      <button class="mode-btn" data-mode="advanced">Advanced</button>
    </div>

    <div class="tool-grid">
      <div class="card">
        <div class="card-label">Your Inputs</div>
        
        <div class="input-group">
          <label>Monthly Cost ($) <span class="term-tooltip">?<span class="tooltip-text">Monthly cost of the investment, tool, or initiative</span></span></label>
          <input type="number" id="monthlyCost" value="500" min="0" max="9999999" step="1">
        </div>
        
        <div class="input-group">
          <label>Monthly Revenue / Savings ($) <span class="term-tooltip">?<span class="tooltip-text">Monthly benefit from the investment (increased revenue or cost savings)</span></span></label>
          <input type="number" id="monthlyReturn" value="2000" min="0" max="9999999" step="1">
        </div>
        
        <div class="slider-group">
          <label>Time Period (months) <span id="periodDisplay">12 months</span></label>
          <div class="slider-wrapper">
            <input type="range" id="timePeriod" value="12" min="1" max="36" step="1">
            <div class="slider-ticks">
              <span>1</span><span>6</span><span>12</span><span>18</span><span>24</span><span>36</span>
            </div>
          </div>
        </div>

        <div class="advanced-inputs" style="display: none;">
          <div class="input-section">
            <div class="section-title">One-Time Costs</div>
            <div class="input-group">
              <label>One-Time Setup Cost ($) <span class="term-tooltip">?<span class="tooltip-text">Initial implementation or setup costs (one-time expenses)</span></span></label>
              <input type="number" id="setupCost" value="0" min="0" max="9999999" step="1">
            </div>
            <div class="input-group">
              <label>Training Cost ($) <span class="term-tooltip">?<span class="tooltip-text">Cost of training employees to use the tool or initiative</span></span></label>
              <input type="number" id="trainingCost" value="0" min="0" max="9999999" step="1">
            </div>
          </div>

          <div class="input-section">
            <div class="section-title">Growth Assumptions</div>
            <div class="input-group">
              <label>Monthly Cost Growth (%) <span class="term-tooltip">?<span class="tooltip-text">Expected month-over-month increase in costs</span></span></label>
              <input type="number" id="costGrowth" value="0" min="-50" max="200" step="0.1">
            </div>
            <div class="input-group">
              <label>Monthly Return Growth (%) <span class="term-tooltip">?<span class="tooltip-text">Expected month-over-month increase in revenue or savings</span></span></label>
              <input type="number" id="returnGrowth" value="0" min="-50" max="200" step="0.1">
            </div>
          </div>

          <div class="input-section">
            <div class="section-title">Financial Adjustments</div>
            <div class="input-group">
              <label>Tax Rate (%) <span class="term-tooltip">?<span class="tooltip-text">Corporate tax rate applied to profits</span></span></label>
              <input type="number" id="taxRate" value="0" min="0" max="60" step="0.1">
            </div>
            <div class="input-group">
              <label>Discount Rate (%) <span class="term-tooltip">?<span class="tooltip-text">Rate to calculate present value of future cash flows</span></span></label>
              <input type="number" id="discountRate" value="0" min="0" max="30" step="0.1">
            </div>
          </div>

          <div class="input-section">
            <div class="section-title">Opportunity Cost</div>
            <div class="input-group">
              <label>Alternative Investment Return ($/mo)</label>
              <input type="number" id="altReturn" value="0" min="0" max="9999999" step="1">
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
            <div class="label">Total Investment</div>
            <div class="value" id="totalInvestment">$6,000</div>
          </div>
          <div class="result-metric">
            <div class="label">Total Return</div>
            <div class="value" id="totalReturn">$24,000</div>
          </div>
          <div class="result-metric">
            <div class="label">Net Profit</div>
            <div class="value" id="netProfit">$18,000</div>
          </div>
          <div class="result-metric" id="roiContainer">
            <div class="label">ROI <span class="health-badge" id="roiBadge">Excellent</span></div>
            <div class="value" id="roiPercent">300.0%</div>
            <div class="sub" id="roiSub">Payback: 0.3 months</div>
          </div>
        </div>

        <div class="advanced-results" style="display: none;">
          <div class="results-row">
            <div class="result-metric">
              <div class="label">After-Tax Net Profit</div>
              <div class="value" id="afterTaxProfit">$18,000</div>
            </div>
            <div class="result-metric" id="npvContainer">
              <div class="label">NPV</div>
              <div class="value" id="npvValue">$18,000</div>
            </div>
          </div>
          <div class="results-row">
            <div class="result-metric">
              <div class="label">Opportunity Cost</div>
              <div class="value" id="oppCost">$0</div>
            </div>
            <div class="result-metric" id="netRoiAltContainer">
              <div class="label">Net ROI vs Alternative</div>
              <div class="value" id="netRoiAlt">—</div>
            </div>
          </div>
          <div class="results-row">
            <div class="result-metric">
              <div class="label">Monthly Avg Return</div>
              <div class="value" id="avgReturn">$2,000</div>
            </div>
            <div class="result-metric">
              <div class="label">Monthly Avg Profit</div>
              <div class="value" id="avgProfit">$1,500</div>
            </div>
          </div>
          <div class="results-row">
            <div class="result-metric">
              <div class="label">Cost Growth Impact</div>
              <div class="value" id="costImpact">$0</div>
            </div>
            <div class="result-metric">
              <div class="label">Return Growth Impact</div>
              <div class="value" id="returnImpact">$0</div>
            </div>
          </div>
        </div>

        <div class="feedback-line" id="feedback">Excellent — this spend is paying off significantly.</div>

        <div class="break-even-note" id="breakEvenNote" style="display: none;"></div>
      </div>
    </div>

    <div class="chart-section">
      <div class="card-label">12-Month Projection</div>
      <div class="chart-container">
        <canvas id="projectionChart"></canvas>
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
        <p><strong>ROI %</strong> = ((Total Return − Total Investment) ÷ Total Investment) × 100</p>
        <p><strong>Payback Period</strong> = Total Investment ÷ Monthly Return</p>
        <p><strong>NPV</strong> = Σ (Monthly Net ÷ (1 + Discount Rate)^Month) − One-Time Costs</p>
        <p>This calculator assumes consistent monthly performance over the selected time period.</p>
      </div>
    </div>
  </div>
</div>

<script src="../../assets/js/jquery.min.js"></script>
<script src="../../assets/js/tools.js"></script>
<script src="script.js"></script>

<?php include '../../footer.php'; ?>