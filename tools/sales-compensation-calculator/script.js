(function($) {
  'use strict';

  var currencySymbols = {
    USD: '$', EUR: '€', GBP: '£', BDT: '৳', INR: '₹', CAD: 'C$', AUD: 'A$', SGD: 'S$'
  };

  var $ote = $('#ote');
  var $quota = $('#quota');
  var $baseSplit = $('#baseSplit');
  var $model = $('#model');
  var $commType = $('#commType');
  var $reps = $('#reps');
  var $margin = $('#margin');
  var $currency = $('#currency');

  var $baseSalary = $('#baseSalary');
  var $targetCommission = $('#targetCommission');
  var $commissionRate = $('#commissionRate');
  var $monthlyQuota = $('#monthlyQuota');
  var $monthlyCommission = $('#monthlyCommission');
  var $cosContainer = $('#cosContainer');
  var $cosBadge = $('#cosBadge');
  var $cos = $('#cos');
  var $comp120 = $('#comp120');
  var $comp150 = $('#comp150');
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
    return num.toFixed(1) + '%';
  }

  function calculate() {
    var ote = Math.max(0, parseFloat($ote.val()) || 0);
    var quota = Math.max(0, parseFloat($quota.val()) || 0);
    var baseSplit = Math.max(0, Math.min(100, parseFloat($baseSplit.val()) || 0));
    var reps = Math.max(1, parseInt($reps.val()) || 1);
    var margin = Math.max(0, Math.min(100, parseFloat($margin.val()) || 0));

    var baseSalary = ote * (baseSplit / 100);
    var targetCommission = ote - baseSalary;
    var commissionRate = quota > 0 ? (targetCommission / quota * 100) : 0;
    var monthlyQuota = quota / 12;
    var monthlyCommission = targetCommission / 12;
    var cos = quota > 0 ? ((baseSalary + targetCommission) / quota * 100) : 0;

    var compAt100 = ote;
    var compAt120 = ote + (monthlyQuota * 0.2 * (commissionRate / 100) * 12);
    var compAt150 = ote + (monthlyQuota * 0.5 * (commissionRate / 100) * 12);

    var cosBadgeClass = '';
    var cosBadgeText = '';
    var feedbackText = '';

    if (cos < 40) {
      cosBadgeClass = 'excellent';
      cosBadgeText = 'Efficient';
      feedbackText = 'Your compensation is very efficient. ' + formatPercent(cos) + ' cost of sales is excellent.';
    } else if (cos < 60) {
      cosBadgeClass = 'healthy';
      cosBadgeText = 'Healthy';
      feedbackText = 'Your compensation structure is healthy. ' + formatPercent(cos) + ' cost of sales is within the standard range.';
    } else if (cos < 80) {
      cosBadgeClass = 'fair';
      cosBadgeText = 'High';
      feedbackText = 'Your cost of sales is high at ' + formatPercent(cos) + '. Consider adjusting quota or commission structure.';
    } else {
      cosBadgeClass = 'poor';
      cosBadgeText = 'Unsustainable';
      feedbackText = 'Your compensation is unsustainable at ' + formatPercent(cos) + '. This will hurt profitability.';
    }

    $baseSalary.text(formatCurrency(baseSalary));
    $targetCommission.text(formatCurrency(targetCommission));
    $commissionRate.text(formatPercent(commissionRate));
    $monthlyQuota.text(formatCurrency(monthlyQuota));
    $monthlyCommission.text(formatCurrency(monthlyCommission));
    $cos.text(formatPercent(cos));
    $cosBadge.attr('class', 'health-badge ' + cosBadgeClass).text(cosBadgeText);

    if (currentMode === 'advanced') {
      $comp120.text(formatCurrency(compAt120));
      $comp150.text(formatCurrency(compAt150));

      $('#scenario80').text(formatCurrency(ote * 0.8 + (quota * 0.8 * commissionRate / 100)));
      $('#scenario100').text(formatCurrency(compAt100));
      $('#scenario120').text(formatCurrency(compAt120));
    }

    $feedback.text(feedbackText);
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
    $('#ote, #quota, #baseSplit, #model, #commType, #reps, #margin, #currency').on('input change', calculate);
  }

  function initShare() {
    $('#copyResults').on('click', function() {
      var text = 'Sales Compensation Calculator Results\n' +
        'OTE: ' + $ote.val() + '\n' +
        'Quota: ' + $quota.val() + '\n' +
        'Base Split: ' + $baseSplit.val() + '%\n' +
        'Base Salary: ' + $baseSalary.text() + '\n' +
        'Target Commission: ' + $targetCommission.text() + '\n' +
        'Commission Rate: ' + $commissionRate.text() + '\n' +
        'Cost of Sales: ' + $cos.text();
      navigator.clipboard.writeText(text).then(function() {
        alert('Results copied to clipboard!');
      });
    });

    $('#shareLink').on('click', function() {
      var params = new URLSearchParams({
        ote: $ote.val(),
        quota: $quota.val(),
        baseSplit: $baseSplit.val(),
        model: $model.val(),
        commType: $commType.val(),
        reps: $reps.val(),
        margin: $margin.val(),
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
    if (params.has('ote')) $ote.val(params.get('ote'));
    if (params.has('quota')) $quota.val(params.get('quota'));
    if (params.has('baseSplit')) $baseSplit.val(params.get('baseSplit'));
    if (params.has('model')) $model.val(params.get('model'));
    if (params.has('commType')) $commType.val(params.get('commType'));
    if (params.has('reps')) $reps.val(params.get('reps'));
    if (params.has('margin')) $margin.val(params.get('margin'));
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
