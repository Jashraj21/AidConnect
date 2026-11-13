import React, { useState } from 'react';
import {
  Package,
  Plus,
  CheckCircle2,
  Truck,
  Clock,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { CATEGORIES } from '../../data/initialData';

export default function ReceiverDashboard() {
  const { currentUser } = useAuth();
  const { requests, addRequest, markRequestDelivered } = useData();

  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  const [deliveryConfirmId, setDeliveryConfirmId] = useState(null);
  const [deliveryNote, setDeliveryNote] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    category: 'WATER',
    itemName: '',
    quantityNeeded: 10,
    urgency: 'HIGH',
    peopleCount: '',
    note: '',
    dropLocation: ''
  });

  // Filter requests for this camp
  const campRequests = requests.filter(r => {
    if (!currentUser) return true;
    return r.campName === currentUser.campName || r.requesterName === currentUser.name;
  });

  const handleCreateRequest = (e) => {
    e.preventDefault();
    if (!formData.itemName.trim()) return;

    addRequest({
      zoneName: currentUser?.zoneName || '',
      campName: currentUser?.campName || 'Relief Shelter',
      requesterName: currentUser?.name || 'Camp Representative',
      requesterRole: currentUser?.designation || 'Camp Coordinator',
      requesterPhone: currentUser?.phone || '',
      peopleCount: parseInt(formData.peopleCount, 10) || 0,
      category: formData.category,
      itemName: formData.itemName,
      quantityNeeded: parseInt(formData.quantityNeeded, 10) || 1,
      urgency: formData.urgency,
      note: formData.note,
      dropLocation: formData.dropLocation || currentUser?.location || ''
    });

    setFormData({
      category: 'WATER',
      itemName: '',
      quantityNeeded: 10,
      urgency: 'HIGH',
      peopleCount: '',
      note: '',
      dropLocation: ''
    });
    setShowNewRequestForm(false);
  };

  const handleConfirmReceived = (reqId) => {
    markRequestDelivered(reqId, deliveryNote || 'Received and distributed to camp families.');
    setDeliveryConfirmId(null);
    setDeliveryNote('');
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Camp Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">
                  {currentUser?.campName || 'Relief Camp'}
                </h1>
                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                  Camp Desk
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                <span>Contact: <strong>{currentUser?.name || ''}</strong></span>
                {currentUser?.designation && <span>• Role: {currentUser.designation}</span>}
                {currentUser?.shelterSize && <span>• Size: {currentUser.shelterSize}</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowNewRequestForm(!showNewRequestForm)}
              className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-md shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Post New Relief Need</span>
            </button>
          </div>
        </div>
      </div>

      {/* NEW REQUEST FORM */}
      {showNewRequestForm && (
        <div className="bg-white rounded-xl border-2 border-amber-400 p-6 shadow-md transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Submit Urgent Needs for Camp</h2>
              <p className="text-xs text-slate-500">
                Specify exact quantities required.
              </p>
            </div>
            <button
              onClick={() => setShowNewRequestForm(false)}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold px-2 py-1 rounded bg-slate-100"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleCreateRequest} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Need Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-amber-500 outline-none bg-white font-medium"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Item Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  placeholder="e.g. Drinking Water Cans, Blankets"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-amber-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Quantity Required <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.quantityNeeded}
                  onChange={(e) => setFormData({ ...formData, quantityNeeded: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-amber-500 outline-none font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Urgency Level <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-amber-500 outline-none bg-white font-bold"
                >
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="MODERATE">MODERATE</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  People Affected
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.peopleCount}
                  onChange={(e) => setFormData({ ...formData, peopleCount: e.target.value })}
                  placeholder="e.g. 50"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Delivery Landmark / Gate
                </label>
                <input
                  type="text"
                  value={formData.dropLocation}
                  onChange={(e) => setFormData({ ...formData, dropLocation: e.target.value })}
                  placeholder="Drop location"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Additional Notes
              </label>
              <textarea
                rows="2"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                placeholder="Explain the urgency or any specifics..."
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-amber-500 outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowNewRequestForm(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Package className="w-4 h-4" />
                <span>Submit Need</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* REQUESTS LIST */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Camp Needs & Fulfillment Status</h2>
          </div>
          <div className="text-xs text-slate-500">
            Total active requests: <strong>{campRequests.length}</strong>
          </div>
        </div>

        {campRequests.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No needs posted for this camp yet. Click "Post New Relief Need" above to submit one.
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {campRequests.map(req => {
              const fulfilled = req.quantityFulfilled || 0;
              const percent = Math.min(100, Math.round((fulfilled / req.quantityNeeded) * 100));

              return (
                <div key={req.id} className="p-5 hover:bg-slate-50/60 transition-colors space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {req.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          req.urgency === 'CRITICAL'
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {req.urgency}
                      </span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        req.status === 'DELIVERED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : req.status === 'DISPATCHED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span>{req.status}</span>
                    </span>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="font-bold text-slate-900 text-base">{req.itemName}</h3>
                      {req.note && <p className="text-xs text-slate-600 italic">"{req.note}"</p>}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                        <span>Needed: <strong>{req.quantityNeeded} units</strong></span>
                        {req.dropLocation && <span>• Location: {req.dropLocation}</span>}
                      </div>
                    </div>

                    <div className="w-full md:w-56 shrink-0 space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-500">Fulfilled: {fulfilled} / {req.quantityNeeded}</span>
                        <span className="font-bold text-slate-800">{percent}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            percent >= 100 ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {req.dispatchDetails && req.status !== 'DELIVERED' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <strong>In-Transit:</strong> Vehicle: {req.dispatchDetails.vehicleNo}
                      </div>
                      <button
                        onClick={() => setDeliveryConfirmId(req.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-xs transition-colors shrink-0"
                      >
                        Confirm Arrival
                      </button>
                    </div>
                  )}

                  {req.status === 'DELIVERED' && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-xs text-emerald-900 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>{req.confirmationNote || 'Delivered to camp.'}</span>
                    </div>
                  )}

                  {deliveryConfirmId === req.id && (
                    <div className="bg-slate-100 border border-slate-300 rounded-lg p-3 space-y-2 mt-2">
                      <div className="font-bold text-xs text-slate-900">
                        Confirm Arrival for #{req.id}
                      </div>
                      <input
                        type="text"
                        value={deliveryNote}
                        onChange={(e) => setDeliveryNote(e.target.value)}
                        placeholder="Confirmation note (optional)"
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setDeliveryConfirmId(null)}
                          className="px-3 py-1 bg-white border border-slate-300 text-slate-600 rounded text-xs"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleConfirmReceived(req.id)}
                          className="px-3 py-1 bg-emerald-600 text-white font-bold rounded text-xs"
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
