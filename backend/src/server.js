



import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import tipsRoutes from "./routes/tipsRoutes.js";
import placesRoutes from "./routes/placesRoutes.js";

// Load environment variables
dotenv.config();

const app = express();

/* -------------------- CORS CONFIG -------------------- */
const allowedOrigins = [
  "http://localhost:5173",
  "https://solosphere-fs.vercel.app",
  "https://solosphere-fs-ycns.vercel.app"
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

/* -------------------- DATABASE & SERVER -------------------- */
await connectDB();
console.log("📌 MongoDB Connected Successfully");

/*
  Local development uses app.listen(),
  Vercel Serverless deployment DOES NOT use app.listen().
*/
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () =>
    console.log(`🚀 Local Backend running on http://localhost:${PORT}`)
  );
}

// Export for Vercel serverless
export default app;

