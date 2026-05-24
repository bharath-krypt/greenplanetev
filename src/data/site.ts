export const COMPANY = {
  name: "Green Planet Ev Spares",
  logo: "/greenplanet-logo.png",
  tagline: "Powering India's electric two-wheelers",
  phone: "+91 99599 52389",
  whatsapp: "919959952389",
  email: "orders@greenplanetevspares.com",
  address: "Industrial Area, Phase II, New Delhi — 110020",
  gstNote: "All items +18% GST · EV chargers +5% GST",
};

export const COLLABORATOR = {
  name: "Baluka E Motors",
  shortName: "BEM",
  logo: "/1000122634.png",
  website: "https://balukaemotors.com",
};

export const STATS = [
  { value: "700+", label: "SKUs in stock" },
  { value: "50+", label: "Product categories" },
  { value: "10K+", label: "Dealers served" },
  { value: "24h", label: "Dispatch on bulk orders" },
];

export const CATEGORIES = [
  { id: "motors", name: "Hub Motors", icon: "⚡", count: 48, desc: "Disc & drum, all sizes" },
  { id: "bms", name: "BMS & Battery", icon: "🔋", count: 32, desc: "Li-ion, LFP, Daly & more" },
  { id: "chargers", name: "Chargers", icon: "🔌", count: 24, desc: "Li-ion / LFP chargers" },
  { id: "bearings", name: "Bearings & Consets", icon: "⚙️", count: 86, desc: "Wheel, motor & handle" },
  { id: "brakes", name: "Brakes", icon: "🛑", count: 64, desc: "Pads, cables, sensors" },
  { id: "body", name: "Body & Panels", icon: "🛵", count: 120, desc: "Covers, mudguards, trim" },
  { id: "electrical", name: "Electrical", icon: "💡", count: 95, desc: "Switches, lights, flashers" },
  { id: "wiring", name: "Wiring & Connectors", icon: "🔗", count: 42, desc: "Anderson, Wago, sockets" },
];

export type PriceTier = { qty: string; price: number };

export type Product = {
  id: string;
  name: string;
  category: string;
  image: string;
  badge?: string;
  tiers: PriceTier[];
  rating: number;
  reviews: number;
  compatible?: string[];
  description?: string;
  minQty?: number;
  shopifyId?: string;
  variantId?: string;
  available?: boolean;
};

export { ALL_PRODUCTS as PRODUCTS, COLLECTIONS, TOTAL_PRODUCTS } from "./catalog";

export const FEATURES = [
  {
    title: "Bulk pricing tiers",
    desc: "Transparent quantity breaks on every SKU — the more you order, the less you pay per unit.",
  },
  {
    title: "OEM-grade quality",
    desc: "BEM Premium and budget-friendly lines so workshops can match every customer's budget.",
  },
  {
    title: "Pan-India dispatch",
    desc: "Same-day dispatch on bulk orders. Track shipments from warehouse to your doorstep.",
  },
  {
    title: "Technical support",
    desc: "WhatsApp support for compatibility checks, wiring diagrams, and bulk quotations.",
  },
];

export const TESTIMONIALS = [
  {
    name: "Rajesh Kumar",
    role: "EV Workshop Owner, Pune",
    text: "Switched from multiple suppliers to Green Planet. Hub motors and BMS stock is reliable, and bulk pricing actually saves us margin.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Fleet Manager, Bangalore",
    text: "We retrofit 40+ scooters monthly. Their bearing and brake cable tiers are unbeatable for fleet maintenance.",
    rating: 5,
  },
  {
    name: "Amit Patel",
    role: "Dealer, Ahmedabad",
    text: "Fast WhatsApp quotes and same-week delivery. The new site makes finding compatible parts much easier.",
    rating: 4,
  },
];

export const FAQS = [
  {
    q: "How does bulk pricing work?",
    a: "Each product lists quantity tiers with per-unit rates. Select your quantity at checkout — GST is applied as noted (18% on most items, 5% on EV chargers).",
  },
  {
    q: "Do you ship across India?",
    a: "Yes. We dispatch from Delhi NCR with pan-India courier partners. Bulk orders above ₹25,000 qualify for free shipping.",
  },
  {
    q: "Can I check part compatibility?",
    a: "Use the part finder on the homepage or message us on WhatsApp with your vehicle model. Our team confirms fitment before you order.",
  },
  {
    q: "What is your return policy?",
    a: "Defective items can be reported within 7 days with photos. Unused wrong-fit parts may be exchanged subject to inspection.",
  },
];

export const NAV_LINKS = [
  { href: "#quick-order-list", label: "Categories" },
  { href: "#products", label: "Products" },
  { href: "#why-us", label: "Why Us" },
  { href: "#reviews", label: "Reviews" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];
