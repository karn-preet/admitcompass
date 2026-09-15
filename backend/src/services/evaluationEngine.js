/**
 * Core Evaluation Engine
 * Evaluates academic profile against international public university admission criteria.
 * Supports German Bavarian Grade Conversion, US GPA conversion, and Indian academic weighting.
 */

const { getStore } = require("../config/db");

/**
 * Converts Indian CGPA (out of 10) or Percentage to German Grade (1.0 to 4.0, lower is better)
 * Standard Bavarian Formula: 1 + 3 * (Nmax - Nd) / (Nmax - Nmin)
 */
function calculateGermanGrade(cgpa10, isPercentage = false) {
  const nMax = isPercentage ? 100 : 10.0;
  const nMin = isPercentage ? 40 : 4.0; // Standard Indian passing threshold
  const nd = Math.min(Math.max(Number(cgpa10) || 0, nMin), nMax);

  const germanGrade = 1 + 3 * ((nMax - nd) / (nMax - nMin));
  return Number(germanGrade.toFixed(2));
}

/**
 * Converts Indian CGPA to US 4.0 scale (WES equivalent estimate)
 */
function calculateUSGPA(cgpa10) {
  const score = Number(cgpa10) || 0;
  if (score >= 9.0) return Number((3.7 + ((score - 9.0) / 1.0) * 0.3).toFixed(2));
  if (score >= 8.0) return Number((3.3 + ((score - 8.0) / 1.0) * 0.4).toFixed(2));
  if (score >= 7.0) return Number((3.0 + ((score - 7.0) / 1.0) * 0.3).toFixed(2));
  if (score >= 6.0) return Number((2.6 + ((score - 6.0) / 1.0) * 0.4).toFixed(2));
  if (score >= 5.0) return Number((2.2 + ((score - 5.0) / 1.0) * 0.4).toFixed(2));
  return 2.0;
}

/**
 * Evaluates student profile across target universities
 */
