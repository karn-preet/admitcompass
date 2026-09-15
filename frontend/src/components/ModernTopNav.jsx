import React, { useState } from "react";
import { Compass, Star, ChevronRight, Bell, Sparkles, X, Calendar, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function ModernTopNav({
  onSelectTab,
  onOpenCart,
  cartCount = 0,
  onOpenCitations
}) {
  const [isAlertVisible, setIsAlertVisible] = useState(true);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isDeadlinesModalOpen, setIsDeadlinesModalOpen] = useState(false);

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 90,
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #E2E8F0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
        }}
      >
        {/* Main Sticky Top Bar */}
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "12px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          {/* Far Left: Logo */}
          <div
            onClick={() => {
              if (onSelectTab) onSelectTab("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
              userSelect: "none"
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 3px 10px rgba(15, 23, 42, 0.2)"
              }}
            >
              <Compass size={22} color="#FDE047" />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span
                  style={{
                    fontFamily: "var(--font-brand)",
                    fontSize: "1.38rem",
                    fontWeight: "800",
                    letterSpacing: "-0.5px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <span style={{ color: "#0F172A", fontWeight: "900" }}>Global</span>
                  <span
                    style={{
                      fontFamily: "var(--font-gurmukhi)",
                      color: "#0F172A",
                      backgroundColor: "#FDE047",
                      padding: "2px 8px",
                      borderRadius: "8px",
                      fontWeight: "900",
                      fontSize: "1.22rem",
                      lineHeight: "1.25",
                      boxShadow: "0 2px 6px rgba(253, 224, 71, 0.45)"
                    }}
                  >
                    ਪੰਜਾਬ
                  </span>
                </span>
                <span
                  style={{
                    fontSize: "0.62rem",
                    fontWeight: "800",
                    background: "#0F172A",
                    color: "#FDE047",
                    padding: "2px 6px",
                    borderRadius: "999px",
                    letterSpacing: "0.04em"
                  }}
                >
                  PRO
                </span>
              </div>
            </div>
          </div>

          {/* Far Right: Pill-shaped Yellow Button with Star Icon & Circular Avatar */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            
            {/* Pill-Shaped Yellow Subscribe / Pro Button */}
            <button
              onClick={() => setIsProModalOpen(true)}
              className="btn-yellow"
              style={{
                padding: "8px 16px",
                fontSize: "0.85rem",
                borderRadius: "9999px",
                boxShadow: "0 2px 8px rgba(253, 224, 71, 0.45)"
              }}
              title="View Premium Access Status"
            >
              <Star size={15} fill="#0F172A" color="#0F172A" />
              <span>Premium</span>
            </button>

            {/* Circular User Avatar Profile Placeholder */}
            <div
              onClick={() => {
                if (onSelectTab) onSelectTab("profile");
              }}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #E2E8F0 0%, #CBD5E1 100%)",
                border: "2px solid #FFFFFF",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                position: "relative",
                transition: "transform 0.15s ease"
              }}
              title="Applicant Profile & Cart"
            >
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.95rem",
                  fontWeight: "800",
                  color: "#0F172A"
                }}
              >
                AC
              </span>
              {/* Online Indicator Green Dot */}
              <div
                style={{
                  position: "absolute",
                  bottom: "0px",
                  right: "0px",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: "#10B981",
                  border: "2px solid #FFFFFF"
                }}
              />
            </div>

          </div>
        </div>

        {/* Full-Width High-Contrast Yellow Alert Banner Directly Below Header */}
        {isAlertVisible && (
          <div
            style={{
              backgroundColor: "#FDE047",
              color: "#0F172A",
              borderTop: "1px solid rgba(0, 0, 0, 0.05)",
              borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
              padding: "10px 18px",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4)"
            }}
          >
            <div
              style={{
                maxWidth: "1100px",
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                fontSize: "0.86rem",
                fontWeight: "700"
              }}
            >
              {/* Left Text */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "1rem" }}>⚡</span>
                <span>Application Deadlines Approaching: Winter 2026 Admissions Open</span>
              </div>

              {/* Actionable Link on the Right */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button
                  onClick={() => setIsDeadlinesModalOpen(true)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#0F172A",
                    fontWeight: "800",
                    fontSize: "0.86rem",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "2px",
                    textDecoration: "underline",
                    textUnderlineOffset: "3px"
                  }}
                >
                  <span>Check Dates</span>
                  <ChevronRight size={14} />
                </button>
                <button
                  onClick={() => setIsAlertVisible(false)}
                  style={{
                    background: "rgba(0,0,0,0.06)",
                    border: "none",
                    borderRadius: "50%",
                    width: "22px",
                    height: "22px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#0F172A",
                    marginLeft: "6px"
                  }}
                  title="Dismiss alert"
                >
                  <X size={13} />
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Deadlines Modal */}
      {isDeadlinesModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(6px)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px"
          }}
          onClick={() => setIsDeadlinesModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "24px",
              maxWidth: "520px",
              width: "100%",
              padding: "26px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Calendar size={20} color="#EAB308" />
                <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#0F172A" }}>
                  Upcoming European Intake Deadlines
                </h3>
              </div>
              <button
                onClick={() => setIsDeadlinesModalOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ color: "#64748B", fontSize: "0.9rem", marginBottom: "18px" }}>
              Key submission windows for English-taught public university Master's programs across the EU:
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "22px" }}>
              <div style={{ background: "#F8FAFC", padding: "12px 16px", borderRadius: "14px", border: "1px solid #E2E8F0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", color: "#0F172A", marginBottom: "4px" }}>
                  <span>🇩🇪 Germany (Uni-Assist / Direct)</span>
                  <span style={{ color: "#DC2626" }}>July 15, 2026</span>
                </div>
                <div style={{ fontSize: "0.82rem", color: "#64748B" }}>
                  Winter Semester intake cutoff. Mandatory APS certificate required beforehand.
                </div>
              </div>

              <div style={{ background: "#F8FAFC", padding: "12px 16px", borderRadius: "14px", border: "1px solid #E2E8F0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", color: "#0F172A", marginBottom: "4px" }}>
                  <span>🇸🇪 Sweden (University Admissions)</span>
                  <span style={{ color: "#2563EB" }}>Jan 15 / April 15</span>
                </div>
                <div style={{ fontSize: "0.82rem", color: "#64748B" }}>
                  Round 1 for international scholars; Round 2 for EU/EEA citizens.
                </div>
              </div>

              <div style={{ background: "#F8FAFC", padding: "12px 16px", borderRadius: "14px", border: "1px solid #E2E8F0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", color: "#0F172A", marginBottom: "4px" }}>
                  <span>🇫🇷 France (Mon Master / Etudes en France)</span>
                  <span style={{ color: "#10B981" }}>March 24, 2026</span>
                </div>
                <div style={{ fontSize: "0.82rem", color: "#64748B" }}>
                  National portal submission deadline for national public university masters.
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setIsDeadlinesModalOpen(false);
                if (onSelectTab) onSelectTab("universities");
              }}
              className="btn-yellow"
              style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: "0.95rem" }}
            >
              Browse 147 Public Universities →
            </button>
          </div>
        </div>
      )}

      {/* Pro Access Modal */}
      {isProModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(6px)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px"
          }}
          onClick={() => setIsProModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "24px",
              maxWidth: "480px",
              width: "100%",
              padding: "26px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: "center", marginBottom: "18px" }}>
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  backgroundColor: "#FEF08A",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px auto"
                }}
              >
                <Star size={28} fill="#EAB308" color="#CA8A04" />
              </div>
              <h3 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#0F172A", marginBottom: "6px" }}>
                100% Free Pro Access Active
              </h3>
              <p style={{ color: "#64748B", fontSize: "0.9rem" }}>
                All premium tools on Global ਪੰਜਾਬ are provided without subscription fees or paywalls.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.88rem", color: "#1E293B" }}>
                <CheckCircle2 size={18} color="#10B981" />
                <span>147 Verified Public Universities & Cutoffs</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.88rem", color: "#1E293B" }}>
                <CheckCircle2 size={18} color="#10B981" />
                <span>Interactive 3D Destination Globe Navigator</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.88rem", color: "#1E293B" }}>
                <CheckCircle2 size={18} color="#10B981" />
                <span>Section 214(b) & German Visa Risk Engine</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.88rem", color: "#1E293B" }}>
                <CheckCircle2 size={18} color="#10B981" />
                <span>Student Life & Housing Map with Verified Dorms</span>
              </div>
            </div>

            <button
              onClick={() => setIsProModalOpen(false)}
              className="btn-yellow"
              style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: "0.95rem" }}
            >
              Enjoy Unlimited Access
            </button>
          </div>
        </div>
      )}
    </>
  );
}
