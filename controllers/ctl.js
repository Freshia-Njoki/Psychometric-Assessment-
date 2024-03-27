const { pool, s_users, insertUser_query } = require("../model/dbPool");
const { resolve } = require("path");
const { rejects } = require("assert");


const createUser = async (req, res) => {
  const userDetails = {
    name: req.body.name,
    email: req.body.email,
  };
  console.log(req.body.name);

  try {
    const connection = await getConnection();
    const emailExists = await runQuery(connection, `SELECT * FROM Applicant WHERE email = ?`, [userDetails.email]);
    if (emailExists.length > 0) {
      res.status(200).json({message: "Email already registered"});
    } else {
    
    if (req.body.name.length <= 4) {
      res.status(200).json({ message: "invalid username - characters should be greater than 4" });
    } else {
      const rest = await addUser(userDetails);
      if (rest.errno == 1062) {
        res.status(200).json({ message: "duplicate" });
      } else {
        res.status(200).json({ message: "Applicant created successfully" });
      }
    }
  }
  } catch (err) {
    console.error("Error creating user:", err)
    res.status(500).json({ error: "Internal server error" });
  }
};

const showApplicants = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(501).json({ error: "Database connection error" });
      console.log(err);
      return;
    }
    connection.query(s_users, (err, result) => {
      connection.release();
      if (err) throw err;
      res.json(result);
    });
  });
};


function getConnection() {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        resolve(connection);
      }
    });
  });
}

function runQuery(connection, sql_query, values) {
  return new Promise((resolve, reject) => {
    connection.query(sql_query, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

const addUser = async (data) => {
  const connection = await getConnection();
  try {
    const result = await runQuery(connection, insertUser_query, [
      data.name,
      data.email,
    ]);
    console.log(result);
    return result;
  } catch (error) {
    return err;
  }
};



module.exports = {createUser, showApplicants};




