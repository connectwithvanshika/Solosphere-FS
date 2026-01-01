import { useState } from "react";
import "../styles/login.css";
import { Link, useNavigate } from "react-router-dom";
import API_BASE from "../api";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        credentials: "include", // ⭐ IMPORTANT for cookies/token
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("Login Response:", data);

      if (res.ok) {
        // ⭐ Save login info
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // ⭐ Move to home page
        navigate("/home");
      } else {
        alert(data?.message || "Invalid email or password!");
      }
    } catch (error) {
      console.error("Network error during login:", error);
      alert("Server not responding! Check backend.");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">

        {/* Tabs */}
        <div className="auth-tabs">
          <span className="active">Sign In</span>
          <Link to="/signup">Sign Up</Link>
        </div>

        <h2>Welcome Back</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="auth-btn">Login</button>
        </form>
      </div>

      {/* 🔹 Info Card for Testing */}
      <div className="info-card">
        <p className="info-title">Use these credentials to test:</p>
        <p><strong>Email:</strong> solosphere@gmail.com</p>
        <p><strong>Password:</strong> solosphere</p>
      </div>
    </div>
  );
}
