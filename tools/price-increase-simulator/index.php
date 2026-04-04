<?php
$page_title = 'Price Increase Simulator';
$page_desc  = 'Model the financial impact of raising your SaaS prices. Calculate break-even churn rate and see exactly how much churn you can absorb.';
include '../../header.php';
?>
<link rel="stylesheet" href="../../assets/css/tools.css">
<link rel="stylesheet" href="style.css">

<div class="tool-page">
  <div class="wrap">
    <a href="/" class="back-link">← All tools</a>
    
    <div class="page-header">
      <h1>Price Increase Simulator</h1>
      <p>See exactly how much churn you can absorb before a price increase becomes net negative.</p>
    </div>

    <div class="mode-toggle">
      <button class="mode-btn active" data-mode="simple">Simple</button>
      <button class="mode-btn" data-mode="advanced">Advanced</button>
    </div>

    <div class="tool-grid">
      <div class="card">
        <div class="card-label">Your Inputs</div>
        
        <div class="input-group">
          <label>Current Price / Month ($)</label>
          <input type="number" id="currentPrice" value="49" min="0" max="9999999" step="0.01">
        </div>
        
        <div class="input-group">
          <label>New Price / Month ($)</label>
          <input type="number" id="newPrice" value="69" min="0" max="9999999" step="0.01">
        </div>
        
        <div class="input-group">
          <label>Current Customers</label>
          <input type="number" id="customers" value="200" min="0" max="9999999" step="1">
        </div>
        
        <div class="input-group">
          <label>Expected Churn from Price Increase (%)</label>
          <input type="number" id="churn" value="10" min="0" max="100" step="0.1">
        </div>

        <div class="advanced-inputs" style="display: none;">
          <div class="input-section">
            <div class="section-title">Plan Segmentation</div>
            <div class="plan-section" id="planSection">
              <div class="plan-row" data-plan="0">
                <input type="text" class="plan-name" value="Pro" placeholder="Plan Name">
                <input type="number" class="plan-current" value="49" min="0" max="9999999" step="0.01" placeholder="Current $">
                <input type="number" class="plan-new" value="69" min="0" max="9999999" step="0.01" placeholder="New $">
                <input type="number" class="plan-customers" value="150" min="0" max="9999999" step="1" placeholder="Customers">
                <input type="number" class="plan-churn" value="10" min="0" max="100" step="0.1" placeholder="Churn %">
                <label class="toggle-label small">
                  <input type="checkbox" class="plan-grandfather">
                  <span class="toggle-switch small"></span>
                </label>
                <button class="plan-remove" title="Remove">×</button>
              </div>
              <div class="plan-row" data-plan="1">
                <input type="text" class="plan-name" value="Enterprise" placeholder="Plan Name">
                <input type="number" class="plan-current" value="199" min="0" max="9999999" step="0.01" placeholder="Current $">
                <input type="number" class="plan-new" value="299" min="0" max="9999999" step="0.01" placeholder="New $">
                <input type="number" class="plan-customers" value="50" min="0" max="9999999" step="1" placeholder="Customers">
                <input type="number" class="plan-churn" value="5" min="0" max="100" step="0.1" placeholder="Churn %">
                <label class="toggle-label small">
                  <input type="checkbox" class="plan-grandfather">
                  <span class="toggle-switch small"></span>
                </label>
                <button class="plan-remove" title="Remove">×</button>
              </div>
            </div>
            <button class="add-plan-btn" id="addPlanBtn">+ Add Plan</button>
          </div>

          <div class="input-section" id="grandfatherSection">
            <div class="section-title">Grandfathering</div>
            <div class="input-group">
              <label>New Customers / Month</label>
              <input type="number" id="newCustomers" value="20" min="0" max="9999999" step="1">
            </div>
            <div class="input-group">
              <label>Force Migration in Month # (0 = never)</label>
              <input type="number" id="sunsetMonth" value="0" min="0" max="36" step="1">
            </div>
          </div>

          <div class="input-section">
            <div class="section-title">Billing Mix</div>
            <div class="input-group">
              <label>Monthly Billing (%)</label>
              <input type="number" id="monthlyPct" value="60" min="0" max="100" step="1">
            </div>
            <div class="input-group">
              <label>Annual Billing (%)</label>
              <input type="number" id="annualPct" value="40" min="0" max="100" step="1">
            </div>
          </div>

          <div class="input-section">
            <div class="section-title">Rollout Strategy</div>
            <div class="input-group">
              <label>Rollout Type</label>
              <select id="rolloutType">
                <option value="once">All at once</option>
                <option value="3month">Phased over 3 months</option>
                <option value="6month">Phased over 6 months</option>
                <option value="newonly">New customers only</option>
              </select>
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
        
        <div class="verdict-box" id="verdictBox">
          <div class="verdict-text" id="verdictText">Safe to increase</div>
          <div class="verdict-sub" id="verdictSub">You can absorb this churn and still come out ahead.</div>
        </div>

        <div class="results-grid">
          <div class="result-metric">
            <div class="label">Current MRR</div>
            <div class="value" id="currentMrr">$9,800</div>
          </div>
          <div class="result-metric">
            <div class="label">Customers Lost</div>
            <div class="value" id="customersLost">20</div>
          </div>
          <div class="result-metric">
            <div class="label">Remaining Customers</div>
            <div class="value" id="remainingCustomers">180</div>
          </div>
          <div class="result-metric">
            <div class="label">New MRR</div>
            <div class="value" id="newMrr">$12,420</div>
          </div>
        </div>

        <div class="results-row delta-row">
          <div class="result-metric highlight">
            <div class="label">MRR Delta</div>
            <div class="value" id="mrrDelta">+$2,620</div>
          </div>
          <div class="result-metric">
            <div class="label">MRR Delta %</div>
            <div class="value" id="mrrDeltaPct">+26.7%</div>
          </div>
        </div>

        <div class="results-row">
          <div class="result-metric">
            <div class="label">Break-Even Churn</div>
            <div class="value" id="breakEvenChurn">30.4%</div>
          </div>
          <div class="result-metric">
            <div class="label">Max Absorbable Churn</div>
            <div class="value" id="maxChurn">100%</div>
          </div>
        </div>

        <div class="results-row">
          <div class="result-metric">
            <div class="label">ARR Impact</div>
            <div class="value" id="arrImpact">+$31,440</div>
          </div>
        </div>

        <div class="advanced-results" style="display: none;">
          <div class="results-row">
            <div class="result-metric">
              <div class="label">Grandfathered MRR</div>
              <div class="value" id="grandfatheredMrr">$4,900</div>
            </div>
            <div class="result-metric">
              <div class="label">New Price MRR</div>
              <div class="value" id="newPriceMrr">$7,520</div>
            </div>
          </div>
          <div class="results-row">
            <div class="result-metric">
              <div class="label">Blended ARPU</div>
              <div class="value" id="blendedArpu">$69</div>
            </div>
            <div class="result-metric">
              <div class="label">Monthly Billing Impact</div>
              <div class="value" id="monthlyImpact">$1,512</div>
            </div>
          </div>
          <div class="results-row">
            <div class="result-metric">
              <div class="label">Annual Billing Impact</div>
              <div class="value" id="annualImpact">$1,008</div>
            </div>
            <div class="result-metric">
              <div class="label">12-Mo Cumulative MRR Gain</div>
              <div class="value" id="cumulativeGain">$31,440</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="warning-message" id="warningMessage" style="display: none;"></div>

    <div class="chart-section">
      <div class="card-label">Churn Sensitivity</div>
      <div class="chart-container">
        <canvas id="churnChart"></canvas>
      </div>
    </div>

    <div class="chart-section" id="projectionSection" style="display: none;">
      <div class="card-label">12-Month MRR Projection</div>
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
        <p><strong>MRR Delta</strong> = (Remaining Customers × New Price) − (Original Customers × Current Price)</p>
        <p><strong>Break-Even Churn</strong> = The churn rate where new MRR equals current MRR. Below this, you're net positive.</p>
        <p><strong>Max Absorbable Churn</strong> = The churn rate at which MRR drops to $0. Any churn below this is technically "survivable" but likely not desirable.</p>
        <p><strong>Grandfathering</strong> = Existing customers stay at old price, only new customers pay new price.</p>
      </div>
    </div>
  </div>
</div>

<script src="../../assets/js/jquery.min.js"></script>
<script src="../../assets/js/tools.js"></script>
<script src="script.js"></script>

<?php include '../../footer.php'; ?>
