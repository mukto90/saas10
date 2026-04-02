(function($) {
  'use strict';

  var currencySymbols = {
    USD: '$', EUR: '€', GBP: '£', BDT: '৳', INR: '₹', CAD: 'C$', AUD: 'A$', SGD: 'S$'
  };

  var $currentPrice = $('#currentPrice');
  var $newPrice = $('#newPrice');
  var $customers = $('#customers');
  var $churn = $('#churn');
  var $newCustomers = $('#newCustomers');
  var $sunsetMonth = $('#sunsetMonth');
  var $monthlyPct = $('#monthlyPct');
  var $annualPct = $('#annualPct');
  var $rolloutType = $('#rolloutType');
  var $currency = $('#currency');

  var $verdictBox = $('#verdictBox');
  var $verdictText = $('#verdictText');
  var $verdictSub = $('#verdictSub');
  var $currentMrr = $('#currentMrr');
  var $customersLost = $('#customersLost');
  var $remainingCustomers = $('#remainingCustomers');
  var $newMrr = $('#newMrr');
  var $mrrDelta = $('#mrrDelta');
  var $mrrDeltaPct = $('#mrrDeltaPct');
  var $breakEvenChurn = $('#breakEvenChurn');
  var $maxChurn = $('#maxChurn');
  var $arrImpact = $('#arrImpact');
  var $grandfatheredMrr = $('#grandfatheredMrr');
  var $newPriceMrr = $('#newPriceMrr');
  var $blendedArpu = $('#blendedArpu');
  var $monthlyImpact = $('#monthlyImpact');
  var $annualImpact = $('#annualImpact');
  var $cumulativeGain = $('#cumulativeGain');

  var planCount = 2;
  var currentMode = 'simple';

  function getSymbol() {
    return currencySymbols[$currency.val()] || '$';
  }

  function formatCurrency(num) {
    if (!isFinite(num) || isNaN(num)) return getSymbol() + '0';
    if (num >= 1000000) return getSymbol() + (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return getSymbol() + (num / 1000).toFixed(1) + 'K';
    return getSymbol() + num.toFixed(0);
  }

  function formatCurrencyFull(num) {
    if (!isFinite(num) || isNaN(num)) return getSymbol() + '0';
    return num.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace('$', getSymbol());
  }

  function getPlans() {
    var plans = [];
    $('.plan-row').each(function() {
      plans.push({
        name: $(this).find('.plan-name').val(),
        current: parseFloat($(this).find('.plan-current').val()) || 0,
        new: parseFloat($(this).find('.plan-new').val()) || 0,
        customers: parseInt($(this).find('.plan-customers').val()) || 0,
        churn: parseFloat($(this).find('.plan-churn').val()) || 0,
        grandfather: $(this).find('.plan-grandfather').is(':checked')
      });
    });
    return plans;
  }

  function calculate() {
    var currentPrice = parseFloat($currentPrice.val()) || 0;
    var newPrice = parseFloat($newPrice.val()) || 0;
    var customers = parseInt($customers.val()) || 0;
    var expectedChurn = Math.min(100, Math.max(0, parseFloat($churn.val()) || 0));

    $('#warningMessage').hide();

    var isDecrease = newPrice < currentPrice;
    var isNoChange = newPrice === currentPrice;

    if (isDecrease) {
      $('#warningMessage').text('You are modeling a price decrease.').show();
    } else if (isNoChange) {
      $('#warningMessage').text('No change in pricing.').show();
    }

    var currentMrr = currentPrice * customers;
    $currentMrr.text(formatCurrencyFull(currentMrr));

    var churned = customers * (expectedChurn / 100);
    var remaining = customers - churned;
    $customersLost.text(Math.round(churned));
    $remainingCustomers.text(remaining);

    var newMrr = remaining * newPrice;
    $newMrr.text(formatCurrencyFull(newMrr));

    var mrrDelta = newMrr - currentMrr;
    var mrrDeltaPct = currentMrr > 0 ? (mrrDelta / currentMrr) * 100 : 0;

    if (mrrDelta >= 0) {
      $mrrDelta.text('+' + formatCurrencyFull(mrrDelta));
      $mrrDelta.closest('.result-metric').removeClass('negative').addClass('positive');
    } else {
      $mrrDelta.text(formatCurrencyFull(mrrDelta));
      $mrrDelta.closest('.result-metric').removeClass('positive').addClass('negative');
    }

    $mrrDeltaPct.text((mrrDeltaPct >= 0 ? '+' : '') + mrrDeltaPct.toFixed(1) + '%');
    $mrrDeltaPct.closest('.result-metric').removeClass('positive negative').addClass(mrrDeltaPct >= 0 ? 'positive' : 'negative');

    var breakEvenChurn = 0;
    if (newPrice > 0 && currentPrice > 0 && newPrice > currentPrice) {
      var remainingAtBreakEven = (currentPrice * customers) / newPrice;
      var churnedAtBreakEven = customers - remainingAtBreakEven;
      breakEvenChurn = (churnedAtBreakEven / customers) * 100;
    } else if (newPrice > currentPrice) {
      breakEvenChurn = 100;
    }
    $breakEvenChurn.text(breakEvenChurn.toFixed(1) + '%');

    var maxChurn = newPrice > 0 ? (currentPrice / newPrice) * 100 : 100;
    if (maxChurn > 100) maxChurn = 100;
    $maxChurn.text(maxChurn.toFixed(1) + '%');

    if (breakEvenChurn > 100) {
      $breakEvenChurn.text('100%+');
      $breakEvenChurn.closest('.result-metric').addClass('positive');
    }

    var arrImpact = mrrDelta * 12;
    $arrImpact.text((arrImpact >= 0 ? '+' : '') + formatCurrencyFull(arrImpact));
    $arrImpact.closest('.result-metric').removeClass('positive negative').addClass(arrImpact >= 0 ? 'positive' : 'negative');

    var diff = expectedChurn - breakEvenChurn;
    $verdictBox.removeClass('safe neutral risky');

    if (Math.abs(diff) <= 2) {
      $verdictBox.addClass('neutral');
      $verdictText.text('Neutral');
      $verdictSub.text('Revenue stays roughly the same. Increase only if strategic.');
    } else if (expectedChurn < breakEvenChurn) {
      $verdictBox.addClass('safe');
      $verdictText.text('Safe to increase');
      $verdictSub.text('You can absorb this churn and still come out ahead.');
    } else {
      $verdictBox.addClass('risky');
      $verdictText.text('Risky');
      $verdictSub.text('At this churn rate, the increase reduces MRR. Reconsider timing or magnitude.');
    }

    if (currentMode === 'advanced') {
      var monthlyPct = parseInt($monthlyPct.val()) || 60;
      var annualPct = parseInt($annualPct.val()) || 40;

      if (monthlyPct + annualPct !== 100) {
        $('#warningMessage').text('Billing mix percentages sum to ' + (monthlyPct + annualPct) + '%. They should equal 100%.').show();
      }

      var plans = getPlans();
      var totalCustomers = plans.reduce(function(sum, p) { return sum + p.customers; }, 0);
      var totalCurrentMrr = plans.reduce(function(sum, p) { return sum + p.current * p.customers; }, 0);

      var grandfatheredCustomers = 0;
      var nonGrandfathered = 0;
      plans.forEach(function(p) {
        if (p.grandfather) {
          grandfatheredCustomers += p.customers;
        } else {
          nonGrandfathered += p.customers;
        }
      });

      var newCustPerMonth = parseInt($newCustomers.val()) || 0;
      var sunsetMonth = parseInt($sunsetMonth.val()) || 0;

      var gfMrr = grandfatheredCustomers * plans[0].current;
      var newPriceMrrVal = nonGrandfathered * newPrice;
      $grandfatheredMrr.text(formatCurrencyFull(gfMrr));
      $newPriceMrr.text(formatCurrencyFull(newPriceMrrVal));

      var blendedArpu = totalCustomers > 0 ? (totalCurrentMrr + (nonGrandfathered * (newPrice - currentPrice))) / totalCustomers : 0;
      $blendedArpu.text(formatCurrency(blendedArpu));

      var priceDelta = newPrice - currentPrice;
      var monthlyCustomers = customers * (monthlyPct / 100);
      var annualCustomers = customers * (annualPct / 100);

      var monthlyImpactVal = monthlyCustomers * priceDelta * (1 - expectedChurn / 100);
      var annualImpactVal = annualCustomers * priceDelta * (1 - expectedChurn / 100);

      $monthlyImpact.text(formatCurrencyFull(monthlyImpactVal));
      $annualImpact.text(formatCurrencyFull(annualImpactVal));

      var cumulativeGain = mrrDelta * 12;
      $cumulativeGain.text(formatCurrencyFull(cumulativeGain));

      updateChurnChart(currentPrice, newPrice, customers, currentMrr, breakEvenChurn, expectedChurn);
      updateProjectionChart(currentPrice, newPrice, customers, expectedChurn, newCustPerMonth, sunsetMonth, grandfatheredCustomers);
    } else {
      updateChurnChart(currentPrice, newPrice, customers, currentMrr, breakEvenChurn, expectedChurn);
    }
  }

  function updateChurnChart(currentPrice, newPrice, customers, currentMrr, breakEvenChurn, expectedChurn) {
    var canvas = document.getElementById('churnChart');
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    var width = rect.width;
    var height = rect.height;
    var padding = { top: 20, right: 20, bottom: 30, left: 50 };
    var chartWidth = width - padding.left - padding.right;
    var chartHeight = height - padding.top - padding.bottom;

    var maxChurn = 80;
    var maxMrr = currentMrr * 2;

    ctx.clearRect(0, 0, width, height);

    var currentMrrY = padding.top + chartHeight - (currentMrr / maxMrr) * chartHeight;
    ctx.strokeStyle = '#888580';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(padding.left, currentMrrY);
    ctx.lineTo(width - padding.right, currentMrrY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#888580';
    ctx.font = '10px "DM Mono"';
    ctx.textAlign = 'left';
    ctx.fillText('Current MRR', padding.left + 4, currentMrrY - 6);

    ctx.fillStyle = 'rgba(200,240,96,0.08)';
    var breakEvenX = padding.left + (breakEvenChurn / maxChurn) * chartWidth;
    ctx.fillRect(padding.left, padding.top, breakEvenX - padding.left, chartHeight);

    ctx.fillStyle = 'rgba(240,80,80,0.08)';
    ctx.fillRect(breakEvenX, padding.top, width - padding.right - breakEvenX, chartHeight);

    ctx.fillStyle = '#888580';
    ctx.textAlign = 'right';
    for (var i = 0; i <= 4; i++) {
      var y = padding.top + (chartHeight / 4) * i;
      var val = maxMrr - (maxMrr / 4) * i;
      ctx.fillText(formatCurrency(val), padding.left - 6, y + 4);
    }

    ctx.textAlign = 'center';
    var churns = [0, 20, 40, 60, 80];
    churns.forEach(function(c) {
      var x = padding.left + (c / maxChurn) * chartWidth;
      ctx.fillText(c + '%', x, height - 8);
    });

    ctx.strokeStyle = '#c8f060';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (var i = 0; i <= 80; i++) {
      var churnRate = i;
      var remainingCust = customers * (1 - churnRate / 100);
      var mrrAtChurn = remainingCust * newPrice;
      var x = padding.left + (churnRate / maxChurn) * chartWidth;
      var y = padding.top + chartHeight - (mrrAtChurn / maxMrr) * chartHeight;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    var expectedX = padding.left + (expectedChurn / maxChurn) * chartWidth;
    ctx.strokeStyle = '#60d4f0';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(expectedX, padding.top);
    ctx.lineTo(expectedX, height - padding.bottom);
    ctx.stroke();
    ctx.fillStyle = '#60d4f0';
    ctx.textAlign = 'center';
    ctx.fillText('Your churn', expectedX, padding.top - 6);

    var beX = padding.left + (Math.min(breakEvenChurn, maxChurn) / maxChurn) * chartWidth;
    ctx.strokeStyle = '#f0a040';
    ctx.beginPath();
    ctx.moveTo(beX, padding.top);
    ctx.lineTo(beX, height - padding.bottom);
    ctx.stroke();
    ctx.fillStyle = '#f0a040';
    ctx.fillText('Break-even', beX, height - padding.bottom + 14);

    ctx.setLineDash([]);
  }

  function updateProjectionChart(currentPrice, newPrice, customers, expectedChurn, newCustPerMonth, sunsetMonth, grandfatheredCustomers) {
    var canvas = document.getElementById('projectionChart');
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    var width = rect.width;
    var height = rect.height;
    var padding = { top: 20, right: 20, bottom: 30, left: 50 };
    var chartWidth = width - padding.left - padding.right;
    var chartHeight = height - padding.top - padding.bottom;

    var months = 12;
    var maxMrr = 0;
    var dataWithIncrease = [];
    var dataWithoutIncrease = [];
    var dataGrandfathered = [];

    for (var m = 1; m <= months; m++) {
      var newCust = newCustPerMonth * m;
      var remainingFromOriginal = customers * (1 - expectedChurn / 100);
      var totalCust = remainingFromOriginal + newCust;

      var gfCust = grandfatheredCustomers;
      if (sunsetMonth > 0 && m >= sunsetMonth) {
        gfCust = 0;
      }

      var gfMrr = gfCust * currentPrice;
      var newPriceMrr = (totalCust - gfCust) * newPrice;
      var mrrWithIncrease = gfMrr + newPriceMrr;
      var mrrWithoutIncrease = totalCust * currentPrice;

      dataWithIncrease.push(mrrWithIncrease);
      dataWithoutIncrease.push(mrrWithoutIncrease);
      dataGrandfathered.push(gfMrr);

      maxMrr = Math.max(maxMrr, mrrWithIncrease, mrrWithoutIncrease);
    }

    maxMrr = maxMrr * 1.2;

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#888580';
    ctx.textAlign = 'right';
    for (var i = 0; i <= 4; i++) {
      var y = padding.top + (chartHeight / 4) * i;
      var val = maxMrr - (maxMrr / 4) * i;
      ctx.fillText(formatCurrency(val), padding.left - 6, y + 4);
    }

    ctx.fillStyle = '#888580';
    ctx.textAlign = 'center';
    for (var i = 0; i < months; i++) {
      var x = padding.left + (chartWidth / (months - 1)) * i;
      ctx.fillText('M' + (i + 1), x, height - 8);
    }

    ctx.strokeStyle = '#888580';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    dataWithoutIncrease.forEach(function(v, i) {
      var x = padding.left + (chartWidth / (months - 1)) * i;
      var y = padding.top + chartHeight - (v / maxMrr) * chartHeight;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = '#c8f060';
    ctx.lineWidth = 3;
    ctx.beginPath();
    dataWithIncrease.forEach(function(v, i) {
      var x = padding.left + (chartWidth / (months - 1)) * i;
      var y = padding.top + chartHeight - (v / maxMrr) * chartHeight;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();

    if (grandfatheredCustomers > 0) {
      ctx.strokeStyle = '#60d4f0';
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      dataGrandfathered.forEach(function(v, i) {
        var x = padding.left + (chartWidth / (months - 1)) * i;
        var y = padding.top + chartHeight - (v / maxMrr) * chartHeight;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.fillStyle = '#c8f060';
    dataWithIncrease.forEach(function(v, i) {
      var x = padding.left + (chartWidth / (months - 1)) * i;
      var y = padding.top + chartHeight - (v / maxMrr) * chartHeight;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function initMode() {
    $('.mode-btn').on('click', function() {
      var mode = $(this).data('mode');
      currentMode = mode;
      $('.mode-btn').removeClass('active');
      $(this).addClass('active');
      $('.advanced-inputs').toggle(mode === 'advanced');
      $('.advanced-results').toggle(mode === 'advanced');
      $('#projectionSection').toggle(mode === 'advanced');
      calculate();
    });
  }

  function initInputs() {
    $currentPrice.on('input', calculate);
    $newPrice.on('input', calculate);
    $customers.on('input', calculate);
    $churn.on('input', calculate);
    $newCustomers.on('input', calculate);
    $sunsetMonth.on('input', calculate);
    $monthlyPct.on('input', calculate);
    $annualPct.on('input', calculate);
    $rolloutType.on('change', calculate);
    $currency.on('change', calculate);

    $(document).on('input', '.plan-name, .plan-current, .plan-new, .plan-customers, .plan-churn', calculate);
    $(document).on('change', '.plan-grandfather', calculate);

    $('#addPlanBtn').on('click', function() {
      if (planCount >= 3) return;
      var html = '<div class="plan-row" data-plan="' + planCount + '">' +
        '<input type="text" class="plan-name" value="Plan ' + (planCount + 1) + '" placeholder="Plan Name">' +
        '<input type="number" class="plan-current" value="0" min="0" max="9999999" step="0.01" placeholder="Current $">' +
        '<input type="number" class="plan-new" value="0" min="0" max="9999999" step="0.01" placeholder="New $">' +
        '<input type="number" class="plan-customers" value="0" min="0" max="9999999" step="1" placeholder="Customers">' +
        '<input type="number" class="plan-churn" value="10" min="0" max="100" step="0.1" placeholder="Churn %">' +
        '<label class="toggle-label small"><input type="checkbox" class="plan-grandfather"><span class="toggle-switch small"></span></label>' +
        '<button class="plan-remove" title="Remove">×</button>' +
        '</div>';
      $('#planSection').append(html);
      planCount++;
      if (planCount >= 3) $(this).hide();
    });

    $(document).on('click', '.plan-remove', function() {
      if ($('.plan-row').length <= 1) return;
      $(this).closest('.plan-row').remove();
      planCount--;
      $('#addPlanBtn').show();
      calculate();
    });
  }

  function initShare() {
    $('#copyResults').on('click', function() {
      var text = 'Price Increase Simulator Results\n' +
        'Current Price: ' + $currentPrice.val() + '\n' +
        'New Price: ' + $newPrice.val() + '\n' +
        'Customers: ' + $customers.val() + '\n' +
        'Expected Churn: ' + $churn.val() + '%\n' +
        'Current MRR: ' + $currentMrr.text() + '\n' +
        'New MRR: ' + $newMrr.text() + '\n' +
        'MRR Delta: ' + $mrrDelta.text() + '\n' +
        'Break-Even Churn: ' + $breakEvenChurn.text() + '\n' +
        $verdictText.text() + ': ' + $verdictSub.text();
      navigator.clipboard.writeText(text).then(function() {
        alert('Results copied to clipboard!');
      });
    });

    $('#shareLink').on('click', function() {
      var params = new URLSearchParams({
        cp: $currentPrice.val(),
        np: $newPrice.val(),
        cust: $customers.val(),
        churn: $churn.val(),
        nc: $newCustomers.val(),
        sm: $sunsetMonth.val(),
        mp: $monthlyPct.val(),
        ap: $annualPct.val(),
        rt: $rolloutType.val(),
        curr: $currency.val(),
        mode: currentMode
      });
      var url = window.location.origin + window.location.pathname + '?' + params.toString();
      navigator.clipboard.writeText(url).then(function() {
        alert('Share link copied to clipboard!');
      });
    });
  }

  function loadFromParams() {
    var params = new URLSearchParams(window.location.search);
    if (params.has('cp')) $currentPrice.val(params.get('cp'));
    if (params.has('np')) $newPrice.val(params.get('np'));
    if (params.has('cust')) $customers.val(params.get('cust'));
    if (params.has('churn')) $churn.val(params.get('churn'));
    if (params.has('nc')) $newCustomers.val(params.get('nc'));
    if (params.has('sm')) $sunsetMonth.val(params.get('sm'));
    if (params.has('mp')) $monthlyPct.val(params.get('mp'));
    if (params.has('ap')) $annualPct.val(params.get('ap'));
    if (params.has('rt')) $rolloutType.val(params.get('rt'));
    if (params.has('curr')) $currency.val(params.get('curr'));
    if (params.has('mode')) {
      var mode = params.get('mode');
      $('.mode-btn').removeClass('active');
      $('.mode-btn[data-mode="' + mode + '"]').addClass('active');
      currentMode = mode;
      $('.advanced-inputs').toggle(mode === 'advanced');
      $('.advanced-results').toggle(mode === 'advanced');
      $('#projectionSection').toggle(mode === 'advanced');
    }
  }

  window.toggleExplanation = function() {
    $('.explanation-toggle').toggleClass('open');
    $('#explanationContent').toggleClass('open');
  };

  $(function() {
    initMode();
    initInputs();
    initShare();
    loadFromParams();
    calculate();
  });

})(jQuery);
