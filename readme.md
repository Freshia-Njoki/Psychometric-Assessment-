CareerPASS API Documentation
Welcome to the CareerPASS API documentation. This API provides endpoints for managing users, administering assessments, and handling assessment submissions.

Table of Contents
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
Assessment Questions
GET /questions: Retrieve all assessment questions.
POST /questions: Create a new assessment question.
GET /questions/:id: Retrieve a specific assessment question by ID.
PUT /questions/:id: Update an assessment question.
DELETE /questions/:id: Delete an assessment question.
Assessment Submissions
POST /submitAssessment: Submit assessment responses.
Authentication
Authentication is required for certain endpoints, such as creating assessment questions or submitting assessments. Authentication is implemented using JSON Web Tokens (JWT). Users must include their JWT token in the Authorization header of the request.

Responses
The API returns responses in JSON format. Successful responses include a 200 OK status code, while error responses include appropriate status codes (e.g., 400 Bad Request, 401 Unauthorized, 500 Internal Server Error) along with an error message.

Error Handling
The API includes error handling to ensure that errors are appropriately handled and returned to the client. Errors are returned in JSON format with an error message describing the issue.

