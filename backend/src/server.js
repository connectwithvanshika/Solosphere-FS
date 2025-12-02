import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";

dotenv.config();

const app = express();

// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://solosphere-fs.vercel.app"
];

// ⭐ Best CORS config for Vercel + React
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ CORS BLOCKED:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Fix for preflight request
app.options("*", cors());

app.use(express.json());

// Test endpoint
app.get("/", (req, res) => {
  res.json({ message: "Backend is live 🌍" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

const PORT = process.env.PORT || 5000;

// Start server
await connectDB();
console.log("MongoDB connected 🤍");

app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));

export default app;
