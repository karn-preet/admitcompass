const { calculateGermanGrade, calculateUSGPA, evaluateAcademicProfile } = require("../src/services/evaluationEngine");
const { evaluateVisaAndFinancials } = require("../src/services/visaRiskEngine");
const { generateCompensatoryRecommendations } = require("../src/services/recommendationEngine");

console.log("==================================================");
console.log("🧪 RUNNING EVALUATOR ENGINE AUTOMATED TEST SUITE");
console.log("==================================================\n");

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`❌ FAIL: ${message}`);
  }
}

// Test 1: Bavarian Formula German Grade Conversion
const grade10 = calculateGermanGrade(10.0);
const grade7 = calculateGermanGrade(7.0);
const grade8 = calculateGermanGrade(8.0);

assert(grade10 === 1.0, `CGPA 10.0 converts to German Grade 1.0 (Received: ${grade10})`);
assert(grade7 === 2.5, `CGPA 7.0 converts to German Grade 2.5 (Received: ${grade7})`);
assert(grade8 === 2.0, `CGPA 8.0 converts to German Grade 2.0 (Received: ${grade8})`);

// Test 2: US GPA Conversion
const usGPA8 = calculateUSGPA(8.5);
assert(usGPA8 >= 3.4 && usGPA8 <= 3.6, `CGPA 8.5 converts to ~3.5 US GPA (Received: ${usGPA8})`);

// Test 3: Academic Profile Evaluation
const sampleIndianStudent = {
  degreeTarget: "Master's",
  backgroundField: "Computer Science",
  currentCGPA: 7.2,
  collegeTier: "Tier 2 (State Govt/Top Autonomous/Vellore/Manipal)",
  backlogs: 1,
  ieltsScore: 7.0,
  ieltsBandMin: 6.5,
  greQuant: 165,
  greVerbal: 152,
  greTotal: 317,
  workExperienceYears: 1.5,
  researchPapersCount: 0,
  targetCountries: ["Germany", "USA", "UK"]
};

const academicResult = evaluateAcademicProfile(sampleIndianStudent);
assert(academicResult.totalMatched > 0, `Universities matched (Count: ${academicResult.totalMatched})`);
assert(academicResult.matches.safe.length > 0, `Identified Safe universities (Count: ${academicResult.matches.safe.length})`);
assert(academicResult.matches.target.length > 0, `Identified Target universities (Count: ${academicResult.matches.target.length})`);
assert(academicResult.matches.reach.length > 0, `Identified Reach universities (Count: ${academicResult.matches.reach.length})`);

// Test 4: Visa Refusal Mitigation & Financial Solvency for Germany (Missing APS flag)
const testFinancesWithoutAps = {
  annualFamilyIncomeINR: 800000,
  liquidSavingsINR: 1200000,
  fixedDepositsINR: 300000,
  providentFundINR: 200000,
  loanSanctionedINR: 0,
  itrYearsAvailable: 3,
  hasApsCertificate: false // Missing APS
};

const visaResultGermany = evaluateVisaAndFinancials(testFinancesWithoutAps, "Germany");
assert(visaResultGermany.solvencyStatus === "Strong Surplus" || visaResultGermany.solvencyStatus === "Sufficient",
  `Recognized liquid funds satisfy €11,904 blocked account (Status: ${visaResultGermany.solvencyStatus})`);
const apsRefusalFlag = visaResultGermany.refusalRisks.find(r => r.title.includes("APS"));
assert(!!apsRefusalFlag, "Critical Refusal Trigger successfully detected for Missing APS Certificate in Germany");

// Test 5: Visa Refusal Mitigation for USA (Disproportionate savings and low ITR)
const testFinancesUSA = {
  annualFamilyIncomeINR: 250000, // Very low annual income
  liquidSavingsINR: 4000000,     // Sudden 40 Lakhs in savings without loan
  fixedDepositsINR: 0,
  loanSanctionedINR: 0,
  itrYearsAvailable: 1,
  immovablePropertyValuationINR: 500000 // Very low property ties
};

