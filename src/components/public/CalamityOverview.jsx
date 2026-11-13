import React from 'react';
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
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export default function CalamityOverview() {
  const { setActiveView } = useAuth();
  const { calamityZones, requests, pledges } = useData();

  const totalAffected = calamityZones.reduce((sum, z) => sum + (z.affectedPeople || 0), 0);
  const totalCamps = calamityZones.reduce((sum, z) => sum + (z.campsCount || 0), 0);
  const criticalNeedsCount = requests.filter(r => r.urgency === 'CRITICAL' && r.status !== 'DELIVERED').length;

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
                onClick={() => setActiveView('donor-login')}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-md shadow transition-colors flex items-center gap-2"
              >
                <Heart className="w-4 h-4 fill-current" />
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
            </div>
          </div>

          {/* Situation numbers ticker */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-8 border-t border-slate-800">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{calamityZones.length}</div>
              <div className="text-xs text-slate-400 mt-0.5">Active Calamity Zones</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">{totalCamps}</div>
              <div className="text-xs text-slate-400 mt-0.5">Relief Camps Recorded</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{requests.length}</div>
              <div className="text-xs text-slate-400 mt-0.5">Supply Requests Posted</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">{pledges.length}</div>
              <div className="text-xs text-slate-400 mt-0.5">Pledges Confirmed</div>
            </div>
          </div>
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
