
import "../styles/map.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE from "../api.js"; // 👈 using global API file

const GEOCODER_KEY = import.meta.env.VITE_GEOCODER_KEY;

// ⭐ STATIC CITY INFO
const CITY_DATA = {
  delhi: {
    name: "Delhi",
    places: ["India Gate", "Qutub Minar", "Red Fort", "Lotus Temple"],
    description:
      "Delhi, the capital of India, is a mix of modern city vibes and rich Mughal history.",
    safety: "Moderate — Avoid late-night solo walking in crowded or isolated areas."
  },
  mumbai: {
    name: "Mumbai",
    places: ["Marine Drive", "Gateway of India", "Bandra Fort", "Juhu Beach"],
    description:
      "Mumbai is known as the City of Dreams — home to Bollywood, beaches and nightlife.",
    safety: "Good — Public transport available almost 24/7."
  },
  goa: {
    name: "Goa",
    places: ["Baga Beach", "Fort Aguada", "Dudhsagar Falls", "Basilica of Bom Jesus"],
    description:
      "Goa is a famous tourist destination with golden beaches and Portuguese heritage.",
    safety: "Safe — But avoid isolated beaches late night."
  }
};


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
  const [cityInfo, setCityInfo] = useState(null);

  // ⭐ Load all posts initially
  useEffect(() => {
    axios
      .get(`${API_BASE}/posts`)
      .then((res) => {
        setPosts(res.data.posts || res.data); 
      })
      .catch((err) => console.log("Error loading posts:", err));
  }, []);

  const toggleFilter = (filter) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const handleSearch = async () => {
    try {
      const res = await axios.get(`${API_BASE}/posts`, {
        params: {
          city,
          category: selectedFilters.includes("hostel")
            ? "hostel"
            : selectedFilters.includes("cafe")
            ? "cafe"
            : selectedFilters.includes("camp")
            ? "camp"
            : selectedFilters.includes("apartment")
            ? "apartment"
            : "",
          tags: selectedFilters.join(","),
        },
      });

      setPosts(res.data.posts || res.data);

      const key = city.trim().toLowerCase();
      setCityInfo(CITY_DATA[key] || null);

      // GEO SEARCH
      if (city.trim()) {
        const geo = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
            city
          )}&key=${GEOCODER_KEY}`
        );
        const data = await geo.json();

        if (data.results.length) {
          const { lat, lng } = data.results[0].geometry;
          setSearchedCoords([lat, lng]);
        }
      }
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  return (
    <div className={`map-page ${embedded ? "embedded" : ""}`}>
      <div className="map-header">
        <h2>Find Safe Places Near You</h2>
      </div>

      {/* 🔍 Search Input */}
      <div className="map-controls">
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Search city (e.g., Delhi, Mumbai, Goa)"
        />
      </div>

      <button className="map-btn" onClick={handleSearch}>
        Apply Filters
      </button>

      {/* 🌍 CITY INFO CARD */}
      {cityInfo && (
        <div className="city-info-card">
          <h3>{cityInfo.name}</h3>
          <p>{cityInfo.description}</p>
          <strong>Famous Places:</strong>
          <ul>
            {cityInfo.places.map((p, i) => (
              <li key={i}>• {p}</li>
            ))}
          </ul>
          <p>
            <strong>Safety Tips:</strong> {cityInfo.safety}
          </p>
        </div>
      )}

      {/* 🗺 MAP */}
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        scrollWheelZoom={true}
        style={{ height: "450px", borderRadius: "20px", marginTop: "15px" }}
      >
        <FlyTo coords={searchedCoords} />

        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {Array.isArray(posts) &&
          posts.map(
            (p) =>
              p.lat &&
              p.lng && (
                <Marker key={p._id} position={[p.lat, p.lng]}>
                  <Popup>
                    <strong>{p.title}</strong>
                    <br />
                    📍 {p.city || "Unknown"}
                    <br />
                    🏷 {p.category}
                    <br />
                    ⭐ {p.rating || "No Rating"}
                  </Popup>
                </Marker>
              )
          )}
      </MapContainer>
    </div>
  );
}
