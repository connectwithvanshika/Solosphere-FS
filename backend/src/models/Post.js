import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  rating: Number,
  image: String,
}, { timestamps: true });

export default mongoose.model("Post", postSchema);
