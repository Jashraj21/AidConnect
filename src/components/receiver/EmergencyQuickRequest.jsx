import React, { useState } from 'react';
import { Radio, AlertTriangle, CheckCircle2, Send, Compass, Phone, User, Building, MapPin } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIES } from '../../data/initialData';
import NearbyCampsFinder from '../common/NearbyCampsFinder';
import { lookupPincode } from '../../utils/pincodeService';

export default function EmergencyQuickRequest() {
  const { addRequest, requests, calamityZones } = useData();
  const { setActiveView } = useAuth();

  const [formData, setFormData] = useState({
    pincode: '',
    requesterPhone: '',
    requesterName: '',
    zoneName: '',
    campName: '',
    shelterName: '',
    category: 'WATER',
    itemName: 'Drinking Water & Basic Necessities',
    quantityNeeded: 25,
    peopleCount: '',
    urgency: 'CRITICAL',
    dropLocation: '',
    note: ''
  });

  const [submittedId, setSubmittedId] = useState(null);

  const handleCampSelect = (camp) => {
    setFormData(prev => ({
      ...prev,
      campName: camp.name,
      shelterName: camp.name,
      dropLocation: prev.dropLocation || camp.address || camp.type || ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Auto-resolve shelter and zone from PIN code if left empty
    let resolvedCamp = formData.campName.trim();
    let resolvedZone = formData.zoneName.trim();

    if (!resolvedCamp && formData.pincode) {
      const match = lookupPincode(formData.pincode, requests);
      resolvedCamp = match?.primaryCamp?.name || `Relief Shelter (PIN ${formData.pincode})`;
    }

    if (!resolvedZone && formData.pincode) {
      const match = lookupPincode(formData.pincode, requests);
      resolvedZone = match?.locationLabel || 'Emergency Distress Zone';
    }

    const req = addRequest({
      ...formData,
      campName: resolvedCamp || 'Disaster Relief Shelter',
      shelterName: resolvedCamp || 'Disaster Relief Shelter',
      zoneName: resolvedZone || 'Disaster Relief Zone',
      itemName: formData.itemName.trim() || 'Emergency Basic Necessities & Aid Kit',
      peopleCount: parseInt(formData.peopleCount, 10) || 0,
      quantityNeeded: parseInt(formData.quantityNeeded, 10) || 10,
      requesterRole: 'Emergency SOS Requester'
    });
    setSubmittedId(req.id);
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
        <span className="bg-red-50 text-red-800 font-bold px-2 py-0.5 rounded border border-red-200">
          Emergency Fast SOS Broadcast
        </span>
      </div>

      <div className="bg-white border-2 border-red-500 rounded-xl shadow-lg overflow-hidden">
        <div className="p-5 bg-red-600 text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-800 flex items-center justify-center shrink-0">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Emergency Relief Need (No Login Required)</h1>
            <p className="text-xs text-red-100">
              Only PIN code, Phone, and Name are required. The system links your nearest relief camp automatically.
            </p>
          </div>
        </div>

        {submittedId ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 text-red-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Emergency Request Broadcasted</h2>
            <p className="text-sm text-slate-600">
              Your distress request ID is <strong className="font-mono bg-slate-100 px-2 py-1 rounded">{submittedId}</strong>.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => { setSubmittedId(null); setFormData({ ...formData, itemName: '' }); }}
                className="px-4 py-2 border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Submit Another Request
              </button>
              <button
                onClick={() => setActiveView('needs-feed')}
                className="px-4 py-2 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800"
              >
                View in Needs Feed
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
            {/* Essential Requirements Notice */}
            <div className="bg-red-50/70 border border-red-200 rounded-lg p-3 text-red-950 flex items-center justify-between">
              <span className="font-bold">
                Required Info: <span className="font-mono underline">PIN Code</span>, <span>Phone Number</span> & <span>Contact Name</span>.
              </span>
              <span className="text-[11px] text-red-700">All other details optional</span>
            </div>

            {/* Core Required Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-900 mb-1">
                  Postal PIN Code <span className="text-red-600">* Required</span>
                </label>
                <div className="relative">
                  <Compass className="w-4 h-4 text-red-600 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    maxLength="6"
                    pattern="[0-9]{6}"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
                    placeholder="e.g. 682001"
                    className="w-full pl-9 pr-3 py-2 text-xs font-mono font-bold border-2 border-red-400 rounded-md focus:ring-2 focus:ring-red-500 outline-none bg-red-50/20"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-900 mb-1">
                  Phone Number <span className="text-red-600">* Required</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={formData.requesterPhone}
                    onChange={(e) => setFormData({ ...formData, requesterPhone: e.target.value })}
                    placeholder="Mobile number"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-red-500 outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-900 mb-1">
                  Contact Person Name <span className="text-red-600">* Required</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={formData.requesterName}
                    onChange={(e) => setFormData({ ...formData, requesterName: e.target.value })}
                    placeholder="Name"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-red-500 outline-none font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Auto-detected Nearby Shelters */}
            <NearbyCampsFinder
              pincode={formData.pincode}
              selectedCampName={formData.campName}
              onSelectCamp={handleCampSelect}
              existingRequests={requests}
            />

            {/* Optional Relief Details */}
            <div className="pt-3 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-slate-600 font-semibold">
                <span>Relief Requirements (Optional / Pre-filled):</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Relief Camp / Shelter <span className="text-slate-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.campName}
                    onChange={(e) => setFormData({ ...formData, campName: e.target.value, shelterName: e.target.value })}
                    placeholder="Auto-detected from PIN"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-red-500 outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Affected Zone / District <span className="text-slate-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.zoneName}
                    onChange={(e) => setFormData({ ...formData, zoneName: e.target.value })}
                    placeholder="Auto-detected from PIN"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-red-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Urgency Level
                  </label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white font-bold text-red-700 outline-none"
                  >
                    <option value="CRITICAL">CRITICAL (Immediate Aid)</option>
                    <option value="HIGH">HIGH (Within 12 Hours)</option>
                    <option value="MEDIUM">MEDIUM (Within 24 Hours)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Need Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white font-medium focus:ring-1 focus:ring-red-500 outline-none"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Items Needed <span className="text-slate-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.itemName}
                    onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                    placeholder="e.g. Drinking Water, Food Packets"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-red-500 outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Quantity Needed
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.quantityNeeded}
                    onChange={(e) => setFormData({ ...formData, quantityNeeded: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-red-500 outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    People Sheltered / Affected <span className="text-slate-400">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.peopleCount}
                    onChange={(e) => setFormData({ ...formData, peopleCount: e.target.value })}
                    placeholder="e.g. 50"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-red-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Drop Landmark <span className="text-slate-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.dropLocation}
                    onChange={(e) => setFormData({ ...formData, dropLocation: e.target.value })}
                    placeholder="e.g. Near East Gate"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-red-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Urgent Distress Note <span className="text-slate-400">(Optional)</span>
                </label>
                <textarea
                  rows="2"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="Additional situational notes..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-red-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-md transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Emergency Request</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
