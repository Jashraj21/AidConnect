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
import OfflineHelpModal from './components/public/OfflineHelpModal';
import { Heart, LifeBuoy, Package, Building2, ShieldCheck, PhoneCall, RefreshCw } from 'lucide-react';

export default function App() {
  const { activeView, setActiveView, currentUser, quickDemoLogin } = useAuth();
  const { resetAllData } = useData();

  const [showManifest, setShowManifest] = useState(false);
  const [showOfflineGuide, setShowOfflineGuide] = useState(false);

  // Render view
  const renderCurrentView = () => {
    switch (activeView) {
      case 'home':
        return <CalamityOverview onOpenQuickSos={() => setActiveView('emergency-quick')} />;
      case 'needs-feed':
        return <PublicReliefFeed />;
      case 'camps':
        return <CampDirectory />;
      case 'transparency':
        return <TransparencyLedger />;
      case 'donor-login':
        return <DonorLogin />;
      case 'receiver-login':
        return <ReceiverLogin onOpenQuickSos={() => setActiveView('emergency-quick')} />;
      case 'org-login':
        return <OrgLogin />;
      case 'donor-portal':
        return <DonorDashboard />;
      case 'receiver-portal':
        return <ReceiverDashboard onOpenOfflineGuide={() => setShowOfflineGuide(true)} />;
      case 'org-portal':
        return <OrgDashboard onOpenManifest={() => setShowManifest(true)} />;
      case 'emergency-quick':
        return <EmergencyQuickRequest />;
      default:
        return <CalamityOverview onOpenQuickSos={() => setActiveView('emergency-quick')} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Live Calamity Alert Banner */}
      <EmergencyAlertBanner onOpenOfflineGuide={() => setShowOfflineGuide(true)} />

      {/* Main Navigation */}
      <Navbar
        onOpenManifest={() => setShowManifest(true)}
        onOpenOfflineGuide={() => setShowOfflineGuide(true)}
      />

      {/* Active View Container */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Manifest Modal */}
      {showManifest && (
        <ManifestPrintView onClose={() => setShowManifest(false)} />
      )}

      {/* Offline SMS Guide Modal */}
      {showOfflineGuide && (
        <OfflineHelpModal onClose={() => setShowOfflineGuide(false)} />
      )}

      {/* Grounded, Practical Disaster Network Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-10 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800">
            {/* Column 1: Brand & Mandate */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-red-600 text-white flex items-center justify-center font-bold">
                  <LifeBuoy className="w-4 h-4 stroke-[2.5]" />
                </div>
                <span className="text-base font-bold text-white tracking-tight">DoNation</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Emergency basic needs aid network connecting disaster-affected communities, altruistic donors, and verified response organizations with zero intermediary overhead.
              </p>
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>100% Tangible Physical Supplies</span>
              </div>
            </div>

            {/* Column 2: Portals & Logins */}
            <div className="space-y-2">
              <div className="text-white font-bold text-xs uppercase tracking-wider">Stakeholder Portals</div>
              <ul className="space-y-1.5">
                <li>
                  <button
                    onClick={() => setActiveView('donor-login')}
                    className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                  >
                    <Heart className="w-3 h-3 text-emerald-500" />
                    <span>Donor & Supporter Login</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveView('receiver-login')}
                    className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                  >
                    <Package className="w-3 h-3 text-amber-500" />
                    <span>Receiver & Camp In-charge Login</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveView('org-login')}
                    className="hover:text-blue-400 transition-colors flex items-center gap-1.5"
                  >
                    <Building2 className="w-3 h-3 text-blue-400" />
                    <span>Helping Organization (NGO) Login</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveView('emergency-quick')}
                    className="text-red-400 hover:text-red-300 font-bold transition-colors"
                  >
                    Emergency SOS Quick Request →
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Active Sectors */}
            <div className="space-y-2">
              <div className="text-white font-bold text-xs uppercase tracking-wider">Emergency Sectors</div>
              <ul className="space-y-1 text-[11px] text-slate-400">
                <li>• Wayanad Landslide Relief Zone (Kerala)</li>
                <li>• Brahmaputra Flood Sector B (Assam)</li>
                <li>• Coastal Cyclone Dana Shelters (Odisha)</li>
                <li>• Uttarkashi Cloudburst Response (Uttarakhand)</li>
                <li>• Regional Staging Warehouses (Meppadi & Jorhat)</li>
              </ul>
            </div>

            {/* Column 4: Helplines & Testing Tools */}
            <div className="space-y-2.5">
              <div className="text-white font-bold text-xs uppercase tracking-wider">24/7 Disaster Helplines</div>
              <div className="space-y-1 font-mono text-[11px]">
                <div className="text-slate-300">National Emergency: <strong className="text-white">112</strong></div>
                <div className="text-slate-300">NDMA Control Room: <strong className="text-white">1078</strong></div>
                <div className="text-slate-300">Amateur Radio VHF: <strong className="text-amber-400">145.500 MHz</strong></div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={resetAllData}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-medium transition-colors"
                  title="Reset all test requests and pledges to clean defaults"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset Demo Data</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <div>
              © 2026 DoNation Emergency Disaster Relief Aid Network. Open coordination under Humanitarian Charter principles.
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setShowOfflineGuide(true)} className="hover:text-slate-300 underline">
                Low-Bandwidth SMS Protocol
              </button>
              <button onClick={() => setShowManifest(true)} className="hover:text-slate-300 underline">
                Print Field Manifest
              </button>
              <button onClick={() => setActiveView('transparency')} className="hover:text-slate-300 underline">
                Public Transparency Ledger
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

