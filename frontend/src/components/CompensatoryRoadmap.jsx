import React from "react";
import { 
  Sparkles, 
  Target, 
  BookOpen, 
  Clock, 
  TrendingUp, 
  CheckCircle, 
  Code2, 
  Lightbulb,
  Award
} from "lucide-react";

export default function CompensatoryRoadmap({ evaluationData }) {
  if (!evaluationData || !evaluationData.recommendations) {
    return null;
  }

  const { cgpaStatus, compensatoryActionPlan } = evaluationData.recommendations;
  const originalCGPA = evaluationData.academicEvaluation?.academicSummary?.originalCGPA;

  return (
    <div style={{ marginTop: "32px" }}>
      
      {/* Header Banner */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: "24px 28px", 
          marginBottom: "24px",
          background: "linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(16, 185, 129, 0.12) 100%)",
          border: "1px solid rgba(59, 130, 246, 0.3)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span className="badge badge-target">
                Profile Strategy
              </span>
              <span style={{ fontSize: "0.82rem", color: "#93c5fd", fontWeight: "600" }}>
                CGPA Standing: {originalCGPA} / 10 • {cgpaStatus}
              </span>
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.45rem", fontWeight: "800", color: "#ffffff", margin: 0 }}>
              Dynamic Profile Compensation Roadmap
            </h3>
            <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)", marginTop: "4px", margin: 0 }}>
              Actionable, high-leverage steps designed to legally bypass grade filters and maximize public university admits.
            </p>
          </div>

          <div style={{ textAlign: "right" }}>
            <span style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: "6px", 
              background: "rgba(16, 185, 129, 0.2)", 
              border: "1px solid #10b981", 
              padding: "6px 14px", 
              borderRadius: "999px",
              color: "#34d399",
              fontSize: "0.82rem",
              fontWeight: "700"
            }}>
              <TrendingUp size={16} />
              <span>Up to +35% Admission Boost</span>
            </span>
          </div>
        </div>
      </div>

      {/* Action Plan Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: "20px" }}>
        {compensatoryActionPlan.map((plan, index) => (
          <div 
            key={index} 
            className="glass-panel" 
            style={{ 
              padding: "24px", 
              display: "flex", 
              flexDirection: "column", 
              justifyContent: "space-between" 
            }}
          >
            <div>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", marginBottom: "12px" }}>
                <div>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.5px" }}>
                    {plan.pillar}
                  </span>
                  <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: "700", color: "#ffffff", marginTop: "2px", lineHeight: 1.3 }}>
                    {plan.title}
                  </h4>
                </div>
                <span className="badge badge-safe" style={{ fontSize: "0.72rem" }}>
                  {plan.impactLevel}
                </span>
              </div>

              {/* Time to complete */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.78rem", color: "#60a5fa", marginBottom: "12px" }}>
                <Clock size={14} />
                <span>Estimated Time: {plan.timeToComplete}</span>
              </div>

              {/* Rationale */}
              <div style={{ 
                background: "rgba(255, 255, 255, 0.03)", 
                borderLeft: "3px solid #3b82f6", 
                padding: "10px 14px", 
                borderRadius: "0 8px 8px 0",
                fontSize: "0.82rem",
                color: "#cbd5e1",
                lineHeight: 1.5,
                marginBottom: "16px"
              }}>
                <strong>Why it works:</strong> {plan.rationale}
              </div>

              {/* Action Steps */}
              <div>
                <h5 style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: "8px" }}>
                  Concrete Action Steps:
                </h5>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                  {plan.actionSteps.map((step, sIdx) => (
                    <li key={sIdx} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                      <CheckCircle size={14} color="#34d399" style={{ flexShrink: 0, marginTop: "3px" }} />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            <div style={{ marginTop: "18px", paddingTop: "14px", borderTop: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Execution Priority: Top Recommendation
              </span>
              <span style={{ color: "#38bdf8", fontSize: "0.78rem", fontWeight: "600" }}>
                Step {index + 1} of {compensatoryActionPlan.length}
              </span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
