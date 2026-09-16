const express = require("express");
const router = express.Router();
const { getStore, isMongoActive } = require("../config/db");
const University = require("../models/University");
const { getCampusEcosystem } = require("../services/studentLifeMapEngine");

/**
 * Core Matching Algorithm for University Programs
 * Implements strict CGPA cutoff (Official_Min_CGPA <= userCGPA),
 * Field / Degree relevance matching, and Financial Capacity filtering.
 */
function matchUniversityPrograms(criteria = {}) {
  // 1. Extract and normalize criteria
  const userCGPA = criteria.cgpa !== undefined && criteria.cgpa !== null && criteria.cgpa !== ""
    ? Number(criteria.cgpa)
    : (criteria.currentCGPA !== undefined && criteria.currentCGPA !== null && criteria.currentCGPA !== ""
        ? Number(criteria.currentCGPA)
        : null);

  const degreeType = criteria.degreeType || criteria.degreeTarget || criteria.degree || "Master's";
  const fieldRaw = criteria.field || criteria.backgroundField || criteria.currentDegree || "";
  const ieltsScore = criteria.ieltsScore !== undefined && criteria.ieltsScore !== null && criteria.ieltsScore !== ""
    ? Number(criteria.ieltsScore)
    : null;
  const country = criteria.country || criteria.targetCountry || "";

  // Financial capacity in EUR
  let financialCapacityEUR = null;
  if (criteria.financialCapacityEUR !== undefined && criteria.financialCapacityEUR !== null && criteria.financialCapacityEUR !== "") {
    financialCapacityEUR = Number(criteria.financialCapacityEUR);
  } else if (criteria.maxAnnualTuition !== undefined && criteria.maxAnnualTuition !== null && criteria.maxAnnualTuition !== "") {
    financialCapacityEUR = Number(criteria.maxAnnualTuition);
  } else if (criteria.liquidSavingsINR) {
    financialCapacityEUR = Number(criteria.liquidSavingsINR) / 90;
  } else if (criteria.annualFamilyIncomeINR) {
    financialCapacityEUR = Number(criteria.annualFamilyIncomeINR) / 90;
  }

  // Determine relevant field keywords based on student's background/target
  let relevantFieldKeywords = [];
  const lowerField = fieldRaw.toLowerCase();
  if (
    lowerField.includes("computer") || 
    lowerField.includes("cse") || 
    lowerField.includes("cs") || 
    lowerField.includes("data") || 
    lowerField.includes("software") ||
    lowerField.includes("information technology") ||
    lowerField.includes("informatics")
  ) {
    relevantFieldKeywords = [
      "computer", 
      "data", 
      "software", 
      "informatics", 
      "artificial intelligence"
    ];
  } else if (lowerField.trim()) {
    relevantFieldKeywords = [lowerField.trim()];
  }

  const store = getStore();
  let matches = [...store.universities];

  // 1. Country Filter (if specified and not "All")
  if (country && country.toLowerCase() !== "all" && country.toLowerCase() !== "all countries") {
    if (country.toLowerCase() === "eu" || country.toLowerCase() === "europe") {
      matches = matches.filter(u => u.region && u.region.includes("EU"));
    } else {
      matches = matches.filter(u => 
        (u.country && u.country.toLowerCase() === country.toLowerCase()) ||
        (Array.isArray(u.countryAliases) && u.countryAliases.some(a => a.toLowerCase() === country.toLowerCase()))
      );
    }
  }

  // 2. Degree Level Filter (e.g. Master's vs Bachelor's)
  if (degreeType && degreeType.toLowerCase() !== "all") {
    matches = matches.filter(u => {
      const degrees = u.degreesOffered || u.Degree_Level || [];
      return degrees.some(d => d.toLowerCase().includes(degreeType.toLowerCase()));
    });
  }

  // 3. Field of Study Relevance Filter (e.g. CS / Data Analytics)
  if (relevantFieldKeywords.length > 0) {
    matches = matches.filter(u => {
      const uniFields = Array.isArray(u.fields) ? u.fields : [];
      const progAvail = Array.isArray(u.programsAvailable) ? u.programsAvailable : [];
      const allFields = [...uniFields, ...progAvail].map(f => f.toLowerCase());
      return relevantFieldKeywords.some(keyword => 
        allFields.some(f => f.includes(keyword))
      );
    });
  }

  // 4. Strict CGPA Cutoff Enforcement (Official_Min_CGPA <= userCGPA)
  // Programs requiring higher CGPA (e.g. TUM requiring 8.0 for a 7.0 applicant) are strictly hidden
  if (userCGPA !== null && !isNaN(userCGPA)) {
    matches = matches.filter(u => {
      const minCutoff = u.Official_Min_CGPA !== undefined 
        ? Number(u.Official_Min_CGPA) 
        : Number(u.minCGPA10 || 6.5);
      return minCutoff <= userCGPA;
    });
  }

  // 5. IELTS Score Cutoff Filter
  if (ieltsScore !== null && !isNaN(ieltsScore)) {
    matches = matches.filter(u => {
      if (!u.ieltsMinOverall) return true;
      return Number(u.ieltsMinOverall) <= ieltsScore;
    });
  }

  // 6. Financial Capacity Filter
  // Filter out programs where required funds exceed capacity (unless €0 tuition offsets it)
  if (financialCapacityEUR !== null && !isNaN(financialCapacityEUR) && financialCapacityEUR > 0) {
    matches = matches.filter(u => {
      const tuition = Number(u.tuitionFeeEUR ?? u.Tuition_Fee_International ?? 0);
      // Tuition-free (€0) European public institutions remain accessible
      if (tuition === 0) return true;
      const livingCost = Number(u.livingCostPerYearEUR || 11904);
      const totalCost = tuition + livingCost;
      return totalCost <= financialCapacityEUR || tuition <= financialCapacityEUR;
    });
  }

  return {
    matches,
    criteria: {
      userCGPA,
      degreeType,
      field: fieldRaw,
      matchedFieldKeywords: relevantFieldKeywords,
      ieltsScore,
      financialCapacityEUR,
      country
    }
  };
}

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

