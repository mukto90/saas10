<?php
$page_title = 'LTV:CAC Ratio Calculator';
$page_desc  = 'Calculate your LTV:CAC ratio to determine if customer acquisition is sustainable.';
include '../../header.php';
?>
<link rel="stylesheet" href="style.css">

<div class="tool-page">
  <div class="wrap">
    <a href="/" class="back-link">← All tools</a>
    
    <div class="page-header">
      <h1>LTV:CAC Ratio Calculator</h1>
      <p>Find out if your customer acquisition cost is sustainable for the long run.</p>
    </div>

    <div class="mode-toggle">
      <button class="mode-btn active" data-mode="simple">Simple</button>
      <button class="mode-btn" data-mode="advanced">Advanced</button>
    </div>

    <div class="tool-grid">
      <div class="card">
        <div class="card-label">Your Inputs</div>
        
        <div class="input-section">
          <div class="section-title">Core Metrics</div>
          <div class="input-group">
            <label>Monthly ARPU ($)</label>
            <input type="number" id="arpu" value="99" min="0" max="9999999" step="0.01">
          </div>
          <div class="input-group">
            <label>Gross Margin (%)</label>
            <input type="number" id="grossMargin" value="80" min="0" max="100" step="0.1">
          </div>
          <div class="input-group">
            <label>Monthly Churn Rate (%)</label>
            <input type="number" id="churnRate" value="2" min="0" max="100" step="0.01">
          </div>
          <div class="input-group">
            <label>CAC ($)</label>
            <input type="number" id="cac" value="500" min="0" max="9999999" step="1">
          </div>
        </div>

        <div class="advanced-inputs" style="display: none;">
          <div class="input-section">
            <div class="section-title">Revenue Adjustments</div>
            <div class="input-group">
              <label>Expansion MRR per Customer ($)</label>
              <input type="number" id="expansionMrr" value="0" min="0" max="9999999" step="0.01">
            </div>
            <div class="input-group">
              <label>Monthly Support Cost per Customer ($)</label>
              <input type="number" id="supportCost" value="0" min="0" max="9999999" step="0.01">
            </div>
          </div>

          <div class="input-section">
            <div class="section-title">LTV Discounting</div>
            <div class="input-group">
              <label>Discount Rate (%) — your cost of capital</label>
              <input type="number" id="discountRate" value="0" min="0" max="30" step="0.1">
            </div>
          </div>

          <div class="input-section">
            <div class="section-title">CAC by Channel</div>
            <div id="channelsContainer">
              <div class="channel-header">
                <span></span>
                <span>Channel Name</span>
                <span>Monthly Spend ($)</span>
                <span>Customers / Month</span>
                <span></span>
              </div>
              <div class="channel-row" data-channel="1">
                <div class="channel-color" style="background: #c8f060;"></div>
                <input type="text" class="channel-name" value="Paid Search" placeholder="Channel Name">
                <input type="number" class="channel-spend" value="1000" min="0" max="9999999" step="1">
                <input type="number" class="channel-customers" value="2" min="0" max="9999999" step="1">
                <button class="channel-remove" title="Remove channel">×</button>
              </div>
            </div>
            <button class="add-channel-btn" id="addChannelBtn">+ Add Channel</button>
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
            <div class="label">Customer Lifetime</div>
            <div class="value" id="customerLifetime">50.0 months</div>
          </div>
          <div class="result-metric">
            <div class="label">LTV</div>
            <div class="value" id="ltv">$3,960</div>
          </div>
          <div class="result-metric">
            <div class="label">CAC</div>
            <div class="value" id="cacResult">$500</div>
          </div>
          <div class="result-metric" id="ratioContainer">
            <div class="label">LTV:CAC Ratio <span class="health-badge" id="ratioBadge">Healthy</span></div>
            <div class="value" id="ratio">7.9</div>
          </div>
        </div>

        <div class="results-row">
          <div class="result-metric" id="paybackContainer">
            <div class="label">CAC Payback Period</div>
            <div class="value" id="payback">6.3 months</div>
            <div class="sub" id="paybackNote">Healthy payback window for most SaaS businesses.</div>
          </div>
          <div class="result-metric">
            <div class="label">Monthly Gross Profit</div>
            <div class="value" id="grossProfit">$79.20</div>
          </div>
        </div>

        <div class="advanced-results" style="display: none;">
          <div class="results-row">
            <div class="result-metric">
              <div class="label">Adjusted LTV</div>
              <div class="value" id="adjustedLtv">$3,960</div>
            </div>
            <div class="result-metric">
              <div class="label">Discounted LTV</div>
              <div class="value" id="discountedLtv">$3,960</div>
            </div>
          </div>
          <div class="results-row">
            <div class="result-metric">
              <div class="label">LTV:CAC (Discounted)</div>
              <div class="value" id="ratioDiscounted">7.9</div>
            </div>
            <div class="result-metric">
              <div class="label">Annual LTV</div>
              <div class="value" id="annualLtv">$47,520</div>
            </div>
          </div>

          <div class="channel-breakdown-section">
            <div class="section-tag">// channel breakdown</div>
            <div class="channel-bars" id="channelBars"></div>
            <div class="channel-summary" id="channelSummary"></div>
          </div>
        </div>

        <div class="warning-message" id="warningMessage" style="display: none;"></div>
        <div class="info-message" id="infoMessage" style="display: none;"></div>
      </div>
    </div>

    <div class="chart-section">
      <div class="card-label">36-Month LTV vs CAC Projection</div>
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
        <p><strong>Customer Lifetime</strong> = 1 ÷ (Monthly Churn Rate / 100)</p>
        <p><strong>LTV</strong> = (ARPU × Gross Margin / 100) ÷ (Monthly Churn Rate / 100)</p>
        <p><strong>LTV (with adjustments)</strong> = ((ARPU + Expansion MRR − Support Cost) × Gross Margin / 100) ÷ (Monthly Churn Rate / 100)</p>
        <p><strong>Discounted LTV</strong> = Σ [ Net Monthly Margin ÷ (1 + Monthly Discount Rate)^n ] for n = 1 to Lifetime</p>
        <p><strong>CAC Payback Period</strong> = CAC ÷ (ARPU × Gross Margin / 100)</p>
        <p><strong>Blended CAC</strong> = Total Channel Spend ÷ Total Customers Acquired</p>
        <p><strong>LTV:CAC Ratio</strong> = LTV ÷ CAC</p>
      </div>
    </div>
  </div>
</div>

<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="script.js"></script>

<?php include '../../footer.php'; ?>