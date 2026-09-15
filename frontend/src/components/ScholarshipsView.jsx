import React, { useState, useEffect } from "react";
import { fetchScholarships } from "../services/api";
import { 
  Award, Search, Filter, ExternalLink, Calendar, 
  CheckCircle2, Globe2, Sparkles, DollarSign, ArrowUpRight 
} from "lucide-react";

export default function ScholarshipsView() {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedDegree, setSelectedDegree] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (selectedCountry) filters.country = selectedCountry;
      if (selectedDegree) filters.degree = selectedDegree;
      if (searchQuery) filters.search = searchQuery;

      const res = await fetchScholarships(filters);
      if (res.success) {
        setScholarships(res.data);
      }
    } catch (e) {
      console.error("Failed to load scholarships:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCountry, selectedDegree]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  const countries = [
    "Germany", "Italy", "France", "Hungary", "Sweden", 
    "Finland", "Netherlands", "UK", "USA", "Canada", "All EU / Global"
  ];

  return (
    <div className="container" style={{ paddingBottom: "60px" }}>
      {/* Header Banner */}
      <div style={{ textAlign: "center", maxWidth: "850px", margin: "0 auto 32px auto" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(245, 158, 11, 0.15)", border: "1px solid rgba(245, 158, 11, 0.3)", padding: "6px 16px", borderRadius: "999px", marginBottom: "16px" }}>
          <Award size={16} color="#fbbf24" />
          <span style={{ fontSize: "0.82rem", color: "#b45309", fontWeight: "700" }}>
            100% Free Global Scholarships Directory • Verified Deadlines
          </span>
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.4rem", fontWeight: "800", color: "var(--text-primary)", letterSpacing: "-1px" }}>
          Fully Funded & Government Scholarships
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", marginTop: "12px" }}>
          Discover government and merit scholarships that cover 100% tuition, monthly stipends, health insurance, and travel allowances for international students.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: "18px 24px", marginBottom: "28px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", alignItems: "center", justifyContent: "space-between" }}>
          
          <form onSubmit={handleSearchSubmit} style={{ display: "flex", flex: "1 1 320px", gap: "8px" }}>
            <div style={{ position: "relative", width: "100%" }}>
              <Search size={16} color="var(--text-muted)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="text"
                placeholder="Search scholarships (e.g. DAAD, DSU, Eiffel, Fulbright)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "9px 12px 9px 36px",
                  borderRadius: "8px",
                  background: "var(--bg-surface, #ffffff)",
                  border: "1px solid var(--border-subtle, #cbd5e1)",
                  color: "var(--text-primary)",
                  fontSize: "0.88rem",
                  outline: "none"
                }}
              />
            </div>
            <button type="submit" className="btn btn-secondary" style={{ padding: "8px 14px", fontSize: "0.85rem" }}>
              Filter
            </button>
          </form>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <select
              value={selectedCountry}
              onChange={e => setSelectedCountry(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                background: "var(--bg-surface, #ffffff)",
                border: "1px solid var(--border-subtle, #cbd5e1)",
                color: "var(--text-primary)",
                fontSize: "0.85rem"
              }}
            >
              <option value="">All Destinations</option>
              {countries.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={selectedDegree}
              onChange={e => setSelectedDegree(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                background: "var(--bg-surface, #ffffff)",
                border: "1px solid var(--border-subtle, #cbd5e1)",
                color: "var(--text-primary)",
                fontSize: "0.85rem"
              }}
            >
              <option value="">All Degree Levels</option>
              <option value="masters">Master's</option>
              <option value="bachelors">Bachelor's</option>
            </select>

            {(selectedCountry || selectedDegree || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCountry("");
                  setSelectedDegree("");
                  setSearchQuery("");
                }}
                className="btn btn-secondary"
                style={{ padding: "8px 12px", fontSize: "0.8rem" }}
              >
                Reset
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Scholarships Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
          Loading global scholarships...
        </div>
      ) : scholarships.length === 0 ? (
        <div className="glass-panel" style={{ padding: "48px", textAlign: "center" }}>
          <p style={{ color: "var(--text-secondary)" }}>
            No scholarships found matching your filters. Try resetting the country or keyword search.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: "20px" }}>
          {scholarships.map((sch) => (
            <div 
              key={sch.id} 
              className="glass-panel" 
              style={{ 
                padding: "24px", 
                display: "flex", 
                flexDirection: "column", 
                justifyContent: "space-between",
                position: "relative" 
              }}
            >
              <div>
                {/* Country Pill & Value Badge */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                  <span className="badge badge-target" style={{ fontSize: "0.74rem" }}>
                    📍 {sch.country}
                  </span>
                  <span className="badge badge-safe" style={{ fontSize: "0.76rem", fontWeight: "700" }}>
                    {sch.estimatedValue}
                  </span>
                </div>

                <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--text-primary)", marginBottom: "8px", lineHeight: 1.3 }}>
                  {sch.name}
                </h3>

                {/* Coverage Box */}
                <div style={{ background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.2)", padding: "10px 12px", borderRadius: "8px", marginBottom: "12px" }}>
                  <div style={{ fontSize: "0.7rem", color: "#047857", fontWeight: "700", textTransform: "uppercase" }}>
                    Award Coverage:
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: "700", marginTop: "2px" }}>
                    {sch.awardCoverage}
                  </div>
                </div>

                {/* Eligibility */}
                <div style={{ marginBottom: "12px" }}>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: "600" }}>Eligibility:</div>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                    {sch.eligibilityCriteria}
                  </div>
                </div>

                {/* Deadline */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.78rem", color: "#fbbf24", marginBottom: "14px" }}>
                  <Calendar size={14} />
                  <span><strong>Deadline:</strong> {sch.deadline}</span>
                </div>

                {/* Target fields tags */}
                {sch.targetFields && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "14px" }}>
                    {sch.targetFields.map((f, idx) => (
                      <span key={idx} style={{ fontSize: "0.7rem", background: "rgba(255, 255, 255, 0.05)", padding: "2px 8px", borderRadius: "4px", color: "var(--text-secondary)" }}>
                        {f}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "12px" }}>
                <a
                  href={sch.officialPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ width: "100%", justifyContent: "center", fontSize: "0.84rem", padding: "8px" }}
                >
                  <span>Official Application Guidelines</span>
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
