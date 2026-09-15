/**
 * Pre-Admission Cost Engine & Application Cart Simulator
 * 
 * Accurately tracks, calculates, and highlights:
 * 1. Pre-Admission Sunk Costs (Application portal fees with multi-app bundling discounts, IELTS/GRE, APS certificate, document legalizations).
 * 2. Post-Admission Mandatory Administrative Costs (Semester registration fee, transit pass, student union, tuition, visa proof of funds).
 */

// Exchange rates reference (EUR base)
const EXCHANGE_RATES = {
  EUR_TO_INR: 92.5,
  EUR_TO_USD: 1.08,
  EUR_TO_SEK: 11.4,
  EUR_TO_GBP: 0.85
};

// Standard portal bundling rules
const PORTAL_RULES = {
  "Uni-assist": {
    name: "Uni-assist (Germany)",
    currency: "EUR",
    firstAppFee: 75,
    additionalAppFee: 30,
    bundlingDescription: "Official uni-assist tariff: €75 for the 1st university, €30 for each additional application within the same semester.",
    calculate: (items) => {
      const count = items.length;
      if (count === 0) return { count: 0, bundledFee: 0, unbundledFee: 0, savings: 0 };
      const bundledFee = 75 + (count - 1) * 30;
      const unbundledFee = count * 75;
      return {
        count,
        bundledFee,
        unbundledFee,
        savings: unbundledFee - bundledFee,
        discountNote: count > 1 ? `Bundled savings of €${unbundledFee - bundledFee} applied (€75 for 1st + €30 × ${count - 1} additional)` : "Standard 1st university fee: €75"
      };
    }
  },
  "University Admissions Sweden": {
    name: "University Admissions Sweden (Antagning.se)",
    currency: "EUR",
    flatSek: 900,
    eurEquivalent: 80,
    bundlingDescription: "Antagning.se flat application fee: SEK 900 (~€80) covers up to 4 program choices in a single application round.",
    calculate: (items) => {
      const count = items.length;
      if (count === 0) return { count: 0, bundledFee: 0, unbundledFee: 0, savings: 0 };
      const flatFee = 80;
      const unbundledFee = count * 80;
      return {
        count,
        bundledFee: flatFee,
        unbundledFee,
        savings: count > 1 ? unbundledFee - flatFee : 0,
        discountNote: count > 1 ? `Flat SEK 900 (~€80) applies to all ${count} program choices (saved €${unbundledFee - flatFee})` : "Flat SEK 900 (~€80) covering up to 4 choices"
      };
    }
  },
  "UCAS": {
    name: "UCAS (United Kingdom)",
    currency: "EUR",
    flatGbp: 28.50,
    eurEquivalent: 33,
    bundlingDescription: "UCAS centralized processing: flat £28.50 (~€33) covers multiple university applications.",
    calculate: (items) => {
      const count = items.length;
      if (count === 0) return { count: 0, bundledFee: 0, unbundledFee: 0, savings: 0 };
      const flatFee = 33;
      const unbundledFee = count * 33;
      return {
        count,
        bundledFee: flatFee,
        unbundledFee,
        savings: count > 1 ? unbundledFee - flatFee : 0,
        discountNote: count > 1 ? `Flat £28.50 (~€33) for multiple UK submissions (saved €${unbundledFee - flatFee})` : "Flat £28.50 (~€33) multi-choice processing fee"
      };
    }
  },
  "Campus France": {
    name: "Campus France (Études en France)",
    currency: "EUR",
    flatFee: 90,
    bundlingDescription: "Campus France EEF centralized processing fee covers up to 7 French public university candidatures.",
    calculate: (items) => {
      const count = items.length;
      if (count === 0) return { count: 0, bundledFee: 0, unbundledFee: 0, savings: 0 };
      const flatFee = 90;
      const unbundledFee = count * 90;
      return {
        count,
        bundledFee: flatFee,
        unbundledFee,
        savings: count > 1 ? unbundledFee - flatFee : 0,
        discountNote: count > 1 ? `Flat €90 EEF dossier fee for all ${count} candidatures` : "Flat €90 EEF country processing fee"
      };
    }
  },
  "Studielink": {
    name: "Studielink (Netherlands)",
    currency: "EUR",
    bundlingDescription: "Studielink portal registration is €0. Individual Dutch universities may charge separate handling fees (€0 - €100).",
    calculate: (items) => {
      const count = items.length;
      const sum = items.reduce((acc, it) => acc + (Number(it.Application_Fee_Amount) || 0), 0);
      return {
        count,
        bundledFee: sum,
        unbundledFee: sum,
        savings: 0,
        discountNote: "Studielink portal is free (€0). Sum reflects individual university application handling fees."
      };
    }
  },
  "Universitaly": {
    name: "Universitaly (Italy)",
    currency: "EUR",
    bundlingDescription: "Universitaly pre-enrolment portal is €0. Individual Italian universities charge nominal evaluation fees (€30 - €50).",
    calculate: (items) => {
      const count = items.length;
      const sum = items.reduce((acc, it) => acc + (Number(it.Application_Fee_Amount) || 0), 0);
      return {
        count,
        bundledFee: sum,
        unbundledFee: sum,
        savings: 0,
        discountNote: "Universitaly portal is free (€0). Sum reflects individual university evaluation fees."
      };
    }
  },
  "Studyinfo.fi": {
    name: "Studyinfo.fi (Finland)",
    currency: "EUR",
    bundlingDescription: "Studyinfo.fi application round for non-EU applicants carries a flat €100 processing fee.",
    calculate: (items) => {
      const count = items.length;
      if (count === 0) return { count: 0, bundledFee: 0, unbundledFee: 0, savings: 0 };
      const flatFee = 100;
      const unbundledFee = count * 100;
      return {
        count,
        bundledFee: flatFee,
        unbundledFee,
        savings: count > 1 ? unbundledFee - flatFee : 0,
        discountNote: count > 1 ? `Flat €100 fee for Finnish joint application round (saved €${unbundledFee - flatFee})` : "Flat €100 national application round fee"
      };
    }
  },
  "DreamApply": {
    name: "DreamApply (Baltics / Central Europe)",
    currency: "EUR",
    bundlingDescription: "DreamApply centralized application portal across partner institutions.",
    calculate: (items) => {
      const count = items.length;
      const sum = items.reduce((acc, it) => acc + (Number(it.Application_Fee_Amount) || 50), 0);
      return {
        count,
        bundledFee: sum,
        unbundledFee: sum,
        savings: 0,
        discountNote: "DreamApply portal charges per institution dossier."
      };
    }
  },
  "Direct": {
    name: "Direct University Portal",
    currency: "EUR",
    bundlingDescription: "Applied directly on the university's official application portal. Fees charged per individual application.",
    calculate: (items) => {
      const count = items.length;
      const sum = items.reduce((acc, it) => acc + (Number(it.Application_Fee_Amount) || 0), 0);
      return {
        count,
        bundledFee: sum,
        unbundledFee: sum,
        savings: 0,
        discountNote: "Direct institutional portals charge independently."
      };
    }
  }
};

