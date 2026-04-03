var CURRENCY_SYMBOLS = CURRENCY_SYMBOLS || {};
var CHANNEL_COLORS = ['#c8f060', '#60d4f0', '#a082f0', '#f0a050'];

let mode = 'simple';
let channelCount = 1;
let chart = null;

function getCurrency() {
  return CURRENCY_SYMBOLS[$('#currency').val()] || '$';
}

function formatCurrency(value) {
  return getCurrency() + value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function formatCurrencyPrecise(value) {
  return getCurrency() + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function toNum(val) {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
}

function getInputs() {
  return {
    arpu: toNum($('#arpu').val()),
    grossMargin: toNum($('#grossMargin').val()),
    churnRate: toNum($('#churnRate').val()),
    cac: toNum($('#cac').val()),
    expansionMrr: toNum($('#expansionMrr').val()),
    supportCost: toNum($('#supportCost').val()),
    discountRate: toNum($('#discountRate').val())
  };
}

function getChannels() {
  const channels = [];
  $('#channelsContainer .channel-row').each(function(i) {
    channels.push({
      name: $(this).find('.channel-name').val() || `Channel ${i + 1}`,
      spend: toNum($(this).find('.channel-spend').val()),
      customers: toNum($(this).find('.channel-customers').val())
    });
  });
  return channels;
}

function calculate() {
  const inputs = getInputs();
  const channels = mode === 'advanced' ? getChannels() : [];
  
  let lifetime, ltv, cacUsed, ratio, payback;
  let adjustedLtv = null, discountedLtv = null, ratioDiscounted = null;
  let annualLtv = null, grossProfit = null;
  
  if (inputs.churnRate === 0) {
    lifetime = Infinity;
    ltv = Infinity;
    $('#customerLifetime').text('Infinite');
    $('#ltv').text('∞');
    $('#infoMessage').text('With 0% churn, LTV is theoretically infinite.').show();
  } else {
    lifetime = 100 / inputs.churnRate;
    const monthlyMargin = inputs.arpu * inputs.grossMargin / 100;
    ltv = monthlyMargin / (inputs.churnRate / 100);
    
    $('#customerLifetime').text(lifetime.toFixed(1) + ' months');
    $('#ltv').text(formatCurrency(ltv));
    $('#infoMessage').hide();
  }
  
  if (mode === 'advanced' && channels.length > 0) {
    const totalSpend = channels.reduce((s, c) => s + c.spend, 0);
    const totalCustomers = channels.reduce((s, c) => s + c.customers, 0);
    cacUsed = totalCustomers > 0 ? totalSpend / totalCustomers : inputs.cac;
    
    if (inputs.supportCost > inputs.arpu + inputs.expansionMrr) {
      $('#warningMessage').text('Support costs exceed revenue per customer.').show();
    } else {
      $('#warningMessage').hide();
    }
    
    if (inputs.churnRate > 0) {
      const netMonthlyMargin = (inputs.arpu + inputs.expansionMrr - inputs.supportCost) * (inputs.grossMargin / 100);
      adjustedLtv = netMonthlyMargin / (inputs.churnRate / 100);
      $('#adjustedLtv').text(formatCurrency(adjustedLtv));
      
      if (inputs.discountRate > 0) {
        const monthlyDiscountRate = inputs.discountRate / 12 / 100;
        const months = Math.ceil(lifetime);
        let discLtv = 0;
        for (let n = 1; n <= months; n++) {
          discLtv += netMonthlyMargin / Math.pow(1 + monthlyDiscountRate, n);
        }
        discountedLtv = discLtv;
        $('#discountedLtv').text(formatCurrency(discountedLtv));
        ratioDiscounted = discountedLtv / cacUsed;
        $('#ratioDiscounted').text(ratioDiscounted.toFixed(1));
      } else {
        $('#discountedLtv').text(formatCurrency(adjustedLtv));
      }
      
      const cappedMonths = Math.min(36, Math.floor(lifetime));
      annualLtv = ltv * 12;
      if (lifetime < 12) annualLtv = ltv * lifetime;
      $('#annualLtv').text(formatCurrency(annualLtv));
    }
    
    updateChannelBreakdown(channels, cacUsed);
  } else {
    cacUsed = inputs.cac;
    $('#adjustedLtv').text('—');
    $('#discountedLtv').text('—');
    $('#ratioDiscounted').text('—');
    $('#annualLtv').text('—');
    $('#channelBars').empty();
    $('#channelSummary').empty();
    $('#warningMessage').hide();
  }
  
  $('#cacResult').text(formatCurrency(cacUsed));
  
  if (cacUsed > 0 && ltv > 0 && ltv !== Infinity) {
    ratio = ltv / cacUsed;
    $('#ratio').text(ratio.toFixed(1));
    
    let badge = 'unsustainable', label = 'Unsustainable';
    if (ratio > 5) { badge = 'exceptional'; label = 'Exceptional'; }
    else if (ratio >= 3) { badge = 'healthy'; label = 'Healthy'; }
    else if (ratio >= 2) { badge = 'acceptable'; label = 'Acceptable'; }
    else if (ratio >= 1) { badge = 'concerning'; label = 'Concerning'; }
    $('#ratioBadge').attr('class', 'health-badge ' + badge).text(label);
    
    $('#ratioContainer').toggleClass('negative', ratio < 1);
  } else if (cacUsed === 0) {
    ratio = Infinity;
    $('#ratio').text('∞');
    $('#ratioBadge').attr('class', 'health-badge').text('');
    $('#ratioContainer').removeClass('negative');
  } else {
    ratio = 0;
    $('#ratio').text('0');
    $('#ratioBadge').attr('class', 'health-badge').text('');
    $('#ratioContainer').removeClass('negative');
  }
  
  const monthlyMargin = inputs.arpu * inputs.grossMargin / 100;
  grossProfit = monthlyMargin;
  $('#grossProfit').text(formatCurrencyPrecise(grossProfit));
  
  if (monthlyMargin > 0 && cacUsed > 0) {
    payback = cacUsed / monthlyMargin;
    $('#payback').text(payback.toFixed(1) + ' months');
    
    let note = '';
    if (payback < 6) note = 'Excellent — you recoup acquisition cost very quickly.';
    else if (payback <= 12) note = 'Healthy payback window for most SaaS businesses.';
    else if (payback <= 18) note = 'Acceptable — typical for enterprise or high-touch SaaS.';
    else if (payback <= 24) note = 'Stretched — requires strong retention to be profitable.';
    else note = 'Unsustainable — acquisition cost takes too long to recover.';
    $('#paybackNote').text(note);
    $('#paybackContainer').toggleClass('negative', payback > 24);
  } else if (cacUsed === 0) {
    $('#payback').text('Instant');
    $('#paybackNote').text('No acquisition cost — immediate profitability per customer.');
    $('#paybackContainer').removeClass('negative');
  } else {
    $('#payback').text('Never');
    $('#paybackNote').text('Revenue per customer is zero — cannot recover CAC.');
    $('#paybackContainer').addClass('negative');
  }
  
  if (inputs.grossMargin === 0) {
    $('#ltv').text('$0');
    $('#infoMessage').text('Zero margin means no profit per customer.').show();
  }
  
  updateChart(lifetime, ltv, cacUsed, discountedLtv || ltv, payback);
}

function updateChannelBreakdown(channels, blendedCac) {
  const container = $('#channelBars');
  container.empty();
  
  if (channels.length === 0) return;
  
  const cacValues = channels.map(c => c.customers > 0 ? c.spend / c.customers : 0).filter(v => v > 0);
  const maxCac = cacValues.length > 0 ? Math.max(...cacValues) : 1;
  
  channels.forEach((ch, i) => {
    const cac = ch.customers > 0 ? ch.spend / ch.customers : 0;
    const width = maxCac > 0 ? (cac / maxCac) * 100 : 0;
    
    let fillClass = 'normal';
    if (cacValues.length > 1) {
      if (cac === Math.min(...cacValues)) fillClass = 'best';
      else if (cac === Math.max(...cacValues)) fillClass = 'worst';
    }
    
    const row = $(`
      <div class="channel-bar-row">
        <div class="channel-bar-label">${ch.name}</div>
        <div class="channel-bar-track">
          <div class="channel-bar-fill ${fillClass}" style="width: ${width}%;"></div>
        </div>
        <div class="channel-bar-value">${cac > 0 ? formatCurrency(cac) : '—'}</div>
      </div>
    `);
    container.append(row);
  });
  
  const validChannels = channels.filter(c => c.customers > 0);
  if (validChannels.length > 0) {
    const withCac = validChannels.map(c => ({ ...c, cac: c.spend / c.customers }));
    const best = withCac.reduce((a, b) => a.cac < b.cac ? a : b);
    const worst = withCac.reduce((a, b) => a.cac > b.cac ? a : b);
    
    $('#channelSummary').html(
      `Your best channel is <span class="best">${best.name}</span> at ${formatCurrency(best.cac)} CAC. ` +
      `Your worst is <span class="worst">${worst.name}</span> at ${formatCurrency(worst.cac)} CAC.`
    );
  }
}

function updateChart(lifetime, ltv, cac, discountedLtv, paybackMonth) {
  const ctx = document.getElementById('projectionChart').getContext('2d');
  
  const labels = Array.from({length: 36}, (_, i) => `Month ${i + 1}`);
  const ltvData = [];
  const discountedLtvData = [];
  const cacData = [];
  
  for (let i = 1; i <= 36; i++) {
    const monthlyMargin = getInputs().arpu * getInputs().grossMargin / 100;
    const months = Math.min(i, lifetime === Infinity ? 36 : Math.ceil(lifetime));
    ltvData.push(monthlyMargin * months);
    cacData.push(cac);
    
    if (getInputs().discountRate > 0) {
      const monthlyDiscountRate = getInputs().discountRate / 12 / 100;
      let disc = 0;
      for (let n = 1; n <= months; n++) {
        disc += monthlyMargin / Math.pow(1 + monthlyDiscountRate, n);
      }
      discountedLtvData.push(disc);
    } else {
      discountedLtvData.push(monthlyMargin * months);
    }
  }
  
  if (chart) chart.destroy();
  
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Cumulative LTV',
          data: ltvData,
          borderColor: '#c8f060',
          backgroundColor: 'rgba(200,240,96,0.05)',
          fill: false,
          tension: 0.3,
          pointRadius: 2,
          pointHoverRadius: 5
        },
        {
          label: 'Cumulative Discounted LTV',
          data: mode === 'advanced' ? discountedLtvData : [],
          borderColor: '#60d4f0',
          borderDash: [5, 5],
          backgroundColor: 'transparent',
          tension: 0.3,
          pointRadius: 2,
          pointHoverRadius: 4
        },
        {
          label: 'CAC',
          data: cacData,
          borderColor: '#f05050',
          backgroundColor: 'transparent',
          tension: 0,
          pointRadius: 0,
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: { display: true, labels: { color: '#888580', font: { family: "'DM Mono', monospace", size: 11 } } },
        tooltip: {
          backgroundColor: '#111',
          titleColor: '#f0ede8',
          bodyColor: '#888580',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          padding: 12,
          callbacks: {
            label: function(ctx) {
              const net = ctx.raw - cac;
              return `${ctx.dataset.label}: ${formatCurrency(ctx.raw)} (Net: ${net >= 0 ? '+' : ''}${formatCurrency(net)})`;
            }
          }
        }
      },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#888580', font: { family: "'DM Mono', monospace", size: 10 } } },
        y: { 
          grid: { color: 'rgba(255,255,255,0.05)' }, 
          ticks: { 
            color: '#888580', 
            font: { family: "'DM Mono', monospace", size: 10 },
            callback: function(val) { return formatCurrency(val); }
          }
        }
      }
    }
  });
}

