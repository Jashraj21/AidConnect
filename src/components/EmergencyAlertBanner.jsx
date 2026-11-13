import React, { useState } from 'react';
import { AlertTriangle, PhoneCall, Radio, ChevronRight, X } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function EmergencyAlertBanner({ onOpenOfflineGuide }) {
  const { calamityZones, selectedZoneId, setSelectedZoneId } = useData();
  const [dismissed, setDismissed] = useState(false);

  const activeZone = calamityZones.find(z => z.id === selectedZoneId) || calamityZones[0];

  if (dismissed) return null;

  return (
    <div className="bg-amber-500 text-slate-900 border-b border-amber-600/30 text-xs sm:text-sm font-medium px-4 py-2 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-[280px]">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-900 text-amber-100 uppercase tracking-wide animate-pulse">
            LIVE CRISIS ALERT
          </span>
          <p className="truncate">
            <strong className="font-semibold">{activeZone?.name}:</strong> {activeZone?.summary}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-1.5 text-xs text-amber-950 font-semibold bg-amber-400/80 px-2.5 py-1 rounded">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Emergency Cell: {activeZone?.contactHotline}</span>
          </div>

          <button
            onClick={onOpenOfflineGuide}
            className="inline-flex items-center gap-1 underline text-xs font-bold text-amber-950 hover:text-black"
            title="View offline SMS and radio coordination guidelines"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Low-Bandwidth / SMS Mode</span>
          </button>

          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-amber-900 hover:text-black rounded"
            title="Dismiss top bulletin"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

