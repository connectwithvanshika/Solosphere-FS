// import "../styles/home.css";
// import { useNavigate } from "react-router-dom";
// import { useRef, useState } from "react";
// import axios from "axios";

// import Explore from "./Explore";
// import Map from "./Map";
// import Gallery from "./Gallery";
// import MyPosts from "./MyPosts";
// import Footer from "./Footer";

// const API_BASE =
//   import.meta.env.MODE === "development"
//     ? "http://localhost:5001/api"
//     : "https://solosphere-fs-ycns.vercel.app/api";

// export default function Home() {
//   const navigate = useNavigate();

//   // Search states
//   const [city, setCity] = useState("");
//   const [checkIn, setCheckIn] = useState("");
//   const [checkOut, setCheckOut] = useState("");
//   const [guests, setGuests] = useState("");
//   const [selectedTag, setSelectedTag] = useState("private");
//   const [results, setResults] = useState([]);

//   // Smooth scroll references
//   const exploreRef = useRef(null);
//   const mapRef = useRef(null);
//   const galleryRef = useRef(null);
//   const myPostsRef = useRef(null);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/");
//   };

//   // SCROLL handlers
//   const scrollToExplore = () => exploreRef.current?.scrollIntoView({ behavior: "smooth" });
//   const scrollToMap = () => mapRef.current?.scrollIntoView({ behavior: "smooth" });
//   const scrollToGallery = () => galleryRef.current?.scrollIntoView({ behavior: "smooth" });
//   const scrollToMyPosts = () => myPostsRef.current?.scrollIntoView({ behavior: "smooth" });

//   // ⭐ SEARCH FUNCTION
//   const handleSearch = async () => {
//     try {
//       const res = await axios.get(`${API_BASE}/posts`, {
//         params: {
//           city,
//           category: "",
//           guests,
//           checkIn,
//           checkOut,
//           tags: selectedTag,
//         },
//       });

//       console.log("🔍 Search Results:", res.data);
//       setResults(res.data);
//     } catch (err) {
//       console.error(err);
//       alert("❌ Error searching — check console.");
//     }
//   };

//   return (
//     <div className="home-container">
//       {/* 🌍 HERO SECTION + NAVBAR */}
//       <div
//         className="hero-wrapper"
//         style={{
//           backgroundImage: `url("https://wallpapercat.com/w/full/4/c/2/17001-3840x2160-desktop-4k-mountain-wallpaper.jpg")`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           minHeight: "100vh",
//         }}
//       >
//         <nav className="navbar">
//           <div className="logo" onClick={() => navigate("/home")}>
//             SoloSphere
//           </div>

//           <ul className="nav-links">
//             <li onClick={() => navigate("/home")}>Home</li>
//             <li onClick={scrollToExplore}>Explore</li>
//             <li onClick={scrollToMap}>Map</li>
//             <li onClick={scrollToGallery}>Gallery</li>
//             <li onClick={scrollToMyPosts}>My Posts</li>
//             <li onClick={() => navigate("/profile")}>Profile</li>
//           </ul>

//           <button className="logout-btn" onClick={handleLogout}>
//             Logout
//           </button>
//         </nav>

//         {/* HERO TEXT */}
//         <div className="hero-section">
//           <div className="hero-subtag">Travel Smart, Travel Safe</div>
//           <h1 className="hero-title">Explore the World, One Journey at a Time.</h1>
//           <p className="hero-desc">
//             A safe space for solo travelers to discover verified places and connect meaningfully.
//           </p>
//         </div>

//         {/* 🔎 SEARCH BOX */}
//         <div className="search-box">
//           <div className="search-header">
//             <button className="active">All Residences</button>
//             <button>Hostel</button>
//             <button>Apartment</button>
//             <button>Camp</button>
//           </div>

//           <div className="search-fields">
//             <div className="field">
//               <label>Location</label>
//               <input
//                 type="text"
//                 placeholder="Search city or place"
//                 value={city}
//                 onChange={(e) => setCity(e.target.value)}
//               />
//             </div>

//             <div className="field">
//               <label>Check In</label>
//               <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
//             </div>

//             <div className="field">
//               <label>Check Out</label>
//               <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
//             </div>

//             <div className="field">
//               <label>Travelers</label>
//               <input
//                 type="number"
//                 placeholder="Add guests"
//                 value={guests}
//                 onChange={(e) => setGuests(e.target.value)}
//               />
//             </div>
//           </div>

