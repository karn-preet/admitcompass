const { publicUniversities } = require("../src/data/seedUniversities");
const uniAssistUnis = publicUniversities.filter(u => u.Application_Portal_Type === "Uni-assist");
const testIds = uniAssistUnis.slice(0, 3).map(u => u.id);
console.log("Testing with 3 Uni-assist IDs:", testIds);

async function testLiveCart() {
  try {
    const res = await fetch("http://localhost:5001/api/application-cart/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: testIds,
        originCountry: "India",
        selectedExams: { ielts: true, gre: true, toefl: false, testas: false }
      })
    });
    const data = await res.json();
    console.log("Portal Breakdown:", JSON.stringify(data.data?.portalBreakdown, null, 2));
    console.log("App Fees Summary:", JSON.stringify(data.data?.applicationFees, null, 2));
    console.log("Pre-Admission Sunk Cost Budget:", JSON.stringify(data.data?.preAdmissionBudget, null, 2));

    const detailRes = await fetch("http://localhost:5001/api/application-cart/university-cost/tum-germany");
    const detailData = await detailRes.json();
    console.log("Detail Data (TUM):", JSON.stringify(detailData, null, 2));

    const feeScrapeRes = await fetch("http://localhost:5001/api/scrape/analyze-fees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: "Please note that a handling fee of 75 EUR applies through uni-assist fee portal. Upon admission, a semester contribution of 152 EUR including the semesterticket for local transit is mandatory."
      })
    });
    const feeScrapeData = await feeScrapeRes.json();
    console.log("Scrape Fee Analyzer Data:", JSON.stringify(feeScrapeData, null, 2));
  } catch (err) {
    console.error("Live Cart Test Error:", err);
  }
}

testLiveCart();
