import React from "react";
import { Home, GraduationCap, MapPin, ShieldCheck, User } from "lucide-react";

export default function BottomNavBar({ activeTab, onSelectTab, cartCount = 0 }) {
  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "universities", label: "Universities", icon: GraduationCap },
    { id: "map", label: "Map", icon: MapPin },
    { id: "visas", label: "Visas", icon: ShieldCheck },
    { id: "profile", label: "Profile", icon: User }
  ];

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "calc(64px + env(safe-area-inset-bottom, 0px))",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        backgroundColor: "#FFFFFF",
        borderTop: "1px solid #E2E8F0",
        boxShadow: "0 -2px 12px rgba(0, 0, 0, 0.04)",
        zIndex: 100,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-around",
        paddingTop: "6px",
        paddingLeft: "8px",
        paddingRight: "8px",
        transform: "translate3d(0, 0, 0)",
        WebkitTransform: "translate3d(0, 0, 0)",
        touchAction: "manipulation"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "680px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                if (onSelectTab) onSelectTab(tab.id);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              style={{
                background: "none",
                border: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
                padding: "6px 0",
                cursor: "pointer",
                color: isActive ? "#0F172A" : "#475569",
                transition: "color 0.15s ease",
                position: "relative"
              }}
            >
              <div style={{ position: "relative" }}>
                <Icon
                  size={21}
                  strokeWidth={isActive ? 2.5 : 1.75}
                  color={isActive ? "#0F172A" : "#475569"}
                />
                {tab.id === "profile" && cartCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-4px",
                      right: "-7px",
                      backgroundColor: "#FDE047",
                      color: "#0F172A",
                      fontSize: "0.62rem",
                      fontWeight: "800",
                      width: "15px",
                      height: "15px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1.5px solid #FFFFFF"
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </div>

              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: isActive ? "700" : "500",
                  marginTop: "3px",
                  letterSpacing: "-0.01em"
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
