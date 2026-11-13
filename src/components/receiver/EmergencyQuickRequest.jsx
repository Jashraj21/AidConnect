import React, { useState } from 'react';
import { Radio, AlertTriangle, CheckCircle2, Send } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIES } from '../../data/initialData';

export default function EmergencyQuickRequest() {
  const { addRequest, calamityZones } = useData();
  const { setActiveView } = useAuth();

  const [formData, setFormData] = useState({
    zoneName: '',
    campName: '',
    requesterName: '',
    requesterPhone: '',
    category: 'WATER',
    itemName: '',
    quantityNeeded: 10,
    peopleCount: '',
    urgency: 'CRITICAL',
    dropLocation: '',
    note: ''
  });

  const [submittedId, setSubmittedId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const req = addRequest({
      ...formData,
      peopleCount: parseInt(formData.peopleCount, 10) || 0,
      quantityNeeded: parseInt(formData.quantityNeeded, 10) || 1,
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
              Submit an urgent distress requirement directly.
            </p>
          </div>
        </div>

        {submittedId ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 text-red-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Request Broadcasted</h2>
            <p className="text-sm text-slate-600">
              Your request ID is <strong className="font-mono bg-slate-100 px-2 py-1 rounded">{submittedId}</strong>.
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
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Calamity Affected Zone / District <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.zoneName}
                  onChange={(e) => setFormData({ ...formData, zoneName: e.target.value })}
                  placeholder="e.g. Flooded Area / District"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Camp / Settlement Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.campName}
                  onChange={(e) => setFormData({ ...formData, campName: e.target.value })}
                  placeholder="e.g. Relief Camp A"
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
                  placeholder="Name"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.requesterPhone}
                  onChange={(e) => setFormData({ ...formData, requesterPhone: e.target.value })}
                  placeholder="Phone"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-red-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Category <span className="text-red-500">*</span>
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
                  placeholder="e.g. Drinking Water, Food Packets"
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
                  People Affected
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
                <label className="block font-bold text-slate-800 mb-1">
                  Delivery Access Landmark
                </label>
                <input
                  type="text"
                  value={formData.dropLocation}
                  onChange={(e) => setFormData({ ...formData, dropLocation: e.target.value })}
                  placeholder="Location landmark"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-red-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Urgent Notes
              </label>
              <textarea
                rows="2"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                placeholder="Details of the situation..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-red-500 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-md transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Request</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
