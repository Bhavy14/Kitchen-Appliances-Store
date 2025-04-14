// UserPanel.js (Main Component)
import React, { useState } from 'react';
import '../styles/UserPanel.css';

const UserPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="user-panel-container">
      <Sidebar setActiveTab={setActiveTab} activeTab={activeTab} />
      <MainContent activeTab={activeTab} />
    </div>
  );
};

// Sidebar Component
const Sidebar = ({ setActiveTab, activeTab }) => {
  return (
    <div className="sidebar">
      <h2>User Panel</h2>
      <ul>
        <li 
          className={activeTab === 'dashboard' ? 'active' : ''} 
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </li>
        <li 
          className={activeTab === 'products' ? 'active' : ''} 
          onClick={() => setActiveTab('products')}
        >
          Products
        </li>
        <li 
          className={activeTab === 'profile' ? 'active' : ''} 
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </li>
      </ul>
    </div>
  );
};

// Main Content Component
const MainContent = ({ activeTab }) => {
  switch (activeTab) {
    case 'dashboard':
      return <Dashboard />;
    case 'products':
      return <Products />;
    case 'profile':
      return <Profile />;
    default:
      return <Dashboard />;
  }
};

// Dashboard Component
const Dashboard = () => {
  return (
    <div className="content">
      <h1>Welcome to Your Dashboard</h1>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Orders</h3>
          <p>5</p>
        </div>
        <div className="stat-card">
          <h3>Wishlist</h3>
          <p>3</p>
        </div>
        <div className="stat-card">
          <h3>Cart Items</h3>
          <p>2</p>
        </div>
      </div>
    </div>
  );
};

// Products Component
const Products = () => {
  const sampleProducts = [
    { id: 1, name: 'Blender', price: 49.99, category: 'Small Appliances' },
    { id: 2, name: 'Microwave', price: 89.99, category: 'Cooking' },
    { id: 3, name: 'Toaster', price: 29.99, category: 'Breakfast' },
  ];

  return (
    <div className="content">
      <h1>Kitchen Appliances</h1>
      <div className="products-grid">
        {sampleProducts.map(product => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p>Category: {product.category}</p>
            <p>Price: ${product.price}</p>
            <button>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Profile Component
const Profile = () => {
  return (
    <div className="content">
      <h1>Your Profile</h1>
      <div className="profile-info">
        <p><strong>Name:</strong> John Doe</p>
        <p><strong>Email:</strong> john@example.com</p>
        <p><strong>Address:</strong> 123 Kitchen Street</p>
        <button>Edit Profile</button>
      </div>
    </div>
  );
};

export default UserPanel;