const { pool } = require('../model/dbPool');

exports.calculateScoresAndRecommendations = async (req, res) => {
  try {
    const { userId, responses } = req.body;

    // Validation of responses
    if (!Array.isArray(responses) || responses.length === 0) {
      throw new Error("Invalid responses data.");
    }

    // Retrieve questions from the database
    const query = "SELECT question_id, selected_option, category FROM questions";
    const [rows, fields] = await pool.query(query);

    // Initialize scores for each category
    let opennessScore = 0;
    let conscientiousnessScore = 0;
    let emotionalStabilityScore = 0;
    let agreeablenessAssertivenessScore = 0;
    let imaginationScore = 0;
    let technicalAptitudeScore = 0;
    let skillsAssessmentScore = 0;
    // Calculate scores for each category based on selected options
    responses.forEach(response => {
      const { questionId, selectedOption } = response;
      const category = getCategory(rows, questionId);

      switch (category) {
        case 'Openness':
          opennessScore += calculateOpennessScore(selectedOption);
          break;
        case 'Conscientiousness':
          conscientiousnessScore += calculateConscientiousnessScore(selectedOption);
          break;
        case 'Emotional Stability':
          emotionalStabilityScore += calculateEmotionalStabilityScore(selectedOption);
          break;
        case 'Agreeableness/Assertiveness':
          agreeablenessAssertivenessScore += calculateAgreeablenessAssertivenessScore(selectedOption);
          break;
        case 'Imagination':
          imaginationScore += calculateImaginationScore(selectedOption);
          break;
        case 'Technical Aptitude':
          technicalAptitudeScore += calculateTechnicalAptitudeScore(selectedOption);
          break;
        case 'Skills Assessment':
          skillsAssessmentScore += calculateSkillsAssessmentScore(selectedOption);
          break;
        default:
          break;
      }
    });

    // Recommend learning tracks for each category based on scores
    const opennessLearningTrack = recommendLearningTrack(opennessScore, 'Openness');
    const conscientiousnessLearningTrack = recommendLearningTrack(conscientiousnessScore, 'Conscientiousness');
    const emotionalStabilityLearningTrack = recommendLearningTrack(emotionalStabilityScore, 'Emotional Stability');
    const agreeablenessAssertivenessLearningTrack = recommendLearningTrack(agreeablenessAssertivenessScore, 'Agreeableness/Assertiveness');
    const imaginationLearningTrack = recommendLearningTrack(imaginationScore, 'Imagination');
    const technicalAptitudeLearningTrack = recommendLearningTrack(technicalAptitudeScore, 'Technical Aptitude');
    const skillsAssessmentLearningTrack = recommendLearningTrack(skillsAssessmentScore, 'Skills Assessment');

    // Send response with scores and recommended learning tracks
    res.json({
      opennessScore,
      conscientiousnessScore,
      emotionalStabilityScore,
      agreeablenessAssertivenessScore,
      imaginationScore,
      technicalAptitudeScore,
      skillsAssessmentScore,
      opennessLearningTrack,
      conscientiousnessLearningTrack,
      emotionalStabilityLearningTrack,
      agreeablenessAssertivenessLearningTrack,
      imaginationLearningTrack,
      technicalAptitudeLearningTrack,
      skillsAssessmentLearningTrack
    });
  } catch (error) {
    console.error("Error calculating scores:", error);
    res.status(500).json({ error: "An error occurred while calculating scores." });
  }
};

// Helper function to get category of a question
function getCategory(questions, questionId) {
  const question = questions.find(q => q.question_id === questionId);
  return question ? question.category : null;
}

function calculateOpennessScore(selectedOption) {
  const optionScores = {
    'A': 2,
    'B': 1,
    'C': 0,
    'D': 0,
    'E': 0
  };
  return optionScores[selectedOption];
}

function calculateConscientiousnessScore(selectedOption) {
  const optionScores = {
    'A': 2,
    'B': 1,
    'C': 0,
    'D': 0,
    'E': 0
  };
  return optionScores[selectedOption];
}

function calculateEmotionalStabilityScore(selectedOption) {
  const optionScores = {
    'A': 2,
    'B': 1,
    'C': 0,
    'D': 0
  };
  return optionScores[selectedOption];
}

function calculateAgreeablenessAssertivenessScore(selectedOption) {
  const optionScores = {
    'A': 2,
    'B': 1,
    'C': 0,
    'D': 0,
    'E': 0
  };
  return optionScores[selectedOption];
}

function calculateImaginationScore(selectedOption) {
  const optionScores = {
    'A': 2,
    'B': 1,
    'C': 0
  };
  return optionScores[selectedOption];
}

