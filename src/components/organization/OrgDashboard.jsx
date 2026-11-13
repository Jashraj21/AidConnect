import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  Truck,
  Boxes,
  Plus,
  Printer,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { CATEGORIES } from '../../data/initialData';
import DispatchModal from './DispatchModal';

export default function OrgDashboard({ onOpenManifest }) {
  const { currentUser } = useAuth();
  const {
    requests,
    pledges,
    inventory,
    verifyRequest,
    dispatchRequestShipment,
    updatePledgeStatus,
    updateInventoryStock,
    addInventoryItem
  } = useData();

  const [activeTab, setActiveTab] = useState('triage'); // 'triage' | 'inventory' | 'pledges'
  const [dispatchTargetRequest, setDispatchTargetRequest] = useState(null);
  const [showAddStockModal, setShowAddStockModal] = useState(false);

  // New stock form
  const [newStock, setNewStock] = useState({
    hub: '',
    category: 'WATER',
    item: '',
    inStock: 10,
    unit: 'units'
  });

  const pendingTriageCount = requests.filter(r => r.status === 'PENDING').length;
  const verifiedCount = requests.filter(r => r.status === 'VERIFIED' || r.status === 'PARTIALLY_PLEDGED').length;
  const dispatchedCount = requests.filter(r => r.status === 'DISPATCHED').length;
  const totalStockUnits = inventory.reduce((sum, item) => sum + (item.inStock || 0), 0);

  const handleVerify = (reqId) => {
    verifyRequest(reqId, currentUser?.id || 'org');
  };

  const handleDispatchConfirm = (reqId, details) => {
    dispatchRequestShipment(reqId, details);
    setDispatchTargetRequest(null);
  };

  const handleCreateStock = (e) => {
    e.preventDefault();
    if (!newStock.item.trim()) return;
    addInventoryItem(newStock);
    setShowAddStockModal(false);
    setNewStock({
      hub: '',
      category: 'WATER',
      item: '',
      inStock: 10,
      unit: 'units'
    });
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* NGO Command Center Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-700 text-white flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">
                  {currentUser?.orgName || 'Organization Portal'}
                </h1>
                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Helping Organization</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Coordinator: <strong>{currentUser?.coordinatorName || 'Operations Officer'}</strong> {currentUser?.regNo ? `• Reg: ${currentUser.regNo}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenManifest}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Relief Manifest</span>
            </button>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-200">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <div className="text-xs font-semibold text-slate-600">Pending Triage</div>
            <div className="text-2xl font-bold text-red-700 mt-1">{pendingTriageCount}</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <div className="text-xs font-semibold text-slate-600">Verified Needs</div>
            <div className="text-2xl font-bold text-amber-700 mt-1">{verifiedCount}</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <div className="text-xs font-semibold text-slate-600">Dispatched</div>
            <div className="text-2xl font-bold text-blue-700 mt-1">{dispatchedCount}</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <div className="text-xs font-semibold text-slate-600">Inventory Units</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{totalStockUnits}</div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('triage')}
            className={`px-4 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'triage'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Triage & Requests ({requests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'inventory'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Warehouse Stock ({inventory.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pledges')}
            className={`px-4 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'pledges'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Pledges & Convoys ({pledges.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: TRIAGE */}
      {activeTab === 'triage' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {requests.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No incoming requests to triage.
            </div>
          ) : (
            <div className="divide-y divide-slate-200 text-xs">
              {requests.map(req => {
                const fulfilled = req.quantityFulfilled || 0;
                const remaining = Math.max(0, req.quantityNeeded - fulfilled);

                return (
                  <div key={req.id} className="p-5 hover:bg-slate-50/70 transition-colors space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {req.id}
                        </span>
                        <span className="font-bold text-slate-700">{req.category}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-slate-100 text-slate-700">
                          {req.urgency}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {req.status === 'PENDING' && (
                          <button
                            onClick={() => handleVerify(req.id)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow-sm flex items-center gap-1 transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Verify Request</span>
                          </button>
                        )}

                        {req.status !== 'DISPATCHED' && req.status !== 'DELIVERED' && (
                          <button
                            onClick={() => setDispatchTargetRequest(req)}
                            className="px-3 py-1 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded shadow-sm flex items-center gap-1 transition-colors"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Dispatch</span>
                          </button>
                        )}

                        <span className="px-2.5 py-1 rounded-full font-bold text-[10px] bg-slate-100 text-slate-800">
                          {req.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2 space-y-1">
                        <div className="text-base font-bold text-slate-900">{req.itemName}</div>
                        <div className="text-slate-600">Camp: <strong>{req.campName}</strong></div>
                        <div className="text-slate-500 text-[11px]">
                          Requester: {req.requesterName} {req.requesterPhone ? `• Phone: ${req.requesterPhone}` : ''}
                        </div>
                        {req.note && (
                          <div className="text-slate-600 bg-slate-50 p-2 rounded border border-slate-200 italic mt-1">
                            "{req.note}"
                          </div>
                        )}
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Needed:</span>
                          <span className="font-bold text-slate-900">{req.quantityNeeded}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Fulfilled:</span>
                          <span className="font-bold text-emerald-700">{fulfilled}</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-200 pt-1">
                          <span className="text-slate-500">Remaining:</span>
                          <span className="font-bold text-red-700">{remaining}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INVENTORY */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
          <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Warehouse Inventory</h2>
            </div>
            <button
              onClick={() => setShowAddStockModal(true)}
              className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Stock</span>
            </button>
          </div>

          {inventory.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No inventory recorded yet. Click "Add Stock" to add available supply items.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-semibold tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Stock ID</th>
                    <th className="py-3 px-4">Warehouse Hub</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Relief Item</th>
                    <th className="py-3 px-4">In-Stock</th>
                    <th className="py-3 px-4 text-right">Adjust</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {inventory.map(inv => (
                    <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{inv.id}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{inv.hub || 'Warehouse'}</td>
                      <td className="py-3 px-4">{inv.category}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{inv.item}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
                          {inv.inStock} {inv.unit}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1">
                        <button
                          onClick={() => updateInventoryStock(inv.id, 10)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-300 font-semibold text-[11px]"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => updateInventoryStock(inv.id, -10)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-300 font-semibold text-[11px]"
                        >
                          -10
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PLEDGES */}
      {activeTab === 'pledges' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-200">
            <h2 className="text-base font-bold text-slate-900">Inbound Donor Pledges</h2>
          </div>

          {pledges.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No pledges recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-semibold tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Pledge ID</th>
                    <th className="py-3 px-4">Donor Name</th>
                    <th className="py-3 px-4">Item Pledged</th>
                    <th className="py-3 px-4">Quantity</th>
                    <th className="py-3 px-4">Delivery Mode</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {pledges.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{p.id}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{p.donorName}</td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">{p.itemName}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{p.quantity}</td>
                      <td className="py-3.5 px-4">{p.deliveryMethod}</td>
                      <td className="py-3.5 px-4">
                        <select
                          value={p.status}
                          onChange={(e) => updatePledgeStatus(p.id, e.target.value)}
                          className="px-2 py-1 bg-white border border-slate-300 rounded font-bold text-[11px] outline-none"
                        >
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="IN_TRANSIT">IN_TRANSIT</option>
                          <option value="DELIVERED_TO_HUB">DELIVERED_TO_HUB</option>
                          <option value="DISTRIBUTED">DISTRIBUTED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* DISPATCH CONVOY MODAL */}
      {dispatchTargetRequest && (
        <DispatchModal
          request={dispatchTargetRequest}
          onClose={() => setDispatchTargetRequest(null)}
          onConfirm={handleDispatchConfirm}
        />
      )}

      {/* ADD STOCK MODAL */}
      {showAddStockModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden">
            <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between">
              <h3 className="font-bold text-sm">Add Warehouse Stock</h3>
              <button onClick={() => setShowAddStockModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateStock} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Warehouse / Hub Location</label>
                <input
                  type="text"
                  required
                  value={newStock.hub}
                  onChange={(e) => setNewStock({ ...newStock, hub: e.target.value })}
                  placeholder="e.g. Regional Staging Hub"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={newStock.category}
                  onChange={(e) => setNewStock({ ...newStock, category: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  value={newStock.item}
                  onChange={(e) => setNewStock({ ...newStock, item: e.target.value })}
                  placeholder="e.g. Water Cans, Blankets"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newStock.inStock}
                    onChange={(e) => setNewStock({ ...newStock, inStock: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit</label>
                  <input
                    type="text"
                    value={newStock.unit}
                    onChange={(e) => setNewStock({ ...newStock, unit: e.target.value })}
                    placeholder="e.g. units, boxes"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddStockModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded"
                >
                  Add Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