function setupEventListeners() {
  $('.mode-btn').on('click', function() {
    $('.mode-btn').removeClass('active');
    $(this).addClass('active');
    mode = $(this).data('mode');
    $('.advanced-inputs').toggle(mode === 'advanced');
    $('.advanced-results').toggle(mode === 'advanced');
    calculate();
  });
  
  $('#arpu, #grossMargin, #churnRate, #cac, #expansionMrr, #supportCost, #discountRate').on('input', calculate);
  
  $('#channelsContainer').on('input', '.channel-name, .channel-spend, .channel-customers', calculate);
  
  $('#addChannelBtn').on('click', function() {
    if (channelCount >= 4) return;
    channelCount++;
    const colors = ['', '#c8f060', '#60d4f0', '#a082f0', '#f0a050'];
    const channelHtml = `
      <div class="channel-row" data-channel="${channelCount}">
        <div class="channel-color" style="background: ${colors[channelCount]};"></div>
        <input type="text" class="channel-name" value="Channel ${channelCount}" placeholder="Channel Name">
        <input type="number" class="channel-spend" value="0" min="0" max="9999999" step="1">
        <input type="number" class="channel-customers" value="0" min="0" max="9999999" step="1">
        <button class="channel-remove" title="Remove channel">×</button>
      </div>
    `;
    $('#channelsContainer').append(channelHtml);
    updateChannelControls();
    calculate();
  });
  
  $('#channelsContainer').on('click', '.channel-remove', function() {
    if (channelCount <= 1) return;
    $(this).closest('.channel-row').remove();
    channelCount--;
    updateChannelControls();
    calculate();
  });
  
  function updateChannelControls() {
    $('#addChannelBtn').toggle(channelCount < 4);
    $('#channelsContainer .channel-remove').toggleClass('hidden', channelCount <= 1);
  }
  updateChannelControls();
  
  $('#currency').on('input', calculate);
  
  $('#copyResults').on('click', function() {
    const inputs = getInputs();
    let text = `LTV:CAC Calculator Results\n`;
    text += `==========================\n\n`;
    text += `Customer Lifetime: ${$('#customerLifetime').text()}\n`;
    text += `LTV: ${$('#ltv').text()}\n`;
    text += `CAC: ${$('#cacResult').text()}\n`;
    text += `LTV:CAC Ratio: ${$('#ratio').text()}\n`;
    text += `CAC Payback: ${$('#payback').text()}\n`;
    text += `Monthly Gross Profit: ${$('#grossProfit').text()}\n`;
    
    if (mode === 'advanced') {
      text += `\nAdvanced Metrics:\n`;
      text += `  Adjusted LTV: ${$('#adjustedLtv').text()}\n`;
      text += `  Discounted LTV: ${$('#discountedLtv').text()}\n`;
      text += `  LTV:CAC (Discounted): ${$('#ratioDiscounted').text()}\n`;
      text += `  Annual LTV: ${$('#annualLtv').text()}\n`;
    }
    
    navigator.clipboard.writeText(text).then(() => {
      $('#copyResults').text('Copied!');
      setTimeout(() => { $('#copyResults').text('Copy Results'); }, 2000);
    });
  });
  
  $('#shareLink').on('click', function() {
    const params = new URLSearchParams();
    params.set('mode', mode);
    params.set('arpu', $('#arpu').val());
    params.set('grossMargin', $('#grossMargin').val());
    params.set('churnRate', $('#churnRate').val());
    params.set('cac', $('#cac').val());
    
    if (mode === 'advanced') {
      params.set('expansionMrr', $('#expansionMrr').val());
      params.set('supportCost', $('#supportCost').val());
      params.set('discountRate', $('#discountRate').val());
      params.set('channels', JSON.stringify(getChannels()));
    }
    
    params.set('currency', $('#currency').val());
    
    const url = window.location.pathname + '?' + params.toString();
    navigator.clipboard.writeText(window.location.origin + url).then(() => {
      $('#shareLink').text('Link Copied!');
      setTimeout(() => { $('#shareLink').text('Share Link'); }, 2000);
    });
  });
}

