const TIER_COLORS = ['#c8f060', '#60d4f0', '#a082f0'];

let mode = 'simple';
let tierCount = 2;
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

function getTierData() {
  const tiers = [];
  $('#tiersContainer .tier-row').each(function(i) {
    tiers.push({
      name: $(this).find('.tier-name').val() || `Tier ${i + 1}`,
      price: toNum($(this).find('.tier-price').val()),
      customers: toNum($(this).find('.tier-customers').val())
    });
  });
  return tiers;
}

function getAdvancedTierData() {
  const data = [];
  $('#advancedTiersContainer .advanced-tier-row').each(function(i) {
    data.push({
      newCustomers: toNum($(this).find('.adv-new').val()),
      churnedCustomers: toNum($(this).find('.adv-churned').val()),
      expansionMrr: toNum($(this).find('.adv-expansion').val()),
      discount: toNum($(this).find('.adv-discount').val())
    });
  });
  return data;
}

function getGlobalAdvancedData() {
  return {
    mrrLastMonth: toNum($('#mrrLastMonth').val()),
    annualDiscount: toNum($('#annualDiscount').val()),
    annualPercent: toNum($('#annualPercent').val())
  };
}

function calculate() {
  const tiers = getTierData();
  const advTiers = mode === 'advanced' ? getAdvancedTierData() : [];
  const global = getGlobalAdvancedData();
  
  let totalMrr = 0;
  let totalCustomers = 0;
  const tierMrrs = [];
  
  tiers.forEach((tier, i) => {
    const adv = mode === 'advanced' ? advTiers[i] : { discount: 0 };
    const discount = adv ? adv.discount : 0;
    const tierMrr = tier.price * tier.customers * (1 - discount / 100);
    tierMrrs.push(tierMrr);
    totalMrr += tierMrr;
    totalCustomers += tier.customers;
  });
  
  let totalExpansionMrr = 0;
  if (mode === 'advanced') {
    advTiers.forEach(t => { totalExpansionMrr += t.expansionMrr; });
  }
  totalMrr += totalExpansionMrr;
  
  const totalArr = totalMrr * 12;
  const arpu = totalCustomers > 0 ? totalMrr / totalCustomers : 0;
  
  $('#totalMrr').text(formatCurrency(totalMrr));
  $('#totalArr').text(formatCurrency(totalArr));
  $('#totalCustomers').text(totalCustomers.toLocaleString());
  $('#arpu').text(formatCurrencyPrecise(arpu));
  
  let newMrr = 0, churnedMrr = 0, netNewMrr = 0, mrrGrowth = null;
  let customerChurn = 0, revenueChurn = 0, impliedArr = 0;
  
  if (mode === 'advanced') {
    advTiers.forEach((t, i) => {
      newMrr += t.newCustomers * tiers[i].price;
      churnedMrr += t.churnedCustomers * tiers[i].price;
    });
    
    netNewMrr = newMrr - churnedMrr + totalExpansionMrr;
    
    const startingCustomers = tiers.reduce((s, t) => s + t.customers, 0);
    const totalChurned = advTiers.reduce((s, t) => s + Math.min(t.churnedCustomers, tiers[advTiers.indexOf(t)].customers), 0);
    customerChurn = startingCustomers > 0 ? (totalChurned / startingCustomers) * 100 : 0;
    
    const prevMrr = totalMrr - netNewMrr;
    revenueChurn = prevMrr > 0 ? (churnedMrr / prevMrr) * 100 : 0;
    
    if (global.mrrLastMonth > 0) {
      mrrGrowth = ((totalMrr - global.mrrLastMonth) / global.mrrLastMonth) * 100;
    }
    
    if (global.annualPercent > 0) {
      const annualCustomers = totalCustomers * (global.annualPercent / 100);
      const monthlyCustomers = totalCustomers - annualCustomers;
      const annualRevenue = annualCustomers * arpu * 12 * (1 - global.annualDiscount / 100);
      const monthlyRevenue = monthlyCustomers * arpu * 12;
      impliedArr = annualRevenue + monthlyRevenue;
    }
    
    $('#newMrr').text(formatCurrency(newMrr));
    $('#churnedMrr').text(formatCurrency(churnedMrr));
    $('#expansionMrr').text(formatCurrency(totalExpansionMrr));
    $('#netNewMrr').text(formatCurrency(netNewMrr));
    
    if (mrrGrowth !== null) {
      $('#mrrGrowth').text(mrrGrowth.toFixed(1) + '%');
      let badge = 'flat', label = 'Flat';
      if (mrrGrowth > 20) { badge = 'hypergrowth'; label = 'Hypergrowth'; }
      else if (mrrGrowth >= 10) { badge = 'strong'; label = 'Strong'; }
      else if (mrrGrowth >= 5) { badge = 'healthy'; label = 'Healthy'; }
      else if (mrrGrowth > 0) { badge = 'slow'; label = 'Slow'; }
      else if (mrrGrowth < 0) { badge = 'declining'; label = 'Declining'; }
      $('#growthBadge').attr('class', 'health-badge ' + badge).text(label);
    } else {
      $('#mrrGrowth').text('—');
      $('#growthBadge').attr('class', 'health-badge').text('—');
    }
    
    $('#customerChurn').text(customerChurn.toFixed(1) + '%');
    $('#revenueChurn').text(revenueChurn.toFixed(1) + '%');
    $('#impliedArr').text(impliedArr > 0 ? formatCurrency(impliedArr) : '$0');
    
    const lastMrr = global.mrrLastMonth || 0;
    $('#wfLastMrr').text(formatCurrency(lastMrr));
    $('#wfNewMrr').text('+' + formatCurrency(newMrr));
    $('#wfChurnedMrr').text('-' + formatCurrency(churnedMrr));
    $('#wfExpansionMrr').text('+' + formatCurrency(totalExpansionMrr));
    $('#wfCurrentMrr').text(formatCurrency(totalMrr));
    
    let warning = '';
    advTiers.forEach((t, i) => {
      if (t.churnedCustomers > tiers[i].customers) {
        warning = 'Churned customers cannot exceed starting customers.';
      }
    });
    $('#warningMessage').text(warning).toggle(!!warning);
  }
  
  updateRevenueMix(tierMrrs, totalMrr, tiers);
  updateChart(totalMrr, mrrGrowth, totalExpansionMrr);
}

