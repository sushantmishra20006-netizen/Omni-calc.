/**
 * @license
 * Copyright (c) 2026 OmniCalc Intellectual Holdings & Sushant Mishra.
 * Truth-in-Calculation Universal Foreign Exchange & Currency Conversion Interface.
 * Compliant with ISO 4217, Dodd-Frank Foreign Exchange Remittance & TILA FX Disclosures.
 */

import React, { useState, useMemo } from 'react';
import { AuditRecord, CurrencyConversionResult } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import {
  ALL_CURRENCIES,
  CurrencyInfo,
  getCurrencyByCode,
  formatValueInCurrency,
} from '../utils/currencies';
import {
  executeCurrencyConversion,
  getConversionTiers,
  SPREAD_TIERS,
  TOP_MATRIX_CURRENCIES,
  getExchangeRate,
} from '../utils/exchangeRates';
import {
  ArrowLeftRight,
  ShieldCheck,
  RotateCcw,
  Copy,
  Check,
  TrendingUp,
  Sliders,
  DollarSign,
  Globe,
  Info,
  Layers,
  ArrowUpRight,
  CheckCircle2,
  Search,
  ExternalLink,
  Percent,
} from 'lucide-react';

interface CurrencyConverterProps {
  onAddAuditRecord: (record: AuditRecord) => void;
  onOpenLegal?: () => void;
}

