import React, { useState } from 'react';
import {
  LifeBuoy,
  Heart,
  Package,
  Building2,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function Navbar() {
  const { currentUser, activeView, setActiveView, logout } = useAuth();
  const { requests } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingRequestsCount = requests.filter(r => r.status === 'PENDING' || r.status === 'VERIFIED').length;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveView('home')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold shadow-sm group-hover:bg-red-700 transition-colors">
                <LifeBuoy className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold tracking-tight text-slate-900">DoNation</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-800 border border-red-200 uppercase tracking-wider">
                    Disaster Relief
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Basic Needs Humanitarian Aid Network</p>
              </div>
            </button>

            {/* Main Nav Links */}
            <nav className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => setActiveView('home')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeView === 'home'
                    ? 'text-red-700 bg-red-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Disaster Overview
              </button>

              <button
                onClick={() => setActiveView('needs-feed')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                  activeView === 'needs-feed'
                    ? 'text-red-700 bg-red-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>Urgent Needs</span>
                {pendingRequestsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-xs bg-red-600 text-white font-bold">
                    {pendingRequestsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveView('camps')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeView === 'camps'
                    ? 'text-red-700 bg-red-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Relief Camps & Hubs
              </button>

              <button
                onClick={() => setActiveView('transparency')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeView === 'transparency'
                    ? 'text-red-700 bg-red-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Transparency Ledger
              </button>
            </nav>
          </div>

          {/* Right Section: Role Login Links & User State */}
          <div className="hidden md:flex items-center gap-3">
            {!currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveView('donor-login')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md border flex items-center gap-1.5 transition-colors ${
                    activeView === 'donor-login'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                      : 'border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Donor Login</span>
                </button>

                <button
                  onClick={() => setActiveView('receiver-login')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md border flex items-center gap-1.5 transition-colors ${
                    activeView === 'receiver-login'
                      ? 'border-amber-600 bg-amber-50 text-amber-900'
                      : 'border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <Package className="w-3.5 h-3.5 text-amber-600" />
                  <span>Receiver Login</span>
                </button>

                <button
                  onClick={() => setActiveView('org-login')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-1.5 transition-colors shadow-sm`}
                >
                  <Building2 className="w-3.5 h-3.5 text-blue-300" />
                  <span>Helping Org Login</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (currentUser.role === 'DONOR') setActiveView('donor-portal');
                    else if (currentUser.role === 'RECEIVER') setActiveView('receiver-portal');
                    else if (currentUser.role === 'ORGANIZATION') setActiveView('org-portal');
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md text-xs font-medium text-slate-900"
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      currentUser.role === 'DONOR'
                        ? 'bg-emerald-600'
                        : currentUser.role === 'RECEIVER'
                        ? 'bg-amber-600'
                        : 'bg-blue-600'
                    }`}
                  />
                  <span className="font-semibold">{currentUser.name || currentUser.orgName}</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    {currentUser.role}
                  </span>
                </button>

                <button
                  onClick={logout}
                  className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-md"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2">
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => { setActiveView('home'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded"
            >
              Disaster Overview
            </button>
            <button
              onClick={() => { setActiveView('needs-feed'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded"
            >
              Urgent Relief Needs ({pendingRequestsCount})
            </button>
            <button
              onClick={() => { setActiveView('camps'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded"
            >
              Relief Camps & Hubs
            </button>
            <button
              onClick={() => { setActiveView('transparency'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded"
            >
              Transparency Ledger
            </button>
          </div>

          <div className="pt-3 border-t border-slate-200 space-y-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Access Portals</div>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => { setActiveView('donor-login'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded text-sm font-medium bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center justify-between"
              >
                <span>Donor Login</span>
                <Heart className="w-4 h-4 text-emerald-600" />
              </button>
              <button
                onClick={() => { setActiveView('receiver-login'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded text-sm font-medium bg-amber-50 text-amber-900 border border-amber-200 flex items-center justify-between"
              >
                <span>Receiver Login</span>
                <Package className="w-4 h-4 text-amber-600" />
              </button>
              <button
                onClick={() => { setActiveView('org-login'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded text-sm font-medium bg-slate-900 text-white flex items-center justify-between"
              >
                <span>Helping Organization Login</span>
                <Building2 className="w-4 h-4 text-blue-300" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
