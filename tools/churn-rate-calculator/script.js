let currentMode = 'simple';
let chart = null;
const segmentColors = ['#c8f060', '#60d4f0', '#f0a040'];
let segmentCount = 1;

function getCurrencySymbol() {
  const currencyMap = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    BDT: '৳',
    INR: '₹',
    CAD: 'C$',
    AUD: 'A$',
    SGD: 'S$'
  };
  return currencyMap[$('#currency').val()] || '$';
}

function formatCurrency(value) {
  const symbol = getCurrencySymbol();
  return symbol + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatNumber(value) {
  return Math.round(value).toLocaleString('en-US');
}

function getChurnHealthBadge(rate) {
  if (rate < 0.5) return { label: 'Exceptional', class: 'exceptional' };
  if (rate < 1) return { label: 'Healthy', class: 'healthy' };
  if (rate < 2) return { label: 'Acceptable', class: 'acceptable' };
  if (rate < 5) return { label: 'Moderate', class: 'moderate' };
  if (rate < 10) return { label: 'Critical', class: 'critical' };
  return { label: 'Emergency', class: 'emergency' };
}

function getNrrHealthBadge(nrr) {
  if (nrr > 120) return { label: 'World-Class', class: 'world-class' };
  if (nrr > 110) return { label: 'Excellent', class: 'excellent' };
  if (nrr >= 100) return { label: 'Healthy', class: 'healthy' };
  if (nrr >= 90) return { label: 'Concerning', class: 'concerning' };
  return { label: 'Dangerous', class: 'dangerous' };
}

function getChurnInterpretation(rate) {
  if (rate === 0) return 'No churn this month — excellent.';
  if (rate < 0.5) return 'Exceptional retention. Focus on growth.';
  if (rate < 1) return 'Healthy churn for a mature SaaS product.';
  if (rate < 2) return 'Acceptable — monitor and aim to improve.';
  if (rate < 5) return 'Moderate churn — investigate top cancellation reasons immediately.';
  if (rate < 10) return 'Critical — retention must become your top priority.';
  return 'Emergency level. Product-market fit or onboarding needs urgent review.';
}

function calculate() {
  const customersStart = parseFloat($('#customersStart').val()) || 0;
  const customersLost = parseFloat($('#customersLost').val()) || 0;
  const mrrStart = parseFloat($('#mrrStart').val()) || 0;
  const mrrLost = parseFloat($('#mrrLost').val()) || 0;

  let customerChurnRate = 0;
  let revenueChurnRate = 0;
  let warning = '';

  if (customersStart > 0) {
    if (customersLost > customersStart) {
      customerChurnRate = 100;
      warning = 'Churned customers cannot exceed starting customers.';
    } else {
      customerChurnRate = (customersLost / customersStart) * 100;
    }
  }

  if (mrrStart > 0) {
    if (mrrLost > mrrStart) {
      revenueChurnRate = 100;
      if (!warning) warning = 'MRR lost cannot exceed starting MRR.';
    } else {
      revenueChurnRate = (mrrLost / mrrStart) * 100;
    }
  }

  if (warning) {
    $('#warningMessage').text(warning).show();
  } else {
    $('#warningMessage').hide();
  }

  const customersRemaining = Math.max(0, customersStart - customersLost);
  const mrrRemaining = Math.max(0, mrrStart - mrrLost);
  const arpcc = customersLost > 0 ? mrrLost / customersLost : 0;

  $('#customerChurnRate').text(customerChurnRate.toFixed(2) + '%');
  $('#revenueChurnRate').text(revenueChurnRate.toFixed(2) + '%');
  $('#customersRemaining').text(formatNumber(customersRemaining));
  $('#mrrRemaining').text(formatCurrency(mrrRemaining));
  $('#arpcc').text(formatCurrency(arpcc));

  const customerBadge = getChurnHealthBadge(customerChurnRate);
  $('#customerChurnBadge').text(customerBadge.label).removeClass().addClass('health-badge ' + customerBadge.class);
  $('#customerChurnInterpretation').text(getChurnInterpretation(customerChurnRate));

  const revenueBadge = getChurnHealthBadge(revenueChurnRate);
  $('#revenueChurnBadge').text(revenueBadge.label).removeClass().addClass('health-badge ' + revenueBadge.class);

  const projectedCustomers12 = customersStart * Math.pow(1 - customerChurnRate / 100, 12);
  const customersLost12 = customersStart - projectedCustomers12;
  const projectedMrr12 = mrrStart * Math.pow(1 - revenueChurnRate / 100, 12);
  const mrrLost12 = mrrStart - projectedMrr12;
  const projectedArr12 = projectedMrr12 * 12;

  $('#projectedCustomers').text(formatNumber(projectedCustomers12));
  $('#customersLost12mo').text(formatNumber(customersLost12));
  $('#projectedMrr').text(formatCurrency(projectedMrr12));
  $('#mrrLost12mo').text(formatCurrency(mrrLost12));
  $('#projectedArr').text(formatCurrency(projectedArr12));

  if (currentMode === 'advanced') {
    calculateAdvanced(customersStart, mrrStart, customerChurnRate, revenueChurnRate, customersLost, mrrLost, mrrRemaining, customersRemaining);
  }

  updateChart(customersStart, mrrStart, customerChurnRate, revenueChurnRate);
  updateInsightBlock(customerChurnRate, revenueChurnRate, customersLost12, mrrLost12);
}

function calculateAdvanced(customersStart, mrrStart, customerChurnRate, revenueChurnRate, customersLost, mrrLost, mrrRemaining, customersRemaining) {
  const voluntaryChurn = parseFloat($('#voluntaryChurn').val()) || 0;
  const involuntaryChurn = parseFloat($('#involuntaryChurn').val()) || 0;
  const expansionMrr = parseFloat($('#expansionMrr').val()) || 0;
  const contractionMrr = parseFloat($('#contractionMrr').val()) || 0;
  const newMrr = parseFloat($('#newMrr').val()) || 0;

  let warning = $('#warningMessage').text();
  if (voluntaryChurn + involuntaryChurn > customersLost && customersLost > 0) {
    warning = warning ? warning + ' ' : '';
    if (!warning.includes('Voluntary')) warning += 'Voluntary + involuntary churn exceeds total churned customers.';
  }
  if (warning) $('#warningMessage').text(warning).show();

  let voluntaryRate = 0;
  let involuntaryRate = 0;
  if (customersStart > 0) {
    voluntaryRate = (voluntaryChurn / customersStart) * 100;
    involuntaryRate = (involuntaryChurn / customersStart) * 100;
  }

  $('#voluntaryChurnRate').text(voluntaryRate.toFixed(2) + '%');
  $('#involuntaryChurnRate').text(involuntaryRate.toFixed(2) + '%');

  let grr = 0;
  if (mrrStart > 0) {
    grr = ((mrrStart - mrrLost) / mrrStart) * 100;
  }
  grr = Math.min(100, grr);
  $('#grr').text(grr.toFixed(2) + '%');

  let nrr = 0;
  if (mrrStart > 0) {
    nrr = ((mrrStart - mrrLost + expansionMrr - contractionMrr) / mrrStart) * 100;
  }
  $('#nrr').text(nrr.toFixed(2) + '%');

  const nrrBadge = getNrrHealthBadge(nrr);
  $('#nrrBadge').text(nrrBadge.label).removeClass().addClass('health-badge ' + nrrBadge.class);

  const mrrMovementsNet = newMrr + expansionMrr - mrrLost - contractionMrr;
  $('#mrrMovementsNet').text(formatCurrency(mrrMovementsNet));

  calculateSegments();

  const endingMrr = mrrStart + newMrr + expansionMrr - mrrLost - contractionMrr;
  $('#wfStartMrr').text(formatCurrency(mrrStart));
  $('#wfNewMrr').text('+' + formatCurrency(newMrr));
  $('#wfExpansionMrr').text('+' + formatCurrency(expansionMrr));
  $('#wfChurnedMrr').text('-' + formatCurrency(mrrLost));
  $('#wfContractionMrr').text('-' + formatCurrency(contractionMrr));
  $('#wfEndMrr').text(formatCurrency(endingMrr));

  updateChurnSplitBar(customersLost, voluntaryChurn, involuntaryChurn);
}

function calculateSegments() {
  let highestChurnRate = 0;
  let highestSegment = '—';

  $('.segment-row').each(function(index) {
    const start = parseFloat($(this).find('.segment-start').val()) || 0;
    const churned = parseFloat($(this).find('.segment-churned').val()) || 0;
    const name = $(this).find('.segment-name').val() || 'Plan ' + (index + 1);

    if (start > 0 && churned > start) {
      $(this).find('.segment-churned').addClass('input-warning');
    } else {
      $(this).find('.segment-churned').removeClass('input-warning');
    }

    if (start > 0) {
      const churnRate = (churned / start) * 100;
      if (churnRate > highestChurnRate) {
        highestChurnRate = churnRate;
        highestSegment = name;
      }
    }
  });

  $('#highestChurnSegment').text(highestSegment);
}

function updateChurnSplitBar(totalChurned, voluntary, involuntary) {
  const unattributed = Math.max(0, totalChurned - voluntary - involuntary);
  const total = totalChurned || 1;

  const voluntaryPct = (voluntary / total) * 100;
  const involuntaryPct = (involuntary / total) * 100;
  const unattributedPct = (unattributed / total) * 100;

  $('#voluntarySegment').css('width', voluntaryPct + '%').find('.split-label').text(voluntary > 0 ? 'Voluntary ' + Math.round(voluntaryPct) + '%' : '');
  $('#involuntarySegment').css('width', involuntaryPct + '%').find('.split-label').text(involuntary > 0 ? 'Involuntary ' + Math.round(involuntaryPct) + '%' : '');
  $('#unattributedSegment').css('width', unattributedPct + '%').find('.split-label').text(unattributed > 0 ? 'Unattributed ' + Math.round(unattributedPct) + '%' : '');

  let insight = '';
  if (involuntary > 0) {
    insight += Math.round(involuntaryPct) + '% of your churn is involuntary (failed payments). This is recoverable with a dunning flow. ';
  }
  if (voluntary > 0) {
    insight += Math.round(voluntaryPct) + '% is voluntary — requires product or pricing improvements.';
  }
  if (!insight) {
    insight = 'Add churn breakdown data to see insights.';
  }
  $('#churnInsight').text(insight);
}

function updateChart(customersStart, mrrStart, customerChurnRate, revenueChurnRate) {
  const months = [];
  const customersData = [];
  const mrrData = [];
  const customersLostData = [];
  const mrrLostData = [];

  for (let i = 0; i <= 12; i++) {
    months.push('Month ' + i);
    const projectedCustomers = customersStart * Math.pow(1 - customerChurnRate / 100, i);
    const projectedMrr = mrrStart * Math.pow(1 - revenueChurnRate / 100, i);
    customersData.push(projectedCustomers);
    mrrData.push(projectedMrr);
    customersLostData.push(customersStart - projectedCustomers);
    mrrLostData.push(mrrStart - projectedMrr);
  }

  const ctx = document.getElementById('projectionChart').getContext('2d');

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Projected Customers',
          data: customersData,
          borderColor: '#c8f060',
          backgroundColor: 'rgba(200, 240, 96, 0.1)',
          fill: true,
          tension: 0.3,
          yAxisID: 'y'
        },
        {
          label: 'Projected MRR',
          data: mrrData,
          borderColor: '#60d4f0',
          backgroundColor: 'rgba(96, 212, 240, 0.1)',
          fill: true,
          tension: 0.3,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            font: { family: 'var(--mono)', size: 11 }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.8)',
          titleFont: { family: 'var(--mono)', size: 12 },
          bodyFont: { family: 'var(--mono)', size: 11 },
          callbacks: {
            label: function(context) {
              const idx = context.dataIndex;
              const symbol = getCurrencySymbol();
              if (context.datasetIndex === 0) {
                return context.dataset.label + ': ' + formatNumber(customersData[idx]) + ' (Lost: ' + formatNumber(customersLostData[idx]) + ')';
              }
              return context.dataset.label + ': ' + symbol + mrrData[idx].toLocaleString('en-US', { minimumFractionDigits: 2 }) + ' (Lost: ' + symbol + mrrLostData[idx].toLocaleString('en-US', { minimumFractionDigits: 2 }) + ')';
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { font: { family: 'var(--mono)', size: 10 }, color: 'var(--muted)' }
        },
        y: {
          type: 'linear',
          position: 'left',
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { font: { family: 'var(--mono)', size: 10 }, color: '#c8f060' },
          title: { display: true, text: 'Customers', font: { family: 'var(--mono)', size: 10 }, color: '#c8f060' }
        },
        y1: {
          type: 'linear',
          position: 'right',
          grid: { drawOnChartArea: false },
          ticks: { font: { family: 'var(--mono)', size: 10 }, color: '#60d4f0' },
          title: { display: true, text: 'MRR', font: { family: 'var(--mono)', size: 10 }, color: '#60d4f0' }
        }
      }
    }
  });
}

