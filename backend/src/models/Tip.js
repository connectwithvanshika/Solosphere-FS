// backend/src/models/Tip.js
import mongoose from "mongoose";

const tipSchema = new mongoose.Schema(
  {
    city: { type: String, required: true },
    category: { type: String, required: true },
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    verified: { type: Boolean, default: false },
    image: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.models?.Tip || mongoose.model("Tip", tipSchema);
