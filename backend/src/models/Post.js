// import mongoose from "mongoose";

// const postSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     description: String,
//     rating: Number,
//     imageUrl: { type: String, trim: true },

//     // ⭐ NEW FIELDS FOR FILTERING
//     category: {
//       type: String,
//       enum: ["hostel", "cafe", "apartment", "camp", "stay", "safe"],
//       required: false,
//     },

//     city: { type: String, trim: true },

//     tags: [String], // e.g ["female-only", "safe", "budget", "verified"]

//     lat: Number,
//     lng: Number,
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Post", postSchema);

import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    rating: { type: Number, default: 0 },
    imageUrl: { type: String, trim: true, required: false },

    // ⭐ FILTERING FIELDS
    category: {
      type: String,
      enum: ["Hostel", "Apartment", "Camp", "Private Stay", "Shared", "Café"],
      required: false,
    },

    city: { type: String, trim: true },

    tags: { type: [String], default: [] },

    guests: { type: Number, default: 1 },
    availableFrom: { type: Date, default: null },
    availableTo: { type: Date, default: null },

    // ⭐ NIGHT SAFETY FIELDS
    nightSafetyScore: { type: Number, default: 0 },
    nightSafetyTags: {
      lighting: { type: Boolean, default: false },
      crowd: { type: Boolean, default: false },
      security: { type: Boolean, default: false }
    },

    // (optional) for Maps
    lat: Number,
    lng: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);