function updateInsightBlock(customerChurnRate, revenueChurnRate, customersLost12, mrrLost12) {
  const customerBadge = getChurnHealthBadge(customerChurnRate);
  let healthSentence = '';
  if (customerChurnRate < 1) healthSentence = 'Your churn rates are healthy.';
  else if (customerChurnRate < 5) healthSentence = 'Monitor your churn closely.';
  else healthSentence = 'Retention must become your top priority.';

  const nrrVal = parseFloat($('#nrr').text()) || 0;
  let nrrSentence = '';
  if (nrrVal > 100) nrrSentence = 'Your expansion revenue more than offsets churn — you have negative churn, which is exceptional.';
  else if (nrrVal < 90 && currentMode === 'advanced') nrrSentence = 'Your net revenue retention is below 90%, which means existing customers are shrinking your revenue even before new sales.';

  $('#insightBlock').html(
    'At your current customer churn rate of <strong>' + customerChurnRate.toFixed(2) + '%</strong> and revenue churn rate of <strong>' + revenueChurnRate.toFixed(2) + '%</strong>, ' +
    'you will lose approximately <strong>' + formatNumber(customersLost12) + ' customers</strong> and <strong>' + formatCurrency(mrrLost12) + ' in MRR</strong> over the next 12 months. ' +
    healthSentence + ' ' + nrrSentence
  );
}

