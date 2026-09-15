const express = require("express");
const router = express.Router();
const { calculateRateMyChances } = require("../services/rateMyChancesEngine");

/**
 * POST /api/rate-my-chances
 * Calculates admission probability for a specific target university
 */
router.post("/", (req, res) => {
  try {
    const targetUniversity = req.body.targetUniversity || req.body.universityId;
    const profile = req.body.profile || req.body;

    if (!targetUniversity) {
      return res.status(400).json({
        success: false,
        error: "Target university ID or name is required."
      });
    }

    const evaluation = calculateRateMyChances(profile, targetUniversity);

    res.json({
      success: true,
      data: evaluation
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
