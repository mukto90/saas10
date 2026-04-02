(function($) {
  'use strict';

  var currencySymbols = {
    USD: '$', EUR: '€', GBP: '£', BDT: '৳', INR: '₹', CAD: 'C$', AUD: 'A$', SGD: 'S$'
  };

  var $arr = $('#arr');
  var $employees = $('#employees');
  var $includeContractors = $('#includeContractors');
  var $contractors = $('#contractors');
  var $mrr = $('#mrr');
  var $arrGrowth = $('#arrGrowth');
  var $newArr = $('#newArr');
  var $totalPayroll = $('#totalPayroll');
  var $currency = $('#currency');

  var $q1Arr = $('#q1Arr');
  var $q1Hc = $('#q1Hc');
  var $q2Arr = $('#q2Arr');
  var $q2Hc = $('#q2Hc');
  var $q3Arr = $('#q3Arr');
  var $q3Hc = $('#q3Hc');
  var $q4Arr = $('#q4Arr');
  var $q4Hc = $('#q4Hc');

  var $rpeValue = $('#rpeValue');
  var $rpeBadge = $('#rpeBadge');
  var $rpeMessage = $('#rpeMessage');
  var $totalHeadcount = $('#totalHeadcount');
  var $headcountNeeded = $('#headcountNeeded');
  var $revPerPayroll = $('#revPerPayroll');
  var $payrollEfficiency = $('#payrollEfficiency');
  var $payrollEffContainer = $('#payrollEffContainer');
  var $payrollRatio = $('#payrollRatio');
  var $newArrPerSm = $('#newArrPerSm');
  var $costPerEmployee = $('#costPerEmployee');
  var $rpeTrend = $('#rpeTrend');
  var $hcVsArrGrowth = $('#hcVsArrGrowth');

  var $userArr = $('#userArr');
  var $userHc = $('#userHc');
  var $userRpe = $('#userRpe');

  var currentMode = 'simple';
  var deptCount = 4;

  function getSymbol() {
    return currencySymbols[$currency.val()] || '$';
  }

  function formatCurrency(num) {
    if (!isFinite(num) || isNaN(num)) return getSymbol() + '0';
    if (num >= 1000000) return getSymbol() + (num / 1000000).toFixed(0) + 'M';
    if (num >= 1000) return getSymbol() + (num / 1000).toFixed(0) + 'K';
    return getSymbol() + num.toFixed(0);
  }

  function formatCurrencyFull(num) {
    if (!isFinite(num) || isNaN(num)) return getSymbol() + '0';
    return num.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace('$', getSymbol());
  }

  function getRpeBadge(rpe) {
    if (rpe > 500000) return { label: 'Elite', class: 'elite' };
    if (rpe >= 300000) return { label: 'Strong', class: 'strong' };
    if (rpe >= 150000) return { label: 'Healthy', class: 'healthy' };
    if (rpe >= 75000) return { label: 'Building', class: 'building' };
    return { label: 'Early stage', class: 'early' };
  }

  function getRpeMessage(rpe) {
    if (rpe > 500000) return 'Elite efficiency. Comparable to Shopify, Atlassian, and other high-leverage SaaS businesses.';
    if (rpe >= 300000) return 'Strong. You\'re generating significant revenue per head.';
    if (rpe >= 150000) return 'Healthy for a growing SaaS. Typical for Series A–B companies.';
    if (rpe >= 75000) return 'Building stage. Normal for early-growth teams investing ahead of revenue.';
    return 'Early stage or overhired relative to current revenue.';
  }

  function getDepts() {
    var depts = [];
    $('.dept-row').each(function() {
      depts.push({
        name: $(this).find('.dept-name').val(),
        headcount: parseInt($(this).find('.dept-headcount').val()) || 0,
        cost: parseFloat($(this).find('.dept-cost').val()) || 0
      });
    });
    return depts;
  }

  function getDeptHeadcountSum() {
    var sum = 0;
    $('.dept-headcount').each(function() {
      sum += parseInt($(this).val()) || 0;
    });
    return sum;
  }

  function calculate() {
    var arrVal = parseFloat($arr.val()) || 0;
    var empVal = parseInt($employees.val()) || 0;
    var includeContractors = $includeContractors.is(':checked');
    var contractorsVal = parseFloat($contractors.val()) || 0;

    var totalHc = empVal;
    if (includeContractors) {
      totalHc += contractorsVal;
    }

    $totalHeadcount.text(totalHc);

    $('#warningMessage').hide();
    $('#deptWarning').hide();
    $('#payrollWarning').hide();

    if (empVal === 0) {
      $rpeValue.text('N/A');
      $rpeBadge.text('—').attr('class', 'rpe-badge');
      $rpeMessage.text('No employees entered.');
      $headcountNeeded.text('—');
      return;
    }

    if (arrVal === 0) {
      $rpeValue.text('$0');
      $rpeBadge.text('—').attr('class', 'rpe-badge');
      $rpeMessage.text('No revenue yet.');
      $headcountNeeded.text('—');
      return;
    }

    var rpe = arrVal / totalHc;
    $rpeValue.text(formatCurrency(rpe));

    var badge = getRpeBadge(rpe);
    $rpeBadge.attr('class', 'rpe-badge ' + badge.class).text(badge.label);
    $rpeMessage.text(getRpeMessage(rpe));

    $userArr.text(formatCurrency(arrVal));
    $userHc.text(totalHc);
    $userRpe.text(formatCurrency(rpe));

    $headcountNeeded.text('—');

    if (currentMode === 'advanced') {
      var payroll = parseFloat($totalPayroll.val()) || 0;
      var mrrVal = parseFloat($mrr.val()) || 0;
      var arrGrowthVal = parseFloat($arrGrowth.val()) || 0;
      var newArrVal = parseFloat($newArr.val()) || 0;

      if (payroll > 0) {
        var revPerPay = arrVal / payroll;
        $revPerPayroll.text('$' + revPerPay.toFixed(2));

        var payEff = (payroll / arrVal) * 100;
        $payrollEfficiency.text(payEff.toFixed(1) + '%');
        $payrollRatio.text(payEff.toFixed(1) + '%');

        if (payEff > 100) {
          $payrollEffContainer.addClass('negative');
          $('#payrollWarning').show();
        } else {
          $payrollEffContainer.removeClass('negative');
        }
      } else {
        $revPerPayroll.text('—');
        $payrollEfficiency.text('—');
        $payrollRatio.text('—');
      }

      var depts = getDepts();
      var deptHcSum = getDeptHeadcountSum();
      if (Math.abs(deptHcSum - totalHc) > 0 && depts.length > 0) {
        $('#deptWarning').text('Department headcount totals ' + deptHcSum + '. Your total is ' + totalHc + '. Reconcile for accurate dept RPE.').show();
      }

      var salesHc = 0, marketingHc = 0;
      depts.forEach(function(d) {
        var name = d.name.toLowerCase();
        if (name.indexOf('sale') >= 0) salesHc += d.headcount;
        if (name.indexOf('market') >= 0) marketingHc += d.headcount;
      });

      var smHc = salesHc + marketingHc;
      if (smHc > 0 && newArrVal > 0) {
        $newArrPerSm.text(formatCurrency(newArrVal / smHc));
      } else {
        $newArrPerSm.text('—');
      }

      if (totalHc > 0 && payroll > 0) {
        $costPerEmployee.text(formatCurrency(payroll / totalHc));
      } else {
        $costPerEmployee.text('—');
      }

      var q1Rpe = 0, q2Rpe = 0, q3Rpe = 0, q4Rpe = 0;
      var q1a = parseFloat($q1Arr.val()) || 0;
      var q1h = parseFloat($q1Hc.val()) || 0;
      var q2a = parseFloat($q2Arr.val()) || 0;
      var q2h = parseFloat($q2Hc.val()) || 0;
      var q3a = parseFloat($q3Arr.val()) || 0;
      var q3h = parseFloat($q3Hc.val()) || 0;
      var q4a = parseFloat($q4Arr.val()) || 0;
      var q4h = parseFloat($q4Hc.val()) || 0;

      if (q1a > 0 && q1h > 0) q1Rpe = q1a / q1h;
      if (q2a > 0 && q2h > 0) q2Rpe = q2a / q2h;
      if (q3a > 0 && q3h > 0) q3Rpe = q3a / q3h;
      if (q4a > 0 && q4h > 0) q4Rpe = q4a / q4h;

      if (q1Rpe > 0 && q4Rpe > 0) {
        var trendPct = ((q4Rpe - q1Rpe) / q1Rpe) * 100;
        if (trendPct > 0) {
          $rpeTrend.text('Improving +' + trendPct.toFixed(0) + '%');
          $rpeTrend.removeClass('negative').addClass('positive');
        } else if (trendPct < 0) {
          $rpeTrend.text('Declining ' + trendPct.toFixed(0) + '%');
          $rpeTrend.removeClass('positive').addClass('negative');
        } else {
          $rpeTrend.text('Flat');
          $rpeTrend.removeClass('positive negative');
        }
      } else {
        $rpeTrend.text('—');
        $rpeTrend.removeClass('positive negative');
      }

      if (arrGrowthVal > 0) {
        var hcGrowth = ((totalHc - q1h) / q1h) * 100;
        var ratio = hcGrowth > 0 ? arrGrowthVal / hcGrowth : 0;
        $hcVsArrGrowth.text(ratio.toFixed(2) + 'x');
      } else {
        $hcVsArrGrowth.text('—');
      }

      updateTrendChart([q1Rpe, q2Rpe, q3Rpe, q4Rpe], [q1a, q2a, q3a, q4a]);
      updateDeptChart(depts, arrVal);
    }
  }

  function updateTrendChart(rpes, arrs) {
    var canvas = document.getElementById('trendChart');
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    var width = rect.width;
    var height = rect.height;
    var padding = { top: 20, right: 60, bottom: 30, left: 50 };
    var chartWidth = width - padding.left - padding.right;
    var chartHeight = height - padding.top - padding.bottom;

    var allVals = rpes.concat(arrs).filter(function(v) { return v > 0; });
    var maxVal = Math.max.apply(null, allVals, 1);
    var minVal = 0;

    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    var refLines = [150000, 300000];
    refLines.forEach(function(ref) {
      if (ref <= maxVal) {
        var y = padding.top + chartHeight - ((ref - minVal) / (maxVal - minVal)) * chartHeight;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();
        ctx.fillStyle = '#888580';
        ctx.font = '10px "DM Mono"';
        ctx.textAlign = 'right';
        ctx.fillText(formatCurrency(ref), padding.left - 6, y + 4);
      }
    });

    ctx.fillStyle = '#888580';
    ctx.textAlign = 'center';
    var quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    var step = chartWidth / 3;
    quarters.forEach(function(q, i) {
      var x = padding.left + step * i;
      ctx.fillText(q, x, height - 8);
    });

    ctx.strokeStyle = '#60d4f0';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    arrs.forEach(function(v, i) {
      if (v > 0) {
        var x = padding.left + step * i;
        var y = padding.top + chartHeight - (v / maxVal) * chartHeight;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = '#c8f060';
    ctx.lineWidth = 3;
    ctx.beginPath();
    rpes.forEach(function(v, i) {
      if (v > 0) {
        var x = padding.left + step * i;
        var y = padding.top + chartHeight - (v / maxVal) * chartHeight;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    ctx.fillStyle = '#c8f060';
    rpes.forEach(function(v, i) {
      if (v > 0) {
        var x = padding.left + step * i;
        var y = padding.top + chartHeight - (v / maxVal) * chartHeight;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  function updateDeptChart(depts, totalArr) {
    var $container = $('#deptChartContainer');
    $container.empty();

    if (depts.length === 0) return;

    var deptRpes = depts.map(function(d) {
      return {
        name: d.name,
        rpe: d.headcount > 0 ? totalArr / d.headcount : 0,
        headcount: d.headcount
      };
    }).filter(function(d) { return d.headcount > 0; });

    if (deptRpes.length === 0) return;

    deptRpes.sort(function(a, b) { return b.rpe - a.rpe; });

    var maxRpe = Math.max.apply(null, deptRpes.map(function(d) { return d.rpe; }));
    var minRpe = Math.min.apply(null, deptRpes.map(function(d) { return d.rpe; }));

    var highestRpe = deptRpes[0].rpe;
    var lowestRpe = deptRpes[deptRpes.length - 1].rpe;

    deptRpes.forEach(function(d) {
      var widthPct = maxRpe > 0 ? (d.rpe / maxRpe) * 100 : 0;
      var color = '#c8f060';
      if (deptRpes.length > 1) {
        if (d.rpe === highestRpe) color = '#c8f060';
        else if (d.rpe === lowestRpe) color = '#f05050';
        else color = '#60d4f0';
      }

      var html = '<div class="dept-bar">' +
        '<div class="dept-bar-label">' + d.name + '</div>' +
        '<div class="dept-bar-track">' +
        '<div class="dept-bar-fill" style="width: ' + widthPct + '%; background: ' + color + ';"></div>' +
        '</div>' +
        '<div class="dept-bar-value">' + formatCurrency(d.rpe) + '</div>' +
        '</div>';
      $container.append(html);
    });

    $('#deptInsight').text('Your most revenue-efficient department is ' + deptRpes[0].name + '. Your least is ' + deptRpes[deptRpes.length - 1].name + '.');
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
      $('#deptChartSection').toggle(mode === 'advanced');
      calculate();
    });
  }

  function initInputs() {
    $arr.on('input', calculate);
    $employees.on('input', calculate);
    $includeContractors.on('change', function() {
      $('.contractor-input').toggle($(this).is(':checked'));
      calculate();
    });
    $contractors.on('input', calculate);
    $mrr.on('input', calculate);
    $arrGrowth.on('input', calculate);
    $newArr.on('input', calculate);
    $totalPayroll.on('input', calculate);
    $currency.on('change', calculate);

    $q1Arr.on('input', calculate);
    $q1Hc.on('input', calculate);
    $q2Arr.on('input', calculate);
    $q2Hc.on('input', calculate);
    $q3Arr.on('input', calculate);
    $q3Hc.on('input', calculate);
    $q4Arr.on('input', calculate);
    $q4Hc.on('input', calculate);

    $(document).on('input', '.dept-name, .dept-headcount, .dept-cost', calculate);

    $('#addDeptBtn').on('click', function() {
      if (deptCount >= 6) return;
      var html = '<div class="dept-row" data-dept="' + deptCount + '">' +
        '<input type="text" class="dept-name" value="" placeholder="Department">' +
        '<input type="number" class="dept-headcount" value="0" min="0" max="9999" step="1" placeholder="HC">' +
        '<input type="number" class="dept-cost" value="0" min="0" max="999999999" step="1" placeholder="Cost ($)">' +
        '<button class="dept-remove" title="Remove">×</button>' +
        '</div>';
      $('#deptSection').append(html);
      deptCount++;
      if (deptCount >= 6) $(this).hide();
    });

    $(document).on('click', '.dept-remove', function() {
      if ($('.dept-row').length <= 1) return;
      $(this).closest('.dept-row').remove();
      deptCount--;
      $('#addDeptBtn').show();
      calculate();
    });
  }

  function initShare() {
    $('#copyResults').on('click', function() {
      var text = 'Revenue Per Employee Results\n' +
        'ARR: ' + $arr.val() + '\n' +
        'Employees: ' + $employees.val() + '\n' +
        'RPE: ' + $rpeValue.text() + '\n' +
        $rpeMessage.text();
      navigator.clipboard.writeText(text).then(function() {
        alert('Results copied to clipboard!');
      });
    });

    $('#shareLink').on('click', function() {
      var params = new URLSearchParams({
        arr: $arr.val(),
        emp: $employees.val(),
        ic: $includeContractors.is(':checked') ? 1 : 0,
        con: $contractors.val(),
        mrr: $mrr.val(),
        agr: $arrGrowth.val(),
        narr: $newArr.val(),
        pay: $totalPayroll.val(),
        curr: $currency.val(),
        q1a: $q1Arr.val(),
        q1h: $q1Hc.val(),
        q2a: $q2Arr.val(),
        q2h: $q2Hc.val(),
        q3a: $q3Arr.val(),
        q3h: $q3Hc.val(),
        q4a: $q4Arr.val(),
        q4h: $q4Hc.val(),
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
    if (params.has('arr')) $arr.val(params.get('arr'));
    if (params.has('emp')) $employees.val(params.get('emp'));
    if (params.has('ic')) $includeContractors.prop('checked', params.get('ic') === '1');
    if (params.has('con')) $contractors.val(params.get('con'));
    if (params.has('mrr')) $mrr.val(params.get('mrr'));
    if (params.has('agr')) $arrGrowth.val(params.get('agr'));
    if (params.has('narr')) $newArr.val(params.get('narr'));
    if (params.has('pay')) $totalPayroll.val(params.get('pay'));
    if (params.has('curr')) $currency.val(params.get('curr'));
    if (params.has('q1a')) $q1Arr.val(params.get('q1a'));
    if (params.has('q1h')) $q1Hc.val(params.get('q1h'));
    if (params.has('q2a')) $q2Arr.val(params.get('q2a'));
    if (params.has('q2h')) $q2Hc.val(params.get('q2h'));
    if (params.has('q3a')) $q3Arr.val(params.get('q3a'));
    if (params.has('q3h')) $q3Hc.val(params.get('q3h'));
    if (params.has('q4a')) $q4Arr.val(params.get('q4a'));
    if (params.has('q4h')) $q4Hc.val(params.get('q4h'));
    if (params.has('mode')) {
      var mode = params.get('mode');
      $('.mode-btn').removeClass('active');
      $('.mode-btn[data-mode="' + mode + '"]').addClass('active');
      currentMode = mode;
      $('.advanced-inputs').toggle(mode === 'advanced');
      $('.advanced-results').toggle(mode === 'advanced');
      $('#trendSection').toggle(mode === 'advanced');
      $('#deptChartSection').toggle(mode === 'advanced');
    }

    if ($includeContractors.is(':checked')) {
      $('.contractor-input').show();
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
