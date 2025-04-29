import React, { useEffect, useState } from 'react';
import { Users, Box, ClipboardList, IndianRupee } from 'lucide-react';
import RevenueChart from '../components/Charts/RevenueChart';
import OrdersChart from '../components/Charts/OrdersChart';
import TopSellingProductsChart from '../components/Charts/TopSellingProductsChart';
import RecentOrders from '../components/Charts/RecentOrders';
import '../styles/dashboard.css';

const Dashboard = () => {
  const [usersCount, setUsersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [ordersPerMonth, setOrdersPerMonth] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChart, setSelectedChart] = useState('revenue');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const usersRes = await fetch('http://localhost:5000/api/dashboard/count/users');
        const productsRes = await fetch('http://localhost:5000/api/dashboard/count/products');
        const ordersRes = await fetch('http://localhost:5000/api/dashboard/count/orders');
        const revenueRes = await fetch('http://localhost:5000/api/dashboard/revenue');
        const monthlyRevenueRes = await fetch('http://localhost:5000/api/dashboard/monthly-revenue');
        const ordersPerMonthRes = await fetch('http://localhost:5000/api/dashboard/orders-per-month');
        const topSellingProductsRes = await fetch('http://localhost:5000/api/dashboard/top-selling-products');
        const recentOrdersRes = await fetch('http://localhost:5000/api/dashboard/recent-orders');

        const usersData = await usersRes.json();
        const productsData = await productsRes.json();
        const ordersData = await ordersRes.json();
        const revenueData = await revenueRes.json();
        const monthlyRevenueData = await monthlyRevenueRes.json();
        const ordersPerMonthData = await ordersPerMonthRes.json();
        const topSellingProductsData = await topSellingProductsRes.json();
        const recentOrdersData = await recentOrdersRes.json();

        setUsersCount(usersData.count || 0);
        setProductsCount(productsData.count || 0);
        setOrdersCount(ordersData.count || 0);
        setRevenue(revenueData.total || 0);
        setMonthlyRevenue(monthlyRevenueData); // Log the data here
        setOrdersPerMonth(ordersPerMonthData);
        setTopSellingProducts(topSellingProductsData);
        setRecentOrders(recentOrdersData);

      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  console.log('Monthly Revenue:', monthlyRevenue); // Add this to check the value

  return (
    <div className="dashboard-overview">
      <h2 className="dashboard-heading">Welcome back, Admin</h2>

      {/* Stats Overview */}
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

      {/* Buttons to select which chart to show */}
      <div className="chart-buttons">
        <button onClick={() => setSelectedChart('revenue')}>Revenue</button>
        <button onClick={() => setSelectedChart('orders')}>Orders</button>
        <button onClick={() => setSelectedChart('topSelling')}>Top Selling Products</button>
        <button onClick={() => setSelectedChart('recentOrders')}>Recent Orders</button>
      </div>

      {/* Chart Section */}
      <div className="dashboard-charts">
        {selectedChart === 'revenue' && <RevenueChart monthlyRevenue={monthlyRevenue} />}
        {selectedChart === 'orders' && <OrdersChart />}
        {selectedChart === 'topSelling' && <TopSellingProductsChart />}
        {selectedChart === 'recentOrders' && <RecentOrders />}
      </div>
    </div>
  );
};

export default Dashboard;
