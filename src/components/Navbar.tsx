/**
 * @license
 * Copyright © 2026 Sushant Mishra. All Rights Reserved.
 * Sole Proprietor & Copyright Owner: Sushant Mishra (sushantmishra20006@gmail.com).
 */

import React from 'react';
import { ScreenType } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { PWAInstallButton } from './PWAInstallButton';
import {
  Calculator,
  ShieldCheck,
  FileText,
  DollarSign,
  Briefcase,
  History,
  Scale,
  Award,
  Globe,
  ChevronDown,
  ArrowLeftRight,
  Smartphone,
} from 'lucide-react';

interface NavbarProps {
  currentScreen: ScreenType;
  onSelectScreen: (screen: ScreenType) => void;
  auditCount: number;
  onOpenPublishModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onSelectScreen,
  auditCount,
  onOpenPublishModal,
}) => {
  const { currentCurrency, openCurrencyModal, allCurrencies } = useCurrency();
  const navItems: { id: ScreenType; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'screens',
      label: 'Screens Gallery',
      icon: <Smartphone className="w-4 h-4" />,
      badge: 'Mockups',
    },
    {
      id: 'scientific',
      label: 'Scientific Calc',
      icon: <Calculator className="w-4 h-4" />,
    },
    {
      id: 'financial',
      label: 'Financial & Loans',
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      id: 'converter',
      label: 'Currency Matrix',
      icon: <ArrowLeftRight className="w-4 h-4" />,
    },
    {
      id: 'business',
      label: 'Business & Tax',
      icon: <Briefcase className="w-4 h-4" />,
    },
    {
      id: 'audit',
      label: 'Audit Trail',
      icon: <History className="w-4 h-4" />,
      badge: auditCount > 0 ? `${auditCount}` : undefined,
    },
    {
      id: 'legal',
      label: 'Sole Copyright',
      icon: <Scale className="w-4 h-4" />,
      badge: '100% Owned',
    },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Trademark Title */}
          <div
            className="flex items-center space-x-3 cursor-pointer select-none"
            onClick={() => onSelectScreen('screens')}
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold shadow-inner">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-lg tracking-tight text-white">
                  OmniCalc
                </span>
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  TM
                </span>
                <span className="text-[10px] text-emerald-400 font-mono hidden sm:inline border border-emerald-500/30 bg-emerald-950/40 px-1.5 py-0.5 rounded">
                  100% Owned
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-normal leading-none hidden sm:block">
                Truth-in-Calculation™ • Copyright © 2026 Sushant Mishra
              </p>
            </div>
          </div>

          {/* Navigation Screens */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const active = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => onSelectScreen(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    active
                      ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        item.id === 'legal' || item.id === 'screens'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Status Badge & Currency Switcher */}
          <div className="flex items-center space-x-2">
            {/* PWA Direct Install & Play Store Modal Trigger */}
            <PWAInstallButton onOpenPublishModal={onOpenPublishModal} />

            {/* Global Currency Switcher Trigger */}
            <button
              id="navbar-currency-selector-btn"
              onClick={openCurrencyModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-300 border border-emerald-700/60 shadow-xs transition-all group"
              title={`Change Currency (${allCurrencies.length} currencies available)`}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-45 transition-transform" />
              <span className="text-base select-none">{currentCurrency.flag}</span>
              <span className="font-mono text-xs font-bold text-white tracking-tight">
                {currentCurrency.code}
              </span>
              <span className="text-emerald-400 text-xs font-bold">
                {currentCurrency.symbol}
              </span>
              <ChevronDown className="w-3 h-3 text-emerald-400/80" />
            </button>

            <div className="hidden xl:flex items-center space-x-1.5 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1.5 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono text-[11px]">IEEE 754 / TILA</span>
            </div>

            <button
              id="legal-status-quick-btn"
              onClick={() => onSelectScreen('legal')}
              className="hidden sm:flex items-center space-x-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg transition-colors group"
              title="Sole Copyright Owner: Sushant Mishra (sushantmishra20006@gmail.com)"
            >
              <Award className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-xs">© 2026 Sushant Mishra</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="lg:hidden flex items-center justify-between py-2 border-t border-slate-800/80 gap-2">
          <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar">
            {navItems.map((item) => {
              const active = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-btn-${item.id}`}
                  onClick={() => onSelectScreen(item.id)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs whitespace-nowrap font-medium transition-colors ${
                    active
                      ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] bg-slate-700 text-slate-300 px-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            id="mobile-currency-btn"
            onClick={openCurrencyModal}
            className="shrink-0 flex items-center space-x-1 px-2 py-1 rounded-md bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 text-xs font-mono font-bold"
          >
            <span>{currentCurrency.flag}</span>
            <span>{currentCurrency.code}</span>
            <ChevronDown className="w-3 h-3 text-emerald-400" />
          </button>
        </div>
      </div>
    </header>
  );
};
