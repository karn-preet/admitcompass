const express = require("express");
const router = express.Router();
const { evaluateAcademicProfile } = require("../services/evaluationEngine");
const { evaluateVisaAndFinancials } = require("../services/visaRiskEngine");
const { generateCompensatoryRecommendations } = require("../services/recommendationEngine");
const { getOfficialCitationsDirectory } = require("../services/scraperService");
const { getStore } = require("../config/db");

/**
 * POST /api/evaluate
 * Primary Evaluation Endpoint
 * Takes full applicant profile (academic + financial + standardized scores + destination)
 * and returns comprehensive admission probabilities, visa refusal risk analysis,
 * solvency roadmap, and dynamic compensatory actions.
 */
router.post("/", async (req, res) => {
  try {
    const { academic = {}, financial = {}, targetCountry = "Germany" } = req.body;

    // 1. Run Academic Evaluation Engine
    const academicEvaluation = evaluateAcademicProfile({
      ...academic,
      targetCountries: academic.targetCountries && academic.targetCountries.length > 0
        ? academic.targetCountries
        : [targetCountry]
    });

    // 2. Run Visa Refusal Mitigation & Financial Solvency Engine
    const visaEvaluation = evaluateVisaAndFinancials(financial, targetCountry);

    // 3. Run Dynamic Compensatory Recommendations
    const recommendations = generateCompensatoryRecommendations(academic, financial);

    // 4. Attach Official Citations
    const allCitations = getOfficialCitationsDirectory();
    const citations = allCitations.filter(
      c => c.country === targetCountry || 
           c.country === "Germany" || 
           targetCountry === "All EU Countries" ||
           (c.region && c.region.includes("EU")) ||
           (targetCountry && c.country && c.country.toLowerCase() === targetCountry.toLowerCase())
    );

    // 5. Store assessment history in store
    const assessmentResult = {
      id: "eval-" + Date.now(),
      evaluatedAt: new Date().toISOString(),
      studentProfile: {
        academic,
        financial,
        targetCountry
      },
      academicEvaluation,
      visaEvaluation,
      recommendations,
      citations
    };

    const store = getStore();
    store.assessments.push(assessmentResult);

    return res.status(200).json({
      success: true,
      data: assessmentResult
    });
  } catch (error) {
    console.error("Evaluation Error:", error);
    return res.status(500).json({
      success: false,
      error: "Evaluation failed: " + error.message
    });
  }
});

module.exports = router;
