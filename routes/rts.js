const express = require('express');
const routerManager = express.Router();
const {createUser,showApplicants, applicantLogin} = require('../controllers/applicantController')
const {createAdmin, } = require('../controllers/admin')
const {adminLogin} = require('../controllers/adminLogin')
const {verifyAuth} = require('../middleware/auth')
const questionsController = require('../controllers/questionsController')
const {createContactForm, getAllSubmissions} = require('../controllers/contactForm')
const { validateSubmission } = require('../middleware/validation');
const { submitAssessment } = require('../controllers/assessmentController');
const { calculateScoresAndRecommendations } = require('../controllers/score$Recommendation');
// const { calculateMathScoresAndRecommendations } = require('../controllers/mathaptitude');
const { calculateMathLogicScoresAndRecommendations } = require('../controllers/MathLogicScoresAndRecom');
const { Feedback, getAllFeedback } = require('../controllers/feedbackController');

routerManager.post('/register', createUser)
routerManager.post('/applicantLogin', applicantLogin)
routerManager.post('/adminLogin', adminLogin)
routerManager.get('/showApplicants', showApplicants)
routerManager.post('/adminRegister', createAdmin)

//contactForm submission
routerManager.post('/contactUs', createContactForm)
routerManager.get('/getAllSubmissions', getAllSubmissions)
// routerManager.get('/showAdmin', showAdmin)
// routerManager.get('/details',verifyAuth, details)

// Routes for managing assessment questions
routerManager.get('/getAllQuestions', questionsController.getAllQuestions);
routerManager.post('/createQuestion', questionsController.createQuestion);
routerManager.get('/getQuestionById/:id', questionsController.getQuestionById);
routerManager.put('/updateQuestion/:id', questionsController.updateQuestion);
routerManager.delete('/deleteQuestion/:id', questionsController.deleteQuestion);

// Route to submit assessment responses
routerManager.post('/submit', validateSubmission, submitAssessment);

// Calculate scores and recommend learning tracks
// routerManager.post('/math', calculateMathScoresAndRecommendations);
routerManager.post('/scores-recommendations', calculateScoresAndRecommendations);
routerManager.post('/math-logic-scores-recommendation', calculateMathLogicScoresAndRecommendations);

routerManager.post('/feedback', Feedback);
routerManager.get('/getAllFeedbacks', getAllFeedback);

module.exports = { routerManager }


