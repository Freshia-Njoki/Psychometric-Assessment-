const { pool } = require("../model/dbPool");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the password is provided
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    // Log the password before hashing
    console.log('Password before hashing:', password);

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const sql = 'INSERT INTO Admin (Username, Email, Password) VALUES (?, ?, ?)';
    pool.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error creating admin:', err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.status(200).json({ message: 'Admin created successfully' });
      }
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { createAdmin };
