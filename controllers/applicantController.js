const { pool, s_users, insertUser_query } = require("../model/dbPool");
// const { resolve } = require("path");
// const { rejects } = require("assert");


const createUser = async (req, res) => {

  try {
    const { name, email } = req.body;
    const sql = insertUser_query;
    const values = [name, email];

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





module.exports = { createUser, showApplicants };




