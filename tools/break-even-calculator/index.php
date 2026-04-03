<?php
$page_title = 'Break-Even Calculator';
$page_desc  = 'Calculate how many customers you need to cover all costs.';
include '../../header.php';
?>
<link rel="stylesheet" href="style.css">

<div class="tool-page">
  <div class="wrap">
    <a href="/" class="back-link">← All tools</a>
    
    <div class="page-header">
      <h1>Break-Even Calculator</h1>
      <p>Calculate how many customers you need to cover all costs.</p>
    </div>

    <div class="mode-toggle">
      <button class="mode-btn active" data-mode="simple">Simple</button>
      <button class="mode-btn" data-mode="advanced">Advanced</button>
    </div>

    <div class="tool-grid">
      <div class="card">
        <div class="card-label">Your Inputs</div>
        
        <div class="input-group">
          <label>Monthly Fixed Costs ($) <span class="term-tooltip">?<span class="tooltip-text">Fixed Costs: Expenses that don't change with customer count (rent, salaries, etc.)</span></span></label>
          <input type="number" id="fixedCosts" value="10000" min="0" max="9999999" step="1">
        </div>
        
        <div class="input-group">
          <label>Variable Cost per Customer ($) <span class="term-tooltip">?<span class="tooltip-text">Variable Cost: Costs that scale with each additional customer</span></span></label>
          <input type="number" id="variableCost" value="5" min="0" max="9999999" step="0.01">
        </div>
        
        <div class="input-group">
          <label>Price per Customer / Month ($) <span class="term-tooltip">?<span class="tooltip-text">Price you charge each customer per month</span></span></label>
          <input type="number" id="pricePerCustomer" value="49" min="0" max="9999999" step="0.01">
        </div>

        <div class="input-group">
          <label>Current Number of Customers <span class="term-tooltip">?<span class="tooltip-text">Your existing customer count for current state calculations</span></span></label>
          <input type="number" id="currentCustomers" value="50" min="0" max="9999999" step="1">
        </div>

        <div class="advanced-inputs" style="display: none;">
          <div class="input-section">
            <div class="section-title">Fixed Cost Breakdown</div>
            <div class="input-group">
              <label>Salaries ($/mo) <span class="term-tooltip">?<span class="tooltip-text">Total monthly employee salary costs</span></span></label>
              <input type="number" id="salaries" value="7000" min="0" max="9999999" step="1">
            </div>
            <div class="input-group">
              <label>Infrastructure ($/mo) <span class="term-tooltip">?<span class="tooltip-text">Server, hosting, and technology infrastructure costs</span></span></label>
              <input type="number" id="infrastructure" value="1000" min="0" max="9999999" step="1">
            </div>
            <div class="input-group">
              <label>Marketing ($/mo) <span class="term-tooltip">?<span class="tooltip-text">Monthly marketing and advertising spend</span></span></label>
              <input type="number" id="marketing" value="1000" min="0" max="9999999" step="1">
            </div>
            <div class="input-group">
              <label>Other Fixed Costs ($/mo) <span class="term-tooltip">?<span class="tooltip-text">Miscellaneous fixed operating expenses</span></span></label>
              <input type="number" id="otherFixed" value="1000" min="0" max="9999999" step="1">
            </div>
            <div class="reconciliation-note" id="fixedReconNote" style="display: none;"></div>
          </div>

          <div class="input-section">
            <div class="section-title">Variable Cost Breakdown</div>
            <div class="input-group">
              <label>Payment Processing (% of revenue) <span class="term-tooltip">?<span class="tooltip-text">Fees charged by payment processors (Stripe, PayPal, etc.)</span></span></label>
              <input type="number" id="paymentProcessing" value="2.9" min="0" max="100" step="0.01">
            </div>
            <div class="input-group">
              <label>Support Cost per Customer ($/mo)</label>
              <input type="number" id="supportCost" value="2" min="0" max="9999999" step="0.01">
            </div>
            <div class="input-group">
              <label>Infra Cost per Customer ($/mo)</label>
              <input type="number" id="infraCost" value="1" min="0" max="9999999" step="0.01">
            </div>
            <div class="input-group">
              <label>Other Variable Cost ($/mo)</label>
              <input type="number" id="otherVariable" value="0" min="0" max="9999999" step="0.01">
            </div>
          </div>

          <div class="input-section">
            <div class="section-title">Target Profit</div>
            <div class="input-group">
              <label>Target Monthly Profit ($)</label>
              <input type="number" id="targetProfit" value="0" min="0" max="9999999" step="1">
            </div>
          </div>

          <div class="input-section">
            <div class="section-title">Pricing Tiers</div>
            <div id="tierContainer">
              <div class="tier-row" data-tier="0">
                <div class="tier-fields">
                  <input type="text" class="tier-name" value="Starter" placeholder="Tier Name">
                  <input type="number" class="tier-price" value="29" min="0" max="9999999" step="0.01" placeholder="Price/Mo">
                  <input type="number" class="tier-var" value="3" min="0" max="9999999" step="0.01" placeholder="Variable Cost">
                  <input type="number" class="tier-mix" value="60" min="0" max="100" step="1" placeholder="Mix %">
                </div>
                <button class="remove-tier" onclick="removeTier(this)">×</button>
              </div>
              <div class="tier-row" data-tier="1">
                <div class="tier-fields">
                  <input type="text" class="tier-name" value="Pro" placeholder="Tier Name">
                  <input type="number" class="tier-price" value="99" min="0" max="9999999" step="0.01" placeholder="Price/Mo">
                  <input type="number" class="tier-var" value="8" min="0" max="9999999" step="0.01" placeholder="Variable Cost">
                  <input type="number" class="tier-mix" value="30" min="0" max="100" step="1" placeholder="Mix %">
                </div>
                <button class="remove-tier" onclick="removeTier(this)">×</button>
              </div>
              <div class="tier-row" data-tier="2">
                <div class="tier-fields">
                  <input type="text" class="tier-name" value="Enterprise" placeholder="Tier Name">
                  <input type="number" class="tier-price" value="299" min="0" max="9999999" step="0.01" placeholder="Price/Mo">
                  <input type="number" class="tier-var" value="20" min="0" max="9999999" step="0.01" placeholder="Variable Cost">
                  <input type="number" class="tier-mix" value="10" min="0" max="100" step="1" placeholder="Mix %">
                </div>
                <button class="remove-tier" onclick="removeTier(this)">×</button>
              </div>
            </div>
            <div class="tier-mix-warning" id="tierMixWarning" style="display: none;"></div>
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
            <div class="label">Contribution Margin / Customer</div>
            <div class="value" id="contributionMargin">$44.00</div>
          </div>
          <div class="result-metric">
            <div class="label">Contribution Margin Ratio</div>
            <div class="value" id="cmRatio">89.8%</div>
            <div class="sub" id="cmInterpretation">Excellent margins. Typical for pure-software SaaS.</div>
          </div>
        </div>

        <div class="results-row">
          <div class="result-metric" id="beContainer">
            <div class="label">Break-Even Customers <span class="health-badge" id="beBadge">Growing</span></div>
            <div class="value" id="breakEvenCustomers">228</div>
          </div>
          <div class="result-metric">
            <div class="label">Break-Even Revenue</div>
            <div class="value" id="breakEvenRevenue">$11,172</div>
          </div>
        </div>

        <div class="results-row">
          <div class="result-metric">
            <div class="label">Current Profit / Loss</div>
            <div class="value" id="currentProfit">$1,200</div>
          </div>
          <div class="result-metric" id="safetyContainer">
            <div class="label">Safety Margin</div>
            <div class="value" id="safetyMargin">-356.0%</div>
          </div>
        </div>

        <div class="advanced-results" style="display: none;">
          <div class="results-row">
            <div class="result-metric" id="targetContainer" style="display: none;">
              <div class="label">Customers for Target Profit</div>
              <div class="value" id="targetCustomers">—</div>
            </div>
            <div class="result-metric" id="targetRevenueContainer" style="display: none;">
              <div class="label">Revenue for Target Profit</div>
              <div class="value" id="targetRevenue">—</div>
            </div>
          </div>
          <div class="results-row">
            <div class="result-metric">
              <div class="label">Blended Contribution Margin</div>
              <div class="value" id="blendedCM">$44.00</div>
            </div>
            <div class="result-metric">
              <div class="label">Blended Price</div>
              <div class="value" id="blendedPrice">$49.00</div>
            </div>
          </div>
          <div class="results-row">
            <div class="result-metric">
              <div class="label">Operating Leverage</div>
              <div class="value" id="operatingLeverage">0.99</div>
            </div>
            <div class="result-metric">
              <div class="label">Gross Margin %</div>
              <div class="value" id="grossMargin">89.8%</div>
            </div>
          </div>
        </div>

        <div class="feedback-line" id="feedback">You need 228 customers to cover all costs.</div>
      </div>
    </div>

    <div class="chart-section">
      <div class="card-label">Break-Even Chart</div>
      <div class="chart-container">
        <canvas id="breakEvenChart"></canvas>
      </div>
    </div>

    <div class="scenario-section" id="scenarioSection" style="display: none;">
      <div class="card-label">Scenario Comparison</div>
      <div class="scenario-grid">
        <div class="scenario-card">
          <div class="scenario-title">Current Pricing</div>
          <div class="scenario-metric">
            <div class="label">Break-Even</div>
            <div class="value" id="scenarioCurrentBE">—</div>
          </div>
          <div class="scenario-metric">
            <div class="label">CM %</div>
            <div class="value" id="scenarioCurrentCM">—</div>
          </div>
          <div class="scenario-metric">
            <div class="label">Profit</div>
            <div class="value" id="scenarioCurrentProfit">—</div>
          </div>
        </div>
        <div class="scenario-card">
          <div class="scenario-title">+20% Price</div>
          <div class="scenario-metric">
            <div class="label">Break-Even</div>
            <div class="value" id="scenarioPriceBE">—</div>
          </div>
          <div class="scenario-metric">
            <div class="label">CM %</div>
            <div class="value" id="scenarioPriceCM">—</div>
          </div>
          <div class="scenario-metric">
            <div class="label">Profit</div>
            <div class="value" id="scenarioPriceProfit">—</div>
          </div>
        </div>
        <div class="scenario-card">
          <div class="scenario-title">-20% Variable Cost</div>
          <div class="scenario-metric">
            <div class="label">Break-Even</div>
            <div class="value" id="scenarioVarBE">—</div>
          </div>
          <div class="scenario-metric">
            <div class="label">CM %</div>
            <div class="value" id="scenarioVarCM">—</div>
          </div>
          <div class="scenario-metric">
            <div class="label">Profit</div>
            <div class="value" id="scenarioVarProfit">—</div>
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
        <p><strong>Contribution Margin</strong> = Price per Customer − Variable Cost per Customer</p>
        <p><strong>Break-Even Customers</strong> = CEIL(Fixed Costs ÷ Contribution Margin)</p>
        <p><strong>Break-Even Revenue</strong> = Break-Even Customers × Price</p>
        <p><strong>Safety Margin</strong> = ((Current Customers − Break-Even) ÷ Current Customers) × 100</p>
        <p>When contribution margin is negative, break-even is impossible — you lose money on every customer.</p>
      </div>
    </div>
  </div>
</div>

<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="script.js"></script>

<?php include '../../footer.php'; ?>