/**
 * Standard test and credential fees (Sunk Costs)
 */
const STANDARD_EXAM_FEES = {
  ielts: {
    name: "IELTS Academic Test",
    feeEUR: 185,
    feeINR: 17000,
    description: "Mandatory English proficiency certification for visa & admission."
  },
  toefl: {
    name: "TOEFL iBT Test",
    feeEUR: 190,
    feeINR: 17500,
    description: "Alternative standardized English test."
  },
  gre: {
    name: "GRE General Test",
    feeEUR: 245,
    feeINR: 22500,
    description: "Standardized graduate admissions exam for competitive STEM programs."
  },
  testas: {
    name: "TestAS Exam",
    feeEUR: 150,
    feeINR: 13800,
    description: "Standardized cognitive aptitude test for German undergraduate/graduate admission."
  }
};

const DOCUMENT_FEES = {
  apsIndia: {
    name: "APS Certificate (Akademische Prüfstelle India)",
    feeEUR: 195,
    feeINR: 18000,
    description: "Mandatory academic verification certificate for all Indian applicants targeting German universities before visa & admission."
  },
  apostilleAndNotary: {
    name: "Transcripts Notarization & MEA Apostille",
    feeEUR: 60,
    feeINR: 5500,
    description: "Official verification, translation, and apostille stamp of educational credentials."
  },
  courierDossier: {
    name: "International Document Courier (DHL/FedEx)",
    feeEUR: 40,
    feeINR: 3700,
    description: "Physical dispatch of certified hard-copy dossiers when required."
  }
};