function addSegment() {
  if (segmentCount >= 3) return;

  segmentCount++;
  const colors = ['#c8f060', '#60d4f0', '#f0a040'];

  const newSegment = $(`
    <div class="segment-row" data-segment="${segmentCount}">
      <div class="segment-color" style="background: ${colors[segmentCount - 1]};"></div>
      <input type="text" class="segment-name" value="Plan ${segmentCount}" placeholder="Plan Name">
      <input type="number" class="segment-start" value="0" min="0" max="9999999" step="1" placeholder="Starting">
      <input type="number" class="segment-churned" value="0" min="0" max="9999999" step="1" placeholder="Churned">
      <input type="number" class="segment-mrrLost" value="0" min="0" max="9999999" step="1" placeholder="MRR Lost">
      <button class="segment-remove" title="Remove segment">×</button>
    </div>
  `);

  $('#segmentsContainer').append(newSegment);
  newSegment.find('input').on('input', calculate);
  newSegment.find('.segment-remove').on('click', function() {
    $(this).closest('.segment-row').remove();
    segmentCount--;
    updateSegmentButtons();
    calculate();
  });

  updateSegmentButtons();
}

function updateSegmentButtons() {
  $('#addSegmentBtn').prop('disabled', segmentCount >= 3);
  $('.segment-remove').each(function() {
    const row = $(this).closest('.segment-row');
    const totalRows = $('#segmentsContainer .segment-row').length;
    if (totalRows <= 1) {
      $(this).addClass('hidden');
    } else {
      $(this).removeClass('hidden');
    }
  });
}

