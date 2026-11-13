import React, { useState } from 'react';
import {
  Heart,
  Package,
  Building2,
  Droplets,
  Shirt,
  Utensils,
  HeartPulse,
  BookOpen,
  Tent,
  ShieldAlert,
  Plus,
  Minus,
  Check,
  X,
  Truck,
  MapPin,
  ShoppingBag,
  ArrowRight,
  Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { CATEGORIES, STANDARD_ITEMS } from '../data/initialData';

export default function UnifiedHub() {
  const { currentUser, setActiveView } = useAuth();
  const { requests, pledges, addRequest, addPledge } = useData();

  // Mode: 'donor' | 'receiver' | 'organization'
  const [activeRoleTab, setActiveRoleTab] = useState(
    currentUser?.role === 'DONOR'
      ? 'donor'
      : currentUser?.role === 'RECEIVER'
      ? 'receiver'
      : currentUser?.role === 'ORGANIZATION'
      ? 'organization'
      : 'donor'
  );

  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Graphical item selection state: { [itemId]: count }
  const [itemCounts, setItemCounts] = useState({});

  // Batch donation checkout modal
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchSuccess, setBatchSuccess] = useState(false);

  // Form states for checkout
  const [donorName, setDonorName] = useState(currentUser?.name || '');
  const [donorContact, setDonorContact] = useState(currentUser?.phone || currentUser?.email || '');
  const [dropoffHub, setDropoffHub] = useState('');
  const [donorNotes, setDonorNotes] = useState('');

  // Single item request modal (for receiver)
  const [requestTargetItem, setRequestTargetItem] = useState(null);
  const [requestQuantity, setRequestQuantity] = useState(20);
  const [requestCampName, setRequestCampName] = useState(currentUser?.campName || '');
  const [requestContact, setRequestContact] = useState(currentUser?.phone || '');
  const [requestUrgency, setRequestUrgency] = useState('HIGH');
  const [requestSuccess, setRequestSuccess] = useState(false);

  // Increment item count
  const handleIncrement = (itemId) => {
    setItemCounts(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  // Decrement item count
  const handleDecrement = (itemId) => {
    setItemCounts(prev => {
      const current = prev[itemId] || 0;
      if (current <= 1) {
        const updated = { ...prev };
        delete updated[itemId];
        return updated;
      }
      return {
        ...prev,
        [itemId]: current - 1
      };
    });
  };

  // Direct manual quantity set
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

  // Selected items list
  const selectedItemsList = Object.entries(itemCounts)
    .map(([id, qty]) => {
      const itemDef = STANDARD_ITEMS.find(it => it.id === id);
      return itemDef ? { ...itemDef, quantity: qty } : null;
    })
    .filter(Boolean);

  const totalSelectedUnits = selectedItemsList.reduce((sum, it) => sum + it.quantity, 0);

  // Submit batch donation
  const handleBatchDonationSubmit = (e) => {
    e.preventDefault();
    if (selectedItemsList.length === 0) return;

    selectedItemsList.forEach(sel => {
      addPledge({
        requestId: `GEN-${sel.id}`,
        donorName: donorName || 'Kind Donor',
        donorEmail: donorContact.includes('@') ? donorContact : '',
        donorPhone: !donorContact.includes('@') ? donorContact : '',
        itemName: sel.name,
        quantity: sel.quantity,
        deliveryMethod: 'DROPOFF_AT_HUB',
        dropoffHub: dropoffHub || 'Regional Relief Hub',
        trackingNotes: donorNotes || `Donated via Graphical Hub`
      });
    });

    setBatchSuccess(true);
    setTimeout(() => {
      setItemCounts({});
      setShowBatchModal(false);
      setBatchSuccess(false);
    }, 2000);
  };

  // Submit Receiver single request
  const handleSingleRequestSubmit = (e) => {
    e.preventDefault();
    if (!requestTargetItem) return;

    addRequest({
      zoneName: 'Affected Calamity Zone',
      campName: requestCampName || 'Relief Camp',
      requesterName: currentUser?.name || 'Camp Representative',
      requesterRole: 'Camp Lead',
      requesterPhone: requestContact,
      peopleCount: 50,
      category: requestTargetItem.category,
      itemName: requestTargetItem.name,
      quantityNeeded: parseInt(requestQuantity, 10) || 1,
      urgency: requestUrgency,
      note: `Requested via unified hub`,
      dropLocation: 'Camp Entrance'
    });

    setRequestSuccess(true);
    setTimeout(() => {
      setRequestTargetItem(null);
      setRequestSuccess(false);
    }, 1800);
  };

  // Filtered items
  const filteredItems = STANDARD_ITEMS.filter(item => {
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8 pb-32">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Direct Graphical Supply Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Supply Donation & Needs Exchange
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            Use the <strong>+</strong> and <strong>−</strong> controls beside each item to add or remove quantities you want to donate or request.
          </p>
        </div>

        {/* 3 User Perspective Switcher */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-200">
          <button
            onClick={() => setActiveRoleTab('donor')}
            className={`p-3.5 rounded-lg border text-left transition-all ${
              activeRoleTab === 'donor'
                ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-600'
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              <Heart className="w-4 h-4 text-emerald-600 fill-current" />
              <span>Donor Mode</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Add quantities with <strong>+</strong> to pledge clothes, water, food & items.
            </p>
          </button>

          <button
            onClick={() => setActiveRoleTab('receiver')}
            className={`p-3.5 rounded-lg border text-left transition-all ${
              activeRoleTab === 'receiver'
                ? 'border-amber-600 bg-amber-50 text-amber-950 ring-1 ring-amber-600'
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              <Package className="w-4 h-4 text-amber-600" />
              <span>Receiver / Camp Mode</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Submit requirements needed for families sheltering at your camp.
            </p>
          </button>

          <button
            onClick={() => setActiveRoleTab('organization')}
            className={`p-3.5 rounded-lg border text-left transition-all ${
              activeRoleTab === 'organization'
                ? 'border-blue-600 bg-blue-50 text-blue-950 ring-1 ring-blue-600'
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Helping Organization (Dual: Donate & Receive)</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Donate bulk supplies to camps with <strong>+</strong> or <strong>Request</strong> needs for your shelters.
            </p>
          </button>
        </div>
      </div>

      {/* Search and Category Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search relief supplies (shirt, pant, pads, water bottles, fruits, medicines, books, blankets)..."
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 outline-none"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-slate-100">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3.5 py-1.5 rounded-full font-semibold transition-colors shrink-0 ${
              selectedCategory === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            All Items ({STANDARD_ITEMS.length})
          </button>

          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-colors shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* GRAPHICAL ITEMS GRID WITH PLUS/MINUS SYMBOLS NEAR ICON */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map(item => {
          const count = itemCounts[item.id] || 0;
          const isSelected = count > 0;

          // Live counts from recorded data
          const itemReqs = requests.filter(r =>
            r.itemName.toLowerCase().includes(item.name.toLowerCase()) || r.category === item.category
          );
          const totalRequested = itemReqs.reduce((sum, r) => sum + r.quantityNeeded, 0);

          const itemPledges = pledges.filter(p =>
            p.itemName.toLowerCase().includes(item.name.toLowerCase())
          );
          const totalPledged = itemPledges.reduce((sum, p) => sum + p.quantity, 0);

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
                {/* Top Row: Icon + Graphical Stepper (+ / -) */}
                <div className="flex items-center justify-between gap-3">
                  {/* Left: Graphic Icon & Details */}
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
                      <span className="text-[11px] text-slate-500 font-medium">
                        Unit: {item.unit}
                      </span>
                    </div>
                  </div>

                  {/* Right: Graphic Stepper (+ / -) & Request Controls */}
                  {(activeRoleTab === 'donor' || activeRoleTab === 'organization') && (
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-300">
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
                          title="Donate one (+)"
                        >
                          <Plus className="w-4 h-4 stroke-[3]" />
                        </button>
                      </div>

                      {activeRoleTab === 'organization' && (
                        <button
                          onClick={() => setRequestTargetItem(item)}
                          className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded shadow-sm flex items-center gap-1 transition-colors"
                          title="Post request for this item for your shelter"
                        >
                          <Package className="w-3.5 h-3.5" />
                          <span>Request</span>
                        </button>
                      )}
                    </div>
                  )}

                  {activeRoleTab === 'receiver' && (
                    <button
                      onClick={() => setRequestTargetItem(item)}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded shadow-sm flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Request</span>
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>

                {/* Live Demand vs Pledges Metrics */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Total Requested:</span>
                    <div className="font-bold text-red-700 text-sm mt-0.5">
                      {totalRequested} {item.unit}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Total Pledged:</span>
                    <div className="font-bold text-emerald-700 text-sm mt-0.5">
                      {totalPledged} {item.unit}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                {(activeRoleTab === 'donor' || activeRoleTab === 'organization') && (
                  <>
                    <span className="text-slate-500 font-medium">
                      {count > 0 ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>{count} {item.unit} selected to donate</span>
                        </span>
                      ) : (
                        <span>{activeRoleTab === 'organization' ? 'Use + to donate or Request button' : 'Use + to add to donation'}</span>
                      )}
                    </span>

                    {count > 0 && (
                      <button
                        onClick={() => setShowBatchModal(true)}
                        className="text-emerald-700 hover:underline font-bold text-xs"
                      >
                        Donate now →
                      </button>
                    )}
                  </>
                )}

                {activeRoleTab === 'receiver' && (
                  <span className="text-slate-500">
                    Click 'Request' to post shelter need
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* STICKY BOTTOM DONATION SUMMARY TRAY FOR DONORS & ORGANIZATIONS */}
      {(activeRoleTab === 'donor' || activeRoleTab === 'organization') && totalSelectedUnits > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t-2 border-emerald-600 shadow-2xl p-4 sm:p-5">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">
                    {totalSelectedUnits} items selected for donation
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
                onClick={() => setShowBatchModal(true)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-md shadow transition-colors flex items-center gap-2"
              >
                <Heart className="w-4 h-4 fill-current" />
                <span>Confirm & Pledge ({totalSelectedUnits} items)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BATCH DONATION CONFIRMATION MODAL */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden my-8">
            <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-emerald-400 fill-current" />
                <h3 className="font-bold text-sm">Confirm Relief Supply Donation</h3>
              </div>
              <button
                onClick={() => setShowBatchModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {batchSuccess ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Pledges Confirmed & Logged!</h4>
                <p className="text-xs text-slate-600">
                  Your selected items have been added to the relief ledger for on-ground distribution.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBatchDonationSubmit} className="p-6 space-y-4 text-xs">
                {/* List of selected items */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
                  <div className="font-bold text-slate-800 text-xs">Selected Items Package:</div>
                  <div className="divide-y divide-slate-200 max-h-48 overflow-y-auto pr-1">
                    {selectedItemsList.map(it => (
                      <div key={it.id} className="py-1.5 flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800">{it.name}</span>
                        <span className="font-mono font-bold text-emerald-700">{it.quantity} {it.unit}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-900">
                    <span>Total Items:</span>
                    <span>{totalSelectedUnits} units</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Donor Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Phone or Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={donorContact}
                      onChange={(e) => setDonorContact(e.target.value)}
                      placeholder="Contact details"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Drop-off Staging Hub or Your City
                  </label>
                  <input
                    type="text"
                    value={dropoffHub}
                    onChange={(e) => setDropoffHub(e.target.value)}
                    placeholder="e.g. Nearest Collection Center / Courier"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Logistics / Packaging Notes
                  </label>
                  <input
                    type="text"
                    value={donorNotes}
                    onChange={(e) => setDonorNotes(e.target.value)}
                    placeholder="e.g. Cleanly packed in 2 boxes"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowBatchModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded text-slate-700 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow-sm"
                  >
                    Confirm Pledge ({totalSelectedUnits} items)
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* SINGLE ITEM REQUEST MODAL FOR RECEIVER */}
      {requestTargetItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden">
            <div className="bg-amber-700 text-white p-4 px-6 flex items-center justify-between">
              <h3 className="font-bold text-sm">Request {requestTargetItem.name}</h3>
              <button onClick={() => setRequestTargetItem(null)} className="text-white">✕</button>
            </div>

            {requestSuccess ? (
              <div className="p-8 text-center space-y-2">
                <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Request Submitted</h4>
                <p className="text-xs text-slate-500">
                  Your need for {requestQuantity} {requestTargetItem.unit} of {requestTargetItem.name} has been broadcasted.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSingleRequestSubmit} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Quantity Required ({requestTargetItem.unit}) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={requestQuantity}
                    onChange={(e) => setRequestQuantity(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Relief Camp / Shelter Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={requestCampName}
                    onChange={(e) => setRequestCampName(e.target.value)}
                    placeholder="Camp name"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Contact Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={requestContact}
                    onChange={(e) => setRequestContact(e.target.value)}
                    placeholder="Phone number"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Urgency</label>
                  <select
                    value={requestUrgency}
                    onChange={(e) => setRequestUrgency(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none bg-white font-bold"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MODERATE">MODERATE</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setRequestTargetItem(null)}
                    className="px-4 py-2 border border-slate-300 rounded text-slate-700 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded shadow-sm"
                  >
                    Submit Requisition
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
