const { publicUniversities } = require("../src/data/seedUniversities");
const { verifiedStudentHousing } = require("../src/data/seedHousing");
const { campusAmenities } = require("../src/data/seedAmenities");
const { 
  calculateHaversineDistance, 
  estimateCommuteTimes,
  COMMUTE_RADII_KM,
  getCampusEcosystem,
  OFFICIAL_HOUSING_NETWORKS
} = require("../src/services/studentLifeMapEngine");

console.log("===============================================================");
console.log("🧪 RUNNING STUDENT LIFE & HOUSING MAP TEST SUITE");
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

// -------------------------------------------------------------
// TEST GROUP 1: Database Schema & Locations Array
// -------------------------------------------------------------
console.log("\n--- TEST GROUP 1: Database Schema & Locations Array ---");
assert(publicUniversities.length === 147, `Total public universities is 147 (Found: ${publicUniversities.length})`);

let allHaveLocations = true;
let allCoordsNumeric = true;
let tumHasCoords = false;

publicUniversities.forEach(u => {
  if (!Array.isArray(u.Locations) || u.Locations.length === 0) {
    allHaveLocations = false;
  } else {
    const loc = u.Locations[0];
    if (typeof loc.lat !== "number" || typeof loc.lng !== "number" || isNaN(loc.lat) || isNaN(loc.lng)) {
      allCoordsNumeric = false;
    }
    if (u.id === "tum-germany" && Math.abs(loc.lat - 48.1497) < 0.01 && Math.abs(loc.lng - 11.5678) < 0.01) {
      tumHasCoords = true;
    }
  }
});

assert(allHaveLocations, "All 147 universities have a Locations array with campus metadata");
assert(allCoordsNumeric, "All campus Locations have valid numeric latitude and longitude coordinates");
assert(tumHasCoords, "TUM Main Campus coordinates are accurately mapped (48.1497° N, 11.5678° E)");

// -------------------------------------------------------------
// TEST GROUP 2: Verified Housing Collection & Official Networks
// -------------------------------------------------------------
console.log("\n--- TEST GROUP 2: Verified Housing Collection & Official Networks ---");
assert(verifiedStudentHousing.length >= 15, `Verified student housing collection populated (Count: ${verifiedStudentHousing.length})`);

let allHousingValid = true;
let dormCount = 0;
let sharedCount = 0;
let studioCount = 0;

verifiedStudentHousing.forEach(h => {
  if (!h.id || !h.University_ID || !h.Housing_Name || !h.Rent_Cost || !h.Source_URL) {
    allHousingValid = false;
  }
  if (!h.Coordinates || typeof h.Coordinates.lat !== "number" || typeof h.Coordinates.lng !== "number") {
    allHousingValid = false;
  }
  if (h.Housing_Type === "Dorm") dormCount++;
  if (h.Housing_Type === "Shared") sharedCount++;
  if (h.Housing_Type === "Studio") studioCount++;
});

assert(allHousingValid, "All housing records satisfy schema (University_ID, Housing_Type, Rent_Cost, Coordinates, Source_URL)");
assert(dormCount > 0, `Official Dorm residences identified (Count: ${dormCount})`);
assert(sharedCount > 0, `Shared WG / flatshare residences identified (Count: ${sharedCount})`);
assert(studioCount > 0, `Private studio residences identified (Count: ${studioCount})`);

// Official Networks check
assert(OFFICIAL_HOUSING_NETWORKS.length >= 4, `Official student housing networks catalogued (Count: ${OFFICIAL_HOUSING_NETWORKS.length})`);
const hasStudentenwerk = OFFICIAL_HOUSING_NETWORKS.some(n => n.networkName.includes("Studentenwerk"));
const hasCrous = OFFICIAL_HOUSING_NETWORKS.some(n => n.networkName.includes("CROUS"));
const hasDuwo = OFFICIAL_HOUSING_NETWORKS.some(n => n.networkName.includes("DUWO"));
const hasSssb = OFFICIAL_HOUSING_NETWORKS.some(n => n.networkName.includes("SSSB"));

assert(hasStudentenwerk, "Official network: German Studentenwerk / Studierendenwerk included");
assert(hasCrous, "Official network: French CROUS included");
assert(hasDuwo, "Official network: Dutch DUWO included");
assert(hasSssb, "Official network: Swedish SSSB included");

// -------------------------------------------------------------
// TEST GROUP 3: Spatial Calculations & Haversine Distance
// -------------------------------------------------------------
console.log("\n--- TEST GROUP 3: Spatial Calculations & Haversine Distance ---");

// Distance between TUM (48.1497, 11.5678) and Studentenstadt (48.1834, 11.6115) is ~4.8 km
const distStuSta = calculateHaversineDistance(48.1497, 11.5678, 48.1834, 11.6115);
assert(distStuSta >= 4.0 && distStuSta <= 5.5, `Haversine distance calculated accurately (~4.8 km, received: ${distStuSta} km)`);

// Commute times
const commute = estimateCommuteTimes(distStuSta);
assert(commute.walkTimeMin >= 50 && commute.walkTimeMin <= 70, `Walk time estimated accurately (~60 min, received: ${commute.walkTimeMin} min)`);
assert(commute.cycleTimeMin >= 15 && commute.cycleTimeMin <= 25, `Cycling time estimated accurately (~19 min, received: ${commute.cycleTimeMin} min)`);
assert(commute.transitTimeMin >= 12 && commute.transitTimeMin <= 22, `Transit time estimated accurately (~17 min, received: ${commute.transitTimeMin} min)`);

