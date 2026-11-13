import React, { useState } from 'react';
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  MapPin,
  Phone,
  User,
  Building,
  Compass,
  AlertTriangle,
  ArrowRight,
  Send
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import NearbyCampsFinder from '../common/NearbyCampsFinder';
import { lookupPincode } from '../../utils/pincodeService';

export default function ReceiverCartModal({
  cartItems,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onSubmitSuccess,
  currentUser
}) {
  const { addBatchRequests, requests } = useData();

  const [formData, setFormData] = useState({
    pincode: currentUser?.pincode || '',
    phone: currentUser?.phone || '',
    name: currentUser?.name || '',
    campName: currentUser?.campName || currentUser?.shelterName || '',
    shelterName: currentUser?.shelterName || currentUser?.campName || '',
    zoneName: currentUser?.zoneName || '',
    dropLocation: currentUser?.location || 'Camp Entrance / Main Gate',
    urgency: 'HIGH',
    note: ''
  });

  const [submittedRequests, setSubmittedRequests] = useState(null);

  const totalItemsCount = cartItems.length;
  const totalUnits = cartItems.reduce((sum, ci) => sum + (ci.quantity || 0), 0);

  const handleCampSelect = (camp) => {
    setFormData(prev => ({
      ...prev,
      campName: camp.name,
      shelterName: camp.name,
      dropLocation: prev.dropLocation || camp.address || camp.type || ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    let resolvedCamp = formData.campName.trim();
    let resolvedZone = formData.zoneName.trim();

    if (!resolvedCamp && formData.pincode) {
      const match = lookupPincode(formData.pincode, requests);
      resolvedCamp = match?.primaryCamp?.name || `Relief Shelter (PIN ${formData.pincode})`;
    }

    if (!resolvedZone && formData.pincode) {
      const match = lookupPincode(formData.pincode, requests);
      resolvedZone = match?.locationLabel || 'Calamity Sector';
    }

    const commonDetails = {
      zoneName: resolvedZone || 'Calamity Sector',
      campName: resolvedCamp || 'Relief Camp / Shelter',
      shelterName: resolvedCamp || 'Relief Camp / Shelter',
      pincode: formData.pincode,
      requesterName: formData.name || currentUser?.name || 'Camp Representative',
      requesterRole: currentUser?.designation || 'Camp Coordinator',
      requesterPhone: formData.phone || currentUser?.phone || '',
      dropLocation: formData.dropLocation,
      urgency: formData.urgency,
      note: formData.note
    };

    const itemsToCreate = cartItems.map(ci => ({
      category: ci.category || ci.item?.category || 'SHELTER_ESSENTIALS',
      itemName: ci.name || ci.item?.name || 'Necessity Item',
      quantityNeeded: ci.quantity,
      urgency: ci.urgency || formData.urgency,
      note: ci.note || formData.note
    }));

    const created = addBatchRequests(commonDetails, itemsToCreate);
    setSubmittedRequests(created);
    if (onClearCart) onClearCart();
    if (onSubmitSuccess) onSubmitSuccess(created);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 px-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Receiver Requisition Cart</h3>
              <p className="text-[11px] text-slate-300">
                {totalItemsCount} relief items ({totalUnits} total units)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {submittedRequests ? (
          <div className="p-8 text-center space-y-4 overflow-y-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {submittedRequests.length} Relief Needs Posted Successfully!
            </h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              All items have been published to the urgent live needs ledger and are now accessible to Donors and Helping Organizations.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 max-h-48 overflow-y-auto text-left text-xs divide-y divide-slate-200">
              {submittedRequests.map(req => (
                <div key={req.id} className="py-2 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">{req.itemName}</span>
                    <span className="text-slate-500 ml-2">({req.quantityNeeded} units)</span>
                  </div>
                  <span className="font-mono text-[11px] font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                    {req.id}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3">
              <button
                onClick={onClose}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-md shadow-sm transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Your Requisition Cart is Empty</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Use the + and − buttons beside items in the catalog to add clothing, sanitary pads, food, medicines, and blankets to your camp requisition.
            </p>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-md shadow-sm transition-colors"
              >
                Browse Items Catalog
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 text-xs">
            {/* Cart Items List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  Selected Items in Cart ({totalItemsCount})
                </span>
                <button
                  type="button"
                  onClick={onClearCart}
                  className="text-red-600 hover:underline text-[11px] font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              </div>

              <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 max-h-52 overflow-y-auto bg-slate-50/50">
                {cartItems.map((ci) => {
                  const itemId = ci.id || ci.item?.id;
                  const name = ci.name || ci.item?.name;
                  const unit = ci.unit || ci.item?.unit || 'units';

                  return (
                    <div key={itemId} className="p-3 flex items-center justify-between gap-3 bg-white">
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900 text-xs">{name}</div>
                        <div className="text-[10px] text-slate-500">Unit: {unit}</div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Graphical Stepper */}
                        <div className="flex items-center bg-slate-100 p-0.5 rounded border border-slate-300">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity && onUpdateQuantity(itemId, Math.max(1, ci.quantity - 1))}
                            className="w-6 h-6 rounded bg-white hover:bg-slate-200 text-slate-800 flex items-center justify-center transition-colors shadow-sm"
                          >
                            <Minus className="w-3 h-3 stroke-[3]" />
                          </button>

                          <input
                            type="number"
                            min="1"
                            value={ci.quantity}
                            onChange={(e) => onUpdateQuantity && onUpdateQuantity(itemId, parseInt(e.target.value, 10) || 1)}
                            className="w-12 text-center font-bold text-xs text-slate-900 font-mono bg-transparent outline-none"
                          />

                          <button
                            type="button"
                            onClick={() => onUpdateQuantity && onUpdateQuantity(itemId, ci.quantity + 1)}
                            className="w-6 h-6 rounded bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center transition-colors shadow-sm"
                          >
                            <Plus className="w-3 h-3 stroke-[3]" />
                          </button>
                        </div>

                        {/* Remove item button */}
                        <button
                          type="button"
                          onClick={() => onRemoveItem && onRemoveItem(itemId)}
                          className="text-slate-400 hover:text-red-600 p-1 rounded transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Core Required Details Notice */}
            <div className="bg-amber-50/60 border border-amber-200 rounded-lg p-2.5 text-slate-800 flex items-center justify-between">
              <span className="font-semibold">
                Required Info: <strong className="font-mono text-amber-900">PIN Code</strong>, <strong>Phone</strong> & <strong>Name</strong>.
              </span>
              <span className="text-[10px] text-slate-500">Other fields optional</span>
            </div>

            {/* Required Primary Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Postal PIN Code <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Compass className="w-4 h-4 text-amber-600 absolute left-2.5 top-2" />
                  <input
                    type="text"
                    required
                    maxLength="6"
                    pattern="[0-9]{6}"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
                    placeholder="e.g. 682001"
                    className="w-full pl-8 pr-2.5 py-1.5 font-mono font-bold border-2 border-amber-400 rounded outline-none bg-amber-50/20"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Contact Phone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Phone number"
                    className="w-full pl-8 pr-2.5 py-1.5 border border-slate-300 rounded outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Contact Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Full name"
                    className="w-full pl-8 pr-2.5 py-1.5 border border-slate-300 rounded outline-none font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Nearby Shelter Finder */}
            <NearbyCampsFinder
              pincode={formData.pincode}
              selectedCampName={formData.campName}
              onSelectCamp={handleCampSelect}
              existingRequests={requests}
            />

            {/* Optional Requisition Details */}
            <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Relief Camp / Shelter Name <span className="text-slate-400">(Optional)</span>
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" />
                  <input
                    type="text"
                    value={formData.campName}
                    onChange={(e) => setFormData({ ...formData, campName: e.target.value, shelterName: e.target.value })}
                    placeholder="Auto-detected from PIN"
                    className="w-full pl-8 pr-2.5 py-1.5 border border-slate-300 rounded outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Overall Urgency Level
                </label>
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none bg-white font-bold text-amber-900"
                >
                  <option value="CRITICAL">CRITICAL (Immediate aid within 24h)</option>
                  <option value="HIGH">HIGH (Urgent within 48h)</option>
                  <option value="MODERATE">MODERATE (Ongoing replenishment)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Delivery Gate / Landmark <span className="text-slate-400">(Optional)</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" />
                  <input
                    type="text"
                    value={formData.dropLocation}
                    onChange={(e) => setFormData({ ...formData, dropLocation: e.target.value })}
                    placeholder="e.g. Camp Main Gate, Medical Tent"
                    className="w-full pl-8 pr-2.5 py-1.5 border border-slate-300 rounded outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Camp Requisition Notes <span className="text-slate-400">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="e.g. Sizing requirements, infant counts..."
                  className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 rounded text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
              >
                Add More Items
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-md shadow-md transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Requisition for {totalItemsCount} Items ({totalUnits} Units)</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

