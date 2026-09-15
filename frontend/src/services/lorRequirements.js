/**
 * Letter of Recommendation (LOR) & Document Requirements Engine
 * Handles schema validation, badge formatting, upload channel tooltips,
 * and multi-stage status progress tracking ("Professor Contacted" ➔ "Drafting" ➔ "Submitted/Uploaded").
 */

export const LOR_STATUSES = {
  NOT_CONTACTED: "Not Contacted",
  PROFESSOR_CONTACTED: "Professor Contacted",
  DRAFTING: "Drafting",
  SUBMITTED: "Submitted/Uploaded"
};

export const LOR_STATUS_ORDER = [
  LOR_STATUSES.PROFESSOR_CONTACTED,
  LOR_STATUSES.DRAFTING,
  LOR_STATUSES.SUBMITTED
];

/**
 * Normalizes and guarantees valid Application_Documents for any university
 */
export function getLORRequirements(university) {
  if (!university) {
    return {
      LOR_Requirement: "Mandatory",
      LOR_Count: 2,
      LOR_Type: ["Academic"],
      LOR_Format: "Free-form PDF",
      LOR_Instructions: "Letters must be on official letterhead signed and stamped by the referee.",
      SOP_Required: true,
      CV_Resume_Required: true,
      Transcripts_Required: true,
      APS_Certificate_Required: false
    };
  }

  const docs = university.Application_Documents;
  if (docs && typeof docs === "object" && docs.LOR_Requirement) {
    return {
      LOR_Requirement: docs.LOR_Requirement,
      LOR_Count: typeof docs.LOR_Count === "number" ? docs.LOR_Count : (docs.LOR_Requirement === "Not Required" ? 0 : 2),
      LOR_Type: Array.isArray(docs.LOR_Type) && docs.LOR_Type.length > 0 ? docs.LOR_Type : ["Academic"],
      LOR_Format: docs.LOR_Format || "Free-form PDF",
      LOR_Instructions: docs.LOR_Instructions || (docs.LOR_Format?.includes("Portal") 
        ? "Referees will receive a secure portal link sent directly to their official institutional email."
        : "Free-form PDF on official institutional letterhead, signed and stamped."),
      SOP_Required: docs.SOP_Required !== false,
      CV_Resume_Required: docs.CV_Resume_Required !== false,
      Transcripts_Required: docs.Transcripts_Required !== false,
      APS_Certificate_Required: university.apsRequired || docs.APS_Certificate_Required || false
    };
  }

  // Fallback if missing in raw object
  const country = (university.country || "").trim();
  const id = (university.id || "").toLowerCase();

  if (country === "USA" || country === "Canada") {
    return {
      LOR_Requirement: "Mandatory",
      LOR_Count: 3,
      LOR_Type: ["Academic", "Professional"],
      LOR_Format: "University Specific Portal Link",
      LOR_Instructions: "Referees receive an automated secure direct upload link to submit confidential appraisals.",
      SOP_Required: true,
      CV_Resume_Required: true,
      Transcripts_Required: true,
      APS_Certificate_Required: false
    };
  }

  if (country === "UK" || country === "United Kingdom" || country === "Ireland" || country === "Australia" || country === "New Zealand" || country === "Netherlands" || country === "Switzerland") {
    return {
      LOR_Requirement: "Mandatory",
      LOR_Count: 2,
      LOR_Type: ["Academic"],
      LOR_Format: "University Specific Portal Link",
      LOR_Instructions: "Referees will receive an electronic evaluation link sent directly to their official university email.",
      SOP_Required: true,
      CV_Resume_Required: true,
      Transcripts_Required: true,
      APS_Certificate_Required: false
    };
  }

  const isGerman = country === "Germany";
  const isTopTU9 = isGerman && (id.includes("tum") || id.includes("rwth") || id.includes("berlin") || id.includes("kit") || id.includes("stuttgart") || id.includes("darmstadt"));

  return {
    LOR_Requirement: isGerman ? (isTopTU9 ? "Mandatory" : "Optional") : "Mandatory",
    LOR_Count: isGerman ? (isTopTU9 ? 2 : 1) : 2,
    LOR_Type: ["Academic"],
    LOR_Format: id.includes("tum") ? "University Specific Portal Link" : "Free-form PDF",
    LOR_Instructions: id.includes("tum")
      ? "Referees will receive an automated invitation link from the TUMonline application portal."
      : "Free-form PDF printed on official institutional letterhead, signed and stamped with university seal.",
    SOP_Required: true,
    CV_Resume_Required: true,
    Transcripts_Required: true,
    APS_Certificate_Required: isGerman
  };
}

/**
 * Returns badge styling and text for high-visibility LOR indicators
 */
export function getLORBadge(university) {
  const reqs = getLORRequirements(university);
  const count = reqs.LOR_Count || 0;
  const types = reqs.LOR_Type?.join(" / ") || "Academic";

  if (reqs.LOR_Requirement === "Mandatory") {
    return {
      text: `⚠️ ${count} ${types} LOR${count > 1 ? "s" : ""} Required`,
      isRequired: true,
      isOptional: false,
      count,
      format: reqs.LOR_Format,
      badgeColor: "#000000",
      badgeBg: "#FFD700", // Bold yellow accent as explicitly requested
      badgeBorder: "#EAB308",
      shortText: `${count} LORs Req.`
    };
  }

  if (reqs.LOR_Requirement === "Optional") {
    return {
      text: `📄 Optional: ${count > 0 ? `${count} ` : ""}${types} LOR`,
      isRequired: false,
      isOptional: true,
      count,
      format: reqs.LOR_Format,
      badgeColor: "#D97706",
      badgeBg: "rgba(254, 240, 138, 0.25)",
      badgeBorder: "rgba(245, 158, 11, 0.4)",
      shortText: "LOR Optional"
    };
  }

  return {
    text: "✅ No LOR Required",
    isRequired: false,
    isOptional: false,
    count: 0,
    format: "Not Applicable",
    badgeColor: "#059669",
    badgeBg: "rgba(16, 185, 129, 0.12)",
    badgeBorder: "rgba(16, 185, 129, 0.3)",
    shortText: "No LOR"
  };
}

