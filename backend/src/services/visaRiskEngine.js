/**
 * Visa Refusal Mitigation & Financial Solvency Analysis Engine
 * Evaluates financial solvency against official government benchmarks (Germany, USA, Canada, UK, Australia, NZ)
 * Flags potential refusal triggers and generates a step-by-step roadmap to legally prove financial solvency.
 */

const { getStore } = require("../config/db");

// Currency conversion baselines (INR benchmarks)
const EXCHANGE_RATES = {
  EUR: 91.0,
  USD: 83.5,
  CAD: 61.5,
  GBP: 106.0,
  AUD: 55.0,
  NZD: 51.0
};

// Benchmark living + tuition requirements per country (INR equivalent)
const FINANCIAL_BENCHMARKS = {
  Germany: {
    requiredLivingINR: 1080000, // €11,904 Blocked Account
    typicalTuitionINR: 150000,  // Public university semester fees + health insurance buffer
    totalRequiredINR: 1250000,
    blockedAccountRequired: true,
    fundSeasoningMonths: 0, // Blocked account acts as upfront proof
    strict28DayRule: false,
    apsRequired: true
  },
  USA: {
    requiredLivingINR: 1600000, // $19,000 USD
    typicalTuitionINR: 2200000, // $26,000 USD out-of-state public tuition
    totalRequiredINR: 3800000,  // Standard 1st year I-20 requirement (~$45k USD)
    blockedAccountRequired: false,
    fundSeasoningMonths: 3,
    strict28DayRule: false,
    apsRequired: false
  },
  Canada: {
    requiredLivingINR: 1300000, // CAD $20,635 GIC requirement
    typicalTuitionINR: 1500000, // CAD $24,000 public university 1st year
    totalRequiredINR: 2800000,
    blockedAccountRequired: true, // GIC
    fundSeasoningMonths: 0,
    strict28DayRule: false,
    apsRequired: false
  },
  UK: {
    requiredLivingINR: 1100000, // £10,224 outside London (9 months)
    typicalTuitionINR: 2800000, // £26,500 public university
    totalRequiredINR: 3900000,
    blockedAccountRequired: false,
    fundSeasoningMonths: 1, // Strict 28 consecutive days holding rule
    strict28DayRule: true,
    apsRequired: false
  },
  Australia: {
    requiredLivingINR: 1650000, // AUD $29,710 living + $2,000 travel
    typicalTuitionINR: 2200000, // AUD $40,000 public university
    totalRequiredINR: 3850000,
    blockedAccountRequired: false,
    fundSeasoningMonths: 3, // 90 days verified seasoning
    strict28DayRule: false,
    apsRequired: false
  },
  "New Zealand": {
    requiredLivingINR: 1050000, // NZD $20,000
    typicalTuitionINR: 1900000, // NZD $38,000
    totalRequiredINR: 2950000,
    blockedAccountRequired: false,
    fundSeasoningMonths: 6, // Or via ANZ Funds Transfer Scheme (FTS)
    strict28DayRule: false,
    apsRequired: false
  },
  France: {
    requiredLivingINR: 680000, // €7,380 statutory minimum (€615/mo)
    typicalTuitionINR: 350000, // Public university tuition €243 - €3,770
    totalRequiredINR: 1050000,
    blockedAccountRequired: false,
    fundSeasoningMonths: 3,
    strict28DayRule: false,
    apsRequired: false
  },
  Italy: {
    requiredLivingINR: 550000, // €6,000 statutory living standard
    typicalTuitionINR: 250000, // Public university tuition €1,000 - €3,000 (often €0 with DSU)
    totalRequiredINR: 800000,
    blockedAccountRequired: false,
    fundSeasoningMonths: 3,
    strict28DayRule: false,
    apsRequired: false
  },
  Netherlands: {
    requiredLivingINR: 1140000, // €12,500 IND living standard
    typicalTuitionINR: 1800000, // €19,000 - €22,000 public research university
    totalRequiredINR: 2940000,
    blockedAccountRequired: true, // University collected escrow deposit
    fundSeasoningMonths: 0,
    strict28DayRule: false,
    apsRequired: false
  },
  Sweden: {
    requiredLivingINR: 1000000, // SEK 103,500 (Migrationsverket requirement)
    typicalTuitionINR: 1500000, // SEK 160,000
    totalRequiredINR: 2500000,
    blockedAccountRequired: false,
    fundSeasoningMonths: 1,
    strict28DayRule: false,
    apsRequired: false
  },
  Finland: {
    requiredLivingINR: 615000, // €6,720 Migri requirement
    typicalTuitionINR: 1100000, // €12,000 (often 50% waived)
    totalRequiredINR: 1715000,
    blockedAccountRequired: false,
    fundSeasoningMonths: 1,
    strict28DayRule: false,
    apsRequired: false
  },
  Belgium: {
    requiredLivingINR: 880000, // €9,636 Belgian blocked account standard
    typicalTuitionINR: 400000, // €4,000 public university
    totalRequiredINR: 1280000,
    blockedAccountRequired: true,
    fundSeasoningMonths: 0,
    strict28DayRule: false,
    apsRequired: false
  },
  Austria: {
    requiredLivingINR: 1000000, // €11,000 OeAD living standard
    typicalTuitionINR: 130000, // €1,453 statutory public tuition
    totalRequiredINR: 1130000,
    blockedAccountRequired: false,
    fundSeasoningMonths: 3,
    strict28DayRule: false,
    apsRequired: false
  },
  Spain: {
    requiredLivingINR: 660000, // €7,200 IPREM benchmark
    typicalTuitionINR: 350000, // €3,800 public university
    totalRequiredINR: 1010000,
    blockedAccountRequired: false,
    fundSeasoningMonths: 3,
    strict28DayRule: false,
    apsRequired: false
  },
  Poland: {
    requiredLivingINR: 500000, // €5,500 Polish living standard
    typicalTuitionINR: 270000, // €3,000 public university
    totalRequiredINR: 770000,
    blockedAccountRequired: false,
    fundSeasoningMonths: 3,
    strict28DayRule: false,
    apsRequired: false
  },
  Switzerland: {
    requiredLivingINR: 2000000, // CHF 21,000 cantonal requirement
    typicalTuitionINR: 140000, // CHF 1,460 federal tuition
    totalRequiredINR: 2140000,
    blockedAccountRequired: false,
    fundSeasoningMonths: 3,
    strict28DayRule: false,
    apsRequired: false
  },
  Ireland: {
    requiredLivingINR: 1100000, // €10,000 - €12,000 living benchmark
    typicalTuitionINR: 2300000, // €25,000 public university
    totalRequiredINR: 3400000,
    blockedAccountRequired: false,
    fundSeasoningMonths: 6,
    strict28DayRule: false,
    apsRequired: false
  },
  "Czech Republic": {
    requiredLivingINR: 600000, // ~CZK 150,000 / €6,000 statutory living
    typicalTuitionINR: 420000, // €4,500 public university
    totalRequiredINR: 1020000,
    blockedAccountRequired: false,
    fundSeasoningMonths: 3,
    strict28DayRule: false,
    apsRequired: false
  },
  Hungary: {
    requiredLivingINR: 500000, // ~€5,500 living standard
    typicalTuitionINR: 450000, // €5,000 public university (or €0 with Stipendium Hungaricum)
    totalRequiredINR: 950000,
    blockedAccountRequired: false,
    fundSeasoningMonths: 3,
    strict28DayRule: false,
    apsRequired: false
  },
  Portugal: {
    requiredLivingINR: 600000, // ~€6,500 living standard
    typicalTuitionINR: 320000, // €3,500 public university
    totalRequiredINR: 920000,
    blockedAccountRequired: false,
    fundSeasoningMonths: 3,
    strict28DayRule: false,
    apsRequired: false
  },
  Denmark: {
    requiredLivingINR: 1000000, // DKK 80,000 (~€10,700)
    typicalTuitionINR: 1250000, // €13,500 public university
    totalRequiredINR: 2250000,
    blockedAccountRequired: false,
    fundSeasoningMonths: 1,
    strict28DayRule: false,
    apsRequired: false
  },
  Luxembourg: {
    requiredLivingINR: 1100000, // €12,000 living requirement
    typicalTuitionINR: 75000,   // €600-€800/yr ultra-low public tuition
    totalRequiredINR: 1175000,
    blockedAccountRequired: false,
    fundSeasoningMonths: 3,
    strict28DayRule: false,
    apsRequired: false
  },
  Slovenia: {
    requiredLivingINR: 550000,
    typicalTuitionINR: 320000,
    totalRequiredINR: 870000,
    blockedAccountRequired: false,
    fundSeasoningMonths: 3,
    strict28DayRule: false,
    apsRequired: false
  },
  Slovakia: {
    requiredLivingINR: 500000,
    typicalTuitionINR: 320000,
    totalRequiredINR: 820000,
    blockedAccountRequired: false,
    fundSeasoningMonths: 3,
    strict28DayRule: false,
    apsRequired: false
  },
  Croatia: {
    requiredLivingINR: 500000,
    typicalTuitionINR: 350000,
    totalRequiredINR: 850000,
    blockedAccountRequired: false,
    fundSeasoningMonths: 3,
    strict28DayRule: false,
    apsRequired: false
  },
  Estonia: {
    requiredLivingINR: 500000,
    typicalTuitionINR: 350000,
    totalRequiredINR: 850000,
    blockedAccountRequired: false,
    fundSeasoningMonths: 3,
    strict28DayRule: false,
    apsRequired: false
  },
  Lithuania: {
    requiredLivingINR: 450000,
    typicalTuitionINR: 320000,
    totalRequiredINR: 770000,
    blockedAccountRequired: false,
    fundSeasoningMonths: 3,
    strict28DayRule: false,
    apsRequired: false
  },
  Latvia: {
    requiredLivingINR: 460000,
    typicalTuitionINR: 350000,
    totalRequiredINR: 810000,
    blockedAccountRequired: false,
    fundSeasoningMonths: 3,
    strict28DayRule: false,
    apsRequired: false
  },
  Greece: {
    requiredLivingINR: 500000,
    typicalTuitionINR: 280000,
    totalRequiredINR: 780000,
    blockedAccountRequired: false,
    fundSeasoningMonths: 3,
    strict28DayRule: false,
    apsRequired: false
  },
  Cyprus: {
    requiredLivingINR: 600000,
    typicalTuitionINR: 400000,
    totalRequiredINR: 1000000,
    blockedAccountRequired: false,
    fundSeasoningMonths: 3,
    strict28DayRule: false,
    apsRequired: false
  },
  Malta: {
    requiredLivingINR: 700000,
    typicalTuitionINR: 750000,
    totalRequiredINR: 1450000,
    blockedAccountRequired: false,
    fundSeasoningMonths: 3,
    strict28DayRule: false,
    apsRequired: false
  },
  Romania: {
    requiredLivingINR: 420000,
    typicalTuitionINR: 300000,
    totalRequiredINR: 720000,
    blockedAccountRequired: false,
    fundSeasoningMonths: 3,
    strict28DayRule: false,
    apsRequired: false
  },
  Bulgaria: {
    requiredLivingINR: 380000,
    typicalTuitionINR: 300000,
    totalRequiredINR: 680000,
    blockedAccountRequired: false,
    fundSeasoningMonths: 3,
    strict28DayRule: false,
    apsRequired: false
  },
  Norway: {
    requiredLivingINR: 1250000, // NOK 151,690 UDI standard
    typicalTuitionINR: 1200000, // NOK 150,000 public tuition for non-EU
    totalRequiredINR: 2450000,
    blockedAccountRequired: true, // Deposit into university escrow account
    fundSeasoningMonths: 0,
    strict28DayRule: false,
    apsRequired: false
  },
  "All EU Countries": {
    requiredLivingINR: 900000, // Average EU living benchmark ~€10,000
    typicalTuitionINR: 350000, // Average public tuition ~€3,800
    totalRequiredINR: 1250000,
    blockedAccountRequired: false,
    fundSeasoningMonths: 3,
    strict28DayRule: false,
    apsRequired: false
  }
};