function updateRevenueMix(tierMrrs, totalMrr, tiers) {
  const bar = $('#revenueMixBar');
  bar.empty();
  
  if (totalMrr === 0) {
    bar.css('background', 'var(--surface2)').html('<span style="color:var(--muted);font-family:var(--mono);font-size:0.7rem;padding:0 10px;">No revenue data</span>');
    return;
  }
  
  tierMrrs.forEach((mrr, i) => {
    if (mrr <= 0) return;
    const pct = (mrr / totalMrr) * 100;
    const seg = $('<div class="mix-segment"></div>')
      .css('width', pct + '%')
      .css('background', TIER_COLORS[i]);
    
    if (pct > 15) {
      const label = $('<span class="mix-label"></span>')
        .text(`${tiers[i].name.substring(0, 8)} ${pct.toFixed(0)}%`);
      seg.append(label);
    }
    bar.append(seg);
  });
}

function updateChart(currentMrr, growthRate, expansionMrr) {
  const ctx = document.getElementById('projectionChart').getContext('2d');
  const hasGrowth = growthRate !== null && growthRate > 0;
  
  $('#chartNote').toggle(!hasGrowth);
  
  const labels = Array.from({length: 12}, (_, i) => `Month ${i + 1}`);
  const projectedData = [];
  const baselineData = [];
  
  for (let i = 1; i <= 12; i++) {
    const baseMrr = currentMrr - expansionMrr;
    if (hasGrowth) {
      projectedData.push(currentMrr * Math.pow(1 + growthRate / 100, i));
      baselineData.push(baseMrr * Math.pow(1 + growthRate / 100, i));
    } else {
      projectedData.push(currentMrr);
      baselineData.push(baseMrr > 0 ? baseMrr : currentMrr);
    }
  }
  
  if (chart) chart.destroy();
  
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Projected MRR',
          data: projectedData,
          borderColor: '#c8f060',
          backgroundColor: 'rgba(200,240,96,0.1)',
          fill: true,
          tension: 0.3,
          pointRadius: 3,
          pointHoverRadius: 5
        },
        {
          label: 'Without Expansion',
          data: mode === 'advanced' ? baselineData : [],
          borderColor: '#60d4f0',
          borderDash: [5, 5],
          backgroundColor: 'transparent',
          tension: 0.3,
          pointRadius: 2,
          pointHoverRadius: 4
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
          titleFont: { family: "'Syne', sans-serif", weight: 700 },
          bodyFont: { family: "'DM Mono', monospace", size: 12 },
          callbacks: {
            label: function(ctx) {
              const val = ctx.raw;
              const growth = ((val - currentMrr) / currentMrr) * 100;
              return `${ctx.dataset.label}: ${formatCurrency(val)} (${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%)`;
            }
          }
        },
        annotation: {
          annotations: {
            line1: {
              type: 'line',
              yMin: currentMrr,
              yMax: currentMrr,
              borderColor: '#888580',
              borderWidth: 1,
              borderDash: [3, 3],
              label: { content: 'Current MRR', enabled: true, position: 'end', font: { size: 10, family: "'DM Mono', monospace" }, color: '#888580' }
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

function renderAdvancedTiers() {
  const container = $('#advancedTiersContainer');
  container.empty();
  const tiers = getTierData();
  
  tiers.forEach((tier, i) => {
    const row = $(`
      <div class="advanced-tier-row" data-tier="${i}">
        <div>
          <label>New Cust.</label>
          <input type="number" class="adv-new" value="0" min="0" max="9999999" step="1">
        </div>
        <div>
          <label>Churned</label>
          <input type="number" class="adv-churned" value="0" min="0" max="9999999" step="1">
        </div>
        <div>
          <label>Expansion MRR</label>
          <input type="number" class="adv-expansion" value="0" min="0" max="9999999" step="0.01">
        </div>
        <div>
          <label>Avg Discount %</label>
          <input type="number" class="adv-discount" value="0" min="0" max="100" step="0.1">
        </div>
      </div>
    `);
    container.append(row);
  });
  
  container.find('input').on('input', calculate);
}

function setupEventListeners() {
  $('.mode-btn').on('click', function() {
    $('.mode-btn').removeClass('active');
    $(this).addClass('active');
    mode = $(this).data('mode');
    $('.advanced-inputs').toggle(mode === 'advanced');
    $('.advanced-results').toggle(mode === 'advanced');
    
    if (mode === 'advanced') {
      renderAdvancedTiers();
    }
    calculate();
  });
  
  $('#tiersContainer').on('input', '.tier-name, .tier-price, .tier-customers', calculate);
  
  $('#addTierBtn').on('click', function() {
    if (tierCount >= 3) return;
    tierCount++;
    const colors = ['', '#c8f060', '#60d4f0', '#a082f0'];
    const tierHtml = `
      <div class="tier-row" data-tier="${tierCount}">
        <div class="tier-color" style="background: ${colors[tierCount]};"></div>
        <input type="text" class="tier-name" value="Tier ${tierCount}" placeholder="Tier Name">
        <input type="number" class="tier-price" value="0" min="0" max="9999999" step="0.01">
        <input type="number" class="tier-customers" value="0" min="0" max="9999999" step="1">
        <button class="tier-remove" title="Remove tier">×</button>
      </div>
    `;
    $('#tiersContainer').append(tierHtml);
    updateTierControls();
    if (mode === 'advanced') renderAdvancedTiers();
    calculate();
  });
  
  $('#tiersContainer').on('click', '.tier-remove', function() {
    if (tierCount <= 1) return;
    $(this).closest('.tier-row').remove();
    tierCount--;
    updateTierControls();
    if (mode === 'advanced') renderAdvancedTiers();
    calculate();
  });
  
  function updateTierControls() {
    $('#addTierBtn').toggle(tierCount < 3);
    $('#tiersContainer .tier-remove').toggleClass('hidden', tierCount <= 1);
  }
  updateTierControls();
  
  $('#currency, #mrrLastMonth, #annualDiscount, #annualPercent').on('input', calculate);
  
  $('#copyResults').on('click', function() {
    const tiers = getTierData();
    const global = getGlobalAdvancedData();
    let text = `MRR/ARR Calculator Results\n`;
    text += `==========================\n\n`;
    text += `Total MRR: ${$('#totalMrr').text()}\n`;
    text += `Total ARR: ${$('#totalArr').text()}\n`;
    text += `Total Customers: ${$('#totalCustomers').text()}\n`;
    text += `ARPU: ${$('#arpu').text()}\n`;
    
    if (mode === 'advanced') {
      text += `\nAdvanced Metrics:\n`;
      text += `  New MRR: ${$('#newMrr').text()}\n`;
      text += `  Churned MRR: ${$('#churnedMrr').text()}\n`;
      text += `  Expansion MRR: ${$('#expansionMrr').text()}\n`;
      text += `  Net New MRR: ${$('#netNewMrr').text()}\n`;
      text += `  Growth Rate: ${$('#mrrGrowth').text()}\n`;
      text += `  Customer Churn: ${$('#customerChurn').text()}\n`;
    }
    
    navigator.clipboard.writeText(text).then(() => {
      $('#copyResults').text('Copied!');
      setTimeout(() => { $('#copyResults').text('Copy Results'); }, 2000);
    });
  });
  
  $('#shareLink').on('click', function() {
    const params = new URLSearchParams();
    params.set('mode', mode);
    params.set('tiers', JSON.stringify(getTierData()));
    if (mode === 'advanced') {
      params.set('advTiers', JSON.stringify(getAdvancedTierData()));
      params.set('mrrLastMonth', $('#mrrLastMonth').val());
      params.set('annualDiscount', $('#annualDiscount').val());
      params.set('annualPercent', $('#annualPercent').val());
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
  if (!params.has('tiers')) return;
  
  try {
    const tiers = JSON.parse(params.get('tiers'));
    if (Array.isArray(tiers)) {
      const container = $('#tiersContainer');
      container.find('.tier-row').remove();
      tierCount = 0;
      tiers.forEach((tier, i) => {
        tierCount++;
        const colors = ['', '#c8f060', '#60d4f0', '#a082f0'];
        const row = $(`
          <div class="tier-row" data-tier="${tierCount}">
            <div class="tier-color" style="background: ${colors[tierCount]};"></div>
            <input type="text" class="tier-name" value="${tier.name}" placeholder="Tier Name">
            <input type="number" class="tier-price" value="${tier.price}" min="0" max="9999999" step="0.01">
            <input type="number" class="tier-customers" value="${tier.customers}" min="0" max="9999999" step="1">
            <button class="tier-remove" title="Remove tier">×</button>
          </div>
        `);
        container.append(row);
      });
      
      if (params.get('mode') === 'advanced') {
        $('.mode-btn').removeClass('active');
        $('.mode-btn[data-mode="advanced"]').addClass('active');
        mode = 'advanced';
        $('.advanced-inputs').show();
        $('.advanced-results').show();
        
        if (params.has('advTiers')) {
          const advTiers = JSON.parse(params.get('advTiers'));
          $('#mrrLastMonth').val(params.get('mrrLastMonth') || 0);
          $('#annualDiscount').val(params.get('annualDiscount') || 0);
          $('#annualPercent').val(params.get('annualPercent') || 0);
        }
      }
      
      if (params.has('currency')) {
        $('#currency').val(params.get('currency'));
      }
      
      updateTierControls = () => {
        $('#addTierBtn').toggle(tierCount < 3);
        $('#tiersContainer .tier-remove').toggleClass('hidden', tierCount <= 1);
      };
    }
  } catch (e) {}
}

function toggleExplanation() {
  $('.explanation-toggle').toggleClass('open');
  $('#explanationContent').toggleClass('open');
}

$(function() {
  loadFromUrl();
  setupEventListeners();
  calculate();
});