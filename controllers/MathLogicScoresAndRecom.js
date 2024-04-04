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
  if (mathScore >= 8) {
    learningTrack = 'Software Development, Data Science, Blockchain';
  } else if (mathScore >= 6) {
    learningTrack = 'Software Development, Mobile App Development';
  } else if (mathScore >= 4) {
    learningTrack = 'Product Management, Web Development';
  } else if (mathScore >= 1) {
    learningTrack = 'Product Design, Cyber Security,  3D Animation Skills';
  }

  return learningTrack;
};

// Helper function to recommend learning track based on logical reasoning score
const recommendLogicalLearningTrack = (logicalScore) => {
  let learningTrack = '';

  // Map logical reasoning score to learning tracks
  if (logicalScore >= 8) {
    learningTrack = 'Software Engineering, Data Analysis, Research';
  } else if (logicalScore >= 6) {
    learningTrack = 'Software Engineering, System Architecture';
  } else if (logicalScore >= 4) {
    learningTrack = 'Project Management, Quality Assurance';
  } else if (logicalScore >= 1) {
    learningTrack = 'Technical Writing, UI/UX Design';
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
  
  
  