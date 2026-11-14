import React, { useState } from 'react';
import {
  Heart,
  Droplets,
  Shirt,
  Utensils,
  HeartPulse,
  BookOpen,
  Tent,
  ShieldAlert,
  Package,
  Plus,
  Minus,
  Check,
  PackageCheck,
  ShoppingBag,
  ArrowRight,
  Search,
  Edit2,
  Trash2,
  X,
  MapPin,
  Clock,
  CheckCircle2,
  Truck,
  IndianRupee,
  Receipt,
  FileText,
  ShieldCheck,
  Download,
  Phone,
  MessageSquare,
  Camera,
  Eye,
  Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { CATEGORIES, STANDARD_ITEMS } from '../../data/initialData';
import PledgeModal from './PledgeModal';
import MoneyDonationModal from './MoneyDonationModal';
import DirectReceiverContactModal from '../common/DirectReceiverContactModal';
import ProfileEditModal from '../common/ProfileEditModal';
import GoodsPhotoUploader from '../common/GoodsPhotoUploader';

export default function DonorDashboard() {
  const { currentUser } = useAuth();
  const {
    requests,
    pledges,
    addPledge,
    updatePledge,
    deletePledge,
    monetaryDonations = [],
    totalMonetaryFunds = 0
  } = useData();

  const [activeTab, setActiveTab] = useState('donate'); // 'donate' | 'camp-requests' | 'my-pledges' | 'financial-relief'
  const [showMoneyModal, setShowMoneyModal] = useState(false);
  const [viewingReceipt, setViewingReceipt] = useState(null);
  const [targetCampForMoney, setTargetCampForMoney] = useState(null);
  const [directContactData, setDirectContactData] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [itemSearchQuery, setItemSearchQuery] = useState('');

  // Camp requests search in donor dashboard
  const [campSearchQuery, setCampSearchQuery] = useState('');
  const [campCategoryFilter, setCampCategoryFilter] = useState('ALL');
  const [pledgeTargetRequest, setPledgeTargetRequest] = useState(null);

  // My pledges search & editing
  const [pledgeSearchQuery, setPledgeSearchQuery] = useState('');
  const [editingPledge, setEditingPledge] = useState(null);

  // Graphical item selection state: { [itemId]: count }
  const [itemCounts, setItemCounts] = useState({});

  // Checkout modal
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Photos of goods state
  const [goodsPhotos, setGoodsPhotos] = useState([]);
  const [previewLightboxPhoto, setPreviewLightboxPhoto] = useState(null);
  const [quickPhotoPledge, setQuickPhotoPledge] = useState(null);

  // Form states
  const [donorName, setDonorName] = useState(currentUser?.name || '');
  const [donorContact, setDonorContact] = useState(currentUser?.phone || currentUser?.email || '');
  const [dropoffHub, setDropoffHub] = useState('');
  const [donorNotes, setDonorNotes] = useState('');

  // Increment item
  const handleIncrement = (itemId) => {
    setItemCounts(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  // Decrement item
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

  // Direct manual quantity edit
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

  // Submit donation package
  const handleConfirmDonation = (e) => {
    e.preventDefault();
    if (selectedItemsList.length === 0) return;

    selectedItemsList.forEach(sel => {
      addPledge({
        requestId: `GEN-${sel.id}`,
        donorName: donorName || currentUser?.name || 'Kind Donor',
        donorEmail: donorContact.includes('@') ? donorContact : (currentUser?.email || ''),
        donorPhone: !donorContact.includes('@') ? donorContact : (currentUser?.phone || ''),
        itemName: sel.name,
        quantity: sel.quantity,
        deliveryMethod: 'DROPOFF_AT_HUB',
        dropoffHub: dropoffHub || 'Nearest Community Relief Center',
        photos: goodsPhotos,
        trackingNotes: donorNotes || 'Direct graphical donation pledge'
      });
    });

    setCheckoutSuccess(true);
    setTimeout(() => {
      setItemCounts({});
      setGoodsPhotos([]);
      setShowCheckoutModal(false);
      setCheckoutSuccess(false);
      setActiveTab('my-pledges');
    }, 1800);
  };

  // Update pledge handler
  const handleUpdatePledge = (e) => {
    e.preventDefault();
    if (!editingPledge) return;
    updatePledge(editingPledge.id, {
      quantity: parseInt(editingPledge.quantity, 10) || 1,
      dropoffHub: editingPledge.dropoffHub,
      deliveryMethod: editingPledge.deliveryMethod,
      photos: editingPledge.photos || [],
      trackingNotes: editingPledge.trackingNotes
    });
    setEditingPledge(null);
  };

  // Delete / cancel pledge handler
  const handleDeletePledge = (pledgeId) => {
    if (window.confirm(`Are you sure you want to cancel pledge #${pledgeId}?`)) {
      deletePledge(pledgeId);
    }
  };

  // User's own pledges
  const myPledges = pledges.filter(p => {
    if (!currentUser) return true;
    return (
      (currentUser.email && p.donorEmail?.toLowerCase() === currentUser.email?.toLowerCase()) ||
      (currentUser.name && p.donorName?.toLowerCase() === currentUser.name?.toLowerCase()) ||
      (!currentUser.email && !currentUser.name)
    );
  });

  const totalItemsPledged = myPledges.reduce((sum, p) => sum + (p.quantity || 0), 0);
  const acceptedPledgesCount = myPledges.filter(p => p.status === 'ACCEPTED' || p.status === 'DISTRIBUTED').length;

  // User's own monetary donations
  const myMonetaryDonations = monetaryDonations.filter(m => {
    if (!currentUser) return true;
    return (
      (currentUser.email && m.donorEmail?.toLowerCase() === currentUser.email?.toLowerCase()) ||
      (currentUser.phone && m.donorPhone === currentUser.phone) ||
      (currentUser.name && m.donorName?.toLowerCase() === currentUser.name?.toLowerCase()) ||
      (!currentUser.email && !currentUser.phone && !currentUser.name)
    );
  });

  const myMonetaryTotal = myMonetaryDonations.reduce((sum, m) => sum + (m.amount || 0), 0);

  // Filtered standard items for the graphical interface
  const filteredItems = STANDARD_ITEMS.filter(item => {
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
    if (itemSearchQuery.trim()) {
      const q = itemSearchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }
    return true;
  });

  // Filtered camp requests
  const filteredCampRequests = requests.filter(req => {
    if (campCategoryFilter !== 'ALL' && req.category !== campCategoryFilter) return false;
    if (campSearchQuery.trim()) {
      const q = campSearchQuery.toLowerCase();
      const matchItem = req.itemName.toLowerCase().includes(q);
      const matchCamp = (req.campName || '').toLowerCase().includes(q);
      const matchShelter = (req.shelterName || '').toLowerCase().includes(q);
      const matchPin = (req.pincode || '').includes(q);
      const matchNote = (req.note || '').toLowerCase().includes(q);
      if (!matchItem && !matchCamp && !matchShelter && !matchPin && !matchNote) return false;
    }
    return true;
  });

  // Filtered my pledges
  const filteredMyPledges = myPledges.filter(p => {
    if (pledgeSearchQuery.trim()) {
      const q = pledgeSearchQuery.toLowerCase();
      const matchId = p.id.toLowerCase().includes(q);
      const matchItem = p.itemName.toLowerCase().includes(q);
      const matchHub = (p.dropoffHub || '').toLowerCase().includes(q);
      if (!matchId && !matchItem && !matchHub) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6 pb-36">
      {/* Donor Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">
                  Welcome, {currentUser?.name || 'Supporter'}
                </h1>
                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Donor Portal
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <p className="text-xs text-slate-500">
                  Direct disaster basic needs donation platform {currentUser?.city ? `• ${currentUser.city}` : ''}
                </p>
                <button
                  type="button"
                  onClick={() => setShowProfileModal(true)}
                  className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold underline"
                >
                  Manage Profile
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
            <div className="text-center px-3 py-1 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-lg font-bold text-slate-900">{myPledges.length}</div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">My Pledges</div>
            </div>
            <div className="text-center px-3 py-1 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-lg font-bold text-emerald-700">{totalItemsPledged}</div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Items Pledged</div>
            </div>
            <div className="text-center px-3 py-1 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-lg font-bold text-blue-700">{acceptedPledgesCount}</div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Delivered</div>
            </div>
            <div className="text-center px-3 py-1 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="text-lg font-bold text-emerald-800">₹{myMonetaryTotal.toLocaleString('en-IN')}</div>
              <div className="text-[10px] text-emerald-600 uppercase font-semibold">Funds Donated</div>
            </div>

            <button
              onClick={() => {
                setTargetCampForMoney(null);
                setShowMoneyModal(true);
              }}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors shrink-0"
            >
              <IndianRupee className="w-4 h-4" />
              <span>Donate Money</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('donate')}
            className={`px-4 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'donate'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Select Items to Donate ({STANDARD_ITEMS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('financial-relief')}
            className={`px-4 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'financial-relief'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <IndianRupee className="w-3.5 h-3.5" />
            <span>Financial Relief Aid (₹{myMonetaryTotal > 0 ? myMonetaryTotal.toLocaleString('en-IN') : '80G Tax Free'})</span>
          </button>

          <button
            onClick={() => setActiveTab('camp-requests')}
            className={`px-4 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'camp-requests'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Browse Camp Urgent Needs ({requests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('my-pledges')}
            className={`px-4 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'my-pledges'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <PackageCheck className="w-3.5 h-3.5" />
            <span>My Pledges ({myPledges.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: GRAPHICAL DONATION INTERFACE WITH PLUS/MINUS SYMBOLS */}
      {activeTab === 'donate' && (
        <div className="space-y-6">
          {/* Instructions banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold">Graphical Item Selection:</span> Click the <strong>+</strong> symbol next to any item icon to add items, or <strong>−</strong> to remove.
            </div>
            {totalSelectedUnits > 0 && (
              <span className="font-bold bg-emerald-600 text-white px-2.5 py-1 rounded text-xs shrink-0 self-start sm:self-auto">
                {totalSelectedUnits} items selected in tray
              </span>
            )}
          </div>

          {/* Search & Category Filter Toolbar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3 text-xs">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={itemSearchQuery}
                onChange={(e) => setItemSearchQuery(e.target.value)}
                placeholder="Search items to donate (e.g. shirt, pant, pads, bottle, fruits, medicine, blanket)..."
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-slate-100">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`px-3 py-1 rounded-full font-semibold transition-colors shrink-0 ${
                  selectedCategory === 'ALL'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Items ({STANDARD_ITEMS.length})
              </button>

              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-full font-semibold transition-colors shrink-0 ${
                    selectedCategory === cat.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Graphical Grid */}
          {filteredItems.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-xs text-slate-500">
              No items matching "{itemSearchQuery}".
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredItems.map(item => {
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
                      {/* Top Row: Icon + Graphical Stepper (+ / -) */}
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

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Card bottom indicator */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">
                        {count > 0 ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>{count} {item.unit} added</span>
                          </span>
                        ) : (
                          <span>Use + / − to adjust quantity</span>
                        )}
                      </span>

                      {count > 0 && (
                        <button
                          onClick={() => setShowCheckoutModal(true)}
                          className="text-emerald-700 hover:underline font-bold text-xs"
                        >
                          Pledge now →
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB: FINANCIAL RELIEF AID & 80G DONATIONS */}
      {activeTab === 'financial-relief' && (
        <div className="space-y-6">
          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white rounded-xl p-6 border border-slate-800 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>100% Tax Deductible (Sec 80G)</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  Emergency Financial Relief Aid Pool
                </h2>
                <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                  Financial donations empower disaster relief camps to purchase clean drinking water tankers, perishable food, infant milk, and urgent prescription medications directly from local suppliers without transport delays.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setTargetCampForMoney(null);
                    setShowMoneyModal(true);
                  }}
                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 text-xs transition-colors"
                >
                  <IndianRupee className="w-4 h-4" />
                  <span>Contribute Funds Now</span>
                </button>
              </div>
            </div>

            {/* Quick Stat Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800 text-xs">
              <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Pool Raised</div>
                <div className="text-lg font-bold text-emerald-400 mt-0.5">
                  ₹{totalMonetaryFunds.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Platform disaster ledger</div>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">My Financial Aid</div>
                <div className="text-lg font-bold text-white mt-0.5">
                  ₹{myMonetaryTotal.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">{myMonetaryDonations.length} contributions</div>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Tax Exemption</div>
                <div className="text-lg font-bold text-amber-300 mt-0.5">50% Deduction</div>
                <div className="text-[10px] text-slate-400 mt-0.5">IT Act Section 80G</div>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Deployment Speed</div>
                <div className="text-lg font-bold text-sky-400 mt-0.5">&lt; 3 Hours</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Direct to camp gate</div>
              </div>
            </div>
          </div>

          {/* Quick Preset Tier Selector */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Heart className="w-4 h-4 text-emerald-600" />
                <span>One-Click Impact Sponsoring</span>
              </h3>
              <span className="text-slate-500 text-xs">Instant UPI & Card checkout with official 80G receipt</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
              {[
                { amount: 500, label: '₹500', impact: '25 hot meals & clean drinking water' },
                { amount: 1000, label: '₹1,000', impact: '100 drinking water bottles for shelter families' },
                { amount: 2500, label: '₹2,500', impact: '10 family first aid & sanitary packs' },
                { amount: 5000, label: '₹5,000', impact: 'Waterproof tarpaulins & warm blankets' },
                { amount: 10000, label: '₹10,000', impact: '200 hot meals at camp community kitchen' },
              ].map(tier => (
                <button
                  key={tier.amount}
                  type="button"
                  onClick={() => {
                    setTargetCampForMoney(null);
                    setShowMoneyModal(true);
                  }}
                  className="p-3.5 rounded-lg border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/50 text-left transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="text-base font-bold text-slate-900 group-hover:text-emerald-700 flex items-center">
                      <span>{tier.label}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 mt-1 leading-snug">
                      {tier.impact}
                    </div>
                  </div>
                  <div className="mt-3 text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                    <span>Sponsor this</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* User's Financial Contributions & 80G Receipts History */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-0">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-emerald-600" />
                  <span>My Monetary Contribution History & 80G Tax Receipts</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Every contribution is recorded with official reference numbers and download-ready tax vouchers.
                </p>
              </div>

              {myMonetaryDonations.length > 0 && (
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {myMonetaryDonations.length} Verified Donations
                </span>
              )}
            </div>

            {myMonetaryDonations.length === 0 ? (
              <div className="p-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <IndianRupee className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-sm">No Financial Donations Recorded Yet</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    When you donate funds for camp meals, drinking water, or medicine, your verified 80G tax deduction receipts will be preserved here for easy printing and tax filing.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMoneyModal(true)}
                  className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors inline-flex items-center gap-1.5"
                >
                  <IndianRupee className="w-3.5 h-3.5" />
                  <span>Make Your First Relief Donation</span>
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-200 text-xs">
                {myMonetaryDonations.map(don => (
                  <div key={don.id} className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {don.receiptNumber}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase">
                          {don.status || 'VERIFIED_RECEIVED'}
                        </span>
                        <span className="text-slate-400 text-[11px] font-mono">
                          {new Date(don.timestamp).toLocaleString()}
                        </span>
                      </div>

                      <div className="text-slate-800 font-medium">
                        Target Beneficiary: <strong className="text-slate-900">{don.targetCampName}</strong>
                        {don.targetPincode && (
                          <span className="ml-2 font-mono bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded text-[10px] font-bold">
                            PIN: {don.targetPincode}
                          </span>
                        )}
                      </div>

                      <div className="text-slate-500 text-[11px] flex flex-wrap items-center gap-3">
                        <span>Payment Mode: <strong className="text-slate-700">{don.paymentMethod}</strong></span>
                        <span>Bank UTR: <strong className="font-mono text-slate-700">{don.utr}</strong></span>
                        {don.panNumber && <span>PAN: <strong className="font-mono text-slate-700">{don.panNumber}</strong></span>}
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                      <div className="text-right">
                        <div className="text-lg font-bold text-emerald-700">
                          ₹{don.amount.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium">
                          Sec 80G Eligible
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setViewingReceipt(don)}
                        className="px-3 py-2 border border-slate-300 hover:border-emerald-600 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-600" />
                        <span>View / Print 80G Receipt</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: BROWSE URGENT CAMP SHORTAGES & PLEDGE DIRECTLY */}
      {activeTab === 'camp-requests' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={campSearchQuery}
                  onChange={(e) => setCampSearchQuery(e.target.value)}
                  placeholder="Search camp shortages by item, shelter name, PIN code..."
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <select
                  value={campCategoryFilter}
                  onChange={(e) => setCampCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white font-medium outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="ALL">All Need Categories</option>
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {filteredCampRequests.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No relief requests currently listed. Camp needs will appear here when posted.
              </div>
            ) : (
              <div className="divide-y divide-slate-200 text-xs">
                {filteredCampRequests.map(req => {
                  const fulfilled = req.quantityFulfilled || 0;
                  const remaining = Math.max(0, req.quantityNeeded - fulfilled);
                  const isDone = remaining === 0;

                  return (
                    <div key={req.id} className="p-5 hover:bg-slate-50/70 transition-colors space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
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
                          <span className="font-semibold text-slate-700">{req.category}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                            {req.status}
                          </span>
                          {!isDone && (
                            <div className="flex flex-wrap items-center gap-1.5">
                              <button
                                onClick={() => setPledgeTargetRequest(req)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow-sm flex items-center gap-1.5 transition-colors"
                              >
                                <Heart className="w-3.5 h-3.5 fill-current" />
                                <span>Pledge Supplies</span>
                              </button>
                              <button
                                onClick={() => setDirectContactData({ request: req, pledge: null })}
                                className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold rounded shadow-sm flex items-center gap-1 transition-colors"
                                title="Call or WhatsApp camp receiver directly"
                              >
                                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                                <span>Contact Receiver</span>
                              </button>
                              <button
                                onClick={() => {
                                  setTargetCampForMoney(req);
                                  setShowMoneyModal(true);
                                }}
                                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded shadow-sm flex items-center gap-1 transition-colors"
                              >
                                <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Donate Money</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 space-y-1.5">
                          <h3 className="font-bold text-slate-900 text-base">{req.itemName}</h3>
                          <div className="text-slate-700 flex flex-wrap items-center gap-1.5 text-xs">
                            <span>Relief Camp / Shelter: <strong>{req.shelterName || req.campName}</strong></span>
                            {req.pincode && (
                              <span className="font-mono bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.2 rounded text-[11px] font-bold">
                                PIN: {req.pincode}
                              </span>
                            )}
                          </div>

                          {/* Receiver lead contact details */}
                          <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-50 border border-slate-200 p-2 rounded">
                            <span className="text-slate-600">
                              Receiver: <strong className="text-slate-900">{req.requesterName || 'Camp Lead'}</strong>
                              {req.requesterRole ? ` (${req.requesterRole})` : ''}
                            </span>
                            {req.requesterPhone && (
                              <a
                                href={`tel:${req.requesterPhone}`}
                                className="font-mono font-bold text-emerald-700 underline flex items-center gap-1 hover:text-emerald-800"
                              >
                                <Phone className="w-3 h-3" />
                                <span>{req.requesterPhone}</span>
                              </a>
                            )}
                            {req.peopleCount > 0 && (
                              <span className="text-slate-500">
                                ~{req.peopleCount} sheltered
                              </span>
                            )}
                          </div>

                          {req.dropLocation && (
                            <div className="text-slate-500 text-xs">
                              Drop Point: <strong className="text-slate-700">{req.dropLocation}</strong>
                            </div>
                          )}
                          {req.note && (
                            <div className="text-slate-700 italic text-xs bg-amber-50/60 border border-amber-200/60 p-2 rounded">
                              "{req.note}"
                            </div>
                          )}
                        </div>

                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Needed:</span>
                            <span className="font-bold text-slate-900">{req.quantityNeeded}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Pledged:</span>
                            <span className="font-bold text-emerald-700">{fulfilled}</span>
                          </div>
                          <div className="flex justify-between border-t border-slate-200 pt-1">
                            <span className="text-slate-500">Remaining:</span>
                            <span className="font-bold text-red-700">{remaining}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: MY PLEDGES WITH FULL CRUD */}
      {activeTab === 'my-pledges' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={pledgeSearchQuery}
                onChange={(e) => setPledgeSearchQuery(e.target.value)}
                placeholder="Search my pledges by item, ID, hub..."
                className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>
            <button
              onClick={() => setActiveTab('donate')}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded shrink-0 shadow-sm"
            >
              + Donate More Supplies
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {filteredMyPledges.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                You haven't made any pledges yet. Click "Select Items to Donate" above to add items using the + symbol.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Pledge ID</th>
                      <th className="py-3 px-4">Relief Item</th>
                      <th className="py-3 px-4">Quantity</th>
                      <th className="py-3 px-4">Goods Photos</th>
                      <th className="py-3 px-4">Destination Camp</th>
                      <th className="py-3 px-4">Status & Progress</th>
                      <th className="py-3 px-4 text-center">Direct Contact</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredMyPledges.map(p => {
                      const isAccepted = p.status === 'ACCEPTED' || p.status === 'DISTRIBUTED';
                      const isInTransit = p.status === 'IN_TRANSIT';
                      const matchingReq = requests.find(r => r.id === p.requestId) || {
                        id: p.requestId || 'CAMP-DIRECT',
                        itemName: p.itemName,
                        quantityNeeded: p.quantity,
                        shelterName: p.dropoffHub || 'Relief Camp',
                        requesterName: 'Camp Coordinator',
                        requesterPhone: '',
                        dropLocation: p.dropoffHub || 'Camp Gate'
                      };

                      return (
                        <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{p.id}</td>
                          <td className="py-3.5 px-4 font-semibold text-slate-800">{p.itemName}</td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">{p.quantity}</td>
                          <td className="py-3.5 px-4">
                            {p.photos && p.photos.length > 0 ? (
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {p.photos.map((ph, idx) => (
                                  <button
                                    type="button"
                                    key={idx}
                                    onClick={() => setPreviewLightboxPhoto(ph)}
                                    className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 hover:border-emerald-500 transition-all shadow-xs relative group shrink-0"
                                    title="Click to enlarge photo"
                                  >
                                    <img src={ph} alt="Goods" className="w-full h-full object-cover" />
                                    <span className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                      <Eye className="w-3 h-3" />
                                    </span>
                                  </button>
                                ))}
                                <span className="text-[10px] text-slate-500 font-mono">
                                  ({p.photos.length})
                                </span>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setQuickPhotoPledge(p)}
                                className="px-2 py-1 bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 rounded text-[10px] font-semibold flex items-center gap-1 transition-colors"
                              >
                                <Camera className="w-3 h-3 text-slate-400" />
                                <span>+ Add Photos</span>
                              </button>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            <div>{p.dropoffHub || 'Designated Camp / Hub'}</div>
                            {matchingReq.requesterName && (
                              <div className="text-[10px] text-slate-400">
                                Contact: {matchingReq.requesterName}
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] ${
                                isAccepted
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : isInTransit
                                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                  : 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              {isAccepted && <CheckCircle2 className="w-3 h-3 text-emerald-700" />}
                              {isInTransit && <Truck className="w-3 h-3 text-blue-700" />}
                              <span>{p.status}</span>
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => setDirectContactData({ request: matchingReq, pledge: p })}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold rounded text-[11px] inline-flex items-center gap-1 transition-colors shadow-sm"
                              title="Directly call or WhatsApp receiver"
                            >
                              <Phone className="w-3 h-3 text-emerald-700" />
                              <span>Contact Receiver</span>
                            </button>
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-1">
                            {!isAccepted && (
                              <>
                                <button
                                  onClick={() => setEditingPledge(p)}
                                  className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded"
                                  title="Edit Pledge"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeletePledge(p.id)}
                                  className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded"
                                  title="Cancel Pledge"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STICKY BOTTOM DONATION TRAY */}
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
                    {totalSelectedUnits} items selected to donate
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
                onClick={() => setShowCheckoutModal(true)}
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

      {/* CHECKOUT MODAL */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden my-8">
            <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-emerald-400 fill-current" />
                <h3 className="font-bold text-sm">Confirm Relief Supply Donation</h3>
              </div>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {checkoutSuccess ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Pledges Confirmed!</h4>
                <p className="text-xs text-slate-600">
                  Your donation of {totalSelectedUnits} items has been logged into the relief ledger.
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmDonation} className="p-6 space-y-4 text-xs">
                {/* List of items */}
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
                    <span>Total Relief Units:</span>
                    <span>{totalSelectedUnits} items</span>
                  </div>
                </div>

                {/* Goods Photos Section - Added after donor specifies what to donate */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
                  <GoodsPhotoUploader
                    photos={goodsPhotos}
                    onChange={setGoodsPhotos}
                    maxPhotos={4}
                    title="Photos of Donated Goods (Optional but Recommended)"
                    subtitle="Attach photos of the items/parcel you're donating so camp coordinators can verify them."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Donor Name / Group <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="Your Name"
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
                    Drop-off Staging Hub or Warehouse
                  </label>
                  <input
                    type="text"
                    value={dropoffHub}
                    onChange={(e) => setDropoffHub(e.target.value)}
                    placeholder="e.g. Regional Relief Center / City Collection Point"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Notes / Delivery Schedule
                  </label>
                  <textarea
                    rows="2"
                    value={donorNotes}
                    onChange={(e) => setDonorNotes(e.target.value)}
                    placeholder="e.g. Can drop off Saturday 10 AM, package is boxed and sanitized"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowCheckoutModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded text-slate-700 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow-sm flex items-center gap-1.5"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                    <span>Submit Relief Pledge</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* EDIT PLEDGE MODAL */}
      {editingPledge && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden">
            <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between">
              <h3 className="font-bold text-sm">Edit Relief Pledge #{editingPledge.id}</h3>
              <button onClick={() => setEditingPledge(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleUpdatePledge} className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <div className="font-bold text-slate-800">{editingPledge.itemName}</div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pledged Quantity</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={editingPledge.quantity}
                  onChange={(e) => setEditingPledge({ ...editingPledge, quantity: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Staging Hub</label>
                <input
                  type="text"
                  value={editingPledge.dropoffHub || ''}
                  onChange={(e) => setEditingPledge({ ...editingPledge, dropoffHub: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notes</label>
                <textarea
                  rows="2"
                  value={editingPledge.trackingNotes || ''}
                  onChange={(e) => setEditingPledge({ ...editingPledge, trackingNotes: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none"
                />
              </div>

              {/* Goods Photos in Edit Modal */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <GoodsPhotoUploader
                  photos={editingPledge.photos || []}
                  onChange={(photos) => setEditingPledge({ ...editingPledge, photos })}
                  maxPhotos={4}
                  title="Update Goods Photos"
                  subtitle="Add or remove photos of this pledged relief item."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingPledge(null)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded"
                >
                  Save Pledge Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIRECT PLEDGE TO CAMP MODAL */}
      {pledgeTargetRequest && (
        <PledgeModal
          request={pledgeTargetRequest}
          onClose={() => setPledgeTargetRequest(null)}
          onSuccess={() => {
            setPledgeTargetRequest(null);
            setActiveTab('my-pledges');
          }}
        />
      )}

      {/* MONETARY DONATION MODAL */}
      {showMoneyModal && (
        <MoneyDonationModal
          onClose={() => {
            setShowMoneyModal(false);
            setTargetCampForMoney(null);
          }}
          defaultCamp={targetCampForMoney}
          currentUser={currentUser}
          onDonationComplete={() => {
            setActiveTab('financial-relief');
          }}
        />
      )}

      {/* 80G RECEIPT VIEWER MODAL */}
      {viewingReceipt && (
        <MoneyDonationModal
          onClose={() => setViewingReceipt(null)}
          currentUser={currentUser}
          initialReceipt={viewingReceipt}
        />
      )}

      {/* DIRECT RECEIVER CONTACT MODAL */}
      {directContactData && (
        <DirectReceiverContactModal
          request={directContactData.request}
          pledge={directContactData.pledge}
          onClose={() => setDirectContactData(null)}
        />
      )}

      {/* MANAGE PROFILE MODAL */}
      {showProfileModal && (
        <ProfileEditModal onClose={() => setShowProfileModal(false)} />
      )}

      {/* QUICK PHOTO MODAL */}
      {quickPhotoPledge && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden text-xs">
            <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm">Add Goods Photos to #{quickPhotoPledge.id}</h3>
              </div>
              <button onClick={() => setQuickPhotoPledge(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-slate-700 font-medium">
                Pledged Item: <strong className="text-slate-900">{quickPhotoPledge.quantity} × {quickPhotoPledge.itemName}</strong>
              </div>
              <GoodsPhotoUploader
                photos={quickPhotoPledge.photos || []}
                onChange={(newPhotos) => setQuickPhotoPledge({ ...quickPhotoPledge, photos: newPhotos })}
                maxPhotos={4}
                title="Goods / Parcel Photos"
                subtitle="Upload or capture pictures of your supplies."
              />
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setQuickPhotoPledge(null)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updatePledge(quickPhotoPledge.id, { photos: quickPhotoPledge.photos || [] });
                    setQuickPhotoPledge(null);
                  }}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow-sm transition-colors"
                >
                  Save Photos
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX FOR PREVIEWING GOODS PHOTO */}
      {previewLightboxPhoto && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setPreviewLightboxPhoto(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 text-white border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold">
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>Donated Goods Verification Photo</span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewLightboxPhoto(null)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                ✕
              </button>
            </div>
            <div className="p-2 flex items-center justify-center bg-black/50">
              <img
                src={previewLightboxPhoto}
                alt="Donated Goods High Resolution Preview"
                className="max-h-[75vh] w-auto max-w-full rounded-lg object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
