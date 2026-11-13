import React, { useState } from 'react';
import {
  LifeBuoy,
  Heart,
  Package,
  Building2,
  PhoneCall,
  MapPin,
  Users,
  Compass,
  ArrowRight,
  Clock,
  Plus,
  IndianRupee,
  Boxes,
  CheckCircle2,
  UserCheck,
  ShieldCheck,
  Phone
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import MoneyDonationModal from '../donor/MoneyDonationModal';

export default function CalamityOverview() {
  const { setActiveView } = useAuth();
  const { calamityZones, requests, pledges, inventory = [], totalMonetaryFunds } = useData();
  const [showMoneyModal, setShowMoneyModal] = useState(false);
  const [dashboardTab, setDashboardTab] = useState('resources'); // 'resources' | 'requests' | 'completed'

  const totalAffected = calamityZones.reduce((sum, z) => sum + (z.affectedPeople || 0), 0);
  const totalCamps = calamityZones.reduce((sum, z) => sum + (z.campsCount || 0), 0);
  const totalAvailableUnits = inventory.reduce((sum, it) => sum + (it.inStock || 0), 0);

  const activeRequests = requests.filter(r => r.status !== 'COMPLETED');
  const completedRequests = requests.filter(r => r.status === 'COMPLETED');
  const completedPledges = pledges.filter(p => p.status === 'ACCEPTED' || p.status === 'DISTRIBUTED');
  const completedDonationsCount = completedRequests.length + completedPledges.length;

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-red-600/20 border border-red-500/40 text-red-300 text-xs font-bold uppercase tracking-wider">
              <span>Disaster Relief Aid Coordination</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Donation of Basic Needs in Places Affected by Natural Calamities.
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Direct, transparent coordination of essential survival items between donors, relief camps, and helping organizations.
            </p>

            {/* Role Gateways */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveView('supply-hub')}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm rounded-md shadow transition-colors flex items-center gap-2"
              >
                <span>Supply Donation & Needs Exchange</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setShowMoneyModal(true)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-md shadow transition-colors flex items-center gap-2 ring-2 ring-emerald-400/30"
              >
                <IndianRupee className="w-4 h-4 stroke-[2.5]" />
                <span>Donate Money</span>
              </button>

              <button
                onClick={() => setActiveView('donor-login')}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs sm:text-sm rounded-md shadow transition-colors flex items-center gap-2"
              >
                <Heart className="w-4 h-4 fill-current text-emerald-400" />
                <span>Donor Login</span>
              </button>

              <button
                onClick={() => setActiveView('receiver-login')}
                className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm rounded-md shadow transition-colors flex items-center gap-2"
              >
                <Package className="w-4 h-4" />
                <span>Receiver Login</span>
              </button>

              <button
                onClick={() => setActiveView('org-login')}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs sm:text-sm rounded-md transition-colors flex items-center gap-2"
              >
                <Building2 className="w-4 h-4 text-blue-400" />
                <span>Helping Org Login</span>
              </button>

              <button
                onClick={() => setActiveView('volunteer-login')}
                className="px-4 py-2.5 bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs sm:text-sm rounded-md transition-colors flex items-center gap-2 shadow-sm"
              >
                <UserCheck className="w-4 h-4" />
                <span>Volunteer Login</span>
              </button>
            </div>
          </div>

          {/* Situation numbers ticker */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-10 pt-8 border-t border-slate-800">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
                ₹{totalMonetaryFunds.toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Funds Donated (80G)</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{calamityZones.length}</div>
              <div className="text-xs text-slate-400 mt-0.5">Active Calamity Zones</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">{totalAvailableUnits.toLocaleString()}</div>
              <div className="text-xs text-slate-400 mt-0.5">Available Resource Units</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{activeRequests.length}</div>
              <div className="text-xs text-slate-400 mt-0.5">Active Relief Requests</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">{completedDonationsCount}</div>
              <div className="text-xs text-slate-400 mt-0.5">Completed Donations</div>
            </div>
          </div>
        </div>
      </section>

      {/* Money Donation Modal */}
      {showMoneyModal && (
        <MoneyDonationModal
          onClose={() => setShowMoneyModal(false)}
        />
      )}

      {/* REQUIREMENT 6: MASTER RELIEF DASHBOARD (AVAILABLE RESOURCES, ACTIVE REQUESTS & COMPLETED DONATIONS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-red-600 uppercase tracking-wider flex items-center gap-1.5">
                <Boxes className="w-4 h-4 text-emerald-600" />
                <span>Live Disaster Relief Dashboard</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mt-0.5">Relief Resources & Aid Status</h2>
              <p className="text-xs text-slate-500 mt-1">
                Real-time tracking of available inventory resources, active shelter requirements, and verified completed donations.
              </p>
            </div>

            {/* Quick Summary Badges */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                <span className="text-[10px] text-emerald-700 font-bold uppercase block">Available Stock</span>
                <span className="text-base font-extrabold text-emerald-900 font-mono">
                  {totalAvailableUnits.toLocaleString()} units
                </span>
              </div>
              <div className="bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
                <span className="text-[10px] text-amber-700 font-bold uppercase block">Active Requests</span>
                <span className="text-base font-extrabold text-amber-900 font-mono">
                  {activeRequests.length} needed
                </span>
              </div>
              <div className="bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg">
                <span className="text-[10px] text-blue-700 font-bold uppercase block">Completed Aid</span>
                <span className="text-base font-extrabold text-blue-900 font-mono">
                  {completedDonationsCount} delivered
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Dashboard Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 text-xs font-bold">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setDashboardTab('resources')}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  dashboardTab === 'resources'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Boxes className="w-4 h-4 text-emerald-400" />
                <span>Available Resources ({inventory.length})</span>
              </button>

              <button
                onClick={() => setDashboardTab('requests')}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  dashboardTab === 'requests'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Package className="w-4 h-4 text-amber-400" />
                <span>Active Requests ({activeRequests.length})</span>
              </button>

              <button
                onClick={() => setDashboardTab('completed')}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  dashboardTab === 'completed'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Completed Donations ({completedDonationsCount})</span>
              </button>
            </div>

            <button
              onClick={() => setActiveView('resources')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
            >
              <span>Explore Resource Directory</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* TAB 1: AVAILABLE RESOURCES */}
          {dashboardTab === 'resources' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inventory.slice(0, 6).map(res => (
                  <div key={res.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300 transition-all flex flex-col justify-between space-y-3 text-xs">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-slate-500 font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200">
                          {res.id}
                        </span>
                        <span className="font-bold text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {res.availability || 'AVAILABLE'}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{res.item || res.name}</h4>
                      <div className="text-slate-600 text-[11px] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{res.hub || res.location}</span>
                        {res.pincode && <span className="font-mono font-bold text-amber-800">PIN: {res.pincode}</span>}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-500 block text-[10px]">In Stock:</span>
                        <span className="font-bold text-emerald-700 text-sm">{res.inStock} {res.unit}</span>
                      </div>
                      <button
                        onClick={() => setActiveView('resources')}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded text-[11px] transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: ACTIVE REQUESTS */}
          {dashboardTab === 'requests' && (
            <div className="space-y-3">
              {activeRequests.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No active requests currently pending. All relief needs have been fulfilled!
                </div>
              ) : (
                <div className="divide-y divide-slate-100 text-xs">
                  {activeRequests.slice(0, 6).map(req => (
                    <div key={req.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                            {req.id}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            req.urgency === 'CRITICAL' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {req.urgency}
                          </span>
                          <span className="font-semibold text-slate-800">{req.category}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">{req.itemName}</h4>
                        <div className="text-slate-500 flex items-center gap-2 text-[11px]">
                          <span>{req.shelterName || req.campName}</span>
                          {req.pincode && <span className="font-mono font-bold text-amber-800">PIN: {req.pincode}</span>}
                          {req.requesterName && <span>• Lead: {req.requesterName}</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 block">Needed:</span>
                          <span className="font-bold text-red-700 text-sm">{req.quantityNeeded - (req.quantityFulfilled || 0)} left</span>
                        </div>
                        <button
                          onClick={() => setActiveView('needs-feed')}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-xs transition-colors flex items-center gap-1 shadow-sm"
                        >
                          <Heart className="w-3 h-3 fill-current" />
                          <span>Pledge Aid</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: COMPLETED DONATIONS */}
          {dashboardTab === 'completed' && (
            <div className="space-y-3">
              {completedDonationsCount === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  Completed aid handovers and delivered packages will be preserved here in the public audit ledger.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 text-xs">
                  {completedPledges.slice(0, 6).map(p => (
                    <div key={p.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                            #{p.id}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                            <span>COMPLETED & DISTRIBUTED</span>
                          </span>
                        </div>
                        <div className="font-bold text-slate-900 text-sm">
                          {p.quantity} × {p.itemName}
                        </div>
                        <div className="text-slate-500 text-[11px]">
                          Pledged by: <strong className="text-slate-800">{p.donorName}</strong> • Destination: {p.dropoffHub}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-mono text-slate-400 text-[10px]">
                          {p.acceptedAt ? new Date(p.acceptedAt).toLocaleDateString() : 'Verified'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ACTIVE CALAMITY ZONES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="text-xs font-bold text-red-600 uppercase tracking-wider">Calamity Sectors</div>
            <h2 className="text-2xl font-bold text-slate-900">Affected Zones</h2>
            <p className="text-xs text-slate-500 mt-1">
              Active regions currently requiring basic survival assistance.
            </p>
          </div>
          {calamityZones.length > 0 && (
            <button
              onClick={() => setActiveView('needs-feed')}
              className="text-xs font-bold text-slate-800 hover:text-red-700 flex items-center gap-1 group"
            >
              <span>View All Supply Requests</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>

        {calamityZones.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mx-auto">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No calamity zones recorded yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Camp representatives can submit urgent relief needs directly, and registered organizations can record affected zones.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setActiveView('emergency-quick')}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded transition-colors"
              >
                Submit Emergency Relief Need
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {calamityZones.map(zone => {
              const zoneRequests = requests.filter(r => r.zoneName === zone.name);

              return (
                <div
                  key={zone.id}
                  className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          {zone.type}
                        </span>
                        <h3 className="text-lg font-bold text-slate-900">{zone.name}</h3>
                        {zone.state && (
                          <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{zone.state}</span>
                          </div>
                        )}
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          zone.severity === 'CRITICAL'
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {zone.severity}
                      </span>
                    </div>

                    {zone.summary && (
                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                        {zone.summary}
                      </p>
                    )}

                    <div className="grid grid-cols-3 gap-2 text-xs border-y border-slate-100 py-3">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Camps</span>
                        <div className="font-bold text-slate-800 mt-0.5">{zone.campsCount || 0}</div>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Affected</span>
                        <div className="font-bold text-slate-800 mt-0.5">{(zone.affectedPeople || 0).toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Requests</span>
                        <div className="font-bold text-red-700 mt-0.5">{zoneRequests.length}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400">{zone.lastUpdated}</span>
                    <button
                      onClick={() => setActiveView('needs-feed')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded transition-colors"
                    >
                      View Needs →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
