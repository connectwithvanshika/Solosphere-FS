import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";  // ⬅️ ADD THIS


dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://solosphere-fs.vercel.app"
];

// ⭐ Improved CORS to avoid preflight errors
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes); // ⬅️ CRUCIAL

const PORT = process.env.PORT || 5000;

// Start server
await connectDB();
console.log("Moongoose connected");

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app;
