<?php
$page_title = 'Burn Rate Calculator';
$page_desc  = 'Calculate your monthly burn rate and runway.';
include '../../header.php';
?>
<link rel="stylesheet" href="../../assets/css/tools.css">
<link rel="stylesheet" href="style.css">

<div class="tool-page">
  <div class="wrap">
    <a href="/" class="back-link">← All tools</a>
    
    <div class="page-header">
      <h1>Burn Rate Calculator</h1>
      <p>Calculate your monthly burn rate and runway.</p>
    </div>

    <div class="mode-toggle">
      <button class="mode-btn active" data-mode="simple">Simple</button>
      <button class="mode-btn" data-mode="advanced">Advanced</button>
    </div>

    <div class="tool-grid">
      <div class="card">
        <div class="card-label">Your Inputs</div>
        
        <div class="input-group">
          <label>Monthly Expenses ($) <span class="term-tooltip">?<span class="tooltip-text">Total monthly operating expenses</span></span></label>
          <input type="number" id="expenses" value="50000" min="0" max="999999999" step="1">
        </div>
        
        <div class="input-group">
          <label>Monthly Revenue ($) <span class="term-tooltip">?<span class="tooltip-text">Monthly recurring revenue</span></span></label>
          <input type="number" id="revenue" value="15000" min="0" max="999999999" step="1">
        </div>
        
        <div class="input-group">
          <label>Cash in Bank ($) <span class="term-tooltip">?<span class="tooltip-text">Total cash reserves</span></span></label>
          <input type="number" id="cash" value="300000" min="0" max="999999999" step="1">
        </div>

        <div class="advanced-inputs" style="display: none;">
          <div class="input-section">
            <div class="section-title">Cost Breakdown</div>
            <div class="input-group">
              <label>Salaries ($/mo) <span class="term-tooltip">?<span class="tooltip-text">Total monthly salaries</span></span></label>
              <input type="number" id="salaries" value="30000" min="0" max="99999999" step="1">
            </div>
            <div class="input-group">
              <label>Infrastructure ($/mo) <span class="term-tooltip">?<span class="tooltip-text">Hosting, servers, software</span></span></label>
              <input type="number" id="infrastructure" value="3000" min="0" max="99999999" step="1">
            </div>
            <div class="input-group">
              <label>Marketing ($/mo) <span class="term-tooltip">?<span class="tooltip-text">Advertising and marketing</span></span></label>
              <input type="number" id="marketing" value="5000" min="0" max="99999999" step="1">
            </div>
            <div class="input-group">
              <label>Tools ($/mo) <span class="term-tooltip">?<span class="tooltip-text">Software subscriptions</span></span></label>
              <input type="number" id="tools" value="2000" min="0" max="99999999" step="1">
            </div>
            <div class="input-group">
              <label>Office ($/mo) <span class="term-tooltip">?<span class="tooltip-text">Rent, utilities, operations</span></span></label>
              <input type="number" id="office" value="2000" min="0" max="99999999" step="1">
            </div>
            <div class="input-group">
              <label>Other ($/mo) <span class="term-tooltip">?<span class="tooltip-text">Miscellaneous expenses</span></span></label>
              <input type="number" id="other" value="8000" min="0" max="99999999" step="1">
            </div>
          </div>

          <div class="input-section">
            <div class="section-title">Projections</div>
            <div class="input-group">
              <label>Revenue Growth (%) <span class="term-tooltip">?<span class="tooltip-text">Expected monthly revenue growth</span></span></label>
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
            <div class="label">Gross Burn <span class="term-tooltip">?<span class="tooltip-text">Total monthly expenses</span></span></div>
            <div class="value" id="grossBurn">$50,000</div>
          </div>
          <div class="result-metric" id="netBurnContainer">
            <div class="label">Net Burn <span class="health-badge" id="netBurnBadge">Burning</span> <span class="term-tooltip">?<span class="tooltip-text">Expenses minus revenue</span></span></div>
            <div class="value" id="netBurn">$35,000</div>
          </div>
        </div>

        <div class="results-row">
          <div class="result-metric" id="runwayContainer">
            <div class="label">Runway <span class="health-badge" id="runwayBadge">Plan ahead</span> <span class="term-tooltip">?<span class="tooltip-text">Months of cash remaining</span></span></div>
            <div class="value" id="runway">8.6 months</div>
            <div class="sub" id="runwayNote">Ends in ~9 months</div>
          </div>
          <div class="result-metric">
            <div class="label">Burn Multiple <span class="term-tooltip">?<span class="tooltip-text">Cash ÷ Annual Burn</span></span></div>
            <div class="value" id="burnMultiple">0.7 years</div>
          </div>
        </div>

        <div class="advanced-results" style="display: none;">
          <div class="results-row">
            <div class="result-metric">
              <div class="label">Headcount Cost %</div>
              <div class="value" id="hcPercent">60%</div>
            </div>
            <div class="result-metric">
              <div class="label">Break-even</div>
              <div class="value" id="breakEven">Month 24</div>
            </div>
          </div>

          <div class="scenario-comparison">
            <div class="section-tag">// runway scenarios</div>
            <div class="scenario-grid">
              <div class="scenario-card">
                <div class="scenario-title">Pessimistic</div>
                <div class="scenario-value" id="scenarioPessimistic">6.5 months</div>
              </div>
              <div class="scenario-card">
                <div class="scenario-title">Default</div>
                <div class="scenario-value" id="scenarioDefault">8.6 months</div>
              </div>
              <div class="scenario-card">
                <div class="scenario-title">Optimistic</div>
                <div class="scenario-value" id="scenarioOptimistic">11.2 months</div>
              </div>
            </div>
          </div>
        </div>

        <div class="feedback-line" id="feedback">Start planning your fundraise. You have under 12 months of runway.</div>
      </div>
    </div>

    <div class="chart-section">
      <div class="card-label">Cash Runway</div>
      <div class="chart-container">
        <canvas id="burnChart"></canvas>
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
        <p><strong>Gross Burn</strong> = Total Monthly Expenses</p>
        <p><strong>Net Burn</strong> = Gross Burn − Revenue</p>
        <p><strong>Runway</strong> = Cash ÷ Net Burn</p>
        <p><strong>Burn Multiple</strong> = Cash ÷ (Annual Gross Burn)</p>
      </div>
    </div>
  </div>
</div>

<script src="../../assets/js/jquery.min.js"></script>
<script src="../../assets/js/tools.js"></script>
<script src="script.js"></script>

<?php include '../../footer.php'; ?>
