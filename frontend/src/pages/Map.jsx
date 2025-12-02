import "../styles/map.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.PROD 
  ? "https://solosphere-fs.vercel.app/api/posts"
  : "http://localhost:5001/api/posts";

const GEOCODER_KEY = import.meta.env.VITE_GEOCODER_KEY;

// Filter options visible to user
const FILTER_OPTIONS = [
  { key: "cafe", label: "☕ Café" },
  { key: "hostel", label: "🏨 Hostel" },
  { key: "apartment", label: "🏠 Apartment" },
  { key: "camp", label: "⛺ Camp" },
  { key: "safe", label: "🛡 Safe" },
  { key: "female-only", label: "👩‍🦰 Women Only" },
];

function FlyTo({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo(coords, 13, { duration: 2 });
  }, [coords]);
  return null;
}

export default function Map({ embedded }) {
  const [posts, setPosts] = useState([]);
  const [city, setCity] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [searchedCoords, setSearchedCoords] = useState(null);

  // Load all posts initially
  useEffect(() => {
    axios.get(API_URL).then((res) => setPosts(res.data));
  }, []);

  const toggleFilter = (filter) => {
    setSelectedFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const handleSearch = async () => {
    const res = await axios.get(API_URL, {
      params: {
        city,
        category: selectedFilters.find(f => ["cafe","hostel","camp","apartment"].includes(f)) || "",
        tags: selectedFilters.join(",")
      }
    });

    setPosts(res.data);

    if (city.trim()) {
      const geo = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city)}&key=${GEOCODER_KEY}`
      );
      const data = await geo.json();
      
      if (data.results.length) {
        const { lat, lng } = data.results[0].geometry;
        setSearchedCoords([lat, lng]);
      }
    }
  };

  return (
    <div className={`map-page ${embedded ? "embedded" : ""}`}>

      <div className="map-header">
        <h2>Find Safe Places Near You 🧭</h2>
        <p>Search city → then apply filters 👇</p>
      </div>

      {/* 🔍 Search Input */}
      <div className="map-controls">
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Search city (e.g., Delhi, Mumbai, Goa)"
        />
      </div>

      {/* ⭐ Filter Chips */}
      <div className="filter-chips">
        {FILTER_OPTIONS.map(({ key, label }) => (
          <button
            key={key}
            className={selectedFilters.includes(key) ? "chip active" : "chip"}
            onClick={() => toggleFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <button className="map-btn" onClick={handleSearch}>Apply Filters</button>

      {/* MAP */}
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        scrollWheelZoom={true}
        style={{ height: "450px", borderRadius: "20px", marginTop: "15px" }}
      >
        <FlyTo coords={searchedCoords} />

        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {posts.map((p) =>
          p.lat && p.lng ? (
            <Marker key={p._id} position={[p.lat, p.lng]}>
              <Popup>
                <strong>{p.title}</strong><br/>
                📍 {p.city || "Unknown"}<br/>
                🏷 {p.category}<br/>
                ⭐ {p.rating || "No Rating"}
              </Popup>
            </Marker>
          ) : null
        )}
      </MapContainer>
    </div>
  );
}
