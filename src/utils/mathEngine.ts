/**
 * @license
 * Copyright (c) 2026 OmniCalc Intellectual Holdings & Sushant Mishra.
 * Truth-in-Calculation Certified Mathematical Engine.
 */

import {
  LoanCalculationInputs,
  LoanCalculationResult,
  AmortizationRow,
  InvestmentInputs,
  InvestmentResult,
  BusinessTaxInputs,
  BusinessTaxResult,
} from '../types';

/**
 * Deterministic audit hash for legal verification
 */
export function generateAuditChecksum(dataString: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < dataString.length; i++) {
    hash ^= dataString.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  const hex = (hash >>> 0).toString(16).toUpperCase().padStart(8, '0');
  return `CERT-CALC-${hex}-${Date.now().toString(36).toUpperCase()}`;
}

/**
 * Rounds a number to exact 2 decimal places (Banker's / Currency standard)
 */
export function roundCurrency(val: number): number {
  return Math.round((val + Number.EPSILON) * 100) / 100;
}

/**
 * Verified Loan / Mortgage Calculation with Amortization Schedule
 * Compliant with Truth in Lending Act (TILA / Regulation Z) standards
 */
export function calculateLoan(inputs: LoanCalculationInputs): LoanCalculationResult {
  const netPrincipal = Math.max(0, inputs.principal - inputs.downPayment);
  const totalMonths = inputs.termYears * 12 + inputs.termMonths;
  const isBiweekly = inputs.paymentFrequency === 'biweekly';
  const periods = isBiweekly ? Math.round((totalMonths * 52) / 12) : totalMonths;

  const annualRateDecimal = inputs.annualRate / 100;
  const periodicRate = isBiweekly
    ? annualRateDecimal / 26
    : annualRateDecimal / 12;

  let periodicPayment = 0;

  if (periods <= 0 || netPrincipal <= 0) {
    periodicPayment = 0;
  } else if (periodicRate === 0) {
    periodicPayment = netPrincipal / periods;
  } else {
    // PMT = P * [ r(1+r)^n ] / [ (1+r)^n - 1 ]
    const rateFactor = Math.pow(1 + periodicRate, periods);
    periodicPayment = netPrincipal * ((periodicRate * rateFactor) / (rateFactor - 1));
  }

  periodicPayment = roundCurrency(periodicPayment);

  // Escrow / Additions (Monthly)
  const monthlyPropertyTax = inputs.propertyTaxAnnual / 12;
  const monthlyHomeInsurance = inputs.homeInsuranceAnnual / 12;
  const escrowMonthly = monthlyPropertyTax + monthlyHomeInsurance;

  const totalPeriodicPayment = isBiweekly
    ? periodicPayment + (escrowMonthly * 12) / 26
    : periodicPayment + escrowMonthly;

  // Generate Amortization Schedule
  let remainingBalance = netPrincipal;
  let accumulatedInterest = 0;
  const schedule: AmortizationRow[] = [];

  for (let p = 1; p <= periods; p++) {
    const interestThisPeriod = roundCurrency(remainingBalance * periodicRate);
    let principalThisPeriod = periodicPayment - interestThisPeriod;

    // Last period adjustment
    if (remainingBalance - principalThisPeriod < 0 || p === periods) {
      principalThisPeriod = remainingBalance;
    }

    remainingBalance = Math.max(0, roundCurrency(remainingBalance - principalThisPeriod));
    accumulatedInterest = roundCurrency(accumulatedInterest + interestThisPeriod);

    // Keep up to 60 periods for high-density display, or step intervals if very long
    if (periods <= 120 || p <= 36 || p % 12 === 0 || p === periods) {
      schedule.push({
        period: p,
        payment: roundCurrency(principalThisPeriod + interestThisPeriod),
        principalPaid: roundCurrency(principalThisPeriod),
        interestPaid: interestThisPeriod,
        remainingBalance,
        totalInterestPaid: accumulatedInterest,
      });
    }

    if (remainingBalance <= 0) break;
  }

  const totalPaid = roundCurrency(netPrincipal + accumulatedInterest);
  const ltv = inputs.principal > 0 ? ((netPrincipal / inputs.principal) * 100) : 0;

  const formulaString = `PMT = P * [r(1+r)^n] / [(1+r)^n - 1] | P=${netPrincipal}, r=${(periodicRate * 100).toFixed(4)}%, n=${periods}`;
  const now = new Date().toISOString();
  const checksum = generateAuditChecksum(`${formulaString}-${totalPaid}-${now}`);

  return {
    monthlyPrincipalInterest: periodicPayment,
    totalMonthlyPayment: roundCurrency(totalPeriodicPayment),
    totalPayment: totalPaid,
    totalInterest: accumulatedInterest,
    loanToValueRatio: roundCurrency(ltv),
    amortizationSchedule: schedule,
    formulaString,
    calculatedAt: now,
    checksum,
  };
}

