(function($) {
  'use strict';

  var currencySymbols = {
    USD: '$', EUR: '€', GBP: '£', BDT: '৳', INR: '₹', CAD: 'C$', AUD: 'A$', SGD: 'S$'
  };

  var $currentArr = $('#currentArr');
  var $targetArr = $('#targetArr');
  var $quota = $('#quota');
  var $attainment = $('#attainment');
  var $rampTime = $('#rampTime');
  var $currentReps = $('#currentReps');
  var $ote = $('#ote');
  var $costMultiplier = $('#costMultiplier');
  var $dealSize = $('#dealSize');
  var $salesCycle = $('#salesCycle');
  var $winRate = $('#winRate');
  var $attrition = $('#attrition');
  var $backfillTime = $('#backfillTime');
  var $hireStart = $('#hireStart');
  var $hireRate = $('#hireRate');
  var $hirePeriod = $('#hirePeriod');
  var $includeSdr = $('#includeSdr');
  var $sdrRatio = $('#sdrRatio');
  var $sdrOte = $('#sdrOte');
  var $sdrPipeline = $('#sdrPipeline');
  var $currency = $('#currency');

  var $capacityBadge = $('#capacityBadge');
  var $capacityMessage = $('#capacityMessage');
  var $arrGap = $('#arrGap');
  var $effectiveQuota = $('#effectiveQuota');
  var $repsNeeded = $('#repsNeeded');
  var $additionalReps = $('#additionalReps');
  var $timeToTarget = $('#timeToTarget');
  var $payrollCost = $('#payrollCost');
  var $pipelineNeeded = $('#pipelineNeeded');
  var $dealsNeeded = $('#dealsNeeded');
  var $repsWithAttrition = $('#repsWithAttrition');
  var $sdrsNeeded = $('#sdrsNeeded');
  var $totalTeamCost = $('#totalTeamCost');
  var $costPerArr = $('#costPerArr');
  var $firstRamp = $('#firstRamp');
  var $riskFromAttrition = $('#riskFromAttrition');

  var currentMode = 'simple';

  function getSymbol() {
    return currencySymbols[$currency.val()] || '$';
  }

  function formatCurrency(num) {
    if (!isFinite(num) || isNaN(num)) return getSymbol() + '0';
    if (num >= 1000000) return getSymbol() + (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return getSymbol() + (num / 1000).toFixed(0) + 'K';
    return getSymbol() + num.toFixed(0);
  }

  function getRampCurve() {
    var curve = [];
    $('.ramp-productivity').each(function() {
      curve.push(parseFloat($(this).val()) || 0);
    });
    return curve;
  }

  function getProductivityAtMonth(rampCurve, monthHired, currentMonth) {
    var monthsOnTeam = currentMonth - monthHired + 1;
    if (monthsOnTeam < 1) return 0;
    if (monthsOnTeam > rampCurve.length) monthsOnTeam = rampCurve.length;
    return rampCurve[monthsOnTeam - 1] / 100;
  }

  function calculate() {
    var currentArr = parseFloat($currentArr.val()) || 0;
    var targetArr = parseFloat($targetArr.val()) || 0;
    var quota = parseFloat($quota.val()) || 0;
    var attainment = parseFloat($attainment.val()) || 0;
    var rampTime = parseInt($rampTime.val()) || 0;
    var currentReps = parseInt($currentReps.val()) || 0;

    $('#warningMessage').hide();
    $('#errorMessage').hide();

    if (targetArr < currentArr) {
      $('#warningMessage').text('Target is below current ARR. Model assumes maintaining current revenue.').show();
    }

    if (attainment <= 0) {
      $('#errorMessage').text('0% attainment means no revenue generated.').show();
      return;
    }

    var arrGap = Math.max(0, targetArr - currentArr);
    $arrGap.text(formatCurrency(arrGap));

    var effectiveQuota = quota * (attainment / 100);
    $effectiveQuota.text(formatCurrency(effectiveQuota));

    if (arrGap === 0) {
      $repsNeeded.text('0');
      $additionalReps.text('0');
      $timeToTarget.text('Already achieved');
      $payrollCost.text(formatCurrency(0) + '/yr');
      return;
    }

    var repsNeeded = Math.ceil(arrGap / effectiveQuota);
    $repsNeeded.text(repsNeeded);

    var additionalReps = Math.max(0, repsNeeded - currentReps);
    $additionalReps.text(additionalReps);

    if (currentReps >= repsNeeded) {
      $('#warningMessage').text('You already have enough capacity — focus on attainment and ramp.').show();
    }

    if (currentMode === 'advanced') {
      var ote = parseFloat($ote.val()) || 0;
      var multiplier = parseFloat($costMultiplier.val()) || 1;
      var dealSize = parseFloat($dealSize.val()) || 0;
      var winRate = parseFloat($winRate.val()) || 0;
      var attrition = parseFloat($attrition.val()) || 0;
      var backfillTime = parseInt($backfillTime.val()) || 0;
      var hireStart = parseInt($hireStart.val()) || 1;
      var hireRate = parseInt($hireRate.val()) || 0;
      var hirePeriod = parseInt($hirePeriod.val()) || 0;
      var includeSdr = $includeSdr.is(':checked');
      var sdrRatioVal = parseInt($sdrRatio.val()) || 2;
      var sdrOteVal = parseFloat($sdrOte.val()) || 0;

      if (winRate <= 0) {
        $('#errorMessage').text('Win rate is 0% — pipeline needed would be infinite.').show();
      }

      var rampCurve = getRampCurve();

      var pipelineNeeded = winRate > 0 ? arrGap / (winRate / 100) : 0;
      $pipelineNeeded.text(formatCurrency(pipelineNeeded));

      var dealsNeeded = dealSize > 0 ? Math.ceil(pipelineNeeded / dealSize) : 0;
      $dealsNeeded.text(dealsNeeded);

      var repsWithAttrition = Math.ceil(repsNeeded * (1 + attrition / 100));
      $repsWithAttrition.text(repsWithAttrition);

      var totalRepCost = repsNeeded * ote * multiplier;

      var sdrsNeededVal = 0;
      if (includeSdr) {
        sdrsNeededVal = Math.ceil(repsNeeded / sdrRatioVal);
        $sdrsNeeded.text(sdrsNeededVal);
      } else {
        $sdrsNeeded.text('0');
      }

      var totalSdrCost = sdrsNeededVal * sdrOteVal * multiplier;
      var totalTeamCost = totalRepCost + totalSdrCost;
      $totalTeamCost.text(formatCurrency(totalTeamCost) + '/yr');

      var costPerDollar = arrGap > 0 ? totalTeamCost / arrGap : 0;
      $costPerArr.text(getSymbol() + costPerDollar.toFixed(2));

      var badgeClass, badgeText, badgeMsg;
      if (costPerDollar < 0.75) { badgeClass = 'very-efficient'; badgeText = 'Very efficient'; badgeMsg = 'Your sales team is highly cost-effective.'; }
      else if (costPerDollar < 1.0) { badgeClass = 'efficient'; badgeText = 'Efficient'; badgeMsg = 'Your sales team cost is efficient.'; }
      else if (costPerDollar < 1.5) { badgeClass = 'acceptable'; badgeText = 'Acceptable'; badgeMsg = 'Your sales team cost is within acceptable range.'; }
      else if (costPerDollar < 2.0) { badgeClass = 'expensive'; badgeText = 'Expensive'; badgeMsg = 'Your sales team cost is high. Consider improving efficiency.'; }
      else { badgeClass = 'unsustainable'; badgeText = 'Unsustainable'; badgeMsg = 'Your sales team cost is not sustainable at this revenue level.'; }

      $capacityBadge.attr('class', 'capacity-badge ' + badgeClass).text(badgeText);
      $capacityMessage.text(badgeMsg);

      var payrollCostSimple = currentReps * ote * multiplier;
      $payrollCost.text(formatCurrency(payrollCostSimple) + '/yr');

      var firstRampMonth = hireStart + rampCurve.length;
      $firstRamp.text('Month ' + firstRampMonth);

      var riskVal = (currentReps + additionalReps) * effectiveQuota * (attrition / 100);
      $riskFromAttrition.text(formatCurrency(riskVal) + '/yr');

      var monthsUntilTarget = calculateTimeToTarget(arrGap, currentReps, additionalReps, effectiveQuota, rampCurve, hireStart, hireRate, hirePeriod);
      $timeToTarget.text(monthsUntilTarget + ' months');

      updateCapacityChart(arrGap, currentReps, additionalReps, effectiveQuota, rampCurve, hireStart, hireRate, hirePeriod);
      updateHiringTable(arrGap, currentReps, additionalReps, effectiveQuota, rampCurve, hireStart, hireRate, hirePeriod, attrition);
    } else {
      var oteSimple = parseFloat($ote.val()) || 120000;
      var multSimple = parseFloat($costMultiplier.val()) || 1.3;
      var payrollCostSimple = repsNeeded * oteSimple * multSimple;
      $payrollCost.text(formatCurrency(payrollCostSimple) + '/yr');

      var rampMonths = rampTime > 0 ? rampTime : 1;
      var monthsToTarget = Math.max(1, Math.ceil(arrGap / (additionalReps * effectiveQuota / 12))) + rampMonths;
      if (additionalReps === 0) monthsToTarget = 0;
      $timeToTarget.text(monthsToTarget > 0 ? monthsToTarget + ' months' : 'Already achieved');

      $capacityBadge.attr('class', 'capacity-badge acceptable').text('N/A in Simple Mode');
      $capacityMessage.text('Switch to Advanced Mode for efficiency metrics.');
    }
  }

  function calculateTimeToTarget(arrGap, currentReps, additionalReps, effectiveQuota, rampCurve, hireStart, hireRate, hirePeriod) {
    if (additionalReps <= 0) return 0;

    var months = 24;
    var totalCapacity = 0;

    for (var m = 1; m <= months; m++) {
      totalCapacity = 0;

      for (var r = 0; r < currentReps; r++) {
        var monthsOnTeam = m;
        if (monthsOnTeam > rampCurve.length) monthsOnTeam = rampCurve.length;
        totalCapacity += (effectiveQuota / 12) * (rampCurve[monthsOnTeam - 1] / 100);
      }

      var hiresByMonth = 0;
      if (m >= hireStart) {
        var monthsOfHiring = Math.min(hirePeriod, m - hireStart + 1);
        hiresByMonth = monthsOfHiring * hireRate;
      }

      var newRepsHired = Math.min(hiresByMonth, additionalReps);

      for (var nr = 0; nr < newRepsHired; nr++) {
        var hireMonth = m;
        var monthsOnTeam = 1;
        if (monthsOnTeam > rampCurve.length) monthsOnTeam = rampCurve.length;
        totalCapacity += (effectiveQuota / 12) * (rampCurve[monthsOnTeam - 1] / 100);
      }

      if (totalCapacity * 12 >= arrGap) {
        return m;
      }
    }

    return months;
  }

  function updateCapacityChart(arrGap, currentReps, additionalReps, effectiveQuota, rampCurve, hireStart, hireRate, hirePeriod) {
    var canvas = document.getElementById('capacityChart');
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

    var months = 24;
    var dataCapacity = [];
    var targetReached = 0;

    for (var m = 1; m <= months; m++) {
      var capacity = 0;

      for (var r = 0; r < currentReps; r++) {
        capacity += (effectiveQuota / 12) * getProductivityAtMonth(rampCurve, 1, m);
      }

      var hiresByMonth = 0;
      if (m >= hireStart) {
        var monthsOfHiring = Math.min(hirePeriod, m - hireStart + 1);
        hiresByMonth = Math.min(monthsOfHiring * hireRate, additionalReps);
      }

      for (var nr = 0; nr < hiresByMonth; nr++) {
        var hireMonth = m - nr;
        capacity += (effectiveQuota / 12) * getProductivityAtMonth(rampCurve, hireMonth, m);
      }

      dataCapacity.push(capacity);

      if (targetReached === 0 && capacity * 12 >= arrGap) {
        targetReached = m;
      }
    }

    var maxCapacity = Math.max.apply(null, dataCapacity, arrGap / 12);
    maxCapacity = maxCapacity * 1.2;

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = 'rgba(200,240,96,0.08)';
    if (targetReached > 0) {
      var targetX = padding.left + ((targetReached - 1) / (months - 1)) * chartWidth;
      ctx.fillRect(targetX, padding.top, width - padding.right - targetX, chartHeight);
    }

    ctx.fillStyle = '#888580';
    ctx.textAlign = 'right';
    for (var i = 0; i <= 4; i++) {
      var y = padding.top + (chartHeight / 4) * i;
      var val = maxCapacity - (maxCapacity / 4) * i;
      ctx.fillText(formatCurrency(val), padding.left - 6, y + 4);
    }

    ctx.fillStyle = '#888580';
    ctx.textAlign = 'center';
    for (var i = 0; i < months; i += 3) {
      var x = padding.left + (chartWidth / (months - 1)) * i;
      ctx.fillText('M' + (i + 1), x, height - 8);
    }

    var targetY = padding.top + chartHeight - ((arrGap / 12) / maxCapacity) * chartHeight;
    ctx.strokeStyle = '#f05050';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(padding.left, targetY);
    ctx.lineTo(width - padding.right, targetY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#f05050';
    ctx.textAlign = 'left';
    ctx.fillText('Target', width - padding.right - 40, targetY - 6);

    ctx.strokeStyle = '#c8f060';
    ctx.lineWidth = 3;
    ctx.beginPath();
    dataCapacity.forEach(function(v, i) {
      var x = padding.left + (chartWidth / (months - 1)) * i;
      var y = padding.top + chartHeight - (v / maxCapacity) * chartHeight;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();

    if (targetReached > 0) {
      var tx = padding.left + ((targetReached - 1) / (months - 1)) * chartWidth;
      ctx.strokeStyle = '#c8f060';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(tx, padding.top);
      ctx.lineTo(tx, height - padding.bottom);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#c8f060';
      ctx.font = '10px "DM Mono"';
      ctx.textAlign = 'center';
      ctx.fillText('Target: M' + targetReached, tx, padding.top - 6);
    }
  }

  function updateHiringTable(arrGap, currentReps, additionalReps, effectiveQuota, rampCurve, hireStart, hireRate, hirePeriod, attrition) {
    var $tbody = $('#hiringTable tbody');
    $tbody.empty();

    var months = 12;
    var activeReps = currentReps;
    var cumulativeHires = 0;

    for (var m = 1; m <= months; m++) {
      var hires = 0;
      if (m >= hireStart && cumulativeHires < additionalReps) {
        var remainingHires = additionalReps - cumulativeHires;
        hires = Math.min(hireRate, remainingHires);
        cumulativeHires += hires;
      }

      var attritionLoss = Math.round(activeReps * (attrition / 100 / 12));

      var newActive = activeReps + hires - attritionLoss;
      var ramping = 0;
      var fullyRamped = 0;

      for (var r = 0; r < newActive; r++) {
        var monthsOnTeam = m;
        if (monthsOnTeam > rampCurve.length) monthsOnTeam = rampCurve.length;
        var prod = rampCurve[monthsOnTeam - 1] / 100;
        if (prod < 1) ramping++;
        else fullyRamped++;
      }

      var capacity = 0;
      for (var nr = 0; nr < newActive; nr++) {
        var monthsOnTeam = m;
        if (monthsOnTeam > rampCurve.length) monthsOnTeam = rampCurve.length;
        capacity += (effectiveQuota / 12) * (rampCurve[monthsOnTeam - 1] / 100);
      }

      var html = '<tr>' +
        '<td>M' + m + '</td>' +
        '<td>' + hires + '</td>' +
        '<td>' + attritionLoss + '</td>' +
        '<td>' + newActive + '</td>' +
        '<td>' + ramping + '</td>' +
        '<td>' + fullyRamped + '</td>' +
        '<td>' + formatCurrency(capacity) + '</td>' +
        '</tr>';
      $tbody.append(html);

      activeReps = newActive;
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
      $('#capacityChartSection').toggle(mode === 'advanced');
      $('#hiringTableSection').toggle(mode === 'advanced');
      calculate();
    });
  }

  function initInputs() {
    $currentArr.on('input', calculate);
    $targetArr.on('input', calculate);
    $quota.on('input', calculate);
    $attainment.on('input', calculate);
    $rampTime.on('input', calculate);
    $currentReps.on('input', calculate);
    $ote.on('input', calculate);
    $costMultiplier.on('input', calculate);
    $dealSize.on('input', calculate);
    $salesCycle.on('input', calculate);
    $winRate.on('input', calculate);
    $attrition.on('input', calculate);
    $backfillTime.on('input', calculate);
    $hireStart.on('input', calculate);
    $hireRate.on('input', calculate);
    $hirePeriod.on('input', calculate);
    $sdrRatio.on('change', calculate);
    $sdrOte.on('input', calculate);
    $sdrPipeline.on('input', calculate);
    $currency.on('change', calculate);

    $includeSdr.on('change', function() {
      $('.sdr-inputs').toggle($(this).is(':checked'));
      calculate();
    });

    $(document).on('input', '.ramp-productivity', calculate);
  }

  function initShare() {
    $('#copyResults').on('click', function() {
      var text = 'Sales Capacity Planner Results\n' +
        'Current ARR: ' + $currentArr.val() + '\n' +
        'Target ARR: ' + $targetArr.val() + '\n' +
        'ARR Gap: ' + $arrGap.text() + '\n' +
        'Effective Quota: ' + $effectiveQuota.text() + '\n' +
        'Reps Needed: ' + $repsNeeded.text() + '\n' +
        'Additional Reps: ' + $additionalReps.text() + '\n' +
        'Time to Target: ' + $timeToTarget.text() + '\n' +
        'Sales Payroll Cost: ' + $payrollCost.text();
      navigator.clipboard.writeText(text).then(function() {
        alert('Results copied to clipboard!');
      });
    });

    $('#copyCsv').on('click', function() {
      var csv = 'Month,Hires,Attrition,Active Reps,Ramping,Fully Ramped,Capacity\n';
      $('#hiringTable tbody tr').each(function() {
        var row = [];
        $(this).find('td').each(function() {
          row.push($(this).text());
        });
        csv += row.join(',') + '\n';
      });
      navigator.clipboard.writeText(csv).then(function() {
        alert('CSV copied to clipboard!');
      });
    });

    $('#shareLink').on('click', function() {
      var params = new URLSearchParams({
        carr: $currentArr.val(),
        tarr: $targetArr.val(),
        q: $quota.val(),
        a: $attainment.val(),
        r: $rampTime.val(),
        cr: $currentReps.val(),
        ote: $ote.val(),
        cm: $costMultiplier.val(),
        ds: $dealSize.val(),
        sc: $salesCycle.val(),
        wr: $winRate.val(),
        attr: $attrition.val(),
        bt: $backfillTime.val(),
        hs: $hireStart.val(),
        hr: $hireRate.val(),
        hp: $hirePeriod.val(),
        isdr: $includeSdr.is(':checked') ? 1 : 0,
        sdr: $sdrRatio.val(),
        sdrO: $sdrOte.val(),
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
    if (params.has('carr')) $currentArr.val(params.get('carr'));
    if (params.has('tarr')) $targetArr.val(params.get('tarr'));
    if (params.has('q')) $quota.val(params.get('q'));
    if (params.has('a')) $attainment.val(params.get('a'));
    if (params.has('r')) $rampTime.val(params.get('r'));
    if (params.has('cr')) $currentReps.val(params.get('cr'));
    if (params.has('ote')) $ote.val(params.get('ote'));
    if (params.has('cm')) $costMultiplier.val(params.get('cm'));
    if (params.has('ds')) $dealSize.val(params.get('ds'));
    if (params.has('sc')) $salesCycle.val(params.get('sc'));
    if (params.has('wr')) $winRate.val(params.get('wr'));
    if (params.has('attr')) $attrition.val(params.get('attr'));
    if (params.has('bt')) $backfillTime.val(params.get('bt'));
    if (params.has('hs')) $hireStart.val(params.get('hs'));
    if (params.has('hr')) $hireRate.val(params.get('hr'));
    if (params.has('hp')) $hirePeriod.val(params.get('hp'));
    if (params.has('isdr')) $includeSdr.prop('checked', params.get('isdr') === '1');
    if (params.has('sdr')) $sdrRatio.val(params.get('sdr'));
    if (params.has('sdrO')) $sdrOte.val(params.get('sdrO'));
    if (params.has('curr')) $currency.val(params.get('curr'));
    if (params.has('mode')) {
      var mode = params.get('mode');
      $('.mode-btn').removeClass('active');
      $('.mode-btn[data-mode="' + mode + '"]').addClass('active');
      currentMode = mode;
      $('.advanced-inputs').toggle(mode === 'advanced');
      $('.advanced-results').toggle(mode === 'advanced');
      $('#capacityChartSection').toggle(mode === 'advanced');
      $('#hiringTableSection').toggle(mode === 'advanced');
    }

    if ($includeSdr.is(':checked')) {
      $('.sdr-inputs').show();
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
