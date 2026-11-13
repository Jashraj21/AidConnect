import React, { useState } from 'react';
import { Package, ArrowRight, Phone, MapPin, Users, Building, Radio, Compass, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import NearbyCampsFinder from '../common/NearbyCampsFinder';
import NearestDonorsSection from '../receiver/NearestDonorsSection';
import { lookupPincode } from '../../utils/pincodeService';

export default function ReceiverLogin() {
  const { loginAsReceiver, setActiveView } = useAuth();
  const { calamityZones, requests } = useData();

  const [formData, setFormData] = useState({
    pincode: '',
    phone: '',
    name: '',
    campName: '',
    shelterName: '',
    designation: 'Camp Coordinator',
    zoneName: '',
    location: '',
    shelterSize: ''
  });

  const handleCampSelect = (camp) => {
    setFormData(prev => ({
      ...prev,
      campName: camp.name,
      shelterName: camp.name,
      location: prev.location || camp.address || camp.type || ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Auto-resolve shelter and zone if left blank by user
    let resolvedCampName = formData.campName.trim();
    let resolvedZone = formData.zoneName.trim();

    if (!resolvedCampName && formData.pincode) {
      const match = lookupPincode(formData.pincode, requests);
      if (match?.primaryCamp?.name) {
        resolvedCampName = match.primaryCamp.name;
      } else {
        resolvedCampName = `Shelter Camp (PIN ${formData.pincode})`;
      }
    }

    if (!resolvedZone && formData.pincode) {
      const match = lookupPincode(formData.pincode, requests);
      if (match?.locationLabel) {
        resolvedZone = match.locationLabel;
      }
    }

    loginAsReceiver({
      ...formData,
      campName: resolvedCampName || 'Relief Camp Shelter',
      shelterName: resolvedCampName || 'Relief Camp Shelter',
      zoneName: resolvedZone || 'Disaster Relief Zone'
    });
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
                Only PIN code, Phone number, and Name are required. The system auto-detects nearby shelters.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Section 1: Necessary Fields Notice */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-700 flex items-center justify-between">
            <span className="font-semibold text-slate-800">
              Required: <strong className="text-amber-800 font-mono">PIN Code</strong>, <strong className="text-amber-800">Phone</strong> & <strong className="text-amber-800">Name</strong>.
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              All other fields are optional
            </span>
          </div>

          {/* Primary Required Group */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Postal PIN Code */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Postal PIN Code <span className="text-red-600">* Required</span>
              </label>
              <div className="relative">
                <Compass className="w-4 h-4 text-amber-600 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  maxLength="6"
                  pattern="[0-9]{6}"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
                  placeholder="e.g. 682001"
                  className="w-full pl-9 pr-3 py-2 text-sm font-mono font-bold border-2 border-amber-400 rounded-md focus:ring-2 focus:ring-amber-500 outline-none bg-amber-50/20"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Phone Number <span className="text-red-600">* Required</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 9876543210"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-amber-500 outline-none font-medium"
                />
              </div>
            </div>

            {/* Contact Person Name */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Contact Person Name <span className="text-red-600">* Required</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full Name"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-amber-500 outline-none font-medium"
              />
            </div>
          </div>

          {/* Auto-detected Nearby Shelters Component */}
          <NearbyCampsFinder
            pincode={formData.pincode}
            selectedCampName={formData.campName}
            onSelectCamp={handleCampSelect}
            existingRequests={requests}
          />

          {/* Nearest Direct Donors matched by proximity algorithm */}
          {formData.pincode && formData.pincode.replace(/\D/g, '').length === 6 && (
            <NearestDonorsSection
              pincode={formData.pincode}
              campNeeds={requests.filter(r => r.pincode === formData.pincode)}
              currentUser={{ name: formData.name, phone: formData.phone, campName: formData.campName }}
            />
          )}

          {/* Optional Details Accordion / Fields */}
          <div className="pt-2 border-t border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Optional Shelter Information:</span>
              <span className="text-[11px] text-slate-400 italic">Leave blank to use auto-detected info</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Relief Camp / Shelter Name <span className="text-slate-400">(Optional)</span>
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={formData.campName}
                    onChange={(e) => setFormData({ ...formData, campName: e.target.value, shelterName: e.target.value })}
                    placeholder="Auto-detected from PIN or enter custom"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Calamity Zone / Region <span className="text-slate-400">(Optional)</span>
                </label>
                {calamityZones.length > 0 ? (
                  <select
                    value={formData.zoneName}
                    onChange={(e) => setFormData({ ...formData, zoneName: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-amber-500 outline-none bg-white font-medium"
                  >
                    <option value="">Auto-detect from PIN code</option>
                    {calamityZones.map(z => (
                      <option key={z.id} value={z.name}>{z.name}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={formData.zoneName}
                    onChange={(e) => setFormData({ ...formData, zoneName: e.target.value })}
                    placeholder="Auto-detected from PIN or enter custom"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-amber-500 outline-none"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Specific Address / Landmark <span className="text-slate-400">(Optional)</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Street or gate landmark"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  People in Shelter <span className="text-slate-400">(Optional)</span>
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

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Role / Title <span className="text-slate-400">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  placeholder="e.g. Resident / Volunteer"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>
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
