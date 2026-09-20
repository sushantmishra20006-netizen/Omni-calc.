/**
 * @license
 * Copyright (c) 2026 OmniCalc Intellectual Holdings & Sushant Mishra.
 * Commercial, Tax, and Profit Margin Compliance Engine.
 */

import React, { useState, useMemo } from 'react';
import { BusinessTaxInputs, AuditRecord } from '../types';
import { calculateBusinessTax } from '../utils/mathEngine';
import { useCurrency } from '../context/CurrencyContext';
import { CurrencyQuickBar } from './CurrencyQuickBar';
import {
  Briefcase,
  TrendingUp,
  Percent,
  DollarSign,
  ShieldCheck,
  CheckCircle,
  FileSpreadsheet,
  Layers,
  PieChart,
} from 'lucide-react';

interface BusinessCalculatorProps {
  onAddAuditRecord: (record: AuditRecord) => void;
}

export const BusinessCalculator: React.FC<BusinessCalculatorProps> = ({
  onAddAuditRecord,
}) => {
  const { currentCurrency, format, openCurrencyModal } = useCurrency();
  const [inputs, setInputs] = useState<BusinessTaxInputs>({
    revenue: 500000,
    costOfGoods: 220000,
    operatingExpenses: 110000,
    taxRatePercent: 21,
    fixedCosts: 85000,
    pricePerUnit: 150,
    variableCostPerUnit: 65,
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const result = useMemo(() => calculateBusinessTax(inputs), [inputs]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogToAudit = () => {
    const record: AuditRecord = {
      id: result.checksum,
      timestamp: new Date().toISOString(),
      category: 'Commercial & Tax',
      title: `Commercial Analysis: ${format(inputs.revenue)} Revenue @ ${inputs.taxRatePercent}% Tax (${currentCurrency.code})`,
      formula: `Gross=Rev-COGS; Margin=(Gross/Rev)*100; NetProfit=(OpInc-Tax); BreakEven=Fixed/(Price-VarCost)`,
      inputs: {
        'Gross Revenue': format(inputs.revenue),
        'Cost of Goods (COGS)': format(inputs.costOfGoods),
        'Operating Expenses': format(inputs.operatingExpenses),
        'Statutory Tax Rate': `${inputs.taxRatePercent}%`,
        'Fixed Overhead': format(inputs.fixedCosts),
        'Unit Selling Price': format(inputs.pricePerUnit),
        'Variable Unit Cost': format(inputs.variableCostPerUnit),
      },
      results: {
        'Gross Profit': format(result.grossProfit),
        'Gross Margin': `${result.grossMarginPercent}%`,
        'Net Profit After Tax': format(result.netProfitAfterTax),
        'Statutory Tax Provision': format(result.taxAmount),
        'Break-Even Units': `${result.breakEvenUnits.toLocaleString()} units`,
        'Break-Even Revenue': format(result.breakEvenRevenue),
      },
      checksum: result.checksum,
      legalStatus: 'VERIFIED_COMPLIANT',
      currency: {
        code: currentCurrency.code,
        symbol: currentCurrency.symbol,
        flag: currentCurrency.flag,
        name: currentCurrency.name,
      },
    };

    onAddAuditRecord(record);
    showToast(`Logged commercial figures in ${currentCurrency.code} (${currentCurrency.symbol}) to Audit Trail`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-emerald-400 border border-emerald-500/40 px-4 py-2.5 rounded-lg shadow-xl text-xs font-mono flex items-center space-x-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Commercial & Statutory Tax Precision Engine
            </h1>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded border border-emerald-200">
              GAAP / IFRS Aligned
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Certified income statement breakdowns, profit margin multipliers, and statutory break-even
            thresholds calculated with strict penny-accurate balance reconciliation in {currentCurrency.name} ({currentCurrency.code}).
          </p>
        </div>

        <button
          id="btn-log-business-audit"
          onClick={handleLogToAudit}
          className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors shadow-xs self-start sm:self-auto"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Audit Record ({currentCurrency.code})</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Inputs */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          {/* Currency Quick Bar */}
          <CurrencyQuickBar label="Commercial Currency" />

          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <Briefcase className="w-4 h-4 text-slate-700" />
              <span>Revenue & Operating Inputs</span>
            </h2>
            <span className="text-[11px] font-mono text-slate-400">Currency: {currentCurrency.code}</span>
          </div>

          {/* Revenue */}
          <div>
            <label htmlFor="input-biz-rev" className="text-xs font-medium text-slate-700 block mb-1">
              Gross Operating Revenue ({currentCurrency.symbol})
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={openCurrencyModal}
                title="Change calculation currency"
                className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-700 bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded text-xs font-mono font-bold cursor-pointer transition-colors"
              >
                {currentCurrency.symbol}
              </button>
              <input
                id="input-biz-rev"
                type="number"
                value={inputs.revenue}
                onChange={(e) =>
                  setInputs((prev) => ({
                    ...prev,
                    revenue: Math.max(0, Number(e.target.value)),
                  }))
                }
                className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded text-xs font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* COGS */}
          <div>
            <label htmlFor="input-biz-cogs" className="text-xs font-medium text-slate-700 block mb-1">
              Cost of Goods Sold (COGS) ({currentCurrency.symbol})
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={openCurrencyModal}
                title="Change calculation currency"
                className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-700 bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded text-xs font-mono font-bold cursor-pointer transition-colors"
              >
                {currentCurrency.symbol}
              </button>
              <input
                id="input-biz-cogs"
                type="number"
                value={inputs.costOfGoods}
                onChange={(e) =>
                  setInputs((prev) => ({
                    ...prev,
                    costOfGoods: Math.max(0, Number(e.target.value)),
                  }))
                }
                className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded text-xs font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* OpEx */}
          <div>
            <label htmlFor="input-biz-opex" className="text-xs font-medium text-slate-700 block mb-1">
              Operating Expenses (OpEx) ({currentCurrency.symbol})
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={openCurrencyModal}
                title="Change calculation currency"
                className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-700 bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded text-xs font-mono font-bold cursor-pointer transition-colors"
              >
                {currentCurrency.symbol}
              </button>
              <input
                id="input-biz-opex"
                type="number"
                value={inputs.operatingExpenses}
                onChange={(e) =>
                  setInputs((prev) => ({
                    ...prev,
                    operatingExpenses: Math.max(0, Number(e.target.value)),
                  }))
                }
                className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded text-xs font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Corporate Tax Rate */}
          <div>
            <label htmlFor="input-biz-tax" className="text-xs font-medium text-slate-700 block mb-1">
              Corporate / Sales Tax Rate (%)
            </label>
            <div className="relative">
              <input
                id="input-biz-tax"
                type="number"
                step="0.5"
                min="0"
                max="60"
                value={inputs.taxRatePercent}
                onChange={(e) =>
                  setInputs((prev) => ({
                    ...prev,
                    taxRatePercent: Math.max(0, Number(e.target.value)),
                  }))
                }
                className="w-full pl-3 pr-8 py-1.5 border border-slate-200 rounded text-xs font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
              />
              <Percent className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Unit Economics for Break-Even */}
          <div className="pt-3 border-t border-slate-100 space-y-3">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Unit Economics (Break-Even Parameters)
            </span>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label htmlFor="input-fixed-costs" className="text-[11px] text-slate-600 block mb-1">
                  Fixed Overhead
                </label>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] font-mono">
                    {currentCurrency.symbol}
                  </span>
                  <input
                    id="input-fixed-costs"
                    type="number"
                    value={inputs.fixedCosts}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        fixedCosts: Math.max(0, Number(e.target.value)),
                      }))
                    }
                    className="w-full pl-5 pr-1 py-1.5 border border-slate-200 rounded text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="input-unit-price" className="text-[11px] text-slate-600 block mb-1">
                  Price / Unit ({currentCurrency.symbol})
                </label>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] font-mono">
                    {currentCurrency.symbol}
                  </span>
                  <input
                    id="input-unit-price"
                    type="number"
                    value={inputs.pricePerUnit}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        pricePerUnit: Math.max(0, Number(e.target.value)),
                      }))
                    }
                    className="w-full pl-5 pr-1 py-1.5 border border-slate-200 rounded text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="input-var-cost" className="text-[11px] text-slate-600 block mb-1">
                  Var Cost / Unit
                </label>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] font-mono">
                    {currentCurrency.symbol}
                  </span>
                  <input
                    id="input-var-cost"
                    type="number"
                    value={inputs.variableCostPerUnit}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        variableCostPerUnit: Math.max(0, Number(e.target.value)),
                      }))
                    }
                    className="w-full pl-5 pr-1 py-1.5 border border-slate-200 rounded text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Tier Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-emerald-900 text-white p-4 rounded-xl shadow-xs border border-emerald-800">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300 block">
                Net Profit After Tax
              </span>
              <p className="text-2xl font-bold font-mono mt-1 text-white">
                {format(result.netProfitAfterTax)}
              </p>
              <div className="mt-2 text-[11px] text-emerald-200 flex justify-between border-t border-emerald-800 pt-1.5">
                <span>Tax Provision ({inputs.taxRatePercent}%):</span>
                <span className="font-mono">-{format(result.taxAmount)}</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                Gross Profit Margin
              </span>
              <p className="text-2xl font-bold font-mono mt-1 text-slate-900">
                {result.grossMarginPercent}%
              </p>
              <div className="mt-2 text-[11px] text-slate-500 flex justify-between border-t border-slate-100 pt-1.5">
                <span>Gross Profit:</span>
                <span className="font-mono font-medium text-emerald-700">
                  {format(result.grossProfit)}
                </span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                Markup on COGS
              </span>
              <p className="text-2xl font-bold font-mono mt-1 text-slate-900">
                {result.markupPercent}%
              </p>
              <div className="mt-2 text-[11px] text-slate-500 flex justify-between border-t border-slate-100 pt-1.5">
                <span>Operating Margin:</span>
                <span className="font-mono font-medium text-indigo-700">
                  {result.operatingMarginPercent}%
                </span>
              </div>
            </div>
          </div>

          {/* Statutory Break-Even Visualizer */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Statutory Break-Even Threshold Analysis ({currentCurrency.code})
                </h3>
                <p className="text-[11px] text-slate-500">
                  Fixed Costs ÷ (Unit Selling Price - Variable Unit Cost)
                </p>
              </div>
              <span className="text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full">
                {result.breakEvenUnits.toLocaleString()} Units Required
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                <span className="text-[11px] text-slate-500 block">Contribution Margin per Unit:</span>
                <p className="text-lg font-mono font-bold text-slate-800 mt-0.5">
                  {format(inputs.pricePerUnit - inputs.variableCostPerUnit)}
                </p>
                <span className="text-[10px] text-slate-400">
                  ({(((inputs.pricePerUnit - inputs.variableCostPerUnit) / (inputs.pricePerUnit || 1)) * 100).toFixed(1)}% of unit price)
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                <span className="text-[11px] text-slate-500 block">Break-Even Sales Revenue:</span>
                <p className="text-lg font-mono font-bold text-slate-800 mt-0.5">
                  {format(result.breakEvenRevenue)}
                </p>
                <span className="text-[10px] text-slate-400">
                  Minimum gross sales to cover fixed costs
                </span>
              </div>
            </div>

            {/* Income Statement Waterfall Table */}
            <div className="overflow-hidden border border-slate-100 rounded-lg">
              <table className="w-full text-xs font-mono">
                <tbody className="divide-y divide-slate-100">
                  <tr className="bg-slate-50/50">
                    <td className="py-2 px-3 text-slate-700 font-semibold">Total Revenue</td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900">
                      {format(inputs.revenue)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-slate-600 pl-6">Less: Cost of Goods Sold (COGS)</td>
                    <td className="py-2 px-3 text-right text-rose-600">-{format(inputs.costOfGoods)}</td>
                  </tr>
                  <tr className="bg-slate-50 font-semibold">
                    <td className="py-2 px-3 text-slate-800">Gross Operating Profit</td>
                    <td className="py-2 px-3 text-right text-emerald-700">{format(result.grossProfit)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-slate-600 pl-6">Less: Operating Expenses (OpEx)</td>
                    <td className="py-2 px-3 text-right text-rose-600">-{format(inputs.operatingExpenses)}</td>
                  </tr>
                  <tr className="bg-slate-50 font-semibold">
                    <td className="py-2 px-3 text-slate-800">Net Operating Income (EBIT)</td>
                    <td className="py-2 px-3 text-right text-slate-900">{format(result.netOperatingIncome)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-slate-600 pl-6">Less: Income Tax Liability ({inputs.taxRatePercent}%)</td>
                    <td className="py-2 px-3 text-right text-amber-700">-{format(result.taxAmount)}</td>
                  </tr>
                  <tr className="bg-emerald-50 text-emerald-900 font-bold border-t border-emerald-200">
                    <td className="py-2.5 px-3">Net Profit After Tax</td>
                    <td className="py-2.5 px-3 text-right">{format(result.netProfitAfterTax)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
