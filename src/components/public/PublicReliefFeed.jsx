import React, { useState } from 'react';
import {
  Heart,
  MapPin,
  Search,
  Plus,
  IndianRupee,
  Phone
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIES } from '../../data/initialData';
import PledgeModal from '../donor/PledgeModal';
import MoneyDonationModal from '../donor/MoneyDonationModal';
import DirectReceiverContactModal from '../common/DirectReceiverContactModal';

export default function PublicReliefFeed() {
  const { requests } = useData();
  const { setActiveView } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedUrgency, setSelectedUrgency] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [targetRequest, setTargetRequest] = useState(null);
  const [moneyCamp, setMoneyCamp] = useState(null);
  const [contactRequest, setContactRequest] = useState(null);

  const filteredRequests = requests.filter(req => {
    if (selectedCategory !== 'ALL' && req.category !== selectedCategory) return false;
    if (selectedUrgency !== 'ALL' && req.urgency !== selectedUrgency) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchItem = req.itemName.toLowerCase().includes(q);
      const matchCamp = (req.campName || '').toLowerCase().includes(q);
      const matchShelter = (req.shelterName || '').toLowerCase().includes(q);
      const matchPin = (req.pincode || '').includes(q);
      const matchNote = (req.note || '').toLowerCase().includes(q);
      if (!matchItem && !matchCamp && !matchShelter && !matchNote && !matchPin) return false;
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
          <h1 className="text-2xl font-bold text-slate-900">Urgent Relief Requirements</h1>
          <p className="text-xs text-slate-500 mt-1">
            Requirements posted by disaster relief shelters and affected camps.
          </p>
        </div>

        <button
          onClick={() => setActiveView('receiver-login')}
          className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-md shadow-sm transition-colors flex items-center gap-1.5 self-start md:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Post a Need</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by need or camp..."
              className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-md bg-white font-medium outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="ALL">All Urgency Levels</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MODERATE">Moderate</option>
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

      {filteredRequests.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-700">No relief requirements currently listed.</p>
          <p className="text-xs text-slate-500">
            Camp representatives can submit a need using Receiver Login or the Emergency SOS form.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRequests.map(req => {
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
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {req.urgency}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-snug">{req.itemName}</h3>
                    <div className="text-xs text-slate-700 mt-1 flex flex-wrap items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="font-semibold">{req.campName || req.shelterName}</span>
                      {req.pincode && (
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-900 border border-amber-200">
                          PIN: {req.pincode}
                        </span>
                      )}
                    </div>
                    {req.dropLocation && (
                      <div className="text-[11px] text-slate-500 pl-4">Gate / Point: {req.dropLocation}</div>
                    )}
                    {req.zoneName && (
                      <div className="text-[11px] text-slate-400 pl-4">{req.zoneName}</div>
                    )}

                    {/* Receiver contact badge */}
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-200">
                      <span>Receiver: <strong className="text-slate-800">{req.requesterName || 'Camp Lead'}</strong></span>
                      {req.requesterPhone && (
                        <a
                          href={`tel:${req.requesterPhone}`}
                          className="font-mono text-emerald-700 underline font-semibold flex items-center gap-0.5 hover:text-emerald-800"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{req.requesterPhone}</span>
                        </a>
                      )}
                      {req.peopleCount > 0 && <span className="text-slate-400">• ~{req.peopleCount} sheltered</span>}
                    </div>
                  </div>

                  {req.note && (
                    <p className="text-xs text-slate-600 bg-amber-50/50 p-2.5 rounded border border-amber-200/60 italic">
                      "{req.note}"
                    </p>
                  )}

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

                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setContactRequest(req)}
                      className="px-2 py-1.5 rounded-md text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition-colors flex items-center gap-1 shadow-sm"
                      title="Contact receiver directly"
                    >
                      <Phone className="w-3 h-3 text-emerald-700" />
                      <span>Contact</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMoneyCamp(req)}
                      className="px-2.5 py-1.5 rounded-md text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Donate ₹</span>
                    </button>
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
                      <span>{isDone ? 'Fulfilled' : 'Pledge'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {targetRequest && (
        <PledgeModal
          request={targetRequest}
          onClose={() => setTargetRequest(null)}
          onSuccess={() => {}}
        />
      )}

      {/* DIRECT DONATE MONEY MODAL */}
      {moneyCamp && (
        <MoneyDonationModal
          defaultCamp={moneyCamp}
          onClose={() => setMoneyCamp(null)}
        />
      )}

      {/* DIRECT CONTACT RECEIVER MODAL */}
      {contactRequest && (
        <DirectReceiverContactModal
          request={contactRequest}
          onClose={() => setContactRequest(null)}
        />
      )}
    </div>
  );
}
