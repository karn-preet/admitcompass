import React, { useState, useEffect, useMemo } from "react";
import { fetchUniversities } from "../services/api";
import { 
  Euro, Search, Filter, ExternalLink, GraduationCap, 
  Sparkles, CheckCircle2, Globe2, ShieldCheck, ArrowUpRight,
  Sliders, Award, ShoppingCart, Layers, MapPin
} from "lucide-react";
import UniversityDetailModal from "./UniversityDetailModal";

const COUNTRY_FLAGS = {
  "Austria": "🇦🇹",
  "Belgium": "🇧🇪",
  "Bulgaria": "🇧🇬",
  "Croatia": "🇭🇷",
  "Cyprus": "🇨🇾",
  "Czechia": "🇨🇿",
  "Czech Republic": "🇨🇿",
  "Denmark": "🇩🇰",
  "Estonia": "🇪🇪",
  "Finland": "🇫🇮",
  "France": "🇫🇷",
  "Germany": "🇩🇪",
  "Greece": "🇬🇷",
  "Hungary": "🇭🇺",
  "Ireland": "🇮🇪",
  "Italy": "🇮🇹",
  "Latvia": "🇱🇻",
  "Lithuania": "🇱🇹",
  "Luxembourg": "🇱🇺",
  "Malta": "🇲🇹",
  "Netherlands": "🇳🇱",
  "Poland": "🇵🇱",
  "Portugal": "🇵🇹",
  "Romania": "🇷🇴",
  "Slovakia": "🇸🇰",
  "Slovenia": "🇸🇮",
  "Spain": "🇪🇸",
  "Sweden": "🇸🇪",
  "United Kingdom": "🇬🇧",
  "UK": "🇬🇧",
  "USA": "🇺🇸",
  "Canada": "🇨🇦",
  "Australia": "🇦🇺",
  "New Zealand": "🇳🇿",
  "Switzerland": "🇨🇭",
  "Norway": "🇳🇴"
};

