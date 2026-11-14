import React, { useState } from 'react';
import { UserCheck, ShieldCheck, ArrowRight, User, Mail, Phone, MapPin, Compass, Truck, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import NearbyCampsFinder from '../common/NearbyCampsFinder';

export default function VolunteerLogin() {
  const { loginAsVolunteer, setActiveView } = useAuth();
  const { requests } = useData();

  const [formData, setFormData] = useState({
    pincode: '',
    phone: '',
    name: '',
    email: '',
    city: '',
    availability: 'Immediate On-call',
    vehicleType: 'Two-Wheeler / Bike',
    skills: ['Relief Distribution', 'Field Logistics']
  });

  const availableSkillOptions = [
    'First Aid / Medical',
    'Relief Distribution',
    'Field Logistics & Transport',
    'Food Prep & Community Cooking',
    'Search & Shelter Rescue',
    'Child & Elderly Care'
  ];

  const handleToggleSkill = (skill) => {
    setFormData(prev => {
      const exists = prev.skills.includes(skill);
      if (exists) {
        return { ...prev, skills: prev.skills.filter(s => s !== skill) };
      } else {
        return { ...prev, skills: [...prev.skills, skill] };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginAsVolunteer(formData);
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
        <span className="bg-blue-50 text-blue-800 font-semibold px-2 py-0.5 rounded border border-blue-200">
          Volunteer Portal Access
        </span>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <UserCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Volunteer Registration & Sign In</h1>
              <p className="text-xs text-slate-300">
                Join ground relief operations, assist camp distribution, and escort essential parcel deliveries.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-3 text-xs text-blue-950 flex items-center justify-between">
            <span className="font-semibold">
              Only Required: <strong className="font-mono text-blue-900">PIN Code</strong>, <strong className="text-blue-900">Phone</strong> & <strong className="text-blue-900">Name</strong>.
            </span>
            <span className="text-[11px] text-blue-700 font-medium">
              Everything else optional
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Postal PIN Code <span className="text-red-500">* Required</span>
              </label>
              <div className="relative">
                <Compass className="w-4 h-4 text-blue-600 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  maxLength="6"
                  pattern="[0-9]{6}"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
                  placeholder="e.g. 682001"
                  className="w-full pl-9 pr-3 py-2 text-xs font-mono font-bold border-2 border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-blue-50/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Mobile Phone <span className="text-red-500">* Required</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 9876543210"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none font-medium"
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
                  placeholder="e.g. Rahul Sharma"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none font-medium"
                />
              </div>
            </div>
          </div>

          {/* Optional Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Email Address (Optional)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Vehicle Available (Optional)
              </label>
              <select
                value={formData.vehicleType}
                onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white outline-none"
              >
                <option value="None">None (Foot Volunteer)</option>
                <option value="Two-Wheeler / Bike">Two-Wheeler / Bike</option>
                <option value="Car / SUV">Car / SUV</option>
                <option value="Van / Auto">Van / Auto</option>
                <option value="Truck / Pickup">Truck / Pickup</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Availability (Optional)
              </label>
              <select
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white outline-none"
              >
                <option value="Immediate On-call">Immediate On-call</option>
                <option value="Full-time Field">Full-time Field</option>
                <option value="Weekends Only">Weekends Only</option>
              </select>
            </div>
          </div>

          {/* Volunteer Skills Checkboxes */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-800">
              Volunteer Capabilities & Field Skills:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {availableSkillOptions.map(skill => {
                const checked = formData.skills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleToggleSkill(skill)}
                    className={`p-2 rounded border text-left text-[11px] transition-all flex items-center gap-1.5 ${
                      checked
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] border ${checked ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-300'}`}>
                      {checked ? '✓' : ''}
                    </span>
                    <span className="truncate">{skill}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Automatic Nearby Camps Finder */}
          <NearbyCampsFinder
            pincode={formData.pincode}
            requests={requests}
            onSelectCamp={(camp) => {
              setFormData(prev => ({
                ...prev,
                city: camp.district || camp.state || prev.city
              }));
            }}
          />

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>Register & Access Volunteer Operations</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

