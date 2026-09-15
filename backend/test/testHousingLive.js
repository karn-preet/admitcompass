async function testHousingLive() {
  try {
    const res = await fetch("http://localhost:5001/api/housing/university/tum-germany");
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Success:", data.success);
    console.log("University:", data.data?.university?.name);
    console.log("Campus Coords:", data.data?.campusLocation);
    console.log("Housing Options Count:", data.data?.housing?.length);
    console.log("First Housing Option:", {
      name: data.data?.housing?.[0]?.Housing_Name,
      type: data.data?.housing?.[0]?.Housing_Type,
      rent: data.data?.housing?.[0]?.Rent_Cost,
      dist: data.data?.housing?.[0]?.Distance_Km,
      walkMin: data.data?.housing?.[0]?.Walk_Time_Min,
      provider: data.data?.housing?.[0]?.Housing_Provider,
      url: data.data?.housing?.[0]?.Source_URL
    });
    console.log("Amenities Count:", data.data?.amenities?.length);
    console.log("Summary Stats:", data.data?.summaryStats);

    const filterRes = await fetch("http://localhost:5001/api/housing/filter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        universityId: "tum-germany",
        commuteRadiusMode: "walk15",
        maxBudget: 450
      })
    });
    const filterData = await filterRes.json();
    console.log("Filtered within 15-min walk and <= €450:", filterData.data?.housing?.map(h => ({
      name: h.Housing_Name,
      rent: h.Rent_Cost,
      distKm: h.Distance_Km,
      walkMin: h.Walk_Time_Min
    })));

    const uniDetailRes = await fetch("http://localhost:5001/api/universities/tum-germany");
    const uniDetail = await uniDetailRes.json();
    console.log("University Detail Locations:", uniDetail.data?.Locations);
    console.log("University Detail Housing Count:", uniDetail.data?.Housing?.length);
  } catch (err) {
    console.error("Live test error:", err);
  }
}

testHousingLive();
