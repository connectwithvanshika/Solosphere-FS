import { useState } from "react";
import "../styles/explore.css";

export default function Explore() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("rating");

  const categories = ["All", "Hostel", "Café", "Apartment", "Camp"];

   const places = [
    // -------- EXISTING DATA --------
    {
      id: 1,
      name: "Zostel Women’s Hostel",
      city: "Pune, India",
      rating: 4.8,
      reviews: 124,
      verified: true,
      category: "Hostel",
      saved: false,
      image:
        "https://media.cnn.com/api/v1/images/stellar/prod/140127103345-peninsula-shanghai-deluxe-mock-up.jpg?q=w_2226,h_1449,x_0,y_0,c_fill",
      description:
        "Secure women-only hostel with keypad entry, workspace, and community meetups."
    },
    {
      id: 2,
      name: "Blue Lagoon Café",
      city: "Manali, India",
      rating: 4.7,
      reviews: 89,
      verified: false,
      category: "Café",
      saved: false,
      image:
        "https://i.pinimg.com/474x/74/80/b2/7480b2bab89c9f6d39cdbf658c59c872.jpg",
      description:
        "Mountain view café with Wi-Fi, cozy seating, and a remote-work friendly atmosphere."
    },
    {
      id: 3,
      name: "Sea Breeze Resort Apartments",
      city: "Goa, India",
      rating: 4.9,
      reviews: 231,
      verified: true,
      category: "Apartment",
      saved: false,
      image:
        "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/49/63/a9/sea-breeze-hotel-apartments.jpg?w=900&h=-1&s=1",
      description:
        "Beachfront serviced apartments with CCTV, private balcony, and digital room locks."
    },
    {
      id: 4,
      name: "SkyHill Camping Retreat",
      city: "Rishikesh, India",
      rating: 4.6,
      reviews: 178,
      verified: true,
      category: "Camp",
      saved: false,
      image:
        "https://visitkochijapan.com/image/rendering/attraction_image/1832/trim.900/3/2?v=9b2f80ae9ae6bd7dfbdcd0f2bb9f6c99687becdf",
      description:
        "Safe riverside camp with guided trekking, yoga spaces, and bonfire nights."
    },
    {
      id: 5,
      name: "CoLive Women’s Co-Residence",
      city: "Bangalore, India",
      rating: 4.5,
      reviews: 152,
      verified: true,
      category: "Hostel",
      saved: false,
      image:
        "https://preferredrate.com/wp-content/uploads/2021/10/blog_blue-home-evening-1.jpg",
      description:
        "Modern co-living room for women with coworking desks, community kitchen and gym."
    },
    {
      id: 6,
      name: "The Cloud Café",
      city: "Shimla, India",
      rating: 4.6,
      reviews: 97,
      verified: false,
      category: "Café",
      saved: false,
      image:
        "https://m.media-amazon.com/images/I/71njsLSyMvL._AC_UF894,1000_QL80_.jpg",
      description:
        "Rooftop café offering mountain views, live music and silent reading corners."
    },
    {
      id: 7,
      name: "HerSpace Urban Studio",
      city: "Mumbai, India",
      rating: 4.9,
      reviews: 420,
      verified: true,
      category: "Apartment",
      saved: false,
      image:
        "https://onekindesign.com/wp-content/uploads/2018/08/Built-In-Window-Seats-Capturing-Ocean-Views-08-1-Kindesign.jpg",
      description:
        "Ideal for solo women with secured entry, sea-facing windows and workspace setup."
    },

    // -------- NEW HOSTELS --------
    {
      id: 8,
      name: "SafeStay Women Hostel",
      city: "Delhi, India",
      rating: 4.7,
      reviews: 201,
      verified: true,
      category: "Hostel",
      saved: false,
      image: "https://journeywoman.com/wp-content/uploads/2017/07/hotel-safety-tip.jpg",
      description:
        "Women-only hostel with fingerprint access, reading areas, and shared kitchen."
    },
    {
      id: 9,
      name: "PinkNest Ladies Hostel",
      city: "Jaipur, India",
      rating: 4.6,
      reviews: 158,
      verified: false,
      category: "Hostel",
      saved: false,
      image: "https://media.istockphoto.com/id/1151357999/photo/beautiful-woman-laying-and-enjoying-breakfast-in-bed.jpg?s=612x612&w=0&k=20&c=vvu09PfKJ5VeL6DFI6PqxO27aLmNWNqC9rM7hV4PIGo=",
      description:
        "Friendly community hostel for women with cultural events and shared workspace."
    },
    {
      id: 10,
      name: "Urban Oasis Co-Hostel",
      city: "Hyderabad, India",
      rating: 4.5,
      reviews: 142,
      verified: true,
      category: "Hostel",
      saved: false,
      image: "https://gos3.ibcdn.com/a668156276d611e98b8c0242ac110008.jpg",
      description:
        "Comfortable modern women’s hostel with gym, cafe lounge, and lockers."
    },

    // -------- NEW CAFÉS --------
    {
      id: 11,
      name: "Soul Brew Café",
      city: "Goa, India",
      rating: 4.8,
      reviews: 301,
      verified: true,
      category: "Café",
      saved: false,
      image: "https://cdn.prod.website-files.com/60414b21f1ffcdbb0d5ad688/656794b84c74fd60a580c975_sincerely-media-VNsdEl1gORk-unsplash.jpg",
      description:
        "Beachside café with journaling corners, soft music, and amazing cold coffee."
    },
    {
      id: 12,
      name: "Quiet Corner Workspace Café",
      city: "Kolkata, India",
      rating: 4.7,
      reviews: 192,
      verified: false,
      category: "Café",
      saved: false,
      image: "https://www.ceebeedesignstudio.com/assets/img/blog/blog-21/best-interiors-in-bangalore-25-11-2024.jpg",
      description:
        "A peaceful café for remote workers with fast Wi-Fi and phone-free zones."
    },

    // -------- NEW APARTMENTS --------
    {
      id: 13,
      name: "Serene Heights Studio",
      city: "Chandigarh, India",
      rating: 4.8,
      reviews: 88,
      verified: true,
      category: "Apartment",
      saved: false,
      image: "https://www.dc.umich.edu/wp-content/uploads/sites/487/2023/07/StudioB_HDR-1200x800.jpg",
      description:
        "Compact and secure independent studio for female travelers and remote workers."
    },
    {
      id: 14,
      name: "Palm Residency Flats",
      city: "Chennai, India",
      rating: 4.6,
      reviews: 133,
      verified: false,
      category: "Apartment",
      saved: false,
      image: "https://housing.com/news/wp-content/uploads/2024/01/Flats-vs-compressed-1.jpg",
      description:
        "Serviced apartment with safety alarms, private kitchenette and workspace."
    },

    // -------- NEW CAMPS --------
    {
      id: 15,
      name: "Forest Haven Eco-Camp",
      city: "Munnar, India",
      rating: 4.8,
      reviews: 261,
      verified: true,
      category: "Camp",
      saved: false,
      image: "https://images.unsplash.com/photo-1533575770077-052fa2c609fc?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Zm9yZXN0JTIwY2FtcHxlbnwwfHwwfHx8MA%3D%3D",
      description:
        "Nature escape with guided hikes, meditation deck, and women-only zones."
    },
    {
      id: 16,
      name: "Moonlight Adventure Camp",
      city: "Kedarnath, India",
      rating: 4.6,
      reviews: 120,
      verified: false,
      category: "Camp",
      saved: false,
      image: "https://i.redd.it/h0am54nruec01.jpg",
      description:
        "Adventure camping with safety protocols, bonfire, and mountain-view tents."
    }
  ];

  // FILTER + SEARCH + SORT
  const filteredPlaces = places
    .filter((p) => (filter === "All" ? true : p.category === filter))
    .filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.city.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sort === "rating" ? b.rating - a.rating : b.reviews - a.reviews
    );

  return (
    <div className="explore-wrapper">
      <h2 className="explore-title">Explore Safe Places</h2>
      <p className="explore-sub">Search, filter & discover verified safe spaces.</p>

      {/* 🔍 SEARCH + SORT */}
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

      {/* ---- CARDS ---- */}
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

              {/* 🔥 Description always visible — NO BUTTON */}
              <p className="details">{place.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
