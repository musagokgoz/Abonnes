const RATES_CACHE_KEY = 'abonnes_exchange_rates_v2';

export const SUPPORTED_CURRENCIES = ['TRY', 'USD', 'EUR', 'GBP'];

const FALLBACK_TRY_RATES = { TRY: 1, USD: 34.5, EUR: 37.8, GBP: 44.5 };

export function getSavedPrimaryCurrency(userId) {
  try {
    const saved = localStorage.getItem(`abonnes_primary_currency_${userId}`);
    return SUPPORTED_CURRENCIES.includes(saved) ? saved : 'TRY';
  } catch {
    return 'TRY';
  }
}

export function savePrimaryCurrency(userId, currency) {
  if (SUPPORTED_CURRENCIES.includes(currency)) {
    localStorage.setItem(`abonnes_primary_currency_${userId}`, currency);
  }
}

function getFallbackRates(baseCurrency) {
  const baseInTRY = FALLBACK_TRY_RATES[baseCurrency] || 1;
  return Object.fromEntries(
    SUPPORTED_CURRENCIES.map((currency) => [currency, FALLBACK_TRY_RATES[currency] / baseInTRY])
  );
}

function readCachedRates(baseCurrency) {
  try {
    const cached = JSON.parse(localStorage.getItem(RATES_CACHE_KEY));
    return cached?.base === baseCurrency && cached.rates ? cached : null;
  } catch {
    return null;
  }
}

export async function getExchangeRates(baseCurrency = 'TRY') {
  const cached = readCachedRates(baseCurrency);
  const fallback = { base: baseCurrency, rates: getFallbackRates(baseCurrency), source: 'fallback' };

  try {
    const response = await fetch(`https://open.er-api.com/v6/latest/${baseCurrency}`);
    if (!response.ok) throw new Error(`Kur servisi HTTP ${response.status}`);
    const data = await response.json();
    if (data.result !== 'success' || !data.rates) throw new Error('Kur servisi geçersiz yanıt verdi.');

    const rates = Object.fromEntries(
      SUPPORTED_CURRENCIES.map((currency) => [currency, Number(data.rates[currency]) || fallback.rates[currency]])
    );
    const result = { base: baseCurrency, rates, source: 'live', updatedAt: data.time_last_update_unix };
    localStorage.setItem(RATES_CACHE_KEY, JSON.stringify(result));
    return result;
  } catch (error) {
    console.warn('Canlı döviz kuru alınamadı:', error);
    return cached || fallback;
  }
}

export function convertCurrency(amount, sourceCurrency, targetCurrency, rates) {
  const numericAmount = Number(amount) || 0;
  const source = sourceCurrency?.toUpperCase() || 'TRY';
  const target = targetCurrency?.toUpperCase() || 'TRY';
  if (source === target) return numericAmount;

  if (rates?.[source] && rates?.[target]) {
    return numericAmount * (rates[target] / rates[source]);
  }

  return numericAmount * ((FALLBACK_TRY_RATES[source] || 1) / (FALLBACK_TRY_RATES[target] || 1));
}

export function formatCurrency(amount, currency = 'TRY') {
  if (isNaN(amount) || amount === null || amount === undefined) return `0 ${currency}`;

  const symbols = { TRY: '₺', USD: '$', EUR: '€', GBP: '£' };
  const symbol = symbols[currency.toUpperCase()] || currency;
  const formattedNumber = Number(amount).toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${formattedNumber} ${symbol}`;
}
