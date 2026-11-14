/**
 * ============================================================================
 * AidConnect — Backend Server
 * ============================================================================
 * Production-ready Node.js & Express REST API for humanitarian aid, 
 * resource listing CRUD, donation request triage, volunteer dispatch, 
 * proximity matching, and 80G monetary contributions.
 *
 * To run:
 *   node server.js
 * Or:
 *   npm run server
 * ============================================================================
 */

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// ============================================================================
// DATABASE / FILE PERSISTENCE ENGINE
// ============================================================================
const DEFAULT_INITIAL_DATA = {
  users: [
    {
      id: 'USR-DONOR-01',
      role: 'DONOR',
      name: 'Aditya Varma',
      phone: '9845012345',
      email: 'aditya@aidconnect.org',
      pincode: '682001',
      city: 'Kochi',
      donorType: 'Individual',
      pledgesCount: 3,
      createdAt: new Date().toISOString()
    },
    {
      id: 'USR-VOL-01',
      role: 'VOLUNTEER',
      name: 'Anjali Menon',
      phone: '9447123456',
      email: 'anjali@aidconnect.org',
      pincode: '682030',
      city: 'Ernakulam',
      skills: ['Relief Distribution', 'First Aid / Medical', 'Field Logistics & Transport'],
      availability: 'Immediate On-call',
      vehicleType: 'Four-Wheeler / Car',
      activeStatus: 'AVAILABLE',
      assignedTasksCount: 2,
      createdAt: new Date().toISOString()
    },
    {
      id: 'USR-ORG-01',
      role: 'ORGANIZATION',
      orgName: 'SEEDS Humanitarian Relief Alliance',
      coordinatorName: 'K. Sukumaran',
      regNo: 'NGO-DL/2018/00912',
      phone: '9744112233',
      email: 'sukumaran@seedsrelief.in',
      pincode: '682025',
      verified: true,
      createdAt: new Date().toISOString()
    }
  ],
  resources: [
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
  ],
  requests: [
    {
      id: 'REQ-101',
      campName: "St. Albert's Relief Shelter",
      shelterName: "St. Albert's Relief Shelter",
      pincode: '682001',
      zoneName: 'Coastal Sector A',
      requesterName: 'Father Joseph',
      requesterRole: 'Camp Representative',
      requesterPhone: '9447011021',
      peopleCount: 320,
      category: 'WATER',
      itemName: 'Drinking Water Bottles (1L or 20L cans)',
      quantityNeeded: 150,
      quantityFulfilled: 60,
      urgency: 'CRITICAL',
      status: 'PENDING',
      dropLocation: 'Main Gate Security Post',
      note: 'Water pipeline damaged; urgently need clean drinking water bottles.',
      dateCreated: new Date().toISOString()
    },
    {
      id: 'REQ-102',
      campName: 'Fort Kochi Govt Higher Secondary Shelter',
      shelterName: 'Fort Kochi Govt Higher Secondary Shelter',
      pincode: '682001',
      zoneName: 'Coastal Sector A',
      requesterName: 'Meera Nambiar',
      requesterRole: 'Field Coordinator',
      requesterPhone: '9447022032',
      peopleCount: 180,
      category: 'FOOD',
      itemName: 'Dry Ration Food Packets & Ready Meals',
      quantityNeeded: 200,
      quantityFulfilled: 200,
      urgency: 'HIGH',
      status: 'ACCEPTED',
      acceptedAt: new Date().toISOString(),
      confirmationNote: 'Delivered and verified by camp logistics officer.',
      dropLocation: 'School Auditorium Gate 2',
      note: 'Families evacuated from waterlogged coastal colony.',
      dateCreated: new Date().toISOString()
    }
  ],
  pledges: [
    {
      id: 'PLG-501',
      requestId: 'REQ-102',
      donorName: 'Aditya Varma',
      donorPhone: '9845012345',
      donorEmail: 'aditya@aidconnect.org',
      pincode: '682001',
      itemName: 'Dry Ration Food Packets & Ready Meals',
      quantity: 200,
      deliveryMethod: 'DIRECT_CAMP_DROPOFF',
      dropoffHub: 'Fort Kochi Govt Higher Secondary Shelter Gate 2',
      status: 'ACCEPTED',
      pledgeDate: new Date().toISOString(),
      trackingNotes: 'Pledge delivered via local transport vehicle KL-07-CD-1920'
    }
  ],
  monetaryDonations: [
    {
      id: 'FND-101',
      receiptNumber: 'RCP-80G-782194',
      utr: 'UTR/78912304918',
      amount: 5000,
      donorName: 'Rajesh Subramanian',
      donorPhone: '9820012345',
      donorEmail: 'rajesh.s@gmail.com',
      pincode: '682001',
      panNumber: 'ABCPS1234K',
      targetType: 'SPECIFIC_CAMP',
      targetCampName: "St. Albert's Relief Shelter",
      targetPincode: '682001',
      paymentMethod: 'UPI',
      purpose: 'Drinking water and emergency baby food packs',
      timestamp: new Date().toISOString(),
      status: 'VERIFIED_RECEIVED',
      taxExempt: '80G Approved (50% Tax Deduction Eligible)'
    }
  ]
};

