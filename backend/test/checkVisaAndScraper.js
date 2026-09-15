const { countryVisaRules } = require("../src/data/seedVisaRules");
const { getOfficialCitationsDirectory } = require("../src/services/scraperService");

console.log("Visa Rules Countries:", Object.keys(countryVisaRules));
console.log("\nScraper Citations Count:", getOfficialCitationsDirectory().length);
const citationsCountries = Array.from(new Set(getOfficialCitationsDirectory().map(c => c.country)));
console.log("Citations Countries:", citationsCountries);
