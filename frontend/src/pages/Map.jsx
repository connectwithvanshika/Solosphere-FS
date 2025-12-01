import "../styles/map.css";

export default function Map({ embedded }) {
  return (
    <div className={`map-page ${embedded ? "embedded" : ""}`}>
      
      {/* ---- Map Heading ---- */}
      <div className="map-header">
        <h2>Find Safe Places Near You 🧭</h2>
        <p>Search verified cafés, hostels, stays & community safe spots.</p>
      </div>

      {/* ---- Search Filters ---- */}
      <div className="map-controls">
        <input type="text" placeholder="🔍 Search city or place" />
        <select>
          <option>Sort: Most Rated</option>
          <option>Newest</option>
          <option>Nearby</option>
        </select>
        <button className="map-btn">Search</button>
      </div>

      {/* ---- Category Buttons ---- */}
      <div className="map-tags">
        <button className="active">All</button>
        <button className="Component">Hostel</button>
        <button className="Component">Café</button>
        <button className="Component">Apartment</button>
        <button className="Component">Camp</button>
      </div>

      {/* ---- MAP BOX ---- */}
      <div className="map-box">
        🗺️ Interactive Map Coming Soon...  
        <br />
        (Google Maps / Leaflet will load here)
      </div>
    </div>
  );
}
