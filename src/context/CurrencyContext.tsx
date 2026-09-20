/**
 * @license
 * Copyright (c) 2026 OmniCalc Intellectual Holdings & Sushant Mishra.
 * Universal Global Currency State & Formatting Context.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  CurrencyInfo,
  ALL_CURRENCIES,
  POPULAR_CURRENCY_CODES,
  DEFAULT_CURRENCY,
  getCurrencyByCode,
  formatValueInCurrency,
} from '../utils/currencies';

interface CurrencyContextType {
  currentCurrency: CurrencyInfo;
  setCurrencyCode: (code: string) => void;
  format: (
    value: number,
    options?: { decimals?: number; showCode?: boolean; compact?: boolean }
  ) => string;
  allCurrencies: CurrencyInfo[];
  popularCurrencies: CurrencyInfo[];
  isModalOpen: boolean;
  openCurrencyModal: () => void;
  closeCurrencyModal: () => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'omnicalc_selected_currency';

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyInfo>(() => {
    try {
      const savedCode = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedCode) {
        return getCurrencyByCode(savedCode);
      }
    } catch {
      // ignore
    }
    return DEFAULT_CURRENCY;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const setCurrencyCode = (code: string) => {
    const found = getCurrencyByCode(code);
    setCurrentCurrency(found);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, found.code);
    } catch {
      // ignore
    }
  };

  const format = (
    value: number,
    options?: { decimals?: number; showCode?: boolean; compact?: boolean }
  ) => {
    return formatValueInCurrency(value, currentCurrency, options);
  };

  const popularCurrencies = POPULAR_CURRENCY_CODES.map((code) => getCurrencyByCode(code));

  return (
    <CurrencyContext.Provider
      value={{
        currentCurrency,
        setCurrencyCode,
        format,
        allCurrencies: ALL_CURRENCIES,
        popularCurrencies,
        isModalOpen,
        openCurrencyModal: () => setIsModalOpen(true),
        closeCurrencyModal: () => setIsModalOpen(false),
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export function useCurrency(): CurrencyContextType {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