function calculateTechnicalAptitudeScore(selectedOption) {
  const optionScores = {
    'A': 2,
    'B': 1,
    'C': 0
  };
  return optionScores[selectedOption];
}

function calculateSkillsAssessmentScore(selectedOption) {
  const optionScores = {
    'A': 2,
    'B': 1,
    'C': 0,
    'D': 0,
    'E': 0
  };
  return optionScores[selectedOption];
}

function recommendLearningTrack(score, category) {
  switch (category) {
    case 'Openness':
      return recommendOpennessLearningTrack(score);
    case 'Conscientiousness':
      return recommendConscientiousnessLearningTrack(score);
    case 'Emotional Stability':
      return recommendEmotionalStabilityLearningTrack(score);
    case 'Agreeableness/Assertiveness':
      return recommendAgreeablenessAssertivenessLearningTrack(score);
    case 'Imagination':
      return recommendImaginationLearningTrack(score);
      case 'Imagination':
      return recommendTechnicalAptitudeLearningTrack(score);
      case 'Imagination':
      return recommendSkillsAssessmentLearningTrack(score);
    default:
      return "No recommendation available";
  }
}

function recommendOpennessLearningTrack(score) {
  if (score >= 2) {
    return "Recommended learning track for Openness: Software Development, Blockchain, Mobile App Development, Cyber Security, Data Science";
  } else if (score >= 1) {
    return "Recommended learning track for Openness: 3D Animation, Product Design";
  } else {
    return "Recommended learning track for Openness: Product Management, Mobile App Development";
  }
}

function recommendConscientiousnessLearningTrack(score) {
  if (score >= 2) {
    return "Recommended learning track for Conscientiousness: Software Development, Blockchain, 3D Animation, Product Design";
  } else if (score >= 1) {
    return "Recommended learning track for Conscientiousness: Product Management, Mobile App Development";
  } else {
    return "Recommended learning track for Conscientiousness: Cyber Security, Data Science, Software Development, Mobile App Development";
  }
}


function recommendEmotionalStabilityLearningTrack(score) {
  switch (score) {
    case 'A':
      return "Recommended learning track for Emotional Stability: Product Management, Data Science, Software Development, Blockchain, Mobile App Development";
    case 'B':
      return "Recommended learning track for Emotional Stability: Software Development, Mobile App Development, 3D Animation, Product Design";
    case 'C':
      return "Recommended learning track for Emotional Stability: Software Development, Product Design, Product Management, Mobile App Development";
    case 'D':
      return "Recommended learning track for Emotional Stability: Cyber Security, Blockchain Engineering, Data Science";
    default:
      return "No recommendation available";
  }
}

function recommendAgreeablenessAssertivenessLearningTrack(score) {
  switch (score) {
    case 'A':
      return "Recommended learning track for Agreeableness/Assertiveness: Product Management, Product Design, Cyber Security, Blockchain Engineering, Software Development, Mobile App Development";
    case 'B':
      return "Recommended learning track for Agreeableness/Assertiveness: Mobile App Development, Software Development";
    case 'C':
      return "Recommended learning track for Agreeableness/Assertiveness: 3D Animation, Data Science";
    case 'D':
      return "Recommended learning track for Agreeableness/Assertiveness: 3D Animation, Data Science";
    default:
      return "No recommendation available";
  }
}

function recommendImaginationLearningTrack(score) {
  if (score >= 2) {
      return "Recommended learning track for Imagination: Mobile App Development, Blockchain,  3D Animation";
  } else if (score >= 1) {
      return "Recommended learning track for Imagination: Product Design, Mobile App Development,  3D Animation,  Product Management, Software Development";
  } else {
      return "Recommended learning track for Imagination:  Product Management, Blockchain, Game Development,  Data Science";
  }
}

function recommendTechnicalAptitudeLearningTrack(score) {
  if (score >= 2) {
    return "Recommended learning track for TechnicalAptitude: Software Development, Blockchain, 3D Animation, Product Design, Mobile App Development";
  } else if (score >= 1) {
    return "Recommended learning track for TechnicalAptitude: User Experience (UX) Design";
  } else {
    return "Recommended learning track for TechnicalAptitude: Cyber Security, Data Science, Product Management, Mobile App Development";
  }
}
  function recommendSkillsAssessmentLearningTrack(score) {
    if (score >= 2) {
      return "Recommended learning track for SkillsAssessment: Software Development, Product Management, Mobile App Development";
    } else if (score >= 1) {
      return "Recommended learning track for SkillsAssessment: 3D Animation Skills, Product Design,";
    } else {
      return "Recommendation available for SkillsAssessment: Cyber Security, Data Science";
    }
  }