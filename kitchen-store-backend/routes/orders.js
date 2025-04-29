// routes/orders.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/verifyToken');

// POST /api/orders - place a new order
router.post('/', async (req, res) => {
    const { customer_name, customer_email, shipping_address, phone, items, total } = req.body;

    if (!customer_name || !customer_email || !shipping_address || !phone || !items || !total) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const result = await db.query(
            `INSERT INTO orders (customer_name, email, address, phone, items, total)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
            [customer_name, customer_email, shipping_address, phone, JSON.stringify(items), total]
        );

        res.status(201).json({ message: 'Order placed successfully!', order: result.rows[0] });
    } catch (error) {
        console.error('Error inserting order:', error);
        res.status(500).json({ error: 'Failed to place order.' });
    }
});
// GET /api/orders - fetch all orders
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM orders ORDER BY id DESC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders.' });
    }
});

router.get('/my', verifyToken, async (req, res) => {
    try {
      const userEmail = req.user.email; // Extract email from token
      const result = await db.query(
        'SELECT * FROM orders WHERE email = $1 ORDER BY id DESC',
        [userEmail]
      );
      res.status(200).json(result.rows); // Return orders for the user
    } catch (error) {
      console.error('Error fetching user orders:', error);
      res.status(500).json({ error: 'Failed to fetch your orders.' });
    }
  });
  

module.exports = router;
