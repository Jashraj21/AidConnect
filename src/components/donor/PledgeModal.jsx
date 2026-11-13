import React, { useState } from 'react';
import { X, Check, Heart, MapPin, Truck, Package, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export default function PledgeModal({ request, onClose, onSuccess }) {
  const { currentUser } = useAuth();
  const { addPledge, calamityZones } = useData();

  const zone = calamityZones.find(z => z.id === request.zoneId);
  const remainingNeeded = Math.max(1, request.quantityNeeded - (request.quantityFulfilled || 0));

  const [quantity, setQuantity] = useState(Math.min(remainingNeeded, 25));
  const [donorName, setDonorName] = useState(currentUser?.name || '');
  const [donorEmail, setDonorEmail] = useState(currentUser?.email || '');
  const [donorPhone, setDonorPhone] = useState(currentUser?.phone || '');
  const [deliveryMethod, setDeliveryMethod] = useState('DROPOFF_AT_HUB'); // DROPOFF_AT_HUB, DIRECT_COURIER, SPONSOR_PURCHASE
  const [trackingNotes, setTrackingNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedPledge, setCompletedPledge] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const pledge = addPledge({
      requestId: request.id,
      donorName: donorName || 'Kind Supporter',
      donorEmail,
      donorPhone,
      itemName: request.itemName,
      quantity: parseInt(quantity, 10),
      deliveryMethod,
      dropoffHub: zone?.hubCenter || 'Regional Emergency Staging Depot',
      trackingNotes: trackingNotes || `Pledge for ${request.campName}`
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
              <p className="text-xs text-slate-300">Direct material aid to relief camps</p>
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
          /* Confirmation Receipt View */
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">Pledge Confirmed & Registered!</h4>
              <p className="text-xs text-slate-600 mt-1">
                Your pledge tracking ID is <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{completedPledge.id}</span>
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Item & Quantity:</span>
                <span className="font-bold text-slate-800">{completedPledge.quantity} × {completedPledge.itemName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Destination Camp:</span>
                <span className="font-medium text-slate-800">{request.campName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Staging Warehouse Hub:</span>
                <span className="font-medium text-slate-800">{completedPledge.dropoffHub}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Delivery Mode:</span>
                <span className="font-semibold text-emerald-800">{completedPledge.deliveryMethod}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              The on-ground relief team and camp coordinator have been notified. Once dispatched or received at the hub, status will update live in the ledger.
            </p>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-md transition-colors"
            >
              Done & Return to Catalog
            </button>
          </div>
        ) : (
          /* Pledge Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* Target request summary card */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Request #{request.id}</span>
                <span className="font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded text-[10px]">
                  {request.urgency} NEED
                </span>
              </div>
              <div className="font-bold text-sm text-slate-900">{request.itemName}</div>
              <div className="text-slate-600 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{request.campName} ({zone?.name || 'Affected Zone'})</span>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200 text-slate-500">
                <span>Total needed: <strong>{request.quantityNeeded}</strong></span>
                <span>Already fulfilled: <strong>{request.quantityFulfilled || 0}</strong></span>
                <span className="text-amber-800 font-bold">Remaining: {remainingNeeded}</span>
              </div>
            </div>

            {/* Quantity selection */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Quantity You Wish to Provide (Max needed: {remainingNeeded}) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max={remainingNeeded * 2}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  className="w-32 px-3 py-2 text-sm font-bold border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 outline-none"
                />
                <div className="flex gap-1.5">
                  {[5, 10, 25, 50, remainingNeeded].filter(v => v <= remainingNeeded).map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setQuantity(v)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded border border-slate-200 text-[11px]"
                    >
                      {v === remainingNeeded ? `All (${v})` : v}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Delivery / Handover Method */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                How Will You Supply This Item? <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <label className={`p-2.5 rounded border cursor-pointer flex flex-col justify-between ${deliveryMethod === 'DROPOFF_AT_HUB' ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 font-semibold' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="DROPOFF_AT_HUB"
                    checked={deliveryMethod === 'DROPOFF_AT_HUB'}
                    onChange={() => setDeliveryMethod('DROPOFF_AT_HUB')}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Drop at Hub</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-normal">Deliver to regional staging warehouse</span>
                </label>

                <label className={`p-2.5 rounded border cursor-pointer flex flex-col justify-between ${deliveryMethod === 'DIRECT_COURIER' ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 font-semibold' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="DIRECT_COURIER"
                    checked={deliveryMethod === 'DIRECT_COURIER'}
                    onChange={() => setDeliveryMethod('DIRECT_COURIER')}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <Truck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Courier / Transport</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-normal">Ship via commercial freight/courier</span>
                </label>

                <label className={`p-2.5 rounded border cursor-pointer flex flex-col justify-between ${deliveryMethod === 'SPONSOR_PURCHASE' ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 font-semibold' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="SPONSOR_PURCHASE"
                    checked={deliveryMethod === 'SPONSOR_PURCHASE'}
                    onChange={() => setDeliveryMethod('SPONSOR_PURCHASE')}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <Package className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Sponsor Purchase</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-normal">Vendor procures & dispatches directly</span>
                </label>
              </div>
            </div>

            {/* Drop Hub note */}
            <div className="bg-slate-100 p-2.5 rounded border border-slate-200 text-slate-600 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <strong>Assigned Staging Point:</strong> {zone?.hubCenter || 'Meppadi Central Staging Hub'}
                <div className="text-[10px] text-slate-500 mt-0.5">Handover note: {request.dropLocation}</div>
              </div>
            </div>

            {/* Donor info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Name / Group</label>
                <input
                  type="text"
                  required
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="e.g. Anandita Menon"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email (For Confirmation Receipt)</label>
                <input
                  type="email"
                  required
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone / WhatsApp</label>
              <input
                type="tel"
                value={donorPhone}
                onChange={(e) => setDonorPhone(e.target.value)}
                placeholder="+91 98000 00000"
                className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Optional Notes / Dispatch Details</label>
              <input
                type="text"
                value={trackingNotes}
                onChange={(e) => setTrackingNotes(e.target.value)}
                placeholder="e.g. Shipping 2 cartons via BlueDart AWB #998822 on Nov 14"
                className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* Submit buttons */}
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
                <span>Confirm Pledge ({quantity} items)</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

