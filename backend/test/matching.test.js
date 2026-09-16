const { getStore } = require("../src/config/db");
const { matchUniversityPrograms } = require("../src/routes/universities");

console.log("==================================================");
console.log("🧪 RUNNING PERSONALIZED MATCHING ENGINE TEST SUITE");
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

// TEST CASE 1: The Automated Requirement from User Prompt
// "simulate a user who is pursuing a B.Tech in Computer Science and Engineering with a 7.0 CGPA.
// The results grid must immediately and strictly filter to only show Computer Science or Data Analytics Master's programs
// that accept a 7.0 CGPA, hiding all programs that require an 8.0 or higher."

const cse7Profile = {
  currentDegree: "B.Tech in Computer Science and Engineering",
  degreeType: "Master's",
  field: "Computer Science",
  cgpa: 7.0,
  ieltsScore: 7.0
};

const result1 = matchUniversityPrograms(cse7Profile);
assert(result1.matches.length > 0, `Returned matching programs for B.Tech CSE 7.0 CGPA (Found: ${result1.matches.length})`);

// Validate programs requiring >= 8.0 (e.g. TUM, TU Delft, Oxford) and > 7.0 (TU Berlin) are strictly excluded
const hasTUM = result1.matches.some(u => u.name.includes("Technical University of Munich") || u.id === "tum-germany");
assert(!hasTUM, "TUM (requires 8.0 CGPA) is strictly excluded for a 7.0 CGPA student");

const hasDelft = result1.matches.some(u => u.id && u.id.includes("delft"));
assert(!hasDelft, "TU Delft (requires 8.0 CGPA) is strictly excluded for a 7.0 CGPA student");

const hasTUBerlin = result1.matches.some(u => u.name.includes("TU Berlin") || u.id === "tu-berlin-germany");
assert(!hasTUBerlin, "TU Berlin (requires 7.2 CGPA) is strictly excluded for a 7.0 CGPA student");

const hasOxford = result1.matches.some(u => u.id && u.id.includes("oxford"));
assert(!hasOxford, "Oxford (requires 8.5 CGPA) is strictly excluded for a 7.0 CGPA student");

// Validate all returned universities have Official_Min_CGPA <= 7.0
const allMeetCutoff = result1.matches.every(u => {
  const minCutoff = u.Official_Min_CGPA !== undefined ? Number(u.Official_Min_CGPA) : Number(u.minCGPA10 || 6.5);
  return minCutoff <= 7.0;
});
assert(allMeetCutoff, "100% of matched universities have Official_Min_CGPA <= 7.0");

// Validate all returned universities offer Master's programs
const allOfferMasters = result1.matches.every(u => {
  const degs = u.degreesOffered || u.Degree_Level || [];
  return degs.some(d => d.toLowerCase().includes("master"));
});
assert(allOfferMasters, "100% of matched universities offer Master's programs");

// Validate all returned universities offer CS or Data programs
const allOfferCSOrData = result1.matches.every(u => {
  const fields = [...(u.fields || []), ...(u.programsAvailable || [])].map(f => f.toLowerCase());
  return fields.some(f => 
    f.includes("computer") || 
    f.includes("data") || 
    f.includes("software") || 
    f.includes("informatics") || 
    f.includes("artificial intelligence")
  );
});
assert(allOfferCSOrData, "100% of matched universities offer Computer Science or Data Analytics/Science");

// TEST CASE 2: High CGPA User (8.5 CGPA)
// Should include TUM (8.0), RWTH (7.5), and TU Berlin (7.2)
const highCGPAProfile = {
  currentDegree: "B.Tech in Computer Science and Engineering",
  degreeType: "Master's",
  field: "Computer Science",
  cgpa: 8.5,
  ieltsScore: 7.5
};

const result2 = matchUniversityPrograms(highCGPAProfile);
const highHasTUM = result2.matches.some(u => u.id === "tum-germany");
assert(highHasTUM, "TUM (8.0 CGPA) is included for an 8.5 CGPA applicant");

// TEST CASE 3: Financial Capacity Filtering
// If a user has a strict capacity of €1,000 / year:
// High tuition universities (e.g. UK/USA/Australia with €15,000+ tuition) should be filtered out
// Tuition-free German universities (€0 tuition) should remain accessible
const lowBudgetProfile = {
  currentDegree: "B.Tech in Computer Science and Engineering",
  degreeType: "Master's",
  field: "Computer Science",
  cgpa: 7.0,
  financialCapacityEUR: 1000
};

const result3 = matchUniversityPrograms(lowBudgetProfile);
const hasExpensiveUnis = result3.matches.some(u => (u.tuitionFeeEUR || 0) > 5000);
assert(!hasExpensiveUnis, "Universities with tuition > €5,000 are filtered out for low-budget profile");

const hasTuitionFree = result3.matches.some(u => (u.tuitionFeeEUR || 0) === 0);
assert(hasTuitionFree, "Tuition-free (€0) European universities remain accessible");

// TEST CASE 4: Zero Matches Scenario
// An impossible cutoff like CGPA 3.0 or extreme constraints
const impossibleProfile = {
  degreeType: "Master's",
  field: "Astrophysics and Nuclear Marine Biology",
  cgpa: 3.0
};

const result4 = matchUniversityPrograms(impossibleProfile);
assert(result4.matches.length === 0, "Impossible criteria correctly returns 0 matches (triggers Zero Matches state in UI)");

console.log(`\n==================================================`);
console.log(`Matching Engine Test Suite Complete: ${passedTests}/${totalTests} Passed`);
console.log(`==================================================\n`);

if (passedTests !== totalTests) {
  process.exit(1);
}
