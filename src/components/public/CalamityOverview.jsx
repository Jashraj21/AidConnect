import React from 'react';
import {
  LifeBuoy,
  AlertTriangle,
  Heart,
  Package,
  Building2,
  PhoneCall,
  MapPin,
  Users,
  Compass,
  ArrowRight,
  ShieldCheck,
  Radio,
  Clock,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export default function CalamityOverview({ onOpenQuickSos }) {
  const { setActiveView, quickDemoLogin } = useAuth();
  const { calamityZones, requests, pledges } = useData();

  const totalAffected = calamityZones.reduce((sum, z) => sum + z.affectedPeople, 0);
  const totalCamps = calamityZones.reduce((sum, z) => sum + z.campsCount, 0);
  const criticalNeedsCount = requests.filter(r => r.urgency === 'CRITICAL' && r.status !== 'DELIVERED').length;

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section - Grounded, human, zero AI-slop */}
      <section className="bg-slate-900 text-white border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-red-600/20 border border-red-500/40 text-red-300 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>Real-Time Disaster Relief Logistics</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Direct Aid for Basic Survival Needs in Calamity Zones.
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              When disaster strikes, general cash doesn't feed an infant or purify contaminated water.
              <strong> DoNation</strong> maps precise, tangible survival items (clean water cans, baby formula, ORS, tarpaulins, woolen blankets) between verified relief camps, individual donors, and field response teams.
            </p>

            {/* Role Gateways */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveView('donor-login')}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-md shadow transition-colors flex items-center gap-2"
              >
                <Heart className="w-4 h-4 fill-current" />
                <span>I Want to Donate Supplies</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveView('receiver-login')}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm rounded-md shadow transition-colors flex items-center gap-2"
              >
                <Package className="w-4 h-4" />
                <span>I Am at a Camp / Need Aid</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveView('org-login')}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs sm:text-sm rounded-md transition-colors flex items-center gap-2"
              >
                <Building2 className="w-4 h-4 text-blue-400" />
                <span>Helping Org / NGO Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick situation numbers ticker */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-8 border-t border-slate-800">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{calamityZones.length}</div>
              <div className="text-xs text-slate-400 mt-0.5">Active Disaster Zones</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">{totalCamps}</div>
              <div className="text-xs text-slate-400 mt-0.5">Relief Camps Sheltered</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{totalAffected.toLocaleString()}</div>
              <div className="text-xs text-slate-400 mt-0.5">Displaced Individuals</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-red-400 font-mono">{criticalNeedsCount}</div>
              <div className="text-xs text-slate-400 mt-0.5">Critical Supply Shortages</div>
            </div>
          </div>
        </div>
      </section>

      {/* Fast Tester Callout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-100 border border-slate-300 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-slate-800">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Reviewing This Application?</strong> Test each stakeholder view with one click:
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => quickDemoLogin('DONOR')}
              className="px-2.5 py-1.5 bg-white hover:bg-emerald-50 text-emerald-800 font-bold rounded border border-slate-300 text-[11px]"
            >
              Donor Demo
            </button>
            <button
              onClick={() => quickDemoLogin('RECEIVER')}
              className="px-2.5 py-1.5 bg-white hover:bg-amber-50 text-amber-900 font-bold rounded border border-slate-300 text-[11px]"
            >
              Camp Lead Demo
            </button>
            <button
              onClick={() => quickDemoLogin('ORGANIZATION')}
              className="px-2.5 py-1.5 bg-white hover:bg-blue-50 text-blue-900 font-bold rounded border border-slate-300 text-[11px]"
            >
              NGO Officer Demo
            </button>
          </div>
        </div>
      </div>

      {/* ACTIVE CALAMITY ZONES MAP / CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="text-xs font-bold text-red-600 uppercase tracking-wider">Active Calamity Sectors</div>
            <h2 className="text-2xl font-bold text-slate-900">Current Disaster Relief Zones</h2>
            <p className="text-xs text-slate-500 mt-1">
              Field intelligence verified with State Disaster Management Authorities and on-ground rescue units.
            </p>
          </div>
          <button
            onClick={() => setActiveView('needs-feed')}
            className="text-xs font-bold text-slate-800 hover:text-red-700 flex items-center gap-1 group"
          >
            <span>View All Supply Requests</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {calamityZones.map(zone => {
            const zoneRequests = requests.filter(r => r.zoneId === zone.id);
            const criticalZoneReqs = zoneRequests.filter(r => r.urgency === 'CRITICAL');

            return (
              <div
                key={zone.id}
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Zone Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {zone.type}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900">{zone.name}</h3>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{zone.state}</span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        zone.severity === 'CRITICAL'
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {zone.severity} EMERGENCY
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {zone.summary}
                  </p>

                  {/* Metrics grid */}
                  <div className="grid grid-cols-3 gap-2 text-xs border-y border-slate-100 py-3">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Camps</span>
                      <div className="font-bold text-slate-800 mt-0.5">{zone.campsCount} shelters</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Affected People</span>
                      <div className="font-bold text-slate-800 mt-0.5">{zone.affectedPeople.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Open Requisitions</span>
                      <div className="font-bold text-red-700 mt-0.5">{zoneRequests.length} needs</div>
                    </div>
                  </div>

                  {/* Road & Logistics Info */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-start gap-1.5 text-slate-600">
                      <Compass className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span><strong>Access Status:</strong> {zone.accessibility}</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-slate-600">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span><strong>Central Staging Depot:</strong> {zone.hubCenter}</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-slate-600">
                      <PhoneCall className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span><strong>Zone Emergency Desk:</strong> <span className="font-mono">{zone.contactHotline}</span></span>
                    </div>
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Updated {zone.lastUpdated}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveView('needs-feed')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded transition-colors"
                    >
                      Pledge for this Zone →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* WHY MATERIAL DONATIONS MATTER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-10 border border-slate-800">
          <div className="max-w-2xl mb-8">
            <h2 className="text-2xl font-bold tracking-tight">How DoNation Coordinates Aid With Zero Clutter</h2>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Disaster relief traditionally suffers from two failures: camps drown in inappropriate clothes they can't use, while lacking critical chlorine tablets or infant milk. DoNation enforces transparent, need-driven allocation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-base">
                1
              </div>
              <h3 className="font-bold text-sm text-white">Relief Camps Post Exact Needs</h3>
              <p className="text-slate-400 leading-relaxed">
                Camp medical officers and village reps post specific quantities required for their evacuee count. Verified by registered NGOs to avoid duplicates.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-base">
                2
              </div>
              <h3 className="font-bold text-sm text-white">Donors Pledge Tangible Items</h3>
              <p className="text-slate-400 leading-relaxed">
                Donors choose exact shortages (e.g. 50 water cans or 20 blankets) and drop them at regional staging hubs or arrange transport dispatch.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-base">
                3
              </div>
              <h3 className="font-bold text-sm text-white">NGOs Dispatch & Track Last-Mile</h3>
              <p className="text-slate-400 leading-relaxed">
                Response units consolidate shipments into convoys, record vehicle numbers, and camps confirm arrival. Every item is accounted for on the ledger.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

