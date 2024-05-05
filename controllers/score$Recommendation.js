const { pool } = require('../model/dbPool');
exports.calculateScoresAndRecommendations = async (req, res) => {
  try {
    const { responses } = req.body;

    // Validation of responses
    if (!Array.isArray(responses) || responses.length === 0) {
      throw new Error("Invalid responses data.");
    }
    const query = "SELECT question_id, selected_option, category FROM questions";
    const [rows, fields] = await pool.query(query);

    let totalScore = 0;

    // Calculate total score for all categories based on selected options
    responses.forEach(response => {
      const { questionId, selectedOption } = response;
      const category = getCategory(rows, questionId);
      totalScore += calculateScore(selectedOption, category);
    });

    // Recommend learning track based on total score
    const recommendedTrack = recommendLearningTrack(totalScore);

    // Send response with total score and recommended learning track
    res.json({
      totalScore,
      recommendedTrack
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

// Function to calculate score for each category
function calculateScore(selectedOption, category) {
  switch (category) {
    case 'Openness to Experience':
      return calculateOpennessScore(selectedOption);
    case 'Conscientiousness':
      return calculateConscientiousnessScore(selectedOption);
    case 'Emotional Stability':
      return calculateEmotionalStabilityScore(selectedOption);
    case 'Agreeableness vs. Assertiveness':
      return calculateAgreeablenessAssertivenessScore(selectedOption);
    case 'Imagination':
      return calculateImaginationScore(selectedOption);
    case 'Technical Aptitude':
      return calculateTechnicalAptitudeScore(selectedOption);
    case 'Skills Assessment':
      return calculateSkillsAssessmentScore(selectedOption);
    default:
      return 0;
  }
}

// Function to recommend learning track based on total score
function recommendLearningTrack(totalScore) {
  if (totalScore >= 35) {
    return "Recommended learning track: Software Development, Blockchain";
  } else if (totalScore >= 28) {
    return "Recommended learning track: Product Management, Product Design";
  } else if (totalScore >= 24) {
    return "Recommended learning track: Mobile App Development";
  } else if (totalScore >= 20) {
    return "Recommended learning track: Data Science";
  } else if (totalScore >= 16) {
    return "Recommended learning track: Cyber Security";
  } else if (totalScore >= 12) {
    return "Recommended learning track: 3D Animation";
  } else if (totalScore >= 8) {
    return "Recommended learning track: User Experience (UX) Design";
  } else {
    return "No recommendation available";
  }
}

function calculateOpennessScore(selectedOption) {
  const optionScores = {
    'Strongly Agree': 5,
    'Agree': 4,
    'Neutral': 3,
    'Disagree': 2,
    'Strongly Disagree': 1
  };
  return optionScores[selectedOption];
}

function calculateConscientiousnessScore(selectedOption) {
  const optionScores = {
    'Strongly Agree': 5,
    'Agree': 4,
    'Neutral': 3,
    'Disagree': 2,
    'Strongly Disagree': 1
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
    'Strongly Agree': 5,
    'Agree': 4,
    'Neutral': 3,
    'Disagree': 2,
    'Strongly Disagree': 1,
    'Actively seek resolutions and compromises.': 4,
    'Attempt to find a middle ground.': 3,
    'Tend to go along with the majority opinions.': 2,
    'Prefer to avoid conflicts.': 1

  };
  return optionScores[selectedOption];
}

function calculateImaginationScore(selectedOption) {
  const optionScores = {
    'Develop a mobile app that rewards users for recycling.': 5,
    'Redesign recycling bins to make them more visually appealing.': 4,
    'Create a marketing campaign emphasizing the environmental benefits.': 3,
    'Implement blockchain in supply chain management for product authenticity.': 5,
    'Develop a blockchain-based voting system for secure elections.': 4,
    'Create an app for tracking the origin of organic food using blockchain.': 3,
    'The character can change shape at will, adding an element of surprise.': 5,
    'Give the character a distinctive and expressive facial feature.': 4,
    'Incorporate a captivating backstory that players can explore': 3,
    'Develop a mobile app that optimizes smart home device usage.': 5,
    'Create a software program that learns user preferences and adjusts settings accordingly.': 4,
    'Design a product that harvests renewable energy for smart home devices.': 3,
    'Develop a gamified mobile app for interactive learning.': 5,
    'Create an online platform that adapts to each learner.': 4,
    'Use data analytics to identify optimal learning paths for individuals': 3

  };
  return optionScores[selectedOption];
}

function calculateTechnicalAptitudeScore(selectedOption) {
  const optionScores = {
    'Very comfortable, I enjoy exploring new software.': 5,
    'Somewhat comfortable, but I prefer familiar tools.': 4,
    'Not very comfortable, I struggle with new technology': 3,
    "Yes, I''ve created and customized programs or websites.": 5,
    "I've dabbled a bit but not extensively.": 4,
    "No, I haven't tried coding or web development.": 3,
    "I'm quite skilled at resolving technical problems.": 5,
    "I can manage some issues but prefer not to.": 4,
    'I find it challenging and usually seek help.': 3,
    "Absolutely, I love taking things apart and learning how they function.": 5,
    "I'm curious but don't often delve deeply into it.": 4,
    "Not particularly, I'm more interested in using technology.": 3,
    'I dive right in, experiment, and figure it out': 5,
    'I research and seek help if needed but try to solve it myself.': 4,
    'I usually ask someone else to handle it.': 3
  };
  return optionScores[selectedOption];
}

function calculateSkillsAssessmentScore(selectedOption) {
  const optionScores = {
    'Novice': 1,
    'Basic': 2,
    'Intermediate': 3,
    'Advanced': 4,
    'Expert': 5,
    'Unfamiliar': 1,
    'Proficient': 3,
    'Highly Proficient': 5,
    'Very comfortable': 5,
    'Moderately comfortable': 3,
    'Not comfortable': 1,
    "Yes, I'm experienced.": 5,
    "I have some experience.": 3,
    "No, I'm not skilled in this area.": 1,
    'Very confident': 5,
    'Moderately confident': 3,
    'Not confident': 1,
  };
  return optionScores[selectedOption];
}
