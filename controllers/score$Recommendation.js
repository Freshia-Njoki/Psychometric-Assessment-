const { pool } = require('../model/dbPool');



exports.calculateScoresAndRecommendations = async (req, res) => {
  try {

    var mathAptitudeScore = 0; 
    var logicalScore = 0;
    var opennesstotalScore = 0;
    var conscientiousnestotalScore = 0;
    var emotiontotalScore = 0;
    var aatotalScore = 0;
    var imaginationtotalscore = 0
    var technicalaptotalScore = 0;
    var programmingScore, designsoftwareScore, threeDSkillsScore, webDevconfidenceScore = 0;

    const recommendation_learning_track_list = [{name: "recommendation_1", value:["Average", "Excellent", "Open", "Highly", "Calm", 
                                            "Assertive", "Creative", "Technically Inclined", "Intermediate", 
                                          "Proficient", "Moderate Experienced", "Moderately Confident"],
                                          learning_track_1: "Software Development", learning_track_2:"BlockChain", 
                                          learning_track_1_description:"The Software Development Track encompasses both front-end and back-end development, making you a versatile and highly sought-after professional in the tech industry. Full-stack developers are responsible for creating complete web applications, from the user interface to the server-side logic and database interactions.",
                                          learning_track_2_description: "If you're fascinated by blockchain technology but prefer a less technical role, consider a career in blockchain consulting or project management. You can leverage your understanding of blockchain to advise businesses on implementation strategies and oversee blockchain projects."
                                         },
                                         {
                                          name: "recommendation_2", value:["Bad", "Average", "Somewhat Open", "Highly", "Pressured(Composed)",  
                                          "Cooperative", "Creative", "Technically Inclined", "Basic", 
                                        "Basic", "High Experienced", "Highly Confident"],
                                        learning_track_1: "3D Animation", learning_track_2:"Product Design",
                                        learning_track_1_description:"The 3D Animation Track is a captivating and artistic field that involves bringing imagination to life through animated visuals. 3D animators play a pivotal role in creating engaging storytelling experiences that evoke emotions and captivate audiences.",
                                          learning_track_2_description:"If you enjoy creative problem-solving and have a keen eye for detail but possess moderate technical skills, product design offers a fulfilling path. Your ability to understand user needs and translate them into innovative solutions will be your greatest asset"
                                        },
                                         {
                                          name: "recommendation_3", value:["Excellent", "Bad", "Not Open", "Moderate", "Overwhelmed",  
                                          "Assertive", "Not Creative", "Not Technically Inclined", "Advanced", 
                                        "Highly Proficient", "Not Experienced", "Moderately Confident"],
                                        learning_track_1: "Product Management", learning_track_2:"Mobile App",
                                        learning_track_1_description:"The Product Management Track is a dynamic and multifaceted field that involves overseeing the entire lifecycle of a product, from ideation to launch and beyond. Product managers play a pivotal role in driving product success, collaborating with cross-functional teams, and making strategic decisions to meet market demands.",
                                          learning_track_2_description:"If you enjoy designing user interfaces and understanding user behavior, but have limited programming experience, consider a UX/UI designer role in mobile app development. You'll focus on creating user-friendly and visually appealing interfaces, ensuring a seamless user experience."
                                         },
  
                                    {
                                      name: "recommendation_4", value:["Average", "Average", "Open", "Not", "Calm",  
                                        "Cooperative", "Creative", "Technically Inclined", "Basic", 
                                      "Not Proficient", "Moderate Experienced", "Highly Confident"],
                                      learning_track_1: "Mobile Application", learning_track_2:"Software Development",
                                      learning_track_1_description:"The Mobile App Development Track is a dynamic and rapidly evolving field that focuses on creating innovative and user-friendly applications for mobile devices. Mobile app developers play a pivotal role in shaping the digital landscape and meeting the needs of tech-savvy users.",
                                          learning_track_2_description:"If you possess a strong aptitude for logical thinking, problem-solving, and technology, but your interests lean more towards either user interface design or server-side logic, you have two excellent options within software development."
                                      },

                                  {
                                      name: "recommendation_5", value:["Excellent", "Excellent", "Open", "Not", "Overwhelmed",  
                                        "Assertive", "Creative", "Not Technically Inclined", "Intermediate", 
                                      "Not Proficient", "High Experienced", "Not Confident"],
                                      learning_track_1: "Cyber Security", learning_track_2:"Data Science",
                                      learning_track_1_description:"The Cyber Security Track is a critical and constantly evolving field that focuses on protecting digital systems, networks, and sensitive data from cyber threats and attacks. Cyber security experts play a crucial role in safeguarding organizations and individuals from potential breaches and ensuring the integrity of information.",
                                          learning_track_2_description:"If you have strong analytical skills and are interested in data but prefer less technical work, consider roles like data analyst or business intelligence analyst. You'll use your skills to interpret data and provide insights to inform business decisions."
                                  }
                                    ]
    



    const { responses } = req.body;

    // Validation of responses
    if (!Array.isArray(responses) || responses.length === 0) {
      throw new Error("Invalid responses data.");
    }
    const query = "SELECT question_id, selected_option,correct_option, category FROM questions";
    const [rows, fields] = await pool.query(query);

    const correctAnswers = {};
		rows.forEach((row) => {
			correctAnswers[row.question_id] = row.correct_option;
		});


    // Calculate total score for all categories based on selected options
    responses.forEach(response => {
      const { question_id, selected_option } = response;
      const category = getCategory(rows, question_id);
      //totalScore += calculateScore(selectedOption, category);

      switch (category) {
        case 'Mathematical Aptitude':
          score = calculateMathsaptitude(question_id,selected_option, correctAnswers);
          if (score === 1){

            mathAptitudeScore++;
          }
          break;
        case 'Logical Reasoning':

          logicalScore += calculateLogical(question_id,selected_option,correctAnswers);
          break;

        case 'Openness to Experience':

          opennesstotalScore += calculateOpennessScore(selected_option);
          break;
        case 'Conscientiousness':

          conscientiousnestotalScore += calculateConscientiousnessScore(selected_option);
          break;
        case 'Emotional Stability':

          emotiontotalScore += calculateEmotionalStabilityScore(selected_option);
          break;
        case 'Agreeableness vs. Assertiveness':

          aatotalScore += calculateAgreeablenessAssertivenessScore(selected_option);
          break;
        case 'Imagination':
          

          imaginationtotalscore += calculateImaginationScore(selected_option);
          break;
        case 'Technical Aptitude':

          technicalaptotalScore += calculateTechnicalAptitudeScore(selected_option);
          break;
        case 'Skills Assessment':
          if (question_id === 55){
            programmingScore = calculateProgrammingScore(selected_option);
          }
          if (question_id === 54){
            designsoftwareScore = calculateDesignSoftwareScore(selected_option);
          }
          if (question_id === 52){
            threeDSkillsScore = calculate3DSkillsScore(selected_option);
          }
          if (question_id === 53){
            webDevconfidenceScore = calculateWebdevScore(selected_option);
          }
       
          break;
        default:
          mathAptitudeScore = 0;
      }

    });

    const opennessavg = opennesstotalScore/2  //max 5
    const conscientiousnesavg= conscientiousnestotalScore/2  //max 5 
    const emotionavg=emotiontotalScore   //max 2
    const agreeablenessasssertivenessavg = aatotalScore/3  //max 4.6
    const imaginationavg = imaginationtotalscore/5  //max 5
    const technicalaptavg = technicalaptotalScore/5  //max 5

    const open = opennessgrade(opennessavg)
    const conscienctious = conscientiousnessgrade(conscientiousnesavg) 
    const emotional = emotionalstabilitygrade(emotionavg)
    const agreeable = agreeablenessassertiveness(agreeablenessasssertivenessavg)
    const imaginativee = imaginative(imaginationavg)
    const technical = technicalAptitude(technicalaptavg)
    const programming = programmingskill(programmingScore)
    const designSW = designsoftwareskill(designsoftwareScore)
    const _3D = threeDskill(threeDSkillsScore)
    const webdev = webdevconfidence(webDevconfidenceScore)
    const mathsapt  = mathsgrade(mathAptitudeScore)
    const logical = logicalgrade(logicalScore)

    const cognitive_ability = (mathAptitudeScore + logicalScore) / 2;
    const personality_trait = (opennessavg + conscientiousnesavg +emotionavg + agreeablenessasssertivenessavg) / 4;

     const assessment_recommendation_score_list = [mathsapt,logical, open, conscienctious, emotional, agreeable,
                                            imaginativee, technicalaptavg, programming, designSW, _3D, webdev]
    
    const bestMatchDetails = findBestMatch(recommendation_learning_track_list, assessment_recommendation_score_list);

                                          
                                           

    res.json({
      cognitiveAbility_score: cognitive_ability,
      cognitiveAbility_score_max: 10,
      personallityTrait_score: parseFloat(personality_trait.toFixed(1)),
      personallityTrait_score_max: 4.6,
      math: mathsapt,
      logical: logical,
      openness: open,
      conscientiousness: conscienctious,
      emotional: emotional,
      agreeable_assertiveness: agreeable,
      imaginative: imaginativee,
      imaginative_score: imaginationavg,
      imaginative_score_max: 5,
      technical: technical,
      aptitude_score: technicalaptavg,
      aptitude_score_max: 5,
      programming_skill: programming,
      software_design: designSW,
      threeD_skill: _3D,
      web_development:webdev,
      recommended_track_details: bestMatchDetails

    });

  } catch (error) {
    console.error("Error calculating scores:", error);
    res.status(500).json({ error: "An error occurred while calculating scores." });
  }
};
    
    // Recommend learning track based on total score
    //const recommendedTrack = recommendLearningTrack(totalScore);

    // Send response with total score and recommended learning track
