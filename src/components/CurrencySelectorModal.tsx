/**
 * @license
 * Copyright (c) 2026 OmniCalc Intellectual Holdings & Sushant Mishra.
 * Complete International Currency Selector Modal with Search and Regional Filters.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { CurrencyInfo } from '../utils/currencies';
import { Search, X, Check, Globe, Sparkles } from 'lucide-react';

export const CurrencySelectorModal: React.FC = () => {
  const {
    currentCurrency,
    setCurrencyCode,
    allCurrencies,
    popularCurrencies,
    isModalOpen,
    closeCurrencyModal,
  } = useCurrency();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeCurrencyModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, closeCurrencyModal]);

  // Reset search when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setSearchTerm('');
      setSelectedRegion('All');
    }
  }, [isModalOpen]);

  const filteredCurrencies = useMemo(() => {
    return allCurrencies.filter((c) => {
      // Region filter
      if (selectedRegion === 'Popular') {
        if (!popularCurrencies.some((p) => p.code === c.code)) return false;
      } else if (selectedRegion !== 'All' && c.region !== selectedRegion) {
        return false;
      }

      // Search filter
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return (
        c.code.toLowerCase().includes(term) ||
        c.name.toLowerCase().includes(term) ||
        c.symbol.toLowerCase().includes(term) ||
        c.region.toLowerCase().includes(term)
      );
    });
  }, [allCurrencies, popularCurrencies, selectedRegion, searchTerm]);

  if (!isModalOpen) return null;

  const handleSelect = (currency: CurrencyInfo) => {
    setCurrencyCode(currency.code);
    closeCurrencyModal();
  };

  const regions = [
    'All',
    'Popular',
    'Americas',
    'Europe',
    'Asia-Pacific',
    'Middle East & Africa',
    'Global & Digital',
  ];

  return (
    <div
      id="currency-selector-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeCurrencyModal();
      }}
    >
      <div
        id="currency-selector-modal-container"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl flex flex-col max-h-[90vh] overflow-hidden animate-scale-up"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-inner">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Global Currency Registry
                </h3>
                <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                  {allCurrencies.length} Currencies
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Active Selection:{' '}
                <span className="font-semibold text-slate-800">
                  {currentCurrency.flag} {currentCurrency.code} ({currentCurrency.symbol}) -{' '}
                  {currentCurrency.name}
                </span>
              </p>
            </div>
          </div>

          <button
            id="close-currency-modal-btn"
            onClick={closeCurrencyModal}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Region Filter Bar */}
        <div className="p-4 border-b border-slate-100 bg-white space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="currency-search-input"
              type="text"
              placeholder="Search by currency name, ISO code (e.g. INR, EUR, USD), symbol (e.g. ₹, €, $), or country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white transition-all font-sans"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Regions Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {regions.map((region) => {
              const active = selectedRegion === region;
              return (
                <button
                  key={region}
                  id={`region-tab-${region.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                    active
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {region === 'Popular' && <Sparkles className="w-3 h-3 inline mr-1 text-amber-300" />}
                  {region}
                </button>
              );
            })}
          </div>
        </div>

        {/* Currency Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
          {filteredCurrencies.length === 0 ? (
            <div className="text-center py-12">
              <Globe className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700">No matching currencies found</p>
              <p className="text-xs text-slate-400 mt-1">Try searching with a code or name</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedRegion('All');
                }}
                className="mt-3 text-xs text-emerald-600 hover:text-emerald-700 font-semibold underline"
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {filteredCurrencies.map((currency) => {
                const isSelected = currentCurrency.code === currency.code;
                return (
                  <button
                    key={currency.code}
                    id={`currency-option-${currency.code.toLowerCase()}`}
                    onClick={() => handleSelect(currency)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all group ${
                      isSelected
                        ? 'bg-emerald-50/90 border-emerald-500 shadow-xs ring-1 ring-emerald-500'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <span className="text-2xl select-none shrink-0" role="img" aria-label={currency.name}>
                        {currency.flag}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-sm text-slate-900 font-mono tracking-tight">
                            {currency.code}
                          </span>
                          <span className="text-xs font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            {currency.symbol}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate font-normal">
                          {currency.name}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 ml-2">
                      {isSelected ? (
                        <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="text-[11px] font-mono text-slate-400 group-hover:text-slate-600">
                          {currency.region.split(' ')[0]}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-800">{filteredCurrencies.length}</strong> of{' '}
            {allCurrencies.length} world & digital currencies
          </span>
          <button
            onClick={closeCurrencyModal}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
