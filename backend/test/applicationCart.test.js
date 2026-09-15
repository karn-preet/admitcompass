const { publicUniversities } = require("../src/data/seedUniversities");
const { 
  calculatePortalBundledFees, 
  calculatePreAdmissionBudget, 
  getUniversityCostBreakdown,
  PORTAL_RULES
} = require("../src/services/preAdmissionCostEngine");
const { extractHiddenFeeKeywords } = require("../src/services/scraperService");

console.log("===============================================================");
console.log("🧪 RUNNING HIDDEN PRE-ADMISSION & ENROLLMENT COSTS TEST SUITE");
console.log("===============================================================\n");

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

// 1. Database Schema Verification
console.log("\n--- TEST GROUP 1: Database Schema Verification ---");
assert(publicUniversities.length === 147, `Should have 147 public universities (Found: ${publicUniversities.length})`);

let allHaveAppFee = true;
let allHavePortal = true;
let allHaveSemesterFee = true;
let uniAssistCount = 0;
let swedenCount = 0;
let directCount = 0;

publicUniversities.forEach(u => {
  if (typeof u.Application_Fee_Amount !== "number") allHaveAppFee = false;
  if (typeof u.Application_Portal_Type !== "string") allHavePortal = false;
  if (typeof u.Enrollment_Semester_Fee !== "number") allHaveSemesterFee = false;

  if (u.Application_Portal_Type === "Uni-assist") uniAssistCount++;
  if (u.Application_Portal_Type === "University Admissions Sweden") swedenCount++;
  if (u.Application_Portal_Type === "Direct") directCount++;
});

assert(allHaveAppFee, "All 147 universities have numeric Application_Fee_Amount");
assert(allHavePortal, "All 147 universities have string Application_Portal_Type");
assert(allHaveSemesterFee, "All 147 universities have numeric Enrollment_Semester_Fee");
assert(uniAssistCount > 0, `Universities identified with Uni-assist portal (Count: ${uniAssistCount})`);
assert(swedenCount > 0, `Universities identified with Sweden Antagning portal (Count: ${swedenCount})`);
assert(directCount > 0, `Universities identified with Direct portal (Count: ${directCount})`);

// German universities mandatory semester contribution check
const germanUnis = publicUniversities.filter(u => u.country === "Germany");
const allGermanHaveSemesterFee = germanUnis.every(u => u.Enrollment_Semester_Fee >= 50 && u.Enrollment_Fee_Breakdown);
assert(allGermanHaveSemesterFee, `All ${germanUnis.length} German public universities specify mandatory Semesterbeitrag with transit pass breakdown`);

// 2. Multi-Application Portal Bundling Calculator
console.log("\n--- TEST GROUP 2: Multi-Application Portal Bundling Calculator ---");
const threeUniAssist = [
  { id: "de-1", name: "Uni Cologne", country: "Germany", Application_Portal_Type: "Uni-assist", Application_Fee_Amount: 75 },
  { id: "de-2", name: "TU Berlin", country: "Germany", Application_Portal_Type: "Uni-assist", Application_Fee_Amount: 75 },
  { id: "de-3", name: "Uni Leipzig", country: "Germany", Application_Portal_Type: "Uni-assist", Application_Fee_Amount: 75 }
];

const bundlingResult = calculatePortalBundledFees(threeUniAssist);
const uniAssistPortal = bundlingResult.groupedPortals["Uni-assist"];

assert(uniAssistPortal.count === 3, "Uni-assist program count is 3");
assert(uniAssistPortal.bundledFee === 135, `3 German programs via uni-assist calculate to exactly €135 (€75 + 2 × €30) (Received: €${uniAssistPortal.bundledFee})`);
assert(uniAssistPortal.unbundledFee === 225, `Unbundled rate is €225 (Received: €${uniAssistPortal.unbundledFee})`);
assert(uniAssistPortal.savings === 90, `Bundling savings equals €90 (Received: €${uniAssistPortal.savings})`);

// Sweden flat fee check
const threeSweden = [
  { id: "se-1", name: "KTH", country: "Sweden", Application_Portal_Type: "University Admissions Sweden", Application_Fee_Amount: 80 },
  { id: "se-2", name: "Chalmers", country: "Sweden", Application_Portal_Type: "University Admissions Sweden", Application_Fee_Amount: 80 },
  { id: "se-3", name: "Lund", country: "Sweden", Application_Portal_Type: "University Admissions Sweden", Application_Fee_Amount: 80 }
];
const swedenResult = calculatePortalBundledFees(threeSweden);
const swedenPortal = swedenResult.groupedPortals["University Admissions Sweden"];
assert(swedenPortal.bundledFee === 80, `Sweden Antagning flat application fee is €80 (Received: €${swedenPortal.bundledFee})`);
assert(swedenPortal.savings === 160, `Sweden bundling savings for 3 programs is €160 (Received: €${swedenPortal.savings})`);

