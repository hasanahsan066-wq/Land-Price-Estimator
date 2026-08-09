import React from 'react';
import { X, Smartphone, Download, ExternalLink, ShieldCheck, Check, Layers } from 'lucide-react';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl p-6 sm:p-8 relative space-y-6">
        
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-600/10 border border-emerald-600/30 rounded-xl text-emerald-400">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-sans">
              Play Store & Mobile App Export
            </h3>
            <p className="text-xs text-slate-400">
              TerraVal is standard PWA & TWA compliant for native Android & Play Store listing.
            </p>
          </div>
        </div>

        <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
          <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
            Mobile App Installation Options
          </h4>

          <div className="space-y-2">
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">1</div>
              <div>
                <p className="font-bold text-slate-200">Direct Home Screen Installation (PWA)</p>
                <p className="text-slate-400 text-[11px]">Tap "Add to Home Screen" in your Chrome or Safari browser menu for an instant app experience.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">2</div>
              <div>
                <p className="font-bold text-slate-200">Google Play Store APK (TWA Wrapper)</p>
                <p className="text-slate-400 text-[11px]">Export using Google's official Bubblewrap or PWABuilder CLI to generate a signed Android APK / AAB package for the Google Play Console.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <p className="font-bold text-slate-200 flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              Manifest Configured
            </p>
            <p className="text-[10px] text-slate-400">Standalone display, theme colors, and icons defined in manifest.json.</p>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <p className="font-bold text-slate-200 flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              Responsive UI
            </p>
            <p className="text-[10px] text-slate-400">Full touch-optimized layout for phones, tablets & desktops.</p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <a
            href="https://www.pwabuilder.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-bold hover:underline"
          >
            <span>Open PWABuilder for APK</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={onClose}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
};
