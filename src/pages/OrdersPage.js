import React, { useEffect, useState } from "react";
import "../styles/OrdersPage.css";
import { IndianRupee } from 'lucide-react';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/orders");
        const data = await res.json();
        if (Array.isArray(data)) {
          setOrders(data);
        } else if (Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else {
          console.error("Unexpected data format:", data);
          setOrders([]);
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this order?");
    if (confirmed) {
      try {
        await fetch(`http://localhost:5000/api/orders/${id}`, {
          method: "DELETE",
        });
        setOrders((prev) => prev.filter((order) => order.id !== id));
      } catch (err) {
        console.error("Failed to delete order:", err);
      }
    }
  };

  const updateStatus = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="orders-container">
      <h2>Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Total (₹)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer_name || order.customer}</td>
                <td>
                  <select
                    value={order.status || "Pending"}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td><IndianRupee size={15}/>{order.total}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(order.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrdersPage;