// 3. Pre-Admission Sunk Cost Budget Calculation
console.log("\n--- TEST GROUP 3: Pre-Admission Sunk Cost Budget ---");
const budget = calculatePreAdmissionBudget({
  items: threeUniAssist,
  selectedExams: { ielts: true, gre: true, toefl: false, testas: false },
  originCountry: "India",
  includeApostille: true
});

// App fees: 135, IELTS: 185, GRE: 245, APS: 195, Apostille: 60 -> Total: 820
assert(budget.applicationFees.totalBundledEUR === 135, `Bundled application fees sum to €135 (Received: €${budget.applicationFees.totalBundledEUR})`);
assert(budget.standardizedExams.totalEUR === 430, `Exams sum to €430 (IELTS €185 + GRE €245) (Received: €${budget.standardizedExams.totalEUR})`);
assert(budget.documentVerification.apsApplicable === true, "APS India automatically detected as mandatory for German universities");
assert(budget.documentVerification.totalEUR === 255, `Verifications sum to €255 (APS €195 + Apostille €60) (Received: €${budget.documentVerification.totalEUR})`);
assert(budget.preAdmissionBudget.totalSunkCostEUR === 820, `Total Sunk Cost equals €820 (Received: €${budget.preAdmissionBudget.totalSunkCostEUR})`);
assert(budget.preAdmissionBudget.totalSunkCostINR > 0, `Total Sunk Cost in INR is calculated (Received: ₹${budget.preAdmissionBudget.totalSunkCostINR.toLocaleString("en-IN")})`);

// 4. Two-Card Hidden Costs Output
console.log("\n--- TEST GROUP 4: Two-Card Hidden Costs Output ---");
const tum = publicUniversities.find(u => u.id === "tum-germany" || u.name.includes("Munich"));
const breakdown = getUniversityCostBreakdown(tum, "India");

assert(breakdown.preAdmissionCard !== undefined, "Pre-admission costs card exists");
assert(breakdown.postAdmissionCard !== undefined, "Post-admission & enrollment costs card exists");
assert(breakdown.preAdmissionCard.title === "Pre-Admission Costs", "Card 1 title is 'Pre-Admission Costs'");
assert(breakdown.preAdmissionCard.apsRequirement.isRequired === true, "APS India flagged in Card 1");
assert(breakdown.postAdmissionCard.title === "Post-Admission & Enrollment Costs", "Card 2 title is 'Post-Admission & Enrollment Costs'");
assert(breakdown.postAdmissionCard.tuitionFeePerYearEUR === 0, "TUM tuition is €0");
assert(breakdown.postAdmissionCard.mandatorySemesterFeeEUR === 102, "TUM semester fee is €102");
assert(breakdown.postAdmissionCard.visaProofOfFundsEUR === 11904, "German blocked account is €11,904");
assert(breakdown.postAdmissionCard.immediateAdmissionCashRequiredEUR === 102 + 11904, `Immediate cash required upon admission calculated (Received: €${breakdown.postAdmissionCard.immediateAdmissionCashRequiredEUR})`);

// 5. Scraper Hidden Fee Keyword Analyzer
console.log("\n--- TEST GROUP 5: Scraper Hidden Fee Keyword Analyzer ---");
const sampleOfficialHtml = `
  <html>
    <body>
      <h2>Application & Admission Regulations</h2>
      <p>Candidates must remit the application processing fee directly or via the uni-assist fee portal.</p>
      <p>An institutional handling fee of €50 applies for non-EU dossiers.</p>
      <p>Upon receipt of admission, payment of the mandatory semester contribution (Semesterbeitrag) of €315 is required.</p>
      <p>The fee subsidizes the student union fee and provides the regional public transit pass (Semesterticket).</p>
    </body>
  </html>
`;

const keywordResult = extractHiddenFeeKeywords(sampleOfficialHtml);
assert(keywordResult.detected === true, "Hidden fee keywords detected in admission HTML");
assert(keywordResult.matchedCount >= 5, `At least 5 keywords matched (Count: ${keywordResult.matchedCount})`);

const expectedKeys = [
  "Application processing fee",
  "uni-assist fee",
  "handling fee",
  "semester contribution",
  "student union fee",
  "Semesterbeitrag",
  "Semesterticket"
];
expectedKeys.forEach(k => {
  const found = keywordResult.keywords.some(item => item.keyword === k);
  assert(found, `Scraper detects keyword: "${k}"`);
});

console.log("\n===============================================================");
console.log(`🎉 TEST RUN COMPLETE: ${passedTests} / ${totalTests} TESTS PASSED`);
console.log("===============================================================\n");
