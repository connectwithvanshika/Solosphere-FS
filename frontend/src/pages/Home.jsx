
import "../styles/home.css";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import axios from "axios";

import Explore from "./Explore";
// import Map from "./Map";
import Gallery from "./Gallery";
import MyPosts from "./MyPosts";
import Footer from "./Footer";
import TravelTips from "./TravelTips";

const API_BASE =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001/api"
    : "https://solosphere-fs-ycns.vercel.app/api";

export default function Home() {
  const navigate = useNavigate();

  // Search states
  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("");
  const [category, setCategory] = useState(""); // NEW: for category filtering
  const [selectedTag, setSelectedTag] = useState(null);
  const [results, setResults] = useState([]);

  // Scroll refs
  const exploreRef = useRef(null);
  const mapRef = useRef(null);
  const galleryRef = useRef(null);
  const myPostsRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // ⭐ FIXED SEARCH FUNCTION
  const handleSearch = async () => {
    try {
      const params = {};

      // Only add params if they have values
      if (city) params.city = city;
      if (guests) params.guests = guests;
      if (checkIn) params.checkin = checkIn; // Note: lowercase to match backend
      if (checkOut) params.checkout = checkOut; // Note: lowercase to match backend
      if (category) params.category = category;
      if (selectedTag) params.tags = selectedTag;

      console.log("Sending params:", params); // Debug log

      const res = await axios.get(`${API_BASE}/posts`, { params });

      console.log("Search Results:", res.data.results);
      setResults(res.data.results);
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Something went wrong. Check console.");
    }
  };

  // Scroll helpers
  const scrollToExplore = () => exploreRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToMap = () => mapRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToGallery = () => galleryRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToMyPosts = () => myPostsRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="home-container">
      {/* HERO SECTION */}
      <div
        className="hero-wrapper"
        style={{
          backgroundImage: `url("https://wallpapercat.com/w/full/4/c/2/17001-3840x2160-desktop-4k-mountain-wallpaper.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
        }}
      >
        {/* NAVBAR */}
        <nav className="navbar">
          <div className="logo" onClick={() => navigate("/home")}>
            SoloSphere
          </div>

          <ul className="nav-links">
            <li onClick={() => navigate("/home")}>Home</li>
            <li onClick={scrollToExplore}>Explore</li>
            <li onClick={scrollToMap}>Map</li>
            <li onClick={scrollToGallery}>Gallery</li>
            <li onClick={scrollToMyPosts}>My Posts</li>
            <li onClick={() => navigate("/profile")}>Profile</li>
          </ul>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </nav>

        {/* HERO TITLE + SUBTEXT */}
        <div className="hero-section">
          <div className="hero-subtag">Travel Smart, Travel Safe</div>
          <h1 className="hero-title">Explore the World, One Journey at a Time.</h1>
          <p className="hero-desc">Discover verified places and connect meaningfully.</p>
        </div>

        {/* 🔍 SEARCH UI - FIXED */}
        <div className="search-box">
          <div className="search-header">
            <button 
              className={category === "" ? "active" : ""}
              onClick={() => setCategory("")}
            >
              All Residences
            </button>
            <button 
              className={category === "Hostel" ? "active" : ""}
              onClick={() => setCategory("Hostel")}
            >
              Hostel
            </button>
            <button 
              className={category === "Apartment" ? "active" : ""}
              onClick={() => setCategory("Apartment")}
            >
              Apartment
            </button>
            <button 
              className={category === "Camp" ? "active" : ""}
              onClick={() => setCategory("Camp")}
            >
              Camp
            </button>
          </div>

          <div className="search-fields">
            <div className="field">
              <label>Location</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City name (e.g., Goa)"
              />
            </div>

            <div className="field">
              <label>Check In</label>
              <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
            </div>

            <div className="field">
              <label>Check Out</label>
              <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
            </div>

            <div className="field">
              <label>Travelers</label>
              <input
                type="number"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                placeholder="Guests"
              />
            </div>
          </div>

          {/* TAG FILTERS */}
          <div className="search-footer">
            <div className="filter-tags">
              {["private", "community", "shared", "female-only"].map((tag) => (
                <span
                  key={tag}
                  className={`tag ${selectedTag === tag ? "active" : ""}`}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                >
                  {tag}
                </span>
              ))}
            </div>

            <button className="search-btn" onClick={handleSearch}>
              🔍 Search
            </button>
          </div>
        </div>
      </div>

      {/* RESULTS AREA */}
      <div className="search-results">
        {results.length > 0 ? (
          <>
            <h2>{results.length} Results Found</h2>
            <div className="results-grid">
              {results.map((place) => (
                <div className="result-card" key={place._id}>
                  <img src={place.imageUrl} alt="Place" />
                  <h3>{place.title}</h3>
                  <p>{place.city}</p>
                  <p>Category: {place.category}</p>
                  <p>Rating: {place.rating ?? "No rating"}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p style={{ textAlign: "center", padding: "10px", opacity: 0.8 ,fontWeight: "600" , margin : "0"  , fontSize : '30px' }}>
            No results yet — try searching!
          </p>
        )}
      </div>

      {/* OTHER SECTIONS */}
      <div ref={exploreRef} className="explore-wrapper" style={{ background: "#fff", padding: "50px 0" }}>
        <Explore />
      </div>

      <div ref={mapRef} className="map-wrapper">
        <TravelTips embedded />
      </div>

      <div ref={galleryRef} className="gallery-wrapper">
        <Gallery />
      </div>

      <div ref={myPostsRef} className="myposts-wrapper">
        <MyPosts />
      </div>

      <Footer onExplore={scrollToExplore} onMap={scrollToMap} />
    </div>
  );
}