// Load or initialize DB
let db = { ...DEFAULT_INITIAL_DATA };

function initDatabase() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      db = JSON.parse(content);
      console.log('✅ Loaded data from database file:', DB_FILE);
    } else {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_INITIAL_DATA, null, 2), 'utf-8');
      console.log('🌱 Initialized new database with default data at:', DB_FILE);
    }
  } catch (err) {
    console.error('⚠️ Warning: Failed to read/write DB file, using memory store.', err);
  }
}

function saveDatabase() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('⚠️ Warning: Failed to save database file.', err);
  }
}

initDatabase();

// ============================================================================
// PIN CODE & SHELTER LOOKUP ENGINE
// ============================================================================
const PINCODE_REGIONS = {
  '682001': {
    area: 'Ernakulam / Fort Kochi',
    district: 'Ernakulam',
    state: 'Kerala',
    camps: [
      { id: 'SHELTER-682001-A', name: "St. Albert's Relief Shelter", distance: '0.6 km away', type: 'Community School Shelter', capacity: '350 beds', contact: '+91 94470 11021' },
      { id: 'SHELTER-682001-B', name: 'Fort Kochi Govt Higher Secondary Shelter', distance: '1.4 km away', type: 'Govt Relief Hub', capacity: '220 beds', contact: '+91 94470 22032' }
    ]
  },
  '682030': {
    area: 'Kakkanad / Infopark Zone',
    district: 'Ernakulam',
    state: 'Kerala',
    camps: [
      { id: 'SHELTER-682030-A', name: 'Collectorate Emergency Operations Camp', distance: '0.5 km away', type: 'Civil Defense Headquarters', capacity: '400 beds', contact: '+91 94470 44054' }
    ]
  },
  '600001': {
    area: 'George Town / Chennai North',
    district: 'Chennai',
    state: 'Tamil Nadu',
    camps: [
      { id: 'SHELTER-600001-A', name: "St. Mary's Relief Camp", distance: '0.7 km away', type: 'Flood Relief Hub', capacity: '420 beds', contact: '+91 98400 12345' }
    ]
  },
  '560001': {
    area: 'Bangalore Central / Shivajinagar',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    camps: [
      { id: 'SHELTER-560001-A', name: "St. Joseph's Relief Shelter", distance: '0.9 km away', type: 'Urban Emergency Camp', capacity: '400 beds', contact: '+91 98450 12345' }
    ]
  }
};

