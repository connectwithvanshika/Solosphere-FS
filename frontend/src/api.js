const API_BASE =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api" // when running locally
    : "https://solosphere-fs-ycns.vercel.app/api"; // deployed backend

export default API_BASE;
