const { pool } = require('../model/dbPool');

exports.submitAssessment = async (req, res) => {
  try {
    const { userId, responses } = req.body;

    // Retrieve correct answers from the database
    const query = "SELECT question_id, correct_option FROM questions";
    const [rows, fields] = await pool.query(query);

    // Create a map of question IDs to correct options
    const correctAnswers = {};
    rows.forEach(row => {
      correctAnswers[row.question_id] = row.correct_option;
    });

    // Calculate score and check correctness of each response
let score = 0;
const result = responses.map(response => {
  const { questionId, answer } = response;
  // Retrieve the correct option using the question ID provided by the user
  const correctOption = correctAnswers[questionId]; // Use questionId instead of row.question_id
  console.log(`Question ID: ${questionId}, Answer: ${answer}, Correct Option: ${correctOption}`);
  const isCorrect = answer === correctOption;
  if (isCorrect) {
    score++;
  }
  return { questionId, answer, correctOption, isCorrect };
});


    // Store submission data in the database if needed
    // Example: Save userId, responses, and score in a submissions table

    // Return the result and score
    res.json({ result, score });
  } catch (error) {
    console.error("Error submitting assessment:", error);
    res.status(500).json({ error: 'Error submitting assessment answer' });
  }
};
