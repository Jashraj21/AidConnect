import React, { useState } from 'react';
import { X, Radio, Phone, Copy, Check, ShieldAlert, WifiOff } from 'lucide-react';

export default function OfflineHelpModal({ onClose }) {
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  const sampleTemplate = `[DONATION RELIEF SOS]
CAMP: Meppadi High School Relief Camp #2
ZONE: Wayanad Landslides
NEED: 100x 10L Clean Water Cans, 50x ORS Packs
PEOPLE: 420
CONTACT: Dr. K. Sukumaran (+91 94471 89201)
DROP: Gate B Main Road (Passable by 4WD)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleTemplate);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden my-8">
        <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm">Low-Bandwidth & Offline Crisis Protocol</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs text-slate-700">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-950 flex items-start gap-2.5">
            <WifiOff className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Spotty or Zero 4G/5G Connectivity?</strong>
              <p className="mt-0.5 text-slate-600">
                Cell towers often collapse or experience power failure during major disasters. Use these fallback formats to route needs via SMS or Amateur Radio (HAM).
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Standardized SMS Relay Template
              </span>
              <button
                onClick={handleCopy}
                className="text-xs text-emerald-800 hover:underline flex items-center gap-1 font-semibold"
              >
                {copiedTemplate ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedTemplate ? 'Copied' : 'Copy Template'}</span>
              </button>
            </div>
            <pre className="bg-slate-900 text-slate-200 p-3 rounded-lg font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
              {sampleTemplate}
            </pre>
            <p className="text-[11px] text-slate-500 mt-1">
              Send this message to National Disaster Management Cell SMS Relay at <strong>+91 94470 12044</strong> or local SDRF desk.
            </p>
          </div>

          <div className="border-t border-slate-200 pt-3 space-y-2">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Emergency Frequencies & Helplines
            </span>
            <div className="space-y-1.5">
              <div className="flex justify-between p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-600">Amateur Radio Emergency Network (HAM):</span>
                <span className="font-mono font-bold text-slate-900">145.500 MHz (VHF) / 7.080 MHz (HF)</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-600">National Disaster Helpline (Toll-Free):</span>
                <span className="font-mono font-bold text-slate-900">1078 / 112</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-600">Red Cross Emergency Desk:</span>
                <span className="font-mono font-bold text-slate-900">+91 11 2371 6441</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-3">
            <button
              onClick={onClose}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded text-xs transition-colors"
            >
              Understood
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

