
import { useState } from "react";
import "../styles/footer.css";
import { useNavigate, useLocation } from "react-router-dom";

// ... imports

export default function Footer({ onExplore, onMap, onGallery, onMyPosts }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Newsletter State
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success

  const handleSubscribe = () => {
    if (!email.includes("@")) {
      alert("Please enter a valid email!");
      return;
    }

    setStatus("loading");

    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setEmail("");

      // Auto-hide after 4 seconds
      setTimeout(() => setStatus("idle"), 4000);
    }, 1500);
  };

  const goHome = () => {
    if (location.pathname !== "/home") {
      navigate("/home");
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 300);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goExplore = () => {
    if (location.pathname !== "/home") {
      navigate("/home");
      setTimeout(() => onExplore?.(), 500);
    } else {
      onExplore?.();
    }
  };

  const goMap = () => {
    if (location.pathname !== "/home") {
      navigate("/home");
      setTimeout(() => onMap?.(), 500);
    } else {
      onMap?.();
    }
  };

  const goGallery = () => {
    if (location.pathname !== "/home") {
      navigate("/home");
      setTimeout(() => onGallery?.(), 500);
    } else {
      onGallery?.();
    }
  };

  const goMyPosts = () => {
    if (location.pathname !== "/home") {
      navigate("/home");
      setTimeout(() => onMyPosts?.(), 500);
    } else {
      onMyPosts?.();
    }
  };

  return (
    <footer className="footer">
      {/* 🔹 SUCCESS ALERT OVERLAY */}
      {status === "success" && (
        <div className="newsletter-success-card">
          <div className="success-icon">✅</div>
          <h4>Subscription Successful!</h4>
          <p>
            Your response has been sent to <strong>vanshika.connects@gmail.com</strong>.
          </p>
          <p className="success-sub">Thank you for joining SoloSphere!</p>
          <button onClick={() => setStatus("idle")} className="close-success-btn">
            Close
          </button>
        </div>
      )}

      <div className="footer-container">
        <div className="footer-section">
          <h3 className="brand">SoloSphere</h3>
          <p className="tagline">
            A platform made for fearless solo travelers — helping you
          </p>
          <p>explore
            safely, connect meaningfully, and travel with confidence.</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li onClick={goHome}>Home</li>
            <li onClick={goExplore}>Explore</li>
            <li onClick={goMap}>Map</li>
            <li onClick={goGallery}>Gallery</li>
            <li onClick={goMyPosts}>My Posts</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: support@solosphere.com</p>
          <p>Phone: +91 98765XXXXX</p>
        </div>

        <div className="footer-section newsletter-section">
          <h4>Stay Connected</h4>
          <p>Join our community of fearless travelers.</p>
          <div className="newsletter-form">
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading"}
            />
            <button
              onClick={handleSubscribe}
              disabled={status === "loading"}
            >
              {status === "loading" ? "..." : "Subscribe"}
            </button>
          </div>
        </div>
      </div>

      <div className="footer-social">
        <span>🌎</span>
        <span>📸</span>
        <span>✈️</span>
      </div>

      <div className="footer-bottom-row">
        <p>© {new Date().getFullYear()} SoloSphere — All rights reserved</p>
        <div className="footer-legal">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}
