const { pool } = require("../model/dbPool");

exports.createContactForm = async (req, res) => {
    try {
        const { full_name, email, phone_number, how_can_we_help } = req.body;

        if (!full_name || !email || !phone_number || !how_can_we_help) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const sql = 'INSERT INTO ContactForm (full_name, email, phone_number, how_can_we_help) VALUES (?, ?, ?, ?)';
        const values = [full_name, email, phone_number, how_can_we_help];
       
        const [rows] = await pool.execute(sql, values);
      
        if (rows) {
            // console.log(rows.insertId);
            return res.status(200).json({ msg: "Form submitted successfully" });
        } else {
            console.log('Error creating contact form');
            return res.status(500).json({ msg: "Error creating contact form:" });
        }

    } catch (error) {
        console.error('Error creating contact form:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAllSubmissions = async (req, res) => {
    try {
      const sql = "SELECT * FROM ContactForm";
      const [rows] = await pool.execute(sql)
  
      if (rows) {
        // console.log(rows);
        return res.json(rows);
      }
      ;
    } catch (error) {
      console.log(error);
    }
  };
