import React, { useState, useEffect, useMemo } from "react";
import { 
  Building2, 
  MapPin, 
  Home, 
  Sliders, 
  Check, 
  ExternalLink, 
  Compass, 
  Dumbbell, 
  BookOpen, 
  ShoppingCart, 
  Train, 
  Navigation,
  Clock,
  ShieldCheck,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  Layers,
  ChevronDown,
  Info,
  DollarSign,
  AlertCircle
} from "lucide-react";
import StudentLifeMap from "./StudentLifeMap";
import { fetchUniversityHousing, fetchUniversities } from "../services/api";

const PRESET_UNIVERSITIES = [
  { id: "tum-germany", name: "Technical University of Munich (TUM)", country: "Germany", city: "Munich" },
  { id: "tu-berlin-germany", name: "Technical University of Berlin (TU Berlin)", country: "Germany", city: "Berlin" },
  { id: "rwth-aachen-germany", name: "RWTH Aachen University", country: "Germany", city: "Aachen" },
  { id: "sorbonne-france", name: "Sorbonne University", country: "France", city: "Paris" },
  { id: "tu-delft-netherlands", name: "TU Delft", country: "Netherlands", city: "Delft" },
  { id: "kth-sweden", name: "KTH Royal Institute of Technology", country: "Sweden", city: "Stockholm" },
  { id: "oxford-uk", name: "University of Oxford", country: "United Kingdom", city: "Oxford" },
  { id: "uni-vienna-austria", name: "University of Vienna", country: "Austria", city: "Vienna" },
  { id: "polimi-italy", name: "Politecnico di Milano", country: "Italy", city: "Milan" }
];

