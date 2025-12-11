// backend/src/models/Place.js
import mongoose from "mongoose";

const placeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
    category: { type: String, required: true },
    saved: { type: Boolean, default: false },
    image: { type: String, required: true },
    description: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.models?.Place || mongoose.model("Place", placeSchema);
