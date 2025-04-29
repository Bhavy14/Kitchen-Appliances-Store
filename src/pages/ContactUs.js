import React, { useState } from 'react';
import '../styles/ContactUs.css'; // style this as you like
import axios from 'axios';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const [status, setStatus] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Simple email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setStatus("Please enter a valid email address.");
            return;
        }

        try {
            await axios.post('/api/contact', formData);
            setStatus('Message sent successfully!');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            setStatus('Failed to send message.');
        }
    };


    return (
        <div className="contact-container">
            <div className="contact-info">
                <div className="info-section">
                    <h2>📦 About Us</h2>
                    <p>KitchenStore offers premium kitchen appliances and support. Need help choosing the right product or resolving an issue? We’re here for you.</p>
                </div>

                <div className="info-section">
                    <h2>📍 Visit Us</h2>
                    <p>B-98 shivalik residency, Near sindhu Bhavan Road, Ahmedabad - 380013</p>
                </div>

                <div className="info-section">
                    <h2>📞 Call or Mail</h2>
                    <p>Phone: +91 81606 72733</p>
                    <p>Email: support@kitchenstore.com</p>
                </div>

                <div className="info-section">
                    <h2>🕒 Support Hours</h2>
                    <p>Mon–Sat: 9 AM – 6 PM</p>
                    <p>Sunday: Closed</p>
                </div>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
                <h2>Send us a message</h2>
                <input name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
                <input name="email" type="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
                <select name="subject" value={formData.subject} onChange={handleChange} required>
                    <option value="">Select Subject</option>
                    <option>Product Inquiry</option>
                    <option>Order Issue</option>
                    <option>Feedback</option>
                </select>
                <textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleChange} required />
                <button type="submit">Send Message</button>
                {status && <p className="form-status">{status}</p>}
            </form>
        </div>
    );
};

export default ContactUs;
