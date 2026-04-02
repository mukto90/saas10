(function($) {
  'use strict';

  var currencySymbols = {
    USD: '$', EUR: '€', GBP: '£', BDT: '৳', INR: '₹', CAD: 'C$', AUD: 'A$', SGD: 'S$'
  };

  var multipleRanges = {
    preseed: { low: [3, 5, 8, 10], mid: [6, 10, 15, 20], high: [6, 10, 15, 20] },
    seed: { low: [5, 8, 12, 15], mid: [8, 15, 20, 30], high: [8, 15, 20, 30] },
    seriesA: { low: [6, 10, 15, 20], mid: [10, 18, 25, 40], high: [10, 18, 25, 40] },
    seriesB: { low: [5, 8, 12, 15], mid: [8, 15, 20, 30], high: [8, 15, 20, 30] },
    seriesC: { low: [4, 6, 10, 12], mid: [7, 12, 18, 25], high: [7, 12, 18, 25] },
    bootstrapped: { low: [3, 5, 7, 10], mid: [5, 8, 12, 18], high: [5, 8, 12, 18] }
  };

  var compMultiples = {
    preseed: { low: 8, mid: 15, high: 20 },
    seed: { low: 8, mid: 15, high: 20 },
    seriesA: { low: 10, mid: 18, high: 25 },
    seriesB: { low: 8, mid: 13, high: 18 },
    seriesC: { low: 6, mid: 10, high: 15 },
    bootstrapped: { low: 3, mid: 5, high: 6 }
  };

  var $currentArr = $('#currentArr');
  var $growthRate = $('#growthRate');
  var $stage = $('#stage');
  var $mrr = $('#mrr');
  var $nrr = $('#nrr');
  var $grossMargin = $('#grossMargin');
  var $multiYear = $('#multiYear');
  var $customerConcentration = $('#customerConcentration');
  var $ebitdaMargin = $('#ebitdaMargin');
  var $fcfMargin = $('#fcfMargin');
  var $burn = $('#burn');
  var $growthYr1 = $('#growthYr1');
  var $growthYr2 = $('#growthYr2');
  var $growthYr3 = $('#growthYr3');
  var $terminalGrowth = $('#terminalGrowth');
  var $discountRate = $('#discountRate');
  var $targetEbitdaMargin = $('#targetEbitdaMargin');
  var $arrWeight = $('#arrWeight');
  var $dcfWeight = $('#dcfWeight');
  var $compWeight = $('#compWeight');
  var $currency = $('#currency');

  var $valLow = $('#valLow');
  var $valMid = $('#valMid');
  var $valHigh = $('#valHigh');
  var $rangeBar = $('#rangeBar');
  var $barDot = $('#barDot');
  var $valuationBadge = $('#valuationBadge');
  var $impliedMultiple = $('#impliedMultiple');
  var $arrMultipleLow = $('#arrMultipleLow');
  var $arrMultipleMid = $('#arrMultipleMid');
  var $arrMultipleHigh = $('#arrMultipleHigh');
  var $dcfValuation = $('#dcfValuation');
  var $compValuation = $('#compValuation');
  var $blendedValuation = $('#blendedValuation');
  var $blendedRange = $('#blendedRange');
  var $ruleOf40 = $('#ruleOf40');
  var $nrrAdjustment = $('#nrrAdjustment');
  var $gmAdjustment = $('#gmAdjustment');
  var $adjustedMultiple = $('#adjustedMultiple');

  var currentMode = 'simple';

  function getSymbol() {
    return currencySymbols[$currency.val()] || '$';
  }

  function formatCurrency(num) {
    if (!isFinite(num) || isNaN(num) || num < 0) return getSymbol() + '0';
    if (num >= 1000000000) return getSymbol() + (num / 1000000000).toFixed(1) + 'B';
    if (num >= 1000000) return getSymbol() + (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return getSymbol() + (num / 1000).toFixed(0) + 'K';
    return getSymbol() + num.toFixed(0);
  }

  function formatFullCurrency(num) {
    if (!isFinite(num) || isNaN(num) || num < 0) return getSymbol() + '0';
    return num.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace('$', getSymbol());
  }

  function getGrowthBucket(growth) {
    if (growth < 50) return 0;
    if (growth <= 100) return 1;
    if (growth <= 200) return 2;
    return 3;
  }

  function getBaseMultiples(stage, growth) {
    var bucket = getGrowthBucket(growth);
    var ranges = multipleRanges[stage] || multipleRanges.seriesA;
    return {
      low: ranges.low[bucket],
      mid: ranges.mid[bucket],
      high: ranges.high[bucket]
    };
  }

  function getNrrAdjustment(nrr) {
    if (nrr > 150) return { adj: 3, note: '+3x (capped)' };
    if (nrr > 130) return { adj: 2, note: '+2x' };
    if (nrr >= 110) return { adj: 1, note: '+1x' };
    if (nrr >= 90) return { adj: 0, note: '0' };
    return { adj: -1.5, note: '-1.5x' };
  }

  function getGmAdjustment(gm) {
    if (gm > 80) return { adj: 1, note: '+1x' };
    if (gm >= 60) return { adj: 0, note: '0' };
    return { adj: -1.5, note: '-1.5x' };
  }

  function getValuationBadge(multiple) {
    if (multiple > 20) return { label: 'Premium', class: 'premium' };
    if (multiple >= 10) return { label: 'Strong', class: 'strong' };
    if (multiple >= 5) return { label: 'Market rate', class: 'market' };
    if (multiple >= 2) return { label: 'Conservative', class: 'conservative' };
    return { label: 'Distressed', class: 'distressed' };
  }

  function calculateDcf(arr, growths, terminalGrowth, discountRate, targetMargin, currentMargin) {
    var arrVal = parseFloat(arr) || 0;
    var tg = parseFloat(terminalGrowth) || 0;
    var dr = parseFloat(discountRate) || 0;
    var target = parseFloat(targetMargin) || 0;
    var current = parseFloat(currentMargin) || 0;

    if (dr <= tg) {
      return { value: 0, error: 'Discount rate must exceed terminal growth rate.' };
    }

    var pvSum = 0;
    var revenues = [arrVal];
    for (var i = 0; i < 3; i++) {
      revenues.push(revenues[i] * (1 + parseFloat(growths[i]) / 100));
    }

    for (var yr = 1; yr <= 3; yr++) {
      var margin = current + (target - current) * (yr / 3);
      var ebitda = revenues[yr] * (margin / 100);
      var pv = ebitda / Math.pow(1 + dr / 100, yr);
      pvSum += pv;
    }

    var terminalEbitda = revenues[3] * (target / 100);
    var terminalValue = terminalEbitda * (1 + tg / 100) / (dr / 100 - tg / 100);
    var pvTerminal = terminalValue / Math.pow(1 + dr / 100, 3);

    var totalValue = pvSum + pvTerminal;
    return { value: totalValue, error: null };
  }

  function calculateSensitivity() {
    var arr = parseFloat($currentArr.val()) || 0;
    var stage = $stage.val();
    var growthRates = [40, 60, 80, 100, 120];
    var margins = [-20, -10, 0, 10, 20];
    var currentGrowth = parseFloat($growthRate.val()) || 0;
    var currentMargin = parseFloat($ebitdaMargin.val()) || 0;

    var $table = $('#sensitivityTable');
    var html = '<thead><tr><th>Growth \\ Margin</th>';
    margins.forEach(function(m) { html += '<th>' + m + '%</th>'; });
    html += '</tr></thead><tbody>';

    var minVal = Infinity, maxVal = -Infinity;
    var values = [];

    growthRates.forEach(function(g) {
      var row = [];
      margins.forEach(function(m) {
        var base = getBaseMultiples(stage, g);
        var adj = base.mid + m / 10;
        var val = arr * adj;
        row.push(val);
        minVal = Math.min(minVal, val);
        maxVal = Math.max(maxVal, val);
        values.push(val);
      });
    });

    var range = maxVal - minVal;

    growthRates.forEach(function(g, gi) {
      html += '<tr><th>' + g + '%</th>';
      margins.forEach(function(m, mi) {
        var val = values[gi * 5 + mi];
        var isCurrent = Math.abs(g - currentGrowth) < 1 && Math.abs(m - currentMargin) < 1;
        var colorClass = '';
        if (range > 0) {
          var normalized = (val - minVal) / range;
          if (normalized < 0.33) colorClass = 'low';
          else if (normalized < 0.66) colorClass = 'mid';
          else colorClass = 'high';
        }
        html += '<td class="' + colorClass + (isCurrent ? ' highlight' : '') + '">' + formatCurrency(val) + '</td>';
      });
      html += '</tr>';
    });

    html += '</tbody>';
    $table.html(html);
  }

  function calculate() {
    var arr = parseFloat($currentArr.val()) || 0;
    var growth = parseFloat($growthRate.val()) || 0;
    var stage = $stage.val();
    var nrrVal = parseFloat($nrr.val()) || 0;
    var gmVal = parseFloat($grossMargin.val()) || 0;
    var ebitdaMargin = parseFloat($ebitdaMargin.val()) || 0;

    $('#concentrationWarning').hide();
    if (parseFloat($customerConcentration.val()) > 30) {
      $('#concentrationWarning').show();
    }

    $('#zeroArrWarning').hide();
    if (arr === 0) {
      $('#zeroArrWarning').show();
      $valLow.text('$0');
      $valMid.text('$0');
      $valHigh.text('$0');
      return;
    }

    var baseMult = getBaseMultiples(stage, growth);
    var nrrAdj = getNrrAdjustment(nrrVal);
    var gmAdj = getGmAdjustment(gmVal);

    var adjLow = baseMult.low + nrrAdj.adj + gmAdj.adj;
    var adjMid = baseMult.mid + nrrAdj.adj + gmAdj.adj;
    var adjHigh = baseMult.high + nrrAdj.adj + gmAdj.adj;

    $arrMultipleLow.text(adjLow.toFixed(1) + 'x');
    $arrMultipleMid.text(adjMid.toFixed(1) + 'x');
    $arrMultipleHigh.text(adjHigh.toFixed(1) + 'x');

    var valLow = arr * adjLow;
    var valMid = arr * adjMid;
    var valHigh = arr * adjHigh;

    $valLow.text(formatCurrency(valLow));
    $valMid.text(formatCurrency(valMid));
    $valHigh.text(formatCurrency(valHigh));

    var impliedMult = arr > 0 ? valMid / arr : 0;
    var badge = getValuationBadge(impliedMult);
    $valuationBadge.attr('class', 'valuation-badge ' + badge.class).text(badge.label);
    $impliedMultiple.text('Implied: ' + impliedMult.toFixed(1) + 'x ARR');

    var rangePct = valHigh > valLow ? ((valMid - valLow) / (valHigh - valLow)) * 100 : 50;
    $barDot.css('left', rangePct + '%');
    $rangeBar.css('width', '100%');

    if (currentMode === 'advanced') {
      var dcf = calculateDcf(
        arr,
        [$growthYr1.val(), $growthYr2.val(), $growthYr3.val()],
        $terminalGrowth.val(),
        $discountRate.val(),
        $targetEbitdaMargin.val(),
        ebitdaMargin
      );

      $('#dcfError').hide();
      $('#dcfWarning').hide();
      if (dcf.error) {
        $('#dcfError').text(dcf.error).show();
        $dcfValuation.text('$0');
      } else if (dcf.value < 0) {
        $('#dcfWarning').text('DCF is negative — business not yet profitable enough for DCF method.').show();
        $dcfValuation.text('$0');
      } else {
        $dcfValuation.text(formatCurrency(dcf.value));
      }

      var comp = compMultiples[stage] || compMultiples.seriesA;
      var compVal = arr * comp.mid;
      $compValuation.text(formatCurrency(compVal));

      var arrW = parseFloat($arrWeight.val()) || 0;
      var dcfW = parseFloat($dcfWeight.val()) || 0;
      var compW = parseFloat($compWeight.val()) || 0;

      $('#weightTotal').text('Total: ' + (arrW + dcfW + compW) + '%');
      if (arrW + dcfW + compW !== 100) {
        $('#weightWarning').show();
        $('#blendedValuation').text('—');
        $('#blendedRange').text('—');
      } else {
        $('#weightWarning').hide();
        var blended = (valMid * arrW / 100) + (dcf.value * dcfW / 100) + (compVal * compW / 100);
        $blendedValuation.text(formatCurrency(blended));
        var blendedLow = blended * 0.8;
        var blendedHigh = blended * 1.2;
        $blendedRange.text(formatCurrency(blendedLow) + ' — ' + formatCurrency(blendedHigh));
      }

      var ro40 = growth + ebitdaMargin;
      $ruleOf40.text(Math.round(ro40));
      $ruleOf40.removeClass('positive negative');
      if (ro40 >= 40) $ruleOf40.addClass('positive');
      else if (ro40 < 25) $ruleOf40.addClass('negative');

      $nrrAdjustment.text(nrrAdj.note);
      $gmAdjustment.text(gmAdj.note);
      $adjustedMultiple.text(adjMid.toFixed(1) + 'x');

      calculateSensitivity();
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
      $('#sensitivitySection').toggle(mode === 'advanced');
      $('#benchmarkSection').toggle(mode === 'advanced');
      calculate();
    });
  }

  function initInputs() {
    $currentArr.on('input', calculate);
    $growthRate.on('input', calculate);
    $stage.on('change', calculate);
    $mrr.on('input', calculate);
    $nrr.on('input', calculate);
    $grossMargin.on('input', calculate);
    $multiYear.on('input', calculate);
    $customerConcentration.on('input', calculate);
    $ebitdaMargin.on('input', calculate);
    $fcfMargin.on('input', calculate);
    $burn.on('input', calculate);
    $growthYr1.on('input', calculate);
    $growthYr2.on('input', calculate);
    $growthYr3.on('input', calculate);
    $terminalGrowth.on('input', calculate);
    $discountRate.on('input', calculate);
    $targetEbitdaMargin.on('input', calculate);
    $currency.on('change', calculate);

    $arrWeight.on('input', function() { $('#arrWeightVal').text($(this).val() + '%'); calculate(); });
    $dcfWeight.on('input', function() { $('#dcfWeightVal').text($(this).val() + '%'); calculate(); });
    $compWeight.on('input', function() { $('#compWeightVal').text($(this).val() + '%'); calculate(); });
  }

  function initShare() {
    $('#copyResults').on('click', function() {
      var text = 'SaaS Valuation Results\n' +
        'ARR: ' + $currentArr.val() + '\n' +
        'Growth: ' + $growthRate.val() + '%\n' +
        'Stage: ' + $stage.val() + '\n' +
        'Valuation Range: ' + $valLow.text() + ' — ' + $valHigh.text() + '\n' +
        'Mid Valuation: ' + $valMid.text() + '\n' +
        'Implied Multiple: ' + $impliedMultiple.text();
      navigator.clipboard.writeText(text).then(function() {
        alert('Results copied to clipboard!');
      });
    });

    $('#shareLink').on('click', function() {
      var params = new URLSearchParams({
        arr: $currentArr.val(),
        gr: $growthRate.val(),
        stage: $stage.val(),
        mrr: $mrr.val(),
        nrr: $nrr.val(),
        gm: $grossMargin.val(),
        my: $multiYear.val(),
        cc: $customerConcentration.val(),
        ebitda: $ebitdaMargin.val(),
        fcf: $fcfMargin.val(),
        burn: $burn.val(),
        g1: $growthYr1.val(),
        g2: $growthYr2.val(),
        g3: $growthYr3.val(),
        tg: $terminalGrowth.val(),
        dr: $discountRate.val(),
        tem: $targetEbitdaMargin.val(),
        aw: $arrWeight.val(),
        dw: $dcfWeight.val(),
        cw: $compWeight.val(),
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
    if (params.has('arr')) $currentArr.val(params.get('arr'));
    if (params.has('gr')) $growthRate.val(params.get('gr'));
    if (params.has('stage')) $stage.val(params.get('stage'));
    if (params.has('mrr')) $mrr.val(params.get('mrr'));
    if (params.has('nrr')) $nrr.val(params.get('nrr'));
    if (params.has('gm')) $grossMargin.val(params.get('gm'));
    if (params.has('my')) $multiYear.val(params.get('my'));
    if (params.has('cc')) $customerConcentration.val(params.get('cc'));
    if (params.has('ebitda')) $ebitdaMargin.val(params.get('ebitda'));
    if (params.has('fcf')) $fcfMargin.val(params.get('fcf'));
    if (params.has('burn')) $burn.val(params.get('burn'));
    if (params.has('g1')) $growthYr1.val(params.get('g1'));
    if (params.has('g2')) $growthYr2.val(params.get('g2'));
    if (params.has('g3')) $growthYr3.val(params.get('g3'));
    if (params.has('tg')) $terminalGrowth.val(params.get('tg'));
    if (params.has('dr')) $discountRate.val(params.get('dr'));
    if (params.has('tem')) $targetEbitdaMargin.val(params.get('tem'));
    if (params.has('aw')) { $arrWeight.val(params.get('aw')); $('#arrWeightVal').text(params.get('aw') + '%'); }
    if (params.has('dw')) { $dcfWeight.val(params.get('dw')); $('#dcfWeightVal').text(params.get('dw') + '%'); }
    if (params.has('cw')) { $compWeight.val(params.get('cw')); $('#compWeightVal').text(params.get('cw') + '%'); }
    if (params.has('curr')) $currency.val(params.get('curr'));
    if (params.has('mode')) {
      var mode = params.get('mode');
      $('.mode-btn').removeClass('active');
      $('.mode-btn[data-mode="' + mode + '"]').addClass('active');
      currentMode = mode;
      $('.advanced-inputs').toggle(mode === 'advanced');
      $('.advanced-results').toggle(mode === 'advanced');
      $('#sensitivitySection').toggle(mode === 'advanced');
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
