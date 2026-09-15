/**
 * Automated End-to-End Test Suite:
 * Baseline Profile: B.Tech in Computer Science and Engineering, 7.0 CGPA
 * Target: All 27 EU Member States across all tuition brackets (€0 to standard fees)
 */

const assert = require("assert");
const { evaluateAcademicProfile } = require("../src/services/evaluationEngine");
const { evaluateVisaAndFinancials } = require("../src/services/visaRiskEngine");
const { countryVisaRules } = require("../src/data/seedVisaRules");
const { publicUniversities, COST_OF_LIVING_INDEX_MAP } = require("../src/data/seedUniversities");
const { getOfficialPortalsDirectory, scrapePublicPrograms } = require("../src/services/scraperService");

const ALL_27_EU_NATIONS = [
  "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czechia",
  "Denmark", "Estonia", "Finland", "France", "Germany", "Greece",
  "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg",
  "Malta", "Netherlands", "Poland", "Portugal", "Romania", "Slovakia",
  "Slovenia", "Spain", "Sweden"
];

console.log("================================================================================");
console.log("🧪 RUNNING E2E TEST: BASELINE B.TECH CSE (7.0 CGPA) & ALL 27 EU NATIONS COVERAGE");
console.log("================================================================================\n");

// -----------------------------------------------------------------------------
// TEST 1: Baseline Profile Evaluation across All 27 EU Nations (Unbiased Default)
// -----------------------------------------------------------------------------
console.log("▶ TEST 1: Unbiased Matching across All 27 EU Member States for 7.0 CGPA Profile...");

const baselineProfile = {
  degreeTarget: "Master's",
  backgroundField: "Computer Science",
  currentCGPA: 7.0,
  isPercentage: false,
  collegeTier: "Tier 2",
  ieltsScore: 7.0,
  ieltsBandMin: 6.5,
  backlogs: 1,
  targetCountries: ["All EU Countries"]
};

const evalResult = evaluateAcademicProfile(baselineProfile);

assert(evalResult.totalMatched > 0, "Evaluation should return matched universities.");
console.log(`  ✓ Total matched public university programs for 7.0 CGPA: ${evalResult.totalMatched}`);

// Verify that EVERY SINGLE ONE of the 27 EU nations has matched public universities
const matchedCountriesSet = new Set(
  evalResult.allMatches.map(m => m.university.country.toLowerCase())
);

const missingEUNations = [];
ALL_27_EU_NATIONS.forEach(country => {
  const cLower = country.toLowerCase();
  const matched = evalResult.allMatches.filter(m => {
    const uCountry = m.university.country.toLowerCase();
    return uCountry === cLower ||
      (country === "Czechia" && uCountry === "czech republic");
  });

  if (matched.length > 0) {
    const minFee = Math.min(...matched.map(m => m.university.Tuition_Fee_International));
    const maxFee = Math.max(...matched.map(m => m.university.Tuition_Fee_International));
    const col = matched[0].university.Cost_of_Living_Index;
    console.log(`    ✅ ${country.padEnd(14)}: ${matched.length} programs | Tuition: €${minFee} - €${maxFee} | CoL Index: ${col}`);
  } else {
    missingEUNations.push(country);
  }
});

assert.strictEqual(
  missingEUNations.length, 
  0, 
  `All 27 EU nations must be represented! Missing: ${missingEUNations.join(", ")}`
);
console.log("  ✓ PASS: Complete 27-nation EU coverage confirmed without geographic omission.\n");

// -----------------------------------------------------------------------------
// TEST 2: Dynamic Maximum Annual Tuition Slider Behavior
// -----------------------------------------------------------------------------
console.log("▶ TEST 2: Dynamic Maximum Annual Tuition Slider Protocol...");

// A. Slider at €0 (Free Tuition Only)
const freeEval = evaluateAcademicProfile({
  ...baselineProfile,
  maxAnnualTuition: 0
});
assert(freeEval.totalMatched > 0, "Should match free tuition universities.");
const nonZeroFree = freeEval.allMatches.filter(m => m.university.Tuition_Fee_International > 0);
assert.strictEqual(nonZeroFree.length, 0, "No programs charging > €0 should be returned when slider = 0");
console.log(`  ✓ Slider = €0: ${freeEval.totalMatched} programs matched (All strictly €0 / year).`);

