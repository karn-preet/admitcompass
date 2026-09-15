import React, { useState, useEffect } from "react";
import { fetchDiscussions, submitDiscussion, upvoteDiscussion } from "../services/api";
import { 
  MessageSquare, ThumbsUp, Plus, Search, Filter, 
  User, Tag, CheckCircle2, Sparkles, MessageCircle, Calendar 
} from "lucide-react";
import confetti from "canvas-confetti";

export default function CommunityDiscussionsView() {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedThreadId, setExpandedThreadId] = useState(null);

  // New Thread Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Visa & Immigration");
  const [newAuthor, setNewAuthor] = useState("");
  const [newTags, setNewTags] = useState("");
  const [newContent, setNewContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (categoryFilter) filters.category = categoryFilter;
      if (searchQuery) filters.search = searchQuery;

      const res = await fetchDiscussions(filters);
      if (res.success) {
        setThreads(res.data);
      }
    } catch (e) {
      console.error("Failed to load discussions:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [categoryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  const handleUpvote = async (id, e) => {
    e.stopPropagation();
    // Optimistic update
    setThreads(prev => prev.map(t => t.id === id ? { ...t, upvotes: t.upvotes + 1 } : t));
    try {
      await upvoteDiscussion(id);
    } catch (err) {
      console.error("Upvote error:", err);
    }
  };

  const handleCreateThread = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    setSubmitting(true);

    try {
      const tagsArray = newTags
        .split(",")
        .map(t => t.trim())
        .filter(Boolean);

      const payload = {
        title: newTitle,
        category: newCategory,
        author: newAuthor.trim() || "Anonymous Student",
        tags: tagsArray.length > 0 ? tagsArray : ["Discussion"],
        content: newContent
      };

      const res = await submitDiscussion(payload);
      if (res.success) {
        confetti({ particleCount: 50, spread: 50 });
        setIsModalOpen(false);
        setNewTitle("");
        setNewContent("");
        setNewTags("");
        setNewAuthor("");
        loadData();
      }
    } catch (err) {
      alert("Failed to post question: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    "Visa & Immigration", 
    "Profile Evaluation", 
    "Education Loans", 
    "SOP & Essays", 
    "Standardized Tests (GRE/IELTS)"
  ];

  return (
    <div className="container" style={{ paddingBottom: "60px" }}>
      {/* Header Banner */}
      <div style={{ textAlign: "center", maxWidth: "850px", margin: "0 auto 32px auto" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(59, 130, 246, 0.15)", border: "1px solid rgba(59, 130, 246, 0.3)", padding: "6px 16px", borderRadius: "999px", marginBottom: "16px" }}>
          <MessageSquare size={16} color="#60a5fa" />
          <span style={{ fontSize: "0.82rem", color: "#93c5fd", fontWeight: "600" }}>
            100% Free Study Abroad Student Forum • No Sign-up Required
          </span>
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.4rem", fontWeight: "800", color: "#ffffff", letterSpacing: "-1px" }}>
          Community Q&A & Visa Experiences
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", marginTop: "12px" }}>
          Ask questions, share consular interview transcripts, track German APS verification timelines, and get peer advice from successful applicants.
        </p>
      </div>

      {/* Action and Filter Bar */}
      <div className="glass-panel" style={{ padding: "18px 24px", marginBottom: "28px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", alignItems: "center", justifyContent: "space-between" }}>
          
          <form onSubmit={handleSearchSubmit} style={{ display: "flex", flex: "1 1 320px", gap: "8px" }}>
            <div style={{ position: "relative", width: "100%" }}>
              <Search size={16} color="var(--text-muted)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="text"
                placeholder="Search community discussions (e.g. APS, F1 interview, SBI loan)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "9px 12px 9px 36px",
                  borderRadius: "8px",
                  background: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-subtle)",
                  color: "#ffffff",
                  fontSize: "0.88rem",
                  outline: "none"
                }}
              />
            </div>
            <button type="submit" className="btn btn-secondary" style={{ padding: "8px 14px", fontSize: "0.85rem" }}>
              Filter
            </button>
          </form>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border-subtle)",
                color: "#ffffff",
                fontSize: "0.85rem"
              }}
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary"
              style={{ padding: "8px 18px", fontSize: "0.88rem", fontWeight: "700" }}
            >
              <Plus size={16} />
              Ask Question (Free)
            </button>
          </div>

        </div>
      </div>

      {/* Discussion Threads List */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
          Loading community threads...
        </div>
      ) : threads.length === 0 ? (
        <div className="glass-panel" style={{ padding: "48px", textAlign: "center" }}>
          <p style={{ color: "var(--text-secondary)" }}>
            No discussions found. Be the first to start a thread!
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {threads.map((thread) => {
            const isExpanded = expandedThreadId === thread.id;
            return (
              <div
                key={thread.id}
                className="glass-panel"
                style={{ padding: "22px", cursor: "pointer", transition: "border-color 0.2s ease" }}
                onClick={() => setExpandedThreadId(isExpanded ? null : thread.id)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
                  
                  {/* Left: Upvote Column */}
                  <button
                    onClick={(e) => handleUpvote(thread.id, e)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "8px 12px",
                      borderRadius: "10px",
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid var(--border-subtle)",
                      cursor: "pointer",
                      color: "#93c5fd",
                      transition: "all 0.2s ease"
                    }}
                    title="Upvote helpful post"
                  >
                    <ThumbsUp size={16} />
                    <span style={{ fontSize: "0.85rem", fontWeight: "800", marginTop: "4px" }}>
                      {thread.upvotes}
                    </span>
                  </button>

                  {/* Center: Thread Details */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                      <span className="badge badge-target" style={{ fontSize: "0.72rem" }}>
                        {thread.category}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        Posted by <strong>{thread.author}</strong> • {thread.date}
                      </span>
                    </div>

                    <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "#ffffff", marginBottom: "8px" }}>
                      {thread.title}
                    </h3>

                    <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
                      {isExpanded ? thread.content : `${thread.content.slice(0, 160)}...`}
                    </p>

                    {/* Tags */}
                    {thread.tags && thread.tags.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
                        {thread.tags.map((tag, idx) => (
                          <span key={idx} style={{ fontSize: "0.7rem", background: "rgba(255, 255, 255, 0.05)", padding: "2px 8px", borderRadius: "4px", color: "var(--text-muted)" }}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right: Reply Count */}
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", color: "var(--text-muted)" }}>
                    <MessageCircle size={16} />
                    <span>{thread.repliesCount || 0} replies</span>
                  </div>

                </div>

                {/* Expanded Replies Section */}
                {isExpanded && thread.replies && thread.replies.length > 0 && (
                  <div style={{ marginTop: "20px", borderTop: "1px solid var(--border-subtle)", paddingTop: "16px" }}>
                    <h4 style={{ fontSize: "0.9rem", fontWeight: "700", color: "#cbd5e1", marginBottom: "12px" }}>
                      Community Replies ({thread.replies.length})
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {thread.replies.map((reply, idx) => (
                        <div key={idx} style={{ background: "rgba(255, 255, 255, 0.03)", padding: "12px 14px", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
                          <div style={{ fontSize: "0.75rem", color: "#93c5fd", fontWeight: "600", marginBottom: "4px" }}>
                            {reply.author} • {reply.date}
                          </div>
                          <div style={{ fontSize: "0.85rem", color: "#e2e8f0" }}>
                            {reply.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* Ask Question Modal */}
      {isModalOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "20px"
        }}>
          <div className="glass-panel" style={{ width: "100%", maxWidth: "550px", padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#ffffff" }}>
                Ask a Question / Share Experience
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "1.2rem" }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateThread}>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "0.82rem", color: "#cbd5e1", marginBottom: "4px" }}>Title / Question</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. F-1 Visa Interview Experience at Mumbai Consulate (Approved)"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--bg-surface-elevated)", border: "1px solid var(--border-subtle)", color: "#ffffff", fontSize: "0.85rem" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", color: "#cbd5e1", marginBottom: "4px" }}>Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", background: "var(--bg-surface-elevated)", border: "1px solid var(--border-subtle)", color: "#ffffff", fontSize: "0.85rem" }}
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", color: "#cbd5e1", marginBottom: "4px" }}>Your Handle / Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul_CS or Anonymous"
                    value={newAuthor}
                    onChange={e => setNewAuthor(e.target.value)}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", background: "var(--bg-surface-elevated)", border: "1px solid var(--border-subtle)", color: "#ffffff", fontSize: "0.85rem" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "0.82rem", color: "#cbd5e1", marginBottom: "4px" }}>Tags (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. F1 Visa, Mumbai, Computer Science"
                  value={newTags}
                  onChange={e => setNewTags(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--bg-surface-elevated)", border: "1px solid var(--border-subtle)", color: "#ffffff", fontSize: "0.85rem" }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.82rem", color: "#cbd5e1", marginBottom: "4px" }}>Details / Body</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share details, questions asked, timelines, or your profile stats..."
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "var(--bg-surface-elevated)", border: "1px solid var(--border-subtle)", color: "#ffffff", fontSize: "0.85rem" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? "Posting..." : "Post to Community"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
