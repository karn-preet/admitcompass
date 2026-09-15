/**
 * Official Education Loan Comparison Database for Indian Study Abroad Applicants
 * Covers Public Sector Banks, Private Commercial Banks, NBFCs, and International USD Lenders.
 * Includes interest rates, processing fees, tax savings under Section 80E, and collateral criteria.
 */

const loanProviders = [
  {
    id: "bank-sbi",
    name: "State Bank of India (SBI Global Ed-Vantage)",
    category: "Public Sector Bank",
    institutionType: "Public Bank",
    interestRateMin: 8.85,
    interestRateMax: 10.15,
    baseFloatingRate: "EBLR (External Benchmark Linked Rate) + 0.50% to 1.50%",
    maxLoanAmountINR: 15000000, // Up to ₹1.5 Crores
    maxUnsecuredAmountINR: 750000, // ₹7.5 Lakhs without collateral
    collateralRequired: "Mandatory above ₹7.5 Lakhs (Residential property, commercial plot, or Fixed Deposit)",
    marginMoneyPercent: 10, // 10% for overseas studies
    moratoriumPeriod: "Course Duration + 6 Months (Interest can be serviced or capitalized)",
    maxRepaymentTenureYears: 15,
    processingFee: "₹10,000 + GST (Refundable upon disbursement in select schemes)",
    taxBenefit80E: true,
    consularTrustLevel: "Highest (Accepted unconditionally by US, German, Canadian, UK, and Australian consulates)",
    approvalTimeWeeks: "3 to 5 weeks (Requires legal and valuation checks for property)",
    pros: [
      "Lowest interest rates in India (8.85%–9.5%)",
      "No prepayment or foreclosure penalty ever",
      "Full Section 80E Income Tax deduction on entire interest paid for 8 years",
      "Direct disbursement to German Blocked Account (Expatrio/Fintiba) and Canadian GIC (CIBC/Scotiabank)"
    ],
    cons: [
      "Requires physical tangible collateral (house/flat/FD) above ₹7.5 Lakhs",
      "Slower processing time compared to private NBFCs"
    ]
  },
  {
    id: "bank-bob",
    name: "Bank of Baroda (Baroda Scholar Scheme)",
    category: "Public Sector Bank",
    institutionType: "Public Bank",
    interestRateMin: 8.95,
    interestRateMax: 10.25,
    baseFloatingRate: "BRLLR + spread",
    maxLoanAmountINR: 15000000, // ₹1.5 Cr (Premier institutions up to ₹80L without collateral)
    maxUnsecuredAmountINR: 4000000, // Up to ₹40L unsecured for top global universities (QS < 150)
    collateralRequired: "No collateral for listed top 150 world universities up to ₹40L; otherwise required above ₹7.5L",
    marginMoneyPercent: 10,
    moratoriumPeriod: "Course Duration + 1 Year",
    maxRepaymentTenureYears: 15,
    processingFee: "1% of loan amount (Max ₹10,000 + GST)",
    taxBenefit80E: true,
    consularTrustLevel: "Highest",
    approvalTimeWeeks: "2 to 4 weeks",
    pros: [
      "Special unsecured list for top 150 world universities (TUM, Oxford, CMU, Toronto, Melbourne)",
      "0.50% concession for female students",
      "1-year post-study job search moratorium cushion"
    ],
    cons: [
      "Stringent co-applicant credit score requirement (CIBIL 720+)",
      "Requires visit to regional Baroda specialized loan branch"
    ]
  },
  {
    id: "bank-icici",
    name: "ICICI Bank Education Loan",
    category: "Private Commercial Bank",
    institutionType: "Private Bank",
    interestRateMin: 10.25,
    interestRateMax: 11.75,
    baseFloatingRate: "Repo Linked Lending Rate (RLLR) + spread",
    maxLoanAmountINR: 10000000, // ₹1 Crore
    maxUnsecuredAmountINR: 5000000, // Up to ₹50 Lakhs unsecured for select institutes
    collateralRequired: "Collateral optional up to ₹50 Lakhs depending on target university tier",
    marginMoneyPercent: 5,
    moratoriumPeriod: "Course Duration + 6 Months",
    maxRepaymentTenureYears: 12,
    processingFee: "0.75% to 1.0% of loan amount + GST",
    taxBenefit80E: true,
    consularTrustLevel: "High",
    approvalTimeWeeks: "5 to 10 working days",
    pros: [
      "Fast digital sanction letter in under 7 days",
      "Unsecured loans up to ₹50 Lakhs for STEM master's",
      "Section 80E tax deduction eligible"
    ],
    cons: [
      "Higher interest rate than SBI / Bank of Baroda (approx 1.5% higher)",
      "Partial simple interest payment during course duration often required"
    ]
  },
  {
    id: "nbfc-hdfc-credila",
    name: "HDFC Credila Financial Services",
    category: "Non-Banking Financial Company (NBFC)",
    institutionType: "NBFC",
    interestRateMin: 11.25,
    interestRateMax: 13.50,
    baseFloatingRate: "Credila Benchmark Lending Rate (CBLR)",
    maxLoanAmountINR: 8000000, // ₹80 Lakhs
    maxUnsecuredAmountINR: 6000000, // Up to ₹60 Lakhs unsecured
    collateralRequired: "Completely unsecured options widely available based on co-borrower income and GRE/CGPA",
    marginMoneyPercent: 0, // Up to 100% finance of living + travel + laptop + fees
    moratoriumPeriod: "Course Duration + 6 Months (Requires monthly simple interest servicing of approx ₹3k-₹10k)",
    maxRepaymentTenureYears: 14,
    processingFee: "1.0% to 1.5% of loan amount + GST",
    taxBenefit80E: true, // Recognized under Section 80E notified institutions
    consularTrustLevel: "Medium-High (Accepted by USA, Canada, Germany, UK; may require disbursement proof for select consulates)",
    approvalTimeWeeks: "3 to 7 working days",
    pros: [
      "100% financing with zero margin money needed from student",
      "Covers living costs, flight tickets, and study laptop",
      "Fast door-step collection of documents"
    ],
    cons: [
      "High interest rate (11.5%–13.5%) significantly increases total repayment cost",
      "Requires monthly interest payments during the study period"
    ]
  },
  {
    id: "nbfc-avanse",
    name: "Avanse Financial Services",
    category: "Non-Banking Financial Company (NBFC)",
    institutionType: "NBFC",
    interestRateMin: 11.75,
    interestRateMax: 14.00,
    baseFloatingRate: "Avanse Base Rate (ABR)",
    maxLoanAmountINR: 7500000,
    maxUnsecuredAmountINR: 5000000,
    collateralRequired: "Unsecured up to ₹50 Lakhs",
    marginMoneyPercent: 0,
    moratoriumPeriod: "Course Duration + 6 Months",
    maxRepaymentTenureYears: 12,
    processingFee: "1.25% to 1.75% + GST",
    taxBenefit80E: true,
    consularTrustLevel: "Medium-High",
    approvalTimeWeeks: "3 to 5 working days",
    pros: [
      "Customized repayment plans (graduated EMI options)",
      "High approval rate for STEM and MBA programs",
      "Section 80E eligible"
    ],
    cons: [
      "Higher processing fees (up to 1.75%)",
      "High effective interest rate"
    ]
  },
  {
    id: "intl-prodigy",
    name: "Prodigy Finance (UK / US International Lender)",
    category: "International Fintech Lender (No Cosigner / No Collateral)",
    institutionType: "International USD/EUR Lender",
    interestRateMin: 11.50,
    interestRateMax: 14.75,
    baseFloatingRate: "30-Day SOFR + variable margin",
    maxLoanAmountINR: 12000000, // Up to 100% Cost of Attendance in USD/EUR
    maxUnsecuredAmountINR: 12000000, // 100% Unsecured
    collateralRequired: "None (Zero collateral, zero Indian co-signer required!)",
    marginMoneyPercent: 0,
    moratoriumPeriod: "Course Duration + 6 Months (Zero payments while studying!)",
    maxRepaymentTenureYears: 15,
    processingFee: "4% to 5% administration fee added to loan balance",
    taxBenefit80E: false, // Foreign entity, NOT eligible for Indian Section 80E tax deduction
    consularTrustLevel: "High for US, UK, and EU (Accepted directly for I-20 and CAS issuance)",
    approvalTimeWeeks: "2 to 5 working days (100% online)",
    pros: [
      "ZERO co-signer and ZERO collateral required from parents",
      "Evaluates student's future earning potential rather than parents' past income or ITRs",
      "100% online application with loan letter in USD/EUR/GBP"
    ],
    cons: [
      "Loan is denominated in USD/EUR (Currency exchange fluctuation risk for students paying back from India)",
      "Higher origination fee (~4%-5%) and interest rates (12%-14.5%)",
      "No Indian Section 80E tax deduction"
    ]
  }
];

module.exports = {
  loanProviders
};
