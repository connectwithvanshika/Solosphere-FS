import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import tipsRoutes from "./routes/tipsRoutes.js";
import placesRoutes from "./routes/placesRoutes.js";
import emergencyRoutes from "./routes/emergencyRoutes.js";
import companionRoutes from "./routes/companionRoutes.js";

dotenv.config();
const app = express();

/* -------------------- CORS CONFIG -------------------- */
const allowedOrigins = [
  "http://localhost:5173",
  "https://solosphere-fs.vercel.app",
  "https://solosphere-fs-ycns.vercel.app",
  "https://solosphere-backend.onrender.com"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

/* -------------------- ROUTES -------------------- */
app.get("/", (req, res) => {
  res.json({ success: true, message: "Backend Running Successfully ✔️" });
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/tips", tipsRoutes);
app.use("/api/places", placesRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/companion", companionRoutes);

/* -------------------- DATABASE -------------------- */
await db.connect();
console.log("📌 MongoDB Connected Successfully");

/* -------------------- SERVER (Render needs this!) -------------------- */
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on PORT ${PORT}`);
});

export default app;