/**
 * Calculates bundled application fees grouped by portal
 */
function calculatePortalBundledFees(items = []) {
  if (!items || items.length === 0) {
    return {
      groupedPortals: {},
      totalBundledFees: 0,
      totalUnbundledFees: 0,
      totalSavings: 0,
      itemCount: 0
    };
  }

  // Normalize and group items by portal type
  const grouped = {};
  items.forEach(item => {
    let portalType = item.Application_Portal_Type || "Direct";
    // Normalize variants
    if (portalType.toLowerCase().includes("uni-assist")) portalType = "Uni-assist";
    else if (portalType.toLowerCase().includes("sweden") || portalType.toLowerCase().includes("antagning")) portalType = "University Admissions Sweden";
    else if (portalType.toLowerCase().includes("ucas")) portalType = "UCAS";
    else if (portalType.toLowerCase().includes("studielink")) portalType = "Studielink";
    else if (portalType.toLowerCase().includes("campus france")) portalType = "Campus France";
    else if (portalType.toLowerCase().includes("universitaly")) portalType = "Universitaly";
    else if (portalType.toLowerCase().includes("studyinfo")) portalType = "Studyinfo.fi";
    else if (portalType.toLowerCase().includes("dreamapply")) portalType = "DreamApply";
    else if (!PORTAL_RULES[portalType]) portalType = "Direct";

    if (!grouped[portalType]) {
      grouped[portalType] = [];
    }
    grouped[portalType].push(item);
  });

  const groupedPortals = {};
  let totalBundledFees = 0;
  let totalUnbundledFees = 0;

  for (const [portalType, portalItems] of Object.entries(grouped)) {
    const rule = PORTAL_RULES[portalType] || PORTAL_RULES["Direct"];
    const calc = rule.calculate(portalItems);

    groupedPortals[portalType] = {
      portalName: rule.name,
      portalType,
      count: calc.count,
      bundledFee: calc.bundledFee,
      unbundledFee: calc.unbundledFee,
      savings: calc.savings,
      discountNote: calc.discountNote,
      bundlingDescription: rule.bundlingDescription,
      items: portalItems.map(p => ({
        id: p.id,
        name: p.name || p.universityName,
        country: p.country,
        city: p.city,
        Application_Fee_Amount: p.Application_Fee_Amount ?? 0,
        Application_Portal_Type: portalType,
        Enrollment_Semester_Fee: p.Enrollment_Semester_Fee ?? 0,
        tuitionFeeEUR: p.Tuition_Fee_International ?? p.tuitionFeeEUR ?? 0
      }))
    };

    totalBundledFees += calc.bundledFee;
    totalUnbundledFees += calc.unbundledFee;
  }

  return {
    groupedPortals,
    totalBundledFees,
    totalUnbundledFees,
    totalSavings: totalUnbundledFees - totalBundledFees,
    itemCount: items.length
  };
}

/**
 * Calculates complete Pre-Admission Sunk Cost Budget
 */
