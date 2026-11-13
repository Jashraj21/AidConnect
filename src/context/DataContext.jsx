import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

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
        return [];
      }
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

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

  // ==========================================
  // 1. REQUESTS CRUD & WORKFLOW
  // ==========================================

  // CREATE Request (Receiver / Camp)
  const addRequest = (newReq) => {
    const request = {
      id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
      zoneName: newReq.zoneName || 'Calamity Sector',
      campName: newReq.campName || 'Relief Shelter',
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
      itemName: pledgeData.itemName,
      quantity: qty,
      deliveryMethod: pledgeData.deliveryMethod || 'DROPOFF_AT_HUB',
      dropoffHub: pledgeData.dropoffHub || 'Regional Staging Hub',
      pledgeDate: new Date().toISOString(),
      status: 'CONFIRMED', // CONFIRMED -> IN_TRANSIT -> DELIVERED_TO_HUB -> ACCEPTED
      trackingNotes: pledgeData.trackingNotes || 'Pledge registered by donor'
    };

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
  // 3. INVENTORY / WAREHOUSE RESOURCES CRUD
  // ==========================================

  // CREATE Resource in Inventory
  const addInventoryItem = (itemData) => {
    const newItem = {
      id: `INV-${Date.now().toString().slice(-4)}`,
      hub: itemData.hub || 'Central Relief Hub',
      category: itemData.category || 'CLOTHES',
      item: itemData.item || 'Relief Item',
      inStock: parseInt(itemData.inStock, 10) || 0,
      unit: itemData.unit || 'pieces',
      lastUpdated: new Date().toISOString()
    };
    setInventory(prev => [newItem, ...prev]);
    return newItem;
  };

  // UPDATE Resource in Inventory
  const updateInventoryItem = (invId, updatedFields) => {
    setInventory(prev =>
      prev.map(item => (item.id === invId ? { ...item, ...updatedFields } : item))
    );
  };

  // Adjust stock quantity
  const updateInventoryStock = (invId, changeQty) => {
    setInventory(prev =>
      prev.map(item => {
        if (item.id === invId) {
          const newQty = Math.max(0, item.inStock + changeQty);
          return { ...item, inStock: newQty };
        }
        return item;
      })
    );
  };

  // DELETE Resource from Inventory
  const deleteInventoryItem = (invId) => {
    setInventory(prev => prev.filter(item => item.id !== invId));
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
        // Requests CRUD
        addRequest,
        updateRequest,
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
