export const CALAMITY_ZONES = [
  {
    id: "zone-1",
    name: "Wayanad Landslide Relief Zone",
    type: "Landslide & Debris Flow",
    severity: "CRITICAL",
    state: "Kerala, Western Ghats",
    hubCenter: "Meppadi Community Ground Central Hub",
    campsCount: 14,
    affectedPeople: 3450,
    accessibility: "State Highway 59 open to emergency convoys; inner sectors via 4x4 only",
    contactHotline: "+91 94470 12044",
    lastUpdated: "12 mins ago",
    summary: "Heavy mudflow caused disruption across three tea estate hamlets. Primary requirement is clean drinking water, infant supplies, and dry clothes."
  },
  {
    id: "zone-2",
    name: "Brahmaputra Flood Sector B",
    type: "Monsoon Flash Flood",
    severity: "HIGH",
    state: "Assam, Majuli & Morigaon",
    hubCenter: "Jorhat River Port Warehouse",
    campsCount: 22,
    affectedPeople: 8900,
    accessibility: "Inundated; boat supply drops managed by State Disaster Response Force",
    contactHotline: "+91 88110 34921",
    lastUpdated: "35 mins ago",
    summary: "River level 1.2m above danger mark. Drinking water contaminated in 40+ villages. Halazone chlorine tablets and dry food urgently needed."
  },
  {
    id: "zone-3",
    name: "Coastal Cyclone Dana Shelters",
    type: "Tropical Cyclone Surge",
    severity: "MODERATE",
    state: "Odisha, Balasore Coastal Belt",
    hubCenter: "District Sports Complex Emergency Staging Hub",
    campsCount: 18,
    affectedPeople: 5200,
    accessibility: "Main highways restored; power grid restored to 45% of shelters",
    contactHotline: "+91 67822 55901",
    lastUpdated: "1 hour ago",
    summary: "Post-landfall recovery phase. Solar lanterns, sanitary kits, and tarpaulins are priority to prevent post-storm illness."
  },
  {
    id: "zone-4",
    name: "Uttarkashi Upper Valley Cloudburst",
    type: "Flash Flood & Mudflow",
    severity: "CRITICAL",
    state: "Uttarakhand, Upper Bhagirathi",
    hubCenter: "Bhatwari Community Center",
    campsCount: 6,
    affectedPeople: 1120,
    accessibility: "Single-lane mountain road; cold night weather (4°C)",
    contactHotline: "+91 94120 78312",
    lastUpdated: "2 hours ago",
    summary: "Night temperatures dropping rapidly. Urgent need for heavy woolen blankets, sleeping foam mats, and high-calorie rations."
  }
];

