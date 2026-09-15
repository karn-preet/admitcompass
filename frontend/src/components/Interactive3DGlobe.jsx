import React, { useState, useEffect, useRef, useMemo, Suspense } from "react";
import GlobeSkeletonLoader from "./GlobeSkeletonLoader";
import { Compass, RotateCcw, MapPin, Sparkles, Building2, ChevronRight, Award, Info } from "lucide-react";

// Technical Requirement 1: Code-Splitting & Lazy Loading of heavy 3D WebGL Bundle
const Interactive3DGlobeCanvas = React.lazy(() => import("./Interactive3DGlobeCanvas"));

// Key EU destination quick filters
const FEATURED_DESTINATIONS = [
  { name: "Germany", flag: "🇩🇪", highlight: "€0 Tuition" },
  { name: "France", flag: "🇫🇷", highlight: "€243/yr" },
  { name: "Netherlands", flag: "🇳🇱", highlight: "Tech Leader" },
  { name: "Sweden", flag: "🇸🇪", highlight: "Innovation" },
  { name: "Italy", flag: "🇮🇹", highlight: "DSU Subsidies" },
  { name: "Austria", flag: "🇦🇹", highlight: "Alpine Research" },
  { name: "Spain", flag: "🇪🇸", highlight: "Low Living Cost" },
  { name: "Ireland", flag: "🇮🇪", highlight: "English Native" },
  { name: "Finland", flag: "🇫🇮", highlight: "AI & CleanTech" }
];

