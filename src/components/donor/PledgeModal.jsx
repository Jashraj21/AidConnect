import React, { useState } from 'react';
import {
  X,
  Check,
  Heart,
  MapPin,
  Truck,
  Package,
  Phone,
  MessageSquare,
  Copy,
  User,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
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
  const [donorPincode, setDonorPincode] = useState(currentUser?.pincode || '');
  const [deliveryMethod, setDeliveryMethod] = useState('DIRECT_CAMP_DROPOFF');
  const [dropoffHub, setDropoffHub] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedPledge, setCompletedPledge] = useState(null);
  const [copied, setCopied] = useState(false);

  const receiverName = request.requesterName || 'Camp Coordinator';
  const receiverPhone = request.requesterPhone || '';
  const cleanPhone = receiverPhone.replace(/\D/g, '');
  const campName = request.shelterName || request.campName || 'Relief Camp';
  const dropLocation = request.dropLocation || 'Camp Main Gate / Reception Point';

  const dispatchMessage = `Hello ${receiverName}, I have pledged to fulfill your relief requirement on DoNation:
- Item: ${quantity} × ${request.itemName}
- For: ${campName}${request.pincode ? ` (PIN ${request.pincode})` : ''}
${completedPledge ? `- Pledge Tracking: #${completedPledge.id}` : `- Request ID: #${request.id}`}
- Delivery Gate: ${dropLocation}

