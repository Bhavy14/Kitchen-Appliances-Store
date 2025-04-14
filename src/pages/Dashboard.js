import React, { useEffect, useState } from 'react';
import { Users, Box, ClipboardList, IndianRupee } from 'lucide-react';
import '../styles/dashboard.css';

const Dashboard = () => {
  const [usersCount, setUsersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const usersRes = await fetch('http://localhost:5000/api/dashboard/count/users');
        const productsRes = await fetch('http://localhost:5000/api/dashboard/count/products');
        const ordersRes = await fetch('http://localhost:5000/api/dashboard/count/orders');
        const revenueRes = await fetch('http://localhost:5000/api/dashboard/revenue');

        const usersData = await usersRes.json();
        const productsData = await productsRes.json();
        const ordersData = await ordersRes.json();
        const revenueData = await revenueRes.json();

        setUsersCount(usersData.count || 0);
        setProductsCount(productsData.count || 0);
        setOrdersCount(ordersData.count || 0);
        setRevenue(revenueData.total || 0);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="dashboard-overview">
      <h2 className="dashboard-heading">Welcome back, Admin</h2>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <Users size={28} />
          <div>
            <h3>Users</h3>
            <p>{usersCount}</p>
          </div>
        </div>

        <div className="dashboard-card">
          <Box size={28} />
          <div>
            <h3>Products</h3>
            <p>{productsCount}</p>
          </div>
        </div>

        <div className="dashboard-card">
          <ClipboardList size={28} />
          <div>
            <h3>Orders</h3>
            <p>{ordersCount}</p>
          </div>
        </div>

        <div className="dashboard-card">
          <IndianRupee size={28} />
          <div>
            <h3>Revenue</h3>
            <p>{revenue}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
