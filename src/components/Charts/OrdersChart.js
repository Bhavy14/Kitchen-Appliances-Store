import React, { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';

// Register necessary chart elements
ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement);

const OrdersChart = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const chartRef = useRef(null);

  useEffect(() => {
    const fetchOrdersData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/dashboard/orders-per-month');
        if (!res.ok) {
          throw new Error('Failed to fetch orders data');
        }

        const data = await res.json();
        console.log('Fetched Orders Data:', data);

        if (data.length === 0) {
          setError('No data available for the chart');
        } else {
          // Prepare the data for all 12 months
          const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ];

          const orderCounts = months.map((month, index) => {
            const monthData = data.find(item => parseInt(item.month) === (index + 1));
            return monthData ? parseInt(monthData.order_count) : 0; // Default to 0 if no data for the month
          });

          // Calculate the color for each line segment (up or down)
          const lineColors = orderCounts.map((count, index) => {
            if (index === 0) return 'rgb(75, 192, 192)'; // Neutral color for first point
            return count > orderCounts[index - 1] ? 'green' : 'red'; // Green for up, Red for down
          });

          setChartData({
            labels: months,
            datasets: [
              {
                label: 'Orders per Month',
                data: orderCounts,
                fill: false,
                borderColor: 'rgb(75, 192, 192)', // Default color for the line
                tension: 0.1,
                pointRadius: 0, // Remove points
                borderWidth: 2,
                segment: {
                  borderColor: (context) => {
                    const { dataIndex } = context;
                    return lineColors[dataIndex]; // Color segments based on trend
                  },
                },
              },
            ],
          });
        }
      } catch (err) {
        setError('Error fetching orders data');
        console.error('Error fetching orders data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersData();

    return () => {
      if (chartRef.current && chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="chart-container">
      <h3>Orders per Month for 2025</h3>
      {chartData.labels && chartData.datasets ? (
        <Line ref={chartRef} data={chartData} />
      ) : (
        <div>No data available to display.</div>
      )}
    </div>
  );
};

export default OrdersChart;
