/**
 * @license
 * Copyright © 2026 Sushant Mishra. All Rights Reserved.
 * Sole Proprietor & Copyright Owner: Sushant Mishra (sushantmishra20006@gmail.com).
 * Complete Legal, Trademark, Copyright & Precision Calculation Application.
 */

export type ScreenType = 'financial' | 'scientific' | 'business' | 'converter' | 'audit' | 'legal' | 'screens';

export interface LoanCalculationInputs {
  principal: number;
  annualRate: number; // in percentage e.g. 5.5
  termYears: number;
  termMonths: number;
  downPayment: number;
  propertyTaxAnnual: number;
  homeInsuranceAnnual: number;
  paymentFrequency: 'monthly' | 'biweekly';
}

export interface AmortizationRow {
  period: number;
  payment: number;
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
  totalInterestPaid: number;
}

export interface LoanCalculationResult {
  monthlyPrincipalInterest: number;
  totalMonthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  loanToValueRatio: number;
  amortizationSchedule: AmortizationRow[];
  formulaString: string;
  calculatedAt: string;
  checksum: string;
}

export interface InvestmentInputs {
  initialPrincipal: number;
  monthlyDeposit: number;
  annualInterestRate: number;
  compoundFrequency: 'annually' | 'quarterly' | 'monthly' | 'daily';
  years: number;
}

export interface InvestmentResult {
  futureValue: number;
  totalContributions: number;
  totalInterestEarned: number;
  breakdownByYear: {
    year: number;
    balance: number;
    contributions: number;
    interest: number;
  }[];
  calculatedAt: string;
  checksum: string;
}

export interface BusinessTaxInputs {
  revenue: number;
  costOfGoods: number;
  operatingExpenses: number;
  taxRatePercent: number;
  fixedCosts: number;
  pricePerUnit: number;
  variableCostPerUnit: number;
}

export interface BusinessTaxResult {
  grossProfit: number;
  grossMarginPercent: number;
  netOperatingIncome: number;
  operatingMarginPercent: number;
  taxAmount: number;
  netProfitAfterTax: number;
  markupPercent: number;
  breakEvenUnits: number;
  breakEvenRevenue: number;
  calculatedAt: string;
  checksum: string;
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  category: 'Financial Loan' | 'Investment Growth' | 'Scientific Arithmetic' | 'Commercial & Tax' | 'Currency Conversion';
  title: string;
  formula: string;
  inputs: Record<string, string | number>;
  results: Record<string, string | number>;
  checksum: string;
  legalStatus: 'VERIFIED_COMPLIANT' | 'AUDIT_APPROVED';
  currency?: {
    code: string;
    symbol: string;
    flag?: string;
    name?: string;
  };
}

export interface CurrencyConversionResult {
  fromCode: string;
  toCode: string;
  fromAmount: number;
  toAmount: number;
  spotRate: number;
  spreadPercent: number;
  effectiveRate: number;
  feeDeducted: number;
  inverseRate: number;
  formulaString: string;
  calculatedAt: string;
  checksum: string;
}
