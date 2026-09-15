import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  RotateCcw, 
  Printer, 
  FileText, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle,
  GraduationCap,
  Calculator,
  ShoppingCart
} from "lucide-react";
import UniversityMatches from "./UniversityMatches";
import VisaMitigationCard from "./VisaMitigationCard";
import CompensatoryRoadmap from "./CompensatoryRoadmap";
import ApplicationCartView from "./ApplicationCartView";

export default function ResultsDashboard({ 
  evaluationData, 
  onResetForm, 
  onOpenCitations,
  cartItems = [],
  onToggleCartItem,
  onOpenCart,
  onRemoveCartItem,
  onClearCart
}) {
  const [activeTab, setActiveTab] = useState("universities"); // universities, visa, compensatory

  useEffect(() => {
    // Fire celebratory confetti if high admission odds or low visa risk
    if (evaluationData?.visaEvaluation?.riskLevel === "Low Risk") {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {}
    }
  }, [evaluationData]);

  if (!evaluationData) return null;

  const { academicEvaluation, visaEvaluation, recommendations, studentProfile } = evaluationData;
  const { counts, academicSummary } = academicEvaluation;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container" style={{ padding: "32px 24px", maxWidth: "1280px" }}>
      
      {/* Top Banner & Profile Overview */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: "28px 32px", 
          marginBottom: "28px",
          background: "linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)",
          border: "1px solid rgba(59, 130, 246, 0.3)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span className="badge badge-safe">Evaluation Complete</span>
              <span style={{ fontSize: "0.82rem", color: "#93c5fd" }}>
                Target: {studentProfile?.targetCountry} • {studentProfile?.academic?.degreeTarget} in {studentProfile?.academic?.backgroundField}
              </span>
            </div>
            
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.85rem", fontWeight: "800", color: "#ffffff", letterSpacing: "-0.5px" }}>
              Admission & Visa Feasibility Assessment
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "4px" }}>
              Comprehensive evaluation based on official 2025/2026 public university thresholds & immigration solvency guidelines.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button 
              onClick={handlePrint}
              className="btn btn-secondary"
              style={{ fontSize: "0.85rem" }}
              title="Print or save as PDF report"
            >
              <Printer size={16} />
              <span>Print Dossier</span>
            </button>
            <button 
              onClick={onResetForm}
              className="btn btn-primary"
              style={{ fontSize: "0.85rem" }}
            >
              <RotateCcw size={16} />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Executive Metric Cards */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", 
          gap: "16px", 
          marginTop: "24px",
          paddingTop: "20px",
          borderTop: "1px solid var(--border-subtle)"
        }}>
          
          <div style={{ background: "rgba(255,255,255,0.03)", padding: "14px 18px", borderRadius: "12px" }}>
            <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "600" }}>
              Bavarian German Grade
            </span>
            <div style={{ fontSize: "1.5rem", fontWeight: "800", color: academicSummary?.germanGrade <= 2.2 ? "#34d399" : "#fbbf24", marginTop: "2px" }}>
              {academicSummary?.germanGrade}
            </div>
            <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>
              CGPA {academicSummary?.originalCGPA} / 10
            </span>
          </div>

          <div style={{ background: "rgba(255,255,255,0.03)", padding: "14px 18px", borderRadius: "12px" }}>
            <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "600" }}>
              Public University Matches
            </span>
            <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#60a5fa", marginTop: "2px" }}>
              {counts?.safe + counts?.target + counts?.reach} Options
            </div>
            <span style={{ fontSize: "0.72rem", color: "#34d399" }}>
              {counts?.safe} Safe • {counts?.target} Target • {counts?.reach} Reach
            </span>
          </div>

          <div style={{ background: "rgba(255,255,255,0.03)", padding: "14px 18px", borderRadius: "12px" }}>
            <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "600" }}>
              Visa Solvency Ratio
            </span>
            <div style={{ fontSize: "1.5rem", fontWeight: "800", color: visaEvaluation?.solvencyRatio >= 1.0 ? "#34d399" : "#fb7185", marginTop: "2px" }}>
              {visaEvaluation?.solvencyRatio}x
            </div>
            <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>
              {visaEvaluation?.solvencyStatus}
            </span>
          </div>

          <div style={{ background: "rgba(255,255,255,0.03)", padding: "14px 18px", borderRadius: "12px" }}>
            <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "600" }}>
              Visa Refusal Risk
            </span>
            <div style={{ fontSize: "1.5rem", fontWeight: "800", color: visaEvaluation?.riskLevel === "High Risk" ? "#fb7185" : visaEvaluation?.riskLevel === "Moderate Risk" ? "#fbbf24" : "#34d399", marginTop: "2px" }}>
              {visaEvaluation?.riskLevel}
            </div>
            <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>
              {visaEvaluation?.approvalProbability}% Approval Odds
            </span>
          </div>

        </div>
      </div>

      {/* Main Dashboard Tabs */}
      <div style={{ display: "flex", gap: "10px", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "12px", marginBottom: "8px", flexWrap: "wrap" }}>
        
        <button
          onClick={() => setActiveTab("universities")}
          className="btn"
          style={{
            background: activeTab === "universities" ? "rgba(37, 99, 235, 0.25)" : "transparent",
            border: activeTab === "universities" ? "1px solid #3b82f6" : "1px solid transparent",
            color: activeTab === "universities" ? "#93c5fd" : "var(--text-secondary)",
            padding: "10px 18px"
          }}
        >
          <Building2 size={18} />
          <span>1. University Matches ({counts?.safe + counts?.target + counts?.reach})</span>
        </button>

        <button
          onClick={() => setActiveTab("visa")}
          className="btn"
          style={{
            background: activeTab === "visa" ? "rgba(37, 99, 235, 0.25)" : "transparent",
            border: activeTab === "visa" ? "1px solid #3b82f6" : "1px solid transparent",
            color: activeTab === "visa" ? "#93c5fd" : "var(--text-secondary)",
            padding: "10px 18px"
          }}
        >
          <ShieldCheck size={18} />
          <span>2. Visa Refusal Mitigation & Solvency Roadmap</span>
        </button>

        <button
          onClick={() => setActiveTab("compensatory")}
          className="btn"
          style={{
            background: activeTab === "compensatory" ? "rgba(37, 99, 235, 0.25)" : "transparent",
            border: activeTab === "compensatory" ? "1px solid #3b82f6" : "1px solid transparent",
            color: activeTab === "compensatory" ? "#93c5fd" : "var(--text-secondary)",
            padding: "10px 18px"
          }}
        >
          <Sparkles size={18} />
          <span>3. Compensatory Strategy for CGPA {academicSummary?.originalCGPA}</span>
        </button>

        <button
          onClick={() => setActiveTab("cart")}
          className="btn"
          style={{
            background: activeTab === "cart" ? "rgba(37, 99, 235, 0.25)" : "transparent",
            border: activeTab === "cart" ? "1px solid #3b82f6" : "1px solid transparent",
            color: activeTab === "cart" ? "#93c5fd" : "var(--text-secondary)",
            padding: "10px 18px"
          }}
        >
          <ShoppingCart size={18} />
          <span>4. Application Cart & Sunk Costs ({cartItems.length})</span>
        </button>

      </div>

      {/* Active Tab View */}
      {activeTab === "universities" && (
        <UniversityMatches 
          evaluationData={evaluationData} 
          cartItems={cartItems}
          onToggleCartItem={onToggleCartItem}
          onOpenCart={onOpenCart}
        />
      )}

      {activeTab === "visa" && (
        <VisaMitigationCard evaluationData={evaluationData} />
      )}

      {activeTab === "compensatory" && (
        <CompensatoryRoadmap evaluationData={evaluationData} />
      )}

      {activeTab === "cart" && (
        <ApplicationCartView 
          cartItems={cartItems}
          onRemoveItem={onRemoveCartItem}
          onClearCart={onClearCart}
          originCountry={studentProfile?.citizenship || "India"}
        />
      )}

    </div>
  );
}
