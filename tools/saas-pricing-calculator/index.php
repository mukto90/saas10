<?php
$page_title = 'SaaS Pricing Calculator';
$page_desc  = 'Find the optimal price point for your SaaS product using cost-plus, value-based, and competitive pricing methods. Get recommended price ranges.';
include '../../header.php';
?>
<link rel="stylesheet" href="../../assets/css/tools.css">
<link rel="stylesheet" href="style.css">

<div class="tool-page">
  <div class="wrap">
    <a href="/" class="back-link">← All tools</a>
    
    <div class="page-header">
      <h1>SaaS Pricing Calculator</h1>
      <p>Find the optimal price point based on costs, value, and competition.</p>
    </div>

    <div class="mode-toggle">
      <button class="mode-btn active" data-mode="simple">Simple</button>
      <button class="mode-btn" data-mode="advanced">Advanced</button>
    </div>

    <div class="tool-grid">
      <div class="card">
        <div class="card-label">Your Inputs</div>
        
        <div class="input-group">
          <label>Cost to Serve per Customer / Month ($) <span class="term-tooltip">?<span class="tooltip-text">Cost to Serve: Direct costs (infrastructure, support, etc.) per customer per month</span></span></label>
          <input type="number" id="costToServe" value="8" min="0" max="9999999" step="0.01">
        </div>
        
        <div class="input-group">
          <label>Target Gross Margin (%) <span class="term-tooltip">?<span class="tooltip-text">Gross Margin: Percentage of revenue remaining after deducting direct costs</span></span></label>
          <input type="number" id="targetMargin" value="75" min="0" max="100" step="0.1">
        </div>
        
        <div class="input-group">
          <label>Customer Acquisition Cost ($) <span class="term-tooltip">?<span class="tooltip-text">CAC: Total cost to acquire a new customer</span></span></label>
          <input type="number" id="cac" value="200" min="0" max="9999999" step="1">
        </div>
        
        <div class="input-group">
          <label>Target CAC Payback (months) <span class="term-tooltip">?<span class="tooltip-text">CAC Payback: Number of months to recover customer acquisition cost</span></span></label>
          <input type="number" id="paybackMonths" value="12" min="1" max="60" step="1">
        </div>

        <div class="advanced-inputs" style="display: none;">
          <div class="input-section">
            <div class="section-title">Full Cost Structure</div>
            <div class="input-group">
              <label>Infrastructure ($/mo/customer) <span class="term-tooltip">?<span class="tooltip-text">Server costs, cloud services, and hosting expenses per customer</span></span></label>
              <input type="number" id="infra" value="3" min="0" max="9999999" step="0.01">
            </div>
            <div class="input-group">
              <label>Support Cost ($/mo/customer) <span class="term-tooltip">?<span class="tooltip-text">Customer support costs allocated per customer per month</span></span></label>
              <input type="number" id="support" value="2" min="0" max="9999999" step="0.01">
            </div>
            <div class="input-group">
              <label>Payment Processing (%) <span class="term-tooltip">?<span class="tooltip-text">Fees charged by payment processors (e.g., Stripe, PayPal) as percentage of revenue</span></span></label>
              <input type="number" id="payment" value="2.9" min="0" max="10" step="0.01">
            </div>
            <div class="input-group">
              <label>Other Variable Cost ($/mo) <span class="term-tooltip">?<span class="tooltip-text">Additional variable costs like usage-based infrastructure or third-party APIs</span></span></label>
              <input type="number" id="otherVar" value="1" min="0" max="9999999" step="0.01">
            </div>
            <div class="input-group">
              <label>Total Monthly Fixed Costs ($) <span class="term-tooltip">?<span class="tooltip-text">Fixed costs that don't change with customer count (rent, salaries, etc.)</span></span></label>
              <input type="number" id="fixedCosts" value="15000" min="0" max="9999999" step="1">
            </div>
            <div class="input-group">
              <label>Expected Customer Count <span class="term-tooltip">?<span class="tooltip-text">Projected number of customers at this price point</span></span></label>
              <input type="number" id="expectedCustomers" value="100" min="1" max="9999999" step="1">
            </div>
          </div>

          <div class="input-section">
            <div class="section-title">Value-Based Pricing</div>
            <div class="input-group">
              <label>Monthly Value Delivered to Customer ($) <span class="term-tooltip">?<span class="tooltip-text">Estimated monetary value your product creates for customers per month</span></span></label>
              <input type="number" id="valueDelivered" value="5000" min="0" max="9999999" step="1">
            </div>
            <div class="input-group">
              <label>Value Capture Rate (%) <span class="term-tooltip">?<span class="tooltip-text">Percentage of customer value you capture in your pricing</span></span></label>
              <input type="number" id="captureRate" value="10" min="1" max="50" step="0.1">
            </div>
            <p class="note">SaaS products typically capture 5–20% of the value they deliver.</p>
          </div>

          <div class="input-section">
            <div class="section-title">Competitive Benchmarking</div>
            <div class="competitor-list" id="competitorList">
              <div class="competitor-row" data-comp="0">
                <input type="text" class="comp-name" value="Competitor A" placeholder="Name">
                <input type="number" class="comp-price" value="49" min="0" max="9999999" step="1" placeholder="Price">
                <input type="number" class="comp-features" value="80" min="0" max="200" step="1" placeholder="Features %">
                <button class="comp-remove" title="Remove">×</button>
              </div>
              <div class="competitor-row" data-comp="1">
                <input type="text" class="comp-name" value="Competitor B" placeholder="Name">
                <input type="number" class="comp-price" value="99" min="0" max="9999999" step="1" placeholder="Price">
                <input type="number" class="comp-features" value="100" min="0" max="200" step="1" placeholder="Features %">
                <button class="comp-remove" title="Remove">×</button>
              </div>
            </div>
            <button class="add-comp-btn" id="addCompBtn">+ Add Competitor</button>
          </div>

          <div class="input-section">
            <div class="section-title">Pricing Model Comparison</div>
            <div class="pricing-model-row">
              <div class="model-card">
                <div class="model-title">Flat Monthly</div>
                <div class="input-group">
                  <label>Price ($/mo)</label>
                  <input type="number" id="flatPrice" value="49" min="0" max="9999999" step="1">
                </div>
              </div>
              <div class="model-card">
                <div class="model-title">Per Seat</div>
                <div class="input-group">
                  <label>Price per seat ($)</label>
                  <input type="number" id="seatPrice" value="15" min="0" max="9999999" step="1">
                </div>
                <div class="input-group">
                  <label>Avg seats / customer</label>
                  <input type="number" id="avgSeats" value="5" min="1" max="9999" step="1">
                </div>
              </div>
              <div class="model-card">
                <div class="model-title">Usage-Based</div>
                <div class="input-group">
                  <label>Price per unit ($)</label>
                  <input type="number" id="unitPrice" value="0.05" min="0" max="9999999" step="0.01">
                </div>
                <div class="input-group">
                  <label>Avg units / customer / mo</label>
                  <input type="number" id="avgUnits" value="1500" min="1" max="9999999" step="1">
                </div>
              </div>
              <div class="model-card">
                <div class="model-title">Tiered</div>
                <div class="input-group">
                  <label>Starter ($/mo)</label>
                  <input type="number" id="tierStarter" value="29" min="0" max="9999999" step="1">
                </div>
                <div class="input-group">
                  <label>Starter %</label>
                  <input type="number" id="tierStarterPct" value="60" min="0" max="100" step="1">
                </div>
                <div class="input-group">
                  <label>Growth ($/mo)</label>
                  <input type="number" id="tierGrowth" value="99" min="0" max="9999999" step="1">
                </div>
                <div class="input-group">
                  <label>Growth %</label>
                  <input type="number" id="tierGrowthPct" value="30" min="0" max="100" step="1">
                </div>
                <div class="input-group">
                  <label>Enterprise ($/mo)</label>
                  <input type="number" id="tierEnterprise" value="299" min="0" max="9999999" step="1">
                </div>
                <div class="input-group">
                  <label>Enterprise %</label>
                  <input type="number" id="tierEnterprisePct" value="10" min="0" max="100" step="1">
                </div>
              </div>
            </div>
            <div class="tier-warning" id="tierWarning" style="display: none;">Tier mix must equal 100% (currently <span id="tierSum">0</span>%)</div>
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
        
        <div class="primary-result">
          <div class="price-display">
            <div class="price-range">
              <span class="range-low" id="priceLow">$12</span>
              <span class="range-mid" id="priceMid">$20</span>
              <span class="range-high" id="priceHigh">$40</span>
            </div>
            <div class="price-label">Recommended Price Range</div>
            <div class="price-badge" id="priceBadge">Healthy</div>
          </div>
        </div>

        <div class="results-grid">
          <div class="result-metric">
            <div class="label">Minimum Viable Price</div>
            <div class="value" id="minViablePrice">$32</div>
          </div>
          <div class="result-metric">
            <div class="label">CAC Recovery Price</div>
            <div class="value" id="cacRecoveryPrice">$17</div>
          </div>
          <div class="result-metric">
            <div class="label">Price Floor</div>
            <div class="value" id="priceFloor">$32</div>
          </div>
          <div class="result-metric">
            <div class="label">CAC Payback</div>
            <div class="value" id="cacPayback">12.0 mo</div>
          </div>
        </div>

        <div class="advanced-results" style="display: none;">
          <div class="method-cards">
            <div class="method-card" id="costPlusCard">
              <div class="method-title">Cost-Plus</div>
              <div class="method-price" id="costPlusPrice">$32</div>
              <div class="method-gm" id="costPlusGm">75%</div>
              <div class="method-payback" id="costPlusPayback">12 mo</div>
            </div>
            <div class="method-card" id="valueBasedCard">
              <div class="method-title">Value-Based</div>
              <div class="method-price" id="valueBasedPrice">$500</div>
              <div class="method-gm" id="valueBasedGm">99%</div>
              <div class="method-payback" id="valueBasedPayback">0.4 mo</div>
            </div>
            <div class="method-card" id="competitiveCard">
              <div class="method-title">Competitive</div>
              <div class="method-price" id="competitivePrice">$74</div>
              <div class="method-gm" id="competitiveGm">89%</div>
              <div class="method-payback" id="competitivePayback">2.7 mo</div>
            </div>
            <div class="method-card blended" id="blendedCard">
              <div class="method-title">Blended</div>
              <div class="method-price" id="blendedPrice">$201</div>
              <div class="method-gm" id="blendedGm">84%</div>
              <div class="method-payback" id="blendedPayback">1.0 mo</div>
            </div>
          </div>

          <div class="results-row">
            <div class="result-metric">
              <div class="label">MRR at Price</div>
              <div class="value" id="mrrAtPrice">$2,000</div>
            </div>
            <div class="result-metric">
              <div class="label">ARR at Price</div>
              <div class="value" id="arrAtPrice">$24,000</div>
            </div>
          </div>
          <div class="results-row">
            <div class="result-metric">
              <div class="label">LTV</div>
              <div class="value" id="ltv">$2,400</div>
            </div>
            <div class="result-metric">
              <div class="label">LTV:CAC</div>
              <div class="value" id="ltvCac">12.0x</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="warning-message" id="warningMessage" style="display: none;"></div>
    <div class="warning-message error" id="errorMessage" style="display: none;"></div>

    <div class="chart-section" id="sensitivitySection">
      <div class="card-label">Price Sensitivity</div>
      <div class="chart-container">
        <canvas id="sensitivityChart"></canvas>
      </div>
    </div>

    <div class="model-chart-section" id="modelChartSection" style="display: none;">
      <div class="card-label">Pricing Model Comparison</div>
      <div class="model-chart-container" id="modelChartContainer"></div>
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
        <p><strong>Minimum Viable Price</strong> = Cost to Serve ÷ (1 − Target Margin)</p>
        <p><strong>CAC Recovery Price</strong> = CAC ÷ Payback Months</p>
        <p><strong>Price Floor</strong> = Max(MVP, CAC Recovery)</p>
        <p><strong>Recommended Range</strong> = Floor × 1.2 to Floor × 2.0</p>
        <p><strong>Value-Based Price</strong> = Value Delivered × Capture Rate</p>
        <p><strong>Competitive Fair Price</strong> = Competitor Price ÷ Feature Score Ratio</p>
      </div>
    </div>
  </div>
</div>

<script src="../../assets/js/jquery.min.js"></script>
<script src="../../assets/js/tools.js"></script>
<script src="script.js"></script>

<?php include '../../footer.php'; ?>