export const CATEGORIES = [
  { id: "WATER", label: "Clean Water & Purification", icon: "Droplets", color: "text-blue-700 bg-blue-50 border-blue-200" },
  { id: "FOOD", label: "Dry Rations & Meals", icon: "Utensils", color: "text-amber-700 bg-amber-50 border-amber-200" },
  { id: "MEDICAL", label: "Emergency First Aid & ORS", icon: "HeartPulse", color: "text-rose-700 bg-rose-50 border-rose-200" },
  { id: "BABY_CARE", label: "Infant Care & Formula", icon: "Baby", color: "text-purple-700 bg-purple-50 border-purple-200" },
  { id: "SHELTER", label: "Tarps, Blankets & Mats", icon: "Tent", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  { id: "HYGIENE", label: "Sanitary & Disinfection", icon: "ShieldAlert", color: "text-teal-700 bg-teal-50 border-teal-200" },
  { id: "POWER_LIGHT", label: "Solar Torches & Power", icon: "SunMedium", color: "text-orange-700 bg-orange-50 border-orange-200" }
];

export const SAMPLE_ORGANIZATIONS = [
  {
    id: "org-1",
    name: "SEEDS India Disaster Response",
    regNo: "NGO-DL/1994/00249",
    type: "Registered Disaster NGO",
    phone: "+91 11 2617 4214",
    email: "relief@seedsindia.org",
    verified: true,
    operatingZones: ["zone-1", "zone-2", "zone-4"],
    assignedWarehouse: "Meppadi & Jorhat Staging Hubs"
  },
  {
    id: "org-2",
    name: "Goonj Disaster Relief Initiative",
    regNo: "NGO-DL/1999/01482",
    type: "Humanitarian Logistics NGO",
    phone: "+91 11 4140 1216",
    email: "response@goonj.org",
    verified: true,
    operatingZones: ["zone-1", "zone-3"],
    assignedWarehouse: "Kozhikode Collection Hub"
  },
  {
    id: "org-3",
    name: "Red Cross Disaster Emergency Cell",
    regNo: "INTL-RC-2024",
    type: "Emergency First Response",
    phone: "+91 11 2371 6441",
    email: "emergency@indianredcross.org",
    verified: true,
    operatingZones: ["zone-1", "zone-2", "zone-3", "zone-4"],
    assignedWarehouse: "National Emergency Warehouse, New Delhi & Field Hubs"
  }
];

export const INITIAL_REQUESTS = [
  {
    id: "REQ-101",
    zoneId: "zone-1",
    campName: "Meppadi High School Relief Camp #2",
    requesterName: "Dr. K. Sukumaran (Camp Medical Officer)",
    requesterRole: "Camp Medical Volunteer",
    requesterPhone: "+91 94471 89201",
    peopleCount: 420,
    category: "WATER",
    itemName: "10-Litre Packaged Drinking Water Cans",
    quantityNeeded: 250,
    quantityFulfilled: 140,
    urgency: "CRITICAL",
    status: "PARTIALLY_PLEDGED", // PENDING, VERIFIED, PARTIALLY_PLEDGED, DISPATCHED, DELIVERED
    verifiedByOrgId: "org-1",
    note: "Local stream supply contaminated by mudslides. Children and elderly showing dehydration.",
    dateCreated: "2026-11-13T08:30:00Z",
    dropLocation: "Meppadi School Gate B - Ground Staging Area"
  },
  {
    id: "REQ-102",
    zoneId: "zone-1",
    campName: "Chooralmala Tea Workers Shelter",
    requesterName: "Mariam Varghese (Panchayat Member)",
    requesterRole: "Local Community Representative",
    requesterPhone: "+91 98460 22340",
    peopleCount: 180,
    category: "BABY_CARE",
    itemName: "Infant Formula Milk Powder (Stage 1 & 2)",
    quantityNeeded: 80,
    quantityFulfilled: 80,
    urgency: "CRITICAL",
    status: "DISPATCHED",
    verifiedByOrgId: "org-2",
    note: "14 infants under 8 months currently without mother's milk access. Urgent clean feeding bottles needed as well.",
    dateCreated: "2026-11-13T09:15:00Z",
    dropLocation: "Chundale Base Transit Camp (Handover to SDRF Jeep #04)"
  },
  {
    id: "REQ-103",
    zoneId: "zone-2",
    campName: "Majuli Island High Bund Camp A",
    requesterName: "Bipul Saikia",
    requesterRole: "Camp Lead",
    requesterPhone: "+91 88120 44519",
    peopleCount: 650,
    category: "MEDICAL",
    itemName: "WHO Oral Rehydration Salts (ORS) Sachets",
    quantityNeeded: 1200,
    quantityFulfilled: 400,
    urgency: "CRITICAL",
    status: "VERIFIED",
    verifiedByOrgId: "org-3",
    note: "Early cases of water-borne gastroenteritis reported. Need ORS sachets and Zinc tablets immediately.",
    dateCreated: "2026-11-13T10:00:00Z",
    dropLocation: "Kamalabari Ghat Boat Loading Point"
  },
  {
    id: "REQ-104",
    zoneId: "zone-2",
    campName: "Morigaon Embankment Shelter 3",
    requesterName: "Anjali Bora",
    requesterRole: "Community Health Worker (ASHA)",
    requesterPhone: "+91 99540 67123",
    peopleCount: 310,
    category: "HYGIENE",
    itemName: "Biodegradable Sanitary Napkin Packs",
    quantityNeeded: 400,
    quantityFulfilled: 0,
    urgency: "HIGH",
    status: "VERIFIED",
    verifiedByOrgId: "org-1",
    note: "Women and teenage girls stranded on flood embankment with zero hygiene supplies.",
    dateCreated: "2026-11-13T11:20:00Z",
    dropLocation: "Morigaon Sub-divisional Warehouse"
  },
  {
    id: "REQ-105",
    zoneId: "zone-4",
    campName: "Bhatwari Night Shelter",
    requesterName: "Rameshwar Rawat",
    requesterRole: "Village Council Secretary",
    requesterPhone: "+91 94115 32901",
    peopleCount: 220,
    category: "SHELTER",
    itemName: "Heavy Woolen Blankets & Insulation Mats",
    quantityNeeded: 300,
    quantityFulfilled: 120,
    urgency: "CRITICAL",
    status: "PARTIALLY_PLEDGED",
    verifiedByOrgId: "org-3",
    note: "Temperatures plummeting below 5°C after cloudburst soaked all bedding.",
    dateCreated: "2026-11-13T07:45:00Z",
    dropLocation: "Bhatwari Tehsil Office Compound"
  },
  {
    id: "REQ-106",
    zoneId: "zone-3",
    campName: "Bhadrak Coastal Cyclone Shelter #7",
    requesterName: "Pranab Mohanty",
    requesterRole: "Disaster Shelter Manager",
    requesterPhone: "+91 67842 11984",
    peopleCount: 510,
    category: "POWER_LIGHT",
    itemName: "Heavy Duty Solar Rechargeable LED Lanterns",
    quantityNeeded: 150,
    quantityFulfilled: 150,
    urgency: "MODERATE",
    status: "DELIVERED",
    verifiedByOrgId: "org-2",
    note: "Power lines downed. Basic lighting required for medical tent and sanitation zones.",
    dateCreated: "2026-11-12T14:00:00Z",
    dropLocation: "Basudevpur Block Control Room"
  },
  {
    id: "REQ-107",
    zoneId: "zone-1",
    campName: "Munderi Forest Edge Camp",
    requesterName: "Subhashini Nair",
    requesterRole: "Relief Volunteer",
    requesterPhone: "+91 94462 77112",
    peopleCount: 160,
    category: "FOOD",
    itemName: "Dry Ration Survival Kits (Rice, Dal, Salt, Biscuits)",
    quantityNeeded: 160,
    quantityFulfilled: 0,
    urgency: "HIGH",
    status: "PENDING",
    verifiedByOrgId: null,
    note: "Cooking firewood is wet; families need dry ready-to-eat rations or packed food packets.",
    dateCreated: "2026-11-13T12:00:00Z",
    dropLocation: "Kalpetta Fire Station Handover Point"
  }
];

export const INITIAL_PLEDGES = [
  {
    id: "PLG-501",
    requestId: "REQ-101",
    donorName: "Anandita & Rajiv Menon",
    donorType: "Individual Citizen",
    donorPhone: "+91 98200 44102",
    donorEmail: "anandita.m@gmail.com",
    itemName: "10-Litre Packaged Drinking Water Cans",
    quantity: 140,
    deliveryMethod: "DROPOFF_AT_HUB",
    dropoffHub: "Meppadi Community Ground Central Hub",
    pledgeDate: "2026-11-13T09:40:00Z",
    status: "DELIVERED_TO_HUB",
    trackingNotes: "Delivered via local transport partner truck KL-12-G-4412"
  },
  {
    id: "PLG-502",
    requestId: "REQ-102",
    donorName: "Kochi Mothers Relief Circle",
    donorType: "Community Group",
    donorPhone: "+91 94470 55190",
    donorEmail: "kochimothers@relief.org",
    itemName: "Infant Formula Milk Powder (Stage 1 & 2)",
    quantity: 80,
    deliveryMethod: "DIRECT_COURIER",
    dropoffHub: "Chundale Base Transit Camp",
    pledgeDate: "2026-11-13T10:30:00Z",
    status: "IN_TRANSIT",
    trackingNotes: "Handed over to SDRF Logistics Officer at Chundale checkpoint"
  },
  {
    id: "PLG-503",
    requestId: "REQ-105",
    donorName: "Himachal Woolens Cooperative",
    donorType: "Organization / Cooperative",
    donorPhone: "+91 177 265 1102",
    donorEmail: "contact@himachalwoolens.org",
    itemName: "Heavy Woolen Blankets & Insulation Mats",
    quantity: 120,
    deliveryMethod: "BULK_DISPATCH",
    dropoffHub: "Bhatwari Tehsil Office Compound",
    pledgeDate: "2026-11-13T11:10:00Z",
    status: "DISPATCHED",
    trackingNotes: "Truck HP-01-A-8991 en route from Shimla, ETA 6 hours"
  },
  {
    id: "PLG-504",
    requestId: "REQ-103",
    donorName: "Dr. Priyam Baruah",
    donorType: "Medical Professional",
    donorPhone: "+91 94350 11988",
    donorEmail: "pbaruah.md@assamhealth.in",
    itemName: "WHO Oral Rehydration Salts (ORS) Sachets",
    quantity: 400,
    deliveryMethod: "DROPOFF_AT_HUB",
    dropoffHub: "Jorhat River Port Warehouse",
    pledgeDate: "2026-11-13T11:55:00Z",
    status: "CONFIRMED",
    trackingNotes: "Delivered to SEEDS India volunteer team at Jorhat ghat"
  }
];

export const INITIAL_INVENTORY = [
  { id: "INV-01", hub: "Meppadi Community Ground Central Hub", category: "WATER", item: "Bottled Mineral Water (1L Bottles)", inStock: 850, unit: "bottles", reserved: 200 },
  { id: "INV-02", hub: "Meppadi Community Ground Central Hub", category: "SHELTER", item: "Waterproof Blue Tarpaulins (12x15)", inStock: 140, unit: "pieces", reserved: 60 },
  { id: "INV-03", hub: "Jorhat River Port Warehouse", category: "WATER", item: "Halazone Water Purification Tablets", inStock: 5000, unit: "tablets", reserved: 1200 },
  { id: "INV-04", hub: "Jorhat River Port Warehouse", category: "FOOD", item: "High-Calorie Ready Meals (Khichdi Pouches)", inStock: 620, unit: "pouches", reserved: 300 },
  { id: "INV-05", hub: "District Sports Complex Emergency Staging Hub", category: "POWER_LIGHT", item: "Solar LED Emergency Torches", inStock: 210, unit: "units", reserved: 150 },
  { id: "INV-06", hub: "Bhatwari Community Center", category: "SHELTER", item: "Woolen Relief Blankets", inStock: 95, unit: "blankets", reserved: 80 }
];

export const DEMO_USERS = {
  donor: {
    id: "usr-donor-1",
    role: "DONOR",
    name: "Dr. Arvind Natarajan",
    email: "arvind.natarajan@healthaid.org",
    phone: "+91 98401 23456",
    city: "Bengaluru",
    pledgesCount: 4,
    impactNote: "Contributed water kits & medical essentials to 3 relief zones"
  },
  receiver: {
    id: "usr-recv-1",
    role: "RECEIVER",
    name: "Dr. K. Sukumaran",
    campName: "Meppadi High School Relief Camp #2",
    designation: "Camp Medical Officer / Lead",
    zoneId: "zone-1",
    phone: "+91 94471 89201",
    location: "Meppadi, Wayanad",
    shelterSize: "420 evacuees (84 families)"
  },
  organization: {
    id: "usr-org-1",
    role: "ORGANIZATION",
    orgName: "SEEDS India Disaster Response",
    coordinatorName: "Shalini Sen (Field Ops Director)",
    regNo: "NGO-DL/1994/00249",
    email: "shalini.sen@seedsindia.org",
    phone: "+91 11 2617 4214",
    verified: true,
    activeMissions: 3,
    activeZones: ["zone-1", "zone-2", "zone-4"]
  }
};

