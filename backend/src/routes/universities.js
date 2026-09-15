const express = require("express");
const router = express.Router();
const { getStore } = require("../config/db");

/**
 * GET /api/universities
 * Search & filter public universities database
 * Query params: country, field, degree, maxTuitionEUR, minCGPA
 */
router.get("/", (req, res) => {
  try {
    const { country, region, field, degree, maxTuitionEUR, minCGPA } = req.query;
    const store = getStore();
    let universities = [...store.universities];

    if (country) {
      if (country.toLowerCase().includes("eu")) {
        universities = universities.filter(u => u.region && u.region.includes("EU"));
      } else {
        universities = universities.filter(u => u.country.toLowerCase() === country.toLowerCase());
      }
    }

    if (region) {
      universities = universities.filter(u => u.region && u.region.toLowerCase().includes(region.toLowerCase()));
    }

    if (degree) {
      universities = universities.filter(u => u.degreesOffered.includes(degree));
    }

    if (field) {
      universities = universities.filter(u =>
        u.fields.some(f => f.toLowerCase().includes(field.toLowerCase()))
      );
    }

    if (maxTuitionEUR) {
      universities = universities.filter(u => (u.tuitionFeeEUR || 0) <= Number(maxTuitionEUR));
    }

    if (minCGPA) {
      universities = universities.filter(u => u.minCGPA10 <= Number(minCGPA));
    }

    res.json({
      success: true,
      count: universities.length,
      data: universities
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const { getCampusEcosystem } = require("../services/studentLifeMapEngine");

/**
 * GET /api/universities/:id
 * Get specific university details including Locations, verified Housing, and Amenities
 */
router.get("/:id", (req, res) => {
  try {
    const store = getStore();
    const uni = store.universities.find(u => u.id === req.params.id);
    if (!uni) {
      return res.status(404).json({ success: false, error: "University not found" });
    }

    const ecosystem = getCampusEcosystem(uni.id);

    res.json({ 
      success: true, 
      data: {
        ...uni,
        Locations: uni.Locations || [],
        Housing: ecosystem ? ecosystem.housing : [],
        Amenities: ecosystem ? ecosystem.amenities : [],
        HousingStats: ecosystem ? ecosystem.summaryStats : null
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
