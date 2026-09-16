import React, { useState, useEffect, useMemo } from "react";
import { 
  Building2, 
  MapPin, 
  Euro, 
  ArrowRight, 
  Search, 
  Filter, 
  Sparkles, 
  Compass, 
  Check, 
  ShoppingCart, 
  ExternalLink,
  GraduationCap,
  Award
} from "lucide-react";
import { fetchUniversities, matchUniversities } from "../services/api";
import { useProfile } from "../context/ProfileContext";
import UniversityDetailModal from "./UniversityDetailModal";
import IndianVisaBadge from "./IndianVisaBadge";
import RealityCheckGauge from "./RealityCheckGauge";
import { getLORBadge } from "../services/lorRequirements";

const COUNTRY_FLAGS = {
  "Germany": "🇩🇪",
  "France": "🇫🇷",
  "Netherlands": "🇳🇱",
  "Sweden": "🇸🇪",
  "Italy": "🇮🇹",
  "Austria": "🇦🇹",
  "Spain": "🇪🇸",
  "Ireland": "🇮🇪",
  "Finland": "🇫🇮",
  "Belgium": "🇧🇪",
  "Denmark": "🇩🇰",
  "Poland": "🇵🇱",
  "Czechia": "🇨🇿",
  "Portugal": "🇵🇹",
  "Greece": "🇬🇷",
  "Hungary": "🇭🇺",
  "Estonia": "🇪🇪",
  "Lithuania": "🇱🇹",
  "Latvia": "🇱🇻",
  "Slovenia": "🇸🇮",
  "Slovakia": "🇸🇰",
  "Croatia": "🇭🇷",
  "Luxembourg": "🇱🇺",
  "Cyprus": "🇨🇾",
  "Malta": "🇲🇹",
  "Bulgaria": "🇧🇬",
  "Romania": "🇷🇴",
  "United Kingdom": "🇬🇧",
  "UK": "🇬🇧",
  "USA": "🇺🇸",
  "Canada": "🇨🇦",
  "Australia": "🇦🇺"
};

// Curated high-resolution European university architectural photography
const CAMPUS_IMAGES = {
  "Germany": [
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=800&q=80"
  ],
  "France": [
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1549144511-f099e773c147?auto=format&fit=crop&w=800&q=80"
  ],
  "Netherlands": [
    "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1576085898323-218337e3e43c?auto=format&fit=crop&w=800&q=80"
  ],
  "Sweden": [
    "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80"
  ],
  "Italy": [
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80"
  ],
  "Austria": [
    "https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1609852217887-b69512399fc0?auto=format&fit=crop&w=800&q=80"
  ],
  "Spain": [
    "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80"
  ],
  "Ireland": [
    "https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=800&q=80"
  ],
  "default": [
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80"
  ]
};

function getUniversityImage(uni, index) {
  const countryList = CAMPUS_IMAGES[uni.country] || CAMPUS_IMAGES["default"];
  return countryList[index % countryList.length];
}