// Aliases
FINANCIAL_BENCHMARKS["Czechia"] = FINANCIAL_BENCHMARKS["Czech Republic"];
FINANCIAL_BENCHMARKS["United Kingdom"] = FINANCIAL_BENCHMARKS["UK"];

const { COST_OF_LIVING_INDEX_MAP } = require("../data/seedUniversities");

/**
 * Evaluates financial readiness and visa refusal risks
 */
function evaluateVisaAndFinancials(financialData, targetCountry = "Germany") {
  const normalizedCountry = targetCountry === "Czechia" ? "Czech Republic" : (targetCountry === "United Kingdom" ? "UK" : targetCountry);
  const benchmark = FINANCIAL_BENCHMARKS[normalizedCountry] || FINANCIAL_BENCHMARKS[targetCountry] || FINANCIAL_BENCHMARKS.Germany;

  const annualIncomeINR = Number(financialData.annualFamilyIncomeINR) || 0;
  const liquidSavingsINR = Number(financialData.liquidSavingsINR) || 0;
  const fixedDepositsINR = Number(financialData.fixedDepositsINR) || 0;
  const providentFundINR = Number(financialData.providentFundINR) || 0;
  const loanSanctionedINR = Number(financialData.loanSanctionedINR) || 0;
  const propertyValuationINR = Number(financialData.immovablePropertyValuationINR) || 0;
  const itrYears = Number(financialData.itrYearsAvailable) || 0;
  const loanType = financialData.loanBankType || "None";
  const studyGapYears = Number(financialData.studyGapYears) || 0;
  const isGapDocumented = financialData.gapDocumented !== false;
  const hasApsCertificate = financialData.hasApsCertificate === true;

  // Calculate effective liquid funds recognized by visa consulates
  // Note: Most consulates recognize 100% of savings, FDs, approved loans, and ~70% of withdrawable PPF/EPF
  const totalRecognizedLiquidINR = Math.round(
    liquidSavingsINR +
    fixedDepositsINR +
    loanSanctionedINR +
    (providentFundINR * 0.70)
  );

  const fundingGapINR = Math.max(benchmark.totalRequiredINR - totalRecognizedLiquidINR, 0);
  const solvencyRatio = totalRecognizedLiquidINR > 0
    ? Number((totalRecognizedLiquidINR / benchmark.totalRequiredINR).toFixed(2))
    : 0;

  // Determine Solvency Status
  let solvencyStatus = "Deficit";
  if (solvencyRatio >= 1.25) solvencyStatus = "Strong Surplus";
  else if (solvencyRatio >= 1.0) solvencyStatus = "Sufficient";
  else if (solvencyRatio >= 0.75) solvencyStatus = "Moderate Deficit";
  else solvencyStatus = "Severe Deficit";

  // Refusal Risk Factors
  const refusalRisks = [];
  const positiveHighlights = [];
  let riskScore = 20; // baseline risk out of 100 (lower is better)

  // 1. Funding gap check
  if (fundingGapINR > 0) {
    riskScore += 40;
    refusalRisks.push({
      severity: "CRITICAL",
      title: "Funding Shortfall",
      detail: `Your recognized liquid funds (₹${(totalRecognizedLiquidINR / 100000).toFixed(1)} Lakhs) fall short of ${targetCountry}'s first-year statutory requirement of ₹${(benchmark.totalRequiredINR / 100000).toFixed(1)} Lakhs by ₹${(fundingGapINR / 100000).toFixed(1)} Lakhs.`
    });
  } else {
    positiveHighlights.push(`Liquid funds (₹${(totalRecognizedLiquidINR / 100000).toFixed(1)} Lakhs) fully satisfy ${targetCountry}'s first-year financial threshold.`);
  }

  // 2. ITR & Source of Funds Audit
  if (itrYears === 0) {
    riskScore += 25;
    refusalRisks.push({
      severity: "HIGH",
      title: "Zero Income Tax Returns (ITR)",
      detail: "No ITR filed for sponsors. Visa officers in Australia, USA, and Canada require verified ITR-V forms to prove legitimate fund origin and prevent money laundering concerns."
    });
  } else if (itrYears < 2) {
    riskScore += 12;
    refusalRisks.push({
      severity: "MEDIUM",
      title: "Single Year ITR",
      detail: "Only 1 year of ITR available. Most embassies prefer 2-3 consecutive assessment years."
    });
  } else {
    positiveHighlights.push(`${itrYears} years of sponsor ITRs provided (strong legal paper trail).`);
  }

  // 3. ITR to Savings Disproportion (The "Unexplained Sudden Wealth" Trap)
  // If liquid savings is huge (e.g. ₹40L) but annual income is very small (₹2L), flags artificial fund planting
  if (annualIncomeINR > 0 && liquidSavingsINR > annualIncomeINR * 4 && loanSanctionedINR === 0) {
    riskScore += 25;
    refusalRisks.push({
      severity: "HIGH",
      title: "Disproportionate Savings to Income Ratio",
      detail: `Savings of ₹${(liquidSavingsINR / 100000).toFixed(1)} Lakhs is unusually high compared to declared annual family income of ₹${(annualIncomeINR / 100000).toFixed(1)} Lakhs without an education loan. High risk of refusal unless supported by sale of ancestral asset deed or maturity proof.`
    });
  }

  // Low Sponsor Income baseline for high-cost destinations (USA/Australia/UK)
  if (["USA", "Australia", "UK"].includes(targetCountry) && annualIncomeINR > 0 && annualIncomeINR < 400000 && loanSanctionedINR === 0) {
    riskScore += 15;
    refusalRisks.push({
      severity: "HIGH",
      title: "Low Annual Sponsor Income for High-Cost Destination",
      detail: `Declared annual family income (₹${(annualIncomeINR / 100000).toFixed(1)} Lakhs) is insufficient to support living costs and ongoing study in ${targetCountry} without an approved bank education loan.`
    });
  }

  // 4. Country Specific Mandates
  if (targetCountry === "Germany") {
    if (!hasApsCertificate) {
      riskScore += 50;
      refusalRisks.push({
        severity: "CRITICAL",
        title: "Missing APS India Certificate",
        detail: "Mandatory since Nov 2022. German Consulates and VFS Global will NOT accept or process any student visa application without the original digital APS verification certificate."
      });
    } else {
      positiveHighlights.push("APS Certificate verified (Prerequisite completed for Germany).");
    }

    if (totalRecognizedLiquidINR >= benchmark.requiredLivingINR) {
      positiveHighlights.push(`Sufficient liquid reserves to fund the mandatory €11,904 Blocked Account (Sperrkonto).`);
    }
  }

  if (targetCountry === "USA") {
    if (propertyValuationINR > 2000000) {
      positiveHighlights.push(`Substantial family property valuation (₹${(propertyValuationINR / 100000).toFixed(1)} Lakhs) provides compelling evidence of ties to India to overcome Section 214(b) non-immigrant intent refusal.`);
    } else {
      riskScore += 10;
      refusalRisks.push({
        severity: "MEDIUM",
        title: "Weak Immovable Asset Ties (Section 214(b) Risk)",
        detail: "Limited property documentation. US Visa Consular Officers evaluate family roots and assets in India to ensure applicant will return post-study."
      });
    }
  }

  if (targetCountry === "Canada") {
    if (totalRecognizedLiquidINR < 2500000) {
      riskScore += 15;
      refusalRisks.push({
        severity: "HIGH",
        title: "GIC & 1st Year Tuition Cushion",
        detail: "IRCC requires full CAD $20,635 in GIC plus paid 1st-year tuition receipt. Minimum ₹28 Lakhs total buffer recommended."
      });
    }
  }

  if (targetCountry === "Australia") {
    if (loanType.includes("Unsecured") || loanType.includes("NBFC")) {
      riskScore += 18;
      refusalRisks.push({
        severity: "HIGH",
        title: "Unsecured NBFC Loan Scrutiny",
        detail: "Australian Department of Home Affairs heavily scrutinizes high-interest unsecured NBFC loans. Loans from public commercial banks (SBI, BoB, Canara, PNB) carry dramatically higher approval rates."
      });
    } else if (loanType.includes("Public Sector")) {
      positiveHighlights.push("Education loan backed by a Nationalized / Public Sector Scheduled Bank (high credibility with immigration).");
    }
  }

  if (targetCountry === "UK") {
    positiveHighlights.push("UKVI 28-day continuous fund holding rule applies: ensure exact required balance remains unwithdrawn for 28 straight days.");
  }

  // 5. Study Gap Risk
  if (studyGapYears > 1) {
    if (!isGapDocumented) {
      riskScore += 25;
      refusalRisks.push({
        severity: "HIGH",
        title: "Undocumented Study Gap",
        detail: `A ${studyGapYears}-year gap in study or employment without official experience letters, salary slips, or ITRs triggers severe immigration doubts across all destinations.`
      });
    } else {
      positiveHighlights.push(`Study gap of ${studyGapYears} years is backed by professional employment documentation.`);
    }
  }

  // Clamp Risk Score (10 to 95)
  riskScore = Math.min(Math.max(riskScore, 10), 95);

  let riskLevel = "Low Risk";
  let approvalProbability = 85;
  if (riskScore >= 65) {
    riskLevel = "High Risk";
    approvalProbability = Math.max(100 - riskScore, 15);
  } else if (riskScore >= 40) {
    riskLevel = "Moderate Risk";
    approvalProbability = Math.max(100 - riskScore, 45);
  } else {
    approvalProbability = Math.max(100 - riskScore, 80);
  }

  // Custom step-by-step roadmap to legally prove solvency
  const customRoadmap = generateLegalRoadmap(targetCountry, fundingGapINR, loanType, itrYears, hasApsCertificate);

  return {
    targetCountry,
    solvencyStatus,
    solvencyRatio,
    totalRecognizedLiquidINR,
    requiredLivingINR: benchmark.requiredLivingINR,
    typicalTuitionINR: benchmark.typicalTuitionINR,
    totalRequiredINR: benchmark.totalRequiredINR,
    fundingGapINR,
    Cost_of_Living_Index: COST_OF_LIVING_INDEX_MAP[targetCountry] || COST_OF_LIVING_INDEX_MAP[normalizedCountry] || 60.0,
    costOfLivingIndex: COST_OF_LIVING_INDEX_MAP[targetCountry] || COST_OF_LIVING_INDEX_MAP[normalizedCountry] || 60.0,
    riskScore,
    riskLevel,
    approvalProbability,
    refusalRisks,
    positiveHighlights,
    customRoadmap
  };
}

