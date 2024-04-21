const { pool } = require('../model/dbPool');

exports.calculateScoresAndRecommendations = async (req, res) => {
  try {
    const { userName, responses } = req.body;

    // Validation of responses
    if (!Array.isArray(responses) || responses.length === 0) {
      throw new Error("Invalid responses data.");
    }
    const query = "SELECT question_id, selected_option, category FROM questions";
    const [rows, fields] = await pool.query(query);

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
        case 'Openness to Experience':
          opennessScore += calculateOpennessScore(selectedOption);
          break;
        case 'Conscientiousness':
          conscientiousnessScore += calculateConscientiousnessScore(selectedOption);
          break;
        case 'Emotional Stability':
          emotionalStabilityScore += calculateEmotionalStabilityScore(selectedOption);
          break;
        case 'Agreeableness vs. Assertiveness':
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
    const opennessLearningTrack = recommendLearningTrack(opennessScore, 'Openness to Experience');
    const conscientiousnessLearningTrack = recommendLearningTrack(conscientiousnessScore, 'Conscientiousness');
    const emotionalStabilityLearningTrack = recommendLearningTrack(emotionalStabilityScore, 'Emotional Stability');
    const agreeablenessAssertivenessLearningTrack = recommendLearningTrack(agreeablenessAssertivenessScore, 'Agreeableness vs. Assertiveness');
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
    'Strongly Agree': 2,
    'Agree': 1.5,
    'Neutral': 1,
    'Disagree': 0.5,
    'Strongly Disagree': 0
  };
  return optionScores[selectedOption];
}

function calculateConscientiousnessScore(selectedOption) {
  const optionScores = {
    'Strongly Agree': 2,
    'Agree': 1.5,
    'Neutral': 1,
    'Disagree': 0.5,
    'Strongly Disagree': 0
  };
  return optionScores[selectedOption];
}

function calculateEmotionalStabilityScore(selectedOption) {
  const optionScores = {
    'Remain calm and focused, finding effective solutions.': 2,
    'Stay composed but may feel the pressure.': 1.5,
    'Sometimes feel overwhelmed, but manage to cope.': 1,
    'Often feel stressed and struggle to cope.': 0.5
  };
  return optionScores[selectedOption];
}

function calculateAgreeablenessAssertivenessScore(selectedOption) {
  const optionScores = {
    'Strongly Agree': 2,
    'Agree': 1.5,
    'Neutral': 1,
    'Disagree': 0.5,
    'Strongly Disagree': 0,
    'Actively seek resolutions and compromises.': 2,
    'Attempt to find a middle ground.': 1.5,
    'Tend to go along with the majority opinions.': 1,
    'Prefer to avoid conflicts.': 0

  };
  return optionScores[selectedOption];
}

function calculateImaginationScore(selectedOption) {
  const optionScores = {
    'Develop a mobile app that rewards users for recycling.': 2,
    'Redesign recycling bins to make them more visually appealing.': 1.5,
    'Create a marketing campaign emphasizing the environmental benefits.': 1,
    'Implement blockchain in supply chain management for product authenticity.': 1.5,
    'Develop a blockchain-based voting system for secure elections.': 2,
    'Create an app for tracking the origin of organic food using blockchain.': 1,
    'The character can change shape at will, adding an element of surprise.': 2,
    'Give the character a distinctive and expressive facial feature.': 1.5,
    'Incorporate a captivating backstory that players can explore': 1,
    'Develop a mobile app that optimizes smart home device usage.': 1.5,
    'Create a software program that learns user preferences and adjusts settings accordingly.': 1,
    'Design a product that harvests renewable energy for smart home devices.': 2,
    'Develop a gamified mobile app for interactive learning.': 1.5,
    'Create an online platform that adapts to each learner.': 2,
    'Use data analytics to identify optimal learning paths for individuals': 1

  };
  return optionScores[selectedOption];
}

function calculateTechnicalAptitudeScore(selectedOption) {
  const optionScores = {
    'Very comfortable, I enjoy exploring new software.': 2,
    'Somewhat comfortable, but I prefer familiar tools.': 1,
    'Not very comfortable, I struggle with new technology': 0.5,
    "Yes, I''ve created and customized programs or websites.": 2,
    "I've dabbled a bit but not extensively.": 1.5,
    "No, I haven't tried coding or web development.": 0,
    "I'm quite skilled at resolving technical problems.": 2,
    "I can manage some issues but prefer not to.": 1,
    'I find it challenging and usually seek help.': 0,
    "Absolutely, I love taking things apart and learning how they function.": 2,
    "I'm curious but don't often delve deeply into it.": 1,
    "Not particularly, I'm more interested in using technology.": 0.5,
    'I dive right in, experiment, and figure it out': 2,
    'I research and seek help if needed but try to solve it myself.': 1.5,
    'I usually ask someone else to handle it.': 0
  };
  return optionScores[selectedOption];
}