function toggleExplanation() {
  $('.explanation-toggle').toggleClass('open');
  $('#explanationContent').toggleClass('open');
}

function copyResults() {
  const customersStart = $('#customersStart').val();
  const customersLost = $('#customersLost').val();
  const mrrStart = $('#mrrStart').val();
  const mrrLost = $('#mrrLost').val();
  const customerChurnRate = $('#customerChurnRate').text();
  const revenueChurnRate = $('#revenueChurnRate').text();
  const customersRemaining = $('#customersRemaining').text();
  const mrrRemaining = $('#mrrRemaining').text();
  const projectedCustomers = $('#projectedCustomers').text();
  const projectedMrr = $('#projectedMrr').text();

  const text = `Churn Rate Calculator Results
===================
Customers Start: ${customersStart}
Customers Lost: ${customersLost}
MRR Start: $${mrrStart}
MRR Lost: $${mrrLost}

Customer Churn Rate: ${customerChurnRate}
Revenue Churn Rate: ${revenueChurnRate}
Customers Remaining: ${customersRemaining}
MRR Remaining: ${mrrRemaining}

12-Month Projection:
Projected Customers: ${projectedCustomers}
Projected MRR: ${projectedMrr}`;

  navigator.clipboard.writeText(text).then(function() {
    $('#copyResults').text('Copied!');
    setTimeout(function() {
      $('#copyResults').text('Copy Results');
    }, 2000);
  });
}

