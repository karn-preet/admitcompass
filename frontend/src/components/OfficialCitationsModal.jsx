import React, { useState, useEffect } from "react";
import { 
  X, 
  ShieldCheck, 
  ExternalLink, 
  Search, 
  CheckCircle2, 
  AlertCircle,
  Globe2,
  RefreshCw
} from "lucide-react";
import { fetchOfficialCitations, fetchOfficialPortals, verifyLivePortalUrl } from "../services/api";

export default function OfficialCitationsModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("portals"); // "portals" or "citations"
  const [citations, setCitations] = useState([]);
  const [portals, setPortals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState("");
  const [testUrl, setTestUrl] = useState("");
  const [customVerification, setCustomVerification] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [citRes, portRes] = await Promise.all([
        fetchOfficialCitations().catch(() => ({ data: [] })),
        fetchOfficialPortals().catch(() => ({ data: [] }))
      ]);
      setCitations(citRes.data || []);
      setPortals(portRes.data || []);
    } catch (err) {
      console.error("Failed to load citations/portals:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomVerify = async (e) => {
    e.preventDefault();
    if (!testUrl) return;
    setIsVerifying(true);
    setCustomVerification(null);
    try {
      const response = await verifyLivePortalUrl(testUrl);
      setCustomVerification(response.data);
    } catch (err) {
      setCustomVerification({ isValid: false, error: err.message });
    } finally {
      setIsVerifying(false);
    }
  };

  if (!isOpen) return null;

  const filteredCitations = citations.filter(c => 
    c.country.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.authority.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(10, 15, 29, 0.85)",
      backdropFilter: "blur(12px)",
      zIndex: 100,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      
      <div 
        className="glass-panel" 
        style={{
          width: "100%",
          maxWidth: "860px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          background: "#FFFFFF",
          border: "1px solid var(--border-warm)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.25)",
          borderRadius: "20px",
          overflow: "hidden"
        }}
      >
        
        {/* Modal Header */}
        <div style={{
          padding: "20px 24px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#FFFFFF"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(37, 99, 235, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ShieldCheck color="#2563eb" size={22} />
            </div>
            <div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>
                Official Government & University Source Citations
              </h3>
              <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", margin: 0 }}>
                100% verified clickable links back to official immigration portals and public university regulations.
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-warm)",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              color: "var(--text-primary)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: "24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Live Scraper Verification Tester */}
          <div style={{ 
            background: "var(--bg-main)", 
            border: "1px solid var(--border-warm)", 
            borderRadius: "12px", 
            padding: "16px" 
          }}>
            <h4 style={{ fontSize: "0.88rem", fontWeight: "700", color: "#1d4ed8", marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
              <Globe2 size={16} />
              <span>Real-Time Web Scraper Verification Test</span>
            </h4>
            <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "12px" }}>
              Test our backend scraper against any live university course page or government portal:
            </p>
            
            <form onSubmit={handleCustomVerify} style={{ display: "flex", gap: "8px" }}>
              <input 
                type="url"
                required
                className="form-input"
                placeholder="https://www.daad.de/en/ or https://travel.state.gov/..."
                value={testUrl}
                onChange={(e) => setTestUrl(e.target.value)}
                style={{ flex: 1 }}
              />
              <button 
                type="submit" 
                disabled={isVerifying}
                className="btn btn-primary"
                style={{ padding: "8px 16px", fontSize: "0.85rem" }}
              >
                {isVerifying ? <RefreshCw className="animate-spin" size={16} /> : "Scrape & Verify"}
              </button>
            </form>

            {customVerification && (
              <div style={{ marginTop: "12px", background: "#FFFFFF", border: "1px solid var(--border-subtle)", borderRadius: "8px", padding: "12px", fontSize: "0.8rem" }}>
                {customVerification.isValid ? (
                  <div>
                    <div style={{ color: "#047857", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>
                      <CheckCircle2 size={16} />
                      <span>Live Verified: HTTP {customVerification.httpStatus} OK ({customVerification.domainCategory})</span>
                    </div>
                    <div style={{ color: "var(--text-primary)", marginTop: "4px" }}>
                      <strong>Page Title:</strong> {customVerification.pageTitle}
                    </div>
                    <div style={{ color: "var(--text-secondary)", fontSize: "0.74rem", marginTop: "2px" }}>
                      Timestamp: {customVerification.verifiedTimestamp}
                    </div>
                  </div>
                ) : (
                  <div style={{ color: "#b91c1c", display: "flex", alignItems: "center", gap: "6px" }}>
                    <AlertCircle size={16} />
                    <span>Error: {customVerification.error}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tab Selector: 27 EU National Portals vs Legal Citations */}
          <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "10px" }}>
            <button
              type="button"
              onClick={() => setActiveTab("portals")}
              className="btn"
              style={{
                padding: "8px 16px",
                fontSize: "0.84rem",
                background: activeTab === "portals" ? "#2563eb" : "var(--bg-secondary)",
                color: activeTab === "portals" ? "#ffffff" : "var(--text-primary)",
                fontWeight: activeTab === "portals" ? 700 : 500
              }}
            >
              🏛️ Official 27 EU National Portals ({portals.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("citations")}
              className="btn"
              style={{
                padding: "8px 16px",
                fontSize: "0.84rem",
                background: activeTab === "citations" ? "#2563eb" : "var(--bg-secondary)",
                color: activeTab === "citations" ? "#ffffff" : "var(--text-primary)",
                fontWeight: activeTab === "citations" ? 700 : 500
              }}
            >
              📜 Immigration & Visa Citations ({citations.length})
            </button>
          </div>

          {/* Search Filter */}
          <div style={{ position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input 
              type="text"
              className="form-input"
              placeholder={activeTab === "portals" ? "Filter portals by country or agency (e.g. Sweden, Estonia, Czechia, DAAD)..." : "Filter citations by country, title, or authority..."}
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              style={{ paddingLeft: "36px" }}
            />
          </div>

          {/* Directory List Rendering */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "30px", color: "var(--text-secondary)" }}>
              Loading official directories...
            </div>
          ) : activeTab === "portals" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {portals
                .filter(p => 
                  p.country.toLowerCase().includes(searchFilter.toLowerCase()) ||
                  p.portalName.toLowerCase().includes(searchFilter.toLowerCase()) ||
                  p.authority.toLowerCase().includes(searchFilter.toLowerCase())
                )
                .map((item, idx) => (
                  <div 
                    key={idx}
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid var(--border-warm)",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                      borderRadius: "12px",
                      padding: "16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "16px"
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <span className="badge badge-safe" style={{ fontSize: "0.72rem" }}>
                          {item.country}
                        </span>
                        <span style={{ fontSize: "0.74rem", color: "#1d4ed8", fontWeight: "700" }}>
                          Official National Study Gateway
                        </span>
                      </div>
                      <h5 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--text-primary)", marginBottom: "2px" }}>
                        {item.portalName}
                      </h5>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: 0 }}>
                        🏛️ <strong>Authority:</strong> {item.authority}
                      </p>
                    </div>

                    <a 
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                      style={{ padding: "6px 14px", fontSize: "0.8rem", flexShrink: 0 }}
                    >
                      <span>Visit Portal</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                ))}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {filteredCitations.map((item, idx) => (
                <div 
                  key={idx}
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid var(--border-warm)",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                    borderRadius: "12px",
                    padding: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "16px"
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span className="badge badge-target" style={{ fontSize: "0.7rem" }}>
                        {item.country}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        {item.category}
                      </span>
                    </div>
                    <h5 style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-primary)", marginBottom: "2px" }}>
                      {item.title}
                    </h5>
                    <p style={{ fontSize: "0.8rem", color: "#1d4ed8", fontWeight: "600", marginBottom: "4px" }}>
                      🏛️ {item.authority}
                    </p>
                    <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", margin: 0 }}>
                      <strong>Key Statutory Evidence:</strong> {item.keyEvidence}
                    </p>
                  </div>

                  <a 
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={{ padding: "6px 12px", fontSize: "0.78rem", flexShrink: 0 }}
                  >
                    <span>Visit Source</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div style={{
          padding: "14px 24px",
          borderTop: "1px solid var(--border-subtle)",
          display: "flex",
          justifyContent: "flex-end",
          background: "var(--bg-secondary)"
        }}>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: "8px 20px" }}>
            Close
          </button>
        </div>

      </div>

    </div>
  );
}
