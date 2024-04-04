const express = require('express');
const routerManager = express.Router();
const {createUser,showApplicants, details} = require('../controllers/ctl')
const {createAdmin} = require('../controllers/admin')
const {adminLogin} = require('../controllers/users')
const {verifyAuth} = require('../middleware/auth')
const questionsController = require('../controllers/questionsController')
const { validateSubmission } = require('../middleware/validation');
const { submitAssessment } = require('../controllers/assessmentController');
const { calculateScoresAndRecommendations } = require('../controllers/score$Recommendation');
// const { calculateMathScoresAndRecommendations } = require('../controllers/mathaptitude');
const { calculateMathLogicScoresAndRecommendations } = require('../controllers/MathLogicScoresAndRecom');

routerManager.post('/register', createUser)
routerManager.get('/adminLogin', adminLogin)
routerManager.get('/showApplicants', showApplicants)
routerManager.post('/adminRegister', createAdmin)
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
routerManager.post('/results', calculateScoresAndRecommendations);
routerManager.post('/math-logic-scores-recommendation', calculateMathLogicScoresAndRecommendations);

module.exports = { routerManager }


