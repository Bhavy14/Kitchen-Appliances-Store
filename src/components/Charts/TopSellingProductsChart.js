import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

const TopSellingProductsChart = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    // Fetch top-selling products data
    const fetchTopSellingProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/dashboard/top-selling-products');
        const data = await res.json();
        setChartData({
          labels: data.products,
          datasets: [
            {
              label: 'Top Selling Products',
              data: data.sales,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
          ],
        });
      } catch (err) {
        console.error('Error fetching top-selling products data:', err);
      } finally {
        setLoading(false); // Set loading to false after data is fetched or error occurs
      }
    };

    fetchTopSellingProducts();
  }, []);

  if (loading) {
    // Render a loading message while the data is being fetched
    return <div>Loading...</div>;
  }

  return (
    <div className="chart-container">
      <h3>Top Selling Products</h3>
      <Bar data={chartData} />
    </div>
  );
};

export default TopSellingProductsChart;
