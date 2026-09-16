import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Globe from "react-globe.gl";

// Centroids for fast, pinpoint camera fly-to for all 27 EU nations + key study abroad hubs
const COUNTRY_CENTROIDS = {
  "Germany": { lat: 51.1657, lng: 10.4515 },
  "France": { lat: 46.2276, lng: 2.2137 },
  "Netherlands": { lat: 52.1326, lng: 5.2913 },
  "Sweden": { lat: 60.1282, lng: 18.6435 },
  "Italy": { lat: 41.8719, lng: 12.5674 },
  "Spain": { lat: 40.4637, lng: -3.7492 },
  "Austria": { lat: 47.5162, lng: 14.5501 },
  "Ireland": { lat: 53.1424, lng: -7.6921 },
  "Finland": { lat: 61.9241, lng: 25.7482 },
  "Denmark": { lat: 56.2639, lng: 9.5018 },
  "Belgium": { lat: 50.5039, lng: 4.4699 },
  "Portugal": { lat: 39.3999, lng: -8.2245 },
  "Poland": { lat: 51.9194, lng: 19.1451 },
  "Czechia": { lat: 49.8175, lng: 15.4730 },
  "Czech Republic": { lat: 49.8175, lng: 15.4730 },
  "Hungary": { lat: 47.1625, lng: 19.5033 },
  "Greece": { lat: 39.0742, lng: 21.8243 },
  "Romania": { lat: 45.9432, lng: 24.9668 },
  "Bulgaria": { lat: 42.7339, lng: 25.4858 },
  "Croatia": { lat: 45.1, lng: 15.2 },
  "Cyprus": { lat: 35.1264, lng: 33.4299 },
  "Estonia": { lat: 58.5953, lng: 25.0136 },
  "Latvia": { lat: 56.8796, lng: 24.6032 },
  "Lithuania": { lat: 55.1694, lng: 23.8813 },
  "Luxembourg": { lat: 49.8153, lng: 6.1296 },
  "Malta": { lat: 35.9375, lng: 14.3754 },
  "Slovakia": { lat: 48.6690, lng: 19.6990 },
  "Slovenia": { lat: 46.1512, lng: 14.9955 },
  "USA": { lat: 37.0902, lng: -95.7129 },
  "United States": { lat: 37.0902, lng: -95.7129 },
  "United Kingdom": { lat: 55.3781, lng: -3.4360 },
  "UK": { lat: 55.3781, lng: -3.4360 },
  "Canada": { lat: 56.1304, lng: -106.3468 },
  "Australia": { lat: -25.2744, lng: 133.7751 }
};

// Normalize country names across GeoJSON and database catalogs
const normalizeCountryName = (rawName) => {
  if (!rawName) return "";
  const name = rawName.trim();
  if (name === "Czech Republic") return "Czechia";
  if (name === "The Netherlands") return "Netherlands";
  if (name === "United States of America" || name === "United States") return "USA";
  if (name === "United Kingdom of Great Britain and Northern Ireland") return "United Kingdom";
  return name;
};

