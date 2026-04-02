(function($) {
  'use strict';

  var currencySymbols = {
    USD: '$', EUR: '€', GBP: '£', BDT: '৳', INR: '₹', CAD: 'C$', AUD: 'A$', SGD: 'S$'
  };

  var $fixedCosts = $('#fixedCosts');
  var $variableCost = $('#variableCost');
  var $pricePerCustomer = $('#pricePerCustomer');
  var $currentCustomers = $('#currentCustomers');
  
  var $salaries = $('#salaries');
  var $infrastructure = $('#infrastructure');
  var $marketing = $('#marketing');
  var $otherFixed = $('#otherFixed');
  
  var $paymentProcessing = $('#paymentProcessing');
  var $supportCost = $('#supportCost');
  var $infraCost = $('#infraCost');
  var $otherVariable = $('#otherVariable');
  
  var $targetProfit = $('#targetProfit');
  var $currency = $('#currency');
  
  var $contributionMargin = $('#contributionMargin');
  var $cmRatio = $('#cmRatio');
  var $cmInterpretation = $('#cmInterpretation');
  var $beContainer = $('#beContainer');
  var $breakEvenCustomers = $('#breakEvenCustomers');
  var $beBadge = $('#beBadge');
  var $breakEvenRevenue = $('#breakEvenRevenue');
  var $currentProfit = $('#currentProfit');
  var $safetyContainer = $('#safetyContainer');
  var $safetyMargin = $('#safetyMargin');
  var $feedback = $('#feedback');
  
  var $targetContainer = $('#targetContainer');
  var $targetRevenueContainer = $('#targetRevenueContainer');
  var $targetCustomers = $('#targetCustomers');
  var $targetRevenue = $('#targetRevenue');
  var $blendedCM = $('#blendedCM');
  var $blendedPrice = $('#blendedPrice');
  var $operatingLeverage = $('#operatingLeverage');
  var $grossMargin = $('#grossMargin');
  
  var currentMode = 'simple';
  var tierCount = 3;

  function getSymbol() {
    return currencySymbols[$currency.val()] || '$';
  }

  function formatCurrency(num) {
    if (!isFinite(num) || isNaN(num)) return getSymbol() + '0';
    return num.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).replace('$', getSymbol());
  }

  function getTiers() {
    var tiers = [];
    $('.tier-row').each(function() {
      var $row = $(this);
      var name = $row.find('.tier-name').val();
      var price = Math.max(0, parseFloat($row.find('.tier-price').val()) || 0);
      var varCost = Math.max(0, parseFloat($row.find('.tier-var').val()) || 0);
      var mix = Math.max(0, Math.min(100, parseFloat($row.find('.tier-mix').val()) || 0));
      tiers.push({ name: name, price: price, varCost: varCost, mix: mix });
    });
    return tiers;
  }

  function calculate() {
    var fixedCosts = Math.max(0, parseFloat($fixedCosts.val()) || 0);
    var variableCost = Math.max(0, parseFloat($variableCost.val()) || 0);
    var price = Math.max(0, parseFloat($pricePerCustomer.val()) || 0);
    var currentCust = Math.max(0, parseInt($currentCustomers.val()) || 0);
    
    var paymentPct = Math.max(0, Math.min(100, parseFloat($paymentProcessing.val()) || 0)) / 100;
    var supportCost = Math.max(0, parseFloat($supportCost.val()) || 0);
    var infraCost = Math.max(0, parseFloat($infraCost.val()) || 0);
    var otherVar = Math.max(0, parseFloat($otherVariable.val()) || 0);
    
    var targetProfit = Math.max(0, parseFloat($targetProfit.val()) || 0);
    var tiers = getTiers();
    
    var itemizedFixed = Math.max(0, parseFloat($salaries.val()) || 0) +
                        Math.max(0, parseFloat($infrastructure.val()) || 0) +
                        Math.max(0, parseFloat($marketing.val()) || 0) +
                        Math.max(0, parseFloat($otherFixed.val()) || 0);
    
    if (itemizedFixed > 0 && itemizedFixed !== fixedCosts && fixedCosts > 0) {
      $('#fixedReconNote').text('Your itemized fixed costs total ' + formatCurrency(itemizedFixed) + ', but you entered ' + formatCurrency(fixedCosts) + '. Using itemized total.').show();
      fixedCosts = itemizedFixed;
    } else {
      $('#fixedReconNote').hide();
    }
    
    var paymentFee = price * paymentPct;
    var totalVariableCost = variableCost + supportCost + infraCost + otherVar + paymentFee;
    
    var contributionMargin = price - totalVariableCost;
    var cmRatio = price > 0 ? (contributionMargin / price) * 100 : 0;
    
    $contributionMargin.text(formatCurrency(contributionMargin));
    $contributionMargin.toggleClass('negative', contributionMargin < 0);
    $contributionMargin.toggleClass('positive', contributionMargin > 0);
    
    $cmRatio.text(cmRatio.toFixed(1) + '%');
    $cmRatio.toggleClass('negative', cmRatio < 0);
    
    var cmText = '';
    if (cmRatio > 80) cmText = 'Excellent margins. Typical for pure-software SaaS.';
    else if (cmRatio >= 60) cmText = 'Healthy margins. Good unit economics.';
    else if (cmRatio >= 40) cmText = 'Moderate. Review variable costs for optimization.';
    else if (cmRatio >= 20) cmText = 'Thin margins. High variable cost relative to price.';
    else if (cmRatio > 0) cmText = 'Margins are too thin to scale profitably. Reprice or cut variable costs.';
    else if (cmRatio === 0) cmText = 'Zero margin — you make $0 per customer.';
    else cmText = 'Negative margin. You lose money on every customer acquired.';
    $cmInterpretation.text(cmText);
    
    var breakEvenUnits = 0;
    var breakEvenRevenueVal = 0;
    var breakEvenText = '';
    
    if (contributionMargin < 0) {
      breakEvenText = 'Impossible — you lose money on every customer.';
      $beContainer.addClass('negative');
    } else if (contributionMargin === 0) {
      breakEvenText = 'Infinite — you make $0 per customer.';
      $beContainer.removeClass('negative');
    } else if (fixedCosts === 0) {
      breakEvenUnits = 0;
      breakEvenRevenueVal = 0;
      breakEvenText = '0 — No fixed costs means any revenue is profit.';
      $beContainer.removeClass('negative');
    } else {
      breakEvenUnits = Math.ceil(fixedCosts / contributionMargin);
      breakEvenRevenueVal = breakEvenUnits * price;
      breakEvenText = breakEvenUnits.toLocaleString();
      $beContainer.removeClass('negative');
    }
    
    $breakEvenCustomers.text(breakEvenText);
    $breakEvenRevenue.text(formatCurrency(breakEvenRevenueVal));
    
    var badgeClass, badgeText;
    var currentProfit = (currentCust * contributionMargin) - fixedCosts;
    
    if (contributionMargin < 0) {
      badgeClass = 'unviable'; badgeText = 'Unviable pricing';
    } else if (currentCust >= breakEvenUnits && breakEvenUnits > 0) {
      badgeClass = 'profitable'; badgeText = 'Profitable';
    } else if (breakEvenUnits > 0 && currentCust >= breakEvenUnits * 0.9) {
      badgeClass = 'almost'; badgeText = 'Almost there';
    } else if (breakEvenUnits > 0 && currentCust >= breakEvenUnits * 0.5) {
      badgeClass = 'growing'; badgeText = 'Growing';
    } else if (breakEvenUnits === 0 && currentCust > 0) {
      badgeClass = 'profitable'; badgeText = 'Profitable';
    } else {
      badgeClass = 'stage'; badgeText = 'Pre-revenue stage';
    }
    
    $beBadge.attr('class', 'health-badge ' + badgeClass).text(badgeText);
    
    $currentProfit.text(formatCurrency(currentProfit));
    $currentProfit.toggleClass('negative', currentProfit < 0);
    $currentProfit.toggleClass('positive', currentProfit > 0);
    
    if (currentCust > 0 && breakEvenUnits > 0) {
      var safetyMargin = ((currentCust - breakEvenUnits) / currentCust) * 100;
      $safetyMargin.text(safetyMargin.toFixed(1) + '%');
      $safetyMargin.toggleClass('negative', safetyMargin < 0);
      $safetyContainer.removeClass('negative');
    } else if (currentCust > 0 && breakEvenUnits === 0) {
      $safetyMargin.text('N/A');
      $safetyContainer.removeClass('negative');
    } else {
      $safetyMargin.text('N/A');
      $safetyContainer.removeClass('negative');
    }
    
    var feedback = '';
    if (contributionMargin < 0) {
      feedback = 'Your pricing is unviable — you lose money on every customer. Reduce variable costs or increase pricing.';
    } else if (breakEvenUnits === 0 && fixedCosts === 0) {
      feedback = 'No fixed costs means you\'re already profitable with any customer.';
    } else if (currentProfit > 0) {
      feedback = 'You\'re past break-even! Current profit: ' + formatCurrency(currentProfit) + '/mo.';
    } else if (currentCust >= breakEvenUnits && breakEvenUnits > 0) {
      feedback = 'You\'re at break-even. You need ' + breakEvenUnits.toLocaleString() + ' customers to cover all costs.';
    } else {
      var needed = breakEvenUnits - currentCust;
      feedback = 'You need ' + needed.toLocaleString() + ' more customers to break even.';
    }
    $feedback.text(feedback);
    
    if (currentMode === 'advanced') {
      if (targetProfit > 0 && contributionMargin > 0) {
        var targetCust = Math.ceil((fixedCosts + targetProfit) / contributionMargin);
        var targetRev = targetCust * price;
        $targetCustomers.text(targetCust.toLocaleString());
        $targetRevenue.text(formatCurrency(targetRev));
        $targetContainer.show();
        $targetRevenueContainer.show();
      } else {
        $targetContainer.hide();
        $targetRevenueContainer.hide();
      }
      
      var tierMixTotal = 0;
      var blendedCMVal = 0;
      var blendedPriceVal = 0;
      var validTiers = true;
      
      tiers.forEach(function(tier) {
        tierMixTotal += tier.mix;
      });
      
      if (Math.abs(tierMixTotal - 100) > 0.1) {
        $('#tierMixWarning').text('Customer mix must total 100%. Currently at ' + tierMixTotal.toFixed(0) + '%.').show();
        validTiers = false;
      } else {
        $('#tierMixWarning').hide();
      }
      
      if (validTiers) {
        tiers.forEach(function(tier) {
          var tierCM = tier.price - tier.varCost;
          blendedCMVal += tierCM * (tier.mix / 100);
          blendedPriceVal += tier.price * (tier.mix / 100);
        });
      } else {
        blendedCMVal = contributionMargin;
        blendedPriceVal = price;
      }
      
      $blendedCM.text(formatCurrency(blendedCMVal));
      $blendedPrice.text(formatCurrency(blendedPriceVal));
      
      var totalVarCosts = totalVariableCost * currentCust;
      var totalCosts = fixedCosts + totalVarCosts;
      var operatingLeverage = totalCosts > 0 ? fixedCosts / totalCosts : 0;
      $operatingLeverage.text(operatingLeverage.toFixed(2));
      
      var grossMargin = price > 0 ? ((price - totalVariableCost) / price) * 100 : 0;
      $grossMargin.text(grossMargin.toFixed(1) + '%');
      
      updateChart(fixedCosts, totalVariableCost, price, breakEvenUnits);
      updateScenarios(fixedCosts, variableCost, price, currentCust, totalVariableCost);
    }
  }

  function updateChart(fixedCosts, variableCost, price, breakEvenUnits) {
    var canvas = document.getElementById('breakEvenChart');
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

    var maxCustomers = breakEvenUnits > 0 ? Math.max(breakEvenUnits * 2, 100) : 100;
    if (breakEvenUnits === 0) maxCustomers = 100;
    
    var maxRevenue = fixedCosts + (variableCost * maxCustomers);
    var maxY = Math.max(fixedCosts * 2, maxRevenue);
    if (maxY === 0) maxY = 100;

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
      ctx.fillText(formatCurrency(maxY - (maxY / 4) * i), padding.left - 8, y + 4);
    }

    ctx.fillStyle = '#888580';
    ctx.textAlign = 'center';
    var xLabels = Math.ceil(maxCustomers / 20);
    for (var i = 0; i <= maxCustomers; i += xLabels) {
      var x = padding.left + (chartWidth / maxCustomers) * i;
      ctx.fillText(i, x, height - 8);
    }
    ctx.fillText('Customers', width / 2, height - 2);

    ctx.fillStyle = '#888580';
    ctx.font = '10px "DM Mono"';
    ctx.textAlign = 'right';
    ctx.fillText('Revenue', padding.left - 4, padding.top - 6);

    var fixedCostsY = padding.top + chartHeight - (fixedCosts / maxY) * chartHeight;
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding.left, fixedCostsY);
    ctx.lineTo(width - padding.right, fixedCostsY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#888580';
    ctx.textAlign = 'left';
    ctx.fillText('Fixed: ' + formatCurrency(fixedCosts), padding.left + 4, fixedCostsY - 4);

    ctx.lineWidth = 2;
    ctx.beginPath();
    for (var i = 0; i <= maxCustomers; i++) {
      var revenue = price * i;
      var x = padding.left + (chartWidth / maxCustomers) * i;
      var y = padding.top + chartHeight - (revenue / maxY) * chartHeight;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = '#c8f060';
    ctx.stroke();

    ctx.lineWidth = 2;
    ctx.beginPath();
    for (var i = 0; i <= maxCustomers; i++) {
      var costs = fixedCosts + (variableCost * i);
      var x = padding.left + (chartWidth / maxCustomers) * i;
      var y = padding.top + chartHeight - (costs / maxY) * chartHeight;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = '#f05050';
    ctx.stroke();

    if (breakEvenUnits > 0 && breakEvenUnits <= maxCustomers) {
      var beX = padding.left + (chartWidth / maxCustomers) * breakEvenUnits;
      var beRevenue = price * breakEvenUnits;
      var beY = padding.top + chartHeight - (beRevenue / maxY) * chartHeight;
      
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
      ctx.fillText('Break-even: ' + breakEvenUnits + ' customers', beX, padding.top - 6);
      
      ctx.beginPath();
      ctx.arc(beX, beY, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#60d4f0';
      ctx.fill();
      ctx.strokeStyle = '#0a0a0a';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  function updateScenarios(fixedCosts, variableCost, price, currentCust, totalVariableCost) {
    var currentCM = price - totalVariableCost;
    var currentCMRatio = price > 0 ? (currentCM / price) * 100 : 0;
    var currentProfit = (currentCust * currentCM) - fixedCosts;
    var currentBE = currentCM > 0 ? Math.ceil(fixedCosts / currentCM) : '—';
    
    $('#scenarioCurrentBE').text(currentBE);
    $('#scenarioCurrentCM').text(currentCMRatio.toFixed(1) + '%');
    $('#scenarioCurrentProfit').text(formatCurrency(currentProfit));
    
    var price20 = price * 1.2;
    var cm20 = price20 - totalVariableCost;
    var cmRatio20 = price20 > 0 ? (cm20 / price20) * 100 : 0;
    var profit20 = (currentCust * cm20) - fixedCosts;
    var be20 = cm20 > 0 ? Math.ceil(fixedCosts / cm20) : '—';
    
    $('#scenarioPriceBE').text(be20);
    $('#scenarioPriceCM').text(cmRatio20.toFixed(1) + '%');
    $('#scenarioPriceProfit').text(formatCurrency(profit20));
    
    var var80 = variableCost * 0.8;
    var totalVar80 = var80 + 
      Math.max(0, parseFloat($supportCost.val()) || 0) +
      Math.max(0, parseFloat($infraCost.val()) || 0) +
      Math.max(0, parseFloat($otherVariable.val()) || 0) +
      (price * (parseFloat($paymentProcessing.val()) || 0) / 100);
    var cm80 = price - totalVar80;
    var cmRatio80 = price > 0 ? (cm80 / price) * 100 : 0;
    var profit80 = (currentCust * cm80) - fixedCosts;
    var be80 = cm80 > 0 ? Math.ceil(fixedCosts / cm80) : '—';
    
    $('#scenarioVarBE').text(be80);
    $('#scenarioVarCM').text(cmRatio80.toFixed(1) + '%');
    $('#scenarioVarProfit').text(formatCurrency(profit80));
  }

  function initMode() {
    $('.mode-btn').on('click', function() {
      var mode = $(this).data('mode');
      currentMode = mode;
      $('.mode-btn').removeClass('active');
      $(this).addClass('active');
      $('.advanced-inputs').toggle(mode === 'advanced');
      $('.advanced-results').toggle(mode === 'advanced');
      $('#scenarioSection').toggle(mode === 'advanced');
      calculate();
    });
  }

  function initInputs() {
    $('#fixedCosts, #variableCost, #pricePerCustomer, #currentCustomers, #salaries, #infrastructure, #marketing, #otherFixed, #paymentProcessing, #supportCost, #infraCost, #otherVariable, #targetProfit, #currency').on('input change', calculate);
    
    $('.tier-row input').on('input change', calculate);
  }

  window.removeTier = function(btn) {
    $(btn).closest('.tier-row').remove();
    calculate();
  };

  function initShare() {
    $('#copyResults').on('click', function() {
      var text = 'Break-Even Calculator Results\n' +
        'Fixed Costs: ' + $fixedCosts.val() + '\n' +
        'Variable Cost: ' + $variableCost.val() + '\n' +
        'Price: ' + $pricePerCustomer.val() + '\n' +
        'Current Customers: ' + $currentCustomers.val() + '\n' +
        'Break-Even Customers: ' + $breakEvenCustomers.text() + '\n' +
        'Break-Even Revenue: ' + $breakEvenRevenue.text() + '\n' +
        'Current Profit: ' + $currentProfit.text();
      navigator.clipboard.writeText(text).then(function() {
        alert('Results copied to clipboard!');
      });
    });

    $('#shareLink').on('click', function() {
      var params = new URLSearchParams({
        fixed: $fixedCosts.val(),
        var: $variableCost.val(),
        price: $pricePerCustomer.val(),
        customers: $currentCustomers.val(),
        salaries: $salaries.val(),
        infra: $infrastructure.val(),
        marketing: $marketing.val(),
        otherFixed: $otherFixed.val(),
        payment: $paymentProcessing.val(),
        support: $supportCost.val(),
        infraCost: $infraCost.val(),
        otherVar: $otherVariable.val(),
        target: $targetProfit.val(),
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
    if (params.has('fixed')) $fixedCosts.val(params.get('fixed'));
    if (params.has('var')) $variableCost.val(params.get('var'));
    if (params.has('price')) $pricePerCustomer.val(params.get('price'));
    if (params.has('customers')) $currentCustomers.val(params.get('customers'));
    if (params.has('salaries')) $salaries.val(params.get('salaries'));
    if (params.has('infra')) $infrastructure.val(params.get('infra'));
    if (params.has('marketing')) $marketing.val(params.get('marketing'));
    if (params.has('otherFixed')) $otherFixed.val(params.get('otherFixed'));
    if (params.has('payment')) $paymentProcessing.val(params.get('payment'));
    if (params.has('support')) $supportCost.val(params.get('support'));
    if (params.has('infraCost')) $infraCost.val(params.get('infraCost'));
    if (params.has('otherVar')) $otherVariable.val(params.get('otherVar'));
    if (params.has('target')) $targetProfit.val(params.get('target'));
    if (params.has('curr')) $currency.val(params.get('curr'));
    if (params.has('mode')) {
      var mode = params.get('mode');
      $('.mode-btn').removeClass('active');
      $('.mode-btn[data-mode="' + mode + '"]').addClass('active');
      currentMode = mode;
      $('.advanced-inputs').toggle(mode === 'advanced');
      $('.advanced-results').toggle(mode === 'advanced');
      $('#scenarioSection').toggle(mode === 'advanced');
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
