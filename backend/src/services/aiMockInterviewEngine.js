/**
 * AI Visa Mock Interview Engine
 * Simulates official consular interview counters (US F-1, Germany National Visa, Canada Study Permit, UKVI)
 * Evaluates applicant responses in real time with scoring, refusal trigger detection, and model rewrites.
 */

const VISA_PERSONAS = {
  USA_F1: {
    country: "USA",
    visaTitle: "U.S. F-1 Non-Immigrant Student Visa",
    officerTitle: "Consular Officer (U.S. Consulate General)",
    mandate: "Strict enforcement of INA Section 214(b) (Presumption of immigrant intent). Must prove genuine non-immigrant intent, verifiable family finances, and strong socioeconomic ties to India.",
    starterQuestions: [
      {
        id: "q_us_01",
        question: "Good morning. Pass me your I-20 and passport, please. Why did you choose this specific university in the United States over Indian universities?",
        targetDimension: "Academic Credibility & Program Specificity",
        commonMistakes: "Saying 'US has great education' or reciting generic QS rankings without naming specific professors or course labs."
      },
      {
        id: "q_us_02",
        question: "I see your 1st year cost on the I-20 is $45,000. How is your family planning to fund your education, and what does your sponsor do?",
        targetDimension: "Financial Conviction & Genuine Solvency",
        commonMistakes: "Saying 'I have a bank loan' without explaining parent's annual ITR or debt servicing capability."
      },
      {
        id: "q_us_03",
        question: "What are your specific career plans immediately after graduating from this master's degree?",
        targetDimension: "Non-Immigrant Intent (Section 214b)",
        commonMistakes: "Mentioning wanting to work in the US, apply for H-1B, or settle abroad. Triggers instant 214(b) refusal."
      },
      {
        id: "q_us_04",
        question: "I notice you graduated in 2023. What have you been doing since graduation?",
        targetDimension: "Academic & Career Continuity",
        commonMistakes: "Stating you were 'just preparing for GRE' or leaving unexplained study gaps."
      }
    ]
  },

  GERMANY_NATIONAL: {
    country: "Germany",
    visaTitle: "German National Student Visa (Section 16b AufenthG)",
    officerTitle: "Consular Officer (German Diplomatic Mission in India)",
    mandate: "Verification of APS certificate, proof of €11,904 blocked account, understanding of credit curriculum (ECTS), and language readiness.",
    starterQuestions: [
      {
        id: "q_de_01",
        question: "Guten Tag. Can you show me your APS Certificate and your university admission letter? Why did you choose Germany instead of the US or UK?",
        targetDimension: "Socioeconomic Rationale & Public University Model",
        commonMistakes: "Mentioning 'Germany is tuition-free' as the sole primary reason rather than the technological research reputation."
      },
      {
        id: "q_de_02",
        question: "How have you prepared your financial proof, and which licensed provider did you use for your Sperrkonto?",
        targetDimension: "Statutory Financial Proof",
        commonMistakes: "Confusion regarding monthly payout limits (€992/mo) or unverified loan sanctions."
      },
      {
        id: "q_de_03",
        question: "Can you explain two core subject modules from your upcoming Master's examination regulations (Prüfungsordnung)?",
        targetDimension: "Academic Preparedness & Study Plan Integrity",
        commonMistakes: "Inability to name exact subjects, professors, or thesis options in the curriculum."
      }
    ]
  },

  CANADA_STUDY: {
    country: "Canada",
    visaTitle: "Canadian Study Permit (IRCC)",
    officerTitle: "Immigration Officer (IRCC)",
    mandate: "Validation of Provincial Attestation Letter (PAL), CAD $20,635 GIC, academic career progression, and ties to home country.",
    starterQuestions: [
      {
        id: "q_ca_01",
        question: "How does this post-graduate certificate or master's program logically build upon your Bachelor's degree and prior work in India?",
        targetDimension: "Career Progression & Academic Logic",
        commonMistakes: "Downgrading qualifications (e.g. Bachelor's in CS applying for generic diploma) without clear career justification."
      },
      {
        id: "q_ca_02",
        question: "How did your sponsor arrange the CAD $20,635 GIC plus first-year tuition fee without sudden unexplained deposits?",
        targetDimension: "Source of Funds & Audit Trail",
        commonMistakes: "Lump-sum transfers into savings right before GIC purchase without documentary proof of origin."
      }
    ]
  }
};

/**
 * Initializes a visa mock session
 */
function startMockInterview(country = "USA") {
  let personaKey = "USA_F1";
  if (country === "Germany") personaKey = "GERMANY_NATIONAL";
  else if (country === "Canada") personaKey = "CANADA_STUDY";

  const persona = VISA_PERSONAS[personaKey];
  const firstQuestion = persona.starterQuestions[0];

  return {
    sessionId: "mock-" + Date.now(),
    country: persona.country,
    visaTitle: persona.visaTitle,
    officerTitle: persona.officerTitle,
    mandate: persona.mandate,
    currentQuestionIndex: 0,
    totalQuestions: persona.starterQuestions.length,
    currentQuestion: firstQuestion,
    history: []
  };
}

/**
 * Evaluates an applicant's response to an interview question
 */
