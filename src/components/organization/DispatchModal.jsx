import React, { useState } from 'react';
import { X, Truck, Check, AlertCircle } from 'lucide-react';

export default function DispatchModal({ request, onClose, onConfirm }) {
  const [vehicleNo, setVehicleNo] = useState('KL-12-E-' + Math.floor(1000 + Math.random() * 9000));
  const [driverContact, setDriverContact] = useState('+91 94470 ' + Math.floor(10000 + Math.random() * 90000));
  const [assignedVolunteer, setAssignedVolunteer] = useState('SDRF Logistics Escort Unit #3');
  const [batchNote, setBatchNote] = useState(`Dispatched from regional warehouse to ${request.campName}`);

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(request.id, {
      vehicleNo,
      driverContact,
      assignedVolunteer,
      batchNote
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden">
        <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-sm">Dispatch Relief Convoy</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
            <div className="font-bold text-slate-800">{request.itemName} ({request.quantityNeeded} units)</div>
            <div className="text-slate-500">Destination: <strong>{request.campName}</strong></div>
            <div className="text-slate-500">Handover Point: {request.dropLocation}</div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Vehicle / Truck Plate Number <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              value={vehicleNo}
              onChange={(e) => setVehicleNo(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 outline-none font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Driver / Transport Phone <span className="text-red-500">*</span></label>
            <input
              type="tel"
              required
              value={driverContact}
              onChange={(e) => setDriverContact(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Assigned Relief Officer / Escort</label>
            <input
              type="text"
              value={assignedVolunteer}
              onChange={(e) => setAssignedVolunteer(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Dispatch Notes / Gate Pass Instructions</label>
            <textarea
              rows="2"
              value={batchNote}
              onChange={(e) => setBatchNote(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded shadow-sm flex items-center gap-1.5"
            >
              <Truck className="w-4 h-4" />
              <span>Confirm Convoy Dispatch</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

