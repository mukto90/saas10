(function($) {
  'use strict';

  var currencySymbols = {
    USD: '$', EUR: '€', GBP: '£', BDT: '৳', INR: '₹', CAD: 'C$', AUD: 'A$', SGD: 'S$'
  };

  var $expenses = $('#expenses');
  var $revenue = $('#revenue');
  var $cash = $('#cash');
  var $salaries = $('#salaries');
  var $infrastructure = $('#infrastructure');
  var $marketing = $('#marketing');
  var $tools = $('#tools');
  var $office = $('#office');
  var $other = $('#other');
  var $growth = $('#growth');
  var $currency = $('#currency');

  var $grossBurn = $('#grossBurn');
  var $netBurnContainer = $('#netBurnContainer');
  var $netBurnBadge = $('#netBurnBadge');
  var $netBurn = $('#netBurn');
  var $runwayContainer = $('#runwayContainer');
  var $runwayBadge = $('#runwayBadge');
  var $runway = $('#runway');
  var $runwayNote = $('#runwayNote');
  var $burnMultiple = $('#burnMultiple');
  var $hcPercent = $('#hcPercent');
  var $breakEven = $('#breakEven');
  var $feedback = $('#feedback');

  var currentMode = 'simple';

  function getSymbol() {
    return currencySymbols[$currency.val()] || '$';
  }

  function formatCurrency(num) {
    if (!isFinite(num) || isNaN(num)) return getSymbol() + '0';
    return num.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace('$', getSymbol());
  }

  function formatDate(months) {
    var d = new Date();
    d.setMonth(d.getMonth() + Math.floor(months));
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  function calculate() {
    var expenses = Math.max(0, parseFloat($expenses.val()) || 0);
    var revenue = Math.max(0, parseFloat($revenue.val()) || 0);
    var cash = Math.max(0, parseFloat($cash.val()) || 0);
    var growth = parseFloat($growth.val()) || 0;

    var salaries = Math.max(0, parseFloat($salaries.val()) || 0);
    var infrastructure = Math.max(0, parseFloat($infrastructure.val()) || 0);
    var marketing = Math.max(0, parseFloat($marketing.val()) || 0);
    var tools = Math.max(0, parseFloat($tools.val()) || 0);
    var office = Math.max(0, parseFloat($office.val()) || 0);
    var other = Math.max(0, parseFloat($other.val()) || 0);

    var itemizedTotal = salaries + infrastructure + marketing + tools + office + other;
    if (itemizedTotal > 0 && itemizedTotal !== expenses) {
      expenses = itemizedTotal;
    }

    var grossBurn = expenses;
    var netBurn = grossBurn - revenue;

    var runway = 0;
    var runwayText = '';
    var badgeClass = '';
    var badgeText = '';
    var noteText = '';
    var feedbackText = '';

    if (netBurn <= 0) {
      runway = 999;
      runwayText = 'Profitable';
      badgeClass = 'profitable';
      badgeText = 'Profitable';
      noteText = 'You are cash flow positive';
      feedbackText = 'You are profitable! Focus on growth and scaling.';
    } else if (cash > 0) {
      runway = cash / netBurn;
      if (runway > 60) runway = 60;
      runwayText = runway.toFixed(1) + ' months';
    } else {
      runwayText = '0 months';
      badgeClass = 'critical';
      badgeText = 'Critical';
      noteText = 'No cash remaining';
      feedbackText = 'Emergency! No runway remaining.';
    }

    if (netBurn > 0) {
      if (runway > 24) {
        badgeClass = 'safe';
        badgeText = 'Safe';
        noteText = 'Over 24 months runway';
      } else if (runway >= 18) {
        badgeClass = 'comfortable';
        badgeText = 'Comfortable';
        noteText = '18-24 months runway';
      } else if (runway >= 12) {
        badgeClass = 'plan';
        badgeText = 'Plan ahead';
        noteText = '12-18 months runway';
      } else if (runway >= 6) {
        badgeClass = 'fundraise';
        badgeText = 'Urgent';
        noteText = '6-12 months runway';
      } else {
        badgeClass = 'critical';
        badgeText = 'Critical';
        noteText = 'Under 6 months runway';
      }
    }

    if (runway < 999 && runway > 0) {
      noteText = 'Ends in ' + formatDate(runway);
    }

    if (runway > 18) {
      feedbackText = 'You have strong runway. No immediate fundraising needed.';
    } else if (runway >= 12) {
      feedbackText = 'Start planning your fundraise. You have under 12 months of runway.';
    } else if (runway >= 6) {
      feedbackText = 'Fundraising is urgent. Begin conversations now.';
    } else if (runway > 0) {
      feedbackText = 'Critical runway. Focus on burn reduction or close a round immediately.';
    }

    var burnMultiple = grossBurn > 0 ? cash / (grossBurn * 12) : 999;
    var hcPercent = grossBurn > 0 ? (salaries / grossBurn * 100) : 0;

    var breakEvenMonth = -1;
    if (revenue > 0 && growth > 0) {
      var currentCash = cash;
      var currentRevenue = revenue;
      var currentBurn = grossBurn - currentRevenue;
      for (var m = 1; m <= 60; m++) {
        currentCash -= currentBurn;
        if (currentCash <= 0) {
          breakEvenMonth = m;
          break;
        }
        currentRevenue *= (1 + growth / 100);
        currentBurn = grossBurn - currentRevenue;
      }
    }

    $grossBurn.text(formatCurrency(grossBurn));
    $netBurn.text(formatCurrency(Math.abs(netBurn)));
    $netBurn.toggleClass('negative', netBurn > 0);
    $netBurn.toggleClass('positive', netBurn < 0);

    if (netBurn <= 0) {
      $netBurnBadge.attr('class', 'health-badge profitable').text('Profitable');
    } else {
      $netBurnBadge.attr('class', 'health-badge ' + badgeClass).text('Burning');
    }

    $runway.text(runwayText);
    $runwayBadge.attr('class', 'health-badge ' + badgeClass).text(badgeText);
    $runwayNote.text(noteText);

    $burnMultiple.text(burnMultiple >= 10 ? '> 10 years' : burnMultiple.toFixed(1) + ' years');
    $hcPercent.text(hcPercent.toFixed(0) + '%');

    $breakEven.text(breakEvenMonth > 0 ? 'Month ' + breakEvenMonth : 'Not reached');

    if (currentMode === 'advanced') {
      var pessimisticRunway = cash / (netBurn * 1.3);
      var defaultRunway = runway;
      var optimisticRunway = cash / (netBurn * 0.7);
      if (pessimisticRunway > 60) pessimisticRunway = 60;
      if (optimisticRunway > 60) optimisticRunway = 60;

      $('#scenarioPessimistic').text(pessimisticRunway.toFixed(1) + ' months');
      $('#scenarioDefault').text(defaultRunway.toFixed(1) + ' months');
      $('#scenarioOptimistic').text(optimisticRunway.toFixed(1) + ' months');

      updateChart(cash, netBurn, runway, revenue, growth);
    }

    $feedback.text(feedbackText);
  }

  function updateChart(cash, netBurn, runway, revenue, growth) {
    var canvas = document.getElementById('burnChart');
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

    var displayMonths = Math.min(24, Math.ceil(runway) + 2);
    if (displayMonths < 6) displayMonths = 6;
    if (displayMonths > 24) displayMonths = 24;

    var monthlyData = [];
    var currentCash = cash;
    var currentRevenue = revenue;
    var growthRate = growth / 100;

    for (var m = 1; m <= displayMonths; m++) {
      var currentBurn = netBurn;
      if (currentCash > 0) {
        currentCash -= currentBurn;
      }
      currentRevenue *= (1 + growthRate);
      monthlyData.push({ month: m, cash: Math.max(0, currentCash) });
    }

    var maxCash = cash;
    if (maxCash === 0) maxCash = 100;

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
      ctx.fillText(formatCurrency(maxCash - (maxCash / 4) * i), padding.left - 8, y + 4);
    }

    ctx.fillStyle = '#888580';
    ctx.textAlign = 'center';
    for (var mi = 0; mi < displayMonths; mi += Math.ceil(displayMonths / 6)) {
      var x = padding.left + (chartWidth / (displayMonths - 1 || 1)) * mi;
      ctx.fillText('M' + (mi + 1), x, height - 8);
    }

    ctx.lineWidth = 2;
    ctx.beginPath();
    monthlyData.forEach(function(d, i) {
      var x = padding.left + (chartWidth / (displayMonths - 1 || 1)) * i;
      var y = padding.top + chartHeight - (d.cash / maxCash) * chartHeight;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#c8f060';
    ctx.stroke();

    if (runway <= displayMonths && runway > 0) {
      var runwayX = padding.left + (chartWidth / (displayMonths - 1 || 1)) * (runway - 1);
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#f05050';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(runwayX, padding.top);
      ctx.lineTo(runwayX, height - padding.bottom);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#f05050';
      ctx.font = '11px "DM Mono"';
      ctx.textAlign = 'center';
      ctx.fillText('Cash out', runwayX, padding.top - 6);
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
    $('#expenses, #revenue, #cash, #salaries, #infrastructure, #marketing, #tools, #office, #other, #growth, #currency').on('input change', calculate);
  }

  function initShare() {
    $('#copyResults').on('click', function() {
      var text = 'Burn Rate Calculator Results\n' +
        'Expenses: ' + $expenses.val() + '\n' +
        'Revenue: ' + $revenue.val() + '\n' +
        'Cash: ' + $cash.val() + '\n' +
        'Gross Burn: ' + $grossBurn.text() + '\n' +
        'Net Burn: ' + $netBurn.text() + '\n' +
        'Runway: ' + $runway.text();
      navigator.clipboard.writeText(text).then(function() {
        alert('Results copied to clipboard!');
      });
    });

    $('#shareLink').on('click', function() {
      var params = new URLSearchParams({
        expenses: $expenses.val(),
        revenue: $revenue.val(),
        cash: $cash.val(),
        salaries: $salaries.val(),
        infra: $infrastructure.val(),
        marketing: $marketing.val(),
        tools: $tools.val(),
        office: $office.val(),
        other: $other.val(),
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
    if (params.has('expenses')) $expenses.val(params.get('expenses'));
    if (params.has('revenue')) $revenue.val(params.get('revenue'));
    if (params.has('cash')) $cash.val(params.get('cash'));
    if (params.has('salaries')) $salaries.val(params.get('salaries'));
    if (params.has('infra')) $infrastructure.val(params.get('infra'));
    if (params.has('marketing')) $marketing.val(params.get('marketing'));
    if (params.has('tools')) $tools.val(params.get('tools'));
    if (params.has('office')) $office.val(params.get('office'));
    if (params.has('other')) $other.val(params.get('other'));
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
