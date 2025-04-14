import React, { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { IndianRupee } from 'lucide-react';
import '../styles/OrderPage.css';

const OrderPage = () => {
  const location = useLocation();
  const history = useHistory();
  const cartItems = location.state?.cartItems || [];

  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    phone: '',
    shipping_address: '',
    pincode: '',
    city: '',
    state: '',
    landmark: ''
  });

  const [message, setMessage] = useState('');
  const [submitting] = useState(false);
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const fullAddress = `${form.shipping_address}, ${form.landmark ? form.landmark + ', ' : ''}${form.city}, ${form.state} - ${form.pincode}`;
  
    const orderData = {
      customer_name: form.customer_name,
      customer_email: form.customer_email,
      shipping_address: fullAddress,
      phone: form.phone,
      items: cartItems,
      total,
    };
  
    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        setMessage('Order placed successfully!');
        setTimeout(() => history.push('/'), 2000);
      } else {
        console.error('Backend error:', data);
        setMessage(data.error || 'Something went wrong!');
      }
    } catch (err) {
      console.error('Order error:', err);
      setMessage('Failed to place order.');
    }
  };

  return (
    <div className="order-page">
      <h2>Complete Your Order</h2>

      <div className="order-content">
        <form className="order-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="customer_name"
            placeholder="Your Name"
            value={form.customer_name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="customer_email"
            placeholder="Your Email"
            value={form.customer_email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
          />
          <textarea
            name="shipping_address"
            placeholder="Shipping Address"
            value={form.shipping_address}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={form.pincode}
            onChange={handleChange}
            required
          />
          <div className="city-state-row">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={form.state}
              onChange={handleChange}
              required
            />
          </div>
          <input
            type="text"
            name="landmark"
            placeholder="Nearby Landmark (optional)"
            value={form.landmark}
            onChange={handleChange}
          />

          <button type="submit" disabled={submitting}>
            {submitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>

        <div className="order-summary">
          <h3>Order Summary</h3>
          <ul>
            {cartItems.map((item, index) => (
              <li key={index}>
                {item.name} - <IndianRupee size={15} />{item.price.toFixed(2)}
              </li>
            ))}
          </ul>
          <p className="order-total"><strong>Total:</strong> <IndianRupee size={15} />{total.toFixed(2)}</p>
        </div>
      </div>

      {message && (
        <p className={`order-message ${message.toLowerCase().includes('fail') || message.toLowerCase().includes('wrong') ? 'error' : ''}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default OrderPage;
