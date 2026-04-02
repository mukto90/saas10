(function($) {
  'use strict';

  var cohortColors = ['#c8f060', '#60d4f0', '#a082f0', '#f0a040', '#f05050', '#888580'];
  
  var benchmarks = {
    top: { 1: 85, 3: 75, 6: 68, 12: 60 },
    median: { 1: 70, 3: 58, 6: 50, 12: 42 },
    bottom: { 1: 55, 3: 40, 6: 32, 12: 25 }
  };

  var currentMode = 'simple';
  var rowCount = 3;

  function getRetentionData() {
    var data = [];
    $('.grid-row').each(function(idx) {
      var $row = $(this);
      var name = $row.find('.cohort-name').val() || 'Cohort ' + (idx + 1);
      var values = [100];
      $row.find('.retention-input').each(function() {
        var val = parseFloat($(this).val());
        values.push(isNaN(val) ? null : Math.max(0, Math.min(100, val)));
      });
      data.push({ name: name, values: values, index: idx });
    });
    return data;
  }

  function getCohortMeta() {
    var meta = [];
    $('.meta-row').each(function() {
      var $row = $(this);
      var size = Math.max(0, parseInt($row.find('.cohort-size').val()) || 0);
      var mrr = Math.max(0, parseFloat($row.find('.cohort-mrr').val()) || 0);
      meta.push({ size: size, mrr: mrr });
    });
    return meta;
  }

  function calculate() {
    var data = getRetentionData();
    var meta = getCohortMeta();
    var showBenchmarks = $('#showBenchmarks').is(':checked');
    
    updateHeatmap(data);
    updateSummary(data, meta);
    updateChart(data, showBenchmarks);
    updateLegend(data);
    
    $('#benchmarkNote').toggle(showBenchmarks && currentMode === 'advanced');
  }

  function updateHeatmap(data) {
    $('.grid-row').each(function(idx) {
      var $row = $(this);
      $row.find('.retention-input').each(function(monthIdx) {
        var $cell = $(this).closest('.month-col');
        var val = parseFloat($(this).val());
        
        $cell.removeClass('heat-90 heat-75 heat-60 heat-40 heat-low');
        $cell.attr('data-empty', isNaN(val) ? 'true' : 'false');
        
        if (!isNaN(val)) {
          if (val >= 90) $cell.addClass('heat-90');
          else if (val >= 75) $cell.addClass('heat-75');
          else if (val >= 60) $cell.addClass('heat-60');
          else if (val >= 40) $cell.addClass('heat-40');
          else $cell.addClass('heat-low');
        }
      });
    });
  }

  function updateSummary(data, meta) {
    var avgM1 = calculateAverage(data, 1);
    var avgM3 = calculateAverage(data, 3);
    var avgM6 = calculateAverage(data, 6);
    var avgM12 = calculateAverage(data, 12);
    
    $('#avgM1').text(avgM1 !== null ? avgM1.toFixed(1) + '%' : '—');
    $('#avgM3').text(avgM3 !== null ? avgM3.toFixed(1) + '%' : '—');
    $('#avgM6').text(avgM6 !== null ? avgM6.toFixed(1) + '%' : '—');
    $('#avgM12').text(avgM12 !== null ? avgM12.toFixed(1) + '%' : '—');
    
    var bestWorst = calculateBestWorst(data);
    $('#bestCohort').text(bestWorst.best);
    $('#worstCohort').text(bestWorst.worst);
    
    var trend = calculateTrend(data);
    var trendText = '';
    if (trend === null) {
      trendText = 'Insufficient data';
    } else if (trend > 0) {
      trendText = 'Improving +' + trend.toFixed(1) + '%';
    } else if (trend < 0) {
      trendText = 'Declining ' + trend.toFixed(1) + '%';
    } else {
      trendText = 'Flat';
    }
    $('#retentionTrend').text(trendText);
    
    var healthBadge, healthText;
    if (avgM3 === null) {
      healthBadge = 'Moderate'; healthText = 'Insufficient M3 data';
    } else if (avgM3 > 75) {
      healthBadge = 'Excellent'; healthText = 'Based on average M3 retention';
    } else if (avgM3 >= 60) {
      healthBadge = 'Good'; healthText = 'Based on average M3 retention';
    } else if (avgM3 >= 45) {
      healthBadge = 'Moderate'; healthText = 'Based on average M3 retention';
    } else if (avgM3 >= 30) {
      healthBadge = 'Concerning'; healthText = 'Based on average M3 retention';
    } else {
      healthBadge = 'Critical'; healthText = 'Based on average M3 retention';
    }
    
    $('#healthBadge').attr('class', 'health-badge ' + healthBadge.toLowerCase()).text(healthBadge);
    $('#healthText').text(healthText);
    
    var insight = generateInsight(data, trend);
    $('#insightLine').text(insight);
    
    if (currentMode === 'advanced') {
      updateAdvancedMetrics(data, meta, avgM1, avgM12);
    }
  }

  function calculateAverage(data, monthIdx) {
    var sum = 0;
    var count = 0;
    data.forEach(function(cohort) {
      var val = cohort.values[monthIdx];
      if (val !== null && val !== undefined) {
        sum += val;
        count++;
      }
    });
    return count > 0 ? sum / count : null;
  }

  function calculateBestWorst(data) {
    var best = { name: '', avg: -1 };
    var worst = { name: '', avg: 101 };
    
    data.forEach(function(cohort) {
      var sum = 0;
      var count = 0;
      for (var i = 1; i < cohort.values.length; i++) {
        if (cohort.values[i] !== null) {
          sum += cohort.values[i];
          count++;
        }
      }
      if (count > 0) {
        var avg = sum / count;
        if (avg > best.avg) { best.avg = avg; best.name = cohort.name; }
        if (avg < worst.avg) { worst.avg = avg; worst.name = cohort.name; }
      }
    });
    
    return { best: best.name || '—', worst: worst.name || '—' };
  }

  function calculateTrend(data) {
    if (data.length < 2) return null;
    var oldest = data[0].values[1];
    var newest = data[data.length - 1].values[1];
    if (oldest === null || newest === null) return null;
    return newest - oldest;
  }

  function generateInsight(data, trend) {
    if (data.length < 2 || trend === null) {
      return 'Add more cohorts to see retention trends.';
    }
    var oldest = data[0].name;
    var newest = data[data.length - 1].name;
    var trendVal = Math.abs(trend).toFixed(1);
    
    if (trend > 0) {
      return 'Your M1 retention has improved by ' + trendVal + '% from ' + oldest + ' to ' + newest + '. This is a strong signal that product improvements are working.';
    } else if (trend < 0) {
      return 'Your M1 retention has declined by ' + trendVal + '% from ' + oldest + ' to ' + newest + '. Investigate whether recent cohorts experienced changes in onboarding, pricing, or customer fit.';
    } else {
      return 'Your M1 retention has remained flat from ' + oldest + ' to ' + newest + '.';
    }
  }

  function updateAdvancedMetrics(data, meta, avgM1, avgM12) {
    var totalCustomers = 0;
    var totalWeightedM1 = 0;
    var cohortsWithSize = 0;
    
    for (var i = 0; i < data.length && i < meta.length; i++) {
      if (meta[i].size > 0) {
        totalCustomers += meta[i].size;
        if (data[i].values[1] !== null) {
          totalWeightedM1 += data[i].values[1] * meta[i].size;
          cohortsWithSize += meta[i].size;
        }
      }
    }
    
    var avgSize = data.length > 0 ? Math.round(totalCustomers / data.length) : 0;
    var weightedM1 = cohortsWithSize > 0 ? totalWeightedM1 / cohortsWithSize : avgM1;
    
    $('#avgCohortSize').text(avgSize || '—');
    $('#totalCustomers').text(totalCustomers || '—');
    $('#weightedM1').text(weightedM1 !== null ? weightedM1.toFixed(1) + '%' : '—');
    
    if (avgM12 !== null && avgM12 > 0) {
      var annualChurn = (1 - avgM12 / 100) * 100;
      $('#annualChurn').text(annualChurn.toFixed(1) + '%');
      
      var monthlyChurn = (1 - Math.pow(avgM12 / 100, 1 / 12)) * 100;
      $('#monthlyChurn').text(monthlyChurn.toFixed(1) + '%');
    } else {
      $('#annualChurn').text('Insufficient data');
      $('#monthlyChurn').text('—');
    }
  }

  function updateChart(data, showBenchmarks) {
    var canvas = document.getElementById('retentionChart');
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    var width = rect.width;
    var height = rect.height;
    var padding = { top: 20, right: 20, bottom: 40, left: 50 };
    var chartWidth = width - padding.left - padding.right;
    var chartHeight = height - padding.top - padding.bottom;

    var maxMonths = 12;
    data.forEach(function(cohort) {
      for (var i = cohort.values.length - 1; i >= 0; i--) {
        if (cohort.values[i] !== null) {
          maxMonths = Math.max(maxMonths, i);
          break;
        }
      }
    });
    maxMonths = Math.min(maxMonths, 12);
    if (maxMonths < 1) maxMonths = 1;

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
      ctx.fillText((100 - i * 25) + '%', padding.left - 8, y + 4);
    }

    ctx.fillStyle = '#888580';
    ctx.textAlign = 'center';
    for (var i = 0; i <= maxMonths; i++) {
      var x = padding.left + (chartWidth / maxMonths) * i;
      ctx.fillText('M' + i, x, height - 10);
    }

    if (showBenchmarks && currentMode === 'advanced') {
      drawBenchmarkLine(ctx, benchmarks.top, maxMonths, padding, chartWidth, chartHeight, '#c8f060', [2, 2]);
      drawBenchmarkLine(ctx, benchmarks.median, maxMonths, padding, chartWidth, chartHeight, '#888580', [2, 2]);
      drawBenchmarkLine(ctx, benchmarks.bottom, maxMonths, padding, chartWidth, chartHeight, '#888580', [2, 2]);
    }

    data.forEach(function(cohort, idx) {
      var color = cohortColors[idx % cohortColors.length];
      ctx.lineWidth = 2;
      ctx.beginPath();
      var hasData = false;
      for (var i = 0; i <= maxMonths && i < cohort.values.length; i++) {
        if (cohort.values[i] !== null) {
          var x = padding.left + (chartWidth / maxMonths) * i;
          var y = padding.top + chartHeight - (cohort.values[i] / 100) * chartHeight;
          if (!hasData) { ctx.moveTo(x, y); hasData = true; }
          else ctx.lineTo(x, y);
        }
      }
      ctx.strokeStyle = color;
      ctx.stroke();
    });

    var avgData = [];
    for (var i = 0; i <= maxMonths; i++) {
      avgData.push(calculateAverage(data, i));
    }
    
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    var hasAvg = false;
    for (var i = 0; i <= maxMonths; i++) {
      if (avgData[i] !== null) {
        var x = padding.left + (chartWidth / maxMonths) * i;
        var y = padding.top + chartHeight - (avgData[i] / 100) * chartHeight;
        if (!hasAvg) { ctx.moveTo(x, y); hasAvg = true; }
        else ctx.lineTo(x, y);
      }
    }
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function drawBenchmarkLine(ctx, benchmark, maxMonths, padding, chartWidth, chartHeight, color, dash) {
    ctx.setLineDash(dash);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    
    var prevX = null, prevY = null;
    for (var i = 0; i <= maxMonths; i++) {
      if (benchmark[i] !== undefined) {
        var x = padding.left + (chartWidth / maxMonths) * i;
        var y = padding.top + chartHeight - (benchmark[i] / 100) * chartHeight;
        if (prevX === null) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        prevX = x; prevY = y;
      }
    }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
  }

  function updateLegend(data) {
    var html = '';
    data.forEach(function(cohort, idx) {
      var color = cohortColors[idx % cohortColors.length];
      html += '<div class="legend-item"><span class="legend-dot" style="background:' + color + '"></span>' + cohort.name + '</div>';
    });
    html += '<div class="legend-item"><span class="legend-dot" style="background:#ffffff; border:1px dashed #888580;"></span>Average</div>';
    $('#chartLegend').html(html);
  }

  function initMode() {
    $('.mode-btn').on('click', function() {
      var mode = $(this).data('mode');
      currentMode = mode;
      $('.mode-btn').removeClass('active');
      $(this).addClass('active');
      $('.advanced-inputs').toggle(mode === 'advanced');
      $('.advanced-results').toggle(mode === 'advanced');
      
      updateCohortMeta();
      calculate();
    });
  }

  function updateCohortMeta() {
    var data = getRetentionData();
    var html = '';
    data.forEach(function(cohort, idx) {
      var size = 100;
      var mrr = 0;
      var existingMeta = getCohortMeta();
      if (existingMeta[idx]) {
        size = existingMeta[idx].size || 100;
        mrr = existingMeta[idx].mrr || 0;
      }
      html += '<div class="meta-row" data-row="' + idx + '">' +
        '<span class="meta-cohort-name">' + cohort.name + '</span>' +
        '<input type="number" class="cohort-size" value="' + size + '" min="0" placeholder="Customers">' +
        '<input type="number" class="cohort-mrr" value="' + mrr + '" min="0" placeholder="MRR">' +
        '</div>';
    });
    $('#cohortMeta').html(html);
    $('.meta-row input').on('input change', calculate);
  }

  function initInputs() {
    $('#retentionGrid').on('input change', '.cohort-name, .retention-input', function() {
      if (currentMode === 'advanced') {
        updateCohortMeta();
      }
      calculate();
    });
    
    $('#addRowBtn').on('click', function() {
      if (rowCount >= 6) return;
      rowCount++;
      var idx = rowCount - 1;
      var html = '<div class="grid-row" data-row="' + idx + '">' +
        '<div class="cohort-name-col"><input type="text" class="cohort-name" value="Cohort ' + (idx + 1) + '" maxlength="12"></div>' +
        '<div class="month-col m0"><span class="cell-value">100</span></div>';
      
      for (var i = 1; i <= 11; i++) {
        html += '<div class="month-col" data-month="' + i + '"><input type="number" class="retention-input" min="0" max="100" step="0.1"></div>';
      }
      
      html += '<div class="action-col"><button class="remove-row" onclick="removeRow(this)">×</button></div></div>';
      
      $('#retentionGrid').append(html);
      
      if (currentMode === 'advanced') {
        updateCohortMeta();
      }
      
      if (rowCount >= 6) {
        $('#addRowBtn').prop('disabled', true);
      }
      
      calculate();
    });

    $('#showBenchmarks').on('change', calculate);
  }

  window.removeRow = function(btn) {
    if (rowCount <= 1) return;
    $(btn).closest('.grid-row').remove();
    rowCount--;
    $('#addRowBtn').prop('disabled', false);
    
    if (currentMode === 'advanced') {
      updateCohortMeta();
    }
    calculate();
  };

  function initExport() {
    $('#copyCSV').on('click', function() {
      var data = getRetentionData();
      var csv = 'Cohort,Month 0,Month 1,Month 2,Month 3,Month 4,Month 5,Month 6,Month 7,Month 8,Month 9,Month 10,Month 11\n';
      data.forEach(function(cohort) {
        csv += cohort.name + ',';
        cohort.values.forEach(function(val, idx) {
          csv += (val === null ? '' : val) + (idx < cohort.values.length - 1 ? ',' : '');
        });
        csv += '\n';
      });
      navigator.clipboard.writeText(csv).then(function() {
        alert('CSV copied to clipboard!');
      });
    });

    $('#shareLink').on('click', function() {
      var data = getRetentionData();
      var params = new URLSearchParams();
      
      data.forEach(function(cohort, idx) {
        params.set('c' + idx + '_name', cohort.name);
        cohort.values.forEach(function(val, vidx) {
          if (val !== null) {
            params.set('c' + idx + '_m' + vidx, val);
          }
        });
      });
      
      var meta = getCohortMeta();
      meta.forEach(function(m, idx) {
        if (m.size > 0) params.set('size' + idx, m.size);
        if (m.mrr > 0) params.set('mrr' + idx, m.mrr);
      });
      
      params.set('mode', currentMode);
      params.set('bench', $('#showBenchmarks').is(':checked') ? '1' : '0');
      
      var url = window.location.origin + window.location.pathname + '?' + params.toString();
      navigator.clipboard.writeText(url).then(function() {
        alert('Share link copied to clipboard!');
      });
    });
  }

  function loadFromParams() {
    var params = new URLSearchParams(window.location.search);
    
    if (params.has('mode')) {
      var mode = params.get('mode');
      currentMode = mode;
      $('.mode-btn').removeClass('active');
      $('.mode-btn[data-mode="' + mode + '"]').addClass('active');
      $('.advanced-inputs').toggle(mode === 'advanced');
      $('.advanced-results').toggle(mode === 'advanced');
    }
    
    if (params.has('bench')) {
      $('#showBenchmarks').prop('checked', params.get('bench') === '1');
    }
    
    var newData = [];
    var rowIdx = 0;
    while (params.has('c' + rowIdx + '_name')) {
      var name = params.get('c' + rowIdx + '_name');
      var values = [100];
      for (var m = 1; m <= 11; m++) {
        var val = params.get('c' + rowIdx + '_m' + m);
        values.push(val !== null ? parseFloat(val) : null);
      }
      newData.push({ name: name, values: values, index: rowIdx });
      rowIdx++;
      if (rowIdx >= 6) break;
    }
    
    if (newData.length > 0) {
      rowCount = newData.length;
      var html = '';
      newData.forEach(function(cohort, idx) {
        html += '<div class="grid-row" data-row="' + idx + '">' +
          '<div class="cohort-name-col"><input type="text" class="cohort-name" value="' + cohort.name + '" maxlength="12"></div>' +
          '<div class="month-col m0"><span class="cell-value">100</span></div>';
        
        for (var i = 1; i <= 11; i++) {
          var val = cohort.values[i] !== null ? cohort.values[i] : '';
          html += '<div class="month-col" data-month="' + i + '"><input type="number" class="retention-input" value="' + val + '" min="0" max="100" step="0.1"></div>';
        }
        
        html += '<div class="action-col"><button class="remove-row" onclick="removeRow(this)">×</button></div></div>';
      });
      
      $('#retentionGrid .grid-row').remove();
      $('#retentionGrid').append(html);
      
      if (rowCount >= 6) {
        $('#addRowBtn').prop('disabled', true);
      }
      
      if (currentMode === 'advanced') {
        var metaHtml = '';
        newData.forEach(function(cohort, idx) {
          var size = params.get('size' + idx) || 100;
          var mrr = params.get('mrr' + idx) || 0;
          metaHtml += '<div class="meta-row" data-row="' + idx + '">' +
            '<span class="meta-cohort-name">' + cohort.name + '</span>' +
            '<input type="number" class="cohort-size" value="' + size + '" min="0" placeholder="Customers">' +
            '<input type="number" class="cohort-mrr" value="' + mrr + '" min="0" placeholder="MRR">' +
            '</div>';
        });
        $('#cohortMeta').html(metaHtml);
        $('.meta-row input').on('input change', calculate);
      }
    }
  }

  $(function() {
    initMode();
    initInputs();
    initExport();
    loadFromParams();
    calculate();
  });

})(jQuery);
