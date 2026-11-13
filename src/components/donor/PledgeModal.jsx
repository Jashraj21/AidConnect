import React, { useState } from 'react';
import { X, Check, Heart, MapPin, Truck, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export default function PledgeModal({ request, onClose, onSuccess }) {
  const { currentUser } = useAuth();
  const { addPledge } = useData();

  const remainingNeeded = Math.max(1, request.quantityNeeded - (request.quantityFulfilled || 0));

  const [quantity, setQuantity] = useState(Math.min(remainingNeeded, 10));
  const [donorName, setDonorName] = useState(currentUser?.name || '');
  const [donorEmail, setDonorEmail] = useState(currentUser?.email || '');
  const [donorPhone, setDonorPhone] = useState(currentUser?.phone || '');
  const [deliveryMethod, setDeliveryMethod] = useState('DROPOFF_AT_HUB');
  const [dropoffHub, setDropoffHub] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedPledge, setCompletedPledge] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const pledge = addPledge({
      requestId: request.id,
      donorName: donorName || 'Donor',
      donorEmail,
      donorPhone,
      itemName: request.itemName,
      quantity: parseInt(quantity, 10),
      deliveryMethod,
      dropoffHub: dropoffHub || 'Designated Collection Center'
    });

    setIsSubmitting(false);
    setCompletedPledge(pledge);
    if (onSuccess) onSuccess(pledge);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-emerald-600 flex items-center justify-center text-white">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="font-bold text-base">Pledge Relief Supply</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {completedPledge ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">Pledge Confirmed</h4>
              <p className="text-xs text-slate-600 mt-1">
                Tracking ID: <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{completedPledge.id}</span>
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Item & Quantity:</span>
                <span className="font-bold text-slate-800">{completedPledge.quantity} × {completedPledge.itemName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Destination Camp:</span>
                <span className="font-medium text-slate-800">
                  {request.shelterName || request.campName}
                  {request.pincode && ` (PIN: ${request.pincode})`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Delivery Mode:</span>
                <span className="font-semibold text-emerald-800">{completedPledge.deliveryMethod}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-md transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Request #{request.id}</span>
                <span className="font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded text-[10px]">
                  {request.urgency}
                </span>
              </div>
              <div className="font-bold text-sm text-slate-900">{request.itemName}</div>
              <div className="text-slate-600 flex items-center gap-1.5 flex-wrap">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{request.shelterName || request.campName}</span>
                {request.pincode && (
                  <span className="font-mono bg-amber-50 text-amber-800 border border-amber-200 px-1 py-0.2 rounded text-[10px] font-bold">
                    PIN: {request.pincode}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200 text-slate-500">
                <span>Needed: <strong>{request.quantityNeeded}</strong></span>
                <span>Fulfilled: <strong>{request.quantityFulfilled || 0}</strong></span>
                <span className="text-amber-800 font-bold">Remaining: {remainingNeeded}</span>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Quantity to Pledge (Remaining: {remainingNeeded}) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max={remainingNeeded}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                className="w-32 px-3 py-2 text-sm font-bold border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* Delivery Method */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Handover / Delivery Method <span className="text-red-500">*</span>
              </label>
              <select
                value={deliveryMethod}
                onChange={(e) => setDeliveryMethod(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white font-medium outline-none"
              >
                <option value="DROPOFF_AT_HUB">Drop off at Staging Hub / Collection Center</option>
                <option value="DIRECT_COURIER">Direct Courier / Transport Delivery</option>
                <option value="SPONSOR_PURCHASE">Sponsor Direct Procurement</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Staging Point or Collection Hub
              </label>
              <input
                type="text"
                value={dropoffHub}
                onChange={(e) => setDropoffHub(e.target.value)}
                placeholder="e.g. Nearest Community Center / Hub"
                className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none"
              />
            </div>

            {/* Donor info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="Name"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={donorPhone}
                onChange={(e) => setDonorPhone(e.target.value)}
                placeholder="Phone"
                className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Heart className="w-4 h-4 fill-current" />
                <span>Confirm Pledge</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
