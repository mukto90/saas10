(function($) {
  'use strict';

  var currencySymbols = {
    USD: '$', EUR: '€', GBP: '£', BDT: '৳', INR: '₹', CAD: 'C$', AUD: 'A$', SGD: 'S$'
  };

  var $target = $('#target');
  var $dealSize = $('#dealSize');
  var $winRate = $('#winRate');
  var $cycle = $('#cycle');
  var $reps = $('#reps');
  var $quota = $('#quota');
  var $leadToMql = $('#leadToMql');
  var $mqlToSql = $('#mqlToSql');
  var $sqlToOpp = $('#sqlToOpp');
  var $currency = $('#currency');

  var $dealsNeeded = $('#dealsNeeded');
  var $pipelineContainer = $('#pipelineContainer');
  var $pipelineBadge = $('#pipelineBadge');
  var $pipeline = $('#pipeline');
  var $leadsNeeded = $('#leadsNeeded');
  var $mqlsNeeded = $('#mqlsNeeded');
  var $sqlsNeeded = $('#sqlsNeeded');
  var $pipelinePerRep = $('#pipelinePerRep');
  var $coverage = $('#coverage');
  var $monthlyPipeline = $('#monthlyPipeline');
  var $monthlyLeads = $('#monthlyLeads');
  var $feedback = $('#feedback');

  var currentMode = 'simple';

  function getSymbol() {
    return currencySymbols[$currency.val()] || '$';
  }

  function formatCurrency(num) {
    if (!isFinite(num) || isNaN(num)) return getSymbol() + '0';
    return num.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace('$', getSymbol());
  }

  function formatNumber(num) {
    if (!isFinite(num) || isNaN(num)) return '0';
    return Math.round(num).toLocaleString('en-US');
  }

  function calculate() {
    var target = Math.max(0, parseFloat($target.val()) || 0);
    var dealSize = Math.max(0, parseFloat($dealSize.val()) || 0);
    var winRate = Math.max(0, Math.min(100, parseFloat($winRate.val()) || 0));
    var cycle = Math.max(0, parseFloat($cycle.val()) || 0);
    var reps = Math.max(1, parseInt($reps.val()) || 1);
    var quota = Math.max(0, parseFloat($quota.val()) || 0);
    var leadToMql = Math.max(0, Math.min(100, parseFloat($leadToMql.val()) || 0));
    var mqlToSql = Math.max(0, Math.min(100, parseFloat($mqlToSql.val()) || 0));
    var sqlToOpp = Math.max(0, Math.min(100, parseFloat($sqlToOpp.val()) || 0));

    var dealsNeeded = dealSize > 0 ? target / dealSize : 0;
    var requiredPipeline = winRate > 0 ? target / (winRate / 100) : 0;

    var leadToMqlDec = leadToMql / 100;
    var mqlToSqlDec = mqlToSql / 100;
    var sqlToOppDec = sqlToOpp / 100;
    var winRateDec = winRate / 100;

    var leadToWin = leadToMqlDec * mqlToSqlDec * sqlToOppDec * winRateDec;

    var leadsNeeded = leadToWin > 0 ? requiredPipeline / (dealSize * leadToWin) : 0;
    var mqlsNeeded = leadsNeeded * leadToMqlDec;
    var sqlsNeeded = mqlsNeeded * mqlToSqlDec;
    var oppsNeeded = sqlsNeeded * sqlToOppDec;

    var pipelinePerRep = reps > 0 ? requiredPipeline / reps : requiredPipeline;
    var pipelineCoverage = 3;

    var monthlyPipeline = cycle > 0 ? requiredPipeline / cycle : requiredPipeline;
    var monthlyLeads = cycle > 0 ? leadsNeeded / cycle : leadsNeeded;

    var feedbackText = '';
    var badgeClass = '';
    var badgeText = '';

    if (pipelineCoverage >= 4) {
      badgeClass = 'excellent';
      badgeText = 'Strong';
      feedbackText = 'Your pipeline coverage is strong. You have a good buffer to hit your target.';
    } else if (pipelineCoverage >= 3) {
      badgeClass = 'healthy';
      badgeText = 'Healthy';
      feedbackText = 'Your pipeline coverage is healthy. Aim for 3-4x pipeline coverage.';
    } else if (pipelineCoverage >= 2) {
      badgeClass = 'fair';
      badgeText = 'Undercoverage';
      feedbackText = 'You have some pipeline gap. Consider increasing lead generation.';
    } else {
      badgeClass = 'poor';
      badgeText = 'Critical';
      feedbackText = 'Critical pipeline gap! Focus on lead generation immediately.';
    }

    $dealsNeeded.text(formatNumber(dealsNeeded));
    $pipeline.text(formatCurrency(requiredPipeline));
    $pipelineBadge.attr('class', 'health-badge ' + badgeClass).text(badgeText);

    $leadsNeeded.text(formatNumber(leadsNeeded));
    $mqlsNeeded.text(formatNumber(mqlsNeeded));
    $sqlsNeeded.text(formatNumber(sqlsNeeded));

    $pipelinePerRep.text(formatCurrency(pipelinePerRep));
    $coverage.text(pipelineCoverage.toFixed(1) + 'x');

    if (currentMode === 'advanced') {
      $monthlyPipeline.text(formatCurrency(monthlyPipeline));
      $monthlyLeads.text(formatNumber(monthlyLeads));

      $('#leadValue').text(formatNumber(leadsNeeded));
      $('#mqlValue').text(formatNumber(mqlsNeeded));
      $('#sqlValue').text(formatNumber(sqlsNeeded));
      $('#oppValue').text(formatNumber(oppsNeeded));
      $('#wonValue').text(formatNumber(dealsNeeded));

      $('#leadToMqlDisplay').text(leadToMql.toFixed(0) + '%');
      $('#mqlToSqlDisplay').text(mqlToSql.toFixed(0) + '%');
      $('#sqlToOppDisplay').text(sqlToOpp.toFixed(0) + '%');
      $('#winRateDisplay').text(winRate.toFixed(0) + '%');

      var mqlBarWidth = (mqlsNeeded / leadsNeeded * 100);
      var sqlBarWidth = (sqlsNeeded / leadsNeeded * 100);
      var oppBarWidth = (oppsNeeded / leadsNeeded * 100);
      var wonBarWidth = (dealsNeeded / leadsNeeded * 100);

      $('#mqlBar').css('width', mqlBarWidth + '%');
      $('#sqlBar').css('width', sqlBarWidth + '%');
      $('#oppBar').css('width', oppBarWidth + '%');
      $('#wonBar').css('width', wonBarWidth + '%');
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
    $('#target, #dealSize, #winRate, #cycle, #reps, #quota, #leadToMql, #mqlToSql, #sqlToOpp, #currency').on('input change', calculate);
  }

  function initShare() {
    $('#copyResults').on('click', function() {
      var text = 'Sales Pipeline Calculator Results\n' +
        'Revenue Target: ' + $target.val() + '\n' +
        'Deal Size: ' + $dealSize.val() + '\n' +
        'Win Rate: ' + $winRate.val() + '%\n' +
        'Required Pipeline: ' + $pipeline.text() + '\n' +
        'Leads Needed: ' + $leadsNeeded.text();
      navigator.clipboard.writeText(text).then(function() {
        alert('Results copied to clipboard!');
      });
    });

    $('#shareLink').on('click', function() {
      var params = new URLSearchParams({
        target: $target.val(),
        dealsize: $dealSize.val(),
        winrate: $winRate.val(),
        cycle: $cycle.val(),
        reps: $reps.val(),
        quota: $quota.val(),
        leadtomql: $leadToMql.val(),
        mqltosql: $mqlToSql.val(),
        sqltopp: $sqlToOpp.val(),
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
    if (params.has('target')) $target.val(params.get('target'));
    if (params.has('dealsize')) $dealSize.val(params.get('dealsize'));
    if (params.has('winrate')) $winRate.val(params.get('winrate'));
    if (params.has('cycle')) $cycle.val(params.get('cycle'));
    if (params.has('reps')) $reps.val(params.get('reps'));
    if (params.has('quota')) $quota.val(params.get('quota'));
    if (params.has('leadtomql')) $leadToMql.val(params.get('leadtomql'));
    if (params.has('mqltosql')) $mqlToSql.val(params.get('mqltosql'));
    if (params.has('sqltopp')) $sqlToOpp.val(params.get('sqltopp'));
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
