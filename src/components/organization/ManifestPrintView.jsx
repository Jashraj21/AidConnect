import React from 'react';
import { X, Printer, LifeBuoy, CheckCircle2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export default function ManifestPrintView({ onClose }) {
  const { requests, calamityZones } = useData();
  const { currentUser } = useAuth();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-4xl w-full border border-slate-300 shadow-2xl overflow-hidden my-6">
        {/* Top actions bar (hidden on print) */}
        <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-sm">Field Operations Manifest (Print / Export)</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Manifest</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Area */}
        <div className="p-8 space-y-6 text-slate-900 font-sans">
          {/* Manifest Official Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-red-600 text-white flex items-center justify-center font-bold">
                  <LifeBuoy className="w-5 h-5" />
                </div>
                <h1 className="text-xl font-bold tracking-tight">DoNation Emergency Relief Manifest</h1>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Disaster Humanitarian Aid & Basic Needs Convoy Manifest • Authorized Field Document
              </p>
            </div>
            <div className="text-right text-xs">
              <div>Date: <strong>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</strong></div>
              <div>Time: <strong>{new Date().toLocaleTimeString()}</strong></div>
              <div>Ref No: <strong className="font-mono">MNF-{Date.now().toString().slice(-6)}</strong></div>
            </div>
          </div>

          {/* Org & Operational Details */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded border border-slate-200">
            <div>
              <span className="text-slate-500 font-semibold uppercase text-[10px]">Coordinating Agency:</span>
              <div className="font-bold text-slate-900 text-sm">{currentUser?.orgName || 'SEEDS India Disaster Response'}</div>
              <div className="text-slate-600">Reg No: {currentUser?.regNo || 'NGO-DL/1994/00249'}</div>
              <div className="text-slate-600">Officer: {currentUser?.coordinatorName || 'Shalini Sen (Ops Lead)'}</div>
            </div>
            <div>
              <span className="text-slate-500 font-semibold uppercase text-[10px]">Staging Hub Status:</span>
              <div className="font-bold text-slate-900 text-sm">Meppadi & Jorhat Forward Transit Hubs</div>
              <div className="text-slate-600">Disaster Coverage: 4 Calamity Zones</div>
              <div className="text-slate-600">Priority Level: CRITICAL SUPPLY CONVOY</div>
            </div>
          </div>

          {/* Requisitions & Dispatches Table */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Active Relief Requisitions & Handover Checklist
            </h2>
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <tr>
                  <th className="py-2 px-3 border-r border-slate-300">Req ID</th>
                  <th className="py-2 px-3 border-r border-slate-300">Target Relief Camp</th>
                  <th className="py-2 px-3 border-r border-slate-300">Item Specification</th>
                  <th className="py-2 px-3 border-r border-slate-300 text-center">Req Qty</th>
                  <th className="py-2 px-3 border-r border-slate-300 text-center">Pledged / Dispatched</th>
                  <th className="py-2 px-3 border-r border-slate-300">Convoy / Vehicle</th>
                  <th className="py-2 px-3 text-center">Camp Handover Check</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                {requests.map((r, idx) => (
                  <tr key={r.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="py-2 px-3 font-mono font-bold border-r border-slate-300">{r.id}</td>
                    <td className="py-2 px-3 border-r border-slate-300">
                      <div className="font-semibold">{r.campName}</div>
                      <div className="text-[10px] text-slate-500">Contact: {r.requesterPhone}</div>
                    </td>
                    <td className="py-2 px-3 border-r border-slate-300 font-medium">{r.itemName}</td>
                    <td className="py-2 px-3 border-r border-slate-300 text-center font-bold">{r.quantityNeeded}</td>
                    <td className="py-2 px-3 border-r border-slate-300 text-center font-bold text-slate-900">
                      {r.quantityFulfilled || 0}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-300 font-mono text-[11px]">
                      {r.dispatchDetails ? r.dispatchDetails.vehicleNo : 'Staging at Hub'}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="w-4 h-4 border-2 border-slate-400 mx-auto rounded-sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Verification Signatures Box */}
          <div className="border-t-2 border-slate-900 pt-6 mt-8 grid grid-cols-3 gap-6 text-xs text-center">
            <div>
              <div className="h-12 border-b border-dashed border-slate-400 mb-2" />
              <div className="font-bold text-slate-800">Dispatch Logistics In-Charge</div>
              <div className="text-[10px] text-slate-500">SEEDS / Red Cross Hub Officer</div>
            </div>
            <div>
              <div className="h-12 border-b border-dashed border-slate-400 mb-2" />
              <div className="font-bold text-slate-800">Transport Escort / Driver</div>
              <div className="text-[10px] text-slate-500">Emergency Convoy Lead</div>
            </div>
            <div>
              <div className="h-12 border-b border-dashed border-slate-400 mb-2" />
              <div className="font-bold text-slate-800">Camp Medical Officer / Lead</div>
              <div className="text-[10px] text-slate-500">Receiving Official Signature</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

