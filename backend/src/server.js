// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import { connectDB } from "./config/db.js";

// import authRoutes from "./routes/authRoutes.js";
// import postRoutes from "./routes/postRoutes.js";


// const app = express();

// dotenv.config();


// app.use("/api/posts", postRoutes);



// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://solosphere-fs.vercel.app"
// ];

// app.use(
//   cors({
//     origin: allowedOrigins,
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// app.use(express.json());

// app.get("/", (req, res) => {
//   res.json({ message: "Backend working correctly ✔️" });
// });

// app.use("/api/auth", authRoutes);
// app.use("/api/posts", postRoutes);

// const PORT = process.env.PORT || 5000;

// await connectDB();
// console.log("MongoDB Connected 🤍");

// app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));

// export default app;



import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";

// Load environment variables first
dotenv.config();

const app = express();

/* -------- CORS MUST COME BEFORE ROUTES -------- */
const allowedOrigins = [
  "http://localhost:5173",
  "https://solosphere-fs.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// JSON parser
app.use(express.json());

/* -------- ROUTES -------- */
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Test Route
app.get("/", (req, res) => {
  res.json({ message: "Backend working correctly ✔️" });
});

/* -------- SERVER + DB -------- */
await connectDB();
console.log("MongoDB Connected 🤍");

const PORT = process.env.PORT || 5001;

app.listen(PORT, () =>
  console.log(`🚀 Backend running on port ${PORT}`)
);

export default app;
