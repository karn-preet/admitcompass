import React, { useEffect, useRef, useState, useMemo } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { 
  GraduationCap, 
  Home, 
  Dumbbell, 
  BookOpen, 
  ShoppingCart, 
  Train, 
  ExternalLink, 
  Navigation,
  Clock,
  Layers,
  MapPin,
  CheckCircle2,
  Sparkles
} from "lucide-react";

/**
 * Custom SVG Marker generator for Leaflet DivIcon
 */
function createCustomMarkerIcon({ type, label, price, isOfficial, isSelected }) {
  let bgColor = "#6366f1"; // Indigo fallback
  let iconSvg = "";
  let badgeText = price ? `€${price}` : label || "";

  if (type === "University") {
    bgColor = "#8b5cf6"; // Purple
    iconSvg = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21.42 10.922a1 1 0 0 0-.019-.838L12.83 2.18a2 2 0 0 0-1.66 0L2.6 10.08a1 1 0 0 0 0 1.832l8.57 7.908a2 2 0 0 0 1.66 0l8.57-7.908a1 1 0 0 0 .02-.99z"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    `;
    badgeText = "🎓 Campus";
  } else if (type === "Dorm" || isOfficial) {
    bgColor = "#10b981"; // Emerald green for official dorms
    iconSvg = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"/>
      </svg>
    `;
  } else if (type === "Housing" || type === "Shared" || type === "Studio") {
    bgColor = "#0284c7"; // Sky blue for private rentals/WG
    iconSvg = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    `;
  } else if (type === "Gym") {
    bgColor = "#f59e0b"; // Amber for gym/sports
    iconSvg = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m6.5 6.5 11 11M21 21l-1-1M3 3l1 1M18 22l4-4M2 6l4-4M3 10l7-7M14 21l7-7"/>
      </svg>
    `;
    badgeText = "🏋️ Gym";
  } else if (type === "Library") {
    bgColor = "#6366f1"; // Indigo for library
    iconSvg = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
        <path d="M6 6h10M6 10h10"/>
      </svg>
    `;
    badgeText = "📚 Library";
  } else if (type === "Grocery") {
    bgColor = "#14b8a6"; // Teal for grocery
    iconSvg = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
      </svg>
    `;
    badgeText = "🛒 Supermarket";
  } else if (type === "Transit") {
    bgColor = "#06b6d4"; // Cyan for transit
    iconSvg = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <rect width="16" height="16" x="4" y="3" rx="2"/><path d="M4 11h16M12 3v8M8 19l-2 3M16 19l2 3M9 15h.01M15 15h.01"/>
      </svg>
    `;
    badgeText = "🚆 Metro / Station";
  }

  const border = isSelected ? "3px solid #ffffff" : "2px solid rgba(255, 255, 255, 0.85)";
  const shadow = isSelected 
    ? "0 0 0 4px rgba(56, 189, 248, 0.5), 0 8px 16px rgba(0,0,0,0.5)" 
    : "0 4px 10px rgba(0,0,0,0.35)";
  const scale = isSelected ? "scale(1.15)" : "scale(1)";

  const html = `
    <div style="
      display: flex;
      align-items: center;
      gap: 5px;
      transform: ${scale};
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      cursor: pointer;
    ">
      <div style="
        background: ${bgColor};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: ${border};
        box-shadow: ${shadow};
      ">
        ${iconSvg}
      </div>
      ${badgeText ? `
        <div style="
          background: rgba(15, 23, 42, 0.92);
          backdrop-filter: blur(8px);
          color: #ffffff;
          font-weight: 700;
          font-size: 11px;
          padding: 3px 8px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.25);
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          white-space: nowrap;
          pointer-events: none;
        ">
          ${badgeText}
        </div>
      ` : ""}
    </div>
  `;

  return L.divIcon({
    className: "custom-map-div-icon",
    html,
    iconSize: [40, 40],
    iconAnchor: [16, 16],
    popupAnchor: [0, -20]
  });
}

