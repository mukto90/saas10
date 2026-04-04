<?php
$page_title = 'Fundraising Calculator';
$page_desc  = 'Calculate valuation, dilution, and founder ownership for your next funding round. Model SAFE notes, option pools, and cap table changes.';
include '../../header.php';
?>
<link rel="stylesheet" href="../../assets/css/tools.css">
<link rel="stylesheet" href="style.css">

<div class="tool-page">
  <div class="wrap">
    <a href="/" class="back-link">← All tools</a>
    
    <div class="page-header">
      <h1>Fundraising Calculator</h1>
      <p>Calculate valuation, dilution, and ownership for your next funding round.</p>
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
          <input type="number" id="currentArr" value="500000" min="0" max="999999999" step="1">
        </div>
        
        <div class="input-group">
          <label>Target Raise ($)</label>
          <input type="number" id="targetRaise" value="2000000" min="0" max="999999999" step="1">
        </div>
        
        <div class="input-group">
          <label>Pre-Money Valuation ($)</label>
          <input type="number" id="preMoney" value="8000000" min="0" max="999999999" step="1">
        </div>
        
        <div class="input-group">
          <label>Your Current Ownership (%)</label>
          <input type="number" id="founderOwnership" value="80" min="0" max="100" step="0.1">
        </div>

        <div class="advanced-inputs" style="display: none;">
          <div class="input-section">
            <div class="section-title">Cap Table Context</div>
            <div class="input-group">
              <label>Existing Investor Ownership (%)</label>
              <input type="number" id="existingInvestor" value="15" min="0" max="100" step="0.1">
            </div>
            <div class="input-group">
              <label>Current Option Pool (%)</label>
              <input type="number" id="currentPool" value="5" min="0" max="50" step="0.1">
            </div>
            <div class="input-group">
              <label>New Option Pool (pre-money, %)</label>
              <input type="number" id="newPool" value="0" min="0" max="30" step="0.1">
            </div>
          </div>

          <div class="input-section">
            <div class="section-title">Revenue Metrics</div>
            <div class="input-group">
              <label>Current MRR ($)</label>
              <input type="number" id="currentMrr" value="41667" min="0" max="9999999" step="1">
            </div>
            <div class="input-group">
              <label>ARR Growth Rate YoY (%)</label>
              <input type="number" id="arrGrowth" value="100" min="0" max="1000" step="1">
            </div>
            <div class="input-group">
              <label>Gross Margin (%)</label>
              <input type="number" id="grossMargin" value="75" min="0" max="100" step="0.1">
            </div>
            <div class="input-group">
              <label>Net Revenue Retention (%)</label>
              <input type="number" id="nrr" value="110" min="0" max="200" step="0.1">
            </div>
          </div>

          <div class="input-section">
            <div class="section-title">SAFE / Convertible Note</div>
            <div class="input-group">
              <label>Outstanding SAFE / Note ($)</label>
              <input type="number" id="safeAmount" value="0" min="0" max="999999999" step="1">
            </div>
            <div class="input-group">
              <label>Valuation Cap ($)</label>
              <input type="number" id="safeCap" value="0" min="0" max="999999999" step="1">
            </div>
            <div class="input-group">
              <label>Discount Rate (%)</label>
              <input type="number" id="safeDiscount" value="20" min="0" max="50" step="0.1">
            </div>
          </div>

          <div class="input-section">
            <div class="section-title">Secondary Sale</div>
            <div class="input-group">
              <label>Secondary / Liquidity Amount ($)</label>
              <input type="number" id="secondaryAmount" value="0" min="0" max="999999999" step="1">
            </div>
          </div>

          <div class="input-section">
            <div class="section-title">Multiple Investors</div>
            <div id="investorContainer">
              <div class="investor-row" data-investor="0">
                <input type="text" class="investor-name" value="Lead VC" placeholder="Investor">
                <input type="number" class="investor-commit" value="0" min="0" max="999999999" step="1" placeholder="Commitment">
                <label class="pro-rata-toggle">
                  <input type="checkbox" class="investor-prorata">
                  <span>Pro-rata</span>
                </label>
              </div>
            </div>
            <button class="add-investor-btn" id="addInvestorBtn">+ Add Investor</button>
            <div class="investor-warning" id="investorWarning" style="display: none;"></div>
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
            <div class="label">Post-Money Valuation</div>
            <div class="value" id="postMoney">$10,000,000</div>
          </div>
          <div class="result-metric">
            <div class="label">New Investor Ownership</div>
            <div class="value" id="newInvestorPct">20.0%</div>
          </div>
        </div>

        <div class="results-row">
          <div class="result-metric" id="founderPostContainer">
            <div class="label">Founder Ownership (post-raise)</div>
            <div class="value" id="founderPost">64.0%</div>
            <div class="sub" id="dilutionText">Strong founder control retained.</div>
          </div>
          <div class="result-metric" id="arrMultipleContainer">
            <div class="label">ARR Multiple (pre-money)</div>
            <div class="value" id="arrMultiple">16.0x <span class="benchmark-badge" id="arrBadge">Strong</span></div>
          </div>
        </div>

        <div class="results-row">
          <div class="result-metric">
            <div class="label">Dilution</div>
            <div class="value" id="dilutionPct">20.0%</div>
          </div>
          <div class="result-metric">
            <div class="label">ARR Multiple (post-money)</div>
            <div class="value" id="arrMultiplePost">20.0x</div>
          </div>
        </div>

        <div class="benchmark-note">Seed: 10-25x ARR | Series A: 8-15x ARR | Series B+: 5-10x ARR</div>

        <div class="advanced-results" style="display: none;">
          <div class="results-row" style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border);">
            <div class="result-metric">
              <div class="label">Total Dilution (raise + pool)</div>
              <div class="value" id="totalDilution">20.0%</div>
            </div>
            <div class="result-metric">
              <div class="label">Founder Ownership (fully diluted)</div>
              <div class="value" id="founderDiluted">—</div>
            </div>
          </div>
          <div class="results-row">
            <div class="result-metric">
              <div class="label">SAFE Conversion</div>
              <div class="value" id="safeConversion">—</div>
            </div>
            <div class="result-metric">
              <div class="label">Capital Efficiency</div>
              <div class="value" id="capitalEfficiency">—</div>
            </div>
          </div>
          <div class="results-row">
            <div class="result-metric">
              <div class="label">Implied ARR at Exit</div>
              <div class="value" id="impliedExit">—</div>
            </div>
            <div class="result-metric">
              <div class="label">Revenue Multiple Benchmark</div>
              <div class="value" id="revBenchmark">—</div>
            </div>
          </div>
        </div>

        <div class="feedback-line" id="feedback">At a $10M post-money, you're raising at a 16x ARR multiple — strong for your stage.</div>
      </div>
    </div>

    <div class="cap-table-section">
      <div class="card-label">Cap Table Visualization</div>
      <div class="cap-table-bar">
        <div class="cap-segment" id="founderSegment" style="width: 64%;">
          <span class="seg-label">Founder 64%</span>
        </div>
        <div class="cap-segment" id="investorSegment" style="width: 20%;">
          <span class="seg-label">New Investor 20%</span>
        </div>
        <div class="cap-segment" id="existingSegment" style="width: 12%;">
          <span class="seg-label">Existing 12%</span>
        </div>
        <div class="cap-segment" id="poolSegment" style="width: 4%;">
          <span class="seg-label">Pool 4%</span>
        </div>
      </div>
      <div class="cap-legend">
        <div class="legend-item"><span class="legend-dot" style="background:#c8f060"></span>Founder</div>
        <div class="legend-item"><span class="legend-dot" style="background:#60d4f0"></span>New Investor</div>
        <div class="legend-item"><span class="legend-dot" style="background:#a082f0"></span>Existing</div>
        <div class="legend-item"><span class="legend-dot" style="background:#f0a040"></span>Option Pool</div>
        <div class="legend-item" id="safeLegend" style="display:none;"><span class="legend-dot" style="background:#f05050"></span>SAFE</div>
      </div>
    </div>

    <div class="round-table-section" id="roundTableSection" style="display: none;">
      <div class="card-label">Round Modeling</div>
      <table class="round-table">
        <thead>
          <tr>
            <th>Round</th>
            <th>Raise</th>
            <th>Pre-Money</th>
            <th>Dilution</th>
            <th>Founder %</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>This Round</td>
            <td id="rtThisRaise">$2,000,000</td>
            <td id="rtThisPre">$8,000,000</td>
            <td id="rtThisDilution">20.0%</td>
            <td id="rtThisFounder">64.0%</td>
          </tr>
          <tr>
            <td><input type="text" id="rtA_Name" value="Series A" class="rt-input"></td>
            <td><input type="number" id="rtA_Raise" value="5000000" class="rt-input"></td>
            <td><input type="number" id="rtA_Pre" value="25000000" class="rt-input"></td>
            <td id="rtA_Dilution">—</td>
            <td id="rtA_Founder">—</td>
          </tr>
          <tr>
            <td><input type="text" id="rtB_Name" value="Series B" class="rt-input"></td>
            <td><input type="number" id="rtB_Raise" value="15000000" class="rt-input"></td>
            <td><input type="number" id="rtB_Pre" value="75000000" class="rt-input"></td>
            <td id="rtB_Dilution">—</td>
            <td id="rtB_Founder">—</td>
          </tr>
        </tbody>
      </table>
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
        <p><strong>Post-Money Valuation</strong> = Pre-Money + Raise Amount</p>
        <p><strong>New Investor %</strong> = Raise Amount ÷ Post-Money × 100</p>
        <p><strong>Founder Post %</strong> = Founder Pre % × (1 − New Investor %)</p>
        <p><strong>ARR Multiple</strong> = Valuation ÷ Current ARR</p>
        <p>Option pool expansion happens pre-money, diluting founders before the investment.</p>
      </div>
    </div>
  </div>
</div>

<script src="../../assets/js/jquery.min.js"></script>
<script src="../../assets/js/tools.js"></script>
<script src="script.js"></script>

<?php include '../../footer.php'; ?>
