<?php
$page_title = 'Sales Capacity Planner';
$page_desc  = 'Determine how many salespeople you need to hit your ARR target. Model ramp curves, attrition, hiring plans, and team cost efficiency.';
include '../../header.php';
?>
<link rel="stylesheet" href="../../assets/css/tools.css">
<link rel="stylesheet" href="style.css">

<div class="tool-page">
  <div class="wrap">
    <a href="/" class="back-link">← All tools</a>
    
    <div class="page-header">
      <h1>Sales Capacity Planner</h1>
      <p>Model how many reps you need to hit your revenue targets.</p>
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
          <input type="number" id="currentArr" value="500000" min="0" max="999999999" step="1">
        </div>
        
        <div class="input-group">
          <label>ARR Target ($) <span class="term-tooltip">?<span class="tooltip-text">ARR Target: The annual revenue goal you want to achieve</span></span></label>
          <input type="number" id="targetArr" value="2000000" min="0" max="999999999" step="1">
        </div>
        
        <div class="input-group">
          <label>Annual Quota per Rep ($) <span class="term-tooltip">?<span class="tooltip-text">Quota: The annual revenue target each sales rep is expected to achieve</span></span></label>
          <input type="number" id="quota" value="400000" min="0" max="9999999" step="1">
        </div>
        
        <div class="input-group">
          <label>Average Quota Attainment (%) <span class="term-tooltip">?<span class="tooltip-text">Quota Attainment: Average percentage of quota that reps actually achieve</span></span></label>
          <input type="number" id="attainment" value="70" min="0" max="200" step="1">
        </div>
        
        <div class="input-group">
          <label>Ramp Time (months) <span class="term-tooltip">?<span class="tooltip-text">Ramp Time: Number of months for a new rep to become fully productive</span></span></label>
          <input type="number" id="rampTime" value="3" min="0" max="18" step="1">
        </div>
        
        <div class="input-group">
          <label>Current Sales Reps <span class="term-tooltip">?<span class="tooltip-text">Current number of sales representatives on your team</span></span></label>
          <input type="number" id="currentReps" value="2" min="0" max="9999" step="1">
        </div>

        <div class="advanced-inputs" style="display: none;">
          <div class="input-section">
            <div class="section-title">Ramp Curve</div>
            <div class="ramp-curve-grid" id="rampCurveGrid">
              <div class="ramp-row"><span class="ramp-month">Month 1</span><input type="number" class="ramp-productivity" value="0" min="0" max="100" step="5"></div>
              <div class="ramp-row"><span class="ramp-month">Month 2</span><input type="number" class="ramp-productivity" value="25" min="0" max="100" step="5"></div>
              <div class="ramp-row"><span class="ramp-month">Month 3</span><input type="number" class="ramp-productivity" value="50" min="0" max="100" step="5"></div>
              <div class="ramp-row"><span class="ramp-month">Month 4</span><input type="number" class="ramp-productivity" value="75" min="0" max="100" step="5"></div>
              <div class="ramp-row"><span class="ramp-month">Month 5+</span><input type="number" class="ramp-productivity" value="100" min="0" max="100" step="5"></div>
            </div>
          </div>

          <div class="input-section">
            <div class="section-title">Rep Economics</div>
            <div class="input-group">
              <label>Annual OTE per Rep ($) <span class="term-tooltip">?<span class="tooltip-text">OTE: On-Target Earnings - total compensation including base + expected commission</span></span></label>
              <input type="number" id="ote" value="120000" min="0" max="9999999" step="1">
            </div>
            <div class="input-group">
              <label>Fully-Loaded Cost Multiplier <span class="term-tooltip">?<span class="tooltip-text">Fully-Loaded Cost: Total cost including base salary, benefits, tools, and management overhead</span></span></label>
              <input type="number" id="costMultiplier" value="1.3" min="1" max="2" step="0.01">
            </div>
            <div class="input-group">
              <label>Average Deal Size (ACV, $) <span class="term-tooltip">?<span class="tooltip-text">ACV: Annual Contract Value - average yearly revenue per customer contract</span></span></label>
              <input type="number" id="dealSize" value="10000" min="0" max="9999999" step="1">
            </div>
            <div class="input-group">
              <label>Avg Sales Cycle (months) <span class="term-tooltip">?<span class="tooltip-text">Sales Cycle: Average time from first contact to closing a deal</span></span></label>
              <input type="number" id="salesCycle" value="2" min="0" max="24" step="0.1">
            </div>
            <div class="input-group">
              <label>Win Rate (%) <span class="term-tooltip">?<span class="tooltip-text">Win Rate: Percentage of opportunities that result in closed-won deals</span></span></label>
              <input type="number" id="winRate" value="25" min="0" max="100" step="0.1">
            </div>
          </div>

          <div class="input-section">
            <div class="section-title">Team Attrition</div>
            <div class="input-group">
              <label>Annual Rep Attrition (%) <span class="term-tooltip">?<span class="tooltip-text">Attrition: Percentage of sales reps who leave your company per year</span></span></label>
              <input type="number" id="attrition" value="20" min="0" max="100" step="0.1">
            </div>
            <div class="input-group">
              <label>Backfill Time (months) <span class="term-tooltip">?<span class="tooltip-text">Backfill Time: Time needed to hire and ramp a replacement for a departed rep</span></span></label>
              <input type="number" id="backfillTime" value="2" min="0" max="12" step="1">
            </div>
          </div>

          <div class="input-section">
            <div class="section-title">Hiring Plan</div>
            <div class="input-group">
              <label>Start Hiring in Month # <span class="term-tooltip">?<span class="tooltip-text">Month number from now when you plan to start hiring new reps</span></span></label>
              <input type="number" id="hireStart" value="1" min="1" max="24" step="1">
            </div>
            <div class="input-group">
              <label>Reps to Hire per Month</label>
              <input type="number" id="hireRate" value="1" min="0" max="20" step="1">
            </div>
            <div class="input-group">
              <label>Hiring Period (months) <span class="term-tooltip">?<span class="tooltip-text">Hiring Period: Total duration of your hiring plan in months</span></span></label>
              <input type="number" id="hirePeriod" value="12" min="1" max="36" step="1">
            </div>
          </div>

          <div class="input-section">
            <div class="section-title">SDR Layer</div>
            <div class="toggle-group">
              <label class="toggle-label">
                <input type="checkbox" id="includeSdr">
                <span class="toggle-switch"></span>
                Include SDRs
              </label>
            </div>
            <div class="sdr-inputs" style="display: none;">
              <div class="input-group">
                <label>SDRs per AE <span class="term-tooltip">?<span class="tooltip-text">SDR: Sales Development Representative - AE: Account Executive. Ratio defines how many SDRs support each AE</span></span></label>
                <select id="sdrRatio">
                  <option value="1">1:1</option>
                  <option value="2" selected>1:2</option>
                  <option value="3">1:3</option>
                  <option value="4">1:4</option>
                </select>
              </div>
              <div class="input-group">
                <label>SDR Annual OTE ($)</label>
                <input type="number" id="sdrOte" value="70000" min="0" max="9999999" step="1">
              </div>
              <div class="input-group">
                <label>% Pipeline from SDRs <span class="term-tooltip">?<span class="tooltip-text">Pipeline: Sales pipeline - the total value of all active sales opportunities</span></span></label>
                <input type="number" id="sdrPipeline" value="40" min="0" max="100" step="1">
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
          <div class="capacity-badge" id="capacityBadge">Acceptable</div>
          <div class="capacity-message" id="capacityMessage">Your sales team cost is within acceptable range.</div>
        </div>

        <div class="results-grid">
          <div class="result-metric">
            <div class="label">ARR Gap <span class="term-tooltip">?<span class="tooltip-text">ARR Gap: The difference between your target ARR and current ARR</span></span></div>
            <div class="value" id="arrGap">$1.5M</div>
          </div>
          <div class="result-metric">
            <div class="label">Effective Quota <span class="term-tooltip">?<span class="tooltip-text">Effective Quota: Annual quota adjusted for expected attainment rate</span></span></div>
            <div class="value" id="effectiveQuota">$280K</div>
          </div>
          <div class="result-metric">
            <div class="label">Reps Needed <span class="term-tooltip">?<span class="tooltip-text">Reps Needed: Number of reps required to close the ARR gap</span></span></div>
            <div class="value" id="repsNeeded">6</div>
          </div>
          <div class="result-metric">
            <div class="label">Additional Reps</div>
            <div class="value" id="additionalReps">4</div>
          </div>
        </div>

        <div class="results-row">
          <div class="result-metric">
            <div class="label">Time to Target <span class="term-tooltip">?<span class="tooltip-text">Time to Target: Estimated months to reach ARR target with hiring plan</span></span></div>
            <div class="value" id="timeToTarget">9 months</div>
          </div>
          <div class="result-metric">
            <div class="label">Sales Payroll Cost <span class="term-tooltip">?<span class="tooltip-text">Sales Payroll Cost: Total annual cost of sales team including fully-loaded expenses</span></span></div>
            <div class="value" id="payrollCost">$936K/yr</div>
          </div>
        </div>

        <div class="advanced-results" style="display: none;">
          <div class="results-row">
            <div class="result-metric">
              <div class="label">Pipeline Needed</div>
              <div class="value" id="pipelineNeeded">$6M</div>
            </div>
            <div class="result-metric">
              <div class="label">Deals Needed</div>
              <div class="value" id="dealsNeeded">600</div>
            </div>
          </div>
          <div class="results-row">
            <div class="result-metric">
              <div class="label">Reps w/ Attrition</div>
              <div class="value" id="repsWithAttrition">7</div>
            </div>
            <div class="result-metric">
              <div class="label">SDRs Needed</div>
              <div class="value" id="sdrsNeeded">3</div>
            </div>
          </div>
          <div class="results-row">
            <div class="result-metric">
              <div class="label">Total Team Cost</div>
              <div class="value" id="totalTeamCost">$1.1M/yr</div>
            </div>
            <div class="result-metric">
              <div class="label">Cost per $1 ARR</div>
              <div class="value" id="costPerArr">$0.73</div>
            </div>
          </div>
          <div class="results-row">
            <div class="result-metric">
              <div class="label">First Ramp Complete</div>
              <div class="value" id="firstRamp">Month 4</div>
            </div>
            <div class="result-metric">
              <div class="label">Revenue at Risk</div>
              <div class="value" id="riskFromAttrition">$56K/yr</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="warning-message" id="warningMessage" style="display: none;"></div>
    <div class="warning-message error" id="errorMessage" style="display: none;"></div>

    <div class="chart-section" id="capacityChartSection" style="display: none;">
      <div class="card-label">Capacity Build (24 Months)</div>
      <div class="chart-container">
        <canvas id="capacityChart"></canvas>
      </div>
    </div>

    <div class="table-section" id="hiringTableSection" style="display: none;">
      <div class="card-label">Hiring Plan</div>
      <div class="table-wrapper">
        <table class="hiring-table" id="hiringTable">
          <thead>
            <tr>
              <th>Month</th>
              <th>Hires</th>
              <th>Attrition</th>
              <th>Active Reps</th>
              <th>Ramping</th>
              <th>Fully Ramped</th>
              <th>Capacity</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
      <button class="btn-ghost" id="copyCsv">Copy as CSV</button>
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
        <p><strong>Effective Quota</strong> = Annual Quota × Quota Attainment %</p>
        <p><strong>Reps Needed</strong> = CEIL(ARR Gap ÷ Effective Quota)</p>
        <p><strong>Capacity</strong> = Sum of all reps' productivity based on ramp curve</p>
        <p><strong>Pipeline Needed</strong> = ARR Gap ÷ Win Rate</p>
        <p><strong>Cost per $1 ARR</strong> = Total Sales Cost ÷ ARR Gap</p>
      </div>
    </div>
  </div>
</div>

<script src="../../assets/js/jquery.min.js"></script>
<script src="../../assets/js/tools.js"></script>
<script src="script.js"></script>

<?php include '../../footer.php'; ?>
