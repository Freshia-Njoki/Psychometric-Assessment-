const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { pool } = require('../model/dbPool');
require('dotenv').config()


const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email or password is not provided in the request
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    // login
    // check if email exist
    // if email exist? compare password 
    // else credentials invalid
    const sql = 'SELECT Username,Email, Password FROM Admin WHERE Email = ?';
    const values = [email]
    const [rows, fields] = await pool.execute(sql, values);
    if (rows.length > 0) {

      const Password = rows[0].Password
      const Email = rows[0].Email
      const Username = rows[0].Username


      const passwordMatch = await bcrypt.compare(password, Password);
      if (passwordMatch) {
        const token = jwt.sign({ userName: Username, email: Email }, process.env.JWT_SECRET);
        return res.status(200).json({ token: token });
      } else {
        return res.status(401).json({ message: 'Wrong credentials' });
      }

    }
    else {
      return res.status(401).json({ error: 'Wrong credentials' });
    }
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { adminLogin };
