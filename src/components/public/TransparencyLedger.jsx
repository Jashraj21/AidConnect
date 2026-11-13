import React, { useState } from 'react';
import { ShieldCheck, Truck, CheckCircle2, Clock, MapPin, Search } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function TransparencyLedger() {
  const { pledges, requests, calamityZones } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPledges = pledges.filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.id.toLowerCase().includes(q) ||
      p.donorName.toLowerCase().includes(q) ||
      p.itemName.toLowerCase().includes(q) ||
      p.dropoffHub.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Public Verification & Accountability</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Disaster Relief Transparency Ledger</h1>
            <p className="text-xs text-slate-500 mt-1">
              Every pledged item, carrier convoy, staging warehouse handover, and camp distribution receipt is recorded publicly.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-3 rounded-lg text-xs">
            <div>
              <div className="text-slate-400 font-semibold uppercase text-[10px]">Total Supplies Dispatched</div>
              <div className="text-lg font-bold text-slate-900">{pledges.reduce((s, p) => s + p.quantity, 0)} units</div>
            </div>
            <div className="border-l border-slate-200 pl-4">
              <div className="text-slate-400 font-semibold uppercase text-[10px]">Verified Pledges</div>
              <div className="text-lg font-bold text-emerald-700">{pledges.length} transactions</div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mt-6 pt-4 border-t border-slate-200">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ledger by Pledge ID (e.g. PLG-501), Donor, Item, or Warehouse Hub..."
            className="w-full sm:max-w-md px-3.5 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 outline-none"
          />
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-semibold tracking-wider">
              <tr>
                <th className="py-3 px-4">Tracking ID</th>
                <th className="py-3 px-4">Donor / Contributor</th>
                <th className="py-3 px-4">Relief Supply</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Destination Camp</th>
                <th className="py-3 px-4">Staging Warehouse</th>
                <th className="py-3 px-4">Status & Logistics Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredPledges.map(p => {
                const req = requests.find(r => r.id === p.requestId);
                return (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{p.id}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{p.donorName}</div>
                      <div className="text-[10px] text-slate-500">{p.donorType}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{p.itemName}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{p.quantity} units</td>
                    <td className="py-3.5 px-4 text-slate-600">{req?.campName || 'Disaster Shelter'}</td>
                    <td className="py-3.5 px-4 text-slate-600 truncate max-w-[170px]">{p.dropoffHub}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          p.status === 'DELIVERED_TO_HUB' || p.status === 'DISTRIBUTED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.status === 'IN_TRANSIT' || p.status === 'DISPATCHED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        <Truck className="w-3 h-3" />
                        <span>{p.status}</span>
                      </span>
                      {p.trackingNotes && (
                        <div className="text-[10px] text-slate-500 mt-1">{p.trackingNotes}</div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

