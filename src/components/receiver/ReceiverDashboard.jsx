import React, { useState } from 'react';
import {
  Package,
  Plus,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Truck,
  MapPin,
  Phone,
  Users,
  Radio,
  Copy,
  Check,
  Building,
  FileText,
  Filter,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { CATEGORIES } from '../../data/initialData';

export default function ReceiverDashboard({ onOpenOfflineGuide }) {
  const { currentUser, setActiveView } = useAuth();
  const { requests, addRequest, markRequestDelivered, calamityZones } = useData();

  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  const [copiedSmsId, setCopiedSmsId] = useState(null);
  const [deliveryConfirmId, setDeliveryConfirmId] = useState(null);
  const [deliveryNote, setDeliveryNote] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    category: 'WATER',
    itemName: '',
    quantityNeeded: 50,
    urgency: 'HIGH',
    peopleCount: currentUser?.shelterSize ? parseInt(currentUser.shelterSize, 10) || 150 : 150,
    note: '',
    dropLocation: currentUser?.location || ''
  });

  // Filter requests for this camp or zone
  const campRequests = requests.filter(r => {
    if (!currentUser) return true;
    if (currentUser.id === 'usr-recv-1') {
      return r.zoneId === 'zone-1' || r.campName.includes('Meppadi');
    }
    return r.campName === currentUser.campName || r.requesterName === currentUser.name;
  });

  const handleCreateRequest = (e) => {
    e.preventDefault();
    if (!formData.itemName.trim()) return;

    addRequest({
      zoneId: currentUser?.zoneId || 'zone-1',
      campName: currentUser?.campName || 'Disaster Relief Shelter',
      requesterName: currentUser?.name || 'Camp Representative',
      requesterRole: currentUser?.designation || 'Camp Coordinator',
      requesterPhone: currentUser?.phone || '',
      peopleCount: formData.peopleCount,
      category: formData.category,
      itemName: formData.itemName,
      quantityNeeded: formData.quantityNeeded,
      urgency: formData.urgency,
      note: formData.note,
      dropLocation: formData.dropLocation || `${currentUser?.campName} Gate Handover Desk`
    });

    setFormData({
      category: 'WATER',
      itemName: '',
      quantityNeeded: 50,
      urgency: 'HIGH',
      peopleCount: 150,
      note: '',
      dropLocation: ''
    });
    setShowNewRequestForm(false);
  };

  const handleCopySMS = (req) => {
    const text = `[DONATION RELIEF SOS]\nCAMP: ${req.campName}\nZONE: ${req.zoneId}\nITEM: ${req.quantityNeeded}x ${req.itemName}\nPEOPLE: ${req.peopleCount}\nURGENCY: ${req.urgency}\nCONTACT: ${req.requesterPhone}\nLOC: ${req.dropLocation}`;
    navigator.clipboard.writeText(text);
    setCopiedSmsId(req.id);
    setTimeout(() => setCopiedSmsId(null), 3000);
  };

  const handleConfirmReceived = (reqId) => {
    markRequestDelivered(reqId, deliveryNote || 'Verified and distributed to families at the shelter.');
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
                  {currentUser?.campName || 'Meppadi High School Relief Camp #2'}
                </h1>
                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                  Active Camp Desk
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                <span>In-charge: <strong>{currentUser?.name || 'Dr. K. Sukumaran'}</strong></span>
                <span>•</span>
                <span>Role: {currentUser?.designation || 'Camp Medical Officer'}</span>
                <span>•</span>
                <span>Capacity: {currentUser?.shelterSize || '420 evacuees (84 families)'}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowNewRequestForm(!showNewRequestForm)}
              className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-md shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Post New Relief Need</span>
            </button>

            <button
              onClick={onOpenOfflineGuide}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md border border-slate-300 transition-colors flex items-center gap-1.5"
              title="Generate offline format for poor connectivity"
            >
              <Radio className="w-3.5 h-3.5 text-amber-700" />
              <span>SMS Dispatch Format</span>
            </button>
          </div>
        </div>
      </div>

      {/* NEW REQUEST FORM (Collapsible) */}
      {showNewRequestForm && (
        <div className="bg-white rounded-xl border-2 border-amber-400 p-6 shadow-md transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Submit Urgent Needs for Camp Evacuees</h2>
              <p className="text-xs text-slate-500">
                This will be broadcasted to all verified NGOs and donors. Specify exact quantities required.
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
                  Item Description & Specification <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  placeholder="e.g. 10L Packaged Water Cans, ORS Sachets, Baby Formula"
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
                  <option value="CRITICAL">CRITICAL (Needed within 6-12 hours)</option>
                  <option value="HIGH">HIGH (Needed within 24 hours)</option>
                  <option value="MODERATE">MODERATE (Replenishment in 48 hours)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  People / Families Affected by this Shortage
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.peopleCount}
                  onChange={(e) => setFormData({ ...formData, peopleCount: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Delivery / Staging Gate Landmark
                </label>
                <input
                  type="text"
                  value={formData.dropLocation}
                  onChange={(e) => setFormData({ ...formData, dropLocation: e.target.value })}
                  placeholder="e.g. School Gate B, Handover to Volunteer Desk"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Context / Specific On-Ground Situation
              </label>
              <textarea
                rows="2"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                placeholder="Explain the urgency, who is suffering (infants, elderly, injured), or special requirements..."
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
                <span>Submit Relief Need</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* REQUESTS LIST FOR THIS CAMP */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Camp Needs & Fulfillment Status</h2>
            <p className="text-xs text-slate-500">
              Live tracking from request to NGO verification, donor pledging, convoy dispatch, and final distribution.
            </p>
          </div>
          <div className="text-xs text-slate-500">
            Total active requests: <strong>{campRequests.length}</strong>
          </div>
        </div>

        <div className="divide-y divide-slate-200">
          {campRequests.map(req => {
            const fulfilled = req.quantityFulfilled || 0;
            const percent = Math.min(100, Math.round((fulfilled / req.quantityNeeded) * 100));
            const cat = CATEGORIES.find(c => c.id === req.category);

            return (
              <div key={req.id} className="p-5 hover:bg-slate-50/60 transition-colors space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {req.id}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${cat?.color || 'bg-slate-100 text-slate-700'}`}>
                      {cat?.label || req.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        req.urgency === 'CRITICAL'
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : req.urgency === 'HIGH'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {req.urgency}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        req.status === 'DELIVERED'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : req.status === 'DISPATCHED'
                          ? 'bg-blue-100 text-blue-800 border border-blue-300 animate-pulse'
                          : req.status === 'PARTIALLY_PLEDGED'
                          ? 'bg-purple-100 text-purple-800 border border-purple-300'
                          : req.status === 'VERIFIED'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {req.status === 'DELIVERED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {req.status === 'DISPATCHED' && <Truck className="w-3.5 h-3.5" />}
                      {req.status === 'VERIFIED' && <Check className="w-3.5 h-3.5" />}
                      {req.status === 'PENDING' && <Clock className="w-3.5 h-3.5" />}
                      <span>{req.status.replace('_', ' ')}</span>
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 text-base">{req.itemName}</h3>
                    <p className="text-xs text-slate-600 italic">"{req.note}"</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                      <span>Needed: <strong>{req.quantityNeeded} units</strong></span>
                      <span>•</span>
                      <span>Targeting: <strong>{req.peopleCount}</strong> people</span>
                      <span>•</span>
                      <span>Drop Gate: {req.dropLocation}</span>
                    </div>
                  </div>

                  {/* Progress meter */}
                  <div className="w-full md:w-56 shrink-0 space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-500">Pledged: {fulfilled} / {req.quantityNeeded}</span>
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

                {/* Dispatch info if in transit */}
                {req.dispatchDetails && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-blue-700 shrink-0" />
                      <div>
                        <strong>Relief Convoy In-Transit:</strong> Vehicle: <span className="font-mono font-bold">{req.dispatchDetails.vehicleNo}</span> • Driver Hotline: {req.dispatchDetails.driverContact}
                        <div className="text-[11px] text-blue-800">{req.dispatchDetails.batchNote}</div>
                      </div>
                    </div>

                    {req.status !== 'DELIVERED' && (
                      <button
                        onClick={() => setDeliveryConfirmId(req.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-xs transition-colors shrink-0"
                      >
                        Confirm Supplies Arrived
                      </button>
                    )}
                  </div>
                )}

                {/* Delivered info if done */}
                {req.status === 'DELIVERED' && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-xs text-emerald-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>
                      <strong>Delivered & Distributed:</strong> {req.confirmationNote || 'Supplies handed over to camp families.'}
                    </span>
                  </div>
                )}

                {/* Footer action tools */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-[11px] text-slate-400">
                    Logged {new Date(req.dateCreated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleCopySMS(req)}
                      className="text-slate-600 hover:text-slate-900 flex items-center gap-1 font-medium"
                      title="Copy dispatch text for low-bandwidth SMS"
                    >
                      {copiedSmsId === req.id ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Copied SMS
                        </span>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy SMS Dispatch</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Delivery Dialog */}
                {deliveryConfirmId === req.id && (
                  <div className="bg-slate-100 border border-slate-300 rounded-lg p-3 space-y-2 mt-2">
                    <div className="font-bold text-xs text-slate-900">
                      Confirm Arrival & Distribution for #{req.id}
                    </div>
                    <input
                      type="text"
                      value={deliveryNote}
                      onChange={(e) => setDeliveryNote(e.target.value)}
                      placeholder="Add confirmation note (e.g. Distributed to 84 families in Wing B)"
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
                        Confirm Receipt
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