When can I deliver this parcel to you? Thank you.`;

  const encodedMsg = encodeURIComponent(dispatchMessage);
  const whatsappUrl = cleanPhone
    ? `https://wa.me/91${cleanPhone.length === 10 ? cleanPhone : cleanPhone.slice(-10)}?text=${encodedMsg}`
    : `https://wa.me/?text=${encodedMsg}`;

  const smsUrl = cleanPhone ? `sms:${cleanPhone}?body=${encodedMsg}` : `sms:?body=${encodedMsg}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(dispatchMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const destination = deliveryMethod === 'DIRECT_CAMP_DROPOFF'
      ? `Direct Parcel Handover to ${request.shelterName || request.campName} Gate (PIN ${request.pincode})`
      : (dropoffHub || 'Designated Collection Center');

    const pledge = addPledge({
      requestId: request.id,
      donorName: donorName || 'Donor',
      donorEmail,
      donorPhone,
      pincode: donorPincode,
      itemName: request.itemName,
      quantity: parseInt(quantity, 10),
      deliveryMethod,
      dropoffHub: destination
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
          <div className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-7 h-7 stroke-[3]" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Pledge Confirmed & Need Fulfilled!</h4>
              <p className="text-xs text-slate-600">
                Tracking ID: <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">#{completedPledge.id}</span>
              </p>
            </div>

            {/* What Receiver Asked For & What is Fulfilled */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-xs space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 flex items-center justify-between">
                <span>Receiver Requisition Details</span>
                <span className="font-mono font-bold text-slate-900">Request #{request.id}</span>
              </div>

              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Pledged & Fulfilled:</span>
                <span className="font-bold text-emerald-800 text-sm">{completedPledge.quantity} × {completedPledge.itemName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Destination Shelter / Camp:</span>
                <span className="font-bold text-slate-800">
                  {request.shelterName || request.campName}
                  {request.pincode && ` (PIN: ${request.pincode})`}
                </span>
              </div>
              {request.note && (
                <div className="border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500 block text-[10px] font-semibold">Receiver's Note:</span>
                  <span className="text-slate-800 italic">"{request.note}"</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Handover Location:</span>
                <span className="font-semibold text-slate-700">{dropLocation}</span>
              </div>
            </div>

            {/* DIRECT RECEIVER CONTACT CARD */}
            <div className="border-2 border-emerald-500/50 bg-emerald-50/40 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{receiverName}</div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      {request.requesterRole || 'Camp Representative'} • {campName}
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Direct Contact</span>
                </span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5 text-xs font-medium">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Direct Phone:</span>
                  {receiverPhone ? (
                    <a
                      href={`tel:${cleanPhone}`}
                      className="font-mono font-bold text-emerald-700 text-sm underline hover:text-emerald-800 flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{receiverPhone}</span>
                    </a>
                  ) : (
                    <span className="text-slate-400 italic">Not listed</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Delivery Gate:</span>
                  <span className="font-semibold text-slate-800">{dropLocation}</span>
                </div>
              </div>

              {/* 1-Click Call & WhatsApp Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={receiverPhone ? `tel:${cleanPhone}` : '#'}
                  onClick={(e) => {
                    if (!receiverPhone) {
                      e.preventDefault();
                      alert('Phone number was not provided by the receiver for this request.');
                    }
                  }}
                  className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm text-xs text-center"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Receiver</span>
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm text-xs text-center"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Receiver</span>
                </a>
              </div>

              {/* Pre-composed copyable message */}
              <div className="pt-2 border-t border-emerald-200/60 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700">Pre-composed SMS / WhatsApp Message:</span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 text-[11px]"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Message</span>
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  readOnly
                  rows="3"
                  value={dispatchMessage}
                  className="w-full p-2 bg-white border border-slate-200 rounded text-[11px] font-mono text-slate-700 outline-none select-all"
                />
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors"
            >
              Close & View My Pledges
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* What the receiver asked for card */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Receiver Need Requisition #{request.id}
                </span>
                <span className="font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded text-[10px]">
                  {request.urgency} URGENCY
                </span>
              </div>

              <div>
                <div className="font-bold text-base text-slate-900">{request.itemName}</div>
                <div className="text-slate-600 flex items-center gap-1.5 flex-wrap mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-medium">{request.shelterName || request.campName}</span>
                  {request.pincode && (
                    <span className="font-mono bg-amber-50 text-amber-800 border border-amber-200 px-1 py-0.2 rounded text-[10px] font-bold">
                      PIN: {request.pincode}
                    </span>
                  )}
                </div>
              </div>

              {/* Receiver details */}
              <div className="bg-white p-2.5 rounded border border-slate-200 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Receiver Coordinator:</span>
                  <span className="font-bold text-slate-800">
                    {receiverName} {request.requesterRole ? `(${request.requesterRole})` : ''}
                  </span>
                </div>
                {receiverPhone && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Receiver Contact:</span>
                    <a href={`tel:${cleanPhone}`} className="font-mono font-bold text-emerald-700 underline">
                      {receiverPhone}
                    </a>
                  </div>
                )}
                {request.peopleCount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">People Sheltered:</span>
                    <span className="font-medium text-slate-700">~{request.peopleCount} individuals</span>
                  </div>
                )}
                {request.note && (
                  <div className="pt-1 border-t border-slate-100">
                    <span className="text-slate-500 block text-[10px] font-semibold">Receiver's Note:</span>
                    <span className="text-slate-800 italic">"{request.note}"</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-200 text-slate-500">
                <span>Total Needed: <strong>{request.quantityNeeded}</strong></span>
                <span>Already Fulfilled: <strong>{request.quantityFulfilled || 0}</strong></span>
                <span className="text-red-700 font-bold">Remaining to Fulfill: {remainingNeeded}</span>
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
                <option value="DIRECT_CAMP_DROPOFF">Direct Parcel Handover to Camp Gate (Deliver directly to receiver)</option>
                <option value="DROPOFF_AT_HUB">Drop off at Staging Hub / Collection Center</option>
                <option value="DIRECT_COURIER">Direct Courier / Transport Delivery</option>
                <option value="SPONSOR_PURCHASE">Sponsor Direct Procurement</option>
              </select>
            </div>

            {deliveryMethod === 'DIRECT_CAMP_DROPOFF' ? (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-xs space-y-1 text-emerald-950">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Direct Delivery to Shelter Contact:</span>
                </div>
                <div>Receiver: <strong>{request.requesterName || 'Camp Coordinator'}</strong></div>
                {request.requesterPhone && (
                  <div>Direct Phone: <a href={`tel:${request.requesterPhone}`} className="font-mono font-bold text-emerald-800 underline">{request.requesterPhone}</a></div>
                )}
                <div>Destination: <strong>{request.shelterName || request.campName}</strong> (PIN: {request.pincode})</div>
                <div>Drop Landmark: {request.dropLocation || 'Camp Main Gate'}</div>
              </div>
            ) : (
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
            )}

            {/* Donor info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your PIN Code</label>
                <input
                  type="text"
                  maxLength="6"
                  pattern="[0-9]{6}"
                  value={donorPincode}
                  onChange={(e) => setDonorPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 682001"
                  className="w-full px-3 py-1.5 font-mono font-bold border border-slate-300 rounded outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="Name"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mobile Phone <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  required
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                  placeholder="Phone"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 outline-none font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email (Optional)</label>
              <input
                type="email"
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                placeholder="name@example.com"
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
