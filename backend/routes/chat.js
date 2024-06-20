const express = require('express');
const db = require('../db');

const router = express.Router();

// Endpoint to fetch all messages with user information
router.get('/messages', (req, res) => {
    const query = `
      SELECT messages.message, users.name AS user_name 
      FROM messages 
      JOIN users ON messages.user_id = users.id
    `;
    db.query(query, (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  });

module.exports = router;
