<?php
$page_title = 'Runway Calculator';
$page_desc  = 'Calculate how many months of cash runway your SaaS has left. Model revenue growth, planned hires, and funding triggers.';
include '../../header.php';
?>
<link rel="stylesheet" href="../../assets/css/tools.css">
<link rel="stylesheet" href="style.css">

<div class="tool-page">
  <div class="wrap">
    <a href="/" class="back-link">← All tools</a>
    
    <div class="page-header">
      <h1>Runway Calculator</h1>
      <p>Calculate how many months of cash runway your SaaS has left.</p>
    </div>

    <div class="mode-toggle">
      <button class="mode-btn active" data-mode="simple">Simple</button>
      <button class="mode-btn" data-mode="advanced">Advanced</button>
    </div>

    <div class="tool-grid">
      <div class="card">
        <div class="card-label">Your Inputs</div>
        
        <div class="input-group">
          <label>Cash in Bank ($) <span class="term-tooltip">?<span class="tooltip-text">Cash in Bank: Total cash reserves available to the business</span></span></label>
          <input type="number" id="cashInBank" value="500000" min="0" max="999999999" step="1">
        </div>
        
        <div class="input-group">
          <label>Monthly Gross Burn ($) <span class="term-tooltip">?<span class="tooltip-text">Gross Burn: Total monthly operating expenses before revenue</span></span></label>
          <input type="number" id="grossBurn" value="40000" min="0" max="9999999" step="1">
        </div>
        
        <div class="input-group">
          <label>Monthly Revenue ($) <span class="term-tooltip">?<span class="tooltip-text">Monthly Revenue: Total monthly recurring revenue</span></span></label>
          <input type="number" id="monthlyRevenue" value="10000" min="0" max="9999999" step="1">
        </div>

        <div class="advanced-inputs" style="display: none;">
          <div class="input-section">
            <div class="section-title">Cost Breakdown</div>
            <div class="input-group">
              <label>Salaries & Contractors ($/mo) <span class="term-tooltip">?<span class="tooltip-text">Total monthly cost for all employee salaries and contractor payments</span></span></label>
              <input type="number" id="salaries" value="25000" min="0" max="9999999" step="1">
            </div>
            <div class="input-group">
              <label>Infrastructure & Hosting ($/mo) <span class="term-tooltip">?<span class="tooltip-text">Costs for servers, cloud services, hosting, and technical infrastructure</span></span></label>
              <input type="number" id="infrastructure" value="3000" min="0" max="9999999" step="1">
            </div>
            <div class="input-group">
              <label>Marketing & Ads ($/mo) <span class="term-tooltip">?<span class="tooltip-text">Spending on advertising, marketing campaigns, and lead generation</span></span></label>
              <input type="number" id="marketing" value="5000" min="0" max="9999999" step="1">
            </div>
            <div class="input-group">
              <label>Tools & Subscriptions ($/mo) <span class="term-tooltip">?<span class="tooltip-text">Software subscriptions, SaaS tools, and business services</span></span></label>
              <input type="number" id="tools" value="2000" min="0" max="9999999" step="1">
            </div>
            <div class="input-group">
              <label>Office & Operations ($/mo) <span class="term-tooltip">?<span class="tooltip-text">Rent, utilities, office supplies, and operational expenses</span></span></label>
              <input type="number" id="office" value="2000" min="0" max="9999999" step="1">
            </div>
            <div class="input-group">
              <label>Other Expenses ($/mo) <span class="term-tooltip">?<span class="tooltip-text">Miscellaneous business expenses not categorized above</span></span></label>
              <input type="number" id="other" value="3000" min="0" max="9999999" step="1">
            </div>
            <div class="reconciliation-note" id="reconNote" style="display: none;"></div>
          </div>

          <div class="input-section">
            <div class="section-title">Headcount Planner</div>
            <div id="hireContainer">
              <div class="hire-row" data-hire="0">
                <div class="hire-fields">
                  <input type="text" class="hire-role" value="Engineer" placeholder="Role">
                  <input type="number" class="hire-cost" value="8000" min="0" max="9999999" step="1" placeholder="Monthly Cost">
                  <input type="number" class="hire-start" value="1" min="1" max="36" step="1" placeholder="Start Month">
                </div>
                <button class="remove-hire" onclick="removeHire(this)">×</button>
              </div>
            </div>
            <button class="add-hire-btn" id="addHireBtn">+ Add Hire</button>
            <div class="hire-warning" id="hireWarning" style="display: none;"></div>
          </div>

          <div class="input-section">
            <div class="section-title">Revenue Growth</div>
            <div class="input-group">
              <label>Monthly Revenue Growth (%) <span class="term-tooltip">?<span class="tooltip-text">Expected month-over-month revenue growth rate</span></span></label>
              <input type="number" id="revenueGrowth" value="0" min="-50" max="200" step="0.1">
            </div>
            <div class="input-group">
              <label>Expected Cash Injection ($) <span class="term-tooltip">?<span class="tooltip-text">One-time cash influx from fundraising, grants, or other sources</span></span></label>
              <input type="number" id="cashInjection" value="0" min="0" max="999999999" step="1">
            </div>
            <div class="input-group">
              <label>Injection Arrives in Month # <span class="term-tooltip">?<span class="tooltip-text">Month from now when the cash injection will be received</span></span></label>
              <input type="number" id="injectionMonth" value="1" min="1" max="36" step="1">
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
            <div class="label">Monthly Net Burn <span class="term-tooltip">?<span class="tooltip-text">Net Burn: Monthly expenses minus revenue (positive = burning cash, negative = profitable)</span></span></div>
            <div class="value" id="netBurn">$30,000</div>
          </div>
          <div class="result-metric" id="runwayContainer">
            <div class="label">Runway <span class="health-badge" id="runwayBadge">Comfortable</span> <span class="term-tooltip">?<span class="tooltip-text">Runway: Number of months until cash runs out at current burn rate</span></span></div>
            <div class="value" id="runwayValue">16.7 months</div>
            <div class="sub" id="runwaySub">Runway ends: Jul 2027</div>
          </div>
        </div>

        <div class="results-row">
          <div class="result-metric">
            <div class="label">Cash at 6 months</div>
            <div class="value" id="cashAt6">$320,000</div>
          </div>
          <div class="result-metric">
            <div class="label">Cash at 12 months</div>
            <div class="value" id="cashAt12">$140,000</div>
          </div>
        </div>

        <div class="advanced-results" style="display: none;">
          <div class="results-row">
            <div class="result-metric" id="runwayHiresContainer">
              <div class="label">Runway with Hires</div>
              <div class="value" id="runwayWithHires">—</div>
            </div>
            <div class="result-metric" id="runwayGrowthContainer">
              <div class="label">Runway with Revenue Growth</div>
              <div class="value" id="runwayWithGrowth">—</div>
            </div>
          </div>
          <div class="results-row">
            <div class="result-metric" id="breakEvenContainer">
              <div class="label">Break-even Month</div>
              <div class="value" id="breakEvenMonth">Not reached</div>
            </div>
            <div class="result-metric">
              <div class="label">Total Cash Burned at Break-even</div>
              <div class="value" id="cashBurnedAtBreakEven">—</div>
            </div>
          </div>
          <div class="results-row">
            <div class="result-metric">
              <div class="label">Headcount Cost %</div>
              <div class="value" id="headcountPercent">62.5%</div>
            </div>
            <div class="result-metric" id="fundraiseTriggerContainer">
              <div class="label">Fundraise Trigger</div>
              <div class="value" id="fundraiseTrigger">Month 14</div>
            </div>
          </div>
        </div>

        <div class="feedback-line" id="feedback">Start fundraising now. Raise typically takes 3-6 months to close.</div>
      </div>
    </div>

    <div class="chart-section">
      <div class="card-label">Cash Projection</div>
      <div class="chart-container">
        <canvas id="runwayChart"></canvas>
      </div>
    </div>

    <div class="scenario-section" id="scenarioSection" style="display: none;">
      <div class="card-label">Scenario Comparison</div>
      <div class="scenario-grid">
        <div class="scenario-card">
          <div class="scenario-title">Pessimistic</div>
          <div class="scenario-metric">
            <div class="label">Runway</div>
            <div class="value" id="scenarioPessimisticRunway">—</div>
          </div>
          <div class="scenario-metric">
            <div class="label">Break-even</div>
            <div class="value" id="scenarioPessimisticBreakEven">—</div>
          </div>
          <div class="scenario-metric">
            <div class="label">Cash at 12 months</div>
            <div class="value" id="scenarioPessimisticCash12">—</div>
          </div>
        </div>
        <div class="scenario-card">
          <div class="scenario-title">Default</div>
          <div class="scenario-metric">
            <div class="label">Runway</div>
            <div class="value" id="scenarioDefaultRunway">—</div>
          </div>
          <div class="scenario-metric">
            <div class="label">Break-even</div>
            <div class="value" id="scenarioDefaultBreakEven">—</div>
          </div>
          <div class="scenario-metric">
            <div class="label">Cash at 12 months</div>
            <div class="value" id="scenarioDefaultCash12">—</div>
          </div>
        </div>
        <div class="scenario-card">
          <div class="scenario-title">Optimistic</div>
          <div class="scenario-metric">
            <div class="label">Runway</div>
            <div class="value" id="scenarioOptimisticRunway">—</div>
          </div>
          <div class="scenario-metric">
            <div class="label">Break-even</div>
            <div class="value" id="scenarioOptimisticBreakEven">—</div>
          </div>
          <div class="scenario-metric">
            <div class="label">Cash at 12 months</div>
            <div class="value" id="scenarioOptimisticCash12">—</div>
          </div>
        </div>
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
        <p><strong>Net Burn</strong> = Gross Burn − Monthly Revenue</p>
        <p><strong>Runway</strong> = Cash in Bank ÷ Net Burn</p>
        <p><strong>Break-even</strong> = First month where Revenue ≥ Gross Burn</p>
        <p><strong>Fundraise Trigger</strong> = First month where Cash ≤ (Net Burn × 3)</p>
        <p>This calculator models month-by-month cash flow with optional revenue growth and planned hires.</p>
      </div>
    </div>
  </div>
</div>

<script src="../../assets/js/jquery.min.js"></script>
<script src="../../assets/js/tools.js"></script>
<script src="script.js"></script>

<?php include '../../footer.php'; ?>
