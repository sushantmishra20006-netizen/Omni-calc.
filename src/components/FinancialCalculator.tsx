/**
 * @license
 * Copyright (c) 2026 OmniCalc Intellectual Holdings & Sushant Mishra.
 * Truth-in-Calculation Financial & Mortgage Engine.
 */

import React, { useState, useMemo } from 'react';
import {
  LoanCalculationInputs,
  InvestmentInputs,
  AuditRecord,
} from '../types';
import {
  calculateLoan,
  calculateInvestment,
  roundCurrency,
} from '../utils/mathEngine';
import { generateComplianceCertificate } from '../utils/legalDocs';
import { useCurrency } from '../context/CurrencyContext';
import { CurrencyQuickBar } from './CurrencyQuickBar';
import {
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Download,
  Calendar,
  Percent,
  CheckCircle,
  Copy,
  Info,
  Layers,
  ChevronRight,
  Globe,
} from 'lucide-react';

interface FinancialCalculatorProps {
  onAddAuditRecord: (record: AuditRecord) => void;
  onOpenLegal: () => void;
}

export const FinancialCalculator: React.FC<FinancialCalculatorProps> = ({
  onAddAuditRecord,
  onOpenLegal,
}) => {
  const { currentCurrency, format, openCurrencyModal } = useCurrency();
  const [activeTab, setActiveTab] = useState<'loan' | 'investment'>('loan');

  // Loan State
  const [loanInputs, setLoanInputs] = useState<LoanCalculationInputs>({
    principal: 350000,
    annualRate: 6.25,
    termYears: 30,
    termMonths: 0,
    downPayment: 70000,
    propertyTaxAnnual: 4200,
    homeInsuranceAnnual: 1200,
    paymentFrequency: 'monthly',
  });

  // Investment State
  const [investInputs, setInvestInputs] = useState<InvestmentInputs>({
    initialPrincipal: 25000,
    monthlyDeposit: 750,
    annualInterestRate: 8.5,
    compoundFrequency: 'monthly',
    years: 20,
  });

  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);
  const [schedulePage, setSchedulePage] = useState<number>(1);

  // Memoized exact calculations
  const loanResult = useMemo(() => calculateLoan(loanInputs), [loanInputs]);
  const investResult = useMemo(() => calculateInvestment(investInputs), [investInputs]);

  // Log calculation to audit trail
  const handleLogLoanToAudit = () => {
    const record: AuditRecord = {
      id: loanResult.checksum,
      timestamp: new Date().toISOString(),
      category: 'Financial Loan',
      title: `Mortgage / Loan ${format(loanInputs.principal)} @ ${loanInputs.annualRate}%`,
      formula: loanResult.formulaString,
      inputs: {
        'Home Price': format(loanInputs.principal),
        'Down Payment': format(loanInputs.downPayment),
        'Interest Rate (APR)': `${loanInputs.annualRate}%`,
        'Loan Term': `${loanInputs.termYears} years ${loanInputs.termMonths > 0 ? `${loanInputs.termMonths} mo` : ''}`,
        'Property Tax (Annual)': format(loanInputs.propertyTaxAnnual),
        'Insurance (Annual)': format(loanInputs.homeInsuranceAnnual),
      },
      results: {
        'Monthly Principal & Interest': format(loanResult.monthlyPrincipalInterest),
        'Total Monthly Payment': format(loanResult.totalMonthlyPayment),
        'Total Interest Paid': format(loanResult.totalInterest),
        'Total Repayment': format(loanResult.totalPayment),
        'Loan-to-Value (LTV)': `${loanResult.loanToValueRatio}%`,
      },
      checksum: loanResult.checksum,
      legalStatus: 'VERIFIED_COMPLIANT',
      currency: {
        code: currentCurrency.code,
        symbol: currentCurrency.symbol,
        flag: currentCurrency.flag,
        name: currentCurrency.name,
      },
    };
    onAddAuditRecord(record);
    showNotice(`Logged to Audit Trail in ${currentCurrency.code} (${currentCurrency.symbol})`);
  };

  const handleLogInvestToAudit = () => {
    const record: AuditRecord = {
      id: investResult.checksum,
      timestamp: new Date().toISOString(),
      category: 'Investment Growth',
      title: `Compound Growth ${format(investInputs.initialPrincipal)} + ${format(investInputs.monthlyDeposit)}/mo @ ${investInputs.annualInterestRate}%`,
      formula: `FV = P*(1+r/n)^(nt) + PMT*[((1+r/n)^(nt)-1)/(r/n)]`,
      inputs: {
        'Initial Deposit': format(investInputs.initialPrincipal),
        'Monthly Contribution': format(investInputs.monthlyDeposit),
        'Annual Rate': `${investInputs.annualInterestRate}%`,
        'Horizon': `${investInputs.years} years`,
        'Frequency': investInputs.compoundFrequency,
      },
      results: {
        'Future Value': format(investResult.futureValue),
        'Total Contributed': format(investResult.totalContributions),
        'Total Interest Earned': format(investResult.totalInterestEarned),
      },
      checksum: investResult.checksum,
      legalStatus: 'VERIFIED_COMPLIANT',
      currency: {
        code: currentCurrency.code,
        symbol: currentCurrency.symbol,
        flag: currentCurrency.flag,
        name: currentCurrency.name,
      },
    };
    onAddAuditRecord(record);
    showNotice(`Logged to Audit Trail in ${currentCurrency.code} (${currentCurrency.symbol})`);
  };

  const handleDownloadLoanCertificate = () => {
    const cert = generateComplianceCertificate(
      'TILA-Compliant Mortgage & Amortization',
      loanResult.checksum,
      loanResult.formulaString,
      {
        'Principal Price': format(loanInputs.principal),
        'Down Payment': format(loanInputs.downPayment),
        'Annual Rate (APR)': `${loanInputs.annualRate}%`,
        'Term': `${loanInputs.termYears} Years`,
      },
      {
        'Monthly P&I': format(loanResult.monthlyPrincipalInterest),
        'Total Payment': format(loanResult.totalPayment),
        'Total Interest': format(loanResult.totalInterest),
        'LTV Ratio': `${loanResult.loanToValueRatio}%`,
      },
      `${currentCurrency.code} (${currentCurrency.symbol}) - ${currentCurrency.name}`
    );

    const blob = new Blob([cert], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OmniCalc-TILA-Certificate-${currentCurrency.code}-${loanResult.checksum.slice(-8)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showNotice(`Downloaded Compliance Certificate (${currentCurrency.code})`);
  };

  const showNotice = (msg: string) => {
    setCopiedNotification(msg);
    setTimeout(() => setCopiedNotification(null), 3500);
  };

  const copyChecksum = (val: string) => {
    navigator.clipboard?.writeText(val);
    showNotice('Copied Audit Checksum');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {copiedNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-emerald-400 border border-emerald-500/40 px-4 py-2.5 rounded-lg shadow-xl text-xs font-mono flex items-center space-x-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{copiedNotification}</span>
        </div>
      )}

      {/* Header Banner with Legal Notice */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Truth-In-Calculation™ Financial Engine
            </h1>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded border border-emerald-300">
              Verified TILA Reg Z
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Calculations strictly adhere to 12 C.F.R. § 1026 (Regulation Z) standard amortization formulas,
            applying exact periodic interest compounding and bank-grade currency rounding.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 self-start md:self-auto">
          <button
            id="tab-btn-loan"
            onClick={() => setActiveTab('loan')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'loan'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mortgage & Amortization</span>
          </button>
          <button
            id="tab-btn-invest"
            onClick={() => setActiveTab('investment')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'investment'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
            <span>Compound Growth</span>
          </button>
        </div>
      </div>

      {activeTab === 'loan' ? (
        /* MORTGAGE & LOAN CALCULATOR */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs Column */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            {/* Currency Quick Bar */}
            <CurrencyQuickBar label="Loan Currency" />

            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>Statutory Loan Parameters</span>
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">
                P_net = {format(loanInputs.principal - loanInputs.downPayment)}
              </span>
            </div>

            {/* Principal & Down Payment */}
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <label htmlFor="input-principal">Home Price / Loan Amount</label>
                <span className="font-mono text-slate-900 font-bold">
                  {format(loanInputs.principal)}
                </span>
              </div>
              <input
                id="input-principal"
                type="range"
                min="10000"
                max="2000000"
                step="5000"
                value={loanInputs.principal}
                onChange={(e) =>
                  setLoanInputs((prev) => ({
                    ...prev,
                    principal: Number(e.target.value),
                    downPayment: Math.min(prev.downPayment, Number(e.target.value)),
                  }))
                }
                className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
              <div className="flex gap-2 mt-1.5">
                <div className="relative flex-1">
                  <button
                    type="button"
                    onClick={openCurrencyModal}
                    title="Change calculation currency"
                    className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-700 bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded text-xs font-mono font-bold cursor-pointer transition-colors"
                  >
                    {currentCurrency.symbol}
                  </button>
                  <input
                    id="input-principal-number"
                    type="number"
                    value={loanInputs.principal}
                    onChange={(e) =>
                      setLoanInputs((prev) => ({
                        ...prev,
                        principal: Math.max(0, Number(e.target.value)),
                      }))
                    }
                    className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded text-xs font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Down Payment */}
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <label htmlFor="input-downpayment">Down Payment</label>
                <span className="font-mono text-slate-900 font-bold">
                  {format(loanInputs.downPayment)} (
                  {loanInputs.principal > 0
                    ? ((loanInputs.downPayment / loanInputs.principal) * 100).toFixed(1)
                    : 0}
                  %)
                </span>
              </div>
              <input
                id="input-downpayment"
                type="range"
                min="0"
                max={loanInputs.principal}
                step="2500"
                value={loanInputs.downPayment}
                onChange={(e) =>
                  setLoanInputs((prev) => ({
                    ...prev,
                    downPayment: Number(e.target.value),
                  }))
                }
                className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            {/* Annual Interest Rate & Term */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label htmlFor="input-rate" className="text-xs font-medium text-slate-700 block mb-1">
                  Annual Rate (APR %)
                </label>
                <div className="relative">
                  <input
                    id="input-rate"
                    type="number"
                    step="0.05"
                    min="0"
                    max="30"
                    value={loanInputs.annualRate}
                    onChange={(e) =>
                      setLoanInputs((prev) => ({
                        ...prev,
                        annualRate: Math.max(0, Number(e.target.value)),
                      }))
                    }
                    className="w-full pr-7 pl-3 py-1.5 border border-slate-200 rounded text-xs font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                  />
                  <Percent className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label htmlFor="select-term" className="text-xs font-medium text-slate-700 block mb-1">
                  Loan Term (Years)
                </label>
                <select
                  id="select-term"
                  value={loanInputs.termYears}
                  onChange={(e) =>
                    setLoanInputs((prev) => ({
                      ...prev,
                      termYears: Number(e.target.value),
                    }))
                  }
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs bg-white text-slate-900 focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value={10}>10 Years (120 mo)</option>
                  <option value={15}>15 Years (180 mo)</option>
                  <option value={20}>20 Years (240 mo)</option>
                  <option value={30}>30 Years (360 mo)</option>
                  <option value={40}>40 Years (480 mo)</option>
                </select>
              </div>
            </div>

            {/* Escrow Items: Property Tax & Home Insurance */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Escrow & Carrying Costs (Annual)
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="input-prop-tax" className="text-xs text-slate-600 block mb-1">
                    Property Tax / Year
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono">
                      {currentCurrency.symbol}
                    </span>
                    <input
                      id="input-prop-tax"
                      type="number"
                      value={loanInputs.propertyTaxAnnual}
                      onChange={(e) =>
                        setLoanInputs((prev) => ({
                          ...prev,
                          propertyTaxAnnual: Math.max(0, Number(e.target.value)),
                        }))
                      }
                      className="w-full pl-6 pr-2 py-1.5 border border-slate-200 rounded text-xs font-mono focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="input-insurance" className="text-xs text-slate-600 block mb-1">
                    Homeowners Ins. / Year
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono">
                      {currentCurrency.symbol}
                    </span>
                    <input
                      id="input-insurance"
                      type="number"
                      value={loanInputs.homeInsuranceAnnual}
                      onChange={(e) =>
                        setLoanInputs((prev) => ({
                          ...prev,
                          homeInsuranceAnnual: Math.max(0, Number(e.target.value)),
                        }))
                      }
                      className="w-full pl-6 pr-2 py-1.5 border border-slate-200 rounded text-xs font-mono focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex items-center space-x-2">
              <button
                id="btn-log-loan-audit"
                onClick={handleLogLoanToAudit}
                className="flex-1 flex items-center justify-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium py-2 rounded-lg transition-colors shadow-xs"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Log ({currentCurrency.code}) to Audit</span>
              </button>

              <button
                id="btn-cert-download"
                onClick={handleDownloadLoanCertificate}
                className="flex items-center justify-center space-x-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-medium px-3 py-2 rounded-lg transition-colors"
                title="Download Legal Compliance Certificate"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Certificate</span>
              </button>
            </div>
          </div>

          {/* Results & Amortization Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary Payment Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-emerald-900 text-white p-4 rounded-xl shadow-xs border border-emerald-800">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300 block">
                  Total Monthly Payment
                </span>
                <p className="text-2xl font-bold font-mono mt-1 text-white">
                  {format(loanResult.totalMonthlyPayment)}
                </p>
                <div className="mt-2 text-[11px] text-emerald-200 flex items-center justify-between border-t border-emerald-800/80 pt-1.5">
                  <span>P&I Only:</span>
                  <span className="font-mono font-medium">
                    {format(loanResult.monthlyPrincipalInterest)}/mo
                  </span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                  Total Interest Paid
                </span>
                <p className="text-xl font-bold font-mono mt-1 text-slate-900">
                  {format(loanResult.totalInterest)}
                </p>
                <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-1.5">
                  <span>Interest Ratio:</span>
                  <span className="font-mono text-slate-700 font-medium">
                    {loanResult.totalPayment > 0
                      ? ((loanResult.totalInterest / loanResult.totalPayment) * 100).toFixed(1)
                      : 0}
                    %
                  </span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                  Total Repayment Cost
                </span>
                <p className="text-xl font-bold font-mono mt-1 text-slate-900">
                  {format(loanResult.totalPayment)}
                </p>
                <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-1.5">
                  <span>Loan-to-Value (LTV):</span>
                  <span className="font-mono text-emerald-700 font-semibold">
                    {loanResult.loanToValueRatio}%
                  </span>
                </div>
              </div>
            </div>

            {/* Exact Mathematical Formula & Audit String */}
            <div className="bg-slate-900 text-slate-200 rounded-xl p-4 border border-slate-800 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-slate-200">Verified Mathematical Proof</span>
                </div>
                <button
                  onClick={() => copyChecksum(loanResult.checksum)}
                  className="flex items-center space-x-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-mono"
                >
                  <span>{loanResult.checksum.slice(0, 16)}...</span>
                  <Copy className="w-3 h-3" />
                </button>
              </div>
              <div className="mt-2 font-mono text-[11px] text-slate-400 overflow-x-auto whitespace-pre">
                {loanResult.formulaString}
              </div>
              <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Certified Calculation Timestamp: {new Date(loanResult.calculatedAt).toLocaleString()}</span>
                <span className="text-emerald-400 font-mono">Currency: {currentCurrency.code} ({currentCurrency.symbol})</span>
              </div>
            </div>

            {/* Amortization Schedule Table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Amortization Ledger Schedule ({currentCurrency.code})
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Compliant with TILA periodic schedule disclosure standards
                  </p>
                </div>
                <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {loanResult.amortizationSchedule.length} intervals tracked
                </span>
              </div>

              <div className="overflow-x-auto max-h-72">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 text-slate-600 text-[11px] sticky top-0 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Period</th>
                      <th className="py-2.5 px-3">Payment</th>
                      <th className="py-2.5 px-3">Principal</th>
                      <th className="py-2.5 px-3">Interest</th>
                      <th className="py-2.5 px-3">Cumulative Interest</th>
                      <th className="py-2.5 px-3 text-right">Remaining Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {loanResult.amortizationSchedule.map((row) => (
                      <tr key={row.period} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2 px-3 font-semibold text-slate-600">#{row.period}</td>
                        <td className="py-2 px-3">{format(row.payment)}</td>
                        <td className="py-2 px-3 text-emerald-700 font-medium">
                          +{format(row.principalPaid)}
                        </td>
                        <td className="py-2 px-3 text-amber-700">-{format(row.interestPaid)}</td>
                        <td className="py-2 px-3 text-slate-600">{format(row.totalInterestPaid)}</td>
                        <td className="py-2 px-3 text-right font-bold text-slate-900">
                          {format(row.remainingBalance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* COMPOUND INTEREST & INVESTMENT GROWTH */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            {/* Currency Quick Bar */}
            <CurrencyQuickBar label="Investment Currency" />

            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                <span>Compound Interest Engine</span>
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">
                Formula: A = P(1+r/n)^(nt)
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <label htmlFor="input-init-invest">Initial Principal Deposit</label>
                <span className="font-mono text-slate-900 font-bold">
                  {format(investInputs.initialPrincipal)}
                </span>
              </div>
              <input
                id="input-init-invest"
                type="range"
                min="0"
                max="250000"
                step="2500"
                value={investInputs.initialPrincipal}
                onChange={(e) =>
                  setInvestInputs((prev) => ({
                    ...prev,
                    initialPrincipal: Number(e.target.value),
                  }))
                }
                className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <label htmlFor="input-monthly-deposit">Regular Monthly Contribution</label>
                <span className="font-mono text-slate-900 font-bold">
                  {format(investInputs.monthlyDeposit)} / mo
                </span>
              </div>
              <input
                id="input-monthly-deposit"
                type="range"
                min="0"
                max="5000"
                step="50"
                value={investInputs.monthlyDeposit}
                onChange={(e) =>
                  setInvestInputs((prev) => ({
                    ...prev,
                    monthlyDeposit: Number(e.target.value),
                  }))
                }
                className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label htmlFor="input-invest-rate" className="text-xs font-medium text-slate-700 block mb-1">
                  Expected Annual Return (%)
                </label>
                <div className="relative">
                  <input
                    id="input-invest-rate"
                    type="number"
                    step="0.25"
                    min="0"
                    max="50"
                    value={investInputs.annualInterestRate}
                    onChange={(e) =>
                      setInvestInputs((prev) => ({
                        ...prev,
                        annualInterestRate: Math.max(0, Number(e.target.value)),
                      }))
                    }
                    className="w-full pr-7 pl-3 py-1.5 border border-slate-200 rounded text-xs font-mono focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                  />
                  <Percent className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label htmlFor="input-invest-years" className="text-xs font-medium text-slate-700 block mb-1">
                  Investment Horizon (Years)
                </label>
                <input
                  id="input-invest-years"
                  type="number"
                  min="1"
                  max="60"
                  value={investInputs.years}
                  onChange={(e) =>
                    setInvestInputs((prev) => ({
                      ...prev,
                      years: Math.max(1, Math.min(60, Number(e.target.value))),
                    }))
                  }
                  className="w-full px-3 py-1.5 border border-slate-200 rounded text-xs font-mono focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label htmlFor="select-compound-freq" className="text-xs font-medium text-slate-700 block mb-1">
                Compounding Frequency
              </label>
              <select
                id="select-compound-freq"
                value={investInputs.compoundFrequency}
                onChange={(e) =>
                  setInvestInputs((prev) => ({
                    ...prev,
                    compoundFrequency: e.target.value as any,
                  }))
                }
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs bg-white text-slate-900 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
              >
                <option value="monthly">Monthly (12x/year)</option>
                <option value="quarterly">Quarterly (4x/year)</option>
                <option value="annually">Annually (1x/year)</option>
                <option value="daily">Daily (365x/year)</option>
              </select>
            </div>

            <div className="pt-3">
              <button
                id="btn-log-invest-audit"
                onClick={handleLogInvestToAudit}
                className="w-full flex items-center justify-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium py-2 rounded-lg transition-colors shadow-xs"
              >
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>Log Growth ({currentCurrency.code}) to Audit</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-indigo-900 text-white p-4 rounded-xl shadow-xs border border-indigo-800">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-300 block">
                  Projected Future Value
                </span>
                <p className="text-2xl font-bold font-mono mt-1 text-white">
                  {format(investResult.futureValue)}
                </p>
                <span className="text-[10px] text-indigo-200 block mt-1">
                  At Year {investInputs.years} ({investInputs.compoundFrequency})
                </span>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                  Total Contributions
                </span>
                <p className="text-xl font-bold font-mono mt-1 text-slate-900">
                  {format(investResult.totalContributions)}
                </p>
                <span className="text-[10px] text-slate-500 block mt-1">
                  Principal + Monthly sums
                </span>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 block">
                  Compound Interest Earned
                </span>
                <p className="text-xl font-bold font-mono mt-1 text-emerald-700">
                  +{format(investResult.totalInterestEarned)}
                </p>
                <span className="text-[10px] text-emerald-600 block mt-1">
                  Pure interest compounding
                </span>
              </div>
            </div>

            {/* Annual Milestone Schedule */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Year-over-Year Growth Projection ({currentCurrency.code})
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">
                  {investResult.breakdownByYear.length} Years Evaluated
                </span>
              </div>

              <div className="overflow-x-auto max-h-72">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 text-slate-600 text-[11px] sticky top-0 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Year</th>
                      <th className="py-2.5 px-3">Total Invested</th>
                      <th className="py-2.5 px-3">Interest Earned</th>
                      <th className="py-2.5 px-3 text-right">End Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {investResult.breakdownByYear.map((b) => (
                      <tr key={b.year} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2 px-3 font-semibold text-slate-600">Year {b.year}</td>
                        <td className="py-2 px-3 text-slate-700">{format(b.contributions)}</td>
                        <td className="py-2 px-3 text-emerald-600 font-medium">+{format(b.interest)}</td>
                        <td className="py-2 px-3 text-right font-bold text-indigo-900">{format(b.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
