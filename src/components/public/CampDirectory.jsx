import React, { useState } from 'react';
import { Building, MapPin, Users, Phone, ShieldCheck, ArrowRight, Package } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export default function CampDirectory() {
  const { calamityZones, requests } = useData();
  const { setActiveView } = useAuth();
  const [selectedZone, setSelectedZone] = useState('ALL');

  // Extract unique camps from initial requests and zones
  const camps = [
    {
      id: "camp-1",
      name: "Meppadi High School Relief Camp #2",
      zoneId: "zone-1",
      zoneName: "Wayanad Landslide Relief Zone",
      leadName: "Dr. K. Sukumaran",
      leadRole: "Camp Medical Officer",
      phone: "+91 94471 89201",
      location: "Meppadi School Ground, SH 59",
      peopleCount: 420,
      familiesCount: 84,
      status: "OPEN / AT CAPACITY",
      needsCount: requests.filter(r => r.campName.includes("Meppadi")).length
    },
    {
      id: "camp-2",
      name: "Chooralmala Tea Workers Shelter",
      zoneId: "zone-1",
      zoneName: "Wayanad Landslide Relief Zone",
      leadName: "Mariam Varghese",
      leadRole: "Panchayat Member",
      phone: "+91 98460 22340",
      location: "Chundale Base Transit Camp",
      peopleCount: 180,
      familiesCount: 42,
      status: "OPEN / RECEIVING SUPPLIES",
      needsCount: requests.filter(r => r.campName.includes("Chooralmala")).length
    },
    {
      id: "camp-3",
      name: "Majuli Island High Bund Camp A",
      zoneId: "zone-2",
      zoneName: "Brahmaputra Flood Sector B",
      leadName: "Bipul Saikia",
      leadRole: "Camp Lead",
      phone: "+91 88120 44519",
      location: "Kamalabari Ghat Boat Point",
      peopleCount: 650,
      familiesCount: 140,
      status: "BOAT ACCESS ONLY",
      needsCount: requests.filter(r => r.campName.includes("Majuli")).length
    },
    {
      id: "camp-4",
      name: "Morigaon Embankment Shelter 3",
      zoneId: "zone-2",
      zoneName: "Brahmaputra Flood Sector B",
      leadName: "Anjali Bora",
      leadRole: "ASHA Health Worker",
      phone: "+91 99540 67123",
      location: "Morigaon Sub-divisional Bund",
      peopleCount: 310,
      familiesCount: 68,
      status: "OPEN / HIGH WATER",
      needsCount: requests.filter(r => r.campName.includes("Morigaon")).length
    },
    {
      id: "camp-5",
      name: "Bhatwari Night Shelter",
      zoneId: "zone-4",
      zoneName: "Uttarkashi Cloudburst",
      leadName: "Rameshwar Rawat",
      leadRole: "Village Council Secretary",
      phone: "+91 94115 32901",
      location: "Bhatwari Tehsil Office Compound",
      peopleCount: 220,
      familiesCount: 50,
      status: "COLD ALERT / OPEN",
      needsCount: requests.filter(r => r.campName.includes("Bhatwari")).length
    },
    {
      id: "camp-6",
      name: "Bhadrak Coastal Cyclone Shelter #7",
      zoneId: "zone-3",
      zoneName: "Cyclone Dana Shelters",
      leadName: "Pranab Mohanty",
      leadRole: "Disaster Shelter Manager",
      phone: "+91 67842 11984",
      location: "Basudevpur Block Center",
      peopleCount: 510,
      familiesCount: 110,
      status: "POST-CYCLONE RESTORATION",
      needsCount: requests.filter(r => r.campName.includes("Bhadrak")).length
    }
  ];

  const filteredCamps = camps.filter(c => selectedZone === 'ALL' || c.zoneId === selectedZone);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Field Shelters Directory</div>
          <h1 className="text-2xl font-bold text-slate-900">Relief Camps & Staging Hubs</h1>
          <p className="text-xs text-slate-500 mt-1">
            Verified shelters accommodating displaced families across active disaster sectors.
          </p>
        </div>

        <div>
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-md bg-white font-semibold outline-none"
          >
            <option value="ALL">All Disaster Sectors</option>
            {calamityZones.map(z => (
              <option key={z.id} value={z.id}>{z.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Camps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCamps.map(camp => (
          <div
            key={camp.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {camp.zoneName}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                  {camp.status}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base">{camp.name}</h3>
                <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{camp.location}</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">In-Charge:</span>
                  <span className="font-semibold text-slate-900">{camp.leadName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Role:</span>
                  <span className="text-slate-700">{camp.leadRole}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Hotline:</span>
                  <span className="font-mono text-slate-800">{camp.phone}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1 mt-1">
                  <span className="text-slate-500">Displaced Sheltered:</span>
                  <span className="font-bold text-slate-900">{camp.peopleCount} ({camp.familiesCount} families)</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-600">
                <strong>{camp.needsCount}</strong> active supply requests
              </span>
              <button
                onClick={() => setActiveView('needs-feed')}
                className="text-xs font-bold text-amber-900 hover:text-amber-700 flex items-center gap-1"
              >
                <span>View Needs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

