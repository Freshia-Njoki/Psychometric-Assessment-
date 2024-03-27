const { pool } = require("../model/dbPool");


const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const sql = 'INSERT INTO admins (name, email, password) VALUES (?, ?, ?)';
    db.query(sql, [name, email, hashedPassword], (err, result) => {
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

module.exports = {createAdmin}


