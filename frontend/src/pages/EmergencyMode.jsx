import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/sos.css";

const API_BASE =
    import.meta.env.MODE === "development"
        ? "http://localhost:5001"
        : "https://solosphere-backend.onrender.com";

export default function EmergencyMode({ onExit }) {
    const [coords, setCoords] = useState({ lat: null, lng: null });
    const [address, setAddress] = useState("Fetching location...");
    const [status, setStatus] = useState("loading");

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setCoords({ lat, lng });
                    setStatus("success");

                    // Reverse Geocoding (Optional/Mock)
                    setAddress("India"); // Simplified for now

                    // Log to backend
                    try {
                        await axios.post(`${API_BASE}/api/emergency/log`, {
                            lat,
                            lng,
                            city: "Requesting help"
                        });
                    } catch (err) {
                        console.error("Failed to log emergency:", err);
                    }
                },
                (error) => {
                    console.error("Location error:", error);
                    setStatus("error");
                    setAddress("Location access denied.");
                }
            );
        }
    }, []);

    const shareLocation = () => {
        const mapsLink = `https://www.google.com/maps?q=${coords.lat},${coords.lng}`;
        navigator.clipboard.writeText(mapsLink);
        alert("Live location link copied to clipboard!");
    };

    return (
        <div className="emergency-overlay">
            <div className="emergency-header">
                <h1>🚨 Emergency Mode</h1>
                <p>Help is on the way. Please stay calm.</p>
            </div>

            <div className="location-info">
                <label>YOUR LIVE LOCATION</label>
                <div className="location-grid">
                    <div className="loc-item">
                        <label>Latitude</label>
                        <span>{coords.lat?.toFixed(5) || "--"}</span>
                    </div>
                    <div className="loc-item">
                        <label>Longitude</label>
                        <span>{coords.lng?.toFixed(5) || "--"}</span>
                    </div>
                </div>
                <p style={{ marginTop: "15px", opacity: 0.8 }}>{address}</p>
            </div>

            <div className="helpline-grid">
                <a href="tel:100" className="helpline-card">
                    <h3>POLICE</h3>
                    <span className="number">100</span>
                </a>
                <a href="tel:108" className="helpline-card">
                    <h3>AMBULANCE</h3>
                    <span className="number">108</span>
                </a>
                <a href="tel:181" className="helpline-card" style={{ gridColumn: "span 2" }}>
                    <h3>WOMEN HELPLINE</h3>
                    <span className="number">181 / 1091</span>
                </a>
            </div>

            <div className="emergency-actions">
                <button className="action-btn share-btn" onClick={shareLocation} disabled={!coords.lat}>
                    Share Live Location
                </button>
                <button className="action-btn exit-btn" onClick={() => {
                    if (confirm("Are you sure you want to exit emergency mode?")) onExit();
                }}>
                    Exit Emergency Mode
                </button>
            </div>

            <div style={{ marginTop: 'auto', textAlign: 'center', opacity: 0.5, fontSize: '12px' }}>
                SoloSphere Safety Network • Stay Safe
            </div>
        </div>
    );
}