function evaluateResponse(country, questionId, studentAnswer) {
  const answer = (studentAnswer || "").trim();
  const lower = answer.toLowerCase();

  let score = 7;
  let intentScore = 8;
  let financialScore = 8;
  let clarityScore = 7;
  const detectedRedFlags = [];
  const positiveHighlights = [];
  let modelAnswer = "";

  if (answer.length < 25) {
    return {
      score: 3,
      verdict: "Needs Immediate Improvement",
      feedback: "Answer is far too brief and lacks conviction. Consular interviews last only 60–120 seconds; every sentence must carry concrete facts.",
      redFlags: ["Extreme brevity; conveys hesitation or lack of academic preparation."],
      dimensionScores: { nonImmigrantIntent: 4, financialConviction: 4, clarity: 3 },
      modelAnswer: "Expand with 2-3 structured sentences covering specific university curriculum, faculty, and return intent."
    };
  }

  // --- RED FLAG & INTENT CHECKS ---
  if (lower.includes("settle in us") || lower.includes("settle in usa") || lower.includes("pr in canada") || lower.includes("green card") || lower.includes("stay permanently") || lower.includes("find a job there")) {
    score -= 4;
    intentScore = 2;
    detectedRedFlags.push("CRITICAL REFUSAL TRIGGER (Section 214b): You stated or implied intent to settle or look for long-term residency abroad. Consular officers are mandated by law to reject applicants who fail to show temporary non-immigrant intent.");
  }

  if (lower.includes("opt") && lower.includes("work in us") && !lower.includes("return to india")) {
    score -= 2;
    intentScore = 5;
    detectedRedFlags.push("Overemphasis on OPT / US employment without reinforcing long-term return intent to India.");
  }

  if (lower.includes("cheap") || lower.includes("free tuition") || lower.includes("no fees")) {
    score -= 2;
    clarityScore -= 2;
    detectedRedFlags.push("Mentioning cost/tuition-free as primary motivator. Visa officers view this as economic opportunism rather than genuine academic passion.");
  }

  // --- POSITIVE SIGNALS ---
  if (lower.includes("curriculum") || lower.includes("lab") || lower.includes("professor") || lower.includes("course") || lower.includes("specialization") || lower.includes("project")) {
    score += 1;
    clarityScore += 2;
    positiveHighlights.push("Excellent program specificity: Referenced academic coursework, faculty, or research labs.");
  }

  if (lower.includes("india") || lower.includes("return") || lower.includes("family") || lower.includes("long-term") || lower.includes("firm") || lower.includes("industry in india")) {
    score += 1;
    intentScore += 2;
    positiveHighlights.push("Strong home ties: Established clear career roadmap returning to Indian industry.");
  }

  if (lower.includes("savings") || lower.includes("itr") || lower.includes("loan") || lower.includes("father") || lower.includes("mother") || lower.includes("income")) {
    financialScore += 1;
    positiveHighlights.push("Clear financial accountability: Transparently identified funding sources.");
  }

  // Final scoring bounded 1 to 10
  const finalScore = Math.max(2, Math.min(10, score));
  const finalIntent = Math.max(1, Math.min(10, intentScore));
  const finalFinancial = Math.max(1, Math.min(10, financialScore));
  const finalClarity = Math.max(1, Math.min(10, clarityScore));

  let verdict = "Approved - Strong Impression";
  if (finalScore < 5) verdict = "Refusal Risk (214b / Inadequate Preparation)";
  else if (finalScore < 7) verdict = "Borderline - Needs Polish";

  // Contextual Model Answer
  if (country === "Germany" || questionId.includes("de")) {
    modelAnswer = "I selected this Master's at RWTH Aachen because their Institute of Automotive Engineering offers advanced coursework in Autonomous Electric Drivetrains, perfectly continuing my B.Tech thesis. Furthermore, Germany's industrial integration with manufacturers like Bosch gives me the practical engineering depth I need to return to India and join Tata Motors' EV powertrain R&D division.";
  } else if (country === "Canada" || questionId.includes("ca")) {
    modelAnswer = "My father, a civil engineer with an annual ITR of ₹16 Lakhs, has funded my full first-year tuition plus CAD $20,635 in my Scotiabank GIC account. This specialized master's directly addresses the enterprise cloud architecture demands of the Indian IT sector, where I will return to join our family technology consultancy.";
  } else {
    modelAnswer = "I chose Arizona State University because of their specialized Big Data Systems lab under Dr. Sarma, which offers hands-on modules in distributed computing that are unavailable in my undergraduate curriculum. My education is fully backed by ₹25 Lakhs liquid savings and a ₹30 Lakhs SBI loan with my parents' ₹14 Lakhs annual ITR. Post-graduation, I will return to Bengaluru to join cloud engineering consulting firms in our rapidly growing enterprise SaaS market.";
  }

  return {
    score: finalScore,
    verdict,
    dimensionScores: {
      nonImmigrantIntent: finalIntent,
      financialConviction: finalFinancial,
      academicClarity: finalClarity
    },
    redFlags: detectedRedFlags,
    positiveHighlights,
    modelAnswer
  };
}

module.exports = {
  VISA_PERSONAS,
  startMockInterview,
  evaluateResponse
};
