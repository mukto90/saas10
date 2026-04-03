(function($) {
  'use strict';

  var currencySymbols = {
    USD: '$', EUR: '€', GBP: '£', BDT: '৳', INR: '₹', CAD: 'C$', AUD: 'A$', SGD: 'S$'
  };

  var $startingMrr = $('#startingMrr');
  var $expansionMrr = $('#expansionMrr');
  var $contractionMrr = $('#contractionMrr');
  var $churnedMrr = $('#churnedMrr');
  var $period = $('#period');
  var $currency = $('#currency');
  var $growth = $('#growth');

  var $nrrContainer = $('#nrrContainer');
  var $nrrBadge = $('#nrrBadge');
  var $nrr = $('#nrr');
  var $nrrNote = $('#nrrNote');
  var $grrContainer = $('#grrContainer');
  var $grrBadge = $('#grrBadge');
  var $grr = $('#grr');
  var $netNewMrr = $('#netNewMrr');
  var $dollarRetention = $('#dollarRetention');
  var $expansionRate = $('#expansionRate');
  var $contractionRate = $('#contractionRate');
  var $churnRate = $('#churnRate');
  var $endingMrr = $('#endingMrr');
  var $nrrProjection = $('#nrrProjection');
  var $feedback = $('#feedback');

  var currentMode = 'simple';

  function getSymbol() {
    return currencySymbols[$currency.val()] || '$';
  }

  function formatCurrency(num) {
    if (!isFinite(num) || isNaN(num)) return getSymbol() + '0';
    return num.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace('$', getSymbol());
  }

  function formatPercent(num) {
    if (!isFinite(num) || isNaN(num)) return '0%';
    return num.toFixed(0) + '%';
  }

  function calculate() {
    var startingMrr = Math.max(0, parseFloat($startingMrr.val()) || 0);
    var expansionMrr = Math.max(0, parseFloat($expansionMrr.val()) || 0);
    var contractionMrr = Math.max(0, parseFloat($contractionMrr.val()) || 0);
    var churnedMrr = Math.max(0, parseFloat($churnedMrr.val()) || 0);
    var growth = parseFloat($growth.val()) || 0;

    var endingMrr = startingMrr + expansionMrr - contractionMrr - churnedMrr;
    var netNewMrr = endingMrr - startingMrr;
    var dollarRetention = expansionMrr - contractionMrr - churnedMrr;

    var nrr = startingMrr > 0 ? ((endingMrr / startingMrr) * 100) : 100;
    var grr = startingMrr > 0 ? (((startingMrr + expansionMrr - contractionMrr) / startingMrr) * 100) : 100;

    var expansionRate = startingMrr > 0 ? (expansionMrr / startingMrr * 100) : 0;
    var contractionRate = startingMrr > 0 ? (contractionMrr / startingMrr * 100) : 0;
    var churnRateCalc = startingMrr > 0 ? (churnedMrr / startingMrr * 100) : 0;

    var nrrProjection = nrr + (growth * 3);
    if (nrrProjection > 200) nrrProjection = 200;

    var scenarioExpansionNrr = startingMrr > 0 ? (((endingMrr + (startingMrr * 0.05)) / startingMrr) * 100) : 100;
    var scenarioChurnNrr = startingMrr > 0 ? (((startingMrr + expansionMrr - contractionMrr - (churnedMrr * 0.95)) / startingMrr) * 100) : 100;
    var scenarioContractionNrr = startingMrr > 0 ? (((startingMrr + expansionMrr - churnedMrr) / startingMrr) * 100) : 100;

    var nrrBadgeClass = '';
    var nrrBadgeText = '';
    var nrrNoteText = '';
    var feedbackText = '';

    if (nrr >= 120) {
      nrrBadgeClass = 'excellent';
      nrrBadgeText = 'Excellent';
      nrrNoteText = 'World-class retention — customers are expanding significantly';
      feedbackText = 'Your NRR is excellent. At ' + formatPercent(nrr) + ', you have world-class retention and expansion.';
    } else if (nrr >= 110) {
      nrrBadgeClass = 'healthy';
      nrrBadgeText = 'Healthy';
      nrrNoteText = 'Great retention — customers are growing';
      feedbackText = 'Your NRR is healthy. You\'re retaining and expanding customers well.';
    } else if (nrr >= 100) {
      nrrBadgeClass = 'fair';
      nrrBadgeText = 'Fair';
      nrrNoteText = 'At break-even — no net contraction';
      feedbackText = 'Your NRR is at break-even. Focus on driving more expansion to grow.';
    } else {
      nrrBadgeClass = 'poor';
      nrrBadgeText = 'Poor';
      nrrNoteText = 'Revenue declining — focus on retention';
      feedbackText = 'Your NRR is below 100%. Urgent action needed on retention and expansion.';
    }

    $nrr.attr('class', 'value ' + (nrr >= 100 ? 'positive' : 'negative'));
    $nrr.text(formatPercent(nrr));
    $nrrBadge.attr('class', 'health-badge ' + nrrBadgeClass).text(nrrBadgeText);
    $nrrNote.text(nrrNoteText);

    var grrBadgeClass = grr >= 110 ? 'excellent' : grr >= 95 ? 'healthy' : grr >= 90 ? 'fair' : 'poor';
    var grrBadgeText = grr >= 110 ? 'Excellent' : grr >= 95 ? 'Healthy' : grr >= 90 ? 'Fair' : 'Poor';
    $grr.text(formatPercent(grr));
    $grrBadge.attr('class', 'health-badge ' + grrBadgeClass).text(grrBadgeText);

    $netNewMrr.text((netNewMrr >= 0 ? '+' : '') + formatCurrency(netNewMrr));
    $netNewMrr.attr('class', 'value ' + (netNewMrr >= 0 ? 'positive' : 'negative'));
    $dollarRetention.text((dollarRetention >= 0 ? '+' : '') + formatCurrency(dollarRetention));
    $dollarRetention.attr('class', 'value ' + (dollarRetention >= 0 ? 'positive' : 'negative'));

    $expansionRate.text(formatPercent(expansionRate));
    $contractionRate.text(formatPercent(contractionRate));
    $churnRate.text(formatPercent(churnRateCalc));

    $endingMrr.text(formatCurrency(endingMrr));
    $nrrProjection.text(formatPercent(nrrProjection));

    if (currentMode === 'advanced') {
      $('#scenarioExpansionNrr').text(formatPercent(scenarioExpansionNrr));
      $('#scenarioChurnNrr').text(formatPercent(scenarioChurnNrr));
      $('#scenarioContractionNrr').text(formatPercent(scenarioContractionNrr));

      updateChart(startingMrr, expansionMrr, contractionMrr, churnedMrr, endingMrr);
    }

    $feedback.text(feedbackText);
  }

  function updateChart(startingMrr, expansionMrr, contractionMrr, churnedMrr, endingMrr) {
    var canvas = document.getElementById('nrrChart');
    if (!canvas) return;
    
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    var width = rect.width;
    var height = rect.height;
    var padding = { top: 20, right: 20, bottom: 40, left: 60 };
    var chartWidth = width - padding.left - padding.right;
    var chartHeight = height - padding.top - padding.bottom;

    var data = [
      { label: 'Starting', value: startingMrr, color: '#888580' },
      { label: 'Expansion', value: expansionMrr, color: '#c8f060' },
      { label: 'Contraction', value: -contractionMrr, color: '#f0a040' },
      { label: 'Churn', value: -churnedMrr, color: '#f05050' },
      { label: 'Ending', value: endingMrr, color: '#60d4f0' }
    ];

    var maxValue = Math.max(startingMrr, endingMrr) * 1.2;
    if (maxValue === 0) maxValue = 100;

    ctx.clearRect(0, 0, width, height);

    var barWidth = chartWidth / data.length * 0.6;
    var gap = chartWidth / data.length * 0.4;

    ctx.fillStyle = '#888580';
    ctx.textAlign = 'center';
    data.forEach(function(d, i) {
      var x = padding.left + (chartWidth / data.length) * i + gap / 2;
      var barHeight = (Math.abs(d.value) / maxValue) * chartHeight;
      var y = d.value >= 0 ? padding.top + chartHeight - barHeight : padding.top + chartHeight;
      
      ctx.fillStyle = d.color;
      ctx.fillRect(x, y, barWidth, barHeight);

      ctx.fillStyle = '#888580';
      ctx.font = '11px "DM Mono"';
      ctx.fillText(d.label, x + barWidth / 2, height - 10);

      ctx.fillStyle = '#fff';
      ctx.font = '12px "DM Mono"';
      var valueText = (d.value >= 0 ? '' : '-') + formatCurrency(Math.abs(d.value));
      ctx.fillText(valueText, x + barWidth / 2, y - 8);
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
      calculate();
    });
  }

  function initInputs() {
    $('#startingMrr, #expansionMrr, #contractionMrr, #churnedMrr, #period, #currency, #growth').on('input change', calculate);
  }

  function initShare() {
    $('#copyResults').on('click', function() {
      var text = 'NRR Calculator Results\n' +
        'Starting MRR: ' + $startingMrr.val() + '\n' +
        'Expansion: ' + $expansionMrr.val() + '\n' +
        'Contraction: ' + $contractionMrr.val() + '\n' +
        'Churned: ' + $churnedMrr.val() + '\n' +
        'NRR: ' + $nrr.text() + '\n' +
        'GRR: ' + $grr.text();
      navigator.clipboard.writeText(text).then(function() {
        alert('Results copied to clipboard!');
      });
    });

    $('#shareLink').on('click', function() {
      var params = new URLSearchParams({
        start: $startingMrr.val(),
        expansion: $expansionMrr.val(),
        contraction: $contractionMrr.val(),
        churned: $churnedMrr.val(),
        period: $period.val(),
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
    if (params.has('start')) $startingMrr.val(params.get('start'));
    if (params.has('expansion')) $expansionMrr.val(params.get('expansion'));
    if (params.has('contraction')) $contractionMrr.val(params.get('contraction'));
    if (params.has('churned')) $churnedMrr.val(params.get('churned'));
    if (params.has('period')) $period.val(params.get('period'));
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
