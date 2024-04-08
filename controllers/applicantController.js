const { pool, s_users, insertUser_query } = require("../model/dbPool");
// const { resolve } = require("path");
// const { rejects } = require("assert");


const createUser = async (req, res) => {

  try {
    const { name, email, location } = req.body;
    const sql = insertUser_query;
    const values = [name, email, location];

    const [existingUser] = await pool.execute('SELECT * FROM Applicant WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }


    const [rows] = await pool.execute(sql, values);
    if (rows) {
      // console.log(rows);
      return res.status(200).json({ message: "Applicant created successfully" });
    } else {
      return res.status(500).json({ error: 'Error creating user' });
    }

  } catch (err) {
    console.log("Error creating user:", err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const showApplicants = async (req, res) => {
  try {
    const sql = s_users;
    const [rows] = await pool.execute(sql);
    if (rows) {
      return res.status(200).json(rows)
    }
  } catch (error) {
    console.log(error);
  }


};

const applicantLogin = async (req, res) => {
  try {
    const { name, email, location } = req.body;

    // Check if email or password is not provided in the request
    if (!name || !email || !location) {
      return res.status(400).json({ error: 'All  fields are required' });

     
    }
    const sql = 'SELECT Name, Email, Location FROM Applicant WHERE Email = ?';
    const values = [name, email, location]
    const [rows, fields] = await pool.execute(sql, [values]);

    if (rows) {
      console.log(rows[0]);
      return res.status(200).json({msg: "Login success" });
    }
    if (!(Applicant_Name === name && Applicant_Email === email && Location === location)) {
      return res.status(401).json({ error: 'Invalid details' });
    }

    

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// function getConnection() {
//   return new Promise((resolve, reject) => {
//     pool.getConnection((err, connection) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(connection);
//       }
//     });
//   });
// }

// function runQuery(connection, sql_query, values) {
//   return new Promise((resolve, reject) => {
//     connection.query(sql_query, values, (err, result) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(result);
//       }
//     });
//   });
// }





module.exports = { createUser, showApplicants, applicantLogin };




