import React, { useState } from "react";
import { startVisaMock, evaluateVisaMockAnswer } from "../services/api";
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, XCircle, 
  MessageSquare, User, Bot, Sparkles, ArrowRight, RotateCcw, Award 
} from "lucide-react";
import confetti from "canvas-confetti";

export default function AiVisaMockView() {
  const [country, setCountry] = useState("USA");
  const [session, setSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState(null);
  const [completedInterviews, setCompletedInterviews] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [error, setError] = useState("");

  const startSession = async (chosenCountry) => {
    setError("");
    setEvalResult(null);
    setCompletedInterviews([]);
    setIsFinished(false);
    setQuestionIndex(0);
    setUserAnswer("");
    try {
      const res = await startVisaMock(chosenCountry || country);
      if (res.success) {
        setSession(res.data);
        setCurrentQuestion(res.data.currentQuestion);
      } else {
        setError("Failed to start mock session.");
      }
    } catch (e) {
      setError(e.message || "Failed to initialize visa mock engine.");
    }
  };

  const handleEvaluate = async () => {
    if (!userAnswer.trim() || !currentQuestion) return;
    setIsEvaluating(true);
    setError("");

    try {
      const res = await evaluateVisaMockAnswer({
        country: session.country,
        questionId: currentQuestion.id,
        studentAnswer: userAnswer,
        currentQuestionIndex: questionIndex
      });

      if (res.success) {
        setEvalResult(res.data);
        if (res.data.evaluation?.score >= 8) {
          confetti({ particleCount: 50, spread: 50 });
        }
      } else {
        setError("Could not evaluate response.");
      }
    } catch (e) {
      setError(e.message || "Evaluation error.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    // Record current Q&A
    setCompletedInterviews(prev => [
      ...prev,
      {
        question: currentQuestion.question,
        answer: userAnswer,
        evaluation: evalResult.evaluation
      }
    ]);

    if (evalResult.isInterviewComplete || !evalResult.nextQuestion) {
      setIsFinished(true);
    } else {
      setCurrentQuestion(evalResult.nextQuestion);
      setQuestionIndex(evalResult.nextIndex);
      setUserAnswer("");
      setEvalResult(null);
    }
  };

  const totalScore = completedInterviews.length > 0
    ? (completedInterviews.reduce((acc, curr) => acc + (curr.evaluation?.score || 6), 0) / completedInterviews.length).toFixed(1)
    : 0;

  return (
    <div className="container" style={{ paddingBottom: "60px" }}>
      {/* Header Banner */}
      <div style={{ textAlign: "center", maxWidth: "850px", margin: "0 auto 32px auto" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(37, 99, 235, 0.15)", border: "1px solid rgba(59, 130, 246, 0.3)", padding: "6px 16px", borderRadius: "999px", marginBottom: "16px" }}>
          <ShieldCheck size={16} color="#60a5fa" />
          <span style={{ fontSize: "0.82rem", color: "#93c5fd", fontWeight: "600" }}>
            100% Free AI Visa Consular Interviewer • INA Section 214(b) Simulator
          </span>
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.4rem", fontWeight: "800", color: "#ffffff", letterSpacing: "-1px" }}>
          AI Visa Mock Interview & Refusal Defense
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", marginTop: "12px" }}>
          Practice tough questions with an AI simulated Visa Officer. Get instant scores, immigrant intent detection (214b risks), and high-impact model answer rewrites tailored for US F-1, Germany National, and Canada Study Visas.
        </p>
      </div>

      {!session ? (
        /* Welcome / Country Selection Screen */
        <div className="glass-panel" style={{ maxWidth: "700px", margin: "0 auto", padding: "36px", textAlign: "center" }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#ffffff", marginBottom: "12px" }}>
            Choose Target Visa Authority
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "24px" }}>
            Simulate realistic grilling tailored to destination-specific refusal triggers (e.g. US 214b immigrant intent vs Germany APS & Blocked Account verification).
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "28px" }}>
            {[
              { id: "USA", flag: "🇺🇸", name: "USA F-1 Visa", desc: "INA 214(b) immigrant intent & sponsor ITR testing" },
              { id: "Germany", flag: "🇩🇪", name: "Germany Student Visa", desc: "APS, blocked account & German curriculum motivation" },
              { id: "Canada", flag: "🇨🇦", name: "Canada Study Permit", desc: "Dual intent, PAL & GIC compliance checks" },
              { id: "UK", flag: "🇬🇧", name: "UK Student Route", desc: "Credibility interview & CAS financial rules" }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setCountry(item.id)}
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  textAlign: "left",
                  cursor: "pointer",
                  background: country === item.id ? "rgba(37, 99, 235, 0.2)" : "rgba(255, 255, 255, 0.03)",
                  border: country === item.id ? "2px solid #3b82f6" : "1px solid var(--border-subtle)",
                  transition: "all 0.2s ease"
                }}
              >
                <div style={{ fontSize: "1.6rem", marginBottom: "6px" }}>{item.flag}</div>
                <div style={{ fontSize: "1rem", fontWeight: "700", color: "#ffffff" }}>{item.name}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>{item.desc}</div>
              </button>
            ))}
          </div>

          <button
            onClick={() => startSession(country)}
            className="btn btn-primary"
            style={{ padding: "14px 32px", fontSize: "1rem", fontWeight: "700" }}
          >
            Start Consular Mock Session
            <ArrowRight size={18} />
          </button>
        </div>
      ) : isFinished ? (
        /* Final Results Screen */
        <div className="glass-panel" style={{ maxWidth: "750px", margin: "0 auto", padding: "36px" }}>
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <Award color="#34d399" size={48} style={{ margin: "0 auto 12px auto" }} />
            <h2 style={{ fontSize: "1.6rem", fontWeight: "800", color: "#ffffff" }}>
              Consular Interview Completed!
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
              Target: <strong>{session.visaTitle}</strong>
            </p>
            
            <div style={{ display: "inline-block", background: "var(--bg-surface-elevated)", border: "1px solid var(--border-subtle)", padding: "16px 28px", borderRadius: "12px", marginTop: "16px" }}>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Average Readiness Score</div>
              <div style={{ fontSize: "2.8rem", fontWeight: "900", color: totalScore >= 7 ? "#34d399" : "#fbbf24" }}>
                {totalScore} / 10
              </div>
              <div style={{ fontSize: "0.85rem", color: totalScore >= 7 ? "#34d399" : "#fbbf24", fontWeight: "600" }}>
                {totalScore >= 7 ? "Cleared for Official Consular Appointment" : "Review Recommended Model Answers Below"}
              </div>
            </div>
          </div>

          <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#ffffff", marginBottom: "16px" }}>
            Transcript Breakdown
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "28px" }}>
            {completedInterviews.map((item, idx) => (
              <div key={idx} style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid var(--border-subtle)", borderRadius: "10px", padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#93c5fd" }}>
                    Q{idx + 1}: {item.question}
                  </span>
                  <span className={item.evaluation?.score >= 7 ? "badge badge-safe" : "badge badge-danger"}>
                    {item.evaluation?.score}/10
                  </span>
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "8px" }}>
                  <strong>Your Answer:</strong> "{item.answer}"
                </div>
                <div style={{ fontSize: "0.82rem", color: "#34d399", background: "rgba(16, 185, 129, 0.08)", padding: "8px 12px", borderRadius: "6px" }}>
                  <strong>Model Answer:</strong> {item.evaluation?.modelAnswer}
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center" }}>
            <button
              onClick={() => startSession(country)}
              className="btn btn-secondary"
              style={{ padding: "10px 20px" }}
            >
              <RotateCcw size={16} />
              Restart Practice Session
            </button>
          </div>
        </div>
      ) : (
        /* Active Question Screen */
        <div style={{ maxWidth: "850px", margin: "0 auto" }}>
          
          {/* Top Bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span className="badge badge-target">
                {session.officerTitle}
              </span>
              <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                Question {questionIndex + 1} of {session.totalQuestions || 3}
              </span>
            </div>

            <button 
              onClick={() => setSession(null)} 
              className="btn btn-secondary" 
              style={{ padding: "4px 10px", fontSize: "0.75rem" }}
            >
              Exit Mock
            </button>
          </div>

          {/* Consular Question Card */}
          <div className="glass-panel" style={{ padding: "28px", marginBottom: "20px" }}>
            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <div style={{ 
                width: "48px", 
                height: "48px", 
                borderRadius: "12px", 
                background: "linear-gradient(135deg, #1e3a8a, #2563eb)", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                flexShrink: 0
              }}>
                <Bot color="#ffffff" size={26} />
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.76rem", color: "#60a5fa", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
                  Officer Question
                </div>
                <h2 style={{ fontSize: "1.3rem", fontWeight: "800", color: "#ffffff", lineHeight: 1.4 }}>
                  "{currentQuestion?.question}"
                </h2>
                {currentQuestion?.intent && (
                  <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "6px" }}>
                    🔍 <em>Intent: {currentQuestion.intent}</em>
                  </div>
                )}
              </div>
            </div>

            {currentQuestion?.tip && (
              <div style={{ marginTop: "16px", padding: "10px 14px", background: "rgba(255, 255, 255, 0.03)", borderRadius: "8px", border: "1px solid var(--border-subtle)", fontSize: "0.8rem", color: "#fbbf24" }}>
                💡 <strong>Officer Tip:</strong> {currentQuestion.tip}
              </div>
            )}
          </div>

          {/* User Answer Card */}
          <div className="glass-panel" style={{ padding: "24px", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <User size={18} color="#38bdf8" />
              <label style={{ fontSize: "0.9rem", fontWeight: "700", color: "#ffffff" }}>
                Your Spoken Answer
              </label>
            </div>

            <textarea
              rows={4}
              disabled={isEvaluating || evalResult !== null}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="State your answer as you would speak directly to the visa officer..."
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "10px",
                background: "var(--bg-surface-elevated)",
                border: "1px solid var(--border-subtle)",
                color: "#ffffff",
                fontSize: "0.92rem",
                lineHeight: 1.5,
                outline: "none",
                marginBottom: "14px"
              }}
            />

            {evalResult === null ? (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  Aim for clarity, concrete numbers, and strong home ties.
                </span>
                <button
                  type="button"
                  disabled={isEvaluating || !userAnswer.trim()}
                  onClick={handleEvaluate}
                  className="btn btn-primary"
                  style={{ padding: "10px 22px", fontSize: "0.92rem", fontWeight: "700" }}
                >
                  {isEvaluating ? "Officer is Evaluating..." : "Submit Answer to Officer"}
                </button>
              </div>
            ) : null}
          </div>

          {/* Feedback Card */}
          {evalResult && evalResult.evaluation && (
            <div className="glass-panel" style={{ padding: "24px", borderLeft: evalResult.evaluation.score >= 7 ? "4px solid #10b981" : "4px solid #f43f5e", marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Assessment</span>
                  <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "#ffffff" }}>
                    Risk: <span style={{ color: evalResult.evaluation.score >= 7 ? "#34d399" : "#fb7185" }}>{evalResult.evaluation.riskRating}</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "1.8rem", fontWeight: "900", color: evalResult.evaluation.score >= 7 ? "#34d399" : "#fb7185" }}>
                    {evalResult.evaluation.score} / 10
                  </div>
                </div>
              </div>

              {/* Strengths */}
              {evalResult.evaluation.strengthsIdentified && evalResult.evaluation.strengthsIdentified.length > 0 && (
                <div style={{ marginBottom: "12px" }}>
                  <div style={{ fontSize: "0.78rem", color: "#34d399", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                    <CheckCircle2 size={14} /> Strengths:
                  </div>
                  <ul style={{ fontSize: "0.82rem", color: "var(--text-secondary)", paddingLeft: "20px", margin: 0 }}>
                    {evalResult.evaluation.strengthsIdentified.map((str, i) => (
                      <li key={i}>{str}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Red Flags */}
              {evalResult.evaluation.redFlagsDetected && evalResult.evaluation.redFlagsDetected.length > 0 && (
                <div style={{ marginBottom: "14px" }}>
                  <div style={{ fontSize: "0.78rem", color: "#fb7185", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                    <AlertTriangle size={14} /> Refusal Risks:
                  </div>
                  <ul style={{ fontSize: "0.82rem", color: "#fb7185", paddingLeft: "20px", margin: 0 }}>
                    {evalResult.evaluation.redFlagsDetected.map((risk, i) => (
                      <li key={i}>{risk}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Feedback paragraph */}
              <p style={{ fontSize: "0.86rem", color: "var(--text-primary)", background: "rgba(0, 0, 0, 0.2)", padding: "10px 14px", borderRadius: "8px", marginBottom: "14px" }}>
                💬 {evalResult.evaluation.feedback}
              </p>

              {/* Model Answer */}
              {evalResult.evaluation.modelAnswer && (
                <div style={{ background: "rgba(37, 99, 235, 0.1)", border: "1px solid rgba(59, 130, 246, 0.3)", borderRadius: "8px", padding: "14px", marginBottom: "18px" }}>
                  <div style={{ fontSize: "0.78rem", color: "#93c5fd", fontWeight: "700", marginBottom: "4px" }}>
                    ✨ Recommended Model Answer:
                  </div>
                  <div style={{ fontSize: "0.88rem", color: "#ffffff", fontStyle: "italic", lineHeight: 1.5 }}>
                    "{evalResult.evaluation.modelAnswer}"
                  </div>
                </div>
              )}

              {/* Advance Button */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="btn btn-primary"
                  style={{ padding: "10px 24px", fontSize: "0.92rem", fontWeight: "700" }}
                >
                  {evalResult.isInterviewComplete || !evalResult.nextQuestion ? (
                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      View Final Score Report <Award size={16} />
                    </span>
                  ) : (
                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      Next Question <ArrowRight size={16} />
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