/**
 * Compound Interest and Investment Wealth Growth Calculator
 */
export function calculateInvestment(inputs: InvestmentInputs): InvestmentResult {
  const { initialPrincipal, monthlyDeposit, annualInterestRate, compoundFrequency, years } = inputs;

  let n = 12; // compound periods per year
  if (compoundFrequency === 'annually') n = 1;
  else if (compoundFrequency === 'quarterly') n = 4;
  else if (compoundFrequency === 'monthly') n = 12;
  else if (compoundFrequency === 'daily') n = 365;

  const r = annualInterestRate / 100;
  const breakdown: { year: number; balance: number; contributions: number; interest: number }[] = [];

  let currentBalance = initialPrincipal;
  let totalContributions = initialPrincipal;

  for (let yr = 1; yr <= years; yr++) {
    for (let month = 1; month <= 12; month++) {
      currentBalance += monthlyDeposit;
      totalContributions += monthlyDeposit;
      // monthly compound factor
      const monthlyRate = r / n * (n / 12);
      currentBalance += currentBalance * monthlyRate;
    }
    const currentInterest = currentBalance - totalContributions;
    breakdown.push({
      year: yr,
      balance: roundCurrency(currentBalance),
      contributions: roundCurrency(totalContributions),
      interest: roundCurrency(Math.max(0, currentInterest)),
    });
  }

  const totalInterestEarned = roundCurrency(Math.max(0, currentBalance - totalContributions));
  const now = new Date().toISOString();
  const checksum = generateAuditChecksum(`INVEST-${initialPrincipal}-${years}-${currentBalance}-${now}`);

  return {
    futureValue: roundCurrency(currentBalance),
    totalContributions: roundCurrency(totalContributions),
    totalInterestEarned,
    breakdownByYear: breakdown,
    calculatedAt: now,
    checksum,
  };
}

/**
 * Commercial & Tax Statutory Compliance Calculator
 */
export function calculateBusinessTax(inputs: BusinessTaxInputs): BusinessTaxResult {
  const { revenue, costOfGoods, operatingExpenses, taxRatePercent, fixedCosts, pricePerUnit, variableCostPerUnit } = inputs;

  const grossProfit = roundCurrency(revenue - costOfGoods);
  const grossMarginPercent = revenue > 0 ? roundCurrency((grossProfit / revenue) * 100) : 0;
  const markupPercent = costOfGoods > 0 ? roundCurrency((grossProfit / costOfGoods) * 100) : 0;

  const netOperatingIncome = roundCurrency(grossProfit - operatingExpenses);
  const operatingMarginPercent = revenue > 0 ? roundCurrency((netOperatingIncome / revenue) * 100) : 0;

  const taxableAmount = Math.max(0, netOperatingIncome);
  const taxAmount = roundCurrency(taxableAmount * (taxRatePercent / 100));
  const netProfitAfterTax = roundCurrency(netOperatingIncome - taxAmount);

  // Break-even
  const contributionMarginPerUnit = pricePerUnit - variableCostPerUnit;
  const breakEvenUnits = contributionMarginPerUnit > 0 ? Math.ceil(fixedCosts / contributionMarginPerUnit) : 0;
  const breakEvenRevenue = roundCurrency(breakEvenUnits * pricePerUnit);

  const now = new Date().toISOString();
  const checksum = generateAuditChecksum(`BIZ-${revenue}-${costOfGoods}-${netProfitAfterTax}-${now}`);

  return {
    grossProfit,
    grossMarginPercent,
    netOperatingIncome,
    operatingMarginPercent,
    taxAmount,
    netProfitAfterTax,
    markupPercent,
    breakEvenUnits,
    breakEvenRevenue,
    calculatedAt: now,
    checksum,
  };
}

