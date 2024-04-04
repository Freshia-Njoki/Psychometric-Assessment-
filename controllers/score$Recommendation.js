const { pool } = require('../model/dbPool');

const getCorrectOption = (questions, questionId) => {
  const question = questions.find(q => q.question_id === questionId);
  return question ? question.correct_option : null;
};

// Calculate scores and recommend learning tracks for all categories
exports.calculateScoresAndRecommendations = async (req, res) => {
  try {
    const { userId, responses } = req.body;

    if (!Array.isArray(responses)) {
      throw new Error("Responses field is missing or not an array.");
    }

    if (responses.length === 0) {
      throw new Error("Responses array is empty.");
    }

    const query = "SELECT question_id, correct_option, category FROM questions";
    const [rows, fields] = await pool.query(query);

    let mathScore = 0;
    let logicalScore = 0;
    let opennessScore = 0;
    let conscientiousnessScore = 0;
    let emotionalStabilityScore = 0;
    let agreeablenessAssertivenessScore = 0;
    let creativityScore = 0;

    responses.forEach(response => {
      const { questionId, answer, selectedOption } = response;
      const category = getCategory(rows, questionId);
      
      // Retrieve the correct option for the question
      const correctOption = getCorrectOption(rows, questionId);
      console.log(`Question ID: ${questionId}, Answer: ${answer}, Correct Option: ${correctOption}`);

      if (correctOption !== null) {
        const parsedAnswer = answer.toString();
        const parsedCorrectOption = correctOption.toString();

        // Use strict comparison to compare parsed values
        if (parsedAnswer === parsedCorrectOption) {
          if (category === 'Mathematical Aptitude' || category === 'Logical Reasoning') {
            mathScore++;
          }
        }
      } else {
        console.error(`Correct option not found for question ID ${questionId}`);
      }

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
        case 'Creativity':
          creativityScore += calculateCreativityScore(selectedOption);
          break;
        default:
          break;
      }
    });

    const mathLearningTrack = recommendLearningTrack(mathScore, 'Mathematical Aptitude');
    const logicalLearningTrack = recommendLearningTrack(logicalScore, 'Logical Reasoning');
    const opennessLearningTrack = recommendLearningTrack(opennessScore, 'Openness');
    const conscientiousnessLearningTrack = recommendLearningTrack(conscientiousnessScore, 'Conscientiousness');
    const emotionalStabilityLearningTrack = recommendLearningTrack(emotionalStabilityScore, 'Emotional Stability');
    const agreeablenessAssertivenessLearningTrack = recommendLearningTrack(agreeablenessAssertivenessScore, 'Agreeableness/Assertiveness');
    const creativityLearningTrack = recommendLearningTrack(creativityScore, 'Creativity');

    res.json({
      mathScore, logicalScore, opennessScore, conscientiousnessScore,
      emotionalStabilityScore, agreeablenessAssertivenessScore, creativityScore,
      mathLearningTrack, logicalLearningTrack, opennessLearningTrack,
      conscientiousnessLearningTrack, emotionalStabilityLearningTrack,
      agreeablenessAssertivenessLearningTrack, creativityLearningTrack
    });
  } catch (error) {
    console.error("Error calculating scores:", error);
    res.status(500).json({ error: "An error occurred while calculating scores." });
  }
};

function getCategory(questions, questionId) {
  const question = questions.find(q => q.question_id === questionId);
  return question ? question.category : null;
}

function calculateOpennessScore(selectedOption) {
  const optionScores = {
    'A': 2,
    'B': 1,
    'C': 0,
    'D': 1,
    'E': 2
  };
  return optionScores[selectedOption];
}

function calculateConscientiousnessScore(selectedOption) {
  const optionScores = {
    'A': 2,
    'B': 1,
    'C': 0,
    'D': -1,
    'E': -2
  };
  return optionScores[selectedOption];
}

function calculateEmotionalStabilityScore(selectedOption) {
  const optionScores = {
    'A': 2,
    'B': 1,
    'C': 0,
    'D': -1
  };
  return optionScores[selectedOption];
}

function calculateAgreeablenessAssertivenessScore(selectedOption) {
  const optionScores = {
    'A': 2,
    'B': 1,
    'C': 0,
    'D': -1,
    'E': -2
  };
  return optionScores[selectedOption];
}

function calculateCreativityScore(selectedOption) {
  const optionScores = {
    'A': 2,
    'B': 1,
    'C': 0
  };
  return optionScores[selectedOption];
}

function recommendLearningTrack(score, category) {
  switch (category) {
    case 'Mathematical Aptitude':
      return score >= 1 ? "Recommended learning track for Mathematical Aptitude" : "No recommendation for Mathematical Aptitude";
    case 'Logical Reasoning':
      return score >= 1 ? "Recommended learning track for Logical Reasoning" : "No recommendation for Logical Reasoning";
    case 'Openness':
      return recommendOpennessLearningTrack(score);
    case 'Conscientiousness':
      return recommendConscientiousnessLearningTrack(score);
    case 'Emotional Stability':
      return recommendEmotionalStabilityLearningTrack(score);
    case 'Agreeableness/Assertiveness':
      return recommendAgreeablenessAssertivenessLearningTrack(score);
    case 'Creativity':
      return recommendCreativityLearningTrack(score);
    default:
      return "No recommendation available";
  }
}

function recommendOpennessLearningTrack(score) {
  if (score >= 4) {
    return "Recommended learning track for Openness: Innovative Solutions Developer";
  } else if (score >= 2) {
    return "Recommended learning track for Openness: Creative Problem Solver";
  } else if (score >= 0) {
    return "Recommended learning track for Openness: Collaborative Innovator";
  } else {
    return "Recommended learning track for Openness: Structured Thinker";
  }
}

function recommendConscientiousnessLearningTrack(score) {
  if (score >= 2) {
    return "Recommended learning track for Conscientiousness: Project Manager";
  } else if (score >= 0) {
    return "Recommended learning track for Conscientiousness: Quality Assurance Analyst";
  } else {
    return "Recommended learning track for Conscientiousness: Flexible Scheduler";
  }
}


function recommendEmotionalStabilityLearningTrack(score) {
  switch (score) {
    case 'A':
      return "Recommended learning track for Emotional Stability: Product Manager";
    case 'B':
      return "Recommended learning track for Emotional Stability: Software Developer";
    case 'C':
      return "Recommended learning track for Emotional Stability: UI/UX Designer";
    case 'D':
      return "Recommended learning track for Emotional Stability: Cybersecurity Analyst";
    default:
      return "No recommendation available";
  }
}

function recommendAgreeablenessAssertivenessLearningTrack(score) {
  switch (score) {
    case 'A':
      return "Recommended learning track for Agreeableness/Assertiveness: Team Collaboration Specialist";
    case 'B':
      return "Recommended learning track for Agreeableness/Assertiveness: Cybersecurity Consultant";
    case 'C':
      return "Recommended learning track for Agreeableness/Assertiveness: Software Engineer";
    case 'D':
      return "Recommended learning track for Agreeableness/Assertiveness: Data Analyst";
    default:
      return "No recommendation available";
  }
}

function recommendCreativityLearningTrack(score) {
  if (score >= 2) {
    return "Recommended learning track for Creativity: Graphic Design";
  } else if (score >= 1) {
    return "Recommended learning track for Creativity: User Experience (UX) Design";
  } else {
    return "No recommendation available for Creativity";
  }
}
