import React, { useState } from "react";
import { ShieldCheck, ShieldAlert, Euro, AlertCircle, Bot, Landmark, FileText, CheckCircle2, ChevronRight, ArrowRight } from "lucide-react";
import VisaMitigationCard from "./VisaMitigationCard";

export default function VisaGuidesView({ evaluationResult, onOpenVisaMock, onStartEvaluation }) {
  const [selectedCountry, setSelectedCountry] = useState("Germany");
  const [liquidFundsEUR, setLiquidFundsEUR] = useState(13000);

  const countryRequirements = {
    Germany: {
      accountType: "Statutory Blocked Account (Sperrkonto)",
      requiredAmountEUR: 11904,
      monthlyPayoutEUR: 992,
      officialLaw: "German Residence Act §16b AufenthG",
      providerList: "Coracle, Expatrio, Fintiba",
      mandatoryExtra: "Mandatory APS Certificate (India/China/Vietnam)",
      workRights: "140 full days / 280 half days per calendar year"
    },
    France: {
      accountType: "Attestation de Virement Irrévocable (AVI) / Bank Statement",
      requiredAmountEUR: 7380,
      monthlyPayoutEUR: 615,
      officialLaw: "Code de l'entrée et du séjour des étrangers (CESEDA)",
      providerList: "Société Générale, Studely, BNP Paribas",
      mandatoryExtra: "Etudes en France / Campus France Interview Clearance",
      workRights: "60% of annual statutory working hours (964 hours/year)"
    },
    Sweden: {
      accountType: "Liquid Bank Funds (Personal Account)",
      requiredAmountEUR: 10500,
      monthlyPayoutEUR: 875,
      officialLaw: "Swedish Migration Agency (Migrationsverket)",
      providerList: "National commercial bank statement in student's name",
      mandatoryExtra: "Comprehensive Health Insurance (if < 1 year program)",
      workRights: "No statutory hourly limit, provided study progress is maintained"
    },
    Netherlands: {
      accountType: "University Institutional Deposit / Verified Bank Statement",
      requiredAmountEUR: 12200,
      monthlyPayoutEUR: 1016,
      officialLaw: "IND (Immigration and Naturalisation Service)",
      providerList: "Direct university visa team deposit",
      mandatoryExtra: "Nuffic Certificate (for specific non-EEA programs)",
      workRights: "Max 16 hours per week with TWV work permit"
    },
    Ireland: {
      accountType: "Education Bond / Verified 6-Month Bank Statement",
      requiredAmountEUR: 10000,
      monthlyPayoutEUR: 833,
      officialLaw: "Irish Immigration Service Delivery (ISD)",
      providerList: "Electronic bank transfer or Education Bond Ireland",
      mandatoryExtra: "Private Medical Insurance for non-EEA students",
      workRights: "Stamp 2 permission: 20 hrs/week term-time, 40 hrs/week holidays"
    }
  };

  const currentReq = countryRequirements[selectedCountry] || countryRequirements["Germany"];
  const isSolvent = liquidFundsEUR >= currentReq.requiredAmountEUR;
  const difference = liquidFundsEUR - currentReq.requiredAmountEUR;

  return (
    <div className="container" style={{ maxWidth: "860px", margin: "0 auto", padding: "24px 16px" }}>
      
      {/* Header Banner */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#FEF08A", color: "#0F172A", padding: "4px 14px", borderRadius: "9999px", fontSize: "0.78rem", fontWeight: "800", marginBottom: "12px" }}>
          <span>NEW IMMIGRATION RULES 2026</span>
        </div>
        <h1 style={{ fontSize: "2.3rem", fontWeight: "800", color: "#0F172A", marginBottom: "8px", letterSpacing: "-0.02em" }}>
          Visa Requirements & Proof of Funds
        </h1>
        <p style={{ color: "#64748B", fontSize: "1.05rem", maxWidth: "620px", margin: "0 auto" }}>
          Official statutory living expense thresholds, blocked account calculations, and consular refusal risk mitigation.
        </p>
      </div>

      {/* Country Switcher Pills */}
      <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap", marginBottom: "28px" }}>
        {Object.keys(countryRequirements).map((country) => (
          <button
            key={country}
            onClick={() => setSelectedCountry(country)}
            style={{
              padding: "8px 18px",
              borderRadius: "9999px",
              border: "none",
              background: selectedCountry === country ? "#0F172A" : "#FFFFFF",
              color: selectedCountry === country ? "#FFFFFF" : "#334155",
              fontWeight: "700",
              fontSize: "0.88rem",
              boxShadow: selectedCountry === country ? "0 4px 12px rgba(15, 23, 42, 0.2)" : "0 2px 6px rgba(0,0,0,0.05)",
              cursor: "pointer",
              transition: "all 0.15s ease"
            }}
          >
            {country}
          </button>
        ))}
      </div>

      {/* Interactive Proof of Funds Calculator Card */}
      <div className="card-modern" style={{ padding: "28px", marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
          <div>
            <div style={{ fontSize: "0.78rem", fontWeight: "800", color: "#64748B", textTransform: "uppercase" }}>
              Official Financial Mandate
            </div>
            <h3 style={{ fontSize: "1.45rem", fontWeight: "800", color: "#0F172A" }}>
              {selectedCountry}: {currentReq.accountType}
            </h3>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: "600" }}>Statutory Requirement</div>
            <div style={{ fontSize: "1.6rem", fontWeight: "800", color: "#0F172A" }}>
              €{currentReq.requiredAmountEUR.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Liquid Funds Slider */}
        <div style={{ background: "#F8FAFC", padding: "18px", borderRadius: "18px", marginBottom: "20px", border: "1px solid #E2E8F0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <label style={{ fontSize: "0.86rem", fontWeight: "700", color: "#0F172A" }}>
              Your Planned Liquid Funds:
            </label>
            <span style={{ fontSize: "1.1rem", fontWeight: "800", color: "#2563EB" }}>
              €{liquidFundsEUR.toLocaleString()} (~₹{(liquidFundsEUR * 92.5).toLocaleString()})
            </span>
          </div>
          <input
            type="range"
            min="4000"
            max="30000"
            step="250"
            value={liquidFundsEUR}
            onChange={(e) => setLiquidFundsEUR(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#0F172A", cursor: "pointer" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#94A3B8", marginTop: "4px" }}>
            <span>€4,000 (Deficit)</span>
            <span>€11,904 (DE Standard)</span>
            <span>€30,000 (High Surplus)</span>
          </div>
        </div>

        {/* Solvency Result Banner */}
        <div
          style={{
            padding: "16px 20px",
            borderRadius: "16px",
            background: isSolvent ? "#DCFCE7" : "#FEE2E2",
            border: `1px solid ${isSolvent ? "#86EFAC" : "#FCA5A5"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {isSolvent ? <CheckCircle2 size={24} color="#166534" /> : <ShieldAlert size={24} color="#991B1B" />}
            <div>
              <div style={{ fontWeight: "800", color: isSolvent ? "#166534" : "#991B1B", fontSize: "0.95rem" }}>
                {isSolvent ? "Sufficient Funds for Visa Clearance" : "Funding Deficit Detected"}
              </div>
              <div style={{ fontSize: "0.82rem", color: isSolvent ? "#15803D" : "#B91C1C" }}>
                {isSolvent
                  ? `You hold a surplus of €${difference.toLocaleString()} above the consular statutory requirement.`
                  : `You require an additional €${Math.abs(difference).toLocaleString()} to satisfy ${currentReq.officialLaw}.`}
              </div>
            </div>
          </div>
          <span className={isSolvent ? "badge-pill badge-green" : "badge-pill badge-danger"}>
            {isSolvent ? "SOLVENT" : "AT RISK"}
          </span>
        </div>

        {/* Statutory Details Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", fontSize: "0.84rem" }}>
          <div style={{ background: "#FFFFFF", padding: "12px", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
            <div style={{ color: "#64748B", fontSize: "0.72rem", fontWeight: "700", textTransform: "uppercase" }}>Monthly Allowance</div>
            <div style={{ fontWeight: "700", color: "#0F172A", marginTop: "2px" }}>€{currentReq.monthlyPayoutEUR}/month</div>
          </div>
          <div style={{ background: "#FFFFFF", padding: "12px", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
            <div style={{ color: "#64748B", fontSize: "0.72rem", fontWeight: "700", textTransform: "uppercase" }}>Governing Law</div>
            <div style={{ fontWeight: "700", color: "#0F172A", marginTop: "2px" }}>{currentReq.officialLaw}</div>
          </div>
          <div style={{ background: "#FFFFFF", padding: "12px", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
            <div style={{ color: "#64748B", fontSize: "0.72rem", fontWeight: "700", textTransform: "uppercase" }}>Mandatory Requirement</div>
            <div style={{ fontWeight: "700", color: "#0F172A", marginTop: "2px" }}>{currentReq.mandatoryExtra}</div>
          </div>
        </div>
      </div>

      {/* AI Consular Visa Mock Banner */}
      <div
        className="card-modern"
        style={{
          padding: "26px",
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
          color: "#FFFFFF",
          marginBottom: "24px"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ maxWidth: "500px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(253, 224, 71, 0.2)", color: "#FDE047", padding: "3px 10px", borderRadius: "999px", fontSize: "0.74rem", fontWeight: "800", marginBottom: "8px" }}>
              <Bot size={13} />
              <span>AI CONSULAR SIMULATOR</span>
            </div>
            <h3 style={{ fontSize: "1.45rem", fontWeight: "800", color: "#FFFFFF", marginBottom: "6px" }}>
              Practice the Official Visa Interview
            </h3>
            <p style={{ color: "#94A3B8", fontSize: "0.88rem" }}>
              Pre-empt Section 214(b) immigrant intent questions, explain funding gaps, and receive a model consular answer.
            </p>
          </div>

          <button
            onClick={() => {
              if (onOpenVisaMock) onOpenVisaMock();
            }}
            className="btn-yellow"
            style={{ padding: "12px 22px", fontSize: "0.92rem" }}
          >
            Launch Visa Mock →
          </button>
        </div>
      </div>

      {/* Dynamic Profile Evaluation Results if available */}
      {evaluationResult && evaluationResult.visaEvaluation && (
        <div style={{ marginTop: "16px" }}>
          <VisaMitigationCard evaluationData={evaluationResult} />
        </div>
      )}

    </div>
  );
}
