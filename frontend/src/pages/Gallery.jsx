import "../styles/gallery.css";

export default function Gallery() {
  const images = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
      title: "Mountain Café",
      rating: 4.6,
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828",
      title: "Backpacker Hostel",
      rating: 4.9,
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
      title: "Private Stay",
      rating: 4.7,
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6",
      title: "Cozy Cabin Escape",
      rating: 4.8,
    },
    {
      id: 5,
      url: "https://bellapacifica.com/wp-content/uploads/2024/09/BP_home_content_image_1-uai-1332x1332.jpg",
      title: "Beachfront Camp",
      rating: 4.9,
    },
  ];

  return (
    <div className="gallery-container">
      <h2 className="gallery-title">Travel Moments Shared</h2>
      <p className="gallery-sub">
        Real journeys. Real solo travelers. Real experiences.
      </p>

      <div className="gallery-grid">
        {images.map((img) => (
          <div key={img.id} className="gallery-item">
            <img src={img.url} alt={img.title} />

            <div className="gallery-info">
              <h4>{img.title}</h4>
              <span className="rating">⭐ {img.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
