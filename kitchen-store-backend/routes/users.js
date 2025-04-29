const express = require('express');
const router = express.Router();
const db = require('../db'); // Database connection
const verifyToken = require('../middleware/verifyToken');
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

router.get('/me', verifyToken, async (req, res) => {
  try {
      const userEmail = req.user.email; // Extracted from token

      const result = await db.query(
          'SELECT id, name, email FROM users WHERE email = $1',
          [userEmail]
      );

      if (result.rows.length === 0) {
          return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json(result.rows[0]);
  } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});


module.exports = router;