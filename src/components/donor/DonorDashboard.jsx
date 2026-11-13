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
  Truck,
  MapPin,
  Filter,
  Plus,
  FileCheck,
  PackageCheck,
  Search,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { CATEGORIES } from '../../data/initialData';
import PledgeModal from './PledgeModal';

export default function DonorDashboard() {
  const { currentUser, setActiveView } = useAuth();
  const { requests, pledges, calamityZones } = useData();

  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'my-pledges' | 'sponsor-kits'
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedZone, setSelectedZone] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [pledgeTargetRequest, setPledgeTargetRequest] = useState(null);

  // Filter requests
  const filteredRequests = requests.filter(req => {
    if (selectedCategory !== 'ALL' && req.category !== selectedCategory) return false;
    if (selectedZone !== 'ALL' && req.zoneId !== selectedZone) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchItem = req.itemName.toLowerCase().includes(q);
      const matchCamp = req.campName.toLowerCase().includes(q);
      const matchNote = (req.note || '').toLowerCase().includes(q);
      if (!matchItem && !matchCamp && !matchNote) return false;
    }
    return true;
  });

  // User's own pledges (or all sample pledges if demo user)
  const myPledges = pledges.filter(p => {
    if (!currentUser) return true;
    if (currentUser.id === 'usr-donor-1') return true; // demo user sees all verified demo pledges
    return (
      p.donorEmail?.toLowerCase() === currentUser.email?.toLowerCase() ||
      p.donorName?.toLowerCase() === currentUser.name?.toLowerCase()
    );
  });

  const totalItemsPledged = myPledges.reduce((sum, p) => sum + (p.quantity || 0), 0);

  // Helper for category badge
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
                  Welcome back, {currentUser?.name || 'Supporter'}
                </h1>
                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Verified Donor
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Direct disaster material response • Location: {currentUser?.city || 'Relief Supporter'}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 sm:gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
            <div className="text-center px-3 py-1 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-lg font-bold text-slate-900">{myPledges.length}</div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Active Pledges</div>
            </div>
            <div className="text-center px-3 py-1 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-lg font-bold text-emerald-700">{totalItemsPledged}</div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Supplies Pledged</div>
            </div>
            <div className="text-center px-3 py-1 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-lg font-bold text-blue-700">100%</div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Direct Relief</div>
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
            <span>My Pledges & Tracking ({myPledges.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('sponsor-kits')}
            className={`px-4 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'sponsor-kits'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Pre-Packed Emergency Kits</span>
          </button>
        </div>
      </div>

      {/* TAB 1: BROWSE URGENT NEEDS */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by need (e.g. water cans, ORS, blankets) or camp..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* Zone Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">Calamity Area:</span>
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="text-xs border border-slate-300 rounded-md px-2.5 py-1.5 bg-white font-medium outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="ALL">All Disaster Zones</option>
                  {calamityZones.map(z => (
                    <option key={z.id} value={z.id}>{z.name}</option>
                  ))}
                </select>
              </div>
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

          {/* Requests Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRequests.map(req => {
              const zone = calamityZones.find(z => z.id === req.zoneId);
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
                    {/* Header */}
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
                        {req.urgency} URGENCY
                      </span>
                    </div>

                    {/* Item Name */}
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-snug">{req.itemName}</h3>
                      <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{req.campName}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 pl-4">{zone?.name}</div>
                    </div>

                    {/* Note from on-ground lead */}
                    {req.note && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200/80 italic">
                        "{req.note}"
                      </p>
                    )}

                    {/* People count & verified badge */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-slate-500">
                        Sheltering <strong>{req.peopleCount}</strong> evacuees
                      </span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified Request</span>
                      </span>
                    </div>

                    {/* Fulfillment Progress */}
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

                  {/* Pledge Button */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-xs">
                      {isFullyFulfilled ? (
                        <span className="text-emerald-700 font-bold">100% Pledged</span>
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
                      <span>{isFullyFulfilled ? 'Fulfilled' : 'Pledge Items'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: MY PLEDGED SUPPLIES & TRACKING */}
      {activeTab === 'my-pledges' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Your Relief Supply Pledges</h2>
              <p className="text-xs text-slate-500">Live status of material donations dispatched to disaster hubs.</p>
            </div>
            <button
              onClick={() => setActiveTab('browse')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Pledge Another Supply</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Pledge ID</th>
                  <th className="py-3 px-4">Relief Item</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Destination Camp</th>
                  <th className="py-3 px-4">Staging Warehouse</th>
                  <th className="py-3 px-4">Delivery Mode</th>
                  <th className="py-3 px-4">Tracking Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {myPledges.map(p => {
                  const targetReq = requests.find(r => r.id === p.requestId);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{p.id}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{p.itemName}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{p.quantity} units</td>
                      <td className="py-3.5 px-4 text-slate-600">{targetReq?.campName || 'Designated Camp'}</td>
                      <td className="py-3.5 px-4 text-slate-600 truncate max-w-[180px]">{p.dropoffHub}</td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-medium">
                          {p.deliveryMethod}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] ${
                            p.status === 'DELIVERED_TO_HUB' || p.status === 'DISTRIBUTED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : p.status === 'IN_TRANSIT' || p.status === 'DISPATCHED'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          <Truck className="w-3 h-3" />
                          <span>{p.status}</span>
                        </span>
                        {p.trackingNotes && (
                          <div className="text-[10px] text-slate-500 mt-1">{p.trackingNotes}</div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SPONSOR PRE-PACKED KITS */}
      {activeTab === 'sponsor-kits' && (
        <div className="space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs text-emerald-950 flex items-start gap-3">
            <Heart className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-sm">Pre-Packaged Survival Kits for Immediate Procurement:</strong>
              <p className="mt-0.5 text-slate-600">
                Can't ship physical goods yourself? Sponsor standardized survival crates assembled by verified NGOs (SEEDS, Goonj, Red Cross) at field hubs with wholesale procurement rates.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Kit 1 */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold mb-3">
                  <Droplets className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Clean Water & Hydration Crate</h3>
                <p className="text-xs text-slate-500 mt-1">Sustains 4 families for 10 days in flooded zones.</p>

                <ul className="mt-4 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <li className="flex items-center gap-1.5">• 4 × 20L Collapsible Food-Grade Jerry Cans</li>
                  <li className="flex items-center gap-1.5">• 200 × Chlorine Halazone Purification Tabs</li>
                  <li className="flex items-center gap-1.5">• 40 × WHO Grade ORS Rehydration Packs</li>
                  <li className="flex items-center gap-1.5">• 1 × Gravity Ceramic Water Filter Cartridge</li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-500">Unit Cost (Standardized):</span>
                  <span className="font-bold text-base text-slate-900">₹1,850 / $22</span>
                </div>
                <button
                  onClick={() => {
                    const req = requests.find(r => r.category === 'WATER') || requests[0];
                    setPledgeTargetRequest(req);
                  }}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded transition-colors"
                >
                  Sponsor Water Crate
                </button>
              </div>
            </div>

            {/* Kit 2 */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold mb-3">
                  <Baby className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Infant & Toddler Relief Bundle</h3>
                <p className="text-xs text-slate-500 mt-1">Specialized nutrition and hygiene for children under 3.</p>

                <ul className="mt-4 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <li className="flex items-center gap-1.5">• 4 × Tins Stage 1 & 2 Baby Formula Powder</li>
                  <li className="flex items-center gap-1.5">• 3 × Packs Hypoallergenic Baby Diapers (M/L)</li>
                  <li className="flex items-center gap-1.5">• 2 × BPA-Free Sterilizable Feeding Bottles</li>
                  <li className="flex items-center gap-1.5">• 4 × Packs Antiseptic Baby Wet Wipes</li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-500">Unit Cost (Standardized):</span>
                  <span className="font-bold text-base text-slate-900">₹2,400 / $29</span>
                </div>
                <button
                  onClick={() => {
                    const req = requests.find(r => r.category === 'BABY_CARE') || requests[0];
                    setPledgeTargetRequest(req);
                  }}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded transition-colors"
                >
                  Sponsor Infant Bundle
                </button>
              </div>
            </div>

            {/* Kit 3 */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-3">
                  <Tent className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Emergency Shelter & Warmth Kit</h3>
                <p className="text-xs text-slate-500 mt-1">Waterproof protection for evacuated families.</p>

                <ul className="mt-4 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <li className="flex items-center gap-1.5">• 1 × Heavy Duty Silpaulin Sheet (15x18 ft)</li>
                  <li className="flex items-center gap-1.5">• 4 × High-Density Thermal Woolen Blankets</li>
                  <li className="flex items-center gap-1.5">• 2 × Waterproof Ground Sleeping Foam Mats</li>
                  <li className="flex items-center gap-1.5">• 1 × Solar LED Camping Lantern with USB Port</li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-500">Unit Cost (Standardized):</span>
                  <span className="font-bold text-base text-slate-900">₹3,200 / $38</span>
                </div>
                <button
                  onClick={() => {
                    const req = requests.find(r => r.category === 'SHELTER') || requests[0];
                    setPledgeTargetRequest(req);
                  }}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded transition-colors"
                >
                  Sponsor Shelter Kit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for pledging */}
      {pledgeTargetRequest && (
        <PledgeModal
          request={pledgeTargetRequest}
          onClose={() => setPledgeTargetRequest(null)}
          onSuccess={() => {
            // refresh
          }}
        />
      )}
    </div>
  );
}

