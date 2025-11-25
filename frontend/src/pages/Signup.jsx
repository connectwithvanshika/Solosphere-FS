import { useState } from "react";
import "../styles/signup.css";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://solosphere-fs-ycns.vercel.app/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {

        // 🔥 Redirect after success
        navigate("/home");
      } else {
        alert(data?.message || "Signup failed!");
      }
    } catch (error) {
      alert("Something went wrong!");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-tabs">
          <Link to="/">Sign In</Link>
          <span className="active">Sign Up</span>
        </div>

        <h2>New Account</h2>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <button type="submit" className="auth-btn">Sign Up</button>
        </form>
      </div>
    </div>
  );
}
