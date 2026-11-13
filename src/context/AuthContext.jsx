import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_USERS } from '../data/initialData';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('donation_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [activeView, setActiveView] = useState('home'); 
  // 'home', 'zones', 'camps', 'transparency', 'donor-login', 'receiver-login', 'org-login', 'donor-portal', 'receiver-portal', 'org-portal'

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('donation_auth_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('donation_auth_user');
      }
    } catch (e) {
      console.error('Failed to save auth state', e);
    }
  }, [currentUser]);

  const loginAsDonor = (formData) => {
    const user = {
      id: `usr-donor-${Date.now()}`,
      role: 'DONOR',
      name: formData.name || 'Anonymous Supporter',
      email: formData.email || '',
      phone: formData.phone || '',
      city: formData.city || 'Relief Supporter',
      donorType: formData.donorType || 'Individual',
      pledgesCount: 1
    };
    setCurrentUser(user);
    setActiveView('donor-portal');
    return user;
  };

  const loginAsReceiver = (formData) => {
    const user = {
      id: `usr-recv-${Date.now()}`,
      role: 'RECEIVER',
      name: formData.name || 'Camp Representative',
      campName: formData.campName || 'Disaster Relief Shelter',
      designation: formData.designation || 'Relief Camp In-charge',
      zoneId: formData.zoneId || 'zone-1',
      phone: formData.phone || '',
      location: formData.location || 'Affected District',
      shelterSize: formData.shelterSize || 'Displaced Families'
    };
    setCurrentUser(user);
    setActiveView('receiver-portal');
    return user;
  };

  const loginAsOrganization = (formData) => {
    const user = {
      id: `usr-org-${Date.now()}`,
      role: 'ORGANIZATION',
      orgName: formData.orgName || 'Disaster Relief Alliance',
      coordinatorName: formData.coordinatorName || 'Relief Operations Desk',
      regNo: formData.regNo || 'REG-NGO-DISASTER',
      email: formData.email || 'dispatch@reliefops.org',
      phone: formData.phone || '',
      verified: true,
      activeZones: formData.activeZones || ['zone-1', 'zone-2', 'zone-3', 'zone-4']
    };
    setCurrentUser(user);
    setActiveView('org-portal');
    return user;
  };

  const quickDemoLogin = (role) => {
    if (role === 'DONOR') {
      setCurrentUser(DEMO_USERS.donor);
      setActiveView('donor-portal');
    } else if (role === 'RECEIVER') {
      setCurrentUser(DEMO_USERS.receiver);
      setActiveView('receiver-portal');
    } else if (role === 'ORGANIZATION') {
      setCurrentUser(DEMO_USERS.organization);
      setActiveView('org-portal');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveView('home');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        activeView,
        setActiveView,
        loginAsDonor,
        loginAsReceiver,
        loginAsOrganization,
        quickDemoLogin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

