const { publicUniversities } = require("../src/data/seedUniversities");

const EU_27 = [
  "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czechia",
  "Denmark", "Estonia", "Finland", "France", "Germany", "Greece",
  "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg",
  "Malta", "Netherlands", "Poland", "Portugal", "Romania", "Slovakia",
  "Slovenia", "Spain", "Sweden"
];

console.log("Checking tuition across 27 EU nations:");
EU_27.forEach(c => {
  const unis = publicUniversities.filter(u => 
    u.country.toLowerCase() === c.toLowerCase() ||
    (c === "Czechia" && u.country.toLowerCase() === "czech republic")
  );
  const tuitionList = unis.map(u => ({
    name: u.name,
    fee: u.tuitionFeeEUR ?? u.Tuition_Fee_International ?? u.tuitionEurPerYear
  }));
  console.log(`${c} (${unis.length} unis):`, tuitionList);
});