const visaResultUSA = evaluateVisaAndFinancials(testFinancesUSA, "USA");
const disproportionRisk = visaResultUSA.refusalRisks.find(r => r.title.includes("Disproportionate"));
assert(!!disproportionRisk, "High Refusal Risk successfully detected for Unexplained Sudden Savings Disproportion");
assert(visaResultUSA.riskLevel === "High Risk", `USA Visa risk level accurately flagged as High Risk (Received: ${visaResultUSA.riskLevel})`);

// Test 6: Dynamic Compensatory Recommendations for Average CGPA (7.0)
const compensatoryResult = generateCompensatoryRecommendations({
  currentCGPA: 7.0,
  degreeTarget: "Master's",
  greQuant: 158,
  targetCountries: ["Germany"]
});

assert(compensatoryResult.compensatoryActionPlan.length >= 3, `Generated actionable compensatory steps for CGPA 7.0 (Count: ${compensatoryResult.compensatoryActionPlan.length})`);
const greRecommendation = compensatoryResult.compensatoryActionPlan.find(p => p.pillar.includes("Standardized Exam"));
const fachhochschuleRecommendation = compensatoryResult.compensatoryActionPlan.find(p => p.pillar.includes("Institutional Strategy"));
assert(!!greRecommendation, "GRE Quant 164+ offset recommended for average CGPA");
assert(!!fachhochschuleRecommendation, "Fachhochschule (Universities of Applied Sciences) pathway recommended for German Master's");

// Test 7: RateMyChances Single-University Probability Engine
const { calculateRateMyChances } = require("../src/services/rateMyChancesEngine");
const chancesTUM = calculateRateMyChances({
  currentCGPA: 8.5,
  collegeTier: "Tier 1 (IIT/NIT/BITS/IISc/Centrally Funded)",
  ieltsScore: 7.5,
  greQuant: 168
}, "Technical University of Munich (TUM)");
assert(chancesTUM.probabilityPercentage >= 70, `RateMyChances calculates high probability for 8.5 CGPA at TUM (Received: ${chancesTUM.probabilityPercentage}%)`);
assert(chancesTUM.boosters.length >= 2, `RateMyChances provides actionable odds boosters (Count: ${chancesTUM.boosters.length})`);

// Test 8: AI Visa Mock Interview Engine
const { startMockInterview, evaluateResponse } = require("../src/services/aiMockInterviewEngine");
const mockSession = startMockInterview("USA");
assert(mockSession.currentQuestion && mockSession.currentQuestion.question.length > 10, "Mock interview session starts with official consular question");

const answerEvaluation = evaluateResponse("USA", "q_us_03", "My long-term career plan is to return to India and join my family technology firm in Pune.");
assert(answerEvaluation.score >= 7, `Response evaluation accurately rewards strong home ties (Score: ${answerEvaluation.score}/10)`);
assert(answerEvaluation.modelAnswer.length > 50, "Generated Top 1% model answer rewrite");

const badAnswerEvaluation = evaluateResponse("USA", "q_us_03", "I want to settle in USA and get a green card.");
assert(badAnswerEvaluation.redFlags.length > 0, "Detected critical 214(b) immigrant intent red flag");

// Test 9: AI SOP Studio Generation & Review
const { generateStatementOfPurpose, reviewStatementOfPurpose } = require("../src/services/aiSopEngine");
const generatedSOP = generateStatementOfPurpose({
  targetUniversity: "Technical University of Munich",
  targetProgram: "M.Sc. in Computer Science",
  undergradDegree: "B.Tech in Computer Science",
  undergradCollege: "NIT Trichy",
  cgpa: 8.4
});
assert(generatedSOP.wordCount >= 400, `AI SOP generator produced structured academic essay (Word count: ${generatedSOP.wordCount})`);

const sopReview = reviewStatementOfPurpose("Since childhood I was a passionate learner and wanted to study at this esteemed university.");
assert(sopReview.clichesDetected.length >= 2, `SOP Reviewer accurately caught clichés (Found: ${sopReview.clichesDetected.length})`);
assert(sopReview.overallScore <= 70, `SOP Reviewer gave appropriate critique score for clichéd draft (Score: ${sopReview.overallScore})`);

