import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    rating: Number,
    imageUrl: { type: String, trim: true },

    // ⭐ NEW FIELDS FOR FILTERING
    category: {
      type: String,
      enum: ["hostel", "cafe", "apartment", "camp", "stay", "safe"],
      required: false,
    },

    city: { type: String, trim: true },

    tags: [String], // e.g ["female-only", "safe", "budget", "verified"]

    lat: Number,
    lng: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
