import React, { useState, useEffect } from "react";
import { calculateRateMyChances, fetchUniversities } from "../services/api";
import { 
  Sparkles, CheckCircle2, AlertTriangle, XCircle, TrendingUp, 
  HelpCircle, ArrowRight, Award, BookOpen, GraduationCap, ChevronRight 
} from "lucide-react";
import confetti from "canvas-confetti";

export default function RateMyChancesView() {
  const [universities, setUniversities] = useState([]);
  const [selectedUniId, setSelectedUniId] = useState("");
  const [degree, setDegree] = useState("masters");
  const [field, setField] = useState("Computer Science");
  const [cgpa, setCgpa] = useState("8.4");
  const [cgpaScale, setCgpaScale] = useState("10");
  const [greTotal, setGreTotal] = useState("320");
  const [ielts, setIelts] = useState("7.5");
  const [workExpMonths, setWorkExpMonths] = useState("18");
  const [researchPapers, setResearchPapers] = useState("1");
  const [undergradTier, setUndergradTier] = useState("Tier 2");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUnis() {
      try {
        const data = await fetchUniversities();
        if (data && data.length > 0) {
          setUniversities(data);
          setSelectedUniId(data[0].id);
        }
      } catch (e) {
        console.error("Failed to load universities list:", e);
      }
    }
    loadUnis();
  }, []);

  const handleCalculate = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const payload = {
        universityId: selectedUniId,
        targetUniversity: selectedUniId,
        degree,
        field,
        cgpa: parseFloat(cgpa) || 8.0,
        cgpaScale: parseFloat(cgpaScale) || 10,
        greTotal: greTotal ? parseInt(greTotal, 10) : 0,
        greQuant: greTotal ? Math.min(170, Math.round(parseInt(greTotal, 10) / 2)) : 160,
        ieltsScore: ielts ? parseFloat(ielts) : 7.0,
        ielts: ielts ? parseFloat(ielts) : 7.0,
        workExperienceYears: (parseInt(workExpMonths, 10) || 0) / 12,
        researchPapersCount: parseInt(researchPapers, 10) || 0,
        undergradTier
      };

      const res = await calculateRateMyChances(payload);
      if (res.success) {
        setResult(res.data);
        const prob = res.data.probabilityPercentage || res.data.calculatedOdds || 60;
        if (prob >= 70) {
          confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        }
      } else {
        setError(res.error || "Could not calculate admission odds.");
      }
    } catch (err) {
      setError(err.message || "Failed to reach odds evaluation engine.");
    } finally {
      setLoading(false);
    }
  };

  const getClassificationBadge = (verdict, badge) => {
    if (badge === "badge-safe" || verdict?.includes("High") || verdict?.includes("Safe")) {
      return <span className="badge badge-safe"><CheckCircle2 size={14} /> {verdict || "Safe Admit"}</span>;
    }
    if (badge === "badge-target" || verdict?.includes("Target") || verdict?.includes("Competitive")) {
      return <span className="badge badge-target"><TrendingUp size={14} /> {verdict || "Realistic Target"}</span>;
    }
    if (badge === "badge-reach" || verdict?.includes("Ambitious") || verdict?.includes("Reach")) {
      return <span className="badge badge-reach"><AlertTriangle size={14} /> {verdict || "Reach / Ambitious"}</span>;
    }
    return <span className="badge badge-danger"><XCircle size={14} /> {verdict || "High Risk"}</span>;
  };

  const getOddsColor = (odds) => {
    if (odds >= 75) return "#34d399";
    if (odds >= 50) return "#60a5fa";
    if (odds >= 30) return "#fbbf24";
    return "#f43f5e";
  };

  const loadPreset = (type) => {
    if (type === "strong") {
      setCgpa("9.2");
      setCgpaScale("10");
      setGreTotal("326");
      setIelts("8.0");
      setWorkExpMonths("24");
      setResearchPapers("2");
      setUndergradTier("Tier 1");
    } else if (type === "average") {
      setCgpa("7.6");
      setCgpaScale("10");
      setGreTotal("310");
      setIelts("7.0");
      setWorkExpMonths("12");
      setResearchPapers("0");
      setUndergradTier("Tier 2");
    } else if (type === "low_cgpa") {
      setCgpa("6.8");
      setCgpaScale("10");
      setGreTotal("322");
      setIelts("7.5");
      setWorkExpMonths("36");
      setResearchPapers("1");
      setUndergradTier("Tier 3");
    }
  };

  const oddsValue = result ? (result.probabilityPercentage ?? result.calculatedOdds ?? 65) : 0;
  const cohort = result?.cohortStats || result?.cohortBenchmarks || {};
  const boosters = result?.boosters || [];
  const activeUni = universities.find(u => u.id === selectedUniId);

  return (
    <div className="container" style={{ paddingBottom: "60px" }}>
      {/* Header Banner */}
      <div style={{ textAlign: "center", maxWidth: "850px", margin: "0 auto 36px auto" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(37, 99, 235, 0.15)", border: "1px solid rgba(59, 130, 246, 0.3)", padding: "6px 16px", borderRadius: "999px", marginBottom: "16px" }}>
          <Sparkles size={16} color="#2563eb" />
          <span style={{ fontSize: "0.82rem", color: "var(--color-primary, #047857)", fontWeight: "600" }}>
            Free Alternative to YMGrad RateMyChances • Zero Credits Required
          </span>
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.4rem", fontWeight: "800", color: "var(--text-primary)", letterSpacing: "-1px" }}>
          Rate My Chances: Single University Admission Odds
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", marginTop: "12px" }}>
          Select any public university across Europe, USA, UK, or Canada. Compare your profile against official minimum admission cutoffs and historical applicant cohorts to maximize your admit probability.
        </p>
      </div>

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", alignItems: "start" }}>
        
        {/* Left Column: Input Form */}
        <div className="glass-panel" style={{ padding: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "10px" }}>
              <GraduationCap color="var(--color-primary, #047857)" size={22} />
              Target University & Profile
            </h3>
            
            <div style={{ display: "flex", gap: "6px" }}>
              <button 
                type="button" 
                onClick={() => loadPreset("strong")} 
                style={{ fontSize: "0.72rem", padding: "4px 8px", background: "rgba(16, 185, 129, 0.15)", border: "1px solid #10b981", color: "#047857", fontWeight: "700", borderRadius: "6px", cursor: "pointer" }}
              >
                Top Profile
              </button>
              <button 
                type="button" 
                onClick={() => loadPreset("average")} 
                style={{ fontSize: "0.72rem", padding: "4px 8px", background: "rgba(59, 130, 246, 0.15)", border: "1px solid #3b82f6", color: "#2563eb", fontWeight: "700", borderRadius: "6px", cursor: "pointer" }}
              >
                Average
              </button>
              <button 
                type="button" 
                onClick={() => loadPreset("low_cgpa")} 
                style={{ fontSize: "0.72rem", padding: "4px 8px", background: "rgba(245, 158, 11, 0.15)", border: "1px solid #f59e0b", color: "#b45309", fontWeight: "700", borderRadius: "6px", cursor: "pointer" }}
              >
                Low CGPA
              </button>
            </div>
          </div>

          <form onSubmit={handleCalculate}>
            {/* Target University */}
            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", fontSize: "0.86rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "6px" }}>
                Target University ({universities.length} available)
              </label>
              <select
                value={selectedUniId}
                onChange={(e) => setSelectedUniId(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  background: "var(--bg-surface, #ffffff)",
                  border: "1px solid var(--border-subtle, #cbd5e1)",
                  color: "var(--text-primary)",
                  fontSize: "0.9rem",
                  outline: "none"
                }}
              >
                {universities.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.country}) — QS #{u.qsRanking || u.qsRank} • {u.tuitionFeeEUR === 0 || u.tuitionEurPerYear === 0 ? "€0 Tuition" : `€${u.tuitionFeeEUR || u.tuitionEurPerYear}/yr`}
                  </option>
                ))}
              </select>

              {/* Live Minimum Cutoffs Card for Selected University */}
              {activeUni && (
                <div style={{
                  marginTop: "12px",
                  padding: "14px",
                  borderRadius: "10px",
                  background: "var(--bg-surface-elevated, #f8fafc)",
                  border: "1.5px solid var(--border-subtle, #e2e8f0)"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "0.78rem", fontWeight: "800", color: "var(--color-primary, #047857)", textTransform: "uppercase", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: "5px" }}>
                      <Award size={14} /> Official Admission Minimum Cutoffs
                    </span>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: "600" }}>
                      Acceptance Rate: {activeUni.acceptanceRate || 25}%
                    </span>
                  </div>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", textAlign: "center" }}>
                    <div style={{ padding: "8px 4px", background: "var(--bg-surface, #ffffff)", borderRadius: "6px", border: "1px solid var(--border-subtle, #e2e8f0)" }}>
                      <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "600" }}>Min CGPA</div>
                      <div style={{ fontSize: "0.95rem", fontWeight: "800", color: "var(--text-primary)" }}>{activeUni.minCGPA10 || 7.0}/10</div>
                      <div style={{ fontSize: "0.68rem", color: "var(--color-primary, #047857)", fontWeight: "700" }}>≤ {activeUni.minGermanGrade || 2.5} DE</div>
                    </div>

                    <div style={{ padding: "8px 4px", background: "var(--bg-surface, #ffffff)", borderRadius: "6px", border: "1px solid var(--border-subtle, #e2e8f0)" }}>
                      <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "600" }}>Min IELTS</div>
                      <div style={{ fontSize: "0.95rem", fontWeight: "800", color: "var(--text-primary)" }}>{activeUni.ieltsMinOverall || 6.5}</div>
                      <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>Band ≥ {activeUni.ieltsMinBand || 6.0}</div>
                    </div>

                    <div style={{ padding: "8px 4px", background: "var(--bg-surface, #ffffff)", borderRadius: "6px", border: "1px solid var(--border-subtle, #e2e8f0)" }}>
                      <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "600" }}>Min TOEFL</div>
                      <div style={{ fontSize: "0.95rem", fontWeight: "800", color: "var(--text-primary)" }}>{activeUni.toeflMin || 85}</div>
                      <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>iBT score</div>
                    </div>

                    <div style={{ padding: "8px 4px", background: "var(--bg-surface, #ffffff)", borderRadius: "6px", border: "1px solid var(--border-subtle, #e2e8f0)" }}>
                      <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "600" }}>Backlogs Max</div>
                      <div style={{ fontSize: "0.95rem", fontWeight: "800", color: (activeUni.maxBacklogsAllowed || 0) === 0 ? "#dc2626" : "var(--text-primary)" }}>
                        {activeUni.maxBacklogsAllowed ?? 3} allowed
                      </div>
                      <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>{activeUni.greRequirement === "Mandatory" ? "GRE Req" : "GRE Opt"}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Degree & Field */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "18px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.86rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "6px" }}>
                  Degree Level
                </label>
                <select
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    background: "var(--bg-surface, #ffffff)",
                    border: "1px solid var(--border-subtle, #cbd5e1)",
                    color: "var(--text-primary)",
                    fontSize: "0.9rem"
                  }}
                >
                  <option value="masters">Master's (M.Sc / MS)</option>
                  <option value="bachelors">Bachelor's (B.Sc / BS)</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.86rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "6px" }}>
                  Field of Study
                </label>
                <select
                  value={field}
                  onChange={(e) => setField(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    background: "var(--bg-surface, #ffffff)",
                    border: "1px solid var(--border-subtle, #cbd5e1)",
                    color: "var(--text-primary)",
                    fontSize: "0.9rem"
                  }}
                >
                  <option value="Computer Science">Computer Science / Data / AI</option>
                  <option value="Mechanical Engineering">Mechanical / Mechatronics</option>
                  <option value="Electrical Engineering">Electrical / Electronics</option>
                  <option value="Management & Business">Management / Business Analytics</option>
                  <option value="Biotechnology">Biotechnology / Life Sciences</option>
                  <option value="Civil Engineering">Civil & Environmental</option>
                </select>
              </div>
            </div>

            {/* CGPA & Scale */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "14px", marginBottom: "18px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.86rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "6px" }}>
                  Current CGPA
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                  placeholder="e.g. 8.4"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    background: "var(--bg-surface, #ffffff)",
                    border: "1px solid var(--border-subtle, #cbd5e1)",
                    color: "var(--text-primary)",
                    fontSize: "0.9rem"
                  }}
                  required
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.86rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "6px" }}>
                  Scale
                </label>
                <select
                  value={cgpaScale}
                  onChange={(e) => setCgpaScale(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    background: "var(--bg-surface, #ffffff)",
                    border: "1px solid var(--border-subtle, #cbd5e1)",
                    color: "var(--text-primary)",
                    fontSize: "0.9rem"
                  }}
                >
                  <option value="10">10.0 Scale</option>
                  <option value="4">4.0 Scale</option>
                  <option value="100">100% Scale</option>
                </select>
              </div>
            </div>

            {/* Standardized Tests: GRE & IELTS */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "18px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.86rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "6px" }}>
                  GRE Score (Optional)
                </label>
                <input
                  type="number"
                  min="260"
                  max="340"
                  value={greTotal}
                  onChange={(e) => setGreTotal(e.target.value)}
                  placeholder="e.g. 320"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    background: "var(--bg-surface, #ffffff)",
                    border: "1px solid var(--border-subtle, #cbd5e1)",
                    color: "var(--text-primary)",
                    fontSize: "0.9rem"
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.86rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "6px" }}>
                  IELTS Band (Optional)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="4.0"
                  max="9.0"
                  value={ielts}
                  onChange={(e) => setIelts(e.target.value)}
                  placeholder="e.g. 7.5"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    background: "var(--bg-surface, #ffffff)",
                    border: "1px solid var(--border-subtle, #cbd5e1)",
                    color: "var(--text-primary)",
                    fontSize: "0.9rem"
                  }}
                />
              </div>
            </div>

            {/* Work Exp & Research Papers */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "24px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "6px" }}>
                  Work Exp (Mos)
                </label>
                <input
                  type="number"
                  min="0"
                  value={workExpMonths}
                  onChange={(e) => setWorkExpMonths(e.target.value)}
                  placeholder="e.g. 18"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    background: "var(--bg-surface, #ffffff)",
                    border: "1px solid var(--border-subtle, #cbd5e1)",
                    color: "var(--text-primary)",
                    fontSize: "0.88rem"
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "6px" }}>
                  Papers
                </label>
                <input
                  type="number"
                  min="0"
                  value={researchPapers}
                  onChange={(e) => setResearchPapers(e.target.value)}
                  placeholder="e.g. 1"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    background: "var(--bg-surface, #ffffff)",
                    border: "1px solid var(--border-subtle, #cbd5e1)",
                    color: "var(--text-primary)",
                    fontSize: "0.88rem"
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "6px" }}>
                  College Tier
                </label>
                <select
                  value={undergradTier}
                  onChange={(e) => setUndergradTier(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 10px",
                    borderRadius: "8px",
                    background: "var(--bg-surface, #ffffff)",
                    border: "1px solid var(--border-subtle, #cbd5e1)",
                    color: "var(--text-primary)",
                    fontSize: "0.88rem"
                  }}
                >
                  <option value="Tier 1">Tier 1</option>
                  <option value="Tier 2">Tier 2</option>
                  <option value="Tier 3">Tier 3</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: "100%", padding: "14px", fontSize: "1rem", fontWeight: "700" }}
            >
              {loading ? "Calculating Real-time Odds..." : "Calculate Admission Odds (Free)"}
            </button>
          </form>

          {error && (
            <div style={{ marginTop: "16px", padding: "12px", background: "rgba(244, 63, 94, 0.15)", border: "1px solid #f43f5e", borderRadius: "8px", color: "#fb7185", fontSize: "0.85rem" }}>
              {error}
            </div>
          )}
        </div>

        {/* Right Column: Dynamic Odds Gauge & Benchmark Comparison */}
        <div>
          {result ? (
            <div className="glass-panel" style={{ padding: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "700" }}>
                    Admission Odds & Cutoffs Report
                  </span>
                  <h2 style={{ fontSize: "1.35rem", fontWeight: "800", color: "var(--text-primary)", margin: "4px 0" }}>
                    {result.university.name}
                  </h2>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                    {result.university.country} • QS World Rank #{result.university.qsRanking || result.university.qsRank} • {result.university.tuitionDisplay || "Public"}
                  </p>
                </div>
                {getClassificationBadge(result.verdict, result.verdictBadge)}
              </div>

              {/* Odds Circular Gauge Card */}
              <div style={{ 
                background: "var(--bg-surface-elevated, #f8fafc)", 
                borderRadius: "16px", 
                padding: "24px", 
                textAlign: "center", 
                marginBottom: "24px",
                border: "1px solid var(--border-subtle, #e2e8f0)"
              }}>
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "6px" }}>
                  Calculated Acceptance Probability
                </div>
                <div style={{ 
                  fontSize: "3.6rem", 
                  fontWeight: "900", 
                  color: getOddsColor(oddsValue),
                  fontFamily: "var(--font-display)",
                  lineHeight: 1
                }}>
                  {oddsValue}%
                </div>
                
                <div style={{ width: "100%", height: "10px", background: "rgba(0, 0, 0, 0.08)", borderRadius: "999px", margin: "18px 0 10px 0", overflow: "hidden" }}>
                  <div style={{ 
                    width: `${oddsValue}%`, 
                    height: "100%", 
                    background: `linear-gradient(90deg, #2563eb, ${getOddsColor(oddsValue)})`,
                    borderRadius: "999px"
                  }} />
                </div>

                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>
                  Benchmarked against {result.cohortStats?.acceptanceRate || result.university?.acceptanceRate || "historical public"} acceptance rate & minimum cutoffs.
                </p>
              </div>

              {/* Minimum Cutoffs & Cohort Benchmarks Comparison */}
              <h4 style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-primary)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                <BookOpen size={16} color="var(--color-primary, #047857)" />
                Official Minimum Cutoffs vs Admitted Cohort
              </h4>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "20px" }}>
                <div style={{ background: "var(--bg-surface-elevated, #f8fafc)", border: "1px solid var(--border-subtle, #e2e8f0)", borderRadius: "10px", padding: "12px" }}>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: "600" }}>CGPA Cutoff (10-Pt)</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "var(--text-primary)", marginTop: "2px" }}>
                    Min: {result.university.minCGPA10 || activeUni?.minCGPA10 || 7.0}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--color-primary, #047857)", fontWeight: "700", marginTop: "2px" }}>
                    Avg: {cohort.admittedAverageCGPA || result.university.minCGPA10 || 7.5}
                  </div>
                </div>

                <div style={{ background: "var(--bg-surface-elevated, #f8fafc)", border: "1px solid var(--border-subtle, #e2e8f0)", borderRadius: "10px", padding: "12px" }}>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: "600" }}>German Grade Eq.</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "#0284c7", marginTop: "2px" }}>
                    ≤ {result.university.minGermanGrade || activeUni?.minGermanGrade || 2.5}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "2px" }}>
                    Avg: ≤ {cohort.admittedAverageGermanGrade || "2.1"}
                  </div>
                </div>

                <div style={{ background: "var(--bg-surface-elevated, #f8fafc)", border: "1px solid var(--border-subtle, #e2e8f0)", borderRadius: "10px", padding: "12px" }}>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: "600" }}>Language & GRE</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "#b45309", marginTop: "2px" }}>
                    IELTS {result.university.ieltsMinOverall || activeUni?.ieltsMinOverall || 6.5}+
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "2px" }}>
                    Avg Quant: {cohort.admittedAverageGREQuant || 164}+
                  </div>
                </div>
              </div>

              {/* Actionable Boosters */}
              {boosters.length > 0 && (
                <div>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-primary)", marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Award size={16} color="#f59e0b" />
                    Actionable Boosters to Increase Odds
                  </h4>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {boosters.map((b, idx) => (
                      <div 
                        key={idx} 
                        style={{ 
                          display: "flex", 
                          alignItems: "flex-start", 
                          gap: "10px", 
                          padding: "10px 12px", 
                          borderRadius: "8px", 
                          background: "rgba(37, 99, 235, 0.08)", 
                          border: "1px solid rgba(59, 130, 246, 0.2)" 
                        }}
                      >
                        <span style={{ 
                          background: "#2563eb", 
                          color: "#ffffff", 
                          fontSize: "0.72rem", 
                          fontWeight: "700", 
                          padding: "2px 6px", 
                          borderRadius: "4px",
                          whiteSpace: "nowrap"
                        }}>
                          {b.impact}
                        </span>
                        <div>
                          <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-primary)" }}>
                            {b.title}
                          </div>
                          <div style={{ fontSize: "0.76rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                            {b.recommendation}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Direct Website Link */}
              <div style={{ marginTop: "20px" }}>
                <a 
                  href={result.university.officialWebsite || result.university.officialPortalUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ width: "100%", justifyContent: "center", fontSize: "0.84rem" }}
                >
                  Visit Official University Admission Portal
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: "48px 28px", textAlign: "center" }}>
              <div style={{ 
                width: "56px", 
                height: "56px", 
                borderRadius: "14px", 
                background: "rgba(59, 130, 246, 0.1)", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                margin: "0 auto 16px auto"
              }}>
                <TrendingUp color="#2563eb" size={26} />
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "var(--text-primary)", marginBottom: "8px" }}>
                Ready to Check Admission Odds & Minimum Cutoffs
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", maxWidth: "400px", margin: "0 auto 16px auto" }}>
                Select a target university and configure your academic credentials on the left to see your acceptance probability and compare against official admission cutoffs.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