//           {/* Filter tags */}
//           <div className="search-footer">
//             <div className="filter-tags">
//               {["private", "community", "shared", "female-only"].map((tag) => (
//                 <span
//                   key={tag}
//                   className={`tag ${selectedTag === tag ? "active" : ""}`}
//                   onClick={() => setSelectedTag(tag)}
//                 >
//                   {tag}
//                 </span>
//               ))}
//             </div>

//             <button className="search-btn" onClick={handleSearch}>
//               🔍 Search
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* 🎯 SEARCH RESULTS */}
//       {results.length > 0 && (
//         <div className="search-results">
//           <h2>🔍 Search Results ({results.length})</h2>
//           <div className="results-grid">
//             {results.map((place) => (
//               <div className="result-card" key={place._id}>
//                 <img src={place.imageUrl} alt="place" />
//                 <h3>{place.title}</h3>
//                 <p>📍 {place.city}</p>
//                 <p>🏷 {place.category}</p>
//                 <p>⭐ {place.rating || "No rating"}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* OTHER SECTIONS */}
//       <div ref={exploreRef} className="explore-wrapper" style={{ background: "white", padding: "50px 0" }}>
//         <Explore />
//       </div>

//       <div ref={mapRef} className="map-wrapper">
//         <Map embedded />
//       </div>

//       <div ref={galleryRef} className="gallery-wrapper">
//         <Gallery />
//       </div>

//       <div ref={myPostsRef} className="myposts-wrapper">
//         <MyPosts />
//       </div>

//       <Footer onExplore={scrollToExplore} onMap={scrollToMap} />
//     </div>
//   );
// }


import "../styles/home.css";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import axios from "axios";

import Explore from "./Explore";
import Map from "./Map";
import Gallery from "./Gallery";
import MyPosts from "./MyPosts";
import Footer from "./Footer";

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
  const [selectedTag, setSelectedTag] = useState("private");
  const [results, setResults] = useState([]);

  // Scroll refs
  const exploreRef = useRef(null);
  const mapRef = useRef(null);
  const galleryRef = useRef(null);
  const myPostsRef = useRef(null);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Scroll functions
  const scrollToExplore = () => exploreRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToMap = () => mapRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToGallery = () => galleryRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToMyPosts = () => myPostsRef.current?.scrollIntoView({ behavior: "smooth" });

  // ⭐ Search API call
  const handleSearch = async () => {
  try {
    const res = await axios.get(`${API_BASE}/posts`, {
      params: {
        city,
        category: "",
        guests,
        checkIn,
        checkOut,
        tags: selectedTag,
      },
    });

    console.log("🔍 Search Results:", res.data.results);
    setResults(res.data.results);
  } catch (err) {
    console.error(err);
    alert("❌ Error searching — check console.");
  }
};

  return (
    <div className="home-container">
      {/* ⭐ HERO BANNER */}
      <div
        className="hero-wrapper"
        style={{
          backgroundImage: `url("https://wallpapercat.com/w/full/4/c/2/17001-3840x2160-desktop-4k-mountain-wallpaper.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
        }}
      >
        {/* ⭐ NAVBAR */}
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

        {/* ⭐ HERO TEXT */}
        <div className="hero-section">
          <div className="hero-subtag">Travel Smart, Travel Safe</div>
          <h1 className="hero-title">Explore the World, One Journey at a Time.</h1>
          <p className="hero-desc">A safe space for solo travelers to discover verified places and connect meaningfully.</p>
        </div>

        {/* ⭐ SEARCH BOX */}
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
              <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Search city or place" />
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
              <input type="number" value={guests} onChange={(e) => setGuests(e.target.value)} placeholder="Add guests" />
            </div>
          </div>

          {/* ⭐ TAG FILTER */}
          <div className="search-footer">
            <div className="filter-tags">
              {["private", "community", "shared", "female-only"].map((tag) => (
                <span key={tag}
                  className={`tag ${selectedTag === tag ? "active" : ""}`}
                  onClick={() => setSelectedTag(tag)}>
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

      {/* ⭐ RESULTS SECTION */}
      {results.length > 0 && (
        <div className="search-results">
          <h2>🔍 Results: {results.length} place(s) found</h2>

          <div className="results-grid">
            {results.map((place) => (
              <div className="result-card" key={place._id}>
                <img src={place.imageUrl} alt="" />
                <h3>{place.title}</h3>
                <p>📍 {place.city}</p>
                <p>🏷 {place.category}</p>
                <p>⭐ {place.rating || "No rating"}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ⭐ OTHER COMPONENTS */}
      <div ref={exploreRef} className="explore-wrapper" style={{ background: "white", padding: "50px 0" }}>
        <Explore />
      </div>

      <div ref={mapRef} className="map-wrapper">
        <Map embedded />
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
