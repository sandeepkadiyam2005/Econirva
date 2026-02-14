const products = [
  {
    id: 1,
    title: "Shopping & Carry Bags",
    category: "Retail",
    description: "Premium compostable carry bags for branded stores and daily retail checkout.",
    image: "/products/shopping-bags.svg",
    pricePerUnit: 8.5,
    moq: 5000,
    leadTime: "8-12 days",
    material: "Corn-starch PLA",
    customization: ["Single-color logo", "Multi-color print", "Private label"]
  },
  {
    id: 2,
    title: "Grocery & Supermarket Bags",
    category: "Supermarket",
    description: "Food-safe, high-strength grocery bags for supermarkets and provision chains.",
    image: "/products/grocery-bags.svg",
    pricePerUnit: 6.25,
    moq: 10000,
    leadTime: "7-10 days",
    material: "Bio-based polymer blend",
    customization: ["Store branding", "Offer print", "Barcode-ready panel"]
  },
  {
    id: 3,
    title: "Compostable Roll-On Bags",
    category: "Restaurant",
    description: "Perforated roll-on bag formats for kitchens, delivery counters, and service hubs.",
    image: "/products/roll-on-bags.svg",
    pricePerUnit: 210,
    moq: 250,
    leadTime: "6-10 days",
    material: "Biodegradable roll film",
    customization: ["Chain branding", "Outlet code", "Thank-you message"]
  }
];

export default products;
