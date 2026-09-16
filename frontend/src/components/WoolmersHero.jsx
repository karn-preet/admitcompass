import React, { useState } from "react";
import { Search, Compass, ShieldCheck, MapPin, ArrowRight, Sparkles, CheckCircle2, GraduationCap } from "lucide-react";

export default function WoolmersHero({
  onSearch,
  onStartEvaluation,
  onExploreUniversities,
  onSelectCountry,
  currentCountry = "All Countries"
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(currentCountry || "All Countries");

  React.useEffect(() => {
    if (currentCountry) {
      setSelectedCountry(currentCountry);
    }
  }, [currentCountry]);

  const popularCountries = [
    "All Countries",
    "Germany",
    "France",
    "Netherlands",
    "Sweden",
    "Italy",
    "Austria",
    "Spain",
    "Ireland",
    "Finland"
  ];

  const quickFilters = [
    { label: "🌍 3D Interactive Globe", isGlobe: true },
    { label: "€0 Tuition (Germany)", country: "Germany", field: "Computer Science" },
    { label: "Data Science & AI", field: "Data Science" },
    { label: "Automotive & Mechanical", field: "Mechanical Engineering" },
    { label: "Nordic Public Unis", country: "Sweden" },
    { label: "Low Living Cost (<€800/mo)", field: "" }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({
        degreeQuery: searchTerm,
        country: selectedCountry === "All Countries" ? "" : selectedCountry
      });
    }
  };

  return (
    <section className="woolmers-hero-wrapper" style={{ position: "relative", width: "100%", overflow: "hidden", marginBottom: "48px" }}>
      {/* Edge-to-Edge Hero Image Container */}
      <div 
        style={{
          position: "relative",
          minHeight: "560px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: "linear-gradient(180deg, rgba(26, 28, 25, 0.42) 0%, rgba(26, 28, 25, 0.72) 60%, rgba(250, 248, 245, 1) 100%), url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=2000&q=85')",
          backgroundSize: "cover",
          backgroundPosition: "center 38%",
          color: "#FFFFFF",
          padding: "70px 24px 90px 24px",
          textAlign: "center"
        }}
      >
        {/* Subtle Ornamental Vignette */}
        <div 
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at center, rgba(30, 58, 43, 0.25) 0%, rgba(10, 15, 12, 0.6) 80%)",
            pointerEvents: "none"
          }} 
        />

        <div className="container" style={{ position: "relative", zIndex: 2, maxWidth: "940px" }}>
          
          {/* Editorial Kicker Badge */}
          <div 
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(250, 248, 245, 0.14)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(250, 248, 245, 0.3)",
              padding: "6px 18px",
              borderRadius: "999px",
              marginBottom: "20px",
              fontSize: "0.78rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontWeight: "700",
              color: "#F4F0E8"
            }}
          >
            <Sparkles size={14} color="#B38E5D" />
            <span>Open-Access Heritage • 147 Public Universities Across 27 EU Nations</span>
          </div>

          {/* Grand Serif Heading */}
          <h1 
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
              fontWeight: 700,
              lineHeight: 1.15,
              color: "#FAF8F5",
              letterSpacing: "-0.02em",
              marginBottom: "18px",
              textShadow: "0 2px 14px rgba(0, 0, 0, 0.35)"
            }}
          >
            Welcome to <span style={{ fontFamily: "var(--font-brand)", fontWeight: "800" }}>Global</span>{" "}
            <span 
              style={{ 
                fontFamily: "var(--font-gurmukhi)", 
                color: "#0F172A", 
                backgroundColor: "#FDE047", 
                padding: "2px 14px", 
                borderRadius: "12px", 
                fontWeight: "900",
                display: "inline-block",
                boxShadow: "0 4px 14px rgba(0, 0, 0, 0.3)"
              }}
            >
              ਪੰਜਾਬ
            </span>
            <br />
            <span style={{ fontSize: "0.72em", fontWeight: "600", opacity: 0.95 }}>
              Discover Prestigious Public Universities Across Europe & Beyond
            </span>
          </h1>

          {/* Editorial Subtitle */}
          <p 
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(1rem, 2vw, 1.18rem)",
              lineHeight: 1.6,
              color: "rgba(250, 248, 245, 0.92)",
              maxWidth: "760px",
              margin: "0 auto 36px auto",
              fontWeight: 400,
              textShadow: "0 1px 6px rgba(0, 0, 0, 0.25)"
            }}
          >
            Compare your academic standing against historical public university cutoffs, 
            evaluate tuition-free English-taught Master’s programs, and pre-empt consular visa refusals—completely free.
          </p>

          {/* Centralized Search Bar (Woolmers-Inspired Elevated Island) */}
          <div 
            style={{
              background: "#FFFFFF",
              borderRadius: "14px",
              boxShadow: "0 14px 40px rgba(0, 0, 0, 0.25), 0 4px 10px rgba(0, 0, 0, 0.1)",
              padding: "10px 14px",
              maxWidth: "840px",
              margin: "0 auto",
              border: "1px solid rgba(226, 221, 212, 0.8)",
              display: "flex",
              flexDirection: "column",
              gap: "10px"
            }}
          >
            <form 
              onSubmit={handleSearchSubmit}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flexWrap: "wrap"
              }}
            >
              {/* Field/Degree Input */}
              <div style={{ flex: "2 1 240px", display: "flex", alignItems: "center", gap: "10px", padding: "6px 12px", background: "var(--bg-main)", borderRadius: "8px" }}>
                <Search size={18} color="var(--accent-green)" />
                <input
                  type="text"
                  placeholder="Master's degree or field (e.g. Data Science, Robotics)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    border: "none",
                    background: "transparent",
                    outline: "none",
                    width: "100%",
                    fontSize: "0.95rem",
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-sans)"
                  }}
                />
              </div>

              {/* Country Selector */}
              <div style={{ flex: "1 1 180px", display: "flex", alignItems: "center", gap: "8px", padding: "6px 12px", background: "var(--bg-main)", borderRadius: "8px" }}>
                <MapPin size={18} color="var(--accent-gold)" />
                <select
                  value={selectedCountry}
                  onChange={(e) => {
                    setSelectedCountry(e.target.value);
                    if (onSelectCountry) onSelectCountry(e.target.value);
                  }}
                  style={{
                    border: "none",
                    background: "transparent",
                    outline: "none",
                    width: "100%",
                    fontSize: "0.9rem",
                    color: "var(--text-primary)",
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                    fontWeight: 500
                  }}
                >
                  {popularCountries.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* 3D Globe Destination Trigger */}
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("3d-globe-destination-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "rgba(179, 142, 93, 0.12)",
                  border: "1px solid var(--accent-gold, #B38E5D)",
                  borderRadius: "8px",
                  padding: "10px 14px",
                  color: "var(--accent-gold, #B38E5D)",
                  fontSize: "0.86rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s ease"
                }}
                title="Launch 3D Interactive World Globe"
              >
                <Compass size={16} />
                <span>3D Globe 🌍</span>
              </button>

              {/* Search / Action Button */}
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  flex: "0 0 auto",
                  padding: "13px 26px",
                  borderRadius: "8px",
                  fontSize: "0.95rem",
                  letterSpacing: "0.02em"
                }}
              >
                <span>Search Unis</span>
                <ArrowRight size={16} />
              </button>
            </form>

            {/* Quick Keyword Chips */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", paddingTop: "4px", borderTop: "1px solid var(--border-subtle)", fontSize: "0.78rem" }}>
              <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>Quick Filters:</span>
              {quickFilters.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (q.isGlobe) {
                      const el = document.getElementById("3d-globe-destination-section");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                      return;
                    }
                    setSearchTerm(q.field || "");
                    if (q.country) {
                      setSelectedCountry(q.country);
                      if (onSelectCountry) onSelectCountry(q.country);
                    }
                    if (onSearch) {
                      onSearch({ degreeQuery: q.field || "", country: q.country || "" });
                    }
                  }}
                  style={{
                    background: q.isGlobe ? "rgba(179, 142, 93, 0.15)" : "var(--bg-secondary)",
                    border: q.isGlobe ? "1px solid var(--accent-gold)" : "1px solid var(--border-warm)",
                    borderRadius: "999px",
                    padding: "3px 10px",
                    color: q.isGlobe ? "var(--accent-gold)" : "var(--text-secondary)",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                    fontWeight: q.isGlobe ? 700 : 500,
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--accent-green)";
                    e.currentTarget.style.color = "var(--accent-green)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-warm)";
                    e.currentTarget.style.color = "var(--text-secondary)";
                  }}
                >
                  {q.label}
                </button>
              ))}
            </div>

          </div>

          {/* Two Hero Action CTA Buttons */}
          <div style={{ display: "flex", justifyContent: "center", gap: "14px", marginTop: "24px", flexWrap: "wrap" }}>
            <button
              onClick={onStartEvaluation}
              className="btn"
              style={{
                backgroundColor: "var(--accent-gold)",
                color: "#0F172A",
                padding: "12px 24px",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "0.92rem",
                boxShadow: "0 6px 16px rgba(179, 142, 93, 0.35)"
              }}
            >
              <Compass size={17} />
              <span>Evaluate My Full Profile (Free)</span>
            </button>
            <button
              onClick={onExploreUniversities}
              className="btn"
              style={{
                backgroundColor: "rgba(250, 248, 245, 0.15)",
                color: "#FFFFFF",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(250, 248, 245, 0.4)",
                padding: "12px 24px",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "0.92rem"
              }}
            >
              <GraduationCap size={17} />
              <span>Explore 147 Public Universities</span>
            </button>
          </div>

        </div>
      </div>

      {/* Heritage Stat Strip (Woolmers Macro-Whitespace & Trust Markers) */}
      <div 
        style={{
          background: "#FFFFFF",
          borderBottom: "1px solid var(--border-subtle)",
          boxShadow: "var(--shadow-sm)",
          padding: "18px 24px"
        }}
      >
        <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", textAlign: "center" }}>
          <div style={{ padding: "8px 12px", borderRight: "1px solid var(--border-subtle)" }}>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.7rem", fontWeight: 700, color: "var(--accent-green)" }}>
              147
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
              Public EU Universities
            </div>
          </div>
          <div style={{ padding: "8px 12px", borderRight: "1px solid var(--border-subtle)" }}>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.7rem", fontWeight: 700, color: "var(--accent-green)" }}>
              27
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
              EU Member Nations
            </div>
          </div>
          <div style={{ padding: "8px 12px", borderRight: "1px solid var(--border-subtle)" }}>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.7rem", fontWeight: 700, color: "var(--accent-gold)" }}>
              €0
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
              Paywalls • 100% Free
            </div>
          </div>
          <div style={{ padding: "8px 12px" }}>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.7rem", fontWeight: 700, color: "var(--accent-green)" }}>
              Official
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
              DAAD & Embassy Benchmarks
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
