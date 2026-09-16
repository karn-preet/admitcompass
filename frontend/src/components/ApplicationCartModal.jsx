import React from "react";
import { ShoppingCart, X } from "lucide-react";
import ApplicationCartView from "./ApplicationCartView";

export default function ApplicationCartModal({ 
  isOpen, 
  onClose, 
  cartItems = [], 
  onRemoveItem, 
  onClearCart,
  originCountry = "India"
}) {
  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(10, 15, 30, 0.85)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "16px"
      }}
      onClick={onClose}
    >
      <div 
        className="glass-panel"
        style={{
          width: "100%",
          maxWidth: "960px",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "20px",
          border: "1px solid var(--border-warm)",
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.25)",
          background: "#FFFFFF",
          overflow: "hidden"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{
          padding: "18px 24px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#FFFFFF"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #2563eb, #06b6d4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)"
            }}>
              <ShoppingCart size={20} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: "800", color: "var(--text-primary)", margin: 0 }}>
                  Application Cart & Pre-Admission Sunk Cost Simulator
                </h3>
                <span className="badge badge-safe" style={{ fontSize: "0.68rem" }}>
                  {cartItems.length} Shortlisted
                </span>
              </div>
              <p style={{ fontSize: "0.76rem", color: "var(--text-secondary)", margin: "2px 0 0 0" }}>
                Live multi-application bundling calculator (Uni-assist, Sweden Antagning, UCAS) & hidden costs
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose}
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-warm)",
              color: "var(--text-primary)",
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.15s ease"
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Content */}
        <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1 }}>
          <ApplicationCartView 
            cartItems={cartItems}
            onRemoveItem={onRemoveItem}
            onClearCart={onClearCart}
            originCountry={originCountry}
          />
        </div>

      </div>
    </div>
  );
}
