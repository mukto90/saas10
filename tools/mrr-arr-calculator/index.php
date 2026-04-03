<?php
$page_title = 'MRR / ARR Calculator';
$page_desc  = 'Calculate MRR, ARR, and revenue metrics across pricing tiers.';
include '../../header.php';
?>
<link rel="stylesheet" href="../../assets/css/tools.css">
<link rel="stylesheet" href="style.css">

<div class="tool-page">
  <div class="wrap">
    <a href="/" class="back-link">← All tools</a>
    
    <div class="page-header">
      <h1>MRR / ARR Calculator</h1>
      <p>Calculate monthly and annual recurring revenue across all your pricing tiers.</p>
    </div>

    <div class="mode-toggle">
      <button class="mode-btn active" data-mode="simple">Simple</button>
      <button class="mode-btn" data-mode="advanced">Advanced</button>
    </div>

    <div class="tool-grid">
      <div class="card">
        <div class="card-label">Your Inputs</div>
        
        <div id="tiersContainer">
          <div class="tier-header">
            <span></span>
            <span>Tier Name</span>
            <span>Price / Month ($)</span>
            <span>Customers</span>
            <span></span>
          </div>
          <div class="tier-row" data-tier="1">
            <div class="tier-color" style="background: #c8f060;"></div>
            <input type="text" class="tier-name" value="Starter" placeholder="Tier Name">
            <input type="number" class="tier-price" value="29" min="0" max="9999999" step="0.01">
            <input type="number" class="tier-customers" value="50" min="0" max="9999999" step="1">
            <button class="tier-remove" title="Remove tier">×</button>
          </div>
          <div class="tier-row" data-tier="2">
            <div class="tier-color" style="background: #60d4f0;"></div>
            <input type="text" class="tier-name" value="Pro" placeholder="Tier Name">
            <input type="number" class="tier-price" value="99" min="0" max="9999999" step="0.01">
            <input type="number" class="tier-customers" value="20" min="0" max="9999999" step="1">
            <button class="tier-remove" title="Remove tier">×</button>
          </div>
        </div>
        
        <button class="add-tier-btn" id="addTierBtn">+ Add Tier</button>

        <div class="advanced-inputs" style="display: none;">
          <div class="input-section">
            <div class="section-title">Per-Tier Advanced</div>
            <div id="advancedTiersContainer"></div>
          </div>

          <div class="input-section">
            <div class="section-title">Global Advanced</div>
            <div class="input-group">
              <label>MRR Last Month ($) <span class="term-tooltip">?<span class="tooltip-text">Your MRR from the previous month for calculating growth rate</span></span></label>
              <input type="number" id="mrrLastMonth" value="0" min="0" max="9999999" step="1">
            </div>
            <div class="input-group">
              <label>Annual Plan Discount (%) <span class="term-tooltip">?<span class="tooltip-text">Discount offered for annual vs monthly billing (e.g., 20% for yearly)</span></span></label>
              <input type="number" id="annualDiscount" value="0" min="0" max="100" step="0.1">
            </div>
            <div class="input-group">
              <label>% Customers on Annual Plans <span class="term-tooltip">?<span class="tooltip-text">Percentage of customers on annual billing plans</span></span></label>
              <input type="number" id="annualPercent" value="0" min="0" max="100" step="0.1">
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
            <div class="label">Total MRR <span class="term-tooltip">?<span class="tooltip-text">MRR: Monthly Recurring Revenue - predictable revenue generated each month from subscriptions</span></span></div>
            <div class="value" id="totalMrr">$2,450</div>
          </div>
          <div class="result-metric">
            <div class="label">Total ARR <span class="term-tooltip">?<span class="tooltip-text">ARR: Annual Recurring Revenue - MRR multiplied by 12</span></span></div>
            <div class="value" id="totalArr">$29,400</div>
          </div>
          <div class="result-metric">
            <div class="label">Total Customers</div>
            <div class="value" id="totalCustomers">70</div>
          </div>
          <div class="result-metric">
            <div class="label">ARPU <span class="term-tooltip">?<span class="tooltip-text">ARPU: Average Revenue Per User - average monthly revenue per customer</span></span></div>
            <div class="value" id="arpu">$35.00</div>
          </div>
        </div>

        <div class="advanced-results" style="display: none;">
          <div class="results-row">
            <div class="result-metric">
              <div class="label">New MRR <span class="term-tooltip">?<span class="tooltip-text">New MRR: Revenue from new customers acquired this month</span></span></div>
              <div class="value" id="newMrr">$0</div>
            </div>
            <div class="result-metric">
              <div class="label">Churned MRR <span class="term-tooltip">?<span class="tooltip-text">Churned MRR: Revenue lost from customers who cancelled this month</span></span></div>
              <div class="value" id="churnedMrr">$0</div>
            </div>
          </div>
          <div class="results-row">
            <div class="result-metric">
              <div class="label">Expansion MRR <span class="term-tooltip">?<span class="tooltip-text">Expansion MRR: Additional revenue from existing customers through upgrades</span></span></div>
              <div class="value" id="expansionMrr">$0</div>
            </div>
            <div class="result-metric">
              <div class="label">Net New MRR <span class="term-tooltip">?<span class="tooltip-text">Net New MRR: Total change in MRR from new, churned, and expansion revenue</span></span></div>
              <div class="value" id="netNewMrr">$0</div>
            </div>
          </div>
          <div class="results-row">
            <div class="result-metric" id="growthContainer">
              <div class="label">MRR Growth Rate <span class="health-badge" id="growthBadge">—</span> <span class="term-tooltip">?<span class="tooltip-text">MRR Growth Rate: Percentage increase in monthly recurring revenue compared to last month</span></span></div>
              <div class="value" id="mrrGrowth">—</div>
            </div>
            <div class="result-metric">
              <div class="label">Customer Churn Rate</div>
              <div class="value" id="customerChurn">0%</div>
            </div>
          </div>
          <div class="results-row">
            <div class="result-metric">
              <div class="label">Revenue Churn Rate <span class="term-tooltip">?<span class="tooltip-text">Revenue Churn Rate: Percentage of MRR lost from cancellations and downgrades</span></span></div>
              <div class="value" id="revenueChurn">0%</div>
            </div>
            <div class="result-metric">
              <div class="label">Implied ARR <span class="term-tooltip">?<span class="tooltip-text">Implied ARR: ARR accounting for annual plan discounts</span></span></div>
              <div class="value" id="impliedArr">$0</div>
            </div>
          </div>
        </div>

        <div class="revenue-mix-section">
          <div class="section-tag">// revenue mix</div>
          <div class="revenue-mix-bar" id="revenueMixBar">
            <div class="mix-segment" style="width: 34%; background: #c8f060;"><span class="mix-label">Starter 34%</span></div>
            <div class="mix-segment" style="width: 66%; background: #60d4f0;"><span class="mix-label">Pro 66%</span></div>
          </div>
        </div>

        <div class="advanced-results" style="display: none;">
          <div class="revenue-motion-section">
            <div class="section-tag">// revenue motion this month</div>
            <div class="waterfall">
              <div class="waterfall-row">
                <span class="wf-label">Last Month MRR</span>
                <span class="wf-value" id="wfLastMrr">$0</span>
              </div>
              <div class="waterfall-row add">
                <span class="wf-label">+ New MRR</span>
                <span class="wf-value" id="wfNewMrr">+$0</span>
              </div>
              <div class="waterfall-row subtract">
                <span class="wf-label">− Churned MRR</span>
                <span class="wf-value" id="wfChurnedMrr">-$0</span>
              </div>
              <div class="waterfall-row add">
                <span class="wf-label">+ Expansion MRR</span>
                <span class="wf-value" id="wfExpansionMrr">+$0</span>
              </div>
              <div class="waterfall-row total">
                <span class="wf-label">= This Month MRR</span>
                <span class="wf-value" id="wfCurrentMrr">$0</span>
              </div>
            </div>
          </div>
        </div>

        <div class="warning-message" id="warningMessage" style="display: none;"></div>
      </div>
    </div>

    <div class="chart-section">
      <div class="card-label">12-Month Projection</div>
      <div class="chart-container">
        <canvas id="projectionChart"></canvas>
      </div>
      <div class="chart-note" id="chartNote" style="display: none;">Enter MRR Last Month to enable growth projection.</div>
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
        <p><strong>MRR per Tier</strong> = Price × Customers × (1 − Discount / 100)</p>
        <p><strong>Total MRR</strong> = Σ All Tier MRRs + Σ Expansion MRR</p>
        <p><strong>ARR</strong> = Total MRR × 12</p>
        <p><strong>ARPU</strong> = Total MRR ÷ Total Customers</p>
        <p><strong>Net New MRR</strong> = New MRR − Churned MRR + Expansion MRR</p>
        <p><strong>Growth Rate</strong> = ((Total MRR − MRR Last Month) ÷ MRR Last Month) × 100</p>
        <p>This calculator assumes monthly compounding for projections.</p>
      </div>
    </div>
  </div>
</div>

<script src="../../assets/js/jquery.min.js"></script>
<script src="../../assets/js/chart.min.js"></script>
<script src="../../assets/js/tools.js"></script>
<script src="script.js"></script>

<?php include '../../footer.php'; ?>