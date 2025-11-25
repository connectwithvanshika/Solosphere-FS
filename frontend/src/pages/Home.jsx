import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";

export default function Home() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token) {
      navigate("/");
      return;
    }

    if (storedUser) {
      setUserName(JSON.parse(storedUser).name);
    }
  }, [navigate]);

  return (
    <div className="home-wrapper">

      {/* NAVBAR */}
      <header className="navbar">
        <div className="logo">🌍 SoloSphere</div>
        
        <nav className="nav-links">
          <a href="#">Home</a>
          <a href="#">Destinations</a>
          <a href="#">Community</a>
          <a href="#">Blog</a>
        </nav>

        <div className="nav-right">
          <span className="username">Hello, {userName || "Traveler"} 👋</span>

          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <h1>Explore the World, One Trip at a Time</h1>
          <p>
            Discover safe places reviewed by solo travelers — explore destinations, 
            read real experiences, and travel confidently with a trusted community.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn">Start Your Journey</button>
            <button className="secondary-btn">▶ Play Video</button>
          </div>

          {/* Search Panel */}
          <div className="search-panel">
            <div className="search-item">
              <label>📍 Location</label>
              <select>
                <option>Select City</option>
                <option>Goa</option>
                <option>Bali</option>
                <option>Thailand</option>
                <option>Kerala</option>
              </select>
            </div>

            <div className="search-item">
              <label>📅 Duration</label>
              <input type="date" />
            </div>

            <div className="search-item">
              <label>⚙ Filter</label>
              <select>
                <option>All</option>
                <option>Hostels</option>
                <option>Cafes</option>
                <option>Spots</option>
              </select>
            </div>

            <button className="search-btn">🔍</button>
          </div>
        </div>
      </section>
    </div>
  );
}