function calculatePreAdmissionBudget({
  items = [],
  selectedExams = { ielts: true, gre: false, toefl: false, testas: false },
  originCountry = "India",
  includeAps = null,
  includeApostille = true,
  includeCourier = false
} = {}) {
  const portalCalc = calculatePortalBundledFees(items);

  // Auto-detect APS requirement if targeting Germany and applicant from India/China/Vietnam
  const targetsGermany = items.some(it => {
    const c = (it.country || "").toLowerCase();
    return c === "germany" || c === "de" || (it.apsRequired === true);
  });

  const isApsApplicable = includeAps !== null 
    ? Boolean(includeAps) 
    : (targetsGermany && ["india", "china", "vietnam"].includes((originCountry || "india").toLowerCase()));

  // Calculate selected test fees
  const examFeesList = [];
  let totalExamFees = 0;

  if (selectedExams.ielts) {
    examFeesList.push({ id: "ielts", ...STANDARD_EXAM_FEES.ielts });
    totalExamFees += STANDARD_EXAM_FEES.ielts.feeEUR;
  }
  if (selectedExams.toefl) {
    examFeesList.push({ id: "toefl", ...STANDARD_EXAM_FEES.toefl });
    totalExamFees += STANDARD_EXAM_FEES.toefl.feeEUR;
  }
  if (selectedExams.gre) {
    examFeesList.push({ id: "gre", ...STANDARD_EXAM_FEES.gre });
    totalExamFees += STANDARD_EXAM_FEES.gre.feeEUR;
  }
  if (selectedExams.testas) {
    examFeesList.push({ id: "testas", ...STANDARD_EXAM_FEES.testas });
    totalExamFees += STANDARD_EXAM_FEES.testas.feeEUR;
  }

  // Verification and document fees
  const docFeesList = [];
  let totalDocFees = 0;

  if (isApsApplicable) {
    docFeesList.push({
      id: "apsIndia",
      ...DOCUMENT_FEES.apsIndia,
      isMandatoryForGermany: true
    });
    totalDocFees += DOCUMENT_FEES.apsIndia.feeEUR;
  }

  if (includeApostille) {
    docFeesList.push({ id: "apostilleAndNotary", ...DOCUMENT_FEES.apostilleAndNotary });
    totalDocFees += DOCUMENT_FEES.apostilleAndNotary.feeEUR;
  }

  if (includeCourier) {
    docFeesList.push({ id: "courierDossier", ...DOCUMENT_FEES.courierDossier });
    totalDocFees += DOCUMENT_FEES.courierDossier.feeEUR;
  }

  const grandTotalSunkCostEUR = portalCalc.totalBundledFees + totalExamFees + totalDocFees;

  return {
    portalBreakdown: portalCalc.groupedPortals,
    applicationFees: {
      totalBundledEUR: portalCalc.totalBundledFees,
      totalUnbundledEUR: portalCalc.totalUnbundledFees,
      totalSavingsEUR: portalCalc.totalSavings,
      count: portalCalc.itemCount
    },
    standardizedExams: {
      items: examFeesList,
      totalEUR: totalExamFees
    },
    documentVerification: {
      items: docFeesList,
      apsApplicable: isApsApplicable,
      totalEUR: totalDocFees
    },
    preAdmissionBudget: {
      totalSunkCostEUR: grandTotalSunkCostEUR,
      totalSunkCostINR: Math.round(grandTotalSunkCostEUR * EXCHANGE_RATES.EUR_TO_INR),
      totalSunkCostUSD: Math.round(grandTotalSunkCostEUR * EXCHANGE_RATES.EUR_TO_USD),
      breakdown: {
        applicationFeesPercent: grandTotalSunkCostEUR > 0 ? Math.round((portalCalc.totalBundledFees / grandTotalSunkCostEUR) * 100) : 0,
        examsPercent: grandTotalSunkCostEUR > 0 ? Math.round((totalExamFees / grandTotalSunkCostEUR) * 100) : 0,
        verificationPercent: grandTotalSunkCostEUR > 0 ? Math.round((totalDocFees / grandTotalSunkCostEUR) * 100) : 0
      }
    }
  };
}

/**
 * Calculates the two-card Hidden Costs breakdown for a specific university:
 * Card 1: Pre-Admission Costs (Application fee, portal, tests, APS)
 * Card 2: Post-Admission Costs (Tuition, mandatory semester registration fee, transit ticket, visa blocked account)
 */
