import React from "react";
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  ExternalLink, 
  FileText, 
  ArrowRight,
  Landmark,
  BadgeAlert
} from "lucide-react";

export default function VisaMitigationCard({ evaluationData }) {
  if (!evaluationData) {
    return null;
  }

  const {
    targetCountry = "Germany",
    solvencyStatus = "Pending",
    solvencyRatio = 1.0,
    totalRecognizedLiquidINR = 0,
    requiredLivingINR = 0,
    typicalTuitionINR = 0,
    totalRequiredINR = 0,
    fundingGapINR = 0,
    riskScore = 0,
    riskLevel = "Moderate Risk",
    approvalProbability = 75,
    refusalRisks = [],
    positiveHighlights = [],
    customRoadmap = []
  } = evaluationData.visaEvaluation || {};

  const isHighRisk = riskLevel === "High Risk";
  const isModerateRisk = riskLevel === "Moderate Risk";

  return (
    <div style={{ marginTop: "32px" }}>
      
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.45rem", fontWeight: "700" }}>
          Visa Refusal Mitigation & Financial Solvency Analysis
        </h3>
        <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)" }}>
          Destination-specific immigration audit against official government financial rules for {targetCountry}.
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        
        {/* Card 1: Visa Approval Likelihood */}
        <div className="glass-panel" style={{ padding: "20px", borderLeft: isHighRisk ? "4px solid #f43f5e" : isModerateRisk ? "4px solid #f59e0b" : "4px solid #10b981" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>
              Visa Approval Likelihood
            </span>
            {isHighRisk ? <ShieldAlert color="#fb7185" size={20} /> : <ShieldCheck color="#34d399" size={20} />}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginTop: "8px" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: "800", color: isHighRisk ? "#fb7185" : isModerateRisk ? "#fbbf24" : "#34d399" }}>
              {approvalProbability}%
            </span>
            <span className={`badge ${isHighRisk ? "badge-risk-high" : isModerateRisk ? "badge-reach" : "badge-safe"}`}>
              {riskLevel}
            </span>
          </div>
          <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "4px" }}>
            Calculated against {targetCountry} embassy refusal benchmarks & fund verification standards.
          </p>
        </div>

        {/* Card 2: Financial Solvency Ratio */}
        <div className="glass-panel" style={{ padding: "20px", borderLeft: fundingGapINR > 0 ? "4px solid #f43f5e" : "4px solid #10b981" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>
              Financial Solvency Status
            </span>
            <Landmark color="#60a5fa" size={20} />
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginTop: "8px" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: "800", color: fundingGapINR > 0 ? "#fb7185" : "#34d399" }}>
              {solvencyRatio}x
            </span>
            <span className={`badge ${fundingGapINR > 0 ? "badge-risk-high" : "badge-safe"}`}>
              {solvencyStatus}
            </span>
          </div>
          <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "4px" }}>
            Liquid Recognized: ₹{(totalRecognizedLiquidINR / 100000).toFixed(1)}L / Required: ₹{(totalRequiredINR / 100000).toFixed(1)}L
          </p>
        </div>

        {/* Card 3: Funding Gap or Surplus */}
        <div className="glass-panel" style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>
              {fundingGapINR > 0 ? "Funding Shortfall" : "Financial Surplus"}
            </span>
            <TrendingUp color={fundingGapINR > 0 ? "#f87171" : "#34d399"} size={20} />
          </div>
          <div style={{ marginTop: "8px" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: "800", color: fundingGapINR > 0 ? "#f87171" : "#34d399" }}>
              {fundingGapINR > 0 ? `₹${(fundingGapINR / 100000).toFixed(1)} Lakhs Short` : `₹${((totalRecognizedLiquidINR - totalRequiredINR) / 100000).toFixed(1)} Lakhs Buffer`}
            </span>
          </div>
          <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "4px" }}>
            {fundingGapINR > 0 ? "Must bridge via bank education loan or parent sponsor FDs." : "Comfortable cushion for unexpected currency rate fluctuations."}
          </p>
        </div>

      </div>

      {/* Potential Refusal Triggers Alert Panel */}
      {refusalRisks && refusalRisks.length > 0 && (
        <div className="glass-panel" style={{ padding: "24px", marginBottom: "24px", border: "1px solid rgba(244, 63, 94, 0.3)", background: "rgba(244, 63, 94, 0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <BadgeAlert color="#fb7185" size={24} />
            <div>
              <h4 style={{ color: "#fb7185", fontSize: "1.1rem", fontWeight: "700", margin: 0 }}>
                Potential Visa Refusal Triggers Flagged ({refusalRisks.length})
              </h4>
              <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", margin: 0 }}>
                These specific vulnerabilities in your profile can trigger an embassy rejection if not legally mitigated.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {refusalRisks.map((risk, idx) => (
              <div 
                key={idx} 
                style={{ 
                  background: "rgba(15, 23, 42, 0.6)", 
                  border: "1px solid rgba(244, 63, 94, 0.2)", 
                  borderRadius: "10px", 
                  padding: "14px 18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className="badge badge-risk-high" style={{ fontSize: "0.68rem" }}>
                    {risk.severity}
                  </span>
                  <strong style={{ color: "#ffffff", fontSize: "0.92rem" }}>
                    {risk.title}
                  </strong>
                </div>
                <p style={{ fontSize: "0.83rem", color: "#cbd5e1", lineHeight: 1.5, margin: 0 }}>
                  {risk.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step-by-Step Legal Solvency Roadmap */}
      <div className="glass-panel" style={{ padding: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <FileText color="#38bdf8" size={22} />
          <div>
            <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>
              Step-by-Step Financial Solvency Roadmap ({targetCountry})
            </h4>
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", margin: 0 }}>
              Legally recognized documentation checklist designed for Indian parents and applicants.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {customRoadmap.map((item) => (
            <div 
              key={item.order} 
              style={{ 
                display: "flex", 
                gap: "16px", 
                alignItems: "flex-start",
                padding: "14px",
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid var(--border-subtle)"
              }}
            >
              <div style={{ 
                width: "32px", 
                height: "32px", 
                borderRadius: "50%", 
                background: "#2563eb", 
                color: "#ffffff", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                fontWeight: "700", 
                fontSize: "0.9rem", 
                flexShrink: 0
              }}>
                {item.order}
              </div>
              <div>
                <h5 style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-primary)", marginBottom: "4px" }}>
                  {item.title}
                </h5>
                <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
                  {item.action}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Positive Profile Highlights */}
        {positiveHighlights && positiveHighlights.length > 0 && (
          <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--border-subtle)" }}>
            <h5 style={{ fontSize: "0.88rem", fontWeight: "700", color: "#34d399", marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
              <CheckCircle2 size={16} />
              <span>Verified Financial Strengths</span>
            </h5>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "8px" }}>
              {positiveHighlights.map((pos, idx) => (
                <div key={idx} style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ color: "#34d399" }}>•</span>
                  <span>{pos}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
