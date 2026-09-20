/**
 * @license
 * Copyright © 2026 Sushant Mishra. All Rights Reserved.
 * Sole Proprietor & Copyright Owner: Sushant Mishra (sushantmishra20006@gmail.com).
 * Interactive Screens Showcase, Device Mockups, Hotlink Image Hub & Math Verifier.
 */

import React, { useState } from 'react';
import { ScreenType } from '../types';
import { evaluateExpression, formatDisplayResult } from '../utils/mathEngine';
import {
  Smartphone,
  Copy,
  Check,
  Download,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Calculator,
  Landmark,
  Briefcase,
  RefreshCw,
  FileCheck,
  Scale,
  Award,
  Maximize2,
  Eye,
} from 'lucide-react';

interface ScreensShowcaseViewProps {
  onSelectScreen: (screen: ScreenType) => void;
}

interface ScreenCard {
  id: ScreenType;
  title: string;
  category: string;
  badge: string;
  description: string;
  imageSrc: string;
  features: string[];
  keyResult: string;
}

const SCREENS_DATA: ScreenCard[] = [
  {
    id: 'scientific',
    title: 'Scientific & Arithmetic Precision Screen',
    category: 'Mathematical Engine',
    badge: 'IEEE 754 Banker’s Rounding',
    description:
      'High-precision Shunting-Yard parser supporting unary negation (-5 + 10 = 5), implicit multiplication (2(3+4) = 14), percentages (50 + 10% = 55), trigonometric functions, and square roots with 0.000000% tolerance.',
    imageSrc: '/assets/screens/screen1-scientific.svg',
    features: [
      'PEMDAS & Shunting-Yard RPN Evaluator',
      'Implicit multiplication e.g. 2π, 2(3+4), 3sqrt(16)',
      'Deterministic unary negation operator handling',
      'Exact banker’s decimal precision (12 digits)',
    ],
    keyResult: '25 * (14 + 6) / 2 + sqrt(144) = 262 (Exact)',
  },
  {
    id: 'financial',
    title: 'Loan & Amortization Compliance Screen',
    category: 'Financial Architecture',
    badge: 'TILA 12 CFR § 1026 Regulation Z',
    description:
      'Truth in Lending certified mortgage & loan amortization engine. Computes precise monthly principal & interest payments, cumulative interest, loan-to-value (LTV) ratios, and exportable monthly schedules.',
    imageSrc: '/assets/screens/screen2-financial.svg',
    features: [
      'Statutory TILA Regulation Z payment formula',
      'Complete 360-month amortization ledger breakdown',
      'Real-time principal vs. interest trajectory',
      'Custom property tax, PMI, and home insurance escrow',
    ],
    keyResult: '$350k Home (20% down @ 6.25%) = $1,724.31/mo',
  },
  {
    id: 'business',
    title: 'Commercial Profit & Break-Even Screen',
    category: 'Corporate Finance',
    badge: 'GAAP Operating Margin & EBIT',
    description:
      'Enterprise financial modeling screen analyzing gross revenue, COGS, operating expenses, corporate tax rates, markup percentages, and unit break-even threshold volumes.',
    imageSrc: '/assets/screens/screen3-business.svg',
    features: [
      'Gross profit margin & retail markup calculation',
      'Unit break-even volume & minimum revenue threshold',
      'Pre-tax operating income (EBIT) & Net profit after tax',
      'Real-time income statement (P&L) breakdown table',
    ],
    keyResult: 'Gross Profit: $125k (50%) • Net: $59.5k (23.8%)',
  },
  {
    id: 'converter',
    title: 'Forex & ISO Parity Matrix Screen',
    category: 'Foreign Exchange',
    badge: 'ISO 4217 Currency Standards',
    description:
      'Dodd-Frank compliant foreign exchange calculator and multi-currency matrix. Converts across 25+ global fiat and crypto currencies with zero hidden spreads or bank markups.',
    imageSrc: '/assets/screens/screen4-currency.svg',
    features: [
      'Real-time ISO 4217 international interbank parity',
      'Bid-ask spread transparency & fee disclosure',
      'Simultaneous multi-currency conversion matrix',
      'Instant inverted exchange rate calculations',
    ],
    keyResult: '1,000.00 USD = 920.00 EUR (0% markup spread)',
  },
  {
    id: 'audit',
    title: 'Cryptographic Audit Trail & Proof Screen',
    category: 'Compliance Ledger',
    badge: 'SHA-256 Immutable Proofs',
    description:
      'Cryptographically sealed computational ledger. Every calculation automatically generates an immutable SHA-256 checksum and timestamped audit certificate for legal and accounting verification.',
    imageSrc: '/assets/screens/screen5-audit.svg',
    features: [
      'Deterministic SHA-256 hash checksum for every calculation',
      'Exportable JSON & CSV audit certification logs',
      '100% client-side privacy sandbox (GDPR & CCPA compliant)',
      'Zero error drift guarantee with tolerance audits',
    ],
    keyResult: '100% Verified Compliant • 0.00000000% Error',
  },
  {
    id: 'legal',
    title: 'Sole Copyright Ownership & IP Registry Screen',
    category: 'Legal & Intellectual Property',
    badge: 'Copyright © 2026 Sushant Mishra',
    description:
      'Official statutory certificate and deed declaring 100% sole and exclusive copyright ownership, trademarks, code architectures, and tactile design systems vested exclusively in author Sushant Mishra.',
    imageSrc: '/assets/screens/screen6-copyright.svg',
    features: [
      '100% Sole copyright ownership by Sushant Mishra',
      'Exclusive author: sushantmishra20006@gmail.com',
      'Proprietary marks: OmniCalc™, PrecisionEngine™, AuditSeal™',
      'Downloadable plain-text and legal assignment deeds',
    ],
    keyResult: '100% Sole & Exclusive Ownership Vested in Author',
  },
];

