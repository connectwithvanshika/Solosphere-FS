import { useState } from "react";
import "../styles/login.css";
import { Link } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://solosphere-fs-ycns.vercel.app/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => null);
      console.log("Response:", data);

      if (res.ok) {
        alert("Login successful!");
        localStorage.setItem("token", data.token);
      } else {
        alert(data?.message || "Login failed!");
      }
    } catch (error) {
      console.error("Network error during login:", error);
      alert("Something went wrong! Check console for details.");
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
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <button type="submit" className="auth-btn">Login</button>
        </form>

      </div>
    </div>
  );
}
