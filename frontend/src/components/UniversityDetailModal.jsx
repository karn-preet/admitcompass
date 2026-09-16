import React, { useState, useEffect } from "react";
import { X, Building2, ExternalLink, Globe2, Compass, Award, FileText, Info, HelpCircle, CheckSquare, ShieldCheck, PenTool } from "lucide-react";
import StudentLifeMapView from "./StudentLifeMapView";
import IndianVisaBadge from "./IndianVisaBadge";
import RealityCheckGauge from "./RealityCheckGauge";
import { getLORBadge, getLORRequirements, getLORTooltipText } from "../services/lorRequirements";

export default function UniversityDetailModal({
  isOpen,
  onClose,
  university,
  userCGPA = null,
  competitiveness = null
}) {
  const [showLORTooltip, setShowLORTooltip] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !university) return null;

  const lorBadge = getLORBadge(university);
  const lorReqs = getLORRequirements(university);
  const lorTooltip = getLORTooltipText(university);
  const isPortalUpload = lorReqs.LOR_Format?.toLowerCase().includes("portal");

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(10, 15, 29, 0.88)",
      backdropFilter: "blur(14px)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      
      <div style={{
        background: "#FFFFFF",
        border: "1px solid var(--border-warm)",
        borderRadius: "20px",
        width: "100%",
        maxWidth: "1400px",
        maxHeight: "92vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.25)"
      }}>
        
        {/* Modal Top Bar */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 24px",
          borderBottom: "1px solid var(--border-subtle)",
          background: "#FFFFFF"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "var(--accent-green)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Compass size={20} color="#FAF8F5" />
            </div>
            <div>
              <div style={{ fontSize: "0.72rem", fontWeight: "700", color: "var(--accent-gold)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Official University Intelligence & Campus Map
              </div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--text-primary)", margin: 0, fontFamily: "var(--font-serif)" }}>
                {university.name}
              </h2>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <IndianVisaBadge university={university} />
            {university.officialWebsite && (
              <a
                href={university.courseCatalogUrl || university.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "6px 14px",
                  borderRadius: "6px",
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-warm)",
                  fontWeight: 600
                }}
              >
                <span>Official Portal</span>
                <ExternalLink size={13} />
              </a>
            )}

            <button
              type="button"
              onClick={onClose}
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-warm)",
                color: "var(--text-primary)",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              title="Close (Esc)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Official Admission Cutoffs & Academic Entry Criteria Banner */}
        <div style={{ 
          background: "var(--bg-secondary)", 
          borderBottom: "1px solid var(--border-warm)", 
          padding: "16px 24px" 
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Award size={16} color="var(--accent-gold)" />
              <span style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Official Admission Minimum Cutoffs & Entry Criteria
              </span>
            </div>
            {university.officialCitation && (
              <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                Source: {university.officialCitation}
              </span>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "12px" }}>
            
            {/* Min CGPA */}
            <div style={{ background: "#FFFFFF", border: "1px solid var(--border-subtle)", borderRadius: "8px", padding: "8px 12px" }}>
              <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                Min CGPA Cutoff (Official)
              </div>
              <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--accent-green)", marginTop: "2px" }}>
                {university.Official_Min_CGPA || university.minCGPA10 ? `${university.Official_Min_CGPA || university.minCGPA10} / 10.0` : "Holistic"}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: "1px" }}>
                Indian Admitted Avg: <strong>{university.Historical_Avg_CGPA_India || 8.0}</strong>
              </div>
            </div>

            {/* US GPA */}
            <div style={{ background: "#FFFFFF", border: "1px solid var(--border-subtle)", borderRadius: "8px", padding: "8px 12px" }}>
              <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                US Equivalent GPA
              </div>
              <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)", marginTop: "2px" }}>
                ≥ {university.minUSGPA ? university.minUSGPA.toFixed(1) : "3.0"} / 4.0
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: "1px" }}>
                Four-Year Equivalent
              </div>
            </div>

            {/* IELTS & TOEFL */}
            <div style={{ background: "#FFFFFF", border: "1px solid var(--border-subtle)", borderRadius: "8px", padding: "8px 12px" }}>
              <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                English Cutoff
              </div>
              <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)", marginTop: "2px" }}>
                IELTS ≥ {university.ieltsMinOverall || "6.5"}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: "1px" }}>
                Band: ≥ {university.ieltsMinBand || "6.0"} • TOEFL: ≥ {university.toeflMin || 88}
              </div>
            </div>

            {/* Standardized Test (GRE) */}
            <div style={{ background: "#FFFFFF", border: "1px solid var(--border-subtle)", borderRadius: "8px", padding: "8px 12px" }}>
              <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                GRE Requirement
              </div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)", marginTop: "4px" }}>
                {university.greRequirement ? (university.greRequirement.toLowerCase().includes("recommended") ? "Recommended (Quant ≥ 164)" : university.greRequirement.toLowerCase().includes("mandatory") || university.greRequirement.toLowerCase().includes("required") ? "Mandatory" : "Not Required") : "Not Required"}
              </div>
              <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "2px" }}>
                {university.testASAccepted ? "TestAS Accepted" : "Standard GRE/GMAT"}
              </div>
            </div>

            {/* Backlog Policy */}
            <div style={{ background: "#FFFFFF", border: "1px solid var(--border-subtle)", borderRadius: "8px", padding: "8px 12px" }}>
              <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                Backlog Policy
              </div>
              <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)", marginTop: "2px" }}>
                {university.maxBacklogsAllowed !== undefined ? `Max ${university.maxBacklogsAllowed}` : "Holistic"}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: "1px" }}>
                {university.apsRequired ? "APS Mandatory" : "No APS Needed"}
              </div>
            </div>

            {/* Tuition Fee */}
            <div style={{ background: "#FFFFFF", border: "1px solid var(--border-subtle)", borderRadius: "8px", padding: "8px 12px" }}>
              <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                Annual Tuition
              </div>
              <div style={{ fontSize: "1.05rem", fontWeight: 800, color: (university.tuitionFeeEUR || 0) === 0 ? "var(--accent-green)" : "var(--text-primary)", marginTop: "2px" }}>
                {(university.tuitionFeeEUR || 0) === 0 ? "€0 (Free)" : `€${university.tuitionFeeEUR?.toLocaleString()}`}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: "1px" }}>
                App: €{university.Application_Fee_Amount || 0} ({university.Application_Portal_Type || "Direct"})
              </div>
            </div>

          </div>

          {/* The Reality Check Gauge: Dual-Threshold System (Official Min vs Realistic Indian Cohort) */}
          <RealityCheckGauge 
            university={university}
            userCGPA={userCGPA}
            competitiveness={competitiveness}
            variant="full"
            showAdvice={true}
          />

          {/* Detailed Indian Student Visa Breakdown */}
          <IndianVisaBadge university={university} variant="detailed" style={{ marginTop: "12px", marginBottom: "0" }} />

          {/* Document Requirements Section (Below Tuition and Visa Financial Cards) */}
          <div style={{
            marginTop: "14px",
            background: "#FFFFFF",
            border: "1px solid var(--border-warm)",
            borderRadius: "10px",
            padding: "14px 16px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FileText size={16} color="var(--accent-green)" />
                <span style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Required Documents
                </span>
              </div>

              {/* High-Visibility LOR Badge (Yellow #FFD700 Accent Color) */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span 
                  style={{
                    background: lorBadge.badgeBg,
                    color: lorBadge.badgeColor,
                    border: `1px solid ${lorBadge.badgeBorder}`,
                    borderRadius: "6px",
                    padding: "3px 10px",
                    fontWeight: 800,
                    fontSize: "0.78rem",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    boxShadow: lorBadge.isRequired ? "0 2px 8px rgba(234, 179, 8, 0.35)" : "none"
                  }}
                >
                  {lorBadge.text}
                </span>

                {/* Tooltip Info Icon */}
                <div style={{ position: "relative", display: "inline-block" }}>
                  <button
                    type="button"
                    onClick={() => setShowLORTooltip(!showLORTooltip)}
                    onMouseEnter={() => setShowLORTooltip(true)}
                    onMouseLeave={() => setShowLORTooltip(false)}
                    style={{
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border-warm)",
                      borderRadius: "50%",
                      width: "24px",
                      height: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--text-secondary)",
                      cursor: "pointer",
                      padding: 0
                    }}
                    title="Click for LOR submission portal link vs PDF instructions"
                  >
                    <Info size={14} />
                  </button>

                  {showLORTooltip && (
                    <div style={{
                      position: "absolute",
                      top: "30px",
                      right: 0,
                      zIndex: 110,
                      width: "320px",
                      background: "var(--surface-dark, #0b1120)",
                      border: "1px solid #FFD700",
                      borderRadius: "10px",
                      padding: "14px",
                      boxShadow: "0 15px 35px rgba(0, 0, 0, 0.6)",
                      color: "#FAF8F5",
                      fontSize: "0.78rem",
                      lineHeight: "1.45"
                    }}>
                      <div style={{ fontWeight: 800, color: "#FFD700", marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
                        <span>{lorTooltip.title}</span>
                      </div>
                      <p style={{ margin: "0 0 8px 0", color: "#e2e8f0" }}>
                        {lorTooltip.description}
                      </p>
                      <div style={{ 
                        background: "rgba(255, 215, 0, 0.12)", 
                        border: "1px solid rgba(255, 215, 0, 0.25)",
                        padding: "6px 8px", 
                        borderRadius: "6px", 
                        color: "#fef08a",
                        fontSize: "0.72rem"
                      }}>
                        💡 <strong>Upload Channel:</strong> {isPortalUpload 
                          ? "University emails your referee an automated confidential upload link."
                          : "Student uploads signed/stamped PDF on official institutional letterhead."}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Document Checklist Items Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "10px" }}>
              
              {/* Card item 1: LOR */}
              <div style={{ 
                background: "var(--bg-secondary)", 
                border: "1px solid var(--border-subtle)", 
                borderRadius: "8px", 
                padding: "10px 12px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2px" }}>
                    <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                      Letters of Recommendation
                    </span>
                    <span style={{ 
                      fontSize: "0.65rem", 
                      fontWeight: 700, 
                      padding: "1px 5px", 
                      borderRadius: "4px",
                      background: isPortalUpload ? "rgba(37, 99, 235, 0.12)" : "rgba(168, 85, 247, 0.12)",
                      color: isPortalUpload ? "#2563eb" : "#7c3aed"
                    }}>
                      {lorReqs.LOR_Format}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.92rem", fontWeight: 800, color: "var(--text-primary)" }}>
                    {lorReqs.LOR_Count} {lorReqs.LOR_Type?.join(" / ")} LOR{lorReqs.LOR_Count > 1 ? "s" : ""}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: "3px" }}>
                    {isPortalUpload ? "Direct referee portal upload" : "Free-form signed PDF upload"}
                  </div>
                </div>
              </div>

              {/* Card item 2: Statement of Purpose */}
              <div style={{ 
                background: "var(--bg-secondary)", 
                border: "1px solid var(--border-subtle)", 
                borderRadius: "8px", 
                padding: "10px 12px" 
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2px" }}>
                  <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                    Statement of Purpose
                  </span>
                  <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#16a34a", background: "rgba(22, 163, 74, 0.12)", padding: "1px 5px", borderRadius: "4px" }}>
                    Mandatory
                  </span>
                </div>
                <div style={{ fontSize: "0.92rem", fontWeight: 800, color: "var(--text-primary)" }}>
                  Academic Essay / Letter of Motivation
                </div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: "3px" }}>
                  Course curriculum-specific rationale (max 1,000 words)
                </div>
              </div>

              {/* Card item 3: Academic Transcripts */}
              <div style={{ 
                background: "var(--bg-secondary)", 
                border: "1px solid var(--border-subtle)", 
                borderRadius: "8px", 
                padding: "10px 12px" 
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2px" }}>
                  <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                    Academic Transcripts
                  </span>
                  <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#16a34a", background: "rgba(22, 163, 74, 0.12)", padding: "1px 5px", borderRadius: "4px" }}>
                    Mandatory
                  </span>
                </div>
                <div style={{ fontSize: "0.92rem", fontWeight: 800, color: "var(--text-primary)" }}>
                  Consolidated & Semester Grade Cards
                </div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: "3px" }}>
                  Official university registrar seal & English translation
                </div>
              </div>

              {/* Card item 4: Curriculum Vitae */}
              <div style={{ 
                background: "var(--bg-secondary)", 
                border: "1px solid var(--border-subtle)", 
                borderRadius: "8px", 
                padding: "10px 12px" 
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2px" }}>
                  <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                    Curriculum Vitae
                  </span>
                  <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#16a34a", background: "rgba(22, 163, 74, 0.12)", padding: "1px 5px", borderRadius: "4px" }}>
                    Mandatory
                  </span>
                </div>
                <div style={{ fontSize: "0.92rem", fontWeight: 800, color: "var(--text-primary)" }}>
                  Academic CV (Europass / Standard)
                </div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: "3px" }}>
                  Chronological academic, research & project background
                </div>
              </div>

              {/* Card item 5: APS Certificate (if required) */}
              {lorReqs.APS_Certificate_Required && (
                <div style={{ 
                  background: "rgba(245, 158, 11, 0.08)", 
                  border: "1px solid rgba(245, 158, 11, 0.3)", 
                  borderRadius: "8px", 
                  padding: "10px 12px" 
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2px" }}>
                    <span style={{ fontSize: "0.68rem", color: "#d97706", textTransform: "uppercase", fontWeight: 700 }}>
                      APS India Verification
                    </span>
                    <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#b45309", background: "rgba(245, 158, 11, 0.2)", padding: "1px 5px", borderRadius: "4px" }}>
                      Mandatory
                    </span>
                  </div>
                  <div style={{ fontSize: "0.92rem", fontWeight: 800, color: "#92400e" }}>
                    APS Certificate Original
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: "3px" }}>
                    Required for enrollment & German student visa submission
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 8px" }}>
          <StudentLifeMapView 
            initialUniversityId={university.id}
            onClose={onClose}
          />
        </div>

      </div>

    </div>
  );
}
