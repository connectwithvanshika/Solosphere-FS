import "../styles/home.css";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import Explore from "./Explore";
import Map from "./Map";
import Gallery from "./Gallery";
import MyPosts from "./MyPosts";
import Footer from "./Footer";

export default function Home() {
  const navigate = useNavigate();

  // Smooth scroll references
  const exploreRef = useRef(null);
  const mapRef = useRef(null);
  const galleryRef = useRef(null);
  const myPostsRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Scroll functions
  const scrollToExplore = () =>
    exploreRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToMap = () =>
    mapRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToGallery = () =>
    galleryRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToMyPosts = () =>
    myPostsRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="home-container">
      {/* 🌍 HERO SECTION + NAVBAR */}
      <div
        className="hero-wrapper"
        style={{
          backgroundImage: `url("https://wallpapercat.com/w/full/4/c/2/17001-3840x2160-desktop-4k-mountain-wallpaper.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
        }}
      >
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

        <div className="hero-section">
          <div className="hero-subtag">Travel Smart, Travel Safe</div>
          <h1 className="hero-title">
            Explore the World, One Journey at a Time.
          </h1>
          <p className="hero-desc">
            A safe space for solo travelers to discover verified places and
            connect meaningfully.
          </p>
        </div>

        {/* SEARCH BOX */}
        <div className="search-box">
          <div className="search-header">
            <button className="active">All Residences</button>
            <button>Hostel</button>
            <button>Apartment</button>
            <button>Camp</button>
          </div>

          <div className="search-fields">
            <div className="field">
              <label>Location</label>
              <input type="text" placeholder="Search city or place" />
            </div>

            <div className="field">
              <label>Check In</label>
              <input type="date" />
            </div>

            <div className="field">
              <label>Check Out</label>
              <input type="date" />
            </div>

            <div className="field">
              <label>Travelers</label>
              <input type="number" placeholder="Add guests" />
            </div>
          </div>

          <div className="search-footer">
            <div className="filter-tags">
              <span className="tag active">Private Stay</span>
              <span className="tag">Community</span>
              <span className="tag">Shared</span>
              <span className="tag">Female-Only</span>
            </div>

            <button className="search-btn">🔍 Search</button>
          </div>
        </div>
      </div>

      {/* 🔎 EXPLORE SECTION */}
      <div
        ref={exploreRef}
        className="explore-wrapper"
        style={{ background: "white", padding: "50px 0" }}
      >
        <Explore />
      </div>

      {/* 🗺 MAP SECTION */}
      <div ref={mapRef} className="map-wrapper">
        <Map embedded />
      </div>

      {/* 🖼 GALLERY SECTION */}
      <div ref={galleryRef} className="gallery-wrapper">
        <Gallery />
      </div>

      {/* 📝 MY POSTS SECTION */}
      <div ref={myPostsRef} className="myposts-wrapper">
        <MyPosts />
      </div>

      {/* <Footer /> */}

      <Footer onExplore={scrollToExplore} onMap={scrollToMap} />
    </div>
  );
}
