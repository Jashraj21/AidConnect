import React, { useState } from 'react';
import { Building2, ShieldCheck, ArrowRight, Mail, Phone, Lock, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export default function OrgLogin() {
  const { loginAsOrganization, quickDemoLogin, setActiveView } = useAuth();
  const { calamityZones, organizations } = useData();

  const [formData, setFormData] = useState({
    orgName: 'SEEDS India Disaster Response',
    regNo: 'NGO-DL/1994/00249',
    coordinatorName: 'Shalini Sen',
    email: 'shalini.sen@seedsindia.org',
    phone: '+91 11 2617 4214',
    assignedZones: ['zone-1', 'zone-2', 'zone-4']
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginAsOrganization(formData);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6">
      {/* Back button */}
      <div className="mb-6 flex items-center justify-between text-xs text-slate-500">
        <button
          onClick={() => setActiveView('home')}
          className="hover:underline text-slate-600 font-medium"
        >
          ← Back to Disaster Overview
        </button>
        <span className="bg-blue-50 text-blue-900 font-semibold px-2 py-0.5 rounded border border-blue-200">
          Helping Organization Desk
        </span>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Helping Organization & NGO Sign In</h1>
              <p className="text-xs text-slate-300">
                Central command for disaster relief coordinators to verify requests, manage inventory, and dispatch convoys.
              </p>
            </div>
          </div>
        </div>

        {/* Demo Fast-Track Bar */}
        <div className="bg-blue-50 border-b border-blue-100 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-blue-950">
            <Sparkles className="w-4 h-4 text-blue-700 shrink-0" />
            <span>
              <strong>Evaluating or Testing?</strong> Access as registered NGO coordinator (SEEDS India Disaster Response).
            </span>
          </div>
          <button
            type="button"
            onClick={() => quickDemoLogin('ORGANIZATION')}
            className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded text-xs transition-colors shrink-0 flex items-center gap-1.5 shadow-sm"
          >
            <span>One-Click NGO Login</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Organization / NGO Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.orgName}
                onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                placeholder="e.g. Red Cross Emergency Response"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Govt Reg / FCRA / Darpan ID <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={formData.regNo}
                  onChange={(e) => setFormData({ ...formData, regNo: e.target.value })}
                  placeholder="e.g. NGO-DL/1994/00249"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Field Coordinator / Officer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.coordinatorName}
                onChange={(e) => setFormData({ ...formData, coordinatorName: e.target.value })}
                placeholder="e.g. Dr. Shalini Sen"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Response Cell Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="relief@seedsindia.org"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Field Operations Hotline Phone
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 11 2617 4214"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
            <div className="text-xs font-semibold text-slate-700">Pre-Verified Relief Partners in Network:</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {organizations.map(org => (
                <div key={org.id} className="p-2 bg-white rounded border border-slate-200 text-[11px]">
                  <div className="font-semibold text-slate-900 truncate">{org.name}</div>
                  <div className="text-slate-500 truncate text-[10px]">{org.regNo}</div>
                  <div className="mt-1 flex items-center gap-1 text-emerald-700 font-bold text-[10px]">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-md transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <span>Access Organization Command Center</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Role Switcher */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>Looking for another portal?</span>
          <div className="flex items-center gap-3 font-medium">
            <button
              onClick={() => setActiveView('donor-login')}
              className="text-emerald-800 hover:underline"
            >
              Donor & Supporter Login →
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveView('receiver-login')}
              className="text-amber-800 hover:underline"
            >
              Receiver / Relief Camp Login →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

