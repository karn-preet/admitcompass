const express = require("express");
const router = express.Router();
const { getStore } = require("../config/db");

/**
 * GET /api/scholarships
 * Search & filter international scholarships
 * Query params: country, degree, search, minAmount
 */
router.get("/", (req, res) => {
  try {
    const { country, degree, search, minAmount } = req.query;
    const store = getStore();
    let scholarships = [...(store.scholarships || [])];

    if (country) {
      scholarships = scholarships.filter(s => 
        s.country.toLowerCase() === country.toLowerCase() ||
        (country.toLowerCase().includes("eu") && (s.region === "EU" || s.country === "All EU Countries"))
      );
    }

    if (degree) {
      scholarships = scholarships.filter(s => 
        s.targetDegree.toLowerCase().includes(degree.toLowerCase()) ||
        s.targetDegree.includes("All")
      );
    }

    if (minAmount) {
      scholarships = scholarships.filter(s => (s.amountEUR || 0) >= Number(minAmount));
    }

    if (search) {
      const q = search.toLowerCase();
      scholarships = scholarships.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.country.toLowerCase().includes(q) ||
        s.awardingBody.toLowerCase().includes(q) ||
        s.selectionCriteria.toLowerCase().includes(q) ||
        s.fundingType.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      count: scholarships.length,
      data: scholarships
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
