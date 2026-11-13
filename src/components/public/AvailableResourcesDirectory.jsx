import React, { useState } from 'react';
import {
  Package,
  Search,
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Phone,
  CheckCircle2,
  Filter,
  ShieldCheck,
  Compass,
  ArrowRight,
  Boxes,
  X
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIES } from '../../data/initialData';

export default function AvailableResourcesDirectory() {
  const { inventory = [], addInventoryItem, updateInventoryItem, deleteInventoryItem } = useData();
  const { currentUser, setActiveView } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedAvailability, setSelectedAvailability] = useState('ALL');
  const [locationQuery, setLocationQuery] = useState('');

  // Modals for CRUD
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'FOOD',
    quantity: 100,
    unit: 'units',
    location: '',
    pincode: '',
    availability: 'AVAILABLE',
    condition: 'New & Sealed / Inspected',
    contactPhone: currentUser?.phone || '',
    donorOrOrgName: currentUser?.name || currentUser?.orgName || 'Relief Supporter'
  });

  // Filter logic (Category, Location, Availability)
  const filteredResources = inventory.filter(res => {
    // 1. Category Filter
    if (selectedCategory !== 'ALL' && res.category !== selectedCategory) return false;

    // 2. Availability Filter
    if (selectedAvailability !== 'ALL') {
      const resAvail = res.availability || (res.inStock > 50 ? 'AVAILABLE' : res.inStock > 0 ? 'LOW_STOCK' : 'RESERVED');
      if (resAvail !== selectedAvailability) return false;
    }

    // 3. Location Filter (by PIN or text)
    if (locationQuery.trim()) {
      const locQ = locationQuery.toLowerCase();
      const matchPin = (res.pincode || '').includes(locQ);
      const matchHub = (res.hub || '').toLowerCase().includes(locQ);
      const matchLoc = (res.location || '').toLowerCase().includes(locQ);
      if (!matchPin && !matchHub && !matchLoc) return false;
    }

    // 4. Keyword Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (res.item || res.name || '').toLowerCase().includes(q);
      const matchCat = (res.category || '').toLowerCase().includes(q);
      const matchDonor = (res.donorOrOrgName || '').toLowerCase().includes(q);
      if (!matchName && !matchCat && !matchDonor) return false;
    }

    return true;
  });

  const handleCreateResource = (e) => {
    e.preventDefault();
    addInventoryItem({
      ...formData,
      item: formData.name,
      inStock: parseInt(formData.quantity, 10) || 1,
      hub: formData.location || 'Central Disaster Depot'
    });
    setShowAddModal(false);
    setFormData({
      name: '',
      category: 'FOOD',
      quantity: 100,
      unit: 'units',
      location: '',
      pincode: '',
      availability: 'AVAILABLE',
      condition: 'New & Sealed / Inspected',
      contactPhone: currentUser?.phone || '',
      donorOrOrgName: currentUser?.name || currentUser?.orgName || 'Relief Supporter'
    });
  };

  const handleUpdateResource = (e) => {
    e.preventDefault();
    if (!editingItem) return;
    updateInventoryItem(editingItem.id, {
      ...editingItem,
      inStock: parseInt(editingItem.inStock, 10) || 0,
      quantity: parseInt(editingItem.inStock, 10) || 0
    });
    setEditingItem(null);
  };

  const handleDeleteResource = (itemId, itemName) => {
    if (window.confirm(`Are you sure you want to delete resource listing "${itemName}"?`)) {
      deleteInventoryItem(itemId);
    }
  };

  const totalStockUnits = inventory.reduce((sum, item) => sum + (item.inStock || 0), 0);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
              <Boxes className="w-4 h-4" />
              <span>Available Relief Stock & Resources</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Resource Listings Directory</h1>
            <p className="text-xs text-slate-500 mt-1">
              Search and filter disaster relief resources by category, geographic location, and live stock availability.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Total Resources</div>
              <div className="text-lg font-bold text-slate-900">{totalStockUnits.toLocaleString()} units</div>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Create Resource Listing</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mt-6 pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resource name, provider..."
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Location & PIN Filter */}
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              placeholder="Filter by PIN code or city (e.g. 682025)..."
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 outline-none font-medium"
            />
          </div>

          {/* Availability Status Filter */}
          <div>
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white font-medium outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="ALL">All Availability Levels</option>
              <option value="AVAILABLE">🟢 Available / Ready for Dispatch</option>
              <option value="LOW_STOCK">🟡 Low Stock</option>
              <option value="RESERVED">🔴 Reserved / Allocated</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-3 border-t border-slate-100 mt-3 text-xs">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1 rounded-full font-semibold transition-colors shrink-0 ${
              selectedCategory === 'ALL'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Categories ({inventory.length})
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full font-semibold transition-colors shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Listings Grid */}
      {filteredResources.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Package className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-800">No matching resource listings found</p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your category, location PIN, or availability filter, or create a new resource listing.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('ALL');
              setSelectedAvailability('ALL');
              setLocationQuery('');
              setSearchQuery('');
            }}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map(res => {
            const isAvail = (res.availability || 'AVAILABLE') === 'AVAILABLE';
            const isLow = res.availability === 'LOW_STOCK';

            return (
              <div
                key={res.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {res.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        isAvail
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : isLow
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-800 border border-slate-200'
                      }`}
                    >
                      {res.availability || 'AVAILABLE'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{res.item || res.name}</h3>
                    <div className="text-xs text-slate-600 flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{res.hub || res.location || 'Central Disaster Depot'}</span>
                      {res.pincode && (
                        <span className="font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-1 rounded text-[10px]">
                          PIN: {res.pincode}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">In Stock Available:</span>
                      <span className="font-bold text-emerald-700 text-sm">{res.inStock} {res.unit}</span>
                    </div>
                    {res.condition && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Condition:</span>
                        <span className="font-medium text-slate-800">{res.condition}</span>
                      </div>
                    )}
                    {res.donorOrOrgName && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Listed By:</span>
                        <span className="font-semibold text-slate-800">{res.donorOrOrgName}</span>
                      </div>
                    )}
                    {res.contactPhone && (
                      <div className="flex justify-between border-t border-slate-200 pt-1 text-[11px]">
                        <span className="text-slate-500">Contact:</span>
                        <a href={`tel:${res.contactPhone}`} className="font-mono font-bold text-emerald-700 underline flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span>{res.contactPhone}</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions (Full CRUD) */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingItem(res)}
                      className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded"
                      title="Update resource listing"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteResource(res.id, res.item || res.name)}
                      className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded"
                      title="Delete resource listing"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {res.contactPhone ? (
                    <a
                      href={`tel:${res.contactPhone}`}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded flex items-center gap-1 transition-colors"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Request Resource</span>
                    </a>
                  ) : (
                    <button
                      onClick={() => alert(`Resource #${res.id} allocated for disaster logistics dispatch.`)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded transition-colors"
                    >
                      Allocate
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE RESOURCE LISTING MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden my-8 text-xs">
            <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Boxes className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">Create New Resource Listing</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateResource} className="p-6 space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Resource Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Drinking Water Cans 20L, Blankets"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded font-medium outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white font-medium outline-none"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quantity in Stock</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-bold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Location / Depot Hub</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Kochi Relief Warehouse"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Postal PIN Code</label>
                  <input
                    type="text"
                    maxLength="6"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
                    placeholder="e.g. 682025"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono font-bold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Availability</label>
                  <select
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white font-medium outline-none"
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="LOW_STOCK">LOW_STOCK</option>
                    <option value="RESERVED">RESERVED</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    placeholder="Phone number"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPDATE RESOURCE LISTING MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden my-8 text-xs">
            <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between">
              <h3 className="font-bold text-sm">Update Resource #{editingItem.id}</h3>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleUpdateResource} className="p-6 space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Resource Name</label>
                <input
                  type="text"
                  required
                  value={editingItem.item || editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, item: e.target.value, name: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded font-medium outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editingItem.inStock}
                    onChange={(e) => setEditingItem({ ...editingItem, inStock: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Availability</label>
                  <select
                    value={editingItem.availability || 'AVAILABLE'}
                    onChange={(e) => setEditingItem({ ...editingItem, availability: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white font-medium outline-none"
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="LOW_STOCK">LOW_STOCK</option>
                    <option value="RESERVED">RESERVED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Location / Depot Hub</label>
                <input
                  type="text"
                  value={editingItem.hub || editingItem.location}
                  onChange={(e) => setEditingItem({ ...editingItem, hub: e.target.value, location: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded"
                >
                  Save Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
