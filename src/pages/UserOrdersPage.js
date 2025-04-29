import React, { useEffect, useState } from "react";
import { IndianRupee } from 'lucide-react';

const UserOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserOrders = async () => {
      const token = localStorage.getItem('token'); // Retrieve token

      if (!token) {
        setError('You are not logged in. Please log in to view your orders.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/orders/my', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await res.json();
        console.log("Fetched User Orders:", data); // Debugging

        setOrders(data);
      } catch (err) {
        setError('Failed to fetch orders. Please try again later.');
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Your Orders</h2>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {orders.map((order, index) => {
            console.log(`Rendering order ${index}:`, order);

            let parsedItems = [];
            try {
              parsedItems = order.items ? JSON.parse(order.items) : [];
            } catch (e) {
              console.error("Error parsing items:", e);
            }

            return (
              <li key={order.id} style={{ marginBottom: "20px", padding: "15px", border: "1px solid gray", borderRadius: "8px" }}>
                <p><strong>Customer:</strong> {order.customer_name}</p>
                <p><strong>Email:</strong> {order.email}</p>
                <p><strong>Address:</strong> {order.address}</p>
                <p><strong>Phone:</strong> {order.phone}</p>
                <p><strong>Date:</strong> {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}</p>
                
                <div>
                  <strong>Items:</strong>
                  {parsedItems.length > 0 ? (
                    <ul>
                      {parsedItems.map((item, idx) => (
                        <li key={idx}>
                          {item.name} x {item.qty}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No items found.</p>
                  )}
                </div>

                {order.status && <p><strong>Status:</strong> {order.status}</p>}

                {order.total && (
                  <p><strong>Total:</strong> <IndianRupee size={15} /> {order.total}</p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default UserOrdersPage;
