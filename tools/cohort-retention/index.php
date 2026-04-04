<?php
$page_title = 'Cohort Retention Table';
$page_desc  = 'Track and visualize customer retention across cohorts. Build heatmap grids, see retention curves, and benchmark against SaaS industry standards.';
include '../../header.php';
?>
<link rel="stylesheet" href="../../assets/css/tools.css">
<link rel="stylesheet" href="style.css">

<div class="tool-page">
  <div class="wrap">
    <a href="/" class="back-link">← All tools</a>
    
    <div class="page-header">
      <h1>Cohort Retention</h1>
      <p>Track and visualize customer retention across cohorts.</p>
    </div>

    <div class="mode-toggle">
      <button class="mode-btn active" data-mode="simple">Simple</button>
      <button class="mode-btn" data-mode="advanced">Advanced</button>
    </div>

    <div class="retention-tool">
      <div class="grid-section">
        <div class="card-label">Retention Data</div>
        
        <div class="retention-grid" id="retentionGrid">
          <div class="grid-header">
            <div class="cohort-name-col">Cohort</div>
            <div class="month-col header-col">M0</div>
            <div class="month-col header-col">M1</div>
            <div class="month-col header-col">M2</div>
            <div class="month-col header-col">M3</div>
            <div class="month-col header-col">M4</div>
            <div class="month-col header-col">M5</div>
            <div class="month-col header-col">M6</div>
            <div class="month-col header-col">M7</div>
            <div class="month-col header-col">M8</div>
            <div class="month-col header-col">M9</div>
            <div class="month-col header-col">M10</div>
            <div class="month-col header-col">M11</div>
            <div class="action-col"></div>
          </div>
          
          <div class="grid-row" data-row="0">
            <div class="cohort-name-col">
              <input type="text" class="cohort-name" value="Jan 2024" maxlength="12">
            </div>
            <div class="month-col m0"><span class="cell-value">100</span></div>
            <div class="month-col" data-month="1"><input type="number" class="retention-input" value="78" min="0" max="100" step="0.1"></div>
            <div class="month-col" data-month="2"><input type="number" class="retention-input" value="65" min="0" max="100" step="0.1"></div>
            <div class="month-col" data-month="3"><input type="number" class="retention-input" value="58" min="0" max="100" step="0.1"></div>
            <div class="month-col" data-month="4"><input type="number" class="retention-input" value="53" min="0" max="100" step="0.1"></div>
            <div class="month-col" data-month="5"><input type="number" class="retention-input" value="50" min="0" max="100" step="0.1"></div>
            <div class="month-col" data-month="6"><input type="number" class="retention-input" value="48" min="0" max="100" step="0.1"></div>
            <div class="month-col" data-month="7"><input type="number" class="retention-input" min="0" max="100" step="0.1"></div>
            <div class="month-col" data-month="8"><input type="number" class="retention-input" min="0" max="100" step="0.1"></div>
            <div class="month-col" data-month="9"><input type="number" class="retention-input" min="0" max="100" step="0.1"></div>
            <div class="month-col" data-month="10"><input type="number" class="retention-input" min="0" max="100" step="0.1"></div>
            <div class="month-col" data-month="11"><input type="number" class="retention-input" min="0" max="100" step="0.1"></div>
            <div class="action-col"><button class="remove-row" onclick="removeRow(this)">×</button></div>
          </div>
          
          <div class="grid-row" data-row="1">
            <div class="cohort-name-col">
              <input type="text" class="cohort-name" value="Feb 2024" maxlength="12">
            </div>
            <div class="month-col m0"><span class="cell-value">100</span></div>
            <div class="month-col" data-month="1"><input type="number" class="retention-input" value="80" min="0" max="100" step="0.1"></div>
            <div class="month-col" data-month="2"><input type="number" class="retention-input" value="68" min="0" max="100" step="0.1"></div>
            <div class="month-col" data-month="3"><input type="number" class="retention-input" value="61" min="0" max="100" step="0.1"></div>
            <div class="month-col" data-month="4"><input type="number" class="retention-input" value="55" min="0" max="100" step="0.1"></div>
            <div class="month-col" data-month="5"><input type="number" class="retention-input" value="52" min="0" max="100" step="0.1"></div>
            <div class="month-col" data-month="6"><input type="number" class="retention-input" min="0" max="100" step="0.1"></div>
            <div class="month-col" data-month="7"><input type="number" class="retention-input" min="0" max="100" step="0.1"></div>
            <div class="month-col" data-month="8"><input type="number" class="retention-input" min="0" max="100" step="0.1"></div>
            <div class="month-col" data-month="9"><input type="number" class="retention-input" min="0" max="100" step="0.1"></div>
            <div class="month-col" data-month="10"><input type="number" class="retention-input" min="0" max="100" step="0.1"></div>
            <div class="month-col" data-month="11"><input type="number" class="retention-input" min="0" max="100" step="0.1"></div>
            <div class="action-col"><button class="remove-row" onclick="removeRow(this)">×</button></div>
          </div>
          
          <div class="grid-row" data-row="2">
            <div class="cohort-name-col">
              <input type="text" class="cohort-name" value="Mar 2024" maxlength="12">
            </div>
            <div class="month-col m0"><span class="cell-value">100</span></div>
            <div class="month-col" data-month="1"><input type="number" class="retention-input" value="82" min="0" max="100" step="0.1"></div>
            <div class="month-col" data-month="2"><input type="number" class="retention-input" value="71" min="0" max="100" step="0.1"></div>
            <div class="month-col" data-month="3"><input type="number" class="retention-input" value="63" min="0" max="100" step="0.1"></div>
            <div class="month-col" data-month="4"><input type="number" class="retention-input" min="0" max="100" step="0.1"></div>
            <div class="month-col" data-month="5"><input type="number" class="retention-input" min="0" max="100" step="0.1"></div>
            <div class="month-col" data-month="6"><input type="number" class="retention-input" min="0" max="100" step="0.1"></div>
            <div class="month-col" data-month="7"><input type="number" class="retention-input" min="0" max="100" step="0.1"></div>
            <div class="month-col" data-month="8"><input type="number" class="retention-input" min="0" max="100" step="0.1"></div>
            <div class="month-col" data-month="9"><input type="number" class="retention-input" min="0" max="100" step="0.1"></div>
            <div class="month-col" data-month="10"><input type="number" class="retention-input" min="0" max="100" step="0.1"></div>
            <div class="month-col" data-month="11"><input type="number" class="retention-input" min="0" max="100" step="0.1"></div>
            <div class="action-col"><button class="remove-row" onclick="removeRow(this)">×</button></div>
          </div>
        </div>
        
        <button class="add-row-btn" id="addRowBtn">+ Add Cohort</button>
      </div>

      <div class="advanced-inputs" style="display: none;">
        <div class="card-label" style="margin-top: 1.5rem;">Advanced Settings</div>
        
        <div class="cohort-meta" id="cohortMeta">
          <div class="meta-row" data-row="0">
            <span class="meta-cohort-name">Jan 2024</span>
            <input type="number" class="cohort-size" value="100" min="0" placeholder="Customers">
            <input type="number" class="cohort-mrr" value="0" min="0" placeholder="MRR">
          </div>
          <div class="meta-row" data-row="1">
            <span class="meta-cohort-name">Feb 2024</span>
            <input type="number" class="cohort-size" value="100" min="0" placeholder="Customers">
            <input type="number" class="cohort-mrr" value="0" min="0" placeholder="MRR">
          </div>
          <div class="meta-row" data-row="2">
            <span class="meta-cohort-name">Mar 2024</span>
            <input type="number" class="cohort-size" value="100" min="0" placeholder="Customers">
            <input type="number" class="cohort-mrr" value="0" min="0" placeholder="MRR">
          </div>
        </div>
        
        <div class="benchmark-toggle">
          <label class="toggle-label">
            <input type="checkbox" id="showBenchmarks">
            <span class="toggle-switch"></span>
            Show industry benchmarks
          </label>
        </div>
      </div>

      <div class="results-section">
        <div class="card-label">Retention Summary</div>
        
        <div class="summary-grid">
          <div class="summary-metric">
            <div class="label">Avg M1 Retention <span class="term-tooltip">?<span class="tooltip-text">M1 Retention: Percentage of customers still active 1 month after acquisition</span></span></div>
            <div class="value" id="avgM1">80.0%</div>
          </div>
          <div class="summary-metric">
            <div class="label">Avg M3 Retention <span class="term-tooltip">?<span class="tooltip-text">M3 Retention: Percentage of customers still active 3 months after acquisition</span></span></div>
            <div class="value" id="avgM3">60.7%</div>
          </div>
          <div class="summary-metric">
            <div class="label">Avg M6 Retention <span class="term-tooltip">?<span class="tooltip-text">M6 Retention: Percentage of customers still active 6 months after acquisition</span></span></div>
            <div class="value" id="avgM6">50.0%</div>
          </div>
          <div class="summary-metric">
            <div class="label">Avg M12 Retention <span class="term-tooltip">?<span class="tooltip-text">M12 Retention: Percentage of customers still active 12 months after acquisition</span></span></div>
            <div class="value" id="avgM12">—</div>
          </div>
        </div>
        
        <div class="summary-row">
          <div class="summary-metric">
            <div class="label">Best Cohort <span class="term-tooltip">?<span class="tooltip-text">Cohort: A group of customers acquired in the same time period (e.g., same month)</span></span></div>
            <div class="value" id="bestCohort">Mar 2024</div>
          </div>
          <div class="summary-metric">
            <div class="label">Worst Cohort</div>
            <div class="value" id="worstCohort">Jan 2024</div>
          </div>
          <div class="summary-metric">
            <div class="label">Retention Trend <span class="term-tooltip">?<span class="tooltip-text">Retention Trend: Shows whether retention is improving or declining across cohorts</span></span></div>
            <div class="value" id="retentionTrend">Improving +4%</div>
          </div>
        </div>
        
        <div class="health-summary" id="healthSummary">
          <span class="health-badge" id="healthBadge">Good</span>
          <span class="health-text" id="healthText">Based on average M3 retention</span>
        </div>
        
        <div class="insight-line" id="insightLine">Your M1 retention has improved by 4% from Jan 2024 to Mar 2024. This is a strong signal that product improvements are working.</div>
        
        <div class="advanced-results" style="display: none;">
          <div class="summary-grid" style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border);">
            <div class="summary-metric">
              <div class="label">Avg Cohort Size</div>
              <div class="value" id="avgCohortSize">100</div>
            </div>
            <div class="summary-metric">
              <div class="label">Total Customers</div>
              <div class="value" id="totalCustomers">300</div>
            </div>
            <div class="summary-metric">
              <div class="label">Weighted M1</div>
              <div class="value" id="weightedM1">80.0%</div>
            </div>
            <div class="summary-metric">
              <div class="label">Implied Monthly Churn</div>
              <div class="value" id="monthlyChurn">—</div>
            </div>
          </div>
          <div class="summary-row">
            <div class="summary-metric">
              <div class="label">Implied Annual Churn</div>
              <div class="value" id="annualChurn">Insufficient data</div>
            </div>
          </div>
        </div>
      </div>

      <div class="chart-section">
        <div class="card-label">Retention Curve</div>
        <div class="chart-container">
          <canvas id="retentionChart"></canvas>
        </div>
        <div class="chart-legend" id="chartLegend"></div>
        <div class="benchmark-note" id="benchmarkNote" style="display: none;">Benchmarks based on OpenView SaaS benchmarks 2024.</div>
      </div>

      <div class="export-section">
        <button class="btn-ghost" id="copyCSV">Copy as CSV</button>
        <button class="btn-ghost" id="shareLink">Share Link</button>
      </div>
    </div>
  </div>
</div>

<script src="../../assets/js/jquery.min.js"></script>
<script src="../../assets/js/tools.js"></script>
<script src="script.js"></script>

<?php include '../../footer.php'; ?>
