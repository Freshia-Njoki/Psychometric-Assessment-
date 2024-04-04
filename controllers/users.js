const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { pool } = require('../model/dbPool');
const secret = 'Tech4dev';

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email or password is not provided in the request
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Retrieve username and hashed password from the database based on the provided email
    const sql = 'SELECT Username, Password FROM Admin WHERE Email = ?';
    pool.query(sql, [email], async (err, result) => {
      if (err) {
        console.error('Error retrieving admin:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      // Check if an admin with the provided email exists
      if (result.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const { Username, Password } = result[0];

      // Compare the provided password with the hashed password from the database
      const passwordMatch = await bcrypt.compare(password, Password);

      if (passwordMatch) {
        // If the passwords match, generate a JWT token with the username
        const token = jwt.sign({ userName: Username }, secret);
        return res.status(200).json({ token });
      } else {
        // If the passwords don't match, return an error response
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { adminLogin };
