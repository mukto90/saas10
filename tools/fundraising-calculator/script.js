(function($) {
  'use strict';

  var currencySymbols = {
    USD: '$', EUR: '€', GBP: '£', BDT: '৳', INR: '₹', CAD: 'C$', AUD: 'A$', SGD: 'S$'
  };

  var $currentArr = $('#currentArr');
  var $targetRaise = $('#targetRaise');
  var $preMoney = $('#preMoney');
  var $founderOwnership = $('#founderOwnership');
  
  var $existingInvestor = $('#existingInvestor');
  var $currentPool = $('#currentPool');
  var $newPool = $('#newPool');
  var $currentMrr = $('#currentMrr');
  var $arrGrowth = $('#arrGrowth');
  var $grossMargin = $('#grossMargin');
  var $nrr = $('#nrr');
  var $safeAmount = $('#safeAmount');
  var $safeCap = $('#safeCap');
  var $safeDiscount = $('#safeDiscount');
  var $secondaryAmount = $('#secondaryAmount');
  var $currency = $('#currency');
  
  var $postMoney = $('#postMoney');
  var $newInvestorPct = $('#newInvestorPct');
  var $founderPost = $('#founderPost');
  var $dilutionText = $('#dilutionText');
  var $arrMultiple = $('#arrMultiple');
  var $arrBadge = $('#arrBadge');
  var $dilutionPct = $('#dilutionPct');
  var $arrMultiplePost = $('#arrMultiplePost');
  var $feedback = $('#feedback');
  
  var $totalDilution = $('#totalDilution');
  var $founderDiluted = $('#founderDiluted');
  var $safeConversion = $('#safeConversion');
  var $capitalEfficiency = $('#capitalEfficiency');
  var $impliedExit = $('#impliedExit');
  var $revBenchmark = $('#revBenchmark');
  
  var investorCount = 1;
  var currentMode = 'simple';

  function getSymbol() {
    return currencySymbols[$currency.val()] || '$';
  }

  function formatCurrency(num) {
    if (!isFinite(num) || isNaN(num)) return getSymbol() + '0';
    return num.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace('$', getSymbol());
  }

  function getInvestors() {
    var investors = [];
    $('.investor-row').each(function() {
      var $row = $(this);
      var name = $row.find('.investor-name').val();
      var commitment = Math.max(0, parseFloat($row.find('.investor-commit').val()) || 0);
      var prorata = $row.find('.investor-prorata').is(':checked');
      investors.push({ name: name, commitment: commitment, prorata: prorata });
    });
    return investors;
  }

  function calculate() {
    var arr = Math.max(0, parseFloat($currentArr.val()) || 0);
    var raise = Math.max(0, parseFloat($targetRaise.val()) || 0);
    var preMoney = Math.max(0, parseFloat($preMoney.val()) || 0);
    var founderPre = Math.max(0, Math.min(100, parseFloat($founderOwnership.val()) || 0));
    
    var existingInvestorPct = Math.max(0, Math.min(100, parseFloat($existingInvestor.val()) || 0));
    var currentPoolPct = Math.max(0, Math.min(50, parseFloat($currentPool.val()) || 0));
    var newPoolPct = Math.max(0, Math.min(30, parseFloat($newPool.val()) || 0));
    var secondaryAmount = Math.max(0, parseFloat($secondaryAmount.val()) || 0);
    
    var safeAmount = Math.max(0, parseFloat($safeAmount.val()) || 0);
    var safeCap = Math.max(0, parseFloat($safeCap.val()) || 0);
    var safeDiscount = Math.max(0, Math.min(50, parseFloat($safeDiscount.val()) || 0));
    
    var investors = getInvestors();
    var totalInvestorCommit = investors.reduce(function(sum, inv) { return sum + inv.commitment; }, 0);
    
    var investorsWarning = '';
    if (totalInvestorCommit > 0 && totalInvestorCommit !== raise) {
      var diff = raise - totalInvestorCommit;
      investorsWarning = 'Investor commitments total ' + formatCurrency(totalInvestorCommit) + '. Gap of ' + formatCurrency(Math.abs(diff)) + (diff > 0 ? ' remaining.' : ' over.');
    }
    $('#investorWarning').text(investorsWarning).toggle(investorsWarning !== '');

    var postMoneyVal = preMoney + raise;
    var newInvestorPctVal = postMoneyVal > 0 ? (raise / postMoneyVal) * 100 : 0;
    var founderPostPct = founderPre * (1 - newInvestorPctVal / 100);
    
    $postMoney.text(formatCurrency(postMoneyVal));
    $newInvestorPct.text(newInvestorPctVal.toFixed(1) + '%');
    $founderPost.text(founderPostPct.toFixed(1) + '%');
    
    var arrMultiple = arr > 0 ? preMoney / arr : null;
    var arrMultiplePost = arr > 0 ? postMoneyVal / arr : null;
    
    if (arrMultiple !== null) {
      $arrMultiple.text(arrMultiple.toFixed(1) + 'x');
      var badgeClass, badgeText;
      if (arrMultiple > 30) { badgeClass = 'top'; badgeText = 'Top decile'; }
      else if (arrMultiple >= 15) { badgeClass = 'strong'; badgeText = 'Strong'; }
      else if (arrMultiple >= 8) { badgeClass = 'market'; badgeText = 'Market rate'; }
      else if (arrMultiple >= 4) { badgeClass = 'below'; badgeText = 'Below market'; }
      else { badgeClass = 'distressed'; badgeText = 'Distressed'; }
      $arrBadge.attr('class', 'benchmark-badge ' + badgeClass).text(badgeText);
    } else {
      $arrMultiple.text('N/A');
      $arrBadge.text('');
    }
    
    $arrMultiplePost.text(arrMultiplePost !== null ? arrMultiplePost.toFixed(1) + 'x' : 'N/A');
    $dilutionPct.text(newInvestorPctVal.toFixed(1) + '%');
    
    var dilutionText = '';
    if (founderPostPct > 70) dilutionText = 'Strong founder control retained.';
    else if (founderPostPct >= 50) dilutionText = 'Healthy ownership. You retain clear majority.';
    else if (founderPostPct >= 40) dilutionText = 'Watch cumulative dilution in future rounds.';
    else if (founderPostPct >= 25) dilutionText = 'Moderate dilution. Plan for future rounds carefully.';
    else dilutionText = 'Significant dilution. Future rounds may reduce motivation alignment.';
    $dilutionText.text(dilutionText);
    
    var capTable = calculateCapTable(preMoney, raise, founderPre, existingInvestorPct, currentPoolPct, newPoolPct, safeAmount, safeCap, safeDiscount);
    updateCapTable(capTable);
    
    var feedback = '';
    if (arrMultiple !== null) {
      if (arrMultiple > 30) feedback = 'At a ' + formatCurrency(postMoneyVal) + ' post-money, you\'re raising at a ' + arrMultiple.toFixed(1) + 'x ARR multiple — top decile valuation.';
      else if (arrMultiple >= 15) feedback = 'At a ' + formatCurrency(postMoneyVal) + ' post-money, you\'re raising at a ' + arrMultiple.toFixed(1) + 'x ARR multiple — strong for your stage.';
      else if (arrMultiple >= 8) feedback = 'At a ' + formatCurrency(postMoneyVal) + ' post-money, you\'re raising at a ' + arrMultiple.toFixed(1) + 'x ARR multiple — market rate.';
      else if (arrMultiple >= 4) feedback = 'At a ' + formatCurrency(postMoneyVal) + ' post-money, you\'re raising below market multiples.';
      else feedback = 'Your ARR multiple is low. Focus on growth before raising.';
    } else {
      feedback = 'Enter your ARR to see valuation benchmarks.';
    }
    $feedback.text(feedback);

    if (currentMode === 'advanced') {
      updateAdvancedMetrics(arr, preMoney, raise, postMoneyVal, founderPre, newPoolPct, newInvestorPctVal, safeAmount, safeCap, safeDiscount, capTable);
      updateRoundTable(preMoney, raise, founderPostPct, newInvestorPctVal);
    }
  }

  function calculateCapTable(preMoney, raise, founderPre, existingInvestorPct, currentPoolPct, newPoolPct, safeAmount, safeCap, safeDiscount) {
    var founder = founderPre;
    var existing = existingInvestorPct;
    var pool = currentPoolPct;
    var safePct = 0;
    var newInvestor = 0;
    
    var effectivePreMoney = preMoney;
    if (newPoolPct > 0) {
      var poolValue = preMoney * (newPoolPct / 100);
      effectivePreMoney = preMoney - poolValue;
      pool += newPoolPct;
    }
    
    var postMoney = preMoney + raise;
    newInvestor = (raise / postMoney) * 100;
    
    if (safeAmount > 0 && safeCap > 0) {
      var discountPrice = preMoney * (1 - safeDiscount / 100);
      var conversionPrice = Math.min(safeCap, discountPrice);
      var safePctVal = (safeAmount / conversionPrice) * 100;
      safePct = safePctVal;
    }
    
    var founderPost = founder * (1 - newInvestor / 100);
    if (newPoolPct > 0) {
      founderPost = founderPost * (1 - newPoolPct / 100);
    }
    
    var remaining = 100 - founderPost - existing - pool - newInvestor - safePct;
    
    return {
      founder: founderPost,
      existing: existing,
      pool: pool,
      newInvestor: newInvestor,
      safe: safePct,
      remaining: remaining
    };
  }

  function updateCapTable(cap) {
    var segments = [
      { el: $('#founderSegment'), pct: cap.founder, label: 'Founder' },
      { el: $('#investorSegment'), pct: cap.newInvestor, label: 'New Investor' },
      { el: $('#existingSegment'), pct: cap.existing, label: 'Existing' },
      { el: $('#poolSegment'), pct: cap.pool, label: 'Pool' }
    ];
    
    if (cap.safe > 0.5) {
      $('#safeLegend').show();
      if ($('#safeSegment').length === 0) {
        $('#poolSegment').after('<div class="cap-segment" id="safeSegment"><span class="seg-label"></span></div>');
      }
      segments.push({ el: $('#safeSegment'), pct: cap.safe, label: 'SAFE' });
    } else {
      $('#safeLegend').hide();
      $('#safeSegment').remove();
    }
    
    segments.forEach(function(seg) {
      seg.el.css('width', Math.max(seg.pct, 0) + '%');
      if (seg.pct > 8) {
        seg.el.find('.seg-label').text(seg.label + ' ' + seg.pct.toFixed(1) + '%');
      } else {
        seg.el.find('.seg-label').text('');
      }
    });
  }

  function updateAdvancedMetrics(arr, preMoney, raise, postMoney, founderPre, newPoolPct, newInvestorPct, safeAmount, safeCap, safeDiscount, cap) {
    var totalDilution = newInvestorPct;
    if (newPoolPct > 0) {
      totalDilution = 1 - ((1 - newInvestorPct / 100) * (1 - newPoolPct / 100)) * 100;
    }
    $totalDilution.text(totalDilution.toFixed(1) + '%');
    
    var founderDiluted = cap.founder;
    $founderDiluted.text(founderDiluted.toFixed(1) + '%');
    
    if (safeAmount > 0 && safeCap > 0) {
      var discountPrice = preMoney * (1 - safeDiscount / 100);
      var conversionPrice = Math.min(safeCap, discountPrice);
      var safePctVal = (safeAmount / conversionPrice) * 100;
      $safeConversion.text(safePctVal.toFixed(1) + '%');
    } else {
      $safeConversion.text('—');
    }
    
    var totalRaised = raise;
    var capitalEff = totalRaised > 0 && arr > 0 ? arr / totalRaised : null;
    $capitalEfficiency.text(capitalEff !== null ? capitalEff.toFixed(1) + 'x' : '—');
    
    var impliedExit = postMoney * 10;
    $impliedExit.text(formatCurrency(impliedExit));
    
    var arrMultiple = arr > 0 ? preMoney / arr : null;
    var benchmark = '';
    if (arrMultiple !== null) {
      if (arrMultiple > 30) benchmark = 'Top decile';
      else if (arrMultiple >= 15) benchmark = 'Strong';
      else if (arrMultiple >= 8) benchmark = 'Market rate';
      else if (arrMultiple >= 4) benchmark = 'Below market';
      else benchmark = 'Distressed';
    }
    $revBenchmark.text(benchmark);
  }

  function updateRoundTable(preMoney, raise, founderPostPct, newInvestorPct) {
    var thisRaise = raise;
    var thisPre = preMoney;
    var thisDilution = newInvestorPct;
    var thisFounder = founderPostPct;
    
    $('#rtThisRaise').text(formatCurrency(thisRaise));
    $('#rtThisPre').text(formatCurrency(thisPre));
    $('#rtThisDilution').text(thisDilution.toFixed(1) + '%');
    $('#rtThisFounder').text(thisFounder.toFixed(1) + '%');
    
    var rtA_Raise = Math.max(0, parseFloat($('#rtA_Raise').val()) || 0);
    var rtA_Pre = Math.max(0, parseFloat($('#rtA_Pre').val()) || 0);
    var rtA_Dilution = rtA_Pre > 0 ? (rtA_Raise / (rtA_Pre + rtA_Raise)) * 100 : 0;
    var rtA_Founder = thisFounder * (1 - rtA_Dilution / 100);
    
    $('#rtA_Dilution').text(rtA_Dilution.toFixed(1) + '%');
    $('#rtA_Founder').text(rtA_Founder.toFixed(1) + '%');
    
    var rtB_Raise = Math.max(0, parseFloat($('#rtB_Raise').val()) || 0);
    var rtB_Pre = Math.max(0, parseFloat($('#rtB_Pre').val()) || 0);
    var rtB_Dilution = rtB_Pre > 0 ? (rtB_Raise / (rtB_Pre + rtB_Raise)) * 100 : 0;
    var rtB_Founder = rtA_Founder * (1 - rtB_Dilution / 100);
    
    $('#rtB_Dilution').text(rtB_Dilution.toFixed(1) + '%');
    $('#rtB_Founder').text(rtB_Founder.toFixed(1) + '%');
  }

  function initMode() {
    $('.mode-btn').on('click', function() {
      var mode = $(this).data('mode');
      currentMode = mode;
      $('.mode-btn').removeClass('active');
      $(this).addClass('active');
      $('.advanced-inputs').toggle(mode === 'advanced');
      $('.advanced-results').toggle(mode === 'advanced');
      $('#roundTableSection').toggle(mode === 'advanced');
      calculate();
    });
  }

  function initInputs() {
    $('#currentArr, #targetRaise, #preMoney, #founderOwnership, #existingInvestor, #currentPool, #newPool, #currentMrr, #arrGrowth, #grossMargin, #nrr, #safeAmount, #safeCap, #safeDiscount, #secondaryAmount, #currency').on('input change', calculate);
    
    $('#addInvestorBtn').on('click', function() {
      if (investorCount >= 4) return;
      investorCount++;
      var html = '<div class="investor-row" data-investor="' + (investorCount - 1) + '">' +
        '<input type="text" class="investor-name" value="Investor ' + investorCount + '" placeholder="Investor">' +
        '<input type="number" class="investor-commit" value="0" min="0" max="999999999" step="1" placeholder="Commitment">' +
        '<label class="pro-rata-toggle">' +
        '<input type="checkbox" class="investor-prorata">' +
        '<span>Pro-rata</span>' +
        '</label>' +
        '</div>';
      $('#investorContainer').append(html);
      if (investorCount >= 4) $(this).prop('disabled', true);
      calculate();
    });
    
    $('#investorContainer').on('input change', '.investor-name, .investor-commit, .investor-prorata', calculate);
    
    $('#rtA_Raise, #rtA_Pre, #rtB_Raise, #rtB_Pre').on('input change', calculate);
  }

  function initShare() {
    $('#copyResults').on('click', function() {
      var text = 'Fundraising Calculator Results\n' +
        'Current ARR: ' + formatCurrency(parseFloat($currentArr.val())) + '\n' +
        'Target Raise: ' + formatCurrency(parseFloat($targetRaise.val())) + '\n' +
        'Pre-Money: ' + formatCurrency(parseFloat($preMoney.val())) + '\n' +
        'Post-Money: ' + $postMoney.text() + '\n' +
        'New Investor: ' + $newInvestorPct.text() + '\n' +
        'Founder Post: ' + $founderPost.text() + '\n' +
        'Dilution: ' + $dilutionPct.text() + '\n' +
        'ARR Multiple: ' + $arrMultiple.text();
      navigator.clipboard.writeText(text).then(function() {
        alert('Results copied to clipboard!');
      });
    });

    $('#shareLink').on('click', function() {
      var params = new URLSearchParams({
        arr: $currentArr.val(),
        raise: $targetRaise.val(),
        pre: $preMoney.val(),
        founder: $founderOwnership.val(),
        existing: $existingInvestor.val(),
        pool: $currentPool.val(),
        newPool: $newPool.val(),
        mrr: $currentMrr.val(),
        growth: $arrGrowth.val(),
        margin: $grossMargin.val(),
        nrr: $nrr.val(),
        safe: $safeAmount.val(),
        safeCap: $safeCap.val(),
        safeDisc: $safeDiscount.val(),
        secondary: $secondaryAmount.val(),
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
    if (params.has('raise')) $targetRaise.val(params.get('raise'));
    if (params.has('pre')) $preMoney.val(params.get('pre'));
    if (params.has('founder')) $founderOwnership.val(params.get('founder'));
    if (params.has('existing')) $existingInvestor.val(params.get('existing'));
    if (params.has('pool')) $currentPool.val(params.get('pool'));
    if (params.has('newPool')) $newPool.val(params.get('newPool'));
    if (params.has('mrr')) $currentMrr.val(params.get('mrr'));
    if (params.has('growth')) $arrGrowth.val(params.get('growth'));
    if (params.has('margin')) $grossMargin.val(params.get('margin'));
    if (params.has('nrr')) $nrr.val(params.get('nrr'));
    if (params.has('safe')) $safeAmount.val(params.get('safe'));
    if (params.has('safeCap')) $safeCap.val(params.get('safeCap'));
    if (params.has('safeDisc')) $safeDiscount.val(params.get('safeDisc'));
    if (params.has('secondary')) $secondaryAmount.val(params.get('secondary'));
    if (params.has('curr')) $currency.val(params.get('curr'));
    if (params.has('mode')) {
      var mode = params.get('mode');
      $('.mode-btn').removeClass('active');
      $('.mode-btn[data-mode="' + mode + '"]').addClass('active');
      currentMode = mode;
      $('.advanced-inputs').toggle(mode === 'advanced');
      $('.advanced-results').toggle(mode === 'advanced');
      $('#roundTableSection').toggle(mode === 'advanced');
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
