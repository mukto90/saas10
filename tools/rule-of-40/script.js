(function($) {
  'use strict';

  var currencySymbols = {
    USD: '$', EUR: '€', GBP: '£', BDT: '৳', INR: '₹', CAD: 'C$', AUD: 'A$', SGD: 'S$'
  };

  var $growthRate = $('#growthRate');
  var $profitMargin = $('#profitMargin');
  var $marginType = $('#marginType');
  var $arrPrev = $('#arrPrev');
  var $arrCurrent = $('#arrCurrent');
  var $totalRevenue = $('#totalRevenue');
  var $cogs = $('#cogs');
  var $salesMarketing = $('#salesMarketing');
  var $rd = $('#rd');
  var $ga = $('#ga');
  var $currency = $('#currency');

  var $q1Growth = $('#q1Growth');
  var $q1Margin = $('#q1Margin');
  var $q2Growth = $('#q2Growth');
  var $q2Margin = $('#q2Margin');
  var $q3Growth = $('#q3Growth');
  var $q3Margin = $('#q3Margin');
  var $q4Growth = $('#q4Growth');
  var $q4Margin = $('#q4Margin');

  var $ruleOf40Score = $('#ruleOf40Score');
  var $scoreBadge = $('#scoreBadge');
  var $scoreMessage = $('#scoreMessage');
  var $growthRateDisplay = $('#growthRateDisplay');
  var $profitMarginDisplay = $('#profitMarginDisplay');
  var $vsThreshold = $('#vsThreshold');
  var $warningMessage = $('#warningMessage');

  var $grossMargin = $('#grossMargin');
  var $ebitda = $('#ebitda');
  var $ebitdaMargin = $('#ebitdaMargin');
  var $arrGrowthCalc = $('#arrGrowthCalc');
  var $trailingAvg = $('#trailingAvg');
  var $trendDirection = $('#trendDirection');
  var $userGrowth = $('#userGrowth');
  var $userMargin = $('#userMargin');
  var $userScore = $('#userScore');

  var currentMode = 'simple';

  function getSymbol() {
    return currencySymbols[$currency.val()] || '$';
  }

  function formatCurrency(num) {
    if (!isFinite(num) || isNaN(num)) return getSymbol() + '0';
    return num.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace('$', getSymbol());
  }

  function formatPercent(num) {
    if (!isFinite(num) || isNaN(num)) return '0.0%';
    return num.toFixed(1) + '%';
  }

  function getScoreBadgeClass(score) {
    if (score > 60) return 'elite';
    if (score >= 40) return 'healthy';
    if (score >= 25) return 'below-target';
    if (score >= 10) return 'underperforming';
    return 'struggling';
  }

  function getScoreBadgeText(score) {
    if (score > 60) return 'Elite';
    if (score >= 40) return 'Healthy';
    if (score >= 25) return 'Below target';
    if (score >= 10) return 'Underperforming';
    return 'Struggling';
  }

  function getScoreMessage(score) {
    if (score > 60) return 'Elite performance. Top-tier public SaaS companies like Snowflake and Datadog operate here.';
    if (score >= 40) return 'Healthy. You meet or exceed the Rule of 40 benchmark investors expect.';
    if (score >= 25) return 'Below target. Either grow faster, reduce burn, or both.';
    if (score >= 10) return 'Underperforming. Requires significant improvement in growth or margins.';
    return 'Struggling. Urgent action needed on either side of the equation.';
  }

  function calculate() {
    var growthRate = parseFloat($growthRate.val()) || 0;
    var profitMargin = parseFloat($profitMargin.val()) || 0;

    var warningMsg = '';
    if (growthRate === 0 && profitMargin === 0) {
      warningMsg = 'No growth and no profitability.';
    }
    if ($totalRevenue.val() == 0 && currentMode === 'advanced') {
      warningMsg = 'Enter revenue to calculate margin.';
    }
    if ($arrPrev.val() == 0 && currentMode === 'advanced') {
      warningMsg = 'Enter previous ARR to calculate growth.';
    }

    if (currentMode === 'advanced') {
      var prevArr = parseFloat($arrPrev.val()) || 0;
      var currArr = parseFloat($arrCurrent.val()) || 0;
      var revenue = parseFloat($totalRevenue.val()) || 0;
      var cogsVal = parseFloat($cogs.val()) || 0;
      var sm = parseFloat($salesMarketing.val()) || 0;
      var rdVal = parseFloat($rd.val()) || 0;
      var gaVal = parseFloat($ga.val()) || 0;

      if (prevArr > 0) {
        growthRate = ((currArr - prevArr) / prevArr) * 100;
      }

      if (revenue > 0) {
        var grossProfit = revenue - cogsVal;
        var grossMarginVal = (grossProfit / revenue) * 100;
        var opex = sm + rdVal + gaVal;
        var ebitdaVal = grossProfit - opex;
        var ebitdaMarginVal = (ebitdaVal / revenue) * 100;
        profitMargin = ebitdaMarginVal;

        $grossMargin.text(formatPercent(grossMarginVal));
        $ebitda.text(formatCurrency(ebitdaVal));
        $ebitdaMargin.text(formatPercent(ebitdaMarginVal));
        $ebitda.toggleClass('negative', ebitdaVal < 0);
        $ebitdaMargin.toggleClass('negative', ebitdaMarginVal < 0);
      }

      $arrGrowthCalc.text(formatPercent(growthRate));

      var qScores = [];
      var qGrowth = [
        parseFloat($q1Growth.val()) || 0,
        parseFloat($q2Growth.val()) || 0,
        parseFloat($q3Growth.val()) || 0,
        parseFloat($q4Growth.val()) || 0
      ];
      var qMargin = [
        parseFloat($q1Margin.val()) || 0,
        parseFloat($q2Margin.val()) || 0,
        parseFloat($q3Margin.val()) || 0,
        parseFloat($q4Margin.val()) || 0
      ];

      for (var i = 0; i < 4; i++) {
        qScores.push(qGrowth[i] + qMargin[i]);
      }

      var avgScore = qScores.reduce(function(a, b) { return a + b; }, 0) / 4;
      $trailingAvg.text(Math.round(avgScore));

      var q1Score = qScores[0];
      var q4Score = qScores[3];
      var trend = 'Flat';
      if (q4Score > q1Score + 2) trend = 'Improving';
      else if (q4Score < q1Score - 2) trend = 'Declining';
      $trendDirection.text(trend);
      $trendDirection.removeClass('positive negative');
      if (trend === 'Improving') $trendDirection.addClass('positive');
      else if (trend === 'Declining') $trendDirection.addClass('negative');

      $userGrowth.text(formatPercent(growthRate));
      $userMargin.text(formatPercent(profitMargin));
      $userScore.text(Math.round(growthRate + profitMargin));

      updateTrendChart(qScores);
    }

    var ruleOf40 = growthRate + profitMargin;

    $ruleOf40Score.text(Math.round(ruleOf40));
    $growthRateDisplay.text(formatPercent(growthRate));
    $profitMarginDisplay.text(formatPercent(profitMargin));

    var vsThresh = Math.round(ruleOf40 - 40);
    if (vsThresh >= 0) {
      $vsThreshold.text('+' + vsThresh + ' above');
      $vsThreshold.removeClass('negative').addClass('positive');
    } else {
      $vsThreshold.text(vsThresh + ' below');
      $vsThreshold.removeClass('positive').addClass('negative');
    }

    var badgeClass = getScoreBadgeClass(ruleOf40);
    var badgeText = getScoreBadgeText(ruleOf40);
    $scoreBadge.attr('class', 'score-badge ' + badgeClass).text(badgeText);
    $scoreMessage.text(getScoreMessage(ruleOf40));

    $ruleOf40Score.removeClass('elite healthy below-target underperforming struggling');
    $ruleOf40Score.addClass(badgeClass);

    if (warningMsg) {
      $warningMessage.text(warningMsg).show();
    } else {
      $warningMessage.hide();
    }
  }

  function updateTrendChart(qScores) {
    var canvas = document.getElementById('trendChart');
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    var width = rect.width;
    var height = rect.height;
    var padding = { top: 20, right: 20, bottom: 30, left: 40 };
    var chartWidth = width - padding.left - padding.right;
    var chartHeight = height - padding.top - padding.bottom;

    var minScore = Math.min.apply(null, qScores, 0);
    var maxScore = Math.max.apply(null, qScores, 80);
    minScore = Math.min(minScore, 0);
    maxScore = Math.max(maxScore, 80);
    var range = maxScore - minScore;
    if (range === 0) range = 40;

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = 'rgba(200,240,96,0.08)';
    var y40 = padding.top + chartHeight - ((40 - minScore) / range) * chartHeight;
    ctx.fillRect(padding.left, padding.top, chartWidth, y40 - padding.top);

    ctx.fillStyle = 'rgba(240,80,80,0.08)';
    ctx.fillRect(padding.left, y40, chartWidth, height - padding.bottom - y40);

    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    for (var i = 0; i <= 4; i++) {
      var y = padding.top + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    ctx.strokeStyle = '#f0a040';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(padding.left, y40);
    ctx.lineTo(width - padding.right, y40);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#f0a040';
    ctx.font = '10px "DM Mono"';
    ctx.textAlign = 'left';
    ctx.fillText('Rule of 40', width - padding.right - 50, y40 - 6);

    ctx.fillStyle = '#888580';
    ctx.font = '10px "DM Mono"';
    ctx.textAlign = 'right';
    for (var i = 0; i <= 4; i++) {
      var y = padding.top + (chartHeight / 4) * i;
      var val = Math.round(maxScore - (maxScore - minScore) * (i / 4));
      ctx.fillText(val, padding.left - 6, y + 4);
    }

    ctx.fillStyle = '#888580';
    ctx.textAlign = 'center';
    var quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    var step = chartWidth / 3;
    for (var i = 0; i < 4; i++) {
      var x = padding.left + step * i;
      ctx.fillText(quarters[i], x, height - 8);
    }

    ctx.strokeStyle = '#c8f060';
    ctx.lineWidth = 3;
    ctx.beginPath();
    qScores.forEach(function(score, i) {
      var x = padding.left + (chartWidth / 3) * i;
      var y = padding.top + chartHeight - ((score - minScore) / range) * chartHeight;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();

    ctx.fillStyle = '#c8f060';
    qScores.forEach(function(score, i) {
      var x = padding.left + (chartWidth / 3) * i;
      var y = padding.top + chartHeight - ((score - minScore) / range) * chartHeight;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
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
      $('#trendSection').toggle(mode === 'advanced');
      $('#benchmarkSection').toggle(mode === 'advanced');
      calculate();
    });
  }

  function initInputs() {
    $growthRate.on('input', calculate);
    $profitMargin.on('input', calculate);
    $marginType.on('change', function() {
      var types = { 'EBITDA': 'EBITDA Margin', 'FCF': 'Free Cash Flow Margin', 'Net': 'Net Profit Margin', 'Operating': 'Operating Margin' };
      $('#profitMargin').closest('.input-group').find('label').text(types[$(this).val()] + ' (%)');
      calculate();
    });
    $arrPrev.on('input', calculate);
    $arrCurrent.on('input', calculate);
    $totalRevenue.on('input', calculate);
    $cogs.on('input', calculate);
    $salesMarketing.on('input', calculate);
    $rd.on('input', calculate);
    $ga.on('input', calculate);
    $currency.on('change', calculate);

    $('.q-growth').on('input', calculate);
    $('.q-margin').on('input', calculate);
  }

  function initShare() {
    $('#copyResults').on('click', function() {
      var score = $ruleOf40Score.text();
      var growth = $growthRateDisplay.text();
      var margin = $profitMarginDisplay.text();
      var text = 'Rule of 40 Results\n' +
        'Score: ' + score + '\n' +
        'Growth Rate: ' + growth + '\n' +
        'Profit Margin: ' + margin + '\n' +
        $scoreMessage.text();
      navigator.clipboard.writeText(text).then(function() {
        alert('Results copied to clipboard!');
      });
    });

    $('#shareLink').on('click', function() {
      var params = new URLSearchParams({
        gr: $growthRate.val(),
        pm: $profitMargin.val(),
        mt: $marginType.val(),
        arrPrev: $arrPrev.val(),
        arrCurr: $arrCurrent.val(),
        rev: $totalRevenue.val(),
        cogs: $cogs.val(),
        sm: $salesMarketing.val(),
        rd: $rd.val(),
        ga: $ga.val(),
        curr: $currency.val(),
        q1g: $q1Growth.val(),
        q1m: $q1Margin.val(),
        q2g: $q2Growth.val(),
        q2m: $q2Margin.val(),
        q3g: $q3Growth.val(),
        q3m: $q3Margin.val(),
        q4g: $q4Growth.val(),
        q4m: $q4Margin.val(),
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
    if (params.has('gr')) $growthRate.val(params.get('gr'));
    if (params.has('pm')) $profitMargin.val(params.get('pm'));
    if (params.has('mt')) $marginType.val(params.get('mt'));
    if (params.has('arrPrev')) $arrPrev.val(params.get('arrPrev'));
    if (params.has('arrCurr')) $arrCurrent.val(params.get('arrCurr'));
    if (params.has('rev')) $totalRevenue.val(params.get('rev'));
    if (params.has('cogs')) $cogs.val(params.get('cogs'));
    if (params.has('sm')) $salesMarketing.val(params.get('sm'));
    if (params.has('rd')) $rd.val(params.get('rd'));
    if (params.has('ga')) $ga.val(params.get('ga'));
    if (params.has('curr')) $currency.val(params.get('curr'));
    if (params.has('q1g')) $q1Growth.val(params.get('q1g'));
    if (params.has('q1m')) $q1Margin.val(params.get('q1m'));
    if (params.has('q2g')) $q2Growth.val(params.get('q2g'));
    if (params.has('q2m')) $q2Margin.val(params.get('q2m'));
    if (params.has('q3g')) $q3Growth.val(params.get('q3g'));
    if (params.has('q3m')) $q3Margin.val(params.get('q3m'));
    if (params.has('q4g')) $q4Growth.val(params.get('q4g'));
    if (params.has('q4m')) $q4Margin.val(params.get('q4m'));
    if (params.has('mode')) {
      var mode = params.get('mode');
      $('.mode-btn').removeClass('active');
      $('.mode-btn[data-mode="' + mode + '"]').addClass('active');
      currentMode = mode;
      $('.advanced-inputs').toggle(mode === 'advanced');
      $('.advanced-results').toggle(mode === 'advanced');
      $('#trendSection').toggle(mode === 'advanced');
      $('#benchmarkSection').toggle(mode === 'advanced');
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
