import React, { useState } from 'react';
import { Radio, AlertTriangle, ArrowRight, CheckCircle2, Phone, MapPin, Send } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIES } from '../../data/initialData';

export default function EmergencyQuickRequest() {
  const { addRequest, calamityZones } = useData();
  const { setActiveView } = useAuth();

  const [formData, setFormData] = useState({
    zoneId: calamityZones[0]?.id || 'zone-1',
    campName: '',
    requesterName: '',
    requesterPhone: '',
    category: 'WATER',
    itemName: '',
    quantityNeeded: 50,
    peopleCount: 100,
    urgency: 'CRITICAL',
    dropLocation: '',
    note: ''
  });

  const [submittedId, setSubmittedId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const req = addRequest({
      ...formData,
      requesterRole: 'Direct Calamity SOS Requester'
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
            <h1 className="text-lg font-bold">Emergency Quick Relief Request</h1>
            <p className="text-xs text-red-100">
              No registration required. Designed for immediate distress signals from disaster-hit zones.
            </p>
          </div>
        </div>

        {submittedId ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 text-red-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">SOS Request Broadcasted</h2>
            <p className="text-sm text-slate-600">
              Your request has been filed under ID <strong className="font-mono bg-slate-100 px-2 py-1 rounded">{submittedId}</strong>.
            </p>
            <p className="text-xs text-slate-500">
              On-ground response coordinators from SEEDS India, Red Cross, and local civil defense teams have been notified for immediate supply dispatch.
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
                View in Live Needs Ledger
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div className="bg-red-50 p-3 rounded-lg border border-red-200 text-red-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              <span>
                Please ensure contact number and location landmark are as accurate as possible for the supply convoy.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Calamity Affected Zone <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.zoneId}
                  onChange={(e) => setFormData({ ...formData, zoneId: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white font-medium focus:ring-1 focus:ring-red-500 outline-none"
                >
                  {calamityZones.map(z => (
                    <option key={z.id} value={z.id}>{z.name} ({z.state})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Camp / School / Settlement Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.campName}
                  onChange={(e) => setFormData({ ...formData, campName: e.target.value })}
                  placeholder="e.g. Village Temple Shelter or St. Mary Hall"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-red-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Contact Person Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.requesterName}
                  onChange={(e) => setFormData({ ...formData, requesterName: e.target.value })}
                  placeholder="e.g. Vijay Kumar"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Phone / Satellite Contact <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.requesterPhone}
                  onChange={(e) => setFormData({ ...formData, requesterPhone: e.target.value })}
                  placeholder="+91 94000 00000"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-red-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Supply Category <span className="text-red-500">*</span>
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
                <label className="block font-bold text-slate-800 mb-1">
                  Item Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  placeholder="e.g. Drinking Water Cans, Dry Meals, ORS"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Quantity Needed <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.quantityNeeded}
                  onChange={(e) => setFormData({ ...formData, quantityNeeded: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-red-500 outline-none font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Number of People Affected
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.peopleCount}
                  onChange={(e) => setFormData({ ...formData, peopleCount: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Delivery Access / Landmark
                </label>
                <input
                  type="text"
                  value={formData.dropLocation}
                  onChange={(e) => setFormData({ ...formData, dropLocation: e.target.value })}
                  placeholder="e.g. Near Panchayat Well, accessible by 4WD"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-red-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Urgent Notes / Special Medical Needs
              </label>
              <textarea
                rows="2"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                placeholder="Mention if there are injured people, pregnant women, or sick children..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-red-500 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-md transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Emergency SOS Request Now</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