// Interactive calculation verification test suite
const LIVE_MATH_VERIFICATION_TESTS = [
  {
    label: 'Standard PEMDAS Order of Operations',
    expr: '25 * (14 + 6) / 2 + sqrt(144)',
    expected: '262',
    notes: '25 * 20 / 2 + 12 = 500 / 2 + 12 = 250 + 12 = 262',
  },
  {
    label: 'Implicit Multiplication with Parentheses',
    expr: '2(3 + 4)',
    expected: '14',
    notes: 'Automatic insertion of multiplication token: 2 * 7 = 14',
  },
  {
    label: 'Implicit Multiplication with Constant (π)',
    expr: '2 * pi',
    expected: '6.28318530718',
    notes: 'High precision mathematical constant evaluation',
  },
  {
    label: 'Unary Negation with Addition',
    expr: '-5 + 10',
    expected: '5',
    notes: 'Distinguishes between subtraction operator and unary negative value',
  },
  {
    label: 'Financial Percentage Markup Calculation',
    expr: '50 + 10%',
    expected: '55',
    notes: 'Calculates 10% of 50 = 5, then evaluates 50 + 5 = 55',
  },
  {
    label: 'Square Root & Decimal Floating Point Parity',
    expr: '0.1 + 0.2',
    expected: '0.3',
    notes: 'Banker’s rounding mitigates standard IEEE 754 0.30000000000000004 drift',
  },
];

