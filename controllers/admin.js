const { pool } = require("../model/dbPool");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;


if (!name || !email || !password) {
  return res.status(400).json({ error: 'All fields are required' });
}

    console.log('Password before hashing:', password);

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const values = [name, email, hashedPassword];
    // console.log(Array.isArray(values)); //true


    const sql = 'INSERT INTO Admin (Username, Email, Password) VALUES (?, ?, ?)';
    //convert json object to an array - helps prevent SQL injections
    const [rows] = await pool.execute(sql, values);
    if(rows.affectedRows > 0){
      // console.log(rows);
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
