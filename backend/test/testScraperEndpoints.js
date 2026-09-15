async function testScraperEndpoints() {
  const pRes = await fetch("http://localhost:5001/api/scrape/portals");
  const portals = await pRes.json();
  console.log("✅ Official Portals Count:", portals.count);

  const sRes1 = await fetch("http://localhost:5001/api/scrape/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ country: "All EU Countries", maxTuitionFee: 0 })
  });
  const s0 = await sRes1.json();
  console.log("✅ English Public Master's with €0 Tuition:", s0.data.totalResults);

  const sRes2 = await fetch("http://localhost:5001/api/scrape/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ country: "All EU Countries", maxTuitionFee: 5000 })
  });
  const s5k = await sRes2.json();
  console.log("✅ English Public Master's with ≤ €5,000 Tuition:", s5k.data.totalResults);

  const sRes3 = await fetch("http://localhost:5001/api/scrape/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ country: "All EU Countries" })
  });
  const sAll = await sRes3.json();
  console.log("✅ English Public Master's Total across all EU 27:", sAll.data.totalResults);

  const euCountriesInResults = new Set(sAll.data.programs.map(p => p.country));
  console.log("✅ Distinct EU Countries in Scraped Public Programs:", euCountriesInResults.size);
}

testScraperEndpoints();