function calculateSkillsAssessmentScore(selectedOption) {
  const optionScores = {
    'Novice': 0,
    'Basic': 0.5,
    'Intermediate': 1,
    'Advanced': 2,
    'Expert': 2,
    'Unfamiliar': 0,
    'Proficient': 1.5,
    'Highly Proficient': 2,
    'Very comfortable': 2,
    'Moderately comfortable': 1,
    'Not comfortable': 0,
    "Yes, I'm experienced.": 2,
    "I have some experience.": 1,
    "No, I'm not skilled in this area.": 0,
    'Very confident': 2,
    'Moderately confident': 1,
    'Not confident': 0,
  };
  return optionScores[selectedOption];
}

function recommendLearningTrack(score, category) {
  switch (category) {
    case 'Openness to Experience':
      return recommendOpennessLearningTrack(score);
    case 'Conscientiousness':
      return recommendConscientiousnessLearningTrack(score);
    case 'Emotional Stability':
      return recommendEmotionalStabilityLearningTrack(score);
    case 'Agreeableness vs. Assertiveness':
      return recommendAgreeablenessAssertivenessLearningTrack(score);
    case 'Imagination':
      return recommendImaginationLearningTrack(score);
    case 'Technical Aptitude':
      return recommendTechnicalAptitudeLearningTrack(score);
    case 'Skills Assessment':
      return recommendSkillsAssessmentLearningTrack(score);
    default:
      return "No recommendation available";
  }
}

function recommendOpennessLearningTrack(score) {
  if (score >= 2) {
    return "Recommended learning track for Openness: Software Development, Blockchain";
  } else if (score >= 1.5) {
    return "Recommended learning track for Openness:  Mobile App Development";
  } else if (score >= 1) {
    return "Recommended learning track for Openness: Cyber Security";
  } else if (score >= 0.5) {
    return "Recommended learning track for Openness: Data Science";
  }
  else {
    return "Recommended learning track for Openness: Product Management";
  }
}


function recommendConscientiousnessLearningTrack(score) {
  if (score >= 2) {
    return "Recommended learning track for Conscientiousness: Software Development, Blockchain";
  } else if (score >= 1.5) {
    return "Recommended learning track for Conscientiousness: 3D Animation";
  } else if (score >= 1) {
    return "Recommended learning track for Conscientiousness: Product Design";
  } else if (score >= 0.5) {
    return "Recommended learning track for Conscientiousness: Product Design";
  }
  else {
    return "Recommended learning track for Conscientiousness: Cyber Security";
  }
}


function recommendEmotionalStabilityLearningTrack(score) {

  if (score >= 2) {
    return "Recommended learning track for Emotional Stability: Product Management, Data Science";
  } else if (score >= 1.5) {
    return "Recommended learning track for Emotional Stability: Software Development";
  } else if (score >= 1) {
    return "Recommended learning track for Emotional Stability: Blockchain";
  } else if (score >= 0.5) {
    return "Recommended learning track for Emotional Stability: Mobile App Development";
  }
  else {
    return "No recommendation available";
  }
}

function recommendAgreeablenessAssertivenessLearningTrack(score) {
  if (score >= 2) {
    return "Recommended learning track for Agreeableness/Assertiveness: Product Management, Product Design";
  } else if (score >= 1.5) {
    return "Recommended learning track for Agreeableness/Assertiveness: Software Development,Mobile App Development, ";
  } else if (score >= 1) {
    return "Recommended learning track for Agreeableness/Assertiveness: Data Science";
  } else if (score >= 0.5) {
    return "Recommended learning track for Agreeableness/Assertiveness: 3D Animation";
  } else {
    return "No recommendation available";
  }
}

function recommendImaginationLearningTrack(score) {
  if (score >= 2) {
    return "Recommended learning track for Imagination: Mobile App Development, Blockchain,  ";
  } else if (score >= 1.5) {
    return "Recommended learning track for Imagination: Software Development";
  } else if (score >= 1) {
    return "Recommended learning track for Imagination: Product Management";
  }
  else if (score >= 0.5) {
    return "Recommended learning track for Imagination: 3D Animation";
  }
  else {
    return "Recommended learning track for Imagination:  Game Development";
  }
}

function recommendTechnicalAptitudeLearningTrack(score) {
  if (score >= 2) {
    return "Recommended learning track for TechnicalAptitude: Software Development, Blockchain";
  } else if (score >= 1.5) {
    return "Recommended learning track for TechnicalAptitude: Mobile App Development";
  } else if (score >= 1) {
    return "Recommended learning track for TechnicalAptitude: Product Design";
  } else if (score >= 0.5) {
    return "Recommended learning track for TechnicalAptitude: User Experience (UX) Design";
  }
  else {
    return "Recommended learning track for TechnicalAptitude: Product Management";
  }
}
function recommendSkillsAssessmentLearningTrack(score) {
  if (score >= 2) {
    return "Recommended learning track for SkillsAssessment: Software Development, Mobile App Development";
  } else if (score >= 1.5) {
    return "Recommended learning track for SkillsAssessment: Cyber Security,";
  } else if (score >= 1) {
    return "Recommended learning track for SkillsAssessment: User Experience (UX) Design";
  } else if (score >= 0.5) {
    return "Recommended learning track for SkillsAssessment: 3D Design";
  }
  else {
    return "Recommendation available for SkillsAssessment: User Experience (UX) Design";
  }
}