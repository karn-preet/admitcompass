import React, { useState, useEffect } from "react";
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  Send, 
  PenTool, 
  UploadCloud, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  ExternalLink,
  ShieldAlert,
  GraduationCap
} from "lucide-react";
import { 
  getLORRequirements, 
  getLORBadge, 
  getLORTooltipText, 
  LOR_STATUSES, 
  LOR_STATUS_ORDER, 
  loadLORChecklistState, 
  saveLORChecklistState, 
  generateApplicationTasks 
} from "../services/lorRequirements";
import { useSwipeGesture } from "../hooks/useSwipeGesture";

function SwipeableLORCard({
  task,
  uniId,
  currentStatus,
  isSubmitted,
  handleUpdateLORStatus,
  handleUpdateProfessorName
}) {
  const getNextStatus = (st) => {
    if (st === LOR_STATUSES.NOT_CONTACTED) return LOR_STATUSES.PROFESSOR_CONTACTED;
    if (st === LOR_STATUSES.PROFESSOR_CONTACTED) return LOR_STATUSES.DRAFTING;
    if (st === LOR_STATUSES.DRAFTING) return LOR_STATUSES.SUBMITTED;
    return LOR_STATUSES.SUBMITTED;
  };

  const getPrevStatus = (st) => {
    if (st === LOR_STATUSES.SUBMITTED) return LOR_STATUSES.DRAFTING;
    if (st === LOR_STATUSES.DRAFTING) return LOR_STATUSES.PROFESSOR_CONTACTED;
    if (st === LOR_STATUSES.PROFESSOR_CONTACTED) return LOR_STATUSES.NOT_CONTACTED;
    return LOR_STATUSES.NOT_CONTACTED;
  };

  const { handlers, dragOffset, isDragging } = useSwipeGesture({
    onSwipeRight: () => {
      const next = getNextStatus(currentStatus);
      handleUpdateLORStatus(uniId, task.id, next);
    },
    onSwipeLeft: () => {
      const prev = getPrevStatus(currentStatus);
      handleUpdateLORStatus(uniId, task.id, prev);
    },
    threshold: 45,
    swipeResistance: 0.25,
    ignoreSelectors: "input, button, select"
  });

  return (
    <div
      className="swipeable-task-item"
      style={{
        position: "relative",
        borderRadius: "12px",
        overflow: "hidden",
        background: "#0d1117",
        touchAction: "pan-y"
      }}
    >
      {/* Background action reveal indicators */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 18px",
          pointerEvents: "none"
        }}
      >
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          color: "#34d399",
          fontWeight: 700,
          fontSize: "0.8rem",
          opacity: dragOffset > 10 ? Math.min(1, dragOffset / 35) : 0,
          transform: `translate3d(${Math.max(0, dragOffset * 0.15)}px, 0, 0)`
        }}>
          <CheckCircle2 size={18} />
          <span>Advance Stage ➔</span>
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          color: "#fbbf24",
          fontWeight: 700,
          fontSize: "0.8rem",
          opacity: dragOffset < -10 ? Math.min(1, Math.abs(dragOffset) / 35) : 0,
          transform: `translate3d(${Math.min(0, dragOffset * 0.15)}px, 0, 0)`
        }}>
          <span>⬅ Revert</span>
          <Clock size={18} />
        </div>
      </div>

      {/* Foreground Swipeable Card */}
      <div
        {...handlers}
        style={{
          position: "relative",
          zIndex: 2,
          background: isSubmitted ? "rgba(16, 185, 129, 0.09)" : "rgba(30, 41, 59, 0.7)",
          border: isSubmitted ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "12px",
          padding: "14px 16px",
          transform: `translate3d(${dragOffset}px, 0, 0)`,
          willChange: isDragging ? "transform" : "auto",
          transition: isDragging ? "none" : "transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "10px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h5 style={{ fontSize: "0.95rem", fontWeight: "700", color: isSubmitted ? "#34d399" : "#ffffff", margin: 0 }}>
                {task.title}
              </h5>
              <span style={{ 
                fontSize: "0.68rem", 
                padding: "1px 6px", 
                borderRadius: "4px", 
                background: task.format && task.format.includes("Portal") ? "rgba(59, 130, 246, 0.2)" : "rgba(168, 85, 247, 0.2)",
                color: task.format && task.format.includes("Portal") ? "#93c5fd" : "#d8b4fe",
                fontWeight: 600
              }}>
                {task.format}
              </span>
            </div>
            <p style={{ fontSize: "0.74rem", color: "var(--text-secondary)", margin: "2px 0 0 0" }}>
              {task.instructions}
            </p>
          </div>

          {/* Optional Professor / Referee Name Input */}
          <div>
            <input 
              type="text"
              placeholder="Referee Name / Designation..."
              value={task.professorName || ""}
              onChange={(e) => handleUpdateProfessorName(uniId, task.id, e.target.value)}
              style={{
                background: "rgba(0, 0, 0, 0.3)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "6px",
                padding: "4px 8px",
                color: "#ffffff",
                fontSize: "0.75rem",
                width: "190px"
              }}
            />
          </div>
        </div>

        {/* Multi-Stage Visual Status Tracker */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(3, 1fr)", 
          gap: "8px",
          marginTop: "8px"
        }}>
          {/* Stage 1: Professor Contacted */}
          {(() => {
            const isActive = currentStatus === LOR_STATUSES.PROFESSOR_CONTACTED;
            const isPast = currentStatus === LOR_STATUSES.DRAFTING || currentStatus === LOR_STATUSES.SUBMITTED;
            return (
              <button
                type="button"
                onClick={() => handleUpdateLORStatus(uniId, task.id, LOR_STATUSES.PROFESSOR_CONTACTED)}
                style={{
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: (isActive || isPast) ? "1px solid #3b82f6" : "1px solid rgba(255, 255, 255, 0.1)",
                  background: isActive ? "rgba(37, 99, 235, 0.3)" : isPast ? "rgba(37, 99, 235, 0.12)" : "rgba(255, 255, 255, 0.03)",
                  color: (isActive || isPast) ? "#93c5fd" : "var(--text-muted)",
                  cursor: "pointer",
                  fontSize: "0.76rem",
                  fontWeight: isActive ? 700 : 500,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  transition: "all 0.2s ease"
                }}
              >
                <Send size={13} />
                <span>1. Professor Contacted</span>
                {isPast && <CheckCircle2 size={12} color="#60a5fa" />}
              </button>
            );
          })()}

          {/* Stage 2: Drafting */}
          {(() => {
            const isActive = currentStatus === LOR_STATUSES.DRAFTING;
            const isPast = currentStatus === LOR_STATUSES.SUBMITTED;
            return (
              <button
                type="button"
                onClick={() => handleUpdateLORStatus(uniId, task.id, LOR_STATUSES.DRAFTING)}
                style={{
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: (isActive || isPast) ? "1px solid #f59e0b" : "1px solid rgba(255, 255, 255, 0.1)",
                  background: isActive ? "rgba(245, 158, 11, 0.3)" : isPast ? "rgba(245, 158, 11, 0.12)" : "rgba(255, 255, 255, 0.03)",
                  color: (isActive || isPast) ? "#fcd34d" : "var(--text-muted)",
                  cursor: "pointer",
                  fontSize: "0.76rem",
                  fontWeight: isActive ? 700 : 500,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  transition: "all 0.2s ease"
                }}
              >
                <PenTool size={13} />
                <span>2. Drafting</span>
                {isPast && <CheckCircle2 size={12} color="#fbbf24" />}
              </button>
            );
          })()}

          {/* Stage 3: Submitted / Uploaded */}
          {(() => {
            const isActive = currentStatus === LOR_STATUSES.SUBMITTED;
            return (
              <button
                type="button"
                onClick={() => handleUpdateLORStatus(uniId, task.id, LOR_STATUSES.SUBMITTED)}
                style={{
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: isActive ? "1px solid #10b981" : "1px solid rgba(255, 255, 255, 0.1)",
                  background: isActive ? "rgba(16, 185, 129, 0.3)" : "rgba(255, 255, 255, 0.03)",
                  color: isActive ? "#34d399" : "var(--text-muted)",
                  cursor: "pointer",
                  fontSize: "0.76rem",
                  fontWeight: isActive ? 800 : 500,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  transition: "all 0.2s ease"
                }}
              >
                <UploadCloud size={13} />
                <span>3. Submitted / Uploaded</span>
                {isActive && <CheckCircle2 size={12} color="#34d399" />}
              </button>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

function SwipeableDocumentItem({
  task,
  uniId,
  handleToggleStandardTask
}) {
  const { handlers, dragOffset, isDragging } = useSwipeGesture({
    onSwipeRight: () => {
      if (!task.completed) {
        handleToggleStandardTask(uniId, task.id);
      }
    },
    onSwipeLeft: () => {
      if (task.completed) {
        handleToggleStandardTask(uniId, task.id);
      }
    },
    threshold: 40,
    swipeResistance: 0.25,
    ignoreSelectors: "input, button, select"
  });

  return (
    <div
      className="swipeable-task-item"
      style={{
        position: "relative",
        borderRadius: "8px",
        overflow: "hidden",
        background: "#0d1117",
        touchAction: "pan-y"
      }}
    >
      {/* Background action reveal */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 14px",
          pointerEvents: "none"
        }}
      >
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          color: "#34d399",
          fontWeight: 700,
          fontSize: "0.74rem",
          opacity: dragOffset > 10 ? Math.min(1, dragOffset / 30) : 0
        }}>
          <CheckCircle2 size={16} />
          <span>Complete ➔</span>
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          color: "#94a3b8",
          fontWeight: 600,
          fontSize: "0.74rem",
          opacity: dragOffset < -10 ? Math.min(1, Math.abs(dragOffset) / 30) : 0
        }}>
          <span>⬅ Undo</span>
        </div>
      </div>

      {/* Foreground item */}
      <label
        {...handlers}
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "8px 12px",
          borderRadius: "8px",
          background: task.completed ? "rgba(16, 185, 129, 0.08)" : "rgba(30, 41, 59, 0.7)",
          border: task.completed ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(255, 255, 255, 0.08)",
          cursor: "pointer",
          transform: `translate3d(${dragOffset}px, 0, 0)`,
          willChange: isDragging ? "transform" : "auto",
          transition: isDragging ? "none" : "transform 0.26s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
      >
        <input 
          type="checkbox"
          checked={Boolean(task.completed)}
          onChange={() => handleToggleStandardTask(uniId, task.id)}
          style={{ cursor: "pointer", width: "15px", height: "15px", accentColor: "#10b981" }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "0.82rem", fontWeight: 600, color: task.completed ? "#34d399" : "#ffffff" }}>
            {task.title}
          </div>
          <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
            {task.subtitle}
          </div>
        </div>
        {task.isMandatory && (
          <span style={{ fontSize: "0.65rem", color: "#fbbf24", background: "rgba(245, 158, 11, 0.15)", padding: "1px 5px", borderRadius: "3px" }}>
            Req.
          </span>
        )}
      </label>
    </div>
  );
}