function getUniversityCostBreakdown(uni, originCountry = "India") {
  if (!uni) return null;

  const appFee = Number(uni.Application_Fee_Amount) || 0;
  const portalType = uni.Application_Portal_Type || "Direct";
  const semesterFee = Number(uni.Enrollment_Semester_Fee) || 0;
  const annualEnrollmentFee = semesterFee * 2;
  const tuitionFee = Number(uni.Tuition_Fee_International ?? uni.tuitionFeeEUR ?? 0);

  // Visa Proof of funds benchmarks by country
  const country = (uni.country || "").toLowerCase();
  let visaBlockedAccountEUR = 11904; // Standard Germany 2024/2025: €992/mo = €11,904/yr
  let visaProofLabel = "Blocked Account (Sperrkonto)";

  if (country.includes("france")) {
    visaBlockedAccountEUR = 7380; // €615/mo * 12
    visaProofLabel = "Proof of Solvency (€615/mo)";
  } else if (country.includes("netherland")) {
    visaBlockedAccountEUR = 14600; // IND requirement
    visaProofLabel = "IND Solvency Requirement";
  } else if (country.includes("sweden")) {
    visaBlockedAccountEUR = 11400; // Migrationsverket SEK 10,580/mo
    visaProofLabel = "Migrationsverket Living Funds";
  } else if (country.includes("italy")) {
    visaBlockedAccountEUR = 6000;
    visaProofLabel = "Annual Bank Guarantee";
  } else if (country.includes("ireland")) {
    visaBlockedAccountEUR = 10000;
    visaProofLabel = "Immigration Living Proof";
  } else if (country.includes("united kingdom") || country === "uk") {
    visaBlockedAccountEUR = 15500;
    visaProofLabel = "UKVI Maintenance (£1,023-£1,334/mo)";
  } else if (country.includes("usa")) {
    visaBlockedAccountEUR = 22000;
    visaProofLabel = "I-20 Form Liquid Funds";
  }

  const isGermany = country === "germany" || country === "de";
  const apsRequired = isGermany && ["india", "china", "vietnam"].includes((originCountry || "india").toLowerCase());

  return {
    universityId: uni.id,
    universityName: uni.name,
    country: uni.country,
    city: uni.city,

    // CARD 1: Pre-Admission Costs (Sunk Costs before admission)
    preAdmissionCard: {
      title: "Pre-Admission Costs",
      subtitle: "Non-refundable administrative expenses incurred during the application stage",
      applicationFeeEUR: appFee,
      applicationPortalType: portalType,
      portalFeeNote: uni.Application_Fee_Details || (
        portalType === "Uni-assist" 
          ? "€75 for 1st university, €30 for each additional application" 
          : portalType === "University Admissions Sweden"
            ? "SEK 900 (~€80) flat for up to 4 choices"
            : portalType === "UCAS"
              ? "£28.50 (~€33) flat multi-choice submission"
              : appFee === 0 
                ? "Free Direct Application (€0 processing fee)" 
                : `€${appFee} direct institutional handling fee`
      ),
      apsRequirement: {
        isRequired: apsRequired,
        feeEUR: apsRequired ? 195 : 0,
        feeINR: apsRequired ? 18000 : 0,
        note: apsRequired 
          ? "Mandatory APS India certificate verification before submission" 
          : "Not required"
      },
      standardExamsRecommended: {
        ieltsFeeEUR: 185,
        greRequired: Boolean(uni.greRequirement && !uni.greRequirement.toLowerCase().includes("not required"))
      },
      estimatedPreAdmissionSubtotalEUR: appFee + (apsRequired ? 195 : 0) + 185
    },

    // CARD 2: Post-Admission Costs (Mandatory Administrative & Enrollment)
    postAdmissionCard: {
      title: "Post-Admission & Enrollment Costs",
      subtitle: "Mandatory administrative fees and statutory proof of funds due upon receiving your offer",
      tuitionFeePerYearEUR: tuitionFee,
      tuitionDisplay: tuitionFee === 0 ? "€0 / year (Tuition-Free)" : `€${tuitionFee.toLocaleString()} / year`,
      isTuitionFree: tuitionFee === 0,
      mandatorySemesterFeeEUR: semesterFee,
      semesterFeeBreakdown: uni.Enrollment_Fee_Breakdown || (
        isGermany 
          ? `€${semesterFee}/semester (includes semester transit pass & Studentenwerk student union contribution)`
          : `€${semesterFee}/semester mandatory administrative registration`
      ),
      annualMandatorySemesterFeeEUR: annualEnrollmentFee,
      visaProofOfFundsEUR: visaBlockedAccountEUR,
      visaProofLabel,
      totalFirstYearAdministrativeOutlayEUR: tuitionFee + annualEnrollmentFee,
      immediateAdmissionCashRequiredEUR: semesterFee + visaBlockedAccountEUR + (tuitionFee > 0 ? Math.round(tuitionFee / 2) : 0)
    }
  };
}

module.exports = {
  EXCHANGE_RATES,
  PORTAL_RULES,
  STANDARD_EXAM_FEES,
  DOCUMENT_FEES,
  calculatePortalBundledFees,
  calculatePreAdmissionBudget,
  getUniversityCostBreakdown
};
