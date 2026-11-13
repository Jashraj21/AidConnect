import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const DEFAULT_RESOURCE_LISTINGS = [
  {
    id: 'RES-801',
    item: 'Drinking Water 20L Cans',
    name: 'Drinking Water 20L Cans',
    category: 'WATER',
    inStock: 250,
    unit: 'cans',
    hub: 'Ernakulam Disaster Staging Depot',
    location: 'Kochi, Kerala',
    pincode: '682025',
    availability: 'AVAILABLE',
    condition: 'Sealed & Certified Purified',
    contactPhone: '9847012345',
    donorOrOrgName: 'Kerala Water Relief Mission'
  },
  {
    id: 'RES-802',
    item: 'Dry Ration Food Packets (Biscuits & Grains)',
    name: 'Dry Ration Food Packets (Biscuits & Grains)',
    category: 'FOOD',
    inStock: 500,
    unit: 'packets',
    hub: 'Wayanad Central Staging Camp',
    location: 'Kalpetta, Wayanad',
    pincode: '673121',
    availability: 'AVAILABLE',
    condition: 'Fresh Packaged Foods',
    contactPhone: '9447123890',
    donorOrOrgName: 'Malabar Humanitarian Trust'
  },
  {
    id: 'RES-803',
    item: 'Sanitary Napkins & Personal Hygiene Kits',
    name: 'Sanitary Napkins & Personal Hygiene Kits',
    category: 'HYGIENE',
    inStock: 380,
    unit: 'kits',
    hub: 'Chennai Community Relief Hub',
    location: 'Tambaram, Chennai',
    pincode: '600045',
    availability: 'AVAILABLE',
    condition: 'Sealed Box Packs',
    contactPhone: '9884123456',
    donorOrOrgName: 'Tamil Nadu Relief Volunteers'
  },
  {
    id: 'RES-804',
    item: 'Thermal Blankets & Fleece Bedrolls',
    name: 'Thermal Blankets & Fleece Bedrolls',
    category: 'SHELTER_ESSENTIALS',
    inStock: 180,
    unit: 'pieces',
    hub: 'Idukki Hill Camp Logistics Center',
    location: 'Munnar / Idukki',
    pincode: '685612',
    availability: 'LOW_STOCK',
    condition: 'Clean New Woolen Packs',
    contactPhone: '9496112233',
    donorOrOrgName: 'Rotary Disaster Task Force'
  },
  {
    id: 'RES-805',
    item: 'Emergency ORS & First Aid Antiseptic Kits',
    name: 'Emergency ORS & First Aid Antiseptic Kits',
    category: 'MEDICINE',
    inStock: 420,
    unit: 'kits',
    hub: 'Aluva Medical Relief Center',
    location: 'Aluva, Ernakulam',
    pincode: '683101',
    availability: 'AVAILABLE',
    condition: 'Hospital Certified Stock',
    contactPhone: '9744556677',
    donorOrOrgName: 'Red Cross Disaster Unit'
  },
  {
    id: 'RES-806',
    item: 'Adults & Children Cotton Clothes Bundles',
    name: 'Adults & Children Cotton Clothes Bundles',
    category: 'CLOTHES',
    inStock: 300,
    unit: 'bundles',
    hub: 'Bengaluru Logistics Sorting Center',
    location: 'Whitefield, Bengaluru',
    pincode: '560066',
    availability: 'AVAILABLE',
    condition: 'Sorted & Laundered',
    contactPhone: '9845012345',
    donorOrOrgName: 'Citizen Aid Alliance'
  }
];

