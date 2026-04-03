// Common Tool Functions - Shared across all calculator tools

// Clipboard polyfill for non-HTTPS or restricted environments
(function() {
  if (!navigator.clipboard) {
    navigator.clipboard = {
      writeText: function(text) {
        return new Promise(function(resolve, reject) {
          var textarea = document.createElement('textarea');
          textarea.value = text;
          textarea.style.position = 'fixed';
          textarea.style.left = '-9999px';
          document.body.appendChild(textarea);
          textarea.select();
          try {
            document.execCommand('copy');
            resolve();
          } catch (err) {
            reject(err);
          }
          document.body.removeChild(textarea);
        });
      }
    };
  }
})();

// Currency formatting
const CURRENCY_SYMBOLS = {
  USD: '$', EUR: '€', GBP: '£', BDT: '৳', INR: '₹', CAD: 'C$', AUD: 'A$', SGD: 'S$'
};

function getCurrencySymbol(currencySelect) {
  const currencyMap = CURRENCY_SYMBOLS;
  const currency = currencySelect ? $(currencySelect).val() : 'USD';
  return currencyMap[currency] || '$';
}

function formatCurrency(value, symbol) {
  const s = symbol || '$';
  return s + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatCurrencySimple(value, symbol) {
  const s = symbol || '$';
  return s + value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function formatNumber(value) {
  return Math.round(value).toLocaleString('en-US');
}

function toNum(val) {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
}

// Toggle explanation panel
function toggleExplanation() {
  $('.explanation-toggle').toggleClass('open');
  $('#explanationContent').toggleClass('open');
}

// Get URL params for sharing
function getUrlParams() {
  return new URLSearchParams(window.location.search);
}

// Load from URL params
function loadFromParams(paramMap) {
  const params = new URLSearchParams(window.location.search);
  Object.keys(paramMap).forEach(function(key) {
    if (params.has(key)) {
      const selector = paramMap[key];
      $(selector).val(params.get(key));
    }
  });
}

// Copy to clipboard
function copyToClipboard(text, button) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function() {
      const $btn = $(button);
      const originalText = $btn.text();
      $btn.text('Copied!');
      setTimeout(function() {
        $btn.text(originalText);
      }, 2000);
    }).catch(function() {
      fallbackCopy(text, button);
    });
  } else {
    fallbackCopy(text, button);
  }
}

function fallbackCopy(text, button) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    const $btn = $(button);
    const originalText = $btn.text();
    $btn.text('Copied!');
    setTimeout(function() {
      $btn.text(originalText);
    }, 2000);
  } catch (err) {
    alert('Unable to copy. Please copy manually.');
  }
  document.body.removeChild(textarea);
}

// Generate shareable URL
function generateShareUrl(paramObj) {
  const params = new URLSearchParams();
  Object.keys(paramObj).forEach(function(key) {
    if (paramObj[key] !== undefined && paramObj[key] !== null && paramObj[key] !== '') {
      params.set(key, paramObj[key]);
    }
  });
  return window.location.pathname + '?' + params.toString();
}

// Chart default options
const CHART_COLORS = {
  accent: '#c8f060',
  accent2: '#60d4f0',
  purple: '#a082f0',
  warning: '#f0a040',
  danger: '#f05050',
  muted: '#888580'
};

function getChartDefaults() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          font: { family: 'var(--mono)', size: 11 },
          color: '#888580'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleFont: { family: 'var(--mono)', size: 12 },
        bodyFont: { family: 'var(--mono)', size: 11 },
        padding: 12
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { font: { family: 'var(--mono)', size: 10 }, color: '#888580' }
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { font: { family: 'var(--mono)', size: 10 }, color: '#888580' }
      }
    }
  };
}

// Health badge helpers
function getChurnHealthBadge(rate) {
  if (rate < 0.5) return { label: 'Exceptional', class: 'exceptional' };
  if (rate < 1) return { label: 'Healthy', class: 'healthy' };
  if (rate < 2) return { label: 'Acceptable', class: 'acceptable' };
  if (rate < 5) return { label: 'Moderate', class: 'moderate' };
  if (rate < 10) return { label: 'Critical', class: 'critical' };
  return { label: 'Emergency', class: 'emergency' };
}

function getNrrHealthBadge(nrr) {
  if (nrr > 120) return { label: 'World-Class', class: 'world-class' };
  if (nrr > 110) return { label: 'Excellent', class: 'excellent' };
  if (nrr >= 100) return { label: 'Healthy', class: 'healthy' };
  if (nrr >= 90) return { label: 'Concerning', class: 'concerning' };
  return { label: 'Dangerous', class: 'dangerous' };
}

function getRunwayHealthBadge(months) {
  if (months > 24) return { label: 'Safe', class: 'safe' };
  if (months >= 18) return { label: 'Comfortable', class: 'comfortable' };
  if (months >= 12) return { label: 'Plan ahead', class: 'plan' };
  if (months >= 6) return { label: 'Start fundraising', class: 'fundraise' };
  return { label: 'Critical', class: 'critical' };
}

function getGrowthHealthBadge(rate) {
  if (rate > 20) return { label: 'Hypergrowth', class: 'hypergrowth' };
  if (rate >= 10) return { label: 'Strong', class: 'strong' };
  if (rate >= 5) return { label: 'Healthy', class: 'healthy' };
  if (rate >= 1) return { label: 'Slow', class: 'slow' };
  if (rate === 0) return { label: 'Flat', class: 'flat' };
  return { label: 'Declining', class: 'declining' };
}

// Compound calculation for projections
function calculateCompound(startValue, rate, periods) {
  return startValue * Math.pow(1 + rate / 100, periods);
}

// Debounce function for input handlers
function debounce(func, wait) {
  let timeout;
  return function executedFunction() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      func.apply(context, args);
    }, wait);
  };
}

// Initialize tool on document ready
$(document).ready(function() {
  // Auto-initialize if calculate function exists
  if (typeof calculate === 'function') {
    calculate();
  }
});