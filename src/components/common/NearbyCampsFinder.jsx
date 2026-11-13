import React, { useState, useEffect } from 'react';
import { MapPin, Building, Check, Radio, Navigation, ShieldCheck } from 'lucide-react';
import { lookupPincode, lookupPincodeAsync } from '../../utils/pincodeService';

export default function NearbyCampsFinder({
  pincode,
  selectedCampName = '',
  onSelectCamp,
  existingRequests = [],
  autoSelectFirst = true,
  className = ''
}) {
  const [lookupResult, setLookupResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cleanPin = (pincode || '').replace(/\D/g, '');
    if (cleanPin.length === 6) {
      // Immediate synchronous lookup
      const initial = lookupPincode(cleanPin, existingRequests);
      setLookupResult(initial);

      if (initial && autoSelectFirst && !selectedCampName && initial.primaryCamp && onSelectCamp) {
        onSelectCamp(initial.primaryCamp);
      }

      // Async refinement
      setLoading(true);
      lookupPincodeAsync(cleanPin, existingRequests)
        .then(refined => {
          if (refined) {
            setLookupResult(refined);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLookupResult(null);
    }
  }, [pincode, existingRequests]);

  const cleanPin = (pincode || '').replace(/\D/g, '');

  if (cleanPin.length < 6) {
    return (
      <div className={`p-3 bg-slate-50 border border-dashed border-slate-300 rounded-lg text-xs text-slate-500 flex items-center gap-2 ${className}`}>
        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
        <span>Enter 6-digit PIN code to auto-detect nearby relief camps & shelters.</span>
      </div>
    );
  }

  if (!lookupResult) return null;

  return (
    <div className={`bg-amber-50/60 border border-amber-200 rounded-xl p-3.5 space-y-3 ${className}`}>
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-amber-200/80">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-amber-700 animate-pulse shrink-0" />
          <span className="font-bold text-slate-900 text-xs">
            Nearby Relief Shelters Found for PIN {lookupResult.pincode}
          </span>
        </div>
        <span className="text-[11px] font-semibold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-300">
          📍 {lookupResult.locationLabel}
        </span>
      </div>

      {/* Camp cards */}
      <div className="space-y-2">
        <div className="text-[11px] text-slate-600 font-medium">
          Select or confirm the nearby camp (Shelter Name is optional — defaults to the nearest camp below):
        </div>

        <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-1">
          {lookupResult.camps.map((camp) => {
            const isSelected = selectedCampName && (
              selectedCampName.toLowerCase() === camp.name.toLowerCase() ||
              camp.name.toLowerCase().includes(selectedCampName.toLowerCase())
            );

            return (
              <div
                key={camp.id}
                onClick={() => onSelectCamp && onSelectCamp(camp)}
                className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'bg-amber-100/90 border-amber-500 shadow-sm ring-1 ring-amber-400'
                    : 'bg-white border-slate-200 hover:border-amber-400 hover:bg-amber-50/40'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900">{camp.name}</span>
                    <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded">
                      {camp.distance}
                    </span>
                    {camp.isLive && (
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded border border-emerald-300 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-ping"></span>
                        Active in System
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-600 flex items-center gap-2 flex-wrap">
                    <span>{camp.type}</span>
                    {camp.capacity && <span>• {camp.capacity}</span>}
                    {camp.contact && <span>• 📞 {camp.contact}</span>}
                  </div>

                  {camp.facilities && camp.facilities.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                      {camp.facilities.map((fac, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-medium border border-slate-200">
                          {fac}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCamp && onSelectCamp(camp);
                  }}
                  className={`shrink-0 px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-colors ${
                    isSelected
                      ? 'bg-amber-700 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-amber-600 hover:text-white text-slate-700'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Linked</span>
                    </>
                  ) : (
                    <span>Use This Shelter</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

