<?php
$page_title = 'Sales Pipeline Calculator';
$page_desc  = 'Calculate the sales pipeline needed to hit your revenue targets.';
include '../../header.php';
?>
<link rel="stylesheet" href="../../assets/css/tools.css">
<link rel="stylesheet" href="style.css">

<div class="tool-page">
  <div class="wrap">
    <a href="/" class="back-link">← All tools</a>
    
    <div class="page-header">
      <h1>Sales Pipeline Calculator</h1>
      <p>Calculate the sales pipeline needed to hit your revenue targets.</p>
    </div>

    <div class="mode-toggle">
      <button class="mode-btn active" data-mode="simple">Simple</button>
      <button class="mode-btn" data-mode="advanced">Advanced</button>
    </div>

    <div class="tool-grid">
      <div class="card">
        <div class="card-label">Your Inputs</div>
        
        <div class="input-group">
          <label>Annual Revenue Target ($) <span class="term-tooltip">?<span class="tooltip-text">Your annual revenue goal</span></span></label>
          <input type="number" id="target" value="1000000" min="0" max="999999999" step="1">
        </div>
        
        <div class="input-group">
          <label>Average Deal Size ($) <span class="term-tooltip">?<span class="tooltip-text">Average contract value</span></span></label>
          <input type="number" id="dealSize" value="24000" min="0" max="9999999" step="1">
        </div>
        
        <div class="input-group">
          <label>Win Rate (%) <span class="term-tooltip">?<span class="tooltip-text">Close rate from opportunity to won</span></span></label>
          <input type="number" id="winRate" value="25" min="0" max="100" step="0.1">
        </div>

        <div class="input-group">
          <label>Sales Cycle (months) <span class="term-tooltip">?<span class="tooltip-text">Average time from lead to close</span></span></label>
          <input type="number" id="cycle" value="3" min="0" max="24" step="0.5">
        </div>

        <div class="advanced-inputs" style="display: none;">
          <div class="input-section">
            <div class="section-title">Team Settings</div>
            <div class="input-group">
              <label>Number of Reps</label>
              <input type="number" id="reps" value="4" min="1" max="100" step="1">
            </div>
            <div class="input-group">
              <label>Quota per Rep ($)</label>
              <input type="number" id="quota" value="250000" min="0" max="99999999" step="1">
            </div>
          </div>

          <div class="input-section">
            <div class="section-title">Conversion Rates</div>
            <div class="input-group">
              <label>Lead → MQL (%) <span class="term-tooltip">?<span class="tooltip-text">Lead to Marketing Qualified Lead conversion</span></span></label>
              <input type="number" id="leadToMql" value="20" min="0" max="100" step="0.1">
            </div>
            <div class="input-group">
              <label>MQL → SQL (%) <span class="term-tooltip">?<span class="tooltip-text">MQL to Sales Qualified Lead conversion</span></span></label>
              <input type="number" id="mqlToSql" value="25" min="0" max="100" step="0.1">
            </div>
            <div class="input-group">
              <label>SQL → Opportunity (%) <span class="term-tooltip">?<span class="tooltip-text">SQL to Opportunity conversion</span></span></label>
              <input type="number" id="sqlToOpp" value="40" min="0" max="100" step="0.1">
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
            <div class="label">Deals Needed</div>
            <div class="value" id="dealsNeeded">42</div>
          </div>
          <div class="result-metric" id="pipelineContainer">
            <div class="label">Required Pipeline <span class="health-badge" id="pipelineBadge">Healthy</span> <span class="term-tooltip">?<span class="tooltip-text">Total pipeline value needed to hit target</span></span></div>
            <div class="value" id="pipeline">$4,000,000</div>
          </div>
        </div>

        <div class="results-row">
          <div class="result-metric">
            <div class="label">Leads Needed</div>
            <div class="value" id="leadsNeeded">8,333</div>
          </div>
          <div class="result-metric">
            <div class="label">MQLs Needed</div>
            <div class="value" id="mqlsNeeded">1,667</div>
          </div>
          <div class="result-metric">
            <div class="label">SQLs Needed</div>
            <div class="value" id="sqlsNeeded">417</div>
          </div>
        </div>

        <div class="results-row">
          <div class="result-metric">
            <div class="label">Pipeline per Rep</div>
            <div class="value" id="pipelinePerRep">$1,000,000</div>
          </div>
          <div class="result-metric">
            <div class="label">Pipeline Coverage</div>
            <div class="value" id="coverage">3.0x</div>
          </div>
        </div>

        <div class="advanced-results" style="display: none;">
          <div class="results-row">
            <div class="result-metric">
              <div class="label">Monthly Pipeline</div>
              <div class="value" id="monthlyPipeline">$333,333</div>
            </div>
            <div class="result-metric">
              <div class="label">Monthly Leads</div>
              <div class="value" id="monthlyLeads">694</div>
            </div>
          </div>

          <div class="funnel-breakdown">
            <div class="section-tag">// funnel breakdown</div>
            <div class="funnel-row">
              <span class="funnel-label">Leads</span>
              <span class="funnel-bar"><span class="funnel-fill" id="leadBar" style="width: 100%"></span></span>
              <span class="funnel-value" id="leadValue">8,333</span>
            </div>
            <div class="funnel-row">
              <span class="funnel-label">→ MQLs (<span id="leadToMqlDisplay">20%</span>)</span>
              <span class="funnel-bar"><span class="funnel-fill" id="mqlBar" style="width: 20%"></span></span>
              <span class="funnel-value" id="mqlValue">1,667</span>
            </div>
            <div class="funnel-row">
              <span class="funnel-label">→ SQLs (<span id="mqlToSqlDisplay">25%</span>)</span>
              <span class="funnel-bar"><span class="funnel-fill" id="sqlBar" style="width: 5%"></span></span>
              <span class="funnel-value" id="sqlValue">417</span>
            </div>
            <div class="funnel-row">
              <span class="funnel-label">→ Opportunities (<span id="sqlToOppDisplay">40%</span>)</span>
              <span class="funnel-bar"><span class="funnel-fill" id="oppBar" style="width: 2%"></span></span>
              <span class="funnel-value" id="oppValue">167</span>
            </div>
            <div class="funnel-row">
              <span class="funnel-label">→ Won (<span id="winRateDisplay">25%</span>)</span>
              <span class="funnel-bar"><span class="funnel-fill" id="wonBar" style="width: 0.5%"></span></span>
              <span class="funnel-value" id="wonValue">42</span>
            </div>
          </div>
        </div>

        <div class="feedback-line" id="feedback">Your pipeline coverage is healthy. Aim for 3-4x pipeline coverage.</div>
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
        <p><strong>Required Pipeline</strong> = Revenue Target ÷ (Win Rate / 100)</p>
        <p><strong>Leads Needed</strong> = Required Pipeline ÷ (Deal Size × Lead-to-Win %)</p>
        <p><strong>Pipeline Coverage</strong> = Available Pipeline ÷ Required Pipeline</p>
        <p>Target 3-4x pipeline coverage to ensure you hit your number.</p>
      </div>
    </div>
  </div>
</div>

<script src="../../assets/js/jquery.min.js"></script>
<script src="../../assets/js/tools.js"></script>
<script src="script.js"></script>

<?php include '../../footer.php'; ?>
