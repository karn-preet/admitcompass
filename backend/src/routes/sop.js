const express = require("express");
const router = express.Router();
const { generateStatementOfPurpose, reviewStatementOfPurpose } = require("../services/aiSopEngine");

/**
 * POST /api/sop/generate
 * Generates an academic Statement of Purpose based on applicant inputs
 */
router.post("/generate", (req, res) => {
  try {
    const inputs = req.body || {};
    const sopResult = generateStatementOfPurpose(inputs);
    res.json({
      success: true,
      data: sopResult
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/sop/review
 * Evaluates an existing SOP text draft for clichés, hook quality, and academic depth
 */
router.post("/review", (req, res) => {
  try {
    const { text = "" } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Please paste or enter your Statement of Purpose text."
      });
    }

    const reviewResult = reviewStatementOfPurpose(text);
    res.json({
      success: true,
      data: reviewResult
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
