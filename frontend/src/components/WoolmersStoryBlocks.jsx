import React from "react";
import { ShieldCheck, Award, MapPin, ArrowRight, CheckCircle2, Euro, BookOpen, Train } from "lucide-react";

export default function WoolmersStoryBlocks({
  onNavigateTab,
  onStartEvaluation
}) {
  return (
    <div className="woolmers-story-sections" style={{ width: "100%", padding: "40px 0" }}>
      
      {/* ========================================================
          BLOCK 1: Visa Refusal Mitigation (IMAGE LEFT, TEXT RIGHT)
          ======================================================== */}
      <section 
        style={{
          padding: "70px 0",
          borderTop: "1px solid var(--border-subtle)",
          borderBottom: "1px solid var(--border-subtle)",
          background: "#FFFFFF"
        }}
      >
        <div className="container">
          <div 
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: "48px",
              alignItems: "center"
            }}
          >
            {/* Image Left */}
            <div className="img-zoom-container" style={{ borderRadius: "14px", overflow: "hidden", boxShadow: "var(--shadow-md)", height: "420px" }}>
              <img 
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80" 
                alt="Visa documents and international passport"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            {/* Text Right */}
            <div>
              <span className="editorial-kicker">
                Consular Regulatory Intelligence
              </span>
              <h2 
                style={{ 
                  fontFamily: "var(--font-serif)", 
                  fontSize: "clamp(2rem, 3.5vw, 2.6rem)", 
                  color: "var(--text-primary)",
                  marginBottom: "18px",
                  lineHeight: 1.2
                }}
              >
                Pre-Empt Visa Refusals with Official Consular Criteria
              </h2>
              <p 
                style={{ 
                  fontFamily: "var(--font-sans)", 
                  color: "var(--text-secondary)", 
                  fontSize: "1.05rem", 
                  lineHeight: 1.7,
                  marginBottom: "22px" 
                }}
              >
                Before investing hundreds in non-refundable university application fees, 
                evaluate your financial profile against strict destination-specific regulatory criteria. 
                Our engine cross-examines your liquid funds and sponsor ITRs against Germany's €11,904 Sperrkonto, 
                France's €615/month subsistence threshold, and Section 214(b) immigrant intent risks.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <CheckCircle2 size={18} color="var(--accent-green)" style={{ flexShrink: 0, marginTop: "3px" }} />
                  <span style={{ fontSize: "0.92rem", color: "var(--text-secondary)" }}>
                    <strong>Statutory Blocked Account Audits:</strong> Instant verification of required blocked capital for Germany, Austria, and the Netherlands.
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <CheckCircle2 size={18} color="var(--accent-green)" style={{ flexShrink: 0, marginTop: "3px" }} />
                  <span style={{ fontSize: "0.92rem", color: "var(--text-secondary)" }}>
                    <strong>Sponsor ITR & Loan Sanction Checks:</strong> Flags low-income sponsor affidavits and highlights compensatory educational loan letters.
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <CheckCircle2 size={18} color="var(--accent-green)" style={{ flexShrink: 0, marginTop: "3px" }} />
                  <span style={{ fontSize: "0.92rem", color: "var(--text-secondary)" }}>
                    <strong>Grounded in Official Guidelines:</strong> Aligned with German Residence Act §16b, US INA §214(b), and IRCC study permit standards.
                  </span>
                </div>
              </div>

              <button
                onClick={() => onStartEvaluation ? onStartEvaluation() : onNavigateTab("evaluator")}
                className="btn btn-primary"
                style={{ padding: "12px 26px" }}
              >
                <ShieldCheck size={16} />
                <span>Evaluate Visa Refusal Mitigation</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* ========================================================
          BLOCK 2: Scholarship Matching & €0 Tuition (TEXT LEFT, IMAGE RIGHT)
          ======================================================== */}
      <section 
        style={{
          padding: "70px 0",
          background: "var(--bg-main)"
        }}
      >
        <div className="container">
          <div 
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: "48px",
              alignItems: "center"
            }}
          >
            {/* Text Left */}
            <div>
              <span className="editorial-kicker">
                Affordable Academic Excellence
              </span>
              <h2 
                style={{ 
                  fontFamily: "var(--font-serif)", 
                  fontSize: "clamp(2rem, 3.5vw, 2.6rem)", 
                  color: "var(--text-primary)",
                  marginBottom: "18px",
                  lineHeight: 1.2
                }}
              >
                Access Free Public Universities Across 27 EU Nations
              </h2>
              <p 
                style={{ 
                  fontFamily: "var(--font-sans)", 
                  color: "var(--text-secondary)", 
                  fontSize: "1.05rem", 
                  lineHeight: 1.7,
                  marginBottom: "22px" 
                }}
              >
                World-class education should not lead to crippling student debt. 
                We index 147 prestigious public universities across Germany, France, Austria, Italy, Sweden, 
                and all 27 EU states offering English-taught Master's degrees with zero tuition or nominal 
                administrative contributions (€100–€350/semester).
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <CheckCircle2 size={18} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: "3px" }} />
                  <span style={{ fontSize: "0.92rem", color: "var(--text-secondary)" }}>
                    <strong>Transparent Pre-Admission Fees:</strong> Calculates uni-assist fees (€75 first + €30 per additional), APS verification (₹18,500), and semester tickets.
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <CheckCircle2 size={18} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: "3px" }} />
                  <span style={{ fontSize: "0.92rem", color: "var(--text-secondary)" }}>
                    <strong>30+ Fully Funded Scholarships:</strong> Direct matching for DAAD, Eiffel Excellence, Erasmus Mundus, Swedish Institute, and regional grants.
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <CheckCircle2 size={18} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: "3px" }} />
                  <span style={{ fontSize: "0.92rem", color: "var(--text-secondary)" }}>
                    <strong>Application Sunk Cost Simulator:</strong> Track cumulative application and evaluation fees in your personal Application Cart.
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <button
                  onClick={() => onNavigateTab("cheapUnis")}
                  className="btn"
                  style={{
                    backgroundColor: "var(--accent-green)",
                    color: "#FFFFFF",
                    padding: "12px 24px"
                  }}
                >
                  <Euro size={16} />
                  <span>Explore €0 Tuition Directory</span>
                  <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => onNavigateTab("scholarships")}
                  className="btn btn-secondary"
                  style={{ padding: "12px 20px" }}
                >
                  <Award size={16} color="var(--accent-gold)" />
                  <span>Scholarships Directory</span>
                </button>
              </div>
            </div>

            {/* Image Right */}
            <div className="img-zoom-container" style={{ borderRadius: "14px", overflow: "hidden", boxShadow: "var(--shadow-md)", height: "420px" }}>
              <img 
                src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80" 
                alt="Prestigious European university lecture building"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </section>


      {/* ========================================================
          BLOCK 3: Campus & Housing Map (IMAGE LEFT, TEXT RIGHT)
          ======================================================== */}
      <section 
        style={{
          padding: "70px 0",
          borderTop: "1px solid var(--border-subtle)",
          borderBottom: "1px solid var(--border-subtle)",
          background: "#FFFFFF"
        }}
      >
        <div className="container">
          <div 
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: "48px",
              alignItems: "center"
            }}
          >
            {/* Image Left */}
            <div className="img-zoom-container" style={{ borderRadius: "14px", overflow: "hidden", boxShadow: "var(--shadow-md)", height: "420px" }}>
              <img 
                src="https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1200&q=80" 
                alt="European university campus and student residences"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            {/* Text Right */}
            <div>
              <span className="editorial-kicker">
                Campus & Residence Locality
              </span>
              <h2 
                style={{ 
                  fontFamily: "var(--font-serif)", 
                  fontSize: "clamp(2rem, 3.5vw, 2.6rem)", 
                  color: "var(--text-primary)",
                  marginBottom: "18px",
                  lineHeight: 1.2
                }}
              >
                Visualize Your Campus Ecosystem & Verified Housing
              </h2>
              <p 
                style={{ 
                  fontFamily: "var(--font-sans)", 
                  color: "var(--text-secondary)", 
                  fontSize: "1.05rem", 
                  lineHeight: 1.7,
                  marginBottom: "22px" 
                }}
              >
                Finding accommodation in European university cities can be daunting. 
                Our interactive campus map features verified student halls from official housing bodies 
                (Studentenwerk in Germany, CROUS in France, DUWO in the Netherlands) alongside essential 
                daily amenities like libraries, transit hubs, and international grocery stores.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <MapPin size={18} color="var(--accent-green)" style={{ flexShrink: 0, marginTop: "3px" }} />
                  <span style={{ fontSize: "0.92rem", color: "var(--text-secondary)" }}>
                    <strong>Verified Official Student Residences:</strong> Price ranges (€280–€550/mo), waiting period estimates, and direct links to official housing portals.
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <BookOpen size={18} color="var(--accent-green)" style={{ flexShrink: 0, marginTop: "3px" }} />
                  <span style={{ fontSize: "0.92rem", color: "var(--text-secondary)" }}>
                    <strong>Categorized Amenity Pins:</strong> Quiet study libraries, late-night cafes, and budget supermarkets within 1.5 km of campus.
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <Train size={18} color="var(--accent-green)" style={{ flexShrink: 0, marginTop: "3px" }} />
                  <span style={{ fontSize: "0.92rem", color: "var(--text-secondary)" }}>
                    <strong>Transit Commute Calculations:</strong> Precise walking and tram/metro commute times from residential quarters to faculty lecture halls.
                  </span>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab("campusMap")}
                className="btn btn-primary"
                style={{ padding: "12px 26px" }}
              >
                <MapPin size={16} />
                <span>Launch Interactive Campus Map</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
