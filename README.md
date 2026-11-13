# DoNation — Disaster Relief Basic Needs Aid Coordination Network

A humanitarian coordination platform designed specifically for the direct delivery of **tangible basic survival items** (drinking water, ready-to-eat rations, baby care kits, emergency medical supplies, blankets, tarpaulins, and solar lanterns) to communities affected by natural calamities (floods, landslides, cyclones, cloudbursts).

---

## 🎯 Design Philosophy — Grounded, Simple & Utilitarian (Not "AI-Made")
Unlike generic startup templates with flashy purple-blue neon gradients and crypto-buzzword filler, **DoNation** was built specifically with crisis logistics in mind:
- **Clean, High-Contrast Typography & Palette:** Utilitarian deep slate (`#0F172A`), signal emergency red (`#DC2626`), and amber warning tones readable under direct sunlight or in field conditions.
- **Real-World Relief Workflows:** Tracks real calamity zones (Wayanad landslides, Brahmaputra floods, Cyclone Dana shelters, Uttarkashi cloudburst), road accessibility conditions, camp names, and exact quantities.
- **Zero Cash Clutter:** Focuses 100% on physical survival supplies to prevent unwanted duplicate clothes or supplies while camps lack water purification tablets or infant formula.
- **Offline / Low-Bandwidth Support:** Includes a built-in **SMS Relay Format generator** and radio emergency frequencies for disaster zones with collapsed cell towers.
- **Printable Field Manifest:** Instant one-click printable handover sheet with transport plate numbers, drivers, and signature lines for logistics convoys.

---

## 👥 Three Dedicated Stakeholder Logins & Portals

The application provides dedicated login views and specialized dashboards for the three key roles:

### 1. 💚 Donor Portal (`/donor-login`)
* **Purpose:** For individual citizens, family groups, diaspora communities, and corporate CSR teams.
* **Features:**
  - **Urgent Shortages Catalog:** Filter verified shortages by category (Water, Food, Medical, Baby Care, Shelter, Hygiene, Power) and by disaster zone.
  - **Direct Material Pledging:** Specify item quantities, choose handover mode (*Drop at Regional Hub*, *Courier / Freight*, or *Sponsor Kit*).
  - **Pre-Packed Emergency Survival Kits:** Sponsor standardized wholesale crates (Clean Water Crate, Infant Nutrition Bundle, Highland Warmth Shelter Pack).
  - **Pledge Tracking:** Track status live (*Confirmed* → *In-Transit* → *Delivered to Hub* → *Distributed to Camp*).
  - *Fast Testing:* Click **"One-Click Test Login"** on the login page or in the top portal switcher to log in as **Dr. Arvind Natarajan**.