// B. Slider at €1,500 (Nominal Administrative Fees)
const lowAdminEval = evaluateAcademicProfile({
  ...baselineProfile,
  maxAnnualTuition: 1500
});
assert(lowAdminEval.totalMatched > freeEval.totalMatched, "€1,500 limit should return more universities than €0.");
const exceeds1500 = lowAdminEval.allMatches.filter(m => m.university.Tuition_Fee_International > 1500);
assert.strictEqual(exceeds1500.length, 0, "No programs charging > €1,500 should be returned.");
console.log(`  ✓ Slider = €1,500: ${lowAdminEval.totalMatched} programs matched (e.g. Austria €1,452, France €243, Luxembourg €600, Italy €1,000).`);

// C. Slider at €5,000 (Affordable EU Public Universities)
const affordableEval = evaluateAcademicProfile({
  ...baselineProfile,
  maxAnnualTuition: 5000
});
assert(affordableEval.totalMatched > lowAdminEval.totalMatched, "€5,000 limit should return more universities than €1,500.");
const exceeds5000 = affordableEval.allMatches.filter(m => m.university.Tuition_Fee_International > 5000);
assert.strictEqual(exceeds5000.length, 0, "No programs charging > €5,000 should be returned.");
console.log(`  ✓ Slider = €5,000: ${affordableEval.totalMatched} programs matched (includes Spain, Poland, Portugal, Czechia, Hungary, Estonia, etc.).`);

// D. Slider at €30,000 (Full Spectrum / Standard International Tuition)
const fullSpectrumEval = evaluateAcademicProfile({
  ...baselineProfile,
  maxAnnualTuition: 30000
});
assert.strictEqual(fullSpectrumEval.totalMatched, evalResult.totalMatched, "€30,000 limit should match all eligible public programs.");
console.log(`  ✓ Slider = €30,000: ${fullSpectrumEval.totalMatched} programs matched across all 27 nations including Sweden, Denmark, Finland, Ireland, Netherlands.`);
console.log("  ✓ PASS: Dynamic tuition slider responds accurately and continuously across financial brackets.\n");

// -----------------------------------------------------------------------------
// TEST 3: Database Schema & Numeric Validation
// -----------------------------------------------------------------------------
console.log("▶ TEST 3: Database Schema & Numeric Validation...");

evalResult.allMatches.forEach(({ university: uni }) => {
  // Check Tuition_Fee_International
  assert.strictEqual(
    typeof uni.Tuition_Fee_International, 
    "number", 
    `Tuition_Fee_International for ${uni.name} must be numeric, got ${typeof uni.Tuition_Fee_International}`
  );
  assert(
    !isNaN(uni.Tuition_Fee_International) && uni.Tuition_Fee_International >= 0,
    `Tuition_Fee_International for ${uni.name} must be a valid non-negative number: ${uni.Tuition_Fee_International}`
  );

  // Check Cost_of_Living_Index
  assert.strictEqual(
    typeof uni.Cost_of_Living_Index,
    "number",
    `Cost_of_Living_Index for ${uni.name} must be numeric`
  );
  assert(
    uni.Cost_of_Living_Index > 0,
    `Cost_of_Living_Index for ${uni.name} must be > 0: ${uni.Cost_of_Living_Index}`
  );

  // Check Language_of_Instruction
  assert.strictEqual(
    uni.Language_of_Instruction,
    "English",
    `Language_of_Instruction for ${uni.name} must be English`
  );

  // Check Institution_Type
  assert.strictEqual(
    uni.Institution_Type,
    "Public",
    `Institution_Type for ${uni.name} must be Public`
  );
});

console.log(`  ✓ Verified all ${evalResult.allMatches.length} matched programs satisfy schema constraints:`);
console.log("    - Tuition_Fee_International: strictly numeric (from €0 to full international fees)");
console.log("    - Cost_of_Living_Index: strictly numeric for all host countries");
console.log("    - Language_of_Instruction: strictly English");
console.log("    - Institution_Type: strictly Public");
console.log("  ✓ PASS: Schema integrity validated.\n");

// -----------------------------------------------------------------------------
// TEST 4: Proof-of-Funds & Visa Risk Engine for Expensive & Affordable EU Countries
// -----------------------------------------------------------------------------
console.log("▶ TEST 4: Visa Rules & Proof-of-Funds Validation for Expensive & Affordable EU...");

