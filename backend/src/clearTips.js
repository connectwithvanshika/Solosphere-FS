import mongoose from "mongoose";
import dotenv from "dotenv";
import Tip from "./models/Tip.js";

dotenv.config();

async function clear() {
  await mongoose.connect(process.env.MONGO_URI);

  await Tip.deleteMany({});
  console.log("All tips removed!");

  process.exit(0);
}

clear();