function shareLink() {
  const params = new URLSearchParams();
  params.set('customersStart', $('#customersStart').val());
  params.set('customersLost', $('#customersLost').val());
  params.set('mrrStart', $('#mrrStart').val());
  params.set('mrrLost', $('#mrrLost').val());
  params.set('mode', currentMode);

  if (currentMode === 'advanced') {
    params.set('voluntaryChurn', $('#voluntaryChurn').val());
    params.set('involuntaryChurn', $('#involuntaryChurn').val());
    params.set('expansionMrr', $('#expansionMrr').val());
    params.set('contractionMrr', $('#contractionMrr').val());
    params.set('newMrr', $('#newMrr').val());
    params.set('currency', $('#currency').val());

    $('.segment-row').each(function(index) {
      params.set('seg' + (index + 1) + 'name', $(this).find('.segment-name').val());
      params.set('seg' + (index + 1) + 'start', $(this).find('.segment-start').val());
      params.set('seg' + (index + 1) + 'churned', $(this).find('.segment-churned').val());
      params.set('seg' + (index + 1) + 'mrrLost', $(this).find('.segment-mrrLost').val());
    });
  }

  const url = window.location.pathname + '?' + params.toString();
  navigator.clipboard.writeText(window.location.origin + url).then(function() {
    $('#shareLink').text('Link Copied!');
    setTimeout(function() {
      $('#shareLink').text('Share Link');
    }, 2000);
  });
}

function loadFromUrl() {
  const params = new URLSearchParams(window.location.search);

  if (params.has('customersStart')) $('#customersStart').val(params.get('customersStart'));
  if (params.has('customersLost')) $('#customersLost').val(params.get('customersLost'));
  if (params.has('mrrStart')) $('#mrrStart').val(params.get('mrrStart'));
  if (params.has('mrrLost')) $('#mrrLost').val(params.get('mrrLost'));

  if (params.get('mode') === 'advanced') {
    currentMode = 'advanced';
    $('.mode-btn').removeClass('active');
    $('.mode-btn[data-mode="advanced"]').addClass('active');
    $('.advanced-inputs, .advanced-results').show();

    if (params.has('voluntaryChurn')) $('#voluntaryChurn').val(params.get('voluntaryChurn'));
    if (params.has('involuntaryChurn')) $('#involuntaryChurn').val(params.get('involuntaryChurn'));
    if (params.has('expansionMrr')) $('#expansionMrr').val(params.get('expansionMrr'));
    if (params.has('contractionMrr')) $('#contractionMrr').val(params.get('contractionMrr'));
    if (params.has('newMrr')) $('#newMrr').val(params.get('newMrr'));
    if (params.has('currency')) $('#currency').val(params.get('currency'));

    let segmentsLoaded = 0;
    for (let i = 1; i <= 3; i++) {
      const name = params.get('seg' + i + 'name');
      if (name) {
        if (i > 1) addSegment();
        const rows = $('.segment-row');
        const row = rows.eq(rows.length - 1);
        row.find('.segment-name').val(name);
        row.find('.segment-start').val(params.get('seg' + i + 'start'));
        row.find('.segment-churned').val(params.get('seg' + i + 'churned'));
        row.find('.segment-mrrLost').val(params.get('seg' + i + 'mrrLost'));
        segmentsLoaded++;
      }
    }
    segmentCount = Math.max(1, segmentsLoaded);
    updateSegmentButtons();
  }
}

$(document).ready(function() {
  loadFromUrl();
  calculate();

  $('.mode-btn').on('click', function() {
    $('.mode-btn').removeClass('active');
    $(this).addClass('active');
    currentMode = $(this).data('mode');

    if (currentMode === 'simple') {
      $('.advanced-inputs, .advanced-results').hide();
    } else {
      $('.advanced-inputs, .advanced-results').show();
    }
    calculate();
  });

  $('#customersStart, #customersLost, #mrrStart, #mrrLost').on('input', calculate);
  $('#voluntaryChurn, #involuntaryChurn, #expansionMrr, #contractionMrr, #newMrr, #currency').on('input', calculate);

  $('#addSegmentBtn').on('click', addSegment);

  $('.segment-row input').on('input', calculate);
  $('.segment-remove').on('click', function() {
    $(this).closest('.segment-row').remove();
    segmentCount--;
    updateSegmentButtons();
    calculate();
  });

  $('#copyResults').on('click', copyResults);
  $('#shareLink').on('click', shareLink);
});