export default function ApplicationLORTracker({ 
  universities = [],
  onOpenDetailModal
}) {
  const [checklistState, setChecklistState] = useState(() => loadLORChecklistState());
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [collapsedUnis, setCollapsedUnis] = useState({});

  useEffect(() => {
    saveLORChecklistState(checklistState);
  }, [checklistState]);

  if (!universities || universities.length === 0) {
    return null;
  }

  const toggleCollapse = (uniId) => {
    setCollapsedUnis(prev => ({
      ...prev,
      [uniId]: !prev[uniId]
    }));
  };

  const handleUpdateLORStatus = (uniId, taskId, nextStatus) => {
    setChecklistState(prev => {
      const uniTasks = prev[uniId] || {};
      const currentTask = uniTasks[taskId] || {};
      
      // If clicking the current status again, toggle back to previous or not started
      const isAlreadyStatus = currentTask.status === nextStatus;
      const updatedStatus = isAlreadyStatus ? LOR_STATUSES.NOT_CONTACTED : nextStatus;
      
      return {
        ...prev,
        [uniId]: {
          ...uniTasks,
          [taskId]: {
            ...currentTask,
            status: updatedStatus
          }
        }
      };
    });
  };

  const handleUpdateProfessorName = (uniId, taskId, name) => {
    setChecklistState(prev => {
      const uniTasks = prev[uniId] || {};
      const currentTask = uniTasks[taskId] || {};
      return {
        ...prev,
        [uniId]: {
          ...uniTasks,
          [taskId]: {
            ...currentTask,
            professorName: name
          }
        }
      };
    });
  };

  const handleToggleStandardTask = (uniId, taskId) => {
    setChecklistState(prev => {
      const uniTasks = prev[uniId] || {};
      const currentTask = uniTasks[taskId] || {};
      const isCompleted = !Boolean(currentTask.completed);
      return {
        ...prev,
        [uniId]: {
          ...uniTasks,
          [taskId]: {
            ...currentTask,
            completed: isCompleted
          }
        }
      };
    });
  };

  return (
    <div style={{ marginTop: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ 
              background: "#FFD700", 
              color: "#000000", 
              fontWeight: 800, 
              fontSize: "0.72rem", 
              padding: "3px 8px", 
              borderRadius: "6px",
              letterSpacing: "0.5px"
            }}>
              APPLICATION CHECKLIST & LOR TRACKER
            </span>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              Multi-Stage Referee Status Pipeline
            </span>
          </div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: "700", color: "var(--text-primary)", margin: "4px 0 0 0" }}>
            Letter of Recommendation (LOR) & Dossier Tracker
          </h3>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "var(--text-muted)" }}>
          <span>Auto-saved to device</span>
          <span style={{ color: "#34d399" }}>●</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        {universities.map(uni => {
          const uniId = uni.id || uni.name;
          const { tasks, completedCount, totalCount, progressPercent } = generateApplicationTasks(uni, checklistState);
          const lorBadge = getLORBadge(uni);
          const tooltip = getLORTooltipText(uni);
          const isCollapsed = Boolean(collapsedUnis[uniId]);

          // Split tasks into LOR tasks vs standard document tasks
          const lorTasks = tasks.filter(t => t.type === "LOR");
          const otherTasks = tasks.filter(t => t.type !== "LOR");

          return (
            <div 
              key={uniId}
              className="glass-panel"
              style={{
                borderRadius: "16px",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                background: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)",
                overflow: "hidden",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.4)"
              }}
            >
              {/* University Header & Master Progress Bar */}
              <div style={{ padding: "18px 22px", borderBottom: isCollapsed ? "none" : "1px solid rgba(255, 255, 255, 0.08)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
                      <span style={{ fontSize: "0.76rem", color: "#93c5fd", fontWeight: "600" }}>
                        {uni.city}, {uni.country}
                      </span>

                      {/* High-Visibility LOR Badge (Yellow #FFD700) */}
                      <span 
                        style={{
                          background: lorBadge.badgeBg,
                          color: lorBadge.badgeColor,
                          border: `1px solid ${lorBadge.badgeBorder}`,
                          fontWeight: 800,
                          fontSize: "0.72rem",
                          padding: "2px 8px",
                          borderRadius: "6px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                      >
                        {lorBadge.text}
                      </span>

                      {/* Tooltip trigger icon */}
                      <div style={{ position: "relative", display: "inline-block" }}>
                        <button
                          type="button"
                          onClick={() => setActiveTooltip(activeTooltip === uniId ? null : uniId)}
                          style={{
                            background: "rgba(255, 255, 255, 0.08)",
                            border: "1px solid rgba(255, 255, 255, 0.15)",
                            color: "#93c5fd",
                            borderRadius: "50%",
                            width: "22px",
                            height: "22px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            padding: 0
                          }}
                          title="Click to view upload portal vs PDF instructions"
                        >
                          <Info size={13} />
                        </button>

                        {/* Interactive Tooltip Popover */}
                        {activeTooltip === uniId && (
                          <div style={{
                            position: "absolute",
                            top: "28px",
                            left: 0,
                            zIndex: 100,
                            width: "320px",
                            background: "#0b1120",
                            border: "1px solid #3b82f6",
                            borderRadius: "10px",
                            padding: "14px",
                            boxShadow: "0 20px 30px rgba(0, 0, 0, 0.8)",
                            fontSize: "0.78rem"
                          }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                              <strong style={{ color: "#FFD700" }}>{tooltip.title}</strong>
                              <button 
                                onClick={() => setActiveTooltip(null)} 
                                style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "0.9rem" }}
                              >
                                ✕
                              </button>
                            </div>
                            <p style={{ color: "#e2e8f0", margin: "0 0 8px 0", lineHeight: "1.4" }}>
                              {tooltip.description}
                            </p>
                            <div style={{ background: "rgba(59, 130, 246, 0.12)", padding: "6px 8px", borderRadius: "6px", color: "#93c5fd", fontSize: "0.72rem" }}>
                              💡 <strong>Note:</strong> {tooltip.actionHint}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <h4 style={{ fontSize: "1.18rem", fontWeight: "800", color: "#ffffff", margin: 0 }}>
                      {uni.name}
                    </h4>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {onOpenDetailModal && (
                      <button
                        type="button"
                        onClick={() => onOpenDetailModal(uni)}
                        style={{
                          background: "rgba(255, 255, 255, 0.06)",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                          color: "#e2e8f0",
                          padding: "5px 10px",
                          borderRadius: "6px",
                          fontSize: "0.74rem",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                      >
                        <span>View Requirements</span>
                        <ExternalLink size={12} />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => toggleCollapse(uniId)}
                      style={{
                        background: "rgba(255, 255, 255, 0.06)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        color: "#94a3b8",
                        borderRadius: "6px",
                        padding: "5px 8px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "0.74rem"
                      }}
                    >
                      <span>{isCollapsed ? "Expand" : "Collapse"}</span>
                      {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                    </button>
                  </div>
                </div>

                {/* Master Application Progress Bar */}
                <div style={{ marginTop: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem", marginBottom: "5px" }}>
                    <span style={{ color: "var(--text-secondary)", fontWeight: "600" }}>
                      Master Application Dossier Progress
                    </span>
                    <span style={{ fontWeight: "800", color: progressPercent === 100 ? "#34d399" : "#FFD700" }}>
                      {completedCount} of {totalCount} Completed ({progressPercent}%)
                    </span>
                  </div>

                  <div style={{ width: "100%", height: "8px", background: "rgba(255, 255, 255, 0.1)", borderRadius: "6px", overflow: "hidden" }}>
                    <div 
                      style={{
                        width: `${progressPercent}%`,
                        height: "100%",
                        background: progressPercent === 100 
                          ? "linear-gradient(90deg, #10b981 0%, #34d399 100%)"
                          : "linear-gradient(90deg, #f59e0b 0%, #FFD700 100%)",
                        borderRadius: "6px",
                        transition: "width 0.4s ease"
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Expandable Tasks Body */}
              {!isCollapsed && (
                <div style={{ padding: "18px 22px" }}>
                      {/* SECTION 1: LOR Multi-Stage Tracker Cards */}
                  {lorTasks.length > 0 && (
                    <div style={{ marginBottom: "18px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", flexWrap: "wrap", gap: "6px" }}>
                        <div style={{ fontSize: "0.78rem", fontWeight: "700", color: "#fcd34d", textTransform: "uppercase", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: "6px" }}>
                          <PenTool size={14} />
                          <span>Letters of Recommendation (LOR) Pipeline</span>
                        </div>
                        <span style={{ fontSize: "0.72rem", color: "#93c5fd", background: "rgba(59, 130, 246, 0.15)", border: "1px solid rgba(59, 130, 246, 0.3)", padding: "2px 8px", borderRadius: "12px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <span>👉 Swipe right to advance stage</span>
                        </span>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {lorTasks.map((task) => {
                          const currentStatus = task.status;
                          const isSubmitted = currentStatus === LOR_STATUSES.SUBMITTED;

                          return (
                            <SwipeableLORCard 
                              key={task.id}
                              task={task}
                              uniId={uniId}
                              currentStatus={currentStatus}
                              isSubmitted={isSubmitted}
                              handleUpdateLORStatus={handleUpdateLORStatus}
                              handleUpdateProfessorName={handleUpdateProfessorName}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* SECTION 2: Standard Application Dossier Checklist */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", flexWrap: "wrap", gap: "6px" }}>
                      <div style={{ fontSize: "0.78rem", fontWeight: "700", color: "#93c5fd", textTransform: "uppercase", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: "6px" }}>
                        <FileText size={14} />
                        <span>Complementary Dossier Documents</span>
                      </div>
                      <span style={{ fontSize: "0.72rem", color: "#34d399", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "2px 8px", borderRadius: "12px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <span>👉 Swipe right to check off</span>
                      </span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "8px" }}>
                      {otherTasks.map((task) => (
                        <SwipeableDocumentItem 
                          key={task.id}
                          task={task}
                          uniId={uniId}
                          handleToggleStandardTask={handleToggleStandardTask}
                        />
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
