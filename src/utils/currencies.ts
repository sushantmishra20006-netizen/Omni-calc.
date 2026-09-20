/**
 * @license
 * Copyright (c) 2026 OmniCalc Intellectual Holdings & Sushant Mishra.
 * Complete Global Currencies Registry & Precision Formatting Engine.
 */

export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  locale: string;
  region: 'Americas' | 'Europe' | 'Asia-Pacific' | 'Middle East & Africa' | 'Global & Digital';
  decimals?: number;
}

export const ALL_CURRENCIES: CurrencyInfo[] = [
  // --- Americas ---
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', locale: 'en-US', region: 'Americas', decimals: 2 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', flag: '🇨🇦', locale: 'en-CA', region: 'Americas', decimals: 2 },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'Mex$', flag: '🇲🇽', locale: 'es-MX', region: 'Americas', decimals: 2 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷', locale: 'pt-BR', region: 'Americas', decimals: 2 },
  { code: 'ARS', name: 'Argentine Peso', symbol: 'AR$', flag: '🇦🇷', locale: 'es-AR', region: 'Americas', decimals: 2 },
  { code: 'CLP', name: 'Chilean Peso', symbol: 'CLP$', flag: '🇨🇱', locale: 'es-CL', region: 'Americas', decimals: 0 },
  { code: 'COP', name: 'Colombian Peso', symbol: 'COL$', flag: '🇨🇴', locale: 'es-CO', region: 'Americas', decimals: 0 },
  { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/', flag: '🇵🇪', locale: 'es-PE', region: 'Americas', decimals: 2 },
  { code: 'UYU', name: 'Uruguayan Peso', symbol: '$U', flag: '🇺🇾', locale: 'es-UY', region: 'Americas', decimals: 2 },
  { code: 'CRC', name: 'Costa Rican Colón', symbol: '₡', flag: '🇨🇷', locale: 'es-CR', region: 'Americas', decimals: 0 },
  { code: 'DOP', name: 'Dominican Peso', symbol: 'RD$', flag: '🇩🇴', locale: 'es-DO', region: 'Americas', decimals: 2 },
  { code: 'GTQ', name: 'Guatemalan Quetzal', symbol: 'Q', flag: '🇬🇹', locale: 'es-GT', region: 'Americas', decimals: 2 },
  { code: 'PAB', name: 'Panamanian Balboa', symbol: 'B/.', flag: '🇵🇦', locale: 'es-PA', region: 'Americas', decimals: 2 },
  { code: 'JMD', name: 'Jamaican Dollar', symbol: 'J$', flag: '🇯🇲', locale: 'en-JM', region: 'Americas', decimals: 2 },
  { code: 'TTD', name: 'Trinidad & Tobago Dollar', symbol: 'TT$', flag: '🇹🇹', locale: 'en-TT', region: 'Americas', decimals: 2 },

  // --- Europe ---
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', locale: 'de-DE', region: 'Europe', decimals: 2 },
  { code: 'GBP', name: 'British Pound Sterling', symbol: '£', flag: '🇬🇧', locale: 'en-GB', region: 'Europe', decimals: 2 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭', locale: 'de-CH', region: 'Europe', decimals: 2 },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪', locale: 'sv-SE', region: 'Europe', decimals: 2 },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴', locale: 'nb-NO', region: 'Europe', decimals: 2 },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰', locale: 'da-DK', region: 'Europe', decimals: 2 },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', flag: '🇵🇱', locale: 'pl-PL', region: 'Europe', decimals: 2 },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', flag: '🇨🇿', locale: 'cs-CZ', region: 'Europe', decimals: 2 },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', flag: '🇭🇺', locale: 'hu-HU', region: 'Europe', decimals: 0 },
  { code: 'RON', name: 'Romanian Leu', symbol: 'lei', flag: '🇷🇴', locale: 'ro-RO', region: 'Europe', decimals: 2 },
  { code: 'BGN', name: 'Bulgarian Lev', symbol: 'лв', flag: '🇧🇬', locale: 'bg-BG', region: 'Europe', decimals: 2 },
  { code: 'ISK', name: 'Icelandic Króna', symbol: 'kr', flag: '🇮🇸', locale: 'is-IS', region: 'Europe', decimals: 0 },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷', locale: 'tr-TR', region: 'Europe', decimals: 2 },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺', locale: 'ru-RU', region: 'Europe', decimals: 2 },
  { code: 'UAH', name: 'Ukrainian Hryvnia', symbol: '₴', flag: '🇺🇦', locale: 'uk-UA', region: 'Europe', decimals: 2 },
  { code: 'RSD', name: 'Serbian Dinar', symbol: 'дин.', flag: '🇷🇸', locale: 'sr-RS', region: 'Europe', decimals: 2 },

  // --- Asia & Pacific ---
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳', locale: 'en-IN', region: 'Asia-Pacific', decimals: 2 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', locale: 'ja-JP', region: 'Asia-Pacific', decimals: 0 },
  { code: 'CNY', name: 'Chinese Yuan Renminbi', symbol: '¥', flag: '🇨🇳', locale: 'zh-CN', region: 'Asia-Pacific', decimals: 2 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺', locale: 'en-AU', region: 'Asia-Pacific', decimals: 2 },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿', locale: 'en-NZ', region: 'Asia-Pacific', decimals: 2 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬', locale: 'en-SG', region: 'Asia-Pacific', decimals: 2 },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰', locale: 'zh-HK', region: 'Asia-Pacific', decimals: 2 },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷', locale: 'ko-KR', region: 'Asia-Pacific', decimals: 0 },
  { code: 'TWD', name: 'New Taiwan Dollar', symbol: 'NT$', flag: '🇹🇼', locale: 'zh-TW', region: 'Asia-Pacific', decimals: 2 },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭', locale: 'th-TH', region: 'Asia-Pacific', decimals: 2 },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩', locale: 'id-ID', region: 'Asia-Pacific', decimals: 0 },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾', locale: 'ms-MY', region: 'Asia-Pacific', decimals: 2 },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', flag: '🇵🇭', locale: 'en-PH', region: 'Asia-Pacific', decimals: 2 },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', flag: '🇻🇳', locale: 'vi-VN', region: 'Asia-Pacific', decimals: 0 },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨', flag: '🇵🇰', locale: 'ur-PK', region: 'Asia-Pacific', decimals: 2 },
  { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳', flag: '🇧🇩', locale: 'bn-BD', region: 'Asia-Pacific', decimals: 2 },
  { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs', flag: '🇱🇰', locale: 'si-LK', region: 'Asia-Pacific', decimals: 2 },
  { code: 'NPR', name: 'Nepalese Rupee', symbol: 'Rs', flag: '🇳🇵', locale: 'ne-NP', region: 'Asia-Pacific', decimals: 2 },
  { code: 'KZT', name: 'Kazakhstani Tenge', symbol: '₸', flag: '🇰🇿', locale: 'kk-KZ', region: 'Asia-Pacific', decimals: 2 },

  // --- Middle East & Africa ---
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪', locale: 'ar-AE', region: 'Middle East & Africa', decimals: 2 },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', flag: '🇸🇦', locale: 'ar-SA', region: 'Middle East & Africa', decimals: 2 },
  { code: 'QAR', name: 'Qatari Riyal', symbol: 'QR', flag: '🇶🇦', locale: 'ar-QA', region: 'Middle East & Africa', decimals: 2 },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'KD', flag: '🇰🇼', locale: 'ar-KW', region: 'Middle East & Africa', decimals: 3 },
  { code: 'BHD', name: 'Bahraini Dinar', symbol: 'BD', flag: '🇧🇭', locale: 'ar-BH', region: 'Middle East & Africa', decimals: 3 },
  { code: 'OMR', name: 'Omani Rial', symbol: 'RO', flag: '🇴🇲', locale: 'ar-OM', region: 'Middle East & Africa', decimals: 3 },
  { code: 'ILS', name: 'Israeli New Shekel', symbol: '₪', flag: '🇮🇱', locale: 'he-IL', region: 'Middle East & Africa', decimals: 2 },
  { code: 'JOD', name: 'Jordanian Dinar', symbol: 'JD', flag: '🇯🇴', locale: 'ar-JO', region: 'Middle East & Africa', decimals: 3 },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', flag: '🇪🇬', locale: 'ar-EG', region: 'Middle East & Africa', decimals: 2 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦', locale: 'en-ZA', region: 'Middle East & Africa', decimals: 2 },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬', locale: 'en-NG', region: 'Middle East & Africa', decimals: 2 },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', flag: '🇰🇪', locale: 'en-KE', region: 'Middle East & Africa', decimals: 2 },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵', flag: '🇬🇭', locale: 'en-GH', region: 'Middle East & Africa', decimals: 2 },
  { code: 'MAD', name: 'Moroccan Dirham', symbol: 'DH', flag: '🇲🇦', locale: 'ar-MA', region: 'Middle East & Africa', decimals: 2 },
  { code: 'TND', name: 'Tunisian Dinar', symbol: 'DT', flag: '🇹🇳', locale: 'ar-TN', region: 'Middle East & Africa', decimals: 3 },
  { code: 'DZD', name: 'Algerian Dinar', symbol: 'DA', flag: '🇩🇿', locale: 'ar-DZ', region: 'Middle East & Africa', decimals: 2 },
  { code: 'ETB', name: 'Ethiopian Birr', symbol: 'Br', flag: '🇪🇹', locale: 'am-ET', region: 'Middle East & Africa', decimals: 2 },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh', flag: '🇺🇬', locale: 'en-UG', region: 'Middle East & Africa', decimals: 0 },
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh', flag: '🇹🇿', locale: 'sw-TZ', region: 'Middle East & Africa', decimals: 0 },

  // --- Global & Digital Assets ---
  { code: 'BTC', name: 'Bitcoin Standard', symbol: '₿', flag: '🪙', locale: 'en-US', region: 'Global & Digital', decimals: 6 },
  { code: 'ETH', name: 'Ethereum Standard', symbol: 'Ξ', flag: '🔷', locale: 'en-US', region: 'Global & Digital', decimals: 4 },
  { code: 'USDT', name: 'Tether USD', symbol: '₮', flag: '🟢', locale: 'en-US', region: 'Global & Digital', decimals: 2 },
  { code: 'SOL', name: 'Solana Standard', symbol: '◎', flag: '🟣', locale: 'en-US', region: 'Global & Digital', decimals: 2 },
];

