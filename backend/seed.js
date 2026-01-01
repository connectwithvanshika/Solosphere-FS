import mongoose from "mongoose";
import dotenv from "dotenv";
import Post from "./src/models/Post.js";

dotenv.config({ path: "./.env" });

const places = [
  // --- HOSTELS ---
  {
    title: "Zostel Goa",
    description: "Popular backpacker hostel with beach access and nightlife nearby.",
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    category: "Hostel",
    city: "Goa",
    tags: ["shared", "community"],
    guests: 50,
    availableFrom: new Date("2024-01-01"),
    availableTo: new Date("2026-12-31"),
    lat: 15.2993, lng: 74.1240
  },
  {
    title: "Moustache Hostel Jaipur",
    description: "Rooftop views, cultural vibes, and community events.",
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
    category: "Hostel",
    city: "Jaipur",
    tags: ["shared", "community"],
    guests: 40,
    availableFrom: new Date("2024-01-01"),
    availableTo: new Date("2026-12-31"),
    lat: 26.9124, lng: 75.7873
  },
  {
    title: "Women's Only Hostel Mumbai",
    description: "Safe, secure accommodation exclusively for women travelers.",
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5",
    category: "Hostel",
    city: "Mumbai",
    tags: ["female-only", "shared", "private"],
    guests: 30,
    availableFrom: new Date("2024-01-01"),
    availableTo: new Date("2026-12-31"),
    lat: 19.0760, lng: 72.8777
  },
  {
    title: "Backpacker's Den Manali",
    description: "Budget-friendly hostel with mountain views and bonfire nights.",
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
    category: "Hostel",
    city: "Manali",
    tags: ["shared", "community"],
    guests: 60,
    availableFrom: new Date("2024-01-01"),
    availableTo: new Date("2026-12-31"),
    lat: 32.2396, lng: 77.1887
  },
  {
    title: "Beachside Hostel Gokarna",
    description: "Relaxed hostel steps from the beach with yoga sessions.",
    rating: 4.6,
    imageUrl: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/612731999.jpg?k=a8dfe6a610273dd8e4b6501a1a897fc53c1cd6495f8f01da3f559fefb1911012&o=",
    category: "Hostel",
    city: "Gokarna",
    tags: ["shared", "community"],
    guests: 45,
    availableFrom: new Date("2024-01-01"),
    availableTo: new Date("2026-12-31"),
    lat: 14.5486, lng: 74.3189
  },

  // --- APARTMENTS ---
  {
    title: "Riverside Apartment Rishikesh",
    description: "Peaceful apartment near the Ganges, perfect for yoga retreats.",
    rating: 4.6,
    imageUrl: "https://plus.unsplash.com/premium_photo-1676657955279-8fd22fbb75e0",
    category: "Apartment",
    city: "Rishikesh",
    tags: ["private"],
    guests: 4,
    availableFrom: new Date("2024-01-01"),
    availableTo: new Date("2026-12-31"),
    lat: 30.0869, lng: 78.2676
  },
  {
    title: "Cozy Apartment Delhi",
    description: "Modern apartment in the heart of Delhi with metro access.",
    rating: 4.4,
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
    category: "Apartment",
    city: "Delhi",
    tags: ["private"],
    guests: 3,
    availableFrom: new Date("2024-01-01"),
    availableTo: new Date("2026-12-31"),
    lat: 28.7041, lng: 77.1025
  },
  {
    title: "Urban Loft Bangalore",
    description: "Stylish apartment in tech hub with coworking space nearby.",
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9",
    category: "Apartment",
    city: "Bangalore",
    tags: ["private"],
    guests: 2,
    availableFrom: new Date("2024-01-01"),
    availableTo: new Date("2026-12-31"),
    lat: 12.9716, lng: 77.5946
  },
  {
    title: "Sea View Flat Mumbai",
    description: "High-rise apartment overlooking the Arabian Sea.",
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
    category: "Apartment",
    city: "Mumbai",
    tags: ["private", "female-only"],
    guests: 4,
    availableFrom: new Date("2024-01-01"),
    availableTo: new Date("2026-12-31"),
    lat: 19.0760, lng: 72.8777
  },
  {
    title: "Heritage Home Kolkata",
    description: "Vintage aesthetics with modern amenities in Salt Lake.",
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
    category: "Apartment",
    city: "Kolkata",
    tags: ["private", "community"],
    guests: 5,
    availableFrom: new Date("2024-01-01"),
    availableTo: new Date("2026-12-31"),
    lat: 22.5726, lng: 88.3639
  },

  // --- CAMPS ---
  {
    title: "Pangong Camp",
    description: "Lakeside camping experience in Ladakh with stunning views.",
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d",
    category: "Camp",
    city: "Ladakh",
    tags: ["shared", "community"],
    guests: 20,
    availableFrom: new Date("2024-01-01"),
    availableTo: new Date("2026-12-31"),
    lat: 33.7782, lng: 78.9969
  },
  {
    title: "Hampi Heritage Camp",
    description: "Heritage camping near ancient ruins with guided tours.",
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4",
    category: "Camp",
    city: "Hampi",
    tags: ["shared", "community"],
    guests: 15,
    availableFrom: new Date("2024-01-01"),
    availableTo: new Date("2026-12-31"),
    lat: 15.3350, lng: 76.4600
  },
  {
    title: "Mountain View Camp Dharamshala",
    description: "Peaceful camping spot with Himalayan views and trekking routes.",
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce",
    category: "Camp",
    city: "Dharamshala",
    tags: ["shared", "community"],
    guests: 30,
    availableFrom: new Date("2024-01-01"),
    availableTo: new Date("2026-12-31"),
    lat: 32.2190, lng: 76.3234
  },
  {
    title: "Desert Camp Jaisalmer",
    description: "Traditional desert camping with camel safari and folk music.",
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29",
    category: "Camp",
    city: "Jaisalmer",
    tags: ["shared", "community"],
    guests: 40,
    availableFrom: new Date("2024-01-01"),
    availableTo: new Date("2026-12-31"),
    lat: 26.9157, lng: 70.9083
  },
  {
    title: "Forest Haven Eco-Camp Munnar",
    description: "Eco-friendly tents surrounded by tea plantations.",
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7",
    category: "Camp",
    city: "Munnar",
    tags: ["private", "shared"],
    guests: 10,
    availableFrom: new Date("2024-01-01"),
    availableTo: new Date("2026-12-31"),
    lat: 10.0889, lng: 77.0595
  },

  // --- PRIVATE STAYS ---
  {
    title: "Blue Beach Hut",
    description: "Private stay near Calangute Beach, perfect for solo travelers.",
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf",
    category: "Private Stay",
    city: "Goa",
    tags: ["private", "female-only"],
    guests: 2,
    availableFrom: new Date("2024-01-01"),
    availableTo: new Date("2026-12-31"),
    lat: 15.5600, lng: 73.7550
  },
  {
    title: "Gokulam Private Stay",
    description: "Traditional Kerala home with local family experience.",
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1564501049412-61c2a3083791",
    category: "Private Stay",
    city: "Kerala",
    tags: ["private", "community"],
    guests: 3,
    availableFrom: new Date("2024-01-01"),
    availableTo: new Date("2026-12-31"),
    lat: 10.8505, lng: 76.2711
  },
  {
    title: "Sunset Villa Goa",
    description: "Luxury private villa with pool and beach proximity.",
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811",
    category: "Private Stay",
    city: "Goa",
    tags: ["private"],
    guests: 6,
    availableFrom: new Date("2024-01-01"),
    availableTo: new Date("2026-12-31"),
    lat: 15.4909, lng: 73.8278
  },

  // --- NEW ADDITIONS FOR BETTER FILTER COVERAGE ---
  {
    title: "SafeGlamp Women's Camp",
    description: "Exclusive women-only glamping experience with 24/7 security.",
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1496545672479-7ac37b969160",
    category: "Camp",
    city: "Rishikesh",
    tags: ["female-only", "private", "shared"],
    guests: 12,
    availableFrom: new Date("2024-01-01"),
    availableTo: new Date("2026-12-31"),
    lat: 30.0869, lng: 78.2676
  },
  {
    title: "SheTravels Hostel Delhi",
    description: "Vibrant hostel in South Delhi designed for female backpackers.",
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6",
    category: "Hostel",
    city: "Delhi",
    tags: ["female-only", "shared", "community"],
    guests: 35,
    availableFrom: new Date("2024-01-01"),
    availableTo: new Date("2026-12-31"),
    lat: 28.5244, lng: 77.1855
  },
  {
    title: "Writer's Retreat Apartment",
    description: "Quiet, community-focused apartment complex for creatives.",
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
    category: "Apartment",
    city: "Shimla",
    tags: ["private", "community"],
    guests: 2,
    availableFrom: new Date("2024-01-01"),
    availableTo: new Date("2026-12-31"),
    lat: 31.1048, lng: 77.1734
  },
  {
    title: "Zen Garden Cottage",
    description: "Peaceful private stay offering meditation classes.",
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1587061949409-02df41d5e562",
    category: "Private Stay",
    city: "Pondicherry",
    tags: ["private", "female-only"],
    guests: 3,
    availableFrom: new Date("2024-01-01"),
    availableTo: new Date("2026-12-31"),
    lat: 11.9416, lng: 79.8083
  },
  {
    title: "Nomad Hub Hostel",
    description: "The ultimate co-living space for digital nomads.",
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1520277739336-7bf67edfa768",
    category: "Hostel",
    city: "Bangalore",
    tags: ["shared", "community", "private"],
    guests: 60,
    availableFrom: new Date("2024-01-01"),
    availableTo: new Date("2026-12-31"),
    lat: 12.9352, lng: 77.6245
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🔥 MongoDB Connected...");

    await Post.deleteMany();
    console.log("🗑 Old data cleared.");

    await Post.insertMany(places);
    console.log(`✅ ${places.length} places inserted successfully!`);

    // Show breakdown
    const hostels = places.filter(p => p.category === "Hostel").length;
    const apartments = places.filter(p => p.category === "Apartment").length;
    const camps = places.filter(p => p.category === "Camp").length;
    const privateStays = places.filter(p => p.category === "Private Stay").length;

    console.log(`📊 Breakdown: ${hostels} Hostels, ${apartments} Apartments, ${camps} Camps, ${privateStays} Private Stays`);

    process.exit();
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

seedData();