import "../styles/map.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import axios from "axios";

// const API_URL = "https://solosphere-fs.vercel.app/api/posts";
const API_URL = "https://solosphere-fs-ycns.vercel.app/api/posts";

const GEOCODER_KEY = import.meta.env.VITE_GEOCODER_KEY;

// Smooth fly animation controller
function FlyTo({ coords }) {
  const map = useMap();

  useEffect(() => {
    if (coords) map.flyTo(coords, 13, { duration: 2 });
  }, [coords]);

  return null;
}

export default function Map({ embedded }) {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(""); // ⭐ New
  const [searchedCoords, setSearchedCoords] = useState(null);

  // Load all posts initially
  useEffect(() => {
    axios.get(API_URL).then((res) => setPosts(res.data));
  }, []);

  // Search + filtering logic
  const handleSearch = async () => {
    try {
      // Fetch filtered posts from backend
      const res = await axios.get(API_URL, {
        params: {
          q: search,
          city: search,
          category: selectedCategory,
        },
      });

      setPosts(res.data);

      if (res.data.length === 0) {
        alert("No matching safe places found 🚫 Try another filter!");
      }

      // Zoom to searched city
      if (search) {
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(search)}&key=${GEOCODER_KEY}&limit=1`
        );
        const data = await response.json();

        if (data.results.length) {
          const { lat, lng } = data.results[0].geometry;
          setSearchedCoords([lat, lng]);
        }
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Error while searching!");
    }
  };

  return (
    <div className={`map-page ${embedded ? "embedded" : ""}`}>

      {/* Header */}
      <div className="map-header">
        <h3>Search city → then apply filters 🔍</h3>
      </div>

      {/* Search bar */}
      <div className="map-controls">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Mumbai, Delhi, Goa..."
        />
      </div>

      {/* Category Filters */}
      <div className="filter-chips">
        {[
          { label: "☕ Café", value: "cafe" },
          { label: "🏨 Hostel", value: "hostel" },
          { label: "🏠 Apartment", value: "apartment" },
          { label: "⛺ Camp", value: "camp" },
          { label: "🛡 Safe", value: "safe" },
          { label: "👩 Women Only", value: "women-only" },
        ].map(({ label, value }) => (
          <button
            key={value}
            className={`chip ${selectedCategory === value ? "active" : ""}`}
            onClick={() => setSelectedCategory(value === selectedCategory ? "" : value)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Apply Button */}
      <button className="apply-btn" onClick={handleSearch}>
        Apply Filters
      </button>

      {/* Map */}
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        scrollWheelZoom={true}
        style={{ height: "450px", width: "100%", borderRadius: "20px", marginTop: "20px" }}
      >
        <FlyTo coords={searchedCoords} />

        {/* OpenStreet Maps */}
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Show Map Markers */}
        {posts.map((p) =>
          p.lat && p.lng ? (
            <Marker key={p._id} position={[p.lat, p.lng]}>
              <Popup>
                <strong>{p.title}</strong> <br />
                📍 {p.city} <br />
                🏷 {p.category} <br />
                ⭐ {p.rating || "No rating"}
              </Popup>
            </Marker>
          ) : null
        )}
      </MapContainer>
    </div>
  );
}