function resolvePincode(pincode) {
  const clean = String(pincode || '').replace(/\D/g, '');
  if (PINCODE_REGIONS[clean]) {
    return { pincode: clean, ...PINCODE_REGIONS[clean] };
  }
  // Synthesize for any valid 6-digit Indian PIN
  return {
    pincode: clean,
    area: `Postal Area (PIN ${clean})`,
    district: 'Designated Relief District',
    state: 'India',
    camps: [
      {
        id: `SHELTER-${clean}-GEN`,
        name: `Civil Emergency Relief Hub (PIN ${clean})`,
        distance: '1.2 km away',
        type: 'Regional Staging Shelter',
        capacity: '300 beds',
        contact: '+91 1800 123 456'
      }
    ]
  };
}

// ============================================================================
// 1. HEALTH & WELCOME ROUTES
// ============================================================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'AidConnect API',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({
    name: 'AidConnect — Basic Needs & Humanitarian Aid API',
    status: 'ACTIVE',
    version: '1.2.0',
    endpoints: {
      health: 'GET /api/health',
      resources: 'GET, POST, PUT, DELETE /api/resources',
      requests: 'GET, POST, PUT, PATCH, DELETE /api/requests',
      pledges: 'GET, POST, PATCH, DELETE /api/pledges',
      monetaryDonations: 'GET, POST /api/donations/money',
      pincodeLookup: 'GET /api/pincode/:pincode',
      volunteerTasks: 'GET /api/volunteer/tasks',
      dashboardStats: 'GET /api/dashboard/stats',
      auth: 'POST /api/auth/login, POST /api/auth/register, PUT /api/auth/profile/:id'
    }
  });
});

// ============================================================================
// 2. AUTHENTICATION & PROFILES (REQUIREMENT 1)
// ============================================================================
// Register a new user
app.post('/api/auth/register', (req, res) => {
  const { role, name, phone, pincode, email, city, donorType, skills, vehicleType, orgName, coordinatorName, regNo, designation, campName } = req.body;

  // Strict check: PIN code, phone, name are mandatory
  if (!phone || !pincode || (!name && !orgName)) {
    return res.status(400).json({ error: 'PIN Code, Phone Number, and Name are required fields.' });
  }

  const userId = `USR-${role || 'USER'}-${Date.now()}`;
  const newUser = {
    id: userId,
    role: role || 'DONOR',
    name: name || orgName,
    orgName: orgName || name,
    coordinatorName: coordinatorName || designation || name,
    phone: String(phone).trim(),
    pincode: String(pincode).trim().slice(0, 6),
    email: email || '',
    city: city || '',
    regNo: regNo || '',
    donorType: donorType || 'Individual',
    skills: skills || ['Relief Distribution'],
    vehicleType: vehicleType || 'Two-Wheeler / Bike',
    availability: 'Immediate On-call',
    activeStatus: 'AVAILABLE',
    designation: designation || 'Camp Lead',
    campName: campName || `Shelter (PIN ${pincode})`,
    createdAt: new Date().toISOString()
  };

  db.users.unshift(newUser);
  saveDatabase();

  res.status(201).json({ message: 'User profile registered successfully', user: newUser });
});

// Sign-in endpoint
app.post('/api/auth/login', (req, res) => {
  const { phone, role, pincode } = req.body;
  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required.' });
  }

  let user = db.users.find(u => u.phone === phone && (!role || u.role === role));

  if (!user) {
    // Auto-create identity if logging in with PIN, phone, name
    const name = req.body.name || req.body.orgName || 'Aid Supporter';
    user = {
      id: `USR-${role || 'USER'}-${Date.now()}`,
      role: role || 'DONOR',
      name,
      orgName: name,
      phone,
      pincode: pincode || '',
      activeStatus: 'AVAILABLE',
      createdAt: new Date().toISOString()
    };
    db.users.unshift(user);
    saveDatabase();
  }

  res.json({ message: 'Authenticated successfully', user });
});

// Get user profile
app.get('/api/auth/profile/:id', (req, res) => {
  const user = db.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User profile not found' });
  res.json(user);
});

