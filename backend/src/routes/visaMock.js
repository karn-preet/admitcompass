const express = require("express");
const router = express.Router();
const { startMockInterview, evaluateResponse, VISA_PERSONAS } = require("../services/aiMockInterviewEngine");

/**
 * POST /api/visa-mock/start
 * Start a new simulated consular interview session
 * Body: { country: "USA" | "Germany" | "Canada" }
 */
router.post("/start", (req, res) => {
  try {
    const { country = "USA" } = req.body;
    const session = startMockInterview(country);
    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/visa-mock/evaluate
 * Evaluates student answer to a specific interview question
 * Body: { country, questionId, studentAnswer, currentQuestionIndex }
 */
router.post("/evaluate", (req, res) => {
  try {
    const { country = "USA", questionId, studentAnswer, currentQuestionIndex = 0 } = req.body;

    const evaluation = evaluateResponse(country, questionId, studentAnswer);

    // Determine next question in the series
    let personaKey = "USA_F1";
    if (country === "Germany") personaKey = "GERMANY_NATIONAL";
    else if (country === "Canada") personaKey = "CANADA_STUDY";

    const questions = VISA_PERSONAS[personaKey].starterQuestions;
    const nextIndex = currentQuestionIndex + 1;
    const nextQuestion = nextIndex < questions.length ? questions[nextIndex] : null;
    const isInterviewComplete = nextQuestion === null;

    res.json({
      success: true,
      data: {
        evaluation,
        nextQuestion,
        nextIndex,
        isInterviewComplete
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
