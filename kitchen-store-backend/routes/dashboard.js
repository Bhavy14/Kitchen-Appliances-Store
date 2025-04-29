// routes/dashboard.js
const express = require('express');
const db = require('../db'); // Import the database connection

const router = express.Router();

// Route for getting user count
router.get('/count/users', async (req, res) => {
  try {
    const result = await db.query('SELECT COUNT(*) FROM users');
    res.json({ count: result.rows[0].count });
  } catch (err) {
    console.error('Error fetching user count:', err);
    res.status(500).send('Server error');
  }
});

// Route for getting products count
router.get('/count/products', async (req, res) => {
  try {
    const result = await db.query('SELECT COUNT(*) FROM products');
    res.json({ count: result.rows[0].count });
  } catch (err) {
    console.error('Error fetching product count:', err);
    res.status(500).send('Server error');
  }
});

// Route for getting orders count
router.get('/count/orders', async (req, res) => {
  try {
    const result = await db.query('SELECT COUNT(*) FROM orders');
    res.json({ count: result.rows[0].count });
  } catch (err) {
    console.error('Error fetching order count:', err);
    res.status(500).send('Server error');
  }
});

// Route for getting total revenue
router.get('/revenue', async (req, res) => {
  try {
    const result = await db.query('SELECT SUM(total) AS total FROM orders');
    res.json({ total: result.rows[0].total });
  } catch (err) {
    console.error('Error fetching revenue:', err);
    res.status(500).send('Server error');
  }
});


router.get('/monthly-revenue', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        EXTRACT(MONTH FROM order_date) AS month, 
        SUM(total) AS revenue
      FROM orders
      GROUP BY month
      ORDER BY month
    `);

    const revenueData = result.rows;

    // Create an array for 12 months initialized with 0 revenue
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: (i + 1), // month number 1 to 12
      revenue: 0
    }));

    // Now fill in revenue if exists
    revenueData.forEach(data => {
      const monthIndex = data.month - 1; // Because array is 0-indexed
      months[monthIndex].revenue = Number(data.revenue);
    });

    res.json(months);
  } catch (err) {
    console.error('Error fetching monthly revenue:', err);
    res.status(500).send('Server error');
  }
});

// Route for getting orders per month
router.get('/orders-per-month', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        EXTRACT(MONTH FROM order_date) AS month, 
        EXTRACT(YEAR FROM order_date) AS year, 
        COUNT(*) AS order_count
      FROM orders
      GROUP BY year, month
      ORDER BY year, month
    `);
    console.log(result.rows);  // Log the result for debugging
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching orders per month:', err);
    res.status(500).send('Server error');
  }
});


// Route for getting recent 5 orders
router.get('/recent-orders', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT o.id, o.total, o.order_date
      FROM orders o
      ORDER BY o.order_date DESC
      LIMIT 3
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching recent orders:', err);
    res.status(500).send('Server error');
  }
});


module.exports = router;
