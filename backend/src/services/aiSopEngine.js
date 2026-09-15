/**
 * AI Statement of Purpose (SOP) & Motivation Letter Studio
 * Generates tailored academic statements and provides deep analytical reviews.
 * Scores Hook Strength, Academic Continuity, University Specificity, and Cliché Usage.
 */

/**
 * Generates a tailored, academic Statement of Purpose
 */
function generateStatementOfPurpose(inputs) {
  const {
    applicantName = "Applicant",
    targetUniversity = "Technical University of Munich",
    targetProgram = "M.Sc. in Computer Science",
    undergradDegree = "B.Tech in Computer Science & Engineering",
    undergradCollege = "National Institute of Technology",
    cgpa = 8.2,
    coreProjectTitle = "Distributed Key-Value Store with Fault Tolerance",
    coreProjectTech = "Go, Raft Consensus, Docker",
    workExperience = "2 years as Software Engineer at leading tech firm",
    careerGoal = "Lead enterprise cloud architecture and distributed data infrastructure teams",
    keyProfessorsOrLabs = "Chair of Connected Mobility & Systems Architecture Lab"
  } = inputs;

  const title = `Statement of Purpose: ${targetProgram} at ${targetUniversity}`;

  const paragraph1_Hook = `In an increasingly data-intensive world, the scalability of modern computing hinges on resilient distributed architectures that remain fault-tolerant under unpredictable network partitioning. My fascination with systems engineering originated during my undergraduate studies in ${undergradDegree} at ${undergradCollege}, where I maintained an academic record of ${cgpa} CGPA. However, my theoretical groundwork transformed into a deeper academic conviction when I designed and implemented a ${coreProjectTitle} using ${coreProjectTech}. Exploring consensus algorithms and state machine replication revealed to me that true engineering excellence requires rigorous mathematical foundations coupled with cutting-edge systems design—a synthesis I now seek to master through the ${targetProgram} at ${targetUniversity}.`;

  const paragraph2_AcademicBackground = `During my Bachelor's coursework, I developed a rigorous grounding in Data Structures, Computer Networks, Operating Systems, and Advanced Algorithms. Eager to bridge theoretical concepts with practical application, I spearheaded my final-year project, '${coreProjectTitle}'. Confronted with Byzantine faults and network latency bottlenecks, I benchmarked performance trade-offs between linearizable consistency and eventual consistency. This research reinforced my understanding of low-level concurrency, memory management, and asynchronous I/O, inspiring me to delve deeper into large-scale computational systems.`;

  const paragraph3_WorkExperience = workExperience
    ? `Following my graduation, I joined the industry for ${workExperience}. In this role, I contributed to mission-critical backend microservices handling high-throughput transactional traffic. I diagnosed production race conditions, optimized database indexing strategies, and automated containerized CI/CD deployment pipelines. While this experience honed my industrial software engineering discipline, it also illuminated the limits of commercial off-the-shelf paradigms when tackling complex distributed synchronization challenges, solidifying my resolve to pursue advanced research at the Master's level.`
    : `To complement my academic coursework, I actively participated in open-source systems development and competitive hackathons, prototyping cloud-native microservices and exploring kernel-level optimizations. This self-driven immersion demonstrated the vital importance of formal graduate study to engineer next-generation computing infrastructure.`;

  const paragraph4_UniversityFit = `The ${targetProgram} at ${targetUniversity} represents the ideal environment to elevate my academic and research aspirations. I am particularly drawn to the pioneering work conducted at the ${keyProfessorsOrLabs}, where research in high-performance computing, distributed consensus, and autonomous infrastructure aligns directly with my interests. The flexible curriculum—allowing advanced electives in Cloud Computing, Advanced Distributed Algorithms, and Machine Learning Systems—offers the exact intellectual depth I require. Moreover, ${targetUniversity}'s dynamic international research community and strong ties to leading European engineering institutions create an unmatched collaborative ecosystem.`;

  const paragraph5_CareerGoals = `Upon graduating with my Master of Science degree, my career objective is to ${careerGoal}. In the long term, I envision translating the rigorous architectural paradigms acquired at ${targetUniversity} into scalable computing solutions that solve real-world infrastructure challenges. I am confident that my disciplined academic foundation, technical resolve, and collaborative spirit will enable me to make meaningful contributions to the academic life at ${targetUniversity}. I eagerly anticipate the opportunity to join your distinguished cohort.`;

  const fullText = [
    paragraph1_Hook,
    paragraph2_AcademicBackground,
    paragraph3_WorkExperience,
    paragraph4_UniversityFit,
    paragraph5_CareerGoals
  ].join("\n\n");

  const wordCount = fullText.split(/\s+/).filter(Boolean).length;

  return {
    title,
    wordCount,
    generatedAt: new Date().toISOString(),
    paragraphs: {
      hookAndMotivation: paragraph1_Hook,
      academicBackground: paragraph2_AcademicBackground,
      professionalOrProjectExperience: paragraph3_WorkExperience,
      targetUniversityFit: paragraph4_UniversityFit,
      careerTrajectory: paragraph5_CareerGoals
    },
    fullText
  };
}

