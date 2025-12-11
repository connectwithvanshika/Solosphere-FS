// backend/src/clearTips.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Tip from "./models/Tip.js";

dotenv.config();

async function clearTips() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Tip.deleteMany({});
    console.log("✔ All old tips removed!");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error clearing tips:", err);
    process.exit(1);
  }
}

clearTips();