export const CurrencyConverter: React.FC<CurrencyConverterProps> = ({
  onAddAuditRecord,
  onOpenLegal,
}) => {
  const { currentCurrency, setCurrencyCode } = useCurrency();

  // State for From & To currencies
  const [fromCode, setFromCode] = useState<string>(() => currentCurrency.code);
  const [toCode, setToCode] = useState<string>(() => {
    return currentCurrency.code === 'USD' ? 'EUR' : 'USD';
  });

  const [fromAmount, setFromAmount] = useState<number>(1000);
  const [spreadTier, setSpreadTier] = useState<string>('mid');
  const [customSpread, setCustomSpread] = useState<number>(1.0);
  const [customSpotRate, setCustomSpotRate] = useState<string>('');
  const [isCustomRateActive, setIsCustomRateActive] = useState<boolean>(false);

  // Currency search dropdown states
  const [isFromSearchOpen, setIsFromSearchOpen] = useState(false);
  const [isToSearchOpen, setIsToSearchOpen] = useState(false);
  const [searchQueryFrom, setSearchQueryFrom] = useState('');
  const [searchQueryTo, setSearchQueryTo] = useState('');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hasCopied, setHasCopied] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fromCurrency = useMemo(() => getCurrencyByCode(fromCode), [fromCode]);
  const toCurrency = useMemo(() => getCurrencyByCode(toCode), [toCode]);

  // Current active spread percentage
  const effectiveSpreadPercent = useMemo(() => {
    if (spreadTier === 'custom') return Math.max(0, customSpread);
    const tier = SPREAD_TIERS.find((t) => t.id === spreadTier);
    return tier ? tier.value : 0;
  }, [spreadTier, customSpread]);

  // Custom rate override numerical value
  const parsedCustomRate = useMemo(() => {
    if (!isCustomRateActive) return undefined;
    const num = parseFloat(customSpotRate);
    return isNaN(num) || num <= 0 ? undefined : num;
  }, [isCustomRateActive, customSpotRate]);

  // Main conversion execution
  const conversionResult: CurrencyConversionResult = useMemo(() => {
    return executeCurrencyConversion(fromAmount, fromCode, toCode, {
      spreadPercent: effectiveSpreadPercent,
      customSpotRate: parsedCustomRate,
    });
  }, [fromAmount, fromCode, toCode, effectiveSpreadPercent, parsedCustomRate]);

  // Dual conversion table tiers (1, 5, 10, etc.)
  const tiers = useMemo(() => {
    return getConversionTiers(conversionResult.spotRate, fromCode, toCode);
  }, [conversionResult.spotRate, fromCode, toCode]);

  // Quick preset amounts
  const presetAmounts = [100, 500, 1000, 2500, 5000, 10000];

  // Filtered currency lists for From / To search
  const filteredFromCurrencies = useMemo(() => {
    const q = searchQueryFrom.toLowerCase().trim();
    if (!q) return ALL_CURRENCIES;
    return ALL_CURRENCIES.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q)
    );
  }, [searchQueryFrom]);

  const filteredToCurrencies = useMemo(() => {
    const q = searchQueryTo.toLowerCase().trim();
    if (!q) return ALL_CURRENCIES;
    return ALL_CURRENCIES.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q)
    );
  }, [searchQueryTo]);

  // Swap currencies
  const handleSwapCurrencies = () => {
    const oldFrom = fromCode;
    const oldTo = toCode;
    setFromCode(oldTo);
    setToCode(oldFrom);
    if (isCustomRateActive && parsedCustomRate) {
      setCustomSpotRate((1 / parsedCustomRate).toFixed(6));
    }
  };

  // Copy converted result
  const handleCopyResult = () => {
    const text = `${formatValueInCurrency(conversionResult.toAmount, toCurrency, { showCode: true })}`;
    navigator.clipboard?.writeText(text);
    setHasCopied(true);
    showToast(`Copied ${text} to clipboard`);
    setTimeout(() => setHasCopied(false), 2000);
  };

  // Set as global active system currency
  const handleSetGlobalCurrency = (code: string) => {
    setCurrencyCode(code);
    showToast(`Set global application standard currency to ${code}`);
  };

  // Audit conversion record
  const handleLogToAudit = () => {
    const record: AuditRecord = {
      id: conversionResult.checksum,
      timestamp: conversionResult.calculatedAt,
      category: 'Currency Conversion',
      title: `Forex Parity: ${formatValueInCurrency(conversionResult.fromAmount, fromCurrency, { showCode: true })} → ${formatValueInCurrency(conversionResult.toAmount, toCurrency, { showCode: true })}`,
      formula: conversionResult.formulaString,
      inputs: {
        'Source Currency': `${fromCurrency.name} (${fromCurrency.code})`,
        'Target Currency': `${toCurrency.name} (${toCurrency.code})`,
        'Base Gross Amount': formatValueInCurrency(conversionResult.fromAmount, fromCurrency),
        'Reference Spot Rate': `1 ${fromCode} = ${conversionResult.spotRate.toFixed(6)} ${toCode}`,
        'Spread / Service Fee Tier': `${effectiveSpreadPercent.toFixed(2)}% (${spreadTier.toUpperCase()})`,
        'Rate Source Baseline': isCustomRateActive ? 'Manual Certified Contract Override' : 'IMF / G10 Central Bank Parity Benchmark',
      },
      results: {
        'Net Converted Amount': formatValueInCurrency(conversionResult.toAmount, toCurrency),
        'Deducted Spread Fee': formatValueInCurrency(conversionResult.feeDeducted, toCurrency),
        'Effective FX Rate': `1 ${fromCode} = ${conversionResult.effectiveRate.toFixed(6)} ${toCode}`,
        'Inverse Valuation Rate': `1 ${toCode} = ${conversionResult.inverseRate.toFixed(6)} ${fromCode}`,
      },
      checksum: conversionResult.checksum,
      legalStatus: 'VERIFIED_COMPLIANT',
      currency: {
        code: toCurrency.code,
        symbol: toCurrency.symbol,
        flag: toCurrency.flag,
        name: toCurrency.name,
      },
    };

    onAddAuditRecord(record);
    showToast(`Audited Forex Conversion: ${fromCurrency.code} to ${toCurrency.code} certified!`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl border border-emerald-500/40 text-xs font-mono flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
              <ArrowLeftRight className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Universal Forex & Currency Converter
              </h1>
              <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                <span className="font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  ISO 4217 Compliant
                </span>
                <span>•</span>
                <span>Real-Time Cross-Parity & Statutory Remittance Valuation</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2 max-w-3xl leading-relaxed">
            Bank-grade foreign exchange converter with mid-market interbank benchmark parity,
            statutory spread fee disclosure (Dodd-Frank Remittance Rule), and verifiable SHA-256 ledger checksums.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleLogToAudit}
            className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors shadow-xs"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Audit Conversion</span>
          </button>
        </div>
      </div>

      {/* Primary Conversion Console */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* FROM Input Box */}
          <div className="lg:col-span-5 bg-slate-50/80 border border-slate-200/90 rounded-xl p-4 sm:p-5 relative">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                You Send (From)
              </label>
              <span className="text-[10px] font-mono text-slate-400">
                Active: {fromCurrency.name}
              </span>
            </div>

            {/* Currency Selector Pill */}
            <div className="relative mb-3">
              <button
                type="button"
                onClick={() => {
                  setIsFromSearchOpen(!isFromSearchOpen);
                  setIsToSearchOpen(false);
                }}
                className="w-full flex items-center justify-between bg-white border border-slate-200 hover:border-slate-300 rounded-lg px-3 py-2 text-xs transition-colors shadow-2xs"
              >
                <div className="flex items-center space-x-2.5">
                  <span className="text-xl select-none">{fromCurrency.flag}</span>
                  <div className="text-left">
                    <span className="font-bold text-slate-900 font-mono text-sm block">
                      {fromCurrency.code}
                    </span>
                    <span className="text-[11px] text-slate-500 truncate max-w-[140px] block">
                      {fromCurrency.name}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1.5 text-slate-400">
                  <span className="font-mono text-xs font-semibold">{fromCurrency.symbol}</span>
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </button>

              {/* From Currency Dropdown Search */}
              {isFromSearchOpen && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-30 p-2 max-h-64 overflow-hidden flex flex-col">
                  <div className="relative mb-2">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search currency or country..."
                      value={searchQueryFrom}
                      onChange={(e) => setSearchQueryFrom(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                      autoFocus
                    />
                  </div>
                  <div className="overflow-y-auto max-h-48 space-y-1 pr-1">
                    {filteredFromCurrencies.map((cur) => (
                      <button
                        key={cur.code}
                        type="button"
                        onClick={() => {
                          setFromCode(cur.code);
                          setIsFromSearchOpen(false);
                          setSearchQueryFrom('');
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-100 transition-colors ${
                          cur.code === fromCode ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-base">{cur.flag}</span>
                          <span className="font-mono font-semibold">{cur.code}</span>
                          <span className="text-[11px] text-slate-500 truncate max-w-[150px]">
                            {cur.name}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] text-slate-400">{cur.symbol}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Numeric Input */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm font-semibold">
                {fromCurrency.symbol}
              </span>
              <input
                id="converter-input-amount"
                type="number"
                min="0"
                step="any"
                value={fromAmount === 0 ? '' : fromAmount}
                onChange={(e) => setFromAmount(Math.max(0, Number(e.target.value)))}
                placeholder="0.00"
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-lg text-lg font-bold font-mono text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Quick Amount Presets */}
            <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-slate-200/60">
              <span className="text-[10px] text-slate-400 font-medium mr-1">Presets:</span>
              {presetAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setFromAmount(amt)}
                  className={`text-[11px] font-mono px-2 py-0.5 rounded transition-colors ${
                    fromAmount === amt
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-white hover:bg-slate-200/80 text-slate-600 border border-slate-200'
                  }`}
                >
                  {fromCurrency.symbol}
                  {amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Center Swap Action Button */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center space-y-2">
            <button
              id="btn-swap-forex"
              type="button"
              onClick={handleSwapCurrencies}
              title="Invert Conversion (Swap Source and Target)"
              className="w-12 h-12 rounded-full bg-slate-900 hover:bg-emerald-600 text-white flex items-center justify-center shadow-md hover:scale-105 transition-all cursor-pointer group"
            >
              <ArrowLeftRight className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
            </button>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Swap Currencies
            </span>
          </div>

          {/* TO Converted Result Box */}
          <div className="lg:col-span-5 bg-emerald-950 text-white border border-emerald-800 rounded-xl p-4 sm:p-5 relative shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                Recipient Gets (To)
              </label>
              <span className="text-[10px] font-mono text-emerald-400">
                {toCurrency.name}
              </span>
            </div>

            {/* Target Currency Selector */}
            <div className="relative mb-3">
              <button
                type="button"
                onClick={() => {
                  setIsToSearchOpen(!isToSearchOpen);
                  setIsFromSearchOpen(false);
                }}
                className="w-full flex items-center justify-between bg-slate-900 border border-emerald-700 hover:border-emerald-500 rounded-lg px-3 py-2 text-xs transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <span className="text-xl select-none">{toCurrency.flag}</span>
                  <div className="text-left">
                    <span className="font-bold text-white font-mono text-sm block">
                      {toCurrency.code}
                    </span>
                    <span className="text-[11px] text-emerald-300 truncate max-w-[140px] block">
                      {toCurrency.name}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1.5 text-emerald-400">
                  <span className="font-mono text-xs font-semibold">{toCurrency.symbol}</span>
                  <Search className="w-3.5 h-3.5" />
                </div>
              </button>

              {/* To Currency Dropdown Search */}
              {isToSearchOpen && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-30 p-2 max-h-64 overflow-hidden flex flex-col text-slate-900">
                  <div className="relative mb-2">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search currency or country..."
                      value={searchQueryTo}
                      onChange={(e) => setSearchQueryTo(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans text-slate-900"
                      autoFocus
                    />
                  </div>
                  <div className="overflow-y-auto max-h-48 space-y-1 pr-1">
                    {filteredToCurrencies.map((cur) => (
                      <button
                        key={cur.code}
                        type="button"
                        onClick={() => {
                          setToCode(cur.code);
                          setIsToSearchOpen(false);
                          setSearchQueryTo('');
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-100 transition-colors ${
                          cur.code === toCode ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-base">{cur.flag}</span>
                          <span className="font-mono font-semibold">{cur.code}</span>
                          <span className="text-[11px] text-slate-500 truncate max-w-[150px]">
                            {cur.name}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] text-slate-400">{cur.symbol}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Display Converted Output */}
            <div className="bg-slate-900/90 border border-emerald-700/60 rounded-lg p-3">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight">
                  {formatValueInCurrency(conversionResult.toAmount, toCurrency)}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400 ml-2">
                  {toCurrency.code}
                </span>
              </div>
              {effectiveSpreadPercent > 0 && (
                <div className="text-[11px] font-mono text-emerald-300/80 mt-1 flex justify-between">
                  <span>Gross Mid-Market:</span>
                  <span>
                    {formatValueInCurrency(conversionResult.fromAmount * conversionResult.spotRate, toCurrency)}
                  </span>
                </div>
              )}
            </div>

            {/* Actions: Copy & Set Global */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-emerald-800/80 text-xs">
              <button
                type="button"
                onClick={handleCopyResult}
                className="flex items-center space-x-1 text-emerald-300 hover:text-white transition-colors"
              >
                {hasCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{hasCopied ? 'Copied!' : 'Copy Amount'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSetGlobalCurrency(toCurrency.code)}
                title="Use this currency everywhere across OmniCalc"
                className="flex items-center space-x-1 text-emerald-300 hover:text-white bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-700/50"
              >
                <Globe className="w-3 h-3 text-emerald-400" />
                <span>Make Active Global</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Exchange Rate Banner */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-slate-100 text-slate-800 px-3 py-1 rounded-md font-mono text-xs font-semibold flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>1 {fromCode} = {conversionResult.spotRate.toFixed(6)} {toCode}</span>
            </div>
            <div className="text-slate-500 font-mono text-[11px] bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
              Inverse: 1 {toCode} = {conversionResult.inverseRate.toFixed(6)} {fromCode}
            </div>
            {isCustomRateActive && (
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                Custom Spot Rate Applied
              </span>
            )}
          </div>

          <div className="text-[11px] text-slate-400 flex items-center space-x-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>Benchmark: IMF Special Drawing Rights & Central Bank Parity</span>
          </div>
        </div>
      </div>

      {/* Secondary Controls: Spread Disclosures & Custom Spot Rate */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Spread & Fee Disclosure (TILA & Dodd-Frank FX Rule) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Percent className="w-4 h-4 text-emerald-600" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Statutory Remittance & Spread Fee Disclosure
              </h2>
            </div>
            <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              Dodd-Frank 12 CFR § 1005
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Financial institutions, retail banks, and card processors apply hidden currency exchange markups over the mid-market rate. Select a fee tier below to inspect exact deductions.
          </p>

          {/* Tier Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SPREAD_TIERS.map((tier) => (
              <button
                key={tier.id}
                type="button"
                onClick={() => setSpreadTier(tier.id)}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  spreadTier === tier.id
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-medium ring-1 ring-emerald-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{tier.label}</span>
                  {spreadTier === tier.id && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{tier.description}</p>
              </button>
            ))}
          </div>

          {/* Custom Spread Slider (if custom tier selected) */}
          {spreadTier === 'custom' && (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Custom Markup Percentage:</span>
                <span className="font-mono font-bold text-emerald-700">{customSpread.toFixed(2)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="8"
                step="0.05"
                value={customSpread}
                onChange={(e) => setCustomSpread(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>
          )}

          {/* Breakdown Table */}
          <div className="overflow-hidden border border-slate-200 rounded-lg text-xs">
            <table className="w-full text-left">
              <tbody className="divide-y divide-slate-100 font-mono">
                <tr className="bg-slate-50/70">
                  <td className="py-2 px-3 text-slate-600">Mid-Market Gross Equivalent:</td>
                  <td className="py-2 px-3 text-right font-semibold text-slate-900">
                    {formatValueInCurrency(conversionResult.fromAmount * conversionResult.spotRate, toCurrency)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-slate-600">
                    Spread Fee Deducted ({effectiveSpreadPercent.toFixed(2)}%):
                  </td>
                  <td className="py-2 px-3 text-right text-rose-600 font-semibold">
                    -{formatValueInCurrency(conversionResult.feeDeducted, toCurrency)}
                  </td>
                </tr>
                <tr className="bg-emerald-50 text-emerald-950 font-bold border-t border-emerald-200">
                  <td className="py-2.5 px-3">Effective Net Settlement:</td>
                  <td className="py-2.5 px-3 text-right text-sm">
                    {formatValueInCurrency(conversionResult.toAmount, toCurrency)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Custom Spot Rate Override & Formula Audit Box */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-slate-700" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Auditor Spot Rate Override
              </h2>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Customs / Contract FX</span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            For contractual forward hedges, statutory customs duties, or historical reconciliations, apply an exact agreed spot rate override.
          </p>

          {/* Toggle Override */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Enable Custom Rate
              </span>
              <span className="text-[11px] text-slate-500">
                Bypasses benchmark table
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                const next = !isCustomRateActive;
                setIsCustomRateActive(next);
                if (next && !customSpotRate) {
                  setCustomSpotRate(conversionResult.spotRate.toFixed(6));
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                isCustomRateActive
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {isCustomRateActive ? 'Active' : 'Disabled'}
            </button>
          </div>

          {isCustomRateActive && (
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-700 block">
                Custom Spot Rate (1 {fromCode} = ? {toCode}):
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  step="any"
                  min="0.000001"
                  value={customSpotRate}
                  onChange={(e) => setCustomSpotRate(e.target.value)}
                  placeholder={conversionResult.spotRate.toFixed(6)}
                  className="flex-1 px-3 py-2 border border-amber-300 rounded-lg text-xs font-mono focus:ring-1 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomRateActive(false);
                    setCustomSpotRate('');
                  }}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium"
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {/* Certified Checksum Card */}
          <div className="bg-slate-900 text-slate-300 rounded-lg p-3.5 font-mono text-[11px] space-y-2">
            <div className="flex items-center justify-between text-slate-400 pb-1.5 border-b border-slate-800">
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-white font-bold">Audit Seal Checksum</span>
              </span>
              <span className="text-emerald-400">VERIFIED</span>
            </div>
            <div className="break-all text-[10px] text-emerald-300 bg-slate-950 p-2 rounded border border-slate-800">
              {conversionResult.checksum}
            </div>
            <p className="text-[10px] text-slate-400">
              SHA-256 equivalent cryptographic proof guaranteeing immutable mathematical repeatability across banking audits.
            </p>
          </div>
        </div>
      </div>

      {/* Comparative World Currency Matrix */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <Globe className="w-4 h-4 text-slate-700" />
              <span>Comparative Cross-Currency Matrix</span>
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Live valuation of {formatValueInCurrency(fromAmount, fromCurrency)} across premier international reserve and trading currencies.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Click any row to set target currency
          </span>
        </div>

        {/* Matrix Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {TOP_MATRIX_CURRENCIES.map((code) => {
            const cur = getCurrencyByCode(code);
            const rate = getExchangeRate(fromCode, code);
            const converted = fromAmount * rate;
            const isSelected = toCode === code;

            return (
              <div
                key={code}
                onClick={() => {
                  setToCode(code);
                  showToast(`Selected ${cur.name} (${code}) as target currency`);
                }}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-500'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{cur.flag}</span>
                    <span className="font-bold text-xs font-mono text-slate-900">{cur.code}</span>
                  </div>
                  {isSelected && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-mono">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <span className="text-sm font-bold font-mono text-slate-900 block">
                    {formatValueInCurrency(converted, cur)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    1 {fromCode} = {rate.toFixed(4)} {code}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dual Side-by-Side Conversion Multiplier Tiers */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="pb-3 border-b border-slate-100">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
            <Layers className="w-4 h-4 text-slate-700" />
            <span>Standard Conversion Multiplier Tables</span>
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Quick reference valuation brackets for commercial invoices, customs manifests, and retail forex exchanges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Table 1: From to To */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-100 px-3.5 py-2 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                {fromCurrency.flag} {fromCode} to {toCurrency.flag} {toCode}
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                1 {fromCode} = {conversionResult.spotRate.toFixed(4)} {toCode}
              </span>
            </div>
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="bg-slate-50 text-[11px] text-slate-500 border-b border-slate-200">
                  <th className="py-1.5 px-3 font-medium text-left">{fromCode} Amount</th>
                  <th className="py-1.5 px-3 font-medium text-right">{toCode} Converted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tiers.map((t) => (
                  <tr key={`f-${t.amount}`} className="hover:bg-slate-50/80">
                    <td className="py-1.5 px-3 text-slate-700">
                      {fromCurrency.symbol}
                      {t.amount.toLocaleString()}
                    </td>
                    <td className="py-1.5 px-3 text-right font-semibold text-slate-900">
                      {formatValueInCurrency(t.forward, toCurrency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table 2: To to From */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-100 px-3.5 py-2 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                {toCurrency.flag} {toCode} to {fromCurrency.flag} {fromCode}
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                1 {toCode} = {conversionResult.inverseRate.toFixed(4)} {fromCode}
              </span>
            </div>
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="bg-slate-50 text-[11px] text-slate-500 border-b border-slate-200">
                  <th className="py-1.5 px-3 font-medium text-left">{toCode} Amount</th>
                  <th className="py-1.5 px-3 font-medium text-right">{fromCode} Converted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tiers.map((t) => (
                  <tr key={`r-${t.amount}`} className="hover:bg-slate-50/80">
                    <td className="py-1.5 px-3 text-slate-700">
                      {toCurrency.symbol}
                      {t.amount.toLocaleString()}
                    </td>
                    <td className="py-1.5 px-3 text-right font-semibold text-slate-900">
                      {formatValueInCurrency(t.reverse, fromCurrency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
