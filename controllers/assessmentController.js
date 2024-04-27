const { pool } = require("../model/dbPool");

exports.submitAssessment = async (req, res) => {
	const { userName, responses } = req.body;

	try {
		//* Validate request body
		if (!userName || userName == "") throw new Error("userName is required");
		else if (!responses || responses.length < 1) throw new Error("responses are required");
		else if (!Array.isArray(responses)) throw new Error("responses must be an array");
		// Todo: run more input validation checks

		// Retrieve correct answers from the database
		const query = "SELECT question_id, correct_option FROM questions";
		const [rows, fields] = await pool.query(query);

		// Create a map of question IDs to correct options
		const correctAnswers = {};
		rows.forEach((row) => {
			correctAnswers[row.question_id] = row.correct_option;
		});

		// Calculate score and check correctness of each response
		let score = 0;
		const result = responses.map((response) => {
			const { questionId, answer } = response;
			//Todo: Run validation checks for the questionId and answer
			//
			// Retrieve the correct option using the question ID provided by the user
			const correctOption = correctAnswers[questionId];
			console.log(`Question ID: ${questionId}, Answer: ${answer}, Correct Option: ${correctOption}`);
			const isCorrect = answer === correctOption;
			if (isCorrect) {
				score++;
			}
			return { questionId, answer, correctOption, isCorrect };
		});
		res.json({ result, score });
	} catch (error) {
		console.error("Error submitting assessment:", error);
		res.status(500).json({ error: "Error submitting assessment answer", message: error.message });
	}
};
