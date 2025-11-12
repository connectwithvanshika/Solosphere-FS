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
    const res = await fetch("https://solosphere-fs-ycns.vercel.app//api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json().catch(() => null);
    console.log("🔍 Response:", data);

    if (res.ok) {
      alert(" Login successful!");
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
    <div className="login-container">
      <h2>Welcome Back</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
      </form>
      <p>
        Don’t have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}
