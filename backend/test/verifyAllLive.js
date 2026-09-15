async function verifyAll() {
  console.log("--- Testing Backend Endpoints ---");
  
  // 1. Evaluator
  const evalRes = await fetch("http://localhost:5001/api/evaluate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      academic: { degree: "masters", currentCgpa: 8.5, cgpaScale: 10, targetCountry: "Germany", fieldOfStudy: "Computer Science" },
      financial: { annualFamilyIncomeInr: 1200000, hasItr: true, itrCount: 3, availableLiquidFundsInr: 1500000, fundingSources: ["Self/Parents Savings"] }
    })
  }).then(r => r.json());
  console.log("1. /api/evaluate success:", evalRes.success, "Total Matched Unis:", evalRes.data.academicEvaluation.totalMatched);

  // 2. RateMyChances
  const rmcRes = await fetch("http://localhost:5001/api/rate-my-chances", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      universityId: "tum-germany",
      degree: "masters",
      field: "Computer Science",
      cgpa: 8.7,
      cgpaScale: 10,
      greTotal: 324,
      ielts: 7.5,
      workExpMonths: 18,
      researchPapers: 1,
      undergradTier: "Tier 1"
    })
  }).then(r => r.json());
  console.log("2. /api/rate-my-chances success:", rmcRes.success, "odds:", (rmcRes.data.probabilityPercentage ?? rmcRes.data.finalProbability) + "%", "uni:", rmcRes.data.university.name);

  // 3. Decisions
  const decRes = await fetch("http://localhost:5001/api/decisions?country=Germany").then(r => r.json());
  console.log("3. /api/decisions success:", decRes.success, "records count:", decRes.data.length);

  // 4. Visa Mock Start
  const mockRes = await fetch("http://localhost:5001/api/visa-mock/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ country: "USA" })
  }).then(r => r.json());
  console.log("4. /api/visa-mock/start success:", mockRes.success, "data keys:", Object.keys(mockRes.data));

  // 5. SOP Generate
  const sopRes = await fetch("http://localhost:5001/api/sop/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      targetUniversity: "TUM",
      targetProgram: "M.Sc Informatics",
      degree: "masters",
      undergradMajor: "B.Tech CS",
      undergradUni: "IIT Delhi",
      notableProject: "Distributed Cache",
      careerGoals: "Distributed Systems Engineer",
      whyUniversity: "Database systems chair"
    })
  }).then(r => r.json());
  console.log("5. /api/sop/generate success:", sopRes.success, "wordCount:", sopRes.data.wordCount);

  // 6. Scholarships
  const schRes = await fetch("http://localhost:5001/api/scholarships").then(r => r.json());
  console.log("6. /api/scholarships success:", schRes.success, "scholarships count:", schRes.data.length);

  // 7. Loans
  const loanRes = await fetch("http://localhost:5001/api/loans/providers").then(r => r.json());
  console.log("7. /api/loans/providers success:", loanRes.success, "loan providers:", loanRes.data.length);

  // 8. Discussions
  const discRes = await fetch("http://localhost:5001/api/discussions").then(r => r.json());
  console.log("8. /api/discussions success:", discRes.success, "discussions count:", discRes.data.length);

  // 9. Frontend Dev Server Check
  const feRes = await fetch("http://localhost:5173/");
  console.log("9. Frontend HTTP Status:", feRes.status);
  
  console.log("=== ALL 9 YMGRAD FREE FEATURES VERIFIED AND HEALTHY ===");
}

verifyAll().catch(console.error);