export default function LowTuitionExplorerView({
  cartItems = [],
  onToggleCartItem,
  onOpenCart
}) {
  const [unis, setUnis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [maxTuition, setMaxTuition] = useState(30000); // 30000 = All Brackets / No Limit (Unbiased Default)
  const [selectedCountry, setSelectedCountry] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [mapUniModal, setMapUniModal] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchUniversities();
        if (data) {
          setUnis(data);
        }
      } catch (e) {
        console.error("Failed to load universities:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Distinct countries across all universities
  const countries = useMemo(() => {
    return Array.from(new Set(unis.map(u => u.country))).filter(Boolean).sort();
  }, [unis]);

  // Filter universities without bias
  const filteredUnis = useMemo(() => {
    return unis.filter((u) => {
      const fee = Number(u.Tuition_Fee_International ?? u.tuitionEurPerYear ?? u.tuitionFeeEUR ?? 0);

      // Tuition slider filter
      if (maxTuition < 30000 && fee > maxTuition) {
        return false;
      }

      // Country filter
      if (selectedCountry) {
        const target = selectedCountry.toLowerCase().trim();
        const uCountry = u.country.toLowerCase().trim();
        const matchesCountry = uCountry === target ||
          (target === "czechia" && uCountry === "czech republic") ||
          (target === "uk" && uCountry === "united kingdom");
        if (!matchesCountry) return false;
      }

      // Search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = u.name.toLowerCase().includes(q);
        const matchCountry = u.country.toLowerCase().includes(q);
        const matchCity = u.city && u.city.toLowerCase().includes(q);
        const matchProg = u.programsAvailable && u.programsAvailable.some(p => p.toLowerCase().includes(q));
        if (!matchName && !matchCountry && !matchCity && !matchProg) return false;
      }

      return true;
    });
  }, [unis, maxTuition, selectedCountry, searchQuery]);

  // Sort by QS Rank ascending
  const sortedUnis = useMemo(() => {
    return [...filteredUnis].sort((a, b) => (a.qsRank || a.qsRanking || 999) - (b.qsRank || b.qsRanking || 999));
  }, [filteredUnis]);

  return (
    <div className="container" style={{ paddingBottom: "60px" }}>
      {/* Header Banner */}
      <div style={{ textAlign: "center", maxWidth: "880px", margin: "0 auto 32px auto" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(37, 99, 235, 0.15)", border: "1px solid rgba(37, 99, 235, 0.3)", padding: "6px 16px", borderRadius: "999px", marginBottom: "16px" }}>
          <Globe2 size={16} color="#60a5fa" />
          <span style={{ fontSize: "0.82rem", color: "#93c5fd", fontWeight: "600" }}>
            Unbiased 27 EU Nations Directory • 100% English-Taught Public Universities
          </span>
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.4rem", fontWeight: "800", color: "#ffffff", letterSpacing: "-1px" }}>
          All 27 EU Nations & Global Universities Explorer
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", marginTop: "12px" }}>
          Explore world-ranked public institutions across all 27 EU member states and global hubs. Displays all nations equally across all tuition brackets (€0, nominal fees, and standard international tuition).
        </p>
      </div>

      {/* Interactive Filter & Budget Slider Bar */}
      <div className="glass-panel" style={{ padding: "20px 24px", marginBottom: "28px" }}>
        
        {/* Row 1: Interactive Tuition Slider */}
        <div style={{ marginBottom: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Sliders size={18} color="#3b82f6" />
              <label style={{ fontSize: "0.92rem", fontWeight: "700", color: "#ffffff" }}>
                Maximum Annual Tuition Budget:
              </label>
              <span style={{ 
                fontSize: "0.92rem", 
                fontWeight: "800", 
                color: maxTuition === 0 ? "#34d399" : maxTuition < 30000 ? "#60a5fa" : "#ffffff",
                background: maxTuition === 0 ? "rgba(16, 185, 129, 0.2)" : "rgba(37, 99, 235, 0.2)",
                padding: "2px 10px",
                borderRadius: "6px"
              }}>
                {maxTuition === 0 
                  ? "€0 / year (Tuition-Free Public Only)" 
                  : maxTuition >= 30000 
                    ? "No Limit (All Tuition Brackets • €0 to €30,000+)" 
                    : `≤ €${maxTuition.toLocaleString()} / year`}
              </span>
            </div>

            {/* Quick Presets */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => setMaxTuition(0)}
                className="btn"
                style={{
                  padding: "4px 10px",
                  fontSize: "0.76rem",
                  background: maxTuition === 0 ? "#059669" : "rgba(255,255,255,0.06)",
                  color: "#ffffff"
                }}
              >
                €0 Free Only
              </button>
              <button
                type="button"
                onClick={() => setMaxTuition(2500)}
                className="btn"
                style={{
                  padding: "4px 10px",
                  fontSize: "0.76rem",
                  background: maxTuition === 2500 ? "#2563eb" : "rgba(255,255,255,0.06)",
                  color: "#ffffff"
                }}
              >
                ≤ €2,500 / yr
              </button>
              <button
                type="button"
                onClick={() => setMaxTuition(5000)}
                className="btn"
                style={{
                  padding: "4px 10px",
                  fontSize: "0.76rem",
                  background: maxTuition === 5000 ? "#2563eb" : "rgba(255,255,255,0.06)",
                  color: "#ffffff"
                }}
              >
                ≤ €5,000 / yr
              </button>
              <button
                type="button"
                onClick={() => setMaxTuition(15000)}
                className="btn"
                style={{
                  padding: "4px 10px",
                  fontSize: "0.76rem",
                  background: maxTuition === 15000 ? "#2563eb" : "rgba(255,255,255,0.06)",
                  color: "#ffffff"
                }}
              >
                ≤ €15,000 / yr
              </button>
              <button
                type="button"
                onClick={() => setMaxTuition(30000)}
                className="btn"
                style={{
                  padding: "4px 10px",
                  fontSize: "0.76rem",
                  background: maxTuition >= 30000 ? "#4f46e5" : "rgba(255,255,255,0.06)",
                  color: "#ffffff"
                }}
              >
                All (€30,000+)
              </button>
            </div>
          </div>

          <input 
            type="range"
            min="0"
            max="30000"
            step="500"
            value={maxTuition}
            onChange={(e) => setMaxTuition(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#3b82f6", cursor: "pointer", height: "7px" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px" }}>
            <span>€0 (Free)</span>
            <span>€7,500</span>
            <span>€15,000</span>
            <span>€22,500</span>
            <span>€30,000+ (No Limit)</span>
          </div>
        </div>

        {/* Row 2: Search & Country Selector */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", justifyContent: "space-between" }}>
          
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "0.86rem", color: "#94a3b8" }}>
              Showing <strong style={{ color: "#ffffff" }}>{sortedUnis.length}</strong> public universities across <strong style={{ color: "#60a5fa" }}>{countries.length}</strong> countries
            </span>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
            {/* Search Input */}
            <div style={{ position: "relative", minWidth: "240px" }}>
              <Search size={15} color="var(--text-muted)" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="text"
                placeholder="Search university, subject, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px 8px 32px",
                  borderRadius: "8px",
                  background: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-subtle)",
                  color: "#ffffff",
                  fontSize: "0.84rem",
                  outline: "none"
                }}
              />
            </div>

            {/* Country Dropdown */}
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border-subtle)",
                color: "#ffffff",
                fontSize: "0.84rem"
              }}
            >
              <option value="">🌍 All Countries ({countries.length})</option>
              {countries.map(c => (
                <option key={c} value={c}>{COUNTRY_FLAGS[c] || "🏛️"} {c}</option>
              ))}
            </select>

            {(maxTuition < 30000 || selectedCountry || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setMaxTuition(30000);
                  setSelectedCountry("");
                  setSearchQuery("");
                }}
                className="btn btn-secondary"
                style={{ padding: "6px 12px", fontSize: "0.78rem" }}
              >
                Clear Filters
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Universities Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
          Loading universities catalog across all 27 EU nations...
        </div>
      ) : sortedUnis.length === 0 ? (
        <div className="glass-panel" style={{ padding: "48px", textAlign: "center" }}>
          <Globe2 size={48} color="var(--text-muted)" style={{ margin: "0 auto 16px auto" }} />
          <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "#ffffff", marginBottom: "8px" }}>
            No universities found for your budget filter
          </h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", maxWidth: "450px", margin: "0 auto 16px auto" }}>
            Try increasing the tuition slider to include programs with standard international tuition.
          </p>
          <button
            onClick={() => {
              setMaxTuition(30000);
              setSelectedCountry("");
              setSearchQuery("");
            }}
            className="btn btn-primary"
            style={{ padding: "8px 18px" }}
          >
            Reset Tuition to All Brackets
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "20px" }}>
          {sortedUnis.map((uni) => {
            const fee = Number(uni.Tuition_Fee_International ?? uni.tuitionEurPerYear ?? uni.tuitionFeeEUR ?? 0);
            const colIndex = uni.Cost_of_Living_Index || 60.0;
            const flag = COUNTRY_FLAGS[uni.country] || "🏛️";

            const appFee = Number(uni.Application_Fee_Amount ?? 0);
            const appPortal = uni.Application_Portal_Type || "Direct";
            const semesterFee = Number(uni.Enrollment_Semester_Fee ?? (uni.country === "Germany" ? 102 : 0));
            const semesterBreakdown = uni.Enrollment_Fee_Breakdown || (uni.country === "Germany" ? "Mandatory Semesterbeitrag includes transit pass & student union" : "Mandatory semester registration fee");
            const isGermany = uni.country === "Germany" || uni.country === "DE";
            const isApsMandatory = isGermany && (uni.apsRequired !== false);
            const visaProof = isGermany ? 11904 : uni.country === "France" ? 7380 : uni.country === "Netherlands" ? 14600 : uni.country === "Sweden" ? 11400 : 10000;
            const isInCart = cartItems.some(item => (item.id || item) === (uni.id || uni.name));

            return (
              <div 
                key={uni.id || uni.name}
                className="glass-panel"
                style={{
                  padding: "22px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  borderRadius: "14px",
                  transition: "transform 0.15s ease, border-color 0.15s ease",
                  borderLeft: fee === 0 ? "4px solid #10b981" : fee <= 2000 ? "4px solid #3b82f6" : "4px solid #8b5cf6"
                }}
              >
                <div>
                  {/* Country Flag & QS Badge */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "1.2rem" }}>{flag}</span>
                      <span style={{ fontSize: "0.82rem", fontWeight: "700", color: "#93c5fd" }}>
                        {uni.country}
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                      {(uni.qsRank || uni.qsRanking) && (
                        <span style={{ fontSize: "0.74rem", background: "rgba(255, 255, 255, 0.08)", color: "#ffffff", padding: "2px 8px", borderRadius: "4px", fontWeight: "600" }}>
                          QS #{(uni.qsRank || uni.qsRanking)}
                        </span>
                      )}
                      <span style={{ fontSize: "0.72rem", background: "rgba(56, 189, 248, 0.12)", color: "#38bdf8", padding: "2px 6px", borderRadius: "4px", fontWeight: "600" }}>
                        Public
                      </span>
                      <span style={{ fontSize: "0.72rem", background: "rgba(167, 139, 250, 0.12)", color: "#c084fc", padding: "2px 6px", borderRadius: "4px", fontWeight: "600" }}>
                        English
                      </span>
                    </div>
                  </div>

                  {/* University Name & Location */}
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.12rem", fontWeight: "700", color: "var(--text-primary)", lineHeight: 1.35, marginBottom: "4px" }}>
                    {uni.name}
                  </h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "14px" }}>
                    📍 {uni.city}, {uni.country}
                  </p>

                  {/* Tuition Fee Callout */}
                  <div style={{
                    background: fee === 0 ? "rgba(30, 58, 43, 0.08)" : fee <= 2000 ? "rgba(43, 84, 126, 0.08)" : "var(--bg-secondary)",
                    border: fee === 0 ? "1px solid rgba(30, 58, 43, 0.25)" : fee <= 2000 ? "1px solid rgba(43, 84, 126, 0.2)" : "1px solid var(--border-subtle)",
                    borderRadius: "10px",
                    padding: "10px 12px",
                    marginBottom: "12px"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ color: fee === 0 ? "var(--accent-green)" : "var(--text-primary)", fontWeight: "800", fontSize: "0.88rem" }}>
                        💰 {fee === 0 ? "€0 / year (Tuition-Free)" : `€${fee.toLocaleString()} / year`}
                      </div>
                      <span style={{ 
                        fontSize: "0.7rem", 
                        padding: "2px 8px", 
                        borderRadius: "10px", 
                        fontWeight: "700",
                        background: fee === 0 ? "var(--safe-bg)" : fee <= 2000 ? "var(--target-bg)" : "var(--bg-main)",
                        color: fee === 0 ? "var(--safe-text)" : fee <= 2000 ? "var(--target-text)" : "var(--text-secondary)"
                      }}>
                        {fee === 0 ? "Zero Tuition" : fee <= 2000 ? "Nominal Admin Fee" : "Standard International"}
                      </span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px", paddingTop: "6px", borderTop: "1px dashed var(--border-subtle)", fontSize: "0.74rem", color: "var(--text-muted)" }}>
                      <span>
                        📊 Cost of Living Index: <strong style={{ color: "var(--text-primary)" }}>{colIndex.toFixed(1)}</strong>
                      </span>
                      <span>
                        ~€{uni.livingCostPerYearEUR || Math.round(colIndex * 150)}/yr living
                      </span>
                    </div>
                  </div>

                  {/* Minimum Admission Cutoffs & Criteria Section */}
                  <div style={{
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-warm)",
                    borderRadius: "8px",
                    padding: "10px 12px",
                    marginBottom: "12px",
                    fontSize: "0.78rem"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "4px" }}>
                      <span style={{ fontWeight: 700, color: "var(--accent-green)", textTransform: "uppercase", fontSize: "0.7rem", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Award size={13} color="var(--accent-gold)" />
                        <span>Admission Minimum Cutoffs</span>
                      </span>
                      {uni.acceptanceRate && (
                        <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 600 }}>
                          {uni.acceptanceRate}
                        </span>
                      )}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                      <div>
                        <span style={{ color: "var(--text-muted)", fontSize: "0.68rem", display: "block" }}>Min CGPA Cutoff:</span>
                        <strong style={{ color: "var(--text-primary)", fontSize: "0.85rem" }}>
                          {uni.minCGPA10 ? `${uni.minCGPA10} / 10.0` : "Holistic"}
                        </strong>
                        {uni.minGermanGrade && (
                          <span style={{ display: "block", fontSize: "0.68rem", color: "var(--text-secondary)" }}>
                            German: ≤ {uni.minGermanGrade.toFixed(1)}
                          </span>
                        )}
                      </div>

                      <div>
                        <span style={{ color: "var(--text-muted)", fontSize: "0.68rem", display: "block" }}>Language Test Cutoff:</span>
                        <strong style={{ color: "var(--text-primary)", fontSize: "0.85rem" }}>
                          IELTS ≥ {uni.ieltsMinOverall || "6.5"}
                        </strong>
                        <span style={{ display: "block", fontSize: "0.68rem", color: "var(--text-secondary)" }}>
                          {uni.ieltsMinBand ? `Band: ≥ ${uni.ieltsMinBand}` : ""} {uni.toeflMin ? `• TOEFL: ≥ ${uni.toeflMin}` : ""}
                        </span>
                      </div>

                      <div style={{ gridColumn: "span 2", paddingTop: "4px", borderTop: "1px dashed var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.72rem" }}>
                        <div>
                          <span style={{ color: "var(--text-muted)" }}>GRE: </span>
                          <strong style={{ color: "var(--text-primary)" }}>
                            {uni.greRequirement ? (uni.greRequirement.toLowerCase().includes("recommended") ? "Recommended" : uni.greRequirement.toLowerCase().includes("mandatory") || uni.greRequirement.toLowerCase().includes("required") ? "Required" : "Not Required") : "Not Required"}
                          </strong>
                        </div>
                        <div>
                          <span style={{ color: "var(--text-muted)" }}>Backlogs: </span>
                          <strong style={{ color: "var(--text-primary)" }}>
                            {uni.maxBacklogsAllowed !== undefined ? `Max ${uni.maxBacklogsAllowed}` : "Holistic"}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Highlights / Programs */}
                  {uni.programsAvailable && uni.programsAvailable.length > 0 && (
                    <div style={{ marginBottom: "14px" }}>
                      <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginBottom: "4px" }}>
                        Popular English Master's:
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                        {uni.programsAvailable.slice(0, 3).map((p, idx) => (
                          <span key={idx} style={{ fontSize: "0.72rem", background: "var(--bg-main)", border: "1px solid var(--border-subtle)", padding: "2px 7px", borderRadius: "4px", color: "var(--text-secondary)" }}>
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TWO-CARD HIDDEN COSTS BREAKDOWN */}
                  <div style={{ margin: "12px 0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <span style={{ fontSize: "0.74rem", fontWeight: "700", color: "#38bdf8", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Layers size={13} />
                        <span>Hidden Administrative Costs</span>
                      </span>
                      <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
                        Pre vs Post-Offer
                      </span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                      
                      {/* Card 1: Pre-Admission */}
                      <div style={{
                        background: "rgba(245, 158, 11, 0.05)",
                        border: "1px solid rgba(245, 158, 11, 0.25)",
                        borderRadius: "8px",
                        padding: "8px 9px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between"
                      }}>
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2px" }}>
                            <span style={{ fontSize: "0.66rem", fontWeight: "700", color: "#f59e0b", textTransform: "uppercase" }}>
                              1. Sunk App Fee
                            </span>
                            <span style={{ fontSize: "0.62rem", padding: "1px 4px", borderRadius: "4px", background: "rgba(245, 158, 11, 0.15)", color: "#fcd34d", fontWeight: "600" }}>
                              {appPortal}
                            </span>
                          </div>
                          <div style={{ fontSize: "0.92rem", fontWeight: "800", color: "var(--text-primary)", marginTop: "2px" }}>
                            {appFee === 0 ? "€0 App Fee" : `€${appFee} App Fee`}
                          </div>
                          <div style={{ fontSize: "0.68rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                            {uni.Application_Fee_Details || (appPortal === "Uni-assist" ? "€75 1st app, €30 add'l" : appPortal === "University Admissions Sweden" ? "SEK 900 (~€80) flat" : "Direct university portal")}
                          </div>
                          {isApsMandatory && (
                            <div style={{ marginTop: "4px", fontSize: "0.66rem", color: "#b45309", background: "rgba(245, 158, 11, 0.15)", padding: "2px 4px", borderRadius: "4px", fontWeight: "600" }}>
                              ⚠️ APS India: ₹18k (~€195)
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card 2: Post-Admission */}
                      <div style={{
                        background: "rgba(30, 58, 43, 0.05)",
                        border: "1px solid rgba(30, 58, 43, 0.2)",
                        borderRadius: "8px",
                        padding: "8px 9px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between"
                      }}>
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2px" }}>
                            <span style={{ fontSize: "0.66rem", fontWeight: "700", color: "var(--accent-green)", textTransform: "uppercase" }}>
                              2. Post-Admission
                            </span>
                            <span style={{ fontSize: "0.62rem", padding: "1px 4px", borderRadius: "4px", background: "var(--safe-bg)", color: "var(--safe-text)", fontWeight: "600" }}>
                              Mandatory
                            </span>
                          </div>
                          <div style={{ fontSize: "0.92rem", fontWeight: "800", color: "var(--text-primary)", marginTop: "2px" }}>
                            €{semesterFee}/sem
                          </div>
                          <div style={{ fontSize: "0.68rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                            {semesterBreakdown}
                          </div>
                          <div style={{ marginTop: "3px", fontSize: "0.66rem", color: "var(--target-text)", fontWeight: "600" }}>
                            🛡️ Visa: ~€{visaProof.toLocaleString()}/yr
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

                {/* Card Action Link & Cart Button */}
                <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                  <a
                    href={uni.courseCatalogUrl || uni.officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "0.78rem",
                      fontWeight: "600",
                      color: "#60a5fa",
                      textDecoration: "none"
                    }}
                  >
                    <span>Official Portal</span>
                    <ExternalLink size={13} />
                  </a>

                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <button
                      type="button"
                      onClick={() => setMapUniModal(uni)}
                      className="btn"
                      style={{
                        padding: "4px 10px",
                        fontSize: "0.74rem",
                        background: "rgba(56, 189, 248, 0.15)",
                        border: "1px solid rgba(56, 189, 248, 0.35)",
                        color: "#38bdf8",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                      title="Explore Campus Ecosystem & Verified Housing Map"
                    >
                      <MapPin size={13} />
                      <span>Map</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleCartItem && onToggleCartItem(uni)}
                      className="btn"
                      style={{
                        padding: "4px 10px",
                        fontSize: "0.74rem",
                        background: isInCart ? "rgba(16, 185, 129, 0.2)" : "rgba(37, 99, 235, 0.2)",
                        border: isInCart ? "1px solid #10b981" : "1px solid #3b82f6",
                        color: isInCart ? "#34d399" : "#93c5fd",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                      title="Add to Application Cart & Sunk Cost Simulator"
                    >
                      <ShoppingCart size={13} />
                      <span>{isInCart ? "✓ In Cart" : "+ Cart"}</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* University Detail & Student Life Map Modal */}
      <UniversityDetailModal 
        isOpen={!!mapUniModal}
        university={mapUniModal}
        onClose={() => setMapUniModal(null)}
      />

    </div>
  );
}
