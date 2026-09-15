const { evaluateAcademicProfile } = require("../src/services/evaluationEngine");
const { publicUniversities } = require("../src/data/seedUniversities");

const EU_27 = [
  "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czechia",
  "Denmark", "Estonia", "Finland", "France", "Germany", "Greece",
  "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg",
  "Malta", "Netherlands", "Poland", "Portugal", "Romania", "Slovakia",
  "Slovenia", "Spain", "Sweden"
];

// Test baseline profile: 7.0 CGPA, B.Tech CSE, targeting all EU
const evalResult = evaluateAcademicProfile({
  degreeTarget: "Master's",
  backgroundField: "Computer Science",
  currentCGPA: 7.0,
  isPercentage: false,
  collegeTier: "Tier 2",
  targetCountries: ["All EU Countries"]
});

console.log("Total Matched Universities for 7.0 CGPA:", evalResult.totalMatched);

const matchedCountries = new Set(evalResult.allMatches.map(m => m.university.country));

console.log("\nEU 27 Coverage for 7.0 CGPA:");
const missingInResults = [];
EU_27.forEach(c => {
  const match = evalResult.allMatches.filter(m => 
    m.university.country.toLowerCase() === c.toLowerCase() ||
    (c === "Czechia" && m.university.country.toLowerCase() === "czech republic")
  );
  if (match.length > 0) {
    const minTuition = Math.min(...match.map(m => m.university.tuitionFeeEUR ?? m.university.Tuition_Fee_International ?? 99999));
    const maxTuition = Math.max(...match.map(m => m.university.tuitionFeeEUR ?? m.university.Tuition_Fee_International ?? 0));
    console.log(`✅ ${c}: ${match.length} unis | Tuition: €${minTuition} - €${maxTuition} | Category: ${match[0].category} (score ${match[0].probabilityScore})`);
  } else {
    console.log(`❌ ${c}: NO MATCHES!`);
    missingInResults.push(c);
  }
});

console.log("\nMissing EU countries in evaluation results:", missingInResults);
