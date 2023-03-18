const express = require('express');
const pool = require('../config/db');
const { generateSalt, hashPassword, verifyPassword } = require('../utils/password');
const jwt = require('jsonwebtoken');

const router = express.Router();

//Handler to Create  a note
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (userExists.rowCount !== 0) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const salt = generateSalt();
    const hashedPassword = hashPassword(password, salt);

    const user = await pool.query(
      `INSERT INTO users (email, password, salt) VALUES ($1, $2, $3) RETURNING *`,
      [email, hashedPassword, salt]
    );

    const token = jwt.sign({ id: user.id, email: user.email }, 'SECRET', {
      expiresIn: '24h',
    });

    return res.status(201).json({
      data: {
        user: user.rows[0],
        token: token,
      },
    });
  } catch (error) {
    console.log(error.message);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rowCount === 0) {
      return res.status(404).json({ message: 'No users found with this email' });
    }

    const salt = userExists.rows[0].salt;
    const hashedPassword = userExists.rows[0].password;
    const isValidPassword = verifyPassword(password, salt, hashedPassword);

    if (isValidPassword) {
      //sign a jwt token
      const token = jwt.sign(
        { id: userExists.rows[0].id, email: userExists.rows[0].email },
        'SECRET',
        {
          expiresIn: '24h',
        }
      );

      return res.status(200).json({ token });
    } else {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
