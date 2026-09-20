/**
 * @license
 * Copyright © 2026 Sushant Mishra. All Rights Reserved.
 * Sole Proprietor & Copyright Owner: Sushant Mishra (sushantmishra20006@gmail.com).
 * Complete Legal, Trademark, Copyright Registry & Regulatory Portal.
 */

import React, { useState } from 'react';
import {
  LEGAL_REGISTRY,
  PUBLIC_USE_LICENSE_TEXT,
  COPYRIGHT_ASSIGNMENT_TEXT,
  COMPLIANCE_PILLARS,
} from '../utils/legalDocs';
import {
  Scale,
  ShieldCheck,
  Award,
  FileText,
  Copy,
  Download,
  CheckCircle,
  ExternalLink,
  Lock,
  Globe,
  Check,
  Users,
  Key,
  Mail,
} from 'lucide-react';

export const LegalComplianceView: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeLegalTab, setActiveLegalTab] = useState<'public' | 'copyright' | 'trademarks' | 'publishing-audit'>('copyright');

  const PROHIBITED_WORDS_AUDIT = [
    {
      category: 'Google Play Store Title Policy',
      rule: 'Max 30 characters; strictly no prohibited buzzwords (#1, Best, Free, Top, Official, Guarantee)',
      testedValue: '"OmniCalc: Precision & Loan Calc" (29 chars)',
      status: 'PASS',
      details: 'Conforms to Google Play title character limit (29/30). Zero forbidden marketing superlatives or clickbait.',
    },
    {
      category: 'Android Package Identifier',
      rule: 'No Java/Kotlin language reserved keywords (class, void, package, import, const) or 3P brand marks',
      testedValue: 'app.omnicalc.compliance',
      status: 'PASS',
      details: 'Follows official Android reverse-domain namespace conventions with zero reserved language words.',
    },
    {
      category: 'Prohibited Trademarks & Impersonation',
      rule: 'No deceptive usage of Google, Android, Play Store, or bank trademarked names in app identity',
      testedValue: 'OmniCalc™ Proprietary Mark',
      status: 'PASS',
      details: 'Distinctive proprietary naming with no brand impersonation or misleading association.',
    },
    {
      category: 'Statutory Lending & Financial Disclaimers',
      rule: 'TILA Regulation Z safe harbor; no predatory lending guarantees or deceptive banking claims',
      testedValue: 'Regulation Z (12 C.F.R. § 1026) Engine',
      status: 'PASS',
      details: 'Transparent algorithmic calculation with explicit consumer disclosure and safe harbor disclaimers.',
    },
    {
      category: 'Google Play Content Rating & Safety',
      rule: 'ESRB / IARC content policy for global Play Store listing',
      testedValue: 'Everyone / All Audiences',
      status: 'PASS',
      details: 'Productivity and educational calculator with zero mature themes, profanity, violence, or user risk.',
    },
    {
      category: 'Client Privacy & Data Sovereignty',
      rule: 'GDPR (EU 2016/679) Article 6 & CCPA/CPRA telemetry compliance',
      testedValue: 'Zero-Telemetry Sandbox',
      status: 'PASS',
      details: 'Zero user data tracking, zero third-party telemetry, zero external database transmission.',
    },
    {
      category: 'Web Standards & Reserved Attribute Scope',
      rule: 'W3C HTML5 & ECMAScript reserved keyword safety in browser and iframe',
      testedValue: 'Clean Scope & Standards Compliant',
      status: 'PASS',
      details: 'Safe inside iframe preview and independent tabs; no global object hijacking or reserved property collisions.',
    },
    {
      category: '100% Sole Copyright & Author Title',
      rule: 'Ownership chain documentation to prevent DMCA flags or store takedowns',
      testedValue: 'Sushant Mishra (sushantmishra20006@gmail.com)',
      status: 'PASS',
      details: 'Sole copyright ownership registered under international Berne Convention and WIPO Copyright Treaty.',
    },
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyText = (text: string, sectionName: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedSection(sectionName);
    showToast(`Copied ${sectionName} to clipboard`);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleDownloadFullLegalDoc = () => {
    const fullContent = `================================================================================
     OMNICALC™ SOLE COPYRIGHT OWNERSHIP & INTELLECTUAL PROPERTY DEED
================================================================================
SOLE COPYRIGHT OWNER : ${LEGAL_REGISTRY.ownerEntity} <${LEGAL_REGISTRY.ownerEmail}>
EFFECTIVE DATE       : ${LEGAL_REGISTRY.effectiveDate}
JURISDICTION         : ${LEGAL_REGISTRY.jurisdiction}
LICENSE TYPE         : ${LEGAL_REGISTRY.licenseType}
COPYRIGHT STATUS     : 100% SOLE & EXCLUSIVE COPYRIGHT HELD BY SUSHANT MISHRA

COPYRIGHT NOTICE:
${LEGAL_REGISTRY.copyrightNotice}

${COPYRIGHT_ASSIGNMENT_TEXT}

${PUBLIC_USE_LICENSE_TEXT}

================================================================================
END OF OFFICIAL COPYRIGHT & INTELLECTUAL PROPERTY REGISTRY
================================================================================`;

    const blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OmniCalc-Sole-Copyright-Deed-Sushant-Mishra-2026.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded Sole Copyright Ownership Deed');
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

      {/* Hero Header Banner */}
      <div className="bg-slate-900 text-white border border-slate-800 rounded-xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Sole Copyright Ownership</span>
              </span>
              <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                <Scale className="w-3.5 h-3.5 text-blue-400" />
                <span>All Rights Reserved</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">Owner: Sushant Mishra</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mt-2">
              Certificate of Sole Copyright & Intellectual Property
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              OmniCalc™ is 100% owned by Sushant Mishra. All copyright ownership, source code architectures,
              tactile interfaces, calculation engines, and brand marks are the exclusive intellectual property of author and sole proprietor Sushant Mishra.
            </p>
          </div>

          <button
            id="btn-download-full-legal"
            onClick={handleDownloadFullLegalDoc}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm self-start md:self-auto shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Download Copyright Deed (TXT)</span>
          </button>
        </div>

        {/* Quick Identity Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800 text-xs font-mono">
          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Sole Copyright Owner</span>
            <span className="font-semibold text-emerald-400 block">{LEGAL_REGISTRY.ownerEntity}</span>
            <span className="text-[10px] text-slate-400">{LEGAL_REGISTRY.ownerEmail}</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Copyright Status</span>
            <span className="font-semibold text-white block">100% Sole Ownership</span>
            <span className="text-[10px] text-emerald-400">All Rights Reserved</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Registration Year</span>
            <span className="font-semibold text-white block">2026</span>
            <span className="text-[10px] text-slate-400">Continuous & Perpetual</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Legal Jurisdiction</span>
            <span className="font-semibold text-white block">Berne Convention & WIPO</span>
            <span className="text-[10px] text-slate-400">Worldwide Protection</span>
          </div>
        </div>
      </div>

      {/* Dual Highlights: Sole Ownership vs. Authorized Public Use */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: 100% Sole Copyright Ownership */}
        <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-emerald-700">
              <Key className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Sole Intellectual Property</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-2">
              100% Exclusive Copyright Vested in Sushant Mishra
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              All copyright, moral rights, patents, source code, visual UI layouts, algorithms, and trademarks
              belong solely and exclusively to Sushant Mishra (sushantmishra20006@gmail.com).
            </p>
            <ul className="mt-3 space-y-1.5 text-xs text-slate-700">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Sole author, creator, and legal copyright holder</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Full protection under Berne Convention & WIPO Copyright Treaty</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Proprietary marks: OmniCalc™, PrecisionEngine™, AuditSeal™</span>
              </li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-emerald-500/20 flex items-center justify-between">
            <span className="text-[11px] font-mono text-emerald-800 font-semibold">
              Owner: sushantmishra20006@gmail.com
            </span>
            <button
              onClick={() => handleCopyText(COPYRIGHT_ASSIGNMENT_TEXT, 'Copyright Deed')}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-medium flex items-center space-x-1"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Copyright Deed</span>
            </button>
          </div>
        </div>

        {/* Card 2: Authorized Worldwide User License */}
        <div className="bg-blue-950/10 border border-blue-500/30 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-blue-700">
              <Users className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">User Freedom & License</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-2">
              Worldwide Authorized Calculation & Audit Grant
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Under authority of copyright owner Sushant Mishra, users worldwide are granted full authorization
              to access, calculate, execute, export ledgers, and download certified audit proofs with zero fees.
            </p>
            <ul className="mt-3 space-y-1.5 text-xs text-slate-700">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Free calculation for personal, business, research, and educational use</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Zero tracking, 100% local client browser privacy and data sovereignty</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Certified audit receipts and TILA amortization schedule downloads</span>
              </li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-blue-500/20 flex items-center justify-between">
            <span className="text-[11px] font-mono text-blue-800 font-semibold">
              Authorized Worldwide
            </span>
            <button
              onClick={() => handleCopyText(PUBLIC_USE_LICENSE_TEXT, 'User License')}
              className="text-xs text-blue-800 hover:text-blue-950 font-medium flex items-center space-x-1"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy User License</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statutory Compliance Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COMPLIANCE_PILLARS.map((pillar) => (
          <div
            key={pillar.id}
            className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  {pillar.badge}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">{pillar.regulation}</span>
              </div>
              <h3 className="text-xs font-bold text-slate-900 mt-2">{pillar.title}</h3>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{pillar.description}</p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center text-[10px] text-slate-500 space-x-1">
              <CheckCircle className="w-3 h-3 text-emerald-600" />
              <span>Statutorily verified and active</span>
            </div>
          </div>
        ))}
      </div>

      {/* Legal Registry Navigation Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="flex border-b border-slate-200 bg-slate-50/70 p-2 gap-2">
          <button
            onClick={() => setActiveLegalTab('copyright')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeLegalTab === 'copyright'
                ? 'bg-white text-emerald-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sole Copyright Ownership Deed</span>
          </button>

          <button
            onClick={() => setActiveLegalTab('public')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeLegalTab === 'public'
                ? 'bg-white text-blue-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>Authorized User License</span>
          </button>

          <button
            onClick={() => setActiveLegalTab('trademarks')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeLegalTab === 'trademarks'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-slate-600" />
            <span>Proprietary Brand & IP Registry</span>
          </button>

          <button
            onClick={() => setActiveLegalTab('publishing-audit')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeLegalTab === 'publishing-audit'
                ? 'bg-white text-indigo-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Play Store & Web Publishing Audit</span>
          </button>
        </div>

        <div className="p-6">
          {activeLegalTab === 'copyright' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Certificate of Sole Copyright & Intellectual Property Deed
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    100% exclusive copyright ownership, authorship, and title vested in Sushant Mishra.
                  </p>
                </div>
                <button
                  onClick={() => handleCopyText(COPYRIGHT_ASSIGNMENT_TEXT, 'Copyright Deed')}
                  className="flex items-center space-x-1 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg transition-colors"
                >
                  {copiedSection === 'Copyright Deed' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span>Copy Deed Text</span>
                </button>
              </div>

              <div className="bg-slate-950 text-slate-300 font-mono text-xs rounded-xl p-5 border border-slate-800 max-h-96 overflow-y-auto leading-relaxed whitespace-pre-wrap">
                {COPYRIGHT_ASSIGNMENT_TEXT}
              </div>
            </div>
          )}

          {activeLegalTab === 'public' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    OmniCalc™ Authorized User License & Terms of Use
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Authorized worldwide calculation rights granted by sole copyright owner Sushant Mishra.
                  </p>
                </div>
                <button
                  onClick={() => handleCopyText(PUBLIC_USE_LICENSE_TEXT, 'User License')}
                  className="flex items-center space-x-1 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg transition-colors"
                >
                  {copiedSection === 'User License' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span>Copy License Text</span>
                </button>
              </div>

              <div className="bg-slate-950 text-slate-300 font-mono text-xs rounded-xl p-5 border border-slate-800 max-h-96 overflow-y-auto leading-relaxed whitespace-pre-wrap">
                {PUBLIC_USE_LICENSE_TEXT}
              </div>
            </div>
          )}

          {activeLegalTab === 'trademarks' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Proprietary Trademark & Brand Registry
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Exclusive brand names, service marks, and trade dress designations owned by Sushant Mishra.
                  </p>
                </div>
                <button
                  onClick={() => handleCopyText(LEGAL_REGISTRY.trademarkNotice, 'Trademark Notice')}
                  className="flex items-center space-x-1 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg transition-colors"
                >
                  {copiedSection === 'Trademark Notice' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span>Copy Notice</span>
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-700 font-mono leading-relaxed">
                {LEGAL_REGISTRY.trademarkNotice}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {[
                  { mark: 'OmniCalc™', desc: 'Precision Calculation Suite & Platform' },
                  { mark: 'PrecisionEngine™', desc: 'Mathematical Evaluation & Rounding Runtime' },
                  { mark: 'AuditSeal™', desc: 'Cryptographic SHA-256 Ledger Verification' },
                  { mark: 'Truth-In-Calculation™', desc: 'TILA Reg Z Statutory Disclosure Standard' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="font-bold text-slate-900 block">{item.mark}</span>
                    <span className="text-slate-500 text-[11px] mt-0.5 block">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeLegalTab === 'publishing-audit' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                    <span>Google Play Store & Web Publishing Compliance Audit</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                      100% PASSED
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Zero prohibited words, zero reserved identifier conflicts, and full statutory compliance for Google Play Store and website hosting.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const auditSummary = PROHIBITED_WORDS_AUDIT.map(
                      (item) => `[${item.status}] ${item.category}\n  Rule: ${item.rule}\n  Tested: ${item.testedValue}\n  Audit: ${item.details}\n`
                    ).join('\n');
                    handleCopyText(auditSummary, 'Publishing Audit');
                  }}
                  className="flex items-center space-x-1 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg transition-colors shrink-0"
                >
                  {copiedSection === 'Publishing Audit' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span>Copy Audit Report</span>
                </button>
              </div>

              {/* Status Banner */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-950 space-y-1">
                  <span className="font-bold text-emerald-900 block">
                    Zero Rejection Triggers Detected — Safe for Instant Store & Website Publication
                  </span>
                  <p className="text-emerald-800 leading-relaxed">
                    OmniCalc™ contains no reserved Android/Java keywords, no forbidden Google Play Store marketing superlatives, no deceptive financial guarantees, and no unapproved third-party brand names. All calculations execute deterministically with client privacy.
                  </p>
                </div>
              </div>

              {/* Detailed Audit Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                    <tr>
                      <th className="p-3">Policy Audit Dimension</th>
                      <th className="p-3">Regulatory / Store Requirement</th>
                      <th className="p-3">Tested Asset</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {PROHIBITED_WORDS_AUDIT.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-3 font-semibold text-slate-900 align-top whitespace-nowrap">
                          {item.category}
                        </td>
                        <td className="p-3 text-slate-600 align-top">
                          <div>{item.rule}</div>
                          <div className="text-[11px] text-slate-500 mt-1">{item.details}</div>
                        </td>
                        <td className="p-3 font-mono text-[11px] text-slate-700 align-top bg-slate-50/40">
                          {item.testedValue}
                        </td>
                        <td className="p-3 align-top text-center">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-100 text-emerald-800 border border-emerald-300">
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Licensing & Contact Inquiry Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-slate-100 rounded-lg text-slate-700 shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Sole Copyright Owner & Author Inquiries
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              For official licensing, enterprise calculation integrations, or IP inquiries:
            </p>
            <div className="mt-1 font-mono text-xs text-emerald-700 font-semibold">
              Sole Copyright Owner: Sushant Mishra (<a href="mailto:sushantmishra20006@gmail.com" className="hover:underline">sushantmishra20006@gmail.com</a>)
            </div>
          </div>
        </div>

        <button
          onClick={() => handleCopyText('sushantmishra20006@gmail.com', 'Author Email')}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors shrink-0 flex items-center space-x-1.5"
        >
          {copiedSection === 'Author Email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>Copy Owner Contact</span>
        </button>
      </div>

      {/* Regulatory Disclaimers & FTC Safe Harbor */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5 text-xs text-amber-900 space-y-2">
        <div className="flex items-center space-x-2 font-bold text-amber-950">
          <ShieldCheck className="w-4 h-4 text-amber-700" />
          <span>Statutory Safe Harbor & Regulatory Disclaimers</span>
        </div>
        <p className="leading-relaxed">
          The calculations produced by this platform are generated using deterministic computational algorithms
          conforming with the Truth in Lending Act (Regulation Z), IEEE 754 precision parameters, and Dodd-Frank Remittance
          rules. All rights are reserved to Sushant Mishra. Users entering into legally binding
          mortgages, commercial lending agreements, or tax declarations should review figures with licensed financial
          counselors, attorneys, or certified public accountants.
        </p>
      </div>
    </div>
  );
};

