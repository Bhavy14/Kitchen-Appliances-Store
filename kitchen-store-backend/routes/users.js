const express = require('express');
const router = express.Router();
const db = require('../db'); // Database connection

// Get all users
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users');
    res.json(result.rows);  // Send users as JSON
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;