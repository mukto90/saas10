(function($) {
  'use strict';

  var currencySymbols = {
    USD: '$', EUR: '€', GBP: '£', BDT: '৳', INR: '₹', CAD: 'C$', AUD: 'A$', SGD: 'S$'
  };

  var $cac = $('#cac');
  var $arpu = $('#arpu');
  var $grossMargin = $('#grossMargin');
  var $expansionMrr = $('#expansionMrr');
  var $supportCost = $('#supportCost');
  var $churnRate = $('#churnRate');
  var $growth = $('#growth');
  var $currency = $('#currency');

  var $grossProfit = $('#grossProfit');
  var $paybackContainer = $('#paybackContainer');
  var $paybackBadge = $('#paybackBadge');
  var $payback = $('#payback');
  var $paybackNote = $('#paybackNote');
  var $paybackRevenue = $('#paybackRevenue');
  var $annualProfit = $('#annualProfit');
  var $adjustedArpu = $('#adjustedArpu');
  var $adjustedPayback = $('#adjustedPayback');
  var $feedback = $('#feedback');

  var currentMode = 'simple';

  function getSymbol() {
    return currencySymbols[$currency.val()] || '$';
  }

  function formatCurrency(num) {
    if (!isFinite(num) || isNaN(num)) return getSymbol() + '0';
    return num.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace('$', getSymbol());
  }

  function calculate() {
    var cac = Math.max(0, parseFloat($cac.val()) || 0);
    var arpu = Math.max(0, parseFloat($arpu.val()) || 0);
    var grossMargin = Math.max(0, Math.min(100, parseFloat($grossMargin.val()) || 0));
    var expansionMrr = Math.max(0, parseFloat($expansionMrr.val()) || 0);
    var supportCost = Math.max(0, parseFloat($supportCost.val()) || 0);
    var churnRate = Math.max(0, Math.min(100, parseFloat($churnRate.val()) || 0));
    var growth = parseFloat($growth.val()) || 0;

    var monthlyGrossProfit = arpu * (grossMargin / 100);
    var paybackMonths = monthlyGrossProfit > 0 ? cac / monthlyGrossProfit : 999;
    var paybackRevenue = cac;
    var annualGrossProfit = monthlyGrossProfit * 12;

    var adjustedArpu = arpu + expansionMrr - supportCost;
    var adjustedMonthlyProfit = adjustedArpu * (grossMargin / 100);
    var adjustedPaybackMonths = adjustedMonthlyProfit > 0 ? cac / adjustedMonthlyProfit : 999;

    var scenarioPriceArpu = arpu * 1.1;
    var scenarioPriceProfit = scenarioPriceArpu * (grossMargin / 100);
    var scenarioPricePayback = scenarioPriceProfit > 0 ? cac / scenarioPriceProfit : 999;

    var scenarioChurnRate = churnRate * 1.1;
    var scenarioChurnMultiplier = 1 / (1 - scenarioChurnRate / 100);
    var scenarioChurnMultiplierOriginal = 1 / (1 - churnRate / 100);
    var scenarioChurnArpu = arpu * (scenarioChurnMultiplierOriginal / scenarioChurnMultiplier);
    var scenarioChurnProfit = scenarioChurnArpu * (grossMargin / 100);
    var scenarioChurnPayback = scenarioChurnProfit > 0 ? cac / scenarioChurnProfit : 999;

    var scenarioExpansionArpu = arpu + expansionMrr * 1.1 - supportCost;
    var scenarioExpansionProfit = scenarioExpansionArpu * (grossMargin / 100);
    var scenarioExpansionPayback = scenarioExpansionProfit > 0 ? cac / scenarioExpansionProfit : 999;

    $grossProfit.text(formatCurrency(monthlyGrossProfit));

    var paybackText = '';
    var badgeClass = '';
    var badgeText = '';
    var noteText = '';
    var feedbackText = '';

    if (arpu === 0) {
      paybackText = '—';
      badgeClass = '';
      badgeText = 'N/A';
      noteText = 'Enter ARPU to calculate';
      feedbackText = 'Enter your ARPU to see payback period.';
    } else if (grossMargin === 0) {
      paybackText = '—';
      badgeClass = '';
      badgeText = 'N/A';
      noteText = 'Enter gross margin to calculate';
      feedbackText = 'Enter gross margin to see payback period.';
    } else if (cac === 0) {
      paybackText = '0 months';
      badgeClass = 'profitable';
      badgeText = 'No CAC';
      noteText = 'No acquisition cost';
      feedbackText = 'No acquisition cost — you are building profit into every deal.';
    } else if (paybackMonths > 60) {
      paybackText = '> 60 months';
      badgeClass = 'critical';
      badgeText = 'Poor';
      noteText = 'Payback exceeds 5 years';
      feedbackText = 'Your payback is very long. Consider lowering CAC or raising ARPU.';
    } else if (paybackMonths <= 9) {
      paybackText = paybackMonths.toFixed(1) + ' months';
      badgeClass = 'excellent';
      badgeText = 'Excellent';
      noteText = 'Target is under 9 months';
      feedbackText = 'Your payback is excellent. Investors typically want to see under 12 months.';
    } else if (paybackMonths <= 12) {
      paybackText = paybackMonths.toFixed(1) + ' months';
      badgeClass = 'healthy';
      badgeText = 'Healthy';
      noteText = 'Target is under 9 months';
      feedbackText = 'Your payback is healthy. Aim for under 9 months to maximize growth.';
    } else if (paybackMonths <= 18) {
      paybackText = paybackMonths.toFixed(1) + ' months';
      badgeClass = 'fair';
      badgeText = 'Fair';
      noteText = 'Target is under 9 months';
      feedbackText = 'Your payback is fair but could be improved. Consider pricing adjustments.';
    } else {
      paybackText = paybackMonths.toFixed(1) + ' months';
      badgeClass = 'poor';
      badgeText = 'Poor';
      noteText = 'Target is under 9 months';
      feedbackText = 'Your payback is too long. Focus on reducing CAC or increasing ARPU.';
    }

    $payback.text(paybackText);
    $paybackBadge.attr('class', 'health-badge ' + badgeClass).text(badgeText);
    $paybackNote.text(noteText);
    $feedback.text(feedbackText);

    $paybackRevenue.text(formatCurrency(paybackRevenue));
    $annualProfit.text(formatCurrency(annualGrossProfit));

    if (currentMode === 'advanced') {
      $adjustedArpu.text(formatCurrency(adjustedArpu));
      $adjustedPayback.text(adjustedPaybackMonths > 60 ? '> 60 months' : adjustedPaybackMonths.toFixed(1) + ' months');

      $('#scenarioPricePayback').text(scenarioPricePayback.toFixed(1) + ' mo');
      $('#scenarioChurnPayback').text(scenarioChurnPayback.toFixed(1) + ' mo');
      $('#scenarioExpansionPayback').text(scenarioExpansionPayback.toFixed(1) + ' mo');

      updateChart(cac, monthlyGrossProfit, paybackMonths);
    }
  }

  function updateChart(cac, monthlyProfit, paybackMonths) {
    var canvas = document.getElementById('paybackChart');
    if (!canvas) return;
    
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    var width = rect.width;
    var height = rect.height;
    var padding = { top: 20, right: 20, bottom: 30, left: 60 };
    var chartWidth = width - padding.left - padding.right;
    var chartHeight = height - padding.top - padding.bottom;

    var displayMonths = Math.min(24, Math.ceil(paybackMonths) + 2);
    if (displayMonths < 6) displayMonths = 6;
    if (displayMonths > 24) displayMonths = 24;

    var maxRevenue = cac * 1.5;
    if (maxRevenue === 0) maxRevenue = 100;

    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    for (var i = 0; i <= 4; i++) {
      var y = padding.top + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      ctx.fillStyle = '#888580';
      ctx.font = '10px "DM Mono"';
      ctx.textAlign = 'right';
      ctx.fillText(formatCurrency(maxRevenue - (maxRevenue / 4) * i), padding.left - 8, y + 4);
    }

    ctx.fillStyle = '#888580';
    ctx.textAlign = 'center';
    for (var mi = 0; mi < displayMonths; mi += Math.ceil(displayMonths / 6)) {
      var x = padding.left + (chartWidth / (displayMonths - 1 || 1)) * mi;
      ctx.fillText('M' + (mi + 1), x, height - 8);
    }

    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#c8f060';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top + chartHeight);
    ctx.lineTo(padding.left, padding.top + chartHeight);
    ctx.stroke();

    var lineDrawn = false;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (var m = 0; m <= displayMonths; m++) {
      var cumulativeRevenue = monthlyProfit * m;
      if (cumulativeRevenue > maxRevenue) cumulativeRevenue = maxRevenue;
      
      var x = padding.left + (chartWidth / (displayMonths || 1)) * m;
      var y = padding.top + chartHeight - (cumulativeRevenue / maxRevenue) * chartHeight;
      
      if (m === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      
      if (cumulativeRevenue >= cac && !lineDrawn) {
        lineDrawn = true;
      }
    }
    ctx.strokeStyle = '#c8f060';
    ctx.stroke();

    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#f05050';
    ctx.lineWidth = 1;
    ctx.beginPath();
    var cacY = padding.top + chartHeight - (cac / maxRevenue) * chartHeight;
    ctx.moveTo(padding.left, cacY);
    ctx.lineTo(width - padding.right, cacY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#f05050';
    ctx.font = '10px "DM Mono"';
    ctx.textAlign = 'left';
    ctx.fillText('CAC: ' + formatCurrency(cac), padding.left + 4, cacY - 4);

    if (paybackMonths <= displayMonths && paybackMonths > 0) {
      var paybackX = padding.left + (chartWidth / (displayMonths || 1)) * paybackMonths;
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#60d4f0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(paybackX, padding.top);
      ctx.lineTo(paybackX, height - padding.bottom);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#60d4f0';
      ctx.font = '11px "DM Mono"';
      ctx.textAlign = 'center';
      ctx.fillText('Payback: ' + paybackMonths.toFixed(1) + ' months', paybackX, padding.top - 6);
    }
  }

  function initMode() {
    $('.mode-btn').on('click', function() {
      var mode = $(this).data('mode');
      currentMode = mode;
      $('.mode-btn').removeClass('active');
      $(this).addClass('active');
      $('.advanced-inputs').toggle(mode === 'advanced');
      $('.advanced-results').toggle(mode === 'advanced');
      calculate();
    });
  }

  function initInputs() {
    $('#cac, #arpu, #grossMargin, #expansionMrr, #supportCost, #churnRate, #growth, #currency').on('input change', calculate);
  }

  function initShare() {
    $('#copyResults').on('click', function() {
      var text = 'CAC Payback Calculator Results\n' +
        'CAC: ' + $cac.val() + '\n' +
        'ARPU: ' + $arpu.val() + '\n' +
        'Gross Margin: ' + $grossMargin.val() + '%\n' +
        'Payback: ' + $payback.text() + '\n' +
        'Gross Profit: ' + $grossProfit.text();
      navigator.clipboard.writeText(text).then(function() {
        alert('Results copied to clipboard!');
      });
    });

    $('#shareLink').on('click', function() {
      var params = new URLSearchParams({
        cac: $cac.val(),
        arpu: $arpu.val(),
        margin: $grossMargin.val(),
        expansion: $expansionMrr.val(),
        support: $supportCost.val(),
        churn: $churnRate.val(),
        growth: $growth.val(),
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
    if (params.has('cac')) $cac.val(params.get('cac'));
    if (params.has('arpu')) $arpu.val(params.get('arpu'));
    if (params.has('margin')) $grossMargin.val(params.get('margin'));
    if (params.has('expansion')) $expansionMrr.val(params.get('expansion'));
    if (params.has('support')) $supportCost.val(params.get('support'));
    if (params.has('churn')) $churnRate.val(params.get('churn'));
    if (params.has('growth')) $growth.val(params.get('growth'));
    if (params.has('curr')) $currency.val(params.get('curr'));
    if (params.has('mode')) {
      var mode = params.get('mode');
      $('.mode-btn').removeClass('active');
      $('.mode-btn[data-mode="' + mode + '"]').addClass('active');
      currentMode = mode;
      $('.advanced-inputs').toggle(mode === 'advanced');
      $('.advanced-results').toggle(mode === 'advanced');
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
