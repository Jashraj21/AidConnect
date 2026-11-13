import React, { useState } from 'react';
import {
  Compass,
  Phone,
  Mail,
  Truck,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  Package,
  Send,
  Copy,
  Check,
  X,
  Share2
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import {
  findNearestDonorsForReceiver,
  generateHandoverSlip
} from '../../utils/proximityMatcher';

export default function NearestDonorsSection({ pincode, campNeeds = [], currentUser, className = '' }) {
  const { registeredDonors, pledges, addRequest } = useData();

  const [selectedDonor, setSelectedDonor] = useState(null);
  const [handoverSlip, setHandoverSlip] = useState(null);
  const [copied, setCopied] = useState(false);
  const [handoverConfirmed, setHandoverConfirmed] = useState(false);

  const cleanPin = String(pincode || '').trim().replace(/\D/g, '');
  if (cleanPin.length !== 6) return null;

  const nearestDonors = findNearestDonorsForReceiver(cleanPin, registeredDonors, pledges, campNeeds);

  const handleOpenConnect = (donor) => {
    setSelectedDonor(donor);
    const slip = generateHandoverSlip(
      donor,
      {
        name: currentUser?.name || 'Camp Coordinator',
        phone: currentUser?.phone || 'Field Phone',
        shelterName: currentUser?.campName || currentUser?.shelterName || 'Relief Camp',
        pincode: cleanPin
      },
      campNeeds.slice(0, 3).map(n => `${n.quantityNeeded} ${n.itemName}`).join(', ') || 'Urgent Basic Necessities'
    );
    setHandoverSlip(slip);
    setHandoverConfirmed(false);
  };

  const handleCopyMessage = () => {
    if (handoverSlip?.messageText) {
      navigator.clipboard.writeText(handoverSlip.messageText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConfirmDirectParcel = () => {
    setHandoverConfirmed(true);
  };

  return (
    <div className={`bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border-2 border-emerald-500/40 rounded-xl p-5 shadow-sm space-y-4 ${className}`}>
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-200">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
            </span>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span>Nearest Direct Donors in Your Sector</span>
              <span className="font-mono bg-emerald-100 text-emerald-900 text-xs px-2 py-0.5 rounded border border-emerald-300">
                PIN: {cleanPin}
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-600">
            Algorithm automatically connected to the closest donors for <strong>direct parcel drop-off</strong> at your shelter gate.
          </p>
        </div>

        <span className="text-[11px] font-bold text-emerald-800 bg-white px-3 py-1 rounded-full border border-emerald-300 self-start sm:self-auto shadow-sm">
          {nearestDonors.length} Donors within Delivery Radius
        </span>
      </div>

      {/* Donors Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {nearestDonors.map((donor) => {
          return (
            <div
              key={donor.id}
              className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between text-xs space-y-3"
            >
              <div className="space-y-2">
                {/* Donor Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm leading-tight">{donor.name}</h4>
                    <span className="text-[10px] text-slate-500 font-medium">{donor.donorType}</span>
                  </div>

                  <span className="bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded font-mono text-[11px] shrink-0 border border-emerald-200">
                    📍 {donor.distance} km away
                  </span>
                </div>

                {/* Transit time */}
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-semibold bg-emerald-50/80 px-2 py-1 rounded border border-emerald-100">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>{donor.transitTime}</span>
                </div>

                {/* Contact info */}
                <div className="space-y-1 pt-1 border-t border-slate-100 text-slate-600 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                    <a
                      href={`tel:${donor.phone}`}
                      className="font-mono font-bold text-emerald-700 hover:underline"
                    >
                      {donor.phone}
                    </a>
                  </div>

                  {donor.email && (
                    <div className="flex items-center gap-1.5 truncate text-slate-500">
                      <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{donor.email}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-slate-500">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{donor.area}</span>
                  </div>
                </div>

                {/* Available Supplies */}
                {donor.availableSupplies && donor.availableSupplies.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Direct Supplies Ready:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {donor.availableSupplies.map((sup, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-100 text-slate-800 text-[10px] px-1.5 py-0.5 rounded font-medium border border-slate-200"
                        >
                          {sup}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <a
                  href={`tel:${donor.phone}`}
                  className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded flex items-center gap-1 transition-colors text-[11px]"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call Donor</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleOpenConnect(donor)}
                  className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded flex items-center gap-1 transition-colors text-[11px]"
                >
                  <Truck className="w-3 h-3" />
                  <span>Direct Delivery</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* DIRECT DELIVERY COORDINATION MODAL */}
      {selectedDonor && handoverSlip && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden text-xs">
            {/* Header */}
            <div className="p-4 px-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm">Direct Parcel Handover Coordination</h3>
              </div>
              <button
                onClick={() => setSelectedDonor(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Handover Pass Info */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-emerald-900 font-bold bg-white px-2 py-0.5 rounded border border-emerald-300">
                    Handover Pass #{handoverSlip.handoverId}
                  </span>
                  <span className="font-bold text-emerald-800">
                    Distance: {selectedDonor.distance} km
                  </span>
                </div>
                <div className="text-[11px] text-emerald-900">
                  Direct connection between <strong>{selectedDonor.name}</strong> (Donor) and <strong>{handoverSlip.receiverName}</strong> ({handoverSlip.shelterName}, PIN {cleanPin}).
                </div>
              </div>

              {/* Donor Contact Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1.5">
                <div className="font-bold text-slate-800">Donor Contact Information:</div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Name:</span>
                  <span className="font-bold text-slate-900">{selectedDonor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mobile Phone:</span>
                  <a href={`tel:${selectedDonor.phone}`} className="font-mono font-bold text-emerald-700 underline">
                    {selectedDonor.phone}
                  </a>
                </div>
                {selectedDonor.email && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Email:</span>
                    <span className="text-slate-700 font-mono">{selectedDonor.email}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimated Direct Delivery:</span>
                  <span className="font-semibold text-slate-800">{selectedDonor.transitTime}</span>
                </div>
              </div>

              {/* Pre-formatted Dispatch Message */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800">
                    Direct SMS / WhatsApp Message to Donor:
                  </label>
                  <button
                    onClick={handleCopyMessage}
                    className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 text-[11px]"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
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
                  value={handoverSlip.messageText}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded font-mono text-[11px] text-slate-800 outline-none"
                />
              </div>

              {handoverConfirmed ? (
                <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-lg text-emerald-900 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Direct delivery handover initiated! Donor contact notified.</span>
                </div>
              ) : null}

              {/* Action buttons */}
              <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2">
                <a
                  href={`tel:${selectedDonor.phone}`}
                  className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {selectedDonor.name}</span>
                </a>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={handleCopyMessage}
                    className="px-3 py-2 border border-slate-300 rounded font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Copy Text
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDirectParcel}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Authorize Direct Delivery</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

