import React, { useState } from 'react';
import {
  UserCheck,
  Phone,
  MessageSquare,
  MapPin,
  Truck,
  Package,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Edit2,
  Search,
  Check,
  AlertTriangle,
  Building,
  Heart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import ProfileEditModal from '../common/ProfileEditModal';
import DirectReceiverContactModal from '../common/DirectReceiverContactModal';

export default function VolunteerDashboard() {
  const { currentUser, updateUserProfile } = useAuth();
  const { requests, pledges, inventory = [], updateRequestStatus } = useData();

  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' | 'camps' | 'resources'
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [directContactRequest, setDirectContactRequest] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [claimedTaskIds, setClaimedTaskIds] = useState(() => {
    try {
      const saved = localStorage.getItem('volunteer_claimed_tasks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const activeStatus = currentUser?.activeStatus || 'AVAILABLE';

  const handleToggleStatus = (newStatus) => {
    updateUserProfile({ activeStatus: newStatus });
  };

  const handleClaimTask = (taskId) => {
    const updated = [...claimedTaskIds, taskId];
    setClaimedTaskIds(updated);
    try {
      localStorage.setItem('volunteer_claimed_tasks', JSON.stringify(updated));
    } catch {}
  };

  const handleCompleteTask = (requestId) => {
    updateRequestStatus(requestId, 'COMPLETED');
    const updated = claimedTaskIds.filter(id => id !== requestId);
    setClaimedTaskIds(updated);
    try {
      localStorage.setItem('volunteer_claimed_tasks', JSON.stringify(updated));
    } catch {}
  };

  // Filter tasks needing volunteer delivery
  const fieldTasks = requests.filter(r => {
    if (r.status === 'COMPLETED') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.itemName.toLowerCase().includes(q) ||
        (r.shelterName || r.campName || '').toLowerCase().includes(q) ||
        (r.pincode || '').includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6 pb-24">
      {/* Volunteer Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <UserCheck className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">
                  Welcome, {currentUser?.name || 'Relief Volunteer'}
                </h1>
                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                  Volunteer Operations
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                <span>{currentUser?.phone ? `📞 ${currentUser.phone}` : ''}</span>
                {currentUser?.pincode && <span>• PIN: <strong>{currentUser.pincode}</strong></span>}
                {currentUser?.vehicleType && <span>• 🚗 {currentUser.vehicleType}</span>}
              </p>

              {/* Skills badges */}
              {currentUser?.skills && currentUser.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {currentUser.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Status Switcher & Edit Profile */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
            <div className="bg-slate-50 p-1 rounded-lg border border-slate-200 flex items-center gap-1 text-xs">
              <button
                type="button"
                onClick={() => handleToggleStatus('AVAILABLE')}
                className={`px-2.5 py-1 rounded font-bold transition-all ${
                  activeStatus === 'AVAILABLE'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ● Available
              </button>
              <button
                type="button"
                onClick={() => handleToggleStatus('ON_DUTY')}
                className={`px-2.5 py-1 rounded font-bold transition-all ${
                  activeStatus === 'ON_DUTY'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ● On Duty
              </button>
              <button
                type="button"
                onClick={() => handleToggleStatus('RESTING')}
                className={`px-2.5 py-1 rounded font-bold transition-all ${
                  activeStatus === 'RESTING'
                    ? 'bg-slate-700 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Off Duty
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowProfileModal(true)}
              className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Manage Profile</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'tasks'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Field Transport & Escort Tasks ({fieldTasks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('camps')}
            className={`px-4 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'camps'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Relief Shelters</span>
          </button>

          <button
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'resources'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Available Warehouse Resources ({inventory.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: FIELD TRANSPORT & ESCORT TASKS */}
      {activeTab === 'tasks' && (
        <div className="space-y-4 text-xs">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search delivery tasks by item, camp, PIN code..."
                className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none text-xs"
              />
            </div>

            <div className="flex items-center gap-2 text-slate-500 font-medium">
              <span>{claimedTaskIds.length} tasks currently claimed by you</span>
            </div>
          </div>

          {fieldTasks.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-700">No active delivery tasks pending right now.</p>
              <p className="text-xs text-slate-500">When camps post urgent shortage requests, they will appear here for transport escort.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fieldTasks.map(task => {
                const isClaimed = claimedTaskIds.includes(task.id);

                return (
                  <div
                    key={task.id}
                    className={`bg-white border rounded-xl p-5 shadow-sm space-y-3 transition-all ${
                      isClaimed ? 'border-blue-500 ring-1 ring-blue-400 bg-blue-50/10' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        Task #{task.id}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            task.urgency === 'CRITICAL'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {task.urgency}
                        </span>
                        <span className="text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                          {task.status || 'PENDING'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{task.itemName}</h3>
                      <div className="text-slate-600 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-medium">{task.shelterName || task.campName}</span>
                        {task.pincode && (
                          <span className="font-mono bg-amber-50 text-amber-800 border border-amber-200 px-1 rounded text-[10px] font-bold">
                            PIN: {task.pincode}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Quantity Needed:</span>
                        <span className="font-bold text-slate-800">{task.quantityNeeded} units</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Receiver Coordinator:</span>
                        <span className="font-bold text-slate-800">{task.requesterName || 'Camp Lead'}</span>
                      </div>
                      {task.requesterPhone && (
                        <div className="flex justify-between">
                          <span className="text-slate-500">Receiver Phone:</span>
                          <a href={`tel:${task.requesterPhone}`} className="font-mono font-bold text-blue-700 underline">
                            {task.requesterPhone}
                          </a>
                        </div>
                      )}
                      <div className="flex justify-between border-t border-slate-200 pt-1">
                        <span className="text-slate-500">Gate Drop Point:</span>
                        <span className="font-semibold text-slate-700">{task.dropLocation || 'Main Gate'}</span>
                      </div>
                    </div>

                    {task.note && (
                      <p className="text-slate-700 italic bg-amber-50/50 p-2 rounded border border-amber-200/60 text-[11px]">
                        "{task.note}"
                      </p>
                    )}

                    {/* Volunteer Action Buttons */}
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setDirectContactRequest(task)}
                        className="px-2.5 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded flex items-center gap-1 transition-colors text-[11px]"
                      >
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span>Contact Receiver</span>
                      </button>

                      {isClaimed ? (
                        <button
                          type="button"
                          onClick={() => handleCompleteTask(task.id)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded flex items-center gap-1 transition-colors text-[11px] shadow-sm"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Delivered to Camp</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleClaimTask(task.id)}
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded flex items-center gap-1 transition-colors text-[11px] shadow-sm"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Assist / Escort Delivery</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: RELIEF SHELTERS */}
      {activeTab === 'camps' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4 text-xs">
          <h3 className="font-bold text-slate-900 text-sm">Designated Field Shelters</h3>
          <p className="text-slate-500">Contact camp representatives directly for field assignment coordination.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {requests.map(r => (
              <div key={r.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                <div className="font-bold text-slate-900 text-sm">{r.shelterName || r.campName}</div>
                <div className="text-slate-600 text-[11px]">PIN: <strong className="font-mono">{r.pincode}</strong></div>
                <div className="text-slate-600 text-[11px]">Contact: <strong>{r.requesterName}</strong></div>
                {r.requesterPhone && (
                  <a href={`tel:${r.requesterPhone}`} className="text-blue-700 font-mono font-bold block underline">
                    {r.requesterPhone}
                  </a>
                )}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => setDirectContactRequest(r)}
                    className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-[11px]"
                  >
                    Direct Contact
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: WAREHOUSE RESOURCES */}
      {activeTab === 'resources' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4 text-xs">
          <h3 className="font-bold text-slate-900 text-sm">Available Warehouse Resources for Transport</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {inventory.map(inv => (
              <div key={inv.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-500">{inv.id}</span>
                  <span className="font-bold text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {inv.availability || 'IN_STOCK'}
                  </span>
                </div>
                <div className="font-bold text-slate-900 text-sm">{inv.item || inv.name}</div>
                <div className="text-slate-600">Stock: <strong className="text-emerald-700">{inv.inStock} {inv.unit}</strong></div>
                <div className="text-slate-500 text-[11px]">Location: {inv.hub || inv.location}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PROFILE EDIT MODAL */}
      {showProfileModal && (
        <ProfileEditModal onClose={() => setShowProfileModal(false)} />
      )}

      {/* DIRECT RECEIVER CONTACT MODAL */}
      {directContactRequest && (
        <DirectReceiverContactModal
          request={directContactRequest}
          onClose={() => setDirectContactRequest(null)}
        />
      )}
    </div>
  );
}

