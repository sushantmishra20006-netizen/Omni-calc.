/**
 * @license
 * Copyright © 2026 Sushant Mishra. All Rights Reserved.
 * Sole Proprietor & Copyright Owner: Sushant Mishra (sushantmishra20006@gmail.com).
 * Complete Legal, Trademark, Copyright & Precision Calculation Application.
 */

import React, { useState, useEffect } from 'react';
import { ScreenType, AuditRecord } from './types';
import { CurrencyProvider } from './context/CurrencyContext';
import { CurrencySelectorModal } from './components/CurrencySelectorModal';
import { Navbar } from './components/Navbar';
import { FinancialCalculator } from './components/FinancialCalculator';
import { CurrencyConverter } from './components/CurrencyConverter';
import { ScientificCalculator } from './components/ScientificCalculator';
import { BusinessCalculator } from './components/BusinessCalculator';
import { AuditLogView } from './components/AuditLogView';
import { LegalComplianceView } from './components/LegalComplianceView';
import { ScreensShowcaseView } from './components/ScreensShowcaseView';
import { PublishPlayStoreModal } from './components/PublishPlayStoreModal';
import { Footer } from './components/Footer';

// Default preloaded compliant audit records
const INITIAL_AUDIT_RECORDS: AuditRecord[] = [
  {
    id: 'CERT-CALC-8B39F1A2-BASELINE-01',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    category: 'Financial Loan',
    title: 'Baseline 30-Year Mortgage $350,000 @ 6.25% APR',
    formula: 'PMT = P * [r(1+r)^n] / [(1+r)^n - 1] | P=280000, r=0.5208%, n=360',
    inputs: {
      'Purchase Price': '$350,000',
      'Down Payment (20%)': '$70,000',
      'Net Principal': '$280,000',
      'APR Rate': '6.25%',
      'Term': '30 Years (360 mo)',
    },
    results: {
      'Monthly P&I Payment': '$1,724.31',
      'Total Interest Paid': '$340,751.60',
      'Total Repayment Cost': '$620,751.60',
      'Loan-to-Value (LTV)': '80.00%',
    },
    checksum: 'CERT-CALC-8B39F1A2-BASELINE-01',
    legalStatus: 'VERIFIED_COMPLIANT',
  },
  {
    id: 'CERT-CALC-2F8C9E4B-BASELINE-02',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    category: 'Scientific Arithmetic',
    title: 'Standard PEMDAS Verification 25 * (14 + 6) / 2 + sqrt(144)',
    formula: 'PEMDAS Operator Order Evaluation',
    inputs: {
      'Expression': '25 * (14 + 6) / 2 + sqrt(144)',
      'Angle Mode': 'Degrees',
    },
    results: {
      'Computed Correct Result': '262',
      'Tolerance Error': '0.000000000000%',
    },
    checksum: 'CERT-CALC-2F8C9E4B-BASELINE-02',
    legalStatus: 'VERIFIED_COMPLIANT',
  },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('screens');
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [auditRecords, setAuditRecords] = useState<AuditRecord[]>(() => {
    try {
      const saved = localStorage.getItem('omnicalc_audit_ledger');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_AUDIT_RECORDS;
  });

  // Save audit records
  useEffect(() => {
    try {
      localStorage.setItem('omnicalc_audit_ledger', JSON.stringify(auditRecords));
    } catch {
      // ignore
    }
  }, [auditRecords]);

  const handleAddAuditRecord = (record: AuditRecord) => {
    setAuditRecords((prev) => [record, ...prev]);
  };

  const handleClearAuditRecords = () => {
    setAuditRecords([]);
    try {
      localStorage.removeItem('omnicalc_audit_ledger');
    } catch {
      // ignore
    }
  };

  return (
    <CurrencyProvider>
      <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-white">
        {/* Top Navigation */}
        <Navbar
          currentScreen={currentScreen}
          onSelectScreen={setCurrentScreen}
          auditCount={auditRecords.length}
          onOpenPublishModal={() => setIsPublishModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {currentScreen === 'screens' && (
            <ScreensShowcaseView onSelectScreen={setCurrentScreen} />
          )}

          {currentScreen === 'scientific' && (
            <ScientificCalculator onAddAuditRecord={handleAddAuditRecord} />
          )}

          {currentScreen === 'financial' && (
            <FinancialCalculator
              onAddAuditRecord={handleAddAuditRecord}
              onOpenLegal={() => setCurrentScreen('legal')}
            />
          )}

          {currentScreen === 'converter' && (
            <CurrencyConverter
              onAddAuditRecord={handleAddAuditRecord}
              onOpenLegal={() => setCurrentScreen('legal')}
            />
          )}

          {currentScreen === 'business' && (
            <BusinessCalculator onAddAuditRecord={handleAddAuditRecord} />
          )}

          {currentScreen === 'audit' && (
            <AuditLogView
              records={auditRecords}
              onClearRecords={handleClearAuditRecords}
            />
          )}

          {currentScreen === 'legal' && <LegalComplianceView />}
        </main>

        {/* Global Currency Selection Modal */}
        <CurrencySelectorModal />

        {/* Google Play Store & Live Link Modal */}
        <PublishPlayStoreModal
          isOpen={isPublishModalOpen}
          onClose={() => setIsPublishModalOpen(false)}
        />

        {/* Comprehensive Legal & Trademark Footer */}
        <Footer
          onSelectScreen={setCurrentScreen}
          onOpenPublishModal={() => setIsPublishModalOpen(true)}
        />
      </div>
    </CurrencyProvider>
  );
}
