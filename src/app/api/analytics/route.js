import { NextResponse } from "next/server";
import { getResponsesCollection } from "@/lib/mongodb";

const FOCUS_LABELS = { frontend: "Frontend", backend: "Backend", fullstack: "Full-stack" };
const FE_LABELS = { react: "React", angular: "Angular", vue: "Vue" };
const BE_LABELS = { node: "Node.js", dotnet: ".NET", php: "PHP", python: "Python", java: "Java" };
const AGE_LABELS = { under18: "Under 18", "18-24": "18-24", "25-34": "25-34", "35-44": "35-44", "45+": "45+" };
const EDU_LABELS = { graduate: "Graduate", student: "Student" };
const EMP_LABELS = { employed: "Employed", freelancer: "Freelancer", unemployed: "Unemployed" };

function countByField(docs, field, labels) {
  const counts = {};
  for (const key of Object.keys(labels)) {
    counts[key] = 0;
  }
  for (const doc of docs) {
    const val = doc[field];
    if (val && counts[val] !== undefined) {
      counts[val]++;
    }
  }
  const total = docs.length || 1;
  return Object.entries(counts).map(([key, count]) => ({
    key,
    label: labels[key],
    count,
    percentage: Math.round((count / total) * 1000) / 10,
  }));
}

function buildCrossAnalytics(docs) {
  const results = [];

  // Framework x Employment
  const frameworkEmp = {};
  for (const doc of docs) {
    const fw = doc.frontendFramework || doc.backendFramework;
    const emp = doc.employment;
    if (fw && emp) {
      const key = `${fw}|${emp}`;
      frameworkEmp[key] = (frameworkEmp[key] || 0) + 1;
    }
  }
  if (Object.keys(frameworkEmp).length > 0) {
    const rows = [];
    const frameworks = [...new Set(docs.map((d) => d.frontendFramework || d.backendFramework).filter(Boolean))];
    const employments = Object.keys(EMP_LABELS);
    for (const fw of frameworks) {
      const row = { framework: fw };
      for (const emp of employments) {
        row[emp] = frameworkEmp[`${fw}|${emp}`] || 0;
      }
      rows.push(row);
    }
    results.push({
      title: "Framework × Employment",
      type: "cross",
      rows,
      columns: employments.map((e) => ({ key: e, label: EMP_LABELS[e] })),
    });
  }

  // Focus x Education
  const focusEdu = {};
  for (const doc of docs) {
    const key = `${doc.focus}|${doc.education}`;
    focusEdu[key] = (focusEdu[key] || 0) + 1;
  }
  if (Object.keys(focusEdu).length > 0) {
    const rows = [];
    for (const focus of Object.keys(FOCUS_LABELS)) {
      const row = { focus: FOCUS_LABELS[focus] };
      for (const edu of Object.keys(EDU_LABELS)) {
        row[edu] = focusEdu[`${focus}|${edu}`] || 0;
      }
      rows.push(row);
    }
    results.push({
      title: "Development Focus × Education",
      type: "cross",
      rows,
      columns: Object.keys(EDU_LABELS).map((e) => ({ key: e, label: EDU_LABELS[e] })),
    });
  }

  // Age x Employment
  const ageEmp = {};
  for (const doc of docs) {
    const key = `${doc.ageRange}|${doc.employment}`;
    ageEmp[key] = (ageEmp[key] || 0) + 1;
  }
  if (Object.keys(ageEmp).length > 0) {
    const rows = [];
    for (const age of Object.keys(AGE_LABELS)) {
      const row = { age: AGE_LABELS[age] };
      for (const emp of Object.keys(EMP_LABELS)) {
        row[emp] = ageEmp[`${age}|${emp}`] || 0;
      }
      rows.push(row);
    }
    results.push({
      title: "Age × Employment",
      type: "cross",
      rows,
      columns: Object.keys(EMP_LABELS).map((e) => ({ key: e, label: EMP_LABELS[e] })),
    });
  }

  // Framework x Age
  const frameworkAge = {};
  for (const doc of docs) {
    const fw = doc.frontendFramework || doc.backendFramework;
    const age = doc.ageRange;
    if (fw && age) {
      const key = `${fw}|${age}`;
      frameworkAge[key] = (frameworkAge[key] || 0) + 1;
    }
  }
  if (Object.keys(frameworkAge).length > 0) {
    const rows = [];
    const frameworks = [...new Set(docs.map((d) => d.frontendFramework || d.backendFramework).filter(Boolean))];
    for (const fw of frameworks) {
      const row = { framework: fw };
      for (const age of Object.keys(AGE_LABELS)) {
        row[age] = frameworkAge[`${fw}|${age}`] || 0;
      }
      rows.push(row);
    }
    results.push({
      title: "Framework × Age",
      type: "cross",
      rows,
      columns: Object.keys(AGE_LABELS).map((a) => ({ key: a, label: AGE_LABELS[a] })),
    });
  }

  return results;
}

