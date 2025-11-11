import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const app = express();

import authRoutes from "./routes/authRoutes.js";


app.use(
  cors()
);

// ✅ Parse JSON requests
app.use(express.json());

app.get("/hello",()=>console.log("first"))

// ✅ Test route to verify POST works
app.post("/test", (req, res) => {
  console.log("✅ Test route hit", req.body);
  res.json({ message: "POST route working!" });
});

// ✅ Auth routes
app.use("/api/auth", authRoutes);

// ✅ Health check
app.get("/", (req, res) => {
  res.json({ message: "API running fine 🚀" });
});

export default app;