export const POPULAR_CURRENCY_CODES = [
  'USD',
  'EUR',
  'GBP',
  'INR',
  'JPY',
  'CAD',
  'AUD',
  'CHF',
  'CNY',
  'AED',
  'SGD',
  'SAR',
];

export const DEFAULT_CURRENCY: CurrencyInfo = ALL_CURRENCIES[0]; // USD

/**
 * Look up currency by code (case-insensitive)
 */
export function getCurrencyByCode(code: string): CurrencyInfo {
  const upper = code.toUpperCase();
  return ALL_CURRENCIES.find((c) => c.code === upper) || DEFAULT_CURRENCY;
}

/**
 * Format numeric value in the specified currency
 */
export function formatValueInCurrency(
  value: number,
  currency: CurrencyInfo,
  options?: {
    decimals?: number;
    showCode?: boolean;
    compact?: boolean;
  }
): string {
  if (isNaN(value)) return `${currency.symbol}0.00`;

  const dec = options?.decimals !== undefined ? options.decimals : (currency.decimals ?? 2);
  const isNegative = value < 0;
  const absValue = Math.abs(value);

  let formattedNum = '';

  try {
    if (options?.compact && absValue >= 1000) {
      formattedNum = new Intl.NumberFormat(currency.locale, {
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(absValue);
    } else {
      formattedNum = new Intl.NumberFormat(currency.locale, {
        minimumFractionDigits: dec,
        maximumFractionDigits: dec,
      }).format(absValue);
    }
  } catch {
    // Fallback if locale is unsupported
    formattedNum = absValue.toLocaleString('en-US', {
      minimumFractionDigits: dec,
      maximumFractionDigits: dec,
    });
  }

  // Symbol placement
  const prefix = isNegative ? '-' : '';
  const baseString = `${prefix}${currency.symbol}${formattedNum}`;

  if (options?.showCode) {
    return `${baseString} ${currency.code}`;
  }

  return baseString;
}
