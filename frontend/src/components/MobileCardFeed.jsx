import React from "react";
import { 
  ArrowRight, ShieldCheck, Award, Globe2, Compass, CheckCircle2, 
  Euro, BookOpen, FileCheck2, Sparkles, ExternalLink 
} from "lucide-react";

export default function MobileCardFeed({
  onSelectTab,
  onExploreUniversities,
  onStartEvaluation,
  onOpenGlobe,
  selectedCountry = "Germany",
  onSelectCountry
}) {
  return (
    <div className="mobile-feed-container">
      
      {/* Welcome to Global ਪੰਜਾਬ Greeting Header */}
      <div style={{ padding: "0 4px 4px 4px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", fontWeight: "800", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>
          <span>WELCOME TO</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <span style={{ color: "#0F172A", fontWeight: "900" }}>Global</span>
            <span style={{ fontFamily: "var(--font-gurmukhi)", color: "#0F172A", backgroundColor: "#FDE047", padding: "1px 6px", borderRadius: "5px", fontSize: "0.86rem", fontWeight: "900" }}>ਪੰਜਾਬ</span>
          </span>
        </div>
        <h1 style={{ fontSize: "1.75rem", fontWeight: "900", color: "#0F172A", letterSpacing: "-0.025em", lineHeight: 1.25, margin: 0 }}>
          Study Abroad & Public University Admissions
        </h1>
        <p style={{ color: "#64748B", fontSize: "0.94rem", fontWeight: "500", marginTop: "4px" }}>
          Explore 147 tuition-free European universities, calculate official cutoffs, and pre-empt visa refusals.
        </p>
      </div>
      
      {/* =========================================================
          CARD 1: THE HERO CARD (Featured Universities)
          ========================================================= */}
      <div 
        className="card-modern"
        onClick={() => {
          if (onSelectTab) onSelectTab("universities");
          if (onExploreUniversities) onExploreUniversities();
        }}
        style={{ cursor: "pointer" }}
      >
        {/* Top Half: Edge-to-Edge Vibrant Green Graphic */}
        <div
          style={{
            height: "220px",
            background: "linear-gradient(135deg, #10B981 0%, #059669 60%, #047857 100%)",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden"
          }}
        >
          {/* Subtle Background Geometric Architectural Motif */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.15,
              backgroundImage: `radial-gradient(circle at 80% 20%, #FFFFFF 10%, transparent 11%), 
                                radial-gradient(circle at 20% 80%, #FFFFFF 15%, transparent 16%)`,
              backgroundSize: "60px 60px"
            }}
          />

          {/* Stylized European University Arch Graphic */}
          <svg
            width="260"
            height="180"
            viewBox="0 0 260 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ position: "absolute", bottom: "-10px", opacity: 0.95 }}
          >
            {/* Campus Dome & Columns */}
            <path
              d="M130 20 C95 20 65 50 65 90 L195 90 C195 50 165 20 130 20 Z"
              fill="rgba(255, 255, 255, 0.22)"
            />
            <rect x="75" y="90" width="16" height="70" rx="4" fill="rgba(255, 255, 255, 0.3)" />
            <rect x="105" y="90" width="16" height="70" rx="4" fill="rgba(255, 255, 255, 0.3)" />
            <rect x="139" y="90" width="16" height="70" rx="4" fill="rgba(255, 255, 255, 0.3)" />
            <rect x="169" y="90" width="16" height="70" rx="4" fill="rgba(255, 255, 255, 0.3)" />
            <rect x="50" y="160" width="160" height="12" rx="4" fill="rgba(255, 255, 255, 0.4)" />
            
            {/* Star & Laurel Badge */}
            <circle cx="130" cy="55" r="14" fill="#FDE047" />
            <path d="M130 46 L133 52 L139 53 L134 57 L136 63 L130 60 L124 63 L126 57 L121 53 L127 52 Z" fill="#0F172A" />
          </svg>

          {/* Top-Left Hovering White Pill Badge ("🔴 Admissions Open") */}
          <div
            className="pill-white"
            style={{
              position: "absolute",
              top: "18px",
              left: "18px"
            }}
          >
            <span style={{ color: "#EF4444", fontSize: "0.85rem", lineHeight: 1 }}>●</span>
            <span>Admissions Open</span>
          </div>

          {/* Top-Right Quick Tag */}
          <div
            style={{
              position: "absolute",
              top: "18px",
              right: "18px",
              background: "rgba(0, 0, 0, 0.2)",
              backdropFilter: "blur(6px)",
              color: "#FFFFFF",
              borderRadius: "9999px",
              padding: "5px 12px",
              fontSize: "0.72rem",
              fontWeight: "700"
            }}
          >
            147 Public Universities
          </div>
        </div>

        {/* Bottom Half: Pure White Background */}
        <div style={{ padding: "26px 24px" }}>
          
          {/* Dark Navy Pill Badge ("500+ PROGRAMS THIS WEEK") */}
          <div style={{ marginBottom: "12px" }}>
            <span className="pill-dark">
              500+ PROGRAMS THIS WEEK
            </span>
          </div>

          {/* Large Bold Title */}
          <h2
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "1.9rem",
              fontWeight: "800",
              color: "#0F172A",
              lineHeight: 1.15,
              marginBottom: "6px",
              letterSpacing: "-0.02em"
            }}
          >
            Public Universities
          </h2>

          {/* Medium Gray Subtitle */}
          <p
            style={{
              fontSize: "1.05rem",
              fontWeight: "500",
              color: "#64748B",
              marginBottom: "18px",
              lineHeight: 1.4
            }}
          >
            100% English taught Masters
          </p>

          {/* Bottom Interactive Row with CTA */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "16px",
              borderTop: "1px solid #F1F5F9"
            }}
          >
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.75rem", background: "#F1F5F9", color: "#475569", padding: "4px 10px", borderRadius: "999px", fontWeight: "600" }}>
                €0 Tuition (Germany)
              </span>
              <span style={{ fontSize: "0.75rem", background: "#F1F5F9", color: "#475569", padding: "4px 10px", borderRadius: "999px", fontWeight: "600" }}>
                Nordic Direct
              </span>
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                color: "#0F172A",
                fontWeight: "800",
                fontSize: "0.88rem"
              }}
            >
              <span>Explore All</span>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  backgroundColor: "#FDE047",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <ArrowRight size={15} color="#0F172A" />
              </div>
            </div>
          </div>

        </div>
      </div>


      {/* =========================================================
          CARD 2: SPLIT LAYOUT - VISA & FINANCIAL GUIDES
          ========================================================= */}
      <div
        className="card-split-layout"
        onClick={() => {
          if (onSelectTab) onSelectTab("visas");
        }}
      >
        {/* Left Side: Content */}
        <div style={{ flex: 1, pr: "12px" }}>
          
          {/* Dark Pill Badge ("NEW RULES") */}
          <div style={{ marginBottom: "10px" }}>
            <span className="pill-dark">
              NEW RULES
            </span>
          </div>

          {/* Large Bold Title */}
          <h3
            style={{
              fontSize: "1.45rem",
              fontWeight: "800",
              color: "#0F172A",
              lineHeight: 1.2,
              marginBottom: "6px",
              letterSpacing: "-0.015em"
            }}
          >
            Visa Requirements
          </h3>

          {/* Gray Subtitle */}
          <p
            style={{
              fontSize: "0.95rem",
              fontWeight: "500",
              color: "#64748B",
              marginBottom: "14px",
              lineHeight: 1.4
            }}
          >
            Proof of funds calculators
          </p>

          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", fontWeight: "700", color: "#2563EB" }}>
            <span>€11,904 Blocked Account • 214(b) Risk</span>
            <ArrowRight size={13} />
          </div>
        </div>

        {/* Right Side: Graphic Showing Overlapping 3D Books & Documents */}
        <div
          style={{
            width: "120px",
            height: "110px",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
          }}
        >
          {/* Document 1: Deep Blue Official Passport / Guide (Back) */}
          <div
            style={{
              position: "absolute",
              width: "74px",
              height: "92px",
              background: "linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 100%)",
              borderRadius: "8px",
              boxShadow: "0 6px 14px rgba(30, 58, 138, 0.28)",
              transform: "rotate(-12deg) translate(-10px, 4px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-around",
              padding: "8px 6px",
              border: "1px solid rgba(255, 255, 255, 0.2)"
            }}
          >
            <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: "1.5px solid #FDE047", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "10px", color: "#FDE047" }}>★</span>
            </div>
            <div style={{ width: "80%", height: "2px", background: "rgba(253, 224, 71, 0.6)" }} />
            <div style={{ width: "60%", height: "2px", background: "rgba(255, 255, 255, 0.4)" }} />
          </div>

          {/* Document 2: Vibrant Green Visa Certificate (Front) */}
          <div
            style={{
              position: "absolute",
              width: "78px",
              height: "96px",
              background: "#FFFFFF",
              borderRadius: "10px",
              boxShadow: "0 8px 18px rgba(0, 0, 0, 0.12)",
              transform: "rotate(6deg) translate(8px, -2px)",
              display: "flex",
              flexDirection: "column",
              padding: "10px 8px",
              border: "1px solid #E2E8F0"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <ShieldCheck size={16} color="#10B981" />
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#FEF08A" }} />
            </div>
            <div style={{ width: "90%", height: "4px", background: "#0F172A", borderRadius: "2px", marginBottom: "4px" }} />
            <div style={{ width: "70%", height: "3px", background: "#94A3B8", borderRadius: "2px", marginBottom: "3px" }} />
            <div style={{ width: "80%", height: "3px", background: "#CBD5E1", borderRadius: "2px", marginBottom: "8px" }} />
            <div
              style={{
                marginTop: "auto",
                background: "#DCFCE7",
                color: "#166534",
                fontSize: "0.55rem",
                fontWeight: "800",
                padding: "2px 4px",
                borderRadius: "4px",
                textAlign: "center"
              }}
            >
              VERIFIED
            </div>
          </div>
        </div>

      </div>


      {/* =========================================================
          CARD 3: SPLIT LAYOUT - SCHOLARSHIP MATCHING
          ========================================================= */}
      <div
        className="card-split-layout"
        onClick={() => {
          if (onSelectTab) onSelectTab("scholarships");
        }}
      >
        {/* Left Side: Content */}
        <div style={{ flex: 1, pr: "12px" }}>
          
          {/* Dark Pill Badge ("€30M+ FUNDING") */}
          <div style={{ marginBottom: "10px" }}>
            <span className="pill-dark">
              €30M+ FUNDING
            </span>
          </div>

          {/* Large Bold Title */}
          <h3
            style={{
              fontSize: "1.45rem",
              fontWeight: "800",
              color: "#0F172A",
              lineHeight: 1.2,
              marginBottom: "6px",
              letterSpacing: "-0.015em"
            }}
          >
            Scholarships
          </h3>

          {/* Gray Subtitle */}
          <p
            style={{
              fontSize: "0.95rem",
              fontWeight: "500",
              color: "#64748B",
              marginBottom: "14px",
              lineHeight: 1.4
            }}
          >
            Curated funding resources
          </p>

          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", fontWeight: "700", color: "#8B5CF6" }}>
            <span>DAAD • Erasmus Mundus • Eiffel</span>
            <ArrowRight size={13} />
          </div>
        </div>

        {/* Right Side: Overlapping Vibrant Purple and Blue Graphical UI Cards */}
        <div
          style={{
            width: "120px",
            height: "110px",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
          }}
        >
          {/* Card 1: Vibrant Purple Card (Back) */}
          <div
            style={{
              position: "absolute",
              width: "82px",
              height: "56px",
              background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
              borderRadius: "10px",
              boxShadow: "0 6px 14px rgba(109, 40, 217, 0.3)",
              transform: "rotate(-10deg) translate(-6px, -14px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "7px 8px",
              border: "1px solid rgba(255, 255, 255, 0.2)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Award size={13} color="#FDE047" />
              <span style={{ fontSize: "0.6rem", fontWeight: "800", color: "#FFFFFF" }}>€1,200/mo</span>
            </div>
            <div style={{ width: "60%", height: "2px", background: "rgba(255, 255, 255, 0.6)", borderRadius: "1px" }} />
          </div>

          {/* Card 2: Vibrant Cyan / Blue Card (Front) */}
          <div
            style={{
              position: "absolute",
              width: "86px",
              height: "60px",
              background: "linear-gradient(135deg, #0284C7 0%, #0369A1 100%)",
              borderRadius: "10px",
              boxShadow: "0 8px 18px rgba(3, 105, 161, 0.28)",
              transform: "rotate(8deg) translate(6px, 10px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "8px 9px",
              border: "1px solid rgba(255, 255, 255, 0.25)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#FDE047", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "9px", fontWeight: "900", color: "#0F172A" }}>€</span>
              </div>
              <span style={{ fontSize: "0.62rem", fontWeight: "800", color: "#FFFFFF" }}>100% Grant</span>
            </div>
            <div style={{ width: "75%", height: "3px", background: "#FFFFFF", borderRadius: "2px" }} />
          </div>
        </div>

      </div>


      {/* =========================================================
          CARD 4: 3D GLOBE DESTINATION SELECTOR CALLOUT
          ========================================================= */}
      <div 
        className="card-modern"
        style={{ padding: "24px" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="pill-yellow">
              🌍 3D EXPLORER
            </span>
            <span style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: "600" }}>
              Interactive WebGL
            </span>
          </div>
          <span style={{ fontSize: "0.82rem", fontWeight: "700", color: "#0F172A" }}>
            Destination: {selectedCountry}
          </span>
        </div>

        <h3 style={{ fontSize: "1.35rem", fontWeight: "800", color: "#0F172A", marginBottom: "6px" }}>
          Interactive Destination Globe
        </h3>
        <p style={{ fontSize: "0.92rem", color: "#64748B", marginBottom: "16px" }}>
          Rotate the 3D globe to center your destination country and instantly filter English Master's programs.
        </p>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
          {["Germany", "France", "Netherlands", "Sweden", "Italy", "Austria"].map(country => (
            <button
              key={country}
              onClick={() => {
                if (onSelectCountry) onSelectCountry(country);
              }}
              style={{
                background: selectedCountry === country ? "#0F172A" : "#F1F5F9",
                color: selectedCountry === country ? "#FFFFFF" : "#334155",
                border: "none",
                borderRadius: "9999px",
                padding: "6px 14px",
                fontSize: "0.8rem",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              {country}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            if (onOpenGlobe) onOpenGlobe();
          }}
          className="btn-yellow"
          style={{ width: "100%", justifyContent: "center", padding: "11px", fontSize: "0.92rem" }}
        >
          Open Interactive 3D Globe View →
        </button>
      </div>


      {/* =========================================================
          CARD 5: PROFILE & ADMISSION ODDS INTAKE CALLOUT
          ========================================================= */}
      <div 
        className="card-modern"
        style={{ padding: "24px", background: "#FFFFFF" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
          <span className="pill-dark">
            INSTANT EVALUATOR
          </span>
        </div>

        <h3 style={{ fontSize: "1.35rem", fontWeight: "800", color: "#0F172A", marginBottom: "6px" }}>
          Calculate Admission & Visa Odds
        </h3>
        <p style={{ fontSize: "0.92rem", color: "#64748B", marginBottom: "18px" }}>
          Input your CGPA, IELTS score, and sponsor financial profile to calculate admission cutoffs and consular refusal risks.
        </p>

        <button
          onClick={() => {
            if (onStartEvaluation) onStartEvaluation();
          }}
          className="btn-yellow"
          style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: "0.92rem" }}
        >
          Start Admission & Visa Assessment →
        </button>
      </div>

    </div>
  );
}
