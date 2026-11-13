import React, { useState } from 'react';
import { Building, MapPin, ArrowRight, Plus, Search } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export default function CampDirectory() {
  const { requests } = useData();
  const { setActiveView } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredCamps = allCamps.filter(c => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchShelter = c.shelterName.toLowerCase().includes(q);
      const matchPin = c.pincode.includes(q);
      const matchLoc = c.location.toLowerCase().includes(q);
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
            Registered relief shelters currently requesting basic survival aid.
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

      {/* Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search camps by shelter name, PIN code (e.g. 682001), or area..."
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 outline-none"
          />
        </div>
      </div>

      {filteredCamps.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-3">
          <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mx-auto">
            <Building className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No camps matching criteria</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            When a camp coordinator posts a relief requirement, their camp details and PIN code will appear here.
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
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-700" />
                      <span>PIN: {camp.pincode}</span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base">{camp.name}</h3>
                  {camp.location && (
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{camp.location}</span>
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Contact Person:</span>
                    <span className="font-semibold text-slate-900">{camp.leadName}</span>
                  </div>
                  {camp.phone && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Phone:</span>
                      <span className="font-mono text-slate-800">{camp.phone}</span>
                    </div>
                  )}
                  {camp.peopleCount > 0 && (
                    <div className="flex justify-between border-t border-slate-200 pt-1 mt-1">
                      <span className="text-slate-500">Sheltered:</span>
                      <span className="font-bold text-slate-900">{camp.peopleCount} people</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-600">
                  <strong>{camp.needsCount}</strong> active requests
                </span>
                <button
                  onClick={() => setActiveView('needs-feed')}
                  className="text-xs font-bold text-amber-900 hover:text-amber-700 flex items-center gap-1"
                >
                  <span>View Needs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