export default function StudentLifeMap({
  university,
  campusLocation,
  housingList = [],
  amenitiesList = [],
  commuteRadiusMode = "all", // "all", "walk15", "cycle15", "transit30"
  selectedPropertyId = null,
  onSelectProperty,
  height = "520px"
}) {
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const radiusCircleRef = useRef(null);
  const markersLayerGroupRef = useRef(null);
  const [mapInitialized, setMapInitialized] = useState(false);

  const centerLat = campusLocation?.lat || 48.1497;
  const centerLng = campusLocation?.lng || 11.5678;

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Avoid duplicate initialization
    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
    }

    try {
      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom: 14,
        zoomControl: true,
        scrollWheelZoom: true
      });

      // CartoDB Voyager tiles (Crisp, clean, high-contrast aesthetics)
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19
      }).addTo(map);

      markersLayerGroupRef.current = L.layerGroup().addTo(map);
      leafletMapRef.current = map;
      setMapInitialized(true);

      // Invalidate size after layout renders
      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    } catch (err) {
      console.error("Leaflet map initialization error:", err);
    }

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [centerLat, centerLng]);

  // Update Markers & Commute Circle whenever data or radius changes
  useEffect(() => {
    const map = leafletMapRef.current;
    const markersGroup = markersLayerGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    // 1. Draw Campus Main Location Marker
    const campusIcon = createCustomMarkerIcon({
      type: "University",
      label: university?.name || "Main Campus",
      isSelected: !selectedPropertyId
    });

    const campusMarker = L.marker([centerLat, centerLng], { icon: campusIcon });
    campusMarker.bindPopup(`
      <div style="font-family: var(--font-sans); padding: 4px; min-width: 200px;">
        <div style="font-size: 11px; color: #8b5cf6; font-weight: 700; text-transform: uppercase;">
          🎓 Main University Campus
        </div>
        <div style="font-size: 14px; font-weight: 800; color: #0f172a; margin: 3px 0;">
          ${university?.name || "University"}
        </div>
        <div style="font-size: 12px; color: #64748b;">
          ${campusLocation?.address || `${university?.city}, ${university?.country}`}
        </div>
      </div>
    `);
    markersGroup.addLayer(campusMarker);

    // 2. Draw Commute Radius Circle if active
    if (radiusCircleRef.current) {
      radiusCircleRef.current.remove();
      radiusCircleRef.current = null;
    }

    let radiusMeters = 0;
    let circleColor = "#10b981";
    let radiusLabel = "";

    if (commuteRadiusMode === "walk15") {
      radiusMeters = 1200; // 15-minute walking radius (~1.2 km)
      circleColor = "#10b981"; // Emerald
      radiusLabel = "🚶 15-Minute Walking Commute Radius (1.2 km)";
    } else if (commuteRadiusMode === "cycle15") {
      radiusMeters = 3750; // 15-minute cycling radius (~3.75 km)
      circleColor = "#0284c7"; // Sky Blue
      radiusLabel = "🚲 15-Minute Cycling Commute Radius (3.75 km)";
    } else if (commuteRadiusMode === "transit30") {
      radiusMeters = 10000; // 30-minute transit radius (~10 km)
      circleColor = "#8b5cf6"; // Purple
      radiusLabel = "🚆 30-Minute Transit Radius (10 km)";
    }

    if (radiusMeters > 0) {
      const circle = L.circle([centerLat, centerLng], {
        radius: radiusMeters,
        color: circleColor,
        weight: 2,
        dashArray: "6, 6",
        fillColor: circleColor,
        fillOpacity: 0.12
      }).addTo(map);

      circle.bindTooltip(radiusLabel, {
        permanent: false,
        direction: "top"
      });

      radiusCircleRef.current = circle;
    }

    // 3. Render Housing Markers (Dorms & Private Shares)
    housingList.forEach(housing => {
      if (!housing.Coordinates || !housing.Coordinates.lat || !housing.Coordinates.lng) return;

      const isSelected = selectedPropertyId === housing.id;
      const markerIcon = createCustomMarkerIcon({
        type: housing.Housing_Type || "Housing",
        price: housing.Rent_Cost,
        isOfficial: housing.Is_Official_Dorm,
        isSelected
      });

      const marker = L.marker([housing.Coordinates.lat, housing.Coordinates.lng], { icon: markerIcon });

      const officialBadge = housing.Is_Official_Dorm ? `
        <span style="background: rgba(16, 185, 129, 0.15); color: #047857; padding: 2px 7px; border-radius: 999px; font-size: 10px; font-weight: 700; border: 1px solid rgba(16, 185, 129, 0.3);">
          ✓ Official Subsidized Dorm
        </span>
      ` : `
        <span style="background: rgba(2, 132, 199, 0.12); color: #0284c7; padding: 2px 7px; border-radius: 999px; font-size: 10px; font-weight: 700; border: 1px solid rgba(2, 132, 199, 0.25);">
          Verified Private Share / Studio
        </span>
      `;

      const popupContent = `
        <div style="font-family: var(--font-sans); padding: 4px; min-width: 240px; max-width: 280px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            ${officialBadge}
            <span style="font-size: 11px; font-weight: 700; color: #0f172a;">
              ${housing.Housing_Type}
            </span>
          </div>

          <div style="font-size: 14px; font-weight: 800; color: #0f172a; margin-bottom: 4px; line-height: 1.2;">
            ${housing.Housing_Name}
          </div>

          <div style="display: flex; align-items: baseline; gap: 4px; margin: 6px 0;">
            <span style="font-size: 18px; font-weight: 900; color: #059669;">
              €${housing.Rent_Cost}
            </span>
            <span style="font-size: 11px; color: #64748b;">
              / month (All utilities incl.)
            </span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; background: #f8fafc; padding: 6px; border-radius: 6px; margin: 8px 0; font-size: 11px; color: #475569;">
            <div>📍 <strong>${housing.Distance_Km} km</strong> to campus</div>
            <div>🚶 <strong>~${housing.Walk_Time_Min} min</strong> walk</div>
            <div>🚲 <strong>~${housing.Cycle_Time_Min} min</strong> cycle</div>
            <div>🚆 <strong>~${housing.Transit_Time_Min || 10} min</strong> metro</div>
          </div>

          <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;">
            <strong>Provider:</strong> ${housing.Housing_Provider}
          </div>

          <div style="display: flex; gap: 6px; margin-top: 8px;">
            <a 
              href="${housing.Source_URL}" 
              target="_blank" 
              rel="noopener noreferrer"
              style="
                flex: 1;
                background: #0284c7;
                color: #ffffff;
                text-align: center;
                text-decoration: none;
                font-size: 11px;
                font-weight: 700;
                padding: 6px 10px;
                border-radius: 6px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 4px;
              "
            >
              <span>Apply on Official Portal</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"/></svg>
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on("click", () => {
        if (onSelectProperty) {
          onSelectProperty(housing);
        }
      });

      markersGroup.addLayer(marker);

      if (isSelected) {
        marker.openPopup();
      }
    });

    // 4. Render Amenities Markers (Libraries, Gyms, Groceries, Transit)
    amenitiesList.forEach(amenity => {
      if (!amenity.Coordinates || !amenity.Coordinates.lat || !amenity.Coordinates.lng) return;

      const markerIcon = createCustomMarkerIcon({
        type: amenity.Category,
        label: amenity.Name,
        isSelected: false
      });

      const marker = L.marker([amenity.Coordinates.lat, amenity.Coordinates.lng], { icon: markerIcon });

      marker.bindPopup(`
        <div style="font-family: var(--font-sans); padding: 4px; min-width: 200px;">
          <div style="font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase;">
            ${amenity.Category}: ${amenity.Subcategory || "Student Amenity"}
          </div>
          <div style="font-size: 13px; font-weight: 800; color: #0f172a; margin: 3px 0;">
            ${amenity.Name}
          </div>
          <div style="font-size: 11px; color: #475569; margin: 4px 0;">
            ${amenity.Details || ""}
          </div>
          <div style="font-size: 11px; color: #0284c7; font-weight: 600; margin-top: 4px;">
            📍 ${amenity.Distance_Km} km from campus
          </div>
        </div>
      `);

      markersGroup.addLayer(marker);
    });

    // Fit bounds if markers exist
    if (housingList.length > 0) {
      const latLngs = [
        [centerLat, centerLng],
        ...housingList.map(h => [h.Coordinates.lat, h.Coordinates.lng])
      ];
      try {
        const bounds = L.latLngBounds(latLngs);
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
      } catch (err) {}
    }
  }, [
    centerLat, 
    centerLng, 
    housingList, 
    amenitiesList, 
    commuteRadiusMode, 
    selectedPropertyId, 
    university
  ]);

  return (
    <div 
      className="touch-none gpu-accelerated"
      style={{ 
        position: "relative", 
        width: "100%", 
        height, 
        borderRadius: "14px", 
        overflow: "hidden", 
        border: "1px solid var(--border-subtle)", 
        background: "#0f172a",
        touchAction: "none",
        transform: "translate3d(0, 0, 0)",
        WebkitTransform: "translate3d(0, 0, 0)"
      }}
    >
      
      {/* Leaflet Map Div Container */}
      <div 
        ref={mapContainerRef} 
        className="touch-none"
        style={{ width: "100%", height: "100%", zIndex: 1, touchAction: "none" }} 
      />

      {/* Map Symbology Legend Badge (Floating Over Map) */}
      <div style={{
        position: "absolute",
        bottom: "16px",
        left: "16px",
        zIndex: 500,
        background: "rgba(15, 23, 42, 0.88)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        borderRadius: "10px",
        padding: "8px 12px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        fontSize: "0.74rem",
        color: "#f8fafc",
        boxShadow: "0 4px 12px rgba(0,0,0,0.4)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "50%", background: "#8b5cf6" }} />
          <span>🎓 Campus</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "50%", background: "#10b981" }} />
          <span>🛏️ Official Dorm</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "50%", background: "#0284c7" }} />
          <span>🏠 Private / WG</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "50%", background: "#f59e0b" }} />
          <span>🏋️ Gym</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "50%", background: "#6366f1" }} />
          <span>📚 Library</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "50%", background: "#06b6d4" }} />
          <span>🛒 Groceries & Transit</span>
        </div>
      </div>

      {/* Recenter Campus Quick Trigger */}
      <button
        type="button"
        onClick={() => {
          if (leafletMapRef.current) {
            leafletMapRef.current.setView([centerLat, centerLng], 14, { animate: true });
          }
        }}
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          zIndex: 500,
          background: "rgba(15, 23, 42, 0.9)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          color: "#ffffff",
          padding: "6px 12px",
          borderRadius: "8px",
          fontSize: "0.75rem",
          fontWeight: "600",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
        }}
        title="Center map on main university campus"
      >
        <Navigation size={13} color="#38bdf8" />
        <span>Center Campus</span>
      </button>

    </div>
  );
}
