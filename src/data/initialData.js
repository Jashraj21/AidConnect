export const CATEGORIES = [
  { id: "CLOTHES", label: "Clothes", icon: "Shirt", color: "text-indigo-700 bg-indigo-50 border-indigo-200" },
  { id: "HYGIENE", label: "Sanitary & Hygiene", icon: "ShieldAlert", color: "text-teal-700 bg-teal-50 border-teal-200" },
  { id: "WATER", label: "Water Bottles & Clean Water", icon: "Droplets", color: "text-blue-700 bg-blue-50 border-blue-200" },
  { id: "FOOD", label: "Food (Fruits & Packet Foods)", icon: "Utensils", color: "text-amber-700 bg-amber-50 border-amber-200" },
  { id: "MEDICINE", label: "Medicines & First Aid", icon: "HeartPulse", color: "text-rose-700 bg-rose-50 border-rose-200" },
  { id: "BOOKS", label: "Books & Educational", icon: "BookOpen", color: "text-violet-700 bg-violet-50 border-violet-200" },
  { id: "SHELTER_ESSENTIALS", label: "Blankets, Tarps & Essentials", icon: "Tent", color: "text-emerald-700 bg-emerald-50 border-emerald-200" }
];

export const STANDARD_ITEMS = [
  // Clothes
  { id: "shirt", category: "CLOTHES", name: "Shirt", unit: "pieces", description: "Wearable shirts for adults and children" },
  { id: "pant", category: "CLOTHES", name: "Pant / Trousers", unit: "pieces", description: "Pants, trousers, and jeans" },
  { id: "tshirt", category: "CLOTHES", name: "T-Shirt", unit: "pieces", description: "Comfortable casual t-shirts" },
  { id: "shorts", category: "CLOTHES", name: "Shorts", unit: "pieces", description: "Daily wear shorts for adults and kids" },

  // Sanitary Pads
  { id: "sanitary-pads", category: "HYGIENE", name: "Sanitary Pads", unit: "packs", description: "Hygiene sanitary pads and napkins" },

  // Water Bottles
  { id: "water-bottles", category: "WATER", name: "Water Bottles", unit: "bottles", description: "Packaged drinking water bottles & clean containers" },

  // Food Items (Fruits & Packet Foods)
  { id: "fruits", category: "FOOD", name: "Fruits", unit: "kg / crates", description: "Fresh fruits (bananas, apples, oranges, etc.)" },
  { id: "packet-food", category: "FOOD", name: "Packet Foods", unit: "packets", description: "Biscuits, dry rations, noodles, ready-to-eat packets" },

  // Medicines
  { id: "medicines", category: "MEDICINE", name: "Medicines", unit: "strips / packs", description: "Basic essential medicines, ORS, paracetamol, antiseptics, bandages" },

  // Books
  { id: "books", category: "BOOKS", name: "Books", unit: "books / sets", description: "School textbooks, notebooks, reading books, stationery" },

  // Everything needed
  { id: "blankets", category: "SHELTER_ESSENTIALS", name: "Blankets", unit: "pieces", description: "Warm blankets and bedsheets" },
  { id: "tarpaulins", category: "SHELTER_ESSENTIALS", name: "Tarpaulins", unit: "sheets", description: "Waterproof protective sheets and tarps" },
  { id: "torches", category: "SHELTER_ESSENTIALS", name: "Torches & Flashlights", unit: "units", description: "Emergency torches, batteries, and lanterns" }
];

export const CALAMITY_ZONES = [];
export const SAMPLE_ORGANIZATIONS = [];
export const INITIAL_REQUESTS = [];
export const INITIAL_PLEDGES = [];
export const INITIAL_INVENTORY = [];
