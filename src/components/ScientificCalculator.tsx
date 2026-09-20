/**
 * @license
 * Copyright (c) 2026 OmniCalc Intellectual Holdings & Sushant Mishra.
 * Truth-in-Calculation Precision Scientific Arithmetic Engine.
 */

import React, { useState, useMemo } from 'react';
import { evaluateExpression } from '../utils/mathEngine';
import { AuditRecord } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { CurrencyQuickBar } from './CurrencyQuickBar';
import {
  Calculator,
  ShieldCheck,
  CheckCircle,
  Copy,
  Delete,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Coins,
} from 'lucide-react';

interface ScientificCalculatorProps {
  onAddAuditRecord: (record: AuditRecord) => void;
}

export const ScientificCalculator: React.FC<ScientificCalculatorProps> = ({
  onAddAuditRecord,
}) => {
  const { currentCurrency, format, openCurrencyModal } = useCurrency();
  const [expression, setExpression] = useState<string>('25 * (14 + 6) / 2 + sqrt(144)');
  const [isRadian, setIsRadian] = useState<boolean>(false);
  const [memory, setMemory] = useState<number>(0);
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // Evaluate whenever expression or radian mode changes
  const evaluation = useMemo(() => {
    return evaluateExpression(expression, isRadian);
  }, [expression, isRadian]);

  const showToast = (msg: string) => {
    setCopiedNotification(msg);
    setTimeout(() => setCopiedNotification(null), 3000);
  };

  const handleAppend = (token: string) => {
    setExpression((prev) => prev + token);
  };

  const handleClear = () => {
    setExpression('');
  };

  const handleBackspace = () => {
    setExpression((prev) => prev.slice(0, -1));
  };

  const handleCopyResult = () => {
    if (!evaluation.isError) {
      navigator.clipboard?.writeText(evaluation.result.toString());
      showToast(`Copied ${evaluation.result} to clipboard`);
    }
  };

  const handleCopyFormattedCurrency = () => {
    if (!evaluation.isError) {
      const formatted = format(evaluation.result);
      navigator.clipboard?.writeText(formatted);
      showToast(`Copied ${formatted} (${currentCurrency.code}) to clipboard`);
    }
  };

  const handleLogToAudit = () => {
    if (evaluation.isError || !expression.trim()) return;

    const record: AuditRecord = {
      id: evaluation.checksum,
      timestamp: new Date().toISOString(),
      category: 'Scientific Arithmetic',
      title: `Scientific Eval: ${expression.slice(0, 30)}...`,
      formula: `PEMDAS / IEEE 754 Evaluator [Angle Mode: ${isRadian ? 'RAD' : 'DEG'}]`,
      inputs: {
        'Mathematical Expression': expression,
        'Trigonometric Mode': isRadian ? 'Radians' : 'Degrees',
        'Active Standard Currency': `${currentCurrency.name} (${currentCurrency.code} ${currentCurrency.symbol})`,
      },
      results: {
        'Computed Correct Result': evaluation.result,
        [`Valuation in ${currentCurrency.code}`]: format(evaluation.result),
        'Intermediate Reduction Steps': evaluation.steps.length,
      },
      checksum: evaluation.checksum,
      legalStatus: 'VERIFIED_COMPLIANT',
      currency: {
        code: currentCurrency.code,
        symbol: currentCurrency.symbol,
        flag: currentCurrency.flag,
        name: currentCurrency.name,
      },
    };
    onAddAuditRecord(record);
    showToast('Logged calculation to Legal Audit Ledger');
  };

  // Memory Functions
  const handleMemoryAdd = () => {
    if (!evaluation.isError) {
      setMemory((prev) => prev + evaluation.result);
      showToast(`M+ added ${evaluation.result} (Memory: ${memory + evaluation.result})`);
    }
  };

  const handleMemoryRecall = () => {
    setExpression((prev) => prev + memory.toString());
  };

  const handleMemoryClear = () => {
    setMemory(0);
    showToast('Memory Cleared (MC)');
  };

  const buttons = [
    // Row 1
    { label: 'RAD/DEG', action: () => setIsRadian(!isRadian), className: 'bg-slate-700 text-amber-400 font-mono text-xs' },
    { label: 'MC', action: handleMemoryClear, className: 'bg-slate-800 text-slate-300 font-mono text-xs' },
    { label: 'MR', action: handleMemoryRecall, className: 'bg-slate-800 text-slate-300 font-mono text-xs' },
    { label: 'M+', action: handleMemoryAdd, className: 'bg-slate-800 text-slate-300 font-mono text-xs' },
    { label: 'C', action: handleClear, className: 'bg-rose-900/60 text-rose-300 hover:bg-rose-800 font-bold' },
    { label: '⌫', action: handleBackspace, className: 'bg-slate-800 text-slate-300 hover:bg-slate-700' },

    // Row 2
    { label: 'sin', action: () => handleAppend('sin('), className: 'bg-slate-800 text-indigo-300' },
    { label: 'cos', action: () => handleAppend('cos('), className: 'bg-slate-800 text-indigo-300' },
    { label: 'tan', action: () => handleAppend('tan('), className: 'bg-slate-800 text-indigo-300' },
    { label: '(', action: () => handleAppend('('), className: 'bg-slate-800 text-slate-300' },
    { label: ')', action: () => handleAppend(')'), className: 'bg-slate-800 text-slate-300' },
    { label: '÷', action: () => handleAppend(' / '), className: 'bg-emerald-800 text-emerald-100 font-bold text-lg' },

    // Row 3
    { label: 'ln', action: () => handleAppend('ln('), className: 'bg-slate-800 text-indigo-300' },
    { label: 'log', action: () => handleAppend('log('), className: 'bg-slate-800 text-indigo-300' },
    { label: '7', action: () => handleAppend('7'), className: 'bg-slate-900 text-white text-base font-semibold' },
    { label: '8', action: () => handleAppend('8'), className: 'bg-slate-900 text-white text-base font-semibold' },
    { label: '9', action: () => handleAppend('9'), className: 'bg-slate-900 text-white text-base font-semibold' },
    { label: '×', action: () => handleAppend(' * '), className: 'bg-emerald-800 text-emerald-100 font-bold text-lg' },

    // Row 4
    { label: '√x', action: () => handleAppend('sqrt('), className: 'bg-slate-800 text-indigo-300' },
    { label: 'x^y', action: () => handleAppend('^'), className: 'bg-slate-800 text-indigo-300' },
    { label: '4', action: () => handleAppend('4'), className: 'bg-slate-900 text-white text-base font-semibold' },
    { label: '5', action: () => handleAppend('5'), className: 'bg-slate-900 text-white text-base font-semibold' },
    { label: '6', action: () => handleAppend('6'), className: 'bg-slate-900 text-white text-base font-semibold' },
    { label: '−', action: () => handleAppend(' - '), className: 'bg-emerald-800 text-emerald-100 font-bold text-lg' },

    // Row 5
    { label: 'n!', action: () => handleAppend('!'), className: 'bg-slate-800 text-indigo-300' },
    { label: 'π', action: () => handleAppend('π'), className: 'bg-slate-800 text-amber-300' },
    { label: '1', action: () => handleAppend('1'), className: 'bg-slate-900 text-white text-base font-semibold' },
    { label: '2', action: () => handleAppend('2'), className: 'bg-slate-900 text-white text-base font-semibold' },
    { label: '3', action: () => handleAppend('3'), className: 'bg-slate-900 text-white text-base font-semibold' },
    { label: '+', action: () => handleAppend(' + '), className: 'bg-emerald-800 text-emerald-100 font-bold text-lg' },

    // Row 6
    { label: 'e', action: () => handleAppend('e'), className: 'bg-slate-800 text-amber-300' },
    { label: '%', action: () => handleAppend('%'), className: 'bg-slate-800 text-indigo-300' },
    { label: '0', action: () => handleAppend('0'), className: 'bg-slate-900 text-white text-base font-semibold' },
    { label: '.', action: () => handleAppend('.'), className: 'bg-slate-900 text-white text-base font-semibold' },
    { label: '00', action: () => handleAppend('00'), className: 'bg-slate-900 text-white text-base font-semibold' },
    { label: '=', action: handleLogToAudit, className: 'bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xl' },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {copiedNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-emerald-400 border border-emerald-500/40 px-4 py-2.5 rounded-lg shadow-xl text-xs font-mono flex items-center space-x-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{copiedNotification}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Precision Scientific Arithmetic Engine
            </h1>
            <span className="text-xs bg-indigo-100 text-indigo-800 font-semibold px-2 py-0.5 rounded border border-indigo-200">
              Strict PEMDAS / IEEE 754
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Deterministic token evaluation eliminating JavaScript floating-point errors. Every calculation
            generates an audited verification proof with full operator precedence breakdown.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-500 font-mono">
            Angle Mode: <strong className="text-slate-800">{isRadian ? 'RADIANS' : 'DEGREES'}</strong>
          </span>
          <button
            onClick={() => setIsRadian(!isRadian)}
            className="text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
          >
            Switch to {isRadian ? 'Deg' : 'Rad'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calculator Display & Tactile Keypad */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl text-white space-y-4">
          {/* Dual Digital Screen */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-inner">
            <div className="flex justify-between text-[11px] text-slate-400 font-mono mb-1">
              <span>EXPRESSION (PEMDAS)</span>
              <span>MEMORY: {memory !== 0 ? memory : '0'}</span>
            </div>

            <input
              id="input-scientific-expression"
              type="text"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              placeholder="Enter equation e.g. 50 * (12 + 3) / 2"
              className="w-full bg-transparent text-slate-300 font-mono text-sm sm:text-base border-none outline-hidden"
            />

            <div className="mt-3 pt-3 border-t border-slate-800 flex items-baseline justify-between">
              <span className="text-xs text-slate-400 font-mono">CORRECT RESULT:</span>
              <div className="text-right">
                {evaluation.isError ? (
                  <span className="text-rose-400 text-sm font-mono font-bold">
                    {evaluation.errorMessage || 'Syntax Error'}
                  </span>
                ) : (
                  <div>
                    <div className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400 tracking-tight">
                      {evaluation.result.toLocaleString('en-US', { maximumFractionDigits: 10 })}
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyFormattedCurrency}
                      title={`Click to copy formatted in ${currentCurrency.name}`}
                      className="inline-flex items-center space-x-1.5 mt-1 text-[11px] font-mono text-emerald-300 hover:text-white bg-slate-800 hover:bg-slate-750 px-2 py-0.5 rounded border border-slate-700 cursor-pointer transition-colors"
                    >
                      <span>{currentCurrency.flag}</span>
                      <span>Valuation ({currentCurrency.code}):</span>
                      <strong className="text-emerald-400">{format(evaluation.result)}</strong>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions Row */}
          <div className="flex flex-wrap items-center justify-between text-xs px-1 gap-2">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleCopyResult}
                className="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Numeric</span>
              </button>
              <button
                onClick={handleCopyFormattedCurrency}
                className="flex items-center space-x-1 text-slate-400 hover:text-emerald-300 transition-colors cursor-pointer"
              >
                <Coins className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copy {currentCurrency.code}</span>
              </button>
            </div>

            <button
              id="btn-scientific-audit"
              onClick={handleLogToAudit}
              className="flex items-center space-x-1.5 bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg transition-colors font-medium shadow-xs cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Verify & Log to Audit</span>
            </button>
          </div>

          {/* Keypad Grid (6 columns x 6 rows) */}
          <div className="grid grid-cols-6 gap-2 pt-1">
            {buttons.map((btn, idx) => (
              <button
                key={idx}
                id={`calc-key-${idx}`}
                onClick={btn.action}
                className={`h-11 sm:h-12 rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-sm select-none ${btn.className}`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Verification & Step-by-Step Proof Column */}
        <div className="lg:col-span-5 space-y-4">
          <CurrencyQuickBar label="Evaluation Currency" className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs" />

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Mathematical Audit & Proof Steps
                </h2>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Deterministic
              </span>
            </div>

            <div className="mt-3 space-y-2 max-h-80 overflow-y-auto pr-1">
              {evaluation.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 text-xs font-mono text-slate-700 flex items-start space-x-2"
                >
                  <span className="text-slate-400 font-bold shrink-0">#{idx + 1}</span>
                  <span className="break-all">{step}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1.5">
              <div className="flex justify-between">
                <span>Cryptographic Checksum:</span>
                <span className="font-mono font-medium text-slate-700">
                  {evaluation.checksum.slice(0, 18)}...
                </span>
              </div>
              <div className="flex justify-between">
                <span>Standard Adherence:</span>
                <span className="font-medium text-slate-700">ISO/IEC 60559:2020</span>
              </div>
            </div>
          </div>

          {/* Quick Preset Equations */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Verified Benchmark Equations
            </h3>
            <div className="space-y-1.5">
              {[
                { title: 'Standard Compound Order', eq: '100 * (1 + 0.05 / 12)^(12 * 5)' },
                { title: 'Pythagorean Hypotenuse', eq: 'sqrt(3^2 + 4^2)' },
                { title: 'Trigonometric Wave', eq: 'sin(30) + cos(60)' },
                { title: 'Factorial Permutation', eq: '6! / (2! * (6 - 2)!)' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setExpression(item.eq)}
                  className="w-full text-left text-xs p-2 rounded-lg hover:bg-slate-50 border border-slate-100 transition-colors flex items-center justify-between text-slate-700 group"
                >
                  <span className="font-medium">{item.title}</span>
                  <span className="font-mono text-slate-400 group-hover:text-emerald-600 text-[11px]">
                    {item.eq}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