export default function Interactive3DGlobeCanvas({
  selectedCountry = "",
  onSelectCountry,
  universityCounts = {},
  width = 650,
  height = 540,
  isMobile = false
}) {
  const globeEl = useRef(null);
  const [countriesData, setCountriesData] = useState([]);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [isUserHovering, setIsUserHovering] = useState(false);

  // 1. Load Local Low-Poly Decimated GeoJSON (zero CDN dependency)
  useEffect(() => {
    let isMounted = true;
    fetch("/data/ne_110m_admin_0_countries.geojson")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load local GeoJSON");
        return res.json();
      })
      .then((data) => {
        if (isMounted && data && data.features) {
          // Filter out Antarctica for cleaner spherical viewport
          const cleanFeatures = data.features.filter(
            (f) => f.properties?.NAME !== "Antarctica" && f.properties?.ADMIN !== "Antarctica"
          );
          setCountriesData(cleanFeatures);
        }
      })
      .catch((err) => {
        console.warn("Could not load local GeoJSON, falling back to CDN:", err);
        fetch("https://unpkg.com/globe.gl/example/datasets/ne_110m_admin_0_countries.geojson")
          .then((r) => r.json())
          .then((d) => {
            if (isMounted && d?.features) {
              setCountriesData(d.features.filter((f) => f.properties?.NAME !== "Antarctica"));
            }
          })
          .catch((e) => console.error("GeoJSON load failed:", e));
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Configure Smooth Y-Axis Continuous Auto-Rotation
  useEffect(() => {
    if (!globeEl.current) return;
    const controls = globeEl.current.controls();
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.55; // gentle, elegant speed
      controls.enableZoom = true;
      controls.minDistance = 180;
      controls.maxDistance = 500;
      controls.dampingFactor = 0.08;
      controls.enableDamping = true;
    }

    // Default initial POV focused gently toward European academic theater (responsive altitude for mobile)
    const initialAlt = isMobile ? 2.7 : 2.2;
    globeEl.current.pointOfView({ lat: 50.0, lng: 14.0, altitude: initialAlt }, 0);
  }, [globeEl.current, isMobile]);

  // 3. Pause Auto-Rotation on Hover; Resume when unhovered
  useEffect(() => {
    if (!globeEl.current) return;
    const controls = globeEl.current.controls();
    if (controls) {
      controls.autoRotate = !isUserHovering;
    }
  }, [isUserHovering]);

  // 4. Page Visibility API: Pause rotation and rendering loop if user leaves tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!globeEl.current) return;
      const controls = globeEl.current.controls();
      if (controls) {
        if (document.hidden) {
          controls.autoRotate = false;
        } else if (!isUserHovering) {
          controls.autoRotate = true;
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isUserHovering]);

  // 5. Camera Fly-To Effect when selectedCountry changes externally or on click
  const flyToCountry = useCallback((countryName) => {
    if (!globeEl.current || !countryName || countryName === "All") return;
    const norm = normalizeCountryName(countryName);
    const coords = COUNTRY_CENTROIDS[norm] || COUNTRY_CENTROIDS[countryName];
    if (coords) {
      globeEl.current.pointOfView(
        { lat: coords.lat, lng: coords.lng, altitude: isMobile ? 2.1 : 1.7 },
        1200 // 1.2s smooth camera flight
      );
    }
  }, [isMobile]);

  useEffect(() => {
    if (selectedCountry && selectedCountry !== "All") {
      flyToCountry(selectedCountry);
    }
  }, [selectedCountry, flyToCountry]);

  // 6. Handle Country Click: Highlight & Fly-To & Update Search State
  const handlePolygonClick = useCallback(
    (polygon) => {
      const rawName = polygon?.properties?.NAME || polygon?.properties?.ADMIN;
      const countryName = normalizeCountryName(rawName);
      if (!countryName) return;

      // Camera Fly-To
      flyToCountry(countryName);

      // Invoke parent handler to filter university grid instantly
      if (onSelectCountry) {
        onSelectCountry(countryName);
      }
    },
    [flyToCountry, onSelectCountry]
  );

  // 7. Styling Rules matching Woolmers palette
  const getPolygonColor = useCallback(
    (feat) => {
      const name = normalizeCountryName(feat?.properties?.NAME || feat?.properties?.ADMIN);
      const isSelected = selectedCountry && normalizeCountryName(selectedCountry) === name;
      const isHovered = hoveredCountry && normalizeCountryName(hoveredCountry?.properties?.NAME) === name;

      // Selected: Rich Woolmers Deep Gold / Forest Green accent
      if (isSelected) {
        return "#B38E5D"; // Woolmers antique gold highlight
      }
      // Hovered: Darker charcoal shade for tactile feel
      if (isHovered) {
        return "#64748B";
      }
      // Public universities active in our catalog: soft warm ivory grey
      const uniCount = universityCounts[name] || 0;
      if (uniCount > 0) {
        return "#D5DDD3"; // soft sage/ivory tone indicating verified destination
      }
      // Other global countries: soft muted cream-grey
      return "#E2E8F0";
    },
    [selectedCountry, hoveredCountry, universityCounts]
  );

  const getPolygonAltitude = useCallback(
    (feat) => {
      const name = normalizeCountryName(feat?.properties?.NAME || feat?.properties?.ADMIN);
      const isSelected = selectedCountry && normalizeCountryName(selectedCountry) === name;
      const isHovered = hoveredCountry && normalizeCountryName(hoveredCountry?.properties?.NAME) === name;

      if (isSelected) return 0.04;
      if (isHovered) return 0.025;
      return 0.006;
    },
    [selectedCountry, hoveredCountry]
  );

  // Elegant HTML Tooltip for Country Hover
  const getPolygonLabel = useCallback(
    (feat) => {
      const name = normalizeCountryName(feat?.properties?.NAME || feat?.properties?.ADMIN);
      const count = universityCounts[name] || 0;
      const isSelected = selectedCountry && normalizeCountryName(selectedCountry) === name;

      return `
        <div style="
          background: rgba(26, 28, 25, 0.94);
          backdrop-filter: blur(8px);
          padding: 8px 14px;
          border-radius: 8px;
          border: 1px solid ${isSelected ? "#B38E5D" : "rgba(255, 255, 255, 0.15)"};
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          pointer-events: none;
        ">
          <div style="color: #FAF8F5; font-weight: 800; font-size: 0.92rem; display: flex; align-items: center; gap: 8px;">
            <span>${name}</span>
            ${isSelected ? '<span style="color: #B38E5D; font-size: 0.72rem; text-transform: uppercase;">[Active]</span>' : ""}
          </div>
          <div style="color: #B38E5D; font-size: 0.78rem; font-weight: 600; margin-top: 3px;">
            ${count > 0 ? `🏛️ ${count} Public Universities (Click to Filter)` : "Explore International Programs"}
          </div>
        </div>
      `;
    },
    [selectedCountry, universityCounts]
  );

  return (
    <div
      className="touch-none globe-canvas-wrapper gpu-accelerated"
      onMouseEnter={() => setIsUserHovering(true)}
      onMouseLeave={() => {
        setIsUserHovering(false);
        setHoveredCountry(null);
      }}
      style={{
        width: "100%",
        maxWidth: `${width}px`,
        height: `${height}px`,
        overflow: "hidden",
        borderRadius: "14px",
        position: "relative",
        cursor: "grab",
        userSelect: "none",
        margin: "0 auto",
        touchAction: "none",
        transform: "translate3d(0, 0, 0)",
        WebkitTransform: "translate3d(0, 0, 0)",
        willChange: "transform"
      }}
    >
      <Globe
        ref={globeEl}
        width={width}
        height={height}
        backgroundColor="rgba(250, 248, 245, 0)" // 100% transparent ocean surface
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        showAtmosphere={true}
        atmosphereColor="#B38E5D"
        atmosphereAltitude={0.14}
        polygonsData={countriesData}
        polygonGeoJsonGeometry={(d) => d.geometry}
        polygonCapColor={getPolygonColor}
        polygonSideColor={() => "rgba(179, 142, 93, 0.18)"}
        polygonStrokeColor={() => "rgba(255, 255, 255, 0.65)"}
        polygonAltitude={getPolygonAltitude}
        polygonLabel={getPolygonLabel}
        onPolygonHover={(feat) => {
          setHoveredCountry(feat);
          setIsUserHovering(Boolean(feat));
        }}
        onPolygonClick={handlePolygonClick}
        polygonsTransitionDuration={300}
      />

      {/* Floating Interactive Zoom & Re-Center Controls Overlay */}
      <div
        className="globe-ui-interactive"
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          zIndex: 15,
          pointerEvents: "auto"
        }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (!globeEl.current) return;
            const pov = globeEl.current.pointOfView();
            globeEl.current.pointOfView({ altitude: Math.max(pov.altitude - 0.45, 1.2) }, 300);
          }}
          onTouchStart={(e) => e.stopPropagation()}
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            border: "1px solid var(--border-warm)",
            background: "rgba(255, 255, 255, 0.95)",
            color: "var(--text-primary)",
            fontWeight: "800",
            fontSize: "1.1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            touchAction: "manipulation",
            userSelect: "none"
          }}
          title="Zoom In"
          aria-label="Zoom In"
        >
          +
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (!globeEl.current) return;
            const pov = globeEl.current.pointOfView();
            globeEl.current.pointOfView({ altitude: Math.min(pov.altitude + 0.45, 3.8) }, 300);
          }}
          onTouchStart={(e) => e.stopPropagation()}
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            border: "1px solid var(--border-warm)",
            background: "rgba(255, 255, 255, 0.95)",
            color: "var(--text-primary)",
            fontWeight: "800",
            fontSize: "1.1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            touchAction: "manipulation",
            userSelect: "none"
          }}
          title="Zoom Out"
          aria-label="Zoom Out"
        >
          -
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (!globeEl.current) return;
            globeEl.current.pointOfView({ lat: 50.0, lng: 14.0, altitude: isMobile ? 2.7 : 2.2 }, 600);
          }}
          onTouchStart={(e) => e.stopPropagation()}
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            border: "1px solid var(--border-warm)",
            background: "rgba(255, 255, 255, 0.95)",
            color: "var(--accent-gold, #B38E5D)",
            fontWeight: "700",
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            touchAction: "manipulation",
            userSelect: "none"
          }}
          title="Center on Europe"
          aria-label="Center on Europe"
        >
          🎯
        </button>
      </div>
    </div>
  );
}
