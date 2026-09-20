import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  ExternalLink,
  Smartphone,
  Globe,
  Download,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  Terminal,
} from 'lucide-react';

interface PublishPlayStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PublishPlayStoreModal: React.FC<PublishPlayStoreModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'link' | 'playstore' | 'cli'>('link');

  if (!isOpen) return null;

  const publicLiveUrl = 'https://ais-pre-i7h4zglp4fxrnsrivhvjud-125329514266.asia-east1.run.app';
  const pwaBuilderUrl = `https://www.pwabuilder.com?url=${encodeURIComponent(publicLiveUrl)}`;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const downloadZipUrl = '/download/OmniCalc-Android-PlayStore-Package.zip';

  const playStoreMetadata = {
    title: 'OmniCalc: Precision & Loan Calc',
    shortDescription: 'High-precision IEEE-754 calculation, TILA amortization schedules & currency parity suite.',
    fullDescription: `OmniCalc™ Compliance Suite is an open, high-precision mathematical and financial calculation suite published by Sushant Mishra.

FEATURES:
• IEEE-754 Floating-Point Precision: Zero rounding bias with standard banker's rounding algorithms.
• Truth in Lending Act (TILA / Regulation Z) Compliance: Full mortgage, amortization, and APR schedule calculations with total interest breakdowns.
• Live Multi-Currency Parity Engine: Real-time currency conversions across major world currencies with ISO-4217 validation.
• Cryptographic Audit Trail: Every calculation is timestamped and verifiable with SHA-256 seal integrity.
• Full Public Publication: Free universal access, zero paywalls, zero ads.

Author & Publisher: Sushant Mishra (sushantmishra20006@gmail.com)
Category: Finance / Productivity / Tools
Content Rating: Everyone`,
  };

  const handleDownloadPlayStoreMetadata = () => {
    const content = `================================================================================
            OMNICALC™ - GOOGLE PLAY STORE PUBLISHING PACKAGE
================================================================================
PUBLISHER / AUTHOR : Sushant Mishra <sushantmishra20006@gmail.com>
APP NAME           : ${playStoreMetadata.title}
PACKAGE NAME       : app.omnicalc.compliance
PUBLIC LIVE URL    : ${publicLiveUrl}
PWA MANIFEST       : ${publicLiveUrl}/manifest.json
SERVICE WORKER     : ${publicLiveUrl}/sw.js
ASSET LINKS        : ${publicLiveUrl}/.well-known/assetlinks.json

--------------------------------------------------------------------------------
1. PLAY STORE LISTING DETAILS
--------------------------------------------------------------------------------
APP TITLE (Max 30 chars) : 
${playStoreMetadata.title}

SHORT DESCRIPTION (Max 80 chars) : 
${playStoreMetadata.shortDescription}

FULL DESCRIPTION :
${playStoreMetadata.fullDescription}

PRIMARY CATEGORY   : Finance
SECONDARY CATEGORY : Productivity / Tools
CONTENT RATING     : Everyone (Zero mature content, no violence, no gambling)
PRIVACY POLICY URL : ${publicLiveUrl}#legal
TARGET AUDIENCE    : 13+ and All Adults

--------------------------------------------------------------------------------
2. HOW TO GENERATE THE ANDROID APP BUNDLE (.AAB) FOR PLAY CONSOLE
--------------------------------------------------------------------------------
METHOD A (Fastest - PWABuilder Web GUI):
1. Visit: https://www.pwabuilder.com
2. Paste URL: ${publicLiveUrl}
3. Click "Start". Notice PWA Score is 100% (Manifest, SW, and Icons detected).
4. Click "Package for Stores" -> Select "Google Play".
5. Click "Generate" and download your signed .aab file.
6. Upload the .aab directly into Google Play Console (https://play.google.com/console).

METHOD B (Google Official Bubblewrap CLI):
Run in your terminal:
  npm install -g @bubblewrap/cli
  bubblewrap init --manifest=${publicLiveUrl}/manifest.json
  bubblewrap build

================================================================================
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'OmniCalc-Google-Play-Store-Publishing-Kit.txt';
    a.click();
    URL.revokeObjectURL(url);
    copyToClipboard('Downloaded', 'download-pkg');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl text-slate-200 overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">
                Publish & Share OmniCalc™
              </h2>
              <p className="text-[11px] text-slate-400">
                Live worldwide link & Google Play Store release package
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-800 bg-slate-900/80 px-5 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('link')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === 'link'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>1. Public Live Link</span>
          </button>
          <button
            onClick={() => setActiveTab('playstore')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === 'playstore'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>2. Google Play Store (.AAB)</span>
          </button>
          <button
            onClick={() => setActiveTab('cli')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === 'cli'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>3. Developer CLI / Bubblewrap</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {activeTab === 'link' && (
            <div className="space-y-4">
              <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Permanent Public Web Link</span>
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                    ONLINE & LIVE
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Your OmniCalc app is published live on the web and immediately accessible worldwide to anyone with a browser on mobile, tablet, or desktop:
                </p>

                <div className="flex items-center space-x-2 bg-slate-950 border border-slate-700/80 rounded-lg p-2 font-mono text-xs text-slate-200 break-all">
                  <span className="text-emerald-400 select-none">URL:</span>
                  <span className="flex-1 select-all">{publicLiveUrl}</span>
                  <button
                    onClick={() => copyToClipboard(publicLiveUrl, 'live-url')}
                    className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded transition-colors shrink-0 flex items-center space-x-1"
                    title="Copy Live Link"
                  >
                    {copiedKey === 'live-url' ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <a
                    href={publicLiveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 hover:bg-slate-800 text-emerald-400 rounded transition-colors shrink-0"
                    title="Open Live App in New Tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Instant Share & Install */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-800/60 border border-slate-700 p-3.5 rounded-xl space-y-2">
                  <h4 className="font-semibold text-white flex items-center space-x-1.5">
                    <Smartphone className="w-4 h-4 text-blue-400" />
                    <span>Direct Android Mobile Install</span>
                  </h4>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Android users can open this link in Chrome and click <strong>"Install App"</strong> or <strong>"Add to Home screen"</strong>. It installs with native app icon, standalone screen, and offline support.
                  </p>
                </div>

                <div className="bg-slate-800/60 border border-slate-700 p-3.5 rounded-xl space-y-2">
                  <h4 className="font-semibold text-white flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>PWA Certification</span>
                  </h4>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Includes verified Web App Manifest (<code className="text-emerald-400">/manifest.json</code>), Service Worker offline cache, and 192px/512px maskable icon assets.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setActiveTab('playstore')}
                  className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  <span>Next: Prepare Google Play Store .AAB</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'playstore' && (
            <div className="space-y-4">
              {/* Direct Download Package Card */}
              <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Download className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Android Studio & Play Store Release Package (.ZIP)
                    </h3>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded">
                    DOWNLOAD READY
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Complete, pre-configured Android Studio release package containing <code className="text-emerald-400 font-mono">AndroidManifest.xml</code>, Gradle build scripts, icons, store listing documents, and TWA launcher code.
                </p>
                <div className="pt-1 flex flex-wrap gap-2">
                  <a
                    href={downloadZipUrl}
                    download="OmniCalc-Android-PlayStore-Package.zip"
                    className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Play Store Android Package (.ZIP)</span>
                  </a>
                </div>
              </div>

              {/* PWABuilder 1-Click .AAB Generator */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                    <Smartphone className="w-4 h-4 text-blue-400" />
                    <span>1-Click .AAB Generator via PWABuilder</span>
                  </h3>
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-mono">
                    OFFICIAL GOOGLE TWA
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Google officially recommends <strong>Trusted Web Activity (TWA)</strong> via <strong>PWABuilder</strong> to compile your web application directly into an <strong>Android App Bundle (.aab)</strong> without writing Android code.
                </p>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-start space-x-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 font-bold flex items-center justify-center shrink-0 border border-emerald-500/30 text-[11px]">1</span>
                    <span>Click the button below to open <strong>PWABuilder</strong> with your live URL pre-loaded.</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 font-bold flex items-center justify-center shrink-0 border border-emerald-500/30 text-[11px]">2</span>
                    <span>PWABuilder will scan and verify your manifest, icons, and service worker (all 100% verified).</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 font-bold flex items-center justify-center shrink-0 border border-emerald-500/30 text-[11px]">3</span>
                    <span>Click <strong>Package for Stores</strong> &rarr; Select <strong>Google Play</strong>, download the generated <strong>.aab</strong>, and upload to your <a href="https://play.google.com/console" target="_blank" rel="noreferrer" className="text-emerald-400 underline">Google Play Console</a> account.</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-2">
                  <a
                    href={pwaBuilderUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Open PWABuilder to Generate .AAB</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </a>

                  <button
                    onClick={handleDownloadPlayStoreMetadata}
                    className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Download Listing Copy & Metadata (TXT)</span>
                  </button>
                </div>
              </div>

              {/* Ready-to-use Play Store Metadata */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                    Play Store App Listing Copy
                  </span>
                  <button
                    onClick={() => copyToClipboard(playStoreMetadata.fullDescription, 'listing-copy')}
                    className="text-emerald-400 hover:underline flex items-center space-x-1 text-[11px]"
                  >
                    {copiedKey === 'listing-copy' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>Copy Full Description</span>
                  </button>
                </div>
                <div className="space-y-1.5 text-slate-400 text-[11px]">
                  <div><strong className="text-slate-300">Title:</strong> {playStoreMetadata.title}</div>
                  <div><strong className="text-slate-300">Short Description:</strong> {playStoreMetadata.shortDescription}</div>
                  <div><strong className="text-slate-300">Author & Publisher:</strong> Sushant Mishra</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cli' && (
            <div className="space-y-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-3">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-emerald-400 font-bold flex items-center space-x-1.5">
                    <Terminal className="w-4 h-4" />
                    <span>Google Bubblewrap CLI Command</span>
                  </span>
                  <button
                    onClick={() => copyToClipboard(`npm install -g @bubblewrap/cli\nbubblewrap init --manifest=${publicLiveUrl}/manifest.json\nbubblewrap build`, 'cli-code')}
                    className="text-slate-400 hover:text-white flex items-center space-x-1 text-[11px]"
                  >
                    {copiedKey === 'cli-code' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copy Commands</span>
                  </button>
                </div>
                <div className="bg-slate-900 p-3 rounded border border-slate-800 text-slate-200 leading-relaxed select-all">
                  <div className="text-slate-500"># 1. Install Google's official CLI tool</div>
                  <div className="text-emerald-400">npm install -g @bubblewrap/cli</div>
                  <div className="text-slate-500 mt-2"># 2. Initialize project from your live manifest</div>
                  <div className="text-emerald-400">bubblewrap init --manifest={publicLiveUrl}/manifest.json</div>
                  <div className="text-slate-500 mt-2"># 3. Compile signed release APK & Android App Bundle (.aab)</div>
                  <div className="text-emerald-400">bubblewrap build</div>
                </div>
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  This command creates a standard Android Studio project and signs an <code className="text-emerald-400 font-mono">app-release-bundle.aab</code> that can be directly submitted to the Google Play Store Console under your developer account.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 px-5 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Author & Publisher: <strong className="text-slate-300">Sushant Mishra</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
