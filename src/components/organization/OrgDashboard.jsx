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
  Filter,
  Heart,
  Package,
  Droplets,
  Shirt,
  Utensils,
  HeartPulse,
  BookOpen,
  Tent,
  ShieldAlert,
  Minus,
  Check,
  ShoppingBag,
  FileCheck2,
  MapPin,
  Phone,
  Compass,
  User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { CATEGORIES, STANDARD_ITEMS } from '../../data/initialData';
import DispatchModal from './DispatchModal';
import NearbyCampsFinder from '../common/NearbyCampsFinder';
import ProfileEditModal from '../common/ProfileEditModal';
import { lookupPincode } from '../../utils/pincodeService';

export default function OrgDashboard({ onOpenManifest }) {
  const { currentUser } = useAuth();
  const {
    requests,
    pledges,
    inventory,
    verifyRequest,
    dispatchRequestShipment,
    acceptRequestDelivery,
    updateRequestStatus,
    addRequest,
    updateRequest,
    deleteRequest,
    addPledge,
    updatePledgeStatus,
    deletePledge,
    updateInventoryStock,
    updateInventoryItem,
    deleteInventoryItem,
    addInventoryItem
  } = useData();

  // Active navigation tab
  // 'triage' | 'donate' | 'receive' | 'inventory' | 'pledges'
  const [activeTab, setActiveTab] = useState('triage');

  const [dispatchTargetRequest, setDispatchTargetRequest] = useState(null);
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [editingStock, setEditingStock] = useState(null);
  const [editingRequest, setEditingRequest] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // ========================================================
  // 1. ORG AS DONOR STATE (Donate Supplies to Camps)
  // ========================================================
  const [itemCounts, setItemCounts] = useState({});
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [donateSuccess, setDonateSuccess] = useState(false);
  const [donateTargetCamp, setDonateTargetCamp] = useState('');
  const [donateNotes, setDonateNotes] = useState('');
  const [donateSearchQuery, setDonateSearchQuery] = useState('');
  const [donateCategory, setDonateCategory] = useState('ALL');

  const handleIncrement = (itemId) => {
    setItemCounts(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  };

  const handleDecrement = (itemId) => {
    setItemCounts(prev => {
      const current = prev[itemId] || 0;
      if (current <= 1) {
        const updated = { ...prev };
        delete updated[itemId];
        return updated;
      }
      return { ...prev, [itemId]: current - 1 };
    });
  };

  const handleSetQuantity = (itemId, val) => {
    const num = Math.max(0, parseInt(val, 10) || 0);
    setItemCounts(prev => {
      if (num === 0) {
        const updated = { ...prev };
        delete updated[itemId];
        return updated;
      }
      return { ...prev, [itemId]: num };
    });
  };

  const selectedItemsList = Object.entries(itemCounts)
    .map(([id, qty]) => {
      const itemDef = STANDARD_ITEMS.find(it => it.id === id);
      return itemDef ? { ...itemDef, quantity: qty } : null;
    })
    .filter(Boolean);

  const totalSelectedUnits = selectedItemsList.reduce((sum, it) => sum + it.quantity, 0);

  const handleOrgSubmitDonation = (e) => {
    e.preventDefault();
    if (selectedItemsList.length === 0) return;

    selectedItemsList.forEach(sel => {
      addPledge({
        requestId: `ORG-${sel.id}`,
        donorName: currentUser?.orgName || 'Relief Organization',
        donorEmail: currentUser?.email || '',
        donorPhone: currentUser?.phone || '',
        itemName: sel.name,
        quantity: sel.quantity,
        deliveryMethod: 'ORGANIZATION_CONVOY',
        dropoffHub: donateTargetCamp || 'Regional Disaster Staging Hub',
        trackingNotes: donateNotes || `Donated and dispatched by ${currentUser?.orgName || 'Helping Organization'}`
      });
    });

    setDonateSuccess(true);
    setTimeout(() => {
      setItemCounts({});
      setShowDonateModal(false);
      setDonateSuccess(false);
      setActiveTab('pledges');
    }, 1800);
  };

  // ========================================================
  // 2. ORG AS RECEIVER STATE (Request & Accept Supplies)
  // ========================================================
  const [showNewOrgRequestForm, setShowNewOrgRequestForm] = useState(false);
  const [deliveryConfirmId, setDeliveryConfirmId] = useState(null);
  const [deliveryNote, setDeliveryNote] = useState('');
  const [receiveSearchQuery, setReceiveSearchQuery] = useState('');
  const [receiveStatusFilter, setReceiveStatusFilter] = useState('ALL');

  const [orgRequestData, setOrgRequestData] = useState({
    campName: '',
    shelterName: '',
    pincode: '',
    category: 'WATER',
    itemName: '',
    quantityNeeded: 25,
    urgency: 'HIGH',
    peopleCount: '',
    dropLocation: '',
    note: ''
  });

  const handleOrgCreateRequest = (e) => {
    e.preventDefault();
    if (!orgRequestData.itemName.trim()) return;

    let resolvedCamp = (orgRequestData.campName || '').trim();
    if (!resolvedCamp && orgRequestData.pincode) {
      const match = lookupPincode(orgRequestData.pincode, requests);
      resolvedCamp = match?.primaryCamp?.name || `${currentUser?.orgName || 'NGO'} Shelter (PIN ${orgRequestData.pincode})`;
    }

    addRequest({
      zoneName: 'Calamity Sector',
      campName: resolvedCamp || orgRequestData.shelterName || `${currentUser?.orgName || 'NGO'} Relief Shelter`,
      shelterName: resolvedCamp || orgRequestData.campName || `${currentUser?.orgName || 'NGO'} Relief Shelter`,
      pincode: orgRequestData.pincode || '',
      requesterName: currentUser?.coordinatorName || currentUser?.orgName || 'Operations Officer',
      requesterRole: 'Organization Field Lead',
      requesterPhone: currentUser?.phone || '',
      peopleCount: parseInt(orgRequestData.peopleCount, 10) || 0,
      category: orgRequestData.category,
      itemName: orgRequestData.itemName,
      quantityNeeded: parseInt(orgRequestData.quantityNeeded, 10) || 1,
      urgency: orgRequestData.urgency,
      note: orgRequestData.note,
      dropLocation: orgRequestData.dropLocation || 'Organization Intake Hub / Camp Gate'
    });

    setOrgRequestData({
      campName: '',
      shelterName: '',
      pincode: '',
      category: 'WATER',
      itemName: '',
      quantityNeeded: 25,
      urgency: 'HIGH',
      peopleCount: '',
      dropLocation: '',
      note: ''
    });
    setShowNewOrgRequestForm(false);
  };

  const handleOrgConfirmArrival = (reqId) => {
    acceptRequestDelivery(reqId, deliveryNote || 'Supplies received and accepted at organization relief center.');
    setDeliveryConfirmId(null);
    setDeliveryNote('');
  };

  // Requests posted by this organization
  const orgOwnedRequests = requests.filter(r => {
    if (!currentUser) return false;
    return (
      (currentUser.orgName && r.campName?.toLowerCase().includes(currentUser.orgName.toLowerCase())) ||
      (currentUser.coordinatorName && r.requesterName?.toLowerCase().includes(currentUser.coordinatorName.toLowerCase())) ||
      r.requesterRole?.includes('Organization')
    );
  });

  // Filtered requests for Org as Receiver
  const filteredOrgReceivedRequests = orgOwnedRequests.filter(req => {
    if (receiveStatusFilter !== 'ALL') {
      if (receiveStatusFilter === 'ACCEPTED' && req.status !== 'ACCEPTED' && req.status !== 'DELIVERED') return false;
      if (receiveStatusFilter !== 'ACCEPTED' && req.status !== receiveStatusFilter) return false;
    }
    if (receiveSearchQuery.trim()) {
      const q = receiveSearchQuery.toLowerCase();
      const matchId = req.id.toLowerCase().includes(q);
      const matchItem = req.itemName.toLowerCase().includes(q);
      const matchCamp = (req.campName || '').toLowerCase().includes(q);
      if (!matchId && !matchItem && !matchCamp) return false;
    }
    return true;
  });

  // Category Icon helper
  const getItemIcon = (category) => {
    switch (category) {
      case 'CLOTHES':
        return <Shirt className="w-6 h-6 text-indigo-600" />;
      case 'HYGIENE':
        return <ShieldAlert className="w-6 h-6 text-teal-600" />;
      case 'WATER':
        return <Droplets className="w-6 h-6 text-blue-600" />;
      case 'FOOD':
        return <Utensils className="w-6 h-6 text-amber-600" />;
      case 'MEDICINE':
        return <HeartPulse className="w-6 h-6 text-rose-600" />;
      case 'BOOKS':
        return <BookOpen className="w-6 h-6 text-violet-600" />;
      case 'SHELTER_ESSENTIALS':
        return <Tent className="w-6 h-6 text-emerald-600" />;
      default:
        return <Package className="w-6 h-6 text-slate-600" />;
    }
  };

  // Filtered items for Org as Donor
  const filteredDonationItems = STANDARD_ITEMS.filter(item => {
    if (donateCategory !== 'ALL' && item.category !== donateCategory) return false;
    if (donateSearchQuery.trim()) {
      const q = donateSearchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }
    return true;
  });

  // ========================================================
  // 3. TRIAGE & INVENTORY STATES
  // ========================================================
  const [triageSearch, setTriageSearch] = useState('');
  const [triageUrgency, setTriageUrgency] = useState('ALL');
  const [triageStatus, setTriageStatus] = useState('ALL');

  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryCategory, setInventoryCategory] = useState('ALL');

  const [pledgeSearch, setPledgeSearch] = useState('');
  const [pledgeStatus, setPledgeStatus] = useState('ALL');

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
      const matchShelter = (req.shelterName || '').toLowerCase().includes(q);
      const matchReq = (req.requesterName || '').toLowerCase().includes(q);
      const matchPin = (req.pincode || '').includes(q);
      if (!matchId && !matchItem && !matchCamp && !matchShelter && !matchReq && !matchPin) return false;
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
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6 pb-36">
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
                  <span>Dual Role: Donor & Receiver</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Coordinator: <strong>{currentUser?.coordinatorName || 'Operations Lead'}</strong>
                {currentUser?.regNo ? ` • Reg: ${currentUser.regNo}` : ''}
                {currentUser?.phone ? ` • Contact: ${currentUser.phone}` : ''}
              </p>
            </div>
          </div>

          {/* Quick Dual-Role Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('donate')}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-md shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Donate Supplies</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('receive');
                setShowNewOrgRequestForm(true);
              }}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-md shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Request Supplies</span>
            </button>

            <button
              onClick={() => setShowProfileModal(true)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-md border border-slate-300 shadow-sm transition-colors flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-slate-600" />
              <span>Manage Profile</span>
            </button>

            <button
              onClick={onOpenManifest}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Manifest</span>
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

        {/* 5-Tab Navigation Bar */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-200 text-xs font-semibold overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('triage')}
            className={`px-3.5 py-2 rounded-md transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'triage'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Triage & Requests ({requests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('donate')}
            className={`px-3.5 py-2 rounded-md transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'donate'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-emerald-700 hover:bg-emerald-50 bg-emerald-50/50'
            }`}
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Donate Supplies (Org as Donor)</span>
          </button>

          <button
            onClick={() => setActiveTab('receive')}
            className={`px-3.5 py-2 rounded-md transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'receive'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-amber-700 hover:bg-amber-50 bg-amber-50/50'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Request Supplies (Org as Receiver)</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3.5 py-2 rounded-md transition-colors flex items-center gap-1.5 shrink-0 ${
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
            className={`px-3.5 py-2 rounded-md transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'pledges'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Pledges & Convoys ({pledges.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          TAB 1: TRIAGE & OPERATIONS
         ======================================================== */}
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

                          {/* Quick Status Dropdown (Pending / Accepted / Completed / etc) */}
                          <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5">
                            <span className="text-[10px] font-semibold text-slate-500">Status:</span>
                            <select
                              value={req.status}
                              onChange={(e) => updateRequestStatus(req.id, e.target.value)}
                              className="bg-white border border-slate-300 rounded px-1.5 py-0.5 font-bold text-slate-800 text-[10px] outline-none cursor-pointer"
                            >
                              <option value="PENDING">PENDING</option>
                              <option value="ACCEPTED">ACCEPTED</option>
                              <option value="COMPLETED">COMPLETED</option>
                              <option value="VERIFIED">VERIFIED</option>
                              <option value="DISPATCHED">DISPATCHED</option>
                            </select>
                          </div>

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
                          <div className="flex flex-wrap items-center gap-2 text-slate-700 font-medium">
                            <span>Relief Camp / Shelter: <strong>{req.campName || req.shelterName}</strong></span>
                            {req.pincode && (
                              <span className="inline-flex items-center gap-1 font-mono font-bold text-[11px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
                                <MapPin className="w-3 h-3 text-blue-600" />
                                <span>PIN: {req.pincode}</span>
                              </span>
                            )}
                          </div>
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

      {/* ========================================================
          TAB 2: DONATE SUPPLIES (HELPING ORG AS DONOR)
         ======================================================== */}
      {activeTab === 'donate' && (
        <div className="space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold">Organization Donation Portal:</span> As a Helping Organization, you can allocate bulk supplies (clothes, water, food, medicines, books, etc.) to calamity shelters. Use the <strong>+</strong> and <strong>−</strong> steppers to assemble your aid dispatch.
            </div>
            {totalSelectedUnits > 0 && (
              <span className="font-bold bg-emerald-600 text-white px-2.5 py-1 rounded text-xs shrink-0 self-start sm:self-auto">
                {totalSelectedUnits} items selected for donation
              </span>
            )}
          </div>

          {/* Search & Category Filter */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3 text-xs">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={donateSearchQuery}
                onChange={(e) => setDonateSearchQuery(e.target.value)}
                placeholder="Search supplies to donate (shirt, pant, pads, water bottles, fruits, medicines, blankets)..."
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-slate-100">
              <button
                onClick={() => setDonateCategory('ALL')}
                className={`px-3 py-1 rounded-full font-semibold transition-colors shrink-0 ${
                  donateCategory === 'ALL'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Items ({STANDARD_ITEMS.length})
              </button>

              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setDonateCategory(cat.id)}
                  className={`px-3 py-1 rounded-full font-semibold transition-colors shrink-0 ${
                    donateCategory === cat.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Graphical Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDonationItems.map(item => {
              const count = itemCounts[item.id] || 0;
              const isSelected = count > 0;

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl border p-5 shadow-sm transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                            isSelected ? 'bg-emerald-50 border-emerald-300' : 'bg-slate-100 border-slate-200'
                          }`}
                        >
                          {getItemIcon(item.category)}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-base leading-tight">{item.name}</h3>
                          <span className="text-[11px] text-slate-500 font-medium">Unit: {item.unit}</span>
                        </div>
                      </div>

                      {/* Graphic Stepper: Minus, Count, Plus */}
                      <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-300 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleDecrement(item.id)}
                          disabled={count === 0}
                          className="w-8 h-8 rounded bg-white hover:bg-slate-200 text-slate-800 disabled:opacity-30 disabled:hover:bg-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                          title="Remove one (-)"
                        >
                          <Minus className="w-4 h-4 stroke-[3]" />
                        </button>

                        <input
                          type="number"
                          min="0"
                          value={count}
                          onChange={(e) => handleSetQuantity(item.id, e.target.value)}
                          className="w-10 text-center font-bold text-sm text-slate-900 font-mono bg-transparent outline-none"
                        />

                        <button
                          type="button"
                          onClick={() => handleIncrement(item.id)}
                          className="w-8 h-8 rounded bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                          title="Add one (+)"
                        >
                          <Plus className="w-4 h-4 stroke-[3]" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">
                      {count > 0 ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>{count} {item.unit} selected</span>
                        </span>
                      ) : (
                        <span>Use + / − to add to donation</span>
                      )}
                    </span>

                    {count > 0 && (
                      <button
                        onClick={() => setShowDonateModal(true)}
                        className="text-emerald-700 hover:underline font-bold text-xs"
                      >
                        Dispatch now →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: REQUEST SUPPLIES (HELPING ORG AS RECEIVER)
         ======================================================== */}
      {activeTab === 'receive' && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold">Organization Shelter Needs Desk:</span> When your shelters, distribution centers, or camps run short of supplies, you can post requirements here. You can also accept and confirm delivery when relief arrives.
            </div>
            <button
              onClick={() => setShowNewOrgRequestForm(!showNewOrgRequestForm)}
              className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded text-xs transition-colors shrink-0 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Post New Shelter Need</span>
            </button>
          </div>

          {/* NEW ORG REQUEST FORM */}
          {showNewOrgRequestForm && (
            <div className="bg-white rounded-xl border-2 border-amber-400 p-6 shadow-md transition-all">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Post Urgent Need for Org Shelter</h3>
                  <p className="text-xs text-slate-500">
                    Request clothes, food packets, water, medical kits, or shelter essentials.
                  </p>
                </div>
                <button
                  onClick={() => setShowNewOrgRequestForm(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-semibold px-2 py-1 rounded bg-slate-100"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleOrgCreateRequest} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2 border-b border-slate-100">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Postal PIN Code <span className="text-red-500">* Required</span>
                    </label>
                    <div className="relative">
                      <Compass className="w-4 h-4 text-blue-600 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        maxLength="6"
                        pattern="[0-9]{6}"
                        value={orgRequestData.pincode}
                        onChange={(e) => setOrgRequestData({ ...orgRequestData, pincode: e.target.value.replace(/\D/g, '') })}
                        placeholder="e.g. 682001 (6 digits)"
                        className="w-full pl-9 pr-3 py-2 border-2 border-blue-400 rounded-md outline-none font-mono font-bold bg-blue-50/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">
                      Relief Camp / Shelter Name <span className="text-slate-400">(Optional — auto-detected)</span>
                    </label>
                    <input
                      type="text"
                      value={orgRequestData.campName}
                      onChange={(e) => setOrgRequestData({ ...orgRequestData, campName: e.target.value, shelterName: e.target.value })}
                      placeholder={`Auto-detected from PIN or custom`}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none font-semibold"
                    />
                  </div>
                </div>

                <NearbyCampsFinder
                  pincode={orgRequestData.pincode}
                  selectedCampName={orgRequestData.campName}
                  onSelectCamp={(camp) => setOrgRequestData(prev => ({ ...prev, campName: camp.name, shelterName: camp.name, dropLocation: prev.dropLocation || camp.address || camp.type }))}
                  existingRequests={requests}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={orgRequestData.category}
                      onChange={(e) => setOrgRequestData({ ...orgRequestData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white font-medium outline-none"
                    >
                      {CATEGORIES.map(c => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Item Needed <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={orgRequestData.itemName}
                      onChange={(e) => setOrgRequestData({ ...orgRequestData, itemName: e.target.value })}
                      placeholder="e.g. Blankets, Clean Drinking Water, Food Packs"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Quantity Required <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={orgRequestData.quantityNeeded}
                      onChange={(e) => setOrgRequestData({ ...orgRequestData, quantityNeeded: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md font-bold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Urgency Level <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={orgRequestData.urgency}
                      onChange={(e) => setOrgRequestData({ ...orgRequestData, urgency: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white font-bold outline-none"
                    >
                      <option value="CRITICAL">CRITICAL</option>
                      <option value="HIGH">HIGH</option>
                      <option value="MODERATE">MODERATE</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Dropoff Gate / Handover Location
                    </label>
                    <input
                      type="text"
                      value={orgRequestData.dropLocation}
                      onChange={(e) => setOrgRequestData({ ...orgRequestData, dropLocation: e.target.value })}
                      placeholder="e.g. Organization Warehouse Gate 1"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Notes</label>
                  <textarea
                    rows="2"
                    value={orgRequestData.note}
                    onChange={(e) => setOrgRequestData({ ...orgRequestData, note: e.target.value })}
                    placeholder="Specific sizes, priority families, or field instructions..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowNewOrgRequestForm(false)}
                    className="px-4 py-2 border border-slate-300 rounded text-slate-700 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded flex items-center gap-1.5"
                  >
                    <Package className="w-4 h-4" />
                    <span>Submit Need</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Org's Requested Needs List & Acceptance */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Shelter Demands Posted by Your Organization</h3>
                <p className="text-slate-500">Track shipments inbound to your centers and confirm acceptance upon arrival.</p>
              </div>
              <div className="text-slate-500">
                Total Needs: <strong>{filteredOrgReceivedRequests.length}</strong>
              </div>
            </div>

            {filteredOrgReceivedRequests.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No active shelter needs posted by your organization. Click "Post New Shelter Need" above if your field units need supplies.
              </div>
            ) : (
              <div className="divide-y divide-slate-200 text-xs">
                {filteredOrgReceivedRequests.map(req => {
                  const fulfilled = req.quantityFulfilled || 0;
                  const isDispatched = req.status === 'DISPATCHED';
                  const isAccepted = req.status === 'ACCEPTED' || req.status === 'DELIVERED';

                  return (
                    <div key={req.id} className="p-5 hover:bg-slate-50/70 transition-colors space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {req.id}
                          </span>
                          <span className="font-bold text-slate-800">{req.campName || req.shelterName}</span>
                          {req.pincode && (
                            <span className="inline-flex items-center gap-1 font-mono font-bold text-[10px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-900 border border-amber-200">
                              <MapPin className="w-2.5 h-2.5 text-amber-600" />
                              <span>PIN: {req.pincode}</span>
                            </span>
                          )}
                          <span className="text-slate-500">({req.category})</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">
                            <span className="text-[10px] font-semibold text-amber-800">Status:</span>
                            <select
                              value={req.status}
                              onChange={(e) => updateRequestStatus(req.id, e.target.value)}
                              className="bg-white border border-amber-300 rounded px-1.5 py-0.5 font-bold text-slate-800 text-[10px] outline-none cursor-pointer"
                            >
                              <option value="PENDING">PENDING</option>
                              <option value="ACCEPTED">ACCEPTED</option>
                              <option value="COMPLETED">COMPLETED</option>
                              <option value="VERIFIED">VERIFIED</option>
                              <option value="DISPATCHED">DISPATCHED</option>
                            </select>
                          </div>

                          <span
                            className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                              isAccepted
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : isDispatched
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {req.status}
                          </span>

                          <button
                            onClick={() => setEditingRequest(req)}
                            className="p-1 text-slate-400 hover:text-slate-800 rounded"
                            title="Edit requirement"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRequest(req.id)}
                            className="p-1 text-slate-400 hover:text-red-700 rounded"
                            title="Delete requirement"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="text-base font-bold text-slate-900">{req.itemName}</div>
                          <div className="text-slate-500">
                            Needed: <strong>{req.quantityNeeded}</strong> • Fulfilled: <strong>{fulfilled}</strong>
                            {req.dropLocation ? ` • Gate: ${req.dropLocation}` : ''}
                          </div>
                        </div>

                        {/* In-Transit Accept Button for Org */}
                        {isDispatched && !isAccepted && (
                          <button
                            onClick={() => setDeliveryConfirmId(req.id)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-xs shadow-sm flex items-center gap-1.5 shrink-0"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Accept & Confirm Arrival</span>
                          </button>
                        )}
                      </div>

                      {/* Acceptance Dialog */}
                      {deliveryConfirmId === req.id && (
                        <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-4 space-y-3">
                          <div className="font-bold text-emerald-950 text-xs">
                            Confirm Delivery Receipt for #{req.id}
                          </div>
                          <input
                            type="text"
                            value={deliveryNote}
                            onChange={(e) => setDeliveryNote(e.target.value)}
                            placeholder="Handover note (e.g. 50 boxes received at Central Hub Store and logged to registry)"
                            className="w-full px-3 py-2 text-xs border border-emerald-300 rounded bg-white"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setDeliveryConfirmId(null)}
                              className="px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-700 text-xs"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleOrgConfirmArrival(req.id)}
                              className="px-4 py-1.5 bg-emerald-700 text-white font-bold rounded text-xs"
                            >
                              Confirm Receipt
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Accepted Banner */}
                      {isAccepted && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-xs text-emerald-900 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                            <span><strong>Accepted by Organization:</strong> {req.confirmationNote || 'Supplies received.'}</span>
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

      {/* ========================================================
          TAB 4: WAREHOUSE INVENTORY CRUD
         ======================================================== */}
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

      {/* ========================================================
          TAB 5: PLEDGES & CONVOYS
         ======================================================== */}
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
                No inbound or dispatched pledges matching criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-semibold tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Pledge ID</th>
                      <th className="py-3 px-4">Donor / Organization</th>
                      <th className="py-3 px-4">Relief Item</th>
                      <th className="py-3 px-4">Quantity</th>
                      <th className="py-3 px-4">Staging Hub / Camp</th>
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

      {/* STICKY BOTTOM DONATION TRAY FOR ORG AS DONOR */}
      {activeTab === 'donate' && totalSelectedUnits > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t-2 border-emerald-600 shadow-2xl p-4 sm:p-5">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">
                    {totalSelectedUnits} relief units selected for donation
                  </span>
                  <span className="text-[11px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">
                    {selectedItemsList.length} categories
                  </span>
                </div>
                <div className="text-xs text-slate-500 truncate max-w-xl mt-0.5">
                  {selectedItemsList.map(it => `${it.quantity}x ${it.name}`).join(', ')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setItemCounts({})}
                className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded"
              >
                Clear
              </button>

              <button
                type="button"
                onClick={() => setShowDonateModal(true)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-md shadow transition-colors flex items-center gap-2"
              >
                <Heart className="w-4 h-4 fill-current" />
                <span>Dispatch Aid ({totalSelectedUnits} units)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ORG DONATE CONFIRMATION MODAL */}
      {showDonateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden my-8">
            <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-emerald-400 fill-current" />
                <h3 className="font-bold text-sm">Confirm Organization Aid Dispatch</h3>
              </div>
              <button onClick={() => setShowDonateModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {donateSuccess ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Aid Dispatched Successfully!</h4>
                <p className="text-xs text-slate-600">
                  {totalSelectedUnits} relief items have been logged as an organization donation pledge.
                </p>
              </div>
            ) : (
              <form onSubmit={handleOrgSubmitDonation} className="p-6 space-y-4 text-xs">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
                  <div className="font-bold text-slate-800 text-xs">Selected Supplies:</div>
                  <div className="divide-y divide-slate-200 max-h-40 overflow-y-auto">
                    {selectedItemsList.map(it => (
                      <div key={it.id} className="py-1.5 flex justify-between text-xs">
                        <span>{it.name}</span>
                        <span className="font-mono font-bold text-emerald-700">{it.quantity} {it.unit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Destination Camp or Staging Hub <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={donateTargetCamp}
                    onChange={(e) => setDonateTargetCamp(e.target.value)}
                    placeholder="e.g. North Sector Relief Shelter / District Collection Hub"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Logistics / Convoy Notes</label>
                  <textarea
                    rows="2"
                    value={donateNotes}
                    onChange={(e) => setDonateNotes(e.target.value)}
                    placeholder="e.g. Dispatched via SDRF Truck #4, scheduled arrival 2 PM"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowDonateModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded text-slate-700 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded flex items-center gap-1.5"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                    <span>Confirm & Dispatch Supplies</span>
                  </button>
                </div>
              </form>
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
      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </div>
  );
}
