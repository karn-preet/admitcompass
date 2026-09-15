/**
 * Global ਪੰਜਾਬ API Client
 */

const BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL.replace(/\/+$/, '')}/api` 
  : "/api";

export async function evaluateProfile(payload) {
  const response = await fetch(`${BASE_URL}/evaluate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error ${response.status}`);
  }
  return response.json();
}

export async function fetchUniversities(filters = {}) {
  const params = new URLSearchParams();
  if (filters.country) params.append("country", filters.country);
  if (filters.degree) params.append("degree", filters.degree);
  if (filters.field) params.append("field", filters.field);

  const response = await fetch(`${BASE_URL}/universities?${params.toString()}`);
  if (!response.ok) throw new Error("Failed to fetch universities");
  return response.json();
}

export async function fetchVisaRules(country = "") {
  const url = country ? `${BASE_URL}/visa-rules/${country}` : `${BASE_URL}/visa-rules`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch visa rules");
  return response.json();
}

export async function fetchOfficialCitations() {
  const response = await fetch(`${BASE_URL}/scrape/citations`);
  if (!response.ok) throw new Error("Failed to fetch citations");
  return response.json();
}

export async function fetchOfficialPortals() {
  const response = await fetch(`${BASE_URL}/scrape/portals`);
  if (!response.ok) throw new Error("Failed to fetch portals");
  return response.json();
}

export async function searchPublicPrograms(payload = {}) {
  const response = await fetch(`${BASE_URL}/scrape/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error("Failed to search public programs");
  return response.json();
}

export async function verifyLivePortalUrl(url) {
  const response = await fetch(`${BASE_URL}/scrape/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url })
  });
  if (!response.ok) throw new Error("Live portal verification failed");
  return response.json();
}

// --- RateMyChances ---
export async function calculateRateMyChances(payload) {
  const response = await fetch(`${BASE_URL}/rate-my-chances`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to calculate admission odds");
  }
  return response.json();
}

// --- Admits & Rejects Decisions ---
export async function fetchDecisions(filters = {}) {
  const params = new URLSearchParams();
  if (filters.country) params.append("country", filters.country);
  if (filters.degree) params.append("degree", filters.degree);
  if (filters.status) params.append("status", filters.status);
  if (filters.search) params.append("search", filters.search);

  const response = await fetch(`${BASE_URL}/decisions?${params.toString()}`);
  if (!response.ok) throw new Error("Failed to fetch decisions");
  return response.json();
}

export async function submitDecision(payload) {
  const response = await fetch(`${BASE_URL}/decisions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to submit decision");
  }
  return response.json();
}

// --- AI Visa Mock Interview ---
export async function startVisaMock(country = "USA") {
  const response = await fetch(`${BASE_URL}/visa-mock/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ country })
  });
  if (!response.ok) throw new Error("Failed to start visa mock session");
  return response.json();
}

export async function evaluateVisaMockAnswer(payload) {
  const response = await fetch(`${BASE_URL}/visa-mock/evaluate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error("Failed to evaluate visa mock response");
  return response.json();
}

// --- AI SOP Studio ---
export async function generateSOP(inputs) {
  const response = await fetch(`${BASE_URL}/sop/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(inputs)
  });
  if (!response.ok) throw new Error("Failed to generate Statement of Purpose");
  return response.json();
}

export async function reviewSOP(text) {
  const response = await fetch(`${BASE_URL}/sop/review`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to review Statement of Purpose");
  }
  return response.json();
}

// --- Scholarships ---
export async function fetchScholarships(filters = {}) {
  const params = new URLSearchParams();
  if (filters.country) params.append("country", filters.country);
  if (filters.degree) params.append("degree", filters.degree);
  if (filters.search) params.append("search", filters.search);

  const response = await fetch(`${BASE_URL}/scholarships?${params.toString()}`);
  if (!response.ok) throw new Error("Failed to fetch scholarships");
  return response.json();
}

// --- Loans & EMI ---
export async function fetchLoanProviders() {
  const response = await fetch(`${BASE_URL}/loans/providers`);
  if (!response.ok) throw new Error("Failed to fetch loan providers");
  return response.json();
}

export async function calculateLoanEMI(payload) {
  const response = await fetch(`${BASE_URL}/loans/calculate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error("Failed to calculate loan EMI");
  return response.json();
}

// --- Community Discussions ---
export async function fetchDiscussions(filters = {}) {
  const params = new URLSearchParams();
  if (filters.category) params.append("category", filters.category);
  if (filters.search) params.append("search", filters.search);

  const response = await fetch(`${BASE_URL}/discussions?${params.toString()}`);
  if (!response.ok) throw new Error("Failed to fetch discussions");
  return response.json();
}

export async function submitDiscussion(payload) {
  const response = await fetch(`${BASE_URL}/discussions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to submit discussion");
  }
  return response.json();
}

export async function upvoteDiscussion(id) {
  const response = await fetch(`${BASE_URL}/discussions/${id}/upvote`, {
    method: "POST"
  });
  if (!response.ok) throw new Error("Failed to upvote thread");
  return response.json();
}

// --- Application Cart & Pre-Admission Sunk Cost Engine ---
export async function calculateApplicationCart(payload) {
  const response = await fetch(`${BASE_URL}/application-cart/calculate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to calculate application cart budget");
  }
  return response.json();
}

export async function fetchUniversityCostBreakdown(universityId, originCountry = "India") {
  const response = await fetch(`${BASE_URL}/application-cart/university-cost/${universityId}?originCountry=${encodeURIComponent(originCountry)}`);
  if (!response.ok) throw new Error("Failed to fetch university cost breakdown");
  return response.json();
}

export async function analyzeFeeKeywords(payload) {
  const response = await fetch(`${BASE_URL}/scrape/analyze-fees`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error("Failed to analyze fee keywords");
  return response.json();
}

// --- Student Life & Housing Map Engine ---
export async function fetchUniversityHousing(universityId, filters = {}) {
  const params = new URLSearchParams();
  if (filters.housingTypes && filters.housingTypes.length > 0) {
    params.append("housingTypes", filters.housingTypes.join(","));
  }
  if (filters.maxBudget) {
    params.append("maxBudget", filters.maxBudget);
  }
  if (filters.commuteRadiusMode) {
    params.append("commuteRadiusMode", filters.commuteRadiusMode);
  }
  if (filters.officialDormsOnly) {
    params.append("officialDormsOnly", "true");
  }
  if (filters.amenityCategories && filters.amenityCategories.length > 0) {
    params.append("amenityCategories", filters.amenityCategories.join(","));
  }

  const queryStr = params.toString() ? `?${params.toString()}` : "";
  const response = await fetch(`${BASE_URL}/housing/university/${encodeURIComponent(universityId)}${queryStr}`);
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to fetch university campus ecosystem");
  }
  return response.json();
}

export async function filterUniversityHousing(payload) {
  const response = await fetch(`${BASE_URL}/housing/filter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to filter housing options");
  }
  return response.json();
}

export async function fetchHousingProviders() {
  const response = await fetch(`${BASE_URL}/housing/providers`);
  if (!response.ok) throw new Error("Failed to fetch official housing providers");
  return response.json();
}

export async function scrapeHousingPortal(payload) {
  const response = await fetch(`${BASE_URL}/housing/scrape`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error("Failed to verify housing portal");
  return response.json();
}


