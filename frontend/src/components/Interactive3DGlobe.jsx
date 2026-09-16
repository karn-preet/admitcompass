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
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
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

  // Responsive width & height calculation tracking window.innerWidth and card container
  useEffect(() => {
    const updateSize = () => {
      const winW = typeof window !== "undefined" ? window.innerWidth : 1024;
      const winH = typeof window !== "undefined" ? window.innerHeight : 768;
      const mobile = winW < 768;
      setIsMobile(mobile);

      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (mobile) {
          // Mobile View: Canvas width fits comfortably within screen; height is strictly restricted to ~40vh (clamped 240px - 320px)
          const availableW = Math.max(260, Math.floor(Math.min(winW - 32, rect.width > 0 ? rect.width - 20 : winW - 32)));
          const mobileH = Math.min(Math.round(winH * 0.4), 320);
          const clampedH = Math.max(240, mobileH);
          setDimensions({ width: availableW, height: clampedH });
        } else {
          // Desktop View: Side-by-side layout with 280px sidebar
          const availableW = Math.max(480, Math.min(780, rect.width > 900 ? rect.width - 340 : 680));
          const desktopH = Math.min(540, Math.max(420, Math.round(availableW * 0.72)));
          setDimensions({ width: availableW, height: desktopH });
        }
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
      className="globe-section-wrapper"
    >
      <div 
        className="card-woolmers globe-main-card"
      >
        {/* Section Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent-gold, #B38E5D)", marginBottom: "8px" }}>
              <Compass size={14} />
              <span>Interactive 3D Destination Navigator</span>
            </div>
            <h2 
              style={{ 
                fontFamily: "var(--font-serif)", 
                fontSize: "clamp(1.5rem, 3vw, 2.2rem)", 
                color: "var(--text-primary)", 
                lineHeight: 1.2,
                margin: 0
              }}
            >
              Select Your Study Destination via 3D World Globe
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginTop: "6px", maxWidth: "680px" }}>
              Click any sovereign country on the rotating globe to automatically fly the camera, highlight borders, 
              and filter English-taught Master's degrees directly in the public university directory below.
            </p>
          </div>

          {/* Active Selection Badge & Reset Button */}
          <div 
            className="globe-ui-interactive"
            style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <div 
              style={{
                background: selectedCountry && selectedCountry !== "All" ? "rgba(179, 142, 93, 0.12)" : "rgba(30, 58, 43, 0.08)",
                border: selectedCountry && selectedCountry !== "All" ? "1.5px solid var(--accent-gold, #B38E5D)" : "1.5px solid rgba(30, 58, 43, 0.2)",
                borderRadius: "10px",
                padding: "8px 14px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <MapPin size={16} color={selectedCountry && selectedCountry !== "All" ? "#B38E5D" : "#1E3A2B"} />
              <div>
                <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                  Active Destination Filter
                </div>
                <div style={{ fontSize: "0.94rem", fontWeight: 800, color: "var(--text-primary)" }}>
                  {selectedCountry && selectedCountry !== "All" ? selectedCountry : "All 27 EU Nations & Global"}
                  <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginLeft: "6px", fontWeight: 600 }}>
                    ({activeCountryCount} unis)
                  </span>
                </div>
              </div>
            </div>

            {selectedCountry && selectedCountry !== "All" && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectCountry) onSelectCountry("All");
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                }}
                className="btn btn-secondary"
                style={{
                  padding: "9px 14px",
                  fontSize: "0.82rem",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  position: "relative",
                  zIndex: 10,
                  pointerEvents: "auto"
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
          className="globe-stage-container"
        >
          {/* Main 3D WebGL Canvas or Suspense Skeleton Loader */}
          <div 
            className="globe-canvas-stage"
            style={{ 
              position: "relative", 
              minHeight: isMobile ? "240px" : "440px", 
              height: isMobile ? "40vh" : `${dimensions.height}px`,
              maxHeight: isMobile ? "320px" : "540px",
              width: "100%",
              overflow: "hidden",
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              borderRadius: "14px"
            }}
          >
            {isInView ? (
              <Suspense fallback={<GlobeSkeletonLoader height={dimensions.height} />}>
                <Interactive3DGlobeCanvas 
                  selectedCountry={selectedCountry}
                  onSelectCountry={onSelectCountry}
                  universityCounts={universityCounts}
                  width={dimensions.width}
                  height={dimensions.height}
                  isMobile={isMobile}
                />
              </Suspense>
            ) : (
              <GlobeSkeletonLoader height={dimensions.height} />
            )}

            {/* Subtle Floating Interactive Hint Pill */}
            <div 
              className="globe-ui-interactive"
              style={{
                position: "absolute",
                bottom: "10px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(255, 255, 255, 0.94)",
                backdropFilter: "blur(6px)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "999px",
                padding: "3px 12px",
                fontSize: "0.72rem",
                color: "var(--text-secondary)",
                pointerEvents: "none",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
                whiteSpace: "nowrap",
                zIndex: 10,
                maxWidth: "90%",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
            >
              <Sparkles size={12} color="var(--accent-gold, #B38E5D)" />
              <span>{isMobile ? "Drag to rotate • Tap nation to filter" : "Auto-rotates • Hover to pause • Click nation to fly & filter"}</span>
            </div>
          </div>

          {/* Quick Destination Sidebar / Bottom Tray */}
          <div 
            className="globe-sidebar-tray globe-ui-interactive"
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Quick EU Fly-To Filters
              </div>
              {isMobile && (
                <span style={{ fontSize: "0.7rem", color: "var(--accent-gold, #B38E5D)", fontWeight: 700 }}>
                  Tap to fly
                </span>
              )}
            </div>

            <div className="globe-destinations-grid">
              {FEATURED_DESTINATIONS.map((dest) => {
                const count = universityCounts[dest.name] || 0;
                const isSelected = selectedCountry === dest.name;

                return (
                  <button
                    key={dest.name}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectCountry) onSelectCountry(dest.name);
                    }}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                    }}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: isMobile ? "8px 10px" : "8px 12px",
                      borderRadius: "8px",
                      border: isSelected ? "1.5px solid var(--accent-gold, #B38E5D)" : "1px solid var(--border-subtle)",
                      background: isSelected ? "rgba(179, 142, 93, 0.12)" : "#FFFFFF",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s ease",
                      fontFamily: "var(--font-sans)",
                      position: "relative",
                      zIndex: 10,
                      pointerEvents: "auto"
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
