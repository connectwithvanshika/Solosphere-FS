


// frontend/src/pages/TravelTips.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "../styles/travel-tips.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function TravelTips() {
  const [query, setQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [page, setPage] = useState(1);
  const perPage = 6;

  const [tips, setTips] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // modal
  const [activeTip, setActiveTip] = useState(null);

  // fetch city and category lists from backend or derive from frontend static set
  // quick static list (since backend doesn't provide distinct lists endpoint)
  const cities = useMemo(() => ["All", "Goa", "Jaipur", "Delhi", "Mumbai", "Manali"], []);
  const categories = useMemo(() => ["All", "Helplines", "Wellness", "Transport", "Safety"], []);

  const fetchTips = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(`${API_BASE}/api/tips`, {
        params: {
          city: cityFilter,
          category: categoryFilter,
          search: query,
          page,
          limit: perPage
        }
      });

      setTips(res.data.tips || []);
      setTotalPages(res.data.totalPages || 1);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("Error fetching tips:", err);
      setError("Failed to load tips");
    } finally {
      setLoading(false);
    }
  };

  // fetch when filters/query/page change (debounce search for better UX)
  useEffect(() => {
    // simple debounce
    const id = setTimeout(() => {
      setPage(1); // when filters or query change we typically reset to page 1
      fetchTips();
    }, 300);

    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityFilter, categoryFilter, query]);

  // fetch when page changes
  useEffect(() => {
    fetchTips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const openModal = (tip) => {
    setActiveTip(tip);
    document.body.style.overflow = "hidden";
  };
  const closeModal = () => {
    setActiveTip(null);
    document.body.style.overflow = "";
  };

  return (
    <section className="travel-tips-section">
      <div className="tips-header">
        <div>
          <h2>Travel Tips & Safety Guide</h2>
          <p className="subtitle">
            Practical safety tips, city guides, and verified advice for solo travelers.
          </p>
        </div>

        <div className="search-row">
          <input
            placeholder="Search tips, keywords, or city..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            className="search-input"
          />

          <select
            value={cityFilter}
            onChange={(e) => {
              setCityFilter(e.target.value);
            }}
            className="select-filter"
          >
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
            }}
            className="select-filter"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* GRID */}
      <div className="tips-grid">
        {loading ? (
          <div className="no-results">Loading tips…</div>
        ) : error ? (
          <div className="no-results">{error}</div>
        ) : tips.length === 0 ? (
          <div className="no-results">No tips found — try different filters.</div>
        ) : (
          tips.map((t) => (
            <article key={t._id || t.id} className="tip-card">
              <div
                className="thumb"
                style={{ backgroundImage: `url(${t.image})` }}
              >
                {t.verified && <span className="badge">✔ Verified</span>}
              </div>

              <div className="tip-body">
                <h3 className="tip-title">{t.title}</h3>

                <div className="meta">
                  <span className="chip">{t.category}</span>
                  <span className="chip muted">{t.city}</span>
                </div>

                <p className="excerpt">{t.excerpt}</p>

                <div className="card-actions">
                  <button className="primary" onClick={() => openModal(t)}>
                    Read More
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {/* PAGINATION */}
      <div className="tips-pagination">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1 || loading}
        >
          ◀ Prev
        </button>

        <div className="pages">
          {(() => {
            const pages = [];
            const maxShow = 5;
            let start = Math.max(1, page - Math.floor(maxShow / 2));
            let end = Math.min(totalPages, start + maxShow - 1);
            if (end - start < maxShow - 1) {
              start = Math.max(1, end - maxShow + 1);
            }
            for (let i = start; i <= end; i++) {
              pages.push(
                <button
                  key={i}
                  className={i === page ? "page active" : "page"}
                  onClick={() => setPage(i)}
                >
                  {i}
                </button>
              );
            }
            return pages;
          })()}
        </div>

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages || loading}
        >
          Next ▶
        </button>

        <div style={{ marginLeft: 12, alignSelf: "center", color: "#666" }}>
          {total} result{total !== 1 ? "s" : ""} • Page {page} / {totalPages}
        </div>
      </div>

      {/* MODAL */}
      {activeTip && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              ✕
            </button>

            <div className="modal-thumb" style={{ backgroundImage: `url(${activeTip.image})` }}>
              {activeTip.verified && <span className="badge">✔ Verified</span>}
            </div>

            <div className="modal-body">
              <h3>{activeTip.title}</h3>
              <div className="meta">
                <span className="chip">{activeTip.category}</span>
                <span className="chip muted">{activeTip.city}</span>
              </div>

              <pre className="modal-content">{activeTip.content}</pre>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
