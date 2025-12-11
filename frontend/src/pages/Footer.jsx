// import "../styles/footer.css";

// export default function Footer({ onHome, onExplore, onMap }) {
//   return (
//     <footer className="footer">
//       <div className="footer-container">

//         {/* Column 1 */}
//         <div className="footer-section">
//           <h3 className="brand">SoloSphere</h3>
//           <p className="tagline">
//             A platform made for fearless solo travelers — helping you explore safely,
//             connect meaningfully, and travel with confidence.
//           </p>
//         </div>

//         {/* Column 2 */}
//         <div className="footer-section">
//           <h4>Quick Links</h4>
//           <ul>
//             <li onClick={onHome}>Home</li>
//             <li onClick={onExplore}>Explore</li>
//             <li onClick={onMap}>Map</li>
//           </ul>
//         </div>

//         {/* Column 3 */}
//         <div className="footer-section">
//           <h4>Contact</h4>
//           <p>Email: support@solosphere.com</p>
//           <p>Phone: +91 98765XXXXX</p>
//         </div>

//         {/* Column 4 */}
//         <div className="footer-section">
//           <h4>Useful</h4>
//           <ul>
//             <li>Blog</li>
//             <li>Events</li>
//             <li>Newsletter</li>
//           </ul>
//         </div>
//       </div>

//       {/* Social Icons */}
//       <div className="footer-social">
//         <span>🌎</span>
//         <span>📸</span>
//         <span>✈️</span>
//       </div>

//       {/* Copyright */}
//       <p className="footer-bottom">
//         © {new Date().getFullYear()} SoloSphere — Made with 🤍
//       </p>
//     </footer>
//   );
// }

import "../styles/footer.css";
import { useNavigate, useLocation } from "react-router-dom";

export default function Footer({ onExplore, onMap }) {
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <footer className="footer">
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
            <li onClick={goMap}>Travel Tips</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: support@solosphere.com</p>
          <p>Phone: +91 98765XXXXX</p>
        </div>

        <div className="footer-section">
          <h4>Useful</h4>
          <ul>
            <li>
              <a
                href="https://thesolotravelinstyleblog.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Blog
              </a>
            </li>

            <li>
              <a
                href="https://in.bookmyshow.com/events/solo-travellers/ET00461911"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  cursor: "pointer",
                }}
              >
                Events
              </a>
            </li>
            <li>
              <a
                href="https://www.solotravel.cc/en/newsletter/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  cursor: "pointer",
                }}
              >
                Newsletter
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-social">
        <span>🌎</span>
        <span>📸</span>
        <span>✈️</span>
      </div>

      <p className="footer-bottom">
        © {new Date().getFullYear()} SoloSphere — All rights reserved
      </p>
    </footer>
  );
}
