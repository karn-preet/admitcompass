/**
 * Community Discussions / Forum Database
 * Pre-populated with verified Q&A threads, visa interview transcripts,
 * and profile shortlisting guidance for study abroad aspirants.
 */

const communityDiscussions = [
  {
    id: "disc-001",
    category: "Visa Experiences",
    title: "US F-1 Visa Approved at Mumbai Consulate (2 Attempts earlier 214b)",
    author: "Rohan V.",
    authorBadge: "Admitted to ASU MS CS",
    createdAt: "2024-06-18T14:30:00Z",
    upvotes: 42,
    repliesCount: 14,
    content: "VO asked me 3 questions: 1. Why ASU? 2. Who is sponsoring? 3. What will you do after graduation? Previously I said 'I will search for OPT and work in US' which caused my 214(b) rejection. This time I emphasized: 'My long-term goal is to join my father's cloud infrastructure consulting firm in Pune and lead their Kubernetes enterprise migration'. Approved immediately in 90 seconds!",
    tags: ["F-1 Visa", "Section 214(b)", "Mumbai Consulate", "Interview Transcript"]
  },
  {
    id: "disc-002",
    category: "German APS & Visas",
    title: "How long does APS India take in 2025/2026? My timeline & tips",
    author: "Sneha K.",
    authorBadge: "Admitted to TUM",
    createdAt: "2024-07-02T10:15:00Z",
    upvotes: 68,
    repliesCount: 29,
    content: "Applied for APS on May 4. Documents delivered to Delhi office via BlueDart on May 7. Received Professor Verification call on June 12. DigiLocker verification passed June 19. Digital APS Certificate received via email June 24 (Total ~7 weeks). TIP: Make sure your college Registrar email is active and inform your HOD in advance!",
    tags: ["APS Certificate", "Germany", "Document Verification", "DigiLocker"]
  },
  {
    id: "disc-003",
    category: "Profile Evaluation",
    title: "7.1 CGPA in B.Tech CSE from Tier 3 college: Can I get German TU9 or Fachhochschule?",
    author: "Aditya P.",
    authorBadge: "Aspirant Fall 2025",
    createdAt: "2024-08-11T09:00:00Z",
    upvotes: 35,
    repliesCount: 19,
    content: "I have 7.1 CGPA, 2 years exp as Java backend dev, IELTS 7.0, GRE Quant 163. Was rejected by TUM and RWTH due to credit matching. But got offers from University of Stuttgart (CS), TU Chemnitz, and Darmstadt University of Applied Sciences (h_da). Fachhochschulen in Germany value work experience and coding portfolios much more than strict math credit formulas!",
    tags: ["Profile Evaluation", "Germany", "Fachhochschule", "Low CGPA Advice"]
  },
  {
    id: "disc-004",
    category: "Loans & Finance",
    title: "SBI Global Ed-Vantage vs HDFC Credila: Real numbers on ₹40 Lakhs loan",
    author: "Karan M.",
    authorBadge: "Studying at TU Delft",
    createdAt: "2024-05-20T16:45:00Z",
    upvotes: 89,
    repliesCount: 38,
    content: "Did a detailed financial calculation for ₹40 Lakhs loan over 10 years repayment. SBI at 9.15% (with property mortgage) cost approx ₹21.4 Lakhs total interest. HDFC Credila at 12.25% unsecured cost ₹31.8 Lakhs total interest + ₹45k processing fee. That is a ₹10.4 Lakhs difference! If your parents have clear property titles, definitely go for Public Sector Banks.",
    tags: ["Education Loan", "SBI", "HDFC Credila", "ROI Calculation", "Section 80E"]
  },
  {
    id: "disc-005",
    category: "Scholarships",
    title: "Italy DSU Regional Scholarship Guide: Got €0 Tuition + €7,000 cash at PoliMi",
    author: "Ananya S.",
    authorBadge: "PoliMi M.Sc Design & Eng",
    createdAt: "2024-07-28T11:20:00Z",
    upvotes: 114,
    repliesCount: 45,
    content: "Step by step on how to get DSU: 1. Get Parents' ITR-V for past 2 years. 2. Get Family Composition Certificate and property valuation document from local Tehsildar. 3. Get MEA Apostille on all documents. 4. Submit to Italian CAF office online for ISEE Parificato calculation. If ISEE is under €25,000, tuition is completely 0 and you receive scholarship stipend!",
    tags: ["Italy", "DSU Scholarship", "PoliMi", "Zero Tuition", "Schengen"]
  }
];

module.exports = {
  communityDiscussions
};
