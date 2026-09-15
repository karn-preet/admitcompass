const express = require("express");
const router = express.Router();
const { 
  calculatePortalBundledFees, 
  calculatePreAdmissionBudget, 
  getUniversityCostBreakdown,
  PORTAL_RULES,
  STANDARD_EXAM_FEES,
  DOCUMENT_FEES
} = require("../services/preAdmissionCostEngine");
const { publicUniversities } = require("../data/seedUniversities");

/**
 * POST /api/application-cart/calculate
 * Calculates multi-application bundling discounts, pre-admission sunk costs, and post-admission fees
 */
router.post("/calculate", (req, res) => {
  try {
    const { 
      items = [], 
      selectedExams = { ielts: true, gre: false, toefl: false, testas: false }, 
      originCountry = "India", 
      includeAps = null, 
      includeApostille = true,
      includeCourier = false
    } = req.body;

    // Hydrate items if only IDs were passed
    const hydratedItems = items.map(item => {
      if (typeof item === "string") {
        const found = publicUniversities.find(u => u.id === item);
        return found || { id: item, name: item, Application_Portal_Type: "Direct", Application_Fee_Amount: 0 };
      }
      if (item && item.id && (!item.Application_Portal_Type || item.Application_Fee_Amount === undefined)) {
        const found = publicUniversities.find(u => u.id === item.id);
        if (found) {
          return {
            ...found,
            ...item
          };
        }
      }
      return item;
    });

    const budget = calculatePreAdmissionBudget({
      items: hydratedItems,
      selectedExams,
      originCountry,
      includeAps,
      includeApostille,
      includeCourier
    });

    // Provide detailed two-card breakdown for all hydrated items
    const itemBreakdowns = hydratedItems.map(item => getUniversityCostBreakdown(item, originCountry));

    return res.json({
      success: true,
      data: {
        ...budget,
        itemsCount: hydratedItems.length,
        itemBreakdowns,
        portalRulesCatalog: Object.entries(PORTAL_RULES).map(([key, val]) => ({
          portalKey: key,
          portalName: val.name,
          bundlingDescription: val.bundlingDescription
        }))
      }
    });
  } catch (error) {
    console.error("Application cart calculation error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to calculate application cart budget"
    });
  }
});

/**
 * GET /api/application-cart/university-cost/:id
 * Fetches the two-card Hidden Costs breakdown for a specific university
 */
router.get("/university-cost/:id", (req, res) => {
  try {
    const { id } = req.params;
    const originCountry = req.query.originCountry || "India";
    const uni = publicUniversities.find(u => u.id === id);

    if (!uni) {
      return res.status(404).json({
        success: false,
        error: "University not found"
      });
    }

    const breakdown = getUniversityCostBreakdown(uni, originCountry);
    return res.json({
      success: true,
      data: breakdown
    });
  } catch (error) {
    console.error("University cost breakdown error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch university cost breakdown"
    });
  }
});

module.exports = router;