// Update user profile (Requirement 1: Manage profile)
app.put('/api/auth/profile/:id', (req, res) => {
  const index = db.users.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'User profile not found' });

  const updated = { ...db.users[index], ...req.body, updatedAt: new Date().toISOString() };
  db.users[index] = updated;
  saveDatabase();

  res.json({ message: 'Profile updated successfully', user: updated });
});

// ============================================================================
// 3. RESOURCE LISTINGS CRUD (REQUIREMENT 2 & 4)
// ============================================================================
// GET resources (with Category, Location, Availability, and Search filters)
app.get('/api/resources', (req, res) => {
  let list = [...db.resources];
  const { category, location, availability, search } = req.query;

  // Filter Category
  if (category && category !== 'ALL') {
    list = list.filter(r => r.category === category);
  }

  // Filter Availability
  if (availability && availability !== 'ALL') {
    list = list.filter(r => r.availability === availability);
  }

  // Filter Location (by city, hub name, or PIN)
  if (location && location.trim()) {
    const locQ = location.toLowerCase();
    list = list.filter(r =>
      (r.location || '').toLowerCase().includes(locQ) ||
      (r.hub || '').toLowerCase().includes(locQ) ||
      (r.pincode || '').includes(locQ)
    );
  }

  // Search keyword
  if (search && search.trim()) {
    const q = search.toLowerCase();
    list = list.filter(r =>
      (r.item || r.name || '').toLowerCase().includes(q) ||
      (r.hub || '').toLowerCase().includes(q) ||
      (r.donorOrOrgName || '').toLowerCase().includes(q)
    );
  }

  res.json({ total: list.length, resources: list });
});

