import { useState } from "react";
import "../styles/explore.css";

export default function Explore() {
  const [expandedCard, setExpandedCard] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("rating");

  const categories = ["All", "Hostel", "Café", "Apartment", "Camp"];

  const places = [
    {
      id: 1,
      name: "SafeNest Women’s Hostel",
      city: "Pune, India",
      rating: 4.8,
      reviews: 112,
      verified: true,
      category: "Hostel",
      saved: false,
      image:
        "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=800&q=80",
      description:
        "Safe, clean women-only hostel with secure access and community events.",
    },
    {
      id: 2,
      name: "Mountain View Café",
      city: "Manali, India",
      rating: 4.6,
      reviews: 98,
      verified: false,
      category: "Café",
      saved: false,
      image:
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
      description: "Work-friendly café with Wi-Fi and mountain view seating.",
    },
    {
      id: 2,
      name: "Mountain View Café",
      city: "Manali, India",
      rating: 4.6,
      reviews: 98,
      verified: false,
      category: "Café",
      saved: false,
      image:
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
      description: "Work-friendly café with Wi-Fi and mountain view seating.",
    },
    {
      id: 2,
      name: "Mountain View Café",
      city: "Manali, India",
      rating: 4.6,
      reviews: 98,
      verified: false,
      category: "Café",
      saved: false,
      image:
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
      description: "Work-friendly café with Wi-Fi and mountain view seating.",
    },
    {
      id: 2,
      name: "Mountain View Café",
      city: "Manali, India",
      rating: 4.6,
      reviews: 98,
      verified: false,
      category: "Café",
      saved: false,
      image:
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
      description: "Work-friendly café with Wi-Fi and mountain view seating.",
    },
    {
      id: 2,
      name: "Mountain View Café",
      city: "Manali, India",
      rating: 4.6,
      reviews: 98,
      verified: false,
      category: "Café",
      saved: false,
      image:
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
      description: "Work-friendly café with Wi-Fi and mountain view seating.",
    },
    {
      id: 2,
      name: "Mountain View Café",
      city: "Manali, India",
      rating: 4.6,
      reviews: 98,
      verified: false,
      category: "Café",
      saved: false,
      image:
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
      description: "Work-friendly café with Wi-Fi and mountain view seating.",
    }
  ];

  // FILTER + SORT + SEARCH
  const filteredPlaces = places
    .filter((p) =>
      filter === "All" ? true : p.category.toLowerCase() === filter.toLowerCase()
    )
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sort === "rating" ? b.rating - a.rating : b.reviews - a.reviews);

  const toggleExpand = (id) => {
    setExpandedCard((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="explore-wrapper">
      <h2 className="explore-title">Explore Safe Places</h2>
      <p className="explore-sub">Search, filter & discover verified safe spaces.</p>

      {/* 🔍 SEARCH + SORT + FILTER */}
      <div className="explore-controls">
        <input
          type="text"
          placeholder="Search city or place..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select onChange={(e) => setSort(e.target.value)}>
          <option value="rating">Highest Rated</option>
          <option value="reviews">Most Reviewed</option>
        </select>
      </div>

      {/* Category Filters */}
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

      {/* ---- HORIZONTAL SCROLL CAROUSEL ---- */}
      <div className="carousel">
        {filteredPlaces.map((place) => (
          <div className="card" key={place.id}>
            <img src={place.image} alt={place.name} />

            {place.verified && <span className="verified">✔ Verified</span>}

            <div className="card-content">
              <h3>{place.name}</h3>
              <p className="location">{place.city}</p>

              <div className="rating">
                ⭐ {place.rating} · {place.reviews} reviews
              </div>

              <button className="view-btn" onClick={() => toggleExpand(place.id)}>
                {expandedCard.includes(place.id) ? "Hide Details" : "View Details"}
              </button>

              {expandedCard.includes(place.id) && (
                <p className="details">{place.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
