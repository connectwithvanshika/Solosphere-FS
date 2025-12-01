import { useState } from "react";
import "../styles/gallery.css";

export default function Gallery() {
  // Default images (non deletable)
  const defaultImages = [
    { id: "d1", url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4", title: "Mountain Café", rating: 4.6, default: true },
    { id: "d2", url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828", title: "Backpacker Hostel", rating: 4.9, default: true },
    { id: "d3", url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511", title: "Private Stay", rating: 4.7, default: true },
    { id: "d4", url: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6", title: "Cozy Cabin Escape", rating: 4.8, default: true },
    { id: "d5", url: "https://bellapacifica.com/wp-content/uploads/2024/09/BP_home_content_image_1-uai-1332x1332.jpg", title: "Beachfront Camp", rating: 4.9, default: true },
  ];

  const [userImages, setUserImages] = useState([]);

  const [formData, setFormData] = useState({
    url: "",
    title: "",
    rating: ""
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add new image
  const handleAdd = () => {
    if (!formData.url || !formData.title || !formData.rating) {
      alert("Please fill all fields (Image URL, Title, Rating)");
      return;
    }

    const newEntry = {
      id: Date.now(),
      url: formData.url,
      title: formData.title,
      rating: formData.rating,
      default: false
    };

    setUserImages([...userImages, newEntry]);
    setFormData({ url: "", title: "", rating: "" });
  };

  // Delete (only user-added images)
  const handleDelete = (id) => {
    setUserImages(userImages.filter((img) => img.id !== id));
  };

  const allImages = [...defaultImages, ...userImages];

  return (
    <div className="gallery-container">
      <h2 className="gallery-title">Travel Moments Shared</h2>
      <p className="gallery-sub">Real journeys. Real solo travelers. Real experiences.</p>

      {/* Upload Fields */}
      <div className="gallery-upload">
        <input
          type="text"
          name="url"
          placeholder="Image URL"
          value={formData.url}
          onChange={handleChange}
        />

        <input
          type="text"
          name="title"
          placeholder="Image Title"
          value={formData.title}
          onChange={handleChange}
        />

        <input
          type="number"
          name="rating"
          placeholder="Rating (1-5)"
          min="1"
          max="5"
          value={formData.rating}
          onChange={handleChange}
        />

        <button onClick={handleAdd}>Add</button>
      </div>

      {/* Gallery Grid */}
      <div className="gallery-grid">
        {allImages.map((img) => (
          <div key={img.id} className="gallery-item">
            <img src={img.url} alt={img.title} />

            <div className="gallery-info">
              <h4>{img.title}</h4>

              <div className="gallery-actions">
                <span className="rating">⭐ {img.rating}</span>

                {!img.default && (
                  <button className="delete-btn" onClick={() => handleDelete(img.id)}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
