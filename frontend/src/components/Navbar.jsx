import React, { useState, useEffect } from "react";
import { 
  Compass, ShieldCheck, TrendingUp, Database, Euro, 
  Bot, FileText, Award, Landmark, MessageSquare, Sparkles, ShoppingCart, MapPin, ChevronDown, CheckCircle2 
} from "lucide-react";

export default function Navbar({ 
  onOpenCitations, 
  onResetForm, 
  currentCountry, 
  onSelectCountry, 
  activeTab = "evaluator", 
  onSelectTab,
  cartCount = 0,
  onOpenCart,
  onStartEvaluation,
  onFindUniversities
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const secondaryTools = [
    { id: "cheapUnis", label: "€0 / Low Tuition Explorer", icon: Euro, badge: "<€3k" },
    { id: "rateMyChances", label: "RateMyChances Odds", icon: TrendingUp, badge: "Odds" },
    { id: "decisions", label: "Admits & Rejects Database", icon: Database, badge: "100+ Decisions" },
    { id: "visaMock", label: "AI Consular Visa Mock", icon: Bot, badge: "214(b)" },
    { id: "sopStudio", label: "AI SOP Studio & Reviewer", icon: FileText, badge: "Auditor" },
    { id: "loans", label: "Loan & EMI Calculator", icon: Landmark, badge: "Tax 80E" },
    { id: "community", label: "Community Discussions", icon: MessageSquare, badge: "Q&A" }
  ];

  return (
    <header 
      className={`woolmers-header ${isScrolled ? "scrolled" : ""}`}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        background: isScrolled ? "rgba(250, 248, 245, 0.96)" : "rgba(250, 248, 245, 0.88)",
        backdropFilter: "blur(14px)",
        borderBottom: isScrolled ? "1px solid var(--border-warm)" : "1px solid rgba(231, 226, 216, 0.7)",
        boxShadow: isScrolled ? "var(--shadow-md)" : "none"
      }}
    >
      {/* Main Minimalist Navigation Bar */}
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: isScrolled ? "10px 24px" : "14px 24px", transition: "padding 0.3s ease" }}>
        
        {/* Brand Logo & Editorial Crest */}
        <div 
          onClick={() => {
            if (onSelectTab) onSelectTab("evaluator");
            if (onResetForm) onResetForm();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}
        >
          <div 
            style={{ 
              width: "40px", 
              height: "40px", 
              borderRadius: "10px", 
              background: "var(--accent-green)", 
              border: "1px solid var(--accent-gold)",
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              boxShadow: "0 4px 14px rgba(30, 58, 43, 0.25)"
            }}
          >
            <Compass color="#FAF8F5" size={22} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontFamily: "var(--font-brand)", fontWeight: "900", fontSize: "1.35rem", letterSpacing: "-0.5px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <span style={{ color: "var(--text-primary)" }}>Global</span>
                <span style={{ fontFamily: "var(--font-gurmukhi)", color: "var(--accent-gold)", fontWeight: "900" }}>ਪੰਜਾਬ</span>
              </span>
              <span className="badge-pill badge-green" style={{ fontSize: "0.68rem", padding: "1px 8px" }}>
                100% Free
              </span>
            </div>
            <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
              European University & Visa Intelligence
            </p>
          </div>
        </div>

        {/* Uncluttered Core Navigation Menu (Woolmers Pattern) */}
        <nav style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          
          {/* Find Universities */}
          <button
            onClick={() => {
              if (onFindUniversities) {
                onFindUniversities();
              } else {
                if (onSelectTab) onSelectTab("evaluator");
                setTimeout(() => {
                  const el = document.getElementById("university-grid-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }
            }}
            style={{
              background: "transparent",
              border: "none",
              fontFamily: "var(--font-sans)",
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "var(--text-primary)",
              padding: "8px 14px",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent-green)"}
            onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-primary)"}
          >
            Find Universities
          </button>

          {/* Visa Calculator */}
          <button
            onClick={() => {
              if (onStartEvaluation) {
                onStartEvaluation();
              } else {
                if (onSelectTab) onSelectTab("evaluator");
                setTimeout(() => {
                  const el = document.getElementById("intake-form-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }
            }}
            style={{
              background: activeTab === "evaluator" ? "var(--accent-green-light)" : "transparent",
              border: "none",
              fontFamily: "var(--font-sans)",
              fontSize: "0.9rem",
              fontWeight: 600,
              color: activeTab === "evaluator" ? "var(--accent-green)" : "var(--text-primary)",
              padding: "8px 14px",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent-green)"}
            onMouseLeave={(e) => e.currentTarget.style.color = activeTab === "evaluator" ? "var(--accent-green)" : "var(--text-primary)"}
          >
            Visa Calculator
          </button>

          {/* Campus & Housing Map */}
          <button
            onClick={() => onSelectTab && onSelectTab("campusMap")}
            style={{
              background: activeTab === "campusMap" ? "var(--accent-green-light)" : "transparent",
              border: "none",
              fontFamily: "var(--font-sans)",
              fontSize: "0.9rem",
              fontWeight: 600,
              color: activeTab === "campusMap" ? "var(--accent-green)" : "var(--text-primary)",
              padding: "8px 14px",
              borderRadius: "6px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent-green)"}
            onMouseLeave={(e) => e.currentTarget.style.color = activeTab === "campusMap" ? "var(--accent-green)" : "var(--text-primary)"}
          >
            <MapPin size={15} color="var(--accent-green)" />
            <span>Campus & Housing Map</span>
          </button>

          {/* Scholarships */}
          <button
            onClick={() => onSelectTab && onSelectTab("scholarships")}
            style={{
              background: activeTab === "scholarships" ? "var(--accent-green-light)" : "transparent",
              border: "none",
              fontFamily: "var(--font-sans)",
              fontSize: "0.9rem",
              fontWeight: 600,
              color: activeTab === "scholarships" ? "var(--accent-green)" : "var(--text-primary)",
              padding: "8px 14px",
              borderRadius: "6px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent-green)"}
            onMouseLeave={(e) => e.currentTarget.style.color = activeTab === "scholarships" ? "var(--accent-green)" : "var(--text-primary)"}
          >
            <Award size={15} color="var(--accent-gold)" />
            <span>Scholarships</span>
          </button>

          {/* More Tools Dropdown */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
              style={{
                background: "transparent",
                border: "none",
                fontFamily: "var(--font-sans)",
                fontSize: "0.88rem",
                fontWeight: 600,
                color: "var(--text-secondary)",
                padding: "8px 12px",
                borderRadius: "6px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px"
              }}
            >
              <span>More Tools</span>
              <ChevronDown size={14} style={{ transform: isToolsDropdownOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }} />
            </button>

            {/* Dropdown Menu */}
            {isToolsDropdownOpen && (
              <div 
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  marginTop: "8px",
                  background: "#FFFFFF",
                  border: "1px solid var(--border-warm)",
                  borderRadius: "12px",
                  boxShadow: "var(--shadow-lg)",
                  padding: "8px",
                  width: "260px",
                  zIndex: 200,
                  display: "flex",
                  flexDirection: "column",
                  gap: "3px"
                }}
              >
                {secondaryTools.map(tool => {
                  const ToolIcon = tool.icon;
                  const isCur = activeTab === tool.id;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => {
                        setIsToolsDropdownOpen(false);
                        if (onSelectTab) onSelectTab(tool.id);
                      }}
                      style={{
                        background: isCur ? "var(--accent-green-light)" : "transparent",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        textAlign: "left",
                        cursor: "pointer",
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.84rem",
                        color: isCur ? "var(--accent-green)" : "var(--text-primary)",
                        fontWeight: isCur ? 700 : 500,
                        transition: "background 0.15s ease"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-secondary)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = isCur ? "var(--accent-green-light)" : "transparent"}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <ToolIcon size={16} color={isCur ? "var(--accent-green)" : "var(--text-muted)"} />
                        <span>{tool.label}</span>
                      </div>
                      <span style={{ fontSize: "0.68rem", padding: "2px 6px", borderRadius: "4px", background: "var(--bg-main)", color: "var(--text-muted)" }}>
                        {tool.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

        </nav>

        {/* Action Buttons: Citations & Application Cart */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          
          {/* Official Citations */}
          <button 
            onClick={onOpenCitations}
            className="btn btn-secondary" 
            style={{ padding: "7px 12px", fontSize: "0.8rem", borderRadius: "6px" }}
            title="View verified official citations to DAAD, APS, US State Dept, IRCC"
          >
            <ShieldCheck size={14} color="var(--accent-green)" />
            <span>Citations</span>
          </button>

          {/* Application Cart */}
          <button
            type="button"
            onClick={onOpenCart}
            className="btn"
            style={{
              padding: "7px 14px",
              fontSize: "0.82rem",
              borderRadius: "6px",
              background: cartCount > 0 ? "var(--accent-green)" : "#FFFFFF",
              border: cartCount > 0 ? "1px solid var(--accent-green)" : "1px solid var(--border-warm)",
              color: cartCount > 0 ? "#FFFFFF" : "var(--text-primary)",
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              fontWeight: 600,
              boxShadow: cartCount > 0 ? "0 4px 12px rgba(30, 58, 43, 0.25)" : "none"
            }}
            title="Open Application Cart & Pre-Admission Sunk Cost Simulator"
          >
            <ShoppingCart size={15} color={cartCount > 0 ? "#FFFFFF" : "var(--text-secondary)"} />
            <span>Cart</span>
            <span style={{
              background: cartCount > 0 ? "var(--accent-gold)" : "var(--bg-secondary)",
              color: cartCount > 0 ? "#0F172A" : "var(--text-muted)",
              fontSize: "0.7rem",
              fontWeight: "800",
              padding: "1px 7px",
              borderRadius: "999px"
            }}>
              {cartCount}
            </span>
          </button>

          {/* Quick Evaluate Profile CTA */}
          <button
            onClick={() => {
              if (onSelectTab) onSelectTab("evaluator");
              setTimeout(() => {
                const el = document.getElementById("intake-form-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
            className="btn btn-primary"
            style={{ padding: "8px 16px", fontSize: "0.84rem", borderRadius: "6px" }}
          >
            <Compass size={14} />
            <span>Free Evaluation</span>
          </button>

        </div>

      </div>
    </header>
  );
}
