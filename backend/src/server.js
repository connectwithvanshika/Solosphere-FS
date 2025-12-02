import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";

dotenv.config();
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://solosphere-fs.vercel.app",
  "https://solosphere-fs-ycns.vercel.app"   // VERY IMPORTANT
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// required for browser OPTIONS request
app.options("*", cors());

app.use(express.json());

app.get("/", (req, res) => res.json({ message: "Backend Running 🟢" }));

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

await connectDB();
console.log("MongoDB Connected 🚀");

app.listen(5000, () => console.log(`Backend running on PORT 5000`));

export default app;
