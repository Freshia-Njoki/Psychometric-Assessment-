const mysql = require('mysql2/promise');
const pool = mysql.createPool({
    connectionLimit:10,
    host:'bomly9vaod29f7smwubk-mysql.services.clever-cloud.com',
    user:'umwbdzyqdnulexem',
    password:'GYhcTCLySUEMMmdToHCk',
    database:'bomly9vaod29f7smwubk',
})

const s_users = "select * from Applicant";
const s_admin = "select * from Admin";
const insertUser_query = "insert into Applicant (Name,Email) values(?,?)";
const insertAdmin_query = "INSERT INTO Admin (name, email, password) VALUES (?, ?, ?)"
module.exports ={pool,s_users,insertUser_query, insertAdmin_query, s_admin}
