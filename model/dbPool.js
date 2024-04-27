const mysql = require("mysql2/promise");

const pool = mysql.createPool({
	connectionLimit: 10,
	host: process.env.HOST,
	user: process.env.DB_USER,
	password: process.env.PASSWORD,
	database: process.env.DB,
});

const s_users = "select * from Applicant";
const s_admin = "select * from Admin";
const insertUser_query = "insert into Applicant (Name,Email,Location) values(?,?,?)";
const insertAdmin_query = "INSERT INTO Admin (name, email, password) VALUES (?, ?, ?)";
module.exports = { pool, s_users, insertUser_query, insertAdmin_query, s_admin };
