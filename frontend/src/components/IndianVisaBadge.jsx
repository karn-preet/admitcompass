import React, { useState } from "react";
import { ShieldCheck, AlertTriangle, AlertCircle, Info, ExternalLink } from "lucide-react";
import { getIndianVisaOdds } from "../services/indianVisaOdds";

export default function IndianVisaBadge({
  university = {},
  variant = "card-corner", // "card-corner" | "inline" | "detailed"
  style = {}
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const visaData = getIndianVisaOdds(university);

  const renderIcon = () => {
    if (visaData.statusIcon === "ShieldCheck") {
      return <ShieldCheck size={12} color={visaData.badgeColor} />;
    } else if (visaData.statusIcon === "AlertTriangle") {
      return <AlertTriangle size={12} color={visaData.badgeColor} />;
    }
    return <AlertCircle size={12} color={visaData.badgeColor} />;
  };

  if (variant === "detailed") {
    return (
      <div 
        style={{
          background: visaData.badgeBg,
          border: `1px solid ${visaData.badgeBorder}`,
          borderRadius: "12px",
          padding: "14px 18px",
          margin: "12px 0",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          ...style
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "1.2rem" }}>🇮🇳</span>
            <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text-primary, #0F172A)" }}>
              Indian Student Visa Approval Odds:
            </span>
            <span 
              style={{ 
                color: visaData.badgeColor, 
                fontWeight: 900, 
                fontSize: "1.1rem",
                padding: "2px 8px",
                borderRadius: "6px",
                background: "rgba(255,255,255,0.7)"
              }}
            >
              {visaData.oddsPercent}%
            </span>
          </div>

          <span 
            style={{ 
              fontSize: "0.74rem", 
              fontWeight: 700, 
              color: visaData.badgeColor,
              background: "rgba(255,255,255,0.85)",
              padding: "3px 10px",
              borderRadius: "999px",
              border: `1px solid ${visaData.badgeBorder}`,
              display: "inline-flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            {renderIcon()}
            <span>Refusal Risk: {visaData.refusalRate}</span>
          </span>
        </div>

        <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--text-secondary, #475569)", lineHeight: 1.5 }}>
          {visaData.keyInsight}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px", marginTop: "4px", paddingTop: "8px", borderTop: "1px dashed rgba(0,0,0,0.1)", fontSize: "0.76rem" }}>
          <div>
            <strong style={{ color: "var(--text-primary, #0F172A)" }}>Key Requirement: </strong>
            <span style={{ color: "var(--text-secondary, #475569)" }}>{visaData.primaryRequirement}</span>
          </div>
          <div>
            <strong style={{ color: "var(--text-primary, #0F172A)" }}>Interview: </strong>
            <span style={{ color: "var(--text-secondary, #475569)" }}>{visaData.interviewType}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      style={{ position: "relative", display: "inline-block", ...style }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={(e) => {
        e.stopPropagation();
        setShowTooltip(!showTooltip);
      }}
    >
      {/* Visual Badge */}
      <div 
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(8px)",
          border: `1.5px solid ${visaData.badgeBorder}`,
          borderRadius: "999px",
          padding: "3px 9px",
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          boxShadow: "0 3px 10px rgba(0, 0, 0, 0.12)",
          cursor: "pointer",
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
          zIndex: 5
        }}
        className="hover:scale-105"
        title="Click or hover to inspect Indian student visa approval odds & refusal risk"
      >
        <span style={{ fontSize: "0.85rem", lineHeight: 1 }}>🇮🇳</span>
        <span 
          style={{ 
            fontSize: "0.74rem", 
            fontWeight: 800, 
            color: visaData.badgeColor,
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap"
          }}
        >
          {visaData.oddsPercent}% Visa Odds
        </span>
        {renderIcon()}
      </div>

      {/* Floating Detailed Popover on Hover / Click */}
      {showTooltip && (
        <div 
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: "270px",
            background: "#FFFFFF",
            border: `1.5px solid ${visaData.badgeBorder}`,
            borderRadius: "12px",
            boxShadow: "0 12px 30px rgba(0, 0, 0, 0.22)",
            padding: "12px 14px",
            zIndex: 100,
            color: "#0F172A",
            textAlign: "left",
            fontSize: "0.78rem",
            animation: "fadeIn 0.15s ease-in-out"
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", borderBottom: "1px solid #E2E8F0", paddingBottom: "6px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "1rem" }}>🇮🇳</span>
              <strong style={{ fontSize: "0.82rem", color: "#0F172A" }}>Visa Chances for Indians</strong>
            </div>
            <span 
              style={{ 
                background: visaData.badgeBg, 
                color: visaData.badgeColor, 
                fontWeight: 800, 
                padding: "2px 6px", 
                borderRadius: "4px",
                fontSize: "0.75rem"
              }}
            >
              {visaData.oddsPercent}%
            </span>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748B" }}>Refusal Risk:</span>
              <span style={{ fontWeight: 700, color: visaData.badgeColor }}>{visaData.refusalRate}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748B" }}>Assessment:</span>
              <span style={{ fontWeight: 700, color: "#1E293B" }}>{visaData.riskLevel}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748B" }}>Timeline:</span>
              <span style={{ fontWeight: 600, color: "#1E293B" }}>{visaData.processingTime}</span>
            </div>
          </div>

          {/* Key Rule Callout */}
          <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "8px", padding: "8px", marginBottom: "8px" }}>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", marginBottom: "2px" }}>
              Key Requirement
            </div>
            <div style={{ fontSize: "0.74rem", fontWeight: 600, color: "#0F172A" }}>
              {visaData.primaryRequirement}
            </div>
          </div>

          {/* Insight */}
          <p style={{ margin: 0, fontSize: "0.73rem", color: "#475569", lineHeight: 1.4 }}>
            {visaData.keyInsight}
          </p>
        </div>
      )}
    </div>
  );
}
