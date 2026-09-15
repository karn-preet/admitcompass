const express = require("express");
const router = express.Router();
const { getStore } = require("../config/db");

/**
 * GET /api/loans/providers
 * Returns comparison list of verified education loan providers
 */
router.get("/providers", (req, res) => {
  try {
    const store = getStore();
    const providers = store.loanBanks || [];
    res.json({
      success: true,
      count: providers.length,
      data: providers
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/loans/calculate
 * Computes monthly EMI, total interest, total repayment, and Section 80E tax savings
 * Body: { loanAmountINR, interestRatePercent, tenureYears, moratoriumMonths, taxBracketPercent }
 */
router.post("/calculate", (req, res) => {
  try {
    const {
      loanAmountINR = 3000000, // ₹30 Lakhs
      interestRatePercent = 9.5, // 9.5%
      tenureYears = 10, // 10 years
      moratoriumMonths = 24, // 2 years study + 6 months cushion
      taxBracketPercent = 30 // 30% parent tax bracket
    } = req.body;

    const principal = Number(loanAmountINR);
    const annualRate = Number(interestRatePercent);
    const years = Number(tenureYears);
    const moratorium = Number(moratoriumMonths);
    const taxBracket = Number(taxBracketPercent) / 100;

    // Monthly interest rate
    const r = (annualRate / 100) / 12;
    const totalMonths = years * 12;

    // Standard EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
    const emi = Math.round(
      (principal * r * Math.pow(1 + r, totalMonths)) / (Math.pow(1 + r, totalMonths) - 1)
    );

    const totalRepaymentDuringAmortization = emi * totalMonths;
    const totalInterestPaid = totalRepaymentDuringAmortization - principal;

    // Simple interest during moratorium (if serviced or added)
    const moratoriumInterest = Math.round(principal * (annualRate / 100) * (moratorium / 12));

    // Section 80E Tax Deduction calculation
    // Section 80E allows 100% of interest paid on education loans from scheduled banks
    // to be deducted from taxable income for 8 consecutive assessment years.
    // Average annual interest across first 8 years:
    const approx8YearInterest = Math.round(totalInterestPaid * 0.85);
    const potentialTaxSavings80E = Math.round(approx8YearInterest * (taxBracket * 1.04)); // including 4% cess

    const effectiveNetCostOfLoan = (principal + totalInterestPaid) - potentialTaxSavings80E;

    res.json({
      success: true,
      data: {
        principalAmountINR: principal,
        interestRatePercent: annualRate,
        tenureYears: years,
        moratoriumMonths: moratorium,
        monthlyEmiINR: emi,
        totalInterestPayableINR: totalInterestPaid,
        totalRepaymentINR: principal + totalInterestPaid,
        moratoriumInterestINR: moratoriumInterest,
        section80ETaxSavingsINR: potentialTaxSavings80E,
        effectiveNetLoanCostINR: effectiveNetCostOfLoan,
        annualSavingsEstimated: Math.round(potentialTaxSavings80E / 8)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
