const express = require("express");
const router = express.Router();
const { getStore } = require("../config/db");

/**
 * GET /api/discussions
 * Search & filter community discussions
 */
router.get("/", (req, res) => {
  try {
    const { category, search } = req.query;
    const store = getStore();
    let discussions = [...(store.discussions || [])];

    if (category && category !== "All") {
      discussions = discussions.filter(d => d.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      discussions = discussions.filter(d =>
        d.title.toLowerCase().includes(q) ||
        d.content.toLowerCase().includes(q) ||
        (d.tags && d.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    // Sort by upvotes descending
    discussions.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));

    res.json({
      success: true,
      count: discussions.length,
      data: discussions
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/discussions
 * Post a new discussion thread
 */
router.post("/", (req, res) => {
  try {
    const {
      title,
      content,
      category = "General",
      author = "Anonymous Student",
      authorBadge = "Aspirant",
      tags = []
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: "Title and content are required to start a discussion."
      });
    }

    const newDiscussion = {
      id: "disc-user-" + Date.now(),
      category,
      title,
      content,
      author,
      authorBadge,
      createdAt: new Date().toISOString(),
      upvotes: 1,
      repliesCount: 0,
      tags: Array.isArray(tags) ? tags : [tags].filter(Boolean)
    };

    const store = getStore();
    if (!store.discussions) store.discussions = [];
    store.discussions.unshift(newDiscussion);

    res.status(201).json({
      success: true,
      data: newDiscussion
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/discussions/:id/upvote
 * Upvotes a discussion thread
 */
router.post("/:id/upvote", (req, res) => {
  try {
    const { id } = req.params;
    const store = getStore();
    const thread = (store.discussions || []).find(d => d.id === id);

    if (!thread) {
      return res.status(404).json({ success: false, error: "Thread not found." });
    }

    thread.upvotes = (thread.upvotes || 0) + 1;

    res.json({
      success: true,
      data: { id: thread.id, upvotes: thread.upvotes }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