function evaluateAcademicProfile(profile) {
  const {
    degreeTarget = "Master's",
    backgroundField = "Computer Science",
    currentCGPA = 7.0,
    isPercentage = false,
    collegeTier = "Tier 2", // Tier 1, Tier 2, Tier 3
    backlogs = 0,
    ieltsScore = 6.5,
    ieltsBandMin = 6.0,
    toeflScore = 85,
    pteScore = null,
    greQuant = 160,
    greVerbal = 150,
    greTotal = 310,
    testASScore = null,
    workExperienceYears = 0,
    researchPapersCount = 0,
    targetCountries = []
  } = profile;

  const cgpa = Number(currentCGPA) || 7.0;
  const germanGrade = calculateGermanGrade(cgpa, isPercentage);
  const usGPA = calculateUSGPA(cgpa);

  // College Tier Bonus/Adjustment for Indian applicants
  let tierBonus = 0;
  if (collegeTier === "Tier 1 (IIT/NIT/BITS/IISc/Centrally Funded)") tierBonus = 0.4;
  else if (collegeTier === "Tier 2 (State Govt/Top Autonomous/Vellore/Manipal)") tierBonus = 0.15;
  else tierBonus = 0; // Tier 3 Affiliated colleges

  // Experience & Research Bonuses
  const expBonus = Math.min(Number(workExperienceYears) * 0.1, 0.4);
  const researchBonus = Math.min(Number(researchPapersCount) * 0.2, 0.5);

  const effectiveCGPA = Number((cgpa + tierBonus + expBonus + researchBonus).toFixed(2));

  // Retrieve university database
  const store = getStore();
  let universities = [...store.universities];

  // Optional: Filter by Maximum Annual Tuition if user specified a budget boundary
  const maxTuitionLimit = (profile.maxAnnualTuition !== undefined && profile.maxAnnualTuition !== null && profile.maxAnnualTuition !== "")
    ? Number(profile.maxAnnualTuition)
    : ((profile.maxTuition !== undefined && profile.maxTuition !== null && profile.maxTuition !== "")
      ? Number(profile.maxTuition)
      : null);

  if (maxTuitionLimit !== null && !isNaN(maxTuitionLimit) && maxTuitionLimit >= 0) {
    universities = universities.filter(u => u.Tuition_Fee_International <= maxTuitionLimit);
  }

  // Filter by country or EU region if selected
  if (targetCountries && targetCountries.length > 0) {
    const isAllEu = targetCountries.some(c => 
      c.toLowerCase() === "all eu countries" || 
      c.toLowerCase() === "eu" || 
      c.toLowerCase().includes("all eu")
    );

    if (!isAllEu) {
      const normalizedTargets = new Set();
      targetCountries.forEach(c => {
        const lower = c.toLowerCase().trim();
        normalizedTargets.add(lower);
        if (lower === "czechia") normalizedTargets.add("czech republic");
        if (lower === "czech republic") normalizedTargets.add("czechia");
        if (lower === "uk") normalizedTargets.add("united kingdom");
        if (lower === "united kingdom") normalizedTargets.add("uk");
      });

      universities = universities.filter(u => {
        const uCountry = u.country.toLowerCase().trim();
        const matchesCountry = normalizedTargets.has(uCountry);
        const matchesAlias = u.countryAliases && u.countryAliases.some(a => normalizedTargets.has(a.toLowerCase().trim()));
        return matchesCountry || matchesAlias;
      });
    } else {
      // Unbiased capture of all 27 EU nations across all tuition brackets
      const euCountriesSet = new Set([
        "austria", "belgium", "bulgaria", "croatia", "cyprus", "czechia", "czech republic",
        "denmark", "estonia", "finland", "france", "germany", "greece",
        "hungary", "ireland", "italy", "latvia", "lithuania", "luxembourg",
        "malta", "netherlands", "poland", "portugal", "romania", "slovakia",
        "slovenia", "spain", "sweden"
      ]);

      universities = universities.filter(u => 
        (u.region && u.region.includes("EU")) || 
        euCountriesSet.has(u.country.toLowerCase().trim())
      );
    }
  }

  const results = universities.map(uni => {
    let probabilityScore = 50; // default baseline
    const positiveFactors = [];
    const riskFactors = [];

    // 1. CGPA vs Cutoff comparison
    const cgpaDiff = effectiveCGPA - uni.minCGPA10;
    if (cgpaDiff >= 1.0) {
      probabilityScore += 30;
      positiveFactors.push(`Your academic score (${cgpa} CGPA / German ${germanGrade}) comfortably exceeds the university minimum threshold (${uni.minCGPA10}).`);
    } else if (cgpaDiff >= 0.2) {
      probabilityScore += 18;
      positiveFactors.push(`Academic CGPA matches the target profile.`);
    } else if (cgpaDiff >= -0.3) {
      probabilityScore += 0; // borderline
      riskFactors.push(`Borderline CGPA (${cgpa} vs minimum ${uni.minCGPA10}). Compensatory factors needed.`);
    } else {
      probabilityScore -= 30;
      riskFactors.push(`Current CGPA (${cgpa}) is below typical admission threshold (${uni.minCGPA10}).`);
    }

    // 2. Language proficiency test check
    const englishScore = Number(ieltsScore) || (Number(toeflScore) ? toeflScore / 15 : 6.0);
    if (englishScore >= uni.ieltsMinOverall) {
      probabilityScore += 10;
      positiveFactors.push(`IELTS score (${ieltsScore}) meets university standard (${uni.ieltsMinOverall}).`);
    } else {
      probabilityScore -= 20;
      riskFactors.push(`IELTS score (${ieltsScore}) is below minimum requirement (${uni.ieltsMinOverall}). Must retake or meet band cutoffs.`);
    }

    // Band minimum check
    if (ieltsBandMin < uni.ieltsMinBand) {
      probabilityScore -= 10;
      riskFactors.push(`One or more IELTS bands is below the required individual cutoff (${uni.ieltsMinBand}).`);
    }

    // 3. GRE evaluation
    if (uni.country === "USA" || uni.name.includes("RWTH Aachen") || uni.name.includes("TUM") || uni.name.includes("Delft")) {
      if (greQuant >= 164) {
        probabilityScore += 15;
        positiveFactors.push(`Strong GRE Quantitative score (${greQuant}) acts as an outstanding compensatory factor.`);
      } else if (greQuant >= 158) {
        probabilityScore += 8;
        positiveFactors.push(`Satisfactory GRE score (${greTotal}).`);
      } else if (greQuant < 155 && (uni.country === "USA" || uni.name.includes("RWTH Aachen"))) {
        probabilityScore -= 12;
        riskFactors.push(`GRE Quant (${greQuant}) is below competitive average for STEM programs.`);
      }
    }

    // 4. Backlog tolerance
    const backlogCount = Number(backlogs) || 0;
    if (backlogCount > uni.maxBacklogsAllowed) {
      probabilityScore -= 25;
      riskFactors.push(`High backlog count (${backlogCount}) exceeds university and immigration risk limit (max ${uni.maxBacklogsAllowed} recommended).`);
    } else if (backlogCount === 0) {
      probabilityScore += 5;
      positiveFactors.push("Zero academic backlogs (strong asset for visa and admission).");
    }

    // 5. Country specific additions
    if (uni.country === "Germany") {
      if (profile.germanLanguageLevel && ["A2", "B1", "B2", "C1"].includes(profile.germanLanguageLevel)) {
        probabilityScore += 10;
        positiveFactors.push(`German language certification (${profile.germanLanguageLevel}) vastly improves admission and assistantship prospects.`);
      }
    }

    // Clamp score between 5 and 96
    probabilityScore = Math.min(Math.max(Math.round(probabilityScore), 5), 96);

    let category = "Target";
    if (probabilityScore >= 75) category = "Safe";
    else if (probabilityScore < 50) category = "Reach";

    return {
      university: {
        ...uni,
        Institution_Type: uni.Institution_Type || "Public",
        Language_of_Instruction: uni.Language_of_Instruction || "English",
        Tuition_Fee_International: uni.Tuition_Fee_International ?? uni.tuitionFeeEUR,
        tuitionFeeEUR: uni.Tuition_Fee_International ?? uni.tuitionFeeEUR,
        tuitionEurPerYear: uni.Tuition_Fee_International ?? uni.tuitionEurPerYear,
        Cost_of_Living_Index: uni.Cost_of_Living_Index,
        livingCostPerYearEUR: uni.livingCostPerYearEUR,
        Degree_Level: uni.Degree_Level || uni.degreesOffered || ["Master's", "Bachelor's"],
        tuitionDisplay: uni.tuitionDisplay,
        intakes: uni.intakes,
        applicationDeadlines: uni.applicationDeadlines,
        courseCatalogUrl: uni.courseCatalogUrl,
        officialWebsite: uni.officialWebsite,
        officialCitation: uni.officialCitation,
        compensatoryFactors: uni.compensatoryFactors,
        // Verified Academic Admission Cutoffs
        minCGPA10: uni.minCGPA10,
        minGermanGrade: uni.minGermanGrade,
        minUSGPA: uni.minUSGPA,
        ieltsMinOverall: uni.ieltsMinOverall,
        ieltsMinBand: uni.ieltsMinBand,
        toeflMin: uni.toeflMin,
        greRequirement: uni.greRequirement,
        maxBacklogsAllowed: uni.maxBacklogsAllowed,
        testASAccepted: uni.testASAccepted,
        acceptanceRate: uni.acceptanceRate,
        apsRequired: uni.apsRequired,
        Application_Fee_Amount: uni.Application_Fee_Amount,
        Application_Portal_Type: uni.Application_Portal_Type,
        Application_Fee_Details: uni.Application_Fee_Details,
        Enrollment_Semester_Fee: uni.Enrollment_Semester_Fee,
        Enrollment_Fee_Breakdown: uni.Enrollment_Fee_Breakdown,
        programsAvailable: uni.programsAvailable || uni.fields || ["Computer Science", "Data Science", "Software Engineering"]
      },
      probabilityScore,
      category,
      positiveFactors,
      riskFactors
    };
  });

  // Group by category
  const safeUniversities = results.filter(r => r.category === "Safe").sort((a, b) => b.probabilityScore - a.probabilityScore);
  const targetUniversities = results.filter(r => r.category === "Target").sort((a, b) => b.probabilityScore - a.probabilityScore);
  const reachUniversities = results.filter(r => r.category === "Reach").sort((a, b) => b.probabilityScore - a.probabilityScore);

  return {
    academicSummary: {
      originalCGPA: cgpa,
      effectiveCGPA,
      germanGrade,
      usGPA,
      ieltsScore,
      greTotal,
      backlogs: Number(backlogs) || 0,
      tier: collegeTier
    },
    totalMatched: results.length,
    counts: {
      safe: safeUniversities.length,
      target: targetUniversities.length,
      reach: reachUniversities.length
    },
    matches: {
      safe: safeUniversities,
      target: targetUniversities,
      reach: reachUniversities
    },
    allMatches: results
  };
}

module.exports = {
  calculateGermanGrade,
  calculateUSGPA,
  evaluateAcademicProfile
};
