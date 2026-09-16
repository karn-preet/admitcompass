import React, { useState, useMemo } from "react";
import { 
  Building2, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Award, 
  Compass, 
  ShieldCheck,
  Search,
  Sparkles,
  Sliders,
  DollarSign,
  Globe2,
  Filter,
  Check,
  ShoppingCart,
  Layers,
  MapPin
} from "lucide-react";
import { verifyLivePortalUrl } from "../services/api";
import UniversityDetailModal from "./UniversityDetailModal";
import IndianVisaBadge from "./IndianVisaBadge";
import RealityCheckGauge from "./RealityCheckGauge";
import { getLORBadge } from "../services/lorRequirements";

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

export default function UniversityMatches({ 
  evaluationData, 
  cartItems = [], 
  onToggleCartItem, 
  onOpenCart 
}) {
  const [activeTab, setActiveTab] = useState("all"); // all, Safe, Target, Reach
  const [maxTuition, setMaxTuition] = useState(30000); // 30000 = No Limit
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [verifyingId, setVerifyingId] = useState(null);
  const [liveVerificationInfo, setLiveVerificationInfo] = useState({});
  const [mapUniModal, setMapUniModal] = useState(null);

  if (!evaluationData || !evaluationData.academicEvaluation) {
    return null;
  }

  const { matches, allMatches = [], academicSummary } = evaluationData.academicEvaluation;

  // Extract all distinct countries available in allMatches
  const distinctCountries = useMemo(() => {
    const map = new Map();
    allMatches.forEach(m => {
      const c = m.university.country;
      map.set(c, (map.get(c) || 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [allMatches]);

  const handleVerifyLive = async (uni) => {
    setVerifyingId(uni.id);
    try {
      const response = await verifyLivePortalUrl(uni.courseCatalogUrl || uni.officialWebsite);
      setLiveVerificationInfo(prev => ({
        ...prev,
        [uni.id]: response.data
      }));
    } catch (err) {
      console.error("Live verification error:", err);
    } finally {
      setVerifyingId(null);
    }
  };

  // Instant multi-criteria filtering without reload
  const filteredMatches = useMemo(() => {
    return allMatches.filter(m => {
      const uni = m.university;

      // Category tab
      if (activeTab !== "all" && m.category !== activeTab) {
        return false;
      }

      // Country selector
      if (selectedCountry !== "all") {
        const uCountry = uni.country.toLowerCase();
        const sCountry = selectedCountry.toLowerCase();
        const matchesCountry = uCountry === sCountry ||
          (sCountry === "czechia" && uCountry === "czech republic") ||
          (sCountry === "uk" && uCountry === "united kingdom");
        if (!matchesCountry) return false;
      }

      // Interactive Budget Slider
      if (maxTuition < 30000) {
        const fee = Number(uni.Tuition_Fee_International ?? uni.tuitionFeeEUR ?? 0);
        if (fee > maxTuition) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesText = 
          uni.name.toLowerCase().includes(q) ||
          uni.country.toLowerCase().includes(q) ||
          uni.city.toLowerCase().includes(q) ||
          (uni.programsAvailable && uni.programsAvailable.some(p => p.toLowerCase().includes(q)));
        if (!matchesText) return false;
      }

      return true;
    });
  }, [allMatches, activeTab, selectedCountry, maxTuition, searchQuery]);

  // Group counts for tabs under current budget and country filters
  const currentCategoryCounts = useMemo(() => {
    let safe = 0;
    let target = 0;
    let reach = 0;

    allMatches.forEach(m => {
      const uni = m.university;
      if (selectedCountry !== "all") {
        const uCountry = uni.country.toLowerCase();
        const sCountry = selectedCountry.toLowerCase();
        const matchesCountry = uCountry === sCountry ||
          (sCountry === "czechia" && uCountry === "czech republic") ||
          (sCountry === "uk" && uCountry === "united kingdom");
        if (!matchesCountry) return;
      }
      if (maxTuition < 30000) {
        const fee = Number(uni.Tuition_Fee_International ?? uni.tuitionFeeEUR ?? 0);
        if (fee > maxTuition) return;
      }
      if (m.category === "Safe") safe++;
      else if (m.category === "Target") target++;
      else if (m.category === "Reach") reach++;
    });

    return { safe, target, reach, total: safe + target + reach };
  }, [allMatches, selectedCountry, maxTuition]);

  return (
    <div style={{ marginTop: "32px" }}>
      
      {/* Top Banner: Unbiased EU 27 & All Tuition Brackets Coverage */}
      <div style={{ 
        background: "linear-gradient(135deg, rgba(30, 58, 138, 0.25) 0%, rgba(15, 23, 42, 0.4) 100%)",
        border: "1px solid rgba(59, 130, 246, 0.3)",
        borderRadius: "16px",
        padding: "16px 20px",
        marginBottom: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "14px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            background: "rgba(37, 99, 235, 0.2)",
            border: "1px solid #3b82f6",
            borderRadius: "10px",
            padding: "8px",
            display: "flex"
          }}>
            <Globe2 size={24} color="#60a5fa" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: "700", color: "#38bdf8", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Unbiased 27-Nation EU Grid • 100% English-Taught Public Universities
              </span>
              <span style={{ background: "rgba(16, 185, 129, 0.15)", color: "#34d399", fontSize: "0.72rem", padding: "1px 8px", borderRadius: "20px", fontWeight: "700" }}>
                All Tuition Brackets
              </span>
            </div>
            <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)", marginTop: "2px" }}>
              Every public English Master's program across all 27 EU nations is shown equally without prioritizing free or low-tuition countries. Use the interactive slider below to define your personal budget.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>EU Nations Represented:</span>
          <span style={{ 
            background: "rgba(59, 130, 246, 0.2)", 
            color: "#93c5fd", 
            padding: "4px 10px", 
            borderRadius: "8px", 
            fontWeight: "800",
            fontSize: "0.88rem",
            border: "1px solid rgba(59, 130, 246, 0.4)"
          }}>
            {distinctCountries.length} Countries
          </span>
        </div>
      </div>

      {/* Interactive Filter & Budget Slider Controls Panel */}
      <div className="glass-panel" style={{ padding: "20px", borderRadius: "16px", marginBottom: "24px" }}>
        
        {/* Row 1: Interactive Maximum Annual Tuition Slider */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Sliders size={18} color="#3b82f6" />
              <label style={{ fontSize: "0.92rem", fontWeight: "700", color: "#ffffff" }}>
                Interactive Maximum Annual Tuition Budget:
              </label>
              <span style={{ 
                fontSize: "0.95rem", 
                fontWeight: "800", 
                color: maxTuition === 0 ? "#34d399" : maxTuition < 30000 ? "#60a5fa" : "#e2e8f0",
                background: maxTuition === 0 ? "rgba(16, 185, 129, 0.15)" : "rgba(37, 99, 235, 0.15)",
                padding: "2px 10px",
                borderRadius: "6px",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}>
                {maxTuition === 0 
                  ? "€0 / year (Tuition-Free Only)" 
                  : maxTuition >= 30000 
                    ? "No Limit (Any Tuition Bracket • €0 to €30,000+)" 
                    : `≤ €${maxTuition.toLocaleString()} / year`}
              </span>
            </div>

            {/* Quick Budget Presets */}
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
                €0 (Free)
              </button>
              <button
                type="button"
                onClick={() => setMaxTuition(3500)}
                className="btn"
                style={{
                  padding: "4px 10px",
                  fontSize: "0.76rem",
                  background: maxTuition === 3500 ? "#2563eb" : "rgba(255,255,255,0.06)",
                  color: "#ffffff"
                }}
              >
                ≤ €3,500 (Low Fee)
              </button>
              <button
                type="button"
                onClick={() => setMaxTuition(10000)}
                className="btn"
                style={{
                  padding: "4px 10px",
                  fontSize: "0.76rem",
                  background: maxTuition === 10000 ? "#2563eb" : "rgba(255,255,255,0.06)",
                  color: "#ffffff"
                }}
              >
                ≤ €10,000 (Moderate)
              </button>
              <button
                type="button"
                onClick={() => setMaxTuition(16000)}
                className="btn"
                style={{
                  padding: "4px 10px",
                  fontSize: "0.76rem",
                  background: maxTuition === 16000 ? "#2563eb" : "rgba(255,255,255,0.06)",
                  color: "#ffffff"
                }}
              >
                ≤ €16,000
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
                Any Budget (All)
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
            style={{ 
              width: "100%", 
              accentColor: "#3b82f6",
              cursor: "pointer",
              height: "7px"
            }} 
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.74rem", color: "var(--text-muted)", marginTop: "4px" }}>
            <span>€0 (Tuition-Free)</span>
            <span>€7,500</span>
            <span>€15,000</span>
            <span>€22,500</span>
            <span>€30,000+ (No Limit)</span>
          </div>
        </div>

        {/* Row 2: Search, Country Selector & Category Tabs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", alignItems: "center" }}>
          
          {/* Search Box */}
          <div style={{ position: "relative" }}>
            <Search size={15} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input 
              type="text"
              className="form-input"
              style={{ paddingLeft: "32px", fontSize: "0.84rem", padding: "8px 12px 8px 32px" }}
              placeholder="Search university, city, or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Country Dropdown Filter */}
          <div>
            <select
              className="form-select"
              style={{ fontSize: "0.84rem", padding: "8px 12px" }}
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              <option value="all">🌍 All Destination Countries ({distinctCountries.length})</option>
              {distinctCountries.map(([cName, count]) => (
                <option key={cName} value={cName}>
                  {COUNTRY_FLAGS[cName] || "🏛️"} {cName} ({count} unis)
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button if any active */}
          {(maxTuition < 30000 || selectedCountry !== "all" || searchQuery.trim() !== "") && (
            <div>
              <button
                type="button"
                onClick={() => {
                  setMaxTuition(30000);
                  setSelectedCountry("all");
                  setSearchQuery("");
                }}
                className="btn btn-secondary"
                style={{ fontSize: "0.78rem", padding: "8px 12px", width: "100%" }}
              >
                Reset Financial & Country Filters
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Application Cart Live Counter Widget */}
      <div style={{
        background: "linear-gradient(135deg, rgba(37, 99, 235, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)",
        border: "1px solid rgba(59, 130, 246, 0.35)",
        borderRadius: "14px",
        padding: "14px 20px",
        marginBottom: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "12px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #2563eb, #06b6d4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 10px rgba(37, 99, 235, 0.3)"
          }}>
            <ShoppingCart size={18} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontWeight: "700", fontSize: "0.92rem", color: "#ffffff" }}>
                Application Cart & Sunk Cost Simulator
              </span>
              <span className="badge badge-safe" style={{ fontSize: "0.68rem" }}>
                {cartItems.length} {cartItems.length === 1 ? "Program" : "Programs"} Shortlisted
              </span>
            </div>
            <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", margin: 0, marginTop: "2px" }}>
              Simulate bundled application fees (e.g. uni-assist €75 + €30/add'l, Sweden SEK 900 flat) & hidden enrollment costs
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenCart}
          className="btn btn-primary"
          style={{ padding: "7px 16px", fontSize: "0.82rem", display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          <ShoppingCart size={15} />
          <span>Open Application Cart ({cartItems.length})</span>
        </button>
      </div>

      {/* Category Navigation Bar & Live Match Counter */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px", marginBottom: "20px" }}>
        <div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.45rem", fontWeight: "700" }}>
            Matching Public Universities ({filteredMatches.length})
          </h3>
          <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)" }}>
            Instant evaluation based on your academic profile, minimum cutoffs, and your maximum tuition setting.
          </p>
        </div>

        {/* Tab Filters */}
        <div style={{ display: "flex", gap: "8px", background: "rgba(255,255,255,0.04)", padding: "4px", borderRadius: "12px", border: "1px solid var(--border-subtle)", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab("all")}
            className="btn"
            style={{
              padding: "6px 14px",
              fontSize: "0.82rem",
              background: activeTab === "all" ? "#2563eb" : "transparent",
              color: "#ffffff"
            }}
          >
            All Matches ({currentCategoryCounts.total})
          </button>
          <button
            onClick={() => setActiveTab("Safe")}
            className="btn"
            style={{
              padding: "6px 14px",
              fontSize: "0.82rem",
              background: activeTab === "Safe" ? "#059669" : "transparent",
              color: "#ffffff"
            }}
          >
            🟢 Safe ({currentCategoryCounts.safe})
          </button>
          <button
            onClick={() => setActiveTab("Target")}
            className="btn"
            style={{
              padding: "6px 14px",
              fontSize: "0.82rem",
              background: activeTab === "Target" ? "#2563eb" : "transparent",
              color: "#ffffff"
            }}
          >
            🔵 Target ({currentCategoryCounts.target})
          </button>
          <button
            onClick={() => setActiveTab("Reach")}
            className="btn"
            style={{
              padding: "6px 14px",
              fontSize: "0.82rem",
              background: activeTab === "Reach" ? "#d97706" : "transparent",
              color: "#ffffff"
            }}
          >
            🟡 Reach ({currentCategoryCounts.reach})
          </button>
        </div>
      </div>

      {/* Zero matches notification with quick reset */}
      {filteredMatches.length === 0 && (
        <div className="glass-panel" style={{ padding: "40px 20px", textAlign: "center", borderRadius: "16px", margin: "20px 0" }}>
          <AlertCircle size={40} color="#f59e0b" style={{ margin: "0 auto 12px auto" }} />
          <h4 style={{ fontSize: "1.2rem", fontWeight: "700", color: "#ffffff", marginBottom: "8px" }}>
            No universities match your current budget filter (€{maxTuition.toLocaleString()}/yr)
          </h4>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", maxWidth: "500px", margin: "0 auto 16px auto" }}>
            Increase your annual tuition slider or select "All Countries" to view available options across other tuition brackets.
          </p>
          <button
            type="button"
            onClick={() => {
              setMaxTuition(30000);
              setSelectedCountry("all");
              setSearchQuery("");
            }}
            className="btn btn-primary"
            style={{ padding: "8px 20px" }}
          >
            Reset Tuition Slider to All (€30,000+)
          </button>
        </div>
      )}

      {/* University Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(390px, 1fr))", gap: "20px" }}>
        {filteredMatches.map(({ university: uni, probabilityScore, category, positiveFactors, riskFactors }) => {
          const isSafe = category === "Safe";
          const isTarget = category === "Target";
          const verification = liveVerificationInfo[uni.id];
          const fee = Number(uni.Tuition_Fee_International ?? uni.tuitionFeeEUR ?? 0);
          const colIndex = uni.Cost_of_Living_Index || 60.0;
          const flag = COUNTRY_FLAGS[uni.country] || "🏛️";

          const appFee = Number(uni.Application_Fee_Amount ?? 0);
          const appPortal = uni.Application_Portal_Type || "Direct";
          const semesterFee = Number(uni.Enrollment_Semester_Fee ?? (uni.country === "Germany" ? 102 : 0));
          const semesterBreakdown = uni.Enrollment_Fee_Breakdown || (uni.country === "Germany" ? "Mandatory Semesterbeitrag includes transit pass & student union" : "Mandatory semester registration fee");
          const isGermany = uni.country === "Germany" || uni.country === "DE";
          const isApsMandatory = isGermany && (uni.apsRequired !== false);
          const visaProof = isGermany ? 11904 : uni.country === "France" ? 7380 : uni.country === "Netherlands" ? 14600 : uni.country === "Sweden" ? 11400 : 10000;
          const isInCart = cartItems.some(item => (item.id || item) === uni.id);

          return (
            <div 
              key={uni.id} 
              className="glass-panel" 
              style={{ 
                padding: "22px", 
                display: "flex", 
                flexDirection: "column", 
                justifyContent: "space-between",
                borderLeft: isSafe ? "4px solid #10b981" : isTarget ? "4px solid #3b82f6" : "4px solid #f59e0b",
                transition: "transform 0.15s ease, border-color 0.15s ease"
              }}
            >
              <div>
                {/* Header: Badges & Title */}
                <div style={{ marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", marginBottom: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                      <span className={`badge ${isSafe ? "badge-safe" : isTarget ? "badge-target" : "badge-reach"}`}>
                        {category} ({probabilityScore}% Odds)
                      </span>
                      <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: "600", background: "rgba(255,255,255,0.05)", padding: "1px 6px", borderRadius: "4px" }}>
                        QS #{uni.qsRanking || "Top Public"}
                      </span>
                      <span style={{ fontSize: "0.74rem", color: "#38bdf8", background: "rgba(56, 189, 248, 0.1)", padding: "1px 6px", borderRadius: "4px", fontWeight: "600" }}>
                        🏛️ Public
                      </span>
                      {(() => {
                        const lorBadge = getLORBadge(uni);
                        return (
                          <span style={{
                            background: lorBadge.badgeBg,
                            color: lorBadge.badgeColor,
                            border: `1px solid ${lorBadge.badgeBorder}`,
                            borderRadius: "4px",
                            padding: "1px 6px",
                            fontSize: "0.7rem",
                            fontWeight: 800
                          }}>
                            {lorBadge.shortText || lorBadge.text}
                          </span>
                        );
                      })()}
                    </div>

                    {/* Top Right Corner: Indian Visa Odds Badge */}
                    <IndianVisaBadge university={uni} />
                  </div>

                  <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: "700", color: "var(--text-primary)", lineHeight: 1.3 }}>
                    {uni.name}
                  </h4>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                    {flag} {uni.city}, {uni.country}
                  </p>
                </div>

                {/* Tuition Fee Callout with Bracket Tags */}
                <div style={{ 
                  background: fee === 0 
                    ? "rgba(30, 58, 43, 0.08)" 
                    : fee <= 2000 
                      ? "rgba(43, 84, 126, 0.08)" 
                      : "var(--bg-secondary)", 
                  border: fee === 0 
                    ? "1px solid rgba(30, 58, 43, 0.25)" 
                    : fee <= 2000 
                      ? "1px solid rgba(43, 84, 126, 0.2)" 
                      : "1px solid var(--border-subtle)", 
                  padding: "10px 12px", 
                  borderRadius: "10px", 
                  margin: "12px 0",
                  fontSize: "0.84rem"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ color: fee === 0 ? "var(--accent-green)" : "var(--text-primary)", fontWeight: "700" }}>
                      💰 {fee === 0 ? "€0 / year (Tuition-Free)" : `€${fee.toLocaleString()} / year`}
                    </div>
                    <span style={{ 
                      fontSize: "0.72rem", 
                      padding: "2px 8px", 
                      borderRadius: "12px", 
                      fontWeight: "700",
                      background: fee === 0 ? "var(--safe-bg)" : fee <= 2000 ? "var(--target-bg)" : "var(--bg-main)", 
                      color: fee === 0 ? "var(--safe-text)" : fee <= 2000 ? "var(--target-text)" : "var(--text-secondary)"
                    }}>
                      {fee === 0 ? "Zero Tuition" : fee <= 2000 ? "Nominal Admin Fee" : "Standard International"}
                    </span>
                  </div>

                  {/* Cost of Living Index Metric */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px", paddingTop: "6px", borderTop: "1px dashed var(--border-subtle)", fontSize: "0.76rem", color: "var(--text-muted)" }}>
                    <span>
                      📊 Living Index: <strong style={{ color: "var(--text-primary)" }}>{colIndex.toFixed(1)}</strong>
                      {" "}({colIndex >= 72 ? "Higher Living Cost" : colIndex >= 52 ? "Moderate Cost" : "Affordable Living"})
                    </span>
                    <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
                      ~€{uni.livingCostPerYearEUR || Math.round(colIndex * 150)}/yr living
                    </span>
                  </div>
                </div>

                {/* Comprehensive Official Minimum Admission Cutoffs & Profile Comparison */}
                <div style={{ 
                  background: "var(--bg-secondary)", 
                  border: "1px solid var(--border-warm)", 
                  borderRadius: "10px", 
                  padding: "12px 14px", 
                  margin: "12px 0", 
                  fontSize: "0.78rem" 
                }}>
                  {/* Cutoff Header & Profile Reality Check Status */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "6px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Award size={14} color="var(--accent-gold)" />
                      <span style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Dual Admission Cutoffs (Official vs Real)
                      </span>
                    </div>

                    {/* Dynamic Profile Dual Cutoff Check */}
                    {(() => {
                      const userCGPA = evaluationData?.academicSummary?.originalCGPA || evaluationData?.profile?.gpa;
                      const officialMin = Number(uni.Official_Min_CGPA || uni.minCGPA10 || 6.5);
                      const histAvg = Number(uni.Historical_Avg_CGPA_India || 8.0);
                      if (userCGPA === undefined || userCGPA === null) return null;
                      const meetsOfficial = userCGPA >= (officialMin - 0.1);
                      const deltaHist = Number((userCGPA - histAvg).toFixed(1));
                      if (meetsOfficial && deltaHist <= -0.5) {
                        return (
                          <span className="badge-pill badge-gold" style={{ fontSize: "0.68rem" }}>
                            <span>⚠️ Reach (Eligible min {officialMin}, below Indian avg {histAvg})</span>
                          </span>
                        );
                      } else if (deltaHist >= 0) {
                        return (
                          <span className="badge-pill badge-green" style={{ fontSize: "0.68rem" }}>
                            <Check size={11} />
                            <span>Competitive (+{deltaHist} vs Indian avg)</span>
                          </span>
                        );
                      } else {
                        return (
                          <span className="badge-pill badge-blue" style={{ fontSize: "0.68rem" }}>
                            <span>Target ({deltaHist} vs Indian avg)</span>
                          </span>
                        );
                      }
                    })()}
                  </div>

                  {/* 4-Metric Cutoff Matrix */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    {/* Academic GPA / Grade Cutoff */}
                    <div>
                      <span style={{ color: "var(--text-muted)", fontSize: "0.7rem", display: "block" }}>
                        Dual Academic Cutoffs:
                      </span>
                      <strong style={{ color: "var(--text-primary)", fontSize: "0.92rem", display: "block", marginTop: "1px" }}>
                        Min: {uni.Official_Min_CGPA || uni.minCGPA10 ? `${uni.Official_Min_CGPA || uni.minCGPA10} CGPA` : "Holistic"} • Indian Avg: {uni.Historical_Avg_CGPA_India || 8.0}
                      </strong>
                      <span style={{ color: "var(--text-secondary)", fontSize: "0.7rem", display: "block", marginTop: "2px" }}>
                        German: ≤ {uni.minGermanGrade ? uni.minGermanGrade.toFixed(1) : "2.5"} {uni.minUSGPA ? `• US: ≥ ${uni.minUSGPA.toFixed(1)}` : ""}
                      </span>
                    </div>

                    {/* Language Proficiency Cutoff */}
                    <div>
                      <span style={{ color: "var(--text-muted)", fontSize: "0.7rem", display: "block" }}>
                        Language Test Cutoffs:
                      </span>
                      <strong style={{ color: "var(--text-primary)", fontSize: "0.92rem", display: "block", marginTop: "1px" }}>
                        IELTS ≥ {uni.ieltsMinOverall || "6.5"} {uni.ieltsMinBand ? `(Band ${uni.ieltsMinBand})` : ""}
                      </strong>
                      <span style={{ color: "var(--text-secondary)", fontSize: "0.7rem", display: "block", marginTop: "2px" }}>
                        TOEFL: ≥ {uni.toeflMin || 88}
                      </span>
                    </div>

                    {/* GRE / Standardized Test Cutoff */}
                    <div style={{ gridColumn: "span 2", paddingTop: "6px", borderTop: "1px dashed var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "6px" }}>
                      <div>
                        <span style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>GRE Standardized: </span>
                        <strong style={{ color: "var(--text-primary)", fontSize: "0.78rem" }}>
                          {uni.greRequirement ? (uni.greRequirement.toLowerCase().includes("recommended") ? "Recommended (Quant ≥ 164)" : uni.greRequirement.toLowerCase().includes("mandatory") || uni.greRequirement.toLowerCase().includes("required") ? "Mandatory" : "Not Required / Waived") : "Not Required"}
                        </strong>
                      </div>
                      <div>
                        <span style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>Backlog Tolerance: </span>
                        <strong style={{ color: "var(--text-primary)", fontSize: "0.78rem" }}>
                          {uni.maxBacklogsAllowed !== undefined ? `Max ${uni.maxBacklogsAllowed} Backlogs` : "Holistic"}
                        </strong>
                      </div>
                    </div>

                    {/* Deadlines Bar */}
                    <div style={{ gridColumn: "span 2", paddingTop: "4px", fontSize: "0.72rem", color: "var(--text-muted)" }}>
                      <span>📅 Application Deadlines: </span>
                      <span style={{ color: "var(--accent-green)", fontWeight: 600 }}>
                        {uni.applicationDeadlines || "Winter: July 15 | Summer: Jan 15"}
                      </span>
                    </div>

                    {/* LOR Requirement Row */}
                    {(() => {
                      const lorBadge = getLORBadge(uni);
                      return (
                        <div style={{ gridColumn: "span 2", paddingTop: "5px", borderTop: "1px dashed var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600 }}>LOR Requirement:</span>
                          <span style={{
                            background: lorBadge.badgeBg,
                            color: lorBadge.badgeColor,
                            border: `1px solid ${lorBadge.badgeBorder}`,
                            borderRadius: "4px",
                            padding: "1px 6px",
                            fontSize: "0.72rem",
                            fontWeight: 800
                          }}>
                            {lorBadge.text}
                          </span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Compact Reality Check Gauge with Probability Meter & Advice */}
                  <RealityCheckGauge 
                    variant="compact"
                    competitiveness={m.competitiveness}
                    university={uni}
                    userCGPA={evaluationData?.academicSummary?.originalCGPA || evaluationData?.profile?.gpa}
                  />
                </div>

                {/* TWO-CARD HIDDEN COSTS BREAKDOWN */}
                <div style={{ margin: "14px 0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontSize: "0.76rem", fontWeight: "700", color: "#38bdf8", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Layers size={13} />
                      <span>Hidden Administrative & Enrollment Costs</span>
                    </span>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                      Pre- vs. Post-Admission
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    
                    {/* CARD 1: Pre-Admission Costs (Sunk Costs) */}
                    <div style={{
                      background: "rgba(245, 158, 11, 0.05)",
                      border: "1px solid rgba(245, 158, 11, 0.25)",
                      borderRadius: "8px",
                      padding: "9px 10px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between"
                    }}>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
                          <span style={{ fontSize: "0.68rem", fontWeight: "700", color: "#f59e0b", textTransform: "uppercase" }}>
                            1. Pre-Admission (Sunk)
                          </span>
                          <span style={{ fontSize: "0.64rem", padding: "1px 5px", borderRadius: "4px", background: "rgba(245, 158, 11, 0.15)", color: "#fcd34d", fontWeight: "600" }}>
                            {appPortal}
                          </span>
                        </div>
                        <div style={{ fontSize: "0.95rem", fontWeight: "800", color: "var(--text-primary)", marginTop: "2px" }}>
                          {appFee === 0 ? "€0 Application Fee" : `€${appFee} App Fee`}
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                          {uni.Application_Fee_Details || (appPortal === "Uni-assist" ? "€75 1st app, €30 each add'l" : appPortal === "University Admissions Sweden" ? "SEK 900 (~€80) flat 4 choices" : appPortal === "UCAS" ? "£28.50 flat multiple choices" : "Direct university portal")}
                        </div>
                        {isApsMandatory && (
                          <div style={{ marginTop: "4px", fontSize: "0.68rem", color: "#b45309", background: "rgba(245, 158, 11, 0.15)", padding: "2px 5px", borderRadius: "4px", fontWeight: "600" }}>
                            ⚠️ APS India: ₹18,000 (~€195)
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "6px", paddingTop: "4px", borderTop: "1px dashed var(--border-subtle)" }}>
                        *Unrecoverable before admission
                      </div>
                    </div>

                    {/* CARD 2: Post-Admission Mandatory Administrative Costs */}
                    <div style={{
                      background: "rgba(30, 58, 43, 0.05)",
                      border: "1px solid rgba(30, 58, 43, 0.2)",
                      borderRadius: "8px",
                      padding: "9px 10px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between"
                    }}>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
                          <span style={{ fontSize: "0.68rem", fontWeight: "700", color: "var(--accent-green)", textTransform: "uppercase" }}>
                            2. Post-Admission
                          </span>
                          <span style={{ fontSize: "0.64rem", padding: "1px 5px", borderRadius: "4px", background: "var(--safe-bg)", color: "var(--safe-text)", fontWeight: "600" }}>
                            Mandatory
                          </span>
                        </div>
                        <div style={{ fontSize: "0.95rem", fontWeight: "800", color: "var(--text-primary)", marginTop: "2px" }}>
                          €{semesterFee}/sem <span style={{ fontSize: "0.7rem", fontWeight: "500", color: "var(--text-muted)" }}>(Reg. Fee)</span>
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: "2px", lineHeight: "1.2" }}>
                          {semesterBreakdown}
                        </div>
                        <div style={{ marginTop: "4px", fontSize: "0.68rem", color: "var(--target-text)", fontWeight: "600" }}>
                          🛡️ Visa Funds: ~€{visaProof.toLocaleString()}/yr
                        </div>
                      </div>
                      <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "6px", paddingTop: "4px", borderTop: "1px dashed var(--border-subtle)" }}>
                        *Transit ticket & student union
                      </div>
                    </div>

                  </div>
                </div>

                {/* Compensatory Strategy Highlight */}
                {uni.compensatoryFactors && (
                  <div style={{ 
                    background: "rgba(59, 130, 246, 0.08)", 
                    border: "1px dashed rgba(59, 130, 246, 0.3)", 
                    padding: "8px 12px", 
                    borderRadius: "8px", 
                    fontSize: "0.76rem", 
                    color: "#93c5fd",
                    marginBottom: "12px"
                  }}>
                    <Sparkles size={13} style={{ display: "inline", marginRight: "5px", verticalAlign: "text-bottom" }} />
                    <strong>Profile Offset:</strong> {uni.compensatoryFactors}
                  </div>
                )}

                {/* Factors analysis */}
                <div style={{ fontSize: "0.76rem", marginBottom: "12px" }}>
                  {positiveFactors.slice(0, 1).map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "6px", color: "#34d399", marginBottom: "3px" }}>
                      <CheckCircle2 size={13} style={{ flexShrink: 0, marginTop: "2px" }} />
                      <span>{f}</span>
                    </div>
                  ))}
                  {riskFactors.slice(0, 1).map((r, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "6px", color: "#fbbf24", marginBottom: "3px" }}>
                      <AlertCircle size={13} style={{ flexShrink: 0, marginTop: "2px" }} />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>

                {/* Live verification panel if triggered */}
                {verification && (
                  <div style={{ 
                    background: "rgba(15, 23, 42, 0.9)", 
                    border: "1px solid #38bdf8", 
                    borderRadius: "8px", 
                    padding: "10px", 
                    marginBottom: "14px",
                    fontSize: "0.75rem"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#38bdf8", fontWeight: "700", marginBottom: "4px" }}>
                      <ShieldCheck size={14} />
                      <span>Live Verified via Scraper ({verification.hostname})</span>
                    </div>
                    <div style={{ color: "var(--text-secondary)" }}>
                      <strong>Page Title:</strong> {verification.pageTitle}
                    </div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.7rem", marginTop: "2px" }}>
                      Status: {verification.httpStatus} OK • {verification.domainCategory}
                    </div>
                  </div>
                )}

              </div>

              {/* Bottom Actions & Clickable Citation */}
              <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                
                {/* Clickable Citation */}
                <a 
                  href={uni.courseCatalogUrl || uni.officialWebsite} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    fontSize: "0.78rem", 
                    color: "#60a5fa", 
                    textDecoration: "none", 
                    display: "inline-flex", 
                    alignItems: "center", 
                    gap: "4px",
                    fontWeight: "600"
                  }}
                  title={uni.officialCitation || "Official Portal Document"}
                >
                  <span>Official Course Catalog</span>
                  <ExternalLink size={13} />
                </a>

                {/* Actions Group: Verify & Cart */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {/* Live Verification Trigger */}
                  <button
                    type="button"
                    onClick={() => handleVerifyLive(uni)}
                    disabled={verifyingId === uni.id}
                    className="btn btn-secondary"
                    style={{ padding: "4px 8px", fontSize: "0.74rem" }}
                    title="Ping and verify live official university page via scraper"
                  >
                    <ShieldCheck size={13} color="#34d399" />
                    <span>{verifyingId === uni.id ? "Verifying..." : "Verify Live Source"}</span>
                  </button>

                  {/* Student Life & Housing Map Trigger */}
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
                    <span>Map & Housing</span>
                  </button>

                  {/* Add to Application Cart Button */}
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

      {/* University Detail & Student Life Map Modal */}
      <UniversityDetailModal 
        isOpen={!!mapUniModal}
        university={mapUniModal}
        userCGPA={evaluationData?.academicSummary?.originalCGPA || evaluationData?.profile?.gpa}
        competitiveness={mapUniModal ? allMatches.find(m => m.university.id === mapUniModal.id)?.competitiveness : null}
        onClose={() => setMapUniModal(null)}
      />

    </div>
  );
}
