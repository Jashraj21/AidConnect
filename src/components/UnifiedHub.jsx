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
  CheckCircle2,
  Clock,
  Truck,
  ArrowRight,
  Filter,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { CATEGORIES, STANDARD_ITEMS } from '../data/initialData';

export default function UnifiedHub() {
  const { currentUser, setActiveView } = useAuth();
  const { requests, pledges, addRequest, addPledge, verifyRequest, dispatchRequestShipment } = useData();

  // Active perspective tab: 'all' | 'donor' | 'receiver' | 'organization'
  const [activeRoleTab, setActiveRoleTab] = useState(
    currentUser?.role === 'DONOR'
      ? 'donor'
      : currentUser?.role === 'RECEIVER'
      ? 'receiver'
      : currentUser?.role === 'ORGANIZATION'
      ? 'organization'
      : 'all'
  );

  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Modal states for direct action
  const [actionItem, setActionItem] = useState(null); // The standard item selected
  const [actionType, setActionType] = useState(null); // 'DONATE' | 'REQUEST'
  const [actionSuccess, setActionSuccess] = useState(false);

  // Form states
  const [formQuantity, setFormQuantity] = useState(10);
  const [formName, setFormName] = useState(currentUser?.name || '');
  const [formContact, setFormContact] = useState(currentUser?.phone || currentUser?.email || '');
  const [formCamp, setFormCamp] = useState(currentUser?.campName || '');
  const [formLocation, setFormLocation] = useState(currentUser?.location || '');
  const [formUrgency, setFormUrgency] = useState('HIGH');
  const [formNotes, setFormNotes] = useState('');

  // Category Icon helper
  const getItemIcon = (category) => {
    switch (category) {
      case 'CLOTHES':
        return <Shirt className="w-5 h-5 text-indigo-600" />;
      case 'HYGIENE':
        return <ShieldAlert className="w-5 h-5 text-teal-600" />;
      case 'WATER':
        return <Droplets className="w-5 h-5 text-blue-600" />;
      case 'FOOD':
        return <Utensils className="w-5 h-5 text-amber-600" />;
      case 'MEDICINE':
        return <HeartPulse className="w-5 h-5 text-rose-600" />;
      case 'BOOKS':
        return <BookOpen className="w-5 h-5 text-violet-600" />;
      case 'SHELTER_ESSENTIALS':
        return <Tent className="w-5 h-5 text-emerald-600" />;
      default:
        return <Package className="w-5 h-5 text-slate-600" />;
    }
  };

  // Open modal
  const handleOpenAction = (item, type) => {
    setActionItem(item);
    setActionType(type);
    setActionSuccess(false);
    setFormQuantity(type === 'DONATE' ? 10 : 25);
    setFormNotes('');
  };

  // Submit Donation Pledge
  const handleDonateSubmit = (e) => {
    e.preventDefault();
    if (!actionItem) return;

    // Find if there is an existing open request for this item to link to
    const matchingReq = requests.find(r =>
      r.itemName.toLowerCase().includes(actionItem.name.toLowerCase()) &&
      (r.quantityFulfilled || 0) < r.quantityNeeded
    );

    addPledge({
      requestId: matchingReq ? matchingReq.id : `GEN-${actionItem.id}`,
      donorName: formName || 'Kind Supporter',
      donorEmail: formContact.includes('@') ? formContact : '',
      donorPhone: !formContact.includes('@') ? formContact : '',
      itemName: actionItem.name,
      quantity: parseInt(formQuantity, 10) || 1,
      deliveryMethod: 'DROPOFF_AT_HUB',
      dropoffHub: formLocation || 'Community Relief Staging Center',
      trackingNotes: formNotes || `Pledged for disaster relief`
    });

    setActionSuccess(true);
    setTimeout(() => {
      setActionItem(null);
      setActionType(null);
      setActionSuccess(false);
    }, 1800);
  };

  // Submit Relief Need Request
  const handleRequestSubmit = (e) => {
    e.preventDefault();
    if (!actionItem) return;

    addRequest({
      zoneName: formLocation || 'Affected Zone',
      campName: formCamp || 'Relief Shelter',
      requesterName: formName || 'Camp Representative',
      requesterRole: 'Camp Lead',
      requesterPhone: formContact,
      peopleCount: 50,
      category: actionItem.category,
      itemName: actionItem.name,
      quantityNeeded: parseInt(formQuantity, 10) || 1,
      urgency: formUrgency,
      note: formNotes,
      dropLocation: formLocation || 'Camp Main Gate'
    });

    setActionSuccess(true);
    setTimeout(() => {
      setActionItem(null);
      setActionType(null);
      setActionSuccess(false);
    }, 1800);
  };

  // Filtered items
  const filteredItems = STANDARD_ITEMS.filter(item => {
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Page Title & Connection Explanation */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Unified Community Relief Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Connect Donors, Receivers & Helping Organizations
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            A single direct channel for clothes (shirts, pants, t-shirts, shorts), sanitary pads, water bottles, food items (fruits and packet foods), medicines, books, and essential survival goods.
          </p>
        </div>

        {/* 3 User Type Switcher */}
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
              <span>1. For Donors</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Pledge clean clothes, water, food packets, or medicines directly.
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
              <span>2. For Receivers (Camps)</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Request exact quantities needed for families in your shelter.
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
              <span>3. For Helping Orgs (NGOs)</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Verify distress calls, manage warehouse stock & dispatch convoys.
            </p>
          </button>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-3.5 py-1.5 rounded-full font-semibold transition-colors shrink-0 ${
            selectedCategory === 'ALL'
              ? 'bg-slate-900 text-white'
              : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
          }`}
        >
          All Essential Items
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

      {/* ITEMS CATALOG & DIRECT INTERACTION GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map(item => {
          // Calculate live demand & supply for this specific item
          const relatedRequests = requests.filter(r =>
            r.itemName.toLowerCase().includes(item.name.toLowerCase()) ||
            r.category === item.category
          );
          const totalRequested = relatedRequests.reduce((sum, r) => sum + r.quantityNeeded, 0);

          const relatedPledges = pledges.filter(p =>
            p.itemName.toLowerCase().includes(item.name.toLowerCase())
          );
          const totalPledged = relatedPledges.reduce((sum, p) => sum + p.quantity, 0);

          return (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      {getItemIcon(item.category)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{item.name}</h3>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">
                        Unit: {item.unit}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>

                {/* Demand & Pledges Counter */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Requested:</span>
                    <div className="font-bold text-red-700 text-sm mt-0.5">
                      {totalRequested} {item.unit}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Pledged:</span>
                    <div className="font-bold text-emerald-700 text-sm mt-0.5">
                      {totalPledged} {item.unit}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Connecting The 3 Users */}
              <div className="mt-5 pt-3 border-t border-slate-100 space-y-2">
                {activeRoleTab === 'all' && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleOpenAction(item, 'DONATE')}
                      className="w-full py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <Heart className="w-3.5 h-3.5 fill-current" />
                      <span>Donate</span>
                    </button>

                    <button
                      onClick={() => handleOpenAction(item, 'REQUEST')}
                      className="w-full py-1.5 px-2 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <Package className="w-3.5 h-3.5" />
                      <span>Request</span>
                    </button>
                  </div>
                )}

                {activeRoleTab === 'donor' && (
                  <button
                    onClick={() => handleOpenAction(item, 'DONATE')}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                    <span>Pledge / Donate {item.name}</span>
                  </button>
                )}

                {activeRoleTab === 'receiver' && (
                  <button
                    onClick={() => handleOpenAction(item, 'REQUEST')}
                    className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Package className="w-4 h-4" />
                    <span>Request {item.name} for Shelter</span>
                  </button>
                )}

                {activeRoleTab === 'organization' && (
                  <div className="space-y-1">
                    <div className="text-[11px] text-slate-500 text-center font-medium">
                      {relatedRequests.length} active camp requests for this item
                    </div>
                    <button
                      onClick={() => setActiveView('org-portal')}
                      className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <Building2 className="w-3.5 h-3.5 text-blue-300" />
                      <span>Manage / Dispatch from Org Desk</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* POPUP ACTION MODAL (DONATE OR REQUEST) */}
      {actionItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden">
            <div className={`p-4 text-white flex items-center justify-between ${actionType === 'DONATE' ? 'bg-emerald-700' : 'bg-amber-700'}`}>
              <div className="flex items-center gap-2">
                {actionType === 'DONATE' ? <Heart className="w-5 h-5 fill-current" /> : <Package className="w-5 h-5" />}
                <h3 className="font-bold text-sm">
                  {actionType === 'DONATE' ? `Donate: ${actionItem.name}` : `Request: ${actionItem.name}`}
                </h3>
              </div>
              <button
                onClick={() => setActionItem(null)}
                className="text-white/80 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {actionSuccess ? (
              <div className="p-8 text-center space-y-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${actionType === 'DONATE' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">
                  {actionType === 'DONATE' ? 'Pledge Registered!' : 'Need Requisition Submitted!'}
                </h4>
                <p className="text-xs text-slate-500">
                  {actionType === 'DONATE'
                    ? `Thank you for pledging ${formQuantity} ${actionItem.unit} of ${actionItem.name}.`
                    : `Your camp request for ${formQuantity} ${actionItem.unit} of ${actionItem.name} has been broadcasted.`}
                </p>
              </div>
            ) : (
              <form
                onSubmit={actionType === 'DONATE' ? handleDonateSubmit : handleRequestSubmit}
                className="p-6 space-y-4 text-xs"
              >
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Quantity ({actionItem.unit}) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formQuantity}
                    onChange={(e) => setFormQuantity(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded font-bold outline-none text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {actionType === 'DONATE' ? 'Donor Name' : 'Contact Person'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Name"
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
                      value={formContact}
                      onChange={(e) => setFormContact(e.target.value)}
                      placeholder="Contact"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none"
                    />
                  </div>
                </div>

                {actionType === 'REQUEST' && (
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Camp / Shelter Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formCamp}
                      onChange={(e) => setFormCamp(e.target.value)}
                      placeholder="e.g. Relief Shelter #3"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {actionType === 'DONATE' ? 'Collection Hub / Your City' : 'Location / Drop Gate'}
                  </label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="Location details"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Notes
                  </label>
                  <input
                    type="text"
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="Specific sizes, food types, or details"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setActionItem(null)}
                    className="px-4 py-2 border border-slate-300 rounded text-slate-700 font-medium hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-5 py-2 text-white font-bold rounded shadow-sm ${
                      actionType === 'DONATE'
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : 'bg-amber-600 hover:bg-amber-700'
                    }`}
                  >
                    {actionType === 'DONATE' ? 'Confirm Donation Pledge' : 'Submit Camp Request'}
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
