const { pool } = require("../model/dbPool");

const createContactForm = async (req, res) => {
    try {
        const { full_name, email, phone_number, how_can_we_help } = req.body;

        if (!full_name || !email || !phone_number || !how_can_we_help) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Insert the contact form data into the database
        const sql = 'INSERT INTO ContactForm (full_name, email, phone_number, how_can_we_help) VALUES (?, ?, ?, ?)';
        pool.query(sql, [full_name, email, phone_number, how_can_we_help], (err, result) => {
            if (err) {
                console.error('Error creating contact form:', err);
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.status(200).json({ message: 'Contact form submitted successfully' });
            }
        });
    } catch (error) {
        console.error('Error creating contact form:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { createContactForm };