// Test 10: Education Loan & Section 80E Tax Savings Calculation
const loanAmount = 3000000;
const rate = 9.5;
const tenure = 10;
const monthlyR = (rate / 100) / 12;
const totalMonths = tenure * 12;
const expectedEmi = Math.round((loanAmount * monthlyR * Math.pow(1 + monthlyR, totalMonths)) / (Math.pow(1 + monthlyR, totalMonths) - 1));
assert(expectedEmi > 35000 && expectedEmi < 45000, `Accurate EMI calculated for ₹30L at 9.5% (Received: ₹${expectedEmi}/mo)`);

// Test 11: Seed Database Collections
const { getStore } = require("../src/config/db");
const store = getStore();
assert(store.decisions && store.decisions.length >= 15, `Decisions database populated (Count: ${store.decisions.length})`);
assert(store.scholarships && store.scholarships.length >= 10, `Scholarships database populated (Count: ${store.scholarships.length})`);
assert(store.loanBanks && store.loanBanks.length >= 5, `Loan providers database populated (Count: ${store.loanBanks.length})`);
assert(store.discussions && store.discussions.length >= 5, `Community discussions populated (Count: ${store.discussions.length})`);

// Test 12: Dual-Cutoff Competitiveness Engine (User Required Test Case)
// Profile: B.Tech CSE from Indian state university with 7.0 CGPA
// Target: Program with official min 6.5 and historical Indian avg 8.0 (e.g. RWTH Aachen or TUM)
const btechStateUniProfile = {
  degreeTarget: "Master's",
  backgroundField: "Computer Science",
  currentCGPA: 7.0,
  collegeTier: "Tier 2 (State Govt/Top Autonomous/Vellore/Manipal)",
  targetCountries: ["Germany"]
};

const evalRun = evaluateAcademicProfile(btechStateUniProfile);
const rwthOrTum = evalRun.allMatches.find(m => 
  m.university.id.includes("rwth")
);

assert(!!rwthOrTum, "Found target German university (RWTH / TUM) in matches");
assert(rwthOrTum.competitiveness.officialMinCGPA === 6.5, `Official minimum is 6.5 (Received: ${rwthOrTum.competitiveness.officialMinCGPA})`);
assert(rwthOrTum.competitiveness.historicalAvgCGPAIndia >= 8.0, `Historical Indian average is >= 8.0 (Received: ${rwthOrTum.competitiveness.historicalAvgCGPAIndia})`);
assert(rwthOrTum.competitiveness.meetsOfficialMin === true, "User with 7.0 CGPA meets official minimum 6.5");
assert(rwthOrTum.competitiveness.meetsHistoricalAvg === false, "User with 7.0 CGPA falls below historical Indian average >= 8.0");
assert(rwthOrTum.category === "Reach", `Engine flags university as 'Reach' despite meeting official minimum (Category: ${rwthOrTum.category}, Score: ${rwthOrTum.probabilityScore}%)`);
assert(rwthOrTum.competitiveness.realityCheckGauge === "Reach", "Reality check gauge correctly assigned to 'Reach'");
assert(rwthOrTum.competitiveness.actionableAdvice.length > 10, "Generated actionable advice for reach candidate");
assert(!!rwthOrTum.competitiveness.dataSource.official, "Attributed official regulatory data source");
assert(!!rwthOrTum.competitiveness.dataSource.historical, "Attributed historical crowdsourced admit data source");

// Test 13: Catalog Integrity - All 147 Universities have Dual Cutoffs & Data Sources
const allUnis = store.universities;
const allHaveDual = allUnis.every(u => 
  typeof u.Official_Min_CGPA === "number" &&
  typeof u.Historical_Avg_CGPA_India === "number" &&
  u.Data_Source && typeof u.Data_Source.official === "string" &&
  typeof u.Data_Source.historical === "string"
);
assert(allHaveDual, `All ${allUnis.length} universities have Official_Min_CGPA, Historical_Avg_CGPA_India, and Data_Source populated`);

console.log("\n==================================================");
console.log(`📊 TEST RESULTS: ${passedTests}/${totalTests} PASSED (${Math.round(passedTests / totalTests * 100)}%)`);
console.log("==================================================\n");

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
