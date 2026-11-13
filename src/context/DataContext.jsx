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
      return saved ? JSON.parse(saved) : CALAMITY_ZONES;
    } catch {
      return CALAMITY_ZONES;
    }
  });

  const [requests, setRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('donation_requests');
      return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
    } catch {
      return INITIAL_REQUESTS;
    }
  });

  const [pledges, setPledges] = useState(() => {
    try {
      const saved = localStorage.getItem('donation_pledges');
      return saved ? JSON.parse(saved) : INITIAL_PLEDGES;
    } catch {
      return INITIAL_PLEDGES;
    }
  });

  const [inventory, setInventory] = useState(() => {
    try {
      const saved = localStorage.getItem('donation_inventory');
      return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
    } catch {
      return INITIAL_INVENTORY;
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
  const addRequest = (newReq) => {
    const request = {
      id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
      zoneId: newReq.zoneId || 'zone-1',
      campName: newReq.campName || 'Disaster Relief Point',
      requesterName: newReq.requesterName || 'Camp Resident / Rep',
      requesterRole: newReq.requesterRole || 'Camp Representative',
      requesterPhone: newReq.requesterPhone || '',
      peopleCount: parseInt(newReq.peopleCount, 10) || 50,
      category: newReq.category || 'WATER',
      itemName: newReq.itemName || 'Basic Relief Supplies',
      quantityNeeded: parseInt(newReq.quantityNeeded, 10) || 10,
      quantityFulfilled: 0,
      urgency: newReq.urgency || 'HIGH', // CRITICAL, HIGH, MODERATE
      status: 'PENDING',
      verifiedByOrgId: null,
      note: newReq.note || '',
      dateCreated: new Date().toISOString(),
      dropLocation: newReq.dropLocation || 'Main Camp Distribution Desk'
    };

    setRequests(prev => [request, ...prev]);
    return request;
  };

  const verifyRequest = (requestId, orgId = 'org-1') => {
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
      donorName: pledgeData.donorName || 'Generous Supporter',
      donorType: pledgeData.donorType || 'Individual',
      donorPhone: pledgeData.donorPhone || '',
      donorEmail: pledgeData.donorEmail || '',
      itemName: pledgeData.itemName,
      quantity: qty,
      deliveryMethod: pledgeData.deliveryMethod || 'DROPOFF_AT_HUB', // DROPOFF_AT_HUB, DIRECT_COURIER, SPONSOR_KIT
      dropoffHub: pledgeData.dropoffHub || 'Nearest Regional Disaster Staging Warehouse',
      pledgeDate: new Date().toISOString(),
      status: 'CONFIRMED',
      trackingNotes: pledgeData.trackingNotes || 'Pledge confirmed by donor'
    };

    setPledges(prev => [newPledge, ...prev]);

    // Update the request fulfillment
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
              vehicleNo: dispatchDetails.vehicleNo || 'EMERGENCY-RELIEF-TRUCK',
              driverContact: dispatchDetails.driverContact || '+91 98400 11223',
              assignedVolunteer: dispatchDetails.assignedVolunteer || 'Regional Relief Escort',
              batchNote: dispatchDetails.batchNote || 'Dispatched from central hub'
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
            confirmationNote: confirmationNote || 'Received and distributed to camp families.'
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

  const resetAllData = () => {
    setCalamityZones(CALAMITY_ZONES);
    setRequests(INITIAL_REQUESTS);
    setPledges(INITIAL_PLEDGES);
    setInventory(INITIAL_INVENTORY);
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
        organizations: SAMPLE_ORGANIZATIONS,
        selectedZoneId,
        setSelectedZoneId,
        addRequest,
        verifyRequest,
        addPledge,
        updatePledgeStatus,
        dispatchRequestShipment,
        markRequestDelivered,
        updateInventoryStock,
        addInventoryItem,
        resetAllData
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

