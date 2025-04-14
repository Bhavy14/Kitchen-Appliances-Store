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

module.exports = router;
