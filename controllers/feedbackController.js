const { pool } = require("../model/dbPool");

exports.Feedback = async (req, res) => {
    try {
        const { feedback } = req.body;

        const sql = 'INSERT INTO Feedback (feedback) VALUES (?)';
        const values = [feedback];
       
        const [rows] = await pool.execute(sql, values);
      
        if (rows) {
            // console.log(rows.insertId);
            return res.status(200).json({ msg: "Feedback sent successfully" });
        } else {
            return res.status(500).json({ msg: "Error ocurred when sending feedback:" });
        }

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAllFeedback = async (req, res) => {
    try {
      const sql = "SELECT * FROM Feedback";
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
