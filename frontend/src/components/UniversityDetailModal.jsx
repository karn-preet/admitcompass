import React, { useEffect } from "react";
import { X, Building2, ExternalLink, Globe2, Compass, Award } from "lucide-react";
import StudentLifeMapView from "./StudentLifeMapView";
import IndianVisaBadge from "./IndianVisaBadge";

export default function UniversityDetailModal({
  isOpen,
  onClose,
  university
}) {
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
        background: "var(--surface-dark, #0b1120)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        borderRadius: "20px",
        width: "100%",
        maxWidth: "1400px",
        maxHeight: "92vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.7)"
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
                Min CGPA Cutoff
              </div>
              <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--accent-green)", marginTop: "2px" }}>
                {university.minCGPA10 ? `${university.minCGPA10} / 10.0` : "Holistic"}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: "1px" }}>
                German: ≤ {university.minGermanGrade ? university.minGermanGrade.toFixed(1) : "2.5"}
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

          {/* Detailed Indian Student Visa Breakdown */}
          <IndianVisaBadge university={university} variant="detailed" style={{ marginTop: "12px", marginBottom: "0" }} />
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
