import React, { useState } from 'react';
import { PhoneCall, X } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function EmergencyAlertBanner() {
  const { calamityZones } = useData();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || calamityZones.length === 0) return null;

  const activeZone = calamityZones[0];

  return (
    <div className="bg-amber-500 text-slate-900 border-b border-amber-600/30 text-xs sm:text-sm font-medium px-4 py-2 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-[280px]">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-900 text-amber-100 uppercase tracking-wide">
            CRISIS ALERT
          </span>
          <p className="truncate">
            <strong className="font-semibold">{activeZone.name}:</strong> {activeZone.summary || activeZone.type}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {activeZone.contactHotline && (
            <div className="hidden md:flex items-center gap-1.5 text-xs text-amber-950 font-semibold bg-amber-400/80 px-2.5 py-1 rounded">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Emergency Hotline: {activeZone.contactHotline}</span>
            </div>
          )}

          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-amber-900 hover:text-black rounded"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