//     res.json({
//       totalScore,
//       recommendedTrack
//     });
//   } catch (error) {
//     console.error("Error calculating scores:", error);
//     res.status(500).json({ error: "An error occurred while calculating scores." });
//   }
// };

// Helper function to get category of a question
function getCategory(questions, questionId) {
  const question = questions.find(q => q.question_id === questionId);
  return question ? question.category : null;
}

// Function to calculate score for each category
// function calculateScore(selectedOption, category) {

//   switch (category) {
//     case 'Openness to Experience':

//       return calculateOpennessScore(selectedOption);
//     case 'Conscientiousness':
//       return calculateConscientiousnessScore(selectedOption);
//     case 'Emotional Stability':

//       return calculateEmotionalStabilityScore(selectedOption);
//     case 'Agreeableness vs. Assertiveness':

//       return calculateAgreeablenessAssertivenessScore(selectedOption);
//     case 'Imagination':

//       return calculateImaginationScore(selectedOption);
//     case 'Technical Aptitude':

//       return calculateTechnicalAptitudeScore(selectedOption);
//     case 'Skills Assessment':

//       return calculateSkillsAssessmentScore(selectedOption);
//     default:
//       return 0;
//   }
// }

// Function to recommend learning track based on total score
// function recommendLearningTrack(totalScore) {
//   if (totalScore >= 35) {
//     return "Recommended learning track: Software Development, Blockchain";
//   } else if (totalScore >= 28) {
//     return "Recommended learning track: Product Management, Product Design";
//   } else if (totalScore >= 24) {
//     return "Recommended learning track: Mobile App Development";
//   } else if (totalScore >= 20) {
//     return "Recommended learning track: Data Science";
//   } else if (totalScore >= 16) {
//     return "Recommended learning track: Cyber Security";
//   } else if (totalScore >= 12) {
//     return "Recommended learning track: 3D Animation";
//   } else if (totalScore >= 8) {
//     return "Recommended learning track: User Experience (UX) Design";
//   } else {
//     return "No recommendation available";
//   }
// }