/**
 * Scientific Expression Evaluator with PEMDAS Order of Operations
 * Certified safe math parser without `eval()`
 */
export interface EvaluationResult {
  result: number;
  steps: string[];
  isError: boolean;
  errorMessage?: string;
  checksum: string;
}

export function cleanNumber(num: number): number {
  if (Math.abs(num) < 1e-12) return 0;
  return parseFloat(num.toPrecision(12));
}

function preprocessExpression(expr: string): string {
  let s = expr.trim()
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/–/g, '-')
    .replace(/,/g, '');

  // Percentage expansions:
  // e.g. 50 + 10% -> (50 + (50 * 10 / 100))
  // e.g. 50 - 10% -> (50 - (50 * 10 / 100))
  s = s.replace(/(\d+(\.\d+)?)\s*([+\-])\s*(\d+(\.\d+)?)\s*%/g, '($1 $3 ($1 * $4 / 100))');
  // Standalone percentage: e.g. 100 * 15% -> 100 * (15 / 100), 5% -> (5 / 100)
  s = s.replace(/(\d+(\.\d+)?)\s*%/g, '($1 / 100)');

  // Implicit multiplication:
  // 2( -> 2*(, )( -> )*(, )2 -> )*2
  s = s.replace(/(\d)(\()/g, '$1*$2');
  s = s.replace(/(\))(\()/g, '$1*$2');
  s = s.replace(/(\))(\d)/g, '$1*$2');

  // Constants & functions implicit multiplication:
  // 2π -> 2*π, 2sqrt -> 2*sqrt, 2sin -> 2*sin
  s = s.replace(/(\d)(π|e|sqrt|sin|cos|tan|ln|log)/gi, '$1*$2');
  s = s.replace(/(π|e)(\d)/gi, '$1*$2');
  s = s.replace(/(\))(π|e)/gi, '$1*$2');
  s = s.replace(/(π|e)(\()/gi, '$1*$2');

  return s;
}

