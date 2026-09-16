import React, { useState } from "react";
import { generateSOP, reviewSOP } from "../services/api";
import { 
  FileText, Wand2, CheckCircle2, AlertCircle, Copy, 
  Download, Sparkles, RefreshCw, BookOpen, Layers, Check 
} from "lucide-react";
import confetti from "canvas-confetti";

export default function AiSopStudioView() {
  const [activeTab, setActiveTab] = useState("generator"); // 'generator' or 'reviewer'

  // Generator State
  const [targetUniversity, setTargetUniversity] = useState("Technical University of Munich");
  const [targetProgram, setTargetProgram] = useState("M.Sc. in Informatics");
  const [degree, setDegree] = useState("masters");
  const [undergradMajor, setUndergradMajor] = useState("B.Tech in Computer Science & Engineering");
  const [undergradUni, setUndergradUni] = useState("NIT Trichy");
  const [notableProject, setNotableProject] = useState("Distributed fault-tolerant cache in Go handling 50k RPS");
  const [careerGoals, setCareerGoals] = useState("Distributed Systems Architect leading high-throughput cloud infrastructure in India");
  const [whyUniversity, setWhyUniversity] = useState("Prof. Alfons Kemper's Chair for Database Systems and TUM's direct collaboration with Siemens AI Lab");
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSop, setGeneratedSop] = useState(null);
  const [genError, setGenError] = useState("");
  const [copied, setCopied] = useState(false);

  // Reviewer State
  const [reviewInputText, setReviewInputText] = useState("");
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewResult, setReviewResult] = useState(null);
  const [reviewError, setReviewError] = useState("");

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setGenError("");
    setGeneratedSop(null);

    try {
      const res = await generateSOP({
        targetUniversity,
        targetProgram,
        degree,
        undergradMajor,
        undergradUni,
        notableProject,
        careerGoals,
        whyUniversity
      });

      if (res.success) {
        setGeneratedSop(res.data);
        confetti({ particleCount: 60, spread: 50 });
      } else {
        setGenError(res.error || "Failed to generate Statement of Purpose.");
      }
    } catch (err) {
      setGenError(err.message || "Error generating SOP.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!reviewInputText.trim()) return;
    setIsReviewing(true);
    setReviewError("");
    setReviewResult(null);

    try {
      const res = await reviewSOP(reviewInputText);
      if (res.success) {
        setReviewResult(res.data);
      } else {
        setReviewError(res.error || "Review failed.");
      }
    } catch (err) {
      setReviewError(err.message || "Error reviewing SOP.");
    } finally {
      setIsReviewing(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadAsTxt = (filename, text) => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="container" style={{ paddingBottom: "60px" }}>
      {/* Header Banner */}
      <div style={{ textAlign: "center", maxWidth: "850px", margin: "0 auto 32px auto" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(139, 92, 246, 0.12)", border: "1px solid rgba(139, 92, 246, 0.3)", padding: "6px 16px", borderRadius: "999px", marginBottom: "16px" }}>
          <Sparkles size={16} color="#7c3aed" />
          <span style={{ fontSize: "0.82rem", color: "#6d28d9", fontWeight: "700" }}>
            Free Alternative to YMGrad SOP Studio • Unlimited Generations & Reviews
          </span>
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.4rem", fontWeight: "800", color: "var(--text-primary)", letterSpacing: "-1px" }}>
          AI Statement of Purpose (SOP) Studio
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", marginTop: "12px" }}>
          Draft tailored, academically grounded SOPs for admissions committees, or audit your existing drafts for clichés, weak hooks, and institutional specificity.
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}>
        <div style={{ background: "var(--bg-surface-elevated)", padding: "4px", borderRadius: "12px", border: "1px solid var(--border-subtle)", display: "flex", gap: "4px" }}>
          <button
            onClick={() => setActiveTab("generator")}
            style={{
              padding: "10px 24px",
              borderRadius: "8px",
              fontSize: "0.92rem",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: activeTab === "generator" ? "#2563eb" : "transparent",
              color: activeTab === "generator" ? "#ffffff" : "var(--text-secondary)",
              border: "none",
              transition: "all 0.2s ease"
            }}
          >
            <Wand2 size={16} />
            SOP Generator
          </button>

          <button
            onClick={() => setActiveTab("reviewer")}
            style={{
              padding: "10px 24px",
              borderRadius: "8px",
              fontSize: "0.92rem",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: activeTab === "reviewer" ? "#2563eb" : "transparent",
              color: activeTab === "reviewer" ? "#ffffff" : "var(--text-secondary)",
              border: "none",
              transition: "all 0.2s ease"
            }}
          >
            <FileText size={16} />
            SOP Reviewer & Cliché Auditor
          </button>
        </div>
      </div>

      {/* TAB 1: SOP GENERATOR */}
      {activeTab === "generator" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "32px", alignItems: "start" }}>
          
          {/* Input Form */}
          <div className="glass-panel" style={{ padding: "28px" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "var(--text-primary)", marginBottom: "18px", display: "flex", alignItems: "center", gap: "10px" }}>
              <Layers color="#2563eb" size={20} />
              Applicant Profile & Academic Alignment
            </h3>

            <form onSubmit={handleGenerate}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: "600", marginBottom: "4px" }}>Target University</label>
                  <input
                    type="text"
                    required
                    value={targetUniversity}
                    onChange={e => setTargetUniversity(e.target.value)}
                    placeholder="e.g. TUM / TU Delft / CMU"
                    style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", background: "var(--bg-surface-elevated)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)", fontSize: "0.85rem" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: "600", marginBottom: "4px" }}>Target Program</label>
                  <input
                    type="text"
                    required
                    value={targetProgram}
                    onChange={e => setTargetProgram(e.target.value)}
                    placeholder="e.g. M.Sc Computer Science"
                    style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", background: "var(--bg-surface-elevated)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)", fontSize: "0.85rem" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: "600", marginBottom: "4px" }}>Undergrad Major</label>
                  <input
                    type="text"
                    required
                    value={undergradMajor}
                    onChange={e => setUndergradMajor(e.target.value)}
                    placeholder="e.g. B.Tech Computer Engineering"
                    style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", background: "var(--bg-surface-elevated)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)", fontSize: "0.85rem" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: "600", marginBottom: "4px" }}>Undergrad College</label>
                  <input
                    type="text"
                    required
                    value={undergradUni}
                    onChange={e => setUndergradUni(e.target.value)}
                    placeholder="e.g. Anna University / VIT"
                    style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", background: "var(--bg-surface-elevated)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)", fontSize: "0.85rem" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: "600", marginBottom: "4px" }}>Key Technical Project / Research Highlight</label>
                <textarea
                  rows={2}
                  required
                  value={notableProject}
                  onChange={e => setNotableProject(e.target.value)}
                  placeholder="Describe technical stack, problem solved, and quantitative metrics (e.g. reduced latency by 35%)."
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", background: "var(--bg-surface-elevated)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)", fontSize: "0.85rem" }}
                />
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: "600", marginBottom: "4px" }}>Long-term Career Vision</label>
                <textarea
                  rows={2}
                  required
                  value={careerGoals}
                  onChange={e => setCareerGoals(e.target.value)}
                  placeholder="Where do you see yourself 5 years post graduation? Industry role or PhD?"
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", background: "var(--bg-surface-elevated)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)", fontSize: "0.85rem" }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: "600", marginBottom: "4px" }}>Specific Faculty / Labs at Target Uni</label>
                <input
                  type="text"
                  value={whyUniversity}
                  onChange={e => setWhyUniversity(e.target.value)}
                  placeholder="e.g. Prof. X's Distributed Systems Lab and elective in Cloud Architecture"
                  style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", background: "var(--bg-surface-elevated)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)", fontSize: "0.85rem" }}
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="btn btn-primary"
                style={{ width: "100%", padding: "14px", fontSize: "0.95rem", fontWeight: "700" }}
              >
                {isGenerating ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    <RefreshCw className="spin" size={16} /> Generating Tailored Academic SOP...
                  </span>
                ) : (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    <Wand2 size={16} /> Generate Statement of Purpose (Free)
                  </span>
                )}
              </button>
            </form>

            {genError && (
              <div style={{ marginTop: "16px", padding: "12px", background: "rgba(244, 63, 94, 0.15)", border: "1px solid #f43f5e", borderRadius: "8px", color: "#fb7185", fontSize: "0.85rem" }}>
                {genError}
              </div>
            )}
          </div>

          {/* Generated Result Display */}
          <div>
            {generatedSop ? (
              <div className="glass-panel" style={{ padding: "28px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "14px" }}>
                  <div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "var(--text-primary)" }}>
                      Generated Statement of Purpose
                    </h3>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      ~{generatedSop.wordCount} words • Optimized for {targetUniversity}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => copyToClipboard(generatedSop.fullText)}
                      className="btn btn-secondary"
                      style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                    >
                      {copied ? <Check size={14} color="#059669" /> : <Copy size={14} />}
                      {copied ? "Copied!" : "Copy"}
                    </button>

                    <button
                      onClick={() => downloadAsTxt(`SOP_${targetUniversity.replace(/\s+/g, "_")}.txt`, generatedSop.fullText)}
                      className="btn btn-secondary"
                      style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                    >
                      <Download size={14} />
                      Download
                    </button>
                  </div>
                </div>

                {/* SOP Paragraphs */}
                <div style={{ 
                  background: "var(--bg-surface-elevated)", 
                  padding: "20px", 
                  borderRadius: "10px", 
                  maxHeight: "550px", 
                  overflowY: "auto", 
                  border: "1px solid var(--border-subtle)",
                  fontSize: "0.9rem",
                  lineHeight: 1.7,
                  color: "var(--text-primary)",
                  whiteSpace: "pre-line"
                }}>
                  {generatedSop.fullText}
                </div>

                <div style={{ marginTop: "14px", fontSize: "0.78rem", color: "var(--text-muted)", textAlign: "center" }}>
                  💡 Tip: Review professors' latest publications and insert specific papers into paragraph 4 before submitting.
                </div>
              </div>
            ) : (
              <div className="glass-panel" style={{ padding: "48px 24px", textAlign: "center" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: "rgba(139, 92, 246, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px auto" }}>
                  <FileText color="#7c3aed" size={26} />
                </div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "var(--text-primary)", marginBottom: "8px" }}>
                  Ready to Craft Your SOP
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", maxWidth: "380px", margin: "0 auto" }}>
                  Fill in your target university and key achievements on the left to create a compelling, non-generic academic Statement of Purpose.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: SOP REVIEWER & CLICHÉ AUDITOR */}
      {activeTab === "reviewer" && (
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "32px", alignItems: "start" }}>
          
          {/* Paste Form */}
          <div className="glass-panel" style={{ padding: "28px" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "var(--text-primary)", marginBottom: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
              <FileText color="#2563eb" size={20} />
              Paste Your Draft Statement of Purpose
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem", marginBottom: "16px" }}>
              Our review engine scans for overused clichés ("since childhood", "stepping stone"), calculates paragraph specificity, and verifies academic hook strength.
            </p>

            <form onSubmit={handleReview}>
              <textarea
                rows={14}
                required
                value={reviewInputText}
                onChange={e => setReviewInputText(e.target.value)}
                placeholder="Paste your full Statement of Purpose here (minimum 100 words)..."
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "10px",
                  background: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-primary)",
                  fontSize: "0.9rem",
                  lineHeight: 1.6,
                  outline: "none",
                  marginBottom: "16px"
                }}
              />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  Word count: {reviewInputText.trim().split(/\s+/).filter(Boolean).length}
                </span>

                <button
                  type="submit"
                  disabled={isReviewing || reviewInputText.trim().length < 50}
                  className="btn btn-primary"
                  style={{ padding: "10px 24px", fontSize: "0.92rem", fontWeight: "700" }}
                >
                  {isReviewing ? "Auditing Draft..." : "Run AI SOP Review (Free)"}
                </button>
              </div>
            </form>

            {reviewError && (
              <div style={{ marginTop: "16px", padding: "12px", background: "rgba(244, 63, 94, 0.15)", border: "1px solid #f43f5e", borderRadius: "8px", color: "#e11d48", fontSize: "0.85rem" }}>
                {reviewError}
              </div>
            )}
          </div>

          {/* Audit Results */}
          <div>
            {reviewResult ? (
              <div className="glass-panel" style={{ padding: "28px" }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--text-primary)", marginBottom: "18px" }}>
                  SOP Quality & Cliché Audit Report
                </h3>

                {/* Scores Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "24px" }}>
                  <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Overall Quality</div>
                    <div style={{ fontSize: "1.4rem", fontWeight: "800", color: (reviewResult.overallScore || reviewResult.hookScore) >= 70 ? "#047857" : "#b45309", marginTop: "2px" }}>
                      {reviewResult.overallScore || reviewResult.hookScore}/100
                    </div>
                  </div>

                  <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Clichés Flagged</div>
                    <div style={{ fontSize: "1.4rem", fontWeight: "800", color: (reviewResult.foundCliches || reviewResult.clichesDetected || []).length === 0 ? "#047857" : "#b45309", marginTop: "2px" }}>
                      {(reviewResult.foundCliches || reviewResult.clichesDetected || []).length}
                    </div>
                  </div>

                  <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Word Count</div>
                    <div style={{ fontSize: "1.4rem", fontWeight: "800", color: "var(--text-primary)", marginTop: "2px" }}>
                      {reviewResult.wordCount}
                    </div>
                  </div>
                </div>

                {/* Clichés Alert */}
                {(reviewResult.foundCliches || reviewResult.clichesDetected || []).length > 0 ? (
                  <div style={{ marginBottom: "20px", padding: "14px", background: "rgba(244, 63, 94, 0.08)", border: "1px solid rgba(244, 63, 94, 0.3)", borderRadius: "10px" }}>
                    <div style={{ fontSize: "0.84rem", fontWeight: "700", color: "#be123c", display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                      <AlertCircle size={16} /> Overused Generic Phrases to Eliminate:
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {(reviewResult.foundCliches || reviewResult.clichesDetected || []).map((c, idx) => (
                        <span key={idx} style={{ fontSize: "0.76rem", background: "rgba(244, 63, 94, 0.15)", color: "#9f1239", fontWeight: "600", padding: "2px 8px", borderRadius: "4px" }}>
                          "{typeof c === "string" ? c : c.phrase}" {c.reason ? `— ${c.reason}` : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ marginBottom: "20px", padding: "12px", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "8px", color: "#047857", fontWeight: "600", fontSize: "0.84rem", display: "flex", alignItems: "center", gap: "6px" }}>
                    <CheckCircle2 size={16} /> Zero cliché phrases detected! Excellent authenticity.
                  </div>
                )}

                {/* Section Review Feedback */}
                <h4 style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-primary)", marginBottom: "10px" }}>
                  Detailed Structural Feedback
                </h4>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                  {(reviewResult.critique || reviewResult.feedbackList || []).map((item, idx) => (
                    <div key={idx} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: "8px", padding: "12px" }}>
                      <div style={{ fontSize: "0.84rem", fontWeight: "700", color: "#047857", marginBottom: "2px" }}>
                        {typeof item === "string" ? `Feedback Point ${idx + 1}` : item.title}
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                        {typeof item === "string" ? item : item.description}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recommended rewrite tip */}
                <div style={{ background: "rgba(37, 99, 235, 0.1)", border: "1px solid rgba(59, 130, 246, 0.3)", borderRadius: "8px", padding: "12px", fontSize: "0.82rem", color: "var(--accent-blue-dark, #1d4ed8)", fontWeight: "500" }}>
                  💡 <strong>Committee Insight:</strong> AdComms read 2,000+ essays. Start directly in media res with your technical breakthrough or intellectual question rather than your high school childhood memories.
                </div>
              </div>
            ) : (
              <div className="glass-panel" style={{ padding: "48px 24px", textAlign: "center" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: "rgba(59, 130, 246, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px auto" }}>
                  <Wand2 color="#2563eb" size={26} />
                </div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "var(--text-primary)", marginBottom: "8px" }}>
                  Paste Your Essay Draft
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", maxWidth: "380px", margin: "0 auto" }}>
                  Paste your text on the left to receive immediate feedback on clichés, technical specificity, and adcom impact.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
