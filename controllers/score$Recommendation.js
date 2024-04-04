const { pool } = require('../model/dbPool');

// Calculate scores and recommend learning tracks for all categories
exports.calculateScoresAndRecommendations = async (req, res) => {
  try {
    const { userId, responses } = req.body;

    // Retrieve questions and categories from the database
    const query = "SELECT question_id, correct_option, category FROM questions";
    const [rows, fields] = await pool.query(query);

    // Initialize scores for all categories
    let mathScore = 0;
    let logicalScore = 0;
    let opennessScore = 0;
    let conscientiousnessScore = 0;
    let emotionalStabilityScore = 0;
    let agreeablenessAssertivenessScore = 0;
    let creativityScore = 0;

    // Calculate scores
    responses.forEach(response => {
      const { questionId, answer } = response;
      const category = getCategory(rows, questionId);
      
      switch (category) {
        case 'Mathematical Aptitude':
          mathScore += calculateScoreForMathematicalAptitude(answer, getCorrectOption(rows, questionId));
          break;
        case 'Logical Reasoning':
          logicalScore += calculateScoreForLogicalReasoning(answer, getCorrectOption(rows, questionId));
          break;
        case 'Openness':
          opennessScore += calculateScoreForOpenness(answer, getCorrectOption(rows, questionId));
          break;
        case 'Conscientiousness':
          conscientiousnessScore += calculateScoreForConscientiousness(answer, getCorrectOption(rows, questionId));
          break;
        case 'Emotional Stability':
          emotionalStabilityScore += calculateScoreForEmotionalStability(answer, getCorrectOption(rows, questionId));
          break;
        case 'Agreeableness/Assertiveness':
          agreeablenessAssertivenessScore += calculateScoreForAgreeablenessAssertiveness(answer, getCorrectOption(rows, questionId));
          break;
        case 'Creativity':
          creativityScore += calculateScoreForCreativity(answer, getCorrectOption(rows, questionId));
          break;
        // Add cases for other categories
        default:
          break;
      }
    });

    // Recommend learning tracks based on scores for each category
    const learningTracks = recommendLearningTracks(mathScore, logicalScore, opennessScore, conscientiousnessScore, emotionalStabilityScore, agreeablenessAssertivenessScore, creativityScore);

    // Return scores and recommended learning tracks
    res.json({ mathScore, logicalScore, opennessScore, conscientiousnessScore, emotionalStabilityScore, agreeablenessAssertivenessScore, creativityScore, learningTracks });
  } catch (error) {
    console.error("Error calculating scores and recommendations:", error);
    res.status(500).json({ error: 'Error calculating scores and recommendations' });
  }
};

// Helper function to calculate score for Mathematical Aptitude
const calculateScoreForMathematicalAptitude = (answer, correctOption) => {
  return answer === correctOption ? 1 : 0;
};

// Helper function to calculate score for Logical Reasoning
const calculateScoreForLogicalReasoning = (answer, correctOption) => {
  return answer === correctOption ? 1 : 0;
};

// Helper function to calculate score for Openness
const calculateScoreForOpenness = (answer, correctOption) => {
  return answer === correctOption ? 1 : 0;
};

// Helper function to calculate score for Conscientiousness
const calculateScoreForConscientiousness = (answer, correctOption) => {
  return answer === correctOption ? 1 : 0;
};

// Helper function to calculate score for Emotional Stability
const calculateScoreForEmotionalStability = (answer, correctOption) => {
  return answer === correctOption ? 1 : 0;
};

// Helper function to calculate score for Agreeableness/Assertiveness
const calculateScoreForAgreeablenessAssertiveness = (answer, correctOption) => {
  return answer === correctOption ? 1 : 0;
};

// Helper function to calculate score for Creativity
const calculateScoreForCreativity = (answer, correctOption) => {
  return answer === correctOption ? 1 : 0;
};

// Helper function to get the category of a question
const getCategory = (rows, questionId) => {
  const question = rows.find(row => row.question_id === questionId);
  return question ? question.category : null;
};

// Helper function to get the correct option for a question
const getCorrectOption = (rows, questionId) => {
  const question = rows.find(row => row.question_id === questionId);
  return question ? parseInt(question.correct_option) : null;
};

// Helper function to recommend learning tracks based on scores
const recommendLearningTracks = (mathScore, logicalScore, opennessScore, conscientiousnessScore, emotionalStabilityScore, agreeablenessAssertivenessScore, creativityScore) => {
  const learningTracks = [];
  
  // Map math score to learning tracks
  if (mathScore >= 5) {
    learningTracks.push('Advanced Mathematics');
  } else if (mathScore >= 3) {
    learningTracks.push('Intermediate Mathematics');
  } else if (mathScore >= 1) {
    learningTracks.push('Basic Mathematics');
  }
  
  // Map logical reasoning score to learning tracks
  if (logicalScore >= 5) {
    learningTracks.push('Advanced Logical Reasoning');
  } else if (logicalScore >= 3) {
    learningTracks.push('Intermediate Logical Reasoning');
  } else if (logicalScore >= 1) {
    learningTracks.push('Basic Logical Reasoning');
  }
  
  // Add similar logic for other cognitive abilities
  
  return learningTracks;
};