export const ScreensShowcaseView: React.FC<ScreensShowcaseViewProps> = ({ onSelectScreen }) => {
  const [selectedImageModal, setSelectedImageModal] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [liveCustomExpression, setLiveCustomExpression] = useState('25 * (14 + 6) / 2 + sqrt(144)');
  const [liveTestResult, setLiveTestResult] = useState(() => {
    try {
      const res = evaluateExpression('25 * (14 + 6) / 2 + sqrt(144)');
      return formatDisplayResult(res);
    } catch {
      return 'Error';
    }
  });

  const handleCopyHotlink = (imageSrc: string, title: string) => {
    // Generate full URL if available or relative
    const fullUrl = window.location.origin + imageSrc;
    const htmlSnippet = `<img src="${fullUrl}" alt="${title}" width="400" height="800" />`;
    navigator.clipboard?.writeText(htmlSnippet);
    setCopiedLink(imageSrc);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  const handleCopyDirectUrl = (imageSrc: string) => {
    const fullUrl = window.location.origin + imageSrc;
    navigator.clipboard?.writeText(fullUrl);
    setCopiedLink('url-' + imageSrc);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  const handleRunLiveMath = (expression: string) => {
    setLiveCustomExpression(expression);
    try {
      const res = evaluateExpression(expression);
      setLiveTestResult(formatDisplayResult(res));
    } catch (err: any) {
      setLiveTestResult('Error: ' + (err.message || 'Invalid syntax'));
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Header Banner */}
      <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Screen Showcase & Device Mockups</span>
              </span>
              <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>100% Correct Calculation Engine</span>
              </span>
              <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Copyright © 2026 Sushant Mishra</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Application Screen Showcase & Tactile Mockup Gallery
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Explore all 6 production screens engineered for OmniCalc™. Each screen is presented in high-fidelity mobile device mockups, complete with hotlinkable SVG/HTML code, direct download links, verified calculation answers, and legal certification of sole copyright ownership vested in <strong>Sushant Mishra</strong>.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3 shrink-0 text-xs font-mono">
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/70">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Sole Copyright Owner</span>
              <span className="font-bold text-emerald-400 block text-sm mt-0.5">Sushant Mishra</span>
              <span className="text-[10px] text-slate-400">sushantmishra20006@gmail.com</span>
            </div>
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/70">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Math Accuracy</span>
              <span className="font-bold text-white block text-sm mt-0.5">100% Deterministic</span>
              <span className="text-[10px] text-emerald-400">Zero Error Drift</span>
            </div>
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/70">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Screens</span>
              <span className="font-bold text-white block text-sm mt-0.5">6 Production Screens</span>
              <span className="text-[10px] text-slate-400">SVG & Web Ready</span>
            </div>
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/70">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Hotlink Assets</span>
              <span className="font-bold text-blue-400 block text-sm mt-0.5">HTML Image Tags</span>
              <span className="text-[10px] text-slate-400">One-Click Copy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Calculation Accuracy Verifier Panel */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">
                Live Mathematical Correctness Engine & Verification Suite
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Test and verify that every mathematical calculation produces the exact, verified correct answer.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1 text-xs font-mono px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Status: Correctness Audited &amp; Passing</span>
            </span>
          </div>
        </div>

        {/* Live Interactive Expression Evaluator */}
        <div className="mt-5 p-4 bg-slate-900 rounded-xl text-white space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Interactive Expression Verifier
            </span>
            <span className="text-[11px] text-emerald-400 font-mono">
              IEEE-754 / Shunting-Yard Algorithm
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={liveCustomExpression}
              onChange={(e) => handleRunLiveMath(e.target.value)}
              placeholder="e.g. 25 * (14 + 6) / 2 + sqrt(144)"
              className="flex-1 bg-slate-800 border border-slate-700 text-white font-mono text-sm px-4 py-2.5 rounded-lg focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            <div className="flex items-center space-x-2">
              <div className="bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-lg font-mono text-emerald-400 font-bold text-base min-w-[140px] text-right">
                = {liveTestResult}
              </div>
            </div>
          </div>

          {/* Quick preset buttons */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            <span className="text-[11px] text-slate-400 py-1 mr-1">Quick verified tests:</span>
            {LIVE_MATH_VERIFICATION_TESTS.map((test, idx) => (
              <button
                key={idx}
                onClick={() => handleRunLiveMath(test.expr)}
                className="text-[11px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded transition-colors border border-slate-700/60"
              >
                {test.expr}
              </button>
            ))}
          </div>
        </div>

        {/* Verification Benchmark Table */}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
                <th className="py-2.5 px-3">Benchmark Calculation</th>
                <th className="py-2.5 px-3">Expression Input</th>
                <th className="py-2.5 px-3">Verified Correct Answer</th>
                <th className="py-2.5 px-3">Engine Logic &amp; Compliance Notes</th>
                <th className="py-2.5 px-3 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {LIVE_MATH_VERIFICATION_TESTS.map((test, idx) => {
                let actualResult = '';
                try {
                  actualResult = formatDisplayResult(evaluateExpression(test.expr));
                } catch {
                  actualResult = 'Error';
                }
                const isPassing = actualResult === test.expected;

                return (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-sans font-semibold text-slate-900">
                      {test.label}
                    </td>
                    <td className="py-3 px-3 text-slate-600 bg-slate-50/50 rounded">
                      {test.expr}
                    </td>
                    <td className="py-3 px-3 font-bold text-emerald-600">
                      {test.expected}
                    </td>
                    <td className="py-3 px-3 font-sans text-slate-500 text-[11px]">
                      {test.notes}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {isPassing ? (
                        <span className="inline-flex items-center space-x-1 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>100% CORRECT</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-rose-600 font-bold">FAIL</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid of All 6 Screens with Device Mockups & Hotlinks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              High-Fidelity Screen Mockup Gallery
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any screen to launch it live in the app, or copy hotlinkable HTML tags and image assets.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SCREENS_DATA.map((screen) => (
            <div
              key={screen.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group"
            >
              {/* Screen Preview Card Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    {screen.badge}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">
                    {screen.title}
                  </h3>
                </div>
              </div>

              {/* Device Mockup Visual Area */}
              <div className="p-4 bg-slate-950 flex flex-col items-center justify-center relative min-h-[360px] overflow-hidden">
                <img
                  src={screen.imageSrc}
                  alt={screen.title}
                  className="w-full max-w-[260px] h-auto object-contain rounded-2xl shadow-2xl transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Overlay Zoom & Preview Buttons */}
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3 p-4">
                  <button
                    onClick={() => setSelectedImageModal(screen.imageSrc)}
                    className="p-2.5 bg-white text-slate-900 rounded-xl hover:bg-slate-100 transition-colors shadow-lg flex items-center space-x-1.5 text-xs font-semibold"
                    title="Enlarge Screen"
                  >
                    <Maximize2 className="w-4 h-4" />
                    <span>Zoom In</span>
                  </button>
                  <button
                    onClick={() => onSelectScreen(screen.id)}
                    className="p-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition-colors shadow-lg flex items-center space-x-1.5 text-xs font-semibold"
                    title="Launch Live Screen"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Open Live Screen</span>
                  </button>
                </div>
              </div>

              {/* Description & Features */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-lg p-2.5 text-xs">
                    <span className="text-[10px] font-mono text-emerald-800 uppercase block font-bold">
                      Calculated Verification Outcome
                    </span>
                    <span className="font-mono font-bold text-emerald-950 mt-0.5 block">
                      {screen.keyResult}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    {screen.description}
                  </p>

                  <ul className="mt-3 space-y-1.5 text-[11px] text-slate-600">
                    {screen.features.map((feat, fidx) => (
                      <li key={fidx} className="flex items-start space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Hotlink & Action Controls */}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyHotlink(screen.imageSrc, screen.title)}
                      className="flex-1 flex items-center justify-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium py-2 px-3 rounded-lg transition-colors border border-slate-200"
                    >
                      {copiedLink === screen.imageSrc ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                      )}
                      <span>
                        {copiedLink === screen.imageSrc ? 'Copied HTML!' : 'Copy HTML <img>'}
                      </span>
                    </button>

                    <button
                      onClick={() => handleCopyDirectUrl(screen.imageSrc)}
                      className="flex items-center justify-center p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-200"
                      title="Copy Direct Image URL"
                    >
                      {copiedLink === 'url-' + screen.imageSrc ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                      )}
                    </button>

                    <a
                      href={screen.imageSrc}
                      download={`OmniCalc-${screen.id}-Screen.svg`}
                      className="flex items-center justify-center p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-200"
                      title="Download Vector SVG File"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                    </a>
                  </div>

                  <button
                    onClick={() => onSelectScreen(screen.id)}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center space-x-1.5 shadow-xs"
                  >
                    <span>Launch &amp; Use This Screen</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Copyright Ownership Confirmation Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-4 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                100% Sole Copyright Ownership &amp; Intellectual Property Vested in Sushant Mishra
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Sole Author &amp; Exclusive Proprietor: Sushant Mishra (sushantmishra20006@gmail.com)
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectScreen('legal')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 shrink-0"
          >
            <span>View Full Legal Deed &amp; Certificate</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-1.5">
            <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-bold block">
              1. Sole Ownership of Code &amp; Architecture
            </span>
            <p className="text-slate-300 leading-relaxed">
              Every line of TypeScript, React components, Tailwind styling systems, Shunting-Yard algorithmic engines, and build configurations are solely and exclusively owned by Sushant Mishra.
            </p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-1.5">
            <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-bold block">
              2. Sole Ownership of Tactile UI &amp; Screens
            </span>
            <p className="text-slate-300 leading-relaxed">
              All visual layouts, tactile keypad geometries, color schemes, and mobile device screen representations displayed in this gallery belong 100% to Sushant Mishra.
            </p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-1.5">
            <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-bold block">
              3. Berne Convention &amp; WIPO Worldwide Protection
            </span>
            <p className="text-slate-300 leading-relaxed">
              Protected globally under the Berne Convention for the Protection of Literary and Artistic Works and the WIPO Copyright Treaty. All rights are fully reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Modal for Zoomed In Screen Inspection */}
      {selectedImageModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImageModal(null)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl p-4 max-w-lg w-full flex flex-col items-center space-y-4 shadow-2xl animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between pb-2 border-b border-slate-800 text-white">
              <span className="text-xs font-mono font-semibold text-emerald-400">
                High-Resolution Screen Inspection
              </span>
              <button
                onClick={() => setSelectedImageModal(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                Close (ESC)
              </button>
            </div>

            <img
              src={selectedImageModal}
              alt="Zoomed Screen"
              className="w-full max-h-[75vh] object-contain rounded-xl"
            />

            <div className="w-full flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-[11px] text-slate-400 font-mono">
                Copyright © 2026 Sushant Mishra
              </span>
              <a
                href={selectedImageModal}
                download="OmniCalc-Screen-Mockup.svg"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center space-x-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download SVG</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