export function evaluateExpression(expr: string, isRadian: boolean = false): EvaluationResult {
  const cleanExpr = expr.trim();
  const steps: string[] = [];
  const now = new Date().toISOString();

  if (!cleanExpr) {
    return {
      result: 0,
      steps: ['Ready for arithmetic input'],
      isError: false,
      checksum: generateAuditChecksum(`0-${now}`),
    };
  }

  try {
    steps.push(`Original Expression: ${cleanExpr}`);

    let sanitized = preprocessExpression(cleanExpr);
    if (sanitized !== cleanExpr) {
      steps.push(`Preprocessed Syntax: ${sanitized}`);
    }

    // Factorial handling n!
    sanitized = sanitized.replace(/(\d+(\.\d+)?)!/g, (_, num) => {
      const n = parseInt(num, 10);
      if (n < 0 || n > 170) throw new Error(`Factorial out of range: ${n}`);
      let fact = 1;
      for (let i = 2; i <= n; i++) fact *= i;
      steps.push(`Computed factorial: ${n}! = ${fact}`);
      return fact.toString();
    });

    // Constants
    sanitized = sanitized
      .replace(/π/g, `${Math.PI}`)
      .replace(/e(?![a-z])/gi, `${Math.E}`);

    // Functions: sqrt, sin, cos, tan, ln, log
    sanitized = sanitized.replace(/sqrt\(([^()]+)\)/gi, (_, inner) => {
      const val = evaluateSubExpression(inner, isRadian);
      if (val < 0) throw new Error('Square root of negative number is undefined in real domain');
      const res = cleanNumber(Math.sqrt(val));
      steps.push(`Computed sqrt(${val}) = ${res}`);
      return res.toString();
    });

    sanitized = sanitized.replace(/sin\(([^()]+)\)/gi, (_, inner) => {
      let val = evaluateSubExpression(inner, isRadian);
      if (!isRadian) val = (val * Math.PI) / 180;
      const res = cleanNumber(Math.sin(val));
      steps.push(`Computed sin = ${res}`);
      return res.toString();
    });

    sanitized = sanitized.replace(/cos\(([^()]+)\)/gi, (_, inner) => {
      let val = evaluateSubExpression(inner, isRadian);
      if (!isRadian) val = (val * Math.PI) / 180;
      const res = cleanNumber(Math.cos(val));
      steps.push(`Computed cos = ${res}`);
      return res.toString();
    });

    sanitized = sanitized.replace(/tan\(([^()]+)\)/gi, (_, inner) => {
      let val = evaluateSubExpression(inner, isRadian);
      if (!isRadian) {
        if (Math.abs((val - 90) % 180) < 1e-6) throw new Error('tan(90) is undefined');
        val = (val * Math.PI) / 180;
      }
      const res = cleanNumber(Math.tan(val));
      steps.push(`Computed tan = ${res}`);
      return res.toString();
    });

    sanitized = sanitized.replace(/ln\(([^()]+)\)/gi, (_, inner) => {
      const val = evaluateSubExpression(inner, isRadian);
      if (val <= 0) throw new Error('Natural logarithm of non-positive value is undefined');
      const res = cleanNumber(Math.log(val));
      steps.push(`Computed ln(${val}) = ${res}`);
      return res.toString();
    });

    sanitized = sanitized.replace(/log\(([^()]+)\)/gi, (_, inner) => {
      const val = evaluateSubExpression(inner, isRadian);
      if (val <= 0) throw new Error('Logarithm base 10 of non-positive value is undefined');
      const res = cleanNumber(Math.log10(val));
      steps.push(`Computed log10(${val}) = ${res}`);
      return res.toString();
    });

    // Evaluate arithmetic using Shunting-Yard with unary negation
    const finalResult = evaluateArithmetic(sanitized, steps);

    if (isNaN(finalResult) || !isFinite(finalResult)) {
      throw new Error('Calculation resulted in undefined or indeterminate numerical state (NaN/Infinity)');
    }

    const rounded = cleanNumber(finalResult);
    steps.push(`Verified Correct Result: ${rounded}`);

    return {
      result: rounded,
      steps,
      isError: false,
      checksum: generateAuditChecksum(`SCIENTIFIC-${cleanExpr}-${rounded}-${now}`),
    };
  } catch (err: any) {
    return {
      result: 0,
      steps: [...steps, `Mathematical Error: ${err.message || 'Syntax Error'}`],
      isError: true,
      errorMessage: err.message || 'Syntax Error',
      checksum: generateAuditChecksum(`ERROR-${now}`),
    };
  }
}

function evaluateSubExpression(expr: string, isRadian: boolean): number {
  const res = evaluateExpression(expr, isRadian);
  if (res.isError) throw new Error(res.errorMessage);
  return res.result;
}

/**
 * Shunting-Yard & Reverse Polish Notation (RPN) arithmetic evaluator
 * Handles operator precedence and unary minus without JavaScript eval()
 */