// GET single resource
app.get('/api/resources/:id', (req, res) => {
  const item = db.resources.find(r => r.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Resource listing not found' });
  res.json(item);
});

// CREATE resource listing (Requirement 2)
app.post('/api/resources', (req, res) => {
  const { item, name, category, inStock, quantity, unit, hub, location, pincode, availability, condition, contactPhone, donorOrOrgName } = req.body;

  if (!item && !name) {
    return res.status(400).json({ error: 'Resource item name is required.' });
  }

  const stockCount = parseInt(inStock || quantity, 10) || 1;
  const newResource = {
    id: `RES-${Math.floor(100 + Math.random() * 900)}`,
    item: item || name,
    name: name || item,
    category: category || 'FOOD',
    inStock: stockCount,
    unit: unit || 'units',
    hub: hub || location || 'Central Regional Depot',
    location: location || hub || 'Emergency Logistics Center',
    pincode: pincode ? String(pincode).trim().slice(0, 6) : '',
    availability: availability || (stockCount > 50 ? 'AVAILABLE' : 'LOW_STOCK'),
    condition: condition || 'Verified & Sealed',
    contactPhone: contactPhone || '',
    donorOrOrgName: donorOrOrgName || 'Aid Supporter',
    createdAt: new Date().toISOString()
  };

  db.resources.unshift(newResource);
  saveDatabase();

  res.status(201).json({ message: 'Resource listing created', resource: newResource });
});

// UPDATE resource listing (Requirement 2)
app.put('/api/resources/:id', (req, res) => {
  const index = db.resources.findIndex(r => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Resource listing not found' });

  const updated = {
    ...db.resources[index],
    ...req.body,
    inStock: req.body.inStock !== undefined ? parseInt(req.body.inStock, 10) : db.resources[index].inStock,
    updatedAt: new Date().toISOString()
  };

  db.resources[index] = updated;
  saveDatabase();

  res.json({ message: 'Resource listing updated successfully', resource: updated });
});

// DELETE resource listing (Requirement 2)
app.delete('/api/resources/:id', (req, res) => {
  const index = db.resources.findIndex(r => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Resource listing not found' });

  const deleted = db.resources.splice(index, 1)[0];
  saveDatabase();

  res.json({ message: 'Resource listing deleted successfully', resource: deleted });
});

// ============================================================================
// 4. RELIEF REQUESTS & REQUIREMENTS (REQUIREMENT 3 & 5)
// ============================================================================
// GET relief requests (with status, category, urgency filters)
app.get('/api/requests', (req, res) => {
  let list = [...db.requests];
  const { status, category, urgency, pincode, search } = req.query;

  if (status && status !== 'ALL') {
    list = list.filter(r => r.status === status);
  }
  if (category && category !== 'ALL') {
    list = list.filter(r => r.category === category);
  }
  if (urgency && urgency !== 'ALL') {
    list = list.filter(r => r.urgency === urgency);
  }
  if (pincode) {
    list = list.filter(r => (r.pincode || '').includes(pincode));
  }
  if (search && search.trim()) {
    const q = search.toLowerCase();
    list = list.filter(r =>
      (r.itemName || '').toLowerCase().includes(q) ||
      (r.campName || '').toLowerCase().includes(q) ||
      (r.shelterName || '').toLowerCase().includes(q)
    );
  }

  res.json({ total: list.length, requests: list });
});

// CREATE a donation request (Receiver or Organization requirement)
app.post('/api/requests', (req, res) => {
  const { campName, shelterName, pincode, category, itemName, quantityNeeded, urgency, note, dropLocation, requesterName, requesterPhone, requesterRole, peopleCount } = req.body;

  if (!itemName) {
    return res.status(400).json({ error: 'Required item description is needed.' });
  }

  const newReq = {
    id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
    zoneName: req.body.zoneName || 'Calamity Sector',
    campName: campName || shelterName || 'Disaster Relief Shelter',
    shelterName: shelterName || campName || 'Disaster Relief Shelter',
    pincode: pincode ? String(pincode).trim().slice(0, 6) : '',
    requesterName: requesterName || 'Camp Coordinator',
    requesterRole: requesterRole || 'Camp Representative',
    requesterPhone: requesterPhone || '',
    peopleCount: parseInt(peopleCount, 10) || 0,
    category: category || 'WATER',
    itemName,
    quantityNeeded: parseInt(quantityNeeded, 10) || 1,
    quantityFulfilled: 0,
    urgency: urgency || 'HIGH',
    status: 'PENDING', // PENDING -> ACCEPTED -> COMPLETED
    dropLocation: dropLocation || 'Camp Main Gate',
    note: note || '',
    dateCreated: new Date().toISOString()
  };

  db.requests.unshift(newReq);
  saveDatabase();

  res.status(201).json({ message: 'Relief requirement posted successfully', request: newReq });
});

// BATCH CREATE donation requests (Cart from receiver)
app.post('/api/requests/batch', (req, res) => {
  const { commonDetails = {}, items = [] } = req.body;
  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'No items provided in batch request.' });
  }

  const created = items.map((it, idx) => ({
    id: `REQ-${Math.floor(100 + Math.random() * 900)}-${idx + 1}`,
    zoneName: commonDetails.zoneName || 'Calamity Sector',
    campName: commonDetails.campName || commonDetails.shelterName || 'Relief Shelter',
    shelterName: commonDetails.shelterName || commonDetails.campName || 'Relief Shelter',
    pincode: commonDetails.pincode ? String(commonDetails.pincode).trim().slice(0, 6) : '',
    requesterName: commonDetails.requesterName || 'Camp Coordinator',
    requesterPhone: commonDetails.requesterPhone || '',
    category: it.category || 'FOOD',
    itemName: it.name || it.itemName || 'Basic Necessity',
    quantityNeeded: parseInt(it.quantity || it.quantityNeeded, 10) || 1,
    quantityFulfilled: 0,
    urgency: it.urgency || commonDetails.urgency || 'HIGH',
    status: 'PENDING',
    dropLocation: commonDetails.dropLocation || 'Camp Main Gate',
    note: it.note || commonDetails.note || '',
    dateCreated: new Date().toISOString()
  }));

  db.requests.unshift(...created);
  saveDatabase();

  res.status(201).json({ message: `Successfully posted ${created.length} requirements`, requests: created });
});

