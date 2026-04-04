<?php
$page_title = 'Rule of 40 Calculator';
$page_desc  = 'Measure the balance between growth and profitability for your SaaS business. Score above 40 signals a healthy company.';
include '../../header.php';
?>
<link rel="stylesheet" href="../../assets/css/tools.css">
<link rel="stylesheet" href="style.css">

<div class="tool-page">
  <div class="wrap">
    <a href="/" class="back-link">← All tools</a>
    
    <div class="page-header">
      <h1>Rule of 40 Calculator</h1>
      <p>Measure the balance between growth and profitability — the key SaaS health metric.</p>
    </div>

    <div class="mode-toggle">
      <button class="mode-btn active" data-mode="simple">Simple</button>
      <button class="mode-btn" data-mode="advanced">Advanced</button>
    </div>

    <div class="tool-grid">
      <div class="card">
        <div class="card-label">Your Inputs</div>
        
        <div class="input-group">
          <label>ARR Growth Rate YoY (%) <span class="term-tooltip">?<span class="tooltip-text">Year-over-year growth rate of Annual Recurring Revenue</span></span></label>
          <input type="number" id="growthRate" value="80" min="-100" max="1000" step="0.1">
        </div>
        
        <div class="input-group">
          <label>Profit Margin (%) <span class="term-tooltip">?<span class="tooltip-text">Profit Margin: Percentage of revenue remaining as profit (can be negative)</span></span></label>
          <input type="number" id="profitMargin" value="-20" min="-200" max="100" step="0.1">
        </div>
        
        <div class="input-group">
          <label>Margin Type <span class="term-tooltip">?<span class="tooltip-text">Type of profit margin calculation (EBITDA, FCF, Net, or Operating)</span></span></label>
          <select id="marginType">
            <option value="EBITDA" selected>EBITDA Margin</option>
            <option value="FCF">Free Cash Flow Margin</option>
            <option value="Net">Net Profit Margin</option>
            <option value="Operating">Operating Margin</option>
          </select>
        </div>

        <div class="advanced-inputs" style="display: none;">
          <div class="input-section">
            <div class="section-title">ARR Inputs</div>
            <div class="input-group">
              <label>ARR — 12 Months Ago ($) <span class="term-tooltip">?<span class="tooltip-text">Your ARR from 12 months ago for calculating growth rate</span></span></label>
              <input type="number" id="arrPrev" value="1000000" min="0" max="999999999" step="1">
            </div>
            <div class="input-group">
              <label>Current ARR ($) <span class="term-tooltip">?<span class="tooltip-text">ARR: Annual Recurring Revenue - your total yearly subscription revenue</span></span></label>
              <input type="number" id="arrCurrent" value="1800000" min="0" max="999999999" step="1">
            </div>
          </div>

          <div class="input-section">
            <div class="section-title">P&L — TTM</div>
            <div class="input-group">
              <label>Total Revenue — TTM ($) <span class="term-tooltip">?<span class="tooltip-text">TTM: Trailing Twelve Months - total revenue over the last 12 months</span></span></label>
              <input type="number" id="totalRevenue" value="1500000" min="0" max="999999999" step="1">
            </div>
            <div class="input-group">
              <label>COGS ($) <span class="term-tooltip">?<span class="tooltip-text">COGS: Cost of Goods Sold - direct costs of producing your product</span></span></label>
              <input type="number" id="cogs" value="300000" min="0" max="999999999" step="1">
            </div>
            <div class="input-group">
              <label>Sales & Marketing ($) <span class="term-tooltip">?<span class="tooltip-text">S&M expenses - costs of sales team and marketing activities</span></span></label>
              <input type="number" id="salesMarketing" value="450000" min="0" max="999999999" step="1">
            </div>
            <div class="input-group">
              <label>R&D / Engineering ($) <span class="term-tooltip">?<span class="tooltip-text">R&D: Research and Development - costs of building and improving your product</span></span></label>
              <input type="number" id="rd" value="400000" min="0" max="999999999" step="1">
            </div>
            <div class="input-group">
              <label>General & Administrative ($) <span class="term-tooltip">?<span class="tooltip-text">G&A: Overhead costs not directly tied to product or sales</span></span></label>
              <input type="number" id="ga" value="200000" min="0" max="999999999" step="1">
            </div>
          </div>

          <div class="input-section">
            <div class="section-title">Trailing Quarters</div>
            <div class="quarters-grid">
              <div class="quarter-col">
                <div class="quarter-label">Q1</div>
                <div class="input-group">
                  <label>Growth (%)</label>
                  <input type="number" class="q-growth" id="q1Growth" value="90" min="-100" max="1000" step="0.1">
                </div>
                <div class="input-group">
                  <label>Margin (%)</label>
                  <input type="number" class="q-margin" id="q1Margin" value="-15" min="-200" max="100" step="0.1">
                </div>
              </div>
              <div class="quarter-col">
                <div class="quarter-label">Q2</div>
                <div class="input-group">
                  <label>Growth (%)</label>
                  <input type="number" class="q-growth" id="q2Growth" value="85" min="-100" max="1000" step="0.1">
                </div>
                <div class="input-group">
                  <label>Margin (%)</label>
                  <input type="number" class="q-margin" id="q2Margin" value="-18" min="-200" max="100" step="0.1">
                </div>
              </div>
              <div class="quarter-col">
                <div class="quarter-label">Q3</div>
                <div class="input-group">
                  <label>Growth (%)</label>
                  <input type="number" class="q-growth" id="q3Growth" value="80" min="-100" max="1000" step="0.1">
                </div>
                <div class="input-group">
                  <label>Margin (%)</label>
                  <input type="number" class="q-margin" id="q3Margin" value="-20" min="-200" max="100" step="0.1">
                </div>
              </div>
              <div class="quarter-col">
                <div class="quarter-label">Q4</div>
                <div class="input-group">
                  <label>Growth (%)</label>
                  <input type="number" class="q-growth" id="q4Growth" value="80" min="-100" max="1000" step="0.1">
                </div>
                <div class="input-group">
                  <label>Margin (%)</label>
                  <input type="number" class="q-margin" id="q4Margin" value="-20" min="-200" max="100" step="0.1">
                </div>
              </div>
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
          <div class="score-display">
            <div class="score-value" id="ruleOf40Score">60</div>
            <div class="score-label">Rule of 40 Score</div>
            <div class="score-badge" id="scoreBadge">Healthy</div>
          </div>
          <div class="score-message" id="scoreMessage">Healthy. You meet or exceed the Rule of 40 benchmark investors expect.</div>
        </div>

        <div class="results-grid">
          <div class="result-metric">
            <div class="label">Growth Rate</div>
            <div class="value" id="growthRateDisplay">80.0%</div>
          </div>
          <div class="result-metric">
            <div class="label">Profit Margin</div>
            <div class="value" id="profitMarginDisplay">-20.0%</div>
          </div>
          <div class="result-metric" id="vsThresholdContainer">
            <div class="label">vs 40 Threshold</div>
            <div class="value" id="vsThreshold">+20 above</div>
          </div>
        </div>

        <div class="advanced-results" style="display: none;">
          <div class="results-row">
            <div class="result-metric">
              <div class="label">Gross Margin</div>
              <div class="value" id="grossMargin">80.0%</div>
            </div>
            <div class="result-metric">
              <div class="label">EBITDA</div>
              <div class="value" id="ebitda">$150,000</div>
            </div>
          </div>
          <div class="results-row">
            <div class="result-metric">
              <div class="label">EBITDA Margin</div>
              <div class="value" id="ebitdaMargin">10.0%</div>
            </div>
            <div class="result-metric">
              <div class="label">ARR Growth (calc'd)</div>
              <div class="value" id="arrGrowthCalc">80.0%</div>
            </div>
          </div>
          <div class="results-row">
            <div class="result-metric">
              <div class="label">Trailing Avg Ro40</div>
              <div class="value" id="trailingAvg">70</div>
            </div>
            <div class="result-metric">
              <div class="label">Trend Direction</div>
              <div class="value" id="trendDirection">Declining</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="chart-section" id="trendSection" style="display: none;">
      <div class="card-label">4-Quarter Trend</div>
      <div class="chart-container">
        <canvas id="trendChart"></canvas>
      </div>
    </div>

    <div class="benchmark-section" id="benchmarkSection" style="display: none;">
      <div class="card-label">Public SaaS Benchmarks</div>
      <table class="benchmark-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Growth Rate</th>
            <th>Margin</th>
            <th>Rule of 40</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Snowflake</td><td>36%</td><td>4%</td><td>40</td></tr>
          <tr><td>Cloudflare</td><td>28%</td><td>12%</td><td>40</td></tr>
          <tr><td>HubSpot</td><td>23%</td><td>18%</td><td>41</td></tr>
          <tr><td>Datadog</td><td>27%</td><td>22%</td><td>49</td></tr>
          <tr><td>Monday.com</td><td>34%</td><td>6%</td><td>40</td></tr>
          <tr class="user-row" id="userBenchmarkRow"><td>Your Company</td><td id="userGrowth">—</td><td id="userMargin">—</td><td id="userScore">—</td></tr>
        </tbody>
      </table>
      <p class="benchmark-note">Based on publicly reported TTM figures. For reference only.</p>
    </div>

    <div class="warning-message" id="warningMessage" style="display: none;"></div>

    <div class="share-section">
      <button class="btn-ghost" id="copyResults">Copy Results</button>
      <button class="btn-ghost" id="shareLink">Share Link</button>
    </div>

    <div class="explanation">
      <button class="explanation-toggle" onclick="toggleExplanation()">
        <span class="arrow">▶</span> How is this calculated?
      </button>
      <div class="explanation-content" id="explanationContent">
        <p><strong>Rule of 40 Score</strong> = ARR Growth Rate (%) + Profit Margin (%)</p>
        <p>A score above 40 indicates a healthy balance of growth and profitability. Below 40 signals the company is either growing too slowly or burning too much.</p>
        <p><strong>Example:</strong> 80% growth + (−20%) margin = Score of 60 ✓</p>
        <p><strong>Example:</strong> 20% growth + 15% margin = Score of 35 ✗</p>
      </div>
    </div>
  </div>
</div>

<script src="../../assets/js/jquery.min.js"></script>
<script src="../../assets/js/tools.js"></script>
<script src="script.js"></script>

<?php include '../../footer.php'; ?>
