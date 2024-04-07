const { pool } = require("../model/dbPool");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // if (!password) {
    //   return res.status(400).json({ error: 'Password is required' });
    // }

    // Log the password before hashing
    console.log('Password before hashing:', password);

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const sql = 'INSERT INTO Admin (Username, Email, Password) VALUES (?, ?, ?)';
    //convert json object to an array - helps prevent SQL injections
    const values = [name, email, password];
    const [rows] = await pool.execute(sql, values);
    if(rows){
      return res.status(200).json({msg : "Admin created successfully"})
    } else {
      console.log("error occurred while creating admin");
      return res.status(500).json({msg:"error creating admin"})
    }
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { createAdmin };