/**
 * Tooltip describing whether professors upload directly via a portal link
 * or if student uploads a PDF
 */
export function getLORTooltipText(university) {
  const reqs = getLORRequirements(university);
  const isPortal = reqs.LOR_Format?.toLowerCase().includes("portal");

  if (isPortal) {
    return {
      title: "University Specific Portal Link (Direct Referee Upload)",
      description: "You submit referee details (name, designation, and official institutional email) in the university admissions portal. The university will automatically email a confidential recommendation link directly to your professor to complete and upload.",
      icon: "portal",
      actionHint: "Referees must have an active official .edu or institutional email address."
    };
  }

  return {
    title: "Free-form PDF (Student Direct Upload)",
    description: "Your professor prints the recommendation letter on official university letterhead, stamps it with the institutional seal, and signs it. You scan and upload the high-resolution PDF dossier directly to your application profile.",
    icon: "pdf",
    actionHint: "Ensure the letter contains professor designation, phone number, and official seal."
  };
}

const STORAGE_KEY = "global_punjab_lor_checklist_v1";

/**
 * Loads persisted LOR checklist status map from localStorage
 */
export function loadLORChecklistState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (e) {
    console.error("Failed to load LOR checklist state:", e);
    return {};
  }
}

/**
 * Persists LOR checklist status map to localStorage
 */
export function saveLORChecklistState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save LOR checklist state:", e);
  }
}

/**
 * Generates full document tasks list including individual LOR tasks for a university
 */
export function generateApplicationTasks(university, storedState = {}) {
  const uniId = university.id || university.name;
  const reqs = getLORRequirements(university);
  const uniState = storedState[uniId] || {};

  const tasks = [];

  // 1. Dynamic LOR Tasks (1 to LOR_Count)
  if (reqs.LOR_Requirement !== "Not Required" && reqs.LOR_Count > 0) {
    for (let i = 1; i <= reqs.LOR_Count; i++) {
      const taskId = `lor_${uniId}_${i}`;
      const lorType = reqs.LOR_Type?.[i - 1] || reqs.LOR_Type?.[0] || "Academic";
      const currentStatus = uniState[taskId]?.status || LOR_STATUSES.NOT_CONTACTED;
      const professorName = uniState[taskId]?.professorName || "";

      tasks.push({
        id: taskId,
        uniId,
        uniName: university.name,
        type: "LOR",
        lorNumber: i,
        lorType,
        format: reqs.LOR_Format,
        title: `LOR #${i}: ${lorType} Recommendation Letter`,
        subtitle: reqs.LOR_Format === "University Specific Portal Link" 
          ? "Upload via automated referee portal link" 
          : "Free-form signed PDF on letterhead",
        instructions: reqs.LOR_Instructions,
        status: currentStatus,
        professorName,
        completed: currentStatus === LOR_STATUSES.SUBMITTED,
        isMandatory: reqs.LOR_Requirement === "Mandatory"
      });
    }
  }

  // 2. Statement of Purpose (SOP)
  const sopId = `sop_${uniId}`;
  const sopStatus = uniState[sopId]?.completed || false;
  tasks.push({
    id: sopId,
    uniId,
    uniName: university.name,
    type: "SOP",
    title: "Statement of Purpose / Letter of Motivation",
    subtitle: "Course-tailored academic essay aligned with curriculum",
    completed: Boolean(sopStatus),
    isMandatory: reqs.SOP_Required
  });

  // 3. Official Academic Transcripts & Degree
  const transcriptsId = `transcripts_${uniId}`;
  const transcriptsStatus = uniState[transcriptsId]?.completed || false;
  tasks.push({
    id: transcriptsId,
    uniId,
    uniName: university.name,
    type: "TRANSCRIPTS",
    title: "Consolidated & Semester-wise Transcripts",
    subtitle: "English translation with university registrar seal",
    completed: Boolean(transcriptsStatus),
    isMandatory: reqs.Transcripts_Required
  });

  // 4. CV / Academic Resume
  const cvId = `cv_${uniId}`;
  const cvStatus = uniState[cvId]?.completed || false;
  tasks.push({
    id: cvId,
    uniId,
    uniName: university.name,
    type: "CV",
    title: "Europass / Standard Academic CV",
    subtitle: "Reverse-chronological educational and project history",
    completed: Boolean(cvStatus),
    isMandatory: reqs.CV_Resume_Required
  });

  // 5. APS Certificate (for Germany)
  if (reqs.APS_Certificate_Required) {
    const apsId = `aps_${uniId}`;
    const apsStatus = uniState[apsId]?.completed || false;
    tasks.push({
      id: apsId,
      uniId,
      uniName: university.name,
      type: "APS",
      title: "APS India Certificate Verification",
      subtitle: "Mandatory verification for German student visa & university enrollment",
      completed: Boolean(apsStatus),
      isMandatory: true
    });
  }

  // Calculate master progress percentage (0 - 100)
  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return {
    tasks,
    completedCount,
    totalCount: tasks.length,
    progressPercent
  };
}
