import React from "react";
import { Globe2, Sparkles } from "lucide-react";

export default function GlobeSkeletonLoader({ height = 480 }) {
  return (
    <div 
      style={{
        width: "100%",
        height: `${height}px`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at center, rgba(250, 248, 245, 0.9) 0%, rgba(244, 240, 232, 0.6) 70%, transparent 100%)",
        borderRadius: "18px",
        border: "1px dashed rgba(179, 142, 93, 0.3)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Soft pulsating background rings */}
      <div 
        style={{
          position: "absolute",
          width: "360px",
          height: "360px",
          borderRadius: "50%",
          border: "2px solid rgba(179, 142, 93, 0.15)",
          animation: "globe-pulse 3s ease-in-out infinite",
          pointerEvents: "none"
        }} 
      />
      <div 
        style={{
          position: "absolute",
          width: "280px",
          height: "280px",
          borderRadius: "50%",
          border: "1px dashed rgba(30, 58, 43, 0.2)",
          animation: "globe-pulse 3s ease-in-out infinite 0.75s",
          pointerEvents: "none"
        }} 
      />

      {/* Center Stylized 2D Globe Silhouette */}
      <div 
        style={{
          width: "180px",
          height: "180px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(244, 240, 232, 0.95) 0%, rgba(226, 221, 212, 0.8) 100%)",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08), inset 0 2px 10px rgba(255, 255, 255, 0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
          position: "relative"
        }}
      >
        <Globe2 size={84} color="var(--accent-green, #1E3A2B)" style={{ opacity: 0.6, animation: "globe-spin-skeleton 12s linear infinite" }} />
      </div>

      {/* Shimmer Text */}
      <div style={{ marginTop: "24px", textAlign: "center", zIndex: 2 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", color: "var(--accent-gold, #B38E5D)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
          <Sparkles size={14} />
          <span>Instantiating 3D WebGL Globe</span>
        </div>
        <p style={{ color: "var(--text-secondary, #4A4E49)", fontSize: "0.88rem", marginTop: "4px", maxWidth: "340px" }}>
          Streaming low-poly country polygons & physics engine in background...
        </p>
      </div>

      {/* Embedded Animations */}
      <style>{`
        @keyframes globe-pulse {
          0%, 100% { transform: scale(0.95); opacity: 0.4; }
          50% { transform: scale(1.05); opacity: 0.85; }
        }
        @keyframes globe-spin-skeleton {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
