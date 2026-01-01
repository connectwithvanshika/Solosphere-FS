import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/companion.css";
import { useNavigate } from "react-router-dom";

const API_BASE =
    import.meta.env.MODE === "development"
        ? "http://localhost:5001"
        : "https://solosphere-backend.onrender.com";

export default function TravelCompanion() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [plan, setPlan] = useState({
        city: "",
        startDate: "",
        endDate: "",
        genderPreference: "all"
    });
    const [matches, setMatches] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check Auth
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }

        // Mock/Fetch User (In real app, fetch current user)
        const mockUserId = "6591f4e1f1a2b3c4d5e6f7a8"; // Placeholder
        setUser(mockUserId);

        fetchData(mockUserId);
    }, []);

    const fetchData = async (userId) => {
        try {
            const planRes = await axios.get(`${API_BASE}/api/companion/plans/${userId}`);
            if (planRes.data) setPlan(planRes.data);

            const matchRes = await axios.get(`${API_BASE}/api/companion/matches/${userId}`);
            setMatches(matchRes.data);

            const requestRes = await axios.get(`${API_BASE}/api/companion/connect/requests/${userId}`);
            setRequests(requestRes.data);

            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const savePlan = async () => {
        try {
            await axios.post(`${API_BASE}/api/companion/plans`, { ...plan, userId: user });
            alert("Travel plan saved! You are now discoverable.");
            fetchData(user);
        } catch (err) {
            alert("Error saving plan.");
        }
    };

    const sendRequest = async (receiverId) => {
        try {
            await axios.post(`${API_BASE}/api/companion/connect/request`, { senderId: user, receiverId });
            alert("Request sent!");
        } catch (err) {
            alert("Request failed.");
        }
    };

    const handleResponse = async (requestId, status) => {
        try {
            await axios.patch(`${API_BASE}/api/companion/respond`, { requestId, status });
            alert(`Connection ${status}!`);
            fetchData(user);
        } catch (err) {
            alert("Error.");
        }
    };

    if (loading) return <div className="companion-container">Loading...</div>;

    return (
        <div className="companion-container">
            <div className="companion-header">
                <button className="back-btn" onClick={() => navigate("/home")} style={{ float: 'left' }}>← Back</button>
                <h1>Find Your Travel Buddy</h1>
                <p>Connect with solo travelers going to the same destination.</p>
            </div>

            {/* 🔹 PLAN MANAGEMENT */}
            <div className="plan-card">
                <h2>Your Travel Plan</h2>
                <div className="form-group">
                    <label>Destination City</label>
                    <input
                        value={plan.city}
                        onChange={(e) => setPlan({ ...plan, city: e.target.value })}
                        placeholder="Where are you going?"
                    />
                </div>
                <div className="form-group" style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ flex: 1 }}>
                        <label>Start Date</label>
                        <input
                            type="date"
                            value={plan.startDate?.split('T')[0]}
                            onChange={(e) => setPlan({ ...plan, startDate: e.target.value })}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label>End Date</label>
                        <input
                            type="date"
                            value={plan.endDate?.split('T')[0]}
                            onChange={(e) => setPlan({ ...plan, endDate: e.target.value })}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label>Who are you looking for?</label>
                    <select
                        value={plan.genderPreference}
                        onChange={(e) => setPlan({ ...plan, genderPreference: e.target.value })}
                    >
                        <option value="all">All Travelers</option>
                        <option value="female-only">Female Travelers Only</option>
                    </select>
                </div>
                <button className="save-plan-btn" onClick={savePlan}>Update Travel Buddy Search</button>
            </div>

            {/* 🔹 REQUESTS */}
            {requests.length > 0 && (
                <div className="requests-section">
                    <h2>Connection Requests</h2>
                    {requests.map(req => (
                        <div className="request-item" key={req._id}>
                            <div>
                                <strong>{req.senderId.name}</strong> wants to connect for your trip to {plan.city}.
                            </div>
                            <div className="request-actions">
                                <button className="accept-btn" onClick={() => handleResponse(req._id, 'accepted')}>Accept</button>
                                <button className="decline-btn" onClick={() => handleResponse(req._id, 'declined')}>Ignore</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 🔹 MATCHES */}
            <div className="match-section">
                <h2>Potential Buddies in {plan.city || '...'}</h2>
                {matches.length > 0 ? (
                    <div className="match-grid">
                        {matches.map(m => (
                            <div className="match-card" key={m._id}>
                                <span className="match-tag">{m.userId.verified ? "✅ Verified" : "Contributor"}</span>
                                <h3>{m.userId.name}</h3>
                                <p>📍 {m.city}</p>
                                <p>🗓 {new Date(m.startDate).toLocaleDateString()} - {new Date(m.endDate).toLocaleDateString()}</p>
                                <button className="connect-btn" onClick={() => sendRequest(m.userId._id)}>Send Connect Request</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ textAlign: 'center', opacity: 0.6 }}>No matching travelers found yet. Try updating your dates or destination!</p>
                )}
            </div>

            <div style={{ marginTop: '100px', textAlign: 'center', color: '#888', fontSize: '14px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                Your privacy is important. Contact info is only shared after you Accept a request.
            </div>
        </div>
    );
}
