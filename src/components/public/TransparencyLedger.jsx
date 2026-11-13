import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  Search,
  IndianRupee,
  Package,
  FileText,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import MoneyDonationModal from '../donor/MoneyDonationModal';

export default function TransparencyLedger() {
  const {
    pledges,
    monetaryDonations = [],
    totalMonetaryFunds = 0
  } = useData();

  const [activeLedgerTab, setActiveLedgerTab] = useState(monetaryDonations.length > 0 ? 'financial' : 'physical'); // 'financial' | 'physical'
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingReceipt, setViewingReceipt] = useState(null);
  const [showDonateModal, setShowDonateModal] = useState(false);

  const filteredPledges = pledges.filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (p.id || '').toLowerCase().includes(q) ||
      (p.donorName || '').toLowerCase().includes(q) ||
      (p.itemName || '').toLowerCase().includes(q) ||
      (p.dropoffHub || '').toLowerCase().includes(q)
    );
  });

  const filteredMonetary = monetaryDonations.filter(m => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (m.receiptNumber || '').toLowerCase().includes(q) ||
      (m.utr || '').toLowerCase().includes(q) ||
      (m.donorName || '').toLowerCase().includes(q) ||
      (m.targetCampName || '').toLowerCase().includes(q) ||
      (m.targetPincode || '').includes(q) ||
      (m.paymentMethod || '').toLowerCase().includes(q)
    );
  });

  const totalSuppliesUnits = pledges.reduce((s, p) => s + (p.quantity || 0), 0);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Public Auditable Ledger</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Disaster Relief Transparency Ledger</h1>
            <p className="text-xs text-slate-500 mt-1">
              Live, immutable public record of all financial relief funds (80G certified) and physical supply dispatches.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-3 bg-slate-50 border border-slate-200 p-3 rounded-lg text-xs">
            <div>
              <div className="text-slate-400 font-semibold uppercase text-[10px]">Financial Relief Pool</div>
              <div className="text-lg font-bold text-emerald-700">₹{totalMonetaryFunds.toLocaleString('en-IN')}</div>
            </div>
            <div className="border-l border-slate-200 pl-3">
              <div className="text-slate-400 font-semibold uppercase text-[10px]">80G Receipts Issued</div>
              <div className="text-lg font-bold text-slate-900">{monetaryDonations.length}</div>
            </div>
            <div className="border-l border-slate-200 pl-3">
              <div className="text-slate-400 font-semibold uppercase text-[10px]">Physical Supplies</div>
              <div className="text-lg font-bold text-blue-700">{totalSuppliesUnits} units</div>
            </div>
            <button
              type="button"
              onClick={() => setShowDonateModal(true)}
              className="ml-auto px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-xs shadow-sm flex items-center gap-1 transition-colors"
            >
              <IndianRupee className="w-3.5 h-3.5" />
              <span>Donate Money</span>
            </button>
          </div>
        </div>

        {/* Tab Toggle Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <button
              onClick={() => setActiveLedgerTab('financial')}
              className={`px-4 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
                activeLedgerTab === 'financial'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <IndianRupee className="w-3.5 h-3.5" />
              <span>Financial Relief Ledger (₹{totalMonetaryFunds.toLocaleString('en-IN')})</span>
            </button>

            <button
              onClick={() => setActiveLedgerTab('physical')}
              className={`px-4 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
                activeLedgerTab === 'physical'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Physical Supplies Ledger ({pledges.length} Pledges)</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeLedgerTab === 'financial'
                  ? 'Search receipt, donor, UTR, camp...'
                  : 'Search pledge ID, donor, or item...'
              }
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* VIEW 1: FINANCIAL RELIEF LEDGER */}
      {activeLedgerTab === 'financial' && (
        <div className="space-y-4">
          {monetaryDonations.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <IndianRupee className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700">No monetary donations recorded in the public ledger yet.</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                When donors contribute funds for clean water, hot food, and emergency shelter medicine, all verified 80G receipts appear here publicly for audit compliance.
              </p>
              <button
                type="button"
                onClick={() => setShowDonateModal(true)}
                className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors inline-flex items-center gap-1.5"
              >
                <IndianRupee className="w-3.5 h-3.5" />
                <span>Make First Monetary Donation</span>
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-3 bg-emerald-50/70 border-b border-emerald-100 px-4 flex items-center justify-between text-xs text-emerald-950">
                <span className="flex items-center gap-1.5 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Public 80G Tax-Deductible Disaster Fund Ledger — All Transactions Live Audited</span>
                </span>
                <span className="font-mono text-[11px] font-bold text-emerald-800">
                  Total: ₹{totalMonetaryFunds.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-semibold tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Receipt #</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Donor Name</th>
                      <th className="py-3 px-4">Beneficiary Camp / Fund</th>
                      <th className="py-3 px-4">Amount (₹)</th>
                      <th className="py-3 px-4">Bank UTR / Mode</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">80G Voucher</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredMonetary.map(m => (
                      <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          {m.receiptNumber}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                          {new Date(m.timestamp).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          {m.donorName}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-800">
                          <div>{m.targetCampName}</div>
                          {m.targetPincode && (
                            <span className="font-mono text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-1 py-0.2 rounded font-bold">
                              PIN: {m.targetPincode}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-emerald-700 text-sm">
                          ₹{m.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                          <div>{m.utr}</div>
                          <span className="text-[10px] text-slate-400 font-sans">{m.paymentMethod}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {m.status || 'VERIFIED'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setViewingReceipt(m)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 rounded text-slate-700 font-bold text-[11px] transition-colors inline-flex items-center gap-1"
                          >
                            <FileText className="w-3 h-3 text-emerald-600" />
                            <span>View 80G</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: PHYSICAL SUPPLIES LEDGER */}
      {activeLedgerTab === 'physical' && (
        <div className="space-y-4">
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
      )}

      {/* 80G RECEIPT VIEWER MODAL */}
      {viewingReceipt && (
        <MoneyDonationModal
          onClose={() => setViewingReceipt(null)}
          initialReceipt={viewingReceipt}
        />
      )}

      {/* DONATE MONEY MODAL */}
      {showDonateModal && (
        <MoneyDonationModal
          onClose={() => setShowDonateModal(false)}
          onDonationComplete={() => {
            setActiveLedgerTab('financial');
          }}
        />
      )}
    </div>
  );
}
