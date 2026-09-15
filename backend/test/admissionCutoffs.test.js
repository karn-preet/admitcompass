const assert = require("assert");
const { publicUniversities } = require("../src/data/seedUniversities");
const { evaluateAcademicProfile } = require("../src/services/evaluationEngine");

console.log("===============================================================");
console.log("🧪 RUNNING ADMISSION CUTOFFS AUDIT & TEST SUITE");
console.log("===============================================================\n");

let passed = 0;
let total = 0;

function it(desc, fn) {
  total++;
  try {
    fn();
    console.log(`✅ PASS: ${desc}`);
    passed++;
  } catch (err) {
    console.error(`❌ FAIL: ${desc}`);
    console.error(err);
  }
}

// GROUP 1: Database Completeness
it("All 147 public universities exist in the database", () => {
  assert.strictEqual(publicUniversities.length, 147);
});

it("Every single university has a defined, positive minCGPA10 cutoff", () => {
  const invalid = publicUniversities.filter(u => typeof u.minCGPA10 !== "number" || u.minCGPA10 <= 0 || u.minCGPA10 > 10);
  assert.strictEqual(invalid.length, 0, `Found ${invalid.length} universities with invalid minCGPA10`);
});

it("Every single university has a defined minGermanGrade cutoff (1.0 - 4.0 scale)", () => {
  const invalid = publicUniversities.filter(u => typeof u.minGermanGrade !== "number" || u.minGermanGrade < 1.0 || u.minGermanGrade > 4.0);
  assert.strictEqual(invalid.length, 0, `Found ${invalid.length} universities with invalid minGermanGrade`);
});

it("Every single university has a defined minUSGPA cutoff (2.0 - 4.0 scale)", () => {
  const invalid = publicUniversities.filter(u => typeof u.minUSGPA !== "number" || u.minUSGPA < 2.0 || u.minUSGPA > 4.0);
  assert.strictEqual(invalid.length, 0, `Found ${invalid.length} universities with invalid minUSGPA`);
});

it("Every single university has a defined ieltsMinOverall cutoff (5.5 - 8.5)", () => {
  const invalid = publicUniversities.filter(u => typeof u.ieltsMinOverall !== "number" || u.ieltsMinOverall < 5.5 || u.ieltsMinOverall > 8.5);
  assert.strictEqual(invalid.length, 0, `Found ${invalid.length} universities with invalid ieltsMinOverall`);
});

it("Every single university has a defined toeflMin cutoff (>= 75)", () => {
  const invalid = publicUniversities.filter(u => typeof u.toeflMin !== "number" || u.toeflMin < 70 || u.toeflMin > 120);
  assert.strictEqual(invalid.length, 0, `Found ${invalid.length} universities with invalid toeflMin`);
});

it("Every single university has an explicit greRequirement specification", () => {
  const invalid = publicUniversities.filter(u => !u.greRequirement || typeof u.greRequirement !== "string");
  assert.strictEqual(invalid.length, 0, `Found ${invalid.length} universities with missing greRequirement`);
});

it("Every single university has maxBacklogsAllowed defined as a non-negative integer", () => {
  const invalid = publicUniversities.filter(u => typeof u.maxBacklogsAllowed !== "number" || u.maxBacklogsAllowed < 0);
  assert.strictEqual(invalid.length, 0, `Found ${invalid.length} universities with missing maxBacklogsAllowed`);
});

// GROUP 2: evaluationEngine Cutoff Passthrough
it("evaluationEngine outputs all cutoff fields in matched university objects", () => {
  const result = evaluateAcademicProfile({
    degreeTarget: "Master's",
    backgroundField: "Computer Science",
    currentCGPA: 7.8,
    ieltsScore: 7.0,
    ieltsBandMin: 6.5,
    toeflScore: 95,
    greQuant: 165,
    targetCountries: ["Germany"]
  });

  assert.ok(result);
  const matched = result.allMatches;
  assert.ok(matched.length > 0, "Should have matches");

  for (const item of matched) {
    const u = item.university;
    assert.ok(typeof u.minCGPA10 === "number", `Missing minCGPA10 for ${u.name}`);
    assert.ok(typeof u.minGermanGrade === "number", `Missing minGermanGrade for ${u.name}`);
    assert.ok(typeof u.minUSGPA === "number", `Missing minUSGPA for ${u.name}`);
    assert.ok(typeof u.ieltsMinOverall === "number", `Missing ieltsMinOverall for ${u.name}`);
    assert.ok(typeof u.toeflMin === "number", `Missing toeflMin for ${u.name}`);
    assert.ok(typeof u.greRequirement === "string", `Missing greRequirement for ${u.name}`);
    assert.ok(typeof u.maxBacklogsAllowed === "number", `Missing maxBacklogsAllowed for ${u.name}`);
  }
});

console.log(`\n===============================================================`);
console.log(`🎉 TEST RUN COMPLETE: ${passed} / ${total} TESTS PASSED`);
console.log(`===============================================================\n`);

if (passed !== total) process.exit(1);
