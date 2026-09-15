const { publicUniversities } = require("../src/data/seedUniversities");
const { extractLORRequirements } = require("../src/services/scraperService");
const { Program, ApplicationDocumentsSchema } = require("../src/models/Program");

console.log("===============================================================");
console.log("🧪 RUNNING LETTER OF RECOMMENDATION (LOR) AUTOMATED TEST SUITE");
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

// 1. Database Schema & Seed Verification
console.log("\n--- TEST GROUP 1: University LOR Schema Verification ---");
assert(publicUniversities.length === 147, `Total 147 public universities in catalog (Found: ${publicUniversities.length})`);

let allHaveAppDocs = true;
let validRequirements = true;
let validCounts = true;
let validFormats = true;
let validTypes = true;

const validReqEnum = ["Mandatory", "Optional", "Not Required"];
const validFormatEnum = [
  "University Specific Portal Link",
  "Free-form PDF",
  "Institutional Referee Portal Link",
  "Online Evaluation Form",
  "Direct Email to Admissions",
  "Not Applicable"
];

publicUniversities.forEach(u => {
  const docs = u.Application_Documents;
  if (!docs || typeof docs !== "object") {
    allHaveAppDocs = false;
    return;
  }
  if (!validReqEnum.includes(docs.LOR_Requirement)) validRequirements = false;
  if (typeof docs.LOR_Count !== "number" || docs.LOR_Count < 0) validCounts = false;
  if (!validFormatEnum.includes(docs.LOR_Format)) validFormats = false;
  if (!Array.isArray(docs.LOR_Type) || docs.LOR_Type.length === 0) validTypes = false;
});

assert(allHaveAppDocs, "All 147 universities have Application_Documents object populated");
assert(validRequirements, "All universities have valid LOR_Requirement ('Mandatory', 'Optional', 'Not Required')");
assert(validCounts, "All universities have non-negative integer LOR_Count");
assert(validFormats, "All universities specify recognized LOR_Format (Portal Link vs PDF)");
assert(validTypes, "All universities specify array of LOR_Type (['Academic', ...])");

// Check specific university rules
const tum = publicUniversities.find(u => u.id === "tum-germany");
assert(tum && tum.Application_Documents.LOR_Requirement === "Mandatory", "TUM requires Mandatory LORs");
assert(tum && tum.Application_Documents.LOR_Count === 2, "TUM requires 2 LORs");
assert(tum && tum.Application_Documents.LOR_Format === "University Specific Portal Link", "TUM uses University Specific Portal Link");

const rwth = publicUniversities.find(u => u.id === "rwth-aachen-germany");
assert(rwth && rwth.Application_Documents.LOR_Requirement === "Mandatory", "RWTH Aachen requires Mandatory LORs");
assert(rwth && rwth.Application_Documents.LOR_Format === "Free-form PDF", "RWTH Aachen uses Free-form PDF");

const manchester = publicUniversities.find(u => u.id === "manchester-uk");
assert(manchester && manchester.Application_Documents.LOR_Requirement === "Mandatory" && manchester.Application_Documents.LOR_Format === "University Specific Portal Link", "Manchester requires Portal Link LORs");

// 2. Scraper Keyword Parser Verification
console.log("\n--- TEST GROUP 2: Scraper Keyword Parser (Admissions Pages) ---");

// Test 1: "Letter of Recommendation" with 2 count and portal link
const snippet1 = "Applicants must provide 2 Letters of Recommendation. Your referees will receive an automated portal link to upload confidential evaluations.";
const res1 = extractLORRequirements(snippet1);
assert(res1.detected === true, "Detected LOR in snippet 1");
assert(res1.LOR_Requirement === "Mandatory", "Mandatory requirement detected in snippet 1");
assert(res1.LOR_Count === 2, "Count 2 detected in snippet 1");
assert(res1.LOR_Format === "University Specific Portal Link", "Portal link format detected in snippet 1");

// Test 2: "Academic Reference" & "Referee details"
const snippet2 = "Please submit details of three referees. Academic Reference letters should be on institutional letterhead as a free-form PDF.";
const res2 = extractLORRequirements(snippet2);
assert(res2.detected === true, "Detected LOR in snippet 2");
assert(res2.LOR_Count === 3, "Count 3 detected in snippet 2");
assert(res2.LOR_Format === "Free-form PDF", "Free-form PDF detected in snippet 2");
assert(res2.matchedKeywords.includes("Academic Reference") || res2.matchedKeywords.includes("Referee details"), "Keywords parsed correctly");

// Test 3: "Optional" LOR
const snippet3 = "A reference letter from a former professor is optional but encouraged.";
const res3 = extractLORRequirements(snippet3);
assert(res3.detected === true, "Detected LOR in snippet 3");
assert(res3.LOR_Requirement === "Optional", "Optional requirement detected in snippet 3");

// Test 4: "Not Required"
const snippet4 = "Letters of recommendation are not required for this Master degree program.";
const res4 = extractLORRequirements(snippet4);
assert(res4.LOR_Requirement === "Not Required", "Not Required status detected in snippet 4");
assert(res4.LOR_Count === 0, "Count 0 for Not Required status");

console.log("\n===============================================================");
console.log(`🎉 LOR TEST RUN COMPLETE: ${passedTests} / ${totalTests} TESTS PASSED`);
console.log("===============================================================\n");
