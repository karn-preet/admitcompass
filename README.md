# 🎓 AdmitCompass - Study Abroad Admission & Visa Refusal Mitigation Evaluator

> A full-stack evaluation engine for Bachelor's and Master's degree applicants targeting public universities in **Germany, EU, USA, UK, Canada, Australia, and New Zealand**, specifically engineered with deep domain logic for **Indian students**.

---

## 🌟 Core Features

1. **Academic Evaluation & Historical Cutoff Matcher**:
   - Compares applicant CGPA against historical public university thresholds across 40+ top public universities.
   - Categorizes outcomes into **Safe (>75% odds)**, **Target (50-75% odds)**, and **Reach (<50% odds)**.
   - Built-in **German Bavarian Formula Converter** ($1 + 3 \times \frac{10 - \text{CGPA}}{10 - 4}$) and **US 4.0 GPA converter**.
   - Backlog tolerance checks and Tier-1/2/3 Indian college reputation weighting.

2. **Visa Refusal Mitigation & Financial Solvency Engine**:
   - Real-time audit against official immigration financial rules:
     - **Germany**: €11,904 Blocked Account (Sperrkonto) & mandatory APS India verification.
     - **USA**: Form I-20 proof of funds ($35k-$60k) & Section 214(b) non-immigrant intent defense.
     - **Canada**: CAD $20,635 GIC & Provincial Attestation Letter (PAL) quota adherence.
     - **UK**: Strict 28-day continuous fund seasoning rule (£1,136/mo outside London) & TB test.
     - **Australia**: Subclass 500 Genuine Student (GS) assessment & AUD $29,710/yr living costs.
     - **New Zealand**: NZD $20,000 living costs & ANZ Funds Transfer Scheme (FTS).
   - Flags dangerous refusal triggers: unexplained sudden deposits, low ITR vs declared savings, uncertified study gaps, and high-interest NBFC loans.
   - Generates a customized, step-by-step legal solvency roadmap for Indian parents.

3. **Dynamic Compensatory Recommendations (For Average CGPA 6.0 - 7.5)**:
   - Specific entrance exam offsets (targeting GRE Quant 164+).
   - German language certification leverage (Goethe A2/B1 expanding public university options by 5x).
   - **Fachhochschule (Universities of Applied Sciences) vs Technical University (TU)** strategic pivot.
   - IEEE/Scopus research publications or open-source Dockerized GitHub portfolios.
   - Section 80E Indian Income Tax deduction hacks on education loans.

4. **Data Integrity & Live Web Scrapers**:
   - Backend scraper parses live official course catalogs and immigration portals.
   - Verified clickable citations linking directly to DAAD, APS India, US State Dept, IRCC, UKVI, and Australian Home Affairs.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- npm

### 1. Start the Backend Server (Port 5000)
```bash
cd backend
npm install
npm run start
```
*Backend unit test suite:*
```bash
npm test
```

### 2. Start the Frontend Development Server (Port 5173)
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.