export function DataProvider({ children }) {
  const [calamityZones, setCalamityZones] = useState(() => {
    try {
      const saved = localStorage.getItem('donation_zones');
      if (saved && saved.includes('zone-1')) {
        localStorage.removeItem('donation_zones');
        return [];
      }
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [requests, setRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('donation_requests');
      if (saved && saved.includes('REQ-101')) {
        localStorage.removeItem('donation_requests');
        return [];
      }
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [pledges, setPledges] = useState(() => {
    try {
      const saved = localStorage.getItem('donation_pledges');
      if (saved && saved.includes('PLG-501')) {
        localStorage.removeItem('donation_pledges');
        return [];
      }
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [inventory, setInventory] = useState(() => {
    try {
      const saved = localStorage.getItem('donation_inventory');
      if (saved && saved.includes('INV-01')) {
        localStorage.removeItem('donation_inventory');
        return DEFAULT_RESOURCE_LISTINGS;
      }
      return saved && JSON.parse(saved).length > 0 ? JSON.parse(saved) : DEFAULT_RESOURCE_LISTINGS;
    } catch {
      return DEFAULT_RESOURCE_LISTINGS;
    }
  });

  const [registeredDonors, setRegisteredDonors] = useState(() => {
    try {
      const saved = localStorage.getItem('donation_registered_donors');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [monetaryDonations, setMonetaryDonations] = useState(() => {
    try {
      const saved = localStorage.getItem('donation_monetary_funds');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('donation_registered_donors', JSON.stringify(registeredDonors));
  }, [registeredDonors]);

  useEffect(() => {
    localStorage.setItem('donation_monetary_funds', JSON.stringify(monetaryDonations));
  }, [monetaryDonations]);

  const registerDonor = (donorData) => {
    if (!donorData) return;
    setRegisteredDonors(prev => {
      const phone = donorData.phone || '';
      const email = donorData.email || '';
      const filtered = prev.filter(d => {
        if (phone && d.phone === phone) return false;
        if (email && d.email === email) return false;
        return true;
      });
      return [{ ...donorData, lastActive: new Date().toISOString() }, ...filtered];
    });
  };

  const addMonetaryDonation = (donationData) => {
    const amount = parseFloat(donationData.amount) || 0;
    if (amount <= 0) return null;

    const receiptNum = `RCP-80G-${Math.floor(100000 + Math.random() * 900000)}`;
    const utrNum = `UTR/${Date.now().toString().slice(-8)}${Math.floor(100 + Math.random() * 900)}`;

    const donation = {
      id: `FND-${Date.now()}`,
      receiptNumber: receiptNum,
      utr: donationData.utr || utrNum,
      amount,
      donorName: donationData.donorName || 'Anonymous Humanitarian Donor',
      donorPhone: donationData.donorPhone || '',
      donorEmail: donationData.donorEmail || '',
      pincode: donationData.pincode || '',
      panNumber: donationData.panNumber || '',
      targetType: donationData.targetType || 'GENERAL_RELIEF_POOL',
      targetCampName: donationData.targetCampName || 'Disaster Relief Emergency Pool',
      targetPincode: donationData.targetPincode || '',
      paymentMethod: donationData.paymentMethod || 'UPI',
      purpose: donationData.purpose || 'Disaster Survival Necessities & Food Water Sponsoring',
      timestamp: new Date().toISOString(),
      status: 'VERIFIED_RECEIVED',
      taxExempt: '80G Approved (50% Tax Deduction Eligible)'
    };

    setMonetaryDonations(prev => [donation, ...prev]);

    if (donationData.donorName && (donationData.donorPhone || donationData.donorEmail)) {
      registerDonor({
        id: `DONOR-${Date.now()}`,
        name: donationData.donorName,
        phone: donationData.donorPhone,
        email: donationData.donorEmail,
        pincode: donationData.pincode || '',
        donorType: 'Financial Relief Supporter'
      });
    }

    return donation;
  };

  const totalMonetaryFunds = monetaryDonations.reduce((sum, d) => sum + (d.amount || 0), 0);

  // Cross-tab live synchronization
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'donation_requests') {
        try { setRequests(e.newValue ? JSON.parse(e.newValue) : []); } catch {}
      }
      if (e.key === 'donation_pledges') {
        try { setPledges(e.newValue ? JSON.parse(e.newValue) : []); } catch {}
      }
      if (e.key === 'donation_inventory') {
        try { setInventory(e.newValue ? JSON.parse(e.newValue) : []); } catch {}
      }
      if (e.key === 'donation_zones') {
        try { setCalamityZones(e.newValue ? JSON.parse(e.newValue) : []); } catch {}
      }
      if (e.key === 'donation_monetary_funds') {
        try { setMonetaryDonations(e.newValue ? JSON.parse(e.newValue) : []); } catch {}
      }
      if (e.key === 'donation_registered_donors') {
        try { setRegisteredDonors(e.newValue ? JSON.parse(e.newValue) : []); } catch {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('donation_zones', JSON.stringify(calamityZones));
  }, [calamityZones]);

  useEffect(() => {
    localStorage.setItem('donation_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('donation_pledges', JSON.stringify(pledges));
  }, [pledges]);

  useEffect(() => {
    localStorage.setItem('donation_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('donation_registered_donors', JSON.stringify(registeredDonors));
  }, [registeredDonors]);

  useEffect(() => {
    localStorage.setItem('donation_monetary_funds', JSON.stringify(monetaryDonations));
  }, [monetaryDonations]);

  // ==========================================
  // 1. REQUESTS CRUD & WORKFLOW
  // ==========================================

  // CREATE Request (Receiver / Camp)
  const addRequest = (newReq) => {
    const request = {
      id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
      zoneName: newReq.zoneName || 'Calamity Sector',
      campName: newReq.campName || newReq.shelterName || 'Relief Camp / Shelter',
      shelterName: newReq.shelterName || newReq.campName || 'Relief Camp / Shelter',
      pincode: newReq.pincode ? String(newReq.pincode).trim() : '',
      requesterName: newReq.requesterName || 'Camp Lead',
      requesterRole: newReq.requesterRole || 'Camp Representative',
      requesterPhone: newReq.requesterPhone || '',
      peopleCount: parseInt(newReq.peopleCount, 10) || 0,
      category: newReq.category || 'CLOTHES',
      itemName: newReq.itemName || 'Basic Supplies',
      quantityNeeded: parseInt(newReq.quantityNeeded, 10) || 1,
      quantityFulfilled: 0,
      urgency: newReq.urgency || 'HIGH', // CRITICAL, HIGH, MODERATE
      status: 'PENDING', // PENDING -> VERIFIED -> PLEDGED -> DISPATCHED -> ACCEPTED
      verifiedByOrgId: null,
      note: newReq.note || '',
      dateCreated: new Date().toISOString(),
      dropLocation: newReq.dropLocation || 'Camp Main Gate'
    };

    setRequests(prev => [request, ...prev]);
    return request;
  };

  // BATCH CREATE Requests (Receiver cart with multiple items)
  const addBatchRequests = (commonDetails, itemsList) => {
    const createdRequests = itemsList.map((item, index) => ({
      id: `REQ-${Math.floor(100 + Math.random() * 900)}-${index + 1}`,
      zoneName: commonDetails.zoneName || 'Calamity Sector',
      campName: commonDetails.campName || commonDetails.shelterName || 'Relief Camp / Shelter',
      shelterName: commonDetails.shelterName || commonDetails.campName || 'Relief Camp / Shelter',
      pincode: commonDetails.pincode ? String(commonDetails.pincode).trim() : '',
      requesterName: commonDetails.requesterName || 'Camp Lead',
      requesterRole: commonDetails.requesterRole || 'Camp Representative',
      requesterPhone: commonDetails.requesterPhone || '',
      peopleCount: parseInt(commonDetails.peopleCount, 10) || 0,
      category: item.category || 'SHELTER_ESSENTIALS',
      itemName: item.name || item.itemName || 'Basic Necessity',
      quantityNeeded: parseInt(item.quantity || item.quantityNeeded, 10) || 1,
      quantityFulfilled: 0,
      urgency: item.urgency || commonDetails.urgency || 'HIGH',
      status: 'PENDING',
      verifiedByOrgId: null,
      note: item.note || commonDetails.note || '',
      dateCreated: new Date().toISOString(),
      dropLocation: commonDetails.dropLocation || 'Camp Main Gate'
    }));

    setRequests(prev => [...createdRequests, ...prev]);
    return createdRequests;
  };

  // UPDATE Request (Edit request parameters)
  const updateRequest = (requestId, updatedFields) => {
    setRequests(prev =>
      prev.map(req => {
        if (req.id === requestId) {
          return { ...req, ...updatedFields, lastModified: new Date().toISOString() };
        }
        return req;
      })
    );
  };

  // DELETE Request (Cancel need)
  const deleteRequest = (requestId) => {
    setRequests(prev => prev.filter(req => req.id !== requestId));
  };

  // ==========================================
  // 2. DONATION ACCEPTANCE & WORKFLOW METHODS
  // ==========================================

  // Step 2: Org Verifies Request
  const verifyRequest = (requestId, orgName = 'Helping Organization') => {
    setRequests(prev =>
      prev.map(req => {
        if (req.id === requestId) {
          return {
            ...req,
            status: req.quantityFulfilled > 0 ? 'PARTIALLY_PLEDGED' : 'VERIFIED',
            verifiedByOrg: orgName,
            verifiedAt: new Date().toISOString()
          };
        }
        return req;
      })
    );
  };

  // Step 3: Donor Pledges (Add Pledge)
  const addPledge = (pledgeData) => {
    const qty = parseInt(pledgeData.quantity, 10) || 1;
    const newPledge = {
      id: `PLG-${Math.floor(500 + Math.random() * 500)}`,
      requestId: pledgeData.requestId || 'OPEN_PLEDGE',
      donorName: pledgeData.donorName || 'Donor',
      donorEmail: pledgeData.donorEmail || '',
      donorPhone: pledgeData.donorPhone || '',
      pincode: pledgeData.pincode || pledgeData.donorPincode || '',
      itemName: pledgeData.itemName,
      quantity: qty,
      deliveryMethod: pledgeData.deliveryMethod || 'DROPOFF_AT_HUB',
      dropoffHub: pledgeData.dropoffHub || 'Regional Staging Hub',
      pledgeDate: new Date().toISOString(),
      status: 'CONFIRMED', // CONFIRMED -> IN_TRANSIT -> DELIVERED_TO_HUB -> ACCEPTED
      trackingNotes: pledgeData.trackingNotes || 'Pledge registered by donor'
    };

    if (pledgeData.donorName && (pledgeData.donorPhone || pledgeData.donorEmail)) {
      registerDonor({
        id: `DONOR-${Date.now()}`,
        name: pledgeData.donorName,
        phone: pledgeData.donorPhone,
        email: pledgeData.donorEmail,
        pincode: pledgeData.pincode || pledgeData.donorPincode || '',
        donorType: 'Pledged Supporter'
      });
    }

    setPledges(prev => [newPledge, ...prev]);

    // Update corresponding request if linked
    if (pledgeData.requestId && pledgeData.requestId.startsWith('REQ-')) {
      setRequests(prev =>
        prev.map(req => {
          if (req.id === pledgeData.requestId) {
            const newFulfilled = (req.quantityFulfilled || 0) + qty;
            const isFull = newFulfilled >= req.quantityNeeded;
            return {
              ...req,
              quantityFulfilled: newFulfilled,
              status: isFull ? 'DISPATCHED' : 'PARTIALLY_PLEDGED'
            };
          }
          return req;
        })
      );
    }

    return newPledge;
  };

  // UPDATE Pledge
  const updatePledge = (pledgeId, updatedFields) => {
    setPledges(prev =>
      prev.map(p => (p.id === pledgeId ? { ...p, ...updatedFields } : p))
    );
  };

  // DELETE Pledge (Cancel donor pledge)
  const deletePledge = (pledgeId) => {
    setPledges(prev => prev.filter(p => p.id !== pledgeId));
  };

  // Step 4: Organization Dispatches Shipment / Convoy
  const dispatchRequestShipment = (requestId, dispatchDetails) => {
    setRequests(prev =>
      prev.map(req => {
        if (req.id === requestId) {
          return {
            ...req,
            status: 'DISPATCHED',
            dispatchDetails: {
              dispatchedAt: new Date().toISOString(),
              vehicleNo: dispatchDetails.vehicleNo || 'RELIEF-TRANSPORT',
              driverContact: dispatchDetails.driverContact || '',
              assignedVolunteer: dispatchDetails.assignedVolunteer || 'Field Volunteer',
              batchNote: dispatchDetails.batchNote || 'En route to camp'
            }
          };
        }
        return req;
      })
    );
  };

  // Step 5: Receiver ACCEPTS & Confirms Delivery
  const acceptRequestDelivery = (requestId, confirmationNote = '') => {
    setRequests(prev =>
      prev.map(req => {
        if (req.id === requestId) {
          return {
            ...req,
            status: 'ACCEPTED',
            acceptedAt: new Date().toISOString(),
            confirmationNote: confirmationNote || 'Supplies received and accepted by camp leadership.'
          };
        }
        return req;
      })
    );

    // Also mark related pledges as ACCEPTED
    setPledges(prev =>
      prev.map(p => {
        if (p.requestId === requestId) {
          return { ...p, status: 'ACCEPTED', acceptedAt: new Date().toISOString() };
        }
        return p;
      })
    );
  };

  // ==========================================
  // 3. INVENTORY / WAREHOUSE RESOURCES CRUD (Create, View, Update, Delete)
  // ==========================================

  // CREATE Resource in Inventory
  const addInventoryItem = (itemData) => {
    const qty = parseInt(itemData.inStock || itemData.quantity, 10) || 0;
    const newItem = {
      id: itemData.id || `RES-${Date.now().toString().slice(-4)}`,
      item: itemData.item || itemData.name || 'Relief Resource',
      name: itemData.name || itemData.item || 'Relief Resource',
      category: itemData.category || 'FOOD',
      inStock: qty,
      quantity: qty,
      unit: itemData.unit || 'units',
      hub: itemData.hub || itemData.location || 'Central Disaster Depot',
      location: itemData.location || itemData.hub || 'Central Disaster Depot',
      pincode: itemData.pincode ? String(itemData.pincode).trim() : '',
      availability: itemData.availability || (qty > 50 ? 'AVAILABLE' : qty > 0 ? 'LOW_STOCK' : 'RESERVED'),
      condition: itemData.condition || 'New & Inspected',
      contactPhone: itemData.contactPhone || '',
      donorOrOrgName: itemData.donorOrOrgName || 'Disaster Relief Alliance',
      lastUpdated: new Date().toISOString()
    };
    setInventory(prev => [newItem, ...prev]);
    return newItem;
  };

  // UPDATE Resource in Inventory
  const updateInventoryItem = (invId, updatedFields) => {
    setInventory(prev =>
      prev.map(item => {
        if (item.id === invId) {
          const qty = updatedFields.inStock !== undefined
            ? parseInt(updatedFields.inStock, 10)
            : updatedFields.quantity !== undefined
            ? parseInt(updatedFields.quantity, 10)
            : item.inStock;

          return {
            ...item,
            ...updatedFields,
            inStock: qty,
            quantity: qty,
            name: updatedFields.name || updatedFields.item || item.name,
            item: updatedFields.item || updatedFields.name || item.item,
            lastUpdated: new Date().toISOString()
          };
        }
        return item;
      })
    );
  };

  // Adjust stock quantity
  const updateInventoryStock = (invId, changeQty) => {
    setInventory(prev =>
      prev.map(item => {
        if (item.id === invId) {
          const newQty = Math.max(0, item.inStock + changeQty);
          return {
            ...item,
            inStock: newQty,
            quantity: newQty,
            availability: newQty > 50 ? 'AVAILABLE' : newQty > 0 ? 'LOW_STOCK' : 'RESERVED',
            lastUpdated: new Date().toISOString()
          };
        }
        return item;
      })
    );
  };

  // DELETE Resource from Inventory
  const deleteInventoryItem = (invId) => {
    setInventory(prev => prev.filter(item => item.id !== invId));
  };

  // Requirement 5: Create donation requests and update their status as pending, accepted or completed
  const updateRequestStatus = (requestId, newStatus) => {
    setRequests(prev =>
      prev.map(req => {
        if (req.id === requestId) {
          const isComplete = newStatus === 'COMPLETED';
          const isAccepted = newStatus === 'ACCEPTED';
          return {
            ...req,
            status: newStatus,
            quantityFulfilled: isComplete ? req.quantityNeeded : req.quantityFulfilled,
            completedAt: isComplete ? new Date().toISOString() : req.completedAt,
            acceptedAt: isAccepted ? (req.acceptedAt || new Date().toISOString()) : req.acceptedAt,
            lastModified: new Date().toISOString()
          };
        }
        return req;
      })
    );
  };

  // Calamity Zones CRUD
  const addCalamityZone = (zoneData) => {
    const newZone = {
      id: `zone-${Date.now().toString().slice(-4)}`,
      name: zoneData.name,
      type: zoneData.type || 'Natural Calamity',
      severity: zoneData.severity || 'CRITICAL',
      state: zoneData.state || '',
      campsCount: parseInt(zoneData.campsCount, 10) || 1,
      affectedPeople: parseInt(zoneData.affectedPeople, 10) || 0,
      lastUpdated: 'Just now'
    };
    setCalamityZones(prev => [newZone, ...prev]);
    return newZone;
  };

  const deleteCalamityZone = (zoneId) => {
    setCalamityZones(prev => prev.filter(z => z.id !== zoneId));
  };

  const clearAllData = () => {
    setCalamityZones([]);
    setRequests([]);
    setPledges([]);
    setInventory([]);
    localStorage.removeItem('donation_zones');
    localStorage.removeItem('donation_requests');
    localStorage.removeItem('donation_pledges');
    localStorage.removeItem('donation_inventory');
  };

  return (
    <DataContext.Provider
      value={{
        calamityZones,
        requests,
        pledges,
        inventory,
        registeredDonors,
        registerDonor,
        // Monetary Donations
        monetaryDonations,
        addMonetaryDonation,
        totalMonetaryFunds,
        // Requests CRUD & Status Management
        addRequest,
        addBatchRequests,
        addMultipleRequests: addBatchRequests,
        updateRequest,
        updateRequestStatus,
        deleteRequest,
        // Workflow actions
        verifyRequest,
        dispatchRequestShipment,
        acceptRequestDelivery,
        markRequestDelivered: (id, note) => acceptRequestDelivery(id, note),
        // Pledges CRUD
        addPledge,
        updatePledge,
        updatePledgeStatus: (id, status) => updatePledge(id, { status }),
        deletePledge,
        // Inventory CRUD
        addInventoryItem,
        updateInventoryItem,
        updateInventoryStock,
        deleteInventoryItem,
        // Zones CRUD
        addCalamityZone,
        deleteCalamityZone,
        clearAllData
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used inside DataProvider');
  return ctx;
}
