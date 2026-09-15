const { publicUniversities } = require("../src/data/seedUniversities");

const EU_27 = [
  "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czechia",
  "Denmark", "Estonia", "Finland", "France", "Germany", "Greece",
  "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg",
  "Malta", "Netherlands", "Poland", "Portugal", "Romania", "Slovakia",
  "Slovenia", "Spain", "Sweden"
];

const GLOBAL_HUBS = ["United Kingdom", "USA", "Canada", "Australia", "New Zealand"];

const presentCountries = Array.from(new Set(publicUniversities.map(u => u.country))).sort();
console.log("Total universities in DB:", publicUniversities.length);
console.log("Distinct countries count:", presentCountries.length);
console.log("Present countries:", presentCountries);

console.log("\nChecking 27 EU Nations:");
const missingEu = [];
EU_27.forEach(c => {
  const match = publicUniversities.filter(u => 
    u.country.toLowerCase() === c.toLowerCase() || 
    (c === "Czechia" && u.country.toLowerCase() === "czech republic") ||
    (c === "United Kingdom" && (u.country === "UK" || u.country === "United Kingdom"))
  );
  if (match.length > 0) {
    console.log(`✅ ${c}: ${match.length} unis (Sample: ${match[0].name}, Tuition: ${match[0].tuitionFeeEUR ?? match[0].tuitionEurPerYear ?? match[0].Tuition_Fee_International})`);
  } else {
    console.log(`❌ ${c}: MISSING`);
    missingEu.push(c);
  }
});

console.log("\nChecking Global Hubs:");
GLOBAL_HUBS.forEach(c => {
  const match = publicUniversities.filter(u => 
    u.country.toLowerCase() === c.toLowerCase() ||
    (c === "United Kingdom" && (u.country === "UK" || u.country === "United Kingdom"))
  );
  console.log(`${match.length > 0 ? "✅" : "❌"} ${c}: ${match.length} unis`);
});
