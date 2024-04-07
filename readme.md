CareerPASS API Documentation
Welcome to the CareerPASS API documentation. This API provides endpoints for managing users, administering assessments, and handling assessment submissions.

#Table of Contents
Endpoints
Authentication
Responses
Error Handling
Endpoints
Users
POST /register: Register a new user.
GET /adminLogin: Admin login.
GET /showApplicants: Retrieve all applicants.
POST /adminRegister: Register a new admin.

Question Management - CRUD
Create Question
Endpoint: baseURL/createQuestion
Method: POST
Description: Create a new assessment question.


Get All Questions
Endpoint: baseURL/getAllQuestions
Method: GET
Description: Retrieve all assessment questions.
Response: List of questions objects containing details such as image_path, question_text, options, etc

Update Question
Endpoint: baseURL/updateQuestion/questionId
Method: PUT
Description: Update an existing assessment question. The specified fields in JSON object are required!
Request Parameters:
questionId: ID of the question to be updated

Delete Question
Endpoint: baseURL/deleteQuestion/questionId
Method: DELETE
Description: Delete an existing assessment question.
Request Parameters:
questionId: ID of the question to be deleted

Get Questions By Id
Endpoint: baseURL/getQuestionById/questionId
Method: GET
Description: Retrieves a specific assessment question.
Response: Lists question objects containing details such as image_path, question_text, options, etc

Assessment Submission
Submit Assessment
Endpoint: baseURL/submit
Method: POST
Description: Submit assessment responses.

Scoring and Recommendations
Calculate Math and Logic Scores and Recommendations for section 1 (cognitive abilities)
Endpoint: baseURL/math-logic-scores-recommendation
Method: POST
Description: Calculate scores and recommend learning tracks based on assessment results for mathematical aptitude and logical reasoning.
Request Body:

Response:
mathScore: Total score for mathematical aptitude
logicScore: Total score for logical reasoning
mathLearningTrack: Recommended learning track for mathematical aptitude
logicLearningTrack: Recommended learning track for logical reasoning

Calculate Scores and Recommendations for section 2 - section 5
Endpoint: baseURL/scores-recommendations
Method: POST
Description: Calculate scores and recommend learning tracks based on assessment results for personality traits.

Response:
score: Total score for each personality trait
learning track: Recommended learning track for each personality trait


ContactForm Submission
Form Submission
Endpoint: baseURL/contactUs
Method: POST
Description: Submits Applicants' inquiries.

Show Applicants queries
Endpoint: baseURL/getAllSubmissions
Method: GET
Description: Retrieve a list of all applicant's queries
Response:  List of applicant questions containing details such as full_name, email, phone_number, how_can_we_help 

Authentication
Authentication is required for certain endpoints, such as creating assessment questions or submitting assessments. Authentication is implemented using JSON Web Tokens (JWT). Users must include their JWT token in the Authorization header of the request.

Responses
The API returns responses in JSON format. Successful responses include a 200 OK status code, while error responses include appropriate status codes (e.g., 400 Bad Request, 401 Unauthorized, 500 Internal Server Error) along with an error message.

Error Handling
The API includes error handling to ensure that errors are appropriately handled and returned to the client. Errors are returned in JSON format with an error message describing the issue.

