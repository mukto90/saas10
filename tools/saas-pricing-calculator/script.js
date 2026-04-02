(function($) {
  'use strict';

  var currencySymbols = {
    USD: '$', EUR: '€', GBP: '£', BDT: '৳', INR: '₹', CAD: 'C$', AUD: 'A$', SGD: 'S$'
  };

  var $costToServe = $('#costToServe');
  var $targetMargin = $('#targetMargin');
  var $cac = $('#cac');
  var $paybackMonths = $('#paybackMonths');
  var $infra = $('#infra');
  var $support = $('#support');
  var $payment = $('#payment');
  var $otherVar = $('#otherVar');
  var $fixedCosts = $('#fixedCosts');
  var $expectedCustomers = $('#expectedCustomers');
  var $valueDelivered = $('#valueDelivered');
  var $captureRate = $('#captureRate');
  var $currency = $('#currency');

  var $flatPrice = $('#flatPrice');
  var $seatPrice = $('#seatPrice');
  var $avgSeats = $('#avgSeats');
  var $unitPrice = $('#unitPrice');
  var $avgUnits = $('#avgUnits');
  var $tierStarter = $('#tierStarter');
  var $tierStarterPct = $('#tierStarterPct');
  var $tierGrowth = $('#tierGrowth');
  var $tierGrowthPct = $('#tierGrowthPct');
  var $tierEnterprise = $('#tierEnterprise');
  var $tierEnterprisePct = $('#tierEnterprisePct');

  var $priceLow = $('#priceLow');
  var $priceMid = $('#priceMid');
  var $priceHigh = $('#priceHigh');
  var $priceBadge = $('#priceBadge');
  var $minViablePrice = $('#minViablePrice');
  var $cacRecoveryPrice = $('#cacRecoveryPrice');
  var $priceFloor = $('#priceFloor');
  var $cacPayback = $('#cacPayback');

  var $costPlusPrice = $('#costPlusPrice');
  var $costPlusGm = $('#costPlusGm');
  var $costPlusPayback = $('#costPlusPayback');
  var $valueBasedPrice = $('#valueBasedPrice');
  var $valueBasedGm = $('#valueBasedGm');
  var $valueBasedPayback = $('#valueBasedPayback');
  var $competitivePrice = $('#competitivePrice');
  var $competitiveGm = $('#competitiveGm');
  var $competitivePayback = $('#competitivePayback');
  var $blendedPrice = $('#blendedPrice');
  var $blendedGm = $('#blendedGm');
  var $blendedPayback = $('#blendedPayback');
  var $mrrAtPrice = $('#mrrAtPrice');
  var $arrAtPrice = $('#arrAtPrice');
  var $ltv = $('#ltv');
  var $ltvCac = $('#ltvCac');

  var compCount = 2;
  var currentMode = 'simple';
  var assumedChurn = 0.05;

  function getSymbol() {
    return currencySymbols[$currency.val()] || '$';
  }

  function formatCurrency(num) {
    if (!isFinite(num) || isNaN(num)) return getSymbol() + '0';
    if (num >= 1000000) return getSymbol() + (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return getSymbol() + (num / 1000).toFixed(1) + 'K';
    return getSymbol() + num.toFixed(2);
  }

  function getCostPerCustomer() {
    if (currentMode === 'simple') {
      return parseFloat($costToServe.val()) || 0;
    }
    var infra = parseFloat($infra.val()) || 0;
    var support = parseFloat($support.val()) || 0;
    var payment = parseFloat($payment.val()) || 0;
    var other = parseFloat($otherVar.val()) || 0;
    var expected = parseInt($expectedCustomers.val()) || 1;
    var fixed = parseFloat($fixedCosts.val()) || 0;
    var fixedPerCustomer = fixed / expected;
    var total = infra + support + other + fixedPerCustomer;
    var paymentRate = payment / 100;
    return { base: total, paymentRate: paymentRate };
  }

  function getPriceBadge(gm) {
    if (gm > 80) return { label: 'Excellent', class: 'excellent' };
    if (gm >= 65) return { label: 'Healthy', class: 'healthy' };
    if (gm >= 50) return { label: 'Acceptable', class: 'acceptable' };
    if (gm >= 30) return { label: 'Thin', class: 'thin' };
    return { label: 'Unsustainable', class: 'unsustainable' };
  }

  function getCompetitors() {
    var comps = [];
    $('.competitor-row').each(function() {
      comps.push({
        name: $(this).find('.comp-name').val(),
        price: parseFloat($(this).find('.comp-price').val()) || 0,
        features: parseFloat($(this).find('.comp-features').val()) || 100
      });
    });
    return comps;
  }

  function calculate() {
    var targetMargin = parseFloat($targetMargin.val()) || 0;
    var cac = parseFloat($cac.val()) || 0;
    var payback = parseInt($paybackMonths.val()) || 12;

    $('#warningMessage').hide();
    $('#errorMessage').hide();

    if (targetMargin >= 100) {
      $('#errorMessage').text('100% margin is not achievable.').show();
      return;
    }

    var costData = getCostPerCustomer();
    var costPerCustomer = currentMode === 'simple' ? costData : costData.base;
    var paymentRate = currentMode === 'simple' ? 0 : costData.paymentRate;

    if (costPerCustomer === 0 && currentMode === 'simple') {
      $('#warningMessage').text('No variable cost. Price based on CAC recovery and value.').show();
    }

    var mvp = 0;
    if (targetMargin < 100) {
      mvp = costPerCustomer / (1 - targetMargin / 100);
    }
    $minViablePrice.text(formatCurrency(mvp));

    var cacFloor = 0;
    if (cac > 0 && payback > 0) {
      cacFloor = cac / payback;
    }
    $cacRecoveryPrice.text(formatCurrency(cacFloor));

    var priceFloor = Math.max(mvp, cacFloor);
    $priceFloor.text(formatCurrency(priceFloor));

    var recommendedMid = priceFloor * 1.6;
    var recommendedLow = priceFloor * 1.2;
    var recommendedHigh = priceFloor * 2.0;

    $priceLow.text(formatCurrency(recommendedLow));
    $priceMid.text(formatCurrency(recommendedMid));
    $priceHigh.text(formatCurrency(recommendedHigh));

    var effectiveCost = costPerCustomer + (recommendedMid * paymentRate);
    var gmAtRecommended = ((recommendedMid - effectiveCost) / recommendedMid) * 100;

    var badge = getPriceBadge(gmAtRecommended);
    $priceBadge.attr('class', 'price-badge ' + badge.class).text(badge.label);

    var paybackAtRec = cac > 0 ? cac / (recommendedMid - costPerCustomer) : 0;
    if (paybackAtRec <= 0 || !isFinite(paybackAtRec)) {
      $cacPayback.text('Instant');
    } else {
      $cacPayback.text(paybackAtRec.toFixed(1) + ' mo');
    }

    if (currentMode === 'advanced') {
      var valueDelivered = parseFloat($valueDelivered.val()) || 0;
      var captureRate = parseFloat($captureRate.val()) || 10;
      var expectedCustomers = parseInt($expectedCustomers.val()) || 1;

      var vbp = valueDelivered * (captureRate / 100);
      $valueBasedPrice.text(formatCurrency(vbp));

      var comps = getCompetitors();
      var compPrices = [];
      comps.forEach(function(c) {
        if (c.features > 0) {
          compPrices.push(c.price / (c.features / 100));
        }
      });
      var competitivePrice = compPrices.length > 0 ?
        compPrices.reduce(function(a, b) { return a + b; }, 0) / compPrices.length : 0;
      $competitivePrice.text(formatCurrency(competitivePrice));

      var hasVbp = vbp > 0;
      var hasComp = compPrices.length > 0;

      var costPlusW = 0.3, valueW = 0.4, compW = 0.3;
      if (!hasVbp && !hasComp) {
        costPlusW = 0.5; valueW = 0.5;
      } else if (!hasVbp) {
        costPlusW = 0.4; compW = 0.6;
        valueW = 0;
      } else if (!hasComp) {
        costPlusW = 0.4; valueW = 0.6;
        compW = 0;
      }

      var blended = (mvp * costPlusW) + (vbp * valueW) + (competitivePrice * compW);
      $blendedPrice.text(formatCurrency(blended));

      var costPlusGm = targetMargin;
      var vbpGm = effectiveCost > 0 ? ((vbp - effectiveCost) / vbp) * 100 : 0;
      var compGm = effectiveCost > 0 ? ((competitivePrice - effectiveCost) / competitivePrice) * 100 : 0;
      var blendedGm = effectiveCost > 0 ? ((blended - effectiveCost) / blended) * 100 : 0;

      $costPlusGm.text(costPlusGm.toFixed(1) + '%');
      $valueBasedGm.text(vbpGm.toFixed(1) + '%');
      $competitiveGm.text(compGm.toFixed(1) + '%');
      $blendedGm.text(blendedGm.toFixed(1) + '%');

      var costPlusPayback = cac > 0 && mvp > costPerCustomer ? cac / (mvp - costPerCustomer) : 0;
      var vbpPayback = cac > 0 && vbp > costPerCustomer ? cac / (vbp - costPerCustomer) : 0;
      var compPayback = cac > 0 && competitivePrice > costPerCustomer ? cac / (competitivePrice - costPerCustomer) : 0;
      var blendedPayback = cac > 0 && blended > costPerCustomer ? cac / (blended - costPerCustomer) : 0;

      $costPlusPayback.text(costPlusPayback > 0 ? costPlusPayback.toFixed(1) + ' mo' : 'Instant');
      $valueBasedPayback.text(vbpPayback > 0 ? vbpPayback.toFixed(1) + ' mo' : 'Instant');
      $competitivePayback.text(compPayback > 0 ? compPayback.toFixed(1) + ' mo' : 'Instant');
      $blendedPayback.text(blendedPayback > 0 ? blendedPayback.toFixed(1) + ' mo' : 'Instant');

      var mrrAtPrice = recommendedMid * expectedCustomers;
      var arrAtPrice = mrrAtPrice * 12;
      $mrrAtPrice.text(formatCurrency(mrrAtPrice));
      $arrAtPrice.text(formatCurrency(arrAtPrice));

      var gmDecimal = gmAtRecommended / 100;
      var ltvVal = gmDecimal > 0 ? (recommendedMid * gmDecimal) / assumedChurn : 0;
      var ltvCacVal = ltvVal / cac;

      $ltv.text(formatCurrency(ltvVal));
      $ltvCac.text(ltvCacVal.toFixed(1) + 'x');
      $ltvCac.closest('.result-metric').toggleClass('positive', ltvCacVal >= 3).toggleClass('negative', ltvCacVal < 1);

      var tierSum = parseInt($tierStarterPct.val()) + parseInt($tierGrowthPct.val()) + parseInt($tierEnterprisePct.val());
      $('#tierSum').text(tierSum);
      $('#tierWarning').toggle(tierSum !== 100);

      updateSensitivityChart(costPerCustomer, paymentRate, recommendedMid, mvp, comps);
      updateModelChart();
    }
  }

  function updateSensitivityChart(costPerCustomer, paymentRate, recommendedMid, mvp, comps) {
    var canvas = document.getElementById('sensitivityChart');
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    var width = rect.width;
    var height = rect.height;
    var padding = { top: 20, right: 20, bottom: 30, left: 50 };
    var chartWidth = width - padding.left - padding.right;
    var chartHeight = height - padding.top - padding.bottom;

    var maxPrice = recommendedMid * 3;
    var maxGm = 100;

    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = '#60d4f0';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    var targetY = padding.top + chartHeight - (parseFloat($targetMargin.val()) / maxGm) * chartHeight;
    ctx.beginPath();
    ctx.moveTo(padding.left, targetY);
    ctx.lineTo(width - padding.right, targetY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#60d4f0';
    ctx.font = '10px "DM Mono"';
    ctx.textAlign = 'left';
    ctx.fillText('Target margin', padding.left + 4, targetY - 6);

    ctx.fillStyle = '#888580';
    ctx.textAlign = 'right';
    for (var i = 0; i <= 4; i++) {
      var y = padding.top + (chartHeight / 4) * i;
      ctx.fillText((100 - i * 25) + '%', padding.left - 6, y + 4);
    }

    ctx.textAlign = 'center';
    var prices = [0, maxPrice / 4, maxPrice / 2, maxPrice * 3 / 4, maxPrice];
    prices.forEach(function(p, i) {
      var x = padding.left + (chartWidth / 4) * i;
      ctx.fillText(formatCurrency(p), x, height - 8);
    });

    ctx.strokeStyle = '#c8f060';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (var i = 0; i <= 50; i++) {
      var price = (maxPrice / 50) * i;
      var effectiveCost = costPerCustomer + (price * paymentRate);
      var gm = price > 0 ? ((price - effectiveCost) / price) * 100 : 0;
      var x = padding.left + (price / maxPrice) * chartWidth;
      var y = padding.top + chartHeight - (gm / maxGm) * chartHeight;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.strokeStyle = '#f0a040';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    var mvpX = padding.left + (mvp / maxPrice) * chartWidth;
    ctx.beginPath();
    ctx.moveTo(mvpX, padding.top);
    ctx.lineTo(mvpX, height - padding.bottom);
    ctx.stroke();
    ctx.fillStyle = '#f0a040';
    ctx.textAlign = 'center';
    ctx.fillText('Floor', mvpX, padding.top - 6);

    var recX = padding.left + (recommendedMid / maxPrice) * chartWidth;
    ctx.strokeStyle = '#c8f060';
    ctx.beginPath();
    ctx.moveTo(recX, padding.top);
    ctx.lineTo(recX, height - padding.bottom);
    ctx.stroke();
    ctx.fillStyle = '#c8f060';
    ctx.fillText('Recommended', recX, padding.top - 6);

    ctx.setLineDash([]);
    comps.forEach(function(c) {
      if (c.price > 0 && c.price < maxPrice) {
        var compX = padding.left + (c.price / maxPrice) * chartWidth;
        ctx.strokeStyle = '#888580';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(compX, padding.top);
        ctx.lineTo(compX, height - padding.bottom);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#888580';
        ctx.font = '9px "DM Mono"';
        ctx.textAlign = 'center';
        ctx.fillText(c.name.substring(0, 8), compX, height - padding.bottom + 14);
      }
    });
  }

  function updateModelChart() {
    var $container = $('#modelChartContainer');
    $container.empty();

    var flat = parseFloat($flatPrice.val()) || 0;
    var seatPrice = parseFloat($seatPrice.val()) || 0;
    var avgSeats = parseInt($avgSeats.val()) || 1;
    var unitPrice = parseFloat($unitPrice.val()) || 0;
    var avgUnits = parseInt($avgUnits.val()) || 1;

    var tierStarter = parseFloat($tierStarter.val()) || 0;
    var tierStarterPct = parseInt($tierStarterPct.val()) || 0;
    var tierGrowth = parseFloat($tierGrowth.val()) || 0;
    var tierGrowthPct = parseInt($tierGrowthPct.val()) || 0;
    var tierEnterprise = parseFloat($tierEnterprise.val()) || 0;
    var tierEnterprisePct = parseInt($tierEnterprisePct.val()) || 0;

    var models = [
      { name: 'Flat', arpu: flat },
      { name: 'Per Seat', arpu: seatPrice * avgSeats },
      { name: 'Usage', arpu: unitPrice * avgUnits },
      { name: 'Tiered', arpu: (tierStarter * tierStarterPct + tierGrowth * tierGrowthPct + tierEnterprise * tierEnterprisePct) / 100 }
    ];

    var maxArpu = Math.max.apply(null, models.map(function(m) { return m.arpu; }));

    models.forEach(function(m) {
      var widthPct = maxArpu > 0 ? (m.arpu / maxArpu) * 100 : 0;
      var isHighest = m.arpu === maxArpu && maxArpu > 0;
      var color = isHighest ? '#c8f060' : '#60d4f0';

      var html = '<div class="model-bar">' +
        '<div class="model-bar-label">' + m.name + '</div>' +
        '<div class="model-bar-track">' +
        '<div class="model-bar-fill" style="width: ' + widthPct + '%; background: ' + color + ';"></div>' +
        '</div>' +
        '<div class="model-bar-value">' + formatCurrency(m.arpu) + '</div>' +
        '</div>';
      $container.append(html);
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
      $('#modelChartSection').toggle(mode === 'advanced');
      calculate();
    });
  }

  function initInputs() {
    $costToServe.on('input', calculate);
    $targetMargin.on('input', calculate);
    $cac.on('input', calculate);
    $paybackMonths.on('input', calculate);
    $infra.on('input', calculate);
    $support.on('input', calculate);
    $payment.on('input', calculate);
    $otherVar.on('input', calculate);
    $fixedCosts.on('input', calculate);
    $expectedCustomers.on('input', calculate);
    $valueDelivered.on('input', calculate);
    $captureRate.on('input', calculate);
    $currency.on('change', calculate);

    $flatPrice.on('input', calculate);
    $seatPrice.on('input', calculate);
    $avgSeats.on('input', calculate);
    $unitPrice.on('input', calculate);
    $avgUnits.on('input', calculate);
    $tierStarter.on('input', calculate);
    $tierStarterPct.on('input', calculate);
    $tierGrowth.on('input', calculate);
    $tierGrowthPct.on('input', calculate);
    $tierEnterprise.on('input', calculate);
    $tierEnterprisePct.on('input', calculate);

    $(document).on('input', '.comp-name, .comp-price, .comp-features', calculate);

    $('#addCompBtn').on('click', function() {
      if (compCount >= 4) return;
      var html = '<div class="competitor-row" data-comp="' + compCount + '">' +
        '<input type="text" class="comp-name" value="Competitor ' + String.fromCharCode(65 + compCount) + '" placeholder="Name">' +
        '<input type="number" class="comp-price" value="0" min="0" max="9999999" step="1" placeholder="Price">' +
        '<input type="number" class="comp-features" value="100" min="0" max="200" step="1" placeholder="Features %">' +
        '<button class="comp-remove" title="Remove">×</button>' +
        '</div>';
      $('#competitorList').append(html);
      compCount++;
      if (compCount >= 4) $(this).hide();
    });

    $(document).on('click', '.comp-remove', function() {
      if ($('.competitor-row').length <= 1) return;
      $(this).closest('.competitor-row').remove();
      compCount--;
      $('#addCompBtn').show();
      calculate();
    });
  }

  function initShare() {
    $('#copyResults').on('click', function() {
      var text = 'SaaS Pricing Calculator Results\n' +
        'Cost to Serve: ' + $costToServe.val() + '\n' +
        'Target Margin: ' + $targetMargin.val() + '%\n' +
        'CAC: ' + $cac.val() + '\n' +
        'Recommended Price Range: ' + $priceLow.text() + ' — ' + $priceHigh.text() + '\n' +
        'Price Floor: ' + $priceFloor.text();
      navigator.clipboard.writeText(text).then(function() {
        alert('Results copied to clipboard!');
      });
    });

    $('#shareLink').on('click', function() {
      var params = new URLSearchParams({
        cts: $costToServe.val(),
        tm: $targetMargin.val(),
        cac: $cac.val(),
        pb: $paybackMonths.val(),
        infra: $infra.val(),
        sup: $support.val(),
        pay: $payment.val(),
        ov: $otherVar.val(),
        fc: $fixedCosts.val(),
        ec: $expectedCustomers.val(),
        vd: $valueDelivered.val(),
        cr: $captureRate.val(),
        fp: $flatPrice.val(),
        sp: $seatPrice.val(),
        as: $avgSeats.val(),
        up: $unitPrice.val(),
        au: $avgUnits.val(),
        ts: $tierStarter.val(),
        tsp: $tierStarterPct.val(),
        tg: $tierGrowth.val(),
        tgp: $tierGrowthPct.val(),
        te: $tierEnterprise.val(),
        tep: $tierEnterprisePct.val(),
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
    if (params.has('cts')) $costToServe.val(params.get('cts'));
    if (params.has('tm')) $targetMargin.val(params.get('tm'));
    if (params.has('cac')) $cac.val(params.get('cac'));
    if (params.has('pb')) $paybackMonths.val(params.get('pb'));
    if (params.has('infra')) $infra.val(params.get('infra'));
    if (params.has('sup')) $support.val(params.get('sup'));
    if (params.has('pay')) $payment.val(params.get('pay'));
    if (params.has('ov')) $otherVar.val(params.get('ov'));
    if (params.has('fc')) $fixedCosts.val(params.get('fc'));
    if (params.has('ec')) $expectedCustomers.val(params.get('ec'));
    if (params.has('vd')) $valueDelivered.val(params.get('vd'));
    if (params.has('cr')) $captureRate.val(params.get('cr'));
    if (params.has('fp')) $flatPrice.val(params.get('fp'));
    if (params.has('sp')) $seatPrice.val(params.get('sp'));
    if (params.has('as')) $avgSeats.val(params.get('as'));
    if (params.has('up')) $unitPrice.val(params.get('up'));
    if (params.has('au')) $avgUnits.val(params.get('au'));
    if (params.has('ts')) $tierStarter.val(params.get('ts'));
    if (params.has('tsp')) $tierStarterPct.val(params.get('tsp'));
    if (params.has('tg')) $tierGrowth.val(params.get('tg'));
    if (params.has('tgp')) $tierGrowthPct.val(params.get('tgp'));
    if (params.has('te')) $tierEnterprise.val(params.get('te'));
    if (params.has('tep')) $tierEnterprisePct.val(params.get('tep'));
    if (params.has('curr')) $currency.val(params.get('curr'));
    if (params.has('mode')) {
      var mode = params.get('mode');
      $('.mode-btn').removeClass('active');
      $('.mode-btn[data-mode="' + mode + '"]').addClass('active');
      currentMode = mode;
      $('.advanced-inputs').toggle(mode === 'advanced');
      $('.advanced-results').toggle(mode === 'advanced');
      $('#modelChartSection').toggle(mode === 'advanced');
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