/**
 * Reviews and evaluates an existing Statement of Purpose draft
 */
function reviewStatementOfPurpose(sopText) {
  const text = (sopText || "").trim();
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const lower = text.toLowerCase();

  // Cliché expressions frequently flagged by university admission committees
  const CLICHE_PATTERNS = [
    { phrase: "since childhood", reason: "Overused cliché; committees prefer adult academic motivations over childhood anecdotes." },
    { phrase: "from a young age", reason: "Generic opening; replace with a concrete technical project or breakthrough." },
    { phrase: "passionate learner", reason: "Vague buzzword; show your passion through specific projects, tools, and results." },
    { phrase: "esteemed university", reason: "Generic flattery; cite exact professors, labs, and elective modules instead." },
    { phrase: "reputed institution", reason: "Empty compliment; name specific research papers published by the department." },
    { phrase: "jack of all trades", reason: "Informal idiom unsuited for rigorous academic discourse." },
    { phrase: "ever since i can remember", reason: "Common introductory cliché that wastes precious word count." },
    { phrase: "in today's world", reason: "Platitude; open directly with a specific technological or scientific challenge." }
  ];

  const foundCliches = [];
  CLICHE_PATTERNS.forEach(c => {
    if (lower.includes(c.phrase)) {
      foundCliches.push(c);
    }
  });

  // Calculate Sub-Scores (0 to 100)
  let hookScore = 75;
  let academicDepthScore = 70;
  let universityFitScore = 65;
  let flowScore = 78;

  // Word count check
  if (wordCount < 350) {
    hookScore -= 20;
    academicDepthScore -= 25;
    universityFitScore -= 25;
  } else if (wordCount >= 600 && wordCount <= 1000) {
    hookScore += 10;
    academicDepthScore += 10;
  } else if (wordCount > 1200) {
    flowScore -= 15; // Too long for standard 2-page limit
  }

  // Cliché penalty
  hookScore -= foundCliches.length * 8;
  hookScore = Math.max(25, Math.min(95, hookScore));

  // Check technical depth signals
  const technicalKeywords = ["algorithm", "architecture", "research", "design", "model", "analysis", "framework", "performance", "experiment", "implementation", "data", "optimization"];
  const techMatches = technicalKeywords.filter(k => lower.includes(k));
  academicDepthScore += Math.min(20, techMatches.length * 2);
  academicDepthScore = Math.max(30, Math.min(95, academicDepthScore));

  // Check university fit signals
  const fitKeywords = ["professor", "lab", "curriculum", "course", "elective", "department", "chair", "facility", "group"];
  const fitMatches = fitKeywords.filter(k => lower.includes(k));
  universityFitScore += Math.min(25, fitMatches.length * 3);
  universityFitScore = Math.max(30, Math.min(95, universityFitScore));

  // Overall Score
  const overallScore = Math.round(
    (hookScore * 0.25) +
    (academicDepthScore * 0.35) +
    (universityFitScore * 0.25) +
    (flowScore * 0.15)
  );

  let verdict = "Strong Academic Draft";
  if (overallScore >= 85) verdict = "Exceptional - Ready for Submission";
  else if (overallScore >= 70) verdict = "Competitive - Minor Refinements Needed";
  else if (overallScore >= 55) verdict = "Moderate - Needs Specificity & Research Fit";
  else verdict = "Needs Major Overhaul";

  // Actionable critique bullets
  const recommendations = [];
  if (foundCliches.length > 0) {
    recommendations.push(`Eliminate ${foundCliches.length} identified cliché phrase(s) to make your opening hook sharper and more professional.`);
  }
  if (fitMatches.length < 3) {
    recommendations.push("Increase target university specificity: Explicitly mention 1–2 laboratory groups, specific professors whose papers you follow, and distinct elective modules.");
  }
  if (wordCount < 500) {
    recommendations.push("Expand on undergraduate projects: Provide deeper technical context regarding challenges faced, architecture designed, and measurable outcomes.");
  }
  if (!lower.includes("return") && !lower.includes("career") && !lower.includes("goal")) {
    recommendations.push("Clarify long-term post-graduate trajectory: Detail your envisioned career role and how this degree acts as the critical bridge.");
  }

  return {
    overallScore,
    verdict,
    metrics: {
      wordCount,
      estimatedReadingTimeMinutes: Number((wordCount / 200).toFixed(1)),
      hookAndOpeningScore: hookScore,
      academicDepthScore,
      universityFitScore,
      structureAndFlowScore: flowScore
    },
    clichesDetected: foundCliches,
    recommendations
  };
}

module.exports = {
  generateStatementOfPurpose,
  reviewStatementOfPurpose
};
