<?php
$page_title = 'SaaS Valuation Calculator';
$page_desc  = 'Estimate your SaaS company value using ARR multiples, DCF, and comparable transactions.';
include '../../header.php';
?>
<link rel="stylesheet" href="style.css">

<div class="tool-page">
  <div class="wrap">
    <a href="/" class="back-link">← All tools</a>
    
    <div class="page-header">
      <h1>SaaS Valuation Calculator</h1>
      <p>Estimate your company's worth using multiple valuation methods.</p>
    </div>

    <div class="mode-toggle">
      <button class="mode-btn active" data-mode="simple">Simple</button>
      <button class="mode-btn" data-mode="advanced">Advanced</button>
    </div>

    <div class="tool-grid">
      <div class="card">
        <div class="card-label">Your Inputs</div>
        
        <div class="input-group">
          <label>Current ARR ($) <span class="term-tooltip">?<span class="tooltip-text">ARR: Annual Recurring Revenue - your total yearly subscription revenue</span></span></label>
          <input type="number" id="currentArr" value="1000000" min="0" max="999999999" step="1">
        </div>
        
        <div class="input-group">
          <label>ARR Growth Rate YoY (%) <span class="term-tooltip">?<span class="tooltip-text">Year-over-year growth rate of your Annual Recurring Revenue</span></span></label>
          <input type="number" id="growthRate" value="80" min="0" max="1000" step="0.1">
        </div>
        
        <div class="input-group">
          <label>Stage <span class="term-tooltip">?<span class="tooltip-text">Company funding stage used to apply appropriate valuation multiples</span></span></label>
          <select id="stage">
            <option value="preseed">Pre-seed</option>
            <option value="seed">Seed</option>
            <option value="seriesA" selected>Series A</option>
            <option value="seriesB">Series B</option>
            <option value="seriesC">Series C+</option>
            <option value="bootstrapped">Bootstrapped / Profitable</option>
          </select>
        </div>

        <div class="advanced-inputs" style="display: none;">
          <div class="input-section">
            <div class="section-title">Revenue Quality</div>
            <div class="input-group">
              <label>Current MRR ($) <span class="term-tooltip">?<span class="tooltip-text">MRR: Monthly Recurring Revenue - predictable monthly revenue</span></span></label>
              <input type="number" id="mrr" value="83333" min="0" max="9999999" step="1">
            </div>
            <div class="input-group">
              <label>Net Revenue Retention (%) <span class="term-tooltip">?<span class="tooltip-text">NRR: Revenue retained including expansion minus churn and contraction</span></span></label>
              <input type="number" id="nrr" value="110" min="0" max="200" step="0.1">
            </div>
            <div class="input-group">
              <label>Gross Margin (%) <span class="term-tooltip">?<span class="tooltip-text">Gross Margin: Percentage of revenue after deducting direct costs</span></span></label>
              <input type="number" id="grossMargin" value="75" min="0" max="100" step="0.1">
            </div>
            <div class="input-group">
              <label>% Multi-Year Contracts <span class="term-tooltip">?<span class="tooltip-text">Percentage of customers on contracts longer than 12 months</span></span></label>
              <input type="number" id="multiYear" value="40" min="0" max="100" step="1">
            </div>
            <div class="input-group">
              <label>Top Customer % of ARR <span class="term-tooltip">?<span class="tooltip-text">Revenue concentration - how much of ARR comes from your largest customer</span></span></label>
              <input type="number" id="customerConcentration" value="10" min="0" max="100" step="0.1">
            </div>
          </div>

          <div class="input-section">
            <div class="section-title">Profitability</div>
            <div class="input-group">
              <label>EBITDA Margin (%) <span class="term-tooltip">?<span class="tooltip-text">EBITDA: Earnings Before Interest, Taxes, Depreciation, and Amortization</span></span></label>
              <input type="number" id="ebitdaMargin" value="-20" min="-200" max="100" step="0.1">
            </div>
            <div class="input-group">
              <label>FCF Margin (%) <span class="term-tooltip">?<span class="tooltip-text">FCF: Free Cash Flow - cash remaining after capital expenditures</span></span></label>
              <input type="number" id="fcfMargin" value="-15" min="-200" max="100" step="0.1">
            </div>
            <div class="input-group">
              <label>Monthly Net Burn ($) <span class="term-tooltip">?<span class="tooltip-text">Net Burn: Monthly cash spent minus revenue (negative = profitable)</span></span></label>
              <input type="number" id="burn" value="80000" min="0" max="9999999" step="1">
            </div>
          </div>

          <div class="input-section">
            <div class="section-title">DCF Inputs</div>
            <div class="input-group">
              <label>Revenue Growth — Year 1 (%)</label>
              <input type="number" id="growthYr1" value="80" min="0" max="500" step="0.1">
            </div>
            <div class="input-group">
              <label>Revenue Growth — Year 2 (%)</label>
              <input type="number" id="growthYr2" value="60" min="0" max="500" step="0.1">
            </div>
            <div class="input-group">
              <label>Revenue Growth — Year 3 (%)</label>
              <input type="number" id="growthYr3" value="40" min="0" max="500" step="0.1">
            </div>
            <div class="input-group">
              <label>Terminal Growth Rate (%) <span class="term-tooltip">?<span class="tooltip-text">Terminal Growth: Long-term sustainable growth rate used in DCF valuation</span></span></label>
              <input type="number" id="terminalGrowth" value="3" min="0" max="10" step="0.1">
            </div>
            <div class="input-group">
              <label>Discount Rate (%) <span class="term-tooltip">?<span class="tooltip-text">Discount Rate: Rate used to calculate present value of future cash flows</span></span></label>
              <input type="number" id="discountRate" value="25" min="5" max="60" step="0.1">
            </div>
            <div class="input-group">
              <label>Target EBITDA Margin at Maturity (%) <span class="term-tooltip">?<span class="tooltip-text">Target profitability level when company reaches maturity</span></span></label>
              <input type="number" id="targetEbitdaMargin" value="20" min="0" max="60" step="0.1">
            </div>
          </div>

          <div class="input-section">
            <div class="section-title">Method Weighting</div>
            <div class="weight-group">
              <div class="weight-row">
                <label>ARR Multiple <span class="term-tooltip">?<span class="tooltip-text">ARR Multiple: Valuation method using revenue multiples from comparable companies</span></span></label>
                <input type="range" id="arrWeight" value="60" min="0" max="100" step="5">
                <span class="weight-value" id="arrWeightVal">60%</span>
              </div>
              <div class="weight-row">
                <label>DCF <span class="term-tooltip">?<span class="tooltip-text">DCF: Discounted Cash Flow - valuation based on projected future cash flows</span></span></label>
                <input type="range" id="dcfWeight" value="20" min="0" max="100" step="5">
                <span class="weight-value" id="dcfWeightVal">20%</span>
              </div>
              <div class="weight-row">
                <label>Comparable Transactions <span class="term-tooltip">?<span class="tooltip-text">Valuation based on recent M&A transactions in similar companies</span></span></label>
                <input type="range" id="compWeight" value="20" min="0" max="100" step="5">
                <span class="weight-value" id="compWeightVal">20%</span>
              </div>
              <div class="weight-total" id="weightTotal">Total: 100%</div>
              <div class="weight-warning" id="weightWarning" style="display: none;">Weights must sum to 100%</div>
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
        
        <div class="primary-result">
          <div class="valuation-display">
            <div class="valuation-range">
              <span class="range-low" id="valLow">$10M</span>
              <span class="range-mid" id="valMid">$15M</span>
              <span class="range-high" id="valHigh">$25M</span>
            </div>
            <div class="range-bar">
              <div class="bar-fill" id="rangeBar"></div>
              <div class="bar-dot" id="barDot"></div>
            </div>
            <div class="valuation-badge" id="valuationBadge">Strong</div>
            <div class="implied-multiple" id="impliedMultiple">Implied: 15.0x ARR</div>
          </div>
        </div>

        <div class="results-grid">
          <div class="result-metric">
            <div class="label">ARR Multiple (low)</div>
            <div class="value" id="arrMultipleLow">10x</div>
          </div>
          <div class="result-metric">
            <div class="label">ARR Multiple (mid)</div>
            <div class="value" id="arrMultipleMid">15x</div>
          </div>
          <div class="result-metric">
            <div class="label">ARR Multiple (high)</div>
            <div class="value" id="arrMultipleHigh">25x</div>
          </div>
        </div>

        <div class="advanced-results" style="display: none;">
          <div class="results-row">
            <div class="result-metric">
              <div class="label">DCF Valuation</div>
              <div class="value" id="dcfValuation">$12.5M</div>
            </div>
            <div class="result-metric">
              <div class="label">Comp Transaction Value</div>
              <div class="value" id="compValuation">$18M</div>
            </div>
          </div>
          <div class="results-row">
            <div class="result-metric">
              <div class="label">Blended Valuation</div>
              <div class="value" id="blendedValuation">$15M</div>
            </div>
            <div class="result-metric">
              <div class="label">Blended Range (±20%)</div>
              <div class="value" id="blendedRange">$12M — $18M</div>
            </div>
          </div>
          <div class="results-row">
            <div class="result-metric">
              <div class="label">Rule of 40 Score</div>
              <div class="value" id="ruleOf40">60</div>
            </div>
            <div class="result-metric">
              <div class="label">NRR Adjustment</div>
              <div class="value" id="nrrAdjustment">+1.0x</div>
            </div>
          </div>
          <div class="results-row">
            <div class="result-metric">
              <div class="label">GM Adjustment</div>
              <div class="value" id="gmAdjustment">+1.0x</div>
            </div>
            <div class="result-metric">
              <div class="label">Adjusted Multiple</div>
              <div class="value" id="adjustedMultiple">17.0x</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="warning-message" id="concentrationWarning" style="display: none;">
      High customer concentration reduces valuation. Investors will apply a discount.
    </div>
    <div class="warning-message" id="dcfWarning" style="display: none;"></div>
    <div class="warning-message" id="dcfError" style="display: none;"></div>
    <div class="warning-message" id="zeroArrWarning" style="display: none;">
      Cannot calculate — no revenue yet.
    </div>

    <div class="sensitivity-section" id="sensitivitySection" style="display: none;">
      <div class="card-label">Sensitivity Analysis</div>
      <div class="sensitivity-grid-wrapper">
        <table class="sensitivity-table" id="sensitivityTable"></table>
      </div>
    </div>

    <div class="benchmark-section" id="benchmarkSection" style="display: none;">
      <div class="card-label">Comparable Transactions</div>
      <table class="benchmark-table">
        <thead>
          <tr>
            <th>Stage</th>
            <th>Metric</th>
            <th>Multiple Range</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Seed</td><td>ARR</td><td>8–20x</td></tr>
          <tr><td>Series A</td><td>ARR</td><td>10–25x</td></tr>
          <tr><td>Series B</td><td>ARR</td><td>8–18x</td></tr>
          <tr><td>Profitable / bootstrapped</td><td>ARR</td><td>3–6x</td></tr>
          <tr><td>Strategic acquisition</td><td>ARR</td><td>4–8x</td></tr>
        </tbody>
      </table>
      <p class="benchmark-note">Based on 2023–2025 private SaaS transaction data. Multiples fluctuate with market conditions.</p>
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
        <p><strong>ARR Multiple:</strong> Valuation = ARR × Multiple based on stage and growth rate. Higher growth = higher multiple.</p>
        <p><strong>DCF:</strong> Projects 3 years of cash flows and calculates terminal value, then discounts back to present.</p>
        <p><strong>Comparable Transactions:</strong> Uses recent SaaS transaction multiples for similar companies.</p>
        <p><strong>Blended:</strong> Weighted average of all three methods for a balanced estimate.</p>
      </div>
    </div>
  </div>
</div>

<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="script.js"></script>

<?php include '../../footer.php'; ?>
