import React from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 16px",
          background: "var(--bg-main, #0F172A)"
        }}>
          <div style={{
            maxWidth: "600px",
            width: "100%",
            background: "#1E293B",
            border: "1px solid rgba(239, 68, 68, 0.4)",
            borderRadius: "16px",
            padding: "32px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
            textAlign: "center",
            color: "#F8FAFC"
          }}>
            <div style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "rgba(239, 68, 68, 0.15)",
              color: "#EF4444",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px auto"
            }}>
              <AlertTriangle size={32} />
            </div>

            <h2 style={{
              fontSize: "1.5rem",
              fontWeight: "800",
              marginBottom: "8px",
              color: "#FFFFFF",
              letterSpacing: "-0.02em"
            }}>
              Unable to Display Results
            </h2>

            <p style={{
              fontSize: "0.92rem",
              color: "#94A3B8",
              lineHeight: 1.6,
              marginBottom: "20px"
            }}>
              A display issue occurred while rendering this section. Don't worry, your data is safe. You can retry rendering or return to the intake form.
            </p>

            {this.state.error && (
              <div style={{
                background: "rgba(15, 23, 42, 0.6)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "8px",
                padding: "12px 16px",
                fontSize: "0.8rem",
                fontFamily: "monospace",
                color: "#FCA5A5",
                textAlign: "left",
                marginBottom: "24px",
                overflowX: "auto",
                maxHeight: "120px"
              }}>
                {this.state.error.toString()}
              </div>
            )}

            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={this.handleReset}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#3B82F6",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 20px",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "background 0.15s"
                }}
              >
                <RotateCcw size={16} />
                <span>Try Again</span>
              </button>

              <button
                onClick={this.handleReload}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "#F1F5F9",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  padding: "10px 20px",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "background 0.15s"
                }}
              >
                <Home size={16} />
                <span>Reload Page</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
