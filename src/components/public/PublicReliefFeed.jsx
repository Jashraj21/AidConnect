import React, { useState } from 'react';
import {
  Heart,
  Droplets,
  Utensils,
  HeartPulse,
  Baby,
  Tent,
  ShieldAlert,
  SunMedium,
  CheckCircle2,
  Clock,
  MapPin,
  Search,
  Filter,
  Plus
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIES } from '../../data/initialData';
import PledgeModal from '../donor/PledgeModal';

export default function PublicReliefFeed() {
  const { requests, calamityZones } = useData();
  const { currentUser, setActiveView } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedZone, setSelectedZone] = useState('ALL');
  const [selectedUrgency, setSelectedUrgency] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [targetRequest, setTargetRequest] = useState(null);

  const filteredRequests = requests.filter(req => {
    if (selectedCategory !== 'ALL' && req.category !== selectedCategory) return false;
    if (selectedZone !== 'ALL' && req.zoneId !== selectedZone) return false;
    if (selectedUrgency !== 'ALL' && req.urgency !== selectedUrgency) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchItem = req.itemName.toLowerCase().includes(q);
      const matchCamp = req.campName.toLowerCase().includes(q);
      const matchNote = (req.note || '').toLowerCase().includes(q);
      if (!matchItem && !matchCamp && !matchNote) return false;
    }
    return true;
  });

  const getCat = (catId) => CATEGORIES.find(c => c.id === catId) || { label: catId, color: 'text-slate-700 bg-slate-100' };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-red-600 uppercase tracking-wider">Live Needs Feed</div>
          <h1 className="text-2xl font-bold text-slate-900">Urgent Disaster Relief Requirements</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time survival supply requests posted directly by disaster relief camps and emergency shelters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('receiver-login')}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-md shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Post a Need (Camp In-charge)</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by need or relief camp..."
              className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-md bg-white font-medium outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="ALL">All Calamity Zones</option>
              {calamityZones.map(z => (
                <option key={z.id} value={z.id}>{z.name}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-md bg-white font-medium outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="ALL">All Urgency Levels</option>
              <option value="CRITICAL">Critical (6-12 hrs)</option>
              <option value="HIGH">High (24 hrs)</option>
              <option value="MODERATE">Moderate (48 hrs)</option>
            </select>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-slate-100">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-colors ${
              selectedCategory === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Needs ({requests.length})
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Needs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRequests.map(req => {
          const zone = calamityZones.find(z => z.id === req.zoneId);
          const cat = getCat(req.category);
          const fulfilled = req.quantityFulfilled || 0;
          const percent = Math.min(100, Math.round((fulfilled / req.quantityNeeded) * 100));
          const remaining = Math.max(0, req.quantityNeeded - fulfilled);
          const isDone = remaining === 0;

          return (
            <div
              key={req.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${cat.color}`}>
                    {cat.label}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      req.urgency === 'CRITICAL'
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : req.urgency === 'HIGH'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {req.urgency}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug">{req.itemName}</h3>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{req.campName}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 pl-4">{zone?.name}</div>
                </div>

                {req.note && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200/80 italic">
                    "{req.note}"
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Shelter count: <strong>{req.peopleCount}</strong></span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </span>
                </div>

                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Pledged: <strong>{fulfilled}</strong> / {req.quantityNeeded}</span>
                    <span className="font-bold text-slate-700">{percent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isDone ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs">
                  {isDone ? (
                    <span className="text-emerald-700 font-bold">Fulfilled</span>
                  ) : (
                    <span className="text-slate-600 font-medium">
                      Needed: <strong className="text-red-700">{remaining}</strong>
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setTargetRequest(req)}
                  disabled={isDone}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm ${
                    isDone
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span>{isDone ? 'Fulfilled' : 'Pledge Items'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {targetRequest && (
        <PledgeModal
          request={targetRequest}
          onClose={() => setTargetRequest(null)}
          onSuccess={() => {}}
        />
      )}
    </div>
  );
}

