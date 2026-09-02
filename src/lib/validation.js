const VALID_FOCUSES = ["frontend", "backend", "fullstack"];
const VALID_FRONTEND_FRAMEWORKS = ["react", "angular", "vue"];
const VALID_BACKEND_FRAMEWORKS = ["node", "dotnet", "php", "python", "java"];
const VALID_AGE_RANGES = ["under18", "18-24", "25-34", "35-44", "45+"];
const VALID_EDUCATION = ["graduate", "student"];
const VALID_EMPLOYMENT = ["employed", "freelancer", "unemployed"];

export function validateResponse(body) {
  const errors = [];

  if (!VALID_FOCUSES.includes(body.focus)) {
    errors.push("Invalid focus value");
  }

  if (body.focus === "frontend" || body.focus === "fullstack") {
    if (!VALID_FRONTEND_FRAMEWORKS.includes(body.frontendFramework)) {
      errors.push("Invalid frontend framework");
    }
  } else {
    if (body.frontendFramework) {
      errors.push("Frontend framework not allowed for backend focus");
    }
  }

  if (body.focus === "backend" || body.focus === "fullstack") {
    if (!VALID_BACKEND_FRAMEWORKS.includes(body.backendFramework)) {
      errors.push("Invalid backend framework");
    }
  } else {
    if (body.backendFramework) {
      errors.push("Backend framework not allowed for frontend focus");
    }
  }

  if (!VALID_AGE_RANGES.includes(body.ageRange)) {
    errors.push("Invalid age range");
  }

  if (!VALID_EDUCATION.includes(body.education)) {
    errors.push("Invalid education");
  }

  if (!VALID_EMPLOYMENT.includes(body.employment)) {
    errors.push("Invalid employment");
  }

  return errors;
}

export function buildResponseDoc(body, anonymousId) {
  const doc = {
    anonymousId,
    focus: body.focus,
    frontendFramework: null,
    backendFramework: null,
    ageRange: body.ageRange,
    education: body.education,
    employment: body.employment,
  };

  if (body.focus === "frontend" || body.focus === "fullstack") {
    doc.frontendFramework = body.frontendFramework;
  }
  if (body.focus === "backend" || body.focus === "fullstack") {
    doc.backendFramework = body.backendFramework;
  }

  return doc;
}
