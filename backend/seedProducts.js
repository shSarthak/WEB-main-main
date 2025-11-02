// seedProducts.js - Run this once to populate your database
// Usage: node seedProducts.js

import { Client as PGClient } from "pg";
import dotenv from "dotenv";

dotenv.config();

const dbClient = new PGClient({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const products = [
  // SOFTWARE
  {
    name: "Windows 11 Pro License",
    price: 12999,
    image: "/assets/windows11pro.png",
    category: "Software",
  },
  {
    name: "Microsoft Office 365 Family",
    price: 6999,
    image: "/assets/office365.png",
    category: "Software",
  },
  {
    name: "Adobe Photoshop 2025 Subscription",
    price: 1999,
    image: "/assets/photoshop.png",
    category: "Software",
  },
  // PC PARTS
  {
    name: "Intel Core i7 13700K Processor",
    price: 36999,
    image: "/assets/i7.png",
    category: "Pc parts",
  },
  {
    name: "NVIDIA RTX 4070 Ti Graphics Card",
    price: 79999,
    image: "/assets/rtx4070ti.png",
    category: "Pc parts",
  },
  {
    name: "Corsair Vengeance 32GB DDR5 RAM",
    price: 12499,
    image: "/assets/ddr5.png",
    category: "Pc parts",
  },
  // PRINTERS & SPARES
  {
    name: "HP LaserJet Pro MFP M428fdw",
    price: 34999,
    image: "/assets/hp-printer.png",
    category: "Printer & printer spare parts",
  },
  {
    name: "Canon Pixma G3010 Ink Tank Printer",
    price: 16499,
    image: "/assets/canon.png",
    category: "Printer & printer spare parts",
  },
  {
    name: "HP 682 Black Ink Cartridge",
    price: 1299,
    image: "/assets/hp-ink.png",
    category: "Printer & printer spare parts",
  },
  // ELECTRICALS & ELECTRONICS
  {
    name: "Philips 10W LED Bulb (Pack of 2)",
    price: 499,
    image: "/assets/philips-led.png",
    category: "Electricals & Electronics",
  },
  {
    name: "Anchor Modular Switch 10A",
    price: 199,
    image: "/assets/switch.png",
    category: "Electricals & Electronics",
  },
  {
    name: "Zebronics 2.1 Channel Bluetooth Speaker",
    price: 2599,
    image: "/assets/zebronics.png",
    category: "Electricals & Electronics",
  },
];

async function seedProducts() {
  try {
    await dbClient.connect();
    console.log("✅ Connected to database");

    // Clear existing products (optional - comment out if you want to keep existing data)
    await dbClient.query("DELETE FROM products");
    console.log("🗑️  Cleared existing products");

    // Insert products
    for (const product of products) {
      await dbClient.query(
        `INSERT INTO products (name, price, image, category)
         VALUES ($1, $2, $3, $4)`,
        [product.name, product.price, product.image, product.category]
      );
      console.log(`✅ Added: ${product.name}`);
    }

    console.log(`\n🎉 Successfully seeded ${products.length} products!`);
  } catch (err) {
    console.error("❌ Seeding error:", err);
  } finally {
    await dbClient.end();
  }
}

seedProducts();