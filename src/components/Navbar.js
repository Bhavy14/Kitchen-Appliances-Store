// src/components/Navbar.js
import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignOutAlt, faTimes } from "@fortawesome/free-solid-svg-icons";
import Login from "../pages/Login";
import Logo from "../images/logo.png";
import "../styles/Navbar.css";

const Navbar = () => {
    const [showNavbar, setShowNavbar] = useState(true);
    const [showLogin, setShowLogin] = useState(false);
    const [userInfo, setUserInfo] = useState(null);

    const history = useHistory(); // added

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (storedUser && token) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUserInfo(parsedUser);
            } catch (error) {
                console.error("Failed to parse user info:", error);
                setUserInfo(null);
            }
        } else {
            setUserInfo(null);
        }
    }, [showLogin]);

    const handleLoginClick = () => {
        setShowLogin(true);
    };

    const handleCloseLogin = () => {
        setShowLogin(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUserInfo(null);
        history.push("/home"); // or navigate to login page if you prefer
    };

    return (
        <>
            <nav className="navbar-container">
                {showNavbar ? (
                    <>
                        <img src={Logo} alt="Kitchen Store Logo" className="logo" />
                        <ul>
                            <li><Link to="/home">Home</Link></li>
                            <li><Link to="/products">Products</Link></li>
                            <li><Link to="/Contact">Contact Us</Link></li>
                            <li><Link to="/UserPanel">Profile</Link></li>
                            <li>
                                <div className="tooltip-container">
                                    <button onClick={userInfo ? null : handleLoginClick} className="login-icon">
                                        <FontAwesomeIcon icon={faUser} />
                                        {userInfo && (
                                            <span className="tooltip">
                                                <p><strong>{userInfo.name}</strong></p>
                                                <p>{userInfo.email}</p>
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </li>

                            {/* Logout button shows only if userInfo exists */}
                            {userInfo && (
                                <li>
                                    <button onClick={handleLogout} className="logout-button">
                                        <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                                    </button>
                                </li>
                            )}
                        </ul>
                    </>
                ) : (
                    <div className="cancel-icon" onClick={() => setShowNavbar(true)}>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                )}
            </nav>

            {showLogin && <Login onClose={handleCloseLogin} />}
        </>
    );
};

export default Navbar;
