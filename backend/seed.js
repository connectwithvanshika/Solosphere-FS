import mongoose from "mongoose";
import dotenv from "dotenv";
import Post from "./src/models/Post.js";


dotenv.config({ path: "./.env" });


const places = [
  {
    title: "Zostel Goa",
    description: "Popular backpacker hostel with beach access and nightlife nearby.",
    rating: 4.5,
    imageUrl: "https://zostel.com/static/images/home1.jpg",
    category: "Hostel",
    city: "Goa",
    tags: ["shared", "community", "safe"],
    lat: 15.2993,
    lng: 74.1240
  },
  {
    title: "Blue Beach Hut",
    description: "Private stay near Calangute Beach, perfect for solo travelers.",
    rating: 4.7,
    imageUrl: "https://example.com/goahut.jpg",
    category: "Private Stay",
    city: "Goa",
    tags: ["private", "female-only"],
    lat: 15.5600,
    lng: 73.7550
  },
  {
    title: "Moustache Hostel Jaipur",
    description: "Rooftop views, cultural vibes, and community events.",
    rating: 4.6,
    imageUrl: "https://example.com/jaipurhostel.jpg",
    category: "Hostel",
    city: "Jaipur",
    tags: ["shared", "community"],
    lat: 26.9124,
    lng: 75.7873
  },

  // ---- ADD MORE ----  
  // I'll generate 50, but first test these 3.
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🔥 MongoDB Connected...");

    await Post.deleteMany();
    console.log("🗑 Old data cleared.");

    await Post.insertMany(places);
    console.log("🌍 New places inserted successfully!");

    process.exit();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

seedData();
