import React, { useState, useEffect } from "react";
import { 
  ShoppingCart, 
  Trash2, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  FileCheck, 
  TrendingDown, 
  AlertCircle,
  Clock,
  ExternalLink
} from "lucide-react";
import { calculateApplicationCart } from "../services/api";
import ApplicationLORTracker from "./ApplicationLORTracker";
import UniversityDetailModal from "./UniversityDetailModal";
import { getLORBadge } from "../services/lorRequirements";

export default function ApplicationCartView({
  cartItems = [],
  onRemoveItem,
  onClearCart,
  originCountry = "India"
}) {
  const [selectedUniForModal, setSelectedUniForModal] = useState(null);
  const [selectedExams, setSelectedExams] = useState({
    ielts: true,
    gre: false,
    toefl: false,
    testas: false
  });
  const [includeApostille, setIncludeApostille] = useState(true);
  const [includeCourier, setIncludeCourier] = useState(false);
  const [currency, setCurrency] = useState("EUR"); // EUR, INR, USD
  const [calculationData, setCalculationData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchBudget = async () => {
      setIsLoading(true);
      try {
        const response = await calculateApplicationCart({
          items: cartItems,
          selectedExams,
          originCountry,
          includeApostille,
          includeCourier
        });
        if (isMounted && response.success) {
          setCalculationData(response.data);
        }
      } catch (err) {
        console.error("Cart budget calculation error:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchBudget();

    return () => {
      isMounted = false;
    };
  }, [cartItems, selectedExams, originCountry, includeApostille, includeCourier]);

  const budget = calculationData?.preAdmissionBudget;
  const portals = calculationData?.portalBreakdown || {};
  const exams = calculationData?.standardizedExams;
  const docs = calculationData?.documentVerification;
  const totalSavings = calculationData?.applicationFees?.totalSavingsEUR || 0;
  const itemBreakdowns = calculationData?.itemBreakdowns || [];

  const formatMoney = (valEUR) => {
    if (valEUR === undefined || valEUR === null) return "€0";
    if (currency === "INR") {
      return `₹${Math.round(valEUR * 92.5).toLocaleString("en-IN")}`;
    }
    if (currency === "USD") {
      return `$${Math.round(valEUR * 1.08).toLocaleString()}`;
    }
    return `€${Math.round(valEUR).toLocaleString()}`;
  };

  if (cartItems.length === 0) {
    return (
      <div className="glass-panel" style={{ textAlign: "center", padding: "60px 20px", borderRadius: "16px", margin: "20px 0" }}>
        <div style={{ width: "68px", height: "68px", borderRadius: "50%", background: "rgba(59, 130, 246, 0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px auto" }}>
          <ShoppingCart size={34} color="#60a5fa" />
        </div>
        <h4 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#ffffff", marginBottom: "8px" }}>
          Your Application Cart is Empty
        </h4>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", maxWidth: "520px", margin: "0 auto 20px auto" }}>
          Shortlist public universities from the "University Matches" tab or the "€0 / Cheap Unis" explorer to simulate multi-application bundled fees and view your total pre-admission sunk costs.
        </p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "12px" }}>
      
      {/* Top Banner: Sunk Cost Pipeline Overview */}
      <div style={{
        background: "linear-gradient(135deg, rgba(37, 99, 235, 0.16) 0%, rgba(6, 182, 212, 0.1) 100%)",
        border: "1px solid rgba(59, 130, 246, 0.4)",
        borderRadius: "16px",
        padding: "24px 28px",
        marginBottom: "24px"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span className="badge badge-safe">Pre-Admission Budget Simulator</span>
              <span style={{ fontSize: "0.78rem", color: "#93c5fd" }}>
                {cartItems.length} {cartItems.length === 1 ? "Program" : "Programs"} Shortlisted
              </span>
            </div>
            
            <span style={{ fontSize: "0.76rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.5px" }}>
              Total Sunk Cost Budget (Non-Refundable Upfront Outlay)
            </span>
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginTop: "4px" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: "800", color: "#ffffff" }}>
                {formatMoney(budget?.totalSunkCostEUR)}
              </span>
              {currency === "EUR" && (
                <span style={{ fontSize: "1.05rem", color: "var(--text-secondary)" }}>
                  (~₹{(Math.round((budget?.totalSunkCostEUR || 0) * 92.5)).toLocaleString("en-IN")})
                </span>
              )}
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
              Upfront administrative expenses committed before admission letters: Application fees + Standardized exams + APS verification + Document legalizations.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px" }}>
            {/* Currency selector */}
            <div style={{ display: "flex", background: "rgba(255, 255, 255, 0.06)", borderRadius: "8px", padding: "2px", border: "1px solid var(--border-subtle)" }}>
              {["EUR", "INR", "USD"].map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCurrency(c)}
                  style={{
                    padding: "4px 10px",
                    fontSize: "0.76rem",
                    fontWeight: currency === c ? "700" : "500",
                    background: currency === c ? "#2563eb" : "transparent",
                    color: currency === c ? "#ffffff" : "var(--text-secondary)",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer"
                  }}
                >
                  {c === "EUR" ? "€ EUR" : c === "INR" ? "₹ INR" : "$ USD"}
                </button>
              ))}
            </div>

            {totalSavings > 0 && (
              <div style={{
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid #10b981",
                borderRadius: "10px",
                padding: "8px 14px",
                textAlign: "right"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#34d399", fontWeight: "700", fontSize: "0.82rem" }}>
                  <TrendingDown size={15} />
                  <span>Bundled Portal Savings</span>
                </div>
                <div style={{ fontSize: "1.3rem", fontWeight: "800", color: "#34d399" }}>
                  +{formatMoney(totalSavings)}
                </div>
                <span style={{ fontSize: "0.7rem", color: "#a7f3d0" }}>
                  Multi-application discount applied
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Sunk cost progress bar */}
        <div style={{ marginTop: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.74rem", color: "var(--text-muted)", marginBottom: "6px" }}>
            <span>Application Fees: <strong style={{ color: "#38bdf8" }}>{formatMoney(calculationData?.applicationFees?.totalBundledEUR)}</strong> ({budget?.breakdown?.applicationFeesPercent || 0}%)</span>
            <span>Standardized Exams: <strong style={{ color: "#c084fc" }}>{formatMoney(exams?.totalEUR)}</strong> ({budget?.breakdown?.examsPercent || 0}%)</span>
            <span>Document Legalization/APS: <strong style={{ color: "#34d399" }}>{formatMoney(docs?.totalEUR)}</strong> ({budget?.breakdown?.verificationPercent || 0}%)</span>
          </div>
          <div style={{ height: "8px", width: "100%", background: "rgba(255,255,255,0.08)", borderRadius: "999px", overflow: "hidden", display: "flex" }}>
            <div style={{ width: `${budget?.breakdown?.applicationFeesPercent || 0}%`, background: "#3b82f6", transition: "width 0.3s ease" }} />
            <div style={{ width: `${budget?.breakdown?.examsPercent || 0}%`, background: "#a855f7", transition: "width 0.3s ease" }} />
            <div style={{ width: `${budget?.breakdown?.verificationPercent || 0}%`, background: "#10b981", transition: "width 0.3s ease" }} />
          </div>
        </div>
      </div>

      {/* Grid: Grouped Application Portals */}
      <div style={{ marginBottom: "26px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: "700", color: "#ffffff", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
            <Layers size={20} color="#38bdf8" />
            <span>Grouped Application Portals & Multi-App Discounts</span>
          </h3>
          <button
            type="button"
            onClick={onClearCart}
            className="btn btn-secondary"
            style={{ fontSize: "0.76rem", color: "#fb7185", borderColor: "rgba(244,63,94,0.3)" }}
          >
            <Trash2 size={13} />
            <span>Clear Cart</span>
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "16px" }}>
          {Object.entries(portals).map(([portalKey, pData]) => {
            const isUniAssist = portalKey === "Uni-assist";
            const isSweden = portalKey === "University Admissions Sweden";

            return (
              <div 
                key={portalKey} 
                className="glass-panel"
                style={{
                  padding: "18px",
                  borderRadius: "14px",
                  border: isUniAssist || isSweden ? "1px solid rgba(59, 130, 246, 0.4)" : "1px solid var(--border-subtle)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontWeight: "800", fontSize: "1.05rem", color: "#ffffff" }}>
                          {pData.portalName}
                        </span>
                        <span className="badge" style={{ background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", fontSize: "0.7rem" }}>
                          {pData.count} {pData.count === 1 ? "Program" : "Programs"}
                        </span>
                      </div>
                      <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
                        {pData.bundlingDescription}
                      </p>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "1.25rem", fontWeight: "800", color: "#ffffff" }}>
                        {formatMoney(pData.bundledFee)}
                      </div>
                      {pData.savings > 0 && (
                        <div style={{ fontSize: "0.72rem", color: "#34d399", fontWeight: "700" }}>
                          Saved {formatMoney(pData.savings)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bundling discount highlight */}
                  {pData.discountNote && (
                    <div style={{
                      background: pData.savings > 0 ? "rgba(16, 185, 129, 0.1)" : "rgba(255, 255, 255, 0.03)",
                      borderLeft: pData.savings > 0 ? "3px solid #10b981" : "3px solid var(--border-subtle)",
                      padding: "6px 10px",
                      borderRadius: "4px",
                      fontSize: "0.75rem",
                      color: pData.savings > 0 ? "#a7f3d0" : "var(--text-muted)",
                      margin: "8px 0"
                    }}>
                      💡 {pData.discountNote}
                    </div>
                  )}

                  {/* Programs under this portal */}
                  <div style={{ marginTop: "12px", borderTop: "1px dashed rgba(255,255,255,0.08)", paddingTop: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
                    {pData.items.map(item => (
                      <div 
                        key={item.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontSize: "0.8rem",
                          color: "var(--text-secondary)",
                          padding: "3px 0"
                        }}
                      >
                        <span>
                          🏛️ <strong style={{ color: "#ffffff" }}>{item.name}</strong> ({item.country})
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                            {isUniAssist ? "Bundled under Uni-assist" : isSweden ? "Bundled under Sweden round" : `Fee: ${formatMoney(item.Application_Fee_Amount)}`}
                          </span>
                          <button
                            type="button"
                            onClick={() => onRemoveItem && onRemoveItem(item.id)}
                            style={{
                              background: "transparent",
                              border: "none",
                              color: "#fb7185",
                              cursor: "pointer",
                              padding: "2px",
                              display: "flex",
                              alignItems: "center"
                            }}
                            title="Remove from Cart"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Row: Standardized Exams & Document Legalization */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "16px", marginBottom: "26px" }}>
        
        {/* Standardized Exams */}
        <div className="glass-panel" style={{ padding: "18px", borderRadius: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontWeight: "700", fontSize: "0.95rem", color: "#ffffff" }}>
              📝 Standardized Exam Sunk Costs
            </span>
            <strong style={{ color: "#c084fc", fontSize: "0.95rem" }}>
              {formatMoney(exams?.totalEUR || 0)}
            </strong>
          </div>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: "0 0 12px 0" }}>
            Select standardized exams required for your shortlisted universities:
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.82rem" }}>
            <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", padding: "8px 10px", background: selectedExams.ielts ? "rgba(168, 85, 247, 0.1)" : "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input 
                  type="checkbox" 
                  checked={selectedExams.ielts} 
                  onChange={(e) => setSelectedExams(prev => ({ ...prev, ielts: e.target.checked }))} 
                />
                <span>IELTS Academic Exam</span>
              </span>
              <strong style={{ color: "#ffffff" }}>{formatMoney(185)}</strong>
            </label>

            <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", padding: "8px 10px", background: selectedExams.gre ? "rgba(168, 85, 247, 0.1)" : "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input 
                  type="checkbox" 
                  checked={selectedExams.gre} 
                  onChange={(e) => setSelectedExams(prev => ({ ...prev, gre: e.target.checked }))} 
                />
                <span>GRE General Exam</span>
              </span>
              <strong style={{ color: "#ffffff" }}>{formatMoney(245)}</strong>
            </label>

            <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", padding: "8px 10px", background: selectedExams.testas ? "rgba(168, 85, 247, 0.1)" : "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input 
                  type="checkbox" 
                  checked={selectedExams.testas} 
                  onChange={(e) => setSelectedExams(prev => ({ ...prev, testas: e.target.checked }))} 
                />
                <span>TestAS Exam</span>
              </span>
              <strong style={{ color: "#ffffff" }}>{formatMoney(150)}</strong>
            </label>
          </div>
        </div>

        {/* Verification & Legalization */}
        <div className="glass-panel" style={{ padding: "18px", borderRadius: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontWeight: "700", fontSize: "0.95rem", color: "#ffffff", display: "flex", alignItems: "center", gap: "6px" }}>
              <FileCheck size={18} color="#10b981" />
              <span>Document Verification & Legalization</span>
            </span>
            <strong style={{ color: "#10b981", fontSize: "0.95rem" }}>
              {formatMoney(docs?.totalEUR || 0)}
            </strong>
          </div>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: "0 0 12px 0" }}>
            Mandatory credentials verification and government certifications:
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.82rem" }}>
            {docs?.apsApplicable && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", background: "rgba(245, 158, 11, 0.14)", border: "1px solid rgba(245, 158, 11, 0.35)", borderRadius: "8px" }}>
                <div>
                  <strong style={{ color: "#fcd34d" }}>APS India Certificate</strong>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>Mandatory verification for all German public universities</div>
                </div>
                <strong style={{ color: "#ffffff" }}>{formatMoney(195)}</strong>
              </div>
            )}

            <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", padding: "8px 10px", background: includeApostille ? "rgba(16, 185, 129, 0.08)" : "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input 
                  type="checkbox" 
                  checked={includeApostille} 
                  onChange={(e) => setIncludeApostille(e.target.checked)} 
                />
                <span>Apostille, Notary & Transcripts Verification</span>
              </span>
              <strong style={{ color: "#ffffff" }}>{formatMoney(60)}</strong>
            </label>

            <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", padding: "8px 10px", background: includeCourier ? "rgba(16, 185, 129, 0.08)" : "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input 
                  type="checkbox" 
                  checked={includeCourier} 
                  onChange={(e) => setIncludeCourier(e.target.checked)} 
                />
                <span>International Courier Dossier (DHL/FedEx)</span>
              </span>
              <strong style={{ color: "#ffffff" }}>{formatMoney(40)}</strong>
            </label>
          </div>
        </div>

      </div>

      {/* Itemized University Breakdown: Pre- vs Post-Admission Costs */}
      <div style={{ marginBottom: "20px" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: "700", color: "#ffffff", marginBottom: "12px" }}>
          Itemized Pre- vs. Post-Admission Breakdown for Shortlisted Programs ({itemBreakdowns.length})
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: "16px" }}>
          {itemBreakdowns.map((b) => (
            <div 
              key={b.universityId}
              className="glass-panel"
              style={{ padding: "18px", borderRadius: "14px" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <div>
                  <h4 style={{ fontSize: "1.05rem", fontWeight: "700", color: "#ffffff", margin: 0 }}>
                    {b.universityName}
                  </h4>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", margin: "2px 0 0 0" }}>
                    {b.city}, {b.country}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveItem && onRemoveItem(b.universityId)}
                  className="btn btn-secondary"
                  style={{ padding: "3px 8px", fontSize: "0.72rem", color: "#fb7185" }}
                >
                  <Trash2 size={12} />
                  <span>Remove</span>
                </button>
              </div>

              {/* The Two Cards Side by Side */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                
                {/* Card 1: Pre-Admission Costs */}
                <div style={{
                  background: "rgba(245, 158, 11, 0.06)",
                  border: "1px solid rgba(245, 158, 11, 0.3)",
                  borderRadius: "10px",
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#f59e0b", textTransform: "uppercase" }}>
                        Pre-Admission (Sunk)
                      </span>
                      <span className="badge" style={{ fontSize: "0.62rem", padding: "1px 5px", background: "rgba(245, 158, 11, 0.15)", color: "#fcd34d" }}>
                        {b.preAdmissionCard.applicationPortalType}
                      </span>
                    </div>

                    <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "#ffffff", marginTop: "2px" }}>
                      {formatMoney(b.preAdmissionCard.applicationFeeEUR)}
                    </div>
                    <p style={{ fontSize: "0.72rem", color: "var(--text-secondary)", margin: "3px 0 0 0" }}>
                      {b.preAdmissionCard.portalFeeNote}
                    </p>

                    {b.preAdmissionCard.apsRequirement.isRequired && (
                      <div style={{ marginTop: "6px", fontSize: "0.68rem", color: "#fcd34d", background: "rgba(245, 158, 11, 0.12)", padding: "3px 6px", borderRadius: "4px" }}>
                        ⚠️ APS India: {formatMoney(195)} mandatory
                      </div>
                    )}

                    {/* High-visibility LOR Requirement Badge */}
                    {(() => {
                      const matchedUni = cartItems.find(it => (it.id || it) === b.universityId);
                      const lorBadge = getLORBadge(matchedUni || b);
                      return (
                        <div style={{ marginTop: "6px" }}>
                          <span style={{
                            background: lorBadge.badgeBg,
                            color: lorBadge.badgeColor,
                            border: `1px solid ${lorBadge.badgeBorder}`,
                            fontSize: "0.68rem",
                            fontWeight: 800,
                            padding: "2px 6px",
                            borderRadius: "4px",
                            display: "inline-block"
                          }}>
                            {lorBadge.text}
                          </span>
                        </div>
                      );
                    })()}
                  </div>

                  <div style={{ marginTop: "8px", paddingTop: "4px", borderTop: "1px dashed rgba(255,255,255,0.08)", fontSize: "0.66rem", color: "var(--text-muted)" }}>
                    Non-refundable before admission
                  </div>
                </div>

                {/* Card 2: Post-Admission Costs */}
                <div style={{
                  background: "rgba(16, 185, 129, 0.06)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  borderRadius: "10px",
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#34d399", textTransform: "uppercase" }}>
                        Post-Admission (Reg.)
                      </span>
                      <span className="badge" style={{ fontSize: "0.62rem", padding: "1px 5px", background: "rgba(16, 185, 129, 0.15)", color: "#6ee7b7" }}>
                        Mandatory
                      </span>
                    </div>

                    <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "#ffffff", marginTop: "2px" }}>
                      {formatMoney(b.postAdmissionCard.mandatorySemesterFeeEUR)}/sem
                    </div>
                    <p style={{ fontSize: "0.72rem", color: "var(--text-secondary)", margin: "3px 0 0 0", lineHeight: "1.25" }}>
                      {b.postAdmissionCard.semesterFeeBreakdown}
                    </p>

                    <div style={{ marginTop: "6px", fontSize: "0.7rem", color: "#93c5fd" }}>
                      🛡️ Visa Funds: {formatMoney(b.postAdmissionCard.visaProofOfFundsEUR)}/yr
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "#34d399", marginTop: "2px" }}>
                      💰 Tuition: {b.postAdmissionCard.tuitionDisplay}
                    </div>
                  </div>

                  <div style={{ marginTop: "8px", paddingTop: "4px", borderTop: "1px dashed rgba(255,255,255,0.08)", fontSize: "0.66rem", color: "var(--text-muted)" }}>
                    Includes transit pass & student union
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Student Dashboard & Checklist: Dynamic LOR Tracker */}
      <ApplicationLORTracker 
        universities={cartItems} 
        onOpenDetailModal={(uni) => setSelectedUniForModal(uni)}
      />

      {/* University Detail Modal */}
      <UniversityDetailModal
        isOpen={Boolean(selectedUniForModal)}
        onClose={() => setSelectedUniForModal(null)}
        university={selectedUniForModal}
      />

    </div>
  );
}