function findBestMatch(recommendation_learning_track_list, assessment_recommendation_score_list) {
  let maxMatchingIndices = -1;
  
  let recommendation_dict = {}
  for (const list of recommendation_learning_track_list) {
      const best_fit = list.learning_track_1;
      const alternative_fit = list.learning_track_2;
      const best_fit_description = list.learning_track_1_description;
      const alternative_fit_description = list.learning_track_2_description;
      const values = list.value;

      
      let matchingIndices = 0;

      for (let i = 0; i < values.length; i++) {
          if (values[i] === assessment_recommendation_score_list[i]) {
              matchingIndices++;
          }
      }
      
      if (matchingIndices > maxMatchingIndices) {
          maxMatchingIndices = matchingIndices;
          recommendation_dict['best_fit'] = best_fit
          recommendation_dict['alternative_fit'] = alternative_fit
          recommendation_dict['best_fit_description'] = best_fit_description
          recommendation_dict['alternative_fit_description'] = alternative_fit_description
      }
  }
  
  return recommendation_dict;
}

function mathsgrade(mathScore) {
  if (mathScore >= 8) {
    return "Excellent";
  } else if (mathScore >= 5 && mathScore <= 7) {
    return "Average";
  } else if (mathScore < 5) {
    return "Bad";
  } else {
    return "No score";
  }
}

