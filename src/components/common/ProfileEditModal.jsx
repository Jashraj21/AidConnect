import React, { useState } from 'react';
import { User, Phone, MapPin, Mail, Building, Briefcase, Check, X, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ProfileEditModal({ onClose }) {
  const { currentUser, updateUserProfile } = useAuth();

  const [name, setName] = useState(currentUser?.name || currentUser?.orgName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [pincode, setPincode] = useState(currentUser?.pincode || '');
  const [city, setCity] = useState(currentUser?.city || '');
  const [designation, setDesignation] = useState(currentUser?.designation || currentUser?.coordinatorName || '');
  const [campName, setCampName] = useState(currentUser?.campName || currentUser?.shelterName || '');
  const [vehicleType, setVehicleType] = useState(currentUser?.vehicleType || 'Two-Wheeler / Bike');
  const [availability, setAvailability] = useState(currentUser?.availability || 'Immediate On-call');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!currentUser) return null;

  const handleSave = (e) => {
    e.preventDefault();

    const updates = {
      name,
      phone,
      email,
      pincode: pincode.replace(/\D/g, ''),
      city
    };

    if (currentUser.role === 'ORGANIZATION') {
      updates.orgName = name;
      updates.coordinatorName = designation;
    } else if (currentUser.role === 'RECEIVER') {
      updates.campName = campName;
      updates.shelterName = campName;
      updates.designation = designation;
    } else if (currentUser.role === 'VOLUNTEER') {
      updates.vehicleType = vehicleType;
      updates.availability = availability;
    }

    updateUserProfile(updates);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden my-8 text-xs">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-emerald-600 flex items-center justify-center text-white font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Manage Profile Details</h3>
              <p className="text-[11px] text-slate-400 capitalize">
                {currentUser.role?.toLowerCase()} profile settings
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

        {savedSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-7 h-7 stroke-[3]" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Profile Updated Successfully!</h4>
            <p className="text-xs text-slate-500">Your profile details have been saved across the disaster network.</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="p-6 space-y-3.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {currentUser.role === 'ORGANIZATION' ? 'Organization Name' : 'Full Name'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded font-medium focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mobile Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded font-mono font-bold focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Postal PIN Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength="6"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 border border-slate-300 rounded font-mono font-bold focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">City / Region</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Ernakulam / Kochi"
                className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* Role specific inputs */}
            {currentUser.role === 'RECEIVER' && (
              <div>
                <label className="block font-bold text-slate-700 mb-1">Relief Camp / Shelter Name</label>
                <input
                  type="text"
                  value={campName}
                  onChange={(e) => setCampName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded font-medium focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>
            )}

            {currentUser.role === 'ORGANIZATION' && (
              <div>
                <label className="block font-bold text-slate-700 mb-1">Lead Coordinator Name</label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded font-medium focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>
            )}

            {currentUser.role === 'VOLUNTEER' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Vehicle Type</label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded bg-white font-medium outline-none"
                  >
                    <option value="None">None (Foot)</option>
                    <option value="Two-Wheeler / Bike">Two-Wheeler / Bike</option>
                    <option value="Car / SUV">Car / SUV</option>
                    <option value="Van / Auto">Van / Auto</option>
                    <option value="Truck / Pickup">Truck / Pickup</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Availability</label>
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded bg-white font-medium outline-none"
                  >
                    <option value="Immediate On-call">Immediate On-call</option>
                    <option value="Full-time Field">Full-time Field</option>
                    <option value="Weekends Only">Weekends Only</option>
                  </select>
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow-sm transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
