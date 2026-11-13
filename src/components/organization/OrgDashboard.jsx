import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  Truck,
  Boxes,
  Plus,
  Printer,
  ShieldCheck,
  Search,
  Edit2,
  Trash2,
  X,
  AlertTriangle,
  Clock,
  ArrowRight,
  Filter
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { CATEGORIES } from '../../data/initialData';
import DispatchModal from './DispatchModal';

export default function OrgDashboard({ onOpenManifest }) {
  const { currentUser } = useAuth();
  const {
    requests,
    pledges,
    inventory,
    verifyRequest,
    dispatchRequestShipment,
    updateRequest,
    deleteRequest,
    updatePledgeStatus,
    deletePledge,
    updateInventoryStock,
    updateInventoryItem,
    deleteInventoryItem,
    addInventoryItem
  } = useData();

  const [activeTab, setActiveTab] = useState('triage'); // 'triage' | 'inventory' | 'pledges'
  const [dispatchTargetRequest, setDispatchTargetRequest] = useState(null);
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [editingStock, setEditingStock] = useState(null);
  const [editingRequest, setEditingRequest] = useState(null);

  // Search & Filter States
  const [triageSearch, setTriageSearch] = useState('');
  const [triageUrgency, setTriageUrgency] = useState('ALL');
  const [triageStatus, setTriageStatus] = useState('ALL');

  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryCategory, setInventoryCategory] = useState('ALL');

  const [pledgeSearch, setPledgeSearch] = useState('');
  const [pledgeStatus, setPledgeStatus] = useState('ALL');

  // New stock form
  const [newStock, setNewStock] = useState({
    hub: '',
    category: 'WATER',
    item: '',
    inStock: 50,
    unit: 'bottles'
  });

  // Live Metrics
  const pendingTriageCount = requests.filter(r => r.status === 'PENDING').length;
  const verifiedCount = requests.filter(r => r.status === 'VERIFIED' || r.status === 'PARTIALLY_PLEDGED').length;
  const dispatchedCount = requests.filter(r => r.status === 'DISPATCHED').length;
  const acceptedCount = requests.filter(r => r.status === 'ACCEPTED' || r.status === 'DELIVERED').length;
  const totalStockUnits = inventory.reduce((sum, item) => sum + (item.inStock || 0), 0);

  // Workflow Handlers
  const handleVerify = (reqId) => {
    verifyRequest(reqId, currentUser?.orgName || 'Helping Organization');
  };

  const handleDispatchConfirm = (reqId, details) => {
    dispatchRequestShipment(reqId, details);
    setDispatchTargetRequest(null);
  };

  // Inventory CRUD Handlers
  const handleCreateStock = (e) => {
    e.preventDefault();
    if (!newStock.item.trim()) return;
    addInventoryItem(newStock);
    setShowAddStockModal(false);
    setNewStock({
      hub: '',
      category: 'WATER',
      item: '',
      inStock: 50,
      unit: 'bottles'
    });
  };

  const handleUpdateStock = (e) => {
    e.preventDefault();
    if (!editingStock || !editingStock.item.trim()) return;
    updateInventoryItem(editingStock.id, {
      hub: editingStock.hub,
      category: editingStock.category,
      item: editingStock.item,
      inStock: parseInt(editingStock.inStock, 10) || 0,
      unit: editingStock.unit
    });
    setEditingStock(null);
  };

  const handleDeleteStock = (invId, itemName) => {
    if (window.confirm(`Delete inventory item "${itemName}"?`)) {
      deleteInventoryItem(invId);
    }
  };

  // Request CRUD Handlers in Org Triage
  const handleUpdateRequest = (e) => {
    e.preventDefault();
    if (!editingRequest) return;
    updateRequest(editingRequest.id, {
      itemName: editingRequest.itemName,
      quantityNeeded: parseInt(editingRequest.quantityNeeded, 10) || 1,
      urgency: editingRequest.urgency,
      note: editingRequest.note
    });
    setEditingRequest(null);
  };

  const handleDeleteRequest = (reqId) => {
    if (window.confirm(`Are you sure you want to remove request #${reqId}?`)) {
      deleteRequest(reqId);
    }
  };

  const handleDeletePledge = (pledgeId) => {
    if (window.confirm(`Are you sure you want to cancel pledge #${pledgeId}?`)) {
      deletePledge(pledgeId);
    }
  };

  // Filtered lists
  const filteredRequests = requests.filter(req => {
    if (triageUrgency !== 'ALL' && req.urgency !== triageUrgency) return false;
    if (triageStatus !== 'ALL') {
      if (triageStatus === 'ACCEPTED' && req.status !== 'ACCEPTED' && req.status !== 'DELIVERED') return false;
      if (triageStatus !== 'ACCEPTED' && req.status !== triageStatus) return false;
    }
    if (triageSearch.trim()) {
      const q = triageSearch.toLowerCase();
      const matchId = req.id.toLowerCase().includes(q);
      const matchItem = req.itemName.toLowerCase().includes(q);
      const matchCamp = (req.campName || '').toLowerCase().includes(q);
      const matchReq = (req.requesterName || '').toLowerCase().includes(q);
      if (!matchId && !matchItem && !matchCamp && !matchReq) return false;
    }
    return true;
  });

  const filteredInventory = inventory.filter(inv => {
    if (inventoryCategory !== 'ALL' && inv.category !== inventoryCategory) return false;
    if (inventorySearch.trim()) {
      const q = inventorySearch.toLowerCase();
      const matchId = inv.id.toLowerCase().includes(q);
      const matchItem = inv.item.toLowerCase().includes(q);
      const matchHub = (inv.hub || '').toLowerCase().includes(q);
      if (!matchId && !matchItem && !matchHub) return false;
    }
    return true;
  });

  const filteredPledges = pledges.filter(p => {
    if (pledgeStatus !== 'ALL' && p.status !== pledgeStatus) return false;
    if (pledgeSearch.trim()) {
      const q = pledgeSearch.toLowerCase();
      const matchId = p.id.toLowerCase().includes(q);
      const matchDonor = (p.donorName || '').toLowerCase().includes(q);
      const matchItem = (p.itemName || '').toLowerCase().includes(q);
      if (!matchId && !matchDonor && !matchItem) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* NGO Command Center Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-700 text-white flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">
                  {currentUser?.orgName || 'Helping Organization Portal'}
                </h1>
                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Authorized NGO</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Coordinator: <strong>{currentUser?.coordinatorName || 'Operations Lead'}</strong>
                {currentUser?.regNo ? ` • Reg No: ${currentUser.regNo}` : ''}
                {currentUser?.phone ? ` • Contact: ${currentUser.phone}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenManifest}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Relief Manifest</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-200">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <div className="text-xs font-semibold text-slate-600">Pending Triage</div>
            <div className="text-2xl font-bold text-red-700 mt-1">{pendingTriageCount}</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <div className="text-xs font-semibold text-slate-600">Verified Needs</div>
            <div className="text-2xl font-bold text-amber-700 mt-1">{verifiedCount}</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <div className="text-xs font-semibold text-slate-600">Convoys In-Transit</div>
            <div className="text-2xl font-bold text-blue-700 mt-1">{dispatchedCount}</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <div className="text-xs font-semibold text-slate-600">Accepted & Delivered</div>
            <div className="text-2xl font-bold text-emerald-700 mt-1">{acceptedCount}</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <div className="text-xs font-semibold text-slate-600">Warehouse Stock</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{totalStockUnits}</div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('triage')}
            className={`px-4 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'triage'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Triage & Requests ({requests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'inventory'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Warehouse Stock ({inventory.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pledges')}
            className={`px-4 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'pledges'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Inbound Pledges ({pledges.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: TRIAGE & REQUESTS */}
      {activeTab === 'triage' && (
        <div className="space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={triageSearch}
                  onChange={(e) => setTriageSearch(e.target.value)}
                  placeholder="Search by need, camp, ID..."
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <select
                  value={triageStatus}
                  onChange={(e) => setTriageStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white font-medium outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="ALL">All Statuses ({requests.length})</option>
                  <option value="PENDING">Pending Verification</option>
                  <option value="VERIFIED">Verified</option>
                  <option value="PARTIALLY_PLEDGED">Partially Pledged</option>
                  <option value="DISPATCHED">In-Transit / Dispatched</option>
                  <option value="ACCEPTED">Accepted / Delivered</option>
                </select>
              </div>

              <div>
                <select
                  value={triageUrgency}
                  onChange={(e) => setTriageUrgency(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white font-medium outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="ALL">All Urgencies</option>
                  <option value="CRITICAL">Critical</option>
                  <option value="HIGH">High</option>
                  <option value="MODERATE">Moderate</option>
                </select>
              </div>
            </div>
          </div>

          {/* List of Requests */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {filteredRequests.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No relief requests matching search criteria.
              </div>
            ) : (
              <div className="divide-y divide-slate-200 text-xs">
                {filteredRequests.map(req => {
                  const fulfilled = req.quantityFulfilled || 0;
                  const remaining = Math.max(0, req.quantityNeeded - fulfilled);
                  const isPending = req.status === 'PENDING';
                  const isVerified = req.status === 'VERIFIED' || req.status === 'PARTIALLY_PLEDGED';
                  const isDispatched = req.status === 'DISPATCHED';
                  const isAccepted = req.status === 'ACCEPTED' || req.status === 'DELIVERED';

                  return (
                    <div key={req.id} className="p-5 hover:bg-slate-50/70 transition-colors space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {req.id}
                          </span>
                          <span className="font-bold text-slate-700">{req.category}</span>
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

                        {/* Workflow Action Buttons */}
                        <div className="flex items-center gap-2">
                          {isPending && (
                            <button
                              onClick={() => handleVerify(req.id)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow-sm flex items-center gap-1 transition-colors"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Verify Need</span>
                            </button>
                          )}

                          {(isVerified || isPending) && (
                            <button
                              onClick={() => setDispatchTargetRequest(req)}
                              className="px-3 py-1 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded shadow-sm flex items-center gap-1 transition-colors"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>Dispatch Convoy</span>
                            </button>
                          )}

                          <span
                            className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                              isAccepted
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : isDispatched
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : isVerified
                                ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {req.status}
                          </span>

                          {/* Edit / Delete Request */}
                          <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
                            <button
                              onClick={() => setEditingRequest(req)}
                              className="p-1 text-slate-400 hover:text-slate-800 rounded"
                              title="Edit request"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteRequest(req.id)}
                              className="p-1 text-slate-400 hover:text-red-700 rounded"
                              title="Delete request"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 space-y-1">
                          <div className="text-base font-bold text-slate-900">{req.itemName}</div>
                          <div className="text-slate-700 font-medium">Relief Camp: <strong>{req.campName}</strong></div>
                          <div className="text-slate-500 text-[11px]">
                            Requester: {req.requesterName} {req.requesterPhone ? `• Tel: ${req.requesterPhone}` : ''}
                            {req.dropLocation ? ` • Gate: ${req.dropLocation}` : ''}
                          </div>
                          {req.note && (
                            <div className="text-slate-600 bg-slate-50 p-2 rounded border border-slate-200 italic mt-1">
                              "{req.note}"
                            </div>
                          )}
                        </div>

                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Needed:</span>
                            <span className="font-bold text-slate-900">{req.quantityNeeded}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Pledged / Sent:</span>
                            <span className="font-bold text-emerald-700">{fulfilled}</span>
                          </div>
                          <div className="flex justify-between border-t border-slate-200 pt-1">
                            <span className="text-slate-500">Remaining Shortage:</span>
                            <span className="font-bold text-red-700">{remaining}</span>
                          </div>
                        </div>
                      </div>

                      {/* Dispatched Convoy Details */}
                      {isDispatched && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 text-xs text-blue-900 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4 text-blue-700 shrink-0" />
                            <span>
                              Transport: <strong>{req.dispatchDetails?.vehicleNo}</strong>
                              {req.dispatchDetails?.driverContact ? ` (Driver: ${req.dispatchDetails.driverContact})` : ''}
                            </span>
                          </div>
                          <span className="text-[10px] font-semibold text-blue-700">En route to camp</span>
                        </div>
                      )}

                      {/* Accepted Confirmation */}
                      {isAccepted && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-xs text-emerald-900 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                            <span><strong>Delivery Confirmed by Camp:</strong> {req.confirmationNote || 'Supplies accepted.'}</span>
                          </div>
                          {req.acceptedAt && (
                            <span className="text-[10px] font-mono text-emerald-700">
                              {new Date(req.acceptedAt).toLocaleDateString()}
                            </span>
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
      )}

      {/* TAB 2: WAREHOUSE INVENTORY CRUD */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  placeholder="Search stock item, hub..."
                  className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>

              <select
                value={inventoryCategory}
                onChange={(e) => setInventoryCategory(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-md bg-white font-medium outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="ALL">All Categories</option>
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowAddStockModal(true)}
              className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded flex items-center gap-1.5 shrink-0 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Stock Item</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {filteredInventory.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No inventory recorded. Click "Add Stock Item" to add resources to the disaster warehouse.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-semibold tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Stock ID</th>
                      <th className="py-3 px-4">Warehouse Hub</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Relief Item</th>
                      <th className="py-3 px-4">In-Stock Quantity</th>
                      <th className="py-3 px-4">Adjust Units</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredInventory.map(inv => (
                      <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">{inv.id}</td>
                        <td className="py-3 px-4 font-semibold text-slate-800">{inv.hub || 'Central Relief Hub'}</td>
                        <td className="py-3 px-4">{inv.category}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{inv.item}</td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
                            {inv.inStock} {inv.unit}
                          </span>
                        </td>
                        <td className="py-3 px-4 space-x-1">
                          <button
                            onClick={() => updateInventoryStock(inv.id, 10)}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-300 font-semibold text-[11px]"
                            title="Add 10 units"
                          >
                            +10
                          </button>
                          <button
                            onClick={() => updateInventoryStock(inv.id, -10)}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-300 font-semibold text-[11px]"
                            title="Remove 10 units"
                          >
                            -10
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right space-x-1">
                          <button
                            onClick={() => setEditingStock(inv)}
                            className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded"
                            title="Edit Stock Item"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteStock(inv.id, inv.item)}
                            className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded"
                            title="Delete Stock Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: INBOUND DONOR PLEDGES */}
      {activeTab === 'pledges' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={pledgeSearch}
                  onChange={(e) => setPledgeSearch(e.target.value)}
                  placeholder="Search donor name, item, ID..."
                  className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>

              <select
                value={pledgeStatus}
                onChange={(e) => setPledgeStatus(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-md bg-white font-medium outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="ALL">All Pledge Statuses</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="IN_TRANSIT">IN_TRANSIT</option>
                <option value="DELIVERED_TO_HUB">DELIVERED_TO_HUB</option>
                <option value="ACCEPTED">ACCEPTED</option>
              </select>
            </div>
            <span className="text-slate-500">Total: <strong>{filteredPledges.length}</strong></span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {filteredPledges.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No inbound pledges matching criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-semibold tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Pledge ID</th>
                      <th className="py-3 px-4">Donor Name</th>
                      <th className="py-3 px-4">Relief Item</th>
                      <th className="py-3 px-4">Quantity</th>
                      <th className="py-3 px-4">Staging Hub</th>
                      <th className="py-3 px-4">Status & Logistics</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredPledges.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{p.id}</td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900">{p.donorName}</td>
                        <td className="py-3.5 px-4 font-medium text-slate-800">{p.itemName}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{p.quantity}</td>
                        <td className="py-3.5 px-4 text-slate-600">{p.dropoffHub || 'Central Staging Hub'}</td>
                        <td className="py-3.5 px-4">
                          <select
                            value={p.status}
                            onChange={(e) => updatePledgeStatus(p.id, e.target.value)}
                            className="px-2 py-1 bg-white border border-slate-300 rounded font-bold text-[11px] outline-none"
                          >
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="IN_TRANSIT">IN_TRANSIT</option>
                            <option value="DELIVERED_TO_HUB">DELIVERED_TO_HUB</option>
                            <option value="ACCEPTED">ACCEPTED</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDeletePledge(p.id)}
                            className="p-1 text-slate-400 hover:text-red-700 rounded"
                            title="Cancel Pledge"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DISPATCH CONVOY MODAL */}
      {dispatchTargetRequest && (
        <DispatchModal
          request={dispatchTargetRequest}
          onClose={() => setDispatchTargetRequest(null)}
          onConfirm={handleDispatchConfirm}
        />
      )}

      {/* ADD STOCK MODAL */}
      {showAddStockModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden">
            <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between">
              <h3 className="font-bold text-sm">Add Warehouse Stock Resource</h3>
              <button onClick={() => setShowAddStockModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateStock} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Warehouse / Hub Location</label>
                <input
                  type="text"
                  required
                  value={newStock.hub}
                  onChange={(e) => setNewStock({ ...newStock, hub: e.target.value })}
                  placeholder="e.g. Central Staging Warehouse #1"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={newStock.category}
                  onChange={(e) => setNewStock({ ...newStock, category: e.target.value })}
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
                  value={newStock.item}
                  onChange={(e) => setNewStock({ ...newStock, item: e.target.value })}
                  placeholder="e.g. Clean Drinking Water Bottles, Blankets"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newStock.inStock}
                    onChange={(e) => setNewStock({ ...newStock, inStock: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit of Measure</label>
                  <input
                    type="text"
                    value={newStock.unit}
                    onChange={(e) => setNewStock({ ...newStock, unit: e.target.value })}
                    placeholder="e.g. bottles, packs, boxes"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddStockModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded"
                >
                  Save Stock Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STOCK MODAL */}
      {editingStock && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden">
            <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between">
              <h3 className="font-bold text-sm">Edit Warehouse Stock #{editingStock.id}</h3>
              <button onClick={() => setEditingStock(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleUpdateStock} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Warehouse Hub</label>
                <input
                  type="text"
                  required
                  value={editingStock.hub}
                  onChange={(e) => setEditingStock({ ...editingStock, hub: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Item Description</label>
                <input
                  type="text"
                  required
                  value={editingStock.item}
                  onChange={(e) => setEditingStock({ ...editingStock, item: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">In-Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editingStock.inStock}
                    onChange={(e) => setEditingStock({ ...editingStock, inStock: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit</label>
                  <input
                    type="text"
                    value={editingStock.unit}
                    onChange={(e) => setEditingStock({ ...editingStock, unit: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingStock(null)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded"
                >
                  Save Stock Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT REQUEST MODAL IN TRIAGE */}
      {editingRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden">
            <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between">
              <h3 className="font-bold text-sm">Update Need Triage #{editingRequest.id}</h3>
              <button onClick={() => setEditingRequest(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleUpdateRequest} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Item</label>
                <input
                  type="text"
                  required
                  value={editingRequest.itemName}
                  onChange={(e) => setEditingRequest({ ...editingRequest, itemName: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                  <label className="block font-semibold text-slate-700 mb-1">Urgency</label>
                  <select
                    value={editingRequest.urgency}
                    onChange={(e) => setEditingRequest({ ...editingRequest, urgency: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MODERATE">MODERATE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Coordinator Notes</label>
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
                  className="px-4 py-2 border border-slate-300 rounded text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded"
                >
                  Save Triage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