function loadFromUrl() {
  const params = new URLSearchParams(window.location.search);
  if (!params.has('arpu')) return;
  
  $('#arpu').val(params.get('arpu') || 99);
  $('#grossMargin').val(params.get('grossMargin') || 80);
  $('#churnRate').val(params.get('churnRate') || 2);
  $('#cac').val(params.get('cac') || 500);
  
  if (params.get('mode') === 'advanced') {
    $('.mode-btn').removeClass('active');
    $('.mode-btn[data-mode="advanced"]').addClass('active');
    mode = 'advanced';
    $('.advanced-inputs').show();
    $('.advanced-results').show();
    
    $('#expansionMrr').val(params.get('expansionMrr') || 0);
    $('#supportCost').val(params.get('supportCost') || 0);
    $('#discountRate').val(params.get('discountRate') || 0);
    
    if (params.has('channels')) {
      try {
        const channels = JSON.parse(params.get('channels'));
        if (Array.isArray(channels) && channels.length > 0) {
          const container = $('#channelsContainer');
          container.find('.channel-row').remove();
          channelCount = 0;
          channels.forEach((ch) => {
            channelCount++;
            const row = $(`
              <div class="channel-row" data-channel="${channelCount}">
                <div class="channel-color" style="background: ${CHANNEL_COLORS[channelCount - 1]};"></div>
                <input type="text" class="channel-name" value="${ch.name}" placeholder="Channel Name">
                <input type="number" class="channel-spend" value="${ch.spend}" min="0" max="9999999" step="1">
                <input type="number" class="channel-customers" value="${ch.customers}" min="0" max="9999999" step="1">
                <button class="channel-remove" title="Remove channel">×</button>
              </div>
            `);
            container.append(row);
          });
          updateChannelControls();
        }
      } catch (e) {}
    }
  }
  
  if (params.has('currency')) {
    $('#currency').val(params.get('currency'));
  }
}

function toggleExplanation() {
  $('.explanation-toggle').toggleClass('open');
  $('#explanationContent').toggleClass('open');
}

function updateChannelControls() {
  $('#addChannelBtn').toggle(channelCount < 4);
  $('#channelsContainer .channel-remove').toggleClass('hidden', channelCount <= 1);
}

$(function() {
  loadFromUrl();
  updateChannelControls();
  setupEventListeners();
  calculate();
});