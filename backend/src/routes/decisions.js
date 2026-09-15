const express = require("express");
const router = express.Router();
const { getStore } = require("../config/db");

/**
 * GET /api/decisions
 * Search & filter historical admits and rejects
 * Query params: country, university, degree, status, search
 */
router.get("/", (req, res) => {
  try {
    const { country, university, degree, status, search } = req.query;
    const store = getStore();
    let decisions = [...(store.decisions || [])];

    if (country) {
      decisions = decisions.filter(d => d.country.toLowerCase() === country.toLowerCase());
    }

    if (university) {
      decisions = decisions.filter(d => 
        d.universityName.toLowerCase().includes(university.toLowerCase())
      );
    }

    if (degree) {
      decisions = decisions.filter(d => d.degree.toLowerCase().includes(degree.toLowerCase()));
    }

    if (status) {
      decisions = decisions.filter(d => d.status.toLowerCase() === status.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      decisions = decisions.filter(d =>
        d.universityName.toLowerCase().includes(q) ||
        d.program.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        (d.keyFactor && d.keyFactor.toLowerCase().includes(q))
      );
    }

    // Sort newest / best outcomes first
    res.json({
      success: true,
      count: decisions.length,
      data: decisions
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/decisions
 * Submit a real student admission / rejection decision anonymously
 */
router.post("/", (req, res) => {
  try {
    const {
      universityName,
      country = "Germany",
      degree = "Master's",
      program = "Computer Science",
      term = "Fall 2025",
      cgpa = 7.5,
      collegeTier = "Tier 2",
      greScore = null,
      ieltsScore = 7.0,
      workExperienceYears = 1,
      researchPapers = 0,
      status = "Admitted",
      scholarshipDetails = "Standard tuition",
      keyFactor = "Comprehensive profile evaluation"
    } = req.body;

    if (!universityName) {
      return res.status(400).json({ success: false, error: "University name is required." });
    }

    const newDecision = {
      id: "dec-user-" + Date.now(),
      universityName,
      country,
      degree,
      program,
      term,
      cgpa: Number(cgpa),
      cgpaScale: 10.0,
      collegeTier,
      greScore,
      ieltsScore: Number(ieltsScore),
      workExperienceYears: Number(workExperienceYears),
      researchPapers: Number(researchPapers),
      status: status === "Rejected" ? "Rejected" : "Admitted",
      scholarshipDetails,
      keyFactor,
      submittedAt: new Date().toISOString()
    };

    const store = getStore();
    if (!store.decisions) store.decisions = [];
    store.decisions.unshift(newDecision);

    res.status(201).json({
      success: true,
      message: "Decision submitted successfully to the community database!",
      data: newDecision
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
