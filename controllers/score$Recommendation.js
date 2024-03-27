const { pool } = require('../model/dbPool');

// Calculate scores and recommend learning tracks
exports.calculateScoresAndRecommendations = async (req, res) => {
  try {
    const { userId, responses } = req.body;

    // Retrieve correct answers from the database
    const query = "SELECT question_id, correct_option, category FROM questions";
    const [rows, fields] = await pool.query(query);

    // Initialize scores for different cognitive abilities
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
      const correctOption = getCorrectOption(rows, questionId);
      if (answer === correctOption) {
        const category = getCategory(rows, questionId);
        switch (category) {
          case 'Mathematical Aptitude':
            mathScore++;
            break;
          case 'Logical Reasoning':
            logicalScore++;
            break;
          // Add cases for other cognitive abilities
          default:
            break;
        }
      }
    });

    // Recommend learning tracks based on scores
    const learningTracks = recommendLearningTracks(mathScore, logicalScore /* Add scores for other cognitive abilities */);

    // Return scores and recommended learning tracks
    res.json({ mathScore, logicalScore, learningTracks });
  } catch (error) {
    console.error("Error calculating scores and recommendations:", error);
    res.status(500).json({ error: 'Error calculating scores and recommendations' });
  }
};

// Helper function to get the correct option for a question
const getCorrectOption = (rows, questionId) => {
  const question = rows.find(row => row.question_id === questionId);
  return question ? question.correct_option : null;
};

// Helper function to get the category of a question
const getCategory = (rows, questionId) => {
  const question = rows.find(row => row.question_id === questionId);
  return question ? question.category : null;
};

// Helper function to recommend learning tracks based on scores
// Helper function to recommend learning tracks based on scores
const recommendLearningTracks = (mathScore, logicalScore, /* Add scores for other cognitive abilities */) => {
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
  
