"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import '../styles/Register.css'; // Import CSS file

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!formData.password || formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.mobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      alert("Registration Successful!");
      setFormData({ name: "", email: "", password: "", confirmPassword: "", mobile: "" });
    } catch (err) {
      setLoading(false);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="form-section">
          <h2>Create Account</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit}>
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter your full name" />

            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Enter your email" />

            <label>Mobile</label>
            <input type="number" name="mobile" value={formData.mobile} onChange={handleChange} required placeholder="Enter your mobile number" />

            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Create a password (min. 8 characters)" />

            <label>Confirm Password</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="Confirm your password" />

            <button type="submit" disabled={loading}>{loading ? "Registering..." : "Register"}</button>
          </form>
          <p>Already have an account? <Link to="/login">Log in</Link></p>
        </div>
      </div>
    </div>
  );
}