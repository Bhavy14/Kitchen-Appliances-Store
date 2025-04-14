import React from 'react';
import '../styles/Home.css';
import image2 from '../images/abot.jpeg';
import FeaturedProducts from '../pages/FeaturedProducts'; // ✅ Updated import path

const Home = () => {
    return (
        <div className="home-page">
            {/* Hero Section with animated letters */}
            <header className="hero-section">
                <div className="hero-content">
                    <h1 className="animated-header">
                        {Array.from("Welcome to Kitchen Store").map((letter, i) => (
                            <span key={i} style={{ animationDelay: `${i * 0.1}s` }}>{letter}</span>
                        ))}
                    </h1>
                    <p className="hero-subtitle">Your one-stop shop for all kitchen appliances</p>
                    <p className="hero-description">
                        Discover the perfect tools to elevate your cooking experience. From sleek modern designs to timeless classics, we offer a wide range of high-quality kitchen appliances that cater to every chef's needs.
                    </p>
                    <div className="hero-cta">
                        <button className="hero-btn">Shop Now</button>
                        <button className="hero-btn-outline">Explore Collections</button>
                    </div>
                </div>
            </header>

            <main className="home-main">
                {/* Featured Products Section */}
                <section className="featured-section">
                    <h2 className="animated-header">
                        {Array.from("Our Products").map((letter, i) => (
                            <span key={i} style={{ animationDelay: `${i * 0.1}s` }}>{letter}</span>
                        ))}
                    </h2>
                    <p className="featured-subtitle">Explore our curated collection of premium kitchen appliances</p>

                    {/* ✅ Use backend-powered featured products */}
                    <FeaturedProducts />
                </section>

                {/* About Section */}
                <section className="about-section">
                    <div className="about-container">
                        <div className="about-image">
                            <img src={image2} alt="Chef Cooking" />
                        </div>
                        <div className="about-content">
                            <h2 className="animated-header">
                                {Array.from("About Us").map((letter, i) => (
                                    <span key={i} style={{ animationDelay: `${i * 0.1}s` }}>{letter}</span>
                                ))}
                            </h2>
                            <p className="about-subtitle">Crafting Culinary Excellence Since 2020</p>
                            <p className="about-description">
                                Kitchen Store is dedicated to providing high-quality kitchen appliances at affordable prices.
                                Our mission is to make cooking and baking enjoyable for everyone. Whether you're a seasoned
                                chef or a home cook, we're here to inspire your culinary journey.
                            </p>
                            <button className="about-btn">
                                Learn More <span className="arrow">→</span>
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer Section */}
            <footer className="home-footer">
                <div className="footer-container">
                    <div className="footer-section">
                        <h3 className="footer-heading">Quick Links</h3>
                        <ul className="footer-links">
                            <li><a href="/home">Home</a></li>
                            <li><a href="/about">About Us</a></li>
                            <li><a href="/products">Products</a></li>
                            <li><a href="/contact">Contact</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3 className="footer-heading">Contact Us</h3>
                        <ul className="footer-contact">
                            <li><i className="fas fa-envelope"></i> info@kitchenstore.com</li>
                            <li><i className="fas fa-phone"></i> +1 (123) 456-7890</li>
                            <li><i className="fas fa-map-marker-alt"></i> 123 Kitchen St, Food City, FC 12345</li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3 className="footer-heading">Follow Us</h3>
                        <div className="social-icons">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-linkedin-in"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
