import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useData } from './context/DataContext';

import Navbar from './components/Navbar';
import EmergencyAlertBanner from './components/EmergencyAlertBanner';
import CalamityOverview from './components/public/CalamityOverview';
import PublicReliefFeed from './components/public/PublicReliefFeed';
import CampDirectory from './components/public/CampDirectory';
import TransparencyLedger from './components/public/TransparencyLedger';

import DonorLogin from './components/auth/DonorLogin';
import ReceiverLogin from './components/auth/ReceiverLogin';
import OrgLogin from './components/auth/OrgLogin';

import DonorDashboard from './components/donor/DonorDashboard';
import ReceiverDashboard from './components/receiver/ReceiverDashboard';
import OrgDashboard from './components/organization/OrgDashboard';
import EmergencyQuickRequest from './components/receiver/EmergencyQuickRequest';

import ManifestPrintView from './components/organization/ManifestPrintView';
import UnifiedHub from './components/UnifiedHub';
import { Heart, LifeBuoy, Package, Building2 } from 'lucide-react';

export default function App() {
  const { activeView, setActiveView } = useAuth();
  const [showManifest, setShowManifest] = useState(false);

  const renderCurrentView = () => {
    switch (activeView) {
      case 'home':
        return <CalamityOverview />;
      case 'supply-hub':
        return <UnifiedHub />;
      case 'needs-feed':
        return <PublicReliefFeed />;
      case 'camps':
        return <CampDirectory />;
      case 'transparency':
        return <TransparencyLedger />;
      case 'donor-login':
        return <DonorLogin />;
      case 'receiver-login':
        return <ReceiverLogin />;
      case 'org-login':
        return <OrgLogin />;
      case 'donor-portal':
        return <DonorDashboard />;
      case 'receiver-portal':
        return <ReceiverDashboard />;
      case 'org-portal':
        return <OrgDashboard onOpenManifest={() => setShowManifest(true)} />;
      case 'emergency-quick':
        return <EmergencyQuickRequest />;
      default:
        return <CalamityOverview />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <EmergencyAlertBanner />
      <Navbar />

      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {showManifest && (
        <ManifestPrintView onClose={() => setShowManifest(false)} />
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-8 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6 pb-6 border-b border-slate-800">
            {/* Column 1: Brand */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-red-600 text-white flex items-center justify-center font-bold">
                  <LifeBuoy className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-bold text-white tracking-tight">DoNation</span>
              </div>
              <p className="text-xs text-slate-400">
                Disaster relief basic needs donation and coordination platform.
              </p>
            </div>

            {/* Column 2: Portals */}
            <div className="space-y-2">
              <div className="text-white font-bold text-xs uppercase tracking-wider">Stakeholder Logins</div>
              <ul className="space-y-1.5">
                <li>
                  <button
                    onClick={() => setActiveView('donor-login')}
                    className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                  >
                    <Heart className="w-3 h-3 text-emerald-500" />
                    <span>Donor Login</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveView('receiver-login')}
                    className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                  >
                    <Package className="w-3 h-3 text-amber-500" />
                    <span>Receiver Login</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveView('org-login')}
                    className="hover:text-blue-400 transition-colors flex items-center gap-1.5"
                  >
                    <Building2 className="w-3 h-3 text-blue-400" />
                    <span>Helping Organization Login</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Quick Links */}
            <div className="space-y-2">
              <div className="text-white font-bold text-xs uppercase tracking-wider">Quick Actions</div>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <button
                    onClick={() => setActiveView('emergency-quick')}
                    className="text-red-400 hover:text-red-300 font-bold transition-colors"
                  >
                    Emergency SOS Request (No login) →
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveView('transparency')}
                    className="hover:text-slate-300 transition-colors"
                  >
                    Transparency Ledger
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 text-center">
            DoNation — Web Application for Disaster Relief Basic Needs
          </div>
        </div>
      </footer>
    </div>
  );
}
