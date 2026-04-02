(function($) {
  'use strict';

  var currencySymbols = {
    USD: '$', EUR: '€', GBP: '£', BDT: '৳', INR: '₹', CAD: 'C$', AUD: 'A$', SGD: 'S$'
  };

  var $cashInBank = $('#cashInBank');
  var $grossBurn = $('#grossBurn');
  var $monthlyRevenue = $('#monthlyRevenue');
  
  var $salaries = $('#salaries');
  var $infrastructure = $('#infrastructure');
  var $marketing = $('#marketing');
  var $tools = $('#tools');
  var $office = $('#office');
  var $other = $('#other');
  
  var $revenueGrowth = $('#revenueGrowth');
  var $cashInjection = $('#cashInjection');
  var $injectionMonth = $('#injectionMonth');
  var $currency = $('#currency');
  
  var $netBurn = $('#netBurn');
  var $runwayContainer = $('#runwayContainer');
  var $runwayValue = $('#runwayValue');
  var $runwayBadge = $('#runwayBadge');
  var $runwaySub = $('#runwaySub');
  var $cashAt6 = $('#cashAt6');
  var $cashAt12 = $('#cashAt12');
  var $feedback = $('#feedback');
  
  var $runwayWithHires = $('#runwayWithHires');
  var $runwayWithGrowth = $('#runwayWithGrowth');
  var $breakEvenMonth = $('#breakEvenMonth');
  var $cashBurnedAtBreakEven = $('#cashBurnedAtBreakEven');
  var $headcountPercent = $('#headcountPercent');
  var $fundraiseTrigger = $('#fundraiseTrigger');
  
  var hireCount = 1;
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

  function getGrowthRate(rate) {
    return Math.max(-50, Math.min(200, parseFloat(rate) || 0)) / 100;
  }

  function getHires() {
    var hires = [];
    $('.hire-row').each(function() {
      var $row = $(this);
      var role = $row.find('.hire-role').val();
      var cost = Math.max(0, parseFloat($row.find('.hire-cost').val()) || 0);
      var start = Math.max(1, parseInt($row.find('.hire-start').val()) || 1);
      if (cost > 0) {
        hires.push({ role: role, cost: cost, startMonth: start });
      }
    });
    return hires.sort(function(a, b) { return a.startMonth - b.startMonth; });
  }

  function calculateItemizedBurn() {
    return Math.max(0, parseFloat($salaries.val()) || 0) +
           Math.max(0, parseFloat($infrastructure.val()) || 0) +
           Math.max(0, parseFloat($marketing.val()) || 0) +
           Math.max(0, parseFloat($tools.val()) || 0) +
           Math.max(0, parseFloat($office.val()) || 0) +
           Math.max(0, parseFloat($other.val()) || 0);
  }

  function calculate() {
    var cash = Math.max(0, parseFloat($cashInBank.val()) || 0);
    var grossBurn = Math.max(0, parseFloat($grossBurn.val()) || 0);
    var revenue = Math.max(0, parseFloat($monthlyRevenue.val()) || 0);
    var revenueGrowthRate = getGrowthRate($revenueGrowth.val());
    var cashInjection = Math.max(0, parseFloat($cashInjection.val()) || 0);
    var injectionMonth = Math.max(1, parseInt($injectionMonth.val()) || 1);
    var hires = getHires();

    var itemizedBurn = calculateItemizedBurn();
    var useItemized = itemizedBurn > 0;
    if (useItemized) {
      var manualBurn = grossBurn;
      if (itemizedBurn !== manualBurn && manualBurn > 0) {
        $('#reconNote').text('Your itemized costs total ' + formatCurrency(itemizedBurn) + ', but you entered ' + formatCurrency(manualBurn) + ' as gross burn. Using itemized total.').show();
      } else {
        $('#reconNote').hide();
      }
      grossBurn = itemizedBurn;
    } else {
      $('#reconNote').hide();
    }

    var netBurn = grossBurn - revenue;
    var monthsRunway = 0;
    var runwayEndDate = '';
    var isProfitable = netBurn < 0;
    var isInfinite = netBurn === 0;
    var cashAt6 = 0;
    var cashAt12 = 0;
    var breakEvenMonthVal = -1;
    var totalBurnedAtBreakEven = 0;
    var fundraiseTriggerMonth = -1;
    var monthlyData = [];
    var cash = cash;

    if (isProfitable) {
      monthsRunway = 999;
      runwayEndDate = 'Infinite — you are cash positive';
      cashAt6 = cash + (Math.abs(netBurn) * 6);
      cashAt12 = cash + (Math.abs(netBurn) * 12);
    } else if (isInfinite) {
      monthsRunway = 999;
      runwayEndDate = 'Infinite — you are at break-even';
      cashAt6 = cash;
      cashAt12 = cash;
    } else if (netBurn > 0) {
      var currentCash = cash;
      var maxMonths = 120;
      var breakEvenReached = false;
      
      for (var n = 1; n <= maxMonths; n++) {
        var monthlyRev = revenue * Math.pow(1 + revenueGrowthRate, n - 1);
        var monthlyGrossBurn = grossBurn;
        
        for (var h = 0; h < hires.length; h++) {
          if (n >= hires[h].startMonth) {
            monthlyGrossBurn += hires[h].cost;
          }
        }
        
        var monthlyNetBurn = monthlyGrossBurn - monthlyRev;
        
        if (n === injectionMonth) {
          currentCash += cashInjection;
        }
        
        if (currentCash > 0) {
          currentCash -= monthlyNetBurn;
        }
        
        var currentNetBurn = monthlyGrossBurn - monthlyRev;
        
        if (!breakEvenReached && monthlyRev >= monthlyGrossBurn) {
          breakEvenMonthVal = n;
          totalBurnedAtBreakEven = cash - currentCash;
          breakEvenReached = true;
        }
        
        if (fundraiseTriggerMonth === -1 && currentCash > 0 && currentCash <= currentNetBurn * 3) {
          fundraiseTriggerMonth = n;
        }
        
        monthlyData.push({
          month: n,
          cash: Math.max(0, currentCash),
          burn: monthlyGrossBurn,
          revenue: monthlyRev,
          netBurn: monthlyNetBurn
        });
        
        if (n === 6) cashAt6 = Math.max(0, currentCash);
        if (n === 12) cashAt12 = Math.max(0, currentCash);
        
        if (monthsRunway === 0 && currentCash <= 0) {
          monthsRunway = n - 1 + (currentCash < 0 ? (currentCash + monthlyNetBurn) / monthlyNetBurn : 0);
          runwayEndDate = formatDate(monthsRunway);
        }
        
        if (currentCash <= 0 && n > 60) {
          monthsRunway = 60;
          runwayEndDate = formatDate(monthsRunway);
          break;
        }
      }
      
      if (monthsRunway === 0) {
        monthsRunway = cash / netBurn;
        runwayEndDate = formatDate(monthsRunway);
      }
    }

    if (cash === 0) {
      monthsRunway = 0;
      runwayEndDate = '0 months — no cash remaining';
    }

    if (monthsRunway > 60) {
      monthsRunway = 60;
      runwayEndDate = '> 60 months — effectively infinite runway';
    }

    var runwayText = '';
    if (isProfitable) {
      runwayText = 'Cash positive. Growing by ' + formatCurrency(Math.abs(netBurn)) + '/mo.';
    } else if (isInfinite) {
      runwayText = 'Infinite — you are at break-even';
    } else if (cash === 0) {
      runwayText = '0 months — no cash remaining';
    } else {
      runwayText = monthsRunway.toFixed(1) + ' months';
    }

    $netBurn.text(formatCurrency(Math.abs(netBurn)));
    $netBurn.toggleClass('negative', netBurn > 0);
    $netBurn.toggleClass('positive', netBurn < 0);
    
    $runwayValue.text(runwayText);
    
    var badgeClass, badgeText;
    if (isProfitable) {
      badgeClass = 'profitable'; badgeText = 'Profitable';
    } else if (monthsRunway > 24) {
      badgeClass = 'safe'; badgeText = 'Safe';
    } else if (monthsRunway >= 18) {
      badgeClass = 'comfortable'; badgeText = 'Comfortable';
    } else if (monthsRunway >= 12) {
      badgeClass = 'plan'; badgeText = 'Plan ahead';
    } else if (monthsRunway >= 6) {
      badgeClass = 'fundraise'; badgeText = 'Start fundraising';
    } else {
      badgeClass = 'critical'; badgeText = 'Critical';
    }
    
    $runwayBadge.attr('class', 'health-badge ' + badgeClass).text(badgeText);
    
    if (!isProfitable && !isInfinite && cash > 0) {
      $runwaySub.text('Runway ends: ' + runwayEndDate);
    } else {
      $runwaySub.text(runwayEndDate);
    }
    
    $cashAt6.text(formatCurrency(cashAt6));
    $cashAt12.text(formatCurrency(cashAt12));
    $cashAt6.toggleClass('negative', cashAt6 < 0);
    $cashAt12.toggleClass('negative', cashAt12 < 0);

    var feedback = '';
    if (isProfitable) {
      feedback = 'You are cash flow positive. Fundraising is optional — raise from a position of strength.';
    } else if (monthsRunway > 18) {
      var startFundraise = Math.max(1, Math.floor(monthsRunway - 6));
      var endFundraise = formatDate(monthsRunway - 1);
      feedback = 'You have strong runway. Begin fundraising conversations in Month ' + startFundraise + ' to close before ' + endFundraise + '.';
    } else if (monthsRunway >= 12) {
      feedback = 'Start fundraising now. Raise typically takes 3-6 months to close.';
    } else if (monthsRunway >= 6) {
      feedback = 'Fundraising is urgent. You have limited time to run a proper process.';
    } else {
      feedback = 'Emergency mode. Focus on cutting burn or closing a bridge round immediately.';
    }
    $feedback.text(feedback);

    if (currentMode === 'advanced') {
      var runwayWithHires = calculateRunwayWithHires(cash, revenue, revenueGrowthRate, hires, cashInjection, injectionMonth);
      var runwayWithGrowth = calculateRunwayWithGrowth(cash, grossBurn, revenue, revenueGrowthRate, hires, cashInjection, injectionMonth);
      
      $runwayWithHires.text(runwayWithHires.text);
      $runwayWithGrowth.text(runwayWithGrowth.text);
      
      if (breakEvenMonthVal > 0) {
        $breakEvenMonth.text('Month ' + breakEvenMonthVal);
        $cashBurnedAtBreakEven.text(formatCurrency(totalBurnedAtBreakEven));
      } else {
        $breakEvenMonth.text('Not reached');
        $cashBurnedAtBreakEven.text('—');
      }
      
      var salaries = Math.max(0, parseFloat($salaries.val()) || 0);
      var hcPercent = grossBurn > 0 ? (salaries / grossBurn * 100) : 0;
      $headcountPercent.text(hcPercent.toFixed(1) + '%');
      
      if (fundraiseTriggerMonth > 0) {
        $fundraiseTrigger.text('Month ' + fundraiseTriggerMonth);
      } else {
        $fundraiseTrigger.text('Not triggered');
      }

      var hireWarnings = [];
      hires.forEach(function(hire) {
        if (hire.startMonth > monthsRunway) {
          hireWarnings.push(hire.role + ' starts in Month ' + hire.startMonth + ' after projected cash-out.');
        }
      });
      if (cashInjection > 0 && injectionMonth > monthsRunway && monthsRunway < 60) {
        hireWarnings.push('Injection arrives in Month ' + injectionMonth + ' after projected cash-out.');
      }
      if (hireWarnings.length > 0) {
        $('#hireWarning').text(hireWarnings.join(' ')).show();
      } else {
        $('#hireWarning').hide();
      }

      updateChart(monthlyData, monthsRunway, breakEvenMonthVal);
      updateScenarios(cash, grossBurn, revenue, hires, cashInjection, injectionMonth);
    }
  }

  function calculateRunwayWithHires(cash, revenue, revenueGrowthRate, hires, cashInjection, injectionMonth) {
    var currentCash = cash;
    var maxMonths = 120;
    var months = 0;
    
    for (var n = 1; n <= maxMonths; n++) {
      var monthlyRev = revenue * Math.pow(1 + revenueGrowthRate, n - 1);
      var monthlyBurn = 0;
      
      for (var h = 0; h < hires.length; h++) {
        if (n >= hires[h].startMonth) {
          monthlyBurn += hires[h].cost;
        }
      }
      
      if (n === injectionMonth) {
        currentCash += cashInjection;
      }
      
      var netBurn = monthlyBurn - monthlyRev;
      if (currentCash > 0) {
        currentCash -= netBurn;
      }
      
      if (currentCash <= 0) {
        months = n - 1 + (currentCash < 0 && netBurn > 0 ? (currentCash + netBurn) / netBurn : 0);
        break;
      }
      months = n;
    }
    
    return { text: months > 60 ? '> 60 months' : months.toFixed(1) + ' months' };
  }

  function calculateRunwayWithGrowth(cash, grossBurn, revenue, revenueGrowthRate, hires, cashInjection, injectionMonth) {
    var currentCash = cash;
    var maxMonths = 120;
    var months = 0;
    
    for (var n = 1; n <= maxMonths; n++) {
      var monthlyRev = revenue * Math.pow(1 + revenueGrowthRate, n - 1);
      var monthlyBurn = grossBurn;
      
      for (var h = 0; h < hires.length; h++) {
        if (n >= hires[h].startMonth) {
          monthlyBurn += hires[h].cost;
        }
      }
      
      if (n === injectionMonth) {
        currentCash += cashInjection;
      }
      
      var netBurn = monthlyBurn - monthlyRev;
      if (currentCash > 0) {
        currentCash -= netBurn;
      }
      
      if (currentCash <= 0) {
        months = n - 1 + (currentCash < 0 && netBurn > 0 ? (currentCash + netBurn) / netBurn : 0);
        break;
      }
      months = n;
    }
    
    return { text: months > 60 ? '> 60 months' : months.toFixed(1) + ' months' };
  }

  function updateScenarios(cash, grossBurn, revenue, hires, cashInjection, injectionMonth) {
    var defaultRunway = calculateScenario(cash, grossBurn, revenue, 0, hires, cashInjection, injectionMonth);
    var optimisticRunway = calculateScenario(cash, grossBurn, revenue, 5, [], cashInjection, injectionMonth);
    var pessimisticRunway = calculateScenario(cash, grossBurn, revenue, -5, hires, cashInjection, injectionMonth);
    
    $('#scenarioDefaultRunway').text(defaultRunway.runway);
    $('#scenarioDefaultBreakEven').text(defaultRunway.breakEven);
    $('#scenarioDefaultCash12').text(defaultRunway.cash12);
    
    $('#scenarioOptimisticRunway').text(optimisticRunway.runway);
    $('#scenarioOptimisticBreakEven').text(optimisticRunway.breakEven);
    $('#scenarioOptimisticCash12').text(optimisticRunway.cash12);
    
    $('#scenarioPessimisticRunway').text(pessimisticRunway.runway);
    $('#scenarioPessimisticBreakEven').text(pessimisticRunway.breakEven);
    $('#scenarioPessimisticCash12').text(pessimisticRunway.cash12);
  }

  function calculateScenario(cash, grossBurn, revenue, growthAdjustment, hires, cashInjection, injectionMonth) {
    var revenueGrowthRate = growthAdjustment / 100;
    var currentCash = cash;
    var maxMonths = 60;
    var months = 0;
    var breakEven = 'Not reached';
    var cashAt12 = 0;
    var breakEvenReached = false;
    
    for (var n = 1; n <= maxMonths; n++) {
      var monthlyRev = revenue * Math.pow(1 + revenueGrowthRate, n - 1);
      var monthlyBurn = grossBurn;
      
      for (var h = 0; h < hires.length; h++) {
        if (n >= hires[h].startMonth) {
          monthlyBurn += hires[h].cost;
        }
      }
      
      if (n === injectionMonth) {
        currentCash += cashInjection;
      }
      
      var netBurn = monthlyBurn - monthlyRev;
      if (currentCash > 0) {
        currentCash -= netBurn;
      }
      
      if (!breakEvenReached && monthlyRev >= monthlyBurn) {
        breakEven = 'Month ' + n;
        breakEvenReached = true;
      }
      
      if (n === 12) {
        cashAt12 = Math.max(0, currentCash);
      }
      
      if (currentCash <= 0) {
        months = n - 1;
        break;
      }
      months = n;
    }
    
    return {
      runway: months > 60 ? '> 60 months' : months.toFixed(1) + ' months',
      breakEven: breakEven,
      cash12: formatCurrency(cashAt12)
    };
  }

  function updateChart(data, runwayMonths, breakEvenMonth) {
    var canvas = document.getElementById('runwayChart');
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

    var displayMonths = Math.min(data.length, 24);
    if (displayMonths === 0) displayMonths = 1;
    
    var maxCash = 0;
    data.slice(0, displayMonths).forEach(function(d) {
      maxCash = Math.max(maxCash, d.cash);
    });
    var initialCash = data.length > 0 ? data[0].cash : 0;
    maxCash = Math.max(maxCash, initialCash);
    if (maxCash === 0) maxCash = 100;

    var reserveLine = 0;
    if (data.length > 0) {
      var netBurn = data[0].burn - data[0].revenue;
      if (netBurn > 0) {
        reserveLine = netBurn * 3;
      }
    }

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
    for (var i = 0; i < displayMonths; i += Math.ceil(displayMonths / 6)) {
      var x = padding.left + (chartWidth / (displayMonths - 1 || 1)) * i;
      ctx.fillText('M' + data[i].month, x, height - 8);
    }

    if (reserveLine > 0) {
      var reserveY = padding.top + chartHeight - (reserveLine / maxCash) * chartHeight;
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#f0a040';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padding.left, reserveY);
      ctx.lineTo(width - padding.right, reserveY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#f0a040';
      ctx.font = '10px "DM Mono"';
      ctx.textAlign = 'left';
      ctx.fillText('Fundraise trigger', padding.left + 4, reserveY - 4);
    }

    var zeroY = padding.top + chartHeight;
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#f05050';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding.left, zeroY);
    ctx.lineTo(width - padding.right, zeroY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#f05050';
    ctx.font = '10px "DM Mono"';
    ctx.textAlign = 'left';
    ctx.fillText('Cash out', padding.left + 4, zeroY - 4);

    ctx.lineWidth = 2;
    ctx.beginPath();
    data.slice(0, displayMonths).forEach(function(d, i) {
      var x = padding.left + (chartWidth / (displayMonths - 1 || 1)) * i;
      var y = padding.top + chartHeight - (d.cash / maxCash) * chartHeight;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#c8f060';
    ctx.stroke();

    if (runwayMonths > 0 && runwayMonths < displayMonths) {
      var runwayX = padding.left + (chartWidth / (displayMonths - 1 || 1)) * (runwayMonths - 1);
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
      ctx.fillText('Month ' + Math.floor(runwayMonths) + ' — Cash out', runwayX, padding.top - 6);
    }

    if (breakEvenMonth > 0 && breakEvenMonth < displayMonths) {
      var beX = padding.left + (chartWidth / (displayMonths - 1 || 1)) * (breakEvenMonth - 1);
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#c8f060';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(beX, padding.top);
      ctx.lineTo(beX, height - padding.bottom);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#c8f060';
      ctx.font = '11px "DM Mono"';
      ctx.textAlign = 'center';
      ctx.fillText('Break-even', beX, padding.top - 6);
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
      $('#scenarioSection').toggle(mode === 'advanced');
      calculate();
    });
  }

  function initInputs() {
    $('#cashInBank, #grossBurn, #monthlyRevenue, #salaries, #infrastructure, #marketing, #tools, #office, #other, #revenueGrowth, #cashInjection, #injectionMonth, #currency').on('input change', calculate);
    
    $('#addHireBtn').on('click', function() {
      if (hireCount >= 5) return;
      hireCount++;
      var html = '<div class="hire-row" data-hire="' + (hireCount - 1) + '">' +
        '<div class="hire-fields">' +
        '<input type="text" class="hire-role" value="Engineer" placeholder="Role">' +
        '<input type="number" class="hire-cost" value="8000" min="0" max="9999999" step="1" placeholder="Monthly Cost">' +
        '<input type="number" class="hire-start" value="1" min="1" max="36" step="1" placeholder="Start Month">' +
        '</div>' +
        '<button class="remove-hire" onclick="removeHire(this)">×</button>' +
        '</div>';
      $('#hireContainer').append(html);
      $('.hire-row:last input').on('input change', calculate);
      if (hireCount >= 5) {
        $(this).prop('disabled', true).css('opacity', 0.5);
      }
    });

    $('.hire-row input').on('input change', calculate);
  }

  window.removeHire = function(btn) {
    $(btn).closest('.hire-row').remove();
    hireCount--;
    $('#addHireBtn').prop('disabled', false).css('opacity', 1);
    calculate();
  };

  function initShare() {
    $('#copyResults').on('click', function() {
      var text = 'Runway Calculator Results\n' +
        'Cash in Bank: ' + $cashInBank.val() + '\n' +
        'Monthly Gross Burn: ' + $grossBurn.val() + '\n' +
        'Monthly Revenue: ' + $monthlyRevenue.val() + '\n' +
        'Net Burn: ' + $netBurn.text() + '\n' +
        'Runway: ' + $runwayValue.text() + '\n' +
        $runwaySub.text();
      navigator.clipboard.writeText(text).then(function() {
        alert('Results copied to clipboard!');
      });
    });

    $('#shareLink').on('click', function() {
      var params = new URLSearchParams({
        cash: $cashInBank.val(),
        burn: $grossBurn.val(),
        revenue: $monthlyRevenue.val(),
        salaries: $salaries.val(),
        infra: $infrastructure.val(),
        marketing: $marketing.val(),
        tools: $tools.val(),
        office: $office.val(),
        other: $other.val(),
        growth: $revenueGrowth.val(),
        injection: $cashInjection.val(),
        injectionMonth: $injectionMonth.val(),
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
    if (params.has('cash')) $cashInBank.val(params.get('cash'));
    if (params.has('burn')) $grossBurn.val(params.get('burn'));
    if (params.has('revenue')) $monthlyRevenue.val(params.get('revenue'));
    if (params.has('salaries')) $salaries.val(params.get('salaries'));
    if (params.has('infra')) $infrastructure.val(params.get('infra'));
    if (params.has('marketing')) $marketing.val(params.get('marketing'));
    if (params.has('tools')) $tools.val(params.get('tools'));
    if (params.has('office')) $office.val(params.get('office'));
    if (params.has('other')) $other.val(params.get('other'));
    if (params.has('growth')) $revenueGrowth.val(params.get('growth'));
    if (params.has('injection')) $cashInjection.val(params.get('injection'));
    if (params.has('injectionMonth')) $injectionMonth.val(params.get('injectionMonth'));
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