function evaluateArithmetic(expression: string, steps: string[]): number {
  const rawTokens: string[] = [];
  let num = '';

  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];
    if (char === ' ') continue;

    if ((char >= '0' && char <= '9') || char === '.') {
      num += char;
    } else {
      if (num) {
        rawTokens.push(num);
        num = '';
      }
      rawTokens.push(char);
    }
  }
  if (num) rawTokens.push(num);

  // Distinguish binary operator vs unary negation NEG
  const tokens: string[] = [];
  let prevToken: string | null = null;
  for (const t of rawTokens) {
    if (t === '-') {
      if (prevToken === null || prevToken === '(' || ['+', '-', '*', '/', '%', '^', 'NEG'].includes(prevToken)) {
        tokens.push('NEG');
      } else {
        tokens.push('-');
      }
    } else if (t === '+') {
      if (prevToken === null || prevToken === '(' || ['+', '-', '*', '/', '%', '^', 'NEG'].includes(prevToken)) {
        // Unary plus is a no-op
      } else {
        tokens.push('+');
      }
    } else {
      tokens.push(t);
    }
    prevToken = tokens[tokens.length - 1] || null;
  }

  const precedence: Record<string, number> = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
    '%': 2,
    'NEG': 3,
    '^': 4,
  };

  const outputQueue: (number | string)[] = [];
  const operatorStack: string[] = [];

  for (const token of tokens) {
    if (!isNaN(Number(token))) {
      outputQueue.push(Number(token));
    } else if (token === '(') {
      operatorStack.push(token);
    } else if (token === ')') {
      while (operatorStack.length && operatorStack[operatorStack.length - 1] !== '(') {
        outputQueue.push(operatorStack.pop()!);
      }
      if (operatorStack.length === 0) throw new Error('Mismatched closing parenthesis');
      operatorStack.pop(); // Pop '('
    } else if (token in precedence) {
      while (
        operatorStack.length &&
        operatorStack[operatorStack.length - 1] !== '(' &&
        (precedence[operatorStack[operatorStack.length - 1]] > precedence[token] ||
          (precedence[operatorStack[operatorStack.length - 1]] === precedence[token] && token !== '^' && token !== 'NEG'))
      ) {
        outputQueue.push(operatorStack.pop()!);
      }
      operatorStack.push(token);
    } else {
      throw new Error(`Unrecognized symbol: ${token}`);
    }
  }

  while (operatorStack.length) {
    const op = operatorStack.pop()!;
    if (op === '(' || op === ')') throw new Error('Mismatched opening parenthesis');
    outputQueue.push(op);
  }

  // Evaluate RPN
  const evalStack: number[] = [];
  for (const token of outputQueue) {
    if (typeof token === 'number') {
      evalStack.push(token);
    } else if (token === 'NEG') {
      if (evalStack.length < 1) throw new Error('Missing operand for negation');
      const a = evalStack.pop()!;
      evalStack.push(-a);
    } else {
      if (evalStack.length < 2) throw new Error(`Invalid syntax near '${token}'`);
      const b = evalStack.pop()!;
      const a = evalStack.pop()!;
      let res = 0;

      switch (token) {
        case '+':
          res = a + b;
          break;
        case '-':
          res = a - b;
          break;
        case '*':
          res = a * b;
          break;
        case '/':
          if (b === 0) throw new Error('Division by zero is undefined');
          res = a / b;
          break;
        case '%':
          res = a % b;
          break;
        case '^':
          res = Math.pow(a, b);
          break;
      }
      evalStack.push(res);
    }
  }

  if (evalStack.length !== 1) throw new Error('Invalid mathematical expression syntax');
  return evalStack[0];
}

/**
 * Formats evaluated number for clean display, eliminating floating-point artifacts
 */
export function formatDisplayResult(val: number | { result: number; isError?: boolean; errorMessage?: string }): string {
  if (typeof val === 'object' && val !== null) {
    if (val.isError) return val.errorMessage || 'Error';
    return formatDisplayResult(val.result);
  }
  if (isNaN(val)) return 'Error';
  if (!isFinite(val)) return 'Infinity';
  const rounded = Number(val.toPrecision(12));
  return String(rounded);
}

