<?php
$page_title = 'Revenue Per Employee Calculator';
$page_desc  = 'Measure team efficiency and benchmark against top SaaS companies.';
include '../../header.php';
?>
<link rel="stylesheet" href="../../assets/css/tools.css">
<link rel="stylesheet" href="style.css">

<div class="tool-page">
  <div class="wrap">
    <a href="/" class="back-link">← All tools</a>
    
    <div class="page-header">
      <h1>Revenue Per Employee Calculator</h1>
      <p>Measure team efficiency — one of the most telling signals of SaaS health.</p>
    </div>

    <div class="mode-toggle">
      <button class="mode-btn active" data-mode="simple">Simple</button>
      <button class="mode-btn" data-mode="advanced">Advanced</button>
    </div>

    <div class="tool-grid">
      <div class="card">
        <div class="card-label">Your Inputs</div>
        
        <div class="input-group">
          <label>Current ARR ($)</label>
          <input type="number" id="arr" value="2000000" min="0" max="999999999" step="1">
        </div>
        
        <div class="input-group">
          <label>Total Employees (FTEs)</label>
          <input type="number" id="employees" value="15" min="1" max="9999" step="1">
        </div>
        
        <div class="input-group toggle-group">
          <label class="toggle-label">
            <input type="checkbox" id="includeContractors">
            <span class="toggle-switch"></span>
            Include Contractors
          </label>
        </div>
        
        <div class="input-group contractor-input" style="display: none;">
          <label>Contractors (FTE Equivalent)</label>
          <input type="number" id="contractors" value="0" min="0" max="9999" step="0.1">
        </div>

        <div class="advanced-inputs" style="display: none;">
          <div class="input-section">
            <div class="section-title">Department Breakdown</div>
            <div class="dept-section" id="deptSection">
              <div class="dept-row" data-dept="0">
                <input type="text" class="dept-name" value="Engineering" placeholder="Department">
                <input type="number" class="dept-headcount" value="5" min="0" max="9999" step="1" placeholder="HC">
                <input type="number" class="dept-cost" value="600000" min="0" max="999999999" step="1" placeholder="Cost ($)">
                <button class="dept-remove" title="Remove">×</button>
              </div>
              <div class="dept-row" data-dept="1">
                <input type="text" class="dept-name" value="Sales" placeholder="Department">
                <input type="number" class="dept-headcount" value="4" min="0" max="9999" step="1" placeholder="HC">
                <input type="number" class="dept-cost" value="400000" min="0" max="999999999" step="1" placeholder="Cost ($)">
                <button class="dept-remove" title="Remove">×</button>
              </div>
              <div class="dept-row" data-dept="2">
                <input type="text" class="dept-name" value="Marketing" placeholder="Department">
                <input type="number" class="dept-headcount" value="3" min="0" max="9999" step="1" placeholder="HC">
                <input type="number" class="dept-cost" value="300000" min="0" max="999999999" step="1" placeholder="Cost ($)">
                <button class="dept-remove" title="Remove">×</button>
              </div>
              <div class="dept-row" data-dept="3">
                <input type="text" class="dept-name" value="Operations" placeholder="Department">
                <input type="number" class="dept-headcount" value="3" min="0" max="9999" step="1" placeholder="HC">
                <input type="number" class="dept-cost" value="500000" min="0" max="999999999" step="1" placeholder="Cost ($)">
                <button class="dept-remove" title="Remove">×</button>
              </div>
            </div>
            <button class="add-dept-btn" id="addDeptBtn">+ Add Department</button>
          </div>

          <div class="input-section">
            <div class="section-title">Revenue Detail</div>
            <div class="input-group">
              <label>Current MRR ($)</label>
              <input type="number" id="mrr" value="166667" min="0" max="9999999" step="1">
            </div>
            <div class="input-group">
              <label>ARR Growth Rate YoY (%)</label>
              <input type="number" id="arrGrowth" value="60" min="-100" max="1000" step="0.1">
            </div>
            <div class="input-group">
              <label>New ARR Added This Year ($)</label>
              <input type="number" id="newArr" value="800000" min="0" max="999999999" step="1">
            </div>
          </div>

          <div class="input-section">
            <div class="section-title">Payroll</div>
            <div class="input-group">
              <label>Total Annual Payroll ($)</label>
              <input type="number" id="totalPayroll" value="1800000" min="0" max="999999999" step="1">
            </div>
            <div class="input-group">
              <label>Payroll / ARR Ratio</label>
              <div class="calc-value" id="payrollRatio">—</div>
            </div>
          </div>

          <div class="input-section">
            <div class="section-title">Historical Trend</div>
            <div class="quarters-grid">
              <div class="quarter-col">
                <div class="quarter-label">Q1</div>
                <div class="input-group">
                  <label>ARR ($)</label>
                  <input type="number" class="q-arr" id="q1Arr" value="1500000" min="0" max="999999999" step="1">
                </div>
                <div class="input-group">
                  <label>Headcount</label>
                  <input type="number" class="q-hc" id="q1Hc" value="12" min="0" max="9999" step="1">
                </div>
              </div>
              <div class="quarter-col">
                <div class="quarter-label">Q2</div>
                <div class="input-group">
                  <label>ARR ($)</label>
                  <input type="number" class="q-arr" id="q2Arr" value="1650000" min="0" max="999999999" step="1">
                </div>
                <div class="input-group">
                  <label>Headcount</label>
                  <input type="number" class="q-hc" id="q2Hc" value="13" min="0" max="9999" step="1">
                </div>
              </div>
              <div class="quarter-col">
                <div class="quarter-label">Q3</div>
                <div class="input-group">
                  <label>ARR ($)</label>
                  <input type="number" class="q-arr" id="q3Arr" value="1800000" min="0" max="999999999" step="1">
                </div>
                <div class="input-group">
                  <label>Headcount</label>
                  <input type="number" class="q-hc" id="q3Hc" value="14" min="0" max="9999" step="1">
                </div>
              </div>
              <div class="quarter-col">
                <div class="quarter-label">Q4</div>
                <div class="input-group">
                  <label>ARR ($)</label>
                  <input type="number" class="q-arr" id="q4Arr" value="2000000" min="0" max="999999999" step="1">
                </div>
                <div class="input-group">
                  <label>Headcount</label>
                  <input type="number" class="q-hc" id="q4Hc" value="15" min="0" max="9999" step="1">
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
          <div class="rpe-display">
            <div class="rpe-value" id="rpeValue">$133K</div>
            <div class="rpe-label">Revenue Per Employee</div>
            <div class="rpe-badge" id="rpeBadge">Building</div>
          </div>
          <div class="rpe-message" id="rpeMessage">Building stage. Normal for early-growth teams investing ahead of revenue.</div>
        </div>

        <div class="results-grid">
          <div class="result-metric">
            <div class="label">Total Headcount</div>
            <div class="value" id="totalHeadcount">15</div>
          </div>
          <div class="result-metric">
            <div class="label">Headcount to Maintain RPE</div>
            <div class="value" id="headcountNeeded">—</div>
          </div>
        </div>

        <div class="advanced-results" style="display: none;">
          <div class="results-row">
            <div class="result-metric">
              <div class="label">Revenue per $1 Payroll</div>
              <div class="value" id="revPerPayroll">$1.11</div>
            </div>
            <div class="result-metric" id="payrollEffContainer">
              <div class="label">Payroll Efficiency Ratio</div>
              <div class="value" id="payrollEfficiency">90.0%</div>
            </div>
          </div>
          <div class="results-row">
            <div class="result-metric">
              <div class="label">New ARR per S&M FTE</div>
              <div class="value" id="newArrPerSm">$114K</div>
            </div>
            <div class="result-metric">
              <div class="label">Cost per Employee (Avg)</div>
              <div class="value" id="costPerEmployee">$120K</div>
            </div>
          </div>
          <div class="results-row">
            <div class="result-metric">
              <div class="label">RPE Growth Trend</div>
              <div class="value" id="rpeTrend">Improving +15%</div>
            </div>
            <div class="result-metric">
              <div class="label">HC vs ARR Growth</div>
              <div class="value" id="hcVsArrGrowth">0.50x</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="dept-chart-section" id="deptChartSection" style="display: none;">
      <div class="card-label">Department RPE</div>
      <div class="dept-chart-container" id="deptChartContainer"></div>
      <div class="dept-insight" id="deptInsight"></div>
    </div>

    <div class="chart-section" id="trendSection" style="display: none;">
      <div class="card-label">RPE Trend (4 Quarters)</div>
      <div class="chart-container">
        <canvas id="trendChart"></canvas>
      </div>
    </div>

    <div class="warning-message" id="warningMessage" style="display: none;"></div>
    <div class="warning-message error" id="payrollWarning" style="display: none;">
      Payroll exceeds ARR. Common early-stage but unsustainable.
    </div>
    <div class="warning-message error" id="deptWarning" style="display: none;"></div>

    <div class="benchmark-section" id="benchmarkSection">
      <div class="card-label">Public SaaS Benchmarks</div>
      <table class="benchmark-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>ARR (approx)</th>
            <th>Employees</th>
            <th>RPE</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Basecamp</td><td>~$100M</td><td>~70</td><td>~$1.4M</td></tr>
          <tr><td>Shopify</td><td>~$7B</td><td>~10,000</td><td>~$700K</td></tr>
          <tr><td>Notion</td><td>~$300M</td><td>~500</td><td>~$600K</td></tr>
          <tr><td>Atlassian</td><td>~$3.5B</td><td>~10,000</td><td>~$350K</td></tr>
          <tr><td>HubSpot</td><td>~$2.2B</td><td>~7,400</td><td>~$300K</td></tr>
          <tr class="user-row" id="userBenchmarkRow"><td>Your Company</td><td id="userArr">$2M</td><td id="userHc">15</td><td id="userRpe">$133K</td></tr>
        </tbody>
      </table>
      <p class="benchmark-note">Figures are approximate and for benchmarking reference only.</p>
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
        <p><strong>Revenue Per Employee (RPE)</strong> = ARR ÷ Total Headcount</p>
        <p><strong>Payroll Efficiency</strong> = (Total Payroll ÷ ARR) × 100. Benchmark: 40–60% is world-class, 60–80% is median, 80–120% is early stage.</p>
        <p><strong>Revenue per $1 Payroll</strong> = ARR ÷ Total Payroll</p>
        <p><strong>New ARR per S&M</strong> = New ARR Added ÷ (Sales Headcount + Marketing Headcount)</p>
      </div>
    </div>
  </div>
</div>

<script src="../../assets/js/jquery.min.js"></script>
<script src="../../assets/js/tools.js"></script>
<script src="script.js"></script>

<?php include '../../footer.php'; ?>
