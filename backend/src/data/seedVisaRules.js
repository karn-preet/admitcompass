/**
 * Official Immigration & Visa Requirements by Country (2025/2026 Rules)
 * Tailored with specific legal, financial, and evidentiary requirements for Indian Students.
 */

const countryVisaRules = {
  Germany: {
    country: "Germany",
    region: "EU",
    visaType: "National Visa for Study (Section 16b AufenthG)",
    issuingAuthority: "German Federal Foreign Office / German Missions in India (New Delhi, Mumbai, Bengaluru, Chennai, Kolkata)",
    officialCitations: [
      {
        title: "German Missions in India - Student Visa Checklist",
        url: "https://india.diplo.de/in-en/service/-/2552164",
        authority: "Embassy of the Federal Republic of Germany, New Delhi"
      },
      {
        title: "DAAD International Student Financial Proof (Finanzierungsnachweis)",
        url: "https://www.daad.de/en/study-and-research-in-germany/plan-your-studies/costs-of-education-and-living/",
        authority: "German Academic Exchange Service (DAAD)"
      },
      {
        title: "APS India - Academic Evaluation Centre Mandatory Requirement",
        url: "https://www.aps-india.de/",
        authority: "Akademische Prüfstelle (APS) India"
      }
    ],
    financialRequirements: {
      blockedAccountRequired: true,
      blockedAccountAmountEUR: 11904, // €992/month for 12 months
      approxINRAmount: 1080000, // ~₹10.8 Lakhs at 1 EUR ≈ 91 INR
      approvedProviders: ["Expatrio", "Fintiba", "Coracle", "Deutsche Bank"],
      healthInsuranceRequirement: "Statutory (TK / Barmer / DAK) for students under 30 (~€125/month) or incoming travel insurance until matriculation",
      acceptableFundSources: [
        "Personal savings transferred to licensed German Blocked Account (Sperrkonto)",
        "Education loan disbursed directly to Blocked Account from Indian Scheduled Commercial Bank",
        "Official DAAD / Erasmus / Government scholarship",
        "Formal Obligation Letter (Verpflichtungserklärung pursuant to §§ 66-68 AufenthG) from a resident in Germany"
      ],
      minimumSponsorITRYears: 2,
      recommendedFamilyITR: "₹6,00,000 - ₹10,00,000+ per year to prove genuine financial background"
    },
    apsCertificateRule: {
      isMandatory: true,
      applicableSince: "November 1, 2022",
      description: "Mandatory for all Indian applicants with school/university degrees from India before applying for a student visa. Fee: ₹18,000.",
      processingTimeWeeks: "4 to 8 weeks",
      exemptions: "Students receiving EU/German funded scholarships (e.g. DAAD/Erasmus) or who completed high school in Germany."
    },
    commonRefusalTriggers: [
      "Submitting visa application without original APS certificate",
      "Unverifiable bank statements or loan sanction letters from unrecognized private NBFCs without disbursement proof",
      "Lack of academic continuity or inexplicable, uncertified study gaps (> 1-2 years) without salary slips / work experience letters",
      "Failed credibility interview: inability to explain course modules, future career relevance, or basic details of the host city",
      "Insufficient German language skills when required by the study program regulation (Prüfungsordnung)"
    ],
    solvencyRoadmap: [
      "Step 1: Obtain APS Certificate from aps-india.de immediately after receiving Bachelor's provisional degree / transcripts.",
      "Step 2: Secure conditional or unconditional admission offer letter (Zulassungsbescheid) from the public university.",
      "Step 3: Open an online Blocked Account via Expatrio or Coracle and transfer €11,904 (+ buffer) via Indian bank A2 Remittance.",
      "Step 4: Secure German statutory health insurance confirmation (TK/Barmer) packaged via your blocked account provider.",
      "Step 5: Prepare 2 years of Parents' ITR (Form 16 / ITR-V) and a detailed Motivation Letter (Statement of Purpose).",
      "Step 6: Book a National Visa appointment at VFS Global Visa Application Centre."
    ]
  },

  USA: {
    country: "USA",
    region: "USA",
    visaType: "F-1 Non-Immigrant Student Visa",
    issuingAuthority: "U.S. Department of State - Bureau of Consular Affairs / U.S. Embassy & Consulates in India",
    officialCitations: [
      {
        title: "U.S. Visas - Student Visas Overview & Eligibility",
        url: "https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html",
        authority: "U.S. Department of State"
      },
      {
        title: "Department of Homeland Security - Study in the States Form I-20",
        url: "https://studyinthestates.dhs.gov/students/prepare/financial-ability",
        authority: "DHS SEVP (Student and Exchange Visitor Program)"
      },
      {
        title: "Section 214(b) of the Immigration and Nationality Act (INA) Guidance",
        url: "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/visa-denials.html",
        authority: "U.S. Citizenship and Immigration Services / Consular Affairs"
      }
    ],
    financialRequirements: {
      blockedAccountRequired: false,
      i20ProofAmountUSD: "Typically $35,000 to $65,000 (Exact 1st year Tuition + Living Costs shown on Form I-20)",
      approxINRAmount: 3200000, // ~₹32 - ₹50 Lakhs
      sevisFeeUSD: 350,
      mrvFeeUSD: 185,
      acceptableFundSources: [
        "Liquid bank savings in student's or parents' name (Account statements with bank seal)",
        "Fixed Deposits (FDs) with bank verification letter",
        "Provident Fund (PPF / EPF) withdrawal certificates",
        "Sanctioned Education Loan from Indian Scheduled Bank (SBI, HDFC Credila, Axis, Bank of Baroda)",
        "Graduate Assistantships (TA/RA) or university tuition waivers indicated on Form I-20"
      ],
      minimumSponsorITRYears: 3,
      recommendedFamilyITR: "₹8,00,000 - ₹15,00,000+ per year to prove economic stability"
    },
    commonRefusalTriggers: [
      "Section 214(b) INA Refusal: Failure to prove strong, compelling socio-economic ties to India and non-immigrant intent",
      "Inability to articulate why this specific public university was chosen over reputable institutions in India",
      "Finances looking artificial or unseasoned: sudden unexplained large deposits 1 week prior to the interview",
      "Excessive reliance on unsecured private loans without adequate family income to support repayment in case of emergencies",
      "Poor interview communication: sounding memorized, robotic, or expressing desire to work permanently in the USA"
    ],
    solvencyRoadmap: [
      "Step 1: Receive Form I-20 from SEVP-certified public university after submitting bank financial affidavit.",
      "Step 2: Pay SEVIS I-901 fee ($350) online via FMJfee.com and preserve official payment receipt.",
      "Step 3: Complete Form DS-160 online truthfully, ensuring work history and education match all academic transcripts.",
      "Step 4: Book Biometrics (VAC) and Consular Interview appointments on US Travel Docs / US Visa Scheduling portal.",
      "Step 5: Prepare CA Net Worth Statement (Chartered Accountant valuation of liquid funds, FDs, and immovable properties).",
      "Step 6: Master the 2-minute Consular Interview: explain course curriculum, career roadmap in India, and clear return intent."
    ]
  },

  Canada: {
    country: "Canada",
    region: "Canada",
    visaType: "Study Permit (Post-Secondary)",
    issuingAuthority: "Immigration, Refugees and Citizenship Canada (IRCC)",
    officialCitations: [
      {
        title: "IRCC - Study Permit Financial Support Guidelines",
        url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents.html#doc3",
        authority: "Immigration, Refugees and Citizenship Canada"
      },
      {
        title: "IRCC Guaranteed Investment Certificate (GIC) Mandatory Requirement",
        url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/student-direct-stream.html",
        authority: "Government of Canada"
      },
      {
        title: "Provincial Attestation Letter (PAL) Policy for International Students",
        url: "https://www.canada.ca/en/immigration-refugees-citizenship/news/2024/01/canada-to-stabilize-growth-and-decrease-number-of-new-international-student-permits-issued-to-approximately-360000-for-2024.html",
        authority: "IRCC National News Release"
      }
    ],
    financialRequirements: {
      blockedAccountRequired: true,
      gicAmountCAD: 20635, // Doubled living cost benchmark introduced by IRCC
      approxINRAmount: 1300000, // ~₹13 Lakhs
      approvedGICBanks: ["Scotiabank", "CIBC", "ICICI Bank Canada", "SBI Canada", "RBC"],
      tuitionProof: "Full first-year tuition fee receipt from the Designated Learning Institution (DLI)",
      acceptableFundSources: [
        "CAD $20,635 deposited in Canadian GIC",
        "Official paid tuition fee receipt from university",
        "Education loan sanction letter from approved bank",
        "Parents' 3-year ITRs, Form 16, and bank balance certificate"
      ],
      minimumSponsorITRYears: 3,
      recommendedFamilyITR: "₹7,00,000+ per year"
    },
    palRequirement: {
      isMandatory: true,
      description: "Mandatory Provincial Attestation Letter (PAL) from the provincial government (Ontario, BC, Alberta, Quebec) issued through the university, verifying cap space.",
      exemptions: "Master's and doctoral degree applicants were initially exempt from caps, but post-2024 rules require verifying specific provincial institution guidelines."
    },
    commonRefusalTriggers: [
      "Refusal under IRCC Regulation 216(1)(b): Officer is not satisfied applicant will leave Canada at the end of their stay",
      "Course mismatch: e.g. An engineering graduate taking a general business diploma (lack of academic progression)",
      "Unexplained study or career gaps without income proof or tax documentation",
      "Vague Statement of Purpose / Letter of Explanation (LOE) lacking specific Indian job opportunities and salary projections",
      "Inadequate funds beyond the bare minimum GIC (officer expects backup liquid funds for unexpected emergencies)"
    ],
    solvencyRoadmap: [
      "Step 1: Secure Letter of Acceptance (LOA) from public university with valid DLI number.",
      "Step 2: Obtain Provincial Attestation Letter (PAL) from the university / province.",
      "Step 3: Pay full first-year tuition fee and obtain official university receipt.",
      "Step 4: Purchase CAD $20,635 GIC from Scotiabank / CIBC / ICICI Bank Canada and obtain GIC Certificate.",
      "Step 5: Upfront Immigration Medical Examination (IME) with an approved panel physician in India.",
      "Step 6: Submit online application with detailed Letter of Explanation detailing career ROI in India."
    ]
  },

  UK: {
    country: "United Kingdom",
    region: "UK",
    visaType: "Student Route Visa",
    issuingAuthority: "UK Visas and Immigration (UKVI) / Home Office",
    officialCitations: [
      {
        title: "GOV.UK - Student Visa Eligibility and Financial Evidence",
        url: "https://www.gov.uk/student-visa/money",
        authority: "UK Visas and Immigration (UKVI)"
      },
      {
        title: "UKVI Tuberculosis Testing in India for Visa Applicants",
        url: "https://www.gov.uk/government/publications/tuberculosis-test-for-a-uk-visa-clinics-in-india/tuberculosis-testing-in-india",
        authority: "Home Office"
      },
      {
        title: "Academic Technology Approval Scheme (ATAS) for STEM Postgraduates",
        url: "https://www.gov.uk/guidance/academic-technology-approval-scheme",
        authority: "Foreign, Commonwealth & Development Office (FCDO)"
      }
    ],
    financialRequirements: {
      blockedAccountRequired: false,
      maintenanceFundsInsideLondonGBP: "£1,334 / month for 9 months = £12,006",
      maintenanceFundsOutsideLondonGBP: "£1,023 / month for 9 months = £9,207 (Updated 2025/2026: £1,136/month = £10,224 outside London)",
      tuitionProof: "Remaining unpaid 1st year tuition as stated on the CAS (Confirmation of Acceptance for Studies)",
      strictFundHoldingRule: "Funds must be held continuously for at least 28 consecutive days ending no more than 31 days before application date",
      acceptableFundSources: [
        "Cash savings in personal bank account (student or biological parents with birth certificate)",
        "Fixed Deposits (liquid/accessible anytime)",
        "Government/University sponsorship or sanctioned student loan letter"
      ],
      minimumSponsorITRYears: 2,
      recommendedFamilyITR: "₹6,00,000+ per year"
    },
    commonRefusalTriggers: [
      "Violating the 28-day rule: balance dropping below required threshold by even ₹1 on any single day during the 28-day window",
      "Using funds in an uncle's, aunt's, or cousin's bank account (UKVI strictly allows ONLY student or biological parents)",
      "Bank statement issued more than 31 days before application submission date",
      "Using financial institutions not verified or regulated by the Reserve Bank of India (RBI)",
      "Failing the credibility interview: inability to explain course modules or choice of host university"
    ],
    solvencyRoadmap: [
      "Step 1: Obtain unconditional offer and request CAS from your public university.",
      "Step 2: Deposit required funds (Tuition balance + 9 months maintenance) in student or parent account.",
      "Step 3: Keep funds untouched for a strict continuous period of 28 consecutive days.",
      "Step 4: Book and complete TB test at an IOM-approved clinic in India (valid for 6 months).",
      "Step 5: Obtain ATAS clearance certificate if enrolled in sensitive STEM master's programs.",
      "Step 6: Submit visa application online, pay Immigration Health Surcharge (IHS £776/year), and attend VFS biometrics."
    ]
  },

  Australia: {
    country: "Australia",
    region: "Australia",
    visaType: "Student Visa (Subclass 500)",
    issuingAuthority: "Department of Home Affairs, Australian Government",
    officialCitations: [
      {
        title: "Department of Home Affairs - Subclass 500 Evidence of Financial Capacity",
        url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500#Eligibility",
        authority: "Australian Department of Home Affairs"
      },
      {
        title: "Genuine Student (GS) Requirement (Replaced GTE in March 2024)",
        url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500/genuine-student-requirement",
        authority: "Australian Immigration Directorate"
      }
    ],
    financialRequirements: {
      blockedAccountRequired: false,
      livingCostPerYearAUD: 29710, // Updated 2024/2025 Home Affairs benchmark
      travelCostAUD: 2000,
      tuitionProof: "Full 1st year tuition fee minus any deposit already paid on Confirmation of Enrolment (CoE)",
      fundSeasoningRule: "Funds in savings or FDs must be seasoned for at least 3 months (90 days) with documented origin",
      acceptableFundSources: [
        "Bank deposits held for at least 3 months by applicant, spouse, or parents",
        "Government or recognized bank education loan",
        "Annual family income evidence: official government tax assessments showing minimum AUD $87,856 (~₹48 Lakhs) or verified combined parents' ITRs"
      ],
      minimumSponsorITRYears: 3,
      recommendedFamilyITR: "₹10,00,000 - ₹15,00,000+ per year"
    },
    commonRefusalTriggers: [
      "Failing Genuine Student (GS) assessment: applicant perceived as using study route primarily for permanent residency",
      "Third-party sponsorship: funds from distant relatives or informal lenders without established dependency",
      "Large unseasoned cash deposits into bank accounts shortly before applying",
      "High backlog count (more than 4-6 backlogs creates high refusal risk for Australian High Commission)",
      "Applying to regional colleges with lower Tier ratings instead of top public universities"
    ],
    solvencyRoadmap: [
      "Step 1: Secure electronic Confirmation of Enrolment (eCoE) from your Australian university.",
      "Step 2: Season liquid funds in bank account for a minimum of 90 days or secure approved bank loan.",
      "Step 3: Purchase Overseas Student Health Cover (OSHC) for the full duration of your visa.",
      "Step 4: Write targeted responses to the Genuine Student (GS) questionnaire detailing academic value in India.",
      "Step 5: Undergo medical examination with an approved panel doctor in India (HAP ID).",
      "Step 6: Lodge Subclass 500 visa on ImmiAccount and upload all verified financial documents."
    ]
  },

  "New Zealand": {
    country: "New Zealand",
    region: "New Zealand",
    visaType: "Fee Paying Student Visa",
    issuingAuthority: "Immigration New Zealand (INZ)",
    officialCitations: [
      {
        title: "Immigration New Zealand - Evidence of Funds for Student Visas",
        url: "https://www.immigration.govt.nz/new-zealand-visas/preparing-a-visa-application/financial-support/evidence-of-funds-for-study",
        authority: "Immigration New Zealand"
      },
      {
        title: "Funds Transfer Scheme (FTS) for Indian Students via ANZ Bank",
        url: "https://www.immigration.govt.nz/new-zealand-visas/apply-for-a-visa/tools-and-information/general-information/funds-transfer-scheme",
        authority: "Immigration New Zealand & ANZ"
      }
    ],
    financialRequirements: {
      blockedAccountRequired: false,
      fundsTransferSchemeAvailable: true,
      livingCostPerYearNZD: 20000,
      tuitionProof: "First year tuition fee or receipt of full payment after Approval in Principle (AIP)",
      acceptableFundSources: [
        "Funds Transfer Scheme (FTS): NZD $20,000 deposited in ANZ Bank NZ account and released monthly",
        "Bank balance held for 6 months by parents or applicant",
        "Education loan from approved Indian bank"
      ],
      minimumSponsorITRYears: 3,
      recommendedFamilyITR: "₹7,00,000+ per year"
    },
    commonRefusalTriggers: [
      "Failure to provide verifiable source of funds (showing bank balance without income tax returns)",
      "Unexplained study or employment gaps",
      "Failing to utilize the Funds Transfer Scheme (FTS) when recommended by INZ for Indian applicants",
      "Applicant cannot explain why the course chosen in NZ provides a distinct return on investment over Indian alternatives"
    ],
    solvencyRoadmap: [
      "Step 1: Secure Offer of Place from New Zealand university.",
      "Step 2: Submit visa application under AIP (Approval in Principle) pathway without paying tuition upfront.",
      "Step 3: Receive Approval in Principle (AIP) from Immigration New Zealand.",
      "Step 4: Transfer 1st year tuition fee to university and open ANZ Funds Transfer Scheme (FTS) account with NZD $20,000.",
      "Step 5: Provide payment receipts and FTS confirmation letter to INZ.",
      "Step 6: Receive official e-Visa label."
    ]
  },

  France: {
    country: "France",
    region: "EU",
    visaType: "Long-Stay Student Visa (VLS-TS - Visa Long Séjour valant Titre de Séjour)",
    issuingAuthority: "Ministère de l'Intérieur / Campus France India & French Consulates",
    officialCitations: [
      {
        title: "Campus France India - Mandatory Études en France (EEF) Procedure",
        url: "https://www.inde.campusfrance.org/",
        authority: "Campus France & Embassy of France in India"
      },
      {
        title: "France-Visas - Official Visa Application Portal",
        url: "https://france-visas.gouv.fr/en/web/france-visas/student",
        authority: "Government of the French Republic"
      }
    ],
    financialRequirements: {
      blockedAccountRequired: false,
      minimumMonthlyLivingCostEUR: 615,
      livingCostPerYearEUR: 7380,
      approxINRAmount: 680000, // ~₹6.8 Lakhs
      acceptableFundSources: [
        "Bank balance certificate and 3-month bank statement (student or direct parents)",
        "Charte de prise en charge (Formal financial sponsorship declaration)",
        "Education loan sanction letter from Indian scheduled bank",
        "French Government (Eiffel / Charpak) scholarship letter"
      ],
      minimumSponsorITRYears: 2,
      recommendedFamilyITR: "₹5,50,000+ per year"
    },
    commonRefusalTriggers: [
      "Failing the mandatory Campus France academic interview (inability to articulate study project and career plans in India)",
      "Unexplained study or career gap without verifiable experience letters",
      "Sudden unexplained bank account credit without source-of-wealth documentation",
      "Inadequate accommodation proof (Certificate of lodging / Attestation d'hébergement is mandatory for French visa approval)"
    ],
    solvencyRoadmap: [
      "Step 1: Complete online application on Études en France (EEF) portal via Campus France India.",
      "Step 2: Attend in-person Campus France academic interview with original marksheets and Statement of Purpose.",
      "Step 3: Secure confirmed accommodation proof in France (CROUS student residence or private lease agreement).",
      "Step 4: Prepare 3 months of bank statements showing at least €7,380 (~₹6.8L) plus unpaid 1st year tuition.",
      "Step 5: Submit Long-Stay Visa application via VFS Global France Visa Application Centre.",
      "Step 6: Validate VLS-TS online via OFII portal within 3 months of arrival in France."
    ]
  },

  Italy: {
    country: "Italy",
    region: "EU",
    visaType: "National Visa for Study (Type D - Studio/Immatricolazione Università)",
    issuingAuthority: "Ministry of Foreign Affairs and International Cooperation (MAECI) / Italian Embassy & Consulates in India",
    officialCitations: [
      {
        title: "Universitaly - Official Italian University Pre-enrolment Portal",
        url: "https://www.universitaly.it/",
        authority: "Italian Ministry of Universities and Research (MUR)"
      },
      {
        title: "Italian Ministry of Foreign Affairs - Visa for Italy (Il Visto per l'Italia)",
        url: "https://vistoperitalia.esteri.it/home/en",
        authority: "Ministero degli Affari Esteri e della Cooperazione Internazionale"
      }
    ],
    financialRequirements: {
      blockedAccountRequired: false,
      dsuScholarshipEligible: true,
      statutoryMonthlyLivingCostEUR: 468, // Table A of Ministry Directive (~€6,000/year minimum)
      livingCostPerYearEUR: 6000,
      approxINRAmount: 550000,
      acceptableFundSources: [
        "Personal or parents' bank account statements (minimum €6,000 liquid balance)",
        "Regional DSU / EDISU / ER.GO scholarship provisional ranking / eligibility certificate",
        "Education loan from recognized Indian bank",
        "Family income certificate (for ISEE Parificato calculation to reduce tuition to €0)"
      ],
      minimumSponsorITRYears: 2,
      recommendedFamilyITR: "₹4,50,000 - ₹8,00,000 per year"
    },
    commonRefusalTriggers: [
      "Missing CIMEA Statement of Comparability / Statement of Verification or Declaration of Value (DOV)",
      "Applying for visa before pre-enrolment summary is validated on the Universitaly portal",
      "Showing bank balance without 6-month continuous transaction history",
      "Lack of confirmed health insurance policy valid for the Schengen area with €30,000 coverage"
    ],
    solvencyRoadmap: [
      "Step 1: Submit pre-enrolment application on universitaly.it and upload university admission letter.",
      "Step 2: Obtain CIMEA Statement of Verification or Apostilled Degree for Declaration of Value (DOV).",
      "Step 3: Prepare parents' bank statements showing minimum €6,000 (~₹5.5L) with branch manager seal.",
      "Step 4: Prepare family ITR and property documents translated and legalized for the regional DSU scholarship.",
      "Step 5: Submit National Type D visa application at VFS Italy.",
      "Step 6: Apply for Permesso di Soggiorno (Residence Permit) within 8 days of arriving in Italy."
    ]
  },

  Netherlands: {
    country: "Netherlands",
    region: "EU",
    visaType: "Entry Visa (MVV) & Residence Permit (VVR - Studie)",
    issuingAuthority: "Immigration and Naturalisation Service (IND), Ministry of Justice and Security",
    officialCitations: [
      {
        title: "IND Netherlands - Residence Permit for Study Guidelines",
        url: "https://ind.nl/en/residence-permits/study/student-residence-permit-for-university-or-higher-professional-education",
        authority: "Immigration and Naturalisation Service (IND)"
      },
      {
        title: "Study in NL - Official International Higher Education Guide",
        url: "https://www.studyinnl.org/",
        authority: "Nuffic Netherlands"
      }
    ],
    financialRequirements: {
      blockedAccountRequired: true, // University acts as visa sponsor and collects living cost deposit
      livingCostPerYearEUR: 12500, // IND standard (~€1,042/month for 12 months)
      approxINRAmount: 1140000,
      acceptableFundSources: [
        "Direct transfer of 1st year living expenses (€12,500) into Dutch University escrow account",
        "Scholarship award letter",
        "Approved education loan disbursement letter"
      ],
      minimumSponsorITRYears: 2,
      recommendedFamilyITR: "₹7,50,000+ per year"
    },
    commonRefusalTriggers: [
      "The Dutch visa process is institutional: the university applies directly to IND on your behalf. Failure occurs if you fail to transfer the required living fund guarantee to the university before their deadline.",
      "Academic credential mismatch or fraudulent transcripts"
    ],
    solvencyRoadmap: [
      "Step 1: Accept unconditional offer from Dutch research university or university of applied sciences.",
      "Step 2: Transfer full first-year tuition plus €12,500 living cost deposit directly to university bank account.",
      "Step 3: University initiates TEV procedure (MVV + Residence Permit) with IND.",
      "Step 4: IND approves application (typically within 2-4 weeks).",
      "Step 5: Book VFS Global appointment in New Delhi, Mumbai, Chennai, or Bengaluru to collect your MVV passport sticker."
    ]
  },

  Sweden: {
    country: "Sweden",
    region: "EU",
    visaType: "Residence Permit for Higher Education",
    issuingAuthority: "Swedish Migration Agency (Migrationsverket)",
    officialCitations: [
      {
        title: "Migrationsverket - Residence Permit for Studies in Higher Education",
        url: "https://www.migrationsverket.se/English/Private-individuals/Studying-and-researching-in-Sweden/Higher-education.html",
        authority: "Swedish Migration Agency"
      },
      {
        title: "University Admissions in Sweden - National Central Application Portal",
        url: "https://www.universityadmissions.se/",
        authority: "Swedish Council for Higher Education (UHR)"
      }
    ],
    financialRequirements: {
      blockedAccountRequired: false,
      monthlyLivingRequirementSEK: 10350,
      livingCostPerYearSEK: 103500, // 10 months minimum requirement ~€11,000 / ~₹10 Lakhs
      tuitionPaymentRule: "Full first semester tuition fee must be paid before lodging residence permit application",
      strictAccountOwnership: "CRITICAL: The bank account showing maintenance funds MUST be in the student's OWN name (joint accounts or parents' accounts alone are strictly rejected by Migrationsverket!)",
      minimumSponsorITRYears: 2,
      recommendedFamilyITR: "₹6,00,000+ per year"
    },
    commonRefusalTriggers: [
      "Failing the bank account ownership rule: submitting parents' bank statement without funds being transferred into student's personal account",
      "Funds not being fully accessible/liquid (unvested equity, unapproved loan letters)",
      "Failing to pay 1st instalment of tuition to the Swedish university before submitting Migrationsverket application"
    ],
    solvencyRoadmap: [
      "Step 1: Apply via universityadmissions.se and receive Notification of Selection Results.",
      "Step 2: Pay 1st semester tuition invoice to the Swedish university.",
      "Step 3: Transfer required maintenance funds (SEK 103,500 / ~₹10 Lakhs) into applicant's personal bank account.",
      "Step 4: Submit online application on migrationsverket.se with bank statement dated within 30 days.",
      "Step 5: Visit Embassy of Sweden in New Delhi for biometrics and passport verification.",
      "Step 6: Receive Residence Permit Card (UT-kort)."
    ]
  },

  Finland: {
    country: "Finland",
    region: "EU",
    visaType: "First Residence Permit for Studies",
    issuingAuthority: "Finnish Immigration Service (Migri)",
    officialCitations: [
      {
        title: "Migri - Residence Permit for Students in Finland",
        url: "https://migri.fi/en/residence-permit-application-for-studies",
        authority: "Finnish Immigration Service"
      },
      {
        title: "Study in Finland - Official Higher Education & Scholarships",
        url: "https://www.studyinfinland.fi/",
        authority: "Finnish National Agency for Education (EDUFI)"
      }
    ],
    financialRequirements: {
      blockedAccountRequired: false,
      monthlyLivingRequirementEUR: 560,
      livingCostPerYearEUR: 6720, // €6,720/year minimum in student's own bank account
      approxINRAmount: 615000,
      tuitionFeeDiscount: "50% to 100% merit waivers widely available in joint application",
      healthInsuranceRequirement: "Comprehensive private health insurance (Swisscare / SIP) with €120,000 coverage",
      minimumSponsorITRYears: 2,
      recommendedFamilyITR: "₹5,00,000+ per year"
    },
    commonRefusalTriggers: [
      "Bank account not in student's own name (funds must be held directly by applicant)",
      "Health insurance policy with insufficient coverage or excessive deductible",
      "Unexplained study gaps without documentation"
    ],
    solvencyRoadmap: [
      "Step 1: Secure admission offer and accept scholarship on Studyinfo.fi.",
      "Step 2: Pay any remaining tuition balance to the Finnish university.",
      "Step 3: Transfer at least €6,720 (~₹6.2 Lakhs) into a bank account under the student's own name.",
      "Step 4: Purchase approved student health insurance (Swisscare / Aon).",
      "Step 5: Submit application on EnterFinland.fi and book biometrics appointment at VFS Global Finland in India.",
      "Step 6: Receive continuous residence permit (Type A) granted for the entire duration of studies."
    ]
  },

  Belgium: {
    country: "Belgium",
    region: "EU",
    visaType: "Long-Stay Student Visa (Type D - Autorisation de Séjour)",
    issuingAuthority: "Immigration Office (Office des Étrangers) / Embassy of Belgium in India",
    officialCitations: [
      {
        title: "Dofi Belgium - Student Visa Requirements & Blocked Account",
        url: "https://dofi.ibz.be/en/themes/third-country-nationals/study",
        authority: "FPS Interior - Belgian Immigration Office"
      }
    ],
    financialRequirements: {
      blockedAccountRequired: true,
      monthlyLivingRequirementEUR: 803,
      livingCostPerYearEUR: 9636, // ~€9,636/year standard
      approxINRAmount: 880000,
      acceptableFundSources: [
        "University Blocked Account payment (KU Leuven / VUB / Ghent University provide escrow services)",
        "Formal financial commitment (Annex 32 / Bijlage 32) from a solvent guarantor",
        "Official scholarship certificate"
      ],
      minimumSponsorITRYears: 2,
      recommendedFamilyITR: "₹6,00,000+ per year"
    },
    commonRefusalTriggers: [
      "Guarantor on Annex 32 not meeting minimum net income threshold under Belgian law",
      "Failing to submit medical certificate from an embassy-approved panel physician in India",
      "Missing Police Clearance Certificate (PCC) apostilled by the Ministry of External Affairs (MEA)"
    ],
    solvencyRoadmap: [
      "Step 1: Obtain admission letter from Belgian public university.",
      "Step 2: Transfer living costs (~€9,636) to university's Blocked Account service.",
      "Step 3: Obtain MEA-apostilled Police Clearance Certificate (PCC) and medical certificate from panel doctor.",
      "Step 4: Pay administrative fee to Belgian Immigration Office.",
      "Step 5: Submit Type D visa dossier via VFS Global Belgium in New Delhi or Mumbai."
    ]
  },

  Austria: {
    country: "Austria",
    region: "EU",
    visaType: "Residence Permit - Student (Aufenthaltsbewilligung - Student)",
    issuingAuthority: "Austrian Federal Ministry of the Interior (BMI) / Austrian Embassy New Delhi",
    officialCitations: [
      {
        title: "OeAD Austria - Official Higher Education & Visa Guide",
        url: "https://oead.at/en/to-austria/entry-and-residence/student",
        authority: "Austrian Agency for Education and Internationalisation (OeAD)"
      }
    ],
    financialRequirements: {
      blockedAccountRequired: false,
      monthlyLivingRequirementEUR: 672, // for students under 24 (€1,217/mo for students 24+)
      livingCostPerYearEUR: 11000,
      approxINRAmount: 1000000,
      acceptableFundSources: [
        "Savings account in student's own name showing 12 months maintenance",
        "Declaration of guarantee (Haftungserklärung)",
        "Education loan from recognized Indian bank"
      ],
      minimumSponsorITRYears: 2,
      recommendedFamilyITR: "₹6,00,000+ per year"
    },
    commonRefusalTriggers: [
      "Degrees and birth certificates not legalised / super-legalised or apostilled by MEA India",
      "Lack of confirmed accommodation contract in Austria (e.g. OeAD student housing)",
      "Inadequate proof of origin of funds"
    ],
    solvencyRoadmap: [
      "Step 1: Secure Zulassungsbescheid (Admission Offer) from Austrian public university.",
      "Step 2: Legalize Bachelor degree, transcripts, and PCC through MEA Apostille.",
      "Step 3: Book confirmed student accommodation in Austria (OeAD housing).",
      "Step 4: Submit Residence Permit (Aufenthaltsbewilligung) application at Austrian Embassy New Delhi.",
      "Step 5: Once approved, apply for Visa D to enter Austria and collect the residence permit card in person."
    ]
  },

  Spain: {
    country: "Spain",
    region: "EU",
    visaType: "National Visa for Studies (Visado de Estudios)",
    issuingAuthority: "Ministry of Foreign Affairs, European Union and Cooperation / Spanish Consulates in India",
    officialCitations: [
      {
        title: "Ministry of Foreign Affairs Spain - General Student Visa Requirements",
        url: "https://www.exteriores.gob.es/Consulados/mumbai/en/ServiciosConsulares/Paginas/index.aspx?scco=India&scd=204&scca=Visas&scst=Condiciones",
        authority: "Consulate General of Spain, Mumbai & Embassy in New Delhi"
      }
    ],
    financialRequirements: {
      blockedAccountRequired: false,
      ipremMonthlyBenchmarkEUR: 600, // 100% of IPREM monthly index
      livingCostPerYearEUR: 7200,
      approxINRAmount: 660000,
      acceptableFundSources: [
        "Parents' or student's bank account statements (6 months) with verified minimum balance",
        "Notarized affidavit of financial support from biological parents",
        "Education loan sanction letter from scheduled commercial bank",
        "Approved scholarship letter"
      ],
      minimumSponsorITRYears: 3,
      recommendedFamilyITR: "₹6,00,000+ per year"
    },
    commonRefusalTriggers: [
      "Unverified source of funds in bank statements",
      "Medical certificate not conforming to International Health Regulations (IHR 2005)",
      "Missing MEA-apostilled Police Clearance Certificate translated into Spanish"
    ],
    solvencyRoadmap: [
      "Step 1: Receive official Letter of Acceptance from Spanish public university.",
      "Step 2: Legalize PCC and medical certificate with MEA Apostille and certified Spanish translation.",
      "Step 3: Collate 6 months of bank statements showing at least €7,200 plus tuition fees.",
      "Step 4: Purchase private Spanish health insurance with zero co-pay (Sanitas / Adeslas).",
      "Step 5: Lodge visa file at BLS Spain Visa Application Centre in India."
    ]
  },

  Poland: {
    country: "Poland",
    region: "EU",
    visaType: "National Visa Type D (Wiza Krajowa - Studia)",
    issuingAuthority: "Ministry of Foreign Affairs of Poland / Polish Embassy & Consulates in India",
    officialCitations: [
      {
        title: "Gov.pl - Polish National Student Visa (Type D) Requirements",
        url: "https://www.gov.pl/web/india/d-type-national-visa",
        authority: "Embassy of the Republic of Poland in New Delhi"
      }
    ],
    financialRequirements: {
      blockedAccountRequired: false,
      monthlyLivingRequirementPLN: 900,
      livingCostPerYearEUR: 5500, // ~€5,500/year (~₹5 Lakhs)
      approxINRAmount: 500000,
      acceptableFundSources: [
        "Bank balance certificate and statements for past 3-6 months",
        "Education loan sanction letter",
        "Sponsor declaration with ITRs"
      ],
      minimumSponsorITRYears: 2,
      recommendedFamilyITR: "₹4,50,000+ per year"
    },
    commonRefusalTriggers: [
      "Degrees not apostilled by MEA India",
      "Inability to justify choice of Poland and university in consular interview",
      "Insufficient travel medical insurance (€30,000 minimum)"
    ],
    solvencyRoadmap: [
      "Step 1: Receive official acceptance and tuition payment confirmation from Polish university.",
      "Step 2: Obtain MEA Apostille on degree certificates and transcripts.",
      "Step 3: Prepare bank statements showing living expenses (~€5,500) plus accommodation contract.",
      "Step 4: Register visa appointment on e-Konsulat portal.",
      "Step 5: Submit application at VFS Global Poland in India."
    ]
  },

  Switzerland: {
    country: "Switzerland",
    region: "EU / Switzerland",
    visaType: "National Visa D for Study Purposes",
    issuingAuthority: "State Secretariat for Migration (SEM) / Cantonal Migration Offices / Embassy of Switzerland in India",
    officialCitations: [
      {
        title: "SEM Switzerland - Entry and Residence for Study",
        url: "https://www.sem.admin.ch/sem/en/home/themen/einreise/faq.html",
        authority: "State Secretariat for Migration (SEM)"
      },
      {
        title: "Embassy of Switzerland in India - Student Visa Checklist",
        url: "https://www.eda.admin.ch/countries/india/en/home/visa/entry-ch/more-90-days/student-visa.html",
        authority: "Federal Department of Foreign Affairs (FDFA)"
      }
    ],
    financialRequirements: {
      blockedAccountRequired: false,
      livingCostPerYearCHF: 21000,
      approxINRAmount: 2000000, // ~₹20 Lakhs
      strictBankingRule: "Funds must be in a Swiss bank or a bank with a recognized Swiss correspondent branch, or an official bank certificate confirming liquid availability of CHF 21,000.",
      minimumSponsorITRYears: 3,
      recommendedFamilyITR: "₹12,00,000+ per year"
    },
    commonRefusalTriggers: [
      "Failure to provide proof of CHF 21,000 living funds in an acceptable financial institution",
      "Cantonal immigration authority not satisfied with student's future plan and commitment to leave Switzerland post graduation",
      "Vague motivation letter without detailed academic milestones"
    ],
    solvencyRoadmap: [
      "Step 1: Receive confirmation of matriculation from ETH Zurich, EPFL, or Swiss public university.",
      "Step 2: Deposit CHF 21,000 in student's personal bank account with official bank solvency certificate.",
      "Step 3: Draft detailed Statement of Intent including written commitment to leave Switzerland after graduation.",
      "Step 4: Submit National Visa D application at VFS Global Switzerland in India (transmitted to the Canton for review).",
      "Step 5: Once Cantonal approval is granted, collect Visa D sticker."
    ]
  },

  Ireland: {
    country: "Ireland",
    region: "EU",
    visaType: "Long Stay 'D' Study Visa (Stamp 2 Permission)",
    issuingAuthority: "Immigration Service Delivery (ISD) / Embassy of Ireland, New Delhi",
    officialCitations: [
      {
        title: "Immigration Service Delivery - Student Visa Guidelines",
        url: "https://www.irishimmigration.ie/coming-to-study-in-ireland/",
        authority: "Department of Justice, Ireland"
      },
      {
        title: "Education in Ireland - Official Government Portal",
        url: "https://www.educationinireland.com/",
        authority: "Enterprise Ireland"
      }
    ],
    financialRequirements: {
      blockedAccountRequired: false,
      minimumLivingFundEUR: 10000,
      approxINRAmount: 1100000,
      tuitionPaymentProof: "Evidence that at least €6,000 or full first-year tuition has been paid to the university (Electronic Transfer Receipt / PaytoStudy / Flywire)",
      fundSeasoningMonths: 6,
      seasoningRule: "A minimum of 6 continuous months of bank statements showing regular savings and no unexplained lump-sum deposits",
      minimumSponsorITRYears: 3,
      recommendedFamilyITR: "₹10,00,000+ per year",
      postStudyWorkVisa: "2-year Third Level Graduate Scheme (Stamp 1G) allows full-time work post Master's degree"
    },
    commonRefusalTriggers: [
      "Large unexplainable deposits appearing in bank statements within the 6-month seasoning period without documentary audit trails",
      "Sponsor's annual income insufficient to sustain student plus family remaining in India",
      "Gaps in education or employment exceeding 1 year without tax documents, pay slips, and employer reference letters",
      "Failure to provide proof of upfront tuition payment receipt"
    ],
    solvencyRoadmap: [
      "Step 1: Secure unconditional offer from public university and pay first-year tuition (minimum €6,000).",
      "Step 2: Maintain €10,000+ living funds in sponsor's bank account for 6 uninterrupted months.",
      "Step 3: Collect 3 years of sponsor's ITR-V, salary slips, and Chartered Accountant Net Worth Certificate.",
      "Step 4: Purchase compliant private medical insurance (e.g., Study & Protect / Irish Life).",
      "Step 5: Submit AVATS online visa application and lodge biometrics at VFS Global."
    ]
  },

  Portugal: {
    country: "Portugal",
    region: "EU",
    visaType: "National Long Stay D4 / D5 Student Visa",
    issuingAuthority: "AIMA (Agency for Integration, Migration and Asylum) / Portuguese Consulates in New Delhi and Goa",
    officialCitations: [
      {
        title: "VFS Global Portugal - National Visa Requirements",
        url: "https://visa.vfsglobal.com/ind/en/prt/",
        authority: "Ministry of Foreign Affairs Portugal (MNE)"
      }
    ],
    financialRequirements: {
      blockedAccountRequired: false,
      minimumLivingFundEUR: 8640, // 100% of Portuguese minimum monthly wage (€820/mo * 12)
      approxINRAmount: 800000,
      fundSeasoningMonths: 3,
      minimumSponsorITRYears: 2,
      recommendedFamilyITR: "₹6,00,000+ per year"
    },
    commonRefusalTriggers: [
      "Failure to provide proof of at least 1 year Portuguese minimum statutory living funds",
      "Lack of clean police clearance certificate (PCC) with MEA apostille",
      "Inability to demonstrate confirmed student accommodation in Portugal"
    ],
    solvencyRoadmap: [
      "Step 1: Receive official acceptance letter (Carta de Aceitação) from Portuguese public university.",
      "Step 2: Obtain Indian Police Clearance Certificate (PCC) and get it Apostilled by the Ministry of External Affairs (MEA).",
      "Step 3: Transfer or hold 1-year living funds (€8,640+) in student or sponsor's account.",
      "Step 4: Book accommodation in Portugal (university residence or registered rental agreement).",
      "Step 5: Submit visa file at VFS Portugal; upon arrival, attend AIMA appointment to collect Residence Card (Título de Residência)."
    ]
  },

  "Czech Republic": {
    country: "Czech Republic",
    region: "EU",
    visaType: "Long-term Visa for the Purpose of Studies (Code D/VC/24/)",
    issuingAuthority: "Ministry of the Interior of the Czech Republic (MOI / OAMP) / Embassy of the Czech Republic, New Delhi",
    officialCitations: [
      {
        title: "MOI Czech Republic - Studies Visa Guidance",
        url: "https://www.mvcr.cz/mvcren/article/third-country-nationals-long-term-visa.aspx",
        authority: "Ministry of the Interior (OAMP)"
      }
    ],
    financialRequirements: {
      blockedAccountRequired: false,
      minimumLivingFundEUR: 6000, // Approx CZK 150,000 statutory subsistence
      approxINRAmount: 550000,
      bankCardRequirement: "Must show internationally valid debit card (Visa/Mastercard) linked to the account",
      fundSeasoningMonths: 3,
      minimumSponsorITRYears: 2
    },
    commonRefusalTriggers: [
      "Documents not translated into Czech language by an official court interpreter (soudní překladatel)",
      "Failure to show international payment card issued in student's name linked to the funded account",
      "Missing superlegalization or Apostille on educational transcripts and police clearance"
    ],
    solvencyRoadmap: [
      "Step 1: Obtain admission letter and document on accommodation (doklad o ubytování) in the Czech Republic.",
      "Step 2: Legalize Indian degree and criminal record (PCC) with MEA Apostille and have all documents translated into Czech.",
      "Step 3: Obtain bank certificate proving CZK 150,000+ with international payment card in student's name.",
      "Step 4: Book long-term visa appointment via embassy lottery or dedicated student mode (Režim Student).",
      "Step 5: Purchase comprehensive health insurance from Pojišťovna VZP (pVZP)."
    ]
  },

  Denmark: {
    country: "Denmark",
    region: "EU",
    visaType: "Residence and Work Permit for Higher Education (ST1 Scheme)",
    issuingAuthority: "Danish Agency for International Recruitment and Integration (SIRI) / Embassy of Denmark, New Delhi",
    officialCitations: [
      {
        title: "New to Denmark (SIRI) - Higher Education Residence Permit",
        url: "https://www.nyidanmark.dk/en-GB/Applying-to-stay/Study/Higher-education",
        authority: "Danish Agency for International Recruitment and Integration"
      },
      {
        title: "Study in Denmark - Official Higher Education Guide",
        url: "https://studyindenmark.dk/",
        authority: "Ministry of Higher Education and Science Denmark"
      }
    ],
    financialRequirements: {
      blockedAccountRequired: false,
      minimumLivingFundEUR: 10700, // DKK ~80,000 per academic year
      approxINRAmount: 1000000,
      fundSeasoningMonths: 1,
      minimumSponsorITRYears: 2,
      recommendedFamilyITR: "₹8,00,000+ per year",
      acceptableFundSources: [
        "Bank account held in applicant's own name showing minimum DKK 80,000",
        "Official institutional scholarship certificate covering living costs and tuition",
        "Confirmed student loan from Indian Scheduled Commercial Bank disbursed into student's account"
      ]
    },
    commonRefusalTriggers: [
      "Failure to provide proof of paid tuition fee for the first semester/year",
      "Funds held in family member's name without transferring to student's personal account",
      "Submitting bank statements without official bank verification stamp and transaction history"
    ],
    solvencyRoadmap: [
      "Step 1: Secure unconditional admission offer from Danish public university and pay first semester tuition.",
      "Step 2: University initiates part 1 of online ST1 application on newtodenmark.dk; receive Case Order ID.",
      "Step 3: Transfer required living funds (DKK 80,000 / ~₹10 Lakhs) into personal bank account.",
      "Step 4: Complete part 2 of ST1 application and pay SIRI processing fee.",
      "Step 5: Record biometrics at VFS Denmark New Delhi/Mumbai/Bengaluru."
    ]
  },

  Estonia: {
    country: "Estonia",
    region: "EU",
    visaType: "Temporary Residence Permit for Study (TRP) / Long-Stay D Visa",
    issuingAuthority: "Police and Border Guard Board (PPA) / Embassy of Estonia in New Delhi",
    officialCitations: [
      {
        title: "Study in Estonia - Official Higher Education Portal",
        url: "https://studyinestonia.ee/",
        authority: "Education and Youth Board of Estonia"
      },
      {
        title: "Police and Border Guard Board (PPA) - Residence Permit for Study",
        url: "https://www.politsei.ee/en/instructions/residence-permit-for-study",
        authority: "Estonian Police and Border Guard Board (PPA)"
      }
    ],
    financialRequirements: {
      blockedAccountRequired: false,
      minimumLivingFundEUR: 5000, // ~€415/month for 12 months
      approxINRAmount: 460000,
      fundSeasoningMonths: 3,
      minimumSponsorITRYears: 2,
      recommendedFamilyITR: "₹5,00,000+ per year",
      acceptableFundSources: [
        "Personal savings account with verifiable 3-month history and international Visa/Mastercard",
        "Estonian university scholarship or Dora Plus stipend letter",
        "Education loan sanction letter from an Indian Scheduled Commercial Bank"
      ]
    },
    commonRefusalTriggers: [
      "Failure to pass university video interview or DreamApply entrance examination",
      "Unjustified gap years without employment certificates or tax records",
      "Missing MEA Apostille on academic degrees and police clearance certificate (PCC)"
    ],
    solvencyRoadmap: [
      "Step 1: Complete application on DreamApply (estonia.dreamapply.com) and pass admissions interview.",
      "Step 2: Legalize degree certificates and PCC with MEA Apostille in India.",
      "Step 3: Maintain ₹4.6 Lakhs+ in personal bank account for 90 days with bank verification certificate.",
      "Step 4: Book Long-Stay D Visa / TRP appointment at the Embassy of Estonia, New Delhi.",
      "Step 5: Purchase international student health insurance covering at least €30,000 in Estonia."
    ]
  },

  Greece: {
    country: "Greece",
    region: "EU",
    visaType: "National Long-Stay Study Visa (Type D)",
    issuingAuthority: "Hellenic Ministry of Foreign Affairs / Embassy of Greece in New Delhi",
    officialCitations: [
      {
        title: "Study in Greece - Official Higher Education Gateway",
        url: "https://studyingreece.edu.gr/",
        authority: "Ministry of Education and Religious Affairs, Greece"
      },
      {
        title: "Hellenic Republic MFA - National Visas D",
        url: "https://www.mfa.gr/en/visas/visa-types/national-visas.html",
        authority: "Ministry of Foreign Affairs of the Hellenic Republic"
      }
    ],
    financialRequirements: {
      blockedAccountRequired: false,
      minimumLivingFundEUR: 4800, // €400/month statutory benchmark
      approxINRAmount: 450000,
      fundSeasoningMonths: 3,
      minimumSponsorITRYears: 2,
      recommendedFamilyITR: "₹5,00,000+ per year"
    },
    commonRefusalTriggers: [
      "Unverified medical health certificate not issued by a certified state hospital in India",
      "Missing Apostille on Indian Police Clearance Certificate (PCC)",
      "Failure to show proof of first semester tuition payment receipt"
    ],
    solvencyRoadmap: [
      "Step 1: Receive formal admission letter and DOATAP degree recognition confirmation.",
      "Step 2: Obtain MEA Apostille on degree certificates and passport-office PCC.",
      "Step 3: Undergo medical screening at an approved diagnostic clinic for TB and infectious diseases.",
      "Step 4: Prepare 3 months seasoned bank statements showing ₹4.5 Lakhs+ balance with sponsor's ITRs.",
      "Step 5: File National Visa D application at GVCW / Embassy of Greece."
    ]
  },

  Hungary: {
    country: "Hungary",
    region: "EU",
    visaType: "Residence Permit for the Purpose of Study (D Visa entry)",
    issuingAuthority: "National Directorate-General for Aliens Policing (OIF) / Embassy of Hungary, New Delhi",
    officialCitations: [
      {
        title: "Study in Hungary - Tempus Public Foundation",
        url: "https://studyinhungary.hu/",
        authority: "Ministry of Foreign Affairs and Trade of Hungary"
      },
      {
        title: "National Directorate-General for Aliens Policing (OIF)",
        url: "http://oif.gov.hu/index.php/en/residence-permit-for-the-purpose-of-study",
        authority: "Hungarian Immigration Authority"
      }
    ],
    financialRequirements: {
      blockedAccountRequired: false,
      minimumLivingFundEUR: 5500,
      approxINRAmount: 500000,
      fundSeasoningMonths: 3,
      minimumSponsorITRYears: 2,
      recommendedFamilyITR: "₹5,50,000+ per year"
    },
    commonRefusalTriggers: [
      "Failure to provide confirmed dorm room or apartment rental contract in Hungary",
      "Inability to explain chosen study syllabus and career ambitions during consular interview",
      "Unexplained sudden fund deposits into sponsor bank account without source proof"
    ],
    solvencyRoadmap: [
      "Step 1: Obtain admission letter and accommodation certification from Hungarian public university.",
      "Step 2: Prepare seasoned bank statements showing minimum €5,500 (~₹5 Lakhs) with 3 years sponsor ITRs.",
      "Step 3: Book consular visa appointment via Hungarian reservation system (VFS Global).",
      "Step 4: Attend in-person oral credibility interview with consular officer.",
      "Step 5: Collect Type D entry visa and exchange for Residence Permit card upon arrival at OIF Budapest."
    ]
  },

  Latvia: {
    country: "Latvia",
    region: "EU",
    visaType: "Long Stay D-Visa and Residence Permit for Studies",
    issuingAuthority: "Office of Citizenship and Migration Affairs (OCMA / PMLP) / Embassy of Latvia in India",
    officialCitations: [
      {
        title: "Study in Latvia - Official Portal",
        url: "https://www.studyinlatvia.lv/",
        authority: "State Education Development Agency of Latvia (VIAA)"
      },
      {
        title: "PMLP Latvia - Residence Permit for Students",
        url: "https://www.pmlp.gov.lv/en/entry-permits",
        authority: "Office of Citizenship and Migration Affairs"
      }
    ],
    financialRequirements: {
      blockedAccountRequired: false,
      minimumLivingFundEUR: 8400, // €700/month statutory subsistence benchmark
      approxINRAmount: 770000,
      fundSeasoningMonths: 3,
      minimumSponsorITRYears: 2,
      recommendedFamilyITR: "₹6,50,000+ per year"
    },
    commonRefusalTriggers: [
      "Lack of mandatory AIC (Academic Information Centre) diploma verification statement",
      "Submitting bank balance without international payment card in the student's name",
      "Incomplete police clearance without MEA Apostille"
    ],
    solvencyRoadmap: [
      "Step 1: Complete university entrance exams and submit diplomas to AIC Latvia for equivalency verification.",
      "Step 2: University files electronic invitation approval number with PMLP Riga.",
      "Step 3: Prepare bank account balance of €8,400+ accompanied by an international debit card in student's name.",
      "Step 4: Legalize Indian degree certificates and PCC with MEA Apostille.",
      "Step 5: Submit Long-Stay D Visa application at VFS Global Latvia in New Delhi."
    ]
  },

  Lithuania: {
    country: "Lithuania",
    region: "EU",
    visaType: "National D Visa / Temporary Residence Permit for Study (TRP)",
    issuingAuthority: "Migration Department under the Ministry of the Interior (MIGRIS) / VFS Global India",
    officialCitations: [
      {
        title: "Study in Lithuania - Official Education Portal",
        url: "https://www.studyinlithuania.lt/",
        authority: "Education Exchanges Support Foundation (ŠMPF)"
      },
      {
        title: "Migration Department of Lithuania (MIGRIS)",
        url: "https://www.migracija.lt/en/esu-studentas",
        authority: "Ministry of the Interior of the Republic of Lithuania"
      }
    ],
    financialRequirements: {
      blockedAccountRequired: false,
      minimumLivingFundEUR: 4500, // ~€375/month statutory living minimum
      approxINRAmount: 410000,
      fundSeasoningMonths: 3,
      minimumSponsorITRYears: 2,
      recommendedFamilyITR: "₹5,00,000+ per year"
    },
    commonRefusalTriggers: [
      "Discrepancies in university electronic mediation letter in MIGRIS portal",
      "Uncertified gaps between Bachelor's completion and master's application",
      "Lack of valid health insurance policy covering €30,000 across Schengen area"
    ],
    solvencyRoadmap: [
      "Step 1: Secure admission from Lithuanian public university; university issues MIGRIS mediation letter number.",
      "Step 2: Fill out electronic MIGRIS application form online.",
      "Step 3: Obtain MEA Apostille on educational documents and Police Clearance Certificate.",
      "Step 4: Prepare bank statements reflecting minimum ₹4.1 Lakhs maintained for 90 days.",
      "Step 5: Attend VFS Lithuania biometric appointment in India."
    ]
  },

  Luxembourg: {
    country: "Luxembourg",
    region: "EU",
    visaType: "Temporary Authorisation to Stay (AST) followed by Type D Student Visa",
    issuingAuthority: "Directorate of Immigration, Ministry of Home Affairs Luxembourg",
    officialCitations: [
      {
        title: "Guichet.lu - Higher Education Student Residence Luxembourg",
        url: "https://guichet.public.lu/en/citoyens/immigration/plus-3-mois/ressortissant-tiers/etudiant/etudiant.html",
        authority: "Ministry of Foreign and European Affairs, Luxembourg"
      },
      {
        title: "University of Luxembourg - Admissions & Visas",
        url: "https://www.uni.lu/en/admissions/",
        authority: "Université du Luxembourg"
      }
    ],
    financialRequirements: {
      blockedAccountRequired: true,
      minimumLivingFundEUR: 12000, // 80% of Luxembourg statutory social minimum wage (~€1,200/mo)
      approxINRAmount: 1100000,
      fundSeasoningMonths: 0,
      minimumSponsorITRYears: 2,
      recommendedFamilyITR: "₹8,00,000+ per year"
    },
    commonRefusalTriggers: [
      "Applying for visa prior to receiving the official ministerial Temporary Authorisation to Stay (AST)",
      "Inadequate financial guarantee failing to meet 80% of Luxembourg social minimum wage standard",
      "Missing certified French or German translation of Indian police clearance and degree certificates"
    ],
    solvencyRoadmap: [
      "Step 1: Secure unconditional admission to University of Luxembourg (€400-€800/yr low tuition).",
      "Step 2: Submit direct paper dossier to Directorate of Immigration in Luxembourg City for AST approval.",
      "Step 3: Transfer living funds (€12,000) to university escrow blocked account or provide Belgian/Luxembourg bank guarantee.",
      "Step 4: Upon receiving AST authorization, book National D Visa stamp appointment via Embassy of Belgium in New Delhi.",
      "Step 5: Complete declaration of arrival at commune administration in Luxembourg within 3 business days."
    ]
  },

  Malta: {
    country: "Malta",
    region: "EU",
    visaType: "National Long-Stay Student Visa D / Identità Student Permit",
    issuingAuthority: "Identità (formerly Identity Malta Agency) / High Commission of Malta in New Delhi",
    officialCitations: [
      {
        title: "Study in Malta - Official Portal",
        url: "https://studyinmalta.biz/",
        authority: "Ministry for Education, Sport, Youth, Research and Innovation"
      },
      {
        title: "Identità Malta - Student Non-EU Residence",
        url: "https://identita.gov.mt/expatriates-unit-student-non-eu/",
        authority: "Identità Agency Malta"
      }
    ],
    financialRequirements: {
      blockedAccountRequired: false,
      minimumLivingFundEUR: 9000, // Daily allowance €25-€30/day (~€9,000/yr)
      approxINRAmount: 850000,
      fundSeasoningMonths: 3,
      minimumSponsorITRYears: 2,
      recommendedFamilyITR: "₹7,00,000+ per year"
    },
    commonRefusalTriggers: [
      "Failure to show international ATM/credit card linked to the funded bank account",
      "Submitting unverified accommodation agreements not registered with the Housing Authority Malta",
      "English proficiency documentation not satisfying Central Visa Unit benchmarks"
    ],
    solvencyRoadmap: [
      "Step 1: Secure acceptance letter from University of Malta and pay required tuition deposit.",
      "Step 2: Reserve accommodation registered with the Housing Authority Malta (rentregistration.mt).",
      "Step 3: Season ₹8.5 Lakhs+ funds in bank account for 90 days with international card proof.",
      "Step 4: Obtain MEA Apostille on educational transcripts and Police Clearance Certificate.",
      "Step 5: File National Visa D application through VFS Global Malta in New Delhi."
    ]
  },

  Romania: {
    country: "Romania",
    region: "EU",
    visaType: "Long-Stay Visa for Study (D/SD)",
    issuingAuthority: "General Inspectorate for Immigration (IGI) / Ministry of Foreign Affairs (MAE) / Embassy of Romania in New Delhi",
    officialCitations: [
      {
        title: "Study in Romania - Official Portal",
        url: "https://studyinromania.gov.ro/",
        authority: "Executive Agency for Higher Education, Research, Development and Innovation Funding (UEFISCDI)"
      },
      {
        title: "Romanian Ministry of Foreign Affairs - Long Stay Visa (D)",
        url: "https://mae.ro/en/node/2051",
        authority: "Ministry of Foreign Affairs Romania"
      }
    ],
    financialRequirements: {
      blockedAccountRequired: false,
      minimumLivingFundEUR: 5500, // Equal to national gross minimum wage per month for duration of stay
      approxINRAmount: 500000,
      fundSeasoningMonths: 3,
      minimumSponsorITRYears: 2,
      recommendedFamilyITR: "₹5,50,000+ per year"
    },
    commonRefusalTriggers: [
      "Applying without official Letter of Acceptance issued directly by the Romanian Ministry of Education",
      "Lack of proof of paid tuition fee for the first academic year",
      "Missing MEA Apostille / Romanian certified translation of degree certificates"
    ],
    solvencyRoadmap: [
      "Step 1: University submits student file to Romanian Ministry of Education to issue the official Letter of Acceptance (Scrisoare de Acceptare).",
      "Step 2: Pay full 1st-year tuition fee (€3,000 - €3,200) directly to university bank account and obtain bank confirmation.",
      "Step 3: Prepare proof of living funds (€5,500+ / ~₹5 Lakhs) with 3 months stamped bank statements.",
      "Step 4: Obtain MEA Apostille on Degree Transcripts and Police Clearance.",
      "Step 5: Apply online via eVisa Romania (evisa.mae.ro) and book appointment at Embassy of Romania in New Delhi."
    ]
  },

  Slovakia: {
    country: "Slovakia",
    region: "EU",
    visaType: "National Visa D for Study / Temporary Residence for Study",
    issuingAuthority: "Bureau of Border and Foreign Police / Embassy of the Slovak Republic in New Delhi",
    officialCitations: [
      {
        title: "Study in Slovakia - SAIA",
        url: "https://www.studyinslovakia.saia.sk/",
        authority: "Slovak Academic Information Agency (SAIA)"
      },
      {
        title: "Ministry of Foreign and European Affairs of the Slovak Republic",
        url: "https://www.mzv.sk/en/web/en/visa-and-services/residence-of-foreigners-in-slovakia",
        authority: "Ministry of Foreign Affairs Slovakia"
      }
    ],
    financialRequirements: {
      blockedAccountRequired: false,
      minimumLivingFundEUR: 4500,
      approxINRAmount: 400000,
      fundSeasoningMonths: 3,
      minimumSponsorITRYears: 2,
      recommendedFamilyITR: "₹5,00,000+ per year"
    },
    commonRefusalTriggers: [
      "Documents not translated into Slovak by an official certified court translator (úradný prekladateľ)",
      "Lack of superlegalization / Apostille on Indian police clearance certificate",
      "Failure to provide confirmed dorm room or tenancy contract in Slovakia"
    ],
    solvencyRoadmap: [
      "Step 1: Obtain admission letter from Slovak public university and secure student dormitory accommodation.",
      "Step 2: Legalize educational transcripts and PCC with MEA Apostille and certified Slovak translation.",
      "Step 3: Maintain ₹4 Lakhs+ in personal bank account with international payment card.",
      "Step 4: Submit National Visa D application at the Embassy of the Slovak Republic in New Delhi.",
      "Step 5: Undergo statutory medical examination in Slovakia within 30 days of arrival."
    ]
  },

  Slovenia: {
    country: "Slovenia",
    region: "EU",
    visaType: "Temporary Residence Permit for Study (Issued via Type D Visa)",
    issuingAuthority: "Administrative Unit (Upravna Enota) / Embassy of the Republic of Slovenia in New Delhi",
    officialCitations: [
      {
        title: "Study in Slovenia - Official Higher Education Portal",
        url: "https://studyinslovenia.si/",
        authority: "CMEPIUS & Ministry of Higher Education, Science and Innovation"
      },
      {
        title: "GOV.SI - Residence Permit for Study in Slovenia",
        url: "https://www.gov.si/en/topics/entry-and-residence/residence-permit-for-study/",
        authority: "Government of the Republic of Slovenia"
      }
    ],
    financialRequirements: {
      blockedAccountRequired: false,
      minimumLivingFundEUR: 5500, // Statutory basic minimum income benchmark (~€450/month)
      approxINRAmount: 500000,
      fundSeasoningMonths: 3,
      minimumSponsorITRYears: 2,
      recommendedFamilyITR: "₹5,50,000+ per year"
    },
    commonRefusalTriggers: [
      "Affidavit of financial support not accompanied by notarized Slovenian translation",
      "Missing MEA Apostille on Police Clearance Certificate and degree certificates",
      "Failure to show valid Schengen health insurance covering minimum €30,000"
    ],
    solvencyRoadmap: [
      "Step 1: Receive acceptance certificate from University of Ljubljana or Slovenian public university via eVŠ portal.",
      "Step 2: Legalize academic degrees and PCC with MEA Apostille in India.",
      "Step 3: Prepare bank statements showing ₹5 Lakhs+ seasoned funds with sponsor's 2-3 years ITRs.",
      "Step 4: Book consular interview at Embassy of Slovenia in New Delhi (or VFS partner).",
      "Step 5: Pick up first residence permit card / Type D visa."
    ]
  },

  Bulgaria: {
    country: "Bulgaria",
    region: "EU",
    visaType: "Long-Stay National Visa D for Education",
    issuingAuthority: "Migration Directorate of the Ministry of Interior / Embassy of the Republic of Bulgaria in New Delhi",
    officialCitations: [
      {
        title: "Study in Bulgaria - Ministry of Education and Science",
        url: "https://www.mon.bg/en/100037",
        authority: "Ministry of Education and Science Bulgaria"
      },
      {
        title: "Ministry of Foreign Affairs Bulgaria - Long-Stay Visa D",
        url: "https://www.mfa.bg/en/services-travel/consular-services/visa-for-bulgaria",
        authority: "Ministry of Foreign Affairs of the Republic of Bulgaria"
      }
    ],
    financialRequirements: {
      blockedAccountRequired: false,
      minimumLivingFundEUR: 4500,
      approxINRAmount: 400000,
      fundSeasoningMonths: 3,
      minimumSponsorITRYears: 2,
      recommendedFamilyITR: "₹4,50,000+ per year"
    },
    commonRefusalTriggers: [
      "Applying without the mandatory Certificate of Acceptance issued by the Bulgarian Ministry of Education and Science",
      "Missing certified Bulgarian translation of medical certificates and police clearance",
      "Inability to prove payment of the first semester public university tuition fee"
    ],
    solvencyRoadmap: [
      "Step 1: University applies on student's behalf to Bulgarian Ministry of Education and Science for official Certificate of Acceptance.",
      "Step 2: Transfer 1st semester tuition fee directly to university bank account.",
      "Step 3: Obtain MEA Apostille on Bachelor transcripts, medical certificate, and PCC with certified Bulgarian translation.",
      "Step 4: Show bank account with minimum ₹4 Lakhs balance and sponsor guarantee.",
      "Step 5: Attend in-person visa interview at the Embassy of Bulgaria in New Delhi."
    ]
  },

  Croatia: {
    country: "Croatia",
    region: "EU",
    visaType: "Long-Stay Visa (Visa D) / Temporary Stay for Higher Education",
    issuingAuthority: "Ministry of the Interior of the Republic of Croatia (MUP) / Embassy of the Republic of Croatia in New Delhi",
    officialCitations: [
      {
        title: "Study in Croatia - Official Higher Education Gateway",
        url: "https://www.studyincroatia.hr/",
        authority: "Agency for Science and Higher Education Croatia (ASHE)"
      },
      {
        title: "MUP Croatia - Temporary Stay for Education",
        url: "https://mup.gov.hr/aliens-281621/stay-and-work/temporary-stay-of-third-country-nationals/281636",
        authority: "Ministry of the Interior, Republic of Croatia"
      }
    ],
    financialRequirements: {
      blockedAccountRequired: false,
      minimumLivingFundEUR: 5500, // Statutory monthly subsistence minimum
      approxINRAmount: 500000,
      fundSeasoningMonths: 3,
      minimumSponsorITRYears: 2,
      recommendedFamilyITR: "₹5,50,000+ per year"
    },
    commonRefusalTriggers: [
      "Missing Croatian Personal Identification Number (OIB) required for accommodation registration",
      "Failure to provide MEA Apostille on Police Clearance Certificate and degree transcripts",
      "Lack of valid comprehensive private health insurance covering Croatia"
    ],
    solvencyRoadmap: [
      "Step 1: Secure admission from University of Zagreb or Croatian public university.",
      "Step 2: Obtain Croatian Tax Identification Number (OIB) through the tax administration.",
      "Step 3: Reserve notarized student accommodation and obtain MEA Apostille on PCC and degrees.",
      "Step 4: Maintain ₹5 Lakhs+ in bank account with international payment card.",
      "Step 5: Submit Visa D application at VFS Global Croatia in New Delhi."
    ]
  },

  Cyprus: {
    country: "Cyprus",
    region: "EU",
    visaType: "Entry Permit and Student Visa for Third-Country Nationals",
    issuingAuthority: "Civil Registry and Migration Department (CRMD) / High Commission of the Republic of Cyprus in New Delhi",
    officialCitations: [
      {
        title: "Study in Cyprus - Department of Higher Education",
        url: "https://highereducation.ac.cy/",
        authority: "Ministry of Education, Sport and Youth of Cyprus"
      },
      {
        title: "Civil Registry and Migration Department Cyprus - Students",
        url: "http://www.moi.gov.cy/crmd",
        authority: "Ministry of Interior Cyprus"
      }
    ],
    financialRequirements: {
      blockedAccountRequired: false,
      minimumLivingFundEUR: 6000,
      approxINRAmount: 550000,
      fundSeasoningMonths: 3,
      minimumSponsorITRYears: 2,
      recommendedFamilyITR: "₹5,50,000+ per year"
    },
    commonRefusalTriggers: [
      "Failure to clear mandatory medical tests (Chest X-ray for TB, Hepatitis B/C, HIV, VDRL) attested in India",
      "Lack of bank guarantee deposit or proof of paid tuition fee",
      "Missing MEA Apostille on academic transcripts and Police Clearance Certificate"
    ],
    solvencyRoadmap: [
      "Step 1: University in Cyprus submits student file directly to Migration Department (CRMD) in Nicosia for Entry Permit M58.",
      "Step 2: Undergo blood tests and chest X-ray at an approved diagnostic clinic with MEA attestation.",
      "Step 3: Transfer tuition fee deposit and prepare bank balance of €6,000+.",
      "Step 4: Attend biometric interview at High Commission of Cyprus in New Delhi to receive Entry Visa.",
      "Step 5: Undergo repeat blood screening in Cyprus within 7 days of arrival to receive final ARC student permit."
    ]
  },

  "All EU Countries": {
    country: "All EU Countries",
    region: "EU",
    visaType: "EU Long Stay National Student Visa (Type D) under Directive (EU) 2016/801",
    issuingAuthority: "National Immigration Authorities of EU Member States (Schengen Area)",
    officialCitations: [
      {
        title: "European Commission - EU Immigration Portal: Students",
        url: "https://immigration-portal.ec.europa.eu/general-information/students_en",
        authority: "European Commission Directorate-General for Migration and Home Affairs"
      }
    ],
    financialRequirements: {
      blockedAccountRequired: false,
      minimumLivingFundEUR: 9000,
      approxINRAmount: 850000,
      fundSeasoningMonths: 3,
      minimumSponsorITRYears: 2,
      recommendedFamilyITR: "₹7,00,000+ per year",
      schengenMobility: "Holders of an EU Type D student residence permit can travel visa-free across 29 Schengen countries for up to 90 days in any 180-day period."
    },
    commonRefusalTriggers: [
      "Unjustified study gaps exceeding 1-2 years without verifiable employment or academic records",
      "Insufficient proof of legal financial subsistence according to host nation's statutory benchmark",
      "Lack of valid health insurance covering minimum €30,000 emergency medical costs with Schengen-wide validity"
    ],
    solvencyRoadmap: [
      "Step 1: Secure admission from an accredited EU public university.",
      "Step 2: Prepare financial solvency (blocked account or seasoned bank account with sponsor's 2-3 yrs ITRs).",
      "Step 3: Obtain MEA Apostille on degree transcripts and Police Clearance Certificate (PCC).",
      "Step 4: Secure Schengen-compliant international student health insurance policy.",
      "Step 5: File National Visa D application at the relevant embassy or authorized VFS/TLS center."
    ]
  }
};

// Map aliases
countryVisaRules["Czechia"] = countryVisaRules["Czech Republic"];
countryVisaRules["United Kingdom"] = countryVisaRules["UK"];

module.exports = {
  countryVisaRules
};

