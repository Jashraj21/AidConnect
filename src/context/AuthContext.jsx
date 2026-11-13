import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('donation_auth_user');
      if (saved && (saved.includes('usr-donor-1') || saved.includes('usr-recv-1') || saved.includes('usr-org-1'))) {
        localStorage.removeItem('donation_auth_user');
        return null;
      }
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [activeView, setActiveView] = useState('home'); 
  // 'home', 'needs-feed', 'camps', 'transparency', 'donor-login', 'receiver-login', 'org-login', 'donor-portal', 'receiver-portal', 'org-portal', 'emergency-quick'

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
      pincode: formData.pincode || '',
      city: formData.city || '',
      donorType: formData.donorType || 'Individual',
      pledgesCount: 0
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
      campName: formData.campName || formData.shelterName || 'Disaster Relief Shelter',
      shelterName: formData.shelterName || formData.campName || 'Disaster Relief Shelter',
      pincode: formData.pincode || '',
      designation: formData.designation || 'Camp Coordinator',
      zoneName: formData.zoneName || 'Affected Zone',
      phone: formData.phone || '',
      location: formData.location || '',
      shelterSize: formData.shelterSize || ''
    };
    setCurrentUser(user);
    setActiveView('receiver-portal');
    return user;
  };

  const loginAsOrganization = (formData) => {
    const user = {
      id: `usr-org-${Date.now()}`,
      role: 'ORGANIZATION',
      orgName: formData.orgName || 'Disaster Relief Organization',
      coordinatorName: formData.coordinatorName || '',
      regNo: formData.regNo || '',
      email: formData.email || '',
      phone: formData.phone || '',
      pincode: formData.pincode || '',
      verified: true
    };
    setCurrentUser(user);
    setActiveView('org-portal');
    return user;
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