export default function WoolmersUniversityGrid({
  initialSearchQuery = "",
  initialCountry = "All",
  onCountryChange,
  cartItems = [],
  onToggleCartItem,
  onOpenCart,
  onStartEvaluation
}) {
  const { profile, setTestProfile, clearProfile, isProfileActive } = useProfile();
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(initialCountry);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [zeroTuitionOnly, setZeroTuitionOnly] = useState(false);
  const [userCGPAFilter, setUserCGPAFilter] = useState("all");
  const [selectedUniModal, setSelectedUniModal] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadUnis() {
      try {
        setLoading(true);
        let res;
        if (isProfileActive) {
          res = await matchUniversities({
            cgpa: profile.cgpa,
            currentDegree: profile.currentDegree,
            degreeType: profile.degreeType,
            field: profile.field,
            ieltsScore: profile.ieltsScore,
            financialCapacityEUR: profile.financialCapacityEUR,
            country: selectedCountry !== "All" && selectedCountry !== "All Countries" ? selectedCountry : undefined
          });
        } else {
          res = await fetchUniversities({
            country: selectedCountry !== "All" && selectedCountry !== "All Countries" ? selectedCountry : undefined
          });
        }
        if (isMounted && res && res.success && Array.isArray(res.data)) {
          setUniversities(res.data);
        }
      } catch (err) {
        console.error("Failed to load universities for grid:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadUnis();
    return () => { isMounted = false; };
  }, [
    isProfileActive,
    profile.cgpa,
    profile.degreeType,
    profile.field,
    profile.financialCapacityEUR,
    profile.ieltsScore,
    profile.currentDegree,
    selectedCountry
  ]);

  useEffect(() => {
    if (initialCountry) setSelectedCountry(initialCountry);
  }, [initialCountry]);

  useEffect(() => {
    if (initialSearchQuery) setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);

  const countryTabs = [
    "All",
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

  const filteredUniversities = useMemo(() => {
    return universities.filter(u => {
      // Country match
      if (selectedCountry !== "All" && selectedCountry !== "All Countries") {
        if (selectedCountry === "EU") {
          if (!u.region || !u.region.includes("EU")) return false;
        } else if (u.country?.toLowerCase() !== selectedCountry.toLowerCase()) {
          return false;
        }
      }

      // Zero tuition match
      if (zeroTuitionOnly && (u.tuitionFeeEUR || 0) > 0) {
        return false;
      }

      // User CGPA Cutoff Match
      if (userCGPAFilter !== "all") {
        const threshold = parseFloat(userCGPAFilter);
        if (u.minCGPA10 && threshold < u.minCGPA10) {
          return false;
        }
      }

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inName = u.name?.toLowerCase().includes(q);
        const inCity = u.city?.toLowerCase().includes(q);
        const inCountry = u.country?.toLowerCase().includes(q);
        const inFields = Array.isArray(u.fields) && u.fields.some(f => f.toLowerCase().includes(q));
        if (!inName && !inCity && !inCountry && !inFields) return false;
      }

      return true;
    });
  }, [universities, selectedCountry, zeroTuitionOnly, userCGPAFilter, searchQuery]);

  return (
    <section id="university-grid-section" style={{ width: "100%", padding: "60px 0", background: "var(--bg-main)" }}>
      <div className="container">

        {/* Section Header with Woolmers Editorial Styling */}
        <div style={{ textAlign: "center", maxWidth: "820px", margin: "0 auto 40px auto" }}>
          <span className="editorial-kicker">
            The Public University Directory
          </span>
          <h2 
            style={{ 
              fontFamily: "var(--font-serif)", 
              fontSize: "clamp(2.2rem, 4vw, 3rem)", 
              color: "var(--text-primary)",
              marginBottom: "14px" 
            }}
          >
            Curated Academic Excellence
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.08rem", lineHeight: 1.6 }}>
            Browse accredited public universities across all 27 European Union member states. 
            Inspect tuition fees, historical cutoffs, verified student housing, and consular visa requirements.
          </p>
        </div>

        {/* Personalized Matching & Test Case Simulation Control Bar */}
        <div 
          style={{
            background: isProfileActive ? "rgba(46, 125, 50, 0.06)" : "#FFFFFF",
            borderRadius: "14px",
            border: isProfileActive ? "1px solid #81C784" : "1px solid var(--border-subtle)",
            boxShadow: "var(--shadow-sm)",
            padding: "16px 20px",
            marginBottom: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "14px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <div 
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "5px 12px",
                borderRadius: "999px",
                background: isProfileActive ? "#2E7D32" : "#334155",
                color: "#FFFFFF",
                fontSize: "0.78rem",
                fontWeight: 700,
                letterSpacing: "0.04em"
              }}
            >
              <Sparkles size={13} />
              <span>{isProfileActive ? "PERSONALIZED ENGINE: ACTIVE" : "STANDARD PUBLIC CATALOG"}</span>
            </div>
            <div style={{ fontSize: "0.88rem", color: "var(--text-secondary)", fontWeight: 500 }}>
              {isProfileActive ? (
                <span>
                  Enforcing strict cutoffs for: <strong style={{ color: "var(--text-primary)" }}>{profile.currentDegree || "B.Tech CSE"}</strong> • Min CGPA Cutoff: <strong style={{ color: "var(--accent-green)" }}>≤ {profile.cgpa}</strong> • Programs requiring &gt; {profile.cgpa} strictly hidden.
                </span>
              ) : (
                <span>
                  Browsing unfiltered public database. Run the evaluator or simulate a profile to auto-filter by your CGPA and financial capacity.
                </span>
              )}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            {/* Automated Test Case Button */}
            <button
              type="button"
              id="btn-simulate-test-profile"
              onClick={() => setTestProfile()}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #1E293B, #0F172A)",
                color: "#FFFFFF",
                border: "1px solid #334155",
                fontWeight: 600,
                fontSize: "0.84rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                transition: "all 0.2s ease"
              }}
              title="Simulate a user pursuing B.Tech in CSE with 7.0 CGPA"
            >
              <span>🧪</span>
              <span>Simulate Test Profile (B.Tech CSE, 7.0 CGPA)</span>
            </button>

            {isProfileActive && (
              <button
                type="button"
                id="btn-reset-profile-filter"
                onClick={() => clearProfile()}
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  background: "#FFFFFF",
                  color: "#475569",
                  border: "1px solid var(--border-warm)",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  cursor: "pointer"
                }}
              >
                Reset to Full Catalog
              </button>
            )}
          </div>
        </div>

        {/* Filter Toolbar */}
        <div 
          style={{
            background: "#FFFFFF",
            borderRadius: "14px",
            border: "1px solid var(--border-subtle)",
            boxShadow: "var(--shadow-sm)",
            padding: "16px 20px",
            marginBottom: "36px",
            display: "flex",
            flexDirection: "column",
            gap: "14px"
          }}
        >
          {/* Top Line: Search & Quick Toggle */}
          <div style={{ display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 280px", display: "flex", alignItems: "center", gap: "10px", background: "var(--bg-main)", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--border-warm)" }}>
              <Search size={18} color="var(--accent-green)" />
              <input
                type="text"
                placeholder="Search university by name, city, or field (e.g. TUM, Data Science)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  width: "100%",
                  fontSize: "0.92rem",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-sans)"
                }}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.8rem" }}
                >
                  Clear
                </button>
              )}
            </div>

            {/* Zero Tuition Toggle */}
            <label style={{ display: "inline-flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "0.86rem", fontWeight: 600, color: "var(--text-secondary)" }}>
              <input 
                type="checkbox"
                checked={zeroTuitionOnly}
                onChange={(e) => setZeroTuitionOnly(e.target.checked)}
                style={{ accentColor: "var(--accent-green)", width: "16px", height: "16px", cursor: "pointer" }}
              />
              <span>Show €0 Tuition Only</span>
            </label>

            {/* User CGPA Cutoff Eligibility Filter */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)", fontWeight: 600 }}>
                My CGPA:
              </span>
              <select
                value={userCGPAFilter}
                onChange={(e) => setUserCGPAFilter(e.target.value)}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid var(--border-warm)",
                  borderRadius: "6px",
                  padding: "4px 8px",
                  fontSize: "0.82rem",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  fontWeight: 500
                }}
              >
                <option value="all">All Cutoffs (0 - 10)</option>
                <option value="6.5">Eligible with ≤ 6.5 CGPA</option>
                <option value="7.0">Eligible with ≤ 7.0 CGPA</option>
                <option value="7.5">Eligible with ≤ 7.5 CGPA</option>
                <option value="8.0">Eligible with ≤ 8.0 CGPA</option>
                <option value="8.5">Eligible with ≤ 8.5 CGPA</option>
              </select>
            </div>

            {/* Total Results Counter */}
            <div style={{ marginLeft: "auto", fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>
              Showing {filteredUniversities.length} {filteredUniversities.length === 1 ? "University" : "Universities"}
            </div>
          </div>

          {/* Country Tabs */}
          <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
            {countryTabs.map((cty) => {
              const isSelected = selectedCountry === cty;
              const flag = COUNTRY_FLAGS[cty] || "🇪🇺";
              return (
                <button
                  key={cty}
                  onClick={() => {
                    setSelectedCountry(cty);
                    if (onCountryChange) onCountryChange(cty);
                  }}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "999px",
                    fontSize: "0.82rem",
                    fontWeight: isSelected ? 700 : 500,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    background: isSelected ? "var(--accent-green)" : "var(--bg-secondary)",
                    color: isSelected ? "#FFFFFF" : "var(--text-secondary)",
                    border: isSelected ? "1px solid var(--accent-green)" : "1px solid var(--border-warm)",
                    transition: "all 0.2s ease",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <span>{cty === "All" ? "🌐" : flag}</span>
                  <span>{cty}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <Compass size={36} color="var(--accent-gold)" className="animate-spin" style={{ margin: "0 auto 16px auto" }} />
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>Loading public universities across Europe...</p>
          </div>
        )}

        {/* Empty State: Zero Matches Found */}
        {!loading && filteredUniversities.length === 0 && (
          <div 
            id="zero-matches-feedback"
            style={{ 
              textAlign: "center", 
              padding: "64px 24px", 
              background: "#FFFFFF", 
              borderRadius: "16px", 
              border: "1px solid var(--border-subtle)",
              boxShadow: "var(--shadow-sm)",
              maxWidth: "680px",
              margin: "0 auto"
            }}
          >
            <div style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "rgba(239, 68, 68, 0.1)",
              color: "#DC2626",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px auto"
            }}>
              <Building2 size={30} />
            </div>

            <h3 style={{ 
              fontFamily: "var(--font-serif)", 
              fontSize: "1.55rem", 
              color: "var(--text-primary)", 
              marginBottom: "10px" 
            }}>
              Zero Matches Found
            </h3>

            <p style={{ 
              color: "var(--text-secondary)", 
              fontSize: "0.96rem", 
              lineHeight: 1.6, 
              marginBottom: "26px",
              maxWidth: "520px",
              margin: "0 auto 26px auto"
            }}>
              {isProfileActive
                ? `No university programs meet all of your strict profile parameters (Degree: ${profile.degreeType}, Field: ${profile.field}, CGPA: ${profile.cgpa}). All programs requiring higher cutoffs or higher tuition have been filtered out.`
                : "No public universities match your current search terms or selected filters. Try loosening your keywords or clearing filters."
              }
            </p>

            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              gap: "12px", 
              flexWrap: "wrap" 
            }}>
              <button
                type="button"
                id="btn-zero-matches-adjust-filters"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCountry("All");
                  setZeroTuitionOnly(false);
                  clearProfile();
                }}
                className="btn btn-secondary"
                style={{
                  padding: "10px 18px",
                  fontWeight: 600,
                  fontSize: "0.88rem"
                }}
              >
                Adjust Filters
              </button>

              <button
                type="button"
                id="btn-zero-matches-compensatory-exams"
                onClick={() => {
                  if (onStartEvaluation) {
                    onStartEvaluation();
                  } else {
                    const el = document.getElementById("profile-intake-section");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="btn btn-primary"
                style={{
                  padding: "10px 20px",
                  fontWeight: 600,
                  fontSize: "0.88rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <span>View Compensatory Exams to Boost Chances</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* University Cards Grid (Replicating Woolmers Structured Grid) */}
        {!loading && filteredUniversities.length > 0 && (
          <div className="woolmers-grid">
            {filteredUniversities.map((uni, idx) => {
              const flag = COUNTRY_FLAGS[uni.country] || "🇪🇺";
              const coverImg = getUniversityImage(uni, idx);
              const isFree = (uni.tuitionFeeEUR || 0) === 0;
              const inCart = cartItems.some(item => (item.id || item) === uni.id);

              return (
                <article 
                  key={uni.id || idx}
                  className="card-woolmers"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    position: "relative"
                  }}
                >
                  {/* Photo Cover Header with Zoom Effect */}
                  <div className="img-zoom-container" style={{ height: "210px", width: "100%", position: "relative" }}>
                    <img 
                      src={coverImg} 
                      alt={`${uni.name} campus`}
                      loading="lazy"
                    />

                    {/* Top Floating Tags */}
                    <div style={{ position: "absolute", top: "10px", left: "10px", right: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 2, gap: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span 
                          style={{
                            background: "rgba(30, 58, 43, 0.9)",
                            backdropFilter: "blur(6px)",
                            color: "#FFFFFF",
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            padding: "3px 8px",
                            borderRadius: "4px",
                            letterSpacing: "0.04em",
                            textTransform: "uppercase"
                          }}
                        >
                          Public
                        </span>

                        <span 
                          style={{
                            background: "rgba(255, 255, 255, 0.92)",
                            backdropFilter: "blur(6px)",
                            color: "var(--text-primary)",
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: "999px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
                          }}
                        >
                          <span>{flag}</span>
                          <span>{uni.country}</span>
                        </span>
                      </div>

                      {/* Top Right Corner: Visa Chances for Indians */}
                      <IndianVisaBadge university={uni} />
                    </div>

                    {/* QS Ranking Pill if available */}
                    {uni.qsRanking && (
                      <div style={{ position: "absolute", bottom: "10px", left: "12px", zIndex: 2 }}>
                        <span 
                          style={{
                            background: "rgba(10, 15, 12, 0.75)",
                            color: "#FAF8F5",
                            fontSize: "0.72rem",
                            fontWeight: 600,
                            padding: "3px 8px",
                            borderRadius: "4px"
                          }}
                        >
                          QS Rank #{uni.qsRanking}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", flex: 1 }}>
                    
                    {/* Location Subtitle */}
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                      <MapPin size={13} color="var(--accent-gold)" />
                      <span>{uni.city || uni.country}</span>
                    </div>

                    {/* University Name (Prestigious Serif) */}
                    <h3 
                      style={{ 
                        fontFamily: "var(--font-serif)", 
                        fontSize: "1.25rem", 
                        lineHeight: 1.3,
                        color: "var(--text-primary)",
                        marginBottom: "12px",
                        fontWeight: 700
                      }}
                    >
                      {uni.name}
                    </h3>

                    {/* Fields & Specialties Chips */}
                    {Array.isArray(uni.fields) && uni.fields.length > 0 && (
                      <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginBottom: "14px" }}>
                        {uni.fields.slice(0, 3).map((f, i) => (
                          <span 
                            key={i}
                            style={{
                              background: "var(--bg-secondary)",
                              color: "var(--text-secondary)",
                              fontSize: "0.72rem",
                              padding: "2px 8px",
                              borderRadius: "4px",
                              fontWeight: 500
                            }}
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Tuition & Living Cost Row */}
                    <div 
                      style={{
                        marginTop: "auto",
                        paddingTop: "14px",
                        borderTop: "1px solid var(--border-subtle)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "10px"
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                          Tuition Fee
                        </div>
                        <div style={{ marginTop: "2px" }}>
                          {isFree ? (
                            <span className="badge-pill badge-green">
                              €0 Tuition (Free)
                            </span>
                          ) : (
                            <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)" }}>
                              €{(uni.tuitionFeeEUR || 0).toLocaleString()} <span style={{ fontSize: "0.72rem", fontWeight: 400, color: "var(--text-muted)" }}>/ yr</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                          Living Benchmark
                        </div>
                        <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-secondary)", marginTop: "2px" }}>
                          ~€{uni.livingCostPerYearEUR ? Math.round(uni.livingCostPerYearEUR / 12) : Math.round((uni.Cost_of_Living_Index || 60) * 12)}/mo
                        </div>
                      </div>
                    </div>

                    {/* Official Minimum Admission Cutoffs & Entry Criteria Panel */}
                    <div style={{ 
                      background: "var(--bg-secondary)", 
                      border: "1px solid var(--border-warm)", 
                      borderRadius: "8px", 
                      padding: "10px 12px", 
                      marginBottom: "16px",
                      fontSize: "0.78rem" 
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px", borderBottom: "1px solid rgba(0,0,0,0.06)", paddingBottom: "4px" }}>
                        <span style={{ fontWeight: 700, color: "var(--accent-green)", textTransform: "uppercase", fontSize: "0.7rem", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: "4px" }}>
                          <Award size={13} color="var(--accent-gold)" />
                          <span>Minimum Admission Cutoffs</span>
                        </span>
                        {uni.acceptanceRate && (
                          <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 600 }}>
                            {uni.acceptanceRate}
                          </span>
                        )}
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                        {/* Academic Cutoff */}
                        <div>
                          <span style={{ color: "var(--text-muted)", fontSize: "0.7rem", display: "block" }}>Min Official vs Indian Avg:</span>
                          <strong style={{ color: "var(--text-primary)", fontSize: "0.86rem" }}>
                            Min {uni.Official_Min_CGPA || uni.minCGPA10 ? `${uni.Official_Min_CGPA || uni.minCGPA10}` : "6.5"} • Avg {uni.Historical_Avg_CGPA_India || 8.0}
                          </strong>
                          {uni.minGermanGrade && (
                            <span style={{ display: "block", fontSize: "0.68rem", color: "var(--text-secondary)", marginTop: "1px" }}>
                              German: ≤ {Number(uni.minGermanGrade).toFixed(1)} {uni.minUSGPA && `• US: ≥ ${Number(uni.minUSGPA).toFixed(1)}`}
                            </span>
                          )}
                        </div>

                        {/* Language Test Cutoff */}
                        <div>
                          <span style={{ color: "var(--text-muted)", fontSize: "0.7rem", display: "block" }}>Language Cutoff:</span>
                          <strong style={{ color: "var(--text-primary)", fontSize: "0.88rem" }}>
                            IELTS ≥ {uni.ieltsMinOverall || "6.5"}
                          </strong>
                          <span style={{ display: "block", fontSize: "0.68rem", color: "var(--text-secondary)", marginTop: "1px" }}>
                            {uni.ieltsMinBand ? `Band: ≥ ${uni.ieltsMinBand}` : ""} {uni.toeflMin ? `• TOEFL: ≥ ${uni.toeflMin}` : ""}
                          </span>
                        </div>

                        {/* Standardized Test & Backlog Tolerance */}
                        <div style={{ gridColumn: "span 2", paddingTop: "5px", borderTop: "1px dashed rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "4px" }}>
                          <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>
                            <span style={{ color: "var(--text-muted)" }}>GRE / Standardized: </span>
                            <strong style={{ color: "var(--text-primary)" }}>
                              {uni.greRequirement ? (uni.greRequirement.toLowerCase().includes("recommended") ? "Recommended" : uni.greRequirement.toLowerCase().includes("mandatory") || uni.greRequirement.toLowerCase().includes("required") ? "Required" : "Not Required") : "Not Required"}
                            </strong>
                          </div>
                          <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>
                            <span style={{ color: "var(--text-muted)" }}>Backlogs Tolerated: </span>
                            <strong style={{ color: "var(--text-primary)" }}>
                              {uni.maxBacklogsAllowed !== undefined ? `Max ${uni.maxBacklogsAllowed}` : "Holistic"}
                            </strong>
                          </div>
                        </div>

                        {/* LOR Requirement Badge */}
                        {(() => {
                          const lorBadge = getLORBadge(uni);
                          return (
                            <div style={{ gridColumn: "span 2", paddingTop: "5px", borderTop: "1px dashed rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600 }}>LOR Requirement:</span>
                              <span style={{
                                background: lorBadge.badgeBg,
                                color: lorBadge.badgeColor,
                                border: `1px solid ${lorBadge.badgeBorder}`,
                                borderRadius: "4px",
                                padding: "1px 6px",
                                fontSize: "0.7rem",
                                fontWeight: 800
                              }}>
                                {lorBadge.text}
                              </span>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Compact Reality Check Gauge with Visual Dual Cutoffs & Meter */}
                      <RealityCheckGauge 
                        variant="compact"
                        university={uni}
                      />
                    </div>

                    {/* Card Actions Footer */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                      
                      {/* View Details / Map CTA */}
                      <button
                        type="button"
                        onClick={() => setSelectedUniModal(uni)}
                        className="btn btn-secondary"
                        style={{
                          flex: 1,
                          padding: "8px 12px",
                          fontSize: "0.82rem",
                          fontWeight: 600,
                          borderColor: "var(--border-warm)"
                        }}
                      >
                        <Compass size={14} color="var(--accent-green)" />
                        <span>Inspect Campus & Map</span>
                        <ArrowRight size={13} />
                      </button>

                      {/* Cart Add Button */}
                      {onToggleCartItem && (
                        <button
                          type="button"
                          onClick={() => onToggleCartItem(uni)}
                          title={inCart ? "Remove from Application Cart" : "Add to Application Cart"}
                          style={{
                            padding: "8px 12px",
                            borderRadius: "var(--radius-sm)",
                            border: inCart ? "1px solid var(--accent-green)" : "1px solid var(--border-warm)",
                            background: inCart ? "var(--accent-green-light)" : "transparent",
                            color: inCart ? "var(--accent-green)" : "var(--text-secondary)",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            transition: "all 0.2s ease"
                          }}
                        >
                          {inCart ? (
                            <>
                              <Check size={14} />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart size={14} />
                              <span>+ Cart</span>
                            </>
                          )}
                        </button>
                      )}

                    </div>

                  </div>
                </article>
              );
            })}
          </div>
        )}

      </div>

      {/* University Detail Modal with Leaflet Housing & Amenities Map */}
      <UniversityDetailModal
        isOpen={Boolean(selectedUniModal)}
        onClose={() => setSelectedUniModal(null)}
        university={selectedUniModal}
      />
    </section>
  );
}
