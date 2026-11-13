import React, { useState } from 'react';
import { Building, MapPin, ArrowRight, Plus, Search, Compass, Navigation, IndianRupee } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import NearbyCampsFinder from '../common/NearbyCampsFinder';
import MoneyDonationModal from '../donor/MoneyDonationModal';

export default function CampDirectory() {
  const { requests } = useData();
  const { setActiveView } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [lookupPin, setLookupPin] = useState('');
  const [moneyCamp, setMoneyCamp] = useState(null);

  // Group requests by camp name
  const campsMap = {};
  requests.forEach(r => {
    const key = r.campName || r.shelterName || 'Relief Camp';
    if (!campsMap[key]) {
      campsMap[key] = {
        name: key,
        shelterName: r.shelterName || key,
        pincode: r.pincode || '',
        zoneName: r.zoneName || 'Calamity Sector',
        leadName: r.requesterName || 'Camp Contact',
        phone: r.requesterPhone || '',
        location: r.dropLocation || '',
        peopleCount: r.peopleCount || 0,
        needsCount: 0
      };
    }
    campsMap[key].needsCount += 1;
    if (!campsMap[key].pincode && r.pincode) campsMap[key].pincode = r.pincode;
  });

  const allCamps = Object.values(campsMap);

  const activePinFilter = lookupPin.trim().replace(/\D/g, '');

  const filteredCamps = allCamps.filter(c => {
    if (activePinFilter.length === 6 && c.pincode) {
      if (c.pincode !== activePinFilter) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchShelter = c.shelterName.toLowerCase().includes(q);
      const matchPin = (c.pincode || '').includes(q);
      const matchLoc = (c.location || '').toLowerCase().includes(q);
      if (!matchName && !matchShelter && !matchPin && !matchLoc) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Field Shelters Directory</div>
          <h1 className="text-2xl font-bold text-slate-900">Relief Camps & Shelters</h1>
          <p className="text-xs text-slate-500 mt-1">
            Locate nearby disaster relief shelters by entering your 6-digit postal PIN code.
          </p>
        </div>

        <button
          onClick={() => setActiveView('receiver-login')}
          className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-md shadow-sm transition-colors flex items-center gap-1.5 self-start md:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Register Camp / Post Need</span>
        </button>
      </div>

      {/* PIN Code Locator Box */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-amber-600" />
              <span>Find Nearby Shelters by PIN Code:</span>
            </label>
            <div className="relative">
              <input
                type="text"
                maxLength="6"
                value={lookupPin}
                onChange={(e) => setLookupPin(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit PIN code (e.g. 682001, 600001, 110001)..."
                className="w-full px-3 py-2 text-xs font-mono font-bold border-2 border-amber-300 rounded-md focus:ring-2 focus:ring-amber-500 outline-none bg-amber-50/20"
              />
              {lookupPin && (
                <button
                  onClick={() => setLookupPin('')}
                  className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <Search className="w-4 h-4 text-slate-400" />
              <span>Search Directory by Keyword:</span>
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by shelter name, area, landmark..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 outline-none"
            />
          </div>
        </div>

        {/* Nearby Camps Auto-Detector if PIN entered */}
        {lookupPin.length === 6 && (
          <NearbyCampsFinder
            pincode={lookupPin}
            existingRequests={requests}
          />
        )}
      </div>

      {filteredCamps.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-3">
          <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mx-auto">
            <Building className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No active camp requests registered for this criteria</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Use the PIN code tool above to discover nearby designated relief shelters in this area, or register a new camp requirement.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setActiveView('receiver-login')}
              className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded transition-colors"
            >
              Post Camp Need (Receiver Login)
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCamps.map((camp, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {camp.zoneName}
                  </span>
                  {camp.pincode && (
                    <span className="font-mono bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-bold">
                      PIN: {camp.pincode}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base">{camp.shelterName || camp.name}</h3>
                  <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{camp.location || 'Shelter Facility'}</span>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Active Shortages:</span>
                    <span className="font-bold text-red-600">{camp.needsCount} items needed</span>
                  </div>
                  {camp.peopleCount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Sheltered:</span>
                      <span className="font-semibold text-slate-800">~{camp.peopleCount} individuals</span>
                    </div>
                  )}
                  {camp.phone && (
                    <div className="flex justify-between border-t border-slate-200 pt-1 text-[11px]">
                      <span className="text-slate-500">Contact:</span>
                      <span className="font-mono text-slate-700">{camp.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                <button
                  onClick={() => setActiveView('needs-feed')}
                  className="text-amber-800 hover:text-amber-900 font-bold flex items-center gap-1"
                >
                  <span>View shortages</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setMoneyCamp(camp)}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded font-bold text-[11px] transition-colors flex items-center gap-1"
                  >
                    <IndianRupee className="w-3 h-3 text-emerald-400" />
                    <span>Donate ₹</span>
                  </button>
                  <button
                    onClick={() => setActiveView('donor-login')}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[11px] transition-colors"
                  >
                    Pledge Aid
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DIRECT CAMP MONEY DONATION MODAL */}
      {moneyCamp && (
        <MoneyDonationModal
          defaultCamp={moneyCamp}
          onClose={() => setMoneyCamp(null)}
        />
      )}
    </div>
  );
}
