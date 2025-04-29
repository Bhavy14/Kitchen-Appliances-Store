import React, { useEffect, useState } from 'react';
import './RecentOrders.css';

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard/recent-orders');
        const data = await response.json();
        console.log(data); // Check the response data
        setOrders(data);  // Set the orders state
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="recent-orders-container">
      <h3 className="orders-title">Recent Orders</h3>
      {orders.length === 0 ? (  // If no orders, show this message
        <p>No recent orders available.</p>
      ) : (
        <ul className="orders-list">
          {orders.slice(-3).reverse().map((order) => (
            <li key={order.id} className="order-item">
              <div className="order-details">
                <span><strong>Order ID:</strong> {order.id}</span>
                <span><strong>Total:</strong> ₹{parseFloat(order.total).toFixed(2)}</span>
                <span><strong>Date:</strong> {new Date(order.order_date).toLocaleString()}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentOrders;
