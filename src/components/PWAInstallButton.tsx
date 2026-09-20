import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, Check, ExternalLink } from 'lucide-react';

interface PWAInstallButtonProps {
  onOpenPublishModal?: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ onOpenPublishModal }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      setInstalledSuccess(true);
      setTimeout(() => setInstalledSuccess(false), 4000);
    }
  };

  if (isInstalled) {
    return (
      <button
        id="pwa-installed-badge"
        onClick={onOpenPublishModal}
        className="hidden md:flex items-center space-x-1.5 text-xs bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg hover:bg-emerald-900/60 transition-colors"
        title="App Installed / View Play Store & Live Link Details"
      >
        <Check className="w-3.5 h-3.5 text-emerald-400" />
        <span className="font-medium">App Installed • Publish</span>
      </button>
    );
  }

  return (
    <>
      <div className="flex items-center space-x-1.5">
        {isInstallable && (
          <button
            id="pwa-install-header-btn"
            onClick={handleInstallClick}
            className="flex items-center space-x-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-3 py-1.5 rounded-lg shadow-sm transition-all animate-pulse hover:animate-none"
            title="Install OmniCalc directly to your Android device or Desktop"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install App</span>
          </button>
        )}

        {isIOS && (
          <button
            id="pwa-ios-guide-btn"
            onClick={() => setShowIOSGuide(true)}
            className="flex items-center space-x-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <Smartphone className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Install on iOS</span>
          </button>
        )}

        {onOpenPublishModal && (
          <button
            id="open-publish-modal-btn"
            onClick={onOpenPublishModal}
            className="flex items-center space-x-1.5 text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold px-3 py-1.5 rounded-lg shadow-sm transition-all"
            title="Download App Package & Publish to Google Play Store"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download & Play Store</span>
          </button>
        )}
      </div>

      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>Install on iPhone / iPad</span>
              </h3>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs text-slate-300">
              <div className="flex items-start space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 font-bold flex items-center justify-center shrink-0 border border-emerald-500/30">1</span>
                <span>Open this link in <strong>Safari</strong> browser on your device.</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 font-bold flex items-center justify-center shrink-0 border border-emerald-500/30">2</span>
                <span>Tap the <strong>Share</strong> icon (box with upward arrow) at the bottom toolbar.</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 font-bold flex items-center justify-center shrink-0 border border-emerald-500/30">3</span>
                <span>Scroll down and tap <strong>Add to Home Screen</strong>.</span>
              </div>
            </div>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
};
