import React, { useState, useEffect } from "react";
import { fetchLoanProviders, calculateLoanEMI } from "../services/api";
import { 
  Landmark, Calculator, Percent, ShieldCheck, CheckCircle2, 
  ExternalLink, ArrowUpRight, TrendingUp, DollarSign, HelpCircle 
} from "lucide-react";

export default function LoanRoiCalculatorView() {
  const [providers, setProviders] = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(true);

  // Calculator inputs
  const [loanAmountLakhs, setLoanAmountLakhs] = useState(40); // ₹40 Lakhs
  const [interestRate, setInterestRate] = useState(9.5); // 9.5%
  const [tenureYears, setTenureYears] = useState(10); // 10 years
  const [moratoriumMonths, setMoratoriumMonths] = useState(24); // 24 months

  // Calculation result
  const [calcResult, setCalcResult] = useState(null);
  const [calculating, setCalculating] = useState(false);

  // Load bank providers
  useEffect(() => {
    async function load() {
      try {
        const res = await fetchLoanProviders();
        if (res.success) {
          setProviders(res.data);
        }
      } catch (e) {
        console.error("Failed to load loan providers:", e);
      } finally {
        setLoadingProviders(false);
      }
    }
    load();
  }, []);

  // Recalculate EMI whenever inputs change
  useEffect(() => {
    async function runCalculation() {
      setCalculating(true);
      try {
        const payload = {
          loanAmountInr: loanAmountLakhs * 100000,
          interestRatePercent: parseFloat(interestRate),
          tenureYears: parseInt(tenureYears, 10),
          moratoriumMonths: parseInt(moratoriumMonths, 10)
        };

        const res = await calculateLoanEMI(payload);
        if (res.success) {
          setCalcResult(res.data);
        }
      } catch (e) {
        console.error("EMI calculation error:", e);
      } finally {
        setCalculating(false);
      }
    }
    runCalculation();
  }, [loanAmountLakhs, interestRate, tenureYears, moratoriumMonths]);

  // Apply bank rate preset
  const applyBankPreset = (bank) => {
    setInterestRate(bank.interestRateMin);
  };

  return (
    <div className="container" style={{ paddingBottom: "60px" }}>
      {/* Header Banner */}
      <div style={{ textAlign: "center", maxWidth: "850px", margin: "0 auto 32px auto" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "6px 16px", borderRadius: "999px", marginBottom: "16px" }}>
          <Landmark size={16} color="#059669" />
          <span style={{ fontSize: "0.82rem", color: "#047857", fontWeight: "700" }}>
            Free Education Loan & Section 80E Tax Savings Engine
          </span>
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.4rem", fontWeight: "800", color: "var(--text-primary)", letterSpacing: "-1px" }}>
          Study Abroad Loan & EMI Calculator
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", marginTop: "12px" }}>
          Compare Public vs Private vs International education loan lenders. Calculate monthly EMIs, moratorium interest accumulation, and tax savings under Section 80E of the Indian IT Act.
        </p>
      </div>

      {/* Main Grid: Calculator on Left, Result on Right */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", marginBottom: "48px" }}>
        
        {/* Left Column: Interactive Sliders */}
        <div className="glass-panel" style={{ padding: "28px" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "var(--text-primary)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
            <Calculator color="#2563eb" size={20} />
            Loan Parameters
          </h3>

          {/* Loan Amount Slider */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <label style={{ fontSize: "0.86rem", color: "var(--text-primary)", fontWeight: "600" }}>
                Loan Amount (₹ INR)
              </label>
              <span style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1d4ed8" }}>
                ₹{loanAmountLakhs} Lakhs
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="150"
              step="1"
              value={loanAmountLakhs}
              onChange={e => setLoanAmountLakhs(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#2563eb", cursor: "pointer" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.74rem", color: "var(--text-muted)", marginTop: "4px" }}>
              <span>₹5 Lakhs</span>
              <span>₹50 Lakhs</span>
              <span>₹1.50 Crore</span>
            </div>
          </div>

          {/* Interest Rate Slider */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <label style={{ fontSize: "0.86rem", color: "var(--text-primary)", fontWeight: "600" }}>
                Annual Interest Rate (% p.a.)
              </label>
              <span style={{ fontSize: "1.1rem", fontWeight: "800", color: "#b45309" }}>
                {interestRate}%
              </span>
            </div>
            <input
              type="range"
              min="8.0"
              max="15.0"
              step="0.1"
              value={interestRate}
              onChange={e => setInterestRate(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#f59e0b", cursor: "pointer" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.74rem", color: "var(--text-muted)", marginTop: "4px" }}>
              <span>8.0% (SBI Public)</span>
              <span>11.0% (Private)</span>
              <span>15.0% (Non-Collateral)</span>
            </div>
          </div>

          {/* Repayment Tenure Slider */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <label style={{ fontSize: "0.86rem", color: "var(--text-primary)", fontWeight: "600" }}>
                Repayment Tenure (Years)
              </label>
              <span style={{ fontSize: "1.1rem", fontWeight: "800", color: "var(--text-primary)" }}>
                {tenureYears} Years
              </span>
            </div>
            <input
              type="range"
              min="3"
              max="15"
              step="1"
              value={tenureYears}
              onChange={e => setTenureYears(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#2563eb", cursor: "pointer" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.74rem", color: "var(--text-muted)", marginTop: "4px" }}>
              <span>3 Years</span>
              <span>10 Years</span>
              <span>15 Years</span>
            </div>
          </div>

          {/* Moratorium Period Slider */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <label style={{ fontSize: "0.86rem", color: "var(--text-primary)", fontWeight: "600" }}>
                Moratorium Period (Course Duration + Buffer)
              </label>
              <span style={{ fontSize: "1.1rem", fontWeight: "800", color: "#047857" }}>
                {moratoriumMonths} Months
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="36"
              step="6"
              value={moratoriumMonths}
              onChange={e => setMoratoriumMonths(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#10b981", cursor: "pointer" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.74rem", color: "var(--text-muted)", marginTop: "4px" }}>
              <span>0 Months</span>
              <span>18 Months</span>
              <span>36 Months</span>
            </div>
          </div>

          {/* Quick Bank Presets */}
          <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "16px" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>
              Or click a bank to auto-load prevailing interest rates:
            </span>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {providers.slice(0, 4).map(p => (
                <button
                  key={p.id}
                  onClick={() => applyBankPreset(p)}
                  style={{
                    fontSize: "0.74rem",
                    padding: "4px 8px",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "6px",
                    color: "var(--text-primary)",
                    cursor: "pointer",
                    fontWeight: "600"
                  }}
                >
                  {p.bankName.split(" ")[0]} ({p.interestRateMin}%)
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: EMI Calculation & Tax Savings Cards */}
        <div>
          {calcResult ? (
            <div className="glass-panel" style={{ padding: "28px" }}>
              
              {/* Monthly EMI Hero Card */}
              <div style={{ 
                background: "var(--bg-surface-elevated)", 
                borderRadius: "16px", 
                padding: "24px", 
                textAlign: "center", 
                marginBottom: "20px",
                border: "1px solid var(--border-subtle)"
              }}>
                <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "1px" }}>
                  Estimated Monthly EMI
                </div>
                <div style={{ 
                  fontSize: "3.2rem", 
                  fontWeight: "900", 
                  color: "#1d4ed8", 
                  fontFamily: "var(--font-display)",
                  lineHeight: 1.1,
                  margin: "8px 0"
                }}>
                  {calcResult.formatted.monthlyEmi}
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                  Repayment starts after your {moratoriumMonths}-month moratorium period.
                </div>
              </div>

              {/* Breakdown Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: "10px", padding: "14px" }}>
                  <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>Principal Borrowed</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--text-primary)", marginTop: "2px" }}>
                    {calcResult.formatted.loanAmount}
                  </div>
                </div>

                <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: "10px", padding: "14px" }}>
                  <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>Total Interest Payable</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "#b45309", marginTop: "2px" }}>
                    {calcResult.formatted.totalInterest}
                  </div>
                </div>

                <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: "10px", padding: "14px" }}>
                  <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>Total Repayment</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--text-primary)", marginTop: "2px" }}>
                    {calcResult.formatted.totalPayment}
                  </div>
                </div>

                <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: "10px", padding: "14px" }}>
                  <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>Moratorium Interest</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "#e11d48", marginTop: "2px" }}>
                    ₹{(calcResult.moratoriumInterestAccumulated / 100000).toFixed(2)} Lakhs
                  </div>
                </div>
              </div>

              {/* Section 80E Tax Deduction Box */}
              <div style={{ 
                background: "rgba(16, 185, 129, 0.12)", 
                border: "1px solid rgba(16, 185, 129, 0.35)", 
                borderRadius: "12px", 
                padding: "16px", 
                marginBottom: "16px" 
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <span className="badge badge-safe" style={{ fontSize: "0.72rem", marginBottom: "4px" }}>
                      🇮🇳 Section 80E Indian IT Act Benefit
                    </span>
                    <h4 style={{ fontSize: "1rem", fontWeight: "800", color: "var(--text-primary)", marginTop: "4px" }}>
                      Estimated Tax Savings: ~{calcResult.formatted.estimatedTaxSavedPerYear}
                    </h4>
                    <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
                      100% of interest paid on education loans from RBI-recognized banks is deductible from taxable income for up to 8 years without any upper limit!
                    </p>
                  </div>
                  <ShieldCheck size={28} color="#059669" />
                </div>
              </div>

            </div>
          ) : (
            <div className="glass-panel" style={{ padding: "40px", textAlign: "center" }}>
              Calculating loan projections...
            </div>
          )}
        </div>

      </div>

      {/* Comparison Table of Leading Bank Providers */}
      <div className="glass-panel" style={{ padding: "28px" }}>
        <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--text-primary)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
          <Landmark color="#2563eb" size={22} />
          Leading Study Abroad Education Loan Lenders Compared (2025/2026)
        </h3>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.86rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-subtle)", textAlign: "left" }}>
                <th style={{ padding: "12px", color: "var(--text-muted)" }}>Lender</th>
                <th style={{ padding: "12px", color: "var(--text-muted)" }}>Type</th>
                <th style={{ padding: "12px", color: "var(--text-muted)" }}>Interest Rate</th>
                <th style={{ padding: "12px", color: "var(--text-muted)" }}>Collateral</th>
                <th style={{ padding: "12px", color: "var(--text-muted)" }}>Processing Fee</th>
                <th style={{ padding: "12px", color: "var(--text-muted)" }}>Sec 80E Benefit</th>
                <th style={{ padding: "12px", color: "var(--text-muted)" }}>Direct Portal</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((p) => (
                <tr key={p.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td style={{ padding: "14px 12px", fontWeight: "700", color: "var(--text-primary)" }}>
                    {p.bankName}
                  </td>
                  <td style={{ padding: "14px 12px" }}>
                    <span style={{ fontSize: "0.74rem", background: "rgba(37, 99, 235, 0.1)", padding: "2px 8px", borderRadius: "4px", color: "#1d4ed8", fontWeight: "600" }}>
                      {p.bankType}
                    </span>
                  </td>
                  <td style={{ padding: "14px 12px", fontWeight: "700", color: "#b45309" }}>
                    {p.interestRateMin}% – {p.interestRateMax}%
                  </td>
                  <td style={{ padding: "14px 12px", color: p.collateralRequired ? "var(--text-secondary)" : "#047857", fontWeight: "600" }}>
                    {p.collateralRequired ? "Required (Property/FD)" : "Non-Collateral"}
                  </td>
                  <td style={{ padding: "14px 12px", color: "var(--text-secondary)" }}>
                    {p.processingFee}
                  </td>
                  <td style={{ padding: "14px 12px" }}>
                    {p.section80EEligible ? (
                      <span className="badge badge-safe" style={{ fontSize: "0.72rem" }}>
                        <CheckCircle2 size={12} /> Eligible
                      </span>
                    ) : (
                      <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Ineligible</span>
                    )}
                  </td>
                  <td style={{ padding: "14px 12px" }}>
                    <a
                      href={p.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                      style={{ padding: "4px 10px", fontSize: "0.76rem" }}
                    >
                      Official Page <ArrowUpRight size={12} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
