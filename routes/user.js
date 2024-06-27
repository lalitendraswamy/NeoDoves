const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../models/user');
const router = express.Router();

router.post('/register', (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);
  db.run(`INSERT INTO user (username, password, email) VALUES (?, ?, ?)`, [username, hashedPassword, email], (err) => {
    if (err) {
      return res.status(500).send("Error registering user");
    }
    res.status(200).send("User registered successfully");
  });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get(`SELECT * FROM user WHERE username = ?`, [username], (err, row) => {
    if (err || !row) {
      return res.status(404).send("User not found");
    }
    const passwordIsValid = bcrypt.compareSync(password, row.password);
    if (!passwordIsValid) {
      return res.status(401).send("Invalid password");
    }
    res.status(200).send("Login successful");
  });
});

module.exports = router;