import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery"; // <-- FIXED IMPORT
import MyPosts from "./pages/MyPosts";


import "leaflet/dist/leaflet.css";



export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} /> 
        <Route path="/my-posts" element={<MyPosts />} />
      </Routes>
    </Router>
  );
}



