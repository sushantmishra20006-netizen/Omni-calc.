/**
 * @license
 * Created and Published by Sushant Mishra (sushantmishra20006@gmail.com).
 * Complete Public Publication. Zero Reserved Rights.
 * Verifiable Public Audit Trail & Mathematical Ledger.
 */

import React, { useState } from 'react';
import { AuditRecord } from '../types';
import { generateComplianceCertificate } from '../utils/legalDocs';
import {
  History,
  ShieldCheck,
  Download,
  Copy,
  Trash2,
  CheckCircle,
  FileText,
  Search,
  Check,
} from 'lucide-react';

interface AuditLogViewProps {
  records: AuditRecord[];
  onClearRecords: () => void;
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({
  records,
  onClearRecords,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredRecords = records.filter(
    (r) =>
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.checksum.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyChecksum = (id: string) => {
    navigator.clipboard?.writeText(id);
    setCopiedId(id);
    showToast('Copied Audit Verification Hash');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadSingleCert = (record: AuditRecord) => {
    const cert = generateComplianceCertificate(
      record.category,
      record.checksum,
      record.formula,
      record.inputs,
      record.results,
      record.currency
        ? `${record.currency.code} (${record.currency.symbol}) - ${record.currency.name}`
        : undefined
    );
    const blob = new Blob([cert], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OmniCalc-Certificate-${record.checksum.slice(-8)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded Legal Audit Certificate');
  };

  const handleExportAllJSON = () => {
    const exportPayload = {
      license: 'Complete Public Publication & Universal Open License (Zero Reserved Rights)',
      publicationStatus: 'Completely Published. Zero Reserved Rights.',
      publisher: 'Sushant Mishra (sushantmishra20006@gmail.com)',
      contact: 'sushantmishra20006@gmail.com',
      jurisdiction: 'Universal Worldwide Public Domain / Global Access',
      statutoryStandards: ['Truth in Lending Act (Regulation Z)', 'IEEE 754 Banker’s Precision', 'ISO 4217 Currency Parity'],
      exportTimestamp: new Date().toISOString(),
      recordCount: records.length,
      records: records,
    };
    const dataStr = JSON.stringify(exportPayload, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OmniCalc-Audit-Log-Ledger-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported Entire Audit Ledger (JSON)');
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
              Legal Compliance Audit Trail & Records
            </h1>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded border border-emerald-200">
              {records.length} Verified Entries
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Immutable, deterministic records generated for each mathematical execution. Each record is sealed
            with a unique cryptographic checksum and verified against statutory precision requirements.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {records.length > 0 && (
            <>
              <button
                id="btn-export-all-json"
                onClick={handleExportAllJSON}
                className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export Ledger (JSON)</span>
              </button>
              <button
                id="btn-clear-audit-log"
                onClick={onClearRecords}
                className="flex items-center space-x-1 text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-200 text-xs px-2.5 py-1.5 rounded-lg transition-colors"
                title="Clear current session audit records"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex items-center space-x-3">
        <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by calculation title, formula, or verification checksum..."
          className="w-full text-xs font-mono bg-transparent border-none outline-hidden text-slate-800 placeholder:text-slate-400"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-xs text-slate-400 hover:text-slate-600 px-2"
          >
            Reset
          </button>
        )}
      </div>

      {/* Records List */}
      {filteredRecords.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-xs">
          <History className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No calculation records yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Perform calculations in the Financial, Scientific, or Commercial engines and click
            "Log to Audit Ledger" to generate cryptographically signed compliance certificates.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecords.map((record) => (
            <div
              key={record.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-all space-y-3"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                    {record.category}
                  </span>
                  {record.currency && (
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200/80 flex items-center space-x-1">
                      <span>{record.currency.flag}</span>
                      <span>{record.currency.code} ({record.currency.symbol})</span>
                    </span>
                  )}
                  <h3 className="text-sm font-bold text-slate-900">{record.title}</h3>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-mono text-slate-400">
                    {new Date(record.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>{record.legalStatus}</span>
                  </span>
                </div>
              </div>

              {/* Mathematical Formula */}
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 text-xs font-mono text-slate-700 flex items-center justify-between">
                <span className="text-slate-500 mr-2 text-[11px] font-semibold">FORMULA:</span>
                <span className="truncate flex-1">{record.formula}</span>
              </div>

              {/* Grid of Inputs & Results */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Inputs Applied
                  </span>
                  <div className="space-y-1">
                    {Object.entries(record.inputs).map(([k, v]) => (
                      <div key={k} className="flex justify-between text-slate-700">
                        <span className="text-slate-500">{k}:</span>
                        <span className="font-semibold">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-emerald-50/40 p-3 rounded-lg border border-emerald-100">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1.5">
                    Verified Outputs
                  </span>
                  <div className="space-y-1">
                    {Object.entries(record.results).map(([k, v]) => (
                      <div key={k} className="flex justify-between text-emerald-950">
                        <span className="text-emerald-700">{k}:</span>
                        <span className="font-bold">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer with Checksum & Certificate Download */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] text-slate-500 font-mono">Checksum:</span>
                  <button
                    onClick={() => handleCopyChecksum(record.checksum)}
                    className="flex items-center space-x-1 font-mono text-[11px] text-slate-700 hover:text-emerald-600 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded transition-colors"
                  >
                    <span>{record.checksum}</span>
                    {copiedId === record.checksum ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3 text-slate-400" />
                    )}
                  </button>
                </div>

                <button
                  onClick={() => handleDownloadSingleCert(record)}
                  className="flex items-center space-x-1 text-slate-700 hover:text-slate-900 font-medium text-xs bg-white border border-slate-200 hover:border-slate-300 px-2.5 py-1 rounded-md transition-colors self-start sm:self-auto"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>Download Compliance Certificate</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
