import React, { useState } from 'react';
import { Package, ShieldAlert, ArrowRight, Phone, MapPin, Users, Building, Sparkles, Radio } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export default function ReceiverLogin({ onOpenQuickSos }) {
  const { loginAsReceiver, quickDemoLogin, setActiveView } = useAuth();
  const { calamityZones } = useData();

  const [formData, setFormData] = useState({
    name: '',
    campName: '',
    designation: 'Camp Coordinator',
    zoneId: calamityZones[0]?.id || 'zone-1',
    phone: '',
    location: '',
    shelterSize: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginAsReceiver(formData);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6">
      {/* Back button */}
      <div className="mb-6 flex items-center justify-between text-xs text-slate-500">
        <button
          onClick={() => setActiveView('home')}
          className="hover:underline text-slate-600 font-medium"
        >
          ← Back to Disaster Overview
        </button>
        <span className="bg-amber-50 text-amber-900 font-semibold px-2 py-0.5 rounded border border-amber-200">
          Receiver & Camp Portal Access
        </span>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* Urgent distress callout banner */}
        <div className="bg-red-600 text-white p-3.5 px-6 flex items-center justify-between text-xs font-medium">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 animate-pulse shrink-0" />
            <span>
              <strong>Immediate Survival Distress?</strong> No login required to dispatch emergency SOS alerts.
            </span>
          </div>
          <button
            onClick={() => setActiveView('emergency-quick')}
            className="px-3 py-1 bg-white text-red-700 font-bold rounded text-xs hover:bg-red-50 transition-colors uppercase tracking-wider shrink-0"
          >
            Direct SOS Request →
          </button>
        </div>

        {/* Header */}
        <div className="p-6 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-amber-600 text-white flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Relief Camp & Receiver Portal</h1>
              <p className="text-xs text-slate-300">
                For camp managers, local rescue volunteers, and affected community leaders requesting basic survival necessities.
              </p>
            </div>
          </div>
        </div>

        {/* Demo Fast-Track Bar */}
        <div className="bg-amber-50 border-b border-amber-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-950">
            <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Testing as a Camp Coordinator?</strong> Jump straight into Meppadi Camp Lead view (420 evacuees).
            </span>
          </div>
          <button
            type="button"
            onClick={() => quickDemoLogin('RECEIVER')}
            className="px-3 py-1.5 bg-amber-800 hover:bg-amber-900 text-white font-semibold rounded text-xs transition-colors shrink-0 flex items-center gap-1.5 shadow-sm"
          >
            <span>One-Click Camp Login</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Relief Camp / Settlement Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={formData.campName}
                  onChange={(e) => setFormData({ ...formData, campName: e.target.value })}
                  placeholder="e.g. St. Jude Higher School Shelter"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Affected Calamity Zone <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.zoneId}
                onChange={(e) => setFormData({ ...formData, zoneId: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white font-medium"
              >
                {calamityZones.map(zone => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name} ({zone.state})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Person Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Ramesh Kumar (Volunteer Lead)"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Role / Designation
              </label>
              <select
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white"
              >
                <option value="Camp Coordinator">Camp Coordinator</option>
                <option value="Camp Medical Officer / Doctor">Camp Medical Officer / Doctor</option>
                <option value="Local Panchayat / Ward Member">Local Panchayat / Ward Member</option>
                <option value="ASHA / Community Health Worker">ASHA / Community Health Worker</option>
                <option value="First Response Volunteer">First Response Volunteer</option>
                <option value="Affected Resident Representative">Affected Resident Representative</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Active Mobile / Satellite Phone <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 94000 00000"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Approx. People Count in Shelter
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={formData.shelterSize}
                  onChange={(e) => setFormData({ ...formData, shelterSize: e.target.value })}
                  placeholder="e.g. 280 evacuees (65 families)"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Exact Camp Address / Landmark / GPS
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Near Kalpetta Old Bus Stand, behind Taluk Office"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none"
              />
            </div>
          </div>

          <div className="bg-amber-50/50 border border-amber-200 rounded-lg p-3 text-xs text-amber-950 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Verification Protocol:</strong> Requests submitted here are flagged for immediate verification by on-ground NGO partners (SEEDS, Goonj, Red Cross) to prevent duplicate aid and organize dispatch routes.
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-amber-700 hover:bg-amber-800 text-white font-semibold text-sm rounded-md transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <span>Enter Camp Portal & Manage Needs</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Role Switcher */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>Looking for another portal?</span>
          <div className="flex items-center gap-3 font-medium">
            <button
              onClick={() => setActiveView('donor-login')}
              className="text-emerald-800 hover:underline"
            >
              Donor & Supporter Login →
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveView('org-login')}
              className="text-slate-800 hover:underline"
            >
              Helping Organization Login →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