function buildFindings(docs) {
  const findings = [];
  if (docs.length === 0) return findings;

  // Most popular frontend framework
  const feCounts = {};
  for (const doc of docs) {
    if (doc.frontendFramework) {
      feCounts[doc.frontendFramework] = (feCounts[doc.frontendFramework] || 0) + 1;
    }
  }
  if (Object.keys(feCounts).length > 0) {
    const top = Object.entries(feCounts).sort((a, b) => b[1] - a[1])[0];
    findings.push({
      text: `Among current participants, ${FE_LABELS[top[0]]} is the most selected frontend framework with ${top[1]} responses.`,
    });
  }

  // Most popular backend framework
  const beCounts = {};
  for (const doc of docs) {
    if (doc.backendFramework) {
      beCounts[doc.backendFramework] = (beCounts[doc.backendFramework] || 0) + 1;
    }
  }
  if (Object.keys(beCounts).length > 0) {
    const top = Object.entries(beCounts).sort((a, b) => b[1] - a[1])[0];
    findings.push({
      text: `Among current participants, ${BE_LABELS[top[0]]} is the most selected backend framework with ${top[1]} responses.`,
    });
  }

  // Largest age group
  const ageCounts = {};
  for (const doc of docs) {
    ageCounts[doc.ageRange] = (ageCounts[doc.ageRange] || 0) + 1;
  }
  if (Object.keys(ageCounts).length > 0) {
    const top = Object.entries(ageCounts).sort((a, b) => b[1] - a[1])[0];
    findings.push({
      text: `The largest age group among participants is ${AGE_LABELS[top[0]]} with ${top[1]} responses.`,
    });
  }

  // Largest employment category
  const empCounts = {};
  for (const doc of docs) {
    empCounts[doc.employment] = (empCounts[doc.employment] || 0) + 1;
  }
  if (Object.keys(empCounts).length > 0) {
    const top = Object.entries(empCounts).sort((a, b) => b[1] - a[1])[0];
    findings.push({
      text: `The largest employment category is ${EMP_LABELS[top[0]]} with ${top[1]} responses.`,
    });
  }

  // Framework + employment relationship
  if (Object.keys(feCounts).length > 0 && Object.keys(empCounts).length > 0) {
    const topFe = Object.entries(feCounts).sort((a, b) => b[1] - a[1])[0];
    const topEmp = Object.entries(empCounts).sort((a, b) => b[1] - a[1])[0];
    findings.push({
      text: `Among current participants, the most common combination is ${FE_LABELS[topFe[0]]} + ${EMP_LABELS[topEmp[0]]}.`,
    });
  }

  return findings;
}

export async function GET() {
  try {
    const col = await getResponsesCollection();
    const docs = await col.find({}, { projection: { _id: 0, anonymousId: 0 } }).toArray();

    const total = docs.length;

    const analytics = {
      total,
      focus: countByField(docs, "focus", FOCUS_LABELS),
      frontendFramework: countByField(docs, "frontendFramework", FE_LABELS),
      backendFramework: countByField(docs, "backendFramework", BE_LABELS),
      ageRange: countByField(docs, "ageRange", AGE_LABELS),
      education: countByField(docs, "education", EDU_LABELS),
      employment: countByField(docs, "employment", EMP_LABELS),
      crossAnalytics: buildCrossAnalytics(docs),
      findings: buildFindings(docs),
    };

    return NextResponse.json(analytics);
  } catch (err) {
    console.error("GET /api/analytics error:", err);
    return NextResponse.json(
      { error: "Failed to load analytics" },
      { status: 500 }
    );
  }
}
