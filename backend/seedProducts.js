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
    image: "https://imgs.search.brave.com/Ex8q6x8MXaIFuitdKM98Bp1994Vs1iulgB7zzlfou1k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NTFiZHhoYVFPNkwu/anBn",
    category: "Software",
  },
  {
    name: "Microsoft Office 365 Family",
    price: 6999,
    image: "https://imgs.search.brave.com/4Iqf-GZ0ozB8RD6oaySSuztCChWi9ShteclLonQ5h1o/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzFGYW5QcHktaUwu/anBn",
    category: "Software",
  },
  {
    name: "Adobe Photoshop 2025 Subscription",
    price: 1999,
    image: "https://imgs.search.brave.com/0smSeC6CVY7dSPa3yKeFfUxvItHsNx0os563q_Qr86Q/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wcmlz/bWF0bGFzcHJvZGV1/c3N0b3JlLmJsb2Iu/Y29yZS53aW5kb3dz/Lm5ldC9pbWFnZXMv/bXN1dGVjaHN0b3Jl/L1Byb2R1Y3RGYW1p/bHktMjAxMC9hZG9i/ZS1jYy1waG90b3No/b3AtMC5wbmc",
    category: "Software",
  },
  // PC PARTS
  {
    name: "Intel Core i7 13700K Processor",
    price: 36999,
    image: "https://imgs.search.brave.com/l-NDipdX4e5LChJHU4WPIxigmHG3qLWbVwwZzl1LwsA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLmVi/YXlpbWcuY29tL2lt/YWdlcy9nL2V5c0FB/ZVN3YUM1b3o5YWMv/cy1sMjI1LmpwZw",
    category: "Pc parts",
  },
  {
    name: "NVIDIA RTX 4070 Ti Graphics Card",
    price: 79999,
    image: "https://imgs.search.brave.com/umz1URpkdieCX9WjOhRsuxdgvOg7i3g_GyORDkI33Dk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9ydWtt/aW5pbTIuZmxpeGNh/cnQuY29tL2ltYWdl/LzQxNi80MTYveGlm/MHEvZ3JhcGhpY3Mt/Y2FyZC9tL2EvaS9n/YW1pbmctZ2Vmb3Jj/ZS1ydHgtNDA3MC10/aS10cmluaXR5LW9j/LXpvdGFjLW9yaWdp/bmFsLWltYWdxYnBm/cXV3azRhenIuanBl/Zz9xPTcwJmNyb3A9/ZmFsc2U",
    category: "Pc parts",
  },
  {
    name: "Corsair Vengeance 32GB DDR5 RAM",
    price: 12499,
    image: "https://imgs.search.brave.com/MNGvHKHFnLZtIb_nojG586YNsS3OPdbcp99u2AHpEQI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzFBVjVQUXUxeUwu/anBn",
    category: "Pc parts",
  },
  // PRINTERS & SPARES
  {
    name: "HP LaserJet Pro MFP M428fdw",
    price: 34999,
    image: "https://imgs.search.brave.com/WON-RIOC-zvTRex-fUOWpvVH3nQL5k1GMGyqlB3XFxc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL1Mv/YXBsdXMtbWVkaWEv/dmMvYzRhMjgxYWMt/OThjMC00OWZmLTgy/ZDItNDMwYTZlMjk1/YjdiLl9fQ1IwLDAs/MTQ2NCw2MDBfUFQw/X1NYMTQ2NF9WMV9f/Xy5qcGc",
    category: "Printer & printer spare parts",
  },
  {
    name: "Canon Pixma G3010 Ink Tank Printer",
    price: 16499,
    image: "https://imgs.search.brave.com/_V5ZLcuj3eMuEkBoI5wifVZndO4LUBbe30PSjFrRqt4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly92c3By/b2QudmlqYXlzYWxl/cy5jb20vbWVkaWEv/Y2F0YWxvZy9wcm9k/dWN0LzEvNC8xNDUz/NTQtaW1hZ2UxXzUu/anBnP29wdGltaXpl/PW1lZGl1bSZmaXQ9/Ym91bmRzJmhlaWdo/dD01MDAmd2lkdGg9/NTAw",
    category: "Printer & printer spare parts",
  },
  {
    name: "HP 682 Black Ink Cartridge",
    price: 1299,
    image: "https://imgs.search.brave.com/sb3x5ZtBvcRSfXi7LTH9xBrnkeW87j4EaczjMuHt_TA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NDFkOXF1aFZCdkwu/anBn",
    category: "Printer & printer spare parts",
  },
  // ELECTRICALS & ELECTRONICS
  {
    name: "Philips 10W LED Bulb (Pack of 2)",
    price: 499,
    image: "https://imgs.search.brave.com/Oe1EsyOJGNo-CJxGhzEUoPZxTPsQn6d8MqRa977Oj18/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NDFRNDd3ek9LaEwu/anBn",
    category: "Electricals & Electronics",
  },
  {
    name: "Anchor Modular Switch 10A",
    price: 199,
    image: "https://imgs.search.brave.com/rnrTMxrR2GoWw_4KODleDQS1aVPrSXohgguvyije6_E/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9ydWtt/aW5pbTIuZmxpeGNh/cnQuY29tL2ltYWdl/LzQxNi80MTYva2U3/ZmY2ODAvZWxlY3Ry/aWNhbC1zd2l0Y2gv/aC9lL2YvMjg5MTAz/LXBrNC1hbmNob3It/YnktcGFuYXNvbmlj/LW9yaWdpbmFsLWlt/YWZ1eTU4M3N3a3p1/ZmUuanBlZz9xPTcw/JmNyb3A9ZmFsc2U",
    category: "Electricals & Electronics",
  },
  {
    name: "Zebronics 2.1 Channel Bluetooth Speaker",
    price: 2599,
    image: "https://imgs.search.brave.com/Hj4pbRJTblPaZG1UE450B8ek7YL-Ey5E65YoJmHxhII/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9ydWtt/aW5pbTIuZmxpeGNh/cnQuY29tL2ltYWdl/LzYxMi82MTIveGlm/MHEvc3BlYWtlci9l/L3YvYi8tb3JpZ2lu/YWwtaW1haGVxcnI5/aGRnZGRwci5qcGVn/P3E9NzA",
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