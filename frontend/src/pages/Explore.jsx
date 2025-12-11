// import React, { useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import "../styles/explore.css";

// const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

// export default function Explore() {
//   const [search, setSearch] = useState("");
//   const [filter, setFilter] = useState("All");
//   const [sort, setSort] = useState("rating");

//   // server-driven state
//   const [places, setPlaces] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // pagination
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const perPage = 8;

//   const categories = ["All", "Hostel", "Café", "Apartment", "Camp"];

//   const fetchPlaces = async ({ q = search, category = filter, sortBy = sort, pageNum = page }) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const res = await axios.get(`${API_BASE}/api/places`, {
//         params: {
//           search: q || "",
//           category: category || "All",
//           sort: sortBy || "rating",
//           page: pageNum,
//           limit: perPage
//         }
//       });

//       if (res.data && res.data.places) {
//         setPlaces(res.data.places);
//         setTotalPages(res.data.totalPages || 1);
//       } else {
//         setPlaces([]);
//         setTotalPages(1);
//       }
//     } catch (err) {
//       console.error("fetchPlaces error:", err);
//       setError("Failed to load places");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // initial + when filters change (debounce search)
//   useEffect(() => {
//     const id = setTimeout(() => {
//       setPage(1); // reset page when filters/search changes
//       fetchPlaces({ q: search, category: filter, sortBy: sort, pageNum: 1 });
//     }, 250);
//     return () => clearTimeout(id);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [search, filter, sort]);

//   // when page changes
//   useEffect(() => {
//     fetchPlaces({ pageNum: page });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [page]);

//   // derived UI text for no-results
//   const noResults = !loading && !error && places.length === 0;

//   return (
//     <div className="explore-wrapper">
//       <h2 className="explore-title">Explore Safe Places</h2>
//       <p className="explore-sub">Search, filter & discover verified safe spaces.</p>

//       {/* 🔍 SEARCH + SORT */}
//       <div className="explore-controls">
//         <input
//           type="text"
//           placeholder="Search city or place..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />

//         <select value={sort} onChange={(e) => setSort(e.target.value)}>
//           <option value="rating">Highest Rated</option>
//           <option value="reviews">Most Reviewed</option>
//           <option value="recent">Most Recent</option>
//         </select>
//       </div>

//       {/* FILTER BUTTONS */}
//       <div className="filters">
//         {categories.map((cat) => (
//           <button
//             key={cat}
//             className={filter === cat ? "active" : ""}
//             onClick={() => setFilter(cat)}
//           >
//             {cat}
//           </button>
//         ))}
//       </div>

//       {/* ---- CARDS ---- */}
//       <div className="carousel">
//         {loading ? (
//           <div className="no-results">Loading places…</div>
//         ) : error ? (
//           <div className="no-results">{error}</div>
//         ) : noResults ? (
//           <div className="no-results">No results yet — try searching!</div>
//         ) : (
//           places.map((place) => (
//             <div className="card" key={place._id || place.name}>
//               <img src={place.image} alt={place.name} />

//               {place.verified && <span className="verified">✔ Verified</span>}

//               <div className="card-content">
//                 <h3>{place.name}</h3>
//                 <p className="location">{place.city}</p>

//                 <div className="rating">
//                   ⭐ {place.rating} · {place.reviews} reviews
//                 </div>

//                 <p className="details">{place.description}</p>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Pagination controls */}
//       <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "center", marginTop: 18 }}>
//         <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1 || loading}>
//           ◀ Prev
//         </button>

//         <div>
//           Page {page} of {totalPages}
//         </div>

//         <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages || loading}>
//           Next ▶
//         </button>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/explore.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function Explore() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("rating");

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 8;

  const categories = ["All", "Hostel", "Café", "Apartment", "Camp"];

  // MAIN FETCH FUNCTION
  const fetchPlaces = async ({
    q = "",
    category = "All",
    sortBy = "rating",
    pageNum = 1,
  }) => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(`${API_BASE}/api/places`, {
        params: {
          search: q,
          category,
          sort: sortBy,
          page: pageNum,
          limit: perPage,
        },
      });

      setPlaces(res.data?.places || []);
      setTotalPages(res.data?.totalPages || 1);
    } catch (err) {
      console.error("fetchPlaces error:", err);
      setError("Failed to load places");
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------------------
     🟢 INITIAL LOAD — fetch all places
  -------------------------------------------*/
  useEffect(() => {
    fetchPlaces({ q: "", category: "All", sortBy: "rating", pageNum: 1 });
  }, []);

  /* -----------------------------------------
     🔄 FETCH on search/filter/sort change
  -------------------------------------------*/
  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      fetchPlaces({
        q: search,
        category: filter,
        sortBy: sort,
        pageNum: 1,
      });
    }, 250);

    return () => clearTimeout(delay);
  }, [search, filter, sort]);

  /* -----------------------------------------
     🔄 FETCH on page change
  -------------------------------------------*/
  useEffect(() => {
    fetchPlaces({
      q: search,
      category: filter,
      sortBy: sort,
      pageNum: page,
    });
  }, [page]);

  return (
    <div className="explore-wrapper">
      <h2 className="explore-title">Explore Safe Places</h2>
      <p className="explore-sub">
        Search, filter & discover verified safe spaces.
      </p>

      {/* 🔍 SEARCH + SORT */}
      <div className="explore-controls">
        <input
          type="text"
          placeholder="Search city or place..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="rating">Highest Rated</option>
          <option value="reviews">Most Reviewed</option>
          <option value="recent">Most Recent</option>
        </select>
      </div>

      {/* FILTER BUTTONS */}
      <div className="filters">
        {categories.map((cat) => (
          <button
            key={cat}
            className={filter === cat ? "active" : ""}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ---- CARDS GRID ---- */}
      <div className="carousel">
  {loading ? (
    <div className="no-results">Loading places…</div>
  ) : error ? (
    <div className="no-results">{error}</div>
  ) : (
    places.map((place) => (
      <div className="card" key={place._id}>
        <img src={place.image} alt={place.name} />
        {place.verified && <span className="verified">✔ Verified</span>}
        <div className="card-content">
          <h3>{place.name}</h3>
          <p className="location">{place.city}</p>
          <div className="rating">
            ⭐ {place.rating} · {place.reviews} reviews
          </div>
          <p className="details">{place.description}</p>
        </div>
      </div>
    ))
  )}
</div>


      {/* PAGINATION */}
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          justifyContent: "center",
          marginTop: 18,
        }}
      >
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1 || loading}
        >
          ◀ Prev
        </button>

        <div>
          Page {page} of {totalPages}
        </div>

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages || loading}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}
