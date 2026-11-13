import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CALAMITY_ZONES,
  INITIAL_REQUESTS,
  INITIAL_PLEDGES,
  INITIAL_INVENTORY,
  SAMPLE_ORGANIZATIONS
} from '../data/initialData';

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

  const [selectedZoneId, setSelectedZoneId] = useState('all');

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

  // Actions
  const addCalamityZone = (zoneData) => {
    const newZone = {
      id: `zone-${Date.now().toString().slice(-4)}`,
      name: zoneData.name,
      type: zoneData.type || 'Natural Calamity',
      severity: zoneData.severity || 'CRITICAL',
      state: zoneData.state || '',
      hubCenter: zoneData.hubCenter || 'Regional Staging Hub',
      campsCount: parseInt(zoneData.campsCount, 10) || 1,
      affectedPeople: parseInt(zoneData.affectedPeople, 10) || 0,
      accessibility: zoneData.accessibility || 'Under Assessment',
      contactHotline: zoneData.contactHotline || '',
      lastUpdated: 'Just now',
      summary: zoneData.summary || ''
    };
    setCalamityZones(prev => [newZone, ...prev]);
    return newZone;
  };

  const addRequest = (newReq) => {
    const request = {
      id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
      zoneName: newReq.zoneName || 'Calamity Zone',
      campName: newReq.campName || 'Relief Shelter',
      requesterName: newReq.requesterName || 'Camp Representative',
      requesterRole: newReq.requesterRole || 'Camp In-charge',
      requesterPhone: newReq.requesterPhone || '',
      peopleCount: parseInt(newReq.peopleCount, 10) || 0,
      category: newReq.category || 'WATER',
      itemName: newReq.itemName || 'Basic Relief Supplies',
      quantityNeeded: parseInt(newReq.quantityNeeded, 10) || 1,
      quantityFulfilled: 0,
      urgency: newReq.urgency || 'HIGH',
      status: 'PENDING',
      verifiedByOrgId: null,
      note: newReq.note || '',
      dateCreated: new Date().toISOString(),
      dropLocation: newReq.dropLocation || 'Camp Entrance'
    };

    setRequests(prev => [request, ...prev]);
    return request;
  };

  const verifyRequest = (requestId, orgId = 'org-verified') => {
    setRequests(prev =>
      prev.map(req => {
        if (req.id === requestId) {
          return {
            ...req,
            status: req.quantityFulfilled > 0 ? 'PARTIALLY_PLEDGED' : 'VERIFIED',
            verifiedByOrgId: orgId
          };
        }
        return req;
      })
    );
  };

  const addPledge = (pledgeData) => {
    const qty = parseInt(pledgeData.quantity, 10) || 1;
    const newPledge = {
      id: `PLG-${Math.floor(500 + Math.random() * 500)}`,
      requestId: pledgeData.requestId,
      donorName: pledgeData.donorName || 'Donor',
      donorType: pledgeData.donorType || 'Individual',
      donorPhone: pledgeData.donorPhone || '',
      donorEmail: pledgeData.donorEmail || '',
      itemName: pledgeData.itemName,
      quantity: qty,
      deliveryMethod: pledgeData.deliveryMethod || 'DROPOFF_AT_HUB',
      dropoffHub: pledgeData.dropoffHub || 'Regional Staging Hub',
      pledgeDate: new Date().toISOString(),
      status: 'CONFIRMED',
      trackingNotes: pledgeData.trackingNotes || 'Pledged by donor'
    };

    setPledges(prev => [newPledge, ...prev]);

    setRequests(prev =>
      prev.map(req => {
        if (req.id === pledgeData.requestId) {
          const newFulfilled = (req.quantityFulfilled || 0) + qty;
          const isFullyFulfilled = newFulfilled >= req.quantityNeeded;
          return {
            ...req,
            quantityFulfilled: newFulfilled,
            status: isFullyFulfilled ? 'DISPATCHED' : 'PARTIALLY_PLEDGED'
          };
        }
        return req;
      })
    );

    return newPledge;
  };

  const updatePledgeStatus = (pledgeId, newStatus, notes = '') => {
    setPledges(prev =>
      prev.map(p => {
        if (p.id === pledgeId) {
          return {
            ...p,
            status: newStatus,
            trackingNotes: notes || p.trackingNotes
          };
        }
        return p;
      })
    );
  };

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
              assignedVolunteer: dispatchDetails.assignedVolunteer || '',
              batchNote: dispatchDetails.batchNote || ''
            }
          };
        }
        return req;
      })
    );
  };

  const markRequestDelivered = (requestId, confirmationNote) => {
    setRequests(prev =>
      prev.map(req => {
        if (req.id === requestId) {
          return {
            ...req,
            status: 'DELIVERED',
            deliveredAt: new Date().toISOString(),
            confirmationNote: confirmationNote || 'Delivered to camp.'
          };
        }
        return req;
      })
    );
  };

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

  const addInventoryItem = (itemData) => {
    const newItem = {
      id: `INV-${Date.now().toString().slice(-4)}`,
      hub: itemData.hub,
      category: itemData.category,
      item: itemData.item,
      inStock: parseInt(itemData.inStock, 10) || 0,
      unit: itemData.unit || 'units',
      reserved: 0
    };
    setInventory(prev => [newItem, ...prev]);
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
        selectedZoneId,
        setSelectedZoneId,
        addCalamityZone,
        addRequest,
        verifyRequest,
        addPledge,
        updatePledgeStatus,
        dispatchRequestShipment,
        markRequestDelivered,
        updateInventoryStock,
        addInventoryItem,
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