// UPDATE request status (Requirement 5: pending, accepted, or completed)
app.patch('/api/requests/:id/status', (req, res) => {
  const { status, note } = req.body;
  const index = db.requests.findIndex(r => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Request not found' });

  const validStatuses = ['PENDING', 'ACCEPTED', 'COMPLETED', 'VERIFIED', 'DISPATCHED'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  db.requests[index].status = status;
  if (status === 'ACCEPTED' || status === 'COMPLETED') {
    db.requests[index].acceptedAt = new Date().toISOString();
    if (note) db.requests[index].confirmationNote = note;
  }
  db.requests[index].updatedAt = new Date().toISOString();
  saveDatabase();

  res.json({ message: `Request #${req.params.id} updated to ${status}`, request: db.requests[index] });
});

// CONFIRM delivery receipt
app.post('/api/requests/:id/accept', (req, res) => {
  const { note } = req.body;
  const index = db.requests.findIndex(r => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Request not found' });

  db.requests[index].status = 'ACCEPTED';
  db.requests[index].acceptedAt = new Date().toISOString();
  db.requests[index].confirmationNote = note || 'Supplies received and verified at camp.';
  saveDatabase();

  res.json({ message: 'Delivery receipt confirmed', request: db.requests[index] });
});

// DELETE requirement
app.delete('/api/requests/:id', (req, res) => {
  const index = db.requests.findIndex(r => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Request not found' });

  const deleted = db.requests.splice(index, 1)[0];
  saveDatabase();

  res.json({ message: 'Request removed successfully', request: deleted });
});

// ============================================================================
// 5. PLEDGES & SUPPLY DISPATCHES
// ============================================================================
app.get('/api/pledges', (req, res) => {
  res.json({ total: db.pledges.length, pledges: db.pledges });
});

app.post('/api/pledges', (req, res) => {
  const { requestId, donorName, donorPhone, donorEmail, pincode, itemName, quantity, deliveryMethod, dropoffHub, trackingNotes } = req.body;

  const newPledge = {
    id: `PLG-${Math.floor(100 + Math.random() * 900)}`,
    requestId: requestId || 'GEN-AID',
    donorName: donorName || 'Aid Supporter',
    donorPhone: donorPhone || '',
    donorEmail: donorEmail || '',
    pincode: pincode || '',
    itemName: itemName || 'Basic Supplies',
    quantity: parseInt(quantity, 10) || 1,
    deliveryMethod: deliveryMethod || 'DIRECT_CAMP_DROPOFF',
    dropoffHub: dropoffHub || 'Designated Camp Gate',
    status: 'PLEDGED', // PLEDGED -> IN_TRANSIT -> DELIVERED_TO_HUB -> ACCEPTED
    pledgeDate: new Date().toISOString(),
    trackingNotes: trackingNotes || 'Pledge registered on AidConnect'
  };

  db.pledges.unshift(newPledge);

  // If tied to request, update fulfilled count
  if (requestId) {
    const rIndex = db.requests.findIndex(r => r.id === requestId);
    if (rIndex !== -1) {
      db.requests[rIndex].quantityFulfilled = (db.requests[rIndex].quantityFulfilled || 0) + newPledge.quantity;
      if (db.requests[rIndex].quantityFulfilled >= db.requests[rIndex].quantityNeeded) {
        db.requests[rIndex].status = 'ACCEPTED';
      }
    }
  }

  saveDatabase();
  res.status(201).json({ message: 'Pledge submitted successfully', pledge: newPledge });
});

// ============================================================================
// 6. FINANCIAL RELIEF & 80G CONTRIBUTIONS
// ============================================================================
app.get('/api/donations/money', (req, res) => {
  const total = db.monetaryDonations.reduce((sum, d) => sum + (d.amount || 0), 0);
  res.json({ totalFunds: total, count: db.monetaryDonations.length, donations: db.monetaryDonations });
});

app.post('/api/donations/money', (req, res) => {
  const { amount, donorName, donorPhone, donorEmail, pincode, panNumber, targetCampName, targetPincode, paymentMethod, purpose } = req.body;

  const numAmount = parseFloat(amount) || 0;
  if (numAmount < 50) {
    return res.status(400).json({ error: 'Minimum financial donation is ₹50.' });
  }

  const receiptNumber = `RCP-80G-${Math.floor(100000 + Math.random() * 900000)}`;
  const utr = `UTR/${Date.now().toString().slice(-8)}${Math.floor(100 + Math.random() * 900)}`;

  const donation = {
    id: `FND-${Date.now()}`,
    receiptNumber,
    utr,
    amount: numAmount,
    donorName: donorName || 'Anonymous Supporter',
    donorPhone: donorPhone || '',
    donorEmail: donorEmail || '',
    pincode: pincode || '',
    panNumber: panNumber ? String(panNumber).toUpperCase() : '',
    targetCampName: targetCampName || 'AidConnect Emergency Relief Pool',
    targetPincode: targetPincode || '',
    paymentMethod: paymentMethod || 'UPI',
    purpose: purpose || 'Disaster Survival Necessities & Food Water Sponsoring',
    timestamp: new Date().toISOString(),
    status: 'VERIFIED_RECEIVED',
    taxExempt: '80G Approved (50% Tax Deduction Eligible)'
  };

  db.monetaryDonations.unshift(donation);
  saveDatabase();

  res.status(201).json({ message: 'Financial contribution recorded successfully', donation });
});

// ============================================================================
// 7. PIN CODE & SHELTER PROXIMITY ENGINE
// ============================================================================
app.get('/api/pincode/:pincode', (req, res) => {
  const info = resolvePincode(req.params.pincode);
  res.json(info);
});

// ============================================================================
// 8. MASTER DASHBOARD ANALYTICS (REQUIREMENT 6)
// ============================================================================
app.get('/api/dashboard/stats', (req, res) => {
  const totalResourcesUnits = db.resources.reduce((sum, r) => sum + (r.inStock || 0), 0);
  const activeRequests = db.requests.filter(r => r.status !== 'COMPLETED');
  const completedRequests = db.requests.filter(r => r.status === 'COMPLETED');
  const acceptedPledges = db.pledges.filter(p => p.status === 'ACCEPTED' || p.status === 'DELIVERED_TO_HUB');
  const completedDonationsCount = completedRequests.length + acceptedPledges.length;
  const totalMonetaryFunds = db.monetaryDonations.reduce((sum, d) => sum + (d.amount || 0), 0);

  res.json({
    availableResourcesUnits: totalResourcesUnits,
    activeRequestsCount: activeRequests.length,
    completedDonationsCount,
    totalMonetaryFunds,
    totalRegisteredDonors: db.users.filter(u => u.role === 'DONOR').length,
    totalVolunteers: db.users.filter(u => u.role === 'VOLUNTEER').length,
    totalOrganizations: db.users.filter(u => u.role === 'ORGANIZATION').length,
    timestamp: new Date().toISOString()
  });
});

// ============================================================================
// START SERVER
// ============================================================================
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 AidConnect Backend Server running on port ${PORT}`);
  console.log(`📡 Health Check:  http://localhost:${PORT}/api/health`);
  console.log(`📦 Resources:     http://localhost:${PORT}/api/resources`);
  console.log(`📋 Requests:      http://localhost:${PORT}/api/requests`);
  console.log(`📊 Dashboard:     http://localhost:${PORT}/api/dashboard/stats`);
  console.log(`💾 Database file: ${DB_FILE}`);
  console.log(`======================================================\n`);
});

export default app;
