import React, { createContext, useContext, useState, useEffect } from 'react';

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

  const [activeView, setActiveView] = useState(() => {
    try {
      const savedUser = localStorage.getItem('donation_auth_user');
      const savedView = localStorage.getItem('donation_active_view');

      if (savedUser) {
        const u = JSON.parse(savedUser);
        // If a specific inner view was open, preserve it
        if (savedView && !['donor-login', 'receiver-login', 'org-login', 'volunteer-login'].includes(savedView)) {
          return savedView;
        }
        // Fallback to role-specific portal
        if (u.role === 'DONOR') return 'donor-portal';
        if (u.role === 'RECEIVER') return 'receiver-portal';
        if (u.role === 'ORGANIZATION') return 'org-portal';
        if (u.role === 'VOLUNTEER') return 'volunteer-portal';
      }

      return savedView || 'home';
    } catch (e) {
      return 'home';
    }
  });

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('donation_auth_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('donation_auth_user');
      }
    } catch (e) {
      console.error('Failed to save auth user state', e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      if (activeView) {
        localStorage.setItem('donation_active_view', activeView);
      }
    } catch (e) {
      console.error('Failed to save active view state', e);
    }
  }, [activeView]);

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

    try {
      const saved = localStorage.getItem('donation_registered_donors');
      const list = saved ? JSON.parse(saved) : [];
      const filtered = list.filter(d => (d.phone && d.phone !== user.phone) || (d.email && d.email !== user.email));
      localStorage.setItem('donation_registered_donors', JSON.stringify([user, ...filtered]));
      localStorage.setItem('donation_auth_user', JSON.stringify(user));
      localStorage.setItem('donation_active_view', 'donor-portal');
    } catch {}

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
    try {
      localStorage.setItem('donation_auth_user', JSON.stringify(user));
      localStorage.setItem('donation_active_view', 'receiver-portal');
    } catch {}
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
    try {
      localStorage.setItem('donation_auth_user', JSON.stringify(user));
      localStorage.setItem('donation_active_view', 'org-portal');
    } catch {}
    setCurrentUser(user);
    setActiveView('org-portal');
    return user;
  };

  const loginAsVolunteer = (formData) => {
    const user = {
      id: `usr-vol-${Date.now()}`,
      role: 'VOLUNTEER',
      name: formData.name || 'Disaster Relief Volunteer',
      phone: formData.phone || '',
      email: formData.email || '',
      pincode: formData.pincode || '',
      city: formData.city || '',
      skills: formData.skills && formData.skills.length > 0 ? formData.skills : ['Relief Distribution', 'Field Logistics'],
      availability: formData.availability || 'Immediate On-call',
      vehicleType: formData.vehicleType || 'Two-Wheeler / Bike',
      emergencyContact: formData.emergencyContact || '',
      activeStatus: 'AVAILABLE', // 'AVAILABLE' | 'ON_DUTY' | 'RESTING'
      assignedTasksCount: 0
    };
    try {
      localStorage.setItem('donation_auth_user', JSON.stringify(user));
      localStorage.setItem('donation_active_view', 'volunteer-portal');
    } catch {}
    setCurrentUser(user);
    setActiveView('volunteer-portal');
    return user;
  };

  // Manage Profiles (Update current user's profile)
  const updateUserProfile = (updatedFields) => {
    setCurrentUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedFields };
      try {
        localStorage.setItem('donation_auth_user', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('donation_auth_user');
      localStorage.setItem('donation_active_view', 'home');
    } catch {}
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
        loginAsVolunteer,
        updateUserProfile,
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
