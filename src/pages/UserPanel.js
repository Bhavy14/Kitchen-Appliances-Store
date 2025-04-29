import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/UserPanel.css';

// Utility function to make fetch requests
const fetchData = async (url) => {
  try {
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    return await res.json();
  } catch (err) {
    console.error('Error fetching data:', err);
    throw err;
  }
};

const UserPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userInfo, setUserInfo] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await fetchData('http://localhost:5000/api/users/me');
        setUserInfo(userData);
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    const fetchOrdersData = async () => {
      try {
        const ordersData = await fetchData('http://localhost:5000/api/orders/my');
        setOrders(ordersData);
      } catch (err) {
        console.error('Error fetching orders data:', err);
      }
    };
    const fetchAllData = async () => {
      try {
        await fetchUserData();
        await fetchOrdersData();
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    history.push('/home');
  };

  return (
    <div className="user-panel-container">
      <Sidebar 
        setActiveTab={setActiveTab} 
        activeTab={activeTab} 
        handleLogout={handleLogout} 
      />
      <MainContent 
        activeTab={activeTab} 
        userInfo={userInfo} 
        orders={orders} 
        loading={loading}
      />
    </div>
  );
};

const Sidebar = ({ setActiveTab, activeTab, handleLogout }) => {
  return (
    <div className="sidebar">
      <h2>Profile</h2>
      <ul>
        <li 
          className={activeTab === 'dashboard' ? 'active' : ''} 
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </li>
        <li 
          className={activeTab === 'orders' ? 'active' : ''} 
          onClick={() => setActiveTab('orders')}
        >
          My Orders
        </li>
        <li 
          className={activeTab === 'profile' ? 'active' : ''} 
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </li>
      </ul>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

const MainContent = ({ activeTab, userInfo, orders, loading }) => {
  if (loading) return <div>Loading...</div>;

  switch (activeTab) {
    case 'dashboard':
      return <Dashboard userInfo={userInfo} />;
    case 'orders':
      return <Orders orders={orders} />;
    case 'profile':
      return <Profile userInfo={userInfo} />;
    default:
      return <Dashboard userInfo={userInfo} />;
  }
};

const Dashboard = ({ userInfo }) => {
  return (
    <div className="content">
      <h1>Welcome to Your Dashboard</h1>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Orders</h3>
          <p>{userInfo?.orders || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Wishlist</h3>
          <p>{userInfo?.wishlist || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Cart Items</h3>
          <p>{userInfo?.cartItems || 0}</p>
        </div>
      </div>
    </div>
  );
};

const Orders = ({ orders }) => {
  console.log('Orders:', orders); // Log orders to debug

  // Check if orders are empty or undefined
  if (!orders || orders.length === 0) {
    return (
      <div className="content">
        <h1>My Orders</h1>
        <p>No orders found.</p>
      </div>
    );
  }

  return (
    <div className="content">
      <h1>My Orders</h1>
      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <p><strong>Item:</strong> {order.item}</p>
            <p><strong>Date:</strong> {order.date}</p>
            <p><strong>Status:</strong> {order.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Profile = ({ userInfo }) => {
  return (
    <div className="content">
      <h1>Your Profile</h1>
      <div className="profile-info">
        <p><strong>Name:</strong> {userInfo?.name || 'N/A'}</p>
        <p><strong>Email:</strong> {userInfo?.email || 'N/A'}</p>
        <p><strong>Address:</strong> {userInfo?.address || 'N/A'}</p>
        <button>Edit Profile</button>
      </div>
    </div>
  );
};

export default UserPanel;
