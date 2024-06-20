const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(query, [name, email, hashedPassword], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'User already exists' });
      }
      res.json({ message: 'User registered successfully' });
    });
  });

// Login a user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, 'your_jwt_secret');
    res.json({ token, userId: user.id }); // Include userId in the response
  });
});

router.get('/', (req, res) => {
    res.send('GET request to the homepage')
})

module.exports = router;
