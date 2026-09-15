const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const { connectDB } = require("./config/db");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: "*", // Allow frontend development port
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(morgan("dev"));

// Database initialization
connectDB();

// API Routes
app.use("/api/evaluate", require("./routes/evaluate"));
app.use("/api/universities", require("./routes/universities"));
app.use("/api/visa-rules", require("./routes/visaRules"));
app.use("/api/scrape", require("./routes/scraper"));
app.use("/api/decisions", require("./routes/decisions"));
app.use("/api/rate-my-chances", require("./routes/rateMyChances"));
app.use("/api/visa-mock", require("./routes/visaMock"));
app.use("/api/sop", require("./routes/sop"));
app.use("/api/scholarships", require("./routes/scholarships"));
app.use("/api/loans", require("./routes/loans"));
app.use("/api/discussions", require("./routes/discussions"));
app.use("/api/application-cart", require("./routes/applicationCart"));
app.use("/api/housing", require("./routes/housing"));

// System Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Study Abroad Admission & Visa Eligibility Evaluator API",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  });
});

// Production Static Asset Serving & SPA Routing
const frontendDist = path.resolve(__dirname, "../../frontend/dist");
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.join(frontendDist, "index.html"));
  });
} else {
  // Development fallback route if frontend is not built
  app.get("/", (req, res) => {
    res.send(`
      <html>
        <head><title>Study Abroad Evaluator API</title></head>
        <body style="font-family: sans-serif; padding: 2rem; max-width: 700px; margin: auto;">
          <h2>🎓 Study Abroad Admission and Visa Eligibility Evaluator Backend</h2>
          <p>API service is live and operational.</p>
          <ul>
            <li><strong>POST /api/evaluate</strong> - Evaluate applicant profile</li>
            <li><strong>GET /api/universities</strong> - Search public universities</li>
            <li><strong>GET /api/visa-rules</strong> - Get destination financial and visa rules</li>
            <li><strong>GET /api/scrape/citations</strong> - Official government & university citations</li>
          </ul>
        </body>
      </html>
    `);
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled API Error:", err);
  res.status(500).json({
    success: false,
    error: err.message || "Internal Server Error"
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Study Abroad Evaluator Server running on http://localhost:${PORT}`);
});
