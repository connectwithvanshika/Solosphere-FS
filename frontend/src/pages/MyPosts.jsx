import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/myposts.css";

const API_BASE_URL = "https://solosphere-backend.onrender.com"; // 🔁 change this to your backend base URL

export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null); // null = create mode

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    category: "Hostel",
    rating: "",
    description: "",
    imageUrl: "",
  });

  // ---------- HELPERS ----------
  const authConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    };
  };

  // ---------- READ (Fetch My Posts) ----------
useEffect(() => {
  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(`${API_BASE_URL}/api/posts/mine`, authConfig());

      // If backend returns something that's not an array, force empty state instead of error
      if (!Array.isArray(res.data)) {
        setPosts([]);
      } else {
        setPosts(res.data);
      }
      
    } catch (err) {
      console.error(err);

      // Only show error if there is a real server failure, not 404 empty case
      if (err.response?.status !== 404) {
        setError("Failed to load your posts. Please try again.");
      }

      // Still set posts to empty instead of throwing UI error
      setPosts([]);

    } finally {
      setLoading(false);
    }
  };

  fetchMyPosts();
}, []);

  // ---------- FORM HANDLERS ----------
  const openCreateModal = () => {
    setEditingPost(null);
    setFormData({
      title: "",
      location: "",
      category: "Hostel",
      rating: "",
      description: "",
      imageUrl: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title || "",
      location: post.location || "",
      category: post.category || "Hostel",
      rating: post.rating || "",
      description: post.description || "",
      imageUrl: post.imageUrl || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ---------- CREATE + UPDATE ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (editingPost) {
        // UPDATE existing post
        const res = await axios.put(
          `${API_BASE_URL}/api/posts/${editingPost._id}`,
          formData,
          authConfig()
        );

        // Update state (READ after UPDATE)
        setPosts((prev) =>
          prev.map((p) => (p._id === editingPost._id ? res.data : p))
        );
      } else {
        // CREATE new post
        const res = await axios.post(
          `${API_BASE_URL}/api/posts`,
          formData,
          authConfig()
        );

        // Add new post at the top
        setPosts((prev) => [res.data, ...prev]);
      }

      closeModal();
    } catch (err) {
      console.error(err);
      setError("Failed to save post. Please check your input or try again.");
    } finally {
      setSaving(false);
    }
  };

  // ---------- DELETE ----------
  const handleDelete = async (postId) => {
    const ok = window.confirm(
      "Are you sure you want to delete this post? This action cannot be undone."
    );
    if (!ok) return;

    try {
      await axios.delete(
        `${API_BASE_URL}/api/posts/${postId}`,
        authConfig()
      );

      // Remove from state (READ after DELETE)
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      console.error(err);
      setError("Failed to delete post. Please try again.");
    }
  };

  return (
    <div className="my-posts-page">
      {/* HEADER */}
      <div className="my-posts-header">
        <div>
          <h2>Your Travel Posts</h2>
          <p>Update, refine, or remove the places you&apos;ve shared.</p>
        </div>

        <button className="add-post-btn" onClick={openCreateModal}>
          + Add New Post
        </button>
      </div>

      {error && <div className="my-posts-error">{error}</div>}

{loading ? (
  <div className="empty-state">Loading posts…</div>
) : posts.length === 0 ? (
  <div className="empty-wrapper">
    

    <h3 className="empty-title">No Posts Yet</h3>
    <p className="empty-text">
      You haven’t shared any safe travel spots yet.<br />
      Start by posting your first trusted location
    </p>

    <button className="primary-btn" onClick={openCreateModal}>
      Add Your First Safe Place
    </button>
  </div>
) :  (
        <div className="my-posts-grid">
          {posts.map((post) => (
            <article className="post-card" key={post._id}>
              <div className="post-image-wrapper">
                <img
                  src={
                    post.imageUrl ||
                    "https://images.unsplash.com/photo-1494783367193-149034c05e8f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  }
                  alt={post.title}
                />
                <span className="post-category-pill">
                  {post.category || "Stay"}
                </span>
              </div>

              <div className="post-content">
                <div className="post-main">
                  <h3>{post.title}</h3>
                  <p className="post-location">{post.location}</p>
                  <p className="post-description">
                    {post.description || "No description added yet."}
                  </p>
                </div>

                <div className="post-meta-row">
                  {post.rating && (
                    <span className="post-rating">⭐ {post.rating}</span>
                  )}
                  {post.isVerified && (
                    <span className="post-verified">✔ Verified</span>
                  )}
                </div>

                <div className="post-actions">
                  <button
                    className="edit-btn"
                    onClick={() => openEditModal(post)}
                  >
                    ✏ Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(post._id)}
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* ------- MODAL (CREATE / UPDATE) ------- */}
      {isModalOpen && (
        <div className="mp-modal-backdrop" onClick={closeModal}>
          <div
            className="mp-modal"
            onClick={(e) => e.stopPropagation()} // prevent close on inner click
          >
            <div className="mp-modal-header">
              <h3>{editingPost ? "Edit Post" : "Add New Post"}</h3>
              <button className="mp-close" onClick={closeModal}>
                ✕
              </button>
            </div>

            <form className="mp-form" onSubmit={handleSubmit}>
              <div className="mp-form-row">
                <label>
                  Title
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Location
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>

              <div className="mp-form-row">
                <label>
                  Category
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="Hostel">Hostel</option>
                    <option value="Café">Café</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Homestay">Homestay</option>
                    <option value="Camp">Camp</option>
                  </select>
                </label>

                <label>
                  Rating
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    placeholder="4.8"
                  />
                </label>
              </div>

              <label className="mp-full">
                Description
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Share something helpful for other solo travelers…"
                />
              </label>

              <label className="mp-full">
                Image URL
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/photo.jpg"
                />
              </label>

              <div className="mp-modal-actions">
                <button
                  type="button"
                  className="mp-secondary"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="mp-primary"
                  disabled={saving}
                >
                  {saving
                    ? "Saving…"
                    : editingPost
                    ? "Update Post"
                    : "Create Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
