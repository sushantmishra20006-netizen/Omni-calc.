/**
 * @license
 * Copyright © 2026 Sushant Mishra. All Rights Reserved.
 * Sole Proprietor & Copyright Owner: Sushant Mishra (sushantmishra20006@gmail.com).
 * Comprehensive Legal, Copyright Ownership & Regulatory Compliance Footer.
 */

import React from 'react';
import { ScreenType } from '../types';
import { LEGAL_REGISTRY } from '../utils/legalDocs';
import { ShieldCheck, Scale, Award, Lock, Globe, Mail, Smartphone } from 'lucide-react';

interface FooterProps {
  onSelectScreen: (screen: ScreenType) => void;
  onOpenPublishModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectScreen, onOpenPublishModal }) => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand & Rights */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white text-base tracking-tight">OmniCalc™ Compliance Suite</span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                100% Owned by Sushant Mishra
              </span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Copyright © 2026
              </span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed max-w-lg">
              <strong className="text-white">Copyright Notice:</strong> {LEGAL_REGISTRY.copyrightNotice}
            </p>
            <p className="text-slate-400 text-[11px] leading-relaxed max-w-lg">
              {LEGAL_REGISTRY.publicUseStatement}
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-slate-400 pt-1">
              <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Sole Copyright Owner & Author: </span>
              <a href="mailto:sushantmishra20006@gmail.com" className="text-emerald-400 hover:underline font-mono">
                sushantmishra20006@gmail.com
              </a>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">
              {LEGAL_REGISTRY.trademarkNotice}
            </p>
          </div>

          {/* Compliance Standards */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Statutory Standards
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li className="flex items-center space-x-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Sole Copyright Owned by Sushant Mishra</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Truth in Lending (12 CFR § 1026)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>IEEE 754 Banker’s Precision</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>ISO 4217 Foreign Exchange Parity</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>GDPR / CCPA Client Sandbox</span>
              </li>
            </ul>
          </div>

          {/* Quick Registry Links */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Legal Documents & Registry
            </h4>
            <div className="flex flex-col space-y-2 text-xs">
              {onOpenPublishModal && (
                <button
                  id="footer-publish-playstore-btn"
                  onClick={onOpenPublishModal}
                  className="text-left text-emerald-400 hover:text-emerald-300 font-semibold transition-colors flex items-center space-x-1.5"
                >
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Publish & Play Store Link</span>
                </button>
              )}
              <button
                onClick={() => onSelectScreen('legal')}
                className="text-left text-slate-300 hover:text-emerald-400 transition-colors flex items-center space-x-1.5"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>Certificate of Sole Copyright Ownership</span>
              </button>
              <button
                onClick={() => onSelectScreen('legal')}
                className="text-left text-slate-300 hover:text-emerald-400 transition-colors flex items-center space-x-1.5"
              >
                <Scale className="w-3.5 h-3.5 text-emerald-400" />
                <span>Intellectual Property Assignment Deed</span>
              </button>
              <button
                onClick={() => onSelectScreen('legal')}
                className="text-left text-slate-300 hover:text-emerald-400 transition-colors flex items-center space-x-1.5"
              >
                <Award className="w-3.5 h-3.5 text-slate-500" />
                <span>Proprietary Brand & IP Registry</span>
              </button>
              <button
                onClick={() => onSelectScreen('converter')}
                className="text-left text-slate-300 hover:text-emerald-400 transition-colors flex items-center space-x-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                <span>Forex & Currency Converter</span>
              </button>
              <button
                onClick={() => onSelectScreen('audit')}
                className="text-left text-slate-300 hover:text-emerald-400 transition-colors flex items-center space-x-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                <span>Audit Trail & Certificates</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <span>
            Copyright © 2026 <strong className="text-slate-300">Sushant Mishra</strong>. All Rights Reserved. Sole Copyright Owner & IP Proprietor.
          </span>
          <span className="font-mono text-emerald-500/90">Engine: IEEE-754 / ISO-60559 Validated</span>
        </div>
      </div>
    </footer>
  );
};
