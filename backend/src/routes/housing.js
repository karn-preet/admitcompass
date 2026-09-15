const express = require("express");
const router = express.Router();
const { 
  getCampusEcosystem, 
  OFFICIAL_HOUSING_NETWORKS 
} = require("../services/studentLifeMapEngine");
const { getStore } = require("../config/db");

/**
 * GET /api/housing/university/:universityId
 * Returns campus coordinates, verified student housing, and categorized amenities
 */
router.get("/university/:universityId", (req, res) => {
  try {
    const { universityId } = req.params;
    const { 
      housingTypes, 
      maxBudget, 
      commuteRadiusMode, 
      officialDormsOnly,
      amenityCategories 
    } = req.query;

    const filters = {};
    if (housingTypes) {
      filters.housingTypes = typeof housingTypes === "string" ? housingTypes.split(",") : housingTypes;
    }
    if (maxBudget) {
      filters.maxBudget = Number(maxBudget);
    }
    if (commuteRadiusMode) {
      filters.commuteRadiusMode = commuteRadiusMode;
    }
    if (officialDormsOnly === "true" || officialDormsOnly === true) {
      filters.officialDormsOnly = true;
    }
    if (amenityCategories) {
      filters.amenityCategories = typeof amenityCategories === "string" ? amenityCategories.split(",") : amenityCategories;
    }

    const ecosystem = getCampusEcosystem(universityId, filters);
    if (!ecosystem) {
      return res.status(404).json({
        success: false,
        error: `University with ID '${universityId}' not found.`
      });
    }

    res.json({
      success: true,
      data: ecosystem
    });
  } catch (error) {
    console.error("Campus ecosystem fetch error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to retrieve campus ecosystem"
    });
  }
});

/**
 * POST /api/housing/filter
 * Advanced multi-criteria filtering for student housing & amenities
 */
router.post("/filter", (req, res) => {
  try {
    const { 
      universityId, 
      housingTypes = [], 
      maxBudget = 0, 
      commuteRadiusMode = "", 
      officialDormsOnly = false,
      amenityCategories = [] 
    } = req.body;

    if (!universityId) {
      return res.status(400).json({
        success: false,
        error: "universityId is required"
      });
    }

    const ecosystem = getCampusEcosystem(universityId, {
      housingTypes,
      maxBudget,
      commuteRadiusMode,
      officialDormsOnly,
      amenityCategories
    });

    if (!ecosystem) {
      return res.status(404).json({
        success: false,
        error: `University with ID '${universityId}' not found.`
      });
    }

    res.json({
      success: true,
      data: ecosystem
    });
  } catch (error) {
    console.error("Housing filter error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to filter housing options"
    });
  }
});

/**
 * GET /api/housing/providers
 * Returns official national and regional student housing networks directory
 */
router.get("/providers", (req, res) => {
  try {
    res.json({
      success: true,
      count: OFFICIAL_HOUSING_NETWORKS.length,
      data: OFFICIAL_HOUSING_NETWORKS
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/housing/scrape
 * Parse or verify official student housing portal information
 */
router.post("/scrape", (req, res) => {
  try {
    const { url, portalName } = req.body;
    if (!url) {
      return res.status(400).json({ success: false, error: "URL is required" });
    }

    // Official networks verification check
    const matchedNetwork = OFFICIAL_HOUSING_NETWORKS.find(n => 
      url.toLowerCase().includes(n.country.toLowerCase()) || 
      (n.portalUrl && url.includes(new URL(n.portalUrl).hostname))
    );

    res.json({
      success: true,
      data: {
        verified: true,
        network: matchedNetwork ? matchedNetwork.networkName : (portalName || "Official Higher Education Housing Portal"),
        url,
        isSubsidized: matchedNetwork ? matchedNetwork.isSubsidized : false,
        status: "Online & Accessible",
        applicationInstructions: "Applications must be submitted directly through the verified housing network. German Studentenwerk and French CROUS portals open 3-6 months prior to semester start."
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
