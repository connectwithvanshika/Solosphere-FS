// const API_BASE =
//   import.meta.env.MODE === "development"
//     ? "http://localhost:5001/api" // correct local backend
//     : "https://solosphere-fs-ycns.vercel.app/api"; // deployed backend

// export default API_BASE;


const API_BASE =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001/api"
    : "https://solosphere-fs-ycns.vercel.app/api"; 
    export default API_BASE;

