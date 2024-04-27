const { pool } = require("../model/dbPool");

// Get all questions
exports.getAllQuestions = async (req, res) => {
	try {
		const sql = "SELECT * FROM questions";
		const [rows] = await pool.execute(sql);

		if (rows) {
			// console.log(rows);
			return res.json(rows);
		}
	} catch (error) {
		console.log(error);
		// Error handling: throw or return error if data could not be fetched
		throw error;
		// * or res.status(500).json({ error: "Internal server error" });
	}
};

// Create a new question
exports.createQuestion = async (req, res) => {
	try {
		// Todo: run request body validations using a library like zod or joi or express-validator
		const { image_path, question_text, option1, option2, option3, option4, correct_option, category, questionNo } =
			req.body;

		const sql =
			"INSERT INTO questions (image_path, question_text, option1, option2, option3, option4, correct_option, category, questionNo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
		const values = [
			image_path,
			question_text,
			option1,
			option2,
			option3,
			option4,
			correct_option,
			category,
			questionNo,
		];

		const [rows] = await pool.execute(sql, values);

		if (rows) {
			console.log(rows);
			return res.status(200).json({ msg: "Question created successfully" });
		} else {
			return res.status(500).json({ error: "error creating question" });
		}
	} catch (error) {
		console.error({ error });
		return res.status(500).json({ error: "Internal server error", message: error.message });
	}
};

// Get a question by ID
exports.getQuestionById = async (req, res) => {
	try {
		const { id } = req.params;
		const sql = "SELECT * FROM questions WHERE question_id = ?";
		const values = [id];
		const [rows] = await pool.execute(sql, values);
		if (!rows || rows.length === 0) {
			return res.status(404).json({ error: "Question not found" });
		}
		if (rows) {
			// console.log(rows);
			return res.status(200).json({ question: rows });
		} else {
			return res.status(500).json({ error: "Error retrieving question" });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

// Update a question
exports.updateQuestion = async (req, res) => {
	try {
		const { id } = req.params;
		const { image_path, question_text, option1, option2, option3, category } = req.body;
		if (!image_path || !question_text || !option1 || !option2 || !option3 || !category) {
			return res.status(400).json({ error: "All fields are required" });
		}
		const query =
			"UPDATE questions SET image_path = ?, question_text = ?, option1 = ?, option2 = ?, option3 = ?, category = ? WHERE question_id = ?";
		const values = [image_path, question_text, option1, option2, option3, category, id];
		// console.log(id);

		const [rows] = await pool.execute(query, values);
		if (rows) {
			return res.json({ message: "Question updated successfully" });
		} else {
			return res.status(500).json({ error: "Error updating question" });
		}
	} catch (error) {
		console.error("Error updating question:", error);
		return res.status(500).json({ error: error.message });
	}
};

// Delete a question
exports.deleteQuestion = async (req, res) => {
	try {
		const { id } = req.params;
		const query = "DELETE FROM questions WHERE question_id = ?";
		const values = [id];
		const [rows] = await pool.execute(query, values);
		if (rows) {
			console.log(rows);
			res.json({ message: "Question deleted successfully" });
		}
		return res.status(500).json({ error: "Error deleting question" });
	} catch (error) {
		console.log(error);
	}
};