function logicalgrade(logicalReasoningScore) {
  if (logicalReasoningScore >= 8) {
    return "Excellent";
  } else if (logicalReasoningScore >= 5 && logicalReasoningScore <= 7) {
    return "Average";
  } else if (logicalReasoningScore < 5) {
    return "Bad";
  } else {
    return "No score";
  }
}


function opennessgrade(opennesstotalScore) {
  if (opennesstotalScore >= 3.5) {
    return "Open";
  } else if (opennesstotalScore >= 2.5 && opennesstotalScore <= 3) {
    return "Somewhat Open";
  } else if (opennesstotalScore < 2.5) {
    return "Not Open";
  } else {
    return "No score";
  }
}

function conscientiousnessgrade(conscientiousnestotalScore) {
  if (conscientiousnestotalScore >= 3.5) {
    return "Highly";
  } else if (conscientiousnestotalScore >= 2.5 && conscientiousnestotalScore <= 3) {
    return "Moderate";
  } else if (conscientiousnestotalScore < 2.5) {
    return "Not";
  } else {
    return "No score";
  }
}

function emotionalstabilitygrade(emotiontotalScore) {
  if (emotiontotalScore === 2) {
    return "Calm";
  } else if (emotiontotalScore === 1.5) {
    return "Pressure (Composed)";
  } else if (emotiontotalScore <= 1) {
    return "Overwhelmed";
  } else {
    return "No score";
  }
}


function agreeablenessassertiveness(aatotalScore) {
  if (aatotalScore >= 3.5) {
    return "Cooperative";
  } else if (aatotalScore < 3.5) {
    return "Assertive";
  } else {
    return "No score";
  }
}

function imaginative(imaginationtotalscore) {
  if (imaginationtotalscore > 4) {
    return "Creative";
  } else if (imaginationtotalscore <= 4) {
    return "Not Creative";
  } else {
    return "No score";
  }
}

function technicalAptitude(technicalaptotalScore) {
  if (technicalaptotalScore >= 4) {
    return "Technically Inclined";
  } else if (technicalaptotalScore < 4) {
    return "Not Technically Inclined";
  } else {
    return "No score";
  }
}

function programmingskill(programmingScore) {
  if (programmingScore >= 4) {
    return "Advanced";
  } else if (programmingScore === 3) {
    return "Intermediate";
  }
  else if (programmingScore === 2) {
    return "Basic";
  } 
  else {
    return "No score";
  }
}

function designsoftwareskill(softwareDesignScore) {
  if (softwareDesignScore === 5) {
    return "Highly Proficient";
  } 
  else if (softwareDesignScore >= 3 && softwareDesignScore <=4) {
    return "Proficient";
  } else if (softwareDesignScore === 2 ) {
    return "Basic";
  }
  else if (softwareDesignScore <2 ) {
    return "Not Proficient";
  }
  else {
    return "Unfamiliar";
  }
}
function threeDskill(Score3D) {
  if (Score3D === 5) {
    return "High Experienced";
  } else if (Score3D ===3) {
    return "Moderately Experienced";
  } else if (Score3D < 3) {
    return "Not Experienced";
  } else {
    return "No score";
  }
}
function webdevconfidence(webdevScore) {
  if (webdevScore === 5) {
    return "Highly Confident";
  } else if (webdevScore ===3 ) {
    return "Moderately Confident";
  } else if (webdevScore < 3) {
    return "Not Confident";
  } else {
    return "No score";
  }
}


