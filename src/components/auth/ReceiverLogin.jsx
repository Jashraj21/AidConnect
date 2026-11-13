import React, { useState } from 'react';
import { Package, ArrowRight, Phone, MapPin, Users, Building, Radio } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export default function ReceiverLogin() {
  const { loginAsReceiver, setActiveView } = useAuth();
  const { calamityZones } = useData();

  const [formData, setFormData] = useState({
    name: '',
    campName: '',
    designation: 'Camp Coordinator',
    zoneName: '',
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
            <span>Immediate Emergency? Submit SOS directly without logging in.</span>
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
              <h1 className="text-xl font-bold tracking-tight">Receiver & Camp Sign In</h1>
              <p className="text-xs text-slate-300">
                For camp managers, local rescue volunteers, and affected community members.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Camp / Shelter Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={formData.campName}
                  onChange={(e) => setFormData({ ...formData, campName: e.target.value })}
                  placeholder="e.g. Relief Shelter #1"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Affected Calamity Zone / Region <span className="text-red-500">*</span>
              </label>
              {calamityZones.length > 0 ? (
                <select
                  value={formData.zoneName}
                  onChange={(e) => setFormData({ ...formData, zoneName: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-amber-500 outline-none bg-white font-medium"
                >
                  <option value="">Select zone</option>
                  {calamityZones.map(z => (
                    <option key={z.id} value={z.name}>{z.name}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  required
                  value={formData.zoneName}
                  onChange={(e) => setFormData({ ...formData, zoneName: e.target.value })}
                  placeholder="Enter affected area/region"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-amber-500 outline-none"
                />
              )}
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
                placeholder="Name"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Role / Designation
              </label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="e.g. Camp Coordinator, Volunteer, Resident"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Phone"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                People / Families in Shelter
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={formData.shelterSize}
                  onChange={(e) => setFormData({ ...formData, shelterSize: e.target.value })}
                  placeholder="e.g. 150 people"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Camp Location / Address
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Address or landmark"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-amber-700 hover:bg-amber-800 text-white font-semibold text-sm rounded-md transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <span>Enter Camp Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>Other portals:</span>
          <div className="flex items-center gap-3 font-medium">
            <button
              onClick={() => setActiveView('donor-login')}
              className="text-emerald-800 hover:underline"
            >
              Donor Login →
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
