/**
 * Para birimi çevirici ve formatlayıcı
 * Yabancı para birimli SaaS araçlarının (USD/EUR) TL karşılığını hesaplar.
 */

// Güncel yaklaşık döviz kurları (İleride serbest API entegrasyonu yapılabilir)
export const EXCHANGE_RATES = {
  TRY: 1.0,
  USD: 34.50,
  EUR: 37.80,
  GBP: 44.50,
};

/**
 * Tutarı TRY cinsine çevirir
 */
export function convertToTRY(amount, currency = 'TRY') {
  const rate = EXCHANGE_RATES[currency.toUpperCase()] || 1.0;
  return amount * rate;
}

/**
 * Para birimini yerel simgesiyle biçimlendirir
 */
export function formatCurrency(amount, currency = 'TRY') {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '0 ₺';
  }

  const symbols = {
    TRY: '₺',
    USD: '$',
    EUR: '€',
    GBP: '£',
  };

  const symbol = symbols[currency.toUpperCase()] || currency;
  const formattedNumber = Number(amount).toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${formattedNumber} ${symbol}`;
}
