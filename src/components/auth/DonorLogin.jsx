import React, { useState } from 'react';
import { Heart, ShieldCheck, ArrowRight, CheckCircle2, User, Mail, Phone, MapPin, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function DonorLogin() {
  const { loginAsDonor, quickDemoLogin, setActiveView } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    donorType: 'Individual Supporter',
    subscribeAlerts: true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginAsDonor(formData);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6">
      {/* Breadcrumb / Notice */}
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
              <h1 className="text-xl font-bold tracking-tight">Donor & Supporter Sign In</h1>
              <p className="text-xs text-slate-300">
                Pledge basic survival kits, ship essential goods, and track last-mile delivery to relief camps.
              </p>
            </div>
          </div>
        </div>

        {/* Demo Fast-Track Bar */}
        <div className="bg-emerald-50/70 border-b border-emerald-100 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-900">
            <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              <strong>Evaluating or Testing?</strong> Log in instantly with our verified donor profile.
            </span>
          </div>
          <button
            type="button"
            onClick={() => quickDemoLogin('DONOR')}
            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded text-xs transition-colors shrink-0 flex items-center gap-1.5 shadow-sm"
          >
            <span>One-Click Test Login</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name / Organization Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Maya Sharma or Apex Supplies CSR"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Donor Type
              </label>
              <select
                value={formData.donorType}
                onChange={(e) => setFormData({ ...formData, donorType: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
              >
                <option value="Individual Supporter">Individual Citizen</option>
                <option value="Family / Community Group">Family / Community Group</option>
                <option value="Corporate CSR">Corporate CSR Division</option>
                <option value="Diaspora / Overseas Group">Diaspora / Overseas Aid Group</option>
                <option value="Merchant / Wholesaler">Merchant / Supply Vendor</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address (For Dispatch Slip & Tracking) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mobile / WhatsApp (For Logistics Alerts)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98000 00000"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Your City / Location
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g. Kochi, Bengaluru, Delhi, Mumbai"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600">
                <strong>Zero Cash Overhead:</strong> DoNation focuses on direct material needs (drinking water, baby formula, tarpaulins, ORS). You can either ship items to a designated relief hub or coordinate with our verified on-ground logistics partners.
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-md transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <span>Enter Donor Portal & View Shortages</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Role Switcher */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>Looking for another portal?</span>
          <div className="flex items-center gap-3 font-medium">
            <button
              onClick={() => setActiveView('receiver-login')}
              className="text-amber-800 hover:underline"
            >
              Receiver / Relief Camp Login →
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