export default function StudentLifeMapView({
  initialUniversityId = "tum-germany",
  onClose = null
}) {
  const [selectedUniversityId, setSelectedUniversityId] = useState(initialUniversityId);
  const [allUniversities, setAllUniversities] = useState(PRESET_UNIVERSITIES);
  const [ecosystemData, setEcosystemData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Filters State
  const [housingTypes, setHousingTypes] = useState({
    Dorm: true,
    Shared: true,
    Studio: true
  });
  const [maxBudget, setMaxBudget] = useState(1200); // 1200 EUR default
  const [commuteRadiusMode, setCommuteRadiusMode] = useState("all"); // all, walk15, cycle15, transit30
  const [officialDormsOnly, setOfficialDormsOnly] = useState(false);
  const [amenityFilters, setAmenityFilters] = useState({
    University: true,
    Library: true,
    Gym: true,
    Grocery: true,
    Transit: true
  });

  // Selected Property for Details Card Inspector
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [savedFavorites, setSavedFavorites] = useState([]);

  // Load universities list
  useEffect(() => {
    async function loadUnis() {
      try {
        const res = await fetchUniversities();
        if (res.data && res.data.length > 0) {
          setAllUniversities(res.data);
        }
      } catch (err) {
        // Fall back to preset universities
      }
    }
    loadUnis();
  }, []);

  // Fetch campus ecosystem for selected university
  useEffect(() => {
    async function loadCampusEcosystem() {
      setIsLoading(true);
      setErrorMessage("");
      try {
        const activeTypes = Object.entries(housingTypes)
          .filter(([_, active]) => active)
          .map(([type]) => type);

        const activeAmenities = Object.entries(amenityFilters)
          .filter(([_, active]) => active)
          .map(([cat]) => cat);

        const res = await fetchUniversityHousing(selectedUniversityId, {
          housingTypes: activeTypes,
          maxBudget,
          commuteRadiusMode,
          officialDormsOnly,
          amenityCategories: activeAmenities
        });

        if (res.success && res.data) {
          setEcosystemData(res.data);
          // Default selection to first housing item if none selected or if previously selected is no longer visible
          if (res.data.housing && res.data.housing.length > 0) {
            setSelectedProperty(prev => {
              const stillExists = res.data.housing.find(h => h.id === prev?.id);
              return stillExists || res.data.housing[0];
            });
          } else {
            setSelectedProperty(null);
          }
        }
      } catch (err) {
        console.error("Failed to load campus ecosystem:", err);
        setErrorMessage("Failed to load student housing and campus map data.");
      } finally {
        setIsLoading(false);
      }
    }

    loadCampusEcosystem();
  }, [
    selectedUniversityId, 
    housingTypes, 
    maxBudget, 
    commuteRadiusMode, 
    officialDormsOnly, 
    amenityFilters
  ]);

  const toggleFavorite = (propertyId) => {
    setSavedFavorites(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId) 
        : [...prev, propertyId]
    );
  };

  const currentUni = useMemo(() => {
    return allUniversities.find(u => u.id === selectedUniversityId) || {
      name: ecosystemData?.university?.name || "Selected University",
      city: ecosystemData?.university?.city || "",
      country: ecosystemData?.university?.country || ""
    };
  }, [allUniversities, selectedUniversityId, ecosystemData]);

  return (
    <div style={{ width: "100%", maxWidth: "1400px", margin: "0 auto", padding: "0 16px" }}>
      
      {/* Header Banner */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "flex-start", 
        flexWrap: "wrap", 
        gap: "16px",
        marginBottom: "24px",
        background: "rgba(15, 23, 42, 0.65)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        padding: "20px 24px",
        borderRadius: "16px",
        backdropFilter: "blur(12px)"
      }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(56, 189, 248, 0.12)", border: "1px solid rgba(56, 189, 248, 0.25)", padding: "4px 12px", borderRadius: "999px", marginBottom: "8px" }}>
            <Compass size={14} color="#38bdf8" />
            <span style={{ fontSize: "0.76rem", color: "#38bdf8", fontWeight: "700", textTransform: "uppercase" }}>
              Campus Ecosystem & Verified Housing Explorer
            </span>
          </div>

          <h2 style={{ fontSize: "1.75rem", fontWeight: "800", color: "var(--text-primary)", letterSpacing: "-0.5px", margin: 0 }}>
            {currentUni.name}
          </h2>

          <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginTop: "4px" }}>
            📍 {currentUni.city ? `${currentUni.city}, ` : ""}{currentUni.country} • Explore verified student residences, WG flatshares, university libraries, gyms, and supermarkets.
          </p>
        </div>

        {/* University Switcher Dropdown */}
        <div style={{ minWidth: "260px" }}>
          <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "6px", fontWeight: "600" }}>
            Select University Campus:
          </label>
          <div style={{ position: "relative" }}>
            <select
              value={selectedUniversityId}
              onChange={(e) => setSelectedUniversityId(e.target.value)}
              className="input-field"
              style={{
                width: "100%",
                padding: "8px 32px 8px 12px",
                fontSize: "0.85rem",
                borderRadius: "10px",
                background: "var(--bg-surface, #ffffff)",
                border: "1px solid var(--border-subtle, #cbd5e1)",
                color: "var(--text-primary)",
                appearance: "none",
                cursor: "pointer"
              }}
            >
              {allUniversities.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.city || u.country})
                </option>
              ))}
            </select>
            <ChevronDown size={16} color="#94a3b8" style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Map Canvas + Details Inspector Card */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "310px 1fr 340px", 
        gap: "20px", 
        alignItems: "start" 
      }}>

        {/* ------------------------------------------------------------------ */}
        {/* 1. FILTER SIDEBAR (Left Column) */}
        {/* ------------------------------------------------------------------ */}
        <div style={{
          background: "var(--surface-card, rgba(15, 23, 42, 0.75))",
          border: "1px solid var(--border-subtle, rgba(255, 255, 255, 0.1))",
          borderRadius: "14px",
          padding: "18px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          backdropFilter: "blur(8px)"
        }}>
          
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "700", fontSize: "0.88rem", color: "#ffffff" }}>
              <Sliders size={16} color="#38bdf8" />
              <span>Campus Map Filters</span>
            </div>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
              {ecosystemData?.summaryStats?.filteredHousingCount || 0} visible
            </span>
          </div>

          {/* Commute Radius Tool (Walking / Cycling 15-min filter) */}
          <div>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.78rem", fontWeight: "700", color: "#38bdf8", marginBottom: "8px", textTransform: "uppercase" }}>
              <Navigation size={13} />
              <span>Commute Radius Tool</span>
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
              <button
                type="button"
                onClick={() => setCommuteRadiusMode("all")}
                style={{
                  padding: "7px 8px",
                  borderRadius: "8px",
                  fontSize: "0.74rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  border: commuteRadiusMode === "all" ? "1px solid #38bdf8" : "1px solid rgba(255,255,255,0.1)",
                  background: commuteRadiusMode === "all" ? "rgba(56, 189, 248, 0.2)" : "rgba(255,255,255,0.03)",
                  color: commuteRadiusMode === "all" ? "#38bdf8" : "var(--text-secondary)"
                }}
              >
                🌐 All Distances
              </button>

              <button
                type="button"
                onClick={() => setCommuteRadiusMode("walk15")}
                style={{
                  padding: "7px 8px",
                  borderRadius: "8px",
                  fontSize: "0.74rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  border: commuteRadiusMode === "walk15" ? "1px solid #10b981" : "1px solid rgba(255,255,255,0.1)",
                  background: commuteRadiusMode === "walk15" ? "rgba(16, 185, 129, 0.2)" : "rgba(255,255,255,0.03)",
                  color: commuteRadiusMode === "walk15" ? "#34d399" : "var(--text-secondary)"
                }}
                title="Only show residences within 15-minute walking distance (≤ 1.2 km)"
              >
                🚶 15-min Walk (1.2 km)
              </button>

              <button
                type="button"
                onClick={() => setCommuteRadiusMode("cycle15")}
                style={{
                  padding: "7px 8px",
                  borderRadius: "8px",
                  fontSize: "0.74rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  border: commuteRadiusMode === "cycle15" ? "1px solid #0284c7" : "1px solid rgba(255,255,255,0.1)",
                  background: commuteRadiusMode === "cycle15" ? "rgba(2, 132, 199, 0.2)" : "rgba(255,255,255,0.03)",
                  color: commuteRadiusMode === "cycle15" ? "#38bdf8" : "var(--text-secondary)"
                }}
                title="Only show residences within 15-minute cycling distance (≤ 3.75 km)"
              >
                🚲 15-min Cycle (3.7 km)
              </button>

              <button
                type="button"
                onClick={() => setCommuteRadiusMode("transit30")}
                style={{
                  padding: "7px 8px",
                  borderRadius: "8px",
                  fontSize: "0.74rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  border: commuteRadiusMode === "transit30" ? "1px solid #8b5cf6" : "1px solid rgba(255,255,255,0.1)",
                  background: commuteRadiusMode === "transit30" ? "rgba(139, 92, 246, 0.2)" : "rgba(255,255,255,0.03)",
                  color: commuteRadiusMode === "transit30" ? "#c084fc" : "var(--text-secondary)"
                }}
                title="Only show residences within 30-minute transit distance (≤ 10 km)"
              >
                🚆 30-min Metro (10 km)
              </button>
            </div>
          </div>

          {/* Budget Range Slider */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <label style={{ fontSize: "0.78rem", fontWeight: "700", color: "#ffffff", textTransform: "uppercase" }}>
                Max Monthly Rent
              </label>
              <span style={{ fontSize: "0.85rem", fontWeight: "800", color: "#34d399" }}>
                €{maxBudget} / mo
              </span>
            </div>
            <input 
              type="range"
              min="250"
              max="1500"
              step="25"
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#10b981", cursor: "pointer" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "3px" }}>
              <span>€250 (Subsidized)</span>
              <span>€850</span>
              <span>€1,500+</span>
            </div>
          </div>

          {/* Housing Type Checkboxes */}
          <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "700", color: "#ffffff", marginBottom: "8px", textTransform: "uppercase" }}>
              Residence Types
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", color: "#f8fafc", cursor: "pointer" }}>
                <input 
                  type="checkbox"
                  checked={housingTypes.Dorm}
                  onChange={(e) => setHousingTypes(prev => ({ ...prev, Dorm: e.target.checked }))}
                  style={{ accentColor: "#10b981", width: "16px", height: "16px" }}
                />
                <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "50%", background: "#10b981" }} />
                <span><strong>Official Dorms</strong> (Studentenwerk / CROUS)</span>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", color: "#f8fafc", cursor: "pointer" }}>
                <input 
                  type="checkbox"
                  checked={housingTypes.Shared}
                  onChange={(e) => setHousingTypes(prev => ({ ...prev, Shared: e.target.checked }))}
                  style={{ accentColor: "#0284c7", width: "16px", height: "16px" }}
                />
                <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "50%", background: "#0284c7" }} />
                <span><strong>Shared Apartments</strong> (WG / Flatshares)</span>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", color: "#f8fafc", cursor: "pointer" }}>
                <input 
                  type="checkbox"
                  checked={housingTypes.Studio}
                  onChange={(e) => setHousingTypes(prev => ({ ...prev, Studio: e.target.checked }))}
                  style={{ accentColor: "#38bdf8", width: "16px", height: "16px" }}
                />
                <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "50%", background: "#38bdf8" }} />
                <span><strong>Private Studios</strong> (All-Inclusive)</span>
              </label>

            </div>

            {/* Official Dorms Only Quick Toggle */}
            <div style={{ marginTop: "10px", paddingTop: "8px", borderTop: "1px dashed rgba(255,255,255,0.08)" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.74rem", color: "#6ee7b7", cursor: "pointer" }}>
                <input 
                  type="checkbox"
                  checked={officialDormsOnly}
                  onChange={(e) => setOfficialDormsOnly(e.target.checked)}
                  style={{ accentColor: "#10b981" }}
                />
                <span>Show Subsidized Public Dorms Only</span>
              </label>
            </div>
          </div>

          {/* Local Amenities Filters */}
          <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "700", color: "#ffffff", marginBottom: "8px", textTransform: "uppercase" }}>
              Campus Infrastructure & Amenities
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
              
              <button
                type="button"
                onClick={() => setAmenityFilters(prev => ({ ...prev, Library: !prev.Library }))}
                style={{
                  padding: "5px 8px",
                  borderRadius: "6px",
                  fontSize: "0.72rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  border: amenityFilters.Library ? "1px solid #6366f1" : "1px solid rgba(255,255,255,0.1)",
                  background: amenityFilters.Library ? "rgba(99, 102, 241, 0.2)" : "rgba(255,255,255,0.02)",
                  color: amenityFilters.Library ? "#a5b4fc" : "var(--text-muted)"
                }}
              >
                <span>📚 Libraries</span>
              </button>

              <button
                type="button"
                onClick={() => setAmenityFilters(prev => ({ ...prev, Gym: !prev.Gym }))}
                style={{
                  padding: "5px 8px",
                  borderRadius: "6px",
                  fontSize: "0.72rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  border: amenityFilters.Gym ? "1px solid #f59e0b" : "1px solid rgba(255,255,255,0.1)",
                  background: amenityFilters.Gym ? "rgba(245, 158, 11, 0.2)" : "rgba(255,255,255,0.02)",
                  color: amenityFilters.Gym ? "#fcd34d" : "var(--text-muted)"
                }}
              >
                <span>🏋️ Gyms/Sports</span>
              </button>

              <button
                type="button"
                onClick={() => setAmenityFilters(prev => ({ ...prev, Grocery: !prev.Grocery }))}
                style={{
                  padding: "5px 8px",
                  borderRadius: "6px",
                  fontSize: "0.72rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  border: amenityFilters.Grocery ? "1px solid #14b8a6" : "1px solid rgba(255,255,255,0.1)",
                  background: amenityFilters.Grocery ? "rgba(20, 184, 166, 0.2)" : "rgba(255,255,255,0.02)",
                  color: amenityFilters.Grocery ? "#5eead4" : "var(--text-muted)"
                }}
              >
                <span>🛒 Supermarkets</span>
              </button>

              <button
                type="button"
                onClick={() => setAmenityFilters(prev => ({ ...prev, Transit: !prev.Transit }))}
                style={{
                  padding: "5px 8px",
                  borderRadius: "6px",
                  fontSize: "0.72rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  border: amenityFilters.Transit ? "1px solid #06b6d4" : "1px solid rgba(255,255,255,0.1)",
                  background: amenityFilters.Transit ? "rgba(6, 182, 212, 0.2)" : "rgba(255,255,255,0.02)",
                  color: amenityFilters.Transit ? "#67e8f9" : "var(--text-muted)"
                }}
              >
                <span>🚆 Transit / Metro</span>
              </button>

            </div>
          </div>

          {/* Quick Insights Card */}
          {ecosystemData?.summaryStats && (
            <div style={{
              background: "rgba(30, 41, 59, 0.5)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "10px",
              padding: "12px",
              fontSize: "0.75rem"
            }}>
              <div style={{ fontWeight: "700", color: "#ffffff", marginBottom: "8px", display: "flex", alignItems: "center", gap: "5px" }}>
                <Sparkles size={13} color="#f59e0b" />
                <span>Campus Housing Insights</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ color: "var(--text-muted)" }}>Lowest Subsidized Dorm:</span>
                <strong style={{ color: "#34d399" }}>€{ecosystemData.summaryStats.minDormRentEUR}/mo</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ color: "var(--text-muted)" }}>Average Student Rent:</span>
                <strong style={{ color: "#ffffff" }}>€{ecosystemData.summaryStats.averageRentEUR}/mo</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Closest Residence:</span>
                <span style={{ color: "#93c5fd" }}>{ecosystemData.summaryStats.closestHousingDistanceKm} km</span>
              </div>
            </div>
          )}

          {/* Official Housing Network Notice */}
          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", lineHeight: "1.3" }}>
            🛡️ Official dorms in Europe (*Studentenwerk*, *CROUS*, *DUWO*) require no agent fees and guarantee legal address registration (*Anmeldung*).
          </div>

        </div>

        {/* ------------------------------------------------------------------ */}
        {/* 2. MAP CANVAS (Center Column) */}
        {/* ------------------------------------------------------------------ */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          
          {/* Map View Container */}
          <StudentLifeMap 
            university={ecosystemData?.university || currentUni}
            campusLocation={ecosystemData?.campusLocation}
            housingList={ecosystemData?.housing || []}
            amenitiesList={ecosystemData?.amenities || []}
            commuteRadiusMode={commuteRadiusMode}
            selectedPropertyId={selectedProperty?.id}
            onSelectProperty={(property) => setSelectedProperty(property)}
            height="560px"
          />

          {/* Horizontal Quick Picker Carousel of Residences */}
          <div style={{
            display: "flex",
            gap: "10px",
            overflowX: "auto",
            paddingBottom: "8px",
            scrollbarWidth: "thin"
          }}>
            {(ecosystemData?.housing || []).map((h) => {
              const isSelected = selectedProperty?.id === h.id;
              const isFav = savedFavorites.includes(h.id);

              return (
                <div
                  key={h.id}
                  onClick={() => setSelectedProperty(h)}
                  style={{
                    flex: "0 0 220px",
                    background: isSelected ? "rgba(2, 132, 199, 0.18)" : "rgba(15, 23, 42, 0.7)",
                    border: isSelected ? "1.5px solid #38bdf8" : "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "10px",
                    padding: "10px",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <span style={{ 
                      fontSize: "0.68rem", 
                      fontWeight: "700", 
                      padding: "1px 6px", 
                      borderRadius: "4px",
                      background: h.Is_Official_Dorm ? "rgba(16, 185, 129, 0.2)" : "rgba(2, 132, 199, 0.2)",
                      color: h.Is_Official_Dorm ? "#34d399" : "#38bdf8"
                    }}>
                      {h.Is_Official_Dorm ? "Official Dorm" : h.Housing_Type}
                    </span>
                    <span style={{ fontSize: "0.82rem", fontWeight: "800", color: "#ffffff" }}>
                      €{h.Rent_Cost}
                    </span>
                  </div>

                  <div style={{ fontSize: "0.78rem", fontWeight: "700", color: "#f8fafc", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {h.Housing_Name}
                  </div>

                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "4px", display: "flex", gap: "8px" }}>
                    <span>📍 {h.Distance_Km} km</span>
                    <span>🚶 ~{h.Walk_Time_Min}m</span>
                    <span>🚲 ~{h.Cycle_Time_Min}m</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* ------------------------------------------------------------------ */}
        {/* 3. DETAILS CARD / INSPECTOR (Right Column) */}
        {/* ------------------------------------------------------------------ */}
        <div style={{
          background: "var(--surface-card, rgba(15, 23, 42, 0.75))",
          border: "1px solid var(--border-subtle, rgba(255, 255, 255, 0.1))",
          borderRadius: "14px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          backdropFilter: "blur(8px)"
        }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "10px" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#38bdf8", textTransform: "uppercase" }}>
              Residence Details Inspector
            </span>
            {selectedProperty && (
              <button
                type="button"
                onClick={() => toggleFavorite(selectedProperty.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: savedFavorites.includes(selectedProperty.id) ? "#f59e0b" : "var(--text-muted)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "0.74rem"
                }}
              >
                {savedFavorites.includes(selectedProperty.id) ? (
                  <>
                    <BookmarkCheck size={16} />
                    <span>Saved</span>
                  </>
                ) : (
                  <>
                    <Bookmark size={16} />
                    <span>Save</span>
                  </>
                )}
              </button>
            )}
          </div>

          {selectedProperty ? (
            <>
              {/* Official Status Badge & Title */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                  <span style={{
                    fontSize: "0.68rem",
                    fontWeight: "800",
                    padding: "2px 8px",
                    borderRadius: "999px",
                    background: selectedProperty.Is_Official_Dorm ? "rgba(16, 185, 129, 0.2)" : "rgba(2, 132, 199, 0.2)",
                    color: selectedProperty.Is_Official_Dorm ? "#34d399" : "#38bdf8",
                    border: selectedProperty.Is_Official_Dorm ? "1px solid rgba(16, 185, 129, 0.35)" : "1px solid rgba(2, 132, 199, 0.35)"
                  }}>
                    {selectedProperty.Is_Official_Dorm ? "✓ Official Subsidized Dorm" : "Verified Private Accommodation"}
                  </span>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                    {selectedProperty.Housing_Type}
                  </span>
                </div>

                <h3 style={{ fontSize: "1.15rem", fontWeight: "800", color: "#ffffff", lineHeight: "1.25", margin: 0 }}>
                  {selectedProperty.Housing_Name}
                </h3>

                <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "6px", lineHeight: "1.3" }}>
                  {selectedProperty.Room_Details}
                </p>
              </div>

              {/* Rent Price Callout */}
              <div style={{
                background: "rgba(16, 185, 129, 0.08)",
                border: "1px solid rgba(16, 185, 129, 0.25)",
                borderRadius: "10px",
                padding: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", display: "block" }}>
                    Monthly All-Inclusive Rent
                  </span>
                  <div style={{ fontSize: "1.6rem", fontWeight: "900", color: "#34d399", lineHeight: "1.1" }}>
                    €{selectedProperty.Rent_Cost}
                  </div>
                </div>
                <div style={{ textAlign: "right", fontSize: "0.72rem", color: "#94a3b8" }}>
                  <div>Warmmiete (Heat & Water incl.)</div>
                  <div style={{ color: "#34d399", fontWeight: "600" }}>Electricity & WiFi Included</div>
                </div>
              </div>

              {/* Distance & Commute Specs */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
                background: "rgba(255, 255, 255, 0.03)",
                padding: "10px",
                borderRadius: "8px",
                fontSize: "0.76rem"
              }}>
                <div>
                  <span style={{ color: "var(--text-muted)", display: "block" }}>Distance to Campus:</span>
                  <strong style={{ color: "#ffffff" }}>{selectedProperty.Distance_Km} km</strong>
                </div>
                <div>
                  <span style={{ color: "var(--text-muted)", display: "block" }}>Walking Time:</span>
                  <strong style={{ color: "#34d399" }}>~{selectedProperty.Walk_Time_Min} mins</strong>
                </div>
                <div>
                  <span style={{ color: "var(--text-muted)", display: "block" }}>Cycling Time:</span>
                  <strong style={{ color: "#38bdf8" }}>~{selectedProperty.Cycle_Time_Min} mins</strong>
                </div>
                <div>
                  <span style={{ color: "var(--text-muted)", display: "block" }}>Metro / Transit:</span>
                  <strong style={{ color: "#c084fc" }}>~{selectedProperty.Transit_Time_Min || 10} mins</strong>
                </div>
              </div>

              {/* Housing Network & Organization */}
              <div style={{ fontSize: "0.75rem", borderTop: "1px dashed rgba(255,255,255,0.08)", paddingTop: "10px" }}>
                <span style={{ color: "var(--text-muted)", display: "block", marginBottom: "2px" }}>
                  Official Allocation Network:
                </span>
                <span style={{ color: "#f8fafc", fontWeight: "600" }}>
                  🏛️ {selectedProperty.Housing_Provider}
                </span>
              </div>

              {/* Amenity Highlights Badges */}
              {selectedProperty.Amenities && selectedProperty.Amenities.length > 0 && (
                <div>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: "6px", fontWeight: "700" }}>
                    Included Amenities:
                  </span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                    {selectedProperty.Amenities.map((amenity, idx) => (
                      <span 
                        key={idx}
                        style={{
                          fontSize: "0.68rem",
                          background: "rgba(255, 255, 255, 0.06)",
                          border: "1px solid rgba(255, 255, 255, 0.12)",
                          color: "#cbd5e1",
                          padding: "2px 7px",
                          borderRadius: "6px"
                        }}
                      >
                        ✓ {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Application Actions */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "6px" }}>
                <a
                  href={selectedProperty.Source_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    textDecoration: "none",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    fontWeight: "700",
                    fontSize: "0.82rem"
                  }}
                >
                  <span>Apply on Official Housing Portal</span>
                  <ExternalLink size={14} />
                </a>

                <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", textAlign: "center" }}>
                  Direct external link to official {selectedProperty.Housing_Provider} residence application system.
                </div>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "40px 10px", color: "var(--text-muted)" }}>
              <Home size={32} style={{ margin: "0 auto 10px auto", opacity: 0.5 }} />
              <p style={{ fontSize: "0.82rem" }}>
                Select any housing marker on the map to view property specifications, monthly rent, and direct application links.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