### 2. 📦 Receiver / Relief Camp Portal (`/receiver-login`)
* **Purpose:** For relief camp managers, local doctors, Panchayat leaders, ASHA workers, and affected evacuees.
* **Features:**
  - **Post Urgent Camp Need:** Specify required supplies, quantity, evacuee count, urgency level (*Critical 6-12 hrs*, *High 24 hrs*, *Moderate 48 hrs*), and gate drop landmark.
  - **Real-Time Fulfillment Tracker:** Progress bar showing how much of each requirement has been pledged by donors or allocated by NGOs.
  - **Arrival & Distribution Confirmation:** When a relief convoy arrives, the camp lead can confirm delivery with a single click and distribution note.
  - **Emergency Direct SOS:** For victims in active distress who cannot or do not want to register — an immediate, no-login SOS broadcast form.
  - *Fast Testing:* Click **"One-Click Camp Login"** to view as **Dr. K. Sukumaran** (Camp Medical Lead at Meppadi High School Relief Camp #2, 420 evacuees).

### 3. 🏢 Helping Organization / NGO Portal (`/org-login`)
* **Purpose:** For registered disaster relief NGOs (SEEDS India, Goonj, Indian Red Cross, Civil Defense).
* **Features:**
  - **Triage & Authorization Desk:** Review incoming distress signals and verify legitimate camp requests to prevent duplicate aid.
  - **Regional Staging Hub Inventory:** Track live warehouse stock (water cans, chlorine tablets, tarpaulins, solar torches) across field staging centers (Meppadi, Jorhat, Balasore, Bhatwari).
  - **Convoy Dispatch Manager:** Assign transport trucks, driver mobile numbers, and relief officer escorts.
  - **Printable Field Manifest:** Generates an official printable PDF/paper manifest for field drivers and handover officers.
  - *Fast Testing:* Click **"One-Click NGO Login"** to enter as **Shalini Sen** (Field Ops Director, SEEDS India Disaster Response).

---

## 🛠️ Project Structure

```
DoNation/
├── index.html                   # High-contrast disaster response page shell
├── package.json                 # React 18, Vite, Lucide Icons, Tailwind CSS
├── tailwind.config.js           # Emergency slate, amber, and red disaster palette
├── src/
│   ├── main.jsx                 # Entry point with Auth & Data providers
│   ├── App.jsx                  # Main routing, navbar, footer & modal coordinator
│   ├── index.css                # Base Tailwind + custom printable manifest rules
│   ├── data/
│   │   └── initialData.js       # Calamity zones, verified requests, initial inventory
│   ├── context/
│   │   ├── AuthContext.jsx      # Multi-role authentication & demo switcher
│   │   └── DataContext.jsx      # Calamities, requests, inventory & localStorage persistence
│   └── components/
│       ├── Navbar.jsx           # Clean header with portal links & fast role jump
│       ├── EmergencyAlertBanner.jsx # Live top bulletin & emergency helpline
│       ├── auth/
│       │   ├── DonorLogin.jsx   # Dedicated Donor login & registration
│       │   ├── ReceiverLogin.jsx# Dedicated Receiver & camp manager login
│       │   └── OrgLogin.jsx     # Dedicated NGO / Helping Org login
│       ├── donor/
│       │   ├── DonorDashboard.jsx # Shortages catalog, my pledges & sponsor kits
│       │   └── PledgeModal.jsx  # Pledging dialog with logistics options
│       ├── receiver/
│       │   ├── ReceiverDashboard.jsx # Camp needs, live progress, SMS export
│       │   └── EmergencyQuickRequest.jsx # Direct distress SOS (no login)
│       ├── organization/
│       │   ├── OrgDashboard.jsx # Central triage, warehouse inventory & convoys
│       │   ├── DispatchModal.jsx# Truck plate & driver dispatch logger
│       │   └── ManifestPrintView.jsx # Printable official field manifest
│       └── public/
│           ├── CalamityOverview.jsx # Active disaster zones & impact overview
│           ├── PublicReliefFeed.jsx # Live filterable needs ledger
│           ├── CampDirectory.jsx    # Relief camps & shelter capacities
│           ├── TransparencyLedger.jsx# Public accountability tracking
│           └── OfflineHelpModal.jsx # Low-bandwidth SMS template & radio guidelines
```

---

## 🚀 Running the Application Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173/](http://localhost:5173/) in your web browser.

3. **Build for production:**
   ```bash
   npm run build
   ```
   The compiled static files will be placed into the `dist/` directory.

---

## 💡 Quick Testing Tips
1. Use the **"Switch Portal View"** dropdown in the top navigation bar to seamlessly hop between:
   - **Donor Portal** (Pledge water or survival supplies)
   - **Receiver / Camp Portal** (Submit new needs or confirm arrivals)
   - **Helping Org (NGO) Desk** (Triage requests, dispatch trucks, print manifest)
2. Every action (pledges, new needs, inventory adjustments) is automatically stored in `localStorage`, so your updates persist across page reloads.
3. Click **"Reset Demo Data"** in the footer at any time to restore the platform to its pristine default state.