function Interactive3DGlobeComponent({
  selectedCountry = "All",
  onSelectCountry,
  universities = []
}) {
  const containerRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 700, height: 500 });

  // Technical Requirement 2 & 5: Memoized University Counts per Country
  const universityCounts = useMemo(() => {
    const counts = {};
    universities.forEach((u) => {
      const country = u.country;
      if (country) {
        counts[country] = (counts[country] || 0) + 1;
      }
    });
    return counts;
  }, [universities]);

  // Technical Requirement 3: Intersection Observer (Render on Demand)
  useEffect(() => {
    const target = containerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // Once in view, we keep it loaded for smooth interaction
        }
      },
      {
        root: null,
        rootMargin: "150px", // prefetch slightly before scrolling into viewport
        threshold: 0.1
      }
    );

    observer.observe(target);
    return () => {
      observer.disconnect();
    };
  }, []);

  // Responsive width calculation based on card container
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const w = Math.min(800, Math.max(340, rect.width > 900 ? 680 : rect.width - 40));
        const h = Math.min(540, Math.max(420, Math.round(w * 0.76)));
        setDimensions({ width: w, height: h });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const activeCountryCount = selectedCountry && selectedCountry !== "All"
    ? universityCounts[selectedCountry] || 0
    : universities.length;

  return (
    <section 
      id="3d-globe-destination-section"
      ref={containerRef}
      style={{
        margin: "0 auto 48px auto",
        width: "100%",
        maxWidth: "1320px",
        padding: "0 24px"
      }}
    >
      <div 
        className="card-woolmers" 
        style={{
          background: "linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 100%)",
          borderRadius: "18px",
          border: "1px solid var(--border-subtle, rgba(226, 221, 212, 0.8))",
          padding: "32px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)"
        }}
      >
        {/* Section Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent-gold, #B38E5D)", marginBottom: "8px" }}>
              <Compass size={14} />
              <span>Interactive 3D Destination Navigator</span>
            </div>
            <h2 
              style={{ 
                fontFamily: "var(--font-serif)", 
                fontSize: "clamp(1.6rem, 3vw, 2.2rem)", 
                color: "var(--text-primary)", 
                lineHeight: 1.2,
                margin: 0
              }}
            >
              Select Your Study Destination via 3D World Globe
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginTop: "6px", maxWidth: "680px" }}>
              Click any sovereign country on the rotating globe to automatically fly the camera, highlight borders, 
              and filter English-taught Master's degrees directly in the public university directory below.
            </p>
          </div>

          {/* Active Selection Badge & Reset Button */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <div 
              style={{
                background: selectedCountry && selectedCountry !== "All" ? "rgba(179, 142, 93, 0.12)" : "rgba(30, 58, 43, 0.08)",
                border: selectedCountry && selectedCountry !== "All" ? "1.5px solid var(--accent-gold, #B38E5D)" : "1.5px solid rgba(30, 58, 43, 0.2)",
                borderRadius: "10px",
                padding: "8px 16px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <MapPin size={16} color={selectedCountry && selectedCountry !== "All" ? "#B38E5D" : "#1E3A2B"} />
              <div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                  Active Destination Filter
                </div>
                <div style={{ fontSize: "0.98rem", fontWeight: 800, color: "var(--text-primary)" }}>
                  {selectedCountry && selectedCountry !== "All" ? selectedCountry : "All 27 EU Nations & Global"}
                  <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginLeft: "6px", fontWeight: 600 }}>
                    ({activeCountryCount} unis)
                  </span>
                </div>
              </div>
            </div>

            {selectedCountry && selectedCountry !== "All" && (
              <button
                type="button"
                onClick={() => onSelectCountry && onSelectCountry("All")}
                className="btn btn-secondary"
                style={{
                  padding: "9px 14px",
                  fontSize: "0.82rem",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
                title="Reset destination filter and view all 147 public universities"
              >
                <RotateCcw size={14} />
                <span>Show All EU Nations</span>
              </button>
            )}
          </div>
        </div>

        {/* Interactive 3D Canvas Stage */}
        <div 
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "24px",
            alignItems: "center",
            background: "radial-gradient(ellipse at center, rgba(250, 248, 245, 1) 0%, rgba(244, 240, 232, 0.5) 100%)",
            borderRadius: "16px",
            padding: "20px",
            border: "1px solid rgba(226, 221, 212, 0.6)",
            position: "relative",
            overflow: "hidden"
          }}
        >
          {/* Main 3D WebGL Canvas or Suspense Skeleton Loader */}
          <div style={{ position: "relative", minHeight: "440px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {isInView ? (
              <Suspense fallback={<GlobeSkeletonLoader height={dimensions.height} />}>
                <Interactive3DGlobeCanvas 
                  selectedCountry={selectedCountry}
                  onSelectCountry={onSelectCountry}
                  universityCounts={universityCounts}
                  width={dimensions.width}
                  height={dimensions.height}
                />
              </Suspense>
            ) : (
              <GlobeSkeletonLoader height={dimensions.height} />
            )}

            {/* Subtle Floating Interactive Hint Pill */}
            <div 
              style={{
                position: "absolute",
                bottom: "12px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(255, 255, 255, 0.92)",
                backdropFilter: "blur(6px)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "999px",
                padding: "4px 14px",
                fontSize: "0.75rem",
                color: "var(--text-secondary)",
                pointerEvents: "none",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
                whiteSpace: "nowrap"
              }}
            >
              <Sparkles size={13} color="var(--accent-gold, #B38E5D)" />
              <span>Auto-rotates • Hover to pause • Click nation to fly & filter directory</span>
            </div>
          </div>

          {/* Quick Destination Sidebar Tray */}
          <div 
            style={{
              width: "280px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              paddingLeft: "16px",
              borderLeft: "1px solid var(--border-subtle)"
            }}
          >
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>
              Quick EU Destination Fly-To
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "420px", overflowY: "auto", paddingRight: "4px" }}>
              {FEATURED_DESTINATIONS.map((dest) => {
                const count = universityCounts[dest.name] || 0;
                const isSelected = selectedCountry === dest.name;

                return (
                  <button
                    key={dest.name}
                    type="button"
                    onClick={() => onSelectCountry && onSelectCountry(dest.name)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: isSelected ? "1.5px solid var(--accent-gold, #B38E5D)" : "1px solid var(--border-subtle)",
                      background: isSelected ? "rgba(179, 142, 93, 0.12)" : "#FFFFFF",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s ease",
                      fontFamily: "var(--font-sans)"
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.borderColor = "var(--accent-gold)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.borderColor = "var(--border-subtle)";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "1.15rem" }}>{dest.flag}</span>
                      <div>
                        <div style={{ fontSize: "0.86rem", fontWeight: isSelected ? 800 : 600, color: "var(--text-primary)" }}>
                          {dest.name}
                        </div>
                        <div style={{ fontSize: "0.7rem", color: isSelected ? "#B38E5D" : "var(--text-muted)" }}>
                          {dest.highlight}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <span 
                        style={{ 
                          fontSize: "0.75rem", 
                          fontWeight: 700, 
                          color: isSelected ? "#B38E5D" : "var(--accent-green, #1E3A2B)",
                          background: isSelected ? "rgba(179, 142, 93, 0.2)" : "rgba(30, 58, 43, 0.08)",
                          padding: "2px 6px",
                          borderRadius: "4px"
                        }}
                      >
                        {count} unis
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// Technical Requirement 5: Strict Memoization boundary preventing unnecessary canvas re-renders
export default React.memo(Interactive3DGlobeComponent);