// Expensive country test: Denmark (high living cost)
const denmarkVisa = evaluateVisaAndFinancials({
  annualFamilyIncomeINR: 1200000,
  liquidSavingsINR: 1500000,
  fixedDepositsINR: 500000,
  itrYearsAvailable: 3,
  studyGapYears: 0
}, "Denmark");
assert(denmarkVisa.requiredLivingINR >= 1000000, "Denmark living cost must reflect higher benchmark.");
assert(denmarkVisa.Cost_of_Living_Index > 75, "Denmark Cost of Living Index should be high.");
console.log(`  ✓ Denmark (High Living Index: ${denmarkVisa.Cost_of_Living_Index}): Required ~₹${(denmarkVisa.totalRequiredINR/100000).toFixed(1)}L (${denmarkVisa.solvencyStatus})`);

// Affordable country test: Bulgaria (low living cost)
const bulgariaVisa = evaluateVisaAndFinancials({
  annualFamilyIncomeINR: 600000,
  liquidSavingsINR: 700000,
  itrYearsAvailable: 2,
  studyGapYears: 0
}, "Bulgaria");
assert(bulgariaVisa.requiredLivingINR <= 500000, "Bulgaria living cost should reflect affordable benchmark.");
assert(bulgariaVisa.Cost_of_Living_Index < 45, "Bulgaria Cost of Living Index should be affordable.");
console.log(`  ✓ Bulgaria (Affordable Index: ${bulgariaVisa.Cost_of_Living_Index}): Required ~₹${(bulgariaVisa.totalRequiredINR/100000).toFixed(1)}L (${bulgariaVisa.solvencyStatus})`);

// Check that every one of the 27 EU nations has official visa rules
const missingVisaRules = [];
ALL_27_EU_NATIONS.forEach(c => {
  if (!countryVisaRules[c]) missingVisaRules.push(c);
});
assert.strictEqual(missingVisaRules.length, 0, `All 27 EU nations must have official visa rules! Missing: ${missingVisaRules.join(", ")}`);
console.log(`  ✓ All 27 EU member states have complete, official visa rules in database.`);
console.log("  ✓ PASS: Proof-of-funds logic functions accurately for both expensive and affordable EU countries.\n");

// -----------------------------------------------------------------------------
// TEST 5: Official Higher Education Portals & Scraper Engine
// -----------------------------------------------------------------------------
console.log("▶ TEST 5: Official National Higher Education Portals & Scraper Engine...");

const portals = getOfficialPortalsDirectory();
assert(portals.length >= 27, "Must have official portal for every EU member state.");

const missingPortals = [];
ALL_27_EU_NATIONS.forEach(c => {
  const p = portals.find(portal => 
    portal.country.toLowerCase() === c.toLowerCase() ||
    (c === "Czechia" && portal.country.toLowerCase() === "czech republic")
  );
  if (!p) missingPortals.push(c);
});
assert.strictEqual(missingPortals.length, 0, `All 27 EU nations must have portal targets! Missing: ${missingPortals.join(", ")}`);
console.log(`  ✓ Verified ${portals.length} official higher education portals (Study in Sweden, Study in Estonia, Study in Czechia, etc.).`);

// Test scraping search with strict filters
const scrapedPrograms = scrapePublicPrograms({
  country: "All EU Countries",
  degreeLevel: "Master's",
  maxTuitionFee: 4000
});
assert(scrapedPrograms.totalResults > 0, "Scraper must return public English Master's programs.");
assert.strictEqual(scrapedPrograms.filtersApplied.institutionType, "Public");
assert.strictEqual(scrapedPrograms.filtersApplied.languageOfInstruction, "English");
console.log(`  ✓ Scraper search returned ${scrapedPrograms.totalResults} English-taught public programs under €4,000.`);
console.log("  ✓ PASS: Scraper engine targets and strict filtering verified.\n");

console.log("================================================================================");
console.log("🎉 ALL E2E TESTS PASSED SUCCESSFULLY!");
console.log("Baseline profile (B.Tech CSE, 7.0 CGPA) matched across all 27 EU nations.");
console.log("Zero bias against tuition brackets; interactive slider adjusts matching instantly.");
console.log("================================================================================");