/**
 * Generates tailored legal roadmap for Indian parents & applicants
 */
function generateLegalRoadmap(country, fundingGapINR, loanType, itrYears, hasAps) {
  const steps = [];

  if (country === "Germany") {
    if (!hasAps) {
      steps.push({
        order: 1,
        title: "Apply for APS Certificate (Urgent Prerequisite)",
        action: "Register on aps-india.de, pay ₹18,000, and courier notarized Bachelor transcripts and degree. Typical lead time is 4-6 weeks."
      });
    }
    steps.push({
      order: 2,
      title: "Secure Public University Offer (Zulassungsbescheid)",
      action: "Submit applications via Uni-Assist or direct university Campo/TUMonline portals before May 31 / July 15."
    });
    steps.push({
      order: 3,
      title: "Open Digital Blocked Account (Sperrkonto)",
      action: "Create an account with German Federal Foreign Office approved providers: Expatrio or Coracle. Fund €11,904 via Indian Bank A2 outward remittance under RBI's Liberalised Remittance Scheme (LRS)."
    });
    steps.push({
      order: 4,
      title: "Activate Statutory Health Insurance Confirmation",
      action: "Enroll in TK (Techniker Krankenkasse) or Barmer (~€125/mo) bundled through your blocked account package."
    });
    steps.push({
      order: 5,
      title: "Collate Sponsor Tax Dossier",
      action: "Gather 2-3 years of Form 16 / ITR-V, 6-month bank statements with official branch seal, and motivation letter for VFS Global appointment."
    });
  } else if (country === "USA") {
    steps.push({
      order: 1,
      title: "Obtain Form I-20 & Verify Financial Listing",
      action: "Submit bank balance certificate to university international office to generate Form I-20 with accurate tuition and living expense lines."
    });
    if (fundingGapINR > 0) {
      steps.push({
        order: 2,
        title: "Bridge Financial Shortfall with Sanctioned Bank Loan",
        action: `Secure an education loan of at least ₹${(fundingGapINR / 100000).toFixed(1)} Lakhs from an Indian Scheduled Public Bank (SBI Global Ed-Vantage / Canara) or HDFC Credila.`
      });
    }
    steps.push({
      order: 3,
      title: "Chartered Accountant (CA) Net Worth Assessment",
      action: "Obtain an official CA Net Worth Statement aggregating liquid assets, provident funds, fixed deposits, and ancestral property valuations."
    });
    steps.push({
      order: 4,
      title: "Pay SEVIS I-901 Fee ($350) and Complete DS-160",
      action: "Fill DS-160 carefully. Ensure employment history matches resume and tax documents to avoid 221(g) administrative processing."
    });
    steps.push({
      order: 5,
      title: "Section 214(b) Interview Preparation",
      action: "Practice crisp 2-minute interview answers demonstrating firm career roadmap in India and clear intention to return home post-studies."
    });
  } else if (country === "Canada") {
    steps.push({
      order: 1,
      title: "Acquire Provincial Attestation Letter (PAL) & Letter of Acceptance (LOA)",
      action: "Confirm with public university that your admission is tagged with a provincial cap quota allocation."
    });
    steps.push({
      order: 2,
      title: "Purchase CAD $20,635 Guaranteed Investment Certificate (GIC)",
      action: "Wire CAD $20,635 to Scotiabank, CIBC, or ICICI Bank Canada to obtain the mandatory GIC certificate."
    });
    steps.push({
      order: 3,
      title: "Pay Full 1st Year Tuition & Retain Official Receipt",
      action: "Pay tuition directly through Flywire / Convera to receive official DLI receipt required for study permit filing."
    });
    steps.push({
      order: 4,
      title: "Draft Strategic Letter of Explanation (LOE)",
      action: "Address career progression, reason for choosing Canada, and concrete job market opportunities in India upon degree completion."
    });
  } else if (country === "UK") {
    steps.push({
      order: 1,
      title: "Request CAS (Confirmation of Acceptance for Studies)",
      action: "Accept unconditional offer, pay deposit, and review CAS draft for tuition and fee balance accuracy."
    });
    steps.push({
      order: 2,
      title: "Initiate 28-Day Unbroken Fund Holding Window",
      action: "Deposit required maintenance (£10,224 outside London) plus unpaid tuition in a single savings account in student's or biological parents' name. Do not touch or let the balance drop by ₹1 for 28 consecutive days."
    });
    steps.push({
      order: 3,
      title: "Undergo Mandatory Tuberculosis (TB) Screening",
      action: "Complete test at an approved IOM clinic in New Delhi, Mumbai, Chennai, Hyderabad, Ahmedabad, or Bangalore."
    });
    steps.push({
      order: 4,
      title: "Obtain ATAS Clearance Certificate (For STEM degrees)",
      action: "Submit online ATAS application with university course CAH3 code (allow 4 weeks lead time)."
    });
  } else if (country === "Australia") {
    steps.push({
      order: 1,
      title: "Ensure 3-Month Fund Seasoning (90 Days)",
      action: "Funds in savings or FDs must show clear banking history of at least 90 days. Avoid recent unexplainable lump-sum deposits."
    });
    steps.push({
      order: 2,
      title: "Genuine Student (GS) Narrative Formulation",
      action: "Write substantive evidence explaining how Australian qualification delivers salary growth in India compared to domestic programs."
    });
    steps.push({
      order: 3,
      title: "Purchase Overseas Student Health Cover (OSHC)",
      action: "Obtain comprehensive OSHC policy (Allianz / Bupa / Medibank) covering the full visa tenure."
    });
  } else if (country === "France") {
    steps.push({
      order: 1,
      title: "Campus France Études en France (EEF) Procedure",
      action: "Register on Campus France India portal and schedule your mandatory academic interview."
    });
    steps.push({
      order: 2,
      title: "Secure Housing Certificate (Attestation d'hébergement)",
      action: "Book student residence (CROUS or private studio) as French visa requires confirmed lodging address."
    });
    steps.push({
      order: 3,
      title: "Gather 3-Month Bank Statements & ITRs",
      action: "Ensure bank accounts show minimum €7,380 (~₹6.8 Lakhs) living funds plus any unpaid first-year tuition."
    });
    steps.push({
      order: 4,
      title: "Submit Long-Stay Visa (VLS-TS) at VFS Global",
      action: "Lodge visa application and validate OFII sticker online within 3 months of arrival in France."
    });
  } else if (country === "Italy") {
    steps.push({
      order: 1,
      title: "Complete Universitaly Pre-enrolment",
      action: "Submit pre-enrolment application on universitaly.it and receive university approval summary."
    });
    steps.push({
      order: 2,
      title: "Obtain CIMEA Statement of Comparability / DOV",
      action: "Legalize degree certificates with MEA Apostille or apply on cimea.it for instant comparability."
    });
    steps.push({
      order: 3,
      title: "Apply for DSU / Regional Full Tuition Waiver",
      action: "Prepare family ITR and property documents translated into Italian for ISEE Parificato evaluation."
    });
    steps.push({
      order: 4,
      title: "Lodge Type D Study Visa at VFS Italy",
      action: "Provide parents' bank statements showing at least €6,000 (~₹5.5L) with official bank seal."
    });
  } else if (country === "Netherlands") {
    steps.push({
      order: 1,
      title: "Accept Unconditional University Offer",
      action: "Confirm admission with your Dutch public university to initiate institutional visa sponsorship."
    });
    steps.push({
      order: 2,
      title: "Transfer Living Cost Deposit (€12,500) to University",
      action: "Deposit required €12,500 maintenance funds into the university's escrow account as mandated by IND."
    });
    steps.push({
      order: 3,
      title: "Collect MVV Passport Sticker via VFS Global",
      action: "Once IND approves within 2-4 weeks, attend appointment in New Delhi/Mumbai to receive entry visa."
    });
  } else if (country === "Sweden") {
    steps.push({
      order: 1,
      title: "Pay 1st Semester Tuition to Swedish University",
      action: "Tuition invoice must be cleared before Migrationsverket will evaluate your residence permit."
    });
    steps.push({
      order: 2,
      title: "Transfer SEK 103,500 to Student's Personal Account",
      action: "CRITICAL: Migrationsverket strictly rejects parents' accounts. Funds must be in applicant's own name."
    });
    steps.push({
      order: 3,
      title: "Submit Online Residence Permit Application",
      action: "File online on migrationsverket.se and book biometrics appointment at Embassy of Sweden in New Delhi."
    });
  } else if (country === "Finland") {
    steps.push({
      order: 1,
      title: "Accept Admission & Merit Scholarship on Studyinfo.fi",
      action: "Confirm study place and check if 50%-100% tuition waiver is granted."
    });
    steps.push({
      order: 2,
      title: "Hold €6,720 in Student's Personal Bank Account",
      action: "Finnish Migri requires living funds to be directly accessible in applicant's personal bank account."
    });
    steps.push({
      order: 3,
      title: "Purchase Comprehensive Private Health Insurance",
      action: "Secure Swisscare/SIP student health coverage with minimum €120,000 medical emergency ceiling."
    });
  } else if (country === "Austria") {
    steps.push({
      order: 1,
      title: "Obtain MEA Apostille on Academic Degrees & PCC",
      action: "Austria requires all educational certificates and Police Clearance Certificate to be apostilled."
    });
    steps.push({
      order: 2,
      title: "Book Confirmed OeAD Accommodation",
      action: "Submit housing rental contract with student residence in Vienna or Graz."
    });
    steps.push({
      order: 3,
      title: "File Aufenthaltsbewilligung - Student at Austrian Embassy",
      action: "Present proof of living funds (~€11,000/yr) and submit for federal provincial approval."
    });
  } else if (country === "Spain") {
    steps.push({
      order: 1,
      title: "Legalize PCC & Medical Certificate with MEA Apostille",
      action: "Obtain official Spanish translations of criminal background check and health certificate."
    });
    steps.push({
      order: 2,
      title: "Prepare 6-Month Bank Statements (IPREM €7,200/yr)",
      action: "Show parents' bank statements and notarized financial sponsorship commitment."
    });
    steps.push({
      order: 3,
      title: "Submit National Study Visa at BLS Spain Centre",
      action: "Ensure health insurance has zero co-pay and covers repatriation."
    });
  } else if (country === "Poland") {
    steps.push({
      order: 1,
      title: "Apostille Degree Certificates via MEA India",
      action: "Legalize Bachelor transcripts for Polish university nostrification."
    });
    steps.push({
      order: 2,
      title: "Prepare €5,500 Living Funds & Student Housing Proof",
      action: "Show bank balance certificate and paid 1st semester tuition receipt."
    });
    steps.push({
      order: 3,
      title: "Book e-Konsulat Appointment and Submit Type D Visa",
      action: "Attend visa submission at VFS Global Poland in India."
    });
  } else if (country === "Switzerland") {
    steps.push({
      order: 1,
      title: "Hold CHF 21,000 in Student Bank Account",
      action: "Swiss cantonal authorities require an official bank solvency letter confirming liquid availability."
    });
    steps.push({
      order: 2,
      title: "Draft Written Return Intent Declaration",
      action: "Provide explicit written statement promising to depart Switzerland upon completion of degree."
    });
    steps.push({
      order: 3,
      title: "Submit National Visa D at VFS Switzerland",
      action: "Application is forwarded directly to the Cantonal Migration Authority (e.g. Zurich or Vaud)."
    });
  } else {
    steps.push({
      order: 1,
      title: "Register for Funds Transfer Scheme (FTS)",
      action: "Open an ANZ Bank FTS account with NZD $20,000 for simplified INZ financial clearance."
    });
    steps.push({
      order: 2,
      title: "Apply under Approval in Principle (AIP) stream",
      action: "Hold tuition payment until INZ issues AIP approval letter."
    });
  }

  return steps;
}

module.exports = {
  EXCHANGE_RATES,
  FINANCIAL_BENCHMARKS,
  evaluateVisaAndFinancials
};
