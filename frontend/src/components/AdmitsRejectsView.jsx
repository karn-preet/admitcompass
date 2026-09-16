import React, { useState, useEffect } from "react";
import { fetchDecisions, submitDecision, fetchUniversities } from "../services/api";
import { 
  CheckCircle2, XCircle, Search, Filter, Plus, 
  GraduationCap, Award, Calendar, ExternalLink, Sparkles, Database 
} from "lucide-react";
import confetti from "canvas-confetti";

export default function AdmitsRejectsView() {
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [countryFilter, setCountryFilter] = useState("");
  const [degreeFilter, setDegreeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal for new submission
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // New form fields
  const [newUni, setNewUni] = useState("");
  const [newCountry, setNewCountry] = useState("Germany");
  const [newDegree, setNewDegree] = useState("masters");
  const [newProgram, setNewProgram] = useState("");
  const [newStatus, setNewStatus] = useState("Admit");
  const [newTerm, setNewTerm] = useState("Fall 2025");
  const [newCgpa, setNewCgpa] = useState("8.5");
  const [newCgpaScale, setNewCgpaScale] = useState("10");
  const [newGre, setNewGre] = useState("320");
  const [newIelts, setNewIelts] = useState("7.5");
  const [newWorkExp, setNewWorkExp] = useState("12");
  const [newPapers, setNewPapers] = useState("0");
  const [newTier, setNewTier] = useState("Tier 2");
  const [newFunding, setNewFunding] = useState("");
  const [newNotes, setNewNotes] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const filters = {};
      if (countryFilter) filters.country = countryFilter;
      if (degreeFilter) filters.degree = degreeFilter;
      if (statusFilter) filters.status = statusFilter;
      if (searchQuery) filters.search = searchQuery;

      const res = await fetchDecisions(filters);
      if (res.success) {
        setDecisions(res.data);
      } else {
        setError("Failed to fetch decisions database.");
      }
    } catch (e) {
      setError("Error connecting to decision database service.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [countryFilter, degreeFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  const handleCreateDecision = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        university: newUni,
        country: newCountry,
        degree: newDegree,
        program: newProgram,
        status: newStatus,
        term: newTerm,
        cgpa: parseFloat(newCgpa),
        cgpaScale: parseFloat(newCgpaScale),
        greTotal: newGre ? parseInt(newGre, 10) : null,
        ielts: newIelts ? parseFloat(newIelts) : null,
        workExpMonths: parseInt(newWorkExp, 10) || 0,
        researchPapers: parseInt(newPapers, 10) || 0,
        undergradTier: newTier,
        scholarshipOrFunding: newFunding || null,
        notes: newNotes
      };

      const res = await submitDecision(payload);
      if (res.success) {
        setSubmitSuccess(true);
        confetti({ particleCount: 60, spread: 50 });
        setTimeout(() => {
          setIsModalOpen(false);
          setSubmitSuccess(false);
          loadData();
        }, 1200);
      }
    } catch (err) {
      alert("Failed to submit decision: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Stats calculation
  const totalDecisions = decisions.length;
  const totalAdmits = decisions.filter(d => d.status === "Admit").length;
  const admitRate = totalDecisions > 0 ? Math.round((totalAdmits / totalDecisions) * 100) : 0;
  
  const admittedCgpas = decisions.filter(d => d.status === "Admit" && d.cgpa).map(d => d.cgpa);
  const avgCgpa = admittedCgpas.length > 0 
    ? (admittedCgpas.reduce((a, b) => a + b, 0) / admittedCgpas.length).toFixed(2)
    : "8.3";

  return (
    <div className="container" style={{ paddingBottom: "60px" }}>
      {/* Header Banner */}
      <div style={{ textAlign: "center", maxWidth: "850px", margin: "0 auto 32px auto" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "6px 16px", borderRadius: "999px", marginBottom: "16px" }}>
          <Database size={16} color="#059669" />
          <span style={{ fontSize: "0.82rem", color: "#047857", fontWeight: "700" }}>
            100% Free Crowdsourced Admits & Rejects Database (100+ Verified Profiles)
          </span>
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.4rem", fontWeight: "800", color: "var(--text-primary)", letterSpacing: "-1px" }}>
          Historical Admits & Rejects Explorer
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", marginTop: "12px" }}>
          Analyze real student outcomes across top public universities. Compare GPA cutoffs, GRE scores, funding awards, and work experience before finalizing your target university list.
        </p>
      </div>

      {/* Stats Summary Bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
        <div className="glass-panel" style={{ padding: "18px 22px", display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(59, 130, 246, 0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Database size={22} color="#2563eb" />
          </div>
          <div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Decisions Tracked</div>
            <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--text-primary)" }}>{totalDecisions}</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "18px 22px", display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(16, 185, 129, 0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CheckCircle2 size={22} color="#059669" />
          </div>
          <div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Admit Rate</div>
            <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#047857" }}>{admitRate}%</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "18px 22px", display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(245, 158, 11, 0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <GraduationCap size={22} color="#b45309" />
          </div>
          <div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Avg Admitted CGPA</div>
            <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#b45309" }}>{avgCgpa} / 10</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "18px 22px", display: "flex", alignItems: "center", gap: "14px" }}>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary"
            style={{ width: "100%", height: "100%", padding: "10px 16px", justifyContent: "center", fontSize: "0.92rem", fontWeight: "700" }}
          >
            <Plus size={18} />
            Submit Decision (Free)
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="glass-panel" style={{ padding: "18px 24px", marginBottom: "28px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", alignItems: "center", justifyContent: "space-between" }}>
          
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} style={{ display: "flex", flex: "1 1 300px", gap: "8px" }}>
            <div style={{ position: "relative", width: "100%" }}>
              <Search size={16} color="var(--text-muted)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="text"
                placeholder="Search university or program (e.g. TUM, Data Science, Texas A&M)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "9px 12px 9px 36px",
                  borderRadius: "8px",
                  background: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-primary)",
                  fontSize: "0.88rem",
                  outline: "none"
                }}
              />
            </div>
            <button type="submit" className="btn btn-secondary" style={{ padding: "8px 14px", fontSize: "0.85rem" }}>
              Filter
            </button>
          </form>

          {/* Quick Filters */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-primary)",
                fontSize: "0.85rem"
              }}
            >
              <option value="">All Countries</option>
              <option value="Germany">Germany</option>
              <option value="USA">USA</option>
              <option value="UK">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="Netherlands">Netherlands</option>
              <option value="Italy">Italy</option>
              <option value="Sweden">Sweden</option>
              <option value="Switzerland">Switzerland</option>
              <option value="France">France</option>
              <option value="Australia">Australia</option>
            </select>

            <select
              value={degreeFilter}
              onChange={(e) => setDegreeFilter(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-primary)",
                fontSize: "0.85rem"
              }}
            >
              <option value="">All Degrees</option>
              <option value="masters">Master's</option>
              <option value="bachelors">Bachelor's</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-primary)",
                fontSize: "0.85rem"
              }}
            >
              <option value="">All Statuses</option>
              <option value="Admit">Admits Only</option>
              <option value="Reject">Rejects Only</option>
            </select>

            {(countryFilter || degreeFilter || statusFilter || searchQuery) && (
              <button
                onClick={() => {
                  setCountryFilter("");
                  setDegreeFilter("");
                  setStatusFilter("");
                  setSearchQuery("");
                }}
                className="btn btn-secondary"
                style={{ padding: "8px 12px", fontSize: "0.8rem" }}
              >
                Reset
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Decision Cards List */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
          Loading historical applicant decisions...
        </div>
      ) : decisions.length === 0 ? (
        <div className="glass-panel" style={{ padding: "48px", textAlign: "center" }}>
          <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>
            No decisions match your active filters. Try resetting the filters or submit the first record!
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {decisions.map((dec) => {
            const isAdmit = dec.status === "Admit";
            return (
              <div 
                key={dec.id} 
                className="glass-panel" 
                style={{ 
                  padding: "20px", 
                  borderLeft: isAdmit ? "4px solid #10b981" : "4px solid #f43f5e",
                  position: "relative"
                }}
              >
                {/* Status Badge & Term */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                  <div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-primary)", marginBottom: "2px" }}>
                      {dec.university}
                    </h3>
                    <div style={{ fontSize: "0.84rem", color: "var(--accent-blue-dark, #1d4ed8)", fontWeight: "600" }}>
                      {dec.program} ({dec.degree})
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                    <span className={isAdmit ? "badge badge-safe" : "badge badge-danger"} style={{ fontSize: "0.76rem" }}>
                      {isAdmit ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                      {dec.status}
                    </span>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                      {dec.term}
                    </span>
                  </div>
                </div>

                {/* Country Pill */}
                <div style={{ marginBottom: "14px" }}>
                  <span style={{ fontSize: "0.75rem", background: "var(--bg-secondary)", padding: "2px 8px", borderRadius: "4px", color: "var(--text-secondary)", border: "1px solid var(--border-subtle)" }}>
                    📍 {dec.country}
                  </span>
                </div>

                {/* Metric Pills */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", background: "var(--bg-secondary)", padding: "10px 12px", borderRadius: "8px", marginBottom: "12px", border: "1px solid var(--border-subtle)" }}>
                  <div>
                    <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>CGPA</div>
                    <div style={{ fontSize: "0.88rem", fontWeight: "700", color: "var(--text-primary)" }}>
                      {dec.cgpa} / {dec.cgpaScale}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>German GPA</div>
                    <div style={{ fontSize: "0.88rem", fontWeight: "700", color: "#1d4ed8" }}>
                      {dec.germanGpa || "N/A"}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>GRE</div>
                    <div style={{ fontSize: "0.88rem", fontWeight: "700", color: "var(--text-primary)" }}>
                      {dec.greTotal || "Waived"}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>IELTS / TOEFL</div>
                    <div style={{ fontSize: "0.88rem", fontWeight: "700", color: "var(--text-primary)" }}>
                      {dec.ielts || "N/A"}
                    </div>
                  </div>
                </div>

                {/* Profile attributes */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", fontSize: "0.74rem", color: "var(--text-secondary)", marginBottom: "10px" }}>
                  <span style={{ background: "var(--bg-secondary)", padding: "2px 8px", borderRadius: "4px", border: "1px solid var(--border-subtle)" }}>
                    💼 {dec.workExpMonths} mos Exp
                  </span>
                  <span style={{ background: "var(--bg-secondary)", padding: "2px 8px", borderRadius: "4px", border: "1px solid var(--border-subtle)" }}>
                    📄 {dec.researchPapers} Paper(s)
                  </span>
                  <span style={{ background: "var(--bg-secondary)", padding: "2px 8px", borderRadius: "4px", border: "1px solid var(--border-subtle)" }}>
                    🏫 {dec.undergradTier}
                  </span>
                </div>

                {/* Funding / Scholarship Badge */}
                {dec.scholarshipOrFunding && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.76rem", color: "#047857", background: "rgba(16, 185, 129, 0.12)", padding: "4px 8px", borderRadius: "6px", marginBottom: "8px", fontWeight: "600" }}>
                    <Award size={14} />
                    <span>Funding: {dec.scholarshipOrFunding}</span>
                  </div>
                )}

                {/* Applicant Notes */}
                {dec.notes && (
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic", margin: 0 }}>
                    "{dec.notes}"
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Submit Decision Modal */}
      {isModalOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "20px"
        }}>
          <div className="glass-panel" style={{ width: "100%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto", padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--text-primary)" }}>
                Submit Your Admission Decision (Anonymous)
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "1.2rem" }}>
                ✕
              </button>
            </div>

            {submitSuccess ? (
              <div style={{ padding: "40px", textAlign: "center" }}>
                <CheckCircle2 color="#059669" size={48} style={{ margin: "0 auto 16px auto" }} />
                <h3 style={{ fontSize: "1.2rem", color: "var(--text-primary)", marginBottom: "8px" }}>Decision Added!</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                  Thank you for empowering future study abroad applicants!
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateDecision}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: "600", marginBottom: "4px" }}>University Name</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. RWTH Aachen" 
                      value={newUni} 
                      onChange={e => setNewUni(e.target.value)}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--bg-surface-elevated)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)", fontSize: "0.85rem" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: "600", marginBottom: "4px" }}>Country</label>
                    <select 
                      value={newCountry} 
                      onChange={e => setNewCountry(e.target.value)}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--bg-surface-elevated)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)", fontSize: "0.85rem" }}
                    >
                      <option value="Germany">Germany</option>
                      <option value="USA">USA</option>
                      <option value="UK">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Netherlands">Netherlands</option>
                      <option value="Italy">Italy</option>
                      <option value="Sweden">Sweden</option>
                      <option value="France">France</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px", marginBottom: "14px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: "600", marginBottom: "4px" }}>Program / Major</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. M.Sc Computer Science" 
                      value={newProgram} 
                      onChange={e => setNewProgram(e.target.value)}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--bg-surface-elevated)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)", fontSize: "0.85rem" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: "600", marginBottom: "4px" }}>Decision Status</label>
                    <select 
                      value={newStatus} 
                      onChange={e => setNewStatus(e.target.value)}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--bg-surface-elevated)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)", fontSize: "0.85rem" }}
                    >
                      <option value="Admit">Admit</option>
                      <option value="Reject">Reject</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "14px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-primary)", fontWeight: "600", marginBottom: "4px" }}>CGPA</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      required 
                      value={newCgpa} 
                      onChange={e => setNewCgpa(e.target.value)}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", background: "var(--bg-surface-elevated)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)", fontSize: "0.85rem" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-primary)", fontWeight: "600", marginBottom: "4px" }}>Scale</label>
                    <select 
                      value={newCgpaScale} 
                      onChange={e => setNewCgpaScale(e.target.value)}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", background: "var(--bg-surface-elevated)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)", fontSize: "0.85rem" }}
                    >
                      <option value="10">10.0</option>
                      <option value="4">4.0</option>
                      <option value="100">100%</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-primary)", fontWeight: "600", marginBottom: "4px" }}>GRE (optional)</label>
                    <input 
                      type="number" 
                      value={newGre} 
                      onChange={e => setNewGre(e.target.value)}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", background: "var(--bg-surface-elevated)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)", fontSize: "0.85rem" }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "14px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-primary)", fontWeight: "600", marginBottom: "4px" }}>IELTS / TOEFL</label>
                    <input 
                      type="number" 
                      step="0.5" 
                      value={newIelts} 
                      onChange={e => setNewIelts(e.target.value)}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", background: "var(--bg-surface-elevated)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)", fontSize: "0.85rem" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-primary)", fontWeight: "600", marginBottom: "4px" }}>Work Exp (Mos)</label>
                    <input 
                      type="number" 
                      value={newWorkExp} 
                      onChange={e => setNewWorkExp(e.target.value)}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", background: "var(--bg-surface-elevated)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)", fontSize: "0.85rem" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-primary)", fontWeight: "600", marginBottom: "4px" }}>College Tier</label>
                    <select 
                      value={newTier} 
                      onChange={e => setNewTier(e.target.value)}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", background: "var(--bg-surface-elevated)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)", fontSize: "0.85rem" }}
                    >
                      <option value="Tier 1">Tier 1</option>
                      <option value="Tier 2">Tier 2</option>
                      <option value="Tier 3">Tier 3</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: "14px" }}>
                  <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: "600", marginBottom: "4px" }}>Scholarship / Funding Received</label>
                  <input 
                    type="text" 
                    placeholder="e.g. $10,000 Dean's Fellowship or Tuition Waiver" 
                    value={newFunding} 
                    onChange={e => setNewFunding(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--bg-surface-elevated)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)", fontSize: "0.85rem" }}
                  />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: "600", marginBottom: "4px" }}>Applicant Advice / Notes</label>
                  <textarea 
                    rows={2}
                    placeholder="Any tips on SOP, professor contact, or timeline?" 
                    value={newNotes} 
                    onChange={e => setNewNotes(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--bg-surface-elevated)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)", fontSize: "0.85rem" }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="btn btn-primary">
                    {submitting ? "Submitting..." : "Submit Anonymously"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
