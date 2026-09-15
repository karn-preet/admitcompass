const express = require("express");
const router = express.Router();
const { getStore } = require("../config/db");
const { FINANCIAL_BENCHMARKS, EXCHANGE_RATES } = require("../services/visaRiskEngine");

/**
 * GET /api/visa-rules
 * Get all country-specific visa and financial rules
 */
router.get("/", (req, res) => {
  try {
    const store = getStore();
    res.json({
      success: true,
      data: store.visaRules,
      benchmarks: FINANCIAL_BENCHMARKS,
      exchangeRates: EXCHANGE_RATES
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/visa-rules/:country
 * Get visa rules for a specific destination
 */
router.get("/:country", (req, res) => {
  try {
    const { country } = req.params;
    const store = getStore();
    const rules = store.visaRules[country];

    if (!rules) {
      return res.status(404).json({
        success: false,
        error: `Visa rules for '${country}' not found. Available destinations: Germany, USA, Canada, UK, Australia, New Zealand.`
      });
    }

    res.json({
      success: true,
      country,
      data: rules,
      benchmark: FINANCIAL_BENCHMARKS[country] || null
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
