const express = require("express");
const router = express.Router();
const { 
  verifyAndScrapeUrl, 
  getOfficialCitationsDirectory,
  getOfficialPortalsDirectory,
  scrapePublicPrograms,
  extractHiddenFeeKeywords
} = require("../services/scraperService");

/**
 * POST /api/scrape/analyze-fees
 * Scrapes or analyzes page text for hidden application, handling, and semester contribution fees
 */
router.post("/analyze-fees", async (req, res) => {
  try {
    const { url, text } = req.body;
    let contentToAnalyze = text || "";

    if (url) {
      const scraped = await verifyAndScrapeUrl(url);
      if (scraped.hiddenFeeAnalysis) {
        return res.json({
          success: true,
          data: {
            url,
            pageTitle: scraped.pageTitle,
            hostname: scraped.hostname,
            analysis: scraped.hiddenFeeAnalysis
          }
        });
      }
    }

    const analysis = extractHiddenFeeKeywords(contentToAnalyze);
    res.json({
      success: true,
      data: {
        analysis
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/scrape/verify
 * Real-time scrapers & verifies an official university or government portal link
 */
router.post("/verify", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ success: false, error: "URL is required" });
    }

    const verificationResult = await verifyAndScrapeUrl(url);
    res.json({
      success: true,
      data: verificationResult
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/scrape/citations
 * Returns the curated directory of live official government and university citations
 */
router.get("/citations", (req, res) => {
  try {
    const citations = getOfficialCitationsDirectory();
    res.json({
      success: true,
      count: citations.length,
      data: citations
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/scrape/portals
 * Returns the official higher education portals across all 27 EU nations and global hubs
 */
router.get("/portals", (req, res) => {
  try {
    const portals = getOfficialPortalsDirectory();
    res.json({
      success: true,
      count: portals.length,
      data: portals
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/scrape/search
 * Searches public, English-taught degree programs with dynamic tuition limit
 */
router.post("/search", (req, res) => {
  try {
    const { country, degreeLevel, maxTuitionFee, field } = req.body;
    const results = scrapePublicPrograms({ country, degreeLevel, maxTuitionFee, field });
    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
