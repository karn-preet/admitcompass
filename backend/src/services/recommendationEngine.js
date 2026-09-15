/**
 * Dynamic Compensatory Recommendation Engine
 * Tailored specifically for students with average CGPA (6.0 - 7.5) and Indian applicants.
 * Generates concrete, high-leverage compensatory actions to maximize public university admissions.
 */

function generateCompensatoryRecommendations(academicProfile, financialProfile = {}) {
  const cgpa = Number(academicProfile.currentCGPA) || 7.0;
  const degree = academicProfile.degreeTarget || "Master's";
  const field = academicProfile.backgroundField || "Computer Science";
  const greTotal = Number(academicProfile.greTotal) || 0;
  const greQuant = Number(academicProfile.greQuant) || 0;
  const ieltsScore = Number(academicProfile.ieltsScore) || 6.5;
  const backlogs = Number(academicProfile.backlogs) || 0;
  const targetCountries = academicProfile.targetCountries || ["Germany", "USA", "UK", "Canada", "Australia"];

  const recommendations = [];
  const compensatoryActionPlan = [];

  // ==========================================
  // 1. STRATEGIES FOR AVERAGE CGPA (6.0 - 7.5)
  // ==========================================
  if (cgpa <= 7.6) {
    // Strategy A: Standardized Exam Offset (GRE / TestAS)
    if (greQuant < 164) {
      compensatoryActionPlan.push({
        pillar: "Standardized Exam Offset",
        title: "Score 164+ on GRE Quantitative Section",
        impactLevel: "HIGH (+20% Admission Odds)",
        timeToComplete: "6 to 8 weeks of focused preparation",
        rationale: "Public universities in Germany (TUM, RWTH Aachen), USA (UT Dallas, San Jose State, ASU), and Netherlands (TU Delft) explicitly use GRE Quant to calculate Stage-1 aptitude scores. A 165 Quant mathematically balances an Indian CGPA of 6.8 - 7.3.",
        actionSteps: [
          "Target arithmetic, algebra, and advanced data interpretation using Manhattan 5lb and official ETS materials.",
          "Aim for total GRE score >= 318 (Quant >= 165, Verbal >= 153, AWA >= 3.5).",
          "Submit GRE scores even to universities where it is listed as 'Optional' — this immediately sets your application apart from pure GPA filters."
        ]
      });
    }

    // Strategy B: German Language Leverage (For EU / Germany Aspirants)
    if (targetCountries.includes("Germany") || targetCountries.includes("EU")) {
      compensatoryActionPlan.push({
        pillar: "Language Differentiation",
        title: "Achieve Goethe-Zertifikat A2 or B1 German Proficiency",
        impactLevel: "VERY HIGH (Expands eligible programs by 5x)",
        timeToComplete: "3 to 5 months via Goethe-Institut (Max Mueller Bhavan) or Language Studio",
        rationale: "While 100% English-taught public programs in Germany receive 1,000+ Indian applications for 40 seats, bilingual or German-track master's programs receive 80% fewer applicants. Furthermore, German professors look very favorably on applicants with A2/B1 in admission committee meetings.",
        actionSteps: [
          "Enroll in Goethe-Institut intensive A1/A2 track.",
          "Highlight German language pursuit on your resume with current CEFR certificate.",
          "Target public universities offering 'German-preparation semester' alongside provisional admission."
        ]
      });
    }

    // Strategy C: Fachhochschule (Universities of Applied Sciences) Pivot
    if (targetCountries.includes("Germany")) {
      compensatoryActionPlan.push({
        pillar: "Institutional Strategy",
        title: "Prioritize Universities of Applied Sciences (Fachhochschulen / HAW)",
        impactLevel: "CRITICAL STRATEGY FOR CGPA 6.5 - 7.5",
        timeToComplete: "Immediate (Selection during application round)",
        rationale: "German higher education has two distinct pillars: Traditional Technical Universities (TUs) which are heavily theoretical and enforce strict cutoffs (often requiring German grade < 2.0 / CGPA > 8.0), and Universities of Applied Sciences (Fachhochschulen / UAS) which focus on hands-on practical engineering. UAS degrees hold 100% equal legal and employment standing in Germany and are tuition-free public institutions!",
        actionSteps: [
          "Shortlist top public UAS: Darmstadt UAS (h_da), TH Köln, Frankfurt UAS, Hamburg UAS, and Esslingen UAS.",
          "Structure your Statement of Purpose around practical coding, lab experiments, and industry internships rather than pure theoretical research."
        ]
      });
    }

    // Strategy D: Research Paper or Open-Source Portfolio
    compensatoryActionPlan.push({
      pillar: "Practical Proof of Competence",
      title: "Publish 1 IEEE/Scopus Conference Paper or Build a Verified GitHub Portfolio",
      impactLevel: "MEDIUM-HIGH (+15% Profile Weight)",
      timeToComplete: "2 to 3 months",
      rationale: "Admission committees (especially in Canada, US, and EU) look for evidence of self-directed technical capability to verify that an average CGPA was not due to lack of intellectual depth.",
      actionSteps: [
        "Collaborate with college professors on an applied machine learning, cloud architecture, or IoT project.",
        "Target student conferences or Scopus/Springer indexed symposiums.",
        "Alternatively, deploy 2 production-grade applications on GitHub with live Dockerized URLs, detailed README documentation, and architecture diagrams linked on your CV."
      ]
    });
  }

  // ==========================================
  // 2. BACHELOR'S APPLICANTS SPECIAL LOGIC
  // ==========================================
  if (degree === "Bachelor's") {
    compensatoryActionPlan.push({
      pillar: "Undergraduate Pathway",
      title: "Take TestAS Examination (Core + Engineering / Math Module)",
      impactLevel: "HIGH (Mandatory or strong bonus for German Bachelor's)",
      timeToComplete: "Book at nearest Goethe-Institut Test Centre",
      rationale: "For Indian high-school graduates (12th Board), direct admission to German public universities typically requires either completing 1 year of Bachelor's in India or attending a 1-year preparatory Studienkolleg. A high TestAS score (> 100 standard score) can unlock direct qualifying tracks.",
      actionSteps: [
        "Register for TestAS in English on testas.de.",
        "Select subject module: 'Engineering Sciences' or 'Mathematics, Computer Science and Natural Sciences'.",
        "Submit TestAS score report alongside your 12th Board marksheet."
      ]
    });
  }

  // ==========================================
  // 3. BACKLOG MITIGATION ADVICE
  // ==========================================
  if (backlogs > 0) {
    compensatoryActionPlan.push({
      pillar: "Backlog Defense Strategy",
      title: `Legal Backlog Explanation Dossier (${backlogs} Backlog${backlogs > 1 ? "s" : ""})`,
      impactLevel: "CRITICAL FOR VISA & ADMISSION (AUSTRALIA/CANADA)",
      timeToComplete: "1 week documentation",
      rationale: "Australian Department of Home Affairs and Canadian public universities strictly monitor backlog history. A candidate with backlogs can still get admitted and approved for a visa if the backlogs are clearly documented as cleared in subsequent semesters without dropping out.",
      actionSteps: [
        "Obtain an official 'Backlog Summary Certificate' from your University Registrar detailing total attempts, passing dates, and current cleared status.",
        "Draft an honest 1-paragraph addendum in your Statement of Purpose explaining the extenuating circumstances (e.g., medical reasons, COVID disruption, or initial transition difficulty) and emphasize the upward trend in subsequent semesters.",
        "Avoid applying to universities that advertise 'Max 2 backlogs' (such as TU Munich or UNSW Sydney) and target universities with flexible backlog caps (ASU, UTD, RMIT, Windsor)."
      ]
    });
  }

  // ==========================================
  // 4. FINANCIAL HACKS FOR INDIAN STUDENTS
  // ==========================================
  compensatoryActionPlan.push({
    pillar: "Financial Engineering for Indian Parents",
    title: "Leverage Section 80E Tax Rebates & Nationalized Bank Education Loans",
    impactLevel: "SAVE UP TO ₹3 - ₹6 LAKHS IN TAX & INTEREST",
    timeToComplete: "2 to 3 weeks during loan sanctioning",
    rationale: "Under Section 80E of the Indian Income Tax Act, the entire interest paid on an education loan for higher studies abroad is 100% tax-deductible for 8 consecutive years without any upper ceiling! Moreover, public sector loans from SBI (Global Ed-Vantage) offer ~9.5% - 10.5% interest compared to 13% - 15% charged by private NBFCs.",
    actionSteps: [
      "Approach SBI, Bank of Baroda, or Canara Bank for collateral-based education loan against residential property or fixed deposit.",
      "Avail 0.50% interest concession for female students under central government guidelines.",
      "Ensure loan sanction letter mentions 'Disbursement in Foreign Currency directly to University / Blocked Account' to serve as unimpeachable visa proof."
    ]
  });

  return {
    cgpaStatus: cgpa >= 8.0 ? "High Competitive" : cgpa >= 7.0 ? "Average / Moderate (Target Zone)" : "Challenging (Needs Strong Compensatory Anchors)",
    compensatoryActionPlan
  };
}

module.exports = {
  generateCompensatoryRecommendations
};
