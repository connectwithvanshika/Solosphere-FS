


import "../styles/map.css";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import API_BASE from "../api.js";

const CITY_DATA = {
  delhi: {
    name: "Delhi",
    places: ["India Gate", "Qutub Minar", "Red Fort", "Lotus Temple"],
    description:
      "Delhi, the capital of India, is a mix of modern city vibes and rich Mughal history.",
    safety: "Moderate — Avoid late-night solo walking in crowded areas."
  },
  mumbai: {
    name: "Mumbai",
    places: ["Marine Drive", "Gateway of India", "Bandra Fort", "Juhu Beach"],
    description:
      "Mumbai is the City of Dreams with beaches, nightlife & Bollywood.",
    safety: "Good — Public transport available 24/7."
  },
  goa: {
    name: "Goa",
    places: ["Baga Beach", "Fort Aguada", "Dudhsagar Falls", "Basilica of Bom Jesus"],
    description: "Goa is known for beaches, nightlife & Portuguese influence.",
    safety: "Safe — Avoid isolated beaches late night."
  }
};

export default function SearchCards() {
  const [posts, setPosts] = useState([]);
  const [city, setCity] = useState("");
  const [cityInfo, setCityInfo] = useState(null);

  const [filters, setFilters] = useState([]);
  const [page, setPage] = useState(1);
  const perPage = 4;

  // --- TOGGLE FILTER BUTTON ---
  const toggleFilter = (f) =>
    setFilters((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );

  // --- SEARCH API ---
  const handleSearch = async () => {
    try {
      const res = await axios.get(`${API_BASE}/posts`, {
        params: { city: city.trim() }
      });

      setPosts(res.data.posts || res.data);
      setPage(1);

      const key = city.trim().toLowerCase();
      setCityInfo(CITY_DATA[key] || null);
    } catch (error) {
      console.log("Search failed:", error);
    }
  };

  // --- FILTER ----
  const filteredData = useMemo(() => {
    let result = [...posts];
    if (filters.length > 0) {
      result = result.filter((p) => filters.includes(p.category));
    }
    return result;
  }, [posts, filters]);

  // --- PAGINATION ---
  const paginatedData = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredData.slice(start, start + perPage);
  }, [filteredData, page]);

  return (
    <div className="card-only-page">

      <h2>Find Safe Places</h2>

      {/* Search Input */}
      <div className="card-controls">
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Search city (e.g., Delhi)"
        />
      </div>

      {/* FILTER BUTTONS */}
      <div className="filter-row">
        {["cafe", "hostel", "camp", "apartment"].map((f) => (
          <button
            key={f}
            onClick={() => toggleFilter(f)}
            className={filters.includes(f) ? "active-filter" : ""}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      <button className="map-btn" onClick={handleSearch}>
        Apply Filters
      </button>

      {/* CITY INFO */}
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

      {/* RESULT CARDS */}
      <h3 style={{ marginTop: "20px" }}>Search Results</h3>

      <div className="card-list">
        {paginatedData.length === 0 ? (
          <p>No results found.</p>
        ) : (
          paginatedData.map((p) => (
            <div className="result-card" key={p._id}>
              <h4>{p.title}</h4>
              <p>📍 {p.city}</p>
              <p>🏷 {p.category}</p>
              <p>⭐ {p.rating || "No Rating"}</p>
            </div>
          ))
        )}
      </div>

      {/* PAGINATION */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>

        <span>
          Page {page} / {Math.ceil(filteredData.length / perPage || 1)}
        </span>

        <button
          disabled={page >= Math.ceil(filteredData.length / perPage)}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
