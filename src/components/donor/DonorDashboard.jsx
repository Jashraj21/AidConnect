import React, { useState } from 'react';
import {
  Heart,
  CheckCircle2,
  MapPin,
  PackageCheck,
  Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { CATEGORIES } from '../../data/initialData';
import PledgeModal from './PledgeModal';

export default function DonorDashboard() {
  const { currentUser } = useAuth();
  const { requests, pledges, calamityZones } = useData();

  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'my-pledges'
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [pledgeTargetRequest, setPledgeTargetRequest] = useState(null);

  // Filter requests
  const filteredRequests = requests.filter(req => {
    if (selectedCategory !== 'ALL' && req.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchItem = req.itemName.toLowerCase().includes(q);
      const matchCamp = req.campName.toLowerCase().includes(q);
      const matchNote = (req.note || '').toLowerCase().includes(q);
      if (!matchItem && !matchCamp && !matchNote) return false;
    }
    return true;
  });

  // User's own pledges
  const myPledges = pledges.filter(p => {
    if (!currentUser) return true;
    return (
      (currentUser.email && p.donorEmail?.toLowerCase() === currentUser.email?.toLowerCase()) ||
      (currentUser.name && p.donorName?.toLowerCase() === currentUser.name?.toLowerCase())
    );
  });

  const totalItemsPledged = myPledges.reduce((sum, p) => sum + (p.quantity || 0), 0);

  const getCatDetails = (catId) => {
    return CATEGORIES.find(c => c.id === catId) || { label: catId, color: 'text-slate-700 bg-slate-100' };
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      {/* Donor Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">
                  Welcome, {currentUser?.name || 'Supporter'}
                </h1>
                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Donor
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Direct disaster basic needs support {currentUser?.city ? `• ${currentUser.city}` : ''}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 sm:gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
            <div className="text-center px-3 py-1 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-lg font-bold text-slate-900">{myPledges.length}</div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">My Pledges</div>
            </div>
            <div className="text-center px-3 py-1 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-lg font-bold text-emerald-700">{totalItemsPledged}</div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Items Pledged</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'browse'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Browse Urgent Shortages ({filteredRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('my-pledges')}
            className={`px-4 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'my-pledges'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <PackageCheck className="w-3.5 h-3.5" />
            <span>My Pledges ({myPledges.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: BROWSE URGENT NEEDS */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by item name, camp, or notes..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* Categories pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-colors ${
                  selectedCategory === 'ALL'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Needs
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-colors ${
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
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-700">No relief requests currently listed.</p>
              <p className="text-xs text-slate-500">When relief camps submit requirements, they will appear here for donors to pledge.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRequests.map(req => {
                const catDetails = getCatDetails(req.category);
                const fulfilled = req.quantityFulfilled || 0;
                const percent = Math.min(100, Math.round((fulfilled / req.quantityNeeded) * 100));
                const remaining = Math.max(0, req.quantityNeeded - fulfilled);
                const isFullyFulfilled = remaining === 0;

                return (
                  <div
                    key={req.id}
                    className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${catDetails.color}`}>
                          {catDetails.label}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            req.urgency === 'CRITICAL'
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : req.urgency === 'HIGH'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-blue-100 text-blue-800 border border-blue-200'
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
                        {req.zoneName && (
                          <div className="text-[11px] text-slate-400 pl-4">{req.zoneName}</div>
                        )}
                      </div>

                      {req.note && (
                        <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200/80 italic">
                          "{req.note}"
                        </p>
                      )}

                      {req.peopleCount > 0 && (
                        <div className="flex items-center justify-between text-xs pt-1">
                          <span className="text-slate-500">
                            People sheltered: <strong>{req.peopleCount}</strong>
                          </span>
                        </div>
                      )}

                      <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Fulfilled: <strong>{fulfilled}</strong> of {req.quantityNeeded}</span>
                          <span className="font-bold text-slate-700">{percent}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all rounded-full ${
                              isFullyFulfilled ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-xs">
                        {isFullyFulfilled ? (
                          <span className="text-emerald-700 font-bold">Fulfilled</span>
                        ) : (
                          <span className="text-slate-600">
                            Shortage: <strong className="text-red-700">{remaining} needed</strong>
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => setPledgeTargetRequest(req)}
                        disabled={isFullyFulfilled}
                        className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm ${
                          isFullyFulfilled
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        <Heart className="w-3.5 h-3.5 fill-current" />
                        <span>{isFullyFulfilled ? 'Fulfilled' : 'Pledge'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY PLEDGED SUPPLIES */}
      {activeTab === 'my-pledges' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-200">
            <h2 className="text-base font-bold text-slate-900">Your Relief Supply Pledges</h2>
          </div>

          {myPledges.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              You haven't made any pledges yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Pledge ID</th>
                    <th className="py-3 px-4">Relief Item</th>
                    <th className="py-3 px-4">Quantity</th>
                    <th className="py-3 px-4">Staging Hub</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {myPledges.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{p.id}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{p.itemName}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{p.quantity}</td>
                      <td className="py-3.5 px-4 text-slate-600">{p.dropoffHub}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full font-bold text-[10px] bg-slate-100 text-slate-800">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal for pledging */}
      {pledgeTargetRequest && (
        <PledgeModal
          request={pledgeTargetRequest}
          onClose={() => setPledgeTargetRequest(null)}
          onSuccess={() => {}}
        />
      )}
    </div>
  );
}
