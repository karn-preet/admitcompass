import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import ProfileIntake from "./components/ProfileIntake";
import ResultsDashboard from "./components/ResultsDashboard";
import OfficialCitationsModal from "./components/OfficialCitationsModal";
import RateMyChancesView from "./components/RateMyChancesView";
import AdmitsRejectsView from "./components/AdmitsRejectsView";
import LowTuitionExplorerView from "./components/LowTuitionExplorerView";
import AiVisaMockView from "./components/AiVisaMockView";
import AiSopStudioView from "./components/AiSopStudioView";
import ScholarshipsView from "./components/ScholarshipsView";
import LoanRoiCalculatorView from "./components/LoanRoiCalculatorView";
import CommunityDiscussionsView from "./components/CommunityDiscussionsView";
import ApplicationCartModal from "./components/ApplicationCartModal";
import ModernTopNav from "./components/ModernTopNav";
import MobileCardFeed from "./components/MobileCardFeed";
import BottomNavBar from "./components/BottomNavBar";
import VisaGuidesView from "./components/VisaGuidesView";

// Woolmers Editorial Design Components
import WoolmersHero from "./components/WoolmersHero";
import WoolmersStoryBlocks from "./components/WoolmersStoryBlocks";
import WoolmersUniversityGrid from "./components/WoolmersUniversityGrid";
import Interactive3DGlobe from "./components/Interactive3DGlobe";