// Commute Radii Thresholds
assert(COMMUTE_RADII_KM.walk15 === 1.2, "15-minute walking radius threshold is 1.2 km (1,200m)");
assert(COMMUTE_RADII_KM.cycle15 === 3.75, "15-minute cycling radius threshold is 3.75 km (3,750m)");
assert(COMMUTE_RADII_KM.transit30 === 10.0, "30-minute transit radius threshold is 10.0 km (10,000m)");

// -------------------------------------------------------------
// TEST GROUP 4: Campus Ecosystem Aggregator & Categorized Symbology
// -------------------------------------------------------------
console.log("\n--- TEST GROUP 4: Campus Ecosystem Aggregator & Categorized Symbology ---");

const tumEco = getCampusEcosystem("tum-germany");
assert(tumEco !== null, "Campus ecosystem retrieved for TUM");
assert(tumEco.campusLocation.lat === 48.1497, "TUM campus coordinates verified");
assert(tumEco.housing.length >= 5, `TUM housing options returned (Count: ${tumEco.housing.length})`);
assert(tumEco.amenities.length >= 6, `TUM categorized amenities returned (Count: ${tumEco.amenities.length})`);

// Categorized Symbology verification
const categories = new Set(tumEco.amenities.map(a => a.Category));
assert(categories.has("University"), "Map symbology: 🎓 University campus marker present");
assert(categories.has("Library"), "Map symbology: 📚 Library marker present");
assert(categories.has("Gym"), "Map symbology: 🏋️ Gym / Recreation marker present");
assert(categories.has("Grocery"), "Map symbology: 🛒 Supermarket / Grocery marker present");
assert(categories.has("Transit"), "Map symbology: 🚆 Metro / Transit stop marker present");

// Housing markers distinction: Official Dorm (green) vs Private Rental (blue)
const hasOfficialDorm = tumEco.housing.some(h => h.Is_Official_Dorm === true);
const hasPrivateRental = tumEco.housing.some(h => h.Is_Official_Dorm === false);
assert(hasOfficialDorm, "Housing symbology: Official subsidized dorm (green icon) present");
assert(hasPrivateRental, "Housing symbology: Private flatshare/studio (blue icon) present");

// Summary statistics check
assert(tumEco.summaryStats.averageRentEUR > 300, `Average rent calculated (Received: €${tumEco.summaryStats.averageRentEUR}/mo)`);
assert(tumEco.summaryStats.minDormRentEUR > 0, `Lowest dorm rent calculated (Received: €${tumEco.summaryStats.minDormRentEUR}/mo)`);
assert(tumEco.summaryStats.closestHousingDistanceKm < 1.0, `Closest housing detected under 1 km (Received: ${tumEco.summaryStats.closestHousingDistanceKm} km)`);

// -------------------------------------------------------------
// TEST GROUP 5: Commute Radius & Budget Filtering
// -------------------------------------------------------------
console.log("\n--- TEST GROUP 5: Commute Radius & Budget Filtering ---");

// 1. Walking 15-min radius filter (<= 1.2 km)
const walkingFiltered = getCampusEcosystem("tum-germany", { commuteRadiusMode: "walk15" });
const allWithinWalk = walkingFiltered.housing.every(h => h.Distance_Km <= 1.2);
assert(allWithinWalk, `Walking 15-min filter strictly enforces ≤ 1.2 km radius (Housing count: ${walkingFiltered.housing.length})`);
assert(walkingFiltered.housing.length > 0 && walkingFiltered.housing.length < tumEco.housing.length, "Walking radius filters subset of housing options");

// 2. Cycling 15-min radius filter (<= 3.75 km)
const cyclingFiltered = getCampusEcosystem("tum-germany", { commuteRadiusMode: "cycle15" });
const allWithinCycle = cyclingFiltered.housing.every(h => h.Distance_Km <= 3.75);
assert(allWithinCycle, `Cycling 15-min filter strictly enforces ≤ 3.75 km radius (Housing count: ${cyclingFiltered.housing.length})`);
assert(cyclingFiltered.housing.length >= walkingFiltered.housing.length, "Cycling radius includes more housing than walking radius");

// 3. Subsidized Dorm Budget Filter (maxBudget: 400)
const budgetFiltered = getCampusEcosystem("tum-germany", { maxBudget: 400 });
const allUnder400 = budgetFiltered.housing.every(h => h.Rent_Cost <= 400);
assert(allUnder400, `Budget filter (≤ €400) strictly isolates low-cost housing (Count: ${budgetFiltered.housing.length})`);

// 4. Housing Type Filter (Dorm only)
const dormOnlyFiltered = getCampusEcosystem("tum-germany", { housingTypes: ["Dorm"] });
const allDorms = dormOnlyFiltered.housing.every(h => h.Housing_Type === "Dorm");
assert(allDorms, `Housing type filter isolates Dorms only (Count: ${dormOnlyFiltered.housing.length})`);

console.log("\n===============================================================");
console.log(`🎉 TEST RUN COMPLETE: ${passedTests} / ${totalTests} TESTS PASSED`);
console.log("===============================================================\n");
