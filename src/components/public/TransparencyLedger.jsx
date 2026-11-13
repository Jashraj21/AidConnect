import React, { useState } from 'react';
import { ShieldCheck, Truck, Search } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function TransparencyLedger() {
  const { pledges, requests } = useData();
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
              <span>Public Verification & Transparency</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Disaster Relief Transparency Ledger</h1>
            <p className="text-xs text-slate-500 mt-1">
              Public record of all pledged supplies, staging hub deliveries, and distribution status.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-3 rounded-lg text-xs">
            <div>
              <div className="text-slate-400 font-semibold uppercase text-[10px]">Total Supplies Pledged</div>
              <div className="text-lg font-bold text-slate-900">{pledges.reduce((s, p) => s + (p.quantity || 0), 0)} units</div>
            </div>
            <div className="border-l border-slate-200 pl-4">
              <div className="text-slate-400 font-semibold uppercase text-[10px]">Confirmed Pledges</div>
              <div className="text-lg font-bold text-emerald-700">{pledges.length}</div>
            </div>
          </div>
        </div>

        {pledges.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-200">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ledger by Pledge ID, Donor, or Item..."
              className="w-full sm:max-w-md px-3.5 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>
        )}
      </div>

      {pledges.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-2">
          <p className="text-sm font-semibold text-slate-700">No pledges recorded in the ledger yet.</p>
          <p className="text-xs text-slate-500">When donors pledge supplies against relief requests, each record will appear here transparently.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-semibold tracking-wider">
                <tr>
                  <th className="py-3 px-4">Pledge ID</th>
                  <th className="py-3 px-4">Donor</th>
                  <th className="py-3 px-4">Relief Supply</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Staging Hub</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredPledges.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{p.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{p.donorName}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{p.itemName}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{p.quantity}</td>
                    <td className="py-3.5 px-4 text-slate-600">{p.dropoffHub}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full font-bold text-[10px] bg-slate-100 text-slate-800">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
