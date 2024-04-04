const { pool } = require('../model/dbPool');

// Calculate scores and recommend learning tracks for mathematical aptitude and logical reasoning
exports.calculateMathLogicScoresAndRecommendations = async (req, res) => {
  try {
    const { userId, responses } = req.body;

    // Retrieve correct answers for mathematical aptitude and logical reasoning from the database
    const query = "SELECT question_id, correct_option, category FROM questions WHERE category IN ('Mathematical Aptitude', 'Logical Reasoning')";
    const [rows, fields] = await pool.query(query);

    // Initialize scores for mathematical aptitude and logical reasoning
    let mathScore = 0;
    let logicalScore = 0;

    // Calculate scores for mathematical aptitude and logical reasoning
    responses.forEach(response => {
      const { questionId, answer } = response;
      const { correctOption, category } = getQuestionInfo(rows, questionId);
      console.log(`Question ID: ${questionId}, Answer: ${answer}, Correct Option: ${correctOption}, Category: ${category}`);
      
      // Compare answers and update scores
      if (answer && correctOption && answer.toString() === correctOption.toString()) {
        if (category === 'Mathematical Aptitude') {
          mathScore++;
        } else if (category === 'Logical Reasoning') {
          logicalScore++;
        }
      }
    });

    // Recommend learning tracks based on scores for mathematical aptitude and logical reasoning
    const mathLearningTrack = recommendMathLearningTrack(mathScore);
    const logicalLearningTrack = recommendLogicalLearningTrack(logicalScore);

    // Return scores and recommended learning tracks
    res.json({ mathScore, logicalScore, mathLearningTrack, logicalLearningTrack });
  } catch (error) {
    console.error("Error calculating scores and recommendations:", error);
    res.status(500).json({ error: 'Error calculating scores and recommendations' });
  }
};

// Helper function to recommend learning track based on mathematical aptitude score
const recommendMathLearningTrack = (mathScore) => {
  let learningTrack = '';

  // Map math score to learning tracks
  if (mathScore >= 7) {
    learningTrack = 'Mobile App, Product Management, Cyber Security, Data Science';
  } else if (mathScore >= 4) {
    learningTrack = 'Software Development, Blockchain, Mobile Application';
  } else {
    learningTrack = ' 3D Animation Skills, Product Design';
  }

  return learningTrack;
};

// Helper function to recommend learning track based on logical reasoning score
const recommendLogicalLearningTrack = (logicalScore) => {
  let learningTrack = '';

  // Map logical reasoning score to learning tracks
  if (logicalScore >= 7) {
    learningTrack = 'Software Development, Blockchain, Cyber Security, Data Science';
  } else if (logicalScore >= 4) {
    learningTrack = '3D Animation Skills, Product Design, Software Development, Mobile Application';
  } else {
    learningTrack = 'Mobile App, Product Management';
  }

  return learningTrack;
};

// Helper function to get the correct option and category for a question
const getQuestionInfo = (rows, questionId) => {
    // Parse questionId to an integer if necessary
    const parsedQuestionId = parseInt(questionId);
  
    // Find question with matching parsedQuestionId
    const question = rows.find(row => row.question_id === parsedQuestionId);
    return question ? { correctOption: question.correct_option, category: question.category } : { correctOption: null, category: null };
  };
  
  
  