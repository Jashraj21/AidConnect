import React, { useState } from 'react';
import {
  Package,
  Plus,
  CheckCircle2,
  Truck,
  Clock,
  Check,
  Search,
  Edit2,
  Trash2,
  X,
  AlertTriangle,
  MapPin,
  Phone,
  FileCheck2,
  Compass
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { CATEGORIES } from '../../data/initialData';
import NearbyCampsFinder from '../common/NearbyCampsFinder';
import { lookupPincode } from '../../utils/pincodeService';

export default function ReceiverDashboard() {
  const { currentUser } = useAuth();
  const { requests, addRequest, updateRequest, deleteRequest, acceptRequestDelivery } = useData();

  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [deliveryConfirmId, setDeliveryConfirmId] = useState(null);
  const [deliveryNote, setDeliveryNote] = useState('');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [urgencyFilter, setUrgencyFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Form State for New Request
  const [formData, setFormData] = useState({
    campName: currentUser?.campName || currentUser?.shelterName || '',
    shelterName: currentUser?.shelterName || currentUser?.campName || '',
    pincode: currentUser?.pincode || '',
    category: 'WATER',
    itemName: '',
    quantityNeeded: 10,
    urgency: 'HIGH',
    peopleCount: '',
    note: '',
    dropLocation: currentUser?.location || ''
  });

  // Filter requests for this camp
  const myCampRequests = requests.filter(r => {
    if (!currentUser) return true;
    return r.campName === currentUser.campName || r.requesterName === currentUser.name;
  });

  // Live stat metrics
  const totalNeeds = myCampRequests.length;
  const pendingCount = myCampRequests.filter(r => r.status === 'PENDING').length;
  const inTransitCount = myCampRequests.filter(r => r.status === 'DISPATCHED').length;
  const acceptedCount = myCampRequests.filter(r => r.status === 'ACCEPTED' || r.status === 'DELIVERED').length;

  // Filtered requests according to search and filters
  const displayedRequests = myCampRequests.filter(req => {
    if (statusFilter !== 'ALL') {
      if (statusFilter === 'ACCEPTED' && req.status !== 'ACCEPTED' && req.status !== 'DELIVERED') return false;
      if (statusFilter !== 'ACCEPTED' && req.status !== statusFilter) return false;
    }
    if (urgencyFilter !== 'ALL' && req.urgency !== urgencyFilter) return false;
    if (categoryFilter !== 'ALL' && req.category !== categoryFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = req.id.toLowerCase().includes(q);
      const matchItem = req.itemName.toLowerCase().includes(q);
      const matchNote = (req.note || '').toLowerCase().includes(q);
      const matchLoc = (req.dropLocation || '').toLowerCase().includes(q);
      const matchCamp = (req.campName || '').toLowerCase().includes(q);
      const matchPin = (req.pincode || '').includes(q);
      if (!matchId && !matchItem && !matchNote && !matchLoc && !matchCamp && !matchPin) return false;
    }
    return true;
  });

  // CREATE Request Handler
  const handleCreateRequest = (e) => {
    e.preventDefault();
    if (!formData.itemName.trim()) return;

    let resolvedCamp = (formData.campName || '').trim();
    if (!resolvedCamp && formData.pincode) {
      const match = lookupPincode(formData.pincode, requests);
      resolvedCamp = match?.primaryCamp?.name || currentUser?.campName || `Shelter (PIN ${formData.pincode})`;
    }

    addRequest({
      zoneName: currentUser?.zoneName || 'Affected Zone',
      campName: resolvedCamp || currentUser?.campName || currentUser?.shelterName || 'Relief Camp / Shelter',
      shelterName: resolvedCamp || currentUser?.shelterName || currentUser?.campName || 'Relief Camp / Shelter',
      pincode: formData.pincode || currentUser?.pincode || '',
      requesterName: currentUser?.name || 'Camp Representative',
      requesterRole: currentUser?.designation || 'Camp Coordinator',
      requesterPhone: currentUser?.phone || '',
      peopleCount: parseInt(formData.peopleCount, 10) || 0,
      category: formData.category,
      itemName: formData.itemName,
      quantityNeeded: parseInt(formData.quantityNeeded, 10) || 1,
      urgency: formData.urgency,
      note: formData.note,
      dropLocation: formData.dropLocation || currentUser?.location || 'Camp Main Gate'
    });

    setFormData({
      campName: currentUser?.campName || currentUser?.shelterName || '',
      shelterName: currentUser?.shelterName || currentUser?.campName || '',
      pincode: currentUser?.pincode || '',
      category: 'WATER',
      itemName: '',
      quantityNeeded: 10,
      urgency: 'HIGH',
      peopleCount: '',
      note: '',
      dropLocation: currentUser?.location || ''
    });
    setShowNewRequestForm(false);
  };

  // UPDATE Request Handler
  const handleUpdateRequest = (e) => {
    e.preventDefault();
    if (!editingRequest || !editingRequest.itemName.trim()) return;

    updateRequest(editingRequest.id, {
      campName: editingRequest.campName,
      shelterName: editingRequest.shelterName || editingRequest.campName,
      pincode: editingRequest.pincode,
      itemName: editingRequest.itemName,
      category: editingRequest.category,
      quantityNeeded: parseInt(editingRequest.quantityNeeded, 10) || 1,
      urgency: editingRequest.urgency,
      peopleCount: parseInt(editingRequest.peopleCount, 10) || 0,
      dropLocation: editingRequest.dropLocation,
      note: editingRequest.note
    });

    setEditingRequest(null);
  };

  // DELETE Request Handler
  const handleDeleteRequest = (reqId) => {
    if (window.confirm(`Are you sure you want to cancel and delete relief request #${reqId}?`)) {
      deleteRequest(reqId);
    }
  };

  // ACCEPT / CONFIRM RECEIPT Handler (Step 5 of workflow)
  const handleConfirmReceived = (reqId) => {
    acceptRequestDelivery(reqId, deliveryNote || 'Supplies received and accepted by camp leadership.');
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
                  {currentUser?.campName || currentUser?.shelterName || 'Relief Camp'}
                </h1>
                {currentUser?.pincode && (
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>PIN: {currentUser.pincode}</span>
                  </span>
                )}
                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                  Receiver Portal
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                <span>Coordinator: <strong>{currentUser?.name || 'Representative'}</strong></span>
                {currentUser?.phone && <span>• Tel: {currentUser.phone}</span>}
                {currentUser?.designation && <span>• Role: {currentUser.designation}</span>}
                {currentUser?.location && <span>• Location: {currentUser.location}</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setShowNewRequestForm(!showNewRequestForm);
                setEditingRequest(null);
              }}
              className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-md shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Post New Relief Need</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-200">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <div className="text-xs font-semibold text-slate-600">Total Needs Posted</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{totalNeeds}</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <div className="text-xs font-semibold text-slate-600">Pending Verification</div>
            <div className="text-2xl font-bold text-amber-700 mt-1">{pendingCount}</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <div className="text-xs font-semibold text-slate-600">Convoys In-Transit</div>
            <div className="text-2xl font-bold text-blue-700 mt-1">{inTransitCount}</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <div className="text-xs font-semibold text-slate-600">Accepted & Delivered</div>
            <div className="text-2xl font-bold text-emerald-700 mt-1">{acceptedCount}</div>
          </div>
        </div>
      </div>

      {/* CREATE NEW REQUEST FORM */}
      {showNewRequestForm && (
        <div className="bg-white rounded-xl border-2 border-amber-400 p-6 shadow-md transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Post New Relief Need for Camp</h2>
              <p className="text-xs text-slate-500">
                Specify survival items and exact quantities required for camp families.
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2 border-b border-slate-100">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Postal PIN Code <span className="text-red-500">* Required</span>
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
                    placeholder="e.g. 682001 (6 digits)"
                    className="w-full pl-9 pr-3 py-2 border-2 border-amber-400 rounded-md outline-none font-mono font-bold bg-amber-50/20"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Relief Camp / Shelter Name <span className="text-slate-400">(Optional — auto-detected)</span>
                </label>
                <input
                  type="text"
                  value={formData.campName}
                  onChange={(e) => setFormData({ ...formData, campName: e.target.value, shelterName: e.target.value })}
                  placeholder="Auto-detected or enter custom name"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none font-semibold"
                />
              </div>
            </div>

            {/* Nearby Shelter Finder */}
            <NearbyCampsFinder
              pincode={formData.pincode}
              selectedCampName={formData.campName}
              onSelectCamp={(camp) => setFormData(prev => ({ ...prev, campName: camp.name, shelterName: camp.name, dropLocation: prev.dropLocation || camp.address || camp.type }))}
              existingRequests={requests}
            />

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
                  placeholder="e.g. Water Bottles, Blankets, Food Packets"
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
                  <option value="CRITICAL">CRITICAL (Immediate 24h)</option>
                  <option value="HIGH">HIGH (Next 48h)</option>
                  <option value="MODERATE">MODERATE (Ongoing)</option>
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
                  Delivery Gate / Handover Point
                </label>
                <input
                  type="text"
                  value={formData.dropLocation}
                  onChange={(e) => setFormData({ ...formData, dropLocation: e.target.value })}
                  placeholder="e.g. Camp Gate 2 / Warehouse Tent"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Additional Operational Notes
              </label>
              <textarea
                rows="2"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                placeholder="Details on camp demographics, specific sizes needed, or medical urgencies..."
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

      {/* EDIT REQUEST MODAL */}
      {editingRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden">
            <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm">Edit Relief Need #{editingRequest.id}</h3>
              </div>
              <button onClick={() => setEditingRequest(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateRequest} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2 border-b border-slate-100">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Postal PIN Code</label>
                  <input
                    type="text"
                    maxLength="6"
                    pattern="[0-9]{6}"
                    value={editingRequest.pincode || ''}
                    onChange={(e) => setEditingRequest({ ...editingRequest, pincode: e.target.value.replace(/\D/g, '') })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Camp / Shelter Name (Optional)</label>
                  <input
                    type="text"
                    value={editingRequest.campName || ''}
                    onChange={(e) => setEditingRequest({ ...editingRequest, campName: e.target.value, shelterName: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={editingRequest.category}
                    onChange={(e) => setEditingRequest({ ...editingRequest, category: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Item Description</label>
                  <input
                    type="text"
                    required
                    value={editingRequest.itemName}
                    onChange={(e) => setEditingRequest({ ...editingRequest, itemName: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Quantity Needed</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editingRequest.quantityNeeded}
                    onChange={(e) => setEditingRequest({ ...editingRequest, quantityNeeded: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Urgency Level</label>
                  <select
                    value={editingRequest.urgency}
                    onChange={(e) => setEditingRequest({ ...editingRequest, urgency: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none font-bold"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MODERATE">MODERATE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Drop Location</label>
                <input
                  type="text"
                  value={editingRequest.dropLocation || ''}
                  onChange={(e) => setEditingRequest({ ...editingRequest, dropLocation: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notes</label>
                <textarea
                  rows="2"
                  value={editingRequest.note || ''}
                  onChange={(e) => setEditingRequest({ ...editingRequest, note: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingRequest(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SEARCH AND FILTER TOOLBAR */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search camp needs by item, ID, notes..."
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-amber-500 outline-none"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white font-medium outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="ALL">All Statuses ({myCampRequests.length})</option>
              <option value="PENDING">Pending Verification</option>
              <option value="VERIFIED">Verified</option>
              <option value="PARTIALLY_PLEDGED">Partially Pledged</option>
              <option value="DISPATCHED">In-Transit / Dispatched</option>
              <option value="ACCEPTED">Accepted / Delivered</option>
            </select>
          </div>

          {/* Urgency Filter */}
          <div>
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white font-medium outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="ALL">All Urgencies</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MODERATE">Moderate</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-slate-100">
          <button
            onClick={() => setCategoryFilter('ALL')}
            className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-colors ${
              categoryFilter === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-colors ${
                categoryFilter === cat.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* REQUESTS LIST & WORKFLOW ACCORDION */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Relief Demands & Fulfillment Lifecycle</h2>
            <p className="text-xs text-slate-500">
              Track requests through Verification → Donor Pledge → Dispatch → Final Acceptance.
            </p>
          </div>
          <div className="text-xs text-slate-500">
            Showing <strong>{displayedRequests.length}</strong> of {myCampRequests.length} requests
          </div>
        </div>

        {displayedRequests.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 space-y-2">
            <Package className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700">No matching relief requests found.</p>
            <p>Click "Post New Relief Need" above to submit an urgent requirement.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {displayedRequests.map(req => {
              const fulfilled = req.quantityFulfilled || 0;
              const percent = Math.min(100, Math.round((fulfilled / req.quantityNeeded) * 100));
              const isDispatched = req.status === 'DISPATCHED';
              const isAccepted = req.status === 'ACCEPTED' || req.status === 'DELIVERED';

              return (
                <div key={req.id} className="p-5 hover:bg-slate-50/70 transition-colors space-y-4">
                  {/* Top Header: ID, Urgency, Status, Action buttons */}
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
                      <span className="text-xs text-slate-500 font-medium">{req.category}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Status Badge */}
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          isAccepted
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : isDispatched
                            ? 'bg-blue-100 text-blue-800 border border-blue-200 animate-pulse'
                            : req.status === 'VERIFIED'
                            ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {isAccepted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
                        {isDispatched && <Truck className="w-3.5 h-3.5 text-blue-700" />}
                        <span>{req.status}</span>
                      </span>

                      {/* CRUD Actions: Edit & Delete (available before accepted) */}
                      {!isAccepted && (
                        <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
                          <button
                            onClick={() => setEditingRequest(req)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded"
                            title="Edit request"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRequest(req.id)}
                            className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded"
                            title="Cancel / Delete request"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Main Info Grid */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="font-bold text-slate-900 text-base">{req.itemName}</h3>
                      {req.note && <p className="text-xs text-slate-600 italic">"{req.note}"</p>}
                      <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-600 pt-1">
                        <span className="font-semibold text-slate-900">
                          {req.campName || req.shelterName || 'Relief Camp'}
                        </span>
                        {req.pincode && (
                          <span className="inline-flex items-center gap-1 font-mono font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 text-[11px]">
                            <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                            <span>PIN: {req.pincode}</span>
                          </span>
                        )}
                        <span>• Required: <strong>{req.quantityNeeded} units</strong></span>
                        {req.dropLocation && <span>• Handover: {req.dropLocation}</span>}
                        {req.verifiedByOrg && <span>• Verified: {req.verifiedByOrg}</span>}
                      </div>
                    </div>

                    {/* Progress Bar */}
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

                  {/* WORKFLOW STEP 4 & 5: IN-TRANSIT & ACCEPTANCE */}
                  {isDispatched && !isAccepted && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3.5 text-xs text-blue-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 font-bold text-blue-900">
                          <Truck className="w-4 h-4" />
                          <span>Relief Transport Convoy En Route</span>
                        </div>
                        <div className="text-[11px] text-blue-800">
                          Vehicle: <strong>{req.dispatchDetails?.vehicleNo || 'SDRF Transport'}</strong>
                          {req.dispatchDetails?.driverContact && ` • Driver: ${req.dispatchDetails.driverContact}`}
                          {req.dispatchDetails?.assignedVolunteer && ` • Escort: ${req.dispatchDetails.assignedVolunteer}`}
                        </div>
                      </div>

                      <button
                        onClick={() => setDeliveryConfirmId(req.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow-sm text-xs transition-colors shrink-0 flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                        <span>Accept & Confirm Delivery</span>
                      </button>
                    </div>
                  )}

                  {/* ACCEPTANCE PROMPT DIALOG */}
                  {deliveryConfirmId === req.id && (
                    <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-2 font-bold text-xs text-emerald-950">
                        <FileCheck2 className="w-4 h-4 text-emerald-700" />
                        <span>Confirm Receipt & Handover for Request #{req.id}</span>
                      </div>
                      <input
                        type="text"
                        value={deliveryNote}
                        onChange={(e) => setDeliveryNote(e.target.value)}
                        placeholder="Delivery handover note (e.g. 50 boxes received at East Gate and logged to camp stores)"
                        className="w-full px-3 py-2 text-xs border border-emerald-300 rounded bg-white outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setDeliveryConfirmId(null)}
                          className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded text-xs hover:bg-slate-100"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleConfirmReceived(req.id)}
                          className="px-4 py-1.5 bg-emerald-700 text-white font-bold rounded text-xs shadow-sm hover:bg-emerald-800 flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Confirm Receipt & Close Request</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ACCEPTED CONFIRMATION RECEIPT */}
                  {isAccepted && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-900 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        <div>
                          <strong>Accepted by Camp:</strong> {req.confirmationNote || 'Supplies received and accepted.'}
                        </div>
                      </div>
                      {req.acceptedAt && (
                        <div className="text-[10px] text-emerald-700 font-mono shrink-0">
                          {new Date(req.acceptedAt).toLocaleDateString()} {new Date(req.acceptedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      )}
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
