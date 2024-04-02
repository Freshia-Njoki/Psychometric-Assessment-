const { pool } = require('../model/dbPool');

// Get all questions
exports.getAllQuestions = (req, res) => {
  try {
    const query = "SELECT * FROM questions";
    pool.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error retrieving questions' });
      }
      res.json(results);
    });
  } catch (error) {
    console.log(error);
  }
};

// Create a new question
exports.createQuestion = (req, res) => {
  const { image_path, question_text, option1, option2, option3, option4, correct_option, category } = req.body;
  const query = "INSERT INTO questions (image_path, question_text, option1, option2, option3, option4, correct_option, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  pool.query(query, [image_path, question_text, option1, option2, option3, option4, correct_option, category], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error creating question' });
    }
    res.status(201).json({ message: 'Question created successfully', id: result.insertId });
  });
};

// Get a question by ID
exports.getQuestionById = (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM questions WHERE question_id = ?";
  pool.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error retrieving question' });
    }
    if (!result || result.length === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }
    res.json(result[0]);
  });
};

// Update a question
exports.updateQuestion = (req, res) => {
  const { id } = req.params;
  const { image_path, question_text, option1, option2, option3, option4, correct_option, category } = req.body;
  const query = "UPDATE questions SET image_path = ?, question_text = ?, option1 = ?, option2 = ?, option3 = ?, option4 = ?, correct_option = ?, category = ? WHERE question_id = ?";
  pool.query(query, [image_path, question_text, option1, option2, option3, option4, correct_option, category, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error updating question' });
    }
    res.json({ message: 'Question updated successfully' });
  });
};

// Delete a question
exports.deleteQuestion = (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM questions WHERE question_id = ?";
  pool.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error deleting question' });
    }
    res.json({ message: 'Question deleted successfully' });
  });
};