import { evaluateProfile, fetchUniversities } from "./services/api";
import { Sparkles, AlertCircle, Compass, ShieldCheck, MapPin, Award, ExternalLink } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedCountry, setSelectedCountry] = useState("Germany");
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCitationsModalOpen, setIsCitationsModalOpen] = useState(false);

  // Search & Filter State passed between Hero, 3D Globe, and University Grid
  const [heroSearchQuery, setHeroSearchQuery] = useState("");
  const [heroSearchCountry, setHeroSearchCountry] = useState("All");
  const [allUniversities, setAllUniversities] = useState([]);

  useEffect(() => {
    async function loadAllUnis() {
      try {
        const res = await fetchUniversities();
        if (res && res.success && Array.isArray(res.data)) {
          setAllUniversities(res.data);
        }
      } catch (err) {
        console.error("Failed loading universities list:", err);
      }
    }
    loadAllUnis();
  }, []);

  // Application Cart & Sunk Cost State
  const [cartItems, setCartItems] = useState([]);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  const handleToggleCartItem = (uni) => {
    setCartItems(prev => {
      const exists = prev.some(it => (it.id || it) === uni.id);
      if (exists) {
        return prev.filter(it => (it.id || it) !== uni.id);
      } else {
        return [...prev, uni];
      }
    });
  };

  const handleRemoveCartItem = (id) => {
    setCartItems(prev => prev.filter(it => (it.id || it) !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleEvaluate = async (payload) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await evaluateProfile(payload);
      if (response.success) {
        setEvaluationResult(response.data);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setErrorMessage(response.error || "Evaluation failed. Please verify inputs.");
      }
    } catch (err) {
      console.error("Evaluation API error:", err);
      setErrorMessage("Could not connect to backend evaluation service. Please check server status.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setEvaluationResult(null);
    setErrorMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setErrorMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (sectionId) => {
    if (activeTab !== "evaluator") {
      setActiveTab("evaluator");
    }
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleHeroSearch = ({ degreeQuery, country }) => {
    setHeroSearchQuery(degreeQuery || "");
    if (country) {
      setHeroSearchCountry(country);
      setSelectedCountry(country);
    }
    scrollToSection("university-grid-section");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--bg-main)" }}>
      
      {/* Sticky Top Navigation with Yellow Pro Button, Avatar, and Full-Width Yellow Alert Banner */}
      <ModernTopNav 
        onSelectTab={handleTabChange}
        onOpenCart={() => setIsCartModalOpen(true)}
        cartCount={cartItems.length}
        onOpenCitations={() => setIsCitationsModalOpen(true)}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: "0 0 40px 0" }}>
        
        {/* Global Error Alert */}
        {errorMessage && (
          <div className="container" style={{ margin: "20px auto 10px auto" }}>
            <div style={{ 
              background: "rgba(185, 43, 39, 0.1)", 
              border: "1px solid var(--risk-high-border)", 
              borderRadius: "12px", 
              padding: "16px 20px", 
              display: "flex", 
              alignItems: "center", 
              gap: "10px",
              color: "var(--risk-high-text)"
            }}>
              <AlertCircle size={20} />
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* TAB 1: Home (Mobile-First Stacked Card Feed) */}
        {activeTab === "home" && (
          <MobileCardFeed 
            onSelectTab={handleTabChange}
            onExploreUniversities={() => handleTabChange("universities")}
            onStartEvaluation={() => handleTabChange("profile")}
            onOpenGlobe={() => handleTabChange("universities")}
            selectedCountry={selectedCountry}
            onSelectCountry={(c) => {
              setSelectedCountry(c);
              setHeroSearchCountry(c);
            }}
          />
        )}

        {/* TAB 2: Universities (Interactive 3D Globe + 147 Public European Universities Grid) */}
        {activeTab === "universities" && (
          <div>
            <div className="container" style={{ paddingTop: "20px" }}>
              <Interactive3DGlobe 
                selectedCountry={heroSearchCountry}
                onSelectCountry={(c) => {
                  setHeroSearchCountry(c);
                  setSelectedCountry(c);
                }}
                universities={allUniversities}
              />
              <WoolmersUniversityGrid 
                initialSearchQuery={heroSearchQuery}
                initialCountry={heroSearchCountry}
                onCountryChange={(c) => {
                  setHeroSearchCountry(c);
                  setSelectedCountry(c);
                }}
                cartItems={cartItems}
                onToggleCartItem={handleToggleCartItem}
                onOpenCart={() => setIsCartModalOpen(true)}
                onStartEvaluation={() => handleTabChange("profile")}
              />
            </div>
          </div>
        )}

        {/* TAB 3: Map (Interactive Student Life & Housing Map) */}
        {(activeTab === "map" || activeTab === "campusMap") && <StudentLifeMapView />}

        {/* TAB 4: Visas (Visa Requirements, Proof of Funds, & AI Consular Mock) */}
        {activeTab === "visas" && (
          <VisaGuidesView 
            evaluationResult={evaluationResult}
            onOpenVisaMock={() => handleTabChange("visaMock")}
            onStartEvaluation={() => handleTabChange("profile")}
          />
        )}

        {/* TAB 5: Profile & Admission Evaluator */}
        {(activeTab === "profile" || activeTab === "evaluator") && (
          !evaluationResult ? (
            <div className="container" style={{ maxWidth: "860px", margin: "0 auto", padding: "28px 16px 64px 16px" }}>
              <div style={{ textAlign: "center", marginBottom: "30px" }}>
                <span className="pill-dark" style={{ marginBottom: "12px" }}>
                  OFFICIAL ADMISSIONS INTELLIGENCE
                </span>
                <h2 
                  style={{ 
                    fontSize: "clamp(1.8rem, 3.5vw, 2.3rem)", 
                    fontWeight: "800", 
                    color: "#0F172A",
                    marginBottom: "10px",
                    letterSpacing: "-0.02em"
                  }}
                >
                  Calculate Your Admission Odds & Visa Refusal Risks
                </h2>
                <p style={{ color: "#64748B", fontSize: "1.02rem", lineHeight: 1.5, maxWidth: "620px", margin: "0 auto" }}>
                  Enter your academic credentials, standardized tests, and sponsor funds to cross-reference against 147 public universities.
                </p>
              </div>

              <ProfileIntake 
                onSubmit={handleEvaluate}
                isLoading={isLoading}
                selectedCountry={selectedCountry}
                onCountryChange={(c) => setSelectedCountry(c)}
              />
            </div>
          ) : (
            <ResultsDashboard 
              evaluationData={evaluationResult}
              onResetForm={handleReset}
              onOpenCitations={() => setIsCitationsModalOpen(true)}
              cartItems={cartItems}
              onToggleCartItem={handleToggleCartItem}
              onOpenCart={() => setIsCartModalOpen(true)}
              onRemoveCartItem={handleRemoveCartItem}
              onClearCart={handleClearCart}
            />
          )
        )}

        {/* TAB 2: Campus & Housing Map */}
        {activeTab === "campusMap" && <StudentLifeMapView />}

        {/* TAB 3: RateMyChances */}
        {activeTab === "rateMyChances" && <RateMyChancesView />}

        {/* TAB 4: Admits & Rejects Database */}
        {activeTab === "decisions" && <AdmitsRejectsView />}

        {/* TAB 5: €0 / Cheap Universities Explorer */}
        {activeTab === "cheapUnis" && (
          <LowTuitionExplorerView 
            cartItems={cartItems}
            onToggleCartItem={handleToggleCartItem}
            onOpenCart={() => setIsCartModalOpen(true)}
          />
        )}

        {/* TAB 6: AI Visa Mock Interview */}
        {activeTab === "visaMock" && <AiVisaMockView />}

        {/* TAB 7: AI SOP Studio (Generator & Reviewer) */}
        {activeTab === "sopStudio" && <AiSopStudioView />}

        {/* TAB 8: Scholarships Directory */}
        {activeTab === "scholarships" && <ScholarshipsView />}

        {/* TAB 9: Loan & ROI Calculator */}
        {activeTab === "loans" && <LoanRoiCalculatorView />}

        {/* TAB 10: Community Discussions */}
        {activeTab === "community" && <CommunityDiscussionsView />}

      </main>

      {/* Application Cart & Pre-Admission Sunk Cost Simulator Modal */}
      <ApplicationCartModal 
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        originCountry={evaluationResult?.studentProfile?.citizenship || "India"}
      />

      {/* Official Citations Modal */}
      <OfficialCitationsModal 
        isOpen={isCitationsModalOpen}
        onClose={() => setIsCitationsModalOpen(false)}
      />

      {/* Woolmers Heritage Editorial Footer */}
      <footer 
        style={{ 
          borderTop: "1px solid var(--border-warm)", 
          padding: "54px 24px 34px 24px", 
          background: "#1A1C19",
          color: "#FAF8F5",
          marginTop: "60px"
        }}
      >
        <div className="container">
          
          <div 
            style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", 
              gap: "36px", 
              marginBottom: "40px" 
            }}
          >
            {/* Column 1: Brand & Mission */}
            <div style={{ maxWidth: "340px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "var(--accent-green)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Compass size={18} color="#FAF8F5" />
                </div>
                <span style={{ fontFamily: "var(--font-brand)", fontSize: "1.35rem", fontWeight: 800, color: "#FAF8F5", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <span>Global</span>
                  <span style={{ fontFamily: "var(--font-gurmukhi)", color: "#FDE047", fontWeight: 900 }}>ਪੰਜਾਬ</span>
                </span>
              </div>
              <p style={{ color: "#A8ACA5", fontSize: "0.86rem", lineHeight: 1.6, marginBottom: "14px" }}>
                A 100% free, open-access intelligence platform for international applicants targeting accredited public universities across Europe and worldwide.
              </p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--accent-gold)", fontSize: "0.8rem", fontWeight: 600 }}>
                <span>Zero Paywalls • Zero Login Gates • Always Free</span>
              </div>
            </div>

            {/* Column 2: Core Solutions */}
            <div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontWeight: 700, color: "#FAF8F5", marginBottom: "14px", letterSpacing: "0.02em" }}>
                Key Solutions
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.86rem" }}>
                <li>
                  <button 
                    onClick={() => scrollToSection("university-grid-section")}
                    style={{ background: "none", border: "none", color: "#C6CAC2", cursor: "pointer", padding: 0, fontSize: "inherit", textAlign: "left" }}
                  >
                    147 Public European Universities
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection("intake-form-section")}
                    style={{ background: "none", border: "none", color: "#C6CAC2", cursor: "pointer", padding: 0, fontSize: "inherit", textAlign: "left" }}
                  >
                    Visa Refusal Mitigation Engine
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleTabChange("campusMap")}
                    style={{ background: "none", border: "none", color: "#C6CAC2", cursor: "pointer", padding: 0, fontSize: "inherit", textAlign: "left" }}
                  >
                    Interactive Campus & Housing Map
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleTabChange("scholarships")}
                    style={{ background: "none", border: "none", color: "#C6CAC2", cursor: "pointer", padding: 0, fontSize: "inherit", textAlign: "left" }}
                  >
                    Global Scholarships Directory
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleTabChange("cheapUnis")}
                    style={{ background: "none", border: "none", color: "#C6CAC2", cursor: "pointer", padding: 0, fontSize: "inherit", textAlign: "left" }}
                  >
                    €0 Tuition Public Degrees
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Consular Regulatory Authorities */}
            <div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontWeight: 700, color: "#FAF8F5", marginBottom: "14px", letterSpacing: "0.02em" }}>
                Official Frameworks
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.86rem", color: "#A8ACA5" }}>
                <li>• DAAD & German Residence Act §16b</li>
                <li>• Academic Evaluation Centre (APS) India</li>
                <li>• Campus France & CROUS Housing</li>
                <li>• US State Dept FAM & INA §214(b)</li>
                <li>• IRCC Canada Student Direct Stream (SDS)</li>
              </ul>
            </div>

            {/* Column 4: Trust & Transparency */}
            <div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontWeight: 700, color: "#FAF8F5", marginBottom: "14px", letterSpacing: "0.02em" }}>
                Verifiable Data
              </div>
              <p style={{ color: "#A8ACA5", fontSize: "0.84rem", lineHeight: 1.5, marginBottom: "12px" }}>
                Every admission cutoff, visa regulation, and fee schedule is cross-referenced with official ministerial databases.
              </p>
              <button 
                onClick={() => setIsCitationsModalOpen(true)}
                className="btn"
                style={{
                  background: "transparent",
                  border: "1px solid var(--accent-gold)",
                  color: "var(--accent-gold)",
                  padding: "8px 14px",
                  fontSize: "0.82rem",
                  borderRadius: "6px"
                }}
              >
                <ShieldCheck size={14} />
                <span>Open Citations Directory</span>
              </button>
            </div>

          </div>

          {/* Bottom Copyright & Guarantee */}
          <div 
            style={{ 
              borderTop: "1px solid rgba(255, 255, 255, 0.08)", 
              paddingTop: "24px", 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              flexWrap: "wrap", 
              gap: "14px", 
              fontSize: "0.8rem", 
              color: "#787D75" 
            }}
          >
            <div>
              © {new Date().getFullYear()} Global ਪੰਜਾਬ. Built for prospective global scholars. Free open-access academic intelligence.
            </div>
            <div style={{ display: "flex", gap: "16px" }}>
              <span>Playfair Display & Plus Jakarta Sans Design System</span>
              <span>•</span>
              <span>Inspired by Woolmers Heritage Architecture</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Fixed Bottom Navigation Bar (Home, Universities, Map, Visas, Profile) */}
      <BottomNavBar 
        activeTab={activeTab} 
        onSelectTab={handleTabChange} 
        cartCount={cartItems.length} 
      />

    </div>
  );
}
