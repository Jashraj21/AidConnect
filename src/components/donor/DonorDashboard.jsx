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
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { CATEGORIES, STANDARD_ITEMS } from '../../data/initialData';

export default function DonorDashboard() {
  const { currentUser } = useAuth();
  const { requests, pledges, addPledge } = useData();

  const [activeTab, setActiveTab] = useState('donate'); // 'donate' | 'my-pledges'
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Graphical item selection state: { [itemId]: count }
  const [itemCounts, setItemCounts] = useState({});

  // Checkout modal
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

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
        trackingNotes: donorNotes || 'Direct graphical donation pledge'
      });
    });

    setCheckoutSuccess(true);
    setTimeout(() => {
      setItemCounts({});
      setShowCheckoutModal(false);
      setCheckoutSuccess(false);
      setActiveTab('my-pledges');
    }, 2000);
  };

  // User's own pledges
  const myPledges = pledges.filter(p => {
    if (!currentUser) return true;
    return (
      (currentUser.email && p.donorEmail?.toLowerCase() === currentUser.email?.toLowerCase()) ||
      (currentUser.name && p.donorName?.toLowerCase() === currentUser.name?.toLowerCase())
    );
  });

  const totalItemsPledged = myPledges.reduce((sum, p) => sum + (p.quantity || 0), 0);

  // Filtered items
  const filteredItems = STANDARD_ITEMS.filter(item => {
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
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
                  Donor
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Direct disaster basic needs donation platform {currentUser?.city ? `• ${currentUser.city}` : ''}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 sm:gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
            <div className="text-center px-3 py-1 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-lg font-bold text-slate-900">{myPledges.length}</div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">My Pledges</div>
            </div>
            <div className="text-center px-3 py-1 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-lg font-bold text-emerald-700">{totalItemsPledged}</div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Items Pledged</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-200 text-xs font-semibold">
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
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-950 flex items-center justify-between gap-3">
            <div>
              <span className="font-bold">Graphical Item Selection:</span> Click the <strong>+</strong> symbol next to any item icon to add items, or <strong>−</strong> to remove.
            </div>
            {totalSelectedUnits > 0 && (
              <span className="font-bold bg-emerald-600 text-white px-2.5 py-1 rounded text-xs shrink-0">
                {totalSelectedUnits} items selected
              </span>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-colors shrink-0 ${
                selectedCategory === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              All Items
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

          {/* Graphical Grid */}
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
                        <span>Use + to add to donation</span>
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
        </div>
      )}

      {/* TAB 2: MY PLEDGES */}
      {activeTab === 'my-pledges' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-base font-bold text-slate-900">Your Relief Supply Pledges</h2>
            <button
              onClick={() => setActiveTab('donate')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded"
            >
              + Donate More Items
            </button>
          </div>

          {myPledges.length === 0 ? (
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
                    <th className="py-3 px-4">Staging Hub</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {myPledges.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{p.id}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{p.itemName}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{p.quantity}</td>
                      <td className="py-3.5 px-4 text-slate-600">{p.dropoffHub}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full font-bold text-[10px] bg-slate-100 text-slate-800">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
                    <span>Total:</span>
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
                    placeholder="e.g. Nearest Collection Center / Hub"
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
                    placeholder="e.g. Cleanly packed in boxes"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowCheckoutModal(false)}
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
    </div>
  );
}
