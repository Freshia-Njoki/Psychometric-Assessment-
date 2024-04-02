const { pool } = require('../model/dbPool');

// Calculate scores and recommend learning tracks for mathematical aptitude
exports.calculateMathScoresAndRecommendations = async (req, res) => {
  try {
    const { userId, responses } = req.body;

    // Retrieve correct answers for mathematical aptitude from the database
    const query = "SELECT question_id, correct_option FROM questions WHERE category = 'Mathematical Aptitude'";
    const [rows, fields] = await pool.query(query);

    // Initialize score for mathematical aptitude
    let mathScore = 0;

    // Calculate mathematical aptitude score
    responses.forEach(response => {
      const { questionId, answer } = response;
      const correctOption = getCorrectOption(rows, questionId);
      console.log(`Question ID: ${questionId}, Answer: ${answer}, Correct Option: ${correctOption}`);
      
      // Parse the answer appropriately to match the correct option
      if (answer && correctOption !== null && parseAnswer(answer) === correctOption) {
        mathScore++;
      }
    });

    // Recommend learning track based on mathematical aptitude score
    const learningTrack = recommendMathLearningTrack(mathScore);

    // Return mathematical aptitude score and recommended learning track
    res.json({ mathScore, learningTrack });
  } catch (error) {
    console.error("Error calculating mathematical aptitude scores and recommendations:", error);
    res.status(500).json({ error: 'Error calculating mathematical aptitude scores and recommendations' });
  }
};

// Helper function to parse different types of answers
const parseAnswer = (answer) => {
  // Remove non-numeric characters and parse to integer
  const parsedAnswer = parseInt(answer.replace(/\D/g, ''));

  // If the parsed answer is a valid number, return it; otherwise, return null
  return isNaN(parsedAnswer) ? null : parsedAnswer;
};

// Helper function to recommend learning track based on mathematical aptitude score
const recommendMathLearningTrack = (mathScore) => {
  let learningTrack = '';

  // Map math score to learning tracks
  if (mathScore >= 5) {
    learningTrack = 'Advanced Mathematics';
  } else if (mathScore >= 3) {
    learningTrack = 'Intermediate Mathematics';
  } else if (mathScore >= 1) {
    learningTrack = 'Basic Mathematics';
  }

  return learningTrack;
};

// Helper function to get the correct option for a question
const getCorrectOption = (rows, questionId) => {
  const question = rows.find(row => row.question_id === questionId);
  return question ? parseInt(question.correct_option) : null;
};