/**
 * Handle Personalized Matching via GET and POST
 * /api/universities/match
 */
const handleMatchRoute = async (req, res) => {
  try {
    const payload = req.method === "POST" ? { ...req.query, ...req.body } : req.query;
    const { matches, criteria } = matchUniversityPrograms(payload);

    // If MongoDB is actively connected, we also validate against dynamic Mongoose query
    if (isMongoActive() && criteria.userCGPA !== null) {
      try {
        const mongoQuery = {
          Official_Min_CGPA: { $lte: criteria.userCGPA }
        };

        if (criteria.degreeType && criteria.degreeType.toLowerCase() !== "all") {
          mongoQuery.$or = [
            { degreesOffered: criteria.degreeType },
            { Degree_Level: criteria.degreeType }
          ];
        }

        if (criteria.matchedFieldKeywords && criteria.matchedFieldKeywords.length > 0) {
          mongoQuery.fields = {
            $in: criteria.matchedFieldKeywords.map(k => new RegExp(k, "i"))
          };
        }

        if (criteria.financialCapacityEUR && criteria.financialCapacityEUR > 0) {
          mongoQuery.$and = [
            {
              $or: [
                { tuitionFeeEUR: 0 },
                { tuitionFeeEUR: { $lte: criteria.financialCapacityEUR } }
              ]
            }
          ];
        }

        const mongoResults = await University.find(mongoQuery).lean();
        if (mongoResults && mongoResults.length > 0) {
          return res.json({
            success: true,
            source: "mongodb",
            count: mongoResults.length,
            data: mongoResults,
            matchCriteria: criteria
          });
        }
      } catch (mongoErr) {
        console.warn("MongoDB query fallback to local store:", mongoErr.message);
      }
    }

    // Default fast in-memory store results
    res.json({
      success: true,
      source: "memory-store",
      count: matches.length,
      data: matches,
      matchCriteria: criteria
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

router.get("/match", handleMatchRoute);
router.post("/match", handleMatchRoute);

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

// Attach helper function to router for testing
router.matchUniversityPrograms = matchUniversityPrograms;

module.exports = router;
