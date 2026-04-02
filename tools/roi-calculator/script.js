(function($) {
  'use strict';

  var currencySymbols = {
    USD: '$', EUR: '€', GBP: '£', BDT: '৳', INR: '₹', CAD: 'C$', AUD: 'A$', SGD: 'S$'
  };

  var $monthlyCost = $('#monthlyCost');
  var $monthlyReturn = $('#monthlyReturn');
  var $timePeriod = $('#timePeriod');
  var $periodDisplay = $('#periodDisplay');
  var $setupCost = $('#setupCost');
  var $trainingCost = $('#trainingCost');
  var $costGrowth = $('#costGrowth');
  var $returnGrowth = $('#returnGrowth');
  var $taxRate = $('#taxRate');
  var $discountRate = $('#discountRate');
  var $altReturn = $('#altReturn');
  var $currency = $('#currency');

  var $totalInvestment = $('#totalInvestment');
  var $totalReturn = $('#totalReturn');
  var $netProfit = $('#netProfit');
  var $roiContainer = $('#roiContainer');
  var $roiPercent = $('#roiPercent');
  var $roiBadge = $('#roiBadge');
  var $roiSub = $('#roiSub');
  var $feedback = $('#feedback');
  var $breakEvenNote = $('#breakEvenNote');

  var $afterTaxProfit = $('#afterTaxProfit');
  var $npvContainer = $('#npvContainer');
  var $npvValue = $('#npvValue');
  var $oppCost = $('#oppCost');
  var $netRoiAltContainer = $('#netRoiAltContainer');
  var $netRoiAlt = $('#netRoiAlt');
  var $avgReturn = $('#avgReturn');
  var $avgProfit = $('#avgProfit');
  var $costImpact = $('#costImpact');
  var $returnImpact = $('#returnImpact');

  var chart = null;
  var currentMode = 'simple';

  function getSymbol() {
    return currencySymbols[$currency.val()] || '$';
  }

  function formatCurrency(num) {
    if (!isFinite(num) || isNaN(num)) return getSymbol() + '0';
    return num.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace('$', getSymbol());
  }

  function getGrowthRate(rate) {
    return Math.max(-50, Math.min(200, parseFloat(rate) || 0)) / 100;
  }

  function calculate() {
    var cost = Math.max(0, parseFloat($monthlyCost.val()) || 0);
    var returnVal = Math.max(0, parseFloat($monthlyReturn.val()) || 0);
    var months = Math.max(1, parseInt($timePeriod.val()) || 1);
    var setup = Math.max(0, parseFloat($setupCost.val()) || 0);
    var training = Math.max(0, parseFloat($trainingCost.val()) || 0);
    var costGrowthRate = getGrowthRate($costGrowth.val());
    var returnGrowthRate = getGrowthRate($returnGrowth.val());
    var tax = Math.max(0, Math.min(60, parseFloat($taxRate.val()) || 0));
    var discount = Math.max(0, Math.min(30, parseFloat($discountRate.val()) || 0));
    var altReturn = Math.max(0, parseFloat($altReturn.val()) || 0);

    $periodDisplay.text(months + ' month' + (months !== 1 ? 's' : ''));

    var totalInvestment = 0;
    var totalReturn = 0;
    var monthlyData = [];
    var breakEvenMonth = -1;
    var cumInvestment = 0;
    var cumReturn = 0;

    for (var n = 1; n <= months; n++) {
      var monthlyCost = cost * Math.pow(1 + costGrowthRate, n - 1);
      var monthlyRet = returnVal * Math.pow(1 + returnGrowthRate, n - 1);
      totalInvestment += monthlyCost;
      totalReturn += monthlyRet;
      cumInvestment += monthlyCost;
      cumReturn += monthlyRet;

      var net = monthlyRet - monthlyCost;
      var discountFactor = Math.pow(1 + discount / 100, n);
      var npvContribution = net / discountFactor;

      if (breakEvenMonth === -1 && cumReturn >= cumInvestment + setup + training) {
        breakEvenMonth = n;
      }

      monthlyData.push({
        month: n,
        investment: cumInvestment,
        return: cumReturn,
        net: cumReturn - cumInvestment,
        npv: npvContribution
      });
    }

    totalInvestment += setup + training;

    var oneTimeCosts = setup + training;
    var npv = monthlyData.reduce(function(sum, d) { return sum + d.npv; }, 0) - oneTimeCosts;
    var netProfit = totalReturn - totalInvestment;
    var roi = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : (returnVal > 0 ? Infinity : 0);
    var avgMonthlyReturn = totalReturn / months;
    var avgMonthlyProfit = netProfit / months;

    var flatTotalCost = cost * months + oneTimeCosts;
    var flatTotalReturn = returnVal * months;
    var costImpactVal = totalInvestment - flatTotalCost;
    var returnImpactVal = totalReturn - flatTotalReturn;

    var oppCostVal = altReturn * months;
    var netRoiVsAlt = totalInvestment > 0 ? ((netProfit - oppCostVal) / totalInvestment) * 100 : 0;
    var afterTaxProfitVal = netProfit * (1 - tax / 100);

    $totalInvestment.text(formatCurrency(totalInvestment));
    $totalReturn.text(formatCurrency(totalReturn));
    $netProfit.text(formatCurrency(netProfit));
    $netProfit.toggleClass('negative', netProfit < 0);

    if (!isFinite(roi)) {
      $roiPercent.text('∞');
      $roiContainer.removeClass('negative');
    } else {
      $roiPercent.text((roi === -100 ? '-100' : roi.toFixed(1)) + '%');
      $roiContainer.toggleClass('negative', roi < 0);
    }

    var badgeClass, badgeText;
    if (!isFinite(roi) || roi > 300) { badgeClass = 'outstanding'; badgeText = 'Outstanding'; }
    else if (roi > 200) { badgeClass = 'excellent'; badgeText = 'Excellent'; }
    else if (roi > 100) { badgeClass = 'good'; badgeText = 'Good'; }
    else if (roi > 50) { badgeClass = 'moderate'; badgeText = 'Moderate'; }
    else if (roi > 0) { badgeClass = 'marginal'; badgeText = 'Marginal'; }
    else { badgeClass = 'losing'; badgeText = 'Losing Money'; }

    $roiBadge.attr('class', 'health-badge ' + badgeClass).text(badgeText);

    var payback;
    if (cost === 0 && returnVal > 0) payback = 'Instant';
    else if (returnVal === 0) payback = 'Never';
    else payback = (totalInvestment / avgMonthlyReturn).toFixed(1) + ' months';

    var paybackText = '';
    if (payback === 'Instant') paybackText = 'No cost — immediate positive return.';
    else if (payback === 'Never') paybackText = 'This spend never pays back at current return.';
    else {
      var pb = parseFloat(payback);
      if (pb < 1) paybackText = 'Pays for itself almost immediately.';
      else if (pb <= 3) paybackText = 'Very fast payback — low risk.';
      else if (pb <= 6) paybackText = 'Reasonable payback window.';
      else if (pb <= 12) paybackText = 'Acceptable — monitor performance closely.';
      else paybackText = 'Long payback — validate assumptions carefully.';
    }

    $roiSub.text('Payback: ' + payback + '. ' + paybackText);

    if (breakEvenMonth === -1) {
      $breakEvenNote.text('Break-even not reached within ' + months + ' months.').show();
    } else {
      $breakEvenNote.hide();
    }

    $afterTaxProfit.text(formatCurrency(afterTaxProfitVal));
    $afterTaxProfit.toggleClass('negative', afterTaxProfitVal < 0);

    $npvValue.text(formatCurrency(npv));
    $npvContainer.toggleClass('negative', npv < 0);

    $oppCost.text(formatCurrency(oppCostVal));

    if (altReturn > 0) {
      $netRoiAlt.text(netRoiVsAlt.toFixed(1) + '%');
      $netRoiAltContainer.toggleClass('negative', netRoiVsAlt < 0);
      if (netRoiVsAlt < 0) {
        $breakEvenNote.text('The alternative investment outperforms this spend.').show();
      }
    } else {
      $netRoiAlt.text('—');
      $netRoiAltContainer.removeClass('negative');
    }

    $avgReturn.text(formatCurrency(avgMonthlyReturn));
    $avgProfit.text(formatCurrency(avgMonthlyProfit));

    $costImpact.text(formatCurrency(costImpactVal));
    $returnImpact.text(formatCurrency(returnImpactVal));

    var feedback = '';
    if (!isFinite(roi) || roi > 200) feedback = 'Excellent — this spend is paying off significantly.';
    else if (roi >= 100) feedback = 'Good — you\'re getting solid returns.';
    else if (roi >= 0) feedback = 'Marginal — consider optimizing your spend.';
    else feedback = 'Losing money — reassess before continuing this investment.';
    $feedback.text(feedback);

    updateChart(monthlyData, breakEvenMonth);
  }

  function updateChart(data, breakEvenMonth) {
    var canvas = document.getElementById('projectionChart');
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

    var maxVal = 0;
    data.forEach(function(d) {
      maxVal = Math.max(maxVal, d.investment, d.return);
    });
    if (maxVal === 0) maxVal = 100;

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
      ctx.fillText(formatCurrency(maxVal - (maxVal / 4) * i), padding.left - 8, y + 4);
    }

    ctx.fillStyle = '#888580';
    ctx.textAlign = 'center';
    for (var i = 0; i < data.length; i += Math.ceil(data.length / 6)) {
      var x = padding.left + (chartWidth / (data.length - 1 || 1)) * i;
      ctx.fillText('M' + data[i].month, x, height - 8);
    }

    var investmentColor = '#f05050';
    var returnColor = '#c8f060';

    ctx.lineWidth = 2;
    ctx.beginPath();
    data.forEach(function(d, i) {
      var x = padding.left + (chartWidth / (data.length - 1 || 1)) * i;
      var y = padding.top + chartHeight - (d.investment / maxVal) * chartHeight;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = investmentColor;
    ctx.stroke();

    ctx.beginPath();
    data.forEach(function(d, i) {
      var x = padding.left + (chartWidth / (data.length - 1 || 1)) * i;
      var y = padding.top + chartHeight - (d.return / maxVal) * chartHeight;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = returnColor;
    ctx.stroke();

    if (breakEvenMonth > 0) {
      var beX = padding.left + (chartWidth / (data.length - 1 || 1)) * (breakEvenMonth - 1);
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#60d4f0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(beX, padding.top);
      ctx.lineTo(beX, height - padding.bottom);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#60d4f0';
      ctx.font = '11px "DM Mono"';
      ctx.textAlign = 'center';
      ctx.fillText('Break-even: M' + breakEvenMonth, beX, padding.top - 6);
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
    $monthlyCost.on('input', calculate);
    $monthlyReturn.on('input', calculate);
    $timePeriod.on('input', calculate);
    $setupCost.on('input', calculate);
    $trainingCost.on('input', calculate);
    $costGrowth.on('input', calculate);
    $returnGrowth.on('input', calculate);
    $taxRate.on('input', calculate);
    $discountRate.on('input', calculate);
    $altReturn.on('input', calculate);
    $currency.on('change', calculate);
  }

  function initShare() {
    $('#copyResults').on('click', function() {
      var text = 'ROI Calculator Results\n' +
        'Total Investment: ' + $totalInvestment.text() + '\n' +
        'Total Return: ' + $totalReturn.text() + '\n' +
        'Net Profit: ' + $netProfit.text() + '\n' +
        'ROI: ' + $roiPercent.text() + '\n' +
        $roiSub.text();
      navigator.clipboard.writeText(text).then(function() {
        alert('Results copied to clipboard!');
      });
    });

    $('#shareLink').on('click', function() {
      var params = new URLSearchParams({
        cost: $monthlyCost.val(),
        ret: $monthlyReturn.val(),
        months: $timePeriod.val(),
        setup: $setupCost.val(),
        training: $trainingCost.val(),
        costGrowth: $costGrowth.val(),
        returnGrowth: $returnGrowth.val(),
        tax: $taxRate.val(),
        discount: $discountRate.val(),
        alt: $altReturn.val(),
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
    if (params.has('cost')) $monthlyCost.val(params.get('cost'));
    if (params.has('ret')) $monthlyReturn.val(params.get('ret'));
    if (params.has('months')) $timePeriod.val(params.get('months'));
    if (params.has('setup')) $setupCost.val(params.get('setup'));
    if (params.has('training')) $trainingCost.val(params.get('training'));
    if (params.has('costGrowth')) $costGrowth.val(params.get('costGrowth'));
    if (params.has('returnGrowth')) $returnGrowth.val(params.get('returnGrowth'));
    if (params.has('tax')) $taxRate.val(params.get('tax'));
    if (params.has('discount')) $discountRate.val(params.get('discount'));
    if (params.has('alt')) $altReturn.val(params.get('alt'));
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