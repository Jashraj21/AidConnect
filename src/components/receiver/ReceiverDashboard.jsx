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
  Compass,
  ShoppingCart,
  Minus,
  Shirt,
  ShieldAlert,
  Droplets,
  Utensils,
  HeartPulse,
  BookOpen,
  Tent,
  ShoppingBag,
  ArrowRight,
  Send
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { CATEGORIES, STANDARD_ITEMS } from '../../data/initialData';
import NearbyCampsFinder from '../common/NearbyCampsFinder';
import { lookupPincode } from '../../utils/pincodeService';
import ReceiverCartModal from './ReceiverCartModal';

export default function ReceiverDashboard() {
  const { currentUser } = useAuth();
  const { requests, addRequest, updateRequest, deleteRequest, acceptRequestDelivery } = useData();

  // Active Tab: 'catalog' (Requisition Items & Cart) | 'my-needs' (Manage Active Camp Needs)
  const [activeTab, setActiveTab] = useState('catalog');

  // Single-item quick post form modal
  const [showSingleRequestModal, setShowSingleRequestModal] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [deliveryConfirmId, setDeliveryConfirmId] = useState(null);
  const [deliveryNote, setDeliveryNote] = useState('');

  // Cart State for Multiple Items Requisition
  const [cartCounts, setCartCounts] = useState({});
  const [customCartItems, setCustomCartItems] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);

  // Custom Item Modal
  const [showCustomItemModal, setShowCustomItemModal] = useState(false);
  const [customItemForm, setCustomItemForm] = useState({
    name: '',
    category: 'SHELTER_ESSENTIALS',
    quantity: 10,
    unit: 'units',
    note: ''
  });

  // Catalog Filters
  const [catalogCategory, setCatalogCategory] = useState('ALL');
  const [catalogSearchQuery, setCatalogSearchQuery] = useState('');

  // Needs List Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [urgencyFilter, setUrgencyFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Single-item quick post form state
  const [singleFormData, setSingleFormData] = useState({
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

  // Compile full cart items list
  const standardCartItems = STANDARD_ITEMS.filter(item => (cartCounts[item.id] || 0) > 0).map(item => ({
    id: item.id,
    item,
    name: item.name,
    category: item.category,
    unit: item.unit,
    quantity: cartCounts[item.id],
    description: item.description
  }));

  const allCartItems = [...standardCartItems, ...customCartItems];
  const totalCartCount = allCartItems.length;
  const totalCartUnits = allCartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Cart Increment / Decrement
  const handleIncrement = (itemId) => {
    setCartCounts(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const handleDecrement = (itemId) => {
    setCartCounts(prev => {
      const current = prev[itemId] || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[itemId];
        return next;
      }
      return {
        ...prev,
        [itemId]: current - 1
      };
    });
  };

  const handleSetQuantity = (itemId, val) => {
    const num = Math.max(0, parseInt(val, 10) || 0);
    setCartCounts(prev => {
      if (num === 0) {
        const next = { ...prev };
        delete next[itemId];
        return next;
      }
      return { ...prev, [itemId]: num };
    });
  };

  const handleUpdateCartItemQty = (itemId, newQty) => {
    if (cartCounts[itemId] !== undefined) {
      if (newQty <= 0) {
        handleRemoveCartItem(itemId);
      } else {
        setCartCounts(prev => ({ ...prev, [itemId]: newQty }));
      }
    } else {
      setCustomCartItems(prev =>
        prev.map(c => c.id === itemId ? { ...c, quantity: newQty } : c)
      );
    }
  };

  const handleRemoveCartItem = (itemId) => {
    setCartCounts(prev => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
    setCustomCartItems(prev => prev.filter(c => c.id !== itemId));
  };

  const handleClearCart = () => {
    setCartCounts({});
    setCustomCartItems([]);
  };

  const handleAddCustomItem = (e) => {
    e.preventDefault();
    if (!customItemForm.name.trim()) return;

    const newItem = {
      id: `custom-${Date.now()}`,
      name: customItemForm.name.trim(),
      category: customItemForm.category,
      quantity: parseInt(customItemForm.quantity, 10) || 1,
      unit: customItemForm.unit || 'units',
      note: customItemForm.note || '',
      isCustom: true
    };

    setCustomCartItems(prev => [newItem, ...prev]);
    setShowCustomItemModal(false);
    setCustomItemForm({
      name: '',
      category: 'SHELTER_ESSENTIALS',
      quantity: 10,
      unit: 'units',
      note: ''
    });
  };

  // Filtered standard items for Catalog
  const filteredCatalogItems = STANDARD_ITEMS.filter(item => {
    if (catalogCategory !== 'ALL' && item.category !== catalogCategory) return false;
    if (catalogSearchQuery.trim()) {
      const q = catalogSearchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }
    return true;
  });

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

  // Single-item Request Handler
  const handleSingleCreateRequest = (e) => {
    e.preventDefault();
    if (!singleFormData.itemName.trim()) return;

    let resolvedCamp = (singleFormData.campName || '').trim();
    if (!resolvedCamp && singleFormData.pincode) {
      const match = lookupPincode(singleFormData.pincode, requests);
      resolvedCamp = match?.primaryCamp?.name || currentUser?.campName || `Shelter (PIN ${singleFormData.pincode})`;
    }

    addRequest({
      zoneName: currentUser?.zoneName || 'Affected Zone',
      campName: resolvedCamp || currentUser?.campName || currentUser?.shelterName || 'Relief Camp / Shelter',
      shelterName: resolvedCamp || currentUser?.shelterName || currentUser?.campName || 'Relief Camp / Shelter',
      pincode: singleFormData.pincode || currentUser?.pincode || '',
      requesterName: currentUser?.name || 'Camp Representative',
      requesterRole: currentUser?.designation || 'Camp Coordinator',
      requesterPhone: currentUser?.phone || '',
      peopleCount: parseInt(singleFormData.peopleCount, 10) || 0,
      category: singleFormData.category,
      itemName: singleFormData.itemName,
      quantityNeeded: parseInt(singleFormData.quantityNeeded, 10) || 1,
      urgency: singleFormData.urgency,
      note: singleFormData.note,
      dropLocation: singleFormData.dropLocation || currentUser?.location || 'Camp Main Gate'
    });

    setSingleFormData({
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
    setShowSingleRequestModal(false);
    setActiveTab('my-needs');
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

  const getItemIcon = (category) => {
    switch (category) {
      case 'CLOTHES': return <Shirt className="w-5 h-5 text-indigo-600" />;
      case 'HYGIENE': return <ShieldAlert className="w-5 h-5 text-teal-600" />;
      case 'WATER': return <Droplets className="w-5 h-5 text-blue-600" />;
      case 'FOOD': return <Utensils className="w-5 h-5 text-amber-600" />;
      case 'MEDICINE': return <HeartPulse className="w-5 h-5 text-rose-600" />;
      case 'BOOKS': return <BookOpen className="w-5 h-5 text-violet-600" />;
      default: return <Tent className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6 pb-36">
      {/* Camp Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
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

          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            {totalCartCount > 0 && (
              <button
                onClick={() => setShowCartModal(true)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-md shadow-sm transition-colors flex items-center gap-2 ring-2 ring-amber-400/40"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>View Cart ({totalCartCount} items)</span>
              </button>
            )}

            <button
              onClick={() => setShowSingleRequestModal(true)}
              className="px-3 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Single Need Form</span>
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

      {/* PRIMARY NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 ${
            activeTab === 'catalog'
              ? 'bg-white border-t-2 border-x border-amber-600 text-amber-900 -mb-px'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ShoppingCart className="w-4 h-4 text-amber-600" />
          <span>Add Multiple Items via Cart</span>
          {totalCartCount > 0 && (
            <span className="bg-amber-600 text-white font-mono text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {totalCartCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('my-needs')}
          className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 ${
            activeTab === 'my-needs'
              ? 'bg-white border-t-2 border-x border-amber-600 text-amber-900 -mb-px'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileCheck2 className="w-4 h-4 text-slate-600" />
          <span>Active Camp Needs & Deliveries</span>
          <span className="bg-slate-200 text-slate-800 font-mono text-[10px] px-1.5 py-0.2 rounded-full font-bold">
            {totalNeeds}
          </span>
        </button>
      </div>

      {/* TAB 1: ADD MULTIPLE ITEMS VIA CART (CATALOG WITH + / -) */}
      {activeTab === 'catalog' && (
        <div className="space-y-5">
          {/* Action & Filter Toolbar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3 text-xs">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={catalogSearchQuery}
                  onChange={(e) => setCatalogSearchQuery(e.target.value)}
                  placeholder="Search necessities (clothes, pads, water, food, medicines, blankets)..."
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <button
                  onClick={() => setShowCustomItemModal(true)}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded text-xs transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Custom Item to Cart</span>
                </button>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-slate-100">
              <button
                onClick={() => setCatalogCategory('ALL')}
                className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-colors ${
                  catalogCategory === 'ALL'
                    ? 'bg-amber-800 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Survival Items
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCatalogCategory(cat.id)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-colors ${
                    catalogCategory === cat.id
                      ? 'bg-amber-800 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Standard Items Grid with Graphical + / - Stepper */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCatalogItems.map(item => {
              const count = cartCounts[item.id] || 0;
              const isSelected = count > 0;

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl border p-5 shadow-sm transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-500 ring-2 ring-amber-400/30 shadow-md bg-amber-50/10'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Top Row: Icon + Stepper */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                            isSelected ? 'bg-amber-50 border-amber-300' : 'bg-slate-100 border-slate-200'
                          }`}
                        >
                          {getItemIcon(item.category)}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-base leading-tight">{item.name}</h3>
                          <span className="text-[11px] text-slate-500 font-medium">
                            Unit: {item.unit}
                          </span>
                        </div>
                      </div>

                      {/* Graphic Stepper: Minus, Count, Plus */}
                      <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-300 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleDecrement(item.id)}
                          disabled={count === 0}
                          className="w-8 h-8 rounded bg-white hover:bg-slate-200 text-slate-800 disabled:opacity-30 disabled:hover:bg-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                          title="Reduce quantity (-)"
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
                          className="w-8 h-8 rounded bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                          title="Add quantity (+)"
                        >
                          <Plus className="w-4 h-4 stroke-[3]" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Card bottom indicator */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">
                      {count > 0 ? (
                        <span className="text-amber-800 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>{count} {item.unit} in requisition cart</span>
                        </span>
                      ) : (
                        <span>Use + / − to request this item</span>
                      )}
                    </span>

                    {count > 0 && (
                      <button
                        onClick={() => setShowCartModal(true)}
                        className="text-amber-800 hover:underline font-bold text-xs"
                      >
                        Review cart →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE CAMP NEEDS & DELIVERIES */}
      {activeTab === 'my-needs' && (
        <div className="space-y-4">
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

          {/* REQUESTS LIST */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Relief Demands & Delivery Lifecycle</h2>
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
                <p>Switch to the "Requisition Items via Cart" tab to add requirements with + and − buttons.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {displayedRequests.map(req => {
                  const fulfilled = req.quantityFulfilled || 0;
                  const isDispatched = req.status === 'DISPATCHED';
                  const isAccepted = req.status === 'ACCEPTED' || req.status === 'DELIVERED';

                  return (
                    <div key={req.id} className="p-5 hover:bg-slate-50/70 transition-colors space-y-4 text-xs">
                      {/* Top Header */}
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

                      {/* Main Info */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <h3 className="font-bold text-slate-900 text-base">{req.itemName}</h3>
                          {req.note && <p className="text-xs text-slate-600 italic">"{req.note}"</p>}
                          <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-600 pt-1">
                            <span className="font-semibold text-slate-900">
                              {req.campName || req.shelterName || 'Relief Camp'}
                            </span>
                            {req.pincode && (
                              <span className="font-mono bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.2 rounded text-[11px] font-bold">
                                PIN: {req.pincode}
                              </span>
                            )}
                            {req.dropLocation && (
                              <span className="text-slate-500 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                <span>{req.dropLocation}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity Counter */}
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 min-w-[200px] space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Needed:</span>
                            <span className="font-bold text-slate-900">{req.quantityNeeded}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Pledged / Dispatched:</span>
                            <span className="font-bold text-emerald-700">{fulfilled}</span>
                          </div>
                          <div className="flex justify-between border-t border-slate-200 pt-1">
                            <span className="text-slate-500">Remaining Shortage:</span>
                            <span className="font-bold text-red-700">{Math.max(0, req.quantityNeeded - fulfilled)}</span>
                          </div>
                        </div>
                      </div>

                      {/* In-Transit Acceptance Banner */}
                      {isDispatched && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Truck className="w-4 h-4 text-blue-700 animate-bounce" />
                              <span className="font-bold text-blue-900">
                                Relief Convoy Dispatched & En Route to Camp Gate
                              </span>
                            </div>
                            <button
                              onClick={() => setDeliveryConfirmId(req.id)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow-sm flex items-center gap-1.5"
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Accept & Confirm Arrival</span>
                            </button>
                          </div>

                          {deliveryConfirmId === req.id && (
                            <div className="pt-2 border-t border-blue-200 space-y-2">
                              <input
                                type="text"
                                value={deliveryNote}
                                onChange={(e) => setDeliveryNote(e.target.value)}
                                placeholder="Handover confirmation note (e.g. Received at Gate 2 and logged into stores)"
                                className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs outline-none bg-white font-medium"
                              />
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => setDeliveryConfirmId(null)}
                                  className="px-3 py-1 border border-slate-300 rounded text-slate-600 hover:bg-slate-50"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleConfirmReceived(req.id)}
                                  className="px-4 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded"
                                >
                                  Confirm & Issue Receipt
                                </button>
                              </div>
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
      )}

      {/* FLOATING REQUISITION CART BAR (When receiver has items added) */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-5xl mx-auto z-40 bg-slate-900 text-white rounded-xl shadow-2xl p-4 border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm flex items-center gap-2">
                <span>Receiver Requisition Cart:</span>
                <span className="bg-amber-500 text-slate-900 px-2 py-0.2 rounded font-mono font-bold text-xs">
                  {totalCartCount} items ({totalCartUnits} total units)
                </span>
              </div>
              <div className="text-[11px] text-slate-300 flex items-center gap-2 flex-wrap">
                {allCartItems.slice(0, 4).map(ci => (
                  <span key={ci.id} className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                    {ci.quantity} × {ci.name}
                  </span>
                ))}
                {allCartItems.length > 4 && <span>+{allCartItems.length - 4} more</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={handleClearCart}
              className="px-3 py-2 text-slate-400 hover:text-white text-xs font-semibold hover:underline"
            >
              Clear Cart
            </button>
            <button
              onClick={() => setShowCartModal(true)}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-md transition-colors flex items-center gap-2 text-xs"
            >
              <span>Review & Submit Requisition ({totalCartCount} items)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* REQUISITION CART MODAL */}
      {showCartModal && (
        <ReceiverCartModal
          cartItems={allCartItems}
          onClose={() => setShowCartModal(false)}
          onUpdateQuantity={handleUpdateCartItemQty}
          onRemoveItem={handleRemoveCartItem}
          onClearCart={handleClearCart}
          currentUser={currentUser}
          onSubmitSuccess={() => {
            setShowCartModal(false);
            setActiveTab('my-needs');
          }}
        />
      )}

      {/* ADD CUSTOM ITEM MODAL */}
      {showCustomItemModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden text-xs">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Add Custom Necessity to Cart</h3>
              <button onClick={() => setShowCustomItemModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomItem} className="p-5 space-y-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Item Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customItemForm.name}
                  onChange={(e) => setCustomItemForm({ ...customItemForm, name: e.target.value })}
                  placeholder="e.g. Diabetic Insulin Kit, Infant Milk Formula"
                  className="w-full px-3 py-2 border border-slate-300 rounded outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={customItemForm.category}
                    onChange={(e) => setCustomItemForm({ ...customItemForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded bg-white outline-none"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Unit of Measure</label>
                  <input
                    type="text"
                    value={customItemForm.unit}
                    onChange={(e) => setCustomItemForm({ ...customItemForm, unit: e.target.value })}
                    placeholder="e.g. cans, boxes, kits"
                    className="w-full px-3 py-2 border border-slate-300 rounded outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Quantity Needed</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={customItemForm.quantity}
                  onChange={(e) => setCustomItemForm({ ...customItemForm, quantity: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded outline-none font-bold"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Note (Optional)</label>
                <input
                  type="text"
                  value={customItemForm.note}
                  onChange={(e) => setCustomItemForm({ ...customItemForm, note: e.target.value })}
                  placeholder="e.g. specifically for infants under 1 year"
                  className="w-full px-3 py-2 border border-slate-300 rounded outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCustomItemModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded"
                >
                  Add to Requisition Cart
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SINGLE REQUEST QUICK POST MODAL */}
      {showSingleRequestModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden text-xs">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Post Single Camp Need</h3>
              <button onClick={() => setShowSingleRequestModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSingleCreateRequest} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Postal PIN Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength="6"
                    pattern="[0-9]{6}"
                    value={singleFormData.pincode}
                    onChange={(e) => setSingleFormData({ ...singleFormData, pincode: e.target.value.replace(/\D/g, '') })}
                    placeholder="e.g. 682001"
                    className="w-full px-3 py-2 border-2 border-amber-300 rounded font-mono font-bold outline-none bg-amber-50/20"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Shelter Name <span className="text-slate-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={singleFormData.campName}
                    onChange={(e) => setSingleFormData({ ...singleFormData, campName: e.target.value, shelterName: e.target.value })}
                    placeholder="Auto-detected or custom"
                    className="w-full px-3 py-2 border border-slate-300 rounded outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Item Description <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={singleFormData.itemName}
                  onChange={(e) => setSingleFormData({ ...singleFormData, itemName: e.target.value })}
                  placeholder="e.g. Water Bottles, Blankets"
                  className="w-full px-3 py-2 border border-slate-300 rounded outline-none font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={singleFormData.category}
                    onChange={(e) => setSingleFormData({ ...singleFormData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded bg-white outline-none"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={singleFormData.quantityNeeded}
                    onChange={(e) => setSingleFormData({ ...singleFormData, quantityNeeded: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded outline-none font-bold"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSingleRequestModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded"
                >
                  Post Need
                </button>
              </div>
            </form>
          </div>
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
                  <label className="block font-semibold text-slate-700 mb-1">Item Description</label>
                  <input
                    type="text"
                    required
                    value={editingRequest.itemName}
                    onChange={(e) => setEditingRequest({ ...editingRequest, itemName: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={editingRequest.category}
                    onChange={(e) => setEditingRequest({ ...editingRequest, category: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none bg-white font-medium"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
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
                  <label className="block font-semibold text-slate-700 mb-1">Urgency</label>
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
    </div>
  );
}
