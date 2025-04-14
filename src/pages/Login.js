// src/pages/Login.js
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import '../styles/Login.css';

const Login = ({ onClose }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const history = useHistory();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            setLoading(false);

            if (!response.ok) {
                setError(data.message || "Login failed");
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // ✅ Show success alert
            alert("Login successful!");

            if (onClose && typeof onClose === 'function') onClose();
            history.push("/home");
            setFormData({ email: '', password: '' });
        } catch (err) {
            console.error("Login Error:", err);
            setLoading(false);
            setError("Server error. Please try again later.");
        }
    };

    return (
        <div className="login-overlay">
            <div className="login-container">
                <button className="close-btn" onClick={onClose} aria-label="Close">&times;</button>
                <h2 className="login-heading">Login</h2>

                {error && <p className="error-message">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="password-container">
                        <label htmlFor="password">Password:</label>
                        <div className="password-input">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    <div className="remember-forgot">
                        <label>
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                            />
                            Remember Me
                        </label>
                        <Link to="/Forgot_Password" className="forgot-link">Forgot Password?</Link>
                    </div>

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    <p className="register-link">
                        New User? <Link to="/Register" onClick={onClose}>Register Here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
