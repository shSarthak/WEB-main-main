// seedBanners.js - Run this once to populate your banners
// Usage: node seedBanners.js

import { Client as PGClient } from "pg";
import dotenv from "dotenv";

dotenv.config();

const dbClient = new PGClient({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const banners = [
  // Hero Banner
  {
    position: "hero",
    image_url: "https://images.unsplash.com/photo-1593642532400-2682810df593?w=1200",
    title: "Power Your Workspace – Shop Smarter!",
    subtitle: "Exclusive deals on tech & electronics",
    link: null,
    is_active: true,
    display_order: 1,
  },
  
  // Top Asymmetric Banner - Left (Large)
  {
    position: "top_asymmetric_left",
    image_url: "https://iili.io/Kbw75sp.jpg",
    title: "",
    subtitle: null,
    link: null,
    is_active: true,
    display_order: 1,
  },
  
  // Top Asymmetric Banner - Right (Small)
  {
    position: "top_asymmetric_right",
    image_url: "https://iili.io/Kbw7YqN.jpg",
    title: "",
    subtitle: null,
    link: null,
    is_active: true,
    display_order: 1,
  },
  
  // Horizontal Banner Strip
  {
    position: "horizontal_strip",
    image_url: "https://iili.io/Kbw7YqN.jpg",
    title: "Flash Sale Limited Stock Available",
    subtitle: "Grab Now!",
    link: null,
    is_active: true,
    display_order: 1,
  },
  
  // Zigzag Banner - Left (Small)
  {
    position: "zigzag_left",
    image_url: "https://iili.io/Kbw7a1I.jpg",
    title: "",
    subtitle: null,
    link: null,
    is_active: true,
    display_order: 1,
  },
  
  // Zigzag Banner - Right (Large)
  {
    position: "zigzag_right",
    image_url: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1000",
    title: "New Electrical Arrivals - Stock Just In!",
    subtitle: null,
    link: null,
    is_active: true,
    display_order: 1,
  },
];

async function seedBanners() {
  try {
    await dbClient.connect();
    console.log("✅ Connected to database");

    // Clear existing banners (optional - comment out if you want to keep existing data)
    await dbClient.query("DELETE FROM banners");
    console.log("🗑️  Cleared existing banners");

    // Insert banners
    for (const banner of banners) {
      await dbClient.query(
        `INSERT INTO banners (position, image_url, title, subtitle, link, is_active, display_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          banner.position,
          banner.image_url,
          banner.title,
          banner.subtitle,
          banner.link,
          banner.is_active,
          banner.display_order,
        ]
      );
      console.log(`✅ Added banner: ${banner.position} - ${banner.title}`);
    }

    console.log(`\n🎉 Successfully seeded ${banners.length} banners!`);
  } catch (err) {
    console.error("❌ Seeding error:", err);
  } finally {
    await dbClient.end();
  }
}

seedBanners();