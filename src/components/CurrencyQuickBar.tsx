/**
 * @license
 * Copyright (c) 2026 OmniCalc Intellectual Holdings & Sushant Mishra.
 * Quick Currency Switcher Bar with Active Status and Full Registry Launcher.
 */

import React from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface CurrencyQuickBarProps {
  label?: string;
  className?: string;
  compact?: boolean;
}

export const CurrencyQuickBar: React.FC<CurrencyQuickBarProps> = ({
  label = 'Currency',
  className = '',
  compact = false,
}) => {
  const {
    currentCurrency,
    setCurrencyCode,
    popularCurrencies,
    openCurrencyModal,
    allCurrencies,
  } = useCurrency();

  // Top 6 primary quick buttons for maximum ease
  const primaryQuick = popularCurrencies.slice(0, 6); // USD, EUR, GBP, INR, JPY, CAD

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl ${className}`}
    >
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700">
          <Globe className="w-3.5 h-3.5 text-emerald-600" />
          <span className="uppercase tracking-wider text-[11px] font-bold text-slate-500">
            {label}:
          </span>
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300/80 font-mono text-xs font-bold">
            <span>{currentCurrency.flag}</span>
            <span>{currentCurrency.code}</span>
            <span className="text-emerald-700 font-normal">({currentCurrency.symbol})</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
        {/* Quick buttons */}
        {!compact &&
          primaryQuick.map((c) => {
            const active = currentCurrency.code === c.code;
            return (
              <button
                key={c.code}
                id={`quick-curr-btn-${c.code.toLowerCase()}`}
                type="button"
                onClick={() => setCurrencyCode(c.code)}
                className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-mono transition-all ${
                  active
                    ? 'bg-slate-900 text-white font-bold shadow-2xs ring-1 ring-slate-900'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
                }`}
                title={`${c.name} (${c.symbol})`}
              >
                <span>{c.flag}</span>
                <span>{c.code}</span>
                <span className={active ? 'text-emerald-400' : 'text-slate-400'}>
                  {c.symbol}
                </span>
                {active && <Check className="w-3 h-3 text-emerald-400 stroke-[3] ml-0.5" />}
              </button>
            );
          })}

        {/* Full Registry Modal Trigger Button */}
        <button
          id="open-all-currencies-modal-btn"
          type="button"
          onClick={openCurrencyModal}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-colors"
          title={`Choose from ${allCurrencies.length} global currencies`}
        >
          <span className="hidden sm:inline">All Currencies</span>
          <span className="sm:hidden">More</span>
          <span className="bg-emerald-700/80 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
            {allCurrencies.length}
          </span>
          <ChevronDown className="w-3 h-3 text-emerald-200" />
        </button>
      </div>
    </div>
  );
};
