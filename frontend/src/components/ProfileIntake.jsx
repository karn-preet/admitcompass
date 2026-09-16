import React, { useState, useMemo, useEffect } from "react";
import { 
  GraduationCap, 
  Wallet, 
  Sparkles, 
  ArrowRight, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Calculator,
  Building2,
  FileCheck
} from "lucide-react";
import { useProfile } from "../context/ProfileContext";

export default function ProfileIntake({ onSubmit, isLoading, selectedCountry, onCountryChange }) {
  const { profile: globalProfile, updateProfile } = useProfile();
  const [step, setStep] = useState(1); // 1: Academic, 2: Standardized Tests, 3: Financials

  // Profile Form State
  const [formData, setFormData] = useState({
    targetCountry: selectedCountry || "Germany",
    degreeTarget: "Master's",
    backgroundField: "Computer Science",
    maxAnnualTuition: 30000,
    currentCGPA: 7.2,
    isPercentage: false,
    collegeTier: "Tier 2 (State Govt/Top Autonomous/Vellore/Manipal)",
    workExperienceYears: 1,
    researchPapersCount: 0,
    backlogs: 1,

    // Tests
    ieltsScore: 7.0,
    ieltsBandMin: 6.5,
    toeflScore: 92,
    greQuant: 163,
    greVerbal: 152,
    greTotal: 315,
    germanLanguageLevel: "A1 (Basic)",

    // Financial Profile (INR)
    annualFamilyIncomeINR: 900000, // ₹9 Lakhs
    itrYearsAvailable: 3,
    liquidSavingsINR: 1200000,    // ₹12 Lakhs
    fixedDepositsINR: 400000,      // ₹4 Lakhs
    providentFundINR: 300000,      // ₹3 Lakhs
    loanSanctionedINR: 0,
    loanBankType: "None / Not Applied Yet",
    immovablePropertyValuationINR: 3500000, // ₹35 Lakhs
    hasApsCertificate: false,
    studyGapYears: 0,
    gapDocumented: true
  });

  // Keep targetCountry synced with parent prop if changed
  React.useEffect(() => {
    if (selectedCountry) {
      setFormData(prev => ({ ...prev, targetCountry: selectedCountry }));
    }
  }, [selectedCountry]);

  // Real-time calculation of Bavarian formula & US GPA
  const { liveGermanGrade, liveUSGPA } = useMemo(() => {
    const score = Number(formData.currentCGPA) || 0;
    const nMax = 10.0;
    const nMin = 4.0;
    const nd = Math.min(Math.max(score, nMin), nMax);
    const german = 1 + 3 * ((nMax - nd) / (nMax - nMin));

    let us = 2.0;
    if (score >= 9.0) us = 3.7 + ((score - 9.0) / 1.0) * 0.3;
    else if (score >= 8.0) us = 3.3 + ((score - 8.0) / 1.0) * 0.4;
    else if (score >= 7.0) us = 3.0 + ((score - 7.0) / 1.0) * 0.3;
    else if (score >= 6.0) us = 2.6 + ((score - 6.0) / 1.0) * 0.4;
    else if (score >= 5.0) us = 2.2 + ((score - 5.0) / 1.0) * 0.4;

    return {
      liveGermanGrade: german.toFixed(2),
      liveUSGPA: us.toFixed(2)
    };
  }, [formData.currentCGPA]);

  const handleChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === "targetCountry" && onCountryChange) {
        onCountryChange(value);
      }
      return updated;
    });

    const patch = {};
    if (field === "degreeTarget") patch.degreeType = value;
    if (field === "backgroundField") {
      patch.field = value;
      patch.currentDegree = `B.Tech in ${value}`;
    }
    if (field === "currentCGPA") patch.cgpa = Number(value);
    if (field === "ieltsScore") patch.ieltsScore = Number(value);
    if (field === "annualFamilyIncomeINR") patch.income = Number(value);
    if (field === "liquidSavingsINR") {
      patch.liquidSavingsINR = Number(value);
      patch.financialCapacityEUR = Number(value) / 90;
    }
    if (Object.keys(patch).length > 0) {
      updateProfile(patch);
    }
  };

  // Preset Loaders
  const loadPreset = (type) => {
    if (type === "average-cs") {
      const p = {
        targetCountry: "Germany",
        degreeTarget: "Master's",
        backgroundField: "Computer Science",
        currentCGPA: 7.2,
        collegeTier: "Tier 2 (State Govt/Top Autonomous/Vellore/Manipal)",
        workExperienceYears: 1,
        researchPapersCount: 0,
        backlogs: 2,
        ieltsScore: 6.5,
        ieltsBandMin: 6.0,
        greQuant: 161,
        greVerbal: 149,
        greTotal: 310,
        germanLanguageLevel: "A1 (Basic)",
        annualFamilyIncomeINR: 750000,
        itrYearsAvailable: 2,
        liquidSavingsINR: 1100000,
        fixedDepositsINR: 300000,
        loanSanctionedINR: 0,
        hasApsCertificate: false
      };
      setFormData(prev => ({ ...prev, ...p }));
      updateProfile({
        degreeType: p.degreeTarget,
        field: p.backgroundField,
        currentDegree: "B.Tech in Computer Science and Engineering",
        cgpa: p.currentCGPA,
        ieltsScore: p.ieltsScore,
        income: p.annualFamilyIncomeINR,
        liquidSavingsINR: p.liquidSavingsINR,
        financialCapacityEUR: p.liquidSavingsINR / 90
      });
    } else if (type === "high-achiever") {
      const p = {
        targetCountry: "USA",
        degreeTarget: "Master's",
        backgroundField: "Data Science",
        currentCGPA: 8.9,
        collegeTier: "Tier 1 (IIT/NIT/BITS/IISc/Centrally Funded)",
        workExperienceYears: 2,
        researchPapersCount: 1,
        backlogs: 0,
        ieltsScore: 7.5,
        ieltsBandMin: 7.0,
        greQuant: 168,
        greVerbal: 158,
        greTotal: 326,
        annualFamilyIncomeINR: 1800000,
        itrYearsAvailable: 3,
        liquidSavingsINR: 2500000,
        fixedDepositsINR: 1500000,
        loanSanctionedINR: 2000000,
        loanBankType: "Public Sector Bank (SBI / Canara / BoB)",
        immovablePropertyValuationINR: 6500000,
        hasApsCertificate: true
      };
      setFormData(prev => ({ ...prev, ...p }));
      updateProfile({
        degreeType: p.degreeTarget,
        field: p.backgroundField,
        currentDegree: "B.Tech in Computer Science and Engineering",
        cgpa: p.currentCGPA,
        ieltsScore: p.ieltsScore,
        income: p.annualFamilyIncomeINR,
        liquidSavingsINR: p.liquidSavingsINR,
        financialCapacityEUR: p.liquidSavingsINR / 90
      });
    } else if (type === "budget-germany") {
      const p = {
        targetCountry: "Germany",
        degreeTarget: "Master's",
        backgroundField: "Mechanical Engineering",
        currentCGPA: 6.8,
        collegeTier: "Tier 3 (University Affiliated Colleges)",
        workExperienceYears: 3,
        researchPapersCount: 0,
        backlogs: 3,
        ieltsScore: 6.5,
        ieltsBandMin: 6.0,
        greQuant: 158,
        greVerbal: 147,
        greTotal: 305,
        germanLanguageLevel: "A2 (Elementary)",
        annualFamilyIncomeINR: 550000,
        itrYearsAvailable: 2,
        liquidSavingsINR: 800000,
        fixedDepositsINR: 200000,
        loanSanctionedINR: 500000,
        loanBankType: "Public Sector Bank (SBI / Canara / BoB)",
        hasApsCertificate: true
      };
      setFormData(prev => ({ ...prev, ...p }));
      updateProfile({
        degreeType: p.degreeTarget,
        field: p.backgroundField,
        currentDegree: "B.Tech in Mechanical Engineering",
        cgpa: p.currentCGPA,
        ieltsScore: p.ieltsScore,
        income: p.annualFamilyIncomeINR,
        liquidSavingsINR: p.liquidSavingsINR,
        financialCapacityEUR: p.liquidSavingsINR / 90
      });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const academicPayload = {
      degreeTarget: formData.degreeTarget,
      backgroundField: formData.backgroundField,
      currentCGPA: Number(formData.currentCGPA),
      collegeTier: formData.collegeTier,
      backlogs: Number(formData.backlogs),
      ieltsScore: Number(formData.ieltsScore),
      ieltsBandMin: Number(formData.ieltsBandMin),
      toeflScore: Number(formData.toeflScore),
      greQuant: Number(formData.greQuant),
      greVerbal: Number(formData.greVerbal),
      greTotal: Number(formData.greTotal),
      workExperienceYears: Number(formData.workExperienceYears),
      researchPapersCount: Number(formData.researchPapersCount),
      germanLanguageLevel: formData.germanLanguageLevel,
      targetCountries: [formData.targetCountry]
    };

    const financialPayload = {
      annualFamilyIncomeINR: Number(formData.annualFamilyIncomeINR),
      itrYearsAvailable: Number(formData.itrYearsAvailable),
      liquidSavingsINR: Number(formData.liquidSavingsINR),
      fixedDepositsINR: Number(formData.fixedDepositsINR),
      providentFundINR: Number(formData.providentFundINR),
      loanSanctionedINR: Number(formData.loanSanctionedINR),
      loanBankType: formData.loanBankType,
      immovablePropertyValuationINR: Number(formData.immovablePropertyValuationINR),
      hasApsCertificate: formData.hasApsCertificate,
      studyGapYears: Number(formData.studyGapYears),
      gapDocumented: formData.gapDocumented
    };

    onSubmit({
      academic: academicPayload,
      financial: financialPayload,
      targetCountry: formData.targetCountry
    });
  };

  return (
    <div className="glass-panel" style={{ padding: "32px", maxWidth: "920px", margin: "0 auto", position: "relative" }}>
      
      {/* Header & Preset Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.65rem", fontWeight: "700", letterSpacing: "-0.5px" }}>
            Applicant Profile & Eligibility Intake
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Evaluates your admission odds across public universities & detects visa refusal risks before applying.
          </p>
        </div>

        {/* 1-Click Profile Presets */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: "600" }}>
            Try Profile:
          </span>
          <button 
            type="button" 
            onClick={() => loadPreset("average-cs")} 
            className="btn btn-secondary" 
            style={{ padding: "5px 10px", fontSize: "0.78rem" }}
          >
            🇮🇳 Average CGPA (7.2)
          </button>
          <button 
            type="button" 
            onClick={() => loadPreset("high-achiever")} 
            className="btn btn-secondary" 
            style={{ padding: "5px 10px", fontSize: "0.78rem" }}
          >
            ⭐ Tier 1 (8.9 CGPA)
          </button>
          <button 
            type="button" 
            onClick={() => loadPreset("budget-germany")} 
            className="btn btn-secondary" 
            style={{ padding: "5px 10px", fontSize: "0.78rem" }}
          >
            🇩🇪 Budget Focused (6.8)
          </button>
        </div>
      </div>

      {/* Live Grade Preview Pill */}
      <div style={{ 
        background: "rgba(37, 99, 235, 0.1)", 
        border: "1px solid rgba(37, 99, 235, 0.25)", 
        borderRadius: "14px", 
        padding: "12px 18px", 
        marginBottom: "28px", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "12px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Calculator color="#60a5fa" size={20} />
          <div>
            <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--accent-blue-dark, #1d4ed8)" }}>
              Live Grade Equivalence (Bavarian & US Standard):
            </span>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              CGPA {formData.currentCGPA}/10 converts to:
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase" }}>German Scale</div>
            <div style={{ fontSize: "1.1rem", fontWeight: "800", color: liveGermanGrade <= 2.2 ? "#34d399" : "#fbbf24" }}>
              {liveGermanGrade} <span style={{ fontSize: "0.75rem", fontWeight: "400" }}>(1.0 is max)</span>
            </div>
          </div>

          <div style={{ height: "24px", width: "1px", background: "rgba(255,255,255,0.15)" }}></div>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase" }}>US 4.0 GPA</div>
            <div style={{ fontSize: "1.1rem", fontWeight: "800", color: liveUSGPA >= 3.0 ? "#34d399" : "#fbbf24" }}>
              {liveUSGPA} / 4.0
            </div>
          </div>
        </div>
      </div>

      {/* Step Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border-subtle)", marginBottom: "28px", gap: "8px" }}>
        <button
          type="button"
          onClick={() => setStep(1)}
          style={{
            background: "none",
            border: "none",
            borderBottom: step === 1 ? "2px solid #2563eb" : "2px solid transparent",
            padding: "10px 16px",
            color: step === 1 ? "#2563eb" : "var(--text-secondary)",
            fontWeight: step === 1 ? "700" : "500",
            fontSize: "0.92rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <GraduationCap size={18} color={step === 1 ? "#2563eb" : "var(--text-muted)"} />
          <span>1. Academic Background</span>
        </button>

        <button
          type="button"
          onClick={() => setStep(2)}
          style={{
            background: "none",
            border: "none",
            borderBottom: step === 2 ? "2px solid #2563eb" : "2px solid transparent",
            padding: "10px 16px",
            color: step === 2 ? "#2563eb" : "var(--text-secondary)",
            fontWeight: step === 2 ? "700" : "500",
            fontSize: "0.92rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <FileCheck size={18} color={step === 2 ? "#2563eb" : "var(--text-muted)"} />
          <span>2. Scores & Tests</span>
        </button>

        <button
          type="button"
          onClick={() => setStep(3)}
          style={{
            background: "none",
            border: "none",
            borderBottom: step === 3 ? "2px solid #2563eb" : "2px solid transparent",
            padding: "10px 16px",
            color: step === 3 ? "#2563eb" : "var(--text-secondary)",
            fontWeight: step === 3 ? "700" : "500",
            fontSize: "0.92rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <Wallet size={18} color={step === 3 ? "#2563eb" : "var(--text-muted)"} />
          <span>3. Financials & Visa Solvency</span>
        </button>
      </div>

      <form onSubmit={handleFormSubmit}>
        
        {/* ================= STEP 1: ACADEMIC BACKGROUND ================= */}
        {step === 1 && (
          <div className="animate-fade-in">
            <div className="grid-2">
              
              <div className="form-group">
                <label className="form-label">
                  Target Destination Country
                  <span className="form-hint">Public Universities Target</span>
                </label>
                <select 
                  className="form-select"
                  value={formData.targetCountry}
                  onChange={(e) => handleChange("targetCountry", e.target.value)}
                >
                  <option value="All EU Countries">🇪🇺 All 27 EU Countries (Unbiased 129+ Public Programs Across EU)</option>
                  <optgroup label="🇪🇺 The 27 EU Member States">
                    <option value="Austria">🇦🇹 Austria (TU Wien, Uni Vienna, TU Graz)</option>
                    <option value="Belgium">🇧🇪 Belgium (KU Leuven, Ghent, VUB Brussels)</option>
                    <option value="Bulgaria">🇧🇬 Bulgaria (Sofia University St. Kliment Ohridski)</option>
                    <option value="Croatia">🇭🇷 Croatia (University of Zagreb)</option>
                    <option value="Cyprus">🇨🇾 Cyprus (University of Cyprus)</option>
                    <option value="Czechia">🇨🇿 Czechia (CTU Prague, Charles, Masaryk)</option>
                    <option value="Denmark">🇩🇰 Denmark (DTU, Aarhus, Aalborg, SDU)</option>
                    <option value="Estonia">🇪🇪 Estonia (University of Tartu, TalTech)</option>
                    <option value="Finland">🇫🇮 Finland (Aalto, Helsinki, Tampere, Oulu)</option>
                    <option value="France">🇫🇷 France (Paris-Saclay, PSL, IP Paris, Sorbonne)</option>
                    <option value="Germany">🇩🇪 Germany (TUM, RWTH Aachen, Stuttgart, Dresden)</option>
                    <option value="Greece">🇬🇷 Greece (NTUA Athens, NKUA, AUTH)</option>
                    <option value="Hungary">🇭🇺 Hungary (BME Budapest, Szeged, ELTE)</option>
                    <option value="Ireland">🇮🇪 Ireland (Trinity Dublin, UCD, Galway, UCC)</option>
                    <option value="Italy">🇮🇹 Italy (PoliMi, PoliTo, Bologna, Padua, Sapienza)</option>
                    <option value="Latvia">🇱🇻 Latvia (Riga Technical University - RTU)</option>
                    <option value="Lithuania">🇱🇹 Lithuania (Vilnius University, KTU)</option>
                    <option value="Luxembourg">🇱🇺 Luxembourg (University of Luxembourg)</option>
                    <option value="Malta">🇲🇹 Malta (University of Malta)</option>
                    <option value="Netherlands">🇳🇱 Netherlands (TU Delft, UvA, TU/e, Leiden)</option>
                    <option value="Poland">🇵🇱 Poland (Warsaw Tech, AGH Krakow, Wrocław Tech)</option>
                    <option value="Portugal">🇵🇹 Portugal (IST Lisbon, Porto, Coimbra, NOVA)</option>
                    <option value="Romania">🇷🇴 Romania (Politehnica Bucharest, Babeș-Bolyai)</option>
                    <option value="Slovakia">🇸🇰 Slovakia (STU Bratislava)</option>
                    <option value="Slovenia">🇸🇮 Slovenia (University of Ljubljana)</option>
                    <option value="Spain">🇪🇸 Spain (UPC BarcelonaTech, UPM, UC3M, UAM)</option>
                    <option value="Sweden">🇸🇪 Sweden (KTH, Chalmers, Lund, Uppsala)</option>
                  </optgroup>
                  <optgroup label="🌐 Global Higher Education Hubs">
                    <option value="UK">🇬🇧 United Kingdom (Russell Group & Public Research)</option>
                    <option value="USA">🇺🇸 USA (Public Flagship & Research Unis)</option>
                    <option value="Canada">🇨🇦 Canada (Public DLI Universities)</option>
                    <option value="Australia">🇦🇺 Australia (Group of Eight & ATN)</option>
                    <option value="New Zealand">🇳🇿 New Zealand (Public Universities)</option>
                    <option value="Switzerland">🇨🇭 Switzerland (ETH Zurich, EPFL)</option>
                  </optgroup>
                </select>
              </div>

              {/* Dynamic Maximum Annual Tuition Budget Slider */}
              <div className="form-group">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>
                    Maximum Annual Tuition
                    <span className="form-hint">Interactive Financial Boundary</span>
                  </label>
                  <span style={{ 
                    fontSize: "0.82rem", 
                    fontWeight: "800", 
                    color: formData.maxAnnualTuition === 0 ? "#34d399" : formData.maxAnnualTuition < 30000 ? "#60a5fa" : "#94a3b8",
                    background: formData.maxAnnualTuition === 0 ? "rgba(16, 185, 129, 0.15)" : "rgba(37, 99, 235, 0.15)",
                    padding: "2px 8px",
                    borderRadius: "6px"
                  }}>
                    {formData.maxAnnualTuition === 0 
                      ? "€0 / yr (Free Only)" 
                      : formData.maxAnnualTuition >= 30000 
                        ? "Any Tuition Bracket" 
                        : `≤ €${formData.maxAnnualTuition.toLocaleString()} / yr`}
                  </span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="30000"
                  step="500"
                  value={formData.maxAnnualTuition ?? 30000}
                  onChange={(e) => handleChange("maxAnnualTuition", Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#3b82f6", cursor: "pointer", marginTop: "8px" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "3px" }}>
                  <span>€0 (Free)</span>
                  <span>€5,000 (Low)</span>
                  <span>€15,000 (Moderate)</span>
                  <span>Any (€30,000+)</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Target Degree Level</label>
                <select 
                  className="form-select"
                  value={formData.degreeTarget}
                  onChange={(e) => handleChange("degreeTarget", e.target.value)}
                >
                  <option value="Master's">Master's Degree (M.Sc / MEng / MS)</option>
                  <option value="Bachelor's">Bachelor's Degree (B.Sc / B.Eng)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Degree Discipline / Field</label>
                <select 
                  className="form-select"
                  value={formData.backgroundField}
                  onChange={(e) => handleChange("backgroundField", e.target.value)}
                >
                  <option value="Computer Science">Computer Science / Software Engineering</option>
                  <option value="Data Science">Data Science / Artificial Intelligence</option>
                  <option value="Information Systems">Management Information Systems (MIS)</option>
                  <option value="Mechanical Engineering">Mechanical / Automotive Engineering</option>
                  <option value="Electrical Engineering">Electrical / Embedded Systems</option>
                  <option value="Civil Engineering">Civil & Structural Engineering</option>
                  <option value="Biotechnology">Biotechnology / Life Sciences</option>
                  <option value="Business Analytics">Business Analytics / Finance</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Undergraduate College Tier (India)
                  <span className="form-hint">Recognized by Anabin / WES</span>
                </label>
                <select 
                  className="form-select"
                  value={formData.collegeTier}
                  onChange={(e) => handleChange("collegeTier", e.target.value)}
                >
                  <option value="Tier 1 (IIT/NIT/BITS/IISc/Centrally Funded)">Tier 1: IIT / NIT / BITS / IISc / IIIT</option>
                  <option value="Tier 2 (State Govt/Top Autonomous/Vellore/Manipal)">Tier 2: State Govt Colleges / Top Autonomous / VIT / Manipal</option>
                  <option value="Tier 3 (University Affiliated Colleges)">Tier 3: University Affiliated Private Colleges</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Current CGPA (out of 10.0)
                  <span style={{ color: "#60a5fa", fontWeight: "700" }}>{formData.currentCGPA} / 10</span>
                </label>
                <input 
                  type="range"
                  min="5.0"
                  max="10.0"
                  step="0.05"
                  value={formData.currentCGPA}
                  onChange={(e) => handleChange("currentCGPA", parseFloat(e.target.value))}
                  style={{ width: "100%", accentColor: "#2563eb", cursor: "pointer", height: "8px" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  <span>5.0 (Pass)</span>
                  <span>7.0 (Average)</span>
                  <span>8.5 (Distinction)</span>
                  <span>10.0 (Gold)</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Total Academic Backlogs (History)
                  <span className="form-hint">Crucial for Australia / Canada</span>
                </label>
                <select 
                  className="form-select"
                  value={formData.backlogs}
                  onChange={(e) => handleChange("backlogs", parseInt(e.target.value))}
                >
                  <option value="0">0 Backlogs (Clean record)</option>
                  <option value="1">1 Backlog (Cleared)</option>
                  <option value="2">2 Backlogs (Cleared)</option>
                  <option value="3">3 Backlogs (Cleared)</option>
                  <option value="4">4 - 5 Backlogs (Moderate risk for Aus/Can)</option>
                  <option value="8">6+ Backlogs (High risk for Aus/Can)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Relevant Work Experience (Years)</label>
                <input 
                  type="number"
                  min="0"
                  max="15"
                  step="0.5"
                  className="form-input"
                  value={formData.workExperienceYears}
                  onChange={(e) => handleChange("workExperienceYears", parseFloat(e.target.value))}
                  placeholder="e.g. 1.5"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Research Papers (IEEE / Scopus Indexed)</label>
                <input 
                  type="number"
                  min="0"
                  max="10"
                  className="form-input"
                  value={formData.researchPapersCount}
                  onChange={(e) => handleChange("researchPapersCount", parseInt(e.target.value))}
                  placeholder="e.g. 0 or 1"
                />
              </div>

            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
              <button 
                type="button" 
                onClick={() => setStep(2)} 
                className="btn btn-primary"
              >
                <span>Continue to Standardized Tests</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: STANDARDIZED SCORES ================= */}
        {step === 2 && (
          <div className="animate-fade-in">
            <div className="grid-2">
              
              <div className="form-group">
                <label className="form-label">
                  IELTS Overall Band Score
                  <span style={{ color: "#34d399", fontWeight: "700" }}>{formData.ieltsScore}</span>
                </label>
                <select 
                  className="form-select"
                  value={formData.ieltsScore}
                  onChange={(e) => handleChange("ieltsScore", parseFloat(e.target.value))}
                >
                  <option value="6.0">6.0 (Minimum for select bachelor's)</option>
                  <option value="6.5">6.5 (Standard public university cutoff)</option>
                  <option value="7.0">7.0 (Competitive cutoff)</option>
                  <option value="7.5">7.5 (Top tier / Ivy / Russell Group)</option>
                  <option value="8.0">8.0+ (Superior)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Lowest Individual IELTS Band
                  <span className="form-hint">E.g., min 6.0 in each band</span>
                </label>
                <select 
                  className="form-select"
                  value={formData.ieltsBandMin}
                  onChange={(e) => handleChange("ieltsBandMin", parseFloat(e.target.value))}
                >
                  <option value="5.5">5.5 (Below cutoff for direct admit)</option>
                  <option value="6.0">6.0 (Meets most university criteria)</option>
                  <option value="6.5">6.5 (Meets strict top programs)</option>
                  <option value="7.0">7.0 (Flawless)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  GRE Quantitative Score (130 - 170)
                  <span className="form-hint">Offsets average CGPA</span>
                </label>
                <input 
                  type="number"
                  min="130"
                  max="170"
                  className="form-input"
                  value={formData.greQuant}
                  onChange={(e) => {
                    const q = parseInt(e.target.value) || 0;
                    handleChange("greQuant", q);
                    handleChange("greTotal", q + Number(formData.greVerbal));
                  }}
                  placeholder="e.g. 165"
                />
              </div>

              <div className="form-group">
                <label className="form-label">GRE Verbal Score (130 - 170)</label>
                <input 
                  type="number"
                  min="130"
                  max="170"
                  className="form-input"
                  value={formData.greVerbal}
                  onChange={(e) => {
                    const v = parseInt(e.target.value) || 0;
                    handleChange("greVerbal", v);
                    handleChange("greTotal", Number(formData.greQuant) + v);
                  }}
                  placeholder="e.g. 152"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Total GRE Score (Calculated)</label>
                <input 
                  type="text"
                  readOnly
                  className="form-input"
                  value={`${formData.greTotal} / 340`}
                  style={{ background: "rgba(255,255,255,0.03)", color: "#60a5fa", fontWeight: "700" }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  German Language Level (CEFR)
                  <span className="form-hint">Unlocks 5x more German programs</span>
                </label>
                <select 
                  className="form-select"
                  value={formData.germanLanguageLevel}
                  onChange={(e) => handleChange("germanLanguageLevel", e.target.value)}
                >
                  <option value="None">None (100% English Taught only)</option>
                  <option value="A1 (Basic)">A1: Basic beginner</option>
                  <option value="A2 (Elementary)">A2: Elementary Goethe-Zertifikat</option>
                  <option value="B1 (Intermediate)">B1: Intermediate (Massive advantage!)</option>
                  <option value="B2 (Vantage)">B2 / C1: Advanced (Eligible for bilingual)</option>
                </select>
              </div>

            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="btn btn-secondary"
              >
                Back
              </button>
              <button 
                type="button" 
                onClick={() => setStep(3)} 
                className="btn btn-primary"
              >
                <span>Continue to Financials & Visa</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: FINANCIALS & VISA SOLVENCY ================= */}
        {step === 3 && (
          <div className="animate-fade-in">
            
            <div style={{ 
              background: "rgba(16, 185, 129, 0.08)", 
              border: "1px solid rgba(16, 185, 129, 0.2)", 
              borderRadius: "12px", 
              padding: "14px", 
              marginBottom: "20px",
              fontSize: "0.85rem",
              color: "#a7f3d0"
            }}>
              💡 <strong>Indian Student Visa Solvency Check:</strong> Embassies in Germany, USA, Canada, and Australia scrutinize ITRs and the seasoning of liquid funds. Ensure your declared savings correspond to your family's tax history.
            </div>

            <div className="grid-2">
              
              <div className="form-group">
                <label className="form-label">
                  Annual Family Income (INR ₹)
                  <span className="form-hint">Sponsors' Combined Annual Gross</span>
                </label>
                <input 
                  type="number"
                  step="50000"
                  className="form-input"
                  value={formData.annualFamilyIncomeINR}
                  onChange={(e) => handleChange("annualFamilyIncomeINR", parseInt(e.target.value))}
                  placeholder="e.g. 900000 (9 Lakhs)"
                />
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  Approx ₹{(formData.annualFamilyIncomeINR / 100000).toFixed(1)} Lakhs / year
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Income Tax Returns (ITR) Filed
                  <span className="form-hint">ITR-V / Form 16 Available</span>
                </label>
                <select 
                  className="form-select"
                  value={formData.itrYearsAvailable}
                  onChange={(e) => handleChange("itrYearsAvailable", parseInt(e.target.value))}
                >
                  <option value="3">3 Consecutive Assessment Years (Strongest)</option>
                  <option value="2">2 Assessment Years (Acceptable)</option>
                  <option value="1">1 Assessment Year (Moderate refusal risk)</option>
                  <option value="0">0 Years / No ITR Filed (High refusal risk)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Available Liquid Bank Savings (INR ₹)
                  <span className="form-hint">Savings Account Balance</span>
                </label>
                <input 
                  type="number"
                  step="50000"
                  className="form-input"
                  value={formData.liquidSavingsINR}
                  onChange={(e) => handleChange("liquidSavingsINR", parseInt(e.target.value))}
                  placeholder="e.g. 1200000 (12 Lakhs)"
                />
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  Approx ₹{(formData.liquidSavingsINR / 100000).toFixed(1)} Lakhs
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Fixed Deposits (FDs) (INR ₹)
                  <span className="form-hint">With bank verification seal</span>
                </label>
                <input 
                  type="number"
                  step="50000"
                  className="form-input"
                  value={formData.fixedDepositsINR}
                  onChange={(e) => handleChange("fixedDepositsINR", parseInt(e.target.value))}
                  placeholder="e.g. 400000 (4 Lakhs)"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Sanctioned Education Loan Amount (INR ₹)
                  <span className="form-hint">0 if not applicable</span>
                </label>
                <input 
                  type="number"
                  step="100000"
                  className="form-input"
                  value={formData.loanSanctionedINR}
                  onChange={(e) => handleChange("loanSanctionedINR", parseInt(e.target.value))}
                  placeholder="e.g. 2000000 (20 Lakhs)"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Education Loan Bank Type</label>
                <select 
                  className="form-select"
                  value={formData.loanBankType}
                  onChange={(e) => handleChange("loanBankType", e.target.value)}
                >
                  <option value="None / Not Applied Yet">None / Self-Funded</option>
                  <option value="Public Sector Bank (SBI / Canara / BoB)">Public Sector Bank (SBI Global Ed-Vantage / Canara / BoB - Preferred)</option>
                  <option value="Private Scheduled Bank (HDFC Credila / Axis / ICICI)">Private Scheduled Bank (HDFC Credila / Axis / ICICI)</option>
                  <option value="Unsecured NBFC (Avanse / InCred / LeapFinance)">Unsecured NBFC (Higher visa scrutiny in Aus/US)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Immovable Property Valuation (INR ₹)
                  <span className="form-hint">Home, Land, Commercial ties</span>
                </label>
                <input 
                  type="number"
                  step="500000"
                  className="form-input"
                  value={formData.immovablePropertyValuationINR}
                  onChange={(e) => handleChange("immovablePropertyValuationINR", parseInt(e.target.value))}
                  placeholder="e.g. 3500000"
                />
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  Approx ₹{(formData.immovablePropertyValuationINR / 100000).toFixed(1)} Lakhs (Mitigates US 214(b))
                </span>
              </div>

              {formData.targetCountry === "Germany" && (
                <div className="form-group" style={{ background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "10px" }}>
                  <label className="form-label" style={{ marginBottom: "6px" }}>
                    APS India Certificate Status
                    <span className="badge badge-reach">Mandatory for Germany</span>
                  </label>
                  <div style={{ display: "flex", gap: "16px", marginTop: "4px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "0.85rem" }}>
                      <input 
                        type="radio" 
                        name="apsStatus"
                        checked={formData.hasApsCertificate === true} 
                        onChange={() => handleChange("hasApsCertificate", true)}
                      />
                      <span>Yes, Applied / Received</span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "0.85rem" }}>
                      <input 
                        type="radio" 
                        name="apsStatus"
                        checked={formData.hasApsCertificate === false} 
                        onChange={() => handleChange("hasApsCertificate", false)}
                      />
                      <span style={{ color: "#f87171" }}>No, Not yet applied</span>
                    </label>
                  </div>
                </div>
              )}

            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px" }}>
              <button 
                type="button" 
                onClick={() => setStep(2)} 
                className="btn btn-secondary"
              >
                Back
              </button>
              
              <button 
                type="submit" 
                disabled={isLoading}
                className="btn btn-emerald pulse-glow"
                style={{ padding: "12px 28px", fontSize: "1.05rem" }}
              >
                <Sparkles size={18} />
                <span>{isLoading ? "Evaluating Profile Across Official Portals..." : "Calculate Admission & Visa Eligibility"}</span>
              </button>
            </div>

          </div>
        )}

      </form>
    </div>
  );
}
