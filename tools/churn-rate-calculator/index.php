<?php
$page_title = 'Churn Rate Calculator';
$page_desc  = 'Calculate customer and revenue churn rates with 12-month projections. See compound impact of churn on your customer base and MRR.';
include '../../header.php';
?>
<link rel="stylesheet" href="../../assets/css/tools.css">
<link rel="stylesheet" href="style.css">

<div class="tool-page">
  <div class="wrap">
    <a href="/" class="back-link">← All tools</a>
    
    <div class="page-header">
      <h1>Churn Rate Calculator</h1>
      <p>Measure customer and revenue loss, understand the compounding impact of churn, and project where your business will be in 12 months.</p>
    </div>

    <div class="mode-toggle">
      <button class="mode-btn active" data-mode="simple">Simple</button>
      <button class="mode-btn" data-mode="advanced">Advanced</button>
    </div>

    <div class="tool-grid">
      <div class="card">
        <div class="card-label">Your Inputs</div>
        
        <div class="input-section">
          <div class="section-title">Customer Churn</div>
          <div class="input-group">
            <label>Customers (Start of Month) <span class="term-tooltip">?<span class="tooltip-text">Total number of customers at the beginning of the month</span></span></label>
            <input type="number" id="customersStart" value="500" min="0" max="9999999" step="1">
          </div>
          <div class="input-group">
            <label>Customers Lost This Month <span class="term-tooltip">?<span class="tooltip-text">Number of customers who cancelled their subscription this month</span></span></label>
            <input type="number" id="customersLost" value="25" min="0" max="9999999" step="1">
          </div>
        </div>

        <div class="input-section">
          <div class="section-title">Revenue Churn</div>
          <div class="input-group">
            <label>MRR (Start of Month) ($) <span class="term-tooltip">?<span class="tooltip-text">Monthly Recurring Revenue at the start of the month</span></span></label>
            <input type="number" id="mrrStart" value="25000" min="0" max="9999999" step="1">
          </div>
          <div class="input-group">
            <label>MRR Lost This Month ($) <span class="term-tooltip">?<span class="tooltip-text">Revenue lost from customers who cancelled or downgraded</span></span></label>
            <input type="number" id="mrrLost" value="1000" min="0" max="9999999" step="1">
          </div>
        </div>

        <div class="advanced-inputs" style="display: none;">
          <div class="input-section">
            <div class="section-title">Churn Breakdown</div>
            <div class="input-group">
              <label>Voluntary Churn (Customers) <span class="term-tooltip">?<span class="tooltip-text">Customers who actively chose to cancel their subscription</span></span></label>
              <input type="number" id="voluntaryChurn" value="0" min="0" max="9999999" step="1">
            </div>
            <div class="input-group">
              <label>Involuntary Churn (Customers) <span class="term-tooltip">?<span class="tooltip-text">Customers lost due to failed payments or payment issues</span></span></label>
              <input type="number" id="involuntaryChurn" value="0" min="0" max="9999999" step="1">
            </div>
            <div class="input-group">
              <label>Expansion MRR ($) <span class="term-tooltip">?<span class="tooltip-text">Additional revenue from existing customers upgrading or adding features</span></span></label>
              <input type="number" id="expansionMrr" value="0" min="0" max="9999999" step="1">
            </div>
            <div class="input-group">
              <label>Contraction MRR ($) <span class="term-tooltip">?<span class="tooltip-text">Revenue lost from customers downgrading to lower plans</span></span></label>
              <input type="number" id="contractionMrr" value="0" min="0" max="9999999" step="1">
            </div>
            <div class="input-group">
              <label>New MRR ($) <span class="term-tooltip">?<span class="tooltip-text">Revenue from new customers acquired this month</span></span></label>
              <input type="number" id="newMrr" value="0" min="0" max="9999999" step="1">
            </div>
          </div>

          <div class="input-section">
            <div class="section-title">Segmented Churn (up to 3 plans)</div>
            <div id="segmentsContainer">
              <div class="segment-row" data-segment="1">
                <div class="segment-color" style="background: #c8f060;"></div>
                <input type="text" class="segment-name" value="Starter" placeholder="Plan Name">
                <input type="number" class="segment-start" value="0" min="0" max="9999999" step="1" placeholder="Starting">
                <input type="number" class="segment-churned" value="0" min="0" max="9999999" step="1" placeholder="Churned">
                <input type="number" class="segment-mrrLost" value="0" min="0" max="9999999" step="1" placeholder="MRR Lost">
                <button class="segment-remove" title="Remove segment">×</button>
              </div>
            </div>
            <button class="add-segment-btn" id="addSegmentBtn">+ Add Plan Segment</button>
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
            <div class="label">Customer Churn Rate <span class="term-tooltip">?<span class="tooltip-text">Churn Rate: Percentage of customers who cancel their subscription in a given period</span></span> <span class="health-badge" id="customerChurnBadge"></span></div>
            <div class="value" id="customerChurnRate">5.00%</div>
            <div class="interpretation" id="customerChurnInterpretation"></div>
          </div>
          <div class="result-metric">
            <div class="label">Revenue Churn Rate <span class="term-tooltip">?<span class="tooltip-text">Revenue Churn Rate: Percentage of monthly recurring revenue lost due to cancellations and downgrades</span></span> <span class="health-badge" id="revenueChurnBadge"></span></div>
            <div class="value" id="revenueChurnRate">4.00%</div>
          </div>
          <div class="result-metric">
            <div class="label">Customers Remaining</div>
            <div class="value" id="customersRemaining">475</div>
          </div>
          <div class="result-metric">
            <div class="label">MRR Remaining <span class="term-tooltip">?<span class="tooltip-text">MRR: Monthly Recurring Revenue - predictable revenue generated each month from subscriptions</span></span></div>
            <div class="value" id="mrrRemaining">$24,000</div>
          </div>
          <div class="result-metric">
            <div class="label">Avg Revenue per Churned Customer <span class="term-tooltip">?<span class="tooltip-text">AR PCC: Average revenue lost from each customer who churns</span></span></div>
            <div class="value" id="arpcc">$40.00</div>
          </div>
        </div>

        <div class="advanced-results" style="display: none;">
          <div class="results-row">
            <div class="result-metric">
              <div class="label">Voluntary Churn Rate <span class="term-tooltip">?<span class="tooltip-text">Voluntary Churn: Customers who actively choose to cancel their subscription</span></span></div>
              <div class="value" id="voluntaryChurnRate">0.00%</div>
            </div>
            <div class="result-metric">
              <div class="label">Involuntary Churn Rate <span class="term-tooltip">?<span class="tooltip-text">Involuntary Churn: Customers lost due to failed payments or payment issues</span></span></div>
              <div class="value" id="involuntaryChurnRate">0.00%</div>
            </div>
          </div>
          <div class="results-row">
            <div class="result-metric">
              <div class="label">Gross Revenue Retention <span class="term-tooltip">?<span class="tooltip-text">GRR: Percentage of revenue retained from existing customers, excluding expansion</span></span></div>
              <div class="value" id="grr">96.00%</div>
            </div>
            <div class="result-metric">
              <div class="label">Net Revenue Retention <span class="term-tooltip">?<span class="tooltip-text">NRR: Revenue retained including expansion revenue minus churn and contraction</span></span> <span class="health-badge" id="nrrBadge"></span></div>
              <div class="value" id="nrr">96.00%</div>
            </div>
          </div>
          <div class="results-row">
            <div class="result-metric">
              <div class="label">MRR Movements Net <span class="term-tooltip">?<span class="tooltip-text">Net MRR: Total change in monthly recurring revenue from all movements</span></span></div>
              <div class="value" id="mrrMovementsNet">$800</div>
            </div>
            <div class="result-metric">
              <div class="label">Highest Churn Segment</div>
              <div class="value" id="highestChurnSegment">—</div>
            </div>
          </div>
        </div>

        <div class="projection-section">
          <div class="section-tag">// 12-month projection</div>
          <div class="projection-grid">
            <div class="result-metric">
              <div class="label">Projected Customers (12mo)</div>
              <div class="value" id="projectedCustomers">296</div>
            </div>
            <div class="result-metric">
              <div class="label">Customers Lost in 12mo</div>
              <div class="value" id="customersLost12mo">204</div>
            </div>
            <div class="result-metric">
              <div class="label">Projected MRR (12mo)</div>
              <div class="value" id="projectedMrr">$14,227.68</div>
            </div>
            <div class="result-metric">
              <div class="label">MRR Lost in 12mo</div>
              <div class="value" id="mrrLost12mo">$10,772.32</div>
            </div>
            <div class="result-metric">
              <div class="label">Projected ARR (12mo)</div>
              <div class="value" id="projectedArr">$170,732.16</div>
            </div>
          </div>
        </div>

        <div class="advanced-results" style="display: none;">
          <div class="waterfall-section">
            <div class="section-tag">// revenue motion this month</div>
            <div class="waterfall">
              <div class="waterfall-row">
                <span class="wf-label">Starting MRR</span>
                <span class="wf-value" id="wfStartMrr">$25,000</span>
              </div>
              <div class="waterfall-row add">
                <span class="wf-label">+ New MRR</span>
                <span class="wf-value" id="wfNewMrr">+$0</span>
              </div>
              <div class="waterfall-row add">
                <span class="wf-label">+ Expansion MRR</span>
                <span class="wf-value" id="wfExpansionMrr">+$0</span>
              </div>
              <div class="waterfall-row subtract">
                <span class="wf-label">− Churned MRR</span>
                <span class="wf-value" id="wfChurnedMrr">-$1,000</span>
              </div>
              <div class="waterfall-row subtract">
                <span class="wf-label">− Contraction MRR</span>
                <span class="wf-value" id="wfContractionMrr">-$0</span>
              </div>
              <div class="waterfall-row total">
                <span class="wf-label">= Ending MRR</span>
                <span class="wf-value" id="wfEndMrr">$24,000</span>
              </div>
            </div>
          </div>

          <div class="churn-breakdown-section">
            <div class="section-tag">// voluntary vs involuntary churn</div>
            <div class="churn-split-bar" id="churnSplitBar">
              <div class="split-segment" id="voluntarySegment" style="width: 0%; background: #f0a040;"><span class="split-label">Voluntary</span></div>
              <div class="split-segment" id="involuntarySegment" style="width: 0%; background: #f05050;"><span class="split-label">Involuntary</span></div>
              <div class="split-segment" id="unattributedSegment" style="width: 100%; background: #888580;"><span class="split-label">Unattributed</span></div>
            </div>
            <div class="churn-insight" id="churnInsight"></div>
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
    </div>

    <div class="insight-block" id="insightBlock">
      At your current customer churn rate of <strong>5.00%</strong> and revenue churn rate of <strong>4.00%</strong>, you will lose approximately <strong>204 customers</strong> and <strong>$10,772.32 in MRR</strong> over the next 12 months. Moderate churn — investigate top cancellation reasons immediately.
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
        <p><strong>Customer Churn Rate</strong> = (Customers Lost ÷ Starting Customers) × 100</p>
        <p><strong>Revenue Churn Rate</strong> = (MRR Lost ÷ Starting MRR) × 100</p>
        <p><strong>12-Month Projection</strong> = Starting × (1 − Churn Rate/100)^12</p>
        <p><strong>Gross Revenue Retention</strong> = ((Starting MRR − MRR Lost) ÷ Starting MRR) × 100</p>
        <p><strong>Net Revenue Retention</strong> = ((Starting MRR − MRR Lost + Expansion MRR − Contraction MRR) ÷ Starting MRR) × 100</p>
        <p>Projections use compound monthly churn for realistic decay modeling.</p>
      </div>
    </div>
  </div>
</div>

<script src="../../assets/js/jquery.min.js"></script>
<script src="../../assets/js/chart.min.js"></script>
<script src="../../assets/js/tools.js"></script>
<script src="script.js"></script>

<?php include '../../footer.php'; ?>