function calculateMathsaptitude(questionId, selectedoption, correctAnswers){
  const correctOption = correctAnswers[questionId];

			const isCorrect = selectedoption === correctOption;
      console.log(isCorrect)
			if (isCorrect) {
				return 1;
			}
      else{
        return 0;
      }

}

function calculateLogical (questionId, selectedoption, correctAnswers){
  const correctOption = correctAnswers[questionId];
  const isCorrect = selectedoption === correctOption;
  if (isCorrect) {
    return 1;
  }
  else{
    return 0;
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
    'Incorporate a captivating backstory that players can explore.': 3,
    'Develop a mobile app that optimizes smart home device usage.': 5,
    'Create a software program that learns user preferences and adjusts settings accordingly.': 4,
    'Design a product that harvests renewable energy for smart home devices.': 3,
    'Develop a gamified mobile app for interactive learning.': 5,
    'Create an online platform that adapts to each learner.': 4,
    'Use data analytics to identify optimal learning paths for individuals.': 3

  };
  return optionScores[selectedOption];
}



function calculateTechnicalAptitudeScore(selectedOption) {
  const optionScores = {
    'Very comfortable, I enjoy exploring new software.': 5,
    'Somewhat comfortable, but I prefer familiar tools.': 4,
    'Not very comfortable, I struggle with new technology.': 3,
    "Yes, I''ve created and customized programs or websites.": 5,
    "I've dabbled a bit but not extensively.": 4,
    "No, I haven't tried coding or web development.": 3,
    "I'm quite skilled at resolving technical problems.": 5,
    "I can manage some issues but prefer not to.": 4,
    'I find it challenging and usually seek help.': 3,
    "Absolutely, I love taking things apart and learning how they function.": 5,
    "I'm curious but don't often delve deeply into it.": 4,
    "Not particularly, I'm more interested in using technology.": 3,
    'I dive right in, experiment, and figure it out.': 5,
    'I research and seek help if needed but try to solve it myself.': 4,
    'I usually ask someone else to handle it.': 3
  };
  return optionScores[selectedOption];
}

// function calculateSkillsAssessmentScore(selectedOption) {
//   const optionScores = {
//     'Novice': 1,
//     'Basic': 2,
//     'Intermediate': 3,
//     'Advanced': 4,
//     'Expert': 5,
//     'Unfamiliar': 1,
//     'Proficient': 3,
//     'Highly Proficient': 5,
//     'Very comfortable': 5,
//     'Moderately comfortable': 3,
//     'Not comfortable': 1,
//     "Yes, I'm experienced.": 5,
//     "I have some experience.": 3,
//     "No, I'm not skilled in this area.": 1,
//     'Very confident': 5,
//     'Moderately confident': 3,
//     'Not confident': 1,
//   };
//   return optionScores[selectedOption];
//}




function calculateProgrammingScore(selectedOption) {
  const optionScores = {
    'Novice': 1,
    'Basic': 2,
    'Intermediate': 3,
    'Advanced': 4,
    'Expert': 5
  };
  return optionScores[selectedOption];
}



function calculateDesignSoftwareScore(selectedOption) {
  const optionScores = {
    'Unfamiliar': 1,
    'Basic': 2,
    'Proficient': 3,
    'Advanced' : 4,
    'Highly Proficient': 5
  };
  return optionScores[selectedOption];
}




function calculate3DSkillsScore(selectedOption) {
  const optionScores = {
    "Yes, I'm experienced.": 5,
    "I have some experience.": 3,
    "No, I'm not skilled in this area.": 1
  };
  return optionScores[selectedOption];
}




function calculateWebdevScore(selectedOption) {
  const optionScores = {
    'Very confident': 5,
    'Moderately confident': 3,
    'Not confident': 1
  };
  return optionScores[selectedOption];
}
