import React, { useState } from 'react';
import { Heart, ShieldCheck, ArrowRight, User, Mail, Phone, MapPin, Compass } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import NearbyCampsFinder from '../common/NearbyCampsFinder';

export default function DonorLogin() {
  const { loginAsDonor, setActiveView } = useAuth();
  const { requests } = useData();

  const [formData, setFormData] = useState({
    pincode: '',
    phone: '',
    name: '',
    email: '',
    city: '',
    donorType: 'Individual'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginAsDonor(formData);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6">
      <div className="mb-6 flex items-center justify-between text-xs text-slate-500">
        <button
          onClick={() => setActiveView('home')}
          className="hover:underline text-slate-600 font-medium"
        >
          ← Back to Disaster Overview
        </button>
        <span className="bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded border border-emerald-200">
          Donor Portal Access
        </span>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Donor Sign In</h1>
              <p className="text-xs text-slate-300">
                Pledge basic survival items and track delivery to relief camps.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-700 flex items-center justify-between">
            <span className="font-semibold text-slate-800">
              Required: <strong className="text-emerald-800 font-mono">PIN Code</strong>, <strong className="text-emerald-800">Phone</strong> & <strong className="text-emerald-800">Name</strong>.
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Email & other info optional
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Postal PIN Code <span className="text-red-500">* Required</span>
              </label>
              <div className="relative">
                <Compass className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  maxLength="6"
                  pattern="[0-9]{6}"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
                  placeholder="e.g. 682001"
                  className="w-full pl-9 pr-3 py-2 text-sm font-mono font-bold border-2 border-emerald-400 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none bg-emerald-50/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Phone Number <span className="text-red-500">* Required</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Mobile number"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 outline-none font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Full Name <span className="text-red-500">* Required</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter name"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 outline-none font-medium"
                />
              </div>
            </div>
          </div>

          {/* Auto-detected Nearby Relief Shelters */}
          <NearbyCampsFinder
            pincode={formData.pincode}
            selectedCampName=""
            existingRequests={requests}
          />

          <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Email Address <span className="text-slate-400">(Optional)</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                City / Location <span className="text-slate-400">(Optional)</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="City"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Donor Type <span className="text-slate-400">(Optional)</span>
              </label>
              <select
                value={formData.donorType}
                onChange={(e) => setFormData({ ...formData, donorType: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 outline-none bg-white font-medium"
              >
                <option value="Individual">Individual</option>
                <option value="Family / Community Group">Family / Community Group</option>
                <option value="Corporate CSR">Corporate CSR</option>
                <option value="Organization">Organization</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-md transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <span>Enter Donor Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>Other portals:</span>
          <div className="flex items-center gap-3 font-medium">
            <button
              onClick={() => setActiveView('receiver-login')}
              className="text-amber-800 hover:underline"
            >
              Receiver Login →
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveView('org-login')}
              className="text-slate-800 hover:underline"
            >
              Helping Organization Login →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
