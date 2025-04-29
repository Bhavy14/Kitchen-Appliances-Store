import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RevenueChart = ({ monthlyRevenue }) => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    if (monthlyRevenue.length > 0) {
      setChartData({
        labels: monthlyRevenue.map(item => item.month),
        datasets: [
          {
            label: 'Revenue',
            data: monthlyRevenue.map(item => item.revenue),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      });
    }
  }, [monthlyRevenue]);

  // Check if chart data is empty or no data to render
  if (!chartData.labels || chartData.labels.length === 0) {
    return <div>No data available for the chart.</div>;
  }

  return (
    <div className="chart-container">
      <h3>Monthly Revenue</h3>
      <Bar data={chartData} />
    </div>
  );
};

export default RevenueChart;
