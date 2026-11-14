import React, { useState } from 'react';
import {
  Phone,
  MessageSquare,
  Copy,
  Check,
  X,
  MapPin,
  Package,
  Truck,
  User,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function DirectReceiverContactModal({ request, pledge = null, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!request) return null;

  const receiverName = request.requesterName || 'Camp Coordinator';
  const receiverPhone = request.requesterPhone || '';
  const cleanPhone = receiverPhone.replace(/\D/g, '');
  const campName = request.shelterName || request.campName || 'Relief Camp';
  const pincode = request.pincode || '';
  const itemName = pledge ? pledge.itemName : request.itemName;
  const fulfilledQty = pledge ? pledge.quantity : (request.quantityNeeded || 1);
  const dropLocation = request.dropLocation || 'Camp Main Gate / Reception Point';
  const note = request.note || '';

  // Pre-formatted message for WhatsApp / SMS
  const dispatchMessage = `Hello ${receiverName}, I have pledged to fulfill your relief requirement on AidConnect:
- Item: ${fulfilledQty} × ${itemName}
- Camp: ${campName}${pincode ? ` (PIN ${pincode})` : ''}
${pledge ? `- Pledge Tracking ID: #${pledge.id}` : `- Request ID: #${request.id}`}
- Drop Location: ${dropLocation}

Could you please confirm the best time and gate for parcel handover? Thank you.`;

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

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden my-8 text-xs">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-emerald-600 flex items-center justify-center text-white">
              <Phone className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Direct Receiver Contact</h3>
              <p className="text-[11px] text-slate-300">
                Contact the camp coordinator directly to coordinate parcel delivery
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

        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Fulfillment Status Banner if pledged */}
          {pledge && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center justify-between text-emerald-950">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-700 stroke-[3]" />
                <span className="font-bold">Fulfillment Registered!</span>
              </div>
              <span className="font-mono bg-white px-2 py-0.5 rounded border border-emerald-300 text-emerald-900 font-bold text-[11px]">
                Tracking: #{pledge.id}
              </span>
            </div>
          )}

          {/* What the receiver asked for & what is being fulfilled */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 flex items-center justify-between">
              <span>What Receiver Asked For:</span>
              <span className="font-mono font-bold text-slate-900">Request #{request.id}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div>
                <span className="text-slate-500 block text-[10px]">Supply Required:</span>
                <span className="font-bold text-slate-900 text-sm">{request.itemName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Total Needed / Remaining:</span>
                <span className="font-bold text-red-700">
                  {request.quantityNeeded} needed {request.quantityFulfilled ? `(${request.quantityNeeded - request.quantityFulfilled} left)` : ''}
                </span>
              </div>
            </div>

            {pledge && (
              <div className="bg-emerald-100/60 border border-emerald-200 rounded p-2 text-emerald-950 flex items-center justify-between font-medium">
                <span>You are fulfilling:</span>
                <span className="font-bold text-emerald-800 text-sm">{pledge.quantity} × {itemName}</span>
              </div>
            )}

            {note && (
              <div className="pt-1.5 border-t border-slate-200">
                <span className="text-slate-500 block text-[10px] font-semibold">Receiver's Specific Note:</span>
                <p className="text-slate-800 italic bg-white p-2 rounded border border-slate-200 mt-0.5">
                  "{note}"
                </p>
              </div>
            )}
          </div>

          {/* Receiver Verified Contact Card */}
          <div className="border-2 border-emerald-500/40 bg-emerald-50/30 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">{receiverName}</div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {request.requesterRole || 'Camp Representative'} • {campName}
                  </div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-700" />
                <span>Verified Contact</span>
              </span>
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5 font-medium">
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
                  <span className="text-slate-400 italic">Not provided</span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Shelter / Camp:</span>
                <span className="font-bold text-slate-800">{campName}</span>
              </div>

              {pincode && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Postal PIN Code:</span>
                  <span className="font-mono bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.2 rounded font-bold">
                    {pincode}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-slate-100 pt-1 text-[11px]">
                <span className="text-slate-500">Delivery Gate / Point:</span>
                <span className="font-semibold text-slate-700">{dropLocation}</span>
              </div>
            </div>

            {/* Direct 1-Click Contact Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href={receiverPhone ? `tel:${cleanPhone}` : '#'}
                onClick={(e) => {
                  if (!receiverPhone) {
                    e.preventDefault();
                    alert('Phone number was not provided for this camp lead.');
                  }
                }}
                className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm text-center"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Receiver Directly</span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm text-center"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Copyable Delivery Manifest */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 text-[11px]">
                Pre-composed Delivery Coordination Note:
              </label>
              <button
                type="button"
                onClick={handleCopy}
                className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 text-[11px]"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Message</span>
                  </>
                )}
              </button>
            </div>

            <textarea
              readOnly
              rows="4"
              value={dispatchMessage}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-mono text-[11px] text-slate-700 outline-none select-all"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors text-xs"
          >
            Done / Close
          </button>
        </div>
      </div>
    </div>
  );
}